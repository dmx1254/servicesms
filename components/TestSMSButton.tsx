import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TestSMSButton() {
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  const handleTestSMS = async () => {
    try {
      setLoading(true);

      if (!recipient || !message || !signature) {
        toast.error(
          "Please fill in all fields (recipient, message, and signature)"
        );
        return;
      }

      // Format phone number (remove + if present and ensure it starts with 221)
      let formattedRecipient = recipient.replace("+", "");
      if (!formattedRecipient.startsWith("221")) {
        formattedRecipient = "221" + formattedRecipient;
      }

      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: formattedRecipient,
          content: message,
          signature: signature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send SMS");
      }

      toast.success("SMS sent successfully!");
      // Clear the form
      setRecipient("");
      setMessage("");
    } catch (error) {
      console.error("Error sending test SMS:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send SMS"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Test d&apos;envoi SMS</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Signature</label>
          <Select value={signature} onValueChange={setSignature}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Sélectionnez une signature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GUEDE UNI">GUEDE UNI</SelectItem>
              <SelectItem value="SY-PRESSING">SY-PRESSING</SelectItem>
              <SelectItem value="DAHIRA KONU">DAHIRA KONU</SelectItem>
              <SelectItem value="ABA VOYAGE">ABA VOYAGE</SelectItem>
              {/* Add your other validated signatures here */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Numéro de téléphone
          </label>
          <Input
            placeholder="Ex: 778417586 ou 221778417586"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            type="tel"
            className="max-w-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: 778XXXXXX ou 221778XXXXXX
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Message</label>
          <Textarea
            placeholder="Contenu du message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="max-w-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length} caractères
          </p>
        </div>
      </div>

      <Button
        onClick={handleTestSMS}
        disabled={loading || !recipient || !message || !signature}
        className="bg-[#67B142] hover:bg-[#67B142]/90"
      >
        {loading ? "Envoi en cours..." : "Envoyer le SMS"}
      </Button>
    </div>
  );
}
