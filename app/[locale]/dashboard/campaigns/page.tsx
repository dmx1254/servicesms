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
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchCampaigns();
    }
  }, [session]);

  // Filter and search campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || campaign.type === filterType;
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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

      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campagne supprimée avec succès");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  // Handle campaign duplication
  const handleDuplicate = async (campaign: Campaign) => {
    try {
      const response = await fetch("/api/campaigns/" + campaign.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "duplicate" }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la duplication");
      }

      const newCampaign = await response.json();
      setCampaigns((prev) => [...prev, newCampaign]);
      toast.success("Campagne dupliquée avec succès");
    } catch (error) {
      console.error("Error duplicating campaign:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
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
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
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
        className={`${config.color} flex items-center gap-1 font-medium py-1 px-2`}
      >
        <Icon className="w-3 h-3" />
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
        className={`${config.color} capitalize font-medium`}
      >
        {config.label}
      </Badge>
    );
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/campaigns/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#67B142] via-[#4CAF50] to-[#67B142] p-8 shadow-lg"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Campagnes SMS
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/90"
                >
                  Gérez vos campagnes SMS en toute simplicité
                </motion.p>
              </div>
              <Button
                size="lg"
                onClick={() => router.push("/dashboard/campaigns/new")}
                className="bg-white text-[#67B142] hover:bg-white/90 shadow-md transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Campagne
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-96 h-full opacity-10 transform rotate-12">
            <MessageSquare className="w-full h-full" />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatePresence>
            {[
              {
                title: "Total",
                value: stats.total,
                icon: MessageSquare,
                color: "bg-purple-100 text-purple-800",
                gradient: "from-purple-500/10 to-purple-500/5",
              },
              {
                title: "Envoyées",
                value: stats.sent,
                icon: CheckCircle2,
                color: "bg-green-100 text-green-800",
                gradient: "from-green-500/10 to-green-500/5",
              },
              {
                title: "Programmées",
                value: stats.scheduled,
                icon: Calendar,
                color: "bg-blue-100 text-blue-800",
                gradient: "from-blue-500/10 to-blue-500/5",
              },
              {
                title: "Brouillons",
                value: stats.draft,
                icon: Clock,
                color: "bg-gray-100 text-gray-800",
                gradient: "from-gray-500/10 to-gray-500/5",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${stat.gradient}">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.color} group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.value === 1 ? "campagne" : "campagnes"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-[#67B142] focus:ring-[#67B142] transition-all duration-200"
            />
          </div>
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-white border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]">
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
              <SelectTrigger className="w-[180px] bg-white border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]">
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
        </motion.div>

        {/* Campaigns Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gray-50/50">
              <CardTitle>Vos Campagnes</CardTitle>
              <CardDescription>
                Liste de toutes vos campagnes SMS et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold">Nom</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Destinataires</TableHead>
                    <TableHead className="font-semibold">Créée le</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-[#67B142]" />
                          <span className="text-gray-500">
                            Chargement des campagnes...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <AlertCircle className="w-12 h-12 text-gray-400" />
                          <p className="text-lg font-medium">Aucune campagne trouvée</p>
                          <p className="text-sm text-gray-400">
                            Commencez par créer une nouvelle campagne
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <TableRow 
                        key={campaign.id}
                        className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          handleViewDetails(campaign.id);
                        }}
                      >
                        <TableCell className="font-medium">
                          {campaign.name}
                        </TableCell>
                        <TableCell>
                          <TypeBadge type={campaign.type} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={campaign.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{campaign.recipientCount}</span>
                            {campaign.status === "sent" && (
                              <span className="text-sm text-gray-500">
                                ({campaign.successCount} réussis,{" "}
                                {campaign.failureCount} échoués)
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(campaign.createdAt), "Pp", {
                            locale: fr,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleViewDetails(campaign.id);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDuplicate(campaign);
                                }}
                                className="cursor-pointer"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Dupliquer
                              </DropdownMenuItem>
                              {campaign.status === "draft" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSend(campaign);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Envoyer maintenant
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDelete(campaign.id);
                                    }}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 