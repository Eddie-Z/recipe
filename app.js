 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyDWhTdGr6jLMQWC97iFTzEpXQme-W1nr8s",
  authDomain: "gymproject-b7d58.firebaseapp.com",
  databaseURL: "https://gymproject-b7d58.firebaseio.com",
  projectId: "gymproject-b7d58",
  storageBucket: "gymproject-b7d58.appspot.com",
  messagingSenderId: "752621493770",
  appId: "1:752621493770:web:93c76b5c36ae74c6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var messagesRef = firebase.database().ref('message');



// define UI variables
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const repInput = document.querySelector('#reps');
const setInput = document.querySelector('#sets');
const youtubeInput = document.querySelector('#youtubeURL')

// load all event listeners
loadEventListeners();

function loadEventListeners() {
  document.addEventListener('DOMContentLoaded', getTasks); // DOM load event
  form.addEventListener('submit', addTask);
  taskList.addEventListener('click', removeTask);
  clearBtn.addEventListener('click', clearTasks);
  filter.addEventListener('keyup', filterTasks);
}

function addTask(e) {
  if(taskInput.value === "") {
    alert('Please, add a task');
  }
  else {
    saveMessage(taskInput.value, repInput.value,setInput.value,youtubeInput.value);
    
    // clear the input
    taskInput.value = "";
  }  
  e.preventDefault();
}

function removeTask(e) {

  if(e.target.parentElement.classList.contains('delete-item')) {
    const element = e.target.parentElement.parentElement;

    if(confirm('Are you sure you want to delete "' +  element.innerText + '"?')) {
      element.remove();

      // remove from local storage
      removeTaskFromLocalStorage(element.innerText);
    }
  }
}

//removing 
function removeTaskFromLocalStorage(taskItem) {
  var value=taskItem.indexOf(" ");
  var valueString=taskItem.slice(0,value);
  messagesRef.orderByChild('value').equalTo(valueString).once("value").then(function(snapshot) {
  snapshot.forEach(function(child) {
    child.ref.remove();
    console.log("Removed!");
  })
});
}

function clearTasks() {

  if(confirm('Oh yeah?')) {
    // taskList.innerHTML = "";

    // faster way
    while(taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  }

  // clear from LS
  clearTasksFromLocalStorage();
}

function clearTasksFromLocalStorage() {
  messagesRef.set(null);
}

// function filterTasks(e) {
//   const text = e.target.value.toLowerCase();
  
//   document.querySelectorAll('.collection-item').forEach(function(task) {
//     const item = task.firstChild.textContent;

//     if(item.toLowerCase().indexOf(text) != -1) {
//       task.style.display = 'block';
//     }
//     else {
//       task.style.display = 'none';
//     }
//   });
// }

//save into firebase
function saveMessage(value, rep, set, url){
  var newMessageRef=messagesRef.push();
  newMessageRef.set({
    value:value,
    rep:rep,
    set:set,
    url:url
  });
}

//retrieve data from firebase
function getTasks() {

    messagesRef.on("child_added",snap => 
    {
      //create elements
      var value = snap.child("value").val();
      var url = snap.child("url").val();
      var set = snap.child("set").val();
      var rep = snap.child("rep").val();
      createElements(value,rep,set,url);
      console.log(snap.val());
    });
  
}

// create list
function createElements(value, rep, set, url) {
  // create li element
  const li = document.createElement('li');
  const video = document.createElement('iframe');  

  li.className = 'collection-item';
  li.appendChild(document.createTextNode(value +" Reps:"+ rep + " Sets:" +set ));

  //video.src="https://www.youtube.com/embed/G7A42qFvUdc?controls=0";
  video.src=createEmbeddedLink(url);
  

  // create new link element
  const link = document.createElement('a');
  link.className = 'delete-item secondary-content';
  link.innerHTML = '<i class="fa fa-remove"></i>';
  
  li.appendChild(link);
  linebreak = document.createElement("br");
  li.appendChild(linebreak);
  li.appendChild(video);
  // append li to ul
  taskList.appendChild(li);
  
}

function createEmbeddedLink(link){
  let str = link;
  var pos = str.indexOf("watch?v=");
  var beginLink = str.slice(0,pos);
  var endLink = str.slice(pos+8,str.length);
  var embededLink=beginLink+"embed/"+endLink+"?controls=0";
  return embededLink; 
}

