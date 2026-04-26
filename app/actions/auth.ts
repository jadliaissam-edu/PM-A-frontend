// app/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service'; // adjust path
import { LoginFormData } from '@/lib/validations';

export async function loginAction(data: LoginFormData) {
  try {
    const response = await authService.login({
      email: data.email,
      password: data.password,
    });

    const cookieStore = await cookies();

    // Set httpOnly cookies from the server - MUST MATCH DJANGO SETTINGS
    cookieStore.set('access_token', response.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 60 minutes
      path: '/',
    });

    cookieStore.set('refresh_token', response.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/',
    });

    // Optional: set a non-httpOnly cookie to know user is logged in
    cookieStore.set('isLoggedIn', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return { success: true, user: { username: response.username, email: response.email, id: response.user_id } };
  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: error.message || 'Login failed' };
  }
}