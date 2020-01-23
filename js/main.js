var video_verify = gup('video');
var image_verify = gup('image');
var reprocess = gup('reprocess');
var arabic = /[\u0600-\u06FF]/;
$(function () {
    $('.tab ul.tabs li a').click(function (g) {
        var tab = $(this).closest('.tab'),
            index = $(this).closest('li').index();

        tab.find('ul.tabs > li').removeClass('current');
        $(this).closest('li').addClass('current');

        tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').stop().slideUp();
        tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').stop().slideDown();

        var offset = 162;
        if ($('.tab').hasClass('sticky_tab')) {
            offset = 81
        }
        $('html, body').animate({
            scrollTop: $(".section_title").eq($(this).parent().index()).offset().top - offset
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

    var count = 1;
    $("#user_tw_table,#user_tw_table_more").on("click", "#imgtab2", function () {
        var $this = $(this);
        $this.removeClass('small, large', 400);
        $this.addClass((count == 1) ? 'large' : 'small', 400);
        count = 1 - count;
    });

    (function myLoop() {
        setTimeout(function () {
            if (isLoaded) {
                fb_ready();
            }
            else {
                myLoop()
            }
        }, 1000)
    })();

    var fixmeTop = $('.tab').offset().top + 424;
    $(window).scroll(function () {
        var currentScroll = $(window).scrollTop();
        if (currentScroll <= fixmeTop) {
            $('.tab').removeClass('sticky_tab');
        } else {
            $('.tab').addClass('sticky_tab');
        }
    });
    $('#time_input').timepicker({
        timeFormat: 'HH:mm',
        interval: 60,
        startHour: 0,
        startMinutes: 0,
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
    $('#date_input').datetimepicker({
        timepicker: false,
        format: 'd/m/Y',
        maxDate: '+1970/01/01'
    });
});

function fb_ready() {
    if (video_verify === "" && image_verify === "") {
        //$('.form-checkbox-field').eq(0).attr('checked', true);
        checkLoginState("index");
        $('#video_examples,.desc_p,#links_wrapper,#video_examples_twitter,hr,.title_example').show();
        var options_thumbs = {
            autoResize: true,
            container: $('#video_examples'),
            offset: 15,
            itemWidth: 360,
            outerOffset: 0
        };
        $('#video_examples').find('.video').wookmark(options_thumbs);
        var tweet1 = document.getElementById("tweet1");
        var id1 = tweet1.getAttribute("data-tweetID");

        twttr.widgets.createTweet(
            id1, tweet1,
            {
                conversation: 'none',
                cards: 'visible',
                theme: 'light',
                width: 360
            })
            .then(function () {
                $('#tweet1').append('<p class="video_desc">The video claimed to depict the cat 5 Irma winds in Barbados while it is actually footage of another tornado. Several comments mention that this is a video from other location and event.</p> <button type="button" onclick="verify_example(\'https://twitter.com/acardnal/status/905257372066750466\');return false;" class="btn btn_small"> Verify </button>');
                options_thumbs = {
                    autoResize: true,
                    container: $('#video_examples_twitter'),
                    offset: 15,
                    itemWidth: 360,
                    outerOffset: 0
                };
                $('#video_examples_twitter').find('.video').wookmark(options_thumbs);
            });

        var tweet3 = document.getElementById("tweet3");
        var id3 = tweet3.getAttribute("data-tweetID");

        twttr.widgets.createTweet(
            id3, tweet3,
            {
                conversation: 'none',
                cards: 'visible',
                theme: 'light',
                width: 360
            })
            .then(function () {
                $('#tweet3').append('<p class="video_desc">This video supposedly shows a girl taking revenge on catcalling van driver but it is actually staged.</p> <button type="button" onclick="verify_example(\'https://twitter.com/acardnal/status/834326652360458241\');return false;" class="btn btn_small"> Verify </button>');
                options_thumbs = {
                    autoResize: true,
                    container: $('#video_examples_twitter'),
                    offset: 15,
                    itemWidth: 360,
                    outerOffset: 0
                };
                $('#video_examples_twitter').find('.video').wookmark(options_thumbs);
            });
    }
    else {
        if (reprocess === "true") {
            $('#reprocess_check').attr('checked', true);
        }
        $('#video_examples,#video_examples_facebook,#video_examples_twitter,.desc_p,#links_wrapper,hr,.title_example').remove();
        $('.back,.section_title,#loading_all,#cover,.tab,.sticky_tab').show();
        $('.section_title').eq(3).hide();//laaposto for tests only
        if (video_verify != "") {
            $('.form-checkbox-field').eq(0).attr('checked', true);
            $("#video_verify").val(video_verify);

            if ((video_verify.indexOf('facebook.com') > -1) || (video_verify.indexOf('fb.me') > -1)) {
                checkLoginState("video");
            }
            else if (video_verify.indexOf('twitter.com') > -1) {
                $('#user_video').empty().css({'width': '360px', 'margin': '30px auto 0'});
                twttr.widgets.createVideo(video_verify.split('/').pop(), document.getElementById("user_video"),
                    {})
                    .then(function () {
                        var fixmeTop = $('.tab').offset().top + $('#user_video').height();
                        $(window).scroll(function () {
                            var currentScroll = $(window).scrollTop();
                            if (currentScroll <= fixmeTop) {
                                $('.tab').removeClass('sticky_tab');
                            } else {
                                $('.tab').addClass('sticky_tab');
                            }
                        });
                    });
                $('.table_title').eq(0).text("TWEET");
                $('.table_title').eq(1).text("USER");
                start_video_calls_twitter();
            }
            else {
                var iframe_url = "https://www.youtube.com/embed/" + youtube_parser(video_verify);
                $('#iframe').attr('src', iframe_url);
                start_video_calls_youtube();
            }
        }
        else {
            $('.form-checkbox-field').eq(1).attr('checked', true);
            $('.table_title').eq(0).text("IMAGE");
            $("#video_verify").val(image_verify);
            checkLoginState("image");
        }


    }
}
function detect_video_drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    video_verify = evt.dataTransfer.getData('text');
    if (video_verify.length < 300) {
        var reprocess_param = "";
        if ($('#reprocess_check').is(":checked")) {
            reprocess_param = "&reprocess=true";
        }
        if ($(".form-checkbox-field:checked").val() === "video") {
            window.location.href = 'https://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_verify.replace('&', '%26') + reprocess_param;

        }
        else if ($(".form-checkbox-field:checked").val() === "image") {
            window.location.href = 'https://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?image=' + video_verify.replace('&', '%26') + reprocess_param;
        }
        else {
            $('#checkbox_error').slideDown();
        }
    } else {
        $('#myModal h1').html("Oops! Something went wrong");
        $('#myModal p').html("The provived video URL is <b>" + video_verify.length + "</b> characters long<br/>We can not handle such big URL");
        $('#myModal').reveal();
    }
}
function verify_video_text() {
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=true";
    }
    if ($("#video_verify").val() !== "") {

        if ($(".form-checkbox-field:checked").val() === "video") {
            window.location.href = 'https://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + $("#video_verify").val().replace('&', '%26') + reprocess_param;

        }
        else if ($(".form-checkbox-field:checked").val() === "image") {
            window.location.href = 'https://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?image=' + $("#video_verify").val().replace('&', '%26') + reprocess_param;
        }
        else {
            $('#checkbox_error').slideDown();
        }
    }
}

$("#video_verify").keyup(function (e) {
    if (e.keyCode === 13) {
        verify_video_text();
    }
});

function start_video_calls_youtube() {
    $.ajax({
        url: "store_url.php?url=" + video_verify,
        type: "GET",
        success: function (msg) {
        }
    });
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=1";
    }
    if (gup('delete') === "yes") {

        $.ajax({
            type: 'DELETE',
            url: 'https://caa.iti.gr/caa/api/v4/videos/reports/3wAjpMP5eyo',
            dataType: 'json',
            success: function (json_outer) {
                alert("OK");
            },
            async: true
        });
    }
    else {
        $.ajax({
            type: 'POST',
            url: 'https://caa.iti.gr/caa/api/v4/videos/jobs?url=' + video_verify + reprocess_param,
            dataType: 'json',
            success: function (json_outer) {
                var interval_youtube_calls = setInterval(function () {
                    $.ajax({
                        type: 'GET',
                        url: 'https://caa.iti.gr/caa/api/v4/videos/jobs/' + json_outer.id,
                        dataType: 'json',
                        success: function (json_inner) {
                            $('#analysis_info_msg').text('Status: ' + json_inner.status);
                            $('#analysis_info,#alert_comments').slideDown();
                            //media_id
                            if (json_inner.status === "unavailable") {

                                $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input,.comments_search,#alert_comments').remove();
                                $('#analysis_info_msg').text(json_inner.sjob.message);
                                $('#analysis_info').slideDown();
                                setTimeout(function () {
                                    abort_jobs();
                                    abort_tw();
                                    clearInterval(interval_youtube_calls);
                                }, 1500);
                            } else if (json_inner.status === "processing") {
                                load_youtube(json_inner);
                                load_twitter("-", "-", json_inner, "video");
                            } else {//done

                                load_youtube(json_inner);
                                load_twitter("-", "-", json_inner, "video");
                                setTimeout(function () {
                                    abort_jobs();
                                    abort_tw();
                                    clearInterval(interval_youtube_calls);
                                }, 1500);

                            }
                        }
                    });
                }, 1000);
            },
            async: true
        });

    }

}
function start_video_calls_facebook(type) {
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=1";
    }
    if (type === "video") {
        $.ajax({
            url: "store_url.php?url=" + video_verify,
            type: "GET",
            success: function (msg) {
            }
        });

        if (gup('delete') === "yes") {

            $.ajax({
                type: 'DELETE',
                url: 'https://caa.iti.gr/caa/api/v4/videos/reports/10101373686098937',
                dataType: 'json',
                success: function (json_outer) {
                    alert("OK");
                },
                async: true
            });
        }
        else {
            $.ajax({
                type: 'POST',
                url: 'https://caa.iti.gr/caa/api/v4/videos/jobs?url=' + video_verify + reprocess_param + "&fb_access_token=" + fb_access_token,
                dataType: 'json',
                success: function (json_outer) {
                    var interval_facebook_calls = setInterval(function () {
                        $.ajax({
                            type: 'GET',
                            url: 'https://caa.iti.gr/caa/api/v4/videos/jobs/' + json_outer.id,
                            dataType: 'json',
                            success: function (json_inner) {
                                $('#analysis_info_msg').text('Status: ' + json_inner.status);
                                $('#analysis_info,#alert_comments').slideDown();
                                //media_id
                                if (json_inner.status === "unavailable") {

                                    $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input,.comments_search,#alert_comments').remove();
                                    $('#analysis_info_msg').text(json_inner.sjob.message);
                                    $('#analysis_info').slideDown();

                                    setTimeout(function () {
                                        abort_jobs();
                                        abort_tw();
                                        clearInterval(interval_facebook_calls);
                                    }, 1500);
                                } else if (json_inner.status === "processing") {
                                    load_facebook(json_inner, "video");
                                    load_twitter("-", "-", json_inner, "video");
                                } else {//done
                                    load_facebook(json_inner, "video");
                                    load_twitter("-", "-", json_inner, "video");
                                    setTimeout(function () {
                                        abort_jobs();
                                        abort_tw();
                                        clearInterval(interval_facebook_calls);
                                    }, 1500);
                                }
                            }
                        });
                    }, 1000);
                },
                async: true
            });
        }
    }
    else {
        $.ajax({
            url: "store_url.php?url=" + image_verify,
            type: "GET",
            success: function (msg) {
            }
        });

        if (gup('delete') === "yes") {

            $.ajax({
                type: 'DELETE',
                url: 'https://caa.iti.gr/caa/api/v4/videos/reports/10101373686098937',
                dataType: 'json',
                success: function (json_outer) {
                    alert("OK");
                },
                async: true
            });
        }
        else {
            $.ajax({
                type: 'POST',
                url: 'https://caa.iti.gr/caa/api/v4/images/jobs?url=' + image_verify + reprocess_param + "&fb_access_token=" + fb_access_token,
                dataType: 'json',
                success: function (json_outer) {
                    var interval_facebook_calls = setInterval(function () {
                        $.ajax({
                            type: 'GET',
                            url: 'https://caa.iti.gr/caa/api/v4/images/jobs/' + json_outer.id,
                            dataType: 'json',
                            success: function (json_inner) {
                                $('#analysis_info_msg').text('Status: ' + json_inner.status);
                                $('#analysis_info,#alert_comments').slideDown();
                                //media_id
                                if (json_inner.status === "unavailable") {

                                    $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input,.comments_search,#alert_comments').remove();
                                    $('#analysis_info_msg').text(json_inner.sjob.message);
                                    $('#analysis_info').slideDown();

                                    setTimeout(function () {
                                        abort_jobs();
                                        abort_tw();
                                        clearInterval(interval_facebook_calls);
                                    }, 1500);
                                } else if (json_inner.status === "processing") {
                                    load_facebook(json_inner, "image");
                                    load_twitter("-", "-", json_inner, "image");
                                } else {//done
                                    load_facebook(json_inner, "image");
                                    load_twitter("-", "-", json_inner, "image");
                                    setTimeout(function () {
                                        abort_jobs();
                                        abort_tw();
                                        clearInterval(interval_facebook_calls);
                                    }, 1500);
                                }
                            }
                        });
                    }, 1000);
                },
                async: true
            });
        }
    }

}
function start_video_calls_twitter() {
    $.ajax({
        url: "store_url.php?url=" + video_verify,
        type: "GET",
        success: function (msg) {
        }
    });
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=1";
    }
    $.ajax({
        type: 'POST',
        url: 'https://caa.iti.gr/caa/api/v4/videos/jobs?url=' + video_verify + reprocess_param,
        dataType: 'json',
        success: function (json_outer) {
            var interval_twitter_calls = setInterval(function () {
                $.ajax({
                    type: 'GET',
                    url: 'https://caa.iti.gr/caa/api/v4/videos/jobs/' + json_outer.id,
                    dataType: 'json',
                    success: function (json_inner) {
                        $('#analysis_info_msg').text('Status: ' + json_inner.status);
                        $('#analysis_info,#alert_comments').slideDown();
                        //media_id
                        if (json_inner.status === "unavailable") {

                            $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input,.comments_search,#alert_comments').remove();
                            $('#analysis_info_msg').text(json_inner.sjob.message);
                            $('#analysis_info').slideDown();
                            setTimeout(function () {
                                abort_jobs();
                                abort_tw();
                                clearInterval(interval_twitter_calls);
                            }, 1500);
                        } else if (json_inner.status === "processing") {
                            load_twitter_video(json_inner);
                            load_twitter("-", "twitter", json_inner, "video");
                        } else {//done
                            load_twitter_video(json_inner);
                            load_twitter("-", "twitter", json_inner, "video");
                            setTimeout(function () {
                                abort_jobs();
                                abort_tw();
                                clearInterval(interval_twitter_calls);
                            }, 1500);
                        }
                    }
                });
            }, 1000);
        },
        async: true
    });
}

$("#thumb_info").on("click", ".link", function () {
    window.open($(this).attr('data-url'), '_blank');
});

$('.twitter_p').click(function () {
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
    if (match) {
        match[2] = match[2].replace(/\//g, '').replace(/%20/g, '');
    }
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return "error"
    }
}

function verify_example(video_url) {
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=true";
    }
    window.location.href = 'https://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_url.replace('&', '%26') + reprocess_param;
}

var json_metadata = true, json_comments = true, json_debunk = true, json_location = true, json_ai = true, json_weather = true;
function load_youtube(json) {

    var $tiles_thumbs = $('#thumb_info');
    var $tiles_comments = $('#comments_info');
    $.ajax({
        type: 'GET',
        url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + json.media_id,
        dataType: 'json',
        success: function (json_inner) {

            if (json_metadata) {
                $('.twitter_p').attr('data-url', json_inner.verification_cues.twitter_search_url);
                //title
                if (json_inner.video.title !== "") {
                    guessLanguage.detect(json_inner.video.title, function (language) {
                        var translate_dom = '<p class="translate_wrapper_table"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        $('#video_title').html('<span>' + json_inner.video.title + '</span>' + translate_dom);
                        if (arabic.test(json_inner.video.title)) {
                            $('#video_title').css({'direction': 'rtl', 'text-align': 'right'});
                        }
                    });
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_title').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>Title</td> <td>Not Available</td> </tr>');
                }

                //description
                if (json_inner.video.description !== "") {
                    guessLanguage.detect(json_inner.video.description, function (language) {
                        var translate_dom = '<p class="translate_wrapper_table"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        $('#video_description').html('<span>' + json_inner.video.description + '</span>' + translate_dom);
                        if (arabic.test(json_inner.video.description)) {
                            $('#video_description').css({'direction': 'rtl', 'text-align': 'right'});
                        }
                    });
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_description').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>Description</td> <td>Not Available</td> </tr>');
                }

                //publishedAt
                if (json_inner.video.publishedAt !== "") {
                    $('#video_upload_time').text(json_inner.video.publishedAt);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_upload_time').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>Upload Time</td> <td>Not Available</td> </tr>');
                }

                //viewCount
                if (json_inner.video.viewCount > -1) {
                    $('#video_view_count').text(json_inner.video.viewCount);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_view_count').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>View Count</td> <td>Not Available</td> </tr>');
                }

                //likeCount
                if (json_inner.video.likeCount > -1) {
                    $('#video_like_count').text(json_inner.video.likeCount);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_like_count').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>Like Count</td> <td>Not Available</td> </tr>');
                }

                //dislikeCount
                if (json_inner.video.dislikeCount > -1) {
                    $('#video_dislike_count').text(json_inner.video.dislikeCount);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_dislike_count').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>Dislike Count</td> <td>Not Available</td> </tr>');
                }

                //duration
                if (json_inner.video.duration !== "") {
                    $('#video_duration').text(json_inner.video.duration);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_duration').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>Duration</td> <td>Not Available</td> </tr>');
                }

                //dimension
                if (json_inner.video.dimension !== "") {
                    $('#video_dimension').text(json_inner.video.dimension);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_dimension').parent().remove();
                    $('#video_yt_table_more tbody').append('<td>Dimension<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_dimension"></td>');
                }

                //definition
                if (json_inner.video.definition !== "") {
                    $('#video_definition').text(json_inner.video.definition);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_definition').parent().remove();
                    $('#video_yt_table_more tbody').append('<td>Definition<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_definition"></td>');
                }

                //licensedContent
                if (json_inner.video.licensedContent !== "") {
                    $('#video_licensed_content').text(json_inner.video.licensedContent);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_licensed_content').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>Licensed Content<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_licensed"></td> <td id="video_licensed_content">false</td> </tr>');
                }

                //id
                if (json_inner.id !== "") {
                    $('#video_id').html(json_inner.id);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#video_id').parent().remove();
                    $('#video_yt_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                }

                /* ---------------------------------- */

                //id
                if (json_inner.source.id !== "") {
                    $('#channel_id').text(json_inner.source.id);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_id').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                }

                //title
                if (json_inner.source.title !== "") {
                    $('#channel_title').text(json_inner.source.title);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_title').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Title</td> <td>Not Available</td> </tr>');
                }

                //aboutPage
                if (json_inner.source.aboutPage !== "") {
                    $('#channel_about_page').html('<a target="_blank" href="' + json_inner.source.aboutPage + '">' + json_inner.source.aboutPage + '</a>');
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_about_page').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>About Page</td> <td>Not Available</td> </tr>');
                }

                //url
                if (json_inner.source.url !== "") {
                    $('#channel_url').html('<a target="_blank" href="' + json_inner.source.url + '">' + json_inner.source.url + '</a>');
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_url').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>URL</td> <td>Not Available</td> </tr>');
                }

                //publishedAt
                if (json_inner.source.publishedAt !== "") {
                    $('#channel_created_time').text(json_inner.source.publishedAt);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_created_time').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                }

                //country
                if (json_inner.source.country !== "") {
                    $('#channel_location').text(json_inner.source.country);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_location').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Location</td> <td>Not Available</td> </tr>');
                }

                //description
                if (json_inner.source.description !== "") {
                    guessLanguage.detect(json_inner.source.description, function (language) {
                        var translate_dom = '<p class="translate_wrapper_table"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        $('#channel_description').html('<span>' + json_inner.source.description + '</span>' + translate_dom);
                        if (arabic.test(json_inner.source.description)) {
                            $('#channel_description').css({'direction': 'rtl', 'text-align': 'right'});
                        }
                    });
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_description').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Description</td> <td>Not Available</td> </tr>');
                }

                //viewCount
                if (json_inner.source.viewCount > -1) {
                    $('#channel_view_count').text(json_inner.source.viewCount);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_view_count').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>View Count</td> <td>Not Available</td> </tr>');
                }

                //commentCount
                if (json_inner.source.commentCount > -1) {
                    $('#channel_comment_count').text(json_inner.source.commentCount);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_comment_count').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Comment Count</td> <td>Not Available</td> </tr>');
                }

                //subscriberCount
                if (json_inner.source.subscriberCount > -1) {
                    $('#channel_subscriber_count').text(json_inner.source.subscriberCount);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_subscriber_count').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Subscriber Count</td> <td>Not Available</td> </tr>');
                }

                //videoCount
                if (json_inner.source.videoCount > -1) {
                    $('#channel_video_count').text(json_inner.source.videoCount);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_video_count').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Video Count</td> <td>Not Available</td> </tr>');
                }
                //videoPerMonth
                if (json_inner.verification_cues.channel_videos_per_month > -1) {
                    $('#channel_videos_per_month').text(json_inner.verification_cues.channel_videos_per_month);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#channel_videos_per_month').parent().remove();
                    $('#channel_yt_table_more tbody').append('<tr> <td>Video Per Month</td> <td>Not Available</td> </tr>');
                }

                if ($('.preferred').length === 0 && json_inner.thumbnails.preferred.url != "") {
                    $tiles_thumbs.append('<div class="ca-item" style="width:230px;"><div class="ca-item-main preferred"><img src="' + json_inner.thumbnails.preferred.url + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json_inner.thumbnails.preferred.google_reverse_image_search + '">Google</li><li class="link" data-url="' + json_inner.thumbnails.preferred.yandex_reverse_image_search + '">Yandex</li></ul></div></div>');
                    if (json_inner.thumbnails.preferred.in_video) {
                        $('#alert_clickbait').slideDown();
                        $(".ca-item-main").find("img[src='" + json_inner.thumbnails.preferred.url + "']").parents('.ca-item').css('border', '5px solid red');
                    }
                }

                for (var i = $('#thumb_info .ca-item-other').length; i < json_inner.thumbnails.others.length; i++) {
                    $tiles_thumbs.append('<div class="ca-item ca-item-other" style="width:230px"><div class="ca-item-main"><img src="' + json_inner.thumbnails.others[i].url + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json_inner.thumbnails.others[i].google_reverse_image_search + '">Google</li><li class="link" data-url="' + json_inner.thumbnails.others[i].yandex_reverse_image_search + '">Yandex</li></ul></div></div>');
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
            }
            if (json.sproc.status_metadata === "done" && json_metadata) {
                json_metadata = false;
            }


            if (json_comments) {
                for (var c = $('.verified').length; c < json_inner.verification_comments.length; c++) {
                    var src_str = json_inner.verification_comments[c].textDisplay;
                    guessLanguage.detect(src_str, function (language) {
                        var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                        var term;
                        var pattern;
                        for (var i = 0; i < fake_terms.length; i++) {
                            term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                            if (arabic.test(src_str)) {
                                pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                            }
                            else {
                                pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                            }

                            src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                            src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                        }
                        if (arabic.test(src_str)) {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.verification_comments[c].authorURL + '" target="_blank">' + json_inner.verification_comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                        }
                        else {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.verification_comments[c].authorURL + '" target="_blank">' + json_inner.verification_comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                        }
                    });
                }
                if (json_inner.verification_comments.length === 10) {
                    $('.more').show();
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
            $('#verified').attr('data-id', json.media_id);
            $('#all').attr('data-id', json.media_id);
            $('#extr_links').attr('data-id', json.media_id);
            if (json.sproc.status_comments === "done" && json_comments) {
                json_comments = false;
                $('#verified').html('VERIFICATION (' + json_inner.verification_cues.num_verification_comments + ')');
                $('#all').html('ALL (' + json_inner.verification_cues.num_comments + ')');
                $('#extr_links').html('LINKS (' + json_inner.verification_cues.num_link_comments + ')');
                if (json_inner.verification_cues.num_verification_comments === 10) {
                    $('.more').hide();
                }
                if (json_inner.verification_cues.num_verification_comments === 0) {
                    $('#none_comments').text("No verification comments at the moment").show();
                }
                $('#alert_comments').remove();
                $('.comments_search').show();
            }


            /*if (json.sproc.status_debunk === "done" && json_debunk) {
             json_debunk = false;
             $('.debunked').show();
             if (json_inner.verification_cues.known_history.explanation !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.explanation + '</p>');
             }
             if (json_inner.verification_cues.known_history.known_facts !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.known_facts + '</p>');
             }
             if (json_inner.verification_cues.known_history.fact_source !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.fact_source + '</p>');
             }
             if (json_inner.verification_cues.known_history.label !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.label + '</p>');
             }
             if (json_inner.verification_cues.known_history.first_known_instance !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.first_known_instance + '</p>');
             }
             $('.debunked').append('<p>Is visual clickbait: ' + json_inner.verification_cues.is_visual_clickbait + '</p>');
             }*/


            if (json.sproc.status_location === "done" && json_location) {
                json_location = false;
                var locations = [];
                if (json_inner.mentioned_locations.detected_locations.length === 0) {
                    $('#video_locations').parent().remove();
                    $('#video_yt_table tbody').append('<tr> <td>Mentioned Locations</td> <td>Not Available</td> </tr>');
                }
                else {
                    for (var l = 0; l < json_inner.mentioned_locations.detected_locations.length; l++) {
                        locations.push('<a href="' + json_inner.mentioned_locations.detected_locations[l].wikipedia_url + '" target="_blank">' + json_inner.mentioned_locations.detected_locations[l].location + '</a> (' + json_inner.mentioned_locations.detected_locations[l].text_source + ')')
                    }
                    $('#video_locations').append(locations.join(', '));
                }
            }

            if (json.sproc.status_ai_verification === "done" && json_ai) {
                json_ai = false;
                $('.debunked').show();
                $('.debunked').append('<p> Verification ai score: ' + json_inner.verification_cues.verification_ai_score + '</p>');
            }


            if (json.sproc.status_weather === "done" && json_weather) {
                json_weather = false;
            }

            $('#loading_all,#cover,#cover_info,#loading_info').remove();
            if (!($('.vis-timeline').length)) {
                $('#cover_timeline,#loading_timeline').show();
            }

            $('#user_video').show();
            $('.controls,.table_title,#weather_input,#channel_yt_table,#video_yt_table,.video_yt,.channel_yt').show();
            $('.tooltip').tooltipster({"contentAsHTML": true});

        },
        error: function (e) {
        },
        async: true
    });

}
function load_facebook(json, type) {
    var $tiles_thumbs = $('#thumb_info');
    var $tiles_comments = $('#comments_info');
    if (type === "video") {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + json.media_id,
            dataType: 'json',
            success: function (json_inner) {
                //if (json_metadata) {
                $('.twitter_p').attr('data-url', json_inner.verification_cues.twitter_search_url);
                if (json_inner.video.title !== "") {
                    guessLanguage.detect(json_inner.video.title, function (language) {
                        var translate_dom = '<p class="translate_wrapper_table"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        $('#fb_video_title').html('<span>' + json_inner.video.title + '</span>' + translate_dom);
                    });
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_video_title').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Title</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.description !== "") {
                    guessLanguage.detect(json_inner.video.description, function (language) {
                        var translate_dom = '<p class="translate_wrapper_table"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        $('#fb_video_description').html('<span>' + json_inner.video.description + '</span>' + translate_dom);
                        if (arabic.test(json_inner.video.description)) {
                            $('#fb_video_description').css({'direction': 'rtl', 'text-align': 'right'});
                        }
                    });
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_video_description').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Desctiption</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.created_time !== "") {
                    $('#fb_created_time').text(json_inner.video.created_time);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_created_time').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                }


                if (json_inner.video.updated_time !== "") {
                    $('#fb_updated_time').text(json_inner.video.updated_time);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_updated_time').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Updated Time<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_updated_time"></td> <td id="fb_updated_time">2015-02-25, 08:18:58 (UTC)</td> </tr>');
                }

                if (json_inner.video.embeddable !== "") {
                    $('#fb_embeddable').text(json_inner.video.embeddable);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_embeddable').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Embeddable</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.length !== "") {
                    $('#fb_length').text(json_inner.video.length);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_length').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Length</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.privacy !== "") {
                    $('#fb_privacy').text(json_inner.video.privacy);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_privacy').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Privacy</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.likes > -1) {
                    $('#fb_likes').text(json_inner.video.likes);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_likes').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Likes</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.content_category !== "") {
                    $('#fb_content_category').text(json_inner.video.content_category);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_content_category').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Content Category</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.content_tags.length > 0) {
                    $('#fb_content_tags').text(json_inner.video.content_tags.join(','));
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_content_tags').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Content Tags</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.id !== "") {
                    $('#fb_video_id').text(json_inner.id);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_video_id').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.from !== "") {
                    $('#fb_source').text(json_inner.source.from);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_source').parent().remove();
                    $('#video_fb_table_more tbody').append('<tr> <td>Source</td> <td>Not Available</td> </tr>');
                }

                if ($('.preferred').length === 0 && json_inner.thumbnails.preferred.url != "") {
                    $tiles_thumbs.append('<div class="ca-item" style="width:230px;"><div class="ca-item-main preferred"><img src="' + json_inner.thumbnails.preferred.url + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json_inner.thumbnails.preferred.google_reverse_image_search + '">Google</li><li class="link" data-url="' + json_inner.thumbnails.preferred.yandex_reverse_image_search + '">Yandex</li></ul></div></div>');
                    if (json_inner.thumbnails.preferred.in_video) {
                        $('#alert_clickbait').slideDown();
                        $(".ca-item-main").find("img[src='" + json_inner.thumbnails.preferred.url + "']").parents('.ca-item').css('border', '5px solid red');
                    }
                }
                for (var i = $('#thumb_info .ca-item-other').length; i < json_inner.thumbnails.others.length; i++) {
                    $tiles_thumbs.append('<div class="ca-item ca-item-other" style="width:230px"><div class="ca-item-main"><img src="' + json_inner.thumbnails.others[i].url + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json_inner.thumbnails.others[i].google_reverse_image_search + '">Google</li><li class="link" data-url="' + json_inner.thumbnails.others[i].yandex_reverse_image_search + '">Yandex</li></ul></div></div>');
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
                //}
                if (json.sproc.status_metadata === "done" && json_metadata) {
                    json_metadata = false;
                }


                if (json_comments) {
                    for (var c = $('.verified').length; c < json_inner.verification_comments.length; c++) {
                        var src_str = json_inner.verification_comments[c].textDisplay;
                        guessLanguage.detect(src_str, function (language) {
                            var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                            if (language === "en") {
                                translate_dom = ""
                            }
                            var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                            var term;
                            var pattern;
                            for (var i = 0; i < fake_terms.length; i++) {
                                term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                                if (arabic.test(src_str)) {
                                    pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                                }
                                else if (json.sproc.status_metadata === "done") {
                                    pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                                }

                                src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                                src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                            }
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                            }
                        });
                    }
                    if (json_inner.verification_comments.length === 10) {
                        $('.more').show();
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
                $('#verified').attr('data-id', json.media_id);
                $('#all').attr('data-id', json.media_id);
                $('#extr_links').attr('data-id', json.media_id);
                if (json.sproc.status_comments === "done" && json_comments) {
                    json_comments = false;
                    $('#verified').html('VERIFICATION (' + json_inner.verification_cues.num_verification_comments + ')');
                    $('#all').html('ALL (' + json_inner.verification_cues.num_comments + ')');
                    $('#extr_links').html('LINKS (' + json_inner.verification_cues.num_link_comments + ')');
                    if (json_inner.verification_cues.num_verification_comments === 10) {
                        $('.more').hide();
                    }

                    if (json_inner.verification_cues.num_verification_comments === 0) {
                        $('#none_comments').text('No verification comments at the moment').show();
                    }

                    $('#alert_comments').remove();
                    $('.comments_search').show();
                }

                /*if (json.sproc.status_debunk === "done" && json_debunk) {
                 json_debunk = false;
                 $('.debunked').show();
                 if (json_inner.verification_cues.known_history.explanation !== "") {
                 $('.debunked').append('<p>' + json_inner.verification_cues.known_history.explanation + '</p>');
                 }
                 if (json_inner.verification_cues.known_history.known_facts !== "") {
                 $('.debunked').append('<p>' + json_inner.verification_cues.known_history.known_facts + '</p>');
                 }
                 if (json_inner.verification_cues.known_history.fact_source !== "") {
                 $('.debunked').append('<p>' + json_inner.verification_cues.known_history.fact_source + '</p>');
                 }
                 if (json_inner.verification_cues.known_history.label !== "") {
                 $('.debunked').append('<p>' + json_inner.verification_cues.known_history.label + '</p>');
                 }
                 if (json_inner.verification_cues.known_history.first_known_instance !== "") {
                 $('.debunked').append('<p>' + json_inner.verification_cues.known_history.first_known_instance + '</p>');
                 }
                 $('.debunked').append('<p>Is visual clickbait: ' + json_inner.verification_cues.is_visual_clickbait + '</p>');
                 }*/


                if (json.sproc.status_location === "done" && json_location) {
                    json_location = false;
                    var locations = [];
                    if (json_inner.mentioned_locations.detected_locations.length === 0) {
                        $('#fb_video_locations').parent().remove();
                        $('#video_fb_table tbody').append('<tr> <td>Mentioned Locations</td> <td>Not Available</td> </tr>');
                    }
                    else {
                        for (var l = 0; l < json_inner.mentioned_locations.detected_locations.length; l++) {
                            locations.push('<a href="' + json_inner.mentioned_locations.detected_locations[l].wikipedia_url + '" target="_blank">' + json_inner.mentioned_locations.detected_locations[l].location + '</a> (' + json_inner.mentioned_locations.detected_locations[l].text_source + ')')
                        }
                        $('#fb_video_locations').append(locations.join(', '));
                    }
                }

                if (json.sproc.status_ai_verification === "done" && json_ai) {
                    json_ai = false;
                    $('.debunked').show();
                    $('.debunked').append('<p> Verification ai score: ' + json_inner.verification_cues.verification_ai_score + '</p>');
                }


                if (json.sproc.status_weather === "done" && json_weather) {
                    json_weather = false;
                }

                $('#loading_all,#cover,#cover_info,#loading_info').remove();
                if (!($('.vis-timeline').length)) {
                    $('#cover_timeline,#loading_timeline').show();
                }
                $('#user_video').show();
                $('.controls,.table_title,#weather_input,#video_fb_table,#user_fb_table,.video_fb').show();
                $('.tooltip').tooltipster({"contentAsHTML": true});


            },
            error: function (e) {
            },
            async: true
        });
    }
    else {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/images/reports/' + json.media_id,
            dataType: 'json',
            success: function (json_inner) {

                $('.twitter_p').attr('data-url', json_inner.verification_cues.twitter_search_url);
                if (json_inner.image.caption !== "") {
                    guessLanguage.detect(json_inner.image.caption, function (language) {
                        var translate_dom = '<p class="translate_wrapper_table"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        $('#fb_image_title').html('<span>' + json_inner.image.caption + '</span>' + translate_dom);
                    });
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_image_title').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Caption</td> <td>Not Available</td> </tr>');
                }


                if (json_inner.image.updated_time !== "") {
                    $('#fb_updated_time_image').text(json_inner.image.updated_time);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_updated_time_image').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Updated Time</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.id !== "") {
                    $('#fb_image_id').text(json_inner.id);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_image_id').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.image.can_tag !== "") {
                    $('#fb_image_tag').text(json_inner.image.can_tag);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_image_tag').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Can Tag</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.image.created_time !== "") {
                    $('#fb_image_created').text(json_inner.image.created_time);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_image_created').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.image.width !== "") {
                    $('#fb_image_width').text(json_inner.image.width);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_image_width').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Width</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.image.height !== "") {
                    $('#fb_image_height').text(json_inner.image.height);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_image_height').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Height</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.image.alt_text !== "") {
                    $('#fb_image_alt').text(json_inner.image.alt_text);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_image_alt').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Alt Text</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.from !== "") {
                    $('#fb_source').text(json_inner.source.from);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#fb_source').parent().remove();
                    $('#image_fb_table_more tbody').append('<tr> <td>Source</td> <td>Not Available</td> </tr>');
                }

                for (var i = $('#thumb_info .ca-item-other').length; i < json_inner.representations.length; i++) {
                    $tiles_thumbs.append('<div class="ca-item ca-item-other" style="width:230px"><div class="ca-item-main"><p class="google">Dimension: ' + json_inner.representations[i].width + ' x ' + json_inner.representations[i].height + '</p><img src="' + json_inner.representations[i].source + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json_inner.representations[i].google_reverse_image_search + '">Google</li><li class="link" data-url="' + json_inner.representations[i].yandex_reverse_image_search + '">Yandex</li></ul></div></div>');
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

                if (json.sproc.status_location === "done" && json_location) {
                    json_location = false;
                    var locations = [];
                    if (json_inner.mentioned_locations.detected_locations.length === 0) {
                        $('#fb_image_locations').parent().remove();
                        $('#image_fb_table_more tbody').append('<tr> <td>Mentioned Locations</td> <td>Not Available</td> </tr>');
                    }
                    else {
                        for (var l = 0; l < json_inner.mentioned_locations.detected_locations.length; l++) {
                            locations.push('<a href="' + json_inner.mentioned_locations.detected_locations[l].wikipedia_url + '" target="_blank">' + json_inner.mentioned_locations.detected_locations[l].location + '</a> (' + json_inner.mentioned_locations.detected_locations[l].text_source + ')')
                        }
                        $('#fb_image_locations').append(locations.join(', '));
                    }
                }


                if (json.sproc.status_weather === "done" && json_weather) {
                    json_weather = false;
                }

                if (json_comments) {
                    for (var c = $('.verified').length; c < json_inner.verification_comments.length; c++) {
                        var src_str = json_inner.verification_comments[c].textDisplay;
                        guessLanguage.detect(src_str, function (language) {
                            var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                            if (language === "en") {
                                translate_dom = ""
                            }
                            var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                            var term;
                            var pattern;
                            for (var i = 0; i < fake_terms.length; i++) {
                                term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                                if (arabic.test(src_str)) {
                                    pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                                }
                                else if (json.sproc.status_metadata === "done") {
                                    pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                                }

                                src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                                src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                            }
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                            }
                        });
                    }
                    if (json_inner.verification_comments.length === 10) {
                        $('.more').show();
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
                $('#verified').attr('data-id', json.media_id);
                $('#all').attr('data-id', json.media_id);
                $('#extr_links').attr('data-id', json.media_id);
                if (json.sproc.status_comments === "done" && json_comments) {
                    json_comments = false;
                    $('#verified').html('VERIFICATION (' + json_inner.verification_cues.num_verification_comments + ')');
                    $('#all').html('ALL (' + json_inner.verification_cues.num_comments + ')');
                    $('#extr_links').html('LINKS (' + json_inner.verification_cues.num_link_comments + ')');
                    if (json_inner.verification_cues.num_verification_comments === 10) {
                        $('.more').hide();
                    }
                    if (json_inner.verification_cues.num_verification_comments === 0) {
                        $('#none_comments').text('No verification comments at the moment').show();
                    }

                    $('#alert_comments').remove();
                    $('.comments_search').show();
                }


                $('#loading_all,#cover,#cover_info,#loading_info').remove();
                if (!($('.vis-timeline').length)) {
                    $('#cover_timeline,#loading_timeline').show();
                }
                $('#user_video').show();
                $('.controls,.table_title,#weather_input,#image_fb_table,#user_fb_table,.image_fb').show();
                $('.tooltip').tooltipster({"contentAsHTML": true});
            },
            error: function (e) {
            },
            async: true
        });
    }


}
function load_twitter_video(json) {
    $('.twitter_p').remove();
    var $tiles_comments = $('#comments_info');
    var $tiles_thumbs = $('#thumb_info');
    $.ajax({
        type: 'GET',
        url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + json.media_id,
        dataType: 'json',
        success: function (json_inner) {
            if (json_metadata) {
                if (json_inner.video.full_text !== "") {
                    guessLanguage.detect(json_inner.video.full_text, function (language) {
                        var translate_dom = '<p class="translate_wrapper_table"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        $('#tw_tweet_text').html('<span>' + json_inner.video.full_text + '</span>' + translate_dom);
                    });
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_text').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Text</td> <td>Not Available</td> </tr>');
                }


                if (json_inner.video.created_at !== "") {
                    $('#tw_tweet_created_time').text(json_inner.video.created_at);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_created_time').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.source !== "") {
                    $('#tw_tweet_source').text(json_inner.video.source);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_source').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Source</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.retweet_count > -1) {
                    $('#tw_tweet_rt').text(json_inner.video.retweet_count);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_rt').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Retweet Count</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.favorite_count > -1) {
                    $('#tw_tweet_fav').text(json_inner.video.favorite_count);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_fav').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Favorite Count</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.lang !== "") {
                    $('#tw_tweet_lang').text(json_inner.video.lang);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_lang').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Language</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.video.embedded_youtube !== "") {
                    $('.embedded_yt').show();
                    $('.embedded_yt a').attr('href', 'index.html?video=' + json_inner.video.embedded_youtube.replace('&', '%26'));
                }

                if (json_inner.verification_cues.tweet_verification_label != null) {
                    $('#tw_tweet_verification').text(json_inner.verification_cues.tweet_verification_label);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_verification').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Verification Label</td> <td>Not Available</td> </tr>');
                }

                var hashtags = "";
                for (v = 0; v < json_inner.video.hashtags.length; v++) {
                    if (v === json_inner.video.hashtags.length - 1) {
                        hashtags += "<span>#" + json_inner.video.hashtags[v] + "</span>";
                    }
                    else {
                        hashtags += "<span>#" + json_inner.video.hashtags[v] + "</span>, ";
                    }
                }

                if (hashtags !== "") {
                    $('#tw_tweet_hashtags').html(hashtags);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_hashtags').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Hashtags</td> <td>Not Available</td> </tr>');
                }


                var urls = "";
                for (v = 0; v < json_inner.video.urls.length; v++) {
                    if (v === json_inner.video.urls.length - 1) {
                        urls += '<a target="_blank" href="' + json_inner.video.urls[v] + '">' + json_inner.video.urls[v] + '</a>';
                    }
                    else {
                        urls += '<a target="_blank" href="' + json_inner.video.urls[v] + '">' + json_inner.video.urls[v] + '</a>, ';
                    }
                }


                if (urls !== "") {
                    $('#tw_tweet_urls').html(urls);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_urls').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>URLs</td> <td>Not Available</td> </tr>');
                }


                var users_mentions = "";
                for (v = 0; v < json_inner.video.user_mentions.length; v++) {
                    if (v === json_inner.video.user_mentions.length - 1) {
                        users_mentions += "<span>@" + json_inner.video.user_mentions[v] + "</span>";
                    }
                    else {
                        users_mentions += "<span>@" + json_inner.video.user_mentions[v] + "</span>, ";
                    }
                }

                if (users_mentions !== "") {
                    $('#tw_tweet_users_mentions').html(users_mentions);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_users_mentions').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>Users Mentions</td> <td>Not Available</td> </tr>');
                }


                var video_urls = "";
                for (v = 0; v < json_inner.video.video_info.urls.length; v++) {
                    if (v === json_inner.video.video_info.urls.length - 1) {
                        video_urls += '<a target="_blank" href="' + json_inner.video.video_info.urls[v] + '">' + json_inner.video.video_info.urls[v] + '</a>';
                    }
                    else {
                        video_urls += '<a target="_blank" href="' + json_inner.video.video_info.urls[v] + '">' + json_inner.video.video_info.urls[v] + '</a>, ';
                    }
                }

                var bitrate = "";
                for (v = 0; v < json_inner.video.video_info.bitrate.length; v++) {
                    if (v === json_inner.video.video_info.bitrate.length - 1) {
                        bitrate += "<span>" + json_inner.video.video_info.bitrate[v] + "</span>";
                    }
                    else {
                        bitrate += "<span>" + json_inner.video.video_info.bitrate[v] + "</span>, ";
                    }
                }

                if (json_inner.video.embedded_youtube !== "") {
                    $('#tw_tweet_aspect').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '" target="_blank">here</a></p>');
                    $('#tw_tweet_duration').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '" target="_blank">here</a></p>');
                    $('#tw_tweet_url').removeClass('link').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '" target="_blank">here</a></p>');
                    $('#tw_tweet_bitrate').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '" target="_blank">here</a></p>');
                }
                else if (json.sproc.status_metadata === "done") {
                    if (json_inner.video.video_info.aspect_ratio !== "") {
                        $('#tw_tweet_aspect').text(json_inner.video.video_info.aspect_ratio);
                    }
                    else if (json.sproc.status_metadata === "done") {
                        $('#tw_tweet_aspect').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Video Aspect Ratio</td> <td>Not Available</td> </tr>');
                    }

                    if (json_inner.video.video_info.duration !== "") {
                        $('#tw_tweet_duration').text(json_inner.video.video_info.duration);
                    }
                    else if (json.sproc.status_metadata === "done") {
                        $('#tw_tweet_duration').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Video Duration</td> <td>Not Available</td> </tr>');
                    }

                    if (video_urls !== "") {
                        $('#tw_tweet_url').html(video_urls);
                    }
                    else if (json.sproc.status_metadata === "done") {
                        $('#tw_tweet_url').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Video URL</td> <td>Not Available</td> </tr>');
                    }

                    if (bitrate !== "") {
                        $('#tw_tweet_bitrate').html(bitrate);
                    }
                    else if (json.sproc.status_metadata === "done") {
                        $('#tw_tweet_bitrate').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Video Bitrate</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json_inner.id !== "") {
                    $('#tw_tweet_id').text(json_inner.id);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_tweet_id').parent().remove();
                    $('#tweet_tw_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_name !== "") {
                    $('#tw_user_username').text(json_inner.source.user_name);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_username').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Username</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_screen_name !== "") {
                    $('#tw_user_screenname').html('<a target="_blank" href="https://pipl.com/search/?q=' + json_inner.source.user_screen_name + '&l=&sloc=&in=6">' + json_inner.source.user_screen_name + '</a>');
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_screenname').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Screen Name</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_location !== "") {
                    $('#tw_user_location').text(json_inner.source.user_location);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_location').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Location</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_description !== "") {
                    $('#tw_user_desc').text(json_inner.source.user_description);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_desc').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Description</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_protected !== "") {
                    $('#tw_user_protected').text(json_inner.source.user_protected);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_protected').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Protected</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_verified !== "") {
                    $('#tw_user_verified').text(json_inner.source.user_verified);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_verified').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Verified</td> <td>Not Available</td> </tr>');
                }


                if (json_inner.source.user_followers_count !== "") {
                    $('#tw_user_followers').text(json_inner.source.user_followers_count);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_followers').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Followers</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_friends_count !== "") {
                    $('#tw_user_friends').text(json_inner.source.user_friends_count);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_friends').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Firends</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_listed_count !== "") {
                    $('#tw_user_listed').text(json_inner.source.user_listed_count);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_listed').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Listed</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_favourites_count !== "") {
                    $('#tw_user_favourites').text(json_inner.source.user_favourites_count);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_favourites').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Favorites</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_statuses_count !== "") {
                    $('#tw_user_statuses').text(json_inner.source.user_statuses_count);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_statuses').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Statuses</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_created_at !== "") {
                    $('#tw_user_created').text(json_inner.source.user_created_at);
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_created').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                }


                if (json_inner.source.user_screen_name !== "") {
                    $('#tw_user_profile_img').html('<img id="imgtab2" class="small" src="https://avatars.io/twitter/' + json_inner.source.user_screen_name + '">');
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_profile_img').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>Profile Image</td> <td>Not Available</td> </tr>');
                }

                if (json_inner.source.user_url !== "") {
                    $('#tw_user_url').html('<a href="' + json_inner.source.user_url + '" target="_blank">' + json_inner.source.user_url + '</a>');
                }
                else if (json.sproc.status_metadata === "done") {
                    $('#tw_user_url').parent().remove();
                    $('#user_tw_table_more tbody').append('<tr> <td>URL</td> <td>Not Available</td> </tr>');
                }

                if ($('.preferred').length === 0 && json_inner.thumbnails.preferred.url != "") {
                    if (json_inner.thumbnails.preferred.in_video) {
                        $('#alert_clickbait').slideDown();
                        $tiles_thumbs.append('<div class="ca-item" style="width:230px;border: 5px solid red;"><div class="ca-item-main"><img src="' + json_inner.thumbnails.preferred.url + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json_inner.thumbnails.preferred.google_reverse_image_search + '">Google</li><li class="link" data-url="' + json_inner.thumbnails.preferred.yandex_reverse_image_search + '">Yandex</li></ul></div></div>');
                    }
                    else {
                        $tiles_thumbs.append('<div class="ca-item" style="width:230px;"><div class="ca-item-main"><img src="' + json_inner.thumbnails.preferred.url + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json_inner.thumbnails.preferred.google_reverse_image_search + '">Google</li><li class="link" data-url="' + json_inner.thumbnails.preferred.yandex_reverse_image_search + '">Yandex</li></ul></div></div>');
                    }
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

            }
            if (json.sproc.status_metadata === "done" && json_metadata) {
                json_metadata = false;
            }


            if (json_comments) {
                for (var c = $('.verified').length; c < json_inner.verification_comments.length; c++) {
                    var src_str = json_inner.verification_comments[c].textDisplay;
                    guessLanguage.detect(src_str, function (language) {
                        var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                        var term;
                        var pattern;
                        for (var i = 0; i < fake_terms.length; i++) {
                            term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                            if (arabic.test(src_str)) {
                                pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                            }
                            else {
                                pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                            }

                            src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                            src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                        }
                        if (arabic.test(src_str)) {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.verification_comments[c].authorURL + '" target="_blank">' + json_inner.verification_comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                        }
                        else {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.verification_comments[c].authorURL + '" target="_blank">' + json_inner.verification_comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.verification_comments[c].publishedAt + '</p></div></div>');
                        }
                    });
                }

                if (json_inner.verification_comments.length === 10) {
                    $('.more').show();
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
            $('#verified').attr('data-id', json.media_id);
            $('#all').attr('data-id', json.media_id);
            $('#extr_links').attr('data-id', json.media_id);
            if (json.sproc.status_comments === "done" && json_comments) {
                json_comments = false;
                $('#verified').html('VERIFICATION (' + json_inner.verification_cues.num_verification_comments + ')');
                $('#all').html('ALL (' + json_inner.verification_cues.num_comments + ')');
                $('#extr_links').html('LINKS (' + json_inner.verification_cues.num_link_comments + ')');
                if (json_inner.verification_cues.num_verification_comments === 10) {
                    $('.more').hide();
                }
                if (json_inner.verification_cues.num_verification_comments === 0) {
                    $('#none_comments').text('No verification comments at the moment').show();
                }
                $('#alert_comments').remove();
                $('.comments_search').show();
            }


            /* if (json.sproc.status_debunk === "done" && json_debunk) {
             json_debunk = false;
             $('.debunked').show();
             if (json_inner.verification_cues.known_history.explanation !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.explanation + '</p>');
             }
             if (json_inner.verification_cues.known_history.known_facts !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.known_facts + '</p>');
             }
             if (json_inner.verification_cues.known_history.fact_source !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.fact_source + '</p>');
             }
             if (json_inner.verification_cues.known_history.label !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.label + '</p>');
             }
             if (json_inner.verification_cues.known_history.first_known_instance !== "") {
             $('.debunked').append('<p>' + json_inner.verification_cues.known_history.first_known_instance + '</p>');

             }
             $('.debunked').append('<p>Is visual clickbait: ' + json_inner.verification_cues.is_visual_clickbait + '</p>');
             }*/


            if (json.sproc.status_location === "done" && json_location) {
                json_location = false;
                var locations = [];
                if (json_inner.mentioned_locations.detected_locations.length === 0) {
                    $('#tw_tweet_mentioned_locations').parent().remove();
                    $('#tweet_tw_table tbody').append('<tr> <td>Mentioned Locations</td> <td>Not Available</td> </tr>');
                }
                else {

                    for (var l = 0; l < json_inner.mentioned_locations.detected_locations.length; l++) {
                        locations.push('<a href="' + json_inner.mentioned_locations.detected_locations[l].wikipedia_url + '" target="_blank">' + json_inner.mentioned_locations.detected_locations[l].location + '</a> (' + json_inner.mentioned_locations.detected_locations[l].text_source + ')')
                    }
                    $('#tw_tweet_mentioned_locations').append(locations.join(', '));
                }
            }


            if (json.sproc.status_ai_verification === "done" && json_ai) {
                json_ai = false;
                $('.debunked').show();
                $('.debunked').append('<p> Verification ai score: ' + json_inner.verification_cues.verification_ai_score + '</p>');
            }


            if (json.sproc.status_weather === "done" && json_weather) {
                json_weather = false;
            }

            $('#loading_all,#cover,#cover_info,#loading_info').remove();
            if (!($('.vis-timeline').length)) {
                $('#cover_timeline,#loading_timeline').show();
            }
            $('#user_video').show();
            $('.controls,.table_title,#weather_input,#tweet_tw_table,#user_tw_table,.video_tw,.user_tw').show();
            $('.tooltip').tooltipster({"contentAsHTML": true});

        },
        error: function (e) {
        },
        async: true
    });

}

$('.filter').click(function () {
    var $this = $(this);
    if (!($this.hasClass(('active')))) {
        $('.controls').find('.filter').removeClass('active');
        $this.addClass('active');
        $('#comments_info').empty();
        $('.more').hide();
        var type = "";
        var color = "";
        var none_comments = "";
        switch ($this.attr('id')) {
            case 'all':
                type = "coms";
                color = "#95B8D1";
                none_comments = "No comments at the moment"
                break;
            case 'extr_links':
                type = "linkcoms";
                color = "#9593D9";
                none_comments = "No link comments at the moment"
                break;
            case 'verified' :
                type = "vercoms";
                color = "#8AA399";
                none_comments = "No verification comments at the moment"
                break;
        }
        if (($('.table_title').eq(0).text() === "IMAGE")) {
            $.ajax({
                type: 'GET',
                url: 'https://caa.iti.gr/caa/api/v4/images/reports/' + $this.attr('data-id') + '/comments?ncomments=10&page=1&type=' + type,
                dataType: 'json',
                success: function (json_inner) {
                    var $tiles_comments = $('#comments_info');
                    $('#none_comments').hide();
                    for (var c = 0; c < json_inner.comments.length; c++) {
                        var src_str = json_inner.comments[c].textDisplay;
                        guessLanguage.detect(src_str, function (language) {
                            var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                            if (language === "en") {
                                translate_dom = ""
                            }
                            if (type === "vercoms") {
                                var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                                var term;
                                var pattern;
                                for (var i = 0; i < fake_terms.length; i++) {
                                    term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                                    if (arabic.test(src_str)) {
                                        pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                                    }
                                    else {
                                        pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                                    }

                                    src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                                    src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                                }
                            }
                            if (type === "linkcoms") {
                                src_str = linkify(src_str);
                            }

                            if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {
                                if (arabic.test(src_str)) {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                                else {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                            }
                            else {
                                if (arabic.test(src_str)) {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                                else {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                            }

                        });
                    }
                    if (json_inner.comments.length === 0) {
                        $('#none_comments').text(none_comments).show();
                        $('#comments_info').css('height', 0);
                    }
                    if (json_inner.pagination.total_comments > 10) {
                        $('.more').show();
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
                },
                error: function (e) {
                },
                async: true
            });
        }
        else {
            $.ajax({
                type: 'GET',
                url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + $this.attr('data-id') + '/comments?ncomments=10&page=1&type=' + type,
                dataType: 'json',
                success: function (json_inner) {
                    var $tiles_comments = $('#comments_info');
                    $('#none_comments').hide();
                    for (var c = 0; c < json_inner.comments.length; c++) {
                        var src_str = json_inner.comments[c].textDisplay;
                        guessLanguage.detect(src_str, function (language) {
                            var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                            if (language === "en") {
                                translate_dom = ""
                            }
                            if (type === "vercoms") {
                                var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                                var term;
                                var pattern;
                                for (var i = 0; i < fake_terms.length; i++) {
                                    term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                                    if (arabic.test(src_str)) {
                                        pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                                    }
                                    else {
                                        pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                                    }

                                    src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                                    src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                                }
                            }
                            if (type === "linkcoms") {
                                src_str = linkify(src_str);
                            }

                            if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {
                                if (arabic.test(src_str)) {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                                else {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                            }
                            else {
                                if (arabic.test(src_str)) {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                                else {
                                    $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                                }
                            }

                        });
                    }
                    if (json_inner.comments.length === 0) {
                        $('#none_comments').text(none_comments).show();
                        $('#comments_info').css('height', 0);
                    }
                    if (json_inner.pagination.total_comments > 10) {
                        $('.more').show();
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
                },
                error: function (e) {
                },
                async: true
            });
        }

    }
});
$('.more').click(function () {
    var type = "";
    var color = ""
    switch ($('.filter.active').attr('id')) {
        case 'all':
            type = "coms";
            color = "#95B8D1";
            break;
        case 'extr_links':
            type = "linkcoms";
            color = "#9593D9";
            break;
        case 'verified' :
            type = "vercoms";
            color = "#8AA399";
            break;
    }
    var page = $('#comments_info .ca-item').length / 10 + 1;

    if (($('.table_title').eq(0).text() === "IMAGE")) {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/images/reports/' + $('.filter.active').attr('data-id') + '/comments?ncomments=10&page=' + page + '&type=' + type,
            dataType: 'json',
            success: function (json_inner) {
                var $tiles_comments = $('#comments_info');
                for (var c = 0; c < json_inner.comments.length; c++) {
                    var src_str = json_inner.comments[c].textDisplay;
                    guessLanguage.detect(src_str, function (language) {
                        var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        if (type === "vercoms") {
                            var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                            var term;
                            var pattern;
                            for (var i = 0; i < fake_terms.length; i++) {
                                term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                                if (arabic.test(src_str)) {
                                    pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                                }
                                else {
                                    pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                                }

                                src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                                src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                            }
                        }
                        if (type === "linkcoms") {
                            src_str = linkify(src_str);
                        }

                        if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }
                        else {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }

                    });
                }
                if (json_inner.pagination.total_comments > page * 10) {
                    $('.more').show();
                }
                else {
                    $('.more').hide();
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
            },
            error: function (e) {
            },
            async: true
        });
    }
    else {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + $('.filter.active').attr('data-id') + '/comments?ncomments=10&page=' + page + '&type=' + type,
            dataType: 'json',
            success: function (json_inner) {
                var $tiles_comments = $('#comments_info');
                for (var c = 0; c < json_inner.comments.length; c++) {
                    var src_str = json_inner.comments[c].textDisplay;
                    guessLanguage.detect(src_str, function (language) {
                        var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }
                        if (type === "vercoms") {
                            var fake_terms = " fake , lies , fake , wrong , lie , confirm , where , location , lying , false , incorrect , misleading , propaganda , liar , mensonges , faux , errone , mensonge , confirme , lieu , mentir , faux , inexact , trompeur , propagande , menteur , mentiras , falso , incorrecto , mentira , confirmado , donde , lugar , mitiendo , falso , incorrecto , enganoso , propaganda , mentiroso , l?gen , falsch , l?ge , best?tigt , wo , ort , l?gend , fehlerhaft , unrichtig , irref?hrend , l?gner , \u03C8\u03AD\u03BC\u03B1\u03C4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B9\u03BA\u03BF , \u03BB\u03AC\u03B8\u03BF\u03C2 , \u03C8\u03AD\u03BC\u03B1 , \u03B5\u03C0\u03B9\u03B2\u03B5\u03B2\u03B1\u03B9\u03CE\u03BD\u03C9 , \u03C0\u03BF\u03C5 , \u03C4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 , \u03C8\u03B5\u03C5\u03B4\u03AE\u03C2 , \u03B5\u03C3\u03C6\u03B1\u03BB\u03BC\u03AD\u03BD\u03BF , \u03BB\u03B1\u03BD\u03B8\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF , \u03C0\u03B1\u03C1\u03B1\u03C0\u03BB\u03B1\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC , \u03C0\u03C1\u03BF\u03C0\u03B1\u03B3\u03AC\u03BD\u03B4\u03B1 , \u03C8\u03B5\u03CD\u03C4\u03B7\u03C2 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u0623\u0643\u0627\u0630\u064A\u0628 , \u063A\u0644\u0637\u0627\u0646 , \u0623\u0643\u0630\u0648\u0628\u0629\u060C \u0643\u0630\u0628 , \u0645\u0624\u0643\u062F , \u0623\u064A\u0646 , \u0645\u0643\u0627\u0646 , \u0643\u0630\u0628 , \u062E\u0627\u0637\u0626 , \u063A\u064A\u0631 \u0635\u062D\u064A\u062D , \u0645\u0636\u0644\u0644 , \u062F\u0639\u0627\u064A\u0629 , \u0643\u0627\u0630\u0628 , \u062F\u0631\u0648\u063A , \u062C\u0639\u0644\u06CC , \u0627\u0634\u062A\u0628\u0627\u0647 , \u062F\u0631\u0648\u063A , \u062A\u0623\u064A\u064A\u062F \u0634\u062F\u0647 , \u0643\u062C\u0627 , \u0645\u062D\u0644\u060C \u0645\u0643\u0627\u0646 , \u062F\u0631\u0648\u063A \u06AF\u0648 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647\u060C \u062F\u0631\u0648\u063A\u06CC\u0646 , \u063A\u0644\u0637\u060C \u0627\u0634\u062A\u0628\u0627\u0647 , \u06AF\u0645\u0631\u0627\u0647 \u200C \u0643\u0646\u0646\u062F\u0647 , \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0633\u06CC\u0627\u0633\u06CC\u060C \u067E\u0631\u0648\u067E\u0627\u06AF\u0627\u0646\u062F\u0627 , \u06A9\u0630\u0627\u0628".split(',');
                            var term;
                            var pattern;
                            for (var i = 0; i < fake_terms.length; i++) {
                                term = fake_terms[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                                if (arabic.test(src_str)) {
                                    pattern = new RegExp("(" + fake_terms[i].trim() + ")", "gi");
                                }
                                else {
                                    pattern = new RegExp("(\\b" + fake_terms[i].trim() + "\\b)", "gi");
                                }

                                src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                                src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                            }
                        }
                        if (type === "linkcoms") {
                            src_str = linkify(src_str);
                        }

                        if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }
                        else {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: ' + color + '"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }

                    });
                }
                if (json_inner.pagination.total_comments > page * 10) {
                    $('.more').show();
                }
                else {
                    $('.more').hide();
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
            },
            error: function (e) {
            },
            async: true
        });
    }

});


var weather_json;
function get_weather() {
    if (!($('#weather_btn').hasClass("disable_btn"))) {
        $('.active_weather').removeClass('active_weather');
        $('.weather_empty').removeClass('weather_empty');
        $('#weather_error').stop().slideUp();
        var $weather_table = $('#weather_table');
        var $weather_icon = $('#weather_icon');
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
        if ($weather_table.is(":visible")) {
            $weather_table.addClass('weather_blur');
        }
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/weatherV3?time=' + time + '&location=' + $('#location_input').val(),
            dataType: 'json',
            success: function (json) {
                weather_json = json;
                if (json.hasOwnProperty("message")) {
                    $('#weather_error').html(json.message).stop().slideDown();
                    $weather_table.hide().removeClass('weather_blur');
                }
                else {
                    for (var i = 0; i < 22; i += 3) {
                        if (json['hourly' + zeroPad(i, 2)].data_exist) {
                            $('#hourly' + zeroPad(i, 2) + '_img').attr('src', 'imgs/').attr('src', 'imgs/' + json['hourly' + zeroPad(i, 2)].icon.toLowerCase() + '_64.png');
                            $('#hourly' + zeroPad(i, 2) + '_temp').html(json['hourly' + zeroPad(i, 2)].temperature + '&deg;');
                        }
                        else {
                            $('#hourly' + zeroPad(i, 2) + '_img').attr('src', 'imgs/').attr('src', 'imgs/weather_empty_64.png');
                            $('#hourly' + zeroPad(i, 2) + '_temp').html('-').parent().addClass('weather_empty');
                        }
                    }

                    var summary, visibility, icon, cloud_cover, wind_speed, day_indication;
                    var hour = parseInt($('#time_input').val().split(':')[0], 10);
                    hour = Math.round(hour / 3.0) * 3;
                    if (hour > 21) {
                        hour = 21;
                    }
                    if (checked) {
                        if (!(json['hourly' + zeroPad(hour, 2)].data_exist)) {
                            $('#weather_error').html("No Weather Data for this Location/Timestamp").stop().slideDown();
                            $weather_table.hide().removeClass('weather_blur');
                        }
                        else {
                            $('#daily_button').addClass('deactivate_daily');
                            $('.weather_box_time').text((hour < 10 ? '0' + hour : '' + hour) + ":00");
                            $('#forecast ul li').eq((hour / 3)).addClass('active_weather');
                            $('.tooltip').eq(10).tooltipster('content', 'Wind speed is caused by air moving from high pressure to low pressure, usually due to changes in temperature. <span style="font-weight: bold;margin: 5px 0;display: block">Beaufort: ' + json['hourly' + zeroPad(hour, 2)].beaufort + '</span> <a href="https://en.wikipedia.org/wiki/Beaufort_scale" target="_blank">More</a>');
                            summary = json['hourly' + zeroPad(hour, 2)].summary;
                            if (summary === "") {
                                summary = "-";
                            }
                            $weather_table.find('.summary').text(summary);
                            $weather_table.find('.location').text(json.address);
                            $weather_table.find('.time').text(new Date(dateObject).toUTCString().split(' ').slice(0, 4).join(' '));
                            $weather_table.find('.temperature').text(json['hourly' + zeroPad(hour, 2)].temperature);

                            visibility = json['hourly' + zeroPad(hour, 2)].visibility;
                            if (visibility === "") {
                                visibility = "-";
                            }
                            $('#visibility').text(visibility);

                            cloud_cover = json['hourly' + zeroPad(hour, 2)].cloud_cover;
                            if (cloud_cover === "") {
                                cloud_cover = "-";
                            }
                            $('#cloud').text(cloud_cover);

                            wind_speed = json['hourly' + zeroPad(hour, 2)].wind_speed;
                            if (wind_speed === "") {
                                wind_speed = "-";
                            }
                            $('#wind').text(wind_speed);

                            icon = json['hourly' + zeroPad(hour, 2)].icon;
                            $weather_icon.attr('src', 'imgs/' + icon.toLowerCase() + '_64.png');
                            day_indication = json['hourly' + zeroPad(hour, 2)].day_night_indication;
                            switch (icon) {
                                case "CLEAR_DAY":
                                    $weather_table.find('.status').text("Clear Day");
                                    break;
                                case "CLEAR_NIGHT":
                                    $weather_table.find('.status').text("Clear Night");
                                    break;
                                case "RAIN":
                                    $weather_table.find('.status').text("Rain " + capitalizeFirstLetter(day_indication));
                                    break;
                                case "SNOW":
                                    $weather_table.find('.status').text("Snow " + capitalizeFirstLetter(day_indication));
                                    break;
                                case "SLEET":
                                    $weather_table.find('.status').text("Sleet " + capitalizeFirstLetter(day_indication));
                                    break;
                                case "WIND":
                                    $weather_table.find('.status').text("Wind " + capitalizeFirstLetter(day_indication));
                                    break;
                                case "FOG":
                                    $weather_table.find('.status').text("Fog " + capitalizeFirstLetter(day_indication));
                                    break;
                                case "CLOUDY":
                                    $weather_table.find('.status').text("Cloudy " + capitalizeFirstLetter(day_indication));
                                    break;
                                case "PARTLY_CLOUDY_DAY":
                                    $weather_table.find('.status').text("Partly Cloudy Day");
                                    break;
                                case "PARTLY_CLOUDY_NIGHT":
                                    $weather_table.find('.status').text("Partly Cloudy Night");
                                    break;
                            }
                            $weather_table.show().removeClass('weather_blur');
                        }
                    }
                    else {
                        if (!(json.daily.data_exist)) {
                            $('#weather_error').html("No Weather Data for this Location/Timestamp").stop().slideDown();
                            $weather_table.hide().removeClass('weather_blur');
                        }
                        else {
                            $('#daily_button').removeClass('deactivate_daily');
                            $('.tooltip').eq(10).tooltipster('content', 'Wind speed is caused by air moving from high pressure to low pressure, usually due to changes in temperature. <span style="font-weight: bold;margin: 5px 0;display: block">Beaufort: ' + json.daily.beaufort + '</span> <a href="https://en.wikipedia.org/wiki/Beaufort_scale" target="_blank">More</a>');
                            summary = json.daily.summary;
                            if (summary === "") {
                                summary = "-";
                            }
                            $weather_table.find('.summary').text(summary);
                            $weather_table.find('.location').text(json.address);
                            $weather_table.find('.time').text(new Date(dateObject).toUTCString().split(' ').slice(0, 4).join(' '));
                            $weather_table.find('.temperature').text(json.daily.max_temperature + '...' + json.daily.min_temperature);

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

                            icon = json.daily.icon;
                            $weather_icon.attr('src', 'imgs/' + icon.toLowerCase() + '_64.png');
                            switch (icon) {
                                case "CLEAR_DAY":
                                    $weather_table.find('.status').text("Clear Day");
                                    break;
                                case "CLEAR_NIGHT":
                                    $weather_table.find('.status').text("Clear Night");
                                    break;
                                case "RAIN":
                                    $weather_table.find('.status').text("Rain");
                                    break;
                                case "SNOW":
                                    $weather_table.find('.status').text("Snow");
                                    break;
                                case "SLEET":
                                    $weather_table.find('.status').text("Sleet");
                                    break;
                                case "WIND":
                                    $weather_table.find('.status').text("Wind");
                                    break;
                                case "FOG":
                                    $weather_table.find('.status').text("Fog");
                                    break;
                                case "CLOUDY":
                                    $weather_table.find('.status').text("Cloudy");
                                    break;
                                case "PARTLY_CLOUDY_DAY":
                                    $weather_table.find('.status').text("Partly Cloudy Day");
                                    break;
                                case "PARTLY_CLOUDY_NIGHT":
                                    $weather_table.find('.status').text("Partly Cloudy Night");
                                    break;
                            }
                            $weather_table.show().removeClass('weather_blur');
                        }
                    }
                }
                $('#loading_weather').hide();
            },
            async: true
        });
    }
}

$('#forecast ul li').click(function () {
    $('#daily_button').addClass('deactivate_daily');
    $('.active_weather').removeClass('active_weather');
    $(this).addClass('active_weather');
    $('.weather_box_time').text($(this).attr('data-index') + ":00");
    var summary, visibility, icon, cloud_cover, wind_speed, day_indication;
    var $weather_table = $('#weather_table');
    var $weather_icon = $('#weather_icon');
    var pos = $(this).attr('data-index');

    $('.tooltip').eq(10).tooltipster('content', 'Wind speed is caused by air moving from high pressure to low pressure, usually due to changes in temperature. <span style="font-weight: bold;margin: 5px 0;display: block">Beaufort: ' + weather_json['hourly' + pos].beaufort + '</span> <a href="https://en.wikipedia.org/wiki/Beaufort_scale" target="_blank">More</a>');
    summary = weather_json['hourly' + pos].summary;
    if (summary === "") {
        summary = "-";
    }
    $weather_table.find('.summary').text(summary);
    $weather_table.find('.temperature').text(weather_json['hourly' + pos].temperature);

    visibility = weather_json['hourly' + pos].visibility;
    if (visibility === "") {
        visibility = "-";
    }
    $('#visibility').text(visibility);

    cloud_cover = weather_json['hourly' + pos].cloud_cover;
    if (cloud_cover === "") {
        cloud_cover = "-";
    }
    $('#cloud').text(cloud_cover);

    wind_speed = weather_json['hourly' + pos].wind_speed;
    if (wind_speed === "") {
        wind_speed = "-";
    }
    $('#wind').text(wind_speed);

    icon = weather_json['hourly' + pos].icon;
    $weather_icon.attr('src', 'imgs/' + icon.toLowerCase() + '_64.png');
    day_indication = weather_json['hourly' + pos].day_night_indication;
    switch (icon) {
        case "CLEAR_DAY":
            $weather_table.find('.status').text("Clear Day");
            break;
        case "CLEAR_NIGHT":
            $weather_table.find('.status').text("Clear Night");
            break;
        case "RAIN":
            $weather_table.find('.status').text("Rain " + capitalizeFirstLetter(day_indication));
            break;
        case "SNOW":
            $weather_table.find('.status').text("Snow " + capitalizeFirstLetter(day_indication));
            break;
        case "SLEET":
            $weather_table.find('.status').text("Sleet " + capitalizeFirstLetter(day_indication));
            break;
        case "WIND":
            $weather_table.find('.status').text("Wind " + capitalizeFirstLetter(day_indication));
            break;
        case "FOG":
            $weather_table.find('.status').text("Fog " + capitalizeFirstLetter(day_indication));
            break;
        case "CLOUDY":
            $weather_table.find('.status').text("Cloudy " + capitalizeFirstLetter(day_indication));
            break;
        case "PARTLY_CLOUDY_DAY":
            $weather_table.find('.status').text("Partly Cloudy Day");
            break;
        case "PARTLY_CLOUDY_NIGHT":
            $weather_table.find('.status').text("Partly Cloudy Night");
            break;
    }

});

$('#daily_button').click(function () {
    var summary, visibility, icon, cloud_cover, wind_speed;
    $('.active_weather').removeClass('active_weather');
    $(this).removeClass('deactivate_daily');
    $('.weather_box_time').text("Daily");
    var $weather_table = $('#weather_table');
    var $weather_icon = $('#weather_icon');

    $('.tooltip').eq(10).tooltipster('content', 'Wind speed is caused by air moving from high pressure to low pressure, usually due to changes in temperature. <span style="font-weight: bold;margin: 5px 0;display: block">Beaufort: ' + weather_json.daily.beaufort + '</span> <a href="https://en.wikipedia.org/wiki/Beaufort_scale" target="_blank">More</a>');
    summary = weather_json.daily.summary;
    if (summary === "") {
        summary = "-";
    }
    $weather_table.find('.summary').text(summary);
    $weather_table.find('.temperature').text(weather_json.daily.max_temperature + '...' + weather_json.daily.min_temperature);

    visibility = weather_json.daily.visibility;
    if (visibility === "") {
        visibility = "-";
    }
    $('#visibility').text(visibility);

    cloud_cover = weather_json.daily.cloud_cover;
    if (cloud_cover === "") {
        cloud_cover = "-";
    }
    $('#cloud').text(cloud_cover);

    wind_speed = weather_json.daily.wind_speed;
    if (wind_speed === "") {
        wind_speed = "-";
    }
    $('#wind').text(wind_speed);

    icon = weather_json.daily.icon;
    $weather_icon.attr('src', 'imgs/' + icon.toLowerCase() + '_64.png');
    switch (icon) {
        case "CLEAR_DAY":
            $weather_table.find('.status').text("Clear Day");
            break;
        case "CLEAR_NIGHT":
            $weather_table.find('.status').text("Clear Night");
            break;
        case "RAIN":
            $weather_table.find('.status').text("Rain");
            break;
        case "SNOW":
            $weather_table.find('.status').text("Snow");
            break;
        case "SLEET":
            $weather_table.find('.status').text("Sleet");
            break;
        case "WIND":
            $weather_table.find('.status').text("Wind");
            break;
        case "FOG":
            $weather_table.find('.status').text("Fog");
            break;
        case "CLOUDY":
            $weather_table.find('.status').text("Cloudy");
            break;
        case "PARTLY_CLOUDY_DAY":
            $weather_table.find('.status').text("Partly Cloudy Day");
            break;
        case "PARTLY_CLOUDY_NIGHT":
            $weather_table.find('.status').text("Partly Cloudy Night");
            break;
    }
    $weather_table.show().removeClass('weather_blur');
});
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
function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}
$('.close_alert').click(function () {
    var $this = $(this);
    $(this).parent().slideUp(500, function () {
        $(this).remove();
    });
});


$('#links_wrapper p').click(function () {
    $('html, body').animate({
        scrollTop: $(".title_example").eq($(this).index()).offset().top - 10
    }, 500);
});

$("#comments_table_wrapper").on("click", ".search_remove", function () {
    var $this = $(this);
    $this.parent().remove();
    if ($this.hasClass('remove_or')) {
        $("input[name='or']").each(function (idx, elem) {
            $(this).attr('id', 'or_' + (idx + 1));
            $(this).siblings('label').attr('for', 'or_' + (idx + 1)).text(idx + 1)
        });
    }
    else {
        $("input[name='and']").each(function (idx, elem) {
            $(this).attr('id', 'and_' + (idx + 1));
            $(this).siblings('label').attr('for', 'and_' + (idx + 1)).text(idx + 1)
        });
    }

});
$("#comments_table_wrapper").on("click", ".search_add", function () {
    var $this = $(this);
    if ($this.hasClass('add_or')) {
        if ($("input[name='or']").length > 0) {
            var order = ($('.keyword_wrapper_or').last().find('label').attr('for').split('_')[1]);
            order++;
            $('<div class="keyword_wrapper keyword_wrapper_or"> <label for="or_' + order + '">' + order + '</label> <input id="or_' + order + '" type="text" value="" name="or"> <p class="search_remove remove_or">Remove<img src="imgs/close_cross.png"></p> </div>').insertBefore($this)
        }
        else {
            $('<div class="keyword_wrapper keyword_wrapper_or"> <label for="or_1">1</label> <input id="or_1" type="text" value="" name="or"> <p class="search_remove remove_or">Remove<img src="imgs/close_cross.png"></p> </div>').insertBefore($this)
        }
    }
    else {
        if ($("input[name='and']").length > 0) {
            var order = ($('.keyword_wrapper_and').last().find('label').attr('for').split('_')[1]);
            order++;
            $('<div class="keyword_wrapper keyword_wrapper_and"> <label for="and_' + order + '">' + order + '</label> <input id="and_' + order + '" type="text" value="" name="and"> <p class="search_remove remove_and">Remove<img src="imgs/close_cross.png"></p> </div>').insertBefore($this)
        }
        else {
            $('<div class="keyword_wrapper keyword_wrapper_and"> <label for="and_1">1</label> <input id="and_1" type="text" value="" name="and"> <p class="search_remove remove_and">Remove<img src="imgs/close_cross.png"></p> </div>').insertBefore($this)
        }
    }
});
$('#comments_calculate').click(function () {

    var expr_or = "";
    $("input[name='or']").each(function (idx, elem) {
        if ($(this).val() != "") {
            expr_or += $(this).val() + '<span class="logical">OR</span>';
        }
    });
    var expr_and = "";
    $("input[name='and']").each(function (idx, elem) {
        if ($(this).val() != "") {
            expr_and += $(this).val() + '<span class="logical">AND</span>';
        }
    });
    expr_or = expr_or.slice(0, -31);
    expr_and = expr_and.slice(0, -32);

    var final_expr = "";
    if (expr_or === "") {
        final_expr = expr_and
    }
    else {
        if (expr_and === "") {
            final_expr = expr_or
        }
        else {
            final_expr = expr_or + '<span class="logical">OR</span>(' + expr_and + ')';
        }
    }
    if (final_expr === "") {
        final_expr = "Select one or more keywords";
    }
    $(this).text('Update the expression');
    $('#comments_output').slideDown().html(final_expr);
})
$('.comments_title img').click(function () {
    $('#comments_table').slideUp(800);
});
$('.comments_search').click(function () {
    $('#zero_comments').hide();
    $('#comments_table').slideDown(800);
});
$('#cancel_but').click(function () {
    $('#comments_table').slideUp(800);
});
var keywordor = [];
var keywordand = [];
$('#search_but').click(function () {
    keywordand = [];
    keywordor = [];
    $('#comments_table').slideUp(800, function () {
    });

    var expr_or = "";
    $("input[name='or']").each(function (idx, elem) {
        if ($(this).val() != "") {
            expr_or += $(this).val() + '<span class="logical">OR</span>';
        }
    });
    var expr_and = "";
    $("input[name='and']").each(function (idx, elem) {
        if ($(this).val() != "") {
            expr_and += $(this).val() + '<span class="logical">AND</span>';
        }
    });
    expr_or = expr_or.slice(0, -31);
    expr_and = expr_and.slice(0, -32);

    var final_expr = "";
    if (expr_or === "") {
        final_expr = expr_and
    }
    else {
        if (expr_and === "") {
            final_expr = expr_or
        }
        else {
            final_expr = expr_or + '<span class="logical">OR</span>(' + expr_and + ')';
        }
    }
    if (final_expr === "") {
        final_expr = "*";
    }

    $('.output_expr').html("<span style='font-weight: bold'>Expression: </span>" + final_expr + "<p class='clear_search'>Clear search<img src='imgs/close_cross.png'></p>").slideDown(800);


    $("input[name='or']").each(function () {
        if ($(this).val() != "") {
            keywordor.push($(this).val());
        }
    });
    $("input[name='and']").each(function () {
        if ($(this).val() != "") {
            keywordand.push($(this).val());
        }
    });

    $('#comments_info').empty().height(0);
    $('.more,.controls,.more_search,#none_comments').hide();
    comments_search_all(keywordand.join(','), keywordor.join(','))
});

function comments_search_all(keywordand, keywordor) {
    if (($('.table_title').eq(0).text() === "IMAGE")) {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/images/reports/' + $('#all').attr('data-id') + '/freetextcomments?keywordsor=' + keywordor + '&keywordsand=' + keywordand + "&ncomments=10&page=1",
            dataType: 'json',
            success: function (json_inner) {
                var $tiles_comments = $('#comments_info');
                for (var c = 0; c < json_inner.comments.length; c++) {
                    var src_str = json_inner.comments[c].textDisplay;
                    guessLanguage.detect(src_str, function (language) {
                        var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }

                        if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }
                        else {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }

                    });
                }
                if (json_inner.comments.length === 0) {
                    $('#none_comments').text("No comments matching criteria").show();
                    $('#comments_info').css('height', 0);
                }
                if (json_inner.pagination.total_comments > 10) {
                    $('.more_search').attr('data-url', json_inner.pagination.next).show();
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
            },
            error: function (e) {
            },
            async: true
        });
    }
    else {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + $('#all').attr('data-id') + '/freetextcomments?keywordsor=' + keywordor + '&keywordsand=' + keywordand + "&ncomments=10&page=1",
            dataType: 'json',
            success: function (json_inner) {
                var $tiles_comments = $('#comments_info');
                for (var c = 0; c < json_inner.comments.length; c++) {
                    var src_str = json_inner.comments[c].textDisplay;
                    guessLanguage.detect(src_str, function (language) {
                        var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                        if (language === "en") {
                            translate_dom = ""
                        }

                        if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }
                        else {
                            if (arabic.test(src_str)) {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                            else {
                                $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                            }
                        }

                    });
                }
                if (json_inner.comments.length === 0) {
                    $('#none_comments').text("No comments matching criteria").show();
                    $('#comments_info').css('height', 0);
                }
                if (json_inner.pagination.total_comments > 10) {
                    $('.more_search').attr('data-url', json_inner.pagination.next).show();
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
            },
            error: function (e) {
            },
            async: true
        });
    }

}
$('.more_search').click(function () {
    $.ajax({
        type: 'GET',
        url: 'https://caa.iti.gr' + $(this).attr('data-url'),
        dataType: 'json',
        success: function (json_inner) {
            var $tiles_comments = $('#comments_info');
            for (var c = 0; c < json_inner.comments.length; c++) {
                var src_str = json_inner.comments[c].textDisplay;
                guessLanguage.detect(src_str, function (language) {
                    var translate_dom = '<p class="translate_wrapper"><img src="imgs/uk_flag.png"><span>Translate to English</span></p>';
                    if (language === "en") {
                        translate_dom = ""
                    }

                    if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {
                        if (arabic.test(src_str)) {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                        }
                        else {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json_inner.comments[c].authorURL + '" target="_blank">' + json_inner.comments[c].authorDisplayName + '</a></p><p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                        }
                    }
                    else {
                        if (arabic.test(src_str)) {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                        }
                        else {
                            $tiles_comments.append('<div class="ca-item verified" ><div class="ca-item-main" style="background-color: #95B8D1"><span class="value">' + src_str + '</span>' + translate_dom + '<p class="time_comment">' + json_inner.comments[c].publishedAt + '</p></div></div>');
                        }
                    }

                });
            }
            if (json_inner.comments.length < 10) {
                $('.more_search').hide();
            }
            else {
                $('.more_search').attr('data-url', json_inner.pagination.next).show();
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
        },
        error: function (e) {
        },
        async: true
    });
})
$(".output_expr").on("click", ".clear_search", function () {
    $('#comments_info').empty();
    $('.controls').show();
    $('#comments_table').slideUp(800);
    $('.output_expr,#zero_comments,.more_search,#none_comments').hide();
    $('.filter.active').removeClass('active').click();
});
//translate_wrapper_table
$("#container").on("click", ".translate_wrapper_table", function () {
    $this = $(this);
    $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/language/translate/v2?target=en&key=AIzaSyClIXyzpHO3vM3WETnKFK_IKiWZcZJBL8I&q=' + encodeURI($(this).siblings('span').text()) + '',
        dataType: 'json',
        success: function (json) {
            $this.siblings('span').text(json.data.translations[0].translatedText);
            $this.remove();
        },
        async: true
    });
});
$("#comments_info").on("click", ".translate_wrapper", function () {
    $this = $(this);
    $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/language/translate/v2?target=en&key=AIzaSyClIXyzpHO3vM3WETnKFK_IKiWZcZJBL8I&q=' + encodeURI($(this).siblings('.value').text().replace(/#/g, '').replace(/&/g, '')) + '',
        dataType: 'json',
        success: function (json) {
            $this.siblings('.value').text(json.data.translations[0].translatedText);
            $this.remove();
            var $tiles_comments = $('#comments_info');
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
        },
        async: true
    });
});
//
$('.details').click(function () {
    if ($(this).text() === "Less Details") {

        if ($(this).hasClass('video_yt')) {
            $('#video_yt_table_more').hide();
        }
        else if ($(this).hasClass('channel_yt')) {
            $('#channel_yt_table_more').hide();
        }
        else if ($(this).hasClass('video_fb')) {
            $('#video_fb_table_more').hide();
        }
        else if ($(this).hasClass('image_fb')) {
            $('#image_fb_table_more').hide();
        }
        else if ($(this).hasClass('video_tw')) {
            $('#tweet_tw_table_more').hide();
        }
        else if ($(this).hasClass('user_tw')) {
            $('#user_tw_table_more').hide();
        }
        $(this).html('More Details<img src="imgs/down_arrow.png">');
    }
    else {
        $(this).html('Less Details<img src="imgs/up_arrow.png">');
        if ($(this).hasClass('video_yt')) {
            $('#video_yt_table_more').show();
        }
        else if ($(this).hasClass('channel_yt')) {
            $('#channel_yt_table_more').show();
        }
        else if ($(this).hasClass('video_fb')) {
            $('#video_fb_table_more').show();
        }
        else if ($(this).hasClass('image_fb')) {
            $('#image_fb_table_more').show();
        }
        else if ($(this).hasClass('video_tw')) {
            $('#tweet_tw_table_more').show();
        }
        else if ($(this).hasClass('user_tw')) {
            $('#user_tw_table_more').show();
        }
    }
});
var xhrPool_tw = [];
var xhrPool_jobs = [];
$(document).ajaxSend(function (e, jqXHR, options) {
    if (options.url.indexOf('tweets') > -1) {
        xhrPool_tw.push(jqXHR);
    } else if (options.url.indexOf('jobs') > -1) {
        xhrPool_jobs.push(jqXHR);
    }
});
$(document).ajaxComplete(function (e, jqXHR, options) {
    if (options.url.indexOf('tweets') > -1) {
        xhrPool_tw = $.grep(xhrPool_tw, function (x) {
            return x != jqXHR
        });
    } else if (options.url.indexOf('jobs') > -1) {
        xhrPool_jobs = $.grep(xhrPool_jobs, function (x) {
            return x != jqXHR
        });
    }

});
var abort_tw = function () {
    $.each(xhrPool_tw, function (idx, jqXHR) {
        jqXHR.abort();
    });
};
var abort_jobs = function () {
    $.each(xhrPool_jobs, function (idx, jqXHR) {
        jqXHR.abort();
    });
};

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}