import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Detect local vs Vercel environment
    const isLocal = !process.env.AWS_REGION;

    // Detect local Chrome path dynamically for Windows, macOS, Linux
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
      headless: chromium.headless,
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
            font-family: 'Noto Naskh Arabic', 'Arial', sans-serif;
            padding: 40px;
            line-height: 1.8;
            background: #fdfdfd;
          }
          h1, h2, h3 {
            text-align: center;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 24px;
            color: #222;
          }
          h2 {
            font-size: 20px;
            color: #444;
          }
          .meta {
            text-align: center;
            margin-bottom: 30px;
            font-size: 14px;
            color: #555;
          }
          .section {
            margin-bottom: 35px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
          }
          .urdu {
            direction: rtl;
            text-align: right;
            font-size: 1.1rem;
            margin-top: 5px;
          }
          .english {
            direction: ltr;
            text-align: left;
            font-size: 1.1rem;
          }
          .dual {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          .page-break {
            page-break-after: always;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <h1>🧾 Bilingual Question Paper</h1>
        <h2>دو لسانی سوالنامہ (Generated via Puppeteer-core + Next.js)</h2>
        <div class="meta">
          <b>Subject:</b> Next.js Serverless Automation<br/>
          <b>Time:</b> 2 hours &nbsp; | &nbsp; <b>Total Marks:</b> 50
        </div>

        <div class="section">
          <h3>Section A – Short Questions</h3>
          <div class="dual">
            <div class="english">1. Define serverless computing in simple words.</div>
            <div class="urdu">1. سرور لیس کمپیوٹنگ کی سادہ تعریف بیان کریں۔</div>
          </div>
          <div class="dual">
            <div class="english">2. What is the purpose of Puppeteer in a Next.js project?</div>
            <div class="urdu">2. نیٹ جے ایس پروجیکٹ میں پپیٹیئر کا کیا مقصد ہے؟</div>
          </div>
          <div class="dual">
            <div class="english">3. Name any two PDF generation methods for web apps.</div>
            <div class="urdu">3. ویب ایپس میں پی ڈی ایف بنانے کے دو طریقے لکھیں۔</div>
          </div>
        </div>

        <div class="section page-break">
          <h3>Section B – Long Questions</h3>
          <div class="dual">
            <div class="english">
              4. Explain how Puppeteer-core works with @sparticuz/chromium on Vercel.
            </div>
            <div class="urdu">
              4. وضاحت کریں کہ پپیٹیئر کور @sparticuz/chromium کے ساتھ Vercel پر کیسے کام کرتا ہے۔
            </div>
          </div>
          <div class="dual">
            <div class="english">
              5. Discuss advantages of using Puppeteer over other PDF libraries.
            </div>
            <div class="urdu">
              5. دیگر پی ڈی ایف لائبریریوں کے مقابلے میں پپیٹیئر کے فوائد پر بحث کریں۔
            </div>
          </div>
        </div>

        <h3 style="text-align:center; margin-top:40px;">--- End of Paper ---</h3>
        <div class="footer">
          © ${new Date().getFullYear()} Examly Automation System — Powered by Next.js
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
