# tmpl
小巧的模板引擎，仅支持原生的模板语言，功能比较单一

##API
### new Tmpl(domId, options)
模板对象，代表每一个需要操作的模板。

domId: 模板字符串所在的script标签的ID。

options: { cache: true | false }，cache默认为true。

配置对象。

示例：
```html
	<script id="template" type="text/tmpl">
	<% if (title === 'liuzesen') { %>
		<h1>I have the head</h1>
	<% } %>
	<h1><%=title%></h1>
	<ul>
	    <% for (var i = 0, l = list.length; i < l; i ++) { %>
	        <li>用户: <%=list[i].user %> / 网站：<%=list[i].site%></li>
	    <% } %>
	</ul>
	<h2><%= end %></h2>
	</script>
```

以上是模板，以下是代码：

```js
var tmpl = new Tmpl('template');
```

### tmpl.render(data)
模板对象唯一的方法，用于渲染数据返回渲染后的字符串。

data: JSON字面量。

示例：
```
var data = {
    list: []
};
for (var i = 0; i < length; i ++) {
    data.list.push({
        index: i,
        user: '<strong style="color:blue;">Test</strong>',
        site: 'http://liuzesen.github.io'
    }); 
};
data.title = "liuzesen";
data.end = "end";
data.address = ['广州', '佛山'];
var tmpl = new Tmpl('template');
var tmplStr = tmpl.render(data);
```
以上就是所有的接口。
