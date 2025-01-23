import React from "react";

const SubscriptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Container with Animation */}
            <div className="bg-[#F7F7F7] shadow-lg p-6 relative animate-zoomIn"
                 style={{width: "806px", height: "706px"}}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 text-[32px] hover:text-gray-700 focus:outline-none"
                    aria-label="Close Modal"
                >
                    &times;
                </button>

                {/* Header */}
                <h2 className="text-[24px] font-semibold text-left mb-6">Subscribe to Auto Apply</h2>

                {/* Content Section */}
                <div
                    className="flex gap-6 bg-white w-[728px] h-[580px] rounded-[16px] justify-around items-center mx-auto">
                    {/* Subscription Plans */}
                    <div className="w-[388px] h-[480px] flex flex-col space-y-10">
                        <div
                            className="w-full h-[68px] cursor-pointer flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white hover:scale-105 transition-transform duration-300 ease-in-out"
                        >
                            <div className="flex items-center">
                                <div className="text-yellow-300 text-2xl mr-4">⭐</div>
                                <div>
                                    <h3 className="font-semibold">Monthly</h3>
                                    <p className="text-sm">200 daily Applications</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg">$20</span>
                        </div>

                        <div
                            className="w-full h-[68px] cursor-pointer flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-r from-[#6438C2] to-[#65FF81] text-white hover:scale-105 transition-transform duration-300 ease-in-out"
                        >
                            <div className="flex items-center">
                                <div className="text-blue-300 text-2xl mr-4">💎</div>
                                <div>
                                    <h3 className="font-semibold">Quarterly</h3>
                                    <p className="text-sm">200 daily Applications</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg">$20</span>
                        </div>

                        <div
                            className="w-full h-[68px] cursor-pointer flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white hover:scale-105 transition-transform duration-300 ease-in-out"
                        >
                            <div className="flex items-center">
                                <div className="text-yellow-700 text-2xl mr-4">📦</div>
                                <div>
                                    <h3 className="font-semibold">Yearly</h3>
                                    <p className="text-sm">200 daily Applications</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg">$20</span>
                        </div>

                        <p className="text-[16px] w-[382px] h-[57px] text-[#8E8E8E] text-justify">
                            Auto Apply is a premium feature designed to save you time and effort by automatically
                            applying for opportunities that match your profile.
                        </p>

                        {/* Footer */}
                        <button
                            onClick={onClose}
                            className="w-full h-[39px] bg-[#6438C2] text-white font-bold font-lato py-2 rounded-[10px] hover:bg-purple-700 hover:scale-105 transition-all duration-300 focus:outline-none"
                        >
                            Start Your 7 Days Free Trial
                        </button>
                    </div>

                    {/* Services Section */}
                    <div className="w-[245px] h-[480px] bg-[#F7F7F7] p-4">
                        <h4 className="font-bold mb-4 text-black text-[16px]">Services</h4>
                        <ul className="space-y-4">
                            <li className="flex flex-col">
                                <span className="text-[#6438C2] font-bold text-[16px] mb-2">Monthly</span>
                                <div className="flex items-start">
                                    <span className="text-red-500 text-2xl mr-2">🎯</span>
                                    <p className="text-[#8E8E8E] text-[13px]">
                                        200 Automatic Applications Per Month – Apply effortlessly to top opportunities
                                        without lifting a finger.
                                    </p>
                                </div>
                                <hr className="mt-4 border-gray-300"/>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[#6438C2] font-bold text-[16px] mb-2">Quarterly</span>
                                <div className="flex items-start">
                                    <span className="text-red-500 text-2xl mr-2">🎯</span>
                                    <p className="text-[#8E8E8E] text-[13px]">
                                        400 Automatic Applications Per Quarter – Effortlessly apply to more
                                        opportunities.
                                    </p>
                                </div>
                                <hr className="mt-4 border-gray-300"/>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[#6438C2] font-bold text-[16px] mb-2">Yearly</span>
                                <div className="flex items-start">
                                    <span className="text-red-500 text-2xl mr-2">🎯</span>
                                    <p className="text-[#8E8E8E] text-[13px]">
                                        500 Automatic Applications Per Year – Apply effortlessly to the best
                                        opportunities all year round.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
