var app=angular.module("vote",["wilddog"]);app.controller("ivote",["$scope","$wilddogArray",function(d,c){fosun_oapi_login.getDDAccount(function(a){d.email=a.email,d.departname=a.departNamePath}),dd.device.base.getSettings({onSuccess:function(a){"zh-Hans"!=a.language&&(d.userLang="en_US")}}),dd.ready(function(){dd.biz.navigation.setRight({show:!0,control:!0,text:"",onSuccess:function(){var a="http://jz.fosun.com/vendor/bbs.html",e="http://o7em07k23.bkt.clouddn.com/votezhshare.jpg";dd.biz.util.share({type:0,url:a,title:"当IT女神，赢ClubMed大奖",image:e,content:"你在会议室高谈阔论谈需求，坐在电脑前奋笔疾书写代码，见过凌晨4点钟办公室的样子，谁说IT的MM都是女汉子，遇见乐观、专注、智慧、美丽的你"})},onFail:function(){}})}),d.myDate=new Date,d.mytime=d.myDate.toLocaleString(),d.storage=window.localStorage,d.userLangEn=d.storage.getItem("userlang"),d.languageEn="en_US"==d.userLang||"en_us"==d.userLang||"en"==d.userLang||"en_us"==d.userLangEn||"en"==d.userLangEn?!0:!1,d.languageEn?window.showLoading("loading"):window.showLoading("加载中"),d.ref=new Wilddog("https://voteact.wilddogio.com/data"),d.votedata=c(d.ref),window.setTimeout("window.hideLoading()",500),d.voteOption=function(a){var f=d.votedata[a],e=f.posts.some(function(g){return g.email==d.email});d.email?e||f.posts.push({email:d.email,departname:d.departname,time:d.mytime}):d.languageEn?layer.open({content:"Please move to Fosun, participation in the IT community discussions and exciting activities",btn:["close"]}):layer.open({content:"请您移步至复星通，参与IT社区的各种讨论和精彩活动",btn:["关闭"]}),d.votedata.$save(a)},d.checkEmail=function(a){var f=a,e=f.posts.some(function(g){return g.email==d.email});return e},d.checkCount=function(a){var e=0;angular.forEach(d.votedata,function(f){if("object"==typeof f){var g=f.posts.some(function(h){return h.email==d.email});g&&(e+=1)}}),4>=e?d.voteOption(a):d.languageEn?layer.open({content:"Limited cast five votes per person",btn:["close"]}):layer.open({content:"别贪心，每人限投5票",btn:["关闭"]})},d.gotoUrl=function(f){var e=f;dd.biz.util.openLink({url:e.url,showMenuBar:!0,credible:!0,enableShare:!0,onSuccess:function(){},onFail:function(){}})},d.changeLanuage=function(a){var e=a;"en_us"==e?d.languageEn=!0:"zh-cn"==e&&(d.languageEn=!1)}}]);
