console.log('Hello from upload data JS script');

URL = 'http://localhost:3000/bird_captures'
fetch(URL)
.then(parseJSON)
.then()

function parseJSON(response){
return response.json()
}
