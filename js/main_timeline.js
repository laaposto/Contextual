var items, timeline;
var first_call = true;
function load_twitter(more_items, source, json, type) {
    if (type === "video") {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + json.media_id + '/tweets',
            success: function (json_inner) {
                if (source === "twitter") {
                    $('#alert_twitter_user').slideDown();
                }

                if (json_inner.tweets.length > 0) {
                    if (first_call) {
                        first_call = false;
                        $('#more_tweets').attr('data-media', json.media_id).attr('data-job', json.id);
                        var data = [];
                        for (var i = 0; i < json_inner.tweets.length; i++) {
                            data.push({
                                "id": json_inner.tweets[i].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json_inner.tweets[i].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json_inner.tweets[i].created_at).getTime(),
                                "text": json_inner.tweets[i].text,
                                "username": json_inner.tweets[i].user.screen_name
                            });
                        }
                        if (json_inner.tweets.length < 10 && json.sproc.status_tweet_shares !== "done") {
                            $('#alert_twitter').slideDown();
                        }
                        if (json_inner.pagination.total_tweets > 10) {
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
                        if (json_inner.upload_time !== "") {
                            var first_part_date = json_inner.upload_time.split(',')[0].split('-');
                            var date = first_part_date[0] + '-' + first_part_date[1] + "-" + first_part_date[2];
                            var date_unix = (date + '' + json_inner.upload_time.split(',')[1]);
                            timeline.setCurrentTime(new Date(date_unix).getTime() - 7230000);
                        }
                        timeline.on('rangechange', function () {
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
                                if (timeline.getVisibleItems().length !== json_inner.tweets.length) {
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
                            if (timeline.getVisibleItems().length !== json_inner.tweets.length) {
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
                        for (var v = items.length; (v < json_inner.tweets.length); v++) {
                            items.add({
                                "id": json_inner.tweets[v].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json_inner.tweets[v].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json_inner.tweets[v].created_at).getTime(),
                                "text": json_inner.tweets[v].text,
                                "username": json_inner.tweets[v].user.screen_name
                            });
                        }
                        if (json_inner.pagination.total_tweets > 10) {
                            $('#alert_twitter_overflow').stop().slideDown();
                        }
                        timeline.setData(items);
                        if (json_inner.upload_time !== "") {
                            var first_part_date = json_inner.upload_time.split(',')[0].split('-');
                            var date = first_part_date[0] + '-' + first_part_date[1] + "-" + first_part_date[2];
                            var date_unix = (date + '' + json_inner.upload_time.split(',')[1]);
                            timeline.setCurrentTime(new Date(date_unix).getTime() - 7230000);
                        }
                    }
                }
                else {
                    if ((json.sproc.status_tweet_shares === "done") && (!($("#timeline_cover").length))) {
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
            },
            error: function (e) {
            }
        });
    }
    else {
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/images/reports/' + json.media_id + '/tweets',
            success: function (json_inner) {
                if (source === "twitter") {
                    $('#alert_twitter_user').slideDown();
                }

                if (json_inner.tweets.length > 0) {
                    if (first_call) {
                        first_call = false;
                        $('#more_tweets').attr('data-media', json.media_id).attr('data-job', json.id);
                        var data = [];
                        for (var i = 0; i < json_inner.tweets.length; i++) {
                            data.push({
                                "id": json_inner.tweets[i].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json_inner.tweets[i].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json_inner.tweets[i].created_at).getTime(),
                                "text": json_inner.tweets[i].text,
                                "username": json_inner.tweets[i].user.screen_name
                            });
                        }
                        if (json_inner.tweets.length < 10 && json.sproc.status_tweet_shares !== "done") {
                            $('#alert_twitter').slideDown();
                        }
                        if (json_inner.pagination.total_tweets > 10) {
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
                        if (json_inner.upload_time !== "") {
                            var first_part_date = json_inner.upload_time.split(',')[0].split('-');
                            var date = first_part_date[0] + '-' + first_part_date[1] + "-" + first_part_date[2];
                            var date_unix = (date + '' + json_inner.upload_time.split(',')[1]);
                            timeline.setCurrentTime(new Date(date_unix).getTime() - 7230000);
                        }
                        timeline.on('rangechange', function () {
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
                                if (timeline.getVisibleItems().length !== json_inner.tweets.length) {
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
                            if (timeline.getVisibleItems().length !== json_inner.tweets.length) {
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
                        for (var v = items.length; (v < json_inner.tweets.length); v++) {
                            items.add({
                                "id": json_inner.tweets[v].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json_inner.tweets[v].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json_inner.tweets[v].created_at).getTime(),
                                "text": json_inner.tweets[v].text,
                                "username": json_inner.tweets[v].user.screen_name
                            });
                        }
                        if (json_inner.pagination.total_tweets > 10) {
                            $('#alert_twitter_overflow').stop().slideDown();
                        }
                        timeline.setData(items);
                        if (json_inner.upload_time !== "") {
                            var first_part_date = json_inner.upload_time.split(',')[0].split('-');
                            var date = first_part_date[0] + '-' + first_part_date[1] + "-" + first_part_date[2];
                            var date_unix = (date + '' + json_inner.upload_time.split(',')[1]);
                            timeline.setCurrentTime(new Date(date_unix).getTime() - 7230000);
                        }
                    }
                }
                else {
                    if ((json.sproc.status_tweet_shares === "done") && (!($("#timeline_cover").length))) {
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
            },
            error: function (e) {
            }
        });
    }


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
var interval_twitter_more;
$('#more_tweets').click(function () {
    $('#alert_twitter_overflow').slideUp();
    interval_twitter_more = setInterval(function () {
        load_twitter_more();
    }, 1000);

});
function load_twitter_more() {

    if (($('.table_title').eq(0).text() === "IMAGE")){
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/images/jobs/' + $('#more_tweets').attr('data-job'),
            dataType: 'json',
            success: function (json) {
                $.ajax({
                    type: 'GET',
                    url: 'https://caa.iti.gr/caa/api/v4/images/reports/' + $('#more_tweets').attr('data-media') + '/tweets?ntweets=10000',
                    success: function (json_tweets) {
                        for (var v = items.length; (v < json_tweets.tweets.length); v++) {
                            items.add({
                                "id": json_tweets.tweets[v].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json_tweets.tweets[v].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json_tweets.tweets[v].created_at).getTime(),
                                "text": json_tweets.tweets[v].text,
                                "username": json_tweets.tweets[v].user.screen_name
                            });
                        }
                        timeline.setData(items);

                        $('#alert_twitter').slideDown();
                    },
                    error: function (e) {
                    }
                });
            }
        });
    }
    else{
        $.ajax({
            type: 'GET',
            url: 'https://caa.iti.gr/caa/api/v4/videos/jobs/' + $('#more_tweets').attr('data-job'),
            dataType: 'json',
            success: function (json) {
                $.ajax({
                    type: 'GET',
                    url: 'https://caa.iti.gr/caa/api/v4/videos/reports/' + $('#more_tweets').attr('data-media') + '/tweets?ntweets=10000',
                    success: function (json_tweets) {
                        for (var v = items.length; (v < json_tweets.tweets.length); v++) {
                            items.add({
                                "id": json_tweets.tweets[v].id_str,
                                content: "<img class='tweet_img' src='https://avatars.io/twitter/" + json_tweets.tweets[v].user.screen_name + "' height='32' width='32'>",
                                "start": new Date(json_tweets.tweets[v].created_at).getTime(),
                                "text": json_tweets.tweets[v].text,
                                "username": json_tweets.tweets[v].user.screen_name
                            });
                        }
                        timeline.setData(items);

                        $('#alert_twitter').slideDown();
                    },
                    error: function (e) {
                    }
                });
            }
        });
    }
}