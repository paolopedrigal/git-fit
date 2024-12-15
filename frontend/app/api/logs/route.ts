import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization"); // Note: headers are case-insensitive

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const accessToken = authHeader.split(" ")[1]; // Extract the Bearer token

    const response = await fetch(process.env.BACKEND_BASE_URL + "/logs/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Include the token here
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({
        error: "Failed to fetch logs from the backend",
        status: response.status,
      });
    }
  } catch (error: any) {
    console.error("Error in GET /logs:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
      status: 500,
    });
  }
}
