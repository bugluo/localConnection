##使用说明

###简介
通过flash进行同一浏览器跨页面，跨内核的通讯。

###外链形式

```html
<script src="/module/localConnect/1.0.0/localConnect.js"></script>

<script>
    localConnect.init();
</script>

```

###模块加载形式

```html
<script>
    require(['/module/localConnect/1.0.0/localConnect.js'], function(localConnect) {
        localConnect.init();
    });
</script>
```

##文档参考

###全局对象

**localConnect**  必须有全局对象是为了让flash可调用

###方法

**init(handle)**

初始化flash文件，参数handle为flash初始化成功后的回调。

**createServer(serverName)**

创建一个server，返回server={close()，onmessage()}对象。

<b style="color:red;">一个页面只能创建一个server，且serverName需全局唯一。</b>

**send(serverName, data, callback)**

向指定的serverName发送消息。

callback为消息发送后的回调，参数(status, data)，status：接收状态，data：发送的数据。//回调不可靠，后续考虑是否可优化

**getServer(serverName)**

返回可向指定server发送信息的server={post(data, callback)}对象。该方法是对send的一层包装。

**hasServer(serverName)**

判断指定的server是否存在

**isReady()**

判断组件是否可用（主要是flash是否处于可以状态）

<b style="color:red;">ps:因flash的init有延时，所以建议将使用localConnect方法的逻辑放入init的handle里</b>

