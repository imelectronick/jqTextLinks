(function ($) {
    // predefined settings
    var settings = {
        // expression that finds words that looks like URIs
        // TODO: modify algorithm to replace only plaintext links
        'expression': /(\b(https?|ftp|file):\/\/[-A-ZА-Я0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    };


    // Plugin objects
    var plugins = {};

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
        // TODO: more flexible priority list
        'addPlugin': function (name, plugin, priority) {
            plugins[name] = plugin;
            if (priority) {
                var index = Math.min(priority, pluginsOrder.length)
                pluginsOrder.splice(index, 0, name);
            }
            else {
                // by default add plugin to end of priority list but before link
                var index = pluginsOrder.length-1;
                pluginsOrder.splice(index, 0, name);
            }
            alert();
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
    // register base plugin
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