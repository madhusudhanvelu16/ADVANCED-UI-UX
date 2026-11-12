import puppeteer from 'puppeteer-core';
import path from 'path';

async function check() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve('report.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    preferCSSPageSize: true
  });

  const str = pdf.toString('latin1');
  const match = str.match(/\/Type\s*\/Page\b/g);
  console.log('Total PDF Pages:', match ? match.length : 0);
  await browser.close();
}

check();

