(function () {
  const l = document.createElement("link").relList;
  if (l && l.supports && l.supports("modulepreload")) return;
  for (const c of document.querySelectorAll('link[rel="modulepreload"]')) o(c);
  new MutationObserver((c) => {
    for (const h of c)
      if (h.type === "childList")
        for (const d of h.addedNodes)
          d.tagName === "LINK" && d.rel === "modulepreload" && o(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function u(c) {
    const h = {};
    return (
      c.integrity && (h.integrity = c.integrity),
      c.referrerPolicy && (h.referrerPolicy = c.referrerPolicy),
      c.crossOrigin === "use-credentials"
        ? (h.credentials = "include")
        : c.crossOrigin === "anonymous"
          ? (h.credentials = "omit")
          : (h.credentials = "same-origin"),
      h
    );
  }
  function o(c) {
    if (c.ep) return;
    c.ep = !0;
    const h = u(c);
    fetch(c.href, h);
  }
})();
var Ur = { exports: {} },
  cl = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var c0;
function $1() {
  if (c0) return cl;
  c0 = 1;
  var a = Symbol.for("react.transitional.element"),
    l = Symbol.for("react.fragment");
  function u(o, c, h) {
    var d = null;
    if (
      (h !== void 0 && (d = "" + h),
      c.key !== void 0 && (d = "" + c.key),
      "key" in c)
    ) {
      h = {};
      for (var m in c) m !== "key" && (h[m] = c[m]);
    } else h = c;
    return (
      (c = h.ref),
      { $$typeof: a, type: o, key: d, ref: c !== void 0 ? c : null, props: h }
    );
  }
  return ((cl.Fragment = l), (cl.jsx = u), (cl.jsxs = u), cl);
}
var f0;
function I1() {
  return (f0 || ((f0 = 1), (Ur.exports = $1())), Ur.exports);
}
var x = I1(),
  Br = { exports: {} },
  it = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var d0;
function tx() {
  if (d0) return it;
  d0 = 1;
  var a = Symbol.for("react.transitional.element"),
    l = Symbol.for("react.portal"),
    u = Symbol.for("react.fragment"),
    o = Symbol.for("react.strict_mode"),
    c = Symbol.for("react.profiler"),
    h = Symbol.for("react.consumer"),
    d = Symbol.for("react.context"),
    m = Symbol.for("react.forward_ref"),
    g = Symbol.for("react.suspense"),
    p = Symbol.for("react.memo"),
    v = Symbol.for("react.lazy"),
    b = Symbol.for("react.activity"),
    T = Symbol.iterator;
  function C(E) {
    return E === null || typeof E != "object"
      ? null
      : ((E = (T && E[T]) || E["@@iterator"]),
        typeof E == "function" ? E : null);
  }
  var z = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    B = Object.assign,
    H = {};
  function q(E, U, K) {
    ((this.props = E),
      (this.context = U),
      (this.refs = H),
      (this.updater = K || z));
  }
  ((q.prototype.isReactComponent = {}),
    (q.prototype.setState = function (E, U) {
      if (typeof E != "object" && typeof E != "function" && E != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, E, U, "setState");
    }),
    (q.prototype.forceUpdate = function (E) {
      this.updater.enqueueForceUpdate(this, E, "forceUpdate");
    }));
  function G() {}
  G.prototype = q.prototype;
  function L(E, U, K) {
    ((this.props = E),
      (this.context = U),
      (this.refs = H),
      (this.updater = K || z));
  }
  var Z = (L.prototype = new G());
  ((Z.constructor = L), B(Z, q.prototype), (Z.isPureReactComponent = !0));
  var Q = Array.isArray;
  function nt() {}
  var P = { H: null, A: null, T: null, S: null },
    $ = Object.prototype.hasOwnProperty;
  function at(E, U, K) {
    var W = K.ref;
    return {
      $$typeof: a,
      type: E,
      key: U,
      ref: W !== void 0 ? W : null,
      props: K,
    };
  }
  function Dt(E, U) {
    return at(E.type, U, E.props);
  }
  function kt(E) {
    return typeof E == "object" && E !== null && E.$$typeof === a;
  }
  function zt(E) {
    var U = { "=": "=0", ":": "=2" };
    return (
      "$" +
      E.replace(/[=:]/g, function (K) {
        return U[K];
      })
    );
  }
  var Ne = /\/+/g;
  function qe(E, U) {
    return typeof E == "object" && E !== null && E.key != null
      ? zt("" + E.key)
      : U.toString(36);
  }
  function oe(E) {
    switch (E.status) {
      case "fulfilled":
        return E.value;
      case "rejected":
        throw E.reason;
      default:
        switch (
          (typeof E.status == "string"
            ? E.then(nt, nt)
            : ((E.status = "pending"),
              E.then(
                function (U) {
                  E.status === "pending" &&
                    ((E.status = "fulfilled"), (E.value = U));
                },
                function (U) {
                  E.status === "pending" &&
                    ((E.status = "rejected"), (E.reason = U));
                },
              )),
          E.status)
        ) {
          case "fulfilled":
            return E.value;
          case "rejected":
            throw E.reason;
        }
    }
    throw E;
  }
  function _(E, U, K, W, lt) {
    var rt = typeof E;
    (rt === "undefined" || rt === "boolean") && (E = null);
    var xt = !1;
    if (E === null) xt = !0;
    else
      switch (rt) {
        case "bigint":
        case "string":
        case "number":
          xt = !0;
          break;
        case "object":
          switch (E.$$typeof) {
            case a:
            case l:
              xt = !0;
              break;
            case v:
              return ((xt = E._init), _(xt(E._payload), U, K, W, lt));
          }
      }
    if (xt)
      return (
        (lt = lt(E)),
        (xt = W === "" ? "." + qe(E, 0) : W),
        Q(lt)
          ? ((K = ""),
            xt != null && (K = xt.replace(Ne, "$&/") + "/"),
            _(lt, U, K, "", function (gi) {
              return gi;
            }))
          : lt != null &&
            (kt(lt) &&
              (lt = Dt(
                lt,
                K +
                  (lt.key == null || (E && E.key === lt.key)
                    ? ""
                    : ("" + lt.key).replace(Ne, "$&/") + "/") +
                  xt,
              )),
            U.push(lt)),
        1
      );
    xt = 0;
    var ie = W === "" ? "." : W + ":";
    if (Q(E))
      for (var Ut = 0; Ut < E.length; Ut++)
        ((W = E[Ut]), (rt = ie + qe(W, Ut)), (xt += _(W, U, K, rt, lt)));
    else if (((Ut = C(E)), typeof Ut == "function"))
      for (E = Ut.call(E), Ut = 0; !(W = E.next()).done; )
        ((W = W.value), (rt = ie + qe(W, Ut++)), (xt += _(W, U, K, rt, lt)));
    else if (rt === "object") {
      if (typeof E.then == "function") return _(oe(E), U, K, W, lt);
      throw (
        (U = String(E)),
        Error(
          "Objects are not valid as a React child (found: " +
            (U === "[object Object]"
              ? "object with keys {" + Object.keys(E).join(", ") + "}"
              : U) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return xt;
  }
  function X(E, U, K) {
    if (E == null) return E;
    var W = [],
      lt = 0;
    return (
      _(E, W, "", "", function (rt) {
        return U.call(K, rt, lt++);
      }),
      W
    );
  }
  function k(E) {
    if (E._status === -1) {
      var U = E._result;
      ((U = U()),
        U.then(
          function (K) {
            (E._status === 0 || E._status === -1) &&
              ((E._status = 1), (E._result = K));
          },
          function (K) {
            (E._status === 0 || E._status === -1) &&
              ((E._status = 2), (E._result = K));
          },
        ),
        E._status === -1 && ((E._status = 0), (E._result = U)));
    }
    if (E._status === 1) return E._result.default;
    throw E._result;
  }
  var ut =
      typeof reportError == "function"
        ? reportError
        : function (E) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var U = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof E == "object" &&
                  E !== null &&
                  typeof E.message == "string"
                    ? String(E.message)
                    : String(E),
                error: E,
              });
              if (!window.dispatchEvent(U)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", E);
              return;
            }
            console.error(E);
          },
    mt = {
      map: X,
      forEach: function (E, U, K) {
        X(
          E,
          function () {
            U.apply(this, arguments);
          },
          K,
        );
      },
      count: function (E) {
        var U = 0;
        return (
          X(E, function () {
            U++;
          }),
          U
        );
      },
      toArray: function (E) {
        return (
          X(E, function (U) {
            return U;
          }) || []
        );
      },
      only: function (E) {
        if (!kt(E))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return E;
      },
    };
  return (
    (it.Activity = b),
    (it.Children = mt),
    (it.Component = q),
    (it.Fragment = u),
    (it.Profiler = c),
    (it.PureComponent = L),
    (it.StrictMode = o),
    (it.Suspense = g),
    (it.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P),
    (it.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (E) {
        return P.H.useMemoCache(E);
      },
    }),
    (it.cache = function (E) {
      return function () {
        return E.apply(null, arguments);
      };
    }),
    (it.cacheSignal = function () {
      return null;
    }),
    (it.cloneElement = function (E, U, K) {
      if (E == null)
        throw Error(
          "The argument must be a React element, but you passed " + E + ".",
        );
      var W = B({}, E.props),
        lt = E.key;
      if (U != null)
        for (rt in (U.key !== void 0 && (lt = "" + U.key), U))
          !$.call(U, rt) ||
            rt === "key" ||
            rt === "__self" ||
            rt === "__source" ||
            (rt === "ref" && U.ref === void 0) ||
            (W[rt] = U[rt]);
      var rt = arguments.length - 2;
      if (rt === 1) W.children = K;
      else if (1 < rt) {
        for (var xt = Array(rt), ie = 0; ie < rt; ie++)
          xt[ie] = arguments[ie + 2];
        W.children = xt;
      }
      return at(E.type, lt, W);
    }),
    (it.createContext = function (E) {
      return (
        (E = {
          $$typeof: d,
          _currentValue: E,
          _currentValue2: E,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (E.Provider = E),
        (E.Consumer = { $$typeof: h, _context: E }),
        E
      );
    }),
    (it.createElement = function (E, U, K) {
      var W,
        lt = {},
        rt = null;
      if (U != null)
        for (W in (U.key !== void 0 && (rt = "" + U.key), U))
          $.call(U, W) &&
            W !== "key" &&
            W !== "__self" &&
            W !== "__source" &&
            (lt[W] = U[W]);
      var xt = arguments.length - 2;
      if (xt === 1) lt.children = K;
      else if (1 < xt) {
        for (var ie = Array(xt), Ut = 0; Ut < xt; Ut++)
          ie[Ut] = arguments[Ut + 2];
        lt.children = ie;
      }
      if (E && E.defaultProps)
        for (W in ((xt = E.defaultProps), xt))
          lt[W] === void 0 && (lt[W] = xt[W]);
      return at(E, rt, lt);
    }),
    (it.createRef = function () {
      return { current: null };
    }),
    (it.forwardRef = function (E) {
      return { $$typeof: m, render: E };
    }),
    (it.isValidElement = kt),
    (it.lazy = function (E) {
      return { $$typeof: v, _payload: { _status: -1, _result: E }, _init: k };
    }),
    (it.memo = function (E, U) {
      return { $$typeof: p, type: E, compare: U === void 0 ? null : U };
    }),
    (it.startTransition = function (E) {
      var U = P.T,
        K = {};
      P.T = K;
      try {
        var W = E(),
          lt = P.S;
        (lt !== null && lt(K, W),
          typeof W == "object" &&
            W !== null &&
            typeof W.then == "function" &&
            W.then(nt, ut));
      } catch (rt) {
        ut(rt);
      } finally {
        (U !== null && K.types !== null && (U.types = K.types), (P.T = U));
      }
    }),
    (it.unstable_useCacheRefresh = function () {
      return P.H.useCacheRefresh();
    }),
    (it.use = function (E) {
      return P.H.use(E);
    }),
    (it.useActionState = function (E, U, K) {
      return P.H.useActionState(E, U, K);
    }),
    (it.useCallback = function (E, U) {
      return P.H.useCallback(E, U);
    }),
    (it.useContext = function (E) {
      return P.H.useContext(E);
    }),
    (it.useDebugValue = function () {}),
    (it.useDeferredValue = function (E, U) {
      return P.H.useDeferredValue(E, U);
    }),
    (it.useEffect = function (E, U) {
      return P.H.useEffect(E, U);
    }),
    (it.useEffectEvent = function (E) {
      return P.H.useEffectEvent(E);
    }),
    (it.useId = function () {
      return P.H.useId();
    }),
    (it.useImperativeHandle = function (E, U, K) {
      return P.H.useImperativeHandle(E, U, K);
    }),
    (it.useInsertionEffect = function (E, U) {
      return P.H.useInsertionEffect(E, U);
    }),
    (it.useLayoutEffect = function (E, U) {
      return P.H.useLayoutEffect(E, U);
    }),
    (it.useMemo = function (E, U) {
      return P.H.useMemo(E, U);
    }),
    (it.useOptimistic = function (E, U) {
      return P.H.useOptimistic(E, U);
    }),
    (it.useReducer = function (E, U, K) {
      return P.H.useReducer(E, U, K);
    }),
    (it.useRef = function (E) {
      return P.H.useRef(E);
    }),
    (it.useState = function (E) {
      return P.H.useState(E);
    }),
    (it.useSyncExternalStore = function (E, U, K) {
      return P.H.useSyncExternalStore(E, U, K);
    }),
    (it.useTransition = function () {
      return P.H.useTransition();
    }),
    (it.version = "19.2.4"),
    it
  );
}
var h0;
function wc() {
  return (h0 || ((h0 = 1), (Br.exports = tx())), Br.exports);
}
var Y = wc(),
  Lr = { exports: {} },
  fl = {},
  Hr = { exports: {} },
  qr = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var m0;
function ex() {
  return (
    m0 ||
      ((m0 = 1),
      (function (a) {
        function l(_, X) {
          var k = _.length;
          _.push(X);
          t: for (; 0 < k; ) {
            var ut = (k - 1) >>> 1,
              mt = _[ut];
            if (0 < c(mt, X)) ((_[ut] = X), (_[k] = mt), (k = ut));
            else break t;
          }
        }
        function u(_) {
          return _.length === 0 ? null : _[0];
        }
        function o(_) {
          if (_.length === 0) return null;
          var X = _[0],
            k = _.pop();
          if (k !== X) {
            _[0] = k;
            t: for (var ut = 0, mt = _.length, E = mt >>> 1; ut < E; ) {
              var U = 2 * (ut + 1) - 1,
                K = _[U],
                W = U + 1,
                lt = _[W];
              if (0 > c(K, k))
                W < mt && 0 > c(lt, K)
                  ? ((_[ut] = lt), (_[W] = k), (ut = W))
                  : ((_[ut] = K), (_[U] = k), (ut = U));
              else if (W < mt && 0 > c(lt, k))
                ((_[ut] = lt), (_[W] = k), (ut = W));
              else break t;
            }
          }
          return X;
        }
        function c(_, X) {
          var k = _.sortIndex - X.sortIndex;
          return k !== 0 ? k : _.id - X.id;
        }
        if (
          ((a.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var h = performance;
          a.unstable_now = function () {
            return h.now();
          };
        } else {
          var d = Date,
            m = d.now();
          a.unstable_now = function () {
            return d.now() - m;
          };
        }
        var g = [],
          p = [],
          v = 1,
          b = null,
          T = 3,
          C = !1,
          z = !1,
          B = !1,
          H = !1,
          q = typeof setTimeout == "function" ? setTimeout : null,
          G = typeof clearTimeout == "function" ? clearTimeout : null,
          L = typeof setImmediate < "u" ? setImmediate : null;
        function Z(_) {
          for (var X = u(p); X !== null; ) {
            if (X.callback === null) o(p);
            else if (X.startTime <= _)
              (o(p), (X.sortIndex = X.expirationTime), l(g, X));
            else break;
            X = u(p);
          }
        }
        function Q(_) {
          if (((B = !1), Z(_), !z))
            if (u(g) !== null) ((z = !0), nt || ((nt = !0), zt()));
            else {
              var X = u(p);
              X !== null && oe(Q, X.startTime - _);
            }
        }
        var nt = !1,
          P = -1,
          $ = 5,
          at = -1;
        function Dt() {
          return H ? !0 : !(a.unstable_now() - at < $);
        }
        function kt() {
          if (((H = !1), nt)) {
            var _ = a.unstable_now();
            at = _;
            var X = !0;
            try {
              t: {
                ((z = !1), B && ((B = !1), G(P), (P = -1)), (C = !0));
                var k = T;
                try {
                  e: {
                    for (
                      Z(_), b = u(g);
                      b !== null && !(b.expirationTime > _ && Dt());
                    ) {
                      var ut = b.callback;
                      if (typeof ut == "function") {
                        ((b.callback = null), (T = b.priorityLevel));
                        var mt = ut(b.expirationTime <= _);
                        if (((_ = a.unstable_now()), typeof mt == "function")) {
                          ((b.callback = mt), Z(_), (X = !0));
                          break e;
                        }
                        (b === u(g) && o(g), Z(_));
                      } else o(g);
                      b = u(g);
                    }
                    if (b !== null) X = !0;
                    else {
                      var E = u(p);
                      (E !== null && oe(Q, E.startTime - _), (X = !1));
                    }
                  }
                  break t;
                } finally {
                  ((b = null), (T = k), (C = !1));
                }
                X = void 0;
              }
            } finally {
              X ? zt() : (nt = !1);
            }
          }
        }
        var zt;
        if (typeof L == "function")
          zt = function () {
            L(kt);
          };
        else if (typeof MessageChannel < "u") {
          var Ne = new MessageChannel(),
            qe = Ne.port2;
          ((Ne.port1.onmessage = kt),
            (zt = function () {
              qe.postMessage(null);
            }));
        } else
          zt = function () {
            q(kt, 0);
          };
        function oe(_, X) {
          P = q(function () {
            _(a.unstable_now());
          }, X);
        }
        ((a.unstable_IdlePriority = 5),
          (a.unstable_ImmediatePriority = 1),
          (a.unstable_LowPriority = 4),
          (a.unstable_NormalPriority = 3),
          (a.unstable_Profiling = null),
          (a.unstable_UserBlockingPriority = 2),
          (a.unstable_cancelCallback = function (_) {
            _.callback = null;
          }),
          (a.unstable_forceFrameRate = function (_) {
            0 > _ || 125 < _
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : ($ = 0 < _ ? Math.floor(1e3 / _) : 5);
          }),
          (a.unstable_getCurrentPriorityLevel = function () {
            return T;
          }),
          (a.unstable_next = function (_) {
            switch (T) {
              case 1:
              case 2:
              case 3:
                var X = 3;
                break;
              default:
                X = T;
            }
            var k = T;
            T = X;
            try {
              return _();
            } finally {
              T = k;
            }
          }),
          (a.unstable_requestPaint = function () {
            H = !0;
          }),
          (a.unstable_runWithPriority = function (_, X) {
            switch (_) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                _ = 3;
            }
            var k = T;
            T = _;
            try {
              return X();
            } finally {
              T = k;
            }
          }),
          (a.unstable_scheduleCallback = function (_, X, k) {
            var ut = a.unstable_now();
            switch (
              (typeof k == "object" && k !== null
                ? ((k = k.delay),
                  (k = typeof k == "number" && 0 < k ? ut + k : ut))
                : (k = ut),
              _)
            ) {
              case 1:
                var mt = -1;
                break;
              case 2:
                mt = 250;
                break;
              case 5:
                mt = 1073741823;
                break;
              case 4:
                mt = 1e4;
                break;
              default:
                mt = 5e3;
            }
            return (
              (mt = k + mt),
              (_ = {
                id: v++,
                callback: X,
                priorityLevel: _,
                startTime: k,
                expirationTime: mt,
                sortIndex: -1,
              }),
              k > ut
                ? ((_.sortIndex = k),
                  l(p, _),
                  u(g) === null &&
                    _ === u(p) &&
                    (B ? (G(P), (P = -1)) : (B = !0), oe(Q, k - ut)))
                : ((_.sortIndex = mt),
                  l(g, _),
                  z || C || ((z = !0), nt || ((nt = !0), zt()))),
              _
            );
          }),
          (a.unstable_shouldYield = Dt),
          (a.unstable_wrapCallback = function (_) {
            var X = T;
            return function () {
              var k = T;
              T = X;
              try {
                return _.apply(this, arguments);
              } finally {
                T = k;
              }
            };
          }));
      })(qr)),
    qr
  );
}
var p0;
function nx() {
  return (p0 || ((p0 = 1), (Hr.exports = ex())), Hr.exports);
}
var Yr = { exports: {} },
  ne = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var y0;
function ax() {
  if (y0) return ne;
  y0 = 1;
  var a = wc();
  function l(g) {
    var p = "https://react.dev/errors/" + g;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        p += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return (
      "Minified React error #" +
      g +
      "; visit " +
      p +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function u() {}
  var o = {
      d: {
        f: u,
        r: function () {
          throw Error(l(522));
        },
        D: u,
        C: u,
        L: u,
        m: u,
        X: u,
        S: u,
        M: u,
      },
      p: 0,
      findDOMNode: null,
    },
    c = Symbol.for("react.portal");
  function h(g, p, v) {
    var b =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: b == null ? null : "" + b,
      children: g,
      containerInfo: p,
      implementation: v,
    };
  }
  var d = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(g, p) {
    if (g === "font") return "";
    if (typeof p == "string") return p === "use-credentials" ? p : "";
  }
  return (
    (ne.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o),
    (ne.createPortal = function (g, p) {
      var v =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || (p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11))
        throw Error(l(299));
      return h(g, p, null, v);
    }),
    (ne.flushSync = function (g) {
      var p = d.T,
        v = o.p;
      try {
        if (((d.T = null), (o.p = 2), g)) return g();
      } finally {
        ((d.T = p), (o.p = v), o.d.f());
      }
    }),
    (ne.preconnect = function (g, p) {
      typeof g == "string" &&
        (p
          ? ((p = p.crossOrigin),
            (p =
              typeof p == "string"
                ? p === "use-credentials"
                  ? p
                  : ""
                : void 0))
          : (p = null),
        o.d.C(g, p));
    }),
    (ne.prefetchDNS = function (g) {
      typeof g == "string" && o.d.D(g);
    }),
    (ne.preinit = function (g, p) {
      if (typeof g == "string" && p && typeof p.as == "string") {
        var v = p.as,
          b = m(v, p.crossOrigin),
          T = typeof p.integrity == "string" ? p.integrity : void 0,
          C = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        v === "style"
          ? o.d.S(g, typeof p.precedence == "string" ? p.precedence : void 0, {
              crossOrigin: b,
              integrity: T,
              fetchPriority: C,
            })
          : v === "script" &&
            o.d.X(g, {
              crossOrigin: b,
              integrity: T,
              fetchPriority: C,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            });
      }
    }),
    (ne.preinitModule = function (g, p) {
      if (typeof g == "string")
        if (typeof p == "object" && p !== null) {
          if (p.as == null || p.as === "script") {
            var v = m(p.as, p.crossOrigin);
            o.d.M(g, {
              crossOrigin: v,
              integrity: typeof p.integrity == "string" ? p.integrity : void 0,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            });
          }
        } else p == null && o.d.M(g);
    }),
    (ne.preload = function (g, p) {
      if (
        typeof g == "string" &&
        typeof p == "object" &&
        p !== null &&
        typeof p.as == "string"
      ) {
        var v = p.as,
          b = m(v, p.crossOrigin);
        o.d.L(g, v, {
          crossOrigin: b,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0,
          type: typeof p.type == "string" ? p.type : void 0,
          fetchPriority:
            typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
          referrerPolicy:
            typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
          imageSrcSet:
            typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
          imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
          media: typeof p.media == "string" ? p.media : void 0,
        });
      }
    }),
    (ne.preloadModule = function (g, p) {
      if (typeof g == "string")
        if (p) {
          var v = m(p.as, p.crossOrigin);
          o.d.m(g, {
            as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
            crossOrigin: v,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          });
        } else o.d.m(g);
    }),
    (ne.requestFormReset = function (g) {
      o.d.r(g);
    }),
    (ne.unstable_batchedUpdates = function (g, p) {
      return g(p);
    }),
    (ne.useFormState = function (g, p, v) {
      return d.H.useFormState(g, p, v);
    }),
    (ne.useFormStatus = function () {
      return d.H.useHostTransitionStatus();
    }),
    (ne.version = "19.2.4"),
    ne
  );
}
var g0;
function ix() {
  if (g0) return Yr.exports;
  g0 = 1;
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return (a(), (Yr.exports = ax()), Yr.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var v0;
function lx() {
  if (v0) return fl;
  v0 = 1;
  var a = nx(),
    l = wc(),
    u = ix();
  function o(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return (
      "Minified React error #" +
      t +
      "; visit " +
      e +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function c(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function h(t) {
    var e = t,
      n = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do ((e = t), (e.flags & 4098) !== 0 && (n = e.return), (t = e.return));
      while (t);
    }
    return e.tag === 3 ? n : null;
  }
  function d(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (
        (e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)),
        e !== null)
      )
        return e.dehydrated;
    }
    return null;
  }
  function m(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (
        (e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)),
        e !== null)
      )
        return e.dehydrated;
    }
    return null;
  }
  function g(t) {
    if (h(t) !== t) throw Error(o(188));
  }
  function p(t) {
    var e = t.alternate;
    if (!e) {
      if (((e = h(t)), e === null)) throw Error(o(188));
      return e !== t ? null : t;
    }
    for (var n = t, i = e; ; ) {
      var s = n.return;
      if (s === null) break;
      var r = s.alternate;
      if (r === null) {
        if (((i = s.return), i !== null)) {
          n = i;
          continue;
        }
        break;
      }
      if (s.child === r.child) {
        for (r = s.child; r; ) {
          if (r === n) return (g(s), t);
          if (r === i) return (g(s), e);
          r = r.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== i.return) ((n = s), (i = r));
      else {
        for (var f = !1, y = s.child; y; ) {
          if (y === n) {
            ((f = !0), (n = s), (i = r));
            break;
          }
          if (y === i) {
            ((f = !0), (i = s), (n = r));
            break;
          }
          y = y.sibling;
        }
        if (!f) {
          for (y = r.child; y; ) {
            if (y === n) {
              ((f = !0), (n = r), (i = s));
              break;
            }
            if (y === i) {
              ((f = !0), (i = r), (n = s));
              break;
            }
            y = y.sibling;
          }
          if (!f) throw Error(o(189));
        }
      }
      if (n.alternate !== i) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? t : e;
  }
  function v(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((e = v(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var b = Object.assign,
    T = Symbol.for("react.element"),
    C = Symbol.for("react.transitional.element"),
    z = Symbol.for("react.portal"),
    B = Symbol.for("react.fragment"),
    H = Symbol.for("react.strict_mode"),
    q = Symbol.for("react.profiler"),
    G = Symbol.for("react.consumer"),
    L = Symbol.for("react.context"),
    Z = Symbol.for("react.forward_ref"),
    Q = Symbol.for("react.suspense"),
    nt = Symbol.for("react.suspense_list"),
    P = Symbol.for("react.memo"),
    $ = Symbol.for("react.lazy"),
    at = Symbol.for("react.activity"),
    Dt = Symbol.for("react.memo_cache_sentinel"),
    kt = Symbol.iterator;
  function zt(t) {
    return t === null || typeof t != "object"
      ? null
      : ((t = (kt && t[kt]) || t["@@iterator"]),
        typeof t == "function" ? t : null);
  }
  var Ne = Symbol.for("react.client.reference");
  function qe(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === Ne ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case B:
        return "Fragment";
      case q:
        return "Profiler";
      case H:
        return "StrictMode";
      case Q:
        return "Suspense";
      case nt:
        return "SuspenseList";
      case at:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case z:
          return "Portal";
        case L:
          return t.displayName || "Context";
        case G:
          return (t._context.displayName || "Context") + ".Consumer";
        case Z:
          var e = t.render;
          return (
            (t = t.displayName),
            t ||
              ((t = e.displayName || e.name || ""),
              (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
            t
          );
        case P:
          return (
            (e = t.displayName || null),
            e !== null ? e : qe(t.type) || "Memo"
          );
        case $:
          ((e = t._payload), (t = t._init));
          try {
            return qe(t(e));
          } catch {}
      }
    return null;
  }
  var oe = Array.isArray,
    _ = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    X = u.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    k = { pending: !1, data: null, method: null, action: null },
    ut = [],
    mt = -1;
  function E(t) {
    return { current: t };
  }
  function U(t) {
    0 > mt || ((t.current = ut[mt]), (ut[mt] = null), mt--);
  }
  function K(t, e) {
    (mt++, (ut[mt] = t.current), (t.current = e));
  }
  var W = E(null),
    lt = E(null),
    rt = E(null),
    xt = E(null);
  function ie(t, e) {
    switch ((K(rt, e), K(lt, t), K(W, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? _m(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI)))
          ((e = _m(e)), (t = Om(e, t)));
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    (U(W), K(W, t));
  }
  function Ut() {
    (U(W), U(lt), U(rt));
  }
  function gi(t) {
    t.memoizedState !== null && K(xt, t);
    var e = W.current,
      n = Om(e, t.type);
    e !== n && (K(lt, t), K(W, n));
  }
  function wl(t) {
    (lt.current === t && (U(W), U(lt)),
      xt.current === t && (U(xt), (sl._currentValue = k)));
  }
  var gu, rf;
  function $n(t) {
    if (gu === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        ((gu = (e && e[1]) || ""),
          (rf =
            -1 <
            n.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < n.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      gu +
      t +
      rf
    );
  }
  var vu = !1;
  function xu(t, e) {
    if (!t || vu) return "";
    vu = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var V = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(V.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(V, []);
                } catch (w) {
                  var j = w;
                }
                Reflect.construct(t, [], V);
              } else {
                try {
                  V.call();
                } catch (w) {
                  j = w;
                }
                t.call(V.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (w) {
                j = w;
              }
              (V = t()) &&
                typeof V.catch == "function" &&
                V.catch(function () {});
            }
          } catch (w) {
            if (w && j && typeof w.stack == "string") return [w.stack, j.stack];
          }
          return [null, null];
        },
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var s = Object.getOwnPropertyDescriptor(
        i.DetermineComponentFrameRoot,
        "name",
      );
      s &&
        s.configurable &&
        Object.defineProperty(i.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var r = i.DetermineComponentFrameRoot(),
        f = r[0],
        y = r[1];
      if (f && y) {
        var S = f.split(`
`),
          N = y.split(`
`);
        for (
          s = i = 0;
          i < S.length && !S[i].includes("DetermineComponentFrameRoot");
        )
          i++;
        for (; s < N.length && !N[s].includes("DetermineComponentFrameRoot"); )
          s++;
        if (i === S.length || s === N.length)
          for (
            i = S.length - 1, s = N.length - 1;
            1 <= i && 0 <= s && S[i] !== N[s];
          )
            s--;
        for (; 1 <= i && 0 <= s; i--, s--)
          if (S[i] !== N[s]) {
            if (i !== 1 || s !== 1)
              do
                if ((i--, s--, 0 > s || S[i] !== N[s])) {
                  var R =
                    `
` + S[i].replace(" at new ", " at ");
                  return (
                    t.displayName &&
                      R.includes("<anonymous>") &&
                      (R = R.replace("<anonymous>", t.displayName)),
                    R
                  );
                }
              while (1 <= i && 0 <= s);
            break;
          }
      }
    } finally {
      ((vu = !1), (Error.prepareStackTrace = n));
    }
    return (n = t ? t.displayName || t.name : "") ? $n(n) : "";
  }
  function Cg(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return $n(t.type);
      case 16:
        return $n("Lazy");
      case 13:
        return t.child !== e && e !== null
          ? $n("Suspense Fallback")
          : $n("Suspense");
      case 19:
        return $n("SuspenseList");
      case 0:
      case 15:
        return xu(t.type, !1);
      case 11:
        return xu(t.type.render, !1);
      case 1:
        return xu(t.type, !0);
      case 31:
        return $n("Activity");
      default:
        return "";
    }
  }
  function cf(t) {
    try {
      var e = "",
        n = null;
      do ((e += Cg(t, n)), (n = t), (t = t.return));
      while (t);
      return e;
    } catch (i) {
      return (
        `
Error generating stack: ` +
        i.message +
        `
` +
        i.stack
      );
    }
  }
  var bu = Object.prototype.hasOwnProperty,
    Su = a.unstable_scheduleCallback,
    Tu = a.unstable_cancelCallback,
    wg = a.unstable_shouldYield,
    zg = a.unstable_requestPaint,
    ye = a.unstable_now,
    Rg = a.unstable_getCurrentPriorityLevel,
    ff = a.unstable_ImmediatePriority,
    df = a.unstable_UserBlockingPriority,
    zl = a.unstable_NormalPriority,
    _g = a.unstable_LowPriority,
    hf = a.unstable_IdlePriority,
    Og = a.log,
    Vg = a.unstable_setDisableYieldValue,
    vi = null,
    ge = null;
  function Tn(t) {
    if (
      (typeof Og == "function" && Vg(t),
      ge && typeof ge.setStrictMode == "function")
    )
      try {
        ge.setStrictMode(vi, t);
      } catch {}
  }
  var ve = Math.clz32 ? Math.clz32 : Lg,
    Ug = Math.log,
    Bg = Math.LN2;
  function Lg(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((Ug(t) / Bg) | 0)) | 0);
  }
  var Rl = 256,
    _l = 262144,
    Ol = 4194304;
  function In(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Vl(t, e, n) {
    var i = t.pendingLanes;
    if (i === 0) return 0;
    var s = 0,
      r = t.suspendedLanes,
      f = t.pingedLanes;
    t = t.warmLanes;
    var y = i & 134217727;
    return (
      y !== 0
        ? ((i = y & ~r),
          i !== 0
            ? (s = In(i))
            : ((f &= y),
              f !== 0
                ? (s = In(f))
                : n || ((n = y & ~t), n !== 0 && (s = In(n)))))
        : ((y = i & ~r),
          y !== 0
            ? (s = In(y))
            : f !== 0
              ? (s = In(f))
              : n || ((n = i & ~t), n !== 0 && (s = In(n)))),
      s === 0
        ? 0
        : e !== 0 &&
            e !== s &&
            (e & r) === 0 &&
            ((r = s & -s),
            (n = e & -e),
            r >= n || (r === 32 && (n & 4194048) !== 0))
          ? e
          : s
    );
  }
  function xi(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Hg(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function mf() {
    var t = Ol;
    return ((Ol <<= 1), (Ol & 62914560) === 0 && (Ol = 4194304), t);
  }
  function Au(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function bi(t, e) {
    ((t.pendingLanes |= e),
      e !== 268435456 &&
        ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function qg(t, e, n, i, s, r) {
    var f = t.pendingLanes;
    ((t.pendingLanes = n),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= n),
      (t.entangledLanes &= n),
      (t.errorRecoveryDisabledLanes &= n),
      (t.shellSuspendCounter = 0));
    var y = t.entanglements,
      S = t.expirationTimes,
      N = t.hiddenUpdates;
    for (n = f & ~n; 0 < n; ) {
      var R = 31 - ve(n),
        V = 1 << R;
      ((y[R] = 0), (S[R] = -1));
      var j = N[R];
      if (j !== null)
        for (N[R] = null, R = 0; R < j.length; R++) {
          var w = j[R];
          w !== null && (w.lane &= -536870913);
        }
      n &= ~V;
    }
    (i !== 0 && pf(t, i, 0),
      r !== 0 && s === 0 && t.tag !== 0 && (t.suspendedLanes |= r & ~(f & ~e)));
  }
  function pf(t, e, n) {
    ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
    var i = 31 - ve(e);
    ((t.entangledLanes |= e),
      (t.entanglements[i] = t.entanglements[i] | 1073741824 | (n & 261930)));
  }
  function yf(t, e) {
    var n = (t.entangledLanes |= e);
    for (t = t.entanglements; n; ) {
      var i = 31 - ve(n),
        s = 1 << i;
      ((s & e) | (t[i] & e) && (t[i] |= e), (n &= ~s));
    }
  }
  function gf(t, e) {
    var n = e & -e;
    return (
      (n = (n & 42) !== 0 ? 1 : Eu(n)),
      (n & (t.suspendedLanes | e)) !== 0 ? 0 : n
    );
  }
  function Eu(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Mu(t) {
    return (
      (t &= -t),
      2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function vf() {
    var t = X.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : a0(t.type));
  }
  function xf(t, e) {
    var n = X.p;
    try {
      return ((X.p = t), e());
    } finally {
      X.p = n;
    }
  }
  var An = Math.random().toString(36).slice(2),
    Wt = "__reactFiber$" + An,
    re = "__reactProps$" + An,
    Ta = "__reactContainer$" + An,
    Du = "__reactEvents$" + An,
    Yg = "__reactListeners$" + An,
    Gg = "__reactHandles$" + An,
    bf = "__reactResources$" + An,
    Si = "__reactMarker$" + An;
  function Nu(t) {
    (delete t[Wt], delete t[re], delete t[Du], delete t[Yg], delete t[Gg]);
  }
  function Aa(t) {
    var e = t[Wt];
    if (e) return e;
    for (var n = t.parentNode; n; ) {
      if ((e = n[Ta] || n[Wt])) {
        if (
          ((n = e.alternate),
          e.child !== null || (n !== null && n.child !== null))
        )
          for (t = Ym(t); t !== null; ) {
            if ((n = t[Wt])) return n;
            t = Ym(t);
          }
        return e;
      }
      ((t = n), (n = t.parentNode));
    }
    return null;
  }
  function Ea(t) {
    if ((t = t[Wt] || t[Ta])) {
      var e = t.tag;
      if (
        e === 5 ||
        e === 6 ||
        e === 13 ||
        e === 31 ||
        e === 26 ||
        e === 27 ||
        e === 3
      )
        return t;
    }
    return null;
  }
  function Ti(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(o(33));
  }
  function Ma(t) {
    var e = t[bf];
    return (
      e ||
        (e = t[bf] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      e
    );
  }
  function Jt(t) {
    t[Si] = !0;
  }
  var Sf = new Set(),
    Tf = {};
  function ta(t, e) {
    (Da(t, e), Da(t + "Capture", e));
  }
  function Da(t, e) {
    for (Tf[t] = e, t = 0; t < e.length; t++) Sf.add(e[t]);
  }
  var Xg = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Af = {},
    Ef = {};
  function Zg(t) {
    return bu.call(Ef, t)
      ? !0
      : bu.call(Af, t)
        ? !1
        : Xg.test(t)
          ? (Ef[t] = !0)
          : ((Af[t] = !0), !1);
  }
  function Ul(t, e, n) {
    if (Zg(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var i = e.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + n);
      }
  }
  function Bl(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + n);
    }
  }
  function en(t, e, n, i) {
    if (i === null) t.removeAttribute(n);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, "" + i);
    }
  }
  function je(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Mf(t) {
    var e = t.type;
    return (
      (t = t.nodeName) &&
      t.toLowerCase() === "input" &&
      (e === "checkbox" || e === "radio")
    );
  }
  function Qg(t, e, n) {
    var i = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
    if (
      !t.hasOwnProperty(e) &&
      typeof i < "u" &&
      typeof i.get == "function" &&
      typeof i.set == "function"
    ) {
      var s = i.get,
        r = i.set;
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return s.call(this);
          },
          set: function (f) {
            ((n = "" + f), r.call(this, f));
          },
        }),
        Object.defineProperty(t, e, { enumerable: i.enumerable }),
        {
          getValue: function () {
            return n;
          },
          setValue: function (f) {
            n = "" + f;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[e]);
          },
        }
      );
    }
  }
  function ju(t) {
    if (!t._valueTracker) {
      var e = Mf(t) ? "checked" : "value";
      t._valueTracker = Qg(t, e, "" + t[e]);
    }
  }
  function Df(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(),
      i = "";
    return (
      t && (i = Mf(t) ? (t.checked ? "true" : "false") : t.value),
      (t = i),
      t !== n ? (e.setValue(t), !0) : !1
    );
  }
  function Ll(t) {
    if (
      ((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")
    )
      return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Kg = /[\n"\\]/g;
  function Ce(t) {
    return t.replace(Kg, function (e) {
      return "\\" + e.charCodeAt(0).toString(16) + " ";
    });
  }
  function Cu(t, e, n, i, s, r, f, y) {
    ((t.name = ""),
      f != null &&
      typeof f != "function" &&
      typeof f != "symbol" &&
      typeof f != "boolean"
        ? (t.type = f)
        : t.removeAttribute("type"),
      e != null
        ? f === "number"
          ? ((e === 0 && t.value === "") || t.value != e) &&
            (t.value = "" + je(e))
          : t.value !== "" + je(e) && (t.value = "" + je(e))
        : (f !== "submit" && f !== "reset") || t.removeAttribute("value"),
      e != null
        ? wu(t, f, je(e))
        : n != null
          ? wu(t, f, je(n))
          : i != null && t.removeAttribute("value"),
      s == null && r != null && (t.defaultChecked = !!r),
      s != null &&
        (t.checked = s && typeof s != "function" && typeof s != "symbol"),
      y != null &&
      typeof y != "function" &&
      typeof y != "symbol" &&
      typeof y != "boolean"
        ? (t.name = "" + je(y))
        : t.removeAttribute("name"));
  }
  function Nf(t, e, n, i, s, r, f, y) {
    if (
      (r != null &&
        typeof r != "function" &&
        typeof r != "symbol" &&
        typeof r != "boolean" &&
        (t.type = r),
      e != null || n != null)
    ) {
      if (!((r !== "submit" && r !== "reset") || e != null)) {
        ju(t);
        return;
      }
      ((n = n != null ? "" + je(n) : ""),
        (e = e != null ? "" + je(e) : n),
        y || e === t.value || (t.value = e),
        (t.defaultValue = e));
    }
    ((i = i ?? s),
      (i = typeof i != "function" && typeof i != "symbol" && !!i),
      (t.checked = y ? t.checked : !!i),
      (t.defaultChecked = !!i),
      f != null &&
        typeof f != "function" &&
        typeof f != "symbol" &&
        typeof f != "boolean" &&
        (t.name = f),
      ju(t));
  }
  function wu(t, e, n) {
    (e === "number" && Ll(t.ownerDocument) === t) ||
      t.defaultValue === "" + n ||
      (t.defaultValue = "" + n);
  }
  function Na(t, e, n, i) {
    if (((t = t.options), e)) {
      e = {};
      for (var s = 0; s < n.length; s++) e["$" + n[s]] = !0;
      for (n = 0; n < t.length; n++)
        ((s = e.hasOwnProperty("$" + t[n].value)),
          t[n].selected !== s && (t[n].selected = s),
          s && i && (t[n].defaultSelected = !0));
    } else {
      for (n = "" + je(n), e = null, s = 0; s < t.length; s++) {
        if (t[s].value === n) {
          ((t[s].selected = !0), i && (t[s].defaultSelected = !0));
          return;
        }
        e !== null || t[s].disabled || (e = t[s]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function jf(t, e, n) {
    if (
      e != null &&
      ((e = "" + je(e)), e !== t.value && (t.value = e), n == null)
    ) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + je(n) : "";
  }
  function Cf(t, e, n, i) {
    if (e == null) {
      if (i != null) {
        if (n != null) throw Error(o(92));
        if (oe(i)) {
          if (1 < i.length) throw Error(o(93));
          i = i[0];
        }
        n = i;
      }
      (n == null && (n = ""), (e = n));
    }
    ((n = je(e)),
      (t.defaultValue = n),
      (i = t.textContent),
      i === n && i !== "" && i !== null && (t.value = i),
      ju(t));
  }
  function ja(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var kg = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function wf(t, e, n) {
    var i = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === ""
      ? i
        ? t.setProperty(e, "")
        : e === "float"
          ? (t.cssFloat = "")
          : (t[e] = "")
      : i
        ? t.setProperty(e, n)
        : typeof n != "number" || n === 0 || kg.has(e)
          ? e === "float"
            ? (t.cssFloat = n)
            : (t[e] = ("" + n).trim())
          : (t[e] = n + "px");
  }
  function zf(t, e, n) {
    if (e != null && typeof e != "object") throw Error(o(62));
    if (((t = t.style), n != null)) {
      for (var i in n)
        !n.hasOwnProperty(i) ||
          (e != null && e.hasOwnProperty(i)) ||
          (i.indexOf("--") === 0
            ? t.setProperty(i, "")
            : i === "float"
              ? (t.cssFloat = "")
              : (t[i] = ""));
      for (var s in e)
        ((i = e[s]), e.hasOwnProperty(s) && n[s] !== i && wf(t, s, i));
    } else for (var r in e) e.hasOwnProperty(r) && wf(t, r, e[r]);
  }
  function zu(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Jg = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    Fg =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Hl(t) {
    return Fg.test("" + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  function nn() {}
  var Ru = null;
  function _u(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var Ca = null,
    wa = null;
  function Rf(t) {
    var e = Ea(t);
    if (e && (t = e.stateNode)) {
      var n = t[re] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case "input":
          if (
            (Cu(
              t,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
            ),
            (e = n.name),
            n.type === "radio" && e != null)
          ) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (
              n = n.querySelectorAll(
                'input[name="' + Ce("" + e) + '"][type="radio"]',
              ),
                e = 0;
              e < n.length;
              e++
            ) {
              var i = n[e];
              if (i !== t && i.form === t.form) {
                var s = i[re] || null;
                if (!s) throw Error(o(90));
                Cu(
                  i,
                  s.value,
                  s.defaultValue,
                  s.defaultValue,
                  s.checked,
                  s.defaultChecked,
                  s.type,
                  s.name,
                );
              }
            }
            for (e = 0; e < n.length; e++)
              ((i = n[e]), i.form === t.form && Df(i));
          }
          break t;
        case "textarea":
          jf(t, n.value, n.defaultValue);
          break t;
        case "select":
          ((e = n.value), e != null && Na(t, !!n.multiple, e, !1));
      }
    }
  }
  var Ou = !1;
  function _f(t, e, n) {
    if (Ou) return t(e, n);
    Ou = !0;
    try {
      var i = t(e);
      return i;
    } finally {
      if (
        ((Ou = !1),
        (Ca !== null || wa !== null) &&
          (Ds(), Ca && ((e = Ca), (t = wa), (wa = Ca = null), Rf(e), t)))
      )
        for (e = 0; e < t.length; e++) Rf(t[e]);
    }
  }
  function Ai(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var i = n[re] || null;
    if (i === null) return null;
    n = i[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((i = !i.disabled) ||
          ((t = t.type),
          (i = !(
            t === "button" ||
            t === "input" ||
            t === "select" ||
            t === "textarea"
          ))),
          (t = !i));
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function") throw Error(o(231, e, typeof n));
    return n;
  }
  var an = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    Vu = !1;
  if (an)
    try {
      var Ei = {};
      (Object.defineProperty(Ei, "passive", {
        get: function () {
          Vu = !0;
        },
      }),
        window.addEventListener("test", Ei, Ei),
        window.removeEventListener("test", Ei, Ei));
    } catch {
      Vu = !1;
    }
  var En = null,
    Uu = null,
    ql = null;
  function Of() {
    if (ql) return ql;
    var t,
      e = Uu,
      n = e.length,
      i,
      s = "value" in En ? En.value : En.textContent,
      r = s.length;
    for (t = 0; t < n && e[t] === s[t]; t++);
    var f = n - t;
    for (i = 1; i <= f && e[n - i] === s[r - i]; i++);
    return (ql = s.slice(t, 1 < i ? 1 - i : void 0));
  }
  function Yl(t) {
    var e = t.keyCode;
    return (
      "charCode" in t
        ? ((t = t.charCode), t === 0 && e === 13 && (t = 13))
        : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function Gl() {
    return !0;
  }
  function Vf() {
    return !1;
  }
  function ce(t) {
    function e(n, i, s, r, f) {
      ((this._reactName = n),
        (this._targetInst = s),
        (this.type = i),
        (this.nativeEvent = r),
        (this.target = f),
        (this.currentTarget = null));
      for (var y in t)
        t.hasOwnProperty(y) && ((n = t[y]), (this[y] = n ? n(r) : r[y]));
      return (
        (this.isDefaultPrevented = (
          r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === !1
        )
          ? Gl
          : Vf),
        (this.isPropagationStopped = Vf),
        this
      );
    }
    return (
      b(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = Gl));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = Gl));
        },
        persist: function () {},
        isPersistent: Gl,
      }),
      e
    );
  }
  var ea = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Xl = ce(ea),
    Mi = b({}, ea, { view: 0, detail: 0 }),
    Wg = ce(Mi),
    Bu,
    Lu,
    Di,
    Zl = b({}, Mi, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: qu,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return "movementX" in t
          ? t.movementX
          : (t !== Di &&
              (Di && t.type === "mousemove"
                ? ((Bu = t.screenX - Di.screenX), (Lu = t.screenY - Di.screenY))
                : (Lu = Bu = 0),
              (Di = t)),
            Bu);
      },
      movementY: function (t) {
        return "movementY" in t ? t.movementY : Lu;
      },
    }),
    Uf = ce(Zl),
    Pg = b({}, Zl, { dataTransfer: 0 }),
    $g = ce(Pg),
    Ig = b({}, Mi, { relatedTarget: 0 }),
    Hu = ce(Ig),
    tv = b({}, ea, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    ev = ce(tv),
    nv = b({}, ea, {
      clipboardData: function (t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      },
    }),
    av = ce(nv),
    iv = b({}, ea, { data: 0 }),
    Bf = ce(iv),
    lv = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    sv = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    uv = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function ov(t) {
    var e = this.nativeEvent;
    return e.getModifierState
      ? e.getModifierState(t)
      : (t = uv[t])
        ? !!e[t]
        : !1;
  }
  function qu() {
    return ov;
  }
  var rv = b({}, Mi, {
      key: function (t) {
        if (t.key) {
          var e = lv[t.key] || t.key;
          if (e !== "Unidentified") return e;
        }
        return t.type === "keypress"
          ? ((t = Yl(t)), t === 13 ? "Enter" : String.fromCharCode(t))
          : t.type === "keydown" || t.type === "keyup"
            ? sv[t.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: qu,
      charCode: function (t) {
        return t.type === "keypress" ? Yl(t) : 0;
      },
      keyCode: function (t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === "keypress"
          ? Yl(t)
          : t.type === "keydown" || t.type === "keyup"
            ? t.keyCode
            : 0;
      },
    }),
    cv = ce(rv),
    fv = b({}, Zl, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Lf = ce(fv),
    dv = b({}, Mi, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: qu,
    }),
    hv = ce(dv),
    mv = b({}, ea, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    pv = ce(mv),
    yv = b({}, Zl, {
      deltaX: function (t) {
        return "deltaX" in t
          ? t.deltaX
          : "wheelDeltaX" in t
            ? -t.wheelDeltaX
            : 0;
      },
      deltaY: function (t) {
        return "deltaY" in t
          ? t.deltaY
          : "wheelDeltaY" in t
            ? -t.wheelDeltaY
            : "wheelDelta" in t
              ? -t.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    gv = ce(yv),
    vv = b({}, ea, { newState: 0, oldState: 0 }),
    xv = ce(vv),
    bv = [9, 13, 27, 32],
    Yu = an && "CompositionEvent" in window,
    Ni = null;
  an && "documentMode" in document && (Ni = document.documentMode);
  var Sv = an && "TextEvent" in window && !Ni,
    Hf = an && (!Yu || (Ni && 8 < Ni && 11 >= Ni)),
    qf = " ",
    Yf = !1;
  function Gf(t, e) {
    switch (t) {
      case "keyup":
        return bv.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Xf(t) {
    return (
      (t = t.detail),
      typeof t == "object" && "data" in t ? t.data : null
    );
  }
  var za = !1;
  function Tv(t, e) {
    switch (t) {
      case "compositionend":
        return Xf(e);
      case "keypress":
        return e.which !== 32 ? null : ((Yf = !0), qf);
      case "textInput":
        return ((t = e.data), t === qf && Yf ? null : t);
      default:
        return null;
    }
  }
  function Av(t, e) {
    if (za)
      return t === "compositionend" || (!Yu && Gf(t, e))
        ? ((t = Of()), (ql = Uu = En = null), (za = !1), t)
        : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return Hf && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Ev = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Zf(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!Ev[t.type] : e === "textarea";
  }
  function Qf(t, e, n, i) {
    (Ca ? (wa ? wa.push(i) : (wa = [i])) : (Ca = i),
      (e = _s(e, "onChange")),
      0 < e.length &&
        ((n = new Xl("onChange", "change", null, n, i)),
        t.push({ event: n, listeners: e })));
  }
  var ji = null,
    Ci = null;
  function Mv(t) {
    Nm(t, 0);
  }
  function Ql(t) {
    var e = Ti(t);
    if (Df(e)) return t;
  }
  function Kf(t, e) {
    if (t === "change") return e;
  }
  var kf = !1;
  if (an) {
    var Gu;
    if (an) {
      var Xu = "oninput" in document;
      if (!Xu) {
        var Jf = document.createElement("div");
        (Jf.setAttribute("oninput", "return;"),
          (Xu = typeof Jf.oninput == "function"));
      }
      Gu = Xu;
    } else Gu = !1;
    kf = Gu && (!document.documentMode || 9 < document.documentMode);
  }
  function Ff() {
    ji && (ji.detachEvent("onpropertychange", Wf), (Ci = ji = null));
  }
  function Wf(t) {
    if (t.propertyName === "value" && Ql(Ci)) {
      var e = [];
      (Qf(e, Ci, t, _u(t)), _f(Mv, e));
    }
  }
  function Dv(t, e, n) {
    t === "focusin"
      ? (Ff(), (ji = e), (Ci = n), ji.attachEvent("onpropertychange", Wf))
      : t === "focusout" && Ff();
  }
  function Nv(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Ql(Ci);
  }
  function jv(t, e) {
    if (t === "click") return Ql(e);
  }
  function Cv(t, e) {
    if (t === "input" || t === "change") return Ql(e);
  }
  function wv(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var xe = typeof Object.is == "function" ? Object.is : wv;
  function wi(t, e) {
    if (xe(t, e)) return !0;
    if (
      typeof t != "object" ||
      t === null ||
      typeof e != "object" ||
      e === null
    )
      return !1;
    var n = Object.keys(t),
      i = Object.keys(e);
    if (n.length !== i.length) return !1;
    for (i = 0; i < n.length; i++) {
      var s = n[i];
      if (!bu.call(e, s) || !xe(t[s], e[s])) return !1;
    }
    return !0;
  }
  function Pf(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function $f(t, e) {
    var n = Pf(t);
    t = 0;
    for (var i; n; ) {
      if (n.nodeType === 3) {
        if (((i = t + n.textContent.length), t <= e && i >= e))
          return { node: n, offset: e - t };
        t = i;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Pf(n);
    }
  }
  function If(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? If(t, e.parentNode)
            : "contains" in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function td(t) {
    t =
      t != null &&
      t.ownerDocument != null &&
      t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = Ll(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = Ll(t.document);
    }
    return e;
  }
  function Zu(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      e &&
      ((e === "input" &&
        (t.type === "text" ||
          t.type === "search" ||
          t.type === "tel" ||
          t.type === "url" ||
          t.type === "password")) ||
        e === "textarea" ||
        t.contentEditable === "true")
    );
  }
  var zv = an && "documentMode" in document && 11 >= document.documentMode,
    Ra = null,
    Qu = null,
    zi = null,
    Ku = !1;
  function ed(t, e, n) {
    var i =
      n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Ku ||
      Ra == null ||
      Ra !== Ll(i) ||
      ((i = Ra),
      "selectionStart" in i && Zu(i)
        ? (i = { start: i.selectionStart, end: i.selectionEnd })
        : ((i = (
            (i.ownerDocument && i.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (i = {
            anchorNode: i.anchorNode,
            anchorOffset: i.anchorOffset,
            focusNode: i.focusNode,
            focusOffset: i.focusOffset,
          })),
      (zi && wi(zi, i)) ||
        ((zi = i),
        (i = _s(Qu, "onSelect")),
        0 < i.length &&
          ((e = new Xl("onSelect", "select", null, e, n)),
          t.push({ event: e, listeners: i }),
          (e.target = Ra))));
  }
  function na(t, e) {
    var n = {};
    return (
      (n[t.toLowerCase()] = e.toLowerCase()),
      (n["Webkit" + t] = "webkit" + e),
      (n["Moz" + t] = "moz" + e),
      n
    );
  }
  var _a = {
      animationend: na("Animation", "AnimationEnd"),
      animationiteration: na("Animation", "AnimationIteration"),
      animationstart: na("Animation", "AnimationStart"),
      transitionrun: na("Transition", "TransitionRun"),
      transitionstart: na("Transition", "TransitionStart"),
      transitioncancel: na("Transition", "TransitionCancel"),
      transitionend: na("Transition", "TransitionEnd"),
    },
    ku = {},
    nd = {};
  an &&
    ((nd = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete _a.animationend.animation,
      delete _a.animationiteration.animation,
      delete _a.animationstart.animation),
    "TransitionEvent" in window || delete _a.transitionend.transition);
  function aa(t) {
    if (ku[t]) return ku[t];
    if (!_a[t]) return t;
    var e = _a[t],
      n;
    for (n in e) if (e.hasOwnProperty(n) && n in nd) return (ku[t] = e[n]);
    return t;
  }
  var ad = aa("animationend"),
    id = aa("animationiteration"),
    ld = aa("animationstart"),
    Rv = aa("transitionrun"),
    _v = aa("transitionstart"),
    Ov = aa("transitioncancel"),
    sd = aa("transitionend"),
    ud = new Map(),
    Ju =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  Ju.push("scrollEnd");
  function Ye(t, e) {
    (ud.set(t, e), ta(e, [t]));
  }
  var Kl =
      typeof reportError == "function"
        ? reportError
        : function (t) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var e = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof t == "object" &&
                  t !== null &&
                  typeof t.message == "string"
                    ? String(t.message)
                    : String(t),
                error: t,
              });
              if (!window.dispatchEvent(e)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", t);
              return;
            }
            console.error(t);
          },
    we = [],
    Oa = 0,
    Fu = 0;
  function kl() {
    for (var t = Oa, e = (Fu = Oa = 0); e < t; ) {
      var n = we[e];
      we[e++] = null;
      var i = we[e];
      we[e++] = null;
      var s = we[e];
      we[e++] = null;
      var r = we[e];
      if (((we[e++] = null), i !== null && s !== null)) {
        var f = i.pending;
        (f === null ? (s.next = s) : ((s.next = f.next), (f.next = s)),
          (i.pending = s));
      }
      r !== 0 && od(n, s, r);
    }
  }
  function Jl(t, e, n, i) {
    ((we[Oa++] = t),
      (we[Oa++] = e),
      (we[Oa++] = n),
      (we[Oa++] = i),
      (Fu |= i),
      (t.lanes |= i),
      (t = t.alternate),
      t !== null && (t.lanes |= i));
  }
  function Wu(t, e, n, i) {
    return (Jl(t, e, n, i), Fl(t));
  }
  function ia(t, e) {
    return (Jl(t, null, null, e), Fl(t));
  }
  function od(t, e, n) {
    t.lanes |= n;
    var i = t.alternate;
    i !== null && (i.lanes |= n);
    for (var s = !1, r = t.return; r !== null; )
      ((r.childLanes |= n),
        (i = r.alternate),
        i !== null && (i.childLanes |= n),
        r.tag === 22 &&
          ((t = r.stateNode), t === null || t._visibility & 1 || (s = !0)),
        (t = r),
        (r = r.return));
    return t.tag === 3
      ? ((r = t.stateNode),
        s &&
          e !== null &&
          ((s = 31 - ve(n)),
          (t = r.hiddenUpdates),
          (i = t[s]),
          i === null ? (t[s] = [e]) : i.push(e),
          (e.lane = n | 536870912)),
        r)
      : null;
  }
  function Fl(t) {
    if (50 < Ii) throw ((Ii = 0), (sr = null), Error(o(185)));
    for (var e = t.return; e !== null; ) ((t = e), (e = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var Va = {};
  function Vv(t, e, n, i) {
    ((this.tag = t),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = i),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function be(t, e, n, i) {
    return new Vv(t, e, n, i);
  }
  function Pu(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function ln(t, e) {
    var n = t.alternate;
    return (
      n === null
        ? ((n = be(t.tag, e, t.key, t.mode)),
          (n.elementType = t.elementType),
          (n.type = t.type),
          (n.stateNode = t.stateNode),
          (n.alternate = t),
          (t.alternate = n))
        : ((n.pendingProps = e),
          (n.type = t.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = t.flags & 65011712),
      (n.childLanes = t.childLanes),
      (n.lanes = t.lanes),
      (n.child = t.child),
      (n.memoizedProps = t.memoizedProps),
      (n.memoizedState = t.memoizedState),
      (n.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (n.dependencies =
        e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (n.sibling = t.sibling),
      (n.index = t.index),
      (n.ref = t.ref),
      (n.refCleanup = t.refCleanup),
      n
    );
  }
  function rd(t, e) {
    t.flags &= 65011714;
    var n = t.alternate;
    return (
      n === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = n.childLanes),
          (t.lanes = n.lanes),
          (t.child = n.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = n.memoizedProps),
          (t.memoizedState = n.memoizedState),
          (t.updateQueue = n.updateQueue),
          (t.type = n.type),
          (e = n.dependencies),
          (t.dependencies =
            e === null
              ? null
              : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    );
  }
  function Wl(t, e, n, i, s, r) {
    var f = 0;
    if (((i = t), typeof t == "function")) Pu(t) && (f = 1);
    else if (typeof t == "string")
      f = q1(t, n, W.current)
        ? 26
        : t === "html" || t === "head" || t === "body"
          ? 27
          : 5;
    else
      t: switch (t) {
        case at:
          return (
            (t = be(31, n, e, s)),
            (t.elementType = at),
            (t.lanes = r),
            t
          );
        case B:
          return la(n.children, s, r, e);
        case H:
          ((f = 8), (s |= 24));
          break;
        case q:
          return (
            (t = be(12, n, e, s | 2)),
            (t.elementType = q),
            (t.lanes = r),
            t
          );
        case Q:
          return ((t = be(13, n, e, s)), (t.elementType = Q), (t.lanes = r), t);
        case nt:
          return (
            (t = be(19, n, e, s)),
            (t.elementType = nt),
            (t.lanes = r),
            t
          );
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case L:
                f = 10;
                break t;
              case G:
                f = 9;
                break t;
              case Z:
                f = 11;
                break t;
              case P:
                f = 14;
                break t;
              case $:
                ((f = 16), (i = null));
                break t;
            }
          ((f = 29),
            (n = Error(o(130, t === null ? "null" : typeof t, ""))),
            (i = null));
      }
    return (
      (e = be(f, n, e, s)),
      (e.elementType = t),
      (e.type = i),
      (e.lanes = r),
      e
    );
  }
  function la(t, e, n, i) {
    return ((t = be(7, t, i, e)), (t.lanes = n), t);
  }
  function $u(t, e, n) {
    return ((t = be(6, t, null, e)), (t.lanes = n), t);
  }
  function cd(t) {
    var e = be(18, null, null, 0);
    return ((e.stateNode = t), e);
  }
  function Iu(t, e, n) {
    return (
      (e = be(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = n),
      (e.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation,
      }),
      e
    );
  }
  var fd = new WeakMap();
  function ze(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = fd.get(t);
      return n !== void 0
        ? n
        : ((e = { value: t, source: e, stack: cf(e) }), fd.set(t, e), e);
    }
    return { value: t, source: e, stack: cf(e) };
  }
  var Ua = [],
    Ba = 0,
    Pl = null,
    Ri = 0,
    Re = [],
    _e = 0,
    Mn = null,
    Je = 1,
    Fe = "";
  function sn(t, e) {
    ((Ua[Ba++] = Ri), (Ua[Ba++] = Pl), (Pl = t), (Ri = e));
  }
  function dd(t, e, n) {
    ((Re[_e++] = Je), (Re[_e++] = Fe), (Re[_e++] = Mn), (Mn = t));
    var i = Je;
    t = Fe;
    var s = 32 - ve(i) - 1;
    ((i &= ~(1 << s)), (n += 1));
    var r = 32 - ve(e) + s;
    if (30 < r) {
      var f = s - (s % 5);
      ((r = (i & ((1 << f) - 1)).toString(32)),
        (i >>= f),
        (s -= f),
        (Je = (1 << (32 - ve(e) + s)) | (n << s) | i),
        (Fe = r + t));
    } else ((Je = (1 << r) | (n << s) | i), (Fe = t));
  }
  function to(t) {
    t.return !== null && (sn(t, 1), dd(t, 1, 0));
  }
  function eo(t) {
    for (; t === Pl; )
      ((Pl = Ua[--Ba]), (Ua[Ba] = null), (Ri = Ua[--Ba]), (Ua[Ba] = null));
    for (; t === Mn; )
      ((Mn = Re[--_e]),
        (Re[_e] = null),
        (Fe = Re[--_e]),
        (Re[_e] = null),
        (Je = Re[--_e]),
        (Re[_e] = null));
  }
  function hd(t, e) {
    ((Re[_e++] = Je),
      (Re[_e++] = Fe),
      (Re[_e++] = Mn),
      (Je = e.id),
      (Fe = e.overflow),
      (Mn = t));
  }
  var Pt = null,
    jt = null,
    pt = !1,
    Dn = null,
    Oe = !1,
    no = Error(o(519));
  function Nn(t) {
    var e = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1]
          ? "text"
          : "HTML",
        "",
      ),
    );
    throw (_i(ze(e, t)), no);
  }
  function md(t) {
    var e = t.stateNode,
      n = t.type,
      i = t.memoizedProps;
    switch (((e[Wt] = t), (e[re] = i), n)) {
      case "dialog":
        (ft("cancel", e), ft("close", e));
        break;
      case "iframe":
      case "object":
      case "embed":
        ft("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < el.length; n++) ft(el[n], e);
        break;
      case "source":
        ft("error", e);
        break;
      case "img":
      case "image":
      case "link":
        (ft("error", e), ft("load", e));
        break;
      case "details":
        ft("toggle", e);
        break;
      case "input":
        (ft("invalid", e),
          Nf(
            e,
            i.value,
            i.defaultValue,
            i.checked,
            i.defaultChecked,
            i.type,
            i.name,
            !0,
          ));
        break;
      case "select":
        ft("invalid", e);
        break;
      case "textarea":
        (ft("invalid", e), Cf(e, i.value, i.defaultValue, i.children));
    }
    ((n = i.children),
      (typeof n != "string" && typeof n != "number" && typeof n != "bigint") ||
      e.textContent === "" + n ||
      i.suppressHydrationWarning === !0 ||
      zm(e.textContent, n)
        ? (i.popover != null && (ft("beforetoggle", e), ft("toggle", e)),
          i.onScroll != null && ft("scroll", e),
          i.onScrollEnd != null && ft("scrollend", e),
          i.onClick != null && (e.onclick = nn),
          (e = !0))
        : (e = !1),
      e || Nn(t, !0));
  }
  function pd(t) {
    for (Pt = t.return; Pt; )
      switch (Pt.tag) {
        case 5:
        case 31:
        case 13:
          Oe = !1;
          return;
        case 27:
        case 3:
          Oe = !0;
          return;
        default:
          Pt = Pt.return;
      }
  }
  function La(t) {
    if (t !== Pt) return !1;
    if (!pt) return (pd(t), (pt = !0), !1);
    var e = t.tag,
      n;
    if (
      ((n = e !== 3 && e !== 27) &&
        ((n = e === 5) &&
          ((n = t.type),
          (n =
            !(n !== "form" && n !== "button") || Sr(t.type, t.memoizedProps))),
        (n = !n)),
      n && jt && Nn(t),
      pd(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
        throw Error(o(317));
      jt = qm(t);
    } else if (e === 31) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
        throw Error(o(317));
      jt = qm(t);
    } else
      e === 27
        ? ((e = jt), Yn(t.type) ? ((t = Dr), (Dr = null), (jt = t)) : (jt = e))
        : (jt = Pt ? Ue(t.stateNode.nextSibling) : null);
    return !0;
  }
  function sa() {
    ((jt = Pt = null), (pt = !1));
  }
  function ao() {
    var t = Dn;
    return (
      t !== null &&
        (me === null ? (me = t) : me.push.apply(me, t), (Dn = null)),
      t
    );
  }
  function _i(t) {
    Dn === null ? (Dn = [t]) : Dn.push(t);
  }
  var io = E(null),
    ua = null,
    un = null;
  function jn(t, e, n) {
    (K(io, e._currentValue), (e._currentValue = n));
  }
  function on(t) {
    ((t._currentValue = io.current), U(io));
  }
  function lo(t, e, n) {
    for (; t !== null; ) {
      var i = t.alternate;
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), i !== null && (i.childLanes |= e))
          : i !== null && (i.childLanes & e) !== e && (i.childLanes |= e),
        t === n)
      )
        break;
      t = t.return;
    }
  }
  function so(t, e, n, i) {
    var s = t.child;
    for (s !== null && (s.return = t); s !== null; ) {
      var r = s.dependencies;
      if (r !== null) {
        var f = s.child;
        r = r.firstContext;
        t: for (; r !== null; ) {
          var y = r;
          r = s;
          for (var S = 0; S < e.length; S++)
            if (y.context === e[S]) {
              ((r.lanes |= n),
                (y = r.alternate),
                y !== null && (y.lanes |= n),
                lo(r.return, n, t),
                i || (f = null));
              break t;
            }
          r = y.next;
        }
      } else if (s.tag === 18) {
        if (((f = s.return), f === null)) throw Error(o(341));
        ((f.lanes |= n),
          (r = f.alternate),
          r !== null && (r.lanes |= n),
          lo(f, n, t),
          (f = null));
      } else f = s.child;
      if (f !== null) f.return = s;
      else
        for (f = s; f !== null; ) {
          if (f === t) {
            f = null;
            break;
          }
          if (((s = f.sibling), s !== null)) {
            ((s.return = f.return), (f = s));
            break;
          }
          f = f.return;
        }
      s = f;
    }
  }
  function Ha(t, e, n, i) {
    t = null;
    for (var s = e, r = !1; s !== null; ) {
      if (!r) {
        if ((s.flags & 524288) !== 0) r = !0;
        else if ((s.flags & 262144) !== 0) break;
      }
      if (s.tag === 10) {
        var f = s.alternate;
        if (f === null) throw Error(o(387));
        if (((f = f.memoizedProps), f !== null)) {
          var y = s.type;
          xe(s.pendingProps.value, f.value) ||
            (t !== null ? t.push(y) : (t = [y]));
        }
      } else if (s === xt.current) {
        if (((f = s.alternate), f === null)) throw Error(o(387));
        f.memoizedState.memoizedState !== s.memoizedState.memoizedState &&
          (t !== null ? t.push(sl) : (t = [sl]));
      }
      s = s.return;
    }
    (t !== null && so(e, t, n, i), (e.flags |= 262144));
  }
  function $l(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!xe(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function oa(t) {
    ((ua = t),
      (un = null),
      (t = t.dependencies),
      t !== null && (t.firstContext = null));
  }
  function $t(t) {
    return yd(ua, t);
  }
  function Il(t, e) {
    return (ua === null && oa(t), yd(t, e));
  }
  function yd(t, e) {
    var n = e._currentValue;
    if (((e = { context: e, memoizedValue: n, next: null }), un === null)) {
      if (t === null) throw Error(o(308));
      ((un = e),
        (t.dependencies = { lanes: 0, firstContext: e }),
        (t.flags |= 524288));
    } else un = un.next = e;
    return n;
  }
  var Uv =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (n, i) {
                  t.push(i);
                },
              });
            this.abort = function () {
              ((e.aborted = !0),
                t.forEach(function (n) {
                  return n();
                }));
            };
          },
    Bv = a.unstable_scheduleCallback,
    Lv = a.unstable_NormalPriority,
    Ht = {
      $$typeof: L,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function uo() {
    return { controller: new Uv(), data: new Map(), refCount: 0 };
  }
  function Oi(t) {
    (t.refCount--,
      t.refCount === 0 &&
        Bv(Lv, function () {
          t.controller.abort();
        }));
  }
  var Vi = null,
    oo = 0,
    qa = 0,
    Ya = null;
  function Hv(t, e) {
    if (Vi === null) {
      var n = (Vi = []);
      ((oo = 0),
        (qa = dr()),
        (Ya = {
          status: "pending",
          value: void 0,
          then: function (i) {
            n.push(i);
          },
        }));
    }
    return (oo++, e.then(gd, gd), e);
  }
  function gd() {
    if (--oo === 0 && Vi !== null) {
      Ya !== null && (Ya.status = "fulfilled");
      var t = Vi;
      ((Vi = null), (qa = 0), (Ya = null));
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function qv(t, e) {
    var n = [],
      i = {
        status: "pending",
        value: null,
        reason: null,
        then: function (s) {
          n.push(s);
        },
      };
    return (
      t.then(
        function () {
          ((i.status = "fulfilled"), (i.value = e));
          for (var s = 0; s < n.length; s++) (0, n[s])(e);
        },
        function (s) {
          for (i.status = "rejected", i.reason = s, s = 0; s < n.length; s++)
            (0, n[s])(void 0);
        },
      ),
      i
    );
  }
  var vd = _.S;
  _.S = function (t, e) {
    ((em = ye()),
      typeof e == "object" &&
        e !== null &&
        typeof e.then == "function" &&
        Hv(t, e),
      vd !== null && vd(t, e));
  };
  var ra = E(null);
  function ro() {
    var t = ra.current;
    return t !== null ? t : Mt.pooledCache;
  }
  function ts(t, e) {
    e === null ? K(ra, ra.current) : K(ra, e.pool);
  }
  function xd() {
    var t = ro();
    return t === null ? null : { parent: Ht._currentValue, pool: t };
  }
  var Ga = Error(o(460)),
    co = Error(o(474)),
    es = Error(o(542)),
    ns = { then: function () {} };
  function bd(t) {
    return ((t = t.status), t === "fulfilled" || t === "rejected");
  }
  function Sd(t, e, n) {
    switch (
      ((n = t[n]),
      n === void 0 ? t.push(e) : n !== e && (e.then(nn, nn), (e = n)),
      e.status)
    ) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw ((t = e.reason), Ad(t), t);
      default:
        if (typeof e.status == "string") e.then(nn, nn);
        else {
          if (((t = Mt), t !== null && 100 < t.shellSuspendCounter))
            throw Error(o(482));
          ((t = e),
            (t.status = "pending"),
            t.then(
              function (i) {
                if (e.status === "pending") {
                  var s = e;
                  ((s.status = "fulfilled"), (s.value = i));
                }
              },
              function (i) {
                if (e.status === "pending") {
                  var s = e;
                  ((s.status = "rejected"), (s.reason = i));
                }
              },
            ));
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw ((t = e.reason), Ad(t), t);
        }
        throw ((fa = e), Ga);
    }
  }
  function ca(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function"
        ? ((fa = n), Ga)
        : n;
    }
  }
  var fa = null;
  function Td() {
    if (fa === null) throw Error(o(459));
    var t = fa;
    return ((fa = null), t);
  }
  function Ad(t) {
    if (t === Ga || t === es) throw Error(o(483));
  }
  var Xa = null,
    Ui = 0;
  function as(t) {
    var e = Ui;
    return ((Ui += 1), Xa === null && (Xa = []), Sd(Xa, t, e));
  }
  function Bi(t, e) {
    ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
  }
  function is(t, e) {
    throw e.$$typeof === T
      ? Error(o(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(
          o(
            31,
            t === "[object Object]"
              ? "object with keys {" + Object.keys(e).join(", ") + "}"
              : t,
          ),
        ));
  }
  function Ed(t) {
    function e(M, A) {
      if (t) {
        var D = M.deletions;
        D === null ? ((M.deletions = [A]), (M.flags |= 16)) : D.push(A);
      }
    }
    function n(M, A) {
      if (!t) return null;
      for (; A !== null; ) (e(M, A), (A = A.sibling));
      return null;
    }
    function i(M) {
      for (var A = new Map(); M !== null; )
        (M.key !== null ? A.set(M.key, M) : A.set(M.index, M), (M = M.sibling));
      return A;
    }
    function s(M, A) {
      return ((M = ln(M, A)), (M.index = 0), (M.sibling = null), M);
    }
    function r(M, A, D) {
      return (
        (M.index = D),
        t
          ? ((D = M.alternate),
            D !== null
              ? ((D = D.index), D < A ? ((M.flags |= 67108866), A) : D)
              : ((M.flags |= 67108866), A))
          : ((M.flags |= 1048576), A)
      );
    }
    function f(M) {
      return (t && M.alternate === null && (M.flags |= 67108866), M);
    }
    function y(M, A, D, O) {
      return A === null || A.tag !== 6
        ? ((A = $u(D, M.mode, O)), (A.return = M), A)
        : ((A = s(A, D)), (A.return = M), A);
    }
    function S(M, A, D, O) {
      var tt = D.type;
      return tt === B
        ? R(M, A, D.props.children, O, D.key)
        : A !== null &&
            (A.elementType === tt ||
              (typeof tt == "object" &&
                tt !== null &&
                tt.$$typeof === $ &&
                ca(tt) === A.type))
          ? ((A = s(A, D.props)), Bi(A, D), (A.return = M), A)
          : ((A = Wl(D.type, D.key, D.props, null, M.mode, O)),
            Bi(A, D),
            (A.return = M),
            A);
    }
    function N(M, A, D, O) {
      return A === null ||
        A.tag !== 4 ||
        A.stateNode.containerInfo !== D.containerInfo ||
        A.stateNode.implementation !== D.implementation
        ? ((A = Iu(D, M.mode, O)), (A.return = M), A)
        : ((A = s(A, D.children || [])), (A.return = M), A);
    }
    function R(M, A, D, O, tt) {
      return A === null || A.tag !== 7
        ? ((A = la(D, M.mode, O, tt)), (A.return = M), A)
        : ((A = s(A, D)), (A.return = M), A);
    }
    function V(M, A, D) {
      if (
        (typeof A == "string" && A !== "") ||
        typeof A == "number" ||
        typeof A == "bigint"
      )
        return ((A = $u("" + A, M.mode, D)), (A.return = M), A);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case C:
            return (
              (D = Wl(A.type, A.key, A.props, null, M.mode, D)),
              Bi(D, A),
              (D.return = M),
              D
            );
          case z:
            return ((A = Iu(A, M.mode, D)), (A.return = M), A);
          case $:
            return ((A = ca(A)), V(M, A, D));
        }
        if (oe(A) || zt(A))
          return ((A = la(A, M.mode, D, null)), (A.return = M), A);
        if (typeof A.then == "function") return V(M, as(A), D);
        if (A.$$typeof === L) return V(M, Il(M, A), D);
        is(M, A);
      }
      return null;
    }
    function j(M, A, D, O) {
      var tt = A !== null ? A.key : null;
      if (
        (typeof D == "string" && D !== "") ||
        typeof D == "number" ||
        typeof D == "bigint"
      )
        return tt !== null ? null : y(M, A, "" + D, O);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case C:
            return D.key === tt ? S(M, A, D, O) : null;
          case z:
            return D.key === tt ? N(M, A, D, O) : null;
          case $:
            return ((D = ca(D)), j(M, A, D, O));
        }
        if (oe(D) || zt(D)) return tt !== null ? null : R(M, A, D, O, null);
        if (typeof D.then == "function") return j(M, A, as(D), O);
        if (D.$$typeof === L) return j(M, A, Il(M, D), O);
        is(M, D);
      }
      return null;
    }
    function w(M, A, D, O, tt) {
      if (
        (typeof O == "string" && O !== "") ||
        typeof O == "number" ||
        typeof O == "bigint"
      )
        return ((M = M.get(D) || null), y(A, M, "" + O, tt));
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case C:
            return (
              (M = M.get(O.key === null ? D : O.key) || null),
              S(A, M, O, tt)
            );
          case z:
            return (
              (M = M.get(O.key === null ? D : O.key) || null),
              N(A, M, O, tt)
            );
          case $:
            return ((O = ca(O)), w(M, A, D, O, tt));
        }
        if (oe(O) || zt(O))
          return ((M = M.get(D) || null), R(A, M, O, tt, null));
        if (typeof O.then == "function") return w(M, A, D, as(O), tt);
        if (O.$$typeof === L) return w(M, A, D, Il(A, O), tt);
        is(A, O);
      }
      return null;
    }
    function J(M, A, D, O) {
      for (
        var tt = null, yt = null, I = A, ot = (A = 0), ht = null;
        I !== null && ot < D.length;
        ot++
      ) {
        I.index > ot ? ((ht = I), (I = null)) : (ht = I.sibling);
        var gt = j(M, I, D[ot], O);
        if (gt === null) {
          I === null && (I = ht);
          break;
        }
        (t && I && gt.alternate === null && e(M, I),
          (A = r(gt, A, ot)),
          yt === null ? (tt = gt) : (yt.sibling = gt),
          (yt = gt),
          (I = ht));
      }
      if (ot === D.length) return (n(M, I), pt && sn(M, ot), tt);
      if (I === null) {
        for (; ot < D.length; ot++)
          ((I = V(M, D[ot], O)),
            I !== null &&
              ((A = r(I, A, ot)),
              yt === null ? (tt = I) : (yt.sibling = I),
              (yt = I)));
        return (pt && sn(M, ot), tt);
      }
      for (I = i(I); ot < D.length; ot++)
        ((ht = w(I, M, ot, D[ot], O)),
          ht !== null &&
            (t &&
              ht.alternate !== null &&
              I.delete(ht.key === null ? ot : ht.key),
            (A = r(ht, A, ot)),
            yt === null ? (tt = ht) : (yt.sibling = ht),
            (yt = ht)));
      return (
        t &&
          I.forEach(function (Kn) {
            return e(M, Kn);
          }),
        pt && sn(M, ot),
        tt
      );
    }
    function et(M, A, D, O) {
      if (D == null) throw Error(o(151));
      for (
        var tt = null, yt = null, I = A, ot = (A = 0), ht = null, gt = D.next();
        I !== null && !gt.done;
        ot++, gt = D.next()
      ) {
        I.index > ot ? ((ht = I), (I = null)) : (ht = I.sibling);
        var Kn = j(M, I, gt.value, O);
        if (Kn === null) {
          I === null && (I = ht);
          break;
        }
        (t && I && Kn.alternate === null && e(M, I),
          (A = r(Kn, A, ot)),
          yt === null ? (tt = Kn) : (yt.sibling = Kn),
          (yt = Kn),
          (I = ht));
      }
      if (gt.done) return (n(M, I), pt && sn(M, ot), tt);
      if (I === null) {
        for (; !gt.done; ot++, gt = D.next())
          ((gt = V(M, gt.value, O)),
            gt !== null &&
              ((A = r(gt, A, ot)),
              yt === null ? (tt = gt) : (yt.sibling = gt),
              (yt = gt)));
        return (pt && sn(M, ot), tt);
      }
      for (I = i(I); !gt.done; ot++, gt = D.next())
        ((gt = w(I, M, ot, gt.value, O)),
          gt !== null &&
            (t &&
              gt.alternate !== null &&
              I.delete(gt.key === null ? ot : gt.key),
            (A = r(gt, A, ot)),
            yt === null ? (tt = gt) : (yt.sibling = gt),
            (yt = gt)));
      return (
        t &&
          I.forEach(function (P1) {
            return e(M, P1);
          }),
        pt && sn(M, ot),
        tt
      );
    }
    function Et(M, A, D, O) {
      if (
        (typeof D == "object" &&
          D !== null &&
          D.type === B &&
          D.key === null &&
          (D = D.props.children),
        typeof D == "object" && D !== null)
      ) {
        switch (D.$$typeof) {
          case C:
            t: {
              for (var tt = D.key; A !== null; ) {
                if (A.key === tt) {
                  if (((tt = D.type), tt === B)) {
                    if (A.tag === 7) {
                      (n(M, A.sibling),
                        (O = s(A, D.props.children)),
                        (O.return = M),
                        (M = O));
                      break t;
                    }
                  } else if (
                    A.elementType === tt ||
                    (typeof tt == "object" &&
                      tt !== null &&
                      tt.$$typeof === $ &&
                      ca(tt) === A.type)
                  ) {
                    (n(M, A.sibling),
                      (O = s(A, D.props)),
                      Bi(O, D),
                      (O.return = M),
                      (M = O));
                    break t;
                  }
                  n(M, A);
                  break;
                } else e(M, A);
                A = A.sibling;
              }
              D.type === B
                ? ((O = la(D.props.children, M.mode, O, D.key)),
                  (O.return = M),
                  (M = O))
                : ((O = Wl(D.type, D.key, D.props, null, M.mode, O)),
                  Bi(O, D),
                  (O.return = M),
                  (M = O));
            }
            return f(M);
          case z:
            t: {
              for (tt = D.key; A !== null; ) {
                if (A.key === tt)
                  if (
                    A.tag === 4 &&
                    A.stateNode.containerInfo === D.containerInfo &&
                    A.stateNode.implementation === D.implementation
                  ) {
                    (n(M, A.sibling),
                      (O = s(A, D.children || [])),
                      (O.return = M),
                      (M = O));
                    break t;
                  } else {
                    n(M, A);
                    break;
                  }
                else e(M, A);
                A = A.sibling;
              }
              ((O = Iu(D, M.mode, O)), (O.return = M), (M = O));
            }
            return f(M);
          case $:
            return ((D = ca(D)), Et(M, A, D, O));
        }
        if (oe(D)) return J(M, A, D, O);
        if (zt(D)) {
          if (((tt = zt(D)), typeof tt != "function")) throw Error(o(150));
          return ((D = tt.call(D)), et(M, A, D, O));
        }
        if (typeof D.then == "function") return Et(M, A, as(D), O);
        if (D.$$typeof === L) return Et(M, A, Il(M, D), O);
        is(M, D);
      }
      return (typeof D == "string" && D !== "") ||
        typeof D == "number" ||
        typeof D == "bigint"
        ? ((D = "" + D),
          A !== null && A.tag === 6
            ? (n(M, A.sibling), (O = s(A, D)), (O.return = M), (M = O))
            : (n(M, A), (O = $u(D, M.mode, O)), (O.return = M), (M = O)),
          f(M))
        : n(M, A);
    }
    return function (M, A, D, O) {
      try {
        Ui = 0;
        var tt = Et(M, A, D, O);
        return ((Xa = null), tt);
      } catch (I) {
        if (I === Ga || I === es) throw I;
        var yt = be(29, I, null, M.mode);
        return ((yt.lanes = O), (yt.return = M), yt);
      } finally {
      }
    };
  }
  var da = Ed(!0),
    Md = Ed(!1),
    Cn = !1;
  function fo(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function ho(t, e) {
    ((t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function wn(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function zn(t, e, n) {
    var i = t.updateQueue;
    if (i === null) return null;
    if (((i = i.shared), (vt & 2) !== 0)) {
      var s = i.pending;
      return (
        s === null ? (e.next = e) : ((e.next = s.next), (s.next = e)),
        (i.pending = e),
        (e = Fl(t)),
        od(t, null, n),
        e
      );
    }
    return (Jl(t, i, e, n), Fl(t));
  }
  function Li(t, e, n) {
    if (
      ((e = e.updateQueue), e !== null && ((e = e.shared), (n & 4194048) !== 0))
    ) {
      var i = e.lanes;
      ((i &= t.pendingLanes), (n |= i), (e.lanes = n), yf(t, n));
    }
  }
  function mo(t, e) {
    var n = t.updateQueue,
      i = t.alternate;
    if (i !== null && ((i = i.updateQueue), n === i)) {
      var s = null,
        r = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var f = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null,
          };
          (r === null ? (s = r = f) : (r = r.next = f), (n = n.next));
        } while (n !== null);
        r === null ? (s = r = e) : (r = r.next = e);
      } else s = r = e;
      ((n = {
        baseState: i.baseState,
        firstBaseUpdate: s,
        lastBaseUpdate: r,
        shared: i.shared,
        callbacks: i.callbacks,
      }),
        (t.updateQueue = n));
      return;
    }
    ((t = n.lastBaseUpdate),
      t === null ? (n.firstBaseUpdate = e) : (t.next = e),
      (n.lastBaseUpdate = e));
  }
  var po = !1;
  function Hi() {
    if (po) {
      var t = Ya;
      if (t !== null) throw t;
    }
  }
  function qi(t, e, n, i) {
    po = !1;
    var s = t.updateQueue;
    Cn = !1;
    var r = s.firstBaseUpdate,
      f = s.lastBaseUpdate,
      y = s.shared.pending;
    if (y !== null) {
      s.shared.pending = null;
      var S = y,
        N = S.next;
      ((S.next = null), f === null ? (r = N) : (f.next = N), (f = S));
      var R = t.alternate;
      R !== null &&
        ((R = R.updateQueue),
        (y = R.lastBaseUpdate),
        y !== f &&
          (y === null ? (R.firstBaseUpdate = N) : (y.next = N),
          (R.lastBaseUpdate = S)));
    }
    if (r !== null) {
      var V = s.baseState;
      ((f = 0), (R = N = S = null), (y = r));
      do {
        var j = y.lane & -536870913,
          w = j !== y.lane;
        if (w ? (dt & j) === j : (i & j) === j) {
          (j !== 0 && j === qa && (po = !0),
            R !== null &&
              (R = R.next =
                {
                  lane: 0,
                  tag: y.tag,
                  payload: y.payload,
                  callback: null,
                  next: null,
                }));
          t: {
            var J = t,
              et = y;
            j = e;
            var Et = n;
            switch (et.tag) {
              case 1:
                if (((J = et.payload), typeof J == "function")) {
                  V = J.call(Et, V, j);
                  break t;
                }
                V = J;
                break t;
              case 3:
                J.flags = (J.flags & -65537) | 128;
              case 0:
                if (
                  ((J = et.payload),
                  (j = typeof J == "function" ? J.call(Et, V, j) : J),
                  j == null)
                )
                  break t;
                V = b({}, V, j);
                break t;
              case 2:
                Cn = !0;
            }
          }
          ((j = y.callback),
            j !== null &&
              ((t.flags |= 64),
              w && (t.flags |= 8192),
              (w = s.callbacks),
              w === null ? (s.callbacks = [j]) : w.push(j)));
        } else
          ((w = {
            lane: j,
            tag: y.tag,
            payload: y.payload,
            callback: y.callback,
            next: null,
          }),
            R === null ? ((N = R = w), (S = V)) : (R = R.next = w),
            (f |= j));
        if (((y = y.next), y === null)) {
          if (((y = s.shared.pending), y === null)) break;
          ((w = y),
            (y = w.next),
            (w.next = null),
            (s.lastBaseUpdate = w),
            (s.shared.pending = null));
        }
      } while (!0);
      (R === null && (S = V),
        (s.baseState = S),
        (s.firstBaseUpdate = N),
        (s.lastBaseUpdate = R),
        r === null && (s.shared.lanes = 0),
        (Un |= f),
        (t.lanes = f),
        (t.memoizedState = V));
    }
  }
  function Dd(t, e) {
    if (typeof t != "function") throw Error(o(191, t));
    t.call(e);
  }
  function Nd(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++) Dd(n[t], e);
  }
  var Za = E(null),
    ls = E(0);
  function jd(t, e) {
    ((t = gn), K(ls, t), K(Za, e), (gn = t | e.baseLanes));
  }
  function yo() {
    (K(ls, gn), K(Za, Za.current));
  }
  function go() {
    ((gn = ls.current), U(Za), U(ls));
  }
  var Se = E(null),
    Ve = null;
  function Rn(t) {
    var e = t.alternate;
    (K(Bt, Bt.current & 1),
      K(Se, t),
      Ve === null &&
        (e === null || Za.current !== null || e.memoizedState !== null) &&
        (Ve = t));
  }
  function vo(t) {
    (K(Bt, Bt.current), K(Se, t), Ve === null && (Ve = t));
  }
  function Cd(t) {
    t.tag === 22
      ? (K(Bt, Bt.current), K(Se, t), Ve === null && (Ve = t))
      : _n();
  }
  function _n() {
    (K(Bt, Bt.current), K(Se, Se.current));
  }
  function Te(t) {
    (U(Se), Ve === t && (Ve = null), U(Bt));
  }
  var Bt = E(0);
  function ss(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || Er(n) || Mr(n)))
          return e;
      } else if (
        e.tag === 19 &&
        (e.memoizedProps.revealOrder === "forwards" ||
          e.memoizedProps.revealOrder === "backwards" ||
          e.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          e.memoizedProps.revealOrder === "together")
      ) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        ((e.child.return = e), (e = e.child));
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      ((e.sibling.return = e.return), (e = e.sibling));
    }
    return null;
  }
  var rn = 0,
    st = null,
    Tt = null,
    qt = null,
    us = !1,
    Qa = !1,
    ha = !1,
    os = 0,
    Yi = 0,
    Ka = null,
    Yv = 0;
  function _t() {
    throw Error(o(321));
  }
  function xo(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!xe(t[n], e[n])) return !1;
    return !0;
  }
  function bo(t, e, n, i, s, r) {
    return (
      (rn = r),
      (st = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (_.H = t === null || t.memoizedState === null ? dh : Vo),
      (ha = !1),
      (r = n(i, s)),
      (ha = !1),
      Qa && (r = zd(e, n, i, s)),
      wd(t),
      r
    );
  }
  function wd(t) {
    _.H = Zi;
    var e = Tt !== null && Tt.next !== null;
    if (((rn = 0), (qt = Tt = st = null), (us = !1), (Yi = 0), (Ka = null), e))
      throw Error(o(300));
    t === null ||
      Yt ||
      ((t = t.dependencies), t !== null && $l(t) && (Yt = !0));
  }
  function zd(t, e, n, i) {
    st = t;
    var s = 0;
    do {
      if ((Qa && (Ka = null), (Yi = 0), (Qa = !1), 25 <= s))
        throw Error(o(301));
      if (((s += 1), (qt = Tt = null), t.updateQueue != null)) {
        var r = t.updateQueue;
        ((r.lastEffect = null),
          (r.events = null),
          (r.stores = null),
          r.memoCache != null && (r.memoCache.index = 0));
      }
      ((_.H = hh), (r = e(n, i)));
    } while (Qa);
    return r;
  }
  function Gv() {
    var t = _.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == "function" ? Gi(e) : e),
      (t = t.useState()[0]),
      (Tt !== null ? Tt.memoizedState : null) !== t && (st.flags |= 1024),
      e
    );
  }
  function So() {
    var t = os !== 0;
    return ((os = 0), t);
  }
  function To(t, e, n) {
    ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~n));
  }
  function Ao(t) {
    if (us) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        (e !== null && (e.pending = null), (t = t.next));
      }
      us = !1;
    }
    ((rn = 0), (qt = Tt = st = null), (Qa = !1), (Yi = os = 0), (Ka = null));
  }
  function le() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (qt === null ? (st.memoizedState = qt = t) : (qt = qt.next = t), qt);
  }
  function Lt() {
    if (Tt === null) {
      var t = st.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Tt.next;
    var e = qt === null ? st.memoizedState : qt.next;
    if (e !== null) ((qt = e), (Tt = t));
    else {
      if (t === null)
        throw st.alternate === null ? Error(o(467)) : Error(o(310));
      ((Tt = t),
        (t = {
          memoizedState: Tt.memoizedState,
          baseState: Tt.baseState,
          baseQueue: Tt.baseQueue,
          queue: Tt.queue,
          next: null,
        }),
        qt === null ? (st.memoizedState = qt = t) : (qt = qt.next = t));
    }
    return qt;
  }
  function rs() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Gi(t) {
    var e = Yi;
    return (
      (Yi += 1),
      Ka === null && (Ka = []),
      (t = Sd(Ka, t, e)),
      (e = st),
      (qt === null ? e.memoizedState : qt.next) === null &&
        ((e = e.alternate),
        (_.H = e === null || e.memoizedState === null ? dh : Vo)),
      t
    );
  }
  function cs(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Gi(t);
      if (t.$$typeof === L) return $t(t);
    }
    throw Error(o(438, String(t)));
  }
  function Eo(t) {
    var e = null,
      n = st.updateQueue;
    if ((n !== null && (e = n.memoCache), e == null)) {
      var i = st.alternate;
      i !== null &&
        ((i = i.updateQueue),
        i !== null &&
          ((i = i.memoCache),
          i != null &&
            (e = {
              data: i.data.map(function (s) {
                return s.slice();
              }),
              index: 0,
            })));
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      n === null && ((n = rs()), (st.updateQueue = n)),
      (n.memoCache = e),
      (n = e.data[e.index]),
      n === void 0)
    )
      for (n = e.data[e.index] = Array(t), i = 0; i < t; i++) n[i] = Dt;
    return (e.index++, n);
  }
  function cn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function fs(t) {
    var e = Lt();
    return Mo(e, Tt, t);
  }
  function Mo(t, e, n) {
    var i = t.queue;
    if (i === null) throw Error(o(311));
    i.lastRenderedReducer = n;
    var s = t.baseQueue,
      r = i.pending;
    if (r !== null) {
      if (s !== null) {
        var f = s.next;
        ((s.next = r.next), (r.next = f));
      }
      ((e.baseQueue = s = r), (i.pending = null));
    }
    if (((r = t.baseState), s === null)) t.memoizedState = r;
    else {
      e = s.next;
      var y = (f = null),
        S = null,
        N = e,
        R = !1;
      do {
        var V = N.lane & -536870913;
        if (V !== N.lane ? (dt & V) === V : (rn & V) === V) {
          var j = N.revertLane;
          if (j === 0)
            (S !== null &&
              (S = S.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: N.action,
                  hasEagerState: N.hasEagerState,
                  eagerState: N.eagerState,
                  next: null,
                }),
              V === qa && (R = !0));
          else if ((rn & j) === j) {
            ((N = N.next), j === qa && (R = !0));
            continue;
          } else
            ((V = {
              lane: 0,
              revertLane: N.revertLane,
              gesture: null,
              action: N.action,
              hasEagerState: N.hasEagerState,
              eagerState: N.eagerState,
              next: null,
            }),
              S === null ? ((y = S = V), (f = r)) : (S = S.next = V),
              (st.lanes |= j),
              (Un |= j));
          ((V = N.action),
            ha && n(r, V),
            (r = N.hasEagerState ? N.eagerState : n(r, V)));
        } else
          ((j = {
            lane: V,
            revertLane: N.revertLane,
            gesture: N.gesture,
            action: N.action,
            hasEagerState: N.hasEagerState,
            eagerState: N.eagerState,
            next: null,
          }),
            S === null ? ((y = S = j), (f = r)) : (S = S.next = j),
            (st.lanes |= V),
            (Un |= V));
        N = N.next;
      } while (N !== null && N !== e);
      if (
        (S === null ? (f = r) : (S.next = y),
        !xe(r, t.memoizedState) && ((Yt = !0), R && ((n = Ya), n !== null)))
      )
        throw n;
      ((t.memoizedState = r),
        (t.baseState = f),
        (t.baseQueue = S),
        (i.lastRenderedState = r));
    }
    return (s === null && (i.lanes = 0), [t.memoizedState, i.dispatch]);
  }
  function Do(t) {
    var e = Lt(),
      n = e.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = t;
    var i = n.dispatch,
      s = n.pending,
      r = e.memoizedState;
    if (s !== null) {
      n.pending = null;
      var f = (s = s.next);
      do ((r = t(r, f.action)), (f = f.next));
      while (f !== s);
      (xe(r, e.memoizedState) || (Yt = !0),
        (e.memoizedState = r),
        e.baseQueue === null && (e.baseState = r),
        (n.lastRenderedState = r));
    }
    return [r, i];
  }
  function Rd(t, e, n) {
    var i = st,
      s = Lt(),
      r = pt;
    if (r) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = e();
    var f = !xe((Tt || s).memoizedState, n);
    if (
      (f && ((s.memoizedState = n), (Yt = !0)),
      (s = s.queue),
      Co(Vd.bind(null, i, s, t), [t]),
      s.getSnapshot !== e || f || (qt !== null && qt.memoizedState.tag & 1))
    ) {
      if (
        ((i.flags |= 2048),
        ka(9, { destroy: void 0 }, Od.bind(null, i, s, n, e), null),
        Mt === null)
      )
        throw Error(o(349));
      r || (rn & 127) !== 0 || _d(i, e, n);
    }
    return n;
  }
  function _d(t, e, n) {
    ((t.flags |= 16384),
      (t = { getSnapshot: e, value: n }),
      (e = st.updateQueue),
      e === null
        ? ((e = rs()), (st.updateQueue = e), (e.stores = [t]))
        : ((n = e.stores), n === null ? (e.stores = [t]) : n.push(t)));
  }
  function Od(t, e, n, i) {
    ((e.value = n), (e.getSnapshot = i), Ud(e) && Bd(t));
  }
  function Vd(t, e, n) {
    return n(function () {
      Ud(e) && Bd(t);
    });
  }
  function Ud(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !xe(t, n);
    } catch {
      return !0;
    }
  }
  function Bd(t) {
    var e = ia(t, 2);
    e !== null && pe(e, t, 2);
  }
  function No(t) {
    var e = le();
    if (typeof t == "function") {
      var n = t;
      if (((t = n()), ha)) {
        Tn(!0);
        try {
          n();
        } finally {
          Tn(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: cn,
        lastRenderedState: t,
      }),
      e
    );
  }
  function Ld(t, e, n, i) {
    return ((t.baseState = n), Mo(t, Tt, typeof i == "function" ? i : cn));
  }
  function Xv(t, e, n, i, s) {
    if (ms(t)) throw Error(o(485));
    if (((t = e.action), t !== null)) {
      var r = {
        payload: s,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (f) {
          r.listeners.push(f);
        },
      };
      (_.T !== null ? n(!0) : (r.isTransition = !1),
        i(r),
        (n = e.pending),
        n === null
          ? ((r.next = e.pending = r), Hd(e, r))
          : ((r.next = n.next), (e.pending = n.next = r)));
    }
  }
  function Hd(t, e) {
    var n = e.action,
      i = e.payload,
      s = t.state;
    if (e.isTransition) {
      var r = _.T,
        f = {};
      _.T = f;
      try {
        var y = n(s, i),
          S = _.S;
        (S !== null && S(f, y), qd(t, e, y));
      } catch (N) {
        jo(t, e, N);
      } finally {
        (r !== null && f.types !== null && (r.types = f.types), (_.T = r));
      }
    } else
      try {
        ((r = n(s, i)), qd(t, e, r));
      } catch (N) {
        jo(t, e, N);
      }
  }
  function qd(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function"
      ? n.then(
          function (i) {
            Yd(t, e, i);
          },
          function (i) {
            return jo(t, e, i);
          },
        )
      : Yd(t, e, n);
  }
  function Yd(t, e, n) {
    ((e.status = "fulfilled"),
      (e.value = n),
      Gd(e),
      (t.state = n),
      (e = t.pending),
      e !== null &&
        ((n = e.next),
        n === e ? (t.pending = null) : ((n = n.next), (e.next = n), Hd(t, n))));
  }
  function jo(t, e, n) {
    var i = t.pending;
    if (((t.pending = null), i !== null)) {
      i = i.next;
      do ((e.status = "rejected"), (e.reason = n), Gd(e), (e = e.next));
      while (e !== i);
    }
    t.action = null;
  }
  function Gd(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Xd(t, e) {
    return e;
  }
  function Zd(t, e) {
    if (pt) {
      var n = Mt.formState;
      if (n !== null) {
        t: {
          var i = st;
          if (pt) {
            if (jt) {
              e: {
                for (var s = jt, r = Oe; s.nodeType !== 8; ) {
                  if (!r) {
                    s = null;
                    break e;
                  }
                  if (((s = Ue(s.nextSibling)), s === null)) {
                    s = null;
                    break e;
                  }
                }
                ((r = s.data), (s = r === "F!" || r === "F" ? s : null));
              }
              if (s) {
                ((jt = Ue(s.nextSibling)), (i = s.data === "F!"));
                break t;
              }
            }
            Nn(i);
          }
          i = !1;
        }
        i && (e = n[0]);
      }
    }
    return (
      (n = le()),
      (n.memoizedState = n.baseState = e),
      (i = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Xd,
        lastRenderedState: e,
      }),
      (n.queue = i),
      (n = rh.bind(null, st, i)),
      (i.dispatch = n),
      (i = No(!1)),
      (r = Oo.bind(null, st, !1, i.queue)),
      (i = le()),
      (s = { state: e, dispatch: null, action: t, pending: null }),
      (i.queue = s),
      (n = Xv.bind(null, st, s, r, n)),
      (s.dispatch = n),
      (i.memoizedState = t),
      [e, n, !1]
    );
  }
  function Qd(t) {
    var e = Lt();
    return Kd(e, Tt, t);
  }
  function Kd(t, e, n) {
    if (
      ((e = Mo(t, e, Xd)[0]),
      (t = fs(cn)[0]),
      typeof e == "object" && e !== null && typeof e.then == "function")
    )
      try {
        var i = Gi(e);
      } catch (f) {
        throw f === Ga ? es : f;
      }
    else i = e;
    e = Lt();
    var s = e.queue,
      r = s.dispatch;
    return (
      n !== e.memoizedState &&
        ((st.flags |= 2048),
        ka(9, { destroy: void 0 }, Zv.bind(null, s, n), null)),
      [i, r, t]
    );
  }
  function Zv(t, e) {
    t.action = e;
  }
  function kd(t) {
    var e = Lt(),
      n = Tt;
    if (n !== null) return Kd(e, n, t);
    (Lt(), (e = e.memoizedState), (n = Lt()));
    var i = n.queue.dispatch;
    return ((n.memoizedState = t), [e, i, !1]);
  }
  function ka(t, e, n, i) {
    return (
      (t = { tag: t, create: n, deps: i, inst: e, next: null }),
      (e = st.updateQueue),
      e === null && ((e = rs()), (st.updateQueue = e)),
      (n = e.lastEffect),
      n === null
        ? (e.lastEffect = t.next = t)
        : ((i = n.next), (n.next = t), (t.next = i), (e.lastEffect = t)),
      t
    );
  }
  function Jd() {
    return Lt().memoizedState;
  }
  function ds(t, e, n, i) {
    var s = le();
    ((st.flags |= t),
      (s.memoizedState = ka(
        1 | e,
        { destroy: void 0 },
        n,
        i === void 0 ? null : i,
      )));
  }
  function hs(t, e, n, i) {
    var s = Lt();
    i = i === void 0 ? null : i;
    var r = s.memoizedState.inst;
    Tt !== null && i !== null && xo(i, Tt.memoizedState.deps)
      ? (s.memoizedState = ka(e, r, n, i))
      : ((st.flags |= t), (s.memoizedState = ka(1 | e, r, n, i)));
  }
  function Fd(t, e) {
    ds(8390656, 8, t, e);
  }
  function Co(t, e) {
    hs(2048, 8, t, e);
  }
  function Qv(t) {
    st.flags |= 4;
    var e = st.updateQueue;
    if (e === null) ((e = rs()), (st.updateQueue = e), (e.events = [t]));
    else {
      var n = e.events;
      n === null ? (e.events = [t]) : n.push(t);
    }
  }
  function Wd(t) {
    var e = Lt().memoizedState;
    return (
      Qv({ ref: e, nextImpl: t }),
      function () {
        if ((vt & 2) !== 0) throw Error(o(440));
        return e.impl.apply(void 0, arguments);
      }
    );
  }
  function Pd(t, e) {
    return hs(4, 2, t, e);
  }
  function $d(t, e) {
    return hs(4, 4, t, e);
  }
  function Id(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function () {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null;
        }
      );
  }
  function th(t, e, n) {
    ((n = n != null ? n.concat([t]) : null), hs(4, 4, Id.bind(null, e, t), n));
  }
  function wo() {}
  function eh(t, e) {
    var n = Lt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    return e !== null && xo(e, i[1]) ? i[0] : ((n.memoizedState = [t, e]), t);
  }
  function nh(t, e) {
    var n = Lt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    if (e !== null && xo(e, i[1])) return i[0];
    if (((i = t()), ha)) {
      Tn(!0);
      try {
        t();
      } finally {
        Tn(!1);
      }
    }
    return ((n.memoizedState = [i, e]), i);
  }
  function zo(t, e, n) {
    return n === void 0 || ((rn & 1073741824) !== 0 && (dt & 261930) === 0)
      ? (t.memoizedState = e)
      : ((t.memoizedState = n), (t = am()), (st.lanes |= t), (Un |= t), n);
  }
  function ah(t, e, n, i) {
    return xe(n, e)
      ? n
      : Za.current !== null
        ? ((t = zo(t, n, i)), xe(t, e) || (Yt = !0), t)
        : (rn & 42) === 0 || ((rn & 1073741824) !== 0 && (dt & 261930) === 0)
          ? ((Yt = !0), (t.memoizedState = n))
          : ((t = am()), (st.lanes |= t), (Un |= t), e);
  }
  function ih(t, e, n, i, s) {
    var r = X.p;
    X.p = r !== 0 && 8 > r ? r : 8;
    var f = _.T,
      y = {};
    ((_.T = y), Oo(t, !1, e, n));
    try {
      var S = s(),
        N = _.S;
      if (
        (N !== null && N(y, S),
        S !== null && typeof S == "object" && typeof S.then == "function")
      ) {
        var R = qv(S, i);
        Xi(t, e, R, Me(t));
      } else Xi(t, e, i, Me(t));
    } catch (V) {
      Xi(t, e, { then: function () {}, status: "rejected", reason: V }, Me());
    } finally {
      ((X.p = r),
        f !== null && y.types !== null && (f.types = y.types),
        (_.T = f));
    }
  }
  function Kv() {}
  function Ro(t, e, n, i) {
    if (t.tag !== 5) throw Error(o(476));
    var s = lh(t).queue;
    ih(
      t,
      s,
      e,
      k,
      n === null
        ? Kv
        : function () {
            return (sh(t), n(i));
          },
    );
  }
  function lh(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: k,
      baseState: k,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: cn,
        lastRenderedState: k,
      },
      next: null,
    };
    var n = {};
    return (
      (e.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: cn,
          lastRenderedState: n,
        },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    );
  }
  function sh(t) {
    var e = lh(t);
    (e.next === null && (e = t.alternate.memoizedState),
      Xi(t, e.next.queue, {}, Me()));
  }
  function _o() {
    return $t(sl);
  }
  function uh() {
    return Lt().memoizedState;
  }
  function oh() {
    return Lt().memoizedState;
  }
  function kv(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = Me();
          t = wn(n);
          var i = zn(e, t, n);
          (i !== null && (pe(i, e, n), Li(i, e, n)),
            (e = { cache: uo() }),
            (t.payload = e));
          return;
      }
      e = e.return;
    }
  }
  function Jv(t, e, n) {
    var i = Me();
    ((n = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      ms(t)
        ? ch(e, n)
        : ((n = Wu(t, e, n, i)), n !== null && (pe(n, t, i), fh(n, e, i))));
  }
  function rh(t, e, n) {
    var i = Me();
    Xi(t, e, n, i);
  }
  function Xi(t, e, n, i) {
    var s = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (ms(t)) ch(e, s);
    else {
      var r = t.alternate;
      if (
        t.lanes === 0 &&
        (r === null || r.lanes === 0) &&
        ((r = e.lastRenderedReducer), r !== null)
      )
        try {
          var f = e.lastRenderedState,
            y = r(f, n);
          if (((s.hasEagerState = !0), (s.eagerState = y), xe(y, f)))
            return (Jl(t, e, s, 0), Mt === null && kl(), !1);
        } catch {
        } finally {
        }
      if (((n = Wu(t, e, s, i)), n !== null))
        return (pe(n, t, i), fh(n, e, i), !0);
    }
    return !1;
  }
  function Oo(t, e, n, i) {
    if (
      ((i = {
        lane: 2,
        revertLane: dr(),
        gesture: null,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      ms(t))
    ) {
      if (e) throw Error(o(479));
    } else ((e = Wu(t, n, i, 2)), e !== null && pe(e, t, 2));
  }
  function ms(t) {
    var e = t.alternate;
    return t === st || (e !== null && e === st);
  }
  function ch(t, e) {
    Qa = us = !0;
    var n = t.pending;
    (n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
      (t.pending = e));
  }
  function fh(t, e, n) {
    if ((n & 4194048) !== 0) {
      var i = e.lanes;
      ((i &= t.pendingLanes), (n |= i), (e.lanes = n), yf(t, n));
    }
  }
  var Zi = {
    readContext: $t,
    use: cs,
    useCallback: _t,
    useContext: _t,
    useEffect: _t,
    useImperativeHandle: _t,
    useLayoutEffect: _t,
    useInsertionEffect: _t,
    useMemo: _t,
    useReducer: _t,
    useRef: _t,
    useState: _t,
    useDebugValue: _t,
    useDeferredValue: _t,
    useTransition: _t,
    useSyncExternalStore: _t,
    useId: _t,
    useHostTransitionStatus: _t,
    useFormState: _t,
    useActionState: _t,
    useOptimistic: _t,
    useMemoCache: _t,
    useCacheRefresh: _t,
  };
  Zi.useEffectEvent = _t;
  var dh = {
      readContext: $t,
      use: cs,
      useCallback: function (t, e) {
        return ((le().memoizedState = [t, e === void 0 ? null : e]), t);
      },
      useContext: $t,
      useEffect: Fd,
      useImperativeHandle: function (t, e, n) {
        ((n = n != null ? n.concat([t]) : null),
          ds(4194308, 4, Id.bind(null, e, t), n));
      },
      useLayoutEffect: function (t, e) {
        return ds(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        ds(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var n = le();
        e = e === void 0 ? null : e;
        var i = t();
        if (ha) {
          Tn(!0);
          try {
            t();
          } finally {
            Tn(!1);
          }
        }
        return ((n.memoizedState = [i, e]), i);
      },
      useReducer: function (t, e, n) {
        var i = le();
        if (n !== void 0) {
          var s = n(e);
          if (ha) {
            Tn(!0);
            try {
              n(e);
            } finally {
              Tn(!1);
            }
          }
        } else s = e;
        return (
          (i.memoizedState = i.baseState = s),
          (t = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: t,
            lastRenderedState: s,
          }),
          (i.queue = t),
          (t = t.dispatch = Jv.bind(null, st, t)),
          [i.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = le();
        return ((t = { current: t }), (e.memoizedState = t));
      },
      useState: function (t) {
        t = No(t);
        var e = t.queue,
          n = rh.bind(null, st, e);
        return ((e.dispatch = n), [t.memoizedState, n]);
      },
      useDebugValue: wo,
      useDeferredValue: function (t, e) {
        var n = le();
        return zo(n, t, e);
      },
      useTransition: function () {
        var t = No(!1);
        return (
          (t = ih.bind(null, st, t.queue, !0, !1)),
          (le().memoizedState = t),
          [!1, t]
        );
      },
      useSyncExternalStore: function (t, e, n) {
        var i = st,
          s = le();
        if (pt) {
          if (n === void 0) throw Error(o(407));
          n = n();
        } else {
          if (((n = e()), Mt === null)) throw Error(o(349));
          (dt & 127) !== 0 || _d(i, e, n);
        }
        s.memoizedState = n;
        var r = { value: n, getSnapshot: e };
        return (
          (s.queue = r),
          Fd(Vd.bind(null, i, r, t), [t]),
          (i.flags |= 2048),
          ka(9, { destroy: void 0 }, Od.bind(null, i, r, n, e), null),
          n
        );
      },
      useId: function () {
        var t = le(),
          e = Mt.identifierPrefix;
        if (pt) {
          var n = Fe,
            i = Je;
          ((n = (i & ~(1 << (32 - ve(i) - 1))).toString(32) + n),
            (e = "_" + e + "R_" + n),
            (n = os++),
            0 < n && (e += "H" + n.toString(32)),
            (e += "_"));
        } else ((n = Yv++), (e = "_" + e + "r_" + n.toString(32) + "_"));
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: _o,
      useFormState: Zd,
      useActionState: Zd,
      useOptimistic: function (t) {
        var e = le();
        e.memoizedState = e.baseState = t;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (e.queue = n),
          (e = Oo.bind(null, st, !0, n)),
          (n.dispatch = e),
          [t, e]
        );
      },
      useMemoCache: Eo,
      useCacheRefresh: function () {
        return (le().memoizedState = kv.bind(null, st));
      },
      useEffectEvent: function (t) {
        var e = le(),
          n = { impl: t };
        return (
          (e.memoizedState = n),
          function () {
            if ((vt & 2) !== 0) throw Error(o(440));
            return n.impl.apply(void 0, arguments);
          }
        );
      },
    },
    Vo = {
      readContext: $t,
      use: cs,
      useCallback: eh,
      useContext: $t,
      useEffect: Co,
      useImperativeHandle: th,
      useInsertionEffect: Pd,
      useLayoutEffect: $d,
      useMemo: nh,
      useReducer: fs,
      useRef: Jd,
      useState: function () {
        return fs(cn);
      },
      useDebugValue: wo,
      useDeferredValue: function (t, e) {
        var n = Lt();
        return ah(n, Tt.memoizedState, t, e);
      },
      useTransition: function () {
        var t = fs(cn)[0],
          e = Lt().memoizedState;
        return [typeof t == "boolean" ? t : Gi(t), e];
      },
      useSyncExternalStore: Rd,
      useId: uh,
      useHostTransitionStatus: _o,
      useFormState: Qd,
      useActionState: Qd,
      useOptimistic: function (t, e) {
        var n = Lt();
        return Ld(n, Tt, t, e);
      },
      useMemoCache: Eo,
      useCacheRefresh: oh,
    };
  Vo.useEffectEvent = Wd;
  var hh = {
    readContext: $t,
    use: cs,
    useCallback: eh,
    useContext: $t,
    useEffect: Co,
    useImperativeHandle: th,
    useInsertionEffect: Pd,
    useLayoutEffect: $d,
    useMemo: nh,
    useReducer: Do,
    useRef: Jd,
    useState: function () {
      return Do(cn);
    },
    useDebugValue: wo,
    useDeferredValue: function (t, e) {
      var n = Lt();
      return Tt === null ? zo(n, t, e) : ah(n, Tt.memoizedState, t, e);
    },
    useTransition: function () {
      var t = Do(cn)[0],
        e = Lt().memoizedState;
      return [typeof t == "boolean" ? t : Gi(t), e];
    },
    useSyncExternalStore: Rd,
    useId: uh,
    useHostTransitionStatus: _o,
    useFormState: kd,
    useActionState: kd,
    useOptimistic: function (t, e) {
      var n = Lt();
      return Tt !== null
        ? Ld(n, Tt, t, e)
        : ((n.baseState = t), [t, n.queue.dispatch]);
    },
    useMemoCache: Eo,
    useCacheRefresh: oh,
  };
  hh.useEffectEvent = Wd;
  function Uo(t, e, n, i) {
    ((e = t.memoizedState),
      (n = n(i, e)),
      (n = n == null ? e : b({}, e, n)),
      (t.memoizedState = n),
      t.lanes === 0 && (t.updateQueue.baseState = n));
  }
  var Bo = {
    enqueueSetState: function (t, e, n) {
      t = t._reactInternals;
      var i = Me(),
        s = wn(i);
      ((s.payload = e),
        n != null && (s.callback = n),
        (e = zn(t, s, i)),
        e !== null && (pe(e, t, i), Li(e, t, i)));
    },
    enqueueReplaceState: function (t, e, n) {
      t = t._reactInternals;
      var i = Me(),
        s = wn(i);
      ((s.tag = 1),
        (s.payload = e),
        n != null && (s.callback = n),
        (e = zn(t, s, i)),
        e !== null && (pe(e, t, i), Li(e, t, i)));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var n = Me(),
        i = wn(n);
      ((i.tag = 2),
        e != null && (i.callback = e),
        (e = zn(t, i, n)),
        e !== null && (pe(e, t, n), Li(e, t, n)));
    },
  };
  function mh(t, e, n, i, s, r, f) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == "function"
        ? t.shouldComponentUpdate(i, r, f)
        : e.prototype && e.prototype.isPureReactComponent
          ? !wi(n, i) || !wi(s, r)
          : !0
    );
  }
  function ph(t, e, n, i) {
    ((t = e.state),
      typeof e.componentWillReceiveProps == "function" &&
        e.componentWillReceiveProps(n, i),
      typeof e.UNSAFE_componentWillReceiveProps == "function" &&
        e.UNSAFE_componentWillReceiveProps(n, i),
      e.state !== t && Bo.enqueueReplaceState(e, e.state, null));
  }
  function ma(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var i in e) i !== "ref" && (n[i] = e[i]);
    }
    if ((t = t.defaultProps)) {
      n === e && (n = b({}, n));
      for (var s in t) n[s] === void 0 && (n[s] = t[s]);
    }
    return n;
  }
  function yh(t) {
    Kl(t);
  }
  function gh(t) {
    console.error(t);
  }
  function vh(t) {
    Kl(t);
  }
  function ps(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (i) {
      setTimeout(function () {
        throw i;
      });
    }
  }
  function xh(t, e, n) {
    try {
      var i = t.onCaughtError;
      i(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null,
      });
    } catch (s) {
      setTimeout(function () {
        throw s;
      });
    }
  }
  function Lo(t, e, n) {
    return (
      (n = wn(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        ps(t, e);
      }),
      n
    );
  }
  function bh(t) {
    return ((t = wn(t)), (t.tag = 3), t);
  }
  function Sh(t, e, n, i) {
    var s = n.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var r = i.value;
      ((t.payload = function () {
        return s(r);
      }),
        (t.callback = function () {
          xh(e, n, i);
        }));
    }
    var f = n.stateNode;
    f !== null &&
      typeof f.componentDidCatch == "function" &&
      (t.callback = function () {
        (xh(e, n, i),
          typeof s != "function" &&
            (Bn === null ? (Bn = new Set([this])) : Bn.add(this)));
        var y = i.stack;
        this.componentDidCatch(i.value, {
          componentStack: y !== null ? y : "",
        });
      });
  }
  function Fv(t, e, n, i, s) {
    if (
      ((n.flags |= 32768),
      i !== null && typeof i == "object" && typeof i.then == "function")
    ) {
      if (
        ((e = n.alternate),
        e !== null && Ha(e, n, s, !0),
        (n = Se.current),
        n !== null)
      ) {
        switch (n.tag) {
          case 31:
          case 13:
            return (
              Ve === null ? Ns() : n.alternate === null && Ot === 0 && (Ot = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = s),
              i === ns
                ? (n.flags |= 16384)
                : ((e = n.updateQueue),
                  e === null ? (n.updateQueue = new Set([i])) : e.add(i),
                  rr(t, i, s)),
              !1
            );
          case 22:
            return (
              (n.flags |= 65536),
              i === ns
                ? (n.flags |= 16384)
                : ((e = n.updateQueue),
                  e === null
                    ? ((e = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([i]),
                      }),
                      (n.updateQueue = e))
                    : ((n = e.retryQueue),
                      n === null ? (e.retryQueue = new Set([i])) : n.add(i)),
                  rr(t, i, s)),
              !1
            );
        }
        throw Error(o(435, n.tag));
      }
      return (rr(t, i, s), Ns(), !1);
    }
    if (pt)
      return (
        (e = Se.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = s),
            i !== no && ((t = Error(o(422), { cause: i })), _i(ze(t, n))))
          : (i !== no && ((e = Error(o(423), { cause: i })), _i(ze(e, n))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (s &= -s),
            (t.lanes |= s),
            (i = ze(i, n)),
            (s = Lo(t.stateNode, i, s)),
            mo(t, s),
            Ot !== 4 && (Ot = 2)),
        !1
      );
    var r = Error(o(520), { cause: i });
    if (
      ((r = ze(r, n)),
      $i === null ? ($i = [r]) : $i.push(r),
      Ot !== 4 && (Ot = 2),
      e === null)
    )
      return !0;
    ((i = ze(i, n)), (n = e));
    do {
      switch (n.tag) {
        case 3:
          return (
            (n.flags |= 65536),
            (t = s & -s),
            (n.lanes |= t),
            (t = Lo(n.stateNode, i, t)),
            mo(n, t),
            !1
          );
        case 1:
          if (
            ((e = n.type),
            (r = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == "function" ||
                (r !== null &&
                  typeof r.componentDidCatch == "function" &&
                  (Bn === null || !Bn.has(r)))))
          )
            return (
              (n.flags |= 65536),
              (s &= -s),
              (n.lanes |= s),
              (s = bh(s)),
              Sh(s, t, n, i),
              mo(n, s),
              !1
            );
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Ho = Error(o(461)),
    Yt = !1;
  function It(t, e, n, i) {
    e.child = t === null ? Md(e, null, n, i) : da(e, t.child, n, i);
  }
  function Th(t, e, n, i, s) {
    n = n.render;
    var r = e.ref;
    if ("ref" in i) {
      var f = {};
      for (var y in i) y !== "ref" && (f[y] = i[y]);
    } else f = i;
    return (
      oa(e),
      (i = bo(t, e, n, f, r, s)),
      (y = So()),
      t !== null && !Yt
        ? (To(t, e, s), fn(t, e, s))
        : (pt && y && to(e), (e.flags |= 1), It(t, e, i, s), e.child)
    );
  }
  function Ah(t, e, n, i, s) {
    if (t === null) {
      var r = n.type;
      return typeof r == "function" &&
        !Pu(r) &&
        r.defaultProps === void 0 &&
        n.compare === null
        ? ((e.tag = 15), (e.type = r), Eh(t, e, r, i, s))
        : ((t = Wl(n.type, null, i, e, e.mode, s)),
          (t.ref = e.ref),
          (t.return = e),
          (e.child = t));
    }
    if (((r = t.child), !ko(t, s))) {
      var f = r.memoizedProps;
      if (
        ((n = n.compare), (n = n !== null ? n : wi), n(f, i) && t.ref === e.ref)
      )
        return fn(t, e, s);
    }
    return (
      (e.flags |= 1),
      (t = ln(r, i)),
      (t.ref = e.ref),
      (t.return = e),
      (e.child = t)
    );
  }
  function Eh(t, e, n, i, s) {
    if (t !== null) {
      var r = t.memoizedProps;
      if (wi(r, i) && t.ref === e.ref)
        if (((Yt = !1), (e.pendingProps = i = r), ko(t, s)))
          (t.flags & 131072) !== 0 && (Yt = !0);
        else return ((e.lanes = t.lanes), fn(t, e, s));
    }
    return qo(t, e, n, i, s);
  }
  function Mh(t, e, n, i) {
    var s = i.children,
      r = t !== null ? t.memoizedState : null;
    if (
      (t === null &&
        e.stateNode === null &&
        (e.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      i.mode === "hidden")
    ) {
      if ((e.flags & 128) !== 0) {
        if (((r = r !== null ? r.baseLanes | n : n), t !== null)) {
          for (i = e.child = t.child, s = 0; i !== null; )
            ((s = s | i.lanes | i.childLanes), (i = i.sibling));
          i = s & ~r;
        } else ((i = 0), (e.child = null));
        return Dh(t, e, r, n, i);
      }
      if ((n & 536870912) !== 0)
        ((e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && ts(e, r !== null ? r.cachePool : null),
          r !== null ? jd(e, r) : yo(),
          Cd(e));
      else
        return (
          (i = e.lanes = 536870912),
          Dh(t, e, r !== null ? r.baseLanes | n : n, n, i)
        );
    } else
      r !== null
        ? (ts(e, r.cachePool), jd(e, r), _n(), (e.memoizedState = null))
        : (t !== null && ts(e, null), yo(), _n());
    return (It(t, e, s, n), e.child);
  }
  function Qi(t, e) {
    return (
      (t !== null && t.tag === 22) ||
        e.stateNode !== null ||
        (e.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      e.sibling
    );
  }
  function Dh(t, e, n, i, s) {
    var r = ro();
    return (
      (r = r === null ? null : { parent: Ht._currentValue, pool: r }),
      (e.memoizedState = { baseLanes: n, cachePool: r }),
      t !== null && ts(e, null),
      yo(),
      Cd(e),
      t !== null && Ha(t, e, i, !0),
      (e.childLanes = s),
      null
    );
  }
  function ys(t, e) {
    return (
      (e = vs({ mode: e.mode, children: e.children }, t.mode)),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function Nh(t, e, n) {
    return (
      da(e, t.child, null, n),
      (t = ys(e, e.pendingProps)),
      (t.flags |= 2),
      Te(e),
      (e.memoizedState = null),
      t
    );
  }
  function Wv(t, e, n) {
    var i = e.pendingProps,
      s = (e.flags & 128) !== 0;
    if (((e.flags &= -129), t === null)) {
      if (pt) {
        if (i.mode === "hidden")
          return ((t = ys(e, i)), (e.lanes = 536870912), Qi(null, t));
        if (
          (vo(e),
          (t = jt)
            ? ((t = Hm(t, Oe)),
              (t = t !== null && t.data === "&" ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: Mn !== null ? { id: Je, overflow: Fe } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = cd(t)),
                (n.return = e),
                (e.child = n),
                (Pt = e),
                (jt = null)))
            : (t = null),
          t === null)
        )
          throw Nn(e);
        return ((e.lanes = 536870912), null);
      }
      return ys(e, i);
    }
    var r = t.memoizedState;
    if (r !== null) {
      var f = r.dehydrated;
      if ((vo(e), s))
        if (e.flags & 256) ((e.flags &= -257), (e = Nh(t, e, n)));
        else if (e.memoizedState !== null)
          ((e.child = t.child), (e.flags |= 128), (e = null));
        else throw Error(o(558));
      else if (
        (Yt || Ha(t, e, n, !1), (s = (n & t.childLanes) !== 0), Yt || s)
      ) {
        if (
          ((i = Mt),
          i !== null && ((f = gf(i, n)), f !== 0 && f !== r.retryLane))
        )
          throw ((r.retryLane = f), ia(t, f), pe(i, t, f), Ho);
        (Ns(), (e = Nh(t, e, n)));
      } else
        ((t = r.treeContext),
          (jt = Ue(f.nextSibling)),
          (Pt = e),
          (pt = !0),
          (Dn = null),
          (Oe = !1),
          t !== null && hd(e, t),
          (e = ys(e, i)),
          (e.flags |= 4096));
      return e;
    }
    return (
      (t = ln(t.child, { mode: i.mode, children: i.children })),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function gs(t, e) {
    var n = e.ref;
    if (n === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object") throw Error(o(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function qo(t, e, n, i, s) {
    return (
      oa(e),
      (n = bo(t, e, n, i, void 0, s)),
      (i = So()),
      t !== null && !Yt
        ? (To(t, e, s), fn(t, e, s))
        : (pt && i && to(e), (e.flags |= 1), It(t, e, n, s), e.child)
    );
  }
  function jh(t, e, n, i, s, r) {
    return (
      oa(e),
      (e.updateQueue = null),
      (n = zd(e, i, n, s)),
      wd(t),
      (i = So()),
      t !== null && !Yt
        ? (To(t, e, r), fn(t, e, r))
        : (pt && i && to(e), (e.flags |= 1), It(t, e, n, r), e.child)
    );
  }
  function Ch(t, e, n, i, s) {
    if ((oa(e), e.stateNode === null)) {
      var r = Va,
        f = n.contextType;
      (typeof f == "object" && f !== null && (r = $t(f)),
        (r = new n(i, r)),
        (e.memoizedState =
          r.state !== null && r.state !== void 0 ? r.state : null),
        (r.updater = Bo),
        (e.stateNode = r),
        (r._reactInternals = e),
        (r = e.stateNode),
        (r.props = i),
        (r.state = e.memoizedState),
        (r.refs = {}),
        fo(e),
        (f = n.contextType),
        (r.context = typeof f == "object" && f !== null ? $t(f) : Va),
        (r.state = e.memoizedState),
        (f = n.getDerivedStateFromProps),
        typeof f == "function" && (Uo(e, n, f, i), (r.state = e.memoizedState)),
        typeof n.getDerivedStateFromProps == "function" ||
          typeof r.getSnapshotBeforeUpdate == "function" ||
          (typeof r.UNSAFE_componentWillMount != "function" &&
            typeof r.componentWillMount != "function") ||
          ((f = r.state),
          typeof r.componentWillMount == "function" && r.componentWillMount(),
          typeof r.UNSAFE_componentWillMount == "function" &&
            r.UNSAFE_componentWillMount(),
          f !== r.state && Bo.enqueueReplaceState(r, r.state, null),
          qi(e, i, r, s),
          Hi(),
          (r.state = e.memoizedState)),
        typeof r.componentDidMount == "function" && (e.flags |= 4194308),
        (i = !0));
    } else if (t === null) {
      r = e.stateNode;
      var y = e.memoizedProps,
        S = ma(n, y);
      r.props = S;
      var N = r.context,
        R = n.contextType;
      ((f = Va), typeof R == "object" && R !== null && (f = $t(R)));
      var V = n.getDerivedStateFromProps;
      ((R =
        typeof V == "function" ||
        typeof r.getSnapshotBeforeUpdate == "function"),
        (y = e.pendingProps !== y),
        R ||
          (typeof r.UNSAFE_componentWillReceiveProps != "function" &&
            typeof r.componentWillReceiveProps != "function") ||
          ((y || N !== f) && ph(e, r, i, f)),
        (Cn = !1));
      var j = e.memoizedState;
      ((r.state = j),
        qi(e, i, r, s),
        Hi(),
        (N = e.memoizedState),
        y || j !== N || Cn
          ? (typeof V == "function" && (Uo(e, n, V, i), (N = e.memoizedState)),
            (S = Cn || mh(e, n, S, i, j, N, f))
              ? (R ||
                  (typeof r.UNSAFE_componentWillMount != "function" &&
                    typeof r.componentWillMount != "function") ||
                  (typeof r.componentWillMount == "function" &&
                    r.componentWillMount(),
                  typeof r.UNSAFE_componentWillMount == "function" &&
                    r.UNSAFE_componentWillMount()),
                typeof r.componentDidMount == "function" &&
                  (e.flags |= 4194308))
              : (typeof r.componentDidMount == "function" &&
                  (e.flags |= 4194308),
                (e.memoizedProps = i),
                (e.memoizedState = N)),
            (r.props = i),
            (r.state = N),
            (r.context = f),
            (i = S))
          : (typeof r.componentDidMount == "function" && (e.flags |= 4194308),
            (i = !1)));
    } else {
      ((r = e.stateNode),
        ho(t, e),
        (f = e.memoizedProps),
        (R = ma(n, f)),
        (r.props = R),
        (V = e.pendingProps),
        (j = r.context),
        (N = n.contextType),
        (S = Va),
        typeof N == "object" && N !== null && (S = $t(N)),
        (y = n.getDerivedStateFromProps),
        (N =
          typeof y == "function" ||
          typeof r.getSnapshotBeforeUpdate == "function") ||
          (typeof r.UNSAFE_componentWillReceiveProps != "function" &&
            typeof r.componentWillReceiveProps != "function") ||
          ((f !== V || j !== S) && ph(e, r, i, S)),
        (Cn = !1),
        (j = e.memoizedState),
        (r.state = j),
        qi(e, i, r, s),
        Hi());
      var w = e.memoizedState;
      f !== V ||
      j !== w ||
      Cn ||
      (t !== null && t.dependencies !== null && $l(t.dependencies))
        ? (typeof y == "function" && (Uo(e, n, y, i), (w = e.memoizedState)),
          (R =
            Cn ||
            mh(e, n, R, i, j, w, S) ||
            (t !== null && t.dependencies !== null && $l(t.dependencies)))
            ? (N ||
                (typeof r.UNSAFE_componentWillUpdate != "function" &&
                  typeof r.componentWillUpdate != "function") ||
                (typeof r.componentWillUpdate == "function" &&
                  r.componentWillUpdate(i, w, S),
                typeof r.UNSAFE_componentWillUpdate == "function" &&
                  r.UNSAFE_componentWillUpdate(i, w, S)),
              typeof r.componentDidUpdate == "function" && (e.flags |= 4),
              typeof r.getSnapshotBeforeUpdate == "function" &&
                (e.flags |= 1024))
            : (typeof r.componentDidUpdate != "function" ||
                (f === t.memoizedProps && j === t.memoizedState) ||
                (e.flags |= 4),
              typeof r.getSnapshotBeforeUpdate != "function" ||
                (f === t.memoizedProps && j === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = i),
              (e.memoizedState = w)),
          (r.props = i),
          (r.state = w),
          (r.context = S),
          (i = R))
        : (typeof r.componentDidUpdate != "function" ||
            (f === t.memoizedProps && j === t.memoizedState) ||
            (e.flags |= 4),
          typeof r.getSnapshotBeforeUpdate != "function" ||
            (f === t.memoizedProps && j === t.memoizedState) ||
            (e.flags |= 1024),
          (i = !1));
    }
    return (
      (r = i),
      gs(t, e),
      (i = (e.flags & 128) !== 0),
      r || i
        ? ((r = e.stateNode),
          (n =
            i && typeof n.getDerivedStateFromError != "function"
              ? null
              : r.render()),
          (e.flags |= 1),
          t !== null && i
            ? ((e.child = da(e, t.child, null, s)),
              (e.child = da(e, null, n, s)))
            : It(t, e, n, s),
          (e.memoizedState = r.state),
          (t = e.child))
        : (t = fn(t, e, s)),
      t
    );
  }
  function wh(t, e, n, i) {
    return (sa(), (e.flags |= 256), It(t, e, n, i), e.child);
  }
  var Yo = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function Go(t) {
    return { baseLanes: t, cachePool: xd() };
  }
  function Xo(t, e, n) {
    return ((t = t !== null ? t.childLanes & ~n : 0), e && (t |= Ee), t);
  }
  function zh(t, e, n) {
    var i = e.pendingProps,
      s = !1,
      r = (e.flags & 128) !== 0,
      f;
    if (
      ((f = r) ||
        (f =
          t !== null && t.memoizedState === null ? !1 : (Bt.current & 2) !== 0),
      f && ((s = !0), (e.flags &= -129)),
      (f = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (pt) {
        if (
          (s ? Rn(e) : _n(),
          (t = jt)
            ? ((t = Hm(t, Oe)),
              (t = t !== null && t.data !== "&" ? t : null),
              t !== null &&
                ((e.memoizedState = {
                  dehydrated: t,
                  treeContext: Mn !== null ? { id: Je, overflow: Fe } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = cd(t)),
                (n.return = e),
                (e.child = n),
                (Pt = e),
                (jt = null)))
            : (t = null),
          t === null)
        )
          throw Nn(e);
        return (Mr(t) ? (e.lanes = 32) : (e.lanes = 536870912), null);
      }
      var y = i.children;
      return (
        (i = i.fallback),
        s
          ? (_n(),
            (s = e.mode),
            (y = vs({ mode: "hidden", children: y }, s)),
            (i = la(i, s, n, null)),
            (y.return = e),
            (i.return = e),
            (y.sibling = i),
            (e.child = y),
            (i = e.child),
            (i.memoizedState = Go(n)),
            (i.childLanes = Xo(t, f, n)),
            (e.memoizedState = Yo),
            Qi(null, i))
          : (Rn(e), Zo(e, y))
      );
    }
    var S = t.memoizedState;
    if (S !== null && ((y = S.dehydrated), y !== null)) {
      if (r)
        e.flags & 256
          ? (Rn(e), (e.flags &= -257), (e = Qo(t, e, n)))
          : e.memoizedState !== null
            ? (_n(), (e.child = t.child), (e.flags |= 128), (e = null))
            : (_n(),
              (y = i.fallback),
              (s = e.mode),
              (i = vs({ mode: "visible", children: i.children }, s)),
              (y = la(y, s, n, null)),
              (y.flags |= 2),
              (i.return = e),
              (y.return = e),
              (i.sibling = y),
              (e.child = i),
              da(e, t.child, null, n),
              (i = e.child),
              (i.memoizedState = Go(n)),
              (i.childLanes = Xo(t, f, n)),
              (e.memoizedState = Yo),
              (e = Qi(null, i)));
      else if ((Rn(e), Mr(y))) {
        if (((f = y.nextSibling && y.nextSibling.dataset), f)) var N = f.dgst;
        ((f = N),
          (i = Error(o(419))),
          (i.stack = ""),
          (i.digest = f),
          _i({ value: i, source: null, stack: null }),
          (e = Qo(t, e, n)));
      } else if (
        (Yt || Ha(t, e, n, !1), (f = (n & t.childLanes) !== 0), Yt || f)
      ) {
        if (
          ((f = Mt),
          f !== null && ((i = gf(f, n)), i !== 0 && i !== S.retryLane))
        )
          throw ((S.retryLane = i), ia(t, i), pe(f, t, i), Ho);
        (Er(y) || Ns(), (e = Qo(t, e, n)));
      } else
        Er(y)
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = S.treeContext),
            (jt = Ue(y.nextSibling)),
            (Pt = e),
            (pt = !0),
            (Dn = null),
            (Oe = !1),
            t !== null && hd(e, t),
            (e = Zo(e, i.children)),
            (e.flags |= 4096));
      return e;
    }
    return s
      ? (_n(),
        (y = i.fallback),
        (s = e.mode),
        (S = t.child),
        (N = S.sibling),
        (i = ln(S, { mode: "hidden", children: i.children })),
        (i.subtreeFlags = S.subtreeFlags & 65011712),
        N !== null ? (y = ln(N, y)) : ((y = la(y, s, n, null)), (y.flags |= 2)),
        (y.return = e),
        (i.return = e),
        (i.sibling = y),
        (e.child = i),
        Qi(null, i),
        (i = e.child),
        (y = t.child.memoizedState),
        y === null
          ? (y = Go(n))
          : ((s = y.cachePool),
            s !== null
              ? ((S = Ht._currentValue),
                (s = s.parent !== S ? { parent: S, pool: S } : s))
              : (s = xd()),
            (y = { baseLanes: y.baseLanes | n, cachePool: s })),
        (i.memoizedState = y),
        (i.childLanes = Xo(t, f, n)),
        (e.memoizedState = Yo),
        Qi(t.child, i))
      : (Rn(e),
        (n = t.child),
        (t = n.sibling),
        (n = ln(n, { mode: "visible", children: i.children })),
        (n.return = e),
        (n.sibling = null),
        t !== null &&
          ((f = e.deletions),
          f === null ? ((e.deletions = [t]), (e.flags |= 16)) : f.push(t)),
        (e.child = n),
        (e.memoizedState = null),
        n);
  }
  function Zo(t, e) {
    return (
      (e = vs({ mode: "visible", children: e }, t.mode)),
      (e.return = t),
      (t.child = e)
    );
  }
  function vs(t, e) {
    return ((t = be(22, t, null, e)), (t.lanes = 0), t);
  }
  function Qo(t, e, n) {
    return (
      da(e, t.child, null, n),
      (t = Zo(e, e.pendingProps.children)),
      (t.flags |= 2),
      (e.memoizedState = null),
      t
    );
  }
  function Rh(t, e, n) {
    t.lanes |= e;
    var i = t.alternate;
    (i !== null && (i.lanes |= e), lo(t.return, e, n));
  }
  function Ko(t, e, n, i, s, r) {
    var f = t.memoizedState;
    f === null
      ? (t.memoizedState = {
          isBackwards: e,
          rendering: null,
          renderingStartTime: 0,
          last: i,
          tail: n,
          tailMode: s,
          treeForkCount: r,
        })
      : ((f.isBackwards = e),
        (f.rendering = null),
        (f.renderingStartTime = 0),
        (f.last = i),
        (f.tail = n),
        (f.tailMode = s),
        (f.treeForkCount = r));
  }
  function _h(t, e, n) {
    var i = e.pendingProps,
      s = i.revealOrder,
      r = i.tail;
    i = i.children;
    var f = Bt.current,
      y = (f & 2) !== 0;
    if (
      (y ? ((f = (f & 1) | 2), (e.flags |= 128)) : (f &= 1),
      K(Bt, f),
      It(t, e, i, n),
      (i = pt ? Ri : 0),
      !y && t !== null && (t.flags & 128) !== 0)
    )
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Rh(t, n, e);
        else if (t.tag === 19) Rh(t, n, e);
        else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) break t;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    switch (s) {
      case "forwards":
        for (n = e.child, s = null; n !== null; )
          ((t = n.alternate),
            t !== null && ss(t) === null && (s = n),
            (n = n.sibling));
        ((n = s),
          n === null
            ? ((s = e.child), (e.child = null))
            : ((s = n.sibling), (n.sibling = null)),
          Ko(e, !1, s, n, r, i));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, s = e.child, e.child = null; s !== null; ) {
          if (((t = s.alternate), t !== null && ss(t) === null)) {
            e.child = s;
            break;
          }
          ((t = s.sibling), (s.sibling = n), (n = s), (s = t));
        }
        Ko(e, !0, n, null, r, i);
        break;
      case "together":
        Ko(e, !1, null, null, void 0, i);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function fn(t, e, n) {
    if (
      (t !== null && (e.dependencies = t.dependencies),
      (Un |= e.lanes),
      (n & e.childLanes) === 0)
    )
      if (t !== null) {
        if ((Ha(t, e, n, !1), (n & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(o(153));
    if (e.child !== null) {
      for (
        t = e.child, n = ln(t, t.pendingProps), e.child = n, n.return = e;
        t.sibling !== null;
      )
        ((t = t.sibling),
          (n = n.sibling = ln(t, t.pendingProps)),
          (n.return = e));
      n.sibling = null;
    }
    return e.child;
  }
  function ko(t, e) {
    return (t.lanes & e) !== 0
      ? !0
      : ((t = t.dependencies), !!(t !== null && $l(t)));
  }
  function Pv(t, e, n) {
    switch (e.tag) {
      case 3:
        (ie(e, e.stateNode.containerInfo),
          jn(e, Ht, t.memoizedState.cache),
          sa());
        break;
      case 27:
      case 5:
        gi(e);
        break;
      case 4:
        ie(e, e.stateNode.containerInfo);
        break;
      case 10:
        jn(e, e.type, e.memoizedProps.value);
        break;
      case 31:
        if (e.memoizedState !== null) return ((e.flags |= 128), vo(e), null);
        break;
      case 13:
        var i = e.memoizedState;
        if (i !== null)
          return i.dehydrated !== null
            ? (Rn(e), (e.flags |= 128), null)
            : (n & e.child.childLanes) !== 0
              ? zh(t, e, n)
              : (Rn(e), (t = fn(t, e, n)), t !== null ? t.sibling : null);
        Rn(e);
        break;
      case 19:
        var s = (t.flags & 128) !== 0;
        if (
          ((i = (n & e.childLanes) !== 0),
          i || (Ha(t, e, n, !1), (i = (n & e.childLanes) !== 0)),
          s)
        ) {
          if (i) return _h(t, e, n);
          e.flags |= 128;
        }
        if (
          ((s = e.memoizedState),
          s !== null &&
            ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
          K(Bt, Bt.current),
          i)
        )
          break;
        return null;
      case 22:
        return ((e.lanes = 0), Mh(t, e, n, e.pendingProps));
      case 24:
        jn(e, Ht, t.memoizedState.cache);
    }
    return fn(t, e, n);
  }
  function Oh(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) Yt = !0;
      else {
        if (!ko(t, n) && (e.flags & 128) === 0) return ((Yt = !1), Pv(t, e, n));
        Yt = (t.flags & 131072) !== 0;
      }
    else ((Yt = !1), pt && (e.flags & 1048576) !== 0 && dd(e, Ri, e.index));
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          var i = e.pendingProps;
          if (((t = ca(e.elementType)), (e.type = t), typeof t == "function"))
            Pu(t)
              ? ((i = ma(t, i)), (e.tag = 1), (e = Ch(null, e, t, i, n)))
              : ((e.tag = 0), (e = qo(null, e, t, i, n)));
          else {
            if (t != null) {
              var s = t.$$typeof;
              if (s === Z) {
                ((e.tag = 11), (e = Th(null, e, t, i, n)));
                break t;
              } else if (s === P) {
                ((e.tag = 14), (e = Ah(null, e, t, i, n)));
                break t;
              }
            }
            throw ((e = qe(t) || t), Error(o(306, e, "")));
          }
        }
        return e;
      case 0:
        return qo(t, e, e.type, e.pendingProps, n);
      case 1:
        return ((i = e.type), (s = ma(i, e.pendingProps)), Ch(t, e, i, s, n));
      case 3:
        t: {
          if ((ie(e, e.stateNode.containerInfo), t === null))
            throw Error(o(387));
          i = e.pendingProps;
          var r = e.memoizedState;
          ((s = r.element), ho(t, e), qi(e, i, null, n));
          var f = e.memoizedState;
          if (
            ((i = f.cache),
            jn(e, Ht, i),
            i !== r.cache && so(e, [Ht], n, !0),
            Hi(),
            (i = f.element),
            r.isDehydrated)
          )
            if (
              ((r = { element: i, isDehydrated: !1, cache: f.cache }),
              (e.updateQueue.baseState = r),
              (e.memoizedState = r),
              e.flags & 256)
            ) {
              e = wh(t, e, i, n);
              break t;
            } else if (i !== s) {
              ((s = ze(Error(o(424)), e)), _i(s), (e = wh(t, e, i, n)));
              break t;
            } else {
              switch (((t = e.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (
                jt = Ue(t.firstChild),
                  Pt = e,
                  pt = !0,
                  Dn = null,
                  Oe = !0,
                  n = Md(e, null, i, n),
                  e.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
            }
          else {
            if ((sa(), i === s)) {
              e = fn(t, e, n);
              break t;
            }
            It(t, e, i, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          gs(t, e),
          t === null
            ? (n = Qm(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = n)
              : pt ||
                ((n = e.type),
                (t = e.pendingProps),
                (i = Os(rt.current).createElement(n)),
                (i[Wt] = e),
                (i[re] = t),
                te(i, n, t),
                Jt(i),
                (e.stateNode = i))
            : (e.memoizedState = Qm(
                e.type,
                t.memoizedProps,
                e.pendingProps,
                t.memoizedState,
              )),
          null
        );
      case 27:
        return (
          gi(e),
          t === null &&
            pt &&
            ((i = e.stateNode = Gm(e.type, e.pendingProps, rt.current)),
            (Pt = e),
            (Oe = !0),
            (s = jt),
            Yn(e.type) ? ((Dr = s), (jt = Ue(i.firstChild))) : (jt = s)),
          It(t, e, e.pendingProps.children, n),
          gs(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            pt &&
            ((s = i = jt) &&
              ((i = N1(i, e.type, e.pendingProps, Oe)),
              i !== null
                ? ((e.stateNode = i),
                  (Pt = e),
                  (jt = Ue(i.firstChild)),
                  (Oe = !1),
                  (s = !0))
                : (s = !1)),
            s || Nn(e)),
          gi(e),
          (s = e.type),
          (r = e.pendingProps),
          (f = t !== null ? t.memoizedProps : null),
          (i = r.children),
          Sr(s, r) ? (i = null) : f !== null && Sr(s, f) && (e.flags |= 32),
          e.memoizedState !== null &&
            ((s = bo(t, e, Gv, null, null, n)), (sl._currentValue = s)),
          gs(t, e),
          It(t, e, i, n),
          e.child
        );
      case 6:
        return (
          t === null &&
            pt &&
            ((t = n = jt) &&
              ((n = j1(n, e.pendingProps, Oe)),
              n !== null
                ? ((e.stateNode = n), (Pt = e), (jt = null), (t = !0))
                : (t = !1)),
            t || Nn(e)),
          null
        );
      case 13:
        return zh(t, e, n);
      case 4:
        return (
          ie(e, e.stateNode.containerInfo),
          (i = e.pendingProps),
          t === null ? (e.child = da(e, null, i, n)) : It(t, e, i, n),
          e.child
        );
      case 11:
        return Th(t, e, e.type, e.pendingProps, n);
      case 7:
        return (It(t, e, e.pendingProps, n), e.child);
      case 8:
        return (It(t, e, e.pendingProps.children, n), e.child);
      case 12:
        return (It(t, e, e.pendingProps.children, n), e.child);
      case 10:
        return (
          (i = e.pendingProps),
          jn(e, e.type, i.value),
          It(t, e, i.children, n),
          e.child
        );
      case 9:
        return (
          (s = e.type._context),
          (i = e.pendingProps.children),
          oa(e),
          (s = $t(s)),
          (i = i(s)),
          (e.flags |= 1),
          It(t, e, i, n),
          e.child
        );
      case 14:
        return Ah(t, e, e.type, e.pendingProps, n);
      case 15:
        return Eh(t, e, e.type, e.pendingProps, n);
      case 19:
        return _h(t, e, n);
      case 31:
        return Wv(t, e, n);
      case 22:
        return Mh(t, e, n, e.pendingProps);
      case 24:
        return (
          oa(e),
          (i = $t(Ht)),
          t === null
            ? ((s = ro()),
              s === null &&
                ((s = Mt),
                (r = uo()),
                (s.pooledCache = r),
                r.refCount++,
                r !== null && (s.pooledCacheLanes |= n),
                (s = r)),
              (e.memoizedState = { parent: i, cache: s }),
              fo(e),
              jn(e, Ht, s))
            : ((t.lanes & n) !== 0 && (ho(t, e), qi(e, null, null, n), Hi()),
              (s = t.memoizedState),
              (r = e.memoizedState),
              s.parent !== i
                ? ((s = { parent: i, cache: i }),
                  (e.memoizedState = s),
                  e.lanes === 0 &&
                    (e.memoizedState = e.updateQueue.baseState = s),
                  jn(e, Ht, i))
                : ((i = r.cache),
                  jn(e, Ht, i),
                  i !== s.cache && so(e, [Ht], n, !0))),
          It(t, e, e.pendingProps.children, n),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(o(156, e.tag));
  }
  function dn(t) {
    t.flags |= 4;
  }
  function Jo(t, e, n, i, s) {
    if (((e = (t.mode & 32) !== 0) && (e = !1), e)) {
      if (((t.flags |= 16777216), (s & 335544128) === s))
        if (t.stateNode.complete) t.flags |= 8192;
        else if (um()) t.flags |= 8192;
        else throw ((fa = ns), co);
    } else t.flags &= -16777217;
  }
  function Vh(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (((t.flags |= 16777216), !Wm(e)))
      if (um()) t.flags |= 8192;
      else throw ((fa = ns), co);
  }
  function xs(t, e) {
    (e !== null && (t.flags |= 4),
      t.flags & 16384 &&
        ((e = t.tag !== 22 ? mf() : 536870912), (t.lanes |= e), (Pa |= e)));
  }
  function Ki(t, e) {
    if (!pt)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var n = null; e !== null; )
            (e.alternate !== null && (n = e), (e = e.sibling));
          n === null ? (t.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = t.tail;
          for (var i = null; n !== null; )
            (n.alternate !== null && (i = n), (n = n.sibling));
          i === null
            ? e || t.tail === null
              ? (t.tail = null)
              : (t.tail.sibling = null)
            : (i.sibling = null);
      }
  }
  function Ct(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      n = 0,
      i = 0;
    if (e)
      for (var s = t.child; s !== null; )
        ((n |= s.lanes | s.childLanes),
          (i |= s.subtreeFlags & 65011712),
          (i |= s.flags & 65011712),
          (s.return = t),
          (s = s.sibling));
    else
      for (s = t.child; s !== null; )
        ((n |= s.lanes | s.childLanes),
          (i |= s.subtreeFlags),
          (i |= s.flags),
          (s.return = t),
          (s = s.sibling));
    return ((t.subtreeFlags |= i), (t.childLanes = n), e);
  }
  function $v(t, e, n) {
    var i = e.pendingProps;
    switch ((eo(e), e.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Ct(e), null);
      case 1:
        return (Ct(e), null);
      case 3:
        return (
          (n = e.stateNode),
          (i = null),
          t !== null && (i = t.memoizedState.cache),
          e.memoizedState.cache !== i && (e.flags |= 2048),
          on(Ht),
          Ut(),
          n.pendingContext &&
            ((n.context = n.pendingContext), (n.pendingContext = null)),
          (t === null || t.child === null) &&
            (La(e)
              ? dn(e)
              : t === null ||
                (t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                ((e.flags |= 1024), ao())),
          Ct(e),
          null
        );
      case 26:
        var s = e.type,
          r = e.memoizedState;
        return (
          t === null
            ? (dn(e),
              r !== null ? (Ct(e), Vh(e, r)) : (Ct(e), Jo(e, s, null, i, n)))
            : r
              ? r !== t.memoizedState
                ? (dn(e), Ct(e), Vh(e, r))
                : (Ct(e), (e.flags &= -16777217))
              : ((t = t.memoizedProps),
                t !== i && dn(e),
                Ct(e),
                Jo(e, s, t, i, n)),
          null
        );
      case 27:
        if (
          (wl(e),
          (n = rt.current),
          (s = e.type),
          t !== null && e.stateNode != null)
        )
          t.memoizedProps !== i && dn(e);
        else {
          if (!i) {
            if (e.stateNode === null) throw Error(o(166));
            return (Ct(e), null);
          }
          ((t = W.current),
            La(e) ? md(e) : ((t = Gm(s, i, n)), (e.stateNode = t), dn(e)));
        }
        return (Ct(e), null);
      case 5:
        if ((wl(e), (s = e.type), t !== null && e.stateNode != null))
          t.memoizedProps !== i && dn(e);
        else {
          if (!i) {
            if (e.stateNode === null) throw Error(o(166));
            return (Ct(e), null);
          }
          if (((r = W.current), La(e))) md(e);
          else {
            var f = Os(rt.current);
            switch (r) {
              case 1:
                r = f.createElementNS("http://www.w3.org/2000/svg", s);
                break;
              case 2:
                r = f.createElementNS("http://www.w3.org/1998/Math/MathML", s);
                break;
              default:
                switch (s) {
                  case "svg":
                    r = f.createElementNS("http://www.w3.org/2000/svg", s);
                    break;
                  case "math":
                    r = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      s,
                    );
                    break;
                  case "script":
                    ((r = f.createElement("div")),
                      (r.innerHTML = "<script><\/script>"),
                      (r = r.removeChild(r.firstChild)));
                    break;
                  case "select":
                    ((r =
                      typeof i.is == "string"
                        ? f.createElement("select", { is: i.is })
                        : f.createElement("select")),
                      i.multiple
                        ? (r.multiple = !0)
                        : i.size && (r.size = i.size));
                    break;
                  default:
                    r =
                      typeof i.is == "string"
                        ? f.createElement(s, { is: i.is })
                        : f.createElement(s);
                }
            }
            ((r[Wt] = e), (r[re] = i));
            t: for (f = e.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6) r.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                ((f.child.return = f), (f = f.child));
                continue;
              }
              if (f === e) break t;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === e) break t;
                f = f.return;
              }
              ((f.sibling.return = f.return), (f = f.sibling));
            }
            e.stateNode = r;
            t: switch ((te(r, s, i), s)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                i = !!i.autoFocus;
                break t;
              case "img":
                i = !0;
                break t;
              default:
                i = !1;
            }
            i && dn(e);
          }
        }
        return (
          Ct(e),
          Jo(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, n),
          null
        );
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== i && dn(e);
        else {
          if (typeof i != "string" && e.stateNode === null) throw Error(o(166));
          if (((t = rt.current), La(e))) {
            if (
              ((t = e.stateNode),
              (n = e.memoizedProps),
              (i = null),
              (s = Pt),
              s !== null)
            )
              switch (s.tag) {
                case 27:
                case 5:
                  i = s.memoizedProps;
              }
            ((t[Wt] = e),
              (t = !!(
                t.nodeValue === n ||
                (i !== null && i.suppressHydrationWarning === !0) ||
                zm(t.nodeValue, n)
              )),
              t || Nn(e, !0));
          } else
            ((t = Os(t).createTextNode(i)), (t[Wt] = e), (e.stateNode = t));
        }
        return (Ct(e), null);
      case 31:
        if (((n = e.memoizedState), t === null || t.memoizedState !== null)) {
          if (((i = La(e)), n !== null)) {
            if (t === null) {
              if (!i) throw Error(o(318));
              if (
                ((t = e.memoizedState),
                (t = t !== null ? t.dehydrated : null),
                !t)
              )
                throw Error(o(557));
              t[Wt] = e;
            } else
              (sa(),
                (e.flags & 128) === 0 && (e.memoizedState = null),
                (e.flags |= 4));
            (Ct(e), (t = !1));
          } else
            ((n = ao()),
              t !== null &&
                t.memoizedState !== null &&
                (t.memoizedState.hydrationErrors = n),
              (t = !0));
          if (!t) return e.flags & 256 ? (Te(e), e) : (Te(e), null);
          if ((e.flags & 128) !== 0) throw Error(o(558));
        }
        return (Ct(e), null);
      case 13:
        if (
          ((i = e.memoizedState),
          t === null ||
            (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((s = La(e)), i !== null && i.dehydrated !== null)) {
            if (t === null) {
              if (!s) throw Error(o(318));
              if (
                ((s = e.memoizedState),
                (s = s !== null ? s.dehydrated : null),
                !s)
              )
                throw Error(o(317));
              s[Wt] = e;
            } else
              (sa(),
                (e.flags & 128) === 0 && (e.memoizedState = null),
                (e.flags |= 4));
            (Ct(e), (s = !1));
          } else
            ((s = ao()),
              t !== null &&
                t.memoizedState !== null &&
                (t.memoizedState.hydrationErrors = s),
              (s = !0));
          if (!s) return e.flags & 256 ? (Te(e), e) : (Te(e), null);
        }
        return (
          Te(e),
          (e.flags & 128) !== 0
            ? ((e.lanes = n), e)
            : ((n = i !== null),
              (t = t !== null && t.memoizedState !== null),
              n &&
                ((i = e.child),
                (s = null),
                i.alternate !== null &&
                  i.alternate.memoizedState !== null &&
                  i.alternate.memoizedState.cachePool !== null &&
                  (s = i.alternate.memoizedState.cachePool.pool),
                (r = null),
                i.memoizedState !== null &&
                  i.memoizedState.cachePool !== null &&
                  (r = i.memoizedState.cachePool.pool),
                r !== s && (i.flags |= 2048)),
              n !== t && n && (e.child.flags |= 8192),
              xs(e, e.updateQueue),
              Ct(e),
              null)
        );
      case 4:
        return (Ut(), t === null && yr(e.stateNode.containerInfo), Ct(e), null);
      case 10:
        return (on(e.type), Ct(e), null);
      case 19:
        if ((U(Bt), (i = e.memoizedState), i === null)) return (Ct(e), null);
        if (((s = (e.flags & 128) !== 0), (r = i.rendering), r === null))
          if (s) Ki(i, !1);
          else {
            if (Ot !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null; ) {
                if (((r = ss(t)), r !== null)) {
                  for (
                    e.flags |= 128,
                      Ki(i, !1),
                      t = r.updateQueue,
                      e.updateQueue = t,
                      xs(e, t),
                      e.subtreeFlags = 0,
                      t = n,
                      n = e.child;
                    n !== null;
                  )
                    (rd(n, t), (n = n.sibling));
                  return (
                    K(Bt, (Bt.current & 1) | 2),
                    pt && sn(e, i.treeForkCount),
                    e.child
                  );
                }
                t = t.sibling;
              }
            i.tail !== null &&
              ye() > Es &&
              ((e.flags |= 128), (s = !0), Ki(i, !1), (e.lanes = 4194304));
          }
        else {
          if (!s)
            if (((t = ss(r)), t !== null)) {
              if (
                ((e.flags |= 128),
                (s = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                xs(e, t),
                Ki(i, !0),
                i.tail === null &&
                  i.tailMode === "hidden" &&
                  !r.alternate &&
                  !pt)
              )
                return (Ct(e), null);
            } else
              2 * ye() - i.renderingStartTime > Es &&
                n !== 536870912 &&
                ((e.flags |= 128), (s = !0), Ki(i, !1), (e.lanes = 4194304));
          i.isBackwards
            ? ((r.sibling = e.child), (e.child = r))
            : ((t = i.last),
              t !== null ? (t.sibling = r) : (e.child = r),
              (i.last = r));
        }
        return i.tail !== null
          ? ((t = i.tail),
            (i.rendering = t),
            (i.tail = t.sibling),
            (i.renderingStartTime = ye()),
            (t.sibling = null),
            (n = Bt.current),
            K(Bt, s ? (n & 1) | 2 : n & 1),
            pt && sn(e, i.treeForkCount),
            t)
          : (Ct(e), null);
      case 22:
      case 23:
        return (
          Te(e),
          go(),
          (i = e.memoizedState !== null),
          t !== null
            ? (t.memoizedState !== null) !== i && (e.flags |= 8192)
            : i && (e.flags |= 8192),
          i
            ? (n & 536870912) !== 0 &&
              (e.flags & 128) === 0 &&
              (Ct(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : Ct(e),
          (n = e.updateQueue),
          n !== null && xs(e, n.retryQueue),
          (n = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (n = t.memoizedState.cachePool.pool),
          (i = null),
          e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (i = e.memoizedState.cachePool.pool),
          i !== n && (e.flags |= 2048),
          t !== null && U(ra),
          null
        );
      case 24:
        return (
          (n = null),
          t !== null && (n = t.memoizedState.cache),
          e.memoizedState.cache !== n && (e.flags |= 2048),
          on(Ht),
          Ct(e),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, e.tag));
  }
  function Iv(t, e) {
    switch ((eo(e), e.tag)) {
      case 1:
        return (
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 3:
        return (
          on(Ht),
          Ut(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0
            ? ((e.flags = (t & -65537) | 128), e)
            : null
        );
      case 26:
      case 27:
      case 5:
        return (wl(e), null);
      case 31:
        if (e.memoizedState !== null) {
          if ((Te(e), e.alternate === null)) throw Error(o(340));
          sa();
        }
        return (
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 13:
        if (
          (Te(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)
        ) {
          if (e.alternate === null) throw Error(o(340));
          sa();
        }
        return (
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 19:
        return (U(Bt), null);
      case 4:
        return (Ut(), null);
      case 10:
        return (on(e.type), null);
      case 22:
      case 23:
        return (
          Te(e),
          go(),
          t !== null && U(ra),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return (on(Ht), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Uh(t, e) {
    switch ((eo(e), e.tag)) {
      case 3:
        (on(Ht), Ut());
        break;
      case 26:
      case 27:
      case 5:
        wl(e);
        break;
      case 4:
        Ut();
        break;
      case 31:
        e.memoizedState !== null && Te(e);
        break;
      case 13:
        Te(e);
        break;
      case 19:
        U(Bt);
        break;
      case 10:
        on(e.type);
        break;
      case 22:
      case 23:
        (Te(e), go(), t !== null && U(ra));
        break;
      case 24:
        on(Ht);
    }
  }
  function ki(t, e) {
    try {
      var n = e.updateQueue,
        i = n !== null ? n.lastEffect : null;
      if (i !== null) {
        var s = i.next;
        n = s;
        do {
          if ((n.tag & t) === t) {
            i = void 0;
            var r = n.create,
              f = n.inst;
            ((i = r()), (f.destroy = i));
          }
          n = n.next;
        } while (n !== s);
      }
    } catch (y) {
      St(e, e.return, y);
    }
  }
  function On(t, e, n) {
    try {
      var i = e.updateQueue,
        s = i !== null ? i.lastEffect : null;
      if (s !== null) {
        var r = s.next;
        i = r;
        do {
          if ((i.tag & t) === t) {
            var f = i.inst,
              y = f.destroy;
            if (y !== void 0) {
              ((f.destroy = void 0), (s = e));
              var S = n,
                N = y;
              try {
                N();
              } catch (R) {
                St(s, S, R);
              }
            }
          }
          i = i.next;
        } while (i !== r);
      }
    } catch (R) {
      St(e, e.return, R);
    }
  }
  function Bh(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        Nd(e, n);
      } catch (i) {
        St(t, t.return, i);
      }
    }
  }
  function Lh(t, e, n) {
    ((n.props = ma(t.type, t.memoizedProps)), (n.state = t.memoizedState));
    try {
      n.componentWillUnmount();
    } catch (i) {
      St(t, e, i);
    }
  }
  function Ji(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var i = t.stateNode;
            break;
          case 30:
            i = t.stateNode;
            break;
          default:
            i = t.stateNode;
        }
        typeof n == "function" ? (t.refCleanup = n(i)) : (n.current = i);
      }
    } catch (s) {
      St(t, e, s);
    }
  }
  function We(t, e) {
    var n = t.ref,
      i = t.refCleanup;
    if (n !== null)
      if (typeof i == "function")
        try {
          i();
        } catch (s) {
          St(t, e, s);
        } finally {
          ((t.refCleanup = null),
            (t = t.alternate),
            t != null && (t.refCleanup = null));
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (s) {
          St(t, e, s);
        }
      else n.current = null;
  }
  function Hh(t) {
    var e = t.type,
      n = t.memoizedProps,
      i = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && i.focus();
          break t;
        case "img":
          n.src ? (i.src = n.src) : n.srcSet && (i.srcset = n.srcSet);
      }
    } catch (s) {
      St(t, t.return, s);
    }
  }
  function Fo(t, e, n) {
    try {
      var i = t.stateNode;
      (S1(i, t.type, n, e), (i[re] = e));
    } catch (s) {
      St(t, t.return, s);
    }
  }
  function qh(t) {
    return (
      t.tag === 5 ||
      t.tag === 3 ||
      t.tag === 26 ||
      (t.tag === 27 && Yn(t.type)) ||
      t.tag === 4
    );
  }
  function Wo(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || qh(t.return)) return null;
        t = t.return;
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 18;
      ) {
        if (
          (t.tag === 27 && Yn(t.type)) ||
          t.flags & 2 ||
          t.child === null ||
          t.tag === 4
        )
          continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Po(t, e, n) {
    var i = t.tag;
    if (i === 5 || i === 6)
      ((t = t.stateNode),
        e
          ? (n.nodeType === 9
              ? n.body
              : n.nodeName === "HTML"
                ? n.ownerDocument.body
                : n
            ).insertBefore(t, e)
          : ((e =
              n.nodeType === 9
                ? n.body
                : n.nodeName === "HTML"
                  ? n.ownerDocument.body
                  : n),
            e.appendChild(t),
            (n = n._reactRootContainer),
            n != null || e.onclick !== null || (e.onclick = nn)));
    else if (
      i !== 4 &&
      (i === 27 && Yn(t.type) && ((n = t.stateNode), (e = null)),
      (t = t.child),
      t !== null)
    )
      for (Po(t, e, n), t = t.sibling; t !== null; )
        (Po(t, e, n), (t = t.sibling));
  }
  function bs(t, e, n) {
    var i = t.tag;
    if (i === 5 || i === 6)
      ((t = t.stateNode), e ? n.insertBefore(t, e) : n.appendChild(t));
    else if (
      i !== 4 &&
      (i === 27 && Yn(t.type) && (n = t.stateNode), (t = t.child), t !== null)
    )
      for (bs(t, e, n), t = t.sibling; t !== null; )
        (bs(t, e, n), (t = t.sibling));
  }
  function Yh(t) {
    var e = t.stateNode,
      n = t.memoizedProps;
    try {
      for (var i = t.type, s = e.attributes; s.length; )
        e.removeAttributeNode(s[0]);
      (te(e, i, n), (e[Wt] = t), (e[re] = n));
    } catch (r) {
      St(t, t.return, r);
    }
  }
  var hn = !1,
    Gt = !1,
    $o = !1,
    Gh = typeof WeakSet == "function" ? WeakSet : Set,
    Ft = null;
  function t1(t, e) {
    if (((t = t.containerInfo), (xr = Ys), (t = td(t)), Zu(t))) {
      if ("selectionStart" in t)
        var n = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          n = ((n = t.ownerDocument) && n.defaultView) || window;
          var i = n.getSelection && n.getSelection();
          if (i && i.rangeCount !== 0) {
            n = i.anchorNode;
            var s = i.anchorOffset,
              r = i.focusNode;
            i = i.focusOffset;
            try {
              (n.nodeType, r.nodeType);
            } catch {
              n = null;
              break t;
            }
            var f = 0,
              y = -1,
              S = -1,
              N = 0,
              R = 0,
              V = t,
              j = null;
            e: for (;;) {
              for (
                var w;
                V !== n || (s !== 0 && V.nodeType !== 3) || (y = f + s),
                  V !== r || (i !== 0 && V.nodeType !== 3) || (S = f + i),
                  V.nodeType === 3 && (f += V.nodeValue.length),
                  (w = V.firstChild) !== null;
              )
                ((j = V), (V = w));
              for (;;) {
                if (V === t) break e;
                if (
                  (j === n && ++N === s && (y = f),
                  j === r && ++R === i && (S = f),
                  (w = V.nextSibling) !== null)
                )
                  break;
                ((V = j), (j = V.parentNode));
              }
              V = w;
            }
            n = y === -1 || S === -1 ? null : { start: y, end: S };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (
      br = { focusedElem: t, selectionRange: n }, Ys = !1, Ft = e;
      Ft !== null;
    )
      if (
        ((e = Ft), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null)
      )
        ((t.return = e), (Ft = t));
      else
        for (; Ft !== null; ) {
          switch (((e = Ft), (r = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              if (
                (t & 4) !== 0 &&
                ((t = e.updateQueue),
                (t = t !== null ? t.events : null),
                t !== null)
              )
                for (n = 0; n < t.length; n++)
                  ((s = t[n]), (s.ref.impl = s.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && r !== null) {
                ((t = void 0),
                  (n = e),
                  (s = r.memoizedProps),
                  (r = r.memoizedState),
                  (i = n.stateNode));
                try {
                  var J = ma(n.type, s);
                  ((t = i.getSnapshotBeforeUpdate(J, r)),
                    (i.__reactInternalSnapshotBeforeUpdate = t));
                } catch (et) {
                  St(n, n.return, et);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (
                  ((t = e.stateNode.containerInfo), (n = t.nodeType), n === 9)
                )
                  Ar(t);
                else if (n === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Ar(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(o(163));
          }
          if (((t = e.sibling), t !== null)) {
            ((t.return = e.return), (Ft = t));
            break;
          }
          Ft = e.return;
        }
  }
  function Xh(t, e, n) {
    var i = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        (pn(t, n), i & 4 && ki(5, n));
        break;
      case 1:
        if ((pn(t, n), i & 4))
          if (((t = n.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (f) {
              St(n, n.return, f);
            }
          else {
            var s = ma(n.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(s, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (f) {
              St(n, n.return, f);
            }
          }
        (i & 64 && Bh(n), i & 512 && Ji(n, n.return));
        break;
      case 3:
        if ((pn(t, n), i & 64 && ((t = n.updateQueue), t !== null))) {
          if (((e = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            Nd(t, e);
          } catch (f) {
            St(n, n.return, f);
          }
        }
        break;
      case 27:
        e === null && i & 4 && Yh(n);
      case 26:
      case 5:
        (pn(t, n), e === null && i & 4 && Hh(n), i & 512 && Ji(n, n.return));
        break;
      case 12:
        pn(t, n);
        break;
      case 31:
        (pn(t, n), i & 4 && Kh(t, n));
        break;
      case 13:
        (pn(t, n),
          i & 4 && kh(t, n),
          i & 64 &&
            ((t = n.memoizedState),
            t !== null &&
              ((t = t.dehydrated),
              t !== null && ((n = r1.bind(null, n)), C1(t, n)))));
        break;
      case 22:
        if (((i = n.memoizedState !== null || hn), !i)) {
          ((e = (e !== null && e.memoizedState !== null) || Gt), (s = hn));
          var r = Gt;
          ((hn = i),
            (Gt = e) && !r ? yn(t, n, (n.subtreeFlags & 8772) !== 0) : pn(t, n),
            (hn = s),
            (Gt = r));
        }
        break;
      case 30:
        break;
      default:
        pn(t, n);
    }
  }
  function Zh(t) {
    var e = t.alternate;
    (e !== null && ((t.alternate = null), Zh(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && Nu(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var wt = null,
    fe = !1;
  function mn(t, e, n) {
    for (n = n.child; n !== null; ) (Qh(t, e, n), (n = n.sibling));
  }
  function Qh(t, e, n) {
    if (ge && typeof ge.onCommitFiberUnmount == "function")
      try {
        ge.onCommitFiberUnmount(vi, n);
      } catch {}
    switch (n.tag) {
      case 26:
        (Gt || We(n, e),
          mn(t, e, n),
          n.memoizedState
            ? n.memoizedState.count--
            : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n)));
        break;
      case 27:
        Gt || We(n, e);
        var i = wt,
          s = fe;
        (Yn(n.type) && ((wt = n.stateNode), (fe = !1)),
          mn(t, e, n),
          al(n.stateNode),
          (wt = i),
          (fe = s));
        break;
      case 5:
        Gt || We(n, e);
      case 6:
        if (
          ((i = wt),
          (s = fe),
          (wt = null),
          mn(t, e, n),
          (wt = i),
          (fe = s),
          wt !== null)
        )
          if (fe)
            try {
              (wt.nodeType === 9
                ? wt.body
                : wt.nodeName === "HTML"
                  ? wt.ownerDocument.body
                  : wt
              ).removeChild(n.stateNode);
            } catch (r) {
              St(n, e, r);
            }
          else
            try {
              wt.removeChild(n.stateNode);
            } catch (r) {
              St(n, e, r);
            }
        break;
      case 18:
        wt !== null &&
          (fe
            ? ((t = wt),
              Bm(
                t.nodeType === 9
                  ? t.body
                  : t.nodeName === "HTML"
                    ? t.ownerDocument.body
                    : t,
                n.stateNode,
              ),
              li(t))
            : Bm(wt, n.stateNode));
        break;
      case 4:
        ((i = wt),
          (s = fe),
          (wt = n.stateNode.containerInfo),
          (fe = !0),
          mn(t, e, n),
          (wt = i),
          (fe = s));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (On(2, n, e), Gt || On(4, n, e), mn(t, e, n));
        break;
      case 1:
        (Gt ||
          (We(n, e),
          (i = n.stateNode),
          typeof i.componentWillUnmount == "function" && Lh(n, e, i)),
          mn(t, e, n));
        break;
      case 21:
        mn(t, e, n);
        break;
      case 22:
        ((Gt = (i = Gt) || n.memoizedState !== null), mn(t, e, n), (Gt = i));
        break;
      default:
        mn(t, e, n);
    }
  }
  function Kh(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null))
    ) {
      t = t.dehydrated;
      try {
        li(t);
      } catch (n) {
        St(e, e.return, n);
      }
    }
  }
  function kh(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate),
      t !== null &&
        ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        li(t);
      } catch (n) {
        St(e, e.return, n);
      }
  }
  function e1(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return (e === null && (e = t.stateNode = new Gh()), e);
      case 22:
        return (
          (t = t.stateNode),
          (e = t._retryCache),
          e === null && (e = t._retryCache = new Gh()),
          e
        );
      default:
        throw Error(o(435, t.tag));
    }
  }
  function Ss(t, e) {
    var n = e1(t);
    e.forEach(function (i) {
      if (!n.has(i)) {
        n.add(i);
        var s = c1.bind(null, t, i);
        i.then(s, s);
      }
    });
  }
  function de(t, e) {
    var n = e.deletions;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var s = n[i],
          r = t,
          f = e,
          y = f;
        t: for (; y !== null; ) {
          switch (y.tag) {
            case 27:
              if (Yn(y.type)) {
                ((wt = y.stateNode), (fe = !1));
                break t;
              }
              break;
            case 5:
              ((wt = y.stateNode), (fe = !1));
              break t;
            case 3:
            case 4:
              ((wt = y.stateNode.containerInfo), (fe = !0));
              break t;
          }
          y = y.return;
        }
        if (wt === null) throw Error(o(160));
        (Qh(r, f, s),
          (wt = null),
          (fe = !1),
          (r = s.alternate),
          r !== null && (r.return = null),
          (s.return = null));
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; ) (Jh(e, t), (e = e.sibling));
  }
  var Ge = null;
  function Jh(t, e) {
    var n = t.alternate,
      i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (de(e, t),
          he(t),
          i & 4 && (On(3, t, t.return), ki(3, t), On(5, t, t.return)));
        break;
      case 1:
        (de(e, t),
          he(t),
          i & 512 && (Gt || n === null || We(n, n.return)),
          i & 64 &&
            hn &&
            ((t = t.updateQueue),
            t !== null &&
              ((i = t.callbacks),
              i !== null &&
                ((n = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = n === null ? i : n.concat(i))))));
        break;
      case 26:
        var s = Ge;
        if (
          (de(e, t),
          he(t),
          i & 512 && (Gt || n === null || We(n, n.return)),
          i & 4)
        ) {
          var r = n !== null ? n.memoizedState : null;
          if (((i = t.memoizedState), n === null))
            if (i === null)
              if (t.stateNode === null) {
                t: {
                  ((i = t.type),
                    (n = t.memoizedProps),
                    (s = s.ownerDocument || s));
                  e: switch (i) {
                    case "title":
                      ((r = s.getElementsByTagName("title")[0]),
                        (!r ||
                          r[Si] ||
                          r[Wt] ||
                          r.namespaceURI === "http://www.w3.org/2000/svg" ||
                          r.hasAttribute("itemprop")) &&
                          ((r = s.createElement(i)),
                          s.head.insertBefore(
                            r,
                            s.querySelector("head > title"),
                          )),
                        te(r, i, n),
                        (r[Wt] = t),
                        Jt(r),
                        (i = r));
                      break t;
                    case "link":
                      var f = Jm("link", "href", s).get(i + (n.href || ""));
                      if (f) {
                        for (var y = 0; y < f.length; y++)
                          if (
                            ((r = f[y]),
                            r.getAttribute("href") ===
                              (n.href == null || n.href === ""
                                ? null
                                : n.href) &&
                              r.getAttribute("rel") ===
                                (n.rel == null ? null : n.rel) &&
                              r.getAttribute("title") ===
                                (n.title == null ? null : n.title) &&
                              r.getAttribute("crossorigin") ===
                                (n.crossOrigin == null ? null : n.crossOrigin))
                          ) {
                            f.splice(y, 1);
                            break e;
                          }
                      }
                      ((r = s.createElement(i)),
                        te(r, i, n),
                        s.head.appendChild(r));
                      break;
                    case "meta":
                      if (
                        (f = Jm("meta", "content", s).get(
                          i + (n.content || ""),
                        ))
                      ) {
                        for (y = 0; y < f.length; y++)
                          if (
                            ((r = f[y]),
                            r.getAttribute("content") ===
                              (n.content == null ? null : "" + n.content) &&
                              r.getAttribute("name") ===
                                (n.name == null ? null : n.name) &&
                              r.getAttribute("property") ===
                                (n.property == null ? null : n.property) &&
                              r.getAttribute("http-equiv") ===
                                (n.httpEquiv == null ? null : n.httpEquiv) &&
                              r.getAttribute("charset") ===
                                (n.charSet == null ? null : n.charSet))
                          ) {
                            f.splice(y, 1);
                            break e;
                          }
                      }
                      ((r = s.createElement(i)),
                        te(r, i, n),
                        s.head.appendChild(r));
                      break;
                    default:
                      throw Error(o(468, i));
                  }
                  ((r[Wt] = t), Jt(r), (i = r));
                }
                t.stateNode = i;
              } else Fm(s, t.type, t.stateNode);
            else t.stateNode = km(s, i, t.memoizedProps);
          else
            r !== i
              ? (r === null
                  ? n.stateNode !== null &&
                    ((n = n.stateNode), n.parentNode.removeChild(n))
                  : r.count--,
                i === null
                  ? Fm(s, t.type, t.stateNode)
                  : km(s, i, t.memoizedProps))
              : i === null &&
                t.stateNode !== null &&
                Fo(t, t.memoizedProps, n.memoizedProps);
        }
        break;
      case 27:
        (de(e, t),
          he(t),
          i & 512 && (Gt || n === null || We(n, n.return)),
          n !== null && i & 4 && Fo(t, t.memoizedProps, n.memoizedProps));
        break;
      case 5:
        if (
          (de(e, t),
          he(t),
          i & 512 && (Gt || n === null || We(n, n.return)),
          t.flags & 32)
        ) {
          s = t.stateNode;
          try {
            ja(s, "");
          } catch (J) {
            St(t, t.return, J);
          }
        }
        (i & 4 &&
          t.stateNode != null &&
          ((s = t.memoizedProps), Fo(t, s, n !== null ? n.memoizedProps : s)),
          i & 1024 && ($o = !0));
        break;
      case 6:
        if ((de(e, t), he(t), i & 4)) {
          if (t.stateNode === null) throw Error(o(162));
          ((i = t.memoizedProps), (n = t.stateNode));
          try {
            n.nodeValue = i;
          } catch (J) {
            St(t, t.return, J);
          }
        }
        break;
      case 3:
        if (
          ((Bs = null),
          (s = Ge),
          (Ge = Vs(e.containerInfo)),
          de(e, t),
          (Ge = s),
          he(t),
          i & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            li(e.containerInfo);
          } catch (J) {
            St(t, t.return, J);
          }
        $o && (($o = !1), Fh(t));
        break;
      case 4:
        ((i = Ge),
          (Ge = Vs(t.stateNode.containerInfo)),
          de(e, t),
          he(t),
          (Ge = i));
        break;
      case 12:
        (de(e, t), he(t));
        break;
      case 31:
        (de(e, t),
          he(t),
          i & 4 &&
            ((i = t.updateQueue),
            i !== null && ((t.updateQueue = null), Ss(t, i))));
        break;
      case 13:
        (de(e, t),
          he(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) !=
              (n !== null && n.memoizedState !== null) &&
            (As = ye()),
          i & 4 &&
            ((i = t.updateQueue),
            i !== null && ((t.updateQueue = null), Ss(t, i))));
        break;
      case 22:
        s = t.memoizedState !== null;
        var S = n !== null && n.memoizedState !== null,
          N = hn,
          R = Gt;
        if (
          ((hn = N || s),
          (Gt = R || S),
          de(e, t),
          (Gt = R),
          (hn = N),
          he(t),
          i & 8192)
        )
          t: for (
            e = t.stateNode,
              e._visibility = s ? e._visibility & -2 : e._visibility | 1,
              s && (n === null || S || hn || Gt || pa(t)),
              n = null,
              e = t;
            ;
          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (n === null) {
                S = n = e;
                try {
                  if (((r = S.stateNode), s))
                    ((f = r.style),
                      typeof f.setProperty == "function"
                        ? f.setProperty("display", "none", "important")
                        : (f.display = "none"));
                  else {
                    y = S.stateNode;
                    var V = S.memoizedProps.style,
                      j =
                        V != null && V.hasOwnProperty("display")
                          ? V.display
                          : null;
                    y.style.display =
                      j == null || typeof j == "boolean" ? "" : ("" + j).trim();
                  }
                } catch (J) {
                  St(S, S.return, J);
                }
              }
            } else if (e.tag === 6) {
              if (n === null) {
                S = e;
                try {
                  S.stateNode.nodeValue = s ? "" : S.memoizedProps;
                } catch (J) {
                  St(S, S.return, J);
                }
              }
            } else if (e.tag === 18) {
              if (n === null) {
                S = e;
                try {
                  var w = S.stateNode;
                  s ? Lm(w, !0) : Lm(S.stateNode, !1);
                } catch (J) {
                  St(S, S.return, J);
                }
              }
            } else if (
              ((e.tag !== 22 && e.tag !== 23) ||
                e.memoizedState === null ||
                e === t) &&
              e.child !== null
            ) {
              ((e.child.return = e), (e = e.child));
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              (n === e && (n = null), (e = e.return));
            }
            (n === e && (n = null),
              (e.sibling.return = e.return),
              (e = e.sibling));
          }
        i & 4 &&
          ((i = t.updateQueue),
          i !== null &&
            ((n = i.retryQueue),
            n !== null && ((i.retryQueue = null), Ss(t, n))));
        break;
      case 19:
        (de(e, t),
          he(t),
          i & 4 &&
            ((i = t.updateQueue),
            i !== null && ((t.updateQueue = null), Ss(t, i))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (de(e, t), he(t));
    }
  }
  function he(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, i = t.return; i !== null; ) {
          if (qh(i)) {
            n = i;
            break;
          }
          i = i.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var s = n.stateNode,
              r = Wo(t);
            bs(t, r, s);
            break;
          case 5:
            var f = n.stateNode;
            n.flags & 32 && (ja(f, ""), (n.flags &= -33));
            var y = Wo(t);
            bs(t, y, f);
            break;
          case 3:
          case 4:
            var S = n.stateNode.containerInfo,
              N = Wo(t);
            Po(t, N, S);
            break;
          default:
            throw Error(o(161));
        }
      } catch (R) {
        St(t, t.return, R);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Fh(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        (Fh(e),
          e.tag === 5 && e.flags & 1024 && e.stateNode.reset(),
          (t = t.sibling));
      }
  }
  function pn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; ) (Xh(t, e.alternate, e), (e = e.sibling));
  }
  function pa(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (On(4, e, e.return), pa(e));
          break;
        case 1:
          We(e, e.return);
          var n = e.stateNode;
          (typeof n.componentWillUnmount == "function" && Lh(e, e.return, n),
            pa(e));
          break;
        case 27:
          al(e.stateNode);
        case 26:
        case 5:
          (We(e, e.return), pa(e));
          break;
        case 22:
          e.memoizedState === null && pa(e);
          break;
        case 30:
          pa(e);
          break;
        default:
          pa(e);
      }
      t = t.sibling;
    }
  }
  function yn(t, e, n) {
    for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var i = e.alternate,
        s = t,
        r = e,
        f = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          (yn(s, r, n), ki(4, r));
          break;
        case 1:
          if (
            (yn(s, r, n),
            (i = r),
            (s = i.stateNode),
            typeof s.componentDidMount == "function")
          )
            try {
              s.componentDidMount();
            } catch (N) {
              St(i, i.return, N);
            }
          if (((i = r), (s = i.updateQueue), s !== null)) {
            var y = i.stateNode;
            try {
              var S = s.shared.hiddenCallbacks;
              if (S !== null)
                for (s.shared.hiddenCallbacks = null, s = 0; s < S.length; s++)
                  Dd(S[s], y);
            } catch (N) {
              St(i, i.return, N);
            }
          }
          (n && f & 64 && Bh(r), Ji(r, r.return));
          break;
        case 27:
          Yh(r);
        case 26:
        case 5:
          (yn(s, r, n), n && i === null && f & 4 && Hh(r), Ji(r, r.return));
          break;
        case 12:
          yn(s, r, n);
          break;
        case 31:
          (yn(s, r, n), n && f & 4 && Kh(s, r));
          break;
        case 13:
          (yn(s, r, n), n && f & 4 && kh(s, r));
          break;
        case 22:
          (r.memoizedState === null && yn(s, r, n), Ji(r, r.return));
          break;
        case 30:
          break;
        default:
          yn(s, r, n);
      }
      e = e.sibling;
    }
  }
  function Io(t, e) {
    var n = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (n = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (t = e.memoizedState.cachePool.pool),
      t !== n && (t != null && t.refCount++, n != null && Oi(n)));
  }
  function tr(t, e) {
    ((t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && Oi(t)));
  }
  function Xe(t, e, n, i) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) (Wh(t, e, n, i), (e = e.sibling));
  }
  function Wh(t, e, n, i) {
    var s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Xe(t, e, n, i), s & 2048 && ki(9, e));
        break;
      case 1:
        Xe(t, e, n, i);
        break;
      case 3:
        (Xe(t, e, n, i),
          s & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && Oi(t))));
        break;
      case 12:
        if (s & 2048) {
          (Xe(t, e, n, i), (t = e.stateNode));
          try {
            var r = e.memoizedProps,
              f = r.id,
              y = r.onPostCommit;
            typeof y == "function" &&
              y(
                f,
                e.alternate === null ? "mount" : "update",
                t.passiveEffectDuration,
                -0,
              );
          } catch (S) {
            St(e, e.return, S);
          }
        } else Xe(t, e, n, i);
        break;
      case 31:
        Xe(t, e, n, i);
        break;
      case 13:
        Xe(t, e, n, i);
        break;
      case 23:
        break;
      case 22:
        ((r = e.stateNode),
          (f = e.alternate),
          e.memoizedState !== null
            ? r._visibility & 2
              ? Xe(t, e, n, i)
              : Fi(t, e)
            : r._visibility & 2
              ? Xe(t, e, n, i)
              : ((r._visibility |= 2),
                Ja(t, e, n, i, (e.subtreeFlags & 10256) !== 0 || !1)),
          s & 2048 && Io(f, e));
        break;
      case 24:
        (Xe(t, e, n, i), s & 2048 && tr(e.alternate, e));
        break;
      default:
        Xe(t, e, n, i);
    }
  }
  function Ja(t, e, n, i, s) {
    for (
      s = s && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child;
      e !== null;
    ) {
      var r = t,
        f = e,
        y = n,
        S = i,
        N = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          (Ja(r, f, y, S, s), ki(8, f));
          break;
        case 23:
          break;
        case 22:
          var R = f.stateNode;
          (f.memoizedState !== null
            ? R._visibility & 2
              ? Ja(r, f, y, S, s)
              : Fi(r, f)
            : ((R._visibility |= 2), Ja(r, f, y, S, s)),
            s && N & 2048 && Io(f.alternate, f));
          break;
        case 24:
          (Ja(r, f, y, S, s), s && N & 2048 && tr(f.alternate, f));
          break;
        default:
          Ja(r, f, y, S, s);
      }
      e = e.sibling;
    }
  }
  function Fi(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t,
          i = e,
          s = i.flags;
        switch (i.tag) {
          case 22:
            (Fi(n, i), s & 2048 && Io(i.alternate, i));
            break;
          case 24:
            (Fi(n, i), s & 2048 && tr(i.alternate, i));
            break;
          default:
            Fi(n, i);
        }
        e = e.sibling;
      }
  }
  var Wi = 8192;
  function Fa(t, e, n) {
    if (t.subtreeFlags & Wi)
      for (t = t.child; t !== null; ) (Ph(t, e, n), (t = t.sibling));
  }
  function Ph(t, e, n) {
    switch (t.tag) {
      case 26:
        (Fa(t, e, n),
          t.flags & Wi &&
            t.memoizedState !== null &&
            Y1(n, Ge, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        Fa(t, e, n);
        break;
      case 3:
      case 4:
        var i = Ge;
        ((Ge = Vs(t.stateNode.containerInfo)), Fa(t, e, n), (Ge = i));
        break;
      case 22:
        t.memoizedState === null &&
          ((i = t.alternate),
          i !== null && i.memoizedState !== null
            ? ((i = Wi), (Wi = 16777216), Fa(t, e, n), (Wi = i))
            : Fa(t, e, n));
        break;
      default:
        Fa(t, e, n);
    }
  }
  function $h(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do ((e = t.sibling), (t.sibling = null), (t = e));
      while (t !== null);
    }
  }
  function Pi(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          ((Ft = i), tm(i, t));
        }
      $h(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) (Ih(t), (t = t.sibling));
  }
  function Ih(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Pi(t), t.flags & 2048 && On(9, t, t.return));
        break;
      case 3:
        Pi(t);
        break;
      case 12:
        Pi(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null &&
        e._visibility & 2 &&
        (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), Ts(t))
          : Pi(t);
        break;
      default:
        Pi(t);
    }
  }
  function Ts(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          ((Ft = i), tm(i, t));
        }
      $h(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          (On(8, e, e.return), Ts(e));
          break;
        case 22:
          ((n = e.stateNode),
            n._visibility & 2 && ((n._visibility &= -3), Ts(e)));
          break;
        default:
          Ts(e);
      }
      t = t.sibling;
    }
  }
  function tm(t, e) {
    for (; Ft !== null; ) {
      var n = Ft;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          On(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var i = n.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          Oi(n.memoizedState.cache);
      }
      if (((i = n.child), i !== null)) ((i.return = n), (Ft = i));
      else
        t: for (n = t; Ft !== null; ) {
          i = Ft;
          var s = i.sibling,
            r = i.return;
          if ((Zh(i), i === n)) {
            Ft = null;
            break t;
          }
          if (s !== null) {
            ((s.return = r), (Ft = s));
            break t;
          }
          Ft = r;
        }
    }
  }
  var n1 = {
      getCacheForType: function (t) {
        var e = $t(Ht),
          n = e.data.get(t);
        return (n === void 0 && ((n = t()), e.data.set(t, n)), n);
      },
      cacheSignal: function () {
        return $t(Ht).controller.signal;
      },
    },
    a1 = typeof WeakMap == "function" ? WeakMap : Map,
    vt = 0,
    Mt = null,
    ct = null,
    dt = 0,
    bt = 0,
    Ae = null,
    Vn = !1,
    Wa = !1,
    er = !1,
    gn = 0,
    Ot = 0,
    Un = 0,
    ya = 0,
    nr = 0,
    Ee = 0,
    Pa = 0,
    $i = null,
    me = null,
    ar = !1,
    As = 0,
    em = 0,
    Es = 1 / 0,
    Ms = null,
    Bn = null,
    Qt = 0,
    Ln = null,
    $a = null,
    vn = 0,
    ir = 0,
    lr = null,
    nm = null,
    Ii = 0,
    sr = null;
  function Me() {
    return (vt & 2) !== 0 && dt !== 0 ? dt & -dt : _.T !== null ? dr() : vf();
  }
  function am() {
    if (Ee === 0)
      if ((dt & 536870912) === 0 || pt) {
        var t = _l;
        ((_l <<= 1), (_l & 3932160) === 0 && (_l = 262144), (Ee = t));
      } else Ee = 536870912;
    return ((t = Se.current), t !== null && (t.flags |= 32), Ee);
  }
  function pe(t, e, n) {
    (((t === Mt && (bt === 2 || bt === 9)) || t.cancelPendingCommit !== null) &&
      (Ia(t, 0), Hn(t, dt, Ee, !1)),
      bi(t, n),
      ((vt & 2) === 0 || t !== Mt) &&
        (t === Mt &&
          ((vt & 2) === 0 && (ya |= n), Ot === 4 && Hn(t, dt, Ee, !1)),
        Pe(t)));
  }
  function im(t, e, n) {
    if ((vt & 6) !== 0) throw Error(o(327));
    var i = (!n && (e & 127) === 0 && (e & t.expiredLanes) === 0) || xi(t, e),
      s = i ? s1(t, e) : or(t, e, !0),
      r = i;
    do {
      if (s === 0) {
        Wa && !i && Hn(t, e, 0, !1);
        break;
      } else {
        if (((n = t.current.alternate), r && !i1(n))) {
          ((s = or(t, e, !1)), (r = !1));
          continue;
        }
        if (s === 2) {
          if (((r = e), t.errorRecoveryDisabledLanes & r)) var f = 0;
          else
            ((f = t.pendingLanes & -536870913),
              (f = f !== 0 ? f : f & 536870912 ? 536870912 : 0));
          if (f !== 0) {
            e = f;
            t: {
              var y = t;
              s = $i;
              var S = y.current.memoizedState.isDehydrated;
              if ((S && (Ia(y, f).flags |= 256), (f = or(y, f, !1)), f !== 2)) {
                if (er && !S) {
                  ((y.errorRecoveryDisabledLanes |= r), (ya |= r), (s = 4));
                  break t;
                }
                ((r = me),
                  (me = s),
                  r !== null &&
                    (me === null ? (me = r) : me.push.apply(me, r)));
              }
              s = f;
            }
            if (((r = !1), s !== 2)) continue;
          }
        }
        if (s === 1) {
          (Ia(t, 0), Hn(t, e, 0, !0));
          break;
        }
        t: {
          switch (((i = t), (r = s), r)) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              Hn(i, e, Ee, !Vn);
              break t;
            case 2:
              me = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((e & 62914560) === e && ((s = As + 300 - ye()), 10 < s)) {
            if ((Hn(i, e, Ee, !Vn), Vl(i, 0, !0) !== 0)) break t;
            ((vn = e),
              (i.timeoutHandle = Vm(
                lm.bind(
                  null,
                  i,
                  n,
                  me,
                  Ms,
                  ar,
                  e,
                  Ee,
                  ya,
                  Pa,
                  Vn,
                  r,
                  "Throttled",
                  -0,
                  0,
                ),
                s,
              )));
            break t;
          }
          lm(i, n, me, Ms, ar, e, Ee, ya, Pa, Vn, r, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Pe(t);
  }
  function lm(t, e, n, i, s, r, f, y, S, N, R, V, j, w) {
    if (
      ((t.timeoutHandle = -1),
      (V = e.subtreeFlags),
      V & 8192 || (V & 16785408) === 16785408)
    ) {
      ((V = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: nn,
      }),
        Ph(e, r, V));
      var J =
        (r & 62914560) === r ? As - ye() : (r & 4194048) === r ? em - ye() : 0;
      if (((J = G1(V, J)), J !== null)) {
        ((vn = r),
          (t.cancelPendingCommit = J(
            hm.bind(null, t, e, r, n, i, s, f, y, S, R, V, null, j, w),
          )),
          Hn(t, r, f, !N));
        return;
      }
    }
    hm(t, e, r, n, i, s, f, y, S);
  }
  function i1(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if (
        (n === 0 || n === 11 || n === 15) &&
        e.flags & 16384 &&
        ((n = e.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var i = 0; i < n.length; i++) {
          var s = n[i],
            r = s.getSnapshot;
          s = s.value;
          try {
            if (!xe(r(), s)) return !1;
          } catch {
            return !1;
          }
        }
      if (((n = e.child), e.subtreeFlags & 16384 && n !== null))
        ((n.return = e), (e = n));
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    }
    return !0;
  }
  function Hn(t, e, n, i) {
    ((e &= ~nr),
      (e &= ~ya),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      i && (t.warmLanes |= e),
      (i = t.expirationTimes));
    for (var s = e; 0 < s; ) {
      var r = 31 - ve(s),
        f = 1 << r;
      ((i[r] = -1), (s &= ~f));
    }
    n !== 0 && pf(t, n, e);
  }
  function Ds() {
    return (vt & 6) === 0 ? (tl(0), !1) : !0;
  }
  function ur() {
    if (ct !== null) {
      if (bt === 0) var t = ct.return;
      else ((t = ct), (un = ua = null), Ao(t), (Xa = null), (Ui = 0), (t = ct));
      for (; t !== null; ) (Uh(t.alternate, t), (t = t.return));
      ct = null;
    }
  }
  function Ia(t, e) {
    var n = t.timeoutHandle;
    (n !== -1 && ((t.timeoutHandle = -1), E1(n)),
      (n = t.cancelPendingCommit),
      n !== null && ((t.cancelPendingCommit = null), n()),
      (vn = 0),
      ur(),
      (Mt = t),
      (ct = n = ln(t.current, null)),
      (dt = e),
      (bt = 0),
      (Ae = null),
      (Vn = !1),
      (Wa = xi(t, e)),
      (er = !1),
      (Pa = Ee = nr = ya = Un = Ot = 0),
      (me = $i = null),
      (ar = !1),
      (e & 8) !== 0 && (e |= e & 32));
    var i = t.entangledLanes;
    if (i !== 0)
      for (t = t.entanglements, i &= e; 0 < i; ) {
        var s = 31 - ve(i),
          r = 1 << s;
        ((e |= t[s]), (i &= ~r));
      }
    return ((gn = e), kl(), n);
  }
  function sm(t, e) {
    ((st = null),
      (_.H = Zi),
      e === Ga || e === es
        ? ((e = Td()), (bt = 3))
        : e === co
          ? ((e = Td()), (bt = 4))
          : (bt =
              e === Ho
                ? 8
                : e !== null &&
                    typeof e == "object" &&
                    typeof e.then == "function"
                  ? 6
                  : 1),
      (Ae = e),
      ct === null && ((Ot = 1), ps(t, ze(e, t.current))));
  }
  function um() {
    var t = Se.current;
    return t === null
      ? !0
      : (dt & 4194048) === dt
        ? Ve === null
        : (dt & 62914560) === dt || (dt & 536870912) !== 0
          ? t === Ve
          : !1;
  }
  function om() {
    var t = _.H;
    return ((_.H = Zi), t === null ? Zi : t);
  }
  function rm() {
    var t = _.A;
    return ((_.A = n1), t);
  }
  function Ns() {
    ((Ot = 4),
      Vn || ((dt & 4194048) !== dt && Se.current !== null) || (Wa = !0),
      ((Un & 134217727) === 0 && (ya & 134217727) === 0) ||
        Mt === null ||
        Hn(Mt, dt, Ee, !1));
  }
  function or(t, e, n) {
    var i = vt;
    vt |= 2;
    var s = om(),
      r = rm();
    ((Mt !== t || dt !== e) && ((Ms = null), Ia(t, e)), (e = !1));
    var f = Ot;
    t: do
      try {
        if (bt !== 0 && ct !== null) {
          var y = ct,
            S = Ae;
          switch (bt) {
            case 8:
              (ur(), (f = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Se.current === null && (e = !0);
              var N = bt;
              if (((bt = 0), (Ae = null), ti(t, y, S, N), n && Wa)) {
                f = 0;
                break t;
              }
              break;
            default:
              ((N = bt), (bt = 0), (Ae = null), ti(t, y, S, N));
          }
        }
        (l1(), (f = Ot));
        break;
      } catch (R) {
        sm(t, R);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (un = ua = null),
      (vt = i),
      (_.H = s),
      (_.A = r),
      ct === null && ((Mt = null), (dt = 0), kl()),
      f
    );
  }
  function l1() {
    for (; ct !== null; ) cm(ct);
  }
  function s1(t, e) {
    var n = vt;
    vt |= 2;
    var i = om(),
      s = rm();
    Mt !== t || dt !== e
      ? ((Ms = null), (Es = ye() + 500), Ia(t, e))
      : (Wa = xi(t, e));
    t: do
      try {
        if (bt !== 0 && ct !== null) {
          e = ct;
          var r = Ae;
          e: switch (bt) {
            case 1:
              ((bt = 0), (Ae = null), ti(t, e, r, 1));
              break;
            case 2:
            case 9:
              if (bd(r)) {
                ((bt = 0), (Ae = null), fm(e));
                break;
              }
              ((e = function () {
                ((bt !== 2 && bt !== 9) || Mt !== t || (bt = 7), Pe(t));
              }),
                r.then(e, e));
              break t;
            case 3:
              bt = 7;
              break t;
            case 4:
              bt = 5;
              break t;
            case 7:
              bd(r)
                ? ((bt = 0), (Ae = null), fm(e))
                : ((bt = 0), (Ae = null), ti(t, e, r, 7));
              break;
            case 5:
              var f = null;
              switch (ct.tag) {
                case 26:
                  f = ct.memoizedState;
                case 5:
                case 27:
                  var y = ct;
                  if (f ? Wm(f) : y.stateNode.complete) {
                    ((bt = 0), (Ae = null));
                    var S = y.sibling;
                    if (S !== null) ct = S;
                    else {
                      var N = y.return;
                      N !== null ? ((ct = N), js(N)) : (ct = null);
                    }
                    break e;
                  }
              }
              ((bt = 0), (Ae = null), ti(t, e, r, 5));
              break;
            case 6:
              ((bt = 0), (Ae = null), ti(t, e, r, 6));
              break;
            case 8:
              (ur(), (Ot = 6));
              break t;
            default:
              throw Error(o(462));
          }
        }
        u1();
        break;
      } catch (R) {
        sm(t, R);
      }
    while (!0);
    return (
      (un = ua = null),
      (_.H = i),
      (_.A = s),
      (vt = n),
      ct !== null ? 0 : ((Mt = null), (dt = 0), kl(), Ot)
    );
  }
  function u1() {
    for (; ct !== null && !wg(); ) cm(ct);
  }
  function cm(t) {
    var e = Oh(t.alternate, t, gn);
    ((t.memoizedProps = t.pendingProps), e === null ? js(t) : (ct = e));
  }
  function fm(t) {
    var e = t,
      n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = jh(n, e, e.pendingProps, e.type, void 0, dt);
        break;
      case 11:
        e = jh(n, e, e.pendingProps, e.type.render, e.ref, dt);
        break;
      case 5:
        Ao(e);
      default:
        (Uh(n, e), (e = ct = rd(e, gn)), (e = Oh(n, e, gn)));
    }
    ((t.memoizedProps = t.pendingProps), e === null ? js(t) : (ct = e));
  }
  function ti(t, e, n, i) {
    ((un = ua = null), Ao(e), (Xa = null), (Ui = 0));
    var s = e.return;
    try {
      if (Fv(t, s, e, n, dt)) {
        ((Ot = 1), ps(t, ze(n, t.current)), (ct = null));
        return;
      }
    } catch (r) {
      if (s !== null) throw ((ct = s), r);
      ((Ot = 1), ps(t, ze(n, t.current)), (ct = null));
      return;
    }
    e.flags & 32768
      ? (pt || i === 1
          ? (t = !0)
          : Wa || (dt & 536870912) !== 0
            ? (t = !1)
            : ((Vn = t = !0),
              (i === 2 || i === 9 || i === 3 || i === 6) &&
                ((i = Se.current),
                i !== null && i.tag === 13 && (i.flags |= 16384))),
        dm(e, t))
      : js(e);
  }
  function js(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        dm(e, Vn);
        return;
      }
      t = e.return;
      var n = $v(e.alternate, e, gn);
      if (n !== null) {
        ct = n;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        ct = e;
        return;
      }
      ct = e = t;
    } while (e !== null);
    Ot === 0 && (Ot = 5);
  }
  function dm(t, e) {
    do {
      var n = Iv(t.alternate, t);
      if (n !== null) {
        ((n.flags &= 32767), (ct = n));
        return;
      }
      if (
        ((n = t.return),
        n !== null &&
          ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        ct = t;
        return;
      }
      ct = t = n;
    } while (t !== null);
    ((Ot = 6), (ct = null));
  }
  function hm(t, e, n, i, s, r, f, y, S) {
    t.cancelPendingCommit = null;
    do Cs();
    while (Qt !== 0);
    if ((vt & 6) !== 0) throw Error(o(327));
    if (e !== null) {
      if (e === t.current) throw Error(o(177));
      if (
        ((r = e.lanes | e.childLanes),
        (r |= Fu),
        qg(t, n, r, f, y, S),
        t === Mt && ((ct = Mt = null), (dt = 0)),
        ($a = e),
        (Ln = t),
        (vn = n),
        (ir = r),
        (lr = s),
        (nm = i),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            f1(zl, function () {
              return (vm(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (i = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || i)
      ) {
        ((i = _.T), (_.T = null), (s = X.p), (X.p = 2), (f = vt), (vt |= 4));
        try {
          t1(t, e, n);
        } finally {
          ((vt = f), (X.p = s), (_.T = i));
        }
      }
      ((Qt = 1), mm(), pm(), ym());
    }
  }
  function mm() {
    if (Qt === 1) {
      Qt = 0;
      var t = Ln,
        e = $a,
        n = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || n) {
        ((n = _.T), (_.T = null));
        var i = X.p;
        X.p = 2;
        var s = vt;
        vt |= 4;
        try {
          Jh(e, t);
          var r = br,
            f = td(t.containerInfo),
            y = r.focusedElem,
            S = r.selectionRange;
          if (
            f !== y &&
            y &&
            y.ownerDocument &&
            If(y.ownerDocument.documentElement, y)
          ) {
            if (S !== null && Zu(y)) {
              var N = S.start,
                R = S.end;
              if ((R === void 0 && (R = N), "selectionStart" in y))
                ((y.selectionStart = N),
                  (y.selectionEnd = Math.min(R, y.value.length)));
              else {
                var V = y.ownerDocument || document,
                  j = (V && V.defaultView) || window;
                if (j.getSelection) {
                  var w = j.getSelection(),
                    J = y.textContent.length,
                    et = Math.min(S.start, J),
                    Et = S.end === void 0 ? et : Math.min(S.end, J);
                  !w.extend && et > Et && ((f = Et), (Et = et), (et = f));
                  var M = $f(y, et),
                    A = $f(y, Et);
                  if (
                    M &&
                    A &&
                    (w.rangeCount !== 1 ||
                      w.anchorNode !== M.node ||
                      w.anchorOffset !== M.offset ||
                      w.focusNode !== A.node ||
                      w.focusOffset !== A.offset)
                  ) {
                    var D = V.createRange();
                    (D.setStart(M.node, M.offset),
                      w.removeAllRanges(),
                      et > Et
                        ? (w.addRange(D), w.extend(A.node, A.offset))
                        : (D.setEnd(A.node, A.offset), w.addRange(D)));
                  }
                }
              }
            }
            for (V = [], w = y; (w = w.parentNode); )
              w.nodeType === 1 &&
                V.push({ element: w, left: w.scrollLeft, top: w.scrollTop });
            for (
              typeof y.focus == "function" && y.focus(), y = 0;
              y < V.length;
              y++
            ) {
              var O = V[y];
              ((O.element.scrollLeft = O.left), (O.element.scrollTop = O.top));
            }
          }
          ((Ys = !!xr), (br = xr = null));
        } finally {
          ((vt = s), (X.p = i), (_.T = n));
        }
      }
      ((t.current = e), (Qt = 2));
    }
  }
  function pm() {
    if (Qt === 2) {
      Qt = 0;
      var t = Ln,
        e = $a,
        n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        ((n = _.T), (_.T = null));
        var i = X.p;
        X.p = 2;
        var s = vt;
        vt |= 4;
        try {
          Xh(t, e.alternate, e);
        } finally {
          ((vt = s), (X.p = i), (_.T = n));
        }
      }
      Qt = 3;
    }
  }
  function ym() {
    if (Qt === 4 || Qt === 3) {
      ((Qt = 0), zg());
      var t = Ln,
        e = $a,
        n = vn,
        i = nm;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (Qt = 5)
        : ((Qt = 0), ($a = Ln = null), gm(t, t.pendingLanes));
      var s = t.pendingLanes;
      if (
        (s === 0 && (Bn = null),
        Mu(n),
        (e = e.stateNode),
        ge && typeof ge.onCommitFiberRoot == "function")
      )
        try {
          ge.onCommitFiberRoot(vi, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (i !== null) {
        ((e = _.T), (s = X.p), (X.p = 2), (_.T = null));
        try {
          for (var r = t.onRecoverableError, f = 0; f < i.length; f++) {
            var y = i[f];
            r(y.value, { componentStack: y.stack });
          }
        } finally {
          ((_.T = e), (X.p = s));
        }
      }
      ((vn & 3) !== 0 && Cs(),
        Pe(t),
        (s = t.pendingLanes),
        (n & 261930) !== 0 && (s & 42) !== 0
          ? t === sr
            ? Ii++
            : ((Ii = 0), (sr = t))
          : (Ii = 0),
        tl(0));
    }
  }
  function gm(t, e) {
    (t.pooledCacheLanes &= e) === 0 &&
      ((e = t.pooledCache), e != null && ((t.pooledCache = null), Oi(e)));
  }
  function Cs() {
    return (mm(), pm(), ym(), vm());
  }
  function vm() {
    if (Qt !== 5) return !1;
    var t = Ln,
      e = ir;
    ir = 0;
    var n = Mu(vn),
      i = _.T,
      s = X.p;
    try {
      ((X.p = 32 > n ? 32 : n), (_.T = null), (n = lr), (lr = null));
      var r = Ln,
        f = vn;
      if (((Qt = 0), ($a = Ln = null), (vn = 0), (vt & 6) !== 0))
        throw Error(o(331));
      var y = vt;
      if (
        ((vt |= 4),
        Ih(r.current),
        Wh(r, r.current, f, n),
        (vt = y),
        tl(0, !1),
        ge && typeof ge.onPostCommitFiberRoot == "function")
      )
        try {
          ge.onPostCommitFiberRoot(vi, r);
        } catch {}
      return !0;
    } finally {
      ((X.p = s), (_.T = i), gm(t, e));
    }
  }
  function xm(t, e, n) {
    ((e = ze(n, e)),
      (e = Lo(t.stateNode, e, 2)),
      (t = zn(t, e, 2)),
      t !== null && (bi(t, 2), Pe(t)));
  }
  function St(t, e, n) {
    if (t.tag === 3) xm(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          xm(e, t, n);
          break;
        } else if (e.tag === 1) {
          var i = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == "function" ||
            (typeof i.componentDidCatch == "function" &&
              (Bn === null || !Bn.has(i)))
          ) {
            ((t = ze(n, t)),
              (n = bh(2)),
              (i = zn(e, n, 2)),
              i !== null && (Sh(n, i, e, t), bi(i, 2), Pe(i)));
            break;
          }
        }
        e = e.return;
      }
  }
  function rr(t, e, n) {
    var i = t.pingCache;
    if (i === null) {
      i = t.pingCache = new a1();
      var s = new Set();
      i.set(e, s);
    } else ((s = i.get(e)), s === void 0 && ((s = new Set()), i.set(e, s)));
    s.has(n) ||
      ((er = !0), s.add(n), (t = o1.bind(null, t, e, n)), e.then(t, t));
  }
  function o1(t, e, n) {
    var i = t.pingCache;
    (i !== null && i.delete(e),
      (t.pingedLanes |= t.suspendedLanes & n),
      (t.warmLanes &= ~n),
      Mt === t &&
        (dt & n) === n &&
        (Ot === 4 || (Ot === 3 && (dt & 62914560) === dt && 300 > ye() - As)
          ? (vt & 2) === 0 && Ia(t, 0)
          : (nr |= n),
        Pa === dt && (Pa = 0)),
      Pe(t));
  }
  function bm(t, e) {
    (e === 0 && (e = mf()), (t = ia(t, e)), t !== null && (bi(t, e), Pe(t)));
  }
  function r1(t) {
    var e = t.memoizedState,
      n = 0;
    (e !== null && (n = e.retryLane), bm(t, n));
  }
  function c1(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var i = t.stateNode,
          s = t.memoizedState;
        s !== null && (n = s.retryLane);
        break;
      case 19:
        i = t.stateNode;
        break;
      case 22:
        i = t.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    (i !== null && i.delete(e), bm(t, n));
  }
  function f1(t, e) {
    return Su(t, e);
  }
  var ws = null,
    ei = null,
    cr = !1,
    zs = !1,
    fr = !1,
    qn = 0;
  function Pe(t) {
    (t !== ei &&
      t.next === null &&
      (ei === null ? (ws = ei = t) : (ei = ei.next = t)),
      (zs = !0),
      cr || ((cr = !0), h1()));
  }
  function tl(t, e) {
    if (!fr && zs) {
      fr = !0;
      do
        for (var n = !1, i = ws; i !== null; ) {
          if (t !== 0) {
            var s = i.pendingLanes;
            if (s === 0) var r = 0;
            else {
              var f = i.suspendedLanes,
                y = i.pingedLanes;
              ((r = (1 << (31 - ve(42 | t) + 1)) - 1),
                (r &= s & ~(f & ~y)),
                (r = r & 201326741 ? (r & 201326741) | 1 : r ? r | 2 : 0));
            }
            r !== 0 && ((n = !0), Em(i, r));
          } else
            ((r = dt),
              (r = Vl(
                i,
                i === Mt ? r : 0,
                i.cancelPendingCommit !== null || i.timeoutHandle !== -1,
              )),
              (r & 3) === 0 || xi(i, r) || ((n = !0), Em(i, r)));
          i = i.next;
        }
      while (n);
      fr = !1;
    }
  }
  function d1() {
    Sm();
  }
  function Sm() {
    zs = cr = !1;
    var t = 0;
    qn !== 0 && A1() && (t = qn);
    for (var e = ye(), n = null, i = ws; i !== null; ) {
      var s = i.next,
        r = Tm(i, e);
      (r === 0
        ? ((i.next = null),
          n === null ? (ws = s) : (n.next = s),
          s === null && (ei = n))
        : ((n = i), (t !== 0 || (r & 3) !== 0) && (zs = !0)),
        (i = s));
    }
    ((Qt !== 0 && Qt !== 5) || tl(t), qn !== 0 && (qn = 0));
  }
  function Tm(t, e) {
    for (
      var n = t.suspendedLanes,
        i = t.pingedLanes,
        s = t.expirationTimes,
        r = t.pendingLanes & -62914561;
      0 < r;
    ) {
      var f = 31 - ve(r),
        y = 1 << f,
        S = s[f];
      (S === -1
        ? ((y & n) === 0 || (y & i) !== 0) && (s[f] = Hg(y, e))
        : S <= e && (t.expiredLanes |= y),
        (r &= ~y));
    }
    if (
      ((e = Mt),
      (n = dt),
      (n = Vl(
        t,
        t === e ? n : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
      )),
      (i = t.callbackNode),
      n === 0 ||
        (t === e && (bt === 2 || bt === 9)) ||
        t.cancelPendingCommit !== null)
    )
      return (
        i !== null && i !== null && Tu(i),
        (t.callbackNode = null),
        (t.callbackPriority = 0)
      );
    if ((n & 3) === 0 || xi(t, n)) {
      if (((e = n & -n), e === t.callbackPriority)) return e;
      switch ((i !== null && Tu(i), Mu(n))) {
        case 2:
        case 8:
          n = df;
          break;
        case 32:
          n = zl;
          break;
        case 268435456:
          n = hf;
          break;
        default:
          n = zl;
      }
      return (
        (i = Am.bind(null, t)),
        (n = Su(n, i)),
        (t.callbackPriority = e),
        (t.callbackNode = n),
        e
      );
    }
    return (
      i !== null && i !== null && Tu(i),
      (t.callbackPriority = 2),
      (t.callbackNode = null),
      2
    );
  }
  function Am(t, e) {
    if (Qt !== 0 && Qt !== 5)
      return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var n = t.callbackNode;
    if (Cs() && t.callbackNode !== n) return null;
    var i = dt;
    return (
      (i = Vl(
        t,
        t === Mt ? i : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
      )),
      i === 0
        ? null
        : (im(t, i, e),
          Tm(t, ye()),
          t.callbackNode != null && t.callbackNode === n
            ? Am.bind(null, t)
            : null)
    );
  }
  function Em(t, e) {
    if (Cs()) return null;
    im(t, e, !0);
  }
  function h1() {
    M1(function () {
      (vt & 6) !== 0 ? Su(ff, d1) : Sm();
    });
  }
  function dr() {
    if (qn === 0) {
      var t = qa;
      (t === 0 && ((t = Rl), (Rl <<= 1), (Rl & 261888) === 0 && (Rl = 256)),
        (qn = t));
    }
    return qn;
  }
  function Mm(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean"
      ? null
      : typeof t == "function"
        ? t
        : Hl("" + t);
  }
  function Dm(t, e) {
    var n = e.ownerDocument.createElement("input");
    return (
      (n.name = e.name),
      (n.value = e.value),
      t.id && n.setAttribute("form", t.id),
      e.parentNode.insertBefore(n, e),
      (t = new FormData(t)),
      n.parentNode.removeChild(n),
      t
    );
  }
  function m1(t, e, n, i, s) {
    if (e === "submit" && n && n.stateNode === s) {
      var r = Mm((s[re] || null).action),
        f = i.submitter;
      f &&
        ((e = (e = f[re] || null)
          ? Mm(e.formAction)
          : f.getAttribute("formAction")),
        e !== null && ((r = e), (f = null)));
      var y = new Xl("action", "action", null, i, s);
      t.push({
        event: y,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (i.defaultPrevented) {
                if (qn !== 0) {
                  var S = f ? Dm(s, f) : new FormData(s);
                  Ro(
                    n,
                    { pending: !0, data: S, method: s.method, action: r },
                    null,
                    S,
                  );
                }
              } else
                typeof r == "function" &&
                  (y.preventDefault(),
                  (S = f ? Dm(s, f) : new FormData(s)),
                  Ro(
                    n,
                    { pending: !0, data: S, method: s.method, action: r },
                    r,
                    S,
                  ));
            },
            currentTarget: s,
          },
        ],
      });
    }
  }
  for (var hr = 0; hr < Ju.length; hr++) {
    var mr = Ju[hr],
      p1 = mr.toLowerCase(),
      y1 = mr[0].toUpperCase() + mr.slice(1);
    Ye(p1, "on" + y1);
  }
  (Ye(ad, "onAnimationEnd"),
    Ye(id, "onAnimationIteration"),
    Ye(ld, "onAnimationStart"),
    Ye("dblclick", "onDoubleClick"),
    Ye("focusin", "onFocus"),
    Ye("focusout", "onBlur"),
    Ye(Rv, "onTransitionRun"),
    Ye(_v, "onTransitionStart"),
    Ye(Ov, "onTransitionCancel"),
    Ye(sd, "onTransitionEnd"),
    Da("onMouseEnter", ["mouseout", "mouseover"]),
    Da("onMouseLeave", ["mouseout", "mouseover"]),
    Da("onPointerEnter", ["pointerout", "pointerover"]),
    Da("onPointerLeave", ["pointerout", "pointerover"]),
    ta(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    ta(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    ta("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    ta(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    ta(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    ta(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var el =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    g1 = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(el),
    );
  function Nm(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var i = t[n],
        s = i.event;
      i = i.listeners;
      t: {
        var r = void 0;
        if (e)
          for (var f = i.length - 1; 0 <= f; f--) {
            var y = i[f],
              S = y.instance,
              N = y.currentTarget;
            if (((y = y.listener), S !== r && s.isPropagationStopped()))
              break t;
            ((r = y), (s.currentTarget = N));
            try {
              r(s);
            } catch (R) {
              Kl(R);
            }
            ((s.currentTarget = null), (r = S));
          }
        else
          for (f = 0; f < i.length; f++) {
            if (
              ((y = i[f]),
              (S = y.instance),
              (N = y.currentTarget),
              (y = y.listener),
              S !== r && s.isPropagationStopped())
            )
              break t;
            ((r = y), (s.currentTarget = N));
            try {
              r(s);
            } catch (R) {
              Kl(R);
            }
            ((s.currentTarget = null), (r = S));
          }
      }
    }
  }
  function ft(t, e) {
    var n = e[Du];
    n === void 0 && (n = e[Du] = new Set());
    var i = t + "__bubble";
    n.has(i) || (jm(e, t, 2, !1), n.add(i));
  }
  function pr(t, e, n) {
    var i = 0;
    (e && (i |= 4), jm(n, t, i, e));
  }
  var Rs = "_reactListening" + Math.random().toString(36).slice(2);
  function yr(t) {
    if (!t[Rs]) {
      ((t[Rs] = !0),
        Sf.forEach(function (n) {
          n !== "selectionchange" && (g1.has(n) || pr(n, !1, t), pr(n, !0, t));
        }));
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Rs] || ((e[Rs] = !0), pr("selectionchange", !1, e));
    }
  }
  function jm(t, e, n, i) {
    switch (a0(e)) {
      case 2:
        var s = Q1;
        break;
      case 8:
        s = K1;
        break;
      default:
        s = zr;
    }
    ((n = s.bind(null, e, n, t)),
      (s = void 0),
      !Vu ||
        (e !== "touchstart" && e !== "touchmove" && e !== "wheel") ||
        (s = !0),
      i
        ? s !== void 0
          ? t.addEventListener(e, n, { capture: !0, passive: s })
          : t.addEventListener(e, n, !0)
        : s !== void 0
          ? t.addEventListener(e, n, { passive: s })
          : t.addEventListener(e, n, !1));
  }
  function gr(t, e, n, i, s) {
    var r = i;
    if ((e & 1) === 0 && (e & 2) === 0 && i !== null)
      t: for (;;) {
        if (i === null) return;
        var f = i.tag;
        if (f === 3 || f === 4) {
          var y = i.stateNode.containerInfo;
          if (y === s) break;
          if (f === 4)
            for (f = i.return; f !== null; ) {
              var S = f.tag;
              if ((S === 3 || S === 4) && f.stateNode.containerInfo === s)
                return;
              f = f.return;
            }
          for (; y !== null; ) {
            if (((f = Aa(y)), f === null)) return;
            if (((S = f.tag), S === 5 || S === 6 || S === 26 || S === 27)) {
              i = r = f;
              continue t;
            }
            y = y.parentNode;
          }
        }
        i = i.return;
      }
    _f(function () {
      var N = r,
        R = _u(n),
        V = [];
      t: {
        var j = ud.get(t);
        if (j !== void 0) {
          var w = Xl,
            J = t;
          switch (t) {
            case "keypress":
              if (Yl(n) === 0) break t;
            case "keydown":
            case "keyup":
              w = cv;
              break;
            case "focusin":
              ((J = "focus"), (w = Hu));
              break;
            case "focusout":
              ((J = "blur"), (w = Hu));
              break;
            case "beforeblur":
            case "afterblur":
              w = Hu;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              w = Uf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              w = $g;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              w = hv;
              break;
            case ad:
            case id:
            case ld:
              w = ev;
              break;
            case sd:
              w = pv;
              break;
            case "scroll":
            case "scrollend":
              w = Wg;
              break;
            case "wheel":
              w = gv;
              break;
            case "copy":
            case "cut":
            case "paste":
              w = av;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              w = Lf;
              break;
            case "toggle":
            case "beforetoggle":
              w = xv;
          }
          var et = (e & 4) !== 0,
            Et = !et && (t === "scroll" || t === "scrollend"),
            M = et ? (j !== null ? j + "Capture" : null) : j;
          et = [];
          for (var A = N, D; A !== null; ) {
            var O = A;
            if (
              ((D = O.stateNode),
              (O = O.tag),
              (O !== 5 && O !== 26 && O !== 27) ||
                D === null ||
                M === null ||
                ((O = Ai(A, M)), O != null && et.push(nl(A, O, D))),
              Et)
            )
              break;
            A = A.return;
          }
          0 < et.length &&
            ((j = new w(j, J, null, n, R)),
            V.push({ event: j, listeners: et }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((j = t === "mouseover" || t === "pointerover"),
            (w = t === "mouseout" || t === "pointerout"),
            j &&
              n !== Ru &&
              (J = n.relatedTarget || n.fromElement) &&
              (Aa(J) || J[Ta]))
          )
            break t;
          if (
            (w || j) &&
            ((j =
              R.window === R
                ? R
                : (j = R.ownerDocument)
                  ? j.defaultView || j.parentWindow
                  : window),
            w
              ? ((J = n.relatedTarget || n.toElement),
                (w = N),
                (J = J ? Aa(J) : null),
                J !== null &&
                  ((Et = h(J)),
                  (et = J.tag),
                  J !== Et || (et !== 5 && et !== 27 && et !== 6)) &&
                  (J = null))
              : ((w = null), (J = N)),
            w !== J)
          ) {
            if (
              ((et = Uf),
              (O = "onMouseLeave"),
              (M = "onMouseEnter"),
              (A = "mouse"),
              (t === "pointerout" || t === "pointerover") &&
                ((et = Lf),
                (O = "onPointerLeave"),
                (M = "onPointerEnter"),
                (A = "pointer")),
              (Et = w == null ? j : Ti(w)),
              (D = J == null ? j : Ti(J)),
              (j = new et(O, A + "leave", w, n, R)),
              (j.target = Et),
              (j.relatedTarget = D),
              (O = null),
              Aa(R) === N &&
                ((et = new et(M, A + "enter", J, n, R)),
                (et.target = D),
                (et.relatedTarget = Et),
                (O = et)),
              (Et = O),
              w && J)
            )
              e: {
                for (et = v1, M = w, A = J, D = 0, O = M; O; O = et(O)) D++;
                O = 0;
                for (var tt = A; tt; tt = et(tt)) O++;
                for (; 0 < D - O; ) ((M = et(M)), D--);
                for (; 0 < O - D; ) ((A = et(A)), O--);
                for (; D--; ) {
                  if (M === A || (A !== null && M === A.alternate)) {
                    et = M;
                    break e;
                  }
                  ((M = et(M)), (A = et(A)));
                }
                et = null;
              }
            else et = null;
            (w !== null && Cm(V, j, w, et, !1),
              J !== null && Et !== null && Cm(V, Et, J, et, !0));
          }
        }
        t: {
          if (
            ((j = N ? Ti(N) : window),
            (w = j.nodeName && j.nodeName.toLowerCase()),
            w === "select" || (w === "input" && j.type === "file"))
          )
            var yt = Kf;
          else if (Zf(j))
            if (kf) yt = Cv;
            else {
              yt = Nv;
              var I = Dv;
            }
          else
            ((w = j.nodeName),
              !w ||
              w.toLowerCase() !== "input" ||
              (j.type !== "checkbox" && j.type !== "radio")
                ? N && zu(N.elementType) && (yt = Kf)
                : (yt = jv));
          if (yt && (yt = yt(t, N))) {
            Qf(V, yt, n, R);
            break t;
          }
          (I && I(t, j, N),
            t === "focusout" &&
              N &&
              j.type === "number" &&
              N.memoizedProps.value != null &&
              wu(j, "number", j.value));
        }
        switch (((I = N ? Ti(N) : window), t)) {
          case "focusin":
            (Zf(I) || I.contentEditable === "true") &&
              ((Ra = I), (Qu = N), (zi = null));
            break;
          case "focusout":
            zi = Qu = Ra = null;
            break;
          case "mousedown":
            Ku = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((Ku = !1), ed(V, n, R));
            break;
          case "selectionchange":
            if (zv) break;
          case "keydown":
          case "keyup":
            ed(V, n, R);
        }
        var ot;
        if (Yu)
          t: {
            switch (t) {
              case "compositionstart":
                var ht = "onCompositionStart";
                break t;
              case "compositionend":
                ht = "onCompositionEnd";
                break t;
              case "compositionupdate":
                ht = "onCompositionUpdate";
                break t;
            }
            ht = void 0;
          }
        else
          za
            ? Gf(t, n) && (ht = "onCompositionEnd")
            : t === "keydown" &&
              n.keyCode === 229 &&
              (ht = "onCompositionStart");
        (ht &&
          (Hf &&
            n.locale !== "ko" &&
            (za || ht !== "onCompositionStart"
              ? ht === "onCompositionEnd" && za && (ot = Of())
              : ((En = R),
                (Uu = "value" in En ? En.value : En.textContent),
                (za = !0))),
          (I = _s(N, ht)),
          0 < I.length &&
            ((ht = new Bf(ht, t, null, n, R)),
            V.push({ event: ht, listeners: I }),
            ot
              ? (ht.data = ot)
              : ((ot = Xf(n)), ot !== null && (ht.data = ot)))),
          (ot = Sv ? Tv(t, n) : Av(t, n)) &&
            ((ht = _s(N, "onBeforeInput")),
            0 < ht.length &&
              ((I = new Bf("onBeforeInput", "beforeinput", null, n, R)),
              V.push({ event: I, listeners: ht }),
              (I.data = ot))),
          m1(V, t, N, n, R));
      }
      Nm(V, e);
    });
  }
  function nl(t, e, n) {
    return { instance: t, listener: e, currentTarget: n };
  }
  function _s(t, e) {
    for (var n = e + "Capture", i = []; t !== null; ) {
      var s = t,
        r = s.stateNode;
      if (
        ((s = s.tag),
        (s !== 5 && s !== 26 && s !== 27) ||
          r === null ||
          ((s = Ai(t, n)),
          s != null && i.unshift(nl(t, s, r)),
          (s = Ai(t, e)),
          s != null && i.push(nl(t, s, r))),
        t.tag === 3)
      )
        return i;
      t = t.return;
    }
    return [];
  }
  function v1(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Cm(t, e, n, i, s) {
    for (var r = e._reactName, f = []; n !== null && n !== i; ) {
      var y = n,
        S = y.alternate,
        N = y.stateNode;
      if (((y = y.tag), S !== null && S === i)) break;
      ((y !== 5 && y !== 26 && y !== 27) ||
        N === null ||
        ((S = N),
        s
          ? ((N = Ai(n, r)), N != null && f.unshift(nl(n, N, S)))
          : s || ((N = Ai(n, r)), N != null && f.push(nl(n, N, S)))),
        (n = n.return));
    }
    f.length !== 0 && t.push({ event: e, listeners: f });
  }
  var x1 = /\r\n?/g,
    b1 = /\u0000|\uFFFD/g;
  function wm(t) {
    return (typeof t == "string" ? t : "" + t)
      .replace(
        x1,
        `
`,
      )
      .replace(b1, "");
  }
  function zm(t, e) {
    return ((e = wm(e)), wm(t) === e);
  }
  function At(t, e, n, i, s, r) {
    switch (n) {
      case "children":
        typeof i == "string"
          ? e === "body" || (e === "textarea" && i === "") || ja(t, i)
          : (typeof i == "number" || typeof i == "bigint") &&
            e !== "body" &&
            ja(t, "" + i);
        break;
      case "className":
        Bl(t, "class", i);
        break;
      case "tabIndex":
        Bl(t, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Bl(t, n, i);
        break;
      case "style":
        zf(t, i, r);
        break;
      case "data":
        if (e !== "object") {
          Bl(t, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (
          i == null ||
          typeof i == "function" ||
          typeof i == "symbol" ||
          typeof i == "boolean"
        ) {
          t.removeAttribute(n);
          break;
        }
        ((i = Hl("" + i)), t.setAttribute(n, i));
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof r == "function" &&
            (n === "formAction"
              ? (e !== "input" && At(t, e, "name", s.name, s, null),
                At(t, e, "formEncType", s.formEncType, s, null),
                At(t, e, "formMethod", s.formMethod, s, null),
                At(t, e, "formTarget", s.formTarget, s, null))
              : (At(t, e, "encType", s.encType, s, null),
                At(t, e, "method", s.method, s, null),
                At(t, e, "target", s.target, s, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        ((i = Hl("" + i)), t.setAttribute(n, i));
        break;
      case "onClick":
        i != null && (t.onclick = nn);
        break;
      case "onScroll":
        i != null && ft("scroll", t);
        break;
      case "onScrollEnd":
        i != null && ft("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i)) throw Error(o(61));
          if (((n = i.__html), n != null)) {
            if (s.children != null) throw Error(o(60));
            t.innerHTML = n;
          }
        }
        break;
      case "multiple":
        t.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        t.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          i == null ||
          typeof i == "function" ||
          typeof i == "boolean" ||
          typeof i == "symbol"
        ) {
          t.removeAttribute("xlink:href");
          break;
        }
        ((n = Hl("" + i)),
          t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol"
          ? t.setAttribute(n, "" + i)
          : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol"
          ? t.setAttribute(n, "")
          : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        i === !0
          ? t.setAttribute(n, "")
          : i !== !1 &&
              i != null &&
              typeof i != "function" &&
              typeof i != "symbol"
            ? t.setAttribute(n, i)
            : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null &&
        typeof i != "function" &&
        typeof i != "symbol" &&
        !isNaN(i) &&
        1 <= i
          ? t.setAttribute(n, i)
          : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i)
          ? t.removeAttribute(n)
          : t.setAttribute(n, i);
        break;
      case "popover":
        (ft("beforetoggle", t), ft("toggle", t), Ul(t, "popover", i));
        break;
      case "xlinkActuate":
        en(t, "http://www.w3.org/1999/xlink", "xlink:actuate", i);
        break;
      case "xlinkArcrole":
        en(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", i);
        break;
      case "xlinkRole":
        en(t, "http://www.w3.org/1999/xlink", "xlink:role", i);
        break;
      case "xlinkShow":
        en(t, "http://www.w3.org/1999/xlink", "xlink:show", i);
        break;
      case "xlinkTitle":
        en(t, "http://www.w3.org/1999/xlink", "xlink:title", i);
        break;
      case "xlinkType":
        en(t, "http://www.w3.org/1999/xlink", "xlink:type", i);
        break;
      case "xmlBase":
        en(t, "http://www.w3.org/XML/1998/namespace", "xml:base", i);
        break;
      case "xmlLang":
        en(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", i);
        break;
      case "xmlSpace":
        en(t, "http://www.w3.org/XML/1998/namespace", "xml:space", i);
        break;
      case "is":
        Ul(t, "is", i);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) ||
          (n[0] !== "o" && n[0] !== "O") ||
          (n[1] !== "n" && n[1] !== "N")) &&
          ((n = Jg.get(n) || n), Ul(t, n, i));
    }
  }
  function vr(t, e, n, i, s, r) {
    switch (n) {
      case "style":
        zf(t, i, r);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i)) throw Error(o(61));
          if (((n = i.__html), n != null)) {
            if (s.children != null) throw Error(o(60));
            t.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof i == "string"
          ? ja(t, i)
          : (typeof i == "number" || typeof i == "bigint") && ja(t, "" + i);
        break;
      case "onScroll":
        i != null && ft("scroll", t);
        break;
      case "onScrollEnd":
        i != null && ft("scrollend", t);
        break;
      case "onClick":
        i != null && (t.onclick = nn);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Tf.hasOwnProperty(n))
          t: {
            if (
              n[0] === "o" &&
              n[1] === "n" &&
              ((s = n.endsWith("Capture")),
              (e = n.slice(2, s ? n.length - 7 : void 0)),
              (r = t[re] || null),
              (r = r != null ? r[n] : null),
              typeof r == "function" && t.removeEventListener(e, r, s),
              typeof i == "function")
            ) {
              (typeof r != "function" &&
                r !== null &&
                (n in t
                  ? (t[n] = null)
                  : t.hasAttribute(n) && t.removeAttribute(n)),
                t.addEventListener(e, i, s));
              break t;
            }
            n in t
              ? (t[n] = i)
              : i === !0
                ? t.setAttribute(n, "")
                : Ul(t, n, i);
          }
    }
  }
  function te(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (ft("error", t), ft("load", t));
        var i = !1,
          s = !1,
          r;
        for (r in n)
          if (n.hasOwnProperty(r)) {
            var f = n[r];
            if (f != null)
              switch (r) {
                case "src":
                  i = !0;
                  break;
                case "srcSet":
                  s = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, e));
                default:
                  At(t, e, r, f, n, null);
              }
          }
        (s && At(t, e, "srcSet", n.srcSet, n, null),
          i && At(t, e, "src", n.src, n, null));
        return;
      case "input":
        ft("invalid", t);
        var y = (r = f = s = null),
          S = null,
          N = null;
        for (i in n)
          if (n.hasOwnProperty(i)) {
            var R = n[i];
            if (R != null)
              switch (i) {
                case "name":
                  s = R;
                  break;
                case "type":
                  f = R;
                  break;
                case "checked":
                  S = R;
                  break;
                case "defaultChecked":
                  N = R;
                  break;
                case "value":
                  r = R;
                  break;
                case "defaultValue":
                  y = R;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (R != null) throw Error(o(137, e));
                  break;
                default:
                  At(t, e, i, R, n, null);
              }
          }
        Nf(t, r, y, S, N, f, s, !1);
        return;
      case "select":
        (ft("invalid", t), (i = f = r = null));
        for (s in n)
          if (n.hasOwnProperty(s) && ((y = n[s]), y != null))
            switch (s) {
              case "value":
                r = y;
                break;
              case "defaultValue":
                f = y;
                break;
              case "multiple":
                i = y;
              default:
                At(t, e, s, y, n, null);
            }
        ((e = r),
          (n = f),
          (t.multiple = !!i),
          e != null ? Na(t, !!i, e, !1) : n != null && Na(t, !!i, n, !0));
        return;
      case "textarea":
        (ft("invalid", t), (r = s = i = null));
        for (f in n)
          if (n.hasOwnProperty(f) && ((y = n[f]), y != null))
            switch (f) {
              case "value":
                i = y;
                break;
              case "defaultValue":
                s = y;
                break;
              case "children":
                r = y;
                break;
              case "dangerouslySetInnerHTML":
                if (y != null) throw Error(o(91));
                break;
              default:
                At(t, e, f, y, n, null);
            }
        Cf(t, i, s, r);
        return;
      case "option":
        for (S in n)
          if (n.hasOwnProperty(S) && ((i = n[S]), i != null))
            switch (S) {
              case "selected":
                t.selected =
                  i && typeof i != "function" && typeof i != "symbol";
                break;
              default:
                At(t, e, S, i, n, null);
            }
        return;
      case "dialog":
        (ft("beforetoggle", t),
          ft("toggle", t),
          ft("cancel", t),
          ft("close", t));
        break;
      case "iframe":
      case "object":
        ft("load", t);
        break;
      case "video":
      case "audio":
        for (i = 0; i < el.length; i++) ft(el[i], t);
        break;
      case "image":
        (ft("error", t), ft("load", t));
        break;
      case "details":
        ft("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        (ft("error", t), ft("load", t));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (N in n)
          if (n.hasOwnProperty(N) && ((i = n[N]), i != null))
            switch (N) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, e));
              default:
                At(t, e, N, i, n, null);
            }
        return;
      default:
        if (zu(e)) {
          for (R in n)
            n.hasOwnProperty(R) &&
              ((i = n[R]), i !== void 0 && vr(t, e, R, i, n, void 0));
          return;
        }
    }
    for (y in n)
      n.hasOwnProperty(y) && ((i = n[y]), i != null && At(t, e, y, i, n, null));
  }
  function S1(t, e, n, i) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var s = null,
          r = null,
          f = null,
          y = null,
          S = null,
          N = null,
          R = null;
        for (w in n) {
          var V = n[w];
          if (n.hasOwnProperty(w) && V != null)
            switch (w) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                S = V;
              default:
                i.hasOwnProperty(w) || At(t, e, w, null, i, V);
            }
        }
        for (var j in i) {
          var w = i[j];
          if (((V = n[j]), i.hasOwnProperty(j) && (w != null || V != null)))
            switch (j) {
              case "type":
                r = w;
                break;
              case "name":
                s = w;
                break;
              case "checked":
                N = w;
                break;
              case "defaultChecked":
                R = w;
                break;
              case "value":
                f = w;
                break;
              case "defaultValue":
                y = w;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (w != null) throw Error(o(137, e));
                break;
              default:
                w !== V && At(t, e, j, w, i, V);
            }
        }
        Cu(t, f, y, S, N, R, r, s);
        return;
      case "select":
        w = f = y = j = null;
        for (r in n)
          if (((S = n[r]), n.hasOwnProperty(r) && S != null))
            switch (r) {
              case "value":
                break;
              case "multiple":
                w = S;
              default:
                i.hasOwnProperty(r) || At(t, e, r, null, i, S);
            }
        for (s in i)
          if (
            ((r = i[s]),
            (S = n[s]),
            i.hasOwnProperty(s) && (r != null || S != null))
          )
            switch (s) {
              case "value":
                j = r;
                break;
              case "defaultValue":
                y = r;
                break;
              case "multiple":
                f = r;
              default:
                r !== S && At(t, e, s, r, i, S);
            }
        ((e = y),
          (n = f),
          (i = w),
          j != null
            ? Na(t, !!n, j, !1)
            : !!i != !!n &&
              (e != null ? Na(t, !!n, e, !0) : Na(t, !!n, n ? [] : "", !1)));
        return;
      case "textarea":
        w = j = null;
        for (y in n)
          if (
            ((s = n[y]),
            n.hasOwnProperty(y) && s != null && !i.hasOwnProperty(y))
          )
            switch (y) {
              case "value":
                break;
              case "children":
                break;
              default:
                At(t, e, y, null, i, s);
            }
        for (f in i)
          if (
            ((s = i[f]),
            (r = n[f]),
            i.hasOwnProperty(f) && (s != null || r != null))
          )
            switch (f) {
              case "value":
                j = s;
                break;
              case "defaultValue":
                w = s;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(o(91));
                break;
              default:
                s !== r && At(t, e, f, s, i, r);
            }
        jf(t, j, w);
        return;
      case "option":
        for (var J in n)
          if (
            ((j = n[J]),
            n.hasOwnProperty(J) && j != null && !i.hasOwnProperty(J))
          )
            switch (J) {
              case "selected":
                t.selected = !1;
                break;
              default:
                At(t, e, J, null, i, j);
            }
        for (S in i)
          if (
            ((j = i[S]),
            (w = n[S]),
            i.hasOwnProperty(S) && j !== w && (j != null || w != null))
          )
            switch (S) {
              case "selected":
                t.selected =
                  j && typeof j != "function" && typeof j != "symbol";
                break;
              default:
                At(t, e, S, j, i, w);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var et in n)
          ((j = n[et]),
            n.hasOwnProperty(et) &&
              j != null &&
              !i.hasOwnProperty(et) &&
              At(t, e, et, null, i, j));
        for (N in i)
          if (
            ((j = i[N]),
            (w = n[N]),
            i.hasOwnProperty(N) && j !== w && (j != null || w != null))
          )
            switch (N) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (j != null) throw Error(o(137, e));
                break;
              default:
                At(t, e, N, j, i, w);
            }
        return;
      default:
        if (zu(e)) {
          for (var Et in n)
            ((j = n[Et]),
              n.hasOwnProperty(Et) &&
                j !== void 0 &&
                !i.hasOwnProperty(Et) &&
                vr(t, e, Et, void 0, i, j));
          for (R in i)
            ((j = i[R]),
              (w = n[R]),
              !i.hasOwnProperty(R) ||
                j === w ||
                (j === void 0 && w === void 0) ||
                vr(t, e, R, j, i, w));
          return;
        }
    }
    for (var M in n)
      ((j = n[M]),
        n.hasOwnProperty(M) &&
          j != null &&
          !i.hasOwnProperty(M) &&
          At(t, e, M, null, i, j));
    for (V in i)
      ((j = i[V]),
        (w = n[V]),
        !i.hasOwnProperty(V) ||
          j === w ||
          (j == null && w == null) ||
          At(t, e, V, j, i, w));
  }
  function Rm(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function T1() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var t = 0, e = 0, n = performance.getEntriesByType("resource"), i = 0;
        i < n.length;
        i++
      ) {
        var s = n[i],
          r = s.transferSize,
          f = s.initiatorType,
          y = s.duration;
        if (r && y && Rm(f)) {
          for (f = 0, y = s.responseEnd, i += 1; i < n.length; i++) {
            var S = n[i],
              N = S.startTime;
            if (N > y) break;
            var R = S.transferSize,
              V = S.initiatorType;
            R &&
              Rm(V) &&
              ((S = S.responseEnd), (f += R * (S < y ? 1 : (y - N) / (S - N))));
          }
          if ((--i, (e += (8 * (r + f)) / (s.duration / 1e3)), t++, 10 < t))
            break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection &&
      ((t = navigator.connection.downlink), typeof t == "number")
      ? t
      : 5;
  }
  var xr = null,
    br = null;
  function Os(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function _m(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Om(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Sr(t, e) {
    return (
      t === "textarea" ||
      t === "noscript" ||
      typeof e.children == "string" ||
      typeof e.children == "number" ||
      typeof e.children == "bigint" ||
      (typeof e.dangerouslySetInnerHTML == "object" &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Tr = null;
  function A1() {
    var t = window.event;
    return t && t.type === "popstate"
      ? t === Tr
        ? !1
        : ((Tr = t), !0)
      : ((Tr = null), !1);
  }
  var Vm = typeof setTimeout == "function" ? setTimeout : void 0,
    E1 = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Um = typeof Promise == "function" ? Promise : void 0,
    M1 =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Um < "u"
          ? function (t) {
              return Um.resolve(null).then(t).catch(D1);
            }
          : Vm;
  function D1(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function Yn(t) {
    return t === "head";
  }
  function Bm(t, e) {
    var n = e,
      i = 0;
    do {
      var s = n.nextSibling;
      if ((t.removeChild(n), s && s.nodeType === 8))
        if (((n = s.data), n === "/$" || n === "/&")) {
          if (i === 0) {
            (t.removeChild(s), li(e));
            return;
          }
          i--;
        } else if (
          n === "$" ||
          n === "$?" ||
          n === "$~" ||
          n === "$!" ||
          n === "&"
        )
          i++;
        else if (n === "html") al(t.ownerDocument.documentElement);
        else if (n === "head") {
          ((n = t.ownerDocument.head), al(n));
          for (var r = n.firstChild; r; ) {
            var f = r.nextSibling,
              y = r.nodeName;
            (r[Si] ||
              y === "SCRIPT" ||
              y === "STYLE" ||
              (y === "LINK" && r.rel.toLowerCase() === "stylesheet") ||
              n.removeChild(r),
              (r = f));
          }
        } else n === "body" && al(t.ownerDocument.body);
      n = s;
    } while (n);
    li(e);
  }
  function Lm(t, e) {
    var n = t;
    t = 0;
    do {
      var i = n.nextSibling;
      if (
        (n.nodeType === 1
          ? e
            ? ((n._stashedDisplay = n.style.display),
              (n.style.display = "none"))
            : ((n.style.display = n._stashedDisplay || ""),
              n.getAttribute("style") === "" && n.removeAttribute("style"))
          : n.nodeType === 3 &&
            (e
              ? ((n._stashedText = n.nodeValue), (n.nodeValue = ""))
              : (n.nodeValue = n._stashedText || "")),
        i && i.nodeType === 8)
      )
        if (((n = i.data), n === "/$")) {
          if (t === 0) break;
          t--;
        } else (n !== "$" && n !== "$?" && n !== "$~" && n !== "$!") || t++;
      n = i;
    } while (n);
  }
  function Ar(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (((e = e.nextSibling), n.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (Ar(n), Nu(n));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function N1(t, e, n, i) {
    for (; t.nodeType === 1; ) {
      var s = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!i && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
      } else if (i) {
        if (!t[Si])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (
                ((r = t.getAttribute("rel")),
                r === "stylesheet" && t.hasAttribute("data-precedence"))
              )
                break;
              if (
                r !== s.rel ||
                t.getAttribute("href") !==
                  (s.href == null || s.href === "" ? null : s.href) ||
                t.getAttribute("crossorigin") !==
                  (s.crossOrigin == null ? null : s.crossOrigin) ||
                t.getAttribute("title") !== (s.title == null ? null : s.title)
              )
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (
                ((r = t.getAttribute("src")),
                (r !== (s.src == null ? null : s.src) ||
                  t.getAttribute("type") !== (s.type == null ? null : s.type) ||
                  t.getAttribute("crossorigin") !==
                    (s.crossOrigin == null ? null : s.crossOrigin)) &&
                  r &&
                  t.hasAttribute("async") &&
                  !t.hasAttribute("itemprop"))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var r = s.name == null ? null : "" + s.name;
        if (s.type === "hidden" && t.getAttribute("name") === r) return t;
      } else return t;
      if (((t = Ue(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function j1(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") &&
          !n) ||
        ((t = Ue(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Hm(t, e) {
    for (; t.nodeType !== 8; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") &&
          !e) ||
        ((t = Ue(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Er(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Mr(t) {
    return (
      t.data === "$!" ||
      (t.data === "$?" && t.ownerDocument.readyState !== "loading")
    );
  }
  function C1(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading") e();
    else {
      var i = function () {
        (e(), n.removeEventListener("DOMContentLoaded", i));
      };
      (n.addEventListener("DOMContentLoaded", i), (t._reactRetry = i));
    }
  }
  function Ue(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (
          ((e = t.data),
          e === "$" ||
            e === "$!" ||
            e === "$?" ||
            e === "$~" ||
            e === "&" ||
            e === "F!" ||
            e === "F")
        )
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var Dr = null;
  function qm(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0) return Ue(t.nextSibling);
          e--;
        } else
          (n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&") ||
            e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Ym(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (e === 0) return t;
          e--;
        } else (n !== "/$" && n !== "/&") || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Gm(t, e, n) {
    switch (((e = Os(n)), t)) {
      case "html":
        if (((t = e.documentElement), !t)) throw Error(o(452));
        return t;
      case "head":
        if (((t = e.head), !t)) throw Error(o(453));
        return t;
      case "body":
        if (((t = e.body), !t)) throw Error(o(454));
        return t;
      default:
        throw Error(o(451));
    }
  }
  function al(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    Nu(t);
  }
  var Be = new Map(),
    Xm = new Set();
  function Vs(t) {
    return typeof t.getRootNode == "function"
      ? t.getRootNode()
      : t.nodeType === 9
        ? t
        : t.ownerDocument;
  }
  var xn = X.d;
  X.d = { f: w1, r: z1, D: R1, C: _1, L: O1, m: V1, X: B1, S: U1, M: L1 };
  function w1() {
    var t = xn.f(),
      e = Ds();
    return t || e;
  }
  function z1(t) {
    var e = Ea(t);
    e !== null && e.tag === 5 && e.type === "form" ? sh(e) : xn.r(t);
  }
  var ni = typeof document > "u" ? null : document;
  function Zm(t, e, n) {
    var i = ni;
    if (i && typeof e == "string" && e) {
      var s = Ce(e);
      ((s = 'link[rel="' + t + '"][href="' + s + '"]'),
        typeof n == "string" && (s += '[crossorigin="' + n + '"]'),
        Xm.has(s) ||
          (Xm.add(s),
          (t = { rel: t, crossOrigin: n, href: e }),
          i.querySelector(s) === null &&
            ((e = i.createElement("link")),
            te(e, "link", t),
            Jt(e),
            i.head.appendChild(e))));
    }
  }
  function R1(t) {
    (xn.D(t), Zm("dns-prefetch", t, null));
  }
  function _1(t, e) {
    (xn.C(t, e), Zm("preconnect", t, e));
  }
  function O1(t, e, n) {
    xn.L(t, e, n);
    var i = ni;
    if (i && t && e) {
      var s = 'link[rel="preload"][as="' + Ce(e) + '"]';
      e === "image" && n && n.imageSrcSet
        ? ((s += '[imagesrcset="' + Ce(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == "string" &&
            (s += '[imagesizes="' + Ce(n.imageSizes) + '"]'))
        : (s += '[href="' + Ce(t) + '"]');
      var r = s;
      switch (e) {
        case "style":
          r = ai(t);
          break;
        case "script":
          r = ii(t);
      }
      Be.has(r) ||
        ((t = b(
          {
            rel: "preload",
            href: e === "image" && n && n.imageSrcSet ? void 0 : t,
            as: e,
          },
          n,
        )),
        Be.set(r, t),
        i.querySelector(s) !== null ||
          (e === "style" && i.querySelector(il(r))) ||
          (e === "script" && i.querySelector(ll(r))) ||
          ((e = i.createElement("link")),
          te(e, "link", t),
          Jt(e),
          i.head.appendChild(e)));
    }
  }
  function V1(t, e) {
    xn.m(t, e);
    var n = ni;
    if (n && t) {
      var i = e && typeof e.as == "string" ? e.as : "script",
        s =
          'link[rel="modulepreload"][as="' + Ce(i) + '"][href="' + Ce(t) + '"]',
        r = s;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          r = ii(t);
      }
      if (
        !Be.has(r) &&
        ((t = b({ rel: "modulepreload", href: t }, e)),
        Be.set(r, t),
        n.querySelector(s) === null)
      ) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(ll(r))) return;
        }
        ((i = n.createElement("link")),
          te(i, "link", t),
          Jt(i),
          n.head.appendChild(i));
      }
    }
  }
  function U1(t, e, n) {
    xn.S(t, e, n);
    var i = ni;
    if (i && t) {
      var s = Ma(i).hoistableStyles,
        r = ai(t);
      e = e || "default";
      var f = s.get(r);
      if (!f) {
        var y = { loading: 0, preload: null };
        if ((f = i.querySelector(il(r)))) y.loading = 5;
        else {
          ((t = b({ rel: "stylesheet", href: t, "data-precedence": e }, n)),
            (n = Be.get(r)) && Nr(t, n));
          var S = (f = i.createElement("link"));
          (Jt(S),
            te(S, "link", t),
            (S._p = new Promise(function (N, R) {
              ((S.onload = N), (S.onerror = R));
            })),
            S.addEventListener("load", function () {
              y.loading |= 1;
            }),
            S.addEventListener("error", function () {
              y.loading |= 2;
            }),
            (y.loading |= 4),
            Us(f, e, i));
        }
        ((f = { type: "stylesheet", instance: f, count: 1, state: y }),
          s.set(r, f));
      }
    }
  }
  function B1(t, e) {
    xn.X(t, e);
    var n = ni;
    if (n && t) {
      var i = Ma(n).hoistableScripts,
        s = ii(t),
        r = i.get(s);
      r ||
        ((r = n.querySelector(ll(s))),
        r ||
          ((t = b({ src: t, async: !0 }, e)),
          (e = Be.get(s)) && jr(t, e),
          (r = n.createElement("script")),
          Jt(r),
          te(r, "link", t),
          n.head.appendChild(r)),
        (r = { type: "script", instance: r, count: 1, state: null }),
        i.set(s, r));
    }
  }
  function L1(t, e) {
    xn.M(t, e);
    var n = ni;
    if (n && t) {
      var i = Ma(n).hoistableScripts,
        s = ii(t),
        r = i.get(s);
      r ||
        ((r = n.querySelector(ll(s))),
        r ||
          ((t = b({ src: t, async: !0, type: "module" }, e)),
          (e = Be.get(s)) && jr(t, e),
          (r = n.createElement("script")),
          Jt(r),
          te(r, "link", t),
          n.head.appendChild(r)),
        (r = { type: "script", instance: r, count: 1, state: null }),
        i.set(s, r));
    }
  }
  function Qm(t, e, n, i) {
    var s = (s = rt.current) ? Vs(s) : null;
    if (!s) throw Error(o(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string"
          ? ((e = ai(n.href)),
            (n = Ma(s).hoistableStyles),
            (i = n.get(e)),
            i ||
              ((i = { type: "style", instance: null, count: 0, state: null }),
              n.set(e, i)),
            i)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          n.rel === "stylesheet" &&
          typeof n.href == "string" &&
          typeof n.precedence == "string"
        ) {
          t = ai(n.href);
          var r = Ma(s).hoistableStyles,
            f = r.get(t);
          if (
            (f ||
              ((s = s.ownerDocument || s),
              (f = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              r.set(t, f),
              (r = s.querySelector(il(t))) &&
                !r._p &&
                ((f.instance = r), (f.state.loading = 5)),
              Be.has(t) ||
                ((n = {
                  rel: "preload",
                  as: "style",
                  href: n.href,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  media: n.media,
                  hrefLang: n.hrefLang,
                  referrerPolicy: n.referrerPolicy,
                }),
                Be.set(t, n),
                r || H1(s, t, n, f.state))),
            e && i === null)
          )
            throw Error(o(528, ""));
          return f;
        }
        if (e && i !== null) throw Error(o(529, ""));
        return null;
      case "script":
        return (
          (e = n.async),
          (n = n.src),
          typeof n == "string" &&
          e &&
          typeof e != "function" &&
          typeof e != "symbol"
            ? ((e = ii(n)),
              (n = Ma(s).hoistableScripts),
              (i = n.get(e)),
              i ||
                ((i = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                n.set(e, i)),
              i)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(o(444, t));
    }
  }
  function ai(t) {
    return 'href="' + Ce(t) + '"';
  }
  function il(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Km(t) {
    return b({}, t, { "data-precedence": t.precedence, precedence: null });
  }
  function H1(t, e, n, i) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]")
      ? (i.loading = 1)
      : ((e = t.createElement("link")),
        (i.preload = e),
        e.addEventListener("load", function () {
          return (i.loading |= 1);
        }),
        e.addEventListener("error", function () {
          return (i.loading |= 2);
        }),
        te(e, "link", n),
        Jt(e),
        t.head.appendChild(e));
  }
  function ii(t) {
    return '[src="' + Ce(t) + '"]';
  }
  function ll(t) {
    return "script[async]" + t;
  }
  function km(t, e, n) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case "style":
          var i = t.querySelector('style[data-href~="' + Ce(n.href) + '"]');
          if (i) return ((e.instance = i), Jt(i), i);
          var s = b({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null,
          });
          return (
            (i = (t.ownerDocument || t).createElement("style")),
            Jt(i),
            te(i, "style", s),
            Us(i, n.precedence, t),
            (e.instance = i)
          );
        case "stylesheet":
          s = ai(n.href);
          var r = t.querySelector(il(s));
          if (r) return ((e.state.loading |= 4), (e.instance = r), Jt(r), r);
          ((i = Km(n)),
            (s = Be.get(s)) && Nr(i, s),
            (r = (t.ownerDocument || t).createElement("link")),
            Jt(r));
          var f = r;
          return (
            (f._p = new Promise(function (y, S) {
              ((f.onload = y), (f.onerror = S));
            })),
            te(r, "link", i),
            (e.state.loading |= 4),
            Us(r, n.precedence, t),
            (e.instance = r)
          );
        case "script":
          return (
            (r = ii(n.src)),
            (s = t.querySelector(ll(r)))
              ? ((e.instance = s), Jt(s), s)
              : ((i = n),
                (s = Be.get(r)) && ((i = b({}, n)), jr(i, s)),
                (t = t.ownerDocument || t),
                (s = t.createElement("script")),
                Jt(s),
                te(s, "link", i),
                t.head.appendChild(s),
                (e.instance = s))
          );
        case "void":
          return null;
        default:
          throw Error(o(443, e.type));
      }
    else
      e.type === "stylesheet" &&
        (e.state.loading & 4) === 0 &&
        ((i = e.instance), (e.state.loading |= 4), Us(i, n.precedence, t));
    return e.instance;
  }
  function Us(t, e, n) {
    for (
      var i = n.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]',
        ),
        s = i.length ? i[i.length - 1] : null,
        r = s,
        f = 0;
      f < i.length;
      f++
    ) {
      var y = i[f];
      if (y.dataset.precedence === e) r = y;
      else if (r !== s) break;
    }
    r
      ? r.parentNode.insertBefore(t, r.nextSibling)
      : ((e = n.nodeType === 9 ? n.head : n), e.insertBefore(t, e.firstChild));
  }
  function Nr(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title));
  }
  function jr(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity));
  }
  var Bs = null;
  function Jm(t, e, n) {
    if (Bs === null) {
      var i = new Map(),
        s = (Bs = new Map());
      s.set(n, i);
    } else ((s = Bs), (i = s.get(n)), i || ((i = new Map()), s.set(n, i)));
    if (i.has(t)) return i;
    for (
      i.set(t, null), n = n.getElementsByTagName(t), s = 0;
      s < n.length;
      s++
    ) {
      var r = n[s];
      if (
        !(
          r[Si] ||
          r[Wt] ||
          (t === "link" && r.getAttribute("rel") === "stylesheet")
        ) &&
        r.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var f = r.getAttribute(e) || "";
        f = t + f;
        var y = i.get(f);
        y ? y.push(r) : i.set(f, [r]);
      }
    }
    return i;
  }
  function Fm(t, e, n) {
    ((t = t.ownerDocument || t),
      t.head.insertBefore(
        n,
        e === "title" ? t.querySelector("head > title") : null,
      ));
  }
  function q1(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof e.precedence != "string" ||
          typeof e.href != "string" ||
          e.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof e.rel != "string" ||
          typeof e.href != "string" ||
          e.href === "" ||
          e.onLoad ||
          e.onError
        )
          break;
        switch (e.rel) {
          case "stylesheet":
            return (
              (t = e.disabled),
              typeof e.precedence == "string" && t == null
            );
          default:
            return !0;
        }
      case "script":
        if (
          e.async &&
          typeof e.async != "function" &&
          typeof e.async != "symbol" &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function Wm(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function Y1(t, e, n, i) {
    if (
      n.type === "stylesheet" &&
      (typeof i.media != "string" || matchMedia(i.media).matches !== !1) &&
      (n.state.loading & 4) === 0
    ) {
      if (n.instance === null) {
        var s = ai(i.href),
          r = e.querySelector(il(s));
        if (r) {
          ((e = r._p),
            e !== null &&
              typeof e == "object" &&
              typeof e.then == "function" &&
              (t.count++, (t = Ls.bind(t)), e.then(t, t)),
            (n.state.loading |= 4),
            (n.instance = r),
            Jt(r));
          return;
        }
        ((r = e.ownerDocument || e),
          (i = Km(i)),
          (s = Be.get(s)) && Nr(i, s),
          (r = r.createElement("link")),
          Jt(r));
        var f = r;
        ((f._p = new Promise(function (y, S) {
          ((f.onload = y), (f.onerror = S));
        })),
          te(r, "link", i),
          (n.instance = r));
      }
      (t.stylesheets === null && (t.stylesheets = new Map()),
        t.stylesheets.set(n, e),
        (e = n.state.preload) &&
          (n.state.loading & 3) === 0 &&
          (t.count++,
          (n = Ls.bind(t)),
          e.addEventListener("load", n),
          e.addEventListener("error", n)));
    }
  }
  var Cr = 0;
  function G1(t, e) {
    return (
      t.stylesheets && t.count === 0 && qs(t, t.stylesheets),
      0 < t.count || 0 < t.imgCount
        ? function (n) {
            var i = setTimeout(function () {
              if ((t.stylesheets && qs(t, t.stylesheets), t.unsuspend)) {
                var r = t.unsuspend;
                ((t.unsuspend = null), r());
              }
            }, 6e4 + e);
            0 < t.imgBytes && Cr === 0 && (Cr = 62500 * T1());
            var s = setTimeout(
              function () {
                if (
                  ((t.waitingForImages = !1),
                  t.count === 0 &&
                    (t.stylesheets && qs(t, t.stylesheets), t.unsuspend))
                ) {
                  var r = t.unsuspend;
                  ((t.unsuspend = null), r());
                }
              },
              (t.imgBytes > Cr ? 50 : 800) + e,
            );
            return (
              (t.unsuspend = n),
              function () {
                ((t.unsuspend = null), clearTimeout(i), clearTimeout(s));
              }
            );
          }
        : null
    );
  }
  function Ls() {
    if (
      (this.count--,
      this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
    ) {
      if (this.stylesheets) qs(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var Hs = null;
  function qs(t, e) {
    ((t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++,
        (Hs = new Map()),
        e.forEach(X1, t),
        (Hs = null),
        Ls.call(t)));
  }
  function X1(t, e) {
    if (!(e.state.loading & 4)) {
      var n = Hs.get(t);
      if (n) var i = n.get(null);
      else {
        ((n = new Map()), Hs.set(t, n));
        for (
          var s = t.querySelectorAll(
              "link[data-precedence],style[data-precedence]",
            ),
            r = 0;
          r < s.length;
          r++
        ) {
          var f = s[r];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") &&
            (n.set(f.dataset.precedence, f), (i = f));
        }
        i && n.set(null, i);
      }
      ((s = e.instance),
        (f = s.getAttribute("data-precedence")),
        (r = n.get(f) || i),
        r === i && n.set(null, s),
        n.set(f, s),
        this.count++,
        (i = Ls.bind(this)),
        s.addEventListener("load", i),
        s.addEventListener("error", i),
        r
          ? r.parentNode.insertBefore(s, r.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t),
            t.insertBefore(s, t.firstChild)),
        (e.state.loading |= 4));
    }
  }
  var sl = {
    $$typeof: L,
    Provider: null,
    Consumer: null,
    _currentValue: k,
    _currentValue2: k,
    _threadCount: 0,
  };
  function Z1(t, e, n, i, s, r, f, y, S) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Au(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Au(0)),
      (this.hiddenUpdates = Au(null)),
      (this.identifierPrefix = i),
      (this.onUncaughtError = s),
      (this.onCaughtError = r),
      (this.onRecoverableError = f),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = S),
      (this.incompleteTransitions = new Map()));
  }
  function Pm(t, e, n, i, s, r, f, y, S, N, R, V) {
    return (
      (t = new Z1(t, e, n, f, S, N, R, V, y)),
      (e = 1),
      r === !0 && (e |= 24),
      (r = be(3, null, null, e)),
      (t.current = r),
      (r.stateNode = t),
      (e = uo()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (r.memoizedState = { element: i, isDehydrated: n, cache: e }),
      fo(r),
      t
    );
  }
  function $m(t) {
    return t ? ((t = Va), t) : Va;
  }
  function Im(t, e, n, i, s, r) {
    ((s = $m(s)),
      i.context === null ? (i.context = s) : (i.pendingContext = s),
      (i = wn(e)),
      (i.payload = { element: n }),
      (r = r === void 0 ? null : r),
      r !== null && (i.callback = r),
      (n = zn(t, i, e)),
      n !== null && (pe(n, t, e), Li(n, t, e)));
  }
  function t0(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function wr(t, e) {
    (t0(t, e), (t = t.alternate) && t0(t, e));
  }
  function e0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = ia(t, 67108864);
      (e !== null && pe(e, t, 67108864), wr(t, 67108864));
    }
  }
  function n0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Me();
      e = Eu(e);
      var n = ia(t, e);
      (n !== null && pe(n, t, e), wr(t, e));
    }
  }
  var Ys = !0;
  function Q1(t, e, n, i) {
    var s = _.T;
    _.T = null;
    var r = X.p;
    try {
      ((X.p = 2), zr(t, e, n, i));
    } finally {
      ((X.p = r), (_.T = s));
    }
  }
  function K1(t, e, n, i) {
    var s = _.T;
    _.T = null;
    var r = X.p;
    try {
      ((X.p = 8), zr(t, e, n, i));
    } finally {
      ((X.p = r), (_.T = s));
    }
  }
  function zr(t, e, n, i) {
    if (Ys) {
      var s = Rr(i);
      if (s === null) (gr(t, e, i, Gs, n), i0(t, i));
      else if (J1(s, t, e, n, i)) i.stopPropagation();
      else if ((i0(t, i), e & 4 && -1 < k1.indexOf(t))) {
        for (; s !== null; ) {
          var r = Ea(s);
          if (r !== null)
            switch (r.tag) {
              case 3:
                if (((r = r.stateNode), r.current.memoizedState.isDehydrated)) {
                  var f = In(r.pendingLanes);
                  if (f !== 0) {
                    var y = r;
                    for (y.pendingLanes |= 2, y.entangledLanes |= 2; f; ) {
                      var S = 1 << (31 - ve(f));
                      ((y.entanglements[1] |= S), (f &= ~S));
                    }
                    (Pe(r), (vt & 6) === 0 && ((Es = ye() + 500), tl(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((y = ia(r, 2)), y !== null && pe(y, r, 2), Ds(), wr(r, 2));
            }
          if (((r = Rr(i)), r === null && gr(t, e, i, Gs, n), r === s)) break;
          s = r;
        }
        s !== null && i.stopPropagation();
      } else gr(t, e, i, null, n);
    }
  }
  function Rr(t) {
    return ((t = _u(t)), _r(t));
  }
  var Gs = null;
  function _r(t) {
    if (((Gs = null), (t = Aa(t)), t !== null)) {
      var e = h(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (((t = d(e)), t !== null)) return t;
          t = null;
        } else if (n === 31) {
          if (((t = m(e)), t !== null)) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ((Gs = t), null);
  }
  function a0(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Rg()) {
          case ff:
            return 2;
          case df:
            return 8;
          case zl:
          case _g:
            return 32;
          case hf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Or = !1,
    Gn = null,
    Xn = null,
    Zn = null,
    ul = new Map(),
    ol = new Map(),
    Qn = [],
    k1 =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function i0(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Gn = null;
        break;
      case "dragenter":
      case "dragleave":
        Xn = null;
        break;
      case "mouseover":
      case "mouseout":
        Zn = null;
        break;
      case "pointerover":
      case "pointerout":
        ul.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ol.delete(e.pointerId);
    }
  }
  function rl(t, e, n, i, s, r) {
    return t === null || t.nativeEvent !== r
      ? ((t = {
          blockedOn: e,
          domEventName: n,
          eventSystemFlags: i,
          nativeEvent: r,
          targetContainers: [s],
        }),
        e !== null && ((e = Ea(e)), e !== null && e0(e)),
        t)
      : ((t.eventSystemFlags |= i),
        (e = t.targetContainers),
        s !== null && e.indexOf(s) === -1 && e.push(s),
        t);
  }
  function J1(t, e, n, i, s) {
    switch (e) {
      case "focusin":
        return ((Gn = rl(Gn, t, e, n, i, s)), !0);
      case "dragenter":
        return ((Xn = rl(Xn, t, e, n, i, s)), !0);
      case "mouseover":
        return ((Zn = rl(Zn, t, e, n, i, s)), !0);
      case "pointerover":
        var r = s.pointerId;
        return (ul.set(r, rl(ul.get(r) || null, t, e, n, i, s)), !0);
      case "gotpointercapture":
        return (
          (r = s.pointerId),
          ol.set(r, rl(ol.get(r) || null, t, e, n, i, s)),
          !0
        );
    }
    return !1;
  }
  function l0(t) {
    var e = Aa(t.target);
    if (e !== null) {
      var n = h(e);
      if (n !== null) {
        if (((e = n.tag), e === 13)) {
          if (((e = d(n)), e !== null)) {
            ((t.blockedOn = e),
              xf(t.priority, function () {
                n0(n);
              }));
            return;
          }
        } else if (e === 31) {
          if (((e = m(n)), e !== null)) {
            ((t.blockedOn = e),
              xf(t.priority, function () {
                n0(n);
              }));
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Xs(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = Rr(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var i = new n.constructor(n.type, n);
        ((Ru = i), n.target.dispatchEvent(i), (Ru = null));
      } else return ((e = Ea(n)), e !== null && e0(e), (t.blockedOn = n), !1);
      e.shift();
    }
    return !0;
  }
  function s0(t, e, n) {
    Xs(t) && n.delete(e);
  }
  function F1() {
    ((Or = !1),
      Gn !== null && Xs(Gn) && (Gn = null),
      Xn !== null && Xs(Xn) && (Xn = null),
      Zn !== null && Xs(Zn) && (Zn = null),
      ul.forEach(s0),
      ol.forEach(s0));
  }
  function Zs(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null),
      Or ||
        ((Or = !0),
        a.unstable_scheduleCallback(a.unstable_NormalPriority, F1)));
  }
  var Qs = null;
  function u0(t) {
    Qs !== t &&
      ((Qs = t),
      a.unstable_scheduleCallback(a.unstable_NormalPriority, function () {
        Qs === t && (Qs = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e],
            i = t[e + 1],
            s = t[e + 2];
          if (typeof i != "function") {
            if (_r(i || n) === null) continue;
            break;
          }
          var r = Ea(n);
          r !== null &&
            (t.splice(e, 3),
            (e -= 3),
            Ro(r, { pending: !0, data: s, method: n.method, action: i }, i, s));
        }
      }));
  }
  function li(t) {
    function e(S) {
      return Zs(S, t);
    }
    (Gn !== null && Zs(Gn, t),
      Xn !== null && Zs(Xn, t),
      Zn !== null && Zs(Zn, t),
      ul.forEach(e),
      ol.forEach(e));
    for (var n = 0; n < Qn.length; n++) {
      var i = Qn[n];
      i.blockedOn === t && (i.blockedOn = null);
    }
    for (; 0 < Qn.length && ((n = Qn[0]), n.blockedOn === null); )
      (l0(n), n.blockedOn === null && Qn.shift());
    if (((n = (t.ownerDocument || t).$$reactFormReplay), n != null))
      for (i = 0; i < n.length; i += 3) {
        var s = n[i],
          r = n[i + 1],
          f = s[re] || null;
        if (typeof r == "function") f || u0(n);
        else if (f) {
          var y = null;
          if (r && r.hasAttribute("formAction")) {
            if (((s = r), (f = r[re] || null))) y = f.formAction;
            else if (_r(s) !== null) continue;
          } else y = f.action;
          (typeof y == "function" ? (n[i + 1] = y) : (n.splice(i, 3), (i -= 3)),
            u0(n));
        }
      }
  }
  function o0() {
    function t(r) {
      r.canIntercept &&
        r.info === "react-transition" &&
        r.intercept({
          handler: function () {
            return new Promise(function (f) {
              return (s = f);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function e() {
      (s !== null && (s(), (s = null)), i || setTimeout(n, 20));
    }
    function n() {
      if (!i && !navigation.transition) {
        var r = navigation.currentEntry;
        r &&
          r.url != null &&
          navigation.navigate(r.url, {
            state: r.getState(),
            info: "react-transition",
            history: "replace",
          });
      }
    }
    if (typeof navigation == "object") {
      var i = !1,
        s = null;
      return (
        navigation.addEventListener("navigate", t),
        navigation.addEventListener("navigatesuccess", e),
        navigation.addEventListener("navigateerror", e),
        setTimeout(n, 100),
        function () {
          ((i = !0),
            navigation.removeEventListener("navigate", t),
            navigation.removeEventListener("navigatesuccess", e),
            navigation.removeEventListener("navigateerror", e),
            s !== null && (s(), (s = null)));
        }
      );
    }
  }
  function Vr(t) {
    this._internalRoot = t;
  }
  ((Ks.prototype.render = Vr.prototype.render =
    function (t) {
      var e = this._internalRoot;
      if (e === null) throw Error(o(409));
      var n = e.current,
        i = Me();
      Im(n, i, t, e, null, null);
    }),
    (Ks.prototype.unmount = Vr.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var e = t.containerInfo;
          (Im(t.current, 2, null, t, null, null), Ds(), (e[Ta] = null));
        }
      }));
  function Ks(t) {
    this._internalRoot = t;
  }
  Ks.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = vf();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < Qn.length && e !== 0 && e < Qn[n].priority; n++);
      (Qn.splice(n, 0, t), n === 0 && l0(t));
    }
  };
  var r0 = l.version;
  if (r0 !== "19.2.4") throw Error(o(527, r0, "19.2.4"));
  X.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function"
        ? Error(o(188))
        : ((t = Object.keys(t).join(",")), Error(o(268, t)));
    return (
      (t = p(e)),
      (t = t !== null ? v(t) : null),
      (t = t === null ? null : t.stateNode),
      t
    );
  };
  var W1 = {
    bundleType: 0,
    version: "19.2.4",
    rendererPackageName: "react-dom",
    currentDispatcherRef: _,
    reconcilerVersion: "19.2.4",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ks = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ks.isDisabled && ks.supportsFiber)
      try {
        ((vi = ks.inject(W1)), (ge = ks));
      } catch {}
  }
  return (
    (fl.createRoot = function (t, e) {
      if (!c(t)) throw Error(o(299));
      var n = !1,
        i = "",
        s = yh,
        r = gh,
        f = vh;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (n = !0),
          e.identifierPrefix !== void 0 && (i = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (s = e.onUncaughtError),
          e.onCaughtError !== void 0 && (r = e.onCaughtError),
          e.onRecoverableError !== void 0 && (f = e.onRecoverableError)),
        (e = Pm(t, 1, !1, null, null, n, i, null, s, r, f, o0)),
        (t[Ta] = e.current),
        yr(t),
        new Vr(e)
      );
    }),
    (fl.hydrateRoot = function (t, e, n) {
      if (!c(t)) throw Error(o(299));
      var i = !1,
        s = "",
        r = yh,
        f = gh,
        y = vh,
        S = null;
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (i = !0),
          n.identifierPrefix !== void 0 && (s = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (r = n.onUncaughtError),
          n.onCaughtError !== void 0 && (f = n.onCaughtError),
          n.onRecoverableError !== void 0 && (y = n.onRecoverableError),
          n.formState !== void 0 && (S = n.formState)),
        (e = Pm(t, 1, !0, e, n ?? null, i, s, S, r, f, y, o0)),
        (e.context = $m(null)),
        (n = e.current),
        (i = Me()),
        (i = Eu(i)),
        (s = wn(i)),
        (s.callback = null),
        zn(n, s, i),
        (n = i),
        (e.current.lanes = n),
        bi(e, n),
        Pe(e),
        (t[Ta] = e.current),
        yr(t),
        new Ks(e)
      );
    }),
    (fl.version = "19.2.4"),
    fl
  );
}
var x0;
function sx() {
  if (x0) return Lr.exports;
  x0 = 1;
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return (a(), (Lr.exports = lx()), Lr.exports);
}
var ux = sx();
const zc = Y.createContext({});
function Rc(a) {
  const l = Y.useRef(null);
  return (l.current === null && (l.current = a()), l.current);
}
const ox = typeof window < "u",
  Hp = ox ? Y.useLayoutEffect : Y.useEffect,
  du = Y.createContext(null);
function _c(a, l) {
  a.indexOf(l) === -1 && a.push(l);
}
function iu(a, l) {
  const u = a.indexOf(l);
  u > -1 && a.splice(u, 1);
}
const tn = (a, l, u) => (u > l ? l : u < a ? a : u);
let Oc = () => {};
const bn = {},
  qp = (a) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(a);
function Yp(a) {
  return typeof a == "object" && a !== null;
}
const Gp = (a) => /^0[^.\s]+$/u.test(a);
function Xp(a) {
  let l;
  return () => (l === void 0 && (l = a()), l);
}
const He = (a) => a,
  rx = (a, l) => (u) => l(a(u)),
  Dl = (...a) => a.reduce(rx),
  bl = (a, l, u) => {
    const o = l - a;
    return o === 0 ? 1 : (u - a) / o;
  };
class Vc {
  constructor() {
    this.subscriptions = [];
  }
  add(l) {
    return (_c(this.subscriptions, l), () => iu(this.subscriptions, l));
  }
  notify(l, u, o) {
    const c = this.subscriptions.length;
    if (c)
      if (c === 1) this.subscriptions[0](l, u, o);
      else
        for (let h = 0; h < c; h++) {
          const d = this.subscriptions[h];
          d && d(l, u, o);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Ke = (a) => a * 1e3,
  Le = (a) => a / 1e3;
function Zp(a, l) {
  return l ? a * (1e3 / l) : 0;
}
const Qp = (a, l, u) =>
    (((1 - 3 * u + 3 * l) * a + (3 * u - 6 * l)) * a + 3 * l) * a,
  cx = 1e-7,
  fx = 12;
function dx(a, l, u, o, c) {
  let h,
    d,
    m = 0;
  do ((d = l + (u - l) / 2), (h = Qp(d, o, c) - a), h > 0 ? (u = d) : (l = d));
  while (Math.abs(h) > cx && ++m < fx);
  return d;
}
function Nl(a, l, u, o) {
  if (a === l && u === o) return He;
  const c = (h) => dx(h, 0, 1, a, u);
  return (h) => (h === 0 || h === 1 ? h : Qp(c(h), l, o));
}
const Kp = (a) => (l) => (l <= 0.5 ? a(2 * l) / 2 : (2 - a(2 * (1 - l))) / 2),
  kp = (a) => (l) => 1 - a(1 - l),
  Jp = Nl(0.33, 1.53, 0.69, 0.99),
  Uc = kp(Jp),
  Fp = Kp(Uc),
  Wp = (a) =>
    (a *= 2) < 1 ? 0.5 * Uc(a) : 0.5 * (2 - Math.pow(2, -10 * (a - 1))),
  Bc = (a) => 1 - Math.sin(Math.acos(a)),
  Pp = kp(Bc),
  $p = Kp(Bc),
  hx = Nl(0.42, 0, 1, 1),
  mx = Nl(0, 0, 0.58, 1),
  Ip = Nl(0.42, 0, 0.58, 1),
  px = (a) => Array.isArray(a) && typeof a[0] != "number",
  ty = (a) => Array.isArray(a) && typeof a[0] == "number",
  yx = {
    linear: He,
    easeIn: hx,
    easeInOut: Ip,
    easeOut: mx,
    circIn: Bc,
    circInOut: $p,
    circOut: Pp,
    backIn: Uc,
    backInOut: Fp,
    backOut: Jp,
    anticipate: Wp,
  },
  gx = (a) => typeof a == "string",
  b0 = (a) => {
    if (ty(a)) {
      Oc(a.length === 4);
      const [l, u, o, c] = a;
      return Nl(l, u, o, c);
    } else if (gx(a)) return yx[a];
    return a;
  },
  Js = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender",
  ];
function vx(a, l) {
  let u = new Set(),
    o = new Set(),
    c = !1,
    h = !1;
  const d = new WeakSet();
  let m = { delta: 0, timestamp: 0, isProcessing: !1 };
  function g(v) {
    (d.has(v) && (p.schedule(v), a()), v(m));
  }
  const p = {
    schedule: (v, b = !1, T = !1) => {
      const z = T && c ? u : o;
      return (b && d.add(v), z.has(v) || z.add(v), v);
    },
    cancel: (v) => {
      (o.delete(v), d.delete(v));
    },
    process: (v) => {
      if (((m = v), c)) {
        h = !0;
        return;
      }
      ((c = !0),
        ([u, o] = [o, u]),
        u.forEach(g),
        u.clear(),
        (c = !1),
        h && ((h = !1), p.process(v)));
    },
  };
  return p;
}
const xx = 40;
function ey(a, l) {
  let u = !1,
    o = !0;
  const c = { delta: 0, timestamp: 0, isProcessing: !1 },
    h = () => (u = !0),
    d = Js.reduce((L, Z) => ((L[Z] = vx(h)), L), {}),
    {
      setup: m,
      read: g,
      resolveKeyframes: p,
      preUpdate: v,
      update: b,
      preRender: T,
      render: C,
      postRender: z,
    } = d,
    B = () => {
      const L = bn.useManualTiming ? c.timestamp : performance.now();
      ((u = !1),
        bn.useManualTiming ||
          (c.delta = o ? 1e3 / 60 : Math.max(Math.min(L - c.timestamp, xx), 1)),
        (c.timestamp = L),
        (c.isProcessing = !0),
        m.process(c),
        g.process(c),
        p.process(c),
        v.process(c),
        b.process(c),
        T.process(c),
        C.process(c),
        z.process(c),
        (c.isProcessing = !1),
        u && l && ((o = !1), a(B)));
    },
    H = () => {
      ((u = !0), (o = !0), c.isProcessing || a(B));
    };
  return {
    schedule: Js.reduce((L, Z) => {
      const Q = d[Z];
      return (
        (L[Z] = (nt, P = !1, $ = !1) => (u || H(), Q.schedule(nt, P, $))),
        L
      );
    }, {}),
    cancel: (L) => {
      for (let Z = 0; Z < Js.length; Z++) d[Js[Z]].cancel(L);
    },
    state: c,
    steps: d,
  };
}
const {
  schedule: Nt,
  cancel: Wn,
  state: ee,
  steps: Gr,
} = ey(typeof requestAnimationFrame < "u" ? requestAnimationFrame : He, !0);
let $s;
function bx() {
  $s = void 0;
}
const se = {
    now: () => (
      $s === void 0 &&
        se.set(
          ee.isProcessing || bn.useManualTiming
            ? ee.timestamp
            : performance.now(),
        ),
      $s
    ),
    set: (a) => {
      (($s = a), queueMicrotask(bx));
    },
  },
  ny = (a) => (l) => typeof l == "string" && l.startsWith(a),
  ay = ny("--"),
  Sx = ny("var(--"),
  Lc = (a) => (Sx(a) ? Tx.test(a.split("/*")[0].trim()) : !1),
  Tx =
    /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function S0(a) {
  return typeof a != "string" ? !1 : a.split("/*")[0].includes("var(--");
}
const mi = {
    test: (a) => typeof a == "number",
    parse: parseFloat,
    transform: (a) => a,
  },
  Sl = { ...mi, transform: (a) => tn(0, 1, a) },
  Fs = { ...mi, default: 1 },
  pl = (a) => Math.round(a * 1e5) / 1e5,
  Hc = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Ax(a) {
  return a == null;
}
const Ex =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  qc = (a, l) => (u) =>
    !!(
      (typeof u == "string" && Ex.test(u) && u.startsWith(a)) ||
      (l && !Ax(u) && Object.prototype.hasOwnProperty.call(u, l))
    ),
  iy = (a, l, u) => (o) => {
    if (typeof o != "string") return o;
    const [c, h, d, m] = o.match(Hc);
    return {
      [a]: parseFloat(c),
      [l]: parseFloat(h),
      [u]: parseFloat(d),
      alpha: m !== void 0 ? parseFloat(m) : 1,
    };
  },
  Mx = (a) => tn(0, 255, a),
  Xr = { ...mi, transform: (a) => Math.round(Mx(a)) },
  xa = {
    test: qc("rgb", "red"),
    parse: iy("red", "green", "blue"),
    transform: ({ red: a, green: l, blue: u, alpha: o = 1 }) =>
      "rgba(" +
      Xr.transform(a) +
      ", " +
      Xr.transform(l) +
      ", " +
      Xr.transform(u) +
      ", " +
      pl(Sl.transform(o)) +
      ")",
  };
function Dx(a) {
  let l = "",
    u = "",
    o = "",
    c = "";
  return (
    a.length > 5
      ? ((l = a.substring(1, 3)),
        (u = a.substring(3, 5)),
        (o = a.substring(5, 7)),
        (c = a.substring(7, 9)))
      : ((l = a.substring(1, 2)),
        (u = a.substring(2, 3)),
        (o = a.substring(3, 4)),
        (c = a.substring(4, 5)),
        (l += l),
        (u += u),
        (o += o),
        (c += c)),
    {
      red: parseInt(l, 16),
      green: parseInt(u, 16),
      blue: parseInt(o, 16),
      alpha: c ? parseInt(c, 16) / 255 : 1,
    }
  );
}
const lc = { test: qc("#"), parse: Dx, transform: xa.transform },
  jl = (a) => ({
    test: (l) =>
      typeof l == "string" && l.endsWith(a) && l.split(" ").length === 1,
    parse: parseFloat,
    transform: (l) => `${l}${a}`,
  }),
  kn = jl("deg"),
  Ie = jl("%"),
  F = jl("px"),
  Nx = jl("vh"),
  jx = jl("vw"),
  T0 = {
    ...Ie,
    parse: (a) => Ie.parse(a) / 100,
    transform: (a) => Ie.transform(a * 100),
  },
  ui = {
    test: qc("hsl", "hue"),
    parse: iy("hue", "saturation", "lightness"),
    transform: ({ hue: a, saturation: l, lightness: u, alpha: o = 1 }) =>
      "hsla(" +
      Math.round(a) +
      ", " +
      Ie.transform(pl(l)) +
      ", " +
      Ie.transform(pl(u)) +
      ", " +
      pl(Sl.transform(o)) +
      ")",
  },
  Xt = {
    test: (a) => xa.test(a) || lc.test(a) || ui.test(a),
    parse: (a) =>
      xa.test(a) ? xa.parse(a) : ui.test(a) ? ui.parse(a) : lc.parse(a),
    transform: (a) =>
      typeof a == "string"
        ? a
        : a.hasOwnProperty("red")
          ? xa.transform(a)
          : ui.transform(a),
    getAnimatableNone: (a) => {
      const l = Xt.parse(a);
      return ((l.alpha = 0), Xt.transform(l));
    },
  },
  Cx =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function wx(a) {
  var l, u;
  return (
    isNaN(a) &&
    typeof a == "string" &&
    (((l = a.match(Hc)) == null ? void 0 : l.length) || 0) +
      (((u = a.match(Cx)) == null ? void 0 : u.length) || 0) >
      0
  );
}
const ly = "number",
  sy = "color",
  zx = "var",
  Rx = "var(",
  A0 = "${}",
  _x =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Tl(a) {
  const l = a.toString(),
    u = [],
    o = { color: [], number: [], var: [] },
    c = [];
  let h = 0;
  const m = l
    .replace(
      _x,
      (g) => (
        Xt.test(g)
          ? (o.color.push(h), c.push(sy), u.push(Xt.parse(g)))
          : g.startsWith(Rx)
            ? (o.var.push(h), c.push(zx), u.push(g))
            : (o.number.push(h), c.push(ly), u.push(parseFloat(g))),
        ++h,
        A0
      ),
    )
    .split(A0);
  return { values: u, split: m, indexes: o, types: c };
}
function uy(a) {
  return Tl(a).values;
}
function oy(a) {
  const { split: l, types: u } = Tl(a),
    o = l.length;
  return (c) => {
    let h = "";
    for (let d = 0; d < o; d++)
      if (((h += l[d]), c[d] !== void 0)) {
        const m = u[d];
        m === ly
          ? (h += pl(c[d]))
          : m === sy
            ? (h += Xt.transform(c[d]))
            : (h += c[d]);
      }
    return h;
  };
}
const Ox = (a) =>
  typeof a == "number" ? 0 : Xt.test(a) ? Xt.getAnimatableNone(a) : a;
function Vx(a) {
  const l = uy(a);
  return oy(a)(l.map(Ox));
}
const ke = {
  test: wx,
  parse: uy,
  createTransformer: oy,
  getAnimatableNone: Vx,
};
function Zr(a, l, u) {
  return (
    u < 0 && (u += 1),
    u > 1 && (u -= 1),
    u < 1 / 6
      ? a + (l - a) * 6 * u
      : u < 1 / 2
        ? l
        : u < 2 / 3
          ? a + (l - a) * (2 / 3 - u) * 6
          : a
  );
}
function Ux({ hue: a, saturation: l, lightness: u, alpha: o }) {
  ((a /= 360), (l /= 100), (u /= 100));
  let c = 0,
    h = 0,
    d = 0;
  if (!l) c = h = d = u;
  else {
    const m = u < 0.5 ? u * (1 + l) : u + l - u * l,
      g = 2 * u - m;
    ((c = Zr(g, m, a + 1 / 3)), (h = Zr(g, m, a)), (d = Zr(g, m, a - 1 / 3)));
  }
  return {
    red: Math.round(c * 255),
    green: Math.round(h * 255),
    blue: Math.round(d * 255),
    alpha: o,
  };
}
function lu(a, l) {
  return (u) => (u > 0 ? l : a);
}
const Rt = (a, l, u) => a + (l - a) * u,
  Qr = (a, l, u) => {
    const o = a * a,
      c = u * (l * l - o) + o;
    return c < 0 ? 0 : Math.sqrt(c);
  },
  Bx = [lc, xa, ui],
  Lx = (a) => Bx.find((l) => l.test(a));
function E0(a) {
  const l = Lx(a);
  if (!l) return !1;
  let u = l.parse(a);
  return (l === ui && (u = Ux(u)), u);
}
const M0 = (a, l) => {
    const u = E0(a),
      o = E0(l);
    if (!u || !o) return lu(a, l);
    const c = { ...u };
    return (h) => (
      (c.red = Qr(u.red, o.red, h)),
      (c.green = Qr(u.green, o.green, h)),
      (c.blue = Qr(u.blue, o.blue, h)),
      (c.alpha = Rt(u.alpha, o.alpha, h)),
      xa.transform(c)
    );
  },
  sc = new Set(["none", "hidden"]);
function Hx(a, l) {
  return sc.has(a) ? (u) => (u <= 0 ? a : l) : (u) => (u >= 1 ? l : a);
}
function qx(a, l) {
  return (u) => Rt(a, l, u);
}
function Yc(a) {
  return typeof a == "number"
    ? qx
    : typeof a == "string"
      ? Lc(a)
        ? lu
        : Xt.test(a)
          ? M0
          : Xx
      : Array.isArray(a)
        ? ry
        : typeof a == "object"
          ? Xt.test(a)
            ? M0
            : Yx
          : lu;
}
function ry(a, l) {
  const u = [...a],
    o = u.length,
    c = a.map((h, d) => Yc(h)(h, l[d]));
  return (h) => {
    for (let d = 0; d < o; d++) u[d] = c[d](h);
    return u;
  };
}
function Yx(a, l) {
  const u = { ...a, ...l },
    o = {};
  for (const c in u)
    a[c] !== void 0 && l[c] !== void 0 && (o[c] = Yc(a[c])(a[c], l[c]));
  return (c) => {
    for (const h in o) u[h] = o[h](c);
    return u;
  };
}
function Gx(a, l) {
  const u = [],
    o = { color: 0, var: 0, number: 0 };
  for (let c = 0; c < l.values.length; c++) {
    const h = l.types[c],
      d = a.indexes[h][o[h]],
      m = a.values[d] ?? 0;
    ((u[c] = m), o[h]++);
  }
  return u;
}
const Xx = (a, l) => {
  const u = ke.createTransformer(l),
    o = Tl(a),
    c = Tl(l);
  return o.indexes.var.length === c.indexes.var.length &&
    o.indexes.color.length === c.indexes.color.length &&
    o.indexes.number.length >= c.indexes.number.length
    ? (sc.has(a) && !c.values.length) || (sc.has(l) && !o.values.length)
      ? Hx(a, l)
      : Dl(ry(Gx(o, c), c.values), u)
    : lu(a, l);
};
function cy(a, l, u) {
  return typeof a == "number" && typeof l == "number" && typeof u == "number"
    ? Rt(a, l, u)
    : Yc(a)(a, l);
}
const Zx = (a) => {
    const l = ({ timestamp: u }) => a(u);
    return {
      start: (u = !0) => Nt.update(l, u),
      stop: () => Wn(l),
      now: () => (ee.isProcessing ? ee.timestamp : se.now()),
    };
  },
  fy = (a, l, u = 10) => {
    let o = "";
    const c = Math.max(Math.round(l / u), 2);
    for (let h = 0; h < c; h++)
      o += Math.round(a(h / (c - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${o.substring(0, o.length - 2)})`;
  },
  su = 2e4;
function Gc(a) {
  let l = 0;
  const u = 50;
  let o = a.next(l);
  for (; !o.done && l < su; ) ((l += u), (o = a.next(l)));
  return l >= su ? 1 / 0 : l;
}
function Qx(a, l = 100, u) {
  const o = u({ ...a, keyframes: [0, l] }),
    c = Math.min(Gc(o), su);
  return {
    type: "keyframes",
    ease: (h) => o.next(c * h).value / l,
    duration: Le(c),
  };
}
const Kx = 5;
function dy(a, l, u) {
  const o = Math.max(l - Kx, 0);
  return Zp(u - a(o), l - o);
}
const Vt = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: { granular: 0.01, default: 2 },
    restDelta: { granular: 0.005, default: 0.5 },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1,
  },
  Kr = 0.001;
function kx({
  duration: a = Vt.duration,
  bounce: l = Vt.bounce,
  velocity: u = Vt.velocity,
  mass: o = Vt.mass,
}) {
  let c,
    h,
    d = 1 - l;
  ((d = tn(Vt.minDamping, Vt.maxDamping, d)),
    (a = tn(Vt.minDuration, Vt.maxDuration, Le(a))),
    d < 1
      ? ((c = (p) => {
          const v = p * d,
            b = v * a,
            T = v - u,
            C = uc(p, d),
            z = Math.exp(-b);
          return Kr - (T / C) * z;
        }),
        (h = (p) => {
          const b = p * d * a,
            T = b * u + u,
            C = Math.pow(d, 2) * Math.pow(p, 2) * a,
            z = Math.exp(-b),
            B = uc(Math.pow(p, 2), d);
          return ((-c(p) + Kr > 0 ? -1 : 1) * ((T - C) * z)) / B;
        }))
      : ((c = (p) => {
          const v = Math.exp(-p * a),
            b = (p - u) * a + 1;
          return -Kr + v * b;
        }),
        (h = (p) => {
          const v = Math.exp(-p * a),
            b = (u - p) * (a * a);
          return v * b;
        })));
  const m = 5 / a,
    g = Fx(c, h, m);
  if (((a = Ke(a)), isNaN(g)))
    return { stiffness: Vt.stiffness, damping: Vt.damping, duration: a };
  {
    const p = Math.pow(g, 2) * o;
    return { stiffness: p, damping: d * 2 * Math.sqrt(o * p), duration: a };
  }
}
const Jx = 12;
function Fx(a, l, u) {
  let o = u;
  for (let c = 1; c < Jx; c++) o = o - a(o) / l(o);
  return o;
}
function uc(a, l) {
  return a * Math.sqrt(1 - l * l);
}
const Wx = ["duration", "bounce"],
  Px = ["stiffness", "damping", "mass"];
function D0(a, l) {
  return l.some((u) => a[u] !== void 0);
}
function $x(a) {
  let l = {
    velocity: Vt.velocity,
    stiffness: Vt.stiffness,
    damping: Vt.damping,
    mass: Vt.mass,
    isResolvedFromDuration: !1,
    ...a,
  };
  if (!D0(a, Px) && D0(a, Wx))
    if (((l.velocity = 0), a.visualDuration)) {
      const u = a.visualDuration,
        o = (2 * Math.PI) / (u * 1.2),
        c = o * o,
        h = 2 * tn(0.05, 1, 1 - (a.bounce || 0)) * Math.sqrt(c);
      l = { ...l, mass: Vt.mass, stiffness: c, damping: h };
    } else {
      const u = kx({ ...a, velocity: 0 });
      ((l = { ...l, ...u, mass: Vt.mass }), (l.isResolvedFromDuration = !0));
    }
  return l;
}
function uu(a = Vt.visualDuration, l = Vt.bounce) {
  const u =
    typeof a != "object"
      ? { visualDuration: a, keyframes: [0, 1], bounce: l }
      : a;
  let { restSpeed: o, restDelta: c } = u;
  const h = u.keyframes[0],
    d = u.keyframes[u.keyframes.length - 1],
    m = { done: !1, value: h },
    {
      stiffness: g,
      damping: p,
      mass: v,
      duration: b,
      velocity: T,
      isResolvedFromDuration: C,
    } = $x({ ...u, velocity: -Le(u.velocity || 0) }),
    z = T || 0,
    B = p / (2 * Math.sqrt(g * v)),
    H = d - h,
    q = Le(Math.sqrt(g / v)),
    G = Math.abs(H) < 5;
  (o || (o = G ? Vt.restSpeed.granular : Vt.restSpeed.default),
    c || (c = G ? Vt.restDelta.granular : Vt.restDelta.default));
  let L;
  if (B < 1) {
    const Q = uc(q, B);
    L = (nt) => {
      const P = Math.exp(-B * q * nt);
      return (
        d -
        P * (((z + B * q * H) / Q) * Math.sin(Q * nt) + H * Math.cos(Q * nt))
      );
    };
  } else if (B === 1) L = (Q) => d - Math.exp(-q * Q) * (H + (z + q * H) * Q);
  else {
    const Q = q * Math.sqrt(B * B - 1);
    L = (nt) => {
      const P = Math.exp(-B * q * nt),
        $ = Math.min(Q * nt, 300);
      return (
        d - (P * ((z + B * q * H) * Math.sinh($) + Q * H * Math.cosh($))) / Q
      );
    };
  }
  const Z = {
    calculatedDuration: (C && b) || null,
    next: (Q) => {
      const nt = L(Q);
      if (C) m.done = Q >= b;
      else {
        let P = Q === 0 ? z : 0;
        B < 1 && (P = Q === 0 ? Ke(z) : dy(L, Q, nt));
        const $ = Math.abs(P) <= o,
          at = Math.abs(d - nt) <= c;
        m.done = $ && at;
      }
      return ((m.value = m.done ? d : nt), m);
    },
    toString: () => {
      const Q = Math.min(Gc(Z), su),
        nt = fy((P) => Z.next(Q * P).value, Q, 30);
      return Q + "ms " + nt;
    },
    toTransition: () => {},
  };
  return Z;
}
uu.applyToOptions = (a) => {
  const l = Qx(a, 100, uu);
  return (
    (a.ease = l.ease),
    (a.duration = Ke(l.duration)),
    (a.type = "keyframes"),
    a
  );
};
function oc({
  keyframes: a,
  velocity: l = 0,
  power: u = 0.8,
  timeConstant: o = 325,
  bounceDamping: c = 10,
  bounceStiffness: h = 500,
  modifyTarget: d,
  min: m,
  max: g,
  restDelta: p = 0.5,
  restSpeed: v,
}) {
  const b = a[0],
    T = { done: !1, value: b },
    C = ($) => (m !== void 0 && $ < m) || (g !== void 0 && $ > g),
    z = ($) =>
      m === void 0
        ? g
        : g === void 0 || Math.abs(m - $) < Math.abs(g - $)
          ? m
          : g;
  let B = u * l;
  const H = b + B,
    q = d === void 0 ? H : d(H);
  q !== H && (B = q - b);
  const G = ($) => -B * Math.exp(-$ / o),
    L = ($) => q + G($),
    Z = ($) => {
      const at = G($),
        Dt = L($);
      ((T.done = Math.abs(at) <= p), (T.value = T.done ? q : Dt));
    };
  let Q, nt;
  const P = ($) => {
    C(T.value) &&
      ((Q = $),
      (nt = uu({
        keyframes: [T.value, z(T.value)],
        velocity: dy(L, $, T.value),
        damping: c,
        stiffness: h,
        restDelta: p,
        restSpeed: v,
      })));
  };
  return (
    P(0),
    {
      calculatedDuration: null,
      next: ($) => {
        let at = !1;
        return (
          !nt && Q === void 0 && ((at = !0), Z($), P($)),
          Q !== void 0 && $ >= Q ? nt.next($ - Q) : (!at && Z($), T)
        );
      },
    }
  );
}
function Ix(a, l, u) {
  const o = [],
    c = u || bn.mix || cy,
    h = a.length - 1;
  for (let d = 0; d < h; d++) {
    let m = c(a[d], a[d + 1]);
    if (l) {
      const g = Array.isArray(l) ? l[d] || He : l;
      m = Dl(g, m);
    }
    o.push(m);
  }
  return o;
}
function tb(a, l, { clamp: u = !0, ease: o, mixer: c } = {}) {
  const h = a.length;
  if ((Oc(h === l.length), h === 1)) return () => l[0];
  if (h === 2 && l[0] === l[1]) return () => l[1];
  const d = a[0] === a[1];
  a[0] > a[h - 1] && ((a = [...a].reverse()), (l = [...l].reverse()));
  const m = Ix(l, o, c),
    g = m.length,
    p = (v) => {
      if (d && v < a[0]) return l[0];
      let b = 0;
      if (g > 1) for (; b < a.length - 2 && !(v < a[b + 1]); b++);
      const T = bl(a[b], a[b + 1], v);
      return m[b](T);
    };
  return u ? (v) => p(tn(a[0], a[h - 1], v)) : p;
}
function eb(a, l) {
  const u = a[a.length - 1];
  for (let o = 1; o <= l; o++) {
    const c = bl(0, l, o);
    a.push(Rt(u, 1, c));
  }
}
function nb(a) {
  const l = [0];
  return (eb(l, a.length - 1), l);
}
function ab(a, l) {
  return a.map((u) => u * l);
}
function ib(a, l) {
  return a.map(() => l || Ip).splice(0, a.length - 1);
}
function yl({
  duration: a = 300,
  keyframes: l,
  times: u,
  ease: o = "easeInOut",
}) {
  const c = px(o) ? o.map(b0) : b0(o),
    h = { done: !1, value: l[0] },
    d = ab(u && u.length === l.length ? u : nb(l), a),
    m = tb(d, l, { ease: Array.isArray(c) ? c : ib(l, c) });
  return {
    calculatedDuration: a,
    next: (g) => ((h.value = m(g)), (h.done = g >= a), h),
  };
}
const lb = (a) => a !== null;
function Xc(a, { repeat: l, repeatType: u = "loop" }, o, c = 1) {
  const h = a.filter(lb),
    m = c < 0 || (l && u !== "loop" && l % 2 === 1) ? 0 : h.length - 1;
  return !m || o === void 0 ? h[m] : o;
}
const sb = { decay: oc, inertia: oc, tween: yl, keyframes: yl, spring: uu };
function hy(a) {
  typeof a.type == "string" && (a.type = sb[a.type]);
}
class Zc {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((l) => {
      this.resolve = l;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(l, u) {
    return this.finished.then(l, u);
  }
}
const ub = (a) => a / 100;
class Qc extends Zc {
  constructor(l) {
    (super(),
      (this.state = "idle"),
      (this.startTime = null),
      (this.isStopped = !1),
      (this.currentTime = 0),
      (this.holdTime = null),
      (this.playbackSpeed = 1),
      (this.stop = () => {
        var o, c;
        const { motionValue: u } = this.options;
        (u && u.updatedAt !== se.now() && this.tick(se.now()),
          (this.isStopped = !0),
          this.state !== "idle" &&
            (this.teardown(),
            (c = (o = this.options).onStop) == null || c.call(o)));
      }),
      (this.options = l),
      this.initAnimation(),
      this.play(),
      l.autoplay === !1 && this.pause());
  }
  initAnimation() {
    const { options: l } = this;
    hy(l);
    const {
      type: u = yl,
      repeat: o = 0,
      repeatDelay: c = 0,
      repeatType: h,
      velocity: d = 0,
    } = l;
    let { keyframes: m } = l;
    const g = u || yl;
    g !== yl &&
      typeof m[0] != "number" &&
      ((this.mixKeyframes = Dl(ub, cy(m[0], m[1]))), (m = [0, 100]));
    const p = g({ ...l, keyframes: m });
    (h === "mirror" &&
      (this.mirroredGenerator = g({
        ...l,
        keyframes: [...m].reverse(),
        velocity: -d,
      })),
      p.calculatedDuration === null && (p.calculatedDuration = Gc(p)));
    const { calculatedDuration: v } = p;
    ((this.calculatedDuration = v),
      (this.resolvedDuration = v + c),
      (this.totalDuration = this.resolvedDuration * (o + 1) - c),
      (this.generator = p));
  }
  updateTime(l) {
    const u = Math.round(l - this.startTime) * this.playbackSpeed;
    this.holdTime !== null
      ? (this.currentTime = this.holdTime)
      : (this.currentTime = u);
  }
  tick(l, u = !1) {
    const {
      generator: o,
      totalDuration: c,
      mixKeyframes: h,
      mirroredGenerator: d,
      resolvedDuration: m,
      calculatedDuration: g,
    } = this;
    if (this.startTime === null) return o.next(0);
    const {
      delay: p = 0,
      keyframes: v,
      repeat: b,
      repeatType: T,
      repeatDelay: C,
      type: z,
      onUpdate: B,
      finalKeyframe: H,
    } = this.options;
    (this.speed > 0
      ? (this.startTime = Math.min(this.startTime, l))
      : this.speed < 0 &&
        (this.startTime = Math.min(l - c / this.speed, this.startTime)),
      u ? (this.currentTime = l) : this.updateTime(l));
    const q = this.currentTime - p * (this.playbackSpeed >= 0 ? 1 : -1),
      G = this.playbackSpeed >= 0 ? q < 0 : q > c;
    ((this.currentTime = Math.max(q, 0)),
      this.state === "finished" &&
        this.holdTime === null &&
        (this.currentTime = c));
    let L = this.currentTime,
      Z = o;
    if (b) {
      const $ = Math.min(this.currentTime, c) / m;
      let at = Math.floor($),
        Dt = $ % 1;
      (!Dt && $ >= 1 && (Dt = 1),
        Dt === 1 && at--,
        (at = Math.min(at, b + 1)),
        !!(at % 2) &&
          (T === "reverse"
            ? ((Dt = 1 - Dt), C && (Dt -= C / m))
            : T === "mirror" && (Z = d)),
        (L = tn(0, 1, Dt) * m));
    }
    const Q = G ? { done: !1, value: v[0] } : Z.next(L);
    h && (Q.value = h(Q.value));
    let { done: nt } = Q;
    !G &&
      g !== null &&
      (nt =
        this.playbackSpeed >= 0
          ? this.currentTime >= c
          : this.currentTime <= 0);
    const P =
      this.holdTime === null &&
      (this.state === "finished" || (this.state === "running" && nt));
    return (
      P && z !== oc && (Q.value = Xc(v, this.options, H, this.speed)),
      B && B(Q.value),
      P && this.finish(),
      Q
    );
  }
  then(l, u) {
    return this.finished.then(l, u);
  }
  get duration() {
    return Le(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + Le(l);
  }
  get time() {
    return Le(this.currentTime);
  }
  set time(l) {
    var u;
    ((l = Ke(l)),
      (this.currentTime = l),
      this.startTime === null ||
      this.holdTime !== null ||
      this.playbackSpeed === 0
        ? (this.holdTime = l)
        : this.driver &&
          (this.startTime = this.driver.now() - l / this.playbackSpeed),
      (u = this.driver) == null || u.start(!1));
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(l) {
    this.updateTime(se.now());
    const u = this.playbackSpeed !== l;
    ((this.playbackSpeed = l), u && (this.time = Le(this.currentTime)));
  }
  play() {
    var c, h;
    if (this.isStopped) return;
    const { driver: l = Zx, startTime: u } = this.options;
    (this.driver || (this.driver = l((d) => this.tick(d))),
      (h = (c = this.options).onPlay) == null || h.call(c));
    const o = this.driver.now();
    (this.state === "finished"
      ? (this.updateFinished(), (this.startTime = o))
      : this.holdTime !== null
        ? (this.startTime = o - this.holdTime)
        : this.startTime || (this.startTime = u ?? o),
      this.state === "finished" &&
        this.speed < 0 &&
        (this.startTime += this.calculatedDuration),
      (this.holdTime = null),
      (this.state = "running"),
      this.driver.start());
  }
  pause() {
    ((this.state = "paused"),
      this.updateTime(se.now()),
      (this.holdTime = this.currentTime));
  }
  complete() {
    (this.state !== "running" && this.play(),
      (this.state = "finished"),
      (this.holdTime = null));
  }
  finish() {
    var l, u;
    (this.notifyFinished(),
      this.teardown(),
      (this.state = "finished"),
      (u = (l = this.options).onComplete) == null || u.call(l));
  }
  cancel() {
    var l, u;
    ((this.holdTime = null),
      (this.startTime = 0),
      this.tick(0),
      this.teardown(),
      (u = (l = this.options).onCancel) == null || u.call(l));
  }
  teardown() {
    ((this.state = "idle"),
      this.stopDriver(),
      (this.startTime = this.holdTime = null));
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(l) {
    return ((this.startTime = 0), this.tick(l, !0));
  }
  attachTimeline(l) {
    var u;
    return (
      this.options.allowFlatten &&
        ((this.options.type = "keyframes"),
        (this.options.ease = "linear"),
        this.initAnimation()),
      (u = this.driver) == null || u.stop(),
      l.observe(this)
    );
  }
}
function ob(a) {
  for (let l = 1; l < a.length; l++) a[l] ?? (a[l] = a[l - 1]);
}
const ba = (a) => (a * 180) / Math.PI,
  rc = (a) => {
    const l = ba(Math.atan2(a[1], a[0]));
    return cc(l);
  },
  rb = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (a) => (Math.abs(a[0]) + Math.abs(a[3])) / 2,
    rotate: rc,
    rotateZ: rc,
    skewX: (a) => ba(Math.atan(a[1])),
    skewY: (a) => ba(Math.atan(a[2])),
    skew: (a) => (Math.abs(a[1]) + Math.abs(a[2])) / 2,
  },
  cc = (a) => ((a = a % 360), a < 0 && (a += 360), a),
  N0 = rc,
  j0 = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]),
  C0 = (a) => Math.sqrt(a[4] * a[4] + a[5] * a[5]),
  cb = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: j0,
    scaleY: C0,
    scale: (a) => (j0(a) + C0(a)) / 2,
    rotateX: (a) => cc(ba(Math.atan2(a[6], a[5]))),
    rotateY: (a) => cc(ba(Math.atan2(-a[2], a[0]))),
    rotateZ: N0,
    rotate: N0,
    skewX: (a) => ba(Math.atan(a[4])),
    skewY: (a) => ba(Math.atan(a[1])),
    skew: (a) => (Math.abs(a[1]) + Math.abs(a[4])) / 2,
  };
function fc(a) {
  return a.includes("scale") ? 1 : 0;
}
function dc(a, l) {
  if (!a || a === "none") return fc(l);
  const u = a.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let o, c;
  if (u) ((o = cb), (c = u));
  else {
    const m = a.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((o = rb), (c = m));
  }
  if (!c) return fc(l);
  const h = o[l],
    d = c[1].split(",").map(db);
  return typeof h == "function" ? h(d) : d[h];
}
const fb = (a, l) => {
  const { transform: u = "none" } = getComputedStyle(a);
  return dc(u, l);
};
function db(a) {
  return parseFloat(a.trim());
}
const pi = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
  ],
  yi = new Set(pi),
  w0 = (a) => a === mi || a === F,
  hb = new Set(["x", "y", "z"]),
  mb = pi.filter((a) => !hb.has(a));
function pb(a) {
  const l = [];
  return (
    mb.forEach((u) => {
      const o = a.getValue(u);
      o !== void 0 &&
        (l.push([u, o.get()]), o.set(u.startsWith("scale") ? 1 : 0));
    }),
    l
  );
}
const Fn = {
  width: ({ x: a }, { paddingLeft: l = "0", paddingRight: u = "0" }) =>
    a.max - a.min - parseFloat(l) - parseFloat(u),
  height: ({ y: a }, { paddingTop: l = "0", paddingBottom: u = "0" }) =>
    a.max - a.min - parseFloat(l) - parseFloat(u),
  top: (a, { top: l }) => parseFloat(l),
  left: (a, { left: l }) => parseFloat(l),
  bottom: ({ y: a }, { top: l }) => parseFloat(l) + (a.max - a.min),
  right: ({ x: a }, { left: l }) => parseFloat(l) + (a.max - a.min),
  x: (a, { transform: l }) => dc(l, "x"),
  y: (a, { transform: l }) => dc(l, "y"),
};
Fn.translateX = Fn.x;
Fn.translateY = Fn.y;
const Sa = new Set();
let hc = !1,
  mc = !1,
  pc = !1;
function my() {
  if (mc) {
    const a = Array.from(Sa).filter((o) => o.needsMeasurement),
      l = new Set(a.map((o) => o.element)),
      u = new Map();
    (l.forEach((o) => {
      const c = pb(o);
      c.length && (u.set(o, c), o.render());
    }),
      a.forEach((o) => o.measureInitialState()),
      l.forEach((o) => {
        o.render();
        const c = u.get(o);
        c &&
          c.forEach(([h, d]) => {
            var m;
            (m = o.getValue(h)) == null || m.set(d);
          });
      }),
      a.forEach((o) => o.measureEndState()),
      a.forEach((o) => {
        o.suspendedScrollY !== void 0 && window.scrollTo(0, o.suspendedScrollY);
      }));
  }
  ((mc = !1), (hc = !1), Sa.forEach((a) => a.complete(pc)), Sa.clear());
}
function py() {
  Sa.forEach((a) => {
    (a.readKeyframes(), a.needsMeasurement && (mc = !0));
  });
}
function yb() {
  ((pc = !0), py(), my(), (pc = !1));
}
class Kc {
  constructor(l, u, o, c, h, d = !1) {
    ((this.state = "pending"),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.unresolvedKeyframes = [...l]),
      (this.onComplete = u),
      (this.name = o),
      (this.motionValue = c),
      (this.element = h),
      (this.isAsync = d));
  }
  scheduleResolve() {
    ((this.state = "scheduled"),
      this.isAsync
        ? (Sa.add(this),
          hc || ((hc = !0), Nt.read(py), Nt.resolveKeyframes(my)))
        : (this.readKeyframes(), this.complete()));
  }
  readKeyframes() {
    const {
      unresolvedKeyframes: l,
      name: u,
      element: o,
      motionValue: c,
    } = this;
    if (l[0] === null) {
      const h = c == null ? void 0 : c.get(),
        d = l[l.length - 1];
      if (h !== void 0) l[0] = h;
      else if (o && u) {
        const m = o.readValue(u, d);
        m != null && (l[0] = m);
      }
      (l[0] === void 0 && (l[0] = d), c && h === void 0 && c.set(l[0]));
    }
    ob(l);
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete(l = !1) {
    ((this.state = "complete"),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, l),
      Sa.delete(this));
  }
  cancel() {
    this.state === "scheduled" && (Sa.delete(this), (this.state = "pending"));
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const gb = (a) => a.startsWith("--");
function vb(a, l, u) {
  gb(l) ? a.style.setProperty(l, u) : (a.style[l] = u);
}
const xb = {};
function yy(a, l) {
  const u = Xp(a);
  return () => xb[l] ?? u();
}
const bb = yy(() => window.ScrollTimeline !== void 0, "scrollTimeline"),
  gy = yy(() => {
    try {
      document
        .createElement("div")
        .animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch {
      return !1;
    }
    return !0;
  }, "linearEasing"),
  ml = ([a, l, u, o]) => `cubic-bezier(${a}, ${l}, ${u}, ${o})`,
  z0 = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: ml([0, 0.65, 0.55, 1]),
    circOut: ml([0.55, 0, 1, 0.45]),
    backIn: ml([0.31, 0.01, 0.66, -0.59]),
    backOut: ml([0.33, 1.53, 0.69, 0.99]),
  };
function vy(a, l) {
  if (a)
    return typeof a == "function"
      ? gy()
        ? fy(a, l)
        : "ease-out"
      : ty(a)
        ? ml(a)
        : Array.isArray(a)
          ? a.map((u) => vy(u, l) || z0.easeOut)
          : z0[a];
}
function Sb(
  a,
  l,
  u,
  {
    delay: o = 0,
    duration: c = 300,
    repeat: h = 0,
    repeatType: d = "loop",
    ease: m = "easeOut",
    times: g,
  } = {},
  p = void 0,
) {
  const v = { [l]: u };
  g && (v.offset = g);
  const b = vy(m, c);
  Array.isArray(b) && (v.easing = b);
  const T = {
    delay: o,
    duration: c,
    easing: Array.isArray(b) ? "linear" : b,
    fill: "both",
    iterations: h + 1,
    direction: d === "reverse" ? "alternate" : "normal",
  };
  return (p && (T.pseudoElement = p), a.animate(v, T));
}
function xy(a) {
  return typeof a == "function" && "applyToOptions" in a;
}
function Tb({ type: a, ...l }) {
  return xy(a) && gy()
    ? a.applyToOptions(l)
    : (l.duration ?? (l.duration = 300), l.ease ?? (l.ease = "easeOut"), l);
}
class by extends Zc {
  constructor(l) {
    if (
      (super(),
      (this.finishedTime = null),
      (this.isStopped = !1),
      (this.manualStartTime = null),
      !l)
    )
      return;
    const {
      element: u,
      name: o,
      keyframes: c,
      pseudoElement: h,
      allowFlatten: d = !1,
      finalKeyframe: m,
      onComplete: g,
    } = l;
    ((this.isPseudoElement = !!h),
      (this.allowFlatten = d),
      (this.options = l),
      Oc(typeof l.type != "string"));
    const p = Tb(l);
    ((this.animation = Sb(u, o, c, p, h)),
      p.autoplay === !1 && this.animation.pause(),
      (this.animation.onfinish = () => {
        if (((this.finishedTime = this.time), !h)) {
          const v = Xc(c, this.options, m, this.speed);
          (this.updateMotionValue && this.updateMotionValue(v),
            vb(u, o, v),
            this.animation.cancel());
        }
        (g == null || g(), this.notifyFinished());
      }));
  }
  play() {
    this.isStopped ||
      ((this.manualStartTime = null),
      this.animation.play(),
      this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var l, u;
    (u = (l = this.animation).finish) == null || u.call(l);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {}
  }
  stop() {
    if (this.isStopped) return;
    this.isStopped = !0;
    const { state: l } = this;
    l === "idle" ||
      l === "finished" ||
      (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
      this.isPseudoElement || this.cancel());
  }
  commitStyles() {
    var u, o, c;
    const l = (u = this.options) == null ? void 0 : u.element;
    !this.isPseudoElement &&
      l != null &&
      l.isConnected &&
      ((c = (o = this.animation).commitStyles) == null || c.call(o));
  }
  get duration() {
    var u, o;
    const l =
      ((o =
        (u = this.animation.effect) == null ? void 0 : u.getComputedTiming) ==
      null
        ? void 0
        : o.call(u).duration) || 0;
    return Le(Number(l));
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + Le(l);
  }
  get time() {
    return Le(Number(this.animation.currentTime) || 0);
  }
  set time(l) {
    ((this.manualStartTime = null),
      (this.finishedTime = null),
      (this.animation.currentTime = Ke(l)));
  }
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(l) {
    (l < 0 && (this.finishedTime = null), (this.animation.playbackRate = l));
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(l) {
    this.manualStartTime = this.animation.startTime = l;
  }
  attachTimeline({ timeline: l, observe: u }) {
    var o;
    return (
      this.allowFlatten &&
        ((o = this.animation.effect) == null ||
          o.updateTiming({ easing: "linear" })),
      (this.animation.onfinish = null),
      l && bb() ? ((this.animation.timeline = l), He) : u(this)
    );
  }
}
const Sy = { anticipate: Wp, backInOut: Fp, circInOut: $p };
function Ab(a) {
  return a in Sy;
}
function Eb(a) {
  typeof a.ease == "string" && Ab(a.ease) && (a.ease = Sy[a.ease]);
}
const kr = 10;
class Mb extends by {
  constructor(l) {
    (Eb(l),
      hy(l),
      super(l),
      l.startTime !== void 0 && (this.startTime = l.startTime),
      (this.options = l));
  }
  updateMotionValue(l) {
    const {
      motionValue: u,
      onUpdate: o,
      onComplete: c,
      element: h,
      ...d
    } = this.options;
    if (!u) return;
    if (l !== void 0) {
      u.set(l);
      return;
    }
    const m = new Qc({ ...d, autoplay: !1 }),
      g = Math.max(kr, se.now() - this.startTime),
      p = tn(0, kr, g - kr);
    (u.setWithVelocity(
      m.sample(Math.max(0, g - p)).value,
      m.sample(g).value,
      p,
    ),
      m.stop());
  }
}
const R0 = (a, l) =>
  l === "zIndex"
    ? !1
    : !!(
        typeof a == "number" ||
        Array.isArray(a) ||
        (typeof a == "string" &&
          (ke.test(a) || a === "0") &&
          !a.startsWith("url("))
      );
function Db(a) {
  const l = a[0];
  if (a.length === 1) return !0;
  for (let u = 0; u < a.length; u++) if (a[u] !== l) return !0;
}
function Nb(a, l, u, o) {
  const c = a[0];
  if (c === null) return !1;
  if (l === "display" || l === "visibility") return !0;
  const h = a[a.length - 1],
    d = R0(c, l),
    m = R0(h, l);
  return !d || !m ? !1 : Db(a) || ((u === "spring" || xy(u)) && o);
}
function yc(a) {
  ((a.duration = 0), (a.type = "keyframes"));
}
const jb = new Set(["opacity", "clipPath", "filter", "transform"]),
  Cb = Xp(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function wb(a) {
  var v;
  const {
    motionValue: l,
    name: u,
    repeatDelay: o,
    repeatType: c,
    damping: h,
    type: d,
  } = a;
  if (
    !(
      ((v = l == null ? void 0 : l.owner) == null
        ? void 0
        : v.current) instanceof HTMLElement
    )
  )
    return !1;
  const { onUpdate: g, transformTemplate: p } = l.owner.getProps();
  return (
    Cb() &&
    u &&
    jb.has(u) &&
    (u !== "transform" || !p) &&
    !g &&
    !o &&
    c !== "mirror" &&
    h !== 0 &&
    d !== "inertia"
  );
}
const zb = 40;
class Rb extends Zc {
  constructor({
    autoplay: l = !0,
    delay: u = 0,
    type: o = "keyframes",
    repeat: c = 0,
    repeatDelay: h = 0,
    repeatType: d = "loop",
    keyframes: m,
    name: g,
    motionValue: p,
    element: v,
    ...b
  }) {
    var z;
    (super(),
      (this.stop = () => {
        var B, H;
        (this._animation &&
          (this._animation.stop(),
          (B = this.stopTimeline) == null || B.call(this)),
          (H = this.keyframeResolver) == null || H.cancel());
      }),
      (this.createdAt = se.now()));
    const T = {
        autoplay: l,
        delay: u,
        type: o,
        repeat: c,
        repeatDelay: h,
        repeatType: d,
        name: g,
        motionValue: p,
        element: v,
        ...b,
      },
      C = (v == null ? void 0 : v.KeyframeResolver) || Kc;
    ((this.keyframeResolver = new C(
      m,
      (B, H, q) => this.onKeyframesResolved(B, H, T, !q),
      g,
      p,
      v,
    )),
      (z = this.keyframeResolver) == null || z.scheduleResolve());
  }
  onKeyframesResolved(l, u, o, c) {
    var H, q;
    this.keyframeResolver = void 0;
    const {
      name: h,
      type: d,
      velocity: m,
      delay: g,
      isHandoff: p,
      onUpdate: v,
    } = o;
    ((this.resolvedAt = se.now()),
      Nb(l, h, d, m) ||
        ((bn.instantAnimations || !g) && (v == null || v(Xc(l, o, u))),
        (l[0] = l[l.length - 1]),
        yc(o),
        (o.repeat = 0)));
    const T = {
        startTime: c
          ? this.resolvedAt
            ? this.resolvedAt - this.createdAt > zb
              ? this.resolvedAt
              : this.createdAt
            : this.createdAt
          : void 0,
        finalKeyframe: u,
        ...o,
        keyframes: l,
      },
      C = !p && wb(T),
      z =
        (q = (H = T.motionValue) == null ? void 0 : H.owner) == null
          ? void 0
          : q.current,
      B = C ? new Mb({ ...T, element: z }) : new Qc(T);
    (B.finished
      .then(() => {
        this.notifyFinished();
      })
      .catch(He),
      this.pendingTimeline &&
        ((this.stopTimeline = B.attachTimeline(this.pendingTimeline)),
        (this.pendingTimeline = void 0)),
      (this._animation = B));
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(l, u) {
    return this.finished.finally(l).then(() => {});
  }
  get animation() {
    var l;
    return (
      this._animation ||
        ((l = this.keyframeResolver) == null || l.resume(), yb()),
      this._animation
    );
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(l) {
    this.animation.time = l;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(l) {
    this.animation.speed = l;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(l) {
    return (
      this._animation
        ? (this.stopTimeline = this.animation.attachTimeline(l))
        : (this.pendingTimeline = l),
      () => this.stop()
    );
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var l;
    (this._animation && this.animation.cancel(),
      (l = this.keyframeResolver) == null || l.cancel());
  }
}
function Ty(a, l, u, o = 0, c = 1) {
  const h = Array.from(a)
      .sort((p, v) => p.sortNodePosition(v))
      .indexOf(l),
    d = a.size,
    m = (d - 1) * o;
  return typeof u == "function" ? u(h, d) : c === 1 ? h * o : m - h * o;
}
const _b = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Ob(a) {
  const l = _b.exec(a);
  if (!l) return [,];
  const [, u, o, c] = l;
  return [`--${u ?? o}`, c];
}
function Ay(a, l, u = 1) {
  const [o, c] = Ob(a);
  if (!o) return;
  const h = window.getComputedStyle(l).getPropertyValue(o);
  if (h) {
    const d = h.trim();
    return qp(d) ? parseFloat(d) : d;
  }
  return Lc(c) ? Ay(c, l, u + 1) : c;
}
const Vb = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  Ub = (a) => ({
    type: "spring",
    stiffness: 550,
    damping: a === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  Bb = { type: "keyframes", duration: 0.8 },
  Lb = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  Hb = (a, { keyframes: l }) =>
    l.length > 2
      ? Bb
      : yi.has(a)
        ? a.startsWith("scale")
          ? Ub(l[1])
          : Vb
        : Lb,
  qb = (a) => a !== null;
function Yb(a, { repeat: l, repeatType: u = "loop" }, o) {
  const c = a.filter(qb),
    h = l && u !== "loop" && l % 2 === 1 ? 0 : c.length - 1;
  return c[h];
}
function Ey(a, l) {
  if (a != null && a.inherit && l) {
    const { inherit: u, ...o } = a;
    return { ...l, ...o };
  }
  return a;
}
function kc(a, l) {
  const u =
    (a == null ? void 0 : a[l]) ?? (a == null ? void 0 : a.default) ?? a;
  return u !== a ? Ey(u, a) : u;
}
function Gb({
  when: a,
  delay: l,
  delayChildren: u,
  staggerChildren: o,
  staggerDirection: c,
  repeat: h,
  repeatType: d,
  repeatDelay: m,
  from: g,
  elapsed: p,
  ...v
}) {
  return !!Object.keys(v).length;
}
const Jc =
  (a, l, u, o = {}, c, h) =>
  (d) => {
    const m = kc(o, a) || {},
      g = m.delay || o.delay || 0;
    let { elapsed: p = 0 } = o;
    p = p - Ke(g);
    const v = {
      keyframes: Array.isArray(u) ? u : [null, u],
      ease: "easeOut",
      velocity: l.getVelocity(),
      ...m,
      delay: -p,
      onUpdate: (T) => {
        (l.set(T), m.onUpdate && m.onUpdate(T));
      },
      onComplete: () => {
        (d(), m.onComplete && m.onComplete());
      },
      name: a,
      motionValue: l,
      element: h ? void 0 : c,
    };
    (Gb(m) || Object.assign(v, Hb(a, v)),
      v.duration && (v.duration = Ke(v.duration)),
      v.repeatDelay && (v.repeatDelay = Ke(v.repeatDelay)),
      v.from !== void 0 && (v.keyframes[0] = v.from));
    let b = !1;
    if (
      ((v.type === !1 || (v.duration === 0 && !v.repeatDelay)) &&
        (yc(v), v.delay === 0 && (b = !0)),
      (bn.instantAnimations ||
        bn.skipAnimations ||
        (c != null && c.shouldSkipAnimations)) &&
        ((b = !0), yc(v), (v.delay = 0)),
      (v.allowFlatten = !m.type && !m.ease),
      b && !h && l.get() !== void 0)
    ) {
      const T = Yb(v.keyframes, m);
      if (T !== void 0) {
        Nt.update(() => {
          (v.onUpdate(T), v.onComplete());
        });
        return;
      }
    }
    return m.isSync ? new Qc(v) : new Rb(v);
  };
function _0(a) {
  const l = [{}, {}];
  return (
    a == null ||
      a.values.forEach((u, o) => {
        ((l[0][o] = u.get()), (l[1][o] = u.getVelocity()));
      }),
    l
  );
}
function Fc(a, l, u, o) {
  if (typeof l == "function") {
    const [c, h] = _0(o);
    l = l(u !== void 0 ? u : a.custom, c, h);
  }
  if (
    (typeof l == "string" && (l = a.variants && a.variants[l]),
    typeof l == "function")
  ) {
    const [c, h] = _0(o);
    l = l(u !== void 0 ? u : a.custom, c, h);
  }
  return l;
}
function di(a, l, u) {
  const o = a.getProps();
  return Fc(o, l, u !== void 0 ? u : o.custom, a);
}
const My = new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...pi,
  ]),
  O0 = 30,
  Xb = (a) => !isNaN(parseFloat(a));
class Zb {
  constructor(l, u = {}) {
    ((this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (o) => {
        var h;
        const c = se.now();
        if (
          (this.updatedAt !== c && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(o),
          this.current !== this.prev &&
            ((h = this.events.change) == null || h.notify(this.current),
            this.dependents))
        )
          for (const d of this.dependents) d.dirty();
      }),
      (this.hasAnimated = !1),
      this.setCurrent(l),
      (this.owner = u.owner));
  }
  setCurrent(l) {
    ((this.current = l),
      (this.updatedAt = se.now()),
      this.canTrackVelocity === null &&
        l !== void 0 &&
        (this.canTrackVelocity = Xb(this.current)));
  }
  setPrevFrameValue(l = this.current) {
    ((this.prevFrameValue = l), (this.prevUpdatedAt = this.updatedAt));
  }
  onChange(l) {
    return this.on("change", l);
  }
  on(l, u) {
    this.events[l] || (this.events[l] = new Vc());
    const o = this.events[l].add(u);
    return l === "change"
      ? () => {
          (o(),
            Nt.read(() => {
              this.events.change.getSize() || this.stop();
            }));
        }
      : o;
  }
  clearListeners() {
    for (const l in this.events) this.events[l].clear();
  }
  attach(l, u) {
    ((this.passiveEffect = l), (this.stopPassiveEffect = u));
  }
  set(l) {
    this.passiveEffect
      ? this.passiveEffect(l, this.updateAndNotify)
      : this.updateAndNotify(l);
  }
  setWithVelocity(l, u, o) {
    (this.set(u),
      (this.prev = void 0),
      (this.prevFrameValue = l),
      (this.prevUpdatedAt = this.updatedAt - o));
  }
  jump(l, u = !0) {
    (this.updateAndNotify(l),
      (this.prev = l),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      u && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
  dirty() {
    var l;
    (l = this.events.change) == null || l.notify(this.current);
  }
  addDependent(l) {
    (this.dependents || (this.dependents = new Set()), this.dependents.add(l));
  }
  removeDependent(l) {
    this.dependents && this.dependents.delete(l);
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const l = se.now();
    if (
      !this.canTrackVelocity ||
      this.prevFrameValue === void 0 ||
      l - this.updatedAt > O0
    )
      return 0;
    const u = Math.min(this.updatedAt - this.prevUpdatedAt, O0);
    return Zp(parseFloat(this.current) - parseFloat(this.prevFrameValue), u);
  }
  start(l) {
    return (
      this.stop(),
      new Promise((u) => {
        ((this.hasAnimated = !0),
          (this.animation = l(u)),
          this.events.animationStart && this.events.animationStart.notify());
      }).then(() => {
        (this.events.animationComplete &&
          this.events.animationComplete.notify(),
          this.clearAnimation());
      })
    );
  }
  stop() {
    (this.animation &&
      (this.animation.stop(),
      this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation());
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    var l, u;
    ((l = this.dependents) == null || l.clear(),
      (u = this.events.destroy) == null || u.notify(),
      this.clearListeners(),
      this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
}
function hi(a, l) {
  return new Zb(a, l);
}
const gc = (a) => Array.isArray(a);
function Qb(a, l, u) {
  a.hasValue(l) ? a.getValue(l).set(u) : a.addValue(l, hi(u));
}
function Kb(a) {
  return gc(a) ? a[a.length - 1] || 0 : a;
}
function kb(a, l) {
  const u = di(a, l);
  let { transitionEnd: o = {}, transition: c = {}, ...h } = u || {};
  h = { ...h, ...o };
  for (const d in h) {
    const m = Kb(h[d]);
    Qb(a, d, m);
  }
}
const ae = (a) => !!(a && a.getVelocity);
function Jb(a) {
  return !!(ae(a) && a.add);
}
function vc(a, l) {
  const u = a.getValue("willChange");
  if (Jb(u)) return u.add(l);
  if (!u && bn.WillChange) {
    const o = new bn.WillChange("auto");
    (a.addValue("willChange", o), o.add(l));
  }
}
function Wc(a) {
  return a.replace(/([A-Z])/g, (l) => `-${l.toLowerCase()}`);
}
const Fb = "framerAppearId",
  Dy = "data-" + Wc(Fb);
function Ny(a) {
  return a.props[Dy];
}
function Wb({ protectedKeys: a, needsAnimating: l }, u) {
  const o = a.hasOwnProperty(u) && l[u] !== !0;
  return ((l[u] = !1), o);
}
function jy(a, l, { delay: u = 0, transitionOverride: o, type: c } = {}) {
  let { transition: h, transitionEnd: d, ...m } = l;
  const g = a.getDefaultTransition();
  h = h ? Ey(h, g) : g;
  const p = h == null ? void 0 : h.reduceMotion;
  o && (h = o);
  const v = [],
    b = c && a.animationState && a.animationState.getState()[c];
  for (const T in m) {
    const C = a.getValue(T, a.latestValues[T] ?? null),
      z = m[T];
    if (z === void 0 || (b && Wb(b, T))) continue;
    const B = { delay: u, ...kc(h || {}, T) },
      H = C.get();
    if (
      H !== void 0 &&
      !C.isAnimating &&
      !Array.isArray(z) &&
      z === H &&
      !B.velocity
    )
      continue;
    let q = !1;
    if (window.MotionHandoffAnimation) {
      const Z = Ny(a);
      if (Z) {
        const Q = window.MotionHandoffAnimation(Z, T, Nt);
        Q !== null && ((B.startTime = Q), (q = !0));
      }
    }
    vc(a, T);
    const G = p ?? a.shouldReduceMotion;
    C.start(Jc(T, C, z, G && My.has(T) ? { type: !1 } : B, a, q));
    const L = C.animation;
    L && v.push(L);
  }
  if (d) {
    const T = () =>
      Nt.update(() => {
        d && kb(a, d);
      });
    v.length ? Promise.all(v).then(T) : T();
  }
  return v;
}
function xc(a, l, u = {}) {
  var g;
  const o = di(
    a,
    l,
    u.type === "exit"
      ? (g = a.presenceContext) == null
        ? void 0
        : g.custom
      : void 0,
  );
  let { transition: c = a.getDefaultTransition() || {} } = o || {};
  u.transitionOverride && (c = u.transitionOverride);
  const h = o ? () => Promise.all(jy(a, o, u)) : () => Promise.resolve(),
    d =
      a.variantChildren && a.variantChildren.size
        ? (p = 0) => {
            const {
              delayChildren: v = 0,
              staggerChildren: b,
              staggerDirection: T,
            } = c;
            return Pb(a, l, p, v, b, T, u);
          }
        : () => Promise.resolve(),
    { when: m } = c;
  if (m) {
    const [p, v] = m === "beforeChildren" ? [h, d] : [d, h];
    return p().then(() => v());
  } else return Promise.all([h(), d(u.delay)]);
}
function Pb(a, l, u = 0, o = 0, c = 0, h = 1, d) {
  const m = [];
  for (const g of a.variantChildren)
    (g.notify("AnimationStart", l),
      m.push(
        xc(g, l, {
          ...d,
          delay:
            u +
            (typeof o == "function" ? 0 : o) +
            Ty(a.variantChildren, g, o, c, h),
        }).then(() => g.notify("AnimationComplete", l)),
      ));
  return Promise.all(m);
}
function $b(a, l, u = {}) {
  a.notify("AnimationStart", l);
  let o;
  if (Array.isArray(l)) {
    const c = l.map((h) => xc(a, h, u));
    o = Promise.all(c);
  } else if (typeof l == "string") o = xc(a, l, u);
  else {
    const c = typeof l == "function" ? di(a, l, u.custom) : l;
    o = Promise.all(jy(a, c, u));
  }
  return o.then(() => {
    a.notify("AnimationComplete", l);
  });
}
const Ib = { test: (a) => a === "auto", parse: (a) => a },
  Cy = (a) => (l) => l.test(a),
  wy = [mi, F, Ie, kn, jx, Nx, Ib],
  V0 = (a) => wy.find(Cy(a));
function t2(a) {
  return typeof a == "number"
    ? a === 0
    : a !== null
      ? a === "none" || a === "0" || Gp(a)
      : !0;
}
const e2 = new Set(["brightness", "contrast", "saturate", "opacity"]);
function n2(a) {
  const [l, u] = a.slice(0, -1).split("(");
  if (l === "drop-shadow") return a;
  const [o] = u.match(Hc) || [];
  if (!o) return a;
  const c = u.replace(o, "");
  let h = e2.has(l) ? 1 : 0;
  return (o !== u && (h *= 100), l + "(" + h + c + ")");
}
const a2 = /\b([a-z-]*)\(.*?\)/gu,
  bc = {
    ...ke,
    getAnimatableNone: (a) => {
      const l = a.match(a2);
      return l ? l.map(n2).join(" ") : a;
    },
  },
  Sc = {
    ...ke,
    getAnimatableNone: (a) => {
      const l = ke.parse(a);
      return ke.createTransformer(a)(
        l.map((o) =>
          typeof o == "number"
            ? 0
            : typeof o == "object"
              ? { ...o, alpha: 1 }
              : o,
        ),
      );
    },
  },
  U0 = { ...mi, transform: Math.round },
  i2 = {
    rotate: kn,
    rotateX: kn,
    rotateY: kn,
    rotateZ: kn,
    scale: Fs,
    scaleX: Fs,
    scaleY: Fs,
    scaleZ: Fs,
    skew: kn,
    skewX: kn,
    skewY: kn,
    distance: F,
    translateX: F,
    translateY: F,
    translateZ: F,
    x: F,
    y: F,
    z: F,
    perspective: F,
    transformPerspective: F,
    opacity: Sl,
    originX: T0,
    originY: T0,
    originZ: F,
  },
  Pc = {
    borderWidth: F,
    borderTopWidth: F,
    borderRightWidth: F,
    borderBottomWidth: F,
    borderLeftWidth: F,
    borderRadius: F,
    borderTopLeftRadius: F,
    borderTopRightRadius: F,
    borderBottomRightRadius: F,
    borderBottomLeftRadius: F,
    width: F,
    maxWidth: F,
    height: F,
    maxHeight: F,
    top: F,
    right: F,
    bottom: F,
    left: F,
    inset: F,
    insetBlock: F,
    insetBlockStart: F,
    insetBlockEnd: F,
    insetInline: F,
    insetInlineStart: F,
    insetInlineEnd: F,
    padding: F,
    paddingTop: F,
    paddingRight: F,
    paddingBottom: F,
    paddingLeft: F,
    paddingBlock: F,
    paddingBlockStart: F,
    paddingBlockEnd: F,
    paddingInline: F,
    paddingInlineStart: F,
    paddingInlineEnd: F,
    margin: F,
    marginTop: F,
    marginRight: F,
    marginBottom: F,
    marginLeft: F,
    marginBlock: F,
    marginBlockStart: F,
    marginBlockEnd: F,
    marginInline: F,
    marginInlineStart: F,
    marginInlineEnd: F,
    fontSize: F,
    backgroundPositionX: F,
    backgroundPositionY: F,
    ...i2,
    zIndex: U0,
    fillOpacity: Sl,
    strokeOpacity: Sl,
    numOctaves: U0,
  },
  l2 = {
    ...Pc,
    color: Xt,
    backgroundColor: Xt,
    outlineColor: Xt,
    fill: Xt,
    stroke: Xt,
    borderColor: Xt,
    borderTopColor: Xt,
    borderRightColor: Xt,
    borderBottomColor: Xt,
    borderLeftColor: Xt,
    filter: bc,
    WebkitFilter: bc,
    mask: Sc,
    WebkitMask: Sc,
  },
  zy = (a) => l2[a],
  s2 = new Set([bc, Sc]);
function Ry(a, l) {
  let u = zy(a);
  return (
    s2.has(u) || (u = ke),
    u.getAnimatableNone ? u.getAnimatableNone(l) : void 0
  );
}
const u2 = new Set(["auto", "none", "0"]);
function o2(a, l, u) {
  let o = 0,
    c;
  for (; o < a.length && !c; ) {
    const h = a[o];
    (typeof h == "string" && !u2.has(h) && Tl(h).values.length && (c = a[o]),
      o++);
  }
  if (c && u) for (const h of l) a[h] = Ry(u, c);
}
class r2 extends Kc {
  constructor(l, u, o, c, h) {
    super(l, u, o, c, h, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, element: u, name: o } = this;
    if (!u || !u.current) return;
    super.readKeyframes();
    for (let v = 0; v < l.length; v++) {
      let b = l[v];
      if (typeof b == "string" && ((b = b.trim()), Lc(b))) {
        const T = Ay(b, u.current);
        (T !== void 0 && (l[v] = T),
          v === l.length - 1 && (this.finalKeyframe = b));
      }
    }
    if ((this.resolveNoneKeyframes(), !My.has(o) || l.length !== 2)) return;
    const [c, h] = l,
      d = V0(c),
      m = V0(h),
      g = S0(c),
      p = S0(h);
    if (g !== p && Fn[o]) {
      this.needsMeasurement = !0;
      return;
    }
    if (d !== m)
      if (w0(d) && w0(m))
        for (let v = 0; v < l.length; v++) {
          const b = l[v];
          typeof b == "string" && (l[v] = parseFloat(b));
        }
      else Fn[o] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: l, name: u } = this,
      o = [];
    for (let c = 0; c < l.length; c++) (l[c] === null || t2(l[c])) && o.push(c);
    o.length && o2(l, o, u);
  }
  measureInitialState() {
    const { element: l, unresolvedKeyframes: u, name: o } = this;
    if (!l || !l.current) return;
    (o === "height" && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = Fn[o](
        l.measureViewportBox(),
        window.getComputedStyle(l.current),
      )),
      (u[0] = this.measuredOrigin));
    const c = u[u.length - 1];
    c !== void 0 && l.getValue(o, c).jump(c, !1);
  }
  measureEndState() {
    var m;
    const { element: l, name: u, unresolvedKeyframes: o } = this;
    if (!l || !l.current) return;
    const c = l.getValue(u);
    c && c.jump(this.measuredOrigin, !1);
    const h = o.length - 1,
      d = o[h];
    ((o[h] = Fn[u](l.measureViewportBox(), window.getComputedStyle(l.current))),
      d !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = d),
      (m = this.removedTransforms) != null &&
        m.length &&
        this.removedTransforms.forEach(([g, p]) => {
          l.getValue(g).set(p);
        }),
      this.resolveNoneKeyframes());
  }
}
const c2 = new Set(["opacity", "clipPath", "filter", "transform"]);
function _y(a, l, u) {
  if (a == null) return [];
  if (a instanceof EventTarget) return [a];
  if (typeof a == "string") {
    let o = document;
    const c = (u == null ? void 0 : u[a]) ?? o.querySelectorAll(a);
    return c ? Array.from(c) : [];
  }
  return Array.from(a).filter((o) => o != null);
}
const Oy = (a, l) => (l && typeof a == "number" ? l.transform(a) : a);
function Tc(a) {
  return Yp(a) && "offsetHeight" in a;
}
const { schedule: $c } = ey(queueMicrotask, !1),
  Qe = { x: !1, y: !1 };
function Vy() {
  return Qe.x || Qe.y;
}
function f2(a) {
  return a === "x" || a === "y"
    ? Qe[a]
      ? null
      : ((Qe[a] = !0),
        () => {
          Qe[a] = !1;
        })
    : Qe.x || Qe.y
      ? null
      : ((Qe.x = Qe.y = !0),
        () => {
          Qe.x = Qe.y = !1;
        });
}
function Uy(a, l) {
  const u = _y(a),
    o = new AbortController(),
    c = { passive: !0, ...l, signal: o.signal };
  return [u, c, () => o.abort()];
}
function d2(a) {
  return !(a.pointerType === "touch" || Vy());
}
function h2(a, l, u = {}) {
  const [o, c, h] = Uy(a, u);
  return (
    o.forEach((d) => {
      let m = !1,
        g = !1,
        p;
      const v = () => {
          d.removeEventListener("pointerleave", z);
        },
        b = (H) => {
          (p && (p(H), (p = void 0)), v());
        },
        T = (H) => {
          ((m = !1),
            window.removeEventListener("pointerup", T),
            window.removeEventListener("pointercancel", T),
            g && ((g = !1), b(H)));
        },
        C = () => {
          ((m = !0),
            window.addEventListener("pointerup", T, c),
            window.addEventListener("pointercancel", T, c));
        },
        z = (H) => {
          if (H.pointerType !== "touch") {
            if (m) {
              g = !0;
              return;
            }
            b(H);
          }
        },
        B = (H) => {
          if (!d2(H)) return;
          g = !1;
          const q = l(d, H);
          typeof q == "function" &&
            ((p = q), d.addEventListener("pointerleave", z, c));
        };
      (d.addEventListener("pointerenter", B, c),
        d.addEventListener("pointerdown", C, c));
    }),
    h
  );
}
const By = (a, l) => (l ? (a === l ? !0 : By(a, l.parentElement)) : !1),
  Ic = (a) =>
    a.pointerType === "mouse"
      ? typeof a.button != "number" || a.button <= 0
      : a.isPrimary !== !1,
  m2 = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function p2(a) {
  return m2.has(a.tagName) || a.isContentEditable === !0;
}
const y2 = new Set(["INPUT", "SELECT", "TEXTAREA"]);
function g2(a) {
  return y2.has(a.tagName) || a.isContentEditable === !0;
}
const Is = new WeakSet();
function B0(a) {
  return (l) => {
    l.key === "Enter" && a(l);
  };
}
function Jr(a, l) {
  a.dispatchEvent(
    new PointerEvent("pointer" + l, { isPrimary: !0, bubbles: !0 }),
  );
}
const v2 = (a, l) => {
  const u = a.currentTarget;
  if (!u) return;
  const o = B0(() => {
    if (Is.has(u)) return;
    Jr(u, "down");
    const c = B0(() => {
        Jr(u, "up");
      }),
      h = () => Jr(u, "cancel");
    (u.addEventListener("keyup", c, l), u.addEventListener("blur", h, l));
  });
  (u.addEventListener("keydown", o, l),
    u.addEventListener("blur", () => u.removeEventListener("keydown", o), l));
};
function L0(a) {
  return Ic(a) && !Vy();
}
const H0 = new WeakSet();
function x2(a, l, u = {}) {
  const [o, c, h] = Uy(a, u),
    d = (m) => {
      const g = m.currentTarget;
      if (!L0(m) || H0.has(m)) return;
      (Is.add(g), u.stopPropagation && H0.add(m));
      const p = l(g, m),
        v = (C, z) => {
          (window.removeEventListener("pointerup", b),
            window.removeEventListener("pointercancel", T),
            Is.has(g) && Is.delete(g),
            L0(C) && typeof p == "function" && p(C, { success: z }));
        },
        b = (C) => {
          v(
            C,
            g === window ||
              g === document ||
              u.useGlobalTarget ||
              By(g, C.target),
          );
        },
        T = (C) => {
          v(C, !1);
        };
      (window.addEventListener("pointerup", b, c),
        window.addEventListener("pointercancel", T, c));
    };
  return (
    o.forEach((m) => {
      ((u.useGlobalTarget ? window : m).addEventListener("pointerdown", d, c),
        Tc(m) &&
          (m.addEventListener("focus", (p) => v2(p, c)),
          !p2(m) && !m.hasAttribute("tabindex") && (m.tabIndex = 0)));
    }),
    h
  );
}
function tf(a) {
  return Yp(a) && "ownerSVGElement" in a;
}
const tu = new WeakMap();
let Jn;
const Ly = (a, l, u) => (o, c) =>
    c && c[0]
      ? c[0][a + "Size"]
      : tf(o) && "getBBox" in o
        ? o.getBBox()[l]
        : o[u],
  b2 = Ly("inline", "width", "offsetWidth"),
  S2 = Ly("block", "height", "offsetHeight");
function T2({ target: a, borderBoxSize: l }) {
  var u;
  (u = tu.get(a)) == null ||
    u.forEach((o) => {
      o(a, {
        get width() {
          return b2(a, l);
        },
        get height() {
          return S2(a, l);
        },
      });
    });
}
function A2(a) {
  a.forEach(T2);
}
function E2() {
  typeof ResizeObserver > "u" || (Jn = new ResizeObserver(A2));
}
function M2(a, l) {
  Jn || E2();
  const u = _y(a);
  return (
    u.forEach((o) => {
      let c = tu.get(o);
      (c || ((c = new Set()), tu.set(o, c)),
        c.add(l),
        Jn == null || Jn.observe(o));
    }),
    () => {
      u.forEach((o) => {
        const c = tu.get(o);
        (c == null || c.delete(l),
          (c != null && c.size) || Jn == null || Jn.unobserve(o));
      });
    }
  );
}
const eu = new Set();
let oi;
function D2() {
  ((oi = () => {
    const a = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      },
    };
    eu.forEach((l) => l(a));
  }),
    window.addEventListener("resize", oi));
}
function N2(a) {
  return (
    eu.add(a),
    oi || D2(),
    () => {
      (eu.delete(a),
        !eu.size &&
          typeof oi == "function" &&
          (window.removeEventListener("resize", oi), (oi = void 0)));
    }
  );
}
function q0(a, l) {
  return typeof a == "function" ? N2(a) : M2(a, l);
}
function j2(a) {
  return tf(a) && a.tagName === "svg";
}
const C2 = [...wy, Xt, ke],
  w2 = (a) => C2.find(Cy(a)),
  Y0 = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  ri = () => ({ x: Y0(), y: Y0() }),
  G0 = () => ({ min: 0, max: 0 }),
  Kt = () => ({ x: G0(), y: G0() }),
  z2 = new WeakMap();
function hu(a) {
  return a !== null && typeof a == "object" && typeof a.start == "function";
}
function Al(a) {
  return typeof a == "string" || Array.isArray(a);
}
const ef = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit",
  ],
  nf = ["initial", ...ef];
function mu(a) {
  return hu(a.animate) || nf.some((l) => Al(a[l]));
}
function Hy(a) {
  return !!(mu(a) || a.variants);
}
function R2(a, l, u) {
  for (const o in l) {
    const c = l[o],
      h = u[o];
    if (ae(c)) a.addValue(o, c);
    else if (ae(h)) a.addValue(o, hi(c, { owner: a }));
    else if (h !== c)
      if (a.hasValue(o)) {
        const d = a.getValue(o);
        d.liveStyle === !0 ? d.jump(c) : d.hasAnimated || d.set(c);
      } else {
        const d = a.getStaticValue(o);
        a.addValue(o, hi(d !== void 0 ? d : c, { owner: a }));
      }
  }
  for (const o in u) l[o] === void 0 && a.removeValue(o);
  return l;
}
const Ac = { current: null },
  qy = { current: !1 },
  _2 = typeof window < "u";
function O2() {
  if (((qy.current = !0), !!_2))
    if (window.matchMedia) {
      const a = window.matchMedia("(prefers-reduced-motion)"),
        l = () => (Ac.current = a.matches);
      (a.addEventListener("change", l), l());
    } else Ac.current = !1;
}
const X0 = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete",
];
let ou = {};
function Yy(a) {
  ou = a;
}
function V2() {
  return ou;
}
class U2 {
  scrapeMotionValuesFromProps(l, u, o) {
    return {};
  }
  constructor(
    {
      parent: l,
      props: u,
      presenceContext: o,
      reducedMotionConfig: c,
      skipAnimations: h,
      blockInitialAnimation: d,
      visualState: m,
    },
    g = {},
  ) {
    ((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.shouldSkipAnimations = !1),
      (this.values = new Map()),
      (this.KeyframeResolver = Kc),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.hasBeenMounted = !1),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(
            this.current,
            this.renderState,
            this.props.style,
            this.projection,
          ));
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const C = se.now();
        this.renderScheduledAt < C &&
          ((this.renderScheduledAt = C), Nt.render(this.render, !1, !0));
      }));
    const { latestValues: p, renderState: v } = m;
    ((this.latestValues = p),
      (this.baseTarget = { ...p }),
      (this.initialValues = u.initial ? { ...p } : {}),
      (this.renderState = v),
      (this.parent = l),
      (this.props = u),
      (this.presenceContext = o),
      (this.depth = l ? l.depth + 1 : 0),
      (this.reducedMotionConfig = c),
      (this.skipAnimationsConfig = h),
      (this.options = g),
      (this.blockInitialAnimation = !!d),
      (this.isControllingVariants = mu(u)),
      (this.isVariantNode = Hy(u)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = !!(l && l.current)));
    const { willChange: b, ...T } = this.scrapeMotionValuesFromProps(
      u,
      {},
      this,
    );
    for (const C in T) {
      const z = T[C];
      p[C] !== void 0 && ae(z) && z.set(p[C]);
    }
  }
  mount(l) {
    var u, o;
    if (this.hasBeenMounted)
      for (const c in this.initialValues)
        ((u = this.values.get(c)) == null || u.jump(this.initialValues[c]),
          (this.latestValues[c] = this.initialValues[c]));
    ((this.current = l),
      z2.set(l, this),
      this.projection && !this.projection.instance && this.projection.mount(l),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((c, h) => this.bindToMotionValue(h, c)),
      this.reducedMotionConfig === "never"
        ? (this.shouldReduceMotion = !1)
        : this.reducedMotionConfig === "always"
          ? (this.shouldReduceMotion = !0)
          : (qy.current || O2(), (this.shouldReduceMotion = Ac.current)),
      (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
      (o = this.parent) == null || o.addChild(this),
      this.update(this.props, this.presenceContext),
      (this.hasBeenMounted = !0));
  }
  unmount() {
    var l;
    (this.projection && this.projection.unmount(),
      Wn(this.notifyUpdate),
      Wn(this.render),
      this.valueSubscriptions.forEach((u) => u()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      (l = this.parent) == null || l.removeChild(this));
    for (const u in this.events) this.events[u].clear();
    for (const u in this.features) {
      const o = this.features[u];
      o && (o.unmount(), (o.isMounted = !1));
    }
    this.current = null;
  }
  addChild(l) {
    (this.children.add(l),
      this.enteringChildren ?? (this.enteringChildren = new Set()),
      this.enteringChildren.add(l));
  }
  removeChild(l) {
    (this.children.delete(l),
      this.enteringChildren && this.enteringChildren.delete(l));
  }
  bindToMotionValue(l, u) {
    if (
      (this.valueSubscriptions.has(l) && this.valueSubscriptions.get(l)(),
      u.accelerate && c2.has(l) && this.current instanceof HTMLElement)
    ) {
      const {
          factory: d,
          keyframes: m,
          times: g,
          ease: p,
          duration: v,
        } = u.accelerate,
        b = new by({
          element: this.current,
          name: l,
          keyframes: m,
          times: g,
          ease: p,
          duration: Ke(v),
        }),
        T = d(b);
      this.valueSubscriptions.set(l, () => {
        (T(), b.cancel());
      });
      return;
    }
    const o = yi.has(l);
    o && this.onBindTransform && this.onBindTransform();
    const c = u.on("change", (d) => {
      ((this.latestValues[l] = d),
        this.props.onUpdate && Nt.preRender(this.notifyUpdate),
        o && this.projection && (this.projection.isTransformDirty = !0),
        this.scheduleRender());
    });
    let h;
    (typeof window < "u" &&
      window.MotionCheckAppearSync &&
      (h = window.MotionCheckAppearSync(this, l, u)),
      this.valueSubscriptions.set(l, () => {
        (c(), h && h(), u.owner && u.stop());
      }));
  }
  sortNodePosition(l) {
    return !this.current ||
      !this.sortInstanceNodePosition ||
      this.type !== l.type
      ? 0
      : this.sortInstanceNodePosition(this.current, l.current);
  }
  updateFeatures() {
    let l = "animation";
    for (l in ou) {
      const u = ou[l];
      if (!u) continue;
      const { isEnabled: o, Feature: c } = u;
      if (
        (!this.features[l] &&
          c &&
          o(this.props) &&
          (this.features[l] = new c(this)),
        this.features[l])
      ) {
        const h = this.features[l];
        h.isMounted ? h.update() : (h.mount(), (h.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current
      ? this.measureInstanceViewportBox(this.current, this.props)
      : Kt();
  }
  getStaticValue(l) {
    return this.latestValues[l];
  }
  setStaticValue(l, u) {
    this.latestValues[l] = u;
  }
  update(l, u) {
    ((l.transformTemplate || this.props.transformTemplate) &&
      this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = l),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = u));
    for (let o = 0; o < X0.length; o++) {
      const c = X0[o];
      this.propEventSubscriptions[c] &&
        (this.propEventSubscriptions[c](),
        delete this.propEventSubscriptions[c]);
      const h = "on" + c,
        d = l[h];
      d && (this.propEventSubscriptions[c] = this.on(c, d));
    }
    ((this.prevMotionValues = R2(
      this,
      this.scrapeMotionValuesFromProps(l, this.prevProps || {}, this),
      this.prevMotionValues,
    )),
      this.handleChildMotionValue && this.handleChildMotionValue());
  }
  getProps() {
    return this.props;
  }
  getVariant(l) {
    return this.props.variants ? this.props.variants[l] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode
      ? this
      : this.parent
        ? this.parent.getClosestVariantNode()
        : void 0;
  }
  addVariantChild(l) {
    const u = this.getClosestVariantNode();
    if (u)
      return (
        u.variantChildren && u.variantChildren.add(l),
        () => u.variantChildren.delete(l)
      );
  }
  addValue(l, u) {
    const o = this.values.get(l);
    u !== o &&
      (o && this.removeValue(l),
      this.bindToMotionValue(l, u),
      this.values.set(l, u),
      (this.latestValues[l] = u.get()));
  }
  removeValue(l) {
    this.values.delete(l);
    const u = this.valueSubscriptions.get(l);
    (u && (u(), this.valueSubscriptions.delete(l)),
      delete this.latestValues[l],
      this.removeValueFromRenderState(l, this.renderState));
  }
  hasValue(l) {
    return this.values.has(l);
  }
  getValue(l, u) {
    if (this.props.values && this.props.values[l]) return this.props.values[l];
    let o = this.values.get(l);
    return (
      o === void 0 &&
        u !== void 0 &&
        ((o = hi(u === null ? void 0 : u, { owner: this })),
        this.addValue(l, o)),
      o
    );
  }
  readValue(l, u) {
    let o =
      this.latestValues[l] !== void 0 || !this.current
        ? this.latestValues[l]
        : (this.getBaseTargetFromProps(this.props, l) ??
          this.readValueFromInstance(this.current, l, this.options));
    return (
      o != null &&
        (typeof o == "string" && (qp(o) || Gp(o))
          ? (o = parseFloat(o))
          : !w2(o) && ke.test(u) && (o = Ry(l, u)),
        this.setBaseTarget(l, ae(o) ? o.get() : o)),
      ae(o) ? o.get() : o
    );
  }
  setBaseTarget(l, u) {
    this.baseTarget[l] = u;
  }
  getBaseTarget(l) {
    var h;
    const { initial: u } = this.props;
    let o;
    if (typeof u == "string" || typeof u == "object") {
      const d = Fc(
        this.props,
        u,
        (h = this.presenceContext) == null ? void 0 : h.custom,
      );
      d && (o = d[l]);
    }
    if (u && o !== void 0) return o;
    const c = this.getBaseTargetFromProps(this.props, l);
    return c !== void 0 && !ae(c)
      ? c
      : this.initialValues[l] !== void 0 && o === void 0
        ? void 0
        : this.baseTarget[l];
  }
  on(l, u) {
    return (
      this.events[l] || (this.events[l] = new Vc()),
      this.events[l].add(u)
    );
  }
  notify(l, ...u) {
    this.events[l] && this.events[l].notify(...u);
  }
  scheduleRenderMicrotask() {
    $c.render(this.render);
  }
}
class Gy extends U2 {
  constructor() {
    (super(...arguments), (this.KeyframeResolver = r2));
  }
  sortInstanceNodePosition(l, u) {
    return l.compareDocumentPosition(u) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(l, u) {
    const o = l.style;
    return o ? o[u] : void 0;
  }
  removeValueFromRenderState(l, { vars: u, style: o }) {
    (delete u[l], delete o[l]);
  }
  handleChildMotionValue() {
    this.childSubscription &&
      (this.childSubscription(), delete this.childSubscription);
    const { children: l } = this.props;
    ae(l) &&
      (this.childSubscription = l.on("change", (u) => {
        this.current && (this.current.textContent = `${u}`);
      }));
  }
}
class Pn {
  constructor(l) {
    ((this.isMounted = !1), (this.node = l));
  }
  update() {}
}
function Xy({ top: a, left: l, right: u, bottom: o }) {
  return { x: { min: l, max: u }, y: { min: a, max: o } };
}
function B2({ x: a, y: l }) {
  return { top: l.min, right: a.max, bottom: l.max, left: a.min };
}
function L2(a, l) {
  if (!l) return a;
  const u = l({ x: a.left, y: a.top }),
    o = l({ x: a.right, y: a.bottom });
  return { top: u.y, left: u.x, bottom: o.y, right: o.x };
}
function Fr(a) {
  return a === void 0 || a === 1;
}
function Ec({ scale: a, scaleX: l, scaleY: u }) {
  return !Fr(a) || !Fr(l) || !Fr(u);
}
function va(a) {
  return (
    Ec(a) ||
    Zy(a) ||
    a.z ||
    a.rotate ||
    a.rotateX ||
    a.rotateY ||
    a.skewX ||
    a.skewY
  );
}
function Zy(a) {
  return Z0(a.x) || Z0(a.y);
}
function Z0(a) {
  return a && a !== "0%";
}
function ru(a, l, u) {
  const o = a - u,
    c = l * o;
  return u + c;
}
function Q0(a, l, u, o, c) {
  return (c !== void 0 && (a = ru(a, c, o)), ru(a, u, o) + l);
}
function Mc(a, l = 0, u = 1, o, c) {
  ((a.min = Q0(a.min, l, u, o, c)), (a.max = Q0(a.max, l, u, o, c)));
}
function Qy(a, { x: l, y: u }) {
  (Mc(a.x, l.translate, l.scale, l.originPoint),
    Mc(a.y, u.translate, u.scale, u.originPoint));
}
const K0 = 0.999999999999,
  k0 = 1.0000000000001;
function H2(a, l, u, o = !1) {
  const c = u.length;
  if (!c) return;
  l.x = l.y = 1;
  let h, d;
  for (let m = 0; m < c; m++) {
    ((h = u[m]), (d = h.projectionDelta));
    const { visualElement: g } = h.options;
    (g && g.props.style && g.props.style.display === "contents") ||
      (o &&
        h.options.layoutScroll &&
        h.scroll &&
        h !== h.root &&
        fi(a, { x: -h.scroll.offset.x, y: -h.scroll.offset.y }),
      d && ((l.x *= d.x.scale), (l.y *= d.y.scale), Qy(a, d)),
      o && va(h.latestValues) && fi(a, h.latestValues));
  }
  (l.x < k0 && l.x > K0 && (l.x = 1), l.y < k0 && l.y > K0 && (l.y = 1));
}
function ci(a, l) {
  ((a.min = a.min + l), (a.max = a.max + l));
}
function J0(a, l, u, o, c = 0.5) {
  const h = Rt(a.min, a.max, c);
  Mc(a, l, u, h, o);
}
function fi(a, l) {
  (J0(a.x, l.x, l.scaleX, l.scale, l.originX),
    J0(a.y, l.y, l.scaleY, l.scale, l.originY));
}
function Ky(a, l) {
  return Xy(L2(a.getBoundingClientRect(), l));
}
function q2(a, l, u) {
  const o = Ky(a, u),
    { scroll: c } = l;
  return (c && (ci(o.x, c.offset.x), ci(o.y, c.offset.y)), o);
}
const Y2 = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  G2 = pi.length;
function X2(a, l, u) {
  let o = "",
    c = !0;
  for (let h = 0; h < G2; h++) {
    const d = pi[h],
      m = a[d];
    if (m === void 0) continue;
    let g = !0;
    if (typeof m == "number") g = m === (d.startsWith("scale") ? 1 : 0);
    else {
      const p = parseFloat(m);
      g = d.startsWith("scale") ? p === 1 : p === 0;
    }
    if (!g || u) {
      const p = Oy(m, Pc[d]);
      if (!g) {
        c = !1;
        const v = Y2[d] || d;
        o += `${v}(${p}) `;
      }
      u && (l[d] = p);
    }
  }
  return ((o = o.trim()), u ? (o = u(l, c ? "" : o)) : c && (o = "none"), o);
}
function af(a, l, u) {
  const { style: o, vars: c, transformOrigin: h } = a;
  let d = !1,
    m = !1;
  for (const g in l) {
    const p = l[g];
    if (yi.has(g)) {
      d = !0;
      continue;
    } else if (ay(g)) {
      c[g] = p;
      continue;
    } else {
      const v = Oy(p, Pc[g]);
      g.startsWith("origin") ? ((m = !0), (h[g] = v)) : (o[g] = v);
    }
  }
  if (
    (l.transform ||
      (d || u
        ? (o.transform = X2(l, a.transform, u))
        : o.transform && (o.transform = "none")),
    m)
  ) {
    const { originX: g = "50%", originY: p = "50%", originZ: v = 0 } = h;
    o.transformOrigin = `${g} ${p} ${v}`;
  }
}
function ky(a, { style: l, vars: u }, o, c) {
  const h = a.style;
  let d;
  for (d in l) h[d] = l[d];
  c == null || c.applyProjectionStyles(h, o);
  for (d in u) h.setProperty(d, u[d]);
}
function F0(a, l) {
  return l.max === l.min ? 0 : (a / (l.max - l.min)) * 100;
}
const dl = {
    correct: (a, l) => {
      if (!l.target) return a;
      if (typeof a == "string")
        if (F.test(a)) a = parseFloat(a);
        else return a;
      const u = F0(a, l.target.x),
        o = F0(a, l.target.y);
      return `${u}% ${o}%`;
    },
  },
  Z2 = {
    correct: (a, { treeScale: l, projectionDelta: u }) => {
      const o = a,
        c = ke.parse(a);
      if (c.length > 5) return o;
      const h = ke.createTransformer(a),
        d = typeof c[0] != "number" ? 1 : 0,
        m = u.x.scale * l.x,
        g = u.y.scale * l.y;
      ((c[0 + d] /= m), (c[1 + d] /= g));
      const p = Rt(m, g, 0.5);
      return (
        typeof c[2 + d] == "number" && (c[2 + d] /= p),
        typeof c[3 + d] == "number" && (c[3 + d] /= p),
        h(c)
      );
    },
  },
  Dc = {
    borderRadius: {
      ...dl,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: dl,
    borderTopRightRadius: dl,
    borderBottomLeftRadius: dl,
    borderBottomRightRadius: dl,
    boxShadow: Z2,
  };
function Jy(a, { layout: l, layoutId: u }) {
  return (
    yi.has(a) ||
    a.startsWith("origin") ||
    ((l || u !== void 0) && (!!Dc[a] || a === "opacity"))
  );
}
function lf(a, l, u) {
  var d;
  const o = a.style,
    c = l == null ? void 0 : l.style,
    h = {};
  if (!o) return h;
  for (const m in o)
    (ae(o[m]) ||
      (c && ae(c[m])) ||
      Jy(m, a) ||
      ((d = u == null ? void 0 : u.getValue(m)) == null
        ? void 0
        : d.liveStyle) !== void 0) &&
      (h[m] = o[m]);
  return h;
}
function Q2(a) {
  return window.getComputedStyle(a);
}
class K2 extends Gy {
  constructor() {
    (super(...arguments), (this.type = "html"), (this.renderInstance = ky));
  }
  readValueFromInstance(l, u) {
    var o;
    if (yi.has(u))
      return (o = this.projection) != null && o.isProjecting ? fc(u) : fb(l, u);
    {
      const c = Q2(l),
        h = (ay(u) ? c.getPropertyValue(u) : c[u]) || 0;
      return typeof h == "string" ? h.trim() : h;
    }
  }
  measureInstanceViewportBox(l, { transformPagePoint: u }) {
    return Ky(l, u);
  }
  build(l, u, o) {
    af(l, u, o.transformTemplate);
  }
  scrapeMotionValuesFromProps(l, u, o) {
    return lf(l, u, o);
  }
}
const k2 = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  J2 = { offset: "strokeDashoffset", array: "strokeDasharray" };
function F2(a, l, u = 1, o = 0, c = !0) {
  a.pathLength = 1;
  const h = c ? k2 : J2;
  ((a[h.offset] = `${-o}`), (a[h.array] = `${l} ${u}`));
}
const W2 = ["offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];
function Fy(
  a,
  {
    attrX: l,
    attrY: u,
    attrScale: o,
    pathLength: c,
    pathSpacing: h = 1,
    pathOffset: d = 0,
    ...m
  },
  g,
  p,
  v,
) {
  if ((af(a, m, p), g)) {
    a.style.viewBox && (a.attrs.viewBox = a.style.viewBox);
    return;
  }
  ((a.attrs = a.style), (a.style = {}));
  const { attrs: b, style: T } = a;
  (b.transform && ((T.transform = b.transform), delete b.transform),
    (T.transform || b.transformOrigin) &&
      ((T.transformOrigin = b.transformOrigin ?? "50% 50%"),
      delete b.transformOrigin),
    T.transform &&
      ((T.transformBox = (v == null ? void 0 : v.transformBox) ?? "fill-box"),
      delete b.transformBox));
  for (const C of W2) b[C] !== void 0 && ((T[C] = b[C]), delete b[C]);
  (l !== void 0 && (b.x = l),
    u !== void 0 && (b.y = u),
    o !== void 0 && (b.scale = o),
    c !== void 0 && F2(b, c, h, d, !1));
}
const Wy = new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust",
  ]),
  Py = (a) => typeof a == "string" && a.toLowerCase() === "svg";
function P2(a, l, u, o) {
  ky(a, l, void 0, o);
  for (const c in l.attrs) a.setAttribute(Wy.has(c) ? c : Wc(c), l.attrs[c]);
}
function $y(a, l, u) {
  const o = lf(a, l, u);
  for (const c in a)
    if (ae(a[c]) || ae(l[c])) {
      const h =
        pi.indexOf(c) !== -1
          ? "attr" + c.charAt(0).toUpperCase() + c.substring(1)
          : c;
      o[h] = a[c];
    }
  return o;
}
class $2 extends Gy {
  constructor() {
    (super(...arguments),
      (this.type = "svg"),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = Kt));
  }
  getBaseTargetFromProps(l, u) {
    return l[u];
  }
  readValueFromInstance(l, u) {
    if (yi.has(u)) {
      const o = zy(u);
      return (o && o.default) || 0;
    }
    return ((u = Wy.has(u) ? u : Wc(u)), l.getAttribute(u));
  }
  scrapeMotionValuesFromProps(l, u, o) {
    return $y(l, u, o);
  }
  build(l, u, o) {
    Fy(l, u, this.isSVGTag, o.transformTemplate, o.style);
  }
  renderInstance(l, u, o, c) {
    P2(l, u, o, c);
  }
  mount(l) {
    ((this.isSVGTag = Py(l.tagName)), super.mount(l));
  }
}
const I2 = nf.length;
function Iy(a) {
  if (!a) return;
  if (!a.isControllingVariants) {
    const u = a.parent ? Iy(a.parent) || {} : {};
    return (a.props.initial !== void 0 && (u.initial = a.props.initial), u);
  }
  const l = {};
  for (let u = 0; u < I2; u++) {
    const o = nf[u],
      c = a.props[o];
    (Al(c) || c === !1) && (l[o] = c);
  }
  return l;
}
function tg(a, l) {
  if (!Array.isArray(l)) return !1;
  const u = l.length;
  if (u !== a.length) return !1;
  for (let o = 0; o < u; o++) if (l[o] !== a[o]) return !1;
  return !0;
}
const tS = [...ef].reverse(),
  eS = ef.length;
function nS(a) {
  return (l) =>
    Promise.all(l.map(({ animation: u, options: o }) => $b(a, u, o)));
}
function aS(a) {
  let l = nS(a),
    u = W0(),
    o = !0,
    c = !1;
  const h = (p) => (v, b) => {
    var C;
    const T = di(
      a,
      b,
      p === "exit"
        ? (C = a.presenceContext) == null
          ? void 0
          : C.custom
        : void 0,
    );
    if (T) {
      const { transition: z, transitionEnd: B, ...H } = T;
      v = { ...v, ...H, ...B };
    }
    return v;
  };
  function d(p) {
    l = p(a);
  }
  function m(p) {
    const { props: v } = a,
      b = Iy(a.parent) || {},
      T = [],
      C = new Set();
    let z = {},
      B = 1 / 0;
    for (let q = 0; q < eS; q++) {
      const G = tS[q],
        L = u[G],
        Z = v[G] !== void 0 ? v[G] : b[G],
        Q = Al(Z),
        nt = G === p ? L.isActive : null;
      nt === !1 && (B = q);
      let P = Z === b[G] && Z !== v[G] && Q;
      if (
        (P && (o || c) && a.manuallyAnimateOnMount && (P = !1),
        (L.protectedKeys = { ...z }),
        (!L.isActive && nt === null) ||
          (!Z && !L.prevProp) ||
          hu(Z) ||
          typeof Z == "boolean")
      )
        continue;
      if (G === "exit" && L.isActive && nt !== !0) {
        L.prevResolvedValues && (z = { ...z, ...L.prevResolvedValues });
        continue;
      }
      const $ = iS(L.prevProp, Z);
      let at = $ || (G === p && L.isActive && !P && Q) || (q > B && Q),
        Dt = !1;
      const kt = Array.isArray(Z) ? Z : [Z];
      let zt = kt.reduce(h(G), {});
      nt === !1 && (zt = {});
      const { prevResolvedValues: Ne = {} } = L,
        qe = { ...Ne, ...zt },
        oe = (k) => {
          ((at = !0),
            C.has(k) && ((Dt = !0), C.delete(k)),
            (L.needsAnimating[k] = !0));
          const ut = a.getValue(k);
          ut && (ut.liveStyle = !1);
        };
      for (const k in qe) {
        const ut = zt[k],
          mt = Ne[k];
        if (z.hasOwnProperty(k)) continue;
        let E = !1;
        (gc(ut) && gc(mt) ? (E = !tg(ut, mt)) : (E = ut !== mt),
          E
            ? ut != null
              ? oe(k)
              : C.add(k)
            : ut !== void 0 && C.has(k)
              ? oe(k)
              : (L.protectedKeys[k] = !0));
      }
      ((L.prevProp = Z),
        (L.prevResolvedValues = zt),
        L.isActive && (z = { ...z, ...zt }),
        (o || c) && a.blockInitialAnimation && (at = !1));
      const _ = P && $;
      at &&
        (!_ || Dt) &&
        T.push(
          ...kt.map((k) => {
            const ut = { type: G };
            if (
              typeof k == "string" &&
              (o || c) &&
              !_ &&
              a.manuallyAnimateOnMount &&
              a.parent
            ) {
              const { parent: mt } = a,
                E = di(mt, k);
              if (mt.enteringChildren && E) {
                const { delayChildren: U } = E.transition || {};
                ut.delay = Ty(mt.enteringChildren, a, U);
              }
            }
            return { animation: k, options: ut };
          }),
        );
    }
    if (C.size) {
      const q = {};
      if (typeof v.initial != "boolean") {
        const G = di(a, Array.isArray(v.initial) ? v.initial[0] : v.initial);
        G && G.transition && (q.transition = G.transition);
      }
      (C.forEach((G) => {
        const L = a.getBaseTarget(G),
          Z = a.getValue(G);
        (Z && (Z.liveStyle = !0), (q[G] = L ?? null));
      }),
        T.push({ animation: q }));
    }
    let H = !!T.length;
    return (
      o &&
        (v.initial === !1 || v.initial === v.animate) &&
        !a.manuallyAnimateOnMount &&
        (H = !1),
      (o = !1),
      (c = !1),
      H ? l(T) : Promise.resolve()
    );
  }
  function g(p, v) {
    var T;
    if (u[p].isActive === v) return Promise.resolve();
    ((T = a.variantChildren) == null ||
      T.forEach((C) => {
        var z;
        return (z = C.animationState) == null ? void 0 : z.setActive(p, v);
      }),
      (u[p].isActive = v));
    const b = m(p);
    for (const C in u) u[C].protectedKeys = {};
    return b;
  }
  return {
    animateChanges: m,
    setActive: g,
    setAnimateFunction: d,
    getState: () => u,
    reset: () => {
      ((u = W0()), (c = !0));
    },
  };
}
function iS(a, l) {
  return typeof l == "string" ? l !== a : Array.isArray(l) ? !tg(l, a) : !1;
}
function ga(a = !1) {
  return {
    isActive: a,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {},
  };
}
function W0() {
  return {
    animate: ga(!0),
    whileInView: ga(),
    whileHover: ga(),
    whileTap: ga(),
    whileDrag: ga(),
    whileFocus: ga(),
    exit: ga(),
  };
}
function P0(a, l) {
  ((a.min = l.min), (a.max = l.max));
}
function Ze(a, l) {
  (P0(a.x, l.x), P0(a.y, l.y));
}
function $0(a, l) {
  ((a.translate = l.translate),
    (a.scale = l.scale),
    (a.originPoint = l.originPoint),
    (a.origin = l.origin));
}
const eg = 1e-4,
  lS = 1 - eg,
  sS = 1 + eg,
  ng = 0.01,
  uS = 0 - ng,
  oS = 0 + ng;
function ue(a) {
  return a.max - a.min;
}
function rS(a, l, u) {
  return Math.abs(a - l) <= u;
}
function I0(a, l, u, o = 0.5) {
  ((a.origin = o),
    (a.originPoint = Rt(l.min, l.max, a.origin)),
    (a.scale = ue(u) / ue(l)),
    (a.translate = Rt(u.min, u.max, a.origin) - a.originPoint),
    ((a.scale >= lS && a.scale <= sS) || isNaN(a.scale)) && (a.scale = 1),
    ((a.translate >= uS && a.translate <= oS) || isNaN(a.translate)) &&
      (a.translate = 0));
}
function gl(a, l, u, o) {
  (I0(a.x, l.x, u.x, o ? o.originX : void 0),
    I0(a.y, l.y, u.y, o ? o.originY : void 0));
}
function tp(a, l, u) {
  ((a.min = u.min + l.min), (a.max = a.min + ue(l)));
}
function cS(a, l, u) {
  (tp(a.x, l.x, u.x), tp(a.y, l.y, u.y));
}
function ep(a, l, u) {
  ((a.min = l.min - u.min), (a.max = a.min + ue(l)));
}
function cu(a, l, u) {
  (ep(a.x, l.x, u.x), ep(a.y, l.y, u.y));
}
function np(a, l, u, o, c) {
  return (
    (a -= l),
    (a = ru(a, 1 / u, o)),
    c !== void 0 && (a = ru(a, 1 / c, o)),
    a
  );
}
function fS(a, l = 0, u = 1, o = 0.5, c, h = a, d = a) {
  if (
    (Ie.test(l) &&
      ((l = parseFloat(l)), (l = Rt(d.min, d.max, l / 100) - d.min)),
    typeof l != "number")
  )
    return;
  let m = Rt(h.min, h.max, o);
  (a === h && (m -= l),
    (a.min = np(a.min, l, u, m, c)),
    (a.max = np(a.max, l, u, m, c)));
}
function ap(a, l, [u, o, c], h, d) {
  fS(a, l[u], l[o], l[c], l.scale, h, d);
}
const dS = ["x", "scaleX", "originX"],
  hS = ["y", "scaleY", "originY"];
function ip(a, l, u, o) {
  (ap(a.x, l, dS, u ? u.x : void 0, o ? o.x : void 0),
    ap(a.y, l, hS, u ? u.y : void 0, o ? o.y : void 0));
}
function lp(a) {
  return a.translate === 0 && a.scale === 1;
}
function ag(a) {
  return lp(a.x) && lp(a.y);
}
function sp(a, l) {
  return a.min === l.min && a.max === l.max;
}
function mS(a, l) {
  return sp(a.x, l.x) && sp(a.y, l.y);
}
function up(a, l) {
  return (
    Math.round(a.min) === Math.round(l.min) &&
    Math.round(a.max) === Math.round(l.max)
  );
}
function ig(a, l) {
  return up(a.x, l.x) && up(a.y, l.y);
}
function op(a) {
  return ue(a.x) / ue(a.y);
}
function rp(a, l) {
  return (
    a.translate === l.translate &&
    a.scale === l.scale &&
    a.originPoint === l.originPoint
  );
}
function $e(a) {
  return [a("x"), a("y")];
}
function pS(a, l, u) {
  let o = "";
  const c = a.x.translate / l.x,
    h = a.y.translate / l.y,
    d = (u == null ? void 0 : u.z) || 0;
  if (
    ((c || h || d) && (o = `translate3d(${c}px, ${h}px, ${d}px) `),
    (l.x !== 1 || l.y !== 1) && (o += `scale(${1 / l.x}, ${1 / l.y}) `),
    u)
  ) {
    const {
      transformPerspective: p,
      rotate: v,
      rotateX: b,
      rotateY: T,
      skewX: C,
      skewY: z,
    } = u;
    (p && (o = `perspective(${p}px) ${o}`),
      v && (o += `rotate(${v}deg) `),
      b && (o += `rotateX(${b}deg) `),
      T && (o += `rotateY(${T}deg) `),
      C && (o += `skewX(${C}deg) `),
      z && (o += `skewY(${z}deg) `));
  }
  const m = a.x.scale * l.x,
    g = a.y.scale * l.y;
  return ((m !== 1 || g !== 1) && (o += `scale(${m}, ${g})`), o || "none");
}
const lg = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
  yS = lg.length,
  cp = (a) => (typeof a == "string" ? parseFloat(a) : a),
  fp = (a) => typeof a == "number" || F.test(a);
function gS(a, l, u, o, c, h) {
  c
    ? ((a.opacity = Rt(0, u.opacity ?? 1, vS(o))),
      (a.opacityExit = Rt(l.opacity ?? 1, 0, xS(o))))
    : h && (a.opacity = Rt(l.opacity ?? 1, u.opacity ?? 1, o));
  for (let d = 0; d < yS; d++) {
    const m = `border${lg[d]}Radius`;
    let g = dp(l, m),
      p = dp(u, m);
    if (g === void 0 && p === void 0) continue;
    (g || (g = 0),
      p || (p = 0),
      g === 0 || p === 0 || fp(g) === fp(p)
        ? ((a[m] = Math.max(Rt(cp(g), cp(p), o), 0)),
          (Ie.test(p) || Ie.test(g)) && (a[m] += "%"))
        : (a[m] = p));
  }
  (l.rotate || u.rotate) && (a.rotate = Rt(l.rotate || 0, u.rotate || 0, o));
}
function dp(a, l) {
  return a[l] !== void 0 ? a[l] : a.borderRadius;
}
const vS = sg(0, 0.5, Pp),
  xS = sg(0.5, 0.95, He);
function sg(a, l, u) {
  return (o) => (o < a ? 0 : o > l ? 1 : u(bl(a, l, o)));
}
function bS(a, l, u) {
  const o = ae(a) ? a : hi(a);
  return (o.start(Jc("", o, l, u)), o.animation);
}
function El(a, l, u, o = { passive: !0 }) {
  return (a.addEventListener(l, u, o), () => a.removeEventListener(l, u));
}
const SS = (a, l) => a.depth - l.depth;
class TS {
  constructor() {
    ((this.children = []), (this.isDirty = !1));
  }
  add(l) {
    (_c(this.children, l), (this.isDirty = !0));
  }
  remove(l) {
    (iu(this.children, l), (this.isDirty = !0));
  }
  forEach(l) {
    (this.isDirty && this.children.sort(SS),
      (this.isDirty = !1),
      this.children.forEach(l));
  }
}
function AS(a, l) {
  const u = se.now(),
    o = ({ timestamp: c }) => {
      const h = c - u;
      h >= l && (Wn(o), a(h - l));
    };
  return (Nt.setup(o, !0), () => Wn(o));
}
function nu(a) {
  return ae(a) ? a.get() : a;
}
class ES {
  constructor() {
    this.members = [];
  }
  add(l) {
    _c(this.members, l);
    for (let u = this.members.length - 1; u >= 0; u--) {
      const o = this.members[u];
      if (o === l || o === this.lead || o === this.prevLead) continue;
      const c = o.instance;
      (!c || c.isConnected === !1) &&
        !o.snapshot &&
        (iu(this.members, o), o.unmount());
    }
    l.scheduleRender();
  }
  remove(l) {
    if (
      (iu(this.members, l),
      l === this.prevLead && (this.prevLead = void 0),
      l === this.lead)
    ) {
      const u = this.members[this.members.length - 1];
      u && this.promote(u);
    }
  }
  relegate(l) {
    var u;
    for (let o = this.members.indexOf(l) - 1; o >= 0; o--) {
      const c = this.members[o];
      if (
        c.isPresent !== !1 &&
        ((u = c.instance) == null ? void 0 : u.isConnected) !== !1
      )
        return (this.promote(c), !0);
    }
    return !1;
  }
  promote(l, u) {
    var c;
    const o = this.lead;
    if (l !== o && ((this.prevLead = o), (this.lead = l), l.show(), o)) {
      (o.updateSnapshot(), l.scheduleRender());
      const { layoutDependency: h } = o.options,
        { layoutDependency: d } = l.options;
      ((h === void 0 || h !== d) &&
        ((l.resumeFrom = o),
        u && (o.preserveOpacity = !0),
        o.snapshot &&
          ((l.snapshot = o.snapshot),
          (l.snapshot.latestValues = o.animationValues || o.latestValues)),
        (c = l.root) != null && c.isUpdating && (l.isLayoutDirty = !0)),
        l.options.crossfade === !1 && o.hide());
    }
  }
  exitAnimationComplete() {
    this.members.forEach((l) => {
      var u, o, c, h, d;
      ((o = (u = l.options).onExitComplete) == null || o.call(u),
        (d =
          (c = l.resumingFrom) == null
            ? void 0
            : (h = c.options).onExitComplete) == null || d.call(h));
    });
  }
  scheduleRender() {
    this.members.forEach((l) => l.instance && l.scheduleRender(!1));
  }
  removeLeadSnapshot() {
    var l;
    (l = this.lead) != null && l.snapshot && (this.lead.snapshot = void 0);
  }
}
const au = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 },
  Wr = ["", "X", "Y", "Z"],
  MS = 1e3;
let DS = 0;
function Pr(a, l, u, o) {
  const { latestValues: c } = l;
  c[a] && ((u[a] = c[a]), l.setStaticValue(a, 0), o && (o[a] = 0));
}
function ug(a) {
  if (((a.hasCheckedOptimisedAppear = !0), a.root === a)) return;
  const { visualElement: l } = a.options;
  if (!l) return;
  const u = Ny(l);
  if (window.MotionHasOptimisedAnimation(u, "transform")) {
    const { layout: c, layoutId: h } = a.options;
    window.MotionCancelOptimisedAnimation(u, "transform", Nt, !(c || h));
  }
  const { parent: o } = a;
  o && !o.hasCheckedOptimisedAppear && ug(o);
}
function og({
  attachResizeListener: a,
  defaultParent: l,
  measureScroll: u,
  checkIsScrollRoot: o,
  resetTransform: c,
}) {
  return class {
    constructor(d = {}, m = l == null ? void 0 : l()) {
      ((this.id = DS++),
        (this.animationId = 0),
        (this.animationCommitId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.layoutVersion = 0),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            this.nodes.forEach(CS),
            this.nodes.forEach(_S),
            this.nodes.forEach(OS),
            this.nodes.forEach(wS));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.linkedParentVersion = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = d),
        (this.root = m ? m.root || m : this),
        (this.path = m ? [...m.path, m] : []),
        (this.parent = m),
        (this.depth = m ? m.depth + 1 : 0));
      for (let g = 0; g < this.path.length; g++)
        this.path[g].shouldResetTransform = !0;
      this.root === this && (this.nodes = new TS());
    }
    addEventListener(d, m) {
      return (
        this.eventHandlers.has(d) || this.eventHandlers.set(d, new Vc()),
        this.eventHandlers.get(d).add(m)
      );
    }
    notifyListeners(d, ...m) {
      const g = this.eventHandlers.get(d);
      g && g.notify(...m);
    }
    hasListeners(d) {
      return this.eventHandlers.has(d);
    }
    mount(d) {
      if (this.instance) return;
      ((this.isSVG = tf(d) && !j2(d)), (this.instance = d));
      const { layoutId: m, layout: g, visualElement: p } = this.options;
      if (
        (p && !p.current && p.mount(d),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        this.root.hasTreeAnimated && (g || m) && (this.isLayoutDirty = !0),
        a)
      ) {
        let v,
          b = 0;
        const T = () => (this.root.updateBlockedByResize = !1);
        (Nt.read(() => {
          b = window.innerWidth;
        }),
          a(d, () => {
            const C = window.innerWidth;
            C !== b &&
              ((b = C),
              (this.root.updateBlockedByResize = !0),
              v && v(),
              (v = AS(T, 250)),
              au.hasAnimatedSinceResize &&
                ((au.hasAnimatedSinceResize = !1), this.nodes.forEach(pp)));
          }));
      }
      (m && this.root.registerSharedNode(m, this),
        this.options.animate !== !1 &&
          p &&
          (m || g) &&
          this.addEventListener(
            "didUpdate",
            ({
              delta: v,
              hasLayoutChanged: b,
              hasRelativeLayoutChanged: T,
              layout: C,
            }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              const z =
                  this.options.transition || p.getDefaultTransition() || HS,
                { onLayoutAnimationStart: B, onLayoutAnimationComplete: H } =
                  p.getProps(),
                q = !this.targetLayout || !ig(this.targetLayout, C),
                G = !b && T;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                G ||
                (b && (q || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                const L = { ...kc(z, "layout"), onPlay: B, onComplete: H };
                ((p.shouldReduceMotion || this.options.layoutRoot) &&
                  ((L.delay = 0), (L.type = !1)),
                  this.startAnimation(L),
                  this.setAnimationOrigin(v, G));
              } else
                (b || pp(this),
                  this.isLead() &&
                    this.options.onExitComplete &&
                    this.options.onExitComplete());
              this.targetLayout = C;
            },
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(),
        this.root.nodes.remove(this));
      const d = this.getStack();
      (d && d.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        this.eventHandlers.clear(),
        Wn(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return (
        this.isAnimationBlocked ||
        (this.parent && this.parent.isTreeAnimationBlocked()) ||
        !1
      );
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0),
        this.nodes && this.nodes.forEach(VS),
        this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: d } = this.options;
      return d && d.getProps().transformTemplate;
    }
    willUpdate(d = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (window.MotionCancelOptimisedAnimation &&
          !this.hasCheckedOptimisedAppear &&
          ug(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let v = 0; v < this.path.length; v++) {
        const b = this.path[v];
        ((b.shouldResetTransform = !0),
          b.updateScroll("snapshot"),
          b.options.layoutRoot && b.willUpdate(!1));
      }
      const { layoutId: m, layout: g } = this.options;
      if (m === void 0 && !g) return;
      const p = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = p
        ? p(this.latestValues, "")
        : void 0),
        this.updateSnapshot(),
        d && this.notifyListeners("willUpdate"));
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        (this.unblockUpdate(),
          this.clearAllSnapshots(),
          this.nodes.forEach(hp));
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(mp);
        return;
      }
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(RS),
            this.nodes.forEach(NS),
            this.nodes.forEach(jS))
          : this.nodes.forEach(mp),
        this.clearAllSnapshots());
      const m = se.now();
      ((ee.delta = tn(0, 1e3 / 60, m - ee.timestamp)),
        (ee.timestamp = m),
        (ee.isProcessing = !0),
        Gr.update.process(ee),
        Gr.preRender.process(ee),
        Gr.render.process(ee),
        (ee.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled ||
        ((this.updateScheduled = !0), $c.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(zS), this.sharedNodes.forEach(US));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0),
        Nt.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Nt.postRender(() => {
        this.isLayoutDirty
          ? this.root.didUpdate()
          : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot ||
        !this.instance ||
        ((this.snapshot = this.measure()),
        this.snapshot &&
          !ue(this.snapshot.measuredBox.x) &&
          !ue(this.snapshot.measuredBox.y) &&
          (this.snapshot = void 0));
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) &&
          !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let g = 0; g < this.path.length; g++) this.path[g].updateScroll();
      const d = this.layout;
      ((this.layout = this.measure(!1)),
        this.layoutVersion++,
        (this.layoutCorrected = Kt()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners("measure", this.layout.layoutBox));
      const { visualElement: m } = this.options;
      m &&
        m.notify(
          "LayoutMeasure",
          this.layout.layoutBox,
          d ? d.layoutBox : void 0,
        );
    }
    updateScroll(d = "measure") {
      let m = !!(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === d &&
          (m = !1),
        m && this.instance)
      ) {
        const g = o(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: d,
          isRoot: g,
          offset: u(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : g,
        };
      }
    }
    resetTransform() {
      if (!c) return;
      const d =
          this.isLayoutDirty ||
          this.shouldResetTransform ||
          this.options.alwaysMeasureLayout,
        m = this.projectionDelta && !ag(this.projectionDelta),
        g = this.getTransformTemplate(),
        p = g ? g(this.latestValues, "") : void 0,
        v = p !== this.prevTransformTemplateValue;
      d &&
        this.instance &&
        (m || va(this.latestValues) || v) &&
        (c(this.instance, p),
        (this.shouldResetTransform = !1),
        this.scheduleRender());
    }
    measure(d = !0) {
      const m = this.measurePageBox();
      let g = this.removeElementScroll(m);
      return (
        d && (g = this.removeTransform(g)),
        qS(g),
        {
          animationId: this.root.animationId,
          measuredBox: m,
          layoutBox: g,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      var p;
      const { visualElement: d } = this.options;
      if (!d) return Kt();
      const m = d.measureViewportBox();
      if (
        !(
          ((p = this.scroll) == null ? void 0 : p.wasRoot) || this.path.some(YS)
        )
      ) {
        const { scroll: v } = this.root;
        v && (ci(m.x, v.offset.x), ci(m.y, v.offset.y));
      }
      return m;
    }
    removeElementScroll(d) {
      var g;
      const m = Kt();
      if ((Ze(m, d), (g = this.scroll) != null && g.wasRoot)) return m;
      for (let p = 0; p < this.path.length; p++) {
        const v = this.path[p],
          { scroll: b, options: T } = v;
        v !== this.root &&
          b &&
          T.layoutScroll &&
          (b.wasRoot && Ze(m, d), ci(m.x, b.offset.x), ci(m.y, b.offset.y));
      }
      return m;
    }
    applyTransform(d, m = !1) {
      const g = Kt();
      Ze(g, d);
      for (let p = 0; p < this.path.length; p++) {
        const v = this.path[p];
        (!m &&
          v.options.layoutScroll &&
          v.scroll &&
          v !== v.root &&
          fi(g, { x: -v.scroll.offset.x, y: -v.scroll.offset.y }),
          va(v.latestValues) && fi(g, v.latestValues));
      }
      return (va(this.latestValues) && fi(g, this.latestValues), g);
    }
    removeTransform(d) {
      const m = Kt();
      Ze(m, d);
      for (let g = 0; g < this.path.length; g++) {
        const p = this.path[g];
        if (!p.instance || !va(p.latestValues)) continue;
        Ec(p.latestValues) && p.updateSnapshot();
        const v = Kt(),
          b = p.measurePageBox();
        (Ze(v, b),
          ip(m, p.latestValues, p.snapshot ? p.snapshot.layoutBox : void 0, v));
      }
      return (va(this.latestValues) && ip(m, this.latestValues), m);
    }
    setTargetDelta(d) {
      ((this.targetDelta = d),
        this.root.scheduleUpdateProjection(),
        (this.isProjectionDirty = !0));
    }
    setOptions(d) {
      this.options = {
        ...this.options,
        ...d,
        crossfade: d.crossfade !== void 0 ? d.crossfade : !0,
      };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== ee.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(d = !1) {
      var C;
      const m = this.getLead();
      (this.isProjectionDirty || (this.isProjectionDirty = m.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = m.isTransformDirty),
        this.isSharedProjectionDirty ||
          (this.isSharedProjectionDirty = m.isSharedProjectionDirty));
      const g = !!this.resumingFrom || this !== m;
      if (
        !(
          d ||
          (g && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          ((C = this.parent) != null && C.isProjectionDirty) ||
          this.attemptToResolveRelativeTarget ||
          this.root.updateBlockedByResize
        )
      )
        return;
      const { layout: v, layoutId: b } = this.options;
      if (!this.layout || !(v || b)) return;
      this.resolvedRelativeTargetAt = ee.timestamp;
      const T = this.getClosestProjectingParent();
      (T &&
        this.linkedParentVersion !== T.layoutVersion &&
        !T.options.layoutRoot &&
        this.removeRelativeTarget(),
        !this.targetDelta &&
          !this.relativeTarget &&
          (T && T.layout
            ? this.createRelativeTarget(
                T,
                this.layout.layoutBox,
                T.layout.layoutBox,
              )
            : this.removeRelativeTarget()),
        !(!this.relativeTarget && !this.targetDelta) &&
          (this.target ||
            ((this.target = Kt()), (this.targetWithTransforms = Kt())),
          this.relativeTarget &&
          this.relativeTargetOrigin &&
          this.relativeParent &&
          this.relativeParent.target
            ? (this.forceRelativeParentToResolveTarget(),
              cS(this.target, this.relativeTarget, this.relativeParent.target))
            : this.targetDelta
              ? (this.resumingFrom
                  ? (this.target = this.applyTransform(this.layout.layoutBox))
                  : Ze(this.target, this.layout.layoutBox),
                Qy(this.target, this.targetDelta))
              : Ze(this.target, this.layout.layoutBox),
          this.attemptToResolveRelativeTarget &&
            ((this.attemptToResolveRelativeTarget = !1),
            T &&
            !!T.resumingFrom == !!this.resumingFrom &&
            !T.options.layoutScroll &&
            T.target &&
            this.animationProgress !== 1
              ? this.createRelativeTarget(T, this.target, T.target)
              : (this.relativeParent = this.relativeTarget = void 0))));
    }
    getClosestProjectingParent() {
      if (
        !(
          !this.parent ||
          Ec(this.parent.latestValues) ||
          Zy(this.parent.latestValues)
        )
      )
        return this.parent.isProjecting()
          ? this.parent
          : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    createRelativeTarget(d, m, g) {
      ((this.relativeParent = d),
        (this.linkedParentVersion = d.layoutVersion),
        this.forceRelativeParentToResolveTarget(),
        (this.relativeTarget = Kt()),
        (this.relativeTargetOrigin = Kt()),
        cu(this.relativeTargetOrigin, m, g),
        Ze(this.relativeTarget, this.relativeTargetOrigin));
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      var z;
      const d = this.getLead(),
        m = !!this.resumingFrom || this !== d;
      let g = !0;
      if (
        ((this.isProjectionDirty ||
          ((z = this.parent) != null && z.isProjectionDirty)) &&
          (g = !1),
        m &&
          (this.isSharedProjectionDirty || this.isTransformDirty) &&
          (g = !1),
        this.resolvedRelativeTargetAt === ee.timestamp && (g = !1),
        g)
      )
        return;
      const { layout: p, layoutId: v } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating ||
          (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(p || v))
      )
        return;
      Ze(this.layoutCorrected, this.layout.layoutBox);
      const b = this.treeScale.x,
        T = this.treeScale.y;
      (H2(this.layoutCorrected, this.treeScale, this.path, m),
        d.layout &&
          !d.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((d.target = d.layout.layoutBox), (d.targetWithTransforms = Kt())));
      const { target: C } = d;
      if (!C) {
        this.prevProjectionDelta &&
          (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : ($0(this.prevProjectionDelta.x, this.projectionDelta.x),
          $0(this.prevProjectionDelta.y, this.projectionDelta.y)),
        gl(this.projectionDelta, this.layoutCorrected, C, this.latestValues),
        (this.treeScale.x !== b ||
          this.treeScale.y !== T ||
          !rp(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !rp(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners("projectionUpdate", C)));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(d = !0) {
      var m;
      if (((m = this.options.visualElement) == null || m.scheduleRender(), d)) {
        const g = this.getStack();
        g && g.scheduleRender();
      }
      this.resumingFrom &&
        !this.resumingFrom.instance &&
        (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = ri()),
        (this.projectionDelta = ri()),
        (this.projectionDeltaWithTransform = ri()));
    }
    setAnimationOrigin(d, m = !1) {
      const g = this.snapshot,
        p = g ? g.latestValues : {},
        v = { ...this.latestValues },
        b = ri();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !m));
      const T = Kt(),
        C = g ? g.source : void 0,
        z = this.layout ? this.layout.source : void 0,
        B = C !== z,
        H = this.getStack(),
        q = !H || H.members.length <= 1,
        G = !!(B && !q && this.options.crossfade === !0 && !this.path.some(LS));
      this.animationProgress = 0;
      let L;
      ((this.mixTargetDelta = (Z) => {
        const Q = Z / 1e3;
        (yp(b.x, d.x, Q),
          yp(b.y, d.y, Q),
          this.setTargetDelta(b),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (cu(T, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            BS(this.relativeTarget, this.relativeTargetOrigin, T, Q),
            L && mS(this.relativeTarget, L) && (this.isProjectionDirty = !1),
            L || (L = Kt()),
            Ze(L, this.relativeTarget)),
          B &&
            ((this.animationValues = v), gS(v, p, this.latestValues, Q, G, q)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = Q));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(d) {
      var m, g, p;
      (this.notifyListeners("animationStart"),
        (m = this.currentAnimation) == null || m.stop(),
        (p = (g = this.resumingFrom) == null ? void 0 : g.currentAnimation) ==
          null || p.stop(),
        this.pendingAnimation &&
          (Wn(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = Nt.update(() => {
          ((au.hasAnimatedSinceResize = !0),
            this.motionValue || (this.motionValue = hi(0)),
            this.motionValue.jump(0, !1),
            (this.currentAnimation = bS(this.motionValue, [0, 1e3], {
              ...d,
              velocity: 0,
              isSync: !0,
              onUpdate: (v) => {
                (this.mixTargetDelta(v), d.onUpdate && d.onUpdate(v));
              },
              onStop: () => {},
              onComplete: () => {
                (d.onComplete && d.onComplete(), this.completeAnimation());
              },
            })),
            this.resumingFrom &&
              (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const d = this.getStack();
      (d && d.exitAnimationComplete(),
        (this.resumingFrom =
          this.currentAnimation =
          this.animationValues =
            void 0),
        this.notifyListeners("animationComplete"));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(MS),
        this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      const d = this.getLead();
      let {
        targetWithTransforms: m,
        target: g,
        layout: p,
        latestValues: v,
      } = d;
      if (!(!m || !g || !p)) {
        if (
          this !== d &&
          this.layout &&
          p &&
          rg(this.options.animationType, this.layout.layoutBox, p.layoutBox)
        ) {
          g = this.target || Kt();
          const b = ue(this.layout.layoutBox.x);
          ((g.x.min = d.target.x.min), (g.x.max = g.x.min + b));
          const T = ue(this.layout.layoutBox.y);
          ((g.y.min = d.target.y.min), (g.y.max = g.y.min + T));
        }
        (Ze(m, g),
          fi(m, v),
          gl(this.projectionDeltaWithTransform, this.layoutCorrected, m, v));
      }
    }
    registerSharedNode(d, m) {
      (this.sharedNodes.has(d) || this.sharedNodes.set(d, new ES()),
        this.sharedNodes.get(d).add(m));
      const p = m.options.initialPromotionConfig;
      m.promote({
        transition: p ? p.transition : void 0,
        preserveFollowOpacity:
          p && p.shouldPreserveFollowOpacity
            ? p.shouldPreserveFollowOpacity(m)
            : void 0,
      });
    }
    isLead() {
      const d = this.getStack();
      return d ? d.lead === this : !0;
    }
    getLead() {
      var m;
      const { layoutId: d } = this.options;
      return d
        ? ((m = this.getStack()) == null ? void 0 : m.lead) || this
        : this;
    }
    getPrevLead() {
      var m;
      const { layoutId: d } = this.options;
      return d ? ((m = this.getStack()) == null ? void 0 : m.prevLead) : void 0;
    }
    getStack() {
      const { layoutId: d } = this.options;
      if (d) return this.root.sharedNodes.get(d);
    }
    promote({ needsReset: d, transition: m, preserveFollowOpacity: g } = {}) {
      const p = this.getStack();
      (p && p.promote(this, g),
        d && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        m && this.setOptions({ transition: m }));
    }
    relegate() {
      const d = this.getStack();
      return d ? d.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: d } = this.options;
      if (!d) return;
      let m = !1;
      const { latestValues: g } = d;
      if (
        ((g.z ||
          g.rotate ||
          g.rotateX ||
          g.rotateY ||
          g.rotateZ ||
          g.skewX ||
          g.skewY) &&
          (m = !0),
        !m)
      )
        return;
      const p = {};
      g.z && Pr("z", d, p, this.animationValues);
      for (let v = 0; v < Wr.length; v++)
        (Pr(`rotate${Wr[v]}`, d, p, this.animationValues),
          Pr(`skew${Wr[v]}`, d, p, this.animationValues));
      d.render();
      for (const v in p)
        (d.setStaticValue(v, p[v]),
          this.animationValues && (this.animationValues[v] = p[v]));
      d.scheduleRender();
    }
    applyProjectionStyles(d, m) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) {
        d.visibility = "hidden";
        return;
      }
      const g = this.getTransformTemplate();
      if (this.needsReset) {
        ((this.needsReset = !1),
          (d.visibility = ""),
          (d.opacity = ""),
          (d.pointerEvents = nu(m == null ? void 0 : m.pointerEvents) || ""),
          (d.transform = g ? g(this.latestValues, "") : "none"));
        return;
      }
      const p = this.getLead();
      if (!this.projectionDelta || !this.layout || !p.target) {
        (this.options.layoutId &&
          ((d.opacity =
            this.latestValues.opacity !== void 0
              ? this.latestValues.opacity
              : 1),
          (d.pointerEvents = nu(m == null ? void 0 : m.pointerEvents) || "")),
          this.hasProjected &&
            !va(this.latestValues) &&
            ((d.transform = g ? g({}, "") : "none"), (this.hasProjected = !1)));
        return;
      }
      d.visibility = "";
      const v = p.animationValues || p.latestValues;
      this.applyTransformsToTarget();
      let b = pS(this.projectionDeltaWithTransform, this.treeScale, v);
      (g && (b = g(v, b)), (d.transform = b));
      const { x: T, y: C } = this.projectionDelta;
      ((d.transformOrigin = `${T.origin * 100}% ${C.origin * 100}% 0`),
        p.animationValues
          ? (d.opacity =
              p === this
                ? (v.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : v.opacityExit)
          : (d.opacity =
              p === this
                ? v.opacity !== void 0
                  ? v.opacity
                  : ""
                : v.opacityExit !== void 0
                  ? v.opacityExit
                  : 0));
      for (const z in Dc) {
        if (v[z] === void 0) continue;
        const { correct: B, applyTo: H, isCSSVariable: q } = Dc[z],
          G = b === "none" ? v[z] : B(v[z], p);
        if (H) {
          const L = H.length;
          for (let Z = 0; Z < L; Z++) d[H[Z]] = G;
        } else
          q ? (this.options.visualElement.renderState.vars[z] = G) : (d[z] = G);
      }
      this.options.layoutId &&
        (d.pointerEvents =
          p === this ? nu(m == null ? void 0 : m.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((d) => {
        var m;
        return (m = d.currentAnimation) == null ? void 0 : m.stop();
      }),
        this.root.nodes.forEach(hp),
        this.root.sharedNodes.clear());
    }
  };
}
function NS(a) {
  a.updateLayout();
}
function jS(a) {
  var u;
  const l = ((u = a.resumeFrom) == null ? void 0 : u.snapshot) || a.snapshot;
  if (a.isLead() && a.layout && l && a.hasListeners("didUpdate")) {
    const { layoutBox: o, measuredBox: c } = a.layout,
      { animationType: h } = a.options,
      d = l.source !== a.layout.source;
    h === "size"
      ? $e((b) => {
          const T = d ? l.measuredBox[b] : l.layoutBox[b],
            C = ue(T);
          ((T.min = o[b].min), (T.max = T.min + C));
        })
      : rg(h, l.layoutBox, o) &&
        $e((b) => {
          const T = d ? l.measuredBox[b] : l.layoutBox[b],
            C = ue(o[b]);
          ((T.max = T.min + C),
            a.relativeTarget &&
              !a.currentAnimation &&
              ((a.isProjectionDirty = !0),
              (a.relativeTarget[b].max = a.relativeTarget[b].min + C)));
        });
    const m = ri();
    gl(m, o, l.layoutBox);
    const g = ri();
    d ? gl(g, a.applyTransform(c, !0), l.measuredBox) : gl(g, o, l.layoutBox);
    const p = !ag(m);
    let v = !1;
    if (!a.resumeFrom) {
      const b = a.getClosestProjectingParent();
      if (b && !b.resumeFrom) {
        const { snapshot: T, layout: C } = b;
        if (T && C) {
          const z = Kt();
          cu(z, l.layoutBox, T.layoutBox);
          const B = Kt();
          (cu(B, o, C.layoutBox),
            ig(z, B) || (v = !0),
            b.options.layoutRoot &&
              ((a.relativeTarget = B),
              (a.relativeTargetOrigin = z),
              (a.relativeParent = b)));
        }
      }
    }
    a.notifyListeners("didUpdate", {
      layout: o,
      snapshot: l,
      delta: g,
      layoutDelta: m,
      hasLayoutChanged: p,
      hasRelativeLayoutChanged: v,
    });
  } else if (a.isLead()) {
    const { onExitComplete: o } = a.options;
    o && o();
  }
  a.options.transition = void 0;
}
function CS(a) {
  a.parent &&
    (a.isProjecting() || (a.isProjectionDirty = a.parent.isProjectionDirty),
    a.isSharedProjectionDirty ||
      (a.isSharedProjectionDirty = !!(
        a.isProjectionDirty ||
        a.parent.isProjectionDirty ||
        a.parent.isSharedProjectionDirty
      )),
    a.isTransformDirty || (a.isTransformDirty = a.parent.isTransformDirty));
}
function wS(a) {
  a.isProjectionDirty = a.isSharedProjectionDirty = a.isTransformDirty = !1;
}
function zS(a) {
  a.clearSnapshot();
}
function hp(a) {
  a.clearMeasurements();
}
function mp(a) {
  a.isLayoutDirty = !1;
}
function RS(a) {
  const { visualElement: l } = a.options;
  (l && l.getProps().onBeforeLayoutMeasure && l.notify("BeforeLayoutMeasure"),
    a.resetTransform());
}
function pp(a) {
  (a.finishAnimation(),
    (a.targetDelta = a.relativeTarget = a.target = void 0),
    (a.isProjectionDirty = !0));
}
function _S(a) {
  a.resolveTargetDelta();
}
function OS(a) {
  a.calcProjection();
}
function VS(a) {
  a.resetSkewAndRotation();
}
function US(a) {
  a.removeLeadSnapshot();
}
function yp(a, l, u) {
  ((a.translate = Rt(l.translate, 0, u)),
    (a.scale = Rt(l.scale, 1, u)),
    (a.origin = l.origin),
    (a.originPoint = l.originPoint));
}
function gp(a, l, u, o) {
  ((a.min = Rt(l.min, u.min, o)), (a.max = Rt(l.max, u.max, o)));
}
function BS(a, l, u, o) {
  (gp(a.x, l.x, u.x, o), gp(a.y, l.y, u.y, o));
}
function LS(a) {
  return a.animationValues && a.animationValues.opacityExit !== void 0;
}
const HS = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  vp = (a) =>
    typeof navigator < "u" &&
    navigator.userAgent &&
    navigator.userAgent.toLowerCase().includes(a),
  xp = vp("applewebkit/") && !vp("chrome/") ? Math.round : He;
function bp(a) {
  ((a.min = xp(a.min)), (a.max = xp(a.max)));
}
function qS(a) {
  (bp(a.x), bp(a.y));
}
function rg(a, l, u) {
  return (
    a === "position" || (a === "preserve-aspect" && !rS(op(l), op(u), 0.2))
  );
}
function YS(a) {
  var l;
  return a !== a.root && ((l = a.scroll) == null ? void 0 : l.wasRoot);
}
const GS = og({
    attachResizeListener: (a, l) => El(a, "resize", l),
    measureScroll: () => {
      var a, l;
      return {
        x:
          document.documentElement.scrollLeft ||
          ((a = document.body) == null ? void 0 : a.scrollLeft) ||
          0,
        y:
          document.documentElement.scrollTop ||
          ((l = document.body) == null ? void 0 : l.scrollTop) ||
          0,
      };
    },
    checkIsScrollRoot: () => !0,
  }),
  $r = { current: void 0 },
  cg = og({
    measureScroll: (a) => ({ x: a.scrollLeft, y: a.scrollTop }),
    defaultParent: () => {
      if (!$r.current) {
        const a = new GS({});
        (a.mount(window), a.setOptions({ layoutScroll: !0 }), ($r.current = a));
      }
      return $r.current;
    },
    resetTransform: (a, l) => {
      a.style.transform = l !== void 0 ? l : "none";
    },
    checkIsScrollRoot: (a) => window.getComputedStyle(a).position === "fixed",
  }),
  sf = Y.createContext({
    transformPagePoint: (a) => a,
    isStatic: !1,
    reducedMotion: "never",
  });
function Sp(a, l) {
  if (typeof a == "function") return a(l);
  a != null && (a.current = l);
}
function XS(...a) {
  return (l) => {
    let u = !1;
    const o = a.map((c) => {
      const h = Sp(c, l);
      return (!u && typeof h == "function" && (u = !0), h);
    });
    if (u)
      return () => {
        for (let c = 0; c < o.length; c++) {
          const h = o[c];
          typeof h == "function" ? h() : Sp(a[c], null);
        }
      };
  };
}
function ZS(...a) {
  return Y.useCallback(XS(...a), a);
}
class QS extends Y.Component {
  getSnapshotBeforeUpdate(l) {
    const u = this.props.childRef.current;
    if (u && l.isPresent && !this.props.isPresent && this.props.pop !== !1) {
      const o = u.offsetParent,
        c = (Tc(o) && o.offsetWidth) || 0,
        h = (Tc(o) && o.offsetHeight) || 0,
        d = this.props.sizeRef.current;
      ((d.height = u.offsetHeight || 0),
        (d.width = u.offsetWidth || 0),
        (d.top = u.offsetTop),
        (d.left = u.offsetLeft),
        (d.right = c - d.width - d.left),
        (d.bottom = h - d.height - d.top));
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
}
function KS({
  children: a,
  isPresent: l,
  anchorX: u,
  anchorY: o,
  root: c,
  pop: h,
}) {
  var T;
  const d = Y.useId(),
    m = Y.useRef(null),
    g = Y.useRef({ width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 }),
    { nonce: p } = Y.useContext(sf),
    v =
      ((T = a.props) == null ? void 0 : T.ref) ?? (a == null ? void 0 : a.ref),
    b = ZS(m, v);
  return (
    Y.useInsertionEffect(() => {
      const {
        width: C,
        height: z,
        top: B,
        left: H,
        right: q,
        bottom: G,
      } = g.current;
      if (l || h === !1 || !m.current || !C || !z) return;
      const L = u === "left" ? `left: ${H}` : `right: ${q}`,
        Z = o === "bottom" ? `bottom: ${G}` : `top: ${B}`;
      m.current.dataset.motionPopId = d;
      const Q = document.createElement("style");
      p && (Q.nonce = p);
      const nt = c ?? document.head;
      return (
        nt.appendChild(Q),
        Q.sheet &&
          Q.sheet.insertRule(`
          [data-motion-pop-id="${d}"] {
            position: absolute !important;
            width: ${C}px !important;
            height: ${z}px !important;
            ${L}px !important;
            ${Z}px !important;
          }
        `),
        () => {
          nt.contains(Q) && nt.removeChild(Q);
        }
      );
    }, [l]),
    x.jsx(QS, {
      isPresent: l,
      childRef: m,
      sizeRef: g,
      pop: h,
      children: h === !1 ? a : Y.cloneElement(a, { ref: b }),
    })
  );
}
const kS = ({
  children: a,
  initial: l,
  isPresent: u,
  onExitComplete: o,
  custom: c,
  presenceAffectsLayout: h,
  mode: d,
  anchorX: m,
  anchorY: g,
  root: p,
}) => {
  const v = Rc(JS),
    b = Y.useId();
  let T = !0,
    C = Y.useMemo(
      () => (
        (T = !1),
        {
          id: b,
          initial: l,
          isPresent: u,
          custom: c,
          onExitComplete: (z) => {
            v.set(z, !0);
            for (const B of v.values()) if (!B) return;
            o && o();
          },
          register: (z) => (v.set(z, !1), () => v.delete(z)),
        }
      ),
      [u, v, o],
    );
  return (
    h && T && (C = { ...C }),
    Y.useMemo(() => {
      v.forEach((z, B) => v.set(B, !1));
    }, [u]),
    Y.useEffect(() => {
      !u && !v.size && o && o();
    }, [u]),
    (a = x.jsx(KS, {
      pop: d === "popLayout",
      isPresent: u,
      anchorX: m,
      anchorY: g,
      root: p,
      children: a,
    })),
    x.jsx(du.Provider, { value: C, children: a })
  );
};
function JS() {
  return new Map();
}
function fg(a = !0) {
  const l = Y.useContext(du);
  if (l === null) return [!0, null];
  const { isPresent: u, onExitComplete: o, register: c } = l,
    h = Y.useId();
  Y.useEffect(() => {
    if (a) return c(h);
  }, [a]);
  const d = Y.useCallback(() => a && o && o(h), [h, o, a]);
  return !u && o ? [!1, d] : [!0];
}
const Ws = (a) => a.key || "";
function Tp(a) {
  const l = [];
  return (
    Y.Children.forEach(a, (u) => {
      Y.isValidElement(u) && l.push(u);
    }),
    l
  );
}
const FS = ({
    children: a,
    custom: l,
    initial: u = !0,
    onExitComplete: o,
    presenceAffectsLayout: c = !0,
    mode: h = "sync",
    propagate: d = !1,
    anchorX: m = "left",
    anchorY: g = "top",
    root: p,
  }) => {
    const [v, b] = fg(d),
      T = Y.useMemo(() => Tp(a), [a]),
      C = d && !v ? [] : T.map(Ws),
      z = Y.useRef(!0),
      B = Y.useRef(T),
      H = Rc(() => new Map()),
      q = Y.useRef(new Set()),
      [G, L] = Y.useState(T),
      [Z, Q] = Y.useState(T);
    Hp(() => {
      ((z.current = !1), (B.current = T));
      for (let $ = 0; $ < Z.length; $++) {
        const at = Ws(Z[$]);
        C.includes(at)
          ? (H.delete(at), q.current.delete(at))
          : H.get(at) !== !0 && H.set(at, !1);
      }
    }, [Z, C.length, C.join("-")]);
    const nt = [];
    if (T !== G) {
      let $ = [...T];
      for (let at = 0; at < Z.length; at++) {
        const Dt = Z[at],
          kt = Ws(Dt);
        C.includes(kt) || ($.splice(at, 0, Dt), nt.push(Dt));
      }
      return (h === "wait" && nt.length && ($ = nt), Q(Tp($)), L(T), null);
    }
    const { forceRender: P } = Y.useContext(zc);
    return x.jsx(x.Fragment, {
      children: Z.map(($) => {
        const at = Ws($),
          Dt = d && !v ? !1 : T === Z || C.includes(at),
          kt = () => {
            if (q.current.has(at)) return;
            if ((q.current.add(at), H.has(at))) H.set(at, !0);
            else return;
            let zt = !0;
            (H.forEach((Ne) => {
              Ne || (zt = !1);
            }),
              zt &&
                (P == null || P(),
                Q(B.current),
                d && (b == null || b()),
                o && o()));
          };
        return x.jsx(
          kS,
          {
            isPresent: Dt,
            initial: !z.current || u ? void 0 : !1,
            custom: l,
            presenceAffectsLayout: c,
            mode: h,
            root: p,
            onExitComplete: Dt ? void 0 : kt,
            anchorX: m,
            anchorY: g,
            children: $,
          },
          at,
        );
      }),
    });
  },
  dg = Y.createContext({ strict: !1 }),
  Ap = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag",
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"],
  };
let Ep = !1;
function WS() {
  if (Ep) return;
  const a = {};
  for (const l in Ap) a[l] = { isEnabled: (u) => Ap[l].some((o) => !!u[o]) };
  (Yy(a), (Ep = !0));
}
function hg() {
  return (WS(), V2());
}
function PS(a) {
  const l = hg();
  for (const u in a) l[u] = { ...l[u], ...a[u] };
  Yy(l);
}
const $S = new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport",
]);
function fu(a) {
  return (
    a.startsWith("while") ||
    (a.startsWith("drag") && a !== "draggable") ||
    a.startsWith("layout") ||
    a.startsWith("onTap") ||
    a.startsWith("onPan") ||
    a.startsWith("onLayout") ||
    $S.has(a)
  );
}
let mg = (a) => !fu(a);
function IS(a) {
  typeof a == "function" && (mg = (l) => (l.startsWith("on") ? !fu(l) : a(l)));
}
try {
  IS(require("@emotion/is-prop-valid").default);
} catch {}
function tT(a, l, u) {
  const o = {};
  for (const c in a)
    (c === "values" && typeof a.values == "object") ||
      ((mg(c) ||
        (u === !0 && fu(c)) ||
        (!l && !fu(c)) ||
        (a.draggable && c.startsWith("onDrag"))) &&
        (o[c] = a[c]));
  return o;
}
const pu = Y.createContext({});
function eT(a, l) {
  if (mu(a)) {
    const { initial: u, animate: o } = a;
    return {
      initial: u === !1 || Al(u) ? u : void 0,
      animate: Al(o) ? o : void 0,
    };
  }
  return a.inherit !== !1 ? l : {};
}
function nT(a) {
  const { initial: l, animate: u } = eT(a, Y.useContext(pu));
  return Y.useMemo(() => ({ initial: l, animate: u }), [Mp(l), Mp(u)]);
}
function Mp(a) {
  return Array.isArray(a) ? a.join(" ") : a;
}
const uf = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function pg(a, l, u) {
  for (const o in l) !ae(l[o]) && !Jy(o, u) && (a[o] = l[o]);
}
function aT({ transformTemplate: a }, l) {
  return Y.useMemo(() => {
    const u = uf();
    return (af(u, l, a), Object.assign({}, u.vars, u.style));
  }, [l]);
}
function iT(a, l) {
  const u = a.style || {},
    o = {};
  return (pg(o, u, a), Object.assign(o, aT(a, l)), o);
}
function lT(a, l) {
  const u = {},
    o = iT(a, l);
  return (
    a.drag &&
      a.dragListener !== !1 &&
      ((u.draggable = !1),
      (o.userSelect = o.WebkitUserSelect = o.WebkitTouchCallout = "none"),
      (o.touchAction =
        a.drag === !0 ? "none" : `pan-${a.drag === "x" ? "y" : "x"}`)),
    a.tabIndex === void 0 &&
      (a.onTap || a.onTapStart || a.whileTap) &&
      (u.tabIndex = 0),
    (u.style = o),
    u
  );
}
const yg = () => ({ ...uf(), attrs: {} });
function sT(a, l, u, o) {
  const c = Y.useMemo(() => {
    const h = yg();
    return (
      Fy(h, l, Py(o), a.transformTemplate, a.style),
      { ...h.attrs, style: { ...h.style } }
    );
  }, [l]);
  if (a.style) {
    const h = {};
    (pg(h, a.style, a), (c.style = { ...h, ...c.style }));
  }
  return c;
}
const uT = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view",
];
function of(a) {
  return typeof a != "string" || a.includes("-")
    ? !1
    : !!(uT.indexOf(a) > -1 || /[A-Z]/u.test(a));
}
function oT(a, l, u, { latestValues: o }, c, h = !1, d) {
  const g = ((d ?? of(a)) ? sT : lT)(l, o, c, a),
    p = tT(l, typeof a == "string", h),
    v = a !== Y.Fragment ? { ...p, ...g, ref: u } : {},
    { children: b } = l,
    T = Y.useMemo(() => (ae(b) ? b.get() : b), [b]);
  return Y.createElement(a, { ...v, children: T });
}
function rT({ scrapeMotionValuesFromProps: a, createRenderState: l }, u, o, c) {
  return { latestValues: cT(u, o, c, a), renderState: l() };
}
function cT(a, l, u, o) {
  const c = {},
    h = o(a, {});
  for (const T in h) c[T] = nu(h[T]);
  let { initial: d, animate: m } = a;
  const g = mu(a),
    p = Hy(a);
  l &&
    p &&
    !g &&
    a.inherit !== !1 &&
    (d === void 0 && (d = l.initial), m === void 0 && (m = l.animate));
  let v = u ? u.initial === !1 : !1;
  v = v || d === !1;
  const b = v ? m : d;
  if (b && typeof b != "boolean" && !hu(b)) {
    const T = Array.isArray(b) ? b : [b];
    for (let C = 0; C < T.length; C++) {
      const z = Fc(a, T[C]);
      if (z) {
        const { transitionEnd: B, transition: H, ...q } = z;
        for (const G in q) {
          let L = q[G];
          if (Array.isArray(L)) {
            const Z = v ? L.length - 1 : 0;
            L = L[Z];
          }
          L !== null && (c[G] = L);
        }
        for (const G in B) c[G] = B[G];
      }
    }
  }
  return c;
}
const gg = (a) => (l, u) => {
    const o = Y.useContext(pu),
      c = Y.useContext(du),
      h = () => rT(a, l, o, c);
    return u ? h() : Rc(h);
  },
  fT = gg({ scrapeMotionValuesFromProps: lf, createRenderState: uf }),
  dT = gg({ scrapeMotionValuesFromProps: $y, createRenderState: yg }),
  hT = Symbol.for("motionComponentSymbol");
function mT(a, l, u) {
  const o = Y.useRef(u);
  Y.useInsertionEffect(() => {
    o.current = u;
  });
  const c = Y.useRef(null);
  return Y.useCallback(
    (h) => {
      var m;
      (h && ((m = a.onMount) == null || m.call(a, h)),
        l && (h ? l.mount(h) : l.unmount()));
      const d = o.current;
      if (typeof d == "function")
        if (h) {
          const g = d(h);
          typeof g == "function" && (c.current = g);
        } else c.current ? (c.current(), (c.current = null)) : d(h);
      else d && (d.current = h);
    },
    [l],
  );
}
const vg = Y.createContext({});
function si(a) {
  return (
    a &&
    typeof a == "object" &&
    Object.prototype.hasOwnProperty.call(a, "current")
  );
}
function pT(a, l, u, o, c, h) {
  var L, Z;
  const { visualElement: d } = Y.useContext(pu),
    m = Y.useContext(dg),
    g = Y.useContext(du),
    p = Y.useContext(sf),
    v = p.reducedMotion,
    b = p.skipAnimations,
    T = Y.useRef(null),
    C = Y.useRef(!1);
  ((o = o || m.renderer),
    !T.current &&
      o &&
      ((T.current = o(a, {
        visualState: l,
        parent: d,
        props: u,
        presenceContext: g,
        blockInitialAnimation: g ? g.initial === !1 : !1,
        reducedMotionConfig: v,
        skipAnimations: b,
        isSVG: h,
      })),
      C.current && T.current && (T.current.manuallyAnimateOnMount = !0)));
  const z = T.current,
    B = Y.useContext(vg);
  z &&
    !z.projection &&
    c &&
    (z.type === "html" || z.type === "svg") &&
    yT(T.current, u, c, B);
  const H = Y.useRef(!1);
  Y.useInsertionEffect(() => {
    z && H.current && z.update(u, g);
  });
  const q = u[Dy],
    G = Y.useRef(
      !!q &&
        typeof window < "u" &&
        !((L = window.MotionHandoffIsComplete) != null && L.call(window, q)) &&
        ((Z = window.MotionHasOptimisedAnimation) == null
          ? void 0
          : Z.call(window, q)),
    );
  return (
    Hp(() => {
      ((C.current = !0),
        z &&
          ((H.current = !0),
          (window.MotionIsMounted = !0),
          z.updateFeatures(),
          z.scheduleRenderMicrotask(),
          G.current && z.animationState && z.animationState.animateChanges()));
    }),
    Y.useEffect(() => {
      z &&
        (!G.current && z.animationState && z.animationState.animateChanges(),
        G.current &&
          (queueMicrotask(() => {
            var Q;
            (Q = window.MotionHandoffMarkAsComplete) == null ||
              Q.call(window, q);
          }),
          (G.current = !1)),
        (z.enteringChildren = void 0));
    }),
    z
  );
}
function yT(a, l, u, o) {
  const {
    layoutId: c,
    layout: h,
    drag: d,
    dragConstraints: m,
    layoutScroll: g,
    layoutRoot: p,
    layoutCrossfade: v,
  } = l;
  ((a.projection = new u(
    a.latestValues,
    l["data-framer-portal-id"] ? void 0 : xg(a.parent),
  )),
    a.projection.setOptions({
      layoutId: c,
      layout: h,
      alwaysMeasureLayout: !!d || (m && si(m)),
      visualElement: a,
      animationType: typeof h == "string" ? h : "both",
      initialPromotionConfig: o,
      crossfade: v,
      layoutScroll: g,
      layoutRoot: p,
    }));
}
function xg(a) {
  if (a) return a.options.allowProjection !== !1 ? a.projection : xg(a.parent);
}
function Ir(a, { forwardMotionProps: l = !1, type: u } = {}, o, c) {
  o && PS(o);
  const h = u ? u === "svg" : of(a),
    d = h ? dT : fT;
  function m(p, v) {
    let b;
    const T = { ...Y.useContext(sf), ...p, layoutId: gT(p) },
      { isStatic: C } = T,
      z = nT(p),
      B = d(p, C);
    if (!C && typeof window < "u") {
      vT();
      const H = xT(T);
      ((b = H.MeasureLayout),
        (z.visualElement = pT(a, B, T, c, H.ProjectionNode, h)));
    }
    return x.jsxs(pu.Provider, {
      value: z,
      children: [
        b && z.visualElement
          ? x.jsx(b, { visualElement: z.visualElement, ...T })
          : null,
        oT(a, p, mT(B, z.visualElement, v), B, C, l, h),
      ],
    });
  }
  m.displayName = `motion.${typeof a == "string" ? a : `create(${a.displayName ?? a.name ?? ""})`}`;
  const g = Y.forwardRef(m);
  return ((g[hT] = a), g);
}
function gT({ layoutId: a }) {
  const l = Y.useContext(zc).id;
  return l && a !== void 0 ? l + "-" + a : a;
}
function vT(a, l) {
  Y.useContext(dg).strict;
}
function xT(a) {
  const l = hg(),
    { drag: u, layout: o } = l;
  if (!u && !o) return {};
  const c = { ...u, ...o };
  return {
    MeasureLayout:
      (u != null && u.isEnabled(a)) || (o != null && o.isEnabled(a))
        ? c.MeasureLayout
        : void 0,
    ProjectionNode: c.ProjectionNode,
  };
}
function bT(a, l) {
  if (typeof Proxy > "u") return Ir;
  const u = new Map(),
    o = (h, d) => Ir(h, d, a, l),
    c = (h, d) => o(h, d);
  return new Proxy(c, {
    get: (h, d) =>
      d === "create"
        ? o
        : (u.has(d) || u.set(d, Ir(d, void 0, a, l)), u.get(d)),
  });
}
const ST = (a, l) =>
  (l.isSVG ?? of(a))
    ? new $2(l)
    : new K2(l, { allowProjection: a !== Y.Fragment });
class TT extends Pn {
  constructor(l) {
    (super(l), l.animationState || (l.animationState = aS(l)));
  }
  updateAnimationControlsSubscription() {
    const { animate: l } = this.node.getProps();
    hu(l) && (this.unmountControls = l.subscribe(this.node));
  }
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: l } = this.node.getProps(),
      { animate: u } = this.node.prevProps || {};
    l !== u && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var l;
    (this.node.animationState.reset(),
      (l = this.unmountControls) == null || l.call(this));
  }
}
let AT = 0;
class ET extends Pn {
  constructor() {
    (super(...arguments), (this.id = AT++));
  }
  update() {
    if (!this.node.presenceContext) return;
    const { isPresent: l, onExitComplete: u } = this.node.presenceContext,
      { isPresent: o } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || l === o) return;
    const c = this.node.animationState.setActive("exit", !l);
    u &&
      !l &&
      c.then(() => {
        u(this.id);
      });
  }
  mount() {
    const { register: l, onExitComplete: u } = this.node.presenceContext || {};
    (u && u(this.id), l && (this.unmount = l(this.id)));
  }
  unmount() {}
}
const MT = { animation: { Feature: TT }, exit: { Feature: ET } };
function Cl(a) {
  return { point: { x: a.pageX, y: a.pageY } };
}
const DT = (a) => (l) => Ic(l) && a(l, Cl(l));
function vl(a, l, u, o) {
  return El(a, l, DT(u), o);
}
const bg = ({ current: a }) => (a ? a.ownerDocument.defaultView : null),
  Dp = (a, l) => Math.abs(a - l);
function NT(a, l) {
  const u = Dp(a.x, l.x),
    o = Dp(a.y, l.y);
  return Math.sqrt(u ** 2 + o ** 2);
}
const Np = new Set(["auto", "scroll"]);
class Sg {
  constructor(
    l,
    u,
    {
      transformPagePoint: o,
      contextWindow: c = window,
      dragSnapToOrigin: h = !1,
      distanceThreshold: d = 3,
      element: m,
    } = {},
  ) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.scrollPositions = new Map()),
      (this.removeScrollListeners = null),
      (this.onElementScroll = (C) => {
        this.handleScroll(C.target);
      }),
      (this.onWindowScroll = () => {
        this.handleScroll(window);
      }),
      (this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        const C = ec(this.lastMoveEventInfo, this.history),
          z = this.startEvent !== null,
          B = NT(C.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!z && !B) return;
        const { point: H } = C,
          { timestamp: q } = ee;
        this.history.push({ ...H, timestamp: q });
        const { onStart: G, onMove: L } = this.handlers;
        (z ||
          (G && G(this.lastMoveEvent, C),
          (this.startEvent = this.lastMoveEvent)),
          L && L(this.lastMoveEvent, C));
      }),
      (this.handlePointerMove = (C, z) => {
        ((this.lastMoveEvent = C),
          (this.lastMoveEventInfo = tc(z, this.transformPagePoint)),
          Nt.update(this.updatePoint, !0));
      }),
      (this.handlePointerUp = (C, z) => {
        this.end();
        const { onEnd: B, onSessionEnd: H, resumeAnimation: q } = this.handlers;
        if (
          ((this.dragSnapToOrigin || !this.startEvent) && q && q(),
          !(this.lastMoveEvent && this.lastMoveEventInfo))
        )
          return;
        const G = ec(
          C.type === "pointercancel"
            ? this.lastMoveEventInfo
            : tc(z, this.transformPagePoint),
          this.history,
        );
        (this.startEvent && B && B(C, G), H && H(C, G));
      }),
      !Ic(l))
    )
      return;
    ((this.dragSnapToOrigin = h),
      (this.handlers = u),
      (this.transformPagePoint = o),
      (this.distanceThreshold = d),
      (this.contextWindow = c || window));
    const g = Cl(l),
      p = tc(g, this.transformPagePoint),
      { point: v } = p,
      { timestamp: b } = ee;
    this.history = [{ ...v, timestamp: b }];
    const { onSessionStart: T } = u;
    (T && T(l, ec(p, this.history)),
      (this.removeListeners = Dl(
        vl(this.contextWindow, "pointermove", this.handlePointerMove),
        vl(this.contextWindow, "pointerup", this.handlePointerUp),
        vl(this.contextWindow, "pointercancel", this.handlePointerUp),
      )),
      m && this.startScrollTracking(m));
  }
  startScrollTracking(l) {
    let u = l.parentElement;
    for (; u; ) {
      const o = getComputedStyle(u);
      ((Np.has(o.overflowX) || Np.has(o.overflowY)) &&
        this.scrollPositions.set(u, { x: u.scrollLeft, y: u.scrollTop }),
        (u = u.parentElement));
    }
    (this.scrollPositions.set(window, { x: window.scrollX, y: window.scrollY }),
      window.addEventListener("scroll", this.onElementScroll, { capture: !0 }),
      window.addEventListener("scroll", this.onWindowScroll),
      (this.removeScrollListeners = () => {
        (window.removeEventListener("scroll", this.onElementScroll, {
          capture: !0,
        }),
          window.removeEventListener("scroll", this.onWindowScroll));
      }));
  }
  handleScroll(l) {
    const u = this.scrollPositions.get(l);
    if (!u) return;
    const o = l === window,
      c = o
        ? { x: window.scrollX, y: window.scrollY }
        : { x: l.scrollLeft, y: l.scrollTop },
      h = { x: c.x - u.x, y: c.y - u.y };
    (h.x === 0 && h.y === 0) ||
      (o
        ? this.lastMoveEventInfo &&
          ((this.lastMoveEventInfo.point.x += h.x),
          (this.lastMoveEventInfo.point.y += h.y))
        : this.history.length > 0 &&
          ((this.history[0].x -= h.x), (this.history[0].y -= h.y)),
      this.scrollPositions.set(l, c),
      Nt.update(this.updatePoint, !0));
  }
  updateHandlers(l) {
    this.handlers = l;
  }
  end() {
    (this.removeListeners && this.removeListeners(),
      this.removeScrollListeners && this.removeScrollListeners(),
      this.scrollPositions.clear(),
      Wn(this.updatePoint));
  }
}
function tc(a, l) {
  return l ? { point: l(a.point) } : a;
}
function jp(a, l) {
  return { x: a.x - l.x, y: a.y - l.y };
}
function ec({ point: a }, l) {
  return {
    point: a,
    delta: jp(a, Tg(l)),
    offset: jp(a, jT(l)),
    velocity: CT(l, 0.1),
  };
}
function jT(a) {
  return a[0];
}
function Tg(a) {
  return a[a.length - 1];
}
function CT(a, l) {
  if (a.length < 2) return { x: 0, y: 0 };
  let u = a.length - 1,
    o = null;
  const c = Tg(a);
  for (; u >= 0 && ((o = a[u]), !(c.timestamp - o.timestamp > Ke(l))); ) u--;
  if (!o) return { x: 0, y: 0 };
  o === a[0] &&
    a.length > 2 &&
    c.timestamp - o.timestamp > Ke(l) * 2 &&
    (o = a[1]);
  const h = Le(c.timestamp - o.timestamp);
  if (h === 0) return { x: 0, y: 0 };
  const d = { x: (c.x - o.x) / h, y: (c.y - o.y) / h };
  return (d.x === 1 / 0 && (d.x = 0), d.y === 1 / 0 && (d.y = 0), d);
}
function wT(a, { min: l, max: u }, o) {
  return (
    l !== void 0 && a < l
      ? (a = o ? Rt(l, a, o.min) : Math.max(a, l))
      : u !== void 0 && a > u && (a = o ? Rt(u, a, o.max) : Math.min(a, u)),
    a
  );
}
function Cp(a, l, u) {
  return {
    min: l !== void 0 ? a.min + l : void 0,
    max: u !== void 0 ? a.max + u - (a.max - a.min) : void 0,
  };
}
function zT(a, { top: l, left: u, bottom: o, right: c }) {
  return { x: Cp(a.x, u, c), y: Cp(a.y, l, o) };
}
function wp(a, l) {
  let u = l.min - a.min,
    o = l.max - a.max;
  return (
    l.max - l.min < a.max - a.min && ([u, o] = [o, u]),
    { min: u, max: o }
  );
}
function RT(a, l) {
  return { x: wp(a.x, l.x), y: wp(a.y, l.y) };
}
function _T(a, l) {
  let u = 0.5;
  const o = ue(a),
    c = ue(l);
  return (
    c > o
      ? (u = bl(l.min, l.max - o, a.min))
      : o > c && (u = bl(a.min, a.max - c, l.min)),
    tn(0, 1, u)
  );
}
function OT(a, l) {
  const u = {};
  return (
    l.min !== void 0 && (u.min = l.min - a.min),
    l.max !== void 0 && (u.max = l.max - a.min),
    u
  );
}
const Nc = 0.35;
function VT(a = Nc) {
  return (
    a === !1 ? (a = 0) : a === !0 && (a = Nc),
    { x: zp(a, "left", "right"), y: zp(a, "top", "bottom") }
  );
}
function zp(a, l, u) {
  return { min: Rp(a, l), max: Rp(a, u) };
}
function Rp(a, l) {
  return typeof a == "number" ? a : a[l] || 0;
}
const UT = new WeakMap();
class BT {
  constructor(l) {
    ((this.openDragLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = Kt()),
      (this.latestPointerEvent = null),
      (this.latestPanInfo = null),
      (this.visualElement = l));
  }
  start(l, { snapToCursor: u = !1, distanceThreshold: o } = {}) {
    const { presenceContext: c } = this.visualElement;
    if (c && c.isPresent === !1) return;
    const h = (b) => {
        (u && this.snapToCursor(Cl(b).point), this.stopAnimation());
      },
      d = (b, T) => {
        const { drag: C, dragPropagation: z, onDragStart: B } = this.getProps();
        if (
          C &&
          !z &&
          (this.openDragLock && this.openDragLock(),
          (this.openDragLock = f2(C)),
          !this.openDragLock)
        )
          return;
        ((this.latestPointerEvent = b),
          (this.latestPanInfo = T),
          (this.isDragging = !0),
          (this.currentDirection = null),
          this.resolveConstraints(),
          this.visualElement.projection &&
            ((this.visualElement.projection.isAnimationBlocked = !0),
            (this.visualElement.projection.target = void 0)),
          $e((q) => {
            let G = this.getAxisMotionValue(q).get() || 0;
            if (Ie.test(G)) {
              const { projection: L } = this.visualElement;
              if (L && L.layout) {
                const Z = L.layout.layoutBox[q];
                Z && (G = ue(Z) * (parseFloat(G) / 100));
              }
            }
            this.originPoint[q] = G;
          }),
          B && Nt.update(() => B(b, T), !1, !0),
          vc(this.visualElement, "transform"));
        const { animationState: H } = this.visualElement;
        H && H.setActive("whileDrag", !0);
      },
      m = (b, T) => {
        ((this.latestPointerEvent = b), (this.latestPanInfo = T));
        const {
          dragPropagation: C,
          dragDirectionLock: z,
          onDirectionLock: B,
          onDrag: H,
        } = this.getProps();
        if (!C && !this.openDragLock) return;
        const { offset: q } = T;
        if (z && this.currentDirection === null) {
          ((this.currentDirection = HT(q)),
            this.currentDirection !== null && B && B(this.currentDirection));
          return;
        }
        (this.updateAxis("x", T.point, q),
          this.updateAxis("y", T.point, q),
          this.visualElement.render(),
          H && Nt.update(() => H(b, T), !1, !0));
      },
      g = (b, T) => {
        ((this.latestPointerEvent = b),
          (this.latestPanInfo = T),
          this.stop(b, T),
          (this.latestPointerEvent = null),
          (this.latestPanInfo = null));
      },
      p = () => {
        const { dragSnapToOrigin: b } = this.getProps();
        (b || this.constraints) && this.startAnimation({ x: 0, y: 0 });
      },
      { dragSnapToOrigin: v } = this.getProps();
    this.panSession = new Sg(
      l,
      {
        onSessionStart: h,
        onStart: d,
        onMove: m,
        onSessionEnd: g,
        resumeAnimation: p,
      },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: v,
        distanceThreshold: o,
        contextWindow: bg(this.visualElement),
        element: this.visualElement.current,
      },
    );
  }
  stop(l, u) {
    const o = l || this.latestPointerEvent,
      c = u || this.latestPanInfo,
      h = this.isDragging;
    if ((this.cancel(), !h || !c || !o)) return;
    const { velocity: d } = c;
    this.startAnimation(d);
    const { onDragEnd: m } = this.getProps();
    m && Nt.postRender(() => m(o, c));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: l, animationState: u } = this.visualElement;
    (l && (l.isAnimationBlocked = !1), this.endPanSession());
    const { dragPropagation: o } = this.getProps();
    (!o &&
      this.openDragLock &&
      (this.openDragLock(), (this.openDragLock = null)),
      u && u.setActive("whileDrag", !1));
  }
  endPanSession() {
    (this.panSession && this.panSession.end(), (this.panSession = void 0));
  }
  updateAxis(l, u, o) {
    const { drag: c } = this.getProps();
    if (!o || !Ps(l, c, this.currentDirection)) return;
    const h = this.getAxisMotionValue(l);
    let d = this.originPoint[l] + o[l];
    (this.constraints &&
      this.constraints[l] &&
      (d = wT(d, this.constraints[l], this.elastic[l])),
      h.set(d));
  }
  resolveConstraints() {
    var h;
    const { dragConstraints: l, dragElastic: u } = this.getProps(),
      o =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : (h = this.visualElement.projection) == null
            ? void 0
            : h.layout,
      c = this.constraints;
    (l && si(l)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : l && o
        ? (this.constraints = zT(o.layoutBox, l))
        : (this.constraints = !1),
      (this.elastic = VT(u)),
      c !== this.constraints &&
        !si(l) &&
        o &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        $e((d) => {
          this.constraints !== !1 &&
            this.getAxisMotionValue(d) &&
            (this.constraints[d] = OT(o.layoutBox[d], this.constraints[d]));
        }));
  }
  resolveRefConstraints() {
    const { dragConstraints: l, onMeasureDragConstraints: u } = this.getProps();
    if (!l || !si(l)) return !1;
    const o = l.current,
      { projection: c } = this.visualElement;
    if (!c || !c.layout) return !1;
    const h = q2(o, c.root, this.visualElement.getTransformPagePoint());
    let d = RT(c.layout.layoutBox, h);
    if (u) {
      const m = u(B2(d));
      ((this.hasMutatedConstraints = !!m), m && (d = Xy(m)));
    }
    return d;
  }
  startAnimation(l) {
    const {
        drag: u,
        dragMomentum: o,
        dragElastic: c,
        dragTransition: h,
        dragSnapToOrigin: d,
        onDragTransitionEnd: m,
      } = this.getProps(),
      g = this.constraints || {},
      p = $e((v) => {
        if (!Ps(v, u, this.currentDirection)) return;
        let b = (g && g[v]) || {};
        d && (b = { min: 0, max: 0 });
        const T = c ? 200 : 1e6,
          C = c ? 40 : 1e7,
          z = {
            type: "inertia",
            velocity: o ? l[v] : 0,
            bounceStiffness: T,
            bounceDamping: C,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...h,
            ...b,
          };
        return this.startAxisValueAnimation(v, z);
      });
    return Promise.all(p).then(m);
  }
  startAxisValueAnimation(l, u) {
    const o = this.getAxisMotionValue(l);
    return (
      vc(this.visualElement, l),
      o.start(Jc(l, o, 0, u, this.visualElement, !1))
    );
  }
  stopAnimation() {
    $e((l) => this.getAxisMotionValue(l).stop());
  }
  getAxisMotionValue(l) {
    const u = `_drag${l.toUpperCase()}`,
      o = this.visualElement.getProps(),
      c = o[u];
    return (
      c ||
      this.visualElement.getValue(l, (o.initial ? o.initial[l] : void 0) || 0)
    );
  }
  snapToCursor(l) {
    $e((u) => {
      const { drag: o } = this.getProps();
      if (!Ps(u, o, this.currentDirection)) return;
      const { projection: c } = this.visualElement,
        h = this.getAxisMotionValue(u);
      if (c && c.layout) {
        const { min: d, max: m } = c.layout.layoutBox[u],
          g = h.get() || 0;
        h.set(l[u] - Rt(d, m, 0.5) + g);
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return;
    const { drag: l, dragConstraints: u } = this.getProps(),
      { projection: o } = this.visualElement;
    if (!si(u) || !o || !this.constraints) return;
    this.stopAnimation();
    const c = { x: 0, y: 0 };
    $e((d) => {
      const m = this.getAxisMotionValue(d);
      if (m && this.constraints !== !1) {
        const g = m.get();
        c[d] = _T({ min: g, max: g }, this.constraints[d]);
      }
    });
    const { transformTemplate: h } = this.visualElement.getProps();
    ((this.visualElement.current.style.transform = h ? h({}, "") : "none"),
      o.root && o.root.updateScroll(),
      o.updateLayout(),
      (this.constraints = !1),
      this.resolveConstraints(),
      $e((d) => {
        if (!Ps(d, l, null)) return;
        const m = this.getAxisMotionValue(d),
          { min: g, max: p } = this.constraints[d];
        m.set(Rt(g, p, c[d]));
      }),
      this.visualElement.render());
  }
  addListeners() {
    if (!this.visualElement.current) return;
    UT.set(this.visualElement, this);
    const l = this.visualElement.current,
      u = vl(l, "pointerdown", (p) => {
        const { drag: v, dragListener: b = !0 } = this.getProps(),
          T = p.target,
          C = T !== l && g2(T);
        v && b && !C && this.start(p);
      });
    let o;
    const c = () => {
        const { dragConstraints: p } = this.getProps();
        si(p) &&
          p.current &&
          ((this.constraints = this.resolveRefConstraints()),
          o ||
            (o = LT(l, p.current, () =>
              this.scalePositionWithinConstraints(),
            )));
      },
      { projection: h } = this.visualElement,
      d = h.addEventListener("measure", c);
    (h && !h.layout && (h.root && h.root.updateScroll(), h.updateLayout()),
      Nt.read(c));
    const m = El(window, "resize", () => this.scalePositionWithinConstraints()),
      g = h.addEventListener(
        "didUpdate",
        ({ delta: p, hasLayoutChanged: v }) => {
          this.isDragging &&
            v &&
            ($e((b) => {
              const T = this.getAxisMotionValue(b);
              T &&
                ((this.originPoint[b] += p[b].translate),
                T.set(T.get() + p[b].translate));
            }),
            this.visualElement.render());
        },
      );
    return () => {
      (m(), u(), d(), g && g(), o && o());
    };
  }
  getProps() {
    const l = this.visualElement.getProps(),
      {
        drag: u = !1,
        dragDirectionLock: o = !1,
        dragPropagation: c = !1,
        dragConstraints: h = !1,
        dragElastic: d = Nc,
        dragMomentum: m = !0,
      } = l;
    return {
      ...l,
      drag: u,
      dragDirectionLock: o,
      dragPropagation: c,
      dragConstraints: h,
      dragElastic: d,
      dragMomentum: m,
    };
  }
}
function _p(a) {
  let l = !0;
  return () => {
    if (l) {
      l = !1;
      return;
    }
    a();
  };
}
function LT(a, l, u) {
  const o = q0(a, _p(u)),
    c = q0(l, _p(u));
  return () => {
    (o(), c());
  };
}
function Ps(a, l, u) {
  return (l === !0 || l === a) && (u === null || u === a);
}
function HT(a, l = 10) {
  let u = null;
  return (Math.abs(a.y) > l ? (u = "y") : Math.abs(a.x) > l && (u = "x"), u);
}
class qT extends Pn {
  constructor(l) {
    (super(l),
      (this.removeGroupControls = He),
      (this.removeListeners = He),
      (this.controls = new BT(l)));
  }
  mount() {
    const { dragControls: l } = this.node.getProps();
    (l && (this.removeGroupControls = l.subscribe(this.controls)),
      (this.removeListeners = this.controls.addListeners() || He));
  }
  update() {
    const { dragControls: l } = this.node.getProps(),
      { dragControls: u } = this.node.prevProps || {};
    l !== u &&
      (this.removeGroupControls(),
      l && (this.removeGroupControls = l.subscribe(this.controls)));
  }
  unmount() {
    (this.removeGroupControls(),
      this.removeListeners(),
      this.controls.isDragging || this.controls.endPanSession());
  }
}
const nc = (a) => (l, u) => {
  a && Nt.update(() => a(l, u), !1, !0);
};
class YT extends Pn {
  constructor() {
    (super(...arguments), (this.removePointerDownListener = He));
  }
  onPointerDown(l) {
    this.session = new Sg(l, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: bg(this.node),
    });
  }
  createPanHandlers() {
    const {
      onPanSessionStart: l,
      onPanStart: u,
      onPan: o,
      onPanEnd: c,
    } = this.node.getProps();
    return {
      onSessionStart: nc(l),
      onStart: nc(u),
      onMove: nc(o),
      onEnd: (h, d) => {
        (delete this.session, c && Nt.postRender(() => c(h, d)));
      },
    };
  }
  mount() {
    this.removePointerDownListener = vl(this.node.current, "pointerdown", (l) =>
      this.onPointerDown(l),
    );
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    (this.removePointerDownListener(), this.session && this.session.end());
  }
}
let ac = !1;
class GT extends Y.Component {
  componentDidMount() {
    const {
        visualElement: l,
        layoutGroup: u,
        switchLayoutGroup: o,
        layoutId: c,
      } = this.props,
      { projection: h } = l;
    (h &&
      (u.group && u.group.add(h),
      o && o.register && c && o.register(h),
      ac && h.root.didUpdate(),
      h.addEventListener("animationComplete", () => {
        this.safeToRemove();
      }),
      h.setOptions({
        ...h.options,
        layoutDependency: this.props.layoutDependency,
        onExitComplete: () => this.safeToRemove(),
      })),
      (au.hasEverUpdated = !0));
  }
  getSnapshotBeforeUpdate(l) {
    const {
        layoutDependency: u,
        visualElement: o,
        drag: c,
        isPresent: h,
      } = this.props,
      { projection: d } = o;
    return (
      d &&
        ((d.isPresent = h),
        l.layoutDependency !== u &&
          d.setOptions({ ...d.options, layoutDependency: u }),
        (ac = !0),
        c || l.layoutDependency !== u || u === void 0 || l.isPresent !== h
          ? d.willUpdate()
          : this.safeToRemove(),
        l.isPresent !== h &&
          (h
            ? d.promote()
            : d.relegate() ||
              Nt.postRender(() => {
                const m = d.getStack();
                (!m || !m.members.length) && this.safeToRemove();
              }))),
      null
    );
  }
  componentDidUpdate() {
    const { projection: l } = this.props.visualElement;
    l &&
      (l.root.didUpdate(),
      $c.postRender(() => {
        !l.currentAnimation && l.isLead() && this.safeToRemove();
      }));
  }
  componentWillUnmount() {
    const {
        visualElement: l,
        layoutGroup: u,
        switchLayoutGroup: o,
      } = this.props,
      { projection: c } = l;
    ((ac = !0),
      c &&
        (c.scheduleCheckAfterUnmount(),
        u && u.group && u.group.remove(c),
        o && o.deregister && o.deregister(c)));
  }
  safeToRemove() {
    const { safeToRemove: l } = this.props;
    l && l();
  }
  render() {
    return null;
  }
}
function Ag(a) {
  const [l, u] = fg(),
    o = Y.useContext(zc);
  return x.jsx(GT, {
    ...a,
    layoutGroup: o,
    switchLayoutGroup: Y.useContext(vg),
    isPresent: l,
    safeToRemove: u,
  });
}
const XT = {
  pan: { Feature: YT },
  drag: { Feature: qT, ProjectionNode: cg, MeasureLayout: Ag },
};
function Op(a, l, u) {
  const { props: o } = a;
  a.animationState &&
    o.whileHover &&
    a.animationState.setActive("whileHover", u === "Start");
  const c = "onHover" + u,
    h = o[c];
  h && Nt.postRender(() => h(l, Cl(l)));
}
class ZT extends Pn {
  mount() {
    const { current: l } = this.node;
    l &&
      (this.unmount = h2(
        l,
        (u, o) => (Op(this.node, o, "Start"), (c) => Op(this.node, c, "End")),
      ));
  }
  unmount() {}
}
class QT extends Pn {
  constructor() {
    (super(...arguments), (this.isActive = !1));
  }
  onFocus() {
    let l = !1;
    try {
      l = this.node.current.matches(":focus-visible");
    } catch {
      l = !0;
    }
    !l ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !0),
      (this.isActive = !0));
  }
  onBlur() {
    !this.isActive ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !1),
      (this.isActive = !1));
  }
  mount() {
    this.unmount = Dl(
      El(this.node.current, "focus", () => this.onFocus()),
      El(this.node.current, "blur", () => this.onBlur()),
    );
  }
  unmount() {}
}
function Vp(a, l, u) {
  const { props: o } = a;
  if (a.current instanceof HTMLButtonElement && a.current.disabled) return;
  a.animationState &&
    o.whileTap &&
    a.animationState.setActive("whileTap", u === "Start");
  const c = "onTap" + (u === "End" ? "" : u),
    h = o[c];
  h && Nt.postRender(() => h(l, Cl(l)));
}
class KT extends Pn {
  mount() {
    const { current: l } = this.node;
    if (!l) return;
    const { globalTapTarget: u, propagate: o } = this.node.props;
    this.unmount = x2(
      l,
      (c, h) => (
        Vp(this.node, h, "Start"),
        (d, { success: m }) => Vp(this.node, d, m ? "End" : "Cancel")
      ),
      {
        useGlobalTarget: u,
        stopPropagation: (o == null ? void 0 : o.tap) === !1,
      },
    );
  }
  unmount() {}
}
const jc = new WeakMap(),
  ic = new WeakMap(),
  kT = (a) => {
    const l = jc.get(a.target);
    l && l(a);
  },
  JT = (a) => {
    a.forEach(kT);
  };
function FT({ root: a, ...l }) {
  const u = a || document;
  ic.has(u) || ic.set(u, {});
  const o = ic.get(u),
    c = JSON.stringify(l);
  return (
    o[c] || (o[c] = new IntersectionObserver(JT, { root: a, ...l })),
    o[c]
  );
}
function WT(a, l, u) {
  const o = FT(l);
  return (
    jc.set(a, u),
    o.observe(a),
    () => {
      (jc.delete(a), o.unobserve(a));
    }
  );
}
const PT = { some: 0, all: 1 };
class $T extends Pn {
  constructor() {
    (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
  }
  startObserver() {
    this.unmount();
    const { viewport: l = {} } = this.node.getProps(),
      { root: u, margin: o, amount: c = "some", once: h } = l,
      d = {
        root: u ? u.current : void 0,
        rootMargin: o,
        threshold: typeof c == "number" ? c : PT[c],
      },
      m = (g) => {
        const { isIntersecting: p } = g;
        if (
          this.isInView === p ||
          ((this.isInView = p), h && !p && this.hasEnteredView)
        )
          return;
        (p && (this.hasEnteredView = !0),
          this.node.animationState &&
            this.node.animationState.setActive("whileInView", p));
        const { onViewportEnter: v, onViewportLeave: b } = this.node.getProps(),
          T = p ? v : b;
        T && T(g);
      };
    return WT(this.node.current, d, m);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u") return;
    const { props: l, prevProps: u } = this.node;
    ["amount", "margin", "root"].some(IT(l, u)) && this.startObserver();
  }
  unmount() {}
}
function IT({ viewport: a = {} }, { viewport: l = {} } = {}) {
  return (u) => a[u] !== l[u];
}
const t3 = {
    inView: { Feature: $T },
    tap: { Feature: KT },
    focus: { Feature: QT },
    hover: { Feature: ZT },
  },
  e3 = { layout: { ProjectionNode: cg, MeasureLayout: Ag } },
  n3 = { ...MT, ...t3, ...XT, ...e3 },
  De = bT(n3, ST);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const a3 = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  i3 = (a) =>
    a.replace(/^([A-Z])|[\s-_]+(\w)/g, (l, u, o) =>
      o ? o.toUpperCase() : u.toLowerCase(),
    ),
  Up = (a) => {
    const l = i3(a);
    return l.charAt(0).toUpperCase() + l.slice(1);
  },
  Eg = (...a) =>
    a
      .filter((l, u, o) => !!l && l.trim() !== "" && o.indexOf(l) === u)
      .join(" ")
      .trim(),
  l3 = (a) => {
    for (const l in a)
      if (l.startsWith("aria-") || l === "role" || l === "title") return !0;
  };
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var s3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const u3 = Y.forwardRef(
  (
    {
      color: a = "currentColor",
      size: l = 24,
      strokeWidth: u = 2,
      absoluteStrokeWidth: o,
      className: c = "",
      children: h,
      iconNode: d,
      ...m
    },
    g,
  ) =>
    Y.createElement(
      "svg",
      {
        ref: g,
        ...s3,
        width: l,
        height: l,
        stroke: a,
        strokeWidth: o ? (Number(u) * 24) / Number(l) : u,
        className: Eg("lucide", c),
        ...(!h && !l3(m) && { "aria-hidden": "true" }),
        ...m,
      },
      [
        ...d.map(([p, v]) => Y.createElement(p, v)),
        ...(Array.isArray(h) ? h : [h]),
      ],
    ),
);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zt = (a, l) => {
  const u = Y.forwardRef(({ className: o, ...c }, h) =>
    Y.createElement(u3, {
      ref: h,
      iconNode: l,
      className: Eg(`lucide-${a3(Up(a))}`, `lucide-${a}`, o),
      ...c,
    }),
  );
  return ((u.displayName = Up(a)), u);
};
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const o3 = [
    [
      "path",
      {
        d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        key: "169zse",
      },
    ],
  ],
  Mg = Zt("activity", o3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const r3 = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
  ],
  Ml = Zt("arrow-right", r3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const c3 = [
    [
      "path",
      {
        d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
        key: "l5xja",
      },
    ],
    ["path", { d: "M9 13a4.5 4.5 0 0 0 3-4", key: "10igwf" }],
    ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
    ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
    ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
    ["path", { d: "M12 13h4", key: "1ku699" }],
    ["path", { d: "M12 18h6a2 2 0 0 1 2 2v1", key: "105ag5" }],
    ["path", { d: "M12 8h8", key: "1lhi5i" }],
    ["path", { d: "M16 8V5a2 2 0 0 1 2-2", key: "u6izg6" }],
    ["circle", { cx: "16", cy: "13", r: ".5", key: "ry7gng" }],
    ["circle", { cx: "18", cy: "3", r: ".5", key: "1aiba7" }],
    ["circle", { cx: "20", cy: "21", r: ".5", key: "yhc1fs" }],
    ["circle", { cx: "20", cy: "8", r: ".5", key: "1e43v0" }],
  ],
  f3 = Zt("brain-circuit", c3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const d3 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  h3 = Zt("chevron-down", d3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const m3 = [
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M17 20v2", key: "1rnc9c" }],
    ["path", { d: "M17 2v2", key: "11trls" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M2 17h2", key: "7oei6x" }],
    ["path", { d: "M2 7h2", key: "asdhe0" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "M20 17h2", key: "1fpfkl" }],
    ["path", { d: "M20 7h2", key: "1o8tra" }],
    ["path", { d: "M7 20v2", key: "4gnj0m" }],
    ["path", { d: "M7 2v2", key: "1i4yhu" }],
    [
      "rect",
      { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" },
    ],
    [
      "rect",
      { x: "8", y: "8", width: "8", height: "8", rx: "1", key: "z9xiuo" },
    ],
  ],
  p3 = Zt("cpu", m3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const y3 = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }],
  ],
  Dg = Zt("database", y3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const g3 = [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    [
      "path",
      {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
        key: "a6xqqp",
      },
    ],
  ],
  v3 = Zt("external-link", g3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const x3 = [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f",
      },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a",
      },
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ],
  Bp = Zt("eye-off", x3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const b3 = [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
  S3 = Zt("eye", b3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const T3 = [
    [
      "rect",
      {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2",
        key: "1w4ew1",
      },
    ],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
  ],
  A3 = Zt("lock", T3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const E3 = [
    ["path", { d: "M4 5h16", key: "1tepv9" }],
    ["path", { d: "M4 12h16", key: "1lakjw" }],
    ["path", { d: "M4 19h16", key: "1djgab" }],
  ],
  M3 = Zt("menu", E3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const D3 = [
    [
      "path",
      {
        d: "M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z",
        key: "vbtd3f",
      },
    ],
    ["path", { d: "M12 17v4", key: "1riwvh" }],
    ["path", { d: "M8 21h8", key: "1ev6f3" }],
    [
      "rect",
      { x: "2", y: "3", width: "20", height: "14", rx: "2", key: "x3v2xh" },
    ],
  ],
  N3 = Zt("monitor-play", D3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const j3 = [
    [
      "path",
      {
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
        key: "v9h5vc",
      },
    ],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    [
      "path",
      {
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
        key: "3uifl3",
      },
    ],
    ["path", { d: "M8 16H3v5", key: "1cv678" }],
  ],
  C3 = Zt("refresh-cw", j3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const w3 = [
    [
      "path",
      { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" },
    ],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ],
  z3 = Zt("rotate-ccw", w3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const R3 = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
  ],
  yu = Zt("shield", R3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _3 = [
    [
      "path",
      {
        d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        key: "1s2grr",
      },
    ],
    ["path", { d: "M20 2v4", key: "1rf3ol" }],
    ["path", { d: "M22 4h-4", key: "gwowj6" }],
    ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }],
  ],
  Ng = Zt("sparkles", _3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const O3 = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ],
  Cc = Zt("users", O3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const V3 = [
    [
      "rect",
      { width: "8", height: "8", x: "3", y: "3", rx: "2", key: "by2w9f" },
    ],
    ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4", key: "xkn7yn" }],
    [
      "rect",
      { width: "8", height: "8", x: "13", y: "13", rx: "2", key: "1cgmvn" },
    ],
  ],
  jg = Zt("workflow", V3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const U3 = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  B3 = Zt("x", U3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const L3 = [
    [
      "path",
      {
        d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        key: "1xq2db",
      },
    ],
  ],
  H3 = Zt("zap", L3),
  xl = [
    {
      key: "system",
      title: "系统端总览",
      subtitle: "管理端与用户端的一体化控制台",
      description:
        "风险评估、用户管理、设备数据、告警处置与报表展示的总控入口，支持管理端与用户端双视图切换。",
      badge: "Core Console",
      href: "./system/",
      bullets: [
        "内置体验账号，开箱即用",
        "管理端与用户端双视图",
        "静态部署下自动启用模拟数据",
      ],
      chips: ["总入口", "业务闭环", "本地运行"],
      gradient: "from-cyan-500/20 via-sky-500/12 to-blue-500/20",
      glow: "shadow-[0_24px_80px_rgba(34,211,238,0.18)]",
    },
    {
      key: "records",
      title: "步态预测页",
      subtitle: "步态片段生成与骨架联动可视化",
      description:
        "基于深度学习模型的步态预测分析，支持参数调节、骨架视图切换、指标联动与足底压力可视化。",
      badge: "Prediction View",
      href: "./records/",
      bullets: [
        "速度、时长参数可调节",
        "骨架模式与模型模式可切换",
        "指标、相位、压力分布同步联动",
      ],
      chips: ["预测模型", "可视化", "骨架联动"],
      gradient: "from-emerald-500/20 via-teal-500/12 to-cyan-500/18",
      glow: "shadow-[0_24px_80px_rgba(16,185,129,0.16)]",
    },
    {
      key: "realtime",
      title: "实时监测页",
      subtitle: "实时轮询、方向控制与状态反馈",
      description:
        "步行与跑步模式切换、方向速度控制、实时指标更新与日志回显，形成完整的实时监测闭环。",
      badge: "Realtime View",
      href: "./records/realtime.html",
      bullets: [
        "步行/跑步模式实时切换",
        "虚拟摇杆方向控制",
        "实时指标更新与日志回显",
      ],
      chips: ["实时模式", "控制链路", "状态闭环"],
      gradient: "from-blue-500/20 via-indigo-500/12 to-sky-500/18",
      glow: "shadow-[0_24px_80px_rgba(96,165,250,0.16)]",
    },
  ],
  q3 = [
    {
      icon: x.jsx(Mg, { className: "h-6 w-6" }),
      title: "跌倒风险发现滞后",
      description:
        "社区老年健康管理依赖阶段性体检与量表评估，难以捕捉步态异常的早期信号，跌倒风险往往在事件发生后才被识别。",
    },
    {
      icon: x.jsx(C3, { className: "h-6 w-6" }),
      title: "监测数据链路割裂",
      description:
        "步态采集、特征分析、风险评估、预警推送、干预执行分散在不同系统，难以形成可追溯的完整工作流。",
    },
    {
      icon: x.jsx(A3, { className: "h-6 w-6" }),
      title: "部署环境受限",
      description:
        "基层社区缺乏专业服务器与运维能力，系统需要支持轻量化部署，同时保障数据隐私与离线可用。",
    },
    {
      icon: x.jsx(Cc, { className: "h-6 w-6" }),
      title: "入口与流程分散",
      description:
        "管理端、预测分析与实时监测分散在不同页面，缺少像软件工作台一样的统一入口与状态总览。",
    },
  ],
  Y3 = [
    {
      id: "innovation-theory",
      icon: x.jsx(f3, { className: "h-8 w-8" }),
      title: "理论创新",
      description:
        "从静态风险评分转向风险状态演化建模，将跌倒风险视为随时间连续演化的动态过程，支持早期预警与趋势追踪。",
    },
    {
      id: "innovation-method",
      icon: x.jsx(Dg, { className: "h-8 w-8" }),
      title: "方法创新",
      description:
        "基于体域网步态数据，构建步态对称性、节律稳定性、支撑相位等多维特征，结合深度学习模型实现细微异常识别。",
    },
    {
      id: "innovation-mechanism",
      icon: x.jsx(jg, { className: "h-8 w-8" }),
      title: "机制创新",
      description:
        '形成"监测-评估-预警-干预-回访"闭环响应机制，将预警结果与系统端告警处置、跟进任务联动，实现从提示到执行。',
    },
    {
      id: "innovation-arch",
      icon: x.jsx(yu, { className: "h-8 w-8" }),
      title: "架构创新",
      description:
        "采用静态可部署架构，系统端、步态预测页、实时监测页共享统一入口，支持本地运行与静态托管。",
    },
  ],
  Lp = [
    {
      icon: x.jsx(Dg, { className: "h-6 w-6" }),
      title: "多源数据采集",
      description:
        "体域网IMU传感器采集步态运动数据，足底压力传感器采集压力分布，形成连续输入流。",
    },
    {
      icon: x.jsx(p3, { className: "h-6 w-6" }),
      title: "特征提取建模",
      description:
        "提取步频、步幅、对称性、稳定性等特征，构建风险状态演化模型，输出动态风险评估结果。",
    },
    {
      icon: x.jsx(Mg, { className: "h-6 w-6" }),
      title: "风险分层预警",
      description:
        "根据风险演化趋势输出分层预警，支持低、中、高风险分级，并生成可视化解释报告。",
    },
    {
      icon: x.jsx(H3, { className: "h-6 w-6" }),
      title: "干预措施执行",
      description:
        "预警结果接入系统端告警处置流程，自动生成跟进任务，支持干预措施执行与效果追踪。",
    },
    {
      icon: x.jsx(N3, { className: "h-6 w-6" }),
      title: "系统入口整合",
      description:
        "首页作为产品工作台，串联系统端、步态预测页、实时监测页，统一承载入口切换、实时预览与状态确认。",
    },
  ],
  hl = {
    name: "陈奕睿",
    role: "项目负责人",
    school: "公共卫生与健康科学学院 · 2024级应用统计学",
    description:
      "负责项目总体方案设计、数据建模与三端系统整合，统筹展示页、系统端与步态监测端的一体化呈现。",
    tags: ["项目统筹", "数据建模", "系统整合"],
  },
  G3 = [
    {
      name: "王梦阳",
      title: "指导教师 · 讲师",
      description: "负责研究框架设计、老年健康风险评估方法指导与项目过程监督。",
    },
    {
      name: "赵铁牛",
      title: "指导教师 · 教授",
      description: "负责交叉学科方向把关、项目组织协调与整体学术指导。",
    },
  ],
  X3 = [
    { name: "桂宏馨", school: "公共卫生与健康科学学院", role: "数据处理" },
    { name: "严梓艺", school: "管理学院", role: "调研设计" },
    { name: "田中好", school: "公共卫生与健康科学学院", role: "数据分析" },
    { name: "刘明远", school: "公共卫生与健康科学学院", role: "实验辅助" },
    { name: "张子怡", school: "公共卫生与健康科学学院", role: "文献整理" },
    { name: "李泓宇", school: "公共卫生与健康科学学院", role: "模型实验" },
    { name: "刘子欢", school: "公共卫生与健康科学学院", role: "实验记录" },
    { name: "宋宣慧", school: "公共卫生与健康科学学院", role: "数据收集" },
    { name: "武紫涵", school: "公共卫生与健康科学学院", role: "案例整理" },
    { name: "李敖巍", school: "公共卫生与健康科学学院", role: "系统测试" },
    { name: "马凯", school: "文化与健康传播学院", role: "成果传播" },
  ],
  Z3 = [
    { value: "3", label: "已接入子系统" },
    { value: "1", label: "统一工作台" },
    { value: "100%", label: "本地数据可运行" },
  ],
  Q3 = [
    { value: "3", label: "跨学院协作", note: "公卫 / 管理 / 传播" },
    { value: "14", label: "核心参与人数", note: "负责人、导师与成员协同推进" },
    {
      value: "6",
      label: "关键分工环节",
      note: "建模、调研、实验、测试、文献、传播",
    },
  ],
  Sn = (a) =>
    typeof window > "u" ? a : new URL(a, window.location.href).toString();
function K3() {
  const [a, l] = Y.useState(!1),
    u = [
      { href: "#overview", label: "产品概览" },
      { href: "#architecture", label: "系统架构" },
      { href: "#experience", label: "工作台" },
      { href: "#team", label: "项目团队" },
    ];
  return x.jsxs("header", {
    className:
      "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl",
    children: [
      x.jsxs("div", {
        className:
          "mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8",
        children: [
          x.jsxs("a", {
            href: "#home",
            className: "flex items-center gap-3",
            children: [
              x.jsx("div", {
                className:
                  "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.28)]",
                children: x.jsx(yu, { className: "h-6 w-6" }),
              }),
              x.jsxs("div", {
                children: [
                  x.jsx("div", {
                    className:
                      "font-display text-xl font-bold tracking-tight text-white",
                    children: "智守银龄",
                  }),
                  x.jsx("div", {
                    className:
                      "text-[11px] uppercase tracking-[0.28em] text-slate-400",
                    children: "社区老年健康动态预警系统",
                  }),
                ],
              }),
            ],
          }),
          x.jsxs("nav", {
            className:
              "hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex",
            children: [
              u.map((o) =>
                x.jsx(
                  "a",
                  {
                    href: o.href,
                    className: "transition hover:text-cyan-300",
                    children: o.label,
                  },
                  o.href,
                ),
              ),
              x.jsxs("a", {
                href: Sn("./system/"),
                className:
                  "inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-cyan-100 transition hover:border-cyan-200/45 hover:bg-cyan-400/16",
                children: ["进入系统端", x.jsx(Ml, { className: "h-4 w-4" })],
              }),
            ],
          }),
          x.jsx("button", {
            type: "button",
            className:
              "rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 md:hidden",
            onClick: () => l((o) => !o),
            children: a
              ? x.jsx(B3, { className: "h-5 w-5" })
              : x.jsx(M3, { className: "h-5 w-5" }),
          }),
        ],
      }),
      x.jsx(FS, {
        children:
          a &&
          x.jsx(De.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className:
              "overflow-hidden border-t border-white/8 bg-slate-950/96 md:hidden",
            children: x.jsxs("div", {
              className: "space-y-3 px-4 py-5 text-sm text-slate-300",
              children: [
                u.map((o) =>
                  x.jsx(
                    "a",
                    {
                      href: o.href,
                      onClick: () => l(!1),
                      className:
                        "block rounded-xl px-3 py-2 transition hover:bg-white/5 hover:text-cyan-300",
                      children: o.label,
                    },
                    o.href,
                  ),
                ),
                x.jsxs("a", {
                  href: Sn("./system/"),
                  onClick: () => l(!1),
                  className:
                    "mt-2 inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 font-semibold text-slate-950",
                  children: ["进入系统端", x.jsx(Ml, { className: "h-4 w-4" })],
                }),
              ],
            }),
          }),
      }),
    ],
  });
}
function k3() {
  return x.jsxs("section", {
    id: "home",
    className: "relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28",
    children: [
      x.jsx("div", { className: "absolute inset-0 bg-slate-950" }),
      x.jsx("div", {
        className:
          "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_28%)]",
      }),
      x.jsx("div", {
        className:
          "absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-45",
      }),
      x.jsxs("div", {
        className:
          "relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8",
        children: [
          x.jsxs(De.div, {
            initial: { opacity: 0, y: 28 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            children: [
              x.jsxs("div", {
                className:
                  "inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-4 py-2 text-sm text-cyan-100",
                children: [
                  x.jsx(Ng, { className: "h-4 w-4" }),
                  "社区健康管理工作台",
                ],
              }),
              x.jsxs("h1", {
                className:
                  "mt-8 font-display text-5xl font-black tracking-tight text-white md:text-7xl",
                children: [
                  "智守银龄",
                  x.jsx("span", {
                    className:
                      "mt-3 block bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent",
                    children: "风险未然",
                  }),
                ],
              }),
              x.jsx("p", {
                className:
                  "mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-2xl md:leading-10",
                children:
                  "基于风险状态演化建模的社区老年跌倒风险动态预警与干预系统",
              }),
              x.jsx("p", {
                className: "mt-4 max-w-2xl text-base leading-7 text-slate-400",
                children:
                  "通过体域网步态监测、深度学习风险评估模型与闭环干预机制，实现从早期预警到干预执行的全流程管理。",
              }),
              x.jsxs("div", {
                className: "mt-10 flex flex-col gap-4 sm:flex-row",
                children: [
                  x.jsxs("a", {
                    href: "#experience",
                    className:
                      "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-4 text-base font-bold text-slate-950 shadow-[0_0_50px_-12px_rgba(34,211,238,0.55)] transition hover:from-sky-300 hover:to-cyan-200",
                    children: [
                      "打开系统工作台",
                      x.jsx(Ml, { className: "h-5 w-5" }),
                    ],
                  }),
                  x.jsx("a", {
                    href: Sn("./system/"),
                    className:
                      "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-7 py-4 text-base font-semibold text-white transition hover:border-cyan-300/30 hover:bg-white/10",
                    children: "直接进入系统端",
                  }),
                ],
              }),
              x.jsx("div", {
                className: "mt-12 grid grid-cols-3 gap-4",
                children: Z3.map((a) =>
                  x.jsxs(
                    "div",
                    {
                      className:
                        "rounded-3xl border border-white/8 bg-slate-900/60 px-5 py-5 backdrop-blur-sm",
                      children: [
                        x.jsx("div", {
                          className:
                            "text-2xl font-black text-white md:text-3xl",
                          children: a.value,
                        }),
                        x.jsx("div", {
                          className: "mt-2 text-sm text-slate-400",
                          children: a.label,
                        }),
                      ],
                    },
                    a.label,
                  ),
                ),
              }),
            ],
          }),
          x.jsxs(De.div, {
            initial: { opacity: 0, y: 32 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.9, delay: 0.08 },
            className: "relative",
            children: [
              x.jsx("div", {
                className:
                  "absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-cyan-300/12 via-sky-400/8 to-transparent blur-3xl",
              }),
              x.jsxs("div", {
                className:
                  "relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-900/78 p-6 shadow-[0_30px_100px_rgba(2,8,23,0.42)] backdrop-blur-xl",
                children: [
                  x.jsxs("div", {
                    className: "flex items-start justify-between gap-4",
                    children: [
                      x.jsxs("div", {
                        children: [
                          x.jsx("div", {
                            className:
                              "text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/80",
                            children: "Product Console",
                          }),
                          x.jsx("h2", {
                            className: "mt-3 text-3xl font-bold text-white",
                            children: "产品工作台",
                          }),
                          x.jsx("p", {
                            className: "mt-3 text-sm leading-7 text-slate-400",
                            children:
                              "系统端、步态预测页、实时监测页统一收纳在同一工作台，支持入口切换、实时预览和运行状态查看。",
                          }),
                        ],
                      }),
                      x.jsx("div", {
                        className:
                          "rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200",
                        children: "Local Ready",
                      }),
                    ],
                  }),
                  x.jsx("div", {
                    className: "mt-6 space-y-4",
                    children: xl.map((a) =>
                      x.jsx(
                        "a",
                        {
                          href: Sn(a.href),
                          className: `block rounded-[1.6rem] border border-white/8 bg-gradient-to-br ${a.gradient} p-5 transition hover:-translate-y-1 hover:border-cyan-200/25`,
                          children: x.jsxs("div", {
                            className:
                              "flex items-center justify-between gap-4",
                            children: [
                              x.jsxs("div", {
                                children: [
                                  x.jsx("div", {
                                    className:
                                      "text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-100/75",
                                    children: a.badge,
                                  }),
                                  x.jsx("div", {
                                    className:
                                      "mt-2 text-xl font-bold text-white",
                                    children: a.title,
                                  }),
                                  x.jsx("div", {
                                    className: "mt-1 text-sm text-slate-300",
                                    children: a.subtitle,
                                  }),
                                ],
                              }),
                              x.jsx(Ml, {
                                className: "h-5 w-5 shrink-0 text-cyan-100",
                              }),
                            ],
                          }),
                        },
                        a.key,
                      ),
                    ),
                  }),
                  x.jsxs("div", {
                    className:
                      "mt-6 rounded-[1.5rem] border border-cyan-300/12 bg-slate-950/70 p-5",
                    children: [
                      x.jsxs("div", {
                        className:
                          "flex items-center gap-2 text-sm font-semibold text-cyan-100",
                        children: [
                          x.jsx(jg, { className: "h-4 w-4" }),
                          "运行状态",
                        ],
                      }),
                      x.jsx("div", {
                        className: "mt-4 grid gap-3 sm:grid-cols-3",
                        children: [
                          ["管理端", "Online"],
                          ["预测页", "Ready"],
                          ["实时监测", "Live"],
                        ].map((a) =>
                          x.jsxs(
                            "div",
                            {
                              className:
                                "rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3",
                              children: [
                                x.jsx("div", {
                                  className: "text-xs text-slate-500",
                                  children: a[0],
                                }),
                                x.jsxs("div", {
                                  className:
                                    "mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-200",
                                  children: [
                                    x.jsx("span", {
                                      className:
                                        "h-2 w-2 rounded-full bg-emerald-400",
                                    }),
                                    a[1],
                                  ],
                                }),
                              ],
                            },
                            a[0],
                          ),
                        ),
                      }),
                      x.jsx("p", {
                        className: "mt-4 text-sm leading-7 text-slate-300",
                        children:
                          "入口、预览和系统状态集中在同一屏，打开首页即可像控制台一样进入各个业务模块。",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function J3() {
  return x.jsx("section", {
    id: "overview",
    className: "relative bg-slate-950 py-24",
    children: x.jsxs("div", {
      className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      children: [
        x.jsxs("div", {
          className: "mx-auto max-w-3xl text-center",
          children: [
            x.jsx("div", {
              className:
                "text-xs font-bold uppercase tracking-[0.32em] text-cyan-300/70",
              children: "Product Overview",
            }),
            x.jsx("h2", {
              className:
                "mt-4 font-display text-3xl font-bold text-white md:text-5xl",
              children: "产品要解决的问题",
            }),
            x.jsx("p", {
              className: "mt-6 text-lg leading-8 text-slate-400",
              children:
                "跌倒是65岁以上老年人伤害死亡的首位原因。现有社区健康管理难以实现早期预警与闭环干预，系统用于把监测、评估、预警、干预和回访集中到同一套工作流中。",
            }),
          ],
        }),
        x.jsx("div", {
          className: "mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4",
          children: q3.map((a, l) =>
            x.jsxs(
              De.div,
              {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: !0 },
                transition: { delay: l * 0.08 },
                className:
                  "rounded-[2rem] border border-white/8 bg-slate-900/62 p-7 backdrop-blur-sm",
                children: [
                  x.jsx("div", {
                    className:
                      "flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200",
                    children: a.icon,
                  }),
                  x.jsx("h3", {
                    className: "mt-6 text-xl font-bold text-white",
                    children: a.title,
                  }),
                  x.jsx("p", {
                    className: "mt-4 text-sm leading-7 text-slate-400",
                    children: a.description,
                  }),
                ],
              },
              a.title,
            ),
          ),
        }),
      ],
    }),
  });
}
function F3() {
  return x.jsxs("section", {
    id: "architecture",
    className: "relative overflow-hidden bg-[#08101d] py-24",
    children: [
      x.jsx("div", {
        className:
          "absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-cyan-400/12 blur-[120px]",
      }),
      x.jsx("div", {
        className:
          "absolute right-[-120px] bottom-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-[140px]",
      }),
      x.jsxs("div", {
        className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        children: [
          x.jsxs("div", {
            className: "mx-auto max-w-3xl text-center",
            children: [
              x.jsx("div", {
                className:
                  "text-xs font-bold uppercase tracking-[0.32em] text-cyan-300/70",
                children: "Architecture",
              }),
              x.jsx("h2", {
                className:
                  "mt-4 font-display text-3xl font-bold text-white md:text-5xl",
                children: "系统架构与创新点",
              }),
              x.jsx("p", {
                className: "mt-6 text-lg leading-8 text-slate-400",
                children:
                  '采用"监测-评估-预警-干预-回访"闭环架构，结合深度学习步态预测模型与静态可部署设计，支持本地运行与静态托管。',
              }),
            ],
          }),
          x.jsx("div", {
            className: "mt-14 grid gap-6 lg:grid-cols-4",
            children: Y3.map((a, l) =>
              x.jsxs(
                De.div,
                {
                  id: a.id,
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: !0 },
                  transition: { delay: l * 0.08 },
                  className:
                    "rounded-[2rem] border border-white/8 bg-slate-950/66 p-7 backdrop-blur-xl",
                  children: [
                    x.jsx("div", {
                      className:
                        "flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-300/18 to-blue-400/12 text-cyan-100",
                      children: a.icon,
                    }),
                    x.jsx("h3", {
                      className: "mt-6 text-xl font-bold text-white",
                      children: a.title,
                    }),
                    x.jsx("p", {
                      className: "mt-4 text-sm leading-7 text-slate-400",
                      children: a.description,
                    }),
                  ],
                },
                a.id,
              ),
            ),
          }),
          x.jsxs("div", {
            className:
              "mt-16 rounded-[2.25rem] border border-white/10 bg-slate-950/68 p-7 shadow-[0_30px_90px_rgba(2,8,23,0.36)] backdrop-blur-xl md:p-9",
            children: [
              x.jsxs("div", {
                className:
                  "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
                children: [
                  x.jsxs("div", {
                    children: [
                      x.jsx("div", {
                        className:
                          "text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/75",
                        children: "Workflow",
                      }),
                      x.jsx("h3", {
                        className: "mt-3 text-3xl font-bold text-white",
                        children: "从监测到干预的完整链路",
                      }),
                    ],
                  }),
                  x.jsx("div", {
                    className:
                      "rounded-full border border-cyan-300/16 bg-cyan-300/8 px-4 py-2 text-sm text-cyan-100",
                    children: "首页即可直达全部子系统",
                  }),
                ],
              }),
              x.jsx("div", {
                className: "mt-10 grid gap-6 lg:grid-cols-5",
                children: Lp.map((a, l) =>
                  x.jsxs(
                    De.div,
                    {
                      initial: { opacity: 0, y: 18 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: !0 },
                      transition: { delay: l * 0.08 },
                      className:
                        "relative rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6",
                      children: [
                        x.jsx("div", {
                          className:
                            "mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-cyan-200",
                          children: a.icon,
                        }),
                        x.jsxs("div", {
                          className:
                            "text-sm font-bold uppercase tracking-[0.22em] text-slate-500",
                          children: ["0", l + 1],
                        }),
                        x.jsx("h4", {
                          className: "mt-3 text-lg font-bold text-white",
                          children: a.title,
                        }),
                        x.jsx("p", {
                          className: "mt-3 text-sm leading-7 text-slate-400",
                          children: a.description,
                        }),
                        l < Lp.length - 1 &&
                          x.jsx("div", {
                            className:
                              "pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block",
                            children: x.jsx(h3, {
                              className:
                                "h-4 w-4 rotate-[-90deg] text-cyan-300/60",
                            }),
                          }),
                      ],
                    },
                    a.title,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function W3({ href: a, title: l }) {
  const u = Y.useRef(null),
    [o, c] = Y.useState(!0),
    [h, d] = Y.useState(!0),
    [m, g] = Y.useState(0),
    p = () => {
      (c(!0), g((v) => v + 1));
    };
  return (
    Y.useEffect(() => {
      if (u.current) {
        const v = u.current,
          b = () => c(!1);
        return (
          v.addEventListener("load", b),
          () => v.removeEventListener("load", b)
        );
      }
    }, [m]),
    x.jsxs("div", {
      className: "relative",
      children: [
        o &&
          h &&
          x.jsx("div", {
            className:
              "absolute inset-0 z-10 flex items-center justify-center rounded-[1.8rem] bg-slate-950/90",
            children: x.jsxs("div", {
              className: "flex flex-col items-center gap-4",
              children: [
                x.jsx("div", {
                  className:
                    "h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/30 border-t-cyan-300",
                }),
                x.jsxs("p", {
                  className: "text-sm text-slate-400",
                  children: ["正在加载 ", l, "..."],
                }),
              ],
            }),
          }),
        !h &&
          x.jsx("div", {
            className:
              "flex h-[420px] items-center justify-center rounded-[1.8rem] border border-white/10 bg-slate-950",
            children: x.jsxs("div", {
              className: "text-center",
              children: [
                x.jsx(Bp, { className: "mx-auto h-12 w-12 text-slate-500" }),
                x.jsx("p", {
                  className: "mt-4 text-sm text-slate-400",
                  children: "预览已隐藏",
                }),
                x.jsx("button", {
                  type: "button",
                  onClick: () => d(!0),
                  className:
                    "mt-4 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20",
                  children: "显示预览",
                }),
              ],
            }),
          }),
        h &&
          x.jsx(
            "iframe",
            {
              ref: u,
              src: Sn(a),
              title: l,
              className:
                "h-[420px] w-full rounded-[1.8rem] border border-white/10 bg-slate-950",
              sandbox:
                "allow-scripts allow-same-origin allow-forms allow-popups",
            },
            m,
          ),
        x.jsxs("div", {
          className: "absolute right-4 top-4 z-20 flex gap-2",
          children: [
            x.jsx("button", {
              type: "button",
              onClick: () => d(!h),
              className:
                "rounded-lg border border-white/10 bg-slate-900/80 p-2 text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-300",
              title: h ? "隐藏预览" : "显示预览",
              children: h
                ? x.jsx(Bp, { className: "h-4 w-4" })
                : x.jsx(S3, { className: "h-4 w-4" }),
            }),
            x.jsx("button", {
              type: "button",
              onClick: p,
              className:
                "rounded-lg border border-white/10 bg-slate-900/80 p-2 text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-300",
              title: "刷新预览",
              children: x.jsx(z3, { className: "h-4 w-4" }),
            }),
            x.jsx("a", {
              href: Sn(a),
              target: "_blank",
              rel: "noreferrer",
              className:
                "rounded-lg border border-white/10 bg-slate-900/80 p-2 text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-300",
              title: "新窗口打开",
              children: x.jsx(v3, { className: "h-4 w-4" }),
            }),
          ],
        }),
      ],
    })
  );
}
function P3() {
  const [a, l] = Y.useState("system"),
    u = Y.useMemo(() => xl.find((o) => o.key === a) ?? xl[0], [a]);
  return x.jsxs("section", {
    id: "experience",
    className: "relative bg-slate-900 py-24",
    children: [
      x.jsx("div", {
        className:
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent",
      }),
      x.jsxs("div", {
        className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        children: [
          x.jsxs("div", {
            className: "mx-auto max-w-3xl text-center",
            children: [
              x.jsx("div", {
                className:
                  "text-xs font-bold uppercase tracking-[0.32em] text-cyan-300/70",
                children: "Experience Hub",
              }),
              x.jsx("h2", {
                className:
                  "mt-4 font-display text-3xl font-bold text-white md:text-5xl",
                children: "实时系统预览",
              }),
              x.jsx("p", {
                className: "mt-6 text-lg leading-8 text-slate-400",
                children:
                  "点击左侧卡片切换子系统，右侧将实时加载对应页面。每个子系统都是真实可交互的完整页面。",
              }),
            ],
          }),
          x.jsxs("div", {
            className: "mt-12 grid gap-8 xl:grid-cols-[0.86fr_1.14fr]",
            children: [
              x.jsx("div", {
                className: "space-y-4",
                children: xl.map((o, c) => {
                  const h = o.key === a;
                  return x.jsxs(
                    De.button,
                    {
                      type: "button",
                      initial: { opacity: 0, y: 18 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: !0 },
                      transition: { delay: c * 0.08 },
                      onClick: () => l(o.key),
                      className: `w-full rounded-[1.9rem] border p-6 text-left transition ${h ? "border-cyan-200/22 bg-slate-950 shadow-[0_0_50px_-18px_rgba(34,211,238,0.5)]" : "border-white/8 bg-slate-950/55 hover:border-cyan-200/18 hover:bg-slate-950/78"}`,
                      children: [
                        x.jsxs("div", {
                          className: "flex items-start justify-between gap-4",
                          children: [
                            x.jsxs("div", {
                              children: [
                                x.jsx("div", {
                                  className:
                                    "text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300/75",
                                  children: o.badge,
                                }),
                                x.jsx("h3", {
                                  className:
                                    "mt-3 text-2xl font-bold text-white",
                                  children: o.title,
                                }),
                                x.jsx("p", {
                                  className: "mt-2 text-sm text-slate-300",
                                  children: o.subtitle,
                                }),
                              ],
                            }),
                            x.jsx("span", {
                              className: `rounded-full px-3 py-1 text-xs font-semibold ${h ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100" : "bg-white/5 text-slate-400"}`,
                              children: h ? "当前预览" : "点击切换",
                            }),
                          ],
                        }),
                        x.jsx("p", {
                          className: "mt-4 text-sm leading-7 text-slate-400",
                          children: o.description,
                        }),
                        x.jsx("div", {
                          className: "mt-5 flex flex-wrap gap-2",
                          children: o.chips.map((d) =>
                            x.jsx(
                              "span",
                              {
                                className:
                                  "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300",
                                children: d,
                              },
                              d,
                            ),
                          ),
                        }),
                      ],
                    },
                    o.key,
                  );
                }),
              }),
              x.jsxs(
                De.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  className: `overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br ${u.gradient} ${u.glow}`,
                  children: [
                    x.jsx("div", {
                      className:
                        "border-b border-white/10 bg-slate-950/84 px-6 py-5",
                      children: x.jsxs("div", {
                        className:
                          "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
                        children: [
                          x.jsxs("div", {
                            children: [
                              x.jsx("div", {
                                className:
                                  "text-xs font-bold uppercase tracking-[0.32em] text-cyan-300/75",
                                children: "Live Preview",
                              }),
                              x.jsx("h3", {
                                className: "mt-3 text-3xl font-bold text-white",
                                children: u.title,
                              }),
                              x.jsx("p", {
                                className:
                                  "mt-3 max-w-2xl text-sm leading-7 text-slate-400",
                                children: u.description,
                              }),
                            ],
                          }),
                          x.jsxs("div", {
                            className: "flex flex-wrap gap-3",
                            children: [
                              x.jsxs("a", {
                                href: Sn(u.href),
                                className:
                                  "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200",
                                children: [
                                  "进入当前系统",
                                  x.jsx(Ml, { className: "h-4 w-4" }),
                                ],
                              }),
                              x.jsx("a", {
                                href: Sn(u.href),
                                target: "_blank",
                                rel: "noreferrer",
                                className:
                                  "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/20 hover:bg-white/10",
                                children: "新窗口打开",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    x.jsx("div", {
                      className: "px-6 pt-5",
                      children: x.jsxs("div", {
                        className:
                          "flex items-center gap-2 text-xs text-slate-400",
                        children: [
                          x.jsx("span", {
                            className: "h-3 w-3 rounded-full bg-emerald-400",
                          }),
                          x.jsx("span", {
                            className: "h-3 w-3 rounded-full bg-amber-300/80",
                          }),
                          x.jsx("span", {
                            className: "h-3 w-3 rounded-full bg-rose-400/80",
                          }),
                          x.jsx("span", {
                            className: "ml-3 truncate",
                            children: u.href,
                          }),
                          x.jsxs("span", {
                            className:
                              "ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-emerald-200",
                            children: [
                              x.jsx("span", {
                                className:
                                  "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400",
                              }),
                              "实时预览",
                            ],
                          }),
                        ],
                      }),
                    }),
                    x.jsxs("div", {
                      className: "p-6",
                      children: [
                        x.jsx(W3, { href: u.href, title: u.title }),
                        x.jsx("div", {
                          className: "mt-5 grid gap-4 md:grid-cols-3",
                          children: u.bullets.map((o, c) =>
                            x.jsxs(
                              "div",
                              {
                                className:
                                  "rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-slate-950/84 to-slate-900/72 px-4 py-4 text-sm text-slate-300",
                                children: [
                                  x.jsxs("div", {
                                    className:
                                      "text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-300/70",
                                    children: ["0", c + 1],
                                  }),
                                  x.jsx("div", {
                                    className: "mt-2 leading-7",
                                    children: o,
                                  }),
                                ],
                              },
                              o,
                            ),
                          ),
                        }),
                        x.jsxs("div", {
                          className:
                            "mt-5 rounded-[1.4rem] border border-cyan-300/12 bg-slate-950/72 px-5 py-4 text-sm leading-7 text-slate-300",
                          children: [
                            x.jsx("span", {
                              className: "font-semibold text-cyan-100",
                              children: "提示：",
                            }),
                            u.key === "system" &&
                              " 系统端支持内置体验账号登录，用户名 admin，密码 admin123。",
                            u.key === "records" &&
                              " 步态预测页支持骨架模式与模型模式切换，可调节速度与时长参数。",
                            u.key === "realtime" &&
                              " 实时监测页支持步行/跑步模式切换与虚拟摇杆方向控制。",
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                u.key,
              ),
            ],
          }),
        ],
      }),
    ],
  });
}
function $3() {
  return x.jsxs("section", {
    id: "team",
    className: "relative overflow-hidden bg-[#07111e] py-24",
    children: [
      x.jsx("div", {
        className:
          "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_24%)]",
      }),
      x.jsxs("div", {
        className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        children: [
          x.jsxs("div", {
            className: "mx-auto max-w-3xl text-center",
            children: [
              x.jsxs("div", {
                className:
                  "inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100",
                children: [
                  x.jsx(Cc, { className: "h-4 w-4" }),
                  "根据项目申报书整理",
                ],
              }),
              x.jsx("h2", {
                className:
                  "mt-6 font-display text-3xl font-bold text-white md:text-5xl",
                children: "项目团队",
              }),
              x.jsx("p", {
                className: "mt-6 text-lg leading-8 text-slate-400",
                children:
                  "团队以公共卫生与健康科学学院为核心，联合管理学院与文化与健康传播学院成员，覆盖数据建模、系统开发、调研设计与成果传播。",
              }),
            ],
          }),
          x.jsx("div", {
            className: "mt-10 grid gap-4 md:grid-cols-3",
            children: Q3.map((a, l) =>
              x.jsxs(
                De.div,
                {
                  initial: { opacity: 0, y: 18 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: !0 },
                  transition: { delay: l * 0.06 },
                  className:
                    "relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-slate-950/66 p-5 shadow-[0_16px_50px_rgba(2,8,23,0.2)] backdrop-blur-xl",
                  children: [
                    x.jsx("div", {
                      className:
                        "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent",
                    }),
                    x.jsx("div", {
                      className: "text-sm font-medium text-slate-400",
                      children: a.label,
                    }),
                    x.jsx("div", {
                      className:
                        "mt-3 text-4xl font-black tracking-tight text-white",
                      children: a.value,
                    }),
                    x.jsx("div", {
                      className: "mt-3 text-sm leading-7 text-cyan-100/90",
                      children: a.note,
                    }),
                  ],
                },
                a.label,
              ),
            ),
          }),
          x.jsxs("div", {
            className: "mt-14 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]",
            children: [
              x.jsxs(De.div, {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: !0 },
                className:
                  "relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-slate-950/74 p-8 shadow-[0_30px_90px_rgba(2,8,23,0.38)] backdrop-blur-xl md:p-10",
                children: [
                  x.jsx("div", {
                    className:
                      "absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl",
                  }),
                  x.jsx("div", {
                    className:
                      "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent",
                  }),
                  x.jsxs("div", {
                    className: "flex flex-wrap items-center gap-4",
                    children: [
                      x.jsx("div", {
                        className:
                          "flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-300/18 to-blue-400/12 text-cyan-100",
                        children: x.jsx(Ng, { className: "h-8 w-8" }),
                      }),
                      x.jsxs("div", {
                        children: [
                          x.jsx("div", {
                            className:
                              "text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/75",
                            children: "Project Lead",
                          }),
                          x.jsx("h3", {
                            className: "mt-2 text-3xl font-bold text-white",
                            children: hl.name,
                          }),
                          x.jsx("p", {
                            className:
                              "mt-2 text-base font-medium text-cyan-100",
                            children: hl.role,
                          }),
                        ],
                      }),
                    ],
                  }),
                  x.jsxs("div", {
                    className:
                      "mt-8 rounded-[1.8rem] border border-cyan-300/12 bg-gradient-to-br from-cyan-300/10 via-slate-900/65 to-blue-400/10 p-6",
                    children: [
                      x.jsx("div", {
                        className:
                          "text-sm uppercase tracking-[0.22em] text-slate-400",
                        children: "学院与专业",
                      }),
                      x.jsx("div", {
                        className: "mt-3 text-xl font-semibold text-white",
                        children: hl.school,
                      }),
                      x.jsx("p", {
                        className: "mt-5 text-base leading-8 text-slate-300",
                        children: hl.description,
                      }),
                    ],
                  }),
                  x.jsx("div", {
                    className: "mt-7 flex flex-wrap gap-3",
                    children: hl.tags.map((a) =>
                      x.jsx(
                        "span",
                        {
                          className:
                            "rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100",
                          children: a,
                        },
                        a,
                      ),
                    ),
                  }),
                  x.jsxs("div", {
                    className: "mt-8 grid gap-4 sm:grid-cols-3",
                    children: [
                      x.jsxs("div", {
                        className:
                          "rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] px-5 py-5",
                        children: [
                          x.jsx("div", {
                            className: "text-3xl font-black text-white",
                            children: "1",
                          }),
                          x.jsx("div", {
                            className: "mt-2 text-sm text-slate-400",
                            children: "项目负责人",
                          }),
                        ],
                      }),
                      x.jsxs("div", {
                        className:
                          "rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] px-5 py-5",
                        children: [
                          x.jsx("div", {
                            className: "text-3xl font-black text-white",
                            children: "11",
                          }),
                          x.jsx("div", {
                            className: "mt-2 text-sm text-slate-400",
                            children: "协作成员",
                          }),
                        ],
                      }),
                      x.jsxs("div", {
                        className:
                          "rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] px-5 py-5",
                        children: [
                          x.jsx("div", {
                            className: "text-3xl font-black text-white",
                            children: "2",
                          }),
                          x.jsx("div", {
                            className: "mt-2 text-sm text-slate-400",
                            children: "指导教师",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              x.jsxs("div", {
                className: "space-y-6",
                children: [
                  G3.map((a, l) =>
                    x.jsxs(
                      De.div,
                      {
                        initial: { opacity: 0, y: 24 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: !0 },
                        transition: { delay: l * 0.08 },
                        className:
                          "relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/74 p-7 backdrop-blur-xl",
                        children: [
                          x.jsx("div", {
                            className:
                              "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/75 to-transparent",
                          }),
                          x.jsxs("div", {
                            className: "flex items-center gap-4",
                            children: [
                              x.jsx("div", {
                                className:
                                  "flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/12 text-blue-200",
                                children: x.jsx(yu, { className: "h-6 w-6" }),
                              }),
                              x.jsxs("div", {
                                children: [
                                  x.jsx("div", {
                                    className:
                                      "text-xs font-bold uppercase tracking-[0.24em] text-blue-200/70",
                                    children: "Advisor",
                                  }),
                                  x.jsx("h3", {
                                    className:
                                      "mt-1 text-2xl font-bold text-white",
                                    children: a.name,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          x.jsx("p", {
                            className:
                              "mt-5 text-base font-medium text-cyan-100",
                            children: a.title,
                          }),
                          x.jsx("p", {
                            className:
                              "mt-3 text-base leading-8 text-slate-300",
                            children: a.description,
                          }),
                        ],
                      },
                      a.name,
                    ),
                  ),
                  x.jsxs(De.div, {
                    initial: { opacity: 0, y: 24 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: !0 },
                    transition: { delay: 0.16 },
                    className:
                      "relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/84 to-slate-900/72 p-7 backdrop-blur-xl",
                    children: [
                      x.jsx("div", {
                        className:
                          "absolute -bottom-20 -right-10 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl",
                      }),
                      x.jsx("div", {
                        className:
                          "text-xs font-bold uppercase tracking-[0.24em] text-slate-400",
                        children: "Collaboration Summary",
                      }),
                      x.jsx("h3", {
                        className: "mt-3 text-2xl font-bold text-white",
                        children: "跨学院协作结构",
                      }),
                      x.jsx("p", {
                        className: "mt-4 text-base leading-8 text-slate-300",
                        children:
                          "团队成员覆盖公共卫生与健康科学学院、管理学院、文化与健康传播学院，支撑数据建模、系统开发、调研测试与成果传播。",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          x.jsx("div", {
            className: "mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4",
            children: X3.map((a, l) =>
              x.jsxs(
                De.div,
                {
                  initial: { opacity: 0, y: 18 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: !0 },
                  transition: { delay: l * 0.05 },
                  className:
                    "group relative overflow-hidden rounded-[1.7rem] border border-white/8 bg-slate-950/62 p-5 transition hover:-translate-y-1 hover:border-cyan-200/20 hover:bg-slate-950/82",
                  children: [
                    x.jsx("div", {
                      className:
                        "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent opacity-80",
                    }),
                    x.jsxs("div", {
                      className: "flex items-center justify-between gap-3",
                      children: [
                        x.jsx("div", {
                          className:
                            "rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-400",
                          children: "团队成员",
                        }),
                        x.jsx("div", {
                          className:
                            "flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/16 bg-cyan-300/10 text-sm font-bold text-cyan-100",
                          children: a.name.slice(-1),
                        }),
                      ],
                    }),
                    x.jsx("h4", {
                      className: "mt-5 text-lg font-bold text-white",
                      children: a.name,
                    }),
                    x.jsx("p", {
                      className: "mt-2 text-sm font-medium text-cyan-100",
                      children: a.role,
                    }),
                    x.jsx("p", {
                      className: "mt-3 text-sm leading-7 text-slate-400",
                      children: a.school,
                    }),
                    x.jsxs("div", {
                      className:
                        "mt-4 flex items-center justify-between text-xs text-slate-500",
                      children: [
                        x.jsx("span", { children: "Team Role" }),
                        x.jsx(Cc, {
                          className:
                            "h-4 w-4 text-cyan-200/60 transition group-hover:text-cyan-200",
                        }),
                      ],
                    }),
                  ],
                },
                a.name,
              ),
            ),
          }),
        ],
      }),
    ],
  });
}
function I3() {
  return x.jsx("footer", {
    className: "border-t border-white/8 bg-[#030813] py-12",
    children: x.jsxs("div", {
      className: "mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8",
      children: [
        x.jsxs("div", {
          className: "flex items-center justify-center gap-3",
          children: [
            x.jsx(yu, { className: "h-7 w-7 text-cyan-200" }),
            x.jsx("span", {
              className: "font-display text-2xl font-bold text-white",
              children: "智守银龄",
            }),
          ],
        }),
        x.jsxs("p", {
          className: "mt-5 text-sm leading-7 text-slate-500",
          children: [
            "社区老年跌倒风险动态预警与干预系统",
            x.jsx("br", {}),
            "天津中医药大学 · 公共卫生与健康科学学院",
          ],
        }),
        x.jsx("div", {
          className:
            "mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500",
          children: xl.map((a) =>
            x.jsx(
              "a",
              {
                href: Sn(a.href),
                className: "transition hover:text-cyan-300",
                children: a.title,
              },
              a.key,
            ),
          ),
        }),
      ],
    }),
  });
}
function eA() {
  const [a, l] = Y.useState(!1),
    u = [
      { href: "#home", label: "首页", hint: "回到顶部" },
      { href: "#overview", label: "产品概览", hint: "问题与能力" },
      { href: "#architecture", label: "系统架构", hint: "业务流程" },
      { href: "#experience", label: "工作台", hint: "实时预览" },
      { href: "#team", label: "项目团队", hint: "成员信息" },
    ],
    o = [
      { href: "./system/", label: "系统端", hint: "管理与用户端" },
      { href: "./records/", label: "步态预测", hint: "模型分析页" },
      {
        href: "./records/realtime.html",
        label: "实时监测",
        hint: "动态数据页",
      },
    ];
  return x.jsxs("div", {
    className: "fixed bottom-5 right-4 z-[60] md:bottom-8 md:right-8",
    children: [
      a &&
        x.jsxs(De.div, {
          initial: { opacity: 0, y: 14, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 10, scale: 0.98 },
          className:
            "mb-3 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-[1.7rem] border border-white/12 bg-slate-950/94 shadow-[0_24px_80px_rgba(2,8,23,0.48)] backdrop-blur-xl",
          children: [
            x.jsxs("div", {
              className:
                "flex items-center justify-between border-b border-white/10 px-5 py-4",
              children: [
                x.jsxs("div", {
                  children: [
                    x.jsx("div", {
                      className:
                        "text-[11px] font-bold uppercase tracking-[0.26em] text-cyan-300/75",
                      children: "Navigation",
                    }),
                    x.jsx("div", {
                      className: "mt-1 text-lg font-bold text-white",
                      children: "首页导航",
                    }),
                  ],
                }),
                x.jsx("button", {
                  type: "button",
                  onClick: () => l(!1),
                  className:
                    "rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200",
                  "aria-label": "关闭导航",
                  children: x.jsx(B3, { className: "h-4 w-4" }),
                }),
              ],
            }),
            x.jsxs("div", {
              className: "space-y-5 px-4 py-4",
              children: [
                x.jsx("div", {
                  className: "grid gap-2",
                  children: u.map((c) =>
                    x.jsxs(
                      "a",
                      {
                        href: c.href,
                        onClick: () => l(!1),
                        className:
                          "flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-left transition hover:border-cyan-300/25 hover:bg-cyan-300/10",
                        children: [
                          x.jsx("span", {
                            className: "font-semibold text-slate-100",
                            children: c.label,
                          }),
                          x.jsx("span", {
                            className: "text-xs text-slate-500",
                            children: c.hint,
                          }),
                        ],
                      },
                      c.href,
                    ),
                  ),
                }),
                x.jsxs("div", {
                  children: [
                    x.jsx("div", {
                      className:
                        "px-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500",
                      children: "Systems",
                    }),
                    x.jsx("div", {
                      className: "mt-3 grid gap-2",
                      children: o.map((c) =>
                        x.jsxs(
                          "a",
                          {
                            href: Sn(c.href),
                            onClick: () => l(!1),
                            className:
                              "flex items-center justify-between rounded-2xl border border-cyan-300/12 bg-cyan-300/8 px-4 py-3 transition hover:border-cyan-200/30 hover:bg-cyan-300/14",
                            children: [
                              x.jsxs("span", {
                                className:
                                  "inline-flex items-center gap-2 font-semibold text-cyan-50",
                                children: [
                                  x.jsx("span", {
                                    className:
                                      "h-2 w-2 rounded-full bg-emerald-400",
                                  }),
                                  c.label,
                                ],
                              }),
                              x.jsx("span", {
                                className: "text-xs text-cyan-100/60",
                                children: c.hint,
                              }),
                            ],
                          },
                          c.href,
                        ),
                      ),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      x.jsxs("button", {
        type: "button",
        onClick: () => l((c) => !c),
        "aria-expanded": a,
        className:
          "ml-auto flex h-16 items-center justify-center gap-2 rounded-[1.35rem] border border-cyan-300/24 bg-slate-900/92 px-5 text-base font-bold text-white shadow-[0_18px_55px_rgba(14,165,233,0.24)] backdrop-blur-xl transition hover:border-cyan-200/45 hover:bg-slate-800/95",
        children: [
          a
            ? x.jsx(B3, { className: "h-5 w-5 text-cyan-200" })
            : x.jsx(M3, { className: "h-5 w-5 text-cyan-200" }),
          "导航",
        ],
      }),
    ],
  });
}
function tA() {
  return x.jsxs("div", {
    className:
      "min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-400/25",
    children: [
      x.jsx(K3, {}),
      x.jsxs("main", {
        children: [
          x.jsx(k3, {}),
          x.jsx(J3, {}),
          x.jsx(F3, {}),
          x.jsx(P3, {}),
          x.jsx($3, {}),
        ],
      }),
      x.jsx(I3, {}),
    ],
  });
}
ux.createRoot(document.getElementById("root")).render(
  x.jsx(Y.StrictMode, { children: x.jsx(tA, {}) }),
);
