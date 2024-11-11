import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import io from "socket.io-client";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const socket = io("http://localhost:4000"); // Connect to backend

const PDFViewer = ({ pdfUrl, isAdmin }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // Set admin role if this user is the presenter
    if (isAdmin) {
      socket.emit("setAdmin");
    }

    // Listen for page changes from the server
    socket.on("pageChanged", (page) => {
      setPageNumber(page);
    });

    return () => socket.off("pageChanged");
  }, [isAdmin]);

  // Load PDF page count
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Send page change to server (if admin)
  const changePage = (offset) => {
    if (isAdmin) {
      const newPage = pageNumber + offset;
      if (newPage > 0 && newPage <= numPages) {
        socket.emit("changePage", newPage);
      }
    }
  };

  return (
    <div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        Page {pageNumber} of {numPages}
      </div>
      {isAdmin && (
        <div>
          <button onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
            Previous
          </button>
          <button onClick={() => changePage(1)} disabled={pageNumber >= numPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
