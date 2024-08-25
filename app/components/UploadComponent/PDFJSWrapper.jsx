import * as PDFJS from 'pdfjs-dist/build/pdf';

class PDFJSWrapper {
  static async initialize() {
    PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
  }

  static async convertPdfToImage(file) {
    await this.initialize();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 1.5;
    
    let totalHeight = 0;
    const pageImages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport }).promise;
      pageImages.push(canvas.toDataURL('image/png'));
      totalHeight += viewport.height;
    }

    // Combine all pages into a single image
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = canvas.width;
    combinedCanvas.height = totalHeight;
    const combinedCtx = combinedCanvas.getContext('2d');

    let yOffset = 0;
    for (const pageImage of pageImages) {
      const img = new Image();
      img.src = pageImage;
      await new Promise(resolve => {
        img.onload = () => {
          combinedCtx.drawImage(img, 0, yOffset);
          yOffset += img.height;
          resolve();
        };
      });
    }

    return combinedCanvas.toDataURL('image/png');
  }
}

export default PDFJSWrapper;