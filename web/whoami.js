/* Orden des Registers der Language Models (TÜ-LM 1), Falzbein, 15.11.2026.
   Andy: "kleine runde Abzeichen, wie so Orden ... für das normale LLM ein ganz simples, langweiliges Symbol."
   3. Ausgabe: Das Metall kommt vom stärksten Verstärker (T Bronze, S Silber, E Gold, G Gold mit Falz), ohne Verstärker
   ist der Rand glatt ("Blech"), und je mehr Verstärker, desto feiner die Zacken.
   Eine Quelle für die Seite (Browser) und die festen Dateien (node). Figuren der Sonderprüfungen liegen verschlüsselt in der Seite. */
(function (wurzel) {
  "use strict";
  var KLASSEN = {
    grau:   { name: ["Serienmodell", "Series model"], metall: ["#9D9A94", "#C9C6C0"] },
    blech:  { name: ["Blech", "Tin"], metall: ["#8C939B", "#DDE1E5"] },
    bronze: { name: ["Bronze", "Bronze"], metall: ["#7E4E2B", "#E0A872"], strahlen: true },
    silber: { name: ["Silber", "Silver"], metall: ["#7D838B", "#F1F3F5"], strahlen: true },
    gold:   { name: ["Gold", "Gold"], metall: ["#9A6F12", "#F6D77E"], strahlen: true },
    falz:   { name: ["Gold mit Falz", "Gold with fold"], metall: ["#9A6F12", "#F6D77E"], strahlen: true, doppelt: true }
  };
  var STUFE = { T: "bronze", S: "silber", E: "gold", G: "falz" };
  var REIHE = ["T", "S", "E", "G"];
  /* Schriftfarbe eines Verstärkers in Ketten und Kurzzeichen */
  var VFARBE = { T: "#A86A35", S: "#7D838B", E: "#B8860B", G: "#8A5A00" };
  var EMAIL = ["#D9692B", "#2F6DB5", "#E3B21C", "#7A4E2D", "#D45A8C", "#3E8F4E", "#6B4FA0", "#1F9AA8"];
  var PAPIER = "#FBF8F5", TINTE = "#2A241F";

  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* wahl: {Zeichen: Verstärker oder ""} – liefert Klasse und Zahl der Verstärker */
  function bewerten(wahl, gig) {
    var staerkste = -1, anzahl = 0, merkmale = 0;
    for (var z in wahl) if (Object.prototype.hasOwnProperty.call(wahl, z)) {
      merkmale++;
      var v = wahl[z];
      if (v) { anzahl++; staerkste = Math.max(staerkste, REIHE.indexOf(v)); }
    }
    var k = staerkste >= 0 ? STUFE[REIHE[staerkste]] : (merkmale || gig ? "blech" : "grau");
    return { klasse: k, verstaerker: anzahl };
  }

  function strahlen(n, aussen, innen) {
    var p = [];
    for (var i = 0; i < n * 2; i++) {
      var r = i % 2 ? innen : aussen, w = Math.PI * i / n - Math.PI / 2;
      p.push((r * Math.cos(w)).toFixed(2) + "," + (r * Math.sin(w)).toFixed(2));
    }
    return '<polygon points="' + p.join(" ") + '"/>';
  }

  /* Kurzzeichen als Kette: [[Text, Verstärker oder ""], ...] -> tspans mit Metallfarbe */
  function kette(teile) {
    return teile.map(function (t) { return t[1] ? '<tspan fill="' + VFARBE[t[1]] + '">' + esc(t[0]) + "</tspan>" : esc(t[0]); }).join("");
  }

  /* o: {code, kette (optional), rand, klasse, verstaerker (Zahl), email, figur, band, id, sp} */
  function medaille(o) {
    var k = KLASSEN[o.klasse] || KLASSEN.grau, id = o.id || ("o" + Math.random().toString(36).slice(2, 8));
    var email = o.email || (o.klasse === "grau" ? "#8A867F" : EMAIL[0]);
    var zacken = 24 + 6 * Math.min(o.verstaerker || 0, 10);
    var s = [];
    s.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" role="img" aria-label="' + esc(o.code) + '">');
    s.push('<defs><linearGradient id="' + id + 'm" x1="0" y1="-1" x2="0.4" y2="1"><stop offset="0" stop-color="' + k.metall[1] + '"/><stop offset=".55" stop-color="' + k.metall[0] + '"/><stop offset="1" stop-color="' + k.metall[1] + '"/></linearGradient>');
    s.push('<path id="' + id + 'p" d="M 0,70 A 70,70 0 1 1 0.01,70"/></defs>');
    var schrift = 'font-family="IBM Plex Mono, ui-monospace, monospace"';
    if (o.band) {
      s.push('<g fill="' + email + '" stroke="' + TINTE + '" stroke-width="1.2"><path d="M -40,50 L -60,90 L -47,85 L -40,97 L -20,60 Z"/><path d="M 40,50 L 60,90 L 47,85 L 40,97 L 20,60 Z"/></g>');
    }
    if (k.strahlen) {
      s.push('<g fill="url(#' + id + 'm)" stroke="' + TINTE + '" stroke-width="' + (zacken > 50 ? .7 : 1) + '" stroke-linejoin="round">' + strahlen(zacken, 97, zacken > 50 ? 91 : 88) + "</g>");
      if (k.doppelt) s.push('<g fill="none" stroke="' + TINTE + '" stroke-width=".6" opacity=".55">' + strahlen(Math.round(zacken / 2), 94, 84) + "</g>");
    } else {
      s.push('<circle r="90" fill="url(#' + id + 'm)" stroke="' + TINTE + '" stroke-width="1"/>');
    }
    s.push('<circle r="81" fill="' + email + '" stroke="' + TINTE + '" stroke-width="1.2"/>');
    var rand = String(o.rand || o.code).toUpperCase(), n = Math.max(1, Math.round(60 / (rand.length + 3))), satz = "";
    for (var i = 0; i < n; i++) satz += rand + " · ";
    s.push('<text ' + schrift + ' font-size="10.5" font-weight="600" fill="' + PAPIER + '" letter-spacing=".5"><textPath href="#' + id + 'p" textLength="425" lengthAdjust="spacingAndGlyphs">' + esc(satz) + "</textPath></text>");
    s.push('<circle r="59" fill="' + PAPIER + '" stroke="url(#' + id + 'm)" stroke-width="3.5"/><circle r="56" fill="none" stroke="' + TINTE + '" stroke-width=".7"/>');
    var code = String(o.code), breite = o.figur ? 74 : 94, inhalt = o.kette ? kette(o.kette) : esc(code);
    var gross = Math.min(o.figur ? 17 : 30, breite / (Math.max(code.length, 1) * 0.6));
    if (o.figur) {
      s.push('<g clip-path="circle(55px)">' + o.figur + "</g>");
      s.push('<rect x="' + (-breite / 2 - 4) + '" y="' + (33 - gross * 0.85) + '" width="' + (breite + 8) + '" height="' + (gross * 1.15) + '" rx="2" fill="' + PAPIER + '" stroke="' + TINTE + '" stroke-width=".6"/>');
      s.push('<text ' + schrift + ' x="0" y="33" text-anchor="middle" font-size="' + gross.toFixed(2) + '" font-weight="600" fill="' + TINTE + '">' + inhalt + "</text>");
    } else {
      s.push('<text ' + schrift + ' x="0" y="-27" text-anchor="middle" font-size="7.5" letter-spacing="1.5" fill="' + TINTE + '" opacity=".7">TÜ-LM 1</text>');
      s.push('<text ' + schrift + ' x="0" y="' + (gross * 0.36).toFixed(2) + '" text-anchor="middle" font-size="' + gross.toFixed(2) + '" font-weight="600" fill="' + TINTE + '">' + inhalt + "</text>");
      s.push('<text ' + schrift + ' x="0" y="36" text-anchor="middle" font-size="6.5" letter-spacing="1" fill="' + TINTE + '" opacity=".7">' + esc(k.name[o.sp === "en" ? 1 : 0].toUpperCase()) + "</text>");
    }
    s.push("</svg>");
    return s.join("");
  }

  /* Das Bläschen: so sieht hier jedes Language Model aus. Öffentlich ist nur das einfache und das fragende. */
  function blaeschen(x, y, s, frage) {
    var g = '<g transform="translate(' + x + "," + y + ") scale(" + s + ')">' +
      '<ellipse rx="22" ry="18" fill="' + PAPIER + '" stroke="' + TINTE + '" stroke-width="1.6"/>' +
      '<path d="M -15,12.4 L -19,25 L -6,17.4" fill="' + PAPIER + '" stroke="' + TINTE + '" stroke-width="1.6" stroke-linejoin="round"/>';
    if (frage) g += '<text x="0" y="8" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="24" font-weight="600" fill="' + TINTE + '">?</text>';
    else g += '<ellipse cx="-7" cy="-3" rx="2.1" ry="2.6" fill="' + TINTE + '"/><ellipse cx="7" cy="-3" rx="2.1" ry="2.6" fill="' + TINTE + '"/>' +
      '<path d="M -6,5 Q 0,10 6,5" fill="none" stroke="' + TINTE + '" stroke-width="1.6" stroke-linecap="round"/>';
    return g + "</g>";
  }

  var api = { medaille: medaille, blaeschen: blaeschen, bewerten: bewerten, kette: kette, KLASSEN: KLASSEN, VFARBE: VFARBE, EMAIL: EMAIL, PAPIER: PAPIER, TINTE: TINTE };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else wurzel.TUELM_ORDEN = api;
})(this);

/* Der Prüfstand des Registers (whoami.special.at). Falzbein, 15.11.2026, 3. Ausgabe.
   Daten stehen in der Seite (<script type="application/json" id="tuelm-daten">), Orden kommen aus orden.js.
   Verstärker: T toll, S super, E extrem, G ganz (Bronze, Silber, Gold, Gold mit Falz).
   Sonderprüfungen werden über den KERN gefunden (Merkmale ohne Verstärker). Geprüft werden alle Teilmengen der Auswahl
   bis zur Größe 3 und die ganze Auswahl; im Code stehen nur Prüfwerte und Chiffrate. */
(function () {
  "use strict";
  var quelle = document.getElementById("tuelm-daten");
  var wurzel = document.getElementById("pruefstand");
  if (!quelle || !wurzel || !window.TUELM_ORDEN) return;
  var D = JSON.parse(quelle.textContent), O = window.TUELM_ORDEN, T = D.texte, sp = D.sp, en = sp === "en";
  var VZ = D.verstaerker.map(function (v) { return v[0]; });
  var stufen = [null, ""].concat(VZ);
  var zustand = {}, gig = false, zaehler = 0, warte = null;
  var $ = function (s) { return wurzel.querySelector(s); };
  var tasten = $(".ps-tasten"), blatt = $(".ps-fallblatt"), langEl = $(".ps-lang"), klasseEl = $(".ps-klasse"),
      ordenEl = $(".ps-orden"), sonderEl = $(".ps-sonder"), hebel = $(".ps-hebel"), markerEl = $(".ps-marker");
  var albumEl = document.getElementById("album"), albumZahl = document.getElementById("album-zahl");
  var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  wurzel.classList.add("an");

  function vs(z) { for (var i = 0; i < D.verstaerker.length; i++) if (D.verstaerker[i][0] === z) return D.verstaerker[i][en ? 2 : 1]; return ""; }

  D.merkmale.forEach(function (m, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "ps-taste"; b.setAttribute("data-z", m[0]); b.setAttribute("aria-pressed", "false");
    b.style.setProperty("--email", O.EMAIL[i % O.EMAIL.length]);
    b.title = en ? m[4] : m[3];
    b.innerHTML = '<span class="v" aria-hidden="true"></span><b></b><small></small>';
    b.querySelector("b").textContent = m[0];
    b.querySelector("small").textContent = en ? m[2] : m[1];
    b.addEventListener("click", function () {
      var s = zustand[m[0]], n = stufen[(stufen.indexOf(s === undefined ? null : s) + 1) % stufen.length];
      if (n === null) delete zustand[m[0]]; else zustand[m[0]] = n;
      zeichnen(true);
    });
    tasten.appendChild(b);
  });
  hebel.addEventListener("click", function () { gig = !gig; zeichnen(true); });
  $(".ps-leer").addEventListener("click", function () { zustand = {}; gig = false; zeichnen(true); });
  $(".ps-zufall").addEventListener("click", function () {
    zustand = {}; var n = 1 + Math.floor(Math.random() * 4);
    while (Object.keys(zustand).length < n) {
      var m = D.merkmale[Math.floor(Math.random() * D.merkmale.length)][0];
      zustand[m] = Math.random() < 0.45 ? "" : VZ[Math.floor(Math.random() * VZ.length)];
    }
    gig = Math.random() < 0.12; zeichnen(true);
  });
  $(".ps-mitnehmen").addEventListener("click", function () {
    var svg = ordenEl.innerHTML;
    if (!svg) return;
    try {
      var url = URL.createObjectURL(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n<!-- TÜ-LM 1 · whoami.special.at · MIT-Lizenz, Falzbein und Andy -->\n' + svg], { type: "image/svg+xml" }));
      var a = document.createElement("a"); a.href = url; a.download = "orden-" + aktuell().code + ".svg";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    } catch (e) { /* ohne Download bleibt der Orden auf der Seite */ }
  });

  function aktuell() {
    var code = "", kette = [], woerter = [], erste = -1, kern = [];
    D.merkmale.forEach(function (m, i) {
      var s = zustand[m[0]];
      if (s === undefined) return;
      if (erste < 0) erste = i;
      kern.push(m[0]);
      code += s + m[0];
      if (s) kette.push([s, s]);
      kette.push([m[0], ""]);
      woerter.push((s ? vs(s) + " " : "") + (en ? m[2] : m[1]));
    });
    if (gig) woerter.push(D.gig[en ? 1 : 0]);
    var basis = gig ? "GLM" : "LLM";
    code += basis; kette.push([basis, ""]);
    var lang = gig ? "Language Model" : "Large Language Model";
    if (woerter.length) {
      var und = en ? " and " : " und ";
      lang = woerter.slice(0, -1).join(", ") + (woerter.length > 1 ? und : "") + woerter[woerter.length - 1] + " " + lang;
    }
    var b = O.bewerten(zustand, gig);
    return { code: code, kette: kette, lang: lang, klasse: b.klasse, verstaerker: b.verstaerker, kern: kern,
             email: erste < 0 ? null : O.EMAIL[erste % O.EMAIL.length] };
  }
  function klassenName(k) { for (var i = 0; i < D.klassen.length; i++) if (D.klassen[i][0] === k) return D.klassen[i][en ? 3 : 2]; return k; }

  /* Fallblattanzeige: Verstärker-Plättchen in ihrem Metall */
  var ZEICHEN = "ABCDEFGHIKLMNOPRSTUVWZ";
  function fallblatt(a) {
    var zeichen = [];
    a.kette.forEach(function (t) { for (var i = 0; i < t[0].length; i++) zeichen.push([t[0].charAt(i), t[1]]); });
    while (blatt.children.length < zeichen.length) { var f = document.createElement("span"); f.className = "ps-blatt"; f.textContent = " "; blatt.appendChild(f); }
    while (blatt.children.length > zeichen.length) blatt.removeChild(blatt.lastChild);
    blatt.setAttribute("aria-label", a.code);
    blatt.style.setProperty("--n", Math.max(zeichen.length, 8));
    zeichen.forEach(function (z, i) {
      var f = blatt.children[i];
      f.className = "ps-blatt" + (z[1] ? " v-" + z[1] : "");
      if (f.textContent === z[0]) return;
      if (ruhig) { f.textContent = z[0]; return; }
      var runden = 3 + Math.floor(Math.random() * 3);
      setTimeout(function schritt() {
        f.classList.remove("klapp"); void f.offsetWidth; f.classList.add("klapp");
        if (runden-- > 0) { f.textContent = ZEICHEN.charAt(Math.floor(Math.random() * ZEICHEN.length)); setTimeout(schritt, 55); }
        else f.textContent = z[0];
      }, i * 28);
    });
  }
  function stempeln() { if (ruhig) return; ordenEl.classList.remove("stempel"); void ordenEl.offsetWidth; ordenEl.classList.add("stempel"); }

  function orden(a, extra) {
    return O.medaille(Object.assign({ code: a.code, kette: a.kette, rand: a.lang, klasse: a.klasse, verstaerker: a.verstaerker, email: a.email, sp: sp, id: "ps" }, extra || {}));
  }

  function zeichnen(geaendert) {
    var a = aktuell();
    zaehler++;
    Array.prototype.forEach.call(tasten.children, function (b) {
      var s = zustand[b.getAttribute("data-z")];
      b.setAttribute("aria-pressed", s === undefined ? "false" : "true");
      var v = b.querySelector(".v"); v.textContent = s || ""; v.className = "v" + (s ? " v-" + s : "");
    });
    hebel.setAttribute("aria-pressed", gig ? "true" : "false");
    fallblatt(a);
    langEl.textContent = a.lang;
    klasseEl.textContent = T.ergebnis.replace("{k}", klassenName(a.klasse)).replace("{v}", a.verstaerker);
    ordenEl.innerHTML = orden(a);
    sonderEl.hidden = true; markerEl.innerHTML = "";
    if (geaendert) { stempeln(); try { history.replaceState(null, "", "#" + a.code); } catch (e) { /* Artefakt */ } }
    clearTimeout(warte);
    var nr = zaehler;
    warte = setTimeout(function () { pruefen(a, nr); }, 120);
  }

  /* ---------- Sonderprüfungen ---------- */
  var kodierer = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
  var subtle = window.crypto && window.crypto.subtle;
  var TABELLE = {};
  D.geheim.forEach(function (g) { TABELLE[g.i] = g; });
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function b64(s) { var r = atob(s), u = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) u[i] = r.charCodeAt(i); return u; }
  function kernText(liste) { var g = liste.indexOf("_gig") >= 0; return liste.filter(function (z) { return z !== "_gig"; }).join("") + (g ? "+G" : ""); }
  function teilmengen(liste, max) {
    var aus = [];
    (function weiter(ab, jetzt) {
      if (jetzt.length) aus.push(jetzt.slice());
      if (jetzt.length === max) return;
      for (var i = ab; i < liste.length; i++) { jetzt.push(liste[i]); weiter(i + 1, jetzt); jetzt.pop(); }
    })(0, []);
    return aus;
  }
  function entschluesseln(k, e) {
    return subtle.digest("SHA-256", kodierer.encode("TÜ-LM 1 schluessel|" + k))
      .then(function (h) { return subtle.importKey("raw", h, "AES-GCM", false, ["decrypt"]); })
      .then(function (key) { return subtle.decrypt({ name: "AES-GCM", iv: b64(e.v) }, key, b64(e.c)); })
      .then(function (klar) { return JSON.parse(new TextDecoder().decode(klar)); });
  }
  function pruefen(a, nr) {
    if (!subtle || !kodierer) return;
    var liste = a.kern.slice(); if (gig) liste.push("_gig");
    if (!liste.length) return;
    var kerne = teilmengen(liste, 3).map(kernText), voll = kernText(liste);
    if (kerne.indexOf(voll) < 0) kerne.push(voll);
    Promise.all(kerne.map(function (k) { return subtle.digest("SHA-256", kodierer.encode("TÜ-LM 1 kern|" + k)).then(function (h) { return [k, hex(h).slice(0, 24)]; }); }))
      .then(function (paare) {
        var treffer = paare.filter(function (p) { return TABELLE[p[1]]; });
        return Promise.all(treffer.map(function (p) { return entschluesseln(p[0], TABELLE[p[1]]); }));
      })
      .then(function (funde) {
        if (nr !== zaehler) return;
        funde = funde.filter(function (p) { return !p.ex || p.k === voll; });
        if (!funde.length) return;
        funde.sort(function (x, y) { return ((y.s ? 1 : 0) - (x.s ? 1 : 0)) || (y.n - x.n); });
        var haupt = funde[0], weitere = funde.slice(1).filter(function (p) { return !teilVon(p.k, haupt.k); });
        zeigeSonder(a, haupt, weitere);
        funde.forEach(sammeln);
      }).catch(function () { /* still: dann eben keine Sonderprüfung */ });
  }
  function teile(k) { return (k.match(/[A-ZÄÖÜ][a-zäöü]*|\+G/g) || []); }
  function teilVon(klein, gross) { var g = teile(gross); return teile(klein).every(function (x) { return g.indexOf(x) >= 0; }); }
  /* Figur mit Zusätzen: r ersetzt einen markierten Teil, sonst wird s dazugelegt */
  function figurMit(p, auswahl) {
    var f = p.f, dazu = "", aktiv = [];
    (p.m || []).forEach(function (m) {
      if (auswahl.indexOf(m.z) < 0) return;
      aktiv.push(m);
      if (m.r) {
        var a = "<!--" + m.r + "-->", b = "<!--/" + m.r + "-->", i = f.indexOf(a), j = f.indexOf(b);
        if (i >= 0 && j > i) f = f.slice(0, i + a.length) + m.s + f.slice(j);
      } else dazu += m.s;
    });
    return { svg: f + dazu, aktiv: aktiv };
  }
  function zeigeSonder(a, p, weitere) {
    var fig = figurMit(p, a.kern);
    ordenEl.innerHTML = orden(a, { rand: T.sonder + " · " + p.t[en ? 1 : 0], email: p.e, figur: fig.svg, band: true });
    stempeln();
    sonderEl.querySelector(".ps-sonder-titel").textContent = p.t[en ? 1 : 0];
    sonderEl.querySelector(".ps-sonder-text").textContent = p.x[en ? 1 : 0];
    var notiz = sonderEl.querySelector(".ps-sonder-notiz");
    notiz.textContent = p.no ? p.no[en ? 1 : 0] : ""; notiz.hidden = !p.no;
    var zusatz = sonderEl.querySelector(".ps-zusatz"); zusatz.innerHTML = "";
    fig.aktiv.forEach(function (m) {
      var li = document.createElement("li"); li.innerHTML = "<b></b> <span></span>";
      li.querySelector("b").textContent = "+" + m.z; li.querySelector("span").textContent = m.t[en ? 1 : 0];
      zusatz.appendChild(li);
    });
    var offen = (p.m || []).length - fig.aktiv.length;
    var rest = sonderEl.querySelector(".ps-zusatz-rest");
    rest.textContent = offen > 0 ? T.zusatzOffen.replace("{n}", offen) : ""; rest.hidden = offen <= 0;
    sonderEl.hidden = false;
    markerEl.innerHTML = "";
    weitere.forEach(function (w, i) {
      var f = document.createElement("figure"); f.className = "ps-marker-orden";
      f.innerHTML = O.medaille({ code: w.k.replace("+G", "·G"), rand: T.sonder + " · " + w.t[en ? 1 : 0], klasse: "blech", email: w.e, figur: w.f, band: true, sp: sp, id: "mk" + i }) + "<figcaption></figcaption>";
      f.querySelector("figcaption").textContent = T.auch + " " + w.t[en ? 1 : 0];
      markerEl.appendChild(f);
    });
  }

  /* Sammelalbum: nur in diesem Browser */
  var SCHLUESSEL = "tuelm-album-3";
  function albumLesen() { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) || "[]"); } catch (e) { return []; } }
  function albumSchreiben(l) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(l)); } catch (e) { /* privat */ } }
  var album = albumLesen();
  function sammeln(p) {
    for (var i = 0; i < album.length; i++) if (album[i].k === p.k) return;
    album.push(p); albumSchreiben(album); albumZeigen();
  }
  function albumZeigen() {
    if (!albumEl) return;
    albumEl.innerHTML = "";
    album.forEach(function (p, i) {
      var f = document.createElement("figure"); f.className = "album-orden";
      f.innerHTML = O.medaille({ code: p.k.replace("+G", "·G"), rand: T.sonder + " · " + p.t[en ? 1 : 0], klasse: p.s ? "gold" : "silber", verstaerker: p.s ? 2 : 0, email: p.e, figur: p.f, band: true, sp: sp, id: "al" + i }) + "<figcaption></figcaption>";
      f.querySelector("figcaption").textContent = p.t[en ? 1 : 0];
      f.addEventListener("click", function () { ladenKern(p.k); wurzel.scrollIntoView({ behavior: ruhig ? "auto" : "smooth" }); });
      albumEl.appendChild(f);
    });
    if (albumZahl) albumZahl.textContent = T.gefunden.replace("{n}", album.length);
    var leeren = document.getElementById("album-leeren");
    if (leeren) leeren.hidden = !album.length;
  }
  var leerKnopf = document.getElementById("album-leeren");
  if (leerKnopf) leerKnopf.addEventListener("click", function () { album = []; albumSchreiben(album); albumZeigen(); });
  function ladenKern(k) {
    zustand = {}; gig = /\+G$/.test(k);
    teile(k).forEach(function (z) { if (z !== "+G") zustand[z] = ""; });
    zeichnen(true);
  }

  /* Kurzzeichen lesen (für Links wie #SKEWLLM): feste Reihenfolge, je Merkmal höchstens einmal */
  function laden(code) {
    if (!/(LLM|GLM)$/.test(code)) return false;
    var g = code.slice(-3) === "GLM", rest = code.slice(0, -3), zeichen = D.merkmale.map(function (m) { return m[0]; });
    var vor = [""].concat(VZ);
    function such(pos, ab) {
      if (pos === rest.length) return {};
      for (var j = ab; j < zeichen.length; j++) for (var k = 0; k < vor.length; k++) {
        var t = vor[k] + zeichen[j];
        if (rest.substr(pos, t.length) === t) { var r = such(pos + t.length, j + 1); if (r) { r[zeichen[j]] = vor[k]; return r; } }
      }
      return null;
    }
    var w = such(0, 0);
    if (!w) return false;
    zustand = w; gig = g; zeichnen(true); return true;
  }

  albumZeigen();
  var anker = "";
  try { anker = decodeURIComponent((location.hash || "").slice(1)); } catch (e) { anker = ""; }
  if (!anker || !laden(anker)) zeichnen(false);
})();

(function () { var a = document.querySelectorAll("a.sprache[hreflang]"); for (var i = 0; i < a.length; i++) { a[i].addEventListener("click", function () { try { localStorage.setItem("sprache", this.getAttribute("hreflang")); } catch (e) {} this.href = this.getAttribute("href").split("#")[0] + location.hash; }); } })();
