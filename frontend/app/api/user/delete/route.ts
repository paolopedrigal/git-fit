import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  // Validate the parameter
  if (!authHeader) {
    return NextResponse.json({ error: "Missing required fields", status: 400 });
  }

  const accessToken = authHeader.split(" ")[1]; // Extract the Bearer token (Note: "Bearer" in 0th index)

  try {
    const response = await fetch(
      process.env.BACKEND_BASE_URL + `/user/delete/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) return NextResponse.json({ success: true });
    else return NextResponse.json({ success: false });
  } catch (error: any) {
    console.error("Error in DELETE /user/delete:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
      status: 500,
    });
  }
}
