function getStyle(obj, attr){return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr]}

function getPoint(obj) {
	var t = obj.offsetTop,l = obj.offsetLeft; 
	while(obj=obj.offsetParent){t+= obj.offsetTop,l+= obj.offsetLeft}
	return {top:t,left:l};
}

function parseURL(url) {
	   var a =  document.createElement('a');
	   a.href = url;
	   return {
	   source: url,
	   protocol: a.protocol.replace(':',''),
	   host: a.hostname,
	   port: a.port,
	   query: a.search,
	   params: (function(){
	       var ret = {},
	           seg = a.search.replace(/^\?/,'').split('&'),
	           len = seg.length, i = 0, s;
	       for (;i<len;i++) {
	           if (!seg[i]) { continue; }
	           s = seg[i].split('=');
	           ret[s[0]] = s[1];
	       }
	       return ret;
	   })(),
	   file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	   hash: a.hash.replace('#',''),
	   path: a.pathname.replace(/^([^\/])/,'/$1'),
	   relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	   segments: a.pathname.replace(/^\//,'').split('/')
	   };  
	}

var jm = {}
jm.alert = function(content,obj){
	var id = (obj!=undefined && obj.id)||'page1';
	var oParentDiv = document.getElementById(id);
	var oDivFade = document.createElement('div');
	oDivFade.className = 'alert_fade';
	oParentDiv.appendChild(oDivFade);		
	var oDiv = document.createElement('div');
	oDiv.id = 'alert_div';
	oDiv.className = 'alert_div';
	var confirmArray = [];
	confirmArray.push('<div class="wrapOut"><div class="wrapBar"><div class="wrap_title">提示对话框</div></div>');
	confirmArray.push('<div class="wrapBody">'+content+'</div>');
	confirmArray.push('<div id="alert_close"  class="css2" style="position:absolute;bottom:20px;left:0;right:0;margin:auto;">关闭</div>');	
	oDiv.innerHTML = confirmArray.join('');
	if(obj!=undefined){		
		obj.width!=undefined && (oDiv.style.width = obj.width);
		obj.height!=undefined && (oDiv.style.height = obj.height);
	}
	oParentDiv.appendChild(oDiv);	
	$("#alert_div").fadeIn('slow');
	$('#alert_close').click(function(){
		oParentDiv.removeChild(oDiv);
		oParentDiv.removeChild(oDivFade);
	});
}

jm.confirm = function(obj){
	var id = obj.id||'page1';
	var oParentDiv = document.getElementById(id);
	var oDivFade = document.createElement('div');
	oDivFade.className = 'alert_fade';
	oParentDiv.appendChild(oDivFade);		
	var oDiv = document.createElement('div');
	oDiv.id = 'alert_div';
	oDiv.className = 'alert_div';
	var confirmArray = [];
	confirmArray.push('<div class="wrapOut"><div class="wrapBar"><div class="wrap_title">提示对话框</div></div>');
	confirmArray.push('<div class="wrapBody">'+obj.content+'</div>');
	confirmArray.push('<div id="confirm_close"  class="css2" style="position:absolute;bottom:20px;left:10%;">确认</div>');
	confirmArray.push('<div id="confirm_cancel" class="css2" style="position:absolute;bottom:20px;right:10%;">取消</div></div>');
	oDiv.innerHTML = confirmArray.join('');
	if(obj!=undefined){		
		obj.width!=undefined && (oDiv.style.width = obj.width);
		obj.height!=undefined && (oDiv.style.height = obj.height);
	}
	oParentDiv.appendChild(oDiv);
	$("#alert_div").fadeIn('fast');
	$('#confirm_close').click(function(){									
		oParentDiv.removeChild(oDiv);
		oParentDiv.removeChild(oDivFade);
		obj.onClose(true);
	});
	$('#confirm_cancel').click(function(){			
		oParentDiv.removeChild(oDiv);
		oParentDiv.removeChild(oDivFade);
		obj.onClose(false);
	});
}

jm.logout = function(){
	jm.confirm({	
		id:'page1',
		content:'确定要退出这个帐号吗？',
		onClose:function(v){
			if(v){
				$.post(ctx+"/system/logout",
				   function(data){
						if(data=='true'||data==true){
							$.mobile.changePage(ctx+'/index/main',{transition: "slide",changeHash: true});
						}
				   });
				return;
			}
		}
	});
}