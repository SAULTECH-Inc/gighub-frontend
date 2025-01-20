
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import JobMatchCard from "../components/ui/JobMatchCard.tsx";

export const ApplicantDashboard = () => {
    return (
        <>
            <ApplicantNavBar />
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Header Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Jobs Applied</h3>
                        <p className="text-2xl font-bold text-purple-600">123k</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Shortlisted</h3>
                        <p className="text-2xl font-bold text-orange-500">10k</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Pending</h3>
                        <p className="text-2xl font-bold text-yellow-500">123k</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-12 gap-4">
                    {/* Left Column */}
                    <div className="col-span-8 space-y-4">
                        {/* Job Match Section */}
                        <JobMatchCard
                            title="Visual Designer"
                            company="Facebook"
                            tags={['UIUX', 'Blender']}
                            description="The Visual Designer conveys design concepts into wireframes and high fidelity, quality prototypes to match project requirements, objectives, and brand guide."
                            location="Lagos, Nigeria"
                            type="Full-Time"
                            applicants={76}
                            daysLeft={4}
                        />


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

                    {/* Right Column */}
                    <div className="col-span-4 space-y-4">
                        {/* Application Summary */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Application Summary</h2>
                            <ul>
                                <li className="flex justify-between">
                                    <span>Onsite</span>
                                    <span className="text-green-500 font-bold">230</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Remote</span>
                                    <span className="text-blue-500 font-bold">300</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Hybrid</span>
                                    <span className="text-orange-500 font-bold">300</span>
                                </li>
                            </ul>
                        </div>

                        {/* Messages */}
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
                </div>
            </div>
        </>
    );
};
