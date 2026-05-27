import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType
} from 'docx'
import { saveAs } from 'file-saver'

export async function generateAndDownloadDOCX(
  resumeData: any,
  fileName: string
) {
  const data = resumeData || {}
  const info = data.personalInfo || {}
  const experience = data.experience || []
  const education = data.education || []
  const skills = data.skills || []
  const projects = data.projects || []
  const certifications = data.certifications || []
  const languages = data.languages || []

  const children: any[] = []

  // NAME
  if (info.fullName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: info.fullName.toUpperCase(),
            bold: true,
            size: 36,
            font: 'Calibri'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    )
  }

  // TITLE
  if (info.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: info.title,
            size: 24,
            color: '555555',
            font: 'Calibri'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    )
  }

  // CONTACT INFO
  const contactParts = []
  if (info.email) contactParts.push(info.email)
  if (info.phone) contactParts.push(info.phone)
  if (info.location) contactParts.push(info.location)
  if (info.linkedin) contactParts.push(info.linkedin)

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(' | '),
            size: 18,
            color: '666666',
            font: 'Calibri'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    )
  }

  // Divider line function
  const addDivider = () => {
    children.push(
      new Paragraph({
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        spacing: { after: 100 }
      })
    )
  }

  // Section heading function
  const addSectionHeading = (text: string) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: text.toUpperCase(),
            bold: true,
            size: 22,
            font: 'Calibri',
            color: '1a1a2e'
          })
        ],
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '1a1a2e',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 4
          }
        }
      })
    )
  }

  // SUMMARY
  if (data.summary && data.summary.trim().length > 0) {
    addSectionHeading('Professional Summary')
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.summary,
            size: 20,
            font: 'Calibri'
          })
        ],
        spacing: { after: 100 }
      })
    )
  }

  // EXPERIENCE
  const validExp = experience.filter((e: any) => e.jobTitle || e.company)
  if (validExp.length > 0) {
    addSectionHeading('Experience')
    validExp.forEach((exp: any) => {
      // Job title and company
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.jobTitle || '',
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            new TextRun({
              text: exp.company ? ` | ${exp.company}` : '',
              size: 22,
              font: 'Calibri',
              color: '333333'
            })
          ],
          spacing: { before: 150, after: 50 }
        })
      )
      // Date and location
      const dateLine = [
        exp.startDate,
        exp.endDate || (exp.current ? 'Present' : ''),
        exp.location
      ].filter(Boolean).join(' | ')

      if (dateLine) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: dateLine,
                size: 18,
                color: '666666',
                italics: true,
                font: 'Calibri'
              })
            ],
            spacing: { after: 50 }
          })
        )
      }
      // Description
      if (exp.description) {
        exp.description.split('\n').forEach((line: string) => {
          if (line.trim()) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${line.trim()}`,
                    size: 20,
                    font: 'Calibri'
                  })
                ],
                spacing: { after: 40 }
              })
            )
          }
        })
      }
    })
  }

  // EDUCATION
  const validEdu = education.filter((e: any) => e.degree || e.institution)
  if (validEdu.length > 0) {
    addSectionHeading('Education')
    validEdu.forEach((edu: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree || '',
              bold: true,
              size: 22,
              font: 'Calibri'
            })
          ],
          spacing: { before: 100, after: 40 }
        })
      )
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [edu.institution, edu.year, edu.grade].filter(Boolean).join(' | '),
              size: 20,
              color: '555555',
              font: 'Calibri'
            })
          ],
          spacing: { after: 80 }
        })
      )
    })
  }

  // SKILLS
  if (skills.length > 0) {
    addSectionHeading('Skills')
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: skills.join(' • '),
            size: 20,
            font: 'Calibri'
          })
        ],
        spacing: { after: 100 }
      })
    )
  }

  // PROJECTS
  const validProjects = projects.filter((p: any) => p.projectName?.trim())
  if (validProjects.length > 0) {
    addSectionHeading('Projects')
    validProjects.forEach((proj: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.projectName,
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            new TextRun({
              text: proj.techStack ? ` | ${proj.techStack}` : '',
              size: 20,
              color: '555555',
              font: 'Calibri'
            })
          ],
          spacing: { before: 100, after: 40 }
        })
      )
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${proj.description}`,
                size: 20,
                font: 'Calibri'
              })
            ],
            spacing: { after: 60 }
          })
        )
      }
      if (proj.projectUrl) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.projectUrl,
                size: 18,
                color: '2563EB',
                font: 'Calibri'
              })
            ],
            spacing: { after: 60 }
          })
        )
      }
    })
  }

  // CERTIFICATIONS
  const validCerts = certifications.filter((c: any) => c.certName?.trim())
  if (validCerts.length > 0) {
    addSectionHeading('Certifications')
    validCerts.forEach((cert: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.certName,
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            new TextRun({
              text: [cert.issuingOrg, cert.issueDate].filter(Boolean).join(' | '),
              size: 20,
              color: '555555',
              font: 'Calibri'
            })
          ],
          spacing: { before: 80, after: 60 }
        })
      )
    })
  }

  // LANGUAGES
  const validLangs = languages.filter((l: any) => l.language?.trim())
  if (validLangs.length > 0) {
    addSectionHeading('Languages')
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: validLangs.map((l: any) => `${l.language} (${l.proficiency})`).join(' • '),
            size: 20,
            font: 'Calibri'
          })
        ],
        spacing: { after: 100 }
      })
    )
  }

  // Create document
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720
          }
        }
      },
      children: children
    }]
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${fileName}.docx`)
  return true
}
