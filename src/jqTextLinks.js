(function ($) {
    // predefined settings
    var settings = {
        // expression that finds words that looks like URIs
        // TODO: modify algorithm to replace only plaintext links
        'expression': /(\b(https?|ftp|file):\/\/[-A-ZА-ЯЙ0-9+&@#\/%?=~_|!:,.;]*[-A-ZА-ЯЙ0-9+&@#\/%=~_|])/ig
    };


    // Plugin objects
    var plugins = {};

    var pluginsOrder = [];

    var skipNodes = ['A', 'SCRIPT'];
    var recursiveReplace = function (node) {
        node.contents().each(function (index, childNode) {
            if (childNode.nodeType == 3) {
                var content = childNode.nodeValue;
                content = content.replace(settings['expression'], function (match, contents, offset, s) {
                    // TODO: check link Content-Type (server-side?) and put it into plugin match method
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
                $(childNode).replaceWith($('<span>'+content+'</span>').html());
            }
            else if (childNode.nodeType == 1 && $.inArray(childNode.nodeName, skipNodes) === -1) {
                recursiveReplace($(childNode));
            }
        });
    }

    var methods = {
        'init': function (options) {
            return this.each(function (){
                $this = $(this);
                //var content = $this.html();
                // replace links
                recursiveReplace($this);
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