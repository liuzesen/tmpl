(function(window) {
	'use strict';

	var cacheTemplates = {};
	
	var isDefined = function(o) { return typeof o !== 'undefined'; };

	var keyValue = /(?:[\w$_]*)\s*=\s*([a-zA-Z$_][0-9a-zA-Z$_]*)/g, // 匹配原生语句中等号右边的对象名称
		bracket = /(<%=|<%)(\s*)(.*?)(\s*%>)/g, // 匹配<%= %> 或者 <% %>
		varValue = /[a-zA-Z$_][0-9a-zA-Z$_]*/; // 匹配JS变量名

	var parsing = function(tmpl) {
		var needClose = false,
			headCode = '\'use strict\'; var ',
			outCode = 'out="";',
			mainCode = '',
			endCode = '\nreturn out;';

		var parseNativeCode = function(nativeCode) {
			nativeCode.replace(keyValue, function(full, key) {
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
		tmpl.replace(bracket, function(full, lBracket, white, capture, rBracket, lBracketPos) {
			
			parseStaticHtml(curPos, lBracketPos);

			if (lBracket.length === 3) {
				if (!needClose) {
					var variable = capture.match(varValue)[0];
					headCode += variable + '=$$data.' + variable + ',';
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