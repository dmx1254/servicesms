"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  smsQuantity: number;
  totalPrice: number;
  selectedTier: {
    range: string;
    pricePerSms: number;
  };
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  smsQuantity,
  totalPrice,
  selectedTier,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange" | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handlePaymentMethodSelect = (method: "wave" | "orange") => {
    setPaymentMethod(method);
  };

  const handleConfirmPurchase = async () => {
    try {
      setLoading(true);
      // console.log("Achat confirmé", {
      //   userId: session?.user?.id,
      //   smsQuantity,
      //   totalPrice,
      //   paymentMethod,
      //   phoneNumber,
      // });

      const res = await fetch(`/api/payment/${paymentMethod}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          smsQuantity,
          totalPrice,
          paymentMethod,
          phoneNumber,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.wave_launch_url) {
        toast.success("Redirection vers la plateforme de paiement...", {
          style: {
            backgroundColor: "#67B142",
            color: "#fff",
          },
          position: "top-right",
        });
        window.location.href = data.wave_launch_url;
      }
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // Logique de confirmation d'achat à implémenter
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[#67B142] text-center">
            Confirmation de l&apos;achat de SMS
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Vérifiez et confirmez vos détails d&apos;achat
          </DialogDescription>
        </DialogHeader>

        <Card className="border-none bg-[#67B142]/10 p-6 rounded-xl">
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Quantité de SMS</p>
                <p className="text-2xl font-bold text-[#67B142]">
                  {smsQuantity} SMS
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Tranche tarifaire</p>
                <p className="text-xl font-semibold text-[#67B142]">
                  {selectedTier.range}
                </p>
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">Montant total</p>
              <p className="text-3xl font-bold text-[#67B142]">
                {totalPrice} FCFA
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone-number"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="phone-number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Entrez votre numéro de téléphone"
                className="w-full p-3 border-2 rounded-[6px] border-[#67B142]/30 focus:ring-2 focus:ring-[#67B142]/50 transition-all"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Choisissez votre méthode de paiement
              </p>
              <div className="flex justify-center gap-6">
                <motion.div
                  onClick={() => handlePaymentMethodSelect("wave")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "wave"
                      ? "border-[#67B142] bg-[#67B142]/10"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src="/wave.png"
                    alt="wave"
                    width={100}
                    height={100}
                    className="h-12 w-auto object-cover"
                  />
                </motion.div>
                <motion.div
                  onClick={() => handlePaymentMethodSelect("orange")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "orange"
                      ? "border-[#67B142] bg-[#67B142]/10"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src="/orange-money.png"
                    alt="wave"
                    width={100}
                    height={100}
                    className="h-12 w-auto object-cover"
                  />
                </motion.div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleConfirmPurchase}
                disabled={!phoneNumber || !paymentMethod}
                className="w-full bg-[#67B142] hover:bg-[#67B142]/90 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  "Confirmer l'achat"
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
