"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Validation schemas
const stepOneSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
});

const stepTwoSchema = z
  .object({
    accountType: z.enum(["personal", "business"]),
    companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string(),
  })
  .refine((data: Partial<FormData>) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const router = useRouter();
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
  const [step, setStep] = useState<"form" | "verification">("form");
  const [verificationCode, setVerificationCode] = useState("");

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
    }
  };

  const validateStepTwo = () => {
    try {
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
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStepOne()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStepTwo()) {
      // Here you would typically send the verification code to the user's email
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      await handleSubmit(syntheticEvent);
      setCurrentStep(3);
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
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success("Code de vérification envoyé par email", {
        style: { backgroundColor: "#22C55E", color: "white" },
      });
      setStep("verification");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
        {
          style: { backgroundColor: "#EF4444", color: "white" },
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
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success("Inscription réussie", {
        style: { backgroundColor: "#22C55E", color: "white" },
      });
      router.push("/signin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
        {
          style: { backgroundColor: "#EF4444", color: "white" },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = () => {
    // Here you would implement the logic to resend the verification code
    console.log("Resending verification code to:", formData.email);
  };

  if (step === "verification") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Vérification de l&apos;email
          </h2>
          <form onSubmit={handleVerification} className="mt-8 space-y-6">
            <div>
              <label htmlFor="code" className="sr-only">
                Code de vérification
              </label>
              <input
                id="code"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Code de vérification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#67B142] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin text-white" />
              ) : (
                "Vérifier"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-white to-gray-50">
      {/* Left side - Progress */}
      <div className="hidden lg:flex w-1/2 bg-[#67B142]/5 items-center justify-center relative p-12">
        {/* Back to home */}
        <Link
          href="/"
          className="absolute top-8 left-8 text-muted-foreground hover:text-[#67B142] transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
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

          {/* Progress steps */}
          <div className="relative bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-50 border border-white/20">
            <div className="space-y-8">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1
                      ? "bg-[#67B142] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div
                    className={`h-full bg-[#67B142] transition-all duration-300 ${
                      currentStep > 1 ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2
                      ? "bg-[#67B142] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div
                    className={`h-full bg-[#67B142] transition-all duration-300 ${
                      currentStep > 2 ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 3
                      ? "bg-[#67B142] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentStep === 1
                    ? "Informations personnelles"
                    : currentStep === 2
                    ? "Informations professionnelles"
                    : "Vérification email"}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentStep === 1
                    ? "Commencez par renseigner vos informations de base"
                    : currentStep === 2
                    ? "Configurez votre compte professionnel"
                    : "Entrez le code de vérification reçu par email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 px-6 py-12 lg:px-12 xl:px-24 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#67B142] to-[#34A853]">
                Créer un compte
              </h1>
              <p className="text-muted-foreground mt-2">
                {currentStep === 1
                  ? "Étape 1 sur 3 : Vos informations"
                  : currentStep === 2
                  ? "Étape 2 sur 3 : Configuration du compte"
                  : "Étape 3 sur 3 : Vérification"}
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
                        <Label htmlFor="firstName">Prénom</Label>
                        <div className="relative">
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] ${
                              errors.firstName ? "border-red-500" : ""
                            }`}
                            placeholder="John"
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                        {errors.firstName && (
                          <p className="text-sm text-red-500">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <div className="relative">
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] ${
                              errors.lastName ? "border-red-500" : ""
                            }`}
                            placeholder="Doe"
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                        {errors.lastName && (
                          <p className="text-sm text-red-500">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          placeholder="john.doe@example.com"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <PhoneInput
                          international
                          defaultCountry="SN"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className={`w-full ${
                            errors.phone ? "PhoneInput--error" : ""
                          }`}
                          inputClassName="w-full h-10 rounded-xl focus:outline-none"
                          placeholder="77 867 14 27"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <span className="flex items-center justify-center">
                          Continuer
                          <ArrowRight className="ml-2 h-4 w-4" />
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
                      <Label htmlFor="accountType">Type de compte</Label>
                      <Select
                        name="accountType"
                        value={formData.accountType}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "accountType", value },
                          })
                        }
                      >
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]">
                          <SelectValue placeholder="Sélectionnez le type de compte" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personnel</SelectItem>
                          <SelectItem value="business">
                            Professionnel
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">
                        Nom de l&apos;entreprise
                        {formData.accountType === "personal" && " (Optionnel)"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className={`pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] ${
                            errors.companyName ? "border-red-500" : ""
                          }`}
                          placeholder="Nom de votre entreprise"
                        />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                      {errors.companyName && (
                        <p className="text-sm text-red-500">
                          {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] ${
                            errors.confirmPassword ? "border-red-500" : ""
                          }`}
                          placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-xl border-gray-200"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Continuer
                        <ArrowRight className="ml-2 h-4 w-4" />
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
                    <div className="text-center space-y-2">
                      <KeyRound className="mx-auto h-12 w-12 text-[#67B142]" />
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Nous avons envoyé un code de vérification à
                        </p>
                        <p className="font-medium text-gray-900">
                          {formData.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">
                        Code de vérification
                      </Label>
                      <div className="relative">
                        <Input
                          id="verificationCode"
                          name="verificationCode"
                          value={formData.verificationCode}
                          onChange={handleChange}
                          className={`pl-10 rounded-xl border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] text-center tracking-[1em] ${
                            errors.verificationCode ? "border-red-500" : ""
                          }`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                      {errors.verificationCode && (
                        <p className="text-sm text-red-500">
                          {errors.verificationCode}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resendVerificationCode}
                      className="w-full text-[#67B142] hover:text-[#34A853] hover:bg-[#67B142]/5"
                    >
                      Renvoyer le code
                    </Button>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-xl border-gray-200"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#67B142] to-[#34A853] text-white rounded-xl hover:opacity-90 transition-opacity"
                      >
                        S&apos;inscrire
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center text-sm text-muted-foreground mt-6"
              >
                Déjà inscrit ?{" "}
                <Link
                  href="/signin"
                  className="text-[#67B142] font-medium hover:text-[#34A853] transition-colors"
                >
                  Se connecter
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
