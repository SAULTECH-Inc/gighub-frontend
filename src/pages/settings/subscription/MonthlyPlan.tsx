import { currencyAbbreviationToSymbol } from "../../../utils/constants.ts";
import { calculateNextSubscriptionDate, subCycle, USER_TYPE } from "../../../utils/helpers.ts";
import { useAuth } from "../../../store/useAuth.ts";
import { UserType } from "../../../utils/enums.ts";
import { useSubscriptionStore } from "../../../store/useSubscriptionStore.ts";
import { UserSubscriptionResponse } from "../../../utils/types";
import { RiVipCrownLine, RiArrowRightLine, RiRobotLine } from "react-icons/ri";

const MonthlyPlan = () => {
  const { userType } = useAuth();
  const { subscription } = useSubscriptionStore();

  const handleUpgrade = async () => {
    if (USER_TYPE === UserType.APPLICANT) {
      // Handle upgrade logic
    }
  };

  const handleManagePayment = () => {
    // Handle payment management
  };

  return (
    <section className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <RiVipCrownLine className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Subscription Management
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Manage your subscription plan and billing information.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Box - Current Plan */}
        <div className="flex h-[240px] w-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-gray-200 md:flex-1">
          {/* Top Section */}
          <div className="space-y-4">
            {/* Plan Badge and Features */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center px-4 py-2 bg-[#6438C2] text-white rounded-lg text-sm font-bold">
                {subscription?.subscription?.billingCycle || "Monthly"} Plan
              </div>
              {userType === UserType.APPLICANT && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <RiRobotLine className="h-4 w-4 text-[#6438C2]" />
                  <span className="text-sm font-medium">Auto Apply</span>
                </div>
              )}
            </div>

            {/* Pricing Display */}
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-black leading-none">
                {currencyAbbreviationToSymbol[subscription?.subscription?.currency || "$"]}
                {subscription?.subscription?.price || "0"}
              </span>
              <span className="text-sm text-[#8E8E8E] leading-[19.2px]">
                /{subCycle(subscription as UserSubscriptionResponse)}
              </span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            {/* Status Indicator */}
            {subscription?.isActive && (
              <div className="flex h-[42px] w-[120px] items-center justify-center rounded-[10px] bg-[#F7F6F7] shadow-sm">
                <span className="text-center font-medium text-gray-700">Active</span>
              </div>
            )}

            {/* Upgrade Button */}
            <button
              onClick={handleUpgrade}
              className="flex h-[42px] w-[137px] items-center justify-center gap-[10px] rounded-[10px] bg-[#6438C2] hover:bg-[#5730af] text-[14px] font-bold text-white transition-colors duration-200 shadow-lg"
            >
              Upgrade
              <RiArrowRightLine className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Box - Next Payment */}
        <div className="flex h-[240px] w-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-gray-200 md:flex-1">
          {/* Header */}
          <div>
            <h3 className="text-lg font-bold text-black mb-2">Next Payment</h3>

            {/* Payment Date */}
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="text-2xl font-bold text-black leading-tight">
                {subscription ? calculateNextSubscriptionDate(subscription) : "Not scheduled"}
              </p>
            </div>

            {/* Amount */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-lg font-semibold text-black">
                {currencyAbbreviationToSymbol[subscription?.subscription?.currency || "$"]}
                {subscription?.subscription?.price || "0.00"}
              </p>
            </div>
          </div>

          {/* Manage Payment Button */}
          <div className="flex justify-end">
            <button
              onClick={handleManagePayment}
              className="flex h-[42px] w-[180px] items-center justify-center gap-[10px] rounded-[10px] bg-[#6438C2] hover:bg-[#5730af] text-[14px] font-bold text-white transition-colors duration-200 shadow-lg"
            >
              Manage Payment
              <RiArrowRightLine className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyPlan;