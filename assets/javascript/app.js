// Initialize Firebase
var config = {
  apiKey: "AIzaSyCQmBSNHXpcE_tizj6gp7rDoNxqXyOmgzU",
  authDomain: "coders-corner-1525974035968.firebaseapp.com",
  databaseURL: "https://coders-corner-1525974035968.firebaseio.com",
  projectId: "coders-corner-1525974035968",
  storageBucket: "",
  messagingSenderId: "135660697800"
};
firebase.initializeApp(config);
var database = firebase.database();

var role = "Check-in";

$("#studentBtn").on("click", function(event){
    event.preventDefault();

    $(this).attr("class", "button btn-sm btn-success"); 
    $("#mentorBtn").attr("class", "button btn-sm btn-warning");
    role = "Student";
});

$("#mentorBtn").on("click", function(event){
    event.preventDefault();

    $(this).attr("class", "button btn-sm btn-success"); 
    $("#studentBtn").attr("class", "button btn-sm btn-warning");
    role = "Mentor";
});

var userInfo;
var idRef = database.ref("/users");
var currentID;

$("#goBtn").on("click", function(event){
    event.preventDefault();

    var name = $("#name").val();
    var q = $("#textarea").val();
    var tags = $("#tags").val();

    var stofQuery = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow&tagged="
    + tags + "&intitle=" + q;
    var mdnQuery = "https://developer.mozilla.org/en-US/search.json?locale=en-US&q=" + q + "%2B" + tags; //ajax query url's
    
    idRef.update({
      id: currentID
    })
    
    var newUser = {
      name: name,
      role: role,
      tags: tags,
      message: q,
      id: currentID
  }      

  // Uploads users data to the database
    userInfo = database.ref("/users").push(newUser);
    userInfo.onDisconnect().remove();

    if (name == ""){ //if name is blank display error
        $("#card-body2").append("<div style='background-color: red; color:white;'>Please enter Name</div>")
    }
    else if (role == "Check-in"){ //if role isn't selected display error
        $("#card-body2").append("<div style='background-color: red; color:white;'>Please select Student/Mentor</div>")
    }
    else if (role == "Student"){ //Change main div to fit student
        $("#card-body2").empty();
        $("#card-body2").append("<button id='refresh' class='button btn-primary float-right'>New Question</button>");
        $("#card-body2").append("<h5 class='card-title'>Possible Solutions</h5>");
        $.ajax({
          url: stofQuery,
          method: "GET"
      }).then(function(response){
          for (var i = 0; i < 5; i++) { //create variables for necessary items
              var docTitle = response.items[i].title;
              var docRating = "Rating: " + response.items[i].score;
              var articleURL = "<a href='" + response.items[i].link + "' target='_blank'>"
                + response.items[i].link + "<a>"; 
                var newDiv = $("<br><div class='card-text border border-dark rounded mx-auto'>");
                newDiv.append("<div id='articles'><b>" + docTitle + "</b></div>");
                newDiv.append("<div id='articles'>" + docRating + "</div>");
                newDiv.append("<div id='articles'>" + articleURL + "</div></div>");
                $("#card-body2").append(newDiv);
          }
      })

      $.ajax({
          url: 'https://cors-anywhere.herokuapp.com/' + mdnQuery,
          method: "GET"
      }).then(function(response){
          for (var i = 0; i < 5; i++) {
              var docTitle = response.documents[i].title;
              var docExcerpt = "'" + response.documents[i].excerpt.substr(0, 150) + "...'";
              var articleURL = "<a href='" + response.documents[i].url + "' target='_blank'>"
                + response.documents[i].url + "<a>"; 
                var newDiv = $("<br><div id='articles' class='card-text border border-dark rounded mx-auto'>");
                newDiv.append("<div id='articles'><b>" + docTitle + "</b></div>");
                newDiv.append("<div id='articles'>" + docExcerpt + "</div>");
                newDiv.append("<div id='articles'>" + articleURL + "</div></div>");
                $("#card-body2").append(newDiv);
          }
      })
        
      var chatLink = "http://deadsimplechat.com/CodersCorner" + currentID;
      $("iframe").attr("src", chatLink);
      $("#chatroom").removeClass("d-none");
    }  
    else { //Change main div to fit mentor
        $("#card-body2").empty();
        $("#card-body2").append("<h5 class='card-title'>Student Problems</h5>");
        
        idRef.on("child_added", function(snap){

          if(snap.val().role == "Student"){
            var newUserID = snap.val().id;
            var newIssue = $("<br><div id='prob" + newUserID + "' class='card-text border border-dark rounded mx-auto'>");
              newIssue.append("<h4>" + snap.val().name + "</h4><h5>" + snap.val().tags + "</h5><h5>" 
                + snap.val().message + "</h5>");
              newIssue.prepend("<button id='join" + newUserID + "' class='button btn-primary float-right joinButtons'"
                + " value='" + newUserID + "'>Join Chat</button></div>");
              $("#card-body2").append(newIssue);
          }
        })
    }

    $("#status").html("<h3><b>" + name + "</b></h3><h4>" + role + "</h4>");
    // fill in left part of page
    $("#gif").empty();
    var gif1=$("<img width=100% class='mb-2'>").attr("src","https://media.giphy.com/media/13f7pejozPXuta/giphy.gif");
    var gif2=$("<img width=100% class='mb-2'>").attr("src","https://media.giphy.com/media/v9fIPO9pbpdjG/giphy.gif");
    // var gif3=$("<img width=100% class='mb-2'>").attr("src","https://media.giphy.com/media/gJZS10CemXPRm/giphy.gif");
    $("#gif").append(gif1);
    $("#gif").append(gif2);
    $("#gif").append(gif3);

})
$(document).on("click", ".joinButtons", function(event){
  event.preventDefault();

  var chatLink = "http://deadsimplechat.com/CodersCorner" + $(this).val();
  $("iframe").attr("src", chatLink);
  $("#chatroom").removeClass("d-none");
})

$(document).on("click", "#refresh", function(event){
  event.preventDefault();
  window.location.href = window.location.href;
})
// ConnectionsRef refrences a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
// .info/connected is a special location provided by firebase that is updated
// every time the client's connection state changes.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes.
connectedRef.on("value", function(snap){
    // database.ref("/usercount", 1);s

    // if they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // var conUser = connectionsRef.push()
        // var count = parseInt(snap.val().userId);
        // count++;
        // snap.set("/usercount", count);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
        // conUser.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes.
// connectionsRef.on("value", function(snap){

//     // Display the users count in the html.
//     // The number of online users in the number of children in the connections list.

// });

idRef.on("value", function(snap){
    currentID = snap.val().id + 1;    
})

idRef.on("child_added", function(snap){

  if(snap.val().name){
    var newOnline = $("<div id='user" + snap.val().id + "'>");
      newOnline.append("<br><h4>" + snap.val().name + "</h4><h5>" + snap.val().role + "</h5></div>");
      $("#card3body").append(newOnline);
  }
})

idRef.on("child_removed", function(snap){

  if(snap.val().name){
    $("#prob" + snap.val().id).remove()
    $("#user" + snap.val().id).remove();
  }
})

// Creating firebase event for adding users to the database
// database.ref().on("child_added", function(childSnapshot, prevChildKey) {
//     // Storing everything into a variable
//     // var studentName = childSnapshot.val().name;
//     // var role = childSnapshot.val().role;
//     // var userTag = childSnapshot.val().tags;
//     // var comment = childSnapshot.val().message;
//     // $("#status").append(newUser);
// });




// animation circle
anime.timeline({loop: true})
  .add({
    targets: '.ml8 .circle-white',
    scale: [0, 3],
    opacity: [1, 0],
    easing: "easeInOutExpo",
    rotateZ: 360,
    duration: 1100
  }).add({
    targets: '.ml8 .circle-container',
    scale: [0, 1],
    duration: 1100,
    easing: "easeInOutExpo",
    offset: '-=1000'
  }).add({
    targets: '.ml8 .circle-dark',
    scale: [0, 1],
    duration: 1100,
    easing: "easeOutExpo",
    offset: '-=600'
  }).add({
    targets: '.ml8 .letters-left',
    scale: [0, 1],
    duration: 1200,
    offset: '-=550'
  }).add({
    targets: '.ml8 .bang',
    scale: [0, 1],
    rotateZ: [45, 15],
    duration: 1200,
    offset: '-=1000'
  }).add({
    targets: '.ml8',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1400
  });

anime({
  targets: '.ml8 .circle-dark-dashed',
  rotateZ: 360,
  duration: 8000,
  easing: "linear",
  loop: true
});
//end animation circle
// // Wrap every letter in a span
// $('.ml1 .letters').each(function(){
//     $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
//   });
  
  anime.timeline({loop: true})
    .add({
      targets: '.ml1 .letter',
      scale: [0.3,1],
      opacity: [0,1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 600,
      delay: function(el, i) {
        return 70 * (i+1)
      }
    }).add({
      targets: '.ml1 .line',
      scaleX: [0,1],
      opacity: [0.5,1],
      easing: "easeOutExpo",
      duration: 700,
      offset: '-=875',
      delay: function(el, i, l) {
        return 80 * (l - i);
      }
    }).add({
      targets: '.ml1',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });
//end line effect
