"use client";

import React, { useState, useEffect } from "react";
import LanguageSwitcher from "./layout/LanguageSwitcher";
import { Separator } from "./ui/separator";
import useStore from "@/app/lib/manage";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Bell, ChevronDown, Sparkles } from "lucide-react";
import CountUp from "react-countup";

const DashTopBar = () => {
  const { data: session } = useSession();
  const { solde } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const textVariants = {
    open: { opacity: 1, x: 0, scale: 1 },
    closed: { opacity: 0, x: -10, scale: 0.9 },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2 },
    },
  };

  // const avatarColors = [
  //   "bg-gradient-to-br from-purple-400 to-indigo-600",
  //   "bg-gradient-to-br from-blue-400 to-teal-500",
  //   "bg-gradient-to-br from-emerald-400 to-cyan-500",
  //   "bg-gradient-to-br from-orange-400 to-rose-500",
  // ];

  // Sélection d'une couleur basée sur le nom
  // const colorIndex = session?.user?.firstName
  //   ? (session.user.firstName.charCodeAt(0) +
  //       (session?.user?.lastName?.charCodeAt(0) || 0)) %
  //     avatarColors.length
  //   : 0;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex font-rubik items-center justify-end gap-3 px-6"
    >
      <div className="mr-auto text-sm text-[#646464]">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>

      {/* <Separator
        orientation="vertical"
        className="mx-2 text-[#646464]/30 w-[1px] h-6"
      /> */}

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            2
          </span>
        </button>
      </motion.div>
      <Separator
        orientation="vertical"
        className="mx-2 text-[#646464]/30 w-[1px] h-6"
      />

      <LanguageSwitcher />

      <Separator
        orientation="vertical"
        className="mx-2 text-[#646464]/30 w-[1px] h-6"
      />

      <motion.div
        variants={pulseVariants}
        // animate="pulse"
        className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#67B142]/10 border border-green-50"
      >
        <Sparkles size={16} className="text-green-500" />
        <span className="text-sm text-gray-700">Solde SMS</span>
        <div className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
          <CountUp end={solde} duration={3} />
        </div>
      </motion.div>

      {/* <Separator
        orientation="vertical"
        className="mx-2 text-[#646464]/30 w-[1px] h-6"
      /> */}

      {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1.5 pl-2 pr-3 hover:bg-gray-100 transition-all"
        >
          <div
            className={`w-8 h-8 rounded-full bg-[#67B142]/10 text-[#67B142] flex items-center justify-center font-medium text-sm shadow-inner`}
          >
            {session?.user?.firstName?.[0]}
            {session?.user?.lastName?.[0]}
            <motion.div
              className="absolute inset-0 rounded-lg bg-white opacity-10"
              animate={{
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </div>

          <AnimatePresence>
            <motion.div
              variants={textVariants}
              initial="closed"
              animate="open"
              className="text-left"
            >
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.firstName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.lastName}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </motion.div> */}
    </motion.div>
  );
};

export default DashTopBar;
