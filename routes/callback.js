// routes/callback.js
import express from "express";
import config from "../config.js";

const router = express.Router();
const redirect_uri = "http://localhost:3000/callback";

const client_id = process.env.CLIENT_ID || config.client_id;
const client_secret = process.env.CLIENT_SECRET || config.client_secret;

router.get("/", async (req, res) => {
  const code = req.query.code;
  
  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code",
  });

const response = await fetch("https://accounts.spotify.com/api/token", {
  method: "post",
  body: body,
  headers: {
    "Content-type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      Buffer.from(client_id + ":" + client_secret).toString("base64"),
  },
});

  const data = await response.json();
  global.access_token = data.access_token;

  res.redirect("/dashboard");
});

export default router;
  