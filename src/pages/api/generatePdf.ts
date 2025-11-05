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
      executablePath,
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
    });

    const page = await browser.newPage();

    // ✅ Use a font that supports Urdu text (Google Font)
    const html = `
      <html lang="ur">
        <head>
          <meta charset="utf-8" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'Roboto', Arial, sans-serif;
              padding: 40px;
              line-height: 1.8;
              direction: rtl;
              unicode-bidi: bidi-override;
              background: #fff;
              color: #111;
            }
            h1, h2, h3 {
              text-align: center;
              color: #0070f3;
              direction: rtl;
            }
            h1 { font-size: 26px; margin-bottom: 8px; }
            h2 { font-size: 22px; margin-top: 40px; margin-bottom: 10px; border-bottom: 2px solid #0070f3; display: inline-block; padding-bottom: 4px; }
            h3 { font-size: 18px; margin-bottom: 16px; }
            p, li {
              font-size: 16px;
              margin-bottom: 10px;
            }
            ol, ul {
              padding-right: 20px;
            }
            .eng {
              direction: ltr;
              text-align: left;
              font-family: 'Roboto', Arial, sans-serif;
            }
            footer {
              text-align: center;
              font-size: 14px;
              color: #777;
              margin-top: 40px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
              direction: ltr;
            }
          </style>
        </head>
        <body>
          <h1>📘 دو لسانی سوالنامہ</h1>
          <h3>Bilingual Question Paper (Urdu + English)</h3>

          <p style="text-align:center;"><b>Subject:</b> Computer Science<br/><b>Total Marks:</b> 100<br/><b>Time:</b> 3 Hours</p>
          <hr/>

          <!-- ===================== MCQs Section ===================== -->
          <h2>حصہ اول: کثیر الانتخاب سوالات (MCQs)</h2>
          <h3 class="eng">Section A: Multiple Choice Questions (12 Marks)</h3>

          <ol>
            ${Array.from({ length: 12 }, (_, i) => `
              <li>
                <b>Q${i + 1}:</b> کمپیوٹر کی بنیادی اکائی کیا ہے؟<br/>
                <span class="eng"><b>Q${i + 1}:</b> What is the basic unit of a computer?</span><br/>
                (a) Bit  (b) Byte  (c) Kilobyte  (d) Megabyte
              </li>
            `).join('')}
          </ol>

          <!-- ===================== Short Questions ===================== -->
          <h2>حصہ دوم: مختصر سوالات (Short Questions)</h2>
          <h3 class="eng">Section B: Short Questions (24 Marks)</h3>

          <ol start="13">
            ${Array.from({ length: 24 }, (_, i) => `
              <li>
                <b>سوال ${i + 1}:</b> کمپیوٹر نیٹ ورک کیا ہے؟<br/>
                <span class="eng"><b>Q${i + 1}:</b> What is a computer network?</span>
              </li>
            `).join('')}
          </ol>

          <!-- ===================== Long Questions ===================== -->
          <h2>حصہ سوم: طویل سوالات (Long Questions)</h2>
          <h3 class="eng">Section C: Long Questions (25 Marks)</h3>

          <ol start="37">
            ${Array.from({ length: 5 }, (_, i) => `
              <li>
                <b>سوال ${i + 1}:</b> کمپیوٹر کے مختلف اجزاء کی وضاحت کریں۔<br/>
                <span class="eng"><b>Q${i + 1}:</b> Explain the different components of a computer system.</span>
              </li>
            `).join('')}
          </ol>

          <footer>
            Generated automatically by Puppeteer-core & @sparticuz/chromium<br/>
            (Fully Bilingual | Works on Local + Vercel)
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

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bilingual-question-paper.pdf"
    );
    res.status(200).end(pdfBuffer);
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    res
      .status(500)
      .json({ error: err.message || "PDF generation failed on server." });
  }
}
