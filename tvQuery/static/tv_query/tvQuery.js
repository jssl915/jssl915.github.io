var CYKJ = {	
	tvMap : {}, //存放TV组件数据
	tvUtil : {}, // 存放TV组件工具函数
	tvConstant : {}, //存放常量
	tvPanel : new Function(), //面板构造函数
	tvMethod : {}, //存放TV组件公用方法
	tvComponent : {}, //存放各种类型元素方法	
}

CYKJ.tvMap = {
	panel : {},//存放所有面板，根据ID获取
	idData : {}, //存放元素的data数据,根据ID获取
	nameData : {},//存放元素的data数据，根据name获取
	value : {} //存放元素的值,可根据ID或Name获取
}

CYKJ.tvUtil = {
	isAndroid:function(){var str= navigator.userAgent;return str.indexOf("Android")>=0 || str.indexOf("android")>=0},	
	getPoint:function (obj) {
		var t = obj.offsetTop,l = obj.offsetLeft; 
		while(obj=obj.offsetParent){t+= obj.offsetTop,l+= obj.offsetLeft}
		return {top:t,left:l};
	},	
	getStyle:function(obj, attr){return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr]},	
	contains:function(arr,num){
		var i = arr.length;
		while(i--){if(arr[i] == num){return true}}
		return false;
	}	
} 

CYKJ.tvConstant = {
	D_CSS : {//默认样式表
		tv_button:["d_button1","d_button2"],
		tv_text:["d_text1","d_text2"],
		tv_password:["d_text1","d_text2"],
		tv_radio:["d_radio1","d_radio2","d_radio3","d_radio4"],
		tv_checkbox:["d_checkbox1","d_checkbox2","d_checkbox3","d_checkbox4"],
		tv_select:["d_select1","d_select2"]		
	},	   
	letterMap : { //键盘数字
		'65' : 'a', '66' : 'b', '67' : 'c',	'68' : 'd',	'69' : 'e',	'70' : 'f',	'71' : 'g',		
		'72' : 'h', '73' : 'i', '74' : 'j', '75' : 'k',	'76' : 'l',	'77' : 'm',	'78' : 'n',		
		'79' : 'o', '80' : 'p', '81' : 'q',	 '82' : 'r','83' : 's',	'84' : 't',	
		'85' : 'u', '86' : 'v', '87' : 'w',	 '88' : 'x','89' : 'y',	'90' : 'z'		
	},
	defaultSrc:'static/tv_query/images/default.gif'
}

CYKJ.tvPanel = function(obj){
	this.aIds = obj.ids;
	this.name = obj.name;	
	this.aData = [];	
	this.aTwoData = [];	
	obj.data==undefined ? this.getXy1():this.getXy2(obj.data);
	this.init();
	CYKJ.tvMethod.supportMouse && (this.setMouseEnable());
}

CYKJ.tvPanel.prototype = {
	init:function(){		
		for(var i=0;i<this.aData.length;i++){
			var d = this.aData[i]; 				
			delete d.iX,delete d.iY;		
			this.aTwoData[d.x] = this.aTwoData[d.x] || [],this.aTwoData[d.x][d.y] = d;
			this.addMethod(d);	
			CYKJ.tvMap.idData[d.id] = d; 			
			CYKJ.tvMap.panel[d.id] = this;				
		}			
	},	
	getXy1:function(){
		var aY = [],aX = [];
		var aIds = this.aIds;			
		for(var i=0;i<aIds.length;i++){				
			var id = aIds[i];
			var oDiv = document.getElementById(id);			
			var tv_type = oDiv.getAttribute('tv_type');			
			var sCss = oDiv.getAttribute('tv_css');				
			var tv_css = sCss!=undefined ? tv_css = sCss.split(','):CYKJ.tvConstant.D_CSS[tv_type];
			oDiv.className = tv_css!=undefined && (tv_css[0]);	
			var o = CYKJ.tvUtil.getPoint(oDiv);
			var top = o.top,left = o.left;			
			if(top!=0||left!=0){
				this.aData.push({id:id,iX:left,iY:top,tv_type:tv_type,tv_css:tv_css});				
				!CYKJ.tvUtil.contains(aX,left) && (aX.push(left));
				!CYKJ.tvUtil.contains(aY,top) && (aY.push(top));
			}			
		}	
		aX.sort(function(a,b){return a-b});
		aY.sort(function(a,b){return a-b});		
		for(var m=0,len2=aY.length;m<len2;m++){
			for(var n=0;n<this.aData.length;n++){
				this.aData[n].iY == aY[m] && (this.aData[n].x = m);				
			}
		}			
		for(var j=0,len4=aX.length;j<len4;j++){
			for(var k=0;k<this.aData.length;k++){					
				this.aData[k].iX== aX[j] && (this.aData[k].y = j);				
			}
		}		
	},
	getXy2:function(data){		
		for(var i=0;i<data.length;i++){
			var id = data[i].id;
			var oDiv = document.getElementById(id);			
			var tv_type = oDiv.getAttribute('tv_type');			
			var sCss = oDiv.getAttribute('tv_css');				
			var tv_css = sCss!=undefined ? tv_css = sCss.split(','):CYKJ.tvConstant.D_CSS[tv_type];
			oDiv.className = tv_css!=undefined && (tv_css[0]);			
			this.aData[i]=data[i],this.aData[i].tv_type = tv_type,this.aData[i].tv_css =tv_css;
		}			
	},
	addMethod:function(d){
		var _pthis = this;
		var oDiv = document.getElementById(d.id);	
		d.up = function(fn){return typeof fn == 'function' ? d.up = fn : true};
		d.right = function(fn){return typeof fn == 'function' ? d.right = fn : true};
		d.down = function(fn){return typeof fn == 'function' ? d.down = fn : true};
		d.left = function(fn){return typeof fn == 'function' ? d.left = fn : true};
		d.loseFocus = function(fn){typeof fn == 'function' && (d.loseFocus = fn)};
		d.getFocus = function(fn){typeof fn == 'function' && (d.getFocus = fn)};
		d.attr = function(){			
			if(arguments.length == 2){
				d[arguments[0]] = arguments[1];
				if(arguments[0]=='name'){CYKJ.tvMap.nameData[arguments[1]] = d}	
				if(arguments[0]=='tv_css'){						
					_pthis.loadCss();					
					CYKJ.tvMethod.sId !="" && (CYKJ.tvMethod.setFocusId(CYKJ.tvMethod.sId));	
				}	
				return d
			}
			if(typeof arguments[0]== 'string'){
				return d[arguments[0]];
			}else{
				var obj = arguments[0];
				for(var o in obj){
					d[o] = obj[o];	
					(o=='name') && (CYKJ.tvMap.nameData[obj[o]] = d);					
					if(o=='tv_css'){
						_pthis.loadCss();	
						CYKJ.tvMethod.sId !="" && (CYKJ.tvMethod.setFocusId(CYKJ.tvMethod.sId));	
					}	
				}
				return d
			}	
			function loadCss(){
				for(var i=0;i<_pthis.aData.length;i++){			
					document.getElementById(_pthis.aIds[i]).className = _pthis.aData[i].tv_css!=undefined && (_pthis.aData[i].tv_css[0]);
				}	
			}
		};		
		switch(d.tv_type){
			case 'tv_button': d.ok = function(fn){typeof fn == 'function' && (d.ok = fn)};break;
			case 'tv_password':{
				d.val = function(data){
					if(data == undefined){						
						return 	CYKJ.tvMap.value[d.id];					
					}else{						
						if(d.tv_type == 'tv_password'){
							var s ='';						
							for(var i=0;i<(data+'').length;i++){s+='*'}
							oDiv.innerHTML = s;CYKJ.tvMap.value[d.id] = data;
						}
						return d;
					}
				};
				break;
			}
			case 'tv_text':{	
				d.placeholder = oDiv.getAttribute('placeholder');
				d.placeholder!=undefined && (oDiv.innerHTML = d.placeholder);
				d.maxlength = oDiv.getAttribute('maxlength');
				d.content = oDiv.getAttribute('content');
				d.val = function(data){
					if(data == undefined){	
						var data = oDiv.innerHTML.replace(d.placeholder,'');
						CYKJ.tvMap.value[d.id] = data;
						return data;					
					}else{
						CYKJ.tvMap.value[d.id] = data;oDiv.innerHTML = data;						
						return d;
					}
				};
				d.ok = function(fn){typeof fn == 'function' && (d.ok = fn)};
				d.bindSoftKey = function(obj){softKey != undefined && (softKey.init(d.id,obj))};	
				d.getFocus = function(fn){
					d.placeholder !=undefined && (oDiv.innerHTML = oDiv.innerHTML.replace(d.placeholder,''));
					typeof fn == 'function' && (d.getFocus = fn)
				};
				d.loseFocus = function(fn){					
					oDiv.innerHTML ==""&& document.getElementById('key_board')== null && (oDiv.innerHTML=d.placeholder);
					typeof fn == 'function' && (d.loseFocus = fn)
				};
				break;
			}
			case 'tv_select':{
				d.val = function(data){
					if(data == undefined){
						return 	CYKJ.tvMap.value[d.id];					
					}else{		
						var flag = true;
						for(var i=0;i<d.option.length;i++){
							if(d.option[i].value == data){
								CYKJ.tvMap.value[d.id] = data;
								oDiv.innerHTML = d.option[i].text;
								flag = false;							
							}
						}
						flag && (alert('下拉框选项中不存在这个值，请输入正确的值'));	
						return d;
					}
				};
				break;
			}
			case 'tv_radio':{				
				d.name = oDiv.getAttribute('tv_name');
				d.value = oDiv.getAttribute('tv_value');
				d.name!=undefined && (CYKJ.tvMap.nameData[d.name] = d);
				var _this = this;
				d.val = function(data){	
					if(data == undefined){
						return 	CYKJ.tvMap.value[d.name];					
					}else{
						var name = d.name;
						var flag = true;
						for(var i=0;i<_this.aData.length;i++){
							var rData = _this.aData[i];
							if(rData.name != undefined && rData.name == name){
								if(rData.value == data){
									var css = document.getElementById(rData.id).className;
									document.getElementById(rData.id).className = css == rData.tv_css[0]?rData.tv_css[2]:rData.tv_css[3];
									flag = false;	
								}else{
									document.getElementById(rData.id).className = rData.tv_css[0];	
								}									
							}						
						}					
						flag ? alert('单选框选项中不存在这个值，请输入正确的值') : CYKJ.tvMap.value[d.name]=data;	
						return d;
					}
				};
				d.ok = function(fn){typeof fn == 'function' && (d.ok = fn)};
				break;
			} 
			case 'tv_checkbox':{				
				d.name = oDiv.getAttribute('tv_name');
				d.value = oDiv.getAttribute('tv_value');
				d.name!=undefined && (CYKJ.tvMap.nameData[d.name] = d);
				var _this = this;
				d.val = function(data){	
					if(data == undefined){
						return 	CYKJ.tvMap.value[d.name];					
					}else{
						var name = d.name;
						var flag = true;					
						for(var i=0;i<_this.aData.length;i++){
							var rData = _this.aData[i];							
							if(rData.name != undefined && rData.name == name){							
								document.getElementById(rData.id).className = rData.tv_css[0];
								var r_aData = data.split(',');							
								for(var j=0;j<r_aData.length;j++){								
									if(rData.value == r_aData[j]){
										document.getElementById(rData.id).className = rData.tv_css[2];
										flag = false;	
									}
								}								
							}						
						}
						flag ? alert('多选框选项中不存在这个值，请输入正确的值') : CYKJ.tvMap.value[d.name]=data;	
						return d;
					}
				};
				break;
			}
			case 'tv_special' :{
				d.ok = function(fn){typeof fn == 'function' && (d.ok = fn)};
				d.doKeyBoardMethod = function(fn){					
					typeof fn == 'function' && (d.dokeyBoardMethod = fn)
				};					
				break;
			}
		}		
	},
	setMouseEnable:function(){			
		for(var i=0;i<this.aData.length;i++){			
			CYKJ.tvMethod.supportMouse ? bindMouse(this.aData[i].id) : removeMouse(this.aData[i].id);			
		}
		function bindMouse(sId){				
			var oDiv = document.getElementById(sId);			
			oDiv.onmouseover = function (){CYKJ.tvMethod.setFocusId(sId)};
			oDiv.onclick = function (){CYKJ.tvMethod.onOk()};
		}
		function removeMouse(sId){
			var oDiv = document.getElementById(sId);			
			oDiv.onmouseover = null;
			oDiv.onclick = null;	
		}
	}
}

CYKJ.tvMethod = {
	sId:'',
	supportMouse:true,
	setSupportMouse:function(flag){	
		this.supportMouse =flag;
		CYKJ.tvMap.panel[this.sId].setMouseEnable();		
	},
	setFocusId:function(sId){
		this.sId != '' && document.getElementById(this.sId) != undefined && (this.loseFocus(),this.onLoseFocus()); //原元素失去焦点			
		if(this.sId != "" &&  CYKJ.tvMap.panel[this.sId].name != undefined && CYKJ.tvMap.panel[this.sId].name != CYKJ.tvMap.panel[sId].name){	
			console.log(CYKJ.tvMap.panel[this.sId].name,this.sId)
			document.body.removeChild(document.getElementById(CYKJ.tvMap.panel[this.sId].name));
			delete CYKJ.tvMap.panel[this.sId];
		}	
		this.sId = sId;
		var o = document.getElementById(sId);
		var d = CYKJ.tvMap.idData[sId];
		if(d.tv_css!=undefined){
			o.className == d.tv_css[0] &&(o.className=d.tv_css[1]);
			o.className == d.tv_css[2] &&(o.className=d.tv_css[3]);
		}
		this.onGetFocus();
	},
	loseFocus:function(){		
		var o = document.getElementById(this.sId);
		var d = CYKJ.tvMap.idData[this.sId];
		if(d.tv_css!=undefined){
			o.className == d.tv_css[1] &&(o.className=d.tv_css[0]);
			o.className == d.tv_css[3] &&(o.className=d.tv_css[2]);	
		}
	},
	moveFocus:function(x, y) {		
		var aTwoData = CYKJ.tvMap.panel[CYKJ.tvMethod.sId].aTwoData;
		var aFocusData = CYKJ.tvMap.idData[CYKJ.tvMethod.sId];
		var _x = (aFocusData.x + x + aTwoData.length) % aTwoData.length;
		if (!aTwoData[_x]) {			
			x = x > 0 ? x + 1 : x - 1;		
			return arguments.callee(x, y);
		}		
		var _length = aTwoData[_x].length > aTwoData[aFocusData.x].length ? aTwoData[_x].length : aTwoData[aFocusData.x].length;
		var _y = (aFocusData.y + y + _length) % _length;		
		if (!aTwoData[_x][_y]) {
			if (_x != aFocusData.x) {// 纵向移动 0/-1/1/-2/2				
				y = y >= 0 ? (y + 1) * -1 : y * -1;
				y = (aFocusData.y + y) < 0 ? y * -1 : y;
				y = (aFocusData.y + y) >= _length ? (y + 1) * -1 : y;
			} else {// 横向移动				
				y = y == 0 ? 0 : y / Math.abs(y) * (Math.abs(y) + 1);
			}
			return arguments.callee(x, y);
		}
		return {x : _x,y : _y};
	},	
	moveBack : function(o){		
		var aTwoData = CYKJ.tvMap.panel[this.sId].aTwoData;
		this.setFocusId(aTwoData[o.x][o.y].id)
	},
	onOk:function(){
		var d = CYKJ.tvMap.idData[this.sId];
		CYKJ.tvComponent[d.tv_type]!=undefined && (CYKJ.tvComponent[d.tv_type].ok());
		switch(d.tv_type){
			case 'tv_button':d.ok();break;
			case 'tv_text':d.ok();break;
			case 'tv_radio':d.ok();break;
			case 'tv_special':d.ok();break;
		}		
	},
	onDelete:function(id){
		var id = id!=undefined ? id :this.sId;	
		var d = CYKJ.tvMap.idData[id];
		if((d.tv_type=='tv_password'||d.tv_type=='tv_text') && CYKJ.tvMap.panel[id].name == undefined){			
			var oDiv = document.getElementById(id);	
			var s = oDiv.innerHTML;			
			s=s.substr(s.length-5)=='&amp;' ? s.substring(0,(s).length-5) : s.substring(0,(s).length-1);
			oDiv.innerHTML=s;
			CYKJ.tvMap.value[id] = s;//保存文本框中数据			
		}
		if(d.tv_type=='tv_special'){	
			d.key="DEL";
			typeof (d.dokeyBoardMethod)== 'function' && (d.dokeyBoardMethod());					
		}
	},
	onInput:function(key,id){
		var id = id!=undefined ? id :this.sId;	
		var d = CYKJ.tvMap.idData[id];
		var oDiv = document.getElementById(id);	
		switch(d.tv_type){
			case 'tv_password':{
				if(CYKJ.tvMap.panel[id].name == undefined){
					var maxLength=6;				
					d.maxlength != undefined && (maxLength = d.maxlength);
					if(oDiv.innerHTML.length>=maxLength)return;
					oDiv.innerHTML += '*';
					var oValue = CYKJ.tvMap.value;
					var s = oValue[id] != undefined ? oValue[id] :'';
					oValue[id] = s+key;	
				}
				break;
			}
			case 'tv_text':{				
				if(d.content =='number'){
					var reg1 = /^[0-9]{1}$/;
					if(!reg1.test(key)){return false}
				}				
				var maxLength = 15;			
				d.maxlength != undefined && (maxLength = d.maxlength);
				if(oDiv.innerHTML.length >= maxLength)return;				
				oDiv.innerHTML += key;
				CYKJ.tvMap.value[id] = oDiv.innerHTML;//保存文本框中数据							
				break;
			}
			case 'tv_special':{
				d.key = key;
				typeof (d.dokeyBoardMethod)== 'function' && (d.dokeyBoardMethod());	
				break;
			}
		}			
	},
	onUp:function(){		
		return CYKJ.tvMap.idData[this.sId].up();
	},
	onRight:function(){
		return CYKJ.tvMap.idData[this.sId].right();
	},
	onDown:function(){
		return CYKJ.tvMap.idData[this.sId].down();
	},
	onLeft:function(){		
		return CYKJ.tvMap.idData[this.sId].left();
	},
	onLoseFocus:function(){
		CYKJ.tvMap.idData[this.sId].loseFocus();
	},
	onGetFocus:function(){
		CYKJ.tvMap.idData[this.sId].getFocus();
	},
	tvLoad:function(oDiv,data){		
		var oDoms = oDiv.getElementsByTagName('*');
		var aIds = [];		
		for(var i=0;i<oDoms.length;i++){				
			var t = oDoms[i].getAttribute('tv_type');	
			if(t != undefined){
				if(t != 'tv_select'&&t !='tv_checkbox'&&t !='tv_password'&&t !='tv_text'&&t !='tv_radio'&&t !='tv_button'&&t!='tv_special'){
					alert('元素'+oDoms[i].id+'的类型'+t+'定义错误，没有这种组件！');
					return false;
				}				
				aIds.push(oDoms[i].id);						
			}
		}
		CYKJ.tvMap.panel[aIds[0]] !=undefined && (delete CYKJ.tvMap.panel[aIds[0]]);
		new CYKJ.tvPanel({'ids':aIds,data:data});		
	},
	goBack:function(){
		//关闭密码框
		if(document.getElementById('tv_pass_keyboard')!=undefined){
			CYKJ.tvComponent.tv_password.goBack();
			return
		}
		//关闭键盘
		if(document.getElementById('key_board')!= undefined){
			softKey.goBack();
			return 
		}
		typeof goBack == 'function' && (goBack());		
	}
}

CYKJ.tvComponent = {
	tv_password:{
		aCss: ["pass-num-0","pass-num-1","pass-num-2","pass-num-3","pass-num-4","pass-num-5","pass-num-6","pass-num-7","pass-num-8","pass-num-9"],
		aIds:['tv_pass_key_0','tv_pass_key_1','tv_pass_key_2','tv_pass_key_3','tv_pass_key_4','tv_pass_key_5',
			  'tv_pass_key_6','tv_pass_key_7','tv_pass_key_8','tv_pass_key_9','tv_pass_key_10','tv_pass_key_11'],
		sOldId:'',
		sPbId:'',
		init:function(){
			this.sOldId = CYKJ.tvMethod.sId;			
			this.createPassBoard();			
		},
		createPassBoard:function(){
			var oPassDiv = document.getElementById(this.sOldId); //密码文本框id				
			this.aCss.sort(function(a, b){return Math.random()>.5 ? -1 : 1});
			var oDiv = document.createElement('div');
			var sPbId = "tv_pass_keyboard";
			this.sPbId = sPbId;
			oDiv.id = sPbId;
			oDiv.className = "tv_pass_keyboard";			
			var o = CYKJ.tvUtil.getPoint(oPassDiv);
			oDiv.style.top = o.top+'px';
			oDiv.style.left = o.left+parseInt(CYKJ.tvUtil.getStyle(oPassDiv,'width').replace('px',''))+10+'px';
			document.body.appendChild(oDiv);
			var oSname = document.createElement('span');
			oSname.className = 'tv_pass_keyBoardName';
			oSname.innerHTML = "密码软键盘";
			oDiv.appendChild(oSname);			
			for(var i =0;i<12;i++){
				var oSpan = document.createElement('span');
				var sTop = "",sLeft = "";
				var sCss = this.aCss[i]+','+this.aCss[i]+'-focus';
				oSpan.setAttribute('tv_css',sCss);
				oSpan.setAttribute('tv_type','tv_password');
				if(i<4){			
					sTop = '35px',sLeft = (50*i+7)+'px';					
				}else if(i>=4&&i<8){			
					sTop = '85px',sLeft = (50*(i-4)+7)+'px';					
				}else if(i>=8){			
					sTop = '135px',sLeft = (50*(i-8)+7)+'px';	
					i==10&&(oSpan.setAttribute('tv_css','pass-num-del,pass-num-del-focus'));
					i==11&&(oSpan.setAttribute('tv_css','pass-num-close,pass-num-close-focus'));
				}
				oSpan.id = this.aIds[i];				
				oSpan.style.top = sTop;
				oSpan.style.left = sLeft;								
				oDiv.appendChild(oSpan);
			}	
			this.createPassBoardPanel();
		},
		createPassBoardPanel:function(){	
			var aIds = this.aIds;			
			new CYKJ.tvPanel({ids:aIds,name:this.sPbId});		
			CYKJ.tvMethod.setFocusId('tv_pass_key_11');			
		},
		ok:function(){		
			var m = CYKJ.tvMethod;
			if(CYKJ.tvMap.panel[m.sId].name != undefined){	
				var d = CYKJ.tvMap.idData[m.sId]
				var key = d.tv_css[0].split('-')[2];							
				if(key<=9){	
					m.onInput(key,this.sOldId);						
				}else if(key=="close"){					
					m.setFocusId(this.sOldId);
				}else{	
					m.onDelete(this.sOldId);				
				}	
			}else{
				this.init();
			}	
		},
		goBack:function(){
			CYKJ.tvMethod.setFocusId(this.sOldId);	
		}
	},
	tv_select:{
		sOldId:'',
		sIds:[],
		tv_css:['tv_select_span1','tv_select_span2'],
		selectId:'',
		length:10,
		init:function(){
			this.sOldId = CYKJ.tvMethod.sId;	
			this.createSelectBoard();				
		},
		createSelectBoard:function(){			
			var oTextDiv = document.getElementById(this.sOldId); //下拉框id			
			var aOptions = CYKJ.tvMap.idData[this.sOldId].option;
			if(aOptions == undefined){
				alert('元素select['+this.sOldId+']的option没有定义!');
				return false;
			}
			this.length = aOptions.length<10 ? aOptions.length :10;
			var oDiv = document.createElement('div');
			this.selectId = 'tv_select_board';
			oDiv.id = this.selectId;
			oDiv.className = 'tv_select_board';
			document.body.appendChild(oDiv);			
			var o = CYKJ.tvUtil.getPoint(oTextDiv);			
			var w = parseInt(CYKJ.tvUtil.getStyle(oTextDiv,'width').replace('px',''));
			var	h= parseInt(CYKJ.tvUtil.getStyle(oTextDiv,'height').replace('px',''));
			oDiv.style.left = o.left+'px';
			oDiv.style.top = o.top+h+'px';
			oDiv.style.width = w+'px';
			oDiv.style.height = this.length*h+'px';
			var sIds = [];		
			for(var i =0;i<this.length;i++){
				var s = document.createElement('span');
				var id = 'tv_select_'+i;
				s.id = id;				
				sIds.push(id);
				this.sIds = sIds;	
				s.className = this.tv_css[0];
				s.innerHTML = aOptions[i].text;
				s.style.width = w +'px';
				s.style.height = h + 'px';
				s.style.lineHeight = h + 'px';
				s.style.top = h*i +'px';
				s.style.left = 0;
				s.setAttribute('tv_type','tv_select');
				s.setAttribute('tv_css',this.tv_css);
				(i==0) && (s.style.borderTop = '1px solid #000000');				
				oDiv.appendChild(s);
			}		
			this.createSelectPanel();
		},
		createSelectPanel:function(){
			var sIds = this.sIds;				
			new CYKJ.tvPanel({ids:sIds,name:this.selectId});			
			var value = CYKJ.tvMap.value[this.sOldId];			
			if(value == undefined){
				CYKJ.tvMethod.setFocusId('tv_select_0');
			}else{
				var sOptions = CYKJ.tvMap.idData[this.sOldId].option;
				for(var j=0;j<this.length;j++){
					if(sOptions[j].value == value){
						CYKJ.tvMethod.setFocusId('tv_select_'+j);
						return false;
					}
				}
			}				
		},
		ok:function(){					
			var m = CYKJ.tvMethod;
			if(CYKJ.tvMap.panel[m.sId].name != undefined){					
				var aOptions = CYKJ.tvMap.idData[this.sOldId].option;				
				var d = CYKJ.tvMap.idData[m.sId]				
				var oDiv = document.getElementById(this.sOldId);					
				oDiv.innerHTML = aOptions[d.x].text;
				CYKJ.tvMap.value[this.sOldId] = aOptions[d.x].value;					
				m.setFocusId(this.sOldId);				
			}else{
				this.init();				
			}	
		}
	},		
	tv_radio:{
		ok:function(){
			var oDiv = document.getElementById(CYKJ.tvMethod.sId);
			var panel = CYKJ.tvMap.panel[CYKJ.tvMethod.sId];
			var d = CYKJ.tvMap.idData[CYKJ.tvMethod.sId];			
			if(d.name==undefined){
				alert('元素rodio['+d.id+']的name没有定义!');
				return false;
			}
			for(var i=0;i<panel.aData.length;i++){				
				panel.aData[i].name == d.name && (document.getElementById(panel.aData[i].id).className=panel.aData[i].tv_css[0])
			}				
			oDiv.className=d.tv_css[3];
			CYKJ.tvMap.value[d.name] = d.value;				
		}	
	},
	tv_checkbox:{
		ok:function(){
			var oDiv = document.getElementById(CYKJ.tvMethod.sId);
			var panel = CYKJ.tvMap.panel[CYKJ.tvMethod.sId];
			var d = CYKJ.tvMap.idData[CYKJ.tvMethod.sId];
			var sValues = "";	
			oDiv.className == d.tv_css[1] ? oDiv.className=d.tv_css[3] : oDiv.className=d.tv_css[1];
			for(var i=0;i<panel.aData.length;i++){
				var aData = panel.aData[i];				
				if(aData.tv_type== 'tv_checkbox' && aData.name == d.name){					
					var oId = document.getElementById(aData.id);						
					if(oId.className == d.tv_css[2] || oId.className == d.tv_css[3]){
						sValues += aData.value+',';
					}					
				}
			}			
			CYKJ.tvMap.value[d.name] = sValues;				
		}	
	}	
}

function myAddEvent(obj, sEv, fn){
	obj.attachEvent ? obj.attachEvent('on'+sEv, function (){fn.call(obj)}) : obj.addEventListener(sEv, fn, false);
}

function $tv(vArg){		
	switch(typeof vArg){
		case 'function'	: myAddEvent(window, 'load', vArg); break;
		case 'string' : 			
			switch(vArg.charAt(0)){
				case '#':	//ID						
					return CYKJ.tvMap.idData[vArg.substring(1)];
				case '.':	//name							
					return CYKJ.tvMap.nameData[vArg.substring(1)];														
			}
			break;
		case 'object':
			this[vArg];
	}		
}

$tv.tvLoad = function(oDiv,data){	
	CYKJ.tvMethod.tvLoad(oDiv,data);
}

$tv.setFocusId = function(id){
	var oDiv = document.getElementById(id);
	if(oDiv==undefined){alert('id['+id+']没有定义');return}
	CYKJ.tvMethod.setFocusId(id);
}
$tv.setSupportMouse = function(flag){
	CYKJ.tvMethod.setSupportMouse(flag);
}

$tv.alert = function(str,obj){	
	$tv.alert.createAlertHtml(str,obj);	
}
$tv.alert.createAlertHtml = function(str,obj){
	var oDivFade = document.createElement('div');
	oDivFade.className = 'alert_fade';
	document.body.appendChild(oDivFade);		
	var oDiv = document.createElement('div');
	oDiv.id = 'alert_div';
	oDiv.className = 'alert_div';
	var confirmArray = [];
	confirmArray.push('<div class="wrapOut"><div class="wrapBar"><div class="wrap_title">提示对话框</div></div>');
	confirmArray.push('<div class="wrapBody">'+str+'</div>');
	confirmArray.push('<div id="alert_close"  tv_type="tv_button" tv_css="css1,css2" style="position:absolute;bottom:20px;left:0;right:0;margin:auto;">关闭</div>');	
	oDiv.innerHTML = confirmArray.join('');
	if(obj!=undefined){		
		obj.width!=undefined && (oDiv.style.width = obj.width);
		obj.height!=undefined && (oDiv.style.height = obj.height);
	}
	document.body.appendChild(oDiv);	
	var sOldId = CYKJ.tvMethod.sId;
	var ids = ['alert_close'];
	new CYKJ.tvPanel({ids:ids,name:'alert_div'});	
	CYKJ.tvMethod.setFocusId('alert_close');	
	$tv('#alert_close').ok(function(){			
		CYKJ.tvMethod.setFocusId(sOldId);
		document.body.removeChild(oDivFade);		
	})
}

$tv.confirm = function(obj){	
	$tv.confirm.createConfirmHtml(obj);	
}
$tv.confirm.createConfirmHtml = function(obj){
	var oDivFade = document.createElement('div');
	oDivFade.className = 'alert_fade';
	document.body.appendChild(oDivFade);		
	var oDiv = document.createElement('div');
	oDiv.id = 'confirm_div';
	oDiv.className = 'alert_div';
	var confirmArray = [];
	confirmArray.push('<div class="wrapOut"><div class="wrapBar"><div class="wrap_title">确认对话框</div></div>');
	confirmArray.push('<div class="wrapBody">'+obj.content+'</div>');
	confirmArray.push('<div id="confirm_close"  tv_type="tv_button" tv_css="css1,css2" style="position:absolute;bottom:20px;left:10%;">确认</div>');
	confirmArray.push('<div id="confirm_cancel" tv_type="tv_button" tv_css="css1,css2" style="position:absolute;bottom:20px;right:10%;">取消</div></div>')
	oDiv.innerHTML = confirmArray.join('');
	document.body.appendChild(oDiv);	
	if(obj.size!=undefined){		
		obj.size.width!=undefined && (oDiv.style.width = obj.size.width);
		obj.size.height!=undefined && (oDiv.style.height = obj.size.height);
	}
	var sOldId = CYKJ.tvMethod.sId;
	var ids = ['confirm_close','confirm_cancel'];
	new CYKJ.tvPanel({ids:ids,name:'confirm_div'});	
	CYKJ.tvMethod.setFocusId('confirm_close');	
	$tv('#confirm_close').ok(function(){									
		CYKJ.tvMethod.setFocusId(sOldId);
		document.body.removeChild(oDivFade);
		obj.onClose(true);
	})
	$tv('#confirm_cancel').ok(function(){			
		CYKJ.tvMethod.setFocusId(sOldId);
		document.body.removeChild(oDivFade);
		obj.onClose(false);
	})
}

$tv.ajax = function(options) {
	options = options || {};
	options.type = (options.type || "GET").toUpperCase();
	options.dataType = options.dataType || "json";
	var params = formatParams(options.data);	
	if (window.XMLHttpRequest) {//创建 - 非IE6 - 第一步
		var xhr = new XMLHttpRequest();
	} else { //IE6及其以下版本浏览器
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhr.onreadystatechange = function () {	//接收 - 第三步
		if (xhr.readyState == 4) {
			var status = xhr.status;
			if (status >= 200 && status < 300) {
				options.success && options.success(options.dataType=="json"?JSON.parse(xhr.responseText):xhr.responseText, xhr.responseXML);
			} else {
				options.fail && options.fail(status);
			}
		}
	}	
	if (options.type == "GET") {//连接 和 发送 - 第二步
		xhr.open("GET", options.url + "?" + params, true);
		xhr.send(null);
	} else if (options.type == "POST") {
		xhr.open("POST", options.url, true);		
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");//设置表单提交时的内容类型
		xhr.send(params);
	}	
	function formatParams(data) {
		var arr = [];
		for (var name in data) {
			arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		}
		arr.push(("v=" + Math.random()).replace("."));
		return arr.join("&");
	}
}

function freeKeyDown(flag){
	if(CYKJ.tvUtil.isAndroid()==false){return}
	var reg = /Android\s{0,10}2\.2\.1/;   //安卓2.2.1不支持 JS调用APK 
	var str = navigator.userAgent;    
	if(reg.test(str)){
		var _cmd = flag ? "cypayott://freeKeyDown=true" : "cypayott://freeKeyDown=false" ;
		window.setTimeout(function(){
			window.location.href = _cmd ; 
		},500); 
	}
	else{		
		window.cykj.freeKeyDown(flag ? true : false);  
	}  		
}
$tv.loadInit = function(obj){	
	obj!=undefined ? CYKJ.tvMethod.tvLoad(document,obj.data):CYKJ.tvMethod.tvLoad(document);	
	obj!=undefined && obj.id!=undefined && (CYKJ.tvMethod.setFocusId(obj.id));
}
$tv(function(){
	freeKeyDown(true);//默认支持安卓		
	addKeyBoardMethod();	
	function addKeyBoardMethod(){
		if(CYKJ.tvUtil.isAndroid()){			
			window.grepKeyDown = function(keyStr){keyBoardMethod(keyStr)}
		}else{
			document.onkeydown = function(ev){			   
				var oEvent=ev||event,key = oEvent.keyCode,keyStr ="";					
				switch(key){
					case  38:keyStr="up";break;
					case  40:keyStr="down";break;
					case  37:keyStr="left";break;
					case  39:keyStr="right";break;
					case  13:keyStr="ok";break;
					case 640://返回
					case 520:
					case 340:
					case 8:	keyStr="delete";break;
					case 27:keyStr="back";break;
					default:keyStr = "";
				}				
				key>=65 && key<=90 && (keyStr = CYKJ.tvConstant.letterMap[key]);//字母a-z
				key>=48 && key<=57 && (keyStr = ''+(key-48));//键盘数字0-9
				key>=96 && key<=105 && (keyStr=''+(key-96));//键盘锁打开小键盘数字键			
				keyBoardMethod(keyStr);	
				return false;
			}
		}	
	}	
	function keyBoardMethod(keyStr){
		var m = CYKJ.tvMethod;
		switch (keyStr){
			case "ok": m.onOk();break;	
			case "delete": m.onDelete();break;		
			case "back": CYKJ.tvMethod.goBack();break;
			case "right": m.onRight() && (m.moveBack(m.moveFocus(0,1)));break;
			case "left": m.onLeft() && (m.moveBack(m.moveFocus(0,-1)));break;
			case "up": m.onUp() && (m.moveBack(m.moveFocus(-1,0)));break;
			case "down": m.onDown() && (m.moveBack(m.moveFocus(1,0)));break;
		}			
		var reg1 = /^[0-9]{1}$/,reg2 = /^[a-z]{1}$/ ;//匹配数字,匹配字母
		(reg1.test(keyStr) || reg2.test(keyStr)) && (m.onInput(keyStr));
	}				 
})
var tvQuery = $tv;

var imgReady = (function(){
	var list = [],intervalId = null; 	
	var queue = function(){ // 用来执行队列
		for(var i = 0; i < list.length; i++){
			list[i].end ? list.splice(i--,1) : list[i]();
		}
		!list.length && stop();
	};   	
	var stop = function(){// 停止所有定时器队列
		clearInterval(intervalId);
		intervalId = null;
	}
	return function(url, ready, error) {
		var onready = {}, 
			width, 
			height, 
			newWidth, 
			newHeight,
			img = new Image();
		img.src = url; 		
		if(img.complete) {// 如果图片被缓存，则直接返回缓存数据
			ready.call(img);
			return;
		}
		width = img.width;
		height = img.height; 		
		img.onerror = function () {// 加载错误后的事件 
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		}; 		
		var onready = function() {// 图片尺寸就绪
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||
				// 如果图片已经在其他地方加载可使用面积检测
				newWidth * newHeight > 1024
			) {
				ready.call(img);
				onready.end = true;
			};
		};
		onready();		
		img.onload = function () {// 完全加载完毕的事件
			// onload在定时器时间差范围内可能比onready快
			// 这里进行检查并保证onready优先执行
			!onready.end && onready();
			// IE gif动画会循环执行onload，置空onload即可
			img = img.onload = img.onerror = null;
		};
		// 加入队列中定期执行
		if (!onready.end) {
			list.push(onready);
			// 无论何时只允许出现一个定时器，减少浏览器性能损耗
			if (intervalId === null) {
				intervalId = setInterval(queue, 40);
			};
		};
	}
})();

$tv.lazyload = function(){
	$tv.loadImgs(document.getElementsByTagName('img'));
}

$tv.loadImgs=function(imgs,dSrc){
	for(var i=0;i<imgs.length;i++){			
		imgs[i].src == "" && (imgs[i].src = dSrc||CYKJ.tvConstant.defaultSrc);
		if(imgs[i].getAttribute('xSrc')!=undefined){
			(function(num){				
				var xSrc = imgs[num].getAttribute('xSrc');				
				imgReady(xSrc,function(){
					imgs[num].src = xSrc;				
				});	
			}(i))
		}
	}		
}