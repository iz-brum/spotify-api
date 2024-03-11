// controllers/trackController.js

var playlistDetails = {
    id: '#{playlistDetails.id}', // Adapte conforme necessário
};

document.addEventListener('DOMContentLoaded', function () {
    // Obtém todos os elementos de classe track-item
    var trackItems = document.querySelectorAll('.track-item');

    // Restaura o estado da seleção das faixas após o recarregamento da página
    restoreSelectedTracksState();

    // Adiciona um ouvinte de evento de clique a cada elemento
    trackItems.forEach(function (trackItem) {
        trackItem.addEventListener('click', function () {
            // Alternar a classe 'selected' ao clicar
            this.classList.toggle('selected');
            // Salva o estado da seleção das faixas após cada clique
            saveSelectedTracksState();
        });
    });

    // Adiciona um ouvinte de evento ao documento para verificar o botão Delete do teclado
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Delete') {
            deleteSelectedTracks();
        }
    });

    function saveSelectedTracksState() {
        // Obtém os IDs das faixas selecionadas
        var selectedTracks = Array.from(document.querySelectorAll('.track-item.selected'))
            .map(function (selectedItem) {
                return selectedItem.querySelector('input').value;
            });

        // Armazena os IDs das faixas selecionadas no armazenamento local
        localStorage.setItem('selectedTracks', JSON.stringify(selectedTracks));
    }

    function restoreSelectedTracksState() {
        // Obtém os IDs das faixas selecionadas do armazenamento local
        var selectedTracks = JSON.parse(localStorage.getItem('selectedTracks')) || [];

        // Seleciona as faixas com base nos IDs armazenados
        selectedTracks.forEach(function (trackId) {
            var trackItem = document.querySelector(`.track-item input[value='${trackId}']`);
            if (trackItem) {
                trackItem.closest('.track-item').classList.add('selected');
            }
        });
    }

    function deleteSelectedTracks() {
        // Obtém os IDs das faixas selecionadas
        var selectedTracks = Array.from(document.querySelectorAll('.track-item.selected'))
            .map(function (selectedItem) {
                return selectedItem.querySelector('input').value;
            });

        // Envia os IDs das faixas selecionadas para a rota de exclusão
        fetch(`/playlist/${playlistDetails.id}/remove-tracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedTracks: selectedTracks }),
        })
        .then(response => {
            if (response.ok) {
                // Redireciona para a página anterior do usuário
                window.location.href = `/playlists/${playlistDetails.id}`;
            } else {
                console.error('Falha ao excluir faixas da playlist');
            }
        })
        .catch(error => console.error('Erro ao excluir faixas da playlist:', error));
    }
});
