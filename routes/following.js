// Diretório: D:\dev\spotify-api-workshop - original\spotify-api-workshop\routes\following.js 
import express from "express";
import { getData } from "../index.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const access_token = req.query.access_token; // Obtém o token de acesso da solicitação
    const followedArtists = await getData("/artists", access_token); // Passa o token de acesso para a função getData
   

    if (
      followedArtists &&
      followedArtists.artists &&
      followedArtists.artists.items.length > 0
    ) {
      res.render("following", {
        followedArtists: followedArtists.artists.items,
      });
    } else {
      res.render("following", { followedArtists: [] });
    }
  } catch (error) {
    console.error("Error fetching followed artists:", error);
    res.render("following", { error });
  }
});

export default router;
