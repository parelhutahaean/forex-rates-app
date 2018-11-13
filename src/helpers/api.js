function getData(url = ``) {
    return fetch(url, {
        method: "GET",
    })
    .then(response => response.json()); // parses response to JSON
}

export default getData;
