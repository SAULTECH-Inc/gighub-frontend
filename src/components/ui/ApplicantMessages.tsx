import {FC} from "react";

const ApplicantMessages: FC = ()=>{
    return <>
        <div className="w-[100%]">
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                <ul>
                    <li className="flex justify-between items-center">
                        <span>A.S Abubakar</span>
                        <span className="text-sm text-gray-500">Yesterday</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>Jumaima Nuhu</span>
                        <span className="text-sm text-gray-500">Today</span>
                    </li>
                </ul>
                <button className="mt-4 text-purple-600">See all</button>
            </div>
        </div>
    </>
}

export default ApplicantMessages;