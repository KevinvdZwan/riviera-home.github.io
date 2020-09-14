/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
jQuery(function ($) {
    $.datepicker.regional['nl'] = {
        clearText: 'Wissen', clearStatus: 'Wis de huidige datum',
        closeText: 'Sluiten', closeStatus: 'Sluit zonder verandering',
        prevText: '&lt;Terug', prevStatus: 'Laat de voorgaande maand zien',
        nextText: 'Volgende&gt;', nextStatus: 'Laat de volgende maand zien',
        currentText: 'Vandaag', currentStatus: 'Laat de huidige maand zien',
        monthNames: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
            'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun',
            'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        monthStatus: 'Laat een andere maand zien', yearStatus: 'Laat een ander jaar zien',
        weekHeader: 'Wk', weekStatus: 'Week van het jaar',
        dayNames: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
        dayNamesShort: ['Zon', 'Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat'],
        dayNamesMin: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
        dayStatus: 'DD', dateStatus: 'D, M d',
        dateFormat: 'dd.mm.yy', firstDay: 1,
        initStatus: 'Kies een datum', isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['nl']);
});

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
!function (e) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], e) : e("undefined" != typeof jQuery ? jQuery : window.Zepto) }(function (e) { "use strict"; function t(t) { var r = t.data; t.isDefaultPrevented() || (t.preventDefault(), e(t.target).ajaxSubmit(r)) } function r(t) { var r = t.target, a = e(r); if (!a.is("[type=submit],[type=image]")) { var n = a.closest("[type=submit]"); if (0 === n.length) return; r = n[0] } var i = this; if (i.clk = r, "image" == r.type) if (void 0 !== t.offsetX) i.clk_x = t.offsetX, i.clk_y = t.offsetY; else if ("function" == typeof e.fn.offset) { var o = a.offset(); i.clk_x = t.pageX - o.left, i.clk_y = t.pageY - o.top } else i.clk_x = t.pageX - r.offsetLeft, i.clk_y = t.pageY - r.offsetTop; setTimeout(function () { i.clk = i.clk_x = i.clk_y = null }, 100) } function a() { if (e.fn.ajaxSubmit.debug) { var t = "[jquery.form] " + Array.prototype.join.call(arguments, ""); window.console && window.console.log ? window.console.log(t) : window.opera && window.opera.postError && window.opera.postError(t) } } var n = {}; n.fileapi = void 0 !== e("<input type='file'/>").get(0).files, n.formdata = void 0 !== window.FormData; var i = !!e.fn.prop; e.fn.attr2 = function () { if (!i) return this.attr.apply(this, arguments); var e = this.prop.apply(this, arguments); return e && e.jquery || "string" == typeof e ? e : this.attr.apply(this, arguments) }, e.fn.ajaxSubmit = function (t) { function r(r) { var a, n, i = e.param(r, t.traditional).split("&"), o = i.length, s = []; for (a = 0; o > a; a++)i[a] = i[a].replace(/\+/g, " "), n = i[a].split("="), s.push([decodeURIComponent(n[0]), decodeURIComponent(n[1])]); return s } function o(a) { for (var n = new FormData, i = 0; i < a.length; i++)n.append(a[i].name, a[i].value); if (t.extraData) { var o = r(t.extraData); for (i = 0; i < o.length; i++)o[i] && n.append(o[i][0], o[i][1]) } t.data = null; var s = e.extend(!0, {}, e.ajaxSettings, t, { contentType: !1, processData: !1, cache: !1, type: u || "POST" }); t.uploadProgress && (s.xhr = function () { var r = e.ajaxSettings.xhr(); return r.upload && r.upload.addEventListener("progress", function (e) { var r = 0, a = e.loaded || e.position, n = e.total; e.lengthComputable && (r = Math.ceil(a / n * 100)), t.uploadProgress(e, a, n, r) }, !1), r }), s.data = null; var c = s.beforeSend; return s.beforeSend = function (e, r) { r.data = t.formData ? t.formData : n, c && c.call(this, e, r) }, e.ajax(s) } function s(r) { function n(e) { var t = null; try { e.contentWindow && (t = e.contentWindow.document) } catch (r) { a("cannot get iframe.contentWindow document: " + r) } if (t) return t; try { t = e.contentDocument ? e.contentDocument : e.document } catch (r) { a("cannot get iframe.contentDocument: " + r), t = e.document } return t } function o() { function t() { try { var e = n(g).readyState; a("state = " + e), e && "uninitialized" == e.toLowerCase() && setTimeout(t, 50) } catch (r) { a("Server abort: ", r, " (", r.name, ")"), s(k), j && clearTimeout(j), j = void 0 } } var r = f.attr2("target"), i = f.attr2("action"), o = "multipart/form-data", c = f.attr("enctype") || f.attr("encoding") || o; w.setAttribute("target", p), (!u || /post/i.test(u)) && w.setAttribute("method", "POST"), i != m.url && w.setAttribute("action", m.url), m.skipEncodingOverride || u && !/post/i.test(u) || f.attr({ encoding: "multipart/form-data", enctype: "multipart/form-data" }), m.timeout && (j = setTimeout(function () { T = !0, s(D) }, m.timeout)); var l = []; try { if (m.extraData) for (var d in m.extraData) m.extraData.hasOwnProperty(d) && l.push(e.isPlainObject(m.extraData[d]) && m.extraData[d].hasOwnProperty("name") && m.extraData[d].hasOwnProperty("value") ? e('<input type="hidden" name="' + m.extraData[d].name + '">').val(m.extraData[d].value).appendTo(w)[0] : e('<input type="hidden" name="' + d + '">').val(m.extraData[d]).appendTo(w)[0]); m.iframeTarget || v.appendTo("body"), g.attachEvent ? g.attachEvent("onload", s) : g.addEventListener("load", s, !1), setTimeout(t, 15); try { w.submit() } catch (h) { var x = document.createElement("form").submit; x.apply(w) } } finally { w.setAttribute("action", i), w.setAttribute("enctype", c), r ? w.setAttribute("target", r) : f.removeAttr("target"), e(l).remove() } } function s(t) { if (!x.aborted && !F) { if (M = n(g), M || (a("cannot access response document"), t = k), t === D && x) return x.abort("timeout"), void S.reject(x, "timeout"); if (t == k && x) return x.abort("server abort"), void S.reject(x, "error", "server abort"); if (M && M.location.href != m.iframeSrc || T) { g.detachEvent ? g.detachEvent("onload", s) : g.removeEventListener("load", s, !1); var r, i = "success"; try { if (T) throw "timeout"; var o = "xml" == m.dataType || M.XMLDocument || e.isXMLDoc(M); if (a("isXml=" + o), !o && window.opera && (null === M.body || !M.body.innerHTML) && --O) return a("requeing onLoad callback, DOM not available"), void setTimeout(s, 250); var u = M.body ? M.body : M.documentElement; x.responseText = u ? u.innerHTML : null, x.responseXML = M.XMLDocument ? M.XMLDocument : M, o && (m.dataType = "xml"), x.getResponseHeader = function (e) { var t = { "content-type": m.dataType }; return t[e.toLowerCase()] }, u && (x.status = Number(u.getAttribute("status")) || x.status, x.statusText = u.getAttribute("statusText") || x.statusText); var c = (m.dataType || "").toLowerCase(), l = /(json|script|text)/.test(c); if (l || m.textarea) { var f = M.getElementsByTagName("textarea")[0]; if (f) x.responseText = f.value, x.status = Number(f.getAttribute("status")) || x.status, x.statusText = f.getAttribute("statusText") || x.statusText; else if (l) { var p = M.getElementsByTagName("pre")[0], h = M.getElementsByTagName("body")[0]; p ? x.responseText = p.textContent ? p.textContent : p.innerText : h && (x.responseText = h.textContent ? h.textContent : h.innerText) } } else "xml" == c && !x.responseXML && x.responseText && (x.responseXML = X(x.responseText)); try { E = _(x, c, m) } catch (y) { i = "parsererror", x.error = r = y || i } } catch (y) { a("error caught: ", y), i = "error", x.error = r = y || i } x.aborted && (a("upload aborted"), i = null), x.status && (i = x.status >= 200 && x.status < 300 || 304 === x.status ? "success" : "error"), "success" === i ? (m.success && m.success.call(m.context, E, "success", x), S.resolve(x.responseText, "success", x), d && e.event.trigger("ajaxSuccess", [x, m])) : i && (void 0 === r && (r = x.statusText), m.error && m.error.call(m.context, x, i, r), S.reject(x, "error", r), d && e.event.trigger("ajaxError", [x, m, r])), d && e.event.trigger("ajaxComplete", [x, m]), d && !--e.active && e.event.trigger("ajaxStop"), m.complete && m.complete.call(m.context, x, i), F = !0, m.timeout && clearTimeout(j), setTimeout(function () { m.iframeTarget ? v.attr("src", m.iframeSrc) : v.remove(), x.responseXML = null }, 100) } } } var c, l, m, d, p, v, g, x, y, b, T, j, w = f[0], S = e.Deferred(); if (S.abort = function (e) { x.abort(e) }, r) for (l = 0; l < h.length; l++)c = e(h[l]), i ? c.prop("disabled", !1) : c.removeAttr("disabled"); if (m = e.extend(!0, {}, e.ajaxSettings, t), m.context = m.context || m, p = "jqFormIO" + (new Date).getTime(), m.iframeTarget ? (v = e(m.iframeTarget), b = v.attr2("name"), b ? p = b : v.attr2("name", p)) : (v = e('<iframe name="' + p + '" src="' + m.iframeSrc + '" />'), v.css({ position: "absolute", top: "-1000px", left: "-1000px" })), g = v[0], x = { aborted: 0, responseText: null, responseXML: null, status: 0, statusText: "n/a", getAllResponseHeaders: function () { }, getResponseHeader: function () { }, setRequestHeader: function () { }, abort: function (t) { var r = "timeout" === t ? "timeout" : "aborted"; a("aborting upload... " + r), this.aborted = 1; try { g.contentWindow.document.execCommand && g.contentWindow.document.execCommand("Stop") } catch (n) { } v.attr("src", m.iframeSrc), x.error = r, m.error && m.error.call(m.context, x, r, t), d && e.event.trigger("ajaxError", [x, m, r]), m.complete && m.complete.call(m.context, x, r) } }, d = m.global, d && 0 === e.active++ && e.event.trigger("ajaxStart"), d && e.event.trigger("ajaxSend", [x, m]), m.beforeSend && m.beforeSend.call(m.context, x, m) === !1) return m.global && e.active--, S.reject(), S; if (x.aborted) return S.reject(), S; y = w.clk, y && (b = y.name, b && !y.disabled && (m.extraData = m.extraData || {}, m.extraData[b] = y.value, "image" == y.type && (m.extraData[b + ".x"] = w.clk_x, m.extraData[b + ".y"] = w.clk_y))); var D = 1, k = 2, A = e("meta[name=csrf-token]").attr("content"), L = e("meta[name=csrf-param]").attr("content"); L && A && (m.extraData = m.extraData || {}, m.extraData[L] = A), m.forceSync ? o() : setTimeout(o, 10); var E, M, F, O = 50, X = e.parseXML || function (e, t) { return window.ActiveXObject ? (t = new ActiveXObject("Microsoft.XMLDOM"), t.async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" != t.documentElement.nodeName ? t : null }, C = e.parseJSON || function (e) { return window.eval("(" + e + ")") }, _ = function (t, r, a) { var n = t.getResponseHeader("content-type") || "", i = "xml" === r || !r && n.indexOf("xml") >= 0, o = i ? t.responseXML : t.responseText; return i && "parsererror" === o.documentElement.nodeName && e.error && e.error("parsererror"), a && a.dataFilter && (o = a.dataFilter(o, r)), "string" == typeof o && ("json" === r || !r && n.indexOf("json") >= 0 ? o = C(o) : ("script" === r || !r && n.indexOf("javascript") >= 0) && e.globalEval(o)), o }; return S } if (!this.length) return a("ajaxSubmit: skipping submit process - no element selected"), this; var u, c, l, f = this; "function" == typeof t ? t = { success: t } : void 0 === t && (t = {}), u = t.type || this.attr2("method"), c = t.url || this.attr2("action"), l = "string" == typeof c ? e.trim(c) : "", l = l || window.location.href || "", l && (l = (l.match(/^([^#]+)/) || [])[1]), t = e.extend(!0, { url: l, success: e.ajaxSettings.success, type: u || e.ajaxSettings.type, iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank" }, t); var m = {}; if (this.trigger("form-pre-serialize", [this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this; if (t.beforeSerialize && t.beforeSerialize(this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSerialize callback"), this; var d = t.traditional; void 0 === d && (d = e.ajaxSettings.traditional); var p, h = [], v = this.formToArray(t.semantic, h); if (t.data && (t.extraData = t.data, p = e.param(t.data, d)), t.beforeSubmit && t.beforeSubmit(v, this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSubmit callback"), this; if (this.trigger("form-submit-validate", [v, this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this; var g = e.param(v, d); p && (g = g ? g + "&" + p : p), "GET" == t.type.toUpperCase() ? (t.url += (t.url.indexOf("?") >= 0 ? "&" : "?") + g, t.data = null) : t.data = g; var x = []; if (t.resetForm && x.push(function () { f.resetForm() }), t.clearForm && x.push(function () { f.clearForm(t.includeHidden) }), !t.dataType && t.target) { var y = t.success || function () { }; x.push(function (r) { var a = t.replaceTarget ? "replaceWith" : "html"; e(t.target)[a](r).each(y, arguments) }) } else t.success && x.push(t.success); if (t.success = function (e, r, a) { for (var n = t.context || this, i = 0, o = x.length; o > i; i++)x[i].apply(n, [e, r, a || f, f]) }, t.error) { var b = t.error; t.error = function (e, r, a) { var n = t.context || this; b.apply(n, [e, r, a, f]) } } if (t.complete) { var T = t.complete; t.complete = function (e, r) { var a = t.context || this; T.apply(a, [e, r, f]) } } var j = e("input[type=file]:enabled", this).filter(function () { return "" !== e(this).val() }), w = j.length > 0, S = "multipart/form-data", D = f.attr("enctype") == S || f.attr("encoding") == S, k = n.fileapi && n.formdata; a("fileAPI :" + k); var A, L = (w || D) && !k; t.iframe !== !1 && (t.iframe || L) ? t.closeKeepAlive ? e.get(t.closeKeepAlive, function () { A = s(v) }) : A = s(v) : A = (w || D) && k ? o(v) : e.ajax(t), f.removeData("jqxhr").data("jqxhr", A); for (var E = 0; E < h.length; E++)h[E] = null; return this.trigger("form-submit-notify", [this, t]), this }, e.fn.ajaxForm = function (n) { if (n = n || {}, n.delegation = n.delegation && e.isFunction(e.fn.on), !n.delegation && 0 === this.length) { var i = { s: this.selector, c: this.context }; return !e.isReady && i.s ? (a("DOM not ready, queuing ajaxForm"), e(function () { e(i.s, i.c).ajaxForm(n) }), this) : (a("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)")), this) } return n.delegation ? (e(document).off("submit.form-plugin", this.selector, t).off("click.form-plugin", this.selector, r).on("submit.form-plugin", this.selector, n, t).on("click.form-plugin", this.selector, n, r), this) : this.ajaxFormUnbind().bind("submit.form-plugin", n, t).bind("click.form-plugin", n, r) }, e.fn.ajaxFormUnbind = function () { return this.unbind("submit.form-plugin click.form-plugin") }, e.fn.formToArray = function (t, r) { var a = []; if (0 === this.length) return a; var i, o = this[0], s = this.attr("id"), u = t ? o.getElementsByTagName("*") : o.elements; if (u && !/MSIE [678]/.test(navigator.userAgent) && (u = e(u).get()), s && (i = e(':input[form="' + s + '"]').get(), i.length && (u = (u || []).concat(i))), !u || !u.length) return a; var c, l, f, m, d, p, h; for (c = 0, p = u.length; p > c; c++)if (d = u[c], f = d.name, f && !d.disabled) if (t && o.clk && "image" == d.type) o.clk == d && (a.push({ name: f, value: e(d).val(), type: d.type }), a.push({ name: f + ".x", value: o.clk_x }, { name: f + ".y", value: o.clk_y })); else if (m = e.fieldValue(d, !0), m && m.constructor == Array) for (r && r.push(d), l = 0, h = m.length; h > l; l++)a.push({ name: f, value: m[l] }); else if (n.fileapi && "file" == d.type) { r && r.push(d); var v = d.files; if (v.length) for (l = 0; l < v.length; l++)a.push({ name: f, value: v[l], type: d.type }); else a.push({ name: f, value: "", type: d.type }) } else null !== m && "undefined" != typeof m && (r && r.push(d), a.push({ name: f, value: m, type: d.type, required: d.required })); if (!t && o.clk) { var g = e(o.clk), x = g[0]; f = x.name, f && !x.disabled && "image" == x.type && (a.push({ name: f, value: g.val() }), a.push({ name: f + ".x", value: o.clk_x }, { name: f + ".y", value: o.clk_y })) } return a }, e.fn.formSerialize = function (t) { return e.param(this.formToArray(t)) }, e.fn.fieldSerialize = function (t) { var r = []; return this.each(function () { var a = this.name; if (a) { var n = e.fieldValue(this, t); if (n && n.constructor == Array) for (var i = 0, o = n.length; o > i; i++)r.push({ name: a, value: n[i] }); else null !== n && "undefined" != typeof n && r.push({ name: this.name, value: n }) } }), e.param(r) }, e.fn.fieldValue = function (t) { for (var r = [], a = 0, n = this.length; n > a; a++) { var i = this[a], o = e.fieldValue(i, t); null === o || "undefined" == typeof o || o.constructor == Array && !o.length || (o.constructor == Array ? e.merge(r, o) : r.push(o)) } return r }, e.fieldValue = function (t, r) { var a = t.name, n = t.type, i = t.tagName.toLowerCase(); if (void 0 === r && (r = !0), r && (!a || t.disabled || "reset" == n || "button" == n || ("checkbox" == n || "radio" == n) && !t.checked || ("submit" == n || "image" == n) && t.form && t.form.clk != t || "select" == i && -1 == t.selectedIndex)) return null; if ("select" == i) { var o = t.selectedIndex; if (0 > o) return null; for (var s = [], u = t.options, c = "select-one" == n, l = c ? o + 1 : u.length, f = c ? o : 0; l > f; f++) { var m = u[f]; if (m.selected) { var d = m.value; if (d || (d = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), c) return d; s.push(d) } } return s } return e(t).val() }, e.fn.clearForm = function (t) { return this.each(function () { e("input,select,textarea", this).clearFields(t) }) }, e.fn.clearFields = e.fn.clearInputs = function (t) { var r = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; return this.each(function () { var a = this.type, n = this.tagName.toLowerCase(); r.test(a) || "textarea" == n ? this.value = "" : "checkbox" == a || "radio" == a ? this.checked = !1 : "select" == n ? this.selectedIndex = -1 : "file" == a ? /MSIE/.test(navigator.userAgent) ? e(this).replaceWith(e(this).clone(!0)) : e(this).val("") : t && (t === !0 && /hidden/.test(a) || "string" == typeof t && e(this).is(t)) && (this.value = "") }) }, e.fn.resetForm = function () { return this.each(function () { ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset() }) }, e.fn.enable = function (e) { return void 0 === e && (e = !0), this.each(function () { this.disabled = !e }) }, e.fn.selected = function (t) { return void 0 === t && (t = !0), this.each(function () { var r = this.type; if ("checkbox" == r || "radio" == r) this.checked = t; else if ("option" == this.tagName.toLowerCase()) { var a = e(this).parent("select"); t && a[0] && "select-one" == a[0].type && a.find("option").selected(!1), this.selected = t } }) }, e.fn.ajaxSubmit.debug = !1 });

CoreJs = {};

CoreJs.apply = function (o, c, defaults) {
    // no "this" reference for friendly out of scope calls
    if (defaults) {
        CoreJs.CoreJs(o, defaults);
    }
    if (o && c && typeof c == 'object') {
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
};

(function () {

    var toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function (r) {
            return r.test(ua);
        },
        DOC = document,
        docMode = DOC.documentMode,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && (check(/msie 7/) || docMode == 7),
        isIE8 = isIE && (check(/msie 8/) && docMode != 7),
        isIE9 = isIE && check(/msie 9/),
        isIE6 = isIE && !isIE7 && !isIE8 && !isIE9,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol),
        noArgs = [],
        nonEnumerables = [],
        emptyFn = CoreJs.emptyFn,
        t = CoreJs.apply({}, {
            constructor: emptyFn,
            toString: emptyFn,
            valueOf: emptyFn
        }),
        callOverrideParent = function () {
            var method = callOverrideParent.caller.caller; // skip callParent (our caller)
            return method.$owner.prototype[method.$name].apply(this, arguments);
        };

    function Base() {
        //
    }

    CoreJs.apply(Base, {
        $isClass: true,

        callParent: function (args) {
            var method;

            // This code is intentionally inlined for the least number of debugger stepping
            return (method = this.callParent.caller) && (method.$previous ||
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name])).apply(this, args || noArgs);
        }
    });

    Base.prototype = {
        constructor: function () {
        },
        callParent: function (args) {
            // NOTE: this code is deliberately as few expressions (and no function calls)
            // as possible so that a debugger can skip over this noise with the minimum number
            // of steps. Basically, just hit Step Into until you are where you really wanted
            // to be.
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]));

            return superMethod.apply(this, args || noArgs);
        }
    };

    CoreJs.apply(Base, {
        $isClass: true,

        callParent: function (args) {
            var method;

            // This code is intentionally inlined for the least number of debugger stepping
            return (method = this.callParent.caller) && (method.$previous ||
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name])).apply(this, args || noArgs);
        }
    });

    Base.prototype = {
        constructor: function () {
        },
        callParent: function (args) {
            // NOTE: this code is deliberately as few expressions (and no function calls)
            // as possible so that a debugger can skip over this noise with the minimum number
            // of steps. Basically, just hit Step Into until you are where you really wanted
            // to be.
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]));

            return superMethod.apply(this, args || noArgs);
        }
    };

    CoreJs.apply(CoreJs, {
        isNumber: function (v) {
            return typeof v === 'number' && isFinite(v);
        },
        isString: function (v) {
            return typeof v === 'string';
        },
        isBoolean: function (v) {
            return typeof v === 'boolean';
        },
        isPrimitive: function (v) {
            return CoreJs.isString(v) || CoreJs.isNumber(v) || CoreJs.isBoolean(v);
        },
        isArray: function (v) {
            return toString.apply(v) === '[object Array]';
        },
        isObject: function (v) {
            return !!v && Object.prototype.toString.call(v) === '[object Object]';
        },
        isEmpty: function (v, allowBlank) {
            return v === null || v === undefined || ((CoreJs.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },
        isIterable: function (v) {
            //check for array or arguments
            if (CoreJs.isArray(v) || v.callee) {
                return true;
            }
            //check for node list type
            if (/NodeList|HTMLCollection/.test(toString.call(v))) {
                return true;
            }
            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((typeof v.nextNode != 'undefined' || v.item) && CoreJs.isNumber(v.length));
        },
        isDefined: function (v) {
            return typeof v !== 'undefined';
        },
        value: function (v, defaultValue, allowBlank) {
            return CoreJs.isEmpty(v, allowBlank) ? defaultValue : v;
        },
        applyIf: function (o, c) {
            if (o) {
                for (var p in c) {
                    if (!CoreJs.isDefined(o[p])) {
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        each: function (array, fn, scope) {
            if (CoreJs.isEmpty(array, true)) {
                return;
            }
            if (!CoreJs.isIterable(array) || CoreJs.isPrimitive(array)) {
                array = [array];
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                };
            }
        },

        iterate: function (obj, fn, scope) {
            if (CoreJs.isEmpty(obj)) {
                return;
            }
            if (CoreJs.isIterable(obj)) {
                CoreJs.each(obj, fn, scope);
                return;
            } else if (typeof obj == 'object') {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (fn.call(scope || obj, prop, obj[prop], obj) === false) {
                            return;
                        };
                    }
                }
            }
        },

        addMembers: function (cls, target, members, handleNonEnumerables) {
            var i, name, member;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function') {
                        member.$owner = cls;
                        member.$name = name;
                    }

                    target[name] = member;
                }
            }

            if (handleNonEnumerables && nonEnumerables) {
                for (i = nonEnumerables.length; i-- > 0;) {
                    name = nonEnumerables[i];
                    if (members.hasOwnProperty(name)) {
                        member = members[name];
                        if (typeof member == 'function') {
                            member.$owner = cls;
                            member.$name = name;
                        }

                        target[name] = member;
                    }
                }
            }
        },

        extend: function () {
            // inline overrides
            var io = function (o) {
                for (var m in o) {
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function (sb, sp, overrides) {
                if (typeof sp == 'object') {
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function () { sp.apply(this, arguments); };
                }
                var F = function () { },
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor = sb;
                sb.superclass = spp;
                if (spp.constructor == oc) {
                    spp.constructor = sp;
                }
                sb.override = function (o) {
                    CoreJs.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function () {
                    return spp;
                });
                sbp.override = io;
                CoreJs.override(sb, overrides);
                sb.extend = function (o) { return CoreJs.extend(sb, o); };
                return sb;
            };
        }(),

        override: function (target, overrides) {
            var proto, statics;

            if (overrides) {
                if (target.$isClass) {
                    statics = overrides.statics;
                    if (statics) {
                        delete overrides.statics;
                    }

                    CoreJs.addMembers(target, target.prototype, overrides, true);
                    if (statics) {
                        CoreJs.addMembers(target, target, statics);
                    }
                } else if (typeof target == 'function') {
                    proto = target.prototype;
                    CoreJs.apply(proto, overrides);
                    if (CoreJs.isIE && overrides.hasOwnProperty('toString')) {
                        proto.toString = overrides.toString;
                    }
                } else {
                    var owner = target.self,
                        name, value;

                    if (owner && owner.$isClass) {
                        for (name in overrides) {
                            if (overrides.hasOwnProperty(name)) {
                                value = overrides[name];

                                if (typeof value == 'function') {
                                    //<debug>
                                    if (owner.$className) {
                                        value.displayName = owner.$className + '#' + name;
                                    }
                                    //</debug>

                                    value.$name = name;
                                    value.$owner = owner;
                                    value.$previous = target.hasOwnProperty(name)
                                        ? target[name] // already hooked, so call previous hook
                                        : callOverrideParent; // calls by name on prototype
                                }

                                target[name] = value;
                            }
                        }
                    } else {
                        CoreJs.apply(target, overrides);

                        if (!target.constructor.$isClass) {
                            target.constructor.prototype.callParent = Base.prototype.callParent;
                            target.constructor.callParent = Base.callParent;
                        }
                    }
                }
            }
        },

        formatNumber: function (nStr, decimals, __decimalSeparator, __thousandsSeparator) {
            if (!__decimalSeparator)
                __decimalSeparator = '.';

            if (!__thousandsSeparator)
                __thousandsSeparator = ',';

            if (!nStr && nStr !== 0)
                nStr = 0;

            nStr = parseFloat(nStr);

            nStr = nStr.toFixed(decimals);

            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? __decimalSeparator + x[1] : '';

            if (x1.length > 3) {
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + __thousandsSeparator + '$2');
                }
            }

            if (x2.length > 3) {
                var rgx = /(\d{3})(\d+)/;
                while (rgx.test(x2)) {
                    x2 = x2.replace(rgx, '$1' + __thousandsSeparator + '$2');
                }
            }

            return x1 + x2;
        },

        /**
        * Parses the "text" and creates HTML links if necessary. Uses "linkText" for link names if it's supplied.
        * 
        * @param text
        * @param linkText
        */
        linkify: function (text, linkText) {
            // http://, https://, ftp://
            var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

            // www. sans http:// or https://
            var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

            // Email addresses
            var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

            return text
                .replace(urlPattern, '<a href="$&">' + (linkText ? linkText : '$&') + '</a>')
                .replace(pseudoUrlPattern, '$1<a href="http://$2">' + (linkText ? linkText : '$2') + '</a>')
                .replace(emailAddressPattern, '<a href="mailto:$&">' + (linkText ? linkText : '$&') + '</a>');
        }
    });

})();

CoreJs.Observable = function () {
    var me = this, e = me.events;
    if (me.listeners) {
        me.on(me.listeners);
        delete me.listeners;
    }
    me.events = e || {};
};

var TRUE = true,
    FALSE = false
    ;

CoreJs.Observable.prototype = {
    fireEvent: function () {
        var a = Array.prototype.slice.call(arguments, 0),
            ename = a[0].toLowerCase(),
            me = this;

        arguments[0] = this;

        if (this.listeners && this.listeners[ename] && this.listeners[ename].fn) {
            this.listeners[ename].fn.apply(this.listeners[ename].scope || this, Array.prototype.slice.call(arguments, 0));
            //this.listeners[ename].fn.call( this.listeners[ename].scope || this, this, Array.prototype.slice.call(arguments, 1) );
        }

    }
};

CoreJs.Grid = function (config) {
    config = config || {};
    if (config.initialConfig) {
        if (config.isAction) {           // actions
            this.baseAction = config;
        }
        config = config.initialConfig; // component cloning / action set up
    } else if (config.tagName || config.dom || CoreJs.isString(config)) { // element object
        config = { applyTo: config, id: config.id || config };
    }

    /**
     * This Component's initial configuration specification. Read-only.
     * @type Object
     * @property initialConfig
     */
    this.initialConfig = config;

    CoreJs.apply(this, config);

    this.initComponent();

    if (this.renderTo)
        this.render(this.renderTo);
};

/**
* Basic Remote Grid (supports: remote loading, sorting, pagination, custom columns)
* 
* Usage example:
new CoreJs.Grid({
    renderTo: 'grid',
    autoLoad: true,
    url: processURL + '?task=loadData',
    columns: [
        { header: '#', index: 'id', width: 50 },
        { header: 'Name', index: 'name' },
        { header: 'Email', index: 'email' },
        { header: '', sortable: false, type: 'action', buttons: [
            { text: 'Add', handler: function(cmp, rIndex, cIndex, data ){
                console.log( cmp, rIndex, cIndex, data );
                
            } },
            { text: 'Edit' }
        ] }
    ],
    sort: {
        sort: 'id',
        dir: 'ASC'
    },
    pageSize: 3,
    listeners: {
        load: {
            fn: function( cmp, data ){
                
            }
        }
    }
});
*/
CoreJs.extend(CoreJs.Grid, CoreJs.Observable, {
    renderTo: null, // the element ID where the grid will be rendered to
    autoLoad: true, // trigger the data loading instantly

    url: null, // remote url where data is loaded from
    data: null, // the row data - is populated after the data is loaded from the URL
    columns: null, // column configuration
    baseParams: {},

    cls: '', // extra table class
    enablePagination: true, // enable pagination
    enableLoading: true, // enable loading message
    enableFilter: true, // enable filter
    enableCachePrevention: true, // enable cache prevention by adding a timestamp to all ajax calls
    enableDownload: false, // enable download button

    filterParam: 'q', // filter param will be sent to the server
    filterPlaceholder: typeof gridFilterPlaceholder !== 'undefined' ? gridFilterPlaceholder : 'Keyword', // filter placeholder
    textPage: typeof gridTextPage !== 'undefined' ? gridTextPage : 'Page',
    textFilter: typeof gridTextFilter !== 'undefined' ? gridTextFilter : 'Search',
    textFilterBtn: typeof gridTextFilterBtn !== 'undefined' ? gridTextFilterBtn : 'Go',
    textFilterBtnReset: typeof gridTextFilterBtnReset !== 'undefined' ? gridTextFilterBtnReset : 'Reset Filters',
    textNoData: typeof gridTextNoData !== 'undefined' ? gridTextNoData : 'No data found',
    textYes: typeof gridTextYes !== 'undefined' ? gridTextYes : 'Yes',
    textNo: typeof gridTextNo !== 'undefined' ? gridTextNo : 'No',
    textFrom: typeof gridTextFrom !== 'undefined' ? gridTextFrom : 'from',
    textDownloadBtn: typeof gridTextDownloadBtn !== 'undefined' ? gridTextDownloadBtn : 'Download',

    pageSize: 20,
    dataTotalParam: 'total', // total property of the json response
    dataResultsParam: 'results', // results property for the json response

    initComponent: function () {

    },

    /**
    * Renders the dom
    * 
    * @param container
    */
    render: function (container) {
        this.container = document.getElementById(container);
        if (!this.container)
            return;

        this.el = document.createElement('div');
        this.el.className = 'g-grid' + (this.cls && this.cls.length ? ' ' + this.cls : '');
        //this.el.innerHTML = '22';

        this.container.appendChild(this.el);

        if (this.enableLoading) {
            this.loading = document.createElement('div');
            this.loading.className = 'hide g-loading';
            this.el.appendChild(this.loading);
        }

        if (this.enableDownload) {
            this.download = document.createElement('div');
            this.download.innerHTML = '<a href="#" class="btn btn-success btn-sm g-btn-download" style="margin-left: 5px;"><div class="glyphicon glyphicon-save"></div>&nbsp;' + this.textDownloadBtn + '</a><div class="g-clearfix"></div>';
            this.el.appendChild(this.download);

            var me = this;
            $(this.el).find('.g-btn-download').click(function (event) {
                event.preventDefault();
                me.doDownload();
            });
        }

        if (this.enableFilter) {
            this.filter = document.createElement('form');
            this.filter.className = 'g-filter';
            this.filter.method = 'post';
            this.filter.innerHTML =
                '<div class="clearfix g-filter-item g-filter-item-text">' +
                '<label class="filter-label">' + this.textFilter + '</label>' +
                '<input type="text" class="form-control input-sm filter-input g-input-filter" name="' + this.filterParam + '" placeholder="' + this.filterPlaceholder + '">' +
                '</div>'
                ;

            CoreJs.each(this.columns, function (col) {
                // boolean filter
                if (col.filter && (col.filter == 'boolean' || col.filter == 'checkbox' || col.filter == 'select')) { // boolean filter
                    var filterIndex = col.filterIndex ? col.filterIndex : col.index,
                        inputName = col.filter == 'select' ? filterIndex : filterIndex + '[]',
                        filterDefaultOpt = col.filterOpt,
                        filterDefaultValue = col.filterVal,
                        fltrHtml = ''
                        ;

                    if (col.filter == 'boolean') {
                        filterDefaultOpt = [
                            { name: this.textYes, value: 1 },
                            { name: this.textNo, value: 0 }
                        ];
                        filterDefaultValue = col.filterVal ? col.filterVal : [0, 1];
                    }

                    // set base params as default checked
                    this.setBaseParam(inputName, filterDefaultValue);

                    if (filterDefaultValue)
                        this.setBaseParam(filterIndex + '_filter', 1);

                    fltrHtml +=
                        '<div class="clearfix g-filter-item g-filter-item-' + col.filter + '">' +
                        '<label class="filter-label">' + col.header + '</label>';

                    if (col.filter == 'select') {
                        fltrHtml += '<select class="form-control input-sm filter-input" name="' + inputName + '">';
                        CoreJs.each(filterDefaultOpt, function (opt) {
                            fltrHtml +=
                                '<option value="' + opt.value + '" ' + (filterDefaultValue && $.inArray(opt.value, filterDefaultValue) != -1 ? 'selected' : '') + '> ' + opt.name + '</option>';
                            ;
                        }, this);
                        fltrHtml += '</select>';
                    } else {
                        fltrHtml += '<div class="filter-input">';
                        CoreJs.each(filterDefaultOpt, function (opt) {
                            fltrHtml +=
                                '<label class="checkbox-inline">' +
                                '<input type="checkbox" name="' + inputName + '" value="' + opt.value + '" ' + (filterDefaultValue && $.inArray(opt.value, filterDefaultValue) != -1 ? 'checked' : '') + '> ' + opt.name +
                                '</label>';
                        }, this);
                        fltrHtml += '</div>';
                    }

                    fltrHtml +=
                        '</div>'
                        ;

                    this.filter.innerHTML += fltrHtml;
                }
            }, this);

            this.filter.innerHTML +=
                '<div class="g-filter-btns">' +
                '<a href="#" class="btn btn-primary btn-sm g-btn-filter" style="margin-left: 5px;">' + this.textFilterBtn + '</a>' +
                '<a href="#" class="btn btn-default btn-sm g-btn-filter-reset" style="margin-left: 5px;">' + this.textFilterBtnReset + '</a>' +
                '<div class="g-clearfix"></div>' +
                '</div>' +

                '<div class="g-clearfix"></div>';

            this.el.appendChild(this.filter);
        }

        this.buildTable();

        return this;
    },

    /**
    * Show loading
    * 
    */
    mask: function () {
        if (this.loading)
            this.loading.className = this.loading.className.replace('hide', '');
    },

    /**
    * Hide loading mask
    * 
    */
    unmask: function () {
        if (this.loading)
            this.loading.className = this.loading.className.replace('hide', '') + ' hide';
    },

    /**
    * Builds the table
    * 
    */
    buildTable: function () {
        var thead = tbody = tfoot = '';

        CoreJs.each(this.columns, function (col) {
            var val = col.header,
                cls = '', extra = '';

            if (col.width)
                extra += ' width="' + col.width + '"';

            if (this.sort && col.sortable !== false) {
                cls += 'g-sort';
                val += '&nbsp;<div class="glyphicon glyphicon-chevron-' + (this.sort.dir.toUpperCase() == 'DESC' ? 'down' : 'up') + '"></div>';
                extra += ' index="' + col.index + '"';

                if (this.sort.sort == col.index) {
                    cls += ' g-sorted';
                }
            }
            thead += '<th class="' + cls + '" ' + extra + ' style="' + (col.align ? 'text-align:' + col.align : '') + '">' + val + '</th>';
        }, this);

        var th = $('<thead><tr>' + thead + '</tr></thead>').get(0);
        var tb = document.createElement('tbody');
        var tf = document.createElement('tfoot');

        this.table = document.createElement('table');
        this.table.className = 'table table-striped table-condensed g-table';

        this.table.appendChild(th);
        this.table.appendChild(tb);
        this.table.appendChild(tf);

        this.el.appendChild(this.table);

        var me = this;

        // sort trigger
        if (this.sort) {
            $(this.el).find('.g-sort').click(function (event) {
                event.preventDefault();
                var el = $(this),
                    glyph = el.find('.glyphicon'),
                    dir = '';

                if (el.hasClass('g-sorted') && glyph.hasClass('glyphicon-chevron-up')) {
                    dir = 'DESC';
                } else {
                    dir = 'ASC';
                }

                me.doSort(el.attr('index'), dir);
            });
        }

        // trigger filter
        if (this.enableFilter) {
            // filter form should not be submitted
            $(this.el).find('.g-filter').submit(function (event) {
                event.preventDefault();
            });

            // filter button pressed
            $(this.el).find('.g-btn-filter').click(function (event) {
                event.preventDefault();
                //var val = $(me.el).find('[name="' + me.filterParam + '"]').val();

                // reset checkbox base param
                var input = $(me.el).find('.g-filter input[type="checkbox"]').toArray();
                CoreJs.each(input, function (item) {
                    me.unsetBaseParam($(item).attr('name'));
                }, this);

                var val2 = $(me.el).find('.g-filter').serializeArray();

                var val = {};
                CoreJs.each(val2, function (item) {
                    if (!val[item.name])
                        val[item.name] = item.value;
                    else {
                        if (!CoreJs.isArray(val[item.name])) {
                            var v = val[item.name];
                            val[item.name] = [];
                            val[item.name].push(v);
                        }
                        val[item.name].push(item.value);
                    }
                }, this);

                me.doFilter(val);
            });

            // trigger filter on enter key
            $(this.el).find('.g-input-filter').keyup(function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    $(me.el).find('.g-btn-filter').trigger('click');
                }
            });

            // reset form
            $(this.el).find('.g-btn-filter-reset').click(function (event) {
                event.preventDefault();

                $(me.el).find('.g-filter')[0].reset();
                $(me.el).find('.g-btn-filter').trigger('click');
            });
        }

        if (this.autoLoad)
            this.loadData();
    },

    buildParams: function (extraParams) {
        var me = this,
            params = {
                url: me.url
            };

        if (this.baseParams)
            CoreJs.apply(params, this.baseParams);
        if (this.sort)
            CoreJs.apply(params, this.sort);
        if (extraParams)
            CoreJs.apply(params, extraParams);

        if (this.pageSize) {
            params['limit'] = this.pageSize;
            params['start'] = this.start ? this.start : 0;
        }

        return params;
    },

    /**
    * Loads data from server & generates rows
    * 
    */
    loadData: function () {
        var me = this,
            params = this.buildParams()
            ;

        me.mask();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: me.url + ((me.enableCachePrevention && me.url.indexOf('?') == -1) ? '?' : '&') + '_tt=' + (new Date().getTime()),
            data: params
        }).done(function (data) {
            me.unmask();

            var ok = data ? !CoreJs.isEmpty(data[me.dataResultsParam]) : false;

            if (ok) {
                me.data = data;

                var tbody = tfoot = tr = val = '', k = 0;

                if (!me.data[me.dataResultsParam].length) {
                    tbody = '<tr><td colspan="' + me.columns.length + '"><div class="alert alert-warning alert-medium g-alert">' + me.textNoData + '</div></td></tr>';
                }

                CoreJs.each(me.data[me.dataResultsParam], function (row) {
                    tr = '';
                    var i = 0, v, vv, t;
                    CoreJs.each(me.columns, function (col) {
                        if (col.type == 'action') {
                            val = '', j = 0;
                            if (col.buttons) {
                                CoreJs.each(col.buttons, function (btn) {
                                    t = btn.text;

                                    if (btn.rendererTitle) {
                                        t = btn.rendererTitle(me, k, i, row);
                                        if (t === false) t = '&nbsp;';
                                    }

                                    vv = '&nbsp;<a href="#" row="' + k + '" col="' + i + '" btn="' + j + '" class="btn btn-default btn-xs g-btn ' + (btn.cls ? btn.cls : '') + '">' + t + '</a>';

                                    if (btn.renderer) {
                                        v = btn.renderer(me, k, i, row);
                                        if (v === false)
                                            val += '';
                                        else if (typeof v == 'string')
                                            val += v;
                                        else
                                            val += vv;
                                    } else {
                                        val += vv;
                                    }

                                    j++;
                                }, this);
                            }
                        } else {
                            if (col.renderer) {
                                v = col.renderer(me, k, i, row, row[col.index]);
                                if (v === false)
                                    val = '';
                                else
                                    val = v;
                            } else {
                                val = CoreJs.value(row[col.index], '');
                            }
                        }
                        tr += '<td style="' + (col.align ? 'text-align:' + col.align : '') + '">' + val + '</td>';
                        i++;
                    });
                    tbody += '<tr>' + tr + '</tr>';
                    k++;
                });
            } else {
                var tbody = '<tr><td colspan="' + me.columns.length + '"><div class="alert alert-warning alert-medium g-alert">' + me.textNoData + '</div></td></tr>';
            }

            //me.table.getElementsByTagName('tbody')[0].innerHTML = tbody;
            $(me.table).find('tbody').html(tbody);

            // pagination
            if (me.enablePagination) {
                var nrTotalPages = ok ? (Math.ceil(me.data[me.dataTotalParam] / me.pageSize) || 1) : 1,
                    selectedPageNr = me.start ? (me.start / me.pageSize) : 0;
                selectedPageNr++;

                tfoot = '';
                for (var i = 1; i <= nrTotalPages; i++) {
                    tfoot += '<option value="' + i + '" ' + (i == selectedPageNr ? 'selected' : '') + '>' + i + '</option>';
                }
                tfoot =
                    '<tr>' +
                    '<td colspan="' + me.columns.length + '" style="padding-bottom: 0;">' +
                    '<label style="float: left; margin: 5px 5px 0 0;">' + me.textPage + '</label>' +
                    '<select class="form-control input-sm g-page" style="float: left; width: auto; height: 30px; line-height: 30px; margin-right: 5px;">' + tfoot + '</select>' +
                    '<a href="#" class="btn btn-default btn-sm g-btn-reload" style="float: left;"><div class="glyphicon glyphicon-refresh"></div></a>' +
                    '<label style="float: left; margin: 5px 5px 0 5px;">' + me.textFrom + ' ' + nrTotalPages + '</label>' +
                    '</td>' +
                    '</tr>';

                //me.table.getElementsByTagName('tfoot')[0].innerHTML = tfoot;
                $(me.table).find('tfoot').html(tfoot);

                // pagination trigger
                $(me.table).find('.g-page').change(function () {
                    me.start = me.pageSize * ($(this).val() - 1);
                    me.loadData();
                });

                $(me.table).find('.g-btn-reload').click(function (event) {
                    event.preventDefault();
                    me.loadData();
                });
            }

            // row buttons trigger
            $(me.table).find('.g-btn').click(function (event) {
                event.preventDefault();
                var fn,
                    rIndex = parseInt($(this).attr('row')),
                    cIndex = parseInt($(this).attr('col')),
                    bIndex = parseInt($(this).attr('btn')),
                    col,
                    rowData = null;

                if (typeof cIndex == 'number' && typeof bIndex == 'number') {
                    col = me.columns[cIndex]['buttons'][bIndex];
                    rowData = me.data[me.dataResultsParam][rIndex];
                    if (col && col.handler) {
                        col.handler.call(col.scope || me, me, rIndex, cIndex, rowData);
                    }
                }
            });

            me.fireEvent('load', ok ? me.data[me.dataResultsParam] : null);
        })
            .error(function (data) {
                me.unmask();
                var tbody = '<tr><td colspan="' + me.columns.length + '"><div class="alert alert-warning alert-medium g-alert">' + me.textNoData + '</div></td></tr>';
                $(me.table).find('tbody').html(tbody);
                me.fireEvent('load', null);
            });
    },

    /**
    * Sorts by field & direction (ASC/DESC)
    * 
    * @param field
    * @param dir
    */
    doSort: function (field, dir) {
        var colData,
            dir = dir ? dir.toUpperCase() : 'ASC';

        CoreJs.each(this.columns, function (col) {
            if (col.index == field) {
                colData = col;
                return false;
            }
        }, this);

        if (!colData)
            return;

        var el = $(this.el).find('.g-sort[index="' + field + '"]'),
            glyph = el.find('.glyphicon')
            ;

        if (dir == 'DESC')
            glyph.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        else
            glyph.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');

        $(this.table).find('.g-sort').removeClass('g-sorted');
        el.addClass('g-sorted');

        this.sort.sort = field;
        this.sort.dir = dir;
        this.loadData();
    },

    /**
    * Filter by value
    * 
    * @param q
    */
    doFilter: function (q) {
        if (CoreJs.isObject(q)) {
            CoreJs.iterate(q, function (k, v) {
                this.setBaseParam(k, v);
            }, this);
        } else {
            if (this.filter)
                $(this.el).find('[name="' + this.filterParam + '"]').val(q);

            this.setBaseParam(this.filterParam, q);
        }

        this.loadData();
        this.fireEvent('filter', q, this.data ? this.data[this.dataResultsParam] : null);
    },

    doDownload: function () {
        var me = this,
            params = this.buildParams({ download: true })
            ;

        me.mask();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: me.url + ((me.enableCachePrevention && me.url.indexOf('?') == -1) ? '?' : '&') + '_tt=' + (new Date().getTime()),
            data: params
        }).done(function (data) {
            me.unmask();
            me.fireEvent('download', data);
            if (data.success && data.fileUrl && data.fileUrl.length)
                window.open(data.fileUrl, '_blank');
        }).error(function (data) {
            me.unmask();
            me.fireEvent('download', null);
        });
    },

    setBaseParam: function (paramName, paramValue) {
        this.baseParams[paramName] = paramValue;
    },
    unsetBaseParam: function (paramName) {
        delete this.baseParams[paramName];
    }

});


////////////////////////////////////////////////////////////////////

function date(format, timestamp) {
    //  discuss at: http://phpjs.org/functions/date/
    // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // original by: gettimeofday
    //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: MeEtc (http://yass.meetcweb.com)
    // improved by: Brad Touesnard
    // improved by: Tim Wiel
    // improved by: Bryan Elliott
    // improved by: David Randall
    // improved by: Theriault
    // improved by: Theriault
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault
    // improved by: Thomas Beaucourt (http://www.webapp.fr)
    // improved by: JT
    // improved by: Theriault
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // improved by: Theriault
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: majak
    //    input by: Alex
    //    input by: Martin
    //    input by: Alex Wilson
    //    input by: Haravikk
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: majak
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
    // bugfixed by: Chris (http://www.devotis.nl/)
    //        note: Uses global: php_js to store the default timezone
    //        note: Although the function potentially allows timezone info (see notes), it currently does not set
    //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
    //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
    //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
    //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
    //   returns 1: '09:09:40 m is month'
    //   example 2: date('F j, Y, g:i a', 1062462400);
    //   returns 2: 'September 2, 2003, 2:26 am'
    //   example 3: date('Y W o', 1062462400);
    //   returns 3: '2003 36 2003'
    //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
    //   example 4: (x+'').length == 10 // 2009 01 09
    //   returns 4: true
    //   example 5: date('W', 1104534000);
    //   returns 5: '53'
    //   example 6: date('B t', 1104534000);
    //   returns 6: '999 31'
    //   example 7: date('W U', 1293750000.82); // 2010-12-31
    //   returns 7: '52 1293750000'
    //   example 8: date('W', 1293836400); // 2011-01-01
    //   returns 8: '52'
    //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    //   returns 9: '52 2011-01-02'

    var that = this;
    var jsdate, f;
    // Keep this here (works, but for code commented-out below for file size reasons)
    // var tal= [];
    var txt_words = [
        'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // trailing backslash -> (dropped)
    // a backslash followed by any character (including backslash) -> the character
    // empty string -> empty string
    var formatChr = /\\?(.?)/gi;
    var formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    var _pad = function (n, c) {
        n = String(n);
        while (n.length < c) {
            n = '0' + n;
        }
        return n;
    };
    f = {
        // Day
        d: function () {
            // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () {
            // Shorthand day name; Mon...Sun
            return f.l()
                .slice(0, 3);
        },
        j: function () {
            // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () {
            // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () {
            // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () {
            // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            var i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                i = 0;
            }
            return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w: function () {
            // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () {
            // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j());
            var b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },

        // Week
        W: function () {
            // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
            var b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F: function () {
            // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () {
            // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () {
            // Shorthand month name; Jan...Dec
            return f.F()
                .slice(0, 3);
        },
        n: function () {
            // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () {
            // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0))
                .getDate();
        },

        // Year
        L: function () {
            // Is leap year?; 0 or 1
            var j = f.Y();
            return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o: function () {
            // ISO-8601 year
            var n = f.n();
            var W = f.W();
            var Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function () {
            // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () {
            // Last two digits of year; 00...99
            return f.Y()
                .toString()
                .slice(-2);
        },

        // Time
        a: function () {
            // am or pm
            return jsdate.getHours() > 11 ? 'pm' : 'am';
        },
        A: function () {
            // AM or PM
            return f.a()
                .toUpperCase();
        },
        B: function () {
            // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2;
            // Hours
            var i = jsdate.getUTCMinutes() * 60;
            // Minutes
            // Seconds
            var s = jsdate.getUTCSeconds();
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () {
            // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () {
            // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () {
            // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () {
            // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () {
            // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () {
            // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () {
            // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function () {
            // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            /*              return that.date_default_timezone_get();
             */
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () {
            // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0);
            // Jan 1
            var c = Date.UTC(f.Y(), 0);
            // Jan 1 UTC
            var b = new Date(f.Y(), 6);
            // Jul 1
            // Jul 1 UTC
            var d = Date.UTC(f.Y(), 6);
            return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O: function () {
            // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset();
            var a = Math.abs(tzo);
            return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () {
            // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ':' + O.substr(3, 2));
        },
        T: function () {
            // Timezone abbreviation; e.g. EST, MDT, ...
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list() function.
            /*              var abbr, i, os, _default;
            if (!tal.length) {
              tal = that.timezone_abbreviations_list();
            }
            if (that.php_js && that.php_js.default_timezone) {
              _default = that.php_js.default_timezone;
              for (abbr in tal) {
                for (i = 0; i < tal[abbr].length; i++) {
                  if (tal[abbr][i].timezone_id === _default) {
                    return abbr.toUpperCase();
                  }
                }
              }
            }
            for (abbr in tal) {
              for (i = 0; i < tal[abbr].length; i++) {
                os = -jsdate.getTimezoneOffset() * 60;
                if (tal[abbr][i].offset === os) {
                  return abbr.toUpperCase();
                }
              }
            }
            */
            return 'UTC';
        },
        Z: function () {
            // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function () {
            // ISO-8601 date.
            return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () {
            // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () {
            // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = (timestamp === undefined ? new Date() : // Not provided
            (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}

function strtotime(text, now) {
    //  discuss at: http://phpjs.org/functions/strtotime/
    //     version: 1109.2016
    // original by: Caio Ariede (http://caioariede.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Caio Ariede (http://caioariede.com)
    // improved by: A. Matías Quezada (http://amatiasq.com)
    // improved by: preuter
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Mirko Faber
    //    input by: David
    // bugfixed by: Wagner B. Soares
    // bugfixed by: Artur Tchernychev
    // bugfixed by: Stephan Bösch-Plepelits (http://github.com/plepe)
    //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    //   example 1: strtotime('+1 day', 1129633200);
    //   returns 1: 1129719600
    //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    //   returns 2: 1130425202
    //   example 3: strtotime('last month', 1129633200);
    //   returns 3: 1127041200
    //   example 4: strtotime('2009-05-04 08:30:00 GMT');
    //   returns 4: 1241425800
    //   example 5: strtotime('2009-05-04 08:30:00+00');
    //   returns 5: 1241425800
    //   example 6: strtotime('2009-05-04 08:30:00+02:00');
    //   returns 6: 1241418600
    //   example 7: strtotime('2009-05-04T08:30:00Z');
    //   returns 7: 1241425800

    var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

    if (!text) {
        return fail;
    }

    // Unecessary spaces
    text = text.replace(/^\s+|\s+$/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/[\t\r\n]/g, '')
        .toLowerCase();

    // in contrast to php, js Date.parse function interprets:
    // dates given as yyyy-mm-dd as in timezone: UTC,
    // dates with "." or "-" as MDY instead of DMY
    // dates with two-digit years differently
    // etc...etc...
    // ...therefore we manually parse lots of common date formats
    match = text.match(
        /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

    if (match && match[2] === match[4]) {
        if (match[1] > 1901) {
            switch (match[2]) {
                case '-': {
                    // YYYY-M-D
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // YYYY.M.D is not parsed by strtotime()
                    return fail;
                }
                case '/': {
                    // YYYY/M/D
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
            }
        } else if (match[5] > 1901) {
            switch (match[2]) {
                case '-': {
                    // D-M-YYYY
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // D.M.YYYY
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '/': {
                    // M/D/YYYY
                    if (match[1] > 12 || match[3] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
            }
        } else {
            switch (match[2]) {
                case '-': {
                    // YY-M-D
                    if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                        return fail;
                    }

                    year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                    return new Date(year, parseInt(match[3], 10) - 1, match[5],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // D.M.YY or H.MM.SS
                    if (match[5] >= 70) {
                        // D.M.YY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    if (match[5] < 60 && !match[6]) {
                        // H.MM.SS
                        if (match[1] > 23 || match[3] > 59) {
                            return fail;
                        }

                        today = new Date();
                        return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
                    }

                    // invalid format, cannot be parsed
                    return fail;
                }
                case '/': {
                    // M/D/YY
                    if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                        return fail;
                    }

                    year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                    return new Date(year, parseInt(match[1], 10) - 1, match[3],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case ':': {
                    // HH:MM:SS
                    if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                        return fail;
                    }

                    today = new Date();
                    return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                        match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
                }
            }
        }
    }

    // other formats and "now" should be parsed by Date.parse()
    if (text === 'now') {
        return now === null || isNaN(now) ? new Date()
            .getTime() / 1000 | 0 : now | 0;
    }
    if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000 | 0;
    }
    // Browsers != Chrome have problems parsing ISO 8601 date strings, as they do
    // not accept lower case characters, space, or shortened time zones.
    // Therefore, fix these problems and try again.
    // Examples:
    //   2015-04-15 20:33:59+02
    //   2015-04-15 20:33:59z
    //   2015-04-15t20:33:59+02:00
    if (match = text.match(
        /^([0-9]{4}-[0-9]{2}-[0-9]{2})[ t]([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?)([\+-][0-9]{2}(:[0-9]{2})?|z)/)) {
        // fix time zone information
        if (match[4] == 'z') {
            match[4] = 'Z';
        } else if (match[4].match(/^([\+-][0-9]{2})$/)) {
            match[4] = match[4] + ':00';
        }

        if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
            return parsed / 1000 | 0;
        }
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    ranges = {
        'yea': 'FullYear',
        'mon': 'Month',
        'day': 'Date',
        'hou': 'Hours',
        'min': 'Minutes',
        'sec': 'Seconds'
    };

    function lastNext(type, range, modifier) {
        var diff, day = days[range];

        if (typeof day !== 'undefined') {
            diff = day - date.getDay();

            if (diff === 0) {
                diff = 7 * modifier;
            } else if (diff > 0 && type === 'last') {
                diff -= 7;
            } else if (diff < 0 && type === 'next') {
                diff += 7;
            }

            date.setDate(date.getDate() + diff);
        }
    }

    function process(val) {
        var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
            type = splt[0],
            range = splt[1].substring(0, 3),
            typeIsNumber = /\d+/.test(type),
            ago = splt[2] === 'ago',
            num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

        if (typeIsNumber) {
            num *= parseInt(type, 10);
        }

        if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
            return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
        }

        if (range === 'wee') {
            return date.setDate(date.getDate() + (num * 7));
        }

        if (type === 'next' || type === 'last') {
            lastNext(type, range, num);
        } else if (!typeIsNumber) {
            return false;
        }

        return true;
    }

    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
        '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
        '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

    match = text.match(new RegExp(regex, 'gi'));
    if (!match) {
        return fail;
    }

    for (i = 0, len = match.length; i < len; i++) {
        if (!process(match[i])) {
            return fail;
        }
    }

    // ECMAScript 5 only
    // if (!match.every(process))
    //    return false;

    return (date.getTime() / 1000);
}

////////////////////////////////////////////////////////////////////

// handle ajax form submit
$(document).on('submit', '.core-js-form-ajax', function (e) {
    e.preventDefault();

    var me = $(this),
        formResetOnSuccess = false,
        message = me.find('.message'), // get message tag
        loading = me.find('.loading'), // get loading tag
        errorFieldGroup,
        errorField
        ;

    // reset errors if they were set before (from a previous form submit)
    if (loading) loading.show(); // show loading
    message.empty().hide(); // reset main message
    me.find('.form-group').removeClass('has-error'); // remove error class from field group
    me.find('.field-error').empty().hide(); // remove individual errors

    // set it to the server
    //$.ajax({
    me.ajaxSubmit({
        url: me.attr('form_url'), // set url to the block url
        data: me.serializeArray(), // set params from form
        type: 'POST', // send params as POST params
        dataType: 'json', // identify server response as json
        success: function (response) {
            if (!response) return;

            // close window on success
            if (response.success && parseInt(me.attr('form_submit_close'))) {
                me.closest('.ui-dialog-content').dialog('close');
                return;
            }

            // disable loading
            if (loading) loading.hide();

            // if it's successfull
            if (response.success) {
                // set the main message
                if (response.message && response.message.length)
                    message.removeClass('alert-danger').addClass('alert-success').html(response.message).show();

                // reset the form fields to the initial values
                if (formResetOnSuccess)
                    me.resetForm();
            } else { // we have errors => we need to display them
                // set the main message
                if (response.message && response.message.length)
                    message.removeClass('alert-success').addClass('alert-danger').html(response.message).show();

                // set individual errors
                if (response.errors) {

                    // loop through errors and set them
                    $.each(response.errors, function (k, v) {
                        // find the input group -> find the input name then move to the parent tag that has the class "form-group"
                        errorFieldGroup = me.find('[name="' + k + '"]').closest('.form-group');

                        // get the error block where we will actually display the individual field errors
                        errorField = errorFieldGroup.find('.field-error');

                        if (errorFieldGroup) // mark group as error (will change the style of the input in red, add red borders)
                            errorFieldGroup.addClass('has-error');

                        if (errorField) // set errors (they come in an array because they might be more than one for the same field)
                            errorField.html('- ' + v.join('<br />- ')).show();
                    });
                }
            }

            if (response.record) {
                //record
                $.each(response.record, function (k, v) {
                    me.find('[name="' + k + '"]').val(v);
                });
            }

            if (response.success && me.attr('form_success') && window[me.attr('form_success')]) {
                window[me.attr('form_success')](me, response);
            } else if (!response.success && me.attr('form_fail') && window[me.attr('form_fail')]) {
                window[me.attr('form_fail')](me, response);
            }
        },
        error: function (response) {
            // disable loading
            if (loading) loading.hide();

            if (me.attr('form_error') && window[me.attr('form_error')]) {
                window[me.attr('form_error')](me, response);
            }
        }

        // always return false to stop the normal form submition which would otherwise reload the page
        //return false;
    });
});

// trigger form submit
$(document).on('click', '[form_submit]:not(form)', function (e) {
    e.preventDefault();
    var me = $(this),
        form = $('#' + me.attr('form_submit'))
        ;

    if (form && form.length) {
        form.attr('form_submit_close', 0);
        form.submit();
    }
});

// trigger form submit & close
$(document).on('click', '[form_submit_close]:not(form)', function (e) {
    e.preventDefault();
    var me = $(this),
        form = $('#' + me.attr('form_submit_close'))
        ;

    if (form && form.length) {
        form.attr('form_submit_close', 1);
        form.submit();
    }
});

