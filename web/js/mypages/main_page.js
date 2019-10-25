var quotes = $(".quotes");
    var quoteIndex = -1;
    
    function showNextQuote() {
        ++quoteIndex;
        quotes.eq(quoteIndex % quotes.length)
            .fadeIn(2000)
            .delay(2000)
            .fadeOut(2000, showNextQuote);
    }
$(document).ready(function(){
	//hover in sub items in top menu
/*$( ".mydropdown-nav li .dropdown-menu a" ).hover(function() {
		  $(this).parent().parent().find(".nav-link").attr("style", "color: #428bca !important");
		});
 //hover out sub items in top menu
	$( ".mydropdown-nav li .dropdown-menu a" ).mouseleave(function() {
		  $(this).parent().parent().find(".nav-link").attr("style", "color: white !important");
		});*/
	$('.carousel').carousel({
		  interval: 2000,
		  direction: "right"
		});
    showNextQuote();
});