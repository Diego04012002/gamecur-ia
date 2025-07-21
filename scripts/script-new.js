const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase env vars missing:");
  console.log("SUPABASE_URL:", supabaseUrl);
  console.log("SUPABASE_SERVICE_KEY:", supabaseKey);
  process.exit(1);
}

async function insert() {
  const content = {
    content: "Prueba desde script",
  };

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/test`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(content),
    });

    const json = await res.json();
    console.log("✅ Supabase response:", json);
  } catch (err) {
    console.error("❌ Error inserting into Supabase:", err);
  }
}

console.log("Inserting data into Supabase...");
insert();
