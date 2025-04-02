import paystack from '../../assets/images/paystack-logo.svg';
import dangote from '../../assets/images/dangote-logo.svg';
import safarico from '../../assets/images/safarico.svg';
const TopHiringCompanies = ()=>{
  return  <>
        <div className="w-full h-[365px] mx-auto flex justify-center">
            <div className="bg-white p-4 w-[95%] rounded-[16px] shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[20px] font-semibold">Top Companies Hiring</h2>
                    <button className="text-[#6B5AED] text-sm">See all</button>
                </div>

                <div>
                    {/*Messages*/}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <img src={paystack} alt="Dangote Logo" className="w-[57px] h-[57px] rounded-[16px]"/>
                            <div className="flex flex-col space-y-1 py-4">
                                <h3 className="text-sm md:text-lg font-medium">Paystack Inc  .  hiring UIUX</h3>
                                <p className="text-xs md:text-sm text-gray-500">
                                    2 people in your network work here
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <img src={dangote} className="w-[57px] h-[57px] bg-[#D9D9D9] rounded-[16px]" alt="dangote"/>
                            <div className="flex flex-col space-y-1 py-4">
                                <h3 className="text-sm md:text-lg font-medium">Dangote Group  .  Analyst</h3>
                                <p className="text-xs md:text-sm text-gray-500">
                                    2 people in your network work here
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <img src={safarico} className="w-[57px] h-[57px] bg-[#D9D9D9] rounded-[16px]" alt="safarico"/>
                            <div className="flex flex-col space-y-1 py-4">
                                <h3 className="text-sm md:text-lg font-medium">Safaricom  .  Product Designer</h3>
                                <p className="text-xs md:text-sm text-gray-500">
                                    2 people in your network work here
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default TopHiringCompanies;
