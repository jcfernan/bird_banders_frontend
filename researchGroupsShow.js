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

    let nextTab = $('#tabs li').length+1;
    const userListContainer = document.createElement('div')
    userListContainer.id = "user-list-container"
	
    // create the tab
    $('<li><a href="#tab'+nextTab+'" class="group-tabs" data-toggle="tab">'+group.name+'</a></li>').appendTo('#tabs');
    
    // create the tab content
    $('<div class="tab-pane" id="tab'+nextTab+'"></div>').appendTo('.tab-content');

    // append ol to tab-pane class

    const tabIdFinder = "#tab" + nextTab

    $('<ol class="groups-ol" id="groupid-'+group.id+'"></ol>').appendTo(tabIdFinder);

    const olIdFinder = `groupid-${group.id}`

    const findGroupOl = document.getElementById(olIdFinder)

    //set tab to active
    $('#tabs a:first').tab('show');

    

    const getList = document.querySelector('#research-list')
    const divForGroup = document.createElement('ul')
    divForGroup.className = "research-list-name-ul"
    divForGroup.id = `group-id-${group.id}`

    getList.append(divForGroup)

    const joinButton = document.createElement('button')
    joinButton.id = `button-group-id-${group.id}`
    joinButton.textContent = "Join this group"

    joinButton.addEventListener('click', handleJoinGroup)

    const groupItem = document.createElement('li');
    groupItem.innerHTML = `<a href=research_group.html?id=${group.id}>${group.name}</a>`
    divForGroup.append(groupItem)

    const ul = document.createElement('ul')
    // ul.className = group.id
    ul.className = "please-do-grid"
    
    divForGroup.append(ul, joinButton)

    //userListContainer.append(divForGroup)
    
    findGroupOl.append(divForGroup)
    
    displayUsers(group.memberships, ul, group.id)

}

function displayUsers(members, ul, groupName){
    
    members.forEach(member => {
        const memberName = member.user.name
        const memberListItem = document.createElement('li');
        memberListItem.className = "grid-order"
        // console.log('member', member.user.id);
        
        memberListItem.innerHTML = `<a href=userShow.html?id=${member.user.id}>${memberName}</a>`

        ul.append(memberListItem)
    });
    
}

function handleJoinGroup(event){
    
    const authHeaders = {
        Authorization: `bearer ${localStorage.token}`
    }
    // console.log('token', localStorage.user_id);
    // console.log('event', event.target.id.slice(-1));

    const groupId = event.target.id.slice(-1)

    //event.target.remove()

    saveNewMembershipToDB(groupId, event)
    
}

function saveNewMembershipToDB(groupId, event){

    // console.log('groupid', groupId);
    
    

    membershipsURL = 'http://localhost:3000/memberships'

    fetch(membershipsURL)
    .then(parseJSON)
    .then(checkIfExists)
    .then(saveToDB)
    
    function parseJSON(response){
    return response.json()
    }

    function checkIfExists(response){
        let inGroup = false;
        for (let i = 0; i < response.length; i++){
            if (response[i].research_group_id == groupId){
                console.log('inside for if ');
                console.log('reponse[i]userid', response[i].user_id);
                console.log('localstorage', localStorage.user_id);
                
                if (localStorage.token && response[i].user_id == localStorage.user_id){
                    console.log('You are already part of this group');

                    const checkForMessage = document.getElementById('already-message')
                    if (checkForMessage){
                        checkForMessage.remove()
                    }

                    const alreadyPartMessage = document.createElement('p')
                    alreadyPartMessage.id = "already-message"
                    alreadyPartMessage.textContent = 'You are already part of this group.'

                    function insertAfter(referenceNode, newNode) {
                        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                      }

                    insertAfter(event.target, alreadyPartMessage)
                    
                    inGroup = true;
                    response = null
                    return response
                }
            }
        }
        if (!inGroup) {
            console.log('You are not part of this group');
            return response
        }
    }
    function saveToDB(response){

        membershipsURL = 'http://localhost:3000/memberships'

        const newMembership = {
            membership: {
                user_id: localStorage.user_id,
                research_group_id: groupId
            }
        }

        console.log('newmembership var', newMembership);
        if (response && localStorage.token){
            fetch(
                membershipsURL, 
                {
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(newMembership)
                })
                .then(parseJSON)
                .then(renderOnPage)

            function renderOnPage(response){
                const selectorItem = newMembership.membership.research_group_id
                const getGroupDivForRender = document.getElementsByClassName(selectorItem)[0]
                console.log('getgroupdivforrender', getGroupDivForRender);
                const newJoin = document.createElement('li')
                newJoin.innerHTML = `<a href=userShow.html?id=${newMembership.membership.user_id}>${localStorage.username}</a>`
                const getUlGrid = document.querySelector('.please-do-grid')
                console.log('getulgrid', getUlGrid);
                
                getUlGrid.append(newJoin)
                
            }
        }
    }

}

const logoutButton = document.querySelector('.login-button')

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

setIsLoggedIn()

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem('username')
}

logoutButton.addEventListener("click", ()=>{
    logout()
    setIsLoggedIn()
})