"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import NetworkGraph from "@/components/NetworkGraph";

export default function NetworkPage() {
  const { contacts, interactions } = useAppContext();
  const [groupBy, setGroupBy] = useState<"tags" | "company">("tags");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Network Map</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setGroupBy("tags")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              groupBy === "tags"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
          >
            By Tag
          </button>
          <button
            onClick={() => setGroupBy("company")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              groupBy === "company"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-slate-600 hover:bg-gray-200"
            }`}
          >
            By Company
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <NetworkGraph
          contacts={contacts}
          interactions={interactions}
          groupBy={groupBy}
        />
      </div>
    </div>
  );
}
