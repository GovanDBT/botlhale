'use server'

import { createClient } from '@/utils/supabase/server';
import { loginSchema } from '../../validationSchema';

// server-side action for logging in a user
export async function login(formData: FormData) {
  // extract form data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // validate input using zod
  const validate = loginSchema.safeParse(data);
  if (!validate.success){
    // return validation errors
    return {
      success: false,
      errors: validate.error.flatten().fieldErrors
    };
  }

  // initialize Supabase client on the server
  const supabase = await createClient();

  // authenticate user with their email and password
  const { error } = await supabase.auth.signInWithPassword(data);

  // redirects user to error page if authentication fails
  if (error) {
    // return an error message for incorrect credentials
    return {
      success: false,
      errors: {
        general: ['Incorrect email or password. Please try again.']
      },
    };
  }

  // if login successful, return success
  return { success: true }
}