// routes/artists.js

import express from "express";
import { getData } from "../services/spotifyService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allArtists = await getAllArtists();
    res.render("artists", { artists: allArtists });
  } catch (error) {
    res.render("error", { error });
  }
});

async function getAllArtists() {
  try {
    let allArtists = new Map(); // Mapa para armazenar os artistas, onde a chave é o ID do artista
    let offset = 0;
    const limit = 50;

    while (true) {
      const response = await getData(`/search?q=A&type=artist&limit=${limit}&offset=${offset}`, global.access_token); // Consulta para obter artistas cujo nome começa com 'A' maiúsculo

      if (!response.artists || !response.artists.items || response.artists.items.length === 0) {
        break; // Não há mais resultados, saia do loop
      }

      for (const artist of response.artists.items) {
        const artistName = artist.name.trim(); // Remove espaços em branco do início e do final do nome do artista
        const firstChar = artistName.charAt(0).toLowerCase(); // Obtenha a primeira letra do nome em minúsculas

        if (firstChar === 'a') {
          if (!allArtists.has(artist.id)) {
            allArtists.set(artist.id, artist); // Adiciona o artista ao Map se ainda não estiver presente
          }
        }
      }

      // Verifique se todos os artistas foram carregados
      if (response.artists.total <= offset + limit) {
        break; // Todos os artistas foram carregados, saia do loop
      }

      offset += limit; // Atualize o offset para a próxima página
    }

    return Array.from(allArtists.values()); // Retorna apenas os valores do Map (os artistas únicos)
  } catch (error) {
    console.error("Error fetching artists starting with 'A':", error);
    throw error;
  }

  // VERSÃO FUNCIONANDO LEGAL, APENAS COM ARTISTA 'A' REPETINDO VARIAS VEZES
}

export default router;
