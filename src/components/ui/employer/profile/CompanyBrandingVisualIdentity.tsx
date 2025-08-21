import React, { useEffect, useState } from "react";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { BrandAndVisuals, FileUploadRequest } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { Action } from "../../../../utils/enums.ts";
import { toast } from "react-toastify";
import {
  Palette,
  Upload,
  X,
  FileImage,
  Image,
  Eye,
} from "lucide-react";

const CompanyBrandingVisualIdentity: React.FC = () => {
  const { employer } = useAuth();
  const {
    brandAndVisuals,
    setBrandAndVisuals,
    updateBrandAndVisuals,
    deleteBrandAndVisuals,
  } = useEmployerProfile();

  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (employer) {
      setBrandAndVisuals({
        files: employer?.brandAndVisuals || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer]);

  const handleFileUpload = async (file: File | undefined) => {

    if (!file) return;

    if (!selectedFile) {
      toast.error("Please select a file type first.");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPEG, PNG, GIF, WebP, or SVG).");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      console.log("FILE TO BE UPLOADED ::: ", employer?.id);
      const response = await updateBrandAndVisuals({
        userId: Number(employer?.id),
        userType: employer?.userType,
        file: file,
        action: Action.PROFILE_PICTURE_UPDATE,
        whatIsTheItem: selectedFile,
      } as FileUploadRequest);

      if (response) {
        let bv = brandAndVisuals?.files || [];
        bv = [...bv, response?.url || ""];

        setBrandAndVisuals({
          ...brandAndVisuals,
          files: bv,
        } as BrandAndVisuals);

        setSelectedFile("");
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Failed to upload file. Please try again.");
      }
    } catch (error: any) {
      console.log("ERROR UPLOADING FILE ::: ", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      handleFileUpload(file).then(r=>r);
    }
  };

  const handleTriggerFileUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file type first.");
      return;
    }

    const fileInput = document.getElementById("fileInput");
    fileInput?.click();
  };

  const handleRemove = async (id: number) => {
    try {
      let bv = brandAndVisuals?.files || [];
      const response = await deleteBrandAndVisuals({
        userId: Number(employer?.id),
        userType: employer?.userType,
        fileUrl: brandAndVisuals?.files?.[id],
        action: Action.DELETE_PROFILE_FILE,
        whatIsTheItem: "brandAndVisuals",
      } as FileUploadRequest);

      if (response) {
        bv = bv.filter((_, index) => index !== id);
        setBrandAndVisuals({
          ...brandAndVisuals,
          files: bv,
        } as BrandAndVisuals);
        toast.success("File removed successfully!");
      } else {
        toast.error("Failed to remove file. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to remove file. Please try again.");
    }
  };

  const shortenFileName = (fileName: string) => {
    if (fileName.length > 30) {
      const extension = fileName.split('.').pop();
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      return nameWithoutExt.slice(0, 25) + '...' + (extension ? `.${extension}` : '');
    }
    return fileName;
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "companyLogo":
        return { icon: Image, color: "text-blue-600", bg: "bg-blue-100" };
      case "banner":
        return { icon: FileImage, color: "text-green-600", bg: "bg-green-100" };
      case "coverPage":
        return { icon: FileImage, color: "text-purple-600", bg: "bg-purple-100" };
      case "events":
        return { icon: FileImage, color: "text-orange-600", bg: "bg-orange-100" };
      default:
        return { icon: FileImage, color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const fileTypeOptions = [
    { label: "Company Logo", value: "companyLogo" },
    { label: "Banner Image", value: "banner" },
    { label: "Cover Page", value: "coverPage" },
    { label: "Event Images", value: "events" },
    { label: "Other Assets", value: "others" },
  ];

  return (
    <section id="branding" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Branding & Visual Identity</h3>
            <p className="text-sm text-gray-500">Upload your company logo, banners, and visual assets</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50 rounded-xl p-6">
        {/* File Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Asset Type *
          </label>
          <CustomSelect
            options={fileTypeOptions}
            placeholder="Choose what type of file you're uploading"
            onChange={(option: { label: string; value: string }) => {
              setSelectedFile(option.value);
            }}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200"
          />
          {!selectedFile && (
            <p className="mt-1 text-xs text-amber-600">
              ⚠️ Please select an asset type before uploading
            </p>
          )}
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-purple-400 bg-purple-50'
                : selectedFile
                  ? 'border-gray-300 hover:border-purple-400'
                  : 'border-gray-200 bg-gray-50'
            } ${!selectedFile ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleTriggerFileUpload}
          >
            <input
              type="file"
              id="fileInput"
              onChange={async(e)=>{
                await handleFileUpload(e.target.files?.[0]);
              }}
              className="hidden"
              accept="image/*"
              disabled={isUploading || !selectedFile}
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className={`p-3 rounded-full ${selectedFile ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <Upload className={`w-8 h-8 ${selectedFile ? 'text-purple-600' : 'text-gray-400'}`} />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {dragActive ? 'Drop your file here' : 'Upload Visual Assets'}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your files here, or click to browse
                </p>

                <button
                  type="button"
                  onClick={handleTriggerFileUpload}
                  disabled={isUploading || !selectedFile}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Browse Files
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500">
                <p>Supported formats: JPEG, PNG, GIF, WebP, SVG</p>
                <p>Maximum file size: 5MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {brandAndVisuals?.files && brandAndVisuals.files.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Uploaded Assets ({brandAndVisuals.files.length})
            </h4>

            <div className="space-y-3">
              {brandAndVisuals.files.map((file: string, id) => {
                const fileName = file.split('/').pop() || file;
                const typeInfo = getFileTypeIcon("others"); // Default since we don't store file type
                const TypeIcon = typeInfo.icon;

                return (
                  <div
                    key={id}
                    className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                        <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {shortenFileName(fileName)}
                        </p>
                        <p className="text-xs text-gray-500">Visual Asset</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(file, '_blank')}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        title="View file"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!brandAndVisuals?.files || brandAndVisuals.files.length === 0) && (
          <div className="mt-6 text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
            <Palette className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">No visual assets uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload your company logo and branding materials to enhance your profile</p>
          </div>
        )}

        {/* Guidelines */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">🎨 Branding Guidelines:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Company Logo:</strong> Use high-resolution PNG with transparent background</li>
            <li>• <strong>Banner Images:</strong> Ideal dimensions 1200x300px for best results</li>
            <li>• <strong>File Quality:</strong> Upload high-quality images for professional appearance</li>
            <li>• <strong>Brand Consistency:</strong> Ensure all assets follow your brand guidelines</li>
            <li>• <strong>File Organization:</strong> Select the correct asset type for easy management</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CompanyBrandingVisualIdentity;