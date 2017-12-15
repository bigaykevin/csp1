$('document').ready(function(){
 
 // alert ('rgba(66,200,206,' + (400 /300 * .8) + ')' );
 // alert('rgba(66,200,206,'+')');

$(window).scroll(function(){ 

	if ($(window).width() >= 768){ 

		var height = $(this).scrollTop();

		$('#menu').css('background-color', function(){

		 if(height < 400){	
		 var colorOpacity = 'rgba(66,200,206,' + (( height / 400 ).toFixed(2)) + ')';
		 return colorOpacity

		 } 
		 return 'rgba(66,200,206,0.8)'

	    });

	} else {

		$('#menu').css('background-color','rgba(66,200,206,0.8)');

	}
	
});



$('.toggle').click(function(){

	$('nav').toggleClass('hide-menu');
	$('.toggle-icon').toggleClass('open');

});

$('.disclaimer').mouseenter(function(){
	var n = $(document).height();
	$('.disclaimer-par').addClass('disclaimer-appear');
	$('html, body').animate({scrollTop: n}, 2000);
});



$('.form-signup-btn').click(function(){
	$('.lets-talk').fadeOut(900);
	$(this).fadeOut(900);
	$('.signup-form').addClass('reveal');


});





   






});