"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext, InteractionType } from "@/context/AppContext";

const interactionTypes: { value: InteractionType; label: string }[] = [
  { value: "coffee", label: "Coffee Chat" },
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "event", label: "Event" },
  { value: "call", label: "Phone Call" },
  { value: "other", label: "Other" },
];

export default function EditInteractionPage() {
  const { id } = useParams<{ id: string }>();
  const { interactions, contacts, editInteraction } = useAppContext();
  const router = useRouter();

  const interaction = interactions.find((i) => i.id === id);

  const [contactId, setContactId] = useState(interaction?.contactId ?? "");
  const [date, setDate] = useState(
    interaction ? new Date(interaction.date).toISOString().split("T")[0] : ""
  );
  const [type, setType] = useState<InteractionType>(interaction?.type ?? "coffee");
  const [notes, setNotes] = useState(interaction?.notes ?? "");
  const [nextSteps, setNextSteps] = useState(interaction?.nextSteps ?? "");

  if (!interaction) {
    return (
      <div className="text-center mt-20">
        <p className="text-slate-400 mb-4">Interaction not found.</p>
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactId || !notes.trim()) return;

    await editInteraction(id, {
      contactId,
      date: new Date(date).toISOString(),
      type,
      notes: notes.trim(),
      nextSteps: nextSteps.trim() || undefined,
    });

    router.push(`/contacts/${contactId}`);
  }

  const sortedContacts = [...contacts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const inputClass =
    "w-full bg-white rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="max-w-xl">
      <Link
        href={`/contacts/${interaction.contactId}`}
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6 inline-block"
      >
        &larr; Back to profile
      </Link>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Edit Interaction
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Contact
          </label>
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className={inputClass}
            required
          >
            <option value="" disabled>
              Select a contact...
            </option>
            {sortedContacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` — ${c.company}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Type
          </label>
          <div className="flex flex-wrap gap-2">
            {interactionTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  type === t.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className={inputClass + " resize-none"}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Next Steps
            <span className="text-slate-400 font-normal ml-1">(optional)</span>
          </label>
          <input
            type="text"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors mt-1"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
