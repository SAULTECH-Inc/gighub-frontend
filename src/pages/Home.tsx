import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Star,
  Filter,
  CheckCircle,
  ArrowRight,
  User,
  Target,
  Rocket,
  Gift,
  Zap,
  Award,
  UserPlus,
  Loader,
  Check
} from "lucide-react";
import { getAllActiveCompanies, getAllCategories, getJobsCount, getUserCount } from "../services/api";
import useFetchFeaturedJobs from "../hooks/useFetchFeaturedJobs.ts";
import useFetchCategories from "../hooks/useFetchCategories.ts";
import { usePlatform } from "../store/usePlatform.ts";

// Success Toast Component
const SuccessToast = ({ show, onClose }: { show: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold">Success!</h4>
          <p className="text-sm opacity-90">You're now on the waitlist. We'll notify you at launch!</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-xl leading-none"
        >
          ×
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

// Data availability checker
const useDataAvailability = () => {
  const [dataState, setDataState] = useState<{
    jobs: number,
    users: number,
    companies: number,
    categories: number,
    isLoading: boolean,
    hasContent: boolean
  }>({
    jobs: 0,
    users: 0,
    companies: 0,
    categories: 0,
    isLoading: true,
    hasContent: false
  });

  useEffect(() => {
    // Simulate API calls to check data availability
    const checkDataAvailability = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock API responses - replace with actual API calls
        const [jobsResponse, usersResponse, companiesResponse, categoriesResponse] = await Promise.all([
          getJobsCount(),
          getUserCount(),
          getAllActiveCompanies(),
          getAllCategories(),

          // Mock responses for demo - replace with actual API calls
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 1247 }), // Sometimes 0, sometimes has data
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 15420 }),
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 284 }),
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 8 })
        ]);

        const jobs = jobsResponse?.data || 0;
        const users = usersResponse.data || 0;
        const companies = companiesResponse.data || 0;
        const categories = categoriesResponse.data || 0;

        // Determine if we have enough content to show the full platform
        const hasContent = jobs > 0 && companies > 0 && categories > 0;

        setDataState({
          jobs,
          users,
          companies,
          categories,
          isLoading: false,
          hasContent
        });

      } catch (error) {
        console.error('Error checking data availability:', error);
        setDataState(prev => ({
          ...prev,
          isLoading: false,
          hasContent: false
        }));
      }
    };

    checkDataAvailability().then(r=>r);
  }, []);

  return dataState;
};

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6 mx-auto">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading GigHub</h1>
      <p className="text-gray-600">Checking for the latest opportunities...</p>
    </div>
  </div>
);

// Full Platform Component (when data is available)
const FullPlatformHome: React.FC<{data: {
    jobs: number,
    users: number,
    companies: number,
    categories: number,
    isLoading: boolean,
    hasContent: boolean
  }}> = ({ data }) => {
  const [email, setEmail] = useState("");
  const [, setSelectedCategory] = useState<number | null>(null);
  const [, setCurrentTestimonial] = useState(0);
  const {data: FeaturedJobResponse, refetch: prefetchFeaturedJobs} = useFetchFeaturedJobs(8);
  const {data: CategoriesResponse, refetch: prefetchCategories} = useFetchCategories();

  useEffect(() => {
    prefetchFeaturedJobs().then(r=>r);
    prefetchCategories().then(r=>r);
  }, []);

  // Mock data for full platform - replace with actual data from props
  const mockTestimonials = [
    {
      id: 1,
      name: "Adebayo Johnson",
      role: "Software Engineer",
      company: "Paystack",
      image: "👨‍💻",
      content: "GigHub's AI matching helped me find my dream job in just 2 weeks. The auto-apply feature saved me hours!",
      rating: 5
    },
    {
      id: 2,
      name: "Fatima Usman",
      role: "UX Designer",
      company: "Flutterwave",
      image: "👩‍🎨",
      content: "The AI profile optimization suggestions were spot-on. I got 3x more interview calls!",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % mockTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GigHub
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Jobs</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Companies</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="hidden sm:block text-gray-600 hover:text-blue-600 transition-colors">
              Sign In
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 sm:py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Job Matching</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Your Dream Job
            <br />
            <span className="text-blue-600">With AI Precision</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of job hunting with AI-powered matching, auto-apply features, and intelligent profile optimization
          </motion.p>

          {/* Enhanced Search Bar */}
          <motion.div
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-8 sm:mb-12 mx-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                  <option>All Categories</option>
                  <option>Remote</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                </select>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search Jobs</span>
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </motion.div>

          {/* Real-time Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{data.jobs.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{data.companies.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600">Companies Hiring</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{Math.floor(data.users * 0.64).toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600">Successful Hires</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">₦2.8M</div>
              <div className="text-xs sm:text-sm text-gray-600">Avg. Salary</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">AI-Powered Features</h2>
            <p className="text-lg sm:text-xl text-gray-600">Experience the future of job searching</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">Smart Job Matching</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Our AI analyzes your profile and matches you with jobs that fit your skills, experience, and preferences with 95% accuracy.</p>
              <div className="flex items-center text-blue-600 font-medium text-sm sm:text-base">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">Auto Apply</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Let AI apply to relevant jobs for you automatically. Save time while increasing your chances of landing interviews.</p>
              <div className="flex items-center text-green-600 font-medium text-sm sm:text-base">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">Profile Optimization</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Get AI-powered suggestions to optimize your profile and increase visibility to top recruiters and employers.</p>
              <div className="flex items-center text-purple-600 font-medium text-sm sm:text-base">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-10 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore Job Categories</h2>
            <p className="text-lg sm:text-xl text-gray-600">Find opportunities in your field</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {CategoriesResponse?.statusCode === 200 && CategoriesResponse?.data?.map((category, index) => (
              <motion.div
                key={category.id}
                className="bg-white rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${category.color} rounded-xl flex items-center justify-center mb-4 text-xl sm:text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="font-bold mb-2 text-sm sm:text-base">{category.name}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{category.count} jobs available</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Jobs</h2>
              <p className="text-lg sm:text-xl text-gray-600">Hand-picked opportunities for you</p>
            </div>
            <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              View All Jobs
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FeaturedJobResponse?.statusCode === 200 && FeaturedJobResponse?.data?.map((job, index) => (
              <motion.div
                key={job.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                      {job.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">{job.company}</h3>
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.match >= 90 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {job.match}% match
                    </span>
                    {job.isRemote && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                        Remote
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold mb-2">{job.title}</h2>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-600 font-bold text-sm sm:text-base">{job.salary}</span>
                  <span className="text-gray-600 text-xs sm:text-sm">{job.type}</span>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {job.posted}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {job.applicants} applicants
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Ahead of the Job Market</h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
              Get personalized job alerts, industry insights, and career tips delivered to your inbox
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none text-sm sm:text-base"
              />
              <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Launch State Component (when no data is available)
const LaunchStateHome: React.FC<{data: {
    jobs: number,
    users: number,
    companies: number,
    categories: number,
    isLoading: boolean,
    hasContent: boolean
  }}> = ({ data }) => {
  const [email, setEmail] = useState("");
  const {isSubscribed, subscribe} = usePlatform();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [userCount, setUserCount] = useState(data.users || 2847);
  const [launchCountdown, setLaunchCountdown] = useState({
    days: 7,
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  // Handle waitlist subscription with success feedback
  const handleSubscribe = async (emailToSubscribe: string) => {
    if (!emailToSubscribe || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await subscribe(emailToSubscribe);
      setEmail("");
      setShowSuccess(true);
      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Launch incentives
  const launchIncentives = [
    {
      id: 1,
      title: "Free Premium for 6 Months",
      description: "First 1000 users get premium features completely free",
      icon: "🎁",
      remaining: 847,
      total: 1000
    },
    {
      id: 2,
      title: "Early Bird Job Alerts",
      description: "Get notified first when companies start posting",
      icon: "🚨",
      remaining: 1500,
      total: 1500
    },
    {
      id: 3,
      title: "Founding Member Badge",
      description: "Special recognition as a platform pioneer",
      icon: "🏆",
      remaining: 2000,
      total: 2000
    }
  ];

  // Beta testimonials
  const betaTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Beta Tester",
      company: "Early Access Program",
      image: "👩‍💼",
      content: "The AI matching algorithm is incredibly accurate. I can't wait for companies to start posting jobs!",
      rating: 5,
      badge: "Beta Tester"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      company: "Beta Program",
      image: "👨‍💻",
      content: "Finally, a job platform that understands what I'm looking for. The profile builder is genius!",
      rating: 5,
      badge: "Beta Tester"
    }
  ];

  // Simulate growing user count
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev: number) => prev + Math.floor(Math.random() * 3) + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunchCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % betaTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Success Toast */}
      <SuccessToast show={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* Launch Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GigHub
              </span>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-bold">
                LAUNCHING SOON
              </span>
            </div>

            <div className="md:hidden">
              {isSubscribed ? (
                <button
                  disabled={true}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-75">
                  ✓ Joined
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm disabled:opacity-50">
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center justify-center space-x-6 bg-gray-900 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Full Launch In:</span>
              <div className="flex space-x-2">
                <div className="text-center">
                  <div className="text-lg font-bold">{launchCountdown.days}</div>
                  <div className="text-xs">DAYS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{launchCountdown.hours}</div>
                  <div className="text-xs">HRS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{launchCountdown.minutes}</div>
                  <div className="text-xs">MIN</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{launchCountdown.seconds}</div>
                  <div className="text-xs">SEC</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              {isSubscribed ? (
                <button
                  disabled={true}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 cursor-not-allowed opacity-75">
                  ✓ Joined
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Launch Focus */}
      <section className="relative overflow-hidden py-10 sm:py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            className="inline-flex items-center space-x-2 bg-green-100 text-green-600 px-4 py-2 rounded-full mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-medium">We're Launching Soon!</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Future of Job Search
            <br />
            <span className="text-blue-600">Starts Here</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Be among the first to experience AI-powered job matching. Join {userCount.toLocaleString()} professionals already waiting for launch.
          </motion.p>

          {/* Early Access Form - Only show if not subscribed */}
          {!isSubscribed && (
            <motion.div
              className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 sm:mb-12 mx-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Get Early Access</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Be the first to know when we launch and get exclusive benefits</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  disabled={isSubmitting}
                />
                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting || !email}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  <span>{isSubmitting ? 'Joining...' : 'Join Waitlist'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center mt-6 space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Early access perks
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  No spam, ever
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Exclusive updates
                </div>
              </div>
            </motion.div>
          )}

          {/* Launch Stats */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{userCount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600">On Waitlist</div>
              <div className="text-xs text-green-600 mt-1">↗ Growing daily</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">50+</div>
              <div className="text-xs sm:text-sm text-gray-600">Companies Ready</div>
              <div className="text-xs text-green-600 mt-1">↗ More joining</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">1000+</div>
              <div className="text-xs sm:text-sm text-gray-600">Jobs Coming</div>
              <div className="text-xs text-green-600 mt-1">↗ At launch</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">95%</div>
              <div className="text-xs sm:text-sm text-gray-600">AI Accuracy</div>
              <div className="text-xs text-blue-600 mt-1">✓ Beta tested</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Launch Incentives */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Early Bird Benefits</h2>
            <p className="text-lg sm:text-xl text-gray-600">Limited-time offers for our founding members</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {launchIncentives.map((incentive, index) => (
              <motion.div
                key={incentive.id}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl sm:text-6xl mb-4">{incentive.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">{incentive.title}</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">{incentive.description}</p>

                <div className="bg-white rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Available</span>
                    <span>{incentive.remaining}/{incentive.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(incentive.remaining / incentive.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting || isSubscribed}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubscribed ? 'Already Claimed' : 'Claim This Offer'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Testimonials */}
      <section className="py-10 sm:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Beta Testers Say</h2>
            <p className="text-lg sm:text-xl text-gray-300">Real feedback from early users testing the platform</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="text-center px-4"
              >
                <div className="text-5xl sm:text-6xl mb-6">{betaTestimonials[currentTestimonial].image}</div>
                <div className="flex justify-center mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                    {betaTestimonials[currentTestimonial].badge}
                  </span>
                </div>
                <blockquote className="text-xl sm:text-2xl leading-relaxed mb-8 italic">
                  "{betaTestimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex justify-center mb-4">
                  {[...Array(betaTestimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-lg font-bold">{betaTestimonials[currentTestimonial].name}</div>
                <div className="text-gray-300">{betaTestimonials[currentTestimonial].role}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Final CTA - Only show if not subscribed */}
      {!isSubscribed && (
        <section className="py-10 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Don't Miss the Launch</h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 px-4">
              Join {userCount.toLocaleString()} professionals ready to transform their careers
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6 sm:mb-8 px-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none text-sm sm:text-base"
                disabled={isSubmitting}
              />
              <button
                onClick={() => handleSubscribe(email)}
                disabled={isSubmitting || !email}
                className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm opacity-75 px-4">
              <div className="flex items-center">
                <Gift className="w-4 h-4 mr-2" />
                Early access perks
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                AI-powered matching
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Founding member status
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Main Dynamic Component
const HomeComponent = () => {
  const dataState: {
    jobs: number,
    users: number,
    companies: number,
    categories: number,
    isLoading: boolean,
    hasContent: boolean
  } = useDataAvailability();

  if (dataState.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      {dataState.hasContent ? (
        <motion.div
          key="full-platform"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FullPlatformHome data={dataState} />
        </motion.div>
      ) : (
        <motion.div
          key="launch-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LaunchStateHome data={dataState} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(HomeComponent);
