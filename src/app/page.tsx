import Image from "next/image";
import { CardDemo } from "./auth/signup/signupcard";
import { supabase } from "./auth/client";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" ">
      <div className=" flex w-screen h-screen justify-center items-center">
        <CardDemo />
      </div>
    </div>
  );
}
