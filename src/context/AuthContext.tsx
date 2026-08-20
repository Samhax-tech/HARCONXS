import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  supabase,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  supabaseSignInWithGoogle,
  supabaseResetPasswordForEmail,
  supabaseUpdatePassword,
  supabaseResendVerification
} from '../lib/supabase';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'support_agent'
  | 'fulfillment_specialist'
  | 'marketing_lead'
  | 'financial_controller'
  | 'customer'
  | 'anon';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; message: string; error?: any }>;
  adminLogin: (identifier: string, password: string) => Promise<{ success: boolean; message: string; error?: any }>;
  register: (
    email: string,
    password: string,
    metadata?: { full_name?: string; phone?: string }
  ) => Promise<{ success: boolean; message: string; error?: any }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  loginWithOtp: (phone: string) => Promise<{ success: boolean; message?: string; error?: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ success: boolean; message?: string; error?: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error: Error | null }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('anon');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  /**
   * Resolve user role strictly from database/server profile,
   * JWT app_metadata, or user_metadata.
   * Defaults strictly to 'customer' if authenticated, or 'anon' if not.
   * NEVER grants admin privileges automatically without verified database/JWT role.
   */
  const resolveUserRole = useCallback(async (authUser: User | null): Promise<{ role: UserRole; isAdmin: boolean }> => {
    if (!authUser) {
      return { role: 'anon', isAdmin: false };
    }

    try {
      // 1. Query Supabase profiles table for assigned role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!error && profile && profile.role) {
        const assignedRole = profile.role as UserRole;
        const adminStatus = ['super_admin', 'admin', 'manager'].includes(assignedRole);
        return { role: assignedRole, isAdmin: adminStatus };
      }

      // 2. Check super_admins table by email
      if (authUser.email) {
        const { data: superAdmin } = await supabase
          .from('super_admins')
          .select('role')
          .ilike('email', authUser.email)
          .maybeSingle();

        if (superAdmin && superAdmin.role) {
          const assignedRole = superAdmin.role as UserRole;
          const adminStatus = ['super_admin', 'admin', 'manager'].includes(assignedRole);
          return { role: assignedRole, isAdmin: adminStatus };
        }
      }

      // 3. Check JWT app_metadata / user_metadata
      const jwtRole = (authUser.app_metadata?.role || authUser.user_metadata?.role) as UserRole | undefined;
      if (jwtRole && ['super_admin', 'admin', 'manager', 'support_agent', 'fulfillment_specialist', 'marketing_lead', 'financial_controller', 'customer'].includes(jwtRole)) {
        const adminStatus = ['super_admin', 'admin', 'manager'].includes(jwtRole);
        return { role: jwtRole, isAdmin: adminStatus };
      }

      // 4. Strict default for any registered customer
      return { role: 'customer', isAdmin: false };
    } catch {
      // On query failure, default safely to customer
      return { role: 'customer', isAdmin: false };
    }
  }, []);

  // Initialize and listen to Supabase Auth state changes
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[AuthContext] Session retrieval notice:', error.message);
        }

        const initialSession = data?.session || null;
        const initialUser = initialSession?.user || null;

        if (isMounted) {
          setSession(initialSession);
          setUser(initialUser);
          if (initialUser) {
            const { role: resolvedRole, isAdmin: resolvedIsAdmin } = await resolveUserRole(initialUser);
            if (isMounted) {
              setRole(resolvedRole);
              setIsAdmin(resolvedIsAdmin);
            }
          } else {
            setRole('anon');
            setIsAdmin(false);
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn('[AuthContext] Error initializing auth:', err);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setRole('anon');
          setIsAdmin(false);
          setLoading(false);
        }
      }
    }

    initAuth();

    // Subscribe to auth state changes from Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      const newUser = newSession?.user || null;
      setSession(newSession);
      setUser(newUser);

      if (newUser) {
        const { role: resolvedRole, isAdmin: resolvedIsAdmin } = await resolveUserRole(newUser);
        if (isMounted) {
          setRole(resolvedRole);
          setIsAdmin(resolvedIsAdmin);
        }
      } else {
        setRole('anon');
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [resolveUserRole]);

  /**
   * Login with Supabase Auth (Sign in with password).
   * Supports email or admin username lookup from public.super_admins.
   */
  const login = async (
    emailOrUsername: string,
    password: string
  ): Promise<{ success: boolean; message: string; error?: any }> => {
    const cleanIdentifier = (emailOrUsername || '').trim();
    const cleanPwd = (password || '').trim();

    if (!cleanIdentifier || !cleanPwd) {
      return { success: false, message: 'Please provide both email/username and password.' };
    }

    try {
      let resolvedEmail = cleanIdentifier;

      // If user enters a username without '@', look up public.super_admins or use verified HARCONXS admin identity
      if (!cleanIdentifier.includes('@')) {
        if (cleanIdentifier.toLowerCase() === 'harconxs') {
          resolvedEmail = 'hamza@harconxs.com';
        } else {
          const { data: admin, error: lookupError } = await supabase
            .from('super_admins')
            .select('email, is_active')
            .ilike('username', cleanIdentifier)
            .maybeSingle();

          if (lookupError) {
            console.warn('[AuthContext] Admin username lookup notice:', lookupError.message);
          }

          if (admin && admin.email) {
            if (admin.is_active === false) {
              return {
                success: false,
                message: 'Account is inactive. Please contact support.'
              };
            }
            resolvedEmail = admin.email;
          }
        }
      }

      const { user: authUser, session: authSession, error } = await supabaseSignIn(resolvedEmail, cleanPwd);

      if (error || !authUser) {
        return {
          success: false,
          message: error?.message || 'Invalid login credentials. Please check your email and password.',
          error
        };
      }

      setSession(authSession);
      setUser(authUser);

      const { role: resolvedRole, isAdmin: resolvedIsAdmin } = await resolveUserRole(authUser);
      setRole(resolvedRole);
      setIsAdmin(resolvedIsAdmin);

      return {
        success: true,
        message: 'Signed in successfully.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Authentication failed. Please try again.',
        error: err
      };
    }
  };

  /**
   * Dedicated Admin Login: Authenticates through Supabase Auth and strictly enforces admin role.
   * If an authenticated user does NOT have an admin role, signs them out and denies access.
   */
  const adminLogin = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string; error?: any }> => {
    const cleanIdentifier = (identifier || '').trim();
    const cleanPwd = (password || '').trim();

    if (!cleanIdentifier || !cleanPwd) {
      return { success: false, message: 'Please provide both administrator identifier and password.' };
    }

    try {
      let resolvedEmail = cleanIdentifier;

      // Resolve username to email if not containing '@'
      if (!cleanIdentifier.includes('@')) {
        if (cleanIdentifier.toLowerCase() === 'harconxs') {
          resolvedEmail = 'hamza@harconxs.com';
        } else {
          const { data: admin, error: lookupError } = await supabase
            .from('super_admins')
            .select('email, is_active')
            .ilike('username', cleanIdentifier)
            .maybeSingle();

          if (lookupError) {
            console.warn('[AuthContext] Super admin lookup notice:', lookupError.message);
          }

          if (admin && admin.email) {
            if (admin.is_active === false) {
              return {
                success: false,
                message: 'Administrator account is inactive. Please contact system owner.'
              };
            }
            resolvedEmail = admin.email;
          }
        }
      }

      const { user: authUser, session: authSession, error } = await supabaseSignIn(resolvedEmail, cleanPwd);

      if (error || !authUser) {
        return {
          success: false,
          message: error?.message || 'Invalid administrator credentials.',
          error
        };
      }

      const { role: resolvedRole, isAdmin: resolvedIsAdmin } = await resolveUserRole(authUser);

      if (!resolvedIsAdmin) {
        // Sign out immediately if not an authorized administrator
        await supabaseSignOut();
        setSession(null);
        setUser(null);
        setRole('anon');
        setIsAdmin(false);

        return {
          success: false,
          message: 'Access Denied: This account does not have administrator privileges.'
        };
      }

      setSession(authSession);
      setUser(authUser);
      setRole(resolvedRole);
      setIsAdmin(true);

      return {
        success: true,
        message: 'Administrator authenticated successfully.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Administrator login failed.',
        error: err
      };
    }
  };

  /**
   * Register with Supabase Auth
   * Automatically assigns role 'customer'. Does NOT grant privileged roles.
   */
  const register = async (
    email: string,
    password: string,
    metadata?: { full_name?: string; phone?: string }
  ): Promise<{ success: boolean; message: string; error?: any }> => {
    const cleanEmail = (email || '').trim();
    const cleanPwd = (password || '').trim();

    if (!cleanEmail || !cleanPwd) {
      return { success: false, message: 'Email and password are required to create an account.' };
    }

    if (cleanPwd.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    try {
      const { user: authUser, session: authSession, error } = await supabaseSignUp(cleanEmail, cleanPwd, {
        full_name: metadata?.full_name?.trim() || cleanEmail.split('@')[0],
        phone: metadata?.phone?.trim() || ''
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Registration failed.',
          error
        };
      }

      if (authUser) {
        setSession(authSession);
        setUser(authUser);
        setRole('customer');
        setIsAdmin(false);

        // Record standard customer profile in Supabase database
        try {
          await supabase.from('profiles').upsert({
            id: authUser.id,
            email: cleanEmail,
            full_name: metadata?.full_name?.trim() || cleanEmail.split('@')[0],
            phone: metadata?.phone?.trim() || '',
            role: 'customer',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        } catch {
          // Ignored if profiles table is not yet migrated
        }
      }

      return {
        success: true,
        message: 'Account created successfully. Please verify your email.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Registration failed.',
        error: err
      };
    }
  };

  /**
   * Sign out and clear all authentication state
   */
  const logout = async (): Promise<void> => {
    try {
      await supabaseSignOut();
    } finally {
      setSession(null);
      setUser(null);
      setRole('anon');
      setIsAdmin(false);
    }
  };

  /**
   * Refresh session and re-verify role
   */
  const refresh = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        const { role: resolvedRole, isAdmin: resolvedIsAdmin } = await resolveUserRole(data.session.user);
        setRole(resolvedRole);
        setIsAdmin(resolvedIsAdmin);
      } else {
        const { data: currentData } = await supabase.auth.getSession();
        setSession(currentData?.session || null);
        setUser(currentData?.session?.user || null);
        if (currentData?.session?.user) {
          const { role: resolvedRole, isAdmin: resolvedIsAdmin } = await resolveUserRole(currentData.session.user);
          setRole(resolvedRole);
          setIsAdmin(resolvedIsAdmin);
        } else {
          setRole('anon');
          setIsAdmin(false);
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Session refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    return supabaseSignInWithGoogle();
  };

  const loginWithOtp = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim() });
      if (error) {
        return { success: false, message: error.message, error };
      }
      return { success: true, message: 'OTP sent to your phone.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to send OTP.', error: err };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.trim(),
        token: token.trim(),
        type: 'sms'
      });
      if (error || !data.user) {
        return { success: false, message: error?.message || 'Invalid or expired OTP.', error };
      }
      return { success: true, message: 'OTP verified successfully.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to verify OTP.', error: err };
    }
  };

  const resetPassword = async (targetEmail: string) => {
    return supabaseResetPasswordForEmail(targetEmail);
  };

  const updatePasswordHandler = async (newPassword: string) => {
    return supabaseUpdatePassword(newPassword);
  };

  const resendVerificationHandler = async (targetEmail: string) => {
    return supabaseResendVerification(targetEmail);
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    role,
    isAdmin,
    login,
    adminLogin,
    register,
    logout,
    refresh,
    loginWithGoogle,
    loginWithOtp,
    verifyOtp,
    resetPassword,
    updatePassword: updatePasswordHandler,
    resendVerification: resendVerificationHandler
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
