(function ($) {
    // image links
    var jqtlImg = (function () {
        var settings = {'image-class': 'embed-image', 'link-class': 'embed-link', 'link-target': '_blank'};
        var match = function (match, contents, offset, s) {
            var match_img = match.match(/\.(jpg|png|gif|jpeg)\/*$/i);
            if (match_img != null && match_img.length) {
                return '<img class="'+settings['image-class']+'" src="'+match+'"><a class="'+settings['link-class']+'" href="'+match+'" target="'+settings['link-target']+'">'+shortText(match)+'</a>';
            }
        }
        return {'match': match};
    })();
    $.fn.jqTextLinks('addPlugin', 'img', jqtlImg);

    var textMaxLength = 32;
    // link text shorter
    var shortText = function (text) {
        if (text.length > textMaxLength) {
            return text.substr(0, textMaxLength-10)+'...'+text.substr(-6);
        }
        return text;
    };
})(jQuery);