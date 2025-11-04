import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Detect if running locally or on Vercel
    const isLocal = !process.env.AWS_REGION;

    // Local Chrome path detection
    const localChromePath =
      process.platform === "win32"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "/usr/bin/google-chrome";

    const executablePath = isLocal
      ? localChromePath
      : await chromium.executablePath();

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true, // ✅ fixed: use plain headless mode
      defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();

    const html = `
      <html dir="rtl" lang="ur">
      <head>
        <meta charset="UTF-8" />
        <title>دو لسانی سوالنامہ / Bilingual Question Paper</title>
        <style>
          body {
            font-family: 'Noto Naskh Arabic', Arial, sans-serif;
            padding: 40px;
            background: #fdfdfd;
            line-height: 1.8;
          }
          h1, h2, h3 { text-align: center; margin-bottom: 10px; }
          .section { margin-bottom: 35px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          .dual { display: flex; justify-content: space-between; gap: 20px; }
          .urdu { direction: rtl; text-align: right; font-size: 1.1rem; }
          .english { direction: ltr; text-align: left; font-size: 1.1rem; }
          .page-break { page-break-after: always; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 40px; }
        </style>
      </head>
      <body>
        <h1>🧾 Bilingual Question Paper</h1>
        <h2>دو لسانی سوالنامہ (Generated via Puppeteer-core + Next.js)</h2>
        <div class="section">
          <div class="dual">
            <div class="english">1. Define serverless computing.</div>
            <div class="urdu">1. سرور لیس کمپیوٹنگ کی تعریف کریں۔</div>
          </div>
          <div class="dual">
            <div class="english">2. What is Puppeteer?</div>
            <div class="urdu">2. پپیٹیئر کیا ہے؟</div>
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Examly Automation System
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", bottom: "30px", left: "20px", right: "20px" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bilingual-question-paper.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error: any) {
    console.error("❌ PDF generation failed:", error);
    res.status(500).json({ error: error.message || "PDF generation error" });
  }
}
