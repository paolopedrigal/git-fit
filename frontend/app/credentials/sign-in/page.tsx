import { SignInForm } from "@/app/credentials/sign-in/sign-in-form";
import { Toaster } from "@/components/ui/toaster";
import DumbbellAnimation from "@/components/dumbbell-animation";

export default function SignIn() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-0 w-full">
        <DumbbellAnimation />
      </div>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight m-4">
        Back to the grind?
      </h3>
      <Toaster />
      <SignInForm />
    </main>
  );
}
