# Generator liniatur do kaligrafii

Aplikacja online do generowania liniatur (linii pomocniczych) do ćwiczenia kaligrafii.
Działa w całości w przeglądarce — bez serwera, bez build stepu.

**Demo:** po włączeniu GitHub Pages dostępne pod `https://<twoj-login>.github.io/<nazwa-repo>/`

## Funkcje

- **Predefiniowane liniatury** dla klasycznych krojów pisma:
  tekstura kwadratowa (textura quadrata), rotunda, uncjała, półuncjała,
  minuskuła karolińska, pismo fundacyjne, italika, fraktura,
  angielka (copperplate), spencerian
- **Pełna konfiguracja własna**: wysokość x, wydłużenia górne i dolne —
  w wielokrotnościach szerokości stalówki albo bezpośrednio w milimetrach
- **Linie pochyłe** dla pism kursywnych (dowolny kąt i rozstaw)
- Format **A4 pionowo / poziomo**, regulowane marginesy
- Podgląd na żywo (SVG) i **eksport do PDF** z dokładnością milimetrową —
  geometria w PDF jest identyczna z podglądem (wspólny kod, jednostki mm)

## Drukowanie

Drukuj PDF w **skali 100%** („rozmiar rzeczywisty”), bez opcji
„dopasuj do strony” — tylko wtedy wysokości linii na papierze będą dokładnie
takie, jak ustawione.

## Uruchomienie lokalne

Otwórz `index.html` w przeglądarce — to wszystko. (PDF generuje biblioteka
[jsPDF](https://github.com/parallax/jsPDF) ładowana z CDN, więc do pierwszego
otwarcia potrzebny jest internet.)

## Deploy na GitHub Pages

1. Utwórz repozytorium i wypchnij kod:

   ```bash
   git remote add origin git@github.com:<twoj-login>/generator-liniatur.git
   git push -u origin main
   ```

   albo jednym poleceniem przez GitHub CLI:

   ```bash
   gh repo create generator-liniatur --public --source=. --push
   ```

2. Włącz Pages: **Settings → Pages → Source: Deploy from a branch**,
   branch `main`, katalog `/ (root)`. Albo przez CLI:

   ```bash
   gh api repos/<twoj-login>/generator-liniatur/pages -X POST \
     -f "source[branch]=main" -f "source[path]=/"
   ```

3. Po chwili strona będzie dostępna pod
   `https://<twoj-login>.github.io/generator-liniatur/`.

## Licencja

MIT
