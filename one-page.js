import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, set, ref, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js";

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
  const database = getDatabase(app);
  const dbRef = ref(getDatabase());
  const messaging = getMessaging(app);

var uid;
var user_email;
var channel_id;
var msg_date;
var new_user_uid;
var display_name;
var channel_name;
var button;
var people_typing = [];


var stylesheet = document.createElement("link");
stylesheet.setAttribute("rel","stylesheet");
var div = document.getElementById("serve");
var header = document.getElementById("header");
  let head = document.getElementsByTagName("head");
  head = head[0];
  head.appendChild(stylesheet);
  

function email_exists(e,data) {
  console.log(data);
  let user_list = Object.keys(data);
console.log(user_list);
  for(let n = 0; n < user_list.length; n++) {
console.log(user_list[n]);
   let user_email = data[user_list[n]].basic_info.email;
    console.log(user_email);
   console.log(e);
   if(user_email === e) {
     new_user_uid = user_list[n];
     console.log("Match found!");
     return true;
   }
   else {
    continue;
   }
  }
return false;
}
function add_user() {
var members;
let added_email = document.getElementById("email").value;
var match;
get(child(dbRef, "/users/")).then((snapshot) => {
	let data = snapshot.val();
	match = email_exists(added_email,data);
	console.log(match);
	if(match === true) {
 get(child(dbRef, "/channel/" + channel_id + "/members/members")).then((snapshot) => {
   let data = snapshot.val();
if (data != null) {
   members = data.members;
   members.push(added_email);
   console.log(members);
   set(ref(database, "/channel/" + channel_id + "/members/members"), members);
   set(ref(database, "/users/" + new_user_uid + "/channels/" + channel_id), {name: channel_name});
   cancel();
   document.getElementById("success").innerHTML = "Successfully added " + added_email;
}
else {
	members = [];
   	members.push(added_email);
   	console.log(members);
   	set(ref(database, "/channel/" + channel_id + "/members/members"), members);
   	set(ref(database, "/users/" + new_user_uid + "/channels/" + channel_id), {name: channel_name});
   	cancel();
   	document.getElementById("success").innerHTML = "Successfully added " + added_email;
	
}
 });
}
 else {
  var div = document.getElementById("manage_users");
  let error = document.createElement("p");
  let error_text = document.createTextNode("The user " + added_email + " does not exist.");
  error.appendChild(error_text);
  error.style.color = "red";
  div.appendChild(error);
 }
});

 
}
window.add_user = add_user;

function manage_users() {
 var div = document.getElementById("add-arcs");
  div.style.visibility = "visible";
  div.innerHTML = "<div style='padding: 10px;'>" + 
  "<h1>Add a member</h1>" + 
  "<h4>Email</h4>" + 
  "<input type='text' id='email'></input>" + 
  '<button onclick="submit()">Submit</button>'+
  '<button onclick="cancel()">Cancel</button>'+
  '<div><h1>Members</h1>'+
'<table id="members_list"><tbody></tbody></table></div>'+
  '</div>';
get(child(dbRef, "/channel/" + channel_id + "/members/members")).then((snapshot) => {
	let table = document.getElementById("members_list");
	let data = snapshot.val();
	console.log(data);
	if (data != null) {
	for(let n = 0; n < data.length; n++) {
			var row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			var name = document.createElement("p");
			name.style.color = "white";
			var nameNode = document.createTextNode(data[n]);
			name.append(nameNode);
			cell.append(name);
			let delete_cell = row.insertCell(-1);
			let delete_button = document.createElement("button");
			let delete_icon = document.createElement("img");
			delete_icon.setAttribute("src","./assets/delete_icon.png");
			delete_icon.setAttribute("width","50px");
			delete_button.setAttribute("onclick","delete(" + data[n] + ")");
			delete_button.appendChild(delete_icon);
			delete_cell.appendChild(delete_button);
			let admin_cell = row.insertCell(-1);
			let set_admin = document.createElement("button");
			set_admin.setAttribute("onclick","admin()");
			let admin_btn_text = document.createTextNode("Make admin");
			set_admin.appendChild(admin_btn_text);
			admin_cell.appendChild(set_admin);
		
	}
	}
	else {
		var row = table.insertRow(-1);
		var cell = row.insertCell(-1);	
		var text = document.createTextNode("There are no non-admin members.");
		cell.appendChild(text);
	}
});
}
window.manage_users = manage_users;
function unsubscribe() {
	get(child(dbRef, "/push/tokens/" + uid)).then((snapshot) => {
		let data = snapshot.val();
		let token = data.token;
		set(ref(database,"/push/unsubscribe/" + uid), {token: token, channel_id: channel_id});
	});
}
window.unsubscribe = unsubscribe;
function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
	let push_button = document.getElementById("arc-push");
      if (push_button) {
      	push_button.setAttribute("onclick","unsubscribe()");
	push_button.innerHTML = "Disable notifications";
      }
	getToken(messaging, {vapidKey: "BFN_4xdvMbKPLlLtMDMiD5gyRnO7dZVR-LQArRYxwuOn3dnZbF_XUbaw3g72p4-NsCyPE-xhYG8YpWHJ0r3goBk"}).then((currentToken) => {
	if(currentToken) {
		console.log(currentToken);
		set(ref(database, "/push/tokens/" + uid), {token: currentToken, channel: channel_id});
		if ('serviceWorker' in navigator) {
 		 navigator.serviceWorker.register('../firebase-messaging-sw.js').then((registration) => {console.log('Service Worker registered with scope:', registration.scope);}).catch((error) => 
			 {console.error('Service Worker registration failed:', error);});
		}
			}  
	else {
		console.log("no token");    
	}
    });
    }
                                        });
}
window.requestPermission = requestPermission; 
function enablePush() {
	let enabled = true;
	if (enabled) {
		get(child(dbRef, "/channel/" + channel_id + "/push")).then((snapshot) => {
			let data = snapshot.val();
			if (data != null) {
				data.push(uid);
				set(ref(database, "/push/channels/" + channel_id), {channel_id: channel_id, push: true});
				set(ref(database, "/channel/" + channel_id + "/push/"), data);
				requestPermission();
			}
			else {
				let data = [uid];
				set(ref(database, "/channel/" + channel_id + "/push/"), data);
				
			}
		});
	} 
}
window.enablePush = enablePush;


function get_date() {
	msg_date = new Date(); 
  console.log(msg_date); 
	let month = msg_date.getMonth();
	if(month < 10) {
		String(month);
		month = "0" + month;
	}
	else {
		String(month);
	}
	let day = msg_date.getDate();
	if(day < 10) {
		String(day);
		day = "0" + day;
	}
	else {
		String(day);
	}
	let hours = msg_date.getHours();
	if(hours < 10) {
		String(hours);
		hours = "0" + hours;
	}
	else {
		String(hours);
	}
	let minutes = msg_date.getMinutes();
	if(minutes < 10) {
		String(minutes);
		minutes = "0" + minutes;
	}
	else {
		String(minutes);
	}
	let seconds = msg_date.getSeconds();
	if(seconds < 10) {
		String(seconds);
		seconds = "0" + seconds;
	}
	else {
		String(seconds);
	}
  	return String(msg_date.getFullYear()) + month + day + hours + minutes + seconds;
}

function upload() {
	let file = document.getElementById("file").files;
	for(let n = 0; n < file.length; n++) {
		let date_for_data = new Date();
		date_for_data = String(date_for_data);
		let path = "users/" + uid + "/" + file[n].name;
		upload_image(path,file[n]);
		let message_data = {
			type: "image",
			content: path,
			date: date_for_data,
			creator: uid,
			channel_name: channel_name,
			displayName: display_name,
			channel_id: channel_id,
		};
		let message_date = get_date();
		console.log(get_date());
		let message_id = Math.floor(Math.random()*1000000);
		message_id = message_id + 1000000;
		set(ref(database, "/channel/" + channel_id + "/messages/" + message_date + message_id), message_data);
		let div = document.getElementById("upload");
		div.innerHTML = '<input type="text" id="messagebox" value="Type here"><button onclick="send()">Send</button><button onclick="start_upload()">Upload</button>';
		
	}
}
window.upload = upload;


function start_upload() {
	let div = document.getElementById("upload");
	div.innerHTML = "";
	let input = document.createElement("input");
	input.setAttribute("type","file");
	input.setAttribute("accept","image/*");
	input.setAttribute("id","file");
	div.appendChild(input);
	let submit_button = document.createElement("button");
	submit_button.setAttribute("onclick","upload()");
	let submit_button_text = document.createTextNode("Submit");
	submit_button.appendChild(submit_button_text);
	div.appendChild(submit_button);
}
window.start_upload = start_upload;
function send() {
  get(child(dbRef, "/push/channels/" + channel_id)).then((snapshot) => {
  	let message_id = Math.floor(Math.random()*1000000);
  	message_id = message_id + 1000000;
  	let content = document.getElementById("messagebox").value;
  	document.getElementById("messagebox").value = "";
  	msg_date = new Date(); 
  	console.log(msg_date); 
  	let msg_date_2 = String(msg_date);
  	let send_date = get_date();
  	let data = {
	  channel_name: channel_name,
	  creator: uid,
	  displayName: display_name,
	  content: content,
	  date: msg_date_2,
	  channel_id: channel_id,
  	};
  set(ref(database, "/channel/" + channel_id + "/messages/" + send_date + message_id), data);
	  if(snapshot.val()) {
		  set(ref(database, "/push/messages/" + send_date + message_id),data);
	  }
  });
}
window.send = send;

var running_listener = false;
var interval;
var run_time = 0;
function typing_check() {
	if(run_time == 0) {
		console.log("Run time check passed");
		run_time += 1;
	}
	else {
		let typing_ref = ref(database, "/channel/" + channel_id + "/typing/" + uid);
		remove(typing_ref);
		console.log("Typing check killed");
		running_listener = false;
		clearInterval(interval);
	}
}
function type_event() {
	if (running_listener == false) {
			console.log("Starting listener");
			let updates = {};
			let data = {typing: uid};
			updates['/channel/' + channel_id + "/typing/" + uid] = data;
			update(dbRef, updates);
			running_listener = true;
	}
	else {
		run_time = 0;
		clearInterval(interval);
		interval = setInterval(typing_check,2000);
		console.log("Interval set");
	}
}


async function append_people_typing(list) {
	let people_typing_msg = "";
	let row = document.getElementById("typing-row");
	console.log(list);
	if(list.length > 0) {
		for(let n = 0; n < list.length; n++) {
			await get(child(dbRef, "users/" + list[n] + "/basic_info")).then((snapshot) => {
				let data = snapshot.val();
				let type_name = data.displayName;
				if (list.length > 1) {
					people_typing_msg += type_name + ",";
				}
				else {
					people_typing_msg = type_name + " is typing...";
				}
			});
		}
		if(list.length == 1) {
			row.innerHTML = people_typing_msg;
		}
		else {
			row.innerHTML = people_typing_msg + " are typing...";
		}
	}
	else {
		row.innerHTML = "";
	}
}

function show_channel() {
  var channel_fields = '' + 
'<div id="container" class="container">' + 
'<div id="main" class="box">' + 
'<section id="open-section">' + 
'        <h1 id="channel_name">Channel name</h1>' + 
'        <p id="success"></p>' + 
'    <button id="manage_button" onclick="manage_users()">Manage arc</button>' + 
'    <button id="arc-push" onclick="requestPermission()">Enable Arc Push</button>' + 
'    </section>' + 
'    ' + 
'<section id="chatbox">' + 
'    <div id="channels-table">' + 
'            <div id="messagelog-row">' + 
'                <div id="msg-contain"></div>' + 
'            </div>' + 
'            <div id="typing-row"></div>' + 
'                    <div id="upload">' + 
'                                    <input type="text" id="messagebox" onfocus="this.value=\'\'" value="Type here">' + 
'                                ' + 
'                                ' + 
'                                    <button onclick="send()">Send</button>' + 
'                                ' + 
'                            ' + 
'                                    <button onclick="start_upload()">Upload</button>' + 
'                    </div>' + 
'    </div>' + 
'</section>' + 
'</div> <!-- end box -->' + 
'<div id="add-arcs" class="box overlay" style="color: white;background-color: black;visibility: hidden;"></div> <!-- end overlay -->' + 
'</div> <!-- end container -->' + 
'';
  div.innerHTML = channel_fields;
  stylesheet.setAttribute("href","channel.css");
}

function load_channel(id) {
  document.getElementById("username").innerHTML = user.displayName;
   get(child(dbRef, '/channel/' + channel_id + '/messages')).then((snapshot) => {
      let data =  snapshot.val();
	if (data != null) {
       		console.log(data);
		let input = document.getElementById("messagebox");
		input.addEventListener("keydown",type_event);
	}
	   else {
		let message_box = document.getElementById("msg-contain");
		message_box.innerHTML = "<p>This is the start of this channel!</p>";
	   }
	}).catch((error) => {
		console.log(error);
     document.getElementById("main").innerHTML = "<h1>Error</h1><br><p>There was an error loading this channel.</p><a href='./dashboard.html'>Return to dashboard</a>";
	});
    get(child(dbRef, '/channel/' + channel_id + '/members/admin')).then((snapshot) => { // Reference to Arc Push
	    let data = snapshot.val();
	    console.log(data);
	    let push_button = document.getElementById("arc-push");
	    let manage_button = document.getElementById("manage_button");
	    if (Object.values(data).includes(user.email)) {
		   // enablePush();
	    } 
	    else {
		// push_button.style.display = "none";
		manage_button.style.display = "none";
	    }
	    
    });
    var data_ref = ref(database, "/channel/" + channel_id + "/basic_data/");
    onValue(data_ref, (snapshot) => {
      let data = snapshot.val();
      document.getElementById("channel_name").innerHTML = data.name;
      document.getElementById("title").innerHTML = data.name;
      channel_name = data.name;
    });
    var message_ref = ref(database, "/channel/" + channel_id + "/messages/");
    onChildAdded(message_ref, (snapshot) => {
      let message = snapshot.val();
      let message_box = document.getElementById("msg-contain");
      get(child(dbRef, "/users/" + message.creator + "/basic_info")).then((snapshot2) => {
	let user_data = snapshot2.val();
        let date = new Date(message.date);
        let datetime = " | on " + String(date.getMonth()+1) + "/" + String(date.getDate()) + "/" + String(date.getFullYear()) + " at " + String(date.getHours()) + ":" + String(date.getMinutes());
        let box = document.createElement("div");
        box.setAttribute("class","message");
        let username_entry = document.createElement("h4");
        let textNode = document.createTextNode(user_data.displayName + datetime);
        username_entry.appendChild(textNode);
        box.appendChild(username_entry);
	if (message.type == null) {
        	let content = document.createElement("p");
        	let textNode2 = document.createTextNode(message.content);
        	content.appendChild(textNode2);
        	box.appendChild(content);
		message_box.appendChild(box);
		message_box.scrollTop = message_box.scrollHeight - message_box.clientHeight;
	}
	else {
		let path = message.content;
		download_image(box, message_box, path);
	}
    });
    });

	
	var chat_type_ref = ref(database, "/channel/" + channel_id + "/typing/");
	onChildAdded(chat_type_ref, (snapshot) => {
		let data = snapshot.val();
		data = Object.values(data);
		people_typing.push(data[0]);
		append_people_typing(people_typing);
	});
	onChildRemoved(chat_type_ref, (snapshot) => {
		let data = snapshot.val();
		data = Object.values(data);
		let index = people_typing.indexOf(data[0]);
		people_typing.splice(index,1);
		append_people_typing(people_typing);
	});
	var push_ref = ref(database, "/push/channels/" + channel_id);
	onValue(push_ref, (snapshot) => {
		let data = snapshot.val();
		if (data != null) {
			get(child(dbRef, "/channel/" + channel_id + "/push")).then((snapshot) => {
				let button = document.getElementById("arc-push");
				let data2 = snapshot.val();
				console.log(data2);
				if (data2 != null && !(Object.values(data2).includes(uid))) {
						button.style.display = "inline";
						button.innerHTML = "Enable notifications";
					}
			});
		}
	});
}
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
  }).catch((error) => {
  // An error happened.
  });
}
window.logout = logout;
export function create() {
channel_id = Math.floor(Math.random()*99999);
 let admin = [user_email];   
 let name = document.getElementById("name").value;
 set(ref(database, "/channel/" + channel_id + "/members/"),{admin: admin});
 set(ref(database, "/channel/" + channel_id + "/basic_data"), {name: name});
 set(ref(database, "users/" + uid + "/channels/" + channel_id), {type: "owner"});
 var url = new URL("https://jcamille2023.github.io/arc/channel");
 show_channel();
 load_channel(channel_id);
 
}
window.submit = submit;

export function join(e) {
 var url = new URL("https://jcamille2023.github.io/arc/channel");
 url.searchParams.append('channel_id', e);
 console.log(url);
 window.location.href = url;
}
window.join = join;

export function cancel_create() {
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
  '<button onclick="create()">Submit</button>'+
  '<button onclick="cancel_create()">Cancel</button>'+
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

function show_header() {
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
'                    <a href="javascript:show_dashboard()">Dashboard</a>' + 
'                </td>' + 
'                <td><a href="javascript:logout()">Sign out</a></td>' + 
'</tr>' + 
'            </tbody>' + 
'        </table>' + 
'';
    header.innerHTML = header_fields;
}

function show_dashboard() {
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
}
window.show_dashboard = show_dashboard;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    show_header();
    show_dashboard();
    activate_arc_reference();
    let basic_info = {
     displayName: user.displayName,
     email: user.email,
    };
    set(ref(database, "users/" + uid + "/basic_info"), basic_info);
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
    header.innerHTML = "";
  document.getElementById("sign-in-button").setAttribute("onclick","login()");
    // ...
  }
});
