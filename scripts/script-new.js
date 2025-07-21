const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const openApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openApiKey) {
  console.error("❌ Supabase env vars missing:");
  console.log("SUPABASE_URL:", supabaseUrl);
  console.log("SUPABASE_SERVICE_KEY:", supabaseKey);
  console.log("OPENAI_API_KEY:", openApiKey);
  process.exit(1);
}

async function generateCuriosity() {
  const promptSystem = {
    role: "system",
    content: `
      Eres un experto generador de curiosidades sobre videojuegos. Tu tarea es crear curiosidades fascinantes, 
      educativas y sorprendentes que sean únicas y no se repitan.
      Debes asegurarte de que cada curiosidad sea completamente real y verificable, con datos específicos, fechas o números cuando sea posible.
      La curiosidad debe tener entre 100-200 palabras y ser interesante tanto para gamers casual como hardcore.
      Responde SOLO con un JSON en este formato exacto y nada mas que este formato:
      {
        "title": "Título llamativo de la curiosidad",
        "content": "Contenido detallado de la curiosidad con datos específicos",
        "category": "Una de estas categorías: Historia, Personajes, Tecnología, Industria, Desarrollo, Audio, Diseño"
      }
    `,
  };
  const promptUser = {
    role: "user",
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
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [promptSystem, promptUser],
      max_tokens: 200,
      temperature: 0.75,
    }),
  });

  const data = await response.json();

  return data.choices[0].message.content;
}

async function insert() {
  const data = await generateCuriosity();
  console.log("Generated content:", content);
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/curiosities`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        category: data.category
      }),
    });
    console.log("✅ Exito");
  } catch (err) {
    console.error("❌ Error inserting into Supabase:", err);
  }
}

async function main() {
  console.log("🚀 Inserting data into Supabase...");
  await insert();
  console.log("✅ Data inserted successfully!");
}
console.log("Inserting data into Supabase...");
main();
