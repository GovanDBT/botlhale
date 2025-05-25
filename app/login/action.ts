'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

// server-side action for logging in a user
export async function login(formData: FormData) {
  // initialize Supabase client on the server
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // retrieves data from the form
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // authenticate user with their email and password
  const { error } = await supabase.auth.signInWithPassword(data);

  // redirects user to error page if authentication fails
  if (error) {
    redirect('/error');
  }

  // revalidate the cache for the root path and layout
  revalidatePath('/', 'layout');
  // redirects user after successful authentication
  redirect('/private');
}

// server-side action for signing up a new user
export async function signup(formData: FormData) {
  // initialize Supabase client on the server
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // retrieves data from the form
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // register a new user with their email and password
  const { error } = await supabase.auth.signUp(data);

  // redirects user to error page if authentication fails
  if (error) {
    redirect('/error');
  }

  // revalidate the cache for the root path and layout
  revalidatePath('/', 'layout');
  // redirects user after successful authentication
  redirect('/');
}