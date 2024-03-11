// Diretório: D:\dev\spotify-api-workshop - original\spotify-api-workshop\services\spotifyService.js

import fetch from "node-fetch";

export async function getData(endpoint, access_token) {
  
  try {
    console.log("URL da solicitação:", `https://api.spotify.com/v1${endpoint}`); // Adicionando log da URL da solicitação
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`); //linha 17
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
}
