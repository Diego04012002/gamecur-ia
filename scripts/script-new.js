import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_URL_SUPABASE,
  process.env.NEXT_PUBLIC_API_KEY_SUPABASE
);

async function insert(){
  await supabase.from("test").insert({
    content:"Prueba de cron 1"
  })
}

console.log("Inserting data into Supabase...");

insert()