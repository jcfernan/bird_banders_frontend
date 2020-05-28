console.log('Hello from research group page');

// const getUserslist = document.querySelector('#group-members-list-ul')
// const getBirdslist = document.querySelector('#birds-list-ul')
// const getCaptureslist = document.querySelector('#captures-list-ul')


group_query = new URLSearchParams(window.location.search)
rgId = group_query.get('id')
console.log('id: ', rgId);


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
        console.log('hi from find birds');
        
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
        console.log('birdarray', birdArray);
        console.log('birdarray uniq', birdArrayUniq);

        birdArrayUniq.forEach(bird => {
            const birdOfGroup = document.createElement('li')
            birdOfGroup.innerHTML = `<a href=birdShow.html?id=${bird.id}>${bird.bandId}</a>`
            const getBirdslist = document.querySelector('#birds-list-ul')
            console.log('getBirdlist', getBirdslist);
            getBirdslist.append(birdOfGroup)
        });
        return memberships
    }
    function findCapturesOfThisGroup(memberships){
        console.log('hi from find captures');
        
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
        console.log('capturearray', captureArray);
        console.log('capturearray uniq', captureArrayUniq);

        captureArrayUniq.forEach(capture => {
            const captureOfGroup = document.createElement('li')
            captureOfGroup.innerHTML = `<a href=captureShow.html?id=${capture.id}>Capture #: ${capture.id}</a>`
            const getCaptureslist = document.querySelector('#captures-list-ul')
            console.log('getCaptureslist', getCaptureslist);
            getCaptureslist.append(captureOfGroup)
        });
        return memberships
    }
}