document.addEventListener("DOMContentLoaded", () => {
    console.log("app.js is loaded");

    //landing
    if (document.getElementById("goLogin")) wireLanding();

    //login functions
    if (document.getElementById("loginBtn")) wireLogin();

    //creating new account
    if (document.getElementById("regBtn")) wireSignup();

    //contacts
    if (document.getElementById("searchBtn")) wireContacts();

});

//main page
function wireLanding(){

}

//process of logging in
function wireLogin(){

    document.getElementById("loginBtn").onclick = () => {
        console.log("Login Clicked")
        //Placeholder since I dont have API yet
        document.getElementById("status").textContent = "Login clicked (no API yet)";

        //Login was succesful - pretend login for right now
        localStorage.setItem("loggedIn", "true");

    };
}

function wireSignup(){
    const back = document.getElementById("backHome");
    if (back) back.onclick = () => location.href = "index.html";

    document.getElementById("regBtn").onclick = () => {
        console.log("Signup Clicked")
        //no API yet
        document.getElementById("status").textContent = "Signup Completed (no API yet)";
    };
}

function wireContacts(){
//basic login success- again need to wait for API
    if(localStorage.getItem("loggedIn")!== "true"){
        location.href = "index.html";
        return;
    }

    document.getElementById("logoutBtn").onclick = () => {
        localStorage.removeItem("loggedIn");
        location.href = "index.html";
    };
}

//show password checkbox
function showPassword()
{
    var hidePass = document.getElementById("loginpassword")
    if(hidePass.type === "password"){
        hidePass.type = "text";
    }
    else{
        hidePass.type = "password";
    }
}