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

	var key;//empty key variable for storing key in focues when updating

	function resetKey(){//reseting key variable after update is done
		key = '';
	};

	$('.submit').click(function(){
		event.preventDefault();
		var newTrainName = $('#TrainName').val().trim();
		var newDestination = $('#Destination').val().trim();
		var newFirstTrainTime = $('#FirstTrainTime').val().trim();
		var newFreq = $('#Freq').val().trim();

		// if any input in form is blank, alert and stop code:
		if (newTrainName === ''||newDestination === ''||newFirstTrainTime === ''||newFreq === ''){
			$('.addFormAlert').css('display','initial')
			return;
		}
		else {
			$('.addFormAlert').css('display','none')
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

		emptyTableBody();//empty table
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
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
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
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
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
			publishData();//listen for additions made and publish accordingly, by timestamp://query, capture data, post
    	});
	});

	$('body').on('click', '.update', function(){//initiate update on row
		key = $(this).attr('data-key');//capture key of current FB object

		var currentRow = $(this).closest('tr').children().filter(':first-child');//capture train name by going to first child of current row, which will always be the name
		var captureName = currentRow.html();//get html of name on this row

		$('.updateFormHeading').html('Update Train "' + captureName + '"');//plug in panel heading to include name of train being updated
	});

	$('.updateTrain').click(function(){
		event.preventDefault();
		var newTrainName = $('#updateTrainName').val().trim();
		var newDestination = $('#updateDestination').val().trim();
		var newFirstTrainTime = $('#updateFirstTrainTime').val().trim();
		var newFreq = $('#updateFreq').val().trim();

		// if any input in form is blank, alert and stop code:
		if (newTrainName === ''||newDestination === ''||newFirstTrainTime === ''||newFreq === ''){
			$('.updateFormAlert').css('display','initial')
			return;
		}
		else {
			$('.updateFormAlert').css('display','none')
		};

		$('body').on('click','.updateTrain',function(){//animation effect for update train scenario, hide update form and show rest
			$('.updateFormRow').hide(100);
			$('.addFormRow').show(500);
			$('.trainTable').show(500);
		});


		// store new train values to friebase:

		database.ref(key).update({

			Name: newTrainName,
			Destination: newDestination,
			Freq: newFreq,
			firstArrival: newFirstTrainTime,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};

		emptyTableBody();
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
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
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
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
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
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});//execute update, query, capture data, post to html

	});

	$('.cancelUpdate').click(function(){//cancel button on update train form
		event.preventDefault();
		//when click the app simply returns the default view
		$('.updateFormRow').hide(100);
		$('.addFormRow').show(500);
		$('.trainTable').show(500);

	});

	function emptyTableBody (){
		$('tbody').empty();
	};

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
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
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
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
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
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});

    	database.ref().orderByChild("dateAdded").on("child_changed", function(snapshot){

    		resetKey();

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
    	});

	$('body').on('click','.glyphicon-remove',function(){//delete children from FB when remove symbol is clicked

		var captureRow = $(this).closest('tr');//capture row that is being deleted
		var capturedRowName = $(":first-child", captureRow).html();//capture name in the row that is being deleted
		var keyToDelete = $(this).attr('data-key');//capture key name that needs to deleted

		captureRow.remove();//delete row from html

		database.ref().once("value", function(snapshot){//ref FB database once ...

			database.ref().child(keyToDelete).remove();

			});
		});

	function emptyAndUpdate (){
		emptyTableBody();
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
				$('tbody').append('<tr><td class="name" data-key =' + FBkeyValue + '>'
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
				 + '</td><td>'
				 + '<button type="submit" class="btn btn-success btn-xs update" data-key =' + FBkeyValue + '>Update'
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
			publishData();//listen for additions made and publish accordingly, by timestamp:
    	});
	};

	setInterval(emptyAndUpdate, 60000);

//----------------------------------------------------------------END OF SCRIPT	
});