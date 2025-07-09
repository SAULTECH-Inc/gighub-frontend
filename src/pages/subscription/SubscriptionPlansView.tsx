import React, { useState, useEffect } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import PaymentModal from "../../components/ui/PaymentModal.tsx";
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

const SubscriptionPlansView: React.FC = () => {
  const { openModal, isModalOpen } = useModalStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    applications: 0,
    users: 0,
    success: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  // Animate stats on component mount
  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      const animateValue = (
        start: number,
        end: number,
        setter: (val: number) => void,
      ) => {
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(start + (end - start) * progress);
          setter(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      };

      animateValue(0, 2500000, (val) =>
        setAnimatedStats((prev) => ({ ...prev, applications: val })),
      );
      animateValue(0, 15000, (val) =>
        setAnimatedStats((prev) => ({ ...prev, users: val })),
      );
      animateValue(0, 87, (val) =>
        setAnimatedStats((prev) => ({ ...prev, success: val })),
      );
    }, 500);
  }, []);

  const handleSubscription = (planType?: string) => {
    if (planType) setSelectedPlan(planType);
    openModal("payment-modal");
  };

  const plans = [
    {
      id: "monthly",
      name: "Starter",
      period: "Monthly",
      price: 29,
      originalPrice: 39,
      applications: "6,000",
      icon: "⭐",
      gradient: "from-[#6438C2] to-[#FA4E09]",
      features: [
        "Up to 6,000 automated applications",
        "AI-powered job matching",
        "Personalized cover letters",
        "Basic analytics dashboard",
        "Email support",
      ],
    },
    {
      id: "quarterly",
      name: "Professional",
      period: "Quarterly",
      price: 69,
      originalPrice: 117,
      applications: "18,000",
      icon: "💎",
      gradient: "from-[#6438C2] to-[#65FF81]",
      badge: "MOST POPULAR",
      badgeColor: "bg-[#FACC15]",
      features: [
        "Up to 18,000 automated applications",
        "Priority job matching",
        "Advanced filtering options",
        "Detailed analytics & insights",
        "Priority email support",
        "Custom application templates",
      ],
    },
    {
      id: "annual",
      name: "Enterprise",
      period: "Annual",
      price: 199,
      originalPrice: 468,
      applications: "73,000",
      icon: "🏆",
      gradient: "from-[#6438C2] to-[#FA4E09]",
      badge: "BEST VALUE",
      badgeColor: "bg-green-400",
      features: [
        "Up to 73,000 automated applications",
        "Premium job matching algorithm",
        "Exclusive job opportunities",
        "Advanced analytics & reporting",
        "Dedicated account manager",
        "Custom integrations",
        "White-glove onboarding",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      text: "Auto Apply helped me land my dream job in just 3 weeks! The automated applications saved me countless hours.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "StartupXYZ",
      text: "Incredible results! I got 40% more interview requests compared to manual applications.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Product Designer",
      company: "Design Studio",
      text: "The personalized cover letters and smart matching made all the difference in my job search.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Matching",
      desc: "Smart algorithms find the perfect job matches for your skills",
    },
    {
      icon: "✍️",
      title: "Personalized Applications",
      desc: "Custom cover letters and applications for each opportunity",
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      desc: "Track your success rate and optimize your job search strategy",
    },
    {
      icon: "🎯",
      title: "Targeted Outreach",
      desc: "Focus on companies and roles that match your career goals",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      desc: "Apply to hundreds of jobs in minutes, not hours",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      desc: "Your data is encrypted and protected with enterprise-grade security",
    },
  ];

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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6438C2] to-[#FA4E09]"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div
            className={`mb-12 text-center transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <h1 className="mb-4 bg-gradient-to-r from-[#6438C2] to-[#FA4E09] bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Supercharge Your Job Search
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-white md:text-2xl">
              Let AI do the heavy lifting while you focus on what matters -
              landing your dream job
            </p>
            <div className="mb-12 flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#6438C2] md:text-4xl">
                  {animatedStats.applications.toLocaleString()}+
                </div>
                <div className="text-white">Applications Sent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FA4E09] md:text-4xl">
                  {animatedStats.users.toLocaleString()}+
                </div>
                <div className="text-white">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#65FF81] md:text-4xl">
                  {animatedStats.success}%
                </div>
                <div className="text-white">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Choose Your Success Plan
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Start with our 7-day free trial. No credit card required.
          </p>
        </div>

        <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative transform rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                selectedPlan === plan.id ? "ring-4 ring-[#6438C2]" : ""
              } ${index === 1 ? "md:scale-105" : ""}`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 transform ${plan.badgeColor} rounded-full px-4 py-1 text-xs font-bold text-black`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="p-8">
                <div className="mb-6 text-center">
                  <div className="mb-2 text-4xl">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600">{plan.period}</p>
                </div>

                <div className="mb-6 text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-[#6438C2]">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500">
                      /{plan.period.toLowerCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="mr-2 line-through">
                      ${plan.originalPrice}
                    </span>
                    <span className="font-semibold text-green-600">
                      Save ${plan.originalPrice - plan.price}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {plan.applications} applications included
                  </div>
                </div>

                <div className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 text-lg text-green-500">✓</div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscription(plan.id)}
                  className={`w-full rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
                    index === 1
                      ? "transform bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white hover:scale-105 hover:shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {index === 1 ? "Start Free Trial" : "Choose Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mb-16">
          <h3 className="mb-12 text-center text-3xl font-bold text-gray-800">
            Why Choose Auto Apply?
          </h3>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="transform rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h4 className="mb-2 text-xl font-semibold text-gray-800">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="mb-12 text-center text-3xl font-bold text-gray-800">
            Success Stories
          </h3>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-lg text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-gray-700 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-12 text-center text-white">
          <h3 className="mb-4 text-3xl font-bold">
            Ready to Transform Your Job Search?
          </h3>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of professionals who've accelerated their careers
            with Auto Apply
          </p>
          <button
            onClick={() => handleSubscription()}
            className="rounded-lg bg-white px-8 py-4 text-lg font-bold text-[#6438C2] transition-colors duration-300 hover:bg-gray-100"
          >
            Start Your 7-Day Free Trial
          </button>
          <p className="mt-4 text-sm opacity-75">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {isModalOpen("payment-modal") && <PaymentModal modalId="payment-modal" />}

      <MainFooter />
    </div>
  );
};

export default SubscriptionPlansView;
