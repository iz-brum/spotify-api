// controllers/controllers.js
import fetch from "node-fetch";

export async function removeDashboardTracks(selectedTracks, access_token) {
    try {
        console.log("IDs das faixas selecionadas:", selectedTracks);

        // Verifique se há faixas selecionadas
        if (!selectedTracks || selectedTracks.length === 0) {
            return { success: true, message: "Nenhuma faixa selecionada." };
        }

        // Construa a lista de IDs das faixas a serem removidas do dashboard
        const trackIdsToRemove = selectedTracks.join(',');
        console.log("TrackIdsToRemove:", trackIdsToRemove);

        const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackIdsToRemove}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + access_token,
            },
        });

        if (response.ok) {
            return { success: true, message: "Faixas removidas com sucesso do dashboard." };
        } else {
            console.error('Falha ao excluir faixas do dashboard');
            return { success: false, message: "Falha ao remover faixas do dashboard." };
        }
    } catch (error) {
        console.error("Erro ao remover faixas do dashboard:", error);
        return { success: false, message: "Erro interno ao remover faixas do dashboard." };
    }
}

export async function removePlaylistTracks(playlistId, selectedTracks, access_token) {
    try {
        // Lógica para remover faixas da playlist
    } catch (error) {
        console.error("Erro ao remover faixas da playlist:", error);
        throw error;
    }
}
