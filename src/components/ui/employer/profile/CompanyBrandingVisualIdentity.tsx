import React from "react";
import FileUpload from "./FileUpload.tsx";

const CompanyBrandingVisualIdentity: React.FC = ()=>{
    return (<section className="space-y-5 mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <h3 className="font-lato text-[20px] mb-4">
            Branding and Visual Identity
        </h3>
        <select
            className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
        >
            <option value="" disabled selected>
                File name
            </option>

        </select>
        <FileUpload/>
    </section>);
}

export default CompanyBrandingVisualIdentity;