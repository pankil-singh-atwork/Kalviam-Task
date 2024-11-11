import React, { useState } from "react";
import PDFViewer from "./PDFViewer";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pdfUrl = "path_to_pdf_file.pdf";

  return (
    <div>
      <h1>PDF Co-Viewer</h1>
      <label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        Admin Mode
      </label>
      <PDFViewer pdfUrl={pdfUrl} isAdmin={isAdmin} />
    </div>
  );
}

export default App;
