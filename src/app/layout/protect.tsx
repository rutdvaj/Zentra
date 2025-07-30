"use client";

import { useEffect, useState } from "react";
import { createClient } from "../_utils/supabase/client";
import { useRouter } from "next/navigation";
import Oglayout from "./page"; // This assumes your main layout content is in `./page.tsx`

const supabase = createClient();

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // local flag

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log("Auth check result:", { user: data?.user, error });

        if (!isMounted) return;

        if (data?.user) {
          console.log("User authenticated, setting state");
          setIsAuthenticated(true);
        } else {
          console.log("No user found, redirecting...");
          router.push("/auth/login");
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [router]);
  console.count("🔄 ProtectedLayout render count");

  console.log("Current state:", { isLoading, isAuthenticated });

  if (isLoading) {
    console.log("Rendering loading state");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated yet, returning null");
    return null;
  }

  console.log("Rendering Oglayout");
  return <>{children}</>;
}
