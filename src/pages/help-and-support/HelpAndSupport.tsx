import React, { ReactNode, useState } from "react";
import { USER_TYPE } from "../../utils/helpers.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  employerNavBarItemMap,
} from "../../utils/constants.ts";
import { UserType } from "../../utils/enums.ts";
import {submitDemoRequest} from "../../services/api";
import { toast } from "react-toastify";
import {useGetAllTutorials} from "../../hooks/useTutorials.ts";
import {TutorialResponse} from "../../utils/types";

const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};


const HelpAndSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<any>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: Priority.MEDIUM,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Modal states
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showTutorialsModal, setShowTutorialsModal] = useState(false);
  const [showForumModal, setShowForumModal] = useState(false);

  // Demo form state
  const [demoForm, setDemoForm] = useState<{
    name: string,
    email: string,
    company: string,
    phone: string,
    preferredDate: string,
    preferredTime: string,
    interests: any[]
  }>({
    name: "",
    email: "",
    company: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    interests: []
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: "support", text: "Hello! How can I help you today?", time: new Date() }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Forum state
  const [forumPosts,] = useState([
    {
      id: 1,
      author: "Sarah Johnson",
      title: "Best practices for Auto Apply settings?",
      excerpt: "I've been using Auto Apply for a week and getting mixed results...",
      replies: 23,
      likes: 45,
      category: "Auto Apply",
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "Mike Chen",
      title: "How to optimize profile for remote work?",
      excerpt: "Looking for tips on making my profile stand out for remote positions...",
      replies: 15,
      likes: 32,
      category: "Profile Tips",
      time: "5 hours ago"
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      title: "Networking tips for career changers",
      excerpt: "I'm transitioning from marketing to UX design. Any advice?",
      replies: 18,
      likes: 28,
      category: "Networking",
      time: "1 day ago"
    }
  ]);

  const categories = [
    { id: "all", name: "All Topics", icon: "📚", count: 47 },
    { id: "getting-started", name: "Getting Started", icon: "🚀", count: 8 },
    { id: "job-search", name: "Job Search", icon: "🔍", count: 12 },
    { id: "auto-apply", name: "Auto Apply", icon: "🤖", count: 9 },
    { id: "networking", name: "Networking", icon: "🤝", count: 7 },
    { id: "profile", name: "Profile & Resume", icon: "👤", count: 6 },
    { id: "billing", name: "Billing & Plans", icon: "💳", count: 5 },
  ];

  const quickActions = [
    {
      title: "Schedule a Demo",
      description: "Get a personalized walkthrough of GigHub's features",
      icon: "🎥",
      action: "demo",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Chat with Support",
      description: "Get instant help from our support team",
      icon: "💬",
      action: "chat",
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides and tutorials",
      icon: "📹",
      action: "tutorials",
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Community Forum",
      description: "Connect with other GigHub users and experts",
      icon: "👥",
      action: "forum",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I create my GigHub profile?",
      answer: "Creating your GigHub profile is simple! Click 'Sign Up' and choose between Job Seeker or Employer. Fill in your basic information, upload your resume or company details, and you're ready to start.",
      popularity: 95,
    },
    {
      id: 2,
      category: "auto-apply",
      question: "How does Auto Apply work?",
      answer: "Auto Apply uses advanced AI to match your profile with relevant job opportunities and automatically submits applications on your behalf. You can set preferences for job types, locations, salary ranges, and companies.",
      popularity: 90,
    },
    {
      id: 3,
      category: "job-search",
      question: "How can I improve my job matching results?",
      answer: "To get better job matches: 1) Complete your profile 100%, 2) Add relevant skills and certifications, 3) Upload an updated resume, 4) Set accurate preferences for location, salary, and job type.",
      popularity: 88,
    }
  ];
const tutorialData = [
  {
    id: 1,
    title: "Complete Profile Setup",
    duration: "5 min",
    views: "12.5K",
    thumbnail: "🎯",
    videoUrl: "#",
    description: "Learn how to set up your profile for maximum visibility and engagement."
  },
  {
    id: 2,
    title: "Mastering Auto Apply",
    duration: "8 min",
    views: "8.2K",
    thumbnail: "🤖",
    videoUrl: "#",
    description: "Discover how to configure Auto Apply settings for best results."
  },
  {
    id: 3,
    title: "Networking Like a Pro",
    duration: "12 min",
    views: "6.8K",
    thumbnail: "🤝",
    videoUrl: "#",
    description: "Master the art of professional networking on GigHub."
  },
  {
    id: 4,
    title: "Resume Optimization Tips",
    duration: "10 min",
    views: "9.1K",
    thumbnail: "📄",
    videoUrl: "#",
    description: "Optimize your resume to stand out to employers and recruiters."
  }
];
const {data: getTuts} = useGetAllTutorials();
  const tutorials = (getTuts?.data?.length || 0) > 0 ? getTuts?.data as TutorialResponse[] : tutorialData as TutorialResponse[];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: Priority.MEDIUM,
      });
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "demo":
        setShowDemoModal(true);
        break;
      case "chat":
        setShowChatModal(true);
        break;
      case "tutorials":
        setShowTutorialsModal(true);
        break;
      case "forum":
        setShowForumModal(true);
        break;
    }
  };

  const handleDemoSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      const res = await submitDemoRequest(demoForm);
      if (res.statusCode === 201) {
        toast.success("Request submitted successfully");
        setShowDemoModal(false);
        setDemoForm({
          name: "",
          email: "",
          company: "",
          phone: "",
          preferredDate: "",
          preferredTime: "",
          interests: [],
        });
      }
    } catch (e: any) {
      console.log(e);
      toast.error("Error submitting request");
    }
  };

  const handleChatSend = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, {
        sender: "user",
        text: chatInput,
        time: new Date()
      }]);
      setChatInput("");

      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          sender: "support",
          text: "Thanks for your message! A support agent will respond shortly.",
          time: new Date()
        }]);
      }, 1000);
    }
  };

  const Modal: React.FC<{isOpen: boolean, onClose: ()=>void, title: string, children: ReactNode}> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navbarItemsMap={employerNavBarItemMap}
          userType={"employer"}
        />
      ) : (
        <TopNavBar
          navbarItemsMap={applicantNavBarItemMap}
          userType={"applicant"}
        />
      )}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              GigHub Help Center
            </h1>
            <p className="mb-8 text-xl opacity-90 md:text-2xl">
              Get the support you need to succeed in your career journey
            </p>

            <div className="relative mx-auto mb-8 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, tutorials, or FAQs..."
                className="w-full rounded-full px-6 py-4 text-lg text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 transform text-xl text-gray-400">
                🔍
              </div>
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-75">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2 min</div>
                <div className="text-sm opacity-75">Average Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm opacity-75">Issue Resolution</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
            Quick Actions
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className={`bg-gradient-to-br ${action.color} transform cursor-pointer rounded-xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="mb-4 text-4xl">{action.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-800">
                Browse by Topic
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`cursor-pointer rounded-lg p-4 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-white shadow-md hover:bg-gray-50 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-semibold">{category.name}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-sm ${
                          selectedCategory === category.id
                            ? "bg-white/20"
                            : "bg-gray-100"
                        }`}
                      >
                        {category.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-800">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-lg bg-white shadow-md"
                  >
                    <div
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="cursor-pointer p-6 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="pr-4 text-lg font-semibold text-gray-800">
                          {faq.question}
                        </h4>
                        <div
                          className={`transform transition-transform duration-200 ${
                            expandedFaq === faq.id ? "rotate-180" : ""
                          }`}
                        >
                          ⌄
                        </div>
                      </div>
                    </div>
                    {expandedFaq === faq.id && (
                      <div className="border-t border-gray-100 px-6 pb-6">
                        <div className="pt-4 leading-relaxed text-gray-700">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-bold text-gray-800">
                Contact Support
              </h3>
              {showSuccessMessage && (
                <div className="mb-6 rounded-lg border border-green-400 bg-green-100 p-4 text-green-700">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Message sent! We'll respond within 24 hours.</span>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <button
                  onClick={handleContactSubmit}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition-colors duration-300 hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <Modal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} title="Schedule a Demo">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                value={demoForm.name}
                onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value={demoForm.email}
                onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={demoForm.company}
                onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={demoForm.phone}
                onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Preferred Date *</label>
              <input
                type="date"
                value={demoForm.preferredDate}
                onChange={(e) => setDemoForm({ ...demoForm, preferredDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Preferred Time *</label>
              <select
                value={demoForm.preferredTime}
                onChange={(e) => setDemoForm({ ...demoForm, preferredTime: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select a time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">What features are you most interested in?</label>
            <div className="space-y-2">
              {["Auto Apply", "Job Matching", "Networking", "Resume Builder", "Analytics"].map((interest) => (
                <label key={interest} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoForm.interests.includes(interest)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDemoForm({ ...demoForm, interests: [...demoForm.interests, interest] });
                      } else {
                        setDemoForm({ ...demoForm, interests: demoForm.interests.filter(i => i !== interest) });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleDemoSubmit}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700"
          >
            Schedule Demo
          </button>
        </div>
      </Modal>

      {/* Chat Modal */}
      <Modal isOpen={showChatModal} onClose={() => setShowChatModal(false)} title="Chat with Support">
        <div className="flex h-[500px] flex-col">
          <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-lg bg-gray-50 p-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleChatSend}
              className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>
      </Modal>

      {/* Tutorials Modal */}
      <Modal isOpen={showTutorialsModal} onClose={() => setShowTutorialsModal(false)} title="Video Tutorials">
        <div className="grid gap-6 md:grid-cols-2">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg">
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-orange-100 text-6xl">
                {tutorial.thumbnail}
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-800">{tutorial.title}</h4>
              <p className="mb-3 text-sm text-gray-600">{tutorial.description}</p>
              <div className="mb-3 flex gap-4 text-sm text-gray-500">
                <span>⏱️ {tutorial.duration}</span>
                <span>👁️ {tutorial.views} views</span>
              </div>
              <button className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white hover:bg-purple-700">
                ▶️ Watch Now
              </button>
            </div>
          ))}
        </div>
      </Modal>

      {/* Forum Modal */}
      <Modal isOpen={showForumModal} onClose={() => setShowForumModal(false)} title="Community Forum">
        <div className="mb-6">
          <button className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700">
            ➕ Create New Post
          </button>
        </div>
        <div className="space-y-4">
          {forumPosts.map((post) => (
            <div key={post.id} className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold text-gray-800">{post.author}</span>
                <span className="text-sm text-gray-500">• {post.time}</span>
                <span className="ml-auto rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-600">
                  {post.category}
                </span>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">{post.title}</h4>
              <p className="mb-4 text-gray-600">{post.excerpt}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>💬 {post.replies} replies</span>
                <span>👍 {post.likes} likes</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default HelpAndSupportPage;