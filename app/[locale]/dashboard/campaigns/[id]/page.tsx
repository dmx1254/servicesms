"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Copy,
  Send,
  Trash2,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react";

interface Campaign {
  _id: string;
  name: string;
  type: string;
  status: string;
  message: string;
  contacts: Array<{
    telephone: string;
    status: string;
    classe?: string;
  }>;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  createdAt: string;
  scheduledDate?: string;
}

export default function CampaignDetails() {
  const router = useRouter();
  const { data: session } = useSession();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const campaignId = params.id as string;

  // console.log(campaign);

  // console.log("params ", params);
  // console.log("campaignId ", campaignId);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        setError(null);

        // console.log("Fetching campaign with ID:", params.id);
        const response = await fetch(`/api/campaigns/${params.id}`);
        // console.log("API Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error response:", errorData);
          throw new Error(
            errorData.error || "Erreur lors du chargement de la campagne"
          );
        }

        const data = await response.json();
        // console.log("Campaign data received:", data);
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setError(error instanceof Error ? error.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchCampaign();
    }
  }, [params.id, session, router]);

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "duplicate" }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la duplication");
      }

      toast.success("Campagne dupliquée avec succès");
      router.push("/dashboard/campaigns");
    } catch (error) {
      console.error("Error duplicating campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
        {
          style: {
            color: "#ef4444",
          },
        }
      );
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast.success("Campagne supprimée avec succès", {
        style: {
          color: "#22c55e",
        },
      });
      router.push("/dashboard/campaigns");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
        {
          style: {
            color: "#ef4444",
          },
        }
      );
    }
  };

  const handleSend = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send",
          status: "sent",
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi");
      }

      toast.success("Campagne envoyée avec succès");
      router.push("/dashboard/campaigns");
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Campagne non trouvée
          </h2>
          <p className="text-gray-500">
            La campagne que vous recherchez n&apos;existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  const successRate =
    campaign.recipientCount > 0
      ? Math.round((campaign.contacts.length / campaign.recipientCount) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* En-tête avec animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/campaigns")}
              className="h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
                {campaign.name}
              </h1>
              <p className="text-gray-500 mt-1">Détails de la campagne</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {campaign.status === "draft" && (
              <Button
                onClick={handleSend}
                className="bg-[#67B142] hover:bg-[#67B142]/90 text-white shadow-lg shadow-[#67B142]/20 transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            )}
            {/* <Button
              onClick={handleDuplicate}
              variant="outline"
              disabled
              className="border-gray-200 opacity-0 rounded hover:bg-gray-50 transition-all duration-300"
            >
              <Copy className="w-4 h-4 mr-2" />
              Dupliquer
            </Button> */}
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="bg-red-500 rounded hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </motion.div>

        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#67B142]/5 to-transparent p-6">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#67B142]" />
                  Destinataires
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {campaign.recipientCount}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Succès</span>
                      <span className="text-green-600 font-medium">
                        {campaign.successCount}
                      </span>
                    </div>
                    <Progress value={successRate} className="h-2 bg-gray-100" />
                  </div>
                  {campaign.failureCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Échecs</span>
                      <span className="text-red-600 font-medium">
                        {campaign.failureCount}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Type et Statut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent p-6">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type</span>
                    <Badge
                      variant="outline"
                      className="capitalize font-medium px-3 py-1 rounded-lg"
                    >
                      {campaign.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Statut</span>
                    <Badge
                      className={`capitalize font-medium px-3 py-1 rounded-lg ${
                        campaign.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : campaign.status === "draft"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent p-6">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Création</span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(campaign.createdAt), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </span>
                  </div>
                  {campaign.scheduledDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Programmée pour</span>
                      <span className="font-medium text-gray-900">
                        {format(
                          new Date(campaign.scheduledDate),
                          "dd MMM yyyy HH:mm",
                          { locale: fr }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Message de la campagne */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white shadow-lg rounded-2xl border border-gray-100">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#67B142]" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap rounded-xl bg-gray-50/50 p-4 border border-gray-100">
                {campaign.message}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Liste des contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white shadow-lg rounded-2xl border border-gray-100">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#67B142]" />
                Liste des contacts
              </CardTitle>
              <CardDescription>
                {campaign.contacts.length} contact
                {campaign.contacts.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {campaign.contacts.map((contact, index) => (
                  <motion.div
                    key={contact.telephone}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {contact.telephone}
                        </p>
                        {contact.classe && (
                          <p className="text-sm text-gray-500">
                            Classe: {contact.classe}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={`capitalize ${
                        contact.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : contact.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
