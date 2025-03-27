"use client";

import React, { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Info, Loader, MessageSquare, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useStore from "@/app/lib/manage";

const QuiSendPage = () => {
  const { data: session } = useSession();
  const { addSolde } = useStore();
  const [message, setMessage] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);

  const handleSetMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;

    if (newMessage.length > 160) {
      return;
    }

    setMessage(newMessage);
  };

  // Calculate SMS details
  const charCount = message.length;
  const smsCount = Math.ceil(charCount / 160);

  const handleSendMessage = async () => {
    if (!phone) {
      toast.error("Veuillez saisir un numéro de téléphone", {
        style: { color: "#EF4444" },
        position: "top-right",
      });
      return;
    } else if (!message) {
      toast.error("Le message ne doit pas être vide", {
        style: { color: "#EF4444" },
        position: "top-right",
      });
      return;
    } else {
      try {
        setIsSmsLoading(true);
        const recipient = phone.trim();

        const response = await fetch("/api/sms/send-unique", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient,
            message,
            signature: session?.user?.companyName,
          }),
        });

        const responseClone = response.clone();
        const responseJson = await responseClone.json();
        if (responseJson.error) {
          toast.error(responseJson.error, {
            style: { color: "#EF4444" },
            position: "top-right",
          });
          return;
        }

        toast.success("1 message envoyé avec succès", {
          style: { color: "#67B142" },
          position: "top-right",
        });
        // setMessageStatuses((prev) => [...prev, messageStatus]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSmsLoading(false);

        const response = await fetch(
          `/api/user/${session?.user?.id}/getSmsCredit`
        );
        const data = await response.json();
        if (data) {
          addSolde(data.smsCredits);
        }
      }
    }
  };

  // Count successes and failures
  // console.log(failedMessages);

  return (
    <div className="space-y-6">
      {" "}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#67B142]/10 rounded-2xl">
            <MessageSquare className="w-6 h-6 text-[#67B142]" />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            Composez votre message
          </span>
        </div>

        <div className="relative group">
          <Textarea
            value={message}
            onChange={handleSetMessage}
            className={`h-48 font-mono text-base border-2 focus:border-[#67B142] transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md`}
            placeholder="Tapez votre message..."
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-6 sm:justify-between">
          <div className="flex flex-col items-start gap-3">
            <span>Numéro téléphone</span>
            <Input
              type="tel"
              value={phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                // N'autoriser que +, espace et chiffres
                const sanitizedValue = e.target.value.replace(/[^0-9+\s]/g, "");
                setPhone(sanitizedValue);
              }}
              placeholder="+221 77 602 14 73"
              className="min-w-56 border-gray-100 text-inherit focus:border-[#67B142] rounded-[6px]"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              }}
            />
            <span className="text-xs text-red-400 w-full max-w-56">
              NB: le numéro doit commencer par l&apos;indicatif du pays.
            </span>
          </div>
          <Button
            onClick={handleSendMessage}
            className="px-6 min-w-44 py-3 text-sm font-medium text-white bg-[#67B142] rounded-2xl hover:bg-[#52982f] transition-all duration-300"
          >
            {isSmsLoading ? (
              <Loader className="w-4 h-4 animate-spin text-white" />
            ) : (
              "Envoyer"
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span
                className={`text-sm ${
                  charCount > 160 ? "text-amber-500" : "text-gray-600"
                }`}
              >
                {charCount}/160 car.
              </span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span
                className={`font-medium ${
                  smsCount > 1 ? "text-amber-500" : "text-[#67B142]"
                }`}
              >
                {smsCount} {smsCount > 1 ? "SMS" : "SMS"}
              </span>
              {smsCount > 1 && (
                <div className="text-xs px-2 py-1 bg-amber-50 text-amber-500 rounded-lg">
                  {Math.ceil((160 - (charCount % 160)) % 160)} car. avant
                  prochain SMS
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {smsCount > 1
                ? `${Math.floor(charCount / 160)} SMS complet${
                    smsCount > 2 ? "s" : ""
                  } + ${charCount % 160} car.`
                : "Standard GSM"}
            </span>
          </div>
        </div>
      </motion.div>
      {/* Sender Name */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 bg-white rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#67B142]/10 rounded-xl">
              <Users className="w-5 h-5 text-[#67B142]" />
            </div>
            <span className="font-medium text-gray-800">Émetteur</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Maximum 11 caractères</span>
          </div>
        </div>
        <div className="relative">
          <Input
            placeholder={session?.user?.companyName || "?"}
            maxLength={11}
            className="max-w-[200px] border-2 focus:border-[#67B142] rounded-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#67B142]">
            {session?.user?.companyName.length ?? 8}/11
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuiSendPage;
