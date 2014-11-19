package{
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	
	public class local_connect extends Sprite{
		private var conn:myLC;
		private var CONNECT_NAME:String = "_360";
		private var suc:Boolean=false;
		private var onget:String=null,onstatus:String=null;
		private var allow:Array=[];
		private var callback_reg:RegExp=/[^a-zA-Z0-9\_\$\.\-\|]/g;
		public function local_connect(){
			Security.allowDomain('*');
			Security.allowInsecureDomain('*');
			init();
		}
		private function init():void{
			conn = new myLC(this,onstatus);
			
			if(root.loaderInfo.parameters.hasOwnProperty('name')){
				CONNECT_NAME='_'+name;
			}
			if(root.loaderInfo.parameters.hasOwnProperty("opener")){
				send(root.loaderInfo.parameters.opener,'ok');
			}
			
			ExternalInterface.addCallback('connect',connect);
			ExternalInterface.addCallback('playerready',check);
			ExternalInterface.addCallback('send',send);
			ExternalInterface.addCallback('close',close);
			
			ExternalInterface.addCallback('flashready',flashReady);
			if(root.loaderInfo.parameters.hasOwnProperty("onget")){//注册播放器页接收数据事件
				onget=root.loaderInfo.parameters.onget;
			}
			if(root.loaderInfo.parameters.hasOwnProperty("onstatus")){//注册播放器页接收数据事件
				onstatus=root.loaderInfo.parameters.onstatus;
			}
			if(root.loaderInfo.parameters.hasOwnProperty("onready")){//如果有flash初始化回调函数，则执行回调函数，如果没有，则注册flashready事件，供js轮询
				ExternalInterface.call(root.loaderInfo.parameters.onready);
			}
		}
		private function flashReady():Boolean{
			return true;
		}
		private function close():Boolean{
			try {
				conn.close();
			} catch(e:Error) {
				return false;
			}
			return true;
		}
		private function check(name:String=null):Boolean{
			var _name:String=CONNECT_NAME;
			if(name){
				_name='_'+name;
			}
			try {
				var _conn:myLC=new myLC(this,onstatus,false);
				_conn.connect(_name);
				_conn.close();
			} catch(e:Error) {
				return true;
			}
			return false;
		}
		private function connect(name:String=null,_get:String=null):Boolean{//播放器页调用函数
			var _name:String=CONNECT_NAME;
			if(name){
				_name='_'+name;
			}
			if(_get){
				onget=_get;//二次注册可能
			}
			try {
				conn.connect(_name);
			} catch(e:Error) {
				return false;
			}
			return true;
		}
		private function send(name:String=null,...args):void{//列表页发送数据函数
			var _name:String=CONNECT_NAME;
			if(name){
				_name='_'+name;
			}
			var _conn:myLC=new myLC(this,onstatus);
			_conn.data=[].concat(args).concat(_name.substr(1));
			_conn.send.apply(_conn,[_name,'getConnect'].concat(_conn.data));
		}
		public function getConnect(...args):void {//接收数据函数
			if(onget){
				ExternalInterface.call(onget, args);
			}
		}
	}
}