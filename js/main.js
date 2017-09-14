var video_verify = gup('video');
var arabic = /[\u0600-\u06FF]/;
$(function () {
    $('.tab ul.tabs li a').click(function (g) {
        var tab = $(this).closest('.tab'),
            index = $(this).closest('li').index();

        tab.find('ul.tabs > li').removeClass('current');
        $(this).closest('li').addClass('current');

        tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').stop().slideUp();
        tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').stop().slideDown();


        $('html, body').animate({
            scrollTop: $(".section_title").eq($(this).parent().index()).offset().top
        }, 1500);

        g.preventDefault();
    });
    //Check to see if the window is top if not then display button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });
    var options_thumbs = {
        autoResize: true,
        container: $('#video_examples'),
        offset: 15,
        itemWidth: 360,
        outerOffset: 0
    };
    $('#video_examples').find('.video').wookmark(options_thumbs);

    options_thumbs = {
        autoResize: true,
        container: $('#video_examples_facebook'),
        offset: 15,
        itemWidth: 360,
        outerOffset: 0
    };
    $('#video_examples_facebook').find('.video').wookmark(options_thumbs);

    $('.video').show();
    var count = 1;
    $("#video_fb_table").on("click", "#imgtab", function () {
        var $this = $(this);
        $this.removeClass('small, large', 400);
        $this.addClass((count == 1) ? 'large' : 'small', 400);
        count = 1 - count;
    });
});

if (video_verify !== "") {
    $('#video_examples,#video_examples_facebook,.desc_p,hr,.title_example').remove();
    $("#video_verify").val(video_verify);
    $('.back,.section_title,#loading_all,#cover,.tab').show();
    if (video_verify.indexOf('facebook.com') > -1) {
        var iframe_url = "https://www.facebook.com/v2.3/plugins/video.php?allowfullscreen=true&autoplay=false&container_width=360&height=305&href=" + video_verify + "&locale=en_US&sdk=joey";
        $('#iframe').attr('src', iframe_url);
        $('.twitter_p').remove();
        $('.table_title').eq(1).text("USER");
        start_video_calls_facebook();
    }
    else {
        var iframe_url = "https://www.youtube.com/embed/" + youtube_parser(video_verify);
        $('#iframe').attr('src', iframe_url);
        start_video_calls_youtube();
    }
}
else {
    $('#video_examples,.desc_p,#video_examples_facebook,hr,.title_example').show();
}

function detect_video_drop(evt) {alert("DAS");
    evt.stopPropagation();
    evt.preventDefault();
    video_verify = evt.dataTransfer.getData('text');
    if (video_verify.length < 300) {
        window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_verify;
    } else {
        $('#myModal h1').html("Oops! Something went wrong");
        $('#myModal p').html("The provived video URL is <b>" + video_verify.length + "</b> characters long<br/>We can not handle such big URL");
        $('#myModal').reveal();
    }
}
function verify_video_text() {
    if ($("#video_verify").val() !== "") {
        window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + $("#video_verify").val();
    }
}

$("#video_verify").keyup(function (e) {
    if (e.keyCode === 13) {
        verify_video_text();
    }
});

var global_json;
var verification_comments = [];
function start_video_calls_youtube() {
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr:8008/verify_videoV2?url=' + video_verify,
        dataType: 'text',
        async: true
    });
    setTimeout(function () {
        load_youtube();
        load_twitter();
    }, 1000);

}
function start_video_calls_facebook() {
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr:8008/verify_videoV2?url=' + video_verify,
        dataType: 'text',
        async: true
    });
    setTimeout(function () {
        load_facebook();
        load_twitter();
    }, 1000);

}

$("#channel_yt_table,#thumb_info,#user_fb_table").on("click", ".link", function () {
    window.open($(this).attr('data-url'), '_blank');
});
$("#user_fb_table").on("click", ".link button", function (e) {
    e.stopPropagation();
    window.open($(this).attr('data-url'), '_blank');
});
function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
}
function youtube_parser(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return "error"
    }
}
function facebook_parser(url) {
    url = url.split('?')[0];
    return url.match(/([^\/]*)\/*$/)[1];
}

$('.twitter_p').click(function () {
    window.open($(this).attr('data-url'), '_blank');
});

var all;
function comments() {
    var $tiles_comments = $('#comments_info');
    var verified;
    all = parseInt($('#comments_info .ca-item').last().attr('data-index')) + 1 || 0;
    for (all, verified = 0; ((all < global_json.video_comments.length) && (verified < 10)); all++) {
        var time = global_json.video_publishedAt_comments[all];
        var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ', ' + time.substring(12, 14) + ':' + time.substring(15, 17);

        if ($.inArray(global_json.video_comments[all], verification_comments) !== -1) {

            var src_str = global_json.video_comments[all];
            var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
            var term;
            var pattern;
            for (var i = 0; i < fake_terms.length; i++) {
                term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                pattern = new RegExp("(" + term + ")", "gi");
                src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
            }
            if(arabic.test(src_str)){
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            else{
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            verified++;
        }
        else if ($('.filter.active').attr('id') === "all") {
            if(arabic.test(global_json.video_comments[all])){
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span style="direction:rtl;text-align: right" class="value">' + global_json.video_comments[all] + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            else{
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span class="value">' + global_json.video_comments[all] + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            verified++;
        }
    }
    if ($('.filter.active').attr('id') === "all") {
        if (global_json.video_comments.length > $('#comments_info .ca-item').length) {
            $('.more').show();
        }
        else {
            $('.more').hide();
        }
    }
    else {
        if (verification_comments.length > $('#comments_info .ca-item').length) {
            $('.more').show();
        }
        else {
            $('.more').hide();
        }
    }

    var options_comments = {
        autoResize: true,
        container: $tiles_comments,
        offset: 15,
        itemWidth: 330,
        outerOffset: 0
    };
    setTimeout(function () {
        $tiles_comments.find('.ca-item').wookmark(options_comments);
    }, 10);
}

$('.filter').click(function () {
    if (!($(this).hasClass(('active')))) {
        $('.controls').find('.filter').removeClass('active');
        $(this).addClass('active');
        $('#comments_info').empty();
        comments();
    }
});
$('.more').click(function () {
    comments();
});

function verify_example(video_url) {
    window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_url;
}
function load_youtube() {
    var first_call = true;
    $('#time_input').wickedpicker();
    $('#date_input').datetimepicker({
        timepicker: false,
        mask: '31/12/2017',
        format: 'd/m/Y',
        maxDate: '+1970/01/01'
    });
    var $tiles_thumbs = $('#thumb_info');
    var interval_youtube = setInterval(function () {
        $.ajax({
            type: 'GET',
            url:'http://caa.iti.gr:8008/get_verificationV2?url=' + video_verify,
            dataType: 'json',
            success: function (json) {
                $('#alert_comments').stop().slideDown();
                if (json.processing_status === "done") {
                    clearInterval(interval_youtube);
                    $('#alert_comments').stop().slideUp();
                }
                global_json = json;
                if (json.hasOwnProperty("message")) {
                    clearInterval(interval_youtube);
                    $('#alert_comments').stop().slideUp();
                    $('#empty').show();
                    $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input').remove();
                }
                else {
                    $('#locations .location_name').remove();
                    var empty_location = true;
                    if (json.video_recording_location_description !== "") {
                        empty_location = false;
                        if (json.video_description_mentioned_locations.length > 0) {
                            $('#locations').append('<p class="location_name" data-name="' + json.video_recording_location_description + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_recording_location_description + ',</p>')
                        }
                        else {
                            $('#locations').append('<p class="location_name" data-name="' + json.video_recording_location_description + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_recording_location_description + '</p>')
                        }
                    }
                    for (var l = 0; l < json.video_description_mentioned_locations.length; l++) {
                        empty_location = false;
                        if (l === json.video_description_mentioned_locations.length - 1) {
                            $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + '</p>')
                        }
                        else {
                            $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + ',</p>')
                        }
                    }
                    if (empty_location) {
                        $('#locations').append('<p class="location_name" style="cursor: default">-</p>')
                    }

                    $('#times .location_name').remove();
                    var empty_time = true;
                    if (json.video_upload_time !== "") {
                        empty_time = false;
                        var time = json.video_upload_time;
                        var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);

                        $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                    }
                    if (json.video_recording_time !== "") {
                        empty_time = false;
                        var time = json.video_recording_time;
                        var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);

                        $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                    }
                    if (empty_time) {
                        $('#times .location_title').after('<p class="location_name" style="cursor: default">-</p>')
                    }

                    $("[id^='tooltip_video_location_']").remove();
                    $("[id^='tooltip_channel_location_']").remove();
                    var video_locations = "", channel_locations = "";
                    for (var v = 0; v < json.video_description_mentioned_locations.length; v++) {
                        if (v === json.video_description_mentioned_locations.length - 1) {
                            video_locations += "<span class='tooltip_location' data-tooltip-content='#tooltip_video_location_" + v + "'>" + json.video_description_mentioned_locations[v] + "</span>";
                        }
                        else {
                            video_locations += "<span class='tooltip_location' data-tooltip-content='#tooltip_video_location_" + v + "'>" + json.video_description_mentioned_locations[v] + "</span>, ";
                        }
                        var highlight_video_location = json.video_description_mentioned_locations_sentence[v];
                        var fake_terms_video_location = json.video_description_mentioned_locations_words[v].split(',').map(function (e) {
                            return e.trim();
                        });
                        var term_video_location;
                        var pattern_video_location;
                        for (var f = 0; f < fake_terms_video_location.length; f++) {
                            term_video_location = fake_terms_video_location[f].replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                            pattern_video_location = new RegExp("(" + term_video_location + ")", "gi");
                            highlight_video_location = highlight_video_location.replace(pattern_video_location, "<span class='highlight'>$1</span>");
                            highlight_video_location = highlight_video_location.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                        }
                        $('.tooltip_templates').append('<span id="tooltip_video_location_' + v + '"><p>' + highlight_video_location + '</p></span>');
                    }

                    for (var c = 0; c < json.channel_description_mentioned_locations.length; c++) {
                        if (c === json.channel_description_mentioned_locations.length - 1) {
                            channel_locations += "<span class='tooltip_location' data-tooltip-content='#tooltip_channel_location_" + c + "'>" + json.channel_description_mentioned_locations[c] + "</span>";
                        }
                        else {
                            channel_locations += "<span class='tooltip_location' data-tooltip-content='#tooltip_channel_location_" + c + "'>" + json.channel_description_mentioned_locations[c] + "</span>, ";
                        }
                        var highlight_channel_location = json.channel_description_mentioned_locations_sentence[c];
                        var fake_terms_channel_location = json.channel_description_mentioned_locations_word[c].split(',').map(function (e) {
                            return e.trim();
                        });
                        var term_channel_location;
                        var pattern_channel_location;
                        for (var f = 0; f < fake_terms_channel_location.length; f++) {
                            term_channel_location = fake_terms_channel_location[f].replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                            pattern_channel_location = new RegExp("(" + term_channel_location + ")", "gi");
                            highlight_channel_location = highlight_channel_location.replace(pattern_channel_location, "<span class='highlight'>$1</span>");
                            highlight_channel_location = highlight_channel_location.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                        }
                        $('.tooltip_templates').append('<span id="tooltip_channel_location_' + c + '"><p>' + highlight_channel_location + '</p></span>');
                    }

                    $('#user_video').show();
                    $('.twitter_p').attr('data-url', json.twitter_search_url);

                    $('#video_id').text(json.video_id);

                    $('#video_title').text(json.video_title);
                    if(arabic.test(json.video_title)){
                        $('#video_title').css({'direction':'rtl','text-align':'right'});
                    }

                    $('#video_description').text(json.video_description);
                    if(arabic.test(json.video_title)){
                        $('#video_description').css({'direction':'rtl','text-align':'right'});
                    }
                    $('#video_locations').html(video_locations);
                    $('#video_upload_time').text(json.video_upload_time);
                    $('#video_view_count').text(json.video_view_count);
                    $('#video_like_count').text(json.video_like_count);
                    $('#video_dislike_count').text(json.video_dislike_count);
                    $('#video_comment_count').text(json.video_comment_count);
                    $('#video_duration').text(json.video_duration);
                    $('#video_dimension').text(json.video_dimension);
                    $('#video_definition').text(json.video_definition);
                    $('#video_licensed_content').text(json.video_licensed_content);
                    $('#video_recording_location_description').text(json.video_recording_location_description);
                    $('#video_recording_time').text(json.video_recording_time);

                    $('#channel_id').text(json.channel_id);
                    $('#channel_description').text(json.channel_description);
                    if(arabic.test(json.channel_description)){
                        $('#channel_description').css({'direction':'rtl','text-align':'right'});
                    }
                    $('#channel_locations').html(channel_locations);
                    $('#channel_created_time').text(json.channel_created_time);
                    $('#channel_location').text(json.channel_location);
                    $('#channel_view_count').text(json.channel_view_count);
                    $('#channel_comment_count').text(json.channel_comment_count);
                    $('#channel_subscriber_count').text(json.channel_subscriber_count);
                    $('#channel_video_count').text(json.channel_video_count);
                    $('#channel_videos_per_month').text(json.channel_videos_per_month);
                    $('#channel_url').html(json.channel_url + '<img src="imgs/link_icon.png">').attr('data-url', json.channel_url);
                    $('#channel_about_page').html(json.channel_about_page + '<img src="imgs/link_icon.png">').attr('data-url', json.channel_about_page);

                    for (var i = $('#thumb_info .ca-item').length; i < json.video_thumbnails.length; i++) {
                        $tiles_thumbs.append('<div class="ca-item" style="width:230px"><div class="ca-item-main"><img src="' + json.video_thumbnails[i] + '" style="width: 230px;"><p class="link google" data-url="' + json.reverse_image_thumbnails_search_url[i] + '">Reverse image search<img src="imgs/link_icon.png"></p></div></div>');
                    }

                    $tiles_thumbs.imagesLoaded(function () {
                        var options_thumbs = {
                            autoResize: true,
                            container: $tiles_thumbs,
                            offset: 15,
                            itemWidth: 230,
                            outerOffset: 0
                        };
                        $tiles_thumbs.find('.ca-item').wookmark(options_thumbs);
                    });

                    $('#verified').html('VERIFICATION (' + json.verification_comments.length + ')');
                    $('#all').html('ALL (' + json.video_comments.length + ')');
                    verification_comments = [];
                    for (var k = 0; k < json.verification_comments.length; k++) {
                        verification_comments.push(json.verification_comments[k]);
                    }
                    if ($('.filter.active').attr('id') === "all") {
                        if (global_json.video_comments.length > $('#comments_info .ca-item').length) {
                            $('.more').show();
                        }
                        else {
                            $('.more').hide();
                        }
                    }
                    else {
                        if (verification_comments.length > $('#comments_info .ca-item').length) {
                            $('.more').show();
                        }
                        else {
                            $('.more').hide();
                        }
                    }
                    if ((first_call) && (json.verification_comments.length > 0)) {
                        comments();
                        first_call = false
                    }

                    $('#loading_all,#cover,#cover_info,#loading_info').remove();
                    if (!($('.vis-timeline').length)) {
                        $('#cover_timeline,#loading_timeline').show();
                    }
                    $('.controls,.table_title,#weather_input,#channel_yt_table,#video_yt_table').show();
                    $('.tooltip_location').tooltipster({theme: 'tooltipster-shadow'});
                }
            },
            error: function (e) {
                console.log(e);
            },
            async: true
        });
    }, 1000);
}
function load_facebook() {
    var first_call = true;
    $('#time_input').wickedpicker();
    $('#date_input').datetimepicker({
        timepicker: false,
        mask: '31/12/2017',
        format: 'd/m/Y',
        maxDate: '+1970/01/01'
    });
    var $tiles_thumbs = $('#thumb_info');
    var interval_facebook = setInterval(function () {
        $.ajax({
            type: 'GET',
            url:'http://caa.iti.gr:8008/get_verificationV2?url=' + video_verify,
            dataType: 'json',
            success: function (json) {
                $('#alert_comments').stop().slideDown();
                global_json = json;
                if (json.processing_status === "done") {
                    clearInterval(interval_facebook);
                    $('#alert_comments').stop().slideUp();
                }
                if (json.hasOwnProperty("message")) {
                    clearInterval(interval_facebook);
                    $('#alert_comments').stop().slideUp();
                    $('#empty').show();
                    $('#loading_all,#cover,#cover_info,#loading_info,.controls,.table,.table_title,#weather_input').remove();
                }
                else {

                    $('#locations .location_name').remove();
                    var empty_location = true;
                    if (json.from_location_city !== "") {
                        empty_location = false;
                        if (json.video_description_mentioned_locations.length > 0) {
                            $('#locations').append('<p class="location_name" data-name="' + json.from_location_city + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.from_location_city + ',</p>')
                        }
                        else {
                            $('#locations').append('<p class="location_name" data-name="' + json.from_location_city + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.from_location_city + '</p>')
                        }
                    }
                    for (var l = 0; l < json.video_description_mentioned_locations.length; l++) {
                        empty_location = false;
                        if (l === json.video_description_mentioned_locations.length - 1) {
                            $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + '</p>')
                        }
                        else {
                            $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l].split('@')[0].slice(0, -1) + ',</p>')
                        }
                    }
                    if (empty_location) {
                        $('#locations').append('<p class="location_name" style="cursor: default">-</p>')
                    }

                    var empty_time = true;
                    $('#times .location_name').remove();
                    if (json.created_time !== "") {
                        empty_time = false;
                        var time = json.created_time;
                        var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);

                        $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>');

                    }
                    if (json.updated_time !== "") {
                        empty_time = false;
                        var time = json.updated_time;
                        var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);
                        $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                    }
                    if (empty_time) {
                        $('#times .location_title').after('<p class="location_name" style="cursor: default">-</p>')
                    }


                    var video_locations = "";
                    $("[id^='tooltip_video_location_']").remove();
                    for (var v = 0; v < json.video_description_mentioned_locations.length; v++) {
                        if (v === json.video_description_mentioned_locations.length - 1) {
                            video_locations += "<span class='tooltip_location' data-tooltip-content='#tooltip_video_location_" + v + "'>" + json.video_description_mentioned_locations[v] + "</span>";
                        }
                        else {
                            video_locations += "<span class='tooltip_location' data-tooltip-content='#tooltip_video_location_" + v + "'>" + json.video_description_mentioned_locations[v] + "</span>, ";
                        }
                        var highlight_video_location = json.video_description_mentioned_locations_sentence[v];
                        var fake_terms_video_location = json.video_description_mentioned_locations_words[v].split(',').map(function (e) {
                            return e.trim();
                        });
                        var term_video_location;
                        var pattern_video_location;
                        for (var f = 0; f < fake_terms_video_location.length; f++) {
                            term_video_location = fake_terms_video_location[f].replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                            pattern_video_location = new RegExp("(" + term_video_location + ")", "gi");
                            highlight_video_location = highlight_video_location.replace(pattern_video_location, "<span class='highlight'>$1</span>");
                            highlight_video_location = highlight_video_location.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                        }
                        $('.tooltip_templates').append('<span id="tooltip_video_location_' + v + '"><p>' + highlight_video_location + '</p></span>');
                    }

                    $('#user_video').show();
                    $('#fb_video_title').text(json.title);
                    $('#fb_video_id').text(json.video_id);
                    $('#fb_content_category').text(json.content_category);
                    $('#fb_content_tags').text(json.content_tags);
                    $('#fb_video_description').text(json.video_description);
                    if(arabic.test(json.video_description)){
                        $('#fb_video_description').css({'direction':'rtl','text-align':'right'});
                    }
                    $('#fb_video_locations').html(video_locations);
                    $('#fb_created_time').text(json.created_time);
                    $('#fb_updated_time').text(json.updated_time);
                    $('#fb_total_comment_count').text(json.total_comment_count);
                    $('#fb_embeddable').text(json.embeddable);
                    $('#fb_length').text(json.length);
                    $('#fb_picture').html('<img id="imgtab" class="small" src="' + json.picture + '">');
                    $('#fb_privacy').text(json.privacy);

                    $('#fb_source').text(json.from);
                    $('#fb_about').text(json.from_about);
                    $('#fb_category').text(json.from_category);
                    $('#fb_fan_count').text(json.from_fan_count);
                    $('#fb_link').html(json.from_link + '<img src="imgs/link_icon.png">').attr('class', 'link').attr('data-url', json.from_link);
                    $('#fb_verified').text(json.from_is_verified);
                    $('#fb_description').text(json.from_description);
                    if(arabic.test(json.from_description)){
                        $('#fb_description').css({'direction':'rtl','text-align':'right'});
                    }
                    $('#fb_city').text(json.from_location_city);
                    $('#fb_country').text(json.from_location_country);
                    if (json.from_website != "") {
                        $('#fb_website').html(json.from_website + '<img src="imgs/link_icon.png"><button class="btn btn_small btn_whois" data-url="https://who.is/whois/' + json.from_website + '">Who/who.is</button>').attr('class', 'link').attr('data-url', json.from_website);
                    }

                    for (var i = $('#thumb_info .ca-item').length; i < json.video_thumbnails.length; i++) {
                        $tiles_thumbs.append('<div class="ca-item" style="width:230px"><div class="ca-item-main"><img src="' + json.video_thumbnails[i] + '" style="width: 230px;"><p class="link google" data-url="' + json.reverse_image_thumbnails_search_url[i] + '">Reverse image search<img src="imgs/link_icon.png"></p></div></div>');
                    }

                    $tiles_thumbs.imagesLoaded(function () {
                        var options_thumbs = {
                            autoResize: true,
                            container: $tiles_thumbs,
                            offset: 15,
                            itemWidth: 230,
                            outerOffset: 0
                        };
                        $tiles_thumbs.find('.ca-item').wookmark(options_thumbs);
                    });

                    $('#verified').html('VERIFICATION (' + json.verification_comments.length + ')');
                    $('#all').html('ALL (' + json.video_comments.length + ')');
                    verification_comments = [];
                    for (var k = 0; k < json.verification_comments.length; k++) {
                        verification_comments.push(json.verification_comments[k]);
                    }

                    if ($('.filter.active').attr('id') === "all") {
                        if (global_json.video_comments.length > $('#comments_info .ca-item').length) {
                            $('.more').show();
                        }
                        else {
                            $('.more').hide();
                        }
                    }
                    else {
                        if (verification_comments.length > $('#comments_info .ca-item').length) {
                            $('.more').show();
                        }
                        else {
                            $('.more').hide();
                        }
                    }
                    if ((first_call) && (json.verification_comments.length > 0)) {
                        comments();
                        first_call = false
                    }

                    $('#loading_all,#cover,#cover_info,#loading_info').remove();
                    if (!($('.vis-timeline').length)) {
                        $('#cover_timeline,#loading_timeline').show();
                    }
                    $('.controls,.table_title,#weather_input,#video_fb_table,#user_fb_table').show();
                    $('.tooltip_location').tooltipster({theme: 'tooltipster-shadow'});
                }
            },
            error: function () {

            },
            async: true
        });
    }, 1000);

}
function get_weather() {
    if (!($('#weather_btn').hasClass("disable_btn"))) {
        $('#weather_error').stop().slideUp();
        var dateParts, dateObject, time, checked = false;

        if ($('#exact_time').is(":checked")) {
            checked = true;
            dateParts = $('#date_input').val().split("/");
            dateObject = dateParts[2] + "-" + (dateParts[1]) + "-" + dateParts[0] + "T" + $('#time_input').val().replace(/\s+/g, '') + ":00";
            time = new Date(dateObject).getTime() / 1000;
        }
        else {
            dateParts = $('#date_input').val().split("/");
            dateObject = dateParts[2] + "-" + (dateParts[1]) + "-" + dateParts[0];
            time = new Date(dateObject).getTime() / 1000;
        }
        $('#loading_weather').show();
        if ($('.widget').is(":visible")) {
            $('.widget').addClass('widget_blur');
        }
        $.ajax({
            type: 'GET',
            url: 'http://caa.iti.gr:8008/weatherV2?time=' + time + '&location=' + $('#location_input').val(),
            dataType: 'json',
            success: function (json) {
                if (json.hasOwnProperty("message")) {
                    $('#weather_error').html(json.message).stop().slideDown();
                    $('.widget').hide().removeClass('widget_blur');
                }
                else {
                    var summary, visibility, preciptype, icon, cloud_cover, wind_speed, temp, min_temp, max_temp, day_indi;
                    if (checked) {
                        if (!(json.hourly.data_exist)) {
                            $('#weather_error').html("No Weather Data for this Location/Timestamp").stop().slideDown();
                            $('.widget').hide().removeClass('widget_blur');
                        }
                        else {
                            $('#beaufort_num').text(json.hourly.beaufort);
                            summary = json.hourly.summary;
                            if (summary === "") {
                                summary = "-";
                            }
                            $('.weatherData').find('.description').text(summary);

                            visibility = json.hourly.visibility;
                            if (visibility === "") {
                                visibility = "-";
                            }
                            $('#visibility').text(visibility);

                            cloud_cover = json.hourly.cloud_cover;
                            if (cloud_cover === "") {
                                cloud_cover = "-";
                            }
                            $('#cloud').text(cloud_cover);

                            wind_speed = json.hourly.wind_speed;
                            if (wind_speed === "") {
                                wind_speed = "-";
                            }
                            $('#wind').text(wind_speed);

                            temp = json.hourly.temperature;
                            icon = json.hourly.icon;
                            day_indi = json.hourly.day_night_indication;
                            $('.weatherIcon').empty();
                            switch (icon) {
                                case "CLEAR_DAY":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="sunny"><div class="sun"><div class="rays"></div></div></div><p class="weatherInfo">Clear Day</p>')
                                    break;
                                case "CLEAR_NIGHT":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="moon"></div><p class="weatherInfo" style="margin-top: 115px;">Clear Night</p>');
                                    break;
                                case "RAIN":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="rainy"><div class="cloud"></div><div class="rain"></div></div><p class="weatherInfo">Rain ' + capitalizeFirstLetter(day_night_indication) + '</p>');
                                    break;
                                case "SNOW":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div><p class="weatherInfo">Snow ' + capitalizeFirstLetter(day_night_indication) + '</p>');
                                    break;
                                case "SLEET":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="flurries"><div class="cloud"></div><div class="snow"><div class="flake sleet"></div><div class="flake sleet"></div></div></div><p class="weatherInfo">Sleet ' + capitalizeFirstLetter(day_night_indication) + '</p>');
                                    break;
                                case "WIND":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="svg-contain"> <svg version="1.1" class="windy-svg" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-447 254.4 64 52.6" style="enable-background:new -447 254.4 64 52.6;" xml:space="preserve"> <g id="Layer_1_1_"> <g> <path class="st0 little-path path-1" d="M-429.2,276.8h6.3"/> <path class="big-path big-path-1" d="M-438.1,279.3c0,0,20.5,0,20.6,0c4.1,0,7.4-3.4,7.7-7.4c0.1-1.1-0.1-2.3-0.6-3.3c-2.2-5.4-9.8-6.3-13.3-1.7 c-1,1.3-1.6,3-1.7,4.6"/> <path class="little-path path-2" d="M-422.6,271.7c0-2.8,2.3-5.1,5.1-5.1s5.1,2.3,5.1,5.1c0,2.8-2.3,5.1-5.1,5.1"/> </g> <g> <path class="little-path path-3" d="M-434.1,284.9h30.4"/> <path class="little-path path-4" d="M-410.6,280h8.7"/> <path class="big-path big-path-2" d="M-442.9,282.7h44c3.6,0,6.6,3,6.8,6.5c0.1,1-0.1,2-0.5,3c-2,4.8-8.7,5.5-11.8,1.5c-0.9-1.2-1.4-2.6-1.5-4.1" /> <path class="little-path path-5" d="M-403.4,289.4c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5s-2-4.5-4.5-4.5"/> </g> </g> </svg> </div><p class="weatherInfo">Wind ' + capitalizeFirstLetter(day_night_indication) + '</p>');
                                    break;
                                case "FOG":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="svg-contain"> <svg class="fog-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 68 52.6" style="enable-background:new 0 0 68 52.6;" xml:space="preserve"> <g id="Layer_1"> <g> <path class="cloud_fog" d="M62.8,29.3c0-5.2-4.2-9.4-9.4-9.4c-0.2,0-0.4,0.1-0.7,0.1c-0.1-0.9-0.2-1.8-0.5-2.7c-0.3-1.1-0.9-2.2-1.5-3.1 C48.6,11,44.9,9,40.8,9c-2.5,0-4.8,0.7-6.7,2c-0.6,0.4-1.2,0.9-1.8,1.5c-0.3,0.3-0.5,0.6-0.8,0.8c-0.2,0.3-0.5,0.6-0.7,0.9 c-1.9-1.3-4.2-2.1-6.7-2.1c-6,0-10.9,4.4-11.8,10.1c-3.8,1.1-6.7,4.3-7.2,8.3h28.7h13.9h14.1h0.8C62.7,30.6,62.8,30.1,62.8,29.3z" /> <path class="fog-line big-path" d="M7.3,28.8h12.4"/> <path class="fog-line big-path" d="M23.5,28.8h38.4"/> <path class="fog-line big-path" d="M57.3,32.6h5.2"/> <path class="fog-line big-path" d="M31.2,32.6h22.1"/> <path class="fog-line big-path" d="M6.2,32.6h21.1"/> <path class="fog-line big-path" d="M11.4,43.6H6.2"/> <path class="fog-line big-path" d="M37.5,43.6H15.4"/> <path class="fog-line big-path" d="M62.5,43.6H41.4"/> <path class="fog-line big-path" d="M6.2,36.4h2.1"/> <path class="fog-line big-path" d="M11.9,36.4h6"/> <path class="fog-line big-path" d="M21.8,36.4h20.4"/> <path class="fog-line big-path" d="M46.3,36.4h16.1"/> <path class="fog-line big-path" d="M55.2,40.2h7.3"/> <path class="fog-line big-path" d="M48.3,40.2h2.8"/> <path class="fog-line big-path" d="M37.3,40.2H44"/> <path class="fog-line big-path" d="M18.3,40.2h15.3"/> <path class="fog-line big-path" d="M6.2,40.2h8"/> </g> </g> </svg> </div></div><p class="weatherInfo">Fog ' + capitalizeFirstLetter(day_night_indication) + '</p>');
                                    break;
                                case "CLOUDY":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="cloudy"><div class="cloud"></div><div class="cloud"></div></div><p class="weatherInfo">Cloudy ' + capitalizeFirstLetter(day_night_indication) + '</p>');
                                    break;
                                case "PARTLY_CLOUDY_DAY":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="icon-weather sun_static sun--with-cloud"><div class="icon-weather cloud_static cloud--silver"></div></div><p class="weatherInfo">Partly Cloudy Day</p>');
                                    break;
                                case "PARTLY_CLOUDY_NIGHT":
                                    $('.weatherIcon').append('<div id="temp"><h1>' + temp + '&deg;C</h1></div><div class="icon-weather moon_static moon--with-cloud"> <div class="icon-weather cloud_static cloud--silver"></div> </div><p class="weatherInfo">Partly Cloudy Night</p>');
                                    break;
                            }
                            $('.widget').show().removeClass('widget_blur');
                        }
                    }
                    else {
                        if (!(json.daily.data_exist)) {
                            $('#weather_error').html("No Weather Data for this Location/Timestamp").stop().slideDown();
                            $('.widget').hide().removeClass('widget_blur');
                        }
                        else {
                            $('#beaufort_num').text(json.daily.beaufort);
                            summary = json.daily.summary;
                            if (summary === "") {
                                summary = "-";
                            }
                            $('.weatherData').find('.description').text(summary);

                            preciptype = json.daily.precipType;
                            if (preciptype !== "") {
                                $('.weatherData').find('.precip').text(preciptype);
                            }

                            visibility = json.daily.visibility;
                            if (visibility === "") {
                                visibility = "-";
                            }
                            $('#visibility').text(visibility);

                            cloud_cover = json.daily.cloud_cover;
                            if (cloud_cover === "") {
                                cloud_cover = "-";
                            }
                            $('#cloud').text(cloud_cover);


                            wind_speed = json.daily.wind_speed;
                            if (wind_speed === "") {
                                wind_speed = "-";
                            }
                            $('#wind').text(wind_speed);

                            min_temp = json.daily.min_temperature;
                            max_temp = json.daily.max_temperature;

                            icon = json.daily.icon;
                            $('.weatherIcon').empty();
                            switch (icon) {
                                case "CLEAR_DAY":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="icon sunny"><div class="sun"><div class="rays"></div></div></div><p class="weatherInfo">Clear Day</p>')
                                    break;
                                case "CLEAR_NIGHT":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="moon"></div><p class="weatherInfo" style="margin-top: 115px;">Clear Night</p>');
                                    break;
                                case "RAIN":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="rainy"><div class="cloud"></div><div class="rain"></div></div><p class="weatherInfo">Rain</p>');
                                    break;
                                case "SNOW":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div><p class="weatherInfo">Snow</p>');
                                    break;
                                case "SLEET":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="flurries"><div class="cloud"></div><div class="snow"><div class="flake sleet"></div><div class="flake sleet"></div></div></div><p class="weatherInfo">Sleet</p>');
                                    break;
                                case "WIND":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="svg-contain"> <svg version="1.1" class="windy-svg" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-447 254.4 64 52.6" style="enable-background:new -447 254.4 64 52.6;" xml:space="preserve"> <g id="Layer_1_1_"> <g> <path class="st0 little-path path-1" d="M-429.2,276.8h6.3"/> <path class="big-path big-path-1" d="M-438.1,279.3c0,0,20.5,0,20.6,0c4.1,0,7.4-3.4,7.7-7.4c0.1-1.1-0.1-2.3-0.6-3.3c-2.2-5.4-9.8-6.3-13.3-1.7 c-1,1.3-1.6,3-1.7,4.6"/> <path class="little-path path-2" d="M-422.6,271.7c0-2.8,2.3-5.1,5.1-5.1s5.1,2.3,5.1,5.1c0,2.8-2.3,5.1-5.1,5.1"/> </g> <g> <path class="little-path path-3" d="M-434.1,284.9h30.4"/> <path class="little-path path-4" d="M-410.6,280h8.7"/> <path class="big-path big-path-2" d="M-442.9,282.7h44c3.6,0,6.6,3,6.8,6.5c0.1,1-0.1,2-0.5,3c-2,4.8-8.7,5.5-11.8,1.5c-0.9-1.2-1.4-2.6-1.5-4.1" /> <path class="little-path path-5" d="M-403.4,289.4c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5s-2-4.5-4.5-4.5"/> </g> </g> </svg></div><p class="weatherInfo">Wind</p>');
                                    break;
                                case "FOG":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="svg-contain"> <svg class="fog-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 68 52.6" style="enable-background:new 0 0 68 52.6;" xml:space="preserve"> <g id="Layer_1"> <g> <path class="cloud_fog" d="M62.8,29.3c0-5.2-4.2-9.4-9.4-9.4c-0.2,0-0.4,0.1-0.7,0.1c-0.1-0.9-0.2-1.8-0.5-2.7c-0.3-1.1-0.9-2.2-1.5-3.1 C48.6,11,44.9,9,40.8,9c-2.5,0-4.8,0.7-6.7,2c-0.6,0.4-1.2,0.9-1.8,1.5c-0.3,0.3-0.5,0.6-0.8,0.8c-0.2,0.3-0.5,0.6-0.7,0.9 c-1.9-1.3-4.2-2.1-6.7-2.1c-6,0-10.9,4.4-11.8,10.1c-3.8,1.1-6.7,4.3-7.2,8.3h28.7h13.9h14.1h0.8C62.7,30.6,62.8,30.1,62.8,29.3z" /> <path class="fog-line big-path" d="M7.3,28.8h12.4"/> <path class="fog-line big-path" d="M23.5,28.8h38.4"/> <path class="fog-line big-path" d="M57.3,32.6h5.2"/> <path class="fog-line big-path" d="M31.2,32.6h22.1"/> <path class="fog-line big-path" d="M6.2,32.6h21.1"/> <path class="fog-line big-path" d="M11.4,43.6H6.2"/> <path class="fog-line big-path" d="M37.5,43.6H15.4"/> <path class="fog-line big-path" d="M62.5,43.6H41.4"/> <path class="fog-line big-path" d="M6.2,36.4h2.1"/> <path class="fog-line big-path" d="M11.9,36.4h6"/> <path class="fog-line big-path" d="M21.8,36.4h20.4"/> <path class="fog-line big-path" d="M46.3,36.4h16.1"/> <path class="fog-line big-path" d="M55.2,40.2h7.3"/> <path class="fog-line big-path" d="M48.3,40.2h2.8"/> <path class="fog-line big-path" d="M37.3,40.2H44"/> <path class="fog-line big-path" d="M18.3,40.2h15.3"/> <path class="fog-line big-path" d="M6.2,40.2h8"/> </g> </g> </svg> </div></div><p class="weatherInfo">Fog</p>');
                                    break;
                                case "CLOUDY":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="cloudy"><div class="cloud"></div><div class="cloud"></div></div><p class="weatherInfo">Cloudy</p>');
                                    break;
                                case "PARTLY_CLOUDY_DAY":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="icon-weather sun_static sun--with-cloud"><div class="icon-weather cloud_static cloud--silver"></div></div><p class="weatherInfo">Partly Cloudy Day</p>');
                                    break;
                                case "PARTLY_CLOUDY_NIGHT":
                                    $('.weatherIcon').append('<div id="temp"><h1 style="font-size: 26px;">' + min_temp + ' ... ' + max_temp + '&deg;C</h1></div><div class="icon-weather moon_static moon--with-cloud"> <div class="icon-weather cloud_static cloud--silver"></div> </div><p class="weatherInfo">Partly Cloudy Night</p>');
                                    break;
                            }
                        }
                        $('.widget').show().removeClass('widget_blur');
                    }

                }
                $('#loading_weather').hide();

            },
            async: true
        });
    }
}
function initMap() {
    var input = document.getElementById('location_input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            $('#loc_error').find('span').html(place.name);
            $('#loc_error').stop().slideDown();
            $('#location_input').val("");
            return;
        }
        $('#location_input').change();
    });
}

$("#locations").on("click", ".location_name", function () {
    $('#location_input').val($(this).attr('data-name')).change();
});
$("#times").on("click", ".location_name", function () {
    $('#date_input').val($(this).attr('data-time').split(" ")[0]).change();
    $('#time_input').val($(this).attr('data-time').split(" ")[1]).change();
    if (!($('#exact_time').is(":checked"))) {
        $('#exact_time').click();
    }
});
$('#exact_time').change(function () {
    if ($(this).is(":checked")) {
        $('#date_input').css('width', '150px');
        $('#time_input').show(0).css('width', '150px');
        if (($('#date_input').val() !== "") && ($('#date_input').val() !== "__/__/____") && ($('#time_input').val() !== "") && ($('#time_input').val() !== "__:__") && ($('#location_input').val() !== "")) {
            $('#weather_btn').removeClass('disable_btn');
        }
        else {
            $('#weather_btn').addClass('disable_btn');
        }
    }
    else {
        $('#date_input').css('width', '300px');
        $('#time_input').hide().css('width', '0px');
        if (($('#date_input').val() !== "") && ($('#date_input').val() !== "__/__/____") && ($('#location_input').val() !== "")) {
            $('#weather_btn').removeClass('disable_btn');
        }
        else {
            $('#weather_btn').addClass('disable_btn');
        }
    }

});
$('#location_input').change(function () {
    $('#loc_error,#weather_error').stop().slideUp();
    if ($(this).val() !== "") {
        if ($('#exact_time').is(":checked")) {
            if (($('#date_input').val() !== "") && ($('#date_input').val() !== "__/__/____") && ($('#time_input').val() !== "") && ($('#time_input').val() !== "__:__")) {
                $('#weather_btn').removeClass('disable_btn');
            }
            else {
                $('#weather_btn').addClass('disable_btn');
            }
        }
        else {
            if (($('#date_input').val() !== "") && ($('#date_input').val() !== "__/__/____")) {
                $('#weather_btn').removeClass('disable_btn');
            }
            else {
                $('#weather_btn').addClass('disable_btn');
            }
        }
    }
    else {
        $('#weather_btn').addClass('disable_btn');
    }
});
$('#date_input').change(function () {
    if (($(this).val() !== "") && ($(this).val() !== "__/__/____")) {
        if ($('#exact_time').is(":checked")) {
            if (($('#location_input').val() !== "") && ($('#time_input').val() !== "") && ($('#time_input').val() !== "__:__")) {
                $('#weather_btn').removeClass('disable_btn');
            }
            else {
                $('#weather_btn').addClass('disable_btn');
            }
        }
        else {
            if (($('#location_input').val() !== "")) {
                $('#weather_btn').removeClass('disable_btn');
            }
            else {
                $('#weather_btn').addClass('disable_btn');
            }
        }
    }
    else {
        $('#weather_btn').addClass('disable_btn');
    }
});
$('#time_input').change(function () {
    if (($(this).val() !== "") && ($(this).val() !== "__:__")) {
        if (($('#location_input').val() !== "") && ($('#date_input').val() !== "") && ($('#date_input').val() !== "__/__/____")) {
            $('#weather_btn').removeClass('disable_btn');
        }
        else {
            $('#weather_btn').addClass('disable_btn');
        }
    }
    else {
        $('#weather_btn').addClass('disable_btn');
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}