"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useScopedI18n } from "@/locales/client";

const technologies = [
  { name: "ASP.NET", logo: "/images/tech/aspnet.png", w: 70, h: 70 },
  { name: "C#", logo: "/images/tech/csharp.svg", w: 45, h: 45 },
  { name: "Java", logo: "/images/tech/java.svg", w: 100, h: 100 },
  { name: "Node.js", logo: "/images/tech/nodejs.svg", w: 90, h: 90 },
  { name: "Python", logo: "/images/tech/python.svg", w: 140, h: 140 },
  { name: "Ruby on Rails", logo: "/images/tech/rails.svg", w: 90, h: 90 },
  { name: "Visual Basic", logo: "/images/tech/vb.svg", w: 130, h: 130 },
  { name: "PHP", logo: "/images/tech/php.svg", w: 85, h: 85 },
];

export default function IntegrationSection() {
  const tScope = useScopedI18n("integration");
  return (
    <section className="py-16 md:px-12 px-6" id="api">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left side - API Preview */}
          <div className="flex-1 relative h-[500px] w-full">
            <Image
              src="/images/features/integration-api.webp"
              alt="API Integration"
              fill
              className="object-contain"
            />
          </div>

          {/* Right side - Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold">{tScope("title1")}</h2>
            <p className="text-gray-600">{tScope("title2")}</p>
            <p className="text-gray-600">{tScope("title3")}</p>
            <p className="text-gray-600">{tScope("title4")}</p>

            <div className="flex gap-4">
              <Button
                variant="default"
                className="bg-[#67B142] rounded-[10px] text-sm text-white p-6 hover:bg-[#67B142]/90"
                asChild
              >
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://api.axiomtext.com"
                >
                  {tScope("title5")}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-[10px] text-sm text-white p-6 bg-black/90 hover:bg-black/80 hover:text-white"
                asChild
              >
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://api.axiomtext.com"
                >
                  {tScope("title6")}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="mt-16">
          <div className="flex flex-wrap justify-center items-center gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="relative transition-all">
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  width={tech.w}
                  height={tech.h}
                  className="object-contain"
                  style={{
                    marginTop:
                      index === 0 || index === 1 || index === 3 || index === 4
                        ? "12px"
                        : "0px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
