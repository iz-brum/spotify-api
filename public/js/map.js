// Função para obter as coordenadas de uma cidade usando a API de Geocodificação do Google Maps
function getCityCoordinates(cityName) {
  const apiKey = 'AIzaSyCohdtFvRlM--XXucFFfsNvp2Hqkc3Mkg4';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log(`Coordenadas da cidade ${cityName}: Lat: ${location.lat}, Lng: ${location.lng}`);
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error('Cidade não encontrada');
      }
    });
}

// Função para obter informações sobre um artista usando a API do MusicBrainz
function getArtistInfo(artistName) {
  return fetch(`https://musicbrainz.org/ws/2/artist/?query=${artistName}&fmt=json`)
    .then(response => response.json())
    .then(data => data.artists[0]);
}

// Função principal para obter a localização de origem de todos os artistas
function getArtistsOrigins() {
  const artists = ['Chico Buarque', 'Elis Regina', 'Luiz Gonzaga', 'Chico Science', 'Zé Ramalho'];
  const artistsOrigins = [];
  return Promise.all(artists.map(artist => getArtistInfo(artist)))
    .then(artistInfos => {
      console.log(JSON.stringify(artistInfos, null, 2)); // Adicionando console.log() para ver o que artistInfos retorna
      return Promise.all(artistInfos.map(artistInfo => {
        const country = artistInfo.area ? artistInfo.area.name : 'País Desconhecido';
        const city = artistInfo['begin-area'] ? artistInfo['begin-area'].name : 'Cidade Desconhecida';
        return getCityCoordinates(city)
          .then(coordinates => {
            artistsOrigins.push({ name: artistInfo.name, country: country, city: city, coordinates: coordinates });
          })
          .catch(error => {
            console.error(`Erro ao obter coordenadas da cidade ${city}: ${error.message}`);
            artistsOrigins.push({ name: artistInfo.name, country: country, city: city, coordinates: null });
          });
      }));
    })
    .then(() => artistsOrigins);
}

// Função para formatar os dados dos artistas
function formatArtistsData(artistsOrigins) {
  return artistsOrigins.map((artistOrigin, index) => {
    return `${index + 1} - ${artistOrigin.name}: Country [${artistOrigin.country}], City [${artistOrigin.city}];` ;
  }).join(' ');
}

// Função para adicionar marcadores no mapa
function addMarkers(map, artistsOrigins) {
  //- Cria um ícone personalizado
  var customIcons = 
    {
      url: 'https://th.bing.com/th/id/OIG2.XrbreNMqf5DCX5Et_YIT?pid=ImgGn',
      scaledSize: new google.maps.Size(129, 129), // Tamanho do ícone
      origin: new google.maps.Point(0, 0), // Ponto de origem do ícone
      anchor: new google.maps.Point(25, 50) // Ponto de ancoragem do ícone
    //- Adicione mais ícones personalizados conforme necessário
    };

  artistsOrigins.forEach((artistOrigin, index) => {
    const marker = new google.maps.Marker({
      position: artistOrigin.coordinates,
      map: map,
      icon: customIcons
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<b>${artistOrigin.name}</b><br>Country: ${artistOrigin.country}<br>City: ${artistOrigin.city}`
    });

    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });
  });
}

//- Inicializa o mapa
function initMap() {
  //- Coordenadas do centro do mapa
  var center = { lat: -23.5505, lng: -46.6333 };

  //- Opções do mapa
  var mapOptions = {
    zoom: 3,
    center: center
  };

  //- Cria o mapa
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Chama a função getArtistsOrigins para obter as coordenadas dos artistas
  getArtistsOrigins().then((artistsOrigins) => {
    // Adiciona marcadores no mapa
    addMarkers(map, artistsOrigins);
  });
}
