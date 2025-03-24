"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Building2,
  Mail,
  Shield,
  Clock,
  Settings,
  HelpCircle,
  AlertCircle,
  XCircle,
  Plus,
  CheckCircle2,
  Key,
  Copy,
  Trash2,
  Lock,
  CheckCheck,
  Check,
  BadgeCheck,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import useStore from "@/app/lib/manage";
import CountUp from "react-countup";
import ShowCopiedToken from "@/components/ShowCopiedToken";

interface APIToken {
  _id: string;
  name: string;
  token: string;
  hashedToken: string;
  lastUsed?: Date;
  createdAt: Date;
  isActive: boolean;
}

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  currentPassword?: string;
  newPassword?: string;
}

interface CompanyNameStatus {
  status: "approved" | "pending" | "rejected";
  pendingName?: string;
  rejectionReason?: string;
  lastChange?: Date;
}

interface SecurityPreferences {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsPage() {
    const { solde } = useStore();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [tokens, setTokens] = useState<APIToken[]>([]);
  const [newTokenName, setNewTokenName] = useState("");
  const [showNewTokenDialog, setShowNewTokenDialog] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [companyNameStatus, setCompanyNameStatus] = useState<CompanyNameStatus>(
    {
      status: "approved",
    }
  );
  const [securityPrefs, setSecurityPrefs] = useState<SecurityPreferences>({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: true,
  });
  const [isTokenVisible, setIsTokenVisible] = useState<boolean>(false);
  const [tokenOnce, setTokenOnce] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
    companyName: session?.user?.companyName || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    createdAt: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchTokens();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        createdAt: data.createdAt,
      }));

      setCompanyNameStatus({
        status: data.companyNameStatus,
        pendingName: data.pendingCompanyName,
        rejectionReason: data.companyNameRejectionReason,
        lastChange: data.lastCompanyNameChange
          ? new Date(data.lastCompanyNameChange)
          : undefined,
      });
    } catch {
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/user/tokens");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setTokens(data);
    } catch {
      toast.error("Erreur lors du chargement des tokens");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData: UpdateProfileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
      };

      // Add password update if provided
      if (formData.currentPassword && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("Les mots de passe ne correspondent pas");
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Profil mis à jour avec succès");
      await update();
      
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la mise à jour du profil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateToken = async () => {
    try {
      const response = await fetch("/api/user/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTokenName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setTokens((prev) => [...prev, data]);
      setNewTokenName("");
      setShowNewTokenDialog(false);
      setIsTokenVisible(true);
      setTokenOnce(data.token);
      toast.success("Token créé avec succès");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la création du token");
      }
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/user/tokens?id=${tokenId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setTokens((prev) => prev.filter((token) => token._id !== tokenId));
      toast.success("Token supprimé avec succès");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la suppression du token");
      }
    }
  };

  const maskToken = (token: string) => {
    if (!token) return "";
    const firstSix = token.slice(0, 4);
    const lastFour = token.slice(-4);
    return `${firstSix}...${lastFour}`;
  };

  // const copyToClipboard = async (token: string) => {
  //   try {
  //     await navigator.clipboard.writeText(token);
  //     setCopiedToken(token);
  //     setTimeout(() => setCopiedToken(null), 2000);
  //     toast.success("Token copié dans le presse-papier");
  //   } catch {
  //     toast.error("Erreur lors de la copie du token");
  //   }
  // };

  const handleSecurityPrefChange = (key: keyof SecurityPreferences) => {
    setSecurityPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Préférences mises à jour");
  };

  const handleTokenStatusChange = async (
    tokenId: string,
    isActive: boolean
  ) => {
    try {
      const response = await fetch(`/api/user/tokens/${tokenId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setTokens((prev) =>
        prev.map((token) =>
          token._id === tokenId ? { ...token, isActive } : token
        )
      );
      toast.success("Statut du token mis à jour");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de la mise à jour du token");
      }
    }
  };

  const getCompanyNameStatusBadge = () => {
    switch (companyNameStatus.status) {
      case "approved":
        return (
          <Badge className="bg-[#67B142] rounded">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Approuvé
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-500 rounded"
          >
            <Clock className="w-4 h-4 mr-1" />
            En attente
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-4 h-4 mr-1 rounded" />
            Rejeté
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#67B142]/10 to-transparent rounded-3xl" />

        <div className="relative grid gap-8 md:grid-cols-3 p-8 rounded-3xl border bg-white/50 backdrop-blur-sm">
          <div className="col-span-2">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#67B142]/10 flex items-center justify-center text-[#67B142] text-3xl font-medium ring-8 ring-white">
              {session?.user?.firstName?.[0]}
              {session?.user?.lastName?.[0]}
            </div>
                {companyNameStatus.status === "approved" && (
                  <div
                    style={{
                      boxShadow:
                        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    }}
                    className="absolute rounded-full bottom-1 -right-1"
                  >
                    <BadgeCheck className="text-green-500" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold">
                {session?.user?.firstName} {session?.user?.lastName}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {session?.user?.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  {formData.companyName}
                  {getCompanyNameStatusBadge()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:place-self-end self-center">
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-col items-center p-2 min-w-24">
                <CardTitle className="text-sm text-muted-foreground">
                  Solde
                </CardTitle>
                <div className="text-xl font-bold">
                  {isLoadingProfile ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <CountUp end={solde} duration={3} />
                  )}
              </div>
            </CardHeader>
          </Card>
          </div>
        </div>
      </div>

      {companyNameStatus.status === "pending" && (
        <Alert className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Changement de nom en attente</AlertTitle>
          <AlertDescription>
            Votre demande de changement de nom d&apos;entreprise vers &quot;
            {companyNameStatus.pendingName}&quot; est en cours d&apos;examen.
            Nous vous notifierons dès que l&apos;administrateur aura examiné
            votre demande.
          </AlertDescription>
        </Alert>
      )}

      {companyNameStatus.status === "rejected" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Changement de nom rejeté</AlertTitle>
          <AlertDescription>
            Votre dernière demande de changement de nom a été rejetée. Raison :{" "}
            {companyNameStatus.rejectionReason}
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] rounded-full p-1">
          <TabsTrigger value="profile" className="rounded-full">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-full">
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="api" className="rounded-full">
            <Key className="w-4 h-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/50">
              <CardHeader>
                <CardTitle className="text-lg">
                  Informations Personnelles
                </CardTitle>
                <CardDescription className="text-lg">
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-base">
                        Prénom
                      </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        placeholder="Prénom"
                        className="text-base rounded-[6px]"
                        />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-base">
                        Nom
                      </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        placeholder="Nom"
                        className="text-base rounded-[6px]"
                        />
                    </div>
                  <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="text-base rounded-[6px]"
                        placeholder="Email"
                      />
                    </div>
                  <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="text-base rounded-[6px]"
                        placeholder="Téléphone"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="companyName" className="text-base">
                          Nom de l&apos;entreprise
                        </Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <p className="text-sm">
                                Le nom de votre entreprise apparaîtra comme
                                expéditeur de vos SMS. Tout changement nécessite
                                une validation administrative.
                              </p>
                              <div className="text-xs text-muted-foreground">
                                <p>• Maximum 11 caractères</p>
                                <p>• Pas de caractères spéciaux</p>
                                <p>• Délai de 30 jours entre les changements</p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                  </div>
                    <div className="relative">
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                          className="rounded-[6px] pl-10"
                          placeholder="Nom de l'entreprise"
                          maxLength={11}
                          disabled={companyNameStatus.status === "pending"}
                      />
                      <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      {companyNameStatus.lastChange && (
                        <p className="text-xs text-muted-foreground">
                          Dernier changement :{" "}
                          {format(
                            new Date(companyNameStatus.lastChange),
                            "dd/MM/yyyy"
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#67B142] rounded-[10px]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Mise à jour..." : "Mettre à jour"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="backdrop-blur-sm bg-white/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Vue d&apos;ensemble du compte
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Statistiques et informations de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg">Type de compte</Label>
                      <Badge
                        variant="outline"
                        className="capitalize rounded-[4px] text-sm bg-[#67B142] text-white"
                      >
                        {session?.user?.accountType}
                      </Badge>
                    </div>
                    {/* <Progress
                      value={
                        session?.user?.accountType === "business" ? 100 : 50
                      }
                      className="h-2"
                      color="bg-[#67B142]"
                    /> */}
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.accountType === "business"
                        ? "Compte professionnel avec toutes les fonctionnalités"
                        : "Passez au compte professionnel pour plus de fonctionnalités"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Statut du compte</Label>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#67B142] rounded-[6px]">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Actif
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Depuis{" "}
                        {format(
                          new Date(formData.createdAt || Date.now()),
                          "MMMM yyyy",
                          { locale: fr }
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/50">
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto py-4 px-6 flex flex-col items-center gap-2"
                    >
                      <Plus className="h-6 w-6" />
                      <span>Recharger le solde</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 px-6 flex flex-col items-center gap-2"
                    >
                      <Settings className="h-6 w-6" />
                      <span>Paramètres SMS</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-white/50">
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez vos paramètres de sécurité et notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">
                        Renforcez la sécurité de votre compte
                      </p>
                    </div>
                    <Switch
                      checked={securityPrefs.twoFactorEnabled}
                      onCheckedChange={() =>
                        handleSecurityPrefChange("twoFactorEnabled")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par email
                      </p>
                    </div>
                    <Switch
                      checked={securityPrefs.emailNotifications}
                      onCheckedChange={() =>
                        handleSecurityPrefChange("emailNotifications")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications par SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par SMS
                      </p>
                    </div>
                    <Switch
                      checked={securityPrefs.smsNotifications}
                      onCheckedChange={() =>
                        handleSecurityPrefChange("smsNotifications")
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Changer le mot de passe</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        Mot de passe actuel
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="rounded-lg"
                          placeholder="Mot de passe actuel"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="Nouveau mot de passe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmer le mot de passe
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="Confirmer le mot de passe"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="grid gap-8">
            <Card className="backdrop-blur-sm bg-white/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tokens d&apos;API</CardTitle>
                    <CardDescription className="mt-1.5">
                      Gérez vos tokens d&apos;accès à l&apos;API
                    </CardDescription>
                  </div>
                  <Dialog
                    open={showNewTokenDialog}
                    onOpenChange={setShowNewTokenDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-[#67B142] rounded-[10px]">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Token
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Créer un nouveau token</DialogTitle>
                        <DialogDescription>
                          Donnez un nom à votre token pour l&apos;identifier
                          facilement
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="tokenName">Nom du token</Label>
                          <Input
                            id="tokenName"
                            value={newTokenName}
                            onChange={(e) => setNewTokenName(e.target.value)}
                            placeholder="Ex: Production API"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewTokenDialog(false)}
                          className="rounded-[6px]"
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handleCreateToken}
                          className="rounded-[6px] bg-[#67B142]"
                          disabled={!newTokenName.trim()}
                        >
                          Créer le token
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokens.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Key className="h-8 w-8" />
                        <p>Aucun token créé</p>
                        <p className="text-sm">
                          Créez votre premier token pour commencer à utiliser
                          l&apos;API
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Token</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Dernière utilisation</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tokens.map((token) => (
                          <TableRow key={token._id}>
                            <TableCell>{token.name}</TableCell>
                            <TableCell className="font-mono">
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-[200px]">
                                  {maskToken(token.token)}
                                </span>
                                {/* <HoverCard>
                                  <HoverCardTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                      className="rounded-lg h-8 w-8"
                                      disabled
                                      onClick={() =>
                                        copyToClipboard(token.token)
                                      }
                                >
                                  {copiedToken === token.token ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-auto p-2">
                                    <span className="text-sm">
                                      Copier le token complet
                                    </span>
                                  </HoverCardContent>
                                </HoverCard> */}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={
                                    token.isActive ? "default" : "secondary"
                                  }
                                  className="cursor-pointer bg-[#67B142] rounded-[6px]"
                                  onClick={() =>
                                    handleTokenStatusChange(
                                      token._id,
                                      !token.isActive
                                    )
                                  }
                                >
                                  {token.isActive ? "Actif" : "Inactif"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {token.lastUsed ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {format(
                                    new Date(token.lastUsed),
                                    "dd/MM/yyyy HH:mm",
                                    {
                                    locale: fr,
                                    }
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  Jamais utilisé
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="rounded-[6px] h-8 w-8"
                                onClick={() => handleDeleteToken(token._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <ShowCopiedToken
        open={isTokenVisible}
        token={tokenOnce}
        onClose={() => setIsTokenVisible(false)}
      />
    </div>
  );
} 
