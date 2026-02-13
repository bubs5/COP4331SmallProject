// var urlBase = ''website whenever we have
const urlBase = "http://localhost:8000";
const extension = 'php';

let userId = 0;
let firstName, lastName = "";


//create new account function
function signUp(){
    let userId = 0;
    let firstName = document.getElementById("regFirst").value;
    let lastName = document.getElementById("regLast").value;
    let username = document.getElementById("regLogin").value;
    let password = document.getElementById("regPassword").value;
    let hash = md5(password);

    document.getElementById("status").innerHTML = "";

    let newInfo = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };
    let jsonPayload = JSON.stringify(newInfo);
    let regURL = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", regURL, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        xhr.onreadystatechange = function (){
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    console.log(userId);
                    document.getElementById("status").innerHTML = "A problem occured while trying to create your new account";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;


                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("status").innerHTML = err.message;
    }
}



//login function
function goLogin(){
    userId = 0;
    firstName = "";
    lastName = "";

    let username = document.getElementById("loginuser").value;
    let password = document.getElementById("loginpassword").value;
    let hash = md5( password );

    document.getElementById("status").innerHTML = "";

    let tmp = {
        login: username,
        password: hash };
    //	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    console.log(userId);
                    document.getElementById("status").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;



                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("status").innerHTML = err.message;
    }

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

//writes welcome text for user
function setWelcomeText() 
{
    const welcome = document.getElementById("welcomeText");
    if (!welcome) return;

    const first = localStorage.getItem("firstName");
    const last  = localStorage.getItem("lastName");

    if (first && last) welcome.textContent = `Welcome, ${first} ${last}`;
    else welcome.textContent = "Welcome";
}

//updates contacts list
function createContacts(contacts) {
  const body = document.getElementById("resultsBody");
  body.innerHTML = "";

  for (const c of contacts) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.FirstName}</td>
      <td>${c.LastName}</td>
      <td>${c.Phone}</td>
      <td>${c.Email}</td>
    `;
    body.appendChild(tr);
  }
}


