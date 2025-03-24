import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pdfUrl = searchParams.get("url");

  if (!pdfUrl) {
    return NextResponse.json({ error: "Missing PDF URL" }, { status: 400 });
  }

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Failed to fetch PDF");

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}
