import React from "react";
import FileUpload from "./FileUpload.tsx";

const CompanyBrandingVisualIdentity: React.FC = ()=>{
    return (<section className="flex flex-col justify-evenly gap-y-4 mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] mx-auto">
        <h3 className="font-lato text-[20px] mb-4">
            Branding and Visual Identity
        </h3>
        <select
            className="rounded-[16px] border-[#E6E6E6] text-[16px]  bg-white w-full h-[42px] mx-auto"
        >
            <option value="" disabled selected>
                File name
            </option>

        </select>
        <FileUpload/>
    </section>);
}

export default CompanyBrandingVisualIdentity;