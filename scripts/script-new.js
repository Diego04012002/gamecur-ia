const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

async function insert(){
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key:", supabaseKey);
  const content={
    "content" : "Prueaba desde script"
  }
  
  await fetch(`${supabaseUrl}/rest/v1/curiosities`, {
    method: "POST",
    headers: {
      "apikey": supabaseKey,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify(content)
  })
}

console.log("Inserting data into Supabase...");

insert()