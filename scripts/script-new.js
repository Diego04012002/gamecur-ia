const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const https = require('https')
const http = require('http')

function makeRequest(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const lib = isHttps ? https : http;

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = lib.request(reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }

    req.end();
  });
}

async function main() {
  const content = {
    content: "Prueaba desde script",
  };

  try {
    const response = await makeRequest(
      `${supabaseUrl}/rest/v1/ephemerides`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      },
      content
    );
    console.log("Respuesta de Supabase:", response);
    if (response.status !== 201) {
      throw new Error(
        `Error insertando en Supabase: ${response.status} ${JSON.stringify(
          response.data
        )}`
      );
    }
  } catch (e) {
    console.error("Error al insertar datos:", e);
    return;
  }
}

// Ejecutar el script
if (require.main === module) {
    main()
} 
