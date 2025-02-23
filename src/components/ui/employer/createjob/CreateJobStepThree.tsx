import React, { useState } from 'react'
import { ArrowDown } from '../../../../assets/icons';

interface StepThreeProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const CreateJobStepThree: React.FC<StepThreeProp> = ({handleNext, handlePrev}) => {

  const [exactAmount, setExactAmount] = useState(true);

  return (
    <div className='w-full flex flex-col items-center gap-6 py-6'>
       <div className="w-[96%] max-w-[900px] h-[600px] bg-white flex flex-col items-center justify-center rounded-[10px]">
              <div className="w-[95%] flex flex-col gap-6 px-10">
                <label className="text-[#000000]">Experience in years</label>
                <div className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px] flex gap-3">
                  <input type="text" placeholder="Input in years" className="w-full outline-none" />
                </div>
                <label className="w-full text-[#000000]">Expected salaries</label>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-[4%]">
                  <div className='flex gap-10'>
                  <label>
                    <input type="radio" name="option" value="true" onClick={() =>{setExactAmount(true)}} /> Exact Amount
                  </label>
                  <label>
                    <input type="radio" name="option" value="true" onClick={() =>{setExactAmount(true)}} /> Range
                  </label>
                  </div>
                  { exactAmount && <div className="sm:w-[48%] border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                    <input type="text" className="w-full outline-none" placeholder='Exact Amount' />
                  </div>}
                  {/* <div className="sm:w-[48%] border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                    <input type="text" className="w-full outline-none" placeholder='$55000 - $4000' />
                  </div> */}
                </div>
                <label className="text-[#000000]">Location</label>
                <div className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px] flex gap-3">
                  <input type="text" placeholder="Select location" className="w-full outline-none" />
                  <img src={ArrowDown} alt="ArrowDown" />
                </div>
              </div>
            </div>
    <div className='w-[96%] max-w-[900px] flex justify-end gap-6 mx-2'>
       <button className='px-10 py-[13px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] self-end' onClick={handlePrev}>Back</button>
       <button className='px-10 py-[13px] bg-[#6438C2] text-white rounded-[15px]' onClick={handleNext}>Proceed</button>
       </div>
    </div>
  )
}

export default CreateJobStepThree;