import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, set, ref, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

var uid;
var user_email;


var stylesheet = document.createElement("link");
stylesheet.setAttribute("rel","stylesheet");
var div = document.getElementById("serve");
  let head = document.getElementsByTagName("head");
  head = head[0];
  head.appendChild(stylesheet);
  const firebaseConfig = {
    apiKey: "AIzaSyC5oq9fyPeoo8jVU-N07gYhjt2kFEBGqA8",
    authDomain: "arc-by-insight.firebaseapp.com",
    projectId: "arc-by-insight",
    storageBucket: "arc-by-insight.appspot.com",
    messagingSenderId: "1073428960179",
    appId: "1:1073428960179:web:c61897786f1d2ba05131c6",
    measurementId: "G-47T814R2SK"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

export function login() {
  signInWithPopup(auth,provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    user = result.user;
    console.log(credential);
    console.log(token);
    console.log(user);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }
window.login = login;

export function logout() {
  signOut(auth).then(() => {
  console.log("User is signed out.");
  window.location.href = "login.html";
  }).catch((error) => {
  // An error happened.
  });
}
window.logout = logout;
export function submit() {
 var channel_id = Math.floor(Math.random()*99999);
 let admin = [user_email];   
 let name = document.getElementById("name").value;
 set(ref(database, "/channel/" + channel_id + "/members/"),{admin: admin});
 set(ref(database, "/channel/" + channel_id + "/basic_data"), {name: name});
 set(ref(database, "users/" + uid + "/channels/" + channel_id), {type: "owner"});
 var url = new URL("https://jcamille2023.github.io/arc/channel");
 url.searchParams.append('channel_id', channel_id);
 console.log(url);
 window.location.href = url;
}
window.submit = submit;

export function join(e) {
 var url = new URL("https://jcamille2023.github.io/arc/channel");
 url.searchParams.append('channel_id', e);
 console.log(url);
 window.location.href = url;
}
window.join = join;

export function cancel() {
 var div = document.getElementById("add-arcs");
 div.style.visibility = "hidden";
 div.innerHTML = "";
}
window.cancel = cancel;

export function create_an_arc() {
 var div = document.getElementById("add-arcs");
  div.style.visibility = "visible";
  div.innerHTML = "<div style='padding: 10px;'>" + 
  "<h1>Create an arc</h1>" + 
  "<h4>Name</h4>" + 
  "<input type='text' id='name'></input>" + 
  '<button onclick="submit()">Submit</button>'+
  '<button onclick="cancel()">Cancel</button>'+
  '</div>';
   
}
window.create_an_arc = create_an_arc;

function activate_arc_reference() {
  var arcs_ref = ref(database, "users/" + uid + "/channels/");
    onValue(arcs_ref, (snapshot) => {
     let data = snapshot.val();
     console.log(data);
     let arc_table = document.getElementById("channels-table");
     arc_table.innerHTML = "";
     for(let n = 0; n < Object.keys(data).length; n++) {
      let arc_number = Object.keys(data)[n];
      get(child(dbRef, '/channel/' + arc_number + "/basic_data")).then((snapshot) => {
       let arc_data = snapshot.val()
       let arc = document.createElement("div"); // add to arc_table
       
       arc.style.padding = "7px";
       arc.style.background = "black";
       
       let arc_container = document.createElement("div"); // add to arc
       let arc_name = document.createElement("h3"); // add to arc container
       let arc_name_node = document.createTextNode(arc_data.name); // add to arc_name
       
       arc_name.style.color = "white";
       let join_arc = document.createElement("button"); // add to arc container
       join_arc.innerHTML = "Go to arc";
       join_arc.setAttribute("onclick","join(" + arc_number + ")");

       arc_name.appendChild(arc_name_node);
       arc_container.appendChild(arc_name);
       arc_container.appendChild(join_arc);
       arc.appendChild(arc_container);
       arc_table.appendChild(arc);
      });
     }
    });
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    var header = document.getElementById("header");
    var header_fields = '' + 
'<table>' + 
'            <tbody>' + 
'                <tr>' + 
'                <td width="88.25%">' + 
'                    <h2>Arc</h2>' + 
'                </td>' + 
'                <td>' + 
'                    <p id="username"></p>' + 
'                </td>' + 
'                <td>' + 
'                    <a href="dashboard">Dashboard</a>' + 
'                </td>' + 
'                <td><a href="javascript:logout()">Sign out</a></td>' + 
'</tr>' + 
'            </tbody>' + 
'        </table>' + 
'';
    header.innerHTML = header_fields;
  var dashboard_fields = '' + 
'<div id="container" class="container">' + 
'<div id="main" class="box">' + 
'<section id="open-section">' + 
'        <h1 id="user-greeting">Hi, user</h1>' + 
'        <h4>See your Arcs</h4>' + 
'    <button onclick="create_an_arc()">Create an Arc</button>' + 
'    </section>' + 
'    ' + 
'<section id="channels-section">' + 
'    <div id="channels-table">' + 
'        ' + 
'    </div>' + 
'</section>' + 
'</div> <!-- end box -->' + 
'<div id="add-arcs" class="box overlay" style="color: white;background-color: black;visibility: hidden;"></div> <!-- end overlay -->' + 
'</div> <!-- end container -->' + 
'' + 
'';
    div.innerHTML = dashboard_fields;
    console.log(user);
    uid = user.uid;
    user_email = user.email;
    document.getElementById("username").innerHTML = user.displayName;
    document.getElementById("user-greeting").innerHTML = "Hi, " + user.displayName + "!";
    stylesheet.setAttribute("href","dashboard.css");
    activate_arc_reference();
    let basic_info = {
     displayName: user.displayName,
     email: user.email,
    };
    set(ref(database, "users/" + uid + "/basic_info"), basic_info);
   /* window.logout = logout;
    window.submit = submit;
    window.cancel = cancel;
    window.join = join;
    window.create_an_arc = create_an_arc; */
    
    // ...
  } else {
    
    window.login = login;
    stylesheet.setAttribute("href","login.css");
  var login_fields = '' + 
'<table id="center">' + 
'        <tbody>' + 
'            <tr>' + 
'                <td width="50%">' + 
'    <h1 style="' + 
'    color: white;' + 
'">Arc</h1>' + 
'    <h4 style="' + 
'    color: white;' + 
'">It all happens here</h4>' + 
'</td>' + 
'                <td width="50%" style="' + 
'    text-align: center;' + 
'">' + 
'    <button class="gsi-material-button" id="sign-in-button">' + 
'  <div class="gsi-material-button-state"></div>' + 
'  <div class="gsi-material-button-content-wrapper">' + 
'    <div class="gsi-material-button-icon">' + 
'      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">' + 
'        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>' + 
'        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>' + 
'        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>' + 
'        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>' + 
'        <path fill="none" d="M0 0h48v48H0z"></path>' + 
'      </svg>' + 
'    </div>' + 
'    <span class="gsi-material-button-contents">Sign in with Google</span>' + 
'    ' + 
'  </div>' + 
'</button>' + 
'</td>' + 
'            </tr>' + 
'        </tbody>' + 
'    </table>' + 
'';
    div.innerHTML = login_fields;
    div.setAttribute("class","wrapper");
    
  document.getElementById("sign-in-button").setAttribute("onclick","login()");
    // ...
  }
});
