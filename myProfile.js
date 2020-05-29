console.log('Hello from my profile page');
const logoutButton = document.getElementById('loginbutton')
const authHeaders = {
    Authorization: `bearer ${localStorage.token}`
}

guardPage()

function guardPage(){
    if (!localStorage.getItem("token")) {
        window.location.href = "/"
        window.alert("Please log in to see your profile");
    }
}

setIsLoggedIn()
function setIsLoggedIn(){
    console.log('token', localStorage.getItem("token"));

    if (localStorage.token){
        logoutButton.textContent = `(${localStorage.username}) logout`
    }
    else {
        logoutButton.textContent = "login"
    }
    
    // isLoggedIn.textContent = localStorage.getItem("token")
    // ? `Hello, ${localStorage.getItem('username')}, you are logged in`
    // : "You are not logged in"
}

fetch("http://localhost:3000/secret-profiles", {
    headers: authHeaders
})
    .then(parseJSON)
    .then(displayUserInfo)

function parseJSON(response){
    return response.json()
}

function displayUserInfo(response){
    const userInfoContainer = document.querySelector('#user-info-container')
    const usernameDisplay = document.createElement('p')
    usernameDisplay.textContent = `My username: ${response.data.username}`

    const nameDisplay = document.createElement('p')
    nameDisplay.textContent = `My name: ${response.data.name}`

    const emailDisplay = document.createElement('p')
    emailDisplay.textContent = `My email: ${response.data.email}`

    userInfoContainer.append(usernameDisplay, nameDisplay, emailDisplay)
    
    displayMyGroups(response)

    return response
}
function displayMyGroups(response){
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

                if (membership.user_id == response.data.id){
                    const groupList = displayGroupNameAndCreateContainer(group, userGroupsDiv)
                    displayBirdCaptures(membership, groupList)
                }
            });
        });
        if (userGroupsDiv.children.length < 2){
            const notPartOfGroup = document.createElement('p')
            notPartOfGroup.textContent = "You currently do not  belong to any groups."
            userGroupsDiv.append(notPartOfGroup)
        }
    }

    function createGroupsContainer(){
        const userGroupsDiv = document.createElement('div')
        const getWebPage = document.querySelector('.webpage')
        // document.body.append(userGroupsDiv)
        getWebPage.append(userGroupsDiv)
        return userGroupsDiv
    }

    function createGroupsTitle(userGroupsDiv){
        const UserGroupsList = document.createElement('h3')
        UserGroupsList.textContent = "Groups you are a part of: "
        userGroupsDiv.append(UserGroupsList)
    }

    function displayGroupNameAndCreateContainer(group, userGroupsDiv){
        const groupName = document.createElement('h4')
        groupName.innerHTML = `<a href=research_group.html?id=${group.id}>${group.name}</a>`
        const groupList = document.createElement('ul')
        groupList.id = `group-${group.id}`

        // const leaveGroupButton = document.createElement('button')
        // leaveGroupButton.value = group.id
        // leaveGroupButton.textContent = "Leave group"

        // leaveGroupButton.addEventListener("click", handleLeaveGroup)
        // function handleLeaveGroup(event, groupId){
        //     console.log('clicked leave group', event.target.value);

        //     const groupId2 = event.target.value
        //     const user_id = localStorage.user_id
            
            
            
            
                        
        // }
        
        const birdCapTitle = document.createElement('p')
        birdCapTitle.textContent = "Bird entries I've submitted to this group:"

        userGroupsDiv.append(groupName, birdCapTitle, groupList)
        return groupList
    }

    function displayBirdCaptures(membership, groupList){
        const usersCaptures = membership.bird_captures

        usersCaptures.forEach(capture => {
            const captureListElement = document.createElement('li')
            captureListElement.textContent = `Bird capture info: ${capture.id}`
            groupList.append(captureListElement)
        });
        if (usersCaptures < 1){
            const captureListMessage = document.createElement('li')
            captureListMessage.textContent = "You currently do not have any data entries for this group."
            groupList.append(captureListMessage)
        }
    }
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem('username')
}

logoutButton.addEventListener("click", ()=>{
    logout()
    setIsLoggedIn()
})