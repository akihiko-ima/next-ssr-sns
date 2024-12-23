"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { LogInIcon, SearchIcon, BellIcon, MailIcon } from "./Icons";

export default function Header() {
  return (
    <header className="bg-slate-700 shadow-md px-4 md:px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <LogInIcon className="h-6 w-6 text-slate-200" />
        <span className="text-lg font-bold text-slate-200">Next SNS</span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search..."
            className="pr-10 rounded-full"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-700" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="relative" prefetch={false}>
            <BellIcon className="h-6 w-6 text-slate-200" />
          </Link>
          <Link href="#" className="relative" prefetch={false}>
            <MailIcon className="h-6 w-6 text-slate-200" />
          </Link>

          <div>
            {/* ログインしているとき */}
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* ログアウトしているとき */}
            <SignedOut>
              <Link className="w-20 inline-block text-slate-100" href={"/sign-in"}>
                ログイン
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
