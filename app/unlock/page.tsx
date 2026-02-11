import { Suspense } from "react";
import { UnlockForm } from "@/components/unlock-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function UnlockFormFallback() {
  return <div className="h-10 animate-pulse rounded bg-muted" aria-hidden />;
}

export default function UnlockPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Family Task Tracker</CardTitle>
          <CardDescription>Enter the shared passcode to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UnlockFormFallback />}>
            <UnlockForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
