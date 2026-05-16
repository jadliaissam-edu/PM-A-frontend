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
    // If backend indicates MFA is required, return that to the caller so
    // the frontend can redirect the user to the MFA verification flow.
    if (response?.mfa_required) {
      return { success: true, mfa_required: true, email: response.email || data.email };
    }

    const cookieStore = await cookies();

    // Set httpOnly cookies from the server
    cookieStore.set('accessToken', response.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // e.g. 15 minutes for access token
      path: '/',
    });

    cookieStore.set('refreshToken', response.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // e.g. 7 days
      path: '/',
    });

    // Optional: set a non-httpOnly cookie to know user is logged in
    cookieStore.set('isLoggedIn', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return { success: true, user: { username: response.username, email: response.email } };
  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: error.message || 'Login failed' };
  }
}