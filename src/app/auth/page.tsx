"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"admin" | "staff" | "teacher" | "student" | "parent">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [helperText, setHelperText] = useState(
    "This is a local demo flow. Any valid-looking credentials will sign you in.",
  );

  const handleAuthenticate = (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === "signin") {
      if (!email.trim() || !password.trim()) {
        setHelperText("Please enter both your email and password.");
        return;
      }
    } else if (!name.trim() || !email.trim() || !password.trim()) {
      setHelperText("Please complete the full account form.");
      return;
    }

    document.cookie = "rawdah_auth=true; path=/; max-age=604800";
    document.cookie = `rawdah_role=${role}; path=/; max-age=604800`;
    setHelperText(`Signed in locally as ${role}. Redirecting to the dashboard…`);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,169,74,0.16),transparent_35%),linear-gradient(135deg,#f7f2e8_0%,#fdfbf5_100%)] px-4 py-10 text-navy sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            <ShieldCheck className="size-3.5" /> Protected access
          </div>
          <h1 className="mt-5 font-display italic text-4xl leading-tight text-navy sm:text-5xl">
            Access the Rawdah administration console with confidence.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-ink-muted">
            Secure sign-in and account creation for staff, finance, and
            leadership teams. The experience is designed to feel polished, calm,
            and trustworthy.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-white/70 p-4 shadow-sm">
              <p className="text-sm font-medium text-navy">Single sign-in</p>
              <p className="mt-1 text-sm text-ink-muted">
                Use one secure entry point for staff, guardians, and admin
                roles.
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-white/70 p-4 shadow-sm">
              <p className="text-sm font-medium text-navy">Role-based access</p>
              <p className="mt-1 text-sm text-ink-muted">
                Permissions stay scoped to payroll, attendance, curriculum, and
                communications.
              </p>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md border border-hairline bg-white/90 shadow-2xl shadow-navy/5 backdrop-blur">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="font-display text-2xl text-navy">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-ink-muted">
              {mode === "signin"
                ? "Sign in to continue to your institution dashboard."
                : "Create an account for the Rawdah admin workspace."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as "signin" | "signup")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-5 space-y-4">
                <form onSubmit={handleAuthenticate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Select your role</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(event) => setRole(event.target.value as any)}
                      className="h-11 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                    >
                      <option value="admin">Admin (Principal)</option>
                      <option value="staff">Staff (Registrar / Clerk)</option>
                      <option value="teacher">Teacher (Instructor)</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent / Guardian</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@rawdah.org"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="h-11 pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-ink-muted">
                      <input
                        type="checkbox"
                        className="rounded border-hairline"
                      />
                      Remember me
                    </label>
                    <Link href="/" className="text-navy hover:text-gold">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-navy text-cream hover:bg-navy/90"
                  >
                    Continue <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-5 space-y-4">
                <form onSubmit={handleAuthenticate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Select your role</Label>
                    <select
                      id="signup-role"
                      value={role}
                      onChange={(event) => setRole(event.target.value as any)}
                      className="h-11 w-full rounded-md border border-hairline bg-cream/60 px-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                    >
                      <option value="admin">Admin (Principal)</option>
                      <option value="staff">Staff (Registrar / Clerk)</option>
                      <option value="teacher">Teacher (Instructor)</option>
                      <option value="student">Student</option>
                      <option value="parent">Parent / Guardian</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input
                      id="full-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Amina Yusuf"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Work email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@rawdah.org"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Create password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Minimum 8 characters"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-gold text-navy hover:bg-gold/90"
                  >
                    Create account <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="mt-4 text-sm text-ink-muted">{helperText}</p>

            <p className="mt-5 text-center text-sm text-ink-muted">
              Need help? Contact the institutional admin office.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
