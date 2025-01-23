import {FC} from "react";

const ApplicantRecentApplications: FC = ()=>{
    return <>
        <div className="col-span-8 space-y-4">


            {/* Recent Applications */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
                <ul>
                    <li className="flex justify-between items-center mb-3">
                        <span>Product Designer - Pending</span>
                        <button className="text-purple-600">View Details</button>
                    </li>
                    <li className="flex justify-between items-center mb-3">
                        <span>Product Designer - Interview Scheduled</span>
                        <button className="text-orange-500">View Details</button>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>Product Designer - Hired</span>
                        <button className="text-green-500">View Details</button>
                    </li>
                </ul>
            </div>
        </div>
    </>
}

export default ApplicantRecentApplications;