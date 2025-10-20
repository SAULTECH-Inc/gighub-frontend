import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Clock, Users, CheckCircle, XCircle, AlertCircle, Send, Eye, Download, BarChart3, Plus, Target, Flag, ThumbsUp, ThumbsDown, TrendingUp, Award, X } from 'lucide-react';
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import { employerNavBarItemMap, employerNavItems, employerNavItemsMobile } from "../../utils/constants.ts";

interface Assessment {
  id: number;
  name: string;
  duration: number;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'auto' | 'manual';
  description: string;
  skills: string[];
}

interface AssessmentPool {
  category: string;
  assessments: Assessment[];
}

interface Question {
  id: number;
  text: string;
  type: 'multiple_choice' | 'coding' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  maxScore: number;
}

interface CandidateAnswer {
  questionId: number;
  answer: string;
  score?: number;
}

interface SubmittedAssessment {
  id: number;
  candidate: string;
  candidateId: number;
  score: number | null;
  status: 'passed' | 'failed' | 'pending' | 'flagged';
  submittedAt: string;
  autoScored: boolean;
  answers?: CandidateAnswer[];
  assessmentQuestions?: Question[];
}

interface Job {
  id: number;
  title: string;
  applicants: number;
  status: 'active' | 'closed';
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onConfirm,
                                                                 title,
                                                                 message,
                                                                 confirmText = 'Confirm',
                                                                 cancelText = 'Cancel',
                                                                 type = 'info',
                                                                 loading = false,
                                                               }) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return { bg: 'bg-red-100', text: 'text-red-600', button: 'bg-red-600 hover:bg-red-700' };
      case 'warning':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600', button: 'bg-yellow-600 hover:bg-yellow-700' };
      case 'success':
        return { bg: 'bg-green-100', text: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-[#6A0DAD] hover:bg-[#6438c2]' };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 flex-shrink-0 rounded-full ${styles.bg} flex items-center justify-center`}>
              <CheckCircle className={styles.text} size={24} />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 rounded-b-xl bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${styles.button}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployerAssessmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job>();
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>([]);
  const [assessmentSettings, setAssessmentSettings] = useState({
    autoScore: true,
    autoDisqualify: false,
    deadline: 7
  });
  const [activeTab, setActiveTab] = useState('create');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmittedAssessment | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<any>({ isOpen: false });
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  const postedJobs: Job[] = [
    { id: 1, title: 'Senior Frontend Developer', applicants: 247, status: 'active' },
    { id: 2, title: 'Product Manager', applicants: 189, status: 'active' },
    { id: 3, title: 'UI/UX Designer', applicants: 156, status: 'active' }
  ];

  const assessmentPools: AssessmentPool[] = [
    {
      category: 'Technical Skills',
      assessments: [
        {
          id: 1,
          name: 'React Advanced',
          duration: 60,
          questions: 25,
          difficulty: 'Hard',
          type: 'auto',
          description: 'Comprehensive assessment of advanced React concepts including hooks, context, performance optimization, and modern patterns.',
          skills: ['Component Architecture', 'State Management', 'Performance Optimization', 'Testing']
        },
        {
          id: 2,
          name: 'JavaScript Fundamentals',
          duration: 45,
          questions: 30,
          difficulty: 'Medium',
          type: 'auto',
          description: 'Tests core JavaScript knowledge including ES6+ features, async programming, closures, and functional programming.',
          skills: ['ES6+ Syntax', 'Async/Await', 'Closures', 'Array Methods']
        },
        {
          id: 3,
          name: 'System Design',
          duration: 90,
          questions: 5,
          difficulty: 'Hard',
          type: 'manual',
          description: 'Evaluates ability to design scalable systems, data structures, architectural decisions, and problem-solving approach.',
          skills: ['System Architecture', 'Scalability', 'Data Structures', 'Problem Solving']
        }
      ]
    },
    {
      category: 'Soft Skills',
      assessments: [
        {
          id: 4,
          name: 'Communication Assessment',
          duration: 30,
          questions: 15,
          difficulty: 'Easy',
          type: 'manual',
          description: 'Assesses written and verbal communication skills, clarity of thought, and ability to explain technical concepts.',
          skills: ['Written Communication', 'Technical Explanation', 'Clarity', 'Collaboration']
        },
        {
          id: 5,
          name: 'Problem Solving',
          duration: 45,
          questions: 20,
          difficulty: 'Medium',
          type: 'auto',
          description: 'Tests analytical thinking, logical reasoning, and creative problem-solving abilities.',
          skills: ['Analytical Thinking', 'Logic', 'Creative Solutions', 'Critical Thinking']
        }
      ]
    },
    {
      category: 'Project-Based',
      assessments: [
        {
          id: 6,
          name: 'Build a Dashboard',
          duration: 240,
          questions: 1,
          difficulty: 'Hard',
          type: 'manual',
          description: 'Practical assessment requiring candidates to build a functional dashboard with clean code, proper architecture, and best practices.',
          skills: ['Clean Code', 'Component Design', 'State Management', 'UI/UX Implementation']
        },
        {
          id: 7,
          name: 'Code Review Exercise',
          duration: 60,
          questions: 3,
          difficulty: 'Medium',
          type: 'manual',
          description: 'Tests ability to identify bugs, suggest improvements, and understand code quality standards.',
          skills: ['Code Quality', 'Bug Detection', 'Best Practices', 'Refactoring']
        }
      ]
    }
  ];

  const mockQuestions: Question[] = [
    {
      id: 1,
      text: 'Explain the concept of closures in JavaScript and provide a practical example.',
      type: 'essay',
      maxScore: 25
    },
    {
      id: 2,
      text: 'Design a scalable architecture for a real-time chat application. Include database choices, caching strategy, and scaling considerations.',
      type: 'essay',
      maxScore: 30
    },
    {
      id: 3,
      text: 'Which React hook would you use to handle side effects?',
      type: 'multiple_choice',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correctAnswer: 1,
      maxScore: 10
    }
  ];

  const submittedAssessments: SubmittedAssessment[] = [
    {
      id: 1,
      candidate: 'John Doe',
      candidateId: 101,
      score: 85,
      status: 'passed',
      submittedAt: '2h ago',
      autoScored: true
    },
    {
      id: 2,
      candidate: 'Jane Smith',
      candidateId: 102,
      score: null,
      status: 'pending',
      submittedAt: '5h ago',
      autoScored: false,
      assessmentQuestions: mockQuestions,
      answers: [
        {
          questionId: 1,
          answer: 'A closure is a function that has access to variables in its outer scope, even after the outer function has returned. Example: function outer() { let count = 0; return function inner() { count++; return count; } }'
        },
        {
          questionId: 2,
          answer: 'For a real-time chat app, I would use: WebSocket for real-time communication, Redis for caching and pub/sub, PostgreSQL for persistent storage, horizontal scaling with load balancers, and CDN for static assets.'
        },
        {
          questionId: 3,
          answer: 'useEffect'
        }
      ]
    },
    {
      id: 3,
      candidate: 'Mike Johnson',
      candidateId: 103,
      score: 92,
      status: 'passed',
      submittedAt: '1d ago',
      autoScored: true
    },
    {
      id: 4,
      candidate: 'Sarah Williams',
      candidateId: 104,
      score: 58,
      status: 'failed',
      submittedAt: '1d ago',
      autoScored: true
    },
    {
      id: 5,
      candidate: 'Tom Brown',
      candidateId: 105,
      score: null,
      status: 'pending',
      submittedAt: '2d ago',
      autoScored: false,
      assessmentQuestions: mockQuestions,
      answers: [
        {
          questionId: 1,
          answer: 'Closures allow functions to remember variables from their creation context.'
        },
        {
          questionId: 2,
          answer: 'Use MongoDB, WebSockets, and deploy on AWS with auto-scaling groups.'
        },
        {
          questionId: 3,
          answer: 'useState'
        }
      ]
    }
  ];

  const handleAssessmentSelect = (assessment: Assessment) => {
    if (selectedAssessments.find(a => a.id === assessment.id)) {
      setSelectedAssessments(selectedAssessments.filter(a => a.id !== assessment.id));
    } else {
      setSelectedAssessments([...selectedAssessments, assessment]);
    }
  };

  const handleScoreSubmission = (submission: SubmittedAssessment, action: 'accept' | 'reject' | 'flag') => {
    const messages = {
      accept: { title: 'Candidate Accepted', message: `${submission.candidate} has been marked as passed.` },
      reject: { title: 'Candidate Rejected', message: `${submission.candidate} has been marked as failed.` },
      flag: { title: 'Candidate Flagged', message: `${submission.candidate} has been flagged for review.` }
    };

    setConfirmDialog({
      isOpen: true,
      ...messages[action],
      type: action === 'accept' ? 'success' : action === 'reject' ? 'danger' : 'warning',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        setShowReviewModal(false);
      },
      onClose: () => setConfirmDialog({ isOpen: false })
    });
  };

  const ReviewModal = () => {
    if (!showReviewModal || !selectedSubmission) return null;

    const [scores, setScores] = useState<Record<number, number>>({});
    const totalMaxScore = selectedSubmission.assessmentQuestions?.reduce((sum, q) => sum + q.maxScore, 0) || 0;
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl my-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#222222]">Review Submission</h2>
                <p className="text-gray-600 mt-1">Candidate: {selectedSubmission.candidate}</p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {selectedSubmission.assessmentQuestions?.map((question, idx) => {
              const answer = selectedSubmission.answers?.find(a => a.questionId === question.id);
              return (
                <div key={question.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#222222] mb-2">
                        Question {idx + 1}
                      </h3>
                      <p className="text-gray-700">{question.text}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-[#6A0DAD] rounded-full text-sm font-medium">
                      Max: {question.maxScore} pts
                    </span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-blue-900 mb-2">Candidate's Answer:</div>
                    <p className="text-blue-800">{answer?.answer || 'No answer provided'}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex-1">
                      <span className="text-sm font-medium text-gray-700 block mb-2">Score</span>
                      <input
                        type="number"
                        min="0"
                        max={question.maxScore}
                        value={scores[question.id] || 0}
                        onChange={(e) => setScores({ ...scores, [question.id]: Math.min(Number(e.target.value), question.maxScore) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
                      />
                    </label>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#6A0DAD]">
                        {scores[question.id] || 0}/{question.maxScore}
                      </div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600">Total Score</div>
                <div className="text-3xl font-bold text-[#6A0DAD]">{percentage}%</div>
                <div className="text-sm text-gray-600">{totalScore} / {totalMaxScore} points</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleScoreSubmission(selectedSubmission, 'reject')}
                  className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2"
                >
                  <ThumbsDown size={18} />
                  Reject
                </button>
                <button
                  onClick={() => handleScoreSubmission(selectedSubmission, 'flag')}
                  className="px-6 py-2 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 font-medium flex items-center gap-2"
                >
                  <Flag size={18} />
                  Flag for Review
                </button>
                <button
                  onClick={() => handleScoreSubmission(selectedSubmission, 'accept')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                >
                  <ThumbsUp size={18} />
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsModal = () => {
    if (!showAnalytics) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#222222]">Assessment Analytics</h2>
              <button onClick={() => setShowAnalytics(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <Users className="text-blue-600 mb-2" size={24} />
                <div className="text-3xl font-bold text-blue-900">247</div>
                <div className="text-sm text-blue-700">Total Candidates</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <TrendingUp className="text-green-600 mb-2" size={24} />
                <div className="text-3xl font-bold text-green-900">63%</div>
                <div className="text-sm text-green-700">Completion Rate</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <Award className="text-purple-600 mb-2" size={24} />
                <div className="text-3xl font-bold text-purple-900">78%</div>
                <div className="text-sm text-purple-700">Avg Score</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                <Clock className="text-orange-600 mb-2" size={24} />
                <div className="text-3xl font-bold text-orange-900">52m</div>
                <div className="text-sm text-orange-700">Avg Duration</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-[#222222]">Score Distribution</h3>
                <div className="space-y-3">
                  {[
                    { range: '90-100%', count: 45, color: 'bg-green-600' },
                    { range: '80-89%', count: 62, color: 'bg-blue-600' },
                    { range: '70-79%', count: 38, color: 'bg-yellow-600' },
                    { range: '60-69%', count: 21, color: 'bg-orange-600' },
                    { range: 'Below 60%', count: 14, color: 'bg-red-600' }
                  ].map(item => (
                    <div key={item.range}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.range}</span>
                        <span className="font-semibold text-[#222222]">{item.count} candidates</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / 180) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4 text-[#222222]">Top Performing Skills</h3>
                <div className="space-y-4">
                  {[
                    { skill: 'React Advanced', avgScore: 85, candidates: 156 },
                    { skill: 'System Design', avgScore: 78, candidates: 124 },
                    { skill: 'JavaScript Fundamentals', avgScore: 82, candidates: 143 },
                    { skill: 'Problem Solving', avgScore: 76, candidates: 118 }
                  ].map(item => (
                    <div key={item.skill} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[#222222]">{item.skill}</div>
                        <div className="text-xs text-gray-600">{item.candidates} candidates</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#6A0DAD]">{item.avgScore}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-[#222222]">Assessment Timeline</h3>
              <div className="space-y-2">
                {[
                  { date: 'Week 1', sent: 100, completed: 65, passed: 48 },
                  { date: 'Week 2', sent: 85, completed: 58, passed: 42 },
                  { date: 'Week 3', sent: 62, completed: 45, passed: 35 }
                ].map(item => (
                  <div key={item.date} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-gray-700">{item.date}</div>
                    <div className="flex-1 flex gap-2">
                      <div className="bg-blue-200 rounded px-3 py-1 text-xs font-medium text-blue-900">
                        {item.sent} sent
                      </div>
                      <div className="bg-yellow-200 rounded px-3 py-1 text-xs font-medium text-yellow-900">
                        {item.completed} completed
                      </div>
                      <div className="bg-green-200 rounded px-3 py-1 text-xs font-medium text-green-900">
                        {item.passed} passed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateCustomAssessmentModal = () => {
    if (!showCreateAssessment) return null;

    const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
      type: 'essay',
      maxScore: 10
    });

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#222222]">Create Custom Assessment</h2>
              <button onClick={() => setShowCreateAssessment(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Name</label>
              <input
                type="text"
                placeholder="e.g., Custom JavaScript Test"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="60"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                placeholder="What skills does this assessment test?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-4 text-[#222222]">Add Questions</h3>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
                  >
                    <option value="essay">Essay</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="coding">Coding Challenge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                  <textarea
                    rows={3}
                    value={newQuestion.text || ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    placeholder="Enter your question..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={newQuestion.maxScore}
                    onChange={(e) => setNewQuestion({ ...newQuestion, maxScore: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
                  />
                </div>

                <button
                  onClick={() => {
                    if (newQuestion.text && newQuestion.maxScore) {
                      setCustomQuestions([...customQuestions, { ...newQuestion, id: Date.now() } as Question]);
                      setNewQuestion({ type: 'essay', maxScore: 10, text: '' });
                    }
                  }}
                  className="px-4 py-2 bg-[#6438c2] text-white rounded-lg hover:bg-[#6A0DAD] font-medium flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Question
                </button>
              </div>

              {customQuestions.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="font-medium text-gray-700">Questions Added ({customQuestions.length})</h4>
                  {customQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-start">
                      <div>
                        <div className="font-medium text-[#222222]">Question {idx + 1}</div>
                        <div className="text-sm text-gray-600 mt-1">{q.text}</div>
                        <div className="text-xs text-gray-500 mt-1">{q.type} • {q.maxScore} points</div>
                      </div>
                      <button
                        onClick={() => setCustomQuestions(customQuestions.filter(q2 => q2.id !== q.id))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              onClick={() => setShowCreateAssessment(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Assessment Created',
                  message: 'Your custom assessment has been created successfully!',
                  type: 'success',
                  onConfirm: () => {
                    setShowCreateAssessment(false);
                    setCustomQuestions([]);
                    setConfirmDialog({ isOpen: false });
                  },
                  onClose: () => setConfirmDialog({ isOpen: false })
                });
              }}
              className="px-6 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#6438c2] font-medium"
            >
              Create Assessment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-4">
      {[1, 2, 3, 4].map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              currentStep >= step ? 'bg-[#6A0DAD] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step}
            </div>
            <span className="text-xs mt-2 text-gray-600">
              {step === 1 ? 'Select Job' : step === 2 ? 'Choose Tests' : step === 3 ? 'Configure' : 'Review'}
            </span>
          </div>
          {idx < 3 && (
            <div className={`h-1 w-20 mx-2 transition-all ${
              currentStep > step ? 'bg-[#6A0DAD]' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#222222]">Select Job Position</h2>
        <button className="px-4 py-2 bg-[#6438c2] text-white rounded-lg hover:bg-[#6A0DAD] transition-colors">
          + Create New Job
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search your posted jobs..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
        />
      </div>

      <div className="grid gap-4">
        {postedJobs.map(job => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              selectedJob?.id === job.id
                ? 'border-[#6A0DAD] bg-purple-50'
                : 'border-gray-200 hover:border-[#6438c2]'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#222222]">{job.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <Users size={16} className="mr-1" />
                    {job.applicants} applicants
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {job.status}
                  </span>
                </div>
              </div>
              {selectedJob?.id === job.id && (
                <CheckCircle className="text-[#6A0DAD]" size={24} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => selectedJob && setCurrentStep(2)}
          disabled={!selectedJob}
          className="px-6 py-3 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#6438c2] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Continue to Assessments
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#222222]">Choose Assessment Tests</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateAssessment(true)}
            className="px-4 py-2 bg-[#6438c2] text-white rounded-lg hover:bg-[#6A0DAD] flex items-center gap-2"
          >
            <Plus size={18} />
            Create Custom
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Job:</strong> {selectedJob?.title} | Based on your job description, we've curated the most relevant assessments.
        </p>
      </div>

      <div className="space-y-4">
        {assessmentPools.map(pool => (
          <div key={pool.category} className="border border-gray-200 rounded-xl overflow-hidden">
            <div
              onClick={() => setExpandedCategory(expandedCategory === pool.category ? null : pool.category)}
              className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedCategory === pool.category ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <h3 className="font-semibold text-[#222222]">{pool.category}</h3>
                <span className="px-2 py-1 bg-[#6A0DAD] text-white rounded-full text-xs">
                  {pool.assessments.length}
                </span>
              </div>
            </div>

            {expandedCategory === pool.category && (
              <div className="p-4 space-y-3">
                {pool.assessments.map(assessment => (
                  <div
                    key={assessment.id}
                    onClick={() => handleAssessmentSelect(assessment)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAssessments.find(a => a.id === assessment.id)
                        ? 'border-[#6A0DAD] bg-purple-50'
                        : 'border-gray-200 hover:border-[#6438c2]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-[#222222]">{assessment.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            assessment.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              assessment.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                          }`}>
                            {assessment.difficulty}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            assessment.type === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {assessment.type === 'auto' ? 'Auto-scored' : 'Manual Review'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            {assessment.duration} mins
                          </span>
                          <span>{assessment.questions} questions</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Target size={14} className="text-[#6A0DAD]" />
                          {assessment.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-50 text-[#6438c2] rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedAssessments.find(a => a.id === assessment.id) && (
                        <CheckCircle className="text-[#6A0DAD] flex-shrink-0 ml-4" size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedAssessments.length} assessment{selectedAssessments.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => selectedAssessments.length > 0 && setCurrentStep(3)}
            disabled={selectedAssessments.length === 0}
            className="px-6 py-3 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#6438c2] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Configure Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#222222]">Configure Assessment Settings</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 text-[#222222]">Scoring Options</h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assessmentSettings.autoScore}
                  onChange={(e) => setAssessmentSettings({...assessmentSettings, autoScore: e.target.checked})}
                  className="mt-1 w-5 h-5 text-[#6A0DAD] rounded focus:ring-[#6A0DAD]"
                />
                <div>
                  <div className="font-medium text-[#222222]">Enable Auto-Scoring</div>
                  <div className="text-sm text-gray-600">Automatically score eligible assessments upon submission</div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assessmentSettings.autoDisqualify}
                  onChange={(e) => setAssessmentSettings({...assessmentSettings, autoDisqualify: e.target.checked})}
                  className="mt-1 w-5 h-5 text-[#6A0DAD] rounded focus:ring-[#6A0DAD]"
                />
                <div>
                  <div className="font-medium text-[#222222]">Auto-Disqualify Non-Submissions</div>
                  <div className="text-sm text-gray-600">Automatically disqualify candidates who don't complete the assessment</div>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 text-[#222222]">Deadline Settings</h3>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Submission Window (days)</span>
              <input
                type="number"
                value={assessmentSettings.deadline}
                onChange={(e) => setAssessmentSettings({...assessmentSettings, deadline: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
                min="1"
                max="30"
              />
              <span className="text-xs text-gray-500 mt-1 block">
                Candidates will have {assessmentSettings.deadline} days to complete the assessment
              </span>
            </label>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-[#222222]">Assessment Summary</h3>

          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Target Candidates</div>
              <div className="text-2xl font-bold text-[#6A0DAD]">{selectedJob?.applicants}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Selected Assessments:</div>
              {selectedAssessments.map(assessment => (
                <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-[#222222]">{assessment.name}</span>
                  <span className="text-xs text-gray-600">{assessment.duration}m</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-semibold text-[#222222]">
                  {selectedAssessments.reduce((sum, a) => sum + a.duration, 0)} minutes
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Deadline:</span>
                <span className="font-semibold text-[#222222]">
                  {new Date(Date.now() + assessmentSettings.deadline * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          className="px-6 py-3 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#6438c2] transition-colors font-medium"
        >
          Review & Send
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#222222]">Review & Send Assessment</h2>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Ready to Send</h3>
            <p className="text-sm text-green-800">
              You're about to send {selectedAssessments.length} assessment{selectedAssessments.length !== 1 ? 's' : ''} to {selectedJob?.applicants} candidates for the <strong>{selectedJob?.title}</strong> position.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg text-[#222222]">Assessment Details</h3>
          {selectedAssessments.map((assessment, idx) => (
            <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-[#222222]">{idx + 1}. {assessment.name}</div>
                <div className="text-xs text-gray-600">{assessment.questions} questions • {assessment.duration} mins</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                assessment.type === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {assessment.type === 'auto' ? 'Auto' : 'Manual'}
              </span>
            </div>
          ))}
        </div>

        <div className="border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg text-[#222222]">Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Auto-Scoring:</span>
              <span className="font-medium text-[#222222]">{assessmentSettings.autoScore ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Auto-Disqualify:</span>
              <span className="font-medium text-[#222222]">{assessmentSettings.autoDisqualify ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Deadline:</span>
              <span className="font-medium text-[#222222]">{assessmentSettings.deadline} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Duration:</span>
              <span className="font-medium text-[#222222]">
                {selectedAssessments.reduce((sum, a) => sum + a.duration, 0)} mins
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={() => {
            setConfirmDialog({
              isOpen: true,
              title: 'Assessment Sent Successfully!',
              message: `Assessment has been sent to ${selectedJob?.applicants} candidates. They will be notified via email.`,
              type: 'success',
              onConfirm: () => {
                setActiveTab('review');
                setConfirmDialog({ isOpen: false });
              },
              onClose: () => setConfirmDialog({ isOpen: false })
            });
          }}
          className="px-8 py-3 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#6438c2] transition-colors font-medium flex items-center gap-2"
        >
          <Send size={20} />
          Send to All Candidates
        </button>
      </div>
    </div>
  );

  const renderReviewTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#222222]">Assessment Submissions</h2>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]">
            <option>All Jobs</option>
            <option>Senior Frontend Developer</option>
            <option>Product Manager</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowAnalytics(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-sm text-blue-700 mb-1">Total Sent</div>
          <div className="text-3xl font-bold text-blue-900">247</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-sm text-green-700 mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-900">156</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="text-sm text-orange-700 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-orange-900">23</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-sm text-purple-700 mb-1">Avg Score</div>
          <div className="text-3xl font-bold text-purple-900">78%</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Candidate</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submitted</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {submittedAssessments.map(submission => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-[#222222]">{submission.candidate}</div>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      submission.status === 'passed' ? 'bg-green-100 text-green-700' :
                        submission.status === 'failed' ? 'bg-red-100 text-red-700' :
                          submission.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                    }`}>
                      {submission.status === 'passed' ? <CheckCircle size={14} /> :
                        submission.status === 'failed' ? <XCircle size={14} /> :
                          submission.status === 'flagged' ? <Flag size={14} /> :
                            <AlertCircle size={14} />}
                      {submission.status}
                    </span>
                </td>
                <td className="px-6 py-4">
                  {submission.score !== null ? (
                    <span className="font-semibold text-[#222222]">{submission.score}%</span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{submission.submittedAt}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      submission.autoScored ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {submission.autoScored ? 'Auto' : 'Manual'}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedSubmission(submission);
                      if (!submission.autoScored && submission.status === 'pending') {
                        setShowReviewModal(true);
                      }
                    }}
                    className="text-[#6A0DAD] hover:text-[#6438c2] font-medium text-sm inline-flex items-center gap-1"
                  >
                    <Eye size={16} />
                    {!submission.autoScored && submission.status === 'pending' ? 'Score' : 'Review'}
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />
      <div className="max-w-7xl mx-auto p-6 mt-15">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-2">Assessment Manager</h1>
          <p className="text-gray-600">Create, configure, and review candidate assessments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'create'
                  ? 'text-[#6A0DAD] border-b-2 border-[#6A0DAD] bg-purple-50'
                  : 'text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50'
              }`}
            >
              Create Assessment
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'review'
                  ? 'text-[#6A0DAD] border-b-2 border-[#6A0DAD] bg-purple-50'
                  : 'text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50'
              }`}
            >
              Review Submissions
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'create' ? (
              <>
                {renderStepIndicator()}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </>
            ) : (
              renderReviewTab()
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog {...confirmDialog} />
      <ReviewModal />
      <AnalyticsModal />
      <CreateCustomAssessmentModal />
    </div>
  );
};

export default EmployerAssessmentPage;
