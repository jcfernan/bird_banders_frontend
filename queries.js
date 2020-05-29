const logoutButton = document.getElementById('loginbutton')

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