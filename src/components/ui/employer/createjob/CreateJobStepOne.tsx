// import React, { useEffect, useState } from "react";
// import RichTextEditor from "../../../common/RichTextEditor";
// import { useJobFormStore } from "../../../../store/useJobFormStore";

// const CreateJobStepOne: React.FC = () => {
//   const { job, nextStep, setJobData } = useJobFormStore();
//   const [selectedOption, setSelectedOption] = useState("description");
//   const [description, setDescription] = useState(job.description || "");
//   const [responsibility, setResponsibility] = useState(job.responsibility || "");
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const handleSelectedOption = (type: "description" | "responsibility") => {
//     setSelectedOption(type);
//   };
//   const validateFields = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!setDescription) {
//       newErrors.description = "Description is required.";
//     }

//     if (!setResponsibility) {
//       newErrors.responsibility = "Responsibility is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   useEffect(() => {
//     setJobData({
//       ...job,
//       description: description,
//       responsibility: responsibility,
//     });
//   }, [description, responsibility]);

//   const handleNextStep = () => {
//     if (validateFields()) {
//       nextStep();
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center">
//       <div className="w-full max-w-[900px] h-[400px] bg-white px-2 flex flex-col items-center justify-center rounded-[10px]">
//         <div className="w-full sm:w-[95%] flex flex-col gap-2">
//           <div className="flex justify-between border-b-[1px] text-gray-600">
//             <div
//               onClick={() => handleSelectedOption("description")}
//               className={`cursor-pointer text-center text-sm flex-1 ${
//                 selectedOption === "description"
//                   ? "text-[#6438C2] border-b-4 border-[#6438C2]"
//                   : "text-gray-600"
//               }`}
//             >
//               Job Description
//             </div>
//             <div
//               onClick={() => handleSelectedOption("responsibility")}
//               className={`cursor-pointer text-center text-sm flex-1 ${
//                 selectedOption === "responsibility"
//                   ? "text-[#6438C2] border-b-4 border-[#6438C2]"
//                   : "text-gray-600"
//               }`}
//             >
//               Job Responsibility
//             </div>
//           </div>
//           {selectedOption === "description" ? (
//             <h2 className="text-[#000000] text-sm">Job Description</h2>
//           ) : (
//             <h2 className="text-[#000000] text-sm">Job Responsibility</h2>
//           )}
//           {selectedOption === "description" ? (
//             <RichTextEditor
//               value={job.description}
//               onChange={(value) => {
//                 setDescription(value as string);
//                 setErrors({
//                   ...errors,
//                   description: (value as string).trim()
//                     ? ""
//                     : "Job description is required.",
//                 });
//               }}
//             />
//           ) : (
//             <RichTextEditor
//               value={job.responsibility}
//               onChange={(value) => {
//                 setDescription(value as string);
//                 setErrors({
//                   ...errors,
//                   responsibility: (value as string).trim()
//                     ? ""
//                     : "Job responsibility is required.",
//                 });
//               }}            />
//           )}
//           <p className="flex self-end text-[#8E8E8E] text-[13px]">
//             Maximum 2000 words
//           </p>
//         </div>
//       </div>
//       <div className="w-[96%] max-w-[900px] my-2 flex justify-end">
//         <button
//           className="w-[25%] py-[8px] bg-[#6438C2] text-white rounded-[15px]"
//           onClick={handleNextStep}
//         >
//           Proceed
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateJobStepOne;
import React, { useEffect, useState } from "react";
import RichTextEditor from "../../../common/RichTextEditor";
import { useJobFormStore } from "../../../../store/useJobFormStore";

const CreateJobStepOne: React.FC = () => {
  const { job, nextStep, setJobData } = useJobFormStore();
  const [selectedOption, setSelectedOption] = useState("description");
  const [description, setDescription] = useState(job.description || "");
  const [responsibility, setResponsibility] = useState(job.responsibility || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Helper function to check if rich text content is effectively empty
  const isRichTextEmpty = (content: string): boolean => {
    return (
      !content || 
      content.trim() === "" || 
      content === "<p><br></p>" || 
      content === "<p></p>" ||
      content.replace(/<[^>]*>/g, "").trim() === ""
    );
  };
  
  // This effect runs once on component mount to initialize state from job store
  useEffect(() => {
    setDescription(job.description || "");
    setResponsibility(job.responsibility || "");
  }, [job.description, job.responsibility]);
  
  // This effect updates the job store when description or responsibility changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setJobData({
        ...job,
        description,
        responsibility,
      });
    }, 300); // Debounce updates to prevent excessive store updates
    
    return () => clearTimeout(timeoutId);
  }, [description, responsibility, setJobData, job]);
  
  const handleSelectedOption = (type: "description" | "responsibility") => {
    // Save current data before switching tabs
    setJobData({
      ...job,
      description,
      responsibility,
    });
    
    setSelectedOption(type);
  };
  
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (isRichTextEmpty(description)) {
      newErrors.description = "Description is required.";
    }

    if (isRichTextEmpty(responsibility)) {
      newErrors.responsibility = "Responsibility is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  const handleDescriptionChange = (value: unknown) => {
    const textValue = value as string;
    setDescription(textValue);
    
    if (errors.description && !isRichTextEmpty(textValue)) {
      setErrors({
        ...errors,
        description: "",
      });
    }
  };

  const handleResponsibilityChange = (value: unknown) => {
    const textValue = value as string;
    setResponsibility(textValue);
    
    if (errors.responsibility && !isRichTextEmpty(textValue)) {
      setErrors({
        ...errors,
        responsibility: "",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[900px] h-[400px] bg-white px-2 flex flex-col items-center justify-center rounded-[10px]">
        <div className="w-full sm:w-[95%] flex flex-col gap-2">
          <div className="flex justify-between border-b-[1px] text-gray-600">
            <div
              onClick={() => handleSelectedOption("description")}
              className={`cursor-pointer text-center text-sm flex-1 ${
                selectedOption === "description"
                  ? "text-[#6438C2] border-b-4 border-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Job Description
            </div>
            <div
              onClick={() => handleSelectedOption("responsibility")}
              className={`cursor-pointer text-center text-sm flex-1 ${
                selectedOption === "responsibility"
                  ? "text-[#6438C2] border-b-4 border-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Job Responsibility
            </div>
          </div>
          {selectedOption === "description" ? (
            <h2 className="text-[#000000] text-sm">Job Description</h2>
          ) : (
            <h2 className="text-[#000000] text-sm">Job Responsibility</h2>
          )}
          {selectedOption === "description" ? (
            <>
              <RichTextEditor
                value={description}
                onChange={handleDescriptionChange}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
            </>
          ) : (
            <>
              <RichTextEditor
                value={responsibility}
                onChange={handleResponsibilityChange}
              />
              {errors.responsibility && (
                <p className="text-red-500 text-xs">{errors.responsibility}</p>
              )}
            </>
          )}
          <p className="flex self-end text-[#8E8E8E] text-[13px]">
            Maximum 2000 words
          </p>
        </div>
      </div>
      <div className="w-[96%] max-w-[900px] my-2 flex justify-end">
        <button
          className="w-[25%] py-[8px] bg-[#6438C2] text-white rounded-[15px]"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepOne;