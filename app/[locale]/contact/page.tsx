"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <motion.div variants={fadeIn} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une question ? Un projet ? N&apos;hésitez pas à nous contacter.
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            variants={fadeIn}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-12 h-12 bg-[#67B142]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-[#67B142]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
            <p className="text-gray-600">+221 77 808 55 33</p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-12 h-12 bg-[#67B142]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#67B142]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-600">contact@axiomtext.com</p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-12 h-12 bg-[#67B142]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-[#67B142]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Adresse</h3>
            <p className="text-gray-600">Dakar, Senegal</p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:ring-2 focus:ring-[#67B142] focus:border-transparent transition-colors"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:ring-2 focus:ring-[#67B142] focus:border-transparent transition-colors"
                  placeholder="Nom"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:ring-2 focus:ring-[#67B142] focus:border-transparent transition-colors"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:ring-2 focus:ring-[#67B142] focus:border-transparent transition-colors"
                  placeholder="+221 77 808 55 33"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-[6px] border-gray-300 focus:ring-2 focus:ring-[#67B142] focus:border-transparent transition-colors"
                placeholder="Comment pouvons-nous vous aider ?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:ring-2 focus:ring-[#67B142] focus:border-transparent transition-colors resize-none"
                placeholder="Votre message..."
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-[6px]">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-[6px]">
                Votre message a été envoyé avec succès ! Nous vous répondrons
                dans les plus brefs délais.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3 bg-[#67B142] text-white rounded-[6px] hover:bg-[#4e8a2f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
