$(function(){
	var fontSet = $('#font-set');
	var lineSet = $('#line-set');
	var lineStyle = {'lineWidth':1, 'fillStyle':'#000'};//默认线条样式
	var fontStyle = {'font':"20px Consolas,Courier,monospace", 'fillStyle':'#000'};//默认字体样式

	//绘图工具默认的a标签跳转屏蔽
	$('.draw').click(function(){return false;});

	//样式选择器点击事件封装
	$('.draw').bind('click', function(){
		var top = $(this).get(0).offsetTop;
		var left = $(this).get(0).offsetLeft;
		if($(this).hasClass('font')){
			drawSetToggle(fontSet, {'left':left, 'top':top-50});
			drawSetHide(lineSet);
		}else{
			drawSetToggle(lineSet, {'left':left, 'top':top-50});
			drawSetHide(fontSet);
		}
	});

	

	//样式选择器隐藏
	function drawSetHide(dom){
		dom.css('display', 'none');
	}

	//样式选择器显示
	function drawSetShow(dom, position){
		dom.css({"position":"absolute", 'display':"inline-block", 'left':position.left, 'top':position.top});
	}

	//样式选择器切换
	function drawSetToggle(dom, position){
		if(dom.css('display') === 'none'){
			drawSetShow(dom, position);
		}else{
			drawSetHide(dom);
		}
	}
});