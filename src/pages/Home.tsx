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
  Check,
} from "lucide-react";
import {
  getAllActiveCompanies,
  getAllCategories,
  getJobsCount,
  getUserCount,
} from "../services/api";
import useFetchFeaturedJobs from "../hooks/useFetchFeaturedJobs.ts";
import useFetchCategories from "../hooks/useFetchCategories.ts";
import { usePlatform } from "../store/usePlatform.ts";

// Success Toast Component
const SuccessToast = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 right-4 z-50 flex max-w-sm items-center space-x-3 rounded-lg bg-green-500 px-6 py-4 text-white shadow-lg"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <Check className="h-5 w-5 text-green-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold">Success!</h4>
          <p className="text-sm opacity-90">
            You're now on the waitlist. We'll notify you at launch!
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xl leading-none text-white hover:text-gray-200"
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
    jobs: number;
    users: number;
    companies: number;
    categories: number;
    isLoading: boolean;
    hasContent: boolean;
  }>({
    jobs: 0,
    users: 0,
    companies: 0,
    categories: 0,
    isLoading: true,
    hasContent: false,
  });

  useEffect(() => {
    // Simulate API calls to check data availability
    const checkDataAvailability = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock API responses - replace with actual API calls
        const [
          jobsResponse,
          usersResponse,
          companiesResponse,
          categoriesResponse,
        ] = await Promise.all([
          getJobsCount(),
          getUserCount(),
          getAllActiveCompanies(),
          getAllCategories(),

          // Mock responses for demo - replace with actual API calls
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 1247 }), // Sometimes 0, sometimes has data
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 15420 }),
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 284 }),
          Promise.resolve({ count: Math.random() > 0.5 ? 0 : 8 }),
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
          hasContent,
        });
      } catch (error) {
        console.error("Error checking data availability:", error);
        setDataState((prev) => ({
          ...prev,
          isLoading: false,
          hasContent: false,
        }));
      }
    };

    checkDataAvailability().then((r) => r);
  }, []);

  return dataState;
};

// Loading Component
const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
        <Loader className="h-8 w-8 animate-spin text-white" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Loading GigHub</h1>
      <p className="text-gray-600">Checking for the latest opportunities...</p>
    </div>
  </div>
);

// Full Platform Component (when data is available)
const FullPlatformHome: React.FC<{
  data: {
    jobs: number;
    users: number;
    companies: number;
    categories: number;
    isLoading: boolean;
    hasContent: boolean;
  };
}> = ({ data }) => {
  const [email, setEmail] = useState("");
  const [, setSelectedCategory] = useState<number | null>(null);
  const [, setCurrentTestimonial] = useState(0);
  const { data: FeaturedJobResponse, refetch: prefetchFeaturedJobs } =
    useFetchFeaturedJobs(8);
  const { data: CategoriesResponse, refetch: prefetchCategories } =
    useFetchCategories();

  useEffect(() => {
    prefetchFeaturedJobs().then((r) => r);
    prefetchCategories().then((r) => r);
  }, []);

  // Mock data for full platform - replace with actual data from props
  const mockTestimonials = [
    {
      id: 1,
      name: "Adebayo Johnson",
      role: "Software Engineer",
      company: "Paystack",
      image: "👨‍💻",
      content:
        "GigHub's AI matching helped me find my dream job in just 2 weeks. The auto-apply feature saved me hours!",
      rating: 5,
    },
    {
      id: 2,
      name: "Fatima Usman",
      role: "UX Designer",
      company: "Flutterwave",
      image: "👩‍🎨",
      content:
        "The AI profile optimization suggestions were spot-on. I got 3x more interview calls!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % mockTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <span className="font-bold text-white">G</span>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              GigHub
            </span>
          </div>

          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Jobs
            </a>
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Companies
            </a>
            <a
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              About
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="hidden text-gray-600 transition-colors hover:text-blue-600 sm:block">
              Sign In
            </button>
            <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm text-white transition-all duration-300 hover:shadow-lg sm:px-6 sm:text-base">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 sm:py-20">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            className="mb-6 inline-flex items-center space-x-2 rounded-full bg-blue-100 px-4 py-2 text-blue-600 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Job Matching</span>
          </motion.div>

          <motion.h1
            className="mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text px-2 text-4xl font-bold text-transparent sm:text-5xl md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Your Dream Job
            <br />
            <span className="text-blue-600">With AI Precision</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-6 max-w-2xl px-4 text-lg text-gray-600 sm:mb-8 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of job hunting with AI-powered matching,
            auto-apply features, and intelligent profile optimization
          </motion.p>

          {/* Enhanced Search Bar */}
          <motion.div
            className="mx-4 mx-auto mb-8 max-w-4xl rounded-2xl bg-white p-4 shadow-xl sm:mb-12 sm:p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords..."
                  className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-base"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-base"
                />
              </div>
              <div className="relative">
                <Filter className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <select className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-base">
                  <option>All Categories</option>
                  <option>Remote</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                </select>
              </div>
              <button className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm text-white transition-all duration-300 hover:shadow-lg sm:text-base">
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search Jobs</span>
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </motion.div>

          {/* Real-time Stats */}
          <motion.div
            className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 sm:gap-6 md:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                {data.jobs.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Active Jobs
              </div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-green-600 sm:text-2xl">
                {data.companies.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Companies Hiring
              </div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-purple-600 sm:text-2xl">
                {Math.floor(data.users * 0.64).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Successful Hires
              </div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-orange-600 sm:text-2xl">
                ₦2.8M
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Avg. Salary
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="bg-white py-10 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              AI-Powered Features
            </h2>
            <p className="text-lg text-gray-600 sm:text-xl">
              Experience the future of job searching
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 transition-all duration-300 hover:shadow-xl sm:p-8"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 sm:mb-6 sm:h-16 sm:w-16">
                <Target className="h-6 w-6 text-white sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-4 text-lg font-bold sm:text-xl">
                Smart Job Matching
              </h3>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                Our AI analyzes your profile and matches you with jobs that fit
                your skills, experience, and preferences with 95% accuracy.
              </p>
              <div className="flex items-center text-sm font-medium text-blue-600 sm:text-base">
                <span>Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-6 transition-all duration-300 hover:shadow-xl sm:p-8"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-blue-600 sm:mb-6 sm:h-16 sm:w-16">
                <User className="h-6 w-6 text-white sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-4 text-lg font-bold sm:text-xl">Auto Apply</h3>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                Let AI apply to relevant jobs for you automatically. Save time
                while increasing your chances of landing interviews.
              </p>
              <div className="flex items-center text-sm font-medium text-green-600 sm:text-base">
                <span>Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 transition-all duration-300 hover:shadow-xl sm:p-8"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 sm:mb-6 sm:h-16 sm:w-16">
                <TrendingUp className="h-6 w-6 text-white sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-4 text-lg font-bold sm:text-xl">
                Profile Optimization
              </h3>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                Get AI-powered suggestions to optimize your profile and increase
                visibility to top recruiters and employers.
              </p>
              <div className="flex items-center text-sm font-medium text-purple-600 sm:text-base">
                <span>Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="bg-gray-50 py-10 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Explore Job Categories
            </h2>
            <p className="text-lg text-gray-600 sm:text-xl">
              Find opportunities in your field
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {CategoriesResponse?.statusCode === 200 &&
              CategoriesResponse?.data?.map((category, index) => (
                <motion.div
                  key={category.id}
                  className="cursor-pointer rounded-2xl bg-white p-4 transition-all duration-300 hover:shadow-xl sm:p-6"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div
                    className={`h-12 w-12 sm:h-16 sm:w-16 ${category.color} mb-4 flex items-center justify-center rounded-xl text-xl sm:text-2xl`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-bold sm:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    {category.count} jobs available
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-white py-10 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Featured Jobs
              </h2>
              <p className="text-lg text-gray-600 sm:text-xl">
                Hand-picked opportunities for you
              </p>
            </div>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base">
              View All Jobs
            </button>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FeaturedJobResponse?.statusCode === 200 &&
              FeaturedJobResponse?.data?.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-xl sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg sm:h-12 sm:w-12 sm:text-xl">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold sm:text-base">
                          {job.company}
                        </h3>
                        <div className="flex items-center text-xs text-gray-600 sm:text-sm">
                          <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${job.match >= 90 ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {job.match}% match
                      </span>
                      {job.isRemote && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600">
                          Remote
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="mb-2 text-lg font-bold sm:text-xl">
                    {job.title}
                  </h2>

                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-green-600 sm:text-base">
                      {job.salary}
                    </span>
                    <span className="text-xs text-gray-600 sm:text-sm">
                      {job.type}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-1 sm:gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 sm:px-3"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4 flex items-center justify-between text-xs text-gray-600 sm:text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {job.posted}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      {job.applicants} applicants
                    </div>
                  </div>

                  <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2 text-sm text-white transition-all duration-300 hover:shadow-lg sm:py-3 sm:text-base">
                    Apply Now
                  </button>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-10 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center text-white">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Stay Ahead of the Job Market
            </h2>
            <p className="mb-6 text-lg opacity-90 sm:mb-8 sm:text-xl">
              Get personalized job alerts, industry insights, and career tips
              delivered to your inbox
            </p>

            <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none sm:px-6 sm:py-4 sm:text-base"
              />
              <button className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-600 transition-colors hover:bg-gray-100 sm:px-8 sm:py-4 sm:text-base">
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
const LaunchStateHome: React.FC<{
  data: {
    jobs: number;
    users: number;
    companies: number;
    categories: number;
    isLoading: boolean;
    hasContent: boolean;
  };
}> = ({ data }) => {
  const [email, setEmail] = useState("");
  const { isSubscribed, subscribe } = usePlatform();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [userCount, setUserCount] = useState(data.users || 2847);
  const [launchCountdown, setLaunchCountdown] = useState({
    days: 7,
    hours: 12,
    minutes: 30,
    seconds: 45,
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
      console.error("Subscription failed:", error);
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
      total: 1000,
    },
    {
      id: 2,
      title: "Early Bird Job Alerts",
      description: "Get notified first when companies start posting",
      icon: "🚨",
      remaining: 1500,
      total: 1500,
    },
    {
      id: 3,
      title: "Founding Member Badge",
      description: "Special recognition as a platform pioneer",
      icon: "🏆",
      remaining: 2000,
      total: 2000,
    },
  ];

  // Beta testimonials
  const betaTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Beta Tester",
      company: "Early Access Program",
      image: "👩‍💼",
      content:
        "The AI matching algorithm is incredibly accurate. I can't wait for companies to start posting jobs!",
      rating: 5,
      badge: "Beta Tester",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      company: "Beta Program",
      image: "👨‍💻",
      content:
        "Finally, a job platform that understands what I'm looking for. The profile builder is genius!",
      rating: 5,
      badge: "Beta Tester",
    },
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
      setLaunchCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % betaTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Success Toast */}
      <SuccessToast show={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* Launch Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <span className="font-bold text-white">G</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                GigHub
              </span>
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">
                LAUNCHING SOON
              </span>
            </div>

            <div className="md:hidden">
              {isSubscribed ? (
                <button
                  disabled={true}
                  className="cursor-not-allowed rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white opacity-75"
                >
                  ✓ Joined
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center justify-center space-x-6 rounded-lg bg-gray-900 px-4 py-2 text-white">
              <span className="text-sm font-medium">Full Launch In:</span>
              <div className="flex space-x-2">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {launchCountdown.days}
                  </div>
                  <div className="text-xs">DAYS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {launchCountdown.hours}
                  </div>
                  <div className="text-xs">HRS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {launchCountdown.minutes}
                  </div>
                  <div className="text-xs">MIN</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {launchCountdown.seconds}
                  </div>
                  <div className="text-xs">SEC</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              {isSubscribed ? (
                <button
                  disabled={true}
                  className="cursor-not-allowed rounded-lg bg-green-600 px-6 py-2 text-white opacity-75 transition-all duration-300 hover:shadow-lg"
                >
                  ✓ Joined
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Launch Focus */}
      <section className="relative overflow-hidden py-10 sm:py-20">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            className="mb-6 inline-flex items-center space-x-2 rounded-full bg-green-100 px-4 py-2 text-green-600 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-medium">We're Launching Soon!</span>
          </motion.div>

          <motion.h1
            className="mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text px-4 text-4xl font-bold text-transparent sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Future of Job Search
            <br />
            <span className="text-blue-600">Starts Here</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-6 max-w-2xl px-4 text-lg text-gray-600 sm:mb-8 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Be among the first to experience AI-powered job matching. Join{" "}
            {userCount.toLocaleString()} professionals already waiting for
            launch.
          </motion.p>

          {/* Early Access Form - Only show if not subscribed */}
          {!isSubscribed && (
            <motion.div
              className="mx-4 mx-auto mb-8 max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:mb-12 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="mb-4 text-xl font-bold sm:text-2xl">
                Get Early Access
              </h3>
              <p className="mb-6 text-sm text-gray-600 sm:text-base">
                Be the first to know when we launch and get exclusive benefits
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:px-6 sm:py-4 sm:text-base"
                  disabled={isSubmitting}
                />
                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting || !email}
                  className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm text-white transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-4 sm:text-base"
                >
                  {isSubmitting ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <UserPlus className="h-5 w-5" />
                  )}
                  <span>{isSubmitting ? "Joining..." : "Join Waitlist"}</span>
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-xs text-gray-500 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-sm">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Early access perks
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  No spam, ever
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Exclusive updates
                </div>
              </div>
            </motion.div>
          )}

          {/* Launch Stats */}
          <motion.div
            className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 sm:gap-6 lg:grid-cols-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                {userCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                On Waitlist
              </div>
              <div className="mt-1 text-xs text-green-600">
                ↗ Growing daily
              </div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-green-600 sm:text-2xl">
                50+
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Companies Ready
              </div>
              <div className="mt-1 text-xs text-green-600">↗ More joining</div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-purple-600 sm:text-2xl">
                1000+
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Jobs Coming
              </div>
              <div className="mt-1 text-xs text-green-600">↗ At launch</div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-orange-600 sm:text-2xl">
                95%
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                AI Accuracy
              </div>
              <div className="mt-1 text-xs text-blue-600">✓ Beta tested</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Launch Incentives */}
      <section className="bg-white py-10 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Early Bird Benefits
            </h2>
            <p className="text-lg text-gray-600 sm:text-xl">
              Limited-time offers for our founding members
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {launchIncentives.map((incentive, index) => (
              <motion.div
                key={incentive.id}
                className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 text-center transition-all duration-300 hover:shadow-xl sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 text-5xl sm:text-6xl">
                  {incentive.icon}
                </div>
                <h3 className="mb-4 text-lg font-bold sm:text-xl">
                  {incentive.title}
                </h3>
                <p className="mb-6 text-sm text-gray-600 sm:text-base">
                  {incentive.description}
                </p>

                <div className="mb-6 rounded-lg bg-white p-4">
                  <div className="mb-2 flex justify-between text-sm text-gray-600">
                    <span>Available</span>
                    <span>
                      {incentive.remaining}/{incentive.total}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                      style={{
                        width: `${(incentive.remaining / incentive.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(email)}
                  disabled={isSubmitting || isSubscribed}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm text-white transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                >
                  {isSubscribed ? "Already Claimed" : "Claim This Offer"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Testimonials */}
      <section className="bg-gray-900 py-10 text-white sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              What Beta Testers Say
            </h2>
            <p className="text-lg text-gray-300 sm:text-xl">
              Real feedback from early users testing the platform
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="px-4 text-center"
              >
                <div className="mb-6 text-5xl sm:text-6xl">
                  {betaTestimonials[currentTestimonial].image}
                </div>
                <div className="mb-4 flex justify-center">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white sm:text-sm">
                    {betaTestimonials[currentTestimonial].badge}
                  </span>
                </div>
                <blockquote className="mb-8 text-xl leading-relaxed italic sm:text-2xl">
                  "{betaTestimonials[currentTestimonial].content}"
                </blockquote>
                <div className="mb-4 flex justify-center">
                  {[...Array(betaTestimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400 sm:h-6 sm:w-6"
                      />
                    ),
                  )}
                </div>
                <div className="text-lg font-bold">
                  {betaTestimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-300">
                  {betaTestimonials[currentTestimonial].role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Final CTA - Only show if not subscribed */}
      {!isSubscribed && (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-10 sm:py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Don't Miss the Launch
            </h2>
            <p className="mb-6 px-4 text-lg opacity-90 sm:mb-8 sm:text-xl">
              Join {userCount.toLocaleString()} professionals ready to transform
              their careers
            </p>

            <div className="mx-auto mb-6 flex max-w-lg flex-col gap-4 px-4 sm:mb-8 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none sm:px-6 sm:py-4 sm:text-base"
                disabled={isSubmitting}
              />
              <button
                onClick={() => handleSubscribe(email)}
                disabled={isSubmitting || !email}
                className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-4 sm:text-base"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 px-4 text-xs opacity-75 sm:flex-row sm:space-y-0 sm:space-x-8 sm:text-sm">
              <div className="flex items-center">
                <Gift className="mr-2 h-4 w-4" />
                Early access perks
              </div>
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                AI-powered matching
              </div>
              <div className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
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
    jobs: number;
    users: number;
    companies: number;
    categories: number;
    isLoading: boolean;
    hasContent: boolean;
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
