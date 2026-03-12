import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-100 py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Logo className="text-xl mb-3 block" />
            <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
              Describe what you want built. Get a live site in seconds.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm">
            <div className="space-y-3">
              <p className="font-semibold text-zinc-900 text-xs uppercase tracking-widest font-mono">Product</p>
              <div className="space-y-2">
                <Link href="/register" className="block text-zinc-400 hover:text-zinc-900 transition-colors">Get started</Link>
                <Link href="/login" className="block text-zinc-400 hover:text-zinc-900 transition-colors">Sign in</Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-zinc-900 text-xs uppercase tracking-widest font-mono">Links</p>
              <div className="space-y-2">
                <a href="https://github.com/ranjitparmar/codiva" target="_blank" rel="noreferrer" className="block text-zinc-400 hover:text-zinc-900 transition-colors">GitHub</a>
                <a href="https://ranjitparmar.in" target="_blank" rel="noreferrer" className="block text-zinc-400 hover:text-zinc-900 transition-colors">Portfolio</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-400 text-sm">© {new Date().getFullYear()} Codiva. All rights reserved.</p>
          <p className="text-zinc-400 text-sm">
            Built by{" "}
            <a href="https://ranjitparmar.in" target="_blank" rel="noreferrer" className="text-zinc-900 font-medium hover:underline">
              Ranjit Parmar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};