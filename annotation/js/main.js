function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
}
$(function () {

    $("#search_input").keyup(function (e) {
        if (e.keyCode === 13) {
            $('#placeholder_img,#desc').hide();
            get_videos();
        }
    });
    $('#search_but').click(function () {
        $('#placeholder_img,#desc').hide();
        get_videos();
    });
    var stage_gup = gup('stage');
    switch (stage_gup) {
        case "C":
            $("input[name=verification_label][value=C]").click();
            break;
        case "H":
            $("input[name=verification_label][value=H]").click();
            break;
        case "AC":
            $("input[name=verification_label][value=AC]").click();
            break;
        default :
            $("input[name=verification_label][value=C]").click();
    }
    var email = gup('email');
    if (email != "") {
        $('#search_input').val(email);
        $('#search_but').click();
    }

});
function get_videos() {
    $('#video_examples').empty();
    $.ajax({
        type: 'GET',
        url: 'https://caa.iti.gr/getVideos?email=' + $("#search_input").val() + '&stage=' + $('input[name=verification_label]:checked').val(),
        dataType: 'json',
        success: function (json) {
            for (var i = 0; i < json.videos.length; i++) {
                if (json.videos[i].url.indexOf('facebook') > -1) {
                    $('#video_examples').append('<div class="video ' + json.videos[i].annotated + '"> <img src="imgs/facebook-placeholder.jpg"> <iframe width="360" height="305" frameborder="0" src="https://www.facebook.com/v2.3/plugins/video.php?allowfullscreen=true&autoplay=false&container_width=360&height=305&href=' + json.videos[i].url + '&locale=en_US&sdk=joey"> </iframe> <p class="video_desc">' + json.videos[i].title + '</p> <button type="button" data-url="' + json.videos[i].url + '" data-id="' + json.videos[i].video_id + '" class="btn btn_small"> Verify </button> </div>')
                }
                else {
                    $('#video_examples').append('<div class="video ' + json.videos[i].annotated + '"> <img src="imgs/youtube-placeholder.jpg"> <iframe width="360" height="305" frameborder="0" src="https://www.youtube.com/embed/' + youtube_parser(json.videos[i].url) + '"> </iframe> <p class="video_desc">' + json.videos[i].title + '</p> <button type="button" data-url="' + json.videos[i].url + '" data-id="' + json.videos[i].video_id + '" class="btn btn_small"> Verify </button> </div>')
                }
                $('.real,.fake').find('.btn').remove();
                if ($('input[name=verification_label]:checked').val() === "H" && $("#search_input").val() != "anastadan@jour.auth.gr") {
                    $('.btn').remove();
                }
            }
            $('#results_wrapper').show();
            var options_thumbs = {
                autoResize: true,
                container: $('#video_examples'),
                offset: 15,
                itemWidth: 360,
                outerOffset: 0
            };
            $('#video_examples').find('.video').wookmark(options_thumbs);
        },
        error: function (e) {
            alert("ERROR");
        },
        async: true
    });
}

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
$("#video_examples").on("click", ".btn", function () {
    window.open("video_page.html?video=" + $(this).attr('data-url') + "&video_id=" + $(this).attr('data-id') + "&email=" + $("#search_input").val() + '&stage=' + $('input[name=verification_label]:checked').val(), '_self');
});
