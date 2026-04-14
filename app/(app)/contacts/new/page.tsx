"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function NewContactPage() {
  const { addContact } = useAppContext();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [company, setCompany] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [role, setRole] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const contact = await addContact({
      name: name.trim(),
      email: email.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      company: company.trim() || undefined,
      companyDomain: companyDomain.trim() || undefined,
      role: role.trim() || undefined,
      tags,
    });

    router.push(`/contacts/${contact.id}`);
  }

  const inputClass =
    "w-full bg-white rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Add Contact
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
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
              placeholder="e.g. Google"
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
              placeholder="e.g. Software Engineer"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Company Domain
            <span className="text-slate-400 font-normal ml-1">(for enrichment, e.g. stripe.com)</span>
          </label>
          <input
            type="text"
            value={companyDomain}
            onChange={(e) => setCompanyDomain(e.target.value)}
            placeholder="e.g. stripe.com"
            className={inputClass}
          />
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
            placeholder="name@example.com"
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
            placeholder="linkedin.com/in/username"
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
            placeholder="e.g. mentor, tech, classmate"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors mt-1"
        >
          Add Contact
        </button>
      </form>
    </div>
  );
}
