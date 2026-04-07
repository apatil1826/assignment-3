"use client";

import { useState } from "react";
import { useAppContext, InteractionType } from "@/context/AppContext";
import StatCard from "@/components/StatCard";
import Link from "next/link";

const allTypes: { value: InteractionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "coffee", label: "Coffee" },
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "event", label: "Event" },
  { value: "call", label: "Call" },
  { value: "other", label: "Other" },
];

export default function Dashboard() {
  const { contacts, interactions, exportData, importData } = useAppContext();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<InteractionType | "all">("all");
  const [showImport, setShowImport] = useState(false);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter interactions
  const filteredInteractions = interactions.filter((i) => {
    if (typeFilter !== "all" && i.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const contactName = contacts.find((c) => c.id === i.contactId)?.name ?? "";
      return (
        contactName.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q) ||
        (i.nextSteps?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const recentInteractions = [...filteredInteractions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const interactionsThisMonth = interactions.filter(
    (i) => new Date(i.date) >= thirtyDaysAgo
  );

  // Contacts last interaction map
  const contactsLastInteraction = new Map<string, Date>();
  for (const i of interactions) {
    const d = new Date(i.date);
    const prev = contactsLastInteraction.get(i.contactId);
    if (!prev || d > prev) {
      contactsLastInteraction.set(i.contactId, d);
    }
  }

  const dueForFollowUp = contacts.filter((c) => {
    const last = contactsLastInteraction.get(c.id);
    return !last || last < thirtyDaysAgo;
  });

  // Upcoming follow-ups: interactions with nextSteps
  const upcomingFollowUps = interactions
    .filter((i) => i.nextSteps)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const uniqueTags = new Set(contacts.flatMap((c) => c.tags));

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getContactName(contactId: string) {
    return contacts.find((c) => c.id === contactId)?.name ?? "Unknown";
  }

  const typeLabels: Record<string, string> = {
    coffee: "Coffee",
    email: "Email",
    linkedin: "LinkedIn",
    event: "Event",
    call: "Call",
    other: "Other",
  };

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexmap-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importData(event.target?.result as string);
        setShowImport(false);
      } catch {
        alert("Invalid file format. Please upload a valid NexMap JSON export.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="border border-gray-200 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Export
          </button>
          <div className="relative">
            <button
              onClick={() => setShowImport(!showImport)}
              className="border border-gray-200 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Import
            </button>
            {showImport && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10 w-64">
                <p className="text-xs text-slate-500 mb-2">
                  Upload a NexMap JSON export file
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="text-xs text-slate-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Contacts" value={contacts.length} />
        <StatCard label="Total Interactions" value={interactions.length} />
        <StatCard
          label="This Month"
          value={interactionsThisMonth.length}
          sub="interactions in last 30 days"
        />
        <StatCard
          label="Tags"
          value={uniqueTags.size}
          sub="unique categories"
        />
      </div>

      {/* Search and filter bar */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search interactions by contact, notes, or next steps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white rounded-xl shadow-sm px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="flex gap-1.5">
          {allTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Recent interactions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Interactions
            {(search || typeFilter !== "all") && (
              <span className="text-sm font-normal text-slate-400 ml-2">
                ({filteredInteractions.length} results)
              </span>
            )}
          </h3>
          {recentInteractions.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">No matching interactions.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentInteractions.map((i) => (
                <Link
                  key={i.id}
                  href={`/contacts/${i.contactId}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {getContactName(i.contactId)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {typeLabels[i.type]} &middot; {formatDate(i.date)}
                    </p>
                  </div>
                  {i.nextSteps && (
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                      Has next steps
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Due for follow-up */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Due for Follow-up
          </h3>
          {dueForFollowUp.length === 0 ? (
            <p className="text-sm text-slate-400">
              You&apos;re all caught up!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {dueForFollowUp.map((c) => {
                const last = contactsLastInteraction.get(c.id);
                return (
                  <Link
                    key={c.id}
                    href={`/contacts/${c.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {c.company}
                        {c.role ? ` \u00B7 ${c.role}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {last ? `Last: ${formatDate(last.toISOString())}` : "Never contacted"}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming follow-ups */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Upcoming Follow-ups
        </h3>
        {upcomingFollowUps.length === 0 ? (
          <p className="text-sm text-slate-400">No pending follow-ups.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {upcomingFollowUps.map((i) => (
              <Link
                key={i.id}
                href={`/contacts/${i.contactId}`}
                className="flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">
                    {getContactName(i.contactId)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {typeLabels[i.type]} &middot; {formatDate(i.date)}
                  </p>
                </div>
                <p className="text-xs text-indigo-600 bg-indigo-50 rounded-lg px-2.5 py-1.5">
                  {i.nextSteps}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
