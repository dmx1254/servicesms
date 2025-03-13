import React, { useState, useEffect } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

const ShowCopiedToken = ({
  token,
  open,
  onClose,
}: {
  token: string;
  open: boolean;
  onClose?: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [tokenVisible, setTokenVisible] = useState(true);

  // Reset the copied state when the modal opens with a new token
  useEffect(() => {
    if (open) {
      setCopied(false);
      setTokenVisible(true);
    }
  }, [open, token]);

  const copyToClipboard = async () => {
    if (copied) return;

    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      // Once copied, start a countdown to hide the token for security
      setTimeout(() => {
        setTokenVisible(false);
      }, 30000); // Hide after 30 seconds
    } catch (err) {
      console.error("Failed to copy token", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Token SMS</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-500 mb-2 text-sm">
            Vous ne pouvez voir cette clé qu&apos;une seule fois. Conservez-la
            précieusement.
          </p>

          {tokenVisible ? (
            <div className="relative">
              <div className="flex items-center bg-gray-100 border rounded-md p-3 mb-2">
                <code className="text-sm font-mono truncate flex-1">
                  {token}
                </code>
                <button
                  onClick={copyToClipboard}
                  disabled={copied}
                  className={`ml-2 p-1 rounded ${
                    copied
                      ? "bg-gray-300 text-[#67B142]"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center">
              <AlertCircle size={16} className="text-yellow-500 mr-2" />
              <p className="text-sm text-yellow-700">
                Pour des raisons de sécurité, votre token a été masqué. Il a été
                copié dans votre presse-papiers.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            {copied ? (
              <span className="text-[#67B142] flex items-center">
                <Check size={14} className="mr-1" /> Copier
              </span>
            ) : (
              "Cliquer sur le bouton pour copier votre token"
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowCopiedToken;
