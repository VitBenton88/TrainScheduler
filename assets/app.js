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


	//	DISPLAY CURRENT TIME --------------------
	

	function publishTime (){
		var currentTimeFormat = "hh:mm:ss A";
		var currentTime = moment(moment(), currentTimeFormat);
		var currentTimeFormatted = currentTime.format(currentTimeFormat);
		$('#theTime').html('Current Time: ' + currentTimeFormatted)
		};

	setInterval(publishTime, 1000);

	//	DISPLAY CURRENT TIME END --------------------

$(document).ready(function() {
	
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
	});

	function emptyTableBody (){
		$('tbody').empty();
	};

	//listen for additions made and publish accordingly, by timestamp:
	function calculateAndPublish (){
		database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){

			var FBname = snapshot.val().Name;//capture train name from firebase
			var FBdestination = snapshot.val().Destination;//capture destination from firebase
			var FBfreq = snapshot.val().Freq;//capture frequency from firebase
			var FBarrivalTime = snapshot.val().firstArrival;//capture arrival time from firebase
			var FBkeyValue = snapshot.key;//store key name to store in data attr, which is used for deleting

   			var militaryFormat = "HH:mm";//set format for military time display
   			var normalFormat = "hh:mm A";//set format for normal time display
    		var militaryArrivalTime = moment(FBarrivalTime, militaryFormat);//format arrival time from firebase to display as military time
    		var normalArrivalTime = moment(FBarrivalTime, normalFormat);//format arrival time from firebase to display as normal time
    		var nextArrival;
			var minAway;

			function negativeMinAwayFix (){//if minutes away comes out to negative, reset time to original start time
				if (minAway < -1){
					minAway = minAway + 1440;//add total minutes in day (1440) to estimate because this will be a negative number otherwise
				};
			};

			function alertArrivingNow(){//if minutes away is zero, change digits to string alerting of immenent arrival
				if (minAway === 0){
					minAway = '<p class="arrivingAlert">ARRIVING NOW</p>';
				};
			};

			function publishData(){//post to HTML:
				$('tbody').append('<tr><td>'
				 + FBname
				 + '</td><td>' 
				 + FBdestination
				 + '</td><td>' 
				 + FBfreq
				 + '</td><td>'
				 + nextArrival
				 + '</td><td>'
				 + minAway
				 + '</td><td>'
				 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-key =' + FBkeyValue + '></span>'
				 + '</td></tr>')
			};

			function calculateTimes (Frequency, FirstArrivalTime){

				for (var i = 0; i < 1440; i++) {//loop through minutes in day to cover all possibilities
					if (moment().isSameOrBefore(FirstArrivalTime)){//if the current time is less than or equal to the provided 'first arrival time'...
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(FirstArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the provided 'first arrival time' and will display in normal format
					}

					else {//if the current time is NOT less than or equal to the provided 'first arrival time'...
						FirstArrivalTime = moment(FirstArrivalTime).add(Frequency, 'm');//add the provided frequency to the provided 'first arrival time'
						minAway = moment(FirstArrivalTime).diff(moment(), "minutes",);//calculate difference between now and arrival time in minutes
						nextArrival = moment(normalArrivalTime, normalFormat).format(normalFormat);//the next arrival time will be the original 'first arrival time' in firebase because it is technically the next day
					};
				};

				negativeMinAwayFix();//check for negative minAway
				alertArrivingNow();//alert if train is arriving right now
			};
			
			calculateTimes(FBfreq, militaryArrivalTime);
			publishData();
    	});
	};

calculateAndPublish();
setInterval(emptyTableBody, 60000);
setInterval(calculateAndPublish, 60000);

	$('body').on('click','.glyphicon-remove',function(){//delete children from FB when remove symbol is clicked

		var captureRow = $(this).closest('tr');//capture row that is being deleted
		var capturedRowName = $(":first-child", captureRow).html();//capture name in the row that is being deleted
		var keyToDelete = $(this).attr('data-key');//capture key name that needs to deleted

		captureRow.remove();//delete row from html

		database.ref().once("value", function(snapshot){//ref FB database once ...

			database.ref().child(keyToDelete).remove();

			});
		});

//----------------------------------------------------------------END OF SCRIPT	
});