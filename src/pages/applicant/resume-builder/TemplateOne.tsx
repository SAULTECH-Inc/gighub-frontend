import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Award, Code } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
}

const TemplateOne: React.FC = () => {
  const [cvData] = useState({
    personalInfo: {
      name: "John Anderson",
      title: "Senior Software Engineer",
      email: "john.anderson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johnanderson",
      github: "github.com/johnanderson",
      website: "johnanderson.dev"
    },
    summary: "Results-driven Software Engineer with 6+ years of experience building scalable web applications and leading cross-functional teams. Proven track record of delivering high-impact solutions that improve user engagement by 40% and reduce operational costs by 30%. Expertise in full-stack development, cloud architecture, and agile methodologies.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        period: "Jan 2022 - Present",
        achievements: [
          "Led development of microservices architecture serving 2M+ daily active users, improving system reliability by 45%",
          "Architected and implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
          "Mentored team of 5 junior developers, resulting in 30% increase in team productivity",
          "Optimized database queries and caching strategies, reducing API response time by 60%"
        ]
      },
      {
        title: "Software Engineer",
        company: "Innovation Labs",
        location: "San Francisco, CA",
        period: "Jun 2019 - Dec 2021",
        achievements: [
          "Developed and maintained 15+ RESTful APIs handling 100K+ requests per day",
          "Implemented automated testing suite achieving 85% code coverage and reducing bugs by 40%",
          "Collaborated with UX team to redesign customer dashboard, increasing user engagement by 35%",
          "Participated in code reviews and established coding standards across engineering team"
        ]
      },
      {
        title: "Junior Software Developer",
        company: "StartupXYZ",
        location: "Remote",
        period: "Jan 2018 - May 2019",
        achievements: [
          "Built responsive web applications using React and Node.js for 10+ client projects",
          "Integrated third-party APIs including Stripe, SendGrid, and AWS S3",
          "Contributed to open-source projects and maintained technical documentation"
        ]
      }
    ] as Experience[],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California",
        location: "Berkeley, CA",
        period: "2014 - 2018",
        gpa: "3.8/4.0"
      }
    ] as Education[],
    skills: {
      "Languages": ["JavaScript", "TypeScript", "Python", "Java", "SQL", "HTML/CSS"],
      "Frameworks & Libraries": ["React", "Node.js", "Express", "Next.js", "Django", "Spring Boot"],
      "Tools & Technologies": ["AWS", "Docker", "Kubernetes", "Git", "Jenkins", "PostgreSQL", "MongoDB"],
      "Methodologies": ["Agile/Scrum", "CI/CD", "Test-Driven Development", "Microservices Architecture"]
    },
    projects: [
      {
        name: "E-Commerce Platform",
        description: "Built full-stack e-commerce solution with payment processing, inventory management, and analytics dashboard",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"]
      },
      {
        name: "Task Management SaaS",
        description: "Developed collaborative project management tool with real-time updates and team collaboration features",
        technologies: ["Next.js", "TypeScript", "MongoDB", "Socket.io", "Tailwind CSS"]
      }
    ] as Project[],
    certifications: [
      "AWS Certified Solutions Architect - Associate",
      "Professional Scrum Master I (PSM I)",
      "MongoDB Certified Developer"
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="bg-slate-800 text-white p-8">
          <h1 className="text-4xl font-bold mb-2">{cvData.personalInfo.name}</h1>
          <p className="text-xl text-slate-300 mb-4">{cvData.personalInfo.title}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{cvData.personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{cvData.personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{cvData.personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              <span>{cvData.personalInfo.linkedin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span>{cvData.personalInfo.github}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>{cvData.personalInfo.website}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-3 pb-2 border-b-2 border-slate-800">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-800 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Professional Experience
            </h2>
            {cvData.experience.map((exp, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{exp.title}</h3>
                    <p className="text-gray-700 font-medium">{exp.company} | {exp.location}</p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{exp.period}</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-gray-700">{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-800 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Education
            </h2>
            {cvData.education.map((edu, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution} | {edu.location}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{edu.period}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-800 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Technical Skills
            </h2>
            {Object.entries(cvData.skills).map(([category, skills]) => (
              <div key={category} className="mb-3 last:mb-0">
                <span className="font-bold text-slate-800">{category}: </span>
                <span className="text-gray-700">{skills.join(', ')}</span>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-800">
              Notable Projects
            </h2>
            {cvData.projects.map((project, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                <p className="text-gray-700 mb-1">{project.description}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Technologies: </span>
                  {project.technologies.join(', ')}
                </p>
              </div>
            ))}
          </section>

          {/* Certifications */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-800 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Certifications
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {cvData.certifications.map((cert, idx) => (
                <li key={idx} className="text-gray-700">{cert}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;
