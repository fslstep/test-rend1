const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Crea l'app Express
const app = express();

// Path dove verrà salvato il PDF generato
const pdfPath = path.join(__dirname, 'generated.pdf');

// Endpoint che genera e serve il PDF
app.get('/gen', async (req, res) => {
  // Esempio di stringa HTML mockata
  const htmlContent = `
    <html>
      <head>
        <title>PDF da HTML</title>
      </head>
      <body>
        <h1>PDF da HTML!</h1>
        <p>Esempio di un PDF generato da una stringa HTML.</p>
      </body>
    </html>
  `;

  try {
    // Crea un'istanza di Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Imposta il contenuto HTML
    await page.setContent(htmlContent);

    // Genera il PDF e salvalo localmente
    await page.pdf({ path: pdfPath, format: 'A4' });

    // Chiudi il browser
    await browser.close();

    // Serve il PDF generato
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Errore nel servire il PDF:', err);
        res.status(500).send('Errore interno');
      }
    });
  } catch (error) {
    console.error('Errore nel generare il PDF:', error);
    res.status(500).send('Errore interno');
  }
});

// Avvia il server su una porta specifica
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
