import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {login} from "./login.js";


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

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    console.log(user);
    const uid = user.uid;
    window.location.href = "dashboard.html";
    // ...
  } else {
    
    window.login = login;
    stylesheet.setAttribute("href","login.css");
  var fields = '' + 
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
    div.innerHTML = fields;
    div.setAttribute("class","wrapper");
    
  document.getElementById("sign-in-button").setAttribute("onclick","login()");
    // ...
  }
});
