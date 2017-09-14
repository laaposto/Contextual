function load_twitter() {
    var first_call = true;
    var items, timeline;
    var interval_twitter = setInterval(function () {
        $.ajax({
            type: 'GET',
            url: 'http://caa.iti.gr:8008/get_twverificationV2?url=' + video_verify,
            success: function (json) {
                $('#alert_twitter').slideDown();
                if (json.processing_status === "done") {
                    clearInterval(interval_twitter);
                    $('#alert_twitter').slideUp();
                }
                if (json.hasOwnProperty("message")) {
                    clearInterval(interval_twitter);
                    $('#alert_twitter').slideUp();
                    $('#empty').show();
                    $('#loading_all,#cover,#cover_info,#loading_info,#cover_timeline,#loading_timeline').remove();
                }
                else {
                    if (json.tweets.length > 0) {
                        if (first_call) {
                            first_call = false;
                            var data = [];
                            for (var i = 0; i < json.tweets.length; i++) {
                                data.push({
                                    "id": json.tweets[i].id_str,
                                    content: "<img class='tweet_img' src='https://twitter.com/" + json.tweets[i].user.screen_name + "/profile_image?size=normal' height='32' width='32'>",
                                    "start": new Date(json.tweets[i].created_at).getTime(),
                                    "text": json.tweets[i].text,
                                    "fake": json.tweets[i].fake
                                });
                            }

                            var container = document.getElementById('visualization');
                            items = new vis.DataSet(data);
                            var options = {
                                dataAttributes: ['text', 'id', 'fake'],
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
                                twttr.widgets.createTweet(
                                    '' + properties.items[0], tweet,
                                    {
                                        conversation: 'none',    // or all
                                        cards: 'visible',  // or visible
                                        theme: 'light'    // or dark
                                    })
                                    .then(function (el) {
                                        if ($('#tweet').height() === 0) {//wrong tweet ID
                                            $('#tweet').css('border-color', '#c2e1f5');
                                            $('#tweet').css({
                                                left: properties.event.srcEvent.clientX + 75 - properties.event.srcEvent.layerX,
                                                top: properties.event.srcEvent.pageY - 49 - properties.event.srcEvent.layerY,
                                                opacity: 1,
                                                "z-index": 3
                                            }).removeClass().addClass('middle_left_arrow');
                                            $('#tweet').append('<p class="tweet_p">Wrong Id or Tweet was deleted</p>');
                                            if (properties.event.srcEvent.clientX + 68 - properties.event.srcEvent.layerX + 408 > $(window).width()) {
                                                $('#tweet').css({
                                                    left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                    top: properties.event.srcEvent.pageY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 16,
                                                    opacity: 1,
                                                    "z-index": 3
                                                }).removeClass().addClass('middle_right_arrow');
                                            }
                                        }
                                        else {
                                            if (properties.event.target.offsetParent.attributes[2].value === "fake") {
                                                $('#tweet').css('border-color', 'rgb(229,0,0)');
                                                $('#tweet').css({
                                                    left: properties.event.srcEvent.clientX + 75 - properties.event.srcEvent.layerX,
                                                    top: properties.event.srcEvent.pageY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 16,
                                                    opacity: 1,
                                                    "z-index": 21
                                                }).removeClass().addClass('middle_left_arrow middle_left_arrow_red');
                                                if ((properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) && (properties.event.srcEvent.clientX + 68 - properties.event.srcEvent.layerX + 408 > $(window).width())) {
                                                    $('#tweet').css({
                                                        left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                        top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('bottom_right_arrow bottom_right_arrow_red');
                                                }
                                                else if (properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) {
                                                    $('#tweet').css({
                                                        top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('bottom_left_arrow bottom_left_arrow_red');
                                                }
                                                else if (properties.event.srcEvent.clientX + 73 - properties.event.srcEvent.layerX + 408 > $(window).width()) {
                                                    $('#tweet').css({
                                                        left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('middle_right_arrow middle_right_arrow_red');
                                                }
                                            }
                                            else {
                                                $('#tweet').css('border-color', 'rgb(44,160,0)');
                                                $('#tweet').css({
                                                    left: properties.event.srcEvent.clientX + 75 - properties.event.srcEvent.layerX,
                                                    top: properties.event.srcEvent.pageY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 16,
                                                    opacity: 1,
                                                    "z-index": 21
                                                }).removeClass().addClass('middle_left_arrow middle_left_arrow_green');
                                                if ((properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) && (properties.event.srcEvent.clientX + 68 - properties.event.srcEvent.layerX + 408 > $(window).width())) {
                                                    $('#tweet').css({
                                                        left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                        top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('bottom_right_arrow bottom_right_arrow_green');
                                                }
                                                else if (properties.event.srcEvent.clientY - ($('#tweet').height() / 2) - properties.event.srcEvent.layerY + 25 > $(window).height() - $('#tweet').height()) {
                                                    $('#tweet').css({
                                                        top: properties.event.srcEvent.pageY - $('#tweet').height() - properties.event.srcEvent.layerY + 48,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('bottom_left_arrow bottom_left_arrow_green');
                                                }
                                                else if (properties.event.srcEvent.clientX + 73 - properties.event.srcEvent.layerX + 408 > $(window).width()) {
                                                    $('#tweet').css({
                                                        left: properties.event.srcEvent.clientX + 58 - properties.event.srcEvent.layerX - 504,
                                                        opacity: 1,
                                                        "z-index": 21
                                                    }).removeClass().addClass('middle_right_arrow middle_right_arrow_green');
                                                }
                                            }
                                        }
                                    });
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
                                    dataAttributes: ['text', 'id'],
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
                            $('.tweets_bar').click(function () {
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
                                    $('.vis-box').css('opacity', '0.2');
                                    $('.vis-box').each(function (i, obj) {
                                        if ($(this).attr('data-fake') === "real") {
                                            $(this).css('opacity', '1');
                                        }
                                    });
                                }, gap);
                            });
                            $('#fake_tweet_bar').click(function (e) {
                                e.stopPropagation();
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
                                    $('.vis-box').css('opacity', '0.2');
                                    $('.vis-box').each(function (i, obj) {
                                        if ($(this).attr('data-fake') === "fake") {
                                            $(this).css('opacity', '1');
                                        }
                                    });
                                }, gap);
                            });
                            setTimeout(function () {
                                $('.vis-foreground .vis-group .vis-item').each(function () {
                                    if ($(this).attr('data-fake') === "fake") {
                                        $('.vis-axis .vis-group .vis-dot').eq($(this).index()).css('border-color', 'rgb(229,0,0)');
                                        $('.vis-background .vis-group .vis-line').eq($(this).index()).css('border-color', 'rgb(229,0,0)');
                                    }
                                    else {
                                        $('.vis-axis .vis-group .vis-dot').eq($(this).index()).css('border-color', 'rgb(44,160,0)');
                                        $('.vis-background .vis-group .vis-line').eq($(this).index()).css('border-color', 'rgb(44,160,0)');
                                    }
                                });
                            }, 500);
                            $('#timeline').show();

                            setTimeout(function () {
                                var fake_tweets = json.aggregate_stats.number_of_fake_tweets;
                                var real_tweets = json.aggregate_stats.number_of_real_tweets;
                                var total_tweets = fake_tweets + real_tweets;
                                var percentage_fake = Math.round((fake_tweets / total_tweets) * 100);
                                $('#fake_tweet_bar').css('width', percentage_fake + '%');
                                $('#total_tweets').text(total_tweets);
                                $('#fake_tweets_num').html(fake_tweets);
                                $('#real_tweets_num').html(real_tweets);
                            }, 100);

                            $('#loading_all,#cover,#cover_timeline,#loading_timeline').remove();
                            if (!(($('#video_id').text === "") && ($('#fb_video_title').text === ""))) {
                                $('#cover_info,#loading_info').show();
                            }
                        }
                        else {
                            for (var v = items.length; v < json.tweets.length; v++) {
                                items.add({
                                    "id": json.tweets[v].id_str,
                                    content: "<img class='tweet_img' src='https://twitter.com/" + json.tweets[v].user.screen_name + "/profile_image?size=normal' height='32' width='32'>",
                                    "start": new Date(json.tweets[v].created_at).getTime(),
                                    "text": json.tweets[v].text,
                                    "fake": json.tweets[v].fake
                                });
                            }
                            timeline.setData(items);
                            if (json.upload_time !== 0) {
                                timeline.setCurrentTime(json.upload_time);
                            }
                            setTimeout(function () {
                                $('.vis-foreground .vis-group .vis-item').each(function () {
                                    if ($(this).attr('data-fake') === "fake") {
                                        $('.vis-axis .vis-group .vis-dot').eq($(this).index()).css('border-color', 'rgb(229,0,0)');
                                        $('.vis-background .vis-group .vis-line').eq($(this).index()).css('border-color', 'rgb(229,0,0)');
                                    }
                                    else {
                                        $('.vis-axis .vis-group .vis-dot').eq($(this).index()).css('border-color', 'rgb(44,160,0)');
                                        $('.vis-background .vis-group .vis-line').eq($(this).index()).css('border-color', 'rgb(44,160,0)');
                                    }
                                });
                            }, 500);
                            setTimeout(function () {
                                var fake_tweets = json.aggregate_stats.number_of_fake_tweets;
                                var real_tweets = json.aggregate_stats.number_of_real_tweets;
                                var total_tweets = fake_tweets + real_tweets;
                                var percentage_fake = Math.round((fake_tweets / total_tweets) * 100);
                                $('#fake_tweet_bar').css('width', percentage_fake + '%');
                                $('#total_tweets').text(total_tweets);
                                $('#fake_tweets_num').html(fake_tweets);
                                $('#real_tweets_num').html(real_tweets);
                            }, 100);
                        }
                    }
                    else {
                        if (json.processing_status === "done") {
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
                            $('.tweets_bar').css('background-color', 'gray');
                        }
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
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $('#tweet').css({opacity: 0, "z-index": -1});
        $('.vis-selected').removeClass('vis-selected');
    }
});
