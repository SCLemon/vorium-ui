<template>
    <div class="pdf-wrapper">
        <div ref="pdfContainer" class="pdf-container"></div>
    </div>
</template>
<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'
import { usePdfCleaner } from './hooks/usePdfCleaner';
import { usePdfRenderer } from './hooks/usePdfRenderer';

export default {
    name: 'VPdfViewer',

    props: {
        pdfFile: {
            type: File,
            default: null
        },
        preloadCount: {
            type: Number,
            default: 1
        },
        contextLayer: {
            type: Boolean,
            default: true
        }
    },

    setup(props, context) {

        const pdfContainer = ref(null)
        const pageCanvases = []
            let pageCache = new Map()
        let pdf = null
        let observer = null
        let resizeTimer = null

        function isWebGLAvailable() {
            try {
                const canvas = document.createElement('canvas')

                return !!(
                    window.WebGLRenderingContext &&
                    (
                        canvas.getContext('webgl') ||
                        canvas.getContext('experimental-webgl')
                    )
                )
            }
            catch {
                return false
            }
        }

        async function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        const cleanAll = usePdfCleaner(pdfContainer, pdf, pageCanvases, pageCache);

        const { loadPdf, handleResize } = usePdfRenderer(pdf, pdfContainer, pageCanvases, pageCache, observer, resizeTimer, props)



        watch(() => props.pdfFile,
            async () => {

                cleanAll()
                pageCache = new Map()
                await loadPdf()
            },{
                immediate: true
            }
        )

        onMounted(() => {
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

            pdfjsLib.disableStream = false
            pdfjsLib.enableWebGL = isWebGLAvailable()

            window.addEventListener('resize', handleResize)
        })

        onUnmounted(() => {

            window.removeEventListener('resize', handleResize)

            if (observer) {
                observer.disconnect()
            }

            cleanAll()
        })

        return {
            pdfContainer, loadPdf, cleanAll, handleResize
        }
    }
}
</script>
<style>
@import 'pdfjs-dist/legacy/web/pdf_viewer.css';

.pdf-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.pdf-container{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    z-index: 2;
    box-sizing: border-box;
}

@media screen and (max-width: 440px) {
    .pdf-container{
        padding-top: 62px;
        padding-bottom: 110px;
    }
}
</style>
