// import { streamText } from 'ai';
// import { openai } from '@ai-sdk/openai';
// import { NextResponse } from "next/server";

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const prompt = "Create a list of three open-ended and engaging questions formatted as a single string . Each question should be seperated by '||' . These questions are for an anonymous social messaging platform , like Qooh.me , and should be suitable for a diverse audience. Avoid personal or sensitive topics , focusing instead on universal themes that encourage friendly interaction for example , your output should be structured like this : 'What's' a hobby you'vw recently started? || If you could have dinner with historical figure , who would it be ?|| What's a simple thing that makes you happy?' . Ensure the questions are intriguing , foster curiosity ,  and contribute to positiove and welcoming conversational environment.";

//     const result = streamText({
//       model: openai('gpt-4o-mini'), // updated model
//       prompt,
//     });

//     return result.toTextStreamResponse();

//   } catch (error: any) {
//     console.error("Error:", error);

//     return NextResponse.json(
//       { message: error?.message || "Unexpected error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const prompt =
      "Generate 3 short anonymous questions separated by '||'.";

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("HF ERROR:", text);

      return NextResponse.json({
        success: true,
        messages:
          "What's something that made you smile today? || If you could travel anywhere, where would you go? || What's a hobby you'd like to try?",
      });
    }

    const data = JSON.parse(text);

    const output =
      data?.[0]?.generated_text ||
      "What's your favorite hobby? || What's something exciting you did recently? || What's a goal you're working on?";

    return NextResponse.json({
      success: true,
      messages: output,
    });
  } catch (error) {
    console.error("FINAL ERROR:", error);

    return NextResponse.json({
      success: true,
      messages:
        "What's something fun you did recently? || If you could go anywhere, where would you go? || What's a simple thing that makes you happy?",
    });
  }
}