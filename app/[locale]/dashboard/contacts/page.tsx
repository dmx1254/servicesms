"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  FiUpload,
  FiFile,
  FiCheck,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiPlus,
  FiX,
  FiUsers,
  FiPhone,
  FiMoreVertical,
  FiEdit,
  FiTrash,
} from "react-icons/fi";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileUploadState {
  loading: boolean;
  error: string | null;
  success: boolean;
  fileName: string | null;
}

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

const ContactsPage = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    loading: false,
    error: null,
    success: false,
    fileName: null,
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>("Tous les contacts");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [newContact, setNewContact] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    groupName: "",
  });

  // Fonction pour récupérer les groupes
  const fetchGroups = useCallback(async () => {
    try {
      setIsLoadingGroups(true);
      const response = await fetch('/api/contacts/groups');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des groupes');
      }
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setGroups(data);
        // Si aucun groupe n'est sélectionné, on sélectionne le premier groupe (Tous les contacts)
        if (!selectedGroup) {
          setSelectedGroup(data[0].name);
        }
      } else {
        // Si aucun groupe n'existe, on crée le groupe par défaut
        setGroups([{ name: 'Tous les contacts', count: 0 }]);
        setSelectedGroup('Tous les contacts');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger les groupes');
      // En cas d'erreur, on utilise le groupe par défaut
      setGroups([{ name: 'Tous les contacts', count: 0 }]);
      setSelectedGroup('Tous les contacts');
    } finally {
      setIsLoadingGroups(false);
    }
  }, [selectedGroup]);

  // Fonction pour récupérer les contacts
  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/contacts?page=${currentPage}&search=${searchQuery}&group=${selectedGroup}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Échec du chargement des contacts');
      }
      
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec du chargement des contacts';
      toast.error(errorMessage);
    }
    setIsLoading(false);
  }, [currentPage, searchQuery, selectedGroup]);

  // Effet pour charger les groupes au montage
  React.useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Effet pour charger les contacts quand les filtres changent
  React.useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Gestionnaire de changement de groupe
  const handleGroupChange = (groupName: string) => {
    if (groupName !== selectedGroup) {
      setSelectedGroup(groupName);
      setCurrentPage(1); // Réinitialiser la pagination
      setSearchQuery(''); // Réinitialiser la recherche
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!groupName.trim()) {
      toast.error("Le nom du groupe est requis");
      return;
    }

    setUploadState({
      loading: true,
      error: null,
      success: false,
      fileName: file.name,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupName", groupName);

    try {
      const fileType = file.name.endsWith(".csv") ? "csv" : "excel";
      const response = await fetch(`/api/contacts/${fileType}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec du téléchargement du fichier");
      }

      setUploadState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        error: null,
      }));

      toast.success(`${data.count} contacts importés avec succès !`);

      fetchContacts();
      fetchGroups();
      setIsImportModalOpen(false);
      setGroupName("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";
      setUploadState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
      }));
      toast.error(errorMessage);
    }
  }, [groupName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  // Fonction pour ajouter un contact
  const handleAddContact = async () => {
    try {
      if (!newContact.prenom.trim() || !newContact.nom.trim() || !newContact.telephone.trim() || !newContact.groupName.trim()) {
        toast.error("Tous les champs sont requis");
        return;
      }

      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout du contact");
      }

      toast.success("Contact ajouté avec succès");
      setIsAddContactModalOpen(false);
      setNewContact({ prenom: "", nom: "", telephone: "", groupName: "" });
      fetchContacts();
      fetchGroups();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Contacts</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Gérez vos contacts et groupes</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-[#67B142] hover:bg-[#67B142]/90 rounded-full px-6 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiUpload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            <Button 
              onClick={() => setIsAddContactModalOpen(true)}
              className="bg-[#67B142] hover:bg-[#67B142]/90 rounded-full px-6 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Section des groupes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Groupes de contacts</h3>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
                {isLoadingGroups ? (
                  // Placeholders de chargement pour les groupes
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="animate-pulse border-none shadow-sm" style={{ minWidth: '250px' }}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  groups.map((group) => (
                    <Card
                      key={group.name}
                      onClick={() => handleGroupChange(group.name)}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedGroup === group.name
                          ? 'ring-2 ring-[#67B142] ring-offset-2 shadow-lg bg-[#67B142]/5'
                          : 'shadow-sm hover:shadow-md hover:bg-gray-50'
                      }`}
                      style={{ minWidth: '250px' }}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedGroup === group.name
                              ? 'bg-[#67B142] text-white'
                              : 'bg-[#67B142]/10 text-[#67B142]'
                          }`}
                        >
                          <FiUsers className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            selectedGroup === group.name ? 'text-[#67B142]' : 'text-gray-800'
                          }`}>
                            {group.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {group.count} {group.count > 1 ? 'contacts' : 'contact'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Barre de recherche */}
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher des contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-11 rounded-full border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]/20"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="h-11 w-11 rounded-full border-gray-200 hover:bg-gray-50"
            >
              <FiFilter className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          {/* Tableau amélioré */}
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
            <ScrollArea className="h-[600px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="bg-gray-50/50 p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                    <th className="bg-gray-50/50 p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="bg-gray-50/50 p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                    <th className="bg-gray-50/50 p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groupe</th>
                    <th className="bg-gray-50/50 p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="bg-gray-50/50 p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin h-5 w-5 border-3 border-[#67B142] border-t-transparent rounded-full" />
                          <span className="text-sm text-gray-500">Chargement des contacts...</span>
                        </div>
                      </td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <FiUsers className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="font-medium">Aucun contact trouvé</p>
                            <p className="text-sm text-gray-400 mt-1">Commencez par importer ou ajouter des contacts</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-medium text-gray-900">{contact.prenom}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-gray-900">{contact.nom}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#67B142]/10 flex items-center justify-center">
                              <FiPhone className="w-4 h-4 text-[#67B142]" />
                            </div>
                            <span className="text-gray-600">{contact.telephone || '-'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                            {contact.groupName || '-'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-500">
                            {new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-gray-100"
                              >
                                <FiMoreVertical className="w-4 h-4 text-gray-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="py-2 cursor-pointer">
                                <FiEdit className="w-4 h-4 mr-2 text-gray-500" />
                                <span>Modifier</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="py-2 cursor-pointer text-red-600 focus:text-red-600">
                                <FiTrash className="w-4 h-4 mr-2" />
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-full px-4 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-full px-4 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'ajout de contact */}
      <Dialog open={isAddContactModalOpen} onOpenChange={setIsAddContactModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold text-gray-800">Ajouter un contact</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              Créez un nouveau contact manuellement
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="prenom" className="text-sm font-medium text-gray-700">
                Prénom
              </label>
              <Input
                id="prenom"
                value={newContact.prenom}
                onChange={(e) => setNewContact(prev => ({ ...prev, prenom: e.target.value }))}
                placeholder="Entrez le prénom"
                className="rounded-lg border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nom" className="text-sm font-medium text-gray-700">
                Nom
              </label>
              <Input
                id="nom"
                value={newContact.nom}
                onChange={(e) => setNewContact(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Entrez le nom"
                className="rounded-lg border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telephone" className="text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <Input
                id="telephone"
                value={newContact.telephone}
                onChange={(e) => setNewContact(prev => ({ ...prev, telephone: e.target.value }))}
                placeholder="Entrez le numéro de téléphone"
                className="rounded-lg border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="groupName" className="text-sm font-medium text-gray-700">
                Groupe
              </label>
              <Input
                id="groupName"
                value={newContact.groupName}
                onChange={(e) => setNewContact(prev => ({ ...prev, groupName: e.target.value }))}
                placeholder="Entrez le nom du groupe"
                className="rounded-lg border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]/20"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsAddContactModalOpen(false)}
                className="rounded-full px-4 border-gray-200 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddContact}
                className="bg-[#67B142] hover:bg-[#67B142]/90 rounded-full px-6 transition-all duration-200"
              >
                Ajouter le contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'import existant */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold text-gray-800">Importer des contacts</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              Importez vos contacts à partir d&apos;un fichier CSV ou Excel
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-6">
            <div className="space-y-2">
              <label htmlFor="groupName" className="text-sm font-medium text-gray-700">
                Nom du groupe
              </label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Entrez le nom du groupe"
                className="rounded-lg border-gray-200 focus:border-[#67B142] focus:ring-[#67B142]/20"
              />
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragActive
                  ? "border-[#67B142] bg-[#67B142]/5"
                  : "border-gray-200 hover:border-[#67B142] hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isDragActive ? 'bg-[#67B142]/10' : 'bg-gray-100'
                  }`}>
                    <FiUpload className={`w-8 h-8 ${isDragActive ? 'text-[#67B142]' : 'text-gray-400'}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Déposez votre fichier ici, ou{" "}
                    <span className="text-[#67B142]">parcourir</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats supportés : CSV, XLS et XLSX
                  </p>
                </div>
              </div>
            </div>

            {uploadState.fileName && (
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <FiFile className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadState.fileName}
                  </p>
                  <div className="flex items-center mt-1">
                    {uploadState.loading && (
                      <div className="animate-spin h-4 w-4 border-2 border-[#67B142] border-t-transparent rounded-full mr-2" />
                    )}
                    {uploadState.success && (
                      <FiCheck className="w-4 h-4 text-[#67B142] mr-2" />
                    )}
                    {uploadState.error && (
                      <FiAlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <p className="text-xs text-gray-500">
                      {uploadState.loading
                        ? "Traitement en cours..."
                        : uploadState.success
                        ? "Import terminé"
                        : uploadState.error
                        ? uploadState.error
                        : "Prêt à importer"}
                    </p>
                  </div>
                </div>
                {!uploadState.loading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-200"
                    onClick={() => setUploadState((prev) => ({ ...prev, fileName: null }))}
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsPage;
