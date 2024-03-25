'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const supabase = createClientComponentClient()


export const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.refresh()
    router.push('/')
  }

export const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.refresh()
    router.push('/')
}

export const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
}

export const loginWithGoogle = async () =>{
      await supabase.auth.signInWithOAuth(
      { provider: 'google' })
}

