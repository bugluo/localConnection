(function(){
	var localConnect = {};
	var server = null;
	var swf = null;
	var isInit = false;
	var isReady = false;
	var sendHandleMap = {};
	var readyHandleList = [];
	var readyTimer = null;
	var sendflag=0;//send方法的唯一标识

	function execCbs(){
		clearTimeout(readyTimer);
		if(readyHandleList.length){
			var cb = readyHandleList.shift();
			if(readyHandleList.length) {
				readyTimer = setTimeout(execCbs,0);
			}
			cb();
		}
	}

	localConnect.init = function(handle){
		typeof handle === 'function' && readyHandleList.push(handle);

		if (isInit) {
			isReady && execCbs();
			return;
		}

		var moviePath = "http://p0.qhimg.com/s/t0162d1b4b65b3cccb2.swf";
		var flashvars = "onready=localConnect._ready&amp;onstatus=localConnect._status";
		

		var tmpDiv = document.createElement('div');
		tmpDiv.style.width = 0;
		tmpDiv.style.height = 0;
		tmpDiv.style.position = "absolute";
		tmpDiv.style.left = "-9999px";
		tmpDiv.style.top = "-9999px";

		var body = document.body;
		body.insertBefore(tmpDiv, body.firstChild);
		/*因该flash的api提供方式，需在tmpdiv插入document后插入flash*/
		tmpDiv.innerHTML = "\
		<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" id=\"localConnect\" width=\"0\" height=\"0\"> \
		<param name=\"movie\" value=\"" + moviePath + "\"/> \
		<param name=\"allowScriptAccess\" value=\"always\"/> \
		<param name=\"scale\" value=\"exactfit\"/> \
		<param name=\"loop\" value=\"false\"/> \
		<param name=\"menu\" value=\"false\"/> \
		<param name=\"quality\" value=\"best\" /> \
		<param name=\"bgcolor\" value=\"#ffffff\"/> \
		<param name=\"flashvars\" value=\"" + flashvars + "\"/> \
		<embed src=\"" + moviePath + "\" \
			loop=\"false\" menu=\"false\" \
			quality=\"best\" bgcolor=\"#ffffff\" \
			width=\"0\" height=\"0\" \
			name=\"localConnect\" \
			allowScriptAccess=\"always\" \
			allowFullScreen=\"false\" \
			type=\"application/x-shockwave-flash\" \
			pluginspage=\"http://www.macromedia.com/go/getflashplayer\" \
			flashvars=\"" + flashvars + "\" \
			scale=\"exactfit\"> \
		</embed> \
		</object>";

		swf = document["localConnect"] || tmpDiv.children[0].lastElementChild;

		isInit = true;
	};
	localConnect.send = function(serverName, data, callback){
		if (!isReady) { return false; }

		var t = sendflag++;

		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (typeof callback === 'function') {
			sendHandleMap[t] = callback;
		}

		swf.send(serverName, {
			data: data,
			t: t
		});

		return true;
	};
	localConnect.hasServer = function(serverName){
		return isReady && swf.playerready(serverName);
	};
	localConnect.createServer = function(serverName){
		if (!isReady) { return false; }

		if (server !== null) {
			throw 'localConnect: create server fail, has a server';
		}
		if (localConnect.hasServer(serverName)){
			throw 'localConnect: create server fail, "'+serverName+'" is exist';
		}

		swf.connect(serverName, 'localConnect._onget');
		server = {
			name: serverName,
			close: function(){
				swf.close();
				server = null;
			},
			onmessage: function(data){

			}
		};

		return server;
	};
	localConnect.getServer = function(serverName){
		if (!isReady) { return false; }

		var server = null;
		if (localConnect.hasServer(serverName)) {
			server = {
				post: function(data, callback){
					localConnect.send(serverName, data, callback);
				}
			}
		}

		return server;
	};
	localConnect.isReady = function(){
		return isReady;
	};

	localConnect._status = function(status, data){
		var t = data[0].t;
		if (t in sendHandleMap) {
			sendHandleMap[t](status, data[0].data);
			delete sendHandleMap[t];
		}
	};
	localConnect._onget = function(data){
		try {
			server.onmessage(data[0].data);
		} catch (e) {

		}
	};
	localConnect._ready = function(){
		isReady = true;
		/*因在ie8以下flash会处于未准备好的状态，需延迟执行*/
		readyTimer = setTimeout(execCbs,0);
	};


	if (typeof define === "function" && define.amd) {
		define('module/localConnect/1.0.0/localConnect', function (require, exports, module) {
			return localConnect;
		});
	}

	// 必须要有全局对象，以方便flash调用
	this['localConnect'] = localConnect;
}).call(this);