"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Trash2,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Campaign {
  _id: string;
  id: string;
  name: string;
  type: "academic" | "marketing" | "transactional";
  status: "draft" | "scheduled" | "sent" | "failed";
  recipientCount: number;
  successCount: number;
  failureCount: number;
  createdAt: Date;
  scheduledDate?: Date;
  message: string;
}

export default function CampaignsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/api/campaigns");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des campagnes");
        }
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error(
          error instanceof Error ? error.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchCampaigns();
    }
  }, [session]);

  // Filter and search campaigns

  useEffect(() => {
    const filteredCampaigns = campaigns.filter((campaign) => {
      const matchesSearch = campaign.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || campaign.type === filterType;
      const matchesStatus =
        filterStatus === "all" || campaign.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
    setFilteredCampaigns(filteredCampaigns);
  }, [campaigns, searchTerm, filterType, filterStatus]);

  // Campaign stats
  const stats = {
    total: campaigns.length,
    sent: campaigns.filter((c) => c.status === "sent").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
  };

  // Handle campaign deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/campaigns/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      toast.success("Campagne supprimée avec succès", {
        style: {
          color: "#67B142",
        },
        position: "top-right",
      });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    }
  };

  // Handle campaign sending
  const handleSend = async (campaign: Campaign) => {
    try {
      const response = await fetch("/api/campaigns/" + campaign.id, {
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

      const updatedCampaign = await response.json();
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaign.id ? updatedCampaign : c))
      );
      toast.success("Campagne envoyée avec succès");
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: Campaign["status"] }) => {
    const statusConfig = {
      draft: {
        label: "Brouillon",
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
      },
      scheduled: {
        label: "Programmée",
        color: "bg-blue-100 text-blue-800",
        icon: Calendar,
      },
      sent: {
        label: "Envoyée",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle2,
      },
      failed: {
        label: "Échouée",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`${config.color} font-medium rounded-[10px] shadow-md p-1.5`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Type badge component
  const TypeBadge = ({ type }: { type: Campaign["type"] }) => {
    const typeConfig = {
      academic: {
        label: "Académique",
        color: "border-purple-200 text-purple-800",
      },
      marketing: {
        label: "Marketing",
        color: "border-blue-200 text-blue-800",
      },
      transactional: {
        label: "Transactionnel",
        color: "border-green-200 text-green-800",
      },
    };

    const config = typeConfig[type];

    return (
      <Badge
        variant="outline"
        className={`${config.color} capitalize font-medium rounded-[10px] shadow-md p-1.5`}
      >
        {config.label}
      </Badge>
    );
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/campaigns/${id}`);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
            Campagnes SMS
          </h1>
          <p className="text-gray-500 mt-2">
            Gérez et suivez vos campagnes de communication
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/campaigns/new")}
          className="bg-[#67B142] rounded hover:bg-[#67B142]/90 shadow-lg shadow-[#67B142]/20 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Campagne
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Campagnes
            </CardTitle>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="mt-3 bg-emerald-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${(stats.total / 100) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-emerald-500">●</span>
              {stats.sent} campagnes envoyées
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Envoyées
            </CardTitle>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{stats.sent}</div>
            <div className="mt-3 bg-blue-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${(stats.sent / stats.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-blue-500">●</span>
              {Math.round((stats.sent / stats.total) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Programmées
            </CardTitle>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {stats.scheduled}
            </div>
            <div className="mt-3 bg-purple-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style={{ width: `${(stats.scheduled / stats.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-purple-500">●</span>
              {Math.round((stats.scheduled / stats.total) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Brouillons
            </CardTitle>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {stats.draft}
            </div>
            <div className="mt-3 bg-amber-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${(stats.draft / stats.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-amber-500">●</span>
              {Math.round((stats.draft / stats.total) * 100)}% du total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et Recherche */}
      <Card className="bg-white shadow-lg rounded-2xl border border-gray-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une campagne..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50/50 border-gray-200 rounded focus:ring-[#67B142] focus:border-[#67B142]"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] bg-gray-50/50 rounded border-gray-200">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="academic">Académique</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="transactional">Transactionnel</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-gray-50/50 rounded border-gray-200">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="scheduled">Programmée</SelectItem>
                  <SelectItem value="sent">Envoyée</SelectItem>
                  <SelectItem value="failed">Échouée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des Campagnes */}
      <Card className="bg-white shadow-lg rounded-2xl border border-gray-100">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Liste des Campagnes
          </CardTitle>
          <CardDescription>
            {filteredCampaigns.length} campagne
            {filteredCampaigns.length > 1 ? "s" : ""} trouvée
            {filteredCampaigns.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#67B142]" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                Aucune campagne trouvée
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Essayez de modifier vos filtres ou créez une nouvelle campagne
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 border-b border-gray-100">
                    <TableHead className="w-[300px] py-4 text-gray-600 font-semibold">
                      Nom
                    </TableHead>
                    <TableHead className="py-4 text-gray-600 font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="py-4 text-gray-600 font-semibold">
                      Statut
                    </TableHead>
                    <TableHead className="py-4 text-gray-600 font-semibold">
                      Destinataires
                    </TableHead>
                    <TableHead className="py-4 text-gray-600 font-semibold">
                      Date de création
                    </TableHead>
                    <TableHead className="py-4 text-gray-600 font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredCampaigns.map((campaign, index) => (
                      <motion.tr
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group hover:bg-gray-50/80 cursor-pointer border-b border-gray-100 transition-colors duration-200"
                        onClick={() => handleViewDetails(campaign._id)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                campaign.type === "academic"
                                  ? "bg-[#67B142]/10 text-[#67B142]"
                                  : campaign.type === "marketing"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 group-hover:text-[#67B142] transition-colors duration-200">
                                {campaign.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {campaign.message.length > 50
                                  ? campaign.message.substring(0, 50) + "..."
                                  : campaign.message}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <TypeBadge type={campaign.type} />
                        </TableCell>
                        <TableCell className="py-4">
                          <StatusBadge status={campaign.status} />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-violet-100 rounded">
                              <Users className="w-4 h-4 text-violet-900" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">
                                {campaign.recipientCount}
                              </p>
                              {campaign.status === "sent" && (
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="text-green-600">
                                    ✓ {campaign.successCount}
                                  </span>
                                  {campaign.failureCount > 0 && (
                                    <span className="text-red-600">
                                      • {campaign.failureCount}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-fuchsia-100 rounded">
                              <Calendar className="w-4 h-4 text-fuchsia-900" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">
                                {format(
                                  new Date(campaign.createdAt),
                                  "dd MMM yyyy",
                                  {
                                    locale: fr,
                                  }
                                )}
                              </p>
                              {campaign.scheduledDate && (
                                <p className="text-xs text-gray-500">
                                  Programmée:{" "}
                                  {format(
                                    new Date(campaign.scheduledDate),
                                    "HH:mm",
                                    {
                                      locale: fr,
                                    }
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px] bg-white shadow-lg rounded-xl border border-gray-100"
                            >
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(campaign.id);
                                }}
                                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>

                              {campaign.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSend(campaign);
                                  }}
                                  className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Envoyer
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-gray-100" />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(campaign._id);
                                }}
                                className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
