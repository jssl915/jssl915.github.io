var area ={
	showDistrict:function(){
		var oParentDiv = document.getElementById('home');
		var oDivFade = document.createElement('div');
		oDivFade.id='alert_fade';
		oDivFade.className = 'alert_fade';
		oParentDiv.appendChild(oDivFade);
		var oDiv = document.createElement('div');
		oDiv.id='areaBoard';
		oDiv.className='areaBoard';
		var oText = document.getElementById('area1');
		var o = getPoint(oText);
		oDiv.style.top = o.top+parseInt(getStyle(oText,'height').replace('px',''))+'px';	
		oParentDiv.appendChild(oDiv);
		var areaArray = [];
		var cityName = $('#area1').html();
		var c = cityName.split('-');
		var data = districtData[c[0]];
		var currentName = oText.innerHTML;
		areaArray.push('<div style="border-bottom:1px solid #999999;padding:10px 0 10px 5px;font-weight:bold;">');
		areaArray.push('<span style="margin:10px;">当前选中城市：'+currentName+'</span>');
		areaArray.push('<span id="changeCity" style="float:right;margin-right:5px;">切换  ></span></div>');
		if(data!=undefined){
			areaArray.push('<div class="districtCity"><ul>');
			areaArray.push('<li id="d_li_all" class="districtLi">全城</li>');
			for(var i=0;i<data.length;i++){
				var cn = data[i];
				if(c[1]!=undefined&&c[1]==cn){
					areaArray.push('<li id="d_li_'+i+'" class="districtLi1">'+cn+'</li>');
				}else{
					areaArray.push('<li id="d_li_'+i+'" class="districtLi">'+cn+'</li>');
				}
			}
			areaArray.push('</ul></div>');
		}
		oDiv.innerHTML = areaArray.join('');
		$('.districtLi').click(function(){
			var _this = this;
			this.className='districtLi1';
			setTimeout(change,500);
			function change(){
				if(document.getElementById("areaBoard")==undefined){return}
				if($('#'+_this.id).html()!='全城'){
					$('#area1').html(c[0]+'-'+$('#'+_this.id).html());
				}else{
					$('#area1').html(c[0]);
				}
				oParentDiv.removeChild(oDiv);
				oParentDiv.removeChild(oDivFade);
				reSize();
			}
		});
		$('#changeCity').click(function(){
			oParentDiv.removeChild(oDiv);
			oParentDiv.removeChild(oDivFade);
			$.mobile.changePage('changeCity.html',{transition: "slide",changeHash: true});
			$(document).on("pageinit","#page1",function(){
				addCity();
			});
			function addCity(){
				var hotCityArray =[];
				var hotData = areaData['hotCity'];
				hotCityArray.push('<div class="districtCity"><ul>');
				for(var i=0;i<hotData.length;i++){
					var cn = hotData[i];
					hotCityArray.push('<li id="d_li_'+i+'" class="districtLi" style="width:80px;">'+cn+'</li>');
				}
				hotCityArray.push('</ul></div>');
				$('#hotCity').html(hotCityArray.join(''));
				$('#currentCity').click(function(){
					var selectName = this.innerHTML;
					$.mobile.changePage('main.html',{transition: "slide",changeHash: true});
					$('#area1').html(selectName);
					reSize();
				});
				var letterCityArray = [];
				for(var j=0;j<areaData.letter.length;j++){
					var letter = areaData.letter[j];
					var upLetter = letter.toUpperCase();
					letterCityArray.push('<div style="margin:10px 0;background:#fff;border:1px solid #D5D5D5;color:#6f6f6f;font-size:2em;font-weight:bold;width:45px;height:45px;line-height:45px;text-align:center;">'+upLetter+'</div>');
					var letterCity = areaData[letter];
					if(letterCity!=undefined){
						for(var k=0;k<letterCity.length;k++){
							var cName = letterCity[k];
							letterCityArray.push('<div class="allCityName">'+cName+'</div>');
						}
					}
				}
				$('#allCity').html(letterCityArray.join(''));
				$('.allCityName').click(function(){
					var selectName = this.innerHTML;
					$.mobile.changePage('main.html',{transition: "slide",changeHash: true});
					$('#area1').html(selectName);
					reSize();
				});
				$('.districtLi').click(function(){
					var selectName = this.innerHTML;
					$.mobile.changePage('main.html',{transition: "slide",changeHash: true});
					$('#area1').html(selectName);
					reSize();
				});
				
				$('#searchText').keyup(function(){
					$('#showCity').hide();
					$('#selectCity').show();
					$('#searchCity').html('');
					var letter = this.value;
					var letterCity = areaData[letter.toLowerCase()];
					var searchArray = [];
					if(letter==''||letter==null){
						$('#showCity').show();
						$('#selectCity').hide();
						return
					}
					if(letterCity!=undefined){
						for(var i=0;i<letterCity.length;i++){
							var cName = letterCity[i];
							searchArray.push('<div class="allCityName">'+cName+'</div>');
						}
						$('#searchCity').html(searchArray.join(''));
					}else{
						for(var j=0;j<allCityData.length;j++){
							if(allCityData[j].indexOf(letter)!=-1){
								var cName = allCityData[j];
								searchArray.push('<div class="allCityName">'+cName+'</div>');
								$('#searchCity').html(searchArray.join(''));
							}
						}
					}
					$('.allCityName').click(function(){
						var selectName = this.innerHTML;
						$.mobile.changePage('main.html',{transition: "slide",changeHash: true});
						$('#area1').html(selectName);
						reSize();
					});
				})
			}
			
		})
	}
}
var allCityData = ['鞍山市','安吉市','安顺市','安阳市','阿克苏市','阿勒市','泰安康市','安庆市','澳门市','阿拉善市','阿里市','阿坝市',
            '北京市','包头市','本溪市','蚌埠市','白银市','北海市','滨海市','白城市','巴彦淖尔市','滨州市','保定市','亳州市','百色市','白山市','巴州市','毕节市','巴中市','保山市','宝鸡市','博尔塔拉市',
            '成都市','重庆市','常州市','长沙市','长春市','长治市','朝阳市','巢湖市','长乐市','常熟市','沧州市','滁州市','赤峰市','潮州市','长兴市','慈溪市','常德市','从化市','承德市','昌邑市','昌吉市','昌都市','郴州市','楚雄市','崇左市','池州市',
            '东莞市','大连市','大庆市','东营市','东台市','丹东市','当阳市','德州市','德清市','达州市','东阳市','东港市','大理市','大丰市','丹阳市','大同市','德宏市','迪庆市','大兴安岭市','德阳市','定西市',
            '额尔古纳市','鄂州市','恩施市','鄂尔多斯市','峨眉山市',
            '福州市','佛山市','阜阳市','抚顺市','阜新市','阜宁市','肥城市','福清市','奉化市','凤凰市','防城港市','抚州市',
            '广州市','贵阳市','桂林市','赣州市','高邮市','贵港市','广饶市','果洛市','固原市','广安市','广元市','甘孜市','甘南市',
            '武汉市',
            '岳阳市'];
var areaData = {
	letter:['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
	hotCity:['上海市','北京市','广州市','深圳市','武汉市','天津市','西安市','南京市','杭州市','成都市','重庆市','秦皇岛市','郑州市','大连市','石家庄市','南宁市','中山市','合肥市','青岛市'],
	a:['鞍山市','安吉市','安顺市','安阳市','阿克苏市','阿勒市','泰安康市','安庆市','澳门市','阿拉善市','阿里市','阿坝市'],
	b:['北京市','包头市','本溪市','蚌埠市','白银市','北海市','滨海市','白城市','巴彦淖尔市','滨州市','保定市','亳州市','百色市','白山市','巴州市','毕节市','巴中市','保山市','宝鸡市','博尔塔拉市'],
	c:['成都市','重庆市','常州市','长沙市','长春市','长治市','朝阳市','巢湖市','长乐市','常熟市','沧州市','滁州市','赤峰市','潮州市','长兴市','慈溪市','常德市','从化市','承德市','昌邑市','昌吉市','昌都市','郴州市','楚雄市','崇左市','池州市'],
	d:['东莞市','大连市','大庆市','东营市','东台市','丹东市','当阳市','德州市','德清市','达州市','东阳市','东港市','大理市','大丰市','丹阳市','大同市','德宏市','迪庆市','大兴安岭市','德阳市','定西市'],
	e:['额尔古纳市','鄂州市','恩施市','鄂尔多斯市','峨眉山市'],
	f:['福州市','佛山市','阜阳市','抚顺市','阜新市','阜宁市','肥城市','福清市','奉化市','凤凰市','防城港市','抚州市'],
	g:['广州市','贵阳市','桂林市','赣州市','高邮市','贵港市','广饶市','果洛市','固原市','广安市','广元市','甘孜市','甘南市'],	
	w:['武汉市'],
	y:['岳阳市']
}

var districtData ={
	'武汉市':['江岸区','武昌区','江汉区','硚口区','汉阳区','青山区','洪山区','近郊','东西湖区','汉南区','蔡甸区','江夏区','黄陂区','新洲区'],
	'北京市':['朝阳区','海淀区','丰台区','西城区','东城区','昌平区','石景山区','通州区','大兴区','顺义区','房山区','密云县','怀柔区','延庆县'],
	'上海市':['浦东新区','徐汇区','长宁区','黄浦区','静安区','闵行区','卢湾区','杨浦区','普陀区','虹口区','闸北区','宝山区','松江区','嘉定区'],
	'广州市':['越秀区','天河区','番禺区','海珠区','白云区','荔湾区','黄埔区','萝岗区','增城市','花都区','从化市','近郊','南沙区'],
	'深圳市':['福田区','罗湖区','南山区','盐田区','宝安区','龙岗区','香港','南澳大鹏区','龙华新区']	
}