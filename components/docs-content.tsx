"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  KeyRound,
  Zap,
  Code2,
  Terminal,
  Rocket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({
  language,
  children,
}: {
  language: string;
  children: string | string[];
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(typeof children === 'string' ? children : children.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 bg-background/80 backdrop-blur-sm" 
          onClick={copyToClipboard}
        >
          {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </Button>
      </div>
      <div className="bg-zinc-950 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 text-sm text-zinc-400 px-4 py-2 bg-zinc-900/50">
          <Code2 className="h-4 w-4" />
          <span>{language}</span>
        </div>
        <div className="p-4">
          <SyntaxHighlighter
            language={language}
            style={{
              ...vscDarkPlus,
              'pre[class*="language-"]': {
                ...vscDarkPlus['pre[class*="language-"]'],
                background: 'transparent',
                margin: 0,
                padding: 0,
              },
              'code[class*="language-"]': {
                ...vscDarkPlus['code[class*="language-"]'],
                background: 'transparent',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                color: '#e4e4e7', // zinc-200
              },
              comment: {
                ...vscDarkPlus.comment,
                color: '#71717a', // zinc-500
              },
              string: {
                ...vscDarkPlus.string,
                color: '#4ade80', // green-400
              },
              number: {
                ...vscDarkPlus.number,
                color: '#60a5fa', // blue-400
              },
              function: {
                ...vscDarkPlus.function,
                color: '#f472b6', // pink-400
              },
              keyword: {
                ...vscDarkPlus.keyword,
                color: '#c084fc', // purple-400
              },
            }}
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent',
            }}
          >
            {typeof children === 'string' ? children : children.join('\n')}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

interface ResponseExampleProps {
  status: number;
  response: {
    success?: boolean;
    message?: string;
    error?: string;
    status?: number;
    data?: Record<string, unknown>;
    remainingCredits?: number;
  };
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const ResponseExample = ({ status, response }: ResponseExampleProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 px-1">
      {status >= 200 && status < 300 ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      ) : (
        <XCircle className="h-5 w-5 text-rose-500" />
      )}
      <span className="font-mono text-base font-medium">Status: {status}</span>
    </div>
    <CodeBlock language="json">{JSON.stringify(response, null, 2)}</CodeBlock>
  </div>
);

export function DocsContent() {
  const [activeSection, setActiveSection] = useState("quickstart");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-5xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Intégrez notre service SMS dans vos applications en quelques minutes
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <Button size="lg" className="gap-2 text-base" onClick={() => scrollToSection("quickstart")}>
            <Rocket className="h-5 w-5" />
            Commencer
          </Button>
          <Button variant="outline" size="lg" className="gap-2 text-base" asChild>
            <Link href="/dashboard/settings">
              <Terminal className="h-5 w-5" />
              Obtenir un Token
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-12 relative">
        {/* Sidebar Navigation - Fixed */}
        <div className="w-[280px] shrink-0">
          <div className="fixed w-[280px] p-4 rounded-lg border bg-card">
            <div className="font-medium text-lg mb-4">Guide</div>
          <nav className="space-y-2">
            {[
              { id: "quickstart", icon: Zap, label: "Démarrage Rapide" },
              { id: "authentication", icon: KeyRound, label: "Authentication" },
              { id: "messages", icon: MessageSquare, label: "Messages" },
              { id: "errors", icon: AlertTriangle, label: "Erreurs" },
              { id: "rate-limits", icon: Clock, label: "Limites" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={classNames(
                    "flex items-center gap-3 text-base p-3 rounded-lg w-full hover:bg-secondary transition-colors",
                    activeSection === id ? "bg-secondary text-primary font-medium" : "text-muted-foreground"
                )}
              >
                  <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-16">
          {/* Quick Start */}
          <section id="quickstart" className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">Démarrage Rapide</h2>
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Envoyer votre premier SMS</h3>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  Envoyez votre premier SMS en suivant ces étapes :
                </p>
                <Tabs defaultValue="curl" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="php">PHP</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="curl">
                    <CodeBlock language="bash">
                      {`# Envoi d'un SMS
curl -X POST https://api.servicesms.com/api/sms/message \\
  -H "Authorization: Bearer votre_token_api" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+221xxxxxxxxx",
    "message": "Mon premier SMS via l'\''API!",
    "signature": "MaSociete"
  }'`}
                    </CodeBlock>
                  </TabsContent>
                  <TabsContent value="javascript">
                    <CodeBlock language="javascript">
                      {`// Configuration
const API_TOKEN = 'votre_token_api';
const API_URL = 'https://api.servicesms.com/api';

// Fonction d'envoi de SMS
async function sendSMS(to, message, signature = 'MaSociete') {
  try {
    const response = await fetch(\`\${API_URL}/sms/message\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message, signature })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\\'envoi:', error);
    throw error;
  }
}

// Exemple d'utilisation
sendSMS(
  '+221xxxxxxxxx',
  'Mon premier SMS via l\\'API!'
).then(console.log).catch(console.error);`}
                    </CodeBlock>
                  </TabsContent>
                  <TabsContent value="php">
                    <CodeBlock language="php">
                      {`<?php
// Configuration
$apiToken = 'votre_token_api';
$apiUrl = 'https://api.servicesms.com/api';

// Fonction d'envoi de SMS
function sendSMS($to, $message, $signature = 'MaSociete') {
    global $apiToken, $apiUrl;
    
    $data = [
        'to' => $to,
        'message' => $message,
        'signature' => $signature
    ];
    
    $ch = curl_init("$apiUrl/sms/message");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur lors de l'envoi: $error");
    }
    
    return json_decode($response, true);
}

// Exemple d'utilisation
try {
    $result = sendSMS(
        '+221xxxxxxxxx',
        'Mon premier SMS via l\\'API!'
    );
    print_r($result);
} catch (Exception $e) {
    echo $e->getMessage();
}`}
                    </CodeBlock>
                  </TabsContent>
                  <TabsContent value="python">
                    <CodeBlock language="python">
                      {`import requests
import json

# Configuration
API_TOKEN = 'votre_token_api'
API_URL = 'https://api.servicesms.com/api'

def send_sms(to, message, signature='MaSociete'):
    """
    Envoie un SMS via l'API.
    
    Args:
        to (str): Numéro de téléphone du destinataire
        message (str): Contenu du message
        signature (str, optional): Signature de l'expéditeur
    
    Returns:
        dict: Réponse de l'API
    """
    try:
        response = requests.post(
            f"{API_URL}/sms/message",
            headers={
                'Authorization': f'Bearer {API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'to': to,
                'message': message,
                'signature': signature
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi: {e}")
        raise

# Exemple d'utilisation
try:
    result = send_sms(
        '+221xxxxxxxxx',
        'Mon premier SMS via l\\'API!'
    )
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Erreur: {e}")`}
                    </CodeBlock>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </section>

          {/* Authentication */}
          <section id="authentication" className="space-y-6">
            <h2 className="text-3xl font-bold">Authentication</h2>
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Toutes les requêtes API doivent inclure votre token dans
                  l&apos;en-tête HTTP.
                </p>
                <CodeBlock language="bash">
                  Authorization: Bearer votre_token_api
                </CodeBlock>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Réponses d&apos;erreur d&apos;authentification
                </h3>
                <div className="grid gap-4">
                  <ResponseExample
                    status={401}
                    response={{
                      error: "Token d'authentification manquant",
                      status: 401,
                    }}
                  />
                  <ResponseExample
                    status={403}
                    response={{
                      error: "Token invalide ou expiré",
                      status: 403,
                    }}
                  />
                </div>
              </div>
            </Card>
          </section>

          {/* Messages API */}
          <section id="messages" className="space-y-6">
            <h2 className="text-3xl font-bold">API Messages</h2>

            <Tabs defaultValue="send" className="space-y-6">
              <TabsList>
                <TabsTrigger value="send">Envoyer un SMS</TabsTrigger>
                <TabsTrigger value="otp-send">Envoyer un OTP</TabsTrigger>
                <TabsTrigger value="otp-verify">Vérifier un OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="send">
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Envoyer un SMS</h3>
                      <p className="text-sm text-muted-foreground">
                        POST /api/sms/message
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Requête</h4>
                    <CodeBlock language="json">
                      {JSON.stringify(
                        {
                          to: "+221xxxxxxxxx",
                          message: "Votre message",
                          signature: "NomSociete",
                          campaignName: "Campaign",
                        },
                        null,
                        2
                      )}
                    </CodeBlock>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Réponses</h4>
                    <div className="grid gap-4">
                      <ResponseExample
                        status={200}
                        response={{
                          success: true,
                          message: "SMS envoyé avec succès",
                          data: {
                            messageId: "msg_123abc",
                            remainingCredits: 42,
                            cost: 1,
                            status: "sent",
                          },
                        }}
                      />
                      <ResponseExample
                        status={400}
                        response={{
                          error: "Numéro de téléphone et message requis",
                          status: 400,
                        }}
                      />
                      <ResponseExample
                        status={403}
                        response={{
                          error: "Crédits SMS insuffisants",
                          status: 403,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="otp-send">
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        Envoyer un code OTP
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        POST /api/sms/otp/send
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Requête</h4>
                    <CodeBlock language="json">
                      {JSON.stringify(
                        {
                          phone: "+221xxxxxxxxx",
                          signature: "OTP",
                        },
                        null,
                        2
                      )}
                    </CodeBlock>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Réponses</h4>
                    <div className="grid gap-4">
                      <ResponseExample
                        status={200}
                        response={{
                          success: true,
                          message: "Code OTP envoyé avec succès",
                          remainingCredits: 42,
                        }}
                      />
                      <ResponseExample
                        status={400}
                        response={{
                          error: "Numéro de téléphone requis",
                          status: 400,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="otp-verify">
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        Vérifier un code OTP
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        POST /api/sms/otp/verify
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Requête</h4>
                    <CodeBlock language="json">
                      {JSON.stringify(
                        {
                          phone: "+221xxxxxxxxx",
                          code: "123456",
                        },
                        null,
                        2
                      )}
                    </CodeBlock>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Réponses</h4>
                    <div className="grid gap-4">
                      <ResponseExample
                        status={200}
                        response={{
                          success: true,
                          message: "Code OTP vérifié avec succès",
                        }}
                      />
                      <ResponseExample
                        status={400}
                        response={{
                          error: "Code OTP expiré ou invalide",
                          status: 400,
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Errors */}
          <section id="errors" className="space-y-6">
            <h2 className="text-3xl font-bold">Gestion des Erreurs</h2>
            <Card className="p-6">
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Notre API utilise des codes d&apos;erreur HTTP standards. Chaque
                  erreur inclut un message pour vous aider à résoudre le
                  problème.
                </p>

                <div className="grid gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-medium">400 - Requête Invalide</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      La requête contient des paramètres manquants ou invalides.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-5 w-5 text-red-500" />
                      <h4 className="font-medium">401 - Non Autorisé</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Le token d&apos;authentification est manquant ou invalide.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <h4 className="font-medium">403 - Interdit</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Crédits SMS insuffisants ou action non autorisée.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <h4 className="font-medium">500 - Erreur Serveur</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Une erreur inattendue s&apos;est produite sur nos serveurs.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="space-y-6">
            <h2 className="text-3xl font-bold">Limites et Quotas</h2>
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium">Limites Générales</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>• Maximum de 100 requêtes par minute</li>
                      <li>• Maximum de 10 000 SMS par jour</li>
                      <li>• Taille maximale du message : 160 caractères</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium">Limites OTP</h4>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>• Maximum de 5 tentatives par numéro par minute</li>
                      <li>• Les codes OTP expirent après 1 minute</li>
                      <li>• Maximum de 3 codes OTP actifs par numéro</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium">En-têtes de Limite</h4>
                    <div className="mt-2 space-y-2">
                      <CodeBlock language="http">
                        {`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
} 