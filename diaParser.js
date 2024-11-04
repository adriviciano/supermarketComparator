import fs from 'fs';

// Leer el archivo JSON
fs.readFile('productos_dia.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    try {
        // Parsear el JSON
        const productos = JSON.parse(data);

        // Modificar las unidades
        productos.forEach(producto => {
            if (producto.precio_por_unidad) {
                producto.precio_por_unidad = producto.precio_por_unidad
                    .replace(/UNIDAD/g, 'ud')
                    .replace(/DOCENA/g, 'dc')
                    .replace(/LITRO/g, 'L')
                    .replace(/KILO/g, 'kg');
            }
        });

        // Guardar el archivo modificado
        fs.writeFile('productos_dia_modificado.json', JSON.stringify(productos, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al guardar el archivo:', err);
                return;
            }
            console.log('Archivo modificado guardado como productos_dia_modificado.json');
        });

    } catch (parseError) {
        console.error('Error al parsear el JSON:', parseError);
    }
});
