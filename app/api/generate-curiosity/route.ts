import { NextResponse } from "next/server"
import OpenAI from 'openai';
import { loadEnvConfig } from '@next/env'
 
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});


export async function POST() {
  const promptSystem: { role: "system"; content: string } = {
    role: "system",
    content: `Genera una curiosidad fascinante sobre videojuegos que sea educativa y sorprendente. 
    
    La curiosidad debe:
    - Ser completamente real y verificable
    - Tener entre 100-200 palabras
    - Incluir datos específicos, fechas o números cuando sea posible
    - Ser sobre cualquier aspecto: historia, desarrollo, personajes, tecnología, industria, etc.
    - Ser interesante tanto para gamers casuales como hardcore
    
    Responde SOLO con un JSON en este formato exacto y nada mas que este formato:
    {
      "title": "Título llamativo de la curiosidad",
      "content": "Contenido detallado de la curiosidad con datos específicos",
      "category": "Una de estas categorías: Historia, Personajes, Tecnología, Industria, Desarrollo, Audio, Diseño"
    }
      
    Importante ser preciso con el formato y que sean siempre curiosidades distintas.  
    `
  }
  
  try{
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [promptSystem],
      max_tokens: 200,
      temperature: 0.75,
    })
    const answer = completion.choices[0].message.content;
    // Parse the JSON response
    const curiosity = JSON.parse(answer ?? "")
    
    //Devolver el resultado generado
    return NextResponse.json(curiosity)

  } catch (error) {
    console.error("Error generating curiosity:", error)
    return NextResponse.json({ error: "Failed to generate curiosity" }, { status: 500 })
  }
}
