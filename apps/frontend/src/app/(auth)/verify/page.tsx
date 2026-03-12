import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/forms/VerifyOtpForm";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}