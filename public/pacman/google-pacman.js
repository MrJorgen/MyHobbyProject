(function () {
    var aa = Date.now || function () {
        return +new Date
    }
        ;
    var ba = {}
        , ca = {
            lb: 0,
            nb: 1,
            pb: 2,
            kb: 3,
            mb: 4,
            ob: 5,
            jb: 6
        };
    ba.Xa = null;
    var da = []
        , ea = {}
        , fa = 0
        , ga = null
        , ha = null
        , f = !1
        , g = function (a, b) {
            return a.buttons[b] && .5 < a.buttons[b]
        }
        , k = function (a, b, c) {
            return "undefined" == typeof a.axes[b] ? !1 : c ? -.75 > a.axes[b] : .75 < a.axes[b]
        }
        , ja = function (a) {
            ba.Xa = a.gamepad;
            f || (f = !0,
                ia())
        }
        , ka = function () {
            delete ba.Xa;
            f = !1
        }
        , ia = function () {
            var a;
            if (ba.Xa)
                a = ba.Xa;
            else {
                var b = navigator.getGamepads && navigator.getGamepads() || navigator.webkitGetGamepads && navigator.webkitGetGamepads() || navigator.webkitGamepads;
                a = b && (b[3] || b[2] || b[1] || b[0]) || null
            }
            if (a && (!a.timestamp || a.timestamp != fa)) {
                fa = a.timestamp;
                b = [];
                b[0] = g(a, 14) || k(a, 0, !0) || k(a, 2, !0);
                b[1] = g(a, 15) || k(a, 0, !1) || k(a, 2, !1);
                b[2] = g(a, 12) || k(a, 1, !0) || k(a, 3, !0);
                b[3] = g(a, 13) || k(a, 1, !1) || k(a, 3, !1);
                b[4] = g(a, 0) || g(a, 4) || g(a, 6) || g(a, 8) || g(a, 9) || g(a, 10);
                b[5] = g(a, 1) || g(a, 5) || g(a, 7) || g(a, 11);
                b[6] = g(a, 2) || g(a, 3);
                if (da.length)
                    for (var c in ca) {
                        a = ca[c];
                        var d = b[a];
                        if ("undefined" != typeof d && d != da[a] && ea[a]) {
                            ha && ha();
                            var e = document.createEvent("Event");
                            e.initEvent(d ? "keydown" : "keyup", !0, !0);
                            e.keyCode = ea[a];
                            ga.dispatchEvent(e)
                        }
                    }
                da = b
            }
            f && (window.requestAnimationFrame ? window.requestAnimationFrame(ia) : window.oRequestAnimationFrame ? window.oRequestAnimationFrame(ia) : window.mozRequestAnimationFrame ? window.mozRequestAnimationFrame(ia) : window.msRequestAnimationFrame ? window.msRequestAnimationFrame(ia) : window.webkitRequestAnimationFrame && window.webkitRequestAnimationFrame(ia))
        };
    var la = function () {
        this.N = this.N;
        this.wa = this.wa
    };
    la.prototype.N = !1;
    la.prototype.$a = function () {
        this.N || (this.N = !0,
            this.Ha())
    }
        ;
    la.prototype.Ha = function () {
        if (this.wa)
            for (; this.wa.length;)
                this.wa.shift()()
    }
        ;
    var oa = function (a) {
        var b = new Image
            , c = ma
            , d = "";
        b.onerror = b.onload = b.onabort = function () {
            delete na[c]
        }
            ;
        na[c] = b;
        -1 != a.search("&ei=") || (d = "&ei=");
        a = "/gen_204?atyp=i&ct=doodle&cad=" + a + d + "&zx=" + aa();
        /^http:/i.test(a) && "https:" == window.location.protocol ? delete na[c] : (b.src = a,
            ma = c + 1)
    }
        , na = []
        , ma = 0;
    var pa, qa = navigator.userAgent, ra = -1 != qa.indexOf("iPad") || -1 != qa.indexOf("iPhone") || -1 != qa.indexOf("iPod") || -1 != qa.indexOf("Android") || -1 != qa.indexOf("Mobile") || -1 != qa.indexOf("Silk"), sa = ["", "moz", "ms", "o", "webkit"], ta = function (a) {
        var b = document;
        if (!b)
            return null;
        for (var c = 0; c < sa.length; c++) {
            var d = sa[c]
                , e = a;
            0 < d.length && (e = a.charAt(0).toUpperCase() + a.substr(1));
            d += e;
            if ("undefined" != typeof b[d])
                return d
        }
        return null
    }, ua = function () {
        for (var a = ["requestAnimationFrame", "mozRequestAnimationFrame", "msRequestAnimationFrame", "oRequestAnimationFrame", "webkitRequestAnimationFrame"], b = 0; b < a.length; b++) {
            var c = window[a[b]];
            if (c)
                return function (a, b, d) {
                    return c(function (b) {
                        return a.call(d, b)
                    }, b)
                }
        }
        var d = 0
            , e = 33
            , h = 50;
        return function (a, b, c) {
            b && 0 > --h && (1.25 < b / e ? (d = 0,
                e = Math.min(66, ++e)) : 10 < ++d && (d = 0,
                    e = Math.max(17, --e)));
            window.setTimeout(function (b) {
                a.call(c, b)
            }, e)
        }
    }, va = function (a, b, c) {
        va = ua();
        return va(a, b, c)
    };
    var za = function (a, b, c) {
        la.call(this);
        this.Oa = a;
        this.Ua = b;
        this.Wa = c;
        this.ra = this.pa = this.Ia = !1;
        this.La = aa();
        this.Va = ta("hidden");
        if ((this.Ca = (this.Ka = ta("visibilityState")) ? this.Ka.replace(/state$/i, "change").toLowerCase() : null) && document.addEventListener) {
            var d = this;
            this.Pa = function () {
                var a = document[d.Ka];
                d.Ia = document[d.Va] || "hidden" == a;
                d.Ia ? wa(d) : xa(d)
            }
                ;
            document.addEventListener(this.Ca, this.Pa, !1)
        }
        ya(this)
    };
    (function () {
        function a() { }
        a.prototype = la.prototype;
        za.N = la.prototype;
        za.prototype = new a;
        za.pa = function (a, c, d) {
            for (var e = Array(arguments.length - 2), h = 2; h < arguments.length; h++)
                e[h - 2] = arguments[h];
            return la.prototype[c].apply(a, e)
        }
    }
    )();
    za.prototype.Ha = function () {
        window.clearTimeout(this.ya);
        this.Ca && document.removeEventListener && document.removeEventListener(this.Ca, this.Pa, !1);
        za.N.Ha.call(this)
    }
        ;
    var wa = function (a) {
        var b = a.Ia || a.pa;
        a.ra && !b ? (a.ra = !1,
            a.Wa(),
            ya(a)) : !a.ra && b && (a.ra = !0,
                a.Ua())
    }
        , ya = function (a) {
            a.ya && window.clearTimeout(a.ya);
            var b = Math.max(100, a.Oa - Aa(a));
            a.ya = window.setTimeout(function () {
                a.ya = null;
                a.pa = Aa(a) >= a.Oa;
                a.pa || ya(a);
                wa(a)
            }, b)
        }
        , Aa = function (a) {
            return aa() - a.La
        }
        , xa = function (a) {
            a.La = aa();
            a.pa = !1;
            wa(a)
        };
    google.doodle || (google.doodle = {});
    var l, m, Ba, Ca, n, Da, q, r, Ea, t, Fa, v, w, Ga, Ha, Ia, x, Ja, Ka, y, z, A, La, Ma, B, C, Na, Oa, Pa, Qa, Ra, Sa, D, Ta, Ua, Va, Wa, Xa, Ya, E, F, Za, $a, ab, bb, cb, db, eb, fb, G, gb, hb, ib, jb, kb, lb, mb, nb, ob, pb, qb, rb, sb, tb, ub, vb, wb, H, I, xb, J, L, yb, zb, Ab, Cb, Db, M, Eb, Fb, Gb, Hb, Ib, Jb, Kb, Lb, Mb, N, O, Nb = [1, 4, 2, 8], P = {
        0: {
            axis: 0,
            ta: 0
        },
        1: {
            axis: 0,
            ta: -1
        },
        2: {
            axis: 0,
            ta: 1
        },
        4: {
            axis: 1,
            ta: -1
        },
        8: {
            axis: 1,
            ta: 1
        }
    }, Ob = [0, 7, 17, 32], Pb = [{
        x: 5,
        y: 1,
        I: 56
    }, {
        x: 5,
        y: 4,
        I: 5
    }, {
        x: 5,
        y: 1,
        h: 4
    }, {
        x: 9,
        y: 1,
        h: 12
    }, {
        x: 5,
        y: 12,
        h: 4
    }, {
        x: 10,
        y: 12,
        h: 4
    }, {
        x: 5,
        y: 15,
        I: 16
    }, {
        x: 5,
        y: 12,
        I: 31
    }, {
        x: 60,
        y: 1,
        h: 4
    }, {
        x: 54,
        y: 1,
        h: 4
    }, {
        x: 19,
        y: 1,
        h: 12
    }, {
        x: 19,
        y: 4,
        I: 26
    }, {
        x: 13,
        y: 5,
        I: 7
    }, {
        x: 13,
        y: 5,
        h: 4
    }, {
        x: 13,
        y: 8,
        I: 3
    }, {
        x: 56,
        y: 4,
        h: 9
    }, {
        x: 48,
        y: 4,
        I: 13
    }, {
        x: 48,
        y: 1,
        h: 12
    }, {
        x: 60,
        y: 12,
        h: 4
    }, {
        x: 44,
        y: 15,
        I: 17
    }, {
        x: 54,
        y: 12,
        h: 4
    }, {
        x: 44,
        y: 12,
        I: 17
    }, {
        x: 44,
        y: 1,
        h: 15
    }, {
        x: 41,
        y: 13,
        I: 4
    }, {
        x: 41,
        y: 13,
        h: 3
    }, {
        x: 38,
        y: 13,
        h: 3
    }, {
        x: 38,
        y: 15,
        I: 4
    }, {
        x: 35,
        y: 10,
        I: 10
    }, {
        x: 35,
        y: 1,
        h: 15
    }, {
        x: 35,
        y: 13,
        I: 4
    }, {
        x: 21,
        y: 12,
        h: 4
    }, {
        x: 24,
        y: 12,
        h: 4
    }, {
        x: 24,
        y: 15,
        I: 12
    }, {
        x: 27,
        y: 4,
        h: 9
    }, {
        x: 52,
        y: 9,
        I: 5
    }, {
        x: 56,
        y: 8,
        I: 10,
        type: 1
    }, {
        x: 1,
        y: 8,
        I: 9,
        type: 1
    }], Q = [{
        x: 1,
        y: 8,
        I: 8
    }, {
        x: 57,
        y: 8,
        I: 9
    }, {
        x: 44,
        y: 2,
        h: 10
    }, {
        x: 35,
        y: 5,
        h: 7
    }, {
        x: 36,
        y: 4,
        I: 8
    }, {
        x: 36,
        y: 10,
        I: 8
    }, {
        x: 39,
        y: 15,
        I: 2
    }], Qb = [{
        x: 5,
        y: 15
    }, {
        x: 5,
        y: 3
    }, {
        x: 15,
        y: 8
    }, {
        x: 60,
        y: 3
    }, {
        x: 60,
        y: 15
    }], R = [{
        x: 2,
        y: 8
    }, {
        x: 63,
        y: 8
    }], Rb = {
        1: [{
            x: 39.5,
            y: 15,
            dir: 4
        }, {
            x: 39.5,
            y: 4,
            dir: 4,
            Fa: 57,
            Ga: -4
        }, {
            x: 39.5,
            y: 7,
            dir: 2,
            Fa: 0,
            Ga: -4
        }, {
            x: 37.625,
            y: 7,
            dir: 1,
            Fa: 57,
            Ga: 20
        }, {
            x: 41.375,
            y: 7,
            dir: 1,
            Fa: 0,
            Ga: 20
        }],
        2: [{
            x: 40.25,
            y: 15,
            dir: 8
        }, {
            x: 38.75,
            y: 15,
            dir: 4
        }, {
            x: 39.5,
            y: 4,
            dir: 4,
            Fa: 57,
            Ga: -4
        }, {
            x: 39.5,
            y: 7,
            dir: 2,
            Fa: 0,
            Ga: -4
        }, {
            x: 37.625,
            y: 7,
            dir: 1,
            Fa: 57,
            Ga: 20
        }, {
            x: 41.375,
            y: 7,
            dir: 1,
            Fa: 0,
            Ga: 20
        }]
    }, Sb = [32, 312], Tb = [80, 312], Ub = {
        0: .16,
        1: .23,
        2: 1,
        3: 1,
        4: 2.23,
        5: .3,
        6: 1.9,
        7: 2.23,
        8: 1.9,
        9: 5,
        10: 1.9,
        11: 1.18,
        12: .3,
        13: .5,
        14: 1.9,
        15: 9,
        16: 10,
        17: .26
    }, S = .8 * .4, T = [{}, {
        R: .75,
        S: .4,
        oa: .8,
        O: .71,
        ma: .5,
        na: .9,
        W: .79,
        V: 20,
        ia: .8,
        $: 10,
        ja: .85,
        K: 6,
        ka: 5,
        M: 1,
        la: 100,
        P: [7, 20, 7, 20, 5, 20, 5, 1],
        T: 4,
        U: [0, 0, 30, 60]
    }, {
        R: .85,
        S: .45,
        oa: .9,
        O: .79,
        ma: .55,
        na: .95,
        W: .83,
        V: 30,
        ia: .9,
        $: 15,
        ja: .95,
        K: 5,
        ka: 5,
        M: 2,
        la: 300,
        P: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
        T: 4,
        U: [0, 0, 0, 50],
        Ma: 1
    }, {
        R: .85,
        S: .45,
        oa: .9,
        O: .79,
        ma: .55,
        na: .95,
        W: .83,
        V: 40,
        ia: .9,
        $: 20,
        ja: .95,
        K: 4,
        ka: 5,
        M: 3,
        la: 500,
        P: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
        T: 4,
        U: [0, 0, 0, 0]
    }, {
        R: .85,
        S: .45,
        oa: .9,
        O: .79,
        ma: .55,
        na: .95,
        W: .83,
        V: 40,
        ia: .9,
        $: 20,
        ja: .95,
        K: 3,
        ka: 5,
        M: 3,
        la: 500,
        P: [7, 20, 7, 20, 5, 1033, 1 / 60, 1],
        T: 4,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 40,
        ia: 1,
        $: 20,
        ja: 1.05,
        K: 2,
        ka: 5,
        M: 4,
        la: 700,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0],
        Ma: 2
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 50,
        ia: 1,
        $: 25,
        ja: 1.05,
        K: 5,
        ka: 5,
        M: 4,
        la: 700,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 50,
        ia: 1,
        $: 25,
        ja: 1.05,
        K: 2,
        ka: 5,
        M: 5,
        la: 1E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 50,
        ia: 1,
        $: 25,
        ja: 1.05,
        K: 2,
        ka: 5,
        M: 5,
        la: 1E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 60,
        ia: 1,
        $: 30,
        ja: 1.05,
        K: 1,
        ka: 3,
        M: 6,
        la: 2E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0],
        Ma: 3
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 60,
        ia: 1,
        $: 30,
        ja: 1.05,
        K: 5,
        ka: 5,
        M: 6,
        la: 2E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 60,
        ia: 1,
        $: 30,
        ja: 1.05,
        K: 2,
        ka: 5,
        M: 7,
        la: 3E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 80,
        ia: 1,
        $: 40,
        ja: 1.05,
        K: 1,
        ka: 3,
        M: 7,
        la: 3E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 80,
        ia: 1,
        $: 40,
        ja: 1.05,
        K: 1,
        ka: 3,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0],
        Ma: 3
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 80,
        ia: 1,
        $: 40,
        ja: 1.05,
        K: 3,
        ka: 5,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 100,
        ia: 1,
        $: 50,
        ja: 1.05,
        K: 1,
        ka: 3,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 100,
        ia: 1,
        $: 50,
        ja: 1.05,
        K: 1,
        ka: 3,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 100,
        ia: 1,
        $: 50,
        ja: 1.05,
        K: 0,
        ka: 0,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0],
        Ma: 3
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 100,
        ia: 1,
        $: 50,
        ja: 1.05,
        K: 1,
        ka: 3,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 120,
        ia: 1,
        $: 60,
        ja: 1.05,
        K: 0,
        ka: 0,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: 1,
        O: .87,
        ma: .6,
        na: 1,
        W: .87,
        V: 120,
        ia: 1,
        $: 60,
        ja: 1.05,
        K: 0,
        ka: 0,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }, {
        R: .95,
        S: .5,
        oa: .9,
        O: .79,
        ma: .75,
        na: .9,
        W: .79,
        V: 120,
        ia: 1,
        $: 60,
        ja: 1.05,
        K: 0,
        ka: 0,
        M: 8,
        la: 5E3,
        P: [5, 20, 5, 20, 5, 1037, 1 / 60, 1],
        T: 3,
        U: [0, 0, 0, 0]
    }], Vb = {
        1: [{
            x: 37.6,
            y: 7,
            dir: 1,
            J: 6.375,
            speed: .48
        }, {
            x: 37.6,
            y: 6.375,
            dir: 2,
            J: 7.625,
            speed: .48
        }, {
            x: 37.6,
            y: 7.625,
            dir: 1,
            J: 7,
            speed: .48
        }],
        2: [{
            x: 39.5,
            y: 7,
            dir: 2,
            J: 7.625,
            speed: .48
        }, {
            x: 39.5,
            y: 7.625,
            dir: 1,
            J: 6.375,
            speed: .48
        }, {
            x: 39.5,
            y: 6.375,
            dir: 2,
            J: 7,
            speed: .48
        }],
        3: [{
            x: 41.4,
            y: 7,
            dir: 1,
            J: 6.375,
            speed: .48
        }, {
            x: 41.4,
            y: 6.375,
            dir: 2,
            J: 7.625,
            speed: .48
        }, {
            x: 41.4,
            y: 7.625,
            dir: 1,
            J: 7,
            speed: .48
        }],
        4: [{
            x: 37.6,
            y: 7,
            dir: 8,
            J: 39.5,
            speed: S
        }, {
            x: 39.5,
            y: 7,
            dir: 1,
            J: 4,
            speed: S
        }],
        5: [{
            x: 39.5,
            y: 7,
            dir: 1,
            J: 4,
            speed: S
        }],
        6: [{
            x: 41.4,
            y: 7,
            dir: 4,
            J: 39.5,
            speed: S
        }, {
            x: 39.5,
            y: 7,
            dir: 1,
            J: 4,
            speed: S
        }],
        7: [{
            x: 39.5,
            y: 4,
            dir: 2,
            J: 7,
            speed: 1.6
        }, {
            x: 39.5,
            y: 7,
            dir: 4,
            J: 37.625,
            speed: 1.6
        }],
        8: [{
            x: 39.5,
            y: 4,
            dir: 2,
            J: 7,
            speed: 1.6
        }],
        9: [{
            x: 39.5,
            y: 4,
            dir: 2,
            J: 7,
            speed: 1.6
        }, {
            x: 39.5,
            y: 7,
            dir: 8,
            J: 41.375,
            speed: 1.6
        }],
        10: [{
            x: 37.6,
            y: 7,
            dir: 8,
            J: 39.5,
            speed: S
        }, {
            x: 39.5,
            y: 7,
            dir: 1,
            J: 4,
            speed: S
        }],
        11: [{
            x: 39.5,
            y: 7,
            dir: 1,
            J: 4,
            speed: S
        }],
        12: [{
            x: 41.4,
            y: 7,
            dir: 4,
            J: 39.5,
            speed: S
        }, {
            x: 39.5,
            y: 7,
            dir: 1,
            J: 4,
            speed: S
        }]
    }, Wb = {
        0: {
            Ja: [{
                v: !1,
                x: 26,
                y: 9,
                id: 1
            }, {
                v: !1,
                x: 28,
                y: 9,
                id: 2
            }, {
                v: !1,
                x: 30,
                y: 9,
                id: 3
            }, {
                v: !1,
                x: 32,
                y: 9,
                id: 4
            }, {
                v: !1,
                x: 34,
                y: 9,
                id: 5
            }, {
                v: !1,
                x: 36,
                y: 9,
                id: 6
            }, {
                v: !1,
                x: 38,
                y: 9,
                id: 7
            }, {
                v: !1,
                x: 40,
                y: 9,
                id: 8
            }, {
                v: !1,
                x: 42,
                y: 9,
                id: 9
            }, {
                v: !1,
                x: 44,
                y: 9,
                id: 10
            }, {
                v: !1,
                x: 46,
                y: 9,
                id: 11
            }, {
                v: !1,
                x: 24,
                y: 9,
                id: 0
            }, {
                v: !1,
                x: 27,
                y: 21,
                id: 12
            }, {
                v: !1,
                x: 26,
                y: 18,
                id: 13
            }],
            Sa: [{
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-dot"
                }, {
                    dir: 8,
                    speed: 1.6,
                    s: "pcm-bpcm"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-fing"
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 1,
                    speed: .8 * 3
                }, {
                    dir: 1,
                    speed: .8 * 3
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 1,
                    speed: .8 * 3
                }, {
                    dir: 1,
                    speed: .8 * 3
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 1,
                    speed: .8 * 3
                }, {
                    dir: 1,
                    speed: .8 * 3
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 1,
                    speed: .8 * 3
                }, {
                    dir: 1,
                    speed: .8 * 3
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 4,
                    speed: .8 * 3,
                    s: "pcm-swipe"
                }, {
                    dir: 4,
                    speed: .8 * 3
                }]
            }, {
                time: .1,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0,
                    s: "pcm-hidden"
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 8,
                    speed: 1.6
                }, {
                    dir: 4,
                    speed: .8 * 3
                }, {
                    dir: 4,
                    speed: .8 * 3
                }]
            }, {
                time: 1.5,
                L: [{
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 0,
                    speed: 0
                }, {
                    dir: 4,
                    speed: 1.6
                }, {
                    dir: 4,
                    speed: 3.2
                }, {
                    dir: 4,
                    speed: 3.2
                }]
            }]
        },
        1: {
            Ja: [{
                v: !1,
                x: 64,
                y: 9,
                id: 0
            }, {
                v: !0,
                x: 68.2,
                y: 9,
                id: 1
            }],
            Sa: [{
                time: 5.5,
                L: [{
                    dir: 4,
                    speed: .8 * 1.5
                }, {
                    dir: 4,
                    speed: .8 * 1.56
                }]
            }, {
                time: .1,
                L: [{
                    dir: 4,
                    speed: 32
                }, {
                    dir: 4,
                    speed: 0
                }]
            }, {
                time: 9,
                L: [{
                    dir: 8,
                    speed: .8 * 1.5,
                    s: "pcm-bpcm"
                }, {
                    dir: 8,
                    speed: .8,
                    mode: 4
                }]
            }]
        },
        2: {
            Ja: [{
                v: !0,
                x: 32,
                y: 9.5,
                id: 2
            }, {
                v: !1,
                x: 64,
                y: 9,
                id: 0
            }, {
                v: !0,
                x: 70.2,
                y: 9,
                id: 1
            }],
            Sa: [{
                time: 2.7,
                L: [{
                    dir: 0,
                    speed: 0,
                    s: "pcm-stck"
                }, {
                    dir: 4,
                    speed: .8 * 1.5
                }, {
                    dir: 4,
                    speed: .8 * 1.56
                }]
            }, {
                time: 1,
                L: [{
                    dir: 0,
                    speed: 0,
                    s: "pcm-stck"
                }, {
                    dir: 4,
                    speed: .8 * 1.5
                }, {
                    dir: 4,
                    speed: .1 * .8
                }]
            }, {
                time: 1.3,
                L: [{
                    dir: 0,
                    speed: 0,
                    s: "pcm-stck"
                }, {
                    dir: 4,
                    speed: .8 * 1.5
                }, {
                    dir: 4,
                    speed: 0
                }]
            }, {
                time: 1,
                L: [{
                    dir: 0,
                    speed: 0,
                    s: "pcm-stck"
                }, {
                    dir: 4,
                    speed: .8 * 1.5
                }, {
                    dir: 4,
                    speed: 0,
                    s: "pcm-ghfa"
                }]
            }, {
                time: 2.5,
                L: [{
                    dir: 0,
                    speed: 0,
                    s: "pcm-stck"
                }, {
                    dir: 4,
                    speed: .8 * 1.5
                }, {
                    dir: 4,
                    speed: 0,
                    s: "pcm-ghfa"
                }]
            }]
        },
        3: {
            Ja: [{
                v: !1,
                x: 64,
                y: 9,
                id: 0
            }, {
                v: !0,
                x: 70.2,
                y: 9,
                id: 2
            }],
            Sa: [{
                time: 5.3,
                L: [{
                    dir: 4,
                    speed: .8 * 1.5
                }, {
                    dir: 4,
                    speed: .8 * 1.56,
                    s: "pcm-ghin"
                }]
            }, {
                time: 5.3,
                L: [{
                    dir: 4,
                    speed: 0
                }, {
                    dir: 8,
                    speed: .8 * 1.56,
                    s: "pcm-gbug"
                }]
            }]
        }
    }, Xb = 1E3 / 90, Yb = function (a) {
        this.id = a;
        this.s = null
    }, Zb = function (a) {
        var b = 4
            , c = 4
            , d = 16
            , e = 16;
        if ("pcm-bpcm" == a.s)
            d = e = 32,
                b = c = 20;
        else if ("pcm-fing" == a.s)
            d = 32,
                e = 148;
        else if ("pcm-dot" == a.s)
            b = c = d = e = 8;
        else if ("pcm-swipe" == a.s)
            d = 88,
                e = 34,
                b = 0,
                c = 20;
        else if ("pcm-hidden" == a.s)
            return;
        var h = a.Va[1]
            , u = a.Va[0]
            , b = a.Pa[1] + 10 - b
            , c = a.Pa[0] + 40 - c;
        "pcm-bpcm" == a.s && 4 == a.dir ? (l.save(),
            l.translate(b + d / 2, c),
            l.scale(-1, 1),
            U(h, u, d, e, -d / 2, 0),
            l.restore()) : "pcm-swipe" == a.s ? (a = l.createLinearGradient(b, 0, b + d, 0),
                a.addColorStop(0, "rgba(104, 186, 253, 1)"),
                a.addColorStop(1, "rgba(104, 186, 253, 0)"),
                l.fillStyle = a,
                l.fillRect(b, c, d, e)) : U(h, u, d, e, b, c)
    }, W = function (a, b) {
        var c = a.mode;
        a.mode = b;
        a.id != m + 3 || 16 != b && 16 != c || $b();
        switch (c) {
            case 32:
                Ba = !1;
                break;
            case 8:
                0 < Ca && Ca-- ,
                    0 == Ca && V()
        }
        switch (b) {
            case 4:
                a.Ra = .8 * n.ma;
                a.Ta = .8 * n.S;
                a.ya = !1;
                break;
            case 1:
                a.Ra = .8 * n.R;
                a.Ta = .8 * n.S;
                a.ya = !1;
                break;
            case 2:
                a.pa = a.Ua;
                a.Ra = .8 * n.R;
                a.Ta = .8 * n.S;
                a.ya = !1;
                break;
            case 8:
                a.Ra = 1.6;
                a.Ta = 1.6;
                a.pa = [Sb[0], Sb[1]];
                a.ya = !1;
                a.Da = !1;
                break;
            case 16:
                ac(a);
                a.ya = !0;
                a.wa = -1;
                switch (a.id) {
                    case m + 1:
                        a.ra = 2;
                        break;
                    case m + 2:
                        a.ra = 1;
                        break;
                    case m + 3:
                        a.ra = 3
                }
                break;
            case 32:
                a.ya = !0;
                a.wa = -1;
                switch (a.id) {
                    case m + 1:
                        a.ra = 5;
                        break;
                    case m + 2:
                        a.ra = 4;
                        break;
                    case m + 3:
                        a.ra = 6
                }
                Ba = !0;
                break;
            case 64:
                a.ya = !0;
                a.wa = -1;
                switch (a.id) {
                    case m:
                    case m + 1:
                        a.ra = 8;
                        break;
                    case m + 2:
                        a.ra = 7;
                        break;
                    case m + 3:
                        a.ra = 9
                }
                break;
            case 128:
                switch (a.ya = !0,
                a.wa = -1,
                a.id) {
                    case m:
                    case m + 1:
                        a.ra = 11;
                        break;
                    case m + 2:
                        a.ra = 10;
                        break;
                    case m + 3:
                        a.ra = 12
                }
        }
        bc(a)
    }, ac = function (a) {
        a.id >= m && (a.Wa = Math.floor(cc() * m))
    }, ec = function (a, b) {
        var c = a.w
            , d = P[a.dir]
            , e = [c[0], c[1]];
        e[d.axis] += 8 * d.ta;
        var h = r[e[0]][e[1]];
        b && !h.Ea && (h = r[c[0]][c[1]]);
        if (h.Ea)
            switch (a.mode) {
                case 2:
                case 1:
                case 8:
                    if (0 == (a.dir & h.qa) && h.qa == q[a.dir])
                        a.N = q[a.dir];
                    else {
                        var c = 99999999999, u = 0, K;
                        for (K in Nb) {
                            var p = Nb[K];
                            if (h.qa & p && a.dir != q[p]) {
                                var d = P[p]
                                    , Bb = [e[0], e[1]];
                                Bb[d.axis] += d.ta;
                                d = dc(Bb, [a.pa[0], a.pa[1]]);
                                d < c && (c = d,
                                    u = p)
                            }
                        }
                        u && (a.N = u)
                    }
                    break;
                case 4:
                    if (0 == (a.dir & h.qa) && h.qa == q[a.dir])
                        a.N = q[a.dir];
                    else {
                        do
                            e = Nb[Math.floor(4 * cc())];
                        while (0 == (e & h.qa) || e == q[a.dir]); a.N = e
                    }
            }
    }, hc = function (a) {
        if (-1 == a.wa || a.Ka)
            a: {
                a.wa++;
                if (a.wa == Vb[a.ra].length) {
                    if (16 == a.mode && a.Da && !Ba) {
                        a.Qa ? W(a, 128) : W(a, 32);
                        break a
                    }
                    if (32 == a.mode || 128 == a.mode) {
                        a.o = [Sb[0], Sb[1] + 4];
                        a.dir = a.ab ? 8 : 4;
                        var b = w;
                        128 == a.mode && 4 == b && (b = Ga);
                        W(a, b);
                        break a
                    }
                    if (64 == a.mode) {
                        a.id == m || a.Da ? W(a, 128) : (a.Qa = !0,
                            W(a, 16));
                        break a
                    }
                    a.wa = 0
                }
                b = Vb[a.ra][a.wa];
                a.o[0] = 8 * b.y;
                a.o[1] = 8 * b.x;
                a.dir = b.dir;
                a.Ia = 0;
                a.La = fc(b.speed);
                a.Ka = !1;
                gc(a)
            }
        if ((b = Vb[a.ra][a.wa]) && a.La[Ha]) {
            var c = P[a.dir];
            a.o[c.axis] += c.ta;
            switch (a.dir) {
                case 1:
                case 4:
                    a.o[c.axis] < 8 * b.J && (a.o[c.axis] = 8 * b.J,
                        a.Ka = !0);
                    break;
                case 2:
                case 8:
                    a.o[c.axis] > 8 * b.J && (a.o[c.axis] = 8 * b.J,
                        a.Ka = !0)
            }
            gc(a)
        }
    }, bc = function (a) {
        switch (a.Oa) {
            case 0:
                var b = a.id != m || 2 != a.mode && 1 != a.mode ? a.Ra : Ia;
                break;
            case 1:
                b = a.O;
                break;
            case 2:
                b = a.Ta
        }
        a.Ia != b && (a.Ia = b,
            a.La = fc(a.Ia))
    }, ic = function (a, b) {
        a.Oa = b;
        bc(a)
    }, mc = function (a) {
        if (a.dir && a.La[Ha]) {
            var b = P[a.dir];
            a.o[b.axis] += b.ta;
            var c = a.o[0] / 8
                , d = a.o[1] / 8
                , b = [8 * Math.round(c), 8 * Math.round(d)];
            if (b[0] != a.w[0] || b[1] != a.w[1]) {
                Ea = !0;
                a.Ya && (a.dir = q[a.dir],
                    a.N = 0,
                    a.Ya = !1,
                    ec(a, !0));
                a.v || r[b[0]][b[1]].path ? a.Ha = [b[0], b[1]] : (a.o[0] = a.Ha[0],
                    a.o[1] = a.Ha[1],
                    b[0] = a.Ha[0],
                    b[1] = a.Ha[1],
                    a.dir = 0);
                1 == r[b[0]][b[1]].type && 8 != a.mode ? ic(a, 2) : ic(a, 0);
                if (!a.v && r[b[0]][b[1]].Aa) {
                    c = a.id;
                    t--;
                    Ra++;
                    ic(v[c], 1);
                    jc(c);
                    2 == r[b[0]][b[1]].Aa ? (kc(4, !1),
                        lc(50, c)) : lc(10, c);
                    r[b[0]][b[1]].Aa = 0;
                    $b();
                    tb = 90 * n.T;
                    if (pb)
                        switch (qb++ ,
                        qb) {
                            case Ob[1]:
                                v[m + 1].Da = !0;
                                break;
                            case Ob[2]:
                                v[m + 2].Da = !0;
                                break;
                            case Ob[3]:
                                16 == v[m + 3].mode && (pb = !1)
                        }
                    else if (16 == v[m + 1].mode || 8 == v[m + 1].mode)
                        v[m + 1].Na++ ,
                            v[m + 1].Na >= n.U[1] && (v[m + 1].Da = !0);
                    else if (16 == v[m + 2].mode || 8 == v[m + 2].mode)
                        v[m + 2].Na++ ,
                            v[m + 2].Na >= n.U[2] && (v[m + 2].Da = !0);
                    else if (16 == v[m + 3].mode || 8 == v[m + 3].mode)
                        v[m + 3].Na++ ,
                            v[m + 3].Na >= n.U[3] && (v[m + 3].Da = !0);
                    if (70 == Ra || 170 == Ra)
                        ub = !0,
                            $a = z[15] + (z[16] - z[15]) * cc();
                    0 == t && X(9);
                    V()
                }
                a.w[0] = b[0];
                a.w[1] = b[1]
            } else
                c = [8 * Math.floor(c), 8 * Math.floor(d)],
                    a.o[1] == c[1] && a.o[0] == c[0] && (a.o[0] == 8 * R[0].y && a.o[1] == 8 * R[0].x ? (a.o[0] = 8 * R[1].y,
                        a.o[1] = 8 * (R[1].x - 1)) : a.o[0] == 8 * R[1].y && a.o[1] == 8 * R[1].x && (a.o[0] = 8 * R[0].y,
                            a.o[1] = 8 * (R[0].x + 1)),
                        8 == a.mode && a.o[0] == Sb[0] && a.o[1] == Sb[1] && W(a, 64),
                        a.v || a.o[0] != Tb[0] || a.o[1] != Tb[1] && a.o[1] != Tb[1] + 8 || (c = a.id,
                            ub && (Y("fruit", 0),
                                ub = !1,
                                vb = !0,
                                $a = z[14],
                                lc(n.la, c))),
                        a.v && ec(a, !1),
                        c = r[a.o[0]][a.o[1]],
                        c.Ea && (a.N && a.N & c.qa ? (0 != a.dir && (a.Ca = a.dir),
                            a.dir = a.N,
                            a.N = 0,
                            a.v || (a.o[0] += a.Ba[0],
                                a.o[1] += a.Ba[1],
                                a.Ba = [0, 0])) : 0 == (a.dir & c.qa) && (0 != a.dir && (a.Ca = a.dir),
                                    a.dir = 0,
                                    a.N = 0,
                                    ic(a, 0))));
            if (!a.v && a.N && r[b[0]][b[1]].Ea && a.N & r[b[0]][b[1]].qa) {
                b = a.w;
                switch (a.dir) {
                    case 1:
                        var e = [b[0], b[1]]
                            , h = [b[0] + 3.6, b[1]];
                        break;
                    case 2:
                        e = [b[0] - 4, b[1]];
                        h = [b[0], b[1]];
                        break;
                    case 4:
                        e = [b[0], b[1]];
                        h = [b[0], b[1] + 3.6];
                        break;
                    case 8:
                        e = [b[0], b[1] - 4],
                            h = [b[0], b[1]]
                }
                a.o[0] >= e[0] && a.o[0] <= h[0] && a.o[1] >= e[1] && a.o[1] <= h[1] && (e = P[a.N],
                    a.Ba[e.axis] += e.ta)
            }
            gc(a)
        }
    };
    Yb.prototype.move = function () {
        if (0 == x || this.v && 1 == x && (8 == this.mode || 64 == this.mode)) {
            if (0 != this.va) {
                a: {
                    var a = this.va;
                    Da || (google.doodle.pacManSound = !0,
                        nc());
                    if (this.dir == q[a])
                        this.dir = a,
                            this.Ba = [0, 0],
                            2 != this.Oa && ic(this, 0),
                            0 != this.dir && (this.Ca = this.dir),
                            this.N = 0;
                    else if (this.dir != a)
                        if (0 == this.dir)
                            r[this.o[0]][this.o[1]].qa & a && (this.dir = a);
                        else {
                            var b = r[this.w[0]][this.w[1]];
                            if (b && b.qa & a) {
                                var b = P[this.dir]
                                    , c = [this.o[0], this.o[1]];
                                c[b.axis] -= b.ta;
                                var d = 0;
                                c[0] == this.w[0] && c[1] == this.w[1] ? d = 1 : (c[b.axis] -= b.ta,
                                    c[0] == this.w[0] && c[1] == this.w[1] && (d = 2));
                                if (d) {
                                    this.dir = a;
                                    this.o[0] = this.w[0];
                                    this.o[1] = this.w[1];
                                    b = P[this.dir];
                                    this.o[b.axis] += b.ta * d;
                                    break a
                                }
                            }
                            this.N = a;
                            this.Ba = [0, 0]
                        }
                }
                this.va = 0
            }
            this.ya ? (hc(this),
                64 == this.mode && hc(this)) : (mc(this),
                    8 == this.mode && mc(this))
        }
    }
        ;
    var oc = function (a) {
        a.Pa = [a.o[0] + a.Ba[0] + 0, a.o[1] + a.Ba[1] + -32]
    }
        , gc = function (a) {
            oc(a);
            var b = [0, 0];
            if (8 == x || 14 == x)
                b = [0, 3];
            else {
                if (a.v) {
                    var c = b = 0;
                    if (10 == x || 4 == x || 3 == x)
                        b = 3,
                            c = 0;
                    else if (1 == x && a.id == La) {
                        switch (Ma) {
                            case 2:
                                b = 0;
                                break;
                            case 4:
                                b = 1;
                                break;
                            case 8:
                                b = 2;
                                break;
                            case 16:
                                b = 3
                        }
                        c = 11
                    } else if (4 != a.mode && (16 != a.mode && 32 != a.mode || 4 != w || a.Qa))
                        if (8 == a.mode || 64 == a.mode) {
                            c = a.N;
                            c || (c = a.dir);
                            switch (c) {
                                case 4:
                                    b = 2;
                                    break;
                                case 8:
                                    b = 3;
                                    break;
                                case 1:
                                    b = 0;
                                    break;
                                case 2:
                                    b = 1
                            }
                            c = 10
                        } else if ("pcm-ghin" == a.s)
                            c = 8,
                                b = 6 + Math.floor(A / 16) % 2;
                        else if ("pcm-gbug" == a.s)
                            b = 6,
                                c = 9 + Math.floor(A / 16) % 2;
                        else if ("pcm-ghfa" == a.s)
                            b = 3 == C ? 6 : 7,
                                c = 11;
                        else if ("pcm-stck" == a.s)
                            b = 1 == C ? 60 < Na ? 1 : 45 < Na ? 2 : 3 : 2 == C ? 3 : 3 == C || 4 == C ? 4 : 0,
                                c = 13;
                        else {
                            c = a.N;
                            c && 1 != r[a.w[0]][a.w[1]].type || (c = a.dir);
                            switch (c) {
                                case 4:
                                    b = 4;
                                    break;
                                case 8:
                                    b = 6;
                                    break;
                                case 1:
                                    b = 0;
                                    break;
                                case 2:
                                    b = 2
                            }
                            c = 4 + a.id - m;
                            if (0 < a.speed || 13 != x)
                                b += Math.floor(A / 16) % 2
                        }
                    else
                        b = 0,
                            c = 8,
                            B < n.Za - n.K && 0 == Math.floor(B / z[1]) % 2 && (b += 2),
                            b += Math.floor(A / 16) % 2
                } else {
                    var c = b = 0
                        , d = a.dir;
                    0 == d && (d = a.Ca);
                    if (1 == x && a.id == Ja)
                        b = 3,
                            c = 0;
                    else if (9 != x && 10 != x || 0 != a.id)
                        if (4 == x || 5 == x || 7 == x)
                            b = 0 == a.id ? 2 : 4,
                                c = 0;
                        else if (3 == x)
                            if (a.id == Ka)
                                if (d = 20 - Math.floor(y / z[4] * 21),
                                    0 == a.id) {
                                    b = d - 1;
                                    switch (b) {
                                        case -1:
                                            b = 0;
                                            break;
                                        case 11:
                                            b = 10;
                                            break;
                                        case 12:
                                        case 13:
                                        case 14:
                                        case 15:
                                        case 16:
                                        case 17:
                                        case 18:
                                        case 19:
                                        case 20:
                                            b = 11
                                    }
                                    c = 12
                                } else
                                    switch (d) {
                                        case 0:
                                        case 1:
                                        case 2:
                                        case 6:
                                        case 10:
                                            b = 4;
                                            c = 3;
                                            break;
                                        case 3:
                                        case 7:
                                        case 11:
                                            b = 4;
                                            c = 0;
                                            break;
                                        case 4:
                                        case 8:
                                        case 12:
                                        case 13:
                                        case 14:
                                        case 15:
                                        case 16:
                                        case 17:
                                        case 18:
                                        case 19:
                                        case 20:
                                            b = 4;
                                            c = 2;
                                            break;
                                        case 5:
                                        case 9:
                                            b = 4,
                                                c = 1
                                    }
                            else
                                b = 3,
                                    c = 0;
                        else if ("pcm-bpcm" == a.s)
                            b = 14,
                                c = Math.floor(.2 * A) % 4,
                                3 == c && (c = 1),
                                c = 0 + 2 * c;
                        else if ("pcm-fing" == a.s)
                            b = 14,
                                c = 6;
                        else if ("pcm-dot" == a.s)
                            b = 0,
                                c = 9;
                        else if ("pcm-hidden" == a.s)
                            c = b = 0;
                        else {
                            switch (d) {
                                case 4:
                                    c = 0;
                                    break;
                                case 8:
                                    c = 1;
                                    break;
                                case 1:
                                    c = 2;
                                    break;
                                case 2:
                                    c = 3
                            }
                            2 != x && (b = Math.floor(.3 * A) % 4);
                            3 == b && 0 == a.dir && (b = 0);
                            2 == b && 0 == a.id && (b = 0);
                            3 == b && (b = 2,
                                0 == a.id && (c = 0));
                            1 == a.id && (b += 4)
                        }
                    else
                        b = 2,
                            c = 0
                }
                b = [c, b]
            }
            b[0] *= 16;
            b[1] *= 16;
            a.Va = [b[0] / 8 * 10 + 2, b[1] / 8 * 10 + 2]
        }
        , cc = function () {
            return (Oa = (134775813 * Oa + 1) % 4294967296) / 4294967296
        }
        , dc = function (a, b) {
            return Math.sqrt((b[1] - a[1]) * (b[1] - a[1]) + (b[0] - a[0]) * (b[0] - a[0]))
        }
        , pc = function () {
            v = [];
            for (var a = 0; a < m + 4; a++)
                v[a] = new Yb(a),
                    a < m ? (v[a].v = !1,
                        v[a].mode = 1) : v[a].v = !0
        }
        , rc = function (a) {
            xa(Sa);
            a || (a = window.event);
            27 == a.which && qc();
            var b = !1;
            switch (a.keyCode) {
                case 37:
                    v[0].va = 4;
                    b = !0;
                    break;
                case 38:
                    v[0].va = 1;
                    b = !0;
                    break;
                case 39:
                    v[0].va = 8;
                    b = !0;
                    break;
                case 40:
                    v[0].va = 2;
                    b = !0;
                    break;
                case 65:
                    2 == m && (v[1].va = 4,
                        b = !0);
                    break;
                case 83:
                    2 == m && (v[1].va = 2,
                        b = !0);
                    break;
                case 68:
                    2 == m && (v[1].va = 8,
                        b = !0);
                    break;
                case 87:
                    2 == m && (v[1].va = 1,
                        b = !0)
            }
            b && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        }
        , qc = function () {
            for (var a = window; a.postMessage("lightbox-exit", "*"),
                a !== a.parent;)
                a = a.parent
        }
        , sc = function (a, b) {
            var c = D
                , d = [0, 0];
            do
                d[0] += c.offsetTop,
                    d[1] += c.offsetLeft;
            while (c = c.offsetParent); a -= d[1] - -32;
            b -= d[0] - 0;
            var c = v[0]
                , d = c.o[1] + c.Ba[1] + -32 + 16
                , e = c.o[0] + c.Ba[0] + 0 + 32
                , h = Math.abs(a - d)
                , u = Math.abs(b - e);
            8 < h && u < h ? c.va = a > d ? 8 : 4 : 8 < u && h < u && (c.va = b > e ? 2 : 1)
        }
        , tc = function (a) {
            xa(Sa);
            a || (a = window.event);
            sc(a.clientX, a.clientY)
        }
        , wc = function (a) {
            xa(Sa);
            Ua = Ta = 0;
            1 == a.touches.length && (Va = a.touches[0].pageX,
                Wa = a.touches[0].pageY,
                document.addEventListener("touchmove", uc, !0),
                document.addEventListener("touchend", vc, !0));
            a.preventDefault();
            a.stopPropagation()
        }
        , uc = function (a) {
            xa(Sa);
            1 < a.touches.length ? xc() : (Ta = a.touches[0].pageX - Va,
                Ua = a.touches[0].pageY - Wa);
            a.preventDefault();
            a.stopPropagation()
        }
        , vc = function (a) {
            xa(Sa);
            if (0 == Ta && 0 == Ua)
                sc(Va, Wa);
            else {
                var b = Math.abs(Ta)
                    , c = Math.abs(Ua);
                8 > b && 8 > c ? sc(Va, Wa) : 15 < b && c < 2 * b / 3 ? v[0].va = 0 < Ta ? 8 : 4 : 15 < c && b < 2 * c / 3 && (v[0].va = 0 < Ua ? 2 : 1)
            }
            a.preventDefault();
            a.stopPropagation();
            xc()
        }
        , xc = function () {
            document.removeEventListener("touchmove", uc, !0);
            document.removeEventListener("touchend", vc, !0);
            Wa = Va = null
        }
        , zc = function () {
            Xa = [0, 0];
            Ya = [!1, !1];
            E = 3;
            F = 0;
            Za = !1;
            A = 0;
            yc(!0)
        }
        , Ac = function (a) {
            ab = $a = y = Ha = B = Oa = 0;
            bb = 90 * n.P[0];
            Ba = !1;
            Ca = 0;
            Ea = !1;
            $b();
            vb = ub = !1;
            tb = 90 * n.T;
            for (var b in v) {
                var c = v[b]
                    , d = Rb[m][c.id];
                c.o = [8 * d.y, 8 * d.x];
                c.Ba = [0, 0];
                c.w = [8 * d.y, 8 * d.x];
                c.pa = [8 * d.Ga, 8 * d.Fa];
                c.Ua = [8 * d.Ga, 8 * d.Fa];
                c.dir = d.dir;
                c.Ca = c.dir;
                c.N = 0;
                c.va = 0;
                c.Ia = 0;
                ic(c, 0);
                c.Qa = !1;
                c.ab = !1;
                c.Da = !1;
                c.Ya = !1;
                ac(c)
            }
            for (var e in v)
                oc(v[e]);
            kc(2, !0);
            for (b = m + 1; b < m + 4; b++)
                W(v[b], 16);
            cb = [0, 0];
            db = [1, 1];
            Cb = [!1, !1];
            Db = [!1, !1];
            a ? X(4) : X(6)
        }
        , Bc = function () {
            m = 1;
            Ab = 1 == m ? 10 : 5;
            pc();
            fb = eb = !1;
            hb = gb = G = !0;
            jb = ib = !1;
            lb = kb = !0;
            mb = !1;
            zc()
        }
        , yc = function (a) {
            F++;
            Cc("L" + F);
            n = F >= T.length ? T[T.length - 1] : T[F];
            n.ib || (n.K = Math.round(90 * n.K),
                n.Za = n.K + z[1] * (2 * n.ka - 1),
                n.ib = !0);
            for (var b in v)
                v[b].Na = 0;
            Fa = pb = !1;
            Qa = Pa = Ra = t = 0;
            for (var c in Pb)
                b = Pb[c],
                    b.I ? (b = b.x + b.I - 1,
                        b > Pa && (Pa = b)) : (b = b.y + b.h - 1,
                            b > Qa && (Qa = b));
            r = [];
            for (c = 0; c <= Qa + 1; c++)
                for (r[8 * c] = [],
                    b = -2; b <= Pa + 1; b++)
                    r[8 * c][8 * b] = {
                        path: 0,
                        Aa: 0,
                        Ea: 0
                    };
            for (var d in Pb)
                if (c = Pb[d],
                    b = c.type,
                    c.I) {
                    for (var e = 8 * c.y, h = 8 * c.x; h <= 8 * (c.x + c.I - 1); h += 8)
                        r[e][h].path = !0,
                            0 == r[e][h].Aa && (r[e][h].Aa = 1,
                                t++),
                            !b || h != 8 * c.x && h != 8 * (c.x + c.I - 1) ? r[e][h].type = b : r[e][h].type = 0;
                    r[e][8 * c.x].Ea = !0;
                    r[e][8 * (c.x + c.I - 1)].Ea = !0
                } else {
                    h = 8 * c.x;
                    for (e = 8 * c.y; e <= 8 * (c.y + c.h - 1); e += 8)
                        r[e][h].path && (r[e][h].Ea = !0),
                            r[e][h].path = !0,
                            0 == r[e][h].Aa && (r[e][h].Aa = 1,
                                t++),
                            !b || e != 8 * c.y && e != 8 * (c.y + c.h - 1) ? r[e][h].type = b : r[e][h].type = 0;
                    r[8 * c.y][h].Ea = !0;
                    r[8 * (c.y + c.h - 1)][h].Ea = !0
                }
            for (d in Q)
                if (Q[d].I)
                    for (h = 8 * Q[d].x; h <= 8 * (Q[d].x + Q[d].I - 1); h += 8)
                        r[8 * Q[d].y][h].Aa = 0,
                            t--;
                else
                    for (e = 8 * Q[d].y; e <= 8 * (Q[d].y + Q[d].h - 1); e += 8)
                        r[e][8 * Q[d].x].Aa = 0,
                            t--;
            for (d = 8; d <= 8 * Qa; d += 8)
                for (c = 8; c <= 8 * Pa; c += 8)
                    r[d][c].qa = 0,
                        r[d - 8][c].path && (r[d][c].qa += 1),
                        r[d + 8][c].path && (r[d][c].qa += 2),
                        r[d][c - 8].path && (r[d][c].qa += 4),
                        r[d][c + 8].path && (r[d][c].qa += 8);
            for (var u in Qb)
                d = Qb[u],
                    r[8 * d.y][8 * d.x].Aa = 2;
            Ac(a);
            256 == F && (Cc("K"),
                eb = G = !0,
                X(14))
        }
        , kc = function (a, b) {
            if (4 == a && 0 == n.K)
                for (var c in v) {
                    var d = v[c];
                    d.v && (d.Ya = !0)
                }
            else {
                d = w;
                4 == a && 4 != w && (Ga = w);
                w = a;
                4 != a && 4 != d || V();
                switch (a) {
                    case 1:
                    case 2:
                        rb = .8 * n.oa;
                        sb = .8 * n.O;
                        break;
                    case 4:
                        rb = .8 * n.na,
                            sb = .8 * n.W,
                            B = n.Za,
                            Ma = 1
                }
                for (c in v)
                    if (d = v[c],
                        d.v) {
                        if (64 == a || b || (d.ab = !0),
                            4 == a && (d.Qa = !1),
                            8 != d.mode && 16 != d.mode && 32 != d.mode && 128 != d.mode && 64 != d.mode || b)
                            b || 4 == d.mode || d.mode == a || (d.Ya = !0),
                                W(d, a)
                    } else
                        d.Ra = rb,
                            d.O = sb,
                            d.Ta = rb,
                            bc(d)
            }
        }
        , Dc = function (a) {
            return [4 >= a ? 128 : 160, 128 + (a - 1) % 4 * 16]
        }
        , $b = function () {
            var a = .8 * n.R;
            if (!Fa || 16 != v[m + 3].mode) {
                var b = n;
                t < b.$ ? a = .8 * b.ja : t < b.V && (a = .8 * b.ia)
            }
            a != Ia && (Ia = a,
                bc(v[m]))
        }
        , fc = function (a) {
            if (!wb[a]) {
                var b = 0
                    , c = 0;
                wb[a] = [];
                for (var d = 0; 90 > d; d++)
                    b += a,
                        Math.floor(b) > c ? (wb[a].push(!0),
                            c = Math.floor(b)) : wb[a].push(!1)
            }
            return wb[a]
        }
        , X = function (a) {
            x = a;
            if (13 != a)
                for (var b = 0; b < m + 4; b++)
                    gc(v[b]);
            switch (a) {
                case 0:
                    V();
                    break;
                case 2:
                    Z();
                    y = z[3];
                    break;
                case 3:
                    0 == Ka ? Y("death", 0) : Y("death-double", 0);
                    y = z[4];
                    break;
                case 6:
                    G = !1;
                    y = z[5];
                    break;
                case 7:
                    Z();
                    ib = hb = G = !0;
                    y = z[6];
                    break;
                case 4:
                    ib = hb = !0;
                    y = z[7];
                    Z();
                    2 == m ? Y("start-music-double", 0, !0) : Y("start-music", 0, !0);
                    break;
                case 5:
                    E--;
                    y = z[8];
                    break;
                case 8:
                case 14:
                    ib = !1;
                    Z();
                    jb = !0;
                    y = z[9];
                    break;
                case 9:
                    Z();
                    y = z[10];
                    break;
                case 10:
                    hb = !1;
                    y = z[11];
                    break;
                case 11:
                    G = !1;
                    y = z[12];
                    break;
                case 12:
                    gb = !1;
                    y = z[13];
                    break;
                case 1:
                    y = z[2];
                    break;
                case 13:
                    fb = !0;
                    G = !1;
                    I = Wb[xb];
                    C = -1;
                    B = n.Za;
                    J = [];
                    for (var c in I.Ja)
                        a = I.Ja[c].id,
                            0 < a && (a += m - 1),
                            a = new Yb(a),
                            a.o = [8 * I.Ja[c].y, 8 * I.Ja[c].x],
                            a.Ba = [0, 0],
                            a.v = I.Ja[c].v,
                            J.push(a);
                    Ec();
                    Z();
                    V()
            }
        }
        , Fc = function (a) {
            a = window.event || a;
            a.cancelBubble = !0;
            google.doodle.pacManSound ? (Da = !0,
                Z(),
                google.doodle.pacManSound = !1) : (Da = !1,
                    google.doodle.pacManSound = !0,
                    V());
            var b = !Da;
            window.localStorage && window.localStorage.setItem("doodle-pacman-audio", b ? "true" : "false");
            nc();
            return a.returnValue = !1
        }
        , nc = function () {
            H && (H.style.backgroundPosition = google.doodle.pacManSound ? "-216px -105px" : "-236px -105px")
        }
        , Ec = function () {
            C++;
            if (I.Sa.length == C)
                fb = !1,
                    G = !0,
                    yc(!1);
            else {
                var a = I.Sa[C];
                Na = 90 * a.time;
                for (var b in J) {
                    var c = J[b];
                    c.dir = a.L[b].dir;
                    c.speed = a.L[b].speed;
                    a.L[b].s && (c.s = a.L[b].s);
                    a.L[b].mode && (c.mode = a.L[b].mode);
                    gc(c)
                }
            }
        }
        , Gc = function () {
            13 != x && (0 == A % (2 * z[17]) ? lb = !0 : A % (2 * z[17]) == z[17] && (lb = !1))
        }
        , Hc = !1
        , Ic = !1
        , Jc = function () {
            Ic ? Hc = !1 : (Hc = !0,
                va(Jc));
            var a = (new Date).getTime();
            L += a - yb - Xb;
            100 < L ? L = 100 : -100 > L && (L = -100);
            var b = 0;
            L > Xb ? (b = Math.floor(L / Xb),
                L -= Xb * b) : L < -Xb && (b = Math.ceil(L / Xb),
                    L -= Xb * b);
            b = 1 + b;
            yb = a;
            if (13 == x) {
                for (a = 0; a < b; a++) {
                    var c = void 0;
                    for (c in J) {
                        var d = J[c]
                            , e = P[d.dir];
                        d.o[e.axis] += e.ta * d.speed;
                        gc(d)
                    }
                    Na--;
                    Ha = (Ha + 1) % 90;
                    A++
                }
                0 >= Na && Ec();
                Gc()
            } else
                for (a = 0; a < b; a++) {
                    c = void 0;
                    for (c in v)
                        v[c].move();
                    if (0 == x && Ea) {
                        a: for (Ea = !1,
                            d = m; d < m + 4; d++)
                            for (c = 0; c < m; c++)
                                if (v[d].w[0] == v[c].w[0] && v[d].w[1] == v[c].w[1]) {
                                    if (4 == v[d].mode) {
                                        Y("eating-ghost", 0);
                                        lc(200 * Ma, c);
                                        Ma *= 2;
                                        La = d;
                                        Ja = c;
                                        X(1);
                                        break a
                                    }
                                    8 != v[d].mode && 16 != v[d].mode && 32 != v[d].mode && 128 != v[d].mode && 64 != v[d].mode && (Ka = c,
                                        X(2))
                                }
                        for (c = m; c < m + 4; c++)
                            if (d = v[c],
                                d.id == m && t < n.V && 2 == d.mode && (!Fa || 16 != v[m + 3].mode))
                                e = v[d.Wa],
                                    d.pa = [e.w[0], e.w[1]];
                            else if (d.v && 1 == d.mode)
                                switch (e = v[d.Wa],
                                d.id) {
                                    case m:
                                        d.pa = [e.w[0], e.w[1]];
                                        break;
                                    case m + 1:
                                        d.pa = [e.w[0], e.w[1]];
                                        var h = P[e.dir];
                                        d.pa[h.axis] += 32 * h.ta;
                                        1 == e.dir && (d.pa[1] -= 32);
                                        break;
                                    case m + 2:
                                        var u = v[m]
                                            , K = [e.w[0], e.w[1]]
                                            , h = P[e.dir];
                                        K[h.axis] += 16 * h.ta;
                                        1 == e.dir && (K[1] -= 16);
                                        d.pa[0] = 2 * K[0] - u.w[0];
                                        d.pa[1] = 2 * K[1] - u.w[1];
                                        break;
                                    case m + 3:
                                        64 < dc(e.w, d.w) ? d.pa = [e.w[0], e.w[1]] : d.pa = d.Ua
                                }
                    }
                    A++;
                    Ha = (Ha + 1) % 90;
                    switch (x) {
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                            kb = !0;
                            break;
                        case 8:
                        case 14:
                            kb = !1;
                            break;
                        default:
                            0 == A % (2 * z[0]) ? kb = !0 : A % (2 * z[0]) == z[0] && (kb = !1)
                    }
                    Gc();
                    if (0 == x) {
                        if (tb && (tb-- ,
                            0 >= tb)) {
                            for (c = 1; 3 >= c; c++)
                                if (16 == v[m + c].mode) {
                                    v[m + c].Da = !0;
                                    break
                                }
                            tb = 90 * n.T
                        }
                        $a && ($a-- ,
                            0 >= $a && (vb = ub = !1));
                        if (B)
                            B-- ,
                                0 >= B && (B = 0,
                                    kc(Ga, !1));
                        else if (0 < bb && (bb-- ,
                            0 >= bb && (bb = 0,
                                ab++ ,
                                n.P[ab])))
                            switch (bb = 90 * n.P[ab],
                            w) {
                                case 2:
                                    kc(1, !1);
                                    break;
                                case 1:
                                    kc(2, !1)
                            }
                    }
                    if (y) {
                        y--;
                        switch (x) {
                            case 2:
                            case 3:
                                for (c = 0; c < m + 4; c++)
                                    gc(v[c]);
                                break;
                            case 10:
                                mb = 0 == Math.floor(y / (z[11] / 8)) % 2 ? !1 : !0
                        }
                        if (0 >= y)
                            switch (y = 0,
                            x) {
                                case 1:
                                    X(0);
                                    Ca++;
                                    V();
                                    W(v[La], 8);
                                    d = !1;
                                    for (c = m; c < m + 4; c++)
                                        if (4 == v[c].mode || (16 == v[c].mode || 128 == v[c].mode) && !v[c].Qa) {
                                            d = !0;
                                            break
                                        }
                                    d || kc(Ga, !1);
                                    break;
                                case 2:
                                    X(3);
                                    break;
                                case 3:
                                    pb = Fa = !0;
                                    qb = 0;
                                    E--;
                                    -1 == E ? (Cc("G"),
                                        X(8)) : Ac(!1);
                                    break;
                                case 4:
                                    X(5);
                                    break;
                                case 6:
                                    X(7);
                                    break;
                                case 7:
                                case 5:
                                    ib = !1;
                                    X(0);
                                    break;
                                case 8:
                                    jb = !1;
                                    qc();
                                    google.doodle.pacManQuery && google.doodle.pacManQuery();
                                    break;
                                case 9:
                                    X(10);
                                    break;
                                case 10:
                                    X(11);
                                    break;
                                case 11:
                                    n.Ma ? (xb = n.Ma,
                                        X(13)) : (G = !0,
                                            yc(!1));
                                    break;
                                case 12:
                                    G = gb = !0,
                                        m = 2,
                                        Ab = 1 == m ? 10 : 5,
                                        pc(),
                                        zc()
                            }
                    }
                }
            b = l;
            b.fillStyle = "black";
            b.fillRect(0, 0, 484, 208);
            if (fb) {
                b.save();
                b.beginPath();
                b.rect(10, 40, 464, 136);
                b.clip();
                for (var p = 0; p < J.length; p++)
                    Zb(J[p]);
                b.restore();
                Kc()
            }
            if (G) {
                if (gb) {
                    U(322, mb ? 138 : 2, 464, 136, 10, 40);
                    b.fillStyle = "#f8b090";
                    b.beginPath();
                    for (d = 8; d <= 8 * Qa; d += 8)
                        for (e = 8; e <= 8 * Pa; e += 8)
                            1 == r[d][e].Aa && b.rect(e + -32 + 10 + 3, d + 0 + 40 + 3, 2, 2);
                    b.fill();
                    if (kb)
                        for (d = 8; d <= 8 * Qa; d += 8)
                            for (e = 8; e <= 8 * Pa; e += 8)
                                2 == r[d][e].Aa && (a = e + -32 + 10,
                                    c = d + 0 + 40,
                                    U(2, 182, 8, 8, a, c));
                    hb && (b.fillStyle = "#ffaaa5",
                        b.fillRect(289, 86, 19, 2));
                    if (ub || vb)
                        a = vb ? [128, 16 * (n.M - 1)] : Dc(n.M),
                            d = a[0] / 8 * 10 + 2,
                            e = a[1] / 8 * 10 + 2,
                            a = Tb[1] + -32 + 10 - 8,
                            c = Tb[0] + 0 + 40 - 4,
                            U(d, e, 32, 16, a, c);
                    if (1 == x) {
                        for (p in v)
                            p != La && Zb(v[p]);
                        Zb(v[La])
                    } else
                        for (p in v)
                            Zb(v[p])
                }
                lb && (U(202, 72, 48, 8, -2, 8),
                    2 == m && U(202, 82, 48, 8, 62, 8));
                Lc(0);
                2 == m && Lc(1);
                if (eb) {
                    b.save();
                    b.beginPath();
                    b.rect(10, 40, 464, 136);
                    b.clip();
                    Oa = 0;
                    b.fillStyle = "black";
                    b.fillRect(282, 40, 200, 80);
                    b.fillRect(290, 120, 192, 56);
                    nb = 80;
                    ob = 0;
                    for (p = 280; 472 >= p; p += 8)
                        for (a = 0; 136 >= a; a += 8)
                            .03 > cc() && (nb = 10 * Math.floor(25 * cc()),
                                ob = 10 * Math.floor(2 * cc())),
                                U(nb, ob, 8, 8, p + 10, a + 40),
                                ob += 8;
                    b.restore()
                }
                Kc();
                for (p = 0; p < E; p++)
                    U(82, 163, 16, 12, 10 + 15 * p, 184);
                jb && U(12, 192, 80, 8, 258, 120);
                ib && U(202, 2, 48, 8, 274, 120)
            }
        }
        , U = function (a, b, c, d, e, h) {
            l.drawImage(zb, a, b, c, d, e, h, c, d)
        }
        , Lc = function (a) {
            var b = Xa[a].toString();
            b.length > Ab && (b = b.substr(b.length - Ab, Ab));
            a = 0 == a ? 10 : 74;
            for (var c = 0; c < Ab; c++) {
                var d = b.substr(c, 1);
                d && U((8 + 8 * parseInt(d, 10)) / 8 * 10 + 2, 182, 8, 8, a + 8 * c, 24)
            }
        }
        , Kc = function () {
            for (var a = Math.max(F - 4 + 1, 1), b = F; b >= a; b--) {
                var c = Dc(b >= T.length ? T[T.length - 1].M : T[b].M);
                U(c[0] / 8 * 10 + 2, c[1] / 8 * 10 + 2, 32, 16, 466 - 16 * (1 + b - a), 184)
            }
        }
        , lc = function (a, b) {
            Xa[b] += a;
            !Ya[b] && 1E4 < Xa[b] && (Y("extra-life", 0),
                Ya[b] = !0,
                E++ ,
                5 < E && (E = 5))
        }
        , Y = function (a, b, c) {
            if (M && google.doodle.pacManSound && !Za) {
                c || Mc(b);
                try {
                    Eb.playTrack(a, b)
                } catch (d) {
                    M = !1
                }
            }
        }
        , Mc = function (a) {
            if (M)
                try {
                    Eb.stopChannel(a)
                } catch (b) {
                    M = !1
                }
        }
        , Z = function () {
            if (M) {
                try {
                    Eb.stopAmbientTrack()
                } catch (b) {
                    M = !1
                }
                for (var a = 0; 5 > a; a++)
                    Mc(a)
            }
        }
        , jc = function (a) {
            M && google.doodle.pacManSound && 0 == x && (Cb[a] ? Db[a] = !0 : (0 == a ? (Y(1 == db[a] ? "eating-dot-1" : "eating-dot-2", 1 + cb[a], !0),
                Fb = window.setInterval(Nc, 150)) : (Y("eating-dot-double", 3 + cb[a], !0),
                    Gb = window.setInterval(Oc, 150)),
                cb[a] = (cb[a] + 1) % 2,
                db[a] = 3 - db[a]))
        }
        , Pc = function (a) {
            Cb[a] = !1;
            Db[a] && (Db[a] = !1,
                jc(a))
        }
        , Nc = function () {
            Pc(0)
        }
        , Oc = function () {
            Pc(1)
        }
        , V = function () {
            if (M && google.doodle.pacManSound) {
                var a = 0;
                0 == x || 1 == x ? a = Ca ? "ambient-eyes" : 4 == w ? "ambient-fright" : 241 < Ra ? "ambient-4" : 207 < Ra ? "ambient-3" : 138 < Ra ? "ambient-2" : "ambient-1" : 13 == x && (a = "cutscene");
                if (a)
                    try {
                        Eb.playAmbientTrack(a)
                    } catch (b) {
                        M = !1
                    }
            }
        }
        , Qc = function () {
            Ic = !1;
            Hc ? V() : (V(),
                yb = (new Date).getTime(),
                L = 0,
                Jc())
        }
        , Rc = function () {
            Ic = !0;
            Z();
            window.clearInterval(Fb);
            window.clearInterval(Gb)
        }
        , Uc = function () {
            (Jb || Kb) && Sc(.67);
            if (Jb && Kb && (Sc(1),
                !Ib)) {
                Ib = !0;
                Tc(document.getElementById("hplogo-l"));
                Hb.style.background = "black";
                D = document.createElement("canvas");
                D.id = "hplogo-c";
                D.width = 484;
                D.height = 208;
                l = D.getContext("2d");
                Hb.appendChild(D);
                D.tabIndex = 0;
                D.focus();
                M && (H = document.createElement("div"),
                    H.style.background = "url(/logos/pacman10-hp-sprite-3.png) 38px 18px no-repeat",
                    H.style.position = "absolute",
                    H.style.right = "0",
                    H.style.top = "0",
                    H.style.width = "12px",
                    H.style.height = "12px",
                    H.style.border = "10px solid black",
                    H.style.cursor = "pointer",
                    Hb.appendChild(H),
                    H.onclick = Fc,
                    nc());
                wb = [];
                q = [, 2, 1, , 8, , , , 4];
                window.addEventListener ? (window.addEventListener("keydown", rc, !1),
                    D.addEventListener("click", tc, !1),
                    document.addEventListener("touchstart", wc, !0),
                    D.addEventListener("touchstart", wc, !0),
                    document.f && document.f.q && document.f.q.addEventListener("touchstart", wc, !0)) : (document.body.attachEvent("onkeydown", rc),
                        D.attachEvent("onclick", tc));
                z = {};
                for (var a in Ub)
                    z[a] = Math.round(90 * (google.doodle.pacManSound || 7 != a && 8 != a ? Ub[a] : 1));
                Sa = new za(12E4, Rc, Qc);
                Bc();
                ra && (xb = F = 0,
                    X(13));
                Qc()
            }
        }
        , Vc = function () {
            Kb = !0;
            Uc()
        }
        , Wc = function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0
        }
        , Xc = function (a) {
            a = a.match(/[\d]+/g);
            a.length = 3;
            return a.join(".")
        }
        , Tc = function (a) {
            a && a.parentNode && a.parentNode.removeChild(a)
        }
        , Yc = function () {
            Ib || (M = !1,
                Jb = !0,
                Uc())
        }
        , Sc = function (a) {
            document.getElementById("hplogo-b").style.width = Math.round(200 * a) + "px"
        }
        , Cc = function (a) {
            a = "pacman,e:" + a;
            if (window.google && window.google.log) {
                var b;
                pa || (b = document.getElementById("hplogoved")) && (pa = b.getAttribute("data-ved"));
                (b = pa) && (a += "&ved=" + b);
                window.google.log("doodle", a)
            } else
                oa(a)
        };
    Cc("I");
    Ib = !1;
    Hb = document.getElementById("hplogo");
    Hb.title = "";
    Sc(.33);
    google.pacman = google.pacman || {};
    google.pacman.insertCoin = function () {
        8 == x || 14 == x ? Bc() : 2 != m && (Z(),
            X(12))
    }
        ;
    google.pacman.flashLoaded = function () {
        if (O) {
            var a = O.getElementById("pacman-sound-player");
            if (a && a.playTrack) {
                Eb = a;
                Jb = M = !0;
                Uc();
                return
            }
            if ((a = O.getElementById("pacman-sound-player-2")) && a.playTrack) {
                Eb = a;
                Jb = M = !0;
                Uc();
                return
            }
        }
        Yc()
    }
        ;
    google.pacman.destroy = function () {
        if (google.pacman) {
            Z();
            window.clearInterval(Fb);
            window.clearInterval(Gb);
            Tc(N);
            Tc(D);
            google.pacman = void 0;
            window.removeEventListener && (window.removeEventListener("MozGamepadConnected", ja, !1),
                window.removeEventListener("MozGamepadDisconnected", ka, !1));
            f = !1;
            var a = Sa;
            a && "function" == typeof a.$a && a.$a()
        }
    }
        ;
    Kb = !1;
    zb = document.createElement("img");
    var Zc = -1 != navigator.userAgent.indexOf("MSIE");
    Zc || (zb.onload = Vc);
    zb.src = "/logos/pacman10-hp-sprite-3.png";
    Zc && Vc();
    0 == function () {
        if (window.localStorage) {
            var a = window.localStorage.getItem("doodle-pacman-audio");
            if (a && (a = a.toLowerCase(),
                "0" != a && "no" != a && "false" != a))
                return !0;
            if (null != a)
                return !1
        }
        return null
    }() && (Da = !0,
        google.doodle.pacManSound = !1);
    var $c = Jb = M = !1
        , ad = "";
    if (navigator.plugins && navigator.plugins.length) {
        var bd = navigator.plugins["Shockwave Flash"];
        bd && ($c = !0,
            bd.description && (ad = Xc(bd.description)));
        navigator.plugins["Shockwave Flash 2.0"] && ($c = !0,
            ad = "2.0.0.11")
    } else if (navigator.mimeTypes && navigator.mimeTypes.length) {
        var cd = navigator.mimeTypes["application/x-shockwave-flash"];
        ($c = cd && cd.enabledPlugin) && (ad = Xc(cd.enabledPlugin.description))
    } else
        try {
            var dd = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
                , $c = !0
                , ad = Xc(dd.GetVariable("$version"))
        } catch (a) {
            try {
                dd = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"),
                    $c = !0,
                    ad = "6.0.21"
            } catch (b) {
                try {
                    dd = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"),
                        $c = !0,
                        ad = Xc(dd.GetVariable("$version"))
                } catch (c) { }
            }
        }
    Lb = $c;
    Mb = ad;
    var ed;
    if (ed = Lb) {
        for (var fd = 0, gd = String(Mb).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), hd = "9.0.0.0".replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), id = Math.max(gd.length, hd.length), jd = 0; 0 == fd && jd < id; jd++) {
            var kd = gd[jd] || ""
                , ld = hd[jd] || ""
                , md = RegExp("(\\d*)(\\D*)", "g")
                , nd = RegExp("(\\d*)(\\D*)", "g");
            do {
                var od = md.exec(kd) || ["", "", ""]
                    , pd = nd.exec(ld) || ["", "", ""];
                if (0 == od[0].length && 0 == pd[0].length)
                    break;
                fd = Wc(0 == od[1].length ? 0 : parseInt(od[1], 10), 0 == pd[1].length ? 0 : parseInt(pd[1], 10)) || Wc(0 == od[2].length, 0 == pd[2].length) || Wc(od[2], pd[2])
            } while (0 == fd)
        }
        ed = 0 <= fd
    }
    if (ed) {
        N = document.createElement("iframe");
        N.name = "pm-sound";
        N.style.position = "absolute";
        N.style.top = "-150px";
        N.style.border = 0;
        N.style.width = "100px";
        N.style.height = "100px";
        (document.getElementById("xjsc") || document.body).appendChild(N);
        O = N.contentDocument;
        if (void 0 == O || null == O)
            O = N.contentWindow.document;
        O.open();
        O.write('<html><head></head><body><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + window.location.protocol + '//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="0" height="0" id="pacman-sound-player" type="application/x-shockwave-flash"> <param name="movie" value="/logos/swf/pacman10-hp-sound.swf"> <param name="allowScriptAccess" value="always"> <object id="pacman-sound-player-2"  type="application/x-shockwave-flash" data="/logos/swf/pacman10-hp-sound.swf" width="0" height="0"><param name="allowScriptAccess" value="always"> </object></object></body></html>');
        O.close();
        window.setTimeout(Yc, 3E3)
    } else
        Jb = !0,
            Uc();
    ea[0] = 37;
    ea[1] = 39;
    ea[2] = 38;
    ea[3] = 40;
    ga = Hb;
    ha = null;
    window.addEventListener && (window.addEventListener("MozGamepadConnected", ja, !1),
        window.addEventListener("MozGamepadDisconnected", ka, !1));
    !navigator.webkitGamepads && !navigator.webkitGetGamepads || f || (f = !0,
        ia());
}
)();
