import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleGeneratePdf = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generatePdf");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "bilingual-question-paper.pdf";
      link.click();
    } catch (error) {
      alert("Error generating PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>
        🧾 Bilingual Question Paper — Puppeteer-core (Local + Vercel)
      </h1>
      <h3 style={{ textAlign: "center", direction: "rtl" }}>
        دو لسانی سوالنامہ — Puppeteer-core (لوکل اور ورسل)
      </h3>

      <hr />
      <div style={{ marginTop: "20px", lineHeight: "1.8" }}>
        <p>
          <b>Q1:</b> Explain why Puppeteer-core is preferred over Puppeteer when
          deploying on Vercel.
          <br />
          <b>س1:</b> وضاحت کریں کہ Vercel پر deploy کرتے وقت Puppeteer کی بجائے
          Puppeteer-core کیوں استعمال کیا جاتا ہے۔
        </p>

        <p>
          <b>Q2:</b> What is the role of <code>@sparticuz/chromium</code> in
          serverless environments?
          <br />
          <b>س2:</b> Serverless ماحول میں <code>@sparticuz/chromium</code> کا کیا
          کردار ہے؟
        </p>

        <p>
          <b>Q3:</b> Describe how Puppeteer-core works locally vs on Vercel in
          Next.js.
          <br />
          <b>س3:</b> وضاحت کریں کہ Puppeteer-core Next.js میں لوکل اور Vercel پر
          کس طرح مختلف طریقے سے کام کرتا ہے۔
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={handleGeneratePdf}
          style={{
            background: "#0070f3",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </div>
  );
}
