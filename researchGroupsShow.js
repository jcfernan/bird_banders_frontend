rgsURL = 'http://localhost:3000/research_groups'
fetch(rgsURL)
.then(parseJSON)
.then(displayGroups)

function parseJSON(response){
return response.json()
}

function displayGroups(groups){
    groups.forEach(group => {
        displayGroup(group);
    });
}

function displayGroup(group){
    const getList = document.querySelector('#research-list')
    const divForGroup = document.createElement('ul')
    divForGroup.id = group.name

    getList.append(divForGroup)

    const joinButton = document.createElement('button')
    joinButton.textContent = "Join this group"

    const groupItem = document.createElement('li');
    groupItem.innerHTML = `<a href=research_group.html?id=${group.id}>${group.name}</a>`
    divForGroup.append(groupItem)

    const ul = document.createElement('ul')
    divForGroup.append(ul, joinButton)

    displayUsers(group.memberships, ul)

}

function displayUsers(members, ul){
    
    members.forEach(member => {
        const memberName = member.user.name
        const memberListItem = document.createElement('li');
        // memberListItem.innerHTML = memberName
        console.log('member', member.user.id);
        
        memberListItem.innerHTML = `<a href=userShow.html?id=${member.user.id}>${memberName}</a>`

        ul.append(memberListItem)
    });
    
}