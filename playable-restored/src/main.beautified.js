import {
    resolveAutoDropSourcePoint,
    resolveDropStartFromSwingPose,
    resolveTransferredBlockEntryPose
} from "./drop-start-position.js";

var sd = Object.defineProperty;
var id = (i, t, e) => t in i ? sd(i, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: e
}) : i[t] = e;
var E = (i, t, e) => id(i, typeof t != "symbol" ? t + "" : t, e);
(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);
    new MutationObserver(r => {
        for (const n of r)
            if (n.type === "childList")
                for (const o of n.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && s(o)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function e(r) {
        const n = {};
        return r.integrity && (n.integrity = r.integrity), r.referrerPolicy && (n.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? n.credentials = "include" : r.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n
    }

    function s(r) {
        if (r.ep) return;
        r.ep = !0;
        const n = e(r);
        fetch(r.href, n)
    }
})();
const rd = "modulepreload",
    nd = function(i, t) {
        return new URL(i, t).href
    },
    Co = {},
    us = function(t, e, s) {
        let r = Promise.resolve();
        if (e && e.length > 0) {
            const o = document.getElementsByTagName("link"),
                a = document.querySelector("meta[property=csp-nonce]"),
                h = (a == null ? void 0 : a.nonce) || (a == null ? void 0 : a.getAttribute("nonce"));
            r = Promise.allSettled(e.map(l => {
                if (l = nd(l, s), l in Co) return;
                Co[l] = !0;
                const c = l.endsWith(".css"),
                    u = c ? '[rel="stylesheet"]' : "";
                if (!!s)
                    for (let p = o.length - 1; p >= 0; p--) {
                        const m = o[p];
                        if (m.href === l && (!c || m.rel === "stylesheet")) return
                    } else if (document.querySelector(`link[href="${l}"]${u}`)) return;
                const f = document.createElement("link");
                if (f.rel = c ? "stylesheet" : rd, c || (f.as = "script"), f.crossOrigin = "", f.href = l, h && f.setAttribute("nonce", h), document.head.appendChild(f), c) return new Promise((p, m) => {
                    f.addEventListener("load", p), f.addEventListener("error", () => m(new Error(`Unable to preload CSS for ${l}`)))
                })
            }))
        }

        function n(o) {
            const a = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (a.payload = o, window.dispatchEvent(a), !a.defaultPrevented) throw o
        }
        return r.then(o => {
            for (const a of o || []) a.status === "rejected" && n(a.reason);
            return t().catch(n)
        })
    };
var w = (i => (i.Application = "application", i.WebGLPipes = "webgl-pipes", i.WebGLPipesAdaptor = "webgl-pipes-adaptor", i.WebGLSystem = "webgl-system", i.WebGPUPipes = "webgpu-pipes", i.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", i.WebGPUSystem = "webgpu-system", i.CanvasSystem = "canvas-system", i.CanvasPipesAdaptor = "canvas-pipes-adaptor", i.CanvasPipes = "canvas-pipes", i.Asset = "asset", i.LoadParser = "load-parser", i.ResolveParser = "resolve-parser", i.CacheParser = "cache-parser", i.DetectionParser = "detection-parser", i.MaskEffect = "mask-effect", i.BlendMode = "blend-mode", i.TextureSource = "texture-source", i.Environment = "environment", i.ShapeBuilder = "shape-builder", i.Batcher = "batcher", i))(w || {});
const Nr = i => {
        if (typeof i == "function" || typeof i == "object" && i.extension) {
            if (!i.extension) throw new Error("Extension class must have an extension object");
            i = {
                ...typeof i.extension != "object" ? {
                    type: i.extension
                } : i.extension,
                ref: i
            }
        }
        if (typeof i == "object") i = {
            ...i
        };
        else throw new Error("Invalid extension type");
        return typeof i.type == "string" && (i.type = [i.type]), i
    },
    li = (i, t) => Nr(i).priority ?? t,
    Y = {
        _addHandlers: {},
        _removeHandlers: {},
        _queue: {},
        remove(...i) {
            return i.map(Nr).forEach(t => {
                t.type.forEach(e => {
                    var s, r;
                    return (r = (s = this._removeHandlers)[e]) == null ? void 0 : r.call(s, t)
                })
            }), this
        },
        add(...i) {
            return i.map(Nr).forEach(t => {
                t.type.forEach(e => {
                    var n, o;
                    const s = this._addHandlers,
                        r = this._queue;
                    s[e] ? (o = s[e]) == null || o.call(s, t) : (r[e] = r[e] || [], (n = r[e]) == null || n.push(t))
                })
            }), this
        },
        handle(i, t, e) {
            var o;
            const s = this._addHandlers,
                r = this._removeHandlers;
            if (s[i] || r[i]) throw new Error(`Extension type ${i} already has a handler`);
            s[i] = t, r[i] = e;
            const n = this._queue;
            return n[i] && ((o = n[i]) == null || o.forEach(a => t(a)), delete n[i]), this
        },
        handleByMap(i, t) {
            return this.handle(i, e => {
                e.name && (t[e.name] = e.ref)
            }, e => {
                e.name && delete t[e.name]
            })
        },
        handleByNamedList(i, t, e = -1) {
            return this.handle(i, s => {
                t.findIndex(n => n.name === s.name) >= 0 || (t.push({
                    name: s.name,
                    value: s.ref
                }), t.sort((n, o) => li(o.value, e) - li(n.value, e)))
            }, s => {
                const r = t.findIndex(n => n.name === s.name);
                r !== -1 && t.splice(r, 1)
            })
        },
        handleByList(i, t, e = -1) {
            return this.handle(i, s => {
                t.includes(s.ref) || (t.push(s.ref), t.sort((r, n) => li(n, e) - li(r, e)))
            }, s => {
                const r = t.indexOf(s.ref);
                r !== -1 && t.splice(r, 1)
            })
        },
        mixin(i, ...t) {
            for (const e of t) Object.defineProperties(i.prototype, Object.getOwnPropertyDescriptors(e))
        }
    },
    od = {
        extension: {
            type: w.Environment,
            name: "browser",
            priority: -1
        },
        test: () => !0,
        load: async () => {
            await us(() => Promise.resolve().then(() => o0), void 0, import.meta.url)
        }
    },
    ad = {
        extension: {
            type: w.Environment,
            name: "webworker",
            priority: 0
        },
        test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
        load: async () => {
            await us(() => Promise.resolve().then(() => a0), void 0, import.meta.url)
        }
    };
class Bt {
    constructor(t, e, s) {
        this._x = e || 0, this._y = s || 0, this._observer = t
    }
    clone(t) {
        return new Bt(t ?? this._observer, this._x, this._y)
    }
    set(t = 0, e = t) {
        return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this
    }
    copyFrom(t) {
        return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this
    }
    copyTo(t) {
        return t.set(this._x, this._y), t
    }
    equals(t) {
        return t.x === this._x && t.y === this._y
    }
    toString() {
        return `[pixi.js/math:ObservablePoint x=${this._x} y=${this._y} scope=${this._observer}]`
    }
    get x() {
        return this._x
    }
    set x(t) {
        this._x !== t && (this._x = t, this._observer._onUpdate(this))
    }
    get y() {
        return this._y
    }
    set y(t) {
        this._y !== t && (this._y = t, this._observer._onUpdate(this))
    }
}

function Ph(i) {
    return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i
}
var Eh = {
    exports: {}
};
(function(i) {
    var t = Object.prototype.hasOwnProperty,
        e = "~";

    function s() {}
    Object.create && (s.prototype = Object.create(null), new s().__proto__ || (e = !1));

    function r(h, l, c) {
        this.fn = h, this.context = l, this.once = c || !1
    }

    function n(h, l, c, u, d) {
        if (typeof c != "function") throw new TypeError("The listener must be a function");
        var f = new r(c, u || h, d),
            p = e ? e + l : l;
        return h._events[p] ? h._events[p].fn ? h._events[p] = [h._events[p], f] : h._events[p].push(f) : (h._events[p] = f, h._eventsCount++), h
    }

    function o(h, l) {
        --h._eventsCount === 0 ? h._events = new s : delete h._events[l]
    }

    function a() {
        this._events = new s, this._eventsCount = 0
    }
    a.prototype.eventNames = function() {
        var l = [],
            c, u;
        if (this._eventsCount === 0) return l;
        for (u in c = this._events) t.call(c, u) && l.push(e ? u.slice(1) : u);
        return Object.getOwnPropertySymbols ? l.concat(Object.getOwnPropertySymbols(c)) : l
    }, a.prototype.listeners = function(l) {
        var c = e ? e + l : l,
            u = this._events[c];
        if (!u) return [];
        if (u.fn) return [u.fn];
        for (var d = 0, f = u.length, p = new Array(f); d < f; d++) p[d] = u[d].fn;
        return p
    }, a.prototype.listenerCount = function(l) {
        var c = e ? e + l : l,
            u = this._events[c];
        return u ? u.fn ? 1 : u.length : 0
    }, a.prototype.emit = function(l, c, u, d, f, p) {
        var m = e ? e + l : l;
        if (!this._events[m]) return !1;
        var g = this._events[m],
            _ = arguments.length,
            x, b;
        if (g.fn) {
            switch (g.once && this.removeListener(l, g.fn, void 0, !0), _) {
                case 1:
                    return g.fn.call(g.context), !0;
                case 2:
                    return g.fn.call(g.context, c), !0;
                case 3:
                    return g.fn.call(g.context, c, u), !0;
                case 4:
                    return g.fn.call(g.context, c, u, d), !0;
                case 5:
                    return g.fn.call(g.context, c, u, d, f), !0;
                case 6:
                    return g.fn.call(g.context, c, u, d, f, p), !0
            }
            for (b = 1, x = new Array(_ - 1); b < _; b++) x[b - 1] = arguments[b];
            g.fn.apply(g.context, x)
        } else {
            var y = g.length,
                S;
            for (b = 0; b < y; b++) switch (g[b].once && this.removeListener(l, g[b].fn, void 0, !0), _) {
                case 1:
                    g[b].fn.call(g[b].context);
                    break;
                case 2:
                    g[b].fn.call(g[b].context, c);
                    break;
                case 3:
                    g[b].fn.call(g[b].context, c, u);
                    break;
                case 4:
                    g[b].fn.call(g[b].context, c, u, d);
                    break;
                default:
                    if (!x)
                        for (S = 1, x = new Array(_ - 1); S < _; S++) x[S - 1] = arguments[S];
                    g[b].fn.apply(g[b].context, x)
            }
        }
        return !0
    }, a.prototype.on = function(l, c, u) {
        return n(this, l, c, u, !1)
    }, a.prototype.once = function(l, c, u) {
        return n(this, l, c, u, !0)
    }, a.prototype.removeListener = function(l, c, u, d) {
        var f = e ? e + l : l;
        if (!this._events[f]) return this;
        if (!c) return o(this, f), this;
        var p = this._events[f];
        if (p.fn) p.fn === c && (!d || p.once) && (!u || p.context === u) && o(this, f);
        else {
            for (var m = 0, g = [], _ = p.length; m < _; m++)(p[m].fn !== c || d && !p[m].once || u && p[m].context !== u) && g.push(p[m]);
            g.length ? this._events[f] = g.length === 1 ? g[0] : g : o(this, f)
        }
        return this
    }, a.prototype.removeAllListeners = function(l) {
        var c;
        return l ? (c = e ? e + l : l, this._events[c] && o(this, c)) : (this._events = new s, this._eventsCount = 0), this
    }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, i.exports = a
})(Eh);
var hd = Eh.exports;
const Xt = Ph(hd),
    ld = Math.PI * 2,
    cd = 180 / Math.PI,
    ud = Math.PI / 180;
class mt {
    constructor(t = 0, e = 0) {
        this.x = 0, this.y = 0, this.x = t, this.y = e
    }
    clone() {
        return new mt(this.x, this.y)
    }
    copyFrom(t) {
        return this.set(t.x, t.y), this
    }
    copyTo(t) {
        return t.set(this.x, this.y), t
    }
    equals(t) {
        return t.x === this.x && t.y === this.y
    }
    set(t = 0, e = t) {
        return this.x = t, this.y = e, this
    }
    toString() {
        return `[pixi.js/math:Point x=${this.x} y=${this.y}]`
    }
    static get shared() {
        return Ki.x = 0, Ki.y = 0, Ki
    }
}
const Ki = new mt;
class N {
    constructor(t = 1, e = 0, s = 0, r = 1, n = 0, o = 0) {
        this.array = null, this.a = t, this.b = e, this.c = s, this.d = r, this.tx = n, this.ty = o
    }
    fromArray(t) {
        this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5]
    }
    set(t, e, s, r, n, o) {
        return this.a = t, this.b = e, this.c = s, this.d = r, this.tx = n, this.ty = o, this
    }
    toArray(t, e) {
        this.array || (this.array = new Float32Array(9));
        const s = e || this.array;
        return t ? (s[0] = this.a, s[1] = this.b, s[2] = 0, s[3] = this.c, s[4] = this.d, s[5] = 0, s[6] = this.tx, s[7] = this.ty, s[8] = 1) : (s[0] = this.a, s[1] = this.c, s[2] = this.tx, s[3] = this.b, s[4] = this.d, s[5] = this.ty, s[6] = 0, s[7] = 0, s[8] = 1), s
    }
    apply(t, e) {
        e = e || new mt;
        const s = t.x,
            r = t.y;
        return e.x = this.a * s + this.c * r + this.tx, e.y = this.b * s + this.d * r + this.ty, e
    }
    applyInverse(t, e) {
        e = e || new mt;
        const s = this.a,
            r = this.b,
            n = this.c,
            o = this.d,
            a = this.tx,
            h = this.ty,
            l = 1 / (s * o + n * -r),
            c = t.x,
            u = t.y;
        return e.x = o * l * c + -n * l * u + (h * n - a * o) * l, e.y = s * l * u + -r * l * c + (-h * s + a * r) * l, e
    }
    translate(t, e) {
        return this.tx += t, this.ty += e, this
    }
    scale(t, e) {
        return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this
    }
    rotate(t) {
        const e = Math.cos(t),
            s = Math.sin(t),
            r = this.a,
            n = this.c,
            o = this.tx;
        return this.a = r * e - this.b * s, this.b = r * s + this.b * e, this.c = n * e - this.d * s, this.d = n * s + this.d * e, this.tx = o * e - this.ty * s, this.ty = o * s + this.ty * e, this
    }
    append(t) {
        const e = this.a,
            s = this.b,
            r = this.c,
            n = this.d;
        return this.a = t.a * e + t.b * r, this.b = t.a * s + t.b * n, this.c = t.c * e + t.d * r, this.d = t.c * s + t.d * n, this.tx = t.tx * e + t.ty * r + this.tx, this.ty = t.tx * s + t.ty * n + this.ty, this
    }
    appendFrom(t, e) {
        const s = t.a,
            r = t.b,
            n = t.c,
            o = t.d,
            a = t.tx,
            h = t.ty,
            l = e.a,
            c = e.b,
            u = e.c,
            d = e.d;
        return this.a = s * l + r * u, this.b = s * c + r * d, this.c = n * l + o * u, this.d = n * c + o * d, this.tx = a * l + h * u + e.tx, this.ty = a * c + h * d + e.ty, this
    }
    setTransform(t, e, s, r, n, o, a, h, l) {
        return this.a = Math.cos(a + l) * n, this.b = Math.sin(a + l) * n, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (s * this.a + r * this.c), this.ty = e - (s * this.b + r * this.d), this
    }
    prepend(t) {
        const e = this.tx;
        if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
            const s = this.a,
                r = this.c;
            this.a = s * t.a + this.b * t.c, this.b = s * t.b + this.b * t.d, this.c = r * t.a + this.d * t.c, this.d = r * t.b + this.d * t.d
        }
        return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this
    }
    decompose(t) {
        const e = this.a,
            s = this.b,
            r = this.c,
            n = this.d,
            o = t.pivot,
            a = -Math.atan2(-r, n),
            h = Math.atan2(s, e),
            l = Math.abs(a + h);
        return l < 1e-5 || Math.abs(ld - l) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + s * s), t.scale.y = Math.sqrt(r * r + n * n), t.position.x = this.tx + (o.x * e + o.y * r), t.position.y = this.ty + (o.x * s + o.y * n), t
    }
    invert() {
        const t = this.a,
            e = this.b,
            s = this.c,
            r = this.d,
            n = this.tx,
            o = t * r - e * s;
        return this.a = r / o, this.b = -e / o, this.c = -s / o, this.d = t / o, this.tx = (s * this.ty - r * n) / o, this.ty = -(t * this.ty - e * n) / o, this
    }
    isIdentity() {
        return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0
    }
    identity() {
        return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this
    }
    clone() {
        const t = new N;
        return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t
    }
    copyTo(t) {
        return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t
    }
    copyFrom(t) {
        return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this
    }
    equals(t) {
        return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty
    }
    toString() {
        return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`
    }
    static get IDENTITY() {
        return fd.identity()
    }
    static get shared() {
        return dd.identity()
    }
}
const dd = new N,
    fd = new N,
    Ie = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1],
    Ge = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1],
    Fe = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1],
    Oe = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1],
    Wr = [],
    Mh = [],
    ci = Math.sign;

function pd() {
    for (let i = 0; i < 16; i++) {
        const t = [];
        Wr.push(t);
        for (let e = 0; e < 16; e++) {
            const s = ci(Ie[i] * Ie[e] + Fe[i] * Ge[e]),
                r = ci(Ge[i] * Ie[e] + Oe[i] * Ge[e]),
                n = ci(Ie[i] * Fe[e] + Fe[i] * Oe[e]),
                o = ci(Ge[i] * Fe[e] + Oe[i] * Oe[e]);
            for (let a = 0; a < 16; a++)
                if (Ie[a] === s && Ge[a] === r && Fe[a] === n && Oe[a] === o) {
                    t.push(a);
                    break
                }
        }
    }
    for (let i = 0; i < 16; i++) {
        const t = new N;
        t.set(Ie[i], Ge[i], Fe[i], Oe[i], 0, 0), Mh.push(t)
    }
}
pd();
const tt = {
        E: 0,
        SE: 1,
        S: 2,
        SW: 3,
        W: 4,
        NW: 5,
        N: 6,
        NE: 7,
        MIRROR_VERTICAL: 8,
        MAIN_DIAGONAL: 10,
        MIRROR_HORIZONTAL: 12,
        REVERSE_DIAGONAL: 14,
        uX: i => Ie[i],
        uY: i => Ge[i],
        vX: i => Fe[i],
        vY: i => Oe[i],
        inv: i => i & 8 ? i & 15 : -i & 7,
        add: (i, t) => Wr[i][t],
        sub: (i, t) => Wr[i][tt.inv(t)],
        rotate180: i => i ^ 4,
        isVertical: i => (i & 3) === 2,
        byDirection: (i, t) => Math.abs(i) * 2 <= Math.abs(t) ? t >= 0 ? tt.S : tt.N : Math.abs(t) * 2 <= Math.abs(i) ? i > 0 ? tt.E : tt.W : t > 0 ? i > 0 ? tt.SE : tt.SW : i > 0 ? tt.NE : tt.NW,
        matrixAppendRotationInv: (i, t, e = 0, s = 0, r = 0, n = 0) => {
            const o = Mh[tt.inv(t)],
                a = o.a,
                h = o.b,
                l = o.c,
                c = o.d,
                u = e - Math.min(0, a * r, l * n, a * r + l * n),
                d = s - Math.min(0, h * r, c * n, h * r + c * n),
                f = i.a,
                p = i.b,
                m = i.c,
                g = i.d;
            i.a = a * f + h * m, i.b = a * p + h * g, i.c = l * f + c * m, i.d = l * p + c * g, i.tx = u * f + d * m + i.tx, i.ty = u * p + d * g + i.ty
        },
        transformRectCoords: (i, t, e, s) => {
            const {
                x: r,
                y: n,
                width: o,
                height: a
            } = i, {
                x: h,
                y: l,
                width: c,
                height: u
            } = t;
            return e === tt.E ? (s.set(r + h, n + l, o, a), s) : e === tt.S ? s.set(c - n - a + h, r + l, a, o) : e === tt.W ? s.set(c - r - o + h, u - n - a + l, o, a) : e === tt.N ? s.set(n + h, u - r - o + l, a, o) : s.set(r + h, n + l, o, a)
        }
    },
    ui = [new mt, new mt, new mt, new mt];
class nt {
    constructor(t = 0, e = 0, s = 0, r = 0) {
        this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(s), this.height = Number(r)
    }
    get left() {
        return this.x
    }
    get right() {
        return this.x + this.width
    }
    get top() {
        return this.y
    }
    get bottom() {
        return this.y + this.height
    }
    isEmpty() {
        return this.left === this.right || this.top === this.bottom
    }
    static get EMPTY() {
        return new nt(0, 0, 0, 0)
    }
    clone() {
        return new nt(this.x, this.y, this.width, this.height)
    }
    copyFromBounds(t) {
        return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this
    }
    copyFrom(t) {
        return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this
    }
    copyTo(t) {
        return t.copyFrom(this), t
    }
    contains(t, e) {
        return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height
    }
    strokeContains(t, e, s, r = .5) {
        const {
            width: n,
            height: o
        } = this;
        if (n <= 0 || o <= 0) return !1;
        const a = this.x,
            h = this.y,
            l = s * (1 - r),
            c = s - l,
            u = a - l,
            d = a + n + l,
            f = h - l,
            p = h + o + l,
            m = a + c,
            g = a + n - c,
            _ = h + c,
            x = h + o - c;
        return t >= u && t <= d && e >= f && e <= p && !(t > m && t < g && e > _ && e < x)
    }
    intersects(t, e) {
        if (!e) {
            const M = this.x < t.x ? t.x : this.x;
            if ((this.right > t.right ? t.right : this.right) <= M) return !1;
            const A = this.y < t.y ? t.y : this.y;
            return (this.bottom > t.bottom ? t.bottom : this.bottom) > A
        }
        const s = this.left,
            r = this.right,
            n = this.top,
            o = this.bottom;
        if (r <= s || o <= n) return !1;
        const a = ui[0].set(t.left, t.top),
            h = ui[1].set(t.left, t.bottom),
            l = ui[2].set(t.right, t.top),
            c = ui[3].set(t.right, t.bottom);
        if (l.x <= a.x || h.y <= a.y) return !1;
        const u = Math.sign(e.a * e.d - e.b * e.c);
        if (u === 0 || (e.apply(a, a), e.apply(h, h), e.apply(l, l), e.apply(c, c), Math.max(a.x, h.x, l.x, c.x) <= s || Math.min(a.x, h.x, l.x, c.x) >= r || Math.max(a.y, h.y, l.y, c.y) <= n || Math.min(a.y, h.y, l.y, c.y) >= o)) return !1;
        const d = u * (h.y - a.y),
            f = u * (a.x - h.x),
            p = d * s + f * n,
            m = d * r + f * n,
            g = d * s + f * o,
            _ = d * r + f * o;
        if (Math.max(p, m, g, _) <= d * a.x + f * a.y || Math.min(p, m, g, _) >= d * c.x + f * c.y) return !1;
        const x = u * (a.y - l.y),
            b = u * (l.x - a.x),
            y = x * s + b * n,
            S = x * r + b * n,
            v = x * s + b * o,
            T = x * r + b * o;
        return !(Math.max(y, S, v, T) <= x * a.x + b * a.y || Math.min(y, S, v, T) >= x * c.x + b * c.y)
    }
    pad(t = 0, e = t) {
        return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this
    }
    fit(t) {
        const e = Math.max(this.x, t.x),
            s = Math.min(this.x + this.width, t.x + t.width),
            r = Math.max(this.y, t.y),
            n = Math.min(this.y + this.height, t.y + t.height);
        return this.x = e, this.width = Math.max(s - e, 0), this.y = r, this.height = Math.max(n - r, 0), this
    }
    ceil(t = 1, e = .001) {
        const s = Math.ceil((this.x + this.width - e) * t) / t,
            r = Math.ceil((this.y + this.height - e) * t) / t;
        return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = s - this.x, this.height = r - this.y, this
    }
    scale(t, e = t) {
        return this.x *= t, this.y *= e, this.width *= t, this.height *= e, this
    }
    enlarge(t) {
        const e = Math.min(this.x, t.x),
            s = Math.max(this.x + this.width, t.x + t.width),
            r = Math.min(this.y, t.y),
            n = Math.max(this.y + this.height, t.y + t.height);
        return this.x = e, this.width = s - e, this.y = r, this.height = n - r, this
    }
    getBounds(t) {
        return t || (t = new nt), t.copyFrom(this), t
    }
    containsRect(t) {
        if (this.width <= 0 || this.height <= 0) return !1;
        const e = t.x,
            s = t.y,
            r = t.x + t.width,
            n = t.y + t.height;
        return e >= this.x && e < this.x + this.width && s >= this.y && s < this.y + this.height && r >= this.x && r < this.x + this.width && n >= this.y && n < this.y + this.height
    }
    set(t, e, s, r) {
        return this.x = t, this.y = e, this.width = s, this.height = r, this
    }
    toString() {
        return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`
    }
}
const Zi = {
    default: -1
};

function pt(i = "default") {
    return Zi[i] === void 0 && (Zi[i] = -1), ++Zi[i]
}
const Ao = new Set,
    at = "8.0.0",
    md = "8.3.4",
    hs = {
        quiet: !1,
        noColor: !1
    },
    U = (i, t, e = 3) => {
        if (hs.quiet || Ao.has(t)) return;
        let s = new Error().stack;
        const r = `${t}
Deprecated since v${i}`,
            n = typeof console.groupCollapsed == "function" && !hs.noColor;
        typeof s > "u" ? console.warn("PixiJS Deprecation Warning: ", r) : (s = s.split(`
`).splice(e).join(`
`), n ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", r), console.warn(s), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", r), console.warn(s))), Ao.add(t)
    };
Object.defineProperties(U, {
    quiet: {
        get: () => hs.quiet,
        set: i => {
            hs.quiet = i
        },
        enumerable: !0,
        configurable: !1
    },
    noColor: {
        get: () => hs.noColor,
        set: i => {
            hs.noColor = i
        },
        enumerable: !0,
        configurable: !1
    }
});
const kh = () => {};

function gs(i) {
    return i += i === 0 ? 1 : 0, --i, i |= i >>> 1, i |= i >>> 2, i |= i >>> 4, i |= i >>> 8, i |= i >>> 16, i + 1
}

function Po(i) {
    return !(i & i - 1) && !!i
}

function Rh(i) {
    const t = {};
    for (const e in i) i[e] !== void 0 && (t[e] = i[e]);
    return t
}
const Eo = Object.create(null);

function gd(i) {
    const t = Eo[i];
    return t === void 0 && (Eo[i] = pt("resource")), t
}
const Bh = class Ih extends Xt {
    constructor(t = {}) {
        super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = {
            ...Ih.defaultOptions,
            ...t
        }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1
    }
    set addressMode(t) {
        this.addressModeU = t, this.addressModeV = t, this.addressModeW = t
    }
    get addressMode() {
        return this.addressModeU
    }
    set wrapMode(t) {
        U(at, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t
    }
    get wrapMode() {
        return this.addressMode
    }
    set scaleMode(t) {
        this.magFilter = t, this.minFilter = t, this.mipmapFilter = t
    }
    get scaleMode() {
        return this.magFilter
    }
    set maxAnisotropy(t) {
        this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear")
    }
    get maxAnisotropy() {
        return this._maxAnisotropy
    }
    get _resourceId() {
        return this._sharedResourceId || this._generateResourceId()
    }
    update() {
        this._sharedResourceId = null, this.emit("change", this)
    }
    _generateResourceId() {
        const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
        return this._sharedResourceId = gd(t), this._resourceId
    }
    destroy() {
        this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners()
    }
};
Bh.defaultOptions = {
    addressMode: "clamp-to-edge",
    scaleMode: "linear"
};
let me = Bh;
const Gh = class Fh extends Xt {
    constructor(t = {}) {
        super(), this.options = t, this._gpuData = Object.create(null), this._gcLastUsed = -1, this.uid = pt("textureSource"), this._resourceType = "textureSource", this._resourceId = pt("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.viewDimension = "2d", this.arrayLayerCount = 1, this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = {
            ...Fh.defaultOptions,
            ...t
        }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.viewDimension = t.viewDimension ?? t.dimensions, this.arrayLayerCount = t.arrayLayerCount, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new me(Rh(t)), this.destroyed = !1, this._refreshPOT()
    }
    get source() {
        return this
    }
    get style() {
        return this._style
    }
    set style(t) {
        var e, s;
        this.style !== t && ((e = this._style) == null || e.off("change", this._onStyleChange, this), this._style = t, (s = this._style) == null || s.on("change", this._onStyleChange, this), this._onStyleChange())
    }
    set maxAnisotropy(t) {
        this._style.maxAnisotropy = t
    }
    get maxAnisotropy() {
        return this._style.maxAnisotropy
    }
    get addressMode() {
        return this._style.addressMode
    }
    set addressMode(t) {
        this._style.addressMode = t
    }
    get repeatMode() {
        return this._style.addressMode
    }
    set repeatMode(t) {
        this._style.addressMode = t
    }
    get magFilter() {
        return this._style.magFilter
    }
    set magFilter(t) {
        this._style.magFilter = t
    }
    get minFilter() {
        return this._style.minFilter
    }
    set minFilter(t) {
        this._style.minFilter = t
    }
    get mipmapFilter() {
        return this._style.mipmapFilter
    }
    set mipmapFilter(t) {
        this._style.mipmapFilter = t
    }
    get lodMinClamp() {
        return this._style.lodMinClamp
    }
    set lodMinClamp(t) {
        this._style.lodMinClamp = t
    }
    get lodMaxClamp() {
        return this._style.lodMaxClamp
    }
    set lodMaxClamp(t) {
        this._style.lodMaxClamp = t
    }
    _onStyleChange() {
        this.emit("styleChange", this)
    }
    update() {
        if (this.resource) {
            const t = this._resolution;
            if (this.resize(this.resourceWidth / t, this.resourceHeight / t)) return
        }
        this.emit("update", this)
    }
    destroy() {
        this.destroyed = !0, this.unload(), this.emit("destroy", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners()
    }
    unload() {
        var t, e;
        this._resourceId = pt("resource"), this.emit("change", this), this.emit("unload", this);
        for (const s in this._gpuData)(e = (t = this._gpuData[s]) == null ? void 0 : t.destroy) == null || e.call(t);
        this._gpuData = Object.create(null)
    }
    get resourceWidth() {
        const {
            resource: t
        } = this;
        return t.naturalWidth || t.videoWidth || t.displayWidth || t.width
    }
    get resourceHeight() {
        const {
            resource: t
        } = this;
        return t.naturalHeight || t.videoHeight || t.displayHeight || t.height
    }
    get resolution() {
        return this._resolution
    }
    set resolution(t) {
        this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t)
    }
    resize(t, e, s) {
        s || (s = this._resolution), t || (t = this.width), e || (e = this.height);
        const r = Math.round(t * s),
            n = Math.round(e * s);
        return this.width = r / s, this.height = n / s, this._resolution = s, this.pixelWidth === r && this.pixelHeight === n ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = n, this.emit("resize", this), this._resourceId = pt("resource"), this.emit("change", this), !0)
    }
    updateMipmaps() {
        this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this)
    }
    set wrapMode(t) {
        this._style.wrapMode = t
    }
    get wrapMode() {
        return this._style.wrapMode
    }
    set scaleMode(t) {
        this._style.scaleMode = t
    }
    get scaleMode() {
        return this._style.scaleMode
    }
    _refreshPOT() {
        this.isPowerOfTwo = Po(this.pixelWidth) && Po(this.pixelHeight)
    }
    static test(t) {
        throw new Error("Unimplemented")
    }
};
Gh.defaultOptions = {
    resolution: 1,
    format: "bgra8unorm",
    alphaMode: "premultiply-alpha-on-upload",
    dimensions: "2d",
    viewDimension: "2d",
    arrayLayerCount: 1,
    mipLevelCount: 1,
    autoGenerateMipmaps: !1,
    sampleCount: 1,
    antialias: !1,
    autoGarbageCollect: !1
};
let At = Gh;
class mn extends At {
    constructor(t) {
        const e = t.resource || new Float32Array(t.width * t.height * 4);
        let s = t.format;
        s || (e instanceof Float32Array ? s = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? s = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? s = "rgba16uint" : (e instanceof Int8Array, s = "bgra8unorm")), super({
            ...t,
            resource: e,
            format: s
        }), this.uploadMethodId = "buffer"
    }
    static test(t) {
        return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array
    }
}
mn.extension = w.TextureSource;
const Mo = new N;
class Oh {
    constructor(t, e) {
        this.mapCoord = new N, this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : .5 : this.clampMargin = e, this.isSimple = !1, this.texture = t
    }
    get texture() {
        return this._texture
    }
    set texture(t) {
        var e;
        this.texture !== t && ((e = this._texture) == null || e.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update())
    }
    multiplyUvs(t, e) {
        e === void 0 && (e = t);
        const s = this.mapCoord;
        for (let r = 0; r < t.length; r += 2) {
            const n = t[r],
                o = t[r + 1];
            e[r] = n * s.a + o * s.c + s.tx, e[r + 1] = n * s.b + o * s.d + s.ty
        }
        return e
    }
    update() {
        const t = this._texture;
        this._updateID++;
        const e = t.uvs;
        this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
        const s = t.orig,
            r = t.trim;
        r && (Mo.set(s.width / r.width, 0, 0, s.height / r.height, -r.x / r.width, -r.y / r.height), this.mapCoord.append(Mo));
        const n = t.source,
            o = this.uClampFrame,
            a = this.clampMargin / n._resolution,
            h = this.clampOffset / n._resolution;
        return o[0] = (t.frame.x + a + h) / n.width, o[1] = (t.frame.y + a + h) / n.height, o[2] = (t.frame.x + t.frame.width - a + h) / n.width, o[3] = (t.frame.y + t.frame.height - a + h) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, !0
    }
}
class O extends Xt {
    constructor({
        source: t,
        label: e,
        frame: s,
        orig: r,
        trim: n,
        defaultAnchor: o,
        defaultBorders: a,
        rotate: h,
        dynamic: l
    } = {}) {
        if (super(), this.uid = pt("texture"), this.uvs = {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                x3: 0,
                y3: 0
            }, this.frame = new nt, this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = (t == null ? void 0 : t.source) ?? new At, this.noFrame = !s, s) this.frame.copyFrom(s);
        else {
            const {
                width: c,
                height: u
            } = this._source;
            this.frame.width = c, this.frame.height = u
        }
        this.orig = r || this.frame, this.trim = n, this.rotate = h ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = l || !1, this.updateUvs()
    }
    set source(t) {
        this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this)
    }
    get source() {
        return this._source
    }
    get textureMatrix() {
        return this._textureMatrix || (this._textureMatrix = new Oh(this)), this._textureMatrix
    }
    get width() {
        return this.orig.width
    }
    get height() {
        return this.orig.height
    }
    updateUvs() {
        const {
            uvs: t,
            frame: e
        } = this, {
            width: s,
            height: r
        } = this._source, n = e.x / s, o = e.y / r, a = e.width / s, h = e.height / r;
        let l = this.rotate;
        if (l) {
            const c = a / 2,
                u = h / 2,
                d = n + c,
                f = o + u;
            l = tt.add(l, tt.NW), t.x0 = d + c * tt.uX(l), t.y0 = f + u * tt.uY(l), l = tt.add(l, 2), t.x1 = d + c * tt.uX(l), t.y1 = f + u * tt.uY(l), l = tt.add(l, 2), t.x2 = d + c * tt.uX(l), t.y2 = f + u * tt.uY(l), l = tt.add(l, 2), t.x3 = d + c * tt.uX(l), t.y3 = f + u * tt.uY(l)
        } else t.x0 = n, t.y0 = o, t.x1 = n + a, t.y1 = o, t.x2 = n + a, t.y2 = o + h, t.x3 = n, t.y3 = o + h
    }
    destroy(t = !1) {
        this._source && (this._source.off("resize", this.update, this), t && (this._source.destroy(), this._source = null)), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners()
    }
    update() {
        this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this)
    }
    get baseTexture() {
        return U(at, "Texture.baseTexture is now Texture.source"), this._source
    }
}
O.EMPTY = new O({
    label: "EMPTY",
    source: new At({
        label: "EMPTY"
    })
});
O.EMPTY.destroy = kh;
O.WHITE = new O({
    source: new mn({
        resource: new Uint8Array([255, 255, 255, 255]),
        width: 1,
        height: 1,
        alphaMode: "premultiply-alpha-on-upload",
        label: "WHITE"
    }),
    label: "WHITE"
});
O.WHITE.destroy = kh;

function Lh(i, t, e) {
    const {
        width: s,
        height: r
    } = e.orig, n = e.trim;
    if (n) {
        const o = n.width,
            a = n.height;
        i.minX = n.x - t._x * s, i.maxX = i.minX + o, i.minY = n.y - t._y * r, i.maxY = i.minY + a
    } else i.minX = -t._x * s, i.maxX = i.minX + s, i.minY = -t._y * r, i.maxY = i.minY + r
}
const ko = new N;
class Ft {
    constructor(t = 1 / 0, e = 1 / 0, s = -1 / 0, r = -1 / 0) {
        this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = ko, this.minX = t, this.minY = e, this.maxX = s, this.maxY = r
    }
    isEmpty() {
        return this.minX > this.maxX || this.minY > this.maxY
    }
    get rectangle() {
        this._rectangle || (this._rectangle = new nt);
        const t = this._rectangle;
        return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t
    }
    clear() {
        return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = ko, this
    }
    set(t, e, s, r) {
        this.minX = t, this.minY = e, this.maxX = s, this.maxY = r
    }
    addFrame(t, e, s, r, n) {
        n || (n = this.matrix);
        const o = n.a,
            a = n.b,
            h = n.c,
            l = n.d,
            c = n.tx,
            u = n.ty;
        let d = this.minX,
            f = this.minY,
            p = this.maxX,
            m = this.maxY,
            g = o * t + h * e + c,
            _ = a * t + l * e + u;
        g < d && (d = g), _ < f && (f = _), g > p && (p = g), _ > m && (m = _), g = o * s + h * e + c, _ = a * s + l * e + u, g < d && (d = g), _ < f && (f = _), g > p && (p = g), _ > m && (m = _), g = o * t + h * r + c, _ = a * t + l * r + u, g < d && (d = g), _ < f && (f = _), g > p && (p = g), _ > m && (m = _), g = o * s + h * r + c, _ = a * s + l * r + u, g < d && (d = g), _ < f && (f = _), g > p && (p = g), _ > m && (m = _), this.minX = d, this.minY = f, this.maxX = p, this.maxY = m
    }
    addRect(t, e) {
        this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e)
    }
    addBounds(t, e) {
        this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e)
    }
    addBoundsMask(t) {
        this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY
    }
    applyMatrix(t) {
        const e = this.minX,
            s = this.minY,
            r = this.maxX,
            n = this.maxY,
            {
                a: o,
                b: a,
                c: h,
                d: l,
                tx: c,
                ty: u
            } = t;
        let d = o * e + h * s + c,
            f = a * e + l * s + u;
        this.minX = d, this.minY = f, this.maxX = d, this.maxY = f, d = o * r + h * s + c, f = a * r + l * s + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY, d = o * e + h * n + c, f = a * e + l * n + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY, d = o * r + h * n + c, f = a * r + l * n + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY
    }
    fit(t) {
        return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this
    }
    fitBounds(t, e, s, r) {
        return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < s && (this.minY = s), this.maxY > r && (this.maxY = r), this
    }
    pad(t, e = t) {
        return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this
    }
    ceil() {
        return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this
    }
    clone() {
        return new Ft(this.minX, this.minY, this.maxX, this.maxY)
    }
    scale(t, e = t) {
        return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this
    }
    get x() {
        return this.minX
    }
    set x(t) {
        const e = this.maxX - this.minX;
        this.minX = t, this.maxX = t + e
    }
    get y() {
        return this.minY
    }
    set y(t) {
        const e = this.maxY - this.minY;
        this.minY = t, this.maxY = t + e
    }
    get width() {
        return this.maxX - this.minX
    }
    set width(t) {
        this.maxX = this.minX + t
    }
    get height() {
        return this.maxY - this.minY
    }
    set height(t) {
        this.maxY = this.minY + t
    }
    get left() {
        return this.minX
    }
    get right() {
        return this.maxX
    }
    get top() {
        return this.minY
    }
    get bottom() {
        return this.maxY
    }
    get isPositive() {
        return this.maxX - this.minX > 0 && this.maxY - this.minY > 0
    }
    get isValid() {
        return this.minX + this.minY !== 1 / 0
    }
    addVertexData(t, e, s, r) {
        let n = this.minX,
            o = this.minY,
            a = this.maxX,
            h = this.maxY;
        r || (r = this.matrix);
        const l = r.a,
            c = r.b,
            u = r.c,
            d = r.d,
            f = r.tx,
            p = r.ty;
        for (let m = e; m < s; m += 2) {
            const g = t[m],
                _ = t[m + 1],
                x = l * g + u * _ + f,
                b = c * g + d * _ + p;
            n = x < n ? x : n, o = b < o ? b : o, a = x > a ? x : a, h = b > h ? b : h
        }
        this.minX = n, this.minY = o, this.maxX = a, this.maxY = h
    }
    containsPoint(t, e) {
        return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e
    }
    toString() {
        return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`
    }
    copyFrom(t) {
        return this.minX = t.minX, this.minY = t.minY, this.maxX = t.maxX, this.maxY = t.maxY, this
    }
}
var _d = {
        grad: .9,
        turn: 360,
        rad: 360 / (2 * Math.PI)
    },
    ae = function(i) {
        return typeof i == "string" ? i.length > 0 : typeof i == "number"
    },
    Pt = function(i, t, e) {
        return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * i) / e + 0
    },
    qt = function(i, t, e) {
        return t === void 0 && (t = 0), e === void 0 && (e = 1), i > e ? e : i > t ? i : t
    },
    Dh = function(i) {
        return (i = isFinite(i) ? i % 360 : 0) > 0 ? i : i + 360
    },
    Ro = function(i) {
        return {
            r: qt(i.r, 0, 255),
            g: qt(i.g, 0, 255),
            b: qt(i.b, 0, 255),
            a: qt(i.a)
        }
    },
    Qi = function(i) {
        return {
            r: Pt(i.r),
            g: Pt(i.g),
            b: Pt(i.b),
            a: Pt(i.a, 3)
        }
    },
    xd = /^#([0-9a-f]{3,8})$/i,
    di = function(i) {
        var t = i.toString(16);
        return t.length < 2 ? "0" + t : t
    },
    Uh = function(i) {
        var t = i.r,
            e = i.g,
            s = i.b,
            r = i.a,
            n = Math.max(t, e, s),
            o = n - Math.min(t, e, s),
            a = o ? n === t ? (e - s) / o : n === e ? 2 + (s - t) / o : 4 + (t - e) / o : 0;
        return {
            h: 60 * (a < 0 ? a + 6 : a),
            s: n ? o / n * 100 : 0,
            v: n / 255 * 100,
            a: r
        }
    },
    Nh = function(i) {
        var t = i.h,
            e = i.s,
            s = i.v,
            r = i.a;
        t = t / 360 * 6, e /= 100, s /= 100;
        var n = Math.floor(t),
            o = s * (1 - e),
            a = s * (1 - (t - n) * e),
            h = s * (1 - (1 - t + n) * e),
            l = n % 6;
        return {
            r: 255 * [s, a, o, o, h, s][l],
            g: 255 * [h, s, s, a, o, o][l],
            b: 255 * [o, o, h, s, s, a][l],
            a: r
        }
    },
    Bo = function(i) {
        return {
            h: Dh(i.h),
            s: qt(i.s, 0, 100),
            l: qt(i.l, 0, 100),
            a: qt(i.a)
        }
    },
    Io = function(i) {
        return {
            h: Pt(i.h),
            s: Pt(i.s),
            l: Pt(i.l),
            a: Pt(i.a, 3)
        }
    },
    Go = function(i) {
        return Nh((e = (t = i).s, {
            h: t.h,
            s: (e *= ((s = t.l) < 50 ? s : 100 - s) / 100) > 0 ? 2 * e / (s + e) * 100 : 0,
            v: s + e,
            a: t.a
        }));
        var t, e, s
    },
    Ns = function(i) {
        return {
            h: (t = Uh(i)).h,
            s: (r = (200 - (e = t.s)) * (s = t.v) / 100) > 0 && r < 200 ? e * s / 100 / (r <= 100 ? r : 200 - r) * 100 : 0,
            l: r / 2,
            a: t.a
        };
        var t, e, s, r
    },
    yd = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,
    bd = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,
    vd = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,
    wd = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,
    Hr = {
        string: [
            [function(i) {
                var t = xd.exec(i);
                return t ? (i = t[1]).length <= 4 ? {
                    r: parseInt(i[0] + i[0], 16),
                    g: parseInt(i[1] + i[1], 16),
                    b: parseInt(i[2] + i[2], 16),
                    a: i.length === 4 ? Pt(parseInt(i[3] + i[3], 16) / 255, 2) : 1
                } : i.length === 6 || i.length === 8 ? {
                    r: parseInt(i.substr(0, 2), 16),
                    g: parseInt(i.substr(2, 2), 16),
                    b: parseInt(i.substr(4, 2), 16),
                    a: i.length === 8 ? Pt(parseInt(i.substr(6, 2), 16) / 255, 2) : 1
                } : null : null
            }, "hex"],
            [function(i) {
                var t = vd.exec(i) || wd.exec(i);
                return t ? t[2] !== t[4] || t[4] !== t[6] ? null : Ro({
                    r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
                    g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
                    b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
                    a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
                }) : null
            }, "rgb"],
            [function(i) {
                var t = yd.exec(i) || bd.exec(i);
                if (!t) return null;
                var e, s, r = Bo({
                    h: (e = t[1], s = t[2], s === void 0 && (s = "deg"), Number(e) * (_d[s] || 1)),
                    s: Number(t[3]),
                    l: Number(t[4]),
                    a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
                });
                return Go(r)
            }, "hsl"]
        ],
        object: [
            [function(i) {
                var t = i.r,
                    e = i.g,
                    s = i.b,
                    r = i.a,
                    n = r === void 0 ? 1 : r;
                return ae(t) && ae(e) && ae(s) ? Ro({
                    r: Number(t),
                    g: Number(e),
                    b: Number(s),
                    a: Number(n)
                }) : null
            }, "rgb"],
            [function(i) {
                var t = i.h,
                    e = i.s,
                    s = i.l,
                    r = i.a,
                    n = r === void 0 ? 1 : r;
                if (!ae(t) || !ae(e) || !ae(s)) return null;
                var o = Bo({
                    h: Number(t),
                    s: Number(e),
                    l: Number(s),
                    a: Number(n)
                });
                return Go(o)
            }, "hsl"],
            [function(i) {
                var t = i.h,
                    e = i.s,
                    s = i.v,
                    r = i.a,
                    n = r === void 0 ? 1 : r;
                if (!ae(t) || !ae(e) || !ae(s)) return null;
                var o = function(a) {
                    return {
                        h: Dh(a.h),
                        s: qt(a.s, 0, 100),
                        v: qt(a.v, 0, 100),
                        a: qt(a.a)
                    }
                }({
                    h: Number(t),
                    s: Number(e),
                    v: Number(s),
                    a: Number(n)
                });
                return Nh(o)
            }, "hsv"]
        ]
    },
    Fo = function(i, t) {
        for (var e = 0; e < t.length; e++) {
            var s = t[e][0](i);
            if (s) return [s, t[e][1]]
        }
        return [null, void 0]
    },
    Td = function(i) {
        return typeof i == "string" ? Fo(i.trim(), Hr.string) : typeof i == "object" && i !== null ? Fo(i, Hr.object) : [null, void 0]
    },
    Ji = function(i, t) {
        var e = Ns(i);
        return {
            h: e.h,
            s: qt(e.s + 100 * t, 0, 100),
            l: e.l,
            a: e.a
        }
    },
    tr = function(i) {
        return (299 * i.r + 587 * i.g + 114 * i.b) / 1e3 / 255
    },
    Oo = function(i, t) {
        var e = Ns(i);
        return {
            h: e.h,
            s: e.s,
            l: qt(e.l + 100 * t, 0, 100),
            a: e.a
        }
    },
    zr = function() {
        function i(t) {
            this.parsed = Td(t)[0], this.rgba = this.parsed || {
                r: 0,
                g: 0,
                b: 0,
                a: 1
            }
        }
        return i.prototype.isValid = function() {
            return this.parsed !== null
        }, i.prototype.brightness = function() {
            return Pt(tr(this.rgba), 2)
        }, i.prototype.isDark = function() {
            return tr(this.rgba) < .5
        }, i.prototype.isLight = function() {
            return tr(this.rgba) >= .5
        }, i.prototype.toHex = function() {
            return t = Qi(this.rgba), e = t.r, s = t.g, r = t.b, o = (n = t.a) < 1 ? di(Pt(255 * n)) : "", "#" + di(e) + di(s) + di(r) + o;
            var t, e, s, r, n, o
        }, i.prototype.toRgb = function() {
            return Qi(this.rgba)
        }, i.prototype.toRgbString = function() {
            return t = Qi(this.rgba), e = t.r, s = t.g, r = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + s + ", " + r + ", " + n + ")" : "rgb(" + e + ", " + s + ", " + r + ")";
            var t, e, s, r, n
        }, i.prototype.toHsl = function() {
            return Io(Ns(this.rgba))
        }, i.prototype.toHslString = function() {
            return t = Io(Ns(this.rgba)), e = t.h, s = t.s, r = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + s + "%, " + r + "%, " + n + ")" : "hsl(" + e + ", " + s + "%, " + r + "%)";
            var t, e, s, r, n
        }, i.prototype.toHsv = function() {
            return t = Uh(this.rgba), {
                h: Pt(t.h),
                s: Pt(t.s),
                v: Pt(t.v),
                a: Pt(t.a, 3)
            };
            var t
        }, i.prototype.invert = function() {
            return se({
                r: 255 - (t = this.rgba).r,
                g: 255 - t.g,
                b: 255 - t.b,
                a: t.a
            });
            var t
        }, i.prototype.saturate = function(t) {
            return t === void 0 && (t = .1), se(Ji(this.rgba, t))
        }, i.prototype.desaturate = function(t) {
            return t === void 0 && (t = .1), se(Ji(this.rgba, -t))
        }, i.prototype.grayscale = function() {
            return se(Ji(this.rgba, -1))
        }, i.prototype.lighten = function(t) {
            return t === void 0 && (t = .1), se(Oo(this.rgba, t))
        }, i.prototype.darken = function(t) {
            return t === void 0 && (t = .1), se(Oo(this.rgba, -t))
        }, i.prototype.rotate = function(t) {
            return t === void 0 && (t = 15), this.hue(this.hue() + t)
        }, i.prototype.alpha = function(t) {
            return typeof t == "number" ? se({
                r: (e = this.rgba).r,
                g: e.g,
                b: e.b,
                a: t
            }) : Pt(this.rgba.a, 3);
            var e
        }, i.prototype.hue = function(t) {
            var e = Ns(this.rgba);
            return typeof t == "number" ? se({
                h: t,
                s: e.s,
                l: e.l,
                a: e.a
            }) : Pt(e.h)
        }, i.prototype.isEqual = function(t) {
            return this.toHex() === se(t).toHex()
        }, i
    }(),
    se = function(i) {
        return i instanceof zr ? i : new zr(i)
    },
    Lo = [],
    Sd = function(i) {
        i.forEach(function(t) {
            Lo.indexOf(t) < 0 && (t(zr, Hr), Lo.push(t))
        })
    };

function Cd(i, t) {
    var e = {
            white: "#ffffff",
            bisque: "#ffe4c4",
            blue: "#0000ff",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            azure: "#f0ffff",
            whitesmoke: "#f5f5f5",
            papayawhip: "#ffefd5",
            plum: "#dda0dd",
            blanchedalmond: "#ffebcd",
            black: "#000000",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gainsboro: "#dcdcdc",
            cornsilk: "#fff8dc",
            cornflowerblue: "#6495ed",
            burlywood: "#deb887",
            aquamarine: "#7fffd4",
            beige: "#f5f5dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkkhaki: "#bdb76b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkgrey: "#a9a9a9",
            peachpuff: "#ffdab9",
            darkmagenta: "#8b008b",
            darkred: "#8b0000",
            darkorchid: "#9932cc",
            darkorange: "#ff8c00",
            darkslateblue: "#483d8b",
            gray: "#808080",
            darkslategray: "#2f4f4f",
            darkslategrey: "#2f4f4f",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            wheat: "#f5deb3",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            ghostwhite: "#f8f8ff",
            darkviolet: "#9400d3",
            magenta: "#ff00ff",
            green: "#008000",
            dodgerblue: "#1e90ff",
            grey: "#808080",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            blueviolet: "#8a2be2",
            forestgreen: "#228b22",
            lawngreen: "#7cfc00",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            fuchsia: "#ff00ff",
            brown: "#a52a2a",
            maroon: "#800000",
            mediumblue: "#0000cd",
            lightcoral: "#f08080",
            darkturquoise: "#00ced1",
            lightcyan: "#e0ffff",
            ivory: "#fffff0",
            lightyellow: "#ffffe0",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            linen: "#faf0e6",
            mediumaquamarine: "#66cdaa",
            lemonchiffon: "#fffacd",
            lime: "#00ff00",
            khaki: "#f0e68c",
            mediumseagreen: "#3cb371",
            limegreen: "#32cd32",
            mediumspringgreen: "#00fa9a",
            lightskyblue: "#87cefa",
            lightblue: "#add8e6",
            midnightblue: "#191970",
            lightpink: "#ffb6c1",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            mintcream: "#f5fffa",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            navajowhite: "#ffdead",
            navy: "#000080",
            mediumvioletred: "#c71585",
            powderblue: "#b0e0e6",
            palegoldenrod: "#eee8aa",
            oldlace: "#fdf5e6",
            paleturquoise: "#afeeee",
            mediumturquoise: "#48d1cc",
            mediumorchid: "#ba55d3",
            rebeccapurple: "#663399",
            lightsteelblue: "#b0c4de",
            mediumslateblue: "#7b68ee",
            thistle: "#d8bfd8",
            tan: "#d2b48c",
            orchid: "#da70d6",
            mediumpurple: "#9370db",
            purple: "#800080",
            pink: "#ffc0cb",
            skyblue: "#87ceeb",
            springgreen: "#00ff7f",
            palegreen: "#98fb98",
            red: "#ff0000",
            yellow: "#ffff00",
            slateblue: "#6a5acd",
            lavenderblush: "#fff0f5",
            peru: "#cd853f",
            palevioletred: "#db7093",
            violet: "#ee82ee",
            teal: "#008080",
            slategray: "#708090",
            slategrey: "#708090",
            aliceblue: "#f0f8ff",
            darkseagreen: "#8fbc8f",
            darkolivegreen: "#556b2f",
            greenyellow: "#adff2f",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            tomato: "#ff6347",
            silver: "#c0c0c0",
            sienna: "#a0522d",
            lavender: "#e6e6fa",
            lightgreen: "#90ee90",
            orange: "#ffa500",
            orangered: "#ff4500",
            steelblue: "#4682b4",
            royalblue: "#4169e1",
            turquoise: "#40e0d0",
            yellowgreen: "#9acd32",
            salmon: "#fa8072",
            saddlebrown: "#8b4513",
            sandybrown: "#f4a460",
            rosybrown: "#bc8f8f",
            darksalmon: "#e9967a",
            lightgoldenrodyellow: "#fafad2",
            snow: "#fffafa",
            lightgrey: "#d3d3d3",
            lightgray: "#d3d3d3",
            dimgray: "#696969",
            dimgrey: "#696969",
            olivedrab: "#6b8e23",
            olive: "#808000"
        },
        s = {};
    for (var r in e) s[e[r]] = r;
    var n = {};
    i.prototype.toName = function(o) {
        if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
        var a, h, l = s[this.toHex()];
        if (l) return l;
        if (o != null && o.closest) {
            var c = this.toRgb(),
                u = 1 / 0,
                d = "black";
            if (!n.length)
                for (var f in e) n[f] = new i(e[f]).toRgb();
            for (var p in e) {
                var m = (a = c, h = n[p], Math.pow(a.r - h.r, 2) + Math.pow(a.g - h.g, 2) + Math.pow(a.b - h.b, 2));
                m < u && (u = m, d = p)
            }
            return d
        }
    }, t.string.push([function(o) {
        var a = o.toLowerCase(),
            h = a === "transparent" ? "#0000" : e[a];
        return h ? new i(h).toRgb() : null
    }, "name"])
}
Sd([Cd]);
const _s = class Os {
    constructor(t = 16777215) {
        this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t
    }
    get red() {
        return this._components[0]
    }
    get green() {
        return this._components[1]
    }
    get blue() {
        return this._components[2]
    }
    get alpha() {
        return this._components[3]
    }
    setValue(t) {
        return this.value = t, this
    }
    set value(t) {
        if (t instanceof Os) this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
        else {
            if (t === null) throw new Error("Cannot set Color#value to null");
            (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value))
        }
    }
    get value() {
        return this._value
    }
    _cloneSource(t) {
        return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? {
            ...t
        } : t
    }
    _isSourceEqual(t, e) {
        const s = typeof t;
        if (s !== typeof e) return !1;
        if (s === "number" || s === "string" || t instanceof Number) return t === e;
        if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e)) return t.length !== e.length ? !1 : t.every((n, o) => n === e[o]);
        if (t !== null && e !== null) {
            const n = Object.keys(t),
                o = Object.keys(e);
            return n.length !== o.length ? !1 : n.every(a => t[a] === e[a])
        }
        return t === e
    }
    toRgba() {
        const [t, e, s, r] = this._components;
        return {
            r: t,
            g: e,
            b: s,
            a: r
        }
    }
    toRgb() {
        const [t, e, s] = this._components;
        return {
            r: t,
            g: e,
            b: s
        }
    }
    toRgbaString() {
        const [t, e, s] = this.toUint8RgbArray();
        return `rgba(${t},${e},${s},${this.alpha})`
    }
    toUint8RgbArray(t) {
        const [e, s, r] = this._components;
        return this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb), t[0] = Math.round(e * 255), t[1] = Math.round(s * 255), t[2] = Math.round(r * 255), t
    }
    toArray(t) {
        this._arrayRgba || (this._arrayRgba = []), t || (t = this._arrayRgba);
        const [e, s, r, n] = this._components;
        return t[0] = e, t[1] = s, t[2] = r, t[3] = n, t
    }
    toRgbArray(t) {
        this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb);
        const [e, s, r] = this._components;
        return t[0] = e, t[1] = s, t[2] = r, t
    }
    toNumber() {
        return this._int
    }
    toBgrNumber() {
        const [t, e, s] = this.toUint8RgbArray();
        return (s << 16) + (e << 8) + t
    }
    toLittleEndianNumber() {
        const t = this._int;
        return (t >> 16) + (t & 65280) + ((t & 255) << 16)
    }
    multiply(t) {
        const [e, s, r, n] = Os._temp.setValue(t)._components;
        return this._components[0] *= e, this._components[1] *= s, this._components[2] *= r, this._components[3] *= n, this._refreshInt(), this._value = null, this
    }
    premultiply(t, e = !0) {
        return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this
    }
    toPremultiplied(t, e = !0) {
        if (t === 1) return (255 << 24) + this._int;
        if (t === 0) return e ? 0 : this._int;
        let s = this._int >> 16 & 255,
            r = this._int >> 8 & 255,
            n = this._int & 255;
        return e && (s = s * t + .5 | 0, r = r * t + .5 | 0, n = n * t + .5 | 0), (t * 255 << 24) + (s << 16) + (r << 8) + n
    }
    toHex() {
        const t = this._int.toString(16);
        return `#${"000000".substring(0,6-t.length)+t}`
    }
    toHexa() {
        const e = Math.round(this._components[3] * 255).toString(16);
        return this.toHex() + "00".substring(0, 2 - e.length) + e
    }
    setAlpha(t) {
        return this._components[3] = this._clamp(t), this._value = null, this
    }
    _normalize(t) {
        let e, s, r, n;
        if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
            const o = t;
            e = (o >> 16 & 255) / 255, s = (o >> 8 & 255) / 255, r = (o & 255) / 255, n = 1
        } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4) t = this._clamp(t), [e, s, r, n = 1] = t;
        else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4) t = this._clamp(t, 0, 255), [e, s, r, n = 255] = t, e /= 255, s /= 255, r /= 255, n /= 255;
        else if (typeof t == "string" || typeof t == "object") {
            if (typeof t == "string") {
                const a = Os.HEX_PATTERN.exec(t);
                a && (t = `#${a[2]}`)
            }
            const o = se(t);
            o.isValid() && ({
                r: e,
                g: s,
                b: r,
                a: n
            } = o.rgba, e /= 255, s /= 255, r /= 255)
        }
        if (e !== void 0) this._components[0] = e, this._components[1] = s, this._components[2] = r, this._components[3] = n, this._refreshInt();
        else throw new Error(`Unable to convert color ${t}`)
    }
    _refreshInt() {
        this._clamp(this._components);
        const [t, e, s] = this._components;
        this._int = (t * 255 << 16) + (e * 255 << 8) + (s * 255 | 0)
    }
    _clamp(t, e = 0, s = 1) {
        return typeof t == "number" ? Math.min(Math.max(t, e), s) : (t.forEach((r, n) => {
            t[n] = Math.min(Math.max(r, e), s)
        }), t)
    }
    static isColorLike(t) {
        return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof Os || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0
    }
};
_s.shared = new _s;
_s._temp = new _s;
_s.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let lt = _s;
const Ad = {
    cullArea: null,
    cullable: !1,
    cullableChildren: !0
};
let er = 0;
const Do = 500;

function V(...i) {
    er !== Do && (er++, er === Do ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...i))
}
const bs = {
    _registeredResources: new Set,
    register(i) {
        this._registeredResources.add(i)
    },
    unregister(i) {
        this._registeredResources.delete(i)
    },
    release() {
        this._registeredResources.forEach(i => i.clear())
    },
    get registeredCount() {
        return this._registeredResources.size
    },
    isRegistered(i) {
        return this._registeredResources.has(i)
    },
    reset() {
        this._registeredResources.clear()
    }
};
class Pd {
    constructor(t, e) {
        this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e)
    }
    prepopulate(t) {
        for (let e = 0; e < t; e++) this._pool[this._index++] = new this._classType;
        this._count += t
    }
    get(t) {
        var s;
        let e;
        return this._index > 0 ? e = this._pool[--this._index] : (e = new this._classType, this._count++), (s = e.init) == null || s.call(e, t), e
    }
    return (t) {
        var e;
        (e = t.reset) == null || e.call(t), this._pool[this._index++] = t
    }
    get totalSize() {
        return this._count
    }
    get totalFree() {
        return this._index
    }
    get totalUsed() {
        return this._count - this._index
    }
    clear() {
        if (this._pool.length > 0 && this._pool[0].destroy)
            for (let t = 0; t < this._index; t++) this._pool[t].destroy();
        this._pool.length = 0, this._count = 0, this._index = 0
    }
}
class Ed {
    constructor() {
        this._poolsByClass = new Map
    }
    prepopulate(t, e) {
        this.getPool(t).prepopulate(e)
    }
    get(t, e) {
        return this.getPool(t).get(e)
    }
    return (t) {
        this.getPool(t.constructor).return(t)
    }
    getPool(t) {
        return this._poolsByClass.has(t) || this._poolsByClass.set(t, new Pd(t)), this._poolsByClass.get(t)
    }
    stats() {
        const t = {};
        return this._poolsByClass.forEach(e => {
            const s = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
            t[s] = {
                free: e.totalFree,
                used: e.totalUsed,
                size: e.totalSize
            }
        }), t
    }
    clear() {
        this._poolsByClass.forEach(t => t.clear()), this._poolsByClass.clear()
    }
}
const Et = new Ed;
bs.register(Et);
const Md = {
    get isCachedAsTexture() {
        var i;
        return !!((i = this.renderGroup) != null && i.isCachedAsTexture)
    },
    cacheAsTexture(i) {
        typeof i == "boolean" && i === !1 ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(i === !0 ? {} : i))
    },
    updateCacheTexture() {
        var i;
        (i = this.renderGroup) == null || i.updateCacheTexture()
    },
    get cacheAsBitmap() {
        return this.isCachedAsTexture
    },
    set cacheAsBitmap(i) {
        U("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead."), this.cacheAsTexture(i)
    }
};

function Wh(i, t, e) {
    const s = i.length;
    let r;
    if (t >= s || e === 0) return;
    e = t + e > s ? s - t : e;
    const n = s - e;
    for (r = t; r < n; ++r) i[r] = i[r + e];
    i.length = n
}
const kd = {
        allowChildren: !0,
        removeChildren(i = 0, t) {
            var n;
            const e = t ?? this.children.length,
                s = e - i,
                r = [];
            if (s > 0 && s <= e) {
                for (let a = e - 1; a >= i; a--) {
                    const h = this.children[a];
                    h && (r.push(h), h.parent = null)
                }
                Wh(this.children, i, e);
                const o = this.renderGroup || this.parentRenderGroup;
                o && o.removeChildren(r);
                for (let a = 0; a < r.length; ++a) {
                    const h = r[a];
                    (n = h.parentRenderLayer) == null || n.detach(h), this.emit("childRemoved", h, this, a), r[a].emit("removed", this)
                }
                return r.length > 0 && this._didViewChangeTick++, r
            } else if (s === 0 && this.children.length === 0) return r;
            throw new RangeError("removeChildren: numeric values are outside the acceptable range.")
        },
        removeChildAt(i) {
            const t = this.getChildAt(i);
            return this.removeChild(t)
        },
        getChildAt(i) {
            if (i < 0 || i >= this.children.length) throw new Error(`getChildAt: Index (${i}) does not exist.`);
            return this.children[i]
        },
        setChildIndex(i, t) {
            if (t < 0 || t >= this.children.length) throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
            this.getChildIndex(i), this.addChildAt(i, t)
        },
        getChildIndex(i) {
            const t = this.children.indexOf(i);
            if (t === -1) throw new Error("The supplied Container must be a child of the caller");
            return t
        },
        addChildAt(i, t) {
            this.allowChildren || U(at, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
            const {
                children: e
            } = this;
            if (t < 0 || t > e.length) throw new Error(`${i}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
            const s = i.parent === this;
            if (i.parent) {
                const n = i.parent.children.indexOf(i);
                if (s) {
                    if (n === t) return i;
                    i.parent.children.splice(n, 1)
                } else i.removeFromParent()
            }
            t === e.length ? e.push(i) : e.splice(t, 0, i), i.parent = this, i.didChange = !0, i._updateFlags = 15;
            const r = this.renderGroup || this.parentRenderGroup;
            return r && r.addChild(i), this.sortableChildren && (this.sortDirty = !0), s || (this.emit("childAdded", i, this, t), i.emit("added", this)), i
        },
        swapChildren(i, t) {
            if (i === t) return;
            const e = this.getChildIndex(i),
                s = this.getChildIndex(t);
            this.children[e] = t, this.children[s] = i;
            const r = this.renderGroup || this.parentRenderGroup;
            r && (r.structureDidChange = !0), this._didContainerChangeTick++
        },
        removeFromParent() {
            var i;
            (i = this.parent) == null || i.removeChild(this)
        },
        reparentChild(...i) {
            return i.length === 1 ? this.reparentChildAt(i[0], this.children.length) : (i.forEach(t => this.reparentChildAt(t, this.children.length)), i[0])
        },
        reparentChildAt(i, t) {
            if (i.parent === this) return this.setChildIndex(i, t), i;
            const e = i.worldTransform.clone();
            i.removeFromParent(), this.addChildAt(i, t);
            const s = this.worldTransform.clone();
            return s.invert(), e.prepend(s), i.setFromMatrix(e), i
        },
        replaceChild(i, t) {
            i.updateLocalTransform(), this.addChildAt(t, this.getChildIndex(i)), t.setFromMatrix(i.localTransform), t.updateLocalTransform(), this.removeChild(i)
        }
    },
    Rd = {
        collectRenderables(i, t, e) {
            this.parentRenderLayer && this.parentRenderLayer !== e || this.globalDisplayStatus < 7 || !this.includeInBuild || (this.sortableChildren && this.sortChildren(), this.isSimple ? this.collectRenderablesSimple(i, t, e) : this.renderGroup ? t.renderPipes.renderGroup.addRenderGroup(this.renderGroup, i) : this.collectRenderablesWithEffects(i, t, e))
        },
        collectRenderablesSimple(i, t, e) {
            const s = this.children,
                r = s.length;
            for (let n = 0; n < r; n++) s[n].collectRenderables(i, t, e)
        },
        collectRenderablesWithEffects(i, t, e) {
            const {
                renderPipes: s
            } = t;
            for (let r = 0; r < this.effects.length; r++) {
                const n = this.effects[r];
                s[n.pipe].push(n, this, i)
            }
            this.collectRenderablesSimple(i, t, e);
            for (let r = this.effects.length - 1; r >= 0; r--) {
                const n = this.effects[r];
                s[n.pipe].pop(n, this, i)
            }
        }
    };
class Oi {
    constructor() {
        this.pipe = "filter", this.priority = 1
    }
    destroy() {
        for (let t = 0; t < this.filters.length; t++) this.filters[t].destroy();
        this.filters = null, this.filterArea = null
    }
}
class Bd {
    constructor() {
        this._effectClasses = [], this._tests = [], this._initialized = !1
    }
    init() {
        this._initialized || (this._initialized = !0, this._effectClasses.forEach(t => {
            this.add({
                test: t.test,
                maskClass: t
            })
        }))
    }
    add(t) {
        this._tests.push(t)
    }
    getMaskEffect(t) {
        this._initialized || this.init();
        for (let e = 0; e < this._tests.length; e++) {
            const s = this._tests[e];
            if (s.test(t)) return Et.get(s.maskClass, t)
        }
        return t
    }
    returnMaskEffect(t) {
        Et.return(t)
    }
}
const Vr = new Bd;
Y.handleByList(w.MaskEffect, Vr._effectClasses);
const Id = {
        _maskEffect: null,
        _maskOptions: {
            inverse: !1
        },
        _filterEffect: null,
        effects: [],
        _markStructureAsChanged() {
            const i = this.renderGroup || this.parentRenderGroup;
            i && (i.structureDidChange = !0)
        },
        addEffect(i) {
            this.effects.indexOf(i) === -1 && (this.effects.push(i), this.effects.sort((e, s) => e.priority - s.priority), this._markStructureAsChanged(), this._updateIsSimple())
        },
        removeEffect(i) {
            const t = this.effects.indexOf(i);
            t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple())
        },
        set mask(i) {
            const t = this._maskEffect;
            (t == null ? void 0 : t.mask) !== i && (t && (this.removeEffect(t), Vr.returnMaskEffect(t), this._maskEffect = null), i != null && (this._maskEffect = Vr.getMaskEffect(i), this.addEffect(this._maskEffect)))
        },
        get mask() {
            var i;
            return (i = this._maskEffect) == null ? void 0 : i.mask
        },
        setMask(i) {
            this._maskOptions = {
                ...this._maskOptions,
                ...i
            }, i.mask && (this.mask = i.mask), this._markStructureAsChanged()
        },
        set filters(i) {
            var n;
            !Array.isArray(i) && i && (i = [i]);
            const t = this._filterEffect || (this._filterEffect = new Oi);
            i = i;
            const e = (i == null ? void 0 : i.length) > 0,
                s = ((n = t.filters) == null ? void 0 : n.length) > 0,
                r = e !== s;
            i = Array.isArray(i) ? i.slice(0) : i, t.filters = Object.freeze(i), r && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = i ?? null))
        },
        get filters() {
            var i;
            return (i = this._filterEffect) == null ? void 0 : i.filters
        },
        set filterArea(i) {
            this._filterEffect || (this._filterEffect = new Oi), this._filterEffect.filterArea = i
        },
        get filterArea() {
            var i;
            return (i = this._filterEffect) == null ? void 0 : i.filterArea
        }
    },
    Gd = {
        label: null,
        get name() {
            return U(at, "Container.name property has been removed, use Container.label instead"), this.label
        },
        set name(i) {
            U(at, "Container.name property has been removed, use Container.label instead"), this.label = i
        },
        getChildByName(i, t = !1) {
            return this.getChildByLabel(i, t)
        },
        getChildByLabel(i, t = !1) {
            const e = this.children;
            for (let s = 0; s < e.length; s++) {
                const r = e[s];
                if (r.label === i || i instanceof RegExp && i.test(r.label)) return r
            }
            if (t)
                for (let s = 0; s < e.length; s++) {
                    const n = e[s].getChildByLabel(i, !0);
                    if (n) return n
                }
            return null
        },
        getChildrenByLabel(i, t = !1, e = []) {
            const s = this.children;
            for (let r = 0; r < s.length; r++) {
                const n = s[r];
                (n.label === i || i instanceof RegExp && i.test(n.label)) && e.push(n)
            }
            if (t)
                for (let r = 0; r < s.length; r++) s[r].getChildrenByLabel(i, !0, e);
            return e
        }
    },
    Lt = Et.getPool(N),
    fe = Et.getPool(Ft),
    Fd = new N,
    Od = {
        getFastGlobalBounds(i, t) {
            t || (t = new Ft), t.clear(), this._getGlobalBoundsRecursive(!!i, t, this.parentRenderLayer), t.isValid || t.set(0, 0, 0, 0);
            const e = this.renderGroup || this.parentRenderGroup;
            return t.applyMatrix(e.worldTransform), t
        },
        _getGlobalBoundsRecursive(i, t, e) {
            let s = t;
            if (i && this.parentRenderLayer && this.parentRenderLayer !== e || this.localDisplayStatus !== 7 || !this.measurable) return;
            const r = !!this.effects.length;
            if ((this.renderGroup || r) && (s = fe.get().clear()), this.boundsArea) t.addRect(this.boundsArea, this.worldTransform);
            else {
                if (this.renderPipeId) {
                    const o = this.bounds;
                    s.addFrame(o.minX, o.minY, o.maxX, o.maxY, this.groupTransform)
                }
                const n = this.children;
                for (let o = 0; o < n.length; o++) n[o]._getGlobalBoundsRecursive(i, s, e)
            }
            if (r) {
                let n = !1;
                const o = this.renderGroup || this.parentRenderGroup;
                for (let a = 0; a < this.effects.length; a++) this.effects[a].addBounds && (n || (n = !0, s.applyMatrix(o.worldTransform)), this.effects[a].addBounds(s, !0));
                n && s.applyMatrix(o.worldTransform.copyTo(Fd).invert()), t.addBounds(s), fe.return(s)
            } else this.renderGroup && (t.addBounds(s, this.relativeGroupTransform), fe.return(s))
        }
    };

function gn(i, t, e) {
    e.clear();
    let s, r;
    return i.parent ? t ? s = i.parent.worldTransform : (r = Lt.get().identity(), s = _n(i, r)) : s = N.IDENTITY, Hh(i, e, s, t), r && Lt.return(r), e.isValid || e.set(0, 0, 0, 0), e
}

function Hh(i, t, e, s) {
    var a, h;
    if (!i.visible || !i.measurable) return;
    let r;
    s ? r = i.worldTransform : (i.updateLocalTransform(), r = Lt.get(), r.appendFrom(i.localTransform, e));
    const n = t,
        o = !!i.effects.length;
    if (o && (t = fe.get().clear()), i.boundsArea) t.addRect(i.boundsArea, r);
    else {
        const l = i.bounds;
        l && !l.isEmpty() && (t.matrix = r, t.addBounds(l));
        for (let c = 0; c < i.children.length; c++) Hh(i.children[c], t, r, s)
    }
    if (o) {
        for (let l = 0; l < i.effects.length; l++)(h = (a = i.effects[l]).addBounds) == null || h.call(a, t);
        n.addBounds(t, N.IDENTITY), fe.return(t)
    }
    s || Lt.return(r)
}

function _n(i, t) {
    const e = i.parent;
    return e && (_n(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t
}

function ds(i, t) {
    if (i === 16777215 || !t) return t;
    if (t === 16777215 || !i) return i;
    const e = i >> 16 & 255,
        s = i >> 8 & 255,
        r = i & 255,
        n = t >> 16 & 255,
        o = t >> 8 & 255,
        a = t & 255,
        h = e * n / 255 | 0,
        l = s * o / 255 | 0,
        c = r * a / 255 | 0;
    return (h << 16) + (l << 8) + c
}
const Uo = 16777215;

function Li(i, t) {
    return i === Uo ? t : t === Uo ? i : ds(i, t)
}

function fs(i) {
    return ((i & 255) << 16) + (i & 65280) + (i >> 16 & 255)
}
const Ld = {
    getGlobalAlpha(i) {
        if (i) return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
        let t = this.alpha,
            e = this.parent;
        for (; e;) t *= e.alpha, e = e.parent;
        return t
    },
    getGlobalTransform(i = new N, t) {
        if (t) return i.copyFrom(this.worldTransform);
        this.updateLocalTransform();
        const e = _n(this, Lt.get().identity());
        return i.appendFrom(this.localTransform, e), Lt.return(e), i
    },
    getGlobalTint(i) {
        if (i) return this.renderGroup ? fs(this.renderGroup.worldColor) : this.parentRenderGroup ? fs(Li(this.localColor, this.parentRenderGroup.worldColor)) : this.tint;
        let t = this.localColor,
            e = this.parent;
        for (; e;) t = Li(t, e.localColor), e = e.parent;
        return fs(t)
    }
};

function xn(i, t, e) {
    return t.clear(), e || (e = N.IDENTITY), zh(i, t, e, i, !0), t.isValid || t.set(0, 0, 0, 0), t
}

function zh(i, t, e, s, r) {
    var h, l;
    let n;
    if (r) n = Lt.get(), n = e.copyTo(n);
    else {
        if (!i.visible || !i.measurable) return;
        i.updateLocalTransform();
        const c = i.localTransform;
        n = Lt.get(), n.appendFrom(c, e)
    }
    const o = t,
        a = !!i.effects.length;
    if (a && (t = fe.get().clear()), i.boundsArea) t.addRect(i.boundsArea, n);
    else {
        i.renderPipeId && (t.matrix = n, t.addBounds(i.bounds));
        const c = i.children;
        for (let u = 0; u < c.length; u++) zh(c[u], t, n, s, !1)
    }
    if (a) {
        for (let c = 0; c < i.effects.length; c++)(l = (h = i.effects[c]).addLocalBounds) == null || l.call(h, t, s);
        o.addBounds(t, N.IDENTITY), fe.return(t)
    }
    Lt.return(n)
}

function Vh(i, t) {
    const e = i.children;
    for (let s = 0; s < e.length; s++) {
        const r = e[s],
            n = r.uid,
            o = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535,
            a = t.index;
        (t.data[a] !== n || t.data[a + 1] !== o) && (t.data[t.index] = n, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, r.children.length && Vh(r, t)
    }
    return t.didChange
}
const Dd = new N,
    Ud = {
        _localBoundsCacheId: -1,
        _localBoundsCacheData: null,
        _setWidth(i, t) {
            const e = Math.sign(this.scale.x) || 1;
            t !== 0 ? this.scale.x = i / t * e : this.scale.x = e
        },
        _setHeight(i, t) {
            const e = Math.sign(this.scale.y) || 1;
            t !== 0 ? this.scale.y = i / t * e : this.scale.y = e
        },
        getLocalBounds() {
            this._localBoundsCacheData || (this._localBoundsCacheData = {
                data: [],
                index: 1,
                didChange: !1,
                localBounds: new Ft
            });
            const i = this._localBoundsCacheData;
            return i.index = 1, i.didChange = !1, i.data[0] !== this._didViewChangeTick && (i.didChange = !0, i.data[0] = this._didViewChangeTick), Vh(this, i), i.didChange && xn(this, i.localBounds, Dd), i.localBounds
        },
        getBounds(i, t) {
            return gn(this, i, t || new Ft)
        }
    },
    Nd = {
        _onRender: null,
        set onRender(i) {
            const t = this.renderGroup || this.parentRenderGroup;
            if (!i) {
                this._onRender && (t == null || t.removeOnRender(this)), this._onRender = null;
                return
            }
            this._onRender || t == null || t.addOnRender(this), this._onRender = i
        },
        get onRender() {
            return this._onRender
        }
    },
    Wd = {
        _zIndex: 0,
        sortDirty: !1,
        sortableChildren: !1,
        get zIndex() {
            return this._zIndex
        },
        set zIndex(i) {
            this._zIndex !== i && (this._zIndex = i, this.depthOfChildModified())
        },
        depthOfChildModified() {
            this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0)
        },
        sortChildren() {
            this.sortDirty && (this.sortDirty = !1, this.children.sort(Hd))
        }
    };

function Hd(i, t) {
    return i._zIndex - t._zIndex
}
const zd = {
    getGlobalPosition(i = new mt, t = !1) {
        return this.parent ? this.parent.toGlobal(this._position, i, t) : (i.x = this._position.x, i.y = this._position.y), i
    },
    toGlobal(i, t, e = !1) {
        const s = this.getGlobalTransform(Lt.get(), e);
        return t = s.apply(i, t), Lt.return(s), t
    },
    toLocal(i, t, e, s) {
        t && (i = t.toGlobal(i, e, s));
        const r = this.getGlobalTransform(Lt.get(), s);
        return e = r.applyInverse(i, e), Lt.return(r), e
    }
};
class yn {
    constructor() {
        this.uid = pt("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0
    }
    reset() {
        this.instructionSize = 0
    }
    destroy() {
        this.instructions.length = 0, this.renderables.length = 0, this.renderPipes = null, this.gcTick = 0
    }
    add(t) {
        this.instructions[this.instructionSize++] = t
    }
    log() {
        this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"])
    }
}
let Vd = 0;
class Xd {
    constructor(t) {
        this._poolKeyHash = Object.create(null), this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1, this.textureStyle = new me(this.textureOptions)
    }
    createTexture(t, e, s, r) {
        const n = new At({
            ...this.textureOptions,
            width: t,
            height: e,
            resolution: 1,
            antialias: s,
            autoGarbageCollect: !1,
            autoGenerateMipmaps: r
        });
        return new O({
            source: n,
            label: `texturePool_${Vd++}`
        })
    }
    getOptimalTexture(t, e, s = 1, r, n = !1) {
        let o = Math.ceil(t * s - 1e-6),
            a = Math.ceil(e * s - 1e-6);
        o = gs(o), a = gs(a);
        const h = r ? 1 : 0,
            l = n ? 1 : 0,
            c = (o << 17) + (a << 2) + (l << 1) + h;
        this._texturePool[c] || (this._texturePool[c] = []);
        let u = this._texturePool[c].pop();
        return u || (u = this.createTexture(o, a, r, n)), u.source._resolution = s, u.source.width = o / s, u.source.height = a / s, u.source.pixelWidth = o, u.source.pixelHeight = a, u.frame.x = 0, u.frame.y = 0, u.frame.width = t, u.frame.height = e, u.updateUvs(), this._poolKeyHash[u.uid] = c, u
    }
    getSameSizeTexture(t, e = !1) {
        const s = t.source;
        return this.getOptimalTexture(t.width, t.height, s._resolution, e)
    }
    returnTexture(t, e = !1) {
        const s = this._poolKeyHash[t.uid];
        e && (t.source.style = this.textureStyle), this._texturePool[s].push(t)
    }
    clear(t) {
        if (t = t !== !1, t)
            for (const e in this._texturePool) {
                const s = this._texturePool[e];
                if (s)
                    for (let r = 0; r < s.length; r++) s[r].destroy(!0)
            }
        this._texturePool = {}
    }
}
const bt = new Xd;
bs.register(bt);
class Xr {
    constructor() {
        this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new N, this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = {
            list: [],
            index: 0
        }, this.structureDidChange = !0, this.instructionSet = new yn, this._onRenderContainers = [], this.textureNeedsUpdate = !0, this.isCachedAsTexture = !1, this._matrixDirty = 7
    }
    init(t) {
        this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
        const e = t.children;
        for (let s = 0; s < e.length; s++) {
            const r = e[s];
            r._updateFlags = 15, this.addChild(r)
        }
    }
    enableCacheAsTexture(t = {}) {
        this.textureOptions = t, this.isCachedAsTexture = !0, this.textureNeedsUpdate = !0
    }
    disableCacheAsTexture() {
        this.isCachedAsTexture = !1, this.texture && (bt.returnTexture(this.texture, !0), this.texture = null)
    }
    updateCacheTexture() {
        this.textureNeedsUpdate = !0;
        const t = this._parentCacheAsTextureRenderGroup;
        t && !t.textureNeedsUpdate && t.updateCacheTexture()
    }
    reset() {
        this.renderGroupChildren.length = 0;
        for (const t in this.childrenToUpdate) {
            const e = this.childrenToUpdate[t];
            e.list.fill(null), e.index = 0
        }
        this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture()
    }
    get localTransform() {
        return this.root.localTransform
    }
    addRenderGroupChild(t) {
        t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t)
    }
    _removeRenderGroupChild(t) {
        const e = this.renderGroupChildren.indexOf(t);
        e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null
    }
    addChild(t) {
        if (this.structureDidChange = !0, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = !0, this.onChildUpdate(t), t.renderGroup) {
            this.addRenderGroupChild(t.renderGroup);
            return
        }
        t._onRender && this.addOnRender(t);
        const e = t.children;
        for (let s = 0; s < e.length; s++) this.addChild(e[s])
    }
    removeChild(t) {
        if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
            this._removeRenderGroupChild(t.renderGroup);
            return
        }
        const e = t.children;
        for (let s = 0; s < e.length; s++) this.removeChild(e[s])
    }
    removeChildren(t) {
        for (let e = 0; e < t.length; e++) this.removeChild(t[e])
    }
    onChildUpdate(t) {
        let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
        e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = {
            index: 0,
            list: []
        }), e.list[e.index++] = t
    }
    updateRenderable(t) {
        t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = !1)
    }
    onChildViewUpdate(t) {
        this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t
    }
    get isRenderable() {
        return this.root.localDisplayStatus === 7 && this.worldAlpha > 0
    }
    addOnRender(t) {
        this._onRenderContainers.push(t)
    }
    removeOnRender(t) {
        this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1)
    }
    runOnRender(t) {
        for (let e = 0; e < this._onRenderContainers.length; e++) this._onRenderContainers[e]._onRender(t)
    }
    destroy() {
        this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null
    }
    getChildren(t = []) {
        const e = this.root.children;
        for (let s = 0; s < e.length; s++) this._getChildren(e[s], t);
        return t
    }
    _getChildren(t, e = []) {
        if (e.push(t), t.renderGroup) return e;
        const s = t.children;
        for (let r = 0; r < s.length; r++) this._getChildren(s[r], e);
        return e
    }
    invalidateMatrices() {
        this._matrixDirty = 7
    }
    get inverseWorldTransform() {
        return this._matrixDirty & 1 ? (this._matrixDirty &= -2, this._inverseWorldTransform || (this._inverseWorldTransform = new N), this._inverseWorldTransform.copyFrom(this.worldTransform).invert()) : this._inverseWorldTransform
    }
    get textureOffsetInverseTransform() {
        return this._matrixDirty & 2 ? (this._matrixDirty &= -3, this._textureOffsetInverseTransform || (this._textureOffsetInverseTransform = new N), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(-this._textureBounds.x, -this._textureBounds.y)) : this._textureOffsetInverseTransform
    }
    get inverseParentTextureTransform() {
        if (!(this._matrixDirty & 4)) return this._inverseParentTextureTransform;
        this._matrixDirty &= -5;
        const t = this._parentCacheAsTextureRenderGroup;
        return t ? (this._inverseParentTextureTransform || (this._inverseParentTextureTransform = new N), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(t.inverseWorldTransform).translate(-t._textureBounds.x, -t._textureBounds.y)) : this.worldTransform
    }
    get cacheToLocalTransform() {
        return this.isCachedAsTexture ? this.textureOffsetInverseTransform : this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null
    }
}

function Yd(i, t, e = {}) {
    for (const s in t) !e[s] && t[s] !== void 0 && (i[s] = t[s])
}
const sr = new Bt(null),
    fi = new Bt(null),
    ir = new Bt(null, 1, 1),
    pi = new Bt(null),
    Di = 1,
    bn = 2,
    Ws = 4;
class D extends Xt {
    constructor(t = {}) {
        var e, s;
        super(), this.uid = pt("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.parentRenderLayer = null, this.updateTick = -1, this.localTransform = new N, this.relativeGroupTransform = new N, this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new Bt(this, 0, 0), this._scale = ir, this._pivot = fi, this._origin = pi, this._skew = sr, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], Yd(this, t, {
            children: !0,
            parent: !0,
            effects: !0
        }), (e = t.children) == null || e.forEach(r => this.addChild(r)), (s = t.parent) == null || s.addChild(this)
    }
    static mixin(t) {
        U("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead."), Y.mixin(D, t)
    }
    set _didChangeId(t) {
        this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095
    }
    get _didChangeId() {
        return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12
    }
    addChild(...t) {
        if (this.allowChildren || U(at, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
            for (let r = 0; r < t.length; r++) this.addChild(t[r]);
            return t[0]
        }
        const e = t[0],
            s = this.renderGroup || this.parentRenderGroup;
        return e.parent === this ? (this.children.splice(this.children.indexOf(e), 1), this.children.push(e), s && (s.structureDidChange = !0), e) : (e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15, s && s.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e)
    }
    removeChild(...t) {
        if (t.length > 1) {
            for (let r = 0; r < t.length; r++) this.removeChild(t[r]);
            return t[0]
        }
        const e = t[0],
            s = this.children.indexOf(e);
        return s > -1 && (this._didViewChangeTick++, this.children.splice(s, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parentRenderLayer && e.parentRenderLayer.detach(e), e.parent = null, this.emit("childRemoved", e, this, s), e.emit("removed", this)), e
    }
    _onUpdate(t) {
        t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this))
    }
    set isRenderGroup(t) {
        !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup())
    }
    get isRenderGroup() {
        return !!this.renderGroup
    }
    enableRenderGroup() {
        if (this.renderGroup) return;
        const t = this.parentRenderGroup;
        t == null || t.removeChild(this), this.renderGroup = Et.get(Xr, this), this.groupTransform = N.IDENTITY, t == null || t.addChild(this), this._updateIsSimple()
    }
    disableRenderGroup() {
        if (!this.renderGroup) return;
        const t = this.parentRenderGroup;
        t == null || t.removeChild(this), Et.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple()
    }
    _updateIsSimple() {
        this.isSimple = !this.renderGroup && this.effects.length === 0
    }
    get worldTransform() {
        return this._worldTransform || (this._worldTransform = new N), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform
    }
    get x() {
        return this._position.x
    }
    set x(t) {
        this._position.x = t
    }
    get y() {
        return this._position.y
    }
    set y(t) {
        this._position.y = t
    }
    get position() {
        return this._position
    }
    set position(t) {
        this._position.copyFrom(t)
    }
    get rotation() {
        return this._rotation
    }
    set rotation(t) {
        this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew))
    }
    get angle() {
        return this.rotation * cd
    }
    set angle(t) {
        this.rotation = t * ud
    }
    get pivot() {
        return this._pivot === fi && (this._pivot = new Bt(this, 0, 0)), this._pivot
    }
    set pivot(t) {
        this._pivot === fi && (this._pivot = new Bt(this, 0, 0), this._origin !== pi && V("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t)
    }
    get skew() {
        return this._skew === sr && (this._skew = new Bt(this, 0, 0)), this._skew
    }
    set skew(t) {
        this._skew === sr && (this._skew = new Bt(this, 0, 0)), this._skew.copyFrom(t)
    }
    get scale() {
        return this._scale === ir && (this._scale = new Bt(this, 1, 1)), this._scale
    }
    set scale(t) {
        this._scale === ir && (this._scale = new Bt(this, 0, 0)), typeof t == "string" && (t = parseFloat(t)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t)
    }
    get origin() {
        return this._origin === pi && (this._origin = new Bt(this, 0, 0)), this._origin
    }
    set origin(t) {
        this._origin === pi && (this._origin = new Bt(this, 0, 0), this._pivot !== fi && V("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof t == "number" ? this._origin.set(t) : this._origin.copyFrom(t)
    }
    get width() {
        return Math.abs(this.scale.x * this.getLocalBounds().width)
    }
    set width(t) {
        const e = this.getLocalBounds().width;
        this._setWidth(t, e)
    }
    get height() {
        return Math.abs(this.scale.y * this.getLocalBounds().height)
    }
    set height(t) {
        const e = this.getLocalBounds().height;
        this._setHeight(t, e)
    }
    getSize(t) {
        t || (t = {});
        const e = this.getLocalBounds();
        return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t
    }
    setSize(t, e) {
        const s = this.getLocalBounds();
        typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, s.width), e !== void 0 && this._setHeight(e, s.height)
    }
    _updateSkew() {
        const t = this._rotation,
            e = this._skew;
        this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x)
    }
    updateTransform(t) {
        return this.position.set(typeof t.x == "number" ? t.x : this.position.x, typeof t.y == "number" ? t.y : this.position.y), this.scale.set(typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x, typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(typeof t.skewX == "number" ? t.skewX : this.skew.x, typeof t.skewY == "number" ? t.skewY : this.skew.y), this.pivot.set(typeof t.pivotX == "number" ? t.pivotX : this.pivot.x, typeof t.pivotY == "number" ? t.pivotY : this.pivot.y), this.origin.set(typeof t.originX == "number" ? t.originX : this.origin.x, typeof t.originY == "number" ? t.originY : this.origin.y), this
    }
    setFromMatrix(t) {
        t.decompose(this)
    }
    updateLocalTransform() {
        const t = this._didContainerChangeTick;
        if (this._didLocalTransformChangeId === t) return;
        this._didLocalTransformChangeId = t;
        const e = this.localTransform,
            s = this._scale,
            r = this._pivot,
            n = this._origin,
            o = this._position,
            a = s._x,
            h = s._y,
            l = r._x,
            c = r._y,
            u = -n._x,
            d = -n._y;
        e.a = this._cx * a, e.b = this._sx * a, e.c = this._cy * h, e.d = this._sy * h, e.tx = o._x - (l * e.a + c * e.c) + (u * e.a + d * e.c) - u, e.ty = o._y - (l * e.b + c * e.d) + (u * e.b + d * e.d) - d
    }
    set alpha(t) {
        t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= Di, this._onUpdate())
    }
    get alpha() {
        return this.localAlpha
    }
    set tint(t) {
        const s = lt.shared.setValue(t ?? 16777215).toBgrNumber();
        s !== this.localColor && (this.localColor = s, this._updateFlags |= Di, this._onUpdate())
    }
    get tint() {
        return fs(this.localColor)
    }
    set blendMode(t) {
        this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= bn, this.localBlendMode = t, this._onUpdate())
    }
    get blendMode() {
        return this.localBlendMode
    }
    get visible() {
        return !!(this.localDisplayStatus & 2)
    }
    set visible(t) {
        const e = t ? 2 : 0;
        (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Ws, this.localDisplayStatus ^= 2, this._onUpdate(), this.emit("visibleChanged", t))
    }
    get culled() {
        return !(this.localDisplayStatus & 4)
    }
    set culled(t) {
        const e = t ? 0 : 4;
        (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Ws, this.localDisplayStatus ^= 4, this._onUpdate())
    }
    get renderable() {
        return !!(this.localDisplayStatus & 1)
    }
    set renderable(t) {
        const e = t ? 1 : 0;
        (this.localDisplayStatus & 1) !== e && (this._updateFlags |= Ws, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate())
    }
    get isRenderable() {
        return this.localDisplayStatus === 7 && this.groupAlpha > 0
    }
    destroy(t = !1) {
        var r;
        if (this.destroyed) return;
        this.destroyed = !0;
        let e;
        if (this.children.length && (e = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._origin = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t == null ? void 0 : t.children) && e)
            for (let n = 0; n < e.length; ++n) e[n].destroy(t);
        (r = this.renderGroup) == null || r.destroy(), this.renderGroup = null
    }
}
Y.mixin(D, kd, Od, zd, Nd, Ud, Id, Gd, Wd, Ad, Md, Ld, Rd);
class vn extends D {
    constructor(t) {
        super(t), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = -1, this._gpuData = Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this._bounds = new Ft(0, 1, 0, 0), this._boundsDirty = !0, this.autoGarbageCollect = t.autoGarbageCollect ?? !0
    }
    get bounds() {
        return this._boundsDirty ? (this.updateBounds(), this._boundsDirty = !1, this._bounds) : this._bounds
    }
    get roundPixels() {
        return !!this._roundPixels
    }
    set roundPixels(t) {
        this._roundPixels = t ? 1 : 0
    }
    containsPoint(t) {
        const e = this.bounds,
            {
                x: s,
                y: r
            } = t;
        return s >= e.minX && s <= e.maxX && r >= e.minY && r <= e.maxY
    }
    onViewUpdate() {
        if (this._didViewChangeTick++, this._boundsDirty = !0, this.didViewUpdate) return;
        this.didViewUpdate = !0;
        const t = this.renderGroup || this.parentRenderGroup;
        t && t.onChildViewUpdate(this)
    }
    unload() {
        var t;
        this.emit("unload", this);
        for (const e in this._gpuData)(t = this._gpuData[e]) == null || t.destroy();
        this._gpuData = Object.create(null), this.onViewUpdate()
    }
    destroy(t) {
        this.unload(), super.destroy(t), this._bounds = null
    }
    collectRenderablesSimple(t, e, s) {
        const {
            renderPipes: r
        } = e;
        r.blendMode.pushBlendMode(this, this.groupBlendMode, t);
        const o = r[this.renderPipeId];
        o != null && o.addRenderable && o.addRenderable(this, t), this.didViewUpdate = !1;
        const a = this.children,
            h = a.length;
        for (let l = 0; l < h; l++) a[l].collectRenderables(t, e, s);
        r.blendMode.popBlendMode(t)
    }
}
class Q extends vn {
    constructor(t = O.EMPTY) {
        t instanceof O && (t = {
            texture: t
        });
        const {
            texture: e = O.EMPTY,
            anchor: s,
            roundPixels: r,
            width: n,
            height: o,
            ...a
        } = t;
        super({
            label: "Sprite",
            ...a
        }), this.renderPipeId = "sprite", this.batched = !0, this._visualBounds = {
            minX: 0,
            maxX: 1,
            minY: 0,
            maxY: 0
        }, this._anchor = new Bt({
            _onUpdate: () => {
                this.onViewUpdate()
            }
        }), s ? this.anchor = s : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = r ?? !1, n !== void 0 && (this.width = n), o !== void 0 && (this.height = o)
    }
    static from(t, e = !1) {
        return t instanceof O ? new Q(t) : new Q(O.from(t, e))
    }
    set texture(t) {
        t || (t = O.EMPTY);
        const e = this._texture;
        e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate())
    }
    get texture() {
        return this._texture
    }
    get visualBounds() {
        return Lh(this._visualBounds, this._anchor, this._texture), this._visualBounds
    }
    get sourceBounds() {
        return U("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead."), this.visualBounds
    }
    updateBounds() {
        const t = this._anchor,
            e = this._texture,
            s = this._bounds,
            {
                width: r,
                height: n
            } = e.orig;
        s.minX = -t._x * r, s.maxX = s.minX + r, s.minY = -t._y * n, s.maxY = s.minY + n
    }
    destroy(t = !1) {
        if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
            const s = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
            this._texture.destroy(s)
        }
        this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null
    }
    get anchor() {
        return this._anchor
    }
    set anchor(t) {
        typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t)
    }
    get width() {
        return Math.abs(this.scale.x) * this._texture.orig.width
    }
    set width(t) {
        this._setWidth(t, this._texture.orig.width), this._width = t
    }
    get height() {
        return Math.abs(this.scale.y) * this._texture.orig.height
    }
    set height(t) {
        this._setHeight(t, this._texture.orig.height), this._height = t
    }
    getSize(t) {
        return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t
    }
    setSize(t, e) {
        typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height)
    }
}
const $d = new Ft;

function Xh(i, t, e) {
    const s = $d;
    i.measurable = !0, gn(i, e, s), t.addBoundsMask(s), i.measurable = !1
}

function Yh(i, t, e) {
    const s = fe.get();
    i.measurable = !0;
    const r = Lt.get().identity(),
        n = $h(i, e, r);
    xn(i, s, n), i.measurable = !1, t.addBoundsMask(s), Lt.return(r), fe.return(s)
}

function $h(i, t, e) {
    return i ? (i !== t && ($h(i.parent, t, e), i.updateLocalTransform(), e.append(i.localTransform)), e) : (V("Mask bounds, renderable is not inside the root container"), e)
}
class jh {
    constructor(t) {
        this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask)
    }
    init(t) {
        this.mask = t, this.renderMaskToTexture = !(t instanceof Q), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1
    }
    reset() {
        this.mask !== null && (this.mask.measurable = !0, this.mask = null)
    }
    addBounds(t, e) {
        this.inverse || Xh(this.mask, t, e)
    }
    addLocalBounds(t, e) {
        Yh(this.mask, t, e)
    }
    containsPoint(t, e) {
        const s = this.mask;
        return e(s, t)
    }
    destroy() {
        this.reset()
    }
    static test(t) {
        return t instanceof Q
    }
}
jh.extension = w.MaskEffect;
class qh {
    constructor(t) {
        this.priority = 0, this.pipe = "colorMask", t != null && t.mask && this.init(t.mask)
    }
    init(t) {
        this.mask = t
    }
    destroy() {}
    static test(t) {
        return typeof t == "number"
    }
}
qh.extension = w.MaskEffect;
class Kh {
    constructor(t) {
        this.priority = 0, this.pipe = "stencilMask", t != null && t.mask && this.init(t.mask)
    }
    init(t) {
        this.mask = t, this.mask.includeInBuild = !1, this.mask.measurable = !1
    }
    reset() {
        this.mask !== null && (this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null)
    }
    addBounds(t, e) {
        Xh(this.mask, t, e)
    }
    addLocalBounds(t, e) {
        Yh(this.mask, t, e)
    }
    containsPoint(t, e) {
        const s = this.mask;
        return e(s, t)
    }
    destroy() {
        this.reset()
    }
    static test(t) {
        return t instanceof D
    }
}
Kh.extension = w.MaskEffect;
const jd = {
    createCanvas: (i, t) => {
        const e = document.createElement("canvas");
        return e.width = i, e.height = t, e
    },
    createImage: () => new Image,
    getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
    getWebGLRenderingContext: () => WebGLRenderingContext,
    getNavigator: () => navigator,
    getBaseUrl: () => document.baseURI ?? window.location.href,
    getFontFaceSet: () => document.fonts,
    fetch: (i, t) => fetch(i, t),
    parseXML: i => new DOMParser().parseFromString(i, "text/xml")
};
let No = jd;
const X = {
    get() {
        return No
    },
    set(i) {
        No = i
    }
};
class re extends At {
    constructor(t) {
        t.resource || (t.resource = X.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity, this.resizeCanvas(), this.transparent = !!t.transparent
    }
    resizeCanvas() {
        this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight)
    }
    resize(t = this.width, e = this.height, s = this._resolution) {
        const r = super.resize(t, e, s);
        return r && this.resizeCanvas(), r
    }
    static test(t) {
        return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas
    }
    get context2D() {
        return this._context2D || (this._context2D = this.resource.getContext("2d"))
    }
}
re.extension = w.TextureSource;
class He extends At {
    constructor(t) {
        super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0
    }
    static test(t) {
        return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame
    }
}
He.extension = w.TextureSource;
var ze = (i => (i[i.INTERACTION = 50] = "INTERACTION", i[i.HIGH = 25] = "HIGH", i[i.NORMAL = 0] = "NORMAL", i[i.LOW = -25] = "LOW", i[i.UTILITY = -50] = "UTILITY", i))(ze || {});
class rr {
    constructor(t, e = null, s = 0, r = !1) {
        this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = s, this._once = r
    }
    match(t, e = null) {
        return this._fn === t && this._context === e
    }
    emit(t) {
        this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
        const e = this.next;
        return this._once && this.destroy(!0), this._destroyed && (this.next = null), e
    }
    connect(t) {
        this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this
    }
    destroy(t = !1) {
        this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
        const e = this.next;
        return this.next = t ? null : e, this.previous = null, e
    }
}
const Zh = class Ut {
    constructor() {
        this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new rr(null, null, 1 / 0), this.deltaMS = 1 / Ut.targetFPMS, this.elapsedMS = 1 / Ut.targetFPMS, this._tick = t => {
            this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)))
        }
    }
    _requestIfNeeded() {
        this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick))
    }
    _cancelIfNeeded() {
        this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null)
    }
    _startIfPossible() {
        this.started ? this._requestIfNeeded() : this.autoStart && this.start()
    }
    add(t, e, s = ze.NORMAL) {
        return this._addListener(new rr(t, e, s))
    }
    addOnce(t, e, s = ze.NORMAL) {
        return this._addListener(new rr(t, e, s, !0))
    }
    _addListener(t) {
        let e = this._head.next,
            s = this._head;
        if (!e) t.connect(s);
        else {
            for (; e;) {
                if (t.priority > e.priority) {
                    t.connect(s);
                    break
                }
                s = e, e = e.next
            }
            t.previous || t.connect(s)
        }
        return this._startIfPossible(), this
    }
    remove(t, e) {
        let s = this._head.next;
        for (; s;) s.match(t, e) ? s = s.destroy() : s = s.next;
        return this._head.next || this._cancelIfNeeded(), this
    }
    get count() {
        if (!this._head) return 0;
        let t = 0,
            e = this._head;
        for (; e = e.next;) t++;
        return t
    }
    start() {
        this.started || (this.started = !0, this._requestIfNeeded())
    }
    stop() {
        this.started && (this.started = !1, this._cancelIfNeeded())
    }
    destroy() {
        if (!this._protected) {
            this.stop();
            let t = this._head.next;
            for (; t;) t = t.destroy(!0);
            this._head.destroy(), this._head = null
        }
    }
    update(t = performance.now()) {
        let e;
        if (t > this.lastTime) {
            if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
                const n = t - this._lastFrame | 0;
                if (n < this._minElapsedMS) return;
                this._lastFrame = t - n % this._minElapsedMS
            }
            this.deltaMS = e, this.deltaTime = this.deltaMS * Ut.targetFPMS;
            const s = this._head;
            let r = s.next;
            for (; r;) r = r.emit(this);
            s.next || this._cancelIfNeeded()
        } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
        this.lastTime = t
    }
    get FPS() {
        return 1e3 / this.elapsedMS
    }
    get minFPS() {
        return 1e3 / this._maxElapsedMS
    }
    set minFPS(t) {
        const e = Math.min(Math.max(0, t) / 1e3, Ut.targetFPMS);
        this._maxElapsedMS = 1 / e, this._minElapsedMS && t > this.maxFPS && (this.maxFPS = t)
    }
    get maxFPS() {
        return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0
    }
    set maxFPS(t) {
        t === 0 ? this._minElapsedMS = 0 : (t < this.minFPS && (this.minFPS = t), this._minElapsedMS = 1 / (t / 1e3))
    }
    static get shared() {
        if (!Ut._shared) {
            const t = Ut._shared = new Ut;
            t.autoStart = !0, t._protected = !0
        }
        return Ut._shared
    }
    static get system() {
        if (!Ut._system) {
            const t = Ut._system = new Ut;
            t.autoStart = !0, t._protected = !0
        }
        return Ut._system
    }
};
Zh.targetFPMS = .06;
let Gt = Zh,
    nr;
async function Qh() {
    return nr ?? (nr = (async () => {
        var o;
        const t = X.get().createCanvas(1, 1).getContext("webgl");
        if (!t) return "premultiply-alpha-on-upload";
        const e = await new Promise(a => {
            const h = document.createElement("video");
            h.onloadeddata = () => a(h), h.onerror = () => a(null), h.autoplay = !1, h.crossOrigin = "anonymous", h.preload = "auto", h.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", h.load()
        });
        if (!e) return "premultiply-alpha-on-upload";
        const s = t.createTexture();
        t.bindTexture(t.TEXTURE_2D, s);
        const r = t.createFramebuffer();
        t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, s, 0), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
        const n = new Uint8Array(4);
        return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(r), t.deleteTexture(s), (o = t.getExtension("WEBGL_lose_context")) == null || o.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload"
    })()), nr
}
const Xi = class Jh extends At {
    constructor(t) {
        super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
            ...Jh.defaultOptions,
            ...t
        }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load()
    }
    updateFrame() {
        if (!this.destroyed) {
            if (this._updateFPS) {
                const t = Gt.shared.elapsedMS * this.resource.playbackRate;
                this._msToNextUpdate = Math.floor(this._msToNextUpdate - t)
            }(!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update()
        }
    }
    _videoFrameRequestCallback() {
        this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback)
    }
    get isValid() {
        return !!this.resource.videoWidth && !!this.resource.videoHeight
    }
    async load() {
        if (this._load) return this._load;
        const t = this.resource,
            e = this.options;
        return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await Qh(), this._load = new Promise((s, r) => {
            this.isValid ? s(this) : (this._resolve = s, this._reject = r, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
                this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`))
            })), t.load())
        }), this._load
    }
    _onError(t) {
        this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null)
    }
    _isSourcePlaying() {
        const t = this.resource;
        return !t.paused && !t.ended
    }
    _isSourceReady() {
        return this.resource.readyState > 2
    }
    _onPlayStart() {
        this.isValid || this._mediaReady(), this._configureAutoUpdate()
    }
    _onPlayStop() {
        this._configureAutoUpdate()
    }
    _onSeeked() {
        this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0)
    }
    _onCanPlay() {
        this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady()
    }
    _onCanPlayThrough() {
        this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady()
    }
    _mediaReady() {
        const t = this.resource;
        this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play()
    }
    destroy() {
        this._configureAutoUpdate();
        const t = this.resource;
        t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy()
    }
    get autoUpdate() {
        return this._autoUpdate
    }
    set autoUpdate(t) {
        t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate())
    }
    get updateFPS() {
        return this._updateFPS
    }
    set updateFPS(t) {
        t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate())
    }
    _configureAutoUpdate() {
        this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (Gt.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (Gt.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (Gt.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0))
    }
    static test(t) {
        return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement
    }
};
Xi.extension = w.TextureSource;
Xi.defaultOptions = {
    ...At.defaultOptions,
    autoLoad: !0,
    autoPlay: !0,
    updateFPS: 0,
    crossorigin: !0,
    loop: !1,
    muted: !0,
    playsinline: !0,
    preload: !1
};
Xi.MIME_TYPES = {
    ogv: "video/ogg",
    mov: "video/quicktime",
    m4v: "video/mp4"
};
let Hs = Xi;
const Jt = (i, t, e = !1) => (Array.isArray(i) || (i = [i]), t ? i.map(s => typeof s == "string" || e ? t(s) : s) : i);
class qd {
    constructor() {
        this._parsers = [], this._cache = new Map, this._cacheMap = new Map
    }
    reset() {
        this._cacheMap.clear(), this._cache.clear()
    }
    has(t) {
        return this._cache.has(t)
    }
    get(t) {
        const e = this._cache.get(t);
        return e || V(`[Assets] Asset id ${t} was not found in the Cache`), e
    }
    set(t, e) {
        const s = Jt(t);
        let r;
        for (let h = 0; h < this.parsers.length; h++) {
            const l = this.parsers[h];
            if (l.test(e)) {
                r = l.getCacheableAssets(s, e);
                break
            }
        }
        const n = new Map(Object.entries(r || {}));
        r || s.forEach(h => {
            n.set(h, e)
        });
        const o = [...n.keys()],
            a = {
                cacheKeys: o,
                keys: s
            };
        s.forEach(h => {
            this._cacheMap.set(h, a)
        }), o.forEach(h => {
            const l = r ? r[h] : e;
            this._cache.has(h) && this._cache.get(h) !== l && V("[Cache] already has key:", h), this._cache.set(h, n.get(h))
        })
    }
    remove(t) {
        if (!this._cacheMap.has(t)) {
            V(`[Assets] Asset id ${t} was not found in the Cache`);
            return
        }
        const e = this._cacheMap.get(t);
        e.cacheKeys.forEach(r => {
            this._cache.delete(r)
        }), e.keys.forEach(r => {
            this._cacheMap.delete(r)
        })
    }
    get parsers() {
        return this._parsers
    }
}
const ft = new qd,
    Yr = [];
Y.handleByList(w.TextureSource, Yr);

function tl(i = {}) {
    const t = i && i.resource,
        e = t ? i.resource : i,
        s = t ? i : {
            resource: i
        };
    for (let r = 0; r < Yr.length; r++) {
        const n = Yr[r];
        if (n.test(e)) return new n(s)
    }
    throw new Error(`Could not find a source type for resource: ${s.resource}`)
}

function Kd(i = {}, t = !1) {
    const e = i && i.resource,
        s = e ? i.resource : i,
        r = e ? i : {
            resource: i
        };
    if (!t && ft.has(s)) return ft.get(s);
    const n = new O({
        source: tl(r)
    });
    return n.on("destroy", () => {
        ft.has(s) && ft.remove(s)
    }), t || ft.set(s, n), n
}

function Zd(i, t = !1) {
    return typeof i == "string" ? ft.get(i) : i instanceof At ? new O({
        source: i
    }) : Kd(i, t)
}
O.from = Zd;
At.from = tl;
Y.add(jh, qh, Kh, Hs, He, re, mn);
var Ae = (i => (i[i.Low = 0] = "Low", i[i.Normal = 1] = "Normal", i[i.High = 2] = "High", i))(Ae || {});

function Zt(i) {
    if (typeof i != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(i)}`)
}

function Cs(i) {
    return i.split("?")[0].split("#")[0]
}

function Qd(i) {
    return i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function Jd(i, t, e) {
    return i.replace(new RegExp(Qd(t), "g"), e)
}

function tf(i, t) {
    let e = "",
        s = 0,
        r = -1,
        n = 0,
        o = -1;
    for (let a = 0; a <= i.length; ++a) {
        if (a < i.length) o = i.charCodeAt(a);
        else {
            if (o === 47) break;
            o = 47
        }
        if (o === 47) {
            if (!(r === a - 1 || n === 1))
                if (r !== a - 1 && n === 2) {
                    if (e.length < 2 || s !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
                        if (e.length > 2) {
                            const h = e.lastIndexOf("/");
                            if (h !== e.length - 1) {
                                h === -1 ? (e = "", s = 0) : (e = e.slice(0, h), s = e.length - 1 - e.lastIndexOf("/")), r = a, n = 0;
                                continue
                            }
                        } else if (e.length === 2 || e.length === 1) {
                            e = "", s = 0, r = a, n = 0;
                            continue
                        }
                    }
                } else e.length > 0 ? e += `/${i.slice(r+1,a)}` : e = i.slice(r + 1, a), s = a - r - 1;
            r = a, n = 0
        } else o === 46 && n !== -1 ? ++n : n = -1
    }
    return e
}
const Ht = {
    toPosix(i) {
        return Jd(i, "\\", "/")
    },
    isUrl(i) {
        return /^https?:/.test(this.toPosix(i))
    },
    isDataUrl(i) {
        return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(i)
    },
    isBlobUrl(i) {
        return i.startsWith("blob:")
    },
    hasProtocol(i) {
        return /^[^/:]+:/.test(this.toPosix(i))
    },
    getProtocol(i) {
        Zt(i), i = this.toPosix(i);
        const t = /^file:\/\/\//.exec(i);
        if (t) return t[0];
        const e = /^[^/:]+:\/{0,2}/.exec(i);
        return e ? e[0] : ""
    },
    toAbsolute(i, t, e) {
        if (Zt(i), this.isDataUrl(i) || this.isBlobUrl(i)) return i;
        const s = Cs(this.toPosix(t ?? X.get().getBaseUrl())),
            r = Cs(this.toPosix(e ?? this.rootname(s)));
        return i = this.toPosix(i), i.startsWith("/") ? Ht.join(r, i.slice(1)) : this.isAbsolute(i) ? i : this.join(s, i)
    },
    normalize(i) {
        if (Zt(i), i.length === 0) return ".";
        if (this.isDataUrl(i) || this.isBlobUrl(i)) return i;
        i = this.toPosix(i);
        let t = "";
        const e = i.startsWith("/");
        this.hasProtocol(i) && (t = this.rootname(i), i = i.slice(t.length));
        const s = i.endsWith("/");
        return i = tf(i), i.length > 0 && s && (i += "/"), e ? `/${i}` : t + i
    },
    isAbsolute(i) {
        return Zt(i), i = this.toPosix(i), this.hasProtocol(i) ? !0 : i.startsWith("/")
    },
    join(...i) {
        if (i.length === 0) return ".";
        let t;
        for (let e = 0; e < i.length; ++e) {
            const s = i[e];
            if (Zt(s), s.length > 0)
                if (t === void 0) t = s;
                else {
                    const r = i[e - 1] ?? "";
                    this.joinExtensions.includes(this.extname(r).toLowerCase()) ? t += `/../${s}` : t += `/${s}`
                }
        }
        return t === void 0 ? "." : this.normalize(t)
    },
    dirname(i) {
        if (Zt(i), i.length === 0) return ".";
        i = this.toPosix(i);
        let t = i.charCodeAt(0);
        const e = t === 47;
        let s = -1,
            r = !0;
        const n = this.getProtocol(i),
            o = i;
        i = i.slice(n.length);
        for (let a = i.length - 1; a >= 1; --a)
            if (t = i.charCodeAt(a), t === 47) {
                if (!r) {
                    s = a;
                    break
                }
            } else r = !1;
        return s === -1 ? e ? "/" : this.isUrl(o) ? n + i : n : e && s === 1 ? "//" : n + i.slice(0, s)
    },
    rootname(i) {
        Zt(i), i = this.toPosix(i);
        let t = "";
        if (i.startsWith("/") ? t = "/" : t = this.getProtocol(i), this.isUrl(i)) {
            const e = i.indexOf("/", t.length);
            e !== -1 ? t = i.slice(0, e) : t = i, t.endsWith("/") || (t += "/")
        }
        return t
    },
    basename(i, t) {
        Zt(i), t && Zt(t), i = Cs(this.toPosix(i));
        let e = 0,
            s = -1,
            r = !0,
            n;
        if (t !== void 0 && t.length > 0 && t.length <= i.length) {
            if (t.length === i.length && t === i) return "";
            let o = t.length - 1,
                a = -1;
            for (n = i.length - 1; n >= 0; --n) {
                const h = i.charCodeAt(n);
                if (h === 47) {
                    if (!r) {
                        e = n + 1;
                        break
                    }
                } else a === -1 && (r = !1, a = n + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (s = n) : (o = -1, s = a))
            }
            return e === s ? s = a : s === -1 && (s = i.length), i.slice(e, s)
        }
        for (n = i.length - 1; n >= 0; --n)
            if (i.charCodeAt(n) === 47) {
                if (!r) {
                    e = n + 1;
                    break
                }
            } else s === -1 && (r = !1, s = n + 1);
        return s === -1 ? "" : i.slice(e, s)
    },
    extname(i) {
        Zt(i), i = Cs(this.toPosix(i));
        let t = -1,
            e = 0,
            s = -1,
            r = !0,
            n = 0;
        for (let o = i.length - 1; o >= 0; --o) {
            const a = i.charCodeAt(o);
            if (a === 47) {
                if (!r) {
                    e = o + 1;
                    break
                }
                continue
            }
            s === -1 && (r = !1, s = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1)
        }
        return t === -1 || s === -1 || n === 0 || n === 1 && t === s - 1 && t === e + 1 ? "" : i.slice(t, s)
    },
    parse(i) {
        Zt(i);
        const t = {
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: ""
        };
        if (i.length === 0) return t;
        i = Cs(this.toPosix(i));
        let e = i.charCodeAt(0);
        const s = this.isAbsolute(i);
        let r;
        t.root = this.rootname(i), s || this.hasProtocol(i) ? r = 1 : r = 0;
        let n = -1,
            o = 0,
            a = -1,
            h = !0,
            l = i.length - 1,
            c = 0;
        for (; l >= r; --l) {
            if (e = i.charCodeAt(l), e === 47) {
                if (!h) {
                    o = l + 1;
                    break
                }
                continue
            }
            a === -1 && (h = !1, a = l + 1), e === 46 ? n === -1 ? n = l : c !== 1 && (c = 1) : n !== -1 && (c = -1)
        }
        return n === -1 || a === -1 || c === 0 || c === 1 && n === a - 1 && n === o + 1 ? a !== -1 && (o === 0 && s ? t.base = t.name = i.slice(1, a) : t.base = t.name = i.slice(o, a)) : (o === 0 && s ? (t.name = i.slice(1, n), t.base = i.slice(1, a)) : (t.name = i.slice(o, n), t.base = i.slice(o, a)), t.ext = i.slice(n, a)), t.dir = this.dirname(i), t
    },
    sep: "/",
    delimiter: ":",
    joinExtensions: [".html"]
};

function el(i, t, e, s, r) {
    const n = t[e];
    for (let o = 0; o < n.length; o++) {
        const a = n[o];
        e < t.length - 1 ? el(i.replace(s[e], a), t, e + 1, s, r) : r.push(i.replace(s[e], a))
    }
}

function ef(i) {
    const t = /\{(.*?)\}/g,
        e = i.match(t),
        s = [];
    if (e) {
        const r = [];
        e.forEach(n => {
            const o = n.substring(1, n.length - 1).split(",");
            r.push(o)
        }), el(i, r, 0, e, s)
    } else s.push(i);
    return s
}
const Ui = i => !Array.isArray(i);
class vs {
    constructor() {
        this._defaultBundleIdentifierOptions = {
            connector: "-",
            createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
            extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
        }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {}
    }
    setBundleIdentifier(t) {
        if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar") throw new Error("[Resolver] GenerateBundleAssetId are not working correctly")
    }
    prefer(...t) {
        t.forEach(e => {
            this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params))
        }), this._resolverHash = {}
    }
    set basePath(t) {
        this._basePath = t
    }
    get basePath() {
        return this._basePath
    }
    set rootPath(t) {
        this._rootPath = t
    }
    get rootPath() {
        return this._rootPath
    }
    get parsers() {
        return this._parsers
    }
    reset() {
        this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null
    }
    setDefaultSearchParams(t) {
        if (typeof t == "string") this._defaultSearchParams = t;
        else {
            const e = t;
            this._defaultSearchParams = Object.keys(e).map(s => `${encodeURIComponent(s)}=${encodeURIComponent(e[s])}`).join("&")
        }
    }
    getAlias(t) {
        const {
            alias: e,
            src: s
        } = t;
        return Jt(e || s, n => typeof n == "string" ? n : Array.isArray(n) ? n.map(o => (o == null ? void 0 : o.src) ?? o) : n != null && n.src ? n.src : n, !0)
    }
    removeAlias(t, e) {
        this._assetMap[t] && (e && e !== this._resolverHash[t] || (delete this._resolverHash[t], delete this._assetMap[t]))
    }
    addManifest(t) {
        this._manifest && V("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach(e => {
            this.addBundle(e.name, e.assets)
        })
    }
    addBundle(t, e) {
        const s = [];
        let r = e;
        Array.isArray(e) || (r = Object.entries(e).map(([n, o]) => typeof o == "string" || Array.isArray(o) ? {
            alias: n,
            src: o
        } : {
            alias: n,
            ...o
        })), r.forEach(n => {
            const o = n.src,
                a = n.alias;
            let h;
            if (typeof a == "string") {
                const l = this._createBundleAssetId(t, a);
                s.push(l), h = [a, l]
            } else {
                const l = a.map(c => this._createBundleAssetId(t, c));
                s.push(...l), h = [...a, ...l]
            }
            this.add({
                ...n,
                alias: h,
                src: o
            })
        }), this._bundles[t] = s
    }
    add(t) {
        const e = [];
        Array.isArray(t) ? e.push(...t) : e.push(t);
        let s;
        s = n => {
            this.hasKey(n) && V(`[Resolver] already has key: ${n} overwriting`)
        }, Jt(e).forEach(n => {
            const {
                src: o
            } = n;
            let {
                data: a,
                format: h,
                loadParser: l,
                parser: c
            } = n;
            const u = Jt(o).map(m => typeof m == "string" ? ef(m) : Array.isArray(m) ? m : [m]),
                d = this.getAlias(n);
            Array.isArray(d) ? d.forEach(s) : s(d);
            const f = [],
                p = m => {
                    const g = this._parsers.find(_ => _.test(m));
                    return {
                        src: m,
                        ...g == null ? void 0 : g.parse(m)
                    }
                };
            u.forEach(m => {
                m.forEach(g => {
                    let _ = {};
                    if (typeof g != "object" ? _ = p(g) : (a = g.data ?? a, h = g.format ?? h, (g.loadParser || g.parser) && (l = g.loadParser ?? l, c = g.parser ?? c), _ = {
                            ...p(g.src),
                            ...g
                        }), !d) throw new Error(`[Resolver] alias is undefined for this asset: ${_.src}`);
                    _ = this._buildResolvedAsset(_, {
                        aliases: d,
                        data: a,
                        format: h,
                        loadParser: l,
                        parser: c,
                        progressSize: n.progressSize
                    }), f.push(_)
                })
            }), d.forEach(m => {
                this._assetMap[m] = f
            })
        })
    }
    resolveBundle(t) {
        const e = Ui(t);
        t = Jt(t);
        const s = {};
        return t.forEach(r => {
            const n = this._bundles[r];
            if (n) {
                const o = this.resolve(n),
                    a = {};
                for (const h in o) {
                    const l = o[h];
                    a[this._extractAssetIdFromBundle(r, h)] = l
                }
                s[r] = a
            }
        }), e ? s[t[0]] : s
    }
    resolveUrl(t) {
        const e = this.resolve(t);
        if (typeof t != "string") {
            const s = {};
            for (const r in e) s[r] = e[r].src;
            return s
        }
        return e.src
    }
    resolve(t) {
        const e = Ui(t);
        t = Jt(t);
        const s = {};
        return t.forEach(r => {
            if (!this._resolverHash[r])
                if (this._assetMap[r]) {
                    let n = this._assetMap[r];
                    const o = this._getPreferredOrder(n);
                    o == null || o.priority.forEach(a => {
                        o.params[a].forEach(h => {
                            const l = n.filter(c => c[a] ? c[a] === h : !1);
                            l.length && (n = l)
                        })
                    }), this._resolverHash[r] = n[0]
                } else this._resolverHash[r] = this._buildResolvedAsset({
                    alias: [r],
                    src: r
                }, {});
            s[r] = this._resolverHash[r]
        }), e ? s[t[0]] : s
    }
    hasKey(t) {
        return !!this._assetMap[t]
    }
    hasBundle(t) {
        return !!this._bundles[t]
    }
    _getPreferredOrder(t) {
        for (let e = 0; e < t.length; e++) {
            const s = t[e],
                r = this._preferredOrder.find(n => n.params.format.includes(s.format));
            if (r) return r
        }
        return this._preferredOrder[0]
    }
    _appendDefaultSearchParams(t) {
        if (!this._defaultSearchParams) return t;
        const e = /\?/.test(t) ? "&" : "?";
        return `${t}${e}${this._defaultSearchParams}`
    }
    _buildResolvedAsset(t, e) {
        const {
            aliases: s,
            data: r,
            loadParser: n,
            parser: o,
            format: a,
            progressSize: h
        } = e;
        return (this._basePath || this._rootPath) && (t.src = Ht.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = s ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = {
            ...r || {},
            ...t.data
        }, t.loadParser = n ?? t.loadParser, t.parser = o ?? t.parser, t.format = a ?? t.format ?? sf(t.src), h !== void 0 && (t.progressSize = h), t
    }
}
vs.RETINA_PREFIX = /@([0-9\.]+)x/;

function sf(i) {
    return i.split(".").pop().split("?").shift().split("#").shift()
}
const $r = (i, t) => {
        const e = t.split("?")[1];
        return e && (i += `?${e}`), i
    },
    sl = class Ls {
        constructor(t, e) {
            this.linkedSheets = [];
            let s = t;
            (t == null ? void 0 : t.source) instanceof At && (s = {
                texture: t,
                data: e
            });
            const {
                texture: r,
                data: n,
                cachePrefix: o = ""
            } = s;
            this.cachePrefix = o, this._texture = r instanceof O ? r : null, this.textureSource = r.source, this.textures = {}, this.animations = {}, this.data = n;
            const a = parseFloat(n.meta.scale);
            a ? (this.resolution = a, r.source.resolution = this.resolution) : this.resolution = r.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null
        }
        parse() {
            return new Promise(t => {
                this._callback = t, this._batchIndex = 0, this._frameKeys.length <= Ls.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch()
            })
        }
        parseSync() {
            return this._processFrames(0, !0), this._processAnimations(), this.textures
        }
        _processFrames(t, e = !1) {
            let s = t;
            const r = e ? 1 / 0 : Ls.BATCH_SIZE;
            for (; s - t < r && s < this._frameKeys.length;) {
                const n = this._frameKeys[s],
                    o = this._frames[n],
                    a = o.frame;
                if (a) {
                    let h = null,
                        l = null;
                    const c = o.trimmed !== !1 && o.sourceSize ? o.sourceSize : o.frame,
                        u = new nt(0, 0, Math.floor(c.w) / this.resolution, Math.floor(c.h) / this.resolution);
                    o.rotated ? h = new nt(Math.floor(a.x) / this.resolution, Math.floor(a.y) / this.resolution, Math.floor(a.h) / this.resolution, Math.floor(a.w) / this.resolution) : h = new nt(Math.floor(a.x) / this.resolution, Math.floor(a.y) / this.resolution, Math.floor(a.w) / this.resolution, Math.floor(a.h) / this.resolution), o.trimmed !== !1 && o.spriteSourceSize && (l = new nt(Math.floor(o.spriteSourceSize.x) / this.resolution, Math.floor(o.spriteSourceSize.y) / this.resolution, Math.floor(a.w) / this.resolution, Math.floor(a.h) / this.resolution)), this.textures[n] = new O({
                        source: this.textureSource,
                        frame: h,
                        orig: u,
                        trim: l,
                        rotate: o.rotated ? 2 : 0,
                        defaultAnchor: o.anchor,
                        defaultBorders: o.borders,
                        label: n.toString()
                    })
                }
                s++
            }
        }
        _processAnimations() {
            const t = this.data.animations || {};
            for (const e in t) {
                this.animations[e] = [];
                for (let s = 0; s < t[e].length; s++) {
                    const r = t[e][s];
                    this.animations[e].push(this.textures[r])
                }
            }
        }
        _parseComplete() {
            const t = this._callback;
            this._callback = null, this._batchIndex = 0, t.call(this, this.textures)
        }
        _nextBatch() {
            this._processFrames(this._batchIndex * Ls.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
                this._batchIndex * Ls.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete())
            }, 0)
        }
        destroy(t = !1) {
            var e;
            for (const s in this.textures) this.textures[s].destroy();
            this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) == null || e.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = []
        }
    };
sl.BATCH_SIZE = 1e3;
let Wo = sl;
const rf = ["jpg", "png", "jpeg", "avif", "webp", "basis", "etc2", "bc7", "bc6h", "bc5", "bc4", "bc3", "bc2", "bc1", "eac", "astc"];

function il(i, t, e) {
    const s = {};
    if (i.forEach(r => {
            s[r] = t
        }), Object.keys(t.textures).forEach(r => {
            s[`${t.cachePrefix}${r}`] = t.textures[r]
        }), !e) {
        const r = Ht.dirname(i[0]);
        t.linkedSheets.forEach((n, o) => {
            const a = il([`${r}/${t.data.meta.related_multi_packs[o]}`], n, !0);
            Object.assign(s, a)
        })
    }
    return s
}
const nf = {
    extension: w.Asset,
    cache: {
        test: i => i instanceof Wo,
        getCacheableAssets: (i, t) => il(i, t, !1)
    },
    resolver: {
        extension: {
            type: w.ResolveParser,
            name: "resolveSpritesheet"
        },
        test: i => {
            const e = i.split("?")[0].split("."),
                s = e.pop(),
                r = e.pop();
            return s === "json" && rf.includes(r)
        },
        parse: i => {
            var e;
            const t = i.split(".");
            return {
                resolution: parseFloat(((e = vs.RETINA_PREFIX.exec(i)) == null ? void 0 : e[1]) ?? "1"),
                format: t[t.length - 2],
                src: i
            }
        }
    },
    loader: {
        name: "spritesheetLoader",
        id: "spritesheet",
        extension: {
            type: w.LoadParser,
            priority: Ae.Normal,
            name: "spritesheetLoader"
        },
        async testParse(i, t) {
            return Ht.extname(t.src).toLowerCase() === ".json" && !!i.frames
        },
        async parse(i, t, e) {
            var u, d;
            const {
                texture: s,
                imageFilename: r,
                textureOptions: n,
                cachePrefix: o
            } = (t == null ? void 0 : t.data) ?? {};
            let a = Ht.dirname(t.src);
            a && a.lastIndexOf("/") !== a.length - 1 && (a += "/");
            let h;
            if (s instanceof O) h = s;
            else {
                const f = $r(a + (r ?? i.meta.image), t.src);
                h = (await e.load([{
                    src: f,
                    data: n
                }]))[f]
            }
            const l = new Wo({
                texture: h.source,
                data: i,
                cachePrefix: o
            });
            await l.parse();
            const c = (u = i == null ? void 0 : i.meta) == null ? void 0 : u.related_multi_packs;
            if (Array.isArray(c)) {
                const f = [];
                for (const m of c) {
                    if (typeof m != "string") continue;
                    let g = a + m;
                    (d = t.data) != null && d.ignoreMultiPack || (g = $r(g, t.src), f.push(e.load({
                        src: g,
                        data: {
                            textureOptions: n,
                            ignoreMultiPack: !0
                        }
                    })))
                }
                const p = await Promise.all(f);
                l.linkedSheets = p, p.forEach(m => {
                    m.linkedSheets = [l].concat(l.linkedSheets.filter(g => g !== m))
                })
            }
            return l
        },
        async unload(i, t, e) {
            await e.unload(i.textureSource._sourceOrigin), i.destroy(!1)
        }
    }
};
Y.add(nf);
class rl {
    constructor(t) {
        this._lastTransform = "", this._observer = null, this._tickerAttached = !1, this.updateTranslation = () => {
            if (!this._canvas) return;
            const e = this._canvas.getBoundingClientRect(),
                s = this._canvas.width,
                r = this._canvas.height,
                n = e.width / s * this._renderer.resolution,
                o = e.height / r * this._renderer.resolution,
                a = e.left,
                h = e.top,
                l = `translate(${a}px, ${h}px) scale(${n}, ${o})`;
            l !== this._lastTransform && (this._domElement.style.transform = l, this._lastTransform = l)
        }, this._domElement = t.domElement, this._renderer = t.renderer, !(globalThis.OffscreenCanvas && this._renderer.canvas instanceof OffscreenCanvas) && (this._canvas = this._renderer.canvas, this._attachObserver())
    }
    get canvas() {
        return this._canvas
    }
    ensureAttached() {
        !this._domElement.parentNode && this._canvas.parentNode && (this._canvas.parentNode.appendChild(this._domElement), this.updateTranslation())
    }
    _attachObserver() {
        "ResizeObserver" in globalThis ? (this._observer && (this._observer.disconnect(), this._observer = null), this._observer = new ResizeObserver(t => {
            for (const e of t) {
                if (e.target !== this._canvas) continue;
                const s = this.canvas.width,
                    r = this.canvas.height,
                    n = e.contentRect.width / s * this._renderer.resolution,
                    o = e.contentRect.height / r * this._renderer.resolution;
                (this._lastScaleX !== n || this._lastScaleY !== o) && (this.updateTranslation(), this._lastScaleX = n, this._lastScaleY = o)
            }
        }), this._observer.observe(this._canvas)) : this._tickerAttached || Gt.shared.add(this.updateTranslation, this, ze.HIGH)
    }
    destroy() {
        this._observer ? (this._observer.disconnect(), this._observer = null) : this._tickerAttached && Gt.shared.remove(this.updateTranslation), this._domElement = null, this._renderer = null, this._canvas = null, this._tickerAttached = !1, this._lastTransform = "", this._lastScaleX = null, this._lastScaleY = null
    }
}
class si {
    constructor(t) {
        this.bubbles = !0, this.cancelBubble = !0, this.cancelable = !1, this.composed = !1, this.defaultPrevented = !1, this.eventPhase = si.prototype.NONE, this.propagationStopped = !1, this.propagationImmediatelyStopped = !1, this.layer = new mt, this.page = new mt, this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.manager = t
    }
    get layerX() {
        return this.layer.x
    }
    get layerY() {
        return this.layer.y
    }
    get pageX() {
        return this.page.x
    }
    get pageY() {
        return this.page.y
    }
    get data() {
        return this
    }
    composedPath() {
        return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path
    }
    initEvent(t, e, s) {
        throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")
    }
    initUIEvent(t, e, s, r, n) {
        throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")
    }
    preventDefault() {
        this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = !0
    }
    stopImmediatePropagation() {
        this.propagationImmediatelyStopped = !0
    }
    stopPropagation() {
        this.propagationStopped = !0
    }
}
var or = /iPhone/i,
    Ho = /iPod/i,
    zo = /iPad/i,
    Vo = /\biOS-universal(?:.+)Mac\b/i,
    ar = /\bAndroid(?:.+)Mobile\b/i,
    Xo = /Android/i,
    Qe = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,
    mi = /Silk/i,
    he = /Windows Phone/i,
    Yo = /\bWindows(?:.+)ARM\b/i,
    $o = /BlackBerry/i,
    jo = /BB10/i,
    qo = /Opera Mini/i,
    Ko = /\b(CriOS|Chrome)(?:.+)Mobile/i,
    Zo = /Mobile(?:.+)Firefox\b/i,
    Qo = function(i) {
        return typeof i < "u" && i.platform === "MacIntel" && typeof i.maxTouchPoints == "number" && i.maxTouchPoints > 1 && typeof MSStream > "u"
    };

function of(i) {
    return function(t) {
        return t.test(i)
    }
}

function Jo(i) {
    var t = {
        userAgent: "",
        platform: "",
        maxTouchPoints: 0
    };
    !i && typeof navigator < "u" ? t = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints || 0
    } : typeof i == "string" ? t.userAgent = i : i && i.userAgent && (t = {
        userAgent: i.userAgent,
        platform: i.platform,
        maxTouchPoints: i.maxTouchPoints || 0
    });
    var e = t.userAgent,
        s = e.split("[FBAN");
    typeof s[1] < "u" && (e = s[0]), s = e.split("Twitter"), typeof s[1] < "u" && (e = s[0]);
    var r = of(e),
        n = {
            apple: {
                phone: r(or) && !r(he),
                ipod: r(Ho),
                tablet: !r(or) && (r(zo) || Qo(t)) && !r(he),
                universal: r(Vo),
                device: (r(or) || r(Ho) || r(zo) || r(Vo) || Qo(t)) && !r(he)
            },
            amazon: {
                phone: r(Qe),
                tablet: !r(Qe) && r(mi),
                device: r(Qe) || r(mi)
            },
            android: {
                phone: !r(he) && r(Qe) || !r(he) && r(ar),
                tablet: !r(he) && !r(Qe) && !r(ar) && (r(mi) || r(Xo)),
                device: !r(he) && (r(Qe) || r(mi) || r(ar) || r(Xo)) || r(/\bokhttp\b/i)
            },
            windows: {
                phone: r(he),
                tablet: r(Yo),
                device: r(he) || r(Yo)
            },
            other: {
                blackberry: r($o),
                blackberry10: r(jo),
                opera: r(qo),
                firefox: r(Zo),
                chrome: r(Ko),
                device: r($o) || r(jo) || r(qo) || r(Zo) || r(Ko)
            },
            any: !1,
            phone: !1,
            tablet: !1
        };
    return n.any = n.apple.device || n.android.device || n.windows.device || n.other.device, n.phone = n.apple.phone || n.android.phone || n.windows.phone, n.tablet = n.apple.tablet || n.android.tablet || n.windows.tablet, n
}
const af = Jo.default ?? Jo,
    hf = af(globalThis.navigator),
    lf = 9,
    ta = 100,
    cf = 0,
    uf = 0,
    ea = 2,
    sa = 1,
    df = -1e3,
    ff = -1e3,
    pf = 2,
    wn = class nl {
        constructor(t, e = hf) {
            this._mobileInfo = e, this.debug = !1, this._activateOnTab = !0, this._deactivateOnMouseMove = !0, this._isActive = !1, this._isMobileAccessibility = !1, this._div = null, this._pools = {}, this._renderId = 0, this._children = [], this._androidUpdateCount = 0, this._androidUpdateFrequency = 500, this._isRunningTests = !1, this._boundOnKeyDown = this._onKeyDown.bind(this), this._boundOnMouseMove = this._onMouseMove.bind(this), this._hookDiv = null, (e.tablet || e.phone) && this._createTouchHook(), this._renderer = t
        }
        get isActive() {
            return this._isActive
        }
        get isMobileAccessibility() {
            return this._isMobileAccessibility
        }
        get hookDiv() {
            return this._hookDiv
        }
        get div() {
            return this._div
        }
        _createTouchHook() {
            const t = document.createElement("button");
            t.style.width = `${sa}px`, t.style.height = `${sa}px`, t.style.position = "absolute", t.style.top = `${df}px`, t.style.left = `${ff}px`, t.style.zIndex = pf.toString(), t.style.backgroundColor = "#FF0000", t.title = "select to enable accessibility for this content", t.addEventListener("focus", () => {
                this._isMobileAccessibility = !0, this._activate(), this._destroyTouchHook()
            }), document.body.appendChild(t), this._hookDiv = t
        }
        _destroyTouchHook() {
            this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null)
        }
        _activate() {
            if (this._isActive) return;
            this._isActive = !0, this._div || (this._div = document.createElement("div"), this._div.style.position = "absolute", this._div.style.top = `${cf}px`, this._div.style.left = `${uf}px`, this._div.style.pointerEvents = "none", this._div.style.zIndex = ea.toString(), this._canvasObserver = new rl({
                domElement: this._div,
                renderer: this._renderer
            })), this._activateOnTab && globalThis.addEventListener("keydown", this._boundOnKeyDown, !1), this._deactivateOnMouseMove && globalThis.document.addEventListener("mousemove", this._boundOnMouseMove, !0);
            const t = this._renderer.view.canvas;
            if (t.parentNode) this._canvasObserver.ensureAttached(), this._initAccessibilitySetup();
            else {
                const e = new MutationObserver(() => {
                    t.parentNode && (e.disconnect(), this._canvasObserver.ensureAttached(), this._initAccessibilitySetup())
                });
                e.observe(document.body, {
                    childList: !0,
                    subtree: !0
                })
            }
        }
        _initAccessibilitySetup() {
            this._renderer.runners.postrender.add(this), this._renderer.lastObjectRendered && this._updateAccessibleObjects(this._renderer.lastObjectRendered)
        }
        _deactivate() {
            var t, e;
            if (!(!this._isActive || this._isMobileAccessibility)) {
                this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._boundOnMouseMove, !0), this._activateOnTab && globalThis.addEventListener("keydown", this._boundOnKeyDown, !1), this._renderer.runners.postrender.remove(this);
                for (const s of this._children)(t = s._accessibleDiv) != null && t.parentNode && (s._accessibleDiv.parentNode.removeChild(s._accessibleDiv), s._accessibleDiv = null), s._accessibleActive = !1;
                for (const s in this._pools) this._pools[s].forEach(n => {
                    n.parentNode && n.parentNode.removeChild(n)
                }), delete this._pools[s];
                (e = this._div) != null && e.parentNode && this._div.parentNode.removeChild(this._div), this._pools = {}, this._children = []
            }
        }
        _updateAccessibleObjects(t) {
            if (!t.visible || !t.accessibleChildren) return;
            t.accessible && (t._accessibleActive || this._addChild(t), t._renderId = this._renderId);
            const e = t.children;
            if (e)
                for (let s = 0; s < e.length; s++) this._updateAccessibleObjects(e[s])
        }
        init(t) {
            const s = {
                accessibilityOptions: {
                    ...nl.defaultOptions,
                    ...(t == null ? void 0 : t.accessibilityOptions) || {}
                }
            };
            this.debug = s.accessibilityOptions.debug, this._activateOnTab = s.accessibilityOptions.activateOnTab, this._deactivateOnMouseMove = s.accessibilityOptions.deactivateOnMouseMove, s.accessibilityOptions.enabledByDefault && this._activate(), this._renderer.runners.postrender.remove(this)
        }
        postrender() {
            const t = performance.now();
            if (this._mobileInfo.android.device && t < this._androidUpdateCount || (this._androidUpdateCount = t + this._androidUpdateFrequency, (!this._renderer.renderingToScreen || !this._renderer.view.canvas) && !this._isRunningTests)) return;
            const e = new Set;
            if (this._renderer.lastObjectRendered) {
                this._updateAccessibleObjects(this._renderer.lastObjectRendered);
                for (const s of this._children) s._renderId === this._renderId && e.add(this._children.indexOf(s))
            }
            for (let s = this._children.length - 1; s >= 0; s--) {
                const r = this._children[s];
                e.has(s) || (r._accessibleDiv && r._accessibleDiv.parentNode && (r._accessibleDiv.parentNode.removeChild(r._accessibleDiv), this._getPool(r.accessibleType).push(r._accessibleDiv), r._accessibleDiv = null), r._accessibleActive = !1, Wh(this._children, s, 1))
            }
            this._renderer.renderingToScreen && this._canvasObserver.ensureAttached();
            for (let s = 0; s < this._children.length; s++) {
                const r = this._children[s];
                if (!r._accessibleActive || !r._accessibleDiv) continue;
                const n = r._accessibleDiv,
                    o = r.hitArea || r.getBounds().rectangle;
                if (r.hitArea) {
                    const a = r.worldTransform;
                    n.style.left = `${a.tx+o.x*a.a}px`, n.style.top = `${a.ty+o.y*a.d}px`, n.style.width = `${o.width*a.a}px`, n.style.height = `${o.height*a.d}px`
                } else this._capHitArea(o), n.style.left = `${o.x}px`, n.style.top = `${o.y}px`, n.style.width = `${o.width}px`, n.style.height = `${o.height}px`
            }
            this._renderId++
        }
        _updateDebugHTML(t) {
            t.innerHTML = `type: ${t.type}</br> title : ${t.title}</br> tabIndex: ${t.tabIndex}`
        }
        _capHitArea(t) {
            t.x < 0 && (t.width += t.x, t.x = 0), t.y < 0 && (t.height += t.y, t.y = 0);
            const {
                width: e,
                height: s
            } = this._renderer;
            t.x + t.width > e && (t.width = e - t.x), t.y + t.height > s && (t.height = s - t.y)
        }
        _addChild(t) {
            let s = this._getPool(t.accessibleType).pop();
            s ? (s.innerHTML = "", s.removeAttribute("title"), s.removeAttribute("aria-label"), s.tabIndex = 0) : (t.accessibleType === "button" ? s = document.createElement("button") : (s = document.createElement(t.accessibleType), s.style.cssText = `
                        color: transparent;
                        pointer-events: none;
                        padding: 0;
                        margin: 0;
                        border: 0;
                        outline: 0;
                        background: transparent;
                        box-sizing: border-box;
                        user-select: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                    `, t.accessibleText && (s.innerText = t.accessibleText)), s.style.width = `${ta}px`, s.style.height = `${ta}px`, s.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", s.style.position = "absolute", s.style.zIndex = ea.toString(), s.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? s.setAttribute("aria-live", "off") : s.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? s.setAttribute("aria-relevant", "additions") : s.setAttribute("aria-relevant", "text"), s.addEventListener("click", this._onClick.bind(this)), s.addEventListener("focus", this._onFocus.bind(this)), s.addEventListener("focusout", this._onFocusOut.bind(this))), s.style.pointerEvents = t.accessiblePointerEvents, s.type = t.accessibleType, t.accessibleTitle && t.accessibleTitle !== null ? s.title = t.accessibleTitle : (!t.accessibleHint || t.accessibleHint === null) && (s.title = `container ${t.tabIndex}`), t.accessibleHint && t.accessibleHint !== null && s.setAttribute("aria-label", t.accessibleHint), t.interactive ? s.tabIndex = t.tabIndex : s.tabIndex = 0, this.debug && this._updateDebugHTML(s), t._accessibleActive = !0, t._accessibleDiv = s, s.container = t, this._children.push(t), this._div.appendChild(t._accessibleDiv)
        }
        _dispatchEvent(t, e) {
            const {
                container: s
            } = t.target, r = this._renderer.events.rootBoundary, n = Object.assign(new si(r), {
                target: s
            });
            r.rootTarget = this._renderer.lastObjectRendered, e.forEach(o => r.dispatchEvent(n, o))
        }
        _onClick(t) {
            this._dispatchEvent(t, ["click", "pointertap", "tap"])
        }
        _onFocus(t) {
            t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(t, ["mouseover"])
        }
        _onFocusOut(t) {
            t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "polite"), this._dispatchEvent(t, ["mouseout"])
        }
        _onKeyDown(t) {
            t.keyCode !== lf || !this._activateOnTab || this._activate()
        }
        _onMouseMove(t) {
            t.movementX === 0 && t.movementY === 0 || this._deactivate()
        }
        destroy() {
            var t;
            this._deactivate(), this._destroyTouchHook(), (t = this._canvasObserver) == null || t.destroy(), this._canvasObserver = null, this._div = null, this._pools = null, this._children = null, this._renderer = null, this._hookDiv = null, globalThis.removeEventListener("keydown", this._boundOnKeyDown), this._boundOnKeyDown = null, globalThis.document.removeEventListener("mousemove", this._boundOnMouseMove, !0), this._boundOnMouseMove = null
        }
        setAccessibilityEnabled(t) {
            t ? this._activate() : this._deactivate()
        }
        _getPool(t) {
            return this._pools[t] || (this._pools[t] = []), this._pools[t]
        }
    };
wn.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem],
    name: "accessibility"
};
wn.defaultOptions = {
    enabledByDefault: !1,
    debug: !1,
    activateOnTab: !0,
    deactivateOnMouseMove: !0
};
let mf = wn;
const gf = {
        accessible: !1,
        accessibleTitle: null,
        accessibleHint: null,
        tabIndex: 0,
        accessibleType: "button",
        accessibleText: null,
        accessiblePointerEvents: "auto",
        accessibleChildren: !0,
        _accessibleActive: !1,
        _accessibleDiv: null,
        _renderId: -1
    },
    hr = Object.create(null),
    ia = Object.create(null);

function js(i, t) {
    let e = ia[i];
    return e === void 0 && (hr[t] === void 0 && (hr[t] = 1), ia[i] = e = hr[t]++), e
}
let Je;

function ol() {
    return (!Je || Je != null && Je.isContextLost()) && (Je = X.get().createCanvas().getContext("webgl", {})), Je
}
let gi;

function _f() {
    if (!gi) {
        gi = "mediump";
        const i = ol();
        i && i.getShaderPrecisionFormat && (gi = i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision ? "highp" : "mediump")
    }
    return gi
}

function xf(i, t, e) {
    return t ? i : e ? (i = i.replace("out vec4 finalColor;", ""), `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${i}
        `) : `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${i}
        `
}

function yf(i, t, e) {
    const s = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
    if (i.substring(0, 9) !== "precision") {
        let r = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
        return r === "highp" && s !== "highp" && (r = "mediump"), `precision ${r} float;
${i}`
    } else if (s !== "highp" && i.substring(0, 15) === "precision highp") return i.replace("precision highp", "precision mediump");
    return i
}

function bf(i, t) {
    return t ? `#version 300 es
${i}` : i
}
const vf = {},
    wf = {};

function Tf(i, {
    name: t = "pixi-program"
}, e = !0) {
    t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
    const s = e ? vf : wf;
    return s[t] ? (s[t]++, t += `-${s[t]}`) : s[t] = 1, i.indexOf("#define SHADER_NAME") !== -1 ? i : `${`#define SHADER_NAME ${t}`}
${i}`
}

function Sf(i, t) {
    return t ? i.replace("#version 300 es", "") : i
}
const lr = {
        stripVersion: Sf,
        ensurePrecision: yf,
        addProgramDefines: xf,
        setProgramName: Tf,
        insertVersion: bf
    },
    As = Object.create(null),
    al = class jr {
        constructor(t) {
            t = {
                ...jr.defaultOptions,
                ...t
            };
            const e = t.fragment.indexOf("#version 300 es") !== -1,
                s = {
                    stripVersion: e,
                    ensurePrecision: {
                        requestedFragmentPrecision: t.preferredFragmentPrecision,
                        requestedVertexPrecision: t.preferredVertexPrecision,
                        maxSupportedVertexPrecision: "highp",
                        maxSupportedFragmentPrecision: _f()
                    },
                    setProgramName: {
                        name: t.name
                    },
                    addProgramDefines: e,
                    insertVersion: e
                };
            let r = t.fragment,
                n = t.vertex;
            Object.keys(lr).forEach(o => {
                const a = s[o];
                r = lr[o](r, a, !0), n = lr[o](n, a, !1)
            }), this.fragment = r, this.vertex = n, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = js(`${this.vertex}:${this.fragment}`, "gl-program")
        }
        destroy() {
            this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null, As[this._cacheKey] = null
        }
        static from(t) {
            const e = `${t.vertex}:${t.fragment}`;
            return As[e] || (As[e] = new jr(t), As[e]._cacheKey = e), As[e]
        }
    };
al.defaultOptions = {
    preferredVertexPrecision: "highp",
    preferredFragmentPrecision: "mediump"
};
let $e = al;
const ra = {
    uint8x2: {
        size: 2,
        stride: 2,
        normalised: !1
    },
    uint8x4: {
        size: 4,
        stride: 4,
        normalised: !1
    },
    sint8x2: {
        size: 2,
        stride: 2,
        normalised: !1
    },
    sint8x4: {
        size: 4,
        stride: 4,
        normalised: !1
    },
    unorm8x2: {
        size: 2,
        stride: 2,
        normalised: !0
    },
    unorm8x4: {
        size: 4,
        stride: 4,
        normalised: !0
    },
    snorm8x2: {
        size: 2,
        stride: 2,
        normalised: !0
    },
    snorm8x4: {
        size: 4,
        stride: 4,
        normalised: !0
    },
    uint16x2: {
        size: 2,
        stride: 4,
        normalised: !1
    },
    uint16x4: {
        size: 4,
        stride: 8,
        normalised: !1
    },
    sint16x2: {
        size: 2,
        stride: 4,
        normalised: !1
    },
    sint16x4: {
        size: 4,
        stride: 8,
        normalised: !1
    },
    unorm16x2: {
        size: 2,
        stride: 4,
        normalised: !0
    },
    unorm16x4: {
        size: 4,
        stride: 8,
        normalised: !0
    },
    snorm16x2: {
        size: 2,
        stride: 4,
        normalised: !0
    },
    snorm16x4: {
        size: 4,
        stride: 8,
        normalised: !0
    },
    float16x2: {
        size: 2,
        stride: 4,
        normalised: !1
    },
    float16x4: {
        size: 4,
        stride: 8,
        normalised: !1
    },
    float32: {
        size: 1,
        stride: 4,
        normalised: !1
    },
    float32x2: {
        size: 2,
        stride: 8,
        normalised: !1
    },
    float32x3: {
        size: 3,
        stride: 12,
        normalised: !1
    },
    float32x4: {
        size: 4,
        stride: 16,
        normalised: !1
    },
    uint32: {
        size: 1,
        stride: 4,
        normalised: !1
    },
    uint32x2: {
        size: 2,
        stride: 8,
        normalised: !1
    },
    uint32x3: {
        size: 3,
        stride: 12,
        normalised: !1
    },
    uint32x4: {
        size: 4,
        stride: 16,
        normalised: !1
    },
    sint32: {
        size: 1,
        stride: 4,
        normalised: !1
    },
    sint32x2: {
        size: 2,
        stride: 8,
        normalised: !1
    },
    sint32x3: {
        size: 3,
        stride: 12,
        normalised: !1
    },
    sint32x4: {
        size: 4,
        stride: 16,
        normalised: !1
    }
};

function qs(i) {
    return ra[i] ?? ra.float32
}
const Cf = {
        f32: "float32",
        "vec2<f32>": "float32x2",
        "vec3<f32>": "float32x3",
        "vec4<f32>": "float32x4",
        vec2f: "float32x2",
        vec3f: "float32x3",
        vec4f: "float32x4",
        i32: "sint32",
        "vec2<i32>": "sint32x2",
        "vec3<i32>": "sint32x3",
        "vec4<i32>": "sint32x4",
        vec2i: "sint32x2",
        vec3i: "sint32x3",
        vec4i: "sint32x4",
        u32: "uint32",
        "vec2<u32>": "uint32x2",
        "vec3<u32>": "uint32x3",
        "vec4<u32>": "uint32x4",
        vec2u: "uint32x2",
        vec3u: "uint32x3",
        vec4u: "uint32x4",
        bool: "uint32",
        "vec2<bool>": "uint32x2",
        "vec3<bool>": "uint32x3",
        "vec4<bool>": "uint32x4"
    },
    na = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|\)|$)/g;

function oa(i, t) {
    let e;
    for (;
        (e = na.exec(i)) !== null;) {
        const s = Cf[e[3]] ?? "float32";
        t[e[2]] = {
            location: parseInt(e[1], 10),
            format: s,
            stride: qs(s).stride,
            offset: 0,
            instance: !1,
            start: 0
        }
    }
    na.lastIndex = 0
}

function Af(i) {
    return i.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
}

function Pf({
    source: i,
    entryPoint: t
}) {
    const e = {},
        s = Af(i),
        r = s.indexOf(`fn ${t}(`);
    if (r === -1) return e;
    const n = s.indexOf("->", r);
    if (n === -1) return e;
    const o = s.substring(r, n);
    if (oa(o, e), Object.keys(e).length === 0) {
        const a = o.match(/\(\s*\w+\s*:\s*(\w+)/);
        if (a) {
            const h = a[1],
                l = new RegExp(`struct\\s+${h}\\s*\\{([^}]+)\\}`, "s"),
                c = s.match(l);
            c && oa(c[1], e)
        }
    }
    return e
}

function cr(i) {
    var u, d;
    const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g,
        e = /@group\((\d+)\)/,
        s = /@binding\((\d+)\)/,
        r = /var(<[^>]+>)? (\w+)/,
        n = /:\s*([\w<>]+)/,
        o = /struct\s+(\w+)\s*{([^}]+)}/g,
        a = /(\w+)\s*:\s*([\w\<\>]+)/g,
        h = /struct\s+(\w+)/,
        l = (u = i.match(t)) == null ? void 0 : u.map(f => ({
            group: parseInt(f.match(e)[1], 10),
            binding: parseInt(f.match(s)[1], 10),
            name: f.match(r)[2],
            isUniform: f.match(r)[1] === "<uniform>",
            type: f.match(n)[1]
        }));
    if (!l) return {
        groups: [],
        structs: []
    };
    const c = ((d = i.match(o)) == null ? void 0 : d.map(f => {
        const p = f.match(h)[1],
            m = f.match(a).reduce((g, _) => {
                const [x, b] = _.split(":");
                return g[x.trim()] = b.trim(), g
            }, {});
        return m ? {
            name: p,
            members: m
        } : null
    }).filter(({
        name: f
    }) => l.some(p => p.type === f || p.type.includes(`<${f}>`)))) ?? [];
    return {
        groups: l,
        structs: c
    }
}
var Le = (i => (i[i.VERTEX = 1] = "VERTEX", i[i.FRAGMENT = 2] = "FRAGMENT", i[i.COMPUTE = 4] = "COMPUTE", i))(Le || {});

function Ef({
    groups: i
}) {
    const t = [];
    for (let e = 0; e < i.length; e++) {
        const s = i[e];
        t[s.group] || (t[s.group] = []), s.isUniform ? t[s.group].push({
            binding: s.binding,
            visibility: Le.VERTEX | Le.FRAGMENT,
            buffer: {
                type: "uniform"
            }
        }) : s.type === "sampler" ? t[s.group].push({
            binding: s.binding,
            visibility: Le.FRAGMENT,
            sampler: {
                type: "filtering"
            }
        }) : s.type === "texture_2d" || s.type.startsWith("texture_2d<") ? t[s.group].push({
            binding: s.binding,
            visibility: Le.FRAGMENT,
            texture: {
                sampleType: "float",
                viewDimension: "2d",
                multisampled: !1
            }
        }) : s.type === "texture_2d_array" || s.type.startsWith("texture_2d_array<") ? t[s.group].push({
            binding: s.binding,
            visibility: Le.FRAGMENT,
            texture: {
                sampleType: "float",
                viewDimension: "2d-array",
                multisampled: !1
            }
        }) : (s.type === "texture_cube" || s.type.startsWith("texture_cube<")) && t[s.group].push({
            binding: s.binding,
            visibility: Le.FRAGMENT,
            texture: {
                sampleType: "float",
                viewDimension: "cube",
                multisampled: !1
            }
        })
    }
    for (let e = 0; e < t.length; e++) t[e] || (t[e] = []);
    return t
}

function Mf({
    groups: i
}) {
    const t = [];
    for (let e = 0; e < i.length; e++) {
        const s = i[e];
        t[s.group] || (t[s.group] = {}), t[s.group][s.name] = s.binding
    }
    return t
}

function kf(i, t) {
    const e = new Set,
        s = new Set,
        r = [...i.structs, ...t.structs].filter(o => e.has(o.name) ? !1 : (e.add(o.name), !0)),
        n = [...i.groups, ...t.groups].filter(o => {
            const a = `${o.name}-${o.binding}`;
            return s.has(a) ? !1 : (s.add(a), !0)
        });
    return {
        structs: r,
        groups: n
    }
}
const Ps = Object.create(null);
class Pe {
    constructor(t) {
        var a, h;
        this._layoutKey = 0, this._attributeLocationsKey = 0;
        const {
            fragment: e,
            vertex: s,
            layout: r,
            gpuLayout: n,
            name: o
        } = t;
        if (this.name = o, this.fragment = e, this.vertex = s, e.source === s.source) {
            const l = cr(e.source);
            this.structsAndGroups = l
        } else {
            const l = cr(s.source),
                c = cr(e.source);
            this.structsAndGroups = kf(l, c)
        }
        this.layout = r ?? Mf(this.structsAndGroups), this.gpuLayout = n ?? Ef(this.structsAndGroups), this.autoAssignGlobalUniforms = ((a = this.layout[0]) == null ? void 0 : a.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((h = this.layout[1]) == null ? void 0 : h.localUniforms) !== void 0, this._generateProgramKey()
    }
    _generateProgramKey() {
        const {
            vertex: t,
            fragment: e
        } = this, s = t.source + e.source + t.entryPoint + e.entryPoint;
        this._layoutKey = js(s, "program")
    }
    get attributeData() {
        return this._attributeData ?? (this._attributeData = Pf(this.vertex)), this._attributeData
    }
    destroy() {
        this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null, Ps[this._cacheKey] = null
    }
    static from(t) {
        const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
        return Ps[e] || (Ps[e] = new Pe(t), Ps[e]._cacheKey = e), Ps[e]
    }
}
const hl = ["f32", "i32", "vec2<f32>", "vec3<f32>", "vec4<f32>", "mat2x2<f32>", "mat3x3<f32>", "mat4x4<f32>", "mat3x2<f32>", "mat4x2<f32>", "mat2x3<f32>", "mat4x3<f32>", "mat2x4<f32>", "mat3x4<f32>", "vec2<i32>", "vec3<i32>", "vec4<i32>"],
    Rf = hl.reduce((i, t) => (i[t] = !0, i), {});

function Bf(i, t) {
    switch (i) {
        case "f32":
            return 0;
        case "vec2<f32>":
            return new Float32Array(2 * t);
        case "vec3<f32>":
            return new Float32Array(3 * t);
        case "vec4<f32>":
            return new Float32Array(4 * t);
        case "mat2x2<f32>":
            return new Float32Array([1, 0, 0, 1]);
        case "mat3x3<f32>":
            return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        case "mat4x4<f32>":
            return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    }
    return null
}
const ll = class cl {
    constructor(t, e) {
        this._touched = 0, this.uid = pt("uniform"), this._resourceType = "uniformGroup", this._resourceId = pt("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = {
            ...cl.defaultOptions,
            ...e
        }, this.uniformStructures = t;
        const s = {};
        for (const r in t) {
            const n = t[r];
            if (n.name = r, n.size = n.size ?? 1, !Rf[n.type]) {
                const o = n.type.match(/^array<(\w+(?:<\w+>)?),\s*(\d+)>$/);
                if (o) {
                    const [, a, h] = o;
                    throw new Error(`Uniform type ${n.type} is not supported. Use type: '${a}', size: ${h} instead.`)
                }
                throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${hl.join(", ")}`)
            }
            n.value ?? (n.value = Bf(n.type, n.size)), s[r] = n.value
        }
        this.uniforms = s, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = js(Object.keys(s).map(r => `${r}-${t[r].type}`).join("-"), "uniform-group")
    }
    update() {
        this._dirtyId++
    }
};
ll.defaultOptions = {
    ubo: !1,
    isStatic: !1
};
let te = ll;
class Se {
    constructor(t) {
        this.resources = Object.create(null), this._dirty = !0;
        let e = 0;
        for (const s in t) {
            const r = t[s];
            this.setResource(r, e++)
        }
        this._updateKey()
    }
    _updateKey() {
        if (!this._dirty) return;
        this._dirty = !1;
        const t = [];
        let e = 0;
        for (const s in this.resources) t[e++] = this.resources[s]._resourceId;
        this._key = t.join("|")
    }
    setResource(t, e) {
        var r, n;
        const s = this.resources[e];
        t !== s && ((r = s == null ? void 0 : s.off) == null || r.call(s, "change", this.onResourceChange, this), (n = t.on) == null || n.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0)
    }
    getResource(t) {
        return this.resources[t]
    }
    _touch(t, e) {
        const s = this.resources;
        for (const r in s) s[r]._gcLastUsed = t, s[r]._touched = e
    }
    destroy() {
        var e;
        const t = this.resources;
        for (const s in t) {
            const r = t[s];
            (e = r == null ? void 0 : r.off) == null || e.call(r, "change", this.onResourceChange, this)
        }
        this.resources = null
    }
    onResourceChange(t) {
        this._dirty = !0, t.destroyed ? this.destroy() : this._updateKey()
    }
}
var Vt = (i => (i[i.WEBGL = 1] = "WEBGL", i[i.WEBGPU = 2] = "WEBGPU", i[i.CANVAS = 4] = "CANVAS", i[i.BOTH = 3] = "BOTH", i))(Vt || {});
class ge extends Xt {
    constructor(t) {
        super(), this.uid = pt("shader"), this._uniformBindMap = Object.create(null), this._ownedBindGroups = [], this._destroyed = !1;
        let {
            gpuProgram: e,
            glProgram: s,
            groups: r,
            resources: n,
            compatibleRenderers: o,
            groupMap: a
        } = t;
        this.gpuProgram = e, this.glProgram = s, o === void 0 && (o = 0, e && (o |= Vt.WEBGPU), s && (o |= Vt.WEBGL)), this.compatibleRenderers = o;
        const h = {};
        if (!n && !r && (n = {}), n && r) throw new Error("[Shader] Cannot have both resources and groups");
        if (!e && r && !a) throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
        if (!e && r && a)
            for (const l in a)
                for (const c in a[l]) {
                    const u = a[l][c];
                    h[u] = {
                        group: l,
                        binding: c,
                        name: u
                    }
                } else if (e && r && !a) {
                    const l = e.structsAndGroups.groups;
                    a = {}, l.forEach(c => {
                        a[c.group] = a[c.group] || {}, a[c.group][c.binding] = c.name, h[c.name] = c
                    })
                } else if (n) {
            r = {}, a = {}, e && e.structsAndGroups.groups.forEach(u => {
                a[u.group] = a[u.group] || {}, a[u.group][u.binding] = u.name, h[u.name] = u
            });
            let l = 0;
            for (const c in n) h[c] || (r[99] || (r[99] = new Se, this._ownedBindGroups.push(r[99])), h[c] = {
                group: 99,
                binding: l,
                name: c
            }, a[99] = a[99] || {}, a[99][l] = c, l++);
            for (const c in n) {
                const u = c;
                let d = n[c];
                !d.source && !d._resourceType && (d = new te(d));
                const f = h[u];
                f && (r[f.group] || (r[f.group] = new Se, this._ownedBindGroups.push(r[f.group])), r[f.group].setResource(d, f.binding))
            }
        }
        this.groups = r, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(r, h)
    }
    addResource(t, e, s) {
        var r, n;
        (r = this._uniformBindMap)[e] || (r[e] = {}), (n = this._uniformBindMap[e])[s] || (n[s] = t), this.groups[e] || (this.groups[e] = new Se, this._ownedBindGroups.push(this.groups[e]))
    }
    _buildResourceAccessor(t, e) {
        const s = {};
        for (const r in e) {
            const n = e[r];
            Object.defineProperty(s, n.name, {
                get() {
                    return t[n.group].getResource(n.binding)
                },
                set(o) {
                    t[n.group].setResource(o, n.binding)
                }
            })
        }
        return s
    }
    destroy(t = !1) {
        var e, s;
        this._destroyed || (this._destroyed = !0, this.emit("destroy", this), t && ((e = this.gpuProgram) == null || e.destroy(), (s = this.glProgram) == null || s.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach(r => {
            r.destroy()
        }), this._ownedBindGroups = null, this.resources = null, this.groups = null)
    }
    static from(t) {
        const {
            gpu: e,
            gl: s,
            ...r
        } = t;
        let n, o;
        return e && (n = Pe.from(e)), s && (o = $e.from(s)), new ge({
            gpuProgram: n,
            glProgram: o,
            ...r
        })
    }
}
const If = {
        normal: 0,
        add: 1,
        multiply: 2,
        screen: 3,
        overlay: 4,
        erase: 5,
        "normal-npm": 6,
        "add-npm": 7,
        "screen-npm": 8,
        min: 9,
        max: 10
    },
    ur = 0,
    dr = 1,
    fr = 2,
    pr = 3,
    mr = 4,
    gr = 5,
    qr = class ul {
        constructor() {
            this.data = 0, this.blendMode = "normal", this.polygonOffset = 0, this.blend = !0, this.depthMask = !0
        }
        get blend() {
            return !!(this.data & 1 << ur)
        }
        set blend(t) {
            !!(this.data & 1 << ur) !== t && (this.data ^= 1 << ur)
        }
        get offsets() {
            return !!(this.data & 1 << dr)
        }
        set offsets(t) {
            !!(this.data & 1 << dr) !== t && (this.data ^= 1 << dr)
        }
        set cullMode(t) {
            if (t === "none") {
                this.culling = !1;
                return
            }
            this.culling = !0, this.clockwiseFrontFace = t === "front"
        }
        get cullMode() {
            return this.culling ? this.clockwiseFrontFace ? "front" : "back" : "none"
        }
        get culling() {
            return !!(this.data & 1 << fr)
        }
        set culling(t) {
            !!(this.data & 1 << fr) !== t && (this.data ^= 1 << fr)
        }
        get depthTest() {
            return !!(this.data & 1 << pr)
        }
        set depthTest(t) {
            !!(this.data & 1 << pr) !== t && (this.data ^= 1 << pr)
        }
        get depthMask() {
            return !!(this.data & 1 << gr)
        }
        set depthMask(t) {
            !!(this.data & 1 << gr) !== t && (this.data ^= 1 << gr)
        }
        get clockwiseFrontFace() {
            return !!(this.data & 1 << mr)
        }
        set clockwiseFrontFace(t) {
            !!(this.data & 1 << mr) !== t && (this.data ^= 1 << mr)
        }
        get blendMode() {
            return this._blendMode
        }
        set blendMode(t) {
            this.blend = t !== "none", this._blendMode = t, this._blendModeId = If[t] || 0
        }
        get polygonOffset() {
            return this._polygonOffset
        }
        set polygonOffset(t) {
            this.offsets = !!t, this._polygonOffset = t
        }
        toString() {
            return `[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`
        }
        static for2d() {
            const t = new ul;
            return t.depthTest = !1, t.blend = !0, t
        }
    };
qr.default2d = qr.for2d();
let _e = qr;
const dl = class Kr extends ge {
    constructor(t) {
        t = {
            ...Kr.defaultOptions,
            ...t
        }, super(t), this.enabled = !0, this._state = _e.for2d(), this.blendMode = t.blendMode, this.padding = t.padding, typeof t.antialias == "boolean" ? this.antialias = t.antialias ? "on" : "off" : this.antialias = t.antialias, this.resolution = t.resolution, this.blendRequired = t.blendRequired, this.clipToViewport = t.clipToViewport, this.addResource("uTexture", 0, 1), t.blendRequired && this.addResource("uBackTexture", 0, 3)
    }
    apply(t, e, s, r) {
        t.applyFilter(this, e, s, r)
    }
    get blendMode() {
        return this._state.blendMode
    }
    set blendMode(t) {
        this._state.blendMode = t
    }
    static from(t) {
        const {
            gpu: e,
            gl: s,
            ...r
        } = t;
        let n, o;
        return e && (n = Pe.from(e)), s && (o = $e.from(s)), new Kr({
            gpuProgram: n,
            glProgram: o,
            ...r
        })
    }
};
dl.defaultOptions = {
    blendMode: "normal",
    resolution: 1,
    padding: 0,
    antialias: "off",
    blendRequired: !1,
    clipToViewport: !0
};
let ii = dl;
const Zr = [];
Y.handleByNamedList(w.Environment, Zr);
async function Gf(i) {
    if (!i)
        for (let t = 0; t < Zr.length; t++) {
            const e = Zr[t];
            if (e.value.test()) {
                await e.value.load();
                return
            }
        }
}
let Es;

function fl() {
    if (typeof Es == "boolean") return Es;
    try {
        Es = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({
            a: "b"
        }, "a", "b") === !0
    } catch {
        Es = !1
    }
    return Es
}

function aa(i, t, e = 2) {
    const s = t && t.length,
        r = s ? t[0] * e : i.length;
    let n = pl(i, 0, r, e, !0);
    const o = [];
    if (!n || n.next === n.prev) return o;
    let a, h, l;
    if (s && (n = Uf(i, t, n, e)), i.length > 80 * e) {
        a = i[0], h = i[1];
        let c = a,
            u = h;
        for (let d = e; d < r; d += e) {
            const f = i[d],
                p = i[d + 1];
            f < a && (a = f), p < h && (h = p), f > c && (c = f), p > u && (u = p)
        }
        l = Math.max(c - a, u - h), l = l !== 0 ? 32767 / l : 0
    }
    return Ks(n, o, e, a, h, l, 0), o
}

function pl(i, t, e, s, r) {
    let n;
    if (r === Kf(i, t, e, s) > 0)
        for (let o = t; o < e; o += s) n = ha(o / s | 0, i[o], i[o + 1], n);
    else
        for (let o = e - s; o >= t; o -= s) n = ha(o / s | 0, i[o], i[o + 1], n);
    return n && xs(n, n.next) && (Qs(n), n = n.next), n
}

function Ve(i, t) {
    if (!i) return i;
    t || (t = i);
    let e = i,
        s;
    do
        if (s = !1, !e.steiner && (xs(e, e.next) || _t(e.prev, e, e.next) === 0)) {
            if (Qs(e), e = t = e.prev, e === e.next) break;
            s = !0
        } else e = e.next; while (s || e !== t);
    return t
}

function Ks(i, t, e, s, r, n, o) {
    if (!i) return;
    !o && n && Vf(i, s, r, n);
    let a = i;
    for (; i.prev !== i.next;) {
        const h = i.prev,
            l = i.next;
        if (n ? Of(i, s, r, n) : Ff(i)) {
            t.push(h.i, i.i, l.i), Qs(i), i = l.next, a = l.next;
            continue
        }
        if (i = l, i === a) {
            o ? o === 1 ? (i = Lf(Ve(i), t), Ks(i, t, e, s, r, n, 2)) : o === 2 && Df(i, t, e, s, r, n) : Ks(Ve(i), t, e, s, r, n, 1);
            break
        }
    }
}

function Ff(i) {
    const t = i.prev,
        e = i,
        s = i.next;
    if (_t(t, e, s) >= 0) return !1;
    const r = t.x,
        n = e.x,
        o = s.x,
        a = t.y,
        h = e.y,
        l = s.y,
        c = Math.min(r, n, o),
        u = Math.min(a, h, l),
        d = Math.max(r, n, o),
        f = Math.max(a, h, l);
    let p = s.next;
    for (; p !== t;) {
        if (p.x >= c && p.x <= d && p.y >= u && p.y <= f && Ds(r, a, n, h, o, l, p.x, p.y) && _t(p.prev, p, p.next) >= 0) return !1;
        p = p.next
    }
    return !0
}

function Of(i, t, e, s) {
    const r = i.prev,
        n = i,
        o = i.next;
    if (_t(r, n, o) >= 0) return !1;
    const a = r.x,
        h = n.x,
        l = o.x,
        c = r.y,
        u = n.y,
        d = o.y,
        f = Math.min(a, h, l),
        p = Math.min(c, u, d),
        m = Math.max(a, h, l),
        g = Math.max(c, u, d),
        _ = Qr(f, p, t, e, s),
        x = Qr(m, g, t, e, s);
    let b = i.prevZ,
        y = i.nextZ;
    for (; b && b.z >= _ && y && y.z <= x;) {
        if (b.x >= f && b.x <= m && b.y >= p && b.y <= g && b !== r && b !== o && Ds(a, c, h, u, l, d, b.x, b.y) && _t(b.prev, b, b.next) >= 0 || (b = b.prevZ, y.x >= f && y.x <= m && y.y >= p && y.y <= g && y !== r && y !== o && Ds(a, c, h, u, l, d, y.x, y.y) && _t(y.prev, y, y.next) >= 0)) return !1;
        y = y.nextZ
    }
    for (; b && b.z >= _;) {
        if (b.x >= f && b.x <= m && b.y >= p && b.y <= g && b !== r && b !== o && Ds(a, c, h, u, l, d, b.x, b.y) && _t(b.prev, b, b.next) >= 0) return !1;
        b = b.prevZ
    }
    for (; y && y.z <= x;) {
        if (y.x >= f && y.x <= m && y.y >= p && y.y <= g && y !== r && y !== o && Ds(a, c, h, u, l, d, y.x, y.y) && _t(y.prev, y, y.next) >= 0) return !1;
        y = y.nextZ
    }
    return !0
}

function Lf(i, t) {
    let e = i;
    do {
        const s = e.prev,
            r = e.next.next;
        !xs(s, r) && gl(s, e, e.next, r) && Zs(s, r) && Zs(r, s) && (t.push(s.i, e.i, r.i), Qs(e), Qs(e.next), e = i = r), e = e.next
    } while (e !== i);
    return Ve(e)
}

function Df(i, t, e, s, r, n) {
    let o = i;
    do {
        let a = o.next.next;
        for (; a !== o.prev;) {
            if (o.i !== a.i && $f(o, a)) {
                let h = _l(o, a);
                o = Ve(o, o.next), h = Ve(h, h.next), Ks(o, t, e, s, r, n, 0), Ks(h, t, e, s, r, n, 0);
                return
            }
            a = a.next
        }
        o = o.next
    } while (o !== i)
}

function Uf(i, t, e, s) {
    const r = [];
    for (let n = 0, o = t.length; n < o; n++) {
        const a = t[n] * s,
            h = n < o - 1 ? t[n + 1] * s : i.length,
            l = pl(i, a, h, s, !1);
        l === l.next && (l.steiner = !0), r.push(Yf(l))
    }
    r.sort(Nf);
    for (let n = 0; n < r.length; n++) e = Wf(r[n], e);
    return e
}

function Nf(i, t) {
    let e = i.x - t.x;
    if (e === 0 && (e = i.y - t.y, e === 0)) {
        const s = (i.next.y - i.y) / (i.next.x - i.x),
            r = (t.next.y - t.y) / (t.next.x - t.x);
        e = s - r
    }
    return e
}

function Wf(i, t) {
    const e = Hf(i, t);
    if (!e) return t;
    const s = _l(e, i);
    return Ve(s, s.next), Ve(e, e.next)
}

function Hf(i, t) {
    let e = t;
    const s = i.x,
        r = i.y;
    let n = -1 / 0,
        o;
    if (xs(i, e)) return e;
    do {
        if (xs(i, e.next)) return e.next;
        if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
            const u = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
            if (u <= s && u > n && (n = u, o = e.x < e.next.x ? e : e.next, u === s)) return o
        }
        e = e.next
    } while (e !== t);
    if (!o) return null;
    const a = o,
        h = o.x,
        l = o.y;
    let c = 1 / 0;
    e = o;
    do {
        if (s >= e.x && e.x >= h && s !== e.x && ml(r < l ? s : n, r, h, l, r < l ? n : s, r, e.x, e.y)) {
            const u = Math.abs(r - e.y) / (s - e.x);
            Zs(e, i) && (u < c || u === c && (e.x > o.x || e.x === o.x && zf(o, e))) && (o = e, c = u)
        }
        e = e.next
    } while (e !== a);
    return o
}

function zf(i, t) {
    return _t(i.prev, i, t.prev) < 0 && _t(t.next, i, i.next) < 0
}

function Vf(i, t, e, s) {
    let r = i;
    do r.z === 0 && (r.z = Qr(r.x, r.y, t, e, s)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next; while (r !== i);
    r.prevZ.nextZ = null, r.prevZ = null, Xf(r)
}

function Xf(i) {
    let t, e = 1;
    do {
        let s = i,
            r;
        i = null;
        let n = null;
        for (t = 0; s;) {
            t++;
            let o = s,
                a = 0;
            for (let l = 0; l < e && (a++, o = o.nextZ, !!o); l++);
            let h = e;
            for (; a > 0 || h > 0 && o;) a !== 0 && (h === 0 || !o || s.z <= o.z) ? (r = s, s = s.nextZ, a--) : (r = o, o = o.nextZ, h--), n ? n.nextZ = r : i = r, r.prevZ = n, n = r;
            s = o
        }
        n.nextZ = null, e *= 2
    } while (t > 1);
    return i
}

function Qr(i, t, e, s, r) {
    return i = (i - e) * r | 0, t = (t - s) * r | 0, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i | t << 1
}

function Yf(i) {
    let t = i,
        e = i;
    do(t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next; while (t !== i);
    return e
}

function ml(i, t, e, s, r, n, o, a) {
    return (r - o) * (t - a) >= (i - o) * (n - a) && (i - o) * (s - a) >= (e - o) * (t - a) && (e - o) * (n - a) >= (r - o) * (s - a)
}

function Ds(i, t, e, s, r, n, o, a) {
    return !(i === o && t === a) && ml(i, t, e, s, r, n, o, a)
}

function $f(i, t) {
    return i.next.i !== t.i && i.prev.i !== t.i && !jf(i, t) && (Zs(i, t) && Zs(t, i) && qf(i, t) && (_t(i.prev, i, t.prev) || _t(i, t.prev, t)) || xs(i, t) && _t(i.prev, i, i.next) > 0 && _t(t.prev, t, t.next) > 0)
}

function _t(i, t, e) {
    return (t.y - i.y) * (e.x - t.x) - (t.x - i.x) * (e.y - t.y)
}

function xs(i, t) {
    return i.x === t.x && i.y === t.y
}

function gl(i, t, e, s) {
    const r = xi(_t(i, t, e)),
        n = xi(_t(i, t, s)),
        o = xi(_t(e, s, i)),
        a = xi(_t(e, s, t));
    return !!(r !== n && o !== a || r === 0 && _i(i, e, t) || n === 0 && _i(i, s, t) || o === 0 && _i(e, i, s) || a === 0 && _i(e, t, s))
}

function _i(i, t, e) {
    return t.x <= Math.max(i.x, e.x) && t.x >= Math.min(i.x, e.x) && t.y <= Math.max(i.y, e.y) && t.y >= Math.min(i.y, e.y)
}

function xi(i) {
    return i > 0 ? 1 : i < 0 ? -1 : 0
}

function jf(i, t) {
    let e = i;
    do {
        if (e.i !== i.i && e.next.i !== i.i && e.i !== t.i && e.next.i !== t.i && gl(e, e.next, i, t)) return !0;
        e = e.next
    } while (e !== i);
    return !1
}

function Zs(i, t) {
    return _t(i.prev, i, i.next) < 0 ? _t(i, t, i.next) >= 0 && _t(i, i.prev, t) >= 0 : _t(i, t, i.prev) < 0 || _t(i, i.next, t) < 0
}

function qf(i, t) {
    let e = i,
        s = !1;
    const r = (i.x + t.x) / 2,
        n = (i.y + t.y) / 2;
    do e.y > n != e.next.y > n && e.next.y !== e.y && r < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (s = !s), e = e.next; while (e !== i);
    return s
}

function _l(i, t) {
    const e = Jr(i.i, i.x, i.y),
        s = Jr(t.i, t.x, t.y),
        r = i.next,
        n = t.prev;
    return i.next = t, t.prev = i, e.next = r, r.prev = e, s.next = e, e.prev = s, n.next = s, s.prev = n, s
}

function ha(i, t, e, s) {
    const r = Jr(i, t, e);
    return s ? (r.next = s.next, r.prev = s, s.next.prev = r, s.next = r) : (r.prev = r, r.next = r), r
}

function Qs(i) {
    i.next.prev = i.prev, i.prev.next = i.next, i.prevZ && (i.prevZ.nextZ = i.nextZ), i.nextZ && (i.nextZ.prevZ = i.prevZ)
}

function Jr(i, t, e) {
    return {
        i,
        x: t,
        y: e,
        prev: null,
        next: null,
        z: 0,
        prevZ: null,
        nextZ: null,
        steiner: !1
    }
}

function Kf(i, t, e, s) {
    let r = 0;
    for (let n = t, o = e - s; n < e; n += s) r += (i[o] - i[n]) * (i[n + 1] + i[o + 1]), o = n;
    return r
}
const Zf = aa.default || aa;
var Nt = (i => (i[i.NONE = 0] = "NONE", i[i.COLOR = 16384] = "COLOR", i[i.STENCIL = 1024] = "STENCIL", i[i.DEPTH = 256] = "DEPTH", i[i.COLOR_DEPTH = 16640] = "COLOR_DEPTH", i[i.COLOR_STENCIL = 17408] = "COLOR_STENCIL", i[i.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", i[i.ALL = 17664] = "ALL", i))(Nt || {});
class xl {
    constructor(t) {
        this.items = [], this._name = t
    }
    emit(t, e, s, r, n, o, a, h) {
        const {
            name: l,
            items: c
        } = this;
        for (let u = 0, d = c.length; u < d; u++) c[u][l](t, e, s, r, n, o, a, h);
        return this
    }
    add(t) {
        return t[this._name] && (this.remove(t), this.items.push(t)), this
    }
    remove(t) {
        const e = this.items.indexOf(t);
        return e !== -1 && this.items.splice(e, 1), this
    }
    contains(t) {
        return this.items.indexOf(t) !== -1
    }
    removeAll() {
        return this.items.length = 0, this
    }
    destroy() {
        this.removeAll(), this.items = null, this._name = null
    }
    get empty() {
        return this.items.length === 0
    }
    get name() {
        return this._name
    }
}
const Qf = ["init", "destroy", "contextChange", "resolutionChange", "resetState", "renderEnd", "renderStart", "render", "update", "postrender", "prerender"],
    yl = class bl extends Xt {
        constructor(t) {
            super(), this.tick = 0, this.uid = pt("renderer"), this.runners = Object.create(null), this.renderPipes = Object.create(null), this._initOptions = {}, this._systemsHash = Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
            const e = [...Qf, ...this.config.runners ?? []];
            this._addRunners(...e), this._unsafeEvalCheck()
        }
        async init(t = {}) {
            const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
            await Gf(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
            for (const s in this._systemsHash) t = {
                ...this._systemsHash[s].constructor.defaultOptions,
                ...t
            };
            t = {
                ...bl.defaultOptions,
                ...t
            }, this._roundPixels = t.roundPixels ? 1 : 0;
            for (let s = 0; s < this.runners.init.items.length; s++) await this.runners.init.items[s].init(t);
            this._initOptions = t
        }
        render(t, e) {
            this.tick++;
            let s = t;
            if (s instanceof D && (s = {
                    container: s
                }, e && (U(at, "passing a second argument is deprecated, please use render options instead"), s.target = e.renderTexture)), s.target || (s.target = this.view.renderTarget), s.target === this.view.renderTarget && (this._lastObjectRendered = s.container, s.clearColor ?? (s.clearColor = this.background.colorRgba), s.clear ?? (s.clear = this.background.clearBeforeRender)), s.clearColor) {
                const r = Array.isArray(s.clearColor) && s.clearColor.length === 4;
                s.clearColor = r ? s.clearColor : lt.shared.setValue(s.clearColor).toArray()
            }
            s.transform || (s.container.updateLocalTransform(), s.transform = s.container.localTransform), s.container.visible && (s.container.enableRenderGroup(), this.runners.prerender.emit(s), this.runners.renderStart.emit(s), this.runners.render.emit(s), this.runners.renderEnd.emit(s), this.runners.postrender.emit(s))
        }
        resize(t, e, s) {
            const r = this.view.resolution;
            this.view.resize(t, e, s), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), s !== void 0 && s !== r && this.runners.resolutionChange.emit(s)
        }
        clear(t = {}) {
            const e = this;
            t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = Nt.ALL);
            const {
                clear: s,
                clearColor: r,
                target: n,
                mipLevel: o,
                layer: a
            } = t;
            lt.shared.setValue(r ?? this.background.colorRgba), e.renderTarget.clear(n, s, lt.shared.toArray(), o ?? 0, a ?? 0)
        }
        get resolution() {
            return this.view.resolution
        }
        set resolution(t) {
            this.view.resolution = t, this.runners.resolutionChange.emit(t)
        }
        get width() {
            return this.view.texture.frame.width
        }
        get height() {
            return this.view.texture.frame.height
        }
        get canvas() {
            return this.view.canvas
        }
        get lastObjectRendered() {
            return this._lastObjectRendered
        }
        get renderingToScreen() {
            return this.renderTarget.renderingToScreen
        }
        get screen() {
            return this.view.screen
        }
        _addRunners(...t) {
            t.forEach(e => {
                this.runners[e] = new xl(e)
            })
        }
        _addSystems(t) {
            let e;
            for (e in t) {
                const s = t[e];
                this._addSystem(s.value, s.name)
            }
        }
        _addSystem(t, e) {
            const s = new t(this);
            if (this[e]) throw new Error(`Whoops! The name "${e}" is already in use`);
            this[e] = s, this._systemsHash[e] = s;
            for (const r in this.runners) this.runners[r].add(s);
            return this
        }
        _addPipes(t, e) {
            const s = e.reduce((r, n) => (r[n.name] = n.value, r), {});
            t.forEach(r => {
                const n = r.value,
                    o = r.name,
                    a = s[o];
                this.renderPipes[o] = new n(this, a ? new a : null), this.runners.destroy.add(this.renderPipes[o])
            })
        }
        destroy(t = !1) {
            this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), (t === !0 || typeof t == "object" && t.releaseGlobalResources) && bs.release(), Object.values(this.runners).forEach(e => {
                e.destroy()
            }), this._systemsHash = null, this.renderPipes = null, this.removeAllListeners()
        }
        generateTexture(t) {
            return this.textureGenerator.generateTexture(t)
        }
        get roundPixels() {
            return !!this._roundPixels
        }
        _unsafeEvalCheck() {
            if (!fl()) throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")
        }
        resetState() {
            this.runners.resetState.emit()
        }
    };
yl.defaultOptions = {
    resolution: 1,
    failIfMajorPerformanceCaveat: !1,
    roundPixels: !1
};
let ri = yl,
    yi;

function Jf(i) {
    return yi !== void 0 || (yi = (() => {
        var e;
        const t = {
            stencil: !0,
            failIfMajorPerformanceCaveat: i ?? ri.defaultOptions.failIfMajorPerformanceCaveat
        };
        try {
            if (!X.get().getWebGLRenderingContext()) return !1;
            let r = X.get().createCanvas().getContext("webgl", t);
            const n = !!((e = r == null ? void 0 : r.getContextAttributes()) != null && e.stencil);
            if (r) {
                const o = r.getExtension("WEBGL_lose_context");
                o && o.loseContext()
            }
            return r = null, n
        } catch {
            return !1
        }
    })()), yi
}
let bi;
async function tp(i = {}) {
    return bi !== void 0 || (bi = await (async () => {
        const t = X.get().getNavigator().gpu;
        if (!t) return !1;
        try {
            return await (await t.requestAdapter(i)).requestDevice(), !0
        } catch {
            return !1
        }
    })()), bi
}
const la = ["webgl", "webgpu", "canvas"];
async function ep(i) {
    let t = [];
    i.preference ? (t.push(i.preference), la.forEach(n => {
        n !== i.preference && t.push(n)
    })) : t = la.slice();
    let e, s = {};
    for (let n = 0; n < t.length; n++) {
        const o = t[n];
        if (o === "webgpu" && await tp()) {
            const {
                WebGPURenderer: a
            } = await us(async () => {
                const {
                    WebGPURenderer: h
                } = await Promise.resolve().then(() => Qy);
                return {
                    WebGPURenderer: h
                }
            }, void 0, import.meta.url);
            e = a, s = {
                ...i,
                ...i.webgpu
            };
            break
        } else if (o === "webgl" && Jf(i.failIfMajorPerformanceCaveat ?? ri.defaultOptions.failIfMajorPerformanceCaveat)) {
            const {
                WebGLRenderer: a
            } = await us(async () => {
                const {
                    WebGLRenderer: h
                } = await Promise.resolve().then(() => ky);
                return {
                    WebGLRenderer: h
                }
            }, void 0, import.meta.url);
            e = a, s = {
                ...i,
                ...i.webgl
            };
            break
        } else if (o === "canvas") {
            const {
                CanvasRenderer: a
            } = await us(async () => {
                const {
                    CanvasRenderer: h
                } = await Promise.resolve().then(() => Mx);
                return {
                    CanvasRenderer: h
                }
            }, void 0, import.meta.url);
            e = a, s = {
                ...i,
                ...i.canvasOptions
            };
            break
        }
    }
    if (delete s.webgpu, delete s.webgl, delete s.canvasOptions, !e) throw new Error("No available renderer for the current environment");
    const r = new e;
    return await r.init(s), r
}
const Ni = "8.17.1";
class vl {
    static init() {
        var t;
        (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, Ni)
    }
    static destroy() {}
}
vl.extension = w.Application;
class wl {
    constructor(t) {
        this._renderer = t
    }
    init() {
        var t;
        (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, Ni)
    }
    destroy() {
        this._renderer = null
    }
}
wl.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem],
    name: "initHook",
    priority: -10
};
class Tl {
    static init(t) {
        Object.defineProperty(this, "resizeTo", {
            configurable: !0,
            set(e) {
                globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = e, e && (globalThis.addEventListener("resize", this.queueResize), this.resize())
            },
            get() {
                return this._resizeTo
            }
        }), this.queueResize = () => {
            this._resizeTo && (this._cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()))
        }, this._cancelResize = () => {
            this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null)
        }, this.resize = () => {
            if (!this._resizeTo) return;
            this._cancelResize();
            let e, s;
            if (this._resizeTo === globalThis.window) e = globalThis.innerWidth, s = globalThis.innerHeight;
            else {
                const {
                    clientWidth: r,
                    clientHeight: n
                } = this._resizeTo;
                e = r, s = n
            }
            this.renderer.resize(e, s), this.render()
        }, this._resizeId = null, this._resizeTo = null, this.resizeTo = t.resizeTo || null
    }
    static destroy() {
        globalThis.removeEventListener("resize", this.queueResize), this._cancelResize(), this._cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null
    }
}
Tl.extension = w.Application;
class Sl {
    static init(t) {
        t = Object.assign({
            autoStart: !0,
            sharedTicker: !1
        }, t), Object.defineProperty(this, "ticker", {
            configurable: !0,
            set(e) {
                this._ticker && this._ticker.remove(this.render, this), this._ticker = e, e && e.add(this.render, this, ze.LOW)
            },
            get() {
                return this._ticker
            }
        }), this.stop = () => {
            this._ticker.stop()
        }, this.start = () => {
            this._ticker.start()
        }, this._ticker = null, this.ticker = t.sharedTicker ? Gt.shared : new Gt, t.autoStart && this.start()
    }
    static destroy() {
        if (this._ticker) {
            const t = this._ticker;
            this.ticker = null, t.destroy()
        }
    }
}
Sl.extension = w.Application;
Y.add(Tl);
Y.add(Sl);
const Cl = class tn {
    constructor(...t) {
        this.stage = new D, t[0] !== void 0 && U(at, "Application constructor options are deprecated, please use Application.init() instead.")
    }
    async init(t) {
        t = {
            ...t
        }, this.stage || (this.stage = new D), this.renderer = await ep(t), tn._plugins.forEach(e => {
            e.init.call(this, t)
        })
    }
    render() {
        this.renderer.render({
            container: this.stage
        })
    }
    get canvas() {
        return this.renderer.canvas
    }
    get view() {
        return U(at, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas
    }
    get screen() {
        return this.renderer.screen
    }
    destroy(t = !1, e = !1) {
        const s = tn._plugins.slice(0);
        s.reverse(), s.forEach(r => {
            r.destroy.call(this)
        }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null
    }
};
Cl._plugins = [];
let Al = Cl;
Y.handleByList(w.Application, Al._plugins);
Y.add(vl);
const _r = {
        test(i) {
            return typeof i == "string" && i.startsWith("info face=")
        },
        parse(i) {
            const t = i.match(/^[a-z]+\s+.+$/gm),
                e = {
                    info: [],
                    common: [],
                    page: [],
                    char: [],
                    chars: [],
                    kerning: [],
                    kernings: [],
                    distanceField: []
                };
            for (const u in t) {
                const d = t[u].match(/^[a-z]+/gm)[0],
                    f = t[u].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm),
                    p = {};
                for (const m in f) {
                    const g = f[m].split("="),
                        _ = g[0],
                        x = g[1].replace(/"/gm, ""),
                        b = parseFloat(x),
                        y = isNaN(b) ? x : b;
                    p[_] = y
                }
                e[d].push(p)
            }
            const s = {
                    chars: {},
                    pages: [],
                    lineHeight: 0,
                    fontSize: 0,
                    fontFamily: "",
                    distanceField: null,
                    baseLineOffset: 0
                },
                [r] = e.info,
                [n] = e.common,
                [o] = e.distanceField ?? [];
            o && (s.distanceField = {
                range: parseInt(o.distanceRange, 10),
                type: o.fieldType
            }), s.fontSize = parseInt(r.size, 10), s.fontFamily = r.face, s.lineHeight = parseInt(n.lineHeight, 10);
            const a = e.page;
            for (let u = 0; u < a.length; u++) s.pages.push({
                id: parseInt(a[u].id, 10) || 0,
                file: a[u].file
            });
            const h = {};
            s.baseLineOffset = s.lineHeight - parseInt(n.base, 10);
            const l = e.char;
            for (let u = 0; u < l.length; u++) {
                const d = l[u],
                    f = parseInt(d.id, 10);
                let p = d.letter ?? d.char ?? String.fromCharCode(f);
                p === "space" && (p = " "), h[f] = p, s.chars[p] = {
                    id: f,
                    page: parseInt(d.page, 10) || 0,
                    x: parseInt(d.x, 10),
                    y: parseInt(d.y, 10),
                    width: parseInt(d.width, 10),
                    height: parseInt(d.height, 10),
                    xOffset: parseInt(d.xoffset, 10),
                    yOffset: parseInt(d.yoffset, 10),
                    xAdvance: parseInt(d.xadvance, 10),
                    kerning: {}
                }
            }
            const c = e.kerning || [];
            for (let u = 0; u < c.length; u++) {
                const d = parseInt(c[u].first, 10),
                    f = parseInt(c[u].second, 10),
                    p = parseInt(c[u].amount, 10);
                s.chars[h[f]] && (s.chars[h[f]].kerning[h[d]] = p)
            }
            return s
        }
    },
    ca = {
        test(i) {
            const t = i;
            return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null
        },
        parse(i) {
            const t = {
                    chars: {},
                    pages: [],
                    lineHeight: 0,
                    fontSize: 0,
                    fontFamily: "",
                    distanceField: null,
                    baseLineOffset: 0
                },
                e = i.getElementsByTagName("info")[0],
                s = i.getElementsByTagName("common")[0],
                r = i.getElementsByTagName("distanceField")[0];
            r && (t.distanceField = {
                type: r.getAttribute("fieldType"),
                range: parseInt(r.getAttribute("distanceRange"), 10)
            });
            const n = i.getElementsByTagName("page"),
                o = i.getElementsByTagName("char"),
                a = i.getElementsByTagName("kerning");
            t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(s.getAttribute("lineHeight"), 10);
            for (let l = 0; l < n.length; l++) t.pages.push({
                id: parseInt(n[l].getAttribute("id"), 10) || 0,
                file: n[l].getAttribute("file")
            });
            const h = {};
            t.baseLineOffset = t.lineHeight - parseInt(s.getAttribute("base"), 10);
            for (let l = 0; l < o.length; l++) {
                const c = o[l],
                    u = parseInt(c.getAttribute("id"), 10);
                let d = c.getAttribute("letter") ?? c.getAttribute("char") ?? String.fromCharCode(u);
                d === "space" && (d = " "), h[u] = d, t.chars[d] = {
                    id: u,
                    page: parseInt(c.getAttribute("page"), 10) || 0,
                    x: parseInt(c.getAttribute("x"), 10),
                    y: parseInt(c.getAttribute("y"), 10),
                    width: parseInt(c.getAttribute("width"), 10),
                    height: parseInt(c.getAttribute("height"), 10),
                    xOffset: parseInt(c.getAttribute("xoffset"), 10),
                    yOffset: parseInt(c.getAttribute("yoffset"), 10),
                    xAdvance: parseInt(c.getAttribute("xadvance"), 10),
                    kerning: {}
                }
            }
            for (let l = 0; l < a.length; l++) {
                const c = parseInt(a[l].getAttribute("first"), 10),
                    u = parseInt(a[l].getAttribute("second"), 10),
                    d = parseInt(a[l].getAttribute("amount"), 10);
                t.chars[h[u]] && (t.chars[h[u]].kerning[h[c]] = d)
            }
            return t
        }
    },
    ua = {
        test(i) {
            return typeof i == "string" && i.match(/<font(\s|>)/) ? ca.test(X.get().parseXML(i)) : !1
        },
        parse(i) {
            return ca.parse(X.get().parseXML(i))
        }
    },
    sp = [".xml", ".fnt"],
    ip = {
        extension: {
            type: w.CacheParser,
            name: "cacheBitmapFont"
        },
        test: i => !!(i != null && i.pages) && !!(i != null && i.chars) && typeof(i == null ? void 0 : i.fontFamily) == "string" && i.fontFamily !== "",
        getCacheableAssets(i, t) {
            const e = {};
            return i.forEach(s => {
                e[s] = t, e[`${s}-bitmap`] = t
            }), e[`${t.fontFamily}-bitmap`] = t, e
        }
    },
    rp = {
        extension: {
            type: w.LoadParser,
            priority: Ae.Normal
        },
        name: "loadBitmapFont",
        id: "bitmap-font",
        test(i) {
            return sp.includes(Ht.extname(i).toLowerCase())
        },
        async testParse(i) {
            return _r.test(i) || ua.test(i)
        },
        async parse(i, t, e) {
            const s = _r.test(i) ? _r.parse(i) : ua.parse(i),
                {
                    src: r
                } = t,
                {
                    pages: n
                } = s,
                o = [],
                a = s.distanceField ? {
                    scaleMode: "linear",
                    alphaMode: "premultiply-alpha-on-upload",
                    autoGenerateMipmaps: !1,
                    resolution: 1
                } : {};
            for (let d = 0; d < n.length; ++d) {
                const f = n[d].file;
                let p = Ht.join(Ht.dirname(r), f);
                p = $r(p, r), o.push({
                    src: p,
                    data: a
                })
            }
            const [h, {
                BitmapFont: l
            }] = await Promise.all([e.load(o), us(() => Promise.resolve().then(() => tb), void 0, import.meta.url)]), c = o.map(d => h[d.src]);
            return new l({
                data: s,
                textures: c
            }, r)
        },
        async load(i, t) {
            return await (await X.get().fetch(i)).text()
        },
        async unload(i, t, e) {
            await Promise.all(i.pages.map(s => e.unload(s.texture.source._sourceOrigin))), i.destroy()
        }
    };
class np {
    constructor(t, e = !1) {
        this._loader = t, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = e
    }
    add(t) {
        t.forEach(e => {
            this._assetList.push(e)
        }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next()
    }
    async _next() {
        if (this._assetList.length && this._isActive) {
            this._isLoading = !0;
            const t = [],
                e = Math.min(this._assetList.length, this._maxConcurrent);
            for (let s = 0; s < e; s++) t.push(this._assetList.pop());
            await this._loader.load(t), this._isLoading = !1, this._next()
        }
    }
    get active() {
        return this._isActive
    }
    set active(t) {
        this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next())
    }
}
const op = {
    extension: {
        type: w.CacheParser,
        name: "cacheTextureArray"
    },
    test: i => Array.isArray(i) && i.every(t => t instanceof O),
    getCacheableAssets: (i, t) => {
        const e = {};
        return i.forEach(s => {
            t.forEach((r, n) => {
                e[s + (n === 0 ? "" : n + 1)] = r
            })
        }), e
    }
};
async function Pl(i) {
    if ("Image" in globalThis) return new Promise(t => {
        const e = new Image;
        e.onload = () => {
            t(!0)
        }, e.onerror = () => {
            t(!1)
        }, e.src = i
    });
    if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
        try {
            const t = await (await fetch(i)).blob();
            await createImageBitmap(t)
        } catch {
            return !1
        }
        return !0
    }
    return !1
}
const ap = {
        extension: {
            type: w.DetectionParser,
            priority: 1
        },
        test: async () => Pl("data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="),
        add: async i => [...i, "avif"],
        remove: async i => i.filter(t => t !== "avif")
    },
    da = ["png", "jpg", "jpeg"],
    hp = {
        extension: {
            type: w.DetectionParser,
            priority: -1
        },
        test: () => Promise.resolve(!0),
        add: async i => [...i, ...da],
        remove: async i => i.filter(t => !da.includes(t))
    },
    lp = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;

function Yi(i) {
    return lp ? !1 : document.createElement("video").canPlayType(i) !== ""
}
const cp = {
        extension: {
            type: w.DetectionParser,
            priority: 0
        },
        test: async () => Yi("video/mp4"),
        add: async i => [...i, "mp4", "m4v"],
        remove: async i => i.filter(t => t !== "mp4" && t !== "m4v")
    },
    up = {
        extension: {
            type: w.DetectionParser,
            priority: 0
        },
        test: async () => Yi("video/ogg"),
        add: async i => [...i, "ogv"],
        remove: async i => i.filter(t => t !== "ogv")
    },
    dp = {
        extension: {
            type: w.DetectionParser,
            priority: 0
        },
        test: async () => Yi("video/webm"),
        add: async i => [...i, "webm"],
        remove: async i => i.filter(t => t !== "webm")
    },
    fp = {
        extension: {
            type: w.DetectionParser,
            priority: 0
        },
        test: async () => Pl("data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="),
        add: async i => [...i, "webp"],
        remove: async i => i.filter(t => t !== "webp")
    },
    El = class Mi {
        constructor() {
            this.loadOptions = {
                ...Mi.defaultOptions
            }, this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
                set: (t, e, s) => (this._parsersValidated = !1, t[e] = s, !0)
            }), this.promiseCache = {}
        }
        reset() {
            this._parsersValidated = !1, this.promiseCache = {}
        }
        _getLoadPromiseAndParser(t, e) {
            const s = {
                promise: null,
                parser: null
            };
            return s.promise = (async () => {
                var o, a;
                let r = null,
                    n = null;
                if ((e.parser || e.loadParser) && (n = this._parserHash[e.parser || e.loadParser], e.loadParser && V(`[Assets] "loadParser" is deprecated, use "parser" instead for ${t}`), n || V(`[Assets] specified load parser "${e.parser||e.loadParser}" not found while loading ${t}`)), !n) {
                    for (let h = 0; h < this.parsers.length; h++) {
                        const l = this.parsers[h];
                        if (l.load && ((o = l.test) != null && o.call(l, t, e, this))) {
                            n = l;
                            break
                        }
                    }
                    if (!n) return V(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null
                }
                r = await n.load(t, e, this), s.parser = n;
                for (let h = 0; h < this.parsers.length; h++) {
                    const l = this.parsers[h];
                    l.parse && l.parse && await ((a = l.testParse) == null ? void 0 : a.call(l, r, e, this)) && (r = await l.parse(r, e, this) || r, s.parser = l)
                }
                return r
            })(), s
        }
        async load(t, e) {
            this._parsersValidated || this._validateParsers();
            const s = typeof e == "function" ? {
                    ...Mi.defaultOptions,
                    ...this.loadOptions,
                    onProgress: e
                } : {
                    ...Mi.defaultOptions,
                    ...this.loadOptions,
                    ...e || {}
                },
                {
                    onProgress: r,
                    onError: n,
                    strategy: o,
                    retryCount: a,
                    retryDelay: h
                } = s;
            let l = 0;
            const c = {},
                u = Ui(t),
                d = Jt(t, m => ({
                    alias: [m],
                    src: m,
                    data: {}
                })),
                f = d.reduce((m, g) => m + (g.progressSize || 1), 0),
                p = d.map(async m => {
                    const g = Ht.toAbsolute(m.src);
                    c[m.src] || (await this._loadAssetWithRetry(g, m, {
                        onProgress: r,
                        onError: n,
                        strategy: o,
                        retryCount: a,
                        retryDelay: h
                    }, c), l += m.progressSize || 1, r && r(l / f))
                });
            return await Promise.all(p), u ? c[d[0].src] : c
        }
        async unload(t) {
            const s = Jt(t, r => ({
                alias: [r],
                src: r
            })).map(async r => {
                var a, h;
                const n = Ht.toAbsolute(r.src),
                    o = this.promiseCache[n];
                if (o) {
                    const l = await o.promise;
                    delete this.promiseCache[n], await ((h = (a = o.parser) == null ? void 0 : a.unload) == null ? void 0 : h.call(a, l, r, this))
                }
            });
            await Promise.all(s)
        }
        _validateParsers() {
            this._parsersValidated = !0, this._parserHash = this._parsers.filter(t => t.name || t.id).reduce((t, e) => (!e.name && !e.id ? V("[Assets] parser should have an id") : (t[e.name] || t[e.id]) && V(`[Assets] parser id conflict "${e.id}"`), t[e.name] = e, e.id && (t[e.id] = e), t), {})
        }
        async _loadAssetWithRetry(t, e, s, r) {
            let n = 0;
            const {
                onError: o,
                strategy: a,
                retryCount: h,
                retryDelay: l
            } = s, c = u => new Promise(d => setTimeout(d, u));
            for (;;) try {
                this.promiseCache[t] || (this.promiseCache[t] = this._getLoadPromiseAndParser(t, e)), r[e.src] = await this.promiseCache[t].promise;
                return
            } catch (u) {
                delete this.promiseCache[t], delete r[e.src], n++;
                const d = a !== "retry" || n > h;
                if (a === "retry" && !d) {
                    o && o(u, e), await c(l);
                    continue
                }
                if (a === "skip") {
                    o && o(u, e);
                    return
                }
                o && o(u, e);
                const f = new Error(`[Loader.load] Failed to load ${t}.
${u}`);
                throw u instanceof Error && u.stack && (f.stack = u.stack), f
            }
        }
    };
El.defaultOptions = {
    onProgress: void 0,
    onError: void 0,
    strategy: "throw",
    retryCount: 3,
    retryDelay: 250
};
let pp = El;

function ws(i, t) {
    if (Array.isArray(t)) {
        for (const e of t)
            if (i.startsWith(`data:${e}`)) return !0;
        return !1
    }
    return i.startsWith(`data:${t}`)
}

function Ts(i, t) {
    const e = i.split("?")[0],
        s = Ht.extname(e).toLowerCase();
    return Array.isArray(t) ? t.includes(s) : s === t
}
const mp = ".json",
    gp = "application/json",
    _p = {
        extension: {
            type: w.LoadParser,
            priority: Ae.Low
        },
        name: "loadJson",
        id: "json",
        test(i) {
            return ws(i, gp) || Ts(i, mp)
        },
        async load(i) {
            return await (await X.get().fetch(i)).json()
        }
    },
    xp = ".txt",
    yp = "text/plain",
    bp = {
        name: "loadTxt",
        id: "text",
        extension: {
            type: w.LoadParser,
            priority: Ae.Low,
            name: "loadTxt"
        },
        test(i) {
            return ws(i, yp) || Ts(i, xp)
        },
        async load(i) {
            return await (await X.get().fetch(i)).text()
        }
    },
    vp = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
    wp = [".ttf", ".otf", ".woff", ".woff2"],
    Tp = ["font/ttf", "font/otf", "font/woff", "font/woff2"],
    Sp = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;

function Cp(i) {
    const t = Ht.extname(i),
        r = Ht.basename(i, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map(a => a.charAt(0).toUpperCase() + a.slice(1));
    let n = r.length > 0;
    for (const a of r)
        if (!a.match(Sp)) {
            n = !1;
            break
        } let o = r.join(" ");
    return n || (o = `"${o.replace(/[\\"]/g,"\\$&")}"`), o
}
const Ap = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;

function Pp(i) {
    return Ap.test(i) ? i : encodeURI(i)
}
const Ep = {
    extension: {
        type: w.LoadParser,
        priority: Ae.Low
    },
    name: "loadWebFont",
    id: "web-font",
    test(i) {
        return ws(i, Tp) || Ts(i, wp)
    },
    async load(i, t) {
        var s, r, n;
        const e = X.get().getFontFaceSet();
        if (e) {
            const o = [],
                a = ((s = t.data) == null ? void 0 : s.family) ?? Cp(i),
                h = ((n = (r = t.data) == null ? void 0 : r.weights) == null ? void 0 : n.filter(c => vp.includes(c))) ?? ["normal"],
                l = t.data ?? {};
            for (let c = 0; c < h.length; c++) {
                const u = h[c],
                    d = new FontFace(a, `url('${Pp(i)}')`, {
                        ...l,
                        weight: u
                    });
                await d.load(), e.add(d), o.push(d)
            }
            return ft.has(`${a}-and-url`) ? ft.get(`${a}-and-url`).entries.push({
                url: i,
                faces: o
            }) : ft.set(`${a}-and-url`, {
                entries: [{
                    url: i,
                    faces: o
                }]
            }), o.length === 1 ? o[0] : o
        }
        return V("[loadWebFont] FontFace API is not supported. Skipping loading font"), null
    },
    unload(i) {
        const t = Array.isArray(i) ? i : [i],
            e = t[0].family,
            s = ft.get(`${e}-and-url`),
            r = s.entries.find(n => n.faces.some(o => t.indexOf(o) !== -1));
        r.faces = r.faces.filter(n => t.indexOf(n) === -1), r.faces.length === 0 && (s.entries = s.entries.filter(n => n !== r)), t.forEach(n => {
            X.get().getFontFaceSet().delete(n)
        }), s.entries.length === 0 && ft.remove(`${e}-and-url`)
    }
};
var Mp = Rp,
    xr = {
        a: 7,
        c: 6,
        h: 1,
        l: 2,
        m: 2,
        q: 4,
        s: 4,
        t: 2,
        v: 1,
        z: 0
    },
    kp = /([astvzqmhlc])([^astvzqmhlc]*)/ig;

function Rp(i) {
    var t = [];
    return i.replace(kp, function(e, s, r) {
        var n = s.toLowerCase();
        for (r = Ip(r), n == "m" && r.length > 2 && (t.push([s].concat(r.splice(0, 2))), n = "l", s = s == "m" ? "l" : "L");;) {
            if (r.length == xr[n]) return r.unshift(s), t.push(r);
            if (r.length < xr[n]) throw new Error("malformed path data");
            t.push([s].concat(r.splice(0, xr[n])))
        }
    }), t
}
var Bp = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;

function Ip(i) {
    var t = i.match(Bp);
    return t ? t.map(Number) : []
}
const Gp = Ph(Mp);

function Fp(i, t) {
    const e = Gp(i),
        s = [];
    let r = null,
        n = 0,
        o = 0;
    for (let a = 0; a < e.length; a++) {
        const h = e[a],
            l = h[0],
            c = h;
        switch (l) {
            case "M":
                n = c[1], o = c[2], t.moveTo(n, o);
                break;
            case "m":
                n += c[1], o += c[2], t.moveTo(n, o);
                break;
            case "H":
                n = c[1], t.lineTo(n, o);
                break;
            case "h":
                n += c[1], t.lineTo(n, o);
                break;
            case "V":
                o = c[1], t.lineTo(n, o);
                break;
            case "v":
                o += c[1], t.lineTo(n, o);
                break;
            case "L":
                n = c[1], o = c[2], t.lineTo(n, o);
                break;
            case "l":
                n += c[1], o += c[2], t.lineTo(n, o);
                break;
            case "C":
                n = c[5], o = c[6], t.bezierCurveTo(c[1], c[2], c[3], c[4], n, o);
                break;
            case "c":
                t.bezierCurveTo(n + c[1], o + c[2], n + c[3], o + c[4], n + c[5], o + c[6]), n += c[5], o += c[6];
                break;
            case "S":
                n = c[3], o = c[4], t.bezierCurveToShort(c[1], c[2], n, o);
                break;
            case "s":
                t.bezierCurveToShort(n + c[1], o + c[2], n + c[3], o + c[4]), n += c[3], o += c[4];
                break;
            case "Q":
                n = c[3], o = c[4], t.quadraticCurveTo(c[1], c[2], n, o);
                break;
            case "q":
                t.quadraticCurveTo(n + c[1], o + c[2], n + c[3], o + c[4]), n += c[3], o += c[4];
                break;
            case "T":
                n = c[1], o = c[2], t.quadraticCurveToShort(n, o);
                break;
            case "t":
                n += c[1], o += c[2], t.quadraticCurveToShort(n, o);
                break;
            case "A":
                n = c[6], o = c[7], t.arcToSvg(c[1], c[2], c[3], c[4], c[5], n, o);
                break;
            case "a":
                n += c[6], o += c[7], t.arcToSvg(c[1], c[2], c[3], c[4], c[5], n, o);
                break;
            case "Z":
            case "z":
                t.closePath(), s.length > 0 && (r = s.pop(), r ? (n = r.startX, o = r.startY) : (n = 0, o = 0)), r = null;
                break;
            default:
                V(`Unknown SVG path command: ${l}`)
        }
        l !== "Z" && l !== "z" && r === null && (r = {
            startX: n,
            startY: o
        }, s.push(r))
    }
    return t
}
class Tn {
    constructor(t = 0, e = 0, s = 0) {
        this.type = "circle", this.x = t, this.y = e, this.radius = s
    }
    clone() {
        return new Tn(this.x, this.y, this.radius)
    }
    contains(t, e) {
        if (this.radius <= 0) return !1;
        const s = this.radius * this.radius;
        let r = this.x - t,
            n = this.y - e;
        return r *= r, n *= n, r + n <= s
    }
    strokeContains(t, e, s, r = .5) {
        if (this.radius === 0) return !1;
        const n = this.x - t,
            o = this.y - e,
            a = this.radius,
            h = (1 - r) * s,
            l = Math.sqrt(n * n + o * o);
        return l <= a + h && l > a - (s - h)
    }
    getBounds(t) {
        return t || (t = new nt), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t
    }
    copyFrom(t) {
        return this.x = t.x, this.y = t.y, this.radius = t.radius, this
    }
    copyTo(t) {
        return t.copyFrom(this), t
    }
    toString() {
        return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`
    }
}
class Sn {
    constructor(t = 0, e = 0, s = 0, r = 0) {
        this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = s, this.halfHeight = r
    }
    clone() {
        return new Sn(this.x, this.y, this.halfWidth, this.halfHeight)
    }
    contains(t, e) {
        if (this.halfWidth <= 0 || this.halfHeight <= 0) return !1;
        let s = (t - this.x) / this.halfWidth,
            r = (e - this.y) / this.halfHeight;
        return s *= s, r *= r, s + r <= 1
    }
    strokeContains(t, e, s, r = .5) {
        const {
            halfWidth: n,
            halfHeight: o
        } = this;
        if (n <= 0 || o <= 0) return !1;
        const a = s * (1 - r),
            h = s - a,
            l = n - h,
            c = o - h,
            u = n + a,
            d = o + a,
            f = t - this.x,
            p = e - this.y,
            m = f * f / (l * l) + p * p / (c * c),
            g = f * f / (u * u) + p * p / (d * d);
        return m > 1 && g <= 1
    }
    getBounds(t) {
        return t || (t = new nt), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t
    }
    copyFrom(t) {
        return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this
    }
    copyTo(t) {
        return t.copyFrom(this), t
    }
    toString() {
        return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`
    }
}

function Op(i, t, e, s, r, n) {
    const o = i - e,
        a = t - s,
        h = r - e,
        l = n - s,
        c = o * h + a * l,
        u = h * h + l * l;
    let d = -1;
    u !== 0 && (d = c / u);
    let f, p;
    d < 0 ? (f = e, p = s) : d > 1 ? (f = r, p = n) : (f = e + d * h, p = s + d * l);
    const m = i - f,
        g = t - p;
    return m * m + g * g
}
let Lp, Dp;
class zs {
    constructor(...t) {
        this.type = "polygon";
        let e = Array.isArray(t[0]) ? t[0] : t;
        if (typeof e[0] != "number") {
            const s = [];
            for (let r = 0, n = e.length; r < n; r++) s.push(e[r].x, e[r].y);
            e = s
        }
        this.points = e, this.closePath = !0
    }
    isClockwise() {
        let t = 0;
        const e = this.points,
            s = e.length;
        for (let r = 0; r < s; r += 2) {
            const n = e[r],
                o = e[r + 1],
                a = e[(r + 2) % s],
                h = e[(r + 3) % s];
            t += (a - n) * (h + o)
        }
        return t < 0
    }
    containsPolygon(t) {
        const e = this.getBounds(Lp),
            s = t.getBounds(Dp);
        if (!e.containsRect(s)) return !1;
        const r = t.points;
        for (let n = 0; n < r.length; n += 2) {
            const o = r[n],
                a = r[n + 1];
            if (!this.contains(o, a)) return !1
        }
        return !0
    }
    clone() {
        const t = this.points.slice(),
            e = new zs(t);
        return e.closePath = this.closePath, e
    }
    contains(t, e) {
        let s = !1;
        const r = this.points.length / 2;
        for (let n = 0, o = r - 1; n < r; o = n++) {
            const a = this.points[n * 2],
                h = this.points[n * 2 + 1],
                l = this.points[o * 2],
                c = this.points[o * 2 + 1];
            h > e != c > e && t < (l - a) * ((e - h) / (c - h)) + a && (s = !s)
        }
        return s
    }
    strokeContains(t, e, s, r = .5) {
        const n = s * s,
            o = n * (1 - r),
            a = n - o,
            {
                points: h
            } = this,
            l = h.length - (this.closePath ? 0 : 2);
        for (let c = 0; c < l; c += 2) {
            const u = h[c],
                d = h[c + 1],
                f = h[(c + 2) % h.length],
                p = h[(c + 3) % h.length],
                m = Op(t, e, u, d, f, p),
                g = Math.sign((f - u) * (e - d) - (p - d) * (t - u));
            if (m <= (g < 0 ? a : o)) return !0
        }
        return !1
    }
    getBounds(t) {
        t || (t = new nt);
        const e = this.points;
        let s = 1 / 0,
            r = -1 / 0,
            n = 1 / 0,
            o = -1 / 0;
        for (let a = 0, h = e.length; a < h; a += 2) {
            const l = e[a],
                c = e[a + 1];
            s = l < s ? l : s, r = l > r ? l : r, n = c < n ? c : n, o = c > o ? c : o
        }
        return t.x = s, t.width = r - s, t.y = n, t.height = o - n, t
    }
    copyFrom(t) {
        return this.points = t.points.slice(), this.closePath = t.closePath, this
    }
    copyTo(t) {
        return t.copyFrom(this), t
    }
    toString() {
        return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t,e)=>`${t}, ${e}`,"")}]`
    }
    get lastX() {
        return this.points[this.points.length - 2]
    }
    get lastY() {
        return this.points[this.points.length - 1]
    }
    get x() {
        return U("8.11.0", "Polygon.lastX is deprecated, please use Polygon.lastX instead."), this.points[this.points.length - 2]
    }
    get y() {
        return U("8.11.0", "Polygon.y is deprecated, please use Polygon.lastY instead."), this.points[this.points.length - 1]
    }
    get startX() {
        return this.points[0]
    }
    get startY() {
        return this.points[1]
    }
}
const vi = (i, t, e, s, r, n, o) => {
    const a = i - e,
        h = t - s,
        l = Math.sqrt(a * a + h * h);
    return l >= r - n && l <= r + o
};
class Cn {
    constructor(t = 0, e = 0, s = 0, r = 0, n = 20) {
        this.type = "roundedRectangle", this.x = t, this.y = e, this.width = s, this.height = r, this.radius = n
    }
    getBounds(t) {
        return t || (t = new nt), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t
    }
    clone() {
        return new Cn(this.x, this.y, this.width, this.height, this.radius)
    }
    copyFrom(t) {
        return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this
    }
    copyTo(t) {
        return t.copyFrom(this), t
    }
    contains(t, e) {
        if (this.width <= 0 || this.height <= 0) return !1;
        if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
            const s = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
            if (e >= this.y + s && e <= this.y + this.height - s || t >= this.x + s && t <= this.x + this.width - s) return !0;
            let r = t - (this.x + s),
                n = e - (this.y + s);
            const o = s * s;
            if (r * r + n * n <= o || (r = t - (this.x + this.width - s), r * r + n * n <= o) || (n = e - (this.y + this.height - s), r * r + n * n <= o) || (r = t - (this.x + s), r * r + n * n <= o)) return !0
        }
        return !1
    }
    strokeContains(t, e, s, r = .5) {
        const {
            x: n,
            y: o,
            width: a,
            height: h,
            radius: l
        } = this, c = s * (1 - r), u = s - c, d = n + l, f = o + l, p = a - l * 2, m = h - l * 2, g = n + a, _ = o + h;
        return (t >= n - c && t <= n + u || t >= g - u && t <= g + c) && e >= f && e <= f + m || (e >= o - c && e <= o + u || e >= _ - u && e <= _ + c) && t >= d && t <= d + p ? !0 : t < d && e < f && vi(t, e, d, f, l, u, c) || t > g - l && e < f && vi(t, e, g - l, f, l, u, c) || t > g - l && e > _ - l && vi(t, e, g - l, _ - l, l, u, c) || t < d && e > _ - l && vi(t, e, d, _ - l, l, u, c)
    }
    toString() {
        return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`
    }
}
const Ml = {};

function An(i, t, e) {
    let s = 2166136261;
    for (let r = 0; r < t; r++) s ^= i[r].uid, s = Math.imul(s, 16777619), s >>>= 0;
    return Ml[s] || Up(i, t, s, e)
}

function Up(i, t, e, s) {
    const r = {};
    let n = 0;
    for (let a = 0; a < s; a++) {
        const h = a < t ? i[a] : O.EMPTY.source;
        r[n++] = h.source, r[n++] = h.style
    }
    const o = new Se(r);
    return Ml[e] = o, o
}
class fa {
    constructor(t) {
        typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength
    }
    get int8View() {
        return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View
    }
    get uint8View() {
        return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View
    }
    get int16View() {
        return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View
    }
    get int32View() {
        return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View
    }
    get float64View() {
        return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array
    }
    get bigUint64View() {
        return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array
    }
    view(t) {
        return this[`${t}View`]
    }
    destroy() {
        this.rawBinaryData = null, this.uint32View = null, this.float32View = null, this.uint16View = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._int32View = null, this._float64Array = null, this._bigUint64Array = null
    }
    static sizeOf(t) {
        switch (t) {
            case "int8":
            case "uint8":
                return 1;
            case "int16":
            case "uint16":
                return 2;
            case "int32":
            case "uint32":
            case "float32":
                return 4;
            default:
                throw new Error(`${t} isn't a valid view type`)
        }
    }
}

function en(i, t, e, s) {
    if (e ?? (e = 0), s ?? (s = Math.min(i.byteLength - e, t.byteLength)), !(e & 7) && !(s & 7)) {
        const r = s / 8;
        new Float64Array(t, 0, r).set(new Float64Array(i, e, r))
    } else if (!(e & 3) && !(s & 3)) {
        const r = s / 4;
        new Float32Array(t, 0, r).set(new Float32Array(i, e, r))
    } else new Uint8Array(t).set(new Uint8Array(i, e, s))
}
const Np = {
    normal: "normal-npm",
    add: "add-npm",
    screen: "screen-npm"
};
var Ct = (i => (i[i.DISABLED = 0] = "DISABLED", i[i.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", i[i.MASK_ACTIVE = 2] = "MASK_ACTIVE", i[i.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", i[i.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", i[i.NONE = 5] = "NONE", i))(Ct || {});

function pa(i, t) {
    return t.alphaMode === "no-premultiply-alpha" && Np[i] || i
}
const Wp = ["precision mediump float;", "void main(void){", "float test = 0.1;", "%forloop%", "gl_FragColor = vec4(0.0);", "}"].join(`
`);

function Hp(i) {
    let t = "";
    for (let e = 0; e < i; ++e) e > 0 && (t += `
else `), e < i - 1 && (t += `if(test == ${e}.0){}`);
    return t
}

function kl(i, t) {
    if (i === 0) throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
    const e = t.createShader(t.FRAGMENT_SHADER);
    try {
        for (;;) {
            const s = Wp.replace(/%forloop%/gi, Hp(i));
            if (t.shaderSource(e, s), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS)) i = i / 2 | 0;
            else break
        }
    } finally {
        t.deleteShader(e)
    }
    return i
}
let ts = null;

function zp() {
    var t;
    if (ts) return ts;
    const i = ol();
    return ts = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), ts = kl(ts, i), (t = i.getExtension("WEBGL_lose_context")) == null || t.loseContext(), ts
}
class Vp {
    constructor() {
        this.ids = Object.create(null), this.textures = [], this.count = 0
    }
    clear() {
        for (let t = 0; t < this.count; t++) {
            const e = this.textures[t];
            this.textures[t] = null, this.ids[e.uid] = null
        }
        this.count = 0
    }
}
class Xp {
    constructor() {
        this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new Vp, this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = !0
    }
    destroy() {
        this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null, this.elements = null
    }
}
const Vs = [];
let Wi = 0;
bs.register({
    clear: () => {
        if (Vs.length > 0)
            for (const i of Vs) i && i.destroy();
        Vs.length = 0, Wi = 0
    }
});

function ma() {
    return Wi > 0 ? Vs[--Wi] : new Xp
}

function ga(i) {
    i.elements = null, Vs[Wi++] = i
}
let Ms = 0;
const Rl = class Bl {
    constructor(t) {
        this.uid = pt("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], t = {
            ...Bl.defaultOptions,
            ...t
        }, t.maxTextures || (U("v8.8.0", "maxTextures is a required option for Batcher now, please pass it in the options"), t.maxTextures = zp());
        const {
            maxTextures: e,
            attributesInitialSize: s,
            indicesInitialSize: r
        } = t;
        this.attributeBuffer = new fa(s * 4), this.indexBuffer = new Uint16Array(r), this.maxTextures = e
    }
    begin() {
        this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
        for (let t = 0; t < this.batchIndex; t++) ga(this.batches[t]);
        this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0
    }
    add(t) {
        this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize
    }
    checkAndUpdateTexture(t, e) {
        const s = t._batch.textures.ids[e._source.uid];
        return !s && s !== 0 ? !1 : (t._textureId = s, t.texture = e, !0)
    }
    updateElement(t) {
        this.dirty = !0;
        const e = this.attributeBuffer;
        t.packAsQuad ? this.packQuadAttributes(t, e.float32View, e.uint32View, t._attributeStart, t._textureId) : this.packAttributes(t, e.float32View, e.uint32View, t._attributeStart, t._textureId)
    }
    break (t) {
        const e = this._elements;
        if (!e[this.elementStart]) return;
        let s = ma(),
            r = s.textures;
        r.clear();
        const n = e[this.elementStart];
        let o = pa(n.blendMode, n.texture._source),
            a = n.topology;
        this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
        const h = this.attributeBuffer.float32View,
            l = this.attributeBuffer.uint32View,
            c = this.indexBuffer;
        let u = this._batchIndexSize,
            d = this._batchIndexStart,
            f = "startBatch",
            p = [];
        const m = this.maxTextures;
        for (let g = this.elementStart; g < this.elementSize; ++g) {
            const _ = e[g];
            e[g] = null;
            const b = _.texture._source,
                y = pa(_.blendMode, b),
                S = o !== y || a !== _.topology;
            if (b._batchTick === Ms && !S) {
                _._textureId = b._textureBindLocation, u += _.indexSize, _.packAsQuad ? (this.packQuadAttributes(_, h, l, _._attributeStart, _._textureId), this.packQuadIndex(c, _._indexStart, _._attributeStart / this.vertexSize)) : (this.packAttributes(_, h, l, _._attributeStart, _._textureId), this.packIndex(_, c, _._indexStart, _._attributeStart / this.vertexSize)), _._batch = s, p.push(_);
                continue
            }
            b._batchTick = Ms, (r.count >= m || S) && (this._finishBatch(s, d, u - d, r, o, a, t, f, p), f = "renderBatch", d = u, o = y, a = _.topology, s = ma(), r = s.textures, r.clear(), p = [], ++Ms), _._textureId = b._textureBindLocation = r.count, r.ids[b.uid] = r.count, r.textures[r.count++] = b, _._batch = s, p.push(_), u += _.indexSize, _.packAsQuad ? (this.packQuadAttributes(_, h, l, _._attributeStart, _._textureId), this.packQuadIndex(c, _._indexStart, _._attributeStart / this.vertexSize)) : (this.packAttributes(_, h, l, _._attributeStart, _._textureId), this.packIndex(_, c, _._indexStart, _._attributeStart / this.vertexSize))
        }
        r.count > 0 && (this._finishBatch(s, d, u - d, r, o, a, t, f, p), d = u, ++Ms), this.elementStart = this.elementSize, this._batchIndexStart = d, this._batchIndexSize = u
    }
    _finishBatch(t, e, s, r, n, o, a, h, l) {
        t.gpuBindGroup = null, t.bindGroup = null, t.action = h, t.batcher = this, t.textures = r, t.blendMode = n, t.topology = o, t.start = e, t.size = s, t.elements = l, ++Ms, this.batches[this.batchIndex++] = t, a.add(t)
    }
    finish(t) {
        this.break(t)
    }
    ensureAttributeBuffer(t) {
        t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4)
    }
    ensureIndexBuffer(t) {
        t <= this.indexBuffer.length || this._resizeIndexBuffer(t)
    }
    _resizeAttributeBuffer(t) {
        const e = Math.max(t, this.attributeBuffer.size * 2),
            s = new fa(e);
        en(this.attributeBuffer.rawBinaryData, s.rawBinaryData), this.attributeBuffer = s
    }
    _resizeIndexBuffer(t) {
        const e = this.indexBuffer;
        let s = Math.max(t, e.length * 1.5);
        s += s % 2;
        const r = s > 65535 ? new Uint32Array(s) : new Uint16Array(s);
        if (r.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
            for (let n = 0; n < e.length; n++) r[n] = e[n];
        else en(e.buffer, r.buffer);
        this.indexBuffer = r
    }
    packQuadIndex(t, e, s) {
        t[e] = s + 0, t[e + 1] = s + 1, t[e + 2] = s + 2, t[e + 3] = s + 0, t[e + 4] = s + 2, t[e + 5] = s + 3
    }
    packIndex(t, e, s, r) {
        const n = t.indices,
            o = t.indexSize,
            a = t.indexOffset,
            h = t.attributeOffset;
        for (let l = 0; l < o; l++) e[s++] = r + n[l + a] - h
    }
    destroy(t = {}) {
        var e;
        if (this.batches !== null) {
            for (let s = 0; s < this.batchIndex; s++) ga(this.batches[s]);
            this.batches = null, this.geometry.destroy(!0), this.geometry = null, t.shader && ((e = this.shader) == null || e.destroy(), this.shader = null);
            for (let s = 0; s < this._elements.length; s++) this._elements[s] && (this._elements[s]._batch = null);
            this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null
        }
    }
};
Rl.defaultOptions = {
    maxTextures: null,
    attributesInitialSize: 4,
    indicesInitialSize: 6
};
let Yp = Rl;
var gt = (i => (i[i.MAP_READ = 1] = "MAP_READ", i[i.MAP_WRITE = 2] = "MAP_WRITE", i[i.COPY_SRC = 4] = "COPY_SRC", i[i.COPY_DST = 8] = "COPY_DST", i[i.INDEX = 16] = "INDEX", i[i.VERTEX = 32] = "VERTEX", i[i.UNIFORM = 64] = "UNIFORM", i[i.STORAGE = 128] = "STORAGE", i[i.INDIRECT = 256] = "INDIRECT", i[i.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", i[i.STATIC = 1024] = "STATIC", i))(gt || {});
class Ce extends Xt {
    constructor(t) {
        let {
            data: e,
            size: s
        } = t;
        const {
            usage: r,
            label: n,
            shrinkToFit: o
        } = t;
        super(), this._gpuData = Object.create(null), this._gcLastUsed = -1, this.autoGarbageCollect = !0, this.uid = pt("buffer"), this._resourceType = "buffer", this._resourceId = pt("resource"), this._touched = 0, this._updateID = 1, this._dataInt32 = null, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, s ?? (s = e == null ? void 0 : e.byteLength);
        const a = !!e;
        this.descriptor = {
            size: s,
            usage: r,
            mappedAtCreation: a,
            label: n
        }, this.shrinkToFit = o ?? !0
    }
    get data() {
        return this._data
    }
    set data(t) {
        this.setDataWithSize(t, t.length, !0)
    }
    get dataInt32() {
        return this._dataInt32 || (this._dataInt32 = new Int32Array(this.data.buffer)), this._dataInt32
    }
    get static() {
        return !!(this.descriptor.usage & gt.STATIC)
    }
    set static(t) {
        t ? this.descriptor.usage |= gt.STATIC : this.descriptor.usage &= ~gt.STATIC
    }
    setDataWithSize(t, e, s) {
        if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
            s && this.emit("update", this);
            return
        }
        const r = this._data;
        if (this._data = t, this._dataInt32 = null, !r || r.length !== t.length) {
            !this.shrinkToFit && r && t.byteLength < r.byteLength ? s && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = pt("resource"), this.emit("change", this));
            return
        }
        s && this.emit("update", this)
    }
    update(t) {
        this._updateSize = t ?? this._updateSize, this._updateID++, this.emit("update", this)
    }
    unload() {
        var t;
        this.emit("unload", this);
        for (const e in this._gpuData)(t = this._gpuData[e]) == null || t.destroy();
        this._gpuData = Object.create(null)
    }
    destroy() {
        this.destroyed = !0, this.unload(), this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners()
    }
}

function Il(i, t) {
    if (!(i instanceof Ce)) {
        let e = t ? gt.INDEX : gt.VERTEX;
        i instanceof Array && (t ? (i = new Uint32Array(i), e = gt.INDEX | gt.COPY_DST) : (i = new Float32Array(i), e = gt.VERTEX | gt.COPY_DST)), i = new Ce({
            data: i,
            label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
            usage: e
        })
    }
    return i
}

function $p(i, t, e) {
    const s = i.getAttribute(t);
    if (!s) return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
    const r = s.buffer.data;
    let n = 1 / 0,
        o = 1 / 0,
        a = -1 / 0,
        h = -1 / 0;
    const l = r.BYTES_PER_ELEMENT,
        c = (s.offset || 0) / l,
        u = (s.stride || 2 * 4) / l;
    for (let d = c; d < r.length; d += u) {
        const f = r[d],
            p = r[d + 1];
        f > a && (a = f), p > h && (h = p), f < n && (n = f), p < o && (o = p)
    }
    return e.minX = n, e.minY = o, e.maxX = a, e.maxY = h, e
}

function jp(i) {
    return (i instanceof Ce || Array.isArray(i) || i.BYTES_PER_ELEMENT) && (i = {
        buffer: i
    }), i.buffer = Il(i.buffer, !1), i
}
class Pn extends Xt {
    constructor(t = {}) {
        super(), this._gpuData = Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = pt("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new Ft, this._boundsDirty = !0;
        const {
            attributes: e,
            indexBuffer: s,
            topology: r
        } = t;
        if (this.buffers = [], this.attributes = {}, e)
            for (const n in e) this.addAttribute(n, e[n]);
        this.instanceCount = t.instanceCount ?? 1, s && this.addIndex(s), this.topology = r || "triangle-list"
    }
    onBufferUpdate() {
        this._boundsDirty = !0, this.emit("update", this)
    }
    getAttribute(t) {
        return this.attributes[t]
    }
    getIndex() {
        return this.indexBuffer
    }
    getBuffer(t) {
        return this.getAttribute(t).buffer
    }
    getSize() {
        for (const t in this.attributes) {
            const e = this.attributes[t];
            return e.buffer.data.length / (e.stride / 4 || e.size)
        }
        return 0
    }
    addAttribute(t, e) {
        const s = jp(e);
        this.buffers.indexOf(s.buffer) === -1 && (this.buffers.push(s.buffer), s.buffer.on("update", this.onBufferUpdate, this), s.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = s
    }
    addIndex(t) {
        this.indexBuffer = Il(t, !0), this.buffers.push(this.indexBuffer)
    }
    get bounds() {
        return this._boundsDirty ? (this._boundsDirty = !1, $p(this, "aPosition", this._bounds)) : this._bounds
    }
    unload() {
        var t;
        this.emit("unload", this);
        for (const e in this._gpuData)(t = this._gpuData[e]) == null || t.destroy();
        this._gpuData = Object.create(null)
    }
    destroy(t = !1) {
        var e;
        this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach(s => s.destroy()), this.unload(), (e = this.indexBuffer) == null || e.destroy(), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null
    }
}
const qp = new Float32Array(1),
    Kp = new Uint32Array(1);
class Zp extends Pn {
    constructor() {
        const e = new Ce({
                data: qp,
                label: "attribute-batch-buffer",
                usage: gt.VERTEX | gt.COPY_DST,
                shrinkToFit: !1
            }),
            s = new Ce({
                data: Kp,
                label: "index-batch-buffer",
                usage: gt.INDEX | gt.COPY_DST,
                shrinkToFit: !1
            }),
            r = 6 * 4;
        super({
            attributes: {
                aPosition: {
                    buffer: e,
                    format: "float32x2",
                    stride: r,
                    offset: 0
                },
                aUV: {
                    buffer: e,
                    format: "float32x2",
                    stride: r,
                    offset: 2 * 4
                },
                aColor: {
                    buffer: e,
                    format: "unorm8x4",
                    stride: r,
                    offset: 4 * 4
                },
                aTextureIdAndRound: {
                    buffer: e,
                    format: "uint16x2",
                    stride: r,
                    offset: 5 * 4
                }
            },
            indexBuffer: s
        })
    }
}

function _a(i, t, e) {
    if (i)
        for (const s in i) {
            const r = s.toLocaleLowerCase(),
                n = t[r];
            if (n) {
                let o = i[s];
                s === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(o)
            } else V(`${s} placement hook does not exist in shader`)
        }
}
const Qp = /\{\{(.*?)\}\}/g;

function xa(i) {
    var s;
    const t = {};
    return (((s = i.match(Qp)) == null ? void 0 : s.map(r => r.replace(/[{()}]/g, ""))) ?? []).forEach(r => {
        t[r] = []
    }), t
}

function ya(i, t) {
    let e;
    const s = /@in\s+([^;]+);/g;
    for (;
        (e = s.exec(i)) !== null;) t.push(e[1])
}

function ba(i, t, e = !1) {
    const s = [];
    ya(t, s), i.forEach(a => {
        a.header && ya(a.header, s)
    });
    const r = s;
    e && r.sort();
    const n = r.map((a, h) => `       @location(${h}) ${a},`).join(`
`);
    let o = t.replace(/@in\s+[^;]+;\s*/g, "");
    return o = o.replace("{{in}}", `
${n}
`), o
}

function va(i, t) {
    let e;
    const s = /@out\s+([^;]+);/g;
    for (;
        (e = s.exec(i)) !== null;) t.push(e[1])
}

function Jp(i) {
    const e = /\b(\w+)\s*:/g.exec(i);
    return e ? e[1] : ""
}

function tm(i) {
    const t = /@.*?\s+/g;
    return i.replace(t, "")
}

function em(i, t) {
    const e = [];
    va(t, e), i.forEach(h => {
        h.header && va(h.header, e)
    });
    let s = 0;
    const r = e.sort().map(h => h.indexOf("builtin") > -1 ? h : `@location(${s++}) ${h}`).join(`,
`),
        n = e.sort().map(h => `       var ${tm(h)};`).join(`
`),
        o = `return VSOutput(
            ${e.sort().map(h=>` ${Jp(h)}`).join(`,
`)});`;
    let a = t.replace(/@out\s+[^;]+;\s*/g, "");
    return a = a.replace("{{struct}}", `
${r}
`), a = a.replace("{{start}}", `
${n}
`), a = a.replace("{{return}}", `
${o}
`), a
}

function wa(i, t) {
    let e = i;
    for (const s in t) {
        const r = t[s];
        r.join(`
`).length ? e = e.replace(`{{${s}}}`, `//-----${s} START-----//
${r.join(`
`)}
//----${s} FINISH----//`) : e = e.replace(`{{${s}}}`, "")
    }
    return e
}
const we = Object.create(null),
    yr = new Map;
let sm = 0;

function im({
    template: i,
    bits: t
}) {
    const e = Gl(i, t);
    if (we[e]) return we[e];
    const {
        vertex: s,
        fragment: r
    } = nm(i, t);
    return we[e] = Fl(s, r, t), we[e]
}

function rm({
    template: i,
    bits: t
}) {
    const e = Gl(i, t);
    return we[e] || (we[e] = Fl(i.vertex, i.fragment, t)), we[e]
}

function nm(i, t) {
    const e = t.map(o => o.vertex).filter(o => !!o),
        s = t.map(o => o.fragment).filter(o => !!o);
    let r = ba(e, i.vertex, !0);
    r = em(e, r);
    const n = ba(s, i.fragment, !0);
    return {
        vertex: r,
        fragment: n
    }
}

function Gl(i, t) {
    return t.map(e => (yr.has(e) || yr.set(e, sm++), yr.get(e))).sort((e, s) => e - s).join("-") + i.vertex + i.fragment
}

function Fl(i, t, e) {
    const s = xa(i),
        r = xa(t);
    return e.forEach(n => {
        _a(n.vertex, s, n.name), _a(n.fragment, r, n.name)
    }), {
        vertex: wa(i, s),
        fragment: wa(t, r)
    }
}
const om = `
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,
    am = `
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,
    hm = `
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,
    lm = `

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`,
    cm = {
        name: "global-uniforms-bit",
        vertex: {
            header: `
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `
        }
    },
    um = {
        name: "global-uniforms-bit",
        vertex: {
            header: `
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `
        }
    };

function En({
    bits: i,
    name: t
}) {
    const e = im({
        template: {
            fragment: am,
            vertex: om
        },
        bits: [cm, ...i]
    });
    return Pe.from({
        name: t,
        vertex: {
            source: e.vertex,
            entryPoint: "main"
        },
        fragment: {
            source: e.fragment,
            entryPoint: "main"
        }
    })
}

function Mn({
    bits: i,
    name: t
}) {
    return new $e({
        name: t,
        ...rm({
            template: {
                vertex: hm,
                fragment: lm
            },
            bits: [um, ...i]
        })
    })
}
const Ol = {
        name: "color-bit",
        vertex: {
            header: `
            @in aColor: vec4<f32>;
        `,
            main: `
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `
        }
    },
    Ll = {
        name: "color-bit",
        vertex: {
            header: `
            in vec4 aColor;
        `,
            main: `
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `
        }
    },
    br = {};

function dm(i) {
    const t = [];
    if (i === 1) t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
    else {
        let e = 0;
        for (let s = 0; s < i; s++) t.push(`@group(1) @binding(${e++}) var textureSource${s+1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${s+1}: sampler;`)
    }
    return t.join(`
`)
}

function fm(i) {
    const t = [];
    if (i === 1) t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
    else {
        t.push("switch vTextureId {");
        for (let e = 0; e < i; e++) e === i - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e+1}, textureSampler${e+1}, vUV, uvDx, uvDy);`), t.push("      break;}");
        t.push("}")
    }
    return t.join(`
`)
}

function Dl(i) {
    return br[i] || (br[i] = {
        name: "texture-batch-bit",
        vertex: {
            header: `
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,
            main: `
                vTextureId = aTextureIdAndRound.y;
            `,
            end: `
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `
        },
        fragment: {
            header: `
                @in @interpolate(flat) vTextureId: u32;

                ${dm(i)}
            `,
            main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${fm(i)}
            `
        }
    }), br[i]
}
const vr = {};

function pm(i) {
    const t = [];
    for (let e = 0; e < i; e++) e > 0 && t.push("else"), e < i - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
    return t.join(`
`)
}

function Ul(i) {
    return vr[i] || (vr[i] = {
        name: "texture-batch-bit",
        vertex: {
            header: `
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,
            main: `
                vTextureId = aTextureIdAndRound.y;
            `,
            end: `
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `
        },
        fragment: {
            header: `
                in float vTextureId;

                uniform sampler2D uTextures[${i}];

            `,
            main: `

                ${pm(i)}
            `
        }
    }), vr[i]
}
const kn = {
        name: "round-pixels-bit",
        vertex: {
            header: `
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
        }
    },
    Rn = {
        name: "round-pixels-bit",
        vertex: {
            header: `
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
        }
    },
    Ta = {};

function Nl(i) {
    let t = Ta[i];
    if (t) return t;
    const e = new Int32Array(i);
    for (let s = 0; s < i; s++) e[s] = s;
    return t = Ta[i] = new te({
        uTextures: {
            value: e,
            type: "i32",
            size: i
        }
    }, {
        isStatic: !0
    }), t
}
class Sa extends ge {
    constructor(t) {
        const e = Mn({
                name: "batch",
                bits: [Ll, Ul(t), Rn]
            }),
            s = En({
                name: "batch",
                bits: [Ol, Dl(t), kn]
            });
        super({
            glProgram: e,
            gpuProgram: s,
            resources: {
                batchSamplers: Nl(t)
            }
        }), this.maxTextures = t
    }
}
let ks = null;
const Wl = class Hl extends Yp {
    constructor(t) {
        super(t), this.geometry = new Zp, this.name = Hl.extension.name, this.vertexSize = 6, ks ?? (ks = new Sa(t.maxTextures)), this.shader = ks
    }
    packAttributes(t, e, s, r, n) {
        const o = n << 16 | t.roundPixels & 65535,
            a = t.transform,
            h = a.a,
            l = a.b,
            c = a.c,
            u = a.d,
            d = a.tx,
            f = a.ty,
            {
                positions: p,
                uvs: m
            } = t,
            g = t.color,
            _ = t.attributeOffset,
            x = _ + t.attributeSize;
        for (let b = _; b < x; b++) {
            const y = b * 2,
                S = p[y],
                v = p[y + 1];
            e[r++] = h * S + c * v + d, e[r++] = u * v + l * S + f, e[r++] = m[y], e[r++] = m[y + 1], s[r++] = g, s[r++] = o
        }
    }
    packQuadAttributes(t, e, s, r, n) {
        const o = t.texture,
            a = t.transform,
            h = a.a,
            l = a.b,
            c = a.c,
            u = a.d,
            d = a.tx,
            f = a.ty,
            p = t.bounds,
            m = p.maxX,
            g = p.minX,
            _ = p.maxY,
            x = p.minY,
            b = o.uvs,
            y = t.color,
            S = n << 16 | t.roundPixels & 65535;
        e[r + 0] = h * g + c * x + d, e[r + 1] = u * x + l * g + f, e[r + 2] = b.x0, e[r + 3] = b.y0, s[r + 4] = y, s[r + 5] = S, e[r + 6] = h * m + c * x + d, e[r + 7] = u * x + l * m + f, e[r + 8] = b.x1, e[r + 9] = b.y1, s[r + 10] = y, s[r + 11] = S, e[r + 12] = h * m + c * _ + d, e[r + 13] = u * _ + l * m + f, e[r + 14] = b.x2, e[r + 15] = b.y2, s[r + 16] = y, s[r + 17] = S, e[r + 18] = h * g + c * _ + d, e[r + 19] = u * _ + l * g + f, e[r + 20] = b.x3, e[r + 21] = b.y3, s[r + 22] = y, s[r + 23] = S
    }
    _updateMaxTextures(t) {
        this.shader.maxTextures !== t && (ks = new Sa(t), this.shader = ks)
    }
    destroy() {
        this.shader = null, super.destroy()
    }
};
Wl.extension = {
    type: [w.Batcher],
    name: "default"
};
let Bn = Wl;
class oe {
    constructor(t) {
        this.items = Object.create(null);
        const {
            renderer: e,
            type: s,
            onUnload: r,
            priority: n,
            name: o
        } = t;
        this._renderer = e, e.gc.addResourceHash(this, "items", s, n ?? 0), this._onUnload = r, this.name = o
    }
    add(t) {
        return this.items[t.uid] ? !1 : (this.items[t.uid] = t, t.once("unload", this.remove, this), t._gcLastUsed = this._renderer.gc.now, !0)
    }
    remove(t, ...e) {
        var r;
        if (!this.items[t.uid]) return;
        const s = t._gpuData[this._renderer.uid];
        s && ((r = this._onUnload) == null || r.call(this, t, ...e), s.destroy(), t._gpuData[this._renderer.uid] = null, this.items[t.uid] = null)
    }
    removeAll(...t) {
        Object.values(this.items).forEach(e => e && this.remove(e, ...t))
    }
    destroy(...t) {
        this.removeAll(...t), this.items = Object.create(null), this._renderer = null, this._onUnload = null
    }
}

function mm(i, t, e, s, r, n, o, a = null) {
    let h = 0;
    e *= t, r *= n;
    const l = a.a,
        c = a.b,
        u = a.c,
        d = a.d,
        f = a.tx,
        p = a.ty;
    for (; h < o;) {
        const m = i[e],
            g = i[e + 1];
        s[r] = l * m + u * g + f, s[r + 1] = c * m + d * g + p, r += n, e += t, h++
    }
}

function gm(i, t, e, s) {
    let r = 0;
    for (t *= e; r < s;) i[t] = 0, i[t + 1] = 0, t += e, r++
}

function zl(i, t, e, s, r) {
    const n = t.a,
        o = t.b,
        a = t.c,
        h = t.d,
        l = t.tx,
        c = t.ty;
    e || (e = 0), s || (s = 2), r || (r = i.length / s - e);
    let u = e * s;
    for (let d = 0; d < r; d++) {
        const f = i[u],
            p = i[u + 1];
        i[u] = n * f + a * p + l, i[u + 1] = o * f + h * p + c, u += s
    }
}
const _m = new N;
class In {
    constructor() {
        this.packAsQuad = !1, this.batcherName = "default", this.topology = "triangle-list", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null
    }
    get uvs() {
        return this.geometryData.uvs
    }
    get positions() {
        return this.geometryData.vertices
    }
    get indices() {
        return this.geometryData.indices
    }
    get blendMode() {
        return this.renderable && this.applyTransform ? this.renderable.groupBlendMode : "normal"
    }
    get color() {
        const t = this.baseColor,
            e = t >> 16 | t & 65280 | (t & 255) << 16,
            s = this.renderable;
        return s ? ds(e, s.groupColor) + (this.alpha * s.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24)
    }
    get transform() {
        var t;
        return ((t = this.renderable) == null ? void 0 : t.groupTransform) || _m
    }
    copyTo(t) {
        t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData, t.topology = this.topology
    }
    reset() {
        this.applyTransform = !0, this.renderable = null, this.topology = "triangle-list"
    }
    destroy() {
        this.renderable = null, this.texture = null, this.geometryData = null, this._batcher = null, this._batch = null
    }
}
const Js = {
        extension: {
            type: w.ShapeBuilder,
            name: "circle"
        },
        build(i, t) {
            let e, s, r, n, o, a;
            if (i.type === "circle") {
                const y = i;
                if (o = a = y.radius, o <= 0) return !1;
                e = y.x, s = y.y, r = n = 0
            } else if (i.type === "ellipse") {
                const y = i;
                if (o = y.halfWidth, a = y.halfHeight, o <= 0 || a <= 0) return !1;
                e = y.x, s = y.y, r = n = 0
            } else {
                const y = i,
                    S = y.width / 2,
                    v = y.height / 2;
                e = y.x + S, s = y.y + v, o = a = Math.max(0, Math.min(y.radius, Math.min(S, v))), r = S - o, n = v - a
            }
            if (r < 0 || n < 0) return !1;
            const h = Math.ceil(2.3 * Math.sqrt(o + a)),
                l = h * 8 + (r ? 4 : 0) + (n ? 4 : 0);
            if (l === 0) return !1;
            if (h === 0) return t[0] = t[6] = e + r, t[1] = t[3] = s + n, t[2] = t[4] = e - r, t[5] = t[7] = s - n, !0;
            let c = 0,
                u = h * 4 + (r ? 2 : 0) + 2,
                d = u,
                f = l,
                p = r + o,
                m = n,
                g = e + p,
                _ = e - p,
                x = s + m;
            if (t[c++] = g, t[c++] = x, t[--u] = x, t[--u] = _, n) {
                const y = s - m;
                t[d++] = _, t[d++] = y, t[--f] = y, t[--f] = g
            }
            for (let y = 1; y < h; y++) {
                const S = Math.PI / 2 * (y / h),
                    v = r + Math.cos(S) * o,
                    T = n + Math.sin(S) * a,
                    M = e + v,
                    C = e - v,
                    A = s + T,
                    P = s - T;
                t[c++] = M, t[c++] = A, t[--u] = A, t[--u] = C, t[d++] = C, t[d++] = P, t[--f] = P, t[--f] = M
            }
            p = r, m = n + a, g = e + p, _ = e - p, x = s + m;
            const b = s - m;
            return t[c++] = g, t[c++] = x, t[--f] = b, t[--f] = g, r && (t[c++] = _, t[c++] = x, t[--f] = b, t[--f] = _), !0
        },
        triangulate(i, t, e, s, r, n) {
            if (i.length === 0) return;
            let o = 0,
                a = 0;
            for (let c = 0; c < i.length; c += 2) o += i[c], a += i[c + 1];
            o /= i.length / 2, a /= i.length / 2;
            let h = s;
            t[h * e] = o, t[h * e + 1] = a;
            const l = h++;
            for (let c = 0; c < i.length; c += 2) t[h * e] = i[c], t[h * e + 1] = i[c + 1], c > 0 && (r[n++] = h, r[n++] = l, r[n++] = h - 1), h++;
            r[n++] = l + 1, r[n++] = l, r[n++] = h - 1
        }
    },
    xm = {
        ...Js,
        extension: {
            ...Js.extension,
            name: "ellipse"
        }
    },
    ym = {
        ...Js,
        extension: {
            ...Js.extension,
            name: "roundedRectangle"
        }
    },
    Vl = 1e-4,
    Ca = 1e-4;

function bm(i) {
    const t = i.length;
    if (t < 6) return 1;
    let e = 0;
    for (let s = 0, r = i[t - 2], n = i[t - 1]; s < t; s += 2) {
        const o = i[s],
            a = i[s + 1];
        e += (o - r) * (a + n), r = o, n = a
    }
    return e < 0 ? -1 : 1
}

function Aa(i, t, e, s, r, n, o, a) {
    const h = i - e * r,
        l = t - s * r,
        c = i + e * n,
        u = t + s * n;
    let d, f;
    o ? (d = s, f = -e) : (d = -s, f = e);
    const p = h + d,
        m = l + f,
        g = c + d,
        _ = u + f;
    return a.push(p, m), a.push(g, _), 2
}

function Me(i, t, e, s, r, n, o, a) {
    const h = e - i,
        l = s - t;
    let c = Math.atan2(h, l),
        u = Math.atan2(r - i, n - t);
    a && c < u ? c += Math.PI * 2 : !a && c > u && (u += Math.PI * 2);
    let d = c;
    const f = u - c,
        p = Math.abs(f),
        m = Math.sqrt(h * h + l * l),
        g = (15 * p * Math.sqrt(m) / Math.PI >> 0) + 1,
        _ = f / g;
    if (d += _, a) {
        o.push(i, t), o.push(e, s);
        for (let x = 1, b = d; x < g; x++, b += _) o.push(i, t), o.push(i + Math.sin(b) * m, t + Math.cos(b) * m);
        o.push(i, t), o.push(r, n)
    } else {
        o.push(e, s), o.push(i, t);
        for (let x = 1, b = d; x < g; x++, b += _) o.push(i + Math.sin(b) * m, t + Math.cos(b) * m), o.push(i, t);
        o.push(r, n), o.push(i, t)
    }
    return g * 2
}

function Xl(i, t, e, s, r, n) {
    const o = Vl;
    if (i.length === 0) return;
    const a = t;
    let h = a.alignment;
    if (t.alignment !== .5) {
        let B = bm(i);
        h = (h - .5) * B + .5
    }
    const l = new mt(i[0], i[1]),
        c = new mt(i[i.length - 2], i[i.length - 1]),
        u = s,
        d = Math.abs(l.x - c.x) < o && Math.abs(l.y - c.y) < o;
    if (u) {
        i = i.slice(), d && (i.pop(), i.pop(), c.set(i[i.length - 2], i[i.length - 1]));
        const B = (l.x + c.x) * .5,
            L = (c.y + l.y) * .5;
        i.unshift(B, L), i.push(B, L)
    }
    const f = r,
        p = i.length / 2;
    let m = i.length;
    const g = f.length / 2,
        _ = a.width / 2,
        x = _ * _,
        b = a.miterLimit * a.miterLimit;
    let y = i[0],
        S = i[1],
        v = i[2],
        T = i[3],
        M = 0,
        C = 0,
        A = -(S - T),
        P = y - v,
        k = 0,
        G = 0,
        F = Math.sqrt(A * A + P * P);
    A /= F, P /= F, A *= _, P *= _;
    const ht = h,
        R = (1 - ht) * 2,
        I = ht * 2;
    u || (a.cap === "round" ? m += Me(y - A * (R - I) * .5, S - P * (R - I) * .5, y - A * R, S - P * R, y + A * I, S + P * I, f, !0) + 2 : a.cap === "square" && (m += Aa(y, S, A, P, R, I, !0, f))), f.push(y - A * R, S - P * R), f.push(y + A * I, S + P * I);
    for (let B = 1; B < p - 1; ++B) {
        y = i[(B - 1) * 2], S = i[(B - 1) * 2 + 1], v = i[B * 2], T = i[B * 2 + 1], M = i[(B + 1) * 2], C = i[(B + 1) * 2 + 1], A = -(S - T), P = y - v, F = Math.sqrt(A * A + P * P), A /= F, P /= F, A *= _, P *= _, k = -(T - C), G = v - M, F = Math.sqrt(k * k + G * G), k /= F, G /= F, k *= _, G *= _;
        const L = v - y,
            q = S - T,
            K = v - M,
            W = C - T,
            et = L * K + q * W,
            rt = q * K - W * L,
            ut = rt < 0;
        if (Math.abs(rt) < .001 * Math.abs(et)) {
            f.push(v - A * R, T - P * R), f.push(v + A * I, T + P * I), et >= 0 && (a.join === "round" ? m += Me(v, T, v - A * R, T - P * R, v - k * R, T - G * R, f, !1) + 4 : m += 2, f.push(v - k * I, T - G * I), f.push(v + k * R, T + G * R));
            continue
        }
        const ct = (-A + y) * (-P + T) - (-A + v) * (-P + S),
            vt = (-k + M) * (-G + T) - (-k + v) * (-G + C),
            $ = (L * vt - K * ct) / rt,
            wt = (W * ct - q * vt) / rt,
            xt = ($ - v) * ($ - v) + (wt - T) * (wt - T),
            Tt = v + ($ - v) * R,
            ee = T + (wt - T) * R,
            Kt = v - ($ - v) * I,
            Yt = T - (wt - T) * I,
            je = Math.min(L * L + q * q, K * K + W * W),
            qe = ut ? R : I,
            Ss = je + qe * qe * x;
        xt <= Ss ? a.join === "bevel" || xt / x > b ? (ut ? (f.push(Tt, ee), f.push(v + A * I, T + P * I), f.push(Tt, ee), f.push(v + k * I, T + G * I)) : (f.push(v - A * R, T - P * R), f.push(Kt, Yt), f.push(v - k * R, T - G * R), f.push(Kt, Yt)), m += 2) : a.join === "round" ? ut ? (f.push(Tt, ee), f.push(v + A * I, T + P * I), m += Me(v, T, v + A * I, T + P * I, v + k * I, T + G * I, f, !0) + 4, f.push(Tt, ee), f.push(v + k * I, T + G * I)) : (f.push(v - A * R, T - P * R), f.push(Kt, Yt), m += Me(v, T, v - A * R, T - P * R, v - k * R, T - G * R, f, !1) + 4, f.push(v - k * R, T - G * R), f.push(Kt, Yt)) : (f.push(Tt, ee), f.push(Kt, Yt)) : (f.push(v - A * R, T - P * R), f.push(v + A * I, T + P * I), a.join === "round" ? ut ? m += Me(v, T, v + A * I, T + P * I, v + k * I, T + G * I, f, !0) + 2 : m += Me(v, T, v - A * R, T - P * R, v - k * R, T - G * R, f, !1) + 2 : a.join === "miter" && xt / x <= b && (ut ? (f.push(Kt, Yt), f.push(Kt, Yt)) : (f.push(Tt, ee), f.push(Tt, ee)), m += 2), f.push(v - k * R, T - G * R), f.push(v + k * I, T + G * I), m += 2)
    }
    y = i[(p - 2) * 2], S = i[(p - 2) * 2 + 1], v = i[(p - 1) * 2], T = i[(p - 1) * 2 + 1], A = -(S - T), P = y - v, F = Math.sqrt(A * A + P * P), A /= F, P /= F, A *= _, P *= _, f.push(v - A * R, T - P * R), f.push(v + A * I, T + P * I), u || (a.cap === "round" ? m += Me(v - A * (R - I) * .5, T - P * (R - I) * .5, v - A * R, T - P * R, v + A * I, T + P * I, f, !1) + 2 : a.cap === "square" && (m += Aa(v, T, A, P, R, I, !1, f)));
    const z = Ca * Ca;
    for (let B = g; B < m + g - 2; ++B) y = f[B * 2], S = f[B * 2 + 1], v = f[(B + 1) * 2], T = f[(B + 1) * 2 + 1], M = f[(B + 2) * 2], C = f[(B + 2) * 2 + 1], !(Math.abs(y * (T - C) + v * (C - S) + M * (S - T)) < z) && n.push(B, B + 1, B + 2)
}

function vm(i, t, e, s) {
    const r = Vl;
    if (i.length === 0) return;
    const n = i[0],
        o = i[1],
        a = i[i.length - 2],
        h = i[i.length - 1],
        l = t || Math.abs(n - a) < r && Math.abs(o - h) < r,
        c = e,
        u = i.length / 2,
        d = c.length / 2;
    for (let f = 0; f < u; f++) c.push(i[f * 2]), c.push(i[f * 2 + 1]);
    for (let f = 0; f < u - 1; f++) s.push(d + f, d + f + 1);
    l && s.push(d + u - 1, d)
}

function Yl(i, t, e, s, r, n, o) {
    const a = Zf(i, t, 2);
    if (!a) return;
    for (let l = 0; l < a.length; l += 3) n[o++] = a[l] + r, n[o++] = a[l + 1] + r, n[o++] = a[l + 2] + r;
    let h = r * s;
    for (let l = 0; l < i.length; l += 2) e[h] = i[l], e[h + 1] = i[l + 1], h += s
}
const wm = [],
    Tm = {
        extension: {
            type: w.ShapeBuilder,
            name: "polygon"
        },
        build(i, t) {
            for (let e = 0; e < i.points.length; e++) t[e] = i.points[e];
            return !0
        },
        triangulate(i, t, e, s, r, n) {
            Yl(i, wm, t, e, s, r, n)
        }
    },
    Sm = {
        extension: {
            type: w.ShapeBuilder,
            name: "rectangle"
        },
        build(i, t) {
            const e = i,
                s = e.x,
                r = e.y,
                n = e.width,
                o = e.height;
            return n > 0 && o > 0 ? (t[0] = s, t[1] = r, t[2] = s + n, t[3] = r, t[4] = s + n, t[5] = r + o, t[6] = s, t[7] = r + o, !0) : !1
        },
        triangulate(i, t, e, s, r, n) {
            let o = 0;
            s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[6], t[s + o + 1] = i[7], o += e, t[s + o] = i[4], t[s + o + 1] = i[5], o += e;
            const a = s / e;
            r[n++] = a, r[n++] = a + 1, r[n++] = a + 2, r[n++] = a + 1, r[n++] = a + 3, r[n++] = a + 2
        }
    },
    Cm = {
        extension: {
            type: w.ShapeBuilder,
            name: "triangle"
        },
        build(i, t) {
            return t[0] = i.x, t[1] = i.y, t[2] = i.x2, t[3] = i.y2, t[4] = i.x3, t[5] = i.y3, !0
        },
        triangulate(i, t, e, s, r, n) {
            let o = 0;
            s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[4], t[s + o + 1] = i[5];
            const a = s / e;
            r[n++] = a, r[n++] = a + 1, r[n++] = a + 2
        }
    },
    Pa = [{
        offset: 0,
        color: "white"
    }, {
        offset: 1,
        color: "black"
    }],
    Gn = class sn {
        constructor(...t) {
            this.uid = pt("fillGradient"), this._tick = 0, this.type = "linear", this.colorStops = [];
            let e = Am(t);
            e = {
                ...e.type === "radial" ? sn.defaultRadialOptions : sn.defaultLinearOptions,
                ...Rh(e)
            }, this._textureSize = e.textureSize, this._wrapMode = e.wrapMode, e.type === "radial" ? (this.center = e.center, this.outerCenter = e.outerCenter ?? this.center, this.innerRadius = e.innerRadius, this.outerRadius = e.outerRadius, this.scale = e.scale, this.rotation = e.rotation) : (this.start = e.start, this.end = e.end), this.textureSpace = e.textureSpace, this.type = e.type, e.colorStops.forEach(r => {
                this.addColorStop(r.offset, r.color)
            })
        }
        addColorStop(t, e) {
            return this.colorStops.push({
                offset: t,
                color: lt.shared.setValue(e).toHexa()
            }), this
        }
        buildLinearGradient() {
            if (this.texture) return;
            let {
                x: t,
                y: e
            } = this.start, {
                x: s,
                y: r
            } = this.end, n = s - t, o = r - e;
            const a = n < 0 || o < 0;
            if (this._wrapMode === "clamp-to-edge") {
                if (n < 0) {
                    const g = t;
                    t = s, s = g, n *= -1
                }
                if (o < 0) {
                    const g = e;
                    e = r, r = g, o *= -1
                }
            }
            const h = this.colorStops.length ? this.colorStops : Pa,
                l = this._textureSize,
                {
                    canvas: c,
                    context: u
                } = Ma(l, 1),
                d = a ? u.createLinearGradient(this._textureSize, 0, 0, 0) : u.createLinearGradient(0, 0, this._textureSize, 0);
            Ea(d, h), u.fillStyle = d, u.fillRect(0, 0, l, 1), this.texture = new O({
                source: new He({
                    resource: c,
                    addressMode: this._wrapMode
                })
            });
            const f = Math.sqrt(n * n + o * o),
                p = Math.atan2(o, n),
                m = new N;
            m.scale(f / l, 1), m.rotate(p), m.translate(t, e), this.textureSpace === "local" && m.scale(l, l), this.transform = m
        }
        buildGradient() {
            this.texture || this._tick++, this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient()
        }
        buildRadialGradient() {
            if (this.texture) return;
            const t = this.colorStops.length ? this.colorStops : Pa,
                e = this._textureSize,
                {
                    canvas: s,
                    context: r
                } = Ma(e, e),
                {
                    x: n,
                    y: o
                } = this.center,
                {
                    x: a,
                    y: h
                } = this.outerCenter,
                l = this.innerRadius,
                c = this.outerRadius,
                u = a - c,
                d = h - c,
                f = e / (c * 2),
                p = (n - u) * f,
                m = (o - d) * f,
                g = r.createRadialGradient(p, m, l * f, (a - u) * f, (h - d) * f, c * f);
            Ea(g, t), r.fillStyle = t[t.length - 1].color, r.fillRect(0, 0, e, e), r.fillStyle = g, r.translate(p, m), r.rotate(this.rotation), r.scale(1, this.scale), r.translate(-p, -m), r.fillRect(0, 0, e, e), this.texture = new O({
                source: new He({
                    resource: s,
                    addressMode: this._wrapMode
                })
            });
            const _ = new N;
            _.scale(1 / f, 1 / f), _.translate(u, d), this.textureSpace === "local" && _.scale(e, e), this.transform = _
        }
        destroy() {
            var t;
            (t = this.texture) == null || t.destroy(!0), this.texture = null, this.transform = null, this.colorStops = [], this.start = null, this.end = null, this.center = null, this.outerCenter = null
        }
        get styleKey() {
            return `fill-gradient-${this.uid}-${this._tick}`
        }
    };
Gn.defaultLinearOptions = {
    start: {
        x: 0,
        y: 0
    },
    end: {
        x: 0,
        y: 1
    },
    colorStops: [],
    textureSpace: "local",
    type: "linear",
    textureSize: 256,
    wrapMode: "clamp-to-edge"
};
Gn.defaultRadialOptions = {
    center: {
        x: .5,
        y: .5
    },
    innerRadius: 0,
    outerRadius: .5,
    colorStops: [],
    scale: 1,
    textureSpace: "local",
    type: "radial",
    textureSize: 256,
    wrapMode: "clamp-to-edge"
};
let ne = Gn;

function Ea(i, t) {
    for (let e = 0; e < t.length; e++) {
        const s = t[e];
        i.addColorStop(s.offset, s.color)
    }
}

function Ma(i, t) {
    const e = X.get().createCanvas(i, t),
        s = e.getContext("2d");
    return {
        canvas: e,
        context: s
    }
}

function Am(i) {
    let t = i[0] ?? {};
    return (typeof t == "number" || i[1]) && (U("8.5.2", "use options object instead"), t = {
        type: "linear",
        start: {
            x: i[0],
            y: i[1]
        },
        end: {
            x: i[2],
            y: i[3]
        },
        textureSpace: i[4],
        textureSize: i[5] ?? ne.defaultLinearOptions.textureSize
    }), t
}
const Pm = new N,
    Em = new nt;

function $l(i, t, e, s) {
    const r = t.matrix ? i.copyFrom(t.matrix).invert() : i.identity();
    if (t.textureSpace === "local") {
        const o = e.getBounds(Em);
        t.width && o.pad(t.width);
        const {
            x: a,
            y: h
        } = o, l = 1 / o.width, c = 1 / o.height, u = -a * l, d = -h * c, f = r.a, p = r.b, m = r.c, g = r.d;
        r.a *= l, r.b *= l, r.c *= c, r.d *= c, r.tx = u * f + d * m + r.tx, r.ty = u * p + d * g + r.ty
    } else r.translate(t.texture.frame.x, t.texture.frame.y), r.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
    const n = t.texture.source.style;
    return !(t.fill instanceof ne) && n.addressMode === "clamp-to-edge" && (n.addressMode = "repeat", n.update()), s && r.append(Pm.copyFrom(s).invert()), r
}
const ni = {};
Y.handleByMap(w.ShapeBuilder, ni);
Y.add(Sm, Tm, Cm, Js, xm, ym);
const Mm = new nt,
    km = new N;

function Rm(i, t) {
    const {
        geometryData: e,
        batches: s
    } = t;
    s.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
    for (let r = 0; r < i.instructions.length; r++) {
        const n = i.instructions[r];
        if (n.action === "texture") Bm(n.data, s, e);
        else if (n.action === "fill" || n.action === "stroke") {
            const o = n.action === "stroke",
                a = n.data.path.shapePath,
                h = n.data.style,
                l = n.data.hole;
            o && l && ka(l.shapePath, h, !0, s, e), l && (a.shapePrimitives[a.shapePrimitives.length - 1].holes = l.shapePath.shapePrimitives), ka(a, h, o, s, e)
        }
    }
}

function Bm(i, t, e) {
    const s = [],
        r = ni.rectangle,
        n = Mm;
    n.x = i.dx, n.y = i.dy, n.width = i.dw, n.height = i.dh;
    const o = i.transform;
    if (!r.build(n, s)) return;
    const {
        vertices: a,
        uvs: h,
        indices: l
    } = e, c = l.length, u = a.length / 2;
    o && zl(s, o), r.triangulate(s, a, 2, u, l, c);
    const d = i.image,
        f = d.uvs;
    h.push(f.x0, f.y0, f.x1, f.y1, f.x3, f.y3, f.x2, f.y2);
    const p = Et.get(In);
    p.indexOffset = c, p.indexSize = l.length - c, p.attributeOffset = u, p.attributeSize = a.length / 2 - u, p.baseColor = i.style, p.alpha = i.alpha, p.texture = d, p.geometryData = e, t.push(p)
}

function ka(i, t, e, s, r) {
    const {
        vertices: n,
        uvs: o,
        indices: a
    } = r;
    i.shapePrimitives.forEach(({
        shape: h,
        transform: l,
        holes: c
    }) => {
        const u = [],
            d = ni[h.type];
        if (!d.build(h, u)) return;
        const f = a.length,
            p = n.length / 2;
        let m = "triangle-list";
        if (l && zl(u, l), e) {
            const b = h.closePath ?? !0,
                y = t;
            y.pixelLine ? (vm(u, b, n, a), m = "line-list") : Xl(u, y, !1, b, n, a)
        } else if (c) {
            const b = [],
                y = u.slice();
            Im(c).forEach(v => {
                b.push(y.length / 2), y.push(...v)
            }), Yl(y, b, n, 2, p, a, f)
        } else d.triangulate(u, n, 2, p, a, f);
        const g = o.length / 2,
            _ = t.texture;
        if (_ !== O.WHITE) {
            const b = $l(km, t, h, l);
            mm(n, 2, p, o, g, 2, n.length / 2 - p, b)
        } else gm(o, g, 2, n.length / 2 - p);
        const x = Et.get(In);
        x.indexOffset = f, x.indexSize = a.length - f, x.attributeOffset = p, x.attributeSize = n.length / 2 - p, x.baseColor = t.color, x.alpha = t.alpha, x.texture = _, x.geometryData = r, x.topology = m, s.push(x)
    })
}

function Im(i) {
    const t = [];
    for (let e = 0; e < i.length; e++) {
        const s = i[e].shape,
            r = [];
        ni[s.type].build(s, r) && t.push(r)
    }
    return t
}
class Gm {
    constructor() {
        this.batches = [], this.geometryData = {
            vertices: [],
            uvs: [],
            indices: []
        }
    }
    reset() {
        this.batches && this.batches.forEach(t => {
            Et.return(t)
        }), this.graphicsData && Et.return(this.graphicsData), this.isBatchable = !1, this.context = null, this.batches.length = 0, this.geometryData.indices.length = 0, this.geometryData.vertices.length = 0, this.geometryData.uvs.length = 0, this.graphicsData = null
    }
    destroy() {
        this.reset(), this.batches = null, this.geometryData = null
    }
}
class Fm {
    constructor() {
        this.instructions = new yn
    }
    init(t) {
        const e = t.maxTextures;
        this.batcher ? this.batcher._updateMaxTextures(e) : this.batcher = new Bn({
            maxTextures: e
        }), this.instructions.reset()
    }
    get geometry() {
        return U(md, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry
    }
    destroy() {
        this.batcher.destroy(), this.instructions.destroy(), this.batcher = null, this.instructions = null
    }
}
const Fn = class rn {
    constructor(t) {
        this._renderer = t, this._managedContexts = new oe({
            renderer: t,
            type: "resource",
            name: "graphicsContext"
        })
    }
    init(t) {
        rn.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? rn.defaultOptions.bezierSmoothness
    }
    getContextRenderData(t) {
        return t._gpuData[this._renderer.uid].graphicsData || this._initContextRenderData(t)
    }
    updateGpuContext(t) {
        const e = !!t._gpuData[this._renderer.uid],
            s = t._gpuData[this._renderer.uid] || this._initContext(t);
        if (t.dirty || !e) {
            e && s.reset(), Rm(t, s);
            const r = t.batchMode;
            t.customShader || r === "no-batch" ? s.isBatchable = !1 : r === "auto" ? s.isBatchable = s.geometryData.vertices.length < 400 : s.isBatchable = !0, t.dirty = !1
        }
        return s
    }
    getGpuContext(t) {
        return t._gpuData[this._renderer.uid] || this._initContext(t)
    }
    _initContextRenderData(t) {
        const e = Et.get(Fm, {
                maxTextures: this._renderer.limits.maxBatchableTextures
            }),
            s = t._gpuData[this._renderer.uid],
            {
                batches: r,
                geometryData: n
            } = s;
        s.graphicsData = e;
        const o = n.vertices.length,
            a = n.indices.length;
        for (let u = 0; u < r.length; u++) r[u].applyTransform = !1;
        const h = e.batcher;
        h.ensureAttributeBuffer(o), h.ensureIndexBuffer(a), h.begin();
        for (let u = 0; u < r.length; u++) {
            const d = r[u];
            h.add(d)
        }
        h.finish(e.instructions);
        const l = h.geometry;
        l.indexBuffer.setDataWithSize(h.indexBuffer, h.indexSize, !0), l.buffers[0].setDataWithSize(h.attributeBuffer.float32View, h.attributeSize, !0);
        const c = h.batches;
        for (let u = 0; u < c.length; u++) {
            const d = c[u];
            d.bindGroup = An(d.textures.textures, d.textures.count, this._renderer.limits.maxBatchableTextures)
        }
        return e
    }
    _initContext(t) {
        const e = new Gm;
        return e.context = t, t._gpuData[this._renderer.uid] = e, this._managedContexts.add(t), e
    }
    destroy() {
        this._managedContexts.destroy(), this._renderer = null
    }
};
Fn.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem],
    name: "graphicsContext"
};
Fn.defaultOptions = {
    bezierSmoothness: .5
};
let On = Fn;
const Om = 8,
    wi = 11920929e-14,
    Lm = 1;

function jl(i, t, e, s, r, n, o, a, h, l) {
    const u = Math.min(.99, Math.max(0, l ?? On.defaultOptions.bezierSmoothness));
    let d = (Lm - u) / 1;
    return d *= d, Dm(t, e, s, r, n, o, a, h, i, d), i
}

function Dm(i, t, e, s, r, n, o, a, h, l) {
    nn(i, t, e, s, r, n, o, a, h, l, 0), h.push(o, a)
}

function nn(i, t, e, s, r, n, o, a, h, l, c) {
    if (c > Om) return;
    const u = (i + e) / 2,
        d = (t + s) / 2,
        f = (e + r) / 2,
        p = (s + n) / 2,
        m = (r + o) / 2,
        g = (n + a) / 2,
        _ = (u + f) / 2,
        x = (d + p) / 2,
        b = (f + m) / 2,
        y = (p + g) / 2,
        S = (_ + b) / 2,
        v = (x + y) / 2;
    if (c > 0) {
        let T = o - i,
            M = a - t;
        const C = Math.abs((e - o) * M - (s - a) * T),
            A = Math.abs((r - o) * M - (n - a) * T);
        if (C > wi && A > wi) {
            if ((C + A) * (C + A) <= l * (T * T + M * M)) {
                h.push(S, v);
                return
            }
        } else if (C > wi) {
            if (C * C <= l * (T * T + M * M)) {
                h.push(S, v);
                return
            }
        } else if (A > wi) {
            if (A * A <= l * (T * T + M * M)) {
                h.push(S, v);
                return
            }
        } else if (T = S - (i + o) / 2, M = v - (t + a) / 2, T * T + M * M <= l) {
            h.push(S, v);
            return
        }
    }
    nn(i, t, u, d, _, x, S, v, h, l, c + 1), nn(S, v, b, y, m, g, o, a, h, l, c + 1)
}
const Um = 8,
    Nm = 11920929e-14,
    Wm = 1;

function Hm(i, t, e, s, r, n, o, a) {
    const l = Math.min(.99, Math.max(0, a ?? On.defaultOptions.bezierSmoothness));
    let c = (Wm - l) / 1;
    return c *= c, zm(t, e, s, r, n, o, i, c), i
}

function zm(i, t, e, s, r, n, o, a) {
    on(o, i, t, e, s, r, n, a, 0), o.push(r, n)
}

function on(i, t, e, s, r, n, o, a, h) {
    if (h > Um) return;
    const l = (t + s) / 2,
        c = (e + r) / 2,
        u = (s + n) / 2,
        d = (r + o) / 2,
        f = (l + u) / 2,
        p = (c + d) / 2;
    let m = n - t,
        g = o - e;
    const _ = Math.abs((s - n) * g - (r - o) * m);
    if (_ > Nm) {
        if (_ * _ <= a * (m * m + g * g)) {
            i.push(f, p);
            return
        }
    } else if (m = f - (t + n) / 2, g = p - (e + o) / 2, m * m + g * g <= a) {
        i.push(f, p);
        return
    }
    on(i, t, e, l, c, f, p, a, h + 1), on(i, f, p, u, d, n, o, a, h + 1)
}

function ql(i, t, e, s, r, n, o, a) {
    let h = Math.abs(r - n);
    (!o && r > n || o && n > r) && (h = 2 * Math.PI - h), a || (a = Math.max(6, Math.floor(6 * Math.pow(s, 1 / 3) * (h / Math.PI)))), a = Math.max(a, 3);
    let l = h / a,
        c = r;
    l *= o ? -1 : 1;
    for (let u = 0; u < a + 1; u++) {
        const d = Math.cos(c),
            f = Math.sin(c),
            p = t + d * s,
            m = e + f * s;
        i.push(p, m), c += l
    }
}

function Vm(i, t, e, s, r, n) {
    const o = i[i.length - 2],
        h = i[i.length - 1] - e,
        l = o - t,
        c = r - e,
        u = s - t,
        d = Math.abs(h * u - l * c);
    if (d < 1e-8 || n === 0) {
        (i[i.length - 2] !== t || i[i.length - 1] !== e) && i.push(t, e);
        return
    }
    const f = h * h + l * l,
        p = c * c + u * u,
        m = h * c + l * u,
        g = n * Math.sqrt(f) / d,
        _ = n * Math.sqrt(p) / d,
        x = g * m / f,
        b = _ * m / p,
        y = g * u + _ * l,
        S = g * c + _ * h,
        v = l * (_ + x),
        T = h * (_ + x),
        M = u * (g + b),
        C = c * (g + b),
        A = Math.atan2(T - S, v - y),
        P = Math.atan2(C - S, M - y);
    ql(i, y + t, S + e, n, A, P, l * c > u * h)
}
const Xs = Math.PI * 2,
    wr = {
        centerX: 0,
        centerY: 0,
        ang1: 0,
        ang2: 0
    },
    Tr = ({
        x: i,
        y: t
    }, e, s, r, n, o, a, h) => {
        i *= e, t *= s;
        const l = r * i - n * t,
            c = n * i + r * t;
        return h.x = l + o, h.y = c + a, h
    };

function Xm(i, t) {
    const e = t === -1.5707963267948966 ? -.551915024494 : 1.3333333333333333 * Math.tan(t / 4),
        s = t === 1.5707963267948966 ? .551915024494 : e,
        r = Math.cos(i),
        n = Math.sin(i),
        o = Math.cos(i + t),
        a = Math.sin(i + t);
    return [{
        x: r - n * s,
        y: n + r * s
    }, {
        x: o + a * s,
        y: a - o * s
    }, {
        x: o,
        y: a
    }]
}
const Ra = (i, t, e, s) => {
        const r = i * s - t * e < 0 ? -1 : 1;
        let n = i * e + t * s;
        return n > 1 && (n = 1), n < -1 && (n = -1), r * Math.acos(n)
    },
    Ym = (i, t, e, s, r, n, o, a, h, l, c, u, d) => {
        const f = Math.pow(r, 2),
            p = Math.pow(n, 2),
            m = Math.pow(c, 2),
            g = Math.pow(u, 2);
        let _ = f * p - f * g - p * m;
        _ < 0 && (_ = 0), _ /= f * g + p * m, _ = Math.sqrt(_) * (o === a ? -1 : 1);
        const x = _ * r / n * u,
            b = _ * -n / r * c,
            y = l * x - h * b + (i + e) / 2,
            S = h * x + l * b + (t + s) / 2,
            v = (c - x) / r,
            T = (u - b) / n,
            M = (-c - x) / r,
            C = (-u - b) / n,
            A = Ra(1, 0, v, T);
        let P = Ra(v, T, M, C);
        a === 0 && P > 0 && (P -= Xs), a === 1 && P < 0 && (P += Xs), d.centerX = y, d.centerY = S, d.ang1 = A, d.ang2 = P
    };

function $m(i, t, e, s, r, n, o, a = 0, h = 0, l = 0) {
    if (n === 0 || o === 0) return;
    const c = Math.sin(a * Xs / 360),
        u = Math.cos(a * Xs / 360),
        d = u * (t - s) / 2 + c * (e - r) / 2,
        f = -c * (t - s) / 2 + u * (e - r) / 2;
    if (d === 0 && f === 0) return;
    n = Math.abs(n), o = Math.abs(o);
    const p = Math.pow(d, 2) / Math.pow(n, 2) + Math.pow(f, 2) / Math.pow(o, 2);
    p > 1 && (n *= Math.sqrt(p), o *= Math.sqrt(p)), Ym(t, e, s, r, n, o, h, l, c, u, d, f, wr);
    let {
        ang1: m,
        ang2: g
    } = wr;
    const {
        centerX: _,
        centerY: x
    } = wr;
    let b = Math.abs(g) / (Xs / 4);
    Math.abs(1 - b) < 1e-7 && (b = 1);
    const y = Math.max(Math.ceil(b), 1);
    g /= y;
    let S = i[i.length - 2],
        v = i[i.length - 1];
    const T = {
        x: 0,
        y: 0
    };
    for (let M = 0; M < y; M++) {
        const C = Xm(m, g),
            {
                x: A,
                y: P
            } = Tr(C[0], n, o, u, c, _, x, T),
            {
                x: k,
                y: G
            } = Tr(C[1], n, o, u, c, _, x, T),
            {
                x: F,
                y: ht
            } = Tr(C[2], n, o, u, c, _, x, T);
        jl(i, S, v, A, P, k, G, F, ht), S = F, v = ht, m += g
    }
}

function jm(i, t, e) {
    const s = (o, a) => {
            const h = a.x - o.x,
                l = a.y - o.y,
                c = Math.sqrt(h * h + l * l),
                u = h / c,
                d = l / c;
            return {
                len: c,
                nx: u,
                ny: d
            }
        },
        r = (o, a) => {
            o === 0 ? i.moveTo(a.x, a.y) : i.lineTo(a.x, a.y)
        };
    let n = t[t.length - 1];
    for (let o = 0; o < t.length; o++) {
        const a = t[o % t.length],
            h = a.radius ?? e;
        if (h <= 0) {
            r(o, a), n = a;
            continue
        }
        const l = t[(o + 1) % t.length],
            c = s(a, n),
            u = s(a, l);
        if (c.len < 1e-4 || u.len < 1e-4) {
            r(o, a), n = a;
            continue
        }
        let d = Math.asin(c.nx * u.ny - c.ny * u.nx),
            f = 1,
            p = !1;
        c.nx * u.nx - c.ny * -u.ny < 0 ? d < 0 ? d = Math.PI + d : (d = Math.PI - d, f = -1, p = !0) : d > 0 && (f = -1, p = !0);
        const m = d / 2;
        let g, _ = Math.abs(Math.cos(m) * h / Math.sin(m));
        _ > Math.min(c.len / 2, u.len / 2) ? (_ = Math.min(c.len / 2, u.len / 2), g = Math.abs(_ * Math.sin(m) / Math.cos(m))) : g = h;
        const x = a.x + u.nx * _ + -u.ny * g * f,
            b = a.y + u.ny * _ + u.nx * g * f,
            y = Math.atan2(c.ny, c.nx) + Math.PI / 2 * f,
            S = Math.atan2(u.ny, u.nx) - Math.PI / 2 * f;
        o === 0 && i.moveTo(x + Math.cos(y) * g, b + Math.sin(y) * g), i.arc(x, b, g, y, S, p), n = a
    }
}

function qm(i, t, e, s) {
    const r = (a, h) => Math.sqrt((a.x - h.x) ** 2 + (a.y - h.y) ** 2),
        n = (a, h, l) => ({
            x: a.x + (h.x - a.x) * l,
            y: a.y + (h.y - a.y) * l
        }),
        o = t.length;
    for (let a = 0; a < o; a++) {
        const h = t[(a + 1) % o],
            l = h.radius ?? e;
        if (l <= 0) {
            a === 0 ? i.moveTo(h.x, h.y) : i.lineTo(h.x, h.y);
            continue
        }
        const c = t[a],
            u = t[(a + 2) % o],
            d = r(c, h);
        let f;
        if (d < 1e-4) f = h;
        else {
            const g = Math.min(d / 2, l);
            f = n(h, c, g / d)
        }
        const p = r(u, h);
        let m;
        if (p < 1e-4) m = h;
        else {
            const g = Math.min(p / 2, l);
            m = n(h, u, g / p)
        }
        a === 0 ? i.moveTo(f.x, f.y) : i.lineTo(f.x, f.y), i.quadraticCurveTo(h.x, h.y, m.x, m.y, s)
    }
}
const Km = new nt;
class Zm {
    constructor(t) {
        this.shapePrimitives = [], this._currentPoly = null, this._bounds = new Ft, this._graphicsPath2D = t, this.signed = t.checkForHoles
    }
    moveTo(t, e) {
        return this.startPoly(t, e), this
    }
    lineTo(t, e) {
        this._ensurePoly();
        const s = this._currentPoly.points,
            r = s[s.length - 2],
            n = s[s.length - 1];
        return (r !== t || n !== e) && s.push(t, e), this
    }
    arc(t, e, s, r, n, o) {
        this._ensurePoly(!1);
        const a = this._currentPoly.points;
        return ql(a, t, e, s, r, n, o), this
    }
    arcTo(t, e, s, r, n) {
        this._ensurePoly();
        const o = this._currentPoly.points;
        return Vm(o, t, e, s, r, n), this
    }
    arcToSvg(t, e, s, r, n, o, a) {
        const h = this._currentPoly.points;
        return $m(h, this._currentPoly.lastX, this._currentPoly.lastY, o, a, t, e, s, r, n), this
    }
    bezierCurveTo(t, e, s, r, n, o, a) {
        this._ensurePoly();
        const h = this._currentPoly;
        return jl(this._currentPoly.points, h.lastX, h.lastY, t, e, s, r, n, o, a), this
    }
    quadraticCurveTo(t, e, s, r, n) {
        this._ensurePoly();
        const o = this._currentPoly;
        return Hm(this._currentPoly.points, o.lastX, o.lastY, t, e, s, r, n), this
    }
    closePath() {
        return this.endPoly(!0), this
    }
    addPath(t, e) {
        this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
        const s = this.shapePrimitives,
            r = s.length;
        for (let n = 0; n < t.instructions.length; n++) {
            const o = t.instructions[n];
            this[o.action](...o.data)
        }
        if (t.checkForHoles && s.length - r > 1) {
            let n = null;
            for (let o = r; o < s.length; o++) {
                const a = s[o];
                if (a.shape.type === "polygon") {
                    const h = a.shape,
                        l = n == null ? void 0 : n.shape;
                    l && l.containsPolygon(h) ? (n.holes || (n.holes = []), n.holes.push(a), s.copyWithin(o, o + 1), s.length--, o--) : n = a
                }
            }
        }
        return this
    }
    finish(t = !1) {
        this.endPoly(t)
    }
    rect(t, e, s, r, n) {
        return this.drawShape(new nt(t, e, s, r), n), this
    }
    circle(t, e, s, r) {
        return this.drawShape(new Tn(t, e, s), r), this
    }
    poly(t, e, s) {
        const r = new zs(t);
        return r.closePath = e, this.drawShape(r, s), this
    }
    regularPoly(t, e, s, r, n = 0, o) {
        r = Math.max(r | 0, 3);
        const a = -1 * Math.PI / 2 + n,
            h = Math.PI * 2 / r,
            l = [];
        for (let c = 0; c < r; c++) {
            const u = a - c * h;
            l.push(t + s * Math.cos(u), e + s * Math.sin(u))
        }
        return this.poly(l, !0, o), this
    }
    roundPoly(t, e, s, r, n, o = 0, a) {
        if (r = Math.max(r | 0, 3), n <= 0) return this.regularPoly(t, e, s, r, o);
        const h = s * Math.sin(Math.PI / r) - .001;
        n = Math.min(n, h);
        const l = -1 * Math.PI / 2 + o,
            c = Math.PI * 2 / r,
            u = (r - 2) * Math.PI / r / 2;
        for (let d = 0; d < r; d++) {
            const f = d * c + l,
                p = t + s * Math.cos(f),
                m = e + s * Math.sin(f),
                g = f + Math.PI + u,
                _ = f - Math.PI - u,
                x = p + n * Math.cos(g),
                b = m + n * Math.sin(g),
                y = p + n * Math.cos(_),
                S = m + n * Math.sin(_);
            d === 0 ? this.moveTo(x, b) : this.lineTo(x, b), this.quadraticCurveTo(p, m, y, S, a)
        }
        return this.closePath()
    }
    roundShape(t, e, s = !1, r) {
        return t.length < 3 ? this : (s ? qm(this, t, e, r) : jm(this, t, e), this.closePath())
    }
    filletRect(t, e, s, r, n) {
        if (n === 0) return this.rect(t, e, s, r);
        const o = Math.min(s, r) / 2,
            a = Math.min(o, Math.max(-o, n)),
            h = t + s,
            l = e + r,
            c = a < 0 ? -a : 0,
            u = Math.abs(a);
        return this.moveTo(t, e + u).arcTo(t + c, e + c, t + u, e, u).lineTo(h - u, e).arcTo(h - c, e + c, h, e + u, u).lineTo(h, l - u).arcTo(h - c, l - c, t + s - u, l, u).lineTo(t + u, l).arcTo(t + c, l - c, t, l - u, u).closePath()
    }
    chamferRect(t, e, s, r, n, o) {
        if (n <= 0) return this.rect(t, e, s, r);
        const a = Math.min(n, Math.min(s, r) / 2),
            h = t + s,
            l = e + r,
            c = [t + a, e, h - a, e, h, e + a, h, l - a, h - a, l, t + a, l, t, l - a, t, e + a];
        for (let u = c.length - 1; u >= 2; u -= 2) c[u] === c[u - 2] && c[u - 1] === c[u - 3] && c.splice(u - 1, 2);
        return this.poly(c, !0, o)
    }
    ellipse(t, e, s, r, n) {
        return this.drawShape(new Sn(t, e, s, r), n), this
    }
    roundRect(t, e, s, r, n, o) {
        return this.drawShape(new Cn(t, e, s, r, n), o), this
    }
    drawShape(t, e) {
        return this.endPoly(), this.shapePrimitives.push({
            shape: t,
            transform: e
        }), this
    }
    startPoly(t, e) {
        let s = this._currentPoly;
        return s && this.endPoly(), s = new zs, s.points.push(t, e), this._currentPoly = s, this
    }
    endPoly(t = !1) {
        const e = this._currentPoly;
        return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({
            shape: e
        })), this._currentPoly = null, this
    }
    _ensurePoly(t = !0) {
        if (!this._currentPoly && (this._currentPoly = new zs, t)) {
            const e = this.shapePrimitives[this.shapePrimitives.length - 1];
            if (e) {
                let s = e.shape.x,
                    r = e.shape.y;
                if (e.transform && !e.transform.isIdentity()) {
                    const n = e.transform,
                        o = s;
                    s = n.a * s + n.c * r + n.tx, r = n.b * o + n.d * r + n.ty
                }
                this._currentPoly.points.push(s, r)
            } else this._currentPoly.points.push(0, 0)
        }
    }
    buildPath() {
        const t = this._graphicsPath2D;
        this.shapePrimitives.length = 0, this._currentPoly = null;
        for (let e = 0; e < t.instructions.length; e++) {
            const s = t.instructions[e];
            this[s.action](...s.data)
        }
        this.finish()
    }
    get bounds() {
        const t = this._bounds;
        t.clear();
        const e = this.shapePrimitives;
        for (let s = 0; s < e.length; s++) {
            const r = e[s],
                n = r.shape.getBounds(Km);
            r.transform ? t.addRect(n, r.transform) : t.addRect(n)
        }
        return t
    }
}
class pe {
    constructor(t, e = !1) {
        this.instructions = [], this.uid = pt("graphicsPath"), this._dirty = !0, this.checkForHoles = e, typeof t == "string" ? Fp(t, this) : this.instructions = (t == null ? void 0 : t.slice()) ?? []
    }
    get shapePath() {
        return this._shapePath || (this._shapePath = new Zm(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath
    }
    addPath(t, e) {
        return t = t.clone(), this.instructions.push({
            action: "addPath",
            data: [t, e]
        }), this._dirty = !0, this
    }
    arc(...t) {
        return this.instructions.push({
            action: "arc",
            data: t
        }), this._dirty = !0, this
    }
    arcTo(...t) {
        return this.instructions.push({
            action: "arcTo",
            data: t
        }), this._dirty = !0, this
    }
    arcToSvg(...t) {
        return this.instructions.push({
            action: "arcToSvg",
            data: t
        }), this._dirty = !0, this
    }
    bezierCurveTo(...t) {
        return this.instructions.push({
            action: "bezierCurveTo",
            data: t
        }), this._dirty = !0, this
    }
    bezierCurveToShort(t, e, s, r, n) {
        const o = this.instructions[this.instructions.length - 1],
            a = this.getLastPoint(mt.shared);
        let h = 0,
            l = 0;
        if (!o || o.action !== "bezierCurveTo") h = a.x, l = a.y;
        else {
            h = o.data[2], l = o.data[3];
            const c = a.x,
                u = a.y;
            h = c + (c - h), l = u + (u - l)
        }
        return this.instructions.push({
            action: "bezierCurveTo",
            data: [h, l, t, e, s, r, n]
        }), this._dirty = !0, this
    }
    closePath() {
        return this.instructions.push({
            action: "closePath",
            data: []
        }), this._dirty = !0, this
    }
    ellipse(...t) {
        return this.instructions.push({
            action: "ellipse",
            data: t
        }), this._dirty = !0, this
    }
    lineTo(...t) {
        return this.instructions.push({
            action: "lineTo",
            data: t
        }), this._dirty = !0, this
    }
    moveTo(...t) {
        return this.instructions.push({
            action: "moveTo",
            data: t
        }), this
    }
    quadraticCurveTo(...t) {
        return this.instructions.push({
            action: "quadraticCurveTo",
            data: t
        }), this._dirty = !0, this
    }
    quadraticCurveToShort(t, e, s) {
        const r = this.instructions[this.instructions.length - 1],
            n = this.getLastPoint(mt.shared);
        let o = 0,
            a = 0;
        if (!r || r.action !== "quadraticCurveTo") o = n.x, a = n.y;
        else {
            o = r.data[0], a = r.data[1];
            const h = n.x,
                l = n.y;
            o = h + (h - o), a = l + (l - a)
        }
        return this.instructions.push({
            action: "quadraticCurveTo",
            data: [o, a, t, e, s]
        }), this._dirty = !0, this
    }
    rect(t, e, s, r, n) {
        return this.instructions.push({
            action: "rect",
            data: [t, e, s, r, n]
        }), this._dirty = !0, this
    }
    circle(t, e, s, r) {
        return this.instructions.push({
            action: "circle",
            data: [t, e, s, r]
        }), this._dirty = !0, this
    }
    roundRect(...t) {
        return this.instructions.push({
            action: "roundRect",
            data: t
        }), this._dirty = !0, this
    }
    poly(...t) {
        return this.instructions.push({
            action: "poly",
            data: t
        }), this._dirty = !0, this
    }
    regularPoly(...t) {
        return this.instructions.push({
            action: "regularPoly",
            data: t
        }), this._dirty = !0, this
    }
    roundPoly(...t) {
        return this.instructions.push({
            action: "roundPoly",
            data: t
        }), this._dirty = !0, this
    }
    roundShape(...t) {
        return this.instructions.push({
            action: "roundShape",
            data: t
        }), this._dirty = !0, this
    }
    filletRect(...t) {
        return this.instructions.push({
            action: "filletRect",
            data: t
        }), this._dirty = !0, this
    }
    chamferRect(...t) {
        return this.instructions.push({
            action: "chamferRect",
            data: t
        }), this._dirty = !0, this
    }
    star(t, e, s, r, n, o, a) {
        n || (n = r / 2);
        const h = -1 * Math.PI / 2 + o,
            l = s * 2,
            c = Math.PI * 2 / l,
            u = [];
        for (let d = 0; d < l; d++) {
            const f = d % 2 ? n : r,
                p = d * c + h;
            u.push(t + f * Math.cos(p), e + f * Math.sin(p))
        }
        return this.poly(u, !0, a), this
    }
    clone(t = !1) {
        const e = new pe;
        if (e.checkForHoles = this.checkForHoles, !t) e.instructions = this.instructions.slice();
        else
            for (let s = 0; s < this.instructions.length; s++) {
                const r = this.instructions[s];
                e.instructions.push({
                    action: r.action,
                    data: r.data.slice()
                })
            }
        return e
    }
    clear() {
        return this.instructions.length = 0, this._dirty = !0, this
    }
    transform(t) {
        if (t.isIdentity()) return this;
        const e = t.a,
            s = t.b,
            r = t.c,
            n = t.d,
            o = t.tx,
            a = t.ty;
        let h = 0,
            l = 0,
            c = 0,
            u = 0,
            d = 0,
            f = 0,
            p = 0,
            m = 0;
        for (let g = 0; g < this.instructions.length; g++) {
            const _ = this.instructions[g],
                x = _.data;
            switch (_.action) {
                case "moveTo":
                case "lineTo":
                    h = x[0], l = x[1], x[0] = e * h + r * l + o, x[1] = s * h + n * l + a;
                    break;
                case "bezierCurveTo":
                    c = x[0], u = x[1], d = x[2], f = x[3], h = x[4], l = x[5], x[0] = e * c + r * u + o, x[1] = s * c + n * u + a, x[2] = e * d + r * f + o, x[3] = s * d + n * f + a, x[4] = e * h + r * l + o, x[5] = s * h + n * l + a;
                    break;
                case "quadraticCurveTo":
                    c = x[0], u = x[1], h = x[2], l = x[3], x[0] = e * c + r * u + o, x[1] = s * c + n * u + a, x[2] = e * h + r * l + o, x[3] = s * h + n * l + a;
                    break;
                case "arcToSvg":
                    h = x[5], l = x[6], p = x[0], m = x[1], x[0] = e * p + r * m, x[1] = s * p + n * m, x[5] = e * h + r * l + o, x[6] = s * h + n * l + a;
                    break;
                case "circle":
                    x[4] = Rs(x[3], t);
                    break;
                case "rect":
                    x[4] = Rs(x[4], t);
                    break;
                case "ellipse":
                    x[8] = Rs(x[8], t);
                    break;
                case "roundRect":
                    x[5] = Rs(x[5], t);
                    break;
                case "addPath":
                    x[0].transform(t);
                    break;
                case "poly":
                    x[2] = Rs(x[2], t);
                    break;
                default:
                    V("unknown transform action", _.action);
                    break
            }
        }
        return this._dirty = !0, this
    }
    get bounds() {
        return this.shapePath.bounds
    }
    getLastPoint(t) {
        let e = this.instructions.length - 1,
            s = this.instructions[e];
        if (!s) return t.x = 0, t.y = 0, t;
        for (; s.action === "closePath";) {
            if (e--, e < 0) return t.x = 0, t.y = 0, t;
            s = this.instructions[e]
        }
        switch (s.action) {
            case "moveTo":
            case "lineTo":
                t.x = s.data[0], t.y = s.data[1];
                break;
            case "quadraticCurveTo":
                t.x = s.data[2], t.y = s.data[3];
                break;
            case "bezierCurveTo":
                t.x = s.data[4], t.y = s.data[5];
                break;
            case "arc":
            case "arcToSvg":
                t.x = s.data[5], t.y = s.data[6];
                break;
            case "addPath":
                s.data[0].getLastPoint(t);
                break
        }
        return t
    }
}

function Rs(i, t) {
    return i ? i.prepend(t) : t.clone()
}

function yt(i, t, e) {
    const s = i.getAttribute(t);
    return s ? Number(s) : e
}

function Qm(i, t) {
    const e = i.querySelectorAll("defs");
    for (let s = 0; s < e.length; s++) {
        const r = e[s];
        for (let n = 0; n < r.children.length; n++) {
            const o = r.children[n];
            switch (o.nodeName.toLowerCase()) {
                case "lineargradient":
                    t.defs[o.id] = Jm(o);
                    break;
                case "radialgradient":
                    t.defs[o.id] = tg();
                    break
            }
        }
    }
}

function Jm(i) {
    const t = yt(i, "x1", 0),
        e = yt(i, "y1", 0),
        s = yt(i, "x2", 1),
        r = yt(i, "y2", 0),
        n = i.getAttribute("gradientUnits") || "objectBoundingBox",
        o = new ne(t, e, s, r, n === "objectBoundingBox" ? "local" : "global");
    for (let a = 0; a < i.children.length; a++) {
        const h = i.children[a],
            l = yt(h, "offset", 0),
            c = lt.shared.setValue(h.getAttribute("stop-color")).toNumber();
        o.addColorStop(l, c)
    }
    return o
}

function tg(i) {
    return V("[SVG Parser] Radial gradients are not yet supported"), new ne(0, 0, 1, 0)
}

function Ba(i) {
    const t = i.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
    return t ? t[1] : ""
}
const Ia = {
    fill: {
        type: "paint",
        default: 0
    },
    "fill-opacity": {
        type: "number",
        default: 1
    },
    stroke: {
        type: "paint",
        default: 0
    },
    "stroke-width": {
        type: "number",
        default: 1
    },
    "stroke-opacity": {
        type: "number",
        default: 1
    },
    "stroke-linecap": {
        type: "string",
        default: "butt"
    },
    "stroke-linejoin": {
        type: "string",
        default: "miter"
    },
    "stroke-miterlimit": {
        type: "number",
        default: 10
    },
    "stroke-dasharray": {
        type: "string",
        default: "none"
    },
    "stroke-dashoffset": {
        type: "number",
        default: 0
    },
    opacity: {
        type: "number",
        default: 1
    }
};

function Kl(i, t) {
    const e = i.getAttribute("style"),
        s = {},
        r = {},
        n = {
            strokeStyle: s,
            fillStyle: r,
            useFill: !1,
            useStroke: !1
        };
    for (const o in Ia) {
        const a = i.getAttribute(o);
        a && Ga(t, n, o, a.trim())
    }
    if (e) {
        const o = e.split(";");
        for (let a = 0; a < o.length; a++) {
            const h = o[a].trim(),
                [l, c] = h.split(":");
            Ia[l] && Ga(t, n, l, c.trim())
        }
    }
    return {
        strokeStyle: n.useStroke ? s : null,
        fillStyle: n.useFill ? r : null,
        useFill: n.useFill,
        useStroke: n.useStroke
    }
}

function Ga(i, t, e, s) {
    switch (e) {
        case "stroke":
            if (s !== "none") {
                if (s.startsWith("url(")) {
                    const r = Ba(s);
                    t.strokeStyle.fill = i.defs[r]
                } else t.strokeStyle.color = lt.shared.setValue(s).toNumber();
                t.useStroke = !0
            }
            break;
        case "stroke-width":
            t.strokeStyle.width = Number(s);
            break;
        case "fill":
            if (s !== "none") {
                if (s.startsWith("url(")) {
                    const r = Ba(s);
                    t.fillStyle.fill = i.defs[r]
                } else t.fillStyle.color = lt.shared.setValue(s).toNumber();
                t.useFill = !0
            }
            break;
        case "fill-opacity":
            t.fillStyle.alpha = Number(s);
            break;
        case "stroke-opacity":
            t.strokeStyle.alpha = Number(s);
            break;
        case "opacity":
            t.fillStyle.alpha = Number(s), t.strokeStyle.alpha = Number(s);
            break
    }
}

function eg(i) {
    if (i.length <= 2) return !0;
    const t = i.map(a => a.area).sort((a, h) => h - a),
        [e, s] = t,
        r = t[t.length - 1],
        n = e / s,
        o = s / r;
    return !(n > 3 && o < 2)
}

function sg(i) {
    return i.split(/(?=[Mm])/).filter(s => s.trim().length > 0)
}

function ig(i) {
    const t = i.match(/[-+]?[0-9]*\.?[0-9]+/g);
    if (!t || t.length < 4) return 0;
    const e = t.map(Number),
        s = [],
        r = [];
    for (let c = 0; c < e.length; c += 2) c + 1 < e.length && (s.push(e[c]), r.push(e[c + 1]));
    if (s.length === 0 || r.length === 0) return 0;
    const n = Math.min(...s),
        o = Math.max(...s),
        a = Math.min(...r),
        h = Math.max(...r);
    return (o - n) * (h - a)
}

function Fa(i, t) {
    const e = new pe(i, !1);
    for (const s of e.instructions) t.instructions.push(s)
}

function rg(i, t) {
    if (typeof i == "string") {
        const o = document.createElement("div");
        o.innerHTML = i.trim(), i = o.querySelector("svg")
    }
    const e = {
        context: t,
        defs: {},
        path: new pe
    };
    Qm(i, e);
    const s = i.children,
        {
            fillStyle: r,
            strokeStyle: n
        } = Kl(i, e);
    for (let o = 0; o < s.length; o++) {
        const a = s[o];
        a.nodeName.toLowerCase() !== "defs" && Zl(a, e, r, n)
    }
    return t
}

function Zl(i, t, e, s) {
    const r = i.children,
        {
            fillStyle: n,
            strokeStyle: o
        } = Kl(i, t);
    n && e ? e = {
        ...e,
        ...n
    } : n && (e = n), o && s ? s = {
        ...s,
        ...o
    } : o && (s = o);
    const a = !e && !s;
    a && (e = {
        color: 0
    });
    let h, l, c, u, d, f, p, m, g, _, x, b, y, S, v, T, M;
    switch (i.nodeName.toLowerCase()) {
        case "path": {
            S = i.getAttribute("d");
            const C = i.getAttribute("fill-rule"),
                A = sg(S),
                P = C === "evenodd",
                k = A.length > 1;
            if (P && k) {
                const F = A.map(R => ({
                    path: R,
                    area: ig(R)
                }));
                if (F.sort((R, I) => I.area - R.area), A.length > 3 || !eg(F))
                    for (let R = 0; R < F.length; R++) {
                        const I = F[R],
                            z = R === 0;
                        t.context.beginPath();
                        const B = new pe(void 0, !0);
                        Fa(I.path, B), t.context.path(B), z ? (e && t.context.fill(e), s && t.context.stroke(s)) : t.context.cut()
                    } else
                        for (let R = 0; R < F.length; R++) {
                            const I = F[R],
                                z = R % 2 === 1;
                            t.context.beginPath();
                            const B = new pe(void 0, !0);
                            Fa(I.path, B), t.context.path(B), z ? t.context.cut() : (e && t.context.fill(e), s && t.context.stroke(s))
                        }
            } else {
                const F = C ? C === "evenodd" : !0;
                v = new pe(S, F), t.context.path(v), e && t.context.fill(e), s && t.context.stroke(s)
            }
            break
        }
        case "circle":
            p = yt(i, "cx", 0), m = yt(i, "cy", 0), g = yt(i, "r", 0), t.context.ellipse(p, m, g, g), e && t.context.fill(e), s && t.context.stroke(s);
            break;
        case "rect":
            h = yt(i, "x", 0), l = yt(i, "y", 0), T = yt(i, "width", 0), M = yt(i, "height", 0), _ = yt(i, "rx", 0), x = yt(i, "ry", 0), _ || x ? t.context.roundRect(h, l, T, M, _ || x) : t.context.rect(h, l, T, M), e && t.context.fill(e), s && t.context.stroke(s);
            break;
        case "ellipse":
            p = yt(i, "cx", 0), m = yt(i, "cy", 0), _ = yt(i, "rx", 0), x = yt(i, "ry", 0), t.context.beginPath(), t.context.ellipse(p, m, _, x), e && t.context.fill(e), s && t.context.stroke(s);
            break;
        case "line":
            c = yt(i, "x1", 0), u = yt(i, "y1", 0), d = yt(i, "x2", 0), f = yt(i, "y2", 0), t.context.beginPath(), t.context.moveTo(c, u), t.context.lineTo(d, f), s && t.context.stroke(s);
            break;
        case "polygon":
            y = i.getAttribute("points"), b = y.match(/-?\d+/g).map(C => parseInt(C, 10)), t.context.poly(b, !0), e && t.context.fill(e), s && t.context.stroke(s);
            break;
        case "polyline":
            y = i.getAttribute("points"), b = y.match(/-?\d+/g).map(C => parseInt(C, 10)), t.context.poly(b, !1), s && t.context.stroke(s);
            break;
        case "g":
        case "svg":
            break;
        default: {
            V(`[SVG parser] <${i.nodeName}> elements unsupported`);
            break
        }
    }
    a && (e = null);
    for (let C = 0; C < r.length; C++) Zl(r[C], t, e, s)
}
const Oa = {
    repeat: {
        addressModeU: "repeat",
        addressModeV: "repeat"
    },
    "repeat-x": {
        addressModeU: "repeat",
        addressModeV: "clamp-to-edge"
    },
    "repeat-y": {
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
    },
    "no-repeat": {
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge"
    }
};
class oi {
    constructor(t, e) {
        this.uid = pt("fillPattern"), this._tick = 0, this.transform = new N, this.texture = t, this.transform.scale(1 / t.frame.width, 1 / t.frame.height), e && (t.source.style.addressModeU = Oa[e].addressModeU, t.source.style.addressModeV = Oa[e].addressModeV)
    }
    setTransform(t) {
        const e = this.texture;
        this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(1 / e.frame.width, 1 / e.frame.height), this._tick++
    }
    get texture() {
        return this._texture
    }
    set texture(t) {
        this._texture !== t && (this._texture = t, this._tick++)
    }
    get styleKey() {
        return `fill-pattern-${this.uid}-${this._tick}`
    }
    destroy() {
        this.texture.destroy(!0), this.texture = null
    }
}

function ng(i) {
    return lt.isColorLike(i)
}

function La(i) {
    return i instanceof oi
}

function Da(i) {
    return i instanceof ne
}

function og(i) {
    return i instanceof O
}

function ag(i, t, e) {
    const s = lt.shared.setValue(t ?? 0);
    return i.color = s.toNumber(), i.alpha = s.alpha === 1 ? e.alpha : s.alpha, i.texture = O.WHITE, {
        ...e,
        ...i
    }
}

function hg(i, t, e) {
    return i.texture = t, {
        ...e,
        ...i
    }
}

function Ua(i, t, e) {
    return i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, {
        ...e,
        ...i
    }
}

function Na(i, t, e) {
    return t.buildGradient(), i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, i.textureSpace = t.textureSpace, {
        ...e,
        ...i
    }
}

function lg(i, t) {
    const e = {
            ...t,
            ...i
        },
        s = lt.shared.setValue(e.color);
    return e.alpha *= s.alpha, e.color = s.toNumber(), e
}

function Ne(i, t) {
    if (i == null) return null;
    const e = {},
        s = i;
    return ng(i) ? ag(e, i, t) : og(i) ? hg(e, i, t) : La(i) ? Ua(e, i, t) : Da(i) ? Na(e, i, t) : s.fill && La(s.fill) ? Ua(s, s.fill, t) : s.fill && Da(s.fill) ? Na(s, s.fill, t) : lg(s, t)
}

function Hi(i, t) {
    const {
        width: e,
        alignment: s,
        miterLimit: r,
        cap: n,
        join: o,
        pixelLine: a,
        ...h
    } = t, l = Ne(i, h);
    return l ? {
        width: e,
        alignment: s,
        miterLimit: r,
        cap: n,
        join: o,
        pixelLine: a,
        ...l
    } : null
}

function cg(i, t) {
    let e = 1;
    const s = i.shapePath.shapePrimitives;
    for (let r = 0; r < s.length; r++) {
        const n = s[r].shape;
        if (n.type !== "polygon") continue;
        const o = n.points,
            a = o.length;
        if (a < 6) continue;
        const h = n.closePath;
        for (let l = 0; l < a; l += 2) {
            if (!h && (l === 0 || l === a - 2)) continue;
            const c = (l - 2 + a) % a,
                u = (l + 2) % a,
                d = o[c],
                f = o[c + 1],
                p = o[l],
                m = o[l + 1],
                g = o[u],
                _ = o[u + 1],
                x = d - p,
                b = f - m,
                y = g - p,
                S = _ - m,
                v = x * x + b * b,
                T = y * y + S * S;
            if (v < 1e-12 || T < 1e-12) continue;
            let A = (x * y + b * S) / Math.sqrt(v * T);
            A < -1 ? A = -1 : A > 1 && (A = 1);
            const P = Math.sqrt((1 - A) * .5);
            if (P < 1e-6) continue;
            const k = Math.min(1 / P, t);
            k > e && (e = k)
        }
    }
    return e
}
const ug = new mt,
    Wa = new N,
    Ln = class ie extends Xt {
        constructor() {
            super(...arguments), this._gpuData = Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = pt("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this.destroyed = !1, this._activePath = new pe, this._transform = new N, this._fillStyle = {
                ...ie.defaultFillStyle
            }, this._strokeStyle = {
                ...ie.defaultStrokeStyle
            }, this._stateStack = [], this._tick = 0, this._bounds = new Ft, this._boundsDirty = !0
        }
        clone() {
            const t = new ie;
            return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = {
                ...this._fillStyle
            }, t._strokeStyle = {
                ...this._strokeStyle
            }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t
        }
        get fillStyle() {
            return this._fillStyle
        }
        set fillStyle(t) {
            this._fillStyle = Ne(t, ie.defaultFillStyle)
        }
        get strokeStyle() {
            return this._strokeStyle
        }
        set strokeStyle(t) {
            this._strokeStyle = Hi(t, ie.defaultStrokeStyle)
        }
        setFillStyle(t) {
            return this._fillStyle = Ne(t, ie.defaultFillStyle), this
        }
        setStrokeStyle(t) {
            return this._strokeStyle = Ne(t, ie.defaultStrokeStyle), this
        }
        texture(t, e, s, r, n, o) {
            return this.instructions.push({
                action: "texture",
                data: {
                    image: t,
                    dx: s || 0,
                    dy: r || 0,
                    dw: n || t.frame.width,
                    dh: o || t.frame.height,
                    transform: this._transform.clone(),
                    alpha: this._fillStyle.alpha,
                    style: e || e === 0 ? lt.shared.setValue(e).toNumber() : 16777215
                }
            }), this.onUpdate(), this
        }
        beginPath() {
            return this._activePath = new pe, this
        }
        fill(t, e) {
            let s;
            const r = this.instructions[this.instructions.length - 1];
            return this._tick === 0 && (r == null ? void 0 : r.action) === "stroke" ? s = r.data.path : s = this._activePath.clone(), s ? (t != null && (e !== void 0 && typeof t == "number" && (U(at, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = {
                color: t,
                alpha: e
            }), this._fillStyle = Ne(t, ie.defaultFillStyle)), this.instructions.push({
                action: "fill",
                data: {
                    style: this.fillStyle,
                    path: s
                }
            }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this
        }
        _initNextPathLocation() {
            const {
                x: t,
                y: e
            } = this._activePath.getLastPoint(mt.shared);
            this._activePath.clear(), this._activePath.moveTo(t, e)
        }
        stroke(t) {
            let e;
            const s = this.instructions[this.instructions.length - 1];
            return this._tick === 0 && (s == null ? void 0 : s.action) === "fill" ? e = s.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = Hi(t, ie.defaultStrokeStyle)), this.instructions.push({
                action: "stroke",
                data: {
                    style: this.strokeStyle,
                    path: e
                }
            }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this
        }
        cut() {
            for (let t = 0; t < 2; t++) {
                const e = this.instructions[this.instructions.length - 1 - t],
                    s = this._activePath.clone();
                if (e && (e.action === "stroke" || e.action === "fill"))
                    if (e.data.hole) e.data.hole.addPath(s);
                    else {
                        e.data.hole = s;
                        break
                    }
            }
            return this._initNextPathLocation(), this
        }
        arc(t, e, s, r, n, o) {
            this._tick++;
            const a = this._transform;
            return this._activePath.arc(a.a * t + a.c * e + a.tx, a.b * t + a.d * e + a.ty, s, r, n, o), this
        }
        arcTo(t, e, s, r, n) {
            this._tick++;
            const o = this._transform;
            return this._activePath.arcTo(o.a * t + o.c * e + o.tx, o.b * t + o.d * e + o.ty, o.a * s + o.c * r + o.tx, o.b * s + o.d * r + o.ty, n), this
        }
        arcToSvg(t, e, s, r, n, o, a) {
            this._tick++;
            const h = this._transform;
            return this._activePath.arcToSvg(t, e, s, r, n, h.a * o + h.c * a + h.tx, h.b * o + h.d * a + h.ty), this
        }
        bezierCurveTo(t, e, s, r, n, o, a) {
            this._tick++;
            const h = this._transform;
            return this._activePath.bezierCurveTo(h.a * t + h.c * e + h.tx, h.b * t + h.d * e + h.ty, h.a * s + h.c * r + h.tx, h.b * s + h.d * r + h.ty, h.a * n + h.c * o + h.tx, h.b * n + h.d * o + h.ty, a), this
        }
        closePath() {
            var t;
            return this._tick++, (t = this._activePath) == null || t.closePath(), this
        }
        ellipse(t, e, s, r) {
            return this._tick++, this._activePath.ellipse(t, e, s, r, this._transform.clone()), this
        }
        circle(t, e, s) {
            return this._tick++, this._activePath.circle(t, e, s, this._transform.clone()), this
        }
        path(t) {
            return this._tick++, this._activePath.addPath(t, this._transform.clone()), this
        }
        lineTo(t, e) {
            this._tick++;
            const s = this._transform;
            return this._activePath.lineTo(s.a * t + s.c * e + s.tx, s.b * t + s.d * e + s.ty), this
        }
        moveTo(t, e) {
            this._tick++;
            const s = this._transform,
                r = this._activePath.instructions,
                n = s.a * t + s.c * e + s.tx,
                o = s.b * t + s.d * e + s.ty;
            return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = n, r[0].data[1] = o, this) : (this._activePath.moveTo(n, o), this)
        }
        quadraticCurveTo(t, e, s, r, n) {
            this._tick++;
            const o = this._transform;
            return this._activePath.quadraticCurveTo(o.a * t + o.c * e + o.tx, o.b * t + o.d * e + o.ty, o.a * s + o.c * r + o.tx, o.b * s + o.d * r + o.ty, n), this
        }
        rect(t, e, s, r) {
            return this._tick++, this._activePath.rect(t, e, s, r, this._transform.clone()), this
        }
        roundRect(t, e, s, r, n) {
            return this._tick++, this._activePath.roundRect(t, e, s, r, n, this._transform.clone()), this
        }
        poly(t, e) {
            return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this
        }
        regularPoly(t, e, s, r, n = 0, o) {
            return this._tick++, this._activePath.regularPoly(t, e, s, r, n, o), this
        }
        roundPoly(t, e, s, r, n, o) {
            return this._tick++, this._activePath.roundPoly(t, e, s, r, n, o), this
        }
        roundShape(t, e, s, r) {
            return this._tick++, this._activePath.roundShape(t, e, s, r), this
        }
        filletRect(t, e, s, r, n) {
            return this._tick++, this._activePath.filletRect(t, e, s, r, n), this
        }
        chamferRect(t, e, s, r, n, o) {
            return this._tick++, this._activePath.chamferRect(t, e, s, r, n, o), this
        }
        star(t, e, s, r, n = 0, o = 0) {
            return this._tick++, this._activePath.star(t, e, s, r, n, o, this._transform.clone()), this
        }
        svg(t) {
            return this._tick++, rg(t, this), this
        }
        restore() {
            const t = this._stateStack.pop();
            return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this
        }
        save() {
            return this._stateStack.push({
                transform: this._transform.clone(),
                fillStyle: {
                    ...this._fillStyle
                },
                strokeStyle: {
                    ...this._strokeStyle
                }
            }), this
        }
        getTransform() {
            return this._transform
        }
        resetTransform() {
            return this._transform.identity(), this
        }
        rotate(t) {
            return this._transform.rotate(t), this
        }
        scale(t, e = t) {
            return this._transform.scale(t, e), this
        }
        setTransform(t, e, s, r, n, o) {
            return t instanceof N ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, s, r, n, o), this)
        }
        transform(t, e, s, r, n, o) {
            return t instanceof N ? (this._transform.append(t), this) : (Wa.set(t, e, s, r, n, o), this._transform.append(Wa), this)
        }
        translate(t, e = t) {
            return this._transform.translate(t, e), this
        }
        clear() {
            return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this
        }
        onUpdate() {
            this._boundsDirty = !0, this.dirty = !0, this.emit("update", this, 16)
        }
        get bounds() {
            if (!this._boundsDirty) return this._bounds;
            this._boundsDirty = !1;
            const t = this._bounds;
            t.clear();
            for (let e = 0; e < this.instructions.length; e++) {
                const s = this.instructions[e],
                    r = s.action;
                if (r === "fill") {
                    const n = s.data;
                    t.addBounds(n.path.bounds)
                } else if (r === "texture") {
                    const n = s.data;
                    t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform)
                }
                if (r === "stroke") {
                    const n = s.data,
                        o = n.style.alignment;
                    let a = n.style.width * (1 - o);
                    n.style.join === "miter" && (a *= cg(n.path, n.style.miterLimit));
                    const h = n.path.bounds;
                    t.addFrame(h.minX - a, h.minY - a, h.maxX + a, h.maxY + a)
                }
            }
            return t.isValid || t.set(0, 0, 0, 0), t
        }
        containsPoint(t) {
            var r;
            if (!this.bounds.containsPoint(t.x, t.y)) return !1;
            const e = this.instructions;
            let s = !1;
            for (let n = 0; n < e.length; n++) {
                const o = e[n],
                    a = o.data,
                    h = a.path;
                if (!o.action || !h) continue;
                const l = a.style,
                    c = h.shapePath.shapePrimitives;
                for (let u = 0; u < c.length; u++) {
                    const d = c[u].shape;
                    if (!l || !d) continue;
                    const f = c[u].transform,
                        p = f ? f.applyInverse(t, ug) : t;
                    if (o.action === "fill") s = d.contains(p.x, p.y);
                    else {
                        const g = l;
                        s = d.strokeContains(p.x, p.y, g.width, g.alignment)
                    }
                    const m = a.hole;
                    if (m) {
                        const g = (r = m.shapePath) == null ? void 0 : r.shapePrimitives;
                        if (g)
                            for (let _ = 0; _ < g.length; _++) g[_].shape.contains(p.x, p.y) && (s = !1)
                    }
                    if (s) return !0
                }
            }
            return s
        }
        unload() {
            var t;
            this.emit("unload", this);
            for (const e in this._gpuData)(t = this._gpuData[e]) == null || t.destroy();
            this._gpuData = Object.create(null)
        }
        destroy(t = !1) {
            if (this.destroyed) return;
            if (this.destroyed = !0, this._stateStack.length = 0, this._transform = null, this.unload(), this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
                const s = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
                this._fillStyle.texture && (this._fillStyle.fill && "uid" in this._fillStyle.fill ? this._fillStyle.fill.destroy() : this._fillStyle.texture.destroy(s)), this._strokeStyle.texture && (this._strokeStyle.fill && "uid" in this._strokeStyle.fill ? this._strokeStyle.fill.destroy() : this._strokeStyle.texture.destroy(s))
            }
            this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null
        }
    };
Ln.defaultFillStyle = {
    color: 16777215,
    alpha: 1,
    texture: O.WHITE,
    matrix: null,
    fill: null,
    textureSpace: "local"
};
Ln.defaultStrokeStyle = {
    width: 1,
    color: 16777215,
    alpha: 1,
    alignment: .5,
    miterLimit: 10,
    cap: "butt",
    join: "miter",
    texture: O.WHITE,
    matrix: null,
    fill: null,
    textureSpace: "local",
    pixelLine: !1
};
let jt = Ln;

function Dn(i, t = 1) {
    var s;
    const e = (s = vs.RETINA_PREFIX) == null ? void 0 : s.exec(i);
    return e ? parseFloat(e[1]) : t
}

function Un(i, t, e) {
    i.label = e, i._sourceOrigin = e;
    const s = new O({
            source: i,
            label: e
        }),
        r = () => {
            delete t.promiseCache[e], ft.has(e) && ft.remove(e)
        };
    return s.source.once("destroy", () => {
        t.promiseCache[e] && (V("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), r())
    }), s.once("destroy", () => {
        i.destroyed || (V("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), r())
    }), s
}
const dg = ".svg",
    fg = "image/svg+xml",
    pg = {
        extension: {
            type: w.LoadParser,
            priority: Ae.Low,
            name: "loadSVG"
        },
        name: "loadSVG",
        id: "svg",
        config: {
            crossOrigin: "anonymous",
            parseAsGraphicsContext: !1
        },
        test(i) {
            return ws(i, fg) || Ts(i, dg)
        },
        async load(i, t, e) {
            var s;
            return ((s = t.data) == null ? void 0 : s.parseAsGraphicsContext) ?? this.config.parseAsGraphicsContext ? gg(i) : mg(i, t, e, this.config.crossOrigin)
        },
        unload(i) {
            i.destroy(!0)
        }
    };
async function mg(i, t, e, s) {
    var g, _, x;
    const r = await X.get().fetch(i),
        n = X.get().createImage();
    n.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(await r.text())}`, n.crossOrigin = s, await n.decode();
    const o = ((g = t.data) == null ? void 0 : g.width) ?? n.width,
        a = ((_ = t.data) == null ? void 0 : _.height) ?? n.height,
        h = ((x = t.data) == null ? void 0 : x.resolution) || Dn(i),
        l = Math.ceil(o * h),
        c = Math.ceil(a * h),
        u = X.get().createCanvas(l, c),
        d = u.getContext("2d");
    d.imageSmoothingEnabled = !0, d.imageSmoothingQuality = "high", d.drawImage(n, 0, 0, o * h, a * h);
    const {
        parseAsGraphicsContext: f,
        ...p
    } = t.data ?? {}, m = new He({
        resource: u,
        alphaMode: "premultiply-alpha-on-upload",
        resolution: h,
        ...p
    });
    return Un(m, e, i)
}
async function gg(i) {
    const e = await (await X.get().fetch(i)).text(),
        s = new jt;
    return s.svg(e), s
}
const _g = `(function () {
    'use strict';

    const WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
    async function checkImageBitmap() {
      try {
        if (typeof createImageBitmap !== "function") return false;
        const response = await fetch(WHITE_PNG);
        const imageBlob = await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);
        return imageBitmap.width === 1 && imageBitmap.height === 1;
      } catch (_e) {
        return false;
      }
    }
    void checkImageBitmap().then((result) => {
      self.postMessage(result);
    });

})();
`;
let ps = null,
    an = class {
        constructor() {
            ps || (ps = URL.createObjectURL(new Blob([_g], {
                type: "application/javascript"
            }))), this.worker = new Worker(ps)
        }
    };
an.revokeObjectURL = function() {
    ps && (URL.revokeObjectURL(ps), ps = null)
};
const xg = `(function () {
    'use strict';

    async function loadImageBitmap(url, alphaMode) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \${response.status} \${response.statusText}\`);
      }
      const imageBlob = await response.blob();
      return alphaMode === "premultiplied-alpha" ? createImageBitmap(imageBlob, { premultiplyAlpha: "none" }) : createImageBitmap(imageBlob);
    }
    self.onmessage = async (event) => {
      try {
        const imageBitmap = await loadImageBitmap(event.data.data[0], event.data.data[1]);
        self.postMessage({
          data: imageBitmap,
          uuid: event.data.uuid,
          id: event.data.id
        }, [imageBitmap]);
      } catch (e) {
        self.postMessage({
          error: e,
          uuid: event.data.uuid,
          id: event.data.id
        });
      }
    };

})();
`;
let ms = null;
class Ql {
    constructor() {
        ms || (ms = URL.createObjectURL(new Blob([xg], {
            type: "application/javascript"
        }))), this.worker = new Worker(ms)
    }
}
Ql.revokeObjectURL = function() {
    ms && (URL.revokeObjectURL(ms), ms = null)
};
let Ha = 0,
    Sr;
class yg {
    constructor() {
        this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {}
    }
    isImageBitmapSupported() {
        return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise(t => {
            const {
                worker: e
            } = new an;
            e.addEventListener("message", s => {
                e.terminate(), an.revokeObjectURL(), t(s.data)
            })
        }), this._isImageBitmapSupported)
    }
    loadImageBitmap(t, e) {
        var s;
        return this._run("loadImageBitmap", [t, (s = e == null ? void 0 : e.data) == null ? void 0 : s.alphaMode])
    }
    async _initWorkers() {
        this._initialized || (this._initialized = !0)
    }
    _getWorker() {
        Sr === void 0 && (Sr = navigator.hardwareConcurrency || 4);
        let t = this._workerPool.pop();
        return !t && this._createdWorkers < Sr && (this._createdWorkers++, t = new Ql().worker, t.addEventListener("message", e => {
            this._complete(e.data), this._returnWorker(e.target), this._next()
        })), t
    }
    _returnWorker(t) {
        this._workerPool.push(t)
    }
    _complete(t) {
        this._resolveHash[t.uuid] && (t.error !== void 0 ? this._resolveHash[t.uuid].reject(t.error) : this._resolveHash[t.uuid].resolve(t.data), delete this._resolveHash[t.uuid])
    }
    async _run(t, e) {
        await this._initWorkers();
        const s = new Promise((r, n) => {
            this._queue.push({
                id: t,
                arguments: e,
                resolve: r,
                reject: n
            })
        });
        return this._next(), s
    }
    _next() {
        if (!this._queue.length) return;
        const t = this._getWorker();
        if (!t) return;
        const e = this._queue.pop(),
            s = e.id;
        this._resolveHash[Ha] = {
            resolve: e.resolve,
            reject: e.reject
        }, t.postMessage({
            data: e.arguments,
            uuid: Ha++,
            id: s
        })
    }
    reset() {
        this._workerPool.forEach(t => t.terminate()), this._workerPool.length = 0, Object.values(this._resolveHash).forEach(({
            reject: t
        }) => {
            t == null || t(new Error("WorkerManager has been reset before completion"))
        }), this._resolveHash = {}, this._queue.length = 0, this._initialized = !1, this._createdWorkers = 0
    }
}
const za = new yg,
    bg = [".jpeg", ".jpg", ".png", ".webp", ".avif"],
    vg = ["image/jpeg", "image/png", "image/webp", "image/avif"];
async function wg(i, t) {
    var r;
    const e = await X.get().fetch(i);
    if (!e.ok) throw new Error(`[loadImageBitmap] Failed to fetch ${i}: ${e.status} ${e.statusText}`);
    const s = await e.blob();
    return ((r = t == null ? void 0 : t.data) == null ? void 0 : r.alphaMode) === "premultiplied-alpha" ? createImageBitmap(s, {
        premultiplyAlpha: "none"
    }) : createImageBitmap(s)
}
const Jl = {
        name: "loadTextures",
        id: "texture",
        extension: {
            type: w.LoadParser,
            priority: Ae.High,
            name: "loadTextures"
        },
        config: {
            preferWorkers: !0,
            preferCreateImageBitmap: !0,
            crossOrigin: "anonymous"
        },
        test(i) {
            return ws(i, vg) || Ts(i, bg)
        },
        async load(i, t, e) {
            var n;
            let s = null;
            globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await za.isImageBitmapSupported() ? s = await za.loadImageBitmap(i, t) : s = await wg(i, t) : s = await new Promise((o, a) => {
                s = X.get().createImage(), s.crossOrigin = this.config.crossOrigin, s.src = i, s.complete ? o(s) : (s.onload = () => {
                    o(s)
                }, s.onerror = a)
            });
            const r = new He({
                resource: s,
                alphaMode: "premultiply-alpha-on-upload",
                resolution: ((n = t.data) == null ? void 0 : n.resolution) || Dn(i),
                ...t.data
            });
            return Un(r, e, i)
        },
        unload(i) {
            i.destroy(!0)
        }
    },
    Tg = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"];
let Cr, Ar;

function Sg(i, t, e) {
    e === void 0 && !t.startsWith("data:") ? i.crossOrigin = Ag(t) : e !== !1 && (i.crossOrigin = typeof e == "string" ? e : "anonymous")
}

function Cg(i) {
    return new Promise((t, e) => {
        i.addEventListener("canplaythrough", s), i.addEventListener("error", r), i.load();

        function s() {
            n(), t()
        }

        function r(o) {
            n(), e(o)
        }

        function n() {
            i.removeEventListener("canplaythrough", s), i.removeEventListener("error", r)
        }
    })
}

function Ag(i, t = globalThis.location) {
    if (i.startsWith("data:")) return "";
    t || (t = globalThis.location);
    const e = new URL(i, document.baseURI);
    return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : ""
}

function Pg() {
    const i = [],
        t = [];
    for (const e of Tg) {
        const s = Hs.MIME_TYPES[e.substring(1)] || `video/${e.substring(1)}`;
        Yi(s) && (i.push(e), t.includes(s) || t.push(s))
    }
    return {
        validVideoExtensions: i,
        validVideoMime: t
    }
}
const Eg = {
        name: "loadVideo",
        id: "video",
        extension: {
            type: w.LoadParser,
            name: "loadVideo"
        },
        test(i) {
            if (!Cr || !Ar) {
                const {
                    validVideoExtensions: s,
                    validVideoMime: r
                } = Pg();
                Cr = s, Ar = r
            }
            const t = ws(i, Ar),
                e = Ts(i, Cr);
            return t || e
        },
        async load(i, t, e) {
            var h, l;
            const s = {
                    ...Hs.defaultOptions,
                    resolution: ((h = t.data) == null ? void 0 : h.resolution) || Dn(i),
                    alphaMode: ((l = t.data) == null ? void 0 : l.alphaMode) || await Qh(),
                    ...t.data
                },
                r = document.createElement("video"),
                n = {
                    preload: s.autoLoad !== !1 ? "auto" : void 0,
                    "webkit-playsinline": s.playsinline !== !1 ? "" : void 0,
                    playsinline: s.playsinline !== !1 ? "" : void 0,
                    muted: s.muted === !0 ? "" : void 0,
                    loop: s.loop === !0 ? "" : void 0,
                    autoplay: s.autoPlay !== !1 ? "" : void 0
                };
            Object.keys(n).forEach(c => {
                const u = n[c];
                u !== void 0 && r.setAttribute(c, u)
            }), s.muted === !0 && (r.muted = !0), Sg(r, i, s.crossorigin);
            const o = document.createElement("source");
            let a;
            if (s.mime) a = s.mime;
            else if (i.startsWith("data:")) a = i.slice(5, i.indexOf(";"));
            else if (!i.startsWith("blob:")) {
                const c = i.split("?")[0].slice(i.lastIndexOf(".") + 1).toLowerCase();
                a = Hs.MIME_TYPES[c] || `video/${c}`
            }
            return o.src = i, a && (o.type = a), new Promise((c, u) => {
                s.preload && !s.autoPlay && r.load(), r.addEventListener("canplay", d), r.addEventListener("error", f), o.addEventListener("error", f), r.appendChild(o);
                async function d() {
                    const m = new Hs({
                        ...s,
                        resource: r
                    });
                    p(), t.data.preload && await Cg(r), c(Un(m, e, i))
                }

                function f(m) {
                    p(), u(m)
                }

                function p() {
                    r.removeEventListener("canplay", d), r.removeEventListener("error", f), o.removeEventListener("error", f)
                }
            })
        },
        unload(i) {
            i.destroy(!0)
        }
    },
    tc = {
        extension: {
            type: w.ResolveParser,
            name: "resolveTexture"
        },
        test: Jl.test,
        parse: i => {
            var t;
            return {
                resolution: parseFloat(((t = vs.RETINA_PREFIX.exec(i)) == null ? void 0 : t[1]) ?? "1"),
                format: i.split(".").pop(),
                src: i
            }
        }
    },
    Mg = {
        extension: {
            type: w.ResolveParser,
            priority: -2,
            name: "resolveJson"
        },
        test: i => vs.RETINA_PREFIX.test(i) && i.endsWith(".json"),
        parse: tc.parse
    };
class kg {
    constructor() {
        this._detections = [], this._initialized = !1, this.resolver = new vs, this.loader = new pp, this.cache = ft, this._backgroundLoader = new np(this.loader), this._backgroundLoader.active = !0, this.reset()
    }
    async init(t = {}) {
        var n, o;
        if (this._initialized) {
            V("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
            return
        }
        if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
            let a = t.manifest;
            typeof a == "string" && (a = await this.load(a)), this.resolver.addManifest(a)
        }
        const e = ((n = t.texturePreference) == null ? void 0 : n.resolution) ?? 1,
            s = typeof e == "number" ? [e] : e,
            r = await this._detectFormats({
                preferredFormats: (o = t.texturePreference) == null ? void 0 : o.format,
                skipDetections: t.skipDetections,
                detections: this._detections
            });
        this.resolver.prefer({
            params: {
                format: r,
                resolution: s
            }
        }), t.preferences && this.setPreferences(t.preferences), t.loadOptions && (this.loader.loadOptions = {
            ...this.loader.loadOptions,
            ...t.loadOptions
        })
    }
    add(t) {
        this.resolver.add(t)
    }
    async load(t, e) {
        this._initialized || await this.init();
        const s = Ui(t),
            r = Jt(t).map(a => {
                if (typeof a != "string") {
                    const h = this.resolver.getAlias(a);
                    return h.some(l => !this.resolver.hasKey(l)) && this.add(a), Array.isArray(h) ? h[0] : h
                }
                return this.resolver.hasKey(a) || this.add({
                    alias: a,
                    src: a
                }), a
            }),
            n = this.resolver.resolve(r),
            o = await this._mapLoadToResolve(n, e);
        return s ? o[r[0]] : o
    }
    addBundle(t, e) {
        this.resolver.addBundle(t, e)
    }
    async loadBundle(t, e) {
        this._initialized || await this.init();
        let s = !1;
        typeof t == "string" && (s = !0, t = [t]);
        const r = this.resolver.resolveBundle(t),
            n = {},
            o = Object.keys(r);
        let a = 0;
        const h = [],
            l = () => {
                e == null || e(h.reduce((u, d) => u + d, 0) / a)
            },
            c = o.map((u, d) => {
                const f = r[u],
                    p = Object.values(f),
                    g = [...new Set(p.flat())].reduce((_, x) => _ + (x.progressSize || 1), 0);
                return h.push(0), a += g, this._mapLoadToResolve(f, _ => {
                    h[d] = _ * g, l()
                }).then(_ => {
                    n[u] = _
                })
            });
        return await Promise.all(c), s ? n[t[0]] : n
    }
    async backgroundLoad(t) {
        this._initialized || await this.init(), typeof t == "string" && (t = [t]);
        const e = this.resolver.resolve(t);
        this._backgroundLoader.add(Object.values(e))
    }
    async backgroundLoadBundle(t) {
        this._initialized || await this.init(), typeof t == "string" && (t = [t]);
        const e = this.resolver.resolveBundle(t);
        Object.values(e).forEach(s => {
            this._backgroundLoader.add(Object.values(s))
        })
    }
    reset() {
        this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1
    }
    get(t) {
        if (typeof t == "string") return ft.get(t);
        const e = {};
        for (let s = 0; s < t.length; s++) e[s] = ft.get(t[s]);
        return e
    }
    async _mapLoadToResolve(t, e) {
        const s = [...new Set(Object.values(t))];
        this._backgroundLoader.active = !1;
        const r = await this.loader.load(s, e);
        this._backgroundLoader.active = !0;
        const n = {};
        return s.forEach(o => {
            const a = r[o.src],
                h = [o.src];
            o.alias && h.push(...o.alias), h.forEach(l => {
                n[l] = a
            }), ft.set(h, a)
        }), n
    }
    async unload(t) {
        this._initialized || await this.init();
        const e = Jt(t).map(r => typeof r != "string" ? r.src : r),
            s = this.resolver.resolve(e);
        await this._unloadFromResolved(s)
    }
    async unloadBundle(t) {
        this._initialized || await this.init(), t = Jt(t);
        const e = this.resolver.resolveBundle(t),
            s = Object.keys(e).map(r => this._unloadFromResolved(e[r]));
        await Promise.all(s)
    }
    async _unloadFromResolved(t) {
        const e = Object.values(t);
        e.forEach(s => {
            ft.remove(s.src)
        }), await this.loader.unload(e)
    }
    async _detectFormats(t) {
        let e = [];
        t.preferredFormats && (e = Array.isArray(t.preferredFormats) ? t.preferredFormats : [t.preferredFormats]);
        for (const s of t.detections) t.skipDetections || await s.test() ? e = await s.add(e) : t.skipDetections || (e = await s.remove(e));
        return e = e.filter((s, r) => e.indexOf(s) === r), e
    }
    get detections() {
        return this._detections
    }
    setPreferences(t) {
        this.loader.parsers.forEach(e => {
            e.config && Object.keys(e.config).filter(s => s in t).forEach(s => {
                e.config[s] = t[s]
            })
        })
    }
}
const Te = new kg;
Y.handleByList(w.LoadParser, Te.loader.parsers).handleByList(w.ResolveParser, Te.resolver.parsers).handleByList(w.CacheParser, Te.cache.parsers).handleByList(w.DetectionParser, Te.detections);
Y.add(op, hp, ap, fp, cp, up, dp, _p, bp, Ep, pg, Jl, Eg, rp, ip, tc, Mg);
const Va = {
    loader: w.LoadParser,
    resolver: w.ResolveParser,
    cache: w.CacheParser,
    detection: w.DetectionParser
};
Y.handle(w.Asset, i => {
    const t = i.ref;
    Object.entries(Va).filter(([e]) => !!t[e]).forEach(([e, s]) => Y.add(Object.assign(t[e], {
        extension: t[e].extension ?? s
    })))
}, i => {
    const t = i.ref;
    Object.keys(Va).filter(e => !!t[e]).forEach(e => Y.remove(t[e]))
});
class ec {
    constructor(t) {
        this._attachedDomElements = [], this._renderer = t, this._renderer.runners.postrender.add(this), this._renderer.runners.init.add(this), this._domElement = document.createElement("div"), this._domElement.style.position = "absolute", this._domElement.style.top = "0", this._domElement.style.left = "0", this._domElement.style.pointerEvents = "none", this._domElement.style.zIndex = "1000"
    }
    init() {
        this._canvasObserver = new rl({
            domElement: this._domElement,
            renderer: this._renderer
        })
    }
    addRenderable(t, e) {
        this._attachedDomElements.includes(t) || this._attachedDomElements.push(t)
    }
    updateRenderable(t) {}
    validateRenderable(t) {
        return !0
    }
    postrender() {
        const t = this._attachedDomElements;
        if (t.length === 0) {
            this._domElement.remove();
            return
        }
        this._canvasObserver.ensureAttached();
        for (let e = 0; e < t.length; e++) {
            const s = t[e],
                r = s.element;
            if (!s.parent || s.globalDisplayStatus < 7) r == null || r.remove(), t.splice(e, 1), e--;
            else {
                this._domElement.contains(r) || (r.style.position = "absolute", r.style.pointerEvents = "auto", this._domElement.appendChild(r));
                const n = s.worldTransform,
                    o = s._anchor,
                    a = s.width * o.x,
                    h = s.height * o.y;
                r.style.transformOrigin = `${a}px ${h}px`, r.style.transform = `matrix(${n.a}, ${n.b}, ${n.c}, ${n.d}, ${n.tx-a}, ${n.ty-h})`, r.style.opacity = s.groupAlpha.toString()
            }
        }
    }
    destroy() {
        var t;
        this._renderer.runners.postrender.remove(this);
        for (let e = 0; e < this._attachedDomElements.length; e++)(t = this._attachedDomElements[e].element) == null || t.remove();
        this._attachedDomElements.length = 0, this._domElement.remove(), this._canvasObserver.destroy(), this._renderer = null
    }
}
ec.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "dom"
};
class Rg {
    constructor() {
        this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0
    }
    init(t) {
        this.removeTickerListener(), this.events = t, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0
    }
    get pauseUpdate() {
        return this._pauseUpdate
    }
    set pauseUpdate(t) {
        this._pauseUpdate = t
    }
    addTickerListener() {
        this._tickerAdded || !this.domElement || (Gt.system.add(this._tickerUpdate, this, ze.INTERACTION), this._tickerAdded = !0)
    }
    removeTickerListener() {
        this._tickerAdded && (Gt.system.remove(this._tickerUpdate, this), this._tickerAdded = !1)
    }
    pointerMoved() {
        this._didMove = !0
    }
    _update() {
        if (!this.domElement || this._pauseUpdate) return;
        if (this._didMove) {
            this._didMove = !1;
            return
        }
        const t = this.events._rootPointerEvent;
        this.events.supportsTouchEvents && t.pointerType === "touch" || globalThis.document.dispatchEvent(this.events.supportsPointerEvents ? new PointerEvent("pointermove", {
            clientX: t.clientX,
            clientY: t.clientY,
            pointerType: t.pointerType,
            pointerId: t.pointerId
        }) : new MouseEvent("mousemove", {
            clientX: t.clientX,
            clientY: t.clientY
        }))
    }
    _tickerUpdate(t) {
        this._deltaTime += t.deltaTime, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this._update())
    }
    destroy() {
        this.removeTickerListener(), this.events = null, this.domElement = null, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0
    }
}
const ue = new Rg;
class zi extends si {
    constructor() {
        super(...arguments), this.client = new mt, this.movement = new mt, this.offset = new mt, this.global = new mt, this.screen = new mt
    }
    get clientX() {
        return this.client.x
    }
    get clientY() {
        return this.client.y
    }
    get x() {
        return this.clientX
    }
    get y() {
        return this.clientY
    }
    get movementX() {
        return this.movement.x
    }
    get movementY() {
        return this.movement.y
    }
    get offsetX() {
        return this.offset.x
    }
    get offsetY() {
        return this.offset.y
    }
    get globalX() {
        return this.global.x
    }
    get globalY() {
        return this.global.y
    }
    get screenX() {
        return this.screen.x
    }
    get screenY() {
        return this.screen.y
    }
    getLocalPosition(t, e, s) {
        return t.worldTransform.applyInverse(s || this.global, e)
    }
    getModifierState(t) {
        return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(t)
    }
    initMouseEvent(t, e, s, r, n, o, a, h, l, c, u, d, f, p, m) {
        throw new Error("Method not implemented.")
    }
}
class Qt extends zi {
    constructor() {
        super(...arguments), this.width = 0, this.height = 0, this.isPrimary = !1
    }
    getCoalescedEvents() {
        return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : []
    }
    getPredictedEvents() {
        throw new Error("getPredictedEvents is not supported!")
    }
}
class ys extends zi {
    constructor() {
        super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2
    }
}
ys.DOM_DELTA_PIXEL = 0;
ys.DOM_DELTA_LINE = 1;
ys.DOM_DELTA_PAGE = 2;
const Bg = 2048,
    Ig = new mt,
    Bs = new mt;
class Gg {
    constructor(t) {
        this.dispatch = new Xt, this.moveOnAll = !1, this.enableGlobalMoveEvents = !0, this.mappingState = {
            trackingData: {}
        }, this.eventPool = new Map, this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = !1, this.rootTarget = t, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel)
    }
    addEventMapping(t, e) {
        this.mappingTable[t] || (this.mappingTable[t] = []), this.mappingTable[t].push({
            fn: e,
            priority: 0
        }), this.mappingTable[t].sort((s, r) => s.priority - r.priority)
    }
    dispatchEvent(t, e) {
        t.propagationStopped = !1, t.propagationImmediatelyStopped = !1, this.propagate(t, e), this.dispatch.emit(e || t.type, t)
    }
    mapEvent(t) {
        if (!this.rootTarget) return;
        const e = this.mappingTable[t.type];
        if (e)
            for (let s = 0, r = e.length; s < r; s++) e[s].fn(t);
        else V(`[EventBoundary]: Event mapping not defined for ${t.type}`)
    }
    hitTest(t, e) {
        ue.pauseUpdate = !0;
        const r = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive",
            n = this[r](this.rootTarget, this.rootTarget.eventMode, Ig.set(t, e), this.hitTestFn, this.hitPruneFn);
        return n && n[0]
    }
    propagate(t, e) {
        if (!t.target) return;
        const s = t.composedPath();
        t.eventPhase = t.CAPTURING_PHASE;
        for (let r = 0, n = s.length - 1; r < n; r++)
            if (t.currentTarget = s[r], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped) return;
        if (t.eventPhase = t.AT_TARGET, t.currentTarget = t.target, this.notifyTarget(t, e), !(t.propagationStopped || t.propagationImmediatelyStopped)) {
            t.eventPhase = t.BUBBLING_PHASE;
            for (let r = s.length - 2; r >= 0; r--)
                if (t.currentTarget = s[r], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped) return
        }
    }
    all(t, e, s = this._allInteractiveElements) {
        if (s.length === 0) return;
        t.eventPhase = t.BUBBLING_PHASE;
        const r = Array.isArray(e) ? e : [e];
        for (let n = s.length - 1; n >= 0; n--) r.forEach(o => {
            t.currentTarget = s[n], this.notifyTarget(t, o)
        })
    }
    propagationPath(t) {
        const e = [t];
        for (let s = 0; s < Bg && t !== this.rootTarget && t.parent; s++) {
            if (!t.parent) throw new Error("Cannot find propagation path to disconnected target");
            e.push(t.parent), t = t.parent
        }
        return e.reverse(), e
    }
    hitTestMoveRecursive(t, e, s, r, n, o = !1) {
        let a = !1;
        if (this._interactivePrune(t)) return null;
        if ((t.eventMode === "dynamic" || e === "dynamic") && (ue.pauseUpdate = !1), t.interactiveChildren && t.children) {
            const c = t.children;
            for (let u = c.length - 1; u >= 0; u--) {
                const d = c[u],
                    f = this.hitTestMoveRecursive(d, this._isInteractive(e) ? e : d.eventMode, s, r, n, o || n(t, s));
                if (f) {
                    if (f.length > 0 && !f[f.length - 1].parent) continue;
                    const p = t.isInteractive();
                    (f.length > 0 || p) && (p && this._allInteractiveElements.push(t), f.push(t)), this._hitElements.length === 0 && (this._hitElements = f), a = !0
                }
            }
        }
        const h = this._isInteractive(e),
            l = t.isInteractive();
        return l && l && this._allInteractiveElements.push(t), o || this._hitElements.length > 0 ? null : a ? this._hitElements : h && !n(t, s) && r(t, s) ? l ? [t] : [] : null
    }
    hitTestRecursive(t, e, s, r, n) {
        if (this._interactivePrune(t) || n(t, s)) return null;
        if ((t.eventMode === "dynamic" || e === "dynamic") && (ue.pauseUpdate = !1), t.interactiveChildren && t.children) {
            const h = t.children,
                l = s;
            for (let c = h.length - 1; c >= 0; c--) {
                const u = h[c],
                    d = this.hitTestRecursive(u, this._isInteractive(e) ? e : u.eventMode, l, r, n);
                if (d) {
                    if (d.length > 0 && !d[d.length - 1].parent) continue;
                    const f = t.isInteractive();
                    return (d.length > 0 || f) && d.push(t), d
                }
            }
        }
        const o = this._isInteractive(e),
            a = t.isInteractive();
        return o && r(t, s) ? a ? [t] : [] : null
    }
    _isInteractive(t) {
        return t === "static" || t === "dynamic"
    }
    _interactivePrune(t) {
        return !t || !t.visible || !t.renderable || !t.measurable || t.eventMode === "none" || t.eventMode === "passive" && !t.interactiveChildren
    }
    hitPruneFn(t, e) {
        if (t.hitArea && (t.worldTransform.applyInverse(e, Bs), !t.hitArea.contains(Bs.x, Bs.y))) return !0;
        if (t.effects && t.effects.length)
            for (let s = 0; s < t.effects.length; s++) {
                const r = t.effects[s];
                if (r.containsPoint && !r.containsPoint(e, this.hitTestFn)) return !0
            }
        return !1
    }
    hitTestFn(t, e) {
        return t.hitArea ? !0 : t != null && t.containsPoint ? (t.worldTransform.applyInverse(e, Bs), t.containsPoint(Bs)) : !1
    }
    notifyTarget(t, e) {
        var n, o;
        if (!t.currentTarget.isInteractive()) return;
        e ?? (e = t.type);
        const s = `on${e}`;
        (o = (n = t.currentTarget)[s]) == null || o.call(n, t);
        const r = t.eventPhase === t.CAPTURING_PHASE || t.eventPhase === t.AT_TARGET ? `${e}capture` : e;
        this._notifyListeners(t, r), t.eventPhase === t.AT_TARGET && this._notifyListeners(t, e)
    }
    mapPointerDown(t) {
        if (!(t instanceof Qt)) {
            V("EventBoundary cannot map a non-pointer event as a pointer event");
            return
        }
        const e = this.createPointerEvent(t);
        if (this.dispatchEvent(e, "pointerdown"), e.pointerType === "touch") this.dispatchEvent(e, "touchstart");
        else if (e.pointerType === "mouse" || e.pointerType === "pen") {
            const r = e.button === 2;
            this.dispatchEvent(e, r ? "rightdown" : "mousedown")
        }
        const s = this.trackingData(t.pointerId);
        s.pressTargetsByButton[t.button] = e.composedPath(), this.freeEvent(e)
    }
    mapPointerMove(t) {
        var h, l;
        if (!(t instanceof Qt)) {
            V("EventBoundary cannot map a non-pointer event as a pointer event");
            return
        }
        this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
        const e = this.createPointerEvent(t);
        this._isPointerMoveEvent = !1;
        const s = e.pointerType === "mouse" || e.pointerType === "pen",
            r = this.trackingData(t.pointerId),
            n = this.findMountedTarget(r.overTargets);
        if (((h = r.overTargets) == null ? void 0 : h.length) > 0 && n !== e.target) {
            const c = t.type === "mousemove" ? "mouseout" : "pointerout",
                u = this.createPointerEvent(t, c, n);
            if (this.dispatchEvent(u, "pointerout"), s && this.dispatchEvent(u, "mouseout"), !e.composedPath().includes(n)) {
                const d = this.createPointerEvent(t, "pointerleave", n);
                for (d.eventPhase = d.AT_TARGET; d.target && !e.composedPath().includes(d.target);) d.currentTarget = d.target, this.notifyTarget(d), s && this.notifyTarget(d, "mouseleave"), d.target = d.target.parent;
                this.freeEvent(d)
            }
            this.freeEvent(u)
        }
        if (n !== e.target) {
            const c = t.type === "mousemove" ? "mouseover" : "pointerover",
                u = this.clonePointerEvent(e, c);
            this.dispatchEvent(u, "pointerover"), s && this.dispatchEvent(u, "mouseover");
            let d = n == null ? void 0 : n.parent;
            for (; d && d !== this.rootTarget.parent && d !== e.target;) d = d.parent;
            if (!d || d === this.rootTarget.parent) {
                const p = this.clonePointerEvent(e, "pointerenter");
                for (p.eventPhase = p.AT_TARGET; p.target && p.target !== n && p.target !== this.rootTarget.parent;) p.currentTarget = p.target, this.notifyTarget(p), s && this.notifyTarget(p, "mouseenter"), p.target = p.target.parent;
                this.freeEvent(p)
            }
            this.freeEvent(u)
        }
        const o = [],
            a = this.enableGlobalMoveEvents ?? !0;
        this.moveOnAll ? o.push("pointermove") : this.dispatchEvent(e, "pointermove"), a && o.push("globalpointermove"), e.pointerType === "touch" && (this.moveOnAll ? o.splice(1, 0, "touchmove") : this.dispatchEvent(e, "touchmove"), a && o.push("globaltouchmove")), s && (this.moveOnAll ? o.splice(1, 0, "mousemove") : this.dispatchEvent(e, "mousemove"), a && o.push("globalmousemove"), this.cursor = (l = e.target) == null ? void 0 : l.cursor), o.length > 0 && this.all(e, o), this._allInteractiveElements.length = 0, this._hitElements.length = 0, r.overTargets = e.composedPath(), this.freeEvent(e)
    }
    mapPointerOver(t) {
        var o;
        if (!(t instanceof Qt)) {
            V("EventBoundary cannot map a non-pointer event as a pointer event");
            return
        }
        const e = this.trackingData(t.pointerId),
            s = this.createPointerEvent(t),
            r = s.pointerType === "mouse" || s.pointerType === "pen";
        this.dispatchEvent(s, "pointerover"), r && this.dispatchEvent(s, "mouseover"), s.pointerType === "mouse" && (this.cursor = (o = s.target) == null ? void 0 : o.cursor);
        const n = this.clonePointerEvent(s, "pointerenter");
        for (n.eventPhase = n.AT_TARGET; n.target && n.target !== this.rootTarget.parent;) n.currentTarget = n.target, this.notifyTarget(n), r && this.notifyTarget(n, "mouseenter"), n.target = n.target.parent;
        e.overTargets = s.composedPath(), this.freeEvent(s), this.freeEvent(n)
    }
    mapPointerOut(t) {
        if (!(t instanceof Qt)) {
            V("EventBoundary cannot map a non-pointer event as a pointer event");
            return
        }
        const e = this.trackingData(t.pointerId);
        if (e.overTargets) {
            const s = t.pointerType === "mouse" || t.pointerType === "pen",
                r = this.findMountedTarget(e.overTargets),
                n = this.createPointerEvent(t, "pointerout", r);
            this.dispatchEvent(n), s && this.dispatchEvent(n, "mouseout");
            const o = this.createPointerEvent(t, "pointerleave", r);
            for (o.eventPhase = o.AT_TARGET; o.target && o.target !== this.rootTarget.parent;) o.currentTarget = o.target, this.notifyTarget(o), s && this.notifyTarget(o, "mouseleave"), o.target = o.target.parent;
            e.overTargets = null, this.freeEvent(n), this.freeEvent(o)
        }
        this.cursor = null
    }
    mapPointerUp(t) {
        if (!(t instanceof Qt)) {
            V("EventBoundary cannot map a non-pointer event as a pointer event");
            return
        }
        const e = performance.now(),
            s = this.createPointerEvent(t);
        if (this.dispatchEvent(s, "pointerup"), s.pointerType === "touch") this.dispatchEvent(s, "touchend");
        else if (s.pointerType === "mouse" || s.pointerType === "pen") {
            const a = s.button === 2;
            this.dispatchEvent(s, a ? "rightup" : "mouseup")
        }
        const r = this.trackingData(t.pointerId),
            n = this.findMountedTarget(r.pressTargetsByButton[t.button]);
        let o = n;
        if (n && !s.composedPath().includes(n)) {
            let a = n;
            for (; a && !s.composedPath().includes(a);) {
                if (s.currentTarget = a, this.notifyTarget(s, "pointerupoutside"), s.pointerType === "touch") this.notifyTarget(s, "touchendoutside");
                else if (s.pointerType === "mouse" || s.pointerType === "pen") {
                    const h = s.button === 2;
                    this.notifyTarget(s, h ? "rightupoutside" : "mouseupoutside")
                }
                a = a.parent
            }
            delete r.pressTargetsByButton[t.button], o = a
        }
        if (o) {
            const a = this.clonePointerEvent(s, "click");
            a.target = o, a.path = null, r.clicksByButton[t.button] || (r.clicksByButton[t.button] = {
                clickCount: 0,
                target: a.target,
                timeStamp: e
            });
            const h = r.clicksByButton[t.button];
            if (h.target === a.target && e - h.timeStamp < 200 ? ++h.clickCount : h.clickCount = 1, h.target = a.target, h.timeStamp = e, a.detail = h.clickCount, a.pointerType === "mouse") {
                const l = a.button === 2;
                this.dispatchEvent(a, l ? "rightclick" : "click")
            } else a.pointerType === "touch" && this.dispatchEvent(a, "tap");
            this.dispatchEvent(a, "pointertap"), this.freeEvent(a)
        }
        this.freeEvent(s)
    }
    mapPointerUpOutside(t) {
        if (!(t instanceof Qt)) {
            V("EventBoundary cannot map a non-pointer event as a pointer event");
            return
        }
        const e = this.trackingData(t.pointerId),
            s = this.findMountedTarget(e.pressTargetsByButton[t.button]),
            r = this.createPointerEvent(t);
        if (s) {
            let n = s;
            for (; n;) r.currentTarget = n, this.notifyTarget(r, "pointerupoutside"), r.pointerType === "touch" ? this.notifyTarget(r, "touchendoutside") : (r.pointerType === "mouse" || r.pointerType === "pen") && this.notifyTarget(r, r.button === 2 ? "rightupoutside" : "mouseupoutside"), n = n.parent;
            delete e.pressTargetsByButton[t.button]
        }
        this.freeEvent(r)
    }
    mapWheel(t) {
        if (!(t instanceof ys)) {
            V("EventBoundary cannot map a non-wheel event as a wheel event");
            return
        }
        const e = this.createWheelEvent(t);
        this.dispatchEvent(e), this.freeEvent(e)
    }
    findMountedTarget(t) {
        if (!t) return null;
        let e = t[0];
        for (let s = 1; s < t.length && t[s].parent === e; s++) e = t[s];
        return e
    }
    createPointerEvent(t, e, s) {
        const r = this.allocateEvent(Qt);
        return this.copyPointerData(t, r), this.copyMouseData(t, r), this.copyData(t, r), r.nativeEvent = t.nativeEvent, r.originalEvent = t, r.target = s ?? this.hitTest(r.global.x, r.global.y) ?? this._hitElements[0], typeof e == "string" && (r.type = e), r
    }
    createWheelEvent(t) {
        const e = this.allocateEvent(ys);
        return this.copyWheelData(t, e), this.copyMouseData(t, e), this.copyData(t, e), e.nativeEvent = t.nativeEvent, e.originalEvent = t, e.target = this.hitTest(e.global.x, e.global.y), e
    }
    clonePointerEvent(t, e) {
        const s = this.allocateEvent(Qt);
        return s.nativeEvent = t.nativeEvent, s.originalEvent = t.originalEvent, this.copyPointerData(t, s), this.copyMouseData(t, s), this.copyData(t, s), s.target = t.target, s.path = t.composedPath().slice(), s.type = e ?? s.type, s
    }
    copyWheelData(t, e) {
        e.deltaMode = t.deltaMode, e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ
    }
    copyPointerData(t, e) {
        t instanceof Qt && e instanceof Qt && (e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist)
    }
    copyMouseData(t, e) {
        t instanceof zi && e instanceof zi && (e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.copyFrom(t.client), e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.copyFrom(t.movement), e.screen.copyFrom(t.screen), e.shiftKey = t.shiftKey, e.global.copyFrom(t.global))
    }
    copyData(t, e) {
        e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.detail = t.detail, e.view = t.view, e.which = t.which, e.layer.copyFrom(t.layer), e.page.copyFrom(t.page)
    }
    trackingData(t) {
        return this.mappingState.trackingData[t] || (this.mappingState.trackingData[t] = {
            pressTargetsByButton: {},
            clicksByButton: {},
            overTarget: null
        }), this.mappingState.trackingData[t]
    }
    allocateEvent(t) {
        this.eventPool.has(t) || this.eventPool.set(t, []);
        const e = this.eventPool.get(t).pop() || new t(this);
        return e.eventPhase = e.NONE, e.currentTarget = null, e.defaultPrevented = !1, e.path = null, e.target = null, e
    }
    freeEvent(t) {
        if (t.manager !== this) throw new Error("It is illegal to free an event not managed by this EventBoundary!");
        const e = t.constructor;
        this.eventPool.has(e) || this.eventPool.set(e, []), this.eventPool.get(e).push(t)
    }
    _notifyListeners(t, e) {
        const s = t.currentTarget._events[e];
        if (s)
            if ("fn" in s) s.once && t.currentTarget.removeListener(e, s.fn, void 0, !0), s.fn.call(s.context, t);
            else
                for (let r = 0, n = s.length; r < n && !t.propagationImmediatelyStopped; r++) s[r].once && t.currentTarget.removeListener(e, s[r].fn, void 0, !0), s[r].fn.call(s[r].context, t)
    }
}
const Fg = 1,
    Og = {
        touchstart: "pointerdown",
        touchend: "pointerup",
        touchendoutside: "pointerupoutside",
        touchmove: "pointermove",
        touchcancel: "pointercancel"
    },
    Nn = class hn {
        constructor(t) {
            this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = t, this.rootBoundary = new Gg(null), ue.init(this), this.autoPreventDefault = !0, this._eventsAdded = !1, this._rootPointerEvent = new Qt(null), this._rootWheelEvent = new ys(null), this.cursorStyles = {
                default: "inherit",
                pointer: "pointer"
            }, this.features = new Proxy({
                ...hn.defaultEventFeatures
            }, {
                set: (e, s, r) => (s === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = r), e[s] = r, !0)
            }), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerOverOut = this._onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this)
        }
        static get defaultEventMode() {
            return this._defaultEventMode
        }
        init(t) {
            const {
                canvas: e,
                resolution: s
            } = this.renderer;
            this.setTargetElement(e), this.resolution = s, hn._defaultEventMode = t.eventMode ?? "passive", Object.assign(this.features, t.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove
        }
        resolutionChange(t) {
            this.resolution = t
        }
        destroy() {
            ue.destroy(), this.setTargetElement(null), this.renderer = null, this._currentCursor = null
        }
        setCursor(t) {
            t || (t = "default");
            let e = !0;
            if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (e = !1), this._currentCursor === t) return;
            this._currentCursor = t;
            const s = this.cursorStyles[t];
            if (s) switch (typeof s) {
                case "string":
                    e && (this.domElement.style.cursor = s);
                    break;
                case "function":
                    s(t);
                    break;
                case "object":
                    e && Object.assign(this.domElement.style, s);
                    break
            } else e && typeof t == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.domElement.style.cursor = t)
        }
        get pointer() {
            return this._rootPointerEvent
        }
        _onPointerDown(t) {
            if (!this.features.click) return;
            this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
            const e = this._normalizeToPointerData(t);
            this.autoPreventDefault && e[0].isNormalized && (t.cancelable || !("cancelable" in t)) && t.preventDefault();
            for (let s = 0, r = e.length; s < r; s++) {
                const n = e[s],
                    o = this._bootstrapEvent(this._rootPointerEvent, n);
                this.rootBoundary.mapEvent(o)
            }
            this.setCursor(this.rootBoundary.cursor)
        }
        _onPointerMove(t) {
            if (!this.features.move) return;
            this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, ue.pointerMoved();
            const e = this._normalizeToPointerData(t);
            for (let s = 0, r = e.length; s < r; s++) {
                const n = this._bootstrapEvent(this._rootPointerEvent, e[s]);
                this.rootBoundary.mapEvent(n)
            }
            this.setCursor(this.rootBoundary.cursor)
        }
        _onPointerUp(t) {
            if (!this.features.click) return;
            this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
            let e = t.target;
            t.composedPath && t.composedPath().length > 0 && (e = t.composedPath()[0]);
            const s = e !== this.domElement ? "outside" : "",
                r = this._normalizeToPointerData(t);
            for (let n = 0, o = r.length; n < o; n++) {
                const a = this._bootstrapEvent(this._rootPointerEvent, r[n]);
                a.type += s, this.rootBoundary.mapEvent(a)
            }
            this.setCursor(this.rootBoundary.cursor)
        }
        _onPointerOverOut(t) {
            if (!this.features.click) return;
            this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
            const e = this._normalizeToPointerData(t);
            for (let s = 0, r = e.length; s < r; s++) {
                const n = this._bootstrapEvent(this._rootPointerEvent, e[s]);
                this.rootBoundary.mapEvent(n)
            }
            this.setCursor(this.rootBoundary.cursor)
        }
        onWheel(t) {
            if (!this.features.wheel) return;
            const e = this.normalizeWheelEvent(t);
            this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(e)
        }
        setTargetElement(t) {
            this._removeEvents(), this.domElement = t, ue.domElement = t, this._addEvents()
        }
        _addEvents() {
            if (this._eventsAdded || !this.domElement) return;
            ue.addTickerListener();
            const t = this.domElement.style;
            t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this._onPointerMove, !0), this.domElement.addEventListener("pointerdown", this._onPointerDown, !0), this.domElement.addEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this._onPointerOverOut, !0), globalThis.addEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this._onPointerMove, !0), this.domElement.addEventListener("mousedown", this._onPointerDown, !0), this.domElement.addEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this._onPointerOverOut, !0), globalThis.addEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this._onPointerDown, !0), this.domElement.addEventListener("touchend", this._onPointerUp, !0), this.domElement.addEventListener("touchmove", this._onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
                passive: !0,
                capture: !0
            }), this._eventsAdded = !0
        }
        _removeEvents() {
            if (!this._eventsAdded || !this.domElement) return;
            ue.removeTickerListener();
            const t = this.domElement.style;
            t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = "")), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this._onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this._onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this._onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this._onPointerMove, !0), this.domElement.removeEventListener("mousedown", this._onPointerDown, !0), this.domElement.removeEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this._onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this._onPointerDown, !0), this.domElement.removeEventListener("touchend", this._onPointerUp, !0), this.domElement.removeEventListener("touchmove", this._onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement = null, this._eventsAdded = !1
        }
        mapPositionToPoint(t, e, s) {
            const r = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
                    width: this.domElement.width,
                    height: this.domElement.height,
                    left: 0,
                    top: 0
                },
                n = 1 / this.resolution;
            t.x = (e - r.left) * (this.domElement.width / r.width) * n, t.y = (s - r.top) * (this.domElement.height / r.height) * n
        }
        _normalizeToPointerData(t) {
            const e = [];
            if (this.supportsTouchEvents && t instanceof TouchEvent)
                for (let s = 0, r = t.changedTouches.length; s < r; s++) {
                    const n = t.changedTouches[s];
                    typeof n.button > "u" && (n.button = 0), typeof n.buttons > "u" && (n.buttons = 1), typeof n.isPrimary > "u" && (n.isPrimary = t.touches.length === 1 && t.type === "touchstart"), typeof n.width > "u" && (n.width = n.radiusX || 1), typeof n.height > "u" && (n.height = n.radiusY || 1), typeof n.tiltX > "u" && (n.tiltX = 0), typeof n.tiltY > "u" && (n.tiltY = 0), typeof n.pointerType > "u" && (n.pointerType = "touch"), typeof n.pointerId > "u" && (n.pointerId = n.identifier || 0), typeof n.pressure > "u" && (n.pressure = n.force || .5), typeof n.twist > "u" && (n.twist = 0), typeof n.tangentialPressure > "u" && (n.tangentialPressure = 0), typeof n.layerX > "u" && (n.layerX = n.offsetX = n.clientX), typeof n.layerY > "u" && (n.layerY = n.offsetY = n.clientY), n.isNormalized = !0, n.type = t.type, n.altKey ?? (n.altKey = t.altKey), n.ctrlKey ?? (n.ctrlKey = t.ctrlKey), n.metaKey ?? (n.metaKey = t.metaKey), n.shiftKey ?? (n.shiftKey = t.shiftKey), e.push(n)
                } else if (!globalThis.MouseEvent || t instanceof MouseEvent && (!this.supportsPointerEvents || !(t instanceof globalThis.PointerEvent))) {
                    const s = t;
                    typeof s.isPrimary > "u" && (s.isPrimary = !0), typeof s.width > "u" && (s.width = 1), typeof s.height > "u" && (s.height = 1), typeof s.tiltX > "u" && (s.tiltX = 0), typeof s.tiltY > "u" && (s.tiltY = 0), typeof s.pointerType > "u" && (s.pointerType = "mouse"), typeof s.pointerId > "u" && (s.pointerId = Fg), typeof s.pressure > "u" && (s.pressure = .5), typeof s.twist > "u" && (s.twist = 0), typeof s.tangentialPressure > "u" && (s.tangentialPressure = 0), s.isNormalized = !0, e.push(s)
                } else e.push(t);
            return e
        }
        normalizeWheelEvent(t) {
            const e = this._rootWheelEvent;
            return this._transferMouseData(e, t), e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ, e.deltaMode = t.deltaMode, this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.nativeEvent = t, e.type = t.type, e
        }
        _bootstrapEvent(t, e) {
            return t.originalEvent = null, t.nativeEvent = e, t.pointerId = e.pointerId, t.width = e.width, t.height = e.height, t.isPrimary = e.isPrimary, t.pointerType = e.pointerType, t.pressure = e.pressure, t.tangentialPressure = e.tangentialPressure, t.tiltX = e.tiltX, t.tiltY = e.tiltY, t.twist = e.twist, this._transferMouseData(t, e), this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.isTrusted = e.isTrusted, t.type === "pointerleave" && (t.type = "pointerout"), t.type.startsWith("mouse") && (t.type = t.type.replace("mouse", "pointer")), t.type.startsWith("touch") && (t.type = Og[t.type] || t.type), t
        }
        _transferMouseData(t, e) {
            t.isTrusted = e.isTrusted, t.srcElement = e.srcElement, t.timeStamp = performance.now(), t.type = e.type, t.altKey = e.altKey, t.button = e.button, t.buttons = e.buttons, t.client.x = e.clientX, t.client.y = e.clientY, t.ctrlKey = e.ctrlKey, t.metaKey = e.metaKey, t.movement.x = e.movementX, t.movement.y = e.movementY, t.page.x = e.pageX, t.page.y = e.pageY, t.relatedTarget = null, t.shiftKey = e.shiftKey
        }
    };
Nn.extension = {
    name: "events",
    type: [w.WebGLSystem, w.CanvasSystem, w.WebGPUSystem],
    priority: -1
};
Nn.defaultEventFeatures = {
    move: !0,
    globalMove: !0,
    click: !0,
    wheel: !0
};
let sc = Nn;
const Lg = {
    onclick: null,
    onmousedown: null,
    onmouseenter: null,
    onmouseleave: null,
    onmousemove: null,
    onglobalmousemove: null,
    onmouseout: null,
    onmouseover: null,
    onmouseup: null,
    onmouseupoutside: null,
    onpointercancel: null,
    onpointerdown: null,
    onpointerenter: null,
    onpointerleave: null,
    onpointermove: null,
    onglobalpointermove: null,
    onpointerout: null,
    onpointerover: null,
    onpointertap: null,
    onpointerup: null,
    onpointerupoutside: null,
    onrightclick: null,
    onrightdown: null,
    onrightup: null,
    onrightupoutside: null,
    ontap: null,
    ontouchcancel: null,
    ontouchend: null,
    ontouchendoutside: null,
    ontouchmove: null,
    onglobaltouchmove: null,
    ontouchstart: null,
    onwheel: null,
    get interactive() {
        return this.eventMode === "dynamic" || this.eventMode === "static"
    },
    set interactive(i) {
        this.eventMode = i ? "static" : "passive"
    },
    _internalEventMode: void 0,
    get eventMode() {
        return this._internalEventMode ?? sc.defaultEventMode
    },
    set eventMode(i) {
        this._internalEventMode = i
    },
    isInteractive() {
        return this.eventMode === "static" || this.eventMode === "dynamic"
    },
    interactiveChildren: !0,
    hitArea: null,
    addEventListener(i, t, e) {
        const s = typeof e == "boolean" && e || typeof e == "object" && e.capture,
            r = typeof e == "object" ? e.signal : void 0,
            n = typeof e == "object" ? e.once === !0 : !1,
            o = typeof t == "function" ? void 0 : t;
        i = s ? `${i}capture` : i;
        const a = typeof t == "function" ? t : t.handleEvent,
            h = this;
        r && r.addEventListener("abort", () => {
            h.off(i, a, o)
        }), n ? h.once(i, a, o) : h.on(i, a, o)
    },
    removeEventListener(i, t, e) {
        const s = typeof e == "boolean" && e || typeof e == "object" && e.capture,
            r = typeof t == "function" ? void 0 : t;
        i = s ? `${i}capture` : i, t = typeof t == "function" ? t : t.handleEvent, this.off(i, t, r)
    },
    dispatchEvent(i) {
        if (!(i instanceof si)) throw new Error("Container cannot propagate events outside of the Federated Events API");
        return i.defaultPrevented = !1, i.path = null, i.target = this, i.manager.dispatchEvent(i), !i.defaultPrevented
    }
};
var ic = `in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;
const rc = {
        5: [.153388, .221461, .250301],
        7: [.071303, .131514, .189879, .214607],
        9: [.028532, .067234, .124009, .179044, .20236],
        11: [.0093, .028002, .065984, .121703, .175713, .198596],
        13: [.002406, .009255, .027867, .065666, .121117, .174868, .197641],
        15: [489e-6, .002403, .009246, .02784, .065602, .120999, .174697, .197448]
    },
    Dg = ["in vec2 vBlurTexCoords[%size%];", "uniform sampler2D uTexture;", "out vec4 finalColor;", "void main(void)", "{", "    %blur%", "}"].join(`
`);

function Ug(i) {
    const t = rc[i],
        e = t.length;
    let s = "";
    const r = "finalColor = ",
        n = "    + ",
        o = "texture(uTexture, vBlurTexCoords[%index%]) * %value%";
    for (let a = 0; a < i; a++) {
        const h = a === 0 ? r : n,
            l = a < e ? a : i - a - 1,
            c = o.replace("%index%", a.toString()).replace("%value%", t[l].toString());
        s += `${h}${c}
`
    }
    return Dg.replace("%blur%", `${s};`).replace("%size%", i.toString())
}
const Ng = `
    in vec2 aPosition;

    uniform float uStrength;

    out vec2 vBlurTexCoords[%size%];

    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;
    uniform vec4 uOutputTexture;

    vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

    vec2 filterTextureCoord( void )
    {
        return aPosition * (uOutputFrame.zw * uInputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        float pixelStrength = uInputSize.%dimension% * uStrength;

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;

function Wg(i, t) {
    const e = Math.ceil(i / 2);
    let s = Ng,
        r = "",
        n;
    t ? n = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);" : n = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";
    for (let o = 0; o < i; o++) {
        let a = n.replace("%index%", o.toString());
        a = a.replace("%sampleIndex%", `${o-(e-1)}.0`), r += a, r += `
`
    }
    return s = s.replace("%blur%", r), s = s.replace("%size%", i.toString()), s = s.replace("%dimension%", t ? "z" : "w"), s
}

function Hg(i, t) {
    const e = Wg(t, i),
        s = Ug(t);
    return $e.from({
        vertex: e,
        fragment: s,
        name: `blur-${i?"horizontal":"vertical"}-pass-filter`
    })
}
var zg = `

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct BlurUniforms {
  uStrength:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> blurUniforms : BlurUniforms;


struct VSOutput {
    @builtin(position) position: vec4<f32>,
    %blur-struct%
  };

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}


@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {

  let filteredCord = filterTextureCoord(aPosition);

  let pixelStrength = gfu.uInputSize.%dimension% * blurUniforms.uStrength;

  return VSOutput(
   filterVertexPosition(aPosition),
    %blur-vertex-out%
  );
}

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  %blur-fragment-in%
) -> @location(0) vec4<f32> {

    var   finalColor = vec4(0.0);

    %blur-sampling%

    return finalColor;
}
`;

function Vg(i, t) {
    const e = rc[t],
        s = e.length,
        r = [],
        n = [],
        o = [];
    for (let u = 0; u < t; u++) {
        r[u] = `@location(${u}) offset${u}: vec2<f32>,`, i ? n[u] = `filteredCord + vec2(${u-s+1} * pixelStrength, 0.0),` : n[u] = `filteredCord + vec2(0.0, ${u-s+1} * pixelStrength),`;
        const d = u < s ? u : t - u - 1,
            f = e[d].toString();
        o[u] = `finalColor += textureSample(uTexture, uSampler, offset${u}) * ${f};`
    }
    const a = r.join(`
`),
        h = n.join(`
`),
        l = o.join(`
`),
        c = zg.replace("%blur-struct%", a).replace("%blur-vertex-out%", h).replace("%blur-fragment-in%", a).replace("%blur-sampling%", l).replace("%dimension%", i ? "z" : "w");
    return Pe.from({
        vertex: {
            source: c,
            entryPoint: "mainVertex"
        },
        fragment: {
            source: c,
            entryPoint: "mainFragment"
        }
    })
}
const nc = class oc extends ii {
    constructor(t) {
        t = {
            ...oc.defaultOptions,
            ...t
        };
        const e = Hg(t.horizontal, t.kernelSize),
            s = Vg(t.horizontal, t.kernelSize);
        super({
            glProgram: e,
            gpuProgram: s,
            resources: {
                blurUniforms: {
                    uStrength: {
                        value: 0,
                        type: "f32"
                    }
                }
            },
            ...t
        }), this.horizontal = t.horizontal, this.legacy = t.legacy ?? !1, this._quality = 0, this.quality = t.quality, this.blur = t.strength, this._blurUniforms = this.resources.blurUniforms, this._uniforms = this._blurUniforms.uniforms
    }
    apply(t, e, s, r) {
        this.legacy ? this._applyLegacy(t, e, s, r) : this._applyOptimized(t, e, s, r)
    }
    _applyLegacy(t, e, s, r) {
        if (this._uniforms.uStrength = this.strength / this.passes, this.passes === 1) t.applyFilter(this, e, s, r);
        else {
            const n = bt.getSameSizeTexture(e);
            let o = e,
                a = n;
            this._state.blend = !1;
            const h = t.renderer.type === Vt.WEBGPU;
            for (let l = 0; l < this.passes - 1; l++) {
                t.applyFilter(this, o, a, l === 0 ? !0 : h);
                const c = a;
                a = o, o = c
            }
            this._state.blend = !0, t.applyFilter(this, o, s, r), bt.returnTexture(n)
        }
    }
    _applyOptimized(t, e, s, r) {
        if (this._uniforms.uStrength = this._calculateInitialStrength(), this.passes === 1) t.applyFilter(this, e, s, r);
        else {
            const n = bt.getSameSizeTexture(e);
            let o = e,
                a = n;
            this._state.blend = !1;
            const h = t.renderer,
                l = h.type === Vt.WEBGPU,
                c = l ? h.renderPipes.uniformBatch : null;
            for (let u = 0; u < this.passes - 1; u++) {
                c && this.groups[1].setResource(c.getUboResource(this._blurUniforms), 0), t.applyFilter(this, o, a, l);
                const d = a;
                a = o, o = d, this._uniforms.uStrength *= .5
            }
            c && this.groups[1].setResource(c.getUboResource(this._blurUniforms), 0), this._state.blend = !0, t.applyFilter(this, o, s, r), bt.returnTexture(n)
        }
    }
    _calculateInitialStrength() {
        let t = 1,
            e = .5;
        for (let s = 1; s < this.passes; s++) t += e * e, e *= .5;
        return this.strength / Math.sqrt(t)
    }
    get blur() {
        return this.strength
    }
    set blur(t) {
        this.padding = 1 + Math.abs(t) * 2, this.strength = t
    }
    get quality() {
        return this._quality
    }
    set quality(t) {
        this._quality = t, this.passes = t
    }
};
nc.defaultOptions = {
    strength: 8,
    quality: 4,
    kernelSize: 5,
    legacy: !1
};
let Pr = nc;
class zt extends ii {
    constructor(...t) {
        let e = t[0] ?? {};
        typeof e == "number" && (U(at, "BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"), e = {
            strength: e
        }, t[1] !== void 0 && (e.quality = t[1]), t[2] !== void 0 && (e.resolution = t[2] || "inherit"), t[3] !== void 0 && (e.kernelSize = t[3])), e = {
            ...Pr.defaultOptions,
            ...e
        };
        const {
            strength: s,
            strengthX: r,
            strengthY: n,
            quality: o,
            ...a
        } = e;
        super({
            ...a,
            compatibleRenderers: Vt.BOTH,
            resources: {}
        }), this._repeatEdgePixels = !1, this.blurXFilter = new Pr({
            horizontal: !0,
            ...e
        }), this.blurYFilter = new Pr({
            horizontal: !1,
            ...e
        }), this.quality = o, this.strengthX = r ?? s, this.strengthY = n ?? s, this.repeatEdgePixels = !1
    }
    apply(t, e, s, r) {
        const n = Math.abs(this.blurXFilter.strength),
            o = Math.abs(this.blurYFilter.strength);
        if (n && o) {
            const a = bt.getSameSizeTexture(e);
            this.blurXFilter.blendMode = "normal", this.blurXFilter.apply(t, e, a, !0), this.blurYFilter.blendMode = this.blendMode, this.blurYFilter.apply(t, a, s, r), bt.returnTexture(a)
        } else o ? (this.blurYFilter.blendMode = this.blendMode, this.blurYFilter.apply(t, e, s, r)) : (this.blurXFilter.blendMode = this.blendMode, this.blurXFilter.apply(t, e, s, r))
    }
    updatePadding() {
        this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.blur), Math.abs(this.blurYFilter.blur)) * 2
    }
    get strength() {
        if (this.strengthX !== this.strengthY) throw new Error("BlurFilter's strengthX and strengthY are different");
        return this.strengthX
    }
    set strength(t) {
        this.blurXFilter.blur = this.blurYFilter.blur = t, this.updatePadding()
    }
    get quality() {
        return this.blurXFilter.quality
    }
    set quality(t) {
        this.blurXFilter.quality = this.blurYFilter.quality = t
    }
    get strengthX() {
        return this.blurXFilter.blur
    }
    set strengthX(t) {
        this.blurXFilter.blur = t, this.updatePadding()
    }
    get strengthY() {
        return this.blurYFilter.blur
    }
    set strengthY(t) {
        this.blurYFilter.blur = t, this.updatePadding()
    }
    get blur() {
        return U("8.3.0", "BlurFilter.blur is deprecated, please use BlurFilter.strength instead."), this.strength
    }
    set blur(t) {
        U("8.3.0", "BlurFilter.blur is deprecated, please use BlurFilter.strength instead."), this.strength = t
    }
    get blurX() {
        return U("8.3.0", "BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."), this.strengthX
    }
    set blurX(t) {
        U("8.3.0", "BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."), this.strengthX = t
    }
    get blurY() {
        return U("8.3.0", "BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."), this.strengthY
    }
    set blurY(t) {
        U("8.3.0", "BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."), this.strengthY = t
    }
    get repeatEdgePixels() {
        return this._repeatEdgePixels
    }
    set repeatEdgePixels(t) {
        this._repeatEdgePixels = t, this.updatePadding()
    }
}
zt.defaultOptions = {
    strength: 8,
    quality: 4,
    kernelSize: 5,
    legacy: !1
};
var Xg = `in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main() {
    finalColor = texture(uTexture, vTextureCoord);
}
`,
    Xa = `struct GlobalFilterUniforms {
  uInputSize: vec4<f32>,
  uInputPixel: vec4<f32>,
  uInputClamp: vec4<f32>,
  uOutputFrame: vec4<f32>,
  uGlobalFrame: vec4<f32>,
  uOutputTexture: vec4<f32>,
};

@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

struct VSOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>
};

fn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition: vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, uv);
}
`;
class Yg extends ii {
    constructor() {
        const t = Pe.from({
                vertex: {
                    source: Xa,
                    entryPoint: "mainVertex"
                },
                fragment: {
                    source: Xa,
                    entryPoint: "mainFragment"
                },
                name: "passthrough-filter"
            }),
            e = $e.from({
                vertex: ic,
                fragment: Xg,
                name: "passthrough-filter"
            });
        super({
            gpuProgram: t,
            glProgram: e
        })
    }
}
class ac {
    constructor(t) {
        this._renderer = t
    }
    push(t, e, s) {
        this._renderer.renderPipes.batch.break(s), s.add({
            renderPipeId: "filter",
            canBundle: !1,
            action: "pushFilter",
            container: e,
            filterEffect: t
        })
    }
    pop(t, e, s) {
        this._renderer.renderPipes.batch.break(s), s.add({
            renderPipeId: "filter",
            action: "popFilter",
            canBundle: !1
        })
    }
    execute(t) {
        t.action === "pushFilter" ? this._renderer.filter.push(t) : t.action === "popFilter" && this._renderer.filter.pop()
    }
    destroy() {
        this._renderer = null
    }
}
ac.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "filter"
};
const Ya = new N;

function $g(i, t) {
    t.clear();
    const e = t.matrix;
    for (let s = 0; s < i.length; s++) {
        const r = i[s];
        if (r.globalDisplayStatus < 7) continue;
        const n = r.renderGroup ?? r.parentRenderGroup;
        n != null && n.isCachedAsTexture ? t.matrix = Ya.copyFrom(n.textureOffsetInverseTransform).append(r.worldTransform) : n != null && n._parentCacheAsTextureRenderGroup ? t.matrix = Ya.copyFrom(n._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(r.groupTransform) : t.matrix = r.worldTransform, t.addBounds(r.bounds)
    }
    return t.matrix = e, t
}
const jg = new Pn({
    attributes: {
        aPosition: {
            buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
            format: "float32x2",
            stride: 2 * 4,
            offset: 0
        }
    },
    indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3])
});
class qg {
    constructor() {
        this.skip = !1, this.inputTexture = null, this.backTexture = null, this.filters = null, this.bounds = new Ft, this.container = null, this.blendRequired = !1, this.outputRenderSurface = null, this.globalFrame = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }, this.firstEnabledIndex = -1, this.lastEnabledIndex = -1
    }
}
class hc {
    constructor(t) {
        this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new te({
            uInputSize: {
                value: new Float32Array(4),
                type: "vec4<f32>"
            },
            uInputPixel: {
                value: new Float32Array(4),
                type: "vec4<f32>"
            },
            uInputClamp: {
                value: new Float32Array(4),
                type: "vec4<f32>"
            },
            uOutputFrame: {
                value: new Float32Array(4),
                type: "vec4<f32>"
            },
            uGlobalFrame: {
                value: new Float32Array(4),
                type: "vec4<f32>"
            },
            uOutputTexture: {
                value: new Float32Array(4),
                type: "vec4<f32>"
            }
        }), this._globalFilterBindGroup = new Se({}), this.renderer = t
    }
    get activeBackTexture() {
        var t;
        return (t = this._activeFilterData) == null ? void 0 : t.backTexture
    }
    push(t) {
        const e = this.renderer,
            s = t.filterEffect.filters,
            r = this._pushFilterData();
        r.skip = !1, r.filters = s, r.container = t.container, r.outputRenderSurface = e.renderTarget.renderSurface;
        const n = e.renderTarget.renderTarget.colorTexture.source,
            o = n.resolution,
            a = n.antialias;
        if (s.every(f => !f.enabled)) {
            r.skip = !0;
            return
        }
        const h = r.bounds;
        if (this._calculateFilterArea(t, h), this._calculateFilterBounds(r, e.renderTarget.rootViewPort, a, o, 1), r.skip) return;
        const l = this._getPreviousFilterData(),
            c = this._findFilterResolution(o);
        let u = 0,
            d = 0;
        l && (u = l.bounds.minX, d = l.bounds.minY), this._calculateGlobalFrame(r, u, d, c, n.width, n.height), this._setupFilterTextures(r, h, e, l)
    }
    generateFilteredTexture({
        texture: t,
        filters: e
    }) {
        const s = this._pushFilterData();
        this._activeFilterData = s, s.skip = !1, s.filters = e;
        const r = t.source,
            n = r.resolution,
            o = r.antialias;
        if (e.every(f => !f.enabled)) return s.skip = !0, t;
        const a = s.bounds;
        if (a.addRect(t.frame), this._calculateFilterBounds(s, a.rectangle, o, n, 0), s.skip) return t;
        const h = n;
        this._calculateGlobalFrame(s, 0, 0, h, r.width, r.height), s.outputRenderSurface = bt.getOptimalTexture(a.width, a.height, s.resolution, s.antialias), s.backTexture = O.EMPTY, s.inputTexture = t, this.renderer.renderTarget.finishRenderPass(), this._applyFiltersToTexture(s, !0);
        const d = s.outputRenderSurface;
        return d.source.alphaMode = "premultiplied-alpha", d
    }
    pop() {
        const t = this.renderer,
            e = this._popFilterData();
        e.skip || (t.globalUniforms.pop(), t.renderTarget.finishRenderPass(), this._activeFilterData = e, this._applyFiltersToTexture(e, !1), e.blendRequired && bt.returnTexture(e.backTexture), bt.returnTexture(e.inputTexture))
    }
    getBackTexture(t, e, s) {
        const r = t.colorTexture.source._resolution,
            n = bt.getOptimalTexture(e.width, e.height, r, !1);
        let o = e.minX,
            a = e.minY;
        s && (o -= s.minX, a -= s.minY), o = Math.floor(o * r), a = Math.floor(a * r);
        const h = Math.ceil(e.width * r),
            l = Math.ceil(e.height * r);
        return this.renderer.renderTarget.copyToTexture(t, n, {
            x: o,
            y: a
        }, {
            width: h,
            height: l
        }, {
            x: 0,
            y: 0
        }), n
    }
    applyFilter(t, e, s, r) {
        const n = this.renderer,
            o = this._activeFilterData,
            h = o.outputRenderSurface === s,
            l = n.renderTarget.rootRenderTarget.colorTexture.source._resolution,
            c = this._findFilterResolution(l);
        let u = 0,
            d = 0;
        if (h) {
            const p = this._findPreviousFilterOffset();
            u = p.x, d = p.y
        }
        this._updateFilterUniforms(e, s, o, u, d, c, h, r);
        const f = t.enabled ? t : this._getPassthroughFilter();
        this._setupBindGroupsAndRender(f, e, n)
    }
    calculateSpriteMatrix(t, e) {
        const s = this._activeFilterData,
            r = t.set(s.inputTexture._source.width, 0, 0, s.inputTexture._source.height, s.bounds.minX, s.bounds.minY),
            n = e.worldTransform.copyTo(N.shared),
            o = e.renderGroup || e.parentRenderGroup;
        return o && o.cacheToLocalTransform && n.prepend(o.cacheToLocalTransform), n.invert(), r.prepend(n), r.scale(1 / e.texture.orig.width, 1 / e.texture.orig.height), r.translate(e.anchor.x, e.anchor.y), r
    }
    destroy() {
        var t;
        (t = this._passthroughFilter) == null || t.destroy(!0), this._passthroughFilter = null
    }
    _getPassthroughFilter() {
        return this._passthroughFilter ?? (this._passthroughFilter = new Yg), this._passthroughFilter
    }
    _setupBindGroupsAndRender(t, e, s) {
        if (s.renderPipes.uniformBatch) {
            const r = s.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);
            this._globalFilterBindGroup.setResource(r, 0)
        } else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms, 0);
        this._globalFilterBindGroup.setResource(e.source, 1), this._globalFilterBindGroup.setResource(e.source.style, 2), t.groups[0] = this._globalFilterBindGroup, s.encoder.draw({
            geometry: jg,
            shader: t,
            state: t._state,
            topology: "triangle-list"
        }), s.type === Vt.WEBGL && s.renderTarget.finishRenderPass()
    }
    _setupFilterTextures(t, e, s, r) {
        if (t.backTexture = O.EMPTY, t.inputTexture = bt.getOptimalTexture(e.width, e.height, t.resolution, t.antialias), t.blendRequired) {
            s.renderTarget.finishRenderPass();
            const n = s.renderTarget.getRenderTarget(t.outputRenderSurface);
            t.backTexture = this.getBackTexture(n, e, r == null ? void 0 : r.bounds)
        }
        s.renderTarget.bind(t.inputTexture, !0), s.globalUniforms.push({
            offset: e
        })
    }
    _calculateGlobalFrame(t, e, s, r, n, o) {
        const a = t.globalFrame;
        a.x = e * r, a.y = s * r, a.width = n * r, a.height = o * r
    }
    _updateFilterUniforms(t, e, s, r, n, o, a, h) {
        const l = this._filterGlobalUniforms.uniforms,
            c = l.uOutputFrame,
            u = l.uInputSize,
            d = l.uInputPixel,
            f = l.uInputClamp,
            p = l.uGlobalFrame,
            m = l.uOutputTexture;
        a ? (c[0] = s.bounds.minX - r, c[1] = s.bounds.minY - n) : (c[0] = 0, c[1] = 0), c[2] = t.frame.width, c[3] = t.frame.height, u[0] = t.source.width, u[1] = t.source.height, u[2] = 1 / u[0], u[3] = 1 / u[1], d[0] = t.source.pixelWidth, d[1] = t.source.pixelHeight, d[2] = 1 / d[0], d[3] = 1 / d[1], f[0] = .5 * d[2], f[1] = .5 * d[3], f[2] = t.frame.width * u[2] - .5 * d[2], f[3] = t.frame.height * u[3] - .5 * d[3];
        const g = this.renderer.renderTarget.rootRenderTarget.colorTexture;
        p[0] = r * o, p[1] = n * o, p[2] = g.source.width * o, p[3] = g.source.height * o, e instanceof O && (e.source.resource = null);
        const _ = this.renderer.renderTarget.getRenderTarget(e);
        this.renderer.renderTarget.bind(e, !!h), e instanceof O ? (m[0] = e.frame.width, m[1] = e.frame.height) : (m[0] = _.width, m[1] = _.height), m[2] = _.isRoot ? -1 : 1, this._filterGlobalUniforms.update()
    }
    _findFilterResolution(t) {
        let e = this._filterStackIndex - 1;
        for (; e > 0 && this._filterStack[e].skip;) --e;
        return e > 0 && this._filterStack[e].inputTexture ? this._filterStack[e].inputTexture.source._resolution : t
    }
    _findPreviousFilterOffset() {
        let t = 0,
            e = 0,
            s = this._filterStackIndex;
        for (; s > 0;) {
            s--;
            const r = this._filterStack[s];
            if (!r.skip) {
                t = r.bounds.minX, e = r.bounds.minY;
                break
            }
        }
        return {
            x: t,
            y: e
        }
    }
    _calculateFilterArea(t, e) {
        if (t.renderables ? $g(t.renderables, e) : t.filterEffect.filterArea ? (e.clear(), e.addRect(t.filterEffect.filterArea), e.applyMatrix(t.container.worldTransform)) : t.container.getFastGlobalBounds(!0, e), t.container) {
            const r = (t.container.renderGroup || t.container.parentRenderGroup).cacheToLocalTransform;
            r && e.applyMatrix(r)
        }
    }
    _applyFiltersToTexture(t, e) {
        const s = t.inputTexture,
            r = t.bounds,
            n = t.filters,
            o = t.firstEnabledIndex,
            a = t.lastEnabledIndex;
        if (this._globalFilterBindGroup.setResource(s.source.style, 2), this._globalFilterBindGroup.setResource(t.backTexture.source, 3), o === a) n[o].apply(this, s, t.outputRenderSurface, e);
        else {
            let h = t.inputTexture;
            const l = bt.getOptimalTexture(r.width, r.height, h.source._resolution, !1);
            let c = l;
            for (let u = o; u < a; u++) {
                const d = n[u];
                if (!d.enabled) continue;
                d.apply(this, h, c, !0);
                const f = h;
                h = c, c = f
            }
            n[a].apply(this, h, t.outputRenderSurface, e), bt.returnTexture(l)
        }
    }
    _calculateFilterBounds(t, e, s, r, n) {
        var _;
        const o = this.renderer,
            a = t.bounds,
            h = t.filters;
        let l = 1 / 0,
            c = 0,
            u = !0,
            d = !1,
            f = !1,
            p = !0,
            m = -1,
            g = -1;
        for (let x = 0; x < h.length; x++) {
            const b = h[x];
            if (!b.enabled) continue;
            if (m === -1 && (m = x), g = x, l = Math.min(l, b.resolution === "inherit" ? r : b.resolution), c += b.padding, b.antialias === "off" ? u = !1 : b.antialias === "inherit" && u && (u = s), b.clipToViewport || (p = !1), !!!(b.compatibleRenderers & o.type)) {
                f = !1;
                break
            }
            if (b.blendRequired && !(((_ = o.backBuffer) == null ? void 0 : _.useBackBuffer) ?? !0)) {
                V("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."), f = !1;
                break
            }
            f = !0, d || (d = b.blendRequired)
        }
        if (!f) {
            t.skip = !0;
            return
        }
        if (p && a.fitBounds(0, e.width / r, 0, e.height / r), a.scale(l).ceil().scale(1 / l).pad((c | 0) * n), !a.isPositive) {
            t.skip = !0;
            return
        }
        t.antialias = u, t.resolution = l, t.blendRequired = d, t.firstEnabledIndex = m, t.lastEnabledIndex = g
    }
    _popFilterData() {
        return this._filterStackIndex--, this._filterStack[this._filterStackIndex]
    }
    _getPreviousFilterData() {
        let t, e = this._filterStackIndex - 1;
        for (; e > 0 && (e--, t = this._filterStack[e], !!t.skip););
        return t
    }
    _pushFilterData() {
        let t = this._filterStack[this._filterStackIndex];
        return t || (t = this._filterStack[this._filterStackIndex] = new qg), this._filterStackIndex++, t
    }
}
hc.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem],
    name: "filter"
};
var Kg = `in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha;
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    float a = alphaMul * masky.r * npmAlpha * clip;

    if (uInverse == 1.0) {
        a = 1.0 - a;
    }

    finalColor = original * a;
}
`,
    Zg = `in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`,
    $a = `struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
  uInverse:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;
    var uAlpha = filterUniforms.uAlpha;

    var clip = step(3.5,
      step(maskClamp.x, filterUv.x) +
      step(maskClamp.y, filterUv.y) +
      step(filterUv.x, maskClamp.z) +
      step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);
    var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);

    var a: f32 = alphaMul * mask.r * uAlpha * clip;

    if (filterUniforms.uInverse == 1.0) {
        a = 1.0 - a;
    }

    return source * a;
}
`;
class Qg extends ii {
    constructor(t) {
        const {
            sprite: e,
            ...s
        } = t, r = new Oh(e.texture), n = new te({
            uFilterMatrix: {
                value: new N,
                type: "mat3x3<f32>"
            },
            uMaskClamp: {
                value: r.uClampFrame,
                type: "vec4<f32>"
            },
            uAlpha: {
                value: 1,
                type: "f32"
            },
            uInverse: {
                value: t.inverse ? 1 : 0,
                type: "f32"
            }
        }), o = Pe.from({
            vertex: {
                source: $a,
                entryPoint: "mainVertex"
            },
            fragment: {
                source: $a,
                entryPoint: "mainFragment"
            }
        }), a = $e.from({
            vertex: Zg,
            fragment: Kg,
            name: "mask-filter"
        });
        super({
            ...s,
            gpuProgram: o,
            glProgram: a,
            clipToViewport: !1,
            resources: {
                filterUniforms: n,
                uMaskTexture: e.texture.source
            }
        }), this.sprite = e, this._textureMatrix = r
    }
    set inverse(t) {
        this.resources.filterUniforms.uniforms.uInverse = t ? 1 : 0
    }
    get inverse() {
        return this.resources.filterUniforms.uniforms.uInverse === 1
    }
    apply(t, e, s, r) {
        this._textureMatrix.texture = this.sprite.texture, t.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix, this.sprite).prepend(this._textureMatrix.mapCoord), this.resources.uMaskTexture = this.sprite.texture.source, t.applyFilter(this, e, s, r)
    }
}
class Jg {
    constructor() {
        this.isBatchable = !1
    }
    reset() {
        this.isBatchable = !1, this.context = null, this.graphicsData && (this.graphicsData.destroy(), this.graphicsData = null)
    }
    destroy() {
        this.reset()
    }
}
class t_ {
    constructor() {
        this.instructions = new yn
    }
    init() {
        this.instructions.reset()
    }
    destroy() {
        this.instructions.destroy(), this.instructions = null
    }
}
const Wn = class ln {
    constructor(t) {
        this._renderer = t, this._managedContexts = new oe({
            renderer: t,
            type: "resource",
            name: "graphicsContext"
        })
    }
    init(t) {
        ln.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? ln.defaultOptions.bezierSmoothness
    }
    getContextRenderData(t) {
        return this.getGpuContext(t).graphicsData || this._initContextRenderData(t)
    }
    updateGpuContext(t) {
        const e = t._gpuData,
            s = !!e[this._renderer.uid],
            r = e[this._renderer.uid] || this._initContext(t);
        return (t.dirty || !s) && (s && r.reset(), r.isBatchable = !1, t.dirty = !1), r
    }
    getGpuContext(t) {
        return t._gpuData[this._renderer.uid] || this._initContext(t)
    }
    _initContextRenderData(t) {
        const e = new t_,
            s = this.getGpuContext(t);
        return s.graphicsData = e, e.init(), e
    }
    _initContext(t) {
        const e = new Jg;
        return e.context = t, t._gpuData[this._renderer.uid] = e, this._managedContexts.add(t), e
    }
    destroy() {
        this._managedContexts.destroy(), this._renderer = null
    }
};
Wn.extension = {
    type: [w.CanvasSystem],
    name: "graphicsContext"
};
Wn.defaultOptions = {
    bezierSmoothness: .5
};
let e_ = Wn;
class lc {
    constructor(t, e) {
        this.state = _e.for2d(), this.renderer = t, this._adaptor = e, this.renderer.runners.contextChange.add(this), this._managedGraphics = new oe({
            renderer: t,
            type: "renderable",
            priority: -1,
            name: "graphics"
        })
    }
    contextChange() {
        this._adaptor.contextChange(this.renderer)
    }
    validateRenderable(t) {
        return !1
    }
    addRenderable(t, e) {
        this._managedGraphics.add(t), this.renderer.renderPipes.batch.break(e), e.add(t)
    }
    updateRenderable(t) {}
    execute(t) {
        t.isRenderable && this._adaptor.execute(this, t)
    }
    destroy() {
        this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null
    }
}
lc.extension = {
    type: [w.CanvasPipes],
    name: "graphics"
};

function cc(i, t, e) {
    const s = (i >> 24 & 255) / 255;
    t[e++] = (i & 255) / 255 * s, t[e++] = (i >> 8 & 255) / 255 * s, t[e++] = (i >> 16 & 255) / 255 * s, t[e++] = s
}
class s_ {
    constructor() {
        this.batches = [], this.batched = !1
    }
    destroy() {
        this.batches.forEach(t => {
            Et.return(t)
        }), this.batches.length = 0
    }
}
class uc {
    constructor(t, e) {
        this.state = _e.for2d(), this.renderer = t, this._adaptor = e, this.renderer.runners.contextChange.add(this), this._managedGraphics = new oe({
            renderer: t,
            type: "renderable",
            priority: -1,
            name: "graphics"
        })
    }
    contextChange() {
        this._adaptor.contextChange(this.renderer)
    }
    validateRenderable(t) {
        const e = t.context,
            s = !!t._gpuData,
            n = this.renderer.graphicsContext.updateGpuContext(e);
        return !!(n.isBatchable || s !== n.isBatchable)
    }
    addRenderable(t, e) {
        const r = this.renderer.graphicsContext.updateGpuContext(t.context);
        t.didViewUpdate && this._rebuild(t), r.isBatchable ? this._addToBatcher(t, e) : (this.renderer.renderPipes.batch.break(e), e.add(t))
    }
    updateRenderable(t) {
        const s = this._getGpuDataForRenderable(t).batches;
        for (let r = 0; r < s.length; r++) {
            const n = s[r];
            n._batcher.updateElement(n)
        }
    }
    execute(t) {
        if (!t.isRenderable) return;
        const e = this.renderer,
            s = t.context;
        if (!e.graphicsContext.getGpuContext(s).batches.length) return;
        const n = s.customShader || this._adaptor.shader;
        this.state.blendMode = t.groupBlendMode;
        const o = n.resources.localUniforms.uniforms;
        o.uTransformMatrix = t.groupTransform, o.uRound = e._roundPixels | t._roundPixels, cc(t.groupColorAlpha, o.uColor, 0), this._adaptor.execute(this, t)
    }
    _rebuild(t) {
        const e = this._getGpuDataForRenderable(t),
            r = this.renderer.graphicsContext.updateGpuContext(t.context);
        e.destroy(), r.isBatchable && this._updateBatchesForRenderable(t, e)
    }
    _addToBatcher(t, e) {
        const s = this.renderer.renderPipes.batch,
            r = this._getGpuDataForRenderable(t).batches;
        for (let n = 0; n < r.length; n++) {
            const o = r[n];
            s.addToBatch(o, e)
        }
    }
    _getGpuDataForRenderable(t) {
        return t._gpuData[this.renderer.uid] || this._initGpuDataForRenderable(t)
    }
    _initGpuDataForRenderable(t) {
        const e = new s_;
        return t._gpuData[this.renderer.uid] = e, this._managedGraphics.add(t), e
    }
    _updateBatchesForRenderable(t, e) {
        const s = t.context,
            n = this.renderer.graphicsContext.getGpuContext(s),
            o = this.renderer._roundPixels | t._roundPixels;
        e.batches = n.batches.map(a => {
            const h = Et.get(In);
            return a.copyTo(h), h.renderable = t, h.roundPixels = o, h
        })
    }
    destroy() {
        this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null
    }
}
uc.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes],
    name: "graphics"
};
Y.add(lc);
Y.add(uc);
Y.add(e_);
Y.add(On);
class Z extends vn {
    constructor(t) {
        t instanceof jt && (t = {
            context: t
        });
        const {
            context: e,
            roundPixels: s,
            ...r
        } = t || {};
        super({
            label: "Graphics",
            ...r
        }), this.renderPipeId = "graphics", e ? this.context = e : (this.context = this._ownedContext = new jt, this.context.autoGarbageCollect = this.autoGarbageCollect), this.didViewUpdate = !0, this.allowChildren = !1, this.roundPixels = s ?? !1
    }
    set context(t) {
        t !== this._context && (this._context && (this._context.off("update", this.onViewUpdate, this), this._context.off("unload", this.unload, this)), this._context = t, this._context.on("update", this.onViewUpdate, this), this._context.on("unload", this.unload, this), this.onViewUpdate())
    }
    get context() {
        return this._context
    }
    get bounds() {
        return this._context.bounds
    }
    updateBounds() {}
    containsPoint(t) {
        return this._context.containsPoint(t)
    }
    destroy(t) {
        this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === !0 || (t == null ? void 0 : t.context) === !0) && this._context.destroy(t), this._ownedContext = null, this._context = null, super.destroy(t)
    }
    _onTouch(t) {
        this._gcLastUsed = t, this._context._gcLastUsed = t
    }
    _callContextMethod(t, e) {
        return this.context[t](...e), this
    }
    setFillStyle(...t) {
        return this._callContextMethod("setFillStyle", t)
    }
    setStrokeStyle(...t) {
        return this._callContextMethod("setStrokeStyle", t)
    }
    fill(...t) {
        return this._callContextMethod("fill", t)
    }
    stroke(...t) {
        return this._callContextMethod("stroke", t)
    }
    texture(...t) {
        return this._callContextMethod("texture", t)
    }
    beginPath() {
        return this._callContextMethod("beginPath", [])
    }
    cut() {
        return this._callContextMethod("cut", [])
    }
    arc(...t) {
        return this._callContextMethod("arc", t)
    }
    arcTo(...t) {
        return this._callContextMethod("arcTo", t)
    }
    arcToSvg(...t) {
        return this._callContextMethod("arcToSvg", t)
    }
    bezierCurveTo(...t) {
        return this._callContextMethod("bezierCurveTo", t)
    }
    closePath() {
        return this._callContextMethod("closePath", [])
    }
    ellipse(...t) {
        return this._callContextMethod("ellipse", t)
    }
    circle(...t) {
        return this._callContextMethod("circle", t)
    }
    path(...t) {
        return this._callContextMethod("path", t)
    }
    lineTo(...t) {
        return this._callContextMethod("lineTo", t)
    }
    moveTo(...t) {
        return this._callContextMethod("moveTo", t)
    }
    quadraticCurveTo(...t) {
        return this._callContextMethod("quadraticCurveTo", t)
    }
    rect(...t) {
        return this._callContextMethod("rect", t)
    }
    roundRect(...t) {
        return this._callContextMethod("roundRect", t)
    }
    poly(...t) {
        return this._callContextMethod("poly", t)
    }
    regularPoly(...t) {
        return this._callContextMethod("regularPoly", t)
    }
    roundPoly(...t) {
        return this._callContextMethod("roundPoly", t)
    }
    roundShape(...t) {
        return this._callContextMethod("roundShape", t)
    }
    filletRect(...t) {
        return this._callContextMethod("filletRect", t)
    }
    chamferRect(...t) {
        return this._callContextMethod("chamferRect", t)
    }
    star(...t) {
        return this._callContextMethod("star", t)
    }
    svg(...t) {
        return this._callContextMethod("svg", t)
    }
    restore(...t) {
        return this._callContextMethod("restore", t)
    }
    save() {
        return this._callContextMethod("save", [])
    }
    getTransform() {
        return this.context.getTransform()
    }
    resetTransform() {
        return this._callContextMethod("resetTransform", [])
    }
    rotateTransform(...t) {
        return this._callContextMethod("rotate", t)
    }
    scaleTransform(...t) {
        return this._callContextMethod("scale", t)
    }
    setTransform(...t) {
        return this._callContextMethod("setTransform", t)
    }
    transform(...t) {
        return this._callContextMethod("transform", t)
    }
    translateTransform(...t) {
        return this._callContextMethod("translate", t)
    }
    clear() {
        return this._callContextMethod("clear", [])
    }
    get fillStyle() {
        return this._context.fillStyle
    }
    set fillStyle(t) {
        this._context.fillStyle = t
    }
    get strokeStyle() {
        return this._context.strokeStyle
    }
    set strokeStyle(t) {
        this._context.strokeStyle = t
    }
    clone(t = !1) {
        return t ? new Z(this._context.clone()) : (this._ownedContext = null, new Z(this._context))
    }
    lineStyle(t, e, s) {
        U(at, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
        const r = {};
        return t && (r.width = t), e && (r.color = e), s && (r.alpha = s), this.context.strokeStyle = r, this
    }
    beginFill(t, e) {
        U(at, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
        const s = {};
        return t !== void 0 && (s.color = t), e !== void 0 && (s.alpha = e), this.context.fillStyle = s, this
    }
    endFill() {
        U(at, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
        const t = this.context.strokeStyle;
        return (t.width !== jt.defaultStrokeStyle.width || t.color !== jt.defaultStrokeStyle.color || t.alpha !== jt.defaultStrokeStyle.alpha) && this.context.stroke(), this
    }
    drawCircle(...t) {
        return U(at, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t)
    }
    drawEllipse(...t) {
        return U(at, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t)
    }
    drawPolygon(...t) {
        return U(at, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t)
    }
    drawRect(...t) {
        return U(at, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t)
    }
    drawRoundedRect(...t) {
        return U(at, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t)
    }
    drawStar(...t) {
        return U(at, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t)
    }
}
class ti extends Q {
    constructor(...t) {
        let e = t[0];
        Array.isArray(t[0]) && (e = {
            textures: t[0],
            autoUpdate: t[1]
        });
        const {
            animationSpeed: s = 1,
            autoPlay: r = !1,
            autoUpdate: n = !0,
            loop: o = !0,
            onComplete: a = null,
            onFrameChange: h = null,
            onLoop: l = null,
            textures: c,
            updateAnchor: u = !1,
            ...d
        } = e, [f] = c;
        super({
            ...d,
            texture: f instanceof O ? f : f.texture
        }), this._textures = null, this._durations = null, this._autoUpdate = n, this._isConnectedToTicker = !1, this.animationSpeed = s, this.loop = o, this.updateAnchor = u, this.onComplete = a, this.onFrameChange = h, this.onLoop = l, this._currentTime = 0, this._playing = !1, this._previousFrame = null, this.textures = c, r && this.play()
    }
    stop() {
        this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (Gt.shared.remove(this.update, this), this._isConnectedToTicker = !1))
    }
    play() {
        this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (Gt.shared.add(this.update, this, ze.HIGH), this._isConnectedToTicker = !0))
    }
    gotoAndStop(t) {
        this.stop(), this.currentFrame = t
    }
    gotoAndPlay(t) {
        this.currentFrame = t, this.play()
    }
    update(t) {
        if (!this._playing) return;
        const e = t.deltaTime,
            s = this.animationSpeed * e,
            r = this.currentFrame;
        if (this._durations !== null) {
            let n = this._currentTime % 1 * this._durations[this.currentFrame];
            for (n += s / 60 * 1e3; n < 0;) this._currentTime--, n += this._durations[this.currentFrame];
            const o = Math.sign(this.animationSpeed * e);
            for (this._currentTime = Math.floor(this._currentTime); n >= this._durations[this.currentFrame];) n -= this._durations[this.currentFrame] * o, this._currentTime += o;
            this._currentTime += n / this._durations[this.currentFrame]
        } else this._currentTime += s;
        this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : r !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < r || this.animationSpeed < 0 && this.currentFrame > r) && this.onLoop(), this._updateTexture())
    }
    _updateTexture() {
        const t = this.currentFrame;
        this._previousFrame !== t && (this._previousFrame = t, this.texture = this._textures[t], this.updateAnchor && this.texture.defaultAnchor && this.anchor.copyFrom(this.texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame))
    }
    destroy(t = !1) {
        if (typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
            const s = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
            this._textures.forEach(r => {
                this.texture !== r && r.destroy(s)
            })
        }
        this._textures = [], this._durations = null, this.stop(), super.destroy(t), this.onComplete = null, this.onFrameChange = null, this.onLoop = null
    }
    static fromFrames(t) {
        const e = [];
        for (let s = 0; s < t.length; ++s) e.push(O.from(t[s]));
        return new ti(e)
    }
    static fromImages(t) {
        const e = [];
        for (let s = 0; s < t.length; ++s) e.push(O.from(t[s]));
        return new ti(e)
    }
    get totalFrames() {
        return this._textures.length
    }
    get textures() {
        return this._textures
    }
    set textures(t) {
        if (t[0] instanceof O) this._textures = t, this._durations = null;
        else {
            this._textures = [], this._durations = [];
            for (let e = 0; e < t.length; e++) this._textures.push(t[e].texture), this._durations.push(t[e].time)
        }
        this._previousFrame = null, this.gotoAndStop(0), this._updateTexture()
    }
    get currentFrame() {
        let t = Math.floor(this._currentTime) % this._textures.length;
        return t < 0 && (t += this._textures.length), t
    }
    set currentFrame(t) {
        if (t < 0 || t > this.totalFrames - 1) throw new Error(`[AnimatedSprite]: Invalid frame index value ${t}, expected to be between 0 and totalFrames ${this.totalFrames}.`);
        const e = this.currentFrame;
        this._currentTime = t, e !== this.currentFrame && this._updateTexture()
    }
    get playing() {
        return this._playing
    }
    get autoUpdate() {
        return this._autoUpdate
    }
    set autoUpdate(t) {
        t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (Gt.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (Gt.shared.add(this.update, this), this._isConnectedToTicker = !0))
    }
}
let es;

function ja(i) {
    const t = X.get().createCanvas(6, 1),
        e = t.getContext("2d");
    return e.fillStyle = i, e.fillRect(0, 0, 6, 1), t
}

function dc() {
    if (es !== void 0) return es;
    try {
        const i = ja("#ff00ff"),
            t = ja("#ffff00"),
            s = X.get().createCanvas(6, 1).getContext("2d");
        s.globalCompositeOperation = "multiply", s.drawImage(i, 0, 0), s.drawImage(t, 2, 0);
        const r = s.getImageData(2, 0, 1, 1);
        if (!r) es = !1;
        else {
            const n = r.data;
            es = n[0] === 255 && n[1] === 0 && n[2] === 0
        }
    } catch {
        es = !1
    }
    return es
}
const it = {
    canvas: null,
    convertTintToImage: !1,
    cacheStepsPerColorChannel: 8,
    canUseMultiply: dc(),
    tintMethod: null,
    _canvasSourceCache: new WeakMap,
    _unpremultipliedCache: new WeakMap,
    getCanvasSource: i => {
        const t = i.source,
            e = t == null ? void 0 : t.resource;
        if (!e) return null;
        const s = t.alphaMode === "premultiplied-alpha",
            r = t.resourceWidth ?? t.pixelWidth,
            n = t.resourceHeight ?? t.pixelHeight,
            o = r !== t.pixelWidth || n !== t.pixelHeight;
        if (s) {
            if ((e instanceof HTMLCanvasElement || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas) && !o) return e;
            const a = it._unpremultipliedCache.get(t);
            if ((a == null ? void 0 : a.resourceId) === t._resourceId) return a.canvas
        }
        if (e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || e instanceof Uint16Array || e instanceof Int16Array || e instanceof Uint32Array || e instanceof Int32Array || e instanceof Float32Array || e instanceof ArrayBuffer) {
            const a = it._canvasSourceCache.get(t);
            if ((a == null ? void 0 : a.resourceId) === t._resourceId) return a.canvas;
            const h = X.get().createCanvas(t.pixelWidth, t.pixelHeight),
                l = h.getContext("2d"),
                c = l.createImageData(t.pixelWidth, t.pixelHeight),
                u = c.data,
                d = e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
            if (t.format === "bgra8unorm")
                for (let f = 0; f < u.length && f + 3 < d.length; f += 4) u[f] = d[f + 2], u[f + 1] = d[f + 1], u[f + 2] = d[f], u[f + 3] = d[f + 3];
            else u.set(d.subarray(0, u.length));
            return l.putImageData(c, 0, 0), it._canvasSourceCache.set(t, {
                canvas: h,
                resourceId: t._resourceId
            }), h
        }
        if (s) {
            const a = X.get().createCanvas(t.pixelWidth, t.pixelHeight),
                h = a.getContext("2d", {
                    willReadFrequently: !0
                });
            a.width = t.pixelWidth, a.height = t.pixelHeight, h.drawImage(e, 0, 0);
            const l = h.getImageData(0, 0, a.width, a.height),
                c = l.data;
            for (let u = 0; u < c.length; u += 4) {
                const d = c[u + 3];
                if (d > 0) {
                    const f = 255 / d;
                    c[u] = Math.min(255, c[u] * f + .5), c[u + 1] = Math.min(255, c[u + 1] * f + .5), c[u + 2] = Math.min(255, c[u + 2] * f + .5)
                }
            }
            return h.putImageData(l, 0, 0), it._unpremultipliedCache.set(t, {
                canvas: a,
                resourceId: t._resourceId
            }), a
        }
        if (o) {
            const a = it._canvasSourceCache.get(t);
            if ((a == null ? void 0 : a.resourceId) === t._resourceId) return a.canvas;
            const h = X.get().createCanvas(t.pixelWidth, t.pixelHeight),
                l = h.getContext("2d");
            return h.width = t.pixelWidth, h.height = t.pixelHeight, l.drawImage(e, 0, 0), it._canvasSourceCache.set(t, {
                canvas: h,
                resourceId: t._resourceId
            }), h
        }
        return e
    },
    getTintedCanvas: (i, t) => {
        const e = i.texture,
            s = lt.shared.setValue(t).toHex(),
            r = e.tintCache || (e.tintCache = {}),
            n = r[s],
            o = e.source._resourceId;
        if ((n == null ? void 0 : n.tintId) === o) return n;
        const a = n && "getContext" in n ? n : X.get().createCanvas();
        return it.tintMethod(e, t, a), a.tintId = o, r[s] = a, r[s]
    },
    getTintedPattern: (i, t) => {
        const e = lt.shared.setValue(t).toHex(),
            s = i.patternCache || (i.patternCache = {}),
            r = i.source._resourceId;
        let n = s[e];
        return (n == null ? void 0 : n.tintId) === r || (it.canvas || (it.canvas = X.get().createCanvas()), it.tintMethod(i, t, it.canvas), n = it.canvas.getContext("2d").createPattern(it.canvas, "repeat"), n.tintId = r, s[e] = n), n
    },
    applyPatternTransform: (i, t, e = !0) => {
        if (!t) return;
        const s = i;
        if (!s.setTransform) return;
        const r = globalThis.DOMMatrix;
        if (!r) return;
        const n = new r([t.a, t.b, t.c, t.d, t.tx, t.ty]);
        s.setTransform(e ? n.inverse() : n)
    },
    tintWithMultiply: (i, t, e) => {
        const s = e.getContext("2d"),
            r = i.frame.clone(),
            n = i.source._resolution ?? i.source.resolution ?? 1,
            o = i.rotate;
        r.x *= n, r.y *= n, r.width *= n, r.height *= n;
        const a = tt.isVertical(o),
            h = a ? r.height : r.width,
            l = a ? r.width : r.height;
        e.width = Math.ceil(h), e.height = Math.ceil(l), s.save(), s.fillStyle = lt.shared.setValue(t).toHex(), s.fillRect(0, 0, h, l), s.globalCompositeOperation = "multiply";
        const c = it.getCanvasSource(i);
        if (!c) {
            s.restore();
            return
        }
        o && it._applyInverseRotation(s, o, r.width, r.height), s.drawImage(c, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height), s.globalCompositeOperation = "destination-atop", s.drawImage(c, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height), s.restore()
    },
    tintWithOverlay: (i, t, e) => {
        const s = e.getContext("2d"),
            r = i.frame.clone(),
            n = i.source._resolution ?? i.source.resolution ?? 1,
            o = i.rotate;
        r.x *= n, r.y *= n, r.width *= n, r.height *= n;
        const a = tt.isVertical(o),
            h = a ? r.height : r.width,
            l = a ? r.width : r.height;
        e.width = Math.ceil(h), e.height = Math.ceil(l), s.save(), s.globalCompositeOperation = "copy", s.fillStyle = lt.shared.setValue(t).toHex(), s.fillRect(0, 0, h, l), s.globalCompositeOperation = "destination-atop";
        const c = it.getCanvasSource(i);
        if (!c) {
            s.restore();
            return
        }
        o && it._applyInverseRotation(s, o, r.width, r.height), s.drawImage(c, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height), s.restore()
    },
    tintWithPerPixel: (i, t, e) => {
        const s = e.getContext("2d"),
            r = i.frame.clone(),
            n = i.source._resolution ?? i.source.resolution ?? 1,
            o = i.rotate;
        r.x *= n, r.y *= n, r.width *= n, r.height *= n;
        const a = tt.isVertical(o),
            h = a ? r.height : r.width,
            l = a ? r.width : r.height;
        e.width = Math.ceil(h), e.height = Math.ceil(l), s.save(), s.globalCompositeOperation = "copy";
        const c = it.getCanvasSource(i);
        if (!c) {
            s.restore();
            return
        }
        o && it._applyInverseRotation(s, o, r.width, r.height), s.drawImage(c, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height), s.restore();
        const u = t >> 16 & 255,
            d = t >> 8 & 255,
            f = t & 255,
            p = s.getImageData(0, 0, h, l),
            m = p.data;
        for (let g = 0; g < m.length; g += 4) m[g] = m[g] * u / 255, m[g + 1] = m[g + 1] * d / 255, m[g + 2] = m[g + 2] * f / 255;
        s.putImageData(p, 0, 0)
    },
    _applyInverseRotation: (i, t, e, s) => {
        const r = tt.inv(t),
            n = tt.uX(r),
            o = tt.uY(r),
            a = tt.vX(r),
            h = tt.vY(r),
            l = -Math.min(0, n * e, a * s, n * e + a * s),
            c = -Math.min(0, o * e, h * s, o * e + h * s);
        i.transform(n, o, a, h, l, c)
    }
};
it.tintMethod = it.canUseMultiply ? it.tintWithMultiply : it.tintWithPerPixel;
const ki = {
        name: "local-uniform-bit",
        vertex: {
            header: `

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,
            main: `
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,
            end: `
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `
        }
    },
    i_ = {
        ...ki,
        vertex: {
            ...ki.vertex,
            header: ki.vertex.header.replace("group(1)", "group(2)")
        }
    },
    fc = {
        name: "local-uniform-bit",
        vertex: {
            header: `

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,
            main: `
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,
            end: `
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `
        }
    };
class r_ extends vn {
    constructor(t, e) {
        const {
            text: s,
            resolution: r,
            style: n,
            anchor: o,
            width: a,
            height: h,
            roundPixels: l,
            ...c
        } = t;
        super({
            ...c
        }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = e, this.text = s ?? "", this.style = n, this.resolution = r ?? null, this.allowChildren = !1, this._anchor = new Bt({
            _onUpdate: () => {
                this.onViewUpdate()
            }
        }), o && (this.anchor = o), this.roundPixels = l ?? !1, a !== void 0 && (this.width = a), h !== void 0 && (this.height = h)
    }
    get anchor() {
        return this._anchor
    }
    set anchor(t) {
        typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t)
    }
    set text(t) {
        t = t.toString(), this._text !== t && (this._text = t, this.onViewUpdate())
    }
    get text() {
        return this._text
    }
    set resolution(t) {
        this._autoResolution = t === null, this._resolution = t, this.onViewUpdate()
    }
    get resolution() {
        return this._resolution
    }
    get style() {
        return this._style
    }
    set style(t) {
        var e;
        t || (t = {}), (e = this._style) == null || e.off("update", this.onViewUpdate, this), t instanceof this._styleClass ? this._style = t : this._style = new this._styleClass(t), this._style.on("update", this.onViewUpdate, this), this.onViewUpdate()
    }
    get width() {
        return Math.abs(this.scale.x) * this.bounds.width
    }
    set width(t) {
        this._setWidth(t, this.bounds.width)
    }
    get height() {
        return Math.abs(this.scale.y) * this.bounds.height
    }
    set height(t) {
        this._setHeight(t, this.bounds.height)
    }
    getSize(t) {
        return t || (t = {}), t.width = Math.abs(this.scale.x) * this.bounds.width, t.height = Math.abs(this.scale.y) * this.bounds.height, t
    }
    setSize(t, e) {
        typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this.bounds.width), e !== void 0 && this._setHeight(e, this.bounds.height)
    }
    containsPoint(t) {
        const e = this.bounds.width,
            s = this.bounds.height,
            r = -e * this.anchor.x;
        let n = 0;
        return t.x >= r && t.x <= r + e && (n = -s * this.anchor.y, t.y >= n && t.y <= n + s)
    }
    onViewUpdate() {
        this.didViewUpdate || (this._didTextUpdate = !0), super.onViewUpdate()
    }
    destroy(t = !1) {
        super.destroy(t), this.owner = null, this._bounds = null, this._anchor = null, (typeof t == "boolean" ? t : t != null && t.style) && this._style.destroy(t), this._style = null, this._text = null
    }
    get styleKey() {
        return `${this._text}:${this._style.styleKey}:${this._resolution}`
    }
}

function n_(i, t) {
    let e = i[0] ?? {};
    return (typeof e == "string" || i[1]) && (U(at, `use new ${t}({ text: "hi!", style }) instead`), e = {
        text: e,
        style: i[1]
    }), e
}
class o_ {
    constructor(t) {
        this._canvasPool = Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1
    }
    _createCanvasAndContext(t, e) {
        const s = X.get().createCanvas();
        s.width = t, s.height = e;
        const r = s.getContext("2d");
        return {
            canvas: s,
            context: r
        }
    }
    getOptimalCanvasAndContext(t, e, s = 1) {
        t = Math.ceil(t * s - 1e-6), e = Math.ceil(e * s - 1e-6), t = gs(t), e = gs(e);
        const r = (t << 17) + (e << 1);
        this._canvasPool[r] || (this._canvasPool[r] = []);
        let n = this._canvasPool[r].pop();
        return n || (n = this._createCanvasAndContext(t, e)), n
    }
    returnCanvasAndContext(t) {
        const e = t.canvas,
            {
                width: s,
                height: r
            } = e,
            n = (s << 17) + (r << 1);
        t.context.resetTransform(), t.context.clearRect(0, 0, s, r), this._canvasPool[n].push(t)
    }
    clear() {
        this._canvasPool = {}
    }
}
const Xe = new o_;
bs.register(Xe);
let ke = null,
    de = null;

function a_(i, t) {
    ke || (ke = X.get().createCanvas(256, 128), de = ke.getContext("2d", {
        willReadFrequently: !0
    }), de.globalCompositeOperation = "copy", de.globalAlpha = 1), (ke.width < i || ke.height < t) && (ke.width = gs(i), ke.height = gs(t))
}

function qa(i, t, e) {
    for (let s = 0, r = 4 * e * t; s < t; ++s, r += 4)
        if (i[r + 3] !== 0) return !1;
    return !0
}

function Ka(i, t, e, s, r) {
    const n = 4 * t;
    for (let o = s, a = s * n + 4 * e; o <= r; ++o, a += n)
        if (i[a + 3] !== 0) return !1;
    return !0
}

function h_(...i) {
    let t = i[0];
    t.canvas || (t = {
        canvas: i[0],
        resolution: i[1]
    });
    const {
        canvas: e
    } = t, s = Math.min(t.resolution ?? 1, 1), r = t.width ?? e.width, n = t.height ?? e.height;
    let o = t.output;
    if (a_(r, n), !de) throw new TypeError("Failed to get canvas 2D context");
    de.drawImage(e, 0, 0, r, n, 0, 0, r * s, n * s);
    const h = de.getImageData(0, 0, r, n).data;
    let l = 0,
        c = 0,
        u = r - 1,
        d = n - 1;
    for (; c < n && qa(h, r, c);) ++c;
    if (c === n) return nt.EMPTY;
    for (; qa(h, r, d);) --d;
    for (; Ka(h, r, l, c, d);) ++l;
    for (; Ka(h, r, u, c, d);) --u;
    return ++u, ++d, de.globalCompositeOperation = "source-over", de.strokeRect(l, c, u - l, d - c), de.globalCompositeOperation = "copy", o ?? (o = new nt), o.set(l / s, c / s, (u - l) / s, (d - c) / s), o
}
/**
 * tiny-lru
 *
 * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 11.4.7
 */
class l_ {
    constructor(t = 0, e = 0, s = !1) {
        this.first = null, this.items = Object.create(null), this.last = null, this.max = t, this.resetTtl = s, this.size = 0, this.ttl = e
    }
    clear() {
        return this.first = null, this.items = Object.create(null), this.last = null, this.size = 0, this
    }
    delete(t) {
        if (this.has(t)) {
            const e = this.items[t];
            delete this.items[t], this.size--, e.prev !== null && (e.prev.next = e.next), e.next !== null && (e.next.prev = e.prev), this.first === e && (this.first = e.next), this.last === e && (this.last = e.prev)
        }
        return this
    }
    entries(t = this.keys()) {
        const e = new Array(t.length);
        for (let s = 0; s < t.length; s++) {
            const r = t[s];
            e[s] = [r, this.get(r)]
        }
        return e
    }
    evict(t = !1) {
        if (t || this.size > 0) {
            const e = this.first;
            delete this.items[e.key], --this.size === 0 ? (this.first = null, this.last = null) : (this.first = e.next, this.first.prev = null)
        }
        return this
    }
    expiresAt(t) {
        let e;
        return this.has(t) && (e = this.items[t].expiry), e
    }
    get(t) {
        const e = this.items[t];
        if (e !== void 0) {
            if (this.ttl > 0 && e.expiry <= Date.now()) {
                this.delete(t);
                return
            }
            return this.moveToEnd(e), e.value
        }
    }
    has(t) {
        return t in this.items
    }
    moveToEnd(t) {
        this.last !== t && (t.prev !== null && (t.prev.next = t.next), t.next !== null && (t.next.prev = t.prev), this.first === t && (this.first = t.next), t.prev = this.last, t.next = null, this.last !== null && (this.last.next = t), this.last = t, this.first === null && (this.first = t))
    }
    keys() {
        const t = new Array(this.size);
        let e = this.first,
            s = 0;
        for (; e !== null;) t[s++] = e.key, e = e.next;
        return t
    }
    setWithEvicted(t, e, s = this.resetTtl) {
        let r = null;
        if (this.has(t)) this.set(t, e, !0, s);
        else {
            this.max > 0 && this.size === this.max && (r = {
                ...this.first
            }, this.evict(!0));
            let n = this.items[t] = {
                expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
                key: t,
                prev: this.last,
                next: null,
                value: e
            };
            ++this.size === 1 ? this.first = n : this.last.next = n, this.last = n
        }
        return r
    }
    set(t, e, s = !1, r = this.resetTtl) {
        let n = this.items[t];
        return s || n !== void 0 ? (n.value = e, s === !1 && r && (n.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl), this.moveToEnd(n)) : (this.max > 0 && this.size === this.max && this.evict(!0), n = this.items[t] = {
            expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
            key: t,
            prev: this.last,
            next: null,
            value: e
        }, ++this.size === 1 ? this.first = n : this.last.next = n, this.last = n), this
    }
    values(t = this.keys()) {
        const e = new Array(t.length);
        for (let s = 0; s < t.length; s++) e[s] = this.get(t[s]);
        return e
    }
}

function pc(i = 1e3, t = 0, e = !1) {
    if (isNaN(i) || i < 0) throw new TypeError("Invalid max value");
    if (isNaN(t) || t < 0) throw new TypeError("Invalid ttl value");
    if (typeof e != "boolean") throw new TypeError("Invalid resetTtl value");
    return new l_(i, t, e)
}

function mc(i) {
    return !!i.tagStyles && Object.keys(i.tagStyles).length > 0
}

function gc(i) {
    return i.includes("<")
}

function c_(i, t) {
    return i.clone().assign(t)
}

function u_(i, t) {
    const e = [],
        s = t.tagStyles;
    if (!mc(t) || !gc(i)) return e.push({
        text: i,
        style: t
    }), e;
    const r = [t],
        n = [];
    let o = "",
        a = 0;
    for (; a < i.length;) {
        const h = i[a];
        if (h === "<") {
            const l = i.indexOf(">", a);
            if (l === -1) {
                o += h, a++;
                continue
            }
            const c = i.slice(a + 1, l);
            if (c.startsWith("/")) {
                const u = c.slice(1).trim();
                if (n.length > 0 && n[n.length - 1] === u) {
                    o.length > 0 && (e.push({
                        text: o,
                        style: r[r.length - 1]
                    }), o = ""), r.pop(), n.pop(), a = l + 1;
                    continue
                } else {
                    o += i.slice(a, l + 1), a = l + 1;
                    continue
                }
            } else {
                const u = c.trim();
                if (s[u]) {
                    o.length > 0 && (e.push({
                        text: o,
                        style: r[r.length - 1]
                    }), o = "");
                    const d = r[r.length - 1],
                        f = c_(d, s[u]);
                    r.push(f), n.push(u), a = l + 1;
                    continue
                } else {
                    o += i.slice(a, l + 1), a = l + 1;
                    continue
                }
            }
        } else o += h, a++
    }
    return o.length > 0 && e.push({
        text: o,
        style: r[r.length - 1]
    }), e
}
const d_ = [10, 13],
    f_ = new Set(d_),
    p_ = [9, 32, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8200, 8201, 8202, 8287, 12288],
    m_ = new Set(p_),
    g_ = [9, 32],
    __ = new Set(g_),
    x_ = [45, 8208, 8211, 8212, 173],
    y_ = new Set(x_),
    b_ = /(\r\n|\r|\n)/,
    v_ = /(?:\r\n|\r|\n)/;

function Vi(i) {
    return typeof i != "string" ? !1 : f_.has(i.charCodeAt(0))
}

function Wt(i, t) {
    return typeof i != "string" ? !1 : m_.has(i.charCodeAt(0))
}

function Za(i) {
    return typeof i != "string" ? !1 : __.has(i.charCodeAt(0))
}

function _c(i) {
    return typeof i != "string" ? !1 : y_.has(i.charCodeAt(0))
}

function Hn(i) {
    return i === "normal" || i === "pre-line"
}

function zn(i) {
    return i === "normal"
}

function ce(i) {
    if (typeof i != "string") return "";
    let t = i.length - 1;
    for (; t >= 0 && Wt(i[t]);) t--;
    return t < i.length - 1 ? i.slice(0, t + 1) : i
}

function xc(i) {
    const t = [],
        e = [];
    if (typeof i != "string") return t;
    for (let s = 0; s < i.length; s++) {
        const r = i[s],
            n = i[s + 1];
        if (Wt(r) || Vi(r)) {
            e.length > 0 && (t.push(e.join("")), e.length = 0), r === "\r" && n === `
` ? (t.push(`\r
`), s++) : t.push(r);
            continue
        }
        e.push(r), _c(r) && n && !Wt(n) && !Vi(n) && (t.push(e.join("")), e.length = 0)
    }
    return e.length > 0 && t.push(e.join("")), t
}

function yc(i, t, e, s) {
    const r = e(i),
        n = [];
    for (let o = 0; o < r.length; o++) {
        let a = r[o],
            h = a,
            l = 1;
        for (; r[o + l];) {
            const c = r[o + l];
            if (!s(h, c, i, o, t)) a += c, h = c, l++;
            else break
        }
        o += l - 1, n.push(a)
    }
    return n
}
const w_ = /\r\n|\r|\n/g;

function T_(i, t, e, s, r, n, o, a) {
    var ht, R;
    const h = u_(i, t);
    if (zn(t.whiteSpace))
        for (let I = 0; I < h.length; I++) {
            const z = h[I];
            h[I] = {
                text: z.text.replace(w_, " "),
                style: z.style
            }
        }
    const c = [];
    let u = [];
    for (const I of h) {
        const z = I.text.split(b_);
        for (let B = 0; B < z.length; B++) {
            const L = z[B];
            L === `\r
` || L === "\r" || L === `
` ? (c.push(u), u = []) : L.length > 0 && u.push({
                text: L,
                style: I.style
            })
        }
    }(u.length > 0 || c.length === 0) && c.push(u);
    const d = e ? S_(c, t, s, r, o, a) : c,
        f = [],
        p = [],
        m = [],
        g = [],
        _ = [];
    let x = 0;
    const b = t._fontString,
        y = n(b);
    y.fontSize === 0 && (y.fontSize = t.fontSize, y.ascent = t.fontSize);
    let S = "",
        v = !!t.dropShadow,
        T = ((ht = t._stroke) == null ? void 0 : ht.width) || 0;
    for (const I of d) {
        let z = 0,
            B = y.ascent,
            L = y.descent,
            q = "";
        for (const W of I) {
            const et = W.style._fontString,
                rt = n(et);
            et !== S && (s.font = et, S = et);
            const ut = r(W.text, W.style.letterSpacing, s);
            z += ut, B = Math.max(B, rt.ascent), L = Math.max(L, rt.descent), q += W.text;
            const ct = ((R = W.style._stroke) == null ? void 0 : R.width) || 0;
            ct > T && (T = ct), !v && W.style.dropShadow && (v = !0)
        }
        I.length === 0 && (B = y.ascent, L = y.descent), f.push(z), p.push(B), m.push(L), _.push(q);
        const K = t.lineHeight || B + L;
        g.push(K + t.leading), x = Math.max(x, z)
    }
    const M = T,
        P = (e && t.align !== "left" ? Math.max(x, t.wordWrapWidth) : x) + M + (t.dropShadow ? t.dropShadow.distance : 0);
    let k = 0;
    for (let I = 0; I < g.length; I++) k += g[I];
    k = Math.max(k, g[0] + M);
    const G = k + (t.dropShadow ? t.dropShadow.distance : 0),
        F = t.lineHeight || y.fontSize;
    return {
        width: P,
        height: G,
        lines: _,
        lineWidths: f,
        lineHeight: F + t.leading,
        maxLineWidth: x,
        fontProperties: y,
        runsByLine: d,
        lineAscents: p,
        lineDescents: m,
        lineHeights: g,
        hasDropShadow: v
    }
}

function S_(i, t, e, s, r, n) {
    var g;
    const {
        letterSpacing: o,
        whiteSpace: a,
        wordWrapWidth: h,
        breakWords: l
    } = t, c = Hn(a), u = h + o, d = {};
    let f = "";
    const p = (_, x) => {
            const b = `${_}|${x.styleKey}`;
            let y = d[b];
            if (y === void 0) {
                const S = x._fontString;
                S !== f && (e.font = S, f = S), y = s(_, x.letterSpacing, e) + x.letterSpacing, d[b] = y
            }
            return y
        },
        m = [];
    for (const _ of i) {
        const x = C_(_),
            b = m.length,
            y = k => {
                let G = 0,
                    F = k;
                do {
                    const {
                        token: ht,
                        style: R
                    } = x[F];
                    G += p(ht, R), F++
                } while (F < x.length && x[F].continuesFromPrevious);
                return G
            },
            S = k => {
                const G = [];
                let F = k;
                do G.push({
                    token: x[F].token,
                    style: x[F].style
                }), F++; while (F < x.length && x[F].continuesFromPrevious);
                return G
            };
        let v = [],
            T = 0,
            M = !c,
            C = null;
        const A = () => {
                C && C.text.length > 0 && v.push(C), C = null
            },
            P = () => {
                if (A(), v.length > 0) {
                    const k = v[v.length - 1];
                    k.text = ce(k.text), k.text.length === 0 && v.pop()
                }
                m.push(v), v = [], T = 0, M = !1
            };
        for (let k = 0; k < x.length; k++) {
            const {
                token: G,
                style: F,
                continuesFromPrevious: ht
            } = x[k], R = p(G, F);
            if (c) {
                const B = Wt(G),
                    L = (C == null ? void 0 : C.text[C.text.length - 1]) ?? ((g = v[v.length - 1]) == null ? void 0 : g.text.slice(-1)) ?? "",
                    q = L ? Wt(L) : !1;
                if (B && q) continue
            }
            const I = !ht,
                z = I ? y(k) : R;
            if (z > u && I)
                if (T > 0 && P(), l) {
                    const B = S(k);
                    for (let L = 0; L < B.length; L++) {
                        const q = B[L].token,
                            K = B[L].style,
                            W = yc(q, l, n, r);
                        for (const et of W) {
                            const rt = p(et, K);
                            rt + T > u && P(), !C || C.style !== K ? (A(), C = {
                                text: et,
                                style: K
                            }) : C.text += et, T += rt
                        }
                    }
                    k += B.length - 1
                } else {
                    const B = S(k);
                    A(), m.push(B.map(L => ({
                        text: L.token,
                        style: L.style
                    }))), M = !1, k += B.length - 1
                }
            else if (z + T > u && I) {
                if (Wt(G)) {
                    M = !1;
                    continue
                }
                P(), C = {
                    text: G,
                    style: F
                }, T = R
            } else if (ht && !l) !C || C.style !== F ? (A(), C = {
                text: G,
                style: F
            }) : C.text += G, T += R;
            else {
                const B = Wt(G);
                if (T === 0 && B && !M) continue;
                !C || C.style !== F ? (A(), C = {
                    text: G,
                    style: F
                }) : C.text += G, T += R
            }
        }
        if (A(), v.length > 0) {
            const k = v[v.length - 1];
            k.text = ce(k.text), k.text.length === 0 && v.pop()
        }(v.length > 0 || m.length === b) && m.push(v)
    }
    return m
}

function C_(i) {
    const t = [];
    let e = !1;
    for (const s of i) {
        const r = xc(s.text);
        let n = !0;
        for (const o of r) {
            const a = Wt(o) || Vi(o),
                h = n && e && !a;
            t.push({
                token: o,
                style: s.style,
                continuesFromPrevious: h
            }), e = !a, n = !1
        }
    }
    return t
}
const A_ = {
    willReadFrequently: !0
};

function Qa(i, t, e, s, r) {
    let n = e[i];
    return typeof n != "number" && (n = r(i, t, s) + t, e[i] = n), n
}

function P_(i, t, e, s, r, n, o) {
    const a = e.getContext("2d", A_);
    a.font = t._fontString;
    let h = 0,
        l = "";
    const c = [],
        u = Object.create(null),
        {
            letterSpacing: d,
            whiteSpace: f
        } = t,
        p = Hn(f),
        m = zn(f);
    let g = !p;
    const _ = t.wordWrapWidth + d,
        x = xc(i);
    for (let y = 0; y < x.length; y++) {
        let S = x[y];
        if (Vi(S)) {
            if (!m) {
                c.push(ce(l)), g = !p, l = "", h = 0;
                continue
            }
            S = " "
        }
        if (p) {
            const T = Wt(S),
                M = Wt(l[l.length - 1]);
            if (T && M) continue
        }
        const v = Qa(S, d, u, a, s);
        if (v > _)
            if (l !== "" && (c.push(ce(l)), l = "", h = 0), r(S, t.breakWords)) {
                const T = yc(S, t.breakWords, o, n);
                for (const M of T) {
                    const C = Qa(M, d, u, a, s);
                    C + h > _ && (c.push(ce(l)), g = !1, l = "", h = 0), l += M, h += C
                }
            } else l.length > 0 && (c.push(ce(l)), l = "", h = 0), c.push(ce(S)), g = !1, l = "", h = 0;
        else v + h > _ && (g = !1, c.push(ce(l)), l = "", h = 0), (l.length > 0 || !Wt(S) || g) && (l += S, h += v)
    }
    const b = ce(l);
    return b.length > 0 && c.push(b), c.join(`
`)
}
const Ja = {
        willReadFrequently: !0
    },
    xe = class j {
        static get experimentalLetterSpacingSupported() {
            let t = j._experimentalLetterSpacingSupported;
            if (t === void 0) {
                const e = X.get().getCanvasRenderingContext2D().prototype;
                t = j._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e
            }
            return t
        }
        constructor(t, e, s, r, n, o, a, h, l, c) {
            this.text = t, this.style = e, this.width = s, this.height = r, this.lines = n, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = h, this.fontProperties = l, c && (this.runsByLine = c.runsByLine, this.lineAscents = c.lineAscents, this.lineDescents = c.lineDescents, this.lineHeights = c.lineHeights, this.hasDropShadow = c.hasDropShadow)
        }
        static measureText(t = " ", e, s = j._canvas, r = e.wordWrap) {
            var S;
            const n = `${t}-${e.styleKey}-wordWrap-${r}`;
            if (j._measurementCache.has(n)) return j._measurementCache.get(n);
            if (mc(e) && gc(t)) {
                const v = T_(t, e, r, j._context, j._measureText, j.measureFont, j.canBreakChars, j.wordWrapSplit),
                    T = new j(t, e, v.width, v.height, v.lines, v.lineWidths, v.lineHeight, v.maxLineWidth, v.fontProperties, {
                        runsByLine: v.runsByLine,
                        lineAscents: v.lineAscents,
                        lineDescents: v.lineDescents,
                        lineHeights: v.lineHeights,
                        hasDropShadow: v.hasDropShadow
                    });
                return j._measurementCache.set(n, T), T
            }
            const a = e._fontString,
                h = j.measureFont(a);
            h.fontSize === 0 && (h.fontSize = e.fontSize, h.ascent = e.fontSize, h.descent = 0);
            const l = j._context;
            l.font = a;
            const u = (r ? j._wordWrap(t, e, s) : t).split(v_),
                d = new Array(u.length);
            let f = 0;
            for (let v = 0; v < u.length; v++) {
                const T = j._measureText(u[v], e.letterSpacing, l);
                d[v] = T, f = Math.max(f, T)
            }
            const p = ((S = e._stroke) == null ? void 0 : S.width) ?? 0,
                m = e.lineHeight || h.fontSize,
                g = j._getAlignWidth(f, e, r),
                _ = j._adjustWidthForStyle(g, e),
                x = Math.max(m, h.fontSize + p) + (u.length - 1) * (m + e.leading),
                b = j._adjustHeightForStyle(x, e),
                y = new j(t, e, _, b, u, d, m + e.leading, f, h);
            return j._measurementCache.set(n, y), y
        }
        static _adjustWidthForStyle(t, e) {
            var n;
            const s = ((n = e._stroke) == null ? void 0 : n.width) || 0;
            let r = t + s;
            return e.dropShadow && (r += e.dropShadow.distance), r
        }
        static _adjustHeightForStyle(t, e) {
            let s = t;
            return e.dropShadow && (s += e.dropShadow.distance), s
        }
        static _getAlignWidth(t, e, s) {
            return s && e.align !== "left" ? Math.max(t, e.wordWrapWidth) : t
        }
        static _measureText(t, e, s) {
            let r = !1;
            j.experimentalLetterSpacingSupported && (j.experimentalLetterSpacing ? (s.letterSpacing = `${e}px`, s.textLetterSpacing = `${e}px`, r = !0) : (s.letterSpacing = "0px", s.textLetterSpacing = "0px"));
            const n = s.measureText(t);
            let o = n.width;
            const a = -(n.actualBoundingBoxLeft ?? 0);
            let l = (n.actualBoundingBoxRight ?? 0) - a;
            if (o > 0)
                if (r) o -= e, l -= e;
                else {
                    const c = (j.graphemeSegmenter(t).length - 1) * e;
                    o += c, l += c
                } return Math.max(o, l)
        }
        static _wordWrap(t, e, s = j._canvas) {
            return P_(t, e, s, j._measureText, j.canBreakWords, j.canBreakChars, j.wordWrapSplit)
        }
        static isBreakingSpace(t, e) {
            return Wt(t)
        }
        static canBreakWords(t, e) {
            return e
        }
        static canBreakChars(t, e, s, r, n) {
            return !0
        }
        static wordWrapSplit(t) {
            return j.graphemeSegmenter(t)
        }
        static measureFont(t) {
            if (j._fonts[t]) return j._fonts[t];
            const e = j._context;
            e.font = t;
            const s = e.measureText(j.METRICS_STRING + j.BASELINE_SYMBOL),
                r = s.actualBoundingBoxAscent ?? 0,
                n = s.actualBoundingBoxDescent ?? 0,
                o = {
                    ascent: r,
                    descent: n,
                    fontSize: r + n
                };
            return j._fonts[t] = o, o
        }
        static clearMetrics(t = "") {
            t ? delete j._fonts[t] : j._fonts = {}
        }
        static get _canvas() {
            if (!j.__canvas) {
                let t;
                try {
                    const e = new OffscreenCanvas(0, 0),
                        s = e.getContext("2d", Ja);
                    if (s != null && s.measureText) return j.__canvas = e, e;
                    t = X.get().createCanvas()
                } catch {
                    t = X.get().createCanvas()
                }
                t.width = t.height = 10, j.__canvas = t
            }
            return j.__canvas
        }
        static get _context() {
            return j.__context || (j.__context = j._canvas.getContext("2d", Ja)), j.__context
        }
    };
xe.METRICS_STRING = "|ÉqÅ";
xe.BASELINE_SYMBOL = "M";
xe.BASELINE_MULTIPLIER = 1.4;
xe.HEIGHT_MULTIPLIER = 2;
xe.graphemeSegmenter = (() => {
    if (typeof(Intl == null ? void 0 : Intl.Segmenter) == "function") {
        const i = new Intl.Segmenter;
        return t => {
            const e = i.segment(t),
                s = [];
            let r = 0;
            for (const n of e) s[r++] = n.segment;
            return s
        }
    }
    return i => [...i]
})();
xe.experimentalLetterSpacing = !1;
xe._fonts = {};
xe._measurementCache = pc(1e3);
let $t = xe;
const E_ = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui"];

function ei(i) {
    const t = typeof i.fontSize == "number" ? `${i.fontSize}px` : i.fontSize;
    let e = i.fontFamily;
    Array.isArray(i.fontFamily) || (e = i.fontFamily.split(","));
    for (let s = e.length - 1; s >= 0; s--) {
        let r = e[s].trim();
        !/([\"\'])[^\'\"]+\1/.test(r) && !E_.includes(r) && (r = `"${r}"`), e[s] = r
    }
    return `${i.fontStyle} ${i.fontVariant} ${i.fontWeight} ${t} ${e.join(",")}`
}
const th = 1e5;

function ls(i, t, e, s = 0, r = 0, n = 0) {
    if (i.texture === O.WHITE && !i.fill) return lt.shared.setValue(i.color).setAlpha(i.alpha ?? 1).toHexa();
    if (i.fill) {
        if (i.fill instanceof oi) {
            const o = i.fill,
                a = t.createPattern(o.texture.source.resource, "repeat"),
                h = o.transform.copyTo(N.shared);
            return h.scale(o.texture.source.pixelWidth, o.texture.source.pixelHeight), a.setTransform(h), a
        } else if (i.fill instanceof ne) {
            const o = i.fill,
                a = o.type === "linear",
                h = o.textureSpace === "local";
            let l = 1,
                c = 1;
            h && e && (l = e.width + s, c = e.height + s);
            let u, d = !1;
            if (a) {
                const {
                    start: f,
                    end: p
                } = o;
                u = t.createLinearGradient(f.x * l + r, f.y * c + n, p.x * l + r, p.y * c + n), d = Math.abs(p.x - f.x) < Math.abs((p.y - f.y) * .1)
            } else {
                const {
                    center: f,
                    innerRadius: p,
                    outerCenter: m,
                    outerRadius: g
                } = o;
                u = t.createRadialGradient(f.x * l + r, f.y * c + n, p * l, m.x * l + r, m.y * c + n, g * l)
            }
            if (d && h && e) {
                const f = e.lineHeight / c;
                for (let p = 0; p < e.lines.length; p++) {
                    const m = (p * e.lineHeight + s / 2) / c;
                    o.colorStops.forEach(g => {
                        let _ = m + g.offset * f;
                        _ = Math.max(0, Math.min(1, _)), u.addColorStop(Math.floor(_ * th) / th, lt.shared.setValue(g.color).toHex())
                    })
                }
            } else o.colorStops.forEach(f => {
                u.addColorStop(f.offset, lt.shared.setValue(f.color).toHex())
            });
            return u
        }
    } else {
        const o = t.createPattern(i.texture.source.resource, "repeat"),
            a = i.matrix.copyTo(N.shared);
        return a.scale(i.texture.source.pixelWidth, i.texture.source.pixelHeight), o.setTransform(a), o
    }
    return V("FillStyle not recognised", i), "red"
}
const eh = new nt;

function ss(i) {
    let t = 0;
    for (let e = 0; e < i.length; e++) i.charCodeAt(e) === 32 && t++;
    return t
}
class M_ {
    getCanvasAndContext(t) {
        const {
            text: e,
            style: s,
            resolution: r = 1
        } = t, n = s._getFinalPadding(), o = $t.measureText(e || " ", s), a = Math.ceil(Math.ceil(Math.max(1, o.width) + n * 2) * r), h = Math.ceil(Math.ceil(Math.max(1, o.height) + n * 2) * r), l = Xe.getOptimalCanvasAndContext(a, h);
        this._renderTextToCanvas(s, n, r, l, o);
        const c = s.trim ? h_({
            canvas: l.canvas,
            width: a,
            height: h,
            resolution: 1,
            output: eh
        }) : eh.set(0, 0, a, h);
        return {
            canvasAndContext: l,
            frame: c
        }
    }
    returnCanvasAndContext(t) {
        Xe.returnCanvasAndContext(t)
    }
    _renderTextToCanvas(t, e, s, r, n) {
        var v, T, M;
        if (n.runsByLine && n.runsByLine.length > 0) {
            this._renderTaggedTextToCanvas(n, t, e, s, r);
            return
        }
        const {
            canvas: o,
            context: a
        } = r, h = ei(t), l = n.lines, c = n.lineHeight, u = n.lineWidths, d = n.maxLineWidth, f = n.fontProperties, p = o.height;
        if (a.resetTransform(), a.scale(s, s), a.textBaseline = t.textBaseline, (v = t._stroke) != null && v.width) {
            const C = t._stroke;
            a.lineWidth = C.width, a.miterLimit = C.miterLimit, a.lineJoin = C.join, a.lineCap = C.cap
        }
        a.font = h;
        let m, g;
        const _ = t.dropShadow ? 2 : 1,
            x = t.wordWrap ? Math.max(t.wordWrapWidth, d) : d,
            y = (((T = t._stroke) == null ? void 0 : T.width) ?? 0) / 2;
        let S = (c - f.fontSize) / 2;
        c - f.fontSize < 0 && (S = 0);
        for (let C = 0; C < _; ++C) {
            const A = t.dropShadow && C === 0,
                P = A ? Math.ceil(Math.max(1, p) + e * 2) : 0,
                k = P * s;
            if (A) this._setupDropShadow(a, t, s, k);
            else {
                const G = t._gradientBounds,
                    F = t._gradientOffset;
                if (G) {
                    const ht = {
                        width: G.width,
                        height: G.height,
                        lineHeight: G.height,
                        lines: n.lines
                    };
                    this._setFillAndStrokeStyles(a, t, ht, e, y, (F == null ? void 0 : F.x) ?? 0, (F == null ? void 0 : F.y) ?? 0)
                } else F ? this._setFillAndStrokeStyles(a, t, n, e, y, F.x, F.y) : this._setFillAndStrokeStyles(a, t, n, e, y);
                a.shadowColor = "rgba(0,0,0,0)"
            }
            for (let G = 0; G < l.length; G++) {
                m = y, g = y + G * c + f.ascent + S, m += this._getAlignmentOffset(u[G], x, t.align);
                let F = 0;
                if (t.align === "justify" && t.wordWrap && G < l.length - 1) {
                    const ht = ss(l[G]);
                    ht > 0 && (F = (x - u[G]) / ht)
                }(M = t._stroke) != null && M.width && this._drawLetterSpacing(l[G], t, r, m + e, g + e - P, !0, F), t._fill !== void 0 && this._drawLetterSpacing(l[G], t, r, m + e, g + e - P, !1, F)
            }
        }
    }
    _renderTaggedTextToCanvas(t, e, s, r, n) {
        var y, S, v;
        const {
            canvas: o,
            context: a
        } = n, {
            runsByLine: h,
            lineWidths: l,
            maxLineWidth: c,
            lineAscents: u,
            lineHeights: d,
            hasDropShadow: f
        } = t, p = o.height;
        a.resetTransform(), a.scale(r, r), a.textBaseline = e.textBaseline;
        const m = f ? 2 : 1,
            g = e.wordWrap ? Math.max(e.wordWrapWidth, c) : c;
        let _ = ((y = e._stroke) == null ? void 0 : y.width) ?? 0;
        for (const T of h)
            for (const M of T) {
                const C = ((S = M.style._stroke) == null ? void 0 : S.width) ?? 0;
                C > _ && (_ = C)
            }
        const x = _ / 2,
            b = [];
        for (let T = 0; T < h.length; T++) {
            const M = h[T],
                C = [];
            for (const A of M) {
                const P = ei(A.style);
                a.font = P, C.push({
                    width: $t._measureText(A.text, A.style.letterSpacing, a),
                    font: P
                })
            }
            b.push(C)
        }
        for (let T = 0; T < m; ++T) {
            const M = f && T === 0,
                C = M ? Math.ceil(Math.max(1, p) + s * 2) : 0,
                A = C * r;
            M || (a.shadowColor = "rgba(0,0,0,0)");
            let P = x;
            for (let k = 0; k < h.length; k++) {
                const G = h[k],
                    F = l[k],
                    ht = u[k],
                    R = d[k],
                    I = b[k];
                let z = x;
                z += this._getAlignmentOffset(F, g, e.align);
                let B = 0;
                if (e.align === "justify" && e.wordWrap && k < h.length - 1) {
                    let K = 0;
                    for (const W of G) K += ss(W.text);
                    K > 0 && (B = (g - F) / K)
                }
                const L = P + ht;
                let q = z + s;
                for (let K = 0; K < G.length; K++) {
                    const W = G[K],
                        {
                            width: et,
                            font: rt
                        } = I[K];
                    if (a.font = rt, a.textBaseline = W.style.textBaseline, (v = W.style._stroke) != null && v.width) {
                        const ct = W.style._stroke;
                        if (a.lineWidth = ct.width, a.miterLimit = ct.miterLimit, a.lineJoin = ct.join, a.lineCap = ct.cap, M)
                            if (W.style.dropShadow) this._setupDropShadow(a, W.style, r, A);
                            else {
                                const vt = ss(W.text);
                                q += et + vt * B;
                                continue
                            }
                        else {
                            const vt = $t.measureFont(rt),
                                $ = W.style.lineHeight || vt.fontSize,
                                wt = {
                                    width: et,
                                    height: $,
                                    lineHeight: $,
                                    lines: [W.text]
                                };
                            a.strokeStyle = ls(ct, a, wt, s * 2, q - s, P)
                        }
                        this._drawLetterSpacing(W.text, W.style, n, q, L + s - C, !0, B)
                    }
                    const ut = ss(W.text);
                    q += et + ut * B
                }
                q = z + s;
                for (let K = 0; K < G.length; K++) {
                    const W = G[K],
                        {
                            width: et,
                            font: rt
                        } = I[K];
                    if (a.font = rt, a.textBaseline = W.style.textBaseline, W.style._fill !== void 0) {
                        if (M)
                            if (W.style.dropShadow) this._setupDropShadow(a, W.style, r, A);
                            else {
                                const ct = ss(W.text);
                                q += et + ct * B;
                                continue
                            }
                        else {
                            const ct = $t.measureFont(rt),
                                vt = W.style.lineHeight || ct.fontSize,
                                $ = {
                                    width: et,
                                    height: vt,
                                    lineHeight: vt,
                                    lines: [W.text]
                                };
                            a.fillStyle = ls(W.style._fill, a, $, s * 2, q - s, P)
                        }
                        this._drawLetterSpacing(W.text, W.style, n, q, L + s - C, !1, B)
                    }
                    const ut = ss(W.text);
                    q += et + ut * B
                }
                P += R
            }
        }
    }
    _setFillAndStrokeStyles(t, e, s, r, n, o = 0, a = 0) {
        var h;
        if (t.fillStyle = e._fill ? ls(e._fill, t, s, r * 2, o, a) : null, (h = e._stroke) != null && h.width) {
            const l = n + r * 2;
            t.strokeStyle = ls(e._stroke, t, s, l, o, a)
        }
    }
    _setupDropShadow(t, e, s, r) {
        t.fillStyle = "black", t.strokeStyle = "black";
        const n = e.dropShadow,
            o = n.color,
            a = n.alpha;
        t.shadowColor = lt.shared.setValue(o).setAlpha(a).toRgbaString();
        const h = n.blur * s,
            l = n.distance * s;
        t.shadowBlur = h, t.shadowOffsetX = Math.cos(n.angle) * l, t.shadowOffsetY = Math.sin(n.angle) * l + r
    }
    _getAlignmentOffset(t, e, s) {
        return s === "right" ? e - t : s === "center" ? (e - t) / 2 : 0
    }
    _drawLetterSpacing(t, e, s, r, n, o = !1, a = 0) {
        const {
            context: h
        } = s, l = e.letterSpacing;
        let c = !1;
        if ($t.experimentalLetterSpacingSupported && ($t.experimentalLetterSpacing ? (h.letterSpacing = `${l}px`, h.textLetterSpacing = `${l}px`, c = !0) : (h.letterSpacing = "0px", h.textLetterSpacing = "0px")), (l === 0 || c) && a === 0) {
            o ? h.strokeText(t, r, n) : h.fillText(t, r, n);
            return
        }
        if (a !== 0 && (l === 0 || c)) {
            const m = t.split(" ");
            let g = r;
            const _ = h.measureText(" ").width;
            for (let x = 0; x < m.length; x++) o ? h.strokeText(m[x], g, n) : h.fillText(m[x], g, n), g += h.measureText(m[x]).width + _ + a;
            return
        }
        let u = r;
        const d = $t.graphemeSegmenter(t);
        let f = h.measureText(t).width,
            p = 0;
        for (let m = 0; m < d.length; ++m) {
            const g = d[m];
            o ? h.strokeText(g, u, n) : h.fillText(g, u, n);
            let _ = "";
            for (let x = m + 1; x < d.length; ++x) _ += d[x];
            p = h.measureText(_).width, u += f - p + l, g === " " && (u += a), f = p
        }
    }
}
const cs = new M_,
    Vn = class De extends Xt {
        constructor(t = {}) {
            super(), this.uid = pt("textStyle"), this._tick = 0, this._cachedFontString = null, k_(t), t instanceof De && (t = t._toObject());
            const r = {
                ...De.defaultTextStyle,
                ...t
            };
            for (const n in r) {
                const o = n;
                this[o] = r[n]
            }
            this._tagStyles = t.tagStyles ?? void 0, this.update(), this._tick = 0
        }
        get align() {
            return this._align
        }
        set align(t) {
            this._align !== t && (this._align = t, this.update())
        }
        get breakWords() {
            return this._breakWords
        }
        set breakWords(t) {
            this._breakWords !== t && (this._breakWords = t, this.update())
        }
        get dropShadow() {
            return this._dropShadow
        }
        set dropShadow(t) {
            this._dropShadow !== t && (t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({
                ...De.defaultDropShadow,
                ...t
            }) : this._dropShadow = t ? this._createProxy({
                ...De.defaultDropShadow
            }) : null, this.update())
        }
        get fontFamily() {
            return this._fontFamily
        }
        set fontFamily(t) {
            this._fontFamily !== t && (this._fontFamily = t, this.update())
        }
        get fontSize() {
            return this._fontSize
        }
        set fontSize(t) {
            this._fontSize !== t && (typeof t == "string" ? this._fontSize = parseInt(t, 10) : this._fontSize = t, this.update())
        }
        get fontStyle() {
            return this._fontStyle
        }
        set fontStyle(t) {
            this._fontStyle !== t && (this._fontStyle = t.toLowerCase(), this.update())
        }
        get fontVariant() {
            return this._fontVariant
        }
        set fontVariant(t) {
            this._fontVariant !== t && (this._fontVariant = t, this.update())
        }
        get fontWeight() {
            return this._fontWeight
        }
        set fontWeight(t) {
            this._fontWeight !== t && (this._fontWeight = t, this.update())
        }
        get leading() {
            return this._leading
        }
        set leading(t) {
            this._leading !== t && (this._leading = t, this.update())
        }
        get letterSpacing() {
            return this._letterSpacing
        }
        set letterSpacing(t) {
            this._letterSpacing !== t && (this._letterSpacing = t, this.update())
        }
        get lineHeight() {
            return this._lineHeight
        }
        set lineHeight(t) {
            this._lineHeight !== t && (this._lineHeight = t, this.update())
        }
        get padding() {
            return this._padding
        }
        set padding(t) {
            this._padding !== t && (this._padding = t, this.update())
        }
        get filters() {
            return this._filters
        }
        set filters(t) {
            this._filters !== t && (this._filters = Object.freeze(t), this.update())
        }
        get trim() {
            return this._trim
        }
        set trim(t) {
            this._trim !== t && (this._trim = t, this.update())
        }
        get textBaseline() {
            return this._textBaseline
        }
        set textBaseline(t) {
            this._textBaseline !== t && (this._textBaseline = t, this.update())
        }
        get whiteSpace() {
            return this._whiteSpace
        }
        set whiteSpace(t) {
            this._whiteSpace !== t && (this._whiteSpace = t, this.update())
        }
        get wordWrap() {
            return this._wordWrap
        }
        set wordWrap(t) {
            this._wordWrap !== t && (this._wordWrap = t, this.update())
        }
        get wordWrapWidth() {
            return this._wordWrapWidth
        }
        set wordWrapWidth(t) {
            this._wordWrapWidth !== t && (this._wordWrapWidth = t, this.update())
        }
        get fill() {
            return this._originalFill
        }
        set fill(t) {
            t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({
                ...jt.defaultFillStyle,
                ...t
            }, () => {
                this._fill = Ne({
                    ...this._originalFill
                }, jt.defaultFillStyle)
            })), this._fill = Ne(t === 0 ? "black" : t, jt.defaultFillStyle), this.update())
        }
        get stroke() {
            return this._originalStroke
        }
        set stroke(t) {
            t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({
                ...jt.defaultStrokeStyle,
                ...t
            }, () => {
                this._stroke = Hi({
                    ...this._originalStroke
                }, jt.defaultStrokeStyle)
            })), this._stroke = Hi(t, jt.defaultStrokeStyle), this.update())
        }
        get tagStyles() {
            return this._tagStyles
        }
        set tagStyles(t) {
            this._tagStyles !== t && (this._tagStyles = t ?? void 0, this.update())
        }
        update() {
            this._tick++, this._cachedFontString = null, this.emit("update", this)
        }
        reset() {
            const t = De.defaultTextStyle;
            for (const e in t) this[e] = t[e]
        }
        assign(t) {
            for (const e in t) {
                const s = e;
                this[s] = t[e]
            }
            return this
        }
        get styleKey() {
            return `${this.uid}-${this._tick}`
        }
        get _fontString() {
            return this._cachedFontString === null && (this._cachedFontString = ei(this)), this._cachedFontString
        }
        _toObject() {
            return {
                align: this.align,
                breakWords: this.breakWords,
                dropShadow: this._dropShadow ? {
                    ...this._dropShadow
                } : null,
                fill: this._fill ? {
                    ...this._fill
                } : void 0,
                fontFamily: this.fontFamily,
                fontSize: this.fontSize,
                fontStyle: this.fontStyle,
                fontVariant: this.fontVariant,
                fontWeight: this.fontWeight,
                leading: this.leading,
                letterSpacing: this.letterSpacing,
                lineHeight: this.lineHeight,
                padding: this.padding,
                stroke: this._stroke ? {
                    ...this._stroke
                } : void 0,
                textBaseline: this.textBaseline,
                trim: this.trim,
                whiteSpace: this.whiteSpace,
                wordWrap: this.wordWrap,
                wordWrapWidth: this.wordWrapWidth,
                filters: this._filters ? [...this._filters] : void 0,
                tagStyles: this._tagStyles ? {
                    ...this._tagStyles
                } : void 0
            }
        }
        clone() {
            return new De(this._toObject())
        }
        _getFinalPadding() {
            let t = 0;
            if (this._filters)
                for (let e = 0; e < this._filters.length; e++) t += this._filters[e].padding;
            return Math.max(this._padding, t)
        }
        destroy(t = !1) {
            var s, r, n, o;
            if (this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
                const a = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
                (s = this._fill) != null && s.texture && this._fill.texture.destroy(a), (r = this._originalFill) != null && r.texture && this._originalFill.texture.destroy(a), (n = this._stroke) != null && n.texture && this._stroke.texture.destroy(a), (o = this._originalStroke) != null && o.texture && this._originalStroke.texture.destroy(a)
            }
            this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null
        }
        _createProxy(t, e) {
            return new Proxy(t, {
                set: (s, r, n) => (s[r] === n || (s[r] = n, e == null || e(r, n), this.update()), !0)
            })
        }
        _isFillStyle(t) {
            return (t ?? null) !== null && !(lt.isColorLike(t) || t instanceof ne || t instanceof oi)
        }
    };
Vn.defaultDropShadow = {
    alpha: 1,
    angle: Math.PI / 6,
    blur: 0,
    color: "black",
    distance: 5
};
Vn.defaultTextStyle = {
    align: "left",
    breakWords: !1,
    dropShadow: null,
    fill: "black",
    fontFamily: "Arial",
    fontSize: 26,
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    leading: 0,
    letterSpacing: 0,
    lineHeight: 0,
    padding: 0,
    stroke: null,
    textBaseline: "alphabetic",
    trim: !1,
    whiteSpace: "pre",
    wordWrap: !1,
    wordWrapWidth: 100
};
let Ye = Vn;

function k_(i) {
    const t = i;
    if (typeof t.dropShadow == "boolean" && t.dropShadow) {
        const e = Ye.defaultDropShadow;
        i.dropShadow = {
            alpha: t.dropShadowAlpha ?? e.alpha,
            angle: t.dropShadowAngle ?? e.angle,
            blur: t.dropShadowBlur ?? e.blur,
            color: t.dropShadowColor ?? e.color,
            distance: t.dropShadowDistance ?? e.distance
        }
    }
    if (t.strokeThickness !== void 0) {
        U(at, "strokeThickness is now a part of stroke");
        const e = t.stroke;
        let s = {};
        if (lt.isColorLike(e)) s.color = e;
        else if (e instanceof ne || e instanceof oi) s.fill = e;
        else if (Object.hasOwnProperty.call(e, "color") || Object.hasOwnProperty.call(e, "fill")) s = e;
        else throw new Error("Invalid stroke value.");
        i.stroke = {
            ...s,
            width: t.strokeThickness
        }
    }
    if (Array.isArray(t.fillGradientStops)) {
        if (U(at, "gradient fill is now a fill pattern: `new FillGradient(...)`"), !Array.isArray(t.fill) || t.fill.length === 0) throw new Error("Invalid fill value. Expected an array of colors for gradient fill.");
        t.fill.length !== t.fillGradientStops.length && V("The number of fill colors must match the number of fill gradient stops.");
        const e = new ne({
                start: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 1
                },
                textureSpace: "local"
            }),
            s = t.fillGradientStops.slice(),
            r = t.fill.map(n => lt.shared.setValue(n).toNumber());
        s.forEach((n, o) => {
            e.addColorStop(n, r[o])
        }), i.fill = {
            fill: e
        }
    }
}

function R_(i, t) {
    const {
        texture: e,
        bounds: s
    } = i, r = t._style._getFinalPadding();
    Lh(s, t._anchor, e);
    const n = t._anchor._x * r * 2,
        o = t._anchor._y * r * 2;
    s.minX -= r - n, s.minY -= r - o, s.maxX -= r - n, s.maxY -= r - o
}
class Xn {
    constructor() {
        this.batcherName = "default", this.topology = "triangle-list", this.attributeSize = 4, this.indexSize = 6, this.packAsQuad = !0, this.roundPixels = 0, this._attributeStart = 0, this._batcher = null, this._batch = null
    }
    get blendMode() {
        return this.renderable.groupBlendMode
    }
    get color() {
        return this.renderable.groupColorAlpha
    }
    reset() {
        this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.bounds = null
    }
    destroy() {
        this.reset()
    }
}
class B_ extends Xn {}
class bc {
    constructor(t) {
        this._renderer = t, t.runners.resolutionChange.add(this), this._managedTexts = new oe({
            renderer: t,
            type: "renderable",
            onUnload: this.onTextUnload.bind(this),
            name: "canvasText"
        })
    }
    resolutionChange() {
        for (const t in this._managedTexts.items) {
            const e = this._managedTexts.items[t];
            e != null && e._autoResolution && e.onViewUpdate()
        }
    }
    validateRenderable(t) {
        const e = this._getGpuText(t),
            s = t.styleKey;
        return e.currentKey !== s ? !0 : t._didTextUpdate
    }
    addRenderable(t, e) {
        const s = this._getGpuText(t);
        if (t._didTextUpdate) {
            const r = t._autoResolution ? this._renderer.resolution : t.resolution;
            (s.currentKey !== t.styleKey || t._resolution !== r) && this._updateGpuText(t), t._didTextUpdate = !1, R_(s, t)
        }
        this._renderer.renderPipes.batch.addToBatch(s, e)
    }
    updateRenderable(t) {
        const e = this._getGpuText(t);
        e._batcher.updateElement(e)
    }
    _updateGpuText(t) {
        const e = this._getGpuText(t);
        e.texture && this._renderer.canvasText.decreaseReferenceCount(e.currentKey), t._resolution = t._autoResolution ? this._renderer.resolution : t.resolution, e.texture = this._renderer.canvasText.getManagedTexture(t), e.currentKey = t.styleKey
    }
    _getGpuText(t) {
        return t._gpuData[this._renderer.uid] || this.initGpuText(t)
    }
    initGpuText(t) {
        const e = new B_;
        return e.currentKey = "--", e.renderable = t, e.transform = t.groupTransform, e.bounds = {
            minX: 0,
            maxX: 1,
            minY: 0,
            maxY: 0
        }, e.roundPixels = this._renderer._roundPixels | t._roundPixels, t._gpuData[this._renderer.uid] = e, this._managedTexts.add(t), e
    }
    onTextUnload(t) {
        const e = t._gpuData[this._renderer.uid];
        if (!e) return;
        const {
            canvasText: s
        } = this._renderer;
        s.getReferenceCount(e.currentKey) > 0 ? s.decreaseReferenceCount(e.currentKey) : e.texture && s.returnTexture(e.texture)
    }
    destroy() {
        this._managedTexts.destroy(), this._renderer = null
    }
}
bc.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "text"
};
const I_ = new Ft;

function G_(i, t, e, s, r = !1) {
    const n = I_;
    n.minX = 0, n.minY = 0, n.maxX = i.width / s | 0, n.maxY = i.height / s | 0;
    const o = bt.getOptimalTexture(n.width, n.height, s, !1, r);
    return o.source.uploadMethodId = "image", o.source.resource = i, o.source.alphaMode = "premultiply-alpha-on-upload", o.frame.width = t / s, o.frame.height = e / s, o.source.emit("update", o.source), o.updateUvs(), o
}
class vc {
    constructor(t, e) {
        this._activeTextures = {}, this._renderer = t, this._retainCanvasContext = e
    }
    getTexture(t, e, s, r) {
        typeof t == "string" && (U("8.0.0", "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"), t = {
            text: t,
            style: s,
            resolution: e
        }), t.style instanceof Ye || (t.style = new Ye(t.style)), t.textureStyle instanceof me || (t.textureStyle = new me(t.textureStyle)), typeof t.text != "string" && (t.text = t.text.toString());
        const {
            text: n,
            style: o,
            textureStyle: a,
            autoGenerateMipmaps: h
        } = t, l = t.resolution ?? this._renderer.resolution, {
            frame: c,
            canvasAndContext: u
        } = cs.getCanvasAndContext({
            text: n,
            style: o,
            resolution: l
        }), d = G_(u.canvas, c.width, c.height, l, h);
        if (a && (d.source.style = a), o.trim && (c.pad(o.padding), d.frame.copyFrom(c), d.frame.scale(1 / l), d.updateUvs()), o.filters) {
            const f = this._applyFilters(d, o.filters);
            return this.returnTexture(d), cs.returnCanvasAndContext(u), f
        }
        return this._renderer.texture.initSource(d._source), this._retainCanvasContext || cs.returnCanvasAndContext(u), d
    }
    returnTexture(t) {
        const e = t.source,
            s = e.resource;
        if (this._retainCanvasContext && (s != null && s.getContext)) {
            const r = s.getContext("2d");
            r && cs.returnCanvasAndContext({
                canvas: s,
                context: r
            })
        }
        e.resource = null, e.uploadMethodId = "unknown", e.alphaMode = "no-premultiply-alpha", bt.returnTexture(t, !0)
    }
    renderTextToCanvas() {
        U("8.10.0", "CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")
    }
    getManagedTexture(t) {
        t._resolution = t._autoResolution ? this._renderer.resolution : t.resolution;
        const e = t.styleKey;
        if (this._activeTextures[e]) return this._increaseReferenceCount(e), this._activeTextures[e].texture;
        const s = this.getTexture({
            text: t.text,
            style: t.style,
            resolution: t._resolution,
            textureStyle: t.textureStyle,
            autoGenerateMipmaps: t.autoGenerateMipmaps
        });
        return this._activeTextures[e] = {
            texture: s,
            usageCount: 1
        }, s
    }
    decreaseReferenceCount(t) {
        const e = this._activeTextures[t];
        e && (e.usageCount--, e.usageCount === 0 && (this.returnTexture(e.texture), this._activeTextures[t] = null))
    }
    getReferenceCount(t) {
        var e;
        return ((e = this._activeTextures[t]) == null ? void 0 : e.usageCount) ?? 0
    }
    _increaseReferenceCount(t) {
        this._activeTextures[t].usageCount++
    }
    _applyFilters(t, e) {
        const s = this._renderer.renderTarget.renderTarget,
            r = this._renderer.filter.generateFilteredTexture({
                texture: t,
                filters: e
            });
        return this._renderer.renderTarget.bind(s, !1), r
    }
    destroy() {
        this._renderer = null;
        for (const t in this._activeTextures) this._activeTextures[t] && this.returnTexture(this._activeTextures[t].texture);
        this._activeTextures = null
    }
}
class wc extends vc {
    constructor(t) {
        super(t, !0)
    }
}
wc.extension = {
    type: [w.CanvasSystem],
    name: "canvasText"
};
class Tc extends vc {
    constructor(t) {
        super(t, !1)
    }
}
Tc.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem],
    name: "canvasText"
};
Y.add(wc);
Y.add(Tc);
Y.add(bc);
class Ot extends r_ {
    constructor(...t) {
        const e = n_(t, "Text");
        super(e, Ye), this.renderPipeId = "text", e.textureStyle && (this.textureStyle = e.textureStyle instanceof me ? e.textureStyle : new me(e.textureStyle)), this.autoGenerateMipmaps = e.autoGenerateMipmaps ?? At.defaultOptions.autoGenerateMipmaps
    }
    updateBounds() {
        const t = this._bounds,
            e = this._anchor;
        let s = 0,
            r = 0;
        if (this._style.trim) {
            const {
                frame: n,
                canvasAndContext: o
            } = cs.getCanvasAndContext({
                text: this.text,
                style: this._style,
                resolution: 1
            });
            cs.returnCanvasAndContext(o), s = n.width, r = n.height
        } else {
            const n = $t.measureText(this._text, this._style);
            s = n.width, r = n.height
        }
        t.minX = -e._x * s, t.maxX = t.minX + s, t.minY = -e._y * r, t.maxY = t.minY + r
    }
}
class Sc extends Xt {
    constructor() {
        super(...arguments), this.chars = Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = {
            fontSize: 0,
            ascent: 0,
            descent: 0
        }, this.baseLineOffset = 0, this.distanceField = {
            type: "none",
            range: 0
        }, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100
    }
    get font() {
        return U(at, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily
    }
    get pageTextures() {
        return U(at, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages
    }
    get size() {
        return U(at, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize
    }
    get distanceFieldRange() {
        return U(at, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range
    }
    get distanceFieldType() {
        return U(at, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type
    }
    destroy(t = !1) {
        var e;
        this.emit("destroy", this), this.removeAllListeners();
        for (const s in this.chars)(e = this.chars[s].texture) == null || e.destroy();
        this.chars = null, t && (this.pages.forEach(s => s.texture.destroy(!0)), this.pages = null)
    }
}
const Cc = class Ac extends Sc {
    constructor(t) {
        super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentMaxCharHeight = 0, this._currentPageIndex = -1, this._skipKerning = !1;
        const e = {
            ...Ac.defaultOptions,
            ...t
        };
        this._textureSize = e.textureSize, this._mipmap = e.mipmap;
        const s = e.style.clone();
        e.overrideFill && (s._fill.color = 16777215, s._fill.alpha = 1, s._fill.texture = O.WHITE, s._fill.fill = null), this.applyFillAsTint = e.overrideFill;
        const r = s.fontSize;
        s.fontSize = this.baseMeasurementFontSize;
        const n = ei(s);
        e.overrideSize ? (s._stroke && (s._stroke.width *= this.baseRenderedFontSize / r), s.dropShadow && (s.dropShadow.blur *= this.baseRenderedFontSize / r, s.dropShadow.distance *= this.baseRenderedFontSize / r)) : s.fontSize = this.baseRenderedFontSize = r, this._style = s, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, e.textureStyle && (this._textureStyle = e.textureStyle instanceof me ? e.textureStyle : new me(e.textureStyle)), this.fontMetrics = $t.measureFont(n), this.lineHeight = s.lineHeight || this.fontMetrics.fontSize || s.fontSize
    }
    ensureCharacters(t) {
        var _, x;
        const e = $t.graphemeSegmenter(t).filter(b => !this._currentChars.includes(b)).filter((b, y, S) => S.indexOf(b) === y);
        if (!e.length) return;
        this._currentChars = [...this._currentChars, ...e];
        let s;
        this._currentPageIndex === -1 ? s = this._nextPage() : s = this.pages[this._currentPageIndex];
        let {
            canvas: r,
            context: n
        } = s.canvasAndContext, o = s.texture.source;
        const a = this._style;
        let h = this._currentX,
            l = this._currentY,
            c = this._currentMaxCharHeight;
        const u = this.baseRenderedFontSize / this.baseMeasurementFontSize,
            d = (((_ = a.dropShadow) == null ? void 0 : _.distance) ?? 0) + (((x = a._stroke) == null ? void 0 : x.width) ?? 0),
            f = this._padding + d;
        let p = !1;
        const m = r.width / this.resolution,
            g = r.height / this.resolution;
        for (let b = 0; b < e.length; b++) {
            const y = e[b],
                S = $t.measureText(y, a, r, !1);
            S.lineHeight = S.height;
            const v = S.width * u,
                T = Math.ceil((a.fontStyle === "italic" ? 2 : 1) * v),
                M = S.height * u,
                C = T + f * 2,
                A = M + f * 2;
            if (p = !1, y !== `
` && y !== "\r" && y !== "	" && y !== " " && (p = !0, c = Math.ceil(Math.max(A, c))), h + C > m && (l += c, c = A, h = 0, l + c > g)) {
                o.update();
                const k = this._nextPage();
                r = k.canvasAndContext.canvas, n = k.canvasAndContext.context, o = k.texture.source, h = 0, l = 0, c = 0
            }
            const P = n.measureText(y).width / u;
            if (this.chars[y] = {
                    id: y.codePointAt(0),
                    xOffset: -(f / u),
                    yOffset: -(f / u),
                    xAdvance: P,
                    kerning: {}
                }, p) {
                this._drawGlyph(n, S, h + f, l + f, u, a);
                const k = o.width * u,
                    G = o.height * u,
                    F = new nt(h / k * o.width, l / G * o.height, C / k * o.width, A / G * o.height);
                this.chars[y].texture = new O({
                    source: o,
                    frame: F
                }), h += Math.ceil(C)
            }
        }
        o.update(), this._currentX = h, this._currentY = l, this._currentMaxCharHeight = c, this._skipKerning || this._applyKerning(e, n, u)
    }
    get pageTextures() {
        return U(at, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages
    }
    _applyKerning(t, e, s) {
        const r = this._measureCache;
        for (let n = 0; n < t.length; n++) {
            const o = t[n];
            for (let a = 0; a < this._currentChars.length; a++) {
                const h = this._currentChars[a];
                let l = r[o];
                l || (l = r[o] = e.measureText(o).width);
                let c = r[h];
                c || (c = r[h] = e.measureText(h).width);
                let u = e.measureText(o + h).width,
                    d = u - (l + c);
                d && this.chars[o] && (this.chars[o].kerning[h] = d / s), u = e.measureText(o + h).width, d = u - (l + c), d && this.chars[h] && (this.chars[h].kerning[o] = d / s)
            }
        }
    }
    _nextPage() {
        this._currentPageIndex++;
        const t = this.resolution,
            e = Xe.getOptimalCanvasAndContext(this._textureSize, this._textureSize, t);
        this._setupContext(e.context, this._style, t);
        const s = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize),
            r = new O({
                source: new He({
                    resource: e.canvas,
                    resolution: s,
                    alphaMode: "premultiply-alpha-on-upload",
                    autoGenerateMipmaps: this._mipmap
                })
            });
        this._textureStyle && (r.source.style = this._textureStyle);
        const n = {
            canvasAndContext: e,
            texture: r
        };
        return this.pages[this._currentPageIndex] = n, n
    }
    _setupContext(t, e, s) {
        e.fontSize = this.baseRenderedFontSize, t.scale(s, s), t.font = ei(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
        const r = e._stroke,
            n = (r == null ? void 0 : r.width) ?? 0;
        if (r && (t.lineWidth = n, t.lineJoin = r.join, t.miterLimit = r.miterLimit, t.strokeStyle = ls(r, t)), e._fill && (t.fillStyle = ls(e._fill, t)), e.dropShadow) {
            const o = e.dropShadow,
                a = lt.shared.setValue(o.color).toArray(),
                h = o.blur * s,
                l = o.distance * s;
            t.shadowColor = `rgba(${a[0]*255},${a[1]*255},${a[2]*255},${o.alpha})`, t.shadowBlur = h, t.shadowOffsetX = Math.cos(o.angle) * l, t.shadowOffsetY = Math.sin(o.angle) * l
        } else t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0
    }
    _drawGlyph(t, e, s, r, n, o) {
        const a = e.text,
            h = e.fontProperties,
            l = o._stroke,
            c = ((l == null ? void 0 : l.width) ?? 0) * n,
            u = s + c / 2,
            d = r - c / 2,
            f = h.descent * n,
            p = e.lineHeight * n;
        let m = !1;
        o.stroke && c && (m = !0, t.strokeText(a, u, d + p - f));
        const {
            shadowBlur: g,
            shadowOffsetX: _,
            shadowOffsetY: x
        } = t;
        o._fill && (m && (t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0), t.fillText(a, u, d + p - f)), m && (t.shadowBlur = g, t.shadowOffsetX = _, t.shadowOffsetY = x)
    }
    destroy() {
        super.destroy();
        for (let t = 0; t < this.pages.length; t++) {
            const {
                canvasAndContext: e,
                texture: s
            } = this.pages[t];
            Xe.returnCanvasAndContext(e), s.destroy(!0)
        }
        this.pages = null
    }
};
Cc.defaultOptions = {
    textureSize: 512,
    style: new Ye,
    mipmap: !0
};
let sh = Cc;

function F_(i, t, e, s) {
    var b, y;
    const r = {
        width: 0,
        height: 0,
        offsetY: 0,
        scale: t.fontSize / e.baseMeasurementFontSize,
        lines: [{
            width: 0,
            charPositions: [],
            spaceWidth: 0,
            spacesIndex: [],
            chars: []
        }]
    };
    r.offsetY = e.baseLineOffset;
    let n = r.lines[0],
        o = null,
        a = !0;
    const h = {
            width: 0,
            start: 0,
            index: 0,
            positions: [],
            chars: []
        },
        l = e.baseMeasurementFontSize / t.fontSize,
        c = t.letterSpacing * l,
        u = t.wordWrapWidth * l,
        d = t.lineHeight ? t.lineHeight * l : e.lineHeight,
        f = t.wordWrap && t.breakWords,
        p = Hn(t.whiteSpace),
        m = zn(t.whiteSpace);
    if (p || m) {
        const S = [];
        let v = p;
        for (let T = 0; T < i.length; T++) {
            let M = i[T];
            if (M === "\r" || M === `
`)
                if (m) M === "\r" && i[T + 1] === `
` && T++, M = " ";
                else {
                    p && (v = !0), S.push(M);
                    continue
                } if (Wt(M))
                if (p && Za(M)) {
                    if (v) continue;
                    v = !0, S.push(" ")
                } else v = !1, S.push(M);
            else v = !1, S.push(M)
        }
        i = S
    }
    const g = S => {
            const v = n.width;
            for (let T = 0; T < h.index; T++) {
                const M = S.positions[T];
                n.chars.push(S.chars[T]), n.charPositions.push(M + v)
            }
            n.width += S.width, (h.index > 0 || !p) && (a = !1), h.width = 0, h.index = 0, h.chars.length = 0
        },
        _ = () => {
            let S = n.chars.length - 1;
            if (s) {
                let v = n.chars[S];
                for (; Za(v);) n.width -= e.chars[v].xAdvance, n.spacesIndex.pop(), v = n.chars[--S]
            }
            r.width = Math.max(r.width, n.width), n = {
                width: 0,
                charPositions: [],
                chars: [],
                spaceWidth: 0,
                spacesIndex: []
            }, a = !0, r.lines.push(n), r.height += d
        },
        x = S => S - c > u;
    for (let S = 0; S < i.length + 1; S++) {
        let v;
        const T = S === i.length;
        T || (v = i[S]);
        const M = e.chars[v];
        if (/(?:\s)/.test(v) || v === "\r" || v === `
` || T) {
            if (!a && t.wordWrap && x(n.width + h.width) ? (_(), g(h), T || n.charPositions.push(0)) : (h.start = n.width, g(h), T || n.charPositions.push(0)), v === "\r" || v === `
`) _();
            else if (!T && M) {
                const k = M.xAdvance + (((b = M.kerning) == null ? void 0 : b[o]) || 0) + c;
                n.width += k, n.spaceWidth = k, n.spacesIndex.push(n.charPositions.length), n.chars.push(v)
            }
        } else if (M) {
            const P = ((y = M.kerning) == null ? void 0 : y[o]) || 0,
                k = M.xAdvance + P + c;
            f && x(h.width + k) && (a || _(), g(h), _()), h.positions[h.index++] = h.width + P, h.chars.push(v), h.width += k, _c(v) && (!a && t.wordWrap && x(n.width + h.width) && _(), g(h))
        }
        o = v
    }
    return _(), t.wordWrap && t.align !== "left" && (r.width = Math.max(r.width, u)), t.align === "center" ? O_(r) : t.align === "right" ? L_(r) : t.align === "justify" && D_(r), r
}

function O_(i) {
    for (let t = 0; t < i.lines.length; t++) {
        const e = i.lines[t],
            s = i.width / 2 - e.width / 2;
        for (let r = 0; r < e.charPositions.length; r++) e.charPositions[r] += s
    }
}

function L_(i) {
    for (let t = 0; t < i.lines.length; t++) {
        const e = i.lines[t],
            s = i.width - e.width;
        for (let r = 0; r < e.charPositions.length; r++) e.charPositions[r] += s
    }
}

function D_(i) {
    const t = i.width;
    for (let e = 0; e < i.lines.length - 2; e++) {
        const s = i.lines[e];
        let r = 0,
            n = s.spacesIndex[r++],
            o = 0;
        const a = s.spacesIndex.length,
            l = (t - s.width) / a;
        for (let c = 0; c < s.charPositions.length; c++) c === n && (n = s.spacesIndex[r++], o += l), s.charPositions[c] += o
    }
}

function U_(i) {
    if (i === "") return [];
    typeof i == "string" && (i = [i]);
    const t = [];
    for (let e = 0, s = i.length; e < s; e++) {
        const r = i[e];
        if (Array.isArray(r)) {
            if (r.length !== 2) throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${r.length}.`);
            if (r[0].length === 0 || r[1].length === 0) throw new Error("[BitmapFont]: Invalid character delimiter.");
            const n = r[0].charCodeAt(0),
                o = r[1].charCodeAt(0);
            if (o < n) throw new Error("[BitmapFont]: Invalid character range.");
            for (let a = n, h = o; a <= h; a++) t.push(String.fromCharCode(a))
        } else t.push(...Array.from(r))
    }
    if (t.length === 0) throw new Error("[BitmapFont]: Empty set when resolving characters.");
    return t
}
let Ti = 0;
class N_ {
    constructor() {
        this.ALPHA = [
            ["a", "z"],
            ["A", "Z"], " "
        ], this.NUMERIC = [
            ["0", "9"]
        ], this.ALPHANUMERIC = [
            ["a", "z"],
            ["A", "Z"],
            ["0", "9"], " "
        ], this.ASCII = [
            [" ", "~"]
        ], this.defaultOptions = {
            chars: this.ALPHANUMERIC,
            resolution: 1,
            padding: 4,
            skipKerning: !1,
            textureStyle: null
        }, this.measureCache = pc(1e3)
    }
    getFont(t, e) {
        var o, a;
        let s = `${e.fontFamily}-bitmap`,
            r = !0;
        if (ft.has(s)) {
            const h = ft.get(s);
            return (o = h.ensureCharacters) == null || o.call(h, t), h
        }
        if (e._fill.fill && !e._stroke ? (s += e._fill.fill.styleKey, r = !1) : (e._stroke || e.dropShadow) && (s = `${e.styleKey}-bitmap`, r = !1), s += `-${e.fontStyle}`, s += `-${e.fontVariant}`, s += `-${e.fontWeight}`, !ft.has(s)) {
            const h = Object.create(e);
            h._lineHeight = 0;
            const l = new sh({
                style: h,
                overrideFill: r,
                overrideSize: !0,
                ...this.defaultOptions
            });
            Ti++, Ti > 50 && V("BitmapText", `You have dynamically created ${Ti} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), l.once("destroy", () => {
                Ti--, ft.remove(s)
            }), ft.set(s, l)
        }
        const n = ft.get(s);
        return (a = n.ensureCharacters) == null || a.call(n, t), n
    }
    getLayout(t, e, s = !0) {
        const r = this.getFont(t, e),
            n = `${t}-${e.styleKey}-${s}`;
        if (this.measureCache.has(n)) return this.measureCache.get(n);
        const o = $t.graphemeSegmenter(t),
            a = F_(o, e, r, s);
        return this.measureCache.set(n, a), a
    }
    measureText(t, e, s = !0) {
        return this.getLayout(t, e, s)
    }
    install(...t) {
        var l, c, u, d;
        let e = t[0];
        typeof e == "string" && (e = {
            name: e,
            style: t[1],
            chars: (l = t[2]) == null ? void 0 : l.chars,
            resolution: (c = t[2]) == null ? void 0 : c.resolution,
            padding: (u = t[2]) == null ? void 0 : u.padding,
            skipKerning: (d = t[2]) == null ? void 0 : d.skipKerning
        }, U(at, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
        const s = e == null ? void 0 : e.name;
        if (!s) throw new Error("[BitmapFontManager] Property `name` is required.");
        e = {
            ...this.defaultOptions,
            ...e
        };
        const r = e.style,
            n = r instanceof Ye ? r : new Ye(r),
            o = e.dynamicFill ?? this._canUseTintForStyle(n),
            a = new sh({
                style: n,
                overrideFill: o,
                skipKerning: e.skipKerning,
                padding: e.padding,
                resolution: e.resolution,
                overrideSize: !1,
                textureStyle: e.textureStyle
            }),
            h = U_(e.chars);
        return a.ensureCharacters(h.join("")), ft.set(`${s}-bitmap`, a), a.once("destroy", () => ft.remove(`${s}-bitmap`)), a
    }
    uninstall(t) {
        const e = `${t}-bitmap`,
            s = ft.get(e);
        s && s.destroy()
    }
    _canUseTintForStyle(t) {
        return !t._stroke && (!t.dropShadow || t.dropShadow.color === 0) && !t._fill.fill && t._fill.color === 16777215
    }
}
const ih = new N_;

function W_() {
    const {
        userAgent: i
    } = X.get().getNavigator();
    return /^((?!chrome|android).)*safari/i.test(i)
}
const Yn = class Ue {
    static _getPatternRepeat(t, e) {
        const s = t && t !== "clamp-to-edge",
            r = e && e !== "clamp-to-edge";
        return s && r ? "repeat" : s ? "repeat-x" : r ? "repeat-y" : "no-repeat"
    }
    start(t, e, s) {}
    execute(t, e) {
        var a, h, l, c;
        const s = e.elements;
        if (!s || !s.length) return;
        const r = t.renderer,
            n = r.canvasContext,
            o = n.activeContext;
        for (let u = 0; u < s.length; u++) {
            const d = s[u];
            if (!d.packAsQuad) continue;
            const f = d,
                p = f.texture,
                m = p ? it.getCanvasSource(p) : null;
            if (!m) continue;
            const g = p.source.style,
                _ = n.smoothProperty,
                x = g.scaleMode !== "nearest";
            o[_] !== x && (o[_] = x), n.setBlendMode(e.blendMode);
            const b = ((a = r.globalUniforms.globalUniformData) == null ? void 0 : a.worldColor) ?? 4294967295,
                y = f.color,
                S = (b >>> 24 & 255) / 255,
                v = (y >>> 24 & 255) / 255,
                T = ((h = r.filter) == null ? void 0 : h.alphaMultiplier) ?? 1,
                M = S * v * T;
            if (M <= 0) continue;
            o.globalAlpha = M;
            const C = b & 16777215,
                A = y & 16777215,
                P = fs(ds(A, C)),
                k = p.frame,
                G = g.addressModeU ?? g.addressMode,
                F = g.addressModeV ?? g.addressMode,
                ht = Ue._getPatternRepeat(G, F),
                R = p.source._resolution ?? p.source.resolution ?? 1,
                I = (c = (l = f.renderable) == null ? void 0 : l.renderGroup) == null ? void 0 : c.isCachedAsTexture,
                z = k.x * R,
                B = k.y * R,
                L = k.width * R,
                q = k.height * R,
                K = f.bounds,
                W = r.renderTarget.renderTarget.isRoot,
                et = K.minX,
                rt = K.minY,
                ut = K.maxX - K.minX,
                ct = K.maxY - K.minY,
                vt = p.rotate,
                $ = p.uvs,
                wt = Math.min($.x0, $.x1, $.x2, $.x3, $.y0, $.y1, $.y2, $.y3),
                xt = Math.max($.x0, $.x1, $.x2, $.x3, $.y0, $.y1, $.y2, $.y3),
                Tt = ht !== "no-repeat" && (wt < 0 || xt > 1),
                Kt = vt && !(!Tt && (P !== 16777215 || vt));
            Kt ? (Ue._tempPatternMatrix.copyFrom(f.transform), tt.matrixAppendRotationInv(Ue._tempPatternMatrix, vt, et, rt, ut, ct), n.setContextTransform(Ue._tempPatternMatrix, f.roundPixels === 1, void 0, I && W)) : n.setContextTransform(f.transform, f.roundPixels === 1, void 0, I && W);
            const Yt = Kt ? 0 : et,
                je = Kt ? 0 : rt,
                qe = ut,
                Ss = ct;
            if (Tt) {
                let hi = m;
                const Ke = P !== 16777215 && !vt,
                    Ze = k.width <= p.source.width && k.height <= p.source.height;
                Ke && Ze && (hi = it.getTintedCanvas({
                    texture: p
                }, P));
                const $i = o.createPattern(hi, ht);
                if (!$i) continue;
                const _o = qe,
                    xo = Ss;
                if (_o === 0 || xo === 0) continue;
                const yo = 1 / _o,
                    bo = 1 / xo,
                    vo = ($.x1 - $.x0) * yo,
                    wo = ($.y1 - $.y0) * yo,
                    To = ($.x3 - $.x0) * bo,
                    So = ($.y3 - $.y0) * bo,
                    td = $.x0 - vo * Yt - To * je,
                    ed = $.y0 - wo * Yt - So * je,
                    ji = p.source.pixelWidth,
                    qi = p.source.pixelHeight;
                Ue._tempPatternMatrix.set(vo * ji, wo * qi, To * ji, So * qi, td * ji, ed * qi), it.applyPatternTransform($i, Ue._tempPatternMatrix), o.fillStyle = $i, o.fillRect(Yt, je, qe, Ss)
            } else {
                const Ke = P !== 16777215 || vt ? it.getTintedCanvas({
                        texture: p
                    }, P) : m,
                    Ze = Ke !== m;
                o.drawImage(Ke, Ze ? 0 : z, Ze ? 0 : B, Ze ? Ke.width : L, Ze ? Ke.height : q, Yt, je, qe, Ss)
            }
        }
    }
};
Yn._tempPatternMatrix = new N;
Yn.extension = {
    type: [w.CanvasPipesAdaptor],
    name: "batch"
};
let H_ = Yn;
class Pc {
    constructor() {
        this._tempState = _e.for2d(), this._didUploadHash = {}
    }
    init(t) {
        t.renderer.runners.contextChange.add(this)
    }
    contextChange() {
        this._didUploadHash = {}
    }
    start(t, e, s) {
        const r = t.renderer,
            n = this._didUploadHash[s.uid];
        r.shader.bind(s, n), n || (this._didUploadHash[s.uid] = !0), r.shader.updateUniformGroup(r.globalUniforms.uniformGroup), r.geometry.bind(e, s.glProgram)
    }
    execute(t, e) {
        const s = t.renderer;
        this._tempState.blendMode = e.blendMode, s.state.set(this._tempState);
        const r = e.textures.textures;
        for (let n = 0; n < e.textures.count; n++) s.texture.bind(r[n], n);
        s.geometry.draw(e.topology, e.size, e.start)
    }
}
Pc.extension = {
    type: [w.WebGLPipesAdaptor],
    name: "batch"
};
const Si = _e.for2d();
class Ec {
    start(t, e, s) {
        const r = t.renderer,
            n = r.encoder,
            o = s.gpuProgram;
        this._shader = s, this._geometry = e, n.setGeometry(e, o), Si.blendMode = "normal", r.pipeline.getPipeline(e, o, Si);
        const a = r.globalUniforms.bindGroup;
        n.resetBindGroup(1), n.setBindGroup(0, a, o)
    }
    execute(t, e) {
        const s = this._shader.gpuProgram,
            r = t.renderer,
            n = r.encoder;
        if (!e.bindGroup) {
            const h = e.textures;
            e.bindGroup = An(h.textures, h.count, r.limits.maxBatchableTextures)
        }
        Si.blendMode = e.blendMode;
        const o = r.bindGroup.getBindGroup(e.bindGroup, s, 1),
            a = r.pipeline.getPipeline(this._geometry, s, Si, e.topology);
        e.bindGroup._touch(r.gc.now, r.tick), n.setPipeline(a), n.renderPassEncoder.setBindGroup(1, o), n.renderPassEncoder.drawIndexed(e.size, 1, e.start)
    }
}
Ec.extension = {
    type: [w.WebGPUPipesAdaptor],
    name: "batch"
};
const $n = class Mc {
    constructor(t, e) {
        var s, r;
        this.state = _e.for2d(), this._batchersByInstructionSet = Object.create(null), this._activeBatches = Object.create(null), this.renderer = t, this._adaptor = e, (r = (s = this._adaptor).init) == null || r.call(s, this)
    }
    static getBatcher(t) {
        return new this._availableBatchers[t]
    }
    buildStart(t) {
        let e = this._batchersByInstructionSet[t.uid];
        e || (e = this._batchersByInstructionSet[t.uid] = Object.create(null), e.default || (e.default = new Bn({
            maxTextures: this.renderer.limits.maxBatchableTextures
        }))), this._activeBatches = e, this._activeBatch = this._activeBatches.default;
        for (const s in this._activeBatches) this._activeBatches[s].begin()
    }
    addToBatch(t, e) {
        if (this._activeBatch.name !== t.batcherName) {
            this._activeBatch.break(e);
            let s = this._activeBatches[t.batcherName];
            s || (s = this._activeBatches[t.batcherName] = Mc.getBatcher(t.batcherName), s.begin()), this._activeBatch = s
        }
        this._activeBatch.add(t)
    }
    break (t) {
        this._activeBatch.break(t)
    }
    buildEnd(t) {
        this._activeBatch.break(t);
        const e = this._activeBatches;
        for (const s in e) {
            const r = e[s],
                n = r.geometry;
            n.indexBuffer.setDataWithSize(r.indexBuffer, r.indexSize, !0), n.buffers[0].setDataWithSize(r.attributeBuffer.float32View, r.attributeSize, !1)
        }
    }
    upload(t) {
        const e = this._batchersByInstructionSet[t.uid];
        for (const s in e) {
            const r = e[s],
                n = r.geometry;
            r.dirty && (r.dirty = !1, n.buffers[0].update(r.attributeSize * 4))
        }
    }
    execute(t) {
        if (t.action === "startBatch") {
            const e = t.batcher,
                s = e.geometry,
                r = e.shader;
            this._adaptor.start(this, s, r)
        }
        this._adaptor.execute(this, t)
    }
    destroy() {
        this.state = null, this.renderer = null, this._adaptor = null;
        for (const t in this._activeBatches) this._activeBatches[t].destroy();
        this._activeBatches = null
    }
};
$n.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "batch"
};
$n._availableBatchers = Object.create(null);
let jn = $n;
Y.handleByMap(w.Batcher, jn._availableBatchers);
Y.add(Bn);
const z_ = {
        name: "texture-bit",
        vertex: {
            header: `

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,
            main: `
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `
        },
        fragment: {
            header: `
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;


        `,
            main: `
            outColor = textureSample(uTexture, uSampler, vUV);
        `
        }
    },
    V_ = {
        name: "texture-bit",
        vertex: {
            header: `
            uniform mat3 uTextureMatrix;
        `,
            main: `
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `
        },
        fragment: {
            header: `
        uniform sampler2D uTexture;


        `,
            main: `
            outColor = texture(uTexture, vUV);
        `
        }
    },
    X_ = new Ft;
class Y_ extends Oi {
    constructor() {
        super(), this.filters = [new Qg({
            sprite: new Q(O.EMPTY),
            inverse: !1,
            resolution: "inherit",
            antialias: "inherit"
        })]
    }
    get sprite() {
        return this.filters[0].sprite
    }
    set sprite(t) {
        this.filters[0].sprite = t
    }
    get inverse() {
        return this.filters[0].inverse
    }
    set inverse(t) {
        this.filters[0].inverse = t
    }
}
class qn {
    constructor(t) {
        this._activeMaskStage = [], this._renderer = t
    }
    push(t, e, s) {
        const r = this._renderer;
        if (r.renderPipes.batch.break(s), s.add({
                renderPipeId: "alphaMask",
                action: "pushMaskBegin",
                mask: t,
                inverse: e._maskOptions.inverse,
                canBundle: !1,
                maskedContainer: e
            }), t.inverse = e._maskOptions.inverse, t.renderMaskToTexture) {
            const n = t.mask;
            n.includeInBuild = !0, n.collectRenderables(s, r, null), n.includeInBuild = !1
        }
        r.renderPipes.batch.break(s), s.add({
            renderPipeId: "alphaMask",
            action: "pushMaskEnd",
            mask: t,
            maskedContainer: e,
            inverse: e._maskOptions.inverse,
            canBundle: !1
        })
    }
    pop(t, e, s) {
        this._renderer.renderPipes.batch.break(s), s.add({
            renderPipeId: "alphaMask",
            action: "popMaskEnd",
            mask: t,
            inverse: e._maskOptions.inverse,
            canBundle: !1
        })
    }
    execute(t) {
        const e = this._renderer,
            s = t.mask.renderMaskToTexture;
        if (t.action === "pushMaskBegin") {
            const r = Et.get(Y_);
            if (r.inverse = t.inverse, s) {
                t.mask.mask.measurable = !0;
                const n = gn(t.mask.mask, !0, X_);
                t.mask.mask.measurable = !1, n.ceil();
                const o = e.renderTarget.renderTarget.colorTexture.source,
                    a = bt.getOptimalTexture(n.width, n.height, o._resolution, o.antialias);
                e.renderTarget.push(a, !0), e.globalUniforms.push({
                    offset: n,
                    worldColor: 4294967295
                });
                const h = r.sprite;
                h.texture = a, h.worldTransform.tx = n.minX, h.worldTransform.ty = n.minY, this._activeMaskStage.push({
                    filterEffect: r,
                    maskedContainer: t.maskedContainer,
                    filterTexture: a
                })
            } else r.sprite = t.mask.mask, this._activeMaskStage.push({
                filterEffect: r,
                maskedContainer: t.maskedContainer
            })
        } else if (t.action === "pushMaskEnd") {
            const r = this._activeMaskStage[this._activeMaskStage.length - 1];
            s && (e.type === Vt.WEBGL && e.renderTarget.finishRenderPass(), e.renderTarget.pop(), e.globalUniforms.pop()), e.filter.push({
                renderPipeId: "filter",
                action: "pushFilter",
                container: r.maskedContainer,
                filterEffect: r.filterEffect,
                canBundle: !1
            })
        } else if (t.action === "popMaskEnd") {
            e.filter.pop();
            const r = this._activeMaskStage.pop();
            s && bt.returnTexture(r.filterTexture), Et.return(r.filterEffect)
        }
    }
    destroy() {
        this._renderer = null, this._activeMaskStage = null
    }
}
qn.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "alphaMask"
};
class kc {
    constructor(t) {
        this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = t
    }
    buildStart() {
        this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15
    }
    push(t, e, s) {
        this._renderer.renderPipes.batch.break(s);
        const r = this._colorStack;
        r[this._colorStackIndex] = r[this._colorStackIndex - 1] & t.mask;
        const n = this._colorStack[this._colorStackIndex];
        n !== this._currentColor && (this._currentColor = n, s.add({
            renderPipeId: "colorMask",
            colorMask: n,
            canBundle: !1
        })), this._colorStackIndex++
    }
    pop(t, e, s) {
        this._renderer.renderPipes.batch.break(s);
        const r = this._colorStack;
        this._colorStackIndex--;
        const n = r[this._colorStackIndex - 1];
        n !== this._currentColor && (this._currentColor = n, s.add({
            renderPipeId: "colorMask",
            colorMask: n,
            canBundle: !1
        }))
    }
    execute(t) {}
    destroy() {
        this._renderer = null, this._colorStack = null
    }
}
kc.extension = {
    type: [w.CanvasPipes],
    name: "colorMask"
};
class Rc {
    constructor(t) {
        this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = t
    }
    buildStart() {
        this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15
    }
    push(t, e, s) {
        this._renderer.renderPipes.batch.break(s);
        const n = this._colorStack;
        n[this._colorStackIndex] = n[this._colorStackIndex - 1] & t.mask;
        const o = this._colorStack[this._colorStackIndex];
        o !== this._currentColor && (this._currentColor = o, s.add({
            renderPipeId: "colorMask",
            colorMask: o,
            canBundle: !1
        })), this._colorStackIndex++
    }
    pop(t, e, s) {
        this._renderer.renderPipes.batch.break(s);
        const n = this._colorStack;
        this._colorStackIndex--;
        const o = n[this._colorStackIndex - 1];
        o !== this._currentColor && (this._currentColor = o, s.add({
            renderPipeId: "colorMask",
            colorMask: o,
            canBundle: !1
        }))
    }
    execute(t) {
        this._renderer.colorMask.setMask(t.colorMask)
    }
    destroy() {
        this._renderer = null, this._colorStack = null
    }
}
Rc.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes],
    name: "colorMask"
};

function $_(i, t, e, s, r, n) {
    n = Math.max(0, Math.min(n, Math.min(s, r) / 2)), i.moveTo(t + n, e), i.lineTo(t + s - n, e), i.quadraticCurveTo(t + s, e, t + s, e + n), i.lineTo(t + s, e + r - n), i.quadraticCurveTo(t + s, e + r, t + s - n, e + r), i.lineTo(t + n, e + r), i.quadraticCurveTo(t, e + r, t, e + r - n), i.lineTo(t, e + n), i.quadraticCurveTo(t, e, t + n, e)
}

function Bc(i, t) {
    switch (t.type) {
        case "rectangle": {
            const e = t;
            i.rect(e.x, e.y, e.width, e.height);
            break
        }
        case "roundedRectangle": {
            const e = t;
            $_(i, e.x, e.y, e.width, e.height, e.radius);
            break
        }
        case "circle": {
            const e = t;
            i.moveTo(e.x + e.radius, e.y), i.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            break
        }
        case "ellipse": {
            const e = t;
            i.ellipse ? (i.moveTo(e.x + e.halfWidth, e.y), i.ellipse(e.x, e.y, e.halfWidth, e.halfHeight, 0, 0, Math.PI * 2)) : (i.save(), i.translate(e.x, e.y), i.scale(e.halfWidth, e.halfHeight), i.moveTo(1, 0), i.arc(0, 0, 1, 0, Math.PI * 2), i.restore());
            break
        }
        case "triangle": {
            const e = t;
            i.moveTo(e.x, e.y), i.lineTo(e.x2, e.y2), i.lineTo(e.x3, e.y3), i.closePath();
            break
        }
        case "polygon":
        default: {
            const e = t,
                s = e.points;
            if (!(s != null && s.length)) break;
            i.moveTo(s[0], s[1]);
            for (let r = 2; r < s.length; r += 2) i.lineTo(s[r], s[r + 1]);
            e.closePath && i.closePath();
            break
        }
    }
}

function j_(i, t) {
    if (!(t != null && t.length)) return !1;
    for (let e = 0; e < t.length; e++) {
        const s = t[e];
        if (!(s != null && s.shape)) continue;
        const r = s.transform,
            n = r && !r.isIdentity();
        n && (i.save(), i.transform(r.a, r.b, r.c, r.d, r.tx, r.ty)), Bc(i, s.shape), n && i.restore()
    }
    return !0
}
class Ic {
    constructor(t) {
        this._warnedMaskTypes = new Set, this._canvasMaskStack = [], this._renderer = t
    }
    push(t, e, s) {
        this._renderer.renderPipes.batch.break(s), s.add({
            renderPipeId: "stencilMask",
            action: "pushMaskBegin",
            mask: t,
            inverse: e._maskOptions.inverse,
            canBundle: !1
        })
    }
    pop(t, e, s) {
        this._renderer.renderPipes.batch.break(s), s.add({
            renderPipeId: "stencilMask",
            action: "popMaskEnd",
            mask: t,
            inverse: e._maskOptions.inverse,
            canBundle: !1
        })
    }
    execute(t) {
        var c, u, d;
        if (t.action !== "pushMaskBegin" && t.action !== "popMaskEnd") return;
        const e = this._renderer,
            s = e.canvasContext,
            r = s == null ? void 0 : s.activeContext;
        if (!r) return;
        if (t.action === "popMaskEnd") {
            this._canvasMaskStack.pop() && r.restore();
            return
        }
        t.inverse && this._warnOnce("inverse", "CanvasRenderer: inverse masks are not supported on Canvas2D; ignoring inverse flag.");
        const n = t.mask.mask;
        if (!(n instanceof Z)) {
            this._warnOnce("nonGraphics", "CanvasRenderer: only Graphics masks are supported in Canvas2D; skipping mask."), this._canvasMaskStack.push(!1);
            return
        }
        const o = n,
            a = (c = o.context) == null ? void 0 : c.instructions;
        if (!(a != null && a.length)) {
            this._canvasMaskStack.push(!1);
            return
        }
        r.save(), s.setContextTransform(o.groupTransform, (e._roundPixels | o._roundPixels) === 1), r.beginPath();
        let h = !1,
            l = !1;
        for (let f = 0; f < a.length; f++) {
            const p = a[f],
                m = p.action;
            if (m !== "fill" && m !== "stroke") continue;
            const g = p.data,
                _ = (u = g == null ? void 0 : g.path) == null ? void 0 : u.shapePath;
            if (!((d = _ == null ? void 0 : _.shapePrimitives) != null && d.length)) continue;
            const x = _.shapePrimitives;
            for (let b = 0; b < x.length; b++) {
                const y = x[b];
                if (!(y != null && y.shape)) continue;
                const S = y.transform,
                    v = S && !S.isIdentity();
                v && (r.save(), r.transform(S.a, S.b, S.c, S.d, S.tx, S.ty)), Bc(r, y.shape), l = j_(r, y.holes) || l, h = !0, v && r.restore()
            }
        }
        if (!h) {
            r.restore(), this._canvasMaskStack.push(!1);
            return
        }
        l ? r.clip("evenodd") : r.clip(), this._canvasMaskStack.push(!0)
    }
    destroy() {
        this._renderer = null, this._warnedMaskTypes = null, this._canvasMaskStack = null
    }
    _warnOnce(t, e) {
        this._warnedMaskTypes.has(t) || (this._warnedMaskTypes.add(t), V(e))
    }
}
Ic.extension = {
    type: [w.CanvasPipes],
    name: "stencilMask"
};
class Gc {
    constructor(t) {
        this._maskStackHash = {}, this._maskHash = new WeakMap, this._renderer = t
    }
    push(t, e, s) {
        var r;
        const n = t,
            o = this._renderer;
        o.renderPipes.batch.break(s), o.renderPipes.blendMode.setBlendMode(n.mask, "none", s), s.add({
            renderPipeId: "stencilMask",
            action: "pushMaskBegin",
            mask: t,
            inverse: e._maskOptions.inverse,
            canBundle: !1
        });
        const a = n.mask;
        a.includeInBuild = !0, this._maskHash.has(n) || this._maskHash.set(n, {
            instructionsStart: 0,
            instructionsLength: 0
        });
        const h = this._maskHash.get(n);
        h.instructionsStart = s.instructionSize, a.collectRenderables(s, o, null), a.includeInBuild = !1, o.renderPipes.batch.break(s), s.add({
            renderPipeId: "stencilMask",
            action: "pushMaskEnd",
            mask: t,
            inverse: e._maskOptions.inverse,
            canBundle: !1
        });
        const l = s.instructionSize - h.instructionsStart - 1;
        h.instructionsLength = l;
        const c = o.renderTarget.renderTarget.uid;
        (r = this._maskStackHash)[c] ?? (r[c] = 0)
    }
    pop(t, e, s) {
        const r = t,
            n = this._renderer;
        n.renderPipes.batch.break(s), n.renderPipes.blendMode.setBlendMode(r.mask, "none", s), s.add({
            renderPipeId: "stencilMask",
            action: "popMaskBegin",
            inverse: e._maskOptions.inverse,
            canBundle: !1
        });
        const o = this._maskHash.get(t);
        for (let a = 0; a < o.instructionsLength; a++) s.instructions[s.instructionSize++] = s.instructions[o.instructionsStart++];
        s.add({
            renderPipeId: "stencilMask",
            action: "popMaskEnd",
            canBundle: !1
        })
    }
    execute(t) {
        var e;
        const s = this._renderer,
            r = s,
            n = s.renderTarget.renderTarget.uid;
        let o = (e = this._maskStackHash)[n] ?? (e[n] = 0);
        t.action === "pushMaskBegin" ? (r.renderTarget.ensureDepthStencil(), r.stencil.setStencilMode(Ct.RENDERING_MASK_ADD, o), o++, r.colorMask.setMask(0)) : t.action === "pushMaskEnd" ? (t.inverse ? r.stencil.setStencilMode(Ct.INVERSE_MASK_ACTIVE, o) : r.stencil.setStencilMode(Ct.MASK_ACTIVE, o), r.colorMask.setMask(15)) : t.action === "popMaskBegin" ? (r.colorMask.setMask(0), o !== 0 ? r.stencil.setStencilMode(Ct.RENDERING_MASK_REMOVE, o) : (r.renderTarget.clear(null, Nt.STENCIL), r.stencil.setStencilMode(Ct.DISABLED, o)), o--) : t.action === "popMaskEnd" && (t.inverse ? r.stencil.setStencilMode(Ct.INVERSE_MASK_ACTIVE, o) : r.stencil.setStencilMode(Ct.MASK_ACTIVE, o), r.colorMask.setMask(15)), this._maskStackHash[n] = o
    }
    destroy() {
        this._renderer = null, this._maskStackHash = null, this._maskHash = null
    }
}
Gc.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes],
    name: "stencilMask"
};
const dt = "source-over";

function q_() {
    const i = dc(),
        t = Object.create(null);
    return t.inherit = dt, t.none = dt, t.normal = "source-over", t.add = "lighter", t.multiply = i ? "multiply" : dt, t.screen = i ? "screen" : dt, t.overlay = i ? "overlay" : dt, t.darken = i ? "darken" : dt, t.lighten = i ? "lighten" : dt, t["color-dodge"] = i ? "color-dodge" : dt, t["color-burn"] = i ? "color-burn" : dt, t["hard-light"] = i ? "hard-light" : dt, t["soft-light"] = i ? "soft-light" : dt, t.difference = i ? "difference" : dt, t.exclusion = i ? "exclusion" : dt, t.saturation = i ? "saturation" : dt, t.color = i ? "color" : dt, t.luminosity = i ? "luminosity" : dt, t["linear-burn"] = i ? "color-burn" : dt, t["linear-dodge"] = i ? "color-dodge" : dt, t["linear-light"] = i ? "hard-light" : dt, t["pin-light"] = i ? "hard-light" : dt, t["vivid-light"] = i ? "hard-light" : dt, t["hard-mix"] = dt, t.negation = i ? "difference" : dt, t["normal-npm"] = t.normal, t["add-npm"] = t.add, t["screen-npm"] = t.screen, t.erase = "destination-out", t.subtract = dt, t.divide = dt, t.min = dt, t.max = dt, t
}
const K_ = new N;
class Fc {
    constructor(t) {
        this.activeResolution = 1, this.smoothProperty = "imageSmoothingEnabled", this.blendModes = q_(), this._activeBlendMode = "normal", this._projTransform = null, this._outerBlend = !1, this._warnedBlendModes = new Set, this._renderer = t
    }
    resolutionChange(t) {
        this.activeResolution = t
    }
    init() {
        const t = this._renderer.background.alpha < 1;
        if (this.rootContext = this._renderer.canvas.getContext("2d", {
                alpha: t
            }), this.activeContext = this.rootContext, this.activeResolution = this._renderer.resolution, !this.rootContext.imageSmoothingEnabled) {
            const e = this.rootContext;
            e.webkitImageSmoothingEnabled ? this.smoothProperty = "webkitImageSmoothingEnabled" : e.mozImageSmoothingEnabled ? this.smoothProperty = "mozImageSmoothingEnabled" : e.oImageSmoothingEnabled ? this.smoothProperty = "oImageSmoothingEnabled" : e.msImageSmoothingEnabled && (this.smoothProperty = "msImageSmoothingEnabled")
        }
    }
    setContextTransform(t, e, s, r) {
        var l;
        const n = r ? N.IDENTITY : ((l = this._renderer.globalUniforms.globalUniformData) == null ? void 0 : l.worldTransformMatrix) || N.IDENTITY;
        let o = K_;
        o.copyFrom(n), o.append(t);
        const a = this._projTransform,
            h = this.activeResolution;
        if (s = s || h, a) {
            const c = N.shared;
            c.copyFrom(o), c.prepend(a), o = c
        }
        e ? this.activeContext.setTransform(o.a * s, o.b * s, o.c * s, o.d * s, o.tx * h | 0, o.ty * h | 0) : this.activeContext.setTransform(o.a * s, o.b * s, o.c * s, o.d * s, o.tx * h, o.ty * h)
    }
    clear(t, e) {
        const s = this.activeContext,
            r = this._renderer;
        if (s.clearRect(0, 0, r.width, r.height), t) {
            const n = lt.shared.setValue(t);
            s.globalAlpha = e ?? n.alpha, s.fillStyle = n.toHex(), s.fillRect(0, 0, r.width, r.height), s.globalAlpha = 1
        }
    }
    setBlendMode(t) {
        if (this._activeBlendMode === t) return;
        this._activeBlendMode = t, this._outerBlend = !1;
        const e = this.blendModes[t];
        if (!e) {
            this._warnedBlendModes.has(t) || (console.warn(`CanvasRenderer: blend mode "${t}" is not supported in Canvas2D; falling back to "source-over".`), this._warnedBlendModes.add(t)), this.activeContext.globalCompositeOperation = "source-over";
            return
        }
        this.activeContext.globalCompositeOperation = e
    }
    destroy() {
        this.rootContext = null, this.activeContext = null, this._warnedBlendModes.clear()
    }
}
Fc.extension = {
    type: [w.CanvasSystem],
    name: "canvasContext"
};
class Oc {
    constructor() {
        this.maxTextures = 16, this.maxBatchableTextures = 16, this.maxUniformBindings = 0
    }
    init() {}
}
Oc.extension = {
    type: [w.CanvasSystem],
    name: "limits"
};
class Kn {
    constructor(t) {
        this._renderer = t
    }
    updateRenderable() {}
    destroyRenderable() {}
    validateRenderable() {
        return !1
    }
    addRenderable(t, e) {
        this._renderer.renderPipes.batch.break(e), e.add(t)
    }
    execute(t) {
        t.isRenderable && t.render(this._renderer)
    }
    destroy() {
        this._renderer = null
    }
}
Kn.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "customRender"
};

function cn(i, t) {
    const e = i.instructionSet,
        s = e.instructions;
    for (let r = 0; r < e.instructionSize; r++) {
        const n = s[r];
        t[n.renderPipeId].execute(n)
    }
}
class Zn {
    constructor(t) {
        this._renderer = t
    }
    addRenderGroup(t, e) {
        t.isCachedAsTexture ? this._addRenderableCacheAsTexture(t, e) : this._addRenderableDirect(t, e)
    }
    execute(t) {
        t.isRenderable && (t.isCachedAsTexture ? this._executeCacheAsTexture(t) : this._executeDirect(t))
    }
    destroy() {
        this._renderer = null
    }
    _addRenderableDirect(t, e) {
        this._renderer.renderPipes.batch.break(e), t._batchableRenderGroup && (Et.return(t._batchableRenderGroup), t._batchableRenderGroup = null), e.add(t)
    }
    _addRenderableCacheAsTexture(t, e) {
        const s = t._batchableRenderGroup ?? (t._batchableRenderGroup = Et.get(Xn));
        s.renderable = t.root, s.transform = t.root.relativeGroupTransform, s.texture = t.texture, s.bounds = t._textureBounds, e.add(t), this._renderer.renderPipes.blendMode.pushBlendMode(t, t.root.groupBlendMode, e), this._renderer.renderPipes.batch.addToBatch(s, e), this._renderer.renderPipes.blendMode.popBlendMode(e)
    }
    _executeCacheAsTexture(t) {
        if (t.textureNeedsUpdate) {
            t.textureNeedsUpdate = !1;
            const e = new N().translate(-t._textureBounds.x, -t._textureBounds.y);
            this._renderer.renderTarget.push(t.texture, !0, null, t.texture.frame), this._renderer.globalUniforms.push({
                worldTransformMatrix: e,
                worldColor: 4294967295,
                offset: {
                    x: 0,
                    y: 0
                }
            }), cn(t, this._renderer.renderPipes), this._renderer.renderTarget.finishRenderPass(), this._renderer.renderTarget.pop(), this._renderer.globalUniforms.pop()
        }
        t._batchableRenderGroup._batcher.updateElement(t._batchableRenderGroup), t._batchableRenderGroup._batcher.geometry.buffers[0].update()
    }
    _executeDirect(t) {
        this._renderer.globalUniforms.push({
            worldTransformMatrix: t.inverseParentTextureTransform,
            worldColor: t.worldColorAlpha
        }), cn(t, this._renderer.renderPipes), this._renderer.globalUniforms.pop()
    }
}
Zn.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "renderGroup"
};
const Z_ = "#808080",
    Ci = new N,
    Q_ = new N,
    J_ = new N,
    Er = new N;

function tx(i, t, e) {
    i.beginPath();
    for (let s = 0; s < e.length; s += 3) {
        const r = e[s] * 2,
            n = e[s + 1] * 2,
            o = e[s + 2] * 2;
        i.moveTo(t[r], t[r + 1]), i.lineTo(t[n], t[n + 1]), i.lineTo(t[o], t[o + 1]), i.closePath()
    }
    i.fill()
}

function ex(i) {
    return `#${(i&16777215).toString(16).padStart(6,"0")}`
}

function sx(i, t, e, s, r, n) {
    n = Math.max(0, Math.min(n, Math.min(s, r) / 2)), i.moveTo(t + n, e), i.lineTo(t + s - n, e), i.quadraticCurveTo(t + s, e, t + s, e + n), i.lineTo(t + s, e + r - n), i.quadraticCurveTo(t + s, e + r, t + s - n, e + r), i.lineTo(t + n, e + r), i.quadraticCurveTo(t, e + r, t, e + r - n), i.lineTo(t, e + n), i.quadraticCurveTo(t, e, t + n, e)
}

function Ri(i, t) {
    switch (t.type) {
        case "rectangle": {
            const e = t;
            i.rect(e.x, e.y, e.width, e.height);
            break
        }
        case "roundedRectangle": {
            const e = t;
            sx(i, e.x, e.y, e.width, e.height, e.radius);
            break
        }
        case "circle": {
            const e = t;
            i.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            break
        }
        case "ellipse": {
            const e = t;
            i.ellipse ? i.ellipse(e.x, e.y, e.halfWidth, e.halfHeight, 0, 0, Math.PI * 2) : (i.save(), i.translate(e.x, e.y), i.scale(e.halfWidth, e.halfHeight), i.arc(0, 0, 1, 0, Math.PI * 2), i.restore());
            break
        }
        case "triangle": {
            const e = t;
            i.moveTo(e.x, e.y), i.lineTo(e.x2, e.y2), i.lineTo(e.x3, e.y3), i.closePath();
            break
        }
        case "polygon":
        default: {
            const e = t,
                s = e.points;
            if (!(s != null && s.length)) break;
            i.moveTo(s[0], s[1]);
            for (let r = 2; r < s.length; r += 2) i.lineTo(s[r], s[r + 1]);
            e.closePath && i.closePath();
            break
        }
    }
}

function ix(i, t) {
    if (!(t != null && t.length)) return !1;
    for (let e = 0; e < t.length; e++) {
        const s = t[e];
        if (!(s != null && s.shape)) continue;
        const r = s.transform,
            n = r && !r.isIdentity();
        n && (i.save(), i.transform(r.a, r.b, r.c, r.d, r.tx, r.ty)), Ri(i, s.shape), n && i.restore()
    }
    return !0
}

function rx(i, t, e, s) {
    const r = i.fill;
    if (r instanceof ne) {
        r.buildGradient();
        const o = r.texture;
        if (o) {
            const a = it.getTintedPattern(o, t),
                h = e ? Er.copyFrom(e).scale(o.source.pixelWidth, o.source.pixelHeight) : Er.copyFrom(r.transform);
            return s && !i.textureSpace && h.append(s), it.applyPatternTransform(a, h), a
        }
    }
    if (r instanceof oi) {
        const o = it.getTintedPattern(r.texture, t);
        return it.applyPatternTransform(o, r.transform), o
    }
    const n = i.texture;
    if (n && n !== O.WHITE) {
        if (!n.source.resource) return Z_;
        const o = it.getTintedPattern(n, t),
            a = e ? Er.copyFrom(e).scale(n.source.pixelWidth, n.source.pixelHeight) : i.matrix;
        return it.applyPatternTransform(o, a), o
    }
    return ex(t)
}
class Lc {
    constructor() {
        this.shader = null
    }
    contextChange(t) {}
    execute(t, e) {
        var x, b, y, S, v, T, M;
        const s = t.renderer,
            r = s.canvasContext,
            n = r.activeContext,
            o = e.groupTransform,
            a = ((x = s.globalUniforms.globalUniformData) == null ? void 0 : x.worldColor) ?? 4294967295,
            h = e.groupColorAlpha,
            l = (a >>> 24 & 255) / 255,
            c = (h >>> 24 & 255) / 255,
            u = ((b = s.filter) == null ? void 0 : b.alphaMultiplier) ?? 1,
            d = l * c * u;
        if (d <= 0) return;
        const f = a & 16777215,
            p = h & 16777215,
            m = fs(ds(p, f)),
            g = s._roundPixels | e._roundPixels;
        n.save(), r.setContextTransform(o, g === 1), r.setBlendMode(e.groupBlendMode);
        const _ = e.context.instructions;
        for (let C = 0; C < _.length; C++) {
            const A = _[C];
            if (A.action === "texture") {
                const z = A.data,
                    B = z.image,
                    L = B ? it.getCanvasSource(B) : null;
                if (!L) continue;
                const q = z.alpha * d;
                if (q <= 0) continue;
                const K = ds(z.style, m);
                n.globalAlpha = q;
                let W = L;
                K !== 16777215 && (W = it.getTintedCanvas({
                    texture: B
                }, K));
                const et = B.frame,
                    rt = B.source._resolution ?? B.source.resolution ?? 1;
                let ut = et.x * rt,
                    ct = et.y * rt;
                const vt = et.width * rt,
                    $ = et.height * rt;
                W !== L && (ut = 0, ct = 0);
                const wt = z.transform,
                    xt = wt && !wt.isIdentity(),
                    Tt = B.rotate;
                xt || Tt ? (Ci.copyFrom(o), xt && Ci.append(wt), Tt && tt.matrixAppendRotationInv(Ci, Tt, z.dx, z.dy, z.dw, z.dh), r.setContextTransform(Ci, g === 1)) : r.setContextTransform(o, g === 1), n.drawImage(W, ut, ct, W === L ? vt : W.width, W === L ? $ : W.height, Tt ? 0 : z.dx, Tt ? 0 : z.dy, z.dw, z.dh), (xt || Tt) && r.setContextTransform(o, g === 1);
                continue
            }
            const P = A.data,
                k = (y = P == null ? void 0 : P.path) == null ? void 0 : y.shapePath;
            if (!((S = k == null ? void 0 : k.shapePrimitives) != null && S.length)) continue;
            const G = P.style,
                F = ds(G.color, m),
                ht = G.alpha * d;
            if (ht <= 0) continue;
            const R = A.action === "stroke";
            if (n.globalAlpha = ht, R) {
                const z = G;
                n.lineWidth = z.width, n.lineCap = z.cap, n.lineJoin = z.join, n.miterLimit = z.miterLimit
            }
            const I = k.shapePrimitives;
            if (!R && ((M = (T = (v = P.hole) == null ? void 0 : v.shapePath) == null ? void 0 : T.shapePrimitives) != null && M.length)) {
                const z = I[I.length - 1];
                z.holes = P.hole.shapePath.shapePrimitives
            }
            for (let z = 0; z < I.length; z++) {
                const B = I[z];
                if (!(B != null && B.shape)) continue;
                const L = B.transform,
                    q = L && !L.isIdentity(),
                    K = G.texture && G.texture !== O.WHITE,
                    W = G.textureSpace === "global" ? L : null,
                    et = K ? $l(Q_, G, B.shape, W) : null,
                    rt = q ? J_.copyFrom(o).append(L) : o,
                    ut = rx(G, F, et, rt);
                if (q && (n.save(), n.transform(L.a, L.b, L.c, L.d, L.tx, L.ty)), R) {
                    const ct = G;
                    if (ct.alignment !== .5 && !ct.pixelLine) {
                        const $ = [],
                            wt = [],
                            xt = [],
                            Tt = ni[B.shape.type];
                        if (Tt != null && Tt.build(B.shape, $)) {
                            const ee = B.shape.closePath ?? !0;
                            Xl($, ct, !1, ee, wt, xt), n.fillStyle = ut, tx(n, wt, xt)
                        } else n.strokeStyle = ut, n.beginPath(), Ri(n, B.shape), n.stroke()
                    } else n.strokeStyle = ut, n.beginPath(), Ri(n, B.shape), n.stroke()
                } else n.fillStyle = ut, n.beginPath(), Ri(n, B.shape), ix(n, B.holes) ? n.fill("evenodd") : n.fill();
                q && n.restore()
            }
        }
        n.restore()
    }
    destroy() {
        this.shader = null
    }
}
Lc.extension = {
    type: [w.CanvasPipesAdaptor],
    name: "graphics"
};
class Qn {
    constructor(t) {
        this._renderer = t
    }
    addRenderable(t, e) {
        const s = this._getGpuSprite(t);
        t.didViewUpdate && this._updateBatchableSprite(t, s), this._renderer.renderPipes.batch.addToBatch(s, e)
    }
    updateRenderable(t) {
        const e = this._getGpuSprite(t);
        t.didViewUpdate && this._updateBatchableSprite(t, e), e._batcher.updateElement(e)
    }
    validateRenderable(t) {
        const e = this._getGpuSprite(t);
        return !e._batcher.checkAndUpdateTexture(e, t._texture)
    }
    _updateBatchableSprite(t, e) {
        e.bounds = t.visualBounds, e.texture = t._texture
    }
    _getGpuSprite(t) {
        return t._gpuData[this._renderer.uid] || this._initGPUSprite(t)
    }
    _initGPUSprite(t) {
        const e = new Xn;
        return e.renderable = t, e.transform = t.groupTransform, e.texture = t._texture, e.bounds = t.visualBounds, e.roundPixels = this._renderer._roundPixels | t._roundPixels, t._gpuData[this._renderer.uid] = e, e
    }
    destroy() {
        this._renderer = null
    }
}
Qn.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "sprite"
};
const Ys = {};
Y.handle(w.BlendMode, i => {
    if (!i.name) throw new Error("BlendMode extension must have a name property");
    Ys[i.name] = i.ref
}, i => {
    delete Ys[i.name]
});
class Jn {
    constructor(t) {
        this._blendModeStack = [], this._isAdvanced = !1, this._filterHash = Object.create(null), this._renderer = t, this._renderer.runners.prerender.add(this)
    }
    prerender() {
        this._activeBlendMode = "normal", this._isAdvanced = !1
    }
    pushBlendMode(t, e, s) {
        this._blendModeStack.push(e), this.setBlendMode(t, e, s)
    }
    popBlendMode(t) {
        this._blendModeStack.pop();
        const e = this._blendModeStack[this._activeBlendMode.length - 1] ?? "normal";
        this.setBlendMode(null, e, t)
    }
    setBlendMode(t, e, s) {
        var n;
        const r = t instanceof Xr;
        if (this._activeBlendMode === e) {
            this._isAdvanced && t && !r && ((n = this._renderableList) == null || n.push(t));
            return
        }
        this._isAdvanced && this._endAdvancedBlendMode(s), this._activeBlendMode = e, t && (this._isAdvanced = !!Ys[e], this._isAdvanced && this._beginAdvancedBlendMode(t, s))
    }
    _beginAdvancedBlendMode(t, e) {
        this._renderer.renderPipes.batch.break(e);
        const s = this._activeBlendMode;
        if (!Ys[s]) {
            V(`Unable to assign BlendMode: '${s}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);
            return
        }
        const r = this._ensureFilterEffect(s),
            n = t instanceof Xr,
            o = {
                renderPipeId: "filter",
                action: "pushFilter",
                filterEffect: r,
                renderables: n ? null : [t],
                container: n ? t.root : null,
                canBundle: !1
            };
        this._renderableList = o.renderables, e.add(o)
    }
    _ensureFilterEffect(t) {
        let e = this._filterHash[t];
        return e || (e = this._filterHash[t] = new Oi, e.filters = [new Ys[t]]), e
    }
    _endAdvancedBlendMode(t) {
        this._isAdvanced = !1, this._renderableList = null, this._renderer.renderPipes.batch.break(t), t.add({
            renderPipeId: "filter",
            action: "popFilter",
            canBundle: !1
        })
    }
    buildStart() {
        this._isAdvanced = !1
    }
    buildEnd(t) {
        this._isAdvanced && this._endAdvancedBlendMode(t)
    }
    destroy() {
        this._renderer = null, this._renderableList = null;
        for (const t in this._filterHash) this._filterHash[t].destroy();
        this._filterHash = null
    }
}
Jn.extension = {
    type: [w.WebGLPipes, w.WebGPUPipes, w.CanvasPipes],
    name: "blendMode"
};

function un(i, t) {
    t || (t = 0);
    for (let e = t; e < i.length && i[e]; e++) i[e] = null
}
const nx = new D,
    rh = Ws | Di | bn;

function Dc(i, t = !1) {
    ox(i);
    const e = i.childrenToUpdate,
        s = i.updateTick++;
    for (const r in e) {
        const n = Number(r),
            o = e[r],
            a = o.list,
            h = o.index;
        for (let l = 0; l < h; l++) {
            const c = a[l];
            c.parentRenderGroup === i && c.relativeRenderGroupDepth === n && Uc(c, s, 0)
        }
        un(a, h), o.index = 0
    }
    if (t)
        for (let r = 0; r < i.renderGroupChildren.length; r++) Dc(i.renderGroupChildren[r], t)
}

function ox(i) {
    const t = i.root;
    let e;
    if (i.renderGroupParent) {
        const s = i.renderGroupParent;
        i.worldTransform.appendFrom(t.relativeGroupTransform, s.worldTransform), i.worldColor = Li(t.groupColor, s.worldColor), e = t.groupAlpha * s.worldAlpha
    } else i.worldTransform.copyFrom(t.localTransform), i.worldColor = t.localColor, e = t.localAlpha;
    e = e < 0 ? 0 : e > 1 ? 1 : e, i.worldAlpha = e, i.worldColorAlpha = i.worldColor + ((e * 255 | 0) << 24)
}

function Uc(i, t, e) {
    if (t === i.updateTick) return;
    i.updateTick = t, i.didChange = !1;
    const s = i.localTransform;
    i.updateLocalTransform();
    const r = i.parent;
    if (r && !r.renderGroup ? (e |= i._updateFlags, i.relativeGroupTransform.appendFrom(s, r.relativeGroupTransform), e & rh && nh(i, r, e)) : (e = i._updateFlags, i.relativeGroupTransform.copyFrom(s), e & rh && nh(i, nx, e)), !i.renderGroup) {
        const n = i.children,
            o = n.length;
        for (let l = 0; l < o; l++) Uc(n[l], t, e);
        const a = i.parentRenderGroup,
            h = i;
        h.renderPipeId && !a.structureDidChange && a.updateRenderable(h)
    }
}

function nh(i, t, e) {
    if (e & Di) {
        i.groupColor = Li(i.localColor, t.groupColor);
        let s = i.localAlpha * t.groupAlpha;
        s = s < 0 ? 0 : s > 1 ? 1 : s, i.groupAlpha = s, i.groupColorAlpha = i.groupColor + ((s * 255 | 0) << 24)
    }
    e & bn && (i.groupBlendMode = i.localBlendMode === "inherit" ? t.groupBlendMode : i.localBlendMode), e & Ws && (i.globalDisplayStatus = i.localDisplayStatus & t.globalDisplayStatus), i._updateFlags = 0
}

function ax(i, t) {
    const {
        list: e
    } = i.childrenRenderablesToUpdate;
    let s = !1;
    for (let r = 0; r < i.childrenRenderablesToUpdate.index; r++) {
        const n = e[r];
        if (s = t[n.renderPipeId].validateRenderable(n), s) break
    }
    return i.structureDidChange = s, s
}
const hx = new N;
class Nc {
    constructor(t) {
        this._renderer = t
    }
    render({
        container: t,
        transform: e
    }) {
        const s = t.parent,
            r = t.renderGroup.renderGroupParent;
        t.parent = null, t.renderGroup.renderGroupParent = null;
        const n = this._renderer,
            o = hx;
        e && (o.copyFrom(t.renderGroup.localTransform), t.renderGroup.localTransform.copyFrom(e));
        const a = n.renderPipes;
        this._updateCachedRenderGroups(t.renderGroup, null), this._updateRenderGroups(t.renderGroup), n.globalUniforms.start({
            worldTransformMatrix: e ? t.renderGroup.localTransform : t.renderGroup.worldTransform,
            worldColor: t.renderGroup.worldColorAlpha
        }), cn(t.renderGroup, a), a.uniformBatch && a.uniformBatch.renderEnd(), e && t.renderGroup.localTransform.copyFrom(o), t.parent = s, t.renderGroup.renderGroupParent = r
    }
    destroy() {
        this._renderer = null
    }
    _updateCachedRenderGroups(t, e) {
        if (t._parentCacheAsTextureRenderGroup = e, t.isCachedAsTexture) {
            if (!t.textureNeedsUpdate) return;
            e = t
        }
        for (let s = t.renderGroupChildren.length - 1; s >= 0; s--) this._updateCachedRenderGroups(t.renderGroupChildren[s], e);
        if (t.invalidateMatrices(), t.isCachedAsTexture) {
            if (t.textureNeedsUpdate) {
                const s = t.root.getLocalBounds(),
                    r = this._renderer,
                    n = t.textureOptions.resolution || r.view.resolution,
                    o = t.textureOptions.antialias ?? r.view.antialias,
                    a = t.textureOptions.scaleMode ?? "linear",
                    h = t.texture;
                s.ceil(), t.texture && bt.returnTexture(t.texture, !0);
                const l = bt.getOptimalTexture(s.width, s.height, n, o);
                l._source.style = new me({
                    scaleMode: a
                }), t.texture = l, t._textureBounds || (t._textureBounds = new Ft), t._textureBounds.copyFrom(s), h !== t.texture && t.renderGroupParent && (t.renderGroupParent.structureDidChange = !0)
            }
        } else t.texture && (bt.returnTexture(t.texture, !0), t.texture = null)
    }
    _updateRenderGroups(t) {
        const e = this._renderer,
            s = e.renderPipes;
        if (t.runOnRender(e), t.instructionSet.renderPipes = s, t.structureDidChange ? un(t.childrenRenderablesToUpdate.list, 0) : ax(t, s), Dc(t), t.structureDidChange ? (t.structureDidChange = !1, this._buildInstructions(t, e)) : this._updateRenderables(t), t.childrenRenderablesToUpdate.index = 0, e.renderPipes.batch.upload(t.instructionSet), !(t.isCachedAsTexture && !t.textureNeedsUpdate))
            for (let r = 0; r < t.renderGroupChildren.length; r++) this._updateRenderGroups(t.renderGroupChildren[r])
    }
    _updateRenderables(t) {
        const {
            list: e,
            index: s
        } = t.childrenRenderablesToUpdate;
        for (let r = 0; r < s; r++) {
            const n = e[r];
            n.didViewUpdate && t.updateRenderable(n)
        }
        un(e, s)
    }
    _buildInstructions(t, e) {
        const s = t.root,
            r = t.instructionSet;
        r.reset();
        const n = e.renderPipes ? e : e.batch.renderer,
            o = n.renderPipes;
        o.batch.buildStart(r), o.blendMode.buildStart(), o.colorMask.buildStart(), s.sortableChildren && s.sortChildren(), s.collectRenderablesWithEffects(r, n, null), o.batch.buildEnd(r), o.blendMode.buildEnd(r)
    }
}
Nc.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "renderGroup"
};
const to = class Wc {
    constructor() {
        this.clearBeforeRender = !0, this._backgroundColor = new lt(0), this.color = this._backgroundColor, this.alpha = 1
    }
    init(t) {
        t = {
            ...Wc.defaultOptions,
            ...t
        }, this.clearBeforeRender = t.clearBeforeRender, this.color = t.background || t.backgroundColor || this._backgroundColor, this.alpha = t.backgroundAlpha, this._backgroundColor.setAlpha(t.backgroundAlpha)
    }
    get color() {
        return this._backgroundColor
    }
    set color(t) {
        lt.shared.setValue(t).alpha < 1 && this._backgroundColor.alpha === 1 && V("Cannot set a transparent background on an opaque canvas. To enable transparency, set backgroundAlpha < 1 when initializing your Application."), this._backgroundColor.setValue(t)
    }
    get alpha() {
        return this._backgroundColor.alpha
    }
    set alpha(t) {
        this._backgroundColor.setAlpha(t)
    }
    get colorRgba() {
        return this._backgroundColor.toArray()
    }
    destroy() {}
};
to.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "background",
    priority: 0
};
to.defaultOptions = {
    backgroundAlpha: 1,
    backgroundColor: 0,
    clearBeforeRender: !0
};
let lx = to;
const Mr = {
        png: "image/png",
        jpg: "image/jpeg",
        webp: "image/webp"
    },
    eo = class Hc {
        constructor(t) {
            this._renderer = t
        }
        _normalizeOptions(t, e = {}) {
            return t instanceof D || t instanceof O ? {
                target: t,
                ...e
            } : {
                ...e,
                ...t
            }
        }
        async image(t) {
            const e = X.get().createImage();
            return e.src = await this.base64(t), e
        }
        async base64(t) {
            t = this._normalizeOptions(t, Hc.defaultImageOptions);
            const {
                format: e,
                quality: s
            } = t, r = this.canvas(t);
            if (r.toBlob !== void 0) return new Promise((n, o) => {
                r.toBlob(a => {
                    if (!a) {
                        o(new Error("ICanvas.toBlob failed!"));
                        return
                    }
                    const h = new FileReader;
                    h.onload = () => n(h.result), h.onerror = o, h.readAsDataURL(a)
                }, Mr[e], s)
            });
            if (r.toDataURL !== void 0) return r.toDataURL(Mr[e], s);
            if (r.convertToBlob !== void 0) {
                const n = await r.convertToBlob({
                    type: Mr[e],
                    quality: s
                });
                return new Promise((o, a) => {
                    const h = new FileReader;
                    h.onload = () => o(h.result), h.onerror = a, h.readAsDataURL(n)
                })
            }
            throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented")
        }
        canvas(t) {
            t = this._normalizeOptions(t);
            const e = t.target,
                s = this._renderer;
            if (e instanceof O) return s.texture.generateCanvas(e);
            const r = s.textureGenerator.generateTexture(t),
                n = s.texture.generateCanvas(r);
            return r.destroy(!0), n
        }
        pixels(t) {
            t = this._normalizeOptions(t);
            const e = t.target,
                s = this._renderer,
                r = e instanceof O ? e : s.textureGenerator.generateTexture(t),
                n = s.texture.getPixels(r);
            return e instanceof D && r.destroy(!0), n
        }
        texture(t) {
            return t = this._normalizeOptions(t), t.target instanceof O ? t.target : this._renderer.textureGenerator.generateTexture(t)
        }
        download(t) {
            t = this._normalizeOptions(t);
            const e = this.canvas(t),
                s = document.createElement("a");
            s.download = t.filename ?? "image.png", s.href = e.toDataURL("image/png"), document.body.appendChild(s), s.click(), document.body.removeChild(s)
        }
        log(t) {
            const e = t.width ?? 200;
            t = this._normalizeOptions(t);
            const s = this.canvas(t),
                r = s.toDataURL();
            console.log(`[Pixi Texture] ${s.width}px ${s.height}px`);
            const n = ["font-size: 1px;", `padding: ${e}px 300px;`, `background: url(${r}) no-repeat;`, "background-size: contain;"].join(" ");
            console.log("%c ", n)
        }
        destroy() {
            this._renderer = null
        }
    };
eo.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "extract"
};
eo.defaultImageOptions = {
    format: "png",
    quality: 1
};
let cx = eo;
class so extends O {
    static create(t) {
        const {
            dynamic: e,
            ...s
        } = t;
        return new so({
            source: new At(s),
            dynamic: e ?? !1
        })
    }
    resize(t, e, s) {
        return this.source.resize(t, e, s), this
    }
}
const ux = new nt,
    dx = new Ft,
    fx = [0, 0, 0, 0];
class zc {
    constructor(t) {
        this._renderer = t
    }
    generateTexture(t) {
        var l;
        t instanceof D && (t = {
            target: t,
            frame: void 0,
            textureSourceOptions: {},
            resolution: void 0
        });
        const e = t.resolution || this._renderer.resolution,
            s = t.antialias || this._renderer.view.antialias,
            r = t.target;
        let n = t.clearColor;
        n ? n = Array.isArray(n) && n.length === 4 ? n : lt.shared.setValue(n).toArray() : n = fx;
        const o = ((l = t.frame) == null ? void 0 : l.copyTo(ux)) || xn(r, dx).rectangle;
        o.width = Math.max(o.width, 1 / e) | 0, o.height = Math.max(o.height, 1 / e) | 0;
        const a = so.create({
                ...t.textureSourceOptions,
                width: o.width,
                height: o.height,
                resolution: e,
                antialias: s
            }),
            h = N.shared.translate(-o.x, -o.y);
        return this._renderer.render({
            container: r,
            transform: h,
            target: a,
            clearColor: n
        }), a.source.updateMipmaps(), a
    }
    destroy() {
        this._renderer = null
    }
}
zc.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "textureGenerator"
};

function px(i) {
    let t = !1;
    for (const s in i)
        if (i[s] == null) {
            t = !0;
            break
        } if (!t) return i;
    const e = Object.create(null);
    for (const s in i) {
        const r = i[s];
        r && (e[s] = r)
    }
    return e
}

function mx(i) {
    let t = 0;
    for (let e = 0; e < i.length; e++) i[e] == null ? t++ : i[e - t] = i[e];
    return i.length -= t, i
}
const io = class Vc {
    constructor(t) {
        this._managedResources = [], this._managedResourceHashes = [], this._managedCollections = [], this._ready = !1, this._renderer = t
    }
    init(t) {
        t = {
            ...Vc.defaultOptions,
            ...t
        }, this.maxUnusedTime = t.gcMaxUnusedTime, this._frequency = t.gcFrequency, this.enabled = t.gcActive, this.now = performance.now()
    }
    get enabled() {
        return !!this._handler
    }
    set enabled(t) {
        this.enabled !== t && (t ? (this._handler = this._renderer.scheduler.repeat(() => {
            this._ready = !0
        }, this._frequency, !1), this._collectionsHandler = this._renderer.scheduler.repeat(() => {
            for (const e of this._managedCollections) {
                const {
                    context: s,
                    collection: r,
                    type: n
                } = e;
                n === "hash" ? s[r] = px(s[r]) : s[r] = mx(s[r])
            }
        }, this._frequency)) : (this._renderer.scheduler.cancel(this._handler), this._renderer.scheduler.cancel(this._collectionsHandler), this._handler = 0, this._collectionsHandler = 0))
    }
    prerender({
        container: t
    }) {
        this.now = performance.now(), t.renderGroup.gcTick = this._renderer.tick++, this._updateInstructionGCTick(t.renderGroup, t.renderGroup.gcTick)
    }
    postrender() {
        !this._ready || !this.enabled || (this.run(), this._ready = !1)
    }
    _updateInstructionGCTick(t, e) {
        t.instructionSet.gcTick = e, t.gcTick = e;
        for (const s of t.renderGroupChildren) this._updateInstructionGCTick(s, e)
    }
    addCollection(t, e, s) {
        this._managedCollections.push({
            context: t,
            collection: e,
            type: s
        })
    }
    addResource(t, e) {
        var r, n;
        if (t._gcLastUsed !== -1) {
            t._gcLastUsed = this.now, (r = t._onTouch) == null || r.call(t, this.now);
            return
        }
        const s = this._managedResources.length;
        t._gcData = {
            index: s,
            type: e
        }, t._gcLastUsed = this.now, (n = t._onTouch) == null || n.call(t, this.now), t.once("unload", this.removeResource, this), this._managedResources.push(t)
    }
    removeResource(t) {
        const e = t._gcData;
        if (!e) return;
        const s = e.index,
            r = this._managedResources.length - 1;
        if (s !== r) {
            const n = this._managedResources[r];
            this._managedResources[s] = n, n._gcData.index = s
        }
        this._managedResources.length--, t._gcData = null, t._gcLastUsed = -1
    }
    addResourceHash(t, e, s, r = 0) {
        this._managedResourceHashes.push({
            context: t,
            hash: e,
            type: s,
            priority: r
        }), this._managedResourceHashes.sort((n, o) => n.priority - o.priority)
    }
    run() {
        const t = performance.now(),
            e = this._managedResourceHashes;
        for (const r of e) this.runOnHash(r, t);
        let s = 0;
        for (let r = 0; r < this._managedResources.length; r++) {
            const n = this._managedResources[r];
            s = this.runOnResource(n, t, s)
        }
        this._managedResources.length = s
    }
    updateRenderableGCTick(t, e) {
        var n, o;
        const s = t.renderGroup ?? t.parentRenderGroup,
            r = ((n = s == null ? void 0 : s.instructionSet) == null ? void 0 : n.gcTick) ?? -1;
        ((s == null ? void 0 : s.gcTick) ?? 0) === r && (t._gcLastUsed = e, (o = t._onTouch) == null || o.call(t, e))
    }
    runOnResource(t, e, s) {
        const r = t._gcData;
        return r.type === "renderable" && this.updateRenderableGCTick(t, e), e - t._gcLastUsed < this.maxUnusedTime || !t.autoGarbageCollect ? (this._managedResources[s] = t, r.index = s, s++) : (t.unload(), t._gcData = null, t._gcLastUsed = -1, t.off("unload", this.removeResource, this)), s
    }
    _createHashClone(t, e) {
        const s = Object.create(null);
        for (const r in t) {
            if (r === e) break;
            t[r] !== null && (s[r] = t[r])
        }
        return s
    }
    runOnHash(t, e) {
        var l;
        const {
            context: s,
            hash: r,
            type: n
        } = t, o = s[r];
        let a = null,
            h = 0;
        for (const c in o) {
            const u = o[c];
            if (u === null) {
                h++, h === 1e4 && !a && (a = this._createHashClone(o, c));
                continue
            }
            if (u._gcLastUsed === -1) {
                u._gcLastUsed = e, (l = u._onTouch) == null || l.call(u, e), a && (a[c] = u);
                continue
            }
            if (n === "renderable" && this.updateRenderableGCTick(u, e), !(e - u._gcLastUsed < this.maxUnusedTime) && u.autoGarbageCollect) {
                if (a || (h + 1 !== 1e4 ? (o[c] = null, h++) : a = this._createHashClone(o, c)), n === "renderable") {
                    const f = u,
                        p = f.renderGroup ?? f.parentRenderGroup;
                    p && (p.structureDidChange = !0)
                }
                u.unload(), u._gcData = null, u._gcLastUsed = -1
            } else a && (a[c] = u)
        }
        a && (s[r] = a)
    }
    destroy() {
        this.enabled = !1, this._managedResources.forEach(t => {
            t.off("unload", this.removeResource, this)
        }), this._managedResources.length = 0, this._managedResourceHashes.length = 0, this._managedCollections.length = 0, this._renderer = null
    }
};
io.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "gc",
    priority: 0
};
io.defaultOptions = {
    gcActive: !0,
    gcMaxUnusedTime: 6e4,
    gcFrequency: 3e4
};
let gx = io;
class Xc {
    constructor(t) {
        this._stackIndex = 0, this._globalUniformDataStack = [], this._uniformsPool = [], this._activeUniforms = [], this._bindGroupPool = [], this._activeBindGroups = [], this._renderer = t
    }
    reset() {
        this._stackIndex = 0;
        for (let t = 0; t < this._activeUniforms.length; t++) this._uniformsPool.push(this._activeUniforms[t]);
        for (let t = 0; t < this._activeBindGroups.length; t++) this._bindGroupPool.push(this._activeBindGroups[t]);
        this._activeUniforms.length = 0, this._activeBindGroups.length = 0
    }
    start(t) {
        this.reset(), this.push(t)
    }
    bind({
        size: t,
        projectionMatrix: e,
        worldTransformMatrix: s,
        worldColor: r,
        offset: n
    }) {
        const o = this._renderer.renderTarget.renderTarget,
            a = this._stackIndex ? this._globalUniformDataStack[this._stackIndex - 1] : {
                worldTransformMatrix: new N,
                worldColor: 4294967295,
                offset: new mt
            },
            h = {
                projectionMatrix: e || this._renderer.renderTarget.projectionMatrix,
                resolution: t || o.size,
                worldTransformMatrix: s || a.worldTransformMatrix,
                worldColor: r || a.worldColor,
                offset: n || a.offset,
                bindGroup: null
            },
            l = this._uniformsPool.pop() || this._createUniforms();
        this._activeUniforms.push(l);
        const c = l.uniforms;
        c.uProjectionMatrix = h.projectionMatrix, c.uResolution = h.resolution, c.uWorldTransformMatrix.copyFrom(h.worldTransformMatrix), c.uWorldTransformMatrix.tx -= h.offset.x, c.uWorldTransformMatrix.ty -= h.offset.y, cc(h.worldColor, c.uWorldColorAlpha, 0), l.update();
        let u;
        this._renderer.renderPipes.uniformBatch ? u = this._renderer.renderPipes.uniformBatch.getUniformBindGroup(l, !1) : (u = this._bindGroupPool.pop() || new Se, this._activeBindGroups.push(u), u.setResource(l, 0)), h.bindGroup = u, this._currentGlobalUniformData = h
    }
    push(t) {
        this.bind(t), this._globalUniformDataStack[this._stackIndex++] = this._currentGlobalUniformData
    }
    pop() {
        this._currentGlobalUniformData = this._globalUniformDataStack[--this._stackIndex - 1], this._renderer.type === Vt.WEBGL && this._currentGlobalUniformData.bindGroup.resources[0].update()
    }
    get bindGroup() {
        return this._currentGlobalUniformData.bindGroup
    }
    get globalUniformData() {
        return this._currentGlobalUniformData
    }
    get uniformGroup() {
        return this._currentGlobalUniformData.bindGroup.resources[0]
    }
    _createUniforms() {
        return new te({
            uProjectionMatrix: {
                value: new N,
                type: "mat3x3<f32>"
            },
            uWorldTransformMatrix: {
                value: new N,
                type: "mat3x3<f32>"
            },
            uWorldColorAlpha: {
                value: new Float32Array(4),
                type: "vec4<f32>"
            },
            uResolution: {
                value: [0, 0],
                type: "vec2<f32>"
            }
        }, {
            isStatic: !0
        })
    }
    destroy() {
        this._renderer = null, this._globalUniformDataStack.length = 0, this._uniformsPool.length = 0, this._activeUniforms.length = 0, this._bindGroupPool.length = 0, this._activeBindGroups.length = 0, this._currentGlobalUniformData = null
    }
}
Xc.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "globalUniforms"
};
let _x = 1;
class Yc {
    constructor() {
        this._tasks = [], this._offset = 0
    }
    init() {
        Gt.system.add(this._update, this)
    }
    repeat(t, e, s = !0) {
        const r = _x++;
        let n = 0;
        return s && (this._offset += 1e3, n = this._offset), this._tasks.push({
            func: t,
            duration: e,
            start: performance.now(),
            offset: n,
            last: performance.now(),
            repeat: !0,
            id: r
        }), r
    }
    cancel(t) {
        for (let e = 0; e < this._tasks.length; e++)
            if (this._tasks[e].id === t) {
                this._tasks.splice(e, 1);
                return
            }
    }
    _update() {
        const t = performance.now();
        for (let e = 0; e < this._tasks.length; e++) {
            const s = this._tasks[e];
            if (t - s.offset - s.last >= s.duration) {
                const r = t - s.start;
                s.func(r), s.last = t
            }
        }
    }
    destroy() {
        Gt.system.remove(this._update, this), this._tasks.length = 0
    }
}
Yc.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "scheduler",
    priority: 0
};
let oh = !1;

function xx(i) {
    if (!oh) {
        if (X.get().getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
            const t = [`%c  %c  %c  %c  %c PixiJS %c v${Ni} (${i}) http://www.pixijs.com/

`, "background: #E72264; padding:5px 0;", "background: #6CA2EA; padding:5px 0;", "background: #B5D33D; padding:5px 0;", "background: #FED23F; padding:5px 0;", "color: #FFFFFF; background: #E72264; padding:5px 0;", "color: #E72264; background: #FFFFFF; padding:5px 0;"];
            globalThis.console.log(...t)
        } else globalThis.console && globalThis.console.log(`PixiJS ${Ni} - ${i} - http://www.pixijs.com/`);
        oh = !0
    }
}
class ro {
    constructor(t) {
        this._renderer = t
    }
    init(t) {
        if (t.hello) {
            let e = this._renderer.name;
            this._renderer.type === Vt.WEBGL && (e += ` ${this._renderer.context.webGLVersion}`), xx(e)
        }
    }
}
ro.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "hello",
    priority: -2
};
ro.defaultOptions = {
    hello: !1
};
const no = class $c {
    constructor(t) {
        this._renderer = t
    }
    init(t) {
        t = {
            ...$c.defaultOptions,
            ...t
        }, this.maxUnusedTime = t.renderableGCMaxUnusedTime
    }
    get enabled() {
        return U("8.15.0", "RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."), this._renderer.gc.enabled
    }
    set enabled(t) {
        U("8.15.0", "RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."), this._renderer.gc.enabled = t
    }
    addManagedHash(t, e) {
        U("8.15.0", "RenderableGCSystem.addManagedHash is deprecated, please use the GCSystem.addCollection instead."), this._renderer.gc.addCollection(t, e, "hash")
    }
    addManagedArray(t, e) {
        U("8.15.0", "RenderableGCSystem.addManagedArray is deprecated, please use the GCSystem.addCollection instead."), this._renderer.gc.addCollection(t, e, "array")
    }
    addRenderable(t) {
        U("8.15.0", "RenderableGCSystem.addRenderable is deprecated, please use the GCSystem instead."), this._renderer.gc.addResource(t, "renderable")
    }
    run() {
        U("8.15.0", "RenderableGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.run()
    }
    destroy() {
        this._renderer = null
    }
};
no.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "renderableGC",
    priority: 0
};
no.defaultOptions = {
    renderableGCActive: !0,
    renderableGCMaxUnusedTime: 6e4,
    renderableGCFrequency: 3e4
};
let yx = no;
const oo = class Bi {
    get count() {
        return this._renderer.tick
    }
    get checkCount() {
        return this._checkCount
    }
    set checkCount(t) {
        U("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._checkCount = t
    }
    get maxIdle() {
        return this._renderer.gc.maxUnusedTime / 1e3 * 60
    }
    set maxIdle(t) {
        U("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.maxUnusedTime = t / 60 * 1e3
    }
    get checkCountMax() {
        return Math.floor(this._renderer.gc._frequency / 1e3)
    }
    set checkCountMax(t) {
        U("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead.")
    }
    get active() {
        return this._renderer.gc.enabled
    }
    set active(t) {
        U("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.enabled = t
    }
    constructor(t) {
        this._renderer = t, this._checkCount = 0
    }
    init(t) {
        t.textureGCActive !== Bi.defaultOptions.textureGCActive && (this.active = t.textureGCActive), t.textureGCMaxIdle !== Bi.defaultOptions.textureGCMaxIdle && (this.maxIdle = t.textureGCMaxIdle), t.textureGCCheckCountMax !== Bi.defaultOptions.textureGCCheckCountMax && (this.checkCountMax = t.textureGCCheckCountMax)
    }
    run() {
        U("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.run()
    }
    destroy() {
        this._renderer = null
    }
};
oo.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem],
    name: "textureGC"
};
oo.defaultOptions = {
    textureGCActive: !0,
    textureGCAMaxIdle: null,
    textureGCMaxIdle: 60 * 60,
    textureGCCheckCountMax: 600
};
let bx = oo;
const jc = class qc {
    constructor(t = {}) {
        if (this.uid = pt("renderTarget"), this.colorTextures = [], this.dirtyId = 0, this.isRoot = !1, this._size = new Float32Array(2), this._managedColorTextures = !1, t = {
                ...qc.defaultOptions,
                ...t
            }, this.stencil = t.stencil, this.depth = t.depth, this.isRoot = t.isRoot, typeof t.colorTextures == "number") {
            this._managedColorTextures = !0;
            for (let e = 0; e < t.colorTextures; e++) this.colorTextures.push(new At({
                width: t.width,
                height: t.height,
                resolution: t.resolution,
                antialias: t.antialias
            }))
        } else {
            this.colorTextures = [...t.colorTextures.map(s => s.source)];
            const e = this.colorTexture.source;
            this.resize(e.width, e.height, e._resolution)
        }
        this.colorTexture.source.on("resize", this.onSourceResize, this), (t.depthStencilTexture || this.stencil) && (t.depthStencilTexture instanceof O || t.depthStencilTexture instanceof At ? this.depthStencilTexture = t.depthStencilTexture.source : this.ensureDepthStencilTexture())
    }
    get size() {
        const t = this._size;
        return t[0] = this.pixelWidth, t[1] = this.pixelHeight, t
    }
    get width() {
        return this.colorTexture.source.width
    }
    get height() {
        return this.colorTexture.source.height
    }
    get pixelWidth() {
        return this.colorTexture.source.pixelWidth
    }
    get pixelHeight() {
        return this.colorTexture.source.pixelHeight
    }
    get resolution() {
        return this.colorTexture.source._resolution
    }
    get colorTexture() {
        return this.colorTextures[0]
    }
    onSourceResize(t) {
        this.resize(t.width, t.height, t._resolution, !0)
    }
    ensureDepthStencilTexture() {
        this.depthStencilTexture || (this.depthStencilTexture = new At({
            width: this.width,
            height: this.height,
            resolution: this.resolution,
            format: "depth24plus-stencil8",
            autoGenerateMipmaps: !1,
            antialias: !1,
            mipLevelCount: 1
        }))
    }
    resize(t, e, s = this.resolution, r = !1) {
        this.dirtyId++, this.colorTextures.forEach((n, o) => {
            r && o === 0 || n.source.resize(t, e, s)
        }), this.depthStencilTexture && this.depthStencilTexture.source.resize(t, e, s)
    }
    destroy() {
        this.colorTexture.source.off("resize", this.onSourceResize, this), this._managedColorTextures && this.colorTextures.forEach(t => {
            t.destroy()
        }), this.depthStencilTexture && (this.depthStencilTexture.destroy(), delete this.depthStencilTexture)
    }
};
jc.defaultOptions = {
    width: 0,
    height: 0,
    resolution: 1,
    colorTextures: 1,
    stencil: !1,
    depth: !1,
    antialias: !1,
    isRoot: !1
};
let dn = jc;
const as = new Map;
bs.register(as);

function Kc(i, t) {
    if (!as.has(i)) {
        const e = new O({
                source: new re({
                    resource: i,
                    ...t
                })
            }),
            s = () => {
                as.get(i) === e && as.delete(i)
            };
        e.once("destroy", s), e.source.once("destroy", s), as.set(i, e)
    }
    return as.get(i)
}
const ao = class Zc {
    get autoDensity() {
        return this.texture.source.autoDensity
    }
    set autoDensity(t) {
        this.texture.source.autoDensity = t
    }
    get resolution() {
        return this.texture.source._resolution
    }
    set resolution(t) {
        this.texture.source.resize(this.texture.source.width, this.texture.source.height, t)
    }
    init(t) {
        t = {
            ...Zc.defaultOptions,
            ...t
        }, t.view && (U(at, "ViewSystem.view has been renamed to ViewSystem.canvas"), t.canvas = t.view), this.screen = new nt(0, 0, t.width, t.height), this.canvas = t.canvas || X.get().createCanvas(), this.antialias = !!t.antialias, this.texture = Kc(this.canvas, t), this.renderTarget = new dn({
            colorTextures: [this.texture],
            depth: !!t.depth,
            isRoot: !0
        }), this.texture.source.transparent = t.backgroundAlpha < 1, this.resolution = t.resolution
    }
    resize(t, e, s) {
        this.texture.source.resize(t, e, s), this.screen.width = this.texture.frame.width, this.screen.height = this.texture.frame.height
    }
    destroy(t = !1) {
        (typeof t == "boolean" ? t : !!(t != null && t.removeView)) && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas), this.texture.destroy()
    }
};
ao.extension = {
    type: [w.WebGLSystem, w.WebGPUSystem, w.CanvasSystem],
    name: "view",
    priority: 0
};
ao.defaultOptions = {
    width: 800,
    height: 600,
    autoDensity: !1,
    antialias: !1
};
let vx = ao;
const ho = [lx, Xc, ro, vx, Nc, gx, bx, zc, cx, wl, yx, Yc],
    Qc = [Jn, jn, Qn, Zn, qn, Gc, Rc, Kn];

function wx(i, t, e, s, r, n) {
    const o = n ? 1 : -1;
    return i.identity(), i.a = 1 / s * 2, i.d = o * (1 / r * 2), i.tx = -1 - t * i.a, i.ty = -o - e * i.d, i
}

function Tx(i) {
    const t = i.colorTexture.source.resource;
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement && document.body.contains(t)
}
class lo {
    constructor(t) {
        this.rootViewPort = new nt, this.viewport = new nt, this.mipLevel = 0, this.layer = 0, this.onRenderTargetChange = new xl("onRenderTargetChange"), this.projectionMatrix = new N, this.defaultClearColor = [0, 0, 0, 0], this._renderSurfaceToRenderTargetHash = new Map, this._gpuRenderTargetHash = Object.create(null), this._renderTargetStack = [], this._renderer = t, t.gc.addCollection(this, "_gpuRenderTargetHash", "hash")
    }
    finishRenderPass() {
        this.adaptor.finishRenderPass(this.renderTarget)
    }
    renderStart({
        target: t,
        clear: e,
        clearColor: s,
        frame: r,
        mipLevel: n,
        layer: o
    }) {
        var a, h;
        this._renderTargetStack.length = 0, this.push(t, e, s, r, n ?? 0, o ?? 0), this.rootViewPort.copyFrom(this.viewport), this.rootRenderTarget = this.renderTarget, this.renderingToScreen = Tx(this.rootRenderTarget), (h = (a = this.adaptor).prerender) == null || h.call(a, this.rootRenderTarget)
    }
    postrender() {
        var t, e;
        (e = (t = this.adaptor).postrender) == null || e.call(t, this.rootRenderTarget)
    }
    bind(t, e = !0, s, r, n = 0, o = 0) {
        const a = this.getRenderTarget(t),
            h = this.renderTarget !== a;
        this.renderTarget = a, this.renderSurface = t;
        const l = this.getGpuRenderTarget(a);
        (a.pixelWidth !== l.width || a.pixelHeight !== l.height) && (this.adaptor.resizeGpuRenderTarget(a), l.width = a.pixelWidth, l.height = a.pixelHeight);
        const c = a.colorTexture,
            u = this.viewport,
            d = c.arrayLayerCount || 1;
        if ((o | 0) !== o && (o |= 0), o < 0 || o >= d) throw new Error(`[RenderTargetSystem] layer ${o} is out of bounds (arrayLayerCount=${d}).`);
        this.mipLevel = n | 0, this.layer = o | 0;
        const f = Math.max(c.pixelWidth >> n, 1),
            p = Math.max(c.pixelHeight >> n, 1);
        if (!r && t instanceof O && (r = t.frame), r) {
            const m = c._resolution,
                g = 1 << Math.max(n | 0, 0),
                _ = r.x * m + .5 | 0,
                x = r.y * m + .5 | 0,
                b = r.width * m + .5 | 0,
                y = r.height * m + .5 | 0;
            let S = Math.floor(_ / g),
                v = Math.floor(x / g),
                T = Math.ceil(b / g),
                M = Math.ceil(y / g);
            S = Math.min(Math.max(S, 0), f - 1), v = Math.min(Math.max(v, 0), p - 1), T = Math.min(Math.max(T, 1), f - S), M = Math.min(Math.max(M, 1), p - v), u.x = S, u.y = v, u.width = T, u.height = M
        } else u.x = 0, u.y = 0, u.width = f, u.height = p;
        return wx(this.projectionMatrix, 0, 0, u.width / c.resolution, u.height / c.resolution, !a.isRoot), this.adaptor.startRenderPass(a, e, s, u, n, o), h && this.onRenderTargetChange.emit(a), a
    }
    clear(t, e = Nt.ALL, s, r = this.mipLevel, n = this.layer) {
        e && (t && (t = this.getRenderTarget(t)), this.adaptor.clear(t || this.renderTarget, e, s, this.viewport, r, n))
    }
    contextChange() {
        this._gpuRenderTargetHash = Object.create(null)
    }
    push(t, e = Nt.ALL, s, r, n = 0, o = 0) {
        const a = this.bind(t, e, s, r, n, o);
        return this._renderTargetStack.push({
            renderTarget: a,
            frame: r,
            mipLevel: n,
            layer: o
        }), a
    }
    pop() {
        this._renderTargetStack.pop();
        const t = this._renderTargetStack[this._renderTargetStack.length - 1];
        this.bind(t.renderTarget, !1, null, t.frame, t.mipLevel, t.layer)
    }
    getRenderTarget(t) {
        return t.isTexture && (t = t.source), this._renderSurfaceToRenderTargetHash.get(t) ?? this._initRenderTarget(t)
    }
    copyToTexture(t, e, s, r, n) {
        s.x < 0 && (r.width += s.x, n.x -= s.x, s.x = 0), s.y < 0 && (r.height += s.y, n.y -= s.y, s.y = 0);
        const {
            pixelWidth: o,
            pixelHeight: a
        } = t;
        return r.width = Math.min(r.width, o - s.x), r.height = Math.min(r.height, a - s.y), this.adaptor.copyToTexture(t, e, s, r, n)
    }
    ensureDepthStencil() {
        this.renderTarget.stencil || (this.renderTarget.stencil = !0, this.adaptor.startRenderPass(this.renderTarget, !1, null, this.viewport, 0, this.layer))
    }
    destroy() {
        this._renderer = null, this._renderSurfaceToRenderTargetHash.forEach((t, e) => {
            t !== e && t.destroy()
        }), this._renderSurfaceToRenderTargetHash.clear(), this._gpuRenderTargetHash = Object.create(null)
    }
    _initRenderTarget(t) {
        let e = null;
        return re.test(t) && (t = Kc(t).source), t instanceof dn ? e = t : t instanceof At && (e = new dn({
            colorTextures: [t]
        }), t.source instanceof re && (e.isRoot = !0), t.once("destroy", () => {
            e.destroy(), this._renderSurfaceToRenderTargetHash.delete(t);
            const s = this._gpuRenderTargetHash[e.uid];
            s && (this._gpuRenderTargetHash[e.uid] = null, this.adaptor.destroyGpuRenderTarget(s))
        })), this._renderSurfaceToRenderTargetHash.set(t, e), e
    }
    getGpuRenderTarget(t) {
        return this._gpuRenderTargetHash[t.uid] || (this._gpuRenderTargetHash[t.uid] = this.adaptor.initGpuRenderTarget(t))
    }
    resetState() {
        this.renderTarget = null, this.renderSurface = null
    }
}
class Sx {
    init(t, e) {
        this._renderer = t, this._renderTargetSystem = e
    }
    initGpuRenderTarget(t) {
        const e = t.colorTexture,
            {
                canvas: s,
                context: r
            } = this._ensureCanvas(e);
        return {
            canvas: s,
            context: r,
            width: s.width,
            height: s.height
        }
    }
    resizeGpuRenderTarget(t) {
        const e = t.colorTexture,
            {
                canvas: s
            } = this._ensureCanvas(e);
        s.width = t.pixelWidth, s.height = t.pixelHeight
    }
    startRenderPass(t, e, s, r) {
        const n = this._renderTargetSystem.getGpuRenderTarget(t);
        this._renderer.canvasContext.activeContext = n.context, this._renderer.canvasContext.activeResolution = t.resolution, e && this.clear(t, e, s, r)
    }
    clear(t, e, s, r) {
        const o = this._renderTargetSystem.getGpuRenderTarget(t).context,
            a = r || {
                x: 0,
                y: 0,
                width: t.pixelWidth,
                height: t.pixelHeight
            };
        if (o.setTransform(1, 0, 0, 1, 0, 0), o.clearRect(a.x, a.y, a.width, a.height), s) {
            const h = lt.shared.setValue(s);
            h.alpha > 0 && (o.globalAlpha = h.alpha, o.fillStyle = h.toHex(), o.fillRect(a.x, a.y, a.width, a.height), o.globalAlpha = 1)
        }
    }
    finishRenderPass() {}
    copyToTexture(t, e, s, r, n) {
        const a = this._renderTargetSystem.getGpuRenderTarget(t).canvas,
            h = e.source,
            {
                context: l
            } = this._ensureCanvas(h),
            c = (n == null ? void 0 : n.x) ?? 0,
            u = (n == null ? void 0 : n.y) ?? 0;
        return l.drawImage(a, s.x, s.y, r.width, r.height, c, u, r.width, r.height), h.update(), e
    }
    destroyGpuRenderTarget(t) {}
    _ensureCanvas(t) {
        let e = t.resource;
        (!e || !re.test(e)) && (e = X.get().createCanvas(t.pixelWidth, t.pixelHeight), t.resource = e), (e.width !== t.pixelWidth || e.height !== t.pixelHeight) && (e.width = t.pixelWidth, e.height = t.pixelHeight);
        const s = e.getContext("2d");
        return {
            canvas: e,
            context: s
        }
    }
}
class Jc extends lo {
    constructor(t) {
        super(t), this.adaptor = new Sx, this.adaptor.init(t, this)
    }
}
Jc.extension = {
    type: [w.CanvasSystem],
    name: "renderTarget"
};
class tu {
    constructor(t) {}
    init() {}
    initSource(t) {}
    generateCanvas(t) {
        const e = X.get().createCanvas(),
            s = e.getContext("2d"),
            r = it.getCanvasSource(t);
        if (!r) return e;
        const n = t.frame,
            o = t.source._resolution ?? t.source.resolution ?? 1,
            a = n.x * o,
            h = n.y * o,
            l = n.width * o,
            c = n.height * o;
        return e.width = Math.ceil(l), e.height = Math.ceil(c), s.drawImage(r, a, h, l, c, 0, 0, l, c), e
    }
    getPixels(t) {
        const e = this.generateCanvas(t);
        return {
            pixels: e.getContext("2d", {
                willReadFrequently: !0
            }).getImageData(0, 0, e.width, e.height).data,
            width: e.width,
            height: e.height
        }
    }
    destroy() {}
}
tu.extension = {
    type: [w.CanvasSystem],
    name: "texture"
};
const Cx = [...ho, Fc, Oc, tu, Jc],
    Ax = [Jn, jn, Qn, Zn, qn, Ic, kc, Kn],
    Px = [H_, Lc],
    eu = [],
    su = [],
    iu = [];
Y.handleByNamedList(w.CanvasSystem, eu);
Y.handleByNamedList(w.CanvasPipes, su);
Y.handleByNamedList(w.CanvasPipesAdaptor, iu);
Y.add(...Cx, ...Ax, ...Px);
class Ex extends ri {
    constructor() {
        const t = {
            name: "canvas",
            type: Vt.CANVAS,
            systems: eu,
            renderPipes: su,
            renderPipeAdaptors: iu
        };
        super(t)
    }
}
const Mx = Object.freeze(Object.defineProperty({
    __proto__: null,
    CanvasRenderer: Ex
}, Symbol.toStringTag, {
    value: "Module"
}));
var Ii = (i => (i[i.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", i[i.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", i[i.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER", i))(Ii || {});
class kx {
    constructor(t, e) {
        this._lastBindBaseLocation = -1, this._lastBindCallId = -1, this.buffer = t || null, this.updateID = -1, this.byteLength = -1, this.type = e
    }
    destroy() {
        this.buffer = null, this.updateID = -1, this.byteLength = -1, this.type = -1, this._lastBindBaseLocation = -1, this._lastBindCallId = -1
    }
}
class ru {
    constructor(t) {
        this._boundBufferBases = Object.create(null), this._minBaseLocation = 0, this._nextBindBaseIndex = this._minBaseLocation, this._bindCallId = 0, this._renderer = t, this._managedBuffers = new oe({
            renderer: t,
            type: "resource",
            onUnload: this.onBufferUnload.bind(this),
            name: "glBuffer"
        })
    }
    destroy() {
        this._managedBuffers.destroy(), this._renderer = null, this._gl = null, this._boundBufferBases = {}
    }
    contextChange() {
        this._gl = this._renderer.gl, this.destroyAll(!0), this._maxBindings = this._renderer.limits.maxUniformBindings
    }
    getGlBuffer(t) {
        return t._gcLastUsed = this._renderer.gc.now, t._gpuData[this._renderer.uid] || this.createGLBuffer(t)
    }
    bind(t) {
        const {
            _gl: e
        } = this, s = this.getGlBuffer(t);
        e.bindBuffer(s.type, s.buffer)
    }
    bindBufferBase(t, e) {
        const {
            _gl: s
        } = this;
        this._boundBufferBases[e] !== t && (this._boundBufferBases[e] = t, t._lastBindBaseLocation = e, s.bindBufferBase(s.UNIFORM_BUFFER, e, t.buffer))
    }
    nextBindBase(t) {
        this._bindCallId++, this._minBaseLocation = 0, t && (this._boundBufferBases[0] = null, this._minBaseLocation = 1, this._nextBindBaseIndex < 1 && (this._nextBindBaseIndex = 1))
    }
    freeLocationForBufferBase(t) {
        let e = this.getLastBindBaseLocation(t);
        if (e >= this._minBaseLocation) return t._lastBindCallId = this._bindCallId, e;
        let s = 0,
            r = this._nextBindBaseIndex;
        for (; s < 2;) {
            r >= this._maxBindings && (r = this._minBaseLocation, s++);
            const n = this._boundBufferBases[r];
            if (n && n._lastBindCallId === this._bindCallId) {
                r++;
                continue
            }
            break
        }
        return e = r, this._nextBindBaseIndex = r + 1, s >= 2 ? -1 : (t._lastBindCallId = this._bindCallId, this._boundBufferBases[e] = null, e)
    }
    getLastBindBaseLocation(t) {
        const e = t._lastBindBaseLocation;
        return this._boundBufferBases[e] === t ? e : -1
    }
    bindBufferRange(t, e, s, r) {
        const {
            _gl: n
        } = this;
        s || (s = 0), e || (e = 0), this._boundBufferBases[e] = null, n.bindBufferRange(n.UNIFORM_BUFFER, e || 0, t.buffer, s * 256, r || 256)
    }
    updateBuffer(t) {
        const {
            _gl: e
        } = this, s = this.getGlBuffer(t);
        if (t._updateID === s.updateID) return s;
        s.updateID = t._updateID, e.bindBuffer(s.type, s.buffer);
        const r = t.data,
            n = t.descriptor.usage & gt.STATIC ? e.STATIC_DRAW : e.DYNAMIC_DRAW;
        return r ? s.byteLength >= r.byteLength ? e.bufferSubData(s.type, 0, r, 0, t._updateSize / r.BYTES_PER_ELEMENT) : (s.byteLength = r.byteLength, e.bufferData(s.type, r, n)) : (s.byteLength = t.descriptor.size, e.bufferData(s.type, s.byteLength, n)), s
    }
    destroyAll(t = !1) {
        this._managedBuffers.removeAll(t)
    }
    onBufferUnload(t, e = !1) {
        const s = t._gpuData[this._renderer.uid];
        s && (e || this._gl.deleteBuffer(s.buffer))
    }
    createGLBuffer(t) {
        const {
            _gl: e
        } = this;
        let s = Ii.ARRAY_BUFFER;
        t.descriptor.usage & gt.INDEX ? s = Ii.ELEMENT_ARRAY_BUFFER : t.descriptor.usage & gt.UNIFORM && (s = Ii.UNIFORM_BUFFER);
        const r = new kx(e.createBuffer(), s);
        return t._gpuData[this._renderer.uid] = r, this._managedBuffers.add(t), r
    }
    resetState() {
        this._boundBufferBases = Object.create(null)
    }
}
ru.extension = {
    type: [w.WebGLSystem],
    name: "buffer"
};
const co = class nu {
    constructor(t) {
        this.supports = {
            uint32Indices: !0,
            uniformBufferObject: !0,
            vertexArrayObject: !0,
            srgbTextures: !0,
            nonPowOf2wrapping: !0,
            msaa: !0,
            nonPowOf2mipmaps: !0
        }, this._renderer = t, this.extensions = Object.create(null), this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this)
    }
    get isLost() {
        return !this.gl || this.gl.isContextLost()
    }
    contextChange(t) {
        this.gl = t, this._renderer.gl = t
    }
    init(t) {
        t = {
            ...nu.defaultOptions,
            ...t
        };
        let e = this.multiView = t.multiView;
        if (t.context && e && (V("Renderer created with both a context and multiview enabled. Disabling multiView as both cannot work together."), e = !1), e ? this.canvas = X.get().createCanvas(this._renderer.canvas.width, this._renderer.canvas.height) : this.canvas = this._renderer.view.canvas, t.context) this.initFromContext(t.context);
        else {
            const s = this._renderer.background.alpha < 1,
                r = t.premultipliedAlpha ?? !0,
                n = t.antialias && !this._renderer.backBuffer.useBackBuffer;
            this.createContext(t.preferWebGLVersion, {
                alpha: s,
                premultipliedAlpha: r,
                antialias: n,
                stencil: !0,
                preserveDrawingBuffer: t.preserveDrawingBuffer,
                powerPreference: t.powerPreference ?? "default"
            })
        }
    }
    ensureCanvasSize(t) {
        if (!this.multiView) {
            t !== this.canvas && V("multiView is disabled, but targetCanvas is not the main canvas");
            return
        }
        const {
            canvas: e
        } = this;
        (e.width < t.width || e.height < t.height) && (e.width = Math.max(t.width, t.width), e.height = Math.max(t.height, t.height))
    }
    initFromContext(t) {
        this.gl = t, this.webGLVersion = t instanceof X.get().getWebGLRenderingContext() ? 1 : 2, this.getExtensions(), this.validateContext(t), this._renderer.runners.contextChange.emit(t);
        const e = this._renderer.view.canvas;
        e.addEventListener("webglcontextlost", this.handleContextLost, !1), e.addEventListener("webglcontextrestored", this.handleContextRestored, !1)
    }
    createContext(t, e) {
        let s;
        const r = this.canvas;
        if (t === 2 && (s = r.getContext("webgl2", e)), !s && (s = r.getContext("webgl", e), !s)) throw new Error("This browser does not support WebGL. Try using the canvas renderer");
        this.gl = s, this.initFromContext(this.gl)
    }
    getExtensions() {
        const {
            gl: t
        } = this, e = {
            anisotropicFiltering: t.getExtension("EXT_texture_filter_anisotropic"),
            floatTextureLinear: t.getExtension("OES_texture_float_linear"),
            s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
            etc: t.getExtension("WEBGL_compressed_texture_etc"),
            etc1: t.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc: t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            atc: t.getExtension("WEBGL_compressed_texture_atc"),
            astc: t.getExtension("WEBGL_compressed_texture_astc"),
            bptc: t.getExtension("EXT_texture_compression_bptc"),
            rgtc: t.getExtension("EXT_texture_compression_rgtc"),
            loseContext: t.getExtension("WEBGL_lose_context")
        };
        if (this.webGLVersion === 1) this.extensions = {
            ...e,
            drawBuffers: t.getExtension("WEBGL_draw_buffers"),
            depthTexture: t.getExtension("WEBGL_depth_texture"),
            vertexArrayObject: t.getExtension("OES_vertex_array_object") || t.getExtension("MOZ_OES_vertex_array_object") || t.getExtension("WEBKIT_OES_vertex_array_object"),
            uint32ElementIndex: t.getExtension("OES_element_index_uint"),
            floatTexture: t.getExtension("OES_texture_float"),
            floatTextureLinear: t.getExtension("OES_texture_float_linear"),
            textureHalfFloat: t.getExtension("OES_texture_half_float"),
            textureHalfFloatLinear: t.getExtension("OES_texture_half_float_linear"),
            vertexAttribDivisorANGLE: t.getExtension("ANGLE_instanced_arrays"),
            srgb: t.getExtension("EXT_sRGB")
        };
        else {
            this.extensions = {
                ...e,
                colorBufferFloat: t.getExtension("EXT_color_buffer_float")
            };
            const s = t.getExtension("WEBGL_provoking_vertex");
            s && s.provokingVertexWEBGL(s.FIRST_VERTEX_CONVENTION_WEBGL)
        }
    }
    handleContextLost(t) {
        t.preventDefault(), this._contextLossForced && (this._contextLossForced = !1, setTimeout(() => {
            var e;
            this.gl.isContextLost() && ((e = this.extensions.loseContext) == null || e.restoreContext())
        }, 0))
    }
    handleContextRestored() {
        this.getExtensions(), this._renderer.runners.contextChange.emit(this.gl)
    }
    destroy() {
        var e;
        const t = this._renderer.view.canvas;
        this._renderer = null, t.removeEventListener("webglcontextlost", this.handleContextLost), t.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), (e = this.extensions.loseContext) == null || e.loseContext()
    }
    forceContextLoss() {
        var t;
        (t = this.extensions.loseContext) == null || t.loseContext(), this._contextLossForced = !0
    }
    validateContext(t) {
        const e = t.getContextAttributes();
        e && !e.stencil && V("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
        const s = this.supports,
            r = this.webGLVersion === 2,
            n = this.extensions;
        s.uint32Indices = r || !!n.uint32ElementIndex, s.uniformBufferObject = r, s.vertexArrayObject = r || !!n.vertexArrayObject, s.srgbTextures = r || !!n.srgb, s.nonPowOf2wrapping = r, s.nonPowOf2mipmaps = r, s.msaa = r, s.uint32Indices || V("Provided WebGL context does not support 32 index buffer, large scenes may not render correctly")
    }
};
co.extension = {
    type: [w.WebGLSystem],
    name: "context"
};
co.defaultOptions = {
    context: null,
    premultipliedAlpha: !0,
    preserveDrawingBuffer: !1,
    powerPreference: void 0,
    preferWebGLVersion: 2,
    multiView: !1
};
let Rx = co;

function ou(i, t) {
    for (const e in i.attributes) {
        const s = i.attributes[e],
            r = t[e];
        r ? (s.format ?? (s.format = r.format), s.offset ?? (s.offset = r.offset), s.instance ?? (s.instance = r.instance)) : V(`Attribute ${e} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)
    }
    Bx(i)
}

function Bx(i) {
    const {
        buffers: t,
        attributes: e
    } = i, s = {}, r = {};
    for (const n in t) {
        const o = t[n];
        s[o.uid] = 0, r[o.uid] = 0
    }
    for (const n in e) {
        const o = e[n];
        s[o.buffer.uid] += qs(o.format).stride
    }
    for (const n in e) {
        const o = e[n];
        o.stride ?? (o.stride = s[o.buffer.uid]), o.start ?? (o.start = r[o.buffer.uid]), r[o.buffer.uid] += qs(o.format).stride
    }
}
var fn = (i => (i[i.RGBA = 6408] = "RGBA", i[i.RGB = 6407] = "RGB", i[i.RG = 33319] = "RG", i[i.RED = 6403] = "RED", i[i.RGBA_INTEGER = 36249] = "RGBA_INTEGER", i[i.RGB_INTEGER = 36248] = "RGB_INTEGER", i[i.RG_INTEGER = 33320] = "RG_INTEGER", i[i.RED_INTEGER = 36244] = "RED_INTEGER", i[i.ALPHA = 6406] = "ALPHA", i[i.LUMINANCE = 6409] = "LUMINANCE", i[i.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", i[i.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", i[i.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL", i))(fn || {}),
    uo = (i => (i[i.TEXTURE_2D = 3553] = "TEXTURE_2D", i[i.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", i[i.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", i[i.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", i[i.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", i[i.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", i[i.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", i[i.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", i[i.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z", i))(uo || {}),
    ot = (i => (i[i.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", i[i.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", i[i.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", i[i.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", i[i.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", i[i.UNSIGNED_INT = 5125] = "UNSIGNED_INT", i[i.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", i[i.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", i[i.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", i[i.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", i[i.BYTE = 5120] = "BYTE", i[i.SHORT = 5122] = "SHORT", i[i.INT = 5124] = "INT", i[i.FLOAT = 5126] = "FLOAT", i[i.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", i[i.HALF_FLOAT = 36193] = "HALF_FLOAT", i))(ot || {});
const ah = {
    uint8x2: ot.UNSIGNED_BYTE,
    uint8x4: ot.UNSIGNED_BYTE,
    sint8x2: ot.BYTE,
    sint8x4: ot.BYTE,
    unorm8x2: ot.UNSIGNED_BYTE,
    unorm8x4: ot.UNSIGNED_BYTE,
    snorm8x2: ot.BYTE,
    snorm8x4: ot.BYTE,
    uint16x2: ot.UNSIGNED_SHORT,
    uint16x4: ot.UNSIGNED_SHORT,
    sint16x2: ot.SHORT,
    sint16x4: ot.SHORT,
    unorm16x2: ot.UNSIGNED_SHORT,
    unorm16x4: ot.UNSIGNED_SHORT,
    snorm16x2: ot.SHORT,
    snorm16x4: ot.SHORT,
    float16x2: ot.HALF_FLOAT,
    float16x4: ot.HALF_FLOAT,
    float32: ot.FLOAT,
    float32x2: ot.FLOAT,
    float32x3: ot.FLOAT,
    float32x4: ot.FLOAT,
    uint32: ot.UNSIGNED_INT,
    uint32x2: ot.UNSIGNED_INT,
    uint32x3: ot.UNSIGNED_INT,
    uint32x4: ot.UNSIGNED_INT,
    sint32: ot.INT,
    sint32x2: ot.INT,
    sint32x3: ot.INT,
    sint32x4: ot.INT
};

function Ix(i) {
    return ah[i] ?? ah.float32
}
const Gx = {
    "point-list": 0,
    "line-list": 1,
    "line-strip": 3,
    "triangle-list": 4,
    "triangle-strip": 5
};
class Fx {
    constructor() {
        this.vaoCache = Object.create(null)
    }
    destroy() {
        this.vaoCache = Object.create(null)
    }
}
class au {
    constructor(t) {
        this._renderer = t, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this._managedGeometries = new oe({
            renderer: t,
            type: "resource",
            onUnload: this.onGeometryUnload.bind(this),
            name: "glGeometry"
        })
    }
    contextChange() {
        const t = this.gl = this._renderer.gl;
        if (!this._renderer.context.supports.vertexArrayObject) throw new Error("[PixiJS] Vertex Array Objects are not supported on this device");
        this.destroyAll(!0);
        const e = this._renderer.context.extensions.vertexArrayObject;
        e && (t.createVertexArray = () => e.createVertexArrayOES(), t.bindVertexArray = r => e.bindVertexArrayOES(r), t.deleteVertexArray = r => e.deleteVertexArrayOES(r));
        const s = this._renderer.context.extensions.vertexAttribDivisorANGLE;
        s && (t.drawArraysInstanced = (r, n, o, a) => {
            s.drawArraysInstancedANGLE(r, n, o, a)
        }, t.drawElementsInstanced = (r, n, o, a, h) => {
            s.drawElementsInstancedANGLE(r, n, o, a, h)
        }, t.vertexAttribDivisor = (r, n) => s.vertexAttribDivisorANGLE(r, n)), this._activeGeometry = null, this._activeVao = null
    }
    bind(t, e) {
        const s = this.gl;
        this._activeGeometry = t;
        const r = this.getVao(t, e);
        this._activeVao !== r && (this._activeVao = r, s.bindVertexArray(r)), this.updateBuffers()
    }
    resetState() {
        this.unbind()
    }
    updateBuffers() {
        const t = this._activeGeometry,
            e = this._renderer.buffer;
        for (let s = 0; s < t.buffers.length; s++) {
            const r = t.buffers[s];
            e.updateBuffer(r)
        }
        t._gcLastUsed = this._renderer.gc.now
    }
    checkCompatibility(t, e) {
        const s = t.attributes,
            r = e._attributeData;
        for (const n in r)
            if (!s[n]) throw new Error(`shader and geometry incompatible, geometry missing the "${n}" attribute`)
    }
    getSignature(t, e) {
        const s = t.attributes,
            r = e._attributeData,
            n = ["g", t.uid];
        for (const o in s) r[o] && n.push(o, r[o].location);
        return n.join("-")
    }
    getVao(t, e) {
        var s;
        return ((s = t._gpuData[this._renderer.uid]) == null ? void 0 : s.vaoCache[e._key]) || this.initGeometryVao(t, e)
    }
    initGeometryVao(t, e, s = !0) {
        const r = this._renderer.gl,
            n = this._renderer.buffer;
        this._renderer.shader._getProgramData(e), this.checkCompatibility(t, e);
        const o = this.getSignature(t, e);
        let a = t._gpuData[this._renderer.uid];
        a || (a = new Fx, t._gpuData[this._renderer.uid] = a, this._managedGeometries.add(t));
        const h = a.vaoCache;
        let l = h[o];
        if (l) return h[e._key] = l, l;
        ou(t, e._attributeData);
        const c = t.buffers;
        l = r.createVertexArray(), r.bindVertexArray(l);
        for (let u = 0; u < c.length; u++) {
            const d = c[u];
            n.bind(d)
        }
        return this.activateVao(t, e), h[e._key] = l, h[o] = l, r.bindVertexArray(null), l
    }
    onGeometryUnload(t, e = !1) {
        const s = t._gpuData[this._renderer.uid];
        if (!s) return;
        const r = s.vaoCache;
        if (!e)
            for (const n in r) this._activeVao !== r[n] && this.resetState(), this.gl.deleteVertexArray(r[n])
    }
    destroyAll(t = !1) {
        this._managedGeometries.removeAll(t)
    }
    activateVao(t, e) {
        var a;
        const s = this._renderer.gl,
            r = this._renderer.buffer,
            n = t.attributes;
        t.indexBuffer && r.bind(t.indexBuffer);
        let o = null;
        for (const h in n) {
            const l = n[h],
                c = l.buffer,
                u = r.getGlBuffer(c),
                d = e._attributeData[h];
            if (d) {
                o !== u && (r.bind(c), o = u);
                const f = d.location;
                s.enableVertexAttribArray(f);
                const p = qs(l.format),
                    m = Ix(l.format);
                if (((a = d.format) == null ? void 0 : a.substring(1, 4)) === "int" ? s.vertexAttribIPointer(f, p.size, m, l.stride, l.offset) : s.vertexAttribPointer(f, p.size, m, p.normalised, l.stride, l.offset), l.instance)
                    if (this.hasInstance) {
                        const g = l.divisor ?? 1;
                        s.vertexAttribDivisor(f, g)
                    } else throw new Error("geometry error, GPU Instancing is not supported on this device")
            }
        }
    }
    draw(t, e, s, r) {
        const {
            gl: n
        } = this._renderer, o = this._activeGeometry, a = Gx[t || o.topology];
        if (r ?? (r = o.instanceCount), o.indexBuffer) {
            const h = o.indexBuffer.data.BYTES_PER_ELEMENT,
                l = h === 2 ? n.UNSIGNED_SHORT : n.UNSIGNED_INT;
            r !== 1 ? n.drawElementsInstanced(a, e || o.indexBuffer.data.length, l, (s || 0) * h, r) : n.drawElements(a, e || o.indexBuffer.data.length, l, (s || 0) * h)
        } else r !== 1 ? n.drawArraysInstanced(a, s || 0, e || o.getSize(), r) : n.drawArrays(a, s || 0, e || o.getSize());
        return this
    }
    unbind() {
        this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null
    }
    destroy() {
        this._managedGeometries.destroy(), this._renderer = null, this.gl = null, this._activeVao = null, this._activeGeometry = null
    }
}
au.extension = {
    type: [w.WebGLSystem],
    name: "geometry"
};
const Ox = new Pn({
        attributes: {
            aPosition: [-1, -1, 3, -1, -1, 3]
        }
    }),
    fo = class hu {
        constructor(t) {
            this.useBackBuffer = !1, this._useBackBufferThisRender = !1, this._renderer = t
        }
        init(t = {}) {
            const {
                useBackBuffer: e,
                antialias: s
            } = {
                ...hu.defaultOptions,
                ...t
            };
            this.useBackBuffer = e, this._antialias = s, this._renderer.context.supports.msaa || (V("antialiasing, is not supported on when using the back buffer"), this._antialias = !1), this._state = _e.for2d();
            const r = new $e({
                vertex: `
                attribute vec2 aPosition;
                out vec2 vUv;

                void main() {
                    gl_Position = vec4(aPosition, 0.0, 1.0);

                    vUv = (aPosition + 1.0) / 2.0;

                    // flip dem UVs
                    vUv.y = 1.0 - vUv.y;
                }`,
                fragment: `
                in vec2 vUv;
                out vec4 finalColor;

                uniform sampler2D uTexture;

                void main() {
                    finalColor = texture(uTexture, vUv);
                }`,
                name: "big-triangle"
            });
            this._bigTriangleShader = new ge({
                glProgram: r,
                resources: {
                    uTexture: O.WHITE.source
                }
            })
        }
        renderStart(t) {
            const e = this._renderer.renderTarget.getRenderTarget(t.target);
            if (this._useBackBufferThisRender = this.useBackBuffer && !!e.isRoot, this._useBackBufferThisRender) {
                const s = this._renderer.renderTarget.getRenderTarget(t.target);
                this._targetTexture = s.colorTexture, t.target = this._getBackBufferTexture(s.colorTexture)
            }
        }
        renderEnd() {
            this._presentBackBuffer()
        }
        _presentBackBuffer() {
            const t = this._renderer;
            t.renderTarget.finishRenderPass(), this._useBackBufferThisRender && (t.renderTarget.bind(this._targetTexture, !1), this._bigTriangleShader.resources.uTexture = this._backBufferTexture.source, t.encoder.draw({
                geometry: Ox,
                shader: this._bigTriangleShader,
                state: this._state
            }))
        }
        _getBackBufferTexture(t) {
            return this._backBufferTexture = this._backBufferTexture || new O({
                source: new At({
                    width: t.width,
                    height: t.height,
                    resolution: t._resolution,
                    antialias: this._antialias
                })
            }), this._backBufferTexture.source.resize(t.width, t.height, t._resolution), this._backBufferTexture
        }
        destroy() {
            this._backBufferTexture && (this._backBufferTexture.destroy(), this._backBufferTexture = null)
        }
    };
fo.extension = {
    type: [w.WebGLSystem],
    name: "backBuffer",
    priority: 1
};
fo.defaultOptions = {
    useBackBuffer: !1
};
let Lx = fo;
class lu {
    constructor(t) {
        this._colorMaskCache = 15, this._renderer = t
    }
    setMask(t) {
        this._colorMaskCache !== t && (this._colorMaskCache = t, this._renderer.gl.colorMask(!!(t & 8), !!(t & 4), !!(t & 2), !!(t & 1)))
    }
}
lu.extension = {
    type: [w.WebGLSystem],
    name: "colorMask"
};
class cu {
    constructor(t) {
        this.commandFinished = Promise.resolve(), this._renderer = t
    }
    setGeometry(t, e) {
        this._renderer.geometry.bind(t, e.glProgram)
    }
    finishRenderPass() {}
    draw(t) {
        const e = this._renderer,
            {
                geometry: s,
                shader: r,
                state: n,
                skipSync: o,
                topology: a,
                size: h,
                start: l,
                instanceCount: c
            } = t;
        e.shader.bind(r, o), e.geometry.bind(s, e.shader._activeProgram), n && e.state.set(n), e.geometry.draw(a, h, l, c ?? s.instanceCount)
    }
    destroy() {
        this._renderer = null
    }
}
cu.extension = {
    type: [w.WebGLSystem],
    name: "encoder"
};
class uu {
    constructor(t) {
        this._renderer = t
    }
    contextChange() {
        const t = this._renderer.gl;
        this.maxTextures = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), this.maxBatchableTextures = kl(this.maxTextures, t);
        const e = this._renderer.context.webGLVersion === 2;
        this.maxUniformBindings = e ? t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS) : 0
    }
    destroy() {}
}
uu.extension = {
    type: [w.WebGLSystem],
    name: "limits"
};
class Dx {
    constructor() {
        this.width = -1, this.height = -1, this.msaa = !1, this._attachedMipLevel = 0, this._attachedLayer = 0, this.msaaRenderBuffer = []
    }
}
const Ee = [];
Ee[Ct.NONE] = void 0;
Ee[Ct.DISABLED] = {
    stencilWriteMask: 0,
    stencilReadMask: 0
};
Ee[Ct.RENDERING_MASK_ADD] = {
    stencilFront: {
        compare: "equal",
        passOp: "increment-clamp"
    },
    stencilBack: {
        compare: "equal",
        passOp: "increment-clamp"
    }
};
Ee[Ct.RENDERING_MASK_REMOVE] = {
    stencilFront: {
        compare: "equal",
        passOp: "decrement-clamp"
    },
    stencilBack: {
        compare: "equal",
        passOp: "decrement-clamp"
    }
};
Ee[Ct.MASK_ACTIVE] = {
    stencilWriteMask: 0,
    stencilFront: {
        compare: "equal",
        passOp: "keep"
    },
    stencilBack: {
        compare: "equal",
        passOp: "keep"
    }
};
Ee[Ct.INVERSE_MASK_ACTIVE] = {
    stencilWriteMask: 0,
    stencilFront: {
        compare: "not-equal",
        passOp: "keep"
    },
    stencilBack: {
        compare: "not-equal",
        passOp: "keep"
    }
};
class du {
    constructor(t) {
        this._stencilCache = {
            enabled: !1,
            stencilReference: 0,
            stencilMode: Ct.NONE
        }, this._renderTargetStencilState = Object.create(null), t.renderTarget.onRenderTargetChange.add(this)
    }
    contextChange(t) {
        this._gl = t, this._comparisonFuncMapping = {
            always: t.ALWAYS,
            never: t.NEVER,
            equal: t.EQUAL,
            "not-equal": t.NOTEQUAL,
            less: t.LESS,
            "less-equal": t.LEQUAL,
            greater: t.GREATER,
            "greater-equal": t.GEQUAL
        }, this._stencilOpsMapping = {
            keep: t.KEEP,
            zero: t.ZERO,
            replace: t.REPLACE,
            invert: t.INVERT,
            "increment-clamp": t.INCR,
            "decrement-clamp": t.DECR,
            "increment-wrap": t.INCR_WRAP,
            "decrement-wrap": t.DECR_WRAP
        }, this.resetState()
    }
    onRenderTargetChange(t) {
        if (this._activeRenderTarget === t) return;
        this._activeRenderTarget = t;
        let e = this._renderTargetStencilState[t.uid];
        e || (e = this._renderTargetStencilState[t.uid] = {
            stencilMode: Ct.DISABLED,
            stencilReference: 0
        }), this.setStencilMode(e.stencilMode, e.stencilReference)
    }
    resetState() {
        this._stencilCache.enabled = !1, this._stencilCache.stencilMode = Ct.NONE, this._stencilCache.stencilReference = 0
    }
    setStencilMode(t, e) {
        const s = this._renderTargetStencilState[this._activeRenderTarget.uid],
            r = this._gl,
            n = Ee[t],
            o = this._stencilCache;
        if (s.stencilMode = t, s.stencilReference = e, t === Ct.DISABLED) {
            this._stencilCache.enabled && (this._stencilCache.enabled = !1, r.disable(r.STENCIL_TEST));
            return
        }
        this._stencilCache.enabled || (this._stencilCache.enabled = !0, r.enable(r.STENCIL_TEST)), (t !== o.stencilMode || o.stencilReference !== e) && (o.stencilMode = t, o.stencilReference = e, r.stencilFunc(this._comparisonFuncMapping[n.stencilBack.compare], e, 255), r.stencilOp(r.KEEP, r.KEEP, this._stencilOpsMapping[n.stencilBack.passOp]))
    }
}
du.extension = {
    type: [w.WebGLSystem],
    name: "stencil"
};
class fu {
    constructor(t) {
        this._syncFunctionHash = Object.create(null), this._adaptor = t, this._systemCheck()
    }
    _systemCheck() {
        if (!fl()) throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")
    }
    ensureUniformGroup(t) {
        const e = this.getUniformGroupData(t);
        t.buffer || (t.buffer = new Ce({
            data: new Float32Array(e.layout.size / 4),
            usage: gt.UNIFORM | gt.COPY_DST
        }))
    }
    getUniformGroupData(t) {
        return this._syncFunctionHash[t._signature] || this._initUniformGroup(t)
    }
    _initUniformGroup(t) {
        const e = t._signature;
        let s = this._syncFunctionHash[e];
        if (!s) {
            const r = Object.keys(t.uniformStructures).map(a => t.uniformStructures[a]),
                n = this._adaptor.createUboElements(r),
                o = this._generateUboSync(n.uboElements);
            s = this._syncFunctionHash[e] = {
                layout: n,
                syncFunction: o
            }
        }
        return this._syncFunctionHash[e]
    }
    _generateUboSync(t) {
        return this._adaptor.generateUboSync(t)
    }
    syncUniformGroup(t, e, s) {
        const r = this.getUniformGroupData(t);
        t.buffer || (t.buffer = new Ce({
            data: new Float32Array(r.layout.size / 4),
            usage: gt.UNIFORM | gt.COPY_DST
        }));
        let n = null;
        return e || (e = t.buffer.data, n = t.buffer.dataInt32), s || (s = 0), r.syncFunction(t.uniforms, e, n, s), !0
    }
    updateUniformGroup(t) {
        if (t.isStatic && !t._dirtyId) return !1;
        t._dirtyId = 0;
        const e = this.syncUniformGroup(t);
        return t.buffer.update(), e
    }
    destroy() {
        this._syncFunctionHash = null
    }
}
const pu = {
    f32: 4,
    i32: 4,
    "vec2<f32>": 8,
    "vec3<f32>": 12,
    "vec4<f32>": 16,
    "vec2<i32>": 8,
    "vec3<i32>": 12,
    "vec4<i32>": 16,
    "mat2x2<f32>": 16 * 2,
    "mat3x3<f32>": 16 * 3,
    "mat4x4<f32>": 16 * 4
};

function Ux(i) {
    const t = i.map(n => ({
            data: n,
            offset: 0,
            size: 0
        })),
        e = 16;
    let s = 0,
        r = 0;
    for (let n = 0; n < t.length; n++) {
        const o = t[n];
        if (s = pu[o.data.type], !s) throw new Error(`Unknown type ${o.data.type}`);
        o.data.size > 1 && (s = Math.max(s, e) * o.data.size);
        const a = s === 12 ? 16 : s;
        o.size = s;
        const h = r % e;
        h > 0 && e - h < a ? r += (e - h) % 16 : r += (s - h % s) % s, o.offset = r, r += s
    }
    return r = Math.ceil(r / 16) * 16, {
        uboElements: t,
        size: r
    }
}
const We = [{
    type: "mat3x3<f32>",
    test: i => i.value.a !== void 0,
    ubo: `
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,
    uniform: `
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `
}, {
    type: "vec4<f32>",
    test: i => i.type === "vec4<f32>" && i.size === 1 && i.value.width !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `
}, {
    type: "vec2<f32>",
    test: i => i.type === "vec2<f32>" && i.size === 1 && i.value.x !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `
}, {
    type: "vec4<f32>",
    test: i => i.type === "vec4<f32>" && i.size === 1 && i.value.red !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `
}, {
    type: "vec3<f32>",
    test: i => i.type === "vec3<f32>" && i.size === 1 && i.value.red !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `
}];

function mu(i, t, e, s) {
    const r = [`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];
    let n = 0;
    for (let a = 0; a < i.length; a++) {
        const h = i[a],
            l = h.data.name;
        let c = !1,
            u = 0;
        for (let d = 0; d < We.length; d++)
            if (We[d].test(h.data)) {
                u = h.offset / 4, r.push(`name = "${l}";`, `offset += ${u-n};`, We[d][t] || We[d].ubo), c = !0;
                break
            } if (!c)
            if (h.data.size > 1) u = h.offset / 4, r.push(e(h, u - n));
            else {
                const d = s[h.data.type];
                u = h.offset / 4, r.push(`
                    v = uv.${l};
                    offset += ${u-n};
                    ${d};
                `)
            } n = u
    }
    const o = r.join(`
`);
    return new Function("uv", "data", "dataInt32", "offset", o)
}

function is(i, t) {
    return `
        for (let i = 0; i < ${i*t}; i++) {
            data[offset + (((i / ${i})|0) * 4) + (i % ${i})] = v[i];
        }
    `
}
const gu = {
        f32: `
        data[offset] = v;`,
        i32: `
        dataInt32[offset] = v;`,
        "vec2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];`,
        "vec3<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,
        "vec4<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,
        "vec2<i32>": `
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,
        "vec3<i32>": `
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,
        "vec4<i32>": `
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,
        "mat2x2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,
        "mat3x3<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,
        "mat4x4<f32>": `
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,
        "mat3x2<f32>": is(3, 2),
        "mat4x2<f32>": is(4, 2),
        "mat2x3<f32>": is(2, 3),
        "mat4x3<f32>": is(4, 3),
        "mat2x4<f32>": is(2, 4),
        "mat3x4<f32>": is(3, 4)
    },
    Nx = {
        ...gu,
        "mat2x2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `
    };

function Wx(i, t) {
    const e = Math.max(pu[i.data.type] / 16, 1),
        s = i.data.value.length / i.data.size,
        r = (4 - s % 4) % 4,
        n = i.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
    return `
        v = uv.${i.data.name};
        offset += ${t};

        arrayOffset = offset;

        t = 0;

        for(var i=0; i < ${i.data.size*e}; i++)
        {
            for(var j = 0; j < ${s}; j++)
            {
                ${n}[arrayOffset++] = v[t++];
            }
            ${r!==0?`arrayOffset += ${r};`:""}
        }
    `
}

function Hx(i) {
    return mu(i, "uboStd40", Wx, gu)
}
class _u extends fu {
    constructor() {
        super({
            createUboElements: Ux,
            generateUboSync: Hx
        })
    }
}
_u.extension = {
    type: [w.WebGLSystem],
    name: "ubo"
};
class zx {
    constructor() {
        this._clearColorCache = [0, 0, 0, 0], this._viewPortCache = new nt
    }
    init(t, e) {
        this._renderer = t, this._renderTargetSystem = e, t.runners.contextChange.add(this)
    }
    contextChange() {
        this._clearColorCache = [0, 0, 0, 0], this._viewPortCache = new nt;
        const t = this._renderer.gl;
        this._drawBuffersCache = [];
        for (let e = 1; e <= 16; e++) this._drawBuffersCache[e] = Array.from({
            length: e
        }, (s, r) => t.COLOR_ATTACHMENT0 + r)
    }
    copyToTexture(t, e, s, r, n) {
        const o = this._renderTargetSystem,
            a = this._renderer,
            h = o.getGpuRenderTarget(t),
            l = a.gl;
        return this.finishRenderPass(t), l.bindFramebuffer(l.FRAMEBUFFER, h.resolveTargetFramebuffer), a.texture.bind(e, 0), l.copyTexSubImage2D(l.TEXTURE_2D, 0, n.x, n.y, s.x, s.y, r.width, r.height), e
    }
    startRenderPass(t, e = !0, s, r, n = 0, o = 0) {
        const a = this._renderTargetSystem,
            h = t.colorTexture,
            l = a.getGpuRenderTarget(t);
        if (o !== 0 && this._renderer.context.webGLVersion < 2) throw new Error("[RenderTargetSystem] Rendering to array layers requires WebGL2.");
        if (n > 0) {
            if (l.msaa) throw new Error("[RenderTargetSystem] Rendering to mip levels is not supported with MSAA render targets.");
            if (this._renderer.context.webGLVersion < 2) throw new Error("[RenderTargetSystem] Rendering to mip levels requires WebGL2.")
        }
        let c = r.y;
        t.isRoot && (c = h.pixelHeight - r.height - r.y), t.colorTextures.forEach(f => {
            this._renderer.texture.unbind(f)
        });
        const u = this._renderer.gl;
        u.bindFramebuffer(u.FRAMEBUFFER, l.framebuffer), !t.isRoot && (l._attachedMipLevel !== n || l._attachedLayer !== o) && (t.colorTextures.forEach((f, p) => {
            const m = this._renderer.texture.getGlSource(f);
            if (m.target === u.TEXTURE_2D) {
                if (o !== 0) throw new Error("[RenderTargetSystem] layer must be 0 when rendering to 2D textures in WebGL.");
                u.framebufferTexture2D(u.FRAMEBUFFER, u.COLOR_ATTACHMENT0 + p, u.TEXTURE_2D, m.texture, n)
            } else if (m.target === u.TEXTURE_2D_ARRAY) {
                if (this._renderer.context.webGLVersion < 2) throw new Error("[RenderTargetSystem] Rendering to 2D array textures requires WebGL2.");
                u.framebufferTextureLayer(u.FRAMEBUFFER, u.COLOR_ATTACHMENT0 + p, m.texture, n, o)
            } else if (m.target === u.TEXTURE_CUBE_MAP) {
                if (o < 0 || o > 5) throw new Error("[RenderTargetSystem] Cube map layer must be between 0 and 5.");
                u.framebufferTexture2D(u.FRAMEBUFFER, u.COLOR_ATTACHMENT0 + p, u.TEXTURE_CUBE_MAP_POSITIVE_X + o, m.texture, n)
            } else throw new Error("[RenderTargetSystem] Unsupported texture target for render-to-layer in WebGL.")
        }), l._attachedMipLevel = n, l._attachedLayer = o), t.colorTextures.length > 1 && this._setDrawBuffers(t, u);
        const d = this._viewPortCache;
        (d.x !== r.x || d.y !== c || d.width !== r.width || d.height !== r.height) && (d.x = r.x, d.y = c, d.width = r.width, d.height = r.height, u.viewport(r.x, c, r.width, r.height)), !l.depthStencilRenderBuffer && (t.stencil || t.depth) && this._initStencil(l), this.clear(t, e, s)
    }
    finishRenderPass(t) {
        const s = this._renderTargetSystem.getGpuRenderTarget(t);
        if (!s.msaa) return;
        const r = this._renderer.gl;
        r.bindFramebuffer(r.FRAMEBUFFER, s.resolveTargetFramebuffer), r.bindFramebuffer(r.READ_FRAMEBUFFER, s.framebuffer), r.blitFramebuffer(0, 0, s.width, s.height, 0, 0, s.width, s.height, r.COLOR_BUFFER_BIT, r.NEAREST), r.bindFramebuffer(r.FRAMEBUFFER, s.framebuffer)
    }
    initGpuRenderTarget(t) {
        const s = this._renderer.gl,
            r = new Dx;
        return r._attachedMipLevel = 0, r._attachedLayer = 0, t.colorTexture instanceof re ? (this._renderer.context.ensureCanvasSize(t.colorTexture.resource), r.framebuffer = null, r) : (this._initColor(t, r), s.bindFramebuffer(s.FRAMEBUFFER, null), r)
    }
    destroyGpuRenderTarget(t) {
        const e = this._renderer.gl;
        t.framebuffer && (e.deleteFramebuffer(t.framebuffer), t.framebuffer = null), t.resolveTargetFramebuffer && (e.deleteFramebuffer(t.resolveTargetFramebuffer), t.resolveTargetFramebuffer = null), t.depthStencilRenderBuffer && (e.deleteRenderbuffer(t.depthStencilRenderBuffer), t.depthStencilRenderBuffer = null), t.msaaRenderBuffer.forEach(s => {
            e.deleteRenderbuffer(s)
        }), t.msaaRenderBuffer = null
    }
    clear(t, e, s, r, n = 0, o = 0) {
        if (!e) return;
        if (o !== 0) throw new Error("[RenderTargetSystem] Clearing array layers is not supported in WebGL renderer.");
        const a = this._renderTargetSystem;
        typeof e == "boolean" && (e = e ? Nt.ALL : Nt.NONE);
        const h = this._renderer.gl;
        if (e & Nt.COLOR) {
            s ?? (s = a.defaultClearColor);
            const l = this._clearColorCache,
                c = s;
            (l[0] !== c[0] || l[1] !== c[1] || l[2] !== c[2] || l[3] !== c[3]) && (l[0] = c[0], l[1] = c[1], l[2] = c[2], l[3] = c[3], h.clearColor(c[0], c[1], c[2], c[3]))
        }
        h.clear(e)
    }
    resizeGpuRenderTarget(t) {
        if (t.isRoot) return;
        const s = this._renderTargetSystem.getGpuRenderTarget(t);
        this._resizeColor(t, s), (t.stencil || t.depth) && this._resizeStencil(s)
    }
    _initColor(t, e) {
        const s = this._renderer,
            r = s.gl,
            n = r.createFramebuffer();
        if (e.resolveTargetFramebuffer = n, r.bindFramebuffer(r.FRAMEBUFFER, n), e.width = t.colorTexture.source.pixelWidth, e.height = t.colorTexture.source.pixelHeight, t.colorTextures.forEach((a, h) => {
                const l = a.source;
                l.antialias && (s.context.supports.msaa ? e.msaa = !0 : V("[RenderTexture] Antialiasing on textures is not supported in WebGL1")), s.texture.bindSource(l, 0);
                const c = s.texture.getGlSource(l),
                    u = c.texture;
                if (c.target === r.TEXTURE_2D) r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + h, r.TEXTURE_2D, u, 0);
                else if (c.target === r.TEXTURE_2D_ARRAY) {
                    if (s.context.webGLVersion < 2) throw new Error("[RenderTargetSystem] TEXTURE_2D_ARRAY requires WebGL2.");
                    r.framebufferTextureLayer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + h, u, 0, 0)
                } else if (c.target === r.TEXTURE_CUBE_MAP) r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + h, r.TEXTURE_CUBE_MAP_POSITIVE_X, u, 0);
                else throw new Error("[RenderTargetSystem] Unsupported texture target for framebuffer attachment.")
            }), e.msaa) {
            const a = r.createFramebuffer();
            e.framebuffer = a, r.bindFramebuffer(r.FRAMEBUFFER, a), t.colorTextures.forEach((h, l) => {
                const c = r.createRenderbuffer();
                e.msaaRenderBuffer[l] = c
            })
        } else e.framebuffer = n;
        this._resizeColor(t, e)
    }
    _resizeColor(t, e) {
        const s = t.colorTexture.source;
        if (e.width = s.pixelWidth, e.height = s.pixelHeight, e._attachedMipLevel = 0, e._attachedLayer = 0, t.colorTextures.forEach((r, n) => {
                n !== 0 && r.source.resize(s.width, s.height, s._resolution)
            }), e.msaa) {
            const r = this._renderer,
                n = r.gl,
                o = e.framebuffer;
            n.bindFramebuffer(n.FRAMEBUFFER, o), t.colorTextures.forEach((a, h) => {
                const l = a.source;
                r.texture.bindSource(l, 0);
                const u = r.texture.getGlSource(l).internalFormat,
                    d = e.msaaRenderBuffer[h];
                n.bindRenderbuffer(n.RENDERBUFFER, d), n.renderbufferStorageMultisample(n.RENDERBUFFER, 4, u, l.pixelWidth, l.pixelHeight), n.framebufferRenderbuffer(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0 + h, n.RENDERBUFFER, d)
            })
        }
    }
    _initStencil(t) {
        if (t.framebuffer === null) return;
        const e = this._renderer.gl,
            s = e.createRenderbuffer();
        t.depthStencilRenderBuffer = s, e.bindRenderbuffer(e.RENDERBUFFER, s), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_STENCIL_ATTACHMENT, e.RENDERBUFFER, s), this._resizeStencil(t)
    }
    _resizeStencil(t) {
        const e = this._renderer.gl;
        e.bindRenderbuffer(e.RENDERBUFFER, t.depthStencilRenderBuffer), t.msaa ? e.renderbufferStorageMultisample(e.RENDERBUFFER, 4, e.DEPTH24_STENCIL8, t.width, t.height) : e.renderbufferStorage(e.RENDERBUFFER, this._renderer.context.webGLVersion === 2 ? e.DEPTH24_STENCIL8 : e.DEPTH_STENCIL, t.width, t.height)
    }
    prerender(t) {
        const e = t.colorTexture.resource;
        this._renderer.context.multiView && re.test(e) && this._renderer.context.ensureCanvasSize(e)
    }
    postrender(t) {
        if (this._renderer.context.multiView && re.test(t.colorTexture.resource)) {
            const e = this._renderer.context.canvas,
                s = t.colorTexture;
            s.context2D.drawImage(e, 0, s.pixelHeight - e.height)
        }
    }
    _setDrawBuffers(t, e) {
        const s = t.colorTextures.length,
            r = this._drawBuffersCache[s];
        if (this._renderer.context.webGLVersion === 1) {
            const n = this._renderer.context.extensions.drawBuffers;
            n ? n.drawBuffersWEBGL(r) : V("[RenderTexture] This WebGL1 context does not support rendering to multiple targets")
        } else e.drawBuffers(r)
    }
}
class xu extends lo {
    constructor(t) {
        super(t), this.adaptor = new zx, this.adaptor.init(t, this)
    }
}
xu.extension = {
    type: [w.WebGLSystem],
    name: "renderTarget"
};
class po extends Xt {
    constructor({
        buffer: t,
        offset: e,
        size: s
    }) {
        super(), this.uid = pt("buffer"), this._resourceType = "bufferResource", this._touched = 0, this._resourceId = pt("resource"), this._bufferResource = !0, this.destroyed = !1, this.buffer = t, this.offset = e | 0, this.size = s, this.buffer.on("change", this.onBufferChange, this)
    }
    onBufferChange() {
        this._resourceId = pt("resource"), this.emit("change", this)
    }
    destroy(t = !1) {
        this.destroyed = !0, t && this.buffer.destroy(), this.emit("change", this), this.buffer = null, this.removeAllListeners()
    }
}

function Vx(i, t) {
    const e = [],
        s = [`
        var g = s.groups;
        var sS = r.shader;
        var p = s.glProgram;
        var ugS = r.uniformGroup;
        var resources;
    `];
    let r = !1,
        n = 0;
    const o = t._getProgramData(i.glProgram);
    for (const h in i.groups) {
        const l = i.groups[h];
        e.push(`
            resources = g[${h}].resources;
        `);
        for (const c in l.resources) {
            const u = l.resources[c];
            if (u instanceof te)
                if (u.ubo) {
                    const d = i._uniformBindMap[h][Number(c)];
                    e.push(`
                        sS.bindUniformBlock(
                            resources[${c}],
                            '${d}',
                            ${i.glProgram._uniformBlockData[d].index}
                        );
                    `)
                } else e.push(`
                        ugS.updateUniformGroup(resources[${c}], p, sD);
                    `);
            else if (u instanceof po) {
                const d = i._uniformBindMap[h][Number(c)];
                e.push(`
                    sS.bindUniformBlock(
                        resources[${c}],
                        '${d}',
                        ${i.glProgram._uniformBlockData[d].index}
                    );
                `)
            } else if (u instanceof At) {
                const d = i._uniformBindMap[h][c],
                    f = o.uniformData[d];
                f && (r || (r = !0, s.push(`
                        var tS = r.texture;
                        `)), t._gl.uniform1i(f.location, n), e.push(`
                        tS.bind(resources[${c}], ${n});
                    `), n++)
            }
        }
    }
    const a = [...s, ...e].join(`
`);
    return new Function("r", "s", "sD", a)
}
class Xx {
    constructor(t, e) {
        this.program = t, this.uniformData = e, this.uniformGroups = {}, this.uniformDirtyGroups = {}, this.uniformBlockBindings = {}
    }
    destroy() {
        this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBlockBindings = null, this.program = null
    }
}

function hh(i, t, e) {
    const s = i.createShader(t);
    return i.shaderSource(s, e), i.compileShader(s), s
}

function kr(i) {
    const t = new Array(i);
    for (let e = 0; e < t.length; e++) t[e] = !1;
    return t
}

function yu(i, t) {
    switch (i) {
        case "float":
            return 0;
        case "vec2":
            return new Float32Array(2 * t);
        case "vec3":
            return new Float32Array(3 * t);
        case "vec4":
            return new Float32Array(4 * t);
        case "int":
        case "uint":
        case "sampler2D":
        case "sampler2DArray":
            return 0;
        case "ivec2":
            return new Int32Array(2 * t);
        case "ivec3":
            return new Int32Array(3 * t);
        case "ivec4":
            return new Int32Array(4 * t);
        case "uvec2":
            return new Uint32Array(2 * t);
        case "uvec3":
            return new Uint32Array(3 * t);
        case "uvec4":
            return new Uint32Array(4 * t);
        case "bool":
            return !1;
        case "bvec2":
            return kr(2 * t);
        case "bvec3":
            return kr(3 * t);
        case "bvec4":
            return kr(4 * t);
        case "mat2":
            return new Float32Array([1, 0, 0, 1]);
        case "mat3":
            return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        case "mat4":
            return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    }
    return null
}
let Ai = null;
const lh = {
        FLOAT: "float",
        FLOAT_VEC2: "vec2",
        FLOAT_VEC3: "vec3",
        FLOAT_VEC4: "vec4",
        INT: "int",
        INT_VEC2: "ivec2",
        INT_VEC3: "ivec3",
        INT_VEC4: "ivec4",
        UNSIGNED_INT: "uint",
        UNSIGNED_INT_VEC2: "uvec2",
        UNSIGNED_INT_VEC3: "uvec3",
        UNSIGNED_INT_VEC4: "uvec4",
        BOOL: "bool",
        BOOL_VEC2: "bvec2",
        BOOL_VEC3: "bvec3",
        BOOL_VEC4: "bvec4",
        FLOAT_MAT2: "mat2",
        FLOAT_MAT3: "mat3",
        FLOAT_MAT4: "mat4",
        SAMPLER_2D: "sampler2D",
        INT_SAMPLER_2D: "sampler2D",
        UNSIGNED_INT_SAMPLER_2D: "sampler2D",
        SAMPLER_CUBE: "samplerCube",
        INT_SAMPLER_CUBE: "samplerCube",
        UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
        SAMPLER_2D_ARRAY: "sampler2DArray",
        INT_SAMPLER_2D_ARRAY: "sampler2DArray",
        UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
    },
    Yx = {
        float: "float32",
        vec2: "float32x2",
        vec3: "float32x3",
        vec4: "float32x4",
        int: "sint32",
        ivec2: "sint32x2",
        ivec3: "sint32x3",
        ivec4: "sint32x4",
        uint: "uint32",
        uvec2: "uint32x2",
        uvec3: "uint32x3",
        uvec4: "uint32x4",
        bool: "uint32",
        bvec2: "uint32x2",
        bvec3: "uint32x3",
        bvec4: "uint32x4"
    };

function bu(i, t) {
    if (!Ai) {
        const e = Object.keys(lh);
        Ai = {};
        for (let s = 0; s < e.length; ++s) {
            const r = e[s];
            Ai[i[r]] = lh[r]
        }
    }
    return Ai[t]
}

function $x(i, t) {
    const e = bu(i, t);
    return Yx[e] || "float32"
}

function jx(i, t, e = !1) {
    const s = {},
        r = t.getProgramParameter(i, t.ACTIVE_ATTRIBUTES);
    for (let o = 0; o < r; o++) {
        const a = t.getActiveAttrib(i, o);
        if (a.name.startsWith("gl_")) continue;
        const h = $x(t, a.type);
        s[a.name] = {
            location: 0,
            format: h,
            stride: qs(h).stride,
            offset: 0,
            instance: !1,
            start: 0
        }
    }
    const n = Object.keys(s);
    if (e) {
        n.sort((o, a) => o > a ? 1 : -1);
        for (let o = 0; o < n.length; o++) s[n[o]].location = o, t.bindAttribLocation(i, o, n[o]);
        t.linkProgram(i)
    } else
        for (let o = 0; o < n.length; o++) s[n[o]].location = t.getAttribLocation(i, n[o]);
    return s
}

function qx(i, t) {
    if (!t.ACTIVE_UNIFORM_BLOCKS) return {};
    const e = {},
        s = t.getProgramParameter(i, t.ACTIVE_UNIFORM_BLOCKS);
    for (let r = 0; r < s; r++) {
        const n = t.getActiveUniformBlockName(i, r),
            o = t.getUniformBlockIndex(i, n),
            a = t.getActiveUniformBlockParameter(i, r, t.UNIFORM_BLOCK_DATA_SIZE);
        e[n] = {
            name: n,
            index: o,
            size: a
        }
    }
    return e
}

function Kx(i, t) {
    const e = {},
        s = t.getProgramParameter(i, t.ACTIVE_UNIFORMS);
    for (let r = 0; r < s; r++) {
        const n = t.getActiveUniform(i, r),
            o = n.name.replace(/\[.*?\]$/, ""),
            a = !!n.name.match(/\[.*?\]$/),
            h = bu(t, n.type);
        e[o] = {
            name: o,
            index: r,
            type: h,
            size: n.size,
            isArray: a,
            value: yu(h, n.size)
        }
    }
    return e
}

function ch(i, t) {
    const e = i.getShaderSource(t).split(`
`).map((l, c) => `${c}: ${l}`),
        s = i.getShaderInfoLog(t),
        r = s.split(`
`),
        n = {},
        o = r.map(l => parseFloat(l.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"))).filter(l => l && !n[l] ? (n[l] = !0, !0) : !1),
        a = [""];
    o.forEach(l => {
        e[l - 1] = `%c${e[l-1]}%c`, a.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px")
    });
    const h = e.join(`
`);
    a[0] = h, console.error(s), console.groupCollapsed("click to view full shader code"), console.warn(...a), console.groupEnd()
}

function Zx(i, t, e, s) {
    i.getProgramParameter(t, i.LINK_STATUS) || (i.getShaderParameter(e, i.COMPILE_STATUS) || ch(i, e), i.getShaderParameter(s, i.COMPILE_STATUS) || ch(i, s), console.error("PixiJS Error: Could not initialize shader."), i.getProgramInfoLog(t) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", i.getProgramInfoLog(t)))
}

function Qx(i, t) {
    const e = hh(i, i.VERTEX_SHADER, t.vertex),
        s = hh(i, i.FRAGMENT_SHADER, t.fragment),
        r = i.createProgram();
    i.attachShader(r, e), i.attachShader(r, s);
    const n = t.transformFeedbackVaryings;
    n && (typeof i.transformFeedbackVaryings != "function" ? V("TransformFeedback is not supported but TransformFeedbackVaryings are given.") : i.transformFeedbackVaryings(r, n.names, n.bufferMode === "separate" ? i.SEPARATE_ATTRIBS : i.INTERLEAVED_ATTRIBS)), i.linkProgram(r), i.getProgramParameter(r, i.LINK_STATUS) || Zx(i, r, e, s), t._attributeData = jx(r, i, !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(t.vertex)), t._uniformData = Kx(r, i), t._uniformBlockData = qx(r, i), i.deleteShader(e), i.deleteShader(s);
    const o = {};
    for (const h in t._uniformData) {
        const l = t._uniformData[h];
        o[h] = {
            location: i.getUniformLocation(r, h),
            value: yu(l.type, l.size)
        }
    }
    return new Xx(r, o)
}
const Pi = {
    textureCount: 0,
    blockIndex: 0
};
class vu {
    constructor(t) {
        this._activeProgram = null, this._programDataHash = Object.create(null), this._shaderSyncFunctions = Object.create(null), this._renderer = t
    }
    contextChange(t) {
        this._gl = t, this._programDataHash = Object.create(null), this._shaderSyncFunctions = Object.create(null), this._activeProgram = null
    }
    bind(t, e) {
        if (this._setProgram(t.glProgram), e) return;
        Pi.textureCount = 0, Pi.blockIndex = 0;
        let s = this._shaderSyncFunctions[t.glProgram._key];
        s || (s = this._shaderSyncFunctions[t.glProgram._key] = this._generateShaderSync(t, this)), this._renderer.buffer.nextBindBase(!!t.glProgram.transformFeedbackVaryings), s(this._renderer, t, Pi)
    }
    updateUniformGroup(t) {
        this._renderer.uniformGroup.updateUniformGroup(t, this._activeProgram, Pi)
    }
    bindUniformBlock(t, e, s = 0) {
        const r = this._renderer.buffer,
            n = this._getProgramData(this._activeProgram),
            o = t._bufferResource;
        o || this._renderer.ubo.updateUniformGroup(t);
        const a = t.buffer,
            h = r.updateBuffer(a),
            l = r.freeLocationForBufferBase(h);
        if (o) {
            const {
                offset: u,
                size: d
            } = t;
            u === 0 && d === a.data.byteLength ? r.bindBufferBase(h, l) : r.bindBufferRange(h, l, u)
        } else r.getLastBindBaseLocation(h) !== l && r.bindBufferBase(h, l);
        const c = this._activeProgram._uniformBlockData[e].index;
        n.uniformBlockBindings[s] !== l && (n.uniformBlockBindings[s] = l, this._renderer.gl.uniformBlockBinding(n.program, c, l))
    }
    _setProgram(t) {
        if (this._activeProgram === t) return;
        this._activeProgram = t;
        const e = this._getProgramData(t);
        this._gl.useProgram(e.program)
    }
    _getProgramData(t) {
        return this._programDataHash[t._key] || this._createProgramData(t)
    }
    _createProgramData(t) {
        const e = t._key;
        return this._programDataHash[e] = Qx(this._gl, t), this._programDataHash[e]
    }
    destroy() {
        for (const t of Object.keys(this._programDataHash)) this._programDataHash[t].destroy();
        this._programDataHash = null, this._shaderSyncFunctions = null, this._activeProgram = null, this._renderer = null, this._gl = null
    }
    _generateShaderSync(t, e) {
        return Vx(t, e)
    }
    resetState() {
        this._activeProgram = null
    }
}
vu.extension = {
    type: [w.WebGLSystem],
    name: "shader"
};
const Jx = {
        f32: `if (cv !== v) {
            cu.value = v;
            gl.uniform1f(location, v);
        }`,
        "vec2<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2f(location, v[0], v[1]);
        }`,
        "vec3<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3f(location, v[0], v[1], v[2]);
        }`,
        "vec4<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4f(location, v[0], v[1], v[2], v[3]);
        }`,
        i32: `if (cv !== v) {
            cu.value = v;
            gl.uniform1i(location, v);
        }`,
        "vec2<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(location, v[0], v[1]);
        }`,
        "vec3<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(location, v[0], v[1], v[2]);
        }`,
        "vec4<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(location, v[0], v[1], v[2], v[3]);
        }`,
        u32: `if (cv !== v) {
            cu.value = v;
            gl.uniform1ui(location, v);
        }`,
        "vec2<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2ui(location, v[0], v[1]);
        }`,
        "vec3<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3ui(location, v[0], v[1], v[2]);
        }`,
        "vec4<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
        }`,
        bool: `if (cv !== v) {
            cu.value = v;
            gl.uniform1i(location, v);
        }`,
        "vec2<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(location, v[0], v[1]);
        }`,
        "vec3<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(location, v[0], v[1], v[2]);
        }`,
        "vec4<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(location, v[0], v[1], v[2], v[3]);
        }`,
        "mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);",
        "mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);",
        "mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);"
    },
    ty = {
        f32: "gl.uniform1fv(location, v);",
        "vec2<f32>": "gl.uniform2fv(location, v);",
        "vec3<f32>": "gl.uniform3fv(location, v);",
        "vec4<f32>": "gl.uniform4fv(location, v);",
        "mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);",
        "mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);",
        "mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);",
        i32: "gl.uniform1iv(location, v);",
        "vec2<i32>": "gl.uniform2iv(location, v);",
        "vec3<i32>": "gl.uniform3iv(location, v);",
        "vec4<i32>": "gl.uniform4iv(location, v);",
        u32: "gl.uniform1iv(location, v);",
        "vec2<u32>": "gl.uniform2iv(location, v);",
        "vec3<u32>": "gl.uniform3iv(location, v);",
        "vec4<u32>": "gl.uniform4iv(location, v);",
        bool: "gl.uniform1iv(location, v);",
        "vec2<bool>": "gl.uniform2iv(location, v);",
        "vec3<bool>": "gl.uniform3iv(location, v);",
        "vec4<bool>": "gl.uniform4iv(location, v);"
    };

function ey(i, t) {
    const e = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
        var name = null;
    `];
    for (const s in i.uniforms) {
        if (!t[s]) {
            i.uniforms[s] instanceof te ? i.uniforms[s].ubo ? e.push(`
                        renderer.shader.bindUniformBlock(uv.${s}, "${s}");
                    `) : e.push(`
                        renderer.shader.updateUniformGroup(uv.${s});
                    `) : i.uniforms[s] instanceof po && e.push(`
                        renderer.shader.bindBufferResource(uv.${s}, "${s}");
                    `);
            continue
        }
        const r = i.uniformStructures[s];
        let n = !1;
        for (let o = 0; o < We.length; o++) {
            const a = We[o];
            if (r.type === a.type && a.test(r)) {
                e.push(`name = "${s}";`, We[o].uniform), n = !0;
                break
            }
        }
        if (!n) {
            const a = (r.size === 1 ? Jx : ty)[r.type].replace("location", `ud["${s}"].location`);
            e.push(`
            cu = ud["${s}"];
            cv = cu.value;
            v = uv["${s}"];
            ${a};`)
        }
    }
    return new Function("ud", "uv", "renderer", "syncData", e.join(`
`))
}
class wu {
    constructor(t) {
        this._cache = {}, this._uniformGroupSyncHash = {}, this._renderer = t, this.gl = null, this._cache = {}
    }
    contextChange(t) {
        this.gl = t
    }
    updateUniformGroup(t, e, s) {
        const r = this._renderer.shader._getProgramData(e);
        (!t.isStatic || t._dirtyId !== r.uniformDirtyGroups[t.uid]) && (r.uniformDirtyGroups[t.uid] = t._dirtyId, this._getUniformSyncFunction(t, e)(r.uniformData, t.uniforms, this._renderer, s))
    }
    _getUniformSyncFunction(t, e) {
        var s;
        return ((s = this._uniformGroupSyncHash[t._signature]) == null ? void 0 : s[e._key]) || this._createUniformSyncFunction(t, e)
    }
    _createUniformSyncFunction(t, e) {
        const s = this._uniformGroupSyncHash[t._signature] || (this._uniformGroupSyncHash[t._signature] = {}),
            r = this._getSignature(t, e._uniformData, "u");
        return this._cache[r] || (this._cache[r] = this._generateUniformsSync(t, e._uniformData)), s[e._key] = this._cache[r], s[e._key]
    }
    _generateUniformsSync(t, e) {
        return ey(t, e)
    }
    _getSignature(t, e, s) {
        const r = t.uniforms,
            n = [`${s}-`];
        for (const o in r) n.push(o), e[o] && n.push(e[o].type);
        return n.join("-")
    }
    destroy() {
        this._renderer = null, this._cache = null
    }
}
wu.extension = {
    type: [w.WebGLSystem],
    name: "uniformGroup"
};

function sy(i) {
    const t = {};
    if (t.normal = [i.ONE, i.ONE_MINUS_SRC_ALPHA], t.add = [i.ONE, i.ONE], t.multiply = [i.DST_COLOR, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA], t.screen = [i.ONE, i.ONE_MINUS_SRC_COLOR, i.ONE, i.ONE_MINUS_SRC_ALPHA], t.none = [0, 0], t["normal-npm"] = [i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA], t["add-npm"] = [i.SRC_ALPHA, i.ONE, i.ONE, i.ONE], t["screen-npm"] = [i.SRC_ALPHA, i.ONE_MINUS_SRC_COLOR, i.ONE, i.ONE_MINUS_SRC_ALPHA], t.erase = [i.ZERO, i.ONE_MINUS_SRC_ALPHA], !(i instanceof X.get().getWebGLRenderingContext())) t.min = [i.ONE, i.ONE, i.ONE, i.ONE, i.MIN, i.MIN], t.max = [i.ONE, i.ONE, i.ONE, i.ONE, i.MAX, i.MAX];
    else {
        const s = i.getExtension("EXT_blend_minmax");
        s && (t.min = [i.ONE, i.ONE, i.ONE, i.ONE, s.MIN_EXT, s.MIN_EXT], t.max = [i.ONE, i.ONE, i.ONE, i.ONE, s.MAX_EXT, s.MAX_EXT])
    }
    return t
}
const iy = 0,
    ry = 1,
    ny = 2,
    oy = 3,
    ay = 4,
    hy = 5,
    Tu = class pn {
        constructor(t) {
            this._invertFrontFace = !1, this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = "none", this._blendEq = !1, this.map = [], this.map[iy] = this.setBlend, this.map[ry] = this.setOffset, this.map[ny] = this.setCullFace, this.map[oy] = this.setDepthTest, this.map[ay] = this.setFrontFace, this.map[hy] = this.setDepthMask, this.checks = [], this.defaultState = _e.for2d(), t.renderTarget.onRenderTargetChange.add(this)
        }
        onRenderTargetChange(t) {
            this._invertFrontFace = !t.isRoot, this._cullFace ? this.setFrontFace(this._frontFace) : this._frontFaceDirty = !0
        }
        contextChange(t) {
            this.gl = t, this.blendModesMap = sy(t), this.resetState()
        }
        set(t) {
            if (t || (t = this.defaultState), this.stateId !== t.data) {
                let e = this.stateId ^ t.data,
                    s = 0;
                for (; e;) e & 1 && this.map[s].call(this, !!(t.data & 1 << s)), e >>= 1, s++;
                this.stateId = t.data
            }
            for (let e = 0; e < this.checks.length; e++) this.checks[e](this, t)
        }
        forceState(t) {
            t || (t = this.defaultState);
            for (let e = 0; e < this.map.length; e++) this.map[e].call(this, !!(t.data & 1 << e));
            for (let e = 0; e < this.checks.length; e++) this.checks[e](this, t);
            this.stateId = t.data
        }
        setBlend(t) {
            this._updateCheck(pn._checkBlendMode, t), this.gl[t ? "enable" : "disable"](this.gl.BLEND)
        }
        setOffset(t) {
            this._updateCheck(pn._checkPolygonOffset, t), this.gl[t ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL)
        }
        setDepthTest(t) {
            this.gl[t ? "enable" : "disable"](this.gl.DEPTH_TEST)
        }
        setDepthMask(t) {
            this.gl.depthMask(t)
        }
        setCullFace(t) {
            this._cullFace = t, this.gl[t ? "enable" : "disable"](this.gl.CULL_FACE), this._cullFace && this._frontFaceDirty && this.setFrontFace(this._frontFace)
        }
        setFrontFace(t) {
            this._frontFace = t, this._frontFaceDirty = !1;
            const e = this._invertFrontFace ? !t : t;
            this._glFrontFace !== e && (this._glFrontFace = e, this.gl.frontFace(this.gl[e ? "CW" : "CCW"]))
        }
        setBlendMode(t) {
            if (this.blendModesMap[t] || (t = "normal"), t === this.blendMode) return;
            this.blendMode = t;
            const e = this.blendModesMap[t],
                s = this.gl;
            e.length === 2 ? s.blendFunc(e[0], e[1]) : s.blendFuncSeparate(e[0], e[1], e[2], e[3]), e.length === 6 ? (this._blendEq = !0, s.blendEquationSeparate(e[4], e[5])) : this._blendEq && (this._blendEq = !1, s.blendEquationSeparate(s.FUNC_ADD, s.FUNC_ADD))
        }
        setPolygonOffset(t, e) {
            this.gl.polygonOffset(t, e)
        }
        resetState() {
            this._glFrontFace = !1, this._frontFace = !1, this._cullFace = !1, this._frontFaceDirty = !1, this._invertFrontFace = !1, this.gl.frontFace(this.gl.CCW), this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = "", this.setBlendMode("normal")
        }
        _updateCheck(t, e) {
            const s = this.checks.indexOf(t);
            e && s === -1 ? this.checks.push(t) : !e && s !== -1 && this.checks.splice(s, 1)
        }
        static _checkBlendMode(t, e) {
            t.setBlendMode(e.blendMode)
        }
        static _checkPolygonOffset(t, e) {
            t.setPolygonOffset(1, e.polygonOffset)
        }
        destroy() {
            this.gl = null, this.checks.length = 0
        }
    };
Tu.extension = {
    type: [w.WebGLSystem],
    name: "state"
};
let ly = Tu;
class cy {
    constructor(t) {
        this.target = uo.TEXTURE_2D, this._layerInitMask = 0, this.texture = t, this.width = -1, this.height = -1, this.type = ot.UNSIGNED_BYTE, this.internalFormat = fn.RGBA, this.format = fn.RGBA, this.samplerType = 0
    }
    destroy() {}
}
const uy = {
        id: "buffer",
        upload(i, t, e, s, r, n = !1) {
            const o = r || t.target;
            !n && t.width === i.width && t.height === i.height ? e.texSubImage2D(o, 0, 0, 0, i.width, i.height, t.format, t.type, i.resource) : e.texImage2D(o, 0, t.internalFormat, i.width, i.height, 0, t.format, t.type, i.resource), t.width = i.width, t.height = i.height
        }
    },
    dy = {
        "bc1-rgba-unorm": !0,
        "bc1-rgba-unorm-srgb": !0,
        "bc2-rgba-unorm": !0,
        "bc2-rgba-unorm-srgb": !0,
        "bc3-rgba-unorm": !0,
        "bc3-rgba-unorm-srgb": !0,
        "bc4-r-unorm": !0,
        "bc4-r-snorm": !0,
        "bc5-rg-unorm": !0,
        "bc5-rg-snorm": !0,
        "bc6h-rgb-ufloat": !0,
        "bc6h-rgb-float": !0,
        "bc7-rgba-unorm": !0,
        "bc7-rgba-unorm-srgb": !0,
        "etc2-rgb8unorm": !0,
        "etc2-rgb8unorm-srgb": !0,
        "etc2-rgb8a1unorm": !0,
        "etc2-rgb8a1unorm-srgb": !0,
        "etc2-rgba8unorm": !0,
        "etc2-rgba8unorm-srgb": !0,
        "eac-r11unorm": !0,
        "eac-r11snorm": !0,
        "eac-rg11unorm": !0,
        "eac-rg11snorm": !0,
        "astc-4x4-unorm": !0,
        "astc-4x4-unorm-srgb": !0,
        "astc-5x4-unorm": !0,
        "astc-5x4-unorm-srgb": !0,
        "astc-5x5-unorm": !0,
        "astc-5x5-unorm-srgb": !0,
        "astc-6x5-unorm": !0,
        "astc-6x5-unorm-srgb": !0,
        "astc-6x6-unorm": !0,
        "astc-6x6-unorm-srgb": !0,
        "astc-8x5-unorm": !0,
        "astc-8x5-unorm-srgb": !0,
        "astc-8x6-unorm": !0,
        "astc-8x6-unorm-srgb": !0,
        "astc-8x8-unorm": !0,
        "astc-8x8-unorm-srgb": !0,
        "astc-10x5-unorm": !0,
        "astc-10x5-unorm-srgb": !0,
        "astc-10x6-unorm": !0,
        "astc-10x6-unorm-srgb": !0,
        "astc-10x8-unorm": !0,
        "astc-10x8-unorm-srgb": !0,
        "astc-10x10-unorm": !0,
        "astc-10x10-unorm-srgb": !0,
        "astc-12x10-unorm": !0,
        "astc-12x10-unorm-srgb": !0,
        "astc-12x12-unorm": !0,
        "astc-12x12-unorm-srgb": !0
    },
    fy = {
        id: "compressed",
        upload(i, t, e, s, r, n) {
            const o = r ?? t.target;
            e.pixelStorei(e.UNPACK_ALIGNMENT, 4);
            let a = i.pixelWidth,
                h = i.pixelHeight;
            const l = !!dy[i.format];
            for (let c = 0; c < i.resource.length; c++) {
                const u = i.resource[c];
                l ? e.compressedTexImage2D(o, c, t.internalFormat, a, h, 0, u) : e.texImage2D(o, c, t.internalFormat, a, h, 0, t.format, t.type, u), a = Math.max(a >> 1, 1), h = Math.max(h >> 1, 1)
            }
        }
    },
    uh = ["right", "left", "top", "bottom", "front", "back"];

function py(i) {
    return {
        id: "cube",
        upload(t, e, s, r) {
            const n = t.faces;
            for (let o = 0; o < uh.length; o++) {
                const a = uh[o],
                    h = n[a];
                (i[h.uploadMethodId] || i.image).upload(h, e, s, r, uo.TEXTURE_CUBE_MAP_POSITIVE_X + o, (e._layerInitMask & 1 << o) === 0), e._layerInitMask |= 1 << o
            }
            e.width = t.pixelWidth, e.height = t.pixelHeight
        }
    }
}
const Su = {
    id: "image",
    upload(i, t, e, s, r, n = !1) {
        const o = r || t.target,
            a = i.pixelWidth,
            h = i.pixelHeight,
            l = i.resourceWidth,
            c = i.resourceHeight,
            u = s === 2,
            d = n || t.width !== a || t.height !== h,
            f = l >= a && c >= h,
            p = i.resource;
        (u ? my : gy)(e, o, t, a, h, l, c, p, d, f), t.width = a, t.height = h
    }
};

function my(i, t, e, s, r, n, o, a, h, l) {
    if (!l) {
        h && i.texImage2D(t, 0, e.internalFormat, s, r, 0, e.format, e.type, null), i.texSubImage2D(t, 0, 0, 0, n, o, e.format, e.type, a);
        return
    }
    if (!h) {
        i.texSubImage2D(t, 0, 0, 0, e.format, e.type, a);
        return
    }
    i.texImage2D(t, 0, e.internalFormat, s, r, 0, e.format, e.type, a)
}

function gy(i, t, e, s, r, n, o, a, h, l) {
    if (!l) {
        h && i.texImage2D(t, 0, e.internalFormat, s, r, 0, e.format, e.type, null), i.texSubImage2D(t, 0, 0, 0, e.format, e.type, a);
        return
    }
    if (!h) {
        i.texSubImage2D(t, 0, 0, 0, e.format, e.type, a);
        return
    }
    i.texImage2D(t, 0, e.internalFormat, e.format, e.type, a)
}
const _y = W_(),
    xy = {
        id: "video",
        upload(i, t, e, s, r, n = _y) {
            if (!i.isValid) {
                const o = r ?? t.target;
                e.texImage2D(o, 0, t.internalFormat, 1, 1, 0, t.format, t.type, null);
                return
            }
            Su.upload(i, t, e, s, r, n)
        }
    },
    dh = {
        linear: 9729,
        nearest: 9728
    },
    yy = {
        linear: {
            linear: 9987,
            nearest: 9985
        },
        nearest: {
            linear: 9986,
            nearest: 9984
        }
    },
    Rr = {
        "clamp-to-edge": 33071,
        repeat: 10497,
        "mirror-repeat": 33648
    },
    by = {
        never: 512,
        less: 513,
        equal: 514,
        "less-equal": 515,
        greater: 516,
        "not-equal": 517,
        "greater-equal": 518,
        always: 519
    };

function fh(i, t, e, s, r, n, o, a) {
    const h = n;
    if (!a || i.addressModeU !== "repeat" || i.addressModeV !== "repeat" || i.addressModeW !== "repeat") {
        const l = Rr[o ? "clamp-to-edge" : i.addressModeU],
            c = Rr[o ? "clamp-to-edge" : i.addressModeV],
            u = Rr[o ? "clamp-to-edge" : i.addressModeW];
        t[r](h, t.TEXTURE_WRAP_S, l), t[r](h, t.TEXTURE_WRAP_T, c), t.TEXTURE_WRAP_R && t[r](h, t.TEXTURE_WRAP_R, u)
    }
    if ((!a || i.magFilter !== "linear") && t[r](h, t.TEXTURE_MAG_FILTER, dh[i.magFilter]), e) {
        if (!a || i.mipmapFilter !== "linear") {
            const l = yy[i.minFilter][i.mipmapFilter];
            t[r](h, t.TEXTURE_MIN_FILTER, l)
        }
    } else t[r](h, t.TEXTURE_MIN_FILTER, dh[i.minFilter]);
    if (s && i.maxAnisotropy > 1) {
        const l = Math.min(i.maxAnisotropy, t.getParameter(s.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
        t[r](h, s.TEXTURE_MAX_ANISOTROPY_EXT, l)
    }
    i.compare && t[r](h, t.TEXTURE_COMPARE_FUNC, by[i.compare])
}

function vy(i) {
    return {
        r8unorm: i.RED,
        r8snorm: i.RED,
        r8uint: i.RED,
        r8sint: i.RED,
        r16uint: i.RED,
        r16sint: i.RED,
        r16float: i.RED,
        rg8unorm: i.RG,
        rg8snorm: i.RG,
        rg8uint: i.RG,
        rg8sint: i.RG,
        r32uint: i.RED,
        r32sint: i.RED,
        r32float: i.RED,
        rg16uint: i.RG,
        rg16sint: i.RG,
        rg16float: i.RG,
        rgba8unorm: i.RGBA,
        "rgba8unorm-srgb": i.RGBA,
        rgba8snorm: i.RGBA,
        rgba8uint: i.RGBA,
        rgba8sint: i.RGBA,
        bgra8unorm: i.RGBA,
        "bgra8unorm-srgb": i.RGBA,
        rgb9e5ufloat: i.RGB,
        rgb10a2unorm: i.RGBA,
        rg11b10ufloat: i.RGB,
        rg32uint: i.RG,
        rg32sint: i.RG,
        rg32float: i.RG,
        rgba16uint: i.RGBA,
        rgba16sint: i.RGBA,
        rgba16float: i.RGBA,
        rgba32uint: i.RGBA,
        rgba32sint: i.RGBA,
        rgba32float: i.RGBA,
        stencil8: i.STENCIL_INDEX8,
        depth16unorm: i.DEPTH_COMPONENT,
        depth24plus: i.DEPTH_COMPONENT,
        "depth24plus-stencil8": i.DEPTH_STENCIL,
        depth32float: i.DEPTH_COMPONENT,
        "depth32float-stencil8": i.DEPTH_STENCIL
    }
}

function wy(i, t) {
    let e = {},
        s = i.RGBA;
    return i instanceof X.get().getWebGLRenderingContext() ? t.srgb && (e = {
        "rgba8unorm-srgb": t.srgb.SRGB8_ALPHA8_EXT,
        "bgra8unorm-srgb": t.srgb.SRGB8_ALPHA8_EXT
    }) : (e = {
        "rgba8unorm-srgb": i.SRGB8_ALPHA8,
        "bgra8unorm-srgb": i.SRGB8_ALPHA8
    }, s = i.RGBA8), {
        r8unorm: i.R8,
        r8snorm: i.R8_SNORM,
        r8uint: i.R8UI,
        r8sint: i.R8I,
        r16uint: i.R16UI,
        r16sint: i.R16I,
        r16float: i.R16F,
        rg8unorm: i.RG8,
        rg8snorm: i.RG8_SNORM,
        rg8uint: i.RG8UI,
        rg8sint: i.RG8I,
        r32uint: i.R32UI,
        r32sint: i.R32I,
        r32float: i.R32F,
        rg16uint: i.RG16UI,
        rg16sint: i.RG16I,
        rg16float: i.RG16F,
        rgba8unorm: i.RGBA,
        ...e,
        rgba8snorm: i.RGBA8_SNORM,
        rgba8uint: i.RGBA8UI,
        rgba8sint: i.RGBA8I,
        bgra8unorm: s,
        rgb9e5ufloat: i.RGB9_E5,
        rgb10a2unorm: i.RGB10_A2,
        rg11b10ufloat: i.R11F_G11F_B10F,
        rg32uint: i.RG32UI,
        rg32sint: i.RG32I,
        rg32float: i.RG32F,
        rgba16uint: i.RGBA16UI,
        rgba16sint: i.RGBA16I,
        rgba16float: i.RGBA16F,
        rgba32uint: i.RGBA32UI,
        rgba32sint: i.RGBA32I,
        rgba32float: i.RGBA32F,
        stencil8: i.STENCIL_INDEX8,
        depth16unorm: i.DEPTH_COMPONENT16,
        depth24plus: i.DEPTH_COMPONENT24,
        "depth24plus-stencil8": i.DEPTH24_STENCIL8,
        depth32float: i.DEPTH_COMPONENT32F,
        "depth32float-stencil8": i.DEPTH32F_STENCIL8,
        ...t.s3tc ? {
            "bc1-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT,
            "bc2-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT,
            "bc3-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT
        } : {},
        ...t.s3tc_sRGB ? {
            "bc1-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
            "bc2-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
            "bc3-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
        } : {},
        ...t.rgtc ? {
            "bc4-r-unorm": t.rgtc.COMPRESSED_RED_RGTC1_EXT,
            "bc4-r-snorm": t.rgtc.COMPRESSED_SIGNED_RED_RGTC1_EXT,
            "bc5-rg-unorm": t.rgtc.COMPRESSED_RED_GREEN_RGTC2_EXT,
            "bc5-rg-snorm": t.rgtc.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
        } : {},
        ...t.bptc ? {
            "bc6h-rgb-float": t.bptc.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
            "bc6h-rgb-ufloat": t.bptc.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT,
            "bc7-rgba-unorm": t.bptc.COMPRESSED_RGBA_BPTC_UNORM_EXT,
            "bc7-rgba-unorm-srgb": t.bptc.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
        } : {},
        ...t.etc ? {
            "etc2-rgb8unorm": t.etc.COMPRESSED_RGB8_ETC2,
            "etc2-rgb8unorm-srgb": t.etc.COMPRESSED_SRGB8_ETC2,
            "etc2-rgb8a1unorm": t.etc.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
            "etc2-rgb8a1unorm-srgb": t.etc.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2,
            "etc2-rgba8unorm": t.etc.COMPRESSED_RGBA8_ETC2_EAC,
            "etc2-rgba8unorm-srgb": t.etc.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC,
            "eac-r11unorm": t.etc.COMPRESSED_R11_EAC,
            "eac-rg11unorm": t.etc.COMPRESSED_SIGNED_RG11_EAC
        } : {},
        ...t.astc ? {
            "astc-4x4-unorm": t.astc.COMPRESSED_RGBA_ASTC_4x4_KHR,
            "astc-4x4-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR,
            "astc-5x4-unorm": t.astc.COMPRESSED_RGBA_ASTC_5x4_KHR,
            "astc-5x4-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR,
            "astc-5x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_5x5_KHR,
            "astc-5x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR,
            "astc-6x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_6x5_KHR,
            "astc-6x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR,
            "astc-6x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_6x6_KHR,
            "astc-6x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR,
            "astc-8x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x5_KHR,
            "astc-8x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR,
            "astc-8x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x6_KHR,
            "astc-8x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR,
            "astc-8x8-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x8_KHR,
            "astc-8x8-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR,
            "astc-10x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x5_KHR,
            "astc-10x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR,
            "astc-10x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x6_KHR,
            "astc-10x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
            "astc-10x8-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x8_KHR,
            "astc-10x8-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR,
            "astc-10x10-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x10_KHR,
            "astc-10x10-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR,
            "astc-12x10-unorm": t.astc.COMPRESSED_RGBA_ASTC_12x10_KHR,
            "astc-12x10-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR,
            "astc-12x12-unorm": t.astc.COMPRESSED_RGBA_ASTC_12x12_KHR,
            "astc-12x12-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
        } : {}
    }
}

function Ty(i) {
    return {
        r8unorm: i.UNSIGNED_BYTE,
        r8snorm: i.BYTE,
        r8uint: i.UNSIGNED_BYTE,
        r8sint: i.BYTE,
        r16uint: i.UNSIGNED_SHORT,
        r16sint: i.SHORT,
        r16float: i.HALF_FLOAT,
        rg8unorm: i.UNSIGNED_BYTE,
        rg8snorm: i.BYTE,
        rg8uint: i.UNSIGNED_BYTE,
        rg8sint: i.BYTE,
        r32uint: i.UNSIGNED_INT,
        r32sint: i.INT,
        r32float: i.FLOAT,
        rg16uint: i.UNSIGNED_SHORT,
        rg16sint: i.SHORT,
        rg16float: i.HALF_FLOAT,
        rgba8unorm: i.UNSIGNED_BYTE,
        "rgba8unorm-srgb": i.UNSIGNED_BYTE,
        rgba8snorm: i.BYTE,
        rgba8uint: i.UNSIGNED_BYTE,
        rgba8sint: i.BYTE,
        bgra8unorm: i.UNSIGNED_BYTE,
        "bgra8unorm-srgb": i.UNSIGNED_BYTE,
        rgb9e5ufloat: i.UNSIGNED_INT_5_9_9_9_REV,
        rgb10a2unorm: i.UNSIGNED_INT_2_10_10_10_REV,
        rg11b10ufloat: i.UNSIGNED_INT_10F_11F_11F_REV,
        rg32uint: i.UNSIGNED_INT,
        rg32sint: i.INT,
        rg32float: i.FLOAT,
        rgba16uint: i.UNSIGNED_SHORT,
        rgba16sint: i.SHORT,
        rgba16float: i.HALF_FLOAT,
        rgba32uint: i.UNSIGNED_INT,
        rgba32sint: i.INT,
        rgba32float: i.FLOAT,
        stencil8: i.UNSIGNED_BYTE,
        depth16unorm: i.UNSIGNED_SHORT,
        depth24plus: i.UNSIGNED_INT,
        "depth24plus-stencil8": i.UNSIGNED_INT_24_8,
        depth32float: i.FLOAT,
        "depth32float-stencil8": i.FLOAT_32_UNSIGNED_INT_24_8_REV
    }
}

function Sy(i) {
    return {
        "2d": i.TEXTURE_2D,
        cube: i.TEXTURE_CUBE_MAP,
        "1d": null,
        "3d": (i == null ? void 0 : i.TEXTURE_3D) || null,
        "2d-array": (i == null ? void 0 : i.TEXTURE_2D_ARRAY) || null,
        "cube-array": (i == null ? void 0 : i.TEXTURE_CUBE_MAP_ARRAY) || null
    }
}
const Cy = 4;
class Cu {
    constructor(t) {
        this._glSamplers = Object.create(null), this._boundTextures = [], this._activeTextureLocation = -1, this._boundSamplers = Object.create(null), this._premultiplyAlpha = !1, this._useSeparateSamplers = !1, this._renderer = t, this._managedTextures = new oe({
            renderer: t,
            type: "resource",
            onUnload: this.onSourceUnload.bind(this),
            name: "glTexture"
        });
        const e = {
            image: Su,
            buffer: uy,
            video: xy,
            compressed: fy
        };
        this._uploads = {
            ...e,
            cube: py(e)
        }
    }
    get managedTextures() {
        return Object.values(this._managedTextures.items)
    }
    contextChange(t) {
        this._gl = t, this._mapFormatToInternalFormat || (this._mapFormatToInternalFormat = wy(t, this._renderer.context.extensions), this._mapFormatToType = Ty(t), this._mapFormatToFormat = vy(t), this._mapViewDimensionToGlTarget = Sy(t)), this._managedTextures.removeAll(!0), this._glSamplers = Object.create(null), this._boundSamplers = Object.create(null), this._premultiplyAlpha = !1;
        for (let e = 0; e < 16; e++) this.bind(O.EMPTY, e)
    }
    initSource(t) {
        this.bind(t)
    }
    bind(t, e = 0) {
        const s = t.source;
        t ? (this.bindSource(s, e), this._useSeparateSamplers && this._bindSampler(s.style, e)) : (this.bindSource(null, e), this._useSeparateSamplers && this._bindSampler(null, e))
    }
    bindSource(t, e = 0) {
        const s = this._gl;
        if (t._gcLastUsed = this._renderer.gc.now, this._boundTextures[e] !== t) {
            this._boundTextures[e] = t, this._activateLocation(e), t || (t = O.EMPTY.source);
            const r = this.getGlSource(t);
            s.bindTexture(r.target, r.texture)
        }
    }
    _bindSampler(t, e = 0) {
        const s = this._gl;
        if (!t) {
            this._boundSamplers[e] = null, s.bindSampler(e, null);
            return
        }
        const r = this._getGlSampler(t);
        this._boundSamplers[e] !== r && (this._boundSamplers[e] = r, s.bindSampler(e, r))
    }
    unbind(t) {
        const e = t.source,
            s = this._boundTextures,
            r = this._gl;
        for (let n = 0; n < s.length; n++)
            if (s[n] === e) {
                this._activateLocation(n);
                const o = this.getGlSource(e);
                r.bindTexture(o.target, null), s[n] = null
            }
    }
    _activateLocation(t) {
        this._activeTextureLocation !== t && (this._activeTextureLocation = t, this._gl.activeTexture(this._gl.TEXTURE0 + t))
    }
    _initSource(t) {
        const e = this._gl,
            s = new cy(e.createTexture());
        if (s.type = this._mapFormatToType[t.format], s.internalFormat = this._mapFormatToInternalFormat[t.format], s.format = this._mapFormatToFormat[t.format], s.target = this._mapViewDimensionToGlTarget[t.viewDimension], s.target === null) throw new Error(`Unsupported view dimension: ${t.viewDimension} with this webgl version: ${this._renderer.context.webGLVersion}`);
        if (t.uploadMethodId === "cube" && (s.target = e.TEXTURE_CUBE_MAP), t.autoGenerateMipmaps && (this._renderer.context.supports.nonPowOf2mipmaps || t.isPowerOfTwo)) {
            const n = Math.max(t.width, t.height);
            t.mipLevelCount = Math.floor(Math.log2(n)) + 1
        }
        return t._gpuData[this._renderer.uid] = s, this._managedTextures.add(t) && (t.on("update", this.onSourceUpdate, this), t.on("resize", this.onSourceUpdate, this), t.on("styleChange", this.onStyleChange, this), t.on("updateMipmaps", this.onUpdateMipmaps, this)), this.onSourceUpdate(t), this.updateStyle(t, !1), s
    }
    onStyleChange(t) {
        this.updateStyle(t, !1)
    }
    updateStyle(t, e) {
        const s = this._gl,
            r = this.getGlSource(t);
        s.bindTexture(r.target, r.texture), this._boundTextures[this._activeTextureLocation] = t, fh(t.style, s, t.mipLevelCount > 1, this._renderer.context.extensions.anisotropicFiltering, "texParameteri", r.target, !this._renderer.context.supports.nonPowOf2wrapping && !t.isPowerOfTwo, e)
    }
    onSourceUnload(t, e = !1) {
        const s = t._gpuData[this._renderer.uid];
        s && (e || (this.unbind(t), this._gl.deleteTexture(s.texture)), t.off("update", this.onSourceUpdate, this), t.off("resize", this.onSourceUpdate, this), t.off("styleChange", this.onStyleChange, this), t.off("updateMipmaps", this.onUpdateMipmaps, this))
    }
    onSourceUpdate(t) {
        const e = this._gl,
            s = this.getGlSource(t);
        e.bindTexture(s.target, s.texture), this._boundTextures[this._activeTextureLocation] = t;
        const r = t.alphaMode === "premultiply-alpha-on-upload";
        if (this._premultiplyAlpha !== r && (this._premultiplyAlpha = r, e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r)), this._uploads[t.uploadMethodId]) this._uploads[t.uploadMethodId].upload(t, s, e, this._renderer.context.webGLVersion);
        else if (s.target === e.TEXTURE_2D) this._initEmptyTexture2D(s, t);
        else if (s.target === e.TEXTURE_2D_ARRAY) this._initEmptyTexture2DArray(s, t);
        else if (s.target === e.TEXTURE_CUBE_MAP) this._initEmptyTextureCube(s, t);
        else throw new Error("[GlTextureSystem] Unsupported texture target for empty allocation.");
        this._applyMipRange(s, t), t.autoGenerateMipmaps && t.mipLevelCount > 1 && this.onUpdateMipmaps(t, !1)
    }
    onUpdateMipmaps(t, e = !0) {
        e && this.bindSource(t, 0);
        const s = this.getGlSource(t);
        this._gl.generateMipmap(s.target)
    }
    _initEmptyTexture2D(t, e) {
        const s = this._gl;
        s.texImage2D(s.TEXTURE_2D, 0, t.internalFormat, e.pixelWidth, e.pixelHeight, 0, t.format, t.type, null);
        let r = Math.max(e.pixelWidth >> 1, 1),
            n = Math.max(e.pixelHeight >> 1, 1);
        for (let o = 1; o < e.mipLevelCount; o++) s.texImage2D(s.TEXTURE_2D, o, t.internalFormat, r, n, 0, t.format, t.type, null), r = Math.max(r >> 1, 1), n = Math.max(n >> 1, 1)
    }
    _initEmptyTexture2DArray(t, e) {
        if (this._renderer.context.webGLVersion !== 2) throw new Error("[GlTextureSystem] TEXTURE_2D_ARRAY requires WebGL2.");
        const s = this._gl,
            r = Math.max(e.arrayLayerCount | 0, 1);
        s.texImage3D(s.TEXTURE_2D_ARRAY, 0, t.internalFormat, e.pixelWidth, e.pixelHeight, r, 0, t.format, t.type, null);
        let n = Math.max(e.pixelWidth >> 1, 1),
            o = Math.max(e.pixelHeight >> 1, 1);
        for (let a = 1; a < e.mipLevelCount; a++) s.texImage3D(s.TEXTURE_2D_ARRAY, a, t.internalFormat, n, o, r, 0, t.format, t.type, null), n = Math.max(n >> 1, 1), o = Math.max(o >> 1, 1)
    }
    _initEmptyTextureCube(t, e) {
        const s = this._gl,
            r = 6;
        for (let a = 0; a < r; a++) s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + a, 0, t.internalFormat, e.pixelWidth, e.pixelHeight, 0, t.format, t.type, null);
        let n = Math.max(e.pixelWidth >> 1, 1),
            o = Math.max(e.pixelHeight >> 1, 1);
        for (let a = 1; a < e.mipLevelCount; a++) {
            for (let h = 0; h < r; h++) s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + h, a, t.internalFormat, n, o, 0, t.format, t.type, null);
            n = Math.max(n >> 1, 1), o = Math.max(o >> 1, 1)
        }
    }
    _applyMipRange(t, e) {
        if (this._renderer.context.webGLVersion !== 2) return;
        const s = this._gl,
            r = Math.max((e.mipLevelCount | 0) - 1, 0);
        s.texParameteri(t.target, s.TEXTURE_BASE_LEVEL, 0), s.texParameteri(t.target, s.TEXTURE_MAX_LEVEL, r)
    }
    _initSampler(t) {
        const e = this._gl,
            s = this._gl.createSampler();
        return this._glSamplers[t._resourceId] = s, fh(t, e, this._boundTextures[this._activeTextureLocation].mipLevelCount > 1, this._renderer.context.extensions.anisotropicFiltering, "samplerParameteri", s, !1, !0), this._glSamplers[t._resourceId]
    }
    _getGlSampler(t) {
        return this._glSamplers[t._resourceId] || this._initSampler(t)
    }
    getGlSource(t) {
        return t._gcLastUsed = this._renderer.gc.now, t._gpuData[this._renderer.uid] || this._initSource(t)
    }
    generateCanvas(t) {
        const {
            pixels: e,
            width: s,
            height: r
        } = this.getPixels(t), n = X.get().createCanvas();
        n.width = s, n.height = r;
        const o = n.getContext("2d");
        if (o) {
            const a = o.createImageData(s, r);
            a.data.set(e), o.putImageData(a, 0, 0)
        }
        return n
    }
    getPixels(t) {
        const e = t.source.resolution,
            s = t.frame,
            r = Math.max(Math.round(s.width * e), 1),
            n = Math.max(Math.round(s.height * e), 1),
            o = new Uint8Array(Cy * r * n),
            a = this._renderer,
            h = a.renderTarget.getRenderTarget(t),
            l = a.renderTarget.getGpuRenderTarget(h),
            c = a.gl;
        return c.bindFramebuffer(c.FRAMEBUFFER, l.resolveTargetFramebuffer), c.readPixels(Math.round(s.x * e), Math.round(s.y * e), r, n, c.RGBA, c.UNSIGNED_BYTE, o), {
            pixels: new Uint8ClampedArray(o.buffer),
            width: r,
            height: n
        }
    }
    destroy() {
        this._managedTextures.destroy(), this._glSamplers = null, this._boundTextures = null, this._boundSamplers = null, this._mapFormatToInternalFormat = null, this._mapFormatToType = null, this._mapFormatToFormat = null, this._uploads = null, this._renderer = null
    }
    resetState() {
        this._activeTextureLocation = -1, this._boundTextures.fill(O.EMPTY.source), this._boundSamplers = Object.create(null);
        const t = this._gl;
        this._premultiplyAlpha = !1, t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha)
    }
}
Cu.extension = {
    type: [w.WebGLSystem],
    name: "texture"
};
class Au {
    contextChange(t) {
        const e = new te({
                uColor: {
                    value: new Float32Array([1, 1, 1, 1]),
                    type: "vec4<f32>"
                },
                uTransformMatrix: {
                    value: new N,
                    type: "mat3x3<f32>"
                },
                uRound: {
                    value: 0,
                    type: "f32"
                }
            }),
            s = t.limits.maxBatchableTextures,
            r = Mn({
                name: "graphics",
                bits: [Ll, Ul(s), fc, Rn]
            });
        this.shader = new ge({
            glProgram: r,
            resources: {
                localUniforms: e,
                batchSamplers: Nl(s)
            }
        })
    }
    execute(t, e) {
        const s = e.context,
            r = s.customShader || this.shader,
            n = t.renderer,
            o = n.graphicsContext,
            {
                batcher: a,
                instructions: h
            } = o.getContextRenderData(s);
        r.groups[0] = n.globalUniforms.bindGroup, n.state.set(t.state), n.shader.bind(r), n.geometry.bind(a.geometry, r.glProgram);
        const l = h.instructions;
        for (let c = 0; c < h.instructionSize; c++) {
            const u = l[c];
            if (u.size) {
                for (let d = 0; d < u.textures.count; d++) n.texture.bind(u.textures.textures[d], d);
                n.geometry.draw(u.topology, u.size, u.start)
            }
        }
    }
    destroy() {
        this.shader.destroy(!0), this.shader = null
    }
}
Au.extension = {
    type: [w.WebGLPipesAdaptor],
    name: "graphics"
};
class Pu {
    init() {
        const t = Mn({
            name: "mesh",
            bits: [fc, V_, Rn]
        });
        this._shader = new ge({
            glProgram: t,
            resources: {
                uTexture: O.EMPTY.source,
                textureUniforms: {
                    uTextureMatrix: {
                        type: "mat3x3<f32>",
                        value: new N
                    }
                }
            }
        })
    }
    execute(t, e) {
        const s = t.renderer;
        let r = e._shader;
        if (r) {
            if (!r.glProgram) {
                V("Mesh shader has no glProgram", e.shader);
                return
            }
        } else {
            r = this._shader;
            const n = e.texture,
                o = n.source;
            r.resources.uTexture = o, r.resources.uSampler = o.style, r.resources.textureUniforms.uniforms.uTextureMatrix = n.textureMatrix.mapCoord
        }
        r.groups[100] = s.globalUniforms.bindGroup, r.groups[101] = t.localUniformsBindGroup, s.encoder.draw({
            geometry: e._geometry,
            shader: r,
            state: e.state
        })
    }
    destroy() {
        this._shader.destroy(!0), this._shader = null
    }
}
Pu.extension = {
    type: [w.WebGLPipesAdaptor],
    name: "mesh"
};
const Ay = [...ho, _u, Lx, Rx, uu, ru, Cu, xu, au, wu, vu, cu, ly, du, lu],
    Py = [...Qc],
    Ey = [Pc, Pu, Au],
    Eu = [],
    Mu = [],
    ku = [];
Y.handleByNamedList(w.WebGLSystem, Eu);
Y.handleByNamedList(w.WebGLPipes, Mu);
Y.handleByNamedList(w.WebGLPipesAdaptor, ku);
Y.add(...Ay, ...Py, ...Ey);
class My extends ri {
    constructor() {
        const t = {
            name: "webgl",
            type: Vt.WEBGL,
            systems: Eu,
            renderPipes: Mu,
            renderPipeAdaptors: ku
        };
        super(t)
    }
}
const ky = Object.freeze(Object.defineProperty({
    __proto__: null,
    WebGLRenderer: My
}, Symbol.toStringTag, {
    value: "Module"
}));
class Ru {
    constructor(t) {
        this._hash = Object.create(null), this._renderer = t
    }
    contextChange(t) {
        this._gpu = t
    }
    getBindGroup(t, e, s) {
        return t._updateKey(), this._hash[t._key] || this._createBindGroup(t, e, s)
    }
    _createBindGroup(t, e, s) {
        const r = this._gpu.device,
            n = e.layout[s],
            o = [],
            a = this._renderer;
        for (const c in n) {
            const u = t.resources[c] ?? t.resources[n[c]];
            let d;
            if (u._resourceType === "uniformGroup") {
                const f = u;
                a.ubo.updateUniformGroup(f);
                const p = f.buffer;
                d = {
                    buffer: a.buffer.getGPUBuffer(p),
                    offset: 0,
                    size: p.descriptor.size
                }
            } else if (u._resourceType === "buffer") {
                const f = u;
                d = {
                    buffer: a.buffer.getGPUBuffer(f),
                    offset: 0,
                    size: f.descriptor.size
                }
            } else if (u._resourceType === "bufferResource") {
                const f = u;
                d = {
                    buffer: a.buffer.getGPUBuffer(f.buffer),
                    offset: f.offset,
                    size: f.size
                }
            } else if (u._resourceType === "textureSampler") {
                const f = u;
                d = a.texture.getGpuSampler(f)
            } else if (u._resourceType === "textureSource") {
                const f = u;
                d = a.texture.getTextureView(f)
            }
            o.push({
                binding: n[c],
                resource: d
            })
        }
        const h = a.shader.getProgramData(e).bindGroups[s],
            l = r.createBindGroup({
                layout: h,
                entries: o
            });
        return this._hash[t._key] = l, l
    }
    destroy() {
        this._hash = null, this._renderer = null
    }
}
Ru.extension = {
    type: [w.WebGPUSystem],
    name: "bindGroup"
};
class Ry {
    constructor(t) {
        this.gpuBuffer = t
    }
    destroy() {
        this.gpuBuffer.destroy(), this.gpuBuffer = null
    }
}
class Bu {
    constructor(t) {
        this._renderer = t, this._managedBuffers = new oe({
            renderer: t,
            type: "resource",
            onUnload: this.onBufferUnload.bind(this),
            name: "gpuBuffer"
        })
    }
    contextChange(t) {
        this._gpu = t
    }
    getGPUBuffer(t) {
        var e;
        return t._gcLastUsed = this._renderer.gc.now, ((e = t._gpuData[this._renderer.uid]) == null ? void 0 : e.gpuBuffer) || this.createGPUBuffer(t)
    }
    updateBuffer(t) {
        const e = this.getGPUBuffer(t),
            s = t.data;
        return t._updateID && s && (t._updateID = 0, this._gpu.device.queue.writeBuffer(e, 0, s.buffer, 0, (t._updateSize || s.byteLength) + 3 & -4)), e
    }
    destroyAll() {
        this._managedBuffers.removeAll()
    }
    onBufferUnload(t) {
        t.off("update", this.updateBuffer, this), t.off("change", this.onBufferChange, this)
    }
    createGPUBuffer(t) {
        const e = this._gpu.device.createBuffer(t.descriptor);
        return t._updateID = 0, t._resourceId = pt("resource"), t.data && (en(t.data.buffer, e.getMappedRange(), t.data.byteOffset, t.data.byteLength), e.unmap()), t._gpuData[this._renderer.uid] = new Ry(e), this._managedBuffers.add(t) && (t.on("update", this.updateBuffer, this), t.on("change", this.onBufferChange, this)), e
    }
    onBufferChange(t) {
        this._managedBuffers.remove(t), t._updateID = 0, this.createGPUBuffer(t)
    }
    destroy() {
        this._managedBuffers.destroy(), this._renderer = null, this._gpu = null
    }
}
Bu.extension = {
    type: [w.WebGPUSystem],
    name: "buffer"
};
class By {
    constructor({
        minUniformOffsetAlignment: t
    }) {
        this._minUniformOffsetAlignment = 256, this.byteIndex = 0, this._minUniformOffsetAlignment = t, this.data = new Float32Array(65535)
    }
    clear() {
        this.byteIndex = 0
    }
    addEmptyGroup(t) {
        if (t > this._minUniformOffsetAlignment / 4) throw new Error(`UniformBufferBatch: array is too large: ${t*4}`);
        const e = this.byteIndex;
        let s = e + t * 4;
        if (s = Math.ceil(s / this._minUniformOffsetAlignment) * this._minUniformOffsetAlignment, s > this.data.length * 4) throw new Error("UniformBufferBatch: ubo batch got too big");
        return this.byteIndex = s, e
    }
    addGroup(t) {
        const e = this.addEmptyGroup(t.length);
        for (let s = 0; s < t.length; s++) this.data[e / 4 + s] = t[s];
        return e
    }
    destroy() {
        this.data = null
    }
}
class Iu {
    constructor(t) {
        this._colorMaskCache = 15, this._renderer = t
    }
    setMask(t) {
        this._colorMaskCache !== t && (this._colorMaskCache = t, this._renderer.pipeline.setColorMask(t))
    }
    destroy() {
        this._renderer = null, this._colorMaskCache = null
    }
}
Iu.extension = {
    type: [w.WebGPUSystem],
    name: "colorMask"
};
class mo {
    constructor(t) {
        this._renderer = t
    }
    async init(t) {
        return this._initPromise ? this._initPromise : (this._initPromise = (t.gpu ? Promise.resolve(t.gpu) : this._createDeviceAndAdaptor(t)).then(e => {
            this.gpu = e, this._renderer.runners.contextChange.emit(this.gpu)
        }), this._initPromise)
    }
    contextChange(t) {
        this._renderer.gpu = t
    }
    async _createDeviceAndAdaptor(t) {
        const e = await X.get().getNavigator().gpu.requestAdapter({
                powerPreference: t.powerPreference,
                forceFallbackAdapter: t.forceFallbackAdapter
            }),
            s = ["texture-compression-bc", "texture-compression-astc", "texture-compression-etc2"].filter(n => e.features.has(n)),
            r = await e.requestDevice({
                requiredFeatures: s
            });
        return {
            adapter: e,
            device: r
        }
    }
    destroy() {
        this.gpu = null, this._renderer = null
    }
}
mo.extension = {
    type: [w.WebGPUSystem],
    name: "device"
};
mo.defaultOptions = {
    powerPreference: void 0,
    forceFallbackAdapter: !1
};
class Gu {
    constructor(t) {
        this._boundBindGroup = Object.create(null), this._boundVertexBuffer = Object.create(null), this._renderer = t
    }
    renderStart() {
        this.commandFinished = new Promise(t => {
            this._resolveCommandFinished = t
        }), this.commandEncoder = this._renderer.gpu.device.createCommandEncoder()
    }
    beginRenderPass(t) {
        this.endRenderPass(), this._clearCache(), this.renderPassEncoder = this.commandEncoder.beginRenderPass(t.descriptor)
    }
    endRenderPass() {
        this.renderPassEncoder && this.renderPassEncoder.end(), this.renderPassEncoder = null
    }
    setViewport(t) {
        this.renderPassEncoder.setViewport(t.x, t.y, t.width, t.height, 0, 1)
    }
    setPipelineFromGeometryProgramAndState(t, e, s, r) {
        const n = this._renderer.pipeline.getPipeline(t, e, s, r);
        this.setPipeline(n)
    }
    setPipeline(t) {
        this._boundPipeline !== t && (this._boundPipeline = t, this.renderPassEncoder.setPipeline(t))
    }
    _setVertexBuffer(t, e) {
        this._boundVertexBuffer[t] !== e && (this._boundVertexBuffer[t] = e, this.renderPassEncoder.setVertexBuffer(t, this._renderer.buffer.updateBuffer(e)))
    }
    _setIndexBuffer(t) {
        if (this._boundIndexBuffer === t) return;
        this._boundIndexBuffer = t;
        const e = t.data.BYTES_PER_ELEMENT === 2 ? "uint16" : "uint32";
        this.renderPassEncoder.setIndexBuffer(this._renderer.buffer.updateBuffer(t), e)
    }
    resetBindGroup(t) {
        this._boundBindGroup[t] = null
    }
    setBindGroup(t, e, s) {
        if (this._boundBindGroup[t] === e) return;
        this._boundBindGroup[t] = e, e._touch(this._renderer.gc.now, this._renderer.tick);
        const r = this._renderer.bindGroup.getBindGroup(e, s, t);
        this.renderPassEncoder.setBindGroup(t, r)
    }
    setGeometry(t, e) {
        const s = this._renderer.pipeline.getBufferNamesToBind(t, e);
        for (const r in s) this._setVertexBuffer(parseInt(r, 10), t.attributes[s[r]].buffer);
        t.indexBuffer && this._setIndexBuffer(t.indexBuffer)
    }
    _setShaderBindGroups(t, e) {
        for (const s in t.groups) {
            const r = t.groups[s];
            e || this._syncBindGroup(r), this.setBindGroup(s, r, t.gpuProgram)
        }
    }
    _syncBindGroup(t) {
        for (const e in t.resources) {
            const s = t.resources[e];
            s.isUniformGroup && this._renderer.ubo.updateUniformGroup(s)
        }
    }
    draw(t) {
        const {
            geometry: e,
            shader: s,
            state: r,
            topology: n,
            size: o,
            start: a,
            instanceCount: h,
            skipSync: l
        } = t;
        this.setPipelineFromGeometryProgramAndState(e, s.gpuProgram, r, n), this.setGeometry(e, s.gpuProgram), this._setShaderBindGroups(s, l), e.indexBuffer ? this.renderPassEncoder.drawIndexed(o || e.indexBuffer.data.length, h ?? e.instanceCount, a || 0) : this.renderPassEncoder.draw(o || e.getSize(), h ?? e.instanceCount, a || 0)
    }
    finishRenderPass() {
        this.renderPassEncoder && (this.renderPassEncoder.end(), this.renderPassEncoder = null)
    }
    postrender() {
        this.finishRenderPass(), this._gpu.device.queue.submit([this.commandEncoder.finish()]), this._resolveCommandFinished(), this.commandEncoder = null
    }
    restoreRenderPass() {
        const t = this._renderer.renderTarget.adaptor.getDescriptor(this._renderer.renderTarget.renderTarget, !1, [0, 0, 0, 1], this._renderer.renderTarget.mipLevel, this._renderer.renderTarget.layer);
        this.renderPassEncoder = this.commandEncoder.beginRenderPass(t);
        const e = this._boundPipeline,
            s = {
                ...this._boundVertexBuffer
            },
            r = this._boundIndexBuffer,
            n = {
                ...this._boundBindGroup
            };
        this._clearCache();
        const o = this._renderer.renderTarget.viewport;
        this.renderPassEncoder.setViewport(o.x, o.y, o.width, o.height, 0, 1), this.setPipeline(e);
        for (const a in s) this._setVertexBuffer(a, s[a]);
        for (const a in n) this.setBindGroup(a, n[a], null);
        this._setIndexBuffer(r)
    }
    _clearCache() {
        for (let t = 0; t < 16; t++) this._boundBindGroup[t] = null, this._boundVertexBuffer[t] = null;
        this._boundIndexBuffer = null, this._boundPipeline = null
    }
    destroy() {
        this._renderer = null, this._gpu = null, this._boundBindGroup = null, this._boundVertexBuffer = null, this._boundIndexBuffer = null, this._boundPipeline = null
    }
    contextChange(t) {
        this._gpu = t
    }
}
Gu.extension = {
    type: [w.WebGPUSystem],
    name: "encoder",
    priority: 1
};
class Fu {
    constructor(t) {
        this._renderer = t
    }
    contextChange() {
        this.maxTextures = this._renderer.device.gpu.device.limits.maxSampledTexturesPerShaderStage, this.maxBatchableTextures = this.maxTextures
    }
    destroy() {}
}
Fu.extension = {
    type: [w.WebGPUSystem],
    name: "limits"
};
class Ou {
    constructor(t) {
        this._renderTargetStencilState = Object.create(null), this._renderer = t, t.renderTarget.onRenderTargetChange.add(this)
    }
    onRenderTargetChange(t) {
        let e = this._renderTargetStencilState[t.uid];
        e || (e = this._renderTargetStencilState[t.uid] = {
            stencilMode: Ct.DISABLED,
            stencilReference: 0
        }), this._activeRenderTarget = t, this.setStencilMode(e.stencilMode, e.stencilReference)
    }
    setStencilMode(t, e) {
        const s = this._renderTargetStencilState[this._activeRenderTarget.uid];
        s.stencilMode = t, s.stencilReference = e;
        const r = this._renderer;
        r.pipeline.setStencilMode(t), r.encoder.renderPassEncoder.setStencilReference(e)
    }
    destroy() {
        this._renderer.renderTarget.onRenderTargetChange.remove(this), this._renderer = null, this._activeRenderTarget = null, this._renderTargetStencilState = null
    }
}
Ou.extension = {
    type: [w.WebGPUSystem],
    name: "stencil"
};
const Gi = {
    i32: {
        align: 4,
        size: 4
    },
    u32: {
        align: 4,
        size: 4
    },
    f32: {
        align: 4,
        size: 4
    },
    f16: {
        align: 2,
        size: 2
    },
    "vec2<i32>": {
        align: 8,
        size: 8
    },
    "vec2<u32>": {
        align: 8,
        size: 8
    },
    "vec2<f32>": {
        align: 8,
        size: 8
    },
    "vec2<f16>": {
        align: 4,
        size: 4
    },
    "vec3<i32>": {
        align: 16,
        size: 12
    },
    "vec3<u32>": {
        align: 16,
        size: 12
    },
    "vec3<f32>": {
        align: 16,
        size: 12
    },
    "vec3<f16>": {
        align: 8,
        size: 6
    },
    "vec4<i32>": {
        align: 16,
        size: 16
    },
    "vec4<u32>": {
        align: 16,
        size: 16
    },
    "vec4<f32>": {
        align: 16,
        size: 16
    },
    "vec4<f16>": {
        align: 8,
        size: 8
    },
    "mat2x2<f32>": {
        align: 8,
        size: 16
    },
    "mat2x2<f16>": {
        align: 4,
        size: 8
    },
    "mat3x2<f32>": {
        align: 8,
        size: 24
    },
    "mat3x2<f16>": {
        align: 4,
        size: 12
    },
    "mat4x2<f32>": {
        align: 8,
        size: 32
    },
    "mat4x2<f16>": {
        align: 4,
        size: 16
    },
    "mat2x3<f32>": {
        align: 16,
        size: 32
    },
    "mat2x3<f16>": {
        align: 8,
        size: 16
    },
    "mat3x3<f32>": {
        align: 16,
        size: 48
    },
    "mat3x3<f16>": {
        align: 8,
        size: 24
    },
    "mat4x3<f32>": {
        align: 16,
        size: 64
    },
    "mat4x3<f16>": {
        align: 8,
        size: 32
    },
    "mat2x4<f32>": {
        align: 16,
        size: 32
    },
    "mat2x4<f16>": {
        align: 8,
        size: 16
    },
    "mat3x4<f32>": {
        align: 16,
        size: 48
    },
    "mat3x4<f16>": {
        align: 8,
        size: 24
    },
    "mat4x4<f32>": {
        align: 16,
        size: 64
    },
    "mat4x4<f16>": {
        align: 8,
        size: 32
    }
};

function Iy(i) {
    const t = i.map(s => ({
        data: s,
        offset: 0,
        size: 0
    }));
    let e = 0;
    for (let s = 0; s < t.length; s++) {
        const r = t[s];
        let n = Gi[r.data.type].size;
        const o = Gi[r.data.type].align;
        if (!Gi[r.data.type]) throw new Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${r.data.type}`);
        r.data.size > 1 && (n = Math.max(n, o) * r.data.size), e = Math.ceil(e / o) * o, r.size = n, r.offset = e, e += n
    }
    return e = Math.ceil(e / 16) * 16, {
        uboElements: t,
        size: e
    }
}

function Gy(i, t) {
    const {
        size: e,
        align: s
    } = Gi[i.data.type], r = (s - e) / 4, n = i.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
    return `
         v = uv.${i.data.name};
         ${t!==0?`offset += ${t};`:""}

         arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${i.data.size*(e/4)}; i++)
         {
             for(var j = 0; j < ${e/4}; j++)
             {
                 ${n}[arrayOffset++] = v[t++];
             }
             ${r!==0?`arrayOffset += ${r};`:""}
         }
     `
}

function Fy(i) {
    return mu(i, "uboWgsl", Gy, Nx)
}
class Lu extends fu {
    constructor() {
        super({
            createUboElements: Iy,
            generateUboSync: Fy
        })
    }
}
Lu.extension = {
    type: [w.WebGPUSystem],
    name: "ubo"
};
const ye = 128;
class Du {
    constructor(t) {
        this._bindGroupHash = Object.create(null), this._buffers = [], this._bindGroups = [], this._bufferResources = [], this._renderer = t, this._batchBuffer = new By({
            minUniformOffsetAlignment: ye
        });
        const e = 256 / ye;
        for (let s = 0; s < e; s++) {
            let r = gt.UNIFORM | gt.COPY_DST;
            s === 0 && (r |= gt.COPY_SRC), this._buffers.push(new Ce({
                data: this._batchBuffer.data,
                usage: r
            }))
        }
    }
    renderEnd() {
        this._uploadBindGroups(), this._resetBindGroups()
    }
    _resetBindGroups() {
        this._bindGroupHash = Object.create(null), this._batchBuffer.clear()
    }
    getUniformBindGroup(t, e) {
        if (!e && this._bindGroupHash[t.uid]) return this._bindGroupHash[t.uid];
        this._renderer.ubo.ensureUniformGroup(t);
        const s = t.buffer.data,
            r = this._batchBuffer.addEmptyGroup(s.length);
        return this._renderer.ubo.syncUniformGroup(t, this._batchBuffer.data, r / 4), this._bindGroupHash[t.uid] = this._getBindGroup(r / ye), this._bindGroupHash[t.uid]
    }
    getUboResource(t) {
        this._renderer.ubo.updateUniformGroup(t);
        const e = t.buffer.data,
            s = this._batchBuffer.addGroup(e);
        return this._getBufferResource(s / ye)
    }
    getArrayBindGroup(t) {
        const e = this._batchBuffer.addGroup(t);
        return this._getBindGroup(e / ye)
    }
    getArrayBufferResource(t) {
        const s = this._batchBuffer.addGroup(t) / ye;
        return this._getBufferResource(s)
    }
    _getBufferResource(t) {
        if (!this._bufferResources[t]) {
            const e = this._buffers[t % 2];
            this._bufferResources[t] = new po({
                buffer: e,
                offset: (t / 2 | 0) * 256,
                size: ye
            })
        }
        return this._bufferResources[t]
    }
    _getBindGroup(t) {
        if (!this._bindGroups[t]) {
            const e = new Se({
                0: this._getBufferResource(t)
            });
            this._bindGroups[t] = e
        }
        return this._bindGroups[t]
    }
    _uploadBindGroups() {
        const t = this._renderer.buffer,
            e = this._buffers[0];
        e.update(this._batchBuffer.byteIndex), t.updateBuffer(e);
        const s = this._renderer.gpu.device.createCommandEncoder();
        for (let r = 1; r < this._buffers.length; r++) {
            const n = this._buffers[r];
            s.copyBufferToBuffer(t.getGPUBuffer(e), ye, t.getGPUBuffer(n), 0, this._batchBuffer.byteIndex)
        }
        this._renderer.gpu.device.queue.submit([s.finish()])
    }
    destroy() {
        var t;
        for (let e = 0; e < this._bindGroups.length; e++)(t = this._bindGroups[e]) == null || t.destroy();
        this._bindGroups = null, this._bindGroupHash = null;
        for (let e = 0; e < this._buffers.length; e++) this._buffers[e].destroy();
        this._buffers = null;
        for (let e = 0; e < this._bufferResources.length; e++) this._bufferResources[e].destroy();
        this._bufferResources = null, this._batchBuffer.destroy(), this._renderer = null
    }
}
Du.extension = {
    type: [w.WebGPUPipes],
    name: "uniformBatch"
};
const Oy = {
    "point-list": 0,
    "line-list": 1,
    "line-strip": 2,
    "triangle-list": 3,
    "triangle-strip": 4
};

function Ly(i, t, e, s, r) {
    return i << 24 | t << 16 | e << 10 | s << 5 | r
}

function Dy(i, t, e, s, r) {
    return e << 8 | i << 5 | s << 3 | r << 1 | t
}
class Uu {
    constructor(t) {
        this._moduleCache = Object.create(null), this._bufferLayoutsCache = Object.create(null), this._bindingNamesCache = Object.create(null), this._pipeCache = Object.create(null), this._pipeStateCaches = Object.create(null), this._colorMask = 15, this._multisampleCount = 1, this._colorTargetCount = 1, this._renderer = t
    }
    contextChange(t) {
        this._gpu = t, this.setStencilMode(Ct.DISABLED), this._updatePipeHash()
    }
    setMultisampleCount(t) {
        this._multisampleCount !== t && (this._multisampleCount = t, this._updatePipeHash())
    }
    setRenderTarget(t) {
        this._multisampleCount = t.msaaSamples, this._depthStencilAttachment = t.descriptor.depthStencilAttachment ? 1 : 0, this._colorTargetCount = t.colorTargetCount, this._updatePipeHash()
    }
    setColorMask(t) {
        this._colorMask !== t && (this._colorMask = t, this._updatePipeHash())
    }
    setStencilMode(t) {
        this._stencilMode !== t && (this._stencilMode = t, this._stencilState = Ee[t], this._updatePipeHash())
    }
    setPipeline(t, e, s, r) {
        const n = this.getPipeline(t, e, s);
        r.setPipeline(n)
    }
    getPipeline(t, e, s, r) {
        t._layoutKey || (ou(t, e.attributeData), this._generateBufferKey(t)), r || (r = t.topology);
        const n = Ly(t._layoutKey, e._layoutKey, s.data, s._blendModeId, Oy[r]);
        return this._pipeCache[n] ? this._pipeCache[n] : (this._pipeCache[n] = this._createPipeline(t, e, s, r), this._pipeCache[n])
    }
    _createPipeline(t, e, s, r) {
        const n = this._gpu.device,
            o = this._createVertexBufferLayouts(t, e),
            a = this._renderer.state.getColorTargets(s, this._colorTargetCount),
            h = this._stencilMode === Ct.RENDERING_MASK_ADD ? 0 : this._colorMask;
        for (let d = 0; d < a.length; d++) a[d].writeMask = h;
        const l = this._renderer.shader.getProgramData(e).pipeline,
            c = {
                vertex: {
                    module: this._getModule(e.vertex.source),
                    entryPoint: e.vertex.entryPoint,
                    buffers: o
                },
                fragment: {
                    module: this._getModule(e.fragment.source),
                    entryPoint: e.fragment.entryPoint,
                    targets: a
                },
                primitive: {
                    topology: r,
                    cullMode: s.cullMode
                },
                layout: l,
                multisample: {
                    count: this._multisampleCount
                },
                label: "PIXI Pipeline"
            };
        return this._depthStencilAttachment && (c.depthStencil = {
            ...this._stencilState,
            format: "depth24plus-stencil8",
            depthWriteEnabled: s.depthTest,
            depthCompare: s.depthTest ? "less" : "always"
        }), n.createRenderPipeline(c)
    }
    _getModule(t) {
        return this._moduleCache[t] || this._createModule(t)
    }
    _createModule(t) {
        const e = this._gpu.device;
        return this._moduleCache[t] = e.createShaderModule({
            code: t
        }), this._moduleCache[t]
    }
    _generateBufferKey(t) {
        const e = [];
        let s = 0;
        const r = Object.keys(t.attributes).sort();
        for (let o = 0; o < r.length; o++) {
            const a = t.attributes[r[o]];
            e[s++] = a.offset, e[s++] = a.format, e[s++] = a.stride, e[s++] = a.instance
        }
        const n = e.join("|");
        return t._layoutKey = js(n, "geometry"), t._layoutKey
    }
    _generateAttributeLocationsKey(t) {
        const e = [];
        let s = 0;
        const r = Object.keys(t.attributeData).sort();
        for (let o = 0; o < r.length; o++) {
            const a = t.attributeData[r[o]];
            e[s++] = a.location
        }
        const n = e.join("|");
        return t._attributeLocationsKey = js(n, "programAttributes"), t._attributeLocationsKey
    }
    getBufferNamesToBind(t, e) {
        const s = t._layoutKey << 16 | e._attributeLocationsKey;
        if (this._bindingNamesCache[s]) return this._bindingNamesCache[s];
        const r = this._createVertexBufferLayouts(t, e),
            n = Object.create(null),
            o = e.attributeData;
        for (let a = 0; a < r.length; a++) {
            const l = Object.values(r[a].attributes)[0].shaderLocation;
            for (const c in o)
                if (o[c].location === l) {
                    n[a] = c;
                    break
                }
        }
        return this._bindingNamesCache[s] = n, n
    }
    _createVertexBufferLayouts(t, e) {
        e._attributeLocationsKey || this._generateAttributeLocationsKey(e);
        const s = t._layoutKey << 16 | e._attributeLocationsKey;
        if (this._bufferLayoutsCache[s]) return this._bufferLayoutsCache[s];
        const r = [];
        return t.buffers.forEach(n => {
            const o = {
                    arrayStride: 0,
                    stepMode: "vertex",
                    attributes: []
                },
                a = o.attributes;
            for (const h in e.attributeData) {
                const l = t.attributes[h];
                (l.divisor ?? 1) !== 1 && V(`Attribute ${h} has an invalid divisor value of '${l.divisor}'. WebGPU only supports a divisor value of 1`), l.buffer === n && (o.arrayStride = l.stride, o.stepMode = l.instance ? "instance" : "vertex", a.push({
                    shaderLocation: e.attributeData[h].location,
                    offset: l.offset,
                    format: l.format
                }))
            }
            a.length && r.push(o)
        }), this._bufferLayoutsCache[s] = r, r
    }
    _updatePipeHash() {
        const t = Dy(this._stencilMode, this._multisampleCount, this._colorMask, this._depthStencilAttachment, this._colorTargetCount);
        this._pipeStateCaches[t] || (this._pipeStateCaches[t] = Object.create(null)), this._pipeCache = this._pipeStateCaches[t]
    }
    destroy() {
        this._renderer = null, this._bufferLayoutsCache = null
    }
}
Uu.extension = {
    type: [w.WebGPUSystem],
    name: "pipeline"
};
class Uy {
    constructor() {
        this.contexts = [], this.msaaTextures = [], this.msaaSamples = 1
    }
}
class Ny {
    init(t, e) {
        this._renderer = t, this._renderTargetSystem = e
    }
    copyToTexture(t, e, s, r, n) {
        const o = this._renderer,
            a = this._getGpuColorTexture(t),
            h = o.texture.getGpuSource(e.source);
        return o.encoder.commandEncoder.copyTextureToTexture({
            texture: a,
            origin: s
        }, {
            texture: h,
            origin: n
        }, r), e
    }
    startRenderPass(t, e = !0, s, r, n = 0, o = 0) {
        var c, u;
        const h = this._renderTargetSystem.getGpuRenderTarget(t);
        if (o !== 0 && ((c = h.msaaTextures) != null && c.length)) throw new Error("[RenderTargetSystem] Rendering to array layers is not supported with MSAA render targets.");
        if (n > 0 && ((u = h.msaaTextures) != null && u.length)) throw new Error("[RenderTargetSystem] Rendering to mip levels is not supported with MSAA render targets.");
        const l = this.getDescriptor(t, e, s, n, o);
        h.descriptor = l, this._renderer.pipeline.setRenderTarget(h), this._renderer.encoder.beginRenderPass(h), this._renderer.encoder.setViewport(r)
    }
    finishRenderPass() {
        this._renderer.encoder.endRenderPass()
    }
    _getGpuColorTexture(t) {
        const e = this._renderTargetSystem.getGpuRenderTarget(t);
        return e.contexts[0] ? e.contexts[0].getCurrentTexture() : this._renderer.texture.getGpuSource(t.colorTextures[0].source)
    }
    getDescriptor(t, e, s, r = 0, n = 0) {
        typeof e == "boolean" && (e = e ? Nt.ALL : Nt.NONE);
        const o = this._renderTargetSystem,
            a = o.getGpuRenderTarget(t),
            h = t.colorTextures.map((u, d) => {
                const f = a.contexts[d];
                let p, m;
                if (f) {
                    if (n !== 0) throw new Error("[RenderTargetSystem] Rendering to array layers is not supported for canvas targets.");
                    p = f.getCurrentTexture().createView()
                } else p = this._renderer.texture.getGpuSource(u).createView({
                    dimension: "2d",
                    baseMipLevel: r,
                    mipLevelCount: 1,
                    baseArrayLayer: n,
                    arrayLayerCount: 1
                });
                a.msaaTextures[d] && (m = p, p = this._renderer.texture.getTextureView(a.msaaTextures[d]));
                const g = e & Nt.COLOR ? "clear" : "load";
                return s ?? (s = o.defaultClearColor), {
                    view: p,
                    resolveTarget: m,
                    clearValue: s,
                    storeOp: "store",
                    loadOp: g
                }
            });
        let l;
        if ((t.stencil || t.depth) && !t.depthStencilTexture && (t.ensureDepthStencilTexture(), t.depthStencilTexture.source.sampleCount = a.msaa ? 4 : 1), t.depthStencilTexture) {
            const u = e & Nt.STENCIL ? "clear" : "load",
                d = e & Nt.DEPTH ? "clear" : "load";
            l = {
                view: this._renderer.texture.getGpuSource(t.depthStencilTexture.source).createView({
                    dimension: "2d",
                    baseMipLevel: r,
                    mipLevelCount: 1,
                    baseArrayLayer: n,
                    arrayLayerCount: 1
                }),
                stencilStoreOp: "store",
                stencilLoadOp: u,
                depthClearValue: 1,
                depthLoadOp: d,
                depthStoreOp: "store"
            }
        }
        return {
            colorAttachments: h,
            depthStencilAttachment: l
        }
    }
    clear(t, e = !0, s, r, n = 0, o = 0) {
        if (!e) return;
        const {
            gpu: a,
            encoder: h
        } = this._renderer, l = a.device;
        if (h.commandEncoder === null) {
            const u = l.createCommandEncoder(),
                d = this.getDescriptor(t, e, s, n, o),
                f = u.beginRenderPass(d);
            f.setViewport(r.x, r.y, r.width, r.height, 0, 1), f.end();
            const p = u.finish();
            l.queue.submit([p])
        } else this.startRenderPass(t, e, s, r, n, o)
    }
    initGpuRenderTarget(t) {
        t.isRoot = !0;
        const e = new Uy;
        return e.colorTargetCount = t.colorTextures.length, t.colorTextures.forEach((s, r) => {
            if (s instanceof re) {
                const n = s.resource.getContext("webgpu"),
                    o = s.transparent ? "premultiplied" : "opaque";
                try {
                    n.configure({
                        device: this._renderer.gpu.device,
                        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
                        format: "bgra8unorm",
                        alphaMode: o
                    })
                } catch (a) {
                    console.error(a)
                }
                e.contexts[r] = n
            }
            if (e.msaa = s.source.antialias, s.source.antialias) {
                const n = new At({
                    width: 0,
                    height: 0,
                    sampleCount: 4,
                    arrayLayerCount: s.source.arrayLayerCount
                });
                e.msaaTextures[r] = n
            }
        }), e.msaa && (e.msaaSamples = 4, t.depthStencilTexture && (t.depthStencilTexture.source.sampleCount = 4)), e
    }
    destroyGpuRenderTarget(t) {
        t.contexts.forEach(e => {
            e.unconfigure()
        }), t.msaaTextures.forEach(e => {
            e.destroy()
        }), t.msaaTextures.length = 0, t.contexts.length = 0
    }
    ensureDepthStencilTexture(t) {
        const e = this._renderTargetSystem.getGpuRenderTarget(t);
        t.depthStencilTexture && e.msaa && (t.depthStencilTexture.source.sampleCount = 4)
    }
    resizeGpuRenderTarget(t) {
        const e = this._renderTargetSystem.getGpuRenderTarget(t);
        e.width = t.width, e.height = t.height, e.msaa && t.colorTextures.forEach((s, r) => {
            const n = e.msaaTextures[r];
            n == null || n.resize(s.source.width, s.source.height, s.source._resolution)
        })
    }
}
class Nu extends lo {
    constructor(t) {
        super(t), this.adaptor = new Ny, this.adaptor.init(t, this)
    }
}
Nu.extension = {
    type: [w.WebGPUSystem],
    name: "renderTarget"
};
class Wu {
    constructor() {
        this._gpuProgramData = Object.create(null)
    }
    contextChange(t) {
        this._gpu = t
    }
    getProgramData(t) {
        return this._gpuProgramData[t._layoutKey] || this._createGPUProgramData(t)
    }
    _createGPUProgramData(t) {
        const e = this._gpu.device,
            s = t.gpuLayout.map(n => e.createBindGroupLayout({
                entries: n
            })),
            r = {
                bindGroupLayouts: s
            };
        return this._gpuProgramData[t._layoutKey] = {
            bindGroups: s,
            pipeline: e.createPipelineLayout(r)
        }, this._gpuProgramData[t._layoutKey]
    }
    destroy() {
        this._gpu = null, this._gpuProgramData = null
    }
}
Wu.extension = {
    type: [w.WebGPUSystem],
    name: "shader"
};
const Dt = {};
Dt.normal = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    }
};
Dt.add = {
    alpha: {
        srcFactor: "src-alpha",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "one",
        dstFactor: "one",
        operation: "add"
    }
};
Dt.multiply = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "dst",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    }
};
Dt.screen = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "one",
        dstFactor: "one-minus-src",
        operation: "add"
    }
};
Dt.overlay = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "one",
        dstFactor: "one-minus-src",
        operation: "add"
    }
};
Dt.none = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "zero",
        dstFactor: "zero",
        operation: "add"
    }
};
Dt["normal-npm"] = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "src-alpha",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    }
};
Dt["add-npm"] = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one",
        operation: "add"
    },
    color: {
        srcFactor: "src-alpha",
        dstFactor: "one",
        operation: "add"
    }
};
Dt["screen-npm"] = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "src-alpha",
        dstFactor: "one-minus-src",
        operation: "add"
    }
};
Dt.erase = {
    alpha: {
        srcFactor: "zero",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    color: {
        srcFactor: "zero",
        dstFactor: "one-minus-src",
        operation: "add"
    }
};
Dt.min = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one",
        operation: "min"
    },
    color: {
        srcFactor: "one",
        dstFactor: "one",
        operation: "min"
    }
};
Dt.max = {
    alpha: {
        srcFactor: "one",
        dstFactor: "one",
        operation: "max"
    },
    color: {
        srcFactor: "one",
        dstFactor: "one",
        operation: "max"
    }
};
class Hu {
    constructor() {
        this.defaultState = new _e, this.defaultState.blend = !0
    }
    contextChange(t) {
        this.gpu = t
    }
    getColorTargets(t, e) {
        const s = Dt[t.blendMode] || Dt.normal,
            r = [],
            n = {
                format: "bgra8unorm",
                writeMask: 0,
                blend: s
            };
        for (let o = 0; o < e; o++) r[o] = n;
        return r
    }
    destroy() {
        this.gpu = null
    }
}
Hu.extension = {
    type: [w.WebGPUSystem],
    name: "state"
};
const Wy = {
        type: "image",
        upload(i, t, e, s = 0) {
            const r = i.resource,
                n = (i.pixelWidth | 0) * (i.pixelHeight | 0),
                o = r.byteLength / n;
            e.device.queue.writeTexture({
                texture: t,
                origin: {
                    x: 0,
                    y: 0,
                    z: s
                }
            }, r, {
                offset: 0,
                rowsPerImage: i.pixelHeight,
                bytesPerRow: i.pixelWidth * o
            }, {
                width: i.pixelWidth,
                height: i.pixelHeight,
                depthOrArrayLayers: 1
            })
        }
    },
    zu = {
        "bc1-rgba-unorm": {
            blockBytes: 8,
            blockWidth: 4,
            blockHeight: 4
        },
        "bc2-rgba-unorm": {
            blockBytes: 16,
            blockWidth: 4,
            blockHeight: 4
        },
        "bc3-rgba-unorm": {
            blockBytes: 16,
            blockWidth: 4,
            blockHeight: 4
        },
        "bc7-rgba-unorm": {
            blockBytes: 16,
            blockWidth: 4,
            blockHeight: 4
        },
        "etc1-rgb-unorm": {
            blockBytes: 8,
            blockWidth: 4,
            blockHeight: 4
        },
        "etc2-rgba8unorm": {
            blockBytes: 16,
            blockWidth: 4,
            blockHeight: 4
        },
        "astc-4x4-unorm": {
            blockBytes: 16,
            blockWidth: 4,
            blockHeight: 4
        }
    },
    Hy = {
        blockBytes: 4,
        blockWidth: 1,
        blockHeight: 1
    },
    zy = {
        type: "compressed",
        upload(i, t, e, s = 0) {
            let r = i.pixelWidth,
                n = i.pixelHeight;
            const o = zu[i.format] || Hy;
            for (let a = 0; a < i.resource.length; a++) {
                const h = i.resource[a],
                    l = Math.ceil(r / o.blockWidth) * o.blockBytes;
                e.device.queue.writeTexture({
                    texture: t,
                    mipLevel: a,
                    origin: {
                        x: 0,
                        y: 0,
                        z: s
                    }
                }, h, {
                    offset: 0,
                    bytesPerRow: l
                }, {
                    width: Math.ceil(r / o.blockWidth) * o.blockWidth,
                    height: Math.ceil(n / o.blockHeight) * o.blockHeight,
                    depthOrArrayLayers: 1
                }), r = Math.max(r >> 1, 1), n = Math.max(n >> 1, 1)
            }
        }
    },
    ph = ["right", "left", "top", "bottom", "front", "back"];

function Vy(i) {
    return {
        type: "cube",
        upload(t, e, s) {
            const r = t.faces;
            for (let n = 0; n < ph.length; n++) {
                const o = ph[n],
                    a = r[o];
                (i[a.uploadMethodId] || i.image).upload(a, e, s, n)
            }
        }
    }
}
const Vu = {
        type: "image",
        upload(i, t, e, s = 0) {
            const r = i.resource;
            if (!r) return;
            if (globalThis.HTMLImageElement && r instanceof HTMLImageElement) {
                const h = X.get().createCanvas(r.width, r.height);
                h.getContext("2d").drawImage(r, 0, 0, r.width, r.height), i.resource = h, V("ImageSource: Image element passed, converting to canvas and replacing resource.")
            }
            const n = Math.min(t.width, i.resourceWidth || i.pixelWidth),
                o = Math.min(t.height, i.resourceHeight || i.pixelHeight),
                a = i.alphaMode === "premultiply-alpha-on-upload";
            e.device.queue.copyExternalImageToTexture({
                source: r
            }, {
                texture: t,
                origin: {
                    x: 0,
                    y: 0,
                    z: s
                },
                premultipliedAlpha: a
            }, {
                width: n,
                height: o
            })
        }
    },
    Xy = {
        type: "video",
        upload(i, t, e, s) {
            Vu.upload(i, t, e, s)
        }
    };
class Yy {
    constructor(t) {
        this.device = t, this.sampler = t.createSampler({
            minFilter: "linear"
        }), this.pipelines = {}
    }
    _getMipmapPipeline(t) {
        let e = this.pipelines[t];
        return e || (this.mipmapShaderModule || (this.mipmapShaderModule = this.device.createShaderModule({
            code: `
                        var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
                        vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

                        struct VertexOutput {
                        @builtin(position) position : vec4<f32>,
                        @location(0) texCoord : vec2<f32>,
                        };

                        @vertex
                        fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
                        var output : VertexOutput;
                        output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
                        output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                        return output;
                        }

                        @group(0) @binding(0) var imgSampler : sampler;
                        @group(0) @binding(1) var img : texture_2d<f32>;

                        @fragment
                        fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
                        return textureSample(img, imgSampler, texCoord);
                        }
                    `
        })), e = this.device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: this.mipmapShaderModule,
                entryPoint: "vertexMain"
            },
            fragment: {
                module: this.mipmapShaderModule,
                entryPoint: "fragmentMain",
                targets: [{
                    format: t
                }]
            }
        }), this.pipelines[t] = e), e
    }
    generateMipmap(t) {
        const e = this._getMipmapPipeline(t.format);
        if (t.dimension === "3d" || t.dimension === "1d") throw new Error("Generating mipmaps for non-2d textures is currently unsupported!");
        let s = t;
        const r = t.depthOrArrayLayers || 1,
            n = t.usage & GPUTextureUsage.RENDER_ATTACHMENT;
        if (!n) {
            const h = {
                size: {
                    width: Math.ceil(t.width / 2),
                    height: Math.ceil(t.height / 2),
                    depthOrArrayLayers: r
                },
                format: t.format,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
                mipLevelCount: t.mipLevelCount - 1
            };
            s = this.device.createTexture(h)
        }
        const o = this.device.createCommandEncoder({}),
            a = e.getBindGroupLayout(0);
        for (let h = 0; h < r; ++h) {
            let l = t.createView({
                    baseMipLevel: 0,
                    mipLevelCount: 1,
                    dimension: "2d",
                    baseArrayLayer: h,
                    arrayLayerCount: 1
                }),
                c = n ? 1 : 0;
            for (let u = 1; u < t.mipLevelCount; ++u) {
                const d = s.createView({
                        baseMipLevel: c++,
                        mipLevelCount: 1,
                        dimension: "2d",
                        baseArrayLayer: h,
                        arrayLayerCount: 1
                    }),
                    f = o.beginRenderPass({
                        colorAttachments: [{
                            view: d,
                            storeOp: "store",
                            loadOp: "clear",
                            clearValue: {
                                r: 0,
                                g: 0,
                                b: 0,
                                a: 0
                            }
                        }]
                    }),
                    p = this.device.createBindGroup({
                        layout: a,
                        entries: [{
                            binding: 0,
                            resource: this.sampler
                        }, {
                            binding: 1,
                            resource: l
                        }]
                    });
                f.setPipeline(e), f.setBindGroup(0, p), f.draw(3, 1, 0, 0), f.end(), l = d
            }
        }
        if (!n) {
            const h = {
                width: Math.ceil(t.width / 2),
                height: Math.ceil(t.height / 2),
                depthOrArrayLayers: r
            };
            for (let l = 1; l < t.mipLevelCount; ++l) o.copyTextureToTexture({
                texture: s,
                mipLevel: l - 1
            }, {
                texture: t,
                mipLevel: l
            }, h), h.width = Math.ceil(h.width / 2), h.height = Math.ceil(h.height / 2)
        }
        return this.device.queue.submit([o.finish()]), n || s.destroy(), t
    }
}
class $y {
    constructor(t) {
        this.textureView = null, this.gpuTexture = t
    }
    destroy() {
        this.gpuTexture.destroy(), this.textureView = null, this.gpuTexture = null
    }
}
class Xu {
    constructor(t) {
        this._gpuSamplers = Object.create(null), this._bindGroupHash = Object.create(null), this._renderer = t, t.gc.addCollection(this, "_bindGroupHash", "hash"), this._managedTextures = new oe({
            renderer: t,
            type: "resource",
            onUnload: this.onSourceUnload.bind(this),
            name: "gpuTextureSource"
        });
        const e = {
            image: Vu,
            buffer: Wy,
            video: Xy,
            compressed: zy
        };
        this._uploads = {
            ...e,
            cube: Vy(e)
        }
    }
    get managedTextures() {
        return Object.values(this._managedTextures.items)
    }
    contextChange(t) {
        this._gpu = t
    }
    initSource(t) {
        var e;
        return ((e = t._gpuData[this._renderer.uid]) == null ? void 0 : e.gpuTexture) || this._initSource(t)
    }
    _initSource(t) {
        if (t.autoGenerateMipmaps) {
            const l = Math.max(t.pixelWidth, t.pixelHeight);
            t.mipLevelCount = Math.floor(Math.log2(l)) + 1
        }
        let e = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
        t.uploadMethodId !== "compressed" && (e |= GPUTextureUsage.RENDER_ATTACHMENT, e |= GPUTextureUsage.COPY_SRC);
        const s = zu[t.format] || {
                blockWidth: 1,
                blockHeight: 1
            },
            r = Math.ceil(t.pixelWidth / s.blockWidth) * s.blockWidth,
            n = Math.ceil(t.pixelHeight / s.blockHeight) * s.blockHeight,
            o = {
                label: t.label,
                size: {
                    width: r,
                    height: n,
                    depthOrArrayLayers: t.arrayLayerCount
                },
                format: t.format,
                sampleCount: t.sampleCount,
                mipLevelCount: t.mipLevelCount,
                dimension: t.dimension,
                usage: e
            },
            a = this._gpu.device.createTexture(o);
        return t._gpuData[this._renderer.uid] = new $y(a), this._managedTextures.add(t) && (t.on("update", this.onSourceUpdate, this), t.on("resize", this.onSourceResize, this), t.on("updateMipmaps", this.onUpdateMipmaps, this)), this.onSourceUpdate(t), a
    }
    onSourceUpdate(t) {
        const e = this.getGpuSource(t);
        e && (this._uploads[t.uploadMethodId] && this._uploads[t.uploadMethodId].upload(t, e, this._gpu), t.autoGenerateMipmaps && t.mipLevelCount > 1 && this.onUpdateMipmaps(t))
    }
    onUpdateMipmaps(t) {
        this._mipmapGenerator || (this._mipmapGenerator = new Yy(this._gpu.device));
        const e = this.getGpuSource(t);
        this._mipmapGenerator.generateMipmap(e)
    }
    onSourceUnload(t) {
        t.off("update", this.onSourceUpdate, this), t.off("resize", this.onSourceResize, this), t.off("updateMipmaps", this.onUpdateMipmaps, this)
    }
    onSourceResize(t) {
        t._gcLastUsed = this._renderer.gc.now;
        const e = t._gpuData[this._renderer.uid],
            s = e == null ? void 0 : e.gpuTexture;
        s ? (s.width !== t.pixelWidth || s.height !== t.pixelHeight) && (e.destroy(), this._bindGroupHash[t.uid] = null, t._gpuData[this._renderer.uid] = null, this.initSource(t)) : this.initSource(t)
    }
    _initSampler(t) {
        return this._gpuSamplers[t._resourceId] = this._gpu.device.createSampler(t), this._gpuSamplers[t._resourceId]
    }
    getGpuSampler(t) {
        return this._gpuSamplers[t._resourceId] || this._initSampler(t)
    }
    getGpuSource(t) {
        var e;
        return t._gcLastUsed = this._renderer.gc.now, ((e = t._gpuData[this._renderer.uid]) == null ? void 0 : e.gpuTexture) || this.initSource(t)
    }
    getTextureBindGroup(t) {
        return this._bindGroupHash[t.uid] || this._createTextureBindGroup(t)
    }
    _createTextureBindGroup(t) {
        const e = t.source;
        return this._bindGroupHash[t.uid] = new Se({
            0: e,
            1: e.style,
            2: new te({
                uTextureMatrix: {
                    type: "mat3x3<f32>",
                    value: t.textureMatrix.mapCoord
                }
            })
        }), this._bindGroupHash[t.uid]
    }
    getTextureView(t) {
        const e = t.source;
        e._gcLastUsed = this._renderer.gc.now;
        let s = e._gpuData[this._renderer.uid];
        return s || (this.initSource(e), s = e._gpuData[this._renderer.uid]), s.textureView || (s.textureView = s.gpuTexture.createView({
            dimension: e.viewDimension
        })), s.textureView
    }
    generateCanvas(t) {
        const e = this._renderer,
            s = e.gpu.device.createCommandEncoder(),
            r = X.get().createCanvas();
        r.width = t.source.pixelWidth, r.height = t.source.pixelHeight;
        const n = r.getContext("webgpu");
        return n.configure({
            device: e.gpu.device,
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
            format: X.get().getNavigator().gpu.getPreferredCanvasFormat(),
            alphaMode: "premultiplied"
        }), s.copyTextureToTexture({
            texture: e.texture.getGpuSource(t.source),
            origin: {
                x: 0,
                y: 0
            }
        }, {
            texture: n.getCurrentTexture()
        }, {
            width: r.width,
            height: r.height
        }), e.gpu.device.queue.submit([s.finish()]), r
    }
    getPixels(t) {
        const e = this.generateCanvas(t),
            s = Xe.getOptimalCanvasAndContext(e.width, e.height),
            r = s.context;
        r.drawImage(e, 0, 0);
        const {
            width: n,
            height: o
        } = e, a = r.getImageData(0, 0, n, o), h = new Uint8ClampedArray(a.data.buffer);
        return Xe.returnCanvasAndContext(s), {
            pixels: h,
            width: n,
            height: o
        }
    }
    destroy() {
        this._managedTextures.destroy();
        for (const t of Object.keys(this._bindGroupHash)) {
            const e = Number(t),
                s = this._bindGroupHash[e];
            s == null || s.destroy()
        }
        this._renderer = null, this._gpu = null, this._mipmapGenerator = null, this._gpuSamplers = null, this._bindGroupHash = null
    }
}
Xu.extension = {
    type: [w.WebGPUSystem],
    name: "texture"
};
class Yu {
    constructor() {
        this._maxTextures = 0
    }
    contextChange(t) {
        const e = new te({
            uTransformMatrix: {
                value: new N,
                type: "mat3x3<f32>"
            },
            uColor: {
                value: new Float32Array([1, 1, 1, 1]),
                type: "vec4<f32>"
            },
            uRound: {
                value: 0,
                type: "f32"
            }
        });
        this._maxTextures = t.limits.maxBatchableTextures;
        const s = En({
            name: "graphics",
            bits: [Ol, Dl(this._maxTextures), i_, kn]
        });
        this.shader = new ge({
            gpuProgram: s,
            resources: {
                localUniforms: e
            }
        })
    }
    execute(t, e) {
        const s = e.context,
            r = s.customShader || this.shader,
            n = t.renderer,
            o = n.graphicsContext,
            {
                batcher: a,
                instructions: h
            } = o.getContextRenderData(s),
            l = n.encoder;
        l.setGeometry(a.geometry, r.gpuProgram);
        const c = n.globalUniforms.bindGroup;
        l.setBindGroup(0, c, r.gpuProgram);
        const u = n.renderPipes.uniformBatch.getUniformBindGroup(r.resources.localUniforms, !0);
        l.setBindGroup(2, u, r.gpuProgram);
        const d = h.instructions;
        let f = null;
        for (let p = 0; p < h.instructionSize; p++) {
            const m = d[p];
            if (m.topology !== f && (f = m.topology, l.setPipelineFromGeometryProgramAndState(a.geometry, r.gpuProgram, t.state, m.topology)), r.groups[1] = m.bindGroup, !m.gpuBindGroup) {
                const g = m.textures;
                m.bindGroup = An(g.textures, g.count, this._maxTextures), m.gpuBindGroup = n.bindGroup.getBindGroup(m.bindGroup, r.gpuProgram, 1)
            }
            l.setBindGroup(1, m.bindGroup, r.gpuProgram), l.renderPassEncoder.drawIndexed(m.size, 1, m.start)
        }
    }
    destroy() {
        this.shader.destroy(!0), this.shader = null
    }
}
Yu.extension = {
    type: [w.WebGPUPipesAdaptor],
    name: "graphics"
};
class $u {
    init() {
        const t = En({
            name: "mesh",
            bits: [ki, z_, kn]
        });
        this._shader = new ge({
            gpuProgram: t,
            resources: {
                uTexture: O.EMPTY._source,
                uSampler: O.EMPTY._source.style,
                textureUniforms: {
                    uTextureMatrix: {
                        type: "mat3x3<f32>",
                        value: new N
                    }
                }
            }
        })
    }
    execute(t, e) {
        const s = t.renderer;
        let r = e._shader;
        if (!r) r = this._shader, r.groups[2] = s.texture.getTextureBindGroup(e.texture);
        else if (!r.gpuProgram) {
            V("Mesh shader has no gpuProgram", e.shader);
            return
        }
        const n = r.gpuProgram;
        if (n.autoAssignGlobalUniforms && (r.groups[0] = s.globalUniforms.bindGroup), n.autoAssignLocalUniforms) {
            const o = t.localUniforms;
            r.groups[1] = s.renderPipes.uniformBatch.getUniformBindGroup(o, !0)
        }
        s.encoder.draw({
            geometry: e._geometry,
            shader: r,
            state: e.state
        })
    }
    destroy() {
        this._shader.destroy(!0), this._shader = null
    }
}
$u.extension = {
    type: [w.WebGPUPipesAdaptor],
    name: "mesh"
};
const jy = [...ho, Lu, Gu, mo, Fu, Bu, Xu, Nu, Wu, Hu, Uu, Iu, Ou, Ru],
    qy = [...Qc, Du],
    Ky = [Ec, $u, Yu],
    ju = [],
    qu = [],
    Ku = [];
Y.handleByNamedList(w.WebGPUSystem, ju);
Y.handleByNamedList(w.WebGPUPipes, qu);
Y.handleByNamedList(w.WebGPUPipesAdaptor, Ku);
Y.add(...jy, ...qy, ...Ky);
class Zy extends ri {
    constructor() {
        const t = {
            name: "webgpu",
            type: Vt.WEBGPU,
            systems: ju,
            renderPipes: qu,
            renderPipeAdaptors: Ku
        };
        super(t)
    }
}
const Qy = Object.freeze(Object.defineProperty({
    __proto__: null,
    WebGPURenderer: Zy
}, Symbol.toStringTag, {
    value: "Module"
}));
class Jy extends Sc {
    constructor(t, e) {
        super();
        const {
            textures: s,
            data: r
        } = t;
        Object.keys(r.pages).forEach(n => {
            const o = r.pages[parseInt(n, 10)],
                a = s[o.id];
            this.pages.push({
                texture: a
            })
        }), Object.keys(r.chars).forEach(n => {
            const o = r.chars[n],
                {
                    frame: a,
                    source: h,
                    rotate: l
                } = s[o.page],
                c = tt.transformRectCoords(o, a, l, new nt),
                u = new O({
                    frame: c,
                    orig: new nt(0, 0, o.width, o.height),
                    source: h,
                    rotate: l
                });
            this.chars[n] = {
                id: n.codePointAt(0),
                xOffset: o.xOffset,
                yOffset: o.yOffset,
                xAdvance: o.xAdvance,
                kerning: o.kerning ?? {},
                texture: u
            }
        }), this.baseRenderedFontSize = r.fontSize, this.baseMeasurementFontSize = r.fontSize, this.fontMetrics = {
            ascent: 0,
            descent: 0,
            fontSize: r.fontSize
        }, this.baseLineOffset = r.baseLineOffset, this.lineHeight = r.lineHeight, this.fontFamily = r.fontFamily, this.distanceField = r.distanceField ?? {
            type: "none",
            range: 0
        }, this.url = e
    }
    destroy() {
        super.destroy();
        for (let t = 0; t < this.pages.length; t++) {
            const {
                texture: e
            } = this.pages[t];
            e.destroy(!0)
        }
        this.pages = null
    }
    static install(t) {
        ih.install(t)
    }
    static uninstall(t) {
        ih.uninstall(t)
    }
}
const tb = Object.freeze(Object.defineProperty({
    __proto__: null,
    BitmapFont: Jy
}, Symbol.toStringTag, {
    value: "Module"
}));
Y.add(od, ad);

function eb() {
    return ["data:font/woff2;charset=utf-8;base64,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"]
}
const Rt = "Trajan Pro";
async function sb() {
    if (typeof document > "u" || !("fonts" in document) || typeof FontFace > "u") return;
    const [i] = eb(), e = await new FontFace(Rt, `url(${i})`).load();
    document.fonts.add(e), await document.fonts.load(`16px "${Rt}"`)
}
const ib = {
    "throne1.webp": {
        topContact: 180 / 303,
        bottomContact: 299 / 303,
        leftContact: 16 / 467,
        rightContact: 446 / 467,
        rigAttachY: 180 / 303,
        leftRigAttach: 172 / 467,
        rightRigAttach: 305 / 467
    },
    "throne2.webp": {
        topContact: 97 / 303,
        bottomContact: 181 / 303,
        leftContact: 96 / 467,
        rightContact: 419 / 467,
        rigAttachY: 110 / 303,
        leftRigAttach: 169 / 467,
        rightRigAttach: 327 / 467
    },
    "throne3.webp": {
        topContact: 33 / 303,
        bottomContact: 235 / 303,
        leftContact: 96 / 467,
        rightContact: 419 / 467,
        rigAttachY: 118 / 303,
        leftRigAttach: 175 / 467,
        rightRigAttach: 290 / 467
    }
};

function ai(i) {
    return ib[i]
}

function rb(i) {
    const t = ai(i.textureName);
    return i.y + (t.topContact - .5) * i.height
}

function mh(i) {
    const t = ai(i.textureName);
    return i.y + (t.bottomContact - .5) * i.height
}

function nb(i, t) {
    const e = ai(i);
    return (e.bottomContact - e.topContact) * t
}

function gh({
    textureName: i,
    blockHeight: t,
    surfaceY: e
}) {
    const s = ai(i);
    return e - (s.bottomContact - .5) * t
}

function ob({
    dropX: i,
    blockWidth: t,
    targetLeft: e,
    targetRight: s
}) {
    const r = (e + s) / 2,
        o = (i - r) / (t / 2),
        a = Math.abs(o),
        h = i - t / 2,
        l = i + t / 2,
        c = Math.max(h, e),
        u = Math.min(l, s);
    if (Math.max(0, u - c) === 0) return {
        kind: "miss",
        multiplier: 1,
        offsetRatio: o,
        placedCenterX: r
    };
    const f = (c + u) / 2;
    return a < .15 ? {
        kind: "perfect",
        multiplier: 1.5,
        offsetRatio: o,
        placedCenterX: f
    } : a < .45 ? {
        kind: "good",
        multiplier: 1.2,
        offsetRatio: o,
        placedCenterX: f
    } : {
        kind: "bad",
        multiplier: 1,
        offsetRatio: o,
        placedCenterX: f
    }
}

function _h(i, t) {
    return i * t.reduce((e, s) => e * s, 1)
}

function xh(i) {
    return [2, 3.6, 4.5][i] ?? 4.5
}
const H = 1080,
    J = 1920,
    Zu = 6,
    It = .44,
    Qu = ["bg main new.webp", "log twr.webp", "throne1.webp", "kruk.webp", "chalki.webp", "but cash out.webp", "but build.webp", "platform wide.webp"],
    St = {
        logo: {
            x: 540,
            y: 190,
            width: 820,
            height: 427
        },
        suspendedPiece: {
            x: 720,
            width: 510,
            height: 331,
            rotation: -.37
        },
        pedestal: {
            topY: 1620,
            height: 500
        },
        cashOut: {
            x: 200,
            y: 1640,
            width: 480,
            height: 260
        },
        buildButton: {
            x: 760,
            y: 1640,
            width: 560,
            height: 260
        },
        guideArrow: {
            x: 820,
            y: 1520,
            scale: 1
        }
    },
    ab = .12,
    hb = .02,
    lb = .9,
    cb = .03;

function Is(i, t) {
    return Math.round(i / H * t)
}

function Re(i, t) {
    return Math.round(i / J * t)
}

function le(i, t, e) {
    return Number((i * Math.min(t / H, e / J)).toFixed(3))
}

function Ei(i, t, e, s) {
    return {
        left: Math.round(i - e / 2),
        right: Math.round(i + e / 2),
        top: Math.round(t - s / 2),
        bottom: Math.round(t + s / 2)
    }
}

function $s({
    width: i,
    height: t
}) {
    const e = le(St.logo.width, i, t),
        s = le(St.logo.height, i, t),
        r = le(St.suspendedPiece.width, i, t),
        n = le(St.suspendedPiece.height, i, t),
        o = le(St.cashOut.width, i, t),
        a = le(St.cashOut.height, i, t),
        h = le(St.buildButton.width, i, t),
        l = le(St.buildButton.height, i, t),
        c = Is(St.logo.x, i),
        u = Re(St.logo.y, t),
        d = Is(St.suspendedPiece.x, i),
        f = Re(680, t),
        p = Is(St.cashOut.x, i),
        m = Re(St.cashOut.y, t),
        g = Is(St.buildButton.x, i),
        _ = Re(St.buildButton.y, t),
        x = t * ab,
        b = i * hb,
        y = t * lb,
        S = i * cb;
    return {
        logo: {
            x: c,
            y: u,
            width: e,
            height: s,
            bounds: Ei(c, u, e, s)
        },
        suspendedPiece: {
            x: d,
            y: f,
            width: r,
            height: n,
            rotation: St.suspendedPiece.rotation,
            bounds: Ei(d, f, r, n)
        },
        pedestal: {
            topY: Re(St.pedestal.topY, t),
            height: Re(St.pedestal.height, t)
        },
        hud: {
            buttonHeight: x,
            gap: b,
            buttonY: y,
            cashOutCenterOffsetX: S
        },
        cashOut: {
            x: p,
            y: m,
            width: o,
            height: a,
            bounds: Ei(p, m, o, a)
        },
        buildButton: {
            x: g,
            y: _,
            width: h,
            height: l,
            bounds: Ei(g, _, h, l)
        },
        guideArrow: {
            x: Is(St.guideArrow.x, i),
            y: Re(St.guideArrow.y, t),
            scale: le(St.guideArrow.scale, i, t)
        }
    }
}
const Mt = i => 1 - (1 - i) * (1 - i),
    kt = i => 1 - Math.pow(1 - i, 3),
    Br = i => 2.70158 * i * i * i - 1.70158 * i * i,
    Ir = i => 1 + 2.70158 * Math.pow(i - 1, 3) + 1.70158 * Math.pow(i - 1, 2);

function st(i, t, e, s, r = n => n) {
    const n = Object.fromEntries(Object.keys(e).map(a => [a, t[a]]));
    let o = 0;
    return new Promise(a => {
        const h = () => {
            if (t && typeof t == "object" && "destroyed" in t && t.destroyed) {
                i.ticker.remove(h), a();
                return
            }
            o += i.ticker.deltaMS / 1e3;
            const l = Math.min(o / s, 1),
                c = r(l);
            for (const u of Object.keys(e)) {
                const d = e[u];
                d !== void 0 && (t[u] = n[u] + (d - n[u]) * c)
            }
            l >= 1 && (i.ticker.remove(h), a())
        };
        i.ticker.add(h)
    })
}

function be(i, t) {
    return st(i, {
        t: 0
    }, {
        t: 1
    }, t)
}
const ub = "DE",
    Ju = {
        DE: {
            geo: "DE",
            phoneGeo: "DE",
            phonePrefix: "phone - comp_DE",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "de-DE",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "de"
        },
        NL: {
            geo: "NL",
            phoneGeo: "NL",
            phonePrefix: "phone - comp_ NL",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "nl-NL",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "nl"
        },
        FR: {
            geo: "FR",
            phoneGeo: "FR",
            phonePrefix: "phone - comp_FR",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "fr-FR",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "fr"
        },
        ES: {
            geo: "ES",
            phoneGeo: "ES",
            phonePrefix: "phone - comp_ES",
            phoneFrameStart: 33,
            phoneFrameEnd: 107,
            phoneFrameStep: 1,
            locale: "es-ES",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "es"
        },
        GB: {
            geo: "GB",
            phoneGeo: "GB",
            phonePrefix: "phone - comp_GB",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "en-GB",
            currencyCode: "GBP",
            currencySymbol: "£",
            language: "en"
        }
    };

function db(i) {
    const t = i == null ? void 0 : i.toUpperCase();
    return t && t in Ju ? t : ub
}

function fb() {
    if (!(typeof window > "u")) return new URLSearchParams(window.location.search).get("geo") ?? void 0
}

function ve() {
    const i = typeof import.meta < "u" ? "GB" : void 0,
        t = fb(),
        e = db(i || t);
    return Ju[e]
}
const yh = 10,
    pb = 2500,
    Gr = .21,
    mb = .72,
    Fr = [0, 0, 0],
    gb = .26,
    _b = 48,
    Fi = 4e3,
    xb = 526 / 1080,
    yb = .32,
    Or = -200,
    bb = .016,
    vb = .18,
    wb = .18,
    Tb = 130,
    Sb = .58,
    rs = ["throne1.webp", "throne2.webp", "throne3.webp"],
    Cb = ["bg main new.webp", "log twr.webp", "platform wide.webp", "throne1.webp", "throne2.webp", "throne3.webp", "kruk.webp", "but cash out.webp", "but cash out gold.webp", "but build.webp", "box results.webp"],
    Be = ve(),
    Ab = 30,
    Pb = ["wheel/cepochka.webp", "wheel/osnova wheel.webp", "wheel/centr wheel.webp", "wheel/obod top.webp", "wheel/dragon.webp", "box bigwin.webp", "box bonus.webp"],
    bh = Array.from({
        length: Math.floor((Be.phoneFrameEnd - Be.phoneFrameStart) / Be.phoneFrameStep) + 1
    }, (i, t) => `phone - comp ${Be.phoneGeo}/${Be.phonePrefix}${String(Be.phoneFrameStart+t*Be.phoneFrameStep).padStart(5,"0")}.webp`),
    ns = [{
        name: "x1.5",
        multiplier: 1.5,
        weight: 25
    }, {
        name: "dragon",
        multiplier: 0,
        weight: 2
    }, {
        name: "x7",
        multiplier: 7,
        weight: 5
    }, {
        name: "x10",
        multiplier: 10,
        weight: 3
    }, {
        name: "x2.5",
        multiplier: 2.5,
        weight: 15
    }, {
        name: "x3",
        multiplier: 3,
        weight: 15
    }, {
        name: "x5",
        multiplier: 5,
        weight: 10
    }, {
        name: "x1",
        multiplier: 1,
        weight: 25
    }],
    Eb = .5,
    Mb = 1.2,
    kb = 2.0,
    Rb = Eb + Mb + kb,
    Bb = 5,
    Ib = .936,
    Gb = .66,
    Fb = .52,
    vh = .045,
    Ob = 1,
    Lb = -Math.PI / 2,
    Db = .85,
    Ub = .44,
    Nb = .4,
    wh = 11e3,
    Wb = .04,
    os = {
        left: 193,
        top: 587,
        right: 1014,
        bottom: 1408
    },
    Lr = {
        top: 87,
        bottom: 684
    },
    Hb = `
in vec2 vTextureCoord;

out vec4 finalColor;

uniform float uAmount;
uniform sampler2D uTexture;

void main()
{
    vec2 direction = normalize(vec2(1.0, 0.35));
    vec2 offset = direction * uAmount;
    vec4 base = texture(uTexture, vTextureCoord);
    vec4 red = texture(uTexture, vTextureCoord + offset);
    vec4 blue = texture(uTexture, vTextureCoord - offset);

    finalColor = vec4(red.r, base.g, blue.b, base.a);
}
`;

function Us(i) {
    return go(i)
}
async function zb() {
    const i = await Promise.all(Cb.map(async t => {
        const e = await Te.load(Us(t));
        return [t, e]
    }));
    return Object.fromEntries(i)
}

function Th(i, t, e) {
    return Math.min(e, Math.max(t, i))
}

function Vb() {
    const i = ii.from({
        gl: {
            vertex: ic,
            fragment: Hb
        },
        resources: {
            chromaticUniforms: new te({
                uAmount: {
                    value: 0,
                    type: "f32"
                }
            })
        }
    });
    return i.padding = 500, i
}

function Xb(i, t, e) {
    const s = new D,
        r = new Q(i),
        n = new Z;
    r.anchor.set(.5, xb), r.position.set(H / 2, t), r.width = Fi, r.scale.y = r.scale.x;
    const o = r.width,
        a = H / 2 - o / 2;
    n.rect(a, t - 120, o, 140).fill({
        color: 16181195,
        alpha: .08
    });
    const h = new zt({
        strength: 4,
        quality: 2
    });
    return h.padding = 32, n.filters = [h], s.addChild(r, n), s
}

function Yb(i, t) {
    const e = new D,
        s = new Z,
        r = new Z,
        n = new Z,
        o = new Z,
        a = new Z,
        h = new Z,
        l = new Z,
        c = new Z,
        u = new Z;
    r.ellipse(i * .5, -t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It
    }), n.ellipse(i * .5, t + t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It * 1.02
    }), o.ellipse(-i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), a.ellipse(i + i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), h.ellipse(-i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), l.ellipse(i + i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), c.ellipse(-i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    }), u.ellipse(i + i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    });
    const d = new zt({
        strength: 28,
        quality: 4
    });
    d.padding = 200, e.filters = [d], s.ellipse(i * .5, t * .33, i * .17, t * .06).fill({
        color: 15777652,
        alpha: .12
    });
    const f = new zt({
        strength: 28,
        quality: 4
    });
    return f.padding = 200, s.filters = [f], e.addChild(s, r, n, o, a, h, l, c, u), e
}

function Dr(i) {
    const t = new D,
        e = new Z,
        s = new Z,
        r = (n, o) => {
            n.moveTo(-12, -56).lineTo(12, -56).lineTo(12, -14).lineTo(28, -14).lineTo(0, 40).lineTo(-28, -14).lineTo(-12, -14).closePath().fill({
                color: 16777215,
                alpha: o
            })
        };
    return r(e, .22), e.scale.set(1.08), e.y = 4, r(s, 1), t.scale.set(i * 1.1), t.addChild(e, s), t
}

function $b(i) {
    const t = new D,
        e = new Z;
    e.roundRect(0, 0, 88, 88, 18).fill({
        color: 1182986,
        alpha: .72
    }).stroke({
        color: 9398847,
        alpha: .9,
        width: 2
    });
    const s = new D,
        r = new Z;
    if (r.moveTo(22, 34).lineTo(34, 34).lineTo(48, 24).lineTo(48, 64).lineTo(34, 54).lineTo(22, 54).closePath().fill({
            color: 15921128
        }), s.addChild(r), i) {
        const n = new Z;
        n.moveTo(58, 28).lineTo(74, 60).stroke({
            color: 15921128,
            width: 5
        }), n.moveTo(74, 28).lineTo(58, 60).stroke({
            color: 15921128,
            width: 5
        }), s.addChild(n)
    } else {
        const n = new Z;
        n.arc(54, 44, 10, -.9, .9).stroke({
            color: 15921128,
            width: 4
        }), n.arc(54, 44, 18, -.9, .9).stroke({
            color: 15921128,
            width: 4,
            alpha: .9
        }), s.addChild(n)
    }
    return t.addChild(e, s), {
        button: t,
        icon: s
    }
}

function formatWinNumber(i) {
    return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}
function Gs(i) {
    const t = ve();
    return `${i.toLocaleString(t.locale,{minimumFractionDigits:2,maximumFractionDigits:2})} ${t.currencyCode}`
}

function Sh(i) {
    return `x${i.toFixed(1)}`
}
class jb {
    constructor(t, e) {
        E(this, "root", new D);
        E(this, "app");
        E(this, "muteController");
        E(this, "textures", null);
        E(this, "wheelRig", null);
        E(this, "wheelContainer", null);
        E(this, "wheelSpinner", null);
        E(this, "wheelBase", null);
        E(this, "wheelCenter", null);
        E(this, "wheelRim", null);
        E(this, "wheelSpinBlur", null);
        E(this, "wheelChains", []);
        E(this, "wheelDragon", null);
        E(this, "wheelChainSprite", null);
        E(this, "wheelChainSpanOverride", null);
        E(this, "isWheelSpinning", !1);
        E(this, "wheelActive", !1);
        E(this, "torchFlames", []);
        E(this, "throneSprite", null);
        E(this, "state");
        E(this, "buildPulseTime", 0);
        E(this, "buildButtonPressed", !1);
        E(this, "buildButton", null);
        E(this, "buildLabel", null);
        E(this, "guideArrow", null);
        E(this, "guideArrowBaseY", 0);
        E(this, "currentCraneX", 0);
        E(this, "swingTime", 0);
        E(this, "dropX", 0);
        E(this, "fallingBlock", null);
        E(this, "cameraMotion", {
            x: 0,
            y: 0
        });
        E(this, "chromaMotion", {
            amount: 0
        });
        E(this, "rigReleaseMotion", {
            ropeAlpha: 1,
            hookAlpha: 1,
            chalkiAlpha: 1,
            chalkiSpread: 0,
            chalkiDrop: 0,
            chalkiKink: 0
        });
        E(this, "rigReleaseActive", !1);
        E(this, "resultsPanelMotion", {
            x: 0
        });
        E(this, "resultsPanelShown", !1);
        E(this, "towerMotion", {
            y: 0
        });
        E(this, "craneMotion", {
            y: 0
        });
        E(this, "craneContainer", null);
        E(this, "towerContainer", null);
        E(this, "fallingBlockView", null);
        E(this, "resultsGroup", null);
        E(this, "fxLayer", null);
        E(this, "rootTapBound", !1);
        E(this, "pendingLanding", !1);
        E(this, "completionLogged", !1);
        E(this, "sceneBuilt", !1);
        E(this, "shakeLayer", null);
        E(this, "backgroundLayer", null);
        E(this, "atmosphereLayer", null);
        E(this, "logoLayer", null);
        E(this, "craneLayer", null);
        E(this, "pedestalLayer", null);
        E(this, "hudLayer", null);
        E(this, "pedestal", null);
        E(this, "hookSprite", null);
        E(this, "ropeGraphics", null);
        E(this, "chalkiGraphics", null);
        E(this, "hangingBlock", null);
        E(this, "cashOutGroup", null);
        E(this, "cashOutFrame", null);
        E(this, "cashOutGoldFrame", null);
        E(this, "cashOutAmount", null);
        E(this, "bigWinOverlay", null);
        E(this, "bigWinGroup", null);
        E(this, "bigWinFxGroup", null);
        E(this, "bigWinParticleTicker", null);
        E(this, "bigWinArrow", null);
        E(this, "bigWinArrowTicker", null);
        E(this, "isBigWinActive", !1);
        E(this, "vignetteContainer", null);
        E(this, "fogContainer", null);
        E(this, "particleContainer", null);
        E(this, "chromaticAberrationFilter", null);
        E(this, "audioCache", new Map);
        E(this, "bgMusic", null);
        E(this, "registeredTickers", []);
        E(this, "handleRootTap", () => {
            this.triggerBuildAction()
        });
        E(this, "tick", () => {
            const t = this.app.ticker.deltaMS / 1e3;
            if (this.buildPulseTime += t, this.state.phase === "swinging" && (this.swingTime += t, this.state.swingAngle = Math.sin(this.swingTime * this.state.swingSpeed) * Gr, this.currentCraneX = H / 2), this.fallingBlock && (this.fallingBlock.velocityY += pb * t, this.fallingBlock.y += this.fallingBlock.velocityY * t, this.state.phase === "dropping" && !this.pendingLanding)) {
                const e = this.getTargetSurfaceWorldY();
                mh(this.fallingBlock) >= e && (this.fallingBlock.y = gh({
                    textureName: this.fallingBlock.textureName,
                    blockHeight: this.fallingBlock.height,
                    surfaceY: e
                }), this.pendingLanding = !0, this.resolveLanding())
            }
            // DEBUG: log every frame during swinging
            if (this.state.phase === "swinging" && this.hangingBlock && this.hangingBlock.parent) {
                const wp = this.hangingBlock.parent.toGlobal(this.hangingBlock.position);
                const visualAngle = this.state.swingAngle * mb;
                const calcDropX = this.currentCraneX + Math.sin(visualAngle) * this.hangingBlock.y;
                const calcDropY = this.craneMotion.y + Math.cos(visualAngle) * this.hangingBlock.y;
                console.log(`[DEBUG TICK] swingAngle=${this.state.swingAngle.toFixed(4)} visualAngle=${visualAngle.toFixed(4)} craneX=${this.currentCraneX.toFixed(1)} craneY=${this.craneMotion.y.toFixed(1)} hangingLocal=(${this.hangingBlock.x.toFixed(1)},${this.hangingBlock.y.toFixed(1)}) hangingWorld=(${wp.x.toFixed(1)},${wp.y.toFixed(1)}) calcDrop=(${calcDropX.toFixed(1)},${calcDropY.toFixed(1)})`);
            }
            (this.state.phase === "swinging" || this.rigReleaseActive) && this.updateChalki(), this.syncDynamicVisuals()
        });
        this.app = t, this.muteController = e.muteController, this.state = {
            phase: "swinging",
            currentBlockIndex: 0,
            towerBlocks: [],
            swingAngle: 0,
            swingSpeed: xh(0),
            multipliers: [],
            cashOut: 0
        }
    }
    async init() {
        this.textures = await zb(), Promise.all([...Pb.map(async t => {
            const e = await Te.load(Us(t));
            this.textures && (this.textures[t] = e)
        }), ...bh.map(async t => {
            const e = await Te.load(Us(t));
            this.textures && (this.textures[t] = e)
        })]).catch(console.error), this.root.eventMode = "static", this.currentCraneX = H / 2, this.resultsPanelMotion.x = this.getResultsPanelTargetX(), this.rootTapBound || (this.root.on("pointertap", this.handleRootTap), this.rootTapBound = !0), this.buildScene(), this.app.ticker.add(this.tick)
    }
    applyEntryPose(t) {
        this.entryPose = t;
        if (!this.craneContainer || !this.hangingBlock) {
            console.log("[GameplayScene] applyEntryPose deferred", t);
            return
        }
        // Transfer swing state from start scene, but DON'T overwrite block position
        // The block position is already correct from spawnHangingBlock (uses proper local Y)
        this.currentCraneX = t.craneX, this.craneMotion.y = t.craneY, this.state.swingAngle = t.rotation, this.swingTime = Math.asin(Math.max(-1, Math.min(1, t.rotation / Gr))) / this.state.swingSpeed, this.craneContainer.position.set(t.craneX, t.craneY), this.craneContainer.rotation = t.rotation, this.hangingBlock.rotation = 0, this.updateChalki(), console.log("[GameplayScene] applyEntryPose applied (no position overwrite)", {
            entryPose: t,
            cranePosition: {
                x: this.craneContainer.x,
                y: this.craneContainer.y
            },
            craneRotation: this.craneContainer.rotation,
            blockPosition: {
                x: this.hangingBlock.x,
                y: this.hangingBlock.y
            },
            blockRotation: this.hangingBlock.rotation
        })
    }
    async beginFirstDrop() {
        if (this.entryPose && this.state.currentBlockIndex === 0 && this.hangingBlock) {
            const entryPoint = resolveAutoDropSourcePoint({
                currentPoint: this.hangingBlock.position,
                entryPose: this.entryPose,
                useEntryPose: !0
            });
            this.hangingBlock.position.set(entryPoint.x, entryPoint.y), this.hangingBlock.alpha = 1, this.updateChalki()
        }
        await this.triggerBuildAction()
    }
    updateMuteState() {
        this.bgMusic && (this.bgMusic.muted = this.muteController.getMuted(), this.bgMusic.volume = this.muteController.getMuted() ? 0 : .18);
        for (const s of this.audioCache.values()) s.muted = this.muteController.getMuted(), this.muteController.getMuted() && (s.volume = 0);
        if (!this.hudLayer) return;
        this.muteButton && (this.hudLayer.removeChild(this.muteButton), this.muteButton.destroy({
            children: !0
        }));
        const {
            button: t,
            icon: e
        } = $b(this.muteController.getMuted());
        t.position.set(H - 120, 72), t.eventMode = "static", t.cursor = "pointer", t.on("pointertap", s => {
            s.stopPropagation(), this.muteController.toggleMuted(), this.updateMuteState()
        }), this.muteButton = t, this.muteIcon = e, this.hudLayer.addChild(t)
    }
    addTicker(t) {
        this.registeredTickers.push(t), this.app.ticker.add(t)
    }
    removeTicker(t) {
        this.app.ticker.remove(t);
        const e = this.registeredTickers.indexOf(t);
        e !== -1 && this.registeredTickers.splice(e, 1)
    }
    destroy() {
        this.app.ticker.remove(this.tick);
        for (const t of this.registeredTickers) this.app.ticker.remove(t);
        this.registeredTickers.length = 0, this.stopBigWinAmbientParticles(), this.bigWinArrowTicker && (this.app.ticker.remove(this.bigWinArrowTicker), this.bigWinArrowTicker = null), this.rootTapBound && (this.root.off("pointertap", this.handleRootTap), this.rootTapBound = !1), this.fogContainer && (this.fogContainer.removeFromParent(), this.fogContainer = null), this.particleContainer && (this.particleContainer.removeFromParent(), this.particleContainer = null), this.root.destroy({
            children: !0
        })
    }
    setFog(t) {
        this.fogContainer = t, this.syncAtmosphere()
    }
    setParticles(t) {
        this.particleContainer = t, this.syncAtmosphere()
    }
    syncAtmosphere() {
        this.atmosphereLayer && (this.fogContainer && (this.fogContainer.visible = !1), this.particleContainer && (this.particleContainer.visible = !1), this.vignetteContainer && (this.vignetteContainer.visible = !1), this.atmosphereLayer.removeChildren(), this.fogContainer && (this.fogContainer.visible = !0, this.atmosphereLayer.addChild(this.fogContainer)), this.particleContainer && (this.particleContainer.visible = !0, this.atmosphereLayer.addChild(this.particleContainer)), this.vignetteContainer && (this.vignetteContainer.visible = !0, this.atmosphereLayer.addChild(this.vignetteContainer)))
    }
    resize(t, e) {
        const s = Math.min(t / H, e / J),
            r = t / s,
            n = e / s,
            o = (H - r) / 2,
            a = (J - n) / 2;
        if (console.log(`[GameplayScene] Resize: ${t}x${e}, local: ${r.toFixed(0)}x${n.toFixed(0)}, scale: ${s.toFixed(3)}`), this.backgroundLayer) {
            const h = this.backgroundLayer.children[0];
            h && h.texture && (h.scale.set(2.1), h.position.set(H / 2, J / 2))
        }
        if (this.vignetteContainer) {
            const h = 1 / s;
            this.vignetteContainer.scale.set(h), this.vignetteContainer.position.set(o, a)
        }
        if (this.pedestalLayer && this.pedestal) {
            const h = this.pedestal.children[0],
                l = this.pedestal.children[1];
            if (h && (h.width = Math.max(Fi, r), h.scale.y = h.scale.x, l)) {
                const c = h.width,
                    u = H / 2 - c / 2,
                    d = $s({
                        width: H,
                        height: J
                    }).pedestal.topY;
                l.clear(), l.rect(u, d - 120, c, 140).fill({
                    color: 16181195,
                    alpha: .08
                })
            }
        }
        this.chromaticAberrationFilter && (this.chromaticAberrationFilter.resources.chromaticUniforms.uniforms.uAmount = this.chromaMotion.amount), this.bigWinOverlay && (this.bigWinOverlay.clear(), this.bigWinOverlay.rect(o, a, r, n).fill({
            color: 0
        }))
    }
    buildScene() {
        if (!this.textures || this.sceneBuilt) return;
        console.log("[GameplayScene] Building scene...");
        const t = $s({
            width: H,
            height: J
        });
        this.chromaticAberrationFilter = Vb(), this.root.filters = [this.chromaticAberrationFilter], this.backgroundLayer = new D;
        const e = new Q(this.textures["bg main new.webp"]);
        e.anchor.set(.5, .5), e.scale.set(2.1), e.position.set(H / 2, J / 2), this.backgroundLayer.filters = [new zt({
            strength: Zu,
            quality: 4,
            kernelSize: 9,
            padding: 64
        })], this.backgroundLayer.addChild(e), this.atmosphereLayer = new D, this.vignetteContainer = Yb(H, J), this.atmosphereLayer.addChild(this.vignetteContainer), this.logoLayer = new D;
        const s = new Q(this.textures["log twr.webp"]);
        s.anchor.set(.5, 0);
        const r = t.logo.width / s.texture.width * 1.17;
        s.position.set(H / 2, J * .02), s.scale.set(r), s.alpha = .97;
        const n = new Q(this.textures["log twr.webp"]);
        n.anchor.set(.5, 0), n.position.set(H / 2 + 5, J * .02 + 7), n.scale.set(r), n.tint = 1116936, n.alpha = .28, this.logoLayer.addChild(n, s), this.towerContainer = new D, this.pedestalLayer = new D, this.pedestal = Xb(this.textures["platform wide.webp"], t.pedestal.topY), this.pedestalLayer.addChild(this.pedestal), this.craneLayer = new D, this.craneContainer = new D, this.craneLayer.addChild(this.craneContainer);
        const o = this.textures["kruk.webp"];
        this.hookSprite = new Q(o), this.hookSprite.anchor.set(.5, 0), this.hookSprite.x = 0, this.hookSprite.y = J * .22 - 5;
        const a = H * .07 / o.width;
        this.hookSprite.scale.set(a), this.ropeGraphics = new Z, this.ropeGraphics.moveTo(0, -J * 2), this.ropeGraphics.lineTo(0, this.hookSprite.y + this.hookSprite.height * .4), this.ropeGraphics.stroke({
            width: 2.5,
            color: 4473924
        }), this.chalkiGraphics = new Z, this.chalkiGraphics.stroke({
            width: 2.5,
            color: 8947848
        }), this.craneContainer.addChild(this.ropeGraphics, this.hookSprite, this.chalkiGraphics), this.spawnHangingBlock(), this.hudLayer = new D;
        const h = t.hud.buttonHeight,
            l = t.hud.gap,
            c = t.hud.buttonY;
        this.cashOutGroup = new D;
        const u = new Q(this.textures["but cash out.webp"]);
        u.anchor.set(.5), u.height = h * 1.04, u.scale.x = u.scale.y, this.cashOutFrame = u;
        const d = new Q(this.textures["but cash out gold.webp"]);
        d.anchor.set(.5), d.height = h * 1.04, d.scale.x = d.scale.y, d.alpha = 0, this.cashOutGoldFrame = d;
        const f = new Ot({
            text: "CASH OUT",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(h * .15),
                fontWeight: "700",
                fill: "#d7d5d3",
                letterSpacing: .7
            }
        });
        f.anchor.set(.5), f.y = -u.height * .05, this.cashOutAmount = new Ot({
            text: Gs(this.state.cashOut),
            style: {
                fontFamily: Rt,
                fontSize: Math.round(h * .1),
                fontWeight: "700",
                fill: "#d1cbc4",
                letterSpacing: .25
            }
        }), this.cashOutAmount.anchor.set(.5), this.cashOutAmount.y = u.height * .08, this.cashOutGroup.addChild(u, d, f, this.cashOutAmount), this.cashOutGroup.eventMode = "static", this.cashOutGroup.cursor = "pointer", this.cashOutGroup.on("pointertap", v => {
            v.stopPropagation(), this.isBigWinActive && this.dismissBigWinEffects().then(() => {
                this.playPhoneAnimation().then(() => {
                    this.showEndScreen()
                })
            })
        });
        const p = new D,
            m = new Q(this.textures["but build.webp"]);
        m.anchor.set(.5), m.height = h, m.scale.x = m.scale.y;
        const g = new Ot({
            text: "BUILD",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(h * .35),
                fontWeight: "700",
                fill: "#f2efe8",
                letterSpacing: 1.5,
                dropShadow: {
                    color: 3276800,
                    alpha: .62,
                    blur: 3,
                    distance: 2,
                    angle: Math.PI / 2
                }
            }
        });
        g.anchor.set(.5), this.buildLabel = g, p.addChild(m, g);
        const _ = u.width + l + m.width,
            x = (H - _) / 2;
        this.cashOutGroup.position.set(x + u.width / 2 + t.hud.cashOutCenterOffsetX, c), p.position.set(x + u.width + l + m.width / 2, c), p.eventMode = "static", p.cursor = "pointer", p.on("pointerdown", () => {
            this.buildButtonPressed = !0
        }), p.on("pointerup", () => {
            this.buildButtonPressed = !1
        }), p.on("pointerupoutside", () => {
            this.buildButtonPressed = !1
        }), p.on("pointerout", () => {
            this.buildButtonPressed = !1
        }), p.on("pointertap", v => {
            v.stopPropagation(), this.wheelActive ? (this.playSound("Load Game Button 3.mp3", .35), this.triggerSpin()) : this.state.phase === "swinging" && (this.playSound("1_click.mp3", .4), this.triggerBuildAction())
        });
        const b = Dr(t.guideArrow.scale);
        b.position.set(t.guideArrow.x, t.guideArrow.y + J * Wb), this.guideArrowBaseY = b.y, this.resultsGroup = new D, this.resultsGroup.alpha = 0;
        const y = new Q(this.textures["box results.webp"]);
        y.anchor.set(.5, 0), y.width = H * .23 * 1.2 * 1.2, y.scale.y = y.scale.x, this.resultsGroup.position.set(this.resultsPanelMotion.x, J * gb + 30), this.resultsGroup.addChild(y);
        const S = new Ot({
            text: "RESULTS",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(y.height * .09),
                fontWeight: "600",
                fill: "#efe4c4",
                letterSpacing: 1
            }
        });
        S.anchor.set(.5, 0), S.position.set(0, y.height * .09), this.resultsGroup.addChild(S), this.hudLayer.addChild(p, b, this.resultsGroup, this.cashOutGroup), this.updateMuteState(), this.cashOutGroup.hitArea = new nt(-this.cashOutFrame.width / 2, -this.cashOutFrame.height / 2, this.cashOutFrame.width, this.cashOutFrame.height), this.fxLayer = new D, this.shakeLayer = new D, this.shakeLayer.addChild(this.backgroundLayer, this.atmosphereLayer, this.pedestalLayer, this.towerContainer, this.craneLayer, this.hudLayer, this.fxLayer, this.logoLayer), this.root.addChild(this.shakeLayer), this.buildButton = p, this.guideArrow = b, this.sceneBuilt = !0, this.updateScene(), this.syncDynamicVisuals()
    }
    updateScene() {
        this.guideArrow && (this.guideArrow.visible = this.state.phase === "swinging"), this.buildButton && (this.buildButton.alpha = this.state.phase === "complete" ? .62 : 1), this.cashOutAmount && (this.cashOutAmount.text = Gs(this.state.cashOut)), this.updateResults()
    }
    updateChalki() {
        if (!this.chalkiGraphics || !this.hookSprite || !this.hangingBlock) return;
        this.chalkiGraphics.clear();
        const t = this.getCurrentBlockAssetName(),
            e = ai(t),
            {
                width: s,
                height: r
            } = this.getBlockDimensions(t, this.getCurrentBlockWidth()),
            n = this.hookSprite.y + this.hookSprite.height * .801 + 5,
            o = (e.leftRigAttach - .5) * s - this.rigReleaseMotion.chalkiSpread,
            a = (e.rightRigAttach - .5) * s + this.rigReleaseMotion.chalkiSpread,
            h = this.hangingBlock.y - r / 2 + e.rigAttachY * r + this.rigReleaseMotion.chalkiDrop,
            l = o * .46 - this.rigReleaseMotion.chalkiKink,
            c = a * .46 + this.rigReleaseMotion.chalkiKink,
            u = n + (h - n) * .42 + this.rigReleaseMotion.chalkiDrop * .18,
            d = o * .76 - this.rigReleaseMotion.chalkiKink * .35,
            f = a * .76 + this.rigReleaseMotion.chalkiKink * .35,
            p = n + (h - n) * .76 + this.rigReleaseMotion.chalkiDrop * .08;
        this.chalkiGraphics.moveTo(0, n), this.chalkiGraphics.lineTo(l, u), this.chalkiGraphics.lineTo(d, p), this.chalkiGraphics.lineTo(o, h), this.chalkiGraphics.moveTo(0, n), this.chalkiGraphics.lineTo(c, u), this.chalkiGraphics.lineTo(f, p), this.chalkiGraphics.lineTo(a, h), this.chalkiGraphics.stroke({
            width: 2.5,
            color: 8947848
        })
    }
    updateResults() {
        if (!this.resultsGroup) return;
        for (; this.resultsGroup.children.length > 1;) this.resultsGroup.removeChildAt(1);
        const t = this.resultsGroup.children[0];
        t && this.state.multipliers.forEach((e, s) => {
            const r = new Ot({
                text: Sh(e),
                style: {
                    fontFamily: Rt,
                    fontSize: Math.round(t.height * .08),
                    fontWeight: "600",
                    fill: "#f1d79c"
                }
            });
            r.anchor.set(.5, 0), r.position.set(0, t.height * (.23 + s * .12)), this.resultsGroup.addChild(r)
        })
    }
    syncDynamicVisuals() {
        var t;
        if (this.shakeLayer && this.shakeLayer.position.set(this.cameraMotion.x, this.cameraMotion.y), this.craneContainer && (this.craneContainer.position.set(this.currentCraneX, this.craneMotion.y), this.craneContainer.rotation = this.state.phase === "swinging" || this.state.phase === "dropping" ? this.state.swingAngle * mb : 0), this.towerContainer && (this.towerContainer.y = this.towerMotion.y), this.pedestalLayer && (this.pedestalLayer.y = this.towerMotion.y), this.fallingBlockView && this.fallingBlock && this.fallingBlockView.position.set(this.fallingBlock.x, this.fallingBlock.y), this.resultsGroup && (this.resultsGroup.x = this.resultsPanelMotion.x), this.chromaticAberrationFilter && (this.chromaticAberrationFilter.resources.chromaticUniforms.uniforms.uAmount = this.chromaMotion.amount), this.ropeGraphics && (this.ropeGraphics.alpha = this.rigReleaseMotion.ropeAlpha), this.hookSprite && (this.hookSprite.alpha = this.rigReleaseMotion.hookAlpha), this.chalkiGraphics && (this.chalkiGraphics.alpha = this.rigReleaseMotion.chalkiAlpha), this.buildButton) {
            const s = this.state.phase === "swinging" ? 1 + Math.sin(this.buildPulseTime * 3.4) * .018 : 1,
                r = this.buildButtonPressed ? .965 : 1;
            this.buildButton.scale.set(s * r)
        }
        this.wheelRig && ((t = this.wheelChainSprite) != null && t.visible) && (this.wheelRig.rotation = Math.sin(this.buildPulseTime * 1.45) * vh), this.guideArrow && ((this.state.phase === "swinging" || this.state.phase === "dropping") && (this.guideArrow.y = this.guideArrowBaseY + Math.sin(this.buildPulseTime * 5.2) * 8, this.guideArrow.alpha = .84 + (Math.sin(this.buildPulseTime * 5.2) + 1) * .08), this.wheelActive && !this.isWheelSpinning && (this.guideArrow.alpha = .5 + Math.sin(performance.now() * .006) * .5, this.guideArrow.visible = !0));
        for (const e of this.torchFlames) e.alpha = .8 + Math.sin(performance.now() * .01 + Math.random()) * .2, e.scale.y = .9 + Math.random() * .2
    }
    createCurrentCraneBlockDisplay(t) {
        const e = this.getCurrentBlockWidth(),
            {
                width: s,
                height: r
            } = this.getBlockDimensions(this.getCurrentBlockAssetName(), e),
            n = this.getSuspendedBlockCenterY(r, t),
            o = Fr[this.state.currentBlockIndex] ?? Fr[Fr.length - 1];
        return this.state.currentBlockIndex > 0 && console.log("[GameplayScene] hangingBlockY", {
            blockIndex: this.state.currentBlockIndex + 1,
            baseY: n,
            extraHangY: o,
            finalY: n + o
        }), this.createBlockDisplay({
            textureName: this.getCurrentBlockAssetName(),
            x: 0,
            y: n + o,
            width: s,
            height: r,
            rotation: 0
        }, !1)
    }
    createPlacedBlockDisplay(t) {
        return this.createBlockDisplay(t, !1)
    }
    createFallingBlockDisplay(t) {
        return this.createBlockDisplay({
            textureName: t.textureName,
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
            rotation: 0
        }, !0)
    }
    getCurrentBlockWidth() {
        return H * .58 * 1.3
    }
    getHookPointY() {
        return this.hookSprite ? this.hookSprite.y + this.hookSprite.height * .801 + 5 : J * .22
    }
    getSuspendedBlockCenterY(t, e = this.getHookPointY()) {
        return e + J * .12 - Tb + t / 2
    }
    getSuspendedBlockWorldCenter(t, e = this.shakeLayer ?? this.root) {
        const s = this.hangingBlock?.x ?? 0,
            r = this.hangingBlock?.y ?? this.getSuspendedBlockCenterY(t),
            n = this.state.swingAngle * mb;
        return resolveDropStartFromSwingPose({
            craneX: this.currentCraneX,
            craneY: this.craneMotion.y,
            rotation: n,
            blockX: s,
            blockY: r
        })
    }
    setSuspendedRigVisible(t) {
        this.hookSprite && (this.hookSprite.visible = t), this.ropeGraphics && (this.ropeGraphics.visible = t), this.chalkiGraphics && (this.chalkiGraphics.visible = t), this.hangingBlock && (this.hangingBlock.visible = t)
    }
    resetRigReleaseMotion() {
        this.rigReleaseMotion.ropeAlpha = 1, this.rigReleaseMotion.hookAlpha = 1, this.rigReleaseMotion.chalkiAlpha = 1, this.rigReleaseMotion.chalkiSpread = 0, this.rigReleaseMotion.chalkiDrop = 0, this.rigReleaseMotion.chalkiKink = 0, this.rigReleaseActive = !1
    }
    startRigReleaseAnimation() {
        !this.ropeGraphics || !this.hookSprite || !this.chalkiGraphics || (this.ropeGraphics.visible = !0, this.hookSprite.visible = !0, this.chalkiGraphics.visible = !0, this.resetRigReleaseMotion(), this.rigReleaseActive = !0, st(this.app, this.rigReleaseMotion, {
            ropeAlpha: .94,
            hookAlpha: .96,
            chalkiAlpha: 1,
            chalkiSpread: H * .062,
            chalkiDrop: J * .05,
            chalkiKink: H * .034
        }, vb, kt).then(() => st(this.app, this.rigReleaseMotion, {
            ropeAlpha: 0,
            hookAlpha: 0,
            chalkiAlpha: 0,
            chalkiSpread: H * .082,
            chalkiDrop: J * .07,
            chalkiKink: H * .05
        }, wb, Mt)).then(() => {
            this.ropeGraphics && (this.ropeGraphics.visible = !1), this.hookSprite && (this.hookSprite.visible = !1), this.chalkiGraphics && (this.chalkiGraphics.visible = !1), this.resetRigReleaseMotion()
        }))
    }
    clearFallingBlockView() {
        var t;
        this.fallingBlockView && ((t = this.craneLayer) == null || t.removeChild(this.fallingBlockView), this.fallingBlockView.destroy({
            children: !0
        }), this.fallingBlockView = null)
    }
    spawnHangingBlock() {
        if (!this.craneContainer || !this.hookSprite) return;
        this.hangingBlock && (this.craneContainer.removeChild(this.hangingBlock), this.hangingBlock.destroy({
            children: !0
        }), this.hangingBlock = null);
        const hookY = this.getHookPointY();
        this.hangingBlock = this.createCurrentCraneBlockDisplay(hookY);
        console.log(`[DEBUG spawnHangingBlock] blockIndex=${this.state.currentBlockIndex} hookY=${hookY.toFixed(1)} createdBlockLocalY=${this.hangingBlock.y.toFixed(1)} entryPose=${this.entryPose ? 'yes' : 'no'}`);
        let t = this.hangingBlock.y;
        // Only use entryPose for the very first block (blockIndex === 0)
        if (this.entryPose && this.state.currentBlockIndex === 0) {
            console.log(`[DEBUG spawnHangingBlock] applying entryPose: blockX=${this.entryPose.blockX.toFixed(1)} blockY=${this.entryPose.blockY.toFixed(1)}`);
            this.hangingBlock.position.set(this.entryPose.blockX, this.entryPose.blockY), this.hangingBlock.rotation = 0, this.currentCraneX = this.entryPose.craneX, this.craneMotion.y = this.entryPose.craneY, this.state.swingAngle = this.entryPose.rotation, this.swingTime = Math.asin(Math.max(-1, Math.min(1, this.entryPose.rotation / Gr))) / this.state.swingSpeed, t = this.entryPose.blockY
        }
        console.log(`[DEBUG spawnHangingBlock] final targetY=${t.toFixed(1)} startY=${(t - 220).toFixed(1)}`);
        this.hangingBlock.y = t - 220, this.hangingBlock.alpha = 0, this.hangingBlock.visible = !0, this.craneContainer.addChild(this.hangingBlock), st(this.app, this.hangingBlock, {
            y: t,
            alpha: 1
        }, .42, kt), this.resetRigReleaseMotion(), this.setSuspendedRigVisible(!0), this.updateChalki()
    }
    createBlockDisplay(t, e) {
        var o;
        const s = new D;
        s.position.set(t.x, t.y), s.rotation = t.rotation;
        const r = (o = this.textures) == null ? void 0 : o[t.textureName];
        if (!r) return s;
        if (e) {
            const a = new Q(r);
            a.anchor.set(.5), a.width = t.width, a.height = t.height, a.tint = 0, a.alpha = .38, a.position.set(0, 10);
            const h = new zt({
                strength: 4,
                quality: 2
            });
            h.padding = 24, a.filters = [h], s.addChild(a)
        }
        const n = new Q(r);
        return n.anchor.set(.5), n.width = t.width, n.height = t.height, this.state.currentBlockIndex < 3 && console.log(`[BlockDebug] Rendering block ${t.textureName} at ${t.x.toFixed(0)},${t.y.toFixed(0)}`), s.addChild(n), s
    }
    async triggerBuildAction() {
        if (this.state.phase !== "swinging" || this.fallingBlock) return;
        const t = this.getCurrentBlockAssetName(),
            {
                width: e,
                height: s
            } = this.getBlockDimensions(t, this.getCurrentBlockWidth());
        // DEBUG: log everything at the moment of pressing BUILD
        const visualAngle = this.state.swingAngle * mb;
        const blockLocalY = this.hangingBlock ? this.hangingBlock.y : 0;
        const calcDropX = this.currentCraneX + Math.sin(visualAngle) * blockLocalY;
        const calcDropY = this.craneMotion.y + Math.cos(visualAngle) * blockLocalY;
        console.log(`[DEBUG BUILD] blockIndex=${this.state.currentBlockIndex} swingAngle=${this.state.swingAngle.toFixed(4)} visualAngle=${visualAngle.toFixed(4)} craneX=${this.currentCraneX.toFixed(1)} craneY=${this.craneMotion.y.toFixed(1)} hangingLocalY=${blockLocalY.toFixed(1)} calcDropX=${calcDropX.toFixed(1)} calcDropY=${calcDropY.toFixed(1)}`);
        const r = this.getSuspendedBlockWorldCenter(s, this.shakeLayer ?? this.root);
        console.log(`[DEBUG BUILD RESULT] dropX=${r.x.toFixed(1)} dropY=${r.y.toFixed(1)}`);
        this.entryDropStart = null, console.log("[GameplayScene] triggerBuildAction dropStart", {
            textureName: t,
            stateSwingAngle: this.state.swingAngle,
            currentCraneX: this.currentCraneX,
            craneY: this.craneMotion.y,
            hangingBlockLocal: this.hangingBlock ? {
                x: this.hangingBlock.x,
                y: this.hangingBlock.y,
                rotation: this.hangingBlock.rotation
            } : null,
            suspendedBlockWorldCenter: r
        }), this.startBgMusic(), this.playSound("sfx_Whoosh_11.mp3", .3), this.dropX = r.x, this.state.phase = "dropping", this.fallingBlock = {
            textureName: t,
            x: this.dropX,
            y: r.y,
            width: e,
            height: s,
            velocityY: 0
        }, this.buildButtonPressed = !1, this.fallingBlockView = this.createFallingBlockDisplay(this.fallingBlock), (this.shakeLayer ?? this.root).addChild(this.fallingBlockView), this.hangingBlock && (this.hangingBlock.visible = !1), this.startRigReleaseAnimation(), st(this.app, this.craneMotion, {
            y: Or
        }, .3, kt), this.updateScene()
    }
    getTargetSurfaceWorldY() {
        return this.towerMotion.y + this.getTargetSurfaceLocalY()
    }
    getTargetSurfaceLocalY() {
        if (this.state.towerBlocks.length === 0) return $s({
            width: H,
            height: J
        }).pedestal.topY;
        const t = this.state.towerBlocks[this.state.towerBlocks.length - 1];
        return rb(t)
    }
    getTargetHorizontalBounds() {
        if (this.state.towerBlocks.length === 0) return {
            left: H * .21,
            right: H * .79
        };
        const t = this.state.towerBlocks[this.state.towerBlocks.length - 1];
        return {
            left: t.x - t.width / 2,
            right: t.x + t.width / 2
        }
    }
    async resolveLanding() {
        if (!this.fallingBlock) return;
        this.state.phase = "landing";
        const t = this.getTargetHorizontalBounds(),
            e = this.getCurrentBlockWidth(),
            s = ob({
                dropX: this.dropX,
                blockWidth: e,
                targetLeft: t.left,
                targetRight: t.right
            }),
            r = this.getTargetSurfaceLocalY(),
            n = this.getCurrentBlockAssetName(),
            o = this.fallingBlock.height,
            a = this.fallingBlock.width,
            h = gh({
                textureName: n,
                blockHeight: o,
                surfaceY: r
            }),
            l = this.towerMotion.y + h;
        if (s.kind !== "miss") {
            const c = {
                textureName: n,
                x: s.placedCenterX,
                y: h,
                width: a,
                height: o,
                rotation: 0
            };
            if (this.state.towerBlocks.push(c), this.towerContainer) {
                const u = this.createPlacedBlockDisplay(c);
                this.towerContainer.addChild(u)
            }
            this.fallingBlock = null, this.clearFallingBlockView(), this.updateScene(), await Promise.all([this.playLandingEffects(s.placedCenterX, mh({
                textureName: n,
                y: l,
                height: o
            })), this.playLandingImpact()])
        } else await st(this.app, this.fallingBlock, {
            y: J + this.fallingBlock.height
        }, .5, kt), this.fallingBlock = null, this.clearFallingBlockView(), this.updateScene(), await Promise.all([this.playLandingEffects(H / 2, this.getTargetSurfaceWorldY()), this.playLandingImpact()]);
        if (this.state.currentBlockIndex < rs.length - 1 && (this.state.multipliers.push(s.multiplier), this.state.cashOut = _h(yh, this.state.multipliers)), await this.showResultsPanelIfNeeded(), this.updateScene(), this.state.phase = "celebrating", this.state.currentBlockIndex < rs.length - 1 && await this.playMultiplierAnnouncement(Sh(s.multiplier)), this.state.currentBlockIndex === rs.length - 1) {
            this.state.phase = "complete", this.craneMotion.y = Or, this.updateScene(), this.completionLogged = !0, this.pendingLanding = !1, await be(this.app, .5), await this.showWheel();
            return
        }
        if (this.state.phase = "nextBlock", s.kind !== "miss") {
            const c = this.state.towerBlocks[this.state.towerBlocks.length - 1],
                u = nb(c.textureName, c.height) * Sb;
            await st(this.app, this.towerMotion, {
                y: this.towerMotion.y + u
            }, .5, Mt)
        }
        this.state.currentBlockIndex += 1, this.state.swingSpeed = xh(this.state.currentBlockIndex), this.state.swingAngle = 0, this.swingTime = 0, this.currentCraneX = H / 2, this.craneMotion.y = Or, st(this.app, this.craneMotion, {
            y: 0
        }, .4, kt), this.state.phase = "swinging", this.pendingLanding = !1, this.spawnHangingBlock(), this.updateScene()
    }
    async showResultsPanelIfNeeded() {
        this.resultsPanelShown || !this.resultsGroup || (this.resultsPanelShown = !0, await st(this.app, this.resultsGroup, {
            alpha: 1
        }, .4, kt))
    }
    async playMultiplierAnnouncement(t) {
        if (!this.fxLayer) return;
        this.playSound("dota2-coins.mp3", .35);
        const e = new Ot({
            text: t,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(J * .08),
                fontWeight: "700",
                fill: "#fff5d9",
                dropShadow: {
                    color: 3348224,
                    alpha: .8,
                    blur: 8,
                    distance: 4,
                    angle: Math.PI / 2
                }
            }
        });
        e.anchor.set(.5), e.position.set(H / 2, J * yb), e.scale.set(.2), e.alpha = 0, this.fxLayer.addChild(e), await Promise.all([st(this.app, e, {
            alpha: 1
        }, .2, kt), st(this.app, e.scale, {
            x: 1.2,
            y: 1.2
        }, .35, kt)]), await Promise.all([st(this.app, e.scale, {
            x: 1,
            y: 1
        }, .15, Mt), be(this.app, .8)]), await st(this.app, e, {
            alpha: 0
        }, .3, Mt), e.destroy()
    }
    async playLandingEffects(t, e) {
        if (!this.fxLayer) return;
        const s = [],
            r = this.getDustTexture();
        for (let o = 0; o < 6; o++) {
            const a = new Q(r);
            a.anchor.set(.5);
            const h = o < 3 ? -1 : 1;
            a.position.set(t + h * (10 + Math.random() * 20), e - 5), a.scale.set(.3 + Math.random() * .2, .25 + Math.random() * .15), a.alpha = .55 + Math.random() * .2, a.tint = 13154456, this.fxLayer.addChild(a);
            const l = h * (Fi * (.12 + Math.random() * .14)),
                c = -(8 + Math.random() * 18),
                u = .5 + Math.random() * .25;
            s.push(Promise.all([st(this.app, a, {
                x: t + l,
                y: e + c
            }, u, kt), st(this.app, a.scale, {
                x: a.scale.x * 2.8,
                y: a.scale.y * 1.6
            }, u, kt), st(this.app, a, {
                alpha: 0
            }, u * .9, Mt)]).then(() => {
                a.destroyed || a.destroy()
            }))
        }
        const n = this.getSparkTexture();
        for (let o = 0; o < 5; o++) {
            const a = new Q(n);
            a.anchor.set(.5), a.position.set(t + (Math.random() - .5) * 40, e - 4), a.scale.set(.25 + Math.random() * .2), a.alpha = .8, a.tint = 15784096, this.fxLayer.addChild(a);
            const h = (Math.random() - .5) * Fi * .2,
                l = -(J * .03 + Math.random() * J * .04);
            s.push(Promise.all([st(this.app, a, {
                x: t + h,
                y: e + l
            }, .4, kt), st(this.app, a, {
                alpha: 0
            }, .4, Mt)]).then(() => {
                a.destroyed || a.destroy()
            }))
        }
        await Promise.all(s)
    }
    getDustTexture() {
        const t = new Z;
        return t.ellipse(0, 0, 40, 20).fill({
            color: 16777215
        }), this.app.renderer.generateTexture({
            target: t,
            resolution: 1
        })
    }
    async playLandingImpact() {
        this.playSound("sfx_Boom_03.mp3", .4), this.playSound("Slide Box High 05.mp3", .45), await Promise.all([this.shakeCamera(), this.pulseChromaticAberration()])
    }
    async shakeCamera() {
        const t = Math.min(H * .028, 18);
        for (let e = 0; e < 10; e++) {
            const s = 1 - e / 10;
            this.cameraMotion.x = (Math.random() - .5) * t * s, this.cameraMotion.y = (Math.random() - .5) * t * .8 * s, await be(this.app, .022)
        }
        this.cameraMotion.x = 0, this.cameraMotion.y = 0
    }
    async pulseChromaticAberration() {
        await st(this.app, this.chromaMotion, {
            amount: bb
        }, .05, kt), await st(this.app, this.chromaMotion, {
            amount: 0
        }, .16, Mt)
    }
    getSparkTexture() {
        const t = new Z;
        return t.circle(0, 0, 5).fill({
            color: 16777215
        }), this.app.renderer.generateTexture({
            target: t,
            resolution: 1
        })
    }
    getBlockDimensions(t, e) {
        var n;
        const s = (n = this.textures) == null ? void 0 : n[t];
        if (!s) return {
            width: e,
            height: e
        };
        const r = e / s.width;
        return {
            width: e,
            height: s.height * r
        }
    }
    getCurrentBlockAssetName() {
        return rs[this.state.currentBlockIndex] ?? rs[rs.length - 1]
    }
    getResultsPanelTargetX() {
        if (!this.textures) return H;
        const e = H * .23;
        return H - e * .45
    }
    getResultsPanelOffscreenX() {
        if (!this.textures) return H + _b;
        const e = H * .23;
        return H + e
    }
    updateCashOut() {
        this.cashOutAmount && (this.cashOutAmount.text = Gs(this.state.cashOut))
    }
    setCashOutGoldProgress(t) {
        const e = Th(t, 0, 1);
        this.cashOutGoldFrame && (this.cashOutGoldFrame.alpha = e), this.cashOutFrame && (this.cashOutFrame.alpha = 1 - e * .8)
    }
    setWheelChainVisibleSpan(t) {
        if (!this.wheelChainSprite) return;
        const e = J * 2,
            s = t + e,
            r = Lr.bottom - Lr.top,
            n = s * (this.wheelChainSprite.texture.height / r);
        this.wheelChainSprite.height = n, this.wheelChainSprite.y = -(Lr.top / this.wheelChainSprite.texture.height) * n - e
    }
    getWheelTargetY() {
        return J * Fb
    }
    updateWheelRigLayout() {
        var r, n, o;
        if (!this.wheelRig || !this.wheelChainSprite || !this.wheelRim) return;
        const t = this.getWheelVisualRadius();
        this.wheelRig.x = H / 2, this.wheelChainSprite.width = this.wheelRim.width * Gb;
        const e = (r = this.wheelContainer) != null && r.visible ? this.wheelContainer.y : ((o = (n = this.bigWinGroup) == null ? void 0 : n.children[0]) == null ? void 0 : o.y) ?? this.getWheelTargetY(),
            s = this.wheelChainSpanOverride ?? Math.max(e - t * .98, J * .18);
        this.setWheelChainVisibleSpan(s)
    }
    createWheelLabels(t, e) {
        const s = Math.PI * 2 / ns.length,
            r = e * .565;
        ns.forEach((n, o) => {
            const a = -Math.PI / 2 + s * o;
            if (n.name === "dragon" && this.textures) {
                const u = new Q(this.textures["wheel/dragon.webp"]);
                u.anchor.set(.5), u.position.set(Math.cos(a) * e * .61, Math.sin(a) * e * .61);
                const d = e * .44 / u.texture.width;
                u.scale.set(d);
                let f = a + Math.PI / 2;
                f > Math.PI / 2 && (f -= Math.PI), f < -Math.PI / 2 && (f += Math.PI), u.rotation = f, u.tint = 1314059, u.alpha = .82, t.addChild(u), this.wheelDragon = u;
                return
            }
            const h = Number.isInteger(n.multiplier) ? n.multiplier.toFixed(0) : n.multiplier.toFixed(1),
                l = new Ot({
                    text: `x${h}`,
                    style: {
                        fontFamily: Rt,
                        fontSize: Math.round(H * .05),
                        fontWeight: "700",
                        fill: "#f7f1e6",
                        dropShadow: {
                            color: 1839627,
                            alpha: .85,
                            blur: 6,
                            distance: 2,
                            angle: Math.PI / 2
                        }
                    }
                });
            l.anchor.set(.5), l.position.set(Math.cos(a) * r, Math.sin(a) * r);
            let c = a + Math.PI / 2;
            c > Math.PI / 2 && (c -= Math.PI), c < -Math.PI / 2 && (c += Math.PI), l.rotation = c, t.addChild(l)
        })
    }
    getWheelVisualRadius() {
        return this.wheelBase ? this.wheelBase.width * ((os.right - os.left) / this.wheelBase.texture.width) / 2 : 0
    }
    buildWheel() {
        const t = new D;
        if (!this.textures) return t;
        this.wheelSpinner = new D;
        const e = new D;
        this.wheelSpinBlur = new zt({
            strength: 0,
            quality: 4
        }), this.wheelSpinBlur.padding = 512, e.filters = [this.wheelSpinBlur], e.filterArea = new nt(-1e3, -1e3, 2e3, 2e3), this.wheelBase = new Q(this.textures["wheel/osnova wheel.webp"]), this.wheelBase.anchor.set(.5, .5);
        const s = H * Ib / this.wheelBase.texture.width,
            r = ((os.left + os.right) / 2 - this.wheelBase.texture.width / 2) * s,
            n = ((os.top + os.bottom) / 2 - this.wheelBase.texture.height / 2) * s;
        this.wheelBase.scale.set(s), this.wheelBase.position.set(-r, -n), e.addChild(this.wheelBase), this.createWheelLabels(e, this.getWheelVisualRadius()), this.wheelCenter = new Q(this.textures["wheel/centr wheel.webp"]), this.wheelCenter.anchor.set(.5, .5);
        const o = this.getWheelVisualRadius() * .72 / this.wheelCenter.texture.width;
        return this.wheelCenter.scale.set(o), this.wheelSpinner.addChild(e), t.addChild(this.wheelCenter), this.wheelRim = new Q(this.textures["wheel/obod top.webp"]), this.wheelRim.anchor.set(.5, .5), this.wheelRim.scale.set(s), this.wheelRim.position.set(-r, -n), t.addChild(this.wheelSpinner, this.wheelRim), t
    }
    getWheelRigOffscreenY() {
        return -(this.getWheelTargetY() + this.getWheelVisualRadius() + 60)
    }
    async showWheel() {
        if (this.wheelRig || (this.wheelRig = new D, this.fxLayer.addChild(this.wheelRig)), !this.wheelContainer) {
            const t = new Q(this.textures["wheel/cepochka.webp"]);
            t.anchor.set(.5, 0), this.wheelChainSprite = t, this.wheelRig.addChild(t), this.wheelContainer = this.buildWheel(), this.wheelRig.addChild(this.wheelContainer)
        }
        this.wheelChainSpanOverride = null, this.wheelRig.visible = !0, this.wheelChainSprite.visible = !0, this.wheelContainer.visible = !0, this.wheelSpinner && (this.wheelSpinner.rotation = Lb), this.setWheelSpinBlur(0), this.wheelActive = !0, this.buildLabel && (this.buildLabel.text = "SPIN"), this.wheelContainer.y = this.getWheelTargetY(), this.updateWheelRigLayout(), this.wheelRig.position.set(H / 2, this.getWheelRigOffscreenY()), this.wheelRig.rotation = -vh * .45, await st(this.app, this.wheelRig, {
            y: 0
        }, .55, Ir)
    }
    async hideWheel() {
        this.wheelRig && (await st(this.app, this.wheelRig, {
            y: this.getWheelRigOffscreenY()
        }, .4, Br), this.wheelContainer && (this.wheelContainer.visible = !1), this.wheelActive = !1, this.wheelSpinBlur && (this.wheelSpinBlur.strength = 0))
    }
    stopBigWinAmbientParticles() {
        this.bigWinParticleTicker && (this.removeTicker(this.bigWinParticleTicker), this.bigWinParticleTicker = null)
    }
    startBigWinAmbientParticles(t) {
        this.stopBigWinAmbientParticles();
        let e = 0;
        const s = () => {
            e += this.app.ticker.deltaMS / 1e3, !(e < .18) && (e = 0, this.playBoomParticles(t, 2, this.bigWinFxGroup ?? this.fxLayer ?? void 0))
        };
        this.bigWinParticleTicker = s, this.addTicker(s)
    }
    async dismissBigWinEffects() {
        var e, s;
        if (!this.isBigWinActive) return;
        this.isBigWinActive = !1, this.stopBigWinAmbientParticles(), this.bigWinArrowTicker && (this.removeTicker(this.bigWinArrowTicker), this.bigWinArrowTicker = null);
        const t = [];
        this.bigWinFxGroup && t.push(st(this.app, this.bigWinFxGroup, {
            alpha: 0
        }, .24, Mt)), this.bigWinArrow && t.push(st(this.app, this.bigWinArrow, {
            alpha: 0
        }, .22, Mt)), this.wheelRig && t.push(st(this.app, this.wheelRig, {
            y: this.getWheelRigOffscreenY()
        }, .4, Br)), await Promise.all(t), (e = this.bigWinGroup) == null || e.destroy({
            children: !0
        }), this.bigWinGroup = null, (s = this.bigWinFxGroup) == null || s.destroy({
            children: !0
        }), this.bigWinFxGroup = null, this.bigWinArrow = null, this.bigWinArrowTicker = null, this.wheelChainSpanOverride = null, this.wheelChainSprite && (this.wheelChainSprite.visible = !1), await this.playPhoneAnimation(), await this.showEndScreen()
    }
    pickWeightedSector() {
        return ns.find(t => t.name === "x7") ?? ns[0]
    }
    calculateTargetAngle(t, e) {
        const s = Math.PI * 2,
            r = s / ns.length,
            n = (-t * r % s + s) % s,
            o = (e % s + s) % s,
            a = n - o;
        return a >= 0 ? a : a + s
    }
    setWheelSpinBlur(t) {
        this.wheelSpinBlur && (this.wheelSpinBlur.strength = Th(t, 0, Ob))
    }
    async tweenWheelRotation(t, e, s = kt, r = .18) {
        if (!this.wheelSpinner) return;
        let n = this.wheelSpinner.rotation;
        const o = () => {
            var c;
            const a = Math.max(this.app.ticker.deltaMS / 1e3, .001),
                h = ((c = this.wheelSpinner) == null ? void 0 : c.rotation) ?? n,
                l = Math.abs(h - n) / a;
            n = h, this.setWheelSpinBlur(l * r)
        };
        this.addTicker(o);
        try {
            await st(this.app, this.wheelSpinner, {
                rotation: t
            }, e, s)
        } finally {
            this.removeTicker(o)
        }
    }
    async spinWheel() {
        var a;
        const t = this.pickWeightedSector(),
            e = ns.indexOf(t),
            r = (((a = this.wheelSpinner) == null ? void 0 : a.rotation) ?? 0) - .09,
            n = Bb * Math.PI * 2 + this.calculateTargetAngle(e, r),
            o = r + n;
        return await this.tweenWheelRotation(r, .06, kt, .2), await new Promise(h => {
            let l = 0,
                c = r;
            const u = () => {
                const d = Math.max(this.app.ticker.deltaMS / 1e3, .001);
                l += d;
                const f = Math.min(l / Rb, 1),
                    p = f * f * (3 - 2 * f),
                    m = r + n * p,
                    g = Math.abs(m - c) / d;
                c = m, this.wheelSpinner && (this.wheelSpinner.rotation = m), this.setWheelSpinBlur(g * .8), f >= 1 && (this.wheelSpinner && (this.wheelSpinner.rotation = o), this.removeTicker(u), h())
            };
            this.addTicker(u)
        }), await this.tweenWheelRotation(o + .18, .15, kt, .12), await this.tweenWheelRotation(o - .1, .12, Mt, .08), await this.tweenWheelRotation(o + .04, .1, kt, .06), await this.tweenWheelRotation(o, .08, kt, .04), this.setWheelSpinBlur(0), t
    }
    async triggerSpin() {
        if (this.isWheelSpinning || !this.wheelActive || !this.buildButton) return;
        this.isWheelSpinning = !0, this.buildButton.alpha = .5, this.guideArrow && (this.guideArrow.visible = !1), this.playSound("Wheel 2.mp3", .5);
        const t = await this.spinWheel();
        await be(this.app, .5), this.state.multipliers.push(t.multiplier > 0 ? t.multiplier : 5), this.state.cashOut = _h(yh, this.state.multipliers), await this.updateResults(), this.updateCashOut(), await this.hideWheel(), await this.showBigWin(), this.isWheelSpinning = !1
    }
    async showBigWin() {
        if (!this.buildButton || !this.textures || !this.fxLayer) return;
        this.buildButton.alpha = .25, this.playSound("win_FG.mp3", .55);
        const t = new Z().rect(-H * 2, -J * 2, H * 5, J * 5).fill({
            color: 0
        });
        t.alpha = 0;
        const e = this.shakeLayer ?? this.root,
            s = this.hudLayer ? e.getChildIndex(this.hudLayer) : e.children.length;
        e.addChildAt(t, s), this.bigWinOverlay = t, st(this.app, t, {
            alpha: Nb
        }, .32, Mt);
        const r = new D;
        this.wheelRig.addChild(r), this.bigWinGroup = r;
        const n = new D;
        this.fxLayer.addChild(n), this.bigWinFxGroup = n;
        const o = new Q(this.textures["box bigwin.webp"]);
        o.anchor.set(.5, .5), o.width = H * Db, o.scale.y = o.scale.x;
        const a = J * Ub;
        o.position.set(0, a), r.addChild(o), this.wheelChainSpanOverride = a + o.height * .42, this.wheelChainSprite.visible = !0, this.wheelContainer && (this.wheelContainer.visible = !1), this.updateWheelRigLayout(), this.wheelRig.y = this.getWheelRigOffscreenY(), await st(this.app, this.wheelRig, {
            y: 0
        }, .55, Ir);
        const h = 0,
            l = 12080,
            c = new Ot({
                text: `${h.toLocaleString(ve().locale)} ${ve().currencySymbol}`,
                style: {
                    fontFamily: Rt,
                    fontSize: Math.round(H * .145),
                    fontWeight: "700",
                    fill: "#fffdf7",
                    dropShadow: {
                        color: 0,
                        alpha: .95,
                        blur: 16,
                        distance: 0
                    }
                }
            });
        c.anchor.set(.5, .5), c.position.set(0, a + o.height * .19), r.addChild(c), this.updateCashOut(), this.setCashOutGoldProgress(0), this.playBoomParticles(a, 15, n), this.startBigWinAmbientParticles(a), this.playSound("cash_register2.mp3", .4), await new Promise(m => {
            let g = 0;
            const _ = 2.5,
                x = () => {
                    g += this.app.ticker.deltaMS / 1e3;
                    const b = Math.min(g / _, 1),
                        y = Math.round(h + (l - h) * Mt(b));
                    c.text = `${formatWinNumber(y)} ${ve().currencySymbol}`, this.cashOutAmount && (this.cashOutAmount.text = Gs(y)), this.setCashOutGoldProgress((y - wh) / (l - wh)), b >= 1 && (c.text = `12 080 ${ve().currencySymbol}`, this.cashOutAmount && (this.cashOutAmount.text = Gs(l)), this.setCashOutGoldProgress(1), this.removeTicker(x), m())
                };
            this.addTicker(x)
        }), this.state.cashOut = l, this.updateCashOut(), this.buildButton.eventMode = "none", this.cashOutGroup && await st(this.app, this.cashOutGroup, {
            alpha: 1
        }, .4, Mt);
        const u = Dr(.56);
        u.position.set(this.cashOutGroup.x - 6, this.cashOutGroup.y - 58), u.rotation = -.2, u.alpha = 0, n.addChild(u), this.bigWinArrow = u, this.isBigWinActive = !0, st(this.app, u, {
            alpha: 1
        }, .5, Mt);
        let d = 0;
        const f = u.y,
            p = () => {
                d += this.app.ticker.deltaMS / 1e3, u.y = f + Math.sin(d * 4) * 8
            };
        this.addTicker(p), this.bigWinArrowTicker = p
    }
    async playPhoneAnimation() {
        if (!this.textures) return;
        const t = [];
        for (const o of bh) {
            const a = this.textures[o];
            a && t.push(a)
        }
        if (t.length === 0) return;
        const e = new ti(t);
        e.anchor.set(.5), e.animationSpeed = Ab / 60, e.loop = !1;
        const s = t[0].height,
            r = J * .78 / s;
        e.scale.set(r), e.position.set(H / 2, J * .46), e.y = J + s * r * .5, (this.shakeLayer ?? this.root).addChild(e), this.playSound("sfx_Whoosh_11.mp3", .4), await st(this.app, e, {
            y: J * .46
        }, .5, Ir);
        const n = [.6, 1.27, 2.05];
        for (const o of n) be(this.app, o).then(() => this.playSound("sms.mp3", .4));
        e.gotoAndPlay(0), await new Promise(o => {
            e.onComplete = () => o()
        }), await be(this.app, .5), await st(this.app, e, {
            y: -(s * r * .6)
        }, .45, Br), e.destroy()
    }
    async showEndScreen() {
        if (!this.textures) return;
        if (this.wheelRig || (this.wheelRig = new D), (this.shakeLayer ?? this.root).addChild(this.wheelRig), !this.wheelChainSprite) {
            const p = new Q(this.textures["wheel/cepochka.webp"]);
            p.anchor.set(.5, 0), this.wheelChainSprite = p, this.wheelRig.addChild(p)
        }
        const t = new D;
        this.wheelRig.addChild(t);
        const e = new Q(this.textures["box bonus.webp"]);
        e.anchor.set(.5, .5), e.width = H * .88, e.scale.y = e.scale.x;
        const s = J * .38;
        e.position.set(0, s), t.addChild(e);
        const r = new Ot({
            text: "BONUS",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(H * .095),
                fontWeight: "700",
                fill: "#ffffff",
                dropShadow: {
                    color: 0,
                    alpha: .9,
                    blur: 10,
                    distance: 0
                }
            }
        });
        r.anchor.set(.5), r.position.set(0, s - e.height * .17), t.addChild(r);
        const n = new Ot({
            text: "€1500 + 250",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(H * .075),
                fontWeight: "700",
                fill: "#f4c16e",
                dropShadow: {
                    color: 0,
                    alpha: .9,
                    blur: 8,
                    distance: 0
                }
            }
        });
        n.anchor.set(.5), n.position.set(0, s + e.height * .01), t.addChild(n);
        const o = new Ot({
            text: "FREE SPINS",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(H * .07),
                fontWeight: "700",
                fill: "#ffffff",
                dropShadow: {
                    color: 0,
                    alpha: .9,
                    blur: 10,
                    distance: 0
                }
            }
        });
        o.anchor.set(.5), o.position.set(0, s + e.height * .17), t.addChild(o);
        const l = new D,
            c = new Q(this.textures["but build.webp"]);
        c.anchor.set(.5), c.height = J * .12, c.scale.x = c.scale.y;
        const u = new Ot({
            text: "INSTALL",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(c.width * .13),
                fontWeight: "700",
                fill: "#f2efe8",
                letterSpacing: 2.5,
                dropShadow: {
                    color: 3276800,
                    alpha: .62,
                    blur: 3,
                    distance: 2,
                    angle: Math.PI / 2
                }
            }
        });
        u.anchor.set(.5), l.addChild(c, u), l.position.set(H / 2, s + e.height * .52 + 140), l.eventMode = "static", l.cursor = "pointer", l.on("pointertap", () => {
            var p;
            this.playSound("minecraft-click cut.mp3"), (p = window.openStore) == null || p.call(window)
        }), (this.shakeLayer ?? this.root).addChild(l), this.wheelChainSprite.visible = !0, this.wheelContainer && (this.wheelContainer.visible = !1), this.bigWinGroup = t, this.wheelChainSpanOverride = s + e.height * .42, this.updateWheelRigLayout(), this.wheelRig.position.set(H / 2, this.getWheelRigOffscreenY()), this.wheelRig.visible = !0, l.alpha = 0, this.playSound("open treasure.mp3"), await st(this.app, this.wheelRig, {
            y: 0
        }, .7, kt), await st(this.app, l, {
            alpha: 1
        }, .3, Mt);
        let d = 0;
        const f = () => {
            d += this.app.ticker.deltaMS / 1e3;
            const p = 1 + Math.sin(d * 3.8) * .025;
            l.scale.set(p)
        };
        this.addTicker(f)
    }
    playSound(t, e = .5) {
        try {
            let s = this.audioCache.get(t);
            s || (s = new Audio(Us(t)), this.audioCache.set(t, s)), s.volume = this.muteController.getMuted() ? 0 : e, s.muted = this.muteController.getMuted(), s.currentTime = 0, s.play().catch(() => {})
        } catch {}
    }
    startBgMusic() {
        if (!this.bgMusic) try {
            this.bgMusic = new Audio(Us("thron rem.mp3")), this.bgMusic.loop = !0, this.bgMusic.volume = this.muteController.getMuted() ? 0 : .18, this.bgMusic.muted = this.muteController.getMuted(), this.bgMusic.play().catch(() => {})
        } catch {}
    }
    playBoomParticles(t = J * .52, e = 15, s = this.fxLayer ?? void 0) {
        if (!this.textures) return;
        const r = [];
        for (let n = 0; n <= 48; n++) {
            const o = `boom/Boom_particle_[01-49].webp Comp 1_${String(n).padStart(5,"0")}.webp`,
                a = this.textures[o];
            a && r.push(a)
        }
        if (!(r.length === 0 || !s))
            for (let n = 0; n < e; n++) {
                const o = new ti(r);
                o.anchor.set(.5, .5), o.animationSpeed = .35 + Math.random() * .35, o.loop = !1, o.position.set(H / 2 + (Math.random() - .5) * H * .92, t + (Math.random() - .5) * J * .7), o.scale.set(.38 + Math.random() * .38), o.rotation = Math.random() * Math.PI * 2, o.tint = 16040302, o.alpha = .82, o.onComplete = () => o.destroy(), s.addChild(o), o.play();
                let a = -1.8 - Math.random() * 2.4,
                    h = (Math.random() - .5) * 2.6;
                const l = () => {
                    if (o.destroyed) {
                        this.removeTicker(l);
                        return
                    }
                    a += .06, o.y += a, o.x += h, o.alpha -= .0075
                };
                this.addTicker(l)
            }
    }
}

function qb(i) {
    const t = ve();
    return {
        state: "prompt-build",
        layers: ["background", "atmosphere", "logo", "suspended-piece", "pedestal", "hud"],
        assets: Qu,
        cashOut: {
            label: "CASH OUT",
            amount: `0.00 ${t.currencyCode}`
        },
        buildButton: {
            label: "BUILD"
        },
        guideArrow: {
            visible: !0
        },
        suspendedPiece: {
            asset: "throne1.webp",
            hookAsset: "kruk.webp"
        },
        layout: $s(i)
    }
}
const Kb = .04;

function go(i) {
    return "assets/" + i
}

function Zb(i) {
    return go(i)
}
async function Qb() {
    const i = await Promise.all([...Qu, "tros.webp"].map(async t => {
        const e = await Te.load(Zb(t));
        return [t, e]
    }));
    return Object.fromEntries(i)
}

function Jb(i) {
    const t = new D,
        e = new Z;
    e.roundRect(0, 0, 88, 88, 18).fill({
        color: 1182986,
        alpha: .72
    }).stroke({
        color: 9398847,
        alpha: .9,
        width: 2
    });
    const s = new Z;
    return s.moveTo(22, 34).lineTo(34, 34).lineTo(48, 24).lineTo(48, 64).lineTo(34, 54).lineTo(22, 54).closePath().fill({
        color: 15921128
    }), i ? (s.moveTo(58, 28).lineTo(74, 60).stroke({
        color: 15921128,
        width: 5
    }), s.moveTo(74, 28).lineTo(58, 60).stroke({
        color: 15921128,
        width: 5
    })) : (s.arc(54, 44, 10, -.9, .9).stroke({
        color: 15921128,
        width: 4
    }), s.arc(54, 44, 18, -.9, .9).stroke({
        color: 15921128,
        width: 4,
        alpha: .9
    })), t.addChild(e, s), t
}

function t0(i, t, e) {
    const s = new D,
        r = new Q(i),
        n = new Z;
    r.anchor.set(.5, 526 / 1080), r.position.set(H / 2, t), r.width = 4e3, r.scale.y = r.scale.x;
    const o = r.width,
        a = H / 2 - o / 2;
    return n.rect(a, t - 120, o, 140).fill({
        color: 16181195,
        alpha: .08
    }), n.filters = [new zt({
        strength: 4,
        quality: 2
    })], n.filterArea = new nt(a - 32, t - 160, o + 64, 220), s.addChild(r, n), s
}

function Ch(i, t) {
    const e = new D,
        s = new Z,
        r = new Z,
        n = new Z,
        o = new Z,
        a = new Z,
        h = new Z,
        l = new Z,
        c = new Z,
        u = new Z;
    r.ellipse(i * .5, -t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It
    }), n.ellipse(i * .5, t + t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It * 1.02
    }), o.ellipse(-i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), a.ellipse(i + i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), h.ellipse(-i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), l.ellipse(i + i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), c.ellipse(-i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    }), u.ellipse(i + i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    });
    const d = new zt({
        strength: 28,
        quality: 4
    });
    d.padding = 200, e.filters = [d], s.ellipse(i * .5, t * .33, i * .17, t * .06).fill({
        color: 15777652,
        alpha: .12
    });
    const f = new zt({
        strength: 28,
        quality: 4
    });
    return f.padding = 200, s.filters = [f], e.addChild(s, r, n, o, a, h, l, c, u), e
}

function e0(i) {
    const t = new D,
        e = new Z,
        s = new Z,
        r = (n, o) => {
            n.moveTo(-12, -56).lineTo(12, -56).lineTo(12, -14).lineTo(28, -14).lineTo(0, 40).lineTo(-28, -14).lineTo(-12, -14).closePath().fill({
                color: 16777215,
                alpha: o
            })
        };
    return r(e, .22), e.scale.set(1.08), e.y = 4, r(s, 1), t.scale.set(i * 1.1), t.addChild(e, s), t
}

function Ah(i, t) {
    i.eventMode = "static", i.cursor = "pointer", i.on("pointerdown", () => {
        t(!0)
    }), i.on("pointerup", () => t(!1)), i.on("pointerupoutside", () => t(!1)), i.on("pointerout", () => t(!1))
}
class s0 {
    constructor(t, e) {
        E(this, "root", new D);
        E(this, "app");
        E(this, "onBuild");
        E(this, "muteController");
        E(this, "textures", null);
        E(this, "buildButton", null);
        E(this, "guideArrow", null);
        E(this, "suspendedPiece", null);
        E(this, "buildPulseTime", 0);
        E(this, "buildButtonPressed", !1);
        E(this, "buildTriggered", !1);
        E(this, "guideArrowBaseY", 0);
        E(this, "screenWidth", 0);
        E(this, "screenHeight", 0);
        E(this, "frozenEntryPose", null);
        E(this, "atmosphereLayer", null);
        E(this, "fogContainer", null);
        E(this, "tick", () => {
            if (this.buildPulseTime += this.app.ticker.deltaMS / 1e3, this.buildButton) {
                const t = 1 + Math.sin(this.buildPulseTime * 3.4) * .018,
                    e = this.buildButtonPressed ? .965 : 1;
                this.buildButton.scale.set(t * e)
            }
            if (this.guideArrow && (this.guideArrow.y = this.guideArrowBaseY + Math.sin(this.buildPulseTime * 5.2) * 8, this.guideArrow.alpha = .84 + (Math.sin(this.buildPulseTime * 5.2) + 1) * .08), this.suspendedPiece) {
                const t = Math.sin(this.buildPulseTime * 2.5) * .21;
                this.suspendedPiece.rotation = t;
                // DEBUG: log start scene block position every frame
                const block = this.suspendedPiece.children[3];
                if (block) {
                    const localCenter = {
                        x: block.x,
                        y: block.y + block.height / 2
                    };
                    const wp = this.suspendedPiece.toGlobal(localCenter);
                    console.log(`[DEBUG START TICK] rotation=${t.toFixed(4)} blockLocal=(${localCenter.x.toFixed(1)},${localCenter.y.toFixed(1)}) blockWorld=(${wp.x.toFixed(1)},${wp.y.toFixed(1)})`);
                }
            }
        });
        this.app = t, this.onBuild = e.onBuild, this.muteController = e.muteController
    }
    async init() {
        this.textures = await Qb(), this.root.eventMode = "passive", this.render(this.app.screen.width, this.app.screen.height), this.app.ticker.add(this.tick)
    }
    destroy() {
        this.app.ticker.remove(this.tick), this.fogContainer && (this.fogContainer.removeFromParent(), this.fogContainer = null), this.root.destroy({
            children: !0
        })
    }
    setFog(t) {
        this.fogContainer = t, this.atmosphereLayer && (this.atmosphereLayer.removeChildren(), this.atmosphereLayer.addChild(t, Ch(this.screenWidth, this.screenHeight)))
    }
    resize(t, e) {
        this.textures && this.render(t, e)
    }
    getEntryPose() {
        return this.frozenEntryPose ?? this.captureEntryPose()
    }
    captureEntryPose() {
        if (!this.suspendedPiece) return;
        const t = this.suspendedPiece.children[3];
        if (!(t instanceof Q)) return;
        const o = resolveTransferredBlockEntryPose({
            craneX: this.suspendedPiece.x,
            craneY: this.suspendedPiece.y,
            rotation: this.suspendedPiece.rotation,
            blockX: t.x,
            blockTopY: t.y,
            blockHeight: t.height,
            blockRotation: t.rotation || this.suspendedPiece.rotation,
            textureName: "throne1.webp"
        });
        return console.log("[StartScene] captureEntryPose", o), o
    }
    async triggerBuild() {
        var e, s;
        if (this.buildTriggered) return;
        this.buildTriggered = !0, this.buildButtonPressed = !1;
        const t = ((e = this.suspendedPiece) == null ? void 0 : e.rotation) ?? 0;
        this.suspendedPiece && (this.suspendedPiece.rotation = t), this.frozenEntryPose = this.captureEntryPose() ?? null, this.frozenEntryPose && (this.frozenEntryPose.rotation = t, this.frozenEntryPose.blockRotation = 0), console.log("[StartScene] triggerBuild frozenEntryPose", this.frozenEntryPose);
        try {
            await ((s = this.onBuild) == null ? void 0 : s.call(this))
        } catch (r) {
            this.buildTriggered = !1, console.error("Failed to transition to gameplay scene", r)
        }
    }
    render(t, e) {
        if (this.screenWidth = t, this.screenHeight = e, !this.textures) return;
        this.fogContainer && this.fogContainer.removeFromParent(), this.root.removeChildren().forEach(xt => {
            xt.destroy({
                children: !0
            })
        });
        const s = qb({
                width: t,
                height: e
            }),
            r = $s({
                width: t,
                height: e
            }),
            n = new D;
        this.atmosphereLayer = new D;
        const o = new D,
            a = new D,
            h = new D,
            l = new D,
            c = new Q(this.textures["bg main new.webp"]);
        c.anchor.set(.5, .5), c.position.set(t / 2, e / 2), c.scale.set(2.1), n.filters = [new zt({
            strength: Zu,
            quality: 4,
            kernelSize: 9,
            padding: 128
        })], n.addChild(c), this.atmosphereLayer.addChild(Ch(t, e));
        const u = new Q(this.textures["log twr.webp"]);
        u.anchor.set(.5, 0);
        const d = r.logo.width / u.texture.width * 1.17;
        u.position.set(t / 2, e * .02), u.scale.set(d), u.alpha = .97;
        const f = new Q(this.textures["log twr.webp"]);
        f.anchor.set(.5, 0), f.position.set(t / 2 + 5, e * .02 + 7), f.scale.set(d), f.tint = 1116936, f.alpha = .28, o.addChild(f, u);
        const p = this.textures[s.suspendedPiece.hookAsset],
            m = this.textures[s.suspendedPiece.asset],
            g = new D;
        g.pivot.set(0, 0), g.x = t / 2, g.y = 0;
        const _ = e * .26,
            x = new Q(p);
        x.anchor.set(.5, 0), x.x = 0, x.y = _ - 5;
        const b = t * .07 / p.width;
        x.scale.set(b);
        const y = new Z;
        y.moveTo(0, -e * .24), y.lineTo(0, x.y + x.height * .4), y.stroke({
            width: 2.5,
            color: 4473924
        });
        const S = t * .58 * 1.3,
            v = new Q(m);
        v.anchor.set(.5, 0), v.x = 0;
        const T = S / m.width;
        v.scale.set(T);
        const M = x.y + x.height * .801 + 5;
        v.y = M + e * .1 - 110;
        const C = new Q(m);
        C.anchor.set(.5, 0), C.position.set(v.x, v.y), C.scale.set(T), C.tint = 0, C.alpha = .72, C.filters = [new zt({
            strength: 8,
            quality: 4
        })];
        const A = 172 / 467,
            P = 305 / 467,
            k = 180 / 303,
            G = (A - .5) * v.width,
            F = (P - .5) * v.width,
            ht = v.y + k * v.height,
            R = new Z;
        R.moveTo(0, M), R.lineTo(G, ht), R.moveTo(0, M), R.lineTo(F, ht), R.stroke({
            width: 2.5,
            color: 8947848
        }), g.addChild(y), g.addChild(R), g.addChild(C), g.addChild(v), g.addChild(x), a.addChild(g), this.suspendedPiece = g, h.addChild(t0(this.textures["platform wide.webp"], r.pedestal.topY));
        const I = r.hud.buttonHeight,
            z = r.hud.gap,
            B = r.hud.buttonY,
            L = new D,
            q = new Q(this.textures["but cash out.webp"]);
        q.anchor.set(.5, .5), q.height = I * 1.04, q.scale.x = q.scale.y;
        const K = new Ot({
            text: s.cashOut.label,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(I * .15),
                fontWeight: "700",
                fill: "#d7d5d3",
                letterSpacing: .7
            }
        });
        K.anchor.set(.5, .5), K.x = 0, K.y = -q.height * .05;
        const W = new Ot({
            text: s.cashOut.amount,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(I * .1),
                fontWeight: "700",
                fill: "#d1cbc4",
                letterSpacing: .25
            }
        });
        W.anchor.set(.5, .5), W.x = 0, W.y = q.height * .08, L.addChild(q, K, W);
        const et = new D,
            rt = new Q(this.textures["but build.webp"]);
        rt.anchor.set(.5, .5), rt.height = I, rt.scale.x = rt.scale.y;
        const ut = new Ot({
            text: s.buildButton.label,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(I * .35),
                fontWeight: "700",
                fill: "#f2efe8",
                letterSpacing: 1.5,
                dropShadow: {
                    color: 3276800,
                    alpha: .62,
                    blur: 3,
                    distance: 2,
                    angle: Math.PI / 2
                }
            }
        });
        ut.anchor.set(.5, .5), ut.x = 0, ut.y = 0, et.addChild(rt, ut);
        const ct = q.width + z + rt.width,
            vt = (t - ct) / 2;
        L.x = vt + q.width / 2 + r.hud.cashOutCenterOffsetX, L.y = B, et.x = vt + q.width + z + rt.width / 2, et.y = B, Ah(L, () => {}), Ah(et, xt => {
            this.buildButtonPressed = xt
        });
        const $ = e0(r.guideArrow.scale);
        $.position.set(r.guideArrow.x, r.guideArrow.y + e * Kb), $.visible = s.guideArrow.visible, this.guideArrowBaseY = $.y, et.on("pointertap", xt => {
            xt.stopPropagation(), this.triggerBuild()
        }), L.on("pointertap", xt => {
            xt.stopPropagation()
        });
        const wt = Jb(this.muteController.getMuted());
        wt.position.set(t - 120, 72), wt.eventMode = "static", wt.cursor = "pointer", wt.on("pointertap", xt => {
            xt.stopPropagation(), this.muteController.toggleMuted(), this.render(this.screenWidth, this.screenHeight)
        }), l.addChild(L, et, $, wt), this.root.addChild(n, this.atmosphereLayer, a, h, l, o), this.fogContainer && this.atmosphereLayer.addChild(this.fogContainer), this.buildButton = et, this.guideArrow = $, this.buildButtonPressed = !1
    }
}
async function i0({
    app: i,
    startScene: t,
    createGameplayScene: e,
    autoDropOnEnter: s = !1,
    fogContainer: r
}) {
    var a, h, l, c;
    const n = e(),
        o = (a = t.getEntryPose) == null ? void 0 : a.call(t);
    return await n.init(), o && (console.log("[SceneTransition] handoff entryPose", o), (h = n.applyEntryPose) == null || h.call(n, o)), r && n.setFog(r), (l = t.root.parent) == null || l.removeChild(t.root), t.destroy(), s && await ((c = n.beginFirstDrop) == null ? void 0 : c.call(n)), n
}

function r0({
    viewportWidth: i,
    viewportHeight: t,
    designWidth: e,
    designHeight: s
}) {
    const r = Math.min(i / e, t / s);
    return {
        scale: r,
        x: (i - e * r) / 2,
        y: (t - s * r) / 2
    }
}

function n0(i, t, e) {
    // Particles removed - return empty container
    const n = new D;
    return {
        container: n,
        particles: []
    }
}
const Fs = {
        muted: !1
    },
    Ur = {
        getMuted: () => Fs.muted,
        setMuted: i => {
            Fs.muted = i
        },
        toggleMuted: () => (Fs.muted = !Fs.muted, Fs.muted)
    };
(async () => {
    window.__adReady || await new Promise(f => {
        window.__startApp = f
    });
    const i = document.getElementById("app");
    if (!i) throw new Error("App host not found");
    const t = 1080,
        e = 1920,
        s = new Al;
    await sb(), await s.init({
        resizeTo: window,
        backgroundColor: 591621,
        backgroundAlpha: 1,
        antialias: !0,
        autoDensity: !0,
        preference: "webgl",
        preserveDrawingBuffer: !0,
        resolution: Math.min(window.devicePixelRatio || 1, 2)
    }), i.appendChild(s.canvas);
    const r = new D;
    s.stage.addChild(r);
    const n = n0(s, s.screen.width, s.screen.height);
    let o, a = !1;
    const h = new s0(s, {
        muteController: Ur,
        onBuild: async () => {
            if (!a) {
                a = !0;
                try {
                    o = await i0({
                        app: s,
                        startScene: h,
                        createGameplayScene: () => new jb(s, {
                            muteController: Ur
                        }),
                        autoDropOnEnter: !0,
                        fogContainer: n.container
                    }), r.addChild(o.root), d()
                } catch (f) {
                    throw a = !1, f
                }
            }
        }
    });
    o = h, await o.init(), r.addChild(o.root), o.setFog(n.container);
    let l = 0;
    s.ticker.add(() => {
        const f = s.ticker.deltaMS / 1e3;
        l += f;
        for (const p of n.particles) {
            if (!p.sprite || p.sprite.destroyed || (p.elapsed += f, p.elapsed < p.delay)) continue;
            const g = (p.elapsed - p.delay) / p.lifetime;
            p.sprite.y = p.baseY - p.riseDistance * Math.min(g, 1), p.sprite.x = p.baseX + Math.sin(Math.min(g, 1) * Math.PI * 2 + p.driftPhase) * p.driftDistance;
            let _ = 0;
            g < .2 ? _ = g / .2 * .18 : _ = .18 * (.88 + .12 * ((Math.sin(l * 1) + 1) / 2)), p.sprite.alpha = _
        }
    });
    let c = s.screen.width,
        u = s.screen.height;

    function d() {
        const f = s.screen.width,
            p = s.screen.height,
            m = r0({
                viewportWidth: f,
                viewportHeight: p,
                designWidth: t,
                designHeight: e
            });
        r.scale.set(m.scale), r.position.set(m.x, m.y), o.resize(t, e)
    }
    d(), s.ticker.add(() => {
        const f = s.screen.width,
            p = s.screen.height;
        (f !== c || p !== u) && (c = f, u = p, d())
    }), document.addEventListener("visibilitychange", () => {
        document.hidden && Ur.setMuted(!0)
    })
})();
Y.add(mf);
Y.mixin(D, gf);
Y.add(ec);
Y.add(sc);
Y.mixin(D, Lg);
Y.add(hc);
Y.add(ac);
const o0 = Object.freeze(Object.defineProperty({
        __proto__: null
    }, Symbol.toStringTag, {
        value: "Module"
    })),
    a0 = Object.freeze(Object.defineProperty({
        __proto__: null
    }, Symbol.toStringTag, {
        value: "Module"
    }));
