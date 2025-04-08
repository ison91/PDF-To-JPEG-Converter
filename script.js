function convertPDF() {
  const fileInput = document.getElementById('pdf-upload');
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  if (fileInput.files.length === 0) {
    alert("Please upload a PDF file.");
    return;
  }

  const file = fileInput.files[0];
  const fileReader = new FileReader();

  fileReader.onload = function () {
    const typedArray = new Uint8Array(this.result);

    pdfjsLib.getDocument(typedArray).promise.then(pdf => {
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        pdf.getPage(pageNumber).then(page => {
          const scale = 2;
          const viewport = page.getViewport({ scale: scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          page.render(renderContext).promise.then(() => {
            const link = document.createElement('a');
            link.download = `page-${pageNumber}.jpeg`;
            link.href = canvas.toDataURL("image/jpeg", 1.0);
            link.textContent = `Download JPEG of Page ${pageNumber}`;
            link.className = 'download-link';
            link.style.display = 'block';
            link.style.margin = '10px auto';

            outputDiv.appendChild(canvas);
            outputDiv.appendChild(link);
          });
        });
      }
    });
  };

  fileReader.readAsArrayBuffer(file);
}
