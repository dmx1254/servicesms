"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  Send,
  BarChart,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { TestSMSButton } from '@/components/TestSMSButton';
import { Toaster } from 'sonner';
import { useUser } from "@/app/hooks/useUser";

const stats = [
  {
    title: "SMS Envoyés",
    value: "12,234",
    change: "+14%",
    trend: "up",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    title: "Taux de livraison",
    value: "98.5%",
    change: "+2.1%",
    trend: "up",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    title: "Contacts actifs",
    value: "3,456",
    change: "-2.5%",
    trend: "down",
    icon: <Users className="w-4 h-4" />,
  },
  {
    title: "Temps moyen de livraison",
    value: "1.2s",
    change: "-0.3s",
    trend: "up",
    icon: <Clock className="w-4 h-4" />,
  },
];

const quickActions = [
  {
    title: "Nouvelle campagne",
    description: "Créez et envoyez une nouvelle campagne SMS",
    icon: <MessageSquare className="w-6 h-6" />,
    href: "/dashboard/campaigns/new",
  },
  {
    title: "Envoi rapide",
    description: "Envoyez rapidement des SMS à vos contacts",
    icon: <Send className="w-6 h-6" />,
    href: "/dashboard/quick-send",
  },
  {
    title: "Voir les statistiques",
    description: "Analysez vos performances d'envoi",
    icon: <BarChart className="w-6 h-6" />,
    href: "/dashboard/statistics",
  },
];

const recentCampaigns = [
  {
    title: "Promotion été 2024",
    date: "Il y a 2 heures",
    status: "Envoyé",
    sent: 1234,
    delivered: 1200,
  },
  {
    title: "Newsletter Mars",
    date: "Il y a 1 jour",
    status: "Envoyé",
    sent: 2500,
    delivered: 2489,
  },
  {
    title: "Rappel événement",
    date: "Il y a 2 jours",
    status: "Envoyé",
    sent: 500,
    delivered: 498,
  },
];

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenue, {user?.firstName} {user?.lastName} 👋</h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre activité SMS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-[#67B142]/10 p-2 text-[#67B142]">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {quickActions.map((action, index) => (
          <Card key={index} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-[#67B142]/10 p-2 text-[#67B142]">
                  {action.icon}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#67B142] transition-colors" />
              </div>
              <CardTitle className="mt-4">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campagnes récentes</CardTitle>
            <Button variant="outline" size="sm">
              Voir tout
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{campaign.title}</p>
                  <p className="text-sm text-gray-500">{campaign.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {campaign.delivered}/{campaign.sent} délivrés
                  </p>
                  <p className="text-xs text-gray-500">{campaign.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <TestSMSButton />
      </div>

      <Toaster />
    </div>
  );
} 