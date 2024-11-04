// mercadona.js

export async function cargarProductosMercadona(nombreProducto) {
    try {
        const response = await fetch('https://7uzjkl1dj0-dsn.algolia.net/1/indexes/products_prod_4315_es/query?x-algolia-application-id=7UZJKL1DJ0&x-algolia-api-key=9d8f2e39e90df472b4f2e559a116fe17', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                params: `query=${nombreProducto}&clickAnalytics=true&analyticsTags=["web"]&getRankingInfo=true`
            })
        });
        
        const data = await response.json();
        return data.hits.map(producto => ({
            categoria: producto.categories[0].name,
            nombre: producto.display_name,
            precio_unitario: producto.price_instructions.unit_price + " €",
            precio_por_unidad: "(" + producto.price_instructions.reference_price + " €/" + producto.price_instructions.reference_format + ")",
            imagen: producto.thumbnail
        }));
            
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}
