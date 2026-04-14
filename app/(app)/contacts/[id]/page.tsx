"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import InteractionItem from "@/components/InteractionItem";

export default function ContactProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { contacts, interactions, quickNotes, deleteContact, deleteInteraction, deleteQuickNote } = useAppContext();
  const router = useRouter();

  const contact = contacts.find((c) => c.id === id);
  const contactInteractions = interactions
    .filter((i) => i.contactId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!contact) {
    return (
      <div className="text-center mt-20">
        <p className="text-slate-400 mb-4">Contact not found.</p>
        <Link href="/contacts" className="text-sm text-indigo-600 hover:underline">
          Back to contacts
        </Link>
      </div>
    );
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function handleDeleteContact() {
    if (confirm(`Delete ${contact!.name} and all their interactions?`)) {
      deleteContact(id);
      router.push("/contacts");
    }
  }

  return (
    <div>
      <Link
        href="/contacts"
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6 inline-block"
      >
        &larr; Back to contacts
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {contact.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {contact.role}
              {contact.company ? ` at ${contact.company}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteContact}
              className="border border-red-200 text-red-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
            <Link
              href={`/contacts/${contact.id}/edit`}
              className="border border-gray-200 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <Link
              href={`/log?contact=${contact.id}`}
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Log Interaction
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-slate-400 mb-1">Email</p>
            <p className="text-sm text-slate-900">
              {contact.email ?? "\u2014"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">LinkedIn</p>
            <p className="text-sm text-slate-900">
              {contact.linkedin ?? "\u2014"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Added</p>
            <p className="text-sm text-slate-900">
              {formatDate(contact.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {contact.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Quick notes assigned to this contact */}
      {quickNotes.filter((n) => n.contactId === id).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Notes
          </h3>
          <div className="flex flex-col gap-2">
            {quickNotes
              .filter((n) => n.contactId === id)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((note) => (
                <div key={note.id} className="flex items-start justify-between gap-3 bg-amber-50 rounded-lg px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{note.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(note.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => deleteQuickNote(note.id)}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-0.5"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Interaction timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Interactions
          </h3>
          <span className="text-sm text-slate-400">
            {contactInteractions.length} total
          </span>
        </div>

        {contactInteractions.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">
            No interactions logged yet.
          </p>
        ) : (
          <div>
            {contactInteractions.map((i) => (
              <InteractionItem key={i.id} interaction={i} onDelete={deleteInteraction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
