"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Footer() {
  return (
    <motion.footer
      className="bg-black/90"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Logo and Contact Info */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-start space-y-4 lg:col-span-2"
          >
            <div className="flex items-center">
              <Image
                src="/images/favicon.png"
                alt="AxiomText"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-white text-2xl ml-3 font-semibold">AxiomTEXT</span>
            </div>
            
            <div className="text-gray-400">
              <p>Immeuble Rivonia, 3ème étage</p>
              <p>Route de Ngor, Almadies</p>
              <p>Dakar, Sénégal</p>
            </div>

            <div className="text-gray-400">
              <p>+221 77 808 55 33</p>
            </div>

            <div className="flex gap-4">
              <Link
                href="https://linkedin.com"
                className="text-gray-400 hover:text-[#67B142] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://facebook.com"
                className="text-gray-400 hover:text-[#67B142] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-400 hover:text-[#67B142] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-gray-400 hover:text-[#67B142] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://youtube.com"
                className="text-gray-400 hover:text-[#67B142] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Nos Canaux */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#67B142] text-xl font-medium mb-4">Nos Canaux</h3>
            <ul className="space-y-2">
              <li><Link href="/solutions/sms-pro" className="text-white hover:text-[#67B142] transition-colors">SMS PRO</Link></li>
              <li><Link href="/solutions/sms-vocal" className="text-white hover:text-[#67B142] transition-colors">SMS VOCAL</Link></li>
              <li><Link href="/solutions/location-bdd" className="text-white hover:text-[#67B142] transition-colors">LOCATION BDD</Link></li>
              <li><Link href="/solutions/sms-enrichi" className="text-white hover:text-[#67B142] transition-colors">SMS ENRICHI</Link></li>
              <li><Link href="/solutions/mail-to-sms" className="text-white hover:text-[#67B142] transition-colors">MAIL TO SMS</Link></li>
              <li><Link href="/solutions/sondages-sms" className="text-white hover:text-[#67B142] transition-colors">SONDAGES SMS</Link></li>
              <li><Link href="/solutions/vote-sms" className="text-white hover:text-[#67B142] transition-colors">VOTE SMS</Link></li>
              <li><Link href="/solutions/mobile-ticketing" className="text-white hover:text-[#67B142] transition-colors">MOBILE TICKETING</Link></li>
            </ul>
          </motion.div>

          {/* Informations */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#67B142] text-xl font-medium mb-4">Informations</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white hover:text-[#67B142] transition-colors">Qui sommes nous?</Link></li>
              <li><Link href="/how-it-works" className="text-white hover:text-[#67B142] transition-colors">Comment ça marche</Link></li>
              <li><Link href="/careers" className="text-white hover:text-[#67B142] transition-colors">Nous recrutons</Link></li>
              <li><Link href="/faq" className="text-white hover:text-[#67B142] transition-colors">FAQ</Link></li>
              <li><Link href="/testimonials" className="text-white hover:text-[#67B142] transition-colors">Témoignages clients</Link></li>
            </ul>
          </motion.div>

          {/* Légales */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#67B142] text-xl font-medium mb-4">Légales</h3>
            <ul className="space-y-2">
              <li><Link href="/legal" className="text-white hover:text-[#67B142] transition-colors">Mentions légales</Link></li>
              <li><Link href="/terms" className="text-white hover:text-[#67B142] transition-colors">CGU</Link></li>
              <li><Link href="/conditions" className="text-white hover:text-[#67B142] transition-colors">CGV</Link></li>
              <li><Link href="/privacy" className="text-white hover:text-[#67B142] transition-colors">Confidentialité</Link></li>
              <li><Link href="/cookies" className="text-white hover:text-[#67B142] transition-colors">Nos cookies</Link></li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-[#67B142]/5"
        >
          <p className="text-center text-sm text-gray-400">
            © 2025 Copyright Designed and Powered by AxiomText - Tous droits réservés.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
