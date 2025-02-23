import React from 'react'
import RichTextEditor from '../../../common/RichTextEditor';

interface StepOneProp {
    handleNext: () => void;
}

const CreateJobStepOne: React.FC<StepOneProp> = ({handleNext}) => {
  return (
    <div className='w-full flex flex-col items-center gap-6 py-6'>
       <div className='w-[96%] max-w-[900px] h-[600px] bg-white flex flex-col items-center rounded-[10px]  py-10'>
       <div className='w-full sm:w-[95%] flex flex-col gap-6 px-2 md:px-10'>
            <h2 className='text-[#000000]'>Job Description</h2>
            <RichTextEditor />
            <p className='flex self-end text-[#8E8E8E] text-[13px]'>Maximum 2000 words</p>
        </div>
       </div>
       <div className='w-[96%] max-w-[900px] flex justify-end'>
       <button className='px-10 py-[13px] bg-[#6438C2] text-white rounded-[15px]' onClick={handleNext}>Proceed</button>
       </div>

    </div>
  )
}

export default CreateJobStepOne;