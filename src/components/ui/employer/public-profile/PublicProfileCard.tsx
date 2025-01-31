import React from "react";
import Image7 from "../../../../assets/images/image7.png";


const PublicProfileCard: React.FC = () => {
    return (

        <div
            className="items-center justify-between bg-[#6B5AED] text-white p-4 rounded-t-[16px] w-[1366px] h-[115px] -ml-4">
            <section className="bg-white p-6 w-[1309px] h-[130px] shadow flex justify-between items-center ml-4 mt-10">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        {/* Company logo or image */}
                        <img
                            src={Image7} // Replace with your logo URL
                            alt="Company Logo"
                            className="w-fit h-fit border-[4px] bg-white border-white"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl text-black font-bold">Fundy Inc</h2>
                        <p className="text-black">Innovating Tomorrow Today</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button
                        className="px-6 py-2 bg-[#F7F7F7]  text-black rounded-[10px] h-[45px] w-[150px]  transition duration-200">
                        Follow us
                    </button>
                    <button
                        className="px-6 py-2 bg-[#6438C2] text-white rounded-lg hover:bg-purple-700 transition duration-200">
                        Send Message
                    </button>
                </div>
            </section>
        </div>
    );
};

export default PublicProfileCard;
