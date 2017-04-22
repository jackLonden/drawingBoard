$(function() {
    if (!canvas) {
        console.log('不支持canvas');
        return;
    }
    if (!canvas.getContext) {
        console.log('getContext 异常');
        return;
    }
    var context = canvas.getContext('2d');; //2d对象
    if (!context) {
        console.log('上下文对象获取失败');
    }
    var drawEvent; //绘图事件对象
    var hasNew; //是否有新的
    var allDraws; //所有绘图数据
    var lastSend; //保存到第几个元素
    var fontArea = new FontArea($(".draw_font"));
    var page = 1;
    var docid = 0;
    var docList = {};
    var page_num = 5;
    var scrollTop = 0;
    var scrollLeft = 0;
    //初始化变量
    init();
    function windowInit2() {
        var wh = $(window).height();
        var ww = $(window).width();
        var backgroundUrl = $('.cav-cont').css('backgroundImage').replace("url(\"", "").replace('")',"");
        $('#container').css('width', ww);
        $('#container').css('height', "100%");
        $('.cav-cont').css('width', ww);
        $('.cav-bor').css('width', ww);
        document.getElementById("canvas").width = ww;
        if(backgroundUrl == 'none'){
            $('.cav-cont').css('height', wh -50);
            $('.cav-bor').css('height', wh - 50);
            document.getElementById("canvas").height = wh -50;
        }else{
            changeCanvasHeight(backgroundUrl);
        }
        //初始化画板
        // loadPageDraw(canvasTool, canvas, page, cdid);
    }
    //窗口放大缩小事件
    $(window).resize(function() {
        windowInit2();
    });
    //初始化窗口比例
    windowInit2();
    //设置活跃课程
    save_active(docid, page);
    //初始化文档列表和分页
    // $.post(
    //     "/?m=draw&c=doc&a=getlist",
    //     {'course_id':courseid},
    //     function(resp){
    //         docList = resp;
    //         //文档列表的dom和白板的第一页
    //         docStr = '';
    //         pageStr = '';
    //         for(var k in docList.data){
    //             var v = docList.data[k];
    //             // console.log(v);
    //             //白板加到文档第一位
    //             if(v.type == 1){
    //                 docStr = '<li value="'+k+'" title="白板">白板</li>'+docStr;
    //                 pageStr = initPage(v.page_count);
    //             }else{
    //                 var sep = v.doc_name.lastIndexOf('.');
    //                 var ext = v.doc_name.substr(sep);
    //                 var doc_name = v.doc_name.substring(0, sep);
    //                 doc_name1 = doc_name.substr(0,10);
    //                 if(doc_name != doc_name1){
    //                     doc_name1 += '...';
    //                 }
    //                 docStr += '<li value="'+k+'" title="'+v.doc_name+'">'+doc_name1+ext+'</li>';
    //             }
    //         }
    //         $('.page').html(pageStr);
    //         $('.up-menu-list').html(docStr);
    //     },
    //     'json'
    // );
    function initPage(pageCount){
        pageCount = parseInt(pageCount);
        pageStr = "<span id='prev'>&lt;</span>";
        if(pageCount>0){
            for(var i =1; i <= pageCount&& i<=page_num; i++){
                pageStr += '<span value="'+i+'">'+i+'</span>';
            }
        }
        pageStr += "<span id='next'>&gt;</span>";
        return pageStr;
    }
    /**  
     * 初始化
     */
    function init() {
        //全局变量初始化
        drawEvent = new DrawEvent();
        canvasTool = new CanvasTool(context);
        hasNew = false;
        allDraws = [];
        lastSend = 0;
        //画笔类型 画 直线
        canvasTool.type = 1;

        //画笔颜色黑,宽度 1px
        context.strokeStyle = "#000";
        context.lineWidth = 1;
        /**  
         * 绑定事件 
         */
        canvas.addEventListener('mousedown', drawEvent.mousedown, false);
        canvas.addEventListener('mousemove', drawEvent.mousemove, false);
        canvas.addEventListener('mouseup', drawEvent.mouseup, false);
        //初始化文字框
        fontArea.init();
        /**
         * 绘图对象绑定回调事件
         */
        canvasTool.callback = function(args, type) {
            if (type == 5) { //文字特殊处理
                // console.log({ 'type': type, 'color': context.fillStyle, 'font': context.font, 'data': args });
                allDraws.push({ 'type': type, 'color': context.fillStyle, 'font': context.font, 'data': args });
            } else {
                allDraws.push({ 'type': type, 'color': context.strokeStyle, 'thick': context.lineWidth, 'data': args });
            }
            // console.log(allDraws);
            hasNew = true;
        };
    }


    // var me = this;
    // me.loop = function() {
    //     var len = allDraws.length;
    //     //发送滚轮位置给服务器
    //     $.post(
    //         "/?m=draw&c=draw&a=change_scroll",
    //         {
    //             'scroll_top': $('.cav-bor').scrollTop(),
    //             'scroll_left': $('.cav-bor').scrollLeft(),
    //             'courseid':courseid
    //         },
    //         function(resp){
    //             // console.log(resp);
    //         },
    //         'json'
    //     );
    //     if (hasNew == true && len > 0 && lastSend < len) {
    //         var post = allDraws.slice(lastSend).map(JSON.stringify);
    //         $.post("/?m=draw&c=draw&a=save", { "data": post, "cdid": cdid, "page_number":page}, function(res) {
    //             if (res == 1) {
    //                 lastSend = len;
    //                 hasNew = false;
    //             } else {
    //                 console.log(res);
    //             }
    //             setTimeout(function() {
    //                 me.loop();
    //             }, 1000);
    //         });
    //     } else {
    //         setTimeout(function() {
    //             // console.log('empty loop');
    //             me.loop();
    //         }, 1000);
    //     }
    // }
    // me.loop();

    /**  
     * This painting tool   
     * works like a drawing pencil   
     * which tracks the mouse movements.  
     *   
     * @returns {tool_pencil}  
     */
    function DrawEvent() {
        this.started = false;
        this.fontStarted = false;
        /**  
         * This is called when you start holding down the mouse button.  
         * This starts the pencil drawing.  
         */
        this.mousedown = function(ev) {
            ev.preventDefault();

            //其他操作将清空三角形点集
            if (canvasTool.type != 4) {
                canvasTool.triangle = [];
            }
            if (canvasTool.type != 3) {
                canvasTool.ellipse = [];
            }
            if (canvasTool.type == 1) { //直线
                canvasTool.line = { "x1": ev.offsetX, "y1": ev.offsetY };
            } else if (canvasTool.type == 2) { //矩形
                canvasTool.rect = { "x": ev.offsetX, "y": ev.offsetY };
            } else if (canvasTool.type == 3) { //椭圆
                if (canvasTool.ellipse.length == 2) {
                    //绘制椭圆
                    canvasTool.drawEllipse(canvasTool.ellipse[0], canvasTool.ellipse[1], ev.offsetX, ev.offsetY);
                    canvasTool.ellipse = [];
                } else {
                    canvasTool.ellipse = [ev.offsetX, ev.offsetY];
                }
            } else if (canvasTool.type == 4) { //三角形
                if (canvasTool.triangle.length < 2) {
                    canvasTool.triangle.push([ev.offsetX, ev.offsetY]);
                } else if (canvasTool.triangle.length == 2) {
                    canvasTool.drawTriangle(canvasTool.triangle[0][0], canvasTool.triangle[0][1], canvasTool.triangle[1][0], canvasTool.triangle[1][1], ev.offsetX, ev.offsetY);
                    canvasTool.triangle = [];
                } else {
                    canvasTool.triangle = [
                        [ev.offsetX, ev.offsetY]
                    ];
                }
            } else if (canvasTool.type == 5) { //写字
                if (this.fontStarted) {
                    var text = fontArea.getText();
                    if (text.length > 0) {
                        var rowNum = 0;
                        context.font = "20px monospace";
                        context.fillStyle = "#000";
                        for (var i = 0; i <= text.length; i = i + 20) {
                            canvasTool.drawText(canvasTool.font.x, parseInt(canvasTool.font.y) + parseInt(rowNum) * 30, text.substr(i, 20));
                            rowNum++;
                        }
                        canvasTool.font = {};
                    }
                    fontArea.init();
                    this.fontStarted = false;
                } else {
                    this.fontStarted = true;
                    fontArea.changeXY(ev.offsetX, ev.offsetY);
                    canvasTool.font = { "x": ev.offsetX + 1, "y": ev.offsetY + 13 };
                    // fontArea.css({'display':"block", 'left':ev.offsetX+10, "top": ev.offsetY+50});
                }
            } else { //曲线
                context.beginPath();
                //曲线初始位置
                context.moveTo(ev.offsetX, ev.offsetY);
                canvasTool.curve = [ev.offsetX, ev.offsetY];
                this.started = true;
            }
        };

        /**  
         * This is called every time you move the mouse.  
         * Obviously, it only draws if the tool.started state is set to true  
         */
        this.mousemove = function(ev) {
            if (this.started) {
                context.lineTo(ev.offsetX, ev.offsetY);
                context.stroke();
                canvasTool.curve.push([ev.offsetX, ev.offsetY]);
            }
        };

        /**  
         * This is called when you release the mouse button.  
         */
        this.mouseup = function(ev, flag = true) {
            //关闭曲线
            if (this.started) {
                context.lineTo(ev.offsetX, ev.offsetY);
                context.stroke();
                canvasTool.curve.push([ev.offsetX, ev.offsetY]);
                //手动触发callback
                canvasTool.callback(canvasTool.curve, 0);
                this.started = false;
            }
            if (canvasTool.type == 1) { //直线
                canvasTool.drawLine(canvasTool.line.x1, canvasTool.line.y1, ev.offsetX, ev.offsetY);
            } else if (canvasTool.type == 2) { //矩形
                var width = Math.abs(ev.offsetX - canvasTool.rect.x);
                var height = Math.abs(ev.offsetY - canvasTool.rect.y);
                canvasTool.drawRect(canvasTool.rect.x, canvasTool.rect.y, width, height);
            }
            if(canvasTool.type != 3 && canvasTool.type != 4){
                $(canvas).css({"cursor": "default"});
            }
        };
    }
    document.body.addEventListener('mouseup', function(e) {
        // drawEvent.mouseup(e, false);
    })

    scale = { "w": 1, "h": 1 };
    //放大
    $('.a-large').click(function() {
        $('.cav-cont').css({'transform':"scale(1.2)"});
        // context.scale(1.2, 1.2);
        // loadPageDraw(canvasTool, canvas, page, cdid);
    });
    $('.a-small').click(function() {
        $('.cav-cont').css({'transform':"scale(0.8)"});
            // context.scale(0.8, 0.8);
            // context.clearRect(0, 0, canvas.width*3, canvas.height*3);
            // loadPageDraw(canvasTool, canvas, page, cdid);
        })
        //缩小

    //粗细
    $('.lineWidth li').each(function() {
        // consol
        $(this).click(function() {
            context.lineWidth = 2 * $(this).html() - 1;
        });
    });

    //打开图片
    $('.o-pic').on('click', function() {
            var img = new Image()
            img.src = imgurl;
            context.drawImage(img, 0, 0);
        })
        //颜色选择器点击事件
    $('.color-span').on('click', function() {
            context.strokeStyle = $(this).attr('color');
            var className = $(this).attr('class').split(" ")[1];
            $('.color-span').removeClass('bor');
            $("." + className).addClass('bor');
            $("pendig").hide();
        })
        //画矩形按钮
    $('.b-rect').on('click', function() {
            // context.strokeRect(50,50,50,90);//绘制矩形轮廓  坐标x，y  长宽x，y
            convasDialog('prect');

        })
        //三角形
    $('#triangle').click(function() {
            canvasTool.type = 4;
            $(canvas).css({"cursor": "pointer"});
        })
        //圆
    $('#circle').click(function() {
            canvasTool.type = 3;
            $(canvas).css({"cursor": "pointer"});
        })
        //矩形
    $('#rect').click(function() {
        canvasTool.type = 2;
        $(canvas).css({"cursor": "crosshair"});
    })

    //画直线
    $('.line').on('click', function() {
            canvasTool.type = 1;
            $('#canvas').removeClass('p-pen').addClass('p-rect');
            $(canvas).css({"cursor": "crosshair"});
        })
        // 画曲线

    $('.b-pen').on('click', function() {
        canvasTool.type = 0;
        $(canvas).css({"cursor": "url(Application/Draw/View/imgs/pcursor.png), auto"});
        $('#canvas').removeClass('p-pen').addClass('p-rect');
    })

    $('.b-eraser').click(function() {
        context.strokeStyle = "#14533E";
        context.lineWidth = 10;
        canvasTool.type = 0;
        $(canvas).css({"cursor": "url(Application/Draw/View/imgs/ecursor.png), pointer"});
    })
    $('.b-font').click(function() {
            canvasTool.type = 5;
            $(canvas).css({"cursor": "text"});
        })
        //清除删除当前花板
    $('.b-clear').on('click', function() {
        $.post("/?m=draw&c=draw&a=trash", { "cdid": cdid, 'page_number': page }, function(res) {
            if (res.res == "ok") {
                var width = $('#canvas').width();
                var height = $('#canvas').height();
                document.getElementById("canvas").width = width;
                document.getElementById("canvas").height = height;
                allDraws = [];
                lastSend = 0;
            } else {
                console.log(res.res);
            }
        }, "json");

    })

    //撤销事件
    $('.b-reply').on('click', function() {
            var len = allDraws.length;
            console.log(len);
            if (len > 0) {
                var lastOpera = allDraws[len - 1];
                $.post("/?m=draw&c=draw&a=revoke", { "data": JSON.stringify(lastOpera), 'cdid': cdid, 'page_number': page}, function(res) {
                    if (res.res = "ok") {
                        //删除最新的元素
                        allDraws.splice(len - 1, 1);
                        if (lastOpera.type == 5) {
                            context.fillStyle = "#14533E";
                            context.font = "bold " + lastOpera.font;
                        } else {
                            context.lineWidth = parseInt(lastOpera['thick']) + 3;
                            context.strokeStyle = "#14533E";
                        }
                        canvasTool.isCallback = false;
                        canvasTool.draw(lastOpera);
                        canvasTool.isCallback = true;
                        canvasTool.type = 1;
                        context.strokeStyle = "#000";
                        context.lineWidth = 1;
                        lastSend--;
                    } else {
                        console.log("撤销失败" + res.res);
                    }
                })
            }
        })
        //点击事件文件笔记讨论点击事件
    $('.cav-chat-header li').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        cIndex = $(this).index();
        $('.all-file ul').eq(cIndex).removeClass('hide').siblings().addClass('hide');
        if (cIndex == 0) {
            $('.write').addClass('hide');
        } else {
            $('.write').removeClass('hide');
        }
    })

    $('.up-menu-title').click(function() {
        $('.up-menu-list').slideToggle();
    });
    //文档切换
    $('.up-menu-list').on('click','li', function(){
        $('.up-menu-title>span').html($(this).html());
        $('.up-menu-list').slideUp();
        cdid = $(this).val();
        var page_count = docList.data[cdid].page_count;
        $('.page').html(initPage(page_count));
        page = 1;
        var url = docList.data[cdid].qiniu_url;
        var type = docList.data[cdid].type;
        setCanvasBackground(url, page, page_count, type);
        save_active(cdid, page);
        init();
    });
    //页码切换
    $('.page').on('click', 'span:not(#prev,#next)', function(){
        page = $(this).html();
        var url = docList.data[cdid].qiniu_url;
        var page_count = docList.data[cdid].page_count;
        var type = docList.data[cdid].type;
        setCanvasBackground(url, page, page_count, type);
        save_active(cdid, page);
        init();
    });
    //向后,向前
    $('.page').on('click', '#prev,#next', function(){
        //判断向前向后
        var id = $(this).attr('id');
        if(id == 'prev'){
            if(page>1){
                page --;
            }
        }else{
            if(page<docList.data[cdid].page_count){
                page ++;
            }
        }
        var url = docList.data[cdid].qiniu_url;
        var page_count = docList.data[cdid].page_count;
        var type = docList.data[cdid].type;
        setCanvasBackground(url, page, page_count, type);
        save_active(cdid, page);
        init();
    });
    function setCanvasBackground(url, page, page_count, type){
        setPageStyle(page, page_count);
        if(type != 1){
            var filename = url.substring(url.lastIndexOf('/')+1);
            var domain = url.substring(0, url.lastIndexOf('/')+1);
            var key = filename.split('.')[0];
            var imgUrl = domain+key+'.'+page+'.jpg';
            changeCanvasHeight(imgUrl);
            $('.cav-cont').css({
                "background-image":"url("+imgUrl+")",
                "background-size":"100% auto",
                "background-repeat":"no-repeat",
                "background-position":"left top"
            });
        }else{
            $('.cav-cont').css({
                'background':"#14533e"
            });
            windowInit2();
        }
    }
    function setPageStyle(page, page_count){
        $('.page').html(changePageDom(page, page_count));
        //修改元素的颜色
        $('.page').find('span:not(#prev,#next)').css('color','#ffa726');
        $('.page').find('[value='+page+']').css('color','yellow');
    }
    function changePageDom(page, page_count){
        var page = parseInt(page);
        var end_page = Math.ceil(page/page_num)*page_num;
        var start_page = end_page - page_num + 1;
        pageStr = "<span id='prev'>&lt;</span>";
        for (var i = start_page; i <= end_page && i<= page_count; i++) {
            pageStr += '<span value="'+i+'">'+i+'</span>';
        };
        pageStr += "<span id='next'>&gt;</span>";
        //生成dom
        return pageStr;
    }
    function changeCanvasHeight(imgUrl){
        //获取图片宽高
        $.get(
            imgUrl+'?imageInfo',
            null,
            function(res){
                var cwidth = parseInt(canvas.width);
                var bwidth = parseInt(res.width);
                var bheight = parseInt(res.height);
                var cheight = Math.ceil((bheight*cwidth)/bwidth);
                canvas.height = cheight;
                if(cheight > $('.cav-bor').height()){
                    $('.cav-bor').css({"overflow-y":'scroll'});
                    $('.cav-cont').height(cheight);
                }
            },
            'json'
        )
    }

    //笔记讨论事件
    $('.note li').on('click', function() {
            var ntIndex = $(this).index();
            // alert(ntIndex);
            $('.a-active').animate({
                left: 140 * ntIndex + "px"
            })
        })
        //讨论事件
    $('.talk li').on('click', function() {
        var ntIndex = $(this).index();
        // alert(ntIndex);
        $('.b-active').animate({
            left: 160 * ntIndex + "px"
        })
    })
})

//将canvas保存成一张图片
// Converts canvas to an image
function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

function convasDialog(pencil) {
    $('.pendig').each(function() {
        if ($(this).hasClass(pencil)) {
            $('.' + pencil).toggleClass('show hide');
        } else {
            $(this).addClass('hide');
        }

    })
}


//canvas文字换行  
function write_text_other_line_auto(ctx, font, align, color, text, x, y, line_count, line_height, text_indent) {
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    var row_count = text.length / line_count;
    var first_row_line_count;
    var x1, y1;
    for (var i = 0; i <= row_count; i++) {
        if (i == 0) {
            ctx.fillText(text.substring(0, (line_count * (i + 1) - text_indent)), x + (text_indent * 26), y + (line_height * i));
            first_row_line_count = (line_count * (i + 1) - text_indent);
        } else {
            ctx.fillText(text.substring(line_count * (i - 1) + first_row_line_count, first_row_line_count + line_count * i), x, y + (line_height * i));
            y1 = y + (line_height * i);
        }
    }
    return y1;
}
