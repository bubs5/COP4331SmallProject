// var urlBase = ''website whenever we have
const urlBase = "http://165.245.142.62";
const extension = 'php';

let userId = 0;
let firstName, lastName = "";
let ids = [];


//create new account function
function signUp(){
    let userId = 0;
    let firstName = document.getElementById("regFirst").value;
    let lastName = document.getElementById("regLast").value;
    let username = document.getElementById("regLogin").value;
    let password = document.getElementById("regPassword").value;

    document.getElementById("status").innerHTML = "";

    let newInfo = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: password,
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

                saveCookie();

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

    document.getElementById("status").innerHTML = "";

    let tmp = {
        login: username,
        password: password };
    //	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log("LOGIN RAW:", xhr.responseText);

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    console.log(userId);
                    document.getElementById("status").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("status").innerHTML = err.message;
    }

}

function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++)
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if( tokens[0] == "firstName" )
        {
            firstName = tokens[1];
        }
        else if( tokens[0] == "lastName" )
        {
            lastName = tokens[1];
        }
        else if( tokens[0] == "userId" )
        {
            userId = parseInt( tokens[1].trim() );
        }
    }

    if( userId < 0 )
    {
        window.location.href = "index.html";
    }
    else
    {
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout()
{
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
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

    if (first && last) welcome.textContent = `Welcome, ${firstName} ${lastName}`;
    else welcome.textContent = "Welcome";
}


//searching contact list
function searchContact()
{
    console.log("Search triggered");
    const q = document.getElementById("searchText").value.trim();
    const table = document.getElementById("contactsTable");

    if (q === "") {
        table.style.display = "none";
        document.getElementById("tbody").innerHTML = "";
        return;
    }

    table.style.display = "block";
    let tmp = {
        search: document.getElementById("searchText").value.trim(),
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);


    let url = urlBase + '/SearchContacts.' + extension;

    //need working api/database
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                const q = document.getElementById("searchText").value.trim().toLowerCase();

                let results = jsonObject.results || [];

                if (q !== "") {
                    results = results.filter(r => {
                        const first = (r.firstName ?? r.FirstName ?? "").toLowerCase();
                        const last  = (r.lastName  ?? r.LastName  ?? "").toLowerCase();
                        const email = (r.Email     ?? r.email     ?? "").toLowerCase();
                        const phone = (r.PhoneNumber ?? r.Phone ?? r.phone ?? "").toLowerCase();

                        return (`${first} ${last} ${email} ${phone}`).includes(q);
                    });
                }
                text = "";
                for (let i = 0; i < results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    let r = results[i];

                    ids[i] = results[i].ID ?? results[i].Id ?? results[i].id ?? 0;

                    text += "<tr id='row" + i + "'>";

                    let first = r.firstName ?? r.FirstName ?? "";
                    let last  = r.lastName  ?? r.LastName  ?? "";
                    let email = r.Email     ?? r.email     ?? "";
                    let phone = r.PhoneNumber ?? r.Phone ?? r.phone ?? "";

                    text += "<td id='first_Name" + i + "'><span>" + first + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + last + "</span></td>";

                    text += "<td id='phone" + i + "'><span>" + phone + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + email + "</span></td>";

                    text += "<td></td>";
                    text += "</tr>";
                }
                console.log("Final text being inserted:", text);
                document.getElementById("tbody").innerHTML = text;

                const table = document.getElementById("contactsTable");
                const searchValue = document.getElementById("searchText").value.trim();

                if (searchValue !== "") {
                    table.style.display = "block";
                } else {
                    table.style.display = "none";
                }



            };
        xhr.send(jsonPayload);
        }}
    catch (err){
        console.log(err.message);
    }

}


//add contact
function addContact()
{


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







/*test search code
  let jsonObject = {
      results: [
          { ID: 1, firstName: "John", lastName: "Smith", Email: "john@email.com", PhoneNumber: "123-456-7890" },
          { ID: 2, firstName: "Sarah", lastName: "Lee", Email: "sarah@email.com", PhoneNumber: "555-111-2222" }
      ],
      error: ""
  };
  const q = document.getElementById("searchText").value.trim().toLowerCase();

  let results = jsonObject.results || [];

  if (q !== "") {
      results = results.filter(r => {
          const first = (r.firstName ?? r.FirstName ?? "").toLowerCase();
          const last  = (r.lastName  ?? r.LastName  ?? "").toLowerCase();
          const email = (r.Email     ?? r.email     ?? "").toLowerCase();
          const phone = (r.PhoneNumber ?? r.Phone ?? r.phone ?? "").toLowerCase();

          return (`${first} ${last} ${email} ${phone}`).includes(q);
      });
  }
  text = "";
  for (let i = 0; i < results.length; i++) {
      ids[i] = jsonObject.results[i].ID
      let r = results[i];

      ids[i] = r.ID ?? r.Id ?? r.id ?? 0;

      text += "<tr id='row" + i + "'>";

      let first = r.firstName ?? r.FirstName ?? "";
      let last  = r.lastName  ?? r.LastName  ?? "";
      let email = r.Email     ?? r.email     ?? "";
      let phone = r.PhoneNumber ?? r.Phone ?? r.phone ?? "";

      text += "<td id='first_Name" + i + "'><span>" + first + "</span></td>";
      text += "<td id='last_Name" + i + "'><span>" + last + "</span></td>";

      // Your header is PHONE then EMAIL:
      text += "<td id='phone" + i + "'><span>" + phone + "</span></td>";
      text += "<td id='email" + i + "'><span>" + email + "</span></td>";

      // ACTIONS column (since your table has it)
      text += "<td></td>";

      text += "</tr>";
  }
  console.log("Final text being inserted:", text);
  document.getElementById("tbody").innerHTML = text;

  */
