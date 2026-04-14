import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ error: "domain is required" }, { status: 400 });
  }

  const apiKey = process.env.ABSTRACT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://companyenrichment.abstractapi.com/v1/?api_key=${apiKey}&domain=${encodeURIComponent(domain)}`
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Enrichment API failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
