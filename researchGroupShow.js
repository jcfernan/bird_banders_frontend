console.log('Hello from research group page');

group_query = new URLSearchParams(window.location.search)
rgId = group_query.get('id')
console.log('id: ', rgId);


rgURL = `http://localhost:3000/research_groups/${rgId}`
fetch(rgURL)
.then(parseJSON)
.then(displayGroupName)

function parseJSON(response){
return response.json()
}

function displayGroupName(group){
    const groupTitle = document.createElement('h2');
    groupTitle.textContent = group.name

    const getTitleDiv = document.getElementById('group-title')
    getTitleDiv.append(groupTitle)
}