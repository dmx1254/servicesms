"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface PricingTier {
  range: string;
  volumeMin: number;
  volumeMax: number;
  pricePerSms: number;
}

const PRICING_TIERS: PricingTier[] = [
  { range: "1 à 4,999", volumeMin: 1, volumeMax: 4999, pricePerSms: 28.24 },
  {
    range: "5,000 à 9,999",
    volumeMin: 5000,
    volumeMax: 9999,
    pricePerSms: 27.58,
  },
  {
    range: "10,000 à 24,999",
    volumeMin: 10000,
    volumeMax: 24999,
    pricePerSms: 26.93,
  },
  {
    range: "25,000 à 49,999",
    volumeMin: 25000,
    volumeMax: 49999,
    pricePerSms: 26.27,
  },
  {
    range: "50,000 à 99,999",
    volumeMin: 50000,
    volumeMax: 99999,
    pricePerSms: 25.58,
  },
  {
    range: "100,000 à 250,000",
    volumeMin: 100000,
    volumeMax: 250000,
    pricePerSms: 24.3,
  },
];

const PricingPage: React.FC = () => {
  const [smsQuantity, setSmsQuantity] = useState<string | number>("1");
  const [selectedTier, setSelectedTier] = useState<PricingTier>(
    PRICING_TIERS[0]
  );

  const handleSmsQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = e.target.value;

    const quantity = parseInt(e.target.value);
    setSmsQuantity(qty);

    const tier =
      PRICING_TIERS.find(
        (t) => quantity >= t.volumeMin && quantity <= t.volumeMax
      ) || PRICING_TIERS[0];

    setSelectedTier(tier);
  };

  const calculateTotalPrice = () => {
    return (Number(smsQuantity) * Number(selectedTier.pricePerSms)).toFixed(2);
  };

  return (
    <div className="min-h-screen w-full relative pb-12 flex items-center justify-center mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* <div className="w-full absolute h-96 bg-gradient-to-br from-[#E8F9E6] to-[#67B142]"></div> */}
        <div className="text-center w-full mb-12 h-96 flex flex-col items-center justify-start text-white bg-gradient-to-br from-[#E8F9E6] to-[#7dae65]">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4 drop-shadow-lg pt-14"
          >
            Nos Formules d&apos;Envois d&apos;SMS
          </motion.h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Consultez nos tarifs flexibles et adaptez votre communication à vos
            besoins précis
          </p>
        </div>

        <Card
          className="mx-auto z-50 -mt-48 border-none w-full max-w-6xl px-4"
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
        >
          <CardContent className="p-6 bg-white rounded-b-xl">
            <CardTitle className="font-bold text-3xl text-center">
              Tarif/SMS
            </CardTitle>
            <CardHeader className="text-center text-gray-500">
              Découvrez nos tarifs pour l&apos;envoi d&apos;SMS
            </CardHeader>

            <div className="grid grid-cols-6 text-center items-center gap-4 mb-8 border-b pb-8">
              {PRICING_TIERS.map((tier, index) => (
                <motion.div
                  key={tier.range}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  className="text-[#67B142] font-semibold flex flex-col p-2 rounded-lg transition-all duration-300  hover:bg-[#67B142]/10 hover:shadow-md cursor-pointer"
                >
                  <span className="text-2xl font-bold">
                    {tier.pricePerSms}
                    <span className="text-sm ml-1">FCFA</span>
                  </span>
                  <span className="text-sm text-gray-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {tier.range}
                  </span>
                  <div className="h-1.5 w-full bg-[#67B142]/20 mt-2 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(index + 1) * 15}%` }}
                      transition={{
                        delay: 0.1 * index,
                        type: "spring",
                        stiffness: 50,
                      }}
                      className="h-full bg-[#67B142] rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="relative">
                <label
                  htmlFor="sms-quantity"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Quantité de SMS
                </label>
                <input
                  type="number"
                  id="sms-quantity"
                  min="1"
                  value={smsQuantity}
                  onChange={handleSmsQuantityChange}
                  className="w-full p-3 border-2 rounded-[6px] border-[#67B142]/30 focus:ring-2 focus:ring-[#67B142]/50 transition-all"
                />
                <span className="absolute text-xl text-stone-400 top-[50%] left-[82%]">
                  SMS
                </span>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold mb-2 text-gray-700">
                  Tranche tarifaire
                </p>
                <p className="text-[#67B142] font-bold text-xl">
                  {selectedTier.range}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold mb-2 text-gray-700">
                  Montant Total (TTC)
                </p>
                <p className="text-3xl font-bold text-[#67B142]">
                  {calculateTotalPrice()} FCFA
                </p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8"
            >
              <Button
                className="w-full bg-[#67B142] hover:bg-[#67B142]/90 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                size="lg"
                disabled={Number(smsQuantity) < 1}
                asChild
              >
                <Link href="/dashboard/credits">Commander mes SMS</Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PricingPage;
