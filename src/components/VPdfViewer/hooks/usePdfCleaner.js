export function usePdfCleaner(pdfContainer, pdf, pageCanvases, pageCache){

    return function cleanAll(){
        pageCanvases.forEach((p) => {     
            if (p.renderTask) {
            try { 
                p.renderTask.cancel(); 
            } 
            catch {}
            p.renderTask = null;
            }

            const canvas = p.canvasWrapper?.querySelector?.('canvas');
            if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = 0;
            canvas.height = 0;
            p.canvasWrapper.removeChild(canvas);
            }

            const page = pageCache.get(p.pageNum);
            if (page?.cleanup) {
            try { 
                page.cleanup(); 
            } 
            catch {}
            }
        });

        pageCache.clear();
        pageCanvases = [];

        if (pdf) {
            try {
                pdf.cleanup?.();
                pdf.destroy?.();
            } catch (e) {
                console.warn('PDF destroy error', e);
            }
            pdf = null;
        }

        const container = pdfContainer.value;
        if (container) container.innerHTML = '';

        console.log('All PDF resources released');
    }
}