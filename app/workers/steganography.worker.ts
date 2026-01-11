import CryptoJS from 'crypto-js'

const END_MARKER = '\0\0\0'
const FILE_HEADER = 'STEG_FILE:'
const TEXT_HEADER = 'STEG_TEXT:'
const NO_KEY_HEADER = 'STEG_NOKEY:'

interface WorkerMessage {
    imageData: ImageData
    contentType?: 'text' | 'file'
    message?: string
    fileData?: ArrayBuffer
    fileName?: string
    secretKey?: string
    mode: 'encode' | 'decode'
}

interface WorkerResponse {
    success: boolean
    imageData?: ImageData
    message?: string
    contentType?: 'text' | 'file'
    fileName?: string
    fileData?: Uint8Array
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

function uint8ArrayToBinary(data: Uint8Array): string {
    return Array.from(data)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join('')
}

function binaryToUint8Array(binary: string): Uint8Array {
    const bytes = binary.match(/.{8}/g)
    if (!bytes) return new Uint8Array(0)
    return new Uint8Array(bytes.map(byte => parseInt(byte, 2)))
}

function encryptData(data: string, secretKey: string): string {
    return CryptoJS.AES.encrypt(data, secretKey).toString()
}

function decryptData(encryptedData: string, secretKey: string): string | null {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey)
        const decrypted = bytes.toString(CryptoJS.enc.Utf8)
        if (!decrypted) return null
        return decrypted
    } catch {
        return null
    }
}

function encryptBinaryData(data: Uint8Array, secretKey: string): string {
    const wordArray = CryptoJS.lib.WordArray.create(data as unknown as number[])
    const encrypted = CryptoJS.AES.encrypt(wordArray, secretKey)
    return encrypted.toString()
}

function decryptBinaryData(encryptedData: string, secretKey: string): Uint8Array | null {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey)
        const words = decrypted.words
        const sigBytes = decrypted.sigBytes

        if (sigBytes <= 0) return null

        const bytes = new Uint8Array(sigBytes)
        for (let i = 0; i < sigBytes; i++) {
            bytes[i] = (words[i >>> 2]! >>> (24 - (i % 4) * 8)) & 0xff
        }
        return bytes
    } catch {
        return null
    }
}

function encodeText(imageData: ImageData, message: string, secretKey: string): ImageData {
    const key = secretKey.trim()
    let fullMessage: string

    if (key) {
        const encryptedMessage = encryptData(message, key)
        fullMessage = TEXT_HEADER + encryptedMessage + END_MARKER
    } else {
        const base64Message = btoa(unescape(encodeURIComponent(message)))
        fullMessage = NO_KEY_HEADER + base64Message + END_MARKER
    }

    const binaryMessage = textToBinary(fullMessage)

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

function encodeFile(imageData: ImageData, fileData: ArrayBuffer, fileName: string, secretKey: string): ImageData {
    const key = secretKey.trim()

    if (!key) {
        throw new Error('Password is required for file encryption')
    }

    const fileBytes = new Uint8Array(fileData)
    const encryptedFileData = encryptBinaryData(fileBytes, key)

    const fullMessage = FILE_HEADER + fileName + ':' + encryptedFileData + END_MARKER
    const binaryMessage = textToBinary(fullMessage)

    const pixels = imageData.data
    const maxBits = Math.floor((pixels.length / 4) * 3)

    if (binaryMessage.length > maxBits) {
        throw new Error('File is too large for this image')
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

function decode(imageData: ImageData, secretKey: string): { type: 'text' | 'file'; message?: string; fileName?: string; fileData?: Uint8Array } {
    const key = secretKey.trim()
    const pixels = imageData.data

    const totalBits = Math.floor((pixels.length / 4) * 3)
    const binaryArray: number[] = []

    for (let i = 0; i < pixels.length; i += 4) {
        for (let channel = 0; channel < 3; channel++) {
            binaryArray.push(pixels[i + channel]! & 1)
        }
    }

    const END_MARKER_BYTES = [0, 0, 0]
    const bytes: number[] = []
    let foundEnd = false
    let endIndex = -1

    for (let i = 0; i + 7 < binaryArray.length; i += 8) {
        let byte = 0
        for (let j = 0; j < 8; j++) {
            byte = (byte << 1) | binaryArray[i + j]!
        }
        bytes.push(byte)

        const len = bytes.length
        if (len >= 3 &&
            bytes[len - 1] === 0 &&
            bytes[len - 2] === 0 &&
            bytes[len - 3] === 0) {
            foundEnd = true
            endIndex = len - 3
            break
        }
    }

    if (!foundEnd || endIndex === -1) {
        throw new Error('No hidden message found in this image')
    }

    const content = bytes.slice(0, endIndex)
        .map(b => String.fromCharCode(b))
        .join('')

    if (content.startsWith(NO_KEY_HEADER)) {
        const base64Message = content.substring(NO_KEY_HEADER.length)
        try {
            const message = decodeURIComponent(escape(atob(base64Message)))
            return { type: 'text', message }
        } catch {
            throw new Error('Corrupted message')
        }
    } else if (content.startsWith(FILE_HEADER)) {
        if (!key) {
            throw new Error('This content requires a password to decrypt')
        }

        const fileContent = content.substring(FILE_HEADER.length)
        const colonIndex = fileContent.indexOf(':')
        if (colonIndex === -1) {
            throw new Error('Invalid file format')
        }
        const fileName = fileContent.substring(0, colonIndex)
        const encryptedData = fileContent.substring(colonIndex + 1)

        const fileData = decryptBinaryData(encryptedData, key)
        if (!fileData) {
            throw new Error('Invalid password or corrupted file')
        }

        return { type: 'file', fileName, fileData }
    } else if (content.startsWith(TEXT_HEADER)) {
        if (!key) {
            throw new Error('This content requires a password to decrypt')
        }

        const encryptedMessage = content.substring(TEXT_HEADER.length)
        const decrypted = decryptData(encryptedMessage, key)

        if (!decrypted) {
            throw new Error('Invalid password or corrupted message')
        }

        return { type: 'text', message: decrypted }
    } else {
        const decrypted = decryptData(content, key)

        if (!decrypted) {
            throw new Error('Invalid secret key or corrupted message')
        }

        return { type: 'text', message: decrypted }
    }
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { imageData, contentType, message, fileData, fileName, secretKey, mode } = event.data

    try {
        if (mode === 'encode') {
            if (contentType === 'file') {
                if (!fileData || !fileName) {
                    throw new Error('File data and name are required for file encoding')
                }
                const result = encodeFile(imageData, fileData, fileName, secretKey || '')
                const response: WorkerResponse = { success: true, imageData: result }
                self.postMessage(response)
            } else {
                if (!message) {
                    throw new Error('Message is required for text encoding')
                }
                const result = encodeText(imageData, message, secretKey || '')
                const response: WorkerResponse = { success: true, imageData: result }
                self.postMessage(response)
            }
        } else {
            const result = decode(imageData, secretKey || '')
            if (result.type === 'file') {
                const response: WorkerResponse = {
                    success: true,
                    contentType: 'file',
                    fileName: result.fileName,
                    fileData: result.fileData
                }
                self.postMessage(response)
            } else {
                const response: WorkerResponse = {
                    success: true,
                    contentType: 'text',
                    message: result.message
                }
                self.postMessage(response)
            }
        }
    } catch (error) {
        const response: WorkerResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
        self.postMessage(response)
    }
}
