import ArrowIcon from "../../../assets/icons/circle-arrow.png";
import { currencyAbbreviationToSymbol } from "../../../utils/constants.ts";
import {
  calculateNextSubscriptionDate,
  subCycle,
  USER_TYPE,
} from "../../../utils/helpers.ts";
import { useAuth } from "../../../store/useAuth.ts";
import { UserType } from "../../../utils/enums.ts";
import { useSubscriptionStore } from "../../../store/useSubscriptionStore.ts";
import { UserSubscriptionResponse } from "../../../utils/types";

const MonthlyPlan = () => {
  const { userType } = useAuth();
  const { subscription } = useSubscriptionStore();

  const handleUpgrade = async () => {
    if (USER_TYPE === UserType.APPLICANT) {
      /* empty */
    }
  };

  //calculate next subscription

  return (
    <div className="flex w-[95%] flex-col gap-6 py-10 md:flex-row md:px-10">
      {/* Left Box - Monthly Plan */}
      <div className="flex h-[192px] w-full flex-col justify-between rounded-lg bg-white p-5 shadow md:flex-1">
        {/* Top Row: Monthly Plan & Price */}
        <div className="flex items-center justify-between">
          {/* Monthly Plan Tag */}
          <div className="flex h-[30px] w-[116px] items-center justify-center bg-[#6438C2] px-3 py-1 text-xs font-bold text-white">
            {subscription?.subscription?.billingCycle} Plan
          </div>
          {userType === UserType.APPLICANT && (
            <div className="text-xs md:text-sm">Auto Apply</div>
          )}

          {/* Pricing */}
          <div className="flex items-start">
            <p className="text-[16px] font-bold leading-none text-black md:text-[28px]">
              {
                currencyAbbreviationToSymbol[
                  subscription?.subscription?.currency || "$"
                ]
              }
              {subscription?.subscription?.price}
            </p>
            <span className="relative top-[-1px] ml-1 text-sm leading-[19.2px] tracking-[0%] text-[#8E8E8E]">
              /{subCycle(subscription as UserSubscriptionResponse)}
            </span>
          </div>
        </div>

        {/* Middle Row: Application Count & Upgrade Button */}
        <div className="mt-3 flex items-center justify-between">
          {/* Application Usage */}
          {subscription?.isActive && (
            <div className="flex h-[42px] w-[137px] items-center justify-center rounded-[10px] bg-[#F7F6F7] text-orange shadow-sm">
              <p className="text-center">Active</p>
            </div>
          )}

          {/* Upgrade Button */}
          <button
            onClick={handleUpgrade}
            className="flex h-[42px] w-[137px] items-center justify-center gap-[10px] rounded-[10px] bg-[#6438C2] text-[14px] font-bold text-white"
            style={{ padding: "9px 42px" }}
          >
            Upgrade
            <img src={ArrowIcon} alt="Arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right Box - Next Payment */}
      <div className="flex h-[192px] w-full flex-col justify-between rounded-lg bg-white p-5 shadow md:flex-1">
        {/* Payment Header */}
        <p className="text-md font-bold text-black">Next Payment</p>

        {/* Payment Date */}
        <p className="font-lato text-[20px] font-bold leading-[24px] tracking-[0%]">
          {subscription && calculateNextSubscriptionDate(subscription)}
        </p>

        {/* Manage Payment Button */}
        <button className="flex h-[42px] w-[180px] items-center justify-center gap-[10px] self-end rounded-[10px] bg-[#6438C2] text-center text-[14px] font-bold text-white">
          Manage Payment
          <img src={ArrowIcon} alt="Arrow" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MonthlyPlan;
