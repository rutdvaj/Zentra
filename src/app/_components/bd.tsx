"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ButtonDestructive() {
  const router = useRouter();
  return (
    <Button
      className="cursor-pointer"
      variant="destructive"
      onClick={() => router.push("/auth/signup")}
    >
      Logout
    </Button>
  );
}
