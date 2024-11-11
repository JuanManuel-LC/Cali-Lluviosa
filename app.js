// const options = {
//     method: "GET",
//     $limit: 5000,
//     $$app_token: "SU APPTOKEN AQUÍ",
// };

let dataList;
let nombresEstaciones = new Set();
let listaOpcionesFiltros;
let valorSeleccionado;

function fecthFiltrado(valorFiltro = "") {
    let url = "https://www.datos.gov.co/resource/avya-p282.json";

    if (valorFiltro) {
        let filtrarValores = encodeURIComponent(valorFiltro);
        url += `?&nombre_estacion=${filtrarValores}`;
    }

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
            }
            return response.json();
        })

        .then((data) => {
            renderDatos(data);
        })

        .catch((error) => {
            console.error("Error en la petición:", error);
        });
}

function renderDatos(data) {
    // Etiqueta lista
    dataList = document.getElementById("data-list");
    // Estiqueta select
    listaOpcionesFiltros = document.getElementById("lista-opciones-filtros");

    // Funcion para organizar los opcines de la etiqueta select
    OpcionesSelect(data);

    console.log(Array.from(nombresEstaciones));

    // Recorre cada elemento en los datos y agrégalo al contenedor
    data.forEach((item) => {
        listItem = document.createElement("li");
        listItem.classList.add("item_lista");
        // listItem.textContent = `Registro: ${JSON.stringify(item)}`; // Muestra cada registro como un string
        listItem.innerHTML = `
        <p class="titulo-item">${item.nombre_estacion}</p>
                <p class="fecha-item">Fecha: ${item.fecha} </p> 
                <p class="codigo-estacion-item">Código Estación: ${item.codigo_estacion}</p> 
                <p class="coorX-item">Coordenada X: ${item.coordenada_x}</p>  
                <p id="mitad2" class="coorY-item">Coordenada Y: ${item.coordenada_y}</p>  
                <p class="parametro-item">Parámetro: ${item.parametro_tipo}</p> 
                <p class="valor-item">Valor: ${item.valor}</p>
                <p class="unidad-item">Unidad de Medida: ${item.unidad_de_medida}</p> 
            `;

        dataList.appendChild(listItem);
    });
    console.log(dataList);
}

function OpcionesSelect(data) {
    valorSeleccionado = listaOpcionesFiltros.value;

    // Gaurda los nombres de la estaciones sin repetirlos
    data.forEach((item) => {
        if (item.nombre_estacion) {
            nombresEstaciones.add(item.nombre_estacion);
        }
    });

    listaOpcionesFiltros.innerHTML = ``;
    listaOpcionesFiltros.innerHTML += `<option value="">Todos</option>`;
    nombresEstaciones.forEach((estacion) => {
        let opcion = document.createElement("option");
        opcion.value = estacion;
        opcion.text = estacion;
        listaOpcionesFiltros.appendChild(opcion);
    });

    listaOpcionesFiltros.value = valorSeleccionado;
}

// Evento de filtrado
document.getElementById("filter-button").addEventListener("click", () => {
    valorFiltro = document.getElementById("lista-opciones-filtros").value;
    borrarLista();
    fecthFiltrado(valorFiltro); // Llama a la función con el filtro ingresado (o vacío)
});

document.getElementById("limpiar-filtro").addEventListener("click", () => {
    // Hace que al momento de limpiar el filtro, el valor del select vuelva a ser "Todos"
    listaOpcionesFiltros.value = listaOpcionesFiltros.firstChild.value;
    borrarLista();
    fecthFiltrado();
});

function borrarLista() {
    while (dataList.firstChild) {
        dataList.removeChild(dataList.firstChild); // Elimina el primer hijo hasta que no quede ninguno
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fecthFiltrado(); // Llama a la función sin filtros inicialmente
});
