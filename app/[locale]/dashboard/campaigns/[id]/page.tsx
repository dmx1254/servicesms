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
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Copy,
  Send,
  Trash2,
  Users,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface Contact {
  prenom: string;
  nom: string;
  telephone: string;
  classe?: string;
  moyenne?: number;
}

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
            La campagne que vous recherchez n'existe pas ou a été supprimée.
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/campaigns")}
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold"
              >
                {campaign.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mt-2"
              >
                <Badge
                  variant="outline"
                  className={
                    campaign.type === "academic"
                      ? "border-purple-200 text-purple-800 bg-purple-50"
                      : campaign.type === "marketing"
                      ? "border-blue-200 text-blue-800 bg-blue-50"
                      : "border-green-200 text-green-800 bg-green-50"
                  }
                >
                  {campaign.type === "academic"
                    ? "Académique"
                    : campaign.type === "marketing"
                    ? "Marketing"
                    : "Transactionnel"}
                </Badge>
                <Badge
                  className={
                    campaign.status === "draft"
                      ? "bg-gray-100 text-gray-800 flex items-center gap-1"
                      : campaign.status === "scheduled"
                      ? "bg-blue-100 text-blue-800 flex items-center gap-1"
                      : campaign.status === "sent"
                      ? "bg-green-100 text-green-800 flex items-center gap-1"
                      : "bg-red-100 text-red-800 flex items-center gap-1"
                  }
                >
                  {campaign.status === "draft" ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : campaign.status === "scheduled" ? (
                    <Calendar className="w-3.5 h-3.5" />
                  ) : campaign.status === "sent" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {campaign.status === "draft"
                    ? "Brouillon"
                    : campaign.status === "scheduled"
                    ? "Planifiée"
                    : campaign.status === "sent"
                    ? "Envoyée"
                    : "Échouée"}
                </Badge>
              </motion.div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {campaign.status === "draft" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleDuplicate}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Dupliquer
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
                <Button
                  onClick={handleSend}
                  className="gap-2 bg-[#67B142] hover:bg-[#67B142]/90"
                >
                  <Send className="h-4 w-4" />
                  Envoyer
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Destinataires
                </CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaign.recipientCount}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {campaign.recipientCount === 1 ? "contact" : "contacts"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Taux de succès
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">{successRate}%</div>
                  <Progress value={successRate} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{campaign.recipientCount} réussis</span>
                    <span>{campaign.failureCount} échoués</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Informations
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Créée le</span>
                  <span className="font-medium">
                    {format(new Date(campaign.createdAt), "Pp", { locale: fr })}
                  </span>
                </div>
                {campaign.scheduledDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Programmée pour</span>
                    <span className="font-medium">
                      {format(new Date(campaign.scheduledDate), "Pp", {
                        locale: fr,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Message Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Message</CardTitle>
                  <CardDescription>
                    Aperçu du message qui sera envoyé
                  </CardDescription>
                </div>
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {campaign.message}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contacts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Destinataires</CardTitle>
                  <CardDescription>
                    Liste des contacts qui recevront le message
                  </CardDescription>
                </div>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-100">
                {campaign.contacts.map((contact, index) => (
                  <motion.div
                    key={contact.telephone}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{contact.telephone}</p>
                        <p className="text-sm text-gray-500">
                          {contact.status}
                        </p>
                      </div>
                      {contact.classe && (
                        <Badge variant="outline" className="text-gray-600">
                          {contact.classe}
                        </Badge>
                      )}
                    </div>
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
