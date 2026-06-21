import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
export function usePdfRenderer(pdf, pdfContainer, pageCanvases, pageCache, observer, resizeTimer, props){
    
    // 加載頁面
    async function loadPdf() {
        
        if (!props.pdfFile) return;
        
        // 銷毀舊 PDF 解析器與 worker
        if (pdf) await pdf.destroy();

        const container = pdfContainer.value;
        container.innerHTML = '';
        pageCanvases = [];
        
        try {

            const arrayBuffer = await props.pdfFile.arrayBuffer();

            const loadingTask = pdfjsLib.getDocument({
                data: arrayBuffer,
                verbosity: pdfjsLib.VerbosityLevel.ERRORS
            })

            loadingTask.onProgress = (progressData) => {
                const { loaded, total } = progressData;
                const percent = Math.min(Math.round((loaded / total) * 100), 100);
            };

            pdf = await loadingTask.promise;

            // 進行結構渲染 --> 利用 div 先替代 canvas 避免內存爆滿。
            await buildPageWrappers();

            // 提前渲染
            for (let i = 1; i <= props.preloadCount; i++) {
                const next = pageCanvases.find(p => p.pageNum === i);
                if (next && !next.canvasWrapper.dataset.rendered) {
                    await safeRenderPage(next.pageNum, next.canvasWrapper);
                }
            }

            initObserver();
        } 
        catch (err) {}
    }

    // 建立頁面輪廓
    async function buildPageWrappers() {

        const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

        let batchSize;
        if (isMobile) batchSize = 4;  // 穩定優先
        else batchSize = navigator.hardwareConcurrency > 8 ? 10 : 8;

        const container = pdfContainer.value;
        const total = pdf.numPages;

        for (let i = 1; i <= total; i += batchSize) {

            const batch = [];

            for (let j = i; j < i + batchSize && j <= total; j++) {
                batch.push(pdf.getPage(j));
            }

            const pages = await Promise.all(batch);

            // 依照個別頁面的比例建置對應的容器
            pages.forEach((page, index) => {
                const pageNum = i + index;

                const viewport = page.getViewport({ scale: 1 });
                const ratio = viewport.height / viewport.width;

                const canvasWrapper = document.createElement('div');
                canvasWrapper.dataset.pageNum = pageNum;
                canvasWrapper.style.display = 'block';
                canvasWrapper.style.marginTop = '5px';
                canvasWrapper.style.marginBottom = '5px';
                canvasWrapper.style.width = '100%';
                canvasWrapper.style.aspectRatio = `1 / ${ratio}`;

                container.appendChild(canvasWrapper);

                pageCanvases.push(
                    {
                        pageNum,
                        canvasWrapper,
                        renderTask: null
                    }
                );

                page.cleanup();
            });

            // 小延遲等下一個 event loop tick 再繼續 --> 讓瀏覽器有機會 repaint
            await new Promise(r => setTimeout(r, 0));
        }
    }

    // 初始化監視器

    function isElementVisible(element, container) {
        
        if(!element || !container) return true;

        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return (
            rect.bottom > containerRect.top &&
            rect.top < containerRect.bottom
        );
    }
    async function initObserver() {

        if (observer) observer.disconnect();

            observer = new IntersectionObserver(
                async (entries) => {
                    for (const entry of entries) {
                        
                        const pageNum = parseInt(entry.target.dataset.pageNum);
                        const pageObj = pageCanvases.find(p => p.pageNum === pageNum);
                        if (!pageObj || !pdf) return;

                        // 頁面進入視窗（且還沒渲染過）   
                        if (entry.isIntersecting) { 
                            await safeRenderPage(pageNum, entry.target);
                            
                            // 釋放資源
                            pageCanvases.forEach((p) => {
                                
                                const visible = isElementVisible(p.canvasWrapper, pdfContainer.value);

                                if (!visible && Math.abs(p.pageNum - pageNum) > (props.preloadCount + 1)) {
                                    releaseCanvasElement(p);
                                }
                            });

                            // 預載鄰近頁面
                            for (let i = 1; i <= props.preloadCount; i++) {
                                const next = pageCanvases.find(p => p.pageNum === pageNum + i);
                                if (next) await safeRenderPage(next.pageNum, next.canvasWrapper);
                                const previous = pageCanvases.find(p => p.pageNum === pageNum - i);
                                if (previous) await safeRenderPage(previous.pageNum, previous.canvasWrapper);
                            }
                        }
                    }
                },
            { root: pdfContainer.value, threshold: 0.1 }
        );

        pageCanvases.forEach(({ canvasWrapper }) => {
            observer.observe(canvasWrapper);
        });
    }


    // 進行頁面渲染
    async function safeRenderPage(pageNum, canvasWrapper) {

        const dpr = window.devicePixelRatio || 1;
        const qualityFactor = 1.75;

        const pageObj = pageCanvases.find(p => p.pageNum === pageNum);
        if (!pageObj || !pdf || canvasWrapper.dataset.rendered === 'true') return;

        let page = pageCache.get(pageNum);

        if (!page) {
            page = await pdf.getPage(pageNum);
            pageCache.set(pageNum, page);

            if (pageCache.size > 20) {
                const oldest = pageCache.keys().next().value;
                const oldPage = pageCache.get(oldest);

                if (!pageObj.renderTask && oldPage?.cleanup) {
                    oldPage.cleanup();
                }

                pageCache.delete(oldest);
            }
        }

        canvasWrapper.style.position = 'relative';

        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.marginTop = '5px';
        canvas.style.marginBottom = '5px';
        canvas.dataset.pageNum = pageNum;

        const containerWidth = pdfContainer.value.clientWidth;
        const viewport = page.getViewport({ scale: 1 });

        const renderViewport = page.getViewport({
            scale: (containerWidth / viewport.width) * qualityFactor
        });

        const textViewport = page.getViewport({
            scale: containerWidth / viewport.width
        });

        canvas.width = renderViewport.width * dpr;
        canvas.height = renderViewport.height * dpr;

        canvas.style.width = `${textViewport.width}px`;
        canvas.style.height = `${textViewport.height}px`;

        canvas.style.border = '0.5px solid rgba(0,0,0,.15)';
        canvas.style.boxSizing = 'border-box';

        let textLayer = null;

        if (props.contextLayer) {
            textLayer = document.createElement('div');
            textLayer.className = 'textLayer';
            textLayer.style.width = `${textViewport.width}px`;
            textLayer.style.height = `${textViewport.height}px`;
            textLayer.style.position = 'absolute';
            textLayer.style.top = '0';
            textLayer.style.left = '0';
        }

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false;

        pageObj.renderTask = page.render({
            canvasContext: ctx,
            viewport: renderViewport
        });

        try {

            await pageObj.renderTask.promise;

            if (props.contextLayer && textLayer) {
                const textContent = await page.getTextContent();

                pdfjsLib.renderTextLayer({
                    textContent,
                    container: textLayer,
                    viewport: textViewport
                });
            }

            canvasWrapper.innerHTML = '';

            canvasWrapper.appendChild(canvas);

            if (props.contextLayer && textLayer) {
            canvasWrapper.appendChild(textLayer);
            }

            canvasWrapper.dataset.rendered = true;
            pageObj.canvasWrapper = canvasWrapper;

        }
        catch (e) {
            console.log(e);
        }
        finally {
            pageObj.renderTask = null;
        }

    }

    // 調整視窗大小
    async function handleResize() {

        if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(async () => {
                const container = pdfContainer.value;
                if (!pdf || !container) return;

                for (const p of pageCanvases) {
                    if (p.canvasWrapper.dataset.rendered === 'true') {
                        releaseCanvasElement(p);
                        await safeRenderPage(p.pageNum, p.canvasWrapper);
                    }
                }
        }, 500);
    }

    // 釋放 canvas 佔用資源
    function releaseCanvasElement(pageObj) {
        const canvasWrapper = pageObj.canvasWrapper;
        if (!canvasWrapper.dataset.rendered || pageObj.renderTask) return;

        const canvas = canvasWrapper.querySelector('canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = 0;
            canvas.height = 0;
            pageObj.canvasWrapper.removeChild(canvas);
        }

        pageObj.canvasWrapper.dataset.rendered = false;
    }

    return{
        loadPdf, handleResize
    }
}