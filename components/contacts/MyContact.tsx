"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { FiUsers } from "react-icons/fi";

interface Contact {
  _id: string;
  prenom: string;
  nom: string;
  telephone: string;
  createdAt: string;
  groupName: string;
}
interface Group {
  name: string;
  count: number;
}

export function MyContact({
  handleAddContactMyOwn,
}: {
  handleAddContactMyOwn: (contact: Contact[]) => void;
}) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoadingGroups(true);
      const response = await fetch("/api/contacts/groups");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des groupes");
      }
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setGroups(data);
        // Si aucun groupe n'est sélectionné, on sélectionne le premier groupe (Tous les contacts)
        // if (!selectedGroup) {
        //   setSelectedGroup(data[0].name);
        // }
      } else {
        // Si aucun groupe n'existe, on crée le groupe par défaut
        setGroups([{ name: "Tous les contacts", count: 0 }]);
        setSelectedGroup("Tous les contacts");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les groupes", {
        style: {
          backgroundColor: "#f87171",
          color: "white",
        },
        position: "top-right",
      });
      // En cas d'erreur, on utilise le groupe par défaut
      setGroups([{ name: "Tous les contacts", count: 0 }]);
      setSelectedGroup("Tous les contacts");
    } finally {
      setIsLoadingGroups(false);
    }
  }, [selectedGroup]);

  // Fonction pour récupérer les contacts
  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contacts?group=${selectedGroup}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec du chargement des contacts");
      }

      setContacts(data.contacts);
      handleAddContactMyOwn(data.contacts);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Échec du chargement des contacts";
      toast.error(errorMessage);
    }
    setIsLoading(false);
  }, [selectedGroup]);

  // Effet pour charger les groupes au montage
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Effet pour charger les contacts quand les filtres changent
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Gestionnaire de changement de groupe
  const handleGroupChange = (groupName: string) => {
    if (groupName !== selectedGroup) {
      setSelectedGroup(groupName);
    }
  };

  const handleCancelled = () => {
    handleAddContactMyOwn([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl transition-all duration-300"
        >
          Mes contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl rounded">
        <DialogHeader>
          <DialogTitle>Importer vos contacts</DialogTitle>
          <DialogDescription>Choisir un groupe de contacts</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start w-full max-w-[500px] rounded">
          {/* Section des groupes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Groupes de contacts
            </h3>
            <ScrollArea className="w-full max-w-[500px] p-4 whitespace-nowrap px-1">
              <div className="flex gap-4 pb-2">
                {isLoadingGroups
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Card
                        key={index}
                        className="animate-pulse border-none shadow-sm flex-shrink-0"
                        style={{ minWidth: "120px" }}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  : groups.map((group) => (
                      <Card
                        key={group.name}
                        onClick={() => handleGroupChange(group.name)}
                        className={`cursor-pointer ml-2 p-2 transition-all duration-200 mt-2 flex-shrink-0 ${
                          selectedGroup === group.name
                            ? "ring-2 ring-[#67B142] ring-offset-2 shadow-lg bg-[#67B142]/5"
                            : "shadow-sm hover:shadow-md hover:bg-gray-50"
                        }`}
                        style={{ minWidth: "120px" }}
                      >
                        <CardContent className="flex items-center gap-2 p-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              selectedGroup === group.name
                                ? "bg-[#67B142] text-white"
                                : "bg-[#67B142]/10 text-[#67B142]"
                            }`}
                          >
                            <FiUsers className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-medium text-sm truncate ${
                                selectedGroup === group.name
                                  ? "text-[#67B142]"
                                  : "text-gray-800"
                              }`}
                            >
                              {group.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {group.count}{" "}
                              {group.count > 1 ? "contacts" : "contact"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
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
            className="bg-[#67B142] text-white rounded-[6px]"
            onClick={() => setIsOpen(false)}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
