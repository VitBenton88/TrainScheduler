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

		// if any input in form is blank, alert and stop code:
		if (newTrainName === ''||newDestination === ''||newFirstTrainTime === ''||newFreq === ''){
			$('.alert-danger').css('display','initial')
			return;
		}
		else {
			$('.alert-danger').css('display','none')
		};

		// store new train values to friebase:

		database.ref().push({

			Name: newTrainName,
			Destination: newDestination,
			Freq: newFreq,
			firstArrival: newFirstTrainTime,
			dateAdded: firebase.database.ServerValue.TIMESTAMP,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};
	//$('.submit').click END -----------------------------------------------
	});

	//listen for additions made and publish accordingly, by timestamp:
		database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBname = snapshot.val().Name;//capture train name from firebase
			var FBdestination = snapshot.val().Destination;//capture destination from firebase
			var FBfeq = snapshot.val().Freq;//capture frequency from firebase
			var FBarrivalTime = snapshot.val().firstArrival;//capture arrival time from firebase

   			var militaryFormat = "HH:mm";//set format for military time display
   			var normalFormat = "hh:mm A"//set format for normal time display
    		var militaryArrivalTime = moment(FBarrivalTime, militaryFormat);//format arrival time from firebase into military time
			var minAway = moment(militaryArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
			var displayArrivalTimeNORM = moment(FBarrivalTime, normalFormat).format(normalFormat);//display next arrival time in html as normal format

			//post to HTML:
			$('tbody').append('<tr><td>'
			 + snapshot.val().Name
			 + '</td><td>' 
			 + snapshot.val().Destination 
			 + '</td><td>' 
			 + snapshot.val().Freq 
			 + '</td><td>'
			 + displayArrivalTimeNORM
			 + '</td><td>'
			 + minAway
			 + '</td></tr>')

    });

//----------------------------------------------------------------END OF SCRIPT	
});