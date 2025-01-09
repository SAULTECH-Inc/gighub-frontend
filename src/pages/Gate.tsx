import { FC } from "react";

const Gate: FC = () => {
    return <>
        <div className="flex flex-col lg:flex-row h-screen bg-white">
            <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-white p-8">
                <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-purple-500 flex justify-center items-center">
                        <span className="text-white text-2xl font-bold">G</span>
                    </div>
                    <h1 className="text-xl font-bold ml-2 text-gray-700">GigHub</h1>
                </div>
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    How are You Planning To Use JobberX
                </h2>
                <p className="text-gray-600 text-center mt-2">
                    We will streamline your setup experience accordingly
                </p>
                <div className="flex mt-8 space-x-6">
                    <button
                        className="flex flex-col items-center bg-gray-100 hover:bg-gray-200 p-4 rounded-lg shadow-sm">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex justify-center items-center">
                            <span className="text-purple-500 text-xl font-bold">JS</span>
                        </div>
                        <p className="mt-2 text-gray-700">As a Job Seeker</p>
                    </button>
                    <button
                        className="flex flex-col items-center bg-gray-100 hover:bg-gray-200 p-4 rounded-lg shadow-sm">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex justify-center items-center">
                            <span className="text-green-500 text-xl font-bold">E</span>
                        </div>
                        <p className="mt-2 text-gray-700">As an Employer</p>
                    </button>
                </div>
                <div className="flex justify-between w-full mt-8">
                    <button className="text-purple-500 hover:underline">Back</button>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg">
                        Proceed
                    </button>
                </div>
            </div>
            <div
                className="lg:w-1/2 w-full flex flex-col justify-center items-center text-white relative">
               <img className="h-[100%] w-[100%]" src="../../src/assets/images/img.png" alt="right"/>
            </div>
        </div>
    </>
        ;
};

export default Gate;
