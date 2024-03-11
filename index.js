// Diretório: D:\dev\spotify-api-workshop - original\spotify-api-workshop\index.js

import express from "express";
import "node-fetch";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';  // Importe a função 'fileURLToPath' para converter URL em caminho de arquivo.
import path from "path"; // Importe o módulo 'path' para lidar com caminhos de arquivo.


import { authorize } from "./config/authorization.js"; // Ajuste o caminho do import.
import { getData } from "./services/spotifyService.js";
import * as controllers from "./controllers/controllers.js";

import playlistRouter from "./routes/playlist.js"; // Importe o roteador de playlist.
import dashboardRouter from "./routes/dashboard.js"; // Importe o roteador de dashboard.
import callbackRouter from "./routes/callback.js"; // Importe o roteador de callback.
import followingRouter from "./routes/following.js"; // Importe o roteador de following.
import artistsRouter from "./routes/artists.js"; // Importe a rota de artistas.

const __filename = fileURLToPath(import.meta.url);  // Use a função 'fileURLToPath' para obter o caminho do arquivo a partir da URL.
const __dirname = path.dirname(__filename);
const app = express();
global.access_token;

// Configuração do middleware body-parser
app.use(bodyParser.json());

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// Use o roteador de playlist para as rotas relacionadas a dashboard
app.use('/dashboard', dashboardRouter);
// Use o roteador de playlistRouter para as rotas relacionadas a playlists
app.use('/playlists', playlistRouter);
// Use o roteador de artistsRouter para as rotas relacionadas a artistas
app.use('/artists', artistsRouter);
// Use o roteador de playlist para as rotas relacionadas a dashboard
app.use('/callback', callbackRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err });
});

app.get("/", function (req, res) {
  const showNavbar = false; // Desativa a barra de navegação
  res.render("index", { showNavbar });
});

app.get("/authorize", authorize); // Use a função de autorização aqui.

// async function getData(endpoint) {
//   console.log("TOKEN SERVER: ", global.access_token);
//   const response = await fetch("https://api.spotify.com/v1" + endpoint, {
//     method: "get",
//     headers: {
//       Authorization: "Bearer " + global.access_token,
//     },
//   });

//   const data = await response.json();
//   return data;
// }

app.post("/dashboard/remove-tracks", async (req, res) => {
  const result = await controllers.removeDashboardTracks(req.body.selectedTracks, global.access_token);
  res.status(result.success ? 200 : 500).send(result.message);
});


app.post("/playlist/:playlistId/remove-tracks", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { selectedTracks } = req.body;
    
    // Constrói a lista de faixas a serem removidas da playlist
    const tracksToRemove = {
      tracks: selectedTracks.map(trackId => ({ uri: `spotify:track:${trackId}` })),
    };
    
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + global.access_token,
      },
      body: JSON.stringify(tracksToRemove),
    });
    
    const responseData = await response.json();
    // console.log(responseData); // Exibe a resposta da API no console para ajudar a identificar o problema
    
    if (response.ok) {
      // Redirecionamento para a página anterior do usuário
      res.redirect(`/playlists/${playlistId}`);
    } else {
      res.status(500).send("Falha ao remover as faixas da playlist");
    }
  } catch (error) {
    console.error("Erro ao remover faixas da playlist:", error);
    res.status(500).send("Erro ao remover faixas da playlist");
  }
});


app.get("/:trackId", async (req, res) => {
  const trackId = req.params.trackId;

  try {
    const trackInfo = await getData(`/tracks/${trackId}`, access_token);//
    res.render("track", { trackInfo });
  } catch (error) {
    res.render("error", { error });
  }
});


const PORT = process.env.PORT;
// Inicia o servidor na porta 3000 e exibe uma mensagem indicando que o aplicativo está ouvindo nesta porta.
let listener = app.listen(PORT, function () {
  console.log(
    "Your app is listening on http://:" + listener.address().PORT
  );
});


export { getData };