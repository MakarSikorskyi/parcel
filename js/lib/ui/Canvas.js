window.Canvas || require.once ("lib/dom/_batch.js", "lib/dom/_extend.js", "lib/dom/mkNode.js", "lib/dom/getPosition.js", "lib/function/bind.js", "lib/core/cloneObject.js") && (window.Canvas = (function () {
    var f = function (w, h) {
        if (w === undefined) w = 0; if (h === undefined) h = 0;
        if (!/^[0-9]+$/.test (w)) throw new Error ("Canvas(): Canvas width is undefined or invalid");
        if (!/^[0-9]+$/.test (h)) throw new Error ("Canvas(): Canvas height is undefined or invalid");
        var o = mkNode ("div").$ ({
            w: w, h: h, min: {w: 0, h: 0}, max: {w: w, h: h}, collection: {}, l: {i: -1, zidx: -1, count: 0}, element: {
                alpha: new Canvas.Layer (w, h).applyStyle ({position: "absolute", left: 0, top: 0, zIndex: -10000, visibility: "hidden", display: "none"})
            }, area: mkNode ("textarea").applyStyle ({
                position: "absolute", left: 0, top: 0, width: 0, height: 0, zIndex: -10001, padding: 0, margin: 0, border: "0 none"
            })
        }).applyStyle ({position: "relative", width: w + "px", height: h + "px"});
        o.element.alpha.fillStyle ("#ffffff").fillRect (0, 0, w, h);
        o.appendChild (o.area);
        o.appendChild (o.element.alpha);
        o.element.alpha.channel = {pos: 0, step: 1, get: function () {
            this.pos += this.step;
            return ("00000" + this.pos.toString (16)).slice (-6);
        }, del: function () {
            var el = ("00000" + this.pos.toString (16)).slice (-6);
            o.element.alpha.fillStyle ("#ffffff").fillRect (o.element[el].x, o.element[el].y, o.element[el].w, o.element[el].h);
            this.pos -= this.step;
            delete o.element[el];
        }};
        for (var i in f) if (f.hasOwnProperty (i)) o[i] = f[i];
        o.addLayer ();
        o.addEventHandler (f.event, "mousedown", "mousemove", "mouseup", "mouseover", "mouseout", "click", "dblclick", "keydown", "keyup", "keypress", "select", "contextmenu");
        return o;
    }
    f.dummy = function () {};
    f.clone = function () {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.clone(): Invalid Canvas object");
        if (this.w === 0 || this.h === 0) throw new Error ("Canvas.clone(): Empty Canvas object provided");
        var c = new Canvas (this.w, this.h);
        c.element.alpha.clearRect (0, 0, this.w, this.h).drawImage (this.element.alpha, 0, 0);
        for (var i in this.element) {
            if (!(i in c.element)) {if (type (i) === "object") c.element[i] = cloneObject (this.element[i]); else c.element[i] = this.element[i];}
            if (!/[0-9a-f]{6}/.test (i)) continue;
            c.element[i] = cloneObject (this.element[i]);
        }
        c.addLayer (this.l.i + 1);
        for (var l in this.collection) c.collection[l].drawImage (this.collection[l], 0, 0);
        for (var i in this) if (!(i in c)) {if (type (i) === "object") c[i] = cloneObject (this[i]); else c[i] = this[i];}
        return c;
    };
    f.addLayer = function (count) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.addLayer(): Invalid Canvas object");
        if (count === undefined) count = 1;
        count = parseInt (count);
        do {
            count--;
            this.collection[++this.l.i] = new Canvas.Layer (this.w, this.h);
            this.appendChild (this.collection[this.l.i].applyStyle ({position: "absolute", left: 0, top: 0, zIndex: ++this.l.zidx}));
            this.l.count++;
        } while (count > 1);
        return this;
    };
    f.removeLayer = function (i) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.removeLayer(): Invalid Canvas object");
        if (!/^[0-9]+$/.test (i) || !(i in this.collection)) throw new Error ("Canvas.moveLayer(): Layer " + i + " doesn't exist");
        if (i == this.l.i) this.l.i--;
        this.removeChild (this.collection[i]);
        delete this.collection[i];
        this.l.count--;
        return this;
    };
    f.moveLayer = function (i, zidx) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.moveLayer(): Invalid Canvas object");
        if (!/^[1-9][0-9]*$/.test (i) || !(i in this.collection)) throw new Error ("Canvas.moveLayer(): Layer " + i + " doesn't exist");
        if (!/^-{0,1}[0-9]+$/.test (zidx)) throw new Error ("Canvas.moveLayer(): Layer position is undefined or invalid");
        if (zidx > this.l.zidx) this.l.zidx = zidx;
        this.collection[i].applyStyle ({zIndex: zidx});
        return this;
    };
    f.switchLayers = function (i, j) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.switchLayers(): Invalid Canvas object");
        if (!/^[0-9]+$/.test (i) || !(i in this.collection)) throw new Error ("Canvas.switchLayer(): Layer " + i + " doesn't exist");
        if (!/^[0-9]+$/.test (j) || !(j in this.collection)) throw new Error ("Canvas.switchLayer(): Layer " + j + " doesn't exist");
        var tzidx = this.collection[i].style.zIndex;
        this.collection[i].applyStyle ({zIndex: this.collection[j].style.zIndex});
        this.collection[j].applyStyle ({zIndex: tzidx});
        return this;
    };
    f.setSize = function (w, h) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.setSize(): Invalid Canvas object");
        if (!/^[0-9]+$/.test (w)) throw new Error ("Canvas.setSize(): Canvas width is undefined or invalid");
        if (!/^[0-9]+$/.test (h)) throw new Error ("Canvas.setSize(): Canvas height is undefined or invalid");
        this.$ ({w: w, h: h, max: {w: w, h: h}}).applyStyle ({width: w + "px", height: h + "px"});
        this.element.alpha.$ ({width: w, height: h});
        this.element.alpha.context.fillStyle = "#ffffff";
        this.element.alpha.context.fillRect (0, 0, w, h);
        for (var i in this.element) {
            if (!/[0-9a-f]{6}/.test (i)) continue;
            this.element.alpha.fillStyle ("#" + i).fillRect (this.element[i].x, this.element[i].y, this.element[i].w, this.element[i].h);
        }
        for (var l in this.collection) this.collection[l].$ ({width: w, height: h});
        return this;
    };
    f.scale = function () {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.scale(): Invalid Canvas object");
        this.element.alpha.scale.apply (this.element.alpha, arguments);
        for (var i in this.collection) this.collection[i].scale.apply (this.collection[i], arguments);
        return this;
    };
    f.resize = function () {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.resize(): Invalid Canvas object");
        //TODO
        return this;
    };
    f.alphaStep = function (step) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.alphaStep(): Invalid Canvas object");
        this.element.alpha.channel.step = step;
        return this;
    };
    f.getElement = function (x, y) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.alphaStep(): Invalid Canvas object");
        return this.element.alpha.getColor (x, y);
    };
    f.focus = function () {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.focus(): Invalid Canvas object");
        this.area.focus ();
        return this;
    };
    f.blur = function () {
        if (/function/.test (type (this)) || /undefined/.test (type (this.l))) throw new Error ("Canvas.blur(): Invalid Canvas object");
        this.area.blur ();
        return this;
    };
    f.event = function () {
        var mp = this.getPosition (), e = getEvent (), el;
        if (type (this.event.prev) != "object") this.event.prev = {};
        if (/mouse|click/.test (e.type)) this.event.pos = {
            x: e.pos.x - mp.x,
            y: e.pos.y - mp.y
        }
        this.event.id = (
            /undefined/.test (type (this.l)) ||
            (this.event.pos.x < 0 || this.event.pos.y < 0) ||
            (this.event.pos.x >= this.w || this.event.pos.y >= this.h)
        ) ? undefined : this.getElement (this.event.pos.x, this.event.pos.y);
        if (!(this.event.id in this.element)) this.event.id = undefined;
        switch (e.type) {
            case "mousedown":
                if (this.onMouseDown () !== false) !/undefined/.test (type (this.event.id)) && this.element[this.event.id].onMouseDown.apply (this);
            break;
            case "mousemove":
                if (this.onMouseMove () !== false) {
                    if (!/undefined/.test (type (this.event.id))) {
                        if (this.event.prev.id != this.event.id) {
                            !/undefined/.test (type (this.event.prev.id)) && this.element[this.event.prev.id].onMouseOut.apply (this);
                            this.element[this.event.id].onMouseOver.apply (this);
                        }
                        this.element[this.event.id].onMouseMove.apply (this);
                    } else !/undefined/.test (type (this.event.prev.id)) && this.element[this.event.prev.id].onMouseOut.apply (this);
                    this.event.prev = {id: this.event.id, pos: this.event.pos};
                }
            break;
            case "mouseup":
                if (this.onMouseUp () !== false) !/undefined/.test (type (this.event.id)) && this.element[this.event.id].onMouseUp.apply (this);
            break;
            case "mouseover":
//                this.focus ();
                if (this.onMouseOver () !== false) {
                    !/undefined/.test (type (this.event.id)) && this.element[this.event.id].onMouseOver.apply (this);
                    this.event.prev = {id: this.event.id, pos: this.event.pos};
                }
            break;
            case "mouseout":
//                this.blur ();
                if (this.onMouseOut () !== false) {
                    !/undefined/.test (type (this.event.prev.id)) && this.element[this.event.prev.id].onMouseOut.apply (this);
                    this.event.prev = {};
                }
            break;
            case "click":
                if (window.console) console.log (this.event.pos.x + "x" + this.event.pos.y + ": " + this.event.id);
                if (this.onClick () !== false) !/undefined/.test (type (this.event.id)) && this.element[this.event.id].onClick.apply (this);
            break;
            case "dblclick":
                if (this.onDblClick () !== false) !/undefined/.test (type (this.event.id)) && this.element[this.event.id].onDblClick.apply (this);
            break;
            case "keydown":
                if (window.console) console.log (this.event.pos.x + "x" + this.event.pos.y + ": " + this.event.id);
                this.onKeyDown ();
            break;
            case "keyup":
                this.onKeyUp ();
            break;
            case "keypress":
                this.onKeyPress ();
            break;
            case "select":
                this.onSelect ();
            break;
            case "contextmenu":
                this.onContextMenu ();
            break;
        }
    };
    f.onMouseDown = f.dummy;
    f.onMouseMove = f.dummy;
    f.onMouseUp = f.dummy;
    f.onMouseOver = f.dummy;
    f.onMouseOut = f.dummy;
    f.onClick = f.dummy;
    f.onDblClick = f.dummy;
    f.onKeyDown = f.dummy;
    f.onKeyUp = f.dummy;
    f.onKeyPress = f.dummy;
    f.onSelect = f.dummy;
    f.onContextMenu = f.dummy;
    return f;
}) ());
window.Canvas.Layer || (window.Canvas.Layer = (function () {
    var f = function (w, h) {
        if (!/^[0-9]+$/.test (w)) throw new Error ("Canvas.Layer(): Layer width is undefined or invalid");
        if (!/^[0-9]+$/.test (h)) throw new Error ("Canvas.Layer(): Layer height is undefined or invalid");
        var o = mkNode ("canvas").$ ({width: w, height: h});
        o.context = o.getContext ("2d");
        o.context.fixTextByCaps = false;
        
        for (var i in f) if (f.hasOwnProperty (i)) o[i] = f[i];
        return o;
    };
    f.clear = function () {
        if (/function/.test (type (this)) || /undefined/.test (type (this.parentNode.l))) throw new Error ("Canvas.Layer.clear(): Invalid Canvas object");
        this.context.clearRect (0, 0, this.width, this.height);
        return this;
    };
    f.getColor = function (x, y) {
        if (/function/.test (type (this)) || /undefined/.test (type (this.parentNode.l))) throw new Error ("Canvas.Layer.getColor(): Invalid Canvas object");
        if (x > this.wigth || y > this.height) throw new Error ("Canvas.Layer.getColor(): Provided position is out of bounds");
        var clr = this.getImageData (x, y, 1, 1).data;
        if (type (clr) == "undefined") clr = [255, 255, 255];
        return ("00000" + ((clr[0] << 16) | (clr[1] << 8) | clr[2]).toString (16)).slice (-6);
    };
    
    /* Properties */
    f.fillStyle = function (value) {this.context.fillStyle = value; return this;};
    f.strokeStyle = function (value) {this.context.strokeStyle = value; return this;};
    f.font = function (value) {this.context.font = value; return this;};
    f.textBaseline = function (value) {this.context.textBaseline = value; return this;};
    f.textAlign = function (value) {this.context.textAlign = value; return this;};
    f.globalCompositeOperation = function (value) {this.context.globalCompositeOperation = value; return this;};
    f.shadowColor = function (value) {this.context.shadowColor = value; return this;};
    f.shadowBlur = function (value) {this.context.shadowBlur = value; return this;};
    f.shadowOffsetX = function (value) {this.context.shadowOffsetX = value; return this;};
    f.shadowOffsetY = function (value) {this.context.shadowOffsetY = value; return this;};
    f.miterLimit = function (value) {this.context.miterLimit = value; return this;};
    f.globalAlpha = function (value) {this.context.globalAlpha = value; return this;};
    f.lineJoin = function (value) {this.context.lineJoin = value; return this;};
    f.lineCap = function (value) {this.context.lineCap = value; return this;};
    f.lineWidth = function (value) {this.context.lineWidth = value; return this;};
    f.fixTextByCaps = function (value) {this.context.fixTextByCaps = true; return this;};
    
    /* Methods */
    f.stroke = function () {this.context.stroke.apply (this.context, arguments); return this;};
    f.fill = function () {this.context.fill.apply (this.context, arguments); return this;};
    f.beginPath = function () {this.context.beginPath.apply (this.context, arguments); return this;};
    f.closePath = function () {this.context.closePath.apply (this.context, arguments); return this;};
    f.moveTo = function () {this.context.moveTo.apply (this.context, arguments); return this;};
    f.lineTo = function () {this.context.lineTo.apply (this.context, arguments); return this;};
    f.bezierCurveTo = function () {this.context.bezierCurveTo.apply (this.context, arguments); return this;};
    f.quadraticCurveTo = function () {this.context.quadraticCurveTo.apply (this.context, arguments); return this;};
    f.arc = function () {this.context.arc.apply (this.context, arguments); return this;};
    f.arcTo = function () {this.context.arcTo.apply (this.context, arguments); return this;};
    f.drawImage = function () {this.context.drawImage.apply (this.context, arguments); return this;};
    f.putImageData = function () {this.context.putImageData.apply (this.context, arguments); return this;};
    f.setTransform = function () {this.context.setTransform.apply (this.context, arguments); return this;};
    f.clearRect = function () {this.context.clearRect.apply (this.context, arguments); return this;};
    f.fillRect = function () {this.context.fillRect.apply (this.context, arguments); return this;};
    f.strokeRect = function () {this.context.strokeRect.apply (this.context, arguments); return this;};
    f.fillText = function () {
        var font = this.context.font, fsz, fsw, fsd, n, x, y, dy = 0;
        if (type (font) != "string") font = "10px sans-serif";
        fsz = parseInt (font.match (/([0-9]+)px/)[1]);
        this.measure = mkNode ("canvas").$ ({width: fsz * 2, height: fsz * 2});
        this.measure.context = this.measure.getContext ("2d");
        this.measure.context.font = this.context.font;
        fsw = this.measure.context.measureText ("g").width;
        this.measure.context.fillStyle = "#000000";
        this.measure.context.fillRect (0, 0, fsz * 2, fsz * 2);
        this.measure.context.fillStyle = "#ffffff";
        this.measure.context.textBaseline = "middle";
        this.measure.context.textAlign = "center";
        if (!this.context.fixTextByCaps) {
            this.measure.context.fillText ("g", fsz, fsz);
            fsd = this.measure.context.getImageData (fsz - fsw / 2, fsz + fsz / 2, fsw, fsz / 2).data;
            lf: for (y = 0; y < fsz / 2; y++) for (x = 0; x <= fsw; x++) {
                if (x == fsw) break lf;
                n = (y * fsw + x) * 4;
                if (fsd[n] > 0) {dy++; break;}
            }
        } else {
            this.measure.context.fillText ("Й", fsz, fsz);
            fsd = this.measure.context.getImageData (fsz - fsw / 2, 0, fsw, fsz / 2).data;
            lf: for (y = Math.floor (fsz / 2) - 1; y >= 0; y--) for (x = 0; x <= fsw; x++) {
                if (x == fsw) break lf;
                n = (y * fsw + x) * 4;
                if (fsd[n] > 0) {dy--; break;}
            }
        }
        arguments[2] -= dy;
        delete this.measure;
        this.context.fillText.apply (this.context, arguments);
        return this;
    };
    f.strokeText = function () {
        var f = this.context.font, fsz, fsw, fsd, n, x, y, dy = 0;
        if (type (f) != "string") f = "10px sans-serif";
        fsz = parseInt (f.match (/[0-9]+px/)[0].replace (/px/, ""));
        this.measure = mkNode ("canvas").$ ({width: fsz * 2, height: fsz * 2});
        this.measure.context = this.measure.getContext ("2d");
        this.measure.context.font = this.context.font;
        fsw = this.measure.context.measureText ("g").width;
        this.measure.context.fillStyle = "#000000";
        this.measure.context.fillRect (0, 0, fsz * 2, fsz * 2);
        this.measure.context.fillStyle = "#ffffff";
        this.measure.context.textBaseline = "middle";
        this.measure.context.textAlign = "center";
        if (!this.context.fixTextByCaps) {
            this.measure.context.strokeText ("g", fsz, fsz);
            fsd = this.measure.context.getImageData (fsz - fsw / 2, fsz + fsz / 2, fsw, fsz / 2).data;
            lf: for (y = 0; y < fsz / 2; y++) for (x = 0; x <= fsw; x++) {
                if (x == fsw) break lf;
                n = (y * fsw + x) * 4;
                if (fsd[n] > 0) {dy++; break;}
            }
        } else {
            this.measure.context.strokeText ("Й", fsz, fsz);
            fsd = this.measure.context.getImageData (fsz - fsw / 2, 0, fsw, fsz / 2).data;
            lf: for (y = Math.floor (fsz / 2) - 1; y >= 0; y--) for (x = 0; x <= fsw; x++) {
                if (x == fsw) break lf;
                n = (y * fsw + x) * 4;
                if (fsd[n] > 0) {dy--; break;}
            }
        }
        arguments[2] -= dy;
        delete this.measure;
        this.context.strokeText.apply (this.context, arguments);
        return this;
    };
    f.fillStroke = function () {this.context.fillStroke.apply (this.context, arguments); return this;};
    f.clip = function () {this.context.clip.apply (this.context, arguments); return this;};
    f.transform = function () {this.context.transform.apply (this.context, arguments); return this;};
    f.rotate = function () {this.context.rotate.apply (this.context, arguments); return this;};
    f.translate = function () {this.context.translate.apply (this.context, arguments); return this;};
    f.restore = function () {this.context.restore.apply (this.context, arguments); return this;};
    f.scale = function () {this.context.scale.apply (this.context, arguments); return this;};
    f.save = function () {this.context.save.apply (this.context, arguments); return this;};
    f.measureText = function () {return this.context.measureText.apply (this.context, arguments);};
    f.createPattern = function () {return this.context.createPattern.apply (this.context, arguments);};
    f.createImageData = function () {return this.context.createImageData.apply (this.context, arguments);};
    f.getImageData = function () {return this.context.getImageData.apply (this.context, arguments);};
    f.isPointInPath = function () {return this.context.isPointInPath.apply (this.context, arguments);};
    f.createRadialGradient = function () {
        var gradient = this.context.createRadialGradient.apply (this.context, arguments);
        gradient._addColorStop = gradient.addColorStop;
        gradient.addColorStop = function () {gradient._addColorStop.apply (gradient, arguments); return gradient;};
        return gradient;
    };
    f.createLinearGradient = function () {
        var gradient = this.context.createLinearGradient.apply (this.context, arguments);
        gradient._addColorStop = gradient.addColorStop;
        gradient.addColorStop = function () {gradient._addColorStop.apply (gradient, arguments); return gradient;};
        return gradient;
    };
    /**
    * Draws a rounded rectangle using the current state of the canvas.
    * If you omit the last three params, it will draw a rectangle
    * outline with a 5 pixel border radius
    * @param {CanvasRenderingContext2D} ctx
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate
    * @param {Number} width The width of the rectangle
    * @param {Number} height The height of the rectangle
    * @param {Number} radius The corner radius. Defaults to 5;
    * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
    * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
    */
    f.roundArcRect = function (x, y, width, height, radius, fill, stroke) {
        if (type (stroke) === "undefined") stroke = true;
        if (type (radius) === "undefined") radius = 5;
        this.beginPath ().moveTo (x + radius, y).lineTo (x + width - radius, y).arcTo (x + width, y, x + width, y + radius, radius)
            .lineTo (x + width, y + height - radius).arcTo (x + width, y + height, x + width - radius, y + height, radius)
            .lineTo (x + radius, y + height).arcTo (x, y + height, x, y + height - radius, radius).lineTo (x, y + radius)
            .arcTo (x, y, x + radius, y, radius).closePath ();
        if (stroke) this.stroke ();
        if (fill) {
            if (!stroke) {
                this.strokeStyle (this.context.fillStyle);
                this.stroke ();
            }
            this.fill ();
        }
        return this;
    }
    f.roundRect = function (x, y, width, height, radius, fill, stroke) {
        if (type (stroke) === "undefined") stroke = true;
        if (type (radius) === "undefined") radius = 5;
        this.beginPath ().moveTo (x + radius, y).lineTo (x + width - radius, y).quadraticCurveTo (x + width, y, x + width, y + radius)
            .lineTo (x + width, y + height - radius).quadraticCurveTo (x + width, y + height, x + width - radius, y + height)
            .lineTo (x + radius, y + height).quadraticCurveTo (x, y + height, x, y + height - radius).lineTo (x, y + radius)
            .quadraticCurveTo (x, y, x + radius, y).closePath ();
        if (fill) {
            this.fill ();
            if (!stroke) {
                this.strokeStyle (this.context.fillStyle);
                this.stroke ();
            }
        }
        if (stroke) this.stroke ();
        return this;
    }
    return f;
}) ());
window.Canvas.Element || (window.Canvas.Element = (function () {
    var clr, f = function (c, o) {
        type (o.onMouseDown) === "function" || (o.onMouseDown = c.dummy);
        type (o.onMouseMove) === "function" || (o.onMouseMove = c.dummy);
        type (o.onMouseUp) === "function" || (o.onMouseUp = c.dummy);
        type (o.onMouseOver) === "function" || (o.onMouseOver = c.dummy);
        type (o.onMouseOut) === "function" || (o.onMouseOut = c.dummy);
        type (o.onClick) === "function" || (o.onClick = c.dummy);
        type (o.onDblClick) === "function" || (o.onDblClick = c.dummy);
        clr = c.element.alpha.channel.get ();
        c.element.alpha.fillStyle ("#" + clr).fillRect (o.x, o.y, o.w, o.h);
        c.element[clr] = o;
        return clr;
    };
    return f;
}) ());
window.Canvas.Block || (window.Canvas.Block = (function () {
    
}) ());