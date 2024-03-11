// Diretório: D:\dev\spotify-api-workshop - original\spotify-api-workshop\config\authorization.js

import { URLSearchParams } from "url";
import config from "../config.js";

const redirect_uri = "http://localhost:3000/callback";
const client_id = process.env.CLIENT_ID || config.client_id;

function authorize(req, res) {
  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: "user-library-read user-follow-read playlist-modify-public playlist-modify-private user-library-modify user-follow-modify",
    redirect_uri: redirect_uri,
  });
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
    auth_query_parameters.toString()
  );

}

export { authorize };
