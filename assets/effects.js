$(document).ready(function() {

	$('body').on('mouseenter','.glyphicon-remove',function(){
		$(this).animate({color:'red'},200);
		$(this).closest('tr').animate({backgroundColor:'#eea7a7'},200);
	});

	$('body').on('mouseout','.glyphicon-remove',function(){
		$(this).animate({color:'black'},200);
		$(this).closest('tr').animate({backgroundColor:'white'},200);
	});



//----------------------------------------------------------------END OF SCRIPT	
});