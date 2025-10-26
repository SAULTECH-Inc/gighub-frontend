import React, { useState } from 'react';
import {
  FileText, Wand2, UserCheck, Download, Share2, Mail,
  ChevronRight, ChevronLeft, Eye, Edit3, Sparkles,
  CheckCircle, Lock, CreditCard, MessageSquare,
  Save, Plus, Trash2, X
} from 'lucide-react';
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import { applicantNavBarItemMap, applicantNavItems, applicantNavItemsMobile } from "../../utils/constants.ts";

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

type Step = 'choose-method' | 'select-template' | 'edit-cv' | 'review' | 'export';
type Template = 'modern' | 'classic' | 'minimal' | 'creative';

const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('choose-method');
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('modern');
  const [, setBuildMethod] = useState<'manual' | 'ai' | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('personal');

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });

  const templates = [
    { id: 'modern', name: 'Modern Professional', preview: '🎨', color: 'bg-slate-800' },
    { id: 'classic', name: 'Classic Executive', preview: '📋', color: 'bg-blue-900' },
    { id: 'minimal', name: 'Minimal Clean', preview: '✨', color: 'bg-gray-700' },
    { id: 'creative', name: 'Creative Bold', preview: '🚀', color: 'bg-purple-800' }
  ];

  const handleAIGenerate = async () => {
    if (!aiInput.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setCvData({
        personalInfo: {
          name: 'Sarah Johnson',
          title: 'Senior Product Manager',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 987-6543',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/sarahjohnson',
          github: 'github.com/sarahjohnson',
          website: 'sarahjohnson.com'
        },
        summary: 'Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative solutions.',
        experience: [
          {
            id: '1',
            title: 'Senior Product Manager',
            company: 'Tech Solutions Inc.',
            location: 'New York, NY',
            startDate: '2021-01',
            endDate: '',
            current: true,
            achievements: [
              'Led product strategy for flagship product serving 500K+ users',
              'Increased user retention by 45% through data-driven improvements'
            ]
          }
        ],
        education: [
          {
            id: '1',
            degree: 'MBA in Business Administration',
            institution: 'Harvard Business School',
            location: 'Boston, MA',
            startDate: '2013-09',
            endDate: '2015-05',
            gpa: '3.9'
          }
        ],
        skills: ['Product Strategy', 'Agile/Scrum', 'Data Analysis', 'User Research'],
        certifications: ['Certified Scrum Product Owner (CSPO)']
      });
      setIsProcessing(false);
      setShowAIModal(false);
      setCurrentStep('select-template');
    }, 2000);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: ['']
    };
    setCvData({ ...cvData, experience: [...cvData.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setCvData({ ...cvData, education: [...cvData.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setCvData({
      ...cvData,
      education: cvData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[
        { key: 'choose-method', label: 'Method' },
        { key: 'select-template', label: 'Template' },
        { key: 'edit-cv', label: 'Edit' },
        { key: 'export', label: 'Export' }
      ].map((step, idx) => (
        <React.Fragment key={step.key}>
          <div className={`flex items-center gap-2 ${
            currentStep === step.key ? 'text-blue-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === step.key ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {idx + 1}
            </div>
            <span className="text-sm font-medium hidden md:inline">{step.label}</span>
          </div>
          {idx < 3 && <ChevronRight className="w-4 h-4 text-gray-300" />}
        </React.Fragment>
      ))}
    </div>
  );

  const renderChooseMethod = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-3">Create Your Professional CV</h2>
      <p className="text-gray-600 text-center mb-8">Choose how you'd like to build your CV</p>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => {
            setBuildMethod('manual');
            setCurrentStep('select-template');
          }}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-500 text-left"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Build Manually</h3>
          <p className="text-gray-600 mb-4">Fill out a form and see your CV update in real-time</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Step-by-step guided process
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Live preview as you type
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Full control over content
            </li>
          </ul>
        </button>

        <button
          onClick={() => {
            setBuildMethod('ai');
            setShowAIModal(true);
          }}
          className="bg-gradient-to-br from-purple-500 to-blue-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-left text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold">AI-Powered Generation</h3>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-blue-100 mb-4">Let AI create your CV from existing content</p>
          <ul className="space-y-2 text-sm text-blue-100">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              Paste old CV or LinkedIn profile
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              AI extracts and formats data
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              Edit and refine after generation
            </li>
          </ul>
        </button>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Premium Feature</h4>
            <p className="text-sm text-yellow-800">
              CV Builder is a premium feature. One-time payment of $9.99 for unlimited access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-3">Choose Your Template</h2>
      <p className="text-gray-600 text-center mb-8">Select a design that matches your style</p>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id as Template)}
            className={`relative p-6 rounded-xl transition-all ${
              selectedTemplate === template.id
                ? 'ring-4 ring-blue-500 shadow-xl'
                : 'border-2 border-gray-200 hover:border-blue-300 shadow-md'
            }`}
          >
            <div className={`${template.color} h-48 rounded-lg mb-4 flex items-center justify-center text-6xl`}>
              {template.preview}
            </div>
            <h3 className="font-semibold text-center">{template.name}</h3>
            {selectedTemplate === template.id && (
              <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setCurrentStep('choose-method')}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep('edit-cv')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderCVEditor = () => (
    <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[800px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Edit Your CV</h3>
          <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['personal', 'summary', 'experience', 'education', 'skills'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeSection === section
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                value={cvData.personalInfo.name}
                onChange={(e) => setCvData({
                  ...cvData,
                  personalInfo: { ...cvData.personalInfo, name: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Professional Title *</label>
              <input
                type="text"
                value={cvData.personalInfo.title}
                onChange={(e) => setCvData({
                  ...cvData,
                  personalInfo: { ...cvData.personalInfo, title: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Senior Software Engineer"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => setCvData({
                    ...cvData,
                    personalInfo: { ...cvData.personalInfo, email: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="john@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => setCvData({
                    ...cvData,
                    personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={cvData.personalInfo.location}
                onChange={(e) => setCvData({
                  ...cvData,
                  personalInfo: { ...cvData.personalInfo, location: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        )}

        {activeSection === 'summary' && (
          <div>
            <label className="block text-sm font-medium mb-1">Professional Summary</label>
            <textarea
              value={cvData.summary}
              onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-40 resize-none"
              placeholder="Write a compelling summary of your professional background..."
            />
          </div>
        )}

        {activeSection === 'experience' && (
          <div className="space-y-6">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold">Experience Entry</h4>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Location"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Experience
            </button>
          </div>
        )}

        {activeSection === 'education' && (
          <div className="space-y-6">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Degree"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Institution"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Education
            </button>
          </div>
        )}

        {activeSection === 'skills' && (
          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
            <textarea
              value={cvData.skills.join(', ')}
              onChange={(e) => setCvData({
                ...cvData,
                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              placeholder="JavaScript, React, Node.js, Python..."
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Live Preview</h3>
          <Eye className="w-5 h-5 text-blue-600" />
        </div>
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className={`${selectedTemplate === 'modern' ? 'bg-slate-800' : 'bg-blue-900'} text-white p-6`}>
            <h1 className="text-3xl font-bold">{cvData.personalInfo.name || 'Your Name'}</h1>
            <p className="text-lg mt-1 opacity-90">{cvData.personalInfo.title || 'Your Title'}</p>
            <div className="mt-4 text-sm space-y-1 opacity-80">
              {cvData.personalInfo.email && <p>📧 {cvData.personalInfo.email}</p>}
              {cvData.personalInfo.phone && <p>📱 {cvData.personalInfo.phone}</p>}
              {cvData.personalInfo.location && <p>📍 {cvData.personalInfo.location}</p>}
            </div>
          </div>
          <div className="p-6 bg-white">
            {cvData.summary && (
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-2 border-b-2 border-gray-800 pb-1">Summary</h2>
                <p className="text-sm text-gray-700">{cvData.summary}</p>
              </div>
            )}
            {cvData.experience.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-2 border-b-2 border-gray-800 pb-1">Experience</h2>
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="mb-2">
                    <h3 className="font-bold text-sm">{exp.title || 'Job Title'}</h3>
                    <p className="text-xs text-gray-600">{exp.company || 'Company'}</p>
                  </div>
                ))}
              </div>
            )}
            {cvData.education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-2 border-b-2 border-gray-800 pb-1">Education</h2>
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                    <p className="text-xs text-gray-600">{edu.institution || 'Institution'}</p>
                  </div>
                ))}
              </div>
            )}
            {cvData.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-2 border-b-2 border-gray-800 pb-1">Skills</h2>
                <p className="text-sm text-gray-700">{cvData.skills.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportOptions = () => (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Export Your CV</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-500"
        >
          <Download className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Download CV</h3>
          <p className="text-sm text-gray-600 mb-3">Export as PDF, DOCX, or TXT</p>
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Lock className="w-4 h-4" />
            <span className="font-medium">$4.99</span>
          </div>
        </button>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-500"
        >
          <Share2 className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Share Link</h3>
          <p className="text-sm text-gray-600 mb-3">Create a public link</p>
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Lock className="w-4 h-4" />
            <span className="font-medium">$2.99</span>
          </div>
        </button>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-500"
        >
          <Mail className="w-8 h-8 text-orange-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Email CV</h3>
          <p className="text-sm text-gray-600 mb-3">Send to employers</p>
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Lock className="w-4 h-4" />
            <span className="font-medium">$1.99</span>
          </div>
        </button>

        <button
          onClick={() => setShowReviewModal(true)}
          className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl shadow-lg hover:shadow-xl text-white"
        >
          <UserCheck className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-2">Professional Review</h3>
          <p className="text-sm text-green-100 mb-3">Get expert feedback</p>
          <span className="font-medium">$19.99</span>
        </button>
      </div>
    </div>
  );

  const AIModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
        <button
          onClick={() => setShowAIModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">AI CV Generator</h3>
            <p className="text-gray-600">Paste your existing CV or LinkedIn profile</p>
          </div>
        </div>

        <textarea
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="Paste your old CV, resume, or LinkedIn profile text here...&#10;&#10;Our AI will extract the information and create a professional CV for you."
        />

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setShowAIModal(false)}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAIGenerate}
            disabled={!aiInput.trim() || isProcessing}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate CV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const ReviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 relative">
        <button
          onClick={() => setShowReviewModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Professional CV Review</h3>
          <p className="text-gray-600">Get expert feedback from industry professionals</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Detailed Feedback</h4>
              <p className="text-sm text-gray-600">Get comprehensive review of content, formatting, and ATS optimization</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">48-Hour Turnaround</h4>
              <p className="text-sm text-gray-600">Receive detailed feedback within 2 business days</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Video Consultation</h4>
              <p className="text-sm text-gray-600">Optional 15-minute video call to discuss improvements</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">What You'll Get</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Content and structure recommendations</li>
                <li>• Grammar and language improvements</li>
                <li>• ATS compatibility check</li>
                <li>• Industry-specific suggestions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowReviewModal(false)}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              setShowReviewModal(false);
              setShowPaymentModal(true);
            }}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Request Review - $19.99
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={() => setShowPaymentModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Complete Your Purchase</h3>
          <p className="text-gray-600">Secure payment powered by Stripe</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">CV Builder Access</span>
            <span className="font-semibold">$9.99</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>One-time payment</span>
            <span>Lifetime access</span>
          </div>
        </div>

        <form className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </form>

        <button
          onClick={() => {
            setShowPaymentModal(false);
            alert('Payment processed! You now have full access to CV Builder.');
          }}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          Pay $9.99
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">CV Builder</h1>
            </div>
            <p className="text-gray-600">Create professional CVs that get you hired</p>
          </div>

          {renderStepIndicator()}

          <div className="mt-8">
            {currentStep === 'choose-method' && renderChooseMethod()}
            {currentStep === 'select-template' && renderTemplateSelection()}
            {currentStep === 'edit-cv' && renderCVEditor()}
            {currentStep === 'export' && renderExportOptions()}
          </div>

          {currentStep === 'edit-cv' && (
            <div className="flex justify-between items-center mt-8 max-w-7xl mx-auto">
              <button
                onClick={() => setCurrentStep('select-template')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-3 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Request Review
                </button>
                <button
                  onClick={() => setCurrentStep('export')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Continue to Export
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {showAIModal && <AIModal />}
          {showReviewModal && <ReviewModal />}
          {showPaymentModal && <PaymentModal />}
        </div>

        <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-4 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wand2 className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">AI-Powered</h4>
            <p className="text-sm text-gray-600">Generate CVs instantly with AI</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">Live Preview</h4>
            <p className="text-sm text-gray-600">See changes in real-time</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">Expert Review</h4>
            <p className="text-sm text-gray-600">Professional feedback available</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold mb-2">Multiple Formats</h4>
            <p className="text-sm text-gray-600">Download as PDF, DOCX, or share online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
