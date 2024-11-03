fetch('https://7uzjkl1dj0-dsn.algolia.net/1/indexes/products_prod_4315_es/query?x-algolia-application-id=7UZJKL1DJ0&x-algolia-api-key=9d8f2e39e90df472b4f2e559a116fe17', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        params: 'query=nuggets&clickAnalytics=true&analyticsTags=["web"]&getRankingInfo=true'
    })
})
.then(response => response.json())
.then(data => {
    console.log(data);
    
    const productos = data.hits; // Asegúrate de que data.hits esté disponible aquí
    console.log(productos);

    let i = 0;
    productos.forEach(producto => {
        if (i < 5) {
            console.log('ID:', producto.objectID); // Cambié `id` a `objectID` si es que la propiedad se llama así
            console.log('Nombre:', producto.display_name);
            console.log('Marca:', producto.brand);
            console.log('Precio:', producto.price_instructions.unit_price);
            console.log('Imagen:', producto.thumbnail);
            i++;
        } else {
            return;
        }
    });
})
.catch(error => console.error('Error:', error));
