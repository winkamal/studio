
import { Icons } from "@/components/icons";
import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-8 flex flex-col items-center gap-4">
          <Icons.logo className="h-10 w-10 text-primary" />
          <h1 className="text-center font-headline text-3xl font-bold">
            VT blogs
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Admin Login. Enter your admin email and a password of at least 6 characters. If the default admin account doesn't exist, it will be created.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

    