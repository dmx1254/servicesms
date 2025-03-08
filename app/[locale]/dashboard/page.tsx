"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  LineChart,
  Card as TremorCard,
  Title,
  Text,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Legend,
} from "@tremor/react";
import {
  MessageSquare,
  Users,
  TrendingUp,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

interface Campaign {
  id: string;
  name: string;
  type: "academic" | "marketing" | "transactional";
  status: "draft" | "scheduled" | "sent" | "template";
  contacts: Array<{
    lastname: string;
    firstname: string;
    phone: string;
  }>;
  createdAt: string;
  scheduledDate?: string;
}

interface DashboardStats {
  totalCampaigns: number;
  totalContacts: number;
  totalSent: number;
  campaignsByType: {
    academic: number;
    marketing: number;
    transactional: number;
  };
  campaignsByStatus: {
    draft: number;
    scheduled: number;
    sent: number;
    template: number;
  };
  recentCampaigns: Campaign[];
}

interface ChartData {
  name: string;
  value: number;
}

interface TimelineData {
  date: string;
  academic: number;
  marketing: number;
  transactional: number;
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    totalContacts: 0,
    totalSent: 0,
    campaignsByType: {
      academic: 0,
      marketing: 0,
      transactional: 0,
    },
    campaignsByStatus: {
      draft: 0,
      scheduled: 0,
      sent: 0,
      template: 0,
    },
    recentCampaigns: [],
  });

  // console.log(stats);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/campaigns");
        const data = await response.json();

        // console.log(data);
        if (data) {
          const campaigns: Campaign[] = data;

          // Calculate statistics
          const totalContacts = campaigns.reduce(
            (sum, campaign) => sum + campaign.contacts.length,
            0
          );

          const campaignsByType = {
            academic: campaigns.filter((c) => c.type === "academic").length,
            marketing: campaigns.filter((c) => c.type === "marketing").length,
            transactional: campaigns.filter((c) => c.type === "transactional")
              .length,
          };

          const campaignsByStatus = {
            draft: campaigns.filter((c) => c.status === "draft").length,
            scheduled: campaigns.filter((c) => c.status === "scheduled").length,
            sent: campaigns.filter((c) => c.status === "sent").length,
            template: campaigns.filter((c) => c.status === "template").length,
          };

          setStats({
            totalCampaigns: campaigns.length,
            totalContacts,
            totalSent: campaignsByStatus.sent,
            campaignsByType,
            campaignsByStatus,
            recentCampaigns: campaigns
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(0, 5),
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Generate sample timeline data
  const timelineData: TimelineData[] = Array.from({ length: 7 })
    .map((_, i) => ({
      date: format(subDays(new Date(), i), "dd MMM", { locale: fr }),
      academic: Math.floor(Math.random() * 5),
      marketing: Math.floor(Math.random() * 8),
      transactional: Math.floor(Math.random() * 6),
    }))
    .reverse();

  const statusData: ChartData[] = [
    { name: "Brouillons", value: stats.campaignsByStatus.draft },
    { name: "Programmées", value: stats.campaignsByStatus.scheduled },
    { name: "Envoyées", value: stats.campaignsByStatus.sent },
    { name: "Modèles", value: stats.campaignsByStatus.template },
  ];

  const valueFormatter = (value: number): string => `${value} campagnes`;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Voici un aperçu de vos campagnes SMS
          </p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button className="bg-[#67B142] hover:bg-[#67B142]/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Campagne
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Campagnes Totales
            </CardTitle>
            <div className="p-2 bg-emerald-50 rounded-full">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <div className="mt-2 bg-emerald-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(stats.totalCampaigns / 100) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.campaignsByStatus.sent} campagnes envoyées
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Contacts
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <div className="mt-2 bg-blue-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(stats.totalContacts / 1000) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((stats.totalContacts / 1000) * 100)}% de
              l&apos;objectif
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Messages Envoyés
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-full">
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent}</div>
            <div className="mt-2 bg-purple-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{
                  width: `${(stats.totalSent / stats.totalCampaigns) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Taux d&apos;envoi:{" "}
              {Math.round(Number(stats.totalSent / stats.totalCampaigns) * 100)}
              %
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Taux de Réussite
            </CardTitle>
            <div className="p-2 bg-amber-50 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSent > 0
                ? Math.round((stats.totalSent / stats.totalCampaigns) * 100)
                : 0}
              %
            </div>
            <div className="mt-2 bg-amber-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{
                  width: `${
                    stats.totalSent > 0
                      ? (stats.totalSent / stats.totalCampaigns) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Performance globale</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <TremorCard className="p-6">
        <div className="md:flex justify-between items-center">
          <div>
            <Title>Analyse des Campagnes</Title>
            <Text>Vue détaillée de vos campagnes SMS</Text>
          </div>
        </div>

        <TabGroup className="mt-4" defaultIndex={0}>
          <TabList variant="solid">
            <Tab>Par Type</Tab>
            <Tab>Par Statut</Tab>
            <Tab>Timeline</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="mt-8">
                <Legend
                  className="mb-6"
                  categories={["Académique", "Marketing", "Transactionnel"]}
                  colors={["emerald", "blue", "amber"]}
                />
                <AreaChart
                  className="h-80 mt-4"
                  data={timelineData}
                  index="date"
                  categories={["academic", "marketing", "transactional"]}
                  colors={["emerald", "blue", "amber"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  showGridLines={false}
                  curveType="monotone"
                />
              </div>
            </TabPanel>

            <TabPanel>
              <div className="mt-8">
                <Legend
                  className="mb-6"
                  categories={[
                    "Brouillons",
                    "Programmées",
                    "Envoyées",
                    "Modèles",
                  ]}
                  colors={["gray", "purple", "emerald", "pink"]}
                />
                <LineChart
                  className="h-80 mt-4"
                  data={statusData}
                  index="name"
                  categories={["value"]}
                  colors={["emerald"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  showGridLines={false}
                  curveType="monotone"
                  showXAxis={true}
                  showYAxis={true}
                />
              </div>
            </TabPanel>

            <TabPanel>
              <div className="mt-8 space-y-6">
                {stats.recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          campaign.type === "academic"
                            ? "bg-emerald-100 text-emerald-600"
                            : campaign.type === "marketing"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {campaign.type === "academic" ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : campaign.type === "marketing" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {campaign.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(campaign.createdAt), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs ${
                        campaign.status === "sent"
                          ? "bg-emerald-100 text-emerald-600"
                          : campaign.status === "scheduled"
                          ? "bg-blue-100 text-blue-600"
                          : campaign.status === "draft"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {campaign.status === "sent"
                        ? "Envoyée"
                        : campaign.status === "scheduled"
                        ? "Programmée"
                        : campaign.status === "draft"
                        ? "Brouillon"
                        : "Modèle"}
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </TremorCard>
    </div>
  );
}
