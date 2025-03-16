"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MessageSquare,
  Send,
  CheckCircle2,
  Users,
  BarChart3,
  Globe,
  Sparkle,
} from "lucide-react";
import { cn } from "@/app/lib/utils/utils";
import * as THREE from "three";
import React from "react";
import { useScopedI18n } from "@/locales/client";
import Link from "next/link";

// Add JSX namespace
/// <reference types="react" />

// Types
type PhoneObject = {
  mesh: THREE.Group;
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
  floatSpeed: number;
  floatOffset: number;
  messageType: MessageType;
};

type MessageType = "sms" | "rcs" | "campaign" | "transactional" | "reminder";

type Message = {
  id: number;
  text: string;
  sent: boolean;
  type: MessageType;
  time: string;
  attachment?: {
    type: "image" | "button" | "carousel";
    content: string;
  };
};

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  iconBg: string;
  type: MessageType;
  bgColor: string;
};

// Composant carte 3D avec effet de perspective
type Card3DProps = {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  isActive?: boolean;
};

const Card3D = React.memo(function Card3D({
  children,
  className,
  depth = 40,
  isActive = false,
}: Card3DProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mouvement plus fluide avec des springs
  const rotateX = useSpring(useTransform(y, [-100, 100], [depth, -depth]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-depth, depth]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculer la position relative de la souris par rapport au centre
    x.set((event.clientX - centerX) / 5);
    y.set((event.clientY - centerY) / 5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={cn(
        "perspective-1000 cursor-pointer transition-all duration-300",
        isActive ? "z-10 scale-105" : "hover:scale-102",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: 10 }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {/* Ombre qui se déplace avec l'effet 3D */}
        <motion.div
          className="absolute inset-0 rounded-xl -z-10 opacity-50 blur-md bg-black/20"
          style={{
            rotateX: useTransform(rotateX, (val) => -val / 2),
            rotateY: useTransform(rotateY, (val) => -val / 2),
            translateZ: -10,
            translateX: useTransform(rotateY, [-depth, depth], [-5, 5]),
            translateY: useTransform(rotateX, [-depth, depth], [-5, 5]),
          }}
        />
      </motion.div>
    </motion.div>
  );
});

// Particule 3D qui flotte dans l'espace
const Particle3D: React.FC<{
  delay: number;
  duration: number;
  size?: number;
  x?: number;
  y?: number;
  color?: string;
}> = ({ delay, duration, size = 6, x = 0, y = 0, color = "#67B142" }) => {
  return (
    <motion.div
      className="absolute rounded-full z-0"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
        z: [0, 100, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    />
  );
};

export default function HeroSection() {
  const tScope = useScopedI18n("hero");
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeMessageType, setActiveMessageType] =
    useState<MessageType>("sms");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.2 });
  const controls = useAnimation();

  // Effet de parallaxe
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const normalizedX = (clientX / windowWidth) * 2 - 1;
    const normalizedY = (clientY / windowHeight) * 2 - 1;

    setMousePosition({ x: normalizedX, y: normalizedY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Animation pour les téléphones flottants
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Memoize particles first
  const particles = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => (
        <Particle3D
          key={i}
          delay={i * 0.3}
          duration={2 + Math.random() * 4}
          size={3 + Math.random() * 5}
          x={(Math.random() - 0.5) * 600}
          y={(Math.random() - 0.5) * 600}
          color={i % 3 === 0 ? "#67B142" : i % 3 === 1 ? "#4285F4" : "#ffffff"}
        />
      )),
    []
  );

  const renderedParticles = React.useMemo(
    () => (mounted ? particles : null),
    [mounted, particles]
  );

  // Three.js setup and animation
  useEffect(() => {
    setMounted(true);
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lumières améliorées
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x67b142, 1);
    directionalLight.position.set(5, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Lumières d'accent plus intenses
    const greenPointLight = new THREE.PointLight(0x67b142, 1.5, 20);
    greenPointLight.position.set(3, 3, 5);
    scene.add(greenPointLight);

    const bluePointLight = new THREE.PointLight(0x4285f4, 1.2, 20);
    bluePointLight.position.set(-3, -3, 5);
    scene.add(bluePointLight);

    // Lumière spéculaire pour accentuer les reflets
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 10, 15);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.2;
    scene.add(spotLight);

    // Création des téléphones 3D avec un meilleur rendu
    const phones: PhoneObject[] = [];

    // Géométries plus détaillées
    const phoneGeometry = new THREE.BoxGeometry(0.5, 1, 0.1, 2, 4, 2);
    const screenGeometry = new THREE.PlaneGeometry(0.4, 0.8, 4, 8);

    // Matériaux plus réalistes avec reflets
    const phoneMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.7,
        roughness: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.1,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.6,
        roughness: 0.3,
      }),
    ];

    // Textures pour les écrans avec effet brillant
    const screenMaterials = [
      new THREE.MeshPhongMaterial({
        color: 0x67b142,
        shininess: 100,
        emissive: 0x67b142,
        emissiveIntensity: 0.3,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x4285f4,
        shininess: 100,
        emissive: 0x4285f4,
        emissiveIntensity: 0.3,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x34a853,
        shininess: 100,
        emissive: 0x34a853,
        emissiveIntensity: 0.3,
      }),
    ];

    const messageTypes: MessageType[] = [
      "sms",
      "rcs",
      "campaign",
      "transactional",
      "reminder",
    ];

    // Création de plusieurs téléphones avec une meilleure disposition
    for (let i = 0; i < 25; i++) {
      // Plus de téléphones pour un meilleur effet de profondeur
      const phone = new THREE.Group();

      // Corps du téléphone
      const phoneMesh = new THREE.Mesh(
        phoneGeometry,
        phoneMaterials[i % phoneMaterials.length]
      );

      // Écran du téléphone avec effet brillant
      const screenMesh = new THREE.Mesh(
        screenGeometry,
        screenMaterials[i % screenMaterials.length]
      );
      screenMesh.position.z = 0.06;

      // Bords arrondis simulés
      const frameMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 1.02, 0.08, 2, 4, 2),
        new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.8,
          roughness: 0.2,
        })
      );
      frameMesh.position.z = -0.01;

      phone.add(frameMesh);
      phone.add(phoneMesh);
      phone.add(screenMesh);

      // Positionnement en spirale 3D pour un meilleur effet de profondeur
      const angle = i * 0.5;
      const radius = 5 + i * 0.3;
      const heightVariation = Math.sin(i * 0.7) * 3;

      phone.position.x = Math.cos(angle) * radius;
      phone.position.y = Math.sin(angle) * radius + heightVariation;
      phone.position.z = -15 - i * 0.7; // Plus de variation en profondeur

      // Rotation initiale plus variée
      phone.lookAt(0, 0, 0);
      phone.rotation.x += Math.random() * 0.7 - 0.35;
      phone.rotation.y += Math.random() * 0.7 - 0.35;
      phone.rotation.z += Math.random() * 0.4 - 0.2;

      scene.add(phone);
      phones.push({
        mesh: phone,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.015, // Rotation plus prononcée
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.008,
        },
        floatSpeed: 0.008 + Math.random() * 0.012, // Flottement plus rapide
        floatOffset: Math.random() * Math.PI * 2,
        messageType: messageTypes[i % messageTypes.length],
      });
    }

    // Particules (étoiles/messages volants) améliorées
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 400; // Plus de particules
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Distribuer les particules en forme de sphère et nuage autour de l'origine
      const i3 = i;
      const radius = 15 + Math.random() * 15; // Plus grande variation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      posArray[i3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i3 + 2] = radius * Math.cos(phi) - 10; // Déplacer en profondeur
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    // Créer des matériaux variés pour les particules avec des effets plus brillants
    const particleMaterials = [
      new THREE.PointsMaterial({
        size: 0.08,
        color: 0x67b142,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true, // Taille varie avec la distance
      }),
      new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
      new THREE.PointsMaterial({
        size: 0.09,
        color: 0x4285f4,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    ];

    const particleGroups: THREE.Points[] = [];

    // Créer trois groupes de particules avec différentes propriétés
    for (let i = 0; i < 3; i++) {
      const particles = new THREE.Points(
        particlesGeometry,
        particleMaterials[i]
      );
      particles.rotation.x = Math.random() * Math.PI;
      particles.rotation.y = Math.random() * Math.PI;
      particles.position.z = i * -5; // Étager les particules en profondeur
      scene.add(particles);
      particleGroups.push(particles);
    }

    // Traînées de lumière pour effet de mouvement
    const trailGeometry = new THREE.BufferGeometry();
    const trailCount = 50;
    const trailPositions = new Float32Array(trailCount * 3);

    for (let i = 0; i < trailCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 10;

      trailPositions[i] = Math.cos(angle) * radius;
      trailPositions[i + 1] = Math.sin(angle) * radius;
      trailPositions[i + 2] = -10 - Math.random() * 20;
    }

    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3)
    );

    const trailMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x67b142,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const trails = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trails);

    // Positionnement de la caméra avec un meilleur angle
    camera.position.z = 10;
    camera.position.y = 1;
    camera.position.x = 0.5;
    camera.lookAt(0, 0, -10); // Regarder vers le centre de la scène

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Animation des téléphones
      phones.forEach((phone, index) => {
        // Rotation plus fluide
        phone.mesh.rotation.x += phone.rotationSpeed.x;
        phone.mesh.rotation.y += phone.rotationSpeed.y;
        phone.mesh.rotation.z += phone.rotationSpeed.z;

        // Flottement plus naturel avec combinaison de sinus et cosinus
        phone.mesh.position.y +=
          Math.sin(elapsedTime * phone.floatSpeed + phone.floatOffset) * 0.008;
        phone.mesh.position.x +=
          Math.cos(elapsedTime * phone.floatSpeed * 0.7 + phone.floatOffset) *
          0.004;

        // Mise en évidence des téléphones du type actif avec effet plus prononcé
        if (phone.messageType === activeMessageType) {
          // Faire briller les téléphones du type actif
          const screenMesh = phone.mesh.children[2] as THREE.Mesh;
          const material = screenMesh.material as THREE.MeshPhongMaterial;

          // Pulsation de luminosité plus intense
          const brightness = 1.5 + Math.sin(elapsedTime * 3 + index) * 0.3;

          // Animation de l'émissivité pour un effet de pulsation
          material.emissiveIntensity =
            0.2 + Math.sin(elapsedTime * 2 + index) * 0.15;

          material.color.setRGB(
            (0x67 / 255) * brightness,
            (0xb1 / 255) * brightness,
            (0x42 / 255) * brightness
          );

          // Rapprocher légèrement ces téléphones de la caméra avec effet plus fluide
          phone.mesh.position.z += Math.sin(elapsedTime * 0.8) * 0.015;
        }
      });

      // Animation des particules avec rotation plus fluide
      particleGroups.forEach((particles, i) => {
        particles.rotation.y += 0.0004 * (i + 1);
        particles.rotation.x += 0.0003 * (i + 1);

        // Pulsation de taille
        const sizePulse = 0.8 + Math.sin(elapsedTime * 0.5) * 0.2;
        (particles.material as THREE.PointsMaterial).size =
          (0.06 + i * 0.02) * sizePulse;
      });

      // Animation des traînées
      const positions = trails.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.1; // Vitesse de déplacement des traînées

        // Si une traînée sort de la vue, la réinitialiser
        if (positions[i + 2] > 10) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 5 + Math.random() * 10;

          positions[i] = Math.cos(angle) * radius;
          positions[i + 1] = Math.sin(angle) * radius;
          positions[i + 2] = -30;
        }
      }
      trails.geometry.attributes.position.needsUpdate = true;

      // Animation de la traînée pour suivre l'effet de mouvement
      trails.rotation.y += 0.001;

      // Animation de la caméra plus douce et réactive à la souris
      camera.position.x = 0.5 + mousePosition.x * 2;
      camera.position.y = 1 + mousePosition.y * 1;
      camera.lookAt(mousePosition.x * 5, mousePosition.y * 3, -15);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Dispose resources
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [activeMessageType]);

  // Changement automatique de type de message mis en avant
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageType((prev) => {
        const messageTypes: MessageType[] = [
          "sms",
          "rcs",
          "campaign",
          "transactional",
          "reminder",
        ];
        const currentIndex = messageTypes.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messageTypes.length;
        return messageTypes[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Variants d'animation améliorés pour des transitions plus fluides
  const titleVariants = {
    hidden: { opacity: 0, y: -40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, delay: 0.3, ease: "easeOut" },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const phoneVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 50, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateY: 0,
      transition: {
        duration: 1.2,
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const messageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9, filter: "blur(8px)" },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9,
      filter: "blur(8px)",
      transition: {
        duration: 0.5,
      },
    },
  };

  // Memoize features array to prevent unnecessary re-renders
  const features = React.useMemo<FeatureProps[]>(
    () => [
      {
        icon: <MessageSquare className="h-6 w-6" />,
        title: "SMS PRO",
        description:
          "Messages texte simples et efficaces avec un taux de lecture de 98%.",
        color: "bg-[#67B142]/10 text-[#67B142]",
        iconBg: "bg-[#67B142]/10",
        type: "sms",
        bgColor: "from-[#67B142] to-[#34A853]",
      },
      {
        icon: <Globe className="h-6 w-6" />,
        title: "RCS Enrichi",
        description:
          "Messages enrichis avec images, carousels et boutons interactifs.",
        color: "bg-blue-500/10 text-blue-500",
        iconBg: "bg-blue-500/10",
        type: "rcs",
        bgColor: "from-blue-500 to-blue-700",
      },
      {
        icon: <Users className="h-6 w-6" />,
        title: "Campagnes",
        description:
          "Diffusez vos promotions à grande échelle avec des modèles personnalisés.",
        color: "bg-purple-500/10 text-purple-500",
        iconBg: "bg-purple-500/10",
        type: "campaign",
        bgColor: "from-purple-500 to-indigo-600",
      },
      {
        icon: <CheckCircle2 className="h-6 w-6" />,
        title: "Transactionnels",
        description:
          "Confirmations, avis de livraison et autres messages automatisés.",
        color: "bg-amber-500/10 text-amber-500",
        iconBg: "bg-amber-500/10",
        type: "transactional",
        bgColor: "from-amber-500 to-orange-600",
      },
      {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Rappels",
        description:
          "Rappels de rendez-vous et échéances pour diminuer les absences.",
        color: "bg-red-500/10 text-red-500",
        iconBg: "bg-red-500/10",
        type: "reminder",
        bgColor: "from-red-500 to-rose-600",
      },
    ],
    []
  );

  // Memoize active messages to prevent unnecessary re-renders
  const messagesByType: Record<MessageType, Message[]> = {
    sms: [
      {
        id: 1,
        text: "Bonjour! Découvrez notre nouvelle collection printanière 🌸",
        sent: true,
        type: "sms",
        time: "10:30",
      },
      {
        id: 2,
        text: "Comment puis-je en savoir plus?",
        sent: false,
        type: "sms",
        time: "10:31",
      },
      {
        id: 3,
        text: "Visitez notre site web ou répondez CATALOGUE pour recevoir notre catalogue digital",
        sent: true,
        type: "sms",
        time: "10:32",
      },
      { id: 4, text: "CATALOGUE", sent: false, type: "sms", time: "10:33" },
    ],
    rcs: [
      {
        id: 1,
        text: "Découvrez nos nouveaux forfaits été",
        sent: true,
        type: "rcs",
        time: "14:25",
        attachment: {
          type: "carousel",
          content: "Carousel d'offres",
        },
      },
      {
        id: 2,
        text: "Ces offres sont valables jusqu'à quand?",
        sent: false,
        type: "rcs",
        time: "14:26",
      },
      {
        id: 3,
        text: "Jusqu'au 30 juin! Cliquez ci-dessous pour réserver",
        sent: true,
        type: "rcs",
        time: "14:27",
        attachment: {
          type: "button",
          content: "RÉSERVER MAINTENANT",
        },
      },
    ],
    campaign: [
      {
        id: 1,
        text: "-30% SUR TOUT LE SITE | Code: SMS30",
        sent: true,
        type: "campaign",
        time: "09:15",
      },
      {
        id: 2,
        text: "Offre spéciale: Livraison gratuite pour toute commande > 50€ aujourd'hui seulement!",
        sent: true,
        type: "campaign",
        time: "12:30",
      },
      {
        id: 3,
        text: "Dernières heures pour profiter de notre vente flash! Fin à minuit.",
        sent: true,
        type: "campaign",
        time: "18:45",
      },
    ],
    transactional: [
      {
        id: 1,
        text: "Votre commande #45678 a été confirmée. Livraison prévue mercredi 12/07.",
        sent: true,
        type: "transactional",
        time: "16:05",
      },
      {
        id: 2,
        text: "Votre paiement de 127,50€ a été traité avec succès. Merci de votre achat!",
        sent: true,
        type: "transactional",
        time: "16:06",
      },
      {
        id: 3,
        text: "Votre colis est en cours de livraison. Suivez-le en direct: [lien]",
        sent: true,
        type: "transactional",
        time: "08:30",
      },
    ],
    reminder: [
      {
        id: 1,
        text: "Rappel: Votre rendez-vous chez Dr. Martin est prévu demain à 14h30",
        sent: true,
        type: "reminder",
        time: "15:00",
      },
      {
        id: 2,
        text: "Je confirme ma présence",
        sent: false,
        type: "reminder",
        time: "15:25",
      },
      {
        id: 3,
        text: "Merci! Votre rendez-vous est confirmé. À demain.",
        sent: true,
        type: "reminder",
        time: "15:26",
      },
    ],
  };

  // Memoize active messages to prevent unnecessary re-renders
  const activeMessages = React.useMemo(
    () => messagesByType[activeMessageType],
    [activeMessageType]
  );
  const activeFeaturesInfo = React.useMemo(
    () => features.find((f) => f.type === activeMessageType) || features[0],
    [features, activeMessageType]
  );

  // Memoize message type change handler
  const handleMessageTypeChange = React.useCallback((type: MessageType) => {
    setActiveMessageType(type);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen py-20 md:px-12 px-6 overflow-hidden perspective-1000"
      style={{ perspective: 1000 }}
    >
      {/* Canvas Three.js pour les animations 3D */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10 opacity-90"
      />

      {/* Particules et lumières ambiantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderedParticles}
      </div>

      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF]/90 via-[#F3F9F0]/80 to-[#FFFFFF]/90 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte principal */}
          <div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#67B142] to-[#3c3d3c]"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={titleVariants}
            >
              {tScope("title") || "Donnez de la puissance à vos messages"}
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-8"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={subtitleVariants}
            >
              {tScope("subtitle") ||
                "Connectez-vous directement avec vos clients grâce à notre plateforme SMS intelligente, simple et performante."}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={buttonContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div variants={buttonVariants}>
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r text-base from-[#67B142] to-[#34A853] rounded-[15px] hover:from-[#67B142]/90 hover:to-[#34A853]/90 shadow-md hover:shadow-lg transition-all"
                  asChild
                >
                  <Link href="/signup">
                    {tScope("cta") || "Démarrer gratuitement"}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 rounded-[15px] border-[#67B142]/30 hover:border-[#67B142]/50 hover:bg-[#67B142]/5"
                >
                  <Link href="/solutions">
                    {tScope("secondaryCta") || "Voir les tarifs"}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Type de message mis en avant */}
            <div className="mt-12">
              <AnimatePresence mode="wait">
                <Card3D
                  key={activeMessageType}
                  isActive={true}
                  depth={15}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={messageVariants}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "p-6 rounded-xl shadow-lg border border-muted relative overflow-hidden",
                      activeFeaturesInfo.color.split(" ")[0]
                    )}
                  >
                    {/* Fond dynamique */}
                    <motion.div
                      className={cn(
                        "absolute inset-0 -z-10 opacity-10 bg-gradient-to-r",
                        activeFeaturesInfo.bgColor
                      )}
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />

                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={cn(
                          "p-3 rounded-full",
                          activeFeaturesInfo.iconBg
                        )}
                      >
                        {activeFeaturesInfo.icon}

                        {/* Effet de particule autour de l'icône */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0, 0.4, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {activeFeaturesInfo.title}
                      </h3>

                      {/* Badge nouveau */}
                      {activeMessageType === "rcs" && (
                        <span className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center">
                          <Sparkle className="h-3 w-3 mr-1" />
                          NOUVEAU
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {activeFeaturesInfo.description}
                    </p>

                    {/* Statistiques ou badges en bas de la carte */}
                    <div className="mt-4 pt-3 border-t border-muted/30 flex flex-wrap gap-2">
                      {activeMessageType === "sms" && (
                        <>
                          <span className="text-xs bg-[#67B142]/10 text-[#67B142] py-1 px-2 rounded-full">
                            98% taux de lecture
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
                            160 caractères
                          </span>
                        </>
                      )}
                      {activeMessageType === "rcs" && (
                        <>
                          <span className="text-xs bg-blue-500/10 text-blue-500 py-1 px-2 rounded-full">
                            Multimédia
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
                            Interactif
                          </span>
                        </>
                      )}
                      {activeMessageType === "campaign" && (
                        <>
                          <span className="text-xs bg-purple-500/10 text-purple-500 py-1 px-2 rounded-full">
                            Segmentation
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
                            Automatisé
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                </Card3D>
              </AnimatePresence>
            </div>

            {/* Types de messages (boutons) */}
            <motion.div
              className="mt-6 flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.8, duration: 0.5 },
              }}
            >
              {features.map((feature) => (
                <Card3D
                  key={feature.type}
                  isActive={activeMessageType === feature.type}
                  depth={10}
                  className="overflow-hidden"
                >
                  <Button
                    variant={
                      activeMessageType === feature.type ? "default" : "outline"
                    }
                    size="sm"
                    className={cn(
                      activeMessageType === feature.type
                        ? "bg-gradient-to-r " +
                            feature.bgColor +
                            " text-white hover:opacity-90"
                        : "border border-[#67B142]/30 hover:bg-[#67B142]/10",
                      "gap-2 rounded-xl shadow-sm"
                    )}
                    onClick={() => handleMessageTypeChange(feature.type)}
                  >
                    {feature.icon}
                    {feature.title}

                    {/* Effet de pulsation sur bouton actif */}
                    {activeMessageType === feature.type && (
                      <motion.span
                        className="absolute inset-0 rounded-xl bg-white"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 0.3, 0],
                          scale: [0.8, 1.1, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                    )}
                  </Button>
                </Card3D>
              ))}
            </motion.div>
          </div>

          {/* Illustration téléphone + messages */}
          <motion.div
            className="relative perspective-1000"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={phoneVariants}
            style={{ perspective: 1000 }}
          >
            {/* Effet 3D */}
            <motion.div
              className="relative mx-auto w-fit"
              style={{ transformStyle: "preserve-3d" }}
              animate={{
                rotateY: [0, 5, 0, -5, 0],
                rotateX: [0, -3, 0, 3, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Téléphone principal */}
              <div className="relative mx-auto w-72 h-[580px] bg-zinc-900 rounded-[40px] shadow-2xl overflow-hidden border-[12px] border-zinc-800">
                {/* Écran du téléphone */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-3xl overflow-hidden">
                  {/* Barre d'état */}
                  <div className="h-6 w-full bg-black/30 flex items-center justify-between px-4">
                    <div className="text-white text-xs">20:30</div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                    </div>
                  </div>

                  {/* Application de messagerie */}
                  <div className="p-4 h-full flex flex-col">
                    {/* En-tête personnalisé selon le type */}
                    <div
                      className={cn(
                        "text-white font-medium py-2 px-4 rounded-full mb-4 flex items-center justify-center gap-2 shadow-md",
                        activeMessageType === "sms"
                          ? "bg-[#67B142]"
                          : activeMessageType === "rcs"
                          ? "bg-blue-500"
                          : activeMessageType === "campaign"
                          ? "bg-purple-500"
                          : activeMessageType === "transactional"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      )}
                    >
                      {activeFeaturesInfo.icon}
                      <span>{activeFeaturesInfo.title}</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-end space-y-4 overflow-hidden">
                      <AnimatePresence>
                        {activeMessages.map((msg, i) => (
                          <motion.div
                            key={`${activeMessageType}-${msg.id}`}
                            initial={{
                              opacity: 0,
                              x: msg.sent ? 50 : -50,
                              y: 20,
                            }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                              delay: i * 0.15,
                            }}
                            className="flex flex-col"
                          >
                            <motion.div
                              className={cn(
                                "p-3 rounded-2xl max-w-[85%] shadow-md",
                                msg.sent
                                  ? cn(
                                      "ml-auto rounded-br-none",
                                      activeMessageType === "sms"
                                        ? "bg-[#67B142] text-white"
                                        : activeMessageType === "rcs"
                                        ? "bg-blue-500 text-white"
                                        : activeMessageType === "campaign"
                                        ? "bg-purple-500 text-white"
                                        : activeMessageType === "transactional"
                                        ? "bg-amber-500 text-white"
                                        : "bg-red-500 text-white"
                                    )
                                  : "bg-white/10 text-white mr-auto rounded-bl-none"
                              )}
                              whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.2 },
                              }}
                            >
                              <p className="text-sm">{msg.text}</p>

                              {/* Éléments RCS enrichis avec animations */}
                              {msg.type === "rcs" && msg.attachment && (
                                <motion.div
                                  className="mt-2"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{
                                    opacity: 1,
                                    height: "auto",
                                    transition: { delay: 0.3 },
                                  }}
                                >
                                  {msg.attachment.type === "button" && (
                                    <motion.div
                                      className="bg-white/20 text-white text-xs py-1 px-3 rounded-md mt-1 font-medium text-center"
                                      whileHover={{
                                        backgroundColor:
                                          "rgba(255,255,255,0.3)",
                                        scale: 1.05,
                                        transition: { duration: 0.2 },
                                      }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {msg.attachment.content}
                                    </motion.div>
                                  )}

                                  {msg.attachment.type === "carousel" && (
                                    <div className="flex gap-1 mt-1 overflow-x-auto pb-1">
                                      {[1, 2, 3].map((n) => (
                                        <motion.div
                                          key={n}
                                          className="bg-white/10 rounded min-w-[60px] h-[40px] flex-shrink-0 flex items-center justify-center"
                                          whileHover={{
                                            backgroundColor:
                                              "rgba(255,255,255,0.2)",
                                            scale: 1.05,
                                            transition: { duration: 0.2 },
                                          }}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                              delay: 0.3 + n * 0.1,
                                            },
                                          }}
                                        >
                                          <span className="text-[10px]">
                                            Offre {n}
                                          </span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  )}

                                  {msg.attachment.type === "image" && (
                                    <motion.div
                                      className="bg-white/10 h-[60px] rounded-md mt-1 flex items-center justify-center"
                                      whileHover={{ scale: 1.03 }}
                                    >
                                      <span className="text-[10px]">Image</span>
                                    </motion.div>
                                  )}
                                </motion.div>
                              )}
                            </motion.div>

                            <div
                              className={cn(
                                "text-[10px] opacity-70 mt-1",
                                msg.sent ? "ml-auto" : "mr-auto"
                              )}
                            >
                              {msg.time}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Barre de saisie */}
                    <div className="mt-4 mb-4 bg-zinc-800 rounded-full p-3 flex items-center">
                      <div className="bg-zinc-700 h-5 w-full rounded-full"></div>
                      <motion.div
                        className={cn(
                          "h-8 w-8 rounded-full ml-2 flex items-center justify-center text-white",
                          activeMessageType === "sms"
                            ? "bg-[#67B142]"
                            : activeMessageType === "rcs"
                            ? "bg-blue-500"
                            : activeMessageType === "campaign"
                            ? "bg-purple-500"
                            : activeMessageType === "transactional"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Send className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Notch du téléphone */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-black rounded-b-2xl"></div>
              </div>

              {/* Éléments 3D flottants autour du téléphone */}
              <motion.div
                className="absolute -right-10 top-1/4 w-20 h-20 bg-white/10 rounded-xl backdrop-blur-md border border-white/30 flex items-center justify-center"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(40px) rotateY(-15deg)",
                }}
                animate={{
                  y: [0, -10, 0],
                  rotateY: [-15, -10, -15],
                  z: [40, 60, 40],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    activeMessageType === "sms"
                      ? "bg-[#67B142]"
                      : activeMessageType === "rcs"
                      ? "bg-blue-500"
                      : activeMessageType === "campaign"
                      ? "bg-purple-500"
                      : activeMessageType === "transactional"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  )}
                >
                  {activeFeaturesInfo.icon}
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-8 top-2/3 w-24 h-16 bg-white/10 rounded-xl backdrop-blur-md border border-white/30 p-3"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(30px) rotateY(10deg)",
                }}
                animate={{
                  y: [0, 15, 0],
                  rotateY: [10, 15, 10],
                  z: [30, 50, 30],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="text-xs text-white font-medium">
                  <div className="flex items-center gap-1 mb-1">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        activeMessageType === "sms"
                          ? "bg-[#67B142]"
                          : activeMessageType === "rcs"
                          ? "bg-blue-500"
                          : activeMessageType === "campaign"
                          ? "bg-purple-500"
                          : activeMessageType === "transactional"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      )}
                    ></div>
                    <span>Envoi</span>
                  </div>
                  <div className="text-white/70 text-[10px]">Taux: 98%</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Effet "pulse" autour du téléphone */}
            <motion.div
              className="absolute -inset-4 rounded-[60px] bg-gradient-to-r from-[#67B142]/20 to-[#4285F4]/20 -z-10 blur-md"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Indicateurs d'envoi */}
            <motion.div
              className="absolute -right-6 top-1/3 h-20 w-20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-[#67B142]/20 rounded-full"></div>
              <div className="absolute inset-[15%] bg-[#67B142]/30 rounded-full"></div>
              <div className="absolute inset-[30%] bg-[#67B142]/40 rounded-full"></div>
              <div className="absolute inset-[45%] bg-[#67B142]/50 rounded-full"></div>
            </motion.div>

            {/* Messages volants avec effet 3D amélioré */}
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-white/20 text-xs font-medium text-white"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${i * 20}%`,
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: -50,
                  y: 50,
                  z: -50,
                  rotateY: -15,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1, 1, 0.9],
                  x: [-50, 0, 50, 100],
                  y: [50, 0, -50, -100],
                  z: [-50, 0, 50, 100],
                  rotateY: [-15, 0, 15, 30],
                }}
                transition={{
                  duration: 6,
                  delay: i * 2,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      i % 2 === 0 ? "bg-[#67B142]" : "bg-blue-400"
                    )}
                  ></div>
                  <span>{i % 2 === 0 ? "Message envoyé" : "Livré"}</span>
                </div>
              </motion.div>
            ))}

            {/* Statistiques flottantes avec effet 3D */}
            <motion.div
              className="absolute right-0 bottom-20 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 shadow-xl p-3 text-xs text-white font-medium"
              style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              initial={{ opacity: 0, x: 100, rotateY: 30 }}
              animate={{
                opacity: 1,
                x: 0,
                rotateY: [30, 25, 30],
                y: [0, 5, 0],
                transition: {
                  duration: 0.7,
                  delay: 1.5,
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotateY: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Taux de lecture: 98%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Taux de conversion: 25%</span>
              </div>
            </motion.div>

            {/* Éléments décoratifs en arrière-plan 3D */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              {/* Cercles abstraits */}
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-[#67B142]/20"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateX: [0, 25, 0],
                  rotateY: [0, 15, 0],
                  z: [0, 20, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute bottom-20 -left-10 w-32 h-32 rounded-full border border-blue-400/20"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateX: [0, -15, 0],
                  rotateY: [0, -25, 0],
                  z: [0, 30, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />

              {/* Éléments géométriques */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-[#67B142]/20 rounded-lg"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateX: [0, 40, 0],
                  rotateY: [0, 40, 0],
                  rotateZ: [0, 20, 0],
                  z: [0, 50, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
