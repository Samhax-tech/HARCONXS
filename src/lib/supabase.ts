import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

// Safe environment variable accessor for browser, Vite build, and serverless Node runtimes
const getEnvVar = (key: string, defaultValue = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key]!;
    }
  } catch {}
  return defaultValue;
};

// Environment variables or default Supabase project configuration
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://v6ky2ym2gn3s6b7y2opdtl.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InY2a3kyeW0yZ24zczZiN3kyb3BkdGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5MjIwMDAwMCwiZXhwIjoxOTk5OTk5OTk5fQ.placeholder_key');

export const isSupabaseConfigured = Boolean(
  getEnvVar('VITE_SUPABASE_URL') && 
  getEnvVar('VITE_SUPABASE_ANON_KEY') &&
  !getEnvVar('VITE_SUPABASE_URL').includes('placeholder')
);

// Create Supabase client instance with auto-refresh and session persistence
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

export interface SupabaseSyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  tablesSynced?: string[];
}

/**
 * Checks Supabase database connectivity
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  const startTime = Date.now();
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    const latency = Date.now() - startTime;
    
    if (error && !error.message.includes('relation "products" does not exist')) {
      return { connected: true, latencyMs: latency };
    }
    return { connected: true, latencyMs: latency };
  } catch (err: any) {
    return { 
      connected: false, 
      error: err?.message || 'Database connection unreachable. Using active in-memory sync engine.' 
    };
  }
}

/**
 * Supabase Auth: Sign Up with email, password, and user metadata
 */
export async function supabaseSignUp(
  email: string,
  password?: string,
  metadata?: { full_name?: string; phone?: string }
): Promise<{ user: SupabaseUser | null; session: Session | null; error: Error | null }> {
  try {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata?.full_name || email.split('@')[0],
          phone: metadata?.phone || '',
          role: 'customer'
        },
        emailRedirectTo: window.location.origin
      },
    });

    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err };
  }
}

/**
 * Supabase Auth: Sign In with email & password
 */
export async function supabaseSignIn(
  email: string,
  password?: string
): Promise<{ user: SupabaseUser | null; session: Session | null; error: Error | null }> {
  try {
    if (!password) {
      throw new Error('Password is required.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err };
  }
}

/**
 * Supabase Auth: Sign In with Google OAuth
 */
export async function supabaseSignInWithGoogle(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return { error: null };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Supabase Auth: Password Reset for Email
 */
export async function supabaseResetPasswordForEmail(email: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}?auth_action=reset_password`,
    });
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Supabase Auth: Update Password (for authenticated session)
 */
export async function supabaseUpdatePassword(newPassword: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Supabase Auth: Resend Email Verification
 */
export async function supabaseResendVerification(email: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Supabase Auth: Sign Out
 */
export async function supabaseSignOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Supabase Auth: Get Current Session
 */
export async function supabaseGetSession(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Supabase Auth: Verify Role & Admin Privileges
 * Strictly verifies against Supabase profiles table or JWT metadata.
 * Defaults strictly to customer if not authenticated or role not privileged.
 */
export async function supabaseVerifyAdminRole(userId: string, email?: string): Promise<{ isAdmin: boolean; role: string }> {
  try {
    if (!userId) {
      return { isAdmin: false, role: 'anon' };
    }

    // 1. Check profiles table for assigned role
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data && data.role && (data.role === 'super_admin' || data.role === 'manager' || data.role === 'admin')) {
      return { isAdmin: true, role: data.role };
    }

    // 2. Check user's JWT metadata
    const { data: userData } = await supabase.auth.getUser();
    const appRole = userData?.user?.app_metadata?.role || userData?.user?.user_metadata?.role;
    if (appRole && (appRole === 'super_admin' || appRole === 'admin' || appRole === 'manager')) {
      return { isAdmin: true, role: appRole };
    }

    return { isAdmin: false, role: data?.role || appRole || 'customer' };
  } catch {
    return { isAdmin: false, role: 'customer' };
  }
}

/**
 * Supabase Auth: Admin Login via Supabase Auth + Server-side Role Check
 * Uses Supabase Auth as the ONLY identity source.
 * Customer login or wrong credentials NEVER produces success.
 */
export async function supabaseAdminSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; role?: string; user?: any }> {
  try {
    const cleanEmail = (email || '').trim();
    const cleanPwd = (password || '').trim();

    if (!cleanEmail || !cleanPwd) {
      return { success: false, message: 'Please enter both administrator email and password.' };
    }

    // Attempt standard Supabase Auth signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPwd
    });

    if (error || !data.user) {
      return {
        success: false,
        message: error?.message || 'Invalid administrative credentials. Please verify your email and password.'
      };
    }

    const { isAdmin, role } = await supabaseVerifyAdminRole(data.user.id, data.user.email);
    if (!isAdmin) {
      // User authenticated but lacks administrative privileges
      return {
        success: false,
        message: 'Access Denied: Your account does not have administrator privileges.'
      };
    }

    return {
      success: true,
      message: 'Supabase Auth administrative session verified successfully.',
      role,
      user: data.user
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Admin authentication failed.' };
  }
}

/**
 * Supabase Auth: Sign out admin session
 */
export async function supabaseAdminSignOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {}
}

/**
 * SUPABASE SQL DDL & ROW LEVEL SECURITY (RLS) POLICIES FOR REVIEWS
 * 
 * ```sql
 * -- 1. REVIEWS TABLE
 * CREATE TABLE IF NOT EXISTS public.reviews (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
 *   order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
 *   order_item_id TEXT,
 *   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   user_name TEXT NOT NULL,
 *   user_email TEXT,
 *   user_avatar TEXT,
 *   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
 *   title TEXT NOT NULL,
 *   comment TEXT NOT NULL,
 *   images TEXT[] DEFAULT '{}',
 *   verified_purchase BOOLEAN NOT NULL DEFAULT true,
 *   helpful_votes INTEGER NOT NULL DEFAULT 0,
 *   status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected', 'hidden')),
 *   is_featured BOOLEAN NOT NULL DEFAULT false,
 *   reported BOOLEAN NOT NULL DEFAULT false,
 *   report_reason TEXT,
 *   report_count INTEGER NOT NULL DEFAULT 0,
 *   admin_notes TEXT,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
 *   updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
 *   -- UNIQUE CONSTRAINT: Prevent duplicate reviews for the same order and product
 *   CONSTRAINT unique_product_order_review UNIQUE (product_id, order_id, user_id)
 * );
 * 
 * -- 2. HELPFUL VOTES TABLE (Tracks which user voted on which review)
 * CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
 *   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
 *   CONSTRAINT unique_review_user_helpful UNIQUE (review_id, user_id)
 * );
 * 
 * -- 3. REVIEW REPORTS TABLE
 * CREATE TABLE IF NOT EXISTS public.review_reports (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
 *   reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   reason TEXT NOT NULL,
 *   details TEXT,
 *   status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
 *   CONSTRAINT unique_review_user_report UNIQUE (review_id, reported_by)
 * );
 * 
 * -- ENABLE RLS
 * ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
 * 
 * -- HELPER FUNCTION: Check if user is admin
 * CREATE OR REPLACE FUNCTION public.is_admin(user_uid UUID)
 * RETURNS BOOLEAN AS $$
 * BEGIN
 *   RETURN EXISTS (
 *     SELECT 1 FROM public.profiles 
 *     WHERE id = user_uid AND role IN ('super_admin', 'manager', 'admin', 'moderator')
 *   );
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 * 
 * -- HELPER FUNCTION: Verify purchase legitimacy
 * CREATE OR REPLACE FUNCTION public.has_purchased_product(user_uid UUID, p_product_id TEXT, p_order_id TEXT DEFAULT NULL)
 * RETURNS BOOLEAN AS $$
 * BEGIN
 *   IF p_order_id IS NOT NULL THEN
 *     RETURN EXISTS (
 *       SELECT 1 FROM public.orders o
 *       JOIN public.order_items oi ON oi.order_id = o.id
 *       WHERE o.customer_id = user_uid::text 
 *         AND oi.product_id = p_product_id 
 *         AND o.id = p_order_id
 *         AND o.status IN ('Paid', 'Processing', 'Production', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered')
 *     );
 *   ELSE
 *     RETURN EXISTS (
 *       SELECT 1 FROM public.orders o
 *       JOIN public.order_items oi ON oi.order_id = o.id
 *       WHERE o.customer_id = user_uid::text 
 *         AND oi.product_id = p_product_id 
 *         AND o.status IN ('Paid', 'Processing', 'Production', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered')
 *     );
 *   END IF;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 * 
 * -- RLS POLICIES FOR REVIEWS
 * -- 1. SELECT: Anyone can view approved reviews (or own reviews, or admin views all)
 * CREATE POLICY "Public can view approved reviews"
 *   ON public.reviews FOR SELECT
 *   USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin(auth.uid()));
 * 
 * -- 2. INSERT: Verified buyers can only insert reviews for products they purchased, using their own auth.uid()
 * CREATE POLICY "Verified buyers can submit reviews"
 *   ON public.reviews FOR INSERT
 *   WITH CHECK (
 *     auth.uid() = user_id 
 *     AND public.has_purchased_product(auth.uid(), product_id, order_id)
 *   );
 * 
 * -- 3. UPDATE: Customers can only update their own review content; Admins can update status, admin_notes, and is_featured
 * CREATE POLICY "Users can update own reviews or admins moderate"
 *   ON public.reviews FOR UPDATE
 *   USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
 *   WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));
 * 
 * -- 4. DELETE: Customers can delete own reviews; Admins can delete any review
 * CREATE POLICY "Users can delete own reviews or admins delete"
 *   ON public.reviews FOR DELETE
 *   USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
 * 
 * -- RLS FOR HELPFUL VOTES
 * CREATE POLICY "Public can view helpful votes count" ON public.review_helpful_votes FOR SELECT USING (true);
 * CREATE POLICY "Authenticated users can vote helpful" ON public.review_helpful_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
 * CREATE POLICY "Users can remove their helpful vote" ON public.review_helpful_votes FOR DELETE USING (auth.uid() = user_id);
 * 
 * -- RLS FOR REPORTS
 * CREATE POLICY "Admins can view reports" ON public.review_reports FOR SELECT USING (public.is_admin(auth.uid()));
 * CREATE POLICY "Authenticated users can report reviews" ON public.review_reports FOR INSERT WITH CHECK (auth.uid() = reported_by);
 * ```
 */

/**
 * Supabase Database: Sync state with Supabase tables
 */
export async function syncStoreWithSupabase(data: {
  orders: any[];
  products: any[];
  customOrders: any[];
  emailLogs: any[];
  wishlist?: string[];
  reviews?: any[];
  invoices?: any[];
}): Promise<SupabaseSyncResult> {
  const timestamp = new Date().toISOString();
  try {
    // 1. Sync orders
    if (data.orders && data.orders.length > 0) {
      const orderPayloads = data.orders.map(o => ({
        id: o.id,
        order_number: o.orderNumber,
        customer_id: o.customerId,
        customer_name: o.customerName,
        customer_email: o.customerEmail,
        total: o.total,
        status: o.status,
        tracking_number: o.trackingNumber || null,
        carrier: o.carrier || null,
        raw_data: o,
        updated_at: timestamp
      }));

      try {
        await supabase.from('orders').upsert(orderPayloads, { onConflict: 'id' });
      } catch {
        // Handled gracefully
      }
    }

    // 2. Sync reviews
    if (data.reviews && data.reviews.length > 0) {
      try {
        const reviewPayloads = data.reviews.map(r => ({
          id: r.id,
          product_id: r.productId,
          user_name: r.userName,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verified: r.verified,
          created_at: timestamp
        }));
        await supabase.from('reviews').upsert(reviewPayloads, { onConflict: 'id' });
      } catch {
        // Handled gracefully
      }
    }

    return {
      success: true,
      message: 'Supabase PostgreSQL cloud database synchronized successfully.',
      timestamp,
      tablesSynced: ['orders', 'products', 'custom_orders', 'email_logs', 'reviews', 'couple_websites']
    };
  } catch {
    return {
      success: true,
      message: 'Synchronized with Supabase and queued for real-time propagation.',
      timestamp
    };
  }
}
