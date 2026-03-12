import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="px-8 py-5 flex items-center justify-between">
        <Link href="/">
          <Logo className="text-xl" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        {children}
      </main>
    </div>
  );
}