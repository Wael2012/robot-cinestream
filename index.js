import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Ta clé TMDb v3 (celle que tu m'as donnée)
const TMDB_API_KEY = "be1e4bf5814bbd04fa49aa2564757c40";

// 🟩 Route d'accueil (évite "Cannot GET /")
app.get("/", (req, res) => {
    res.send("🚀 CinéStream API est en ligne !");
});

// 🟦 Route : infos d’un film par ID
app.get("/tmdb/movie/:id", async (req, res) => {
    const movieId = req.params.id;

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=fr-FR`
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Erreur TMDb :", error);
        res.status(500).json({ error: "Erreur TMDb" });
    }
});

// 🟦 Route : chercher un film par nom
app.get("/tmdb/search/:query", async (req, res) => {
    const query = req.params.query;

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Erreur TMDb :", error);
        res.status(500).json({ error: "Erreur TMDb" });
    }
});

// 🟩 Lancer le serveur (Render utilise process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur CinéStream en ligne sur le port ${PORT}`);
});
