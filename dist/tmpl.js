!function(t){"use strict";var e={},n=function(t){return"undefined"!=typeof t},i={"break":!0,"delete":!0,"function":!0,"return":!0,"typeof":!0,"case":!0,"do":!0,"if":!0,"switch":!0,"var":!0,"catch":!0,"else":!0,"in":!0,"this":!0,"void":!0,"continue":!0,"false":!0,"instanceof":!0,"throw":!0,"while":!0,"debugger":!0,"finally":!0,"new":!0,"true":!0,"with":!0,"default":!0,"for":!0,"null":!0,"try":!0},r=/\s*([a-zA-Z$_][0-9a-zA-Z$_]*)/g,o=/(<%=|<%)(\s*)(.*?)(\s*%>)/g,s=function(t){var e="'use strict'; var ",n='out="";',s="",c="\nreturn out;",u=function(t){t.replace(/\\[\'"]/g,"").replace(/'.*?'/g,"").replace(/".*?"/g,"").replace(r,function(t,n){i[n]||(e+=n+"=$$data."+n+",",i[n]=!0)})},a=function(e,n){s+="out+='"+t.substring(e,n).replace("'","\\'").replace(/[\r\t\n]/g,"")+"';"},l=0;return t.replace(o,function(t,e,n,i,r,o){a(l,o),u(i),3===e.length?s+="out+="+i+";":2===e.length&&(s+=i),l=o+e.length+n.length+i.length+r.length}),a(l,t.length),new Function("$$data",e+n+s+c)},c=function(t,i){var r={id:t,cache:!0};if(i)for(var o in r)n(i[o])&&(r[o]=i[o]);this.opts=r,this.tmpl=document.getElementById(t).innerHTML,e[this.opts.id]=this.opts.cache?s(this.tmpl,this.opts):""};c.prototype.render=function(t){return e[this.opts.id]?e[this.opts.id](t):s(this.tmpl,this.opts)(t)},t.Tmpl=c}(window);