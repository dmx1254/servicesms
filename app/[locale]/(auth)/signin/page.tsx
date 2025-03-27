"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

export default function SignIn() {
  const router = useRouter();
  const t = useScopedI18n("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setIsLoading(true);

    // try {
    //   const result = await signIn("credentials", {
    //     email: email,
    //     password: password,
    //     redirect: false,
    //   });

    //   if (result?.error) {
    //     toast.error(result.error, {
    //       style: { backgroundColor: "#EF4444", color: "white" },
    //       position: "top-right",
    //     });
    //   } else {
    //     toast.success(t("success"), {
    //       style: { backgroundColor: "#22C55E", color: "white" },
    //       position: "top-right",
    //     });
    //     router.push("/dashboard");
    //   }
    // } catch {
    //   toast.error(t("error"), {
    //     style: { backgroundColor: "#EF4444", color: "white" },
    //     position: "top-right",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
    alert("Nous ne sommes pas encore disponibles");
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-white to-gray-50">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-[#67B142]/5 items-center justify-center relative p-12">
        {/* Back to home */}
        <Link
          href="/"
          className="absolute top-8 left-8 text-muted-foreground hover:text-[#67B142] transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backhome")}
        </Link>

        <div className="relative w-full max-w-lg">
          {/* Background shapes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 -left-4 w-72 h-72 bg-[#67B142]/30 rounded-full mix-blend-multiply filter blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -bottom-8 right-0 w-72 h-72 bg-[#34A853]/30 rounded-full mix-blend-multiply filter blur-xl"
          />

          {/* Main illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-50 border border-white/20">
              <h2 className="text-2xl font-bold text-[#67B142] mb-4">
                {t("title")}
              </h2>
              <p className="text-gray-600 mb-6">{t("desc")}</p>
              <div className="space-y-4">
                <div className="h-2 bg-[#67B142]/20 rounded w-3/4" />
                <div className="h-2 bg-[#67B142]/15 rounded w-1/2" />
                <div className="h-2 bg-[#67B142]/10 rounded w-5/6" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full lg:w-1/2 px-6 py-12 lg:px-12 xl:px-24 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#67B142] to-[#34A853]">
              {t("welcome")}
            </h1>
            <p className="text-muted-foreground mt-2">{t("conTtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]"
                  placeholder={t("emailPlace")}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="password">{t("pass")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-white focus:ring-[#67B142] accent-[#67B142]"
                />
                <span className="text-sm text-muted-foreground">
                  {t("remember")}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#67B142] hover:text-[#34A853] transition-colors"
              >
                {t("forgotpass")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                {isLoading ? t("connexion") : t("toconn")}
              </Button>
            </motion.div>

            {/* <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">
                  Ou continuez avec
                </span>
              </div>
            </div> */}

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <Button
                type="button"
                variant="outline"
                className="rounded-xl hover:bg-gray-50 border-gray-200"
              >
                <img
                  src="/icons/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl hover:bg-gray-50 border-gray-200"
              >
                <img
                  src="/icons/microsoft.svg"
                  alt="Microsoft"
                  className="w-5 h-5 mr-2"
                />
                Microsoft
              </Button>
            </motion.div> */}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center text-sm text-muted-foreground mt-6"
            >
              {t("noacount")}{" "}
              <Link
                href="/signup"
                className="text-[#67B142] font-medium hover:text-[#34A853] transition-colors"
              >
                {t("register")}
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
