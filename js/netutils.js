function Queue(){
        this.dataStore = [];
        this.enqueue = enqueue;
        this.dequeue = dequeue;
        this.front = front;
        this.back = back;
        this.toString = toString;
        this.empty = empty;
}

//入队，就是在数组的末尾添加一个元素
function enqueue(element){
    this.dataStore.push(element);
}
//出队，就是删除数组的第一个元素
function dequeue(){
    return this.dataStore.shift();
}
//取出数组的第一个元素
function front(){
    return this.dataStore[0];
}
//取出数组的最后一个元素
function back(){
    return this.dataStore[this.dataStore.length-1];
}

function toString(){
    var retStr = "";
    for (var i=0; i<this.dataStore.length; ++i) {
        retStr += this.dataStore[i] + "&nbsp;"
    }
    return retStr;
}
//判断数组是否为空
function empty(){
    if(this.dataStore.length == 0){
        return true;
    }else{
        return false;
    }    
}
//返回数组中元素的个数
function count(){
    return this.dataStore.length;
}