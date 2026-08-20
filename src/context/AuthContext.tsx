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
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; error?: any }>;
  register: (
    email: string,
    password: string,
    metadata?: { full_name?: string; phone?: string }
  ) => Promise<{ success: boolean; message: string; error?: any }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
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

      // 2. Check JWT app_metadata / user_metadata
      const jwtRole = (authUser.app_metadata?.role || authUser.user_metadata?.role) as UserRole | undefined;
      if (jwtRole && ['super_admin', 'admin', 'manager', 'support_agent', 'fulfillment_specialist', 'marketing_lead', 'financial_controller', 'customer'].includes(jwtRole)) {
        const adminStatus = ['super_admin', 'admin', 'manager'].includes(jwtRole);
        return { role: jwtRole, isAdmin: adminStatus };
      }

      // 3. Strict default for any registered customer
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
   * Login with Supabase Auth (Sign in with password)
   * If credentials fail, returns { success: false } - NEVER produces success on failure.
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; error?: any }> => {
    const cleanEmail = (email || '').trim();
    const cleanPwd = (password || '').trim();

    if (!cleanEmail || !cleanPwd) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    try {
      const { user: authUser, session: authSession, error } = await supabaseSignIn(cleanEmail, cleanPwd);

      if (error || !authUser) {
        return {
          success: false,
          message: error?.message || 'Invalid email or password. Please check your credentials.',
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
    register,
    logout,
    refresh,
    loginWithGoogle,
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
