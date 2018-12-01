var myKey = '20817B5E-D66B45A3-9DD48C56-7945C8AC'; // Attempted to hide this with .gitignore, but I kept running into errors when hosting it using Github pages, because it is built with Jekyll and requires a different kind of Javascript file loading.

$(document).ready(function() {
    $('#fullpage').fullpage({
		//options here
		autoScrolling:true,
        navigation: true,
        navigationPosition: 'left',
		scrollHorizontally: true,
        scrollingSpeed: 700,
        slidesNavigation: true,
        licenseKey: myKey,
        dragAndMove: true
	});
    
    // For responsiveness: if the screen size is smaller than 540 px (small screen), then hide the navigation bar so that it does not overlap with the content. 
    
    $(window).resize(function() { 
        if ($(window).width() < 540) { 
            $("#fp-nav.fp-left").css("display", "none");
        }
        else { 
            $("#fp-nav.fp-left").css("display", "block");
        }
    });
});