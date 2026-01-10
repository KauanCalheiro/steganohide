import StegaWorker from '~/workers/steganography.worker?worker'

interface SteganographyResult {
    imageUrl: string
}

interface DecodeResult {
    message: string
}

export const useSteganography = () => {
    const isProcessing = ref(false)
    const error = ref<string | null>(null)

    let worker: Worker | null = null

    const getWorker = (): Worker => {
        if (!worker) {
            worker = new StegaWorker()
        }
        return worker
    }

    const loadImageData = (file: File): Promise<{ imageData: ImageData; canvas: HTMLCanvasElement }> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                reject(new Error('Failed to get canvas context'))
                return
            }

            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                URL.revokeObjectURL(img.src)
                resolve({ imageData, canvas })
            }

            img.onerror = () => {
                URL.revokeObjectURL(img.src)
                reject(new Error('Failed to load image'))
            }

            img.src = URL.createObjectURL(file)
        })
    }

    const encode = async (
        file: File,
        message: string,
        secretKey?: string
    ): Promise<SteganographyResult> => {
        isProcessing.value = true
        error.value = null

        try {
            const { imageData, canvas } = await loadImageData(file)
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                throw new Error('Failed to get canvas context')
            }

            const workerInstance = getWorker()

            return new Promise((resolve, reject) => {
                workerInstance.onmessage = (event) => {
                    const response = event.data

                    if (response.success && response.imageData) {
                        ctx.putImageData(response.imageData, 0, 0)
                        const imageUrl = canvas.toDataURL('image/png')
                        resolve({ imageUrl })
                    } else {
                        reject(new Error(response.error || 'Encoding failed'))
                    }

                    isProcessing.value = false
                }

                workerInstance.onerror = (err) => {
                    isProcessing.value = false
                    reject(new Error(err.message))
                }

                workerInstance.postMessage({
                    imageData,
                    message,
                    secretKey,
                    mode: 'encode'
                })
            })
        } catch (err) {
            isProcessing.value = false
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        }
    }

    const decode = async (
        file: File,
        secretKey?: string
    ): Promise<DecodeResult> => {
        isProcessing.value = true
        error.value = null

        try {
            const { imageData } = await loadImageData(file)
            const workerInstance = getWorker()

            return new Promise((resolve, reject) => {
                workerInstance.onmessage = (event) => {
                    const response = event.data

                    if (response.success && response.message) {
                        resolve({ message: response.message })
                    } else {
                        reject(new Error(response.error || 'Decoding failed'))
                    }

                    isProcessing.value = false
                }

                workerInstance.onerror = (err) => {
                    isProcessing.value = false
                    reject(new Error(err.message))
                }

                workerInstance.postMessage({
                    imageData,
                    secretKey,
                    mode: 'decode'
                })
            })
        } catch (err) {
            isProcessing.value = false
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        }
    }

    const terminateWorker = () => {
        if (worker) {
            worker.terminate()
            worker = null
        }
    }

    onUnmounted(() => {
        terminateWorker()
    })

    return {
        loading: readonly(isProcessing),
        error: readonly(error),
        encode,
        decode,
        terminateWorker
    }
}
