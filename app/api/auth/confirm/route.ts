import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/services/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) { 
      return NextResponse.redirect(redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/auth/auth-code-error'
  return NextResponse.redirect(redirectTo)
}

// /**
//  * confirms if the user clicked on the confirm email link,
//  * if so, exchange secure code for an auth token
//  */
// import { type EmailOtpType } from '@supabase/supabase-js'
// import { type NextRequest } from 'next/server'

// import { createClient } from '@/services/supabase/server'
// import { redirect } from 'next/navigation'

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const token_hash = searchParams.get('token_hash')
//   const type = searchParams.get('type') as EmailOtpType | null
//   const next = searchParams.get('next') ?? '/'

//   if (token_hash && type) {
//     const supabase = await createClient()

//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     })
//     if (!error) {
//       // redirect user to specified redirect URL or root of app
//       redirect(next)
//     }
//   }

//   // when an unexpected error occurs
//   throw new Error('An error occurred while verifying the OTP.');
// }