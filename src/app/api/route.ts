import { NextRequest, NextResponse } from "next/server";
import { VoiceObject } from "../page";

export async function GET() {
  // Fetch the generated voices from ElevenLabs API
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      accept: "application/json",
      "xi-api-key": process.env.XI_API_KEY || "",
    },
    method: "GET",
  });

  const result = await response.json();

  // Return the voices we've generated
  const arrayOfGeneratedVoices = result.voices.filter(
    (element: VoiceObject) => element.category === "generated"
  );

  return NextResponse.json({ body: arrayOfGeneratedVoices });
}

export async function POST(req: NextRequest) {
  // Extract the text and voice id from the request body
  const request = await req.json();

  const theText = request.text;
  const theVoiceId = request.voiceId;

  // Create the POST request to ElevenLabs
  const postData = {
    text: theText,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0,
      use_speaker_boost: true,
    },
  };

  // Send the POST request
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${theVoiceId}`,
    {
      headers: {
        accept: "audio/mpeg",
        "xi-api-key": process.env.XI_API_KEY || "",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(postData),
    }
  );

  // Return the response as a blob to the frontend
  const result = await response.blob();
  const finalResponse = new NextResponse(result);
  return finalResponse;
}