const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

async function insert(){
  const content={
    "content" : "Prueaba desde script"
  }
  
  const data = await fetch(`${supabaseUrl}/rest/v1/test`, {
    method: "POST",
    headers: {
      "apikey": supabaseKey,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify(content)
  })
  console.log(data.json())
}

console.log("Inserting data into Supabase...");

insert()