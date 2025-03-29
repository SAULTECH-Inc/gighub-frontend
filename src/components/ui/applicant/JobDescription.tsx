import paystack from "../../../assets/images/paystack.png";
import circle from "../../../assets/images/circle.png";

const JobDescription = () => {
  return (
    <div className="relative rounded-[16px] sm:w-[650px] w-full cursor-pointer bg-white sm:p-4 p-2 flex flex-col mx-auto">
        <div className="flex items-center gap-2">
            <div className="bg-[#F7F8FA] rounded-md w-12 sm:w-20 h-12 sm:h-20 flex items-center justify-center">
                <img src={paystack} alt="jumia" className="w-10 sm:w-16 h-10 sm:h-16 object-cover" />
            </div>
            <div className="sm:flex flex-col hidden">
                <h2 className="text-black font-lato font-medium text-[20px]">Fullstack Developer</h2>
                <div className="flex gap-10">
                    <span className="text-sm text-gray font-bold">Paystack Inc</span>
                    <span className="text-sm text-gray font-bold">170 people have applied to this job</span>
                </div>
                <p className="text-sm text-gray font-bold mt-3">3 people from your network work in this company, or once 
                worked here, <span className="text-[#6438C2]"><a href="">see connections</a></span></p>
            </div>
            <div className="sm:hidden flex-col block">
                <h2 className="text-black font-lato font-medium sm:text-[20px] text-[18px]">Fullstack Developer</h2>
                <span className="text-sm text-gray font-bold">Paystack Inc</span>
            </div>
        </div>
        <p className="text-sm text-gray font-bold mt-3 block sm:hidden">3 people from your network work in this company, or once 
        worked here, <span className="text-[#6438C2]"><a href="">see connections</a></span></p>
        <hr className="w-full h-[1px] text-[#E6E6E6] mt-16" />
        <div className="flex items-center justify-between gap-4 mt-4">
            <div className="flex flex-col items-center justify-center bg-[#6438C230] h-[74px] sm:h-[84px] w-[94px] sm:w-[166px] rounded-[10px]">
                <span className="text-[16px] font-normal text-black">Job Type</span>
                <span  className="text-sm font-normal text-black">Full Time</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#6438C230] h-[74px] sm:h-[84px] w-[94px] sm:w-[166px] rounded-[10px]">
                <span className="text-[16px] font-normal text-black">Experience</span>
                <span  className="text-sm font-normal text-black">Min. 1 year</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#6438C230] h-[74px] sm:h-[84px] w-[94px] sm:w-[166px] rounded-[10px]">
                <span className="text-[16px] font-normal text-black">Experience</span>
                <span  className="text-sm font-normal text-black">$400/Month</span>
            </div>
        </div>
        <div className="flex flex-col items-start mt-5">
            <h3 className="text-black font-bold text-[18px]">About the role</h3>
            <p className="text-black font-normal text-sm mt-3 leading-8">A Full Stack Developer designs, develops, and maintains both the front-end and backend of web applications, ensuring seamless user experiences and robust functionality. They work with a range of technologies, including databases, APIs, and deployment tools.</p>
        </div>
        <div className="mt-5">
            <h3 className="text-black font-bold text-[18px]">About the role</h3>
            <ul className="mt-3 flex flex-col gap-y-4">
                <li className="flex items-center space-x-3">
                    <img src={circle} />
                    <span>Develop and maintain front-end interfaces using HTML, CSS, and JavaScript frameworks 
                    like React or Angular.</span>
                </li>
                <li className="flex items-center space-x-3">
                    <img src={circle} />
                    <span>Build and manage back-end logic with server-side languages such as Node.js, Python, 
                    or Java.</span>
                </li>
                <li className="flex items-center space-x-3">
                    <img src={circle} />
                    <span>Design and optimize databases using SQL or NoSQL technologies like MySQL or 
                    MongoDB.</span>
                </li>
                <li className="flex items-center space-x-3">
                    <img src={circle} />
                    <span>Create and integrate APIs for seamless communication between front-end and 
                    back-end.</span>
                </li>
            </ul>
        </div>
        <hr className="w-full h-[1px] text-[#E6E6E6] mt-16" />
            <div className="sm:flex items-center justify-between mt-5">
                <span className="text-sm text-gray sm:block hidden">Posted 1 hour ago</span>
                <div className="flex items-center justify-between sm:space-x-4">
                    <button className="border-[1px] border-[#E6E6E6] px-4 py-2 rounded-[10px] text-black">Refer</button>
                    <button className="border-[1px] border-[#6438C2] px-4 py-2 rounded-[10px] bg-[#6438C2] text-white">Quick Apply</button>
                </div>
            </div>
    </div>
  )
}

export default JobDescription