import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const isLocal = !process.env.AWS_REGION;

    // ✅ Define executable path properly for both local & Vercel
    const executablePath = isLocal
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // adjust if needed
      : await chromium.executablePath();

 const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath,
  headless: true, // ✅ always true for serverless (Vercel)
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
          }
          h1, h2, h3 { text-align: center; margin-bottom: 10px; }
          h1 { font-size: 24px; }
          h2 { font-size: 20px; color: #444; }
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
          .urdu { direction: rtl; text-align: right; font-size: 1.1rem; margin-top: 5px; }
          .english { direction: ltr; text-align: left; font-size: 1.1rem; }
          .dual { display: flex; justify-content: space-between; gap: 20px; }
          .page-break { page-break-after: always; }
        </style>
      </head>
      <body>
        <h1>🧾 Bilingual Question Paper</h1>
        <h2>دو لسانی سوالنامہ (Puppeteer-core in Next.js)</h2>
        <div class="meta">
          <b>Subject:</b> Next.js Serverless Automation<br/>
          <b>Time:</b> 2 hours &nbsp; | &nbsp; <b>Total Marks:</b> 50
        </div>

        <div class="section">
          <div class="dual">
            <div class="english"><b>Q1:</b> Explain why Puppeteer-core is preferred over Puppeteer when deploying on Vercel.</div>
            <div class="urdu"><b>س1:</b> وضاحت کریں کہ Vercel پر تعیناتی کے وقت Puppeteer-core کیوں استعمال کیا جاتا ہے؟</div>
          </div>
        </div>

        <h3 style="text-align:center; margin-top:40px;">--- End of Paper ---</h3>
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

    // ✅ Stream PDF properly
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bilingual-question-paper.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error: any) {
    console.error("PDF generation failed:", error);
    res.status(500).json({ error: error.message });
  }
}
