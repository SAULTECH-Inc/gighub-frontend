import microscope from '../../assets/icons/microscope.svg';
import certificate from '../../assets/icons/certificate.svg';
import location from '../../assets/icons/locations.svg';

const CompanyNavbar = () => {
  return (
    <header className='bg-white p-3  '>
    <nav className='lg:flex items-center justify-between rounded-[16px] hidden'>
        <div className="flex flex-col">
            <h2 className='text-black font-bold text-[20px]'>Find Companies Easiy</h2>
            <span className='text-sm font-bold'>Sunday 6, 2024</span>
        </div>
                <div
                    className="flex w-[367px] h-[43px] items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
                    <img src={microscope} alt="microscope" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Find job"
                        className="bg-transparent border-none h-full focus:border-none focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <div
                    className="flex w-[367px] h-[43px] items-center rounded-[16px] border-[#F9F9F9] border-2 bg-[#F9F9F9] focus:border-[#ccc]">
                    <img src={certificate} alt="certificate" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Certification"
                        className="bg-transparent border-none h-full focus:border-none focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <div
                    className="flex w-[367px] h-[43px] items-center rounded-[16px] border-[#F9F9F9] border-2 bg-[#F9F9F9] focus:border-[#ccc] mr-10">
                    <img src={location} alt="location" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Location"
                        className="bg-transparent border-none h-full focus:border-none focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
          </div>
    </nav>
    <div className='lg:hidden flex'>
    <div className="flex w-full h-[43px] items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
        <img src={microscope} alt="microscope" className="m-2"/>
        <input
            type="text"
            placeholder="Find job"
            className="bg-transparent border-none h-full focus:border-none focus:ring-0 focus:outline-none px-4 py-2 w-full"
        />
    </div>
    </div>
    </header>
  )
}

export default CompanyNavbar