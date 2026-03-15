import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages, userId, connectivityMode, isCrisisActive } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    // Proxy the request to the Python backend
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages[messages.length - 1].content,
        user_id: userId || "anonymous",
        language: "en",
        conversation_history: messages.slice(0, -1),
        connectivity_mode: connectivityMode || "online",
        is_crisis_active: isCrisisActive || false,
        current_time: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Backend API error");
    }

    const data = await response.json();
    
    // Return the formatted reply to the Chatbot UI
    // The Python backend also returns mode_detected and extracted_data if needed
    return NextResponse.json({ 
      reply: data.reply,
      mode: data.mode_detected,
      data: data.extracted_data,
      language: data.detected_language
    });

  } catch (error: any) {
    console.error("Chat proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat message via backend" },
      { status: 500 }
    );
  }
}
