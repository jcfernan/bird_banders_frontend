const loginForm = document.querySelector('.login-form');
const getUsers = document.querySelector('#get-users');
const getloginFormDiv = document.querySelector('#login-forms-container')
let getCreateAccountButton = document.querySelector('#create-account-button')
const getProfileId = document.querySelector('#my-profile')
const isLoggedIn = document.querySelector('.is-logged-in')
const logoutButton = document.querySelector('#logout')

const authHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.token}`
}

function setIsLoggedIn(){
    isLoggedIn.textContent = localStorage.getItem("token")
    ? "You are logged in"
    : "You are not logged in"
}

setIsLoggedIn
loginForm.addEventListener("submit", handleLogin);
getCreateAccountButton.addEventListener("click", handleCreateAccountForm)

function handleGetUsers(){
    console.log('token: ', localStorage.token);
    
    fetch("http://localhost:3000/users", {
        headers: authHeaders
    })
        .then(response => response.json())
        .then(console.log);
}

function handleLogin(event){
    event.preventDefault();
    const loginFormData = new FormData(event.target);
    const username = loginFormData.get("username");
    const password = loginFormData.get("password")

    console.log('username', username);
    console.log('password', password );

    const loginBody = {username, password}

    fetch("http://localhost:3000/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginBody)
    }).then(response => response.json())
        .then(result => {
            console.log('result: ', result.token)
            console.log('username: ', result.username)
            console.log('userid', result.user_id);
            

            localStorage.setItem('token', result.token)
            localStorage.setItem('username', result.username)
            localStorage.setItem('user_id', result.user_id)
            setIsLoggedIn()
        })
    event.target.reset();    
}

function handleCreateAccountForm(event){
    event.preventDefault();
    
    const createFormTitle = document.createElement('h3')
    createFormTitle.textContent = "Create your account: "
    getloginFormDiv.append(createFormTitle)

    const newForm = document.createElement('form')
    newForm.setAttribute("id", "CreateAccountForm");
    // createForm.setAttribute('method',"post");
    newForm.setAttribute('action',"submit");

    const newUsername = document.createElement('input');
    newUsername.placeholder = "username"
    newUsername.name = "username"

    const newName = document.createElement('input');
    newName.placeholder = "name"
    newName.name = "name"

    const newEmail = document.createElement('input');
    newEmail.placeholder = "email"
    newEmail.name = "email"

    const newPassword = document.createElement('input');
    newPassword.placeholder = "password"
    newPassword.name = "password"

    const spacing = document.createElement('br')
    spacing.textContent = " "

    const submitButton = document.createElement("button");
    submitButton.form="CreateAccountForm"
    submitButton.textContent = "Submit"
    submitButton.id = "submit-new-user-account-info"
    submitButton.setAttribute('type',"submit");

    // submitButton.addEventListener("submit", handleCreateNewUser)

    // event listeners need to be attached to the form not the button
    // es6 has implicit returns 
    newForm.addEventListener("submit", handleCreateNewUser)

    newForm.append(newUsername, newName, newEmail, newPassword, submitButton)

    getloginFormDiv.append(newForm, spacing);



    getCreateAccountButton.remove();
}

function handleCreateNewUser(event){
    event.preventDefault();

    console.log('Hello from create new user');

    const newUserForm = document.querySelector('#CreateAccountForm')
    getNewFormData(newUserForm);
    newUserForm.remove();

    getCreateAccountButton = document.createElement('button')
    getCreateAccountButton.id = "create-account-button"

}

function getNewFormData(newUserForm){
    const formData = new FormData(newUserForm)

    console.log('form', formData.get('name'));
    

    const newName = formData.get('name')
    const newUserName = formData.get('username')
    const newEmail = formData.get('email')
    const newPassword = formData.get('password')
    const newUser = {
        user: 
            {
                name: newName, 
                username: newUserName,
                email: newEmail, 
                password: newPassword
            }
        }

        console.log('newuser', newUser);
        

    saveNewUserToDB(newUser)
}

function saveNewUserToDB(newUser){
    usersURL = 'http://localhost:3000/users'
    fetch(usersURL, {
                        method: 'POST',
                        headers: {'content-type': 'application/json'},
                        body: JSON.stringify(newUser)
                    }
        )
    .then(console.log('saved to db'))
}

// function handleGoToProfile(event){
//     event.preventDefault();
//     const myToken = localStorage.token
//     console.log('token', myToken);

//     // return fetch('http://localhost:8080/clients', {
//     //     method: 'GET',
//     //     headers: myHeaders,
//     //   })
      
//     //   .then(
//     console.log('token info: ', myToken.payload) //["user_id"]?.string);
    

//     fetch ("http://localhost:3000/users", {
//         method: 'GET',
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${myToken}` 
//         }
//     }).then(console.log('myToken.payload', myToken.payload))
    
// }

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem('username')
}

logoutButton.addEventListener("click", ()=>{
    logout()
    setIsLoggedIn()
})

function reject(){
    window.alert("Please log in to see your profile");
    window.location("/")
}