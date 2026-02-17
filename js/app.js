// var urlBase = ''website whenever we have
//const urlBase = "http://165.245.142.62";
const urlBase = "";
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



//writes welcome text for user
function setWelcomeText() {
    const welcome = document.getElementById("welcomeText");
    if (!welcome) return;

    // uses the globals set by readCookie()
    if (firstName && lastName) {
        welcome.textContent = `Welcome, ${firstName} ${lastName}`;
    } else {
        welcome.textContent = "Welcome";
    }
}



//searching contact list
function searchContact()
{
    const qRaw = document.getElementById("searchText").value.trim();
    const table = document.getElementById("contactsTable");
    const tbody = document.getElementById("tbody");

    // Hide table when search box is empty
    if (qRaw === "") {
        table.style.display = "none";
        tbody.innerHTML = "";
        ids = []; // clear any previous IDs
        return;
    }

    table.style.display = "block";

    const tmp = {
        search: qRaw,
        userId: userId
    };

    const jsonPayload = JSON.stringify(tmp);
    const url = urlBase + '/SearchContacts.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        // HTTP error (404/500/etc)
        if (xhr.status !== 200) {
            console.log("Search failed (HTTP " + xhr.status + "):", xhr.responseText);
            tbody.innerHTML =
                "<tr><td colspan='5'>Search failed (HTTP " + xhr.status + "). See console.</td></tr>";
            ids = [];
            return;
        }

        // Parse JSON safely
        let jsonObject;
        try {
            jsonObject = JSON.parse(xhr.responseText);
        } catch (e) {
            console.log("Non-JSON response from SearchContacts.php:");
            console.log(xhr.responseText);
            tbody.innerHTML =
                "<tr><td colspan='5'>Search failed (server returned non-JSON). See console.</td></tr>";
            ids = [];
            return;
        }

        // Backend-reported error
        if (jsonObject.error) {
            console.log("Search error:", jsonObject.error);
            tbody.innerHTML = "<tr><td colspan='5'>Search error. See console.</td></tr>";
            ids = [];
            return;
        }

        const q = qRaw.toLowerCase();
        let results = jsonObject.results || [];

        if (q !== "") {
            results = results.filter(r => {
                const first = (r.firstName ?? r.FirstName ?? "").toLowerCase();
                const last = (r.lastName ?? r.LastName ?? "").toLowerCase();
                const email = (r.Email ?? r.email ?? "").toLowerCase();
                const phone = (r.PhoneNumber ?? r.Phone ?? r.phone ?? "").toLowerCase();

                return (`${first} ${last} ${email} ${phone}`).includes(q);
            });
        }
        text = "";
        for (let i = 0; i < results.length; i++) {
            //ids[i] = jsonObject.results[i].ID
            let r = results[i];

            ids[i] = results[i].ID ?? results[i].Id ?? results[i].id ?? 0;

            text += "<tr id='row" + i + "'>";

            let first = r.firstName ?? r.FirstName ?? "";
            let last = r.lastName ?? r.LastName ?? "";
            let email = r.Email ?? r.email ?? "";
            let phone = r.PhoneNumber ?? r.Phone ?? r.phone ?? "";

            text += "<td id='first_Name" + i + "'><span>" + first + "</span></td>";
            text += "<td id='last_Name" + i + "'><span>" + last + "</span></td>";

            text += "<td id='phone" + i + "'><span>" + phone + "</span></td>";
            text += "<td id='email" + i + "'><span>" + email + "</span></td>";

            const contactId = results[i].ID ?? results[i].Id ?? results[i].id ?? 0;

            text += "<td class='actions'>"
                + "<button type='button' class='edit-btn'"
                + " data-id='" + contactId + "'"
                + " data-first='" + encodeURIComponent(first) + "'"
                + " data-last='" + encodeURIComponent(last) + "'"
                + " data-phone='" + encodeURIComponent(phone) + "'"
                + " data-email='" + encodeURIComponent(email) + "'"
                + ">Edit</button>"
                + "<button type='button' class='delete-btn' data-id='" + contactId + "'>Delete</button>"
                + "</td>";
            text += "</tr>";

        }

    };

    try {
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

    //console.log("Final text being inserted:", text);
  //  document.getElementById("tbody").innerHTML = text;

   // const table = document.getElementById("contactsTable");
    const searchValue = document.getElementById("searchText").value.trim();

    if (searchValue !== "") {
        table.style.display = "block";
    } else {
        table.style.display = "none";
    }

}


//add contact
function addContact()
{
   console.log("addContact() gone");
    let firstName = document.getElementById("infoFirst").value.trim();
    let lastName = document.getElementById("infoLast").value.trim();
    let phoneNumber = document.getElementById("infoPhone").value.trim();
    let emailAddress = document.getElementById("infoEmail").value.trim();

    let createContact = {
        firstName: firstName,
        lastName: lastName,
        phone: phoneNumber,
        email: emailAddress,
        ID: userId
    }
    let jsonPayload = JSON.stringify(createContact);

    if (createContact.firstName === "" || createContact.lastName === "" || createContact.email === "" || createContact.phone === "")
    {
        window.alert("Please fill all required fields.");
        return;
    }
    console.log(createContact);

    let url = urlBase + '/AddContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4){
                if (xhr.status === 200) {
                    document.getElementById('infoFirst').value = '';
                    document.getElementById('infoLast').value = '';
                    document.getElementById('infoPhone').value = '';
                    document.getElementById('infoEmail').value = '';

                    document.getElementById("addContactResult").textContent =
                      "Contact added successfully!";

                    // Redirect to contact page
                    setTimeout(function() {
                       window.location.href = "contacts.html";
                    }, 1000);
                } else {
                    document.getElementById('addContactResult').textContent =
                        "Add failed: " + xhr.responseText;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(error) {
        document.getElementById('addContactResult').innerHTML = error.message;
    }


}


function deleteContact(){

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
        if( tokens[0] === "firstName" )
        {
            firstName = tokens[1];
        }
        else if( tokens[0] === "lastName" )
        {
            lastName = tokens[1];
        }
        else if( tokens[0] === "userId" )
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







document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        doDelete(e.target.dataset.id);
    }

    if (e.target.classList.contains("edit-btn")) {
        doEdit(e.target);
    }
});


function doDelete(contactID) {
    let userToDelete = {
        contactId: Number(contactID),
        userId: userId
    };


    console.log(userToDelete);

    let deletedUser = JSON.stringify(userToDelete);

    if (window.confirm("Are you sure you want to delete this contact?") == false)
    {
        return;
    }

    console.log(deletedUser);
    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState === 4 && this.status === 200)
            {


               window.alert("Your contact was succesfully deleted!");
                window.location.reload(true);

            }
        };
        xhr.send(deletedUser);
    }
    catch(err)
    {
        window.alert("ID is invalid");
        //document.getElementById("DeleteUser").innerHTML = err.message;
    }
}


function doEdit(btn) {
    const id = btn.dataset.id || "";

    // decode because we encoded when building the table
    const first = decodeURIComponent(btn.dataset.first || "");
    const last  = decodeURIComponent(btn.dataset.last || "");
    const phone = decodeURIComponent(btn.dataset.phone || "");
    const email = decodeURIComponent(btn.dataset.email || "");

    const url =
        "edit.html?id=" + encodeURIComponent(id) +
        "&first=" + encodeURIComponent(first) +
        "&last=" + encodeURIComponent(last) +
        "&phone=" + encodeURIComponent(phone) +
        "&email=" + encodeURIComponent(email);

    window.location.href = url;
}


function saveEditContact() {
    const contactId = Number(document.getElementById("editContactId").value);
    const firstName = document.getElementById("infoFirst").value.trim();
    const lastName  = document.getElementById("infoLast").value.trim();
    const phone     = document.getElementById("infoPhone").value.trim();
    const email     = document.getElementById("infoEmail").value.trim();

    const status = document.getElementById("editContactResult");
    if (status) status.textContent = "";

    if (!contactId || !firstName || !lastName || !phone || !email) {
        if (status) status.textContent = "Please fill all required fields.";
        return;
    }

    //
    const payload = {
        contactId: contactId,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };

    const jsonPayload = JSON.stringify(payload);

    //API placement name
    const url = urlBase + '/EditContact.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;

        if (this.status === 200) {
            if (status) status.textContent = "Contact updated successfully!";
            setTimeout(() => window.location.href = "contacts.html", 700);
        } else {
            if (status) status.textContent = "Update failed: " + xhr.responseText;
        }
    };

    try {
        xhr.send(jsonPayload);
    } catch (err) {
        if (status) status.textContent = err.message;
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
