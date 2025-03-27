"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IUser } from "@/app/lib/models/user.model";
import clsx from "clsx";
import { formatDateAndHours } from "@/app/lib/utils/utils";

interface Invoice {
  id: string;
  smsQuantity: number;
  price: number;
  currency: string;
  bussinessName: string;
  userId: IUser;
  checkoutStatus: string;
  paymentStatus: string;
  completedPaymentDate: string;
}

const InvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/user/invoices");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des factures");
        }
        const data = await response.json();
        console.log(data);
        setInvoices(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Logique de téléchargement de facture à implémenter
    console.log("Télécharger la facture", invoice);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Logique de visualisation de facture à implémenter
    console.log("Voir la facture", invoice);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-[#67B142]" size={38} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Mes Factures
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucune facture disponible
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date de paiement</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Quantité SMS</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {formatDateAndHours(invoice.completedPaymentDate)}
                    </TableCell>
                    <TableCell>{invoice.bussinessName}</TableCell>
                    <TableCell>{invoice.smsQuantity} SMS</TableCell>
                    <TableCell>
                      {invoice.price} {invoice.currency}
                    </TableCell>
                    <TableCell>
                      <span
                        className={clsx(
                          "p-2 text-sm shadow-lg text-white rounded-full",
                          {
                            "bg-[#67B142]":
                              invoice.paymentStatus === "succeeded",
                            "bg-[#fde047]": invoice.paymentStatus === "pending",
                            "bg-[#ef4444]": invoice.paymentStatus === "failed",
                            "bg-[#3b82f6]":
                              invoice.paymentStatus === "in_progress",
                          }
                        )}
                      >
                        {/* className={`bg-[${getStatusColor(
                          invoice.paymentStatus
                        )}] rounded-full`} */}
                        {invoice.paymentStatus === "succeeded"
                          ? "Payée"
                          : invoice.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded bg-orange-50 text-orange-500 hover:bg-orange-100 hover:text-orange-500"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePage;
