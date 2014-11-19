package{
	import flash.display.Sprite;
	import flash.events.StatusEvent;
	import flash.external.ExternalInterface;
	import flash.net.LocalConnection;
	
	public class myLC extends LocalConnection{
		private var onstatus:String=null;
		public var data:*;
		public function myLC(tgt:Sprite,_onstatus:String,listen:Boolean=true){
			if(listen){
				this.addEventListener(StatusEvent.STATUS,statusHandler);
			}
			this.client=tgt;
			this.onstatus=_onstatus;
			this.allowDomain("*");
			this.allowInsecureDomain("*");
			super();
		}
		private function statusHandler(e:StatusEvent):void {
			var result:String='error';
			switch(e.level) {
				case 'status':
					result='success';
					break;
				default:
					result='failed';
					break;
			}
			if(onstatus){
				ExternalInterface.call(onstatus, result, this.data);
			}
		}
	}
}