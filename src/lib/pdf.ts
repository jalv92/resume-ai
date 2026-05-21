import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Analysis } from '../types';

export function downloadAnalysisPdf(analysis: Analysis) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;

  // Cover band
  doc.setFillColor(28, 27, 24);
  doc.rect(0, 0, pageWidth, 110, 'F');
  doc.setTextColor(246, 245, 241);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Resume-AI · Full Report', margin, 56);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(168, 165, 150);
  doc.text(`Compatibility score: ${analysis.score} / 100`, margin, 80);
  doc.text(new Date().toLocaleDateString(), pageWidth - margin, 80, { align: 'right' });

  let y = 150;

  doc.setTextColor(28, 27, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Verdict', margin, y);
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(62, 61, 55);
  const verdictLines = doc.splitTextToSize(analysis.oneLineVerdict, contentWidth);
  doc.text(verdictLines, margin, y);
  y += verdictLines.length * 14 + 14;

  const section = (title: string, items: string[]) => {
    if (y > 720) {
      doc.addPage();
      y = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(28, 27, 24);
    doc.text(title, margin, y);
    y += 8;
    doc.setDrawColor(214, 212, 198);
    doc.line(margin, y, margin + 80, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(62, 61, 55);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`•  ${item}`, contentWidth - 12);
      if (y + lines.length * 14 > 780) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += lines.length * 14 + 4;
    });
    y += 10;
  };

  section('Strengths', analysis.strengths);
  section('Gaps to close', analysis.gaps);
  section('ATS keywords missing in your resume', analysis.atsKeywords);

  if (y > 680) {
    doc.addPage();
    y = margin;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(28, 27, 24);
  doc.text('Bullet rewrites', margin, y);
  y += 8;
  doc.setDrawColor(214, 212, 198);
  doc.line(margin, y, margin + 80, y);
  y += 6;

  autoTable(doc, {
    startY: y + 8,
    head: [['Original', 'Improved', 'Why']],
    body: analysis.bulletRewrites.map((b) => [b.original, b.improved, b.reason]),
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 6, valign: 'top', textColor: [62, 61, 55] },
    headStyles: { fillColor: [28, 27, 24], textColor: [246, 245, 241], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [246, 245, 241] },
    margin: { left: margin, right: margin },
    columnStyles: { 0: { cellWidth: contentWidth * 0.32 }, 1: { cellWidth: contentWidth * 0.42 }, 2: { cellWidth: contentWidth * 0.26 } },
  });

  // @ts-expect-error autoTable extends doc
  y = doc.lastAutoTable.finalY + 24;
  if (y > 700) {
    doc.addPage();
    y = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(28, 27, 24);
  doc.text('Cover letter hook', margin, y);
  y += 18;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(62, 61, 55);
  const hookLines = doc.splitTextToSize(`"${analysis.coverLetterHook}"`, contentWidth);
  doc.text(hookLines, margin, y);
  y += hookLines.length * 14 + 18;

  section('Next steps (do these this week)', analysis.nextSteps);

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(168, 165, 150);
    doc.text('Resume-AI — generated locally, never stored after download.', margin, doc.internal.pageSize.getHeight() - 24);
    doc.text(`${i} / ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 24, { align: 'right' });
  }

  doc.save(`resume-ai-report-${analysis.score}.pdf`);
}
