import React, { useEffect, useState } from 'react'
import RichTextEditor from '../../../common/RichTextEditor';
import { useJobFormStore } from '../../../../store/useJobFormStore';

const CreateJobStepOne: React.FC = () => {
  const { job, nextStep, setJobData } = useJobFormStore();
  const [selectedOption, setSelectedOption] = useState("description");
  const [description, setDescription] = useState(job.description || '');
  const [responsibility, setResponsibility] = useState(job.responsibility || '');

  const handleSelectedOption = (type: "description" | "responsibility") => {
    setSelectedOption(type);
  };

    useEffect(() => {
      setJobData({
        ...job,
        description: description,
        responsibility: responsibility,
      });
      }, [description, responsibility]);
    

  return (
    <div className='w-full flex flex-col items-center gap-6 py-6'>
       <div className='w-[96%] max-w-[900px] h-[600px] bg-white flex flex-col items-center justify-center rounded-[10px]  py-10'>
       <div className='w-full sm:w-[95%] flex flex-col gap-6 px-2 md:px-10'>
       <div className="flex justify-between border-b-[1px] text-gray-600 mb-6">
        <div
          onClick={() => handleSelectedOption("description")}
          className={`cursor-pointer text-center py-2 flex-1 ${
            selectedOption === "description"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Job Description
        </div>
        <div
          onClick={() => handleSelectedOption("responsibility")}
          className={`cursor-pointer text-center py-2 flex-1 ${
            selectedOption === "responsibility"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Job Responsibility
        </div>
      </div>
            {selectedOption === "description" ? <h2 className='text-[#000000]'>Job Description</h2> : <h2 className='text-[#000000]'>Job Responsibility</h2>}
            {
              selectedOption === "description" ? (
                <RichTextEditor
                  value={description}
                  onChange={(value) => setDescription(value)}
                />
              ) : (
                <RichTextEditor
                  value={responsibility}
                  onChange={(value) => setResponsibility(value)}
                />
              )
            }
            <p className='flex self-end text-[#8E8E8E] text-[13px]'>Maximum 2000 words</p>
        </div>
       </div>
       <div className='w-[96%] max-w-[900px] flex justify-end'>
       <button className='px-10 py-[13px] bg-[#6438C2] text-white rounded-[15px]' onClick={nextStep}>Proceed</button>
       </div>
    </div>
  )
}

export default CreateJobStepOne;