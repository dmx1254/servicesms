"use client";

import { useEffect, useState } from "react";
import { ContactMy, UserLocation, formatDate } from "@/app/lib/utils/utils";
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
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export function LocationContact({
  handleAddContactMyOwn,
}: {
  handleAddContactMyOwn: (contact: ContactMy[]) => void;
}) {
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isActiveContact, setIsActiveContact] = useState<string>("");
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  // console.log(isActiveContact);
  // console.log(userLocations);

  const fetchDatabases = async () => {
    try {
      setIsDataLoading(true);
      const response = await fetch("/api/phone-database");
      const data = await response.json();
      // console.log(data);
      if (data) {
        setUserLocations(data.userLocations);
      }
    } catch (err) {
      console.log("Erreur lors du chargement des bases de données:", err);
      toast.error("Erreur lors du chargement des bases de données", {
        style: {
          backgroundColor: "#ef4444",
          color: "#fff",
        },
        position: "top-right",
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleConfirmed = () => {
    if (!isActiveContact) return;
    const contactSelected = userLocations.find(
      (location) => location._id === isActiveContact
    );
    if (contactSelected) {
      handleAddContactMyOwn(contactSelected?.userDblocation.phones);
    }
    setIsOpenDialog(false);
  };

  const handleCancelled = () => {
    handleAddContactMyOwn([]);
    setIsOpenDialog(false);
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl transition-all duration-300"
        >
          Contacts loués
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded">
        <DialogHeader>
          <DialogTitle>Base de données</DialogTitle>
          <DialogDescription>Mes bases de données Louées</DialogDescription>
        </DialogHeader>

        {isDataLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-full h-40 animate-pulse rounded-[6px]" />
            <Skeleton className="w-full h-40 animate-pulse rounded-[6px]" />
          </div>
        ) : userLocations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-lg font-bold mb-8 text-center bg-gradient-to-r from-[#67B142] to-[#4A8B2F] bg-clip-text text-transparent">
              Mes Bases de Données Louées
            </h2>
            <ScrollArea className="h-72 flex flex-col ml-4 mr-4 items-center justify-center gap-4 pb-2">
              {userLocations.map((location) => (
                <div
                  key={location._id}
                  className={`group w-full bg-white cursor-pointer rounded-2xl border  shadow-lg p-4 transition-all duration-300 relative overflow-hidden ${
                    isActiveContact === location._id
                      ? "border-[#67B142]"
                      : "border-gray-100 hover:border-[#67B142]"
                  }`}
                  onClick={() => setIsActiveContact(location._id)}
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  }}
                >
                  <div className="relative">
                    <h3 className="text-xl font-semibold mb-6 text-[#67B142] group-hover:text-[#4A8B2F] transition-colors">
                      {location.userDblocation.name}
                    </h3>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group-hover:bg-[#67B142]/5 transition-colors">
                        <Users className="w-5 h-5 text-[#67B142]" />
                        <span className="text-gray-600">
                          {location.userDblocation.phones.length.toLocaleString()}{" "}
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
                </div>
              ))}
            </ScrollArea>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="text-base font-semibold">
              Aucune base de donnees loues trouves
            </p>
            <Link
              href="/dashboard/location-bdd"
              className="bg-[#67B142] text-white rounded-[6px] text-sm px-4 py-2 mb-4"
            >
              Louer une nouvelle
            </Link>
          </div>
        )}

        <DialogFooter>
          <Button
            type="submit"
            className="bg-[#ef4444] text-white rounded-[6px] hover:bg-[#ef4444]"
            onClick={handleCancelled}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!userLocations.length}
            className="bg-[#67B142] text-white rounded-[6px]"
            onClick={handleConfirmed}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
