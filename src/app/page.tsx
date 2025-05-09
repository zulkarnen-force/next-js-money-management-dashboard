"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { 
  ArrowRight, 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  Shield, 
  Zap, 
  Github, 
  Mail 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        {/* <img src="/monee-nobg.png" alt="Monee Logo" className="h-10"/> */}
        <h1 className="text-primary font-medium text-lg">Moone</h1>
        <a href="/login" className="text-primary font-medium hover:underline text-lg">Login</a>
      </nav>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Take Control of Your
            <span className="text-primary"> Money</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The smart way to manage your money. Track expenses, set goals, and watch your savings grow.
          </p>
          <a
            href="/login"
            className="inline-block mt-6 px-8 py-3 bg-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>



      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Tracking</h3>
            </div>
            <p className="text-muted-foreground">
              Track your expenses and income effortlessly with our intuitive interface.
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Visual Insights</h3>
            </div>
            <p className="text-muted-foreground">
              Get clear insights into your spending habits with beautiful charts and analytics.
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Save Smarter</h3>
            </div>
            <p className="text-muted-foreground">
              Set and achieve your savings goals with our smart budgeting tools.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16 bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary font-bold">1</span>
            </div>
            <h3 className="font-semibold">Sign Up</h3>
            <p className="text-sm text-muted-foreground">
              Quick and easy signup with email or GitHub
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary font-bold">2</span>
            </div>
            <h3 className="font-semibold">Add Your Wallets</h3>
            <p className="text-sm text-muted-foreground">
              Connect your accounts and wallets
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary font-bold">3</span>
            </div>
            <h3 className="font-semibold">Track Transactions</h3>
            <p className="text-sm text-muted-foreground">
              Start tracking your income and expenses
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary font-bold">4</span>
            </div>
            <h3 className="font-semibold">Analyze & Grow</h3>
            <p className="text-sm text-muted-foreground">
              Get insights and improve your finances
            </p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">Your Security is Our Priority</h2>
            <p className="text-muted-foreground">
              We use industry-standard security measures to protect your data. Your financial information is encrypted and secure.
            </p>
            <div className="flex items-center gap-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-4">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm">Fast and reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
