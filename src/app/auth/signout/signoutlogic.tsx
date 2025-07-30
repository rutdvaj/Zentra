"use client";
import React from "react";
import { supabase } from "@/app/_utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { ButtonDestructive } from "@/app/_components/bd";

function Signoutlogic() {
  const router = useRouter();
  async function handleLogout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Logout failed");
    } else {
      console.log("Lougt successful");
    }
  }
  return (
    <div>
      <form onSubmit={handleLogout}>
        <div className="flex flex-col gap-6"></div>
        <ButtonDestructive />
      </form>
    </div>
  );
}

export default Signoutlogic;
