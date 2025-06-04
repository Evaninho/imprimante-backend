const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3005;
app.use(cors({
  origin: '*',
  methods: ['GET'],
}));
app.use(express.static('public'));

const nbOnlyIPs = [
  '10.25.50.171',
  '10.177.29.238',
];

app.get('/info', async (req, res) => {
  const ipList = req.query.ips?.split(',') || [];

  if (ipList.length === 0) {
    return res.json([]);
  }

  const browser = await puppeteer.launch({
    executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`
  });

  const results = await Promise.all(
    ipList.map(async (ip) => {
      const baseUrl = `http://${ip}`;
      const page = await browser.newPage();
      const page2 = await browser.newPage();
      const data = [];fefzefze

      try {
        if (nbOnlyIPs.includes(ip)) {
          await page.goto(`${baseUrl}/home/index.html#hashHome`, { waitUntil: 'networkidle0', timeout: 50000 });
          await page.waitForSelector('span.xux-staticText', { timeout: 50000 });
          const spans = await page.$$('span.xux-staticText');

          if (spans.length > 3) {
            data.push(await page.evaluate(el => el.textContent, spans[0]));
            data.push(await page.evaluate(el => el.textContent, spans[1]));
            data.push(await page.evaluate(el => el.textContent, spans[3]));
            while (data.length < 7) data.push('X');
          }

          await page2.goto(`${baseUrl}/home/index.html#hashSupplies/hashHome`, { waitUntil: 'networkidle0', timeout: 50000 });
          await page2.waitForSelector('span.xux-staticText', { timeout: 50000 });
          const couleurs = await page2.$$('span.xux-staticText');
          data.push(await page2.evaluate(el => el.textContent, couleurs[1]));
          while (data.length < 14) data.push('X');
        } else {
          await page.goto(`${baseUrl}/home/index.html#hashHome`, { waitUntil: 'networkidle0', timeout: 50000 });
          await page.waitForSelector('span.xux-staticText', { timeout: 50000 });
          const perifAll = await page.$$('span.xux-staticText');
          data.push(await page.evaluate(el => el.textContent, perifAll[0]) || 'X');
          data.push(await page.evaluate(el => el.textContent, perifAll[1]) || 'X');
          data.push(await page.evaluate(el => el.textContent, perifAll[3]) || 'X');
          data.push(await page.evaluate(el => el.textContent, perifAll[4]) || 'X');

          await page2.goto(`${baseUrl}/home/index.html#hashSupplies/hashHome`, { waitUntil: 'networkidle0', timeout: 50000 });
          await page2.waitForSelector('span.xux-staticText', { timeout: 50000 });
          const couleurs = await page2.$$('span.xux-staticText');

          for (let i = 1; i < 11; i++) {
            if (couleurs[i]) {
              try {
                const couleur = await page2.evaluate(el => el.textContent, couleurs[i]);
                data.push(couleur || 'X');
              } catch {
                data.push('X');
              }
            } else {
              data.push('X');
            }
          }
        }

        await page.close();
        await page2.close();
        return { ip, tabInfo: data };

      } catch (error) {
        await page.close();
        await page2.close();
        return { ip, error: `Erreur lors du chargement : ${error.message}` };
      }
    })
  );

  await browser.close();
  res.json(results);
});

const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Serveur lancé sur : http://localhost:${port}`);
});
