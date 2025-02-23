import React from "react";
import { ArrowDown } from "../../../../assets/icons";

interface StepFourProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const CreateJobStepFour: React.FC<StepFourProp> = ({ handleNext, handlePrev }) => {
  return (
    <div className='w-full flex flex-col items-center gap-6 py-6'>
    <div className="w-[96%] max-w-[900px] h-[600px] bg-white flex flex-col items-center justify-center rounded-[10px]">
           <div className="w-[95%] border border-[#E6E6E6] bg-[#F7F7F7] min-h-[517px] rounded-[15px] flex flex-col items-center gap-6">
           <div className="w-[90%] flex flex-col py-6 gap-3">
           <label className="w-full text-[#000000]">Skill Set</label>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-[4%]">
                  <div className="sm:w-[80%] bg-white border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                    <input type="text" className="w-full outline-none bg-transparent" placeholder='search and select skill set' />
                    <img src={ArrowDown} alt="ArrowDown" />
                  </div>
                  <div className=" bg-white border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                    <input type="text" className="w-full outline-none bg-transparent" placeholder='Years of experience' />
                  </div>
                </div>
           </div>
           </div>
         </div>
 <div className='w-[96%] max-w-[900px] flex justify-end gap-6 mx-2'>
    <button className='px-10 py-[13px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] self-end' onClick={handlePrev}>Back</button>
    <button className='px-10 py-[13px] bg-[#6438C2] text-white rounded-[15px]' onClick={handleNext}>Proceed</button>
    </div>
 </div>
  );
};

export default CreateJobStepFour;



// zustandStore.js
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// const useJobFormStore = create(
//   persist(
//     (set) => ({
//       formData: {
//         title: '',
//         company: '',
//         startDate: '',
//         endDate: '',
//         description: '',
//         responsibility: '',
//         department: '',
//         jobType: '',
//         currency: 'USD',
//         skillSet: [],
//         exactAmount: '',
//         maximumAmount: '',
//         minimumAmount: '',
//         expectedSalary: '',
//         location: '',
//         preferredCandidateCountry: [],
//         preferredCandidatePreviousCompany: [],
//         preferredCandidateUniversity: []
//       },
//       updateFormData: (field, value) => set((state) => ({
//         formData: { ...state.formData, [field]: value }
//       })),
//       resetForm: () => set({
//         formData: {
//           title: '', company: '', startDate: '', endDate: '', description: '', responsibility: '',
//           department: '', jobType: '', currency: 'USD', skillSet: [], exactAmount: '',
//           maximumAmount: '', minimumAmount: '', expectedSalary: '', location: '',
//           preferredCandidateCountry: [], preferredCandidatePreviousCompany: [], preferredCandidateUniversity: []
//         }
//       })
//     }),
//     {
//       name: 'job-form-storage',
//       getStorage: () => sessionStorage,
//     }
//   )
// );

// export default useJobFormStore;

// // MultiStepForm.js
// import { useState } from 'react';
// import useJobFormStore from './zustandStore';

// const MultiStepForm = () => {
//   const { formData, updateFormData } = useJobFormStore();
//   const [step, setStep] = useState(1);

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   return (
//     <div>
//       {step === 1 && (
//         <div>
//           <h2>Job Details</h2>
//           <input type="text" placeholder="Job Title" value={formData.title} onChange={(e) => updateFormData('title', e.target.value)} />
//           <input type="text" placeholder="Company" value={formData.company} onChange={(e) => updateFormData('company', e.target.value)} />
//           <button onClick={nextStep}>Next</button>
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <h2>Salary & Expectations</h2>
//           <input type="number" placeholder="Exact Amount" value={formData.exactAmount} onChange={(e) => updateFormData('exactAmount', e.target.value)} />
//           <input type="number" placeholder="Expected Salary" value={formData.expectedSalary} onChange={(e) => updateFormData('expectedSalary', e.target.value)} />
//           <button onClick={prevStep}>Back</button>
//           <button onClick={nextStep}>Next</button>
//         </div>
//       )}

//       {step === 3 && (
//         <div>
//           <h2>Preferred Candidate</h2>
//           <input type="text" placeholder="Preferred Country" value={formData.preferredCandidateCountry.join(', ')} onChange={(e) => updateFormData('preferredCandidateCountry', e.target.value.split(','))} />
//           <input type="text" placeholder="Previous Company" value={formData.preferredCandidatePreviousCompany.join(', ')} onChange={(e) => updateFormData('preferredCandidatePreviousCompany', e.target.value.split(','))} />
//           <button onClick={prevStep}>Back</button>
//           <button onClick={nextStep}>Next</button>
//         </div>
//       )}

//       {step === 4 && (
//         <div>
//           <h2>Review & Submit</h2>
//           <pre>{JSON.stringify(formData, null, 2)}</pre>
//           <button onClick={prevStep}>Back</button>
//           <button onClick={() => alert('Form Submitted!')}>Submit</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiStepForm;
