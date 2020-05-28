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
    ul.className = group.id
    divForGroup.append(ul, joinButton)

    displayUsers(group.memberships, ul, group.id)

}

function displayUsers(members, ul, groupName){
    
    members.forEach(member => {
        const memberName = member.user.name
        const memberListItem = document.createElement('li');
        //memberListItem.className = groupName
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
                
                if (response[i].user_id == localStorage.user_id){
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
        if (response){
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
                getGroupDivForRender.append(newJoin)
                
            }
        }
    }

}