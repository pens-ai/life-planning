# Life Planner 2026 📅

Un'applicazione React per pianificare il tuo anno 2026 con categorie per Sport, Viaggi, Alimentazione, Risparmi, Salute, Eventi, Formazione e Casa.

## 🚀 Come Iniziare

### Prerequisiti
- Node.js 18+ installato ([scarica qui](https://nodejs.org/))
- VS Code ([scarica qui](https://code.visualstudio.com/))

### Installazione

1. **Apri la cartella in VS Code**
   ```
   Apri VS Code → File → Apri Cartella → Seleziona "life-planner-2026"
   ```

2. **Apri il terminale in VS Code**
   ```
   Terminal → New Terminal (oppure Ctrl+`)
   ```

3. **Installa le dipendenze**
   ```bash
   npm install
   ```

4. **Avvia l'applicazione**
   ```bash
   npm run dev
   ```

5. **Apri nel browser**
   ```
   Vai su http://localhost:5173
   ```

## ✨ Funzionalità

- **📅 Calendario interattivo** - Clicca su un giorno per aggiungere eventi
- **🎨 8 Categorie** - Sport, Viaggi, Alimentazione, Risparmi, Salute, Eventi, Formazione, Casa
- **📆 Eventi multi-giorno** - Crea eventi che durano più giorni (es. viaggi)
- **🖱️ Drag & Drop** - Trascina gli eventi tra i giorni
- **💾 Salvataggio automatico** - I dati si salvano automaticamente in localStorage
- **📊 Statistiche** - Visualizza il riepilogo mensile e annuale
- **📤 Export/Import** - Esporta i tuoi dati in JSON per backup

## 🎯 Come Usare

1. **Clicca su un giorno** nel calendario
2. **Scegli una categoria** (es. Sport)
3. **Scegli un sottotipo** (es. Palestra)
4. **Aggiungi una descrizione** (opzionale)
5. **Attiva "Più giorni"** se l'evento dura più di un giorno
6. **Clicca Aggiungi**

### Drag & Drop
- Apri il modal di un giorno
- Trascina un evento dalla maniglia ⋮⋮
- Rilascialo su un altro giorno nel calendario

### Backup
- **⬇️ Export**: Scarica un file JSON con tutti i tuoi dati
- **⬆️ Import**: Carica un file JSON di backup

## 📁 Struttura Progetto

```
life-planner-2026/
├── src/
│   ├── App.jsx        # Componente principale
│   ├── main.jsx       # Entry point
│   └── index.css      # Stili Tailwind
├── public/
│   └── calendar.svg   # Favicon
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Comandi Disponibili

```bash
npm run dev      # Avvia in modalità sviluppo
npm run build    # Crea build di produzione
npm run preview  # Anteprima build di produzione
```

## 💡 Note

- I dati vengono salvati nel **localStorage** del browser
- Se cambi browser o cancelli i dati del browser, perderai gli eventi
- Usa la funzione **Export** regolarmente per fare backup!

## 🔧 Tecnologie

- React 18
- Vite
- Tailwind CSS
- Lucide React (icone)

---

Buona pianificazione! 🎉
