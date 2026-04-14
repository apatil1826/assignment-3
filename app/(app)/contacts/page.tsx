"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import ContactCard from "@/components/ContactCard";

export default function ContactsPage() {
  const { contacts, interactions, loading } = useAppContext();
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.company?.toLowerCase().includes(q) ?? false) ||
      (c.role?.toLowerCase().includes(q) ?? false) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  function getLastInteraction(contactId: string) {
    const contactInteractions = interactions
      .filter((i) => i.contactId === contactId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return contactInteractions[0];
  }

  function getInteractionCount(contactId: string) {
    return interactions.filter((i) => i.contactId === contactId).length;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
          </span>
          <Link
            href="/contacts/new"
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Contact
          </Link>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, company, role, or tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white rounded-xl shadow-sm px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-6"
      />

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            lastInteraction={getLastInteraction(contact.id)}
            interactionCount={getInteractionCount(contact.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-400 text-center mt-12">
          No contacts match your search.
        </p>
      )}
    </div>
  );
}
