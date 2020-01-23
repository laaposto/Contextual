function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
}
$(function () {

    $.fn.inputFilter = function(inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
    $("#time_user").inputFilter(function(value) {
        return /^\d*$/.test(value); });
    var video = gup('video');
    if (video.indexOf('facebook') > -1) {
        $('#form').append('<div class="video"> <img src="imgs/facebook-placeholder.jpg"> <iframe width="360" height="305" frameborder="0" src="https://www.facebook.com/v2.3/plugins/video.php?allowfullscreen=true&autoplay=false&container_width=360&height=305&href=' + video + '&locale=en_US&sdk=joey"> </iframe> </div>')
    }
    else {
        $('#form').append('<div class="video"> <img src="imgs/youtube-placeholder.jpg"> <iframe width="360" height="305" frameborder="0" src="https://www.youtube.com/embed/' + youtube_parser(video) + '"> </iframe>  </div>');
    }

    var doubleLabels = [

        "<i>1</i><span>Uncertain</span>",
        "<i>2</i><span></span>",
        "<i>3</i><span></span>",
        "<i>4</i><span></span>",
        "<i>5</i><span>Confident</span>"

    ];

    $("#double-label-slider")
        .slider({
            max: 5,
            min: 1,
            value: 0,
            animate: 400
        })
        .slider("pips", {
            rest: "label",
            labels: doubleLabels
        });

    $('.ui-slider-pip-selected').removeClass('ui-slider-pip-selected');
    $('#caa_link a').attr('href', 'https://caa.iti.gr/?video=' + video);

    $(".list_buttons input:checkbox").change(function () {
        if (this.checked) {
            if ($(this).val() === "none") {
                $(".list_buttons input:checkbox").prop('checked', false)
                $(this).prop('checked', true);
            }
            else {
                $(".list_buttons input:checkbox[value=none]").prop("checked", false);
            }
        }
    });
});

function youtube_parser(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match) {
        match[2] = match[2].replace(/\//g, '').replace(/%20/g, '');
    }
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return "error"
    }
}
$('#submit').click(function () {

    var filled = true;
    $('.error_p').hide();
    var seconds = $('.timer').text().split(':');
    seconds = parseInt(seconds[0]) * 3600 + parseInt(seconds[1]) * 60 + parseInt(seconds[2]);
    if (seconds == 0) {
        if ($('#time_user').val() == "") {
            seconds = 0;
        }
        else {
            seconds = $('#time_user').val();
        }
    }
    if ($('input[name=verification_label]:checked').val() == null) {
        $('.error_verification').slideDown();
        filled = false;
    }
    if ($(".ui-slider-pip-selected").length == 0) {
        $('.error_certain').slideDown();
        filled = false;
    }
    if ($('#comment').val() == "") {
        $('.error_desc').slideDown();
        filled = false;
    }
    if ($('input[name=list]:checked').length === 0) {
        $('.error_list').slideDown();
        filled = false;
    }
    if (seconds === 0) {
        $('.error_time,.time_text').slideDown();
        filled = false;
    }
    if (filled) {
        $('#submit').removeClass('error_submit');
        $('.form').addClass('submitted');
        $('#success-box').slideDown();
        $('.pauseTimer').click();
        $('#message_a').attr('href', 'https://caa.iti.gr/annotation?email=' + gup("email")+"&stage="+gup("stage"));
        var list_array = [];
        $('input[name=list]:checked').each(function () {
            list_array.push($(this).val())
        });
        $.ajax({
            type: 'GET',
            url: "https://caa.iti.gr/storeData?label=" + $('input[name=verification_label]:checked').val() + "&email=" + gup("email") + "&certain=" + $("#double-label-slider").slider("value") + "&stage=" + gup('stage') + "&url=" + gup("video") + "&video_id=" + gup("video_id") + "&time=" + seconds + "&description=" + $('#comment').val() + "&list=" + list_array.join(','),
            dataType: 'json',
            success: function (json) {
            },
            error: function (e) {
            },
            async: true
        });
    }
    else {
        $('#submit').addClass('error_submit');
    }
});

var timerDisplay = document.querySelector('.timer');
var startTime;
var updatedTime;
var difference;
var tInterval;
var savedTime;
var paused = 0;
var running = 0;
function startTimer() {
    if (!running) {
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1000);
// change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.
        paused = 0;
        running = 1;
        $('#warning').slideUp();
    }
}
function pauseTimer() {
    if (!difference) {
        // if timer never started, don't allow pause button to do anything
    } else if (!paused) {
        clearInterval(tInterval);
        savedTime = difference;
        paused = 1;
        running = 0;
    } else {
// if the timer was already paused, when they click pause again, start the timer again
        startTimer();
    }
}
function resetTimer() {
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    timerDisplay.innerHTML = '00:00:00';
}
function getShowTime() {
    updatedTime = new Date().getTime();
    if (savedTime) {
        difference = (updatedTime - startTime) + savedTime;
    } else {
        difference = updatedTime - startTime;
    }
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    timerDisplay.innerHTML = hours + ':' + minutes + ':' + seconds;
}