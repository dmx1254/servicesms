"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@/app/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Text,
  Title,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Legend,
  Metric,
  Flex,
  Badge,
  Grid,
  AreaChart,
  ProgressBar,
} from "@tremor/react";
import {
  MessageSquare,
  TrendingUp,
  Users,
  CheckCircle2,
  Plus,
  Send,
  ArrowUp,
  ArrowDown,
  Wallet,
  Clock,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from "lucide-react";
import Link from "next/link";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import useStore from "@/app/lib/manage";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  remainingCredits: number;
}

export default function Dashboard() {
  const { user } = useUser();
  const { addSolde } = useStore();
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
    remainingCredits: 0,
  });
  const [activeTab, setActiveTab] = useState(1);

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

          // Fetch SMS credits
          const creditsResponse = await fetch(
            `/api/user/${user?.id}/getSmsCredit`
          );
          const creditsData = await creditsResponse.json();
          const smsCredits = creditsData?.smsCredits || 0;

          // Mettre à jour le store avec les crédits SMS
          addSolde(smsCredits);

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
            remainingCredits: smsCredits,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (user?.id) {
    fetchDashboardData();
    }
  }, [user?.id]);

  // Generate sample timeline data
  const timelineData = useMemo(() => {
    return Array.from({ length: 7 })
    .map((_, i) => ({
      date: format(subDays(new Date(), i), "dd MMM", { locale: fr }),
      academic: Math.floor(Math.random() * 5),
      marketing: Math.floor(Math.random() * 8),
      transactional: Math.floor(Math.random() * 6),
    }))
    .reverse();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Voici un aperçu de vos campagnes SMS
          </p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button className="bg-[#67B142] rounded hover:bg-[#67B142]/90 shadow-lg shadow-[#67B142]/20 transition-all duration-300 transform hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Campagne
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] px-6 py-2 bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Campagnes Totales
            </CardTitle>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-3xl font-bold text-gray-800">
              {stats.totalCampaigns}
            </div>
            <div className="mt-3 bg-emerald-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${(stats.totalCampaigns / 100) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-emerald-500">●</span>
              {stats.campaignsByStatus.sent} campagnes envoyées
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] px-6 py-2 bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Contacts
            </CardTitle>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-3xl font-bold text-gray-800">
              {stats.totalContacts}
            </div>
            <div className="mt-3 bg-blue-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${(stats.totalContacts / 1000) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-blue-500">●</span>
              {Math.round((stats.totalContacts / 1000) * 100)}% de
              l&apos;objectif
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] px-6 py-2 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Messages Envoyés
            </CardTitle>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-3xl font-bold text-gray-800">
              {stats.totalSent}
            </div>
            <div className="mt-3 bg-purple-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${(stats.totalSent / stats.totalCampaigns) * 100}%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-purple-500">●</span>
              Taux d&apos;envoi:{" "}
              {Math.round((stats.totalSent / stats.totalCampaigns) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] px-6 py-2 bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux de Réussite
            </CardTitle>
            <div className="p-3 bg-amber-100 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-3xl font-bold text-gray-800">
              {stats.totalSent > 0
                ? Math.round((stats.totalSent / stats.totalCampaigns) * 100)
                : 0}
              %
            </div>
            <div className="mt-3 bg-amber-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${
                    stats.totalSent > 0
                      ? (stats.totalSent / stats.totalCampaigns) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
              <span className="text-amber-500">●</span>
              Performance globale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title className="text-2xl font-bold bg-gradient-to-r from-[#67B142] to-[#34A853] bg-clip-text text-transparent">
              Performance des Campagnes
            </Title>
            <Text className="text-gray-600">
              Vue analytique de vos envois SMS
            </Text>
          </div>
          <div className="w-48">
            <Select
              defaultValue="7"
              onValueChange={(value) => console.log(value)}
            >
              <SelectTrigger className="border-gray-200 rounded bg-white shadow-sm">
                <SelectValue placeholder="Sélectionner la période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 derniers jours</SelectItem>
                <SelectItem value="30">30 derniers jours</SelectItem>
                <SelectItem value="90">90 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Summary */}
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mt-8">
          <Card className="space-y-3 p-4 bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <Send className="w-5 h-5 text-emerald-600" />
              </div>
              <Text className="font-medium text-gray-600">Total Envoyés</Text>
            </div>
            <Metric className="text-2xl text-gray-800">
              {new Intl.NumberFormat("fr-FR").format(stats.totalSent)}
            </Metric>
            <Flex className="items-center gap-2">
              <Text className="text-sm text-emerald-600">
                +12% vs mois dernier
              </Text>
              <ArrowUp className="w-4 h-4 text-emerald-500" />
            </Flex>
          </Card>

          <Card className="space-y-3 p-4 bg-gradient-to-br from-white to-blue-50/30 border border-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <Text className="font-medium text-gray-600">
                Taux de Livraison
              </Text>
            </div>
            <Metric className="text-2xl text-gray-800">98.3%</Metric>
            <Flex className="items-center gap-2">
              <Text className="text-sm text-blue-600">
                +2.1% vs mois dernier
              </Text>
              <ArrowUp className="w-4 h-4 text-blue-500" />
            </Flex>
          </Card>

          <Card className="space-y-3 p-4 bg-gradient-to-br from-white to-amber-50/30 border border-amber-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <Text className="font-medium text-gray-600">
                Temps moyen d&apos;envoi
              </Text>
            </div>
            <Metric className="text-2xl text-gray-800">1.2s</Metric>
            <Flex className="items-center gap-2">
              <Text className="text-sm text-amber-600">
                -0.3s vs mois dernier
              </Text>
              <ArrowDown className="w-4 h-4 text-amber-500" />
            </Flex>
          </Card>

          <Card className="space-y-3 p-4 bg-gradient-to-br from-white to-purple-50/30 border border-purple-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 rounded-xl">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <Text className="font-medium text-gray-600">
                Crédits Restants
              </Text>
            </div>
            <Metric className="text-2xl text-gray-800">
              {new Intl.NumberFormat("fr-FR").format(stats.remainingCredits)}
            </Metric>
            <ProgressBar
              value={75}
              className="mt-2"
              color="emerald"
              tooltip="75% des crédits restants"
            />
          </Card>
        </Grid>

        <TabGroup
          className="mt-8"
          defaultIndex={1}
          onIndexChange={(index) => setActiveTab(index)}
        >
          <TabList
            variant="solid"
            className="w-fit bg-gradient-to-r from-gray-50 to-gray-100/80 p-1.5 rounded-2xl shadow-sm"
          >
            <Tab
              icon={PieChartIcon}
              className={`gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded ${
                activeTab === 0
                  ? "bg-[#67B142] text-white shadow-lg shadow-[#67B142]/20"
                  : "text-gray-600 hover:bg-[#67B142]/10 hover:text-[#67B142]"
              }`}
            >
              Vue Globale
            </Tab>
            <Tab
              icon={BarChartIcon}
              className={`gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded ${
                activeTab === 1
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20"
                  : "text-gray-600 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]"
              }`}
            >
              Par Type
            </Tab>
            <Tab
              icon={LineChartIcon}
              className={`gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded ${
                activeTab === 2
                  ? "bg-[#f97316] text-white shadow-lg shadow-[#f97316]/20"
                  : "text-gray-600 hover:bg-[#f97316]/10 hover:text-[#f97316]"
              }`}
            >
              Évolution
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid numItems={1} numItemsLg={2} className="mt-8 gap-8">
                {/* Statistiques par Type */}
                <Card className="p-6 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-green-50/30">
                  <Title className="mb-6 text-gray-700 font-semibold">Répartition par Type</Title>
                  <div className="space-y-6">
                    {/* Académique */}
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#67B142]/10 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-[#67B142]" />
                          </div>
                          <Text className="font-medium text-gray-600">Académique</Text>
                        </div>
                        <Badge className="bg-[#67B142]/10 text-[#67B142]">
                          {Math.round((stats.campaignsByType.academic / stats.totalCampaigns) * 100)}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#67B142] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(stats.campaignsByType.academic / stats.totalCampaigns) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <Text className="text-gray-500">{stats.campaignsByType.academic} SMS</Text>
                        <Text className="text-[#67B142]">+12% vs mois dernier</Text>
                      </div>
                    </div>

                    {/* Marketing */}
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#3B82F6]/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                          </div>
                          <Text className="font-medium text-gray-600">Marketing</Text>
                        </div>
                        <Badge className="bg-[#3B82F6]/10 text-[#3B82F6]">
                          {Math.round((stats.campaignsByType.marketing / stats.totalCampaigns) * 100)}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#3B82F6] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(stats.campaignsByType.marketing / stats.totalCampaigns) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <Text className="text-gray-500">{stats.campaignsByType.marketing} SMS</Text>
                        <Text className="text-[#3B82F6]">+8% vs mois dernier</Text>
                      </div>
                    </div>

                    {/* Transactionnel */}
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#f97316]/10 rounded-lg">
                            <Users className="w-5 h-5 text-[#f97316]" />
                          </div>
                          <Text className="font-medium text-gray-600">Transactionnel</Text>
                        </div>
                        <Badge className="bg-[#f97316]/10 text-[#f97316]">
                          {Math.round((stats.campaignsByType.transactional / stats.totalCampaigns) * 100)}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#f97316] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(stats.campaignsByType.transactional / stats.totalCampaigns) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <Text className="text-gray-500">{stats.campaignsByType.transactional} SMS</Text>
                        <Text className="text-[#f97316]">+15% vs mois dernier</Text>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Statistiques par Statut */}
                <Card className="p-6 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50/30">
                  <Title className="mb-6 text-gray-700 font-semibold">Statut des Campagnes</Title>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Envoyées */}
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-[#67B142]/10 rounded-lg">
                          <Send className="w-5 h-5 text-[#67B142]" />
                        </div>
                        <div>
                          <Text className="font-medium text-gray-600">Envoyées</Text>
                          <Text className="text-2xl font-bold text-[#67B142]">
                            {stats.campaignsByStatus.sent}
                          </Text>
                        </div>
                      </div>
                      <Text className="text-sm text-[#67B142]">+23% ce mois</Text>
                    </div>

                    {/* Programmées */}
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-[#3B82F6]/10 rounded-lg">
                          <Clock className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                          <Text className="font-medium text-gray-600">Programmées</Text>
                          <Text className="text-2xl font-bold text-[#3B82F6]">
                            {stats.campaignsByStatus.scheduled}
                          </Text>
                        </div>
                      </div>
                      <Text className="text-sm text-[#3B82F6]">+5% ce mois</Text>
                    </div>

                    {/* Brouillons */}
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-[#F59E0B]" />
                        </div>
                        <div>
                          <Text className="font-medium text-gray-600">Brouillons</Text>
                          <Text className="text-2xl font-bold text-[#F59E0B]">
                            {stats.campaignsByStatus.draft}
                          </Text>
                        </div>
                      </div>
                      <Text className="text-sm text-[#F59E0B]">+8% ce mois</Text>
                    </div>

                    {/* Modèles */}
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-[#A855F7]/10 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-[#A855F7]" />
                        </div>
                        <div>
                          <Text className="font-medium text-gray-600">Modèles</Text>
                          <Text className="text-2xl font-bold text-[#A855F7]">
                            {stats.campaignsByStatus.template}
                          </Text>
                        </div>
                      </div>
                      <Text className="text-sm text-[#A855F7]">+15% ce mois</Text>
                    </div>
                  </div>
                </Card>
              </Grid>
            </TabPanel>

            <TabPanel>
              <Card className="mt-8 p-6 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <Title className="mb-6 text-gray-700 font-semibold">
                  Performance par Type
                </Title>
                <div className="bg-gray-50/50 p-4 rounded-xl mb-6">
                <Legend
                  categories={["Académique", "Marketing", "Transactionnel"]}
                    colors={["#67B142", "#3B82F6", "#f97316"]}
                    className="justify-center gap-8"
                />
                </div>
                <AreaChart
                  data={timelineData}
                  index="date"
                  categories={["academic", "marketing", "transactional"]}
                  colors={["#67B142", "#3B82F6", "#f97316"]}
                  valueFormatter={(value) =>
                    new Intl.NumberFormat("fr-FR").format(value) + " SMS"
                  }
                  showAnimation={true}
                  showLegend={false}
                  showGridLines={false}
                  curveType="monotone"
                  className="h-80"
                  yAxisWidth={48}
                  customTooltip={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-blue-900/90 p-4 shadow-lg rounded-xl border border-blue-800">
                        <div className="font-medium text-gray-100 mb-2">
                          {data.date}
                        </div>
                        {payload.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 mt-2"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                item.name === "academic"
                                  ? "bg-[#67B142]"
                                  : item.name === "marketing"
                                  ? "bg-[#3B82F6]"
                                  : "bg-[#f97316]"
                              }`}
                            />
                            <span className="capitalize text-gray-200 min-w-[100px]">
                              {String(item.name)}:
                            </span>
                            <span className="font-medium text-white">
                              {new Intl.NumberFormat("fr-FR").format(
                                Number(item.value)
                              )}{" "}
                              SMS
                            </span>
                          </div>
                        ))}
              </div>
                    );
                  }}
                />
              </Card>
            </TabPanel>

            <TabPanel>
              <div className="mt-8 space-y-4">
                {stats.recentCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="p-5 hover:bg-gray-50/80 transition-all duration-300 transform hover:scale-[1.01] border border-gray-100 rounded-xl hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                          className={`p-3 rounded-xl ${
                          campaign.type === "academic"
                              ? "bg-[#67B142]/10 text-[#67B142]"
                            : campaign.type === "marketing"
                              ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                              : "bg-[#f97316]/10 text-[#f97316]"
                        }`}
                      >
                        {campaign.type === "academic" ? (
                            <MessageSquare className="w-5 h-5" />
                        ) : campaign.type === "marketing" ? (
                            <TrendingUp className="w-5 h-5" />
                        ) : (
                            <Users className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                          <Text className="font-medium text-gray-800">
                          {campaign.name}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {format(
                              new Date(campaign.createdAt),
                              "dd MMM yyyy",
                              {
                            locale: fr,
                              }
                            )}
                          </Text>
                        </div>
                      </div>
                      <Badge
                        className={`px-3 py-1.5 rounded-lg font-medium ${
                        campaign.status === "sent"
                            ? "bg-[#67B142]/10 text-[#67B142]"
                          : campaign.status === "scheduled"
                            ? "bg-blue-500/10 text-blue-500"
                          : campaign.status === "draft"
                            ? "bg-gray-500/10 text-gray-500"
                            : "bg-purple-500/10 text-purple-500"
                      }`}
                    >
                      {campaign.status === "sent"
                        ? "Envoyée"
                        : campaign.status === "scheduled"
                        ? "Programmée"
                        : campaign.status === "draft"
                        ? "Brouillon"
                        : "Modèle"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
}
