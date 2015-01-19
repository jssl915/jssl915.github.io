function getClass(tagName,className) //获得标签名为tagName,类名className的元素
{
    if(document.getElementsByClassName) //支持这个函数
     {        return document.getElementsByClassName(className);
     }
     else
     {       var tags=document.getElementsByTagName(tagName);//获取标签
         var tagArr=[];//用于返回类名为className的元素
         for(var i=0;i < tags.length; i++)
         {
             if(tags[i].class == className)
             {
                 tagArr[tagArr.length] = tags[i];//保存满足条件的元素
             }
         }
         return tagArr;
     }
}

function getStyle(obj, attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj, false)[attr];
	}
}

function startMove(obj, json, fn){
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var bStop=true;		//这一次运动就结束了——所有的值都到达了
		for(var attr in json){
			//1.取当前的值
			var iCur=0;
			if(attr=='opacity'){
				iCur=parseInt(parseFloat(getStyle(obj, attr))*100);
			}else{
				iCur=parseInt(getStyle(obj, attr));
			}
			
			//2.算速度
			var iSpeed=(json[attr]-iCur)/8;
			iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
			
			//3.检测停止
			if(iCur!=json[attr]){
				bStop=false;
			}
			
			if(attr=='opacity'){
				obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
				obj.style.opacity=(iCur+iSpeed)/100;
			}else{
				obj.style[attr]=iCur+iSpeed+'px';
			}
		}
		if(bStop){
			clearInterval(obj.timer);
			if(fn){
				fn();
			}
		}
	}, 30)
} 


function Drag(id)
{
	var _this=this;
	
	this.disX=0;
	this.disY=0;
	this.oDiv=document.getElementById(id);
	
	this.oDiv.onmousedown=function (ev)
	{
		_this.fnDown(ev);
		
		return false;
	};
}

Drag.prototype.fnDown=function (ev)
{
	var _this=this;
	var oEvent=ev||event;
	this.disX=oEvent.clientX-this.oDiv.offsetLeft;
	this.disY=oEvent.clientY-this.oDiv.offsetTop;
	
	document.onmousemove=function (ev)
	{
		_this.fnMove(ev);
	};
	
	document.onmouseup=function ()
	{
		_this.fnUp();
	};
};

Drag.prototype.fnMove=function (ev)
{
	var oEvent=ev||event;
	
	this.oDiv.style.left=oEvent.clientX-this.disX+'px';
	this.oDiv.style.top=oEvent.clientY-this.disY+'px';
};

Drag.prototype.fnUp=function ()
{
	document.onmousemove=null;
	document.onmouseup=null;
};

function LimitDrag(id)
{
	Drag.call(this, id);
}

//LimitDrag.prototype=Drag.prototype;

for(var i in Drag.prototype)
{
	LimitDrag.prototype[i]=Drag.prototype[i];
}

LimitDrag.prototype.fnMove=function (ev)
{
	var oEvent=ev||event;
	var l=oEvent.clientX-this.disX;
	var t=oEvent.clientY-this.disY;
	
	if(l<0)
	{
		l=0;
	}
	else if(l>document.documentElement.clientWidth-this.oDiv.offsetWidth)
	{
		l=document.documentElement.clientWidth-this.oDiv.offsetWidth;
	}
	
	if(t<0)
	{
		t=0;
	}
	else if(t>document.documentElement.clientHeight-this.oDiv.offsetHeight)
	{
		t=document.documentElement.clientHeight-this.oDiv.offsetHeight;
	}
	
	this.oDiv.style.left=l+'px';
	this.oDiv.style.top=t+'px';
};