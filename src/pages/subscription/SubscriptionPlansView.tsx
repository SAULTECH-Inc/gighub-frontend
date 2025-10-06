import React, { useEffect, useState } from "react";
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
import {
  BillingCycle,
  SubscriptionResponse,
  SubscriptionType,
} from "../../utils/types";
import { useSubscriptionStore } from "../../store/useSubscriptionStore.ts";
import { useFetchSubscriptionPlans } from "../../hooks/useFetchSubscriptionPlans.ts";
import { useAuth } from "../../store/useAuth.ts";

interface PlanUI {
  id: string;
  name: string;
  period: string;
  price: string;
  originalPrice: string;
  dailyLimit: string;
  volume: string;
  icon: string;
  gradient: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  savings?: string;
  apiPlan: SubscriptionResponse;
}

const SubscriptionPlansView: React.FC = () => {
  const { isAuthenticated, applicant, employer } = useAuth();
  const [user] = useState<any>(
    USER_TYPE === UserType.APPLICANT ? applicant : employer,
  );
  const { openModal, isModalOpen } = useModalStore();
  const { subscription: userSubscription, isLoading: subscriptionLoading } =
    useSubscriptionStore();
  const { data: subscriptionPlans, isLoading: plansLoading } =
    useFetchSubscriptionPlans(
      USER_TYPE === UserType.APPLICANT
        ? SubscriptionType.PROFESSIONAL
        : SubscriptionType.ENTERPRISE,
    );
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionResponse | null>(
    null,
  );
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    primary: 0,
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

      // Different stats based on user type
      if (USER_TYPE === UserType.APPLICANT) {
        animateValue(0, 2500000, (val) =>
          setAnimatedStats((prev) => ({ ...prev, primary: val })),
        );
      } else {
        animateValue(0, 150000, (val) =>
          setAnimatedStats((prev) => ({ ...prev, primary: val })),
        );
      }

      animateValue(0, 15000, (val) =>
        setAnimatedStats((prev) => ({ ...prev, users: val })),
      );
      animateValue(0, 87, (val) =>
        setAnimatedStats((prev) => ({ ...prev, success: val })),
      );
    }, 500);
  }, []);

  const handleSubscription = async (
    planType?: string,
    apiPlan?: SubscriptionResponse,
  ) => {
    if (planType) setSelectedPlan(apiPlan as SubscriptionResponse);

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      // Redirect to login with return URL
      window.location.href = `/login?redirect=/subscriptions&plan=${planType || "default"}`;
      return;
    }

    // If we have an API plan and user info, attempt to subscribe
    if (apiPlan && user?.id) {
      try {
        // await subscribe(user.id, apiPlan.id);
        // On success, show payment modal or redirect to payment
        openModal("payment-modal");
      } catch (error) {
        console.error("Subscription failed:", error);
        // Handle error - show error message to user
      }
    } else {
      // Just open payment modal for plan selection
      openModal("payment-modal");
    }
  };

  // Helper function to determine if user can subscribe to plan
  const canSubscribeToPlan = (plan: SubscriptionResponse): boolean => {
    if (!isAuthenticated) return true; // Show all plans to non-authenticated users

    // Check if user already has this subscription
    return !(
      userSubscription?.subscriptionId === plan.id && userSubscription.isActive
    );
  };

  // Helper function to get button text based on user state
  const getButtonText = (
    plan: SubscriptionResponse,
    isPopular: boolean,
  ): string => {
    if (!isAuthenticated) {
      return isPopular ? "🚀 Sign Up & Start Free Trial" : "Get Started";
    }

    if (
      userSubscription?.subscriptionId === plan.id &&
      userSubscription.isActive
    ) {
      return "Current Plan";
    }

    if (userSubscription?.subscriptionId && userSubscription.isActive) {
      // User has different active subscription
      return isPopular ? "🚀 Upgrade Plan" : "Switch Plan";
    }

    return isPopular ? "🚀 Start Free Trial" : "Subscribe Now";
  };

  // Helper function to map API plans to UI structure
  const mapApiPlansToUI = (apiPlans: SubscriptionResponse[]): PlanUI[] => {
    const getFeaturesByPlan = (plan: SubscriptionResponse): string[] => {
      const baseFeatures =
        USER_TYPE === UserType.APPLICANT
          ? [
              `Up to ${plan.billingCycle === BillingCycle.MONTHLY ? "6,000" : plan.billingCycle === BillingCycle.QUARTERLY ? "18,000" : "73,000"} automated applications`,
              "AI-powered job matching",
              "Personalized cover letters",
              "Analytics dashboard",
              "Email notifications",
            ]
          : [
              "Unlimited candidate matches",
              "AI-powered screening and matching",
              "Detailed candidate profiles",
              "Hiring analytics dashboard",
              "Email notifications",
            ];

      if (plan.type === SubscriptionType.ENTERPRISE) {
        return [
          ...baseFeatures,
          "Dedicated account manager",
          "Custom integrations",
          "White-glove onboarding",
          "Priority support",
        ];
      }

      return baseFeatures;
    };

    return apiPlans
      .filter((plan) => plan.isActive)
      .map((plan) => ({
        id: plan.billingCycle.toLowerCase(),
        name: plan.name,
        period: plan.billingCycle,
        price: `₦${plan.price.toLocaleString()}`,
        originalPrice: `₦${Math.round(plan.price * 1.4).toLocaleString()}`,
        dailyLimit:
          plan.type === SubscriptionType.ENTERPRISE ? "Unlimited" : "200",
        volume:
          plan.billingCycle === BillingCycle.MONTHLY
            ? "6,000"
            : plan.billingCycle === BillingCycle.QUARTERLY
              ? "18,000"
              : "73,000",
        icon:
          plan.billingCycle === BillingCycle.MONTHLY
            ? "⭐"
            : plan.billingCycle === BillingCycle.QUARTERLY
              ? "💎"
              : "🏆",
        gradient:
          plan.billingCycle === BillingCycle.QUARTERLY
            ? "from-[#6438C2] to-[#65FF81]"
            : "from-[#6438C2] to-[#FA4E09]",
        badge:
          plan.billingCycle === BillingCycle.QUARTERLY
            ? "MOST POPULAR"
            : plan.billingCycle === BillingCycle.ANNUALLY
              ? "BEST VALUE"
              : undefined,
        badgeColor:
          plan.billingCycle === BillingCycle.QUARTERLY
            ? "bg-[#FACC15]"
            : "bg-green-400",
        features: getFeaturesByPlan(plan),
        savings:
          plan.billingCycle === BillingCycle.QUARTERLY
            ? "Save 17%"
            : plan.billingCycle === BillingCycle.ANNUALLY
              ? "Save 25%"
              : undefined,
        apiPlan: plan,
      }));
  };

  // Dynamic content based on user type with API-driven pricing
  const getServiceContent = () => {
    const mappedPlans = mapApiPlansToUI(subscriptionPlans?.data || []);

    if (USER_TYPE === UserType.APPLICANT) {
      return {
        serviceTitle: "Auto Apply",
        heroTitle: "Supercharge Your Job Search",
        heroSubtitle:
          "Let AI do the heavy lifting while you focus on what matters - landing your dream job",
        primaryStat: "Applications Sent",
        secondaryStat: "Happy Job Seekers",
        plans: mappedPlans,
        features: [
          {
            icon: "🤖",
            title: "AI-Powered Job Matching",
            desc: "Smart algorithms find the perfect job matches for your skills and experience",
          },
          {
            icon: "✍️",
            title: "Personalized Applications",
            desc: "Custom cover letters optimized for each employer and company culture",
          },
          {
            icon: "📊",
            title: "Market Analytics",
            desc: "Track success rates and get insights into job market trends and opportunities",
          },
          {
            icon: "🎯",
            title: "Multi-Platform Coverage",
            desc: "Apply across LinkedIn, Indeed, company websites and major job boards",
          },
          {
            icon: "⚡",
            title: "Lightning Fast Applications",
            desc: "Apply to 200 jobs daily across all major job platforms automatically",
          },
          {
            icon: "🔒",
            title: "Secure & Compliant",
            desc: "Your data is encrypted and protected with enterprise-grade security",
          },
        ],
        testimonials: [
          {
            name: "Adebayo Okafor",
            role: "Software Developer",
            company: "Flutterwave",
            text: "Auto Apply helped me land my fintech role in Lagos within 2 weeks! Got 5x more interviews than manual applications.",
            rating: 5,
          },
          {
            name: "Funmi Adeyemi",
            role: "Digital Marketing Manager",
            company: "Paystack",
            text: "As a busy professional, this saved me 10+ hours weekly. The AI understood the job market perfectly!",
            rating: 5,
          },
          {
            name: "Chidi Okwu",
            role: "Product Manager",
            company: "Konga",
            text: "Increased my application success rate by 40%. The personalized cover letters made all the difference.",
            rating: 5,
          },
        ],
        ctaTitle: "Ready to Transform Your Career?",
        ctaSubtitle:
          "Join thousands of professionals who've accelerated their careers with Auto Apply",
        questionTitle: "Why Job Seekers Choose Auto Apply",
      };
    } else {
      return {
        serviceTitle: "Smart Match",
        heroTitle: "Transform Your Hiring Process",
        heroSubtitle:
          "Find top talent faster with AI-powered matching while saving on recruitment costs",
        primaryStat: "Candidates Matched",
        secondaryStat: "Happy Employers",
        plans: mappedPlans,
        features: [
          {
            icon: "🤖",
            title: "Advanced Matching",
            desc: "AI trained on hiring patterns, skill requirements, and cultural fit",
          },
          {
            icon: "📋",
            title: "Automated Talent Sourcing",
            desc: "Get pre-screened candidates from universities, bootcamps, and professional networks",
          },
          {
            icon: "📊",
            title: "Hiring ROI Analytics",
            desc: "Track time-to-hire, cost-per-hire, and success rates vs traditional methods",
          },
          {
            icon: "🎯",
            title: "Skills-Based Matching",
            desc: "Find candidates with specific technical skills, certifications, and experience",
          },
          {
            icon: "⚡",
            title: "Rapid Candidate Delivery",
            desc: "Get qualified candidates within 24 hours instead of weeks",
          },
          {
            icon: "🔒",
            title: "Compliant Screening",
            desc: "All candidate screening follows data protection regulations and best practices",
          },
        ],
        testimonials: [
          {
            name: "Kemi Adesola",
            role: "HR Director",
            company: "GTBank",
            text: "Smart Match reduced our time-to-hire by 70%. We've filled 15 tech roles within a month!",
            rating: 5,
          },
          {
            name: "James Okonkwo",
            role: "Startup Founder",
            company: "FinTech Lagos",
            text: "As a startup, we couldn't afford traditional recruitment. Smart Match gave us access to top talent at 60% lower cost.",
            rating: 5,
          },
          {
            name: "Aisha Abdullahi",
            role: "Talent Manager",
            company: "Interswitch",
            text: "The quality of candidates is exceptional. 90% of our interviews now result in offers vs 20% before.",
            rating: 5,
          },
        ],
        ctaTitle: "Ready to Transform Your Hiring?",
        ctaSubtitle:
          "Join leading companies who've streamlined recruitment with Smart Match",
        questionTitle: "Why Companies Choose Smart Match",
      };
    }
  };

  const content = getServiceContent();

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
      <div className="relative overflow-hidden bg-gradient-to-r from-[#6438C2] to-[#FA4E09]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div
            className={`mb-8 text-center transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            {/* Show current subscription status for authenticated users */}
            {isAuthenticated && userSubscription?.isActive && (
              <div className="mx-auto mb-6 max-w-md rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-800">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm font-medium">
                    Current Plan:{" "}
                    {userSubscription.subscription?.name ||
                      "Active Subscription"}
                  </span>
                </div>
              </div>
            )}

            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {content.heroTitle}
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-lg text-white/90 md:text-xl">
              {content.heroSubtitle}
            </p>

            {/* Stats */}
            <div className="mb-8 flex flex-wrap justify-center gap-6">
              <div className="rounded-lg bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white md:text-3xl">
                  {animatedStats.primary.toLocaleString()}+
                </div>
                <div className="text-sm text-white/80">
                  {content.primaryStat}
                </div>
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white md:text-3xl">
                  {animatedStats.users.toLocaleString()}+
                </div>
                <div className="text-sm text-white/80">
                  {content.secondaryStat}
                </div>
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-white md:text-3xl">
                  {animatedStats.success}%
                </div>
                <div className="text-sm text-white/80">Success Rate</div>
              </div>
            </div>

            {/* Hero CTA - Different for auth vs non-auth users */}
            <button
              onClick={() => handleSubscription()}
              className="mb-3 rounded-lg bg-white px-6 py-3 text-base font-bold text-[#6438C2] transition-all duration-300 hover:bg-gray-100 hover:shadow-lg md:px-8 md:py-4 md:text-lg"
            >
              {isAuthenticated
                ? "🚀 Start Your 7-Day Free Trial"
                : "🚀 Sign Up & Start Free Trial"}
            </button>
            <p className="text-sm text-white/75">
              {isAuthenticated
                ? "No credit card required • Cancel anytime"
                : "Create account • No credit card required • Cancel anytime"}
            </p>
          </div>
        </div>
      </div>

      {/* Login Prompt Banner for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="border-b border-blue-200 bg-blue-50 px-4 py-3">
          <div className="container mx-auto text-center">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Want to subscribe?</span>
              <a
                href="/login"
                className="ml-2 font-medium text-blue-600 underline hover:no-underline"
              >
                Sign in
              </a>
              <span className="mx-2">or</span>
              <a
                href="/signup"
                className="font-medium text-blue-600 underline hover:no-underline"
              >
                create an account
              </a>
              <span className="ml-2">to get started with your free trial</span>
            </p>
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Choose Your Success Plan
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
            Transparent pricing. Start free, scale as you grow.
            {!isAuthenticated && (
              <span className="mt-2 block font-medium text-blue-600">
                Sign up to unlock exclusive features and start your free trial
              </span>
            )}
          </p>
        </div>

        <div className="mx-auto mb-16 grid max-w-6xl gap-6 lg:grid-cols-3">
          {plansLoading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl bg-white shadow-lg"
              >
                <div className="p-6 md:p-8">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-200"></div>
                    <div className="mx-auto mb-1 h-6 w-3/4 rounded bg-gray-200"></div>
                    <div className="mx-auto h-4 w-1/2 rounded bg-gray-200"></div>
                  </div>
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-2 h-10 w-2/3 rounded bg-gray-200"></div>
                    <div className="mx-auto mb-3 h-4 w-1/2 rounded bg-gray-200"></div>
                    <div className="h-12 rounded bg-gray-200"></div>
                  </div>
                  <div className="mb-6 space-y-3">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-4 rounded bg-gray-200"></div>
                    ))}
                  </div>
                  <div className="h-12 rounded bg-gray-200"></div>
                </div>
              </div>
            ))
          ) : content.plans.length === 0 ? (
            // Empty state
            <div className="col-span-3 py-12 text-center">
              <div className="mb-4 text-6xl">📦</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                No Plans Available
              </h3>
              <p className="text-gray-500">
                Subscription plans are being configured. Please check back
                later.
              </p>
            </div>
          ) : (
            // Plans loaded successfully
            content.plans.map((plan, index) => {
              const isCurrentPlan =
                isAuthenticated &&
                userSubscription?.subscriptionId === plan.apiPlan.id &&
                userSubscription.isActive;
              const canSubscribe = canSubscribeToPlan(plan.apiPlan);
              const isPopularPlan = index === 1;

              return (
                <div
                  key={plan.id}
                  className={`relative transform rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    selectedPlan?.id === plan.id ? "ring-4 ring-[#6438C2]" : ""
                  } ${isPopularPlan ? "border-2 border-[#FACC15] lg:scale-102" : ""} ${
                    isCurrentPlan ? "ring-2 ring-green-400" : ""
                  }`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 transform ${plan.badgeColor} rounded-full px-4 py-1 text-sm font-bold text-black shadow-md`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4 rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-black shadow-md">
                      CURRENT
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    <div className="mb-6 text-center">
                      <div className="mb-3 text-4xl">{plan.icon}</div>
                      <h3 className="mb-1 text-xl font-bold text-gray-800 md:text-2xl">
                        {plan.name}
                      </h3>
                      <p className="text-base text-gray-600">{plan.period}</p>
                    </div>

                    <div className="mb-6 text-center">
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold text-[#6438C2] md:text-4xl">
                          {plan.price}
                        </span>
                        <span className="text-base text-gray-500">
                          /{plan.period.toLowerCase()}
                        </span>
                      </div>
                      <div className="mb-3 text-sm text-gray-500">
                        <span className="mr-2 line-through">
                          {plan.originalPrice}
                        </span>
                        {plan.savings && (
                          <span className="font-semibold text-green-600">
                            {plan.savings}
                          </span>
                        )}
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="text-sm font-medium text-gray-800">
                          {plan.dailyLimit}{" "}
                          {USER_TYPE === UserType.APPLICANT
                            ? "applications daily"
                            : "candidate matches"}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced features for authenticated users */}
                    <div className="mb-6 space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 text-lg text-green-500">✓</div>
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}

                      {/* Show additional authenticated user benefits */}
                      {isAuthenticated && (
                        <>
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-lg text-blue-500">
                              ⭐
                            </div>
                            <span className="text-sm font-medium text-blue-700">
                              Personalized recommendations based on your profile
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-lg text-blue-500">
                              📈
                            </div>
                            <span className="text-sm font-medium text-blue-700">
                              Advanced analytics and usage insights
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handleSubscription(plan.id, plan.apiPlan)}
                      disabled={
                        plansLoading || subscriptionLoading || !canSubscribe
                      }
                      className={`w-full rounded-lg px-4 py-3 text-base font-semibold transition-all duration-300 ${
                        isCurrentPlan
                          ? "cursor-not-allowed bg-green-100 text-green-800"
                          : isPopularPlan
                            ? "transform bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white hover:scale-105 hover:shadow-lg disabled:opacity-50"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50"
                      }`}
                    >
                      {plansLoading || subscriptionLoading
                        ? "Loading..."
                        : getButtonText(plan.apiPlan, isPopularPlan)}
                    </button>

                    {/* Show coupon input for authenticated users */}
                    {isAuthenticated && canSubscribe && !isCurrentPlan && (
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Have a coupon code?"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#6438C2] focus:outline-none"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              // Handle coupon validation
                              console.log(
                                "Validate coupon:",
                                e.currentTarget.value,
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Feature Grid - Same for all users */}
        <div className="mb-12">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            {content.questionTitle}
          </h3>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="transform rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials - Same for all users */}
        <div className="mb-12">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-800 md:text-3xl">
            Success Stories
          </h3>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {content.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4 flex justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-lg text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-sm text-gray-700 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <div className="text-base font-semibold text-gray-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm font-medium text-[#6438C2]">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section - Enhanced based on auth status */}
        <div className="rounded-2xl bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-8 text-center text-white shadow-xl">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">
            {content.ctaTitle}
          </h3>
          <p className="mb-6 text-lg opacity-90">{content.ctaSubtitle}</p>

          {isAuthenticated ? (
            <div>
              <button
                onClick={() => handleSubscription()}
                className="mb-3 rounded-lg bg-white px-6 py-3 text-lg font-bold text-[#6438C2] transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
              >
                {userSubscription?.isActive
                  ? "🚀 Upgrade Your Plan"
                  : "🚀 Start Your 7-Day Free Trial"}
              </button>
              <p className="text-sm opacity-75">
                {userSubscription?.isActive
                  ? "Switch plans anytime • Full refund within 30 days"
                  : "No credit card required • Cancel anytime"}
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    (window.location.href = "/signup?redirect=/subscriptions")
                  }
                  className="rounded-lg bg-white px-6 py-3 text-lg font-bold text-[#6438C2] transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
                >
                  🚀 Create Account & Start Free Trial
                </button>
                <span className="text-sm text-white/70">or</span>
                <button
                  onClick={() =>
                    (window.location.href = "/login?redirect=/subscriptions")
                  }
                  className="rounded-lg border-2 border-white bg-transparent px-6 py-3 text-lg font-bold text-white transition-all duration-300 hover:bg-white hover:text-[#6438C2]"
                >
                  Sign In
                </button>
              </div>
              <p className="text-sm opacity-75">
                Join thousands of users • No credit card required • Cancel
                anytime
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Payment Modal - passes more context */}
      {isModalOpen("payment-modal") && (
        <PaymentModal
          modalId="payment-modal"
          selectedPlan={selectedPlan as SubscriptionResponse}
          user={user}
        />
      )}

      {/* Login Prompt Modal for non-authenticated users */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Sign Up Required
            </h3>
            <p className="mb-6 text-gray-600">
              Create an account or sign in to subscribe to our plans and start
              your free trial.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  (window.location.href = "/signup?redirect=/subscriptions")
                }
                className="flex-1 rounded-lg bg-[#6438C2] px-4 py-2 text-white transition-colors hover:bg-[#5329a0]"
              >
                Create Account
              </button>
              <button
                onClick={() =>
                  (window.location.href = "/login?redirect=/subscriptions")
                }
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Sign In
              </button>
            </div>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}

      <MainFooter />
    </div>
  );
};

export default SubscriptionPlansView;
