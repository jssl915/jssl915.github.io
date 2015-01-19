var tvArea ={
	sTextId:"",
	aIds:[],
	init:function(id){
		var oDiv = document.getElementById('areaBoard');
		if(oDiv==undefined){
			this.sTextId = id;
			this.createDistrictBoard();				
		}else{
			document.body.removeChild(oDiv);	
		}
	},		
	createDistrictBoard:function(){
		var oDiv = document.createElement('div');
		oDiv.id = 'areaBoard';		
		var oText = document.getElementById(this.sTextId);
		var o = CYKJ.tvUtil.getPoint(oText);
		oDiv.style.left = o.left+'px';
		oDiv.style.top = o.top +5+parseInt(CYKJ.tvUtil.getStyle(oText,'height').replace('px',''))+'px';	
		document.body.appendChild(oDiv);
		var districtArray = [],aIds=[],sFocusId="d_all";		
		var aCurrentName = oText.innerHTML.split('-');
		var dd = districtData[aCurrentName[0]];
		if(dd!=undefined){
			districtArray.push('<div class="search">当前定位城市：'+oText.innerHTML+' <div id="tv_switch_city" tv_type="tv_button" tv_css="tv_swicth_css1,tv_swicth_css2">切换></div></div>');	
			districtArray.push('<div class="search"><ul class="district_city">');
			districtArray.push('<li id="d_all" tv_type="tv_button" tv_css="css1,css2">全城</li>');
			aIds.push('d_all');
			for(var i=0;i<dd.length;i++){
				var cn = dd[i];
				districtArray.push('<li id="d_li_'+i+'" tv_type="tv_button" tv_css="css1,css2">'+cn+'</li>');
				aIds.push('d_li_'+i);
				aCurrentName[1]!=undefined && aCurrentName[1]==cn && (sFocusId = 'd_li_'+i);			
			}
			districtArray.push('</ul></div>');			
			oDiv.innerHTML = districtArray.join('');			
			aIds.push('tv_switch_city');
			new CYKJ.tvPanel({ids:aIds,name:'areaBoard'});		
			CYKJ.tvMethod.setFocusId(sFocusId);	
			for(var j=0;j<dd.length;j++){
				this.bindDistrictCity(j);
			}		
			var _this =this;
			CYKJ.tvMap.idData['d_all'].ok = function(){			
				var text = document.getElementById(_this.sTextId).innerHTML;
				var aCurrentName = text.split('-');			
				document.getElementById(_this.sTextId).innerHTML = aCurrentName[0];	
				CYKJ.tvMethod.setFocusId(_this.sTextId);	
			};
			CYKJ.tvMap.idData['tv_switch_city'].ok = function(){			
				document.body.removeChild(oDiv);
				delete CYKJ.tvMap.panel['tv_switch_city'];
				_this.createAreaBoard();		
			};
		}else{
			document.body.removeChild(oDiv);
			delete CYKJ.tvMap.panel['tv_switch_city'];
			this.createAreaBoard();		
		}
	},
	bindDistrictCity:function(num){
		var d = CYKJ.tvMap.idData['d_li_'+num];		
		var _this = this;
		d.ok = function(){			
			var text = document.getElementById(_this.sTextId).innerHTML;
			var aCurrentName = text.split('-');		
			var cityName = aCurrentName[0]+'-'+document.getElementById(d.id).innerHTML;
			document.getElementById(_this.sTextId).innerHTML = cityName;	
			CYKJ.tvMethod.setFocusId(_this.sTextId);
			var data = CYKJ.tvMap.idData[_this.sTextId];
			data.choose!=undefined&&(data.choose(cityName));
		}
	},
	createAreaBoard:function(){
		var oDiv = document.createElement('div');
		oDiv.id = 'areaBoard';		
		var oText = document.getElementById(this.sTextId);
		var o = CYKJ.tvUtil.getPoint(oText);
		oDiv.style.left = o.left+'px';
		oDiv.style.top = o.top +5+parseInt(CYKJ.tvUtil.getStyle(oText,'height').replace('px',''))+'px';	
		document.body.appendChild(oDiv);
		
		var areaArray = [],aIds=[],sFocusId='h_li_0';
		var currentName = oText.innerHTML;
		areaArray.push('<div class="search">当前定位城市：'+currentName+'</div>');
		
		areaArray.push('<div class="search"><ul class="hot_city"><span>热门城市：</span>');
		for(var i=0;i<areaData.hotCity.length;i++){
			var cn = areaData.hotCity[i];
			areaArray.push('<li id="h_li_'+i+'" tv_type="tv_button" tv_css="css1,css2">'+cn+'</li>');
			currentName==cn && (sFocusId = 'h_li_'+i);	
			aIds.push('h_li_'+i);
		}
		areaArray.push('</ul></div>');
		
		areaArray.push('<div class="search">按拼音首字母选择：</div>');
		
		areaArray.push('<div class="search"><ul class="letter"><span>字母：</span>');
		for(var j=0;j<26;j++){
			var letter = areaData.letter[j];
			areaArray.push('<li id="l_li_'+j+'" tv_type="tv_button" tv_css="css1,css2">'+letter+'</li>');
			aIds.push('l_li_'+j);
		}
		areaArray.push('</ul>');
		areaArray.push('</div>');
		oDiv.innerHTML = areaArray.join('');			
		new CYKJ.tvPanel({ids:aIds,name:'areaBoard'});
		this.aIds = aIds;
		CYKJ.tvMethod.sId="";
		CYKJ.tvMethod.setFocusId(sFocusId);	
		this.bind();
	},
	bind:function(){
		for(var k=0;k<areaData.hotCity.length;k++){
			this.bindHotCity(k);
		}
		for(var l=0;l<26;l++){
			this.bindLetter(l);
		}
	},
	bindHotCity:function(num){
		var d = CYKJ.tvMap.idData['h_li_'+num];		
		var _this = this;
		d.ok = function(){		
			var cityName = areaData.hotCity[num];
			document.getElementById(_this.sTextId).innerHTML = cityName;	
			CYKJ.tvMethod.setFocusId(_this.sTextId);
			var data = CYKJ.tvMap.idData[_this.sTextId];
			data.choose!=undefined&&(data.choose(cityName));
		}
	},
	bindLetter:function(num){
		var d = CYKJ.tvMap.idData['l_li_'+num];			
		var _this = this;
		d.ok = function(){	
			var letter = document.getElementById(d.id).innerHTML;			
			var lData = areaData[letter];			
			if(lData==undefined){return false}
			var oDiv = document.getElementById('areaBoard');				
			var oDiv1 = document.getElementById('letter_city');
			if(oDiv1!=undefined){oDiv.removeChild(oDiv1);}
			var leterArray = [],aIds=[];
			oDiv1 = document.createElement('div');
			oDiv1.className = 'search';		
			oDiv1.id="letter_city"
			leterArray.push('<ul class="letter_city"><span>'+letter+'：</span>');
			for(var i=0;i<lData.length;i++){
				var cn = lData[i];
				leterArray.push('<li id="lc_li_'+i+'" tv_type="tv_button" tv_css="css1,css2">'+cn+'</li>');
				aIds.push('lc_li_'+i);
			}
			leterArray.push('</ul>');
			oDiv1.innerHTML = leterArray.join('');						
			oDiv.appendChild(oDiv1);	
			delete CYKJ.tvMap.panel[_this.aIds[0]];
			var allIds = aIds.concat(_this.aIds);
			new CYKJ.tvPanel({ids:allIds,name:'areaBoard'});
			CYKJ.tvMethod.setFocusId(d.id);
			_this.bind();
			for(var j=0;j<lData.length;j++){
				_this.bindLetterCity(j);
			}			
		};	
	},
	bindLetterCity:function(num){
		var d = CYKJ.tvMap.idData['lc_li_'+num];		
		var _this = this;
		d.ok = function(){					
			var cityName = document.getElementById(d.id).innerHTML;
			document.getElementById(_this.sTextId).innerHTML = cityName;	
			CYKJ.tvMethod.setFocusId(_this.sTextId);			
			var data = CYKJ.tvMap.idData[_this.sTextId];
			data.choose!=undefined&&(data.choose(cityName));
		}
	}
}

var areaData = {
	letter:['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
	hotCity:['上海市','北京市','广州市','深圳市','武汉市','天津市','西安市','南京市','杭州市','成都市','重庆市','秦皇岛市','呼和浩特市','郑州市','大连市','石家庄市','南宁市','中山市','合肥市','青岛市'],
	a:['鞍山市','安吉市','安顺市','安阳市','阿克苏市','阿勒市','泰安康市','安庆市','澳门市','阿拉善市','阿里市','阿坝市'],
	b:['北京市','包头市','本溪市','蚌埠市','白银市','北海市','滨海市','白城市','巴彦淖尔市','滨州市','保定市','亳州市','百色市','白山市','巴州市','毕节市','巴中市','保山市','宝鸡市','博尔塔拉市'],
	c:['成都市','重庆市','常州市','长沙市','长春市','长治市','朝阳市','巢湖市','长乐市','常熟市','沧州市','滁州市','赤峰市','潮州市','长兴市','慈溪市','常德市','从化市','承德市','昌邑市','昌吉市','昌都市','郴州市','楚雄市','崇左市','池州市'],
	d:['东莞市','大连市','大庆市','东营市','东台市','丹东市','当阳市','德州市','德清市','达州市','东阳市','东港市','大理市','大丰市','丹阳市','大同市','德宏市','迪庆市','大兴安岭市','德阳市','定西市'],
	e:['额尔古纳市','鄂州市','恩施市','鄂尔多斯市','峨眉山市'],
	f:['福州市','佛山市','阜阳市','抚顺市','阜新市','阜宁市','肥城市','福清市','奉化市','凤凰市','防城港市','抚州市'],
	g:['广州市','贵阳市','桂林市','赣州市','高邮市','贵港市','广饶市','果洛市','固原市','广安市','广元市','甘孜市','甘南市']	
}

var districtData ={
	'武汉市':['江岸区','武昌区','江汉区','硚口区','汉阳区','青山区','洪山区','近郊','东西湖区','汉南区','蔡甸区','江夏区','黄陂区','新洲区'],
	'北京市':['朝阳区','海淀区','丰台区','西城区','东城区','昌平区','石景山区','通州区','大兴区','顺义区','房山区','密云县','怀柔区','延庆县'],
	'上海市':['浦东新区','徐汇区','长宁区','黄浦区','静安区','闵行区','卢湾区','杨浦区','普陀区','虹口区','闸北区','宝山区','松江区','嘉定区'],
	'广州市':['越秀区','天河区','番禺区','海珠区','白云区','荔湾区','黄埔区','萝岗区','增城市','花都区','从化市','近郊','南沙区'],
	'深圳市':['福田区','罗湖区','南山区','盐田区','宝安区','龙岗区','香港','南澳大鹏区','龙华新区']
}