import * as XLSX from "xlsx";

// تابع چاپ مستقیم (ساده و بدون مشکل)
export const printReport = (elementId, title = "Report") => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("خطا: محتوای گزارش یافت نشد");
    return;
  }

  const originalContent = element.cloneNode(true);
  
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Vazirmatn', 'IRANSans', 'Tahoma', sans-serif;
          padding: 20px;
          background: white;
          color: #1e293b;
          direction: rtl;
        }
        
        .report-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .report-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .report-header h1 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #1e293b;
        }
        
        .report-header p {
          color: #64748b;
          font-size: 14px;
        }
        
        .glass-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .stat-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
        }
        
        .grid {
          display: grid;
          gap: 16px;
        }
        
        .grid-cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .grid-cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .text-2xl {
          font-size: 24px;
        }
        
        .font-bold {
          font-weight: bold;
        }
        
        .text-center {
          text-align: center;
        }
        
        .text-right {
          text-align: right;
        }
        
        .mb-4 {
          margin-bottom: 16px;
        }
        
        .mt-4 {
          margin-top: 16px;
        }
        
        .p-4 {
          padding: 16px;
        }
        
        .p-5 {
          padding: 20px;
        }
        
        .bg-white {
          background: white;
        }
        
        .text-gray-500 {
          color: #6b7280;
        }
        
        .text-green-400 {
          color: #10b981;
        }
        
        .text-blue-400 {
          color: #3b82f6;
        }
        
        .text-purple-400 {
          color: #8b5cf6;
        }
        
        .border {
          border: 1px solid #e2e8f0;
        }
        
        .rounded-xl {
          border-radius: 12px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        th, td {
          border: 1px solid #e2e8f0;
          padding: 10px;
          text-align: right;
        }
        
        th {
          background: #f1f5f9;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="report-header">
          <h1>${title}</h1>
          <p>تاریخ چاپ: ${new Date().toLocaleDateString("fa-IR")}</p>
          <p>ساعت: ${new Date().toLocaleTimeString("fa-IR")}</p>
        </div>
        ${originalContent.innerHTML}
      </div>
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
            setTimeout(() => window.close(), 1000);
          }, 500);
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
};

// تابع دانلود Excel
export const generateExcel = (data, headers, sheetName = "Report", filename = "report.xlsx") => {
  if (!data || data.length === 0) {
    alert("داده‌ای برای خروجی وجود ندارد");
    return;
  }

  const worksheetData = [headers, ...data.map(row => headers.map(h => row[h] || ""))];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const colWidths = headers.map(() => ({ wch: 20 }));
  worksheet['!cols'] = colWidths;
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
};

// تابع دانلود CSV
export const downloadCSV = (data, headers, filename = "report.csv") => {
  if (!data || data.length === 0) {
    alert("داده‌ای برای خروجی وجود ندارد");
    return;
  }

  let csvContent = headers.join(",") + "\n";

  data.forEach((row) => {
    const values = headers.map((header) => {
      let value = row[header] || "";
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += values.join(",") + "\n";
  });

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// تابع PDF با استفاده از چاپ (بدون html2canvas)
export const generatePDF = (elementId, filename = "report.pdf") => {
  // فقط از چاپ استفاده می‌کنیم
  printReport(elementId, filename.replace(".pdf", ""));
};