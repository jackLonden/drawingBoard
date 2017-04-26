$(function() {
    var fontSet = $('#font-set');
    var lineSet = $('#line-set');
    var brush1 = new CanvasTool('canvas');
    var brush2 = new CanvasTool('can-back');
    var canvas = $('#canvas');
    var ctx = canvas.get(0).getContext('2d');
    var drawData = [];
    var penStart = false;
    var fontarea = $('#fontarea');
    initCanvasSize();
    //初始化页面宽高
    function initCanvasSize() {
        var cwidth = $('#can-holder').width();
        var cheight = $('#can-holder').height();
        canvas.get(0).width = cwidth;
        canvas.get(0).height = cheight;
        document.getElementById('can-back').width = cwidth;
        document.getElementById('can-back').height = cheight;
    }
    //监听画板的状态
    canvas.mousedown(function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var dom = $('.now');
        if (dom.length > 0) {
            setStyle(brush1);
            setStyle(brush2);
            switch (dom.get(0).id) {
                case 'pen':
                    drawData[0] = [x, y];
                    penStart = true;
                    break;
                case 'font':
                    textAreaToggle(x, y);
                    break;
                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    drawData = [
                        [x, y]
                    ];
                    break;
                case 'triangle':
                    if (drawData.length == 0) {
                        drawData[0] = [x, y];
                    }
                    break;
                case 'ellipse':
                    drawData[0] = [x, y];
                    break;
                case 'rect':
                    drawData[0] = [x, y];
                    break;
            }
        } else {
            console.log('画笔类型未知');
        }
    });
    canvas.mousemove(function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var dom = $('.now');
        if (dom.length > 0) {
            brush1.clear({});
            switch (dom.get(0).id) {
                case 'pen':
                    if (penStart) {
                        var last = drawData[drawData.length - 1];
                        if (last != undefined) {
                            brush2.drawLine({ 'p1': last, 'p2': [x, y] });
                            drawData.push([x, y]);
                        }
                    }
                    break;
                case 'font':
                    break;
                case 'line':
                    if (drawData[0] != undefined) {
                        brush1.drawLine({ 'p1': drawData[0], 'p2': [x, y] });
                        drawData[1] = [x, y];
                    }
                    break;
                case 'triangle':
                    if (drawData.length == 1) {
                        brush1.drawLine({ 'p1': drawData[0], 'p2': [x, y] });
                    } else if (drawData.length == 2) {
                        brush1.drawLine({ 'p1': drawData[0], 'p2': [x, y] });
                        brush1.drawLine({ 'p1': drawData[1], 'p2': [x, y] });
                    }
                    break;
                case 'ellipse':
                    if (drawData.length == 1) {
                        brush1.drawEllipse({ 'p1': drawData[0], 'p2': [x, y] });
                    }
                    break;
                case 'rect':
                    if (drawData.length == 1) {
                        brush1.drawRect({ 'p1': drawData[0], 'p2': [x, y] });
                    }
                    break;
            }
        } else {
            console.log('画笔类型未知');
        }
    });

    canvas.mouseup(function(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var dom = $('.now');
        if (dom.length > 0) {
            switch (dom.get(0).id) {
                case 'pen':
                    if (penStart) {
                        var last = drawData[drawData.length - 1];
                        brush2.drawLine({ 'p1': last, 'p2': [x, y] });
                        drawData.push([x, y]);
                    }
                    drawData = [];
                    break;
                case 'font':
                    break;
                case 'line':
                    if (drawData[0] != undefined) {
                        brush2.drawLine({ 'p1': drawData[0], 'p2': [x, y] });
                        drawData[1] = [x, y];
                    }
                    drawData = [];
                    break;
                case 'triangle':
                    if (drawData.length == 1) {
                        brush2.drawLine({ 'p1': drawData[0], 'p2': [x, y] });
                        drawData[1] = [x, y];
                    } else if (drawData.length == 2) {
                        brush2.drawLine({ 'p1': drawData[0], 'p2': [x, y] });
                        brush2.drawLine({ 'p1': drawData[1], 'p2': [x, y] });
                        drawData[2] = [x, y];
                        drawData = [];
                    }
                    break;
                case 'ellipse':
                    if (drawData.length == 1) {
                        brush2.drawEllipse({ 'p1': drawData[0], 'p2': [x, y] });
                        drawData = [];
                    }
                    break;
                case 'rect':
                    if (drawData.length == 1) {
                        brush2.drawRect({ 'p1': drawData[0], 'p2': [x, y] });
                        drawData = [];
                    }
                    break;
            }
        } else {
            console.log('画笔类型未知');
        }
    });

    //文本域切换
    function textAreaToggle(x, y) {
        if (fontarea.hasClass('hide')) {
            fontarea.removeClass('hide');
            fontarea.css({ 'left': x, 'top': y });
        } else {
            fontarea.addClass('hide');
        }
    }

    //文本域resize时间
    fontarea.bind('propertychange', function() {
        console.log(dsadsa);
        console.log(arguments);
    });

    //设置画笔样式
    function setStyle(brush) {
        var style = {
            'lineWidth': $('.line-width-active').index() * 2,
            'strokeStyle': $('#line-preview').get(0).style.backgroundColor,
            'fillStyle': $('.color-picker-active').get(0).style.backgroundColor,
            'fontSize': $('.font-size').val()
        }
        brush.setStyle(style);
    }

    //绘图工具默认的a标签跳转屏蔽
    $('.draw').click(function() {
        return false;
    });

    //样式选择器点击事件封装
    $('.draw').bind('click', function() {
        var top = $(this).get(0).offsetTop;
        var left = $(this).get(0).offsetLeft;
        drawSetToggle($(this), { 'left': left, 'top': top - 50 }, $(this).hasClass('font'));
    });

    //线条粗细选择
    $('#line-set-left li').click(function() {
        $('#line-set-left li').removeClass('line-width-active');
        $(this).addClass('line-width-active');
    });

    //线条颜色选择器
    $('#line-set-right td').click(function() {
        $('#line-set-right td').removeClass('color-picker-active');
        $(this).addClass('color-picker-active');
        var bgcolor = $(this).get(0).style.backgroundColor;
        $('#line-preview').css('background-color', bgcolor);
    });

    //字体颜色选择器
    $('#font-color td').click(function() {
        $('#font-color td').removeClass('color-picker-active');
        $(this).addClass('color-picker-active');
        var bgcolor = $(this).get(0).style.backgroundColor;
        $('#font-color .color-preview').css('background-color', bgcolor);
    });

    //样式选择器隐藏
    function drawSetHide(dom) {
        dom.css('display', 'none');
    }

    //样式选择器显示
    function drawSetShow(dom, position) {
        dom.css({ "position": "absolute", 'display': "inline-block", 'left': position.left, 'top': position.top });
    }

    function drawSetToggle(dom, position, isfont) {
        tool = isfont ? fontSet : lineSet;
        oth = !isfont ? fontSet : lineSet;
        if (dom.hasClass('now')) {
            if (tool.hasClass('hide')) {
                drawSetShow(tool, position);
                tool.removeClass('hide')
            } else {
                drawSetHide(tool);
                tool.addClass('hide')
            }
        } else {
            drawSetShow(tool, position);
            $('.draw').removeClass('now');
            dom.addClass('now');
        }
        drawSetHide(oth);
    }
});
