// -----------------------------------------------------------------------
// printThis v1.0
// Printing plug-in for jQuery
//
// Resources (based on) :
//              jPrintArea: http://plugins.jquery.com/project/jPrintArea
//              jqPrint: https://github.com/permanenttourist/jquery.jqprint
//              Ben Nadal: http://www.bennadel.com/blog/1591-Ask-Ben-Print-Part-Of-A-Web-Page-With-jQuery.htm
//
// Dual licensed under the MIT and GPL licenses:
//              http://www.opensource.org/licenses/mit-license.php
//              http://www.gnu.org/licenses/gpl.html
//
// (c) Jason Day 2012
//
//------------------------------------------------------------------------


(function($) {
    var opt;

    $.fn.printThis = function (options) {
        opt = $.extend({}, $.fn.printThis.defaults, options);

        var $element = (this instanceof jQuery) ? this : $(this);

        if ($.browser.opera)
        {
            var tab = window.open("","Print Preview");
            tab.document.open();

            var doc = tab.document;
        }
        else
        {
	    var strFrameName = ("printThis-" + (new Date()).getTime());
	    
            var $iframe = $("<iframe id=" + strFrameName +"/>");

            if (!opt.debug) { $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" }); }

            $iframe.appendTo("body");
            var doc = $iframe[0].contentWindow.document;
        }

        if (opt.importCSS)
        {
			$("link[rel=stylesheet]").each(function(){
           		var href = $(this).attr('href');
           		if(href){
					var media = $(this).attr('media') || 'all';
					doc.write("<link type='text/css' rel='stylesheet' href='" + href + "' media='"+media+"'>");
				}
            });
        }
	
	if (opt.loadCSS)
	{
	    doc.write("<link type='text/css' rel='stylesheet' href='" + opt.loadCSS + "'>");
	    
	}

        if (opt.printContainer) { doc.write($element.outer()); }
        else { $element.each( function() { doc.write($(this).html()); }); }

        doc.close();

        ($.browser.opera ? tab : $iframe[0].contentWindow).focus();
        setTimeout( function() { ($.browser.opera ? tab : $iframe[0].contentWindow).print(); if (tab) { tab.close(); } }, 1000);
	
	//removed iframe after 60 seconds
	setTimeout(
	    function(){
	    $iframe.remove();
	    },
	    (60 * 1000)
	    );
    }

    $.fn.printThis.defaults = {
		debug: false,
		importCSS: true,
		printContainer: true,
		loadCSS: ""
	};

    
    jQuery.fn.outer = function() {
      return $($('<div></div>').html(this.clone())).html();
    }
})(jQuery);