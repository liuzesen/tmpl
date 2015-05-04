(function(window) {
	'use strict';

	var cacheTemplates = {};
	
	var isDefined = function(o) { return typeof o !== 'undefined'; };

	var parsing = function(tmpl) {
		var needClose = false;
		var headCode = '\'use strict\'; var ';
		var outCode = 'out="";';
		var mainCode = '';
		var endCode = '\nreturn out;';

		var parseNativeCode = function(nativeCode) {
			nativeCode.replace(/(?:[\w$_]*)\s*=\s*([a-zA-Z$_][\w]*)/g, function(full, key) {
				headCode += key + '=$$data.' + key + ',';
			});
		};

		var parseStaticHtml = function(startPos, lastPos) {
			mainCode += 'out+=\'' + 
						tmpl.substring(startPos, lastPos)
						.replace('\'', '\\\'')
						.replace(/[\r\t\n]/g, '') + '\';';			
		};

		var curPos = 0;
		var regex = /(<%=|<%)(\s*)(.*?)(\s*%>)/g;
		tmpl.replace(regex, function(full, lBracket, white, capture, rBracket, lBracketPos) {
			
			parseStaticHtml(curPos, lBracketPos);

			if (lBracket.length === 3) {
				if (!needClose) {
					headCode += capture + '=$$data.' + capture + ',';
				}
				mainCode += 'out+=' + capture + ';';
			} else if (lBracket.length === 2) {
				if (!needClose) {
					parseNativeCode(capture);
				}
				mainCode += capture;
				needClose = !needClose;
			}

			curPos = lBracketPos + lBracket.length + white.length + capture.length + rBracket.length;
		});
		
		parseStaticHtml(curPos, tmpl.length);

		return new Function('$$data', headCode + outCode + mainCode + endCode);
	};

	var Tmpl = function(domId, opts) {
		var allOpts = {
			id: domId,
			cache: true
		};

		if (opts) {
			for (var i in allOpts) {
				if (isDefined(opts[i])) {
					allOpts[i] = opts[i];
				}
			}
		}
		
		this.opts = allOpts;
		this.tmpl = document.getElementById(domId).innerHTML;
		cacheTemplates[this.opts.id] = this.opts.cache ? parsing(this.tmpl, this.opts) : '';
	};

	Tmpl.prototype.render = function(data) {
		if (cacheTemplates[this.opts.id]) { return cacheTemplates[this.opts.id](data); }
		return parsing(this.tmpl, this.opts)(data);
	};

	window.Tmpl = Tmpl;
})(window);