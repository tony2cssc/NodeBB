var userAgent = navigator.userAgent.toLowerCase();
var email;
var timestamp;
var userLang;
var language_type;//入口语言
var login_status=false;
var is_first=false;
var storage = window.localStorage;
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
function auto_login(){
 	$.ajax({
		type:"post",
		url:"/login",
		data:{
			'username': email,
			'password': "\x46\x6f\x73\x75\x6e\x40\x30\x39\x30\x31\x21"
		},
		success:function(data){
            go_url();
		}
	});
}
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function is_smlogin(){
	$.ajax({
		type:"post",
		url:"/api/ns/getsmlogin?tt="+uuid(),
		data:{
			'timestamp': timestamp
		},
		success:function(data){
            if(data){
            	sm_auto_login(data);
            }else{
            	setTimeout("is_smlogin()",2000);
            }
		}
	});
}

function sm_auto_login(user){
	email=user.email;
	var language = navigator.language;
	if(language!="zh-CN"){
		userLang="en_US";
	}
	user.userLang=userLang;
	if(!email){
		//alert("您的邮箱为空");
		//return;
		email=user.mobile1+"@fosun.com";
	}
	$.ajax({
		type:"post",
		url:"/api/ns/login",
		data:user,
		success:function(data){
			if(data){
				auto_login();
			}else{
				alert("用户检测失败！");
			}
		}
	});
}


function go_url(){
	if(!is_first){
		$.ajax({
			type:"get",
			async:true,
			url:"/api/ns/language?email="+email+"&language="+language_type,
			dataType:"json",
			success:function(data){
				if(!data){
					alert("语言设置失败");	
				}
			}
		})
	}
	var str = getQueryString("url");
    if(str){
        location.replace(window.encodeURI(str));
    }else{
        location.replace("/");
    }
}
$(function(){
	language_type=getQueryString("language_type");
	if(language_type&&language_type=="en"){
		language_type="en_US";
		storage.setItem("userlang","en");
	}else{
		storage.setItem("userlang","");
		language_type="zh_CN";
	}
	$.ajax({
		type:"get",
		url:"/api",
		async:true,
		dataType:"json",
		success:function(data){
			if(data.loggedIn){
               login_status=true;
			}
		}
	});
	if(login_status){
		console.log("已登录");
	}else if(isPC()){
		$("#loading").hide();
		$("#qrcode").show();
		$('body').css("background-color","#f3f3f3")
		$(document).attr("title","PC扫码登录");
		timestamp=uuid();
		var url="/vendor/sm.html?timestamp="+timestamp;
		$("#code-image").qrcode({
			text:url
		});
		is_smlogin();
		return;
	}else if(userAgent.indexOf('dingtalk')==-1){
		/*alert("抱歉,自动登录只支持钉钉");
		$("html").remove();*/
		go_url();
		return;
	}
	dd.ready(function(){
       dd.device.base.getSettings({
            onSuccess : function(data) {
            	if(data.language!="zh-Hans"){
            		userLang="en_US";
            	}
            }
        });
        fosun_oapi_login. getDDAccount (function(user){
			var a=user.fullname;
			if(/.*[\u4e00-\u9fa5]+.*$/.test(a)){
				a=a.split(' ');
				a=a[a.length-1];
			}
			email=user.email;
			if(!email){
				//alert("您的邮箱为空");
				//return;
				email=user.mobile1+"@fosun.com";
			}
			if(login_status){
				go_url();
				return;
			}
			$.ajax({
				type:"post",
				url:"/api/ns/login",
				data:{
					'username': a,
					'email': email,
					'picture': user.avatar,
					'fullname': user.fullname,
					'userLang':userLang
				},
				success:function(data){
					if(data==1||data==2){
						if(data==2){
							is_first=true;
						}
						auto_login();
					}else{
						alert("用户检测失败！");
					}
				}
			});
		})
    });
	
});
