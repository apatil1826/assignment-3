"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export type Contact = {
  id: string;
  name: string;
  email?: string;
  linkedin?: string;
  company?: string;
  companyDomain?: string;
  role?: string;
  tags: string[];
  companyIndustry?: string;
  companyCountry?: string;
  companyDescription?: string;
  companyLogoUrl?: string;
  createdAt: string;
};

export type InteractionType =
  | "coffee"
  | "email"
  | "linkedin"
  | "event"
  | "call"
  | "other";

export type Interaction = {
  id: string;
  contactId: string;
  date: string;
  type: InteractionType;
  notes: string;
  nextSteps?: string;
};

export type QuickNote = {
  id: string;
  text: string;
  contactId?: string;
  createdAt: string;
};

type AppContextType = {
  contacts: Contact[];
  interactions: Interaction[];
  quickNotes: QuickNote[];
  loading: boolean;
  addContact: (
    contact: Omit<Contact, "id" | "createdAt">
  ) => Promise<Contact>;
  editContact: (
    id: string,
    data: Partial<Omit<Contact, "id" | "createdAt">>
  ) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addInteraction: (
    interaction: Omit<Interaction, "id">
  ) => Promise<Interaction>;
  editInteraction: (
    id: string,
    data: Partial<Omit<Interaction, "id">>
  ) => Promise<void>;
  deleteInteraction: (id: string) => Promise<void>;
  addQuickNote: (text: string) => Promise<void>;
  assignQuickNote: (noteId: string, contactId: string) => Promise<void>;
  deleteQuickNote: (id: string) => Promise<void>;
  exportData: () => string;
  importData: (json: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Mappers between camelCase (UI) and snake_case (Supabase) ---

function mapContactFromDb(row: Record<string, unknown>): Contact {
  return {
    id: row.id as string,
    name: row.name as string,
    email: (row.email as string) || undefined,
    linkedin: (row.linkedin as string) || undefined,
    company: (row.company as string) || undefined,
    companyDomain: (row.company_domain as string) || undefined,
    role: (row.role as string) || undefined,
    tags: (row.tags as string[]) || [],
    companyIndustry: (row.company_industry as string) || undefined,
    companyCountry: (row.company_country as string) || undefined,
    companyDescription: (row.company_description as string) || undefined,
    companyLogoUrl: (row.company_logo_url as string) || undefined,
    createdAt: row.created_at as string,
  };
}

function mapInteractionFromDb(row: Record<string, unknown>): Interaction {
  return {
    id: row.id as string,
    contactId: row.contact_id as string,
    date: row.date as string,
    type: row.type as InteractionType,
    notes: (row.notes as string) || "",
    nextSteps: (row.next_steps as string) || undefined,
  };
}

function mapQuickNoteFromDb(row: Record<string, unknown>): QuickNote {
  return {
    id: row.id as string,
    text: row.text as string,
    contactId: (row.contact_id as string) || undefined,
    createdAt: row.created_at as string,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const userId = user?.id;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data when userId is available
  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const [contactsRes, interactionsRes, notesRes] = await Promise.all([
      supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("interactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false }),
      supabase
        .from("quick_notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    if (contactsRes.data)
      setContacts(contactsRes.data.map(mapContactFromDb));
    if (interactionsRes.data)
      setInteractions(interactionsRes.data.map(mapInteractionFromDb));
    if (notesRes.data)
      setQuickNotes(notesRes.data.map(mapQuickNoteFromDb));

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Contacts ---

  async function addContact(
    data: Omit<Contact, "id" | "createdAt">
  ): Promise<Contact> {
    // Enrich company data if a domain is provided
    let enriched: Record<string, string | null> = {};
    if (data.companyDomain) {
      try {
        const res = await fetch(
          `/api/enrich-company?domain=${encodeURIComponent(data.companyDomain)}`
        );
        if (res.ok) {
          const json = await res.json();
          enriched = {
            company_industry: json.industry || null,
            company_country: json.country || null,
            company_description: json.description || null,
            company_logo_url: json.logo || null,
          };
          // Use the enriched company name if we don't already have one
          if (!data.company && json.name) {
            data = { ...data, company: json.name };
          }
        }
      } catch {
        // Enrichment is best-effort — proceed without it
      }
    }

    const { data: rows, error } = await supabase
      .from("contacts")
      .insert({
        user_id: userId,
        name: data.name,
        email: data.email || null,
        linkedin: data.linkedin || null,
        company: data.company || null,
        company_domain: data.companyDomain || null,
        role: data.role || null,
        tags: data.tags,
        ...enriched,
      })
      .select()
      .single();

    if (error) throw error;
    const contact = mapContactFromDb(rows);
    setContacts((prev) => [contact, ...prev]);
    return contact;
  }

  async function editContact(
    id: string,
    data: Partial<Omit<Contact, "id" | "createdAt">>
  ) {
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.email !== undefined) update.email = data.email || null;
    if (data.linkedin !== undefined) update.linkedin = data.linkedin || null;
    if (data.company !== undefined) update.company = data.company || null;
    if (data.companyDomain !== undefined)
      update.company_domain = data.companyDomain || null;
    if (data.role !== undefined) update.role = data.role || null;
    if (data.tags !== undefined) update.tags = data.tags;

    // Re-enrich if domain changed
    const existing = contacts.find((c) => c.id === id);
    if (data.companyDomain && data.companyDomain !== existing?.companyDomain) {
      try {
        const res = await fetch(
          `/api/enrich-company?domain=${encodeURIComponent(data.companyDomain)}`
        );
        if (res.ok) {
          const json = await res.json();
          update.company_industry = json.industry || null;
          update.company_country = json.country || null;
          update.company_description = json.description || null;
          update.company_logo_url = json.logo || null;
          data = {
            ...data,
            companyIndustry: json.industry || undefined,
            companyCountry: json.country || undefined,
            companyDescription: json.description || undefined,
            companyLogoUrl: json.logo || undefined,
          };
        }
      } catch {
        // Best-effort
      }
    }

    const { error } = await supabase
      .from("contacts")
      .update(update)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  }

  async function deleteContact(id: string) {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setInteractions((prev) => prev.filter((i) => i.contactId !== id));
    setQuickNotes((prev) =>
      prev.map((n) =>
        n.contactId === id ? { ...n, contactId: undefined } : n
      )
    );
  }

  // --- Interactions ---

  async function addInteraction(
    data: Omit<Interaction, "id">
  ): Promise<Interaction> {
    const { data: rows, error } = await supabase
      .from("interactions")
      .insert({
        user_id: userId,
        contact_id: data.contactId,
        date: data.date,
        type: data.type,
        notes: data.notes,
        next_steps: data.nextSteps || null,
      })
      .select()
      .single();

    if (error) throw error;
    const interaction = mapInteractionFromDb(rows);
    setInteractions((prev) => [interaction, ...prev]);
    return interaction;
  }

  async function editInteraction(
    id: string,
    data: Partial<Omit<Interaction, "id">>
  ) {
    const update: Record<string, unknown> = {};
    if (data.contactId !== undefined) update.contact_id = data.contactId;
    if (data.date !== undefined) update.date = data.date;
    if (data.type !== undefined) update.type = data.type;
    if (data.notes !== undefined) update.notes = data.notes;
    if (data.nextSteps !== undefined)
      update.next_steps = data.nextSteps || null;

    const { error } = await supabase
      .from("interactions")
      .update(update)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    setInteractions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data } : i))
    );
  }

  async function deleteInteraction(id: string) {
    const { error } = await supabase
      .from("interactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    setInteractions((prev) => prev.filter((i) => i.id !== id));
  }

  // --- Quick Notes ---

  async function addQuickNote(text: string) {
    const { data: rows, error } = await supabase
      .from("quick_notes")
      .insert({ user_id: userId, text })
      .select()
      .single();

    if (error) throw error;
    const note = mapQuickNoteFromDb(rows);
    setQuickNotes((prev) => [note, ...prev]);
  }

  async function assignQuickNote(noteId: string, contactId: string) {
    const { error } = await supabase
      .from("quick_notes")
      .update({ contact_id: contactId })
      .eq("id", noteId)
      .eq("user_id", userId);

    if (error) throw error;
    setQuickNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, contactId } : n))
    );
  }

  async function deleteQuickNote(id: string) {
    const { error } = await supabase
      .from("quick_notes")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    setQuickNotes((prev) => prev.filter((n) => n.id !== id));
  }

  // --- Import / Export ---

  function exportData(): string {
    return JSON.stringify({ contacts, interactions, quickNotes }, null, 2);
  }

  async function importData(json: string) {
    const data = JSON.parse(json);
    if (!userId) return;

    if (data.contacts) {
      for (const c of data.contacts as Contact[]) {
        await supabase.from("contacts").insert({
          user_id: userId,
          name: c.name,
          email: c.email || null,
          linkedin: c.linkedin || null,
          company: c.company || null,
          company_domain: c.companyDomain || null,
          role: c.role || null,
          tags: c.tags,
        });
      }
    }
    // Re-fetch after import to get server-generated IDs
    await fetchData();
  }

  return (
    <AppContext.Provider
      value={{
        contacts,
        interactions,
        quickNotes,
        loading,
        addContact,
        editContact,
        deleteContact,
        addInteraction,
        editInteraction,
        deleteInteraction,
        addQuickNote,
        assignQuickNote,
        deleteQuickNote,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
