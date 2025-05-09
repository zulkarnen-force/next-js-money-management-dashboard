"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github } from "lucide-react";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Implement your login logic here
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Big Title */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-background px-8 py-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary text-center">
          Take Control of Your Money
        </h1>
        <p className="text-xl text-muted-foreground max-w-md text-center mb-8">
          The smart way to manage your money. Track expenses, set goals, and watch your savings grow.
        </p>
      </div>
      {/* Right: Auth Component */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-muted px-8 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <Button
            className="w-full gap-2"
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/dash" })}
          >
            <Github className="h-4 w-4" /> Sign in with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
} 