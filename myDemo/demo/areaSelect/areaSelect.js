$.extend({
 	areaSelect:function(data){
		var aId = data.aId;
		var oProvice = $('#'+aId[0]);
		var oCity = $('#'+aId[1]);
		var oDistrict = $('#'+aId[2]);
		//生成数组
		var aCity=[],aDistrict=[];
		initArray();
		function initArray(){
			for(var i=0;i<aArea.length;i++){
				var area = aArea[i];
				area.d==1 && oProvice.append('<option value="'+area.a+'">'+area.c+'</option>');
				area.d==2 && aCity.push(area);
				area.d==3 && aDistrict.push(area);
			}	
			initCity();	
		}
		
		if(data.provice!=undefined){	
			oProvice.val(data.provice);
			initCity(data.city);
			initDistrict(data.district);
		}
		
		function initCity(city){
			oCity.empty(); 
			for(var i=0;i<aCity.length;i++){	
				var d = aCity[i];
				d.b == $('#'+aId[0]).val() && oCity.append('<option value="'+d.a+'">'+d.c+'</option>');		
			}
			oCity.val(city);
		}
		
		function initDistrict(district){
			oDistrict.empty(); 
			for(var i=0;i<aDistrict.length;i++){
				var d = aDistrict[i];
				d.b==oCity.val() && oDistrict.append('<option value="'+d.a+'">'+d.c+'</option>');			
			}
			oDistrict.val(district);
		}

		//绑定选择方法
		oProvice.change(function(){
			initCity();		
			initDistrict();
		});
		oCity.change(function(){
			initDistrict();					   
		})	
	}	
});
