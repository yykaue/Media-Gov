(function (win) {
    var docEl = win.document.documentElement;
    var time;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width > 1440) {
            width = 1440;
        } else if (width <= 1000) {
            width = 1000;
        }
        var rem = width / 14.4;
        docEl.style.fontSize = rem + 'px';
    }

    win.addEventListener('resize', function () {
        clearTimeout(time);
        time = setTimeout(refreshRem, 1);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(time);
            time = setTimeout(refreshRem, 1);
        }
    }, false);

    refreshRem();

})(window);
