import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

const TEAM_MEMBERS = [
  { name: "Hamdi", pin: "1234", role: "Admin/Manager" },
  { name: "Hadeer", pin: "2345", role: "Media Buyer" },
  { name: "Bakr", pin: "3456", role: "Creator" },
  { name: "Asmaa", pin: "4567", role: "Creator" },
];

export default function Login() {
  const [, navigate] = useLocation();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pin || pin.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate PIN verification
      const user = TEAM_MEMBERS.find(m => m.pin === pin);
      
      if (!user) {
        toast.error("Invalid PIN");
        setIsLoading(false);
        return;
      }

      // Store user session in localStorage
      const userData = {
        name: user.name,
        pin: pin,
        role: user.role.split("/")[0].toLowerCase(),
      };

      localStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Welcome, ${user.name}!`);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      toast.error("Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">EW-TC Campaign HQ</h1>
          </div>
          <p className="text-slate-400">Marketing Operations Platform</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-700 bg-slate-800 shadow-2xl">
          <CardHeader className="border-b border-slate-700 bg-slate-900">
            <CardTitle className="text-white">PIN Login</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your 4-digit PIN to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-slate-200 font-medium">
                  PIN
                </Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  placeholder="••••"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || pin.length !== 4}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Demo Users */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-4 font-medium">Demo Users:</p>
              <div className="space-y-2">
                {TEAM_MEMBERS.map(member => (
                  <button
                    key={member.pin}
                    onClick={() => setPin(member.pin)}
                    className="w-full p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-slate-400 text-xs">{member.role}</p>
                      </div>
                      <code className="text-blue-400 font-mono text-sm">{member.pin}</code>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Internal Use Only • EW-TC Campaign Management
        </p>
      </div>
    </div>
  );
}
