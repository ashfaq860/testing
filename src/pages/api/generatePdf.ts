import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
  try {
    const isLocal = !process.env.AWS_REGION;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: isLocal
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // Adjust for your system
        : await chromium.executablePath(),
      headless: true,
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
          h1, h2, h3 {
            text-align: center;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 24px;
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
        </style>
      </head>
      <body>
        <h1>🧾 Bilingual Question Paper</h1>
        <h2>دو لسانی سوالنامہ (Puppeteer-core in Next.js)</h2>
        <div class="meta">
          <b>Subject:</b> Next.js Serverless Automation<br/>
          <b>Time:</b> 2 hours &nbsp; | &nbsp; <b>Total Marks:</b> 50
        </div>

        <!-- Q1 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q1:</b> Explain why Puppeteer-core is preferred over Puppeteer when deploying on Vercel.
            </div>
            <div class="urdu">
              <b>س1:</b> وضاحت کریں کہ Vercel پر تعیناتی کے وقت Puppeteer کی بجائے Puppeteer-core کیوں استعمال کیا جاتا ہے؟
            </div>
          </div>
        </div>

        <!-- Q2 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q2:</b> What is the purpose of <code>@sparticuz/chromium</code> in serverless environments?
            </div>
            <div class="urdu">
              <b>س2:</b> Serverless ماحول میں <code>@sparticuz/chromium</code> کا کیا کردار ہے؟
            </div>
          </div>
        </div>

        <!-- Q3 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q3:</b> Describe how Puppeteer-core runs Chrome locally versus on Vercel.
            </div>
            <div class="urdu">
              <b>س3:</b> وضاحت کریں کہ Puppeteer-core لوکل مشین پر اور Vercel پر Chrome کو کس طرح چلاتا ہے؟
            </div>
          </div>
        </div>

        <!-- Q4 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q4:</b> What are the main differences between Puppeteer and Puppeteer-core packages?
            </div>
            <div class="urdu">
              <b>س4:</b> Puppeteer اور Puppeteer-core پیکجز کے درمیان بنیادی فرق کیا ہے؟
            </div>
          </div>
        </div>

        <!-- Q5 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q5:</b> Explain the role of “executablePath” in Puppeteer-core configuration.
            </div>
            <div class="urdu">
              <b>س5:</b> Puppeteer-core کی ترتیب میں “executablePath” کا کیا کردار ہے؟
            </div>
          </div>
        </div>

        <div class="page-break"></div>

        <!-- Q6 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q6:</b> Why can’t Puppeteer run directly on Vercel without a custom Chromium binary?
            </div>
            <div class="urdu">
              <b>س6:</b> Puppeteer کو Vercel پر custom Chromium کے بغیر براہ راست کیوں نہیں چلایا جا سکتا؟
            </div>
          </div>
        </div>

        <!-- Q7 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q7:</b> What are common issues faced when generating PDFs with Puppeteer-core on Vercel?
            </div>
            <div class="urdu">
              <b>س7:</b> Puppeteer-core کے ذریعے Vercel پر PDF بناتے وقت عام مسائل کون سے ہیں؟
            </div>
          </div>
        </div>

        <!-- Q8 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q8:</b> Write a short note on the importance of headless browsers in serverless automation.
            </div>
            <div class="urdu">
              <b>س8:</b> Serverless automation میں headless browsers کی اہمیت پر مختصر نوٹ لکھیں۔
            </div>
          </div>
        </div>

        <!-- Q9 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q9:</b> Explain how Puppeteer-core integrates with Next.js API routes for PDF generation.
            </div>
            <div class="urdu">
              <b>س9:</b> وضاحت کریں کہ Puppeteer-core Next.js API routes کے ساتھ PDF بنانے کے لیے کس طرح منسلک ہوتا ہے؟
            </div>
          </div>
        </div>

        <!-- Q10 -->
        <div class="section">
          <div class="dual">
            <div class="english">
              <b>Q10:</b> Discuss future alternatives to Puppeteer for serverless environments.
            </div>
            <div class="urdu">
              <b>س10:</b> Serverless ماحول کے لیے Puppeteer کے متبادل مستقبل کے اختیارات پر تبادلہ خیال کریں۔
            </div>
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

    // ✅ Fixed PDF streaming (no “Failed to load”)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bilingual-question-paper.pdf"
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("PDF generation failed:", error);
    res.status(500).json({ error: error.message });
  }
}
