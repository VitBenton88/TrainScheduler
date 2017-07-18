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

	//FIREBASE END ----------------------

	
	$('.submit').click(function(){
		event.preventDefault();
		var newTrainName = $('#TrainName').val().trim();
		var newDestination = $('#Destination').val().trim();
		var newFirstTrainTime = $('#FirstTrainTime').val().trim();
		var newFreq = $('#Freq').val().trim();
		var currentTime = $.now();
		var nextArrival = currentTime + newFreq;
		var minutesAway = nextArrival - currentTime;

		//if any input in form is blank, alert and stop code:
		if (newTrainName === ''||newDestination === ''||newFirstTrainTime === ''||newFreq === ''){
			$('.alert-danger').css('display','initial')
			return;
		}

		else {
			$('.alert-danger').css('display','none')
		};

		//create new table row from user input:
		$('table').append('<tr><td>' + newTrainName + '</td><td>' + newDestination + '</td><td>' + newFreq + '</td><td>' + newFirstTrainTime + '</td><td>' + minutesAway + '</td></tr>')

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};
	});

//----------------------------------------------------------------END OF SCRIPT	
});