"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Database, Clock, Users, Star, Loader2 } from "lucide-react";
import { formatDate, UserLocation } from "@/app/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PhoneDatabase {
  _id: string;
  name: string;
  category: string;
  totalNumbers: number;
  qualityScore: number;
}

const senegal_regions = [
  {
    name: "Dakar",
    slug: "dakar",
  },
  {
    name: "Thiès",
    slug: "thies",
  },
  {
    name: "Saint-Louis",
    slug: "saint-louis",
  },
  {
    name: "Diourbel",
    slug: "diourbel",
  },
  {
    name: "Tambacounda",
    slug: "tambacounda",
  },
  {
    name: "Kaolack",
    slug: "kaolack",
  },
  {
    name: "Kolda",
    slug: "kolda",
  },
  {
    name: "Ziguinchor",
    slug: "ziguinchor",
  },
  {
    name: "Fatick",
    slug: "fatick",
  },
  {
    name: "Kaffrine",
    slug: "kaffrine",
  },
  {
    name: "Kédougou",
    slug: "kedougou",
  },
  {
    name: "Sédhiou",
    slug: "sedhiou",
  },
  {
    name: "Matam",
    slug: "matam",
  },
];

const CATEGORIES = [
  "particuliers",
  "entreprises",
  "etudiants",
  "commercants",
  "marketing",
  "transactionnels",
  "artisans",
];

const LocationPage = () => {
  const [databases, setDatabases] = useState<PhoneDatabase[]>([]);
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDatabase, setSelectedDatabase] =
    useState<PhoneDatabase | null>(null);
  const [rentingDetails, setRentingDetails] = useState<{ duration: number }>({
    duration: 7,
  });
  const [pricePerNumber, setPricePerNumber] = useState<number>(85);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number>(1000);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      setIsDataLoading(true);
      const response = await fetch("/api/phone-database", {
        cache: "force-cache",
      });
      const data = await response.json();
      // console.log(data);
      if (data.success) {
        setDatabases(data.databases);
        setUserLocations(data.userLocations);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des bases de données:", err);
      toast.error("Erreur lors du chargement des bases de données");
    } finally {
      setIsDataLoading(false);
    }
  };

  // console.log(pricePerNumber)
  // console.log(rentingDetails.duration)

  useEffect(() => {
    setPricePerNumber(
      85 *
        (1 + (rentingDetails.duration > 7 ? rentingDetails.duration / 100 : 0))
    );
  }, [rentingDetails.duration]);

  useEffect(() => {
    if (!selectedDatabase?.totalNumbers) return;
    setTotalPrice(pricePerNumber * selectedNumbers);
  }, [pricePerNumber, selectedNumbers, selectedDatabase?.totalNumbers]);

  const handleRent = async () => {
    if (!selectedDatabase) return;

    try {
      setIsLocationLoading(true);
      const response = await fetch("/api/phone-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          databaseId: selectedDatabase._id,
          duration: rentingDetails.duration,
          numberLimit: selectedNumbers,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message, {
          style: {
            backgroundColor: "#67B142",
            color: "#fff",
          },
          position: "top-right",
        });
        await fetchDatabases();
        setOpenDialog(false);
        setSelectedDatabase(null);
      } else {
        toast.error(data.error, {
          style: {
            backgroundColor: "#FF0000",
            color: "#fff",
          },
          position: "top-right",
        });
      }
    } catch (err: any) {
      console.log("Erreur lors de la location:", err);
      toast.error(err.response.data.error, {
        style: {
          backgroundColor: "#ef4444",
          color: "#fff",
        },
        position: "top-right",
      });
    } finally {
      setIsLocationLoading(false);
    }
  };

  const filteredDatabases = databases.filter((db) => {
    const matchesCategory =
      selectedCategory === "all" || db.category === selectedCategory;
    const matchesRegion = selectedRegion === "all";
    const matchesSearch =
      !searchTerm || db.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesRegion && matchesSearch;
  });

  // const categories = Array.from(new Set(databases.map((db) => db.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#67B142] to-[#4A8B2F] bg-clip-text text-transparent">
            Location de Base de Données
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de bases de données de numéros de
            téléphone pour vos campagnes SMS
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Input
                placeholder="Rechercher une base de données..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-[#67B142] focus:ring-[#67B142] rounded-xl pl-10"
              />
              <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="border-[#67B142] focus:ring-[#67B142] rounded-xl">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="border-[#67B142] focus:ring-[#67B142] rounded-xl">
                <SelectValue placeholder="Sélectionner une région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {senegal_regions.map((r) => (
                  <SelectItem key={r.slug} value={r.slug}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bases de données disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isDataLoading ? (
            <>
              <Skeleton className="w-full h-[200px] rounded-2xl" />
              <Skeleton className="w-full h-[200px] rounded-2xl" />
              <Skeleton className="w-full h-[200px] rounded-2xl" />
            </>
          ) : (
            filteredDatabases.map((database) => (
              <motion.div
                key={database._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#67B142] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#67B142]/5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-[#67B142] group-hover:text-[#4A8B2F] transition-colors">
                      {database.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-[#67B142]/10 to-[#4A8B2F]/10 px-4 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-[#67B142]" />
                      <span className="text-sm text-[#67B142] font-medium">
                        {database.qualityScore}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-[#67B142]/5 transition-colors">
                      <Users className="w-5 h-5 text-[#67B142]" />
                      <span className="text-gray-600">
                        {database.totalNumbers.toLocaleString()} numéros
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-[#67B142]/5 transition-colors">
                      <Database className="w-5 h-5 text-[#67B142]" />
                      <span className="text-gray-600 capitalize">
                        {database.category}
                      </span>
                    </div>
                  </div>
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-[#67B142] to-[#4A8B2F] hover:from-[#4A8B2F] hover:to-[#67B142] text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                        onClick={() => {
                          setSelectedDatabase(database);
                          setOpenDialog(true);
                        }}
                      >
                        Louer cette base
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#67B142] to-[#4A8B2F] bg-clip-text text-transparent">
                          Confirmer la location
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#67B142]/5 to-[#4A8B2F]/5 rounded-xl">
                          <span className="text-gray-600">
                            Prix par numéro et SMS:
                          </span>
                          <span className="font-semibold text-[#67B142] text-lg">
                            {pricePerNumber.toFixed(2)} FCFA
                          </span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#67B142]" />
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de numéros à louer
                              </label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min={1000}
                                  max={selectedDatabase?.totalNumbers || 1000}
                                  value={selectedNumbers}
                                  onChange={(e) =>
                                    setSelectedNumbers(Number(e.target.value))
                                  }
                                  className="w-full border-[#67B142] focus:ring-[#67B142] rounded-xl pl-4 pr-12"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  numéros
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Minimum: 1000 numéros | Maximum:{" "}
                                {selectedDatabase?.totalNumbers.toLocaleString()}{" "}
                                numéros
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[#67B142]" />
                            <Select
                              value={rentingDetails.duration.toString()}
                              onValueChange={(value) =>
                                setRentingDetails({ duration: parseInt(value) })
                              }
                            >
                              <SelectTrigger className="border-[#67B142] focus:ring-[#67B142] rounded-xl">
                                <SelectValue
                                  defaultValue={rentingDetails.duration.toString()}
                                  placeholder="Durée de location"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">1 semaine</SelectItem>
                                <SelectItem value="30">1 mois</SelectItem>
                                <SelectItem value="90">3 mois</SelectItem>
                                <SelectItem value="180">6 mois</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#67B142]/5 to-[#4A8B2F]/5 rounded-xl">
                          <span className="text-gray-600">Prix total:</span>
                          <span className="font-semibold text-[#67B142] text-lg">
                            {totalPrice.toFixed(2)} FCFA
                          </span>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-[#67B142] to-[#4A8B2F] hover:from-[#4A8B2F] hover:to-[#67B142] text-white rounded-xl py-6 text-lg font-medium transition-all duration-300"
                          onClick={handleRent}
                        >
                          {isLocationLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Confirmer la location"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bases de données louées */}
        {userLocations?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#67B142] to-[#4A8B2F] bg-clip-text text-transparent">
              Mes Bases de Données Louées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userLocations.map((location) => (
                <motion.div
                  key={location._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-[#67B142] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#67B142]/5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <h3 className="text-xl font-semibold mb-6 text-[#67B142] group-hover:text-[#4A8B2F] transition-colors">
                      {location?.userDblocation?.name}
                    </h3>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-[#67B142]/5 transition-colors">
                        <Users className="w-5 h-5 text-[#67B142]" />
                        <span className="text-gray-600">
                          {location?.userDblocation?.phones?.length.toLocaleString()}{" "}
                          numéros
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-[#67B142]/5 transition-colors">
                        <Clock className="w-5 h-5 text-[#67B142]" />
                        <span className="text-gray-600">
                          Expire le: {formatDate(location.expiresAt)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#67B142] to-[#4A8B2F] rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((new Date(location.expiresAt).getTime() -
                              new Date().getTime()) /
                              (new Date(location.expiresAt).getTime() -
                                new Date(location.createdAt).getTime())) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
