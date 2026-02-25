import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import {
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Loader2,
  Eye,
  EyeClosed,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/auth";

interface SignupPageProps {
  onNavigateToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin }) => {
  const { setUser } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data.data.user);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    },
    onError: () => {
      setError("Failed to create account");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Required fields
    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError("All fields are required");
      return;
    }

    // Name validation
    if (trimmedName.length < 2) {
      setError("Please enter a valid name");
      return;
    }

    // Email validation (extra safety beyond type="email")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(trimmedPassword)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(trimmedPassword)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(trimmedPassword)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(trimmedPassword)) {
      setError("Password must contain at least one special character");
      return;
    }
    setIsLoading(true);
    try {
      mutation.mutate({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });
    } catch {
      setError("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FDF6E9] text-[#111]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight mb-2">
            apex<span className="text-zinc-400">.</span>
          </h1>
          <p className="text-zinc-500 font-medium">Start your journey</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-zinc-900/5 border border-white">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-4">
                Full Name
              </label>
              <div className="relative">
                <UserIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={20}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-zinc-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-4">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-zinc-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-4">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-12 font-medium focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-zinc-300"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-500 transition"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 bg-[#111] text-white rounded-2xl font-bold text-lg shadow-lg shadow-zinc-900/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-zinc-500 font-medium">
            Already have an account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-black font-bold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
