const authHeaders = {
    Authorization: `bearer ${localStorage.token}`
}

guardPage()

function parseJSON(response){
    return response.json()
}

window.addEventListener('DOMContentLoaded', runProgram)


function runProgram(event){
    const captureForm = document.querySelector('#create-capture-form')
    captureForm.addEventListener('submit', handleCaptureSubmit)

    fetchUserId()

    function handleCaptureSubmit(event){
        event.preventDefault()
        console.log('Hello from inside event list');
        
        createCapture(event)
        function createCapture(event){
            event.preventDefault();
            // console.log('1. Hello from inside the create bird capture');
            
            const formData = new FormData(captureForm)        
            const newGender = formData.get('gender')
            const newAge = formData.get('age')
            const newLocation = formData.get('location')

            if (newGender == "" || newAge == "" || newLocation == ""){
                // console.log('empty fields');
                const getErrorMessage = document.getElementById('error-message')
                if (getErrorMessage){
                    getErrorMessage.remove()
                }
                const errorMessage = document.createElement('p')
                errorMessage.id = "error-message"
                errorMessage.textContent = "Please fill in remaining empty fields and press submit again."
                const getForm = document.getElementById('create-capture-form')
                getForm.prepend(errorMessage)
                return 
            }
        
            const newCapture = {
                capture: {
                    gender: newGender,
                    age: newAge,
                    location: newLocation
                }}


            saveCaptureToDB(newCapture)
            function saveCaptureToDB(newCapture){
                // console.log('hello from inside save capture');
                // console.log("New capture: ", newCapture)

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
                // console.log('capture', capture);
                const hiddenCapture = document.createElement('p')
                hiddenCapture.textContent = `${capture.id}` 
                hiddenCapture.id = "capture-id"
                document.body.append(hiddenCapture)               
            }

            createBirdOrGrabId(event)
            function createBirdOrGrabId(event){
                // console.log('2. hello from create or grab bird');

                const formData = new FormData(captureForm)        
                const checkbandId = formData.get('bandId')

                if (checkbandId == "") {
                    // console.log('empty fields');
                    const getErrorMessage = document.getElementById('error-message')
                    if (getErrorMessage){
                        getErrorMessage.remove()
                    }
                    const getErrorMessage2 = document.getElementById('error-message-two')
                    if (getErrorMessage2){
                        getErrorMessage2.remove()
                    }
                    const errorMessage = document.createElement('p')
                    errorMessage.id = "error-message-two"
                    errorMessage.textContent = "Please fill in remaining empty fields and press submit again."
                    const getForm = document.getElementById('create-capture-form')
                    getForm.prepend(errorMessage)
                    return 
                }

                const checkBird = {
                    bird: {
                        bandId: checkbandId
                    }}

                    // console.log('checkbird', checkBird.bird.bandId);
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
                        // console.log('This appears to be a new bird, please enter the species: ');
                        const newBirdMessage = document.createElement('p')
                        newBirdMessage.id = "new-bird-message"
                        newBirdMessage.textContent = "This appears to be a new bird, please additionally enter the species: "
                        const getForm = document.getElementById('create-capture-form')
                        const getSpeciesDiv = document.getElementById('species-input')

                        const speciesInput = document.createElement('input')
                        speciesInput.id = "species-input-field"
                        speciesInput.placeholder = "species"
                        speciesInput.style.borderColor = "red"
                        speciesInput.name = "species"

                        getSpeciesDiv.append(speciesInput)
                        getForm.prepend(newBirdMessage)
                        
                        const getFormButton = document.getElementById('capture-form')
                        getFormButton.disabled = true
                        //getFormButton.remove()

                        const newFormButton = document.createElement('button')
                        newFormButton.id = "new-form-button"
                        newFormButton.textContent = "Submit Bird Capture"
                        getForm.append(newFormButton)

                        newFormButton.addEventListener('click', handleNewFormButton)

                        function handleNewFormButton(event){
                            event.preventDefault()

                            const formData = new FormData(captureForm)        
                            const newBandId = formData.get('bandId')
                            const newSpecies = formData.get('species')

                            if (newBandId == "" || newSpecies == ""){
                                // console.log('empty fields');
                                const getErrorMessage = document.getElementById('error-message')
                                if (getErrorMessage){
                                    getErrorMessage.remove()
                                }
                                const getErrorMessage2 = document.getElementById('error-message-two')
                                if (getErrorMessage2){
                                    getErrorMessage2.remove()
                                }
                                const getErrorMessage3 = document.getElementById('error-message-three')
                                if (getErrorMessage3){
                                    getErrorMessage3.remove()
                                }
                                const errorMessage = document.createElement('p')
                                errorMessage.id = "error-message-three"
                                errorMessage.textContent = "Please fill in remaining empty fields and press submit again."
                                const getForm = document.getElementById('create-capture-form')
                                getForm.prepend(errorMessage)
                                return 
                            }
            
                            const newBird = {
                                bird: {
                                    bandId: newBandId,
                                    species: newSpecies
                                }}

                            // console.log('newbird', newBird);
                            const newBirdsURL = 'http://localhost:3000/birds'
                            
                            fetch(newBirdsURL, {
                                method: 'POST',
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(newBird)
                            })
                            .then(parseJSON)
                            .then(displayNewBirdResult)

                            function displayNewBirdResult(result){
                                // console.log('result', result);
                                createBirdCapture(result)
                            }
                        }
                    }
                    
                }

                function createBirdCapture(bird){
                    // console.log('3. hey from create bird capture');
                    // console.log('bird_id', bird.id);
                    // console.log('membership_id');
                    const birdId = bird.id
                    function getmembershipId(){
                        const getCurrentOption = document.getElementById('research-group-select')
                        console.log('current option', getCurrentOption.value);
                        const optionValue = getCurrentOption.value
                        
                        return parseInt(optionValue)
                    }

                    function getCaptureIDFromDom(){
                        const getCaptureId = document.getElementById('capture-id')
                        // console.log('getcaptureid', getCaptureId);
                        
                        const CaptureIdNum = parseInt(getCaptureId.textContent)
                        // console.log('capture', CaptureIdNum);
                        return CaptureIdNum
                    }

                    const captureId = getCaptureIDFromDom()
                    const membershipId = getmembershipId()
                    // console.log('capture id:', captureId);
                    // console.log('membership_id', membershipId);
                    
                    const newBirdCapture = {
                        birdCapture: {
                            membership_id: membershipId,
                            bird_id: birdId,
                            capture_id: captureId
                        }
                    }
                    
                    // console.log('bird capture object: ', newBirdCapture);
                    birdCapsUrl = `http://localhost:3000/bird_captures`
                    fetch(birdCapsUrl, {
                        method: 'POST',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(newBirdCapture)
                    })
                    .then(parseJSON)
                    .then(displayCreatedBirdCapture)

                    function displayCreatedBirdCapture(response){
                        // console.log('reponse:', response);
                        console.log('Everything has been doneRIGHT', );
                        const getFormButton = document.getElementById('capture-form')
                        getFormButton.disabled = false

                        const getErrorMessage = document.getElementById('error-message')
                        if (getErrorMessage){
                            getErrorMessage.remove()
                        }
                        const getErrorMessage2 = document.getElementById('error-message-two')
                        if (getErrorMessage2){
                            getErrorMessage2.remove()
                        }
                        const getErrorMessage3 = document.getElementById('error-message-three')
                        if (getErrorMessage3){
                            getErrorMessage3.remove()
                        }

                        const birdM = document.getElementById('new-bird-message')
                        if (birdM){
                            birdM.textContent = "You have successfully created a data entry!"
                        }
                        else {
                            const BirdMessage = document.createElement('p')
                            BirdMessage.textContent = "You have successfully created a data entry!"
                            const getForm = document.getElementById('create-capture-form')
                            getForm.prepend(BirdMessage)
                        }

                        const newFormButton = document.getElementById('new-form-button')
                        if (newFormButton){
                            newFormButton.remove()
                        }

                        const speciesInput = document.getElementById('species-input-field')
                        if(speciesInput){
                            speciesInput.remove()
                        }
                        
                        const getForm = document.getElementById('create-capture-form')
                        getForm.reset()

                        
                    }
                    
                }
            }

        }

    }
}

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

