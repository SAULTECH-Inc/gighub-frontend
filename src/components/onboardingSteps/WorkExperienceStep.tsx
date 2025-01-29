import { useForm } from "react-hook-form";
import { useSignupStore } from "../../hooks/useSignupStore";
import { File } from "../../assets/icons";
import { motion } from "motion/react";

interface ApplicantData {
  jobSeeker: boolean;
  firstName: string;
  surname: string;
  middleName: string;
  email: string;
  password: string;
  document: File[] | null;
}

const WorkExperienceStep = () => {
  const { data, prevStep, updateData } = useSignupStore();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      documentName: data.documentName,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      const updatedFiles = [...(data.document || []), ...uploadedFiles];
      updateData("document", updatedFiles);
      console.log("upload", updatedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const updatedFiles = [...(data.document || []), ...droppedFiles];
      updateData("document", updatedFiles);
    }
  };

  const onSubmit = (values: any) => {
    const formData = { ...data, ...values };
    const filteredData: ApplicantData = {
      jobSeeker: formData.jobSeeker,
      firstName: formData.firstName,
      surname: formData.surname,
      middleName: formData.middleName,
      email: formData.email,
      password: formData.password,
      document: formData.document,
    };
    console.log(filteredData);
  };

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="flex flex-col items-center mt-20 md:mt-[70px]"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-md:w-[372px] border border-[#e6e6e6] rounded-2xl px-6 md:px-28 py-[30px] md:py-10">
            <h1 className="font-lato font-black text-2xl text-center">Upload Work experience</h1>
            <input
              {...register("documentName")}
              disabled
              placeholder="Document Name"
              className="w-full h-[45px] rounded-2xl border-[#d9d9d9] mt-[33px]"
            />

            <div
              className="h-48 border border-dashed border-tertiary rounded-2xl flex flex-col items-center justify-center p-4 mb-4 bg-tertiary bg-opacity-5 hover:bg-opacity-10 mt-5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <p className="text-gray-600 text-center font-lato">Drag and drop your files here</p>
              <p className="text-center font-lato mt-5">OR</p>
              <label
                htmlFor="file-upload"
                className="text-[13px] cursor-pointer py-[10px] px-5 bg-tertiary text-white rounded-2xl mt-5 font-lato font-bold"
              >
                Browse Files
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="mt-6">
              {data.document && data.document.length > 0 && (
                <>
                  <h3 className="mb-5 font-lato text-[#adb3c2]">Uploaded Files:</h3>
                  <ul className="list-disc list-inside space-y-3">
                    {data.document.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-7 border border-[#e6e6e6] rounded-2xl"
                      >
                        <div className="flex items-center gap-4">
                          <img src={File} alt="file" className="w-10 h-10" />
                          <span className="text-gray-600">{file.name}</span>
                        </div>
                        <p className="font-lato text-[13px] text-tertiary">100% Uploaded</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-10 mt-[30px] md:mt-10">
            <button className="font-lato text-[13px]" onClick={prevStep}>
              Back
            </button>
            <button
              type="submit"
              className="py-[14px] px-14 bg-tertiary text-white text-[13px] font-lato rounded-2xl"
            >
              Proceed
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default WorkExperienceStep;
