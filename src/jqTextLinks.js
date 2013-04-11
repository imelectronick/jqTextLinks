(function ($) {
    // predefined settings
    var settings = {
        // expression that finds words that looks like URIs
        // TODO: modify algorithm to replace only plaintext links
        'expression': /(\b(https?|ftp|file):\/\/[-A-ZА-Я0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    };


    // Plugin objects
    var plugins = {};

    // TODO: more flexible priority list
    var pluginsOrder = [];

    var methods = {
        'init': function (options) {
            return this.each(function (){
                $this = $(this);
                var content = $this.html();
                // replace links
                content = content.replace(settings['expression'], function (match, contents, offset, s) {
                    // TODO: before plugin call check link Content-Type (server-side?) and put it into plugin match method
                    // call plugins for each replace match
                    var result = contents;
                    for (i in pluginsOrder) {
                        var pluginName = pluginsOrder[i];
                        var plugin = plugins[pluginName];
                        var matchResult = plugin.match(match, contents, offset, s)
                        // if plugin matches content and replace url then break
                        if (matchResult) {
                            result = matchResult;
                            break;
                        }
                    }
                    return result;
                });
                $this.html(content);
            });
        },
        // global jqTextLink settings methods
        'settings': function (options) {
            $.extend( settings, options);
            return this;

        },
        // TODO: realize priority parameter
        'addPlugin': function (name, plugin, priority) {
            plugins[name] = plugin;
            if (priority) {
                var index = Math.min(priority, pluginsOrder.length)
                pluginsOrder.splice(index, 0, name);
            }
            else {
                pluginsOrder.unshift(name);
            }
            return $.fn.jqTextLinks;
        },
        'removePlugin': function (name) {
            var index = $.inArray(name, pluginsOrder);
            if (index >= 0) {
                pluginsOrder.splice(index, 1);
                delete plugins[name];
            }
            return $.fn.jqTextLinks;
        }
    };

    $.fn.jqTextLinks = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.jqTextLinks' );
        }
    };
})(jQuery);


(function ($) {
    // register base plugins

    // image links
    var jqtlImg = (function () {
        var settings = {'image-class': 'embed-image', 'link-class': 'embed-link', 'link-target': '_blank'};
        var match = function (match, contents, offset, s) {
            var match_img = match.match(/\.(jpg|png|gif|jpeg)\/*$/i);
            if (match_img != null && match_img.length) {
                return '<img class="'+settings['image-class']+'" src="'+match+'"><a class="'+settings['link-class']+'" href="'+match+'" target="'+settings['link-target']+'">'+shortText(match)+'</a><br>';
            }
        }
        return {'match': match};
    })();
    $.fn.jqTextLinks('addPlugin', 'img', jqtlImg);

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

    // other links
    var jqtlLink = (function () {
        var settings = {'link-class': 'embed-link', 'link-target': '_blank'};
        var match = function (match, contents, offset, s) {
            return '<a class="'+settings['link-class']+'" href="'+match+'" target="'+settings['link-target']+'">'+shortText(match)+'</a>';
        }
        return {'match': match};
    })();
    // Add plugin to end of priority list
    $.fn.jqTextLinks('addPlugin', 'link', jqtlLink, 1000);

    var textMaxLength = 32;
    // link text shorter
    var shortText = function (text) {
        if (text.length > textMaxLength) {
            return text.substr(0, textMaxLength-10)+'...'+text.substr(-6);
        }
        return text;
    };
})(jQuery);