console.log('Hello from home page');

rgsURL = 'http://localhost:3000/research_groups'
fetch(rgsURL)
.then(parseJSON)
// .then(displayGroups)

function parseJSON(response){
return response.json()
}

// function displayGroups(groups){
//     groups.forEach(group => {
//         displayGroup(group);
//     });
// }

// function displayGroup(group){
//     const groupItem = document.createElement('li');
//     groupItem.innerHTML = `<a href=research_group.html?id=${group.id}>${group.name}</a>`

//     const getList = document.querySelector('#research-list')

//     getList.append(groupItem)
    
// }