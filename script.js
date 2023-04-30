
let token;

function onResponse(response) {
    if (!response.ok) {
        console.log('Risposta non valida');
        return null;

    }
    else
        console.log('Risposta ricevuta');
    return response.json();
}

function onTokenJson(json) {

    token = json.access_token;
    console.log(json);
    console.log('token: ' + token);

}
function onJsonCharacter(json) {
    console.log('Ricevuto');
    console.log(json);

    const risultati = document.querySelector('#risultati');
    risultati.innerHTML = '';



    const name = json.results[0].name;
    const vision = json.results[0].vision;
    const rarity = json.results[0].rarity;
    const arma = json.results[0].weapon;

    const title = document.createElement('h1');
    title.textContent = name;
    const visione = document.createElement('span');
    visione.textContent = 'Vision: ' + vision;
    const rarità = document.createElement('span');
    rarità.textContent = 'Rarity: ' + rarity;
    const weapon = document.createElement('span');
    weapon.textContent = 'Weapon: ' + arma;


    const risultato = document.createElement('div');
    risultato.appendChild(title);
    risultato.appendChild(visione)
    risultato.appendChild(rarità);

    risultato.appendChild(weapon);
    risultati.appendChild(risultato);


}

function onJsonVision(json) {
    console.log('Ricevuto');
    console.log(json);

    const risultati = document.querySelector('#risultati');
    risultati.innerHTML = '';

    for (let i = 0; i < 10; i++) {

        const nome = json.results[i].name;
        const vision = json.results[i].vision;
        const rarity = json.results[i].rarity;
        const arma = json.results[i].weapon;

        const title = document.createElement('h1');
        title.textContent = nome;
        const visione = document.createElement('span');
        visione.textContent = 'Vision: ' + vision;
        const rarità = document.createElement('span');
        rarità.textContent = 'Rarity: ' + rarity;
        const weapon = document.createElement('span');
        weapon.textContent = 'Weapon: ' + arma;


        const risultato = document.createElement('div');
        risultato.appendChild(title);
        risultato.appendChild(visione)
        risultato.appendChild(rarità);
        risultato.appendChild(weapon);

        risultati.appendChild(risultato);
    }



}

function unSubmit(event) {

    //ripulisco i risultati precedenti 
    event.preventDefault();
    const cont = document.querySelector('#results');
    cont.innerHTML = '';
    const div = document.querySelector('#twitch');
    div.addEventListener('submit', onTwitch);


}


function onJsonCategories(json) {
    console.log('creo i div di twitch');
    console.log(json);



    const cont = document.querySelector('#twitch');
    cont.removeEventListener('submit', onTwitch);
    const elemento = document.querySelector('#results');
    let n = Math.floor(Math.random() * 10);

    //scelgo dei  risultati random per ottenere sempre diversi canali di Twitch a ogni click
    for (let i = n; i < n + 10; i++) {
        const result = json.data[i];
        const nome = result.display_name;
        const lang = result.broadcaster_language;
        const img = result.thumbnail_url;

        const title = document.createElement('h1');
        title.textContent = nome;
        const language = document.createElement('span');
        language.textContent = 'Lang: ' + lang;
        const icon = document.createElement('img');
        icon.src = img;

        const risultato = document.createElement('div');
        risultato.appendChild(icon);
        risultato.appendChild(title);
        risultato.appendChild(language)

        elemento.appendChild(risultato);



    }
    cont.addEventListener('submit', unSubmit)
}


function onSubmit(event) {

    //funzione per capire quale endpoint utilizzare per la fetch 
    event.preventDefault();

    const insert_elem = document.querySelector('#content').value;

    if (insert_elem) {
        text = encodeURIComponent(insert_elem);
        console.log('Ricerca di:' + text);
        const tipo = document.querySelector('#tipo').value;

        //ricerca per nome
        if (tipo === "characters") {
            rest_url = 'https://gsi.fly.dev/characters/search?name=' + text + '&limit=10';
            console.log('URL:' + rest_url);

            fetch(rest_url).then(onResponse).then(onJsonCharacter);
        } //ricerca per visione
        else if (tipo === 'vision') {
            rest_url = 'https://gsi.fly.dev/characters/search?vision=' + text + '&limit=10';
            console.log('URL:' + rest_url);

            fetch(rest_url).then(onResponse).then(onJsonVision);

        }
        else {
            alert("Seleziona una ricerca");
        }

    }
    else {
        alert("Inserisci il testo");
    }


}

function onTwitch(event) {

    event.preventDefault();
    // Seconda fetch per accedere all'API
    fetch('https://api.twitch.tv/helix/search/channels?query=genshin%20impact&limit=10', {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Client-Id': 'tsu6j0knufg9r6719kdynytyae1sob'
        }
    }).then(onResponse).then(onJsonCategories);


}

// Prima fetch per ottenere il token dell'API di Twitch
fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body:
        'client_id=tsu6j0knufg9r6719kdynytyae1sob&client_secret=4e3132z7ln3ktlvgd2ka2zmj5v9ugf&grant_type=client_credentials',
    headers: {

        'Content-Type': 'application/x-www-form-urlencoded'
    }




}).then(onResponse).then(onTokenJson);


const form = document.querySelector('form');
form.addEventListener('submit', onSubmit)

const element = document.querySelector('#twitch');
element.addEventListener('submit', onTwitch)