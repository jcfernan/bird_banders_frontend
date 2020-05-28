console.log('Hello from research group page');

group_query = new URLSearchParams(window.location.search)
rgId = group_query.get('id')
// console.log('id: ', rgId);

rgURL = `http://localhost:3000/research_groups/${rgId}`
fetch(rgURL)
.then(parseJSON)
.then(displayGroupName)
.then(getMembers)

function parseJSON(response){
return response.json()
}

function displayGroupName(group){
    const groupTitle = document.createElement('h2');
    groupTitle.textContent = group.name

    const getTitleDiv = document.getElementById('title-div')
    getTitleDiv.append(groupTitle)
    return group
}

function getMembers(group){
    membershipsURL = 'http://localhost:3000/memberships'
    fetch(membershipsURL)
    .then(parseJSON)
    .then(findMembersOfThisGroup)
    .then(findBirdsOfThisGroup)
    .then(findCapturesOfThisGroup)
    .then(createJoinButton)
    
    function findMembersOfThisGroup(memberships){
        memberships.forEach(membership => {
            if (membership.research_group_id == group.id){
                const userOfGroup = document.createElement('li')
                userOfGroup.innerHTML = `<a href=userShow.html?id=${membership.user_id}>${membership.user.username}</a>`
                const getUserslist = document.querySelector('#group-members-list-ul')
                getUserslist.append(userOfGroup)
            }
        });
        return memberships
    }
    function findBirdsOfThisGroup(memberships){
        // console.log('hi from find birds');
        
        let birdArray = []

        memberships.forEach(membership => {
            if (membership.research_group_id == group.id){
                const birdCaptures = membership.bird_captures
                birdCaptures.forEach(birdcapture => {
                    birdArray.push(birdcapture.bird)
                    
                });

            

            }
        });
        const birdArrayUniq = [];
        const map = new Map();
        for (const item of birdArray){
            if(!map.has(item.id)){
                map.set(item.id, true);
                birdArrayUniq.push({
                    id: item.id,
                    bandId: item.bandId,
                    species: item.species
                });
            }
        }
        // console.log('birdarray', birdArray);
        // console.log('birdarray uniq', birdArrayUniq);

        birdArrayUniq.forEach(bird => {
            const birdOfGroup = document.createElement('li')
            birdOfGroup.innerHTML = `<a href=birdShow.html?id=${bird.id}>${bird.bandId}</a>`
            //const getBirdslist = document.querySelector('#birds-list-ul')
            const getBirdslist = document.getElementById('birds-list')
            console.log('getbirdslist', getBirdslist);
            
            // console.log('getBirdlist', getBirdslist);
            getBirdslist.append(birdOfGroup)
        });
        return memberships
    }
    function findCapturesOfThisGroup(memberships){
        // console.log('hi from find captures');
        
        let captureArray = []

        memberships.forEach(membership => {
            if (membership.research_group_id == group.id){
                const birdCaptures = membership.bird_captures
                birdCaptures.forEach(birdcapture => {
                    captureArray.push(birdcapture.capture)
                    
                });
            }
        });
        const captureArrayUniq = [];
        const map = new Map();
        for (const item of captureArray){
            if(!map.has(item.id)){
                map.set(item.id, true);
                captureArrayUniq.push({
                    id: item.id,
                    gender: item.gender, 
                    age: item.age, 
                    location: item.location
                });
            }
        }
        // console.log('capturearray', captureArray);
        // console.log('capturearray uniq', captureArrayUniq);

        captureArrayUniq.forEach(capture => {
            const captureOfGroup = document.createElement('li')
            captureOfGroup.innerHTML = `<a href=captureShow.html?id=${capture.id}>Capture #: ${capture.id}</a>`
            const getCaptureslist = document.getElementById('captures-list')
            // console.log('getCaptureslist', getCaptureslist);
            getCaptureslist.append(captureOfGroup)
        });
        return memberships
    }
    function createJoinButton(memberships){
        const titleDivAgain = document.querySelector('#title-div')
        console.log(titleDivAgain);
        
        const joinButton = document.createElement('button')
        joinButton.id = "join-button"
        joinButton.textContent = "Join Group"
        joinButton.addEventListener("click", handleJoin)
        
        function handleJoin(e){
            
            let partOfGroup = false

            memberships.forEach(membership => {
                const memId = membership.user_id
                if (memId == localStorage.user_id){
                    partOfGroup = true
                }
            });

            if (partOfGroup == false){
                console.log('You can join');
                const userId = localStorage.user_id
                const newMembership = {
                    membership: {
                        user_id: userId,
                        research_group_id: rgId
                    }
                }

                const postMembershipsURL = 'http://localhost:3000/memberships'
                fetch(postMembershipsURL, {
                    method: 'POST',
                    headers: {'content-type':'application/json'},
                    body: JSON.stringify(newMembership.membership)
                })
                .then(renderSave)
                
                function renderSave(repsonse){
                    console.log('saved to db:', repsonse);
                    const getUserslist2 = document.querySelector('#group-members-list-ul')
                    const newUserRender = document.createElement('li')
                    newUserRender.innerHTML = `<a href=userShow.html?id=${newMembership.membership.user_id}>${localStorage.username}</a>`
                    getUserslist2.append(newUserRender)

                    const alreadyMessageChecker = document.getElementById('already-message')
                    if (alreadyMessageChecker){
                        alreadyMessageChecker.remove()
                    }

                    const alreadyMessage = document.createElement('p')
                    alreadyMessage.id = "already-message"
                    alreadyMessage.textContent = 'You have successfully joined this group!'
                    titleDivAgain.append(alreadyMessage)
                    return
                }

            }
            else {
                console.log('You are already part of this group!', );
                const alreadyMessageChecker = document.getElementById('already-message')
                if (alreadyMessageChecker){
                    alreadyMessageChecker.remove()
                }
                const alreadyMessage2 = document.createElement('p')
                alreadyMessage2.id = "already-message"
                alreadyMessage2.textContent = 'You are already part of this group!'

                titleDivAgain.append(alreadyMessage2)
            }
            
        }

        titleDivAgain.append(joinButton)
    }
}

