function CanvasTool(canvasDomId) {
    if (canvasDomId == undefined) {
        console.log('canvas节点必须提供');
        return;
    }
    this.canvas = document.getElementById(canvasDomId);
    if (this.canvas == undefined) {
        console.log('canvas节点不存在');
        return;
    }
    if (!this.canvas.getContext) {
        console.log('浏览器不支持canvas');
        return;
    } else {
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.log('canvas 2d对象获取失败');
            return;
        }
    }
    //画笔初始化样式
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#000';
    this.ctx.fillStyle = '#000';
    this.ctx.font = "20px Consolas,Courier,monospace";
    //设置样式
    this.setStyle = function(prop) {
            if (prop.lineWidth) {
                this.ctx.lineWidth = prop.lineWidth;
            }
            if (prop.fillStyle) {
                this.ctx.fillStyle = prop.fillStyle;
            }
            if (prop.fontSize) {
                this.ctx.font = prop.fontSize + ' Consolas,Courier,monospace';
            }
            if (prop.strokeStyle) {
                this.ctx.strokeStyle = prop.strokeStyle;
            }
        }
        //清除画板
    this.clear = function(prop) {
            var width = prop.width || this.canvas.width;
            var height = prop.height || this.canvas.height;
            this.ctx.clearRect(0, 0, width, height);
            return { 'width': width, 'height': height };
        }
        //写字(根据像素计算换行和绘制)
    this.drawText = function(textarea, x, y, lineHeight) {
            var width = textarea.width();
            var height = textarea.height();
            var text = textarea.val();
            var lines = [],
                line = '',
                len = 0;
            for (var i = 0; i < text.length; i++) {
                var char = text.substr(i, 1);
                line += char;
                if (char == '\n') {
                    lines.push(line);
                    len += line.length;
                    line = '';
                } else {
                    var cwidth = this.ctx.measureText(line).width;
                    if (cwidth > width) {
                        lines.push(line.substr(0, line.length - 1));
                        len += line.length - 1;
                        line = line.substr(line.length - 1, 1);
                    }
                }
            }
            if (len < text.length) {
                lines.push(text.substr(len));
            }
            for (var i in lines) {
                var text = lines[i];
                this.ctx.fillText(text, x, y + i * lineHeight, width);
            }
        }
        //三角形
    this.drawTriangle = function(args) {
            var p1 = _getPoint(args.p1);
            var p2 = _getPoint(args.p2);
            var p3 = _getPoint(args.p3);
            this.ctx.beginPath();
            this.ctx.moveTo(p1[0], p1[1]);
            this.ctx.lineTo(p2[0], p2[1]);
            this.ctx.lineTo(p3[0], p3[1]);
            this.ctx.closePath();
            this.ctx.stroke();
            return { 'p1': p1, 'p2': p2, 'p3': p3 };
        }
        //获取点
    function _getPoint(p) {
        var p1 = [];
        if (p && p.length == 2) {
            p1[0] = parseInt(p[0]) || 0;
            p1[1] = parseInt(p[1]) || 0;
        } else {
            p1 = [0, 0];
        }
        return p1;
    }
    //画直线
    this.drawLine = function(args) {
        var p1 = _getPoint(args.p1);
        var p2 = _getPoint(args.p2);
        this.ctx.beginPath();
        this.ctx.moveTo(p1[0], p1[1]);
        this.ctx.lineTo(p2[0], p2[1]);
        this.ctx.stroke();
        return { 'p1': p1, 'p2': p2 };
    }

    //画曲线
    this.drawCurve = function(pList) {
            if (pList.length > 0) {
                this.ctx.beginPath();
                for (var i in pList) {
                    var v = data[i];
                    if (i == 0) {
                        this.ctx.moveTo(v[0], v[1]);
                    } else {
                        this.ctx.lineTo(v[0], v[1]);
                    }
                }
                this.ctx.stroke();
            }
            return { 'pList': pList };
        }
        //画椭圆
    this.drawEllipse = function(args) {
        var p1 = _getPoint(args.p1);
        var p2 = _getPoint(args.p2);
        if (p1[0] > p2[0]) {
            p1[0] ^= p2[0];
            p2[0] ^= p1[0];
            p1[0] ^= p2[0];
        }
        if (p1[1] > p2[1]) {
            p1[1] ^= p2[1];
            p2[1] ^= p1[1];
            p1[1] ^= p2[1];
        }
        var w = p2[0] - p1[0];
        var h = p2[1] - p1[1];
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
            plusSet.push([x + p1[0] + w / 2, y + p1[1] + h / 2]);
            minusSet.push([-x + p1[0] + w / 2, -y + p1[1] + h / 2]);
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
        this.ctx.stroke();
        return { 'p1': p1, 'p2': p2 };
    }

    //画矩形
    this.drawRect = function(args) {
        var p1 = _getPoint(args.p1);
        var p2 = _getPoint(args.p2);
        var p = p1;
        if (p1[0] > p2[0]) {
            p[0] == p2[0];
        };
        if (p1[1] > p2[1]) {
            p[1] == p2[1];
        }
        var width = Math.abs(p2[0] - p1[0]);
        var height = Math.abs(p2[1] - p1[1]);
        this.ctx.strokeRect(p[0], p[1], width, height);
        return args;
    }
}
