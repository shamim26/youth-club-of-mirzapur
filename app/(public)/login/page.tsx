import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 py-24 sm:p-8 bg-background relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Form Container */}
      <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <LoginForm />
      </div>
    </div>
  );
}
