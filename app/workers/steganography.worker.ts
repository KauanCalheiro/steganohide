import CryptoJS from 'crypto-js'

const DEFAULT_SECRET_KEY = 'steganohide-default-key-2026'
const END_MARKER = '\0\0\0'

interface WorkerMessage {
    imageData: ImageData
    message?: string
    secretKey?: string
    mode: 'encode' | 'decode'
}

interface WorkerResponse {
    success: boolean
    imageData?: ImageData
    message?: string
    error?: string
}

function textToBinary(text: string): string {
    return text
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('')
}

function binaryToText(binary: string): string {
    const bytes = binary.match(/.{8}/g)
    if (!bytes) return ''
    return bytes
        .map(byte => String.fromCharCode(parseInt(byte, 2)))
        .join('')
}

function encryptMessage(message: string, secretKey: string): string {
    return CryptoJS.AES.encrypt(message, secretKey).toString()
}

function decryptMessage(encryptedMessage: string, secretKey: string): string | null {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey)
        const decrypted = bytes.toString(CryptoJS.enc.Utf8)
        if (!decrypted) return null
        return decrypted
    } catch {
        return null
    }
}

function encode(imageData: ImageData, message: string, secretKey: string): ImageData {
    const key = secretKey || DEFAULT_SECRET_KEY
    const encryptedMessage = encryptMessage(message, key)
    const binaryMessage = textToBinary(encryptedMessage + END_MARKER)

    const pixels = imageData.data
    const maxBits = Math.floor((pixels.length / 4) * 3)

    if (binaryMessage.length > maxBits) {
        throw new Error('Message is too large for this image')
    }

    let bitIndex = 0
    for (let i = 0; i < pixels.length && bitIndex < binaryMessage.length; i += 4) {
        for (let channel = 0; channel < 3 && bitIndex < binaryMessage.length; channel++) {
            const bit = parseInt(binaryMessage[bitIndex]!, 10)
            pixels[i + channel] = (pixels[i + channel]! & 0xFE) | bit
            bitIndex++
        }
    }

    return imageData
}

function decode(imageData: ImageData, secretKey: string): string {
    const key = secretKey || DEFAULT_SECRET_KEY
    const pixels = imageData.data
    let binaryMessage = ''
    let foundEnd = false

    for (let i = 0; i < pixels.length && !foundEnd; i += 4) {
        for (let channel = 0; channel < 3; channel++) {
            binaryMessage += (pixels[i + channel]! & 1).toString()

            if (binaryMessage.length % 8 === 0 && binaryMessage.length >= 24) {
                const text = binaryToText(binaryMessage)
                if (text.includes(END_MARKER)) {
                    foundEnd = true
                    break
                }
            }
        }
    }

    const text = binaryToText(binaryMessage)
    const endIndex = text.indexOf(END_MARKER)
    if (endIndex === -1) {
        throw new Error('No hidden message found in this image')
    }

    const encryptedMessage = text.substring(0, endIndex)
    const decrypted = decryptMessage(encryptedMessage, key)

    if (!decrypted) {
        throw new Error('Invalid secret key or corrupted message')
    }

    return decrypted
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { imageData, message, secretKey, mode } = event.data

    try {
        if (mode === 'encode') {
            if (!message) {
                throw new Error('Message is required for encoding')
            }
            const result = encode(imageData, message, secretKey || '')
            const response: WorkerResponse = { success: true, imageData: result }
            self.postMessage(response)
        } else {
            const result = decode(imageData, secretKey || '')
            const response: WorkerResponse = { success: true, message: result }
            self.postMessage(response)
        }
    } catch (error) {
        const response: WorkerResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
        self.postMessage(response)
    }
}
