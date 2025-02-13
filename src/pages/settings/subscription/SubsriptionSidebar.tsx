import BackIcon from "../../../assets/images/arrow-left-02.png"; // Replace with your actual path
import AccountIcon from "../../../assets/images/edit-user-01.png";
import NotificationIcon from "../../../assets/images/notification-02.png";
import PrivacyIcon from "../../../assets/images/user-account.png";
import SubscriptionIcon from "../../../assets/images/money1.png";


const SubscriptionSidebar = () => {
    return (
        <div className="w-[278px] h-[837px] -ml-14 bg-white rounded-[16px] p-6 shadow-md font-lato">
            {/* Back Button */}
            <div className="flex items-center text-purple-700 font-medium cursor-pointer mb-6">
                <img src={BackIcon} alt="Back" className="w-4 h-4 mr-2" />
                <span>Back</span>
            </div>

            {/* Settings Title */}
            <h2 className="text-xl font-bold mb-6">Settings</h2>

            {/* Menu Items */}
            <div className="space-y-4">
                {/* Active Item */}
                <div className="flex items-center text-gray-400 font-medium">
                    <img src={AccountIcon} alt="Account" className="w-5 h-5 mr-3" />
                    <span>Account</span>
                </div>

                {/* Inactive Items */}
                <div className="flex items-center text-gray-400 cursor-pointer">
                    <img src={NotificationIcon} alt="Notification" className="w-5 h-5 mr-3" />
                    <span>Notification</span>
                </div>

                <div className="flex items-center text-gray-400 cursor-pointer">
                    <img src={PrivacyIcon} alt="Privacy" className="w-5 h-5 mr-3" />
                    <span>Privacy</span>
                </div>

                <div className="flex items-center text-[#6438C2] cursor-pointer">
                    <img src={SubscriptionIcon} alt="Subscription" className="w-5 h-5 mr-3" />
                    <span>Subscription</span>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSidebar;
