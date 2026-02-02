'use client';
import { useState } from 'react';
import { Download, FileText, Loader2, RefreshCw, Plus, Trash2, Eye } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import jsPDF from 'jspdf';

// ============================================================================
// TYPES
// ============================================================================

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  description?: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

// ============================================================================
// UTILITIES
// ============================================================================

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

// ============================================================================
// DOCUMENT GENERATORS
// ============================================================================

const generateWordDocument = async (data: CVData): Promise<Blob> => {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.personalInfo.fullName,
          bold: true,
          size: 32,
          color: '1a365d',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: data.personalInfo.title,
          size: 24,
          color: '2563eb',
        }),
      ],
    })
  );

  const contactInfo = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.website,
  ]
    .filter(Boolean)
    .join(' | ');

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: contactInfo,
          size: 20,
        }),
      ],
    })
  );

  if (data.summary) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 200 },
        children: [
          new TextRun({
            text: 'RESUMEN PROFESIONAL',
            bold: true,
            size: 28,
            color: '1a365d',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: data.summary,
            size: 22,
          }),
        ],
      })
    );
  }

  if (data.experience.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 200 },
        children: [
          new TextRun({
            text: 'EXPERIENCIA LABORAL',
            bold: true,
            size: 28,
            color: '1a365d',
          }),
        ],
      })
    );

    data.experience.forEach((exp, index) => {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: exp.title,
              bold: true,
              size: 24,
            }),
          ],
        })
      );

      const endDate = exp.current ? 'Presente' : formatDate(exp.endDate);
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: `${exp.company} | ${formatDate(exp.startDate)} - ${endDate}`,
              size: 22,
              italics: true,
              color: '64748b',
            }),
          ],
        })
      );

      if (exp.description) {
        children.push(
          new Paragraph({
            spacing: { after: index < data.experience.length - 1 ? 300 : 400 },
            children: [
              new TextRun({
                text: exp.description,
                size: 22,
              }),
            ],
          })
        );
      }
    });
  }

  if (data.education.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 200 },
        children: [
          new TextRun({
            text: 'EDUCACIÓN',
            bold: true,
            size: 28,
            color: '1a365d',
          }),
        ],
      })
    );

    data.education.forEach((edu, index) => {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: edu.degree,
              bold: true,
              size: 24,
            }),
          ],
        })
      );

      const years =
        edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.endYear || '';

      children.push(
        new Paragraph({
          spacing: { after: index < data.education.length - 1 ? 300 : 400 },
          children: [
            new TextRun({
              text: `${edu.institution}${years ? ' | ' + years : ''}`,
              size: 22,
              italics: true,
              color: '64748b',
            }),
          ],
        })
      );
    });
  }

  if (data.skills.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 200 },
        children: [
          new TextRun({
            text: 'HABILIDADES',
            bold: true,
            size: 28,
            color: '1a365d',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: data.skills.join(' • '),
            size: 22,
          }),
        ],
      })
    );
  }

  if (data.languages.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 200 },
        children: [
          new TextRun({
            text: 'IDIOMAS',
            bold: true,
            size: 28,
            color: '1a365d',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.languages.join(' • '),
            size: 22,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840,
            },
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};

const generatePDFDocument = (data: CVData): Blob => {
  const doc = new jsPDF();
  let y = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  const addText = (
    text: string,
    size: number,
    isBold: boolean = false,
    color: number[] = [0, 0, 0],
    align: 'left' | 'center' = 'left'
  ) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const x = align === 'center' ? pageWidth / 2 : margin;
      doc.text(line, x, y, { align: align });
      y += size * 0.5;
    });
  };

  const addLine = () => {
    doc.setDrawColor(37, 99, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  addText(data.personalInfo.fullName, 24, true, [26, 54, 93], 'center');
  y += 2;
  addText(data.personalInfo.title, 14, false, [37, 99, 235], 'center');
  y += 8;

  const contactInfo = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.website,
  ]
    .filter(Boolean)
    .join(' | ');

  addText(contactInfo, 10, false, [100, 116, 139], 'center');
  y += 10;

  if (data.summary) {
    addLine();
    addText('RESUMEN PROFESIONAL', 14, true, [26, 54, 93]);
    y += 4;
    addText(data.summary, 11);
    y += 8;
  }

  if (data.experience.length > 0) {
    addLine();
    addText('EXPERIENCIA LABORAL', 14, true, [26, 54, 93]);
    y += 4;

    data.experience.forEach((exp) => {
      addText(exp.title, 12, true);
      y += 1;
      const endDate = exp.current ? 'Presente' : formatDate(exp.endDate);
      addText(
        `${exp.company} | ${formatDate(exp.startDate)} - ${endDate}`,
        10,
        false,
        [100, 116, 139]
      );
      y += 2;
      if (exp.description) {
        addText(exp.description, 10);
      }
      y += 5;
    });
  }

  if (data.education.length > 0) {
    addLine();
    addText('EDUCACIÓN', 14, true, [26, 54, 93]);
    y += 4;

    data.education.forEach((edu) => {
      addText(edu.degree, 12, true);
      y += 1;
      const years =
        edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.endYear || '';
      addText(
        `${edu.institution}${years ? ' | ' + years : ''}`,
        10,
        false,
        [100, 116, 139]
      );
      y += 5;
    });
  }

  if (data.skills.length > 0) {
    addLine();
    addText('HABILIDADES', 14, true, [26, 54, 93]);
    y += 4;
    addText(data.skills.join(' • '), 10);
    y += 8;
  }

  if (data.languages.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    addLine();
    addText('IDIOMAS', 14, true, [26, 54, 93]);
    y += 4;
    addText(data.languages.join(' • '), 10);
  }

  return doc.output('blob');
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [
      {
        id: '1',
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false,
      },
    ],
    education: [
      {
        id: '1',
        degree: '',
        institution: '',
        startYear: '',
        endYear: '',
      },
    ],
    skills: [],
    languages: [],
  });

  const validateForm = () => {
    const { personalInfo, summary, skills } = cvData;

    if (!personalInfo.fullName || !personalInfo.title || !personalInfo.email || !personalInfo.phone) {
      alert('Por favor completa todos los campos obligatorios de información personal');
      return false;
    }

    if (!summary) {
      alert('Por favor completa el resumen profesional');
      return false;
    }

    if (skills.length === 0) {
      alert('Por favor agrega al menos una habilidad');
      return false;
    }

    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGenerating(false);
    setShowDownload(true);

    setTimeout(() => {
      document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const downloadWord = async () => {
    try {
      const blob = await generateWordDocument(cvData);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${cvData.personalInfo.fullName.replace(/\s+/g, '_')}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Hubo un error al generar el documento Word');
    }
  };

  const downloadPDF = async () => {
    try {
      const blob = generatePDFDocument(cvData);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${cvData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF');
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el formulario?')) {
      setCvData({
        personalInfo: {
          fullName: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: '',
        },
        summary: '',
        experience: [
          {
            id: Date.now().toString(),
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            description: '',
            current: false,
          },
        ],
        education: [
          {
            id: Date.now().toString(),
            degree: '',
            institution: '',
            startYear: '',
            endYear: '',
          },
        ],
        skills: [],
        languages: [],
      });
      setShowDownload(false);
      setShowPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Generador de CV Profesional
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Crea tu currículum perfecto en minutos ✨
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORMULARIO */}
          <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">👤</span> Información Personal
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, fullName: e.target.value },
                      })
                    }
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    Título Profesional *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    value={cvData.personalInfo.title}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, title: e.target.value },
                      })
                    }
                    placeholder="Desarrollador Full Stack"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      value={cvData.personalInfo.email}
                      onChange={(e) =>
                        setCvData({
                          ...cvData,
                          personalInfo: { ...cvData.personalInfo, email: e.target.value },
                        })
                      }
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      value={cvData.personalInfo.phone}
                      onChange={(e) =>
                        setCvData({
                          ...cvData,
                          personalInfo: { ...cvData.personalInfo, phone: e.target.value },
                        })
                      }
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    value={cvData.personalInfo.location}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, location: e.target.value },
                      })
                    }
                    placeholder="Lima, Perú"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, linkedin: e.target.value },
                      })
                    }
                    placeholder="linkedin.com/in/tu-perfil"
                  />
                </div>
              </div>
            </div>

            {/* Resumen Profesional */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">📝</span> Resumen Profesional
              </h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Describe tu perfil *
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  rows={6}
                  value={cvData.summary}
                  onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                  placeholder="Desarrollador Full Stack con más de 5 años de experiencia..."
                />
              </div>
            </div>

            {/* Experiencia */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-3xl">💼</span> Experiencia Laboral
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setCvData({
                      ...cvData,
                      experience: [
                        ...cvData.experience,
                        {
                          id: Date.now().toString(),
                          title: '',
                          company: '',
                          startDate: '',
                          endDate: '',
                          description: '',
                          current: false,
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>

              <div className="space-y-4">
                {cvData.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-slate-700">Experiencia {index + 1}</h3>
                      {cvData.experience.length > 1 && (
                        <button
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              experience: cvData.experience.filter((e) => e.id !== exp.id),
                            })
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                        value={exp.title}
                        onChange={(e) => {
                          const newExp = cvData.experience.map((item) =>
                            item.id === exp.id ? { ...item, title: e.target.value } : item
                          );
                          setCvData({ ...cvData, experience: newExp });
                        }}
                        placeholder="Cargo"
                      />

                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = cvData.experience.map((item) =>
                            item.id === exp.id ? { ...item, company: e.target.value } : item
                          );
                          setCvData({ ...cvData, experience: newExp });
                        }}
                        placeholder="Empresa"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="month"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExp = cvData.experience.map((item) =>
                              item.id === exp.id ? { ...item, startDate: e.target.value } : item
                            );
                            setCvData({ ...cvData, experience: newExp });
                          }}
                        />

                        <input
                          type="month"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                          value={exp.endDate}
                          onChange={(e) => {
                            const newExp = cvData.experience.map((item) =>
                              item.id === exp.id ? { ...item, endDate: e.target.value } : item
                            );
                            setCvData({ ...cvData, experience: newExp });
                          }}
                          disabled={exp.current}
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={exp.current || false}
                          onChange={(e) => {
                            const newExp = cvData.experience.map((item) =>
                              item.id === exp.id
                                ? {
                                    ...item,
                                    current: e.target.checked,
                                    endDate: e.target.checked ? '' : item.endDate,
                                  }
                                : item
                            );
                            setCvData({ ...cvData, experience: newExp });
                          }}
                          className="w-4 h-4"
                        />
                        Trabajo actual
                      </label>

                      <textarea
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                        rows={3}
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = cvData.experience.map((item) =>
                            item.id === exp.id ? { ...item, description: e.target.value } : item
                          );
                          setCvData({ ...cvData, experience: newExp });
                        }}
                        placeholder="Descripción de responsabilidades y logros..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Educación */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-3xl">🎓</span> Educación
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setCvData({
                      ...cvData,
                      education: [
                        ...cvData.education,
                        {
                          id: Date.now().toString(),
                          degree: '',
                          institution: '',
                          startYear: '',
                          endYear: '',
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>

              <div className="space-y-4">
                {cvData.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-slate-700">Educación {index + 1}</h3>
                      {cvData.education.length > 1 && (
                        <button
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              education: cvData.education.filter((e) => e.id !== edu.id),
                            })
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = cvData.education.map((item) =>
                            item.id === edu.id ? { ...item, degree: e.target.value } : item
                          );
                          setCvData({ ...cvData, education: newEdu });
                        }}
                        placeholder="Título"
                      />

                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdu = cvData.education.map((item) =>
                            item.id === edu.id ? { ...item, institution: e.target.value } : item
                          );
                          setCvData({ ...cvData, education: newEdu });
                        }}
                        placeholder="Institución"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                          value={edu.startYear}
                          onChange={(e) => {
                            const newEdu = cvData.education.map((item) =>
                              item.id === edu.id ? { ...item, startYear: e.target.value } : item
                            );
                            setCvData({ ...cvData, education: newEdu });
                          }}
                          placeholder="Año inicio"
                        />

                        <input
                          type="number"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                          value={edu.endYear}
                          onChange={(e) => {
                            const newEdu = cvData.education.map((item) =>
                              item.id === edu.id ? { ...item, endYear: e.target.value } : item
                            );
                            setCvData({ ...cvData, education: newEdu });
                          }}
                          placeholder="Año fin"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Habilidades */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">🚀</span> Habilidades e Idiomas
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    Habilidades Técnicas *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    rows={4}
                    value={cvData.skills.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s);
                      setCvData({ ...cvData, skills });
                    }}
                    placeholder="JavaScript, React, Node.js, Python, SQL..."
                  />
                  <p className="text-sm text-slate-500 mt-2">Separa cada habilidad con una coma</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    Idiomas
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    rows={3}
                    value={cvData.languages.join(', ')}
                    onChange={(e) => {
                      const languages = e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s);
                      setCvData({ ...cvData, languages });
                    }}
                    placeholder="Español (Nativo), Inglés (Avanzado)..."
                  />
                  <p className="text-sm text-slate-500 mt-2">Separa cada idioma con una coma</p>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-semibold"
              >
                <RefreshCw size={20} />
                Limpiar
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-lg"
              >
                <Eye size={20} />
                {showPreview ? 'Ocultar' : 'Vista Previa'}
              </button>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    Generar CV
                  </>
                )}
              </button>
            </div>
          </div>

          {/* VISTA PREVIA */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {showPreview && (
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-8 animate-slide-up">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Eye size={24} className="text-purple-600" />
                  Vista Previa
                </h2>

                <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
                  {/* Header */}
                  <div className="text-center border-b-2 border-blue-600 pb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {cvData.personalInfo.fullName || 'Tu Nombre'}
                    </h1>
                    <p className="text-xl text-blue-600 font-semibold mb-3">
                      {cvData.personalInfo.title || 'Tu Título Profesional'}
                    </p>
                    <div className="text-sm text-slate-600 space-y-1">
                      {cvData.personalInfo.email && <p>📧 {cvData.personalInfo.email}</p>}
                      {cvData.personalInfo.phone && <p>📱 {cvData.personalInfo.phone}</p>}
                      {cvData.personalInfo.location && <p>📍 {cvData.personalInfo.location}</p>}
                      {cvData.personalInfo.linkedin && <p>🔗 {cvData.personalInfo.linkedin}</p>}
                    </div>
                  </div>

                  {/* Resumen */}
                  {cvData.summary && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 uppercase border-b border-slate-300 pb-1">
                        Resumen Profesional
                      </h3>
                      <p className="text-slate-700 text-sm leading-relaxed">{cvData.summary}</p>
                    </div>
                  )}

                  {/* Experiencia */}
                  {cvData.experience.some((exp) => exp.title || exp.company) && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase border-b border-slate-300 pb-1">
                        Experiencia Laboral
                      </h3>
                      <div className="space-y-4">
                        {cvData.experience.map(
                          (exp) =>
                            (exp.title || exp.company) && (
                              <div key={exp.id}>
                                <h4 className="font-bold text-slate-900">{exp.title}</h4>
                                <p className="text-sm text-slate-600 italic mb-1">
                                  {exp.company} | {formatDate(exp.startDate)} -{' '}
                                  {exp.current ? 'Presente' : formatDate(exp.endDate)}
                                </p>
                                {exp.description && (
                                  <p className="text-sm text-slate-700">{exp.description}</p>
                                )}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Educación */}
                  {cvData.education.some((edu) => edu.degree || edu.institution) && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase border-b border-slate-300 pb-1">
                        Educación
                      </h3>
                      <div className="space-y-3">
                        {cvData.education.map(
                          (edu) =>
                            (edu.degree || edu.institution) && (
                              <div key={edu.id}>
                                <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                                <p className="text-sm text-slate-600 italic">
                                  {edu.institution}{' '}
                                  {edu.startYear &&
                                    edu.endYear &&
                                    `| ${edu.startYear} - ${edu.endYear}`}
                                </p>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Habilidades */}
                  {cvData.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 uppercase border-b border-slate-300 pb-1">
                        Habilidades
                      </h3>
                      <p className="text-sm text-slate-700">{cvData.skills.join(' • ')}</p>
                    </div>
                  )}

                  {/* Idiomas */}
                  {cvData.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 uppercase border-b border-slate-300 pb-1">
                        Idiomas
                      </h3>
                      <p className="text-sm text-slate-700">{cvData.languages.join(' • ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección de Descarga */}
            {showDownload && (
              <div
                id="download-section"
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-2xl border-2 border-green-200 p-8 mt-6 animate-slide-up"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold text-green-700 mb-3">¡Tu CV está listo!</h3>
                  <p className="text-slate-600 mb-6 text-lg">
                    Descarga tu currículum en el formato que prefieras
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={downloadWord}
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg"
                    >
                      <Download size={24} />
                      Descargar Word (.docx)
                    </button>

                    <button
                      onClick={downloadPDF}
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold text-lg shadow-lg"
                    >
                      <Download size={24} />
                      Descargar PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con Copyright */}
        <footer className="mt-16 pb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full shadow-lg">
              <span className="text-sm font-semibold">© {new Date().getFullYear()}</span>
              <span className="text-slate-400">•</span>
              <span className="text-sm">Desarrollado por</span>
              <span className="text-blue-400 font-bold">Gerard Vigo</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}