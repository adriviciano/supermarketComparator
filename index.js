import { compararProductos } from './comparator.js';

const listaCompra = {
    mercadona: [],
    dia: []
};

// Función para mostrar los productos en el HTML
function mostrarResultados(productos) {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "<h2>Resultados ordenados por precio:</h2>";
    
    productos.forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.innerHTML = `
            <h3><strong>Nombre:</strong> ${producto.nombre}</h3>    
            <h4><strong>Supermercado:</strong> ${producto.supermercado}</h4>
            <p><strong>Precio:</strong> ${producto.precio_unitario}</p>
            <p><strong>Precio por unidad:</strong> ${producto.precio_por_unidad}</p>
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100px; height: auto;">
            <button class="add-to-cart-btn">Añadir a la lista de la compra</button>
            <hr>
        `;
        
        resultadosDiv.appendChild(productoDiv);

        // Asignar el evento al botón dentro del bucle
        const btn = productoDiv.querySelector(".add-to-cart-btn");
        btn.addEventListener("click", () => agregarAListaCompra(producto));
    });
}

function agregarAListaCompra(producto) {
    const supermercado = producto.supermercado.toLowerCase();
    if (supermercado === "mercadona" || supermercado === "dia") {
        listaCompra[supermercado].push(producto);
        alert(`${producto.nombre} ha sido añadido a la lista de la compra en ${supermercado}.`);
    } else {
        alert("Supermercado no reconocido.");
    }
}

document.getElementById("buscarBtn").addEventListener("click", async () => {
    const nombreProducto = document.getElementById("nombreProducto").value;
    const productosOrdenados = await compararProductos(nombreProducto);
    mostrarResultados(productosOrdenados);
});

document.getElementById("verListaBtn").addEventListener("click", mostrarListaCompra);

function mostrarListaCompra() {
    const listaCompraDiv = document.getElementById("listaCompraDiv");
    listaCompraDiv.innerHTML = "<h2>Lista de la compra:</h2>";

    let totalMercadona = 0;
    let totalDia = 0;

    // Mostrar lista Mercadona
    if (listaCompra.mercadona.length > 0) {
        listaCompraDiv.innerHTML += "<h3>Lista de la compra Mercadona:</h3>";
        listaCompra.mercadona.forEach(producto => {
            listaCompraDiv.innerHTML += `
                <p><strong>${producto.nombre}</strong> - ${producto.precio_unitario} 
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></p>
            `;
            totalMercadona += parseFloat(producto.precio_unitario.replace(',', '.').replace(' €', ''));
        });
        listaCompraDiv.innerHTML += `<p><strong>Total Mercadona:</strong> ${totalMercadona.toFixed(2)} €</p>`;
    } else {
        listaCompraDiv.innerHTML += "<p>No hay productos en la lista de la compra en Mercadona.</p>";
    }

    // Mostrar lista Dia
    if (listaCompra.dia.length > 0) {
        listaCompraDiv.innerHTML += "<h3>Lista de la compra Dia:</h3>";
        listaCompra.dia.forEach(producto => {
            listaCompraDiv.innerHTML += `
                <p><strong>${producto.nombre}</strong> - ${producto.precio_unitario} 
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></p>
            `;
            totalDia += parseFloat(producto.precio_unitario.replace(',', '.').replace(' €', ''));
        });
        listaCompraDiv.innerHTML += `<p><strong>Total Dia:</strong> ${totalDia.toFixed(2)} €</p>`;
    } else {
        listaCompraDiv.innerHTML += "<p>No hay productos en la lista de la compra en Dia.</p>";
    }

    // Mostrar total general
    const totalGeneral = totalMercadona + totalDia;
    listaCompraDiv.innerHTML += `<h3>Total general de la compra: ${totalGeneral.toFixed(2)} €</h3>`;
}

function guardarListaComoImagen() {
    const listaCompraDiv = document.getElementById("listaCompraDiv");

    // Verifica que el div no esté vacío
    if (listaCompraDiv.innerHTML.trim() === "") {
        alert("No hay contenido en la lista de la compra para guardar.");
        return;
    }
    

    // Captura el contenido del div y genera la imagen
    html2canvas(listaCompraDiv, { scale: 3 }).then(canvas => { // Puedes ajustar el scale para mejorar la calidad de la imagen
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = 'lista_de_la_compra.png';
        link.click();
    }).catch(error => {
        console.error("Error al capturar la lista de la compra:", error);
    });
}


// Asignar evento al botón de guardar lista
document.getElementById("guardarListaBtn").addEventListener("click", guardarListaComoImagen);
