"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  
  const supabase = createClientComponentClient()
  
  const handleSignUp = async () => {
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

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

    const { data, error } = await supabase.auth.getUser()
    console.log(data, error)

    router.refresh()
    //router.push('/')
}

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
}

  const loginWithGoogle = async () =>{
      await supabase.auth.signInWithOAuth(
      { provider: 'google' })
}

  return (

    <div className="flex items-center justify-center  h-full">
    <div className="flex flex-col gap-3">
      <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="exmp@example.com" 
                onChange={(e) => setEmail(e.target.value)}
                required />
          </div>
         <div className="space-y-2">   
            <Label htmlFor="password">Password:</Label>
            <Input 
                id="password" 
                name="password" 
                type="password" 
                onChange={(e) => setPassword(e.target.value)}
                required />
         </div>
      <div className="flex gap-x-2">
      <Button onClick={handleSignIn}>Log in</Button>
      <Button onClick={handleSignUp}>Sign up</Button>
      </div>
      </div>
      </CardContent>
      </Card>
    <Button onClick={loginWithGoogle} >Google</Button>
    </div>
    </div>
  )
}
