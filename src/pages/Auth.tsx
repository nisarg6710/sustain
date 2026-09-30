import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

const assurancePoints = [
  "Escrow-protected settlement on every order",
  "Identity verification and role-based permissions",
  "Full transaction history retained for audit",
];

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 5.38 12 5.38Z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
    />
  </svg>
);

const Spinner = () => (
  <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
);

const Auth = () => {
  const { user, signIn, signUp, signInWithProvider, loading } = useAuth();
  const navigate = useNavigate();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(null);

  useEffect(() => {
    if (user && !loading) navigate("/");
  }, [user, loading, navigate]);

  const passwordsMismatch = confirmPassword.length > 0 && signUpPassword !== confirmPassword;

  const handleOAuth = async (provider: "google" | "facebook") => {
    setOauthLoading(provider);
    const { error } = await signInWithProvider(provider);
    if (error) setOauthLoading(null);
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signInEmail || !signInPassword) return;
    setIsSubmitting(true);
    await signIn(signInEmail, signInPassword);
    setIsSubmitting(false);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !acceptedTerms || passwordsMismatch) return;
    setIsSubmitting(true);
    await signUp(signUpEmail, signUpPassword, signUpName);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Checking your session…</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <aside className="hidden lg:block">
          <p className="eyebrow">Account access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            One account for buying, selling and settlement
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Register once to publish listings, hold EcoCoins in your wallet and manage orders across the circular
            marketplace.
          </p>

          <ul className="mt-8 space-y-3">
            {assurancePoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Accounts are free. No listing fees, no monthly subscription. You are only charged a transaction fee on
              completed sales.
            </p>
          </div>
        </aside>

        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <Brand className="justify-center" />
          </div>

          <div className="mt-6 space-y-3 lg:mt-0">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={oauthLoading !== null || isSubmitting}
              onClick={() => handleOAuth("google")}
            >
              {oauthLoading === "google" ? <Spinner /> : <GoogleIcon />}
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={oauthLoading !== null || isSubmitting}
              onClick={() => handleOAuth("facebook")}
            >
              {oauthLoading === "facebook" ? <Spinner /> : <FacebookIcon />}
              Continue with Facebook
            </Button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              or use email
            </span>
            <Separator className="flex-1" />
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sign in to your account</CardTitle>
                  <CardDescription>Access your wallet, orders and listings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Work email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={signInEmail}
                        onChange={(event) => setSignInEmail(event.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                        <button type="button" className="text-xs font-medium text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="signin-password"
                        type="password"
                        autoComplete="current-password"
                        value={signInPassword}
                        onChange={(event) => setSignInPassword(event.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="font-normal text-muted-foreground">
                        Keep me signed in on this device
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Signing in…" : "Sign in"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Register as a buyer, seller, or both.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full name</Label>
                      <Input
                        id="signup-name"
                        autoComplete="name"
                        placeholder="Alex Morgan"
                        value={signUpName}
                        onChange={(event) => setSignUpName(event.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Work email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={signUpEmail}
                        onChange={(event) => setSignUpEmail(event.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          autoComplete="new-password"
                          value={signUpPassword}
                          onChange={(event) => setSignUpPassword(event.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    {passwordsMismatch && (
                      <p className="text-xs text-destructive">Passwords do not match.</p>
                    )}

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(value) => setAcceptedTerms(value === true)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="terms" className="font-normal leading-relaxed text-muted-foreground">
                        I accept the terms of service and privacy notice, and consent to identity verification checks.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || passwordsMismatch || !acceptedTerms}
                    >
                      {isSubmitting ? "Creating account…" : "Create account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to the Sustain terms of service and privacy notice.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Auth;
