import puppeteer from 'puppeteer-core';
import path from 'path';

async function generatePDF() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve('report.html').replace(/\\/g, '/');
  console.log('Loading:', filePath);
  
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  const outputPath = path.resolve('SafeRide_Advanced_UIUX_Report.pdf');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  });

  console.log('PDF generated successfully at:', outputPath);
  await browser.close();
}

generatePDF().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
