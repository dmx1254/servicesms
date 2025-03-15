import React from 'react';
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
  MessageSquarePlus
} from 'lucide-react';

const services = [
  { id: 1, name: 'SMS', icon: <MessageSquare className="w-5 h-5 text-[#67B142]" />, type: 'primary' },
  { id: 2, name: 'SMS Vocal', icon: <Phone className="w-5 h-5 text-[#67B142]" /> },
  { id: 3, name: 'SMS conversationnel', icon: <MessageCircle className="w-5 h-5 text-[#67B142]" /> },
  { id: 4, name: 'Emailing', icon: <Mail className="w-5 h-5 text-[#67B142]" /> },
  { id: 5, name: 'RBM Messages', icon: <MessagesSquare className="w-5 h-5 text-[#67B142]" /> },
//   { id: 6, name: 'WhatsApp Business', icon: <MessageCircleMore className="w-5 h-5 text-[#67B142]" /> },
//   { id: 7, name: 'FB Messenger', icon: <Facebook className="w-5 h-5 text-[#67B142]" /> },
//   { id: 8, name: 'Instagram', icon: <Instagram className="w-5 h-5 text-[#67B142]" /> },
{ id: 9, name: 'Numéro Virtuel', icon: <PhoneCall className="w-5 h-5 text-[#67B142]" /> },
  { id: 10, name: 'HLR Lookup', icon: <Search className="w-5 h-5 text-[#67B142]" /> },
];

const additionalServices = [
//   { id: 9, name: 'Numéro Virtuel', icon: <PhoneCall className="w-5 h-5 text-[#67B142]" /> },
//   { id: 10, name: 'HLR Lookup', icon: <Search className="w-5 h-5 text-[#67B142]" /> },
  { id: 11, name: 'Location de bases', icon: <Database className="w-5 h-5 text-[#67B142]" /> },
  { id: 12, name: 'OTP (mot de passe unique)', icon: <KeyRound className="w-5 h-5 text-[#67B142]" /> },
  { id: 13, name: 'SMS Enrichis', icon: <MessageSquarePlus className="w-5 h-5 text-[#67B142]" /> },
];

export default function ServicesGrid() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                service.type === 'primary'
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 hover:border-[#67B142]/50 hover:bg-[#67B142]/5 transition-colors'
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