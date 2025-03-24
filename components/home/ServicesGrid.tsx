"use client";

import React from "react";
import {
  MessageSquare,
  Phone,
  MessageCircle,
  Mail,
  MessagesSquare,
  //   MessageCircleMore,
  //   Facebook,
  //   Instagram,
  PhoneCall,
  Search,
  Database,
  KeyRound,
  MessageSquarePlus,
} from "lucide-react";
import { useScopedI18n } from "@/locales/client";

export default function ServicesGrid() {
  const tScope = useScopedI18n("servicegrid");

  const services = [
    {
      id: 1,
      name: tScope("sms"),
      icon: <MessageSquare className="w-5 h-5 text-[#67B142]" />,
      type: "primary",
    },
    {
      id: 2,
      name: tScope("smsvocal"),
      icon: <Phone className="w-5 h-5 text-[#67B142]" />,
    },
    {
      id: 3,
      name: tScope("smsconv"),
      icon: <MessageCircle className="w-5 h-5 text-[#67B142]" />,
    },
    {
      id: 4,
      name: tScope("emailing"),
      icon: <Mail className="w-5 h-5 text-[#67B142]" />,
    },
    {
      id: 5,
      name: tScope("rbm"),
      icon: <MessagesSquare className="w-5 h-5 text-[#67B142]" />,
    },
    //   { id: 6, name: 'WhatsApp Business', icon: <MessageCircleMore className="w-5 h-5 text-[#67B142]" /> },
    //   { id: 7, name: 'FB Messenger', icon: <Facebook className="w-5 h-5 text-[#67B142]" /> },
    //   { id: 8, name: 'Instagram', icon: <Instagram className="w-5 h-5 text-[#67B142]" /> },
    {
      id: 9,
      name: tScope("numvir"),
      icon: <PhoneCall className="w-5 h-5 text-[#67B142]" />,
    },
    {
      id: 10,
      name: tScope("hlrlook"),
      icon: <Search className="w-5 h-5 text-[#67B142]" />,
    },
  ];

  const additionalServices = [
    //   { id: 9, name: 'Numéro Virtuel', icon: <PhoneCall className="w-5 h-5 text-[#67B142]" /> },
    //   { id: 10, name: 'HLR Lookup', icon: <Search className="w-5 h-5 text-[#67B142]" /> },
    {
      id: 11,
      name: tScope("locationbdd"),
      icon: <Database className="w-5 h-5 text-[#67B142]" />,
    },
    {
      id: 12,
      name: tScope("otp"),
      icon: <KeyRound className="w-5 h-5 text-[#67B142]" />,
    },
    {
      id: 13,
      name: tScope("enri"),
      icon: <MessageSquarePlus className="w-5 h-5 text-[#67B142]" />,
    },
  ];
  return (
    <section className="py-12 md:px-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                service.type === "primary"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200 hover:border-[#67B142]/50 hover:bg-[#67B142]/5 transition-colors"
              }`}
            >
              {service.icon}
              <span>{service.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {additionalServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-[#67B142]/50 hover:bg-[#67B142]/5 transition-colors"
            >
              {service.icon}
              <span>{service.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
