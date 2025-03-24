"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Ensure compatibility for all browsers
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const fileCusUrl = "/api/pdf-proxy?url=" + encodeURIComponent(fileUrl);

  return (
    <div className="w-full my-4">
        <Document file={fileCusUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages > 0 &&
            Array.from({ length: numPages }, (_, index) => (
              <Page 
                key={index} 
                pageNumber={index + 1} 
                className="mb-4"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
        </Document>
    </div>
  );
}

export default PdfViewer;
