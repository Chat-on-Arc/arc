import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, get, child, push } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

var uid;
var user_email;
var photoURL;
let socket;

 const firebaseConfig = {
  apiKey: "AIzaSyC5oq9fyPeoo8jVU-N07gYhjt2kFEBGqA8",
  authDomain: "arc-by-insight.firebaseapp.com",
  projectId: "arc-by-insight",
  storageBucket: "arc-by-insight.appspot.com",
  messagingSenderId: "1073428960179",
  appId: "1:1073428960179:web:c61897786f1d2ba05131c6",
  measurementId: "G-47T814R2SK"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);
  const dbRef = ref(getDatabase());

function logout() {
  signOut(auth).then(() => {
  console.log("User is signed out.");
  window.location.href = "login.html";
  }).catch((error) => {
  // An error happened.
  });
}
window.logout = logout;


 function create_an_arc() {
    let user = auth.currentUser;
    var div = document.getElementById("add-arcs");
     div.style.visibility = "visible";
    let name_input = document.createElement('input');
    name_input.setAttribute("id","name");
    let submit_button = document.createElement("button");
    submit_button.innerHTML = "Submit";
    let cancel_button = document.createElement("button");
    cancel_button.innerHTML = "Cancel";
    submit_button.addEventListener('click', async () => {
        let name = document.getElementById("name").value;
        let token = await user.getIdToken();
        console.log(token);
        console.log("Submit attempt");
        socket.timeout(5000).emit('new circle',name, token, (err, res) => {
            if (err) {
                console.log("The server failed to respond.");
            }
            else {
                if (res.status != 'failed') {
                    let circle_id = res.circle_id;
                    
                }
                else {
                   console.log("failed");
                }
            }
         });
    });
    cancel_button.addEventListener("onclick", cancel());

     div.innerHTML =  "<h1>Create an arc</h1>" + 
     "<h4>Name</h4>";
    div.appendChild(name_input);
    div.appendChild(submit_button);
    div.appendChild(cancel_button);

      
   }
   window.create_an_arc = create_an_arc;

   function cancel() {
    var div = document.getElementById("add-arcs");
    div.style.visibility = "hidden";
    div.innerHTML = "";
   }
   window.cancel = cancel;
   
   function new_direct() {
    var div = document.getElementById("add-arcs");
    div.style.visibility = "visible";
    div.innerHTML = "<div style='padding: 10px;'>" + 
    "<h1>New conversation</h1>" + 
    "<h4>User email</h4>" + 
    "<input type='text' id='email-input'></input>" + 
    '<button onclick="create_direct()">Submit</button>'+
    '<button onclick="cancel()">Cancel</button>'+
    '</div>';
  }
  window.new_direct = new_direct;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      console.log(user);
      
      uid = user.uid;
      photoURL = user.photoURL;
      if(photoURL != null) {
        setPicture(photoURL);
      }
      user_email = user.email;
      document.getElementById("username").innerHTML = user.displayName;
      document.getElementById("user-greeting").innerHTML = "Hi, " + user.displayName + "!";
      let basic_info = {
       displayName: user.displayName,
       email: user.email,
      };
     if(user.email == "milesport@outlook.com") {
      document.getElememtById("main").innerHTML = "<p>Fatal error: Massive fucking forehead detected.</p><a href='javascript:logout()'>Sign out</a>";
     }
     user.getIdToken().then((token) => {
        const auth_data = {token: token}; 
        socket = io("ws://localhost:3000", {
            reconnectionDelayMax: 1000,
            auth: auth_data,
            query: {
            "my-key": "value",
            }
     });
     socket.timeout(5000).emit('circle_list',token, (err, res) => {
        if (err) {
            console.log("The server failed to respond.");
        }
        else {
            if (res.status != 'none') {
                console.log(res.list);

            }
            else {
                document.getElementById("channels-section").innerHTML = "You are not in any Circles.";
            }
        }
     });
     
});

    }
    else {
        console.log("User is signed out");
    }
});




