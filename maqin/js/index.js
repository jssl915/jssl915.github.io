(function(window,undefined){
	var $P ={};
	$P.page = {};
	//判断浏览器是否支持HTML5
	$P.support = function(){
		if (document.createElement('canvas').getContext) {return}
		var oDiv = document.createElement('div');
		oDiv.innerHTML = "Your browser doesn't support HTML5!<BR>Recommend use Chrome 14+/IE 9+/Firefox 7+/Safari 4+";
		oDiv.className = 'noSupportMsg';
		document.body.innerHTML = "";
		document.body.appendChild(oDiv);
		return ;
	}
	//初始化方法
	$P.page = {
		w:"",//屏幕宽
		h:"",//屏幕高
		oUl:"",//取UL
		oDiv:"",//mainDiv
		oLis:"",//页面li集合
		oRound:"",//页面圆心集合
		oSpans:"",//页面span集合
		page:0, //当前第几页
		flag:true,//鼠标滚动控制
		onLoad:function(){
			var _this =this;
			this.w = window.innerWidth;
			this.h = window.innerHeight;
			this.oDiv = document.getElementById('main');
			this.oUl = document.getElementById('content'),
			this.oLis = getClass('li','pageLi');
			this.oDiv.style.height = this.h+'px';
			this.oUl.style.width = this.w+'px';
			this.oUl.style.height = this.h*this.oLis.length +'px';
			this.oRound = document.getElementById('round');
			this.oSpans = this.oRound.getElementsByTagName('span');
			//每圆点绑定跳转事件
			for(var i=0;i<this.oLis.length;i++){
				this.oLis[i].style.height = this.h+'px';//给每一个li增加全屏高度
				(function(num){
					_this.oSpans[num].onclick = function(){//给每一个圆点增加点击事件						
						_this.page = num;
						_this.goToPage();			
					}
				}(i))
			}
			$P.page1.flag && $P.page1.init();//初始化方法
			this.goToPage(this.page);
			document.getElementById('round').style.height = this.oLis.length*32+'px';
			if(document.addEventListener){document.addEventListener('DOMMouseScroll',scrollFunc,false)}
			window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari
			function scrollFunc(e){
				if(_this.flag){//如何上次滚动完成才开始这次滚动
					var direct=0;
					e=e || window.event;
					if(e.wheelDelta){//IE/Opera/Chrome
						direct=e.wheelDelta;
					}else if(e.detail){//Firefox
						direct=-e.detail;
					}		
					ScrollText(direct);
					_this.flag = false;
				}		
			}
			function ScrollText(d){		
				d<0 ? _this.page<_this.oLis.length-1&&_this.page++ : _this.page>0&&_this.page--;
				_this.goToPage();			
			}			
		},
		goToPage:function(){
			if(this.page!=2){clearInterval($P.page3.timer);}
			var _this = this;
			for(var i=0;i<this.oSpans.length;i++){this.oSpans[i].className='';}//清除圆点样式
				this.oSpans[_this.page].className = 'active';
				startMove(_this.oUl,{top:-_this.h*_this.page},function(){
					_this.flag = true;//运动完成后将标志位设为true，可以进行下一次滚动
					_this.pageInit(_this.page);
			})
		},
		pageInit:function(num){				
			switch(num){
				case 0:{				
					$P.page1.doInit();break;
				};
				case 1:{
					$P.page2.flag && $P.page2.init(page2Obj);break;
				}
				case 2:{
					$P.page3.init('blogId',page3Obj);break;
				}
			}
		},
		toTop:function(){	
			if(this.page==this.oLis.length-1){return}
			this.page++;
			this.goToPage();	
		}
	}
	$P.page1 = {
		//重新执行
	   flag:true,	
	   init:function(){
			$P.page1.flag && $P.page1.tick(); //加载时钟
			$P.page1.flag && $P.page1.showDialog();//加载弹出框
			new LimitDrag('web_titles');//给时钟绑定拖拽事件
			//给toTop绑定翻页事件
			document.getElementById('toTop').onclick = function(){
				if($P.page.page==$P.page.oLis.length-1){return}
				$P.page.page++;
				$P.page.goToPage();	
			}
			$P.page1.flag = false;
						
	   },
	   //每次跳转到第一个页面时都要执行的方法
	   doInit:function(){
		  document.getElementById('page1_img').className="wobble";
			setTimeout(function(){
				document.getElementById('page1_img').className="";
			},1000)   
	   },
	   //时钟
	   tick: function(){
		    var _this = this;
			var years,months,days,hours, minutes, seconds;
			var intYears,intMonths,intDays,intHours, intMinutes, intSeconds;
			var today;
			today = new Date(); //系统当前时间
			intYears = today.getFullYear(); //得到年份,getFullYear()比getYear()更普适
			intMonths = today.getMonth() + 1; //得到月份，要加1
			intDays = today.getDate(); //得到日期
			intHours = today.getHours(); //得到小时
			intMinutes = today.getMinutes(); //得到分钟
			intSeconds = today.getSeconds(); //得到秒钟
			years = intYears + "-";
			if(intMonths < 10 ){
				months = "0" + intMonths +"-";
			} else {
				months = intMonths +"-";
			}
			if(intDays < 10 ){
				days = "0" + intDays +" ";
			} else {
				days = intDays + " ";
			}
			if (intHours == 0) {
				hours = "00:";
			} else if (intHours < 10) {
				hours = "0" + intHours+":";
			} else {
				hours = intHours + ":";
			}
			if (intMinutes < 10) {
				minutes = "0"+intMinutes+":";
			} else {
				minutes = intMinutes+":";
			}
			if (intSeconds < 10) {
				seconds = "0"+intSeconds+" ";
			} else {
				seconds = intSeconds+" ";
			}
			document.getElementById('title_box').innerHTML = hours+minutes+seconds+ '<br>星期'+'日一二三四五六'.charAt(new Date().getDay())+'<br>'+years+months+days;
			window.setTimeout(function(){
				_this.tick();			   
			}, 1000);
		},
		//弹框
		showDialog:function(){
			var oDiv=document.getElementById('messageBoardContainer');
			var oDivContent=oDiv.getElementsByTagName('div')[0];
			var oText=oDiv.getElementsByTagName('div')[2];
			var aSpan=oText.getElementsByTagName('span');
			//var oDrag=oDivContent.getElementsByTagName('h2')[0];
			var oCloseBtn=oDiv.getElementsByTagName('a')[0];
			var oBtnShow=document.getElementById('quirkyPopupShowBtn');	
			var w=354;
			var h=294;	
			var i=0;	
			var t=document.body.scrollTop || document.documentElement.scrollTop;	
			oDiv.style.left=(document.documentElement.clientWidth-w)/2+'px';
			oDiv.style.top=t+(document.documentElement.clientHeight)/2+'px';		
			for(i=0;i<aSpan.length;i++){
				aSpan[i].onmousedown=function (ev){
					var oEvent=window.event || ev;
					if(oEvent.stopPropagation){
						oEvent.stopPropagation();
					}else{
						oEvent.cancelBubble=true;
					}
				};
			}
			
			var oQP=new MiaovQuirkyPopup(
				oDiv, oDiv, oBtnShow, oCloseBtn,
				{x:w, y:h},
				function ()	//getPos
				{
					return {x:oDiv.offsetLeft, y:oDiv.offsetTop};
				},
				function ()	//getSize
				{
					return {x:oDiv.offsetWidth, y:oDiv.offsetHeight};
				},
				function (x, y)	//doMove
				{
					oDiv.style.left=x+'px';
					oDiv.style.top=y+'px';
				},
				function (x, y)	//doResize
				{
					oDivContent.style.top=(y-h)/2+'px';
					oDivContent.style.left=(x-w)/2+'px';
					
					oDiv.style.width=x+'px';
					oDiv.style.height=y+'px';
				}
			);
			setTimeout(
				function (){
					oQP.initShow();
				},1000
			);	
		}
	}
	$P.page2 = {
		flag:true,
		init:function(obj){
			//初始化
			this.flag = false;
			var oDiv = document.getElementById(obj.id);
			oDiv.innerHTML="";
			var oUl = document.createElement('ul');
			var iWidth = obj.width||160;
			var iHight = obj.height||120;
			var iRowNum = obj.rowNum||4;
			oUl.className = 'imgUl';
			oUl.style.width = (iWidth+20)*iRowNum+'px';
			var aLiHtml = []; 
			var aHover=['hvr-push','hvr-pop','hvr-wobble-vertical','hvr-wobble-bottom','hvr-wobble-skew','hvr-buzz','hvr-buzz-out','hvr-wobble-to-bottom-right',
						'hvr-wobble-to-top-right','hvr-wobble-top','hvr-wobble-horizontal'];
			for(var i=0;i<obj.aImg.length;i++){
				aLiHtml.push('<li style="width:'+iWidth+'px;height:'+iHight+'px"><img class="'+aHover[Math.floor((Math.random()*aHover.length))]+'" src="'+obj.aImg[i]+'" /></li>');
			}
			oUl.innerHTML = aLiHtml.join('');	
			oDiv.appendChild(oUl);
			
			//布局转换
			var aLi=oUl.getElementsByTagName('li');
			var aPos=[];
			var iMinZindex=2;
			var i=0;	
			for(i=0;i<aLi.length;i++){
				aPos[i]={left: aLi[i].offsetLeft, top: aLi[i].offsetTop};
			}
			for(i=0;i<aLi.length;i++){
				aLi[i].style.left=aPos[i].left+'px';
				aLi[i].style.top=aPos[i].top+'px';
				aLi[i].style.position='absolute';
				aLi[i].style.margin='0';
				aLi[i].index=i;
			}
			
			//拖拽
			for(i=0;i<aLi.length;i++){
				setDrag(aLi[i]);
			}
			
			function setDrag(obj){
				obj.onmousedown=function (ev){
					var oEvent=ev||event;
					obj.style.zIndex=iMinZindex++;
					var disX=oEvent.clientX-obj.offsetLeft;
					var disY=oEvent.clientY-obj.offsetTop;				
					document.onmousemove=function (ev){
						var oEvent=ev||event;				
						obj.style.left=oEvent.clientX-disX+'px';
						obj.style.top=oEvent.clientY-disY+'px';
						for(i=0;i<aLi.length;i++){
							aLi[i].className='';
						}
						var oNear=findNearest(obj);
						if(oNear){
							oNear.className='active';
						}
					};
					document.onmouseup=function (){
						document.onmousemove=null;
						document.onmouseup=null;
						var oNear=findNearest(obj);
						if(oNear){
							oNear.className='';
							oNear.style.zIndex=iMinZindex++;
							obj.style.zIndex=iMinZindex++;
							startMove(oNear, aPos[obj.index]);
							startMove(obj, aPos[oNear.index]);
							var tmp=0;
							tmp=obj.index;
							obj.index=oNear.index;
							oNear.index=tmp;
						}else{
							startMove(obj, aPos[obj.index]);
						}
					};
					clearInterval(obj.timer);
					return false;
				};
			}
			
			//碰撞检测
			function cdTest(obj1, obj2){
				var l1=obj1.offsetLeft;
				var r1=obj1.offsetLeft+obj1.offsetWidth;
				var t1=obj1.offsetTop;
				var b1=obj1.offsetTop+obj1.offsetHeight;
				
				var l2=obj2.offsetLeft;
				var r2=obj2.offsetLeft+obj2.offsetWidth;
				var t2=obj2.offsetTop;
				var b2=obj2.offsetTop+obj2.offsetHeight;
				
				if(r1<l2 || l1>r2 || b1<t2 || t1>b2){
					return false;
				}else{
					return true;
				}
			}
			
			function getDis(obj1, obj2){
				var a=obj1.offsetLeft-obj2.offsetLeft;
				var b=obj1.offsetTop-obj2.offsetTop;
				return Math.sqrt(a*a+b*b);
			}
			//找到碰上的，并且最近的
			function findNearest(obj){
				var iMin=999999999;
				var iMinIndex=-1;
				for(i=0;i<aLi.length;i++){
					if(obj==aLi[i])continue;
					if(cdTest(obj, aLi[i])){
						var dis=getDis(obj, aLi[i]);
						if(iMin>dis){
							iMin=dis;
							iMinIndex=i;
						}
					}
				}
				
				if(iMinIndex==-1){
					return null;
				}else{
					return aLi[iMinIndex];
				}
			}
		}
	}
	$P.page3 = {
		timer:null,
		flag:true,
		init:function(id,obj){						
			var oDiv=document.getElementById(id);
			var aA=oDiv.getElementsByTagName('a');	
			if(this.flag){
				var aDivHtml = [];
				for(var i=0;i<obj.length;i++){
					aDivHtml.push('<a href="#" onclick="showDialog('+i+')">'+obj[i]+'</a>');
				}
				oDiv.innerHTML = aDivHtml.join('');				
				var i=0;
				for(i=0;i<aA.length;i++){
					aA[i].pause=1;
					aA[i].time=null;
					initialize(aA[i]);
					aA[i].onmouseover=function(){
						this.pause=0;	
					};
					aA[i].onmouseout=function(){
						this.pause=1;
					};
				}	
			}
			
			var oDialog = document.getElementById('drag');
			if(oDialog.style.display == 'none'){
				this.flag = false;
				this.timer = setInterval(starmove,25);
			}
			
			function starmove(){
				for(i=0;i<aA.length;i++){
					if(aA[i].pause){
						domove(aA[i]);
					}
				}
			}
			function domove(obj){
				if(obj.offsetLeft>oDiv.offsetWidth-100){
					obj.style.left='-100px';
					initialize(obj);
				}else{
					obj.style.left=obj.offsetLeft+obj.ispeed+"px";
				}
			}
			function initialize(obj){
				var iTop=parseInt(Math.random()*oDiv.offsetHeight);
				var scale=Math.random()*1+1;
				var iTimer=parseInt(Math.random()*3000);
				obj.pause=0;
				obj.style.fontSize=12*scale+'px';
				if((iTop-obj.offsetHeight)>0){
					obj.style.top=iTop-obj.offsetHeight+"px";
				}else{
					obj.style.top = iTop+"px";
				}
				obj.style.left='-100px';
				clearTimeout(obj.time);
				obj.time=setTimeout(function(){
					obj.pause=1;
				},iTimer);
				obj.ispeed=Math.ceil(Math.random()*8)+1;
			}
		}
	}
	window.$Page = window.P = $P;
}(window))