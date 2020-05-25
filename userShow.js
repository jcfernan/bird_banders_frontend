console.log('Hello from user page');

user_query = new URLSearchParams(window.location.search)
userId = user_query.get('id')
console.log('id: ', userId);

userURL = `http://localhost:3000/users/${userId}`
fetch(userURL)
.then(parseJSON)
.then(displayUserInfo)

function parseJSON(response){
return response.json()
}

function displayUserInfo(user){
    const userInfoContainer = document.createElement('div')
    const birdInfoContainer = document.createElement('div')
    const capturesInfoContainer = document.createElement('div')
    const mainHeader = document.createElement('h3')
    mainHeader.textContent = `${user.username}'s page`

    document.body.append(userInfoContainer)
    document.body.append(birdInfoContainer)
    document.body.append(capturesInfoContainer)
    userInfoContainer.append(mainHeader)

    displayName(user, userInfoContainer)
    displayEmail(user, userInfoContainer)
}

function displayName(user, userInfoContainer){
    const theirName = document.createElement('p')
    theirName.textContent = `Name: ${user.name}`
    userInfoContainer.append(theirName)
}

function displayEmail(user, userInfoContainer){
    const theirEmail = document.createElement('p')
    theirEmail.textContent = `Email: ${user.email}`
    userInfoContainer.append(theirEmail)
}

membershipsURL = 'http://localhost:3000/research_groups'
fetch(membershipsURL)
.then(parseJSON)
.then(displayGroups)

function displayGroups(researchGroups){
    
    const userGroupsDiv = createGroupsContainer()
    createGroupsTitle(userGroupsDiv)

    researchGroups.forEach(group => {
        const membershipsArray = group.memberships
        membershipsArray.forEach(membership => {

            if (membership.user_id == userId){
                const groupList = displayGroupNameAndCreateContainer(group, userGroupsDiv)
                displayBirdCaptures(membership, groupList)
            }
        });
    });
}

function createGroupsContainer(){
    const userGroupsDiv = document.createElement('div')
    document.body.append(userGroupsDiv)
    return userGroupsDiv
}

function createGroupsTitle(userGroupsDiv){
    const UserGroupsList = document.createElement('h3')
    UserGroupsList.textContent = "Groups this user is part of: "
    userGroupsDiv.append(UserGroupsList)
}

function displayGroupNameAndCreateContainer(group, userGroupsDiv){
    const groupName = document.createElement('h4')
    groupName.innerHTML = `<a href=research_group.html?id=${group.id}>${group.name}</a>`
    const groupList = document.createElement('ul')
    groupList.id = `group-${group.id}`
    userGroupsDiv.append(groupName, groupList)
    return groupList
}

function displayBirdCaptures(membership, groupList){
    const usersCaptures = membership.bird_captures

    usersCaptures.forEach(capture => {
        const captureListElement = document.createElement('li')
        captureListElement.textContent = `Bird capture info: ${capture.id}`
        groupList.append(captureListElement)
    });
}