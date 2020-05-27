const authHeaders = {
    Authorization: `bearer ${localStorage.token}`
}

guardPage()

function parseJSON(response){
    return response.json()
}

window.addEventListener('DOMContentLoaded', (event) => {
    const captureForm = document.querySelector('#create-capture-form')
    captureForm.addEventListener('submit', handleCaptureSubmit)

    fetchUserId()

    function handleCaptureSubmit(event){
        event.preventDefault()
        console.log('Hello from inside event list');
        
        createCapture(event)

        function createCapture(event){
            event.preventDefault();
            console.log('1. Hello from inside the create bird capture');
            
            const formData = new FormData(captureForm)        
            const newGender = formData.get('gender')
            const newAge = formData.get('age')
            const newLocation = formData.get('location')
        
            const newCapture = {
                capture: {
                    gender: newGender,
                    age: newAge,
                    location: newLocation
                }}


            saveCaptureToDB(newCapture)
            function saveCaptureToDB(newCapture){
                console.log('hello from inside save capture');
                console.log("New capture: ", newCapture)

                capturesURL = 'http://localhost:3000/captures'
                function parseJSON(response){
                    return response.json()
                }
                fetch(
                    capturesURL, 
                    {
                        method: 'POST',
                        headers: {'content-type': 'application/json'},
                        body: JSON.stringify(newCapture)
                    })
                    .then(parseJSON)
                    .then(createHiddenCapture)
            }

            function createHiddenCapture(capture){
                console.log('capture', capture);
                const hiddenCapture = document.createElement('p')
                hiddenCapture.textContent = `${capture.id}` 
                hiddenCapture.id = "capture-id"
                document.body.append(hiddenCapture)               
            }

            createBirdOrGrabId(event)
            function createBirdOrGrabId(event){
                console.log('2. hello from create or grab bird');

                const formData = new FormData(captureForm)        
                const checkbandId = formData.get('bandId')

                const checkBird = {
                    bird: {
                        bandId: checkbandId
                    }}

                    console.log('checkbird', checkBird.bird.bandId);
                    let bandId = checkBird.bird.bandId

                birdsURL = 'http://localhost:3000/find-by-bandid'
                fetch(birdsURL, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({bandId})
                })
                .then(parseJSON)
                .then(displayBirdResult)

                function parseJSON(response){
                    return response.json()
                }

                function displayBirdResult(bird){
                    if (bird){
                        console.log('Bird exists: ', bird);
                        createBirdCapture(bird)
                    }
                    else {
                        console.log('Bird does not exist, please enter the species');
                    }
                    
                }

                function createBirdCapture(bird){
                    console.log('3. hey from create bird capture');
                    console.log('bird_id', bird.id);
                    console.log('membership_id');
                    const birdId = bird.id
                    function getmembershipId(){
                        const getCurrentOption = document.getElementById('research-group-select')
                        console.log('current option', getCurrentOption.value);
                        const optionValue = getCurrentOption.value
                        
                        return parseInt(optionValue)
                    }

                    function getCaptureIDFromDom(){
                        const getCaptureId = document.getElementById('capture-id')
                        console.log('getcaptureid', getCaptureId);
                        
                        const CaptureIdNum = parseInt(getCaptureId.textContent)
                        console.log('capture', CaptureIdNum);
                        return CaptureIdNum
                    }

                    const captureId = getCaptureIDFromDom()
                    const membershipId = getmembershipId()
                    console.log('capture id:', captureId);
                    console.log('membership_id', membershipId);
                    
                    const newBirdCapture = {
                        birdCapture: {
                            membership_id: membershipId,
                            bird_id: birdId,
                            capture_id: captureId
                        }
                    }
                    
                    console.log('bird capture object: ', newBirdCapture);
                    birdCapsUrl = `http://localhost:3000/bird_captures`
                    fetch(birdCapsUrl, {
                        method: 'POST',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(newBirdCapture)
                    })
                    .then(parseJSON)
                    .then(displayCreatedBirdCapture)

                    function displayCreatedBirdCapture(response){
                        console.log('reponse:', response);
                        
                    }
                    
                }
            }

        }

    }


});

function guardPage(){
    if (!localStorage.getItem("token")) {
        window.location.href = "/"
        window.alert("Please log in to upload data");
    }
}
function fetchUserId(){    
    fetch("http://localhost:3000/secret-profiles", {
        headers: authHeaders
    })
        .then(parseJSON)
        .then(fetchUsersGroups)
}
function fetchUsersGroups(response){
    const getGroupSelect = document.querySelector('#research-group-select')
    createGroupOptions(response, getGroupSelect)
}

function createGroupOptions(response, getGroupSelect){
    if (response.memberships == 0){
        console.log('You do not belong to any groups, please join a group before uploading data');
        const getGroupSelect = document.getElementById('research-group-select')
        const listOption = document.createElement('option')
        listOption.value = null
        listOption.innerHTML = "Please join a research group before contributing data"
        getGroupSelect.append(listOption)
        document.getElementById("capture-form").disabled = true;

    }
    else {
        document.getElementById("capture-form").disabled = false;
        const usersMemberships = response.memberships
        const researchGroupsList = response.researchGroups
        usersMemberships.forEach(membership => {
            researchGroupsList.forEach(group => {
                if (membership.research_group_id == group.id){
                    const getGroupSelect = document.getElementById('research-group-select')
                    const listOption = document.createElement('option')
                    // listOption.value = group.id
                    listOption.value = membership.id
                    listOption.innerHTML = group.name
                    getGroupSelect.append(listOption)
                }
            });
        });
    }
}

