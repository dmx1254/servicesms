"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useScopedI18n } from "@/locales/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const t = useScopedI18n("forgotpassword");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        toast.error(t("error"), {
          style: {
            color: "#ef4444",
          },
          position: "top-right",
        });
      }

      toast.success(t("sendsuccesscode"), {
        style: {
          color: "#67B142",
        },
        position: "top-right",
      });
      setStep(2);
    } catch (error) {
      toast.error(t("error"), {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t("nomatch"), {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          newPassword,
        }),
      });

      if (!response.ok) {
        toast.error(t("error"), {
          style: {
            color: "#ef4444",
          },
          position: "top-right",
        });
      }

      toast.success(t("successreset"), {
        style: {
          color: "#67B142",
        },
        position: "top-right",
      });
      router.push("/signin");
    } catch (error) {
      toast.error(t("error"), {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#67B142]/5 ">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/signin")}
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold">
              {step === 1 ? t("forgot") : t("resetpass")}
            </CardTitle>
          </div>
          <CardDescription>
            {step === 1 ? t("enteremail") : t("entercode")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSendCode}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">{t("mailadresse")}</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("mailadresse")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#67B142] hover:bg-[#67B142]/90"
                // disabled={isLoading}
                disabled
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("send")
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="code">{t("verificationCode")}</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder={t("enterVerificationCode")}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("newpass")}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmnewpass")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#67B142] hover:bg-[#67B142]/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("resetpassword")
                )}
              </Button>
            </motion.form>
          )}
          <div className="mt-4 text-center text-sm">
            <Link
              href="/signin"
              className="text-[#67B142] hover:underline hover:text-[#67B142]/90"
            >
              {t("backtocon")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
