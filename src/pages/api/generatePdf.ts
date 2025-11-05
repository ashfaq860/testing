import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const isLocal = !process.env.AWS_REGION;

    const executablePath = isLocal
      ? process.env.CHROME_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : await chromium.executablePath();

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: isLocal ? true : chromium.headless,
    });

    const page = await browser.newPage();

    // Full bilingual question paper HTML
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.8;
            }
            h1 {
              text-align: center;
              color: #0070f3;
            }
            h3 {
              text-align: center;
              direction: rtl;
              color: #0070f3;
            }
            hr {
              margin: 20px 0;
            }
            p {
              margin-bottom: 16px;
              font-size: 16px;
            }
            b {
              color: #333;
            }
            code {
              background: #f4f4f4;
              padding: 2px 4px;
              border-radius: 4px;
              font-family: monospace;
            }
            footer {
              text-align: center;
              font-size: 14px;
              color: #777;
              margin-top: 30px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <h1>🧾 Bilingual Question Paper — Puppeteer-core (Local + Vercel)</h1>
          <h3>دو لسانی سوالنامہ — Puppeteer-core (لوکل اور ورسل)</h3>

          <hr />

          <p>
            <b>Q1:</b> Explain why <code>puppeteer-core</code> is preferred over <code>puppeteer</code> when deploying on Vercel.<br/>
            <b>س1:</b> وضاحت کریں کہ Vercel پر تعیناتی کے دوران <code>puppeteer</code> کی بجائے <code>puppeteer-core</code> کیوں استعمال کیا جاتا ہے۔
          </p>

          <p>
            <b>Q2:</b> What is the role of <code>@sparticuz/chromium</code> in serverless environments?<br/>
            <b>س2:</b> Serverless ماحول میں <code>@sparticuz/chromium</code> کا کیا کردار ہے؟
          </p>

          <p>
            <b>Q3:</b> Describe how <code>puppeteer-core</code> works locally vs on Vercel in Next.js.<br/>
            <b>س3:</b> وضاحت کریں کہ <code>puppeteer-core</code> Next.js میں لوکل اور Vercel پر کس طرح مختلف طریقے سے کام کرتا ہے۔
          </p>

          <p>
            <b>Q4:</b> What are the main challenges of using headless Chromium in a serverless deployment?<br/>
            <b>س4:</b> Serverless تعیناتی میں headless Chromium استعمال کرنے کی بنیادی مشکلات کیا ہیں؟
          </p>

          <p>
            <b>Q5:</b> Explain how you would generate multi-language content in a single PDF using Puppeteer-core.<br/>
            <b>س5:</b> وضاحت کریں کہ آپ Puppeteer-core کا استعمال کرتے ہوئے ایک ہی PDF میں مختلف زبانوں کا مواد کیسے تیار کریں گے۔
          </p>

          <footer>
            Generated automatically by Puppeteer-core and @sparticuz/chromium<br/>
            (Works locally and on Vercel)
          </footer>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "30px", right: "30px" },
    });

    await browser.close();

    // ✅ Proper PDF response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bilingual-question-paper.pdf"
    );
    res.status(200);
    res.end(pdfBuffer);
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    res
      .status(500)
      .json({ error: err.message || "PDF generation failed on server." });
  }
}
