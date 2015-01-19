function goLogin(){
	$.mobile.changePage(ctx+"/system/login",{transition: "slide",changeHash: true});
}
function register(){
	$.mobile.changePage(ctx+"/system/register",{transition: "slide",changeHash: true});
}
function toRegister(){
	var username = $('#userName').val();
	var password1 = $('#passWord1').val();
	var password2 = $('#passWord2').val();
	if(!username){jm.alert('用户名不能为空！');return}
	if(!password1){
		jm.alert('用户密码不能为空！');
		return
	}
	if(!password2){
		jm.alert('确认密码不能为空！');
		return
	}
	$.post(ctx+"/system/checkRegister", {username:username},
	   function(data){
			if(data=='true'||data==true){
				$.mobile.changePage(ctx+'/system/toRegister?username='+username+'&password='+password1,{transition: "slide",changeHash: true});
			}else{
				jm.alert('用户名已经存在！');
			}
	   });
}
function findPwd(){
	$.mobile.changePage(ctx+"/system/findPwd",{transition: "slide",changeHash: true});
}
function toFindPwd(){
	var username = $('#userName').val();
	var cardType = $('#cardType').val();
	var cardNum = $('#cardNum').val();
	var password1 = $('#passWord1').val();
	var password2 = $('#passWord2').val();
	if(!username){jm.alert('请输入用户名！');return}
	if(!cardType){jm.alert('请选择证件类型！');return}
	if(!cardNum){jm.alert('请输入证件号码！');return}
	if(!password1){jm.alert('请输入密码！');return}	
	if(!password2){jm.alert('请输入确认密码！');return}	
	if(password1!=password2){jm.alert('两次密码不一样，请重新输入！');return}
	$.post(ctx+"/system/checkFindPwd", {"username": username,"cardType": cardType,"cardNum":cardNum},
	   function(data){
			if(data=='true'||data==true){
				$.mobile.changePage(ctx+'/system/toFindPwd?username='+username+'&password='+password1,{transition: "slide",changeHash: true});
			}else{
				jm.alert('该证件号码错误或不存在！');
			}
	   });
}

(function($) {
	$.fn.serializeObject = function(strSplit)
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	    	if(strSplit!=null){
	    		var nameArr = this.name.split(strSplit);
	    		if (nameArr.length>1) {
		    		this.name = nameArr[1];
				}
	    	}
	    	if ($.trim(this.value)!='') {
	    		if (o[this.name]) {
		            if (!o[this.name].push) {
		                o[this.name] = [o[this.name]];
		            }
		            o[this.name].push(this.value || '');
		        } else {
		            o[this.name] = this.value || '';
		        }
			}
	        
	    });
	    return o;
	};
})(jQuery);

var pay={}
pay.doPay = function(prodId,businessId,merOrderId,num){
	var name = $('input[name="bank"]:checked').val();
	if(name!=1){
		jm.alert('该银行尚未开通支付功能！');
		return
	}
	if(merOrderId!=null&&merOrderId!=''){
		$.post(ctx+"/pay/toPay", {"merOrderId": merOrderId,"bankId": name},
		   function(data){
			if(data['errorMsg'] == null){
				document.forms["payForm"].action = data['action'];
				document.getElementById('payForm').innerHTML = data['params'];
				document.forms["payForm"].submit();
			}
		 });
		return 
	}	
	$.post(ctx+"/pay/insertOrder", {prodId:prodId,businessId:businessId,num:num},
	   function(data){
			merOrderId = data;
			$.post(ctx+"/pay/toPay", {"merOrderId": merOrderId,"bankId": name},
			   function(data){
				data = JSON.parse(data);
				if(data['errorMsg'] == null){
					document.forms["payForm"].action = data['action'];
					document.getElementById('payForm').innerHTML = data['params'];
					document.forms["payForm"].submit();
				}
			 });
	 });
}
pay.morePayMethod = function(){
	$('#morePayMethod').hide();
	$('#more_pay').show();
}
