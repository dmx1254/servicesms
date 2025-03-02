"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Search,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CampaignStatus = "completed" | "scheduled" | "in_progress" | "failed";
type CampaignType = "marketing" | "transactional";

interface Campaign {
  id: number;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  sent: number;
  delivered: number;
  date: string;
  deliveryRate: number;
}

const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Promotion été 2024",
    status: "completed",
    type: "marketing",
    sent: 1234,
    delivered: 1200,
    date: "2024-03-15T10:00:00",
    deliveryRate: 97.2,
  },
  {
    id: 2,
    name: "Rappel RDV Clients",
    status: "scheduled",
    type: "transactional",
    sent: 0,
    delivered: 0,
    date: "2024-03-20T15:30:00",
    deliveryRate: 0,
  },
  {
    id: 3,
    name: "Newsletter Mars",
    status: "in_progress",
    type: "marketing",
    sent: 1500,
    delivered: 1489,
    date: "2024-03-14T09:00:00",
    deliveryRate: 99.3,
  },
  {
    id: 4,
    name: "Alerte Stock",
    status: "failed",
    type: "transactional",
    sent: 500,
    delivered: 450,
    date: "2024-03-13T14:20:00",
    deliveryRate: 90.0,
  },
];

const statusMap: Record<CampaignStatus, {
  label: string;
  icon: typeof CheckCircle2;
  className: string;
}> = {
  completed: {
    label: "Terminé",
    icon: CheckCircle2,
    className: "text-green-600 bg-green-50",
  },
  scheduled: {
    label: "Programmé",
    icon: Clock,
    className: "text-blue-600 bg-blue-50",
  },
  in_progress: {
    label: "En cours",
    icon: Clock,
    className: "text-yellow-600 bg-yellow-50",
  },
  failed: {
    label: "Échoué",
    icon: XCircle,
    className: "text-red-600 bg-red-50",
  },
};

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campagnes SMS</h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos campagnes SMS
          </p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button className="bg-[#67B142] hover:bg-[#67B142]/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle campagne
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une campagne..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="scheduled">Programmé</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="transactional">Transactionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la campagne</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">SMS envoyés</TableHead>
                <TableHead className="text-right">Taux de livraison</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const StatusIcon = statusMap[campaign.status].icon;
                return (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#67B142]" />
                        {campaign.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "flex items-center gap-2 px-2 py-1 rounded-full w-fit",
                        statusMap[campaign.status].className
                      )}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {statusMap[campaign.status].label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {campaign.type}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.sent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.deliveryRate}%
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(campaign.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campagnes
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-[#67B142]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En cours
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === "in_progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux moyen de livraison
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(campaigns
                .filter(c => c.status === "completed")
                .reduce((acc, curr) => acc + curr.deliveryRate, 0) / 
                campaigns.filter(c => c.status === "completed").length
              ).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Échecs
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === "failed").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 