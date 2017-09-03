/**
 * Created by HVELK on 2017/3/2.
 */
module.exports=function () {
    //throw new Error("HVE_LK object exists already, please check whether the reloading HVE_LK");
    /*if(HVE_LK in window){
        throw new Error("HVE_LK object exists already, please check whether the reloading HVE_LK");
    }*/
    //拓展
    // HVE_LK for webRTC
    window.HVE_LK={}||Object.create({});
    HVE_LK.isFunction=function (fun) {
        return toString.call(fun)==='[object Function]';
    };
    HVE_LK.isBoolean=function (bool) {
        return toString.call(bool)==='[object Boolean]';
    };
    HVE_LK.isNumber=function (num) {
        return toString.call(num)==='[object Number]';
    };
    HVE_LK.isArray=function (arr) {
        return toString.call(arr)==='[object Array]';
    };
    HVE_LK.isHashMap=function (obj) {
        return toString.call(obj)==='[object Object]'
    };
    HVE_LK.isObject=function (obj) {
        return typeof  obj==='object';
    };
    HVE_LK.isString=function (str) {
        return toString.call(str)==='[object String]'
    };
    HVE_LK.isFile=function(obj) {
        return toString.call(obj) === '[object File]';
    };
    HVE_LK.isFormData=function(obj) {
        return toString.call(obj) === '[object FormData]';
    };
    HVE_LK.isBlob=function (obj) {
        return toString.call(obj) === '[object Blob]';
    };
    HVE_LK.isRegExp=function (value) {
        return toString.call(value) === '[object RegExp]';
    };
    HVE_LK.isString=function (value) {
        return typeof value === 'string';
    };
    HVE_LK.isDate=function (value) {
        return toString.call(value) === '[object Date]';
    };
    HVE_LK.isWindow=function (obj) {
        return obj && obj.window === obj;
    };
    HVE_LK.hasAttribute=function (obj,attribute) {
        return {}.hasOwnProperty.call(obj,attribute);
    };
    //String 拓展
    var regA=/^\/\^/,
        regB=/\$?\/([g,i,m]{0,3})$/,
        regC=/\$$/;
    String.prototype.startsWith=function (reg) {
        if(HVE_LK.isRegExp(reg)){
            if(this.length===0)return false;
            var newReg=null;
            //忽略 正则要么以^开头 ^ 不能包含$ ^不能出现在正则当中
            var regStr=reg.toString();
            if(!regA.test(regStr)){
                newReg=eval(regStr.replace(/^\//,"/^"));
            }else{
                newReg=reg;
            }
            if(newReg!=null){
                return newReg.test(this);
            }else{
                return false;
            }
        }else if(HVE_LK.isString(reg)){
            if(this.length===0||reg===""||reg.length>this.length)return false;
            return this.substr(0,reg.length)===reg;
        }else{
            throw new Error('"'+reg+'"'+"Parameter type error, is not a valid regular expression or string or parameter is empty");
        }
    };
    String.prototype.endsWith=function (reg) {
        if(HVE_LK.isRegExp(reg)){
            //忽略 正则要么以$结尾 ^ 不能包含$ ^不能出现在正则当中
             if(this.length==0)return false;
             var newReg=null;
             var regStr=reg.toString();
             if(regB.test(regStr)){
                var strArray=regStr.split(regB);
                 if(regC.test(strArray[0])){
                     newReg=eval(strArray[0]+strArray[1]);
                 }else{
                     newReg=eval(strArray[0]+'$/'+strArray[1]);
                 }
             }
             if(newReg!=null){
                return newReg.test(this);
             }else{
                 return false;
             }
        }else if(HVE_LK.isString(reg)){
            if(this.length===0||reg===null||reg===""||reg.length>this.length)return false;
            return this.substring(this.length-reg.length)===reg;
        }else{
            throw new Error('"'+reg+'"'+"Parameter type error, is not a valid regular expression or string or parameter is empty");
        }
    };
    if(!HVE_LK.isFunction(String.prototype.trim)){
        String.prototype.trim=function () {
            console.log(this);
            return this.replace(/(^\s*)|(\s*$)/g,"");
        };
    }
    if(!HVE_LK.isFunction(String.prototype.ltrim)){
        String.prototype.ltrim=function () {
            return this.replace(/(^\s*)/g,"");
        };
    }
    if(!HVE_LK.isFunction(String.prototype.rtrim)){
        String.prototype.rtrim=function () {
            return this.replace(/(\s*$)/g,"");
        };
    }
    if(!HVE_LK.isFunction(String.prototype.allTrim)){
        String.prototype.allTrim=function () {
            return this.replace(/\s/g,"");
        };
    }
    HVE_LK.equals=function (a1,a2) {//暂时保留
        //两个参数不能为空
        if(arguments.length<2)throw new Error("The number of arguments wrong...!");
        if(!this.isObject(a1)||!this.isObject(a2)){
            if (a1 !== a1 && a2 !== a2) return true;//NavN
            return a1===a2;
        }else{
            var i=0,len;
            if(this.isArray(a1)){//Array
                if(this.isArray(a2)){
                    if(a1.length!=a2.length){
                        return false;
                    }else{
                        len=a1.length;
                        for(i;i<len;i++){
                            if(!this.equals(a1[i],a2[i])){return false}
                        }
                        return true;
                    }
                }else{
                    return false;
                }
            }
            if(this.isDate(a1)){
                //只比较时间值
                if(this.isDate(a2)){
                    return a1.getTime()===a2.getTime();
                }else{
                    return false;
                }
            }
            if(this.isRegExp(a1)){
                if(this.isRegExp(a2)){
                    return a1.toString()===a2.toString();
                }else{
                    return false;
                }
            }
            if(this.isFunction(a1)){
                if(this.isFunction(a2)){

                }else{
                    return false;
                }
            }
        }
    };
};