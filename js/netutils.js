function LineData(x1, y1, x2, y2) {
    return { "x1": x1, "y1": y1, "x2": x2, "x2": y2 };
}

function RectData(x, y, width, height) {
    return { "x": x, "y": y, "width": width, "height": height };
}

function CanvasTool(ctx) {
    this.triangle = [];
    this.ellipse = [];
    this.rect = [];
    this.line = [];
    this.curve = [];
    this.font = {};
    this.type = 1;
    this.ctx = ctx;
    this.callback = function(args, type) {};
    this.isCallback = true;
    this.draw = function(data) {
        switch (data.type) {
            case 0:
                this.drawCurve(data.data);
                break;
            case 1:
                this.drawLine(data.data[0], data.data[1], data.data[2], data.data[3]);
                break;
            case 2:
                this.drawRect(data.data[0], data.data[1], data.data[2], data.data[3]);
                break;
            case 3:
                this.drawEllipse(data.data[0], data.data[1], data.data[2], data.data[3]);
                break;
            case 4:
                this.drawTriangle(data.data[0], data.data[1], data.data[2], data.data[3], data.data[4], data.data[5], data.data[6]);
                break;
            case 5:
                this.drawText(data.data[0], data.data[1], data.data[2]);
                break;
            default:
                break;
        }
    }
    this.clearCanvas = function(c) {
            this.ctx.clearRect(0, 0, c.width, c.height);
        }
        //写字
    this.drawText = function(x, y, text) {
            //文字截取
            this.ctx.fillText(text, x, y, 250);
            if (this.isCallback) {
                this.callback(Array.from(arguments), this.type);
            }
        }
        //三角形
    this.drawTriangle = function(x1, y1, x2, y2, x3, y3) {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineTo(x3, y3);
            this.ctx.closePath();
            this.ctx.stroke();
            if (this.isCallback) {
                this.callback(Array.from(arguments), this.type);
            }
        }
        //画直线
    this.drawLine = function(x1, y1, x2, y2) {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
            if (this.isCallback) {
                this.callback(Array.from(arguments), this.type);
            }
        }
        //画曲线
    this.drawCurve = function(data) {
            this.ctx.beginPath();
            for (var i in data) {
                var v = data[i];
                if (i == 0) {
                    this.ctx.moveTo(v[0], v[1]);
                } else {
                    this.ctx.lineTo(v[0], v[1]);
                }
            }
            this.ctx.stroke();
            if (this.isCallback) {
                this.callback(Array.from(arguments), this.type);
            }
        }
        //画椭圆
    this.drawEllipse = function(x1, y1, x2, y2) {
        if (x1 > x2) {
            x1 ^= x2;
            x2 ^= x1;
            x1 ^= x2;
        }
        if (y1 > y2) {
            y1 ^= y2;
            y2 ^= y1;
            y1 ^= y2;
        }
        var w = x2 - x1;
        var h = y2 - y1;
        if (h > w) {
            var a = h / 2,
                b = w / 2;
        } else {
            var a = w / 2,
                b = h / 2;
        }
        //计算点集并画图
        var plusSet = [];
        var minusSet = [];
        for (var x = -w / 2; x <= w / 2; x++) {
            //计算纵坐标
            if (w > h) {
                y = Math.sqrt(b * b - (x * b / a) * (x * b / a));
            } else {
                y = Math.sqrt(a * a - (x * a / b) * (x * a / b));
            }
            plusSet.push([x + x1 + w / 2, y + y1 + h / 2]);
            minusSet.push([-x + x1 + w / 2, -y + y1 + h / 2]);
        };
        plusSet = plusSet.concat(minusSet);
        this.ctx.beginPath();
        for (var i in plusSet) {
            var p = plusSet[i];
            if (i == 0) {
                this.ctx.moveTo(p[0], p[1]);
            } else {
                this.ctx.lineTo(p[0], p[1]);
            }
        };
        this.ctx.closePath();
        this.ctx.stroke();
        if (this.isCallback) {
            this.callback(Array.from(arguments), this.type);
        }
    }

    //画矩形
    this.drawRect = function(x, y, width, height) {
        // this.ctx.beginPath();
        this.ctx.strokeRect(x, y, width, height);
        if (this.isCallback) {
            this.callback(Array.from(arguments), this.type);
        }
    }
}

function FontArea(jQobj) {
    this.jQobj = jQobj;
    this.textarea = this.jQobj.find('textarea');
    this.init = function() {
        this.jQobj.css({
            "display": "none",
            "position": "absolute",
            'left': 0,
            'top': 0,
        });
        this.textarea.rows = 3;
        this.textarea.css({
            "overflow": "hidden",
            "resize": "none",
            "font-size": "20px",
            "border": "1px black dashed",
            "background": "rgba(20, 83, 62,0.5)"
        });
        this.textarea.val("");
    };
    this.changeXY = function(x, y) {
        this.jQobj.css({
            "display": "block",
            "left": x + 10,
            'top': y + 50,
        });
    };
    this.getText = function() {
        rows = this.textarea[0].cols;
        cols = this.textarea.css('cols');
        return this.textarea.val();
    }
}
//发送列表
function SendList() {
    this.list = [];
    this.push = function(id, data) {
        if (this.findById(id) === false) {
            this.list.push({ "id": id, "data": data });
            this.list.resort();
        }
    }

    this.pushAll = function(dataAll) {
        for (var d of dataAll) {
            if (this.findById(d.id) === false) {
                this.list.push(d);
            }
        }
        this.list.resort();
    }

    this.findById = function(id) {
        for (var i in this.list) {
            if (this.list[i].id == id) return i;
        }
        return false;
    }
    this.resort = function() {
        this.list.sort(function(a, b) {
            return b.id - a.id;
        });
    }
    this.remove = function(id) {
        var index = this.findById(id);
        if (index !== false) {
            return this.list.splice(index, 1);
        } else {
            return false;
        }
    }
}
//各种请求
//加载某文档某页数据
function loadPageDraw(ct, canvas, page, cdid) {
    // $.post(
    //     "/?m=draw&c=draw&a=show_page_draw", {
    //         "cdid": cdid,
    //         "page_number":page
    //     },
    //     function(res) {
    //         //清空画布
    //         ct.clearCanvas(canvas);
    //         if (res.res == undefined && res != false) {
    //             ct.isCallback = false;
    //             for (var i of res) {
    //                 draw(i.data, ct);
    //             }
    //             ct.isCallback = true;
    //         } else {
    //             console.log("canvas is empty");
    //         }
    //     },
    //     'json'
    // );
}

function save_active(docid, page) {
    // $.post(
    //     "/?m=draw&c=draw&a=save_active", {
    //         "page_number": page,
    //         'courseid': courseid,
    //         'cdid': cdid
    //     },
    //     function(res) {
    //         if (res.data == undefined) {
    //             console.log(res.res);
    //         } else {
    //             cdid = res.data.cdid;
    //             page = res.data.page_number;
    //             loadPageDraw(canvasTool, canvas, page, cdid);
    //         }
    //     },
    //     'json'
    // );
}

function getActive(courseid, source, canvasTool, canvas) {
    // $.post(
    //     "/?m=draw&c=draw&a=get_active", {
    //         'source': source,
    //         'courseid': courseid,
    //     },
    //     function(res) {
    //         if (res.res == undefined) {
    //             cdod = res.cdid;
    //             page = res.page_number;
    //             loadPageDraw(canvasTool, canvas);
    //         } else {
    //             console.log(res.res);
    //         }
    //     },
    //     'json'
    // );
}


function draw(i, ct) {
    var i = JSON.parse(i);
    if (i.type == 5) {
        ct.ctx.fillStyle = i.color;
        ct.ctx.font = i.font;
    } else {
        ct.ctx.strokeStyle = i.color;
        ct.ctx.lineWidth = i.thick;
    }
    ct.draw(i);
}

function drawQueue(){

}
