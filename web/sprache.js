// Sprachwaehler nach WIE_MACH_ICH_SPRACHEN.md, Abschnitt 4 (hier als Datei statt inline, ein Haus ohne Inline-Skripte)
var SPRACHEN = ["de", "en"];
var GRUND = "en";
function waehle(gespeichert, liste) {
  if (gespeichert && SPRACHEN.indexOf(gespeichert) >= 0) return gespeichert;
  for (var i = 0; i < liste.length; i++) {
    var teil = String(liste[i] || "").toLowerCase().split(/[-_]/)[0];
    if (SPRACHEN.indexOf(teil) >= 0) return teil;
  }
  return GRUND;
}
(function () {
  var gespeichert = null;
  try { gespeichert = localStorage.getItem("sprache"); } catch (e) {}
  var liste = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ""];
  location.replace(waehle(gespeichert, liste) + "/index.html" + location.search + location.hash);
})();
