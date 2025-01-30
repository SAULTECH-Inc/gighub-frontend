import { FC } from "react";

const ApplicantMessages: FC = () => {
    return (
        <>
            <div className="h-[365px] mx-auto">
                <div className="bg-white p-4 w-full rounded-[16px] shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[20px] font-semibold">Messages</h2>
                        <button className="text-[#6B5AED] text-sm">See all</button>
                    </div>
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">

                                <div className="w-[50px] h-[50px] bg-[#D9D9D9] rounded-full"></div>
                                <div>
                                    <h3 className="font-medium">A.S Abubakar</h3>
                                    <p className="text-sm text-gray-500">
                                        Hi sir, my name is A.s Abubakar
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[13px] text-[#56E5A1]">Yesterday</span>
                                <span className="bg-[#6B5AED] text-white text-xs rounded-full px-2 py-1 ml-2">2</span>
                            </div>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-[50px] h-[50px] bg-[#D9D9D9] rounded-full"></div>
                                <div>
                                    <h3 className="font-medium">Jumaima Nuhu</h3>
                                    <p className="text-sm text-gray-500">
                                        Yes I will do it and send tomorrow
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-[50px] h-[50px] bg-[#D9D9D9] rounded-full"></div>
                                <div>
                                    <h3 className="font-medium">John Abel</h3>
                                    <p className="text-sm text-gray-500">
                                        No issue, catch you tomorrow
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApplicantMessages;
