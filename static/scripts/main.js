$(".homeSouth").click(function() {
    var offset = 60;
    if($(window).width() < 992) {
        offset = 54;
    }
    $('html,body').animate({
        scrollTop: $("#aboutMe").offset().top - offset},'slow');
});



var mouseOverToggle = 1;
function mouseOver() {
    mouseOverToggle++;

    if(mouseOverToggle % 2 == 0) {
        $('.backBlur').css({
            "-webkit-transition":"all 0.3s ease-out",
            "transition":"all 0.3s ease-out",
            "background-color":"rgba(0,0,0,0)"
        });
    }
    else {
        $('.backBlur').css({
            "-webkit-transition":"all 0.3s ease-out",
            "transition":"all 0.3s ease-out",
            "background-color":"rgba(0,0,0,0.5)"
        });
    }
}
