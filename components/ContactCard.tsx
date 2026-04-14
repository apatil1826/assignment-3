"use client";

import Link from "next/link";
import { Contact, Interaction } from "@/context/AppContext";

type ContactCardProps = {
  contact: Contact;
  lastInteraction?: Interaction;
  interactionCount: number;
};

export default function ContactCard({
  contact,
  lastInteraction,
  interactionCount,
}: ContactCardProps) {
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const strengthColors: Record<string, string> = {
    strong: "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    weak: "bg-red-100 text-red-700",
  };

  const strength =
    interactionCount >= 3 ? "strong" : interactionCount >= 1 ? "moderate" : "weak";

  return (
    <Link href={`/contacts/${contact.id}`}>
      <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {contact.companyLogoUrl ? (
              <img
                src={contact.companyLogoUrl}
                alt=""
                className="w-8 h-8 rounded object-contain bg-gray-50 border border-gray-100 p-0.5 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-sm flex-shrink-0">
                {contact.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {contact.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {contact.role}
                {contact.company ? ` at ${contact.company}` : ""}
              </p>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${strengthColors[strength]}`}
          >
            {strength}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {contact.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-gray-100">
          <span>
            {lastInteraction
              ? `Last: ${formatDate(lastInteraction.date)}`
              : "No interactions yet"}
          </span>
          <span>{interactionCount} interaction{interactionCount !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </Link>
  );
}
