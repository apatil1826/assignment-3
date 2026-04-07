"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function QuickNotes() {
  const { contacts, quickNotes, addQuickNote, assignQuickNote, deleteQuickNote } =
    useAppContext();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addQuickNote(text.trim());
    setText("");
  }

  const unassigned = quickNotes.filter((n) => !n.contactId);
  const assigned = quickNotes.filter((n) => n.contactId);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center z-50"
        title="Quick Notes"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unassigned.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unassigned.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col max-h-[70vh]">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-slate-900">Quick Notes</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Jot it down, assign to a contact later
            </p>
          </div>

          {/* Add note */}
          <form onSubmit={handleAdd} className="p-3 border-b border-gray-100 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Quick note..."
              className="flex-1 text-sm bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add
            </button>
          </form>

          {/* Notes list */}
          <div className="overflow-y-auto flex-1 p-3">
            {quickNotes.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No notes yet</p>
            )}

            {unassigned.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-500 mb-2">Pending</p>
                {unassigned.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    contacts={contacts}
                    onAssign={assignQuickNote}
                    onDelete={deleteQuickNote}
                  />
                ))}
              </div>
            )}

            {assigned.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Assigned</p>
                {assigned.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    contacts={contacts}
                    onAssign={assignQuickNote}
                    onDelete={deleteQuickNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NoteItem({
  note,
  contacts,
  onAssign,
  onDelete,
}: {
  note: { id: string; text: string; contactId?: string; createdAt: string };
  contacts: { id: string; name: string }[];
  onAssign: (noteId: string, contactId: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showAssign, setShowAssign] = useState(false);
  const assignedContact = note.contactId
    ? contacts.find((c) => c.id === note.contactId)
    : null;

  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-2 text-sm">
      <p className="text-slate-700 leading-relaxed">{note.text}</p>
      <div className="flex items-center justify-between mt-2">
        {assignedContact ? (
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {assignedContact.name}
          </span>
        ) : showAssign ? (
          <select
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            defaultValue=""
            onChange={(e) => {
              onAssign(note.id, e.target.value);
              setShowAssign(false);
            }}
          >
            <option value="" disabled>
              Pick contact...
            </option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <button
            onClick={() => setShowAssign(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700"
          >
            Assign
          </button>
        )}
        <button
          onClick={() => onDelete(note.id)}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
