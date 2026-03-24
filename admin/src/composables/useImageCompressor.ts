/**
 * useImageCompressor
 *
 * Comprime imágenes en el browser antes de subirlas al servidor,
 * similar al comportamiento de WhatsApp.
 *
 * - PDFs pasan sin modificación.
 * - Imágenes (jpg, jpeg, png, webp, heic, gif) se escalan a max 1920px
 *   y se exportan como JPEG con calidad ajustable.
 * - Si tras comprimir el arquivo sigue siendo mayor a maxSizeKB,
 *   reduce la calidad iterativamente (hasta 3 intentos).
 */

const MAX_DIMENSION = 1920  // px máximo en ancho o alto
const DEFAULT_MAX_KB = 400  // KB objetivo

/**
 * Dibuja la imagen en un canvas escalado y devuelve un Blob JPEG.
 */
async function drawToCanvas(img: HTMLImageElement, quality: number): Promise<Blob> {
  const canvas = document.createElement('canvas')

  let { width, height } = img

  // Escalar proporcionalmente si supera MAX_DIMENSION
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
    width  = Math.round(width  * ratio)
    height = Math.round(height * ratio)
  }

  canvas.width  = width
  canvas.height = height

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob falló'))
      },
      'image/jpeg',
      quality
    )
  })
}

/**
 * Carga un File como HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Error al cargar imagen')) }
    img.src = url
  })
}

/**
 * Comprime un archivo de imagen.
 * @param file        Archivo original seleccionado por el usuario
 * @param maxSizeKB   Tamaño objetivo en KB (default 400 KB)
 * @param quality     Calidad JPEG inicial 0–1 (default 0.75)
 * @returns           Nuevo File comprimido, o el File original si es PDF
 */
export async function compressImage(
  file: File,
  maxSizeKB = DEFAULT_MAX_KB,
  quality    = 0.75
): Promise<File> {
  // PDFs: devolver sin cambios
  if (file.type === 'application/pdf') return file

  // Cargar imagen
  const img = await loadImage(file)

  let blob: Blob
  let currentQuality = quality
  let attempts = 0
  const maxAttempts = 4

  do {
    blob = await drawToCanvas(img, currentQuality)
    if (blob.size / 1024 <= maxSizeKB) break
    currentQuality = Math.max(0.3, currentQuality - 0.15)
    attempts++
  } while (attempts < maxAttempts)

  // Construir nuevo nombre (reemplaza extensión por .jpg)
  const baseName = file.name.replace(/\.[^.]+$/, '')
  const newName  = `${baseName}.jpg`

  return new File([blob], newName, { type: 'image/jpeg' })
}

export function useImageCompressor() {
  return { compressImage }
}
