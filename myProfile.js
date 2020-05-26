const topSecretStuff = document.querySelector('#top-secret-stuff')


fetch("http:localhost:4000/secret-profiles", {
    headers: {
        Authorization: `bearer ${localStorage.getItem("token")}`
    }
}).then(response => response.json())
.then(response => {
    topSecretStuff.textContent = response.top_secret_stuff
})

function guardPage(){
    if (!localStorage.getItem("token")) {
        window.location.href = "/"
    }
}