(function ($) {
    // youtube links
    var jqtlYoutube = (function () {
        var settings = {'iframe-class': 'embed-youtube'};
        var match = function (match, contents, offset, s) {
            var match_vid = match.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
            if (match_vid != null && match_vid.length) {
                return '<iframe class="'+settings['iframe-class']+'" type="text/html" width="'+settings['embed-max-width']+'" height="'+settings['embed-max-height']+'" \
                    src="http://www.youtube.com/embed/'+match_vid[1]+'?autoplay=0" \
                    frameborder="0"/>';
            }
        }
        return {'match': match};
    })();
    $.fn.jqTextLinks('addPlugin', 'youtube', jqtlYoutube);
})(jQuery);