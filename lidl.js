const url = 'https://lidl.p.rapidapi.com/searchByKeyword?keyword=leche&sort=lowPrice&country=fr';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '3776f5f333msh75c7b71b653a94dp1866aejsn1b459b4de9f6',
        'x-rapidapi-host': 'lidl.p.rapidapi.com'
    }
};

// Define una función async
async function fetchData() {
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

// Llama a la función
fetchData();
