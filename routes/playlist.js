// routes/playlist.js
import express from "express";
import { getData } from "../services/spotifyService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let playlists = [];
    let nextUrl = "/me/playlists";
   
    console.log("TOKEN na rota me/playlists: ", access_token);

    // Continue fazendo solicitações até que não haja mais páginas
    while (nextUrl) {
      const result = await getData(nextUrl, access_token);
      playlists = playlists.concat(result.items);
      nextUrl = result.next;
    }

    const userInfo = await getData("/me", access_token);

    res.render("playlists", { playlists, user: userInfo });
  } catch (error) {
    // Passa o objeto de erro para a página de erro
    res.status(error.status || 500).render("error", { error });
  }
});

router.get('/:playlistId', async (req, res) => {
  const playlistId = req.params.playlistId;
  const userInfo = await getData("/me", access_token);

  try {
    const playlistDetails = await getData(`/playlists/${playlistId}`, access_token);
    res.render('tracks', { playlistDetails, user: userInfo });
  } catch (error) {
    res.render('error', { error });
  }
});

export default router;
