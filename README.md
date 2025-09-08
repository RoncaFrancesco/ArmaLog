# ArmaLog (PWA offline)

ArmaLog è una web app **PWA** per registrare armi, sessioni di tiro, manutenzioni, munizioni e licenze/tesserini — **funziona offline** e supporta **notifiche locali** (reminder manutenzione post-sessione, promemoria backup settimanale e scadenze licenze).

## Funzionalità
- ✅ **Offline-first** con Service Worker e pagina `offline.html`
- ✅ **Installabile** come app (manifest + icone)
- ✅ **Dati locali**: IndexedDB per i registri, impostazioni in localStorage
- ✅ **Backup/Restore** (JSON/CSV) + reminder settimanale
- ✅ **Promemoria**:
  - Pulizia arma **+1 giorno** dopo una sessione se non registri la manutenzione
  - Notifica **settimanale** per fare il backup (lun 09:00)
  - Scadenze **tesserino poligono/porto d’armi** (−30/−7/giorno scadenza)
- ✅ **Mobile 9:16** (portrait) ottimizzata: nav 7 voci, FAB/Toast rispettano le safe areas

> **Nota**: le notifiche “programmate” usano `Notification.showTrigger` quando supportato; altrimenti c’è un **fallback** che mostra i reminder alla **prossima apertura** dell’app. Per notifiche affidabili anche a **app chiusa**, usare **Web Push** con backend (si può aggiungere in futuro).

## Struttura
```
index.htm
service-worker.js
manifest.webmanifest
offline.html
vercel.json
icon-192.png
icon-512.png
maskable-512.png
app.js        # placeholder (evita 404 se referenziato)
```

## Deploy rapido (Vercel)
1. Fai il push di questi file su GitHub.
2. Importa il repo su **Vercel** (framework: *Other*).
3. Deploy. Gli header di sicurezza e il content-type del manifest sono già in `vercel.json`.

## Deploy GitHub Pages
1. Imposta il branch per Pages (es. `/` o `docs/`).  
2. Le notifiche potrebbero richiedere HTTPS completo e SW scope corretto (Pages serve su HTTPS).  
3. Se cambi la root, aggiorna i **path** nel Service Worker (shell `APP_SHELL`).

## Sviluppo
- Incrementa `VERSION` in `service-worker.js` ad ogni modifica di asset per forzare l’update cache.
- Testa sempre **offline** dal pannello Application di DevTools.
- Verifica i permessi notifiche su **device reale**.

## Licenza
MIT — vedi `LICENSE` (opzionale, aggiungila se vuoi).
