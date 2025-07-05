import React, { useState } from "react";
import { UserType } from "../../utils/enums.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { USER_TYPE } from "../../utils/helpers.ts";
import MainFooter from "../../components/layouts/MainFooter.tsx";

const HelpAndSupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      answer:
        "Creating your GigHub profile is simple! Click 'Sign Up' and choose between Job Seeker or Employer. Fill in your basic information, upload your resume or company details, and you're ready to start. Our onboarding wizard will guide you through each step.",
      popularity: 95,
    },
    {
      id: 2,
      category: "auto-apply",
      question: "How does Auto Apply work?",
      answer:
        "Auto Apply uses advanced AI to match your profile with relevant job opportunities and automatically submits applications on your behalf. You can set preferences for job types, locations, salary ranges, and companies. The system personalizes each application with custom cover letters.",
      popularity: 90,
    },
    {
      id: 3,
      category: "job-search",
      question: "How can I improve my job matching results?",
      answer:
        "To get better job matches: 1) Complete your profile 100%, 2) Add relevant skills and certifications, 3) Upload an updated resume, 4) Set accurate preferences for location, salary, and job type, 5) Keep your profile active by logging in regularly.",
      popularity: 88,
    },
    {
      id: 4,
      category: "billing",
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes! You can cancel your subscription at any time from your account settings. Your current plan will remain active until the end of your billing period. We also offer a 7-day free trial for new users with no commitment required.",
      popularity: 85,
    },
    {
      id: 5,
      category: "networking",
      question: "How do I connect with professionals in my industry?",
      answer:
        "Use our networking features to find professionals by industry, company, or location. Send connection requests with personalized messages, join industry groups, participate in discussions, and attend virtual networking events hosted on our platform.",
      popularity: 82,
    },
    {
      id: 6,
      category: "profile",
      question: "What makes a strong GigHub profile?",
      answer:
        "A strong profile includes: Professional photo, compelling headline, detailed work experience, relevant skills, portfolio samples, recommendations from colleagues, active participation in discussions, and regular profile updates.",
      popularity: 80,
    },
    {
      id: 7,
      category: "auto-apply",
      question: "How many applications does Auto Apply send per day?",
      answer:
        "Auto Apply can send up to 200 applications per day based on your plan. The system intelligently paces applications to avoid overwhelming you and ensures each application meets your specified criteria and quality standards.",
      popularity: 78,
    },
    {
      id: 8,
      category: "job-search",
      question: "Can I track my application status?",
      answer:
        "Yes! Your dashboard shows all applications with real-time status updates. You can see which applications are pending, viewed, or have received responses. We also provide analytics on your application success rate and suggestions for improvement.",
      popularity: 75,
    },
  ];

  const tutorials = [
    {
      title: "Complete Profile Setup",
      duration: "5 min",
      views: "12.5K",
      thumbnail: "🎯",
    },
    {
      title: "Mastering Auto Apply",
      duration: "8 min",
      views: "8.2K",
      thumbnail: "🤖",
    },
    {
      title: "Networking Like a Pro",
      duration: "12 min",
      views: "6.8K",
      thumbnail: "🤝",
    },
    {
      title: "Resume Optimization Tips",
      duration: "10 min",
      views: "9.1K",
      thumbnail: "📄",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccessMessage(true);
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "medium",
    });

    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "demo":
        alert("Demo scheduling feature would open here!");
        break;
      case "chat":
        alert("Live chat would open here!");
        break;
      case "tutorials":
        alert("Video tutorial library would open here!");
        break;
      case "forum":
        alert("Community forum would open here!");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F7F7] to-[#E8E8FF]">
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
      ) : (
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              GigHub Help Center
            </h1>
            <p className="mb-8 text-xl opacity-90 md:text-2xl">
              Get the support you need to succeed in your career journey
            </p>

            {/* Search Bar */}
            <div className="relative mx-auto mb-8 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, tutorials, or FAQs..."
                className="w-full rounded-full px-6 py-4 text-lg text-gray-800 shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none"
              />
              <div className="absolute top-1/2 right-4 -translate-y-1/2 transform text-xl text-gray-400">
                🔍
              </div>
            </div>

            {/* Quick Stats */}
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

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column - Categories & FAQs */}
          <div className="lg:col-span-2">
            {/* Categories */}
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
                        ? "bg-[#6438C2] text-white shadow-lg"
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

            {/* FAQs */}
            <div className="mb-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-800">
                Frequently Asked Questions
                {selectedCategory !== "all" && (
                  <span className="ml-2 text-lg font-normal text-gray-600">
                    - {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                )}
              </h3>

              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-lg bg-white shadow-md"
                  >
                    <div
                      onClick={() =>
                        setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                      }
                      className="cursor-pointer p-6 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="pr-4 text-lg font-semibold text-gray-800">
                          {faq.question}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <span>👍</span>
                            <span>{faq.popularity}%</span>
                          </div>
                          <div
                            className={`transform transition-transform duration-200 ${
                              expandedFaq === faq.id ? "rotate-180" : ""
                            }`}
                          >
                            ⌄
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedFaq === faq.id && (
                      <div className="border-t border-gray-100 px-6 pb-6">
                        <div className="pt-4 leading-relaxed text-gray-700">
                          {faq.answer}
                        </div>
                        <div className="mt-4 flex gap-4">
                          <button className="text-sm text-[#6438C2] hover:underline">
                            Was this helpful? 👍
                          </button>
                          <button className="text-sm text-gray-500 hover:underline">
                            👎 Not helpful
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <div className="mb-4 text-4xl">🔍</div>
                  <h4 className="mb-2 text-xl font-semibold">
                    No results found
                  </h4>
                  <p>
                    Try adjusting your search or browse different categories
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact & Resources */}
          <div className="space-y-8">
            {/* Contact Form */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-bold text-gray-800">
                Contact Support
              </h3>

              {showSuccessMessage && (
                <div className="mb-6 rounded-lg border border-green-400 bg-green-100 p-4 text-green-700">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>
                      Your message has been sent! We'll get back to you within
                      24 hours.
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </div>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#6438C2]"
                  />
                </div>

                <div>
                  <div className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </div>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#6438C2]"
                  />
                </div>

                <div>
                  <div className="mb-2 block text-sm font-medium text-gray-700">
                    Priority
                  </div>
                  <select
                    value={contactForm.priority}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        priority: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#6438C2]"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Account issue</option>
                    <option value="high">High - Billing problem</option>
                    <option value="urgent">
                      Urgent - Can't access account
                    </option>
                  </select>
                </div>

                <div>
                  <div className="mb-2 block text-sm font-medium text-gray-700">
                    Subject
                  </div>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#6438C2]"
                  />
                </div>

                <div>
                  <div className="mb-2 block text-sm font-medium text-gray-700">
                    Message
                  </div>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#6438C2]"
                  />
                </div>

                <button
                  onClick={handleContactSubmit}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#6438C2] py-3 font-semibold text-white transition-colors duration-300 hover:bg-purple-700"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-bold text-gray-800">
                Popular Tutorials
              </h3>
              <div className="space-y-4">
                {tutorials.map((tutorial, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <div className="text-2xl">{tutorial.thumbnail}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {tutorial.title}
                      </h4>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>⏱️ {tutorial.duration}</span>
                        <span>👁️ {tutorial.views} views</span>
                      </div>
                    </div>
                    <div className="text-[#6438C2]">▶️</div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 font-semibold text-[#6438C2] hover:underline">
                View All Tutorials →
              </button>
            </div>

            {/* Status Page */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">GigHub Platform</span>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-600">
                      Operational
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Auto Apply Service</span>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-600">
                      Operational
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Networking Features</span>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium text-yellow-600">
                      Minor Issues
                    </span>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full py-2 font-semibold text-[#6438C2] hover:underline">
                View Status Page →
              </button>
            </div>
          </div>
        </div>
      </div>
      <MainFooter/>
    </div>
  );
};

export default HelpAndSupportPage;
