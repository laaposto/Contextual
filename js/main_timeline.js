var interval_twitter;
var max_tweets = 10;
var items, timeline;
var first_call = true;
function load_twitter(more_items, source) {
    interval_twitter = setInterval(function () {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/get_twverificationV3?twtimeline=0&url=' + video_verify,
            success: function (json) {
                if (source === "twitter") {
                    $('#alert_twitter_user').slideDown();
                }
                $('#alert_twitter').slideDown();
                if (json.tweets.length > 0) {
                    if (first_call) {
                        first_call = false;
                        var data = [];
                        for (var i = 0; i < json.tweets.length && i < max_tweets; i++) {
                            data.push({
                                "id": json.tweets[i].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json.tweets[i].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json.tweets[i].created_at).getTime(),
                                "text": json.tweets[i].text,
                                "username": json.tweets[i].user.screen_name
                            });
                        }
                        if (i === 10) {
                            $('#alert_twitter_overflow').stop().slideDown();
                        }

                        var container = document.getElementById('visualization');
                        items = new vis.DataSet(data);
                        var options = {
                            dataAttributes: ['text', 'id', 'username'],
                            height: 600,
                            showCurrentTime: true,
                            autoResize: true,
                            zoomable: false
                        };

                        timeline = new vis.Timeline(container, items, options);
                        if (json.upload_time !== 0) {
                            timeline.setCurrentTime(json.upload_time);
                        }
                        timeline.on('rangechange', function (properties) {
                            $('#tweet').css({opacity: 0, "z-index": -1});
                        });
                        timeline.on('select', function (properties) {

                            $('#tweet').empty().css({opacity: 0, "z-index": -1});
                            var tweet = document.getElementById("tweet");
                            if (source !== "twitter") {
                                if (!(properties.items[0] == null)) {
                                    twttr.widgets.createTweet(
                                        '' + properties.items[0], tweet,
                                        {
                                            conversation: 'none',    // or all
                                            cards: 'visible',  // or visible
                                            theme: 'light'    // or dark
                                        })
                                        .then(function (el) {
                                            if (el == null) {//wrong tweet ID
                                                $('#tweet').css({
                                                    left: properties.event.srcEvent.clientX + 75 - properties.event.srcEvent.layerX,
                                                    top: properties.event.srcEvent.pageY - 49 - properties.event.srcEvent.layerY,
                                                    opacity: 1,
                                                    "z-index": 21
                                                }).removeClass().addClass('middle_left_arrow');
                                                $('#tweet').append('<p class="tweet_p">Wrong Id or Tweet was deleted</p>');
                                                if (properties.event.srcEvent.clientX + 68 - properties.event.srcEvent.layerX + 408 > $(window).width()) {
                                                    $('#tweet').css({
                                                        left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                        top: properties.event.srcEvent.pageY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 16,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('middle_right_arrow');
                                                }
                                            }
                                            else {
                                                $('#tweet').append("<p class='fake_link'><a href='http://reveal-mklab.iti.gr/reveal/fake?tweet_id=" + $(el).attr('data-tweet-id') + "' target='_blank'>Check tweet veracity</a><a href='https://pipl.com/search/?q=" + properties.event.target.offsetParent.attributes[2].value + "' target='_blank'>Checkout the Pipl profile of this Twitter user.</a></p>");
                                                $('#tweet').css({
                                                    left: properties.event.srcEvent.clientX + 75 - properties.event.srcEvent.layerX,
                                                    top: properties.event.srcEvent.pageY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 16,
                                                    opacity: 1,
                                                    "z-index": 21
                                                }).removeClass().addClass('middle_left_arrow');
                                                if ((properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) && (properties.event.srcEvent.clientX + 68 - properties.event.srcEvent.layerX + 408 > $(window).width())) {
                                                    $('#tweet').css({
                                                        left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                        top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('bottom_right_arrow');
                                                }
                                                else if (properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) {
                                                    $('#tweet').css({
                                                        top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('bottom_left_arrow');
                                                }
                                                else if (properties.event.srcEvent.clientX + 73 - properties.event.srcEvent.layerX + 408 > $(window).width()) {
                                                    $('#tweet').css({
                                                        left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('middle_right_arrow');
                                                }
                                            }
                                        });
                                }
                            }
                            else {
                                if (!(properties.items[0] == null)) {
                                    $('#tweet').css('width', '270px').append("<p style='margin:0'><img class='info_img' src='https://avatars.io/twitter/" + properties.event.target.offsetParent.attributes[2].value + "'><span class='info_username'>" + properties.event.target.offsetParent.attributes[2].value + "</span></p><p class='fake_link'><a style='margin-left: 12px;' href='https://pipl.com/search/?q=" + properties.event.target.offsetParent.attributes[2].value + "' target='_blank'>Checkout the Pipl profile of this Twitter user.</a><a style='margin-left: 12px;' href='http://reveal-mklab.iti.gr/reveal/fake?tweet_id=" + $(properties.event.target.offsetParent).attr('data-id') + "' target='_blank'>Check tweet veracity</a></p>");

                                    $('#tweet').css({
                                        left: properties.event.srcEvent.clientX + 75 - properties.event.srcEvent.layerX,
                                        top: properties.event.srcEvent.pageY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 16,
                                        opacity: 1,
                                        "z-index": 21
                                    }).removeClass().addClass('middle_left_arrow');
                                    if ((properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) && (properties.event.srcEvent.clientX + 68 - properties.event.srcEvent.layerX + 408 > $(window).width())) {
                                        $('#tweet').css({
                                            left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 374,
                                            top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                            opacity: 1,
                                            "z-index": 21
                                        }).removeClass().addClass('bottom_right_arrow');
                                    }
                                    else if (properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) {
                                        $('#tweet').css({
                                            top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                            opacity: 1,
                                            "z-index": 21
                                        }).removeClass().addClass('bottom_left_arrow');
                                    }
                                    else if (properties.event.srcEvent.clientX + 73 - properties.event.srcEvent.layerX + 408 > $(window).width()) {
                                        $('#tweet').css({
                                            left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 374,
                                            opacity: 1,
                                            "z-index": 21
                                        }).removeClass().addClass('middle_right_arrow');
                                    }

                                }
                            }
                        });

                        $('.arrow').click(function () {
                            $('#tweet').css({opacity: 0, "z-index": -1});
                            if ($(this).attr('id') === "right_arrow") {
                                move(-0.2);
                            }
                            else {
                                move(0.2);
                            }
                        });
                        $('.zoom').click(function () {
                            $('#tweet').css({opacity: 0, "z-index": -1});
                            if ($(this).attr('id') === "plus") {
                                zoom(-0.2);
                            }
                            else {
                                zoom(0.2);
                            }
                        });
                        $('#navigation').find('p').click(function () {
                            $('#tweet').css({opacity: 0, "z-index": -1});
                            timeline.fit();
                            timeline.setSelection([], {
                                focus: false
                            });
                            $('.vis-box').css('opacity', '1');
                            $('.vis-selected').removeClass('vis-selected');
                            document.getElementById("query").value = "";
                            $("#ff-search").find("input[type='text']").removeClass("searchon");

                        });

                        function move(percentage) {
                            var range = timeline.getWindow();
                            var interval = range.end - range.start;

                            timeline.setWindow({
                                start: range.start.valueOf() - interval * percentage,
                                end: range.end.valueOf() - interval * percentage
                            });
                        }

                        function zoom(percentage) {
                            var range = timeline.getWindow();
                            var interval = range.end - range.start;

                            timeline.setWindow({
                                start: range.start.valueOf() - interval * percentage,
                                end: range.end.valueOf() + interval * percentage
                            });
                        }

                        function resizedw() {
                            $('#tweet').css({opacity: 0, "z-index": -1});
                            var options = {
                                dataAttributes: ['text', 'id', 'username'],
                                height: 600,
                                showCurrentTime: true,
                                autoResize: true
                            };
                            timeline.setOptions(options);
                            var chart = new google.visualization.LineChart(document.getElementById('chart'));
                            chart.draw(data, options);
                        }

                        var doit;
                        window.onresize = function () {
                            clearTimeout(doit);
                            doit = setTimeout(resizedw, 100);
                        };

                        $('#ff-search').on("keyup", "#query", function (e) {
                            if (e.keyCode === 13) {
                                parse_search();
                            }
                        });
                        $('.icon-search').click(function (e) {
                            parse_search();
                        });
                        function parse_search() {
                            $('#tweet').css({opacity: 0, "z-index": -1});
                            $('.vis-selected').removeClass('vis-selected');
                            var query_param = document.getElementById("query").value;
                            if (query_param !== "") {
                                $("#ff-search input[type='text']").addClass("searchon");

                                var gap = 0;
                                if (timeline.getVisibleItems().length !== json.tweets.length) {
                                    timeline.fit();
                                    gap = 600;
                                }

                                setTimeout(function () {
                                    $('.vis-box').css('opacity', '0.2');
                                    $('.vis-box').each(function (i, obj) {
                                        if ($(this).attr('data-text').indexOf(query_param) !== -1) {
                                            $(this).css('opacity', '1');
                                        }
                                    });
                                }, gap);
                            }
                        }

                        $('.icon-clear').click(function () {
                            $('#tweet').css({opacity: 0, "z-index": -1});
                            $('.vis-selected').removeClass('vis-selected');
                            document.getElementById("query").value = "";
                            $("#ff-search").find("input[type='text']").removeClass("searchon");
                            var gap = 0;
                            if (timeline.getVisibleItems().length !== json.tweets.length) {
                                timeline.fit();
                                gap = 600;
                            }
                            setTimeout(function () {
                                $('.vis-box').css('opacity', '1');
                            }, gap);

                        });
                        $('#timeline').show();

                        $('#loading_all,#cover,#cover_timeline,#loading_timeline').remove();
                        if (!(($('#video_id').text === "") && ($('#fb_video_title').text === ""))) {
                            $('#cover_info,#loading_info').show();
                        }
                    }
                    else {
                        for (v = items.length; (v < json.tweets.length && v < max_tweets); v++) {
                            items.add({
                                "id": json.tweets[v].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json.tweets[v].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json.tweets[v].created_at).getTime(),
                                "text": json.tweets[v].text,
                                "username": json.tweets[v].user.screen_name
                            });
                        }
                        if (v === 10) {
                            $('#alert_twitter_overflow').stop().slideDown();
                        }
                        timeline.setData(items);
                        if (json.upload_time !== 0) {
                            timeline.setCurrentTime(json.upload_time);
                        }
                    }
                }
                else {
                    if (json.processing_status === "done") {
                        abort_tw();
                        $('#timeline').show();
                        new vis.Timeline(document.getElementById('visualization'), new vis.DataSet([]), {
                            height: 600,
                            showCurrentTime: false,
                            zoomable: false,
                            moveable: false
                        });
                        $('#loading_all,#cover,#cover_timeline,#loading_timeline').remove();
                        $('.vis-timeline').append('<div id="timeline_cover"><h2>Zero Tweets</h2></div>');
                        $('#visualization,.box-pad-header').css('border', '0');
                    }
                }
                if (json.processing_status === "done") {
                    abort_tw();
                    clearInterval(interval_twitter);
                    interval_twitter = false;
                    $('#alert_twitter').hide();
                    if (more_items = "more") {
                        $('#navigation p').click();
                    }
                }
            },
            error: function (e) {
            }
        });
    }, 2000);

}
$(document).mouseup(function (e) {
    var container = $("#visualization");
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // not link to fake
    {
        $('#tweet').css({opacity: 0, "z-index": -1});
        $('.vis-selected').removeClass('vis-selected');
    }
});
$('#more_tweets').click(function () {
    $('#alert_twitter_overflow').slideUp();
    max_tweets = 10000;
    if (!interval_twitter) {//den trexei to interval
        load_twitter("more");
    }
});