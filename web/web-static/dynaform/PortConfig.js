function PortConfig(){PortConfig.prototype.init=function(c){this.initData=c;this.portDisplayDisableList={"default":"portDisplayDisable.png",GE:"ge_white_disable.png","2.5GE":"2.5ge_white_disable.png","10GE":"10ge_white_disable.png"};this.portDisplayActiveList={"default":"portDisplayActive.png",GE:"ge_white_active.png","2.5GE":"2.5ge_white_active.png","10GE":"10ge_white_active.png"};this.portDisplayNormalList={"default":"portDisplayNormal.png",GE:"ge_white_normal.png","2.5GE":"2.5ge_white_normal.png",
"10GE":"10ge_white_normal.png"};this.portSettingDisableList={"default":"portSettingDisable.png",GE:"ge_disable.png","2.5GE":"2.5ge_disable.png","10GE":"10ge_disable.png"};this.portSettingActiveList={"default":"portSettingActive.png",GE:"ge_active.png","2.5GE":"2.5ge_active.png","10GE":"10ge_active.png"};this.portSettingNormalList={"default":"portSettingNormal.png",GE:"ge_normal.png","2.5GE":"2.5ge_normal.png","10GE":"10ge_normal.png"};this.portSfpIconDom={sfp:'<i class="portSfpIcon"></i>',noSfp:""};
this.render();return this};PortConfig.prototype.render=function(){var c=this.initData.element,h=this.initData.type,b=this.initData.port,k=this.initData.powerPos,l="undefined"!==typeof this.initData.powerIdx?parseInt(this.initData.powerIdx):0,m=this.initData.displayClickable,f=b.length,d,a,e=this;if("display"===h){c.innerHTML='<div class="portConfig display"></div>';d=c.querySelector(".portConfig");for(a=0;a<f;a++)switch(a===l&&(d.innerHTML+='                    <div class="powerImg disable">                        <img class="disable" src="web-static/images/powerDisplay.png"/>                        <span class="disable">POWER</span>                    </div>                    '),
b[a].state){case "disable":d.innerHTML+='                        <div class="portImg disable">                            <img class="disable" src="web-static/images/'+this.portDisplayDisableList[b[a].rate?b[a].rate:"default"]+'"/>                            <span class="disable">'+b[a].name+"</span>"+this.portSfpIconDom[b[a].isSfp?"sfp":"noSfp"]+"</div>";break;case "active":d.innerHTML+='                        <div class="portImg active">                            <img class="active" src="web-static/images/'+
this.portDisplayActiveList[b[a].rate?b[a].rate:"default"]+'"/>                            <span class="active">'+b[a].name+"</span>"+this.portSfpIconDom[b[a].isSfp?"sfp":"noSfp"]+"</div>";break;case "normal":d.innerHTML+='                        <div class="portImg normal">                            <img class="normal" src="web-static/images/'+this.portDisplayNormalList[b[a].rate?b[a].rate:"default"]+'"/>                            <span class="normal">'+b[a].name+"</span>"+this.portSfpIconDom[b[a].isSfp?
"sfp":"noSfp"]+"</div>"}a=d.querySelector(".powerImg");a.style["float"]=k;d=d.querySelectorAll(".portImg");a=0;for(var g=d.length;a<g;a++)d[a].style["float"]=k;if(m)for(a=0,g=d.length;a<g;a++)d[a].index=a,d[a].onclick=function(){switch(e.initData.port[this.index].state){case "disable":return;case "normal":e.initData.port[this.index].state="active";e.refresh();break;case "active":e.initData.port[this.index].state="normal",e.refresh()}"[object Function]"===Object.prototype.toString.call(e.initData.callback)&&
e.initData.callback({index:""+this.index,state:e.initData.port[this.index].state,name:e.initData.port[this.index].name})}}if("setting"===h){c.innerHTML='<div class="portConfig setting"></div>';d=c.querySelector(".portConfig");for(a=0;a<f;a++)switch(a===l&&(d.innerHTML+='                    <div class="powerImg disable">                        <img class="disable" src="web-static/images/powerSetting.png"/>                        <span class="disable">POWER</span>                    </div>                    '),
b[a].state){case "disable":d.innerHTML+='                        <div class="portImg disable">                            <img class="disable" src="web-static/images/'+this.portSettingDisableList[b[a].rate?b[a].rate:"default"]+'"/>                            <span class="disable">'+b[a].name+"</span>"+this.portSfpIconDom[b[a].isSfp?"sfp":"noSfp"]+"</div>";break;case "active":d.innerHTML+='                        <div class="portImg active">                            <img class="active" src="web-static/images/'+
this.portSettingActiveList[b[a].rate?b[a].rate:"default"]+'"/>                            <span class="active">'+b[a].name+"</span>"+this.portSfpIconDom[b[a].isSfp?"sfp":"noSfp"]+"</div>";break;case "normal":d.innerHTML+='                        <div class="portImg normal">                            <img class="normal" src="web-static/images/'+this.portSettingNormalList[b[a].rate?b[a].rate:"default"]+'"/>                            <span class="normal">'+b[a].name+"</span>"+this.portSfpIconDom[b[a].isSfp?
"sfp":"noSfp"]+"</div>"}a=d.querySelector(".powerImg");a.style["float"]=k;d=d.querySelectorAll(".portImg");a=0;for(g=d.length;a<g;a++)d[a].style["float"]=k,d[a].index=a,d[a].onclick=function(){switch(e.initData.port[this.index].state){case "disable":return;case "normal":e.initData.port[this.index].state="active";e.refresh();break;case "active":e.initData.port[this.index].state="normal",e.refresh()}"[object Function]"===Object.prototype.toString.call(e.initData.callback)&&e.initData.callback({index:""+
this.index,state:e.initData.port[this.index].state,name:e.initData.port[this.index].name})}}};PortConfig.prototype.refresh=function(){var c=this.initData.element,h=this.initData.type,b=this.initData.port,k=this.initData.powerPos,l="undefined"===typeof this.initData.powerIdx?0:parseInt(this.initData.powerIdx),m=b.length,f=c.querySelectorAll(".portImg"),d=c.querySelector(".powerImg"),a,e,g;if(m!==f.length||null===c.querySelector(".portConfig."+h)||d.style["float"]!==k||"powerImg disable"!==c.children[0].children[l].className)this.render();
else for("display"===h?(a=this.portDisplayNormalList,e=this.portDisplayActiveList,g=this.portDisplayDisableList):"setting"===h&&(a=this.portSettingNormalList,e=this.portSettingActiveList,g=this.portSettingDisableList),c=0;c<m;c++){switch(b[c].state){case "normal":f[c].children[0].src="web-static/images/"+a[b[c].rate?b[c].rate:"default"];f[c].className="portImg normal";f[c].children[0].className="normal";f[c].children[1].className="normal";break;case "active":f[c].children[0].src="web-static/images/"+
e[b[c].rate?b[c].rate:"default"];f[c].className="portImg active";f[c].children[0].className="active";f[c].children[1].className="active";break;case "disable":f[c].children[0].src="web-static/images/"+g[b[c].rate?b[c].rate:"default"],f[c].className="portImg disable",f[c].children[0].className="disable",f[c].children[1].className="disable"}f[c].children[1].innerHTML=b[c].name}};PortConfig.prototype.destroy=function(){this.initData.element.innerHTML=""}};
