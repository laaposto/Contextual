var video_verify = gup('video');
$(function () {
    var options_thumbs = {
        autoResize: true,
        container: $('#video_examples'),
        offset: 15,
        itemWidth: 360,
        outerOffset: 0
    };
    $('#video_examples').find('.video').wookmark(options_thumbs);

    var options_thumbs = {
        autoResize: true,
        container: $('#video_examples_facebook'),
        offset: 15,
        itemWidth: 360,
        outerOffset: 0
    };
    $('#video_examples_facebook').find('.video').wookmark(options_thumbs);

    $('.video').show();
    var count = 1;
    $("#table_video").on("click", "#imgtab", function () {
        var $this = $(this);
        $this.removeClass('small, large', 400);
        $this.addClass((count == 1) ? 'large' : 'small', 400);
        count = 1 - count;
    });
});


if (video_verify !== "") {
    $('#video_examples,.desc_p,hr,.title_example').remove();
    $("#video_verify").val(video_verify);
    $('.back,.section_title,#loading_all,#cover,.tab').show();
    if (video_verify.indexOf('facebook.com') > -1) {
        var iframe_url = "https://www.facebook.com/v2.3/plugins/video.php?allowfullscreen=true&autoplay=false&container_width=360&height=305&href=" + video_verify + "&locale=en_US&sdk=joey";
        $('#iframe').attr('src', iframe_url);
        $('#cover_timeline,#loading_timeline,#container > div:last-child,.tabs li:last-child,.twitter_p').remove();
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
    $('#video_examples,.desc_p,#video_examples_facebook').show();
}
function detect_video_drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    video_verify = evt.dataTransfer.getData('text');
    console.log(evt.dataTransfer.getData('text/html'));
    if (video_verify.length < 300) {
        //window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_verify;
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
        url: 'http://caa.iti.gr:8090/verify_video?source=youtube&id=' + youtube_parser(video_verify),
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
        url: 'http://caa.iti.gr:8090/verify_video?source=facebook&id=' + facebook_parser(video_verify),
        dataType: 'text',
        async: true
    });
    setTimeout(function () {
        load_facebook();
    }, 1000);

}
$("#table_channel,#thumb_info,#table_video").on("click", ".link", function () {
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

function nFormatter(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'K';
    }
    return num;
}
$('.twitter_p').click(function () {
    window.open($(this).attr('data-url'), '_blank');
});


var all, num_comments;
function comments(empty) {
    var $tiles_comments = $('#comments_info');
    var verified;
    if (empty) {
        $tiles_comments.empty();
        all = 0;
        num_comments = 10;
    }
    for (all, verified = 0; ((all < global_json.video_comments.length) && (verified < 10)); all++) {
        var time = global_json.video_publishedAt_comments[all];
         var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ', ' + time.substring(12, 14) + ':' + time.substring(15, 17);

        if ($.inArray(global_json.video_comments[all], verification_comments) !== -1) {

            var src_str = global_json.video_comments[all];
            var term = "fake";
            term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
            var pattern = new RegExp("(" + term + ")", "gi");

            src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
            src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");

            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            verified++;
        }
        else if ($('.filter.active').attr('id') === "all") {
            $tiles_comments.append('<div class="ca-item no-verified" ><div class="ca-item-main"><span class="value">' + global_json.video_comments[all] + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            verified++;
        }
    }
    if ($('.filter.active').attr('id') === "all") {
        if (num_comments < global_json.video_comments.length) {
            $('.more').show();
        }
        else {
            $('.more').hide();
        }
    }
    else {
        if (num_comments < verification_comments.length) {
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
        comments(true);
    }
});

$('.more').click(function () {
    num_comments += 10;
    comments(false);
});
function verify_example(video_url) {
    window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_url;
}
function load_youtube() {
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr:8090/get_ytverification?id=' + youtube_parser(video_verify),
        dataType: 'json',
        success: function (json) {
            $('#time_input').wickedpicker();
            $('#date_input').datetimepicker({
                timepicker: false,
                mask: '31/12/2017',
                format: 'd/m/Y',
                maxDate: '+1970/01/01'
            });
            global_json = json;
            var $table_video = $('#table_video');
            var $table_channel = $('#table_channel');
            var $tiles_thumbs = $('#thumb_info');
            if (json.hasOwnProperty("message")) {
                $('#empty').show();
                $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input').remove();
            }
            else {
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
                        $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l] + '</p>')
                    }
                    else {
                        $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l] + ',</p>')
                    }
                }
                if (empty_location) {
                    $('#locations').append('<p class="location_name" style="cursor: default">-</p>')
                }

                var empty_time = true;
                if (json.video_upload_time !== "") {
                    empty_time = false;
                    var time = json.video_upload_time;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);
                    if (json.video_recording_time !== "") {
                        $('#times').append('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + ',</p>')
                    }
                    else {
                        $('#times').append('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                    }
                }
                if (json.video_recording_time !== "") {
                    empty_time = false;
                    var time = json.video_recording_time;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);

                    $('#times').append('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                }
                if (empty_time) {
                    $('#times').append('<p class="location_name" style="cursor: default">-</p>')
                }


                $('#user_video').show();
                $('.twitter_p').attr('data-url', json.twitter_search_url);
                $table_video.append(' <tr><td>Video ID</td><td>' + json.video_id + '</td></tr>');
                $table_video.append(' <tr><td>Video Title</td><td>' + json.video_title + '</td></tr>');
                $table_video.append(' <tr><td>Video Description</td><td>' + json.video_description + '</td></tr>');
                $table_video.append(' <tr><td>Video Description Mentioned Locations</td><td>' + json.video_description_mentioned_locations + '</td></tr>');
                $table_video.append(' <tr><td>Video Upload Time</td><td>' + json.video_upload_time + ' (GMT)</td></tr>');
                $table_video.append(' <tr><td>Video View Count</td><td>' + nFormatter(json.video_view_count) + '</td></tr>');
                $table_video.append(' <tr><td>Video Like Count</td><td>' + nFormatter(json.video_like_count) + '</td></tr>');
                $table_video.append(' <tr><td>Video Dislike Count</td><td>' + nFormatter(json.video_dislike_count) + '</td></tr>');
                $table_video.append(' <tr><td>Video Comment Count</td><td>' + nFormatter(json.video_comment_count) + '</td></tr>');
                $table_video.append(' <tr><td>Video Duration</td><td>' + json.video_duration + '</td></tr>');
                $table_video.append(' <tr><td>Video Dimension</td><td>' + json.video_dimension + '</td></tr>');
                $table_video.append(' <tr><td>Video Definition</td><td>' + json.video_definition + '</td></tr>');
                $table_video.append(' <tr><td>Video Licensed Content</td><td>' + json.video_licensed_content + '</td></tr>');
                $table_video.append(' <tr><td>Video Recording Location Description</td><td>' + json.video_recording_location_description + '</td></tr>');
                $table_video.append(' <tr><td>Video Recording Time</td><td>' + json.video_recording_time + '</td></tr>');

                $table_channel.append(' <tr><td>ID</td><td>' + json.channel_id + '</td></tr>');
                $table_channel.append(' <tr><td>Description</td><td>' + json.channel_description + '</td></tr>');
                $table_channel.append(' <tr><td>Description Mentioned Locations</td><td>' + json.channel_description_mentioned_locations + '</td></tr>');
                $table_channel.append(' <tr><td>Created Time</td><td>' + json.channel_created_time + ' (GMT)</td></tr>');
                $table_channel.append(' <tr><td>Location</td><td>' + json.channel_location + '</td></tr>');
                $table_channel.append(' <tr><td>View Count</td><td>' + nFormatter(json.channel_view_count) + '</td></tr>');
                $table_channel.append(' <tr><td>Comment Count</td><td>' + nFormatter(json.channel_comment_count) + '</td></tr>');
                $table_channel.append(' <tr><td>Subscriber Count</td><td>' + nFormatter(json.channel_subscriber_count) + '</td></tr>');
                $table_channel.append(' <tr><td>Video Count</td><td>' + nFormatter(json.channel_video_count) + '</td></tr>');
                $table_channel.append(' <tr><td>Videos Per Month</td><td>' + nFormatter(json.channel_videos_per_month) + '</td></tr>');
                $table_channel.append(' <tr><td>Url</td><td class="link" data-url="' + json.channel_url + '">' + json.channel_url + '<img src="imgs/link_icon.png"></td></tr>');
                $table_channel.append(' <tr><td>About Page</td><td class="link" data-url="' + json.channel_about_page + '">' + json.channel_about_page + '<img src="imgs/link_icon.png"></td></tr>');

                for (var i = 0; i < json.video_thumbnails.length; i++) {
                    $tiles_thumbs.append('<div class="ca-item" style="width:230px"><div class="ca-item-main"><img src="' + json.video_thumbnails[i] + '" style="width: 230px;"><p class="link google" data-url="' + json.reverse_image_thumbnails_search_url[i] + '">Reverse image search<img src="imgs/link_icon.png"></p></div></div>');
                }

                $('#verified').html('VERIFICATION (' + json.num_verification_comments + ')');
                $('#all').html('ALL (' + json.video_comments.length + ')');
                verification_comments = [];
                for (var k = 0; k < json.verification_comments.length; k++) {
                    verification_comments.push(json.verification_comments[k]);
                }
                comments(true);
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
                $('#loading_all,#cover,#cover_info,#loading_info').remove();
                if (!($('.vis-timeline').length)) {
                    $('#cover_timeline,#loading_timeline').show();
                }
                $('.controls,.table,.table_title,#weather_input').show();
            }
        },
        error: function () {

        },
        async: true
    });
}
function load_facebook() {
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr:8090/get_fbverification?id=' + facebook_parser(video_verify),
        dataType: 'json',
        success: function (json) {
            $('#time_input').wickedpicker();
            $('#date_input').datetimepicker({
                timepicker: false,
                mask: '31/12/2017',
                format: 'd/m/Y',
                maxDate: '+1970/01/01'
            });
            global_json = json;
            var $table_video = $('#table_video');
            var $table_channel = $('#table_channel');
            var $tiles_thumbs = $('#thumb_info');
            if (json.hasOwnProperty("message")) {
                $('#empty').show();
                $('#loading_all,#cover,#cover_info,#loading_info,.controls,.table,.table_title,#weather_input').remove();
            }
            else {
                var empty_location = true;
                if (json.from_location_city !== "") {
                    empty_location = false;
                    $('#locations').append('<p class="location_name" data-name="' + json.from_location_city + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.from_location_city + '</p>')

                }
                if (empty_location) {
                    $('#locations').append('<p class="location_name" style="cursor: default">-</p>')
                }

                var empty_time = true;
                if (json.created_time !== "") {
                    empty_time = false;
                    var time = json.created_time;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);
                    if (json.updated_time !== "") {
                        $('#times').append('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + ',</p>'); //add ,
                    }
                    else {
                        $('#times').append('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>');
                    }
                }
                if (json.updated_time !== "") {
                    empty_time = false;
                    var time = json.updated_time;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':' + time.substring(15, 17);
                    $('#times').append('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                }
                if (empty_time) {
                    $('#times').append('<p class="location_name" style="cursor: default">-</p>')
                }

                $('#user_video').show();
                $table_video.append(' <tr><td>Video Title</td><td>' + json.title + '</td></tr>');
                $table_video.append(' <tr><td>Video ID</td><td>' + json.video_id + '</td></tr>');
                $table_video.append(' <tr><td>Video Content Category</td><td>' + json.content_category + '</td></tr>');
                $table_video.append(' <tr><td>Video Content Tags</td><td>' + json.content_tags.join(", ") + '</td></tr>');
                $table_video.append(' <tr><td>Video Desctiption</td><td>' + json.video_description + '</td></tr>');
                $table_video.append(' <tr><td>Video Created Time</td><td>' + json.created_time + '</td></tr>');
                $table_video.append(' <tr><td>Video Updated Time</td><td>' + json.updated_time + '</td></tr>');
                $table_video.append(' <tr><td>Video Comments</td><td>' + json.total_comment_count + '</td></tr>');
                $table_video.append(' <tr><td>Video Embeddable</td><td>' + json.embeddable + '</td></tr>');
                $table_video.append(' <tr><td>Video Length</td><td>' + json.length + '</td></tr>');
                $table_video.append(' <tr><td>Video Picture</td><td ><img id="imgtab" class="small" src="' + json.picture + '"></td></tr>');
                $table_video.append(' <tr><td>Video Privacy</td><td>' + json.privacy + '</td></tr>');

                $table_channel.append(' <tr><td>Source</td><td>' + json.from + '</td></tr>');
                $table_channel.append(' <tr><td>About</td><td>' + json.from_about + '</td></tr>');
                $table_channel.append(' <tr><td>Category</td><td>' + json.from_category + '</td></tr>');
                $table_channel.append(' <tr><td>Fan Count</td><td>' + json.from_fan_count + '</td></tr>');
                $table_channel.append(' <tr><td>Link</td><td class="link" data-url="' + json.from_link + '">' + json.from_link + '<img src="imgs/link_icon.png"></td></tr>');
                $table_channel.append(' <tr><td>Verified</td><td>' + json.from_is_verified + '</td></tr>');
                $table_channel.append(' <tr><td>Description</td><td>' + json.description + '</td></tr>');
                $table_channel.append(' <tr><td>City</td><td>' + json.from_location_city + '</td></tr>');
                $table_channel.append(' <tr><td>Country</td><td>' + json.from_location_country + '</td></tr>');
                $table_channel.append(' <tr><td>Website</td><td class="link" data-url="' + json.from_website + '">' + json.from_website + '<img src="imgs/link_icon.png"></td></tr>');


                for (var i = 0; i < json.video_thumbnails.length; i++) {
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
                $('#verified').html('VERIFICATION (' + json.num_verification_comments + ')');
                $('#all').html('ALL (' + json.video_comments.length + ')');
                verification_comments = [];
                for (var k = 0; k < json.verification_comments.length; k++) {
                    verification_comments.push(json.verification_comments[k]);
                }
                comments(true);

                $('#loading_all,#cover,#cover_info,#loading_info').remove();
                $('.controls,.table,.table_title,#weather_input').show();
            }
        },
        error: function () {

        },
        async: true
    });
}
function get_weather() {
    if (!($('#weather_btn').hasClass("disable_btn"))) {
        $('#weather_error').slideUp();
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
            url: 'http://caa.iti.gr:8090/weather?time=' + time + '&location=' + $('#location_input').val(),
            dataType: 'json',
            success: function (json) {
                if (json.hasOwnProperty("message")) {
                    $('#weather_error').html(json.message).slideDown();
                    $('.widget').hide().removeClass('widget_blur');
                }
                else {
                    var summary, visibility, preciptype, icon, cloud_cover, wind_speed, temp, min_temp, max_temp, day_indi;
                    if (checked) {
                        if (!(json.hourly.data_exist)) {
                            $('#weather_error').html("No Weather Data for this Location/Timestamp").slideDown();
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
                            $('#weather_error').html("No Weather Data for this Location/Timestamp").slideDown();
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
            $('#loc_error').slideDown();
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
    $('#loc_error,#weather_error').slideUp();
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

$(function () {
    $('.tab ul.tabs li a').click(function (g) {
        var tab = $(this).closest('.tab'),
            index = $(this).closest('li').index();

        tab.find('ul.tabs > li').removeClass('current');
        $(this).closest('li').addClass('current');

        tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
        tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();


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
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
