$(document).ready(function() {
// Initialize Firebase
	var config = {
		    apiKey: "AIzaSyDIfwR9O2Fk-QAjzJVil8aBuvz_RMSUgJM",
		    authDomain: "trainscheduler-930e9.firebaseapp.com",
		    databaseURL: "https://trainscheduler-930e9.firebaseio.com",
		    projectId: "trainscheduler-930e9",
		    storageBucket: "trainscheduler-930e9.appspot.com",
		    messagingSenderId: "464054359921"
		  };
		  firebase.initializeApp(config);

		  var database = firebase.database();

	//FIREBASE END ----------------------


	
	$('.submit').click(function(){
		event.preventDefault();
		var newTrainName = $('#TrainName').val().trim();
		var newDestination = $('#Destination').val().trim();
		var newFirstTrainTime = $('#FirstTrainTime').val().trim();
		var newFreq = $('#Freq').val().trim();
		// var currentTime = $.now();
		// var nextArrival = currentTime + newFreq;
		// var minutesAway = nextArrival - currentTime;

		// if any input in form is blank, alert and stop code:
		// if (newTrainName === ''||newDestination === ''||newFirstTrainTime === ''||newFreq === ''){
		// 	$('.alert-danger').css('display','initial')
		// 	return;
		// }
		// else {
		// 	$('.alert-danger').css('display','none')
		// };

		// store new train values to friebase:

		database.ref().push({

			Name: newTrainName,
			Destination: newDestination,
			Freq: newFreq,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};
	});

	//$('.submit').click END -----------------------------------------------

	//publish two train objects, this is the default view:
	// database.ref().on("value", function(snapshot) {
	// 	$('tbody').append('<tr><td>' + snapshot.val().Train1.Name + '</td><td>' + snapshot.val().Train1.Destination + '</td><td>' + snapshot.val().Train1.Freq + '</td><td>' + snapshot.val().Train1.NextArr + '</td></tr>')
	// 	$('tbody').append('<tr><td>' + snapshot.val().Train2.Name + '</td><td>' + snapshot.val().Train2.Destination + '</td><td>' + snapshot.val().Train2.Freq + '</td><td>' + snapshot.val().Train2.NextArr + '</td></tr>')  	
	// });

	//listen for additions made and publish accordingly:
	database.ref().on("child_added", function(snapshot) {
		$('tbody').append('<tr><td>' + snapshot.val().Name + '</td><td>' + snapshot.val().Destination + '</td><td>' + snapshot.val().Freq + '</td><td>' + snapshot.val().NextArr + '</td></tr>')
	});

//----------------------------------------------------------------END OF SCRIPT	
});