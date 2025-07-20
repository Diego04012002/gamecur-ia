import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verificar autorización del cron job
    const authHeader = request.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.CRON_API_KEY}`;

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    });

    const promptSystem: { role: "system"; content: string } = {
      role: "system",
      content: `Genera una curiosidad fascinante sobre videojuegos que sea educativa y sorprendente. 
        
        La curiosidad debe:
        - Ser completamente real y verificable
        - Tener entre 100-200 palabras
        - Incluir datos específicos, fechas o números cuando sea posible
        - Ser sobre cualquier aspecto: historia, desarrollo, personajes, tecnología, industria, etc.
        - Ser interesante tanto para gamers casuales como hardcore
        - Debe ser una curiosidad distinta a las generadas previamente. No repitas temas ni enfoques.
        
        Responde SOLO con un JSON en este formato exacto y nada mas que este formato:
        {
          "title": "Título llamativo de la curiosidad",
          "content": "Contenido detallado de la curiosidad con datos específicos",
          "category": "Una de estas categorías: Historia, Personajes, Tecnología, Industria, Desarrollo, Audio, Diseño"
        }
          
        IMPORTANTE ser preciso con el formato y que sean siempre curiosidades distintas y unicas, no quiero que se repitan. 
        Quiero que sean todas distinas una del anterior.
        
        Si lo generas bien te dare 500 euros a cambio, siempre que cumplas con lo que te he dicho.
        `,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [promptSystem],
      max_tokens: 200,
      temperature: 0.75,
    });
    const answer = completion.choices[0].message.content;
    // Parse the JSON response
    const curiosity = JSON.parse(answer ?? "");

    //Devolver el resultado generado
    return NextResponse.json(curiosity);
  } catch (error) {
    console.error("❌ Error generating daily curiosity:", error);

    return NextResponse.json(
      {
        error: "Failed to generate daily curiosity",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
