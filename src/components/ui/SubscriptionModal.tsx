import React, { memo } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import PaymentModal from "./PaymentModal.tsx";
import { UserType } from "../../utils/enums.ts";

interface SubscriptionModalProps {
  modalId: string;
  USER_TYPE: UserType;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ modalId, USER_TYPE }) => {
  const { modals, openModal, closeModal, isModalOpen } = useModalStore();
  const isOpen = modals[modalId];

  if (!isOpen) return null;

  const handleSubscription = (_planType: string) => {
    closeModal(modalId);
    // Pass plan type to payment modal for processing
    openModal("payment-modal");
  };

  // Dynamic pricing based on user type
  const getPricingData = () => {
    if (USER_TYPE === UserType.APPLICANT) {
      return {
        monthly: { price: "₦2,000", period: "/month", applications: "200", total: "6,000" },
        quarterly: { price: "₦5,000", period: "/3 months", applications: "200", total: "18,000", savings: "Save 17%" },
        annual: { price: "₦18,000", period: "/year", applications: "200", total: "73,000", savings: "Save 25%" },
        serviceType: "applications",
        serviceDescription: "Auto Apply is our premium automation service that intelligently matches and submits applications to relevant opportunities on your behalf, maximizing your career prospects while saving you valuable time."
      };
    } else {
      return {
        monthly: { price: "₦50,000", period: "/month", applications: "Unlimited", total: "Unlimited" },
        quarterly: { price: "₦140,000", period: "/3 months", applications: "Unlimited", total: "Unlimited", savings: "Save 7%" },
        annual: { price: "₦500,000", period: "/year", applications: "Unlimited", total: "Unlimited", savings: "Save 17%" },
        serviceType: "candidate matches",
        serviceDescription: "Smart Match is our premium AI service that intelligently identifies and matches top candidates to your job openings, streamlining your hiring process while saving you valuable time."
      };
    }
  };

  const pricing = getPricingData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      {/* Modal Container */}
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-[#F7F7F7] p-4 shadow-lg md:p-6">
        {/* Close Button */}
        <button
          onClick={() => closeModal(modalId)}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none md:top-4 md:right-4 md:text-[32px]"
          aria-label="Close Modal"
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
            {USER_TYPE === UserType.APPLICANT ? (
              "Unlock Auto Apply Premium"
            ) : (
              "Unlock Smart Match Premium"
            )}
          </h2>
          <p className="text-sm text-gray-600 md:text-base">
            Start your 7-day free trial • No commitment • Cancel anytime
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-6 rounded-xl bg-white p-4 md:p-6 lg:flex-row">
          {/* Subscription Plans */}
          <div className="w-full space-y-4 md:space-y-6 lg:w-7/12">
            {/* Monthly Plan */}
            <div
              onClick={() => handleSubscription('monthly')}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-transparent bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-4 text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg md:p-5"
            >
              <div className="flex items-center">
                <div className="mr-3 text-2xl md:mr-4 md:text-3xl">⭐</div>
                <div>
                  <h3 className="text-lg font-bold md:text-xl">Monthly Plan</h3>
                  <p className="text-sm opacity-90 md:text-base">
                    Up to {pricing.monthly.applications} {pricing.serviceType} daily
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold md:text-2xl">{pricing.monthly.price}</span>
                <p className="text-xs opacity-75">{pricing.monthly.period}</p>
              </div>
            </div>

            {/* Quarterly Plan */}
            <div
              onClick={() => handleSubscription('quarterly')}
              className="relative flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-[#6438C2] to-[#65FF81] p-4 text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg md:p-5"
            >
              <div className="absolute -top-3 -right-3 rounded-full bg-[#FACC15] px-3 py-1 text-xs font-bold text-black shadow-md">
                POPULAR
              </div>
              <div className="flex items-center">
                <div className="mr-3 text-2xl md:mr-4 md:text-3xl">💎</div>
                <div>
                  <h3 className="text-lg font-bold md:text-xl">Quarterly Plan</h3>
                  <p className="text-sm opacity-90 md:text-base">
                    Up to {pricing.quarterly.applications} {pricing.serviceType} daily
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold md:text-2xl">{pricing.quarterly.price}</span>
                <p className="text-xs opacity-75">{pricing.quarterly.period}</p>
                {pricing.quarterly.savings && (
                  <p className="text-xs font-semibold text-yellow-200">{pricing.quarterly.savings}</p>
                )}
              </div>
            </div>

            {/* Annual Plan */}
            <div
              onClick={() => handleSubscription('annual')}
              className="relative flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-green-400 bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-4 text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg md:p-5"
            >
              <div className="absolute -top-3 -right-3 rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-black shadow-md">
                BEST VALUE
              </div>
              <div className="flex items-center">
                <div className="mr-3 text-2xl md:mr-4 md:text-3xl">🏆</div>
                <div>
                  <h3 className="text-lg font-bold md:text-xl">Annual Plan</h3>
                  <p className="text-sm opacity-90 md:text-base">
                    Up to {pricing.annual.applications} {pricing.serviceType} daily
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold md:text-2xl">{pricing.annual.price}</span>
                <p className="text-xs opacity-75">{pricing.annual.period}</p>
                {pricing.annual.savings && (
                  <p className="text-xs font-semibold text-green-200">{pricing.annual.savings}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-700 md:text-base">
                {pricing.serviceDescription}
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleSubscription('trial')}
              className="w-full rounded-lg bg-[#6438C2] py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              🚀 Start 7-Day Free Trial
            </button>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>✓ No credit card required</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 24/7 support</span>
            </div>

            {isModalOpen("payment-modal") && (
              <PaymentModal modalId="payment-modal" />
            )}
          </div>

          {/* Features Section */}
          <div className="w-full rounded-lg bg-[#F7F7F7] p-4 md:p-5 lg:w-5/12">
            <h4 className="mb-4 flex items-center text-lg font-bold text-black md:text-xl">
              <span className="mr-2">✨</span>
              What's Included
            </h4>
            <ul className="space-y-4">
              <li className="border-b border-gray-300 pb-4">
                <div className="flex items-start">
                  <span className="mr-3 mt-1 text-xl">🎯</span>
                  <div>
                    <span className="block text-sm font-bold text-[#6438C2] md:text-base">
                      Monthly Access
                    </span>
                    <p className="text-xs text-[#8E8E8E] md:text-sm">
                      {USER_TYPE === UserType.APPLICANT ? (
                        `Up to ${pricing.monthly.total} automated applications per month with intelligent job matching and personalized cover letters.`
                      ) : (
                        `Up to ${pricing.monthly.total} candidate matches per month with intelligent screening and detailed profiles.`
                      )}
                    </p>
                  </div>
                </div>
              </li>

              <li className="border-b border-gray-300 pb-4">
                <div className="flex items-start">
                  <span className="mr-3 mt-1 text-xl">💎</span>
                  <div>
                    <span className="block text-sm font-bold text-[#6438C2] md:text-base">
                      Quarterly Benefits
                    </span>
                    <p className="text-xs text-[#8E8E8E] md:text-sm">
                      {USER_TYPE === UserType.APPLICANT ? (
                        `Up to ${pricing.quarterly.total} applications over 3 months with priority matching and advanced filtering.`
                      ) : (
                        `Up to ${pricing.quarterly.total} candidate matches over 3 months with priority screening and advanced analytics.`
                      )}
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <div className="flex items-start">
                  <span className="mr-3 mt-1 text-xl">🏆</span>
                  <div>
                    <span className="block text-sm font-bold text-[#6438C2] md:text-base">
                      Annual Premium
                    </span>
                    <p className="text-xs text-[#8E8E8E] md:text-sm">
                      {USER_TYPE === UserType.APPLICANT ? (
                        `Up to ${pricing.annual.total} applications per year with premium support, advanced analytics, and exclusive opportunities.`
                      ) : (
                        `Up to ${pricing.annual.total} candidate matches per year with dedicated support, hiring analytics, and exclusive talent access.`
                      )}
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            {/* Additional Features */}
            <div className="mt-6 rounded-lg bg-white p-4">
              <h5 className="mb-3 text-sm font-bold text-gray-800">Premium Features:</h5>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Advanced AI matching algorithm
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Real-time application tracking
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  {USER_TYPE === UserType.APPLICANT ? 'Custom cover letter generation' : 'Candidate background screening'}
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Priority customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SubscriptionModal);
