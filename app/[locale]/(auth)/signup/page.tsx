"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  User,
  Building2,
  Lock,
  CheckCircle2,
  KeyRound,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

// Define types
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountType: "personal" | "business";
  companyName: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function SignUp() {
  const router = useRouter();
  const t = useScopedI18n("signup");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accountType: "personal",
    companyName: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [step, setStep] = useState<"form" | "verification">("form");
  const [verificationCode, setVerificationCode] = useState("");
  const [isStepLoading, setIsStepLoading] = useState(false);

  // Validation schemas
  const stepOneSchema = z.object({
    firstName: z.string().min(2, t("firstError")),
    lastName: z.string().min(2, t("lastError")),
    email: z.string().email(t("mailError")),
    phone: z.string().min(10, t("phoneError")),
  });

  const stepTwoSchema = z
    .object({
      accountType: z.enum(["personal", "business"]),
      companyName: z.string().min(2, t("companyNamError")),
      password: z
        .string()
        .min(8, t("passError"))
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("pasLenError")),
      confirmPassword: z.string(),
    })
    .refine(
      (data: Partial<FormData>) => data.password === data.confirmPassword,
      {
        message: t("passesError"),
        path: ["confirmPassword"],
      }
    );

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }));
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const validateStepOne = () => {
    try {
      setIsStepLoading(true);
      stepOneSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString() as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    } finally {
      setIsStepLoading(false);
    }
  };

  const validateStepTwo = () => {
    try {
      setIsStepLoading(true);
      stepTwoSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString() as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    } finally {
      setIsStepLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStepOne()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStepTwo()) {
      // Here you would typically send the verification code to the user's email
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      const res = await handleSubmit(syntheticEvent);
      if (res) {
        setCurrentStep(3);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorWrong"));
      }

      toast.success(t("emailSuccess"), {
        style: { color: "#22C55E" },
        position: "top-right",
      });
      if (data) {
        return true;
      }
      // setStep("verification");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message.includes("Cette adresse email est déjà utilisée")
            ? t("emailAlreadyUseError")
            : error.message.includes("Ce numéro de téléphone est déjà utilisé")
            ? t("phoneAlreadyUseError")
            : error.message
          : t("errorWrong"),
        {
          style: { color: "#EF4444" },
          position: "top-right",
        }
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorWrong"));
      }

      toast.success(t("successSignup"), {
        style: { backgroundColor: "#22C55E", color: "white" },
        position: "top-right",
      });
      router.push("/signin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("errorWrong"), {
        style: { backgroundColor: "#EF4444", color: "white" },
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    // Here you would implement the logic to resend the verification code

    try {
      setIsResetLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorWrong"));
      }

      toast.success(t("emailSuccess"), {
        style: { color: "#22C55E" },
        position: "top-right",
      });
      if (data) {
        return true;
      }
      // setStep("verification");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("errorWrong"), {
        style: { color: "#EF4444" },
        position: "top-right",
      });
      console.log(error);
    } finally {
      setIsResetLoading(false);
    }
    // console.log("Resending verification code to:", formData.email);
  };

  if (step === "verification") {
    return (
      <Dialog open={true} onOpenChange={() => setStep("form")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
              {t("emailVerification")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {t("sendCode")}
              <span className="block font-medium text-gray-900 mt-1">
                {formData.email}
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerification} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-700">
                {t("veriCode")}
              </Label>
              <div className="relative group">
                <Input
                  id="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="h-11 pl-10 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 text-center tracking-[1em] text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                />
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98] shadow-lg shadow-[#67B142]/20"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  t("verifbtn")
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={resendVerificationCode}
                className="w-full h-11 text-[#67B142] hover:bg-[#67B142]/5 hover:text-[#34A853] transition-all duration-300"
              >
                {isResetLoading ? t("resendCodeLoading") : t("resendCode")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#FAFBFC] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-br from-[#67B142]/30 to-[#34A853]/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-[#67B142]/30 to-[#34A853]/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#67B142]/20 to-[#34A853]/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Left side - Progress */}
      <div className="hidden lg:flex w-1/2 bg-[#67B142]/5  items-center justify-center relative p-12">
        {/* Back to home */}
        <Link
          href="/"
          className="absolute top-8 left-8 text-muted-foreground hover:text-[#67B142] transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">{t("backHome")}</span>
        </Link>

        <div className="relative w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -bottom-8 right-20 w-72 h-72 bg-[#34A853]/30 rounded-full mix-blend-multiply filter blur-xl"
          />
          {/* Progress steps */}
          <div className="relative backdrop-blur-sm bg-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 border border-white/20">
            <div className="space-y-8">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= 1
                      ? "bg-gradient-to-r from-[#67B142] to-[#34A853] text-white shadow-lg shadow-[#67B142]/20"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <div className="flex-1 h-1 mx-4 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-[#67B142] to-[#34A853] transition-all duration-500 ease-out ${
                      currentStep > 1 ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= 2
                      ? "bg-gradient-to-r from-[#67B142] to-[#34A853] text-white shadow-lg shadow-[#67B142]/20"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                </div>
                <div className="flex-1 h-1 mx-4 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-[#67B142] to-[#34A853] transition-all duration-500 ease-out ${
                      currentStep > 2 ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === 3
                      ? "bg-gradient-to-r from-[#67B142] to-[#34A853] text-white shadow-lg shadow-[#67B142]/20"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  3
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
                  {currentStep === 1
                    ? t("stepperso")
                    : currentStep === 2
                    ? t("stepro")
                    : t("stepmail")}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentStep === 1
                    ? t("steppersodesc")
                    : currentStep === 2
                    ? t("steprodesc")
                    : t("stepmaildesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 px-6 py-12 bg-white lg:px-12 xl:px-24 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
                {t("createAcountTitle")}
              </h1>
              <p className="mt-3 text-gray-600">
                {currentStep === 1
                  ? t("firststep")
                  : currentStep === 2
                  ? t("secondstep")
                  : t("thirdstep")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700">
                          {t("fiststeppre")}
                        </Label>
                        <div className="relative group">
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`pl-10 h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 ${
                              errors.firstName ? "border-red-500" : ""
                            }`}
                            placeholder={t("fiststeppre")}
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
                        </div>
                        {errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500"
                          >
                            {errors.firstName}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700">
                          {t("thirdstepnom")}
                        </Label>
                        <div className="relative group">
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`pl-10 h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 ${
                              errors.lastName ? "border-red-500" : ""
                            }`}
                            placeholder={t("thirdstepnom")}
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
                        </div>
                        {errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500"
                          >
                            {errors.lastName}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        {t("thirdstepemail")}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          placeholder={t("thirdstepemail")}
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">
                        {t("thirdsteptel")}
                      </Label>
                      <div className="relative group">
                        <PhoneInput
                          international
                          defaultCountry="SN"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className={`w-full h-11 pl-0 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 ${
                            errors.phone ? "PhoneInput--error" : ""
                          }`}
                          placeholder="77 867 14 27"
                        />
                      </div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isStepLoading}
                      className="w-full h-11 bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98] shadow-lg shadow-[#67B142]/20"
                    >
                      {isStepLoading ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center">
                          {t("thirdstepconti")}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                ) : currentStep === 2 ? (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="accountType" className="text-gray-700">
                        {t("secacctype")}
                      </Label>
                      <Select
                        name="accountType"
                        value={formData.accountType}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "accountType", value },
                          })
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 hover:border-[#67B142]/50">
                          <SelectValue placeholder={t("secselectactype")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="personal"
                            className="cursor-pointer hover:bg-[#67B142]/10"
                          >
                            {t("secperso")}
                          </SelectItem>
                          <SelectItem
                            value="business"
                            className="cursor-pointer hover:bg-[#67B142]/10"
                          >
                            {t("secpro")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-gray-700">
                        {t("secbusname")}
                        {formData.accountType === "personal" && (
                          <span className="text-sm text-gray-500 ml-1">
                            {t("secopt")}
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 ${
                            errors.companyName ? "border-red-500" : ""
                          }`}
                          placeholder={t("secbusnameplace")}
                        />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
                      </div>
                      {errors.companyName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.companyName}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">
                        {t("secpass")}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-gray-700"
                      >
                        {t("secpassconf")}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 ${
                            errors.confirmPassword ? "border-red-500" : ""
                          }`}
                          placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-2">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("secback")}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={isStepLoading}
                        className="flex-1 h-11 bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98] shadow-lg shadow-[#67B142]/20"
                      >
                        {isStepLoading ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <span className="flex items-center justify-center">
                            {t("thirdstepconti")}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#67B142] to-[#34A853] p-4 shadow-lg shadow-[#67B142]/20">
                        <KeyRound className="w-full h-full text-white" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600">{t("sendCode")}</p>
                        <p className="font-medium text-gray-900">
                          {formData.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="verificationCode"
                        className="text-gray-700"
                      >
                        {t("veriCode")}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="verificationCode"
                          name="verificationCode"
                          value={formData.verificationCode}
                          onChange={handleChange}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-300 group-hover:border-[#67B142]/50 text-center tracking-[1em] ${
                            errors.verificationCode ? "border-red-500" : ""
                          }`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#67B142]" />
                      </div>
                      {errors.verificationCode && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.verificationCode}
                        </motion.p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resendVerificationCode}
                      className="w-full h-11 text-[#67B142] hover:bg-[#67B142]/5 hover:text-[#34A853] transition-all duration-300"
                    >
                      {isResetLoading
                        ? t("resendCodeLoading")
                        : t("resendCode")}
                    </Button>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("secback")}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-11 bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98] shadow-lg shadow-[#67B142]/20"
                      >
                        {t("register")}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center text-sm text-gray-600 mt-6"
              >
                {t("haveacount")}{" "}
                <Link
                  href="/signin"
                  className="font-medium text-[#67B142] hover:text-[#34A853] transition-colors"
                >
                  {t("login")}
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
