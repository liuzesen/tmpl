(function(window) {
	'use strict';

	var cacheTemplates = {};
	
	var isDefined = function(o) { return typeof o !== 'undefined'; };

	var keys = {
		'break': true,
		'delete': true, 
		'function': true,
		'return': true,
		'typeof': true,  
		'case': true,
		'do': true, 
		'if': true, 
		'switch': true,
		'var': true,  
		'catch': true,
		'else': true,
		'in': true,
		'this': true,
		'void': true, 
		'continue': true,
		'false': true,
		'instanceof': true,
		'throw': true,
		'while': true,  
		'debugger': true,
		'finally': true,
		'new': true,
		'true': true,
		'with': true,  
		'default': true,
		'for': true,
		'null': true,
		'try': true
	};
	var keyValue = /\s*([a-zA-Z$_][0-9a-zA-Z$_]*)/g, // 匹配原生语句中等号右边的对象名称
		bracket = /(<%=|<%)(\s*)(.*?)(\s*%>)/g; // 匹配<%= %> 或者 <% %>

	var parsing = function(tmpl) {
		var needClose = false,
			headCode = '\'use strict\'; var ',
			outCode = 'out="";',
			mainCode = '',
			endCode = '\nreturn out;';

		var parseNativeCode = function(nativeCode) {
			nativeCode.replace(/\\[\'"]/g, '')
					  .replace(/'.*?'/g, '')
					  .replace(/".*?"/g, '')
					  .replace(keyValue, function(full, key) {
				if (!keys[key]) {
					headCode += key + '=$$data.' + key + ',';
					keys[key] = true;
				}
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
				mainCode += 'out+=' + (needClose ? '' : '$$data.') + capture + ';';
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