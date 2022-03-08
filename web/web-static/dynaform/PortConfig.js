function PortConfig() {
    PortConfig.prototype.init = function(initData) {
        this.initData = initData;
        this.portDisplayDisableList = {
            "default": "portDisplayDisable.png",
            "GE": "ge_white_disable.png",
            "2.5GE": "2.5ge_white_disable.png",
            "10GE": "10ge_white_disable.png"
        };
        this.portDisplayActiveList = {
            "default": "portDisplayActive.png",
            "GE": "ge_white_active.png",
            "2.5GE": "2.5ge_white_active.png",
            "10GE": "10ge_white_active.png"
        };
        this.portDisplayNormalList = {
            "default": "portDisplayNormal.png",
            "GE": "ge_white_normal.png",
            "2.5GE": "2.5ge_white_normal.png",
            "10GE": "10ge_white_normal.png"
        };
        this.portSettingDisableList = {
            "default": "portSettingDisable.png",
            "GE": "ge_disable.png",
            "2.5GE": "2.5ge_disable.png",
            "10GE": "10ge_disable.png"
        };
        this.portSettingActiveList = {
            "default": "portSettingActive.png",
            "GE": "ge_active.png",
            "2.5GE": "2.5ge_active.png",
            "10GE": "10ge_active.png"
        };
        this.portSettingNormalList = {
            "default": "portSettingNormal.png",
            "GE": "ge_normal.png",
            "2.5GE": "2.5ge_normal.png",
            "10GE": "10ge_normal.png"
        };
        this.portSfpIconDom = {
            "sfp":'<i class="portSfpIcon"></i>',
            'noSfp':''
        };
        this.render();

        return this;
    };

    PortConfig.prototype.render = function() {
        var $element = this.initData.element;
        var type = this.initData.type;
        var port = this.initData.port;
        var powerPos = this.initData.powerPos;
        var powerIdx = typeof this.initData.powerIdx !== "undefined" ? parseInt(this.initData.powerIdx) : 0;
        var displayClickable = this.initData.displayClickable;
        var portNum = port.length;
        var $portConfig;
        var $powerImg;
        var $portImgArray;
        var me = this;

        if (type === "display") {
            $element.innerHTML = '<div class="portConfig display"></div>';
            $portConfig = $element.querySelector(".portConfig");

            for (var index = 0; index < portNum; index++) {
                if (index === powerIdx) {
                    $portConfig.innerHTML += '\
                    <div class="powerImg disable">\
                        <img class="disable" src="web-static/images/powerDisplay.png"/>\
                        <span class="disable">POWER</span>\
                    </div>\
                    ';
                }
                switch (port[index].state) {
                    case "disable":
                        $portConfig.innerHTML += '\
                        <div class="portImg disable">\
                            <img class="disable" src="web-static/images/' + this.portDisplayDisableList[port[index].rate ? port[index].rate:"default"] + '"/>\
                            <span class="disable">' + port[index].name + '</span>' + this.portSfpIconDom[port[index].isSfp ? "sfp":"noSfp"] +
                        '</div>';
                        break;
                    case "active":
                        $portConfig.innerHTML += '\
                        <div class="portImg active">\
                            <img class="active" src="web-static/images/' + this.portDisplayActiveList[port[index].rate ? port[index].rate:"default"] + '"/>\
                            <span class="active">' + port[index].name + '</span>' + this.portSfpIconDom[port[index].isSfp ? "sfp":"noSfp"] +
                        '</div>';
                        break;
                    case "normal":
                        $portConfig.innerHTML += '\
                        <div class="portImg normal">\
                            <img class="normal" src="web-static/images/'+ this.portDisplayNormalList[port[index].rate ? port[index].rate:"default"] + '"/>\
                            <span class="normal">' + port[index].name + '</span>' + this.portSfpIconDom[port[index].isSfp ? "sfp":"noSfp"] +
                        '</div>';
                        break;
                }
            }

            $powerImg = $portConfig.querySelector(".powerImg");
            $powerImg.style.float = powerPos;

            $portImgArray = $portConfig.querySelectorAll(".portImg");

            for (var index = 0, length = $portImgArray.length; index < length; index++) {
                $portImgArray[index].style.float = powerPos;
            }

            if(displayClickable){
				for (var index = 0, length = $portImgArray.length; index < length; index++) {
					$portImgArray[index].index = index;
					$portImgArray[index].onclick = function() {
						switch (me.initData.port[this.index].state) {
							case "disable":
								return;
							case "normal":
								me.initData.port[this.index].state = "active";
								me.refresh();
								break;
							case "active":
								me.initData.port[this.index].state = "normal";
								me.refresh();
								break;
						}
						if (Object.prototype.toString.call(me.initData.callback) === "[object Function]") {
							me.initData.callback({
								"index": "" + this.index,
								"state": me.initData.port[this.index].state,
								"name": me.initData.port[this.index].name
							});
						}
					}
                };
			}
        }
        if (type === "setting") {
            $element.innerHTML = '<div class="portConfig setting"></div>';
            $portConfig = $element.querySelector(".portConfig");

            for (var index = 0; index < portNum; index++) {
                if (index === powerIdx) {
                    $portConfig.innerHTML += '\
                    <div class="powerImg disable">\
                        <img class="disable" src="web-static/images/powerSetting.png"/>\
                        <span class="disable">POWER</span>\
                    </div>\
                    ';
                }

                switch (port[index].state) {
                    case "disable":
                        $portConfig.innerHTML += '\
                        <div class="portImg disable">\
                            <img class="disable" src="web-static/images/'+  this.portSettingDisableList[port[index].rate ? port[index].rate:"default"] + '"/>\
                            <span class="disable">' + port[index].name + '</span>' + this.portSfpIconDom[port[index].isSfp ? "sfp":"noSfp"] +
                        '</div>';
                        break;
                    case "active":
                        $portConfig.innerHTML += '\
                        <div class="portImg active">\
                            <img class="active" src="web-static/images/'+ this.portSettingActiveList[port[index].rate ? port[index].rate:"default"] +'"/>\
                            <span class="active">' + port[index].name + '</span>' + this.portSfpIconDom[port[index].isSfp ? "sfp":"noSfp"] +
                        '</div>';
                        break;
                    case "normal":
                        $portConfig.innerHTML += '\
                        <div class="portImg normal">\
                            <img class="normal" src="web-static/images/'+ this.portSettingNormalList[port[index].rate ? port[index].rate:"default"] +'"/>\
                            <span class="normal">' + port[index].name + '</span>' + this.portSfpIconDom[port[index].isSfp ? "sfp":"noSfp"] +
                        '</div>';
                        break;
                }
            }

            $powerImg = $portConfig.querySelector(".powerImg");
            $powerImg.style.float = powerPos;

            $portImgArray = $portConfig.querySelectorAll(".portImg");

            for (var index = 0, length = $portImgArray.length; index < length; index++) {
                $portImgArray[index].style.float = powerPos;
                $portImgArray[index].index = index;
                $portImgArray[index].onclick = function() {
                    switch (me.initData.port[this.index].state) {
                        case "disable":
                            return;
                        case "normal":
                            me.initData.port[this.index].state = "active";
                            me.refresh();
                            break;
                        case "active":
                            me.initData.port[this.index].state = "normal";
                            me.refresh();
                            break;
                    }
                    if (Object.prototype.toString.call(me.initData.callback) === "[object Function]") {
                        me.initData.callback({
                            "index": "" + this.index,
                            "state": me.initData.port[this.index].state,
                            "name": me.initData.port[this.index].name
                        });
                    }
                };
            }
        }
    };

    PortConfig.prototype.refresh = function() {
        var $element = this.initData.element;
        var type = this.initData.type;
        var port = this.initData.port;
        var powerPos = this.initData.powerPos;
        var powerIdx = typeof this.initData.powerIdx === "undefined" ?  0 : parseInt(this.initData.powerIdx);
        var portNum = port.length;
        var $portImgArray = $element.querySelectorAll(".portImg");
        var $powerImg = $element.querySelector(".powerImg");
        var portImgNormalList,portImgActiveList,portImgDisableList;

        if (portNum !== $portImgArray.length ||
            $element.querySelector(".portConfig." + type) === null ||
            $powerImg.style.float !== powerPos ||
            $element.children[0].children[powerIdx].className !== "powerImg disable") {
            this.render();
            return;
        }
        if (type === "display") {
            portImgNormalList = this.portDisplayNormalList;
            portImgActiveList = this.portDisplayActiveList;
            portImgDisableList = this.portDisplayDisableList;
        } else if (type === "setting") {
            portImgNormalList = this.portSettingNormalList;
            portImgActiveList = this.portSettingActiveList;
            portImgDisableList = this.portSettingDisableList;
        }
        for (var index = 0; index < portNum; index++) {
            switch (port[index].state) {
                case "normal":
                    $portImgArray[index].children[0].src = "web-static/images/"+ portImgNormalList[port[index].rate ? port[index].rate:"default"];
                    $portImgArray[index].className = "portImg normal";
                    $portImgArray[index].children[0].className = "normal";
                    $portImgArray[index].children[1].className = "normal";
                    break;
                case "active":
                    $portImgArray[index].children[0].src = "web-static/images/"+ portImgActiveList[port[index].rate ? port[index].rate:"default"];
                    $portImgArray[index].className = "portImg active";
                    $portImgArray[index].children[0].className = "active";
                    $portImgArray[index].children[1].className = "active";
                    break;
                case "disable":
                    $portImgArray[index].children[0].src = "web-static/images/"+ portImgDisableList[port[index].rate ? port[index].rate:"default"];
                    $portImgArray[index].className = "portImg disable";
                    $portImgArray[index].children[0].className = "disable";
                    $portImgArray[index].children[1].className = "disable";
                    break;
            }
            $portImgArray[index].children[1].innerHTML = port[index].name;
        }
    };

    PortConfig.prototype.destroy = function() {
        this.initData.element.innerHTML = "";
    }
}