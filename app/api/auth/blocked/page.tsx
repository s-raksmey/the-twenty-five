// app/auth/blocked/page.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlockedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg border text-center">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <ShieldOff className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Access Blocked</h1>
          
          <Alert variant="destructive">
            <AlertDescription>
              Your account has been blocked from accessing this resource. 
              This may be due to suspicious activity or policy violations.
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact support with your account details.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                Try Different Account
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}