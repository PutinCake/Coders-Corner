// var stofQuery = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow&tagged="
//     + tags + "&intitle=" + q;
// var mdnQuery = "https://developer.mozilla.org/en-US/search.json?locale=en-US&q=" + q + " " + tags; //ajax query url's

// $.ajax({
//     url: stofQuery,
//     method: "GET"
// }).then(function(response){
//     for (var i = 0; i < 5; i++) { //create variables for necessary items
//         var docTitle = response.items[i].title;
//         var docRating = "Rating: " + response.items[i].score;
//         var articleURL = "<a href='" + response.items[i].link + "'>"
//           + response.items[i].link + "<a>"; 
//           //need to append to page
//     }
// })

// $.ajax({
//     url: mdnQuery,
//     method: "GET"
// }).then(function(response){
//     for (var i = 0; i < 5; i++) {
//         var docTitle = response.documents[i].title;
//         var docExcerpt = "'" + response.documents[i].excerpt.substr(0, 150) + "...'";
//         var articleURL = "<a href='" + response.documents[i].url + "'>"
//           + response.documents[i].url + "<a>"; 
//           //need to append to page
//     }
// })
// Initialize Firebase
// var config = {
//    apiKey: "AIzaSyCQmBSNHXpcE_tizj6gp7rDoNxqXyOmgzU",
//    authDomain: "coders-corner-1525974035968.firebaseapp.com",
//    databaseURL: "https://coders-corner-1525974035968.firebaseio.com",
//    projectId: "coders-corner-1525974035968",
//    storageBucket: "",
//    messagingSenderId: "135660697800"
//  };
//  firebase.initializeApp(config);
//  var database = firebase.database();

var isStudent = 0;

$("#studentBtn").on("click", function(event){
    event.preventDefault();

    $(this).attr("class", "button btn-sm btn-success"); 
    $("#mentorBtn").attr("class", "button btn-sm btn-warning");
    isStudent = 1;
});

$("#mentorBtn").on("click", function(event){
    event.preventDefault();

    $(this).attr("class", "button btn-sm btn-success"); 
    $("#studentBtn").attr("class", "button btn-sm btn-warning");
    isStudent = -1;
});

$("#goBtn").on("click", function(event){
    event.preventDefault();

    var name = $("#name").val();
    var q = $("#textarea").val();
    var tags = $("#tags").val();

    // database.ref().push({
    //     name: name,
    //     tags: tags,
    //     problem: q,
    // })

    if (name == ""){ //if name is blank display error
        $("#card-body2").append("<div style='background-color: red; color:white;'>Please enter Name</div>")
    }
    else if (parseInt(isStudent) == 0){ //if role isn't selected display error
        $("#card-body2").append("<div style='background-color: red; color:white;'>Please select Student/Mentor</div>")
    }
    else if (isStudent == 1){ //Change main div to fit student
        $("#card-body2").empty();
    }  
    else { //Change main div to fit mentor
        $("#card-body2").empty();
    }
    
})