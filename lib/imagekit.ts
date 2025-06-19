// ImageKit configuration
export const imagekitConfig = {
  publicKey: "public_08STeAxpZUI21y615rCBZ3p6Kqo=",
  privateKey: "private_HFnP8dGK9Ql9l0slR/IHrlGCDhI=",
  urlEndpoint: "https://ik.imagekit.io/ncocp99of",
  folder: "product"
}

// Generate authentication parameters for client-side upload
export async function getImageKitAuthParams() {
  try {
    const response = await fetch('/api/imagekit-auth', {
      method: 'GET',
    })
    
    if (!response.ok) {
      throw new Error('Failed to get auth params')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error getting ImageKit auth params:', error)
    throw error
  }
}

// Upload image to ImageKit
export async function uploadToImageKit(file: File, fileName?: string): Promise<any> {
  try {
    // Get authentication parameters
    const authParams = await getImageKitAuthParams()
    
    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName || file.name)
    formData.append('folder', imagekitConfig.folder)
    formData.append('publicKey', imagekitConfig.publicKey)
    formData.append('signature', authParams.signature)
    formData.append('expire', authParams.expire.toString())
    formData.append('token', authParams.token)
    
    // Upload to ImageKit
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error uploading to ImageKit:', error)
    throw error
  }
}

// Generate ImageKit URL with transformations
export function getImageKitUrl(filePath: string, transformations?: string): string {
  const baseUrl = imagekitConfig.urlEndpoint
  const transformationString = transformations ? `tr:${transformations}/` : ''
  return `${baseUrl}/${transformationString}${filePath}`
}

// Common image transformations
export const imageTransformations = {
  thumbnail: 'w-300,h-300,c-maintain_ratio',
  medium: 'w-600,h-600,c-maintain_ratio',
  large: 'w-1200,h-1200,c-maintain_ratio',
  productCard: 'w-400,h-300,c-maintain_ratio',
  productDetail: 'w-800,h-600,c-maintain_ratio',
}
