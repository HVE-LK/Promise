/**
 * Created by HVELK on 2017/3/2.
 */
var init=require("./init")();
HVE_LK.defer={
    // TODO 不管是all或者race 都是失败回掉优先只要失败被回掉 成功函数将不会被回掉，失败原因可以向下继续传递
    Promise:function (link) {
        this.state="pending";
        this.handlersSure=null;
        this.handlersErr=null;
        var current=this;
        this.resolve=function (Value) {
            current.state="fulfilled";
            current.value=Value;
            if(typeof current.handlersSure==='function'){
                current.handlersSure(current.value);
            }
        };
        this.reject=function (Err) {
            current.state="rejected";
            current.value=Err;
            if(typeof current.handlersErr==='function'){
                current.handlersErr(current.value);
            }
        };
        if(typeof link==='function'){
            try {
                link.call(this,this.resolve,this.reject);
            }catch (Error){
                this.state="rejected";
                this.value=Error.stack;
            }
        }
    },
    // TODO:所有promise状态为fulfilled 立即执行回掉
    all:function (arr) {
        if(toString.call(arr)!=="[object Array]"){
            throw  new Error('"'+arr.toString()+'"'+" Parameter type error is not a valid array");
        }
        var selfResolve,selfReject,Value=[],once=new this.Promise(function (resolve,reject) {
            selfResolve=resolve;
            selfReject=reject;
        });
        var defeated=false;
        function tell(i) {
            arr[i].then(function (value) {
                Value[i]=value;
                for(var b=0;b<arr.length;b++){
                    if(arr[b].state!=="fulfilled")return;
                }
                !defeated&&selfResolve(Value);
            },function (error) {
                if(!defeated){
                    defeated=true;
                    selfReject(error);
                }
            });
        }
        if(arr.length===0){
            selfResolve();
        }else {
            for(var i=0;i<arr.length;i++){
                if(defeated)break;
                if(arr[i] instanceof this.Promise){
                    tell(i);
                }else{
                    var err=new Error('"'+arr[i]+'"'+" The parameter value is not a valid promise object");
                    defeated=true;
                    selfReject(err.stack);
                    break;
                }

            }
        }
        return once;
    },
    // TODO:只要有一个promise状态为fulfilled 立即执行回掉
    race:function (arr) {
        if(toString.call(arr)!=="[object Array]"){
            throw  new Error('"'+arr.toString()+'"'+" Parameter type error is not a valid array");
        }
        var selfResolve,selfReject,Value=[],once=new this.Promise(function (resolve,reject) {
            selfResolve=resolve;
            selfReject=reject;
        });
        var defeated=false,success=false;
        function tell(i) {
            arr[i].then(function (value) {
                if(!success&&!defeated){
                    success=true;
                    selfResolve(value);
                }
            },function (error) {
                if(!defeated){
                    defeated=true;
                    selfReject(error);
                }
            });
        }
        if(arr.length===0){
            selfResolve();
        }else {
            for(var i=0;i<arr.length;i++){
                if(defeated||success)break;
                if(arr[i] instanceof this.Promise){
                    tell(i);
                }else{
                    var err=new Error('"'+arr[i]+'"'+" The parameter value is not a valid promise object");
                    defeated=true;
                    selfReject(err.stack);
                    break;
                }
            }
        }
        return once;
    }//待优化
};
var $$Promise=HVE_LK.defer;
$$Promise.Promise.prototype.constructor=$$Promise.Promise;
// TODO:捕获同步执行异常或者reject异常，但无法捕获异步执行异常，也就是说如果发生的是异步异常chtch将不会被调用，必须手动reject
$$Promise.Promise.prototype.catch=function (onRejected) {
    //判断上一个状态是否调用成功
    var self=this,onRejectedF=typeof onRejected==='function';
    return new $$Promise.Promise(function (resolve,reject) {
        function onRejectedFade(Error) {
            try {
                var ret = onRejectedF?onRejected(Error):Error;
                ret instanceof $$Promise.Promise?
                    ret.done(function(){},function (Error) {reject(Error);}):
                    resolve(ret);
            }catch (E){
                reject(E.stack);
            }
        }
        if(self.state === "rejected"){
            onRejectedFade(self.value);
            return;
        }
        self.handlersErr=onRejectedFade;
    })};
//TODO 如果未传入回掉函数 执行结果依然会向下传递
$$Promise.Promise.prototype.then=function (onFulfilled,onRejected) {
    //判断上一个状态是否调用成功
    var onFulfilledF=typeof onFulfilled==='function',
        onRejectedF=typeof onRejected==='function';
    var self=this;
    return new $$Promise.Promise(function (resolve,reject) {
        function onResolvedFade(value) {
            try {
                var ret = onFulfilledF?onFulfilled(value):value;
                ret instanceof $$Promise.Promise?
                    ret.done(function (value) {resolve(value);},function (Error) {reject(Error)}):
                    resolve(ret);
            }catch (Error){
                reject(Error.stack);
            }
        }
        function onRejectedFade(Error) {
            //如果onRejected 返回值为null 则下一次状态默认为成功
            try {
                var ret = onRejectedF?onRejected(Error):Error;
                ret instanceof $$Promise.Promise?
                    ret.done(function(value){resolve(value)},function (Error) {reject(Error);}):
                    resolve(ret);
            }catch(E) {
                reject(E.stack);
            }
        }
        if(self.state === "fulfilled"){
            onResolvedFade(self.value);
            return;
        }
        if(self.state === "rejected"){
            onRejectedFade(self.value);
            return;
        }
        self.handlersSure=onResolvedFade;
        self.handlersErr=onRejectedFade;
    });
};
// TODO 结束then链式调用
$$Promise.Promise.prototype.done=function (onFulfilled,onRejected) {
    //结束链式 then链式调用 异常直接抛出
    typeof onFulfilled==='function'&&(this.handlersSure=onFulfilled);
    typeof onRejected==='function'&&(this.handlersErr=onRejected);
    if(this.state=== "fulfilled"){
        onFulfilled(this.value);
        return;
    }
    this.state === "rejected"&&onRejected(this.value);
};
//TODO 获取当前promise状态和值
$$Promise.Promise.prototype.inspect=function () {
    return {
        state:this.state,
        value:this.value
    }
};
//TODO 获取promise队列