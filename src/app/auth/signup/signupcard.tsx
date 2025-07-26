"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "../client";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Backend login Logic

export function CardDemo() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, pass);
  };
  // Sign up function
  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: pass,
    });

    if (error) {
      console.error("Sign-up error:", error.message);
      // Show user-friendly error message
    } else {
      console.log("Sign-up success:", data);
      // Optionally show a message like "Check your email for confirmation"
    }
  }
  // Login function
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });
    if (error) {
      console.error("Login error:", error.message);
      // Show user-friendly error message
    } else {
      console.log("Login success:", data);
      // Optionally show a message like "Check your email for confirmation"
    }
  }
  // Setting up navigation
  const router = useRouter();
  return (
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-primary ">
          Sign Up as a new User
        </CardTitle>
        <CardDescription className="text-md font-medium font-primary ">
          Enter your email below to sign up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
          </div>
          <CardFooter className="flex-col gap-2 mt-6">
            <Button type="submit" className="w-full cursor-pointer">
              Sign Up
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
