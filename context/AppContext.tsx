"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Contact = {
  id: string;
  name: string;
  email?: string;
  linkedin?: string;
  company?: string;
  role?: string;
  tags: string[];
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
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => Contact;
  editContact: (id: string, data: Partial<Omit<Contact, "id" | "createdAt">>) => void;
  deleteContact: (id: string) => void;
  addInteraction: (interaction: Omit<Interaction, "id">) => Interaction;
  editInteraction: (id: string, data: Partial<Omit<Interaction, "id">>) => void;
  deleteInteraction: (id: string) => void;
  addQuickNote: (text: string) => void;
  assignQuickNote: (noteId: string, contactId: string) => void;
  deleteQuickNote: (id: string) => void;
  exportData: () => string;
  importData: (json: string) => void;
};

const seedContacts: Contact[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    email: "priya@techcorp.com",
    company: "TechCorp",
    role: "Engineering Manager",
    tags: ["mentor", "tech"],
    createdAt: "2025-09-15T00:00:00.000Z",
  },
  {
    id: "c2",
    name: "Marcus Johnson",
    email: "marcus.j@gmail.com",
    linkedin: "linkedin.com/in/marcusj",
    company: "Stripe",
    role: "Senior SWE",
    tags: ["classmate", "tech"],
    createdAt: "2025-10-02T00:00:00.000Z",
  },
  {
    id: "c3",
    name: "Elena Rodriguez",
    email: "elena.r@capitalgroup.com",
    company: "Capital Group",
    role: "Recruiter",
    tags: ["recruiter", "finance"],
    createdAt: "2025-10-20T00:00:00.000Z",
  },
  {
    id: "c4",
    name: "David Kim",
    linkedin: "linkedin.com/in/davidkim",
    company: "UChicago",
    role: "PhD Student",
    tags: ["classmate", "research"],
    createdAt: "2025-11-05T00:00:00.000Z",
  },
  {
    id: "c5",
    name: "Sarah Chen",
    email: "sarah@openai.com",
    company: "OpenAI",
    role: "Research Scientist",
    tags: ["tech", "AI"],
    createdAt: "2025-11-18T00:00:00.000Z",
  },
  {
    id: "c6",
    name: "James Okafor",
    email: "james.o@mckinsey.com",
    company: "McKinsey",
    role: "Associate",
    tags: ["consulting", "mentor"],
    createdAt: "2025-12-01T00:00:00.000Z",
  },
];

const seedInteractions: Interaction[] = [
  {
    id: "i1",
    contactId: "c1",
    date: "2026-01-10T00:00:00.000Z",
    type: "coffee",
    notes: "Discussed career growth in engineering management. She recommended reading 'The Manager's Path'.",
    nextSteps: "Send thank-you email and book recommendation list",
  },
  {
    id: "i2",
    contactId: "c2",
    date: "2026-01-15T00:00:00.000Z",
    type: "linkedin",
    notes: "Reconnected on LinkedIn. He's moving to the payments infra team.",
  },
  {
    id: "i3",
    contactId: "c3",
    date: "2026-01-20T00:00:00.000Z",
    type: "email",
    notes: "She reached out about a summer internship opportunity in portfolio analytics.",
    nextSteps: "Send resume by end of week",
  },
  {
    id: "i4",
    contactId: "c4",
    date: "2026-02-01T00:00:00.000Z",
    type: "coffee",
    notes: "Study session at Regenstein. Talked about his NLP research on low-resource languages.",
  },
  {
    id: "i5",
    contactId: "c5",
    date: "2026-02-05T00:00:00.000Z",
    type: "event",
    notes: "Met at the Chicago AI Meetup. She gave a talk on RLHF safety research.",
    nextSteps: "Follow up about the reading list she mentioned",
  },
  {
    id: "i6",
    contactId: "c6",
    date: "2026-02-10T00:00:00.000Z",
    type: "call",
    notes: "30-min phone call. Advice on case interview prep and choosing between consulting and tech.",
    nextSteps: "Practice 3 cases before next check-in",
  },
  {
    id: "i7",
    contactId: "c1",
    date: "2026-02-20T00:00:00.000Z",
    type: "email",
    notes: "Sent her an update on my distributed systems project. She replied with feedback.",
  },
  {
    id: "i8",
    contactId: "c2",
    date: "2026-03-01T00:00:00.000Z",
    type: "coffee",
    notes: "Met at Plein Air Cafe. Discussed system design interview prep strategies.",
    nextSteps: "Share my Anki deck for system design",
  },
  {
    id: "i9",
    contactId: "c3",
    date: "2026-03-05T00:00:00.000Z",
    type: "call",
    notes: "Quick call to follow up on application status. Moved to second round.",
    nextSteps: "Prepare for technical interview March 15",
  },
  {
    id: "i10",
    contactId: "c5",
    date: "2026-03-10T00:00:00.000Z",
    type: "email",
    notes: "Emailed about a potential research collaboration on LLM evaluation benchmarks.",
  },
  {
    id: "i11",
    contactId: "c4",
    date: "2026-03-15T00:00:00.000Z",
    type: "event",
    notes: "Both attended the CS department seminar on federated learning.",
  },
  {
    id: "i12",
    contactId: "c6",
    date: "2026-03-20T00:00:00.000Z",
    type: "linkedin",
    notes: "He shared an article on consulting industry trends. Commented with my thoughts.",
  },
];

const seedQuickNotes: QuickNote[] = [
  {
    id: "qn1",
    text: "Ask about the new ML framework they mentioned at the meetup",
    createdAt: "2026-03-18T00:00:00.000Z",
  },
  {
    id: "qn2",
    text: "Remember to follow up on the referral from last week's coffee chat",
    contactId: "c2",
    createdAt: "2026-03-22T00:00:00.000Z",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(seedContacts);
  const [interactions, setInteractions] =
    useState<Interaction[]>(seedInteractions);
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>(seedQuickNotes);

  function addContact(data: Omit<Contact, "id" | "createdAt">): Contact {
    const newContact: Contact = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setContacts((prev) => [...prev, newContact]);
    return newContact;
  }

  function editContact(id: string, data: Partial<Omit<Contact, "id" | "createdAt">>) {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  }

  function deleteContact(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setInteractions((prev) => prev.filter((i) => i.contactId !== id));
    setQuickNotes((prev) => prev.map((n) => n.contactId === id ? { ...n, contactId: undefined } : n));
  }

  function addInteraction(data: Omit<Interaction, "id">): Interaction {
    const newInteraction: Interaction = {
      ...data,
      id: crypto.randomUUID(),
    };
    setInteractions((prev) => [...prev, newInteraction]);
    return newInteraction;
  }

  function editInteraction(id: string, data: Partial<Omit<Interaction, "id">>) {
    setInteractions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data } : i))
    );
  }

  function deleteInteraction(id: string) {
    setInteractions((prev) => prev.filter((i) => i.id !== id));
  }

  function addQuickNote(text: string) {
    const note: QuickNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };
    setQuickNotes((prev) => [...prev, note]);
  }

  function assignQuickNote(noteId: string, contactId: string) {
    setQuickNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, contactId } : n))
    );
  }

  function deleteQuickNote(id: string) {
    setQuickNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function exportData(): string {
    return JSON.stringify({ contacts, interactions, quickNotes }, null, 2);
  }

  function importData(json: string) {
    const data = JSON.parse(json);
    if (data.contacts) setContacts(data.contacts);
    if (data.interactions) setInteractions(data.interactions);
    if (data.quickNotes) setQuickNotes(data.quickNotes);
  }

  return (
    <AppContext.Provider
      value={{
        contacts,
        interactions,
        quickNotes,
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
