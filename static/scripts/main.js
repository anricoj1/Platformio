$(document).ready(textShift);
$(window).resize(textShift);

var pathToggle = 0;
var psdToggle = 0;

$(".homeSouth").click(function() {
    var offset = 60;
    if($(window).width() < 992) {
        offset = 54;
    }
    $('html,body').animate({
        scrollTop: $(".aboutMe").offset().top - offset},'slow');
});

function textShift() {
    var width = $(window).width();
    if(!pathToggle && (width < 408 || (width < 992 && width >= 768))) {
        document.getElementById('pathLink').innerHTML = "A* Pathfinding";
        pathToggle = 1;
    }
    else if (pathToggle && ((width >= 408 && width < 768) || width >= 992)) {
        document.getElementById('pathLink').innerHTML = "A* Pathfinding Command Line";
        pathToggle = 0;
    }
    if(!psdToggle && $(window).width() < 397) {
        document.getElementById('PSDPlug').innerHTML = "Timelapse PSD Plugin";
        psdToggle = 1;
    }
    else if (psdToggle && $(window).width() >= 397) {
        psdToggle = 0;
        document.getElementById('PSDPlug').innerHTML = "Timelapse Photoshop Plugin";
    }
}

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
