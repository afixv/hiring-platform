'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserRole } from '@/types/database';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setSupabaseUser(session.user);
          // Fetch user profile from database (without .single() to avoid error if not found)
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id);

          if (error) {
            console.error('Error fetching user:', error);
            // Still set authenticated, but without profile
            setSupabaseUser(session.user);
          } else if (userData && userData.length > 0) {
            const typedUser = userData[0] as User;
            setUser(typedUser);
            setRole(typedUser.role as UserRole);
          } else {
            // No user record yet - might be first login
            console.warn('User profile not found in database');
            setSupabaseUser(session.user);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSupabaseUser(session.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id);

        if (!error && userData && userData.length > 0) {
          const typedUser = userData[0] as User;
          setUser(typedUser);
          setRole(typedUser.role as UserRole);
        } else {
          // No profile yet - just keep auth user
          setSupabaseUser(session.user);
        }
      } else {
        setSupabaseUser(null);
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, userRole: UserRole) => {
    try {
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: userRole,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // The trigger will automatically create the user profile
      // But if trigger doesn't work, we insert as backup
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('users') as any).insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: userRole,
        });
      } catch (backupError) {
        // Trigger might have already created it, ignore
        console.log('Profile creation (backup):', backupError);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSupabaseUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        role,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
