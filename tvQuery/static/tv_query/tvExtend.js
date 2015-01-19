/******************JS中文键盘******************/
var softKey = {
	sTextId : "",
	sDivId :"",
	aSignIds:[],
	aSoftIds:[],
	keyStatus:1,//默认为1：中文输入（1中文输入2小写字母输入3大写字母输入）
	aKeys:['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'],
	keyStrJson :{'a':65,'b':66,'c':67,'d':68,'e':69,'f':70,'g':71,'h':72,'i':73,'j':74,'k':75,'l':76,'m':77,'n':78,
				'o':79,'p':80,'q':81,'r':82,'s':83,'t':84,'u':85,'v':86,'w':87,'x':88,'y':89,'z':90,'下页':187,'上页':189,
				'CapsLock':20,'DEL':8,'拼音':32,'English':32,'中/英':20},
	init:function(id,obj){
		this.sTextId = id; //获取文本框ID
		var oDiv = document.createElement('div');			
		oDiv.id = this.sDivId = 'key_board';	
		oDiv.className = 'key_board';
		if(obj!=undefined){
			for(var o in obj){oDiv.style[o] = obj[o]}
		}		
		document.body.appendChild(oDiv);//创建键盘最外层DIV		
		this.createSignBoard(); //创建符号键盘
		this.createSoftBoard();//创建中文输入键盘		
	},
	createSignBoard:function(){			
		var ulHtml = '<ul id="sign_board" class="sign_board" style="display:block"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li><li>!</li><li>@</li><li>#</li><li>$</li><li>%</li><li>^</li><li>&</li><li>*</li><li>(</li><li>)</li><li>"</li><li>"</li><li>=</li><li>.</li><li>、</li><li>:</li><li>;</li><li>?</li><li>~</li><li>,</li><li>关闭</li><li>返回</li><li>DEL</li><li>空格</li><li>+</li><li>-</li><li>*</li><li>/</li><li>_</li></ul>';
		var oDiv = document.createElement('div');	
		oDiv.id = 'signBoard';
		oDiv.innerHTML = ulHtml;
		document.getElementById(this.sDivId).appendChild(oDiv);
		var oLis = oDiv.getElementsByTagName('li');
		var tv_css = ['css1','css2'];
		for(var i =0;i<oLis.length;i++){
			oLis[i].id = this.aSignIds[i] = 'tv_sign_'+i;
			oLis[i].setAttribute('tv_type','tv_special');			
			oLis[i].setAttribute('tv_css',tv_css);	
		}		
		new CYKJ.tvPanel({ids:this.aSignIds,name:this.sDivId});			
		document.getElementById('signBoard').style.display = 'none';
		this.bindSingMethod();
	},
	createSoftBoard:function(){
		var divHTML ='<div id="chooseInput"></div><div id="chooseBoard"></div></div>';
		var ulHtml = '<ul id="soft_board" class="soft_board" style="display: block;"><li>q</li><li>w</li><li>e</li><li>r</li><li>t</li><li>y</li><li>u</li><li>i</li><li>o</li><li>p</li><li>a</li><li>s</li><li>d</li><li>f</li><li>g</li><li>h</li><li>j</li><li>k</li><li>l</li><li>CapsLock</li><li>z</li><li>x</li><li>c</li><li>v</li><li>b</li><li>n</li><li>m</li><li>DEL</li><li>关闭</li><li>?123</li><li>中/英</li><li>拼音</li><li>上页</li><li>下页</li><li>Clear</li></ul>';		
		var oDiv = document.createElement('div');	
		oDiv.id = 'softBoard';
		oDiv.innerHTML = divHTML + ulHtml;	
		document.getElementById(this.sDivId).appendChild(oDiv);		
		var oLis = oDiv.getElementsByTagName('li');
		var tv_css = ['css1','css2'];
		var tv_css19 = ['css19_1','css19_2','css19_3','css19_4'];
		for(var i =0;i<oLis.length;i++){
			oLis[i].id =this.aSoftIds[i]='tv_soft_'+i;
			oLis[i].setAttribute('tv_type','tv_special');
			oLis[i].className = 'css1';
			oLis[i].setAttribute('tv_css',tv_css);	
			i==19 && (oLis[i].setAttribute('tv_css',tv_css19));			
		}	
		new CYKJ.tvPanel({ids:this.aSoftIds,name:this.sDivId});			
		CYKJ.tvMethod.setFocusId('tv_soft_28'); //默认焦点设置到关闭键
		this.bindSoftMethod();
	},
	bindSingMethod:function(){
		for(var i=0;i<this.aSignIds.length;i++){this.signOk(i)}	
	},
	signOk:function(i){
		var d = CYKJ.tvMap.idData['tv_sign_'+i];
		var oText = document.getElementById(this.sTextId);
		var _this = this;
		d.ok = function(){
			var key = document.getElementById('tv_sign_'+i).innerHTML;	
			switch(key){
				case '关闭':CYKJ.tvMethod.setFocusId(_this.sTextId);break;
				case '返回':{
					CYKJ.tvMethod.sId ="";
					document.getElementById('signBoard').style.display ='none';	
					document.getElementById('softBoard').style.display ='block';					
					CYKJ.tvMethod.setFocusId('tv_soft_29');			
					break;
				}
				case 'DEL':CYKJ.tvMethod.onDelete(_this.sTextId);break;
				case '空格':oText.innerHTML=oText.innerHTML+" ";break;				
				default:CYKJ.tvMethod.onInput(key,_this.sTextId);
			}			
		};
		d.doKeyBoardMethod(function(){				
			if(this.key=='DEL'){
				CYKJ.tvMethod.onDelete(_this.sTextId);	
			}
		});		
	},
	bindSoftMethod:function(){for(var i=0;i<this.aSoftIds.length;i++){this.softOk(i)}},
	softOk:function(i){
		var d = CYKJ.tvMap.idData['tv_soft_'+i];			
		var _this = this;
		d.ok = function(){
			var key = document.getElementById('tv_soft_'+i).innerHTML;	
			switch(_this.keyStatus){
				case 1:	_this.chinessInput(key);break;
				case 2: _this.smallInput(key);break;
				case 3: _this.bigInput(key);break;				
			}	
			_this.doOtherSoftOk(key);			
		};
		//键盘事件		
		d.doKeyBoardMethod(function(){	
			_this.keyStatus==1&&(_this.keyDown(parseInt(this.key)+48));	
			if(this.key=='DEL'){
				switch(_this.keyStatus){
					case 1 :_this.keyDown(8);break;//中文删除	
					default:CYKJ.tvMethod.onDelete(_this.sTextId);
				}
			}
		});		
	},
	doOtherSoftOk:function(key){
		var oText = document.getElementById(this.sTextId);
		switch(key){			
			case 'English':
			case '拼音':	oText.innerHTML=oText.innerHTML+" ";break;//空格键
			case '中/英':break;
			case '上页':break;
			case '下页':break;
			case 'CapsLock':break;			
			case '关闭':CYKJ.tvMethod.setFocusId(this.sTextId);break;
			case 'DEL':break;
			case 'Clear':oText.innerHTML="";break;
			case '?123':{				
				CYKJ.tvMethod.sId ="";
				document.getElementById('tv_soft_29').className='css1';
				document.getElementById('softBoard').style.display ='none';
				document.getElementById('signBoard').style.display ='block';	
				CYKJ.tvMethod.setFocusId('tv_sign_31');				
				break;
			}			
			default:this.keyStatus!=1 && (CYKJ.tvMethod.onInput(key,this.sTextId));
		}
	},
	chinessInput:function(key){
		var oKey31 = document.getElementById('tv_soft_31');//中英文切换		
		switch (key){
			case '中/英':{ //中英切换键时						
				oKey31.innerHTML ="English";				
				this.keyStatus = 2;//将拼音输入改为小写输入。
				break;
			}
			case 'CapsLock':{	
				var j =0,k=0;
				while(j<=26){
					var oLi = document.getElementById('tv_soft_'+j);			
					if(j==19){	
						var css = CYKJ.tvMap.idData['tv_soft_19'].tv_css;
						oLi.className = css[3];						
						oKey31.innerHTML = 'English';	
						this.keyStatus = 3;//切换大写输入											
						j++;
						oLi = document.getElementById('tv_soft_'+j);	
					}						
					oLi.innerHTML = this.aKeys[k].toUpperCase(); //将字母修改为大写					
					j++;k++;
				}
				break;	
			}
		}							
		this.keyDown(this.keyStrJson[key]);		
	},
	bigInput:function(key){
		switch(key){			
			case 'CapsLock':{
				var j=0,k=0;
				while(j<=26){
					var oLi = document.getElementById('tv_soft_'+j);			
					if(j==19){							
						var css = CYKJ.tvMap.idData['tv_soft_19'].tv_css;
						oLi.className = css[1];
						document.getElementById('tv_soft_31').innerHTML = '拼音';
						this.keyStatus = 1;j++;//将大写输入切换成小写输入
						oLi = document.getElementById('tv_soft_'+j);	
					}						
					oLi.innerHTML = this.aKeys[k]; //将字母修改为小写				
					j++;k++;
				}
				break;
			}			
			case 'DEL':	CYKJ.tvMethod.onDelete(this.sTextId);
		}	
	},
	smallInput:function(key){
		switch (key){	
			case '中/英':{ //小写切换成拼音					
				document.getElementById('tv_soft_31').innerHTML ="拼音";		
				this.keyStatus = 1;
				break;
			}
			case 'CapsLock':{	
				var j =0,k=0;
				while(j<=26){
					var oLi = document.getElementById('tv_soft_'+j);			
					if(j==19){								
						var css = CYKJ.tvMap.idData['tv_soft_19'].tv_css;
						oLi.className = css[3];
						document.getElementById('tv_soft_31').innerHTML = 'English';
						this.keyStatus = 3;j++;//将小写输入切换成大写输入
						oLi = document.getElementById('tv_soft_'+j);	
					}						
					oLi.innerHTML = this.aKeys[k].toUpperCase(); //将字母修改为小写				
					j++;k++;
				}
				break;
			}	
			case 'DEL':	{
				CYKJ.tvMethod.onDelete(this.sTextId);				
				break;
			}
		}	
	},	
	goBack:function(){CYKJ.tvMethod.setFocusId(this.sTextId)}, //ESC键退出键盘
	keyDown:function(iekey){
		var oInput = document.getElementById('chooseInput');
		var oBoard = document.getElementById('chooseBoard');
		var oText = document.getElementById(this.sTextId);
		var KeyCode =String.fromCharCode(iekey)//返回一个由参数中 ASCII 值表示的字符组成的字符串
		var PyKeyCodeNo=oInput.innerHTML.length;	
		switch (iekey) {
			case 8: //删除
				LRkey=0;
				if(oInput.innerHTML!=""){
					oInput.innerHTML=oInput.innerHTML.substring(0,PyKeyCodeNo-1);
				}else{
					var s = oText.innerHTML;
					CYKJ.tvMethod.onDelete(this.sTextId);					
				}
				break;	
			case 20: //CapsLock 大小写切换
				LRkey=0;oBoard.innerHTML = TestTmp = oInput.innerHTML = "";break;		
			case 32: //空格
				TestTmp!="" && (oText.innerHTML=oText.innerHTML+TestTmp.substring(LRkey*10,LRkey*10+1));//选中第一个			
				LRkey=0;oBoard.innerHTML=TestTmp=oInput.innerHTML="";break;	
			case 189: //- 上一页
				TestTmp!="" && (LeftChars(TestTmp));break;
			case 187: //+ 下一页
				TestTmp!="" && (RightChars(TestTmp));break;	
			default:	
				if (iekey>=48 && iekey<=57){ //数字键选字					
					if(KeyCode==0){KeyCode=10;iekey =58;} 
					var letter = TestTmp.substring(LRkey*10+iekey-48-1,LRkey*10+iekey-48);
					oInput.innerHTML!="" && (CYKJ.tvMethod.onInput(letter,this.sTextId));					
					oBoard.innerHTML=TestTmp=oInput.innerHTML="";					
					LRkey=0;
				}else if(iekey>=65 && iekey<=90){			
					if(PyKeyCodeNo>6){return;}				
					oInput.innerHTML=oInput.innerHTML+KeyCode.toLowerCase();
				}				
		}		
		var CharIndex=Dict.indexOf(oInput.innerHTML); //输入字符在字典位置		
		if(CharIndex < 0){			
			oBoard.innerHTML="没有此字";TestTmp="";//如果字典找不到则没有此字
		}else if(oInput.innerHTML==""){
			oBoard.innerHTML=""; //输入字符为空时，将字体选择面板清空
		}else{			
			var char = Dict.substring(CharIndex-1,CharIndex).toLowerCase().charCodeAt(0); //检测输入字符前（）...:ai前）是否字母		
			if(char>=97 && char<=122){ //说明是字母			
				var SeekChar=Dict;
				var SeekCharNum=CharIndex;
				do{
					SeekChar=SeekChar.substring(SeekCharNum+oInput.innerHTML.length);
					SeekCharNum=SeekChar.indexOf(oInput.innerHTML);	
					char=SeekChar.substring(SeekCharNum-1,SeekCharNum).toLowerCase().charCodeAt(0);; //检测下个...:ai前是否字母
					if(char<97||char>122){break}//直到不是字母	
				}while(char>0){
					if(char>0){
						var seeks = SeekChar.substring(SeekCharNum+oInput.innerHTML.length,SeekCharNum+oInput.innerHTML.length+1).charCodeAt(0);
						if(seeks>=97 && seeks<=122){
							for(var i=0;i<=7;i++){ //处理声母后面多的韵母
								var ss=SeekChar.substring(SeekCharNum+i,SeekCharNum+i+1).charCodeAt(0);
								if(ss<97||ss>122){i=i-1;break}	
							}
						}else{
							i=0;	
						}					
						GetTest(SeekChar,SeekCharNum+oInput.innerHTML.length+i)	
					}else{						
						oBoard.innerHTML="没有此字";TestTmp="";
					}		
				}
			}else{
				var sLetter = Dict.substring(CharIndex+oInput.innerHTML.length,CharIndex+oInput.innerHTML.length+1).charCodeAt(0);
				if(sLetter>=97 && sLetter<=122){ //如果后面是字母
					for(var i=0;i<=7;i++){ //处理声母后面多出的韵母
						var s = Dict.substring(CharIndex+i,CharIndex+i+1).charCodeAt(0);
						if(s<97||s>122){i=i-1;break}					
					}
				}else{
					i=0;
				}	
				GetTest(Dict,CharIndex+oInput.innerHTML.length+i);
			}		
		}
		//内部函数
		function GetTest(CharDict,StartIndex){		
			TestTmp="";
			var TenChar="",i=0;
			do{
				i++;
				TestTmp=TestTmp+CharDict.substring(StartIndex+i-1,StartIndex+i);
			}while((CharDict.substring(StartIndex+i-1,StartIndex+i)).charCodeAt(0)<97||(CharDict.substring(StartIndex+i-1,StartIndex+i)).charCodeAt(0)>122){//如果不是字母
				TestTmp=TestTmp.substring(0,TestTmp.length-1);
				if (LRkey==0){
					for(i=1;i<=10;i++){
						Ci=i-1;
						Vi=i;
						(i==10)&&(Vi=0);
						var sChar = TestTmp.substring(Ci+LRkey*10,Ci+LRkey*10+1);					
						sChar!="" && (TenChar=TenChar+Vi+"."+sChar+" ");					
					}			
					oBoard.innerHTML=TenChar;
				}
			}	
			return
		}		
		function LeftChars(TestTmp){
			var i=0,Ci="",Vi="",TenChar="";
			if (LRkey>0){
				LRkey=LRkey-1;
				for(i=1;i<=10;i++){
					Ci=i-1;
					Vi=i;
					i==10 && (Vi=0);				
					var sChar = TestTmp.substring(Ci+LRkey*10,Ci+LRkey*10+1);					
					sChar!="" && (TenChar=TenChar+Vi+"."+sChar+" ");
				}
				oBoard.innerHTML=TenChar;
			}
			return
		}		
		function RightChars(TestTmp){
			var i=0,Ci="",Vi="",TenChar="";
			if ((LRkey*10)<=TestTmp.length-1){
				if(((LRkey+1)*10)<=TestTmp.length-1 ){LRkey=LRkey+1}	
				for(i=1;i<=10;i++){	
					Ci=i-1;
					Vi=i;
					i==10 && (Vi=0);			
					var sChar = TestTmp.substring(Ci+LRkey*10,Ci+LRkey*10+1);					
					sChar!="" && (TenChar=TenChar+Vi+"."+sChar+" ");			
				}
				oBoard.innerHTML=TenChar;	
			}
			return
		}	
	}
}
var TestTmp="";//找到的字符串
var LRkey=0; //翻的页数
/******************JS中文键盘******************/

/******************下拉联动******************/
var linkSelect = {
	aIds:[],
	sBtnId:"",
	aData:[],
	linkBoardId:"",		
	css1:[],
	css2:[],
	chooseNum:0,
	twoNum:0,
	init:function(id,obj){		
		var linkBoardId = "linkBoard";
		var oDiv = document.getElementById('linkBoard');
		if(oDiv==undefined){
			var css1=['one_select1','one_select2'];//有右键头
			var css2=['two_select1','two_select2'];//没右键头
			this.sBtnId = id;
			this.aData = obj.data;
			this.linkBoardId = linkBoardId;			
			this.css1 = obj.css1||css1;
			this.css2 = obj.css2||css2;
			this.createOneBoard();	
		}else{
			document.body.removeChild(oDiv);
			delete CYKJ.tvMap.panel[this.aIds[0]];			
		}
	},
	createOneBoard:function(){
		var sBtnId = this.sBtnId;
		var oBtn = document.getElementById(sBtnId);
		var oDiv = document.createElement('div');
		oDiv.id = this.linkBoardId; 
		oDiv.className = this.linkBoardId;
		var o = CYKJ.tvUtil.getPoint(oBtn);
		oDiv.style.left = o.left+'px';
		oDiv.style.top = o.top +parseInt(CYKJ.tvUtil.getStyle(oBtn,'height').replace('px',''))+'px';	
		
		var oneDiv = document.createElement('div');	
		oneDiv.id = 'linkOneBoard'; 
		document.body.appendChild(oDiv);
		var oneDivArray = [],aIds=[];
		var titleName = oBtn.innerHTML.replace('<span></span>','');		
		for(var i=0;i<this.aData.length;i++){
			var name = this.aData[i].one.name;
			var tvCss = this.aData[i].two!=undefined ? this.css1 : this.css2;			
			oneDivArray.push('<div id="oneSelect_'+i+'" tv_type="tv_button" tv_css="'+tvCss+'">'+name+'</div>');			
			aIds.push('oneSelect_'+i);		
			name == titleName && (this.chooseNum = i);
		}
		oneDiv.innerHTML = oneDivArray.join('');
		oDiv.appendChild(oneDiv);
		new CYKJ.tvPanel({ids:aIds,name:this.linkBoardId});	
		CYKJ.tvMethod.setFocusId('oneSelect_'+this.chooseNum);
		this.createTwoBoard(this.chooseNum)
		this.aIds = aIds;
		this.bindOneMethod();
	},
	bindOneMethod:function(){
		var _this = this;
		CYKJ.tvMap.idData['oneSelect_0'].up = function(){CYKJ.tvMethod.setFocusId(_this.sBtnId)}//给一级下拉菜单最上面一个添加向上事件
		for(var i=0;i<this.aData.length;i++){this.bindOneSelect(i)}//给一级下拉菜单添加绑定事件
		var d = CYKJ.tvMap.idData[this.sBtnId];		
		d.left = function(fn){		
			var oDiv = document.getElementById(_this.linkBoardId);
			oDiv!=undefined&&document.body.removeChild(oDiv);
			return typeof fn == 'function' ? d.left = fn : true
		};
		d.right = function(fn){			
			var oDiv = document.getElementById(_this.linkBoardId);
			oDiv!=undefined&&document.body.removeChild(oDiv);			
			return typeof fn == 'function' ? d.right = fn : true
		};		
	},
	bindOneSelect:function(i){
		var _this = this;
		var d = CYKJ.tvMap.idData['oneSelect_'+i];			
		d.getFocus = function(){			
			_this.createTwoBoard(i)
		}			
		d.left = function(){return false}
		d.right = function(){		
			var towDiv = document.getElementById('linkTwoBoard');
			if(towDiv!=undefined){
				CYKJ.tvMethod.setFocusId('twoSelect_0');
				document.getElementById(d.id).style.background='#EEEEEE';
			}			
		}
		d.ok = function(){			
			CYKJ.tvMethod.setFocusId(_this.sBtnId);
			var d = _this.aData[i].one;
			var data = CYKJ.tvMap.idData[_this.sBtnId];
			data.choose!=undefined&&(data.choose(d));
			document.getElementById(_this.sBtnId).innerHTML = d.name+'<span></span>';
		}
	},
	createTwoBoard:function(num){	
		var oBtn = document.getElementById(this.sBtnId);
		var oLinkBoard = document.getElementById(this.linkBoardId);		
		var towDiv = document.getElementById('linkTwoBoard');
		towDiv!=undefined && (oLinkBoard.removeChild(towDiv));
		var twoData = this.aData[num].two;	
		if(twoData==undefined){return false}	
		
		var twoDiv = document.createElement('div');
		twoDiv.id = 'linkTwoBoard'; 
		twoDiv.className = 'linkTwoBoard'; 
		oLinkBoard.appendChild(twoDiv);
		var oneDiv = document.getElementById('linkOneBoard');
		twoDiv.style.left = parseInt(CYKJ.tvUtil.getStyle(oneDiv,'width').replace('px',''))+'px';
		twoDiv.style.top=0;		
		
		var twoDivArray = [],aIds=[];	
		twoDivArray.push('<div id="twoSelect_0" tv_type="tv_button" tv_css="'+this.css2+'">全部</div>');
		aIds.push('twoSelect_0');
		for(var i=1;i<this.aData.length;i++){
			if(i<twoData.length+1){
				var name = twoData[i-1].name;
				twoDivArray.push('<div id="twoSelect_'+i+'" tv_type="tv_button" tv_css="'+this.css2+'">'+name+'</div>');
				aIds.push('twoSelect_'+i);	
			}else{
				twoDivArray.push('<div class="'+this.css2[0]+'"></div>');
			}
		}		
		twoDiv.innerHTML = twoDivArray.join('');			
		delete CYKJ.tvMap.panel[this.aIds[0]];
		var allIds = aIds.concat(this.aIds);		
		new CYKJ.tvPanel({ids:allIds,name:this.linkBoardId});		
		CYKJ.tvMethod.setFocusId('oneSelect_'+num);
		this.bindOneMethod();
		for(var j=0;j<twoData.length+1&&j<this.aData.length;j++){
			this.bindTwoSelect(j,num);
		}	
	},
	bindTwoSelect:function(twoN,oneNum){
		var _this = this;
		var d = CYKJ.tvMap.idData['twoSelect_'+twoN];	
		var aData = this.aData;
		d.left = function(){	
			_this.twoNum = 0;
			document.getElementById('oneSelect_'+oneNum).style.background="";
			CYKJ.tvMethod.setFocusId('oneSelect_'+oneNum);				
		}
		d.right = function(){return false}
		d.ok = function(){			
			CYKJ.tvMethod.setFocusId(_this.sBtnId);
			var d = _this.aData[oneNum].two[twoN-1+_this.twoNum];					
			var data = CYKJ.tvMap.idData[_this.sBtnId];
			data.choose!=undefined&&(d==undefined?data.choose(_this.aData[oneNum].one):data.choose(d));		
			document.getElementById(_this.sBtnId).innerHTML = _this.aData[oneNum].one.name+'<span></span>';
		}
		d.down = function(){				
			var twoData = aData[oneNum].two;			
			if(twoN == twoData.length){return false}
			if(twoN != aData.length-1){return true}
			aData.length+_this.twoNum<twoData.length && (_this.twoNum++);
			for(var i=0;i<aData.length&&i<aData[oneNum].two.length;i++){	
				var name = twoData[i-1+_this.twoNum].name;					
				document.getElementById('twoSelect_'+i).innerHTML = name;
			}
			return false
		}
		d.up = function(){				
			if(twoN!=0){return true}
			var twoData = aData[oneNum].two;
			_this.twoNum>0 && (_this.twoNum--);
			for(var i=0;i<aData.length&&i<twoData.length;i++){	
				var two_d = twoData[i-1+_this.twoNum];
				var oDiv = document.getElementById('twoSelect_'+i);
				oDiv.innerHTML = two_d != undefined ? two_d.name :'全部';				
			}
			return false;			
		}
	}
}
/******************中文翻页******************/
var pageTurn ={
	sId:"",	
	init:function(obj){
		this.sId = obj.id;
		this.preId = obj.preId;
		this.nextId = obj.nextId;		
		this.createPageInit();
	},
	createPageInit:function(){
		var oDiv = document.getElementById(this.sId);
		var id = 'tv_text_'+this.sId;
		if(document.getElementById(id)==null){
			var html ='<div id="'+id+'" style="position:absolute;top:0">'+oDiv.innerHTML+'</div>';		
			oDiv.innerHTML = html;	
		}
		var height = parseInt(CYKJ.tvUtil.getStyle(oDiv,'height'));
		var oTextDiv = document.getElementById(id);		
		var currentPage = 1;
		var pageTotal = parseInt((parseInt(CYKJ.tvUtil.getStyle(oTextDiv,'height').replace('px',''))-1)/height) +1;		
				
		$tv('#'+this.preId).ok(function(){
			if(currentPage>1){
				currentPage--;
				oTextDiv.style.top =-height*(currentPage-1)+"px";
			}
		});
		$tv('#'+this.nextId).ok(function(){										
			if(currentPage<pageTotal){
				currentPage++;
				oTextDiv.style.top =-height*(currentPage-1)+"px";
			}
		});		
	}
}
/******************图片自动滑动******************/
var picSwitch = {
	sId : "",
	num:1,
	length:"",
	oLiWidth:"",
	aData:[],
	tvCss:[],
	timer:"",
	zoom:{},
	init:function(obj){			
		this.sId = obj.id;
		this.aData = obj.data;
		this.tvCss = obj.css;
		this.zoom = obj.zoom
		this.createBoard();		
	},
	createBoard:function(){	
		var _this = this;
		if(this.timer==""){
			var oDiv = document.getElementById(this.sId);	
			this.length = this.aData.length;
			var picHtmlArray=[];
			picHtmlArray.push('<ul id="changeUl" class="changeUl">');
			for(var i=0;i<this.length;i++){
				picHtmlArray.push('<li id="li_'+i+'"><img src="'+this.aData[i].pic1+'"/></li>');			
			}
			picHtmlArray.push('</ul>');
			picHtmlArray.push('<div class="ad_num">');		
			for(var j=0;j<this.length;j++){
				picHtmlArray.push('<div id="span_'+j+'" class="css1">'+(j+1)+'</div>');						
			}
			picHtmlArray.push('</div>');
			oDiv.innerHTML = picHtmlArray.join('');	
			var oUl = document.getElementById('changeUl');
			var oLi = oUl.getElementsByTagName('li')[0];
			this.oLiWidth = parseInt(CYKJ.tvUtil.getStyle(oLi,'width').replace('px'));	
			oUl.style.width = this.oLiWidth * this.length +'px';
			document.getElementById('span_0').className = this.tvCss[1];
			addTimer();
		}
		var d = CYKJ.tvMap.idData[this.sId];		
		d.right = function(fn){			
			if(_this.num==_this.length){				
				if(!(_this.zoom.right==false)){					
					CYKJ.tvMethod.setFocusId(_this.zoom.right);
				}
				return false
			}
			_this.rightMove();				
		}
		d.left = function(){			
			if(_this.num==1){				
				if(!(_this.zoom.left==false)){					
					CYKJ.tvMethod.setFocusId(_this.zoom.left);
				}				
				return false
			}
			_this.leftMove();
		};
		d.down = function(){
			if(!(_this.zoom.down==false)){					
				CYKJ.tvMethod.setFocusId(_this.zoom.down);
			}
			return false			
		};
		d.up = function(){
			if(!(_this.zoom.up==false)){					
				CYKJ.tvMethod.setFocusId(_this.zoom.up);
			}
			return false	
		};
		d.getFocus = function(){clearInterval(_this.timer)}
		d.loseFocus = function(){addTimer()}
		d.ok = function(fn){typeof fn == 'function' && (d.ok = fn)}
		d.adData = this.aData[this.num-1];			
		function addTimer(){_this.timer = setInterval(function(){_this.rightMove()},3000)}		
	},
	rightMove:function(speedFlag){		
		if(this.num<this.length){
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[0];	
			this.num++;			
			this.picMove(document.getElementById('changeUl'),{left:(-this.num+1)*this.oLiWidth},speedFlag);
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[1];		
			return true;	
		}else{
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[0];
			this.num =1;
			this.picMove(document.getElementById('changeUl'),{left:0},speedFlag);
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[1];
			return true;		
		}		
	},
	leftMove:function(){
		if(this.num>1){
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[0];
			this.num--;		
			this.picMove(document.getElementById('changeUl'),{left:(-this.num+1)*this.oLiWidth});
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[1];
			return true;
		}else{
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[0];
			this.num = this.length;
			this.picMove(document.getElementById('changeUl'),{left:(-this.num+1)*this.oLiWidth});
			document.getElementById('span_'+(this.num-1)).className = this.tvCss[1];
			return true;	
		}
	},
	picMove:function(obj,json,speedFlag){
		CYKJ.tvMap.idData[this.sId].adData = this.aData[this.num-1];
		speedFlag ==undefined && (speedFlag=8);
		clearInterval(obj.timer);
		obj.timer=setInterval(function (){
			var bStop=true;		
			for(var attr in json){			
				var iCur=0;//1.取当前的值
				iCur = parseInt(CYKJ.tvUtil.getStyle(obj,attr));				
				var iSpeed=(json[attr]-iCur)/speedFlag;//2.算速度
				iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);					
				iCur!=json[attr] && (bStop=false);//3.检测停止			
				obj.style[attr]=iCur+iSpeed+'px';
			}	
			if(bStop){
				clearInterval(obj.timer);				
			}
		}, 30)	
	}
}

var star = {
	init:function(id,num){
		new Star(id,num).init();		
	},
	info:function(id,num){
		new Star(id,num).info();
	}
}

function Star(id,num){
	this.sId = id;
	this.num = (num-1) || 0;	
}	
Star.prototype = {
	info:function(){
		var oDiv = document.getElementById(this.sId);
		var num = this.num+1;
		var starArray = [];
		starArray.push('<ul>');
		for(var i=0;i<5;i++){
			var css = i<num ? 'css3' : 'css1'; 
			starArray.push('<li class="'+css+'"></li>');			
		}
		starArray.push('</ul>');
		oDiv.innerHTML = starArray.join('');
	},
	init:function(){			
		var oDiv = document.getElementById(this.sId);
		var starArray = [];
		starArray.push('<ul>');
		for(var i=0;i<5;i++){
			var css = i<0 ? 'css3' : 'css1'; 
			starArray.push('<li class="'+css+'"></li>');			
		}
		starArray.push('</ul>');
		oDiv.innerHTML = starArray.join('');				
		this.bindMethod();
		
		if(CYKJ.tvMethod.sId==this.sId){
			var oDiv = document.getElementById(this.sId);
			var oLis = oDiv.getElementsByTagName('li');	
			for(var i=0;i<=this.num;i++){
				oLis[i].className = 'css4'
			}	
		}
	},
	bindMethod:function(){		
		var d = CYKJ.tvMap.idData[this.sId];
		var _this = this;
		var oDiv = document.getElementById(this.sId);
		var oLis = oDiv.getElementsByTagName('li');		
		d.init = function(){
			for(var i = 0;i<5;i++){
				oLis[i].className='css1'
				i<=_this.num && (oLis[i].className='css3');				
			}		
			CYKJ.tvMap.value[_this.sId] = _this.num+1;
		}
		d.init();	
		d.getFocus = function(){
			for(var i=0;i<=_this.num;i++){
				oLis[i].className = 'css4'
			}			
		}
		d.loseFocus = function(){
			for(var i=0;i<=_this.num;i++){
				oLis[i].className = 'css3'
			}				
			CYKJ.tvMap.value[_this.sId] = _this.num+1;
		};
		d.right = function(){	
			if(_this.num<4){
				oLis[_this.num].className = 'css3';
				_this.num++;					
				oLis[_this.num].className = 'css4';
				return true;
			}
			return false;
		};
		d.left = function(){
			if(_this.num>0){
				oLis[_this.num].className = 'css1';
				_this.num--;				
				oLis[_this.num].className = 'css4';
				return true;
			}
			return false;
		};
		d.val = function(data){
			if(data == undefined){						
				return 	CYKJ.tvMap.value[_this.sId];					
			}else{				
				CYKJ.tvMap.value[_this.sId] = data-1;	
				_this.num = data-1;	
				d.init();					
			}
		}
	}
}

var alert_info ={	
	init:function(obj){		
		var oDivFade = document.createElement('div');
		oDivFade.className = 'alert_fade';
		document.body.appendChild(oDivFade);		
		var oDiv = document.createElement('div');
		oDiv.id='info_div';
		oDiv.className='info_div';		
		var alertArray = [];
		alertArray.push('<div class="info_content"><div class="info_title">'+obj.title+'</div>');	
		alertArray.push('<div id="info_del" style="position:absolute;top:10px;right:0;" tv_type="tv_button" tv_css="info_del1,info_del2"></div>');	
		alertArray.push('<div class="info_line"></div>');	
		alertArray.push('<div id="text_content" class="text_content"><div id="textContent" style="position:absolute;top:0">'+obj.content+'</div></div>');	
		alertArray.push('<div id="info_left" style="position:absolute;bottom:10px;right:150px;" tv_type="tv_button" tv_css="info_left1,info_left2"></div>');	
		alertArray.push('<div id="info_text" tv_type="tv_text" maxlength="4" content="number" tv_css="info_text1,info_text2" style="position:absolute;bottom:10px;right:80px;">1</div>');
		alertArray.push('<div style="position:absolute;bottom:10px;right:50px;">/<span id="info_total">1</span></div>');	
		alertArray.push('<div id="info_right" style="position:absolute;bottom:10px;right:2px;" tv_type="tv_button" tv_css="info_right1,info_right2"></div></div>');	
		oDiv.innerHTML = alertArray.join('');
		document.body.appendChild(oDiv);
		var sOldId = CYKJ.tvMethod.sId;
		var ids = ['info_del','info_left','info_text','info_right'];
		new CYKJ.tvPanel({ids:ids});	
		CYKJ.tvMethod.setFocusId('info_del');	
		var height = parseInt(CYKJ.tvUtil.getStyle(document.getElementById('text_content'),'height'));
		var oTextDiv = document.getElementById('textContent');		
		var currentPage = 1;
		var pageTotal = parseInt((parseInt(CYKJ.tvUtil.getStyle(oTextDiv,'height').replace('px',''))-1)/height) +1;		
		document.getElementById('info_total').innerHTML = pageTotal;	
		$tv('#info_del').ok(function(){			
			CYKJ.tvMethod.setFocusId(sOldId);
			document.body.removeChild(oDivFade);	
			document.body.removeChild(oDiv);		
		})	
		$tv('#info_left').ok(function(){
			if(currentPage>1){
				currentPage--;
				oTextDiv.style.top =-height*(currentPage-1)+"px";
				$tv('#info_text').val(currentPage);
			}
		});
		$tv('#info_right').ok(function(){										
			if(currentPage<pageTotal){
				currentPage++;
				oTextDiv.style.top =-height*(currentPage-1)+"px";
				$tv('#info_text').val(currentPage);
			}
		});	
		$tv('#info_text').ok(function(){		
			var page = $tv('#info_text').val();
			if(page<=0||page>pageTotal){return}		
			currentPage = page;
			oTextDiv.style.top =-height*(currentPage-1)+"px";
		});	
	}
}