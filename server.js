import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());

let twitchToken = null;

// 🔹 Obtener token de Twitch
async function getTwitchToken() {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials"
    })
  });

  const data = await response.json();
  twitchToken = data.access_token;
  console.log("✅ Twitch token generado:", twitchToken);
}

// 🔹 Streamers populares
app.get("/top-streamers", async (req, res) => {
  if (!twitchToken) {
    await getTwitchToken();
  }

  const response = await fetch("https://api.twitch.tv/helix/streams?first=20", {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${twitchToken}`
    }
  });

  const data = await response.json();
  res.json(data);
});

// 🔹 Juegos más jugados
app.get("/top-games", async (req, res) => {
  if (!twitchToken) {
    await getTwitchToken();
  }

  const response = await fetch("https://api.twitch.tv/helix/games/top?first=20", {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${twitchToken}`
    }
  });

  const data = await response.json();
  console.log("✅ Juegos recibidos:", data); // 👀 imprime en consola
  res.json(data);
});

// 🔹 Ruta de prueba
app.get("/ping", (req, res) => {
  res.send("Servidor funcionando con Twitch ✅");
});

// 🔹 Arrancar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
// Películas en estreno
app.get("/movies/now-playing", async (req, res) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=es-ES&page=1`
  );
  const data = await response.json();
  res.json(data);
});

// Películas populares
app.get("/movies/popular", async (req, res) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=es-ES&page=1`
  );
  const data = await response.json();
  res.json(data);
});

// Películas mejor votadas
app.get("/movies/top-rated", async (req, res) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=es-ES&page=1`
  );
  const data = await response.json();
  res.json(data);
});
