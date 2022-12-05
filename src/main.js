// Instancia de axios
const api = axios.create({
    baseURL: "https://api.thecatapi.com/v1/",
});
api.defaults.headers.common["X-API-KEY"] = "live_8dst4XpWgz7IYKioNGuyEKnFWToGoUD4EBvZu4KXXvPSsQzUMvUO6L8AlJodmy6m";

//URL de la API
const API_URL = 'https://api.thecatapi.com/v1/';
const API_KEY = "live_8dst4XpWgz7IYKioNGuyEKnFWToGoUD4EBvZu4KXXvPSsQzUMvUO6L8AlJodmy6m";
const ENDPOINT_SEARCH = 'images/search';
const QP_RANDOM = '?limit=1';
const API_RANDOM = `${API_URL}${ENDPOINT_SEARCH}${QP_RANDOM}`;

//URL de favoritos
const ENDPOINT_FAVORITES = 'favourites';
const QP_FAV = '?limit=100';
const API_FAV = `${API_URL}${ENDPOINT_FAVORITES}${QP_FAV}`;

// URL de delete
const API_DELET = (id) => `${API_URL}${ENDPOINT_FAVORITES}/${id}`;

// URL upload
const ENDPOINT_UPLOAD = "images/upload";
const API_UPLOAD = `${API_URL}${ENDPOINT_UPLOAD}`;

const spanError = document.getElementById("error");
/*
 Endpoint -> /images/search
 Query parameters -> ?limit=3 -> significa que tendrá un límite de 3 imagenes de busqueta, el símbolo "&" sirve para poder concatenar otro query.
*/

/* === Llamando a la API con fetch === */
// fetch(URL)
//     .then(resolve => resolve.json()) // Convertir la respuesta a un objeto JSON.
//     .then(data => {
//         const img = document.querySelector("img"); // Manipulación del DOM
//         const imgURL = data[0].url; // URL de la imagen
//         img.src = imgURL;
//     });

/* Llamando a la API con async / await */
async function loadRandomImg() {
    const resolve = await fetch(API_RANDOM); // Petición
    const data = await resolve.json(); // Respuesta convertida a objeto JSON.

    // Validando si hay un error con un condicional.
    if (resolve.status !== 200) {
        // Si el status de la respuesta es otra cosa que no sea 200:
        spanError.innerHTML = "Hubo un error: " + resolve.status;
    } else {
        const img1 = document.getElementById("img-1"); // Manipulación del DOM
        const btnRandom1 = document.getElementById("btnAddFavorite1");
    
        img1.src = data[0].url; // URL de la imagen

        // Llamando el evento onclick del boton para que llame a la función y tomé como parámetro el id de cada imagen.
        btnRandom1.onclick = () => saveFavoritesImg(data[0].id);
    };
};

// Creando una función donde poder cargar las fotos favoritas:
async function loadFavoritesImg() {
    const resolve = await fetch(API_FAV, {
        method: "GET",
        headers: {
            // Agregando la api_key con un header de autorización
            "X-API-KEY": API_KEY,
        }
    });
    const data = await resolve.json();

    if (resolve.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + data.message;
    } else {
        const section = document.getElementById("favoritesImg");
        const div = document.getElementById("gallery-container");
        div.innerHTML = ""; // Borrando todo para que no se dupliquen las imagenes.

        data.forEach(element => {
            // Manipulación del DOM de la sección de favoritos
            const article = document.createElement("article");
            const img = document.createElement("img");
            const btn = document.createElement("button");
            const btnText = document.createTextNode("Eliminar de favoritos");

            btn.appendChild(btnText); // Texto dentro del boton.
            btn.onclick = () => deleteFavoriteImg(element.id); // Función de borrar una imagen de favoritos.
            img.src = element.image.url; // Agregando la url al src de la imagen.
            article.appendChild(img); // img dentro del article
            article.appendChild(btn); // boton dentro del article

            div.appendChild(article); // article dentro del section
        });

        const p = document.getElementById("text");
        if (data.length !== 0) {
            p.innerHTML = "";
        } else {
            p.innerHTML = "Escoge o sube tus imágenes favoritas.";
        }
    }
};

// Creando una función asincrona para guardar nuestras imagenes en favoritos:
async function saveFavoritesImg(id) {
    const resolve = await api.post("favourites", {
        image_id: id,
    })

    // const resolve = await fetch(API_FAV, {
    //     method: "POST",
    //     headers: {
    //         "X-API-KEY": API_KEY,
    //         "Content-Type": "application/json" // Lenguaje al que se le va a hablar al backend
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     }),
    // });

    // const data = await resolve.json();

    /* Usando axios en vez de fetch */

    if (resolve.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + data.message;
    } else {
        console.log("Imágen guardada en favoritos");
        loadFavoritesImg(); // Volviendo a llamar la función de carga para que al momento de elegir una imagen como fav se actualice.
    }

    // Eliminar imagen preliminar al momento de subir la imágen
    const img = document.getElementById("img-photo");
    const input = document.getElementById("file");
    img.src = "";
    input.value = "";
}

// Función para eliminar una imagen de la sección de favoritos
async function deleteFavoriteImg(id) {
    const resolve = await fetch(API_DELET(id), {
        method: "DELETE",
        headers: {
            "X-API-KEY": API_KEY,
        }
    });

    if (resolve.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + data.message;
    } else {
        loadFavoritesImg();
        console.log("Imágen eliminada de favoritos");
    }
}

// Función para subir una imágen
async function upLoadImg() {
    const form = document.getElementById("uploadingForm");
    // Instancia del prototipo FormData
    const formData = new FormData(form);

    console.log(formData.get("file"));

    const resolve = await fetch(API_UPLOAD, {
        method: "POST",
        headers: {
            // "Content-Type": "multipart/form-data"
            "X-API-KEY": API_KEY,
        },
        body: formData, // fetch es tan inteligente que si se le agrega un formData (instancia del prototipo FormData) al body, automáticamente pone el "Content-Type", en el header.
    });

    const data = await resolve.json();

    if (resolve.status !== 201) {
        spanError.innerText = "Hubo un error: " + data.message;
    } else {
        saveFavoritesImg(data.id)
    }
}

// Función para tener una vista preliminar de una imagen antes de guardarla
let vistaPreliminar = (event) => {
    // Creando una instancia del objeto FileReader
    let leer_img = new FileReader();
    let id_img = document.getElementById("img-photo");

    // Uso de la propiedad onload del objeto FileReader
    leer_img.onload = () => {
        if (leer_img.readyState == 2) {
            // Si el archivo a sido cargado, mandar al atributo del elemento img la dirección
            id_img.src = leer_img.result;
        };
    };

    leer_img.readAsDataURL(event.target.files[0]);

};

loadRandomImg(); // Llamando la función para que aparezca una imagen apenas se termine de cargar el archivo de JS.
loadFavoritesImg();


