// routes/dashboard.js

import express from "express";
import { getData } from "../index.js";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
    // Certifique-se de obter o token de acesso da forma correta (por exemplo, de um middleware)
    const access_token = global.access_token; 
    console.log("token de acesso quando estou na rota dashboard/", access_token);

    const userInfo = await getData("/me", access_token);
    const tracks = await getData("/me/tracks?limit=50", access_token);
   
    res.render("dashboard", { user: userInfo, tracks: tracks.items });
});

router.post("/remove-tracks", async (req, res) => {
  try {
    const selectedTracks = req.body.selectedTracks;
    console.log("IDs das faixas selecionadas:", selectedTracks);

    // Verifique se há faixas selecionadas
    if (!selectedTracks || selectedTracks.length === 0) {
      // Se não houver faixas selecionadas, retorne um código de status 200
      res.sendStatus(200);
      return;
    }

    // Construa a lista de IDs das faixas a serem removidas do dashboard
    const trackIdsToRemove = selectedTracks.join(',');
    console.log("TrackIdsToRemove:", trackIdsToRemove);

    const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackIdsToRemove}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + global.access_token,
      },
    });

    if (response.ok) {
      // Redireciona para a página anterior do usuário
      res.sendStatus(200); // Envie um código de status 200 para indicar sucesso
    } else {
      console.error('Falha ao excluir faixas do dashboard');
      res.sendStatus(500); // Envie um código de status 500 para indicar erro interno do servidor
    }
  } catch (error) {
    console.error("Erro ao remover faixas do dashboard:", error);
    res.sendStatus(500); // Envie um código de status 500 para indicar erro interno do servidor
  }
});

export default router;
