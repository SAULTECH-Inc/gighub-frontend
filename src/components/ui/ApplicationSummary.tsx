import {FC} from "react";

const ApplicationSummary: FC = () => {
    return (
        <div className="bg-white p-4 rounded-[16px] shadow h-[382px] w-full flex flex-col justify-between pb-20 px-8">
            <h2 className="justify-center flex text-xl font-lato font-[20px] font-bold-[700] mb-4">Application Summary</h2>
            <hr className="w-full mx-auto mb-4 border-t border-[#E6E6E6]"/>

            {/* Horizontal Bar */}
            <div className="flex justify-center space-x-1 mb-6 w-full">
                <span className="h-[12px] w-[107px] bg-[#6438C2] rounded-l-full"></span>
                <span className="h-[12px] w-[83px] bg-[#FD7E14]"></span>
                <span className="h-[12px] w-[131px] bg-[#56E5A1] rounded-r-full"></span>
            </div>

            {/* List Items */}
            <ul className="space-y-8">
                {/* Onsite */}
                <li className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-[#56E5A1]"></div>
                        <span className="font-[16px] text-gray-700">Onsite</span>
                    </div>
                    <span className="text-green-500 font-bold">230</span>
                </li>

                {/* Remote */}
                <li className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-[#6438C2]"></div>
                        <span className="font-[16px] text-gray-700">Remote</span>
                    </div>
                    <span className="text-blue-500 font-bold">300</span>
                </li>

                {/* Hybrid */}
                <li className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-[#FD7E14]"></div>
                        <span className="font-[16px] text-gray-700">Hybrid</span>
                    </div>
                    <span className="text-orange-500 font-bold">300</span>
                </li>
            </ul>
        </div>

    );
};

export default ApplicationSummary;
