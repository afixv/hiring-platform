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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string, supabaseUserData?: SupabaseUser) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Error fetching user profile from database:', error.message);
        if (supabaseUserData?.user_metadata?.role) {
          setRole(supabaseUserData.user_metadata.role as UserRole);
        }
        return null;
      }

      if (userData) {
        const typedUser = userData as User;
        setUser(typedUser);
        setRole(typedUser.role as UserRole);
        return typedUser;
      }
      
      if (supabaseUserData?.user_metadata?.role) {
        setRole(supabaseUserData.user_metadata.role as UserRole);
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (supabaseUserData?.user_metadata?.role) {
        setRole(supabaseUserData.user_metadata.role as UserRole);
      }
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
        } 
      } catch (error) {
        console.error('[Auth] Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (session) {
        setSupabaseUser(session.user);
        await fetchUserProfile(session.user.id, session.user);
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

  const refreshUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await fetchUserProfile(session.user.id, session.user);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        role,
        loading,
        isAuthenticated: !!supabaseUser,
        login,
        register,
        logout,
        refreshUser,
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
