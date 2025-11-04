import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const isLocal = !process.env.AWS_REGION;
    const executablePath = isLocal
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : await chromium.executablePath();

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true, // must be true
      defaultViewport: { width: 1280, height: 720 }, // safe default
    });

    const page = await browser.newPage();

    await page.setContent("<h1>Hello PDF</h1>", { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=hello.pdf");
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "PDF generation failed" });
  }
}
