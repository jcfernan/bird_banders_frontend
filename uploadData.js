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
        
        //create a capture
        createCapture(event)
        // check to see if bird exists or not, and from that either grab bird id or create new bird
        //createBirdOrGrabId(event)
        // create a bird_capture 
        createBirdCapture(event)

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
                    .then("saved to db: ", console.log)
            }
            createBirdOrGrabId(event)
            function createBirdOrGrabId(event){
                console.log('2. hello from create or grab bird');
                // check to see if bird exists or not, and from that either grab bird id or create new bird
                birdsURL = 'http://localhost:3000/birds'
                fetch(birdsURL)
                .then(parseJSON)
                .then(checkIfExists)

                function checkIfExists(response){
                    const formData = new FormData(captureForm)        
                    const checkbandId = formData.get('bandId')
    
                    const checkBird = {
                        bird: {
                            bandId: checkbandId
                        }}

                        console.log('response', response);
                        
                }
                

                
                
                
                function createBirdCapture(event){
                    console.log('3. hey from create bird capture');
                    
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
                    listOption.value = group.id
                    listOption.innerHTML = group.name
                    getGroupSelect.append(listOption)
                }
            });
        });
    }
}

