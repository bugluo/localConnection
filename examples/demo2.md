# 通讯B页面

<div>
	<input type="text" id="txt" size="20" />
	<input id="send_a" type="button" value="发给A" />
</div>
		
<div id="output"></div>

<script>
	require(['{{module}}'], function(localConnect) {
		var listenerServer = null;
		var postServerA = null;

		localConnect.init(function(){
			listenerServer = localConnect.createServer('server_b');
			listenerServer.onmessage = function(d){
				$('#output').html("page:"+d.page+"|"+d.data  + '<br>' + $('#output').html());
			};

			var timer = setInterval(function(){
				if (localConnect.hasServer('server_a')) {
					postServerA = localConnect.getServer('server_a');
					clearInterval(timer);
				}
			}, 100);
		});

		//发送消息
		$('#send_a').click(function() {
			postServerA && postServerA.post({
				page: 'b',
				data: $('#txt').val()
			});
		});
	});
</script>
