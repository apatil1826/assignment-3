"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export default function EditContactPage() {
  const { id } = useParams<{ id: string }>();
  const { contacts, editContact } = useAppContext();
  const router = useRouter();

  const contact = contacts.find((c) => c.id === id);

  const [name, setName] = useState(contact?.name ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [linkedin, setLinkedin] = useState(contact?.linkedin ?? "");
  const [company, setCompany] = useState(contact?.company ?? "");
  const [role, setRole] = useState(contact?.role ?? "");
  const [tagsInput, setTagsInput] = useState(contact?.tags.join(", ") ?? "");

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    editContact(id, {
      name: name.trim(),
      email: email.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      company: company.trim() || undefined,
      role: role.trim() || undefined,
      tags,
    });

    router.push(`/contacts/${id}`);
  }

  const inputClass =
    "w-full bg-white rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="max-w-xl">
      <Link
        href={`/contacts/${id}`}
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6 inline-block"
      >
        &larr; Back to profile
      </Link>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Contact</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company
              <span className="text-slate-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Role
              <span className="text-slate-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email
            <span className="text-slate-400 font-normal ml-1">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            LinkedIn
            <span className="text-slate-400 font-normal ml-1">(optional)</span>
          </label>
          <input
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tags
            <span className="text-slate-400 font-normal ml-1">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
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
