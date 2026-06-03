import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Ta clé TMDb v3 (intégrée en dur comme tu veux)
const TMDB_API_KEY = "be1e4bf5814bbd04fa49aa2564757c40";

// 🟩 Route d'accueil
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
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&region=FR&with_original_language=fr&include_adult=false&query=${encodeURIComponent(query)}`
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Erreur TMDb :", error);
        res.status(500).json({ error: "Erreur TMDb" });
    }
});

// 🟪 ROBOT 1 : films + séries FR/CA sans contenu adulte
app.get("/robot1/fetch", async (req, res) => {
    try {
        // Appel TMDb : trending FR, langue FR, pas de contenu adulte
        const response = await fetch(
            "https://api.themoviedb.org/3/trending/all/day?api_key=be1e4bf5814bbd04fa49aa2564757c40&language=fr-FR&region=FR&with_original_language=fr&include_adult=false"
        );

        const data = await response.json();

        // Filtre supplémentaire côté serveur (sécurité)
        const filtered = data.results.filter(item => {
            return (
                item.original_language === "fr" &&  // uniquement FR
                item.adult === false                // pas de contenu adulte
            );
        });

        res.json(filtered);

    } catch (error) {
        console.error("Erreur Robot 1 :", error);
        res.status(500).json({ error: "Erreur Robot 1" });
    }
});

// 🟩 Lancer le serveur (Render utilise process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur CinéStream en ligne sur le port ${PORT}`);
});
