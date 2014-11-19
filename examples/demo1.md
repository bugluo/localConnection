# 通讯A页面

A通过iframe引入B

A和C是相互独立的页面

对于有A必有B，可以使用getServer获取向B发送消息的对象，方便以后操作。

对于有A不一定有C的情况，每次发送消息前都应该判断C是否存在

<iframe name="B_IFRAME" src="" scrolling="yes" width="800" height="500"></iframe>

<div>
	<input type="text" id="txt" size="20" />
	<input id="send_b" type="button" value="发给iframe|B" />
	<input id="send_c" type="button" value="发给C" />
</div>
		
<div id="output"></div>

<script>
	var query = location.search.queryUrl();
	query.file = "demo2.md";
	var url = location.protocol+"//"+location.host+location.pathname+'?'+Object.encodeURIJson(query);
	$('iframe[name=B_IFRAME]').attr('src', url);
	
	require(['{{module}}'], function(localConnect) {
		var listenerServer = null;
		var postServerB = null;

		localConnect.init(function(){
			listenerServer = localConnect.createServer('server_a');
			listenerServer.onmessage = function(d){
				$('#output').html("page:"+d.page+"|"+d.data  + '<br>' + $('#output').html());
			}

			var timer = setInterval(function(){
				if (localConnect.hasServer('server_b')) {
					postServerB = localConnect.getServer('server_b');
					clearInterval(timer);
				}
			}, 100);
		});

		//发送消息
		$('#send_b').click(function() {
			if(postServerB) {
				postServerB.post({
					page: 'a',
					data: $('#txt').val()
				});
			} else {
				alert('B页面未初始化');
			}
		});

		//发送消息
		$('#send_c').click(function() {
			if(localConnect.hasServer('server_c')){
				localConnect.send('server_c', {
					page: 'a',
					data: $('#txt').val()
				}, function(status, data){
					//回调不可靠，后续考虑是否可优化
					//$('#output').html("消息已发送给C.接收状态："+status+"|发送的数据"+Object.stringify(data)  + '<br>' + $('#output').html());
				});
			} else {
				alert('C页面未未初始化');
			}
		});

	});
</script>
