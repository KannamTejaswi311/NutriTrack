
import { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const { login, signup } = useAuth();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
  const { guestLogin, currentUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await login(email, password);
    toast.success("Welcome back!");
    setEmail("");
    setPassword("");
    navigate("/dashboard");
  } catch (err) {
    toast.error("Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    if (password.length < 6) {
      throw new Error("Password should be at least 6 characters.");
    }
    await signup(email, password);
    toast.success("Account created!");
    setEmail("");
    setPassword("");
    setName("");
    navigate("/dashboard");
  } catch (err) {
    console.error("Signup error:", err);
  toast.error(err?.message || "Signup failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
  if (currentUser?.isAnonymous) {
    console.log("User is using app as guest");
  }
}, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">NutriTrack</span>
          </Link>
          <p className="text-gray-600">Eat Wise, Live Better</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription>
              Join your family's journey to better nutrition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                       value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                  <div className="flex items-center gap-2 my-2">
  <hr className="flex-grow border-gray-300" />
  <span className="text-gray-500 text-sm">or</span>
  <hr className="flex-grow border-gray-300" />
</div>

                  <Button
  type="button"
  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
  onClick={async () => {
    setIsLoading(true);
    try {
      await guestLogin();
      toast.success("Welcome Guest! You can start using NutriTrack.");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Guest login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }}
>
  Continue as Guest
</Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                Made with love for healthier families
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-green-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
