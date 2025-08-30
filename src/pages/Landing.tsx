import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Assets
import dungeonCube from "../assets/dungeonCube.png";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Icons
import { Zap, Wallet, Trophy, Users, Shield } from "lucide-react";

// Toast
import { toast } from "@/hooks/use-toast";

// Hooks
import { useWallet } from "@/contexts/WalletContext"; // ✅ real MetaMask context
import { useAuth } from "@/contexts/AuthContext";

const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Fullscreen background image */}
      <img
        src={dungeonCube}
        alt="Dungeon Cube"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Loading bar */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-72 md:w-96 h-3 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.2 }}
          />
        </div>
        <p className="mt-4 text-white text-sm tracking-widest">
          {progress < 100 ? `Loading ${progress}%` : "Entering Tokenverse..."}
        </p>
      </div>
    </motion.div>
  );
};

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 500);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <LoadingScreen progress={progress} />
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Landing setLoading={setLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Landing = ({ setLoading }: { setLoading: (v: boolean) => void }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "brand">("user");
  const [name, setName] = useState("");
  const { connectWallet, isConnected, isConnecting, account } = useWallet();
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await login(selectedRole, name);
      setIsLoginOpen(false);

      setTimeout(() => {
        setLoading(false);
        if (selectedRole === "user") navigate("/user-dashboard");
        else navigate("/brand-dashboard");
      }, 2000);

      toast({
        title: "Welcome to Tokenverse!",
        description: `Logged in as ${selectedRole}`,
      });
    } catch {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    navigate(user?.role === "user" ? "/user-dashboard" : "/brand-dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 animate-gradient-x">
              Tokenverse
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white neon-glow px-6 py-2 font-bold"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white neon-glow px-6 py-2 font-bold">
                      Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-border/50 animate-slide-up">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 animate-gradient-x">
                        Join Tokenverse
                      </DialogTitle>
                      <DialogDescription>
                        Choose your role and start earning rewards
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="role">Select Role</Label>
                        <Select
                          value={selectedRole}
                          onValueChange={(value: "user" | "brand") =>
                            setSelectedRole(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">
                              User - Earn Rewards
                            </SelectItem>
                            <SelectItem value="brand">
                              Brand - Create Campaigns
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <Button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white neon-glow"
                      >
                        Create Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 opacity-20 animate-gradient-x mix-blend-overlay" />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 animate-gradient-x"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Tokenverse
          </motion.h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The future of loyalty programs is here. Earn crypto rewards, complete
            campaigns, and be part of the Web3 revolution.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Why Choose Tokenverse?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card neon-glow">
              <CardHeader>
                <Trophy className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-xl">Earn Real Rewards</CardTitle>
                <CardDescription>
                  Complete campaigns and earn points that convert to real crypto tokens
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card neon-glow">
              <CardHeader>
                <Users className="w-12 h-12 text-neon-purple mb-4" />
                <CardTitle className="text-xl">Join Communities</CardTitle>
                <CardDescription>
                  Connect with brands and users in an engaging loyalty ecosystem
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card neon-glow">
              <CardHeader>
                <Shield className="w-12 h-12 text-neon-cyan mb-4" />
                <CardTitle className="text-xl">Web3 Security</CardTitle>
                <CardDescription>
                  Your rewards are secured by blockchain technology and smart contracts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-glow">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl text-accent">For Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>1. Connect your MetaMask wallet</p>
                <p>2. Browse and join brand campaigns</p>
                <p>3. Complete tasks and submit content</p>
                <p>4. Earn points and convert to crypto tokens</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl text-neon-purple">For Brands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>1. Connect your MetaMask wallet</p>
                <p>2. Create engaging campaigns</p>
                <p>3. Review user submissions</p>
                <p>4. Build community and engagement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Tokenverse. Built on Web3 technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppWrapper;
