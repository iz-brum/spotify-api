// routes/search.js
import express from "express";
import { getData } from "../index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.query;

  try {
    console.log("TOKEN SEARCH: ", global.access_token);
    const userInfo = await getData("/me");

    if (!query) {
      // A consulta está vazia, então retorne um valor vazio
      res.render("search", { results: [] });
      return;
    }

    const limit = 20; // Número de itens por página
    const maxResults = 50; // Número máximo de resultados

    let offset = 0; // Página inicial
    let allResults = [];

    // Continue fazendo chamadas até obter todos os resultados ou atingir o limite máximo
    while (offset < maxResults) {
      const results = await getData(`/search?q=${query}&type=track&limit=${limit}&offset=${offset}`);
      
      if (results.tracks.items.length === 0) {
        // Não há mais resultados, saia do loop
        break;
      }

      // Adicione os resultados atuais à lista completa
      allResults = allResults.concat(results.tracks.items);

      // Incremente o offset para a próxima página
      offset += limit;
    }

    // Limite a lista completa ao número máximo de resultados desejado
    allResults = allResults.slice(0, maxResults);

    console.log("All Results:", allResults);

    res.render("search", { query, results: allResults, user: userInfo });
  } catch (error) {
    res.render("error", { error });
  }
});

router.get("/autocomplete", async (req, res) => {
  const query = req.query.q;

  try {
    const results = await getData(`/search?q=${query}&type=track`); // Buscando faixas
    res.json({ results: results.tracks.items });
  } catch (error) {
    console.error("Error fetching autocomplete results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
