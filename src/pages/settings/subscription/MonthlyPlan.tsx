import ArrowIcon from "../../../assets/icons/circle-arrow.png";
import {ISubscription, useUserSubscription} from "../../../store/useUserSubscription.ts";
import {currencyAbbreviationToSymbol} from "../../../utils/constants.ts";
import {calculateNextSubscriptionDate, subCycle} from "../../../utils/helpers.ts";
import {useAuth} from "../../../store/useAuth.ts";
import {UserType} from "../../../utils/enums.ts";


const MonthlyPlan = () => {
    const {userType} = useAuth();
    const {currentSubscription} = useUserSubscription();

    //calculate next subscription

    return (<div className="w-[95%] flex flex-col md:flex-row gap-6 md:px-10 py-10">
            {/* Left Box - Monthly Plan */}
            <div
                className="w-full md:flex-1 h-[192px] bg-white shadow rounded-lg p-5 flex flex-col justify-between"
            >
                {/* Top Row: Monthly Plan & Price */}
                <div className="flex justify-between items-center">
                    {/* Monthly Plan Tag */}
                    <div
                        className="bg-[#6438C2] text-white text-xs font-bold px-3 py-1  w-[116px] h-[30px] flex items-center justify-center">
                        {currentSubscription?.billingCycle} Plan
                    </div>
                    {
                        userType === UserType.APPLICANT && (
                            <div className="text-xs md:text-sm">
                                Auto Apply
                            </div>
                        )
                    }

                    {/* Pricing */}
                    <div className="flex items-start">
                        <p className="text-[16px] md:text-[28px] font-bold text-black leading-none">{currencyAbbreviationToSymbol[currentSubscription?.currency || "$"]}{currentSubscription?.price}</p>
                        <span
                            className="text-[#8E8E8E] text-sm leading-[19.2px] tracking-[0%] ml-1 relative top-[-1px]">
        /{subCycle(currentSubscription as ISubscription)}
    </span>
                    </div>
                </div>

                {/* Middle Row: Application Count & Upgrade Button */}
                <div className="flex justify-between items-center mt-3">
                    {/* Application Usage */}
                    {
                        currentSubscription?.isActive && (<div
                            className="rounded-[10px] shadow-sm flex justify-center items-center bg-[#F7F6F7] text-orange w-[137px] h-[42px]">
                            <p className="text-center">Active</p>
                        </div>)
                    }

                    {/* Upgrade Button */}
                    <button
                        className="bg-[#6438C2] text-white text-[14px] font-bold w-[137px] h-[42px] rounded-[10px] flex items-center justify-center gap-[10px]"
                        style={{padding: "9px 42px"}}
                    >
                        Upgrade
                        <img src={ArrowIcon} alt="Arrow" className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {/* Right Box - Next Payment */}
            <div
                className="w-full md:flex-1 h-[192px] bg-white shadow rounded-lg p-5 flex flex-col justify-between"
            >
                {/* Payment Header */}
                <p className="text-black font-bold text-md">Next Payment</p>

                {/* Payment Date */}
                <p className="text-[20px] font-bold leading-[24px] tracking-[0%] font-lato">
                    {currentSubscription && calculateNextSubscriptionDate(currentSubscription as ISubscription)}
                </p>

                {/* Manage Payment Button */}
                <button
                    className="bg-[#6438C2] text-white text-[14px] text-center font-bold w-[180px] h-[42px] rounded-[10px] flex items-center justify-center self-end gap-[10px]">
                    Manage Payment
                    <img src={ArrowIcon} alt="Arrow" className="w-4 h-4"/>
                </button>
            </div>
        </div>);
};

export default MonthlyPlan;
