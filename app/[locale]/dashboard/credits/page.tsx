"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Package, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { color } from "framer-motion";
import { toast } from "sonner";
// import { toast } from "sonner";

interface SMSPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

const defaultPackages: SMSPackage[] = [
  {
    id: "basic",
    name: "Pack Démarrage",
    credits: 100,
    price: 5000,
    description: "Idéal pour commencer avec les SMS",
    features: [
      "100 crédits SMS",
      "Validité 12 mois",
      "Support basique",
      "Statistiques simples",
    ],
    isPopular: false,
  },
  {
    id: "pro",
    name: "Pack Professionnel",
    credits: 500,
    price: 20000,
    description: "Pour les entreprises en croissance",
    features: [
      "500 crédits SMS",
      "Validité 12 mois",
      "Support prioritaire",
      "Statistiques avancées",
      "API Access",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Pack Entreprise",
    credits: 2000,
    price: 70000,
    description: "Solution complète pour grandes entreprises",
    features: [
      "2000 crédits SMS",
      "Validité 12 mois",
      "Support dédié 24/7",
      "Statistiques détaillées",
      "API Access",
      "Personnalisation avancée",
    ],
    isPopular: false,
  },
];

export default function CreditsPage() {
  const [packages] = useState<SMSPackage[]>(defaultPackages);
  const [selectedPackage, setSelectedPackage] = useState<SMSPackage | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"orange" | "wave">(
    "orange"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handlePurchase = async (pkg: SMSPackage) => {
    setSelectedPackage(pkg);
    setShowPaymentDialog(true);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Validate phone number
      if (!phoneNumber.match(/^(70|75|76|77|78)\d{7}$/)) {
        toast.error("Numéro invalide", {
          style: {
            color: "#ef4444",
          },
        });
        return;
      }

      // Call payment API
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPackage?.id,
          provider: paymentMethod,
          phoneNumber: phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment failed");
      }

      // Redirect to payment URL
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Une erreur est survenue lors du paiement", {
        style:{
          color: "#ef4444"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Achetez des Crédits SMS</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choisissez le forfait qui correspond à vos besoins. Plus vous
            achetez de crédits, plus le prix unitaire est avantageux.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative ${
                pkg.isPopular
                  ? "border-2 border-[#67B142] shadow-lg"
                  : "border border-gray-200"
              }`}
            >
              {pkg.isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#67B142]">
                  Plus Populaire
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {pkg.name}
                </CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  {pkg.price.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-gray-500">
                  {(pkg.price / pkg.credits).toFixed(2)} FCFA par crédit
                </div>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#67B142]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#67B142] hover:bg-[#67B142]/90"
                  onClick={() => handlePurchase(pkg)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Acheter Maintenant
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Choisissez votre méthode de paiement</DialogTitle>
              <DialogDescription>
                Sélectionnez Orange Money ou Wave pour effectuer votre paiement
                de {selectedPackage?.price.toLocaleString()} FCFA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: "orange" | "wave") =>
                  setPaymentMethod(value)
                }
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="orange"
                    id="orange"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="orange"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#67B142] peer-data-[state=checked]:bg-[#67B142]/10 cursor-pointer"
                  >
                    <img
                      src="/orange-money.png"
                      alt="Orange Money"
                      className="h-12 w-auto"
                    />
                    <span className="mt-2">Orange Money</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="wave"
                    id="wave"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="wave"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#67B142] peer-data-[state=checked]:bg-[#67B142]/10 cursor-pointer"
                  >
                    <img src="/wave.png" alt="Wave" className="h-12 w-auto" />
                    <span className="mt-2">Wave</span>
                  </Label>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="phone"
                    placeholder="7X XXX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Entrez le numéro{" "}
                  {paymentMethod === "orange" ? "Orange Money" : "Wave"} qui
                  effectuera le paiement
                </p>
              </div>

              <Button
                className="w-full bg-[#67B142] hover:bg-[#67B142]/90"
                onClick={handlePayment}
                disabled={loading || !phoneNumber}
              >
                {loading ? (
                  "Traitement en cours..."
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payer {selectedPackage?.price.toLocaleString()} FCFA
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Information Section */}
        <div className="mt-12 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">
            Comment fonctionnent les crédits SMS ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Validité</h3>
              <p className="text-gray-600">
                Vos crédits sont valables 12 mois à partir de la date d'achat.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Utilisation</h3>
              <p className="text-gray-600">
                1 crédit = 1 SMS standard (160 caractères). Les messages plus
                longs utilisent plus de crédits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Paiement Sécurisé</h3>
              <p className="text-gray-600">
                Nous acceptons les paiements via Orange Money et Wave pour votre
                sécurité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
