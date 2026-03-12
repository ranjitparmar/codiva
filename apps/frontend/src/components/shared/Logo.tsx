import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn("font-bold tracking-tight text-zinc-900", className)}
      style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
    >
      codiva
      <span className="text-zinc-300">.</span>
    </span>
  );
};