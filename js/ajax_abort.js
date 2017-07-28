var xhrPool_yt = [];
$(document).ajaxSend(function (e, jqXHR, options) {
    if (options.url.indexOf('/get_ytverification') > -1) {
        xhrPool_yt.push(jqXHR);
    }
});
$(document).ajaxComplete(function (e, jqXHR, options) {
    if (options.url.indexOf('/get_ytverification') > -1) {
        xhrPool_yt = $.grep(xhrPool_yt, function (x) {
            return x != jqXHR
        });
    }
});
var abort_yt = function () {
    $.each(xhrPool_yt, function (idx, jqXHR) {
        jqXHR.abort();
    });
};
