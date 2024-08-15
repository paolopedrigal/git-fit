import { SignUpForm } from "./sign-up-form";
import { Toaster } from "@/components/ui/toaster";

export default function SignIn() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight m-4">
        Create an account
      </h3>
      <Toaster />
      <SignUpForm />
    </main>
  );
}
