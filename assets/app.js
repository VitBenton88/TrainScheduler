$(document).ready(function() {
	$('.submit').click(function(){
		event.preventDefault();
		var newTrainName = $('#TrainName').val().trim();
		var newDestination = $('#Destination').val().trim();
		var newFirstTrainTime = $('#FirstTrainTime').val().trim();
		var newFreq = $('#Freq').val().trim();
		var currentTime = moment();
		var nextArrival = currentTime + newFreq;
		var minutesAway = nextArrival - currentTime;
		//if form is incorrectly filled out show alert and stop code:
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
		for (var i = 0; i < 3; i++) {
			$('form')[i].reset();
		};
	});

//----------------------------------------------------------------END OF SCRIPT	
});