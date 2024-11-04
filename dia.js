// dia.js

// Función para buscar productos por nombre
export function buscarProductosPorNombre(productos, palabra) {
    const palabraLower = palabra.toLowerCase();
    return productos.filter(producto => 
        producto.nombre.toLowerCase().includes(palabraLower)
    );
}


// Cargar el JSON desde el archivo
export async function cargarProductosDia(palabraBuscada) {
    try {
        const response = await fetch('productos_dia.json'); // Cargar el JSON usando fetch
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }

        const productos = await response.json(); // Parsear el JSON

        return buscarProductosPorNombre(productos, palabraBuscada);

    } catch (err) {
        console.error('Error:', err);
    }
}

