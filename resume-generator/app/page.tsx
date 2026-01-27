'use client';
import React, { useState } from 'react';
// use State :Guardar y Cambiar datos en un componente 
// texto
// botones
// formularios
// contadores
// colores
// datos que vienen del usuario
import { FileDown, FileText, Download, User, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Linkedin, Github, Plus, Trash2 } from 'lucide-react';

// Types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string;
}

interface Skill {
  id: string;
  category: string;
  items: string;
}

const ResumeGenerator: React.FC = () => {
  // State for form data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'Gerard Vigo Rodrigues',
    email: 'vigogerard2025@gmail.com',
    phone: '+51 973 474 568',
    location: 'Trujillo, Peru',
    linkedin: 'linkedin.com/in/gerard-vigo-5328b3268',
    github: 'github.com/gerardvigo',
    summary: 'Full-Stack Developer specialized in building scalable web applications using modern technologies.'
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Frontend Developer Intern',
      company: 'T-Money',
      location: 'Remote',
      startDate: '2023-01',
      endDate: '2023-12',
      current: false,
      description: 'Collaborated with 5 interns to launch a mobile application that attracted over 10,000 users within 2 months.'
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      degree: 'Bachelor of Science in Software Development',
      institution: 'Brigham Young University - Idaho',
      location: 'Rexburg, ID',
      graduationDate: '2026',
      gpa: '3.8'
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', category: 'Frontend', items: 'React, Next.js, TypeScript, Tailwind CSS' },
    { id: '2', category: 'Backend', items: 'Node.js, Python, REST APIs' },
    { id: '3', category: 'Databases', items: 'PostgreSQL, MySQL, MongoDB' }
  ]);

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Add new items
  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: ''
    }]);
  };

  const addSkill = () => {
    setSkills([...skills, {
      id: Date.now().toString(),
      category: '',
      items: ''
    }]);
  };

  // Remove items
  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  // Download functions
  const downloadPDF = () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${personalInfo.fullName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .resume { max-width: 800px; margin: 0 auto; }
            h1 { font-size: 32px; color: #1e40af; margin-bottom: 8px; }
            .contact { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; color: #666; font-size: 14px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 20px; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 4px; margin-bottom: 12px; }
            .summary { line-height: 1.6; color: #555; }
            .experience-item, .education-item { margin-bottom: 16px; }
            .exp-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .exp-title { font-weight: bold; font-size: 16px; }
            .exp-company { color: #1e40af; font-size: 14px; }
            .exp-date { color: #666; font-size: 14px; }
            .exp-description { color: #555; line-height: 1.5; margin-top: 8px; }
            .skills-grid { display: grid; grid-template-columns: 120px 1fr; gap: 12px; }
            .skill-category { font-weight: bold; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const downloadWord = () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
          <meta charset='utf-8'>
          <title>Resume - ${personalInfo.fullName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Calibri, Arial, sans-serif; padding: 40px; }
            h1 { font-size: 28pt; color: #1e40af; margin-bottom: 8px; }
            .contact { margin-bottom: 20px; font-size: 11pt; }
            .section-title { font-size: 16pt; color: #1e40af; border-bottom: 2px solid #1e40af; margin-bottom: 10px; }
            .exp-title { font-weight: bold; font-size: 12pt; }
            p { line-height: 1.5; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_${personalInfo.fullName.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Resume Generator</h1>
          <p className="text-gray-600">Create your professional resume in minutes</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'edit'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="inline mr-2 h-5 w-5" />
            Edit Resume
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileDown className="inline mr-2 h-5 w-5" />
            Preview & Download
          </button>
        </div>

        {/* Edit Tab */}
        {activeTab === 'edit' && (
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="mr-2" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={personalInfo.github}
                  onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Professional Summary"
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                rows={3}
                className="w-full mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Experience */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Briefcase className="mr-2" /> Experience
                </h2>
                <button
                  onClick={addExperience}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Experience
                </button>
              </div>
              {experiences.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-700">Experience {index + 1}</span>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => {
                        const updated = experiences.map(item =>
                          item.id === exp.id ? {...item, title: e.target.value} : item
                        );
                        setExperiences(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = experiences.map(item =>
                          item.id === exp.id ? {...item, company: e.target.value} : item
                        );
                        setExperiences(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => {
                        const updated = experiences.map(item =>
                          item.id === exp.id ? {...item, location: e.target.value} : item
                        );
                        setExperiences(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="month"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = experiences.map(item =>
                            item.id === exp.id ? {...item, startDate: e.target.value} : item
                          );
                          setExperiences(updated);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 flex-1"
                      />
                      <input
                        type="month"
                        placeholder="End Date"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => {
                          const updated = experiences.map(item =>
                            item.id === exp.id ? {...item, endDate: e.target.value} : item
                          );
                          setExperiences(updated);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 flex-1 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <label className="flex items-center mt-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => {
                        const updated = experiences.map(item =>
                          item.id === exp.id ? {...item, current: e.target.checked, endDate: e.target.checked ? '' : item.endDate} : item
                        );
                        setExperiences(updated);
                      }}
                      className="mr-2"
                    />
                    Currently working here
                  </label>
                  <textarea
                    placeholder="Description of responsibilities and achievements"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = experiences.map(item =>
                        item.id === exp.id ? {...item, description: e.target.value} : item
                      );
                      setExperiences(updated);
                    }}
                    rows={3}
                    className="w-full mt-3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <GraduationCap className="mr-2" /> Education
                </h2>
                <button
                  onClick={addEducation}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Education
                </button>
              </div>
              {education.map((edu, index) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-700">Education {index + 1}</span>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = education.map(item =>
                          item.id === edu.id ? {...item, degree: e.target.value} : item
                        );
                        setEducation(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = education.map(item =>
                          item.id === edu.id ? {...item, institution: e.target.value} : item
                        );
                        setEducation(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => {
                        const updated = education.map(item =>
                          item.id === edu.id ? {...item, location: e.target.value} : item
                        );
                        setEducation(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Year"
                      value={edu.graduationDate}
                      onChange={(e) => {
                        const updated = education.map(item =>
                          item.id === edu.id ? {...item, graduationDate: e.target.value} : item
                        );
                        setEducation(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="GPA (optional)"
                      value={edu.gpa}
                      onChange={(e) => {
                        const updated = education.map(item =>
                          item.id === edu.id ? {...item, gpa: e.target.value} : item
                        );
                        setEducation(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Award className="mr-2" /> Skills
                </h2>
                <button
                  onClick={addSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Skill Category
                </button>
              </div>
              {skills.map((skill, index) => (
                <div key={skill.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-700">Skill Category {index + 1}</span>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Category (e.g., Frontend)"
                      value={skill.category}
                      onChange={(e) => {
                        const updated = skills.map(item =>
                          item.id === skill.id ? {...item, category: e.target.value} : item
                        );
                        setSkills(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Skills (comma separated)"
                      value={skill.items}
                      onChange={(e) => {
                        const updated = skills.map(item =>
                          item.id === skill.id ? {...item, items: e.target.value} : item
                        );
                        setSkills(updated);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 md:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="max-w-5xl mx-auto">
            {/* Download Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={downloadPDF}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center shadow-lg"
              >
                <FileDown className="mr-2 h-5 w-5" />
                Download PDF
              </button>
              <button
                onClick={downloadWord}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center shadow-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Word
              </button>
            </div>

            {/* Resume Preview */}
            <div className="bg-white rounded-xl shadow-2xl p-12" id="resume-preview">
              <div className="resume">
                {/* Header */}
                <h1 className="text-4xl font-bold text-blue-700 mb-2">{personalInfo.fullName}</h1>
                <div className="contact flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  {personalInfo.email && (
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {personalInfo.email}
                    </span>
                  )}
                  {personalInfo.phone && (
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {personalInfo.phone}
                    </span>
                  )}
                  {personalInfo.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {personalInfo.location}
                    </span>
                  )}
                  {personalInfo.linkedin && (
                    <span className="flex items-center">
                      <Linkedin className="h-4 w-4 mr-1" />
                      {personalInfo.linkedin}
                    </span>
                  )}
                  {personalInfo.github && (
                    <span className="flex items-center">
                      <Github className="h-4 w-4 mr-1" />
                      {personalInfo.github}
                    </span>
                  )}
                </div>

                {/* Summary */}
                {personalInfo.summary && (
                  <div className="section mb-6">
                    <h2 className="section-title text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">
                      Professional Summary
                    </h2>
                    <p className="summary text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {experiences.length > 0 && experiences[0].title && (
                  <div className="section mb-6">
                    <h2 className="section-title text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">
                      Experience
                    </h2>
                    {experiences.map((exp) => (
                      exp.title && (
                        <div key={exp.id} className="experience-item mb-4">
                          <div className="exp-header flex justify-between items-start mb-1">
                            <div>
                              <div className="exp-title font-bold text-gray-800">{exp.title}</div>
                              <div className="exp-company text-blue-600 text-sm">
                                {exp.company}{exp.location && ` - ${exp.location}`}
                              </div>
                            </div>
                            <div className="exp-date text-gray-600 text-sm">
                              {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              {' - '}
                              {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                            </div>
                          </div>
                          {exp.description && (
                            <p className="exp-description text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Education */}
                {education.length > 0 && education[0].degree && (
                  <div className="section mb-6">
                    <h2 className="section-title text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">
                      Education
                    </h2>
                    {education.map((edu) => (
                      edu.degree && (
                        <div key={edu.id} className="education-item mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-gray-800">{edu.degree}</div>
                              <div className="text-blue-600 text-sm">
                                {edu.institution}{edu.location && ` - ${edu.location}`}
                              </div>
                            </div>
                            <div className="text-gray-600 text-sm">
                              {edu.graduationDate}
                              {edu.gpa && ` | GPA: ${edu.gpa}`}
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && skills[0].category && (
                  <div className="section">
                    <h2 className="section-title text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">
                      Skills
                    </h2>
                    <div className="skills-grid">
                      {skills.map((skill) => (
                        skill.category && skill.items && (
                          <React.Fragment key={skill.id}>
                            <div className="skill-category font-semibold text-gray-800">{skill.category}:</div>
                            <div className="text-gray-700 text-sm">{skill.items}</div>
                          </React.Fragment>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeGenerator