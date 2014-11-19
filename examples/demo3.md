# 通讯C页面

<div>
	<input type="text" id="txt" size="20" />
	<input id="send_a" type="button" value="发给A" />
</div>
		
<div id="output"></div>

<script>
	require(['{{module}}'], function(localConnect) {
		var listenerServer = null;

		localConnect.init(function(){
			listenerServer = localConnect.createServer('server_c');
			listenerServer.onmessage = function(d){
				$('#output').html("page:"+d.page+"|"+d.data  + '<br>' + $('#output').html());
			}
		});

		//发送消息
		$('#send_a').click(function() {
			localConnect.hasServer('server_a') && localConnect.send('server_a', {
				page: 'c',
				data: $('#txt').val()
			});
		});

	});
</script>
