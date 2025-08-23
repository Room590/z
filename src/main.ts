import './style.css'
import { PDFConverter } from './converter'

class App {
  private converter: PDFConverter
  private dropZone: HTMLElement
  private fileInput: HTMLInputElement
  private convertBtn: HTMLButtonElement
  private settingsSection: HTMLElement
  private previewSection: HTMLElement
  private resultsSection: HTMLElement
  private loadingOverlay: HTMLElement
  private pageRangeSelect: HTMLSelectElement
  private customRangeInput: HTMLElement

  constructor() {
    this.converter = new PDFConverter()
    this.initializeElements()
    this.setupEventListeners()
  }

  private initializeElements(): void {
    this.dropZone = document.getElementById('dropZone')!
    this.fileInput = document.getElementById('fileInput') as HTMLInputElement
    this.convertBtn = document.getElementById('convertBtn') as HTMLButtonElement
    this.settingsSection = document.getElementById('settingsSection')!
    this.previewSection = document.getElementById('previewSection')!
    this.resultsSection = document.getElementById('resultsSection')!
    this.loadingOverlay = document.getElementById('loadingOverlay')!
    this.pageRangeSelect = document.getElementById('pageRange') as HTMLSelectElement
    this.customRangeInput = document.getElementById('customRangeInput')!
  }

  private setupEventListeners(): void {
    // File input events
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e))
    
    // Drop zone events
    this.dropZone.addEventListener('click', () => this.fileInput.click())
    this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e))
    this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e))
    this.dropZone.addEventListener('drop', (e) => this.handleDrop(e))

    // Browse button
    const browseBtn = document.querySelector('.browse-btn') as HTMLButtonElement
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.fileInput.click()
    })

    // Convert button
    this.convertBtn.addEventListener('click', () => this.handleConvert())

    // Page range selection
    this.pageRangeSelect.addEventListener('change', () => {
      const customRangeInput = document.getElementById('customRangeInput')!
      if (this.pageRangeSelect.value === 'custom') {
        customRangeInput.style.display = 'block'
      } else {
        customRangeInput.style.display = 'none'
      }
    })

    // Download all button
    const downloadAllBtn = document.getElementById('downloadAllBtn')!
    downloadAllBtn.addEventListener('click', () => this.downloadAllImages())
  }

  private handleDragOver(e: DragEvent): void {
    e.preventDefault()
    this.dropZone.classList.add('drag-over')
  }

  private handleDragLeave(e: DragEvent): void {
    e.preventDefault()
    this.dropZone.classList.remove('drag-over')
  }

  private handleDrop(e: DragEvent): void {
    e.preventDefault()
    this.dropZone.classList.remove('drag-over')
    
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      this.processPDFFile(files[0])
    }
  }

  private handleFileSelect(e: Event): void {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files && files.length > 0) {
      this.processPDFFile(files[0])
    }
  }

  private async processPDFFile(file: File): Promise<void> {
    if (file.type !== 'application/pdf') {
      this.showError('Please select a valid PDF file.')
      return
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      this.showError('File size must be less than 50MB.')
      return
    }

    try {
      this.showLoading('Loading PDF...')
      
      const pdfData = await this.converter.loadPDF(file)
      const pageCount = await this.converter.getPageCount()
      
      this.hideLoading()
      this.showPDFInfo(file.name, pageCount)
      this.showSettings()
      this.showPreview()
      this.convertBtn.disabled = false
      
    } catch (error) {
      this.hideLoading()
      this.showError('Failed to load PDF file. Please try again.')
      console.error('PDF loading error:', error)
    }
  }

  private showPDFInfo(fileName: string, pageCount: number): void {
    const pdfInfo = document.getElementById('pdfInfo')!
    pdfInfo.textContent = `${fileName} • ${pageCount} page${pageCount > 1 ? 's' : ''}`
  }

  private showSettings(): void {
    this.settingsSection.style.display = 'block'
  }

  private showPreview(): void {
    this.previewSection.style.display = 'block'
    // You could add PDF preview functionality here
    const previewDiv = document.getElementById('pdfPreview')!
    previewDiv.innerHTML = '<p class="preview-placeholder">PDF loaded successfully. Ready for conversion.</p>'
  }

  private async handleConvert(): Promise<void> {
    try {
      this.showLoading('Converting PDF to images...')
      
      const format = (document.getElementById('imageFormat') as HTMLSelectElement).value as 'png' | 'jpeg'
      const quality = parseInt((document.getElementById('imageQuality') as HTMLSelectElement).value)
      const pageRange = this.pageRangeSelect.value
      const customRange = (document.getElementById('customRange') as HTMLInputElement).value

      let pagesToConvert: number[] = []
      const totalPages = await this.converter.getPageCount()

      if (pageRange === 'all') {
        pagesToConvert = Array.from({ length: totalPages }, (_, i) => i + 1)
      } else if (pageRange === 'first') {
        pagesToConvert = [1]
      } else if (pageRange === 'custom' && customRange) {
        pagesToConvert = this.parsePageRange(customRange, totalPages)
      }

      if (pagesToConvert.length === 0) {
        this.showError('Please specify valid pages to convert.')
        this.hideLoading()
        return
      }

      const images = await this.converter.convertToImages(pagesToConvert, format, quality, (progress) => {
        this.updateProgress(progress)
      })

      this.hideLoading()
      this.showResults(images, format)
      
    } catch (error) {
      this.hideLoading()
      this.showError('Failed to convert PDF. Please try again.')
      console.error('Conversion error:', error)
    }
  }

  private parsePageRange(range: string, totalPages: number): number[] {
    const pages: number[] = []
    const parts = range.split(',').map(part => part.trim())
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(num => parseInt(num.trim()))
        if (start && end && start <= end && start >= 1 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            pages.push(i)
          }
        }
      } else {
        const pageNum = parseInt(part)
        if (pageNum >= 1 && pageNum <= totalPages) {
          pages.push(pageNum)
        }
      }
    }
    
    return [...new Set(pages)].sort((a, b) => a - b)
  }

  private showResults(images: { pageNumber: number; dataUrl: string }[], format: string): void {
    const resultsDiv = document.getElementById('imageResults')!
    resultsDiv.innerHTML = ''

    images.forEach((image, index) => {
      const imageCard = document.createElement('div')
      imageCard.className = 'image-card'
      
      imageCard.innerHTML = `
        <div class="image-preview">
          <img src="${image.dataUrl}" alt="Page ${image.pageNumber}">
        </div>
        <div class="image-info">
          <span class="image-title">Page ${image.pageNumber}</span>
          <button class="download-btn" data-index="${index}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Download
          </button>
        </div>
      `
      
      const downloadBtn = imageCard.querySelector('.download-btn') as HTMLButtonElement
      downloadBtn.addEventListener('click', () => {
        this.downloadImage(image.dataUrl, `page-${image.pageNumber}.${format}`)
      })
      
      resultsDiv.appendChild(imageCard)
    })

    this.resultsSection.style.display = 'block'
    
    // Store images for download all functionality
    ;(window as any).convertedImages = images
    ;(window as any).imageFormat = format
  }

  private downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  private downloadAllImages(): void {
    const images = (window as any).convertedImages
    const format = (window as any).imageFormat
    
    if (images && images.length > 0) {
      images.forEach((image: any) => {
        setTimeout(() => {
          this.downloadImage(image.dataUrl, `page-${image.pageNumber}.${format}`)
        }, 100 * image.pageNumber)
      })
    }
  }

  private showLoading(text: string): void {
    const loadingText = document.getElementById('loadingText')!
    loadingText.textContent = text
    this.loadingOverlay.style.display = 'flex'
  }

  private hideLoading(): void {
    this.loadingOverlay.style.display = 'none'
  }

  private updateProgress(progress: number): void {
    const progressFill = document.getElementById('progressFill')!
    progressFill.style.width = `${progress}%`
  }

  private showError(message: string): void {
    alert(message) // In a real app, you'd want a better error display
  }
}

// Initialize the app
new App()