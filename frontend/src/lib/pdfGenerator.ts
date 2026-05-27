import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generateAndDownloadPDF(
  resumeData: any,
  templateId: string,
  fileName: string
) {
  const element = document.getElementById('resume-download-preview')
  if (!element) {
    alert('Resume preview not found!')
    return
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    } as any)

    const imgData = canvas.toDataURL('image/png', 1.0)
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = imgWidth / imgHeight
    
    let finalWidth = pdfWidth
    let finalHeight = pdfWidth / ratio
    
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight
      finalWidth = pdfHeight * ratio
    }

    const xOffset = (pdfWidth - finalWidth) / 2
    const yOffset = 0

    pdf.addImage(
      imgData, 
      'PNG', 
      xOffset, 
      yOffset, 
      finalWidth, 
      finalHeight,
      undefined,
      'FAST'
    )

    pdf.save(`${fileName}.pdf`)
    return true
  } catch (error) {
    console.error('PDF generation failed:', error)
    alert('PDF generation failed. Please try again.')
    return false
  }
}
