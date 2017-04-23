#### 项目背景
项目源自于我目前的一个项目需求,之前一直觉得windows画图板也就那样，自己做的时候才发现其实要实现功能很简单，但是写的漂亮可扩展性和冗余度低有些难度，限于本人的技术和代码经验
#### 技术
技术其实没什么好说的，就是js和h5的canvas标签,因为需要一端写一端看，所有数据传递使用客户端轮询的方式，当然这种方式本身有许多缺陷，因此打算写写出一个长连接的版
#### 文件说明
1. 绘图端  
   * server.html页面  
   * css/server.css控制样式  
   * js/server.js控制页面各种事件监听,显示控制
2. 观众端  
   * client.html页面  
   * css/client.css样式  
   * js/client.js控制页面各种事件监听,显示控制
3. 公共部分  
   * js/draw.js 绘图类 
   * js/netutils.js 相当于model层封装，因为这里用到的技术是轮询所以对接口调用进行的封装
   * js/utils.js 工具类 （包括redo,undo时需要的操作队列）
***
如果有什么问题可以[联系我](mailto:1094521382@qq.com)  
资助小码哥写出更好的代码![捐献给小码哥](http://qr.api.cli.im/qr?data=https%253A%252F%252Fmobilecodec.alipay.com%252Fclient_download.htm%253Fqrcode%253DFKX03313YE5YSRWSOKS3DF&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=http%3A%2F%2Foss-cn-hangzhou.aliyuncs.com%2Fpublic-cli%2Ffree%2Fc2425fec16c515700cff9f1f664c6e321492944276.jpg&size=280&kid=cliim&key=8d2df94e52d5c34b161788c11955b777)
