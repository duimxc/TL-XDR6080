(function(window){
	CanvasRenderingContext2D.prototype.JTopoRoundRect = function (x, y, width, height, borderRadius) {
		if ("undefined" == typeof borderRadius) {
			borderRadius = 5;
        }
        this.beginPath();
        this.moveTo(x + borderRadius, y);
        this.lineTo(x + width - borderRadius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        this.lineTo(x + width, y + height - borderRadius);
        this.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
        this.lineTo(x + borderRadius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        this.lineTo(x, y + borderRadius);
        this.quadraticCurveTo(x, y, x + borderRadius, y);
        this.closePath();
    };
	JTopo = {
		zIndex_Link: 2,
        zIndex_Node: 3
	};
	window.JTopo = JTopo;
})(window);

(function(JTopo){
	function cloneEvent(event) {
		var newEvent = {};
		for (var key in event) {
			if ("returnValue" != key && "keyLocation" != key) {
				newEvent[key] = event[key];
			}
		}
		return newEvent;
	}

	function clone(obj) {
		var newObj = {};
		for(var key in obj) {
			newObj[key] = obj[key];
		}
		return obj;
	}

	function mouseCoords(event) {
		var newEvent = cloneEvent(event);
		if (newEvent.changedTouches) {
			if (!newEvent.changedTouches[0].pageX) {
				newEvent.pageX = newEvent.changedTouches[0].clientX + document.body.scrollLeft - document.body.clientLeft;
				newEvent.pageY = newEvent.changedTouches[0].clientY + document.body.scrollTop - document.body.clientTop;
			} else {
				newEvent.pageX = newEvent.changedTouches[0].pageX;
				newEvent.pageY = newEvent.changedTouches[0].pageY;
			}
		} else if (!newEvent.pageX) {
			newEvent.pageX = newEvent.clientX + document.body.scrollLeft - document.body.clientLeft;
			newEvent.pageY = newEvent.clientY + document.body.scrollTop - document.body.clientTop;
		}
		return newEvent;
	}

	function getEventPosition(event) {
		var newEvent = mouseCoords(event);
		return newEvent;
	}

	function getOffsetPosition(element) {
		if (!element) {
			return {
				left: 0,
				top: 0
			};
		}

		var elementLeft = 0, elementTop = 0;
		if ("getBoundingClientRect" in document.documentElement){
			var elementClientRect = element.getBoundingClientRect();
			var ownerDocument = element.ownerDocument;
			var body = ownerDocument.body;
			var documentElement = ownerDocument.documentElement;
			var top = documentElement.clientTop || body.clientTop || 0;
			var left = documentElement.clientLeft || body.clientLeft || 0;
			elementTop = elementClientRect.top + (self.pageYOffset || documentElement && documentElement.scrollTop || body.scrollTop) - top;
			elementLeft = elementClientRect.left + (self.pageXOffset || documentElement && documentElement.scrollLeft || body.scrollLeft) - left;
		} else {
			do {
				elementTop += element.offsetTop || 0;
				elementLeft += element.offsetLeft || 0;
				element = element.offsetParent;
			} while (element);
		}

		return {
			left: elementLeft,
			top: elementTop
		};
	}

	JTopo.util = {
		isIE: !(!window.attachEvent || -1 !== navigator.userAgent.indexOf("Opera")),
		getEventPosition: getEventPosition,
		getOffsetPosition: getOffsetPosition,
		clone: clone
	};
})(JTopo);

/* Stage */
(function(JTopo){
	function Stage(canvas) {
		function getEventPosition(event) {
			var newEvent = JTopo.util.getEventPosition(event);
			var canvasOffset = JTopo.util.getOffsetPosition(_this.canvas);
			newEvent.offsetLeft = newEvent.pageX - canvasOffset.left;
			newEvent.offsetTop = newEvent.pageY - canvasOffset.top;
			newEvent.x = newEvent.offsetLeft;
			newEvent.y = newEvent.offsetTop;
			newEvent.target = null;
			return newEvent;
		}

		function onclick(event) {
			var newEvent = getEventPosition(event);
			_this.dispatchEventToScenes("click", newEvent);
		}

		function ondblclick(event) {
			var newEvent = getEventPosition(event);
			_this.dispatchEventToScenes("dbclick", newEvent);
		}

		function ontouchStart(event) {
			var newEvent = getEventPosition(event);
			_this.dispatchEventToScenes("touchstart", newEvent);
		}

		function onmousemove(event) {
			var newEvent = getEventPosition(event);
			_this.dispatchEventToScenes("mousemove", newEvent);
		}

		function initClickEvent() {
			if (JTopo.util.isIE || !window.addEventListener) {
				canvas.onclick = onclick;
				canvas.ondblclick = ondblclick;
				canvas.onmousemove = onmousemove;
			} else {
				canvas.addEventListener("click",onclick);
				canvas.addEventListener("dblclick",ondblclick);
				canvas.addEventListener("mousemove",onmousemove);
				canvas.addEventListener("touchstart",ontouchStart);
			}
		}

		var _this = this;
		this.initialize = function(canvas) {
			initClickEvent(canvas);
			this.canvas = canvas;
			this.graphics = canvas.getContext('2d');
			this.childs = [];
			this.frames = 24;
			this.needRepaint = true;
		};
		if (canvas) {
			this.initialize(canvas);
		}

		this.dispatchEventToScenes = function (elementName, event) {
			if (0 != this.frames) {
				this.needRepaint = true;
			}
			this.childs.forEach(function(child) {
				var handler = child[elementName + "Handler"];
				if (null == handler) {
					throw new Error("Function not found:" + elementName + "Handler");
				} else {
					handler.call(child,event);
				}
			});
		};

		this.add = function (scene) {
			for (var i = 0; i < this.childs.length; i++) {
				if (this.childs[i] == scene) return;
			}
			scene.addTo(this);
			this.childs.push(scene);
		};

		this.paint = function () {
			if (null != this.canvas) {
				this.graphics.save();
				this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);
				this.childs.forEach(function(child){
					child.repaint(_this.graphics);
				});
				this.graphics.restore();
			}
		};

		this.repaint = function (){
			if (0 != this.frames) {
				if (!(this.frames < 0 && false == this.needRepaint)) {
					this.paint();
					if (this.frames < 0) {
						this.needRepaint = false;
					}
				}
			}
		};
	}
	JTopo.Stage = Stage;
})(JTopo);

/* Scene */
(function(JTopo){
	function Scene(stage) {
		var _this = this;
		this.initialize = function () {
			this.elementType = "scene";
			this.childs = [];
			this.zIndexMap = {};
			this.zIndexArray = [];
			this.dbclickCallback = null;
			this.touchstartCallback = null;
		};
		this.initialize();

		this.addTo = function (stage) {
			if (this.stage !== stage && null != stage) {
				this.stage = stage;
			}
		};

		if (null != stage) {
			stage.add(this);
			this.addTo(stage);
		}

		this.paint = function (context) {
			if (null != this.stage) {
				context.save();
				context.restore();
				context.save();
				this.paintChilds(context);
				context.restore();
			}
		};

		this.repaint = function (context) {
			this.paint(context);
		};

		this.paintChilds = function (context) {
			for (var i = 0; i < this.zIndexArray.length; i++) {
				var index = this.zIndexArray[i];
				var arr = this.zIndexMap[index];
				for (var j = 0; j < arr.length; j++) {
					var child = arr[j];
					/*if (this.isVisible(child))*/ {
						context.save();
						if (1 == child.transformAble) {
							var centerPos = child.getCenterLocation();
							context.translate(centerPos.x, centerPos.y);
						}
						child.paint(context);
						context.restore();
					}
				}
			}
		};

		this.add = function (child) {
			this.childs.push(child);
			if (null == this.zIndexMap[child.zIndex]) {
				this.zIndexMap[child.zIndex] = [];
				this.zIndexArray.push(child.zIndex);
				this.zIndexArray.sort(function(a,b){
					return b - a;
				});
			}

			this.zIndexMap["" + child.zIndex].push(child);
		};

		this.clear = function () {
			this.childs = [];
			this.zIndexArray = [];
			this.zIndexMap = {};
		};

		this.getElementByXY = function (x, y) {
			var element = null;
			var nodeArr = this.zIndexMap[JTopo.zIndex_Node];
			if (nodeArr && nodeArr.length > 0) {
				for (var j = nodeArr.length - 1; j >= 0; j--) {
					var child = nodeArr[j];
					if ((child instanceof JTopo.Node || child instanceof JTopo.ButtonNode) &&
						child.isInBound(x,y)) {
						element = child;
					}
				}
			}
			return element;
		};

		this.selectElement = function (event) {
			var element = _this.getElementByXY(event.x, event.y);

            if (null != element) {
                event.target = element;
            }
            this.currentElement = element;
        };

		this.toSceneEvent = function (event) {
			var newEvent = JTopo.util.clone(event);
			if (null != this.currentElement) {
				newEvent.target = this.currentElement;
			}
			newEvent.scene = this;
			return newEvent;
		};

		this.clickHandler = function (event) {
			if ("function" == typeof this.onclick) {
				this.onclick();
			}

			this.selectOperationNode(event);
			var newEvent = this.toSceneEvent(event);
			if (this.currentElement) {
				newEvent.target = this.currentElement;
				this.currentElement.clickHandler(newEvent);
			}
		};

		this.getEditNodeByXY = function (x,y) {
			var element = null;
			var nodeArr = this.zIndexMap[JTopo.zIndex_Node];
			if (nodeArr && nodeArr.length > 0) {
				for (var j = nodeArr.length - 1; j >= 0; j--) {
					var child = nodeArr[j];
					if (child instanceof JTopo.Node &&
						child.isInEditBound(x,y)) {
						element = child;
					}
				}
			}

			return element;
		};

		this.getOperationNodeByXY = function (x,y) {
			var element = null;
			var nodeArr = this.zIndexMap[JTopo.zIndex_Node];
			if (nodeArr && nodeArr.length > 0) {
				for (var j = nodeArr.length - 1; j >= 0; j--) {
					var child = nodeArr[j];
					if (child instanceof JTopo.Node &&
						child.isInOperationBound(x,y)) {
						element = child;
					}
				}
			}

			return element;
		};

		this.selectEditNode = function (event) {
			var element = this.getEditNodeByXY(event.x, event.y);

			if (null != element) {
				event.target = element;
			}
			this.currentElement = element;
		};

		this.selectOperationNode = function (event) {
			var element = this.getOperationNodeByXY(event.x, event.y);

			if (null != element) {
				event.target = element;
			}
			this.currentElement = element;
		};

		this.dbclickHandler = function (event) {
			this.selectEditNode(event);
			var newEvent = {};
			if (this.currentElement) {
				newEvent.target = this.currentElement;
				newEvent.pageX = this.currentElement.x + Math.floor(this.currentElement.textX);
				newEvent.pageY = this.currentElement.y + Math.floor(this.currentElement.textY);
				newEvent.textWidth = this.currentElement.textRectWidth;
				newEvent.textHeight = this.currentElement.textRectHeight;
				this.dbclickCallback(newEvent);
			}
		};

		this.touchstartHandler = function (event) {
			this.selectEditNode(event);
			var newEvent = {};
			if (this.currentElement) {
				newEvent.target = this.currentElement;
				newEvent.pageX = this.currentElement.x + Math.floor(this.currentElement.textX);
				newEvent.pageY = this.currentElement.y + Math.floor(this.currentElement.textY);
				newEvent.textWidth = this.currentElement.textRectWidth;
				newEvent.textHeight = this.currentElement.textRectHeight;
				this.touchstartCallback(newEvent);
				return;
			}

			this.selectOperationNode(event);
			if (this.currentElement) {
				if ("function" == typeof this.onclick) {
					this.onclick();
				}

				var newEvent = this.toSceneEvent(event);
				if (this.currentElement) {
					newEvent.target = this.currentElement;
					this.currentElement.clickHandler(newEvent);
				}
			}
		}

		this.mousemoveHandler = function (event) {
			var newEvent = this.toSceneEvent(event);
			var node = _this.getElementByXY(newEvent.x, newEvent.y);
			if (null == node || node instanceof JTopo.Node) {
				node = _this.getEditNodeByXY(newEvent.x, newEvent.y);
				if (node == null) {
					node = _this.getOperationNodeByXY(newEvent.x, newEvent.y);
				}
			}
			if (null != node) {
				if (_this.mouseOverElement && _this.mouseOverElement !== node) {
					newEvent.target = node;
					_this.mouseOverElement.mouseoutHandler(newEvent, _this);
				}
				_this.mouseOverElement = node;
				if (0 == node.isMouseOver) {
					newEvent.target = node;
					node.mouseoverHandler(newEvent, _this);
				}
			} else if (_this.mouseOverElement) {
				newEvent.target = node;
				_this.mouseOverElement.mouseoutHandler(newEvent, _this);
				_this.mouseOverElement = null;
			} else {
				newEvent.target = null;
			}
		};

		this.getCenterLocation = function () {
			return {
				x: _this.stage.canvas.width / 2,
                y: _this.stage.canvas.height / 2
			};
		};

		this.doLayout = function (layout) {
                layout && layout(this, this.childs);
        };

        this.dbclick = function(callback) {
        	if (null != callback) {
        		this.dbclickCallback = callback;
        	}
        };

		this.tarchstart = function(callback) {
			if (null != callback) {
				this.touchstartCallback = callback;
			}
		};
	}
	JTopo.Scene = Scene;
})(JTopo);

/* Element */
(function(JTopo){
	function Element() {
		this.initialize = function (){
			this.elementType = "displayElement";
			this.x = 0;
			this.y = 0;
			this.cx = 0;
			this.cy = 0;
			this.width = 64;
			this.height = 64;
			this.visible = true;
			this.alpha = 1;
			this.scaleX = 1;
			this.scaleY = 1;
			this.strokeColor = "22,124,255";
			this.borderColor = "22,124,255";
			this.fillColor = "22,124,255";
			this.transformAble = false;
			this.zIndex = 0;
		};
		this.initialize();

		this.setLocation = function (x,y){
			this.x = x;
			this.y = y;
		};

		this.getCenterLocation = function () {
			return {
				x: this.x + this.width / 2,
				y: this.y + this.height / 2
			};
		};

		this.setSize = function (width, height) {
			this.width = width;
			this.height = height;
		};

		this.setBound = function (x,y,width,height) {
			this.setLocation(x,y);
			this.setSize(width,height);
		};

		this.getCx = function () {
			return this.x + this.width / 2;
		};

		this.getCy = function () {
			return this.y + this.height / 2;
		};
	}

	function InteractiveElement () {
		this.initialize = function () {
			InteractiveElement.prototype.initialize.apply(this,arguments);
			this.elementType = "interactiveElement";
			this.isMouseOver = false;
		};

		this.initialize();

		this.isInBound = function (x,y) {
			return x > this.x && x < this.x + this.width &&
					y > this.y && y < this.y + this.height;
		};

		this.clickHandler = function(event) {};

		this.mouseoverHandler = function (event, scene) {
			this.isMouseOver = true;
			scene.stage.canvas.style.cursor = "pointer";
		};

		this.mouseoutHandler = function (event, scene) {
			this.isMouseOver = false;
			scene.stage.canvas.style.cursor = "default";
		};
	}
	InteractiveElement.prototype = new Element();
	JTopo.InteractiveElement = InteractiveElement;
})(JTopo);

/* Node */
(function (JTopo) {
	function BaseNode (text) {
		/* 自动换行显示 */
		this.wrapText = function (text,context,x,y){
			var TEXT_AREA_WIDTH = 96;
			this.textRectHeight = 4;
			if (null != text && "" != text) {
				var canFullShow = context.measureText(text).width < TEXT_AREA_WIDTH * 3 ? true : false;
				var lastFiveCharacters = "";
				var lastFiveLen = 0;
				var arrText = text.split('');
    			var line = '';
				var totalLen = 0;

				if (!canFullShow) {
					lastFiveCharacters = text.slice(text.length - 5, text.length);
					lastFiveLen = context.measureText(lastFiveCharacters).width;
				}
				for (var n = 0; n < arrText.length; n++) {
			        var testLine = line + arrText[n];
			        var testWidth = context.measureText(testLine).width;
			        var lineHeight = context.measureText("田").width + 2;
					totalLen += context.measureText(arrText[n]).width;
					if (totalLen > TEXT_AREA_WIDTH * 3) { break;}
					if (testWidth > TEXT_AREA_WIDTH) {
						 context.fillText(line, x, y);
						 line = arrText[n];
						 y += lineHeight;
						 this.textRectHeight += 13;
					} else {
						if (totalLen > TEXT_AREA_WIDTH * 2 && testWidth > TEXT_AREA_WIDTH - lastFiveLen){
							line = line + "..." + lastFiveCharacters;
							break;
						} else {
							line = testLine;
						}
					}
			    }
				if (totalLen <= TEXT_AREA_WIDTH * 3) {
					var lineWidth;
					if (totalLen > TEXT_AREA_WIDTH) {
						lineWidth = context.measureText(line).width;
						context.fillText(line, x + (TEXT_AREA_WIDTH - lineWidth) / 2, y);
						this.textRectHeight += 13;
					} else {
						context.fillText(line, x, y);
						this.textRectHeight += 13;
					}
				}
			}
		}

		this.initialize = function (text) {
			BaseNode.prototype.initialize.apply(this,arguments);
			this.zIndex = JTopo.zIndex_Node;
			this.text = text;
			this.font = "12px 微软雅黑, 宋体, Arial";
			this.fontColor = "255,255,255";
			this.textOffsetX = 0;
			this.textOffsetY = 0;
			this.transformAble = true;
			this.inLinks = null;
			this.outLinks = null;
			this.number = null;
			this.textRectHeight = 0;
			this.textRectWidth = 0;
			this.textX = 0;
			this.textY = 0;
			this.showOperation = true;
			this.image;
		};
		this.initialize(text);
		this.paint = function (context) {
			if (this.image) {
				context.save();
				context.fillStyle = "#009188";
				context.JTopoRoundRect(-this.width/2, -this.height/2, this.width, this.height, 12);
				context.fill();
				context.restore();

				var gAlpha = context.globalAlpha;
				context.globalAlpha = this.alpha;
				context.drawImage(this.image, this.imgOffsetX, this.imgOffsetY, this.imgWidth, this.imgHeight, -this.imgScaleWidth/2, -this.imgScaleHeight/2, this.imgScaleWidth, this.imgScaleHeight);
				context.globalAlpha = gAlpha;
				this.paintText(context);
				this.paintNumber(context);
				this.paintOperation(context);
			} else {
				var that = this;
				routerBg = new Image();
				routerBg.src = "../web-static/images/routerBg.png";
				routerBg.onload = function (){
					that.image = routerBg;
					that.paintText(context);
					that.paintNumber(context);
					that.paintOperation(context);
				};
			}
		};

		this.paintOperation = function (context) {
			if (this.showOperation) {
				if (this.isMeshSta) {
					context.drawImage(this.image, 376, 331, 22, 22, this.width / 2 - 13,  -this.height / 2 - 6, 22, 22);
				} else {
					context.drawImage(this.image, 376, 308, 22, 22, this.width / 2 - 13,  -this.height / 2 - 6, 22, 22);
				}
			}
		};

		this.paintNumber = function (context) {
			if (null != this.number && this.number != 0) {
				var numberPos = {
					x: this.width/2 - 18,
					y: this.height/2 - 7
				};
				if ("99+" == this.number) {
					numberPos.x -= 10;
					numberPos.y += 0;
				}
				context.beginPath();
				context.font = this.font;
				context.save();
				context.fillStyle = "rgba(0, 176, 165, 1)";
				if ("99+" == this.number) {
					context.JTopoRoundRect(this.width/2 - 35, this.height/2 - 22, 34, 20, 12);
				} else {
					context.arc(this.width/2 - 11, this.height/2 - 12, 10, 0, 2*Math.PI);
				}
				context.fill();
				context.restore();
				context.fillStyle = "rgba(" + this.fontColor + "," + this.alpha + ")";
				context.fillText(this.number,numberPos.x,numberPos.y);
				context.closePath();
			}
		};

		this.paintText = function (context) {
			var text = this.text;
			if (undefined != text && "" != text) {
				context.beginPath();
				context.font = this.font;
				var textWidth = context.measureText(text).width,
					textHeight = context.measureText("田").width;

				var textPos = this.getTextPosition(textWidth, textHeight);
				context.fillStyle = "rgba(" + this.fontColor + "," + this.alpha + ")";
				this.wrapText(text,context,textPos.x,textPos.y);
				context.closePath();
			}
		};

		this.getTextPosition = function (textWidth, textHeight) {
			textWidth = textWidth > 96 ? 96 : textWidth;
			var textPos = {
				x: - textWidth / 2,
				y: this.height / 2 + textHeight
			};

			if (null != this.textOffsetX) {
				textPos.x += this.textOffsetX;
			}
			if (null != this.textOffsetY) {
				textPos.y += this.textOffsetY;
			}

			return textPos;
		};

		this.setImagePosition = function (offsetX, offsetY, width, height, scaleWidth, scaleHeight) {
			this.imgOffsetX = offsetX;
			this.imgOffsetY = offsetY;
			this.imgWidth = width;
			this.imgHeight = height;
			this.imgScaleWidth = scaleWidth || width;
			this.imgScaleHeight = scaleHeight || height;

			if (undefined == routerBg) {
				var that = this;
				routerBg = new Image();
				routerBg.src = "../web-static/images/routerBg.png";
				routerBg.onload = function (){
					that.image = routerBg;
				};
			} else {
				this.image = routerBg;
			}
		};

		this.setWifiImagePosition = function (offsetX, offsetY) {
			this.wifiImgOffsetX = offsetX;
			this.wifiImgOffsetY = offsetY;
		};
	}
	function Node() {
		Node.prototype.initialize.apply(this,arguments);

		this.mouseoverHandler = function (event, scene) {
			this.isMouseOver = true;
			scene.stage.canvas.style.cursor = "pointer";

			if (this.isInOperationBound(event.x, event.y)) {
				return;
			}

			if ("function" == typeof this.onmouseover) {
				var newEvent = {};
				newEvent.x = this.x;
				newEvent.y = this.y;
				newEvent.textWidth = this.textRectWidth;
				newEvent.textHeight = this.textRectHeight;
				this.onmouseover(newEvent, this.text);
			}
		};

		this.mouseoutHandler = function (event, scene) {
			this.isMouseOver = false;
			scene.stage.canvas.style.cursor = "default";

			if (this.isInOperationBound(event.x, event.y)) {
				return;
			}

			if ("function" == typeof this.onmouseout) {
				this.onmouseout();
			}
		};

		this.clickHandler = function(event) {
			if (this.isInOperationBound(event.x, event.y)) {
				var newNevent = {};
				newNevent.target = this;
				if ("function" == typeof this.onclick) {
					this.onclick(newNevent);
				}
			}
		};

		this.isInOperationBound = function (x,y) {
			if (x > this.x + this.width - 14 && x < this.x + this.width + 10 &&
				y > this.y - 10 && y < this.y + 16) {
				return true;
			}
			return false;
		};

		this.isInEditBound = function (x,y) {
			var offsetX = this.width > this.textRectWidth ? 0 : (this.textRectWidth - this.width) / 2;
			if (x > this.x - offsetX && x < this.x + this.width + offsetX &&
				y > this.y + this.height + this.textOffsetY && y < this.y + this.height + this.textRectHeight + this.textOffsetY) {
				return true;
			}
			return false;
		};
	}
	function TextNode(text) {
        this.initialize();
        this.text = text;
        this.elementType = "TextNode";
        this.paint = function (context) {
            context.beginPath();
            context.font = this.font;
            this.width = context.measureText(this.text).width;
            this.height = context.measureText("田").width;
            context.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            context.fillText(this.text, -this.width / 2, this.height / 2);
            context.closePath();
        };
    }
    function ButtonNode(text) {
    	this.initialize = function (text) {
			ButtonNode.prototype.initialize.apply(this,arguments);
			this.text = text;
	        this.elementType = "ButtonNode";
	        this.fontColor = "51, 51, 51";
	        this.font = "10px 微软雅黑, 宋体, Arial";
			this.backgroundColor = "254, 235, 26";
	        this.onclick = null;
		};
    	this.initialize(text);
        
        this.paint = function (context) {
            context.beginPath();
            context.font = this.font;
            this.width = context.measureText(this.text).width + 16;
            this.height = context.measureText("田").width + 6;
            context.save();
            context.fillStyle = "rgba(" + this.backgroundColor + ",1)";
			context.JTopoRoundRect(0, 0, this.width, this.height, 4);
			context.fill();
            context.restore();
            context.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            context.fillText(this.text, 8, this.height - 4);
            context.closePath();
        };

        this.clickHandler = function(event) {
        	if ("function" == typeof this.onclick) {
        		this.onclick(event);
        	}
        };
    }

	var routerBg;
	var images = {};
	BaseNode.prototype = new JTopo.InteractiveElement();
	Node.prototype = new BaseNode();
	TextNode.prototype = new Node();
	ButtonNode.prototype = new BaseNode();
	JTopo.Node = Node;
	JTopo.TextNode = TextNode;
	JTopo.ButtonNode = ButtonNode;
})(JTopo);

/* Link */
(function (JTopo){
	function Link(nodeA, nodeZ, text) {
		this.initialize = function (nodeA, nodeZ, text){
			Link.prototype.initialize.apply(this,arguments);
			this.elementType = "link";
			this.zIndex = JTopo.zIndex_Link;
			if (0 != arguments.length) {
				this.text = text;
				this.nodeA = nodeA;
				this.nodeZ = nodeZ;
				this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = []);
				this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = []);
				this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = []);
				this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = []);
				null != this.nodeA && this.nodeA.outLinks.push(this);
				null != this.nodeZ && this.nodeZ.outLinks.push(this);
				this.lineWidth = 2;
				this.transformAble = false;
				this.dashedPattern = null;
				this.strokeColor = "255, 255, 255";
				this.bundleGap = 12;
			}
		};
		this.initialize(nodeA, nodeZ, text);

		this.paintPath = function (context, posArr) {
			context.beginPath();
			context.moveTo(posArr[0].x, posArr[0].y);
			for (var i = 1; i < posArr.length; ++i){
				context.lineTo(posArr[i].x,posArr[i].y);
			}

			context.stroke();
			context.closePath();
		};

		this.paintWifiImage = function (context, posArr) {
			if (posArr[posArr.length - 1] && this.nodeZ.image) {
				context.drawImage(this.nodeZ.image, this.nodeZ.wifiImgOffsetX, this.nodeZ.wifiImgOffsetY, 20, 20, posArr[posArr.length - 1].x - 10, posArr[posArr.length - 1].y - 18,20,20);
			}
		};

		this.paint = function (context) {
			if (null != this.nodeA && null != this.nodeZ) {
				var posArr = this.getPath();
				context.strokeStyle = "rgba(" + this.strokeColor + "," + this.alpha + ")";
				context.lineWidth = this.lineWidth;
				this.paintPath(context,posArr);
				this.paintWifiImage(context,posArr);
			}
		};
	}

	function FlexionalLink(nodeA, nodeZ, text) {
		this.initialize = function () {
			this.roundLine = false;
			FlexionalLink.prototype.initialize.apply(this,arguments);
		};
		this.initialize(nodeA, nodeZ, text);

		this.getStartPosition = function () {
			var pos = {
				x: this.nodeA.getCx()
			};

			pos.y = this.nodeA.y + this.nodeA.height + this.nodeA.textRectHeight + this.nodeA.textOffsetY;

			return pos;
		};

		this.getEndPosition = function () {
			var pos = {
				x: this.nodeZ.getCx(),
				y: this.nodeZ.getCy()
			};

			pos.y = this.nodeZ.y - 8;

			return pos;
		};

		this.getPath = function () {
			var startPos = this.getStartPosition();
			var endPos = this.getEndPosition();
			if (this.nodeA === this.nodeZ) return [startPos,endPos];

			var posArr = [];
			posArr.push({
				x: startPos.x,
				y: startPos.y
			});
			posArr.push({
				x: startPos.x,
				y: endPos.y - 32
			});
			posArr.push({
				x: endPos.x,
				y: endPos.y - 32
			});
			posArr.push({
				x: endPos.x,
				y: endPos.y
			});

			return posArr;
		};

		this.paintPath = function (context, posArr) {
			context.beginPath();
			context.moveTo(posArr[0].x, posArr[0].y);

			if (null == this.dashedPattern) {
				context.lineTo(posArr[1].x,posArr[1].y);
				if (!this.roundLine) {
					context.lineTo(posArr[2].x,posArr[2].y);
				} else {
					if (posArr[2].x < posArr[0].x) {
						context.lineTo(posArr[2].x + 5,posArr[2].y);
						context.moveTo(posArr[2].x,posArr[2].y + 5);
						context.arc(posArr[2].x + 5, posArr[2].y + 5, 5, 1*Math.PI, 1.5*Math.PI);
						context.moveTo(posArr[2].x,posArr[2].y + 5);
					} else if (posArr[2].x > posArr[0].x){
						context.lineTo(posArr[2].x - 5,posArr[2].y);
						context.arc(posArr[2].x - 5, posArr[2].y + 5, 5, 1.5*Math.PI, 0);
						context.moveTo(posArr[2].x,posArr[2].y + 5);
					} else {
						context.lineTo(posArr[2].x,posArr[2].y);
					}
				}
				context.lineTo(posArr[3].x,posArr[3].y);
			}

			context.stroke();
			context.closePath();
		};
	}
	Link.prototype = new JTopo.InteractiveElement();
	FlexionalLink.prototype = new Link();
	JTopo.Link = Link;
	JTopo.FlexionalLink = FlexionalLink;
})(JTopo);

/* layout */
(function(JTopo){
	function getRootNodes(childs) {
		var nodes = [];
		var links = childs.filter(function(child){
			if (child instanceof JTopo.Link) {
				return true;
			}

			nodes.push(child);
			return false;
		});

		childs = nodes.filter(function (node) {
			for (var i = 0; i < links.length; ++i) {
				if (links[i].nodeZ === node) return false;
			}
			return true;
		});
		childs = childs.filter(function(node){
			for (var i = 0; i < links.length; i++) {
				if (links[i].nodeA === node) return true;
			}
			return false;
		});

		return childs;
	}

	function rightShift (childs, node, offsetX, offsetY) {
		node.x += offsetX;
		node.y += offsetY;
		var nodeChilds = getNodeChilds(childs, node);
		for (var i = 0; i < nodeChilds.length; i++) {
			rightShift(childs,nodeChilds[i],offsetX,offsetY);
		}
	}

	function parseTree(childs, rootNode) {
		function getTreeNodes(rootNode, index) {
			var nodeArr = getNodeChilds(childs, rootNode);
			if (null == treeNodes[index]) {
				treeNodes[index] = {};
				treeNodes[index].nodes = [];
				treeNodes[index].childs = [];
			}
			treeNodes[index].nodes.push(rootNode);
			treeNodes[index].childs.push(nodeArr);
			for (var i = 0; i < nodeArr.length; i++) {
				getTreeNodes(nodeArr[i], index + 1);
				nodeArr[i].parent = rootNode;
			};
		}
		var treeNodes = [];
		getTreeNodes(rootNode,0);
		return treeNodes;
	}
	function TreeLayout(width, height) {
		return function (scene) {
			function generateTree(childs, rootNode) {
				var treeDeep = JTopo.layout.getTreeDeep(childs,rootNode),
				treeNodes = parseTree(childs,rootNode),
				lastNodes = treeNodes[""+treeDeep].nodes;

				var lastNodeHeight = treeDeep * height;
				if (lastNodeHeight + height> scene.stage.canvas.height) {
					scene.stage.canvas.height = lastNodeHeight + height;
				}

				for (var i = 0; i < lastNodes.length; i++) {
					var node = lastNodes[i],
						x = i * (width + 10),
						y = lastNodeHeight;
					node.setLocation(x,y);
				}

				for (var i = treeDeep - 1; i >= 0; i--) {
					var nodes = treeNodes["" + i].nodes,
						childs = treeNodes["" + i].childs;
					for (var j = 0; j < nodes.length; j++) {
						var node = nodes[j],
							childNodes = childs[j];

						if (0 == i) {
							node.y = 0;
						} else {
							node.y = i * height;
						}

						if (childNodes.length > 0) {
							node.x = (childNodes[0].x + childNodes[childNodes.length - 1].x) / 2;
						} else if (j > 0) {
							node.x = nodes[j-1].x + nodes[j-1].width + 54;
						}

						if (j > 0) {
							if (node.x < nodes[j-1].x + nodes[j-1].width + 54) {
								var x = nodes[j-1].x + nodes[j-1].width + 54,
									offsetX = Math.abs(x - node.x);
								for (var k = j; k < nodes.length; k++) {
									rightShift(scene.childs, nodes[k], offsetX, 0);
								}
							}
						}
					}
				}
			}

			var rootNodes = JTopo.layout.getRootNodes(scene.childs);
			if (rootNodes.length > 0) {
				generateTree(scene.childs, rootNodes[0]);

				var centerPos = scene.getCenterLocation();
				var offsetX = centerPos.x - (rootNodes[0].x + rootNodes[0].width / 2);
				scene.childs.forEach(function(child){
					if (child instanceof JTopo.Node) {
						child.x += offsetX;
						child.y += 5;
					}
				});
			}
		};
	}

	function getNodeChilds(childs, rootNode) {
		var nodes = [];
		for (var i = 0; i < childs.length; i++) {
			if (childs[i] instanceof JTopo.Link &&
				childs[i].nodeA === rootNode) {
				nodes.push(childs[i].nodeZ);
			}
		}
		return nodes;
	}

	function calculateNodesPosition(centerFlag ,x, y, childNodeNum, width, height) {
		var arr = [];
		var leftmostNode;
		if (centerFlag) {
			leftmostNode = x - childNodeNum / 2 * width + width / 2;
		} else {
			leftmostNode = x;
		}

		for (var j = 0; childNodeNum >= j; j++) {
			arr.push({
				x: leftmostNode + j * width,
				y: y + height
			});
		}
		return arr
	}

	function adjustPosition(rootNode, childNodes, centerFlag) {
		if (rootNode.layout) {
			var layout = rootNode.layout,
				calculatedPos = null;
			var width = layout.width || 50,
				height = layout.height || 50;

			calculatedPos = calculateNodesPosition(centerFlag, rootNode.x, rootNode.y + rootNode.height + 61, childNodes.length, width, height);

			while (calculatedPos[0].x < 0) {
				for (var i = 0; i < calculatedPos.length; ++i) {
					calculatedPos[i].x += width;
				}
			}

			if (calculatedPos[0].x < 20) {
				calculatedPos[0].x = 20;
			}

			for (var j = 0; j < childNodes.length; j++) {
				childNodes[j].setLocation(calculatedPos[j].x, calculatedPos[j].y)
			}
		}
	}
	
	function layoutNode(scene, node, centerFlag) {
		var childNodes = getNodeChilds(scene.childs, node);
		if (0 == childNodes.length)  {
			return null;
		}

		adjustPosition(node, childNodes, centerFlag);

		if (childNodes.length === 6) {
			layoutNode(scene, childNodes[0], false);
		} else {
			layoutNode(scene, childNodes[0], true);
		}

		return null
	}

	function getTreeDeep(childs, rootNode) {
		function calculateTreeDeep(childs, rootNode, deep) {
			var nodeArr = getNodeChilds(childs, rootNode);
			if (deep > treeDeep) {
				treeDeep = deep;
			}
			for (var i = 0; i < nodeArr.length; i++) {
				calculateTreeDeep(childs,nodeArr[i],deep+1);
			}
		}

		var treeDeep = 0;
		calculateTreeDeep(childs,rootNode,0);
		return treeDeep;
	}

	JTopo.layout = JTopo.Layout = {
		layoutNode: layoutNode,
		adjustPosition: adjustPosition,
		getNodeChilds: getNodeChilds,
		getTreeDeep: getTreeDeep,
		getRootNodes: getRootNodes,
		TreeLayout: TreeLayout
	};
})(JTopo);
