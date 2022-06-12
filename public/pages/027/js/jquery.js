/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document) {
                throw Error("jQuery requires a window with a document")
            }
            return t(e)
        }
        : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e, t, n) {
        n = n || Te;
        var r, i, o = n.createElement("script");
        if (o.text = e,
            t) {
            for (r in Ce) {
                i = t[r] || t.getAttribute && t.getAttribute(r),
                i && o.setAttribute(r, i)
            }
        }
        n.head.appendChild(o).parentNode.removeChild(o)
    }
    function r(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? he[ge.call(e)] || "object" : typeof e
    }
    function i(e) {
        var t = !!e && "length"in e && e.length
            , n = r(e);
        return be(e) || we(e) ? !1 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }
    function o(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    function a(e, t, n) {
        return be(t) ? Se.grep(e, function(e, r) {
            return !!t.call(e, r, e) !== n
        }) : t.nodeType ? Se.grep(e, function(e) {
            return e === t !== n
        }) : "string" != typeof t ? Se.grep(e, function(e) {
            return de.call(t, e) > -1 !== n
        }) : Se.filter(t, e, n)
    }
    function s(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; ) {}
        return e
    }
    function u(e) {
        var t = {};
        return Se.each(e.match(Re) || [], function(e, n) {
            t[n] = !0
        }),
            t
    }
    function l(e) {
        return e
    }
    function c(e) {
        throw e
    }
    function f(e, t, n, r) {
        var i;
        try {
            e && be(i = e.promise) ? i.call(e).done(t).fail(n) : e && be(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    function p() {
        Te.removeEventListener("DOMContentLoaded", p),
            e.removeEventListener("load", p),
            Se.ready()
    }
    function d(e, t) {
        return t.toUpperCase()
    }
    function h(e) {
        return e.replace(Fe, "ms-").replace($e, d)
    }
    function g() {
        this.expando = Se.expando + g.uid++
    }
    function m(e) {
        return "true" === e ? !0 : "false" === e ? !1 : "null" === e ? null : e === +e + "" ? +e : Ue.test(e) ? JSON.parse(e) : e
    }
    function v(e, t, n) {
        var r;
        if (void 0 === n && 1 === e.nodeType) {
            if (r = "data-" + t.replace(Xe, "-$&").toLowerCase(),
                n = e.getAttribute(r),
            "string" == typeof n) {
                try {
                    n = m(n)
                } catch (i) {}
                ze.set(e, t, n)
            } else {
                n = void 0
            }
        }
        return n
    }
    function y(e, t, n, r) {
        var i, o, a = 20, s = r ? function() {
                return r.cur()
            }
            : function() {
                return Se.css(e, t, "")
            }
            , u = s(), l = n && n[3] || (Se.cssNumber[t] ? "" : "px"), c = e.nodeType && (Se.cssNumber[t] || "px" !== l && +u) && Ge.exec(Se.css(e, t));
        if (c && c[3] !== l) {
            for (u /= 2,
                     l = l || c[3],
                     c = +u || 1; a--; ) {
                Se.style(e, t, c + l),
                (1 - o) * (1 - (o = s() / u || 0.5)) <= 0 && (a = 0),
                    c /= o
            }
            c = 2 * c,
                Se.style(e, t, c + l),
                n = n || []
        }
        return n && (c = +c || +u || 0,
            i = n[1] ? c + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = l,
            r.start = c,
            r.end = i)),
            i
    }
    function x(e) {
        var t, n = e.ownerDocument, r = e.nodeName, i = et[r];
        return i ? i : (t = n.body.appendChild(n.createElement(r)),
            i = Se.css(t, "display"),
            t.parentNode.removeChild(t),
        "none" === i && (i = "block"),
            et[r] = i,
            i)
    }
    function b(e, t) {
        for (var n, r, i = [], o = 0, a = e.length; a > o; o++) {
            r = e[o],
            r.style && (n = r.style.display,
                t ? ("none" === n && (i[o] = _e.get(r, "display") || null,
                i[o] || (r.style.display = "")),
                "" === r.style.display && Ze(r) && (i[o] = x(r))) : "none" !== n && (i[o] = "none",
                    _e.set(r, "display", n)))
        }
        for (o = 0; a > o; o++) {
            null != i[o] && (e[o].style.display = i[o])
        }
        return e
    }
    function w(e, t) {
        var n;
        return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
            void 0 === t || t && o(e, t) ? Se.merge([e], n) : n
    }
    function T(e, t) {
        for (var n = 0, r = e.length; r > n; n++) {
            _e.set(e[n], "globalEval", !t || _e.get(t[n], "globalEval"))
        }
    }
    function C(e, t, n, i, o) {
        for (var a, s, u, l, c, f, p = t.createDocumentFragment(), d = [], h = 0, g = e.length; g > h; h++) {
            if (a = e[h],
            a || 0 === a) {
                if ("object" === r(a)) {
                    Se.merge(d, a.nodeType ? [a] : a)
                } else {
                    if (ot.test(a)) {
                        for (s = s || p.appendChild(t.createElement("div")),
                                 u = (nt.exec(a) || ["", ""])[1].toLowerCase(),
                                 l = it[u] || it._default,
                                 s.innerHTML = l[1] + Se.htmlPrefilter(a) + l[2],
                                 f = l[0]; f--; ) {
                            s = s.lastChild
                        }
                        Se.merge(d, s.childNodes),
                            s = p.firstChild,
                            s.textContent = ""
                    } else {
                        d.push(t.createTextNode(a))
                    }
                }
            }
        }
        for (p.textContent = "",
                 h = 0; a = d[h++]; ) {
            if (i && Se.inArray(a, i) > -1) {
                o && o.push(a)
            } else {
                if (c = Je(a),
                    s = w(p.appendChild(a), "script"),
                c && T(s),
                    n) {
                    for (f = 0; a = s[f++]; ) {
                        rt.test(a.type || "") && n.push(a)
                    }
                }
            }
        }
        return p
    }
    function E() {
        return !0
    }
    function S() {
        return !1
    }
    function k(e, t) {
        return e === A() == ("focus" === t)
    }
    function A() {
        try {
            return Te.activeElement
        } catch (e) {}
    }
    function N(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            "string" != typeof n && (r = r || n,
                n = void 0);
            for (s in t) {
                N(e, s, n, r, t[s], o)
            }
            return e
        }
        if (null == r && null == i ? (i = n,
            r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
            r = void 0) : (i = r,
            r = n,
            n = void 0)),
        i === !1) {
            i = S
        } else {
            if (!i) {
                return e
            }
        }
        return 1 === o && (a = i,
            i = function(e) {
                return Se().off(e),
                    a.apply(this, arguments)
            }
            ,
            i.guid = a.guid || (a.guid = Se.guid++)),
            e.each(function() {
                Se.event.add(this, t, i, r, n)
            })
    }
    function j(e, t, n) {
        return n ? (_e.set(e, t, !1),
            void Se.event.add(e, t, {
                namespace: !1,
                handler: function(e) {
                    var r, i, o = _e.get(this, t);
                    if (1 & e.isTrigger && this[t]) {
                        if (o.length) {
                            (Se.event.special[t] || {}).delegateType && e.stopPropagation()
                        } else {
                            if (o = ce.call(arguments),
                                _e.set(this, t, o),
                                r = n(this, t),
                                this[t](),
                                i = _e.get(this, t),
                                o !== i || r ? _e.set(this, t, !1) : i = {},
                            o !== i) {
                                return e.stopImmediatePropagation(),
                                    e.preventDefault(),
                                i && i.value
                            }
                        }
                    } else {
                        o.length && (_e.set(this, t, {
                            value: Se.event.trigger(Se.extend(o[0], Se.Event.prototype), o.slice(1), this)
                        }),
                            e.stopImmediatePropagation())
                    }
                }
            })) : void (void 0 === _e.get(e, t) && Se.event.add(e, t, E))
    }
    function D(e, t) {
        return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") ? Se(e).children("tbody")[0] || e : e
    }
    function q(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
            e
    }
    function L(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
            e
    }
    function H(e, t) {
        var n, r, i, o, a, s, u;
        if (1 === t.nodeType) {
            if (_e.hasData(e) && (o = _e.get(e),
                u = o.events)) {
                _e.remove(t, "handle events");
                for (i in u) {
                    for (n = 0,
                             r = u[i].length; r > n; n++) {
                        Se.event.add(t, i, u[i][n])
                    }
                }
            }
            ze.hasData(e) && (a = ze.access(e),
                s = Se.extend({}, a),
                ze.set(t, s))
        }
    }
    function O(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && tt.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
    }
    function P(e, t, r, i) {
        t = fe(t);
        var o, a, s, u, l, c, f = 0, p = e.length, d = p - 1, h = t[0], g = be(h);
        if (g || p > 1 && "string" == typeof h && !xe.checkClone && ut.test(h)) {
            return e.each(function(n) {
                var o = e.eq(n);
                g && (t[0] = h.call(this, n, o.html())),
                    P(o, t, r, i)
            })
        }
        if (p && (o = C(t, e[0].ownerDocument, !1, e, i),
            a = o.firstChild,
        1 === o.childNodes.length && (o = a),
        a || i)) {
            for (s = Se.map(w(o, "script"), q),
                     u = s.length; p > f; f++) {
                l = o,
                f !== d && (l = Se.clone(l, !0, !0),
                u && Se.merge(s, w(l, "script"))),
                    r.call(e[f], l, f)
            }
            if (u) {
                for (c = s[s.length - 1].ownerDocument,
                         Se.map(s, L),
                         f = 0; u > f; f++) {
                    l = s[f],
                    rt.test(l.type || "") && !_e.access(l, "globalEval") && Se.contains(c, l) && (l.src && "module" !== (l.type || "").toLowerCase() ? Se._evalUrl && !l.noModule && Se._evalUrl(l.src, {
                        nonce: l.nonce || l.getAttribute("nonce")
                    }, c) : n(l.textContent.replace(lt, ""), l, c))
                }
            }
        }
        return e
    }
    function R(e, t, n) {
        for (var r, i = t ? Se.filter(t, e) : e, o = 0; null != (r = i[o]); o++) {
            n || 1 !== r.nodeType || Se.cleanData(w(r)),
            r.parentNode && (n && Je(r) && T(w(r, "script")),
                r.parentNode.removeChild(r))
        }
        return e
    }
    function M(e, t, n) {
        var r, i, o, a, s = e.style;
        return n = n || ft(e),
        n && (a = n.getPropertyValue(t) || n[t],
        "" !== a || Je(e) || (a = Se.style(e, t)),
        !xe.pixelBoxStyles() && ct.test(a) && dt.test(t) && (r = s.width,
            i = s.minWidth,
            o = s.maxWidth,
            s.minWidth = s.maxWidth = s.width = a,
            a = n.width,
            s.width = r,
            s.minWidth = i,
            s.maxWidth = o)),
            void 0 !== a ? a + "" : a
    }
    function I(e, t) {
        return {
            get: function() {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }
    function W(e) {
        for (var t = e[0].toUpperCase() + e.slice(1), n = ht.length; n--; ) {
            if (e = ht[n] + t,
            e in gt) {
                return e
            }
        }
    }
    function F(e) {
        var t = Se.cssProps[e] || mt[e];
        return t ? t : e in gt ? e : mt[e] = W(e) || e
    }
    function B(e, t, n) {
        var r = Ge.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function _(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0
            , s = 0
            , u = 0;
        if (n === (r ? "border" : "content")) {
            return 0
        }
        for (; 4 > a; a += 2) {
            "margin" === n && (u += Se.css(e, n + Ye[a], !0, i)),
                r ? ("content" === n && (u -= Se.css(e, "padding" + Ye[a], !0, i)),
                "margin" !== n && (u -= Se.css(e, "border" + Ye[a] + "Width", !0, i))) : (u += Se.css(e, "padding" + Ye[a], !0, i),
                    "padding" !== n ? u += Se.css(e, "border" + Ye[a] + "Width", !0, i) : s += Se.css(e, "border" + Ye[a] + "Width", !0, i))
        }
        return !r && o >= 0 && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - 0.5)) || 0),
            u
    }
    function z(e, t, n) {
        var r = ft(e)
            , i = !xe.boxSizingReliable() || n
            , a = i && "border-box" === Se.css(e, "boxSizing", !1, r)
            , s = a
            , u = M(e, t, r)
            , l = "offset" + t[0].toUpperCase() + t.slice(1);
        if (ct.test(u)) {
            if (!n) {
                return u
            }
            u = "auto"
        }
        return (!xe.boxSizingReliable() && a || !xe.reliableTrDimensions() && o(e, "tr") || "auto" === u || !parseFloat(u) && "inline" === Se.css(e, "display", !1, r)) && e.getClientRects().length && (a = "border-box" === Se.css(e, "boxSizing", !1, r),
            s = l in e,
        s && (u = e[l])),
            u = parseFloat(u) || 0,
        u + _(e, t, n || (a ? "border" : "content"), s, r, u) + "px"
    }
    function U(e, t, n, r, i) {
        return new U.prototype.init(e,t,n,r,i)
    }
    function X() {
        Tt && (Te.hidden === !1 && e.requestAnimationFrame ? e.requestAnimationFrame(X) : e.setTimeout(X, Se.fx.interval),
            Se.fx.tick())
    }
    function V() {
        return e.setTimeout(function() {
            wt = void 0
        }),
            wt = Date.now()
    }
    function G(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; 4 > r; r += 2 - t) {
            n = Ye[r],
                i["margin" + n] = i["padding" + n] = e
        }
        return t && (i.opacity = i.width = e),
            i
    }
    function Y(e, t, n) {
        for (var r, i = (K.tweeners[t] || []).concat(K.tweeners["*"]), o = 0, a = i.length; a > o; o++) {
            if (r = i[o].call(n, t, e)) {
                return r
            }
        }
    }
    function Q(e, t, n) {
        var r, i, o, a, s, u, l, c, f = "width"in t || "height"in t, p = this, d = {}, h = e.style, g = e.nodeType && Ze(e), m = _e.get(e, "fxshow");
        n.queue || (a = Se._queueHooks(e, "fx"),
        null == a.unqueued && (a.unqueued = 0,
                s = a.empty.fire,
                a.empty.fire = function() {
                    a.unqueued || s()
                }
        ),
            a.unqueued++,
            p.always(function() {
                p.always(function() {
                    a.unqueued--,
                    Se.queue(e, "fx").length || a.empty.fire()
                })
            }));
        for (r in t) {
            if (i = t[r],
                Ct.test(i)) {
                if (delete t[r],
                    o = o || "toggle" === i,
                i === (g ? "hide" : "show")) {
                    if ("show" !== i || !m || void 0 === m[r]) {
                        continue
                    }
                    g = !0
                }
                d[r] = m && m[r] || Se.style(e, r)
            }
        }
        if (u = !Se.isEmptyObject(t),
        u || !Se.isEmptyObject(d)) {
            f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY],
                l = m && m.display,
            null == l && (l = _e.get(e, "display")),
                c = Se.css(e, "display"),
            "none" === c && (l ? c = l : (b([e], !0),
                l = e.style.display || l,
                c = Se.css(e, "display"),
                b([e]))),
            ("inline" === c || "inline-block" === c && null != l) && "none" === Se.css(e, "float") && (u || (p.done(function() {
                h.display = l
            }),
            null == l && (c = h.display,
                l = "none" === c ? "" : c)),
                h.display = "inline-block")),
            n.overflow && (h.overflow = "hidden",
                p.always(function() {
                    h.overflow = n.overflow[0],
                        h.overflowX = n.overflow[1],
                        h.overflowY = n.overflow[2]
                })),
                u = !1;
            for (r in d) {
                u || (m ? "hidden"in m && (g = m.hidden) : m = _e.access(e, "fxshow", {
                    display: l
                }),
                o && (m.hidden = !g),
                g && b([e], !0),
                    p.done(function() {
                        g || b([e]),
                            _e.remove(e, "fxshow");
                        for (r in d) {
                            Se.style(e, r, d[r])
                        }
                    })),
                    u = Y(g ? m[r] : 0, r, p),
                r in m || (m[r] = u.start,
                g && (u.end = u.start,
                    u.start = 0))
            }
        }
    }
    function J(e, t) {
        var n, r, i, o, a;
        for (n in e) {
            if (r = h(n),
                i = t[r],
                o = e[n],
            Array.isArray(o) && (i = o[1],
                o = e[n] = o[0]),
            n !== r && (e[r] = o,
                delete e[n]),
                a = Se.cssHooks[r],
            a && "expand"in a) {
                o = a.expand(o),
                    delete e[r];
                for (n in o) {
                    n in e || (e[n] = o[n],
                        t[n] = i)
                }
            } else {
                t[r] = i
            }
        }
    }
    function K(e, t, n) {
        var r, i, o = 0, a = K.prefilters.length, s = Se.Deferred().always(function() {
            delete u.elem
        }), u = function() {
            if (i) {
                return !1
            }
            for (var t = wt || V(), n = Math.max(0, l.startTime + l.duration - t), r = n / l.duration || 0, o = 1 - r, a = 0, u = l.tweens.length; u > a; a++) {
                l.tweens[a].run(o)
            }
            return s.notifyWith(e, [l, o, n]),
                1 > o && u ? n : (u || s.notifyWith(e, [l, 1, 0]),
                    s.resolveWith(e, [l]),
                    !1)
        }, l = s.promise({
            elem: e,
            props: Se.extend({}, t),
            opts: Se.extend(!0, {
                specialEasing: {},
                easing: Se.easing._default
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: wt || V(),
            duration: n.duration,
            tweens: [],
            createTween: function(t, n) {
                var r = Se.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                return l.tweens.push(r),
                    r
            },
            stop: function(t) {
                var n = 0
                    , r = t ? l.tweens.length : 0;
                if (i) {
                    return this
                }
                for (i = !0; r > n; n++) {
                    l.tweens[n].run(1)
                }
                return t ? (s.notifyWith(e, [l, 1, 0]),
                    s.resolveWith(e, [l, t])) : s.rejectWith(e, [l, t]),
                    this
            }
        }), c = l.props;
        for (J(c, l.opts.specialEasing); a > o; o++) {
            if (r = K.prefilters[o].call(l, e, c, l.opts)) {
                return be(r.stop) && (Se._queueHooks(l.elem, l.opts.queue).stop = r.stop.bind(r)),
                    r
            }
        }
        return Se.map(c, Y, l),
        be(l.opts.start) && l.opts.start.call(e, l),
            l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always),
            Se.fx.timer(Se.extend(u, {
                elem: e,
                anim: l,
                queue: l.opts.queue
            })),
            l
    }
    function Z(e) {
        var t = e.match(Re) || [];
        return t.join(" ")
    }
    function ee(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function te(e) {
        return Array.isArray(e) ? e : "string" == typeof e ? e.match(Re) || [] : []
    }
    function ne(e, t, n, i) {
        var o;
        if (Array.isArray(t)) {
            Se.each(t, function(t, r) {
                n || Pt.test(e) ? i(e, r) : ne(e + "[" + ("object" == typeof r && null != r ? t : "") + "]", r, n, i)
            })
        } else {
            if (n || "object" !== r(t)) {
                i(e, t)
            } else {
                for (o in t) {
                    ne(e + "[" + o + "]", t[o], n, i)
                }
            }
        }
    }
    function re(e) {
        return function(t, n) {
            "string" != typeof t && (n = t,
                t = "*");
            var r, i = 0, o = t.toLowerCase().match(Re) || [];
            if (be(n)) {
                for (; r = o[i++]; ) {
                    "+" === r[0] ? (r = r.slice(1) || "*",
                        (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
                }
            }
        }
    }
    function ie(e, t, n, r) {
        function i(s) {
            var u;
            return o[s] = !0,
                Se.each(e[s] || [], function(e, s) {
                    var l = s(t, n, r);
                    return "string" != typeof l || a || o[l] ? a ? !(u = l) : void 0 : (t.dataTypes.unshift(l),
                        i(l),
                        !1)
                }),
                u
        }
        var o = {}
            , a = e === Vt;
        return i(t.dataTypes[0]) || !o["*"] && i("*")
    }
    function oe(e, t) {
        var n, r, i = Se.ajaxSettings.flatOptions || {};
        for (n in t) {
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n])
        }
        return r && Se.extend(!0, e, r),
            e
    }
    function ae(e, t, n) {
        for (var r, i, o, a, s = e.contents, u = e.dataTypes; "*" === u[0]; ) {
            u.shift(),
            void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"))
        }
        if (r) {
            for (i in s) {
                if (s[i] && s[i].test(r)) {
                    u.unshift(i);
                    break
                }
            }
        }
        if (u[0]in n) {
            o = u[0]
        } else {
            for (i in n) {
                if (!u[0] || e.converters[i + " " + u[0]]) {
                    o = i;
                    break
                }
                a || (a = i)
            }
            o = o || a
        }
        return o ? (o !== u[0] && u.unshift(o),
            n[o]) : void 0
    }
    function se(e, t, n, r) {
        var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
        if (c[1]) {
            for (a in e.converters) {
                l[a.toLowerCase()] = e.converters[a]
            }
        }
        for (o = c.shift(); o; ) {
            if (e.responseFields[o] && (n[e.responseFields[o]] = t),
            !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                u = o,
                o = c.shift()) {
                if ("*" === o) {
                    o = u
                } else {
                    if ("*" !== u && u !== o) {
                        if (a = l[u + " " + o] || l["* " + o],
                            !a) {
                            for (i in l) {
                                if (s = i.split(" "),
                                s[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                                    a === !0 ? a = l[i] : l[i] !== !0 && (o = s[0],
                                        c.unshift(s[1]));
                                    break
                                }
                            }
                        }
                        if (a !== !0) {
                            if (a && e["throws"]) {
                                t = a(t)
                            } else {
                                try {
                                    t = a(t)
                                } catch (f) {
                                    return {
                                        state: "parsererror",
                                        error: a ? f : "No conversion from " + u + " to " + o
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            state: "success",
            data: t
        }
    }
    var ue = []
        , le = Object.getPrototypeOf
        , ce = ue.slice
        , fe = ue.flat ? function(e) {
            return ue.flat.call(e)
        }
        : function(e) {
            return ue.concat.apply([], e)
        }
        , pe = ue.push
        , de = ue.indexOf
        , he = {}
        , ge = he.toString
        , me = he.hasOwnProperty
        , ve = me.toString
        , ye = ve.call(Object)
        , xe = {}
        , be = function(e) {
        return "function" == typeof e && "number" != typeof e.nodeType && "function" != typeof e.item
    }
        , we = function(e) {
        return null != e && e === e.window
    }
        , Te = e.document
        , Ce = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    }
        , Ee = "3.6.0"
        , Se = function(e, t) {
        return new Se.fn.init(e,t)
    };
    Se.fn = Se.prototype = {
        jquery: Ee,
        constructor: Se,
        length: 0,
        toArray: function() {
            return ce.call(this)
        },
        get: function(e) {
            return null == e ? ce.call(this) : 0 > e ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = Se.merge(this.constructor(), e);
            return t.prevObject = this,
                t
        },
        each: function(e) {
            return Se.each(this, e)
        },
        map: function(e) {
            return this.pushStack(Se.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(ce.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(Se.grep(this, function(e, t) {
                return (t + 1) % 2
            }))
        },
        odd: function() {
            return this.pushStack(Se.grep(this, function(e, t) {
                return t % 2
            }))
        },
        eq: function(e) {
            var t = this.length
                , n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: pe,
        sort: ue.sort,
        splice: ue.splice
    },
        Se.extend = Se.fn.extend = function() {
            var e, t, n, r, i, o, a = arguments[0] || {}, s = 1, u = arguments.length, l = !1;
            for ("boolean" == typeof a && (l = a,
                a = arguments[s] || {},
                s++),
                 "object" == typeof a || be(a) || (a = {}),
                 s === u && (a = this,
                     s--); u > s; s++) {
                if (null != (e = arguments[s])) {
                    for (t in e) {
                        r = e[t],
                        "__proto__" !== t && a !== r && (l && r && (Se.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t],
                            o = i && !Array.isArray(n) ? [] : i || Se.isPlainObject(n) ? n : {},
                            i = !1,
                            a[t] = Se.extend(l, o, r)) : void 0 !== r && (a[t] = r))
                    }
                }
            }
            return a
        }
        ,
        Se.extend({
            expando: "jQuery" + (Ee + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw Error(e)
            },
            noop: function() {},
            isPlainObject: function(e) {
                var t, n;
                return e && "[object Object]" === ge.call(e) ? (t = le(e)) ? (n = me.call(t, "constructor") && t.constructor,
                "function" == typeof n && ve.call(n) === ye) : !0 : !1
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) {
                    return !1
                }
                return !0
            },
            globalEval: function(e, t, r) {
                n(e, {
                    nonce: t && t.nonce
                }, r)
            },
            each: function(e, t) {
                var n, r = 0;
                if (i(e)) {
                    for (n = e.length; n > r && t.call(e[r], r, e[r]) !== !1; r++) {}
                } else {
                    for (r in e) {
                        if (t.call(e[r], r, e[r]) === !1) {
                            break
                        }
                    }
                }
                return e
            },
            makeArray: function(e, t) {
                var n = t || [];
                return null != e && (i(Object(e)) ? Se.merge(n, "string" == typeof e ? [e] : e) : pe.call(n, e)),
                    n
            },
            inArray: function(e, t, n) {
                return null == t ? -1 : de.call(t, e, n)
            },
            merge: function(e, t) {
                for (var n = +t.length, r = 0, i = e.length; n > r; r++) {
                    e[i++] = t[r]
                }
                return e.length = i,
                    e
            },
            grep: function(e, t, n) {
                for (var r, i = [], o = 0, a = e.length, s = !n; a > o; o++) {
                    r = !t(e[o], o),
                    r !== s && i.push(e[o])
                }
                return i
            },
            map: function(e, t, n) {
                var r, o, a = 0, s = [];
                if (i(e)) {
                    for (r = e.length; r > a; a++) {
                        o = t(e[a], a, n),
                        null != o && s.push(o)
                    }
                } else {
                    for (a in e) {
                        o = t(e[a], a, n),
                        null != o && s.push(o)
                    }
                }
                return fe(s)
            },
            guid: 1,
            support: xe
        }),
    "function" == typeof Symbol && (Se.fn[Symbol.iterator] = ue[Symbol.iterator]),
        Se.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
            he["[object " + t + "]"] = t.toLowerCase()
        });
    var ke = function(e) {
        function t(e, t, n, r) {
            var i, o, a, s, u, l, c, p = t && t.ownerDocument, h = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h) {
                return n
            }
            if (!r && (L(t),
                t = t || H,
                P)) {
                if (11 !== h && (u = xe.exec(e))) {
                    if (i = u[1]) {
                        if (9 === h) {
                            if (!(a = t.getElementById(i))) {
                                return n
                            }
                            if (a.id === i) {
                                return n.push(a),
                                    n
                            }
                        } else {
                            if (p && (a = p.getElementById(i)) && W(t, a) && a.id === i) {
                                return n.push(a),
                                    n
                            }
                        }
                    } else {
                        if (u[2]) {
                            return Z.apply(n, t.getElementsByTagName(e)),
                                n
                        }
                        if ((i = u[3]) && T.getElementsByClassName && t.getElementsByClassName) {
                            return Z.apply(n, t.getElementsByClassName(i)),
                                n
                        }
                    }
                }
                if (T.qsa && !V[e + " "] && (!R || !R.test(e)) && (1 !== h || "object" !== t.nodeName.toLowerCase())) {
                    if (c = e,
                        p = t,
                    1 === h && (fe.test(e) || ce.test(e))) {
                        for (p = be.test(e) && f(t.parentNode) || t,
                             p === t && T.scope || ((s = t.getAttribute("id")) ? s = s.replace(Ce, Ee) : t.setAttribute("id", s = F)),
                                 l = k(e),
                                 o = l.length; o--; ) {
                            l[o] = (s ? "#" + s : ":scope") + " " + d(l[o])
                        }
                        c = l.join(",")
                    }
                    try {
                        return Z.apply(n, p.querySelectorAll(c)),
                            n
                    } catch (g) {
                        V(e, !0)
                    } finally {
                        s === F && t.removeAttribute("id")
                    }
                }
            }
            return N(e.replace(ue, "$1"), t, n, r)
        }
        function n() {
            function e(n, r) {
                return t.push(n + " ") > C.cacheLength && delete e[t.shift()],
                    e[n + " "] = r
            }
            var t = [];
            return e
        }
        function r(e) {
            return e[F] = !0,
                e
        }
        function i(e) {
            var t = H.createElement("fieldset");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                    t = null
            }
        }
        function o(e, t) {
            for (var n = e.split("|"), r = n.length; r--; ) {
                C.attrHandle[n[r]] = t
            }
        }
        function a(e, t) {
            var n = t && e
                , r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r) {
                return r
            }
            if (n) {
                for (; n = n.nextSibling; ) {
                    if (n === t) {
                        return -1
                    }
                }
            }
            return e ? 1 : -1
        }
        function s(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }
        function u(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }
        function l(e) {
            return function(t) {
                return "form"in t ? t.parentNode && t.disabled === !1 ? "label"in t ? "label"in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && ke(t) === e : t.disabled === e : "label"in t ? t.disabled === e : !1
            }
        }
        function c(e) {
            return r(function(t) {
                return t = +t,
                    r(function(n, r) {
                        for (var i, o = e([], n.length, t), a = o.length; a--; ) {
                            n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                        }
                    })
            })
        }
        function f(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        function p() {}
        function d(e) {
            for (var t = 0, n = e.length, r = ""; n > t; t++) {
                r += e[t].value
            }
            return r
        }
        function h(e, t, n) {
            var r = t.dir
                , i = t.next
                , o = i || r
                , a = n && "parentNode" === o
                , s = _++;
            return t.first ? function(t, n, i) {
                    for (; t = t[r]; ) {
                        if (1 === t.nodeType || a) {
                            return e(t, n, i)
                        }
                    }
                    return !1
                }
                : function(t, n, u) {
                    var l, c, f, p = [B, s];
                    if (u) {
                        for (; t = t[r]; ) {
                            if ((1 === t.nodeType || a) && e(t, n, u)) {
                                return !0
                            }
                        }
                    } else {
                        for (; t = t[r]; ) {
                            if (1 === t.nodeType || a) {
                                if (f = t[F] || (t[F] = {}),
                                    c = f[t.uniqueID] || (f[t.uniqueID] = {}),
                                i && i === t.nodeName.toLowerCase()) {
                                    t = t[r] || t
                                } else {
                                    if ((l = c[o]) && l[0] === B && l[1] === s) {
                                        return p[2] = l[2]
                                    }
                                    if (c[o] = p,
                                        p[2] = e(t, n, u)) {
                                        return !0
                                    }
                                }
                            }
                        }
                    }
                    return !1
                }
        }
        function g(e) {
            return e.length > 1 ? function(t, n, r) {
                    for (var i = e.length; i--; ) {
                        if (!e[i](t, n, r)) {
                            return !1
                        }
                    }
                    return !0
                }
                : e[0]
        }
        function m(e, n, r) {
            for (var i = 0, o = n.length; o > i; i++) {
                t(e, n[i], r)
            }
            return r
        }
        function v(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; u > s; s++) {
                (o = e[s]) && (!n || n(o, r, i)) && (a.push(o),
                l && t.push(s))
            }
            return a
        }
        function y(e, t, n, i, o, a) {
            return i && !i[F] && (i = y(i)),
            o && !o[F] && (o = y(o, a)),
                r(function(r, a, s, u) {
                    var l, c, f, p = [], d = [], h = a.length, g = r || m(t || "*", s.nodeType ? [s] : s, []), y = !e || !r && t ? g : v(g, p, e, s, u), x = n ? o || (r ? e : h || i) ? [] : a : y;
                    if (n && n(y, x, s, u),
                        i) {
                        for (l = v(x, d),
                                 i(l, [], s, u),
                                 c = l.length; c--; ) {
                            (f = l[c]) && (x[d[c]] = !(y[d[c]] = f))
                        }
                    }
                    if (r) {
                        if (o || e) {
                            if (o) {
                                for (l = [],
                                         c = x.length; c--; ) {
                                    (f = x[c]) && l.push(y[c] = f)
                                }
                                o(null, x = [], l, u)
                            }
                            for (c = x.length; c--; ) {
                                (f = x[c]) && (l = o ? te(r, f) : p[c]) > -1 && (r[l] = !(a[l] = f))
                            }
                        }
                    } else {
                        x = v(x === a ? x.splice(h, x.length) : x),
                            o ? o(null, a, x, u) : Z.apply(a, x)
                    }
                })
        }
        function x(e) {
            for (var t, n, r, i = e.length, o = C.relative[e[0].type], a = o || C.relative[" "], s = o ? 1 : 0, u = h(function(e) {
                return e === t
            }, a, !0), l = h(function(e) {
                return te(t, e) > -1
            }, a, !0), c = [function(e, n, r) {
                var i = !o && (r || n !== j) || ((t = n).nodeType ? u(e, n, r) : l(e, n, r));
                return t = null,
                    i
            }
            ]; i > s; s++) {
                if (n = C.relative[e[s].type]) {
                    c = [h(g(c), n)]
                } else {
                    if (n = C.filter[e[s].type].apply(null, e[s].matches),
                        n[F]) {
                        for (r = ++s; i > r && !C.relative[e[r].type]; r++) {}
                        return y(s > 1 && g(c), s > 1 && d(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(ue, "$1"), n, r > s && x(e.slice(s, r)), i > r && x(e = e.slice(r)), i > r && d(e))
                    }
                    c.push(n)
                }
            }
            return g(c)
        }
        function b(e, n) {
            var i = n.length > 0
                , o = e.length > 0
                , a = function(r, a, s, u, l) {
                var c, f, p, d = 0, h = "0", g = r && [], m = [], y = j, x = r || o && C.find.TAG("*", l), b = B += null == y ? 1 : Math.random() || 0.1, w = x.length;
                for (l && (j = a == H || a || l); h !== w && null != (c = x[h]); h++) {
                    if (o && c) {
                        for (f = 0,
                             a || c.ownerDocument == H || (L(c),
                                 s = !P); p = e[f++]; ) {
                            if (p(c, a || H, s)) {
                                u.push(c);
                                break
                            }
                        }
                        l && (B = b)
                    }
                    i && ((c = !p && c) && d--,
                    r && g.push(c))
                }
                if (d += h,
                i && h !== d) {
                    for (f = 0; p = n[f++]; ) {
                        p(g, m, a, s)
                    }
                    if (r) {
                        if (d > 0) {
                            for (; h--; ) {
                                g[h] || m[h] || (m[h] = J.call(u))
                            }
                        }
                        m = v(m)
                    }
                    Z.apply(u, m),
                    l && !r && m.length > 0 && d + n.length > 1 && t.uniqueSort(u)
                }
                return l && (B = b,
                    j = y),
                    g
            };
            return i ? r(a) : a
        }
        var w, T, C, E, S, k, A, N, j, D, q, L, H, O, P, R, M, I, W, F = "sizzle" + 1 * new Date, $ = e.document, B = 0, _ = 0, z = n(), U = n(), X = n(), V = n(), G = function(e, t) {
            return e === t && (q = !0),
                0
        }, Y = {}.hasOwnProperty, Q = [], J = Q.pop, K = Q.push, Z = Q.push, ee = Q.slice, te = function(e, t) {
            for (var n = 0, r = e.length; r > n; n++) {
                if (e[n] === t) {
                    return n
                }
            }
            return -1
        }, ne = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", re = "[\\x20\\t\\r\\n\\f]", ie = "(?:\\\\[\\da-fA-F]{1,6}" + re + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\x00-\\x7f])+", oe = "\\[" + re + "*(" + ie + ")(?:" + re + "*([*^$|!~]?=)" + re + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ie + "))|)" + re + "*\\]", ae = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)", se = RegExp(re + "+", "g"), ue = RegExp("^" + re + "+|((?:^|[^\\\\])(?:\\\\.)*)" + re + "+$", "g"), le = RegExp("^" + re + "*," + re + "*"), ce = RegExp("^" + re + "*([>+~]|" + re + ")" + re + "*"), fe = RegExp(re + "|>"), pe = RegExp(ae), de = RegExp("^" + ie + "$"), he = {
            ID: RegExp("^#(" + ie + ")"),
            CLASS: RegExp("^\\.(" + ie + ")"),
            TAG: RegExp("^(" + ie + "|[*])"),
            ATTR: RegExp("^" + oe),
            PSEUDO: RegExp("^" + ae),
            CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + re + "*(even|odd|(([+-]|)(\\d*)n|)" + re + "*(?:([+-]|)" + re + "*(\\d+)|))" + re + "*\\)|)", "i"),
            bool: RegExp("^(?:" + ne + ")$", "i"),
            needsContext: RegExp("^" + re + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + re + "*((?:-\\d)?\\d*)" + re + "*\\)|)(?=[^-]|$)", "i")
        }, ge = /HTML$/i, me = /^(?:input|select|textarea|button)$/i, ve = /^h\d$/i, ye = /^[^{]+\{\s*\[native \w/, xe = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, be = /[+~]/, we = RegExp("\\\\[\\da-fA-F]{1,6}" + re + "?|\\\\([^\\r\\n\\f])", "g"), Te = function(e, t) {
            var n = "0x" + e.slice(1) - 65536;
            return t ? t : 0 > n ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320)
        }, Ce = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, Ee = function(e, t) {
            return t ? "\x00" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }, Se = function() {
            L()
        }, ke = h(function(e) {
            return e.disabled === !0 && "fieldset" === e.nodeName.toLowerCase()
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            Z.apply(Q = ee.call($.childNodes), $.childNodes),
                Q[$.childNodes.length].nodeType
        } catch (Ae) {
            Z = {
                apply: Q.length ? function(e, t) {
                        K.apply(e, ee.call(t))
                    }
                    : function(e, t) {
                        for (var n = e.length, r = 0; e[n++] = t[r++]; ) {}
                        e.length = n - 1
                    }
            }
        }
        T = t.support = {},
            S = t.isXML = function(e) {
                var t = e && e.namespaceURI
                    , n = e && (e.ownerDocument || e).documentElement;
                return !ge.test(t || n && n.nodeName || "HTML")
            }
            ,
            L = t.setDocument = function(e) {
                var t, n, r = e ? e.ownerDocument || e : $;
                return r != H && 9 === r.nodeType && r.documentElement ? (H = r,
                    O = H.documentElement,
                    P = !S(H),
                $ != H && (n = H.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Se, !1) : n.attachEvent && n.attachEvent("onunload", Se)),
                    T.scope = i(function(e) {
                        return O.appendChild(e).appendChild(H.createElement("div")),
                        void 0 !== e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
                    }),
                    T.attributes = i(function(e) {
                        return e.className = "i",
                            !e.getAttribute("className")
                    }),
                    T.getElementsByTagName = i(function(e) {
                        return e.appendChild(H.createComment("")),
                            !e.getElementsByTagName("*").length
                    }),
                    T.getElementsByClassName = ye.test(H.getElementsByClassName),
                    T.getById = i(function(e) {
                        return O.appendChild(e).id = F,
                        !H.getElementsByName || !H.getElementsByName(F).length
                    }),
                    T.getById ? (C.filter.ID = function(e) {
                            var t = e.replace(we, Te);
                            return function(e) {
                                return e.getAttribute("id") === t
                            }
                        }
                            ,
                            C.find.ID = function(e, t) {
                                if (void 0 !== t.getElementById && P) {
                                    var n = t.getElementById(e);
                                    return n ? [n] : []
                                }
                            }
                    ) : (C.filter.ID = function(e) {
                            var t = e.replace(we, Te);
                            return function(e) {
                                var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                                return n && n.value === t
                            }
                        }
                            ,
                            C.find.ID = function(e, t) {
                                if (void 0 !== t.getElementById && P) {
                                    var n, r, i, o = t.getElementById(e);
                                    if (o) {
                                        if (n = o.getAttributeNode("id"),
                                        n && n.value === e) {
                                            return [o]
                                        }
                                        for (i = t.getElementsByName(e),
                                                 r = 0; o = i[r++]; ) {
                                            if (n = o.getAttributeNode("id"),
                                            n && n.value === e) {
                                                return [o]
                                            }
                                        }
                                    }
                                    return []
                                }
                            }
                    ),
                    C.find.TAG = T.getElementsByTagName ? function(e, t) {
                            return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : T.qsa ? t.querySelectorAll(e) : void 0
                        }
                        : function(e, t) {
                            var n, r = [], i = 0, o = t.getElementsByTagName(e);
                            if ("*" === e) {
                                for (; n = o[i++]; ) {
                                    1 === n.nodeType && r.push(n)
                                }
                                return r
                            }
                            return o
                        }
                    ,
                    C.find.CLASS = T.getElementsByClassName && function(e, t) {
                        return void 0 !== t.getElementsByClassName && P ? t.getElementsByClassName(e) : void 0
                    }
                    ,
                    M = [],
                    R = [],
                (T.qsa = ye.test(H.querySelectorAll)) && (i(function(e) {
                    var t;
                    O.appendChild(e).innerHTML = "<a id='" + F + "'></a><select id='" + F + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                    e.querySelectorAll("[msallowcapture^='']").length && R.push("[*^$]=" + re + "*(?:''|\"\")"),
                    e.querySelectorAll("[selected]").length || R.push("\\[" + re + "*(?:value|" + ne + ")"),
                    e.querySelectorAll("[id~=" + F + "-]").length || R.push("~="),
                        t = H.createElement("input"),
                        t.setAttribute("name", ""),
                        e.appendChild(t),
                    e.querySelectorAll("[name='']").length || R.push("\\[" + re + "*name" + re + "*=" + re + "*(?:''|\"\")"),
                    e.querySelectorAll(":checked").length || R.push(":checked"),
                    e.querySelectorAll("a#" + F + "+*").length || R.push(".#.+[+~]"),
                        e.querySelectorAll("\\\f"),
                        R.push("[\\r\\n\\f]")
                }),
                    i(function(e) {
                        e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                        var t = H.createElement("input");
                        t.setAttribute("type", "hidden"),
                            e.appendChild(t).setAttribute("name", "D"),
                        e.querySelectorAll("[name=d]").length && R.push("name" + re + "*[*^$|!~]?="),
                        2 !== e.querySelectorAll(":enabled").length && R.push(":enabled", ":disabled"),
                            O.appendChild(e).disabled = !0,
                        2 !== e.querySelectorAll(":disabled").length && R.push(":enabled", ":disabled"),
                            e.querySelectorAll("*,:x"),
                            R.push(",.*:")
                    })),
                (T.matchesSelector = ye.test(I = O.matches || O.webkitMatchesSelector || O.mozMatchesSelector || O.oMatchesSelector || O.msMatchesSelector)) && i(function(e) {
                    T.disconnectedMatch = I.call(e, "*"),
                        I.call(e, "[s!='']:x"),
                        M.push("!=", ae)
                }),
                    R = R.length && RegExp(R.join("|")),
                    M = M.length && RegExp(M.join("|")),
                    t = ye.test(O.compareDocumentPosition),
                    W = t || ye.test(O.contains) ? function(e, t) {
                            var n = 9 === e.nodeType ? e.documentElement : e
                                , r = t && t.parentNode;
                            return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                        }
                        : function(e, t) {
                            if (t) {
                                for (; t = t.parentNode; ) {
                                    if (t === e) {
                                        return !0
                                    }
                                }
                            }
                            return !1
                        }
                    ,
                    G = t ? function(e, t) {
                            if (e === t) {
                                return q = !0,
                                    0
                            }
                            var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                            return n ? n : (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1,
                                1 & n || !T.sortDetached && t.compareDocumentPosition(e) === n ? e == H || e.ownerDocument == $ && W($, e) ? -1 : t == H || t.ownerDocument == $ && W($, t) ? 1 : D ? te(D, e) - te(D, t) : 0 : 4 & n ? -1 : 1)
                        }
                        : function(e, t) {
                            if (e === t) {
                                return q = !0,
                                    0
                            }
                            var n, r = 0, i = e.parentNode, o = t.parentNode, s = [e], u = [t];
                            if (!i || !o) {
                                return e == H ? -1 : t == H ? 1 : i ? -1 : o ? 1 : D ? te(D, e) - te(D, t) : 0
                            }
                            if (i === o) {
                                return a(e, t)
                            }
                            for (n = e; n = n.parentNode; ) {
                                s.unshift(n)
                            }
                            for (n = t; n = n.parentNode; ) {
                                u.unshift(n)
                            }
                            for (; s[r] === u[r]; ) {
                                r++
                            }
                            return r ? a(s[r], u[r]) : s[r] == $ ? -1 : u[r] == $ ? 1 : 0
                        }
                    ,
                    H) : H
            }
            ,
            t.matches = function(e, n) {
                return t(e, null, null, n)
            }
            ,
            t.matchesSelector = function(e, n) {
                if (L(e),
                T.matchesSelector && P && !V[n + " "] && (!M || !M.test(n)) && (!R || !R.test(n))) {
                    try {
                        var r = I.call(e, n);
                        if (r || T.disconnectedMatch || e.document && 11 !== e.document.nodeType) {
                            return r
                        }
                    } catch (i) {
                        V(n, !0)
                    }
                }
                return t(n, H, null, [e]).length > 0
            }
            ,
            t.contains = function(e, t) {
                return (e.ownerDocument || e) != H && L(e),
                    W(e, t)
            }
            ,
            t.attr = function(e, t) {
                (e.ownerDocument || e) != H && L(e);
                var n = C.attrHandle[t.toLowerCase()]
                    , r = n && Y.call(C.attrHandle, t.toLowerCase()) ? n(e, t, !P) : void 0;
                return void 0 !== r ? r : T.attributes || !P ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
            }
            ,
            t.escape = function(e) {
                return (e + "").replace(Ce, Ee)
            }
            ,
            t.error = function(e) {
                throw Error("Syntax error, unrecognized expression: " + e)
            }
            ,
            t.uniqueSort = function(e) {
                var t, n = [], r = 0, i = 0;
                if (q = !T.detectDuplicates,
                    D = !T.sortStable && e.slice(0),
                    e.sort(G),
                    q) {
                    for (; t = e[i++]; ) {
                        t === e[i] && (r = n.push(i))
                    }
                    for (; r--; ) {
                        e.splice(n[r], 1)
                    }
                }
                return D = null,
                    e
            }
            ,
            E = t.getText = function(e) {
                var t, n = "", r = 0, i = e.nodeType;
                if (i) {
                    if (1 === i || 9 === i || 11 === i) {
                        if ("string" == typeof e.textContent) {
                            return e.textContent
                        }
                        for (e = e.firstChild; e; e = e.nextSibling) {
                            n += E(e)
                        }
                    } else {
                        if (3 === i || 4 === i) {
                            return e.nodeValue
                        }
                    }
                } else {
                    for (; t = e[r++]; ) {
                        n += E(t)
                    }
                }
                return n
            }
            ,
            C = t.selectors = {
                cacheLength: 50,
                createPseudo: r,
                match: he,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(we, Te),
                            e[3] = (e[3] || e[4] || e[5] || "").replace(we, Te),
                        "~=" === e[2] && (e[3] = " " + e[3] + " "),
                            e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(),
                            "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                                e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                                e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                            e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pe.test(n) && (t = k(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                            e[2] = n.slice(0, t)),
                            e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(we, Te).toLowerCase();
                        return "*" === e ? function() {
                                return !0
                            }
                            : function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                    },
                    CLASS: function(e) {
                        var t = z[e + " "];
                        return t || (t = RegExp("(^|" + re + ")" + e + "(" + re + "|$)")) && z(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, n, r) {
                        return function(i) {
                            var o = t.attr(i, e);
                            return null == o ? "!=" === n : n ? (o += "",
                                "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(se, " ") + " ").indexOf(r) > -1 : "|=" === n ? o === r || o.slice(0, r.length + 1) === r + "-" : !1) : !0
                        }
                    },
                    CHILD: function(e, t, n, r, i) {
                        var o = "nth" !== e.slice(0, 3)
                            , a = "last" !== e.slice(-4)
                            , s = "of-type" === t;
                        return 1 === r && 0 === i ? function(e) {
                                return !!e.parentNode
                            }
                            : function(t, n, u) {
                                var l, c, f, p, d, h, g = o !== a ? "nextSibling" : "previousSibling", m = t.parentNode, v = s && t.nodeName.toLowerCase(), y = !u && !s, x = !1;
                                if (m) {
                                    if (o) {
                                        for (; g; ) {
                                            for (p = t; p = p[g]; ) {
                                                if (s ? p.nodeName.toLowerCase() === v : 1 === p.nodeType) {
                                                    return !1
                                                }
                                            }
                                            h = g = "only" === e && !h && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (h = [a ? m.firstChild : m.lastChild],
                                    a && y) {
                                        for (p = m,
                                                 f = p[F] || (p[F] = {}),
                                                 c = f[p.uniqueID] || (f[p.uniqueID] = {}),
                                                 l = c[e] || [],
                                                 d = l[0] === B && l[1],
                                                 x = d && l[2],
                                                 p = d && m.childNodes[d]; p = ++d && p && p[g] || (x = d = 0) || h.pop(); ) {
                                            if (1 === p.nodeType && ++x && p === t) {
                                                c[e] = [B, d, x];
                                                break
                                            }
                                        }
                                    } else {
                                        if (y && (p = t,
                                            f = p[F] || (p[F] = {}),
                                            c = f[p.uniqueID] || (f[p.uniqueID] = {}),
                                            l = c[e] || [],
                                            d = l[0] === B && l[1],
                                            x = d),
                                        x === !1) {
                                            for (; (p = ++d && p && p[g] || (x = d = 0) || h.pop()) && ((s ? p.nodeName.toLowerCase() !== v : 1 !== p.nodeType) || !++x || (y && (f = p[F] || (p[F] = {}),
                                                c = f[p.uniqueID] || (f[p.uniqueID] = {}),
                                                c[e] = [B, x]),
                                            p !== t)); ) {}
                                        }
                                    }
                                    return x -= i,
                                    x === r || x % r === 0 && x / r >= 0
                                }
                            }
                    },
                    PSEUDO: function(e, n) {
                        var i, o = C.pseudos[e] || C.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return o[F] ? o(n) : o.length > 1 ? (i = [e, e, "", n],
                                C.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                                    for (var r, i = o(e, n), a = i.length; a--; ) {
                                        r = te(e, i[a]),
                                            e[r] = !(t[r] = i[a])
                                    }
                                }) : function(e) {
                                    return o(e, 0, i)
                                }
                        ) : o
                    }
                },
                pseudos: {
                    not: r(function(e) {
                        var t = []
                            , n = []
                            , i = A(e.replace(ue, "$1"));
                        return i[F] ? r(function(e, t, n, r) {
                            for (var o, a = i(e, null, r, []), s = e.length; s--; ) {
                                (o = a[s]) && (e[s] = !(t[s] = o))
                            }
                        }) : function(e, r, o) {
                            return t[0] = e,
                                i(t, null, o, n),
                                t[0] = null,
                                !n.pop()
                        }
                    }),
                    has: r(function(e) {
                        return function(n) {
                            return t(e, n).length > 0
                        }
                    }),
                    contains: r(function(e) {
                        return e = e.replace(we, Te),
                            function(t) {
                                return (t.textContent || E(t)).indexOf(e) > -1
                            }
                    }),
                    lang: r(function(e) {
                        return de.test(e || "") || t.error("unsupported lang: " + e),
                            e = e.replace(we, Te).toLowerCase(),
                            function(t) {
                                var n;
                                do {
                                    if (n = P ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) {
                                        return n = n.toLowerCase(),
                                        n === e || 0 === n.indexOf(e + "-")
                                    }
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === O
                    },
                    focus: function(e) {
                        return e === H.activeElement && (!H.hasFocus || H.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: l(!1),
                    disabled: l(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex,
                        e.selected === !0
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling) {
                            if (e.nodeType < 6) {
                                return !1
                            }
                        }
                        return !0
                    },
                    parent: function(e) {
                        return !C.pseudos.empty(e)
                    },
                    header: function(e) {
                        return ve.test(e.nodeName)
                    },
                    input: function(e) {
                        return me.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: c(function() {
                        return [0]
                    }),
                    last: c(function(e, t) {
                        return [t - 1]
                    }),
                    eq: c(function(e, t, n) {
                        return [0 > n ? n + t : n]
                    }),
                    even: c(function(e, t) {
                        for (var n = 0; t > n; n += 2) {
                            e.push(n)
                        }
                        return e
                    }),
                    odd: c(function(e, t) {
                        for (var n = 1; t > n; n += 2) {
                            e.push(n)
                        }
                        return e
                    }),
                    lt: c(function(e, t, n) {
                        for (var r = 0 > n ? n + t : n > t ? t : n; --r >= 0; ) {
                            e.push(r)
                        }
                        return e
                    }),
                    gt: c(function(e, t, n) {
                        for (var r = 0 > n ? n + t : n; ++r < t; ) {
                            e.push(r)
                        }
                        return e
                    })
                }
            },
            C.pseudos.nth = C.pseudos.eq;
        for (w in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) {
            C.pseudos[w] = s(w)
        }
        for (w in {
            submit: !0,
            reset: !0
        }) {
            C.pseudos[w] = u(w)
        }
        return p.prototype = C.filters = C.pseudos,
            C.setFilters = new p,
            k = t.tokenize = function(e, n) {
                var r, i, o, a, s, u, l, c = U[e + " "];
                if (c) {
                    return n ? 0 : c.slice(0)
                }
                for (s = e,
                         u = [],
                         l = C.preFilter; s; ) {
                    (!r || (i = le.exec(s))) && (i && (s = s.slice(i[0].length) || s),
                        u.push(o = [])),
                        r = !1,
                    (i = ce.exec(s)) && (r = i.shift(),
                        o.push({
                            value: r,
                            type: i[0].replace(ue, " ")
                        }),
                        s = s.slice(r.length));
                    for (a in C.filter) {
                        !(i = he[a].exec(s)) || l[a] && !(i = l[a](i)) || (r = i.shift(),
                            o.push({
                                value: r,
                                type: a,
                                matches: i
                            }),
                            s = s.slice(r.length))
                    }
                    if (!r) {
                        break
                    }
                }
                return n ? s.length : s ? t.error(e) : U(e, u).slice(0)
            }
            ,
            A = t.compile = function(e, t) {
                var n, r = [], i = [], o = X[e + " "];
                if (!o) {
                    for (t || (t = k(e)),
                             n = t.length; n--; ) {
                        o = x(t[n]),
                            o[F] ? r.push(o) : i.push(o)
                    }
                    o = X(e, b(i, r)),
                        o.selector = e
                }
                return o
            }
            ,
            N = t.select = function(e, t, n, r) {
                var i, o, a, s, u, l = "function" == typeof e && e, c = !r && k(e = l.selector || e);
                if (n = n || [],
                1 === c.length) {
                    if (o = c[0] = c[0].slice(0),
                    o.length > 2 && "ID" === (a = o[0]).type && 9 === t.nodeType && P && C.relative[o[1].type]) {
                        if (t = (C.find.ID(a.matches[0].replace(we, Te), t) || [])[0],
                            !t) {
                            return n
                        }
                        l && (t = t.parentNode),
                            e = e.slice(o.shift().value.length)
                    }
                    for (i = he.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i],
                        !C.relative[s = a.type]); ) {
                        if ((u = C.find[s]) && (r = u(a.matches[0].replace(we, Te), be.test(o[0].type) && f(t.parentNode) || t))) {
                            if (o.splice(i, 1),
                                e = r.length && d(o),
                                !e) {
                                return Z.apply(n, r),
                                    n
                            }
                            break
                        }
                    }
                }
                return (l || A(e, c))(r, t, !P, n, !t || be.test(e) && f(t.parentNode) || t),
                    n
            }
            ,
            T.sortStable = F.split("").sort(G).join("") === F,
            T.detectDuplicates = !!q,
            L(),
            T.sortDetached = i(function(e) {
                return 1 & e.compareDocumentPosition(H.createElement("fieldset"))
            }),
        i(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        T.attributes && i(function(e) {
            return e.innerHTML = "<input/>",
                e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }),
        i(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(ne, function(e, t, n) {
            var r;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
            t
    }(e);
    Se.find = ke,
        Se.expr = ke.selectors,
        Se.expr[":"] = Se.expr.pseudos,
        Se.uniqueSort = Se.unique = ke.uniqueSort,
        Se.text = ke.getText,
        Se.isXMLDoc = ke.isXML,
        Se.contains = ke.contains,
        Se.escapeSelector = ke.escape;
    var Ae = function(e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; ) {
            if (1 === e.nodeType) {
                if (i && Se(e).is(n)) {
                    break
                }
                r.push(e)
            }
        }
        return r
    }
        , Ne = function(e, t) {
        for (var n = []; e; e = e.nextSibling) {
            1 === e.nodeType && e !== t && n.push(e)
        }
        return n
    }
        , je = Se.expr.match.needsContext
        , De = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    Se.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
            1 === t.length && 1 === r.nodeType ? Se.find.matchesSelector(r, e) ? [r] : [] : Se.find.matches(e, Se.grep(t, function(e) {
                return 1 === e.nodeType
            }))
    }
        ,
        Se.fn.extend({
            find: function(e) {
                var t, n, r = this.length, i = this;
                if ("string" != typeof e) {
                    return this.pushStack(Se(e).filter(function() {
                        for (t = 0; r > t; t++) {
                            if (Se.contains(i[t], this)) {
                                return !0
                            }
                        }
                    }))
                }
                for (n = this.pushStack([]),
                         t = 0; r > t; t++) {
                    Se.find(e, i[t], n)
                }
                return r > 1 ? Se.uniqueSort(n) : n
            },
            filter: function(e) {
                return this.pushStack(a(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(a(this, e || [], !0))
            },
            is: function(e) {
                return !!a(this, "string" == typeof e && je.test(e) ? Se(e) : e || [], !1).length
            }
        });
    var qe, Le = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, He = Se.fn.init = function(e, t, n) {
            var r, i;
            if (!e) {
                return this
            }
            if (n = n || qe,
            "string" == typeof e) {
                if (r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : Le.exec(e),
                !r || !r[1] && t) {
                    return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e)
                }
                if (r[1]) {
                    if (t = t instanceof Se ? t[0] : t,
                        Se.merge(this, Se.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : Te, !0)),
                    De.test(r[1]) && Se.isPlainObject(t)) {
                        for (r in t) {
                            be(this[r]) ? this[r](t[r]) : this.attr(r, t[r])
                        }
                    }
                    return this
                }
                return i = Te.getElementById(r[2]),
                i && (this[0] = i,
                    this.length = 1),
                    this
            }
            return e.nodeType ? (this[0] = e,
                this.length = 1,
                this) : be(e) ? void 0 !== n.ready ? n.ready(e) : e(Se) : Se.makeArray(e, this)
        }
    ;
    He.prototype = Se.fn,
        qe = Se(Te);
    var Oe = /^(?:parents|prev(?:Until|All))/
        , Pe = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    Se.fn.extend({
        has: function(e) {
            var t = Se(e, this)
                , n = t.length;
            return this.filter(function() {
                for (var e = 0; n > e; e++) {
                    if (Se.contains(this, t[e])) {
                        return !0
                    }
                }
            })
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, o = [], a = "string" != typeof e && Se(e);
            if (!je.test(e)) {
                for (; i > r; r++) {
                    for (n = this[r]; n && n !== t; n = n.parentNode) {
                        if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && Se.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
                    }
                }
            }
            return this.pushStack(o.length > 1 ? Se.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? de.call(Se(e), this[0]) : de.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(Se.uniqueSort(Se.merge(this.get(), Se(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
        Se.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return Ae(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return Ae(e, "parentNode", n)
            },
            next: function(e) {
                return s(e, "nextSibling")
            },
            prev: function(e) {
                return s(e, "previousSibling")
            },
            nextAll: function(e) {
                return Ae(e, "nextSibling")
            },
            prevAll: function(e) {
                return Ae(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return Ae(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return Ae(e, "previousSibling", n)
            },
            siblings: function(e) {
                return Ne((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return Ne(e.firstChild)
            },
            contents: function(e) {
                return null != e.contentDocument && le(e.contentDocument) ? e.contentDocument : (o(e, "template") && (e = e.content || e),
                    Se.merge([], e.childNodes))
            }
        }, function(e, t) {
            Se.fn[e] = function(n, r) {
                var i = Se.map(this, t, n);
                return "Until" !== e.slice(-5) && (r = n),
                r && "string" == typeof r && (i = Se.filter(r, i)),
                this.length > 1 && (Pe[e] || Se.uniqueSort(i),
                Oe.test(e) && i.reverse()),
                    this.pushStack(i)
            }
        });
    var Re = /[^\x20\t\r\n\f]+/g;
    Se.Callbacks = function(e) {
        e = "string" == typeof e ? u(e) : Se.extend({}, e);
        var t, n, i, o, a = [], s = [], l = -1, c = function() {
            for (o = o || e.once,
                     i = t = !0; s.length; l = -1) {
                for (n = s.shift(); ++l < a.length; ) {
                    a[l].apply(n[0], n[1]) === !1 && e.stopOnFalse && (l = a.length,
                        n = !1)
                }
            }
            e.memory || (n = !1),
                t = !1,
            o && (a = n ? [] : "")
        }, f = {
            add: function() {
                return a && (n && !t && (l = a.length - 1,
                    s.push(n)),
                    function i(t) {
                        Se.each(t, function(t, n) {
                            be(n) ? e.unique && f.has(n) || a.push(n) : n && n.length && "string" !== r(n) && i(n)
                        })
                    }(arguments),
                n && !t && c()),
                    this
            },
            remove: function() {
                return Se.each(arguments, function(e, t) {
                    for (var n; (n = Se.inArray(t, a, n)) > -1; ) {
                        a.splice(n, 1),
                        l >= n && l--
                    }
                }),
                    this
            },
            has: function(e) {
                return e ? Se.inArray(e, a) > -1 : a.length > 0
            },
            empty: function() {
                return a && (a = []),
                    this
            },
            disable: function() {
                return o = s = [],
                    a = n = "",
                    this
            },
            disabled: function() {
                return !a
            },
            lock: function() {
                return o = s = [],
                n || t || (a = n = ""),
                    this
            },
            locked: function() {
                return !!o
            },
            fireWith: function(e, n) {
                return o || (n = n || [],
                    n = [e, n.slice ? n.slice() : n],
                    s.push(n),
                t || c()),
                    this
            },
            fire: function() {
                return f.fireWith(this, arguments),
                    this
            },
            fired: function() {
                return !!i
            }
        };
        return f
    }
        ,
        Se.extend({
            Deferred: function(t) {
                var n = [["notify", "progress", Se.Callbacks("memory"), Se.Callbacks("memory"), 2], ["resolve", "done", Se.Callbacks("once memory"), Se.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", Se.Callbacks("once memory"), Se.Callbacks("once memory"), 1, "rejected"]]
                    , r = "pending"
                    , i = {
                    state: function() {
                        return r
                    },
                    always: function() {
                        return o.done(arguments).fail(arguments),
                            this
                    },
                    "catch": function(e) {
                        return i.then(null, e)
                    },
                    pipe: function() {
                        var e = arguments;
                        return Se.Deferred(function(t) {
                            Se.each(n, function(n, r) {
                                var i = be(e[r[4]]) && e[r[4]];
                                o[r[1]](function() {
                                    var e = i && i.apply(this, arguments);
                                    e && be(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + "With"](this, i ? [e] : arguments)
                                })
                            }),
                                e = null
                        }).promise()
                    },
                    then: function(t, r, i) {
                        function o(t, n, r, i) {
                            return function() {
                                var s = this
                                    , u = arguments
                                    , f = function() {
                                        var e, f;
                                        if (!(a > t)) {
                                            if (e = r.apply(s, u),
                                            e === n.promise()) {
                                                throw new TypeError("Thenable self-resolution")
                                            }
                                            f = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                                be(f) ? i ? f.call(e, o(a, n, l, i), o(a, n, c, i)) : (a++,
                                                    f.call(e, o(a, n, l, i), o(a, n, c, i), o(a, n, l, n.notifyWith))) : (r !== l && (s = void 0,
                                                    u = [e]),
                                                    (i || n.resolveWith)(s, u))
                                        }
                                    }
                                    , p = i ? f : function() {
                                        try {
                                            f()
                                        } catch (e) {
                                            Se.Deferred.exceptionHook && Se.Deferred.exceptionHook(e, p.stackTrace),
                                            t + 1 >= a && (r !== c && (s = void 0,
                                                u = [e]),
                                                n.rejectWith(s, u))
                                        }
                                    }
                                ;
                                t ? p() : (Se.Deferred.getStackHook && (p.stackTrace = Se.Deferred.getStackHook()),
                                    e.setTimeout(p))
                            }
                        }
                        var a = 0;
                        return Se.Deferred(function(e) {
                            n[0][3].add(o(0, e, be(i) ? i : l, e.notifyWith)),
                                n[1][3].add(o(0, e, be(t) ? t : l)),
                                n[2][3].add(o(0, e, be(r) ? r : c))
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? Se.extend(e, i) : i
                    }
                }
                    , o = {};
                return Se.each(n, function(e, t) {
                    var a = t[2]
                        , s = t[5];
                    i[t[1]] = a.add,
                    s && a.add(function() {
                        r = s
                    }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock),
                        a.add(t[3].fire),
                        o[t[0]] = function() {
                            return o[t[0] + "With"](this === o ? void 0 : this, arguments),
                                this
                        }
                        ,
                        o[t[0] + "With"] = a.fireWith
                }),
                    i.promise(o),
                t && t.call(o, o),
                    o
            },
            when: function(e) {
                var t = arguments.length
                    , n = t
                    , r = Array(n)
                    , i = ce.call(arguments)
                    , o = Se.Deferred()
                    , a = function(e) {
                    return function(n) {
                        r[e] = this,
                            i[e] = arguments.length > 1 ? ce.call(arguments) : n,
                        --t || o.resolveWith(r, i)
                    }
                };
                if (1 >= t && (f(e, o.done(a(n)).resolve, o.reject, !t),
                "pending" === o.state() || be(i[n] && i[n].then))) {
                    return o.then()
                }
                for (; n--; ) {
                    f(i[n], a(n), o.reject)
                }
                return o.promise()
            }
        });
    var Me = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    Se.Deferred.exceptionHook = function(t, n) {
        e.console && e.console.warn && t && Me.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }
        ,
        Se.readyException = function(t) {
            e.setTimeout(function() {
                throw t
            })
        }
    ;
    var Ie = Se.Deferred();
    Se.fn.ready = function(e) {
        return Ie.then(e)["catch"](function(e) {
            Se.readyException(e)
        }),
            this
    }
        ,
        Se.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(e) {
                (e === !0 ? --Se.readyWait : Se.isReady) || (Se.isReady = !0,
                e !== !0 && --Se.readyWait > 0 || Ie.resolveWith(Te, [Se]))
            }
        }),
        Se.ready.then = Ie.then,
        "complete" === Te.readyState || "loading" !== Te.readyState && !Te.documentElement.doScroll ? e.setTimeout(Se.ready) : (Te.addEventListener("DOMContentLoaded", p),
            e.addEventListener("load", p));
    var We = function(e, t, n, i, o, a, s) {
        var u = 0
            , l = e.length
            , c = null == n;
        if ("object" === r(n)) {
            o = !0;
            for (u in n) {
                We(e, t, u, n[u], !0, a, s)
            }
        } else {
            if (void 0 !== i && (o = !0,
            be(i) || (s = !0),
            c && (s ? (t.call(e, i),
                t = null) : (c = t,
                    t = function(e, t, n) {
                        return c.call(Se(e), n)
                    }
            )),
                t)) {
                for (; l > u; u++) {
                    t(e[u], n, s ? i : i.call(e[u], u, t(e[u], n)))
                }
            }
        }
        return o ? e : c ? t.call(e) : l ? t(e[0], n) : a
    }
        , Fe = /^-ms-/
        , $e = /-([a-z])/g
        , Be = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    g.uid = 1,
        g.prototype = {
            cache: function(e) {
                var t = e[this.expando];
                return t || (t = {},
                Be(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                    value: t,
                    configurable: !0
                }))),
                    t
            },
            set: function(e, t, n) {
                var r, i = this.cache(e);
                if ("string" == typeof t) {
                    i[h(t)] = n
                } else {
                    for (r in t) {
                        i[h(r)] = t[r]
                    }
                }
                return i
            },
            get: function(e, t) {
                return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][h(t)]
            },
            access: function(e, t, n) {
                return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
                    void 0 !== n ? n : t)
            },
            remove: function(e, t) {
                var n, r = e[this.expando];
                if (void 0 !== r) {
                    if (void 0 !== t) {
                        Array.isArray(t) ? t = t.map(h) : (t = h(t),
                            t = t in r ? [t] : t.match(Re) || []),
                            n = t.length;
                        for (; n--; ) {
                            delete r[t[n]]
                        }
                    }
                    (void 0 === t || Se.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
                }
            },
            hasData: function(e) {
                var t = e[this.expando];
                return void 0 !== t && !Se.isEmptyObject(t)
            }
        };
    var _e = new g
        , ze = new g
        , Ue = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
        , Xe = /[A-Z]/g;
    Se.extend({
        hasData: function(e) {
            return ze.hasData(e) || _e.hasData(e)
        },
        data: function(e, t, n) {
            return ze.access(e, t, n)
        },
        removeData: function(e, t) {
            ze.remove(e, t)
        },
        _data: function(e, t, n) {
            return _e.access(e, t, n)
        },
        _removeData: function(e, t) {
            _e.remove(e, t)
        }
    }),
        Se.fn.extend({
            data: function(e, t) {
                var n, r, i, o = this[0], a = o && o.attributes;
                if (void 0 === e) {
                    if (this.length && (i = ze.get(o),
                    1 === o.nodeType && !_e.get(o, "hasDataAttrs"))) {
                        for (n = a.length; n--; ) {
                            a[n] && (r = a[n].name,
                            0 === r.indexOf("data-") && (r = h(r.slice(5)),
                                v(o, r, i[r])))
                        }
                        _e.set(o, "hasDataAttrs", !0)
                    }
                    return i
                }
                return "object" == typeof e ? this.each(function() {
                    ze.set(this, e)
                }) : We(this, function(t) {
                    var n;
                    if (o && void 0 === t) {
                        if (n = ze.get(o, e),
                        void 0 !== n) {
                            return n
                        }
                        if (n = v(o, e),
                        void 0 !== n) {
                            return n
                        }
                    } else {
                        this.each(function() {
                            ze.set(this, e, t)
                        })
                    }
                }, null, t, arguments.length > 1, null, !0)
            },
            removeData: function(e) {
                return this.each(function() {
                    ze.remove(this, e)
                })
            }
        }),
        Se.extend({
            queue: function(e, t, n) {
                var r;
                return e ? (t = (t || "fx") + "queue",
                    r = _e.get(e, t),
                n && (!r || Array.isArray(n) ? r = _e.access(e, t, Se.makeArray(n)) : r.push(n)),
                r || []) : void 0
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = Se.queue(e, t)
                    , r = n.length
                    , i = n.shift()
                    , o = Se._queueHooks(e, t)
                    , a = function() {
                    Se.dequeue(e, t)
                };
                "inprogress" === i && (i = n.shift(),
                    r--),
                i && ("fx" === t && n.unshift("inprogress"),
                    delete o.stop,
                    i.call(e, a, o)),
                !r && o && o.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return _e.get(e, n) || _e.access(e, n, {
                    empty: Se.Callbacks("once memory").add(function() {
                        _e.remove(e, [t + "queue", n])
                    })
                })
            }
        }),
        Se.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return "string" != typeof e && (t = e,
                    e = "fx",
                    n--),
                    arguments.length < n ? Se.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                        var n = Se.queue(this, e, t);
                        Se._queueHooks(this, e),
                        "fx" === e && "inprogress" !== n[0] && Se.dequeue(this, e)
                    })
            },
            dequeue: function(e) {
                return this.each(function() {
                    Se.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, r = 1, i = Se.Deferred(), o = this, a = this.length, s = function() {
                    --r || i.resolveWith(o, [o])
                };
                for ("string" != typeof e && (t = e,
                    e = void 0),
                         e = e || "fx"; a--; ) {
                    n = _e.get(o[a], e + "queueHooks"),
                    n && n.empty && (r++,
                        n.empty.add(s))
                }
                return s(),
                    i.promise(t)
            }
        });
    var Ve = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
        , Ge = RegExp("^(?:([+-])=|)(" + Ve + ")([a-z%]*)$", "i")
        , Ye = ["Top", "Right", "Bottom", "Left"]
        , Qe = Te.documentElement
        , Je = function(e) {
        return Se.contains(e.ownerDocument, e)
    }
        , Ke = {
        composed: !0
    };
    Qe.getRootNode && (Je = function(e) {
            return Se.contains(e.ownerDocument, e) || e.getRootNode(Ke) === e.ownerDocument
        }
    );
    var Ze = function(e, t) {
        return e = t || e,
        "none" === e.style.display || "" === e.style.display && Je(e) && "none" === Se.css(e, "display")
    }
        , et = {};
    Se.fn.extend({
        show: function() {
            return b(this, !0)
        },
        hide: function() {
            return b(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Ze(this) ? Se(this).show() : Se(this).hide()
            })
        }
    });
    var tt = /^(?:checkbox|radio)$/i
        , nt = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i
        , rt = /^$|^module$|\/(?:java|ecma)script/i;
    !function() {
        var e = Te.createDocumentFragment()
            , t = e.appendChild(Te.createElement("div"))
            , n = Te.createElement("input");
        n.setAttribute("type", "radio"),
            n.setAttribute("checked", "checked"),
            n.setAttribute("name", "t"),
            t.appendChild(n),
            xe.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked,
            t.innerHTML = "<textarea>x</textarea>",
            xe.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue,
            t.innerHTML = "<option></option>",
            xe.option = !!t.lastChild
    }();
    var it = {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    it.tbody = it.tfoot = it.colgroup = it.caption = it.thead,
        it.th = it.td,
    xe.option || (it.optgroup = it.option = [1, "<select multiple='multiple'>", "</select>"]);
    var ot = /<|&#?\w+;/
        , at = /^([^.]*)(?:\.(.+)|)/;
    Se.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, m = _e.get(e);
            if (Be(e)) {
                for (n.handler && (o = n,
                    n = o.handler,
                    i = o.selector),
                     i && Se.find.matchesSelector(Qe, i),
                     n.guid || (n.guid = Se.guid++),
                     (u = m.events) || (u = m.events = Object.create(null)),
                     (a = m.handle) || (a = m.handle = function(t) {
                             return void 0 !== Se && Se.event.triggered !== t.type ? Se.event.dispatch.apply(e, arguments) : void 0
                         }
                     ),
                         t = (t || "").match(Re) || [""],
                         l = t.length; l--; ) {
                    s = at.exec(t[l]) || [],
                        d = g = s[1],
                        h = (s[2] || "").split(".").sort(),
                    d && (f = Se.event.special[d] || {},
                        d = (i ? f.delegateType : f.bindType) || d,
                        f = Se.event.special[d] || {},
                        c = Se.extend({
                            type: d,
                            origType: g,
                            data: r,
                            handler: n,
                            guid: n.guid,
                            selector: i,
                            needsContext: i && Se.expr.match.needsContext.test(i),
                            namespace: h.join(".")
                        }, o),
                    (p = u[d]) || (p = u[d] = [],
                        p.delegateCount = 0,
                    f.setup && f.setup.call(e, r, h, a) !== !1 || e.addEventListener && e.addEventListener(d, a)),
                    f.add && (f.add.call(e, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                        i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                        Se.event.global[d] = !0)
                }
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, m = _e.hasData(e) && _e.get(e);
            if (m && (u = m.events)) {
                for (t = (t || "").match(Re) || [""],
                         l = t.length; l--; ) {
                    if (s = at.exec(t[l]) || [],
                        d = g = s[1],
                        h = (s[2] || "").split(".").sort(),
                        d) {
                        for (f = Se.event.special[d] || {},
                                 d = (r ? f.delegateType : f.bindType) || d,
                                 p = u[d] || [],
                                 s = s[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                                 a = o = p.length; o--; ) {
                            c = p[o],
                            !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1),
                            c.selector && p.delegateCount--,
                            f.remove && f.remove.call(e, c))
                        }
                        a && !p.length && (f.teardown && f.teardown.call(e, h, m.handle) !== !1 || Se.removeEvent(e, d, m.handle),
                            delete u[d])
                    } else {
                        for (d in u) {
                            Se.event.remove(e, d + t[l], n, r, !0)
                        }
                    }
                }
                Se.isEmptyObject(u) && _e.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, a, s = Array(arguments.length), u = Se.event.fix(e), l = (_e.get(this, "events") || Object.create(null))[u.type] || [], c = Se.event.special[u.type] || {};
            for (s[0] = u,
                     t = 1; t < arguments.length; t++) {
                s[t] = arguments[t]
            }
            if (u.delegateTarget = this,
            !c.preDispatch || c.preDispatch.call(this, u) !== !1) {
                for (a = Se.event.handlers.call(this, u, l),
                         t = 0; (i = a[t++]) && !u.isPropagationStopped(); ) {
                    for (u.currentTarget = i.elem,
                             n = 0; (o = i.handlers[n++]) && !u.isImmediatePropagationStopped(); ) {
                        (!u.rnamespace || o.namespace === !1 || u.rnamespace.test(o.namespace)) && (u.handleObj = o,
                            u.data = o.data,
                            r = ((Se.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s),
                        void 0 !== r && (u.result = r) === !1 && (u.preventDefault(),
                            u.stopPropagation()))
                    }
                }
                return c.postDispatch && c.postDispatch.call(this, u),
                    u.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a, s = [], u = t.delegateCount, l = e.target;
            if (u && l.nodeType && !("click" === e.type && e.button >= 1)) {
                for (; l !== this; l = l.parentNode || this) {
                    if (1 === l.nodeType && ("click" !== e.type || l.disabled !== !0)) {
                        for (o = [],
                                 a = {},
                                 n = 0; u > n; n++) {
                            r = t[n],
                                i = r.selector + " ",
                            void 0 === a[i] && (a[i] = r.needsContext ? Se(i, this).index(l) > -1 : Se.find(i, this, null, [l]).length),
                            a[i] && o.push(r)
                        }
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    }
                }
            }
            return l = this,
            u < t.length && s.push({
                elem: l,
                handlers: t.slice(u)
            }),
                s
        },
        addProp: function(e, t) {
            Object.defineProperty(Se.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: be(t) ? function() {
                        return this.originalEvent ? t(this.originalEvent) : void 0
                    }
                    : function() {
                        return this.originalEvent ? this.originalEvent[e] : void 0
                    }
                ,
                set: function(t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(e) {
            return e[Se.expando] ? e : new Se.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return tt.test(t.type) && t.click && o(t, "input") && j(t, "click", E),
                        !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return tt.test(t.type) && t.click && o(t, "input") && j(t, "click"),
                        !0
                },
                _default: function(e) {
                    var t = e.target;
                    return tt.test(t.type) && t.click && o(t, "input") && _e.get(t, "click") || o(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
        Se.removeEvent = function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n)
        }
        ,
        Se.Event = function(e, t) {
            return this instanceof Se.Event ? (e && e.type ? (this.originalEvent = e,
                this.type = e.type,
                this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? E : S,
                this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
                this.currentTarget = e.currentTarget,
                this.relatedTarget = e.relatedTarget) : this.type = e,
            t && Se.extend(this, t),
                this.timeStamp = e && e.timeStamp || Date.now(),
                void (this[Se.expando] = !0)) : new Se.Event(e,t)
        }
        ,
        Se.Event.prototype = {
            constructor: Se.Event,
            isDefaultPrevented: S,
            isPropagationStopped: S,
            isImmediatePropagationStopped: S,
            isSimulated: !1,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = E,
                e && !this.isSimulated && e.preventDefault()
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = E,
                e && !this.isSimulated && e.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = E,
                e && !this.isSimulated && e.stopImmediatePropagation(),
                    this.stopPropagation()
            }
        },
        Se.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            "char": !0,
            code: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: !0
        }, Se.event.addProp),
        Se.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            Se.event.special[e] = {
                setup: function() {
                    return j(this, e, k),
                        !1
                },
                trigger: function() {
                    return j(this, e),
                        !0
                },
                _default: function() {
                    return !0
                },
                delegateType: t
            }
        }),
        Se.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, t) {
            Se.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this, i = e.relatedTarget, o = e.handleObj;
                    return (!i || i !== r && !Se.contains(r, i)) && (e.type = o.origType,
                        n = o.handler.apply(this, arguments),
                        e.type = t),
                        n
                }
            }
        }),
        Se.fn.extend({
            on: function(e, t, n, r) {
                return N(this, e, t, n, r)
            },
            one: function(e, t, n, r) {
                return N(this, e, t, n, r, 1)
            },
            off: function(e, t, n) {
                var r, i;
                if (e && e.preventDefault && e.handleObj) {
                    return r = e.handleObj,
                        Se(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                        this
                }
                if ("object" == typeof e) {
                    for (i in e) {
                        this.off(i, t, e[i])
                    }
                    return this
                }
                return (t === !1 || "function" == typeof t) && (n = t,
                    t = void 0),
                n === !1 && (n = S),
                    this.each(function() {
                        Se.event.remove(this, e, n, t)
                    })
            }
        });
    var st = /<script|<style|<link/i
        , ut = /checked\s*(?:[^=]|=\s*.checked.)/i
        , lt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    Se.extend({
        htmlPrefilter: function(e) {
            return e
        },
        clone: function(e, t, n) {
            var r, i, o, a, s = e.cloneNode(!0), u = Je(e);
            if (!(xe.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Se.isXMLDoc(e))) {
                for (a = w(s),
                         o = w(e),
                         r = 0,
                         i = o.length; i > r; r++) {
                    O(o[r], a[r])
                }
            }
            if (t) {
                if (n) {
                    for (o = o || w(e),
                             a = a || w(s),
                             r = 0,
                             i = o.length; i > r; r++) {
                        H(o[r], a[r])
                    }
                } else {
                    H(e, s)
                }
            }
            return a = w(s, "script"),
            a.length > 0 && T(a, !u && w(e, "script")),
                s
        },
        cleanData: function(e) {
            for (var t, n, r, i = Se.event.special, o = 0; void 0 !== (n = e[o]); o++) {
                if (Be(n)) {
                    if (t = n[_e.expando]) {
                        if (t.events) {
                            for (r in t.events) {
                                i[r] ? Se.event.remove(n, r) : Se.removeEvent(n, r, t.handle)
                            }
                        }
                        n[_e.expando] = void 0
                    }
                    n[ze.expando] && (n[ze.expando] = void 0)
                }
            }
        }
    }),
        Se.fn.extend({
            detach: function(e) {
                return R(this, e, !0)
            },
            remove: function(e) {
                return R(this, e)
            },
            text: function(e) {
                return We(this, function(e) {
                    return void 0 === e ? Se.text(this) : this.empty().each(function() {
                        (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
                    })
                }, null, e, arguments.length)
            },
            append: function() {
                return P(this, arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = D(this, e);
                        t.appendChild(e)
                    }
                })
            },
            prepend: function() {
                return P(this, arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = D(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return P(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return P(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++) {
                    1 === e.nodeType && (Se.cleanData(w(e, !1)),
                        e.textContent = "")
                }
                return this
            },
            clone: function(e, t) {
                return e = null == e ? !1 : e,
                    t = null == t ? e : t,
                    this.map(function() {
                        return Se.clone(this, e, t)
                    })
            },
            html: function(e) {
                return We(this, function(e) {
                    var t = this[0] || {}
                        , n = 0
                        , r = this.length;
                    if (void 0 === e && 1 === t.nodeType) {
                        return t.innerHTML
                    }
                    if ("string" == typeof e && !st.test(e) && !it[(nt.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = Se.htmlPrefilter(e);
                        try {
                            for (; r > n; n++) {
                                t = this[n] || {},
                                1 === t.nodeType && (Se.cleanData(w(t, !1)),
                                    t.innerHTML = e)
                            }
                            t = 0
                        } catch (i) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var e = [];
                return P(this, arguments, function(t) {
                    var n = this.parentNode;
                    Se.inArray(this, e) < 0 && (Se.cleanData(w(this)),
                    n && n.replaceChild(t, this))
                }, e)
            }
        }),
        Se.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            Se.fn[e] = function(e) {
                for (var n, r = [], i = Se(e), o = i.length - 1, a = 0; o >= a; a++) {
                    n = a === o ? this : this.clone(!0),
                        Se(i[a])[t](n),
                        pe.apply(r, n.get())
                }
                return this.pushStack(r)
            }
        });
    var ct = RegExp("^(" + Ve + ")(?!px)[a-z%]+$", "i")
        , ft = function(t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e),
            n.getComputedStyle(t)
    }
        , pt = function(e, t, n) {
        var r, i, o = {};
        for (i in t) {
            o[i] = e.style[i],
                e.style[i] = t[i]
        }
        r = n.call(e);
        for (i in t) {
            e.style[i] = o[i]
        }
        return r
    }
        , dt = RegExp(Ye.join("|"), "i");
    !function() {
        function t() {
            if (c) {
                l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                    c.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                    Qe.appendChild(l).appendChild(c);
                var t = e.getComputedStyle(c);
                r = "1%" !== t.top,
                    u = 12 === n(t.marginLeft),
                    c.style.right = "60%",
                    a = 36 === n(t.right),
                    i = 36 === n(t.width),
                    c.style.position = "absolute",
                    o = 12 === n(c.offsetWidth / 3),
                    Qe.removeChild(l),
                    c = null
            }
        }
        function n(e) {
            return Math.round(parseFloat(e))
        }
        var r, i, o, a, s, u, l = Te.createElement("div"), c = Te.createElement("div");
        c.style && (c.style.backgroundClip = "content-box",
            c.cloneNode(!0).style.backgroundClip = "",
            xe.clearCloneStyle = "content-box" === c.style.backgroundClip,
            Se.extend(xe, {
                boxSizingReliable: function() {
                    return t(),
                        i
                },
                pixelBoxStyles: function() {
                    return t(),
                        a
                },
                pixelPosition: function() {
                    return t(),
                        r
                },
                reliableMarginLeft: function() {
                    return t(),
                        u
                },
                scrollboxSize: function() {
                    return t(),
                        o
                },
                reliableTrDimensions: function() {
                    var t, n, r, i;
                    return null == s && (t = Te.createElement("table"),
                        n = Te.createElement("tr"),
                        r = Te.createElement("div"),
                        t.style.cssText = "position:absolute;left:-11111px;border-collapse:separate",
                        n.style.cssText = "border:1px solid",
                        n.style.height = "1px",
                        r.style.height = "9px",
                        r.style.display = "block",
                        Qe.appendChild(t).appendChild(n).appendChild(r),
                        i = e.getComputedStyle(n),
                        s = parseInt(i.height, 10) + parseInt(i.borderTopWidth, 10) + parseInt(i.borderBottomWidth, 10) === n.offsetHeight,
                        Qe.removeChild(t)),
                        s
                }
            }))
    }();
    var ht = ["Webkit", "Moz", "ms"]
        , gt = Te.createElement("div").style
        , mt = {}
        , vt = /^(none|table(?!-c[ea]).+)/
        , yt = /^--/
        , xt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
        , bt = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    Se.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = M(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = h(t), u = yt.test(t), l = e.style;
                return u || (t = F(s)),
                    a = Se.cssHooks[t] || Se.cssHooks[s],
                    void 0 === n ? a && "get"in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t] : (o = typeof n,
                    "string" === o && (i = Ge.exec(n)) && i[1] && (n = y(e, t, i),
                        o = "number"),
                    null != n && n === n && ("number" !== o || u || (n += i && i[3] || (Se.cssNumber[s] ? "" : "px")),
                    xe.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                    a && "set"in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n)),
                        void 0)
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = h(t), u = yt.test(t);
            return u || (t = F(s)),
                a = Se.cssHooks[t] || Se.cssHooks[s],
            a && "get"in a && (i = a.get(e, !0, n)),
            void 0 === i && (i = M(e, t, r)),
            "normal" === i && t in bt && (i = bt[t]),
                "" === n || n ? (o = parseFloat(i),
                    n === !0 || isFinite(o) ? o || 0 : i) : i
        }
    }),
        Se.each(["height", "width"], function(e, t) {
            Se.cssHooks[t] = {
                get: function(e, n, r) {
                    return n ? !vt.test(Se.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? z(e, t, r) : pt(e, xt, function() {
                        return z(e, t, r)
                    }) : void 0
                },
                set: function(e, n, r) {
                    var i, o = ft(e), a = !xe.scrollboxSize() && "absolute" === o.position, s = a || r, u = s && "border-box" === Se.css(e, "boxSizing", !1, o), l = r ? _(e, t, r, u, o) : 0;
                    return u && a && (l -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - _(e, t, "border", !1, o) - 0.5)),
                    l && (i = Ge.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n,
                        n = Se.css(e, t)),
                        B(e, n, l)
                }
            }
        }),
        Se.cssHooks.marginLeft = I(xe.reliableMarginLeft, function(e, t) {
            return t ? (parseFloat(M(e, "marginLeft")) || e.getBoundingClientRect().left - pt(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px" : void 0
        }),
        Se.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(e, t) {
            Se.cssHooks[e + t] = {
                expand: function(n) {
                    for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) {
                        i[e + Ye[r] + t] = o[r] || o[r - 2] || o[0]
                    }
                    return i
                }
            },
            "margin" !== e && (Se.cssHooks[e + t].set = B)
        }),
        Se.fn.extend({
            css: function(e, t) {
                return We(this, function(e, t, n) {
                    var r, i, o = {}, a = 0;
                    if (Array.isArray(t)) {
                        for (r = ft(e),
                                 i = t.length; i > a; a++) {
                            o[t[a]] = Se.css(e, t[a], !1, r)
                        }
                        return o
                    }
                    return void 0 !== n ? Se.style(e, t, n) : Se.css(e, t)
                }, e, t, arguments.length > 1)
            }
        }),
        Se.Tween = U,
        U.prototype = {
            constructor: U,
            init: function(e, t, n, r, i, o) {
                this.elem = e,
                    this.prop = n,
                    this.easing = i || Se.easing._default,
                    this.options = t,
                    this.start = this.now = this.cur(),
                    this.end = r,
                    this.unit = o || (Se.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = U.propHooks[this.prop];
                return e && e.get ? e.get(this) : U.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = U.propHooks[this.prop];
                return this.options.duration ? this.pos = t = Se.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
                    this.now = (this.end - this.start) * t + this.start,
                this.options.step && this.options.step.call(this.elem, this.now, this),
                    n && n.set ? n.set(this) : U.propHooks._default.set(this),
                    this
            }
        },
        U.prototype.init.prototype = U.prototype,
        U.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = Se.css(e.elem, e.prop, ""),
                        t && "auto" !== t ? t : 0)
                },
                set: function(e) {
                    Se.fx.step[e.prop] ? Se.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !Se.cssHooks[e.prop] && null == e.elem.style[F(e.prop)] ? e.elem[e.prop] = e.now : Se.style(e.elem, e.prop, e.now + e.unit)
                }
            }
        },
        U.propHooks.scrollTop = U.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        },
        Se.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return 0.5 - Math.cos(e * Math.PI) / 2
            },
            _default: "swing"
        },
        Se.fx = U.prototype.init,
        Se.fx.step = {};
    var wt, Tt, Ct = /^(?:toggle|show|hide)$/, Et = /queueHooks$/;
    Se.Animation = Se.extend(K, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return y(n.elem, e, Ge.exec(t), n),
                    n
            }
            ]
        },
        tweener: function(e, t) {
            be(e) ? (t = e,
                e = ["*"]) : e = e.match(Re);
            for (var n, r = 0, i = e.length; i > r; r++) {
                n = e[r],
                    K.tweeners[n] = K.tweeners[n] || [],
                    K.tweeners[n].unshift(t)
            }
        },
        prefilters: [Q],
        prefilter: function(e, t) {
            t ? K.prefilters.unshift(e) : K.prefilters.push(e)
        }
    }),
        Se.speed = function(e, t, n) {
            var r = e && "object" == typeof e ? Se.extend({}, e) : {
                complete: n || !n && t || be(e) && e,
                duration: e,
                easing: n && t || t && !be(t) && t
            };
            return Se.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in Se.fx.speeds ? r.duration = Se.fx.speeds[r.duration] : r.duration = Se.fx.speeds._default),
            (null == r.queue || r.queue === !0) && (r.queue = "fx"),
                r.old = r.complete,
                r.complete = function() {
                    be(r.old) && r.old.call(this),
                    r.queue && Se.dequeue(this, r.queue)
                }
                ,
                r
        }
        ,
        Se.fn.extend({
            fadeTo: function(e, t, n, r) {
                return this.filter(Ze).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, r)
            },
            animate: function(e, t, n, r) {
                var i = Se.isEmptyObject(e)
                    , o = Se.speed(t, n, r)
                    , a = function() {
                    var t = K(this, Se.extend({}, e), o);
                    (i || _e.get(this, "finish")) && t.stop(!0)
                };
                return a.finish = a,
                    i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
            },
            stop: function(e, t, n) {
                var r = function(e) {
                    var t = e.stop;
                    delete e.stop,
                        t(n)
                };
                return "string" != typeof e && (n = t,
                    t = e,
                    e = void 0),
                t && this.queue(e || "fx", []),
                    this.each(function() {
                        var t = !0
                            , i = null != e && e + "queueHooks"
                            , o = Se.timers
                            , a = _e.get(this);
                        if (i) {
                            a[i] && a[i].stop && r(a[i])
                        } else {
                            for (i in a) {
                                a[i] && a[i].stop && Et.test(i) && r(a[i])
                            }
                        }
                        for (i = o.length; i--; ) {
                            o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n),
                                t = !1,
                                o.splice(i, 1))
                        }
                        (t || !n) && Se.dequeue(this, e)
                    })
            },
            finish: function(e) {
                return e !== !1 && (e = e || "fx"),
                    this.each(function() {
                        var t, n = _e.get(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = Se.timers, a = r ? r.length : 0;
                        for (n.finish = !0,
                                 Se.queue(this, e, []),
                             i && i.stop && i.stop.call(this, !0),
                                 t = o.length; t--; ) {
                            o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0),
                                o.splice(t, 1))
                        }
                        for (t = 0; a > t; t++) {
                            r[t] && r[t].finish && r[t].finish.call(this)
                        }
                        delete n.finish
                    })
            }
        }),
        Se.each(["toggle", "show", "hide"], function(e, t) {
            var n = Se.fn[t];
            Se.fn[t] = function(e, r, i) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(G(t, !0), e, r, i)
            }
        }),
        Se.each({
            slideDown: G("show"),
            slideUp: G("hide"),
            slideToggle: G("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            Se.fn[e] = function(e, n, r) {
                return this.animate(t, e, n, r)
            }
        }),
        Se.timers = [],
        Se.fx.tick = function() {
            var e, t = 0, n = Se.timers;
            for (wt = Date.now(); t < n.length; t++) {
                e = n[t],
                e() || n[t] !== e || n.splice(t--, 1)
            }
            n.length || Se.fx.stop(),
                wt = void 0
        }
        ,
        Se.fx.timer = function(e) {
            Se.timers.push(e),
                Se.fx.start()
        }
        ,
        Se.fx.interval = 13,
        Se.fx.start = function() {
            Tt || (Tt = !0,
                X())
        }
        ,
        Se.fx.stop = function() {
            Tt = null
        }
        ,
        Se.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        },
        Se.fn.delay = function(t, n) {
            return t = Se.fx ? Se.fx.speeds[t] || t : t,
                n = n || "fx",
                this.queue(n, function(n, r) {
                    var i = e.setTimeout(n, t);
                    r.stop = function() {
                        e.clearTimeout(i)
                    }
                })
        }
        ,
        function() {
            var e = Te.createElement("input")
                , t = Te.createElement("select")
                , n = t.appendChild(Te.createElement("option"));
            e.type = "checkbox",
                xe.checkOn = "" !== e.value,
                xe.optSelected = n.selected,
                e = Te.createElement("input"),
                e.value = "t",
                e.type = "radio",
                xe.radioValue = "t" === e.value
        }();
    var St, kt = Se.expr.attrHandle;
    Se.fn.extend({
        attr: function(e, t) {
            return We(this, Se.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                Se.removeAttr(this, e)
            })
        }
    }),
        Se.extend({
            attr: function(e, t, n) {
                var r, i, o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o) {
                    return void 0 === e.getAttribute ? Se.prop(e, t, n) : (1 === o && Se.isXMLDoc(e) || (i = Se.attrHooks[t.toLowerCase()] || (Se.expr.match.bool.test(t) ? St : void 0)),
                        void 0 !== n ? null === n ? void Se.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                            n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : (r = Se.find.attr(e, t),
                            null == r ? void 0 : r))
                }
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!xe.radioValue && "radio" === t && o(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t),
                            n && (e.value = n),
                                t
                        }
                    }
                }
            },
            removeAttr: function(e, t) {
                var n, r = 0, i = t && t.match(Re);
                if (i && 1 === e.nodeType) {
                    for (; n = i[r++]; ) {
                        e.removeAttribute(n)
                    }
                }
            }
        }),
        St = {
            set: function(e, t, n) {
                return t === !1 ? Se.removeAttr(e, n) : e.setAttribute(n, n),
                    n
            }
        },
        Se.each(Se.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var n = kt[t] || Se.find.attr;
            kt[t] = function(e, t, r) {
                var i, o, a = t.toLowerCase();
                return r || (o = kt[a],
                    kt[a] = i,
                    i = null != n(e, t, r) ? a : null,
                    kt[a] = o),
                    i
            }
        });
    var At = /^(?:input|select|textarea|button)$/i
        , Nt = /^(?:a|area)$/i;
    Se.fn.extend({
        prop: function(e, t) {
            return We(this, Se.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[Se.propFix[e] || e]
            })
        }
    }),
        Se.extend({
            prop: function(e, t, n) {
                var r, i, o = e.nodeType;
                if (3 !== o && 8 !== o && 2 !== o) {
                    return 1 === o && Se.isXMLDoc(e) || (t = Se.propFix[t] || t,
                        i = Se.propHooks[t]),
                        void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
                }
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = Se.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : At.test(e.nodeName) || Nt.test(e.nodeName) && e.href ? 0 : -1
                    }
                }
            },
            propFix: {
                "for": "htmlFor",
                "class": "className"
            }
        }),
    xe.optSelected || (Se.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
                null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
        Se.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            Se.propFix[this.toLowerCase()] = this
        }),
        Se.fn.extend({
            addClass: function(e) {
                var t, n, r, i, o, a, s, u = 0;
                if (be(e)) {
                    return this.each(function(t) {
                        Se(this).addClass(e.call(this, t, ee(this)))
                    })
                }
                if (t = te(e),
                    t.length) {
                    for (; n = this[u++]; ) {
                        if (i = ee(n),
                            r = 1 === n.nodeType && " " + Z(i) + " ") {
                            for (a = 0; o = t[a++]; ) {
                                r.indexOf(" " + o + " ") < 0 && (r += o + " ")
                            }
                            s = Z(r),
                            i !== s && n.setAttribute("class", s)
                        }
                    }
                }
                return this
            },
            removeClass: function(e) {
                var t, n, r, i, o, a, s, u = 0;
                if (be(e)) {
                    return this.each(function(t) {
                        Se(this).removeClass(e.call(this, t, ee(this)))
                    })
                }
                if (!arguments.length) {
                    return this.attr("class", "")
                }
                if (t = te(e),
                    t.length) {
                    for (; n = this[u++]; ) {
                        if (i = ee(n),
                            r = 1 === n.nodeType && " " + Z(i) + " ") {
                            for (a = 0; o = t[a++]; ) {
                                for (; r.indexOf(" " + o + " ") > -1; ) {
                                    r = r.replace(" " + o + " ", " ")
                                }
                            }
                            s = Z(r),
                            i !== s && n.setAttribute("class", s)
                        }
                    }
                }
                return this
            },
            toggleClass: function(e, t) {
                var n = typeof e
                    , r = "string" === n || Array.isArray(e);
                return "boolean" == typeof t && r ? t ? this.addClass(e) : this.removeClass(e) : be(e) ? this.each(function(n) {
                    Se(this).toggleClass(e.call(this, n, ee(this), t), t)
                }) : this.each(function() {
                    var t, i, o, a;
                    if (r) {
                        for (i = 0,
                                 o = Se(this),
                                 a = te(e); t = a[i++]; ) {
                            o.hasClass(t) ? o.removeClass(t) : o.addClass(t)
                        }
                    } else {
                        (void 0 === e || "boolean" === n) && (t = ee(this),
                        t && _e.set(this, "__className__", t),
                        this.setAttribute && this.setAttribute("class", t || e === !1 ? "" : _e.get(this, "__className__") || ""))
                    }
                })
            },
            hasClass: function(e) {
                var t, n, r = 0;
                for (t = " " + e + " "; n = this[r++]; ) {
                    if (1 === n.nodeType && (" " + Z(ee(n)) + " ").indexOf(t) > -1) {
                        return !0
                    }
                }
                return !1
            }
        });
    var jt = /\r/g;
    Se.fn.extend({
        val: function(e) {
            var t, n, r, i = this[0];
            if (arguments.length) {
                return r = be(e),
                    this.each(function(n) {
                        var i;
                        1 === this.nodeType && (i = r ? e.call(this, n, Se(this).val()) : e,
                            null == i ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = Se.map(i, function(e) {
                                return null == e ? "" : e + ""
                            })),
                            t = Se.valHooks[this.type] || Se.valHooks[this.nodeName.toLowerCase()],
                        t && "set"in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                    })
            }
            if (i) {
                return t = Se.valHooks[i.type] || Se.valHooks[i.nodeName.toLowerCase()],
                    t && "get"in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value,
                        "string" == typeof n ? n.replace(jt, "") : null == n ? "" : n)
            }
        }
    }),
        Se.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = Se.find.attr(e, "value");
                        return null != t ? t : Z(Se.text(e))
                    }
                },
                select: {
                    get: function(e) {
                        var t, n, r, i = e.options, a = e.selectedIndex, s = "select-one" === e.type, u = s ? null : [], l = s ? a + 1 : i.length;
                        for (r = 0 > a ? l : s ? a : 0; l > r; r++) {
                            if (n = i[r],
                            (n.selected || r === a) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
                                if (t = Se(n).val(),
                                    s) {
                                    return t
                                }
                                u.push(t)
                            }
                        }
                        return u
                    },
                    set: function(e, t) {
                        for (var n, r, i = e.options, o = Se.makeArray(t), a = i.length; a--; ) {
                            r = i[a],
                            (r.selected = Se.inArray(Se.valHooks.option.get(r), o) > -1) && (n = !0)
                        }
                        return n || (e.selectedIndex = -1),
                            o
                    }
                }
            }
        }),
        Se.each(["radio", "checkbox"], function() {
            Se.valHooks[this] = {
                set: function(e, t) {
                    return Array.isArray(t) ? e.checked = Se.inArray(Se(e).val(), t) > -1 : void 0
                }
            },
            xe.checkOn || (Se.valHooks[this].get = function(e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                }
            )
        }),
        xe.focusin = "onfocusin"in e;
    var Dt = /^(?:focusinfocus|focusoutblur)$/
        , qt = function(e) {
        e.stopPropagation()
    };
    Se.extend(Se.event, {
        trigger: function(t, n, r, i) {
            var o, a, s, u, l, c, f, p, d = [r || Te], h = me.call(t, "type") ? t.type : t, g = me.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = p = s = r = r || Te,
            3 !== r.nodeType && 8 !== r.nodeType && !Dt.test(h + Se.event.triggered) && (h.indexOf(".") > -1 && (g = h.split("."),
                h = g.shift(),
                g.sort()),
                l = h.indexOf(":") < 0 && "on" + h,
                t = t[Se.expando] ? t : new Se.Event(h,"object" == typeof t && t),
                t.isTrigger = i ? 2 : 3,
                t.namespace = g.join("."),
                t.rnamespace = t.namespace ? RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                t.result = void 0,
            t.target || (t.target = r),
                n = null == n ? [t] : Se.makeArray(n, [t]),
                f = Se.event.special[h] || {},
            i || !f.trigger || f.trigger.apply(r, n) !== !1)) {
                if (!i && !f.noBubble && !we(r)) {
                    for (u = f.delegateType || h,
                         Dt.test(u + h) || (a = a.parentNode); a; a = a.parentNode) {
                        d.push(a),
                            s = a
                    }
                    s === (r.ownerDocument || Te) && d.push(s.defaultView || s.parentWindow || e)
                }
                for (o = 0; (a = d[o++]) && !t.isPropagationStopped(); ) {
                    p = a,
                        t.type = o > 1 ? u : f.bindType || h,
                        c = (_e.get(a, "events") || Object.create(null))[t.type] && _e.get(a, "handle"),
                    c && c.apply(a, n),
                        c = l && a[l],
                    c && c.apply && Be(a) && (t.result = c.apply(a, n),
                    t.result === !1 && t.preventDefault())
                }
                return t.type = h,
                i || t.isDefaultPrevented() || f._default && f._default.apply(d.pop(), n) !== !1 || !Be(r) || l && be(r[h]) && !we(r) && (s = r[l],
                s && (r[l] = null),
                    Se.event.triggered = h,
                t.isPropagationStopped() && p.addEventListener(h, qt),
                    r[h](),
                t.isPropagationStopped() && p.removeEventListener(h, qt),
                    Se.event.triggered = void 0,
                s && (r[l] = s)),
                    t.result
            }
        },
        simulate: function(e, t, n) {
            var r = Se.extend(new Se.Event, n, {
                type: e,
                isSimulated: !0
            });
            Se.event.trigger(r, null, t)
        }
    }),
        Se.fn.extend({
            trigger: function(e, t) {
                return this.each(function() {
                    Se.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                return n ? Se.event.trigger(e, t, n, !0) : void 0
            }
        }),
    xe.focusin || Se.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            Se.event.simulate(t, e.target, Se.event.fix(e))
        };
        Se.event.special[t] = {
            setup: function() {
                var r = this.ownerDocument || this.document || this
                    , i = _e.access(r, t);
                i || r.addEventListener(e, n, !0),
                    _e.access(r, t, (i || 0) + 1)
            },
            teardown: function() {
                var r = this.ownerDocument || this.document || this
                    , i = _e.access(r, t) - 1;
                i ? _e.access(r, t, i) : (r.removeEventListener(e, n, !0),
                    _e.remove(r, t))
            }
        }
    });
    var Lt = e.location
        , Ht = {
        guid: Date.now()
    }
        , Ot = /\?/;
    Se.parseXML = function(t) {
        var n, r;
        if (!t || "string" != typeof t) {
            return null
        }
        try {
            n = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (i) {}
        return r = n && n.getElementsByTagName("parsererror")[0],
        (!n || r) && Se.error("Invalid XML: " + (r ? Se.map(r.childNodes, function(e) {
            return e.textContent
        }).join("\n") : t)),
            n
    }
    ;
    var Pt = /\[\]$/
        , Rt = /\r?\n/g
        , Mt = /^(?:submit|button|image|reset|file)$/i
        , It = /^(?:input|select|textarea|keygen)/i;
    Se.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            var n = be(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
        };
        if (null == e) {
            return ""
        }
        if (Array.isArray(e) || e.jquery && !Se.isPlainObject(e)) {
            Se.each(e, function() {
                i(this.name, this.value)
            })
        } else {
            for (n in e) {
                ne(n, e[n], t, i)
            }
        }
        return r.join("&")
    }
        ,
        Se.fn.extend({
            serialize: function() {
                var e = this.serializeArray()
                    , t = $("input[type=radio],input[type=checkbox]", this)
                    , n = {};
                return $.each(t, function() {
                    n.hasOwnProperty(this.name) || 0 == $("input[name='" + this.name + "']:checked").length && (n[this.name] = "",
                        e.push({
                            name: this.name,
                            value: ""
                        }))
                }),
                    Se.param(e)
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = Se.prop(this, "elements");
                    return e ? Se.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !Se(this).is(":disabled") && It.test(this.nodeName) && !Mt.test(e) && (this.checked || !tt.test(e))
                }).map(function(e, t) {
                    var n = Se(this).val();
                    return null == n ? null : Array.isArray(n) ? Se.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(Rt, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(Rt, "\r\n")
                    }
                }).get()
            }
        });
    var Wt = /%20/g
        , Ft = /#.*$/
        , $t = /([?&])_=[^&]*/
        , Bt = /^(.*?):[ \t]*([^\r\n]*)$/gm
        , _t = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
        , zt = /^(?:GET|HEAD)$/
        , Ut = /^\/\//
        , Xt = {}
        , Vt = {}
        , Gt = "*/".concat("*")
        , Yt = Te.createElement("a");
    Yt.href = Lt.href,
        Se.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Lt.href,
                type: "GET",
                isLocal: _t.test(Lt.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Gt,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": JSON.parse,
                    "text xml": Se.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? oe(oe(e, Se.ajaxSettings), t) : oe(Se.ajaxSettings, e)
            },
            ajaxPrefilter: re(Xt),
            ajaxTransport: re(Vt),
            ajax: function(t, n) {
                function r(t, n, r, s) {
                    var l, p, d, b, w, T = n;
                    c || (c = !0,
                    u && e.clearTimeout(u),
                        i = void 0,
                        a = s || "",
                        C.readyState = t > 0 ? 4 : 0,
                        l = t >= 200 && 300 > t || 304 === t,
                    r && (b = ae(h, C, r)),
                    !l && Se.inArray("script", h.dataTypes) > -1 && Se.inArray("json", h.dataTypes) < 0 && (h.converters["text script"] = function() {}
                    ),
                        b = se(h, b, C, l),
                        l ? (h.ifModified && (w = C.getResponseHeader("Last-Modified"),
                        w && (Se.lastModified[o] = w),
                            w = C.getResponseHeader("etag"),
                        w && (Se.etag[o] = w)),
                            204 === t || "HEAD" === h.type ? T = "nocontent" : 304 === t ? T = "notmodified" : (T = b.state,
                                p = b.data,
                                d = b.error,
                                l = !d)) : (d = T,
                        (t || !T) && (T = "error",
                        0 > t && (t = 0))),
                        C.status = t,
                        C.statusText = (n || T) + "",
                        l ? v.resolveWith(g, [p, T, C]) : v.rejectWith(g, [C, T, d]),
                        C.statusCode(x),
                        x = void 0,
                    f && m.trigger(l ? "ajaxSuccess" : "ajaxError", [C, h, l ? p : d]),
                        y.fireWith(g, [C, T]),
                    f && (m.trigger("ajaxComplete", [C, h]),
                    --Se.active || Se.event.trigger("ajaxStop")))
                }
                "object" == typeof t && (n = t,
                    t = void 0),
                    n = n || {};
                var i, o, a, s, u, l, c, f, p, d, h = Se.ajaxSetup({}, n), g = h.context || h, m = h.context && (g.nodeType || g.jquery) ? Se(g) : Se.event, v = Se.Deferred(), y = Se.Callbacks("once memory"), x = h.statusCode || {}, b = {}, w = {}, T = "canceled", C = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (c) {
                            if (!s) {
                                for (s = {}; t = Bt.exec(a); ) {
                                    s[t[1].toLowerCase() + " "] = (s[t[1].toLowerCase() + " "] || []).concat(t[2])
                                }
                            }
                            t = s[e.toLowerCase() + " "]
                        }
                        return null == t ? null : t.join(", ")
                    },
                    getAllResponseHeaders: function() {
                        return c ? a : null
                    },
                    setRequestHeader: function(e, t) {
                        return null == c && (e = w[e.toLowerCase()] = w[e.toLowerCase()] || e,
                            b[e] = t),
                            this
                    },
                    overrideMimeType: function(e) {
                        return null == c && (h.mimeType = e),
                            this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e) {
                            if (c) {
                                C.always(e[C.status])
                            } else {
                                for (t in e) {
                                    x[t] = [x[t], e[t]]
                                }
                            }
                        }
                        return this
                    },
                    abort: function(e) {
                        var t = e || T;
                        return i && i.abort(t),
                            r(0, t),
                            this
                    }
                };
                if (v.promise(C),
                    h.url = ((t || h.url || Lt.href) + "").replace(Ut, Lt.protocol + "//"),
                    h.type = n.method || n.type || h.method || h.type,
                    h.dataTypes = (h.dataType || "*").toLowerCase().match(Re) || [""],
                null == h.crossDomain) {
                    l = Te.createElement("a");
                    try {
                        l.href = h.url,
                            l.href = l.href,
                            h.crossDomain = Yt.protocol + "//" + Yt.host != l.protocol + "//" + l.host
                    } catch (E) {
                        h.crossDomain = !0
                    }
                }
                if (h.data && h.processData && "string" != typeof h.data && (h.data = Se.param(h.data, h.traditional)),
                    ie(Xt, h, n, C),
                    c) {
                    return C
                }
                f = Se.event && h.global,
                f && 0 === Se.active++ && Se.event.trigger("ajaxStart"),
                    h.type = h.type.toUpperCase(),
                    h.hasContent = !zt.test(h.type),
                    o = h.url.replace(Ft, ""),
                    h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(Wt, "+")) : (d = h.url.slice(o.length),
                    h.data && (h.processData || "string" == typeof h.data) && (o += (Ot.test(o) ? "&" : "?") + h.data,
                        delete h.data),
                    h.cache === !1 && (o = o.replace($t, "$1"),
                        d = (Ot.test(o) ? "&" : "?") + "_=" + Ht.guid++ + d),
                        h.url = o + d),
                h.ifModified && (Se.lastModified[o] && C.setRequestHeader("If-Modified-Since", Se.lastModified[o]),
                Se.etag[o] && C.setRequestHeader("If-None-Match", Se.etag[o])),
                (h.data && h.hasContent && h.contentType !== !1 || n.contentType) && C.setRequestHeader("Content-Type", h.contentType),
                    C.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Gt + "; q=0.01" : "") : h.accepts["*"]);
                for (p in h.headers) {
                    C.setRequestHeader(p, h.headers[p])
                }
                if (h.beforeSend && (h.beforeSend.call(g, C, h) === !1 || c)) {
                    return C.abort()
                }
                if (T = "abort",
                    y.add(h.complete),
                    C.done(h.success),
                    C.fail(h.error),
                    i = ie(Vt, h, n, C)) {
                    if (C.readyState = 1,
                    f && m.trigger("ajaxSend", [C, h]),
                        c) {
                        return C
                    }
                    h.async && h.timeout > 0 && (u = e.setTimeout(function() {
                        C.abort("timeout")
                    }, h.timeout));
                    try {
                        c = !1,
                            i.send(b, r)
                    } catch (E) {
                        if (c) {
                            throw E
                        }
                        r(-1, E)
                    }
                } else {
                    r(-1, "No Transport")
                }
                return C
            },
            getJSON: function(e, t, n) {
                return Se.get(e, t, n, "json")
            },
            getScript: function(e, t) {
                return Se.get(e, void 0, t, "script")
            }
        }),
        Se.each(["get", "post"], function(e, t) {
            Se[t] = function(e, n, r, i) {
                return be(n) && (i = i || r,
                    r = n,
                    n = void 0),
                    Se.ajax(Se.extend({
                        url: e,
                        type: t,
                        dataType: i,
                        data: n,
                        success: r
                    }, Se.isPlainObject(e) && e))
            }
        }),
        Se.ajaxPrefilter(function(e) {
            var t;
            for (t in e.headers) {
                "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
            }
        }),
        Se._evalUrl = function(e, t, n) {
            return Se.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                converters: {
                    "text script": function() {}
                },
                dataFilter: function(e) {
                    Se.globalEval(e, t, n)
                }
            })
        }
        ,
        Se.fn.extend({
            wrapAll: function(e) {
                var t;
                return this[0] && (be(e) && (e = e.call(this[0])),
                    t = Se(e, this[0].ownerDocument).eq(0).clone(!0),
                this[0].parentNode && t.insertBefore(this[0]),
                    t.map(function() {
                        for (var e = this; e.firstElementChild; ) {
                            e = e.firstElementChild
                        }
                        return e
                    }).append(this)),
                    this
            },
            wrapInner: function(e) {
                return be(e) ? this.each(function(t) {
                    Se(this).wrapInner(e.call(this, t))
                }) : this.each(function() {
                    var t = Se(this)
                        , n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            },
            wrap: function(e) {
                var t = be(e);
                return this.each(function(n) {
                    Se(this).wrapAll(t ? e.call(this, n) : e)
                })
            },
            unwrap: function(e) {
                return this.parent(e).not("body").each(function() {
                    Se(this).replaceWith(this.childNodes)
                }),
                    this
            }
        }),
        Se.expr.pseudos.hidden = function(e) {
            return !Se.expr.pseudos.visible(e)
        }
        ,
        Se.expr.pseudos.visible = function(e) {
            return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
        }
        ,
        Se.ajaxSettings.xhr = function() {
            try {
                return new e.XMLHttpRequest
            } catch (t) {}
        }
    ;
    var Qt = {
        0: 200,
        1223: 204
    }
        , Jt = Se.ajaxSettings.xhr();
    xe.cors = !!Jt && "withCredentials"in Jt,
        xe.ajax = Jt = !!Jt,
        Se.ajaxTransport(function(t) {
            var n, r;
            return xe.cors || Jt && !t.crossDomain ? {
                send: function(i, o) {
                    var a, s = t.xhr();
                    if (s.open(t.type, t.url, t.async, t.username, t.password),
                        t.xhrFields) {
                        for (a in t.xhrFields) {
                            s[a] = t.xhrFields[a]
                        }
                    }
                    t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType),
                    t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                    for (a in i) {
                        s.setRequestHeader(a, i[a])
                    }
                    n = function(e) {
                        return function() {
                            n && (n = r = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null,
                                "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(Qt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                    binary: s.response
                                } : {
                                    text: s.responseText
                                }, s.getAllResponseHeaders()))
                        }
                    }
                        ,
                        s.onload = n(),
                        r = s.onerror = s.ontimeout = n("error"),
                        void 0 !== s.onabort ? s.onabort = r : s.onreadystatechange = function() {
                            4 === s.readyState && e.setTimeout(function() {
                                n && r()
                            })
                        }
                        ,
                        n = n("abort");
                    try {
                        s.send(t.hasContent && t.data || null)
                    } catch (u) {
                        if (n) {
                            throw u
                        }
                    }
                },
                abort: function() {
                    n && n()
                }
            } : void 0
        }),
        Se.ajaxPrefilter(function(e) {
            e.crossDomain && (e.contents.script = !1)
        }),
        Se.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(e) {
                    return Se.globalEval(e),
                        e
                }
            }
        }),
        Se.ajaxPrefilter("script", function(e) {
            void 0 === e.cache && (e.cache = !1),
            e.crossDomain && (e.type = "GET")
        }),
        Se.ajaxTransport("script", function(e) {
            if (e.crossDomain || e.scriptAttrs) {
                var t, n;
                return {
                    send: function(r, i) {
                        t = Se("<script>").attr(e.scriptAttrs || {}).prop({
                            charset: e.scriptCharset,
                            src: e.url
                        }).on("load error", n = function(e) {
                                t.remove(),
                                    n = null,
                                e && i("error" === e.type ? 404 : 200, e.type)
                            }
                        ),
                            Te.head.appendChild(t[0])
                    },
                    abort: function() {
                        n && n()
                    }
                }
            }
        });
    var Kt = []
        , Zt = /(=)\?(?=&|$)|\?\?/;
    Se.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Kt.pop() || Se.expando + "_" + Ht.guid++;
            return this[e] = !0,
                e
        }
    }),
        Se.ajaxPrefilter("json jsonp", function(t, n, r) {
            var i, o, a, s = t.jsonp !== !1 && (Zt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Zt.test(t.data) && "data");
            return s || "jsonp" === t.dataTypes[0] ? (i = t.jsonpCallback = be(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
                s ? t[s] = t[s].replace(Zt, "$1" + i) : t.jsonp !== !1 && (t.url += (Ot.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
                t.converters["script json"] = function() {
                    return a || Se.error(i + " was not called"),
                        a[0]
                }
                ,
                t.dataTypes[0] = "json",
                o = e[i],
                e[i] = function() {
                    a = arguments
                }
                ,
                r.always(function() {
                    void 0 === o ? Se(e).removeProp(i) : e[i] = o,
                    t[i] && (t.jsonpCallback = n.jsonpCallback,
                        Kt.push(i)),
                    a && be(o) && o(a[0]),
                        a = o = void 0
                }),
                "script") : void 0
        }),
        xe.createHTMLDocument = function() {
            var e = Te.implementation.createHTMLDocument("").body;
            return e.innerHTML = "<form></form><form></form>",
            2 === e.childNodes.length
        }(),
        Se.parseHTML = function(e, t, n) {
            if ("string" != typeof e) {
                return []
            }
            "boolean" == typeof t && (n = t,
                t = !1);
            var r, i, o;
            return t || (xe.createHTMLDocument ? (t = Te.implementation.createHTMLDocument(""),
                r = t.createElement("base"),
                r.href = Te.location.href,
                t.head.appendChild(r)) : t = Te),
                i = De.exec(e),
                o = !n && [],
                i ? [t.createElement(i[1])] : (i = C([e], t, o),
                o && o.length && Se(o).remove(),
                    Se.merge([], i.childNodes))
        }
        ,
        Se.fn.load = function(e, t, n) {
            var r, i, o, a = this, s = e.indexOf(" ");
            return s > -1 && (r = Z(e.slice(s)),
                e = e.slice(0, s)),
                be(t) ? (n = t,
                    t = void 0) : t && "object" == typeof t && (i = "POST"),
            a.length > 0 && Se.ajax({
                url: e,
                type: i || "GET",
                dataType: "html",
                data: t
            }).done(function(e) {
                o = arguments,
                    a.html(r ? Se("<div>").append(Se.parseHTML(e)).find(r) : e)
            }).always(n && function(e, t) {
                a.each(function() {
                    n.apply(this, o || [e.responseText, t, e])
                })
            }
            ),
                this
        }
        ,
        Se.expr.pseudos.animated = function(e) {
            return Se.grep(Se.timers, function(t) {
                return e === t.elem
            }).length
        }
        ,
        Se.offset = {
            setOffset: function(e, t, n) {
                var r, i, o, a, s, u, l, c = Se.css(e, "position"), f = Se(e), p = {};
                "static" === c && (e.style.position = "relative"),
                    s = f.offset(),
                    o = Se.css(e, "top"),
                    u = Se.css(e, "left"),
                    l = ("absolute" === c || "fixed" === c) && (o + u).indexOf("auto") > -1,
                    l ? (r = f.position(),
                        a = r.top,
                        i = r.left) : (a = parseFloat(o) || 0,
                        i = parseFloat(u) || 0),
                be(t) && (t = t.call(e, n, Se.extend({}, s))),
                null != t.top && (p.top = t.top - s.top + a),
                null != t.left && (p.left = t.left - s.left + i),
                    "using"in t ? t.using.call(e, p) : f.css(p)
            }
        },
        Se.fn.extend({
            offset: function(e) {
                if (arguments.length) {
                    return void 0 === e ? this : this.each(function(t) {
                        Se.offset.setOffset(this, e, t)
                    })
                }
                var t, n, r = this[0];
                if (r) {
                    return r.getClientRects().length ? (t = r.getBoundingClientRect(),
                        n = r.ownerDocument.defaultView,
                        {
                            top: t.top + n.pageYOffset,
                            left: t.left + n.pageXOffset
                        }) : {
                        top: 0,
                        left: 0
                    }
                }
            },
            position: function() {
                if (this[0]) {
                    var e, t, n, r = this[0], i = {
                        top: 0,
                        left: 0
                    };
                    if ("fixed" === Se.css(r, "position")) {
                        t = r.getBoundingClientRect()
                    } else {
                        for (t = this.offset(),
                                 n = r.ownerDocument,
                                 e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === Se.css(e, "position"); ) {
                            e = e.parentNode
                        }
                        e && e !== r && 1 === e.nodeType && (i = Se(e).offset(),
                            i.top += Se.css(e, "borderTopWidth", !0),
                            i.left += Se.css(e, "borderLeftWidth", !0))
                    }
                    return {
                        top: t.top - i.top - Se.css(r, "marginTop", !0),
                        left: t.left - i.left - Se.css(r, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent; e && "static" === Se.css(e, "position"); ) {
                        e = e.offsetParent
                    }
                    return e || Qe
                })
            }
        }),
        Se.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(e, t) {
            var n = "pageYOffset" === t;
            Se.fn[e] = function(r) {
                return We(this, function(e, r, i) {
                    var o;
                    return we(e) ? o = e : 9 === e.nodeType && (o = e.defaultView),
                        void 0 === i ? o ? o[t] : e[r] : void (o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i)
                }, e, r, arguments.length)
            }
        }),
        Se.each(["top", "left"], function(e, t) {
            Se.cssHooks[t] = I(xe.pixelPosition, function(e, n) {
                return n ? (n = M(e, t),
                    ct.test(n) ? Se(e).position()[t] + "px" : n) : void 0
            })
        }),
        Se.each({
            Height: "height",
            Width: "width"
        }, function(e, t) {
            Se.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, function(n, r) {
                Se.fn[r] = function(i, o) {
                    var a = arguments.length && (n || "boolean" != typeof i)
                        , s = n || (i === !0 || o === !0 ? "margin" : "border");
                    return We(this, function(t, n, i) {
                        var o;
                        return we(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement,
                            Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? Se.css(t, n, s) : Se.style(t, n, i, s)
                    }, t, a ? i : void 0, a)
                }
            })
        }),
        Se.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            Se.fn[t] = function(e) {
                return this.on(t, e)
            }
        }),
        Se.fn.extend({
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            },
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }
        }),
        Se.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
            Se.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }
        });
    var en = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    Se.proxy = function(e, t) {
        var n, r, i;
        return "string" == typeof t && (n = e[t],
            t = e,
            e = n),
            be(e) ? (r = ce.call(arguments, 2),
                i = function() {
                    return e.apply(t || this, r.concat(ce.call(arguments)))
                }
                ,
                i.guid = e.guid = e.guid || Se.guid++,
                i) : void 0
    }
        ,
        Se.holdReady = function(e) {
            e ? Se.readyWait++ : Se.ready(!0)
        }
        ,
        Se.isArray = Array.isArray,
        Se.parseJSON = JSON.parse,
        Se.nodeName = o,
        Se.isFunction = be,
        Se.isWindow = we,
        Se.camelCase = h,
        Se.type = r,
        Se.now = Date.now,
        Se.isNumeric = function(e) {
            var t = Se.type(e);
            return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
        }
        ,
        Se.trim = function(e) {
            return null == e ? "" : (e + "").replace(en, "")
        }
        ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return Se
    });
    var tn = e.jQuery
        , nn = e.$;
    return Se.noConflict = function(t) {
        return e.$ === Se && (e.$ = nn),
        t && e.jQuery === Se && (e.jQuery = tn),
            Se
    }
        ,
    void 0 === t && (e.jQuery = e.$ = Se),
        Se
});
