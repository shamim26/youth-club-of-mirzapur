import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return new NextResponse("Missing fileId", { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return new NextResponse("Telegram integration not configured", {
      status: 500,
    });
  }

  try {
    // Step 1: Get the exact file path from Telegram using the fileId
    const fileRes = await fetch(
      `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`,
    );
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return new NextResponse(
        `Telegram Error: ${fileData.description || "File not found"}`,
        { status: 404 },
      );
    }

    const filePath = fileData.result.file_path;

    // Step 2: Fetch the actual file binary
    const imageRes = await fetch(
      `https://api.telegram.org/file/bot${token}/${filePath}`,
    );

    if (!imageRes.ok) {
      return new NextResponse("Failed to download file from Telegram", {
        status: 500,
      });
    }

    // Step 3: Proxy the binary content back to the client securely
    return new NextResponse(imageRes.body, {
      headers: {
        "Content-Type":
          imageRes.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable", // Heavily cache image
      },
    });
  } catch (error) {
    console.error("TG Proxy Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
