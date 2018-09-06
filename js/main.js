var video_verify = gup('video');
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

    $('.video').show();
    var count = 1;
    $("#video_fb_table,#video_fb_table_more").on("click", "#imgtab", function () {
        var $this = $(this);
        $this.removeClass('small, large', 400);
        $this.addClass((count == 1) ? 'large' : 'small', 400);
        count = 1 - count;
    });

    $("#user_tw_table,#user_tw_table_more").on("click", "#imgtab2", function () {
        var $this = $(this);
        $this.removeClass('small, large', 400);
        $this.addClass((count == 1) ? 'large' : 'small', 400);
        count = 1 - count;
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
    if (video_verify === "") {
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

        var tweet2 = document.getElementById("tweet2");
        var id2 = tweet2.getAttribute("data-tweetID");

        twttr.widgets.createTweet(
            id2, tweet2,
            {
                conversation: 'none',
                cards: 'visible',
                theme: 'light',
                width: 360
            })
            .then(function () {
                $('#tweet2').append('<p class="video_desc">CCTV Footage claimed to depict the 2016 Brussels Airport explosion. The video is in truth from a 2011 attack in Moscow.</p> <button type="button" onclick="verify_example(\'https://twitter.com/acardnal/status/712402767113953281\');return false;" class="btn btn_small"> Verify </button>');
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
});

if (video_verify !== "") {
    if (reprocess === "true") {
        $('#reprocess_check').attr('checked', true);
    }

    $('#video_examples,#video_examples_facebook,#video_examples_twitter,.desc_p,#links_wrapper,hr,.title_example').remove();
    $("#video_verify").val(video_verify);
    $('.back,.section_title,#loading_all,#cover,.tab').show();
    if ((video_verify.indexOf('facebook.com') > -1) || (video_verify.indexOf('fb.me') > -1)) {
        var iframe_url = "https://www.facebook.com/v2.3/plugins/video.php?allowfullscreen=true&autoplay=false&container_width=360&height=305&href=" + video_verify + "&locale=en_US&sdk=joey";
        $('#iframe').attr('src', iframe_url);
        $('.twitter_p').remove();
        $('.table_title').eq(1).text("USER");
        start_video_calls_facebook();
        var fixmeTop = $('.tab').offset().top;
        $(window).scroll(function () {
            var currentScroll = $(window).scrollTop();
            if (currentScroll <= fixmeTop) {
                $('.tab').removeClass('sticky_tab');
            } else {
                $('.tab').addClass('sticky_tab');
            }
        });
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
    $('#video_examples,.desc_p,#links_wrapper,#video_examples_facebook,#video_examples_twitter,hr,.title_example').show();
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
        window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_verify.replace('&', '%26') + reprocess_param;
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
        window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + $("#video_verify").val().replace('&', '%26') + reprocess_param;
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
        url: "store_url.php?url=" + video_verify,
        type: "GET",
        success: function (msg) {}
    });
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=1";
    }
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr/verify_videoV3?twtimeline=0&url=' + video_verify + reprocess_param,
        dataType: 'json',
        success: function (json) {
            $('#analysis_info_msg').text(json.message);
            $('#analysis_info').slideDown();
            var fixmeTop = $('.tab').offset().top + 424 + $('#analysis_info').height();
            $(window).scroll(function () {
                var currentScroll = $(window).scrollTop();
                if (currentScroll <= fixmeTop) {
                    $('.tab').removeClass('sticky_tab');
                } else {
                    $('.tab').addClass('sticky_tab');
                }
            });
            switch (json.status) {
                case "new_video":
                case "processing":
                case "completed":
                case "reprocess":
                case "force_reprocess":
                    load_youtube();
                    load_twitter("-", "-");
                    break;
                case "removed_video":
                case "no_video":
                case "no_video_id":
                case "empty_url":
                case "facebook_auth_limit":
                case "facebook_group":
                case "facebook_photo":
                    $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input,.comments_search').remove();
                    break;
            }
        },
        async: true
    });
}
function start_video_calls_facebook() {
    $.ajax({
        url: "store_url.php?url=" + video_verify,
        type: "GET",
        success: function (msg) {}
    });
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=1";
    }
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr/verify_videoV3?twtimeline=0&url=' + video_verify + reprocess_param,
        dataType: 'json',
        success: function (json) {
            $('#analysis_info_msg').text(json.message);
            $('#analysis_info').slideDown();
            var fixmeTop = $('.tab').offset().top + 404 + $('#analysis_info').height();
            $(window).scroll(function () {
                var currentScroll = $(window).scrollTop();
                if (currentScroll <= fixmeTop) {
                    $('.tab').removeClass('sticky_tab');
                } else {
                    $('.tab').addClass('sticky_tab');
                }
            });
            switch (json.status) {
                case "new_video":
                case "processing":
                case "completed":
                case "reprocess":
                case "force_reprocess":
                    load_facebook();
                    load_twitter("-", "-");
                    break;
                case "removed_video":
                case "no_video":
                case "no_video_id":
                case "empty_url":
                case "facebook_auth_limit":
                case "facebook_group":
                case "facebook_photo":
                    $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input,.comments_search').remove();
                    break;
            }
        },
        async: true
    });
}
function start_video_calls_twitter() {
    $.ajax({
        url: "store_url.php?url=" + video_verify,
        type: "GET",
        success: function (msg) {}
    });
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=1";
    }
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr/verify_videoV3?twtimeline=0&url=' + video_verify + reprocess_param,
        dataType: 'json',
        success: function (json) {
            $('#analysis_info_msg').text(json.message);
            $('#analysis_info').slideDown();
            switch (json.status) {
                case "new_video":
                case "processing":
                case "completed":
                case "reprocess":
                case "force_reprocess":
                    load_twitter_video();
                    load_twitter("-", "twitter");
                    break;
                case "removed_video":
                case "no_video":
                case "no_video_id":
                case "empty_url":
                case "facebook_group":
                case "facebook_auth_limit":
                case "facebook_photo":
                    $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline,.controls,.table,.table_title,#weather_input,.comments_search').remove();
                    break;
            }
        },
        async: true
    });
}

$("#thumb_info").on("click", ".link", function () {
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
    if (match) {
        match[2] = match[2].replace(/\//g, '').replace(/%20/g, '');
    }
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return "error"
    }
}

$('.twitter_p').click(function () {
    window.open($(this).attr('data-url'), '_blank');
});

var all;

function comments(source) {
    var $tiles_comments = $('#comments_info');
    var verified;
    all = parseInt($('#comments_info .ca-item').last().attr('data-index')) + 1 || 0;
    for (all, verified = 0; ((all < global_json.video_comments.length) && (verified < 10)); all++) {
        var time = global_json.video_publishedAt_comments[all];
        var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ', ' + time.substring(12, 14) + ':' + time.substring(15, 17);

        if ($.inArray(global_json.video_comments[all], verification_comments) !== -1) {

            var src_str = global_json.video_comments[all];
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
                if (source === "facebook") {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
                }
                else {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
                }
            }
            else {
                if (source === "facebook") {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
                }
                else {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
                }
            }
            verified++;
        }
        else if ($('.filter.active').attr('id') === "all") {
            if (arabic.test(global_json.video_comments[all])) {
                if (source === "facebook") {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span style="direction:rtl;text-align: right" class="value">' + global_json.video_comments[all] + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
                }
                else {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span style="direction:rtl;text-align: right" class="value">' + global_json.video_comments[all] + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
                }
            }
            else {
                if (source === "facebook") {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span class="value">' + global_json.video_comments[all] + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
                }
                else {
                    $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span class="value">' + global_json.video_comments[all] + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json.video_author_url_comments[all] + '" target="_blank">' + global_json.video_author_comments[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
                }
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
var global_json_comments = "";
var fake_terms_search = "";
function comments_search(source, and, or) {
    $.ajax({
        type: 'GET',
        url: 'http://caa.iti.gr/searchcomments?url=' + encodeURI(video_verify) + '&keywordsor=' + or + '&keywordsand=' + and,
        dataType: 'json',
        success: function (json) {
            global_json_comments = json;
            var $tiles_comments = $('#comments_info');
            var verified;
            if (json.comments_sub.length === 0) {
                $('#zero_comments').show();
            }

            or = " " + or.replace(/,/g, ' , ') + " ";
            and = " " + and.replace(/,/g, ' , ') + " ";
            fake_terms_search = "";
            if (or === "  ") {
                if (and === "  ") {
                    fake_terms_search = [];
                }
                else {
                    fake_terms_search = and.split(',');
                }
            }
            else {
                if (and === "  ") {
                    fake_terms_search = or.split(',');
                }
                else {
                    fake_terms_search = (and + "," + or).split(',');
                }
            }

            for (var all_search = 0; ((all_search < json.comments_sub.length) && (all_search < 10)); all_search++) {
                var time = json.comments_date_sub[all_search];
                var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ', ' + time.substring(12, 14) + ':' + time.substring(15, 17);

                var src_str = json.comments_sub[all_search];

                var term;
                var pattern;
                for (var i = 0; i < fake_terms_search.length; i++) {
                    term = fake_terms_search[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                    if (arabic.test(src_str)) {
                        pattern = new RegExp("(" + fake_terms_search[i].trim() + ")", "gi");
                    }
                    else {
                        pattern = new RegExp("(\\b" + fake_terms_search[i].trim() + "\\b)", "gi");
                    }

                    src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                    src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
                }
                if (arabic.test(src_str)) {
                    if (source === "facebook") {
                        $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
                    }
                    else {
                        $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json.comments_url_sub[all_search] + '" target="_blank">' + json.comments_author_sub[all_search] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
                    }
                }
                else {
                    if (source === "facebook") {
                        $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
                    }
                    else {
                        $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + json.comments_url_sub[all_search] + '" target="_blank">' + json.comments_author_sub[all_search] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
                    }
                }
            }
            if (json.comments_sub.length > 10) {
                $('.more_search').show();
                $('.more_search div').text("More comments ("+json.comments_sub.length+" in total)");
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
                $('#loading').hide();
            }, 10);
        },
        async: true
    });
}
function replies() {
    var $tiles_comments = $('#comments_info');
    var verified;
    all = parseInt($('#comments_info .ca-item').last().attr('data-index')) + 1 || 0;
    for (all, verified = 0; ((all < global_json.replies.length) && (verified < 10)); all++) {
        var time = global_json.replies_created_at[all];
        var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ', ' + time.substring(12, 14) + ':' + time.substring(15, 17);

        if ($.inArray(global_json.replies[all], verification_comments) !== -1) {

            var src_str = global_json.replies[all];
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
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="https://twitter.com/' + global_json.replies_screen_name_url[all] + '" target="_blank">' + global_json.replies_screen_name_url[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            else {
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item verified" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="https://twitter.com/' + global_json.replies_screen_name_url[all] + '" target="_blank">' + global_json.replies_screen_name_url[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            verified++;
        }
        else if ($('.filter.active').attr('id') === "all") {
            if (arabic.test(global_json.replies[all])) {
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span style="direction:rtl;text-align: right" class="value">' + global_json.replies[all] + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="https://twitter.com/' + global_json.replies_screen_name_url[all] + '" target="_blank">' + global_json.replies_screen_name_url[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            else {
                $tiles_comments.append('<div data-index="' + all + '" class="ca-item no-verified" ><div class="ca-item-main"><span class="value">' + global_json.replies[all] + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="https://twitter.com/' + global_json.replies_screen_name_url[all] + '" target="_blank">' + global_json.replies_screen_name_url[all] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            verified++;
        }
    }
    if ($('.filter.active').attr('id') === "all") {
        if (global_json.replies.length > $('#comments_info .ca-item').length) {
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
        $('.more').hide();
        if ($('.table_title').eq(0).text() === "TWEET") {
            replies();
        }
        else if ($('.table_title').eq(1).text() === "CHANNEL") {
            comments("-");
        }
        else {
            comments("facebook");
        }
    }
});
$('.more').click(function () {
    if ($('.table_title').eq(0).text() === "TWEET") {
        replies();
    }
    else if ($('.table_title').eq(1).text() === "CHANNEL") {
        comments("-");
    }
    else {
        comments("facebook");
    }
});
$('.more_search').click(function () {
    if (($('.table_title').eq(0).text() === "TWEET") || ($('.table_title').eq(1).text() === "CHANNEL")) {

        var $tiles_comments = $('#comments_info');
        var com_num = $('#comments_info > div').length;
        for (var all_search = com_num; ((all_search < global_json_comments.comments_sub.length) && (all_search < com_num + 10)); all_search++) {
            var time = global_json_comments.comments_date_sub[all_search];
            var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ', ' + time.substring(12, 14) + ':' + time.substring(15, 17);

            var src_str = global_json_comments.comments_sub[all_search];

            var term;
            var pattern;
            for (var i = 0; i < fake_terms_search.length; i++) {
                term = fake_terms_search[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                if (arabic.test(src_str)) {
                    pattern = new RegExp("(" + fake_terms_search[i].trim() + ")", "gi");
                }
                else {
                    pattern = new RegExp("(\\b" + fake_terms_search[i].trim() + "\\b)", "gi");
                }

                src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
            }
            if (arabic.test(src_str)) {
                $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json_comments.comments_url_sub[all_search] + '" target="_blank">' + global_json_comments.comments_author_sub[all_search] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
            else {
                $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="user_comment"><span style="font-weight: normal;font-size: 12px">by  </span><a href="' + global_json_comments.comments_url_sub[all_search] + '" target="_blank">' + global_json_comments.comments_author_sub[all_search] + '</a></p><p class="time_comment">' + format_time + '</p></div></div>');
            }
        }
        if (all_search < com_num + 10) {
            $('.more_search').hide();
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
    else {


        var $tiles_comments = $('#comments_info');
        var com_num = $('#comments_info > div').length;
        for (var all_search = com_num; ((all_search < global_json_comments.comments_sub.length) && (all_search < com_num + 10)); all_search++) {
            var time = global_json_comments.comments_date_sub[all_search];
            var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ', ' + time.substring(12, 14) + ':' + time.substring(15, 17);

            var src_str = global_json_comments.comments_sub[all_search];

            var term;
            var pattern;
            for (var i = 0; i < fake_terms_search.length; i++) {
                term = fake_terms_search[i].trim().replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                if (arabic.test(src_str)) {
                    pattern = new RegExp("(" + fake_terms_search[i].trim() + ")", "gi");
                }
                else {
                    pattern = new RegExp("(\\b" + fake_terms_search[i].trim() + "\\b)", "gi");
                }

                src_str = src_str.replace(pattern, "<span class='highlight'>$1</span>");
                src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</span>$2<span>$4");
            }
            if (arabic.test(src_str)) {
                $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span style="direction:rtl;text-align: right" class="value">' + src_str + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
            }
            else {
                $tiles_comments.append('<div data-index="' + all_search + '" class="ca-item" ><div class="ca-item-main" style="background-color: #8AA399"><span class="value">' + src_str + '</span><p class="time_comment alone">' + format_time + '</p></div></div>');
            }
        }
        if (all_search < com_num + 10) {
            $('.more_search').hide();
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
});

function verify_example(video_url) {
    var reprocess_param = "";
    if ($('#reprocess_check').is(":checked")) {
        reprocess_param = "&reprocess=true";
    }
    window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?video=' + video_url.replace('&', '%26') + reprocess_param;
}
function load_youtube() {
    var first_call = true;
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
    var $tiles_thumbs = $('#thumb_info');
    var interval_youtube = setInterval(function () {
        $.ajax({
            type: 'GET',
            url: 'http://caa.iti.gr/get_verificationV3?twtimeline=0&url=' + video_verify,
            dataType: 'json',
            success: function (json) {
                $('#alert_comments').stop().slideDown();
                if (json.processing_status === "done") {
                    abort_get();
                    $('#analysis_info').slideUp();
                    $('.comments_search').show();
                    clearInterval(interval_youtube);
                    $('#alert_comments').stop().slideUp();
                }
                global_json = json;

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
                        $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l] + '</p>')
                    }
                    else {
                        $('#locations').append('<p class="location_name" data-name="' + json.video_description_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.video_description_mentioned_locations[l] + ',</p>')
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
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':00';

                    $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                }
                if (json.video_recording_time !== "") {
                    empty_time = false;
                    var time = json.video_recording_time;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':00';

                    $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                }
                if (empty_time) {
                    $('#times .location_title').after('<p class="location_name" style="cursor: default">-</p>')
                }
                var video_locations = "", channel_locations = "";
                for (var v = 0; v < json.video_description_mentioned_locations.length; v++) {
                    if (v === json.video_description_mentioned_locations.length - 1) {
                        video_locations += "<span>" + json.video_description_mentioned_locations[v] + "</span>";
                    }
                    else {
                        video_locations += "<span>" + json.video_description_mentioned_locations[v] + "</span>, ";
                    }
                }

                for (var c = 0; c < json.channel_description_mentioned_locations.length; c++) {
                    if (c === json.channel_description_mentioned_locations.length - 1) {
                        channel_locations += "<span>" + json.channel_description_mentioned_locations[c] + "</span>";
                    }
                    else {
                        channel_locations += "<span>" + json.channel_description_mentioned_locations[c] + "</span>, ";
                    }
                }

                $('#user_video').show();
                $('.twitter_p').attr('data-url', json.twitter_search_url);
                if (json.isDebunked !== "") {
                    $('.debunked').html(json.isDebunked).slideDown();
                }
                if (json.video_id !== "") {
                    $('#video_id').html(json.video_id);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_id').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_title !== "") {
                    $('#video_title').text(json.video_title);
                    if (arabic.test(json.video_title)) {
                        $('#video_title').css({'direction': 'rtl', 'text-align': 'right'});
                    }
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_title').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Title</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_description !== "") {
                    $('#video_description').text(json.video_description);
                    if (arabic.test(json.video_description)) {
                        $('#video_description').css({'direction': 'rtl', 'text-align': 'right'});
                    }
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_description').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Description</td> <td>Not Available</td> </tr>');
                    }
                }

                if (video_locations !== "") {
                    $('#video_locations').html(video_locations);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_locations').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Description Mentioned Locations</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_upload_time !== "") {
                    $('#video_upload_time').text(json.video_upload_time);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_upload_time').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Upload Time</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_view_count !== "") {
                    $('#video_view_count').text(json.video_view_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_view_count').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>View Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_like_count !== "") {
                    $('#video_like_count').text(json.video_like_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_like_count').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Like Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_dislike_count !== "") {
                    $('#video_dislike_count').text(json.video_dislike_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_dislike_count').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Dislike Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_comment_count !== "") {
                    $('#video_comment_count').text(json.video_comment_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_comment_count').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Comment Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.num_verification_comments !== "") {
                    $('#video_verification_comment_count').text(json.verification_comments.length);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_verification_comment_count').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Verification Comment Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_duration !== "") {
                    $('#video_duration').text(json.video_duration);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_duration').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Duration</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_dimension !== "") {
                    $('#video_dimension').text(json.video_dimension);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_dimension').parent().remove();
                        $('#video_yt_table_more tbody').append('<td>Dimension<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_dimension"></td>');
                    }
                }

                if (json.video_definition !== "") {
                    $('#video_definition').text(json.video_definition);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_definition').parent().remove();
                        $('#video_yt_table_more tbody').append('<td>Definition<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_definition"></td>');
                    }
                }

                if (json.video_licensed_content !== "") {
                    $('#video_licensed_content').text(json.video_licensed_content);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_licensed_content').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Licensed Content<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_licensed"></td> <td id="video_licensed_content">false</td> </tr>');
                    }
                }

                if (json.video_recording_location_description !== "") {
                    $('#video_recording_location_description').text(json.video_recording_location_description);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_recording_location_description').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Recording Location Description</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_recording_time !== "") {
                    $('#video_recording_time').text(json.video_recording_time);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#video_recording_time').parent().remove();
                        $('#video_yt_table_more tbody').append('<tr> <td>Recording Time</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_id !== "") {
                    $('#channel_id').text(json.channel_id);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_id').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Id</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_description !== "") {
                    $('#channel_description').text(json.channel_description);
                    if (arabic.test(json.channel_description)) {
                        $('#channel_description').css({'direction': 'rtl', 'text-align': 'right'});
                    }
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_description').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Description</td> <td>Not Available</td> </tr>');
                    }
                }

                if (channel_locations !== "") {
                    $('#channel_locations').html(channel_locations);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_locations').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Description Mentioned Locations</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_created_time !== "") {
                    $('#channel_created_time').text(json.channel_created_time);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_created_time').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_location !== "Not available") {
                    $('#channel_location').text(json.channel_location);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_location').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Location</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_view_count !== "") {
                    $('#channel_view_count').text(json.channel_view_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_view_count').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>View Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_comment_count !== "") {
                    $('#channel_comment_count').text(json.channel_comment_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_comment_count').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Comment Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_subscriber_count !== "") {
                    $('#channel_subscriber_count').text(json.channel_subscriber_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_subscriber_count').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Subscriber Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_video_count !== "") {
                    $('#channel_video_count').text(json.channel_video_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_video_count').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Video Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_videos_per_month !== "") {
                    $('#channel_videos_per_month').text(json.channel_videos_per_month);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_videos_per_month').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>Video Per Month</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_url !== "") {
                    $('#channel_url').html('<a target="_blank" href="' + json.channel_url + '">' + json.channel_url + '</a>');
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_url').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>URL</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.channel_about_page !== "") {
                    $('#channel_about_page').html('<a target="_blank" href="' + json.channel_about_page + '">' + json.channel_about_page + '</a>');
                }
                else {
                    if (json.processing_status === "done") {
                        $('#channel_about_page').parent().remove();
                        $('#channel_yt_table_more tbody').append('<tr> <td>About Page</td> <td>Not Available</td> </tr>');
                    }
                }

                for (var i = $('#thumb_info .ca-item').length; i < json.video_thumbnails.length; i++) {
                    $tiles_thumbs.append('<div class="ca-item" style="width:230px"><div class="ca-item-main"><img src="' + json.video_thumbnails[i] + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json.reverse_image_thumbnails_search_url_google[i] + '">Google</li><li class="link" data-url="' + json.reverse_image_thumbnails_search_url_yandex[i] + '">Yandex</li></ul></div></div>');
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
                    comments("-");
                    first_call = false
                }

                $('#loading_all,#cover,#cover_info,#loading_info').remove();
                if (!($('.vis-timeline').length)) {
                    $('#cover_timeline,#loading_timeline').show();
                }

                $('.controls,.table_title,#weather_input,#channel_yt_table,#video_yt_table,.video_yt,.channel_yt').show();
                if ((json.video_comments.length === 0) && (json.processing_status === "done")) {
                    $('.controls').hide();
                    $('.comments_search').html("No comments, at the moment").css({
                        'margin-top': '20px',
                        'text-decoration': 'none',
                        'pointer-events': 'none'
                    });
                }
                $('.tooltip').tooltipster({"contentAsHTML": true});
            },
            error: function (e) {
            },
            async: true
        });
    }, 1000);
}
function load_facebook() {
    var first_call = true;
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
    var $tiles_thumbs = $('#thumb_info');
    var interval_facebook = setInterval(function () {
        $.ajax({
            type: 'GET',
            url: 'http://caa.iti.gr/get_verificationV3?twtimeline=0&url=' + video_verify,
            dataType: 'json',
            success: function (json) {
                $('#alert_comments').stop().slideDown();
                global_json = json;
                if (json.processing_status === "done") {
                    abort_get();
                    $('#analysis_info').slideUp();
                    $('.comments_search').show();
                    clearInterval(interval_facebook);
                    $('#alert_comments').stop().slideUp();
                }


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
                $('#times .location_name').remove();
                if (json.created_time !== "") {
                    empty_time = false;
                    var time = json.created_time;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':00';

                    $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>');

                }
                if (json.updated_time !== "") {
                    empty_time = false;
                    var time = json.updated_time;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':00';
                    $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>')
                }
                if (empty_time) {
                    $('#times .location_title').after('<p class="location_name" style="cursor: default">-</p>')
                }


                var video_locations = "";
                for (var v = 0; v < json.video_description_mentioned_locations.length; v++) {
                    if (v === json.video_description_mentioned_locations.length - 1) {
                        video_locations += "<span>" + json.video_description_mentioned_locations[v] + "</span>";
                    }
                    else {
                        video_locations += "<span>" + json.video_description_mentioned_locations[v] + "</span>, ";
                    }
                }

                $('#user_video').show();
                if (json.isDebunked !== "") {
                    $('.debunked').html(json.isDebunked).slideDown();
                }

                if (json.title !== "") {
                    $('#fb_video_title').text(json.title);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_video_title').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Title</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_id !== "") {
                    $('#fb_video_id').text(json.video_id);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_video_id').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.content_category !== "") {
                    $('#fb_content_category').text(json.content_category);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_content_category').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Content Category</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.content_tags.length > 0) {
                    $('#fb_content_tags').text(json.content_tags);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_content_tags').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Content Tags</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.video_description !== "") {
                    $('#fb_video_description').text(json.video_description);
                    if (arabic.test(json.video_description)) {
                        $('#fb_video_description').css({'direction': 'rtl', 'text-align': 'right'});
                    }
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_video_description').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Desctiption</td> <td>Not Available</td> </tr>');
                    }
                }

                if (video_locations !== "") {
                    $('#fb_video_locations').html(video_locations);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_video_locations').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Description Mentioned Locations</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.created_time !== "") {
                    $('#fb_created_time').text(json.created_time);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_created_time').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.updated_time !== "") {
                    $('#fb_updated_time').text(json.updated_time);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_updated_time').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Updated Time<img src="imgs/info_color.png" class="tooltip tooltipstered" data-tooltip-content="#tooltip_updated_time"></td> <td id="fb_updated_time">2015-02-25, 08:18:58 (UTC)</td> </tr>');
                    }
                }

                if (json.total_comment_count !== "") {
                    $('#fb_total_comment_count').text(json.total_comment_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_total_comment_count').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Comments</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.num_verification_comments !== "") {
                    $('#fb_total_verification_comment_count').text(json.verification_comments.length);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_total_verification_comment_count').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Verification Comments</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.embeddable !== "") {
                    $('#fb_embeddable').text(json.embeddable);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_embeddable').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Embeddable</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.length !== "") {
                    $('#fb_length').text(json.length);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_length').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Length</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.picture !== "") {
                    $('#fb_picture').html('<img id="imgtab" class="small" src="' + json.picture + '">');
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_picture').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Picture</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.privacy !== "") {
                    $('#fb_privacy').text(json.privacy);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_privacy').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>Privacy</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.from !== "") {
                    $('#fb_source').text(json.from);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#fb_source').parent().remove();
                        $('#video_fb_table_more tbody').append('<tr> <td>User Source</td> <td>Not Available</td> </tr>');
                    }
                }

                for (var i = $('#thumb_info .ca-item').length; i < json.video_thumbnails.length; i++) {
                    $tiles_thumbs.append('<div class="ca-item" style="width:230px"><div class="ca-item-main"><img src="' + json.video_thumbnails[i] + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json.reverse_image_thumbnails_search_url_google[i] + '">Google</li><li class="link" data-url="' + json.reverse_image_thumbnails_search_url_yandex[i] + '">Yandex</li></ul></div></div>');
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
                    comments("facebook");
                    first_call = false
                }

                $('#loading_all,#cover,#cover_info,#loading_info').remove();
                if (!($('.vis-timeline').length)) {
                    $('#cover_timeline,#loading_timeline').show();
                }
                $('.controls,.table_title,#weather_input,#video_fb_table,#user_fb_table,.video_fb').show();
                if ((json.video_comments.length === 0) && (json.processing_status === "done")) {
                    $('.controls').hide();
                    $('.comments_search').html("No comments, at the moment").css({
                        'margin-top': '20px',
                        'text-decoration': 'none',
                        'pointer-events': 'none'
                    });
                }
                $('.tooltip').tooltipster({"contentAsHTML": true});
            },
            error: function () {

            },
            async: true
        });
    }, 1000);

}
function load_twitter_video() {
    var first_call = true;
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
    var $tiles_thumbs = $('#thumb_info');
    var interval_twitter = setInterval(function () {
        $.ajax({
            type: 'GET',
            url: 'http://caa.iti.gr/get_verificationV3?twtimeline=0&url=' + video_verify,
            dataType: 'json',
            success: function (json) {

                $('#alert_comments').stop().slideDown();
                if (json.embedded_youtube !== "") {
                    $('.embedded_yt').show();
                    $('.embedded_yt a').attr('href', 'index.html?video=' + json.embedded_youtube.replace('&', '%26'));
                }
                global_json = json;
                if (json.processing_status === "done") {
                    abort_get();
                    $('#analysis_info').slideUp();
                    clearInterval(interval_twitter);
                    $('.comments_search').show();
                    $('#alert_comments').stop().slideUp();
                }

                $('#locations .location_name').remove();
                var empty_location = true;
                if (json.user_location !== "") {
                    empty_location = false;
                    if ((json.user_description_mentioned_locations.length > 0) || (json.tweet_text_mentioned_locations.length > 0)) {
                        $('#locations').append('<p class="location_name" data-name="' + json.user_location + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.user_location + ',</p>')
                    }
                    else {
                        $('#locations').append('<p class="location_name" data-name="' + json.user_location + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.user_location + '</p>')
                    }
                }
                for (var l = 0; l < json.user_description_mentioned_locations.length; l++) {
                    empty_location = false;
                    if (l === json.user_description_mentioned_locations.length - 1) {
                        if (json.tweet_text_mentioned_locations.length > 0) {
                            $('#locations').append('<p class="location_name" data-name="' + json.user_description_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.user_description_mentioned_locations[l] + ',</p>')
                        }
                        else {
                            $('#locations').append('<p class="location_name" data-name="' + json.user_description_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.user_description_mentioned_locations[l] + '</p>')
                        }
                    }
                    else {
                        $('#locations').append('<p class="location_name" data-name="' + json.user_description_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.user_description_mentioned_locations[l] + ',</p>')
                    }
                }
                for (var l = 0; l < json.tweet_text_mentioned_locations.length; l++) {
                    empty_location = false;
                    if (l === json.tweet_text_mentioned_locations.length - 1) {
                        $('#locations').append('<p class="location_name" data-name="' + json.tweet_text_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.tweet_text_mentioned_locations[l] + '</p>')
                    }
                    else {
                        $('#locations').append('<p class="location_name" data-name="' + json.tweet_text_mentioned_locations[l] + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + json.tweet_text_mentioned_locations[l] + ',</p>')
                    }
                }
                if (empty_location) {
                    $('#locations').append('<p class="location_name" style="cursor: default">-</p>')
                }


                $('#times .location_name').remove();
                if (json.created_at !== "") {
                    var time = json.created_at;
                    var format_time = time.substring(8, 10) + '/' + time.substring(5, 7) + '/' + time.substring(0, 4) + ' ' + time.substring(12, 14) + ':00';

                    $('#times .location_title').after('<p class="location_name" data-time="' + format_time + '"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + format_time + '</p>');

                }
                else {
                    $('#times .location_title').after('<p class="location_name" style="cursor: default">-</p>')
                }


                var tweet_text_locations = "";
                for (var v = 0; v < json.tweet_text_mentioned_locations.length; v++) {
                    if (v === json.tweet_text_mentioned_locations.length - 1) {
                        tweet_text_locations += "<span>" + json.tweet_text_mentioned_locations[v] + "</span>";
                    }
                    else {
                        tweet_text_locations += "<span>" + json.tweet_text_mentioned_locations[v] + "</span>, ";
                    }
                }

                var user_description_locations = "";
                for (v = 0; v < json.user_description_mentioned_locations.length; v++) {
                    if (v === json.user_description_mentioned_locations.length - 1) {
                        user_description_locations += "<span>" + json.user_description_mentioned_locations[v] + "</span>";
                    }
                    else {
                        user_description_locations += "<span>" + json.user_description_mentioned_locations[v] + "</span>, ";
                    }
                }

                var hashtags = "";
                for (v = 0; v < json.hashtags.length; v++) {
                    if (v === json.hashtags.length - 1) {
                        hashtags += "<span>#" + json.hashtags[v] + "</span>";
                    }
                    else {
                        hashtags += "<span>#" + json.hashtags[v] + "</span>, ";
                    }
                }

                var urls = "";
                for (v = 0; v < json.urls.length; v++) {
                    if (v === json.urls.length - 1) {
                        urls += '<a target="_blank" href="' + json.urls[v] + '">' + json.urls[v] + '</a>';
                    }
                    else {
                        urls += '<a target="_blank" href="' + json.urls[v] + '">' + json.urls[v] + '</a>, ';
                    }
                }

                var users_mentions = "";
                for (v = 0; v < json.user_mentions.length; v++) {
                    if (v === json.user_mentions.length - 1) {
                        users_mentions += "<span>@" + json.user_mentions[v] + "</span>";
                    }
                    else {
                        users_mentions += "<span>@" + json.user_mentions[v] + "</span>, ";
                    }
                }

                var video_urls = "";
                for (v = 0; v < json.video_info_url.length; v++) {
                    if (v === json.video_info_url.length - 1) {
                        video_urls += '<a target="_blank" href="' + json.video_info_url[v] + '">' + json.video_info_url[v] + '</a>';
                    }
                    else {
                        video_urls += '<a target="_blank" href="' + json.video_info_url[v] + '">' + json.video_info_url[v] + '</a>, ';
                    }
                }

                var bitrate = "";
                for (v = 0; v < json.video_info_bitrate.length; v++) {
                    if (v === json.video_info_bitrate.length - 1) {
                        bitrate += "<span>" + json.video_info_bitrate[v] + "</span>";
                    }
                    else {
                        bitrate += "<span>" + json.video_info_bitrate[v] + "</span>, ";
                    }
                }

                $('#user_video').show();
                if (json.isDebunked !== "") {
                    $('.debunked').html(json.isDebunked).slideDown();
                }
                if (json.id_str !== "") {
                    $('#tw_tweet_id').text(json.id_str);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_id').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>ID</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.full_text !== "") {
                    $('#tw_tweet_text').text(json.full_text);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_text').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Text</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.created_at !== "") {
                    $('#tw_tweet_created_time').text(json.created_at);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_created_time').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.source !== "") {
                    $('#tw_tweet_source').html('<a target="_blank" href="' + json.source_url + '">' + json.source + '</a>');
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_source').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Source</td> <td>Not Available</td> </tr>');
                    }
                }

                if (tweet_text_locations !== "") {
                    $('#tw_tweet_mentioned_locations').html(tweet_text_locations);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_mentioned_locations').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Text Mentioned Locations</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.retweet_count !== "") {
                    $('#tw_tweet_rt').text(json.retweet_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_rt').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Retweet Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.favorite_count !== "") {
                    $('#tw_tweet_fav').text(json.favorite_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_fav').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Favorite Count</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.verification_replies_count !== "") {
                    $('#tw_tweet_ver_comments').text(json.verification_replies.length);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_ver_comments').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Verifivation Comments</td> <td>Not Available</td> </tr>');
                    }
                }

                if (hashtags !== "") {
                    $('#tw_tweet_hashtags').html(hashtags);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_hashtags').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Hashtags</td> <td>Not Available</td> </tr>');
                    }
                }

                if (urls !== "") {
                    $('#tw_tweet_urls').html(urls);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_urls').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>URLs</td> <td>Not Available</td> </tr>');
                    }
                }

                if (users_mentions !== "") {
                    $('#tw_tweet_users_mentions').html(users_mentions);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_users_mentions').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Users Mentions</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.lang !== "") {
                    $('#tw_tweet_lang').text(json.lang);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_tweet_lang').parent().remove();
                        $('#tweet_tw_table_more tbody').append('<tr> <td>Language</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.embedded_youtube !== "") {
                    $('#tw_tweet_aspect').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '">here</a></p>');
                    $('#tw_tweet_duration').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '">here</a></p>');
                    $('#tw_tweet_url').removeClass('link').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '">here</a></p>');
                    $('#tw_tweet_bitrate').html('<p class="empty_cell">Tweet contains embedded YouTube video. Submit the YouTube video to CAA for analysis <a href="index.html?video=' + json.embedded_youtube.replace('&', '%26') + '">here</a></p>');
                }
                else {
                    if (json.video_info_aspect_ratio !== "") {
                        $('#tw_tweet_aspect').text(json.video_info_aspect_ratio);
                    }
                    else {
                        if (json.processing_status === "done") {
                            $('#tw_tweet_aspect').parent().remove();
                            $('#tweet_tw_table_more tbody').append('<tr> <td>Video Aspect Ratio</td> <td>Not Available</td> </tr>');
                        }
                    }

                    if (json.video_info_duration !== "") {
                        $('#tw_tweet_duration').text(json.video_info_duration);
                    }
                    else {
                        if (json.processing_status === "done") {
                            $('#tw_tweet_duration').parent().remove();
                            $('#tweet_tw_table_more tbody').append('<tr> <td>Video Duration</td> <td>Not Available</td> </tr>');
                        }
                    }

                    if (video_urls !== "") {
                        $('#tw_tweet_url').html(video_urls);
                    }
                    else {
                        if (json.processing_status === "done") {
                            $('#tw_tweet_url').parent().remove();
                            $('#tweet_tw_table_more tbody').append('<tr> <td>Video URL</td> <td>Not Available</td> </tr>');
                        }
                    }

                    if (bitrate !== "") {
                        $('#tw_tweet_bitrate').html(bitrate);
                    }
                    else {
                        if (json.processing_status === "done") {
                            $('#tw_tweet_bitrate').parent().remove();
                            $('#tweet_tw_table_more tbody').append('<tr> <td>Video Bitrate</td> <td>Not Available</td> </tr>');
                        }
                    }
                }
                $('#tw_tweet_verification').text(json.tweet_verification_label);


                if (json.user_name !== "") {
                    $('#tw_user_username').text(json.user_name);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_username').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Username</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_name !== "") {
                    $('#tw_user_screenname').html('<a target="_blank" href="https://pipl.com/search/?q=' + json.user_screen_name + '&l=&sloc=&in=6">' + json.user_screen_name + '</a>');
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_screenname').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Screen Name</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_location !== "") {
                    $('#tw_user_location').text(json.user_location);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_location').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Location</td> <td>Not Available</td> </tr>');
                    }
                }

                if (user_description_locations !== "") {
                    $('#tw_user_description_locations').html(user_description_locations);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_description_locations').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Description Mentioned Locations</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_url !== "") {
                    $('#tw_user_url').html('<a href="' + json.user_url + '" target="_blank">' + json.user_url + '</a>');
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_url').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>URL</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_description !== "") {
                    $('#tw_user_desc').text(json.user_description);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_desc').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Description</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_protected !== "") {
                    $('#tw_user_protected').text(json.user_protected);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_protected').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Protected</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_verified !== "") {
                    $('#tw_user_verified').text(json.user_verified);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_verified').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Verified</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_followers_count !== "") {
                    $('#tw_user_followers').text(json.user_followers_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_followers').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Followers</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_friends_count !== "") {
                    $('#tw_user_friends').text(json.user_friends_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_friends').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Firends</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_listed_count !== "") {
                    $('#tw_user_listed').text(json.user_listed_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_listed').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Listed</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_favourites_count !== "") {
                    $('#tw_user_favourites').text(json.user_favourites_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_favourites').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Favorites</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_statuses_count !== "") {
                    $('#tw_user_statuses').text(json.user_statuses_count);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_statuses').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Statuses</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_lang !== "") {
                    $('#tw_user_lang').text(json.user_lang);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_lang').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Language</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_created_at !== "") {
                    $('#tw_user_created').text(json.user_created_at);
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_created').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Created Time</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.user_screen_name !== "") {
                    $('#tw_user_profile_img').html('<img id="imgtab2" class="small" src="https://avatars.io/twitter/' + json.user_screen_name + '">');
                }
                else {
                    if (json.processing_status === "done") {
                        $('#tw_user_profile_img').parent().remove();
                        $('#user_tw_table_more tbody').append('<tr> <td>Profile Image</td> <td>Not Available</td> </tr>');
                    }
                }

                if (json.media_url !== "") {
                    $('#alert_thumbs').slideUp();
                    if ($('#thumb_info .ca-item').length === 0) {
                        $tiles_thumbs.append('<div class="ca-item" style="width:230px"><div class="ca-item-main"><img src="' + json.media_url + '" style="width: 230px;"><p class="google">Reverse image search by:</p><ul class="reverse_list"><li class="link" data-url="' + json.reverse_image_thumbnails_search_url_google + '">Google</li><li class="link" data-url="' + json.reverse_image_thumbnails_search_url_yandex + '">Yandex</li></ul></div></div>');
                    }
                }
                else {
                    $('#alert_thumbs').slideDown();
                    $('#alert_thumbs a').attr('href', 'index.html?video=' + json.embedded_youtube.replace('&', '%26'));
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

                if (json.replies_overflow === "false") {
                    $('#verified').html('VERIFICATION (' + json.verification_replies.length + ')');
                    $('#all').html('ALL (' + json.replies.length + ')');
                    verification_comments = [];
                    for (var k = 0; k < json.verification_replies.length; k++) {
                        verification_comments.push(json.verification_replies[k]);
                    }

                    if ($('.filter.active').attr('id') === "all") {
                        if (global_json.replies.length > $('#comments_info .ca-item').length) {
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
                    if ((first_call) && (json.verification_replies.length > 0)) {
                        replies();
                        first_call = false
                    }
                }
                else {
                    $('#verified').html('VERIFICATION (-)');
                    $('#all').html('ALL (-)');
                    verification_comments = [];
                    $('.more').hide();
                    $('#alert_comments').hide();
                    $('#alert_comments_overflow').stop().slideDown();
                }

                $('#loading_all,#cover,#cover_info,#loading_info').remove();
                if (!($('.vis-timeline').length)) {
                    $('#cover_timeline,#loading_timeline').show();
                }
                $('.controls,.table_title,#weather_input,#tweet_tw_table,#user_tw_table,.video_tw,.user_tw').show();
                if ((json.replies.length === 0) && (json.processing_status === "done")) {
                    $('.controls').hide();
                    $('.comments_search').html("No comments, at the moment").css({
                        'margin-top': '20px',
                        'text-decoration': 'none',
                        'pointer-events': 'none'
                    });
                }
                $('.tooltip').tooltipster({"contentAsHTML": true});
            },
            error: function () {

            },
            async: true
        });
    }, 1000);

}
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
            url: 'http://caa.iti.gr/weatherV3?time=' + time + '&location=' + $('#location_input').val(),
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
    keywordand=[];
    keywordor=[];
    $('#loading').show();
    $('#comments_table').slideUp(800, function () {});

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
    $('.more,.controls,.more_search').hide();
    if ($('.table_title').eq(0).text() === "TWEET") {
        comments_search("-", keywordand.join(','), keywordor.join(','));
    }
    else if ($('.table_title').eq(1).text() === "CHANNEL") {
        comments_search("-", keywordand.join(','), keywordor.join(','));
    }
    else {
        comments_search("facebook", keywordand.join(','), keywordor.join(','));
    }
});
$(".output_expr").on("click", ".clear_search", function () {
    $('#comments_info').empty();
    $('.controls').show();
    $('#comments_table').slideUp(800);
    $('.output_expr,#zero_comments,.more_search').hide();
    if ($('.table_title').eq(0).text() === "TWEET") {
        replies();
    }
    else if ($('.table_title').eq(1).text() === "CHANNEL") {
        comments("-");
    }
    else {
        comments("facebook");
    }
});
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
        else if ($(this).hasClass('video_tw')) {
            $('#tweet_tw_table_more').show();
        }
        else if ($(this).hasClass('user_tw')) {
            $('#user_tw_table_more').show();
        }
    }
});
var xhrPool_tw = [];
var xhrPool_get = [];
$(document).ajaxSend(function (e, jqXHR, options) {
    if (options.url.indexOf('get_twverificationV3') > -1) {
        xhrPool_tw.push(jqXHR);
    } else if (options.url.indexOf('get_verificationV3') > -1) {
        xhrPool_get.push(jqXHR);
    }
});
$(document).ajaxComplete(function (e, jqXHR, options) {
    if (options.url.indexOf('get_twverificationV3') > -1) {
        xhrPool_tw = $.grep(xhrPool_tw, function (x) {
            return x != jqXHR
        });
    } else if (options.url.indexOf('get_verificationV3') > -1) {
        xhrPool_get = $.grep(xhrPool_get, function (x) {
            return x != jqXHR
        });
    }

});
var abort_tw = function () {
    $.each(xhrPool_tw, function (idx, jqXHR) {
        jqXHR.abort();
    });
};
var abort_get = function () {
    $.each(xhrPool_get, function (idx, jqXHR) {
        jqXHR.abort();
    });
};