import { FC, useState } from "react";
import { useSettingsStore } from "../../store/useSettingsStore.ts";

const AutoApplyConfiguration: FC = () => {
  const { applicantSettings, updateAutoApplySettings, setAutoApplySettings } =
    useSettingsStore();
  const [newCompany, setNewCompany] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const autoApplySettings = applicantSettings?.autoApplySettings || {
    minimumMatchPercentage: 75,
    enableAutoApply: true,
    pauseAutoApply: false,
    applyImmediately: false,
    batchApplyTime: "09:00",
    timezone: "Africa/Lagos",
    applyOnWeekends: true,
    skipAlreadyApplied: true,
    blacklistedCompanies: [],
    blacklistedKeywords: [],
  };

  const handleSettingChange = async (key: string, value: any) => {
    const settingsBeforeUpdate = { ...autoApplySettings };
    setAutoApplySettings({
      ...autoApplySettings,
      [key]: value,
    });
    const response = await updateAutoApplySettings({
      ...autoApplySettings,
      [key]: value,
    });
    if (response) {
      setAutoApplySettings(response);
    } else {
      setAutoApplySettings(settingsBeforeUpdate);
    }
  };

  const addBlacklistedCompany = () => {
    if (
      newCompany.trim() &&
      !autoApplySettings.blacklistedCompanies.includes(newCompany.trim())
    ) {
      handleSettingChange("blacklistedCompanies", [
        ...autoApplySettings.blacklistedCompanies,
        newCompany.trim(),
      ]).then(r => r);
      setNewCompany("");
    }
  };

  const removeBlacklistedCompany = (company: string) => {
    handleSettingChange(
      "blacklistedCompanies",
      autoApplySettings.blacklistedCompanies.filter((c) => c !== company),
    ).then(r => r);
  };

  const addBlacklistedKeyword = () => {
    if (
      newKeyword.trim() &&
      !autoApplySettings.blacklistedKeywords.includes(newKeyword.trim())
    ) {
      handleSettingChange("blacklistedKeywords", [
        ...autoApplySettings.blacklistedKeywords,
        newKeyword.trim(),
      ]).then(r => r);
      setNewKeyword("");
    }
  };

  const removeBlacklistedKeyword = (keyword: string) => {
    handleSettingChange(
      "blacklistedKeywords",
      autoApplySettings.blacklistedKeywords.filter((k) => k !== keyword),
    ).then(r => r);
  };

  const timezones = [
    { value: "Africa/Lagos", label: "Lagos (WAT)" },
    { value: "America/New_York", label: "New York (EST)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "UTC", label: "UTC" },
  ];

  return (
    <div className="mb-6 w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Custom CSS for range slider */}
      <style>{`
        .custom-range {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          outline: none;
          background: linear-gradient(
            to right,
            #7c3aed 0%,
            #7c3aed ${((autoApplySettings.minimumMatchPercentage - 50) / 45) * 100}%,
            #e5e7eb ${((autoApplySettings.minimumMatchPercentage - 50) / 45) * 100}%,
            #e5e7eb 100%
          );
        }
        
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        .custom-range::-webkit-slider-thumb:hover {
          background: #6d28d9;
          transform: scale(1.1);
        }
        
        .custom-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }
        
        .custom-range::-moz-range-thumb:hover {
          background: #6d28d9;
          transform: scale(1.1);
        }
        
        .custom-range::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
      `}</style>

      <div className="mb-6 border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Auto Apply Configuration
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Set up automatic job applications based on your preferences and
          criteria
        </p>
      </div>

      {/* Master Toggle - Enable/Disable Auto Apply */}
      <div className="mb-8 rounded-lg bg-purple-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              Auto Apply Feature
            </h4>
            <p className="text-sm text-gray-600">
              {autoApplySettings.enableAutoApply
                ? "Automatically apply to jobs that match your criteria"
                : "Auto apply is currently disabled"}
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={autoApplySettings.enableAutoApply}
              onChange={(e) =>
                handleSettingChange("enableAutoApply", e.target.checked)
              }
              className="peer sr-only"
            />
            <div className="peer h-7 w-12 rounded-full bg-gray-200 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>
      </div>

      {autoApplySettings.enableAutoApply && (
        <>
          {/* Quick Pause Toggle */}
          <div className="mb-6 flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div>
              <h4 className="font-medium text-gray-900">Pause Auto Apply</h4>
              <p className="text-sm text-gray-600">
                Temporarily pause without losing your settings
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={autoApplySettings.pauseAutoApply}
                onChange={(e) =>
                  handleSettingChange("pauseAutoApply", e.target.checked)
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-yellow-500 peer-focus:ring-4 peer-focus:ring-yellow-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          {/* Matching Criteria */}
          <div className="mb-8">
            <h4 className="mb-4 text-lg font-medium text-gray-900">
              Matching Criteria
            </h4>

            <div className="rounded-lg border border-gray-200 p-4">
              <label className="mb-3 block font-medium text-gray-900">
                Minimum Match Percentage:{" "}
                <span className="text-purple-600">
                  {autoApplySettings.minimumMatchPercentage}%
                </span>
              </label>
              <p className="mb-3 text-sm text-gray-600">
                Only apply to jobs that match at least this percentage of your
                profile
              </p>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={autoApplySettings.minimumMatchPercentage}
                onChange={(e) =>
                  handleSettingChange(
                    "minimumMatchPercentage",
                    parseInt(e.target.value),
                  )
                }
                className="custom-range h-2 w-full cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>50% (Lower)</span>
                <span>72% (Good)</span>
                <span>95% (Strict)</span>
              </div>
            </div>
          </div>

          {/* Application Timing */}
          <div className="mb-8">
            <h4 className="mb-4 text-lg font-medium text-gray-900">
              Application Timing
            </h4>

            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <div className="flex items-start">
                <input
                  type="radio"
                  id="applyImmediately"
                  checked={autoApplySettings.applyImmediately}
                  onChange={() => handleSettingChange("applyImmediately", true)}
                  className="mt-1 mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label
                    htmlFor="applyImmediately"
                    className="cursor-pointer font-medium text-gray-900"
                  >
                    Apply Immediately
                  </label>
                  <p className="text-sm text-gray-600">
                    Submit applications as soon as matching jobs are found
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="radio"
                  id="batch_apply"
                  checked={!autoApplySettings.applyImmediately}
                  onChange={() =>
                    handleSettingChange("applyImmediately", false)
                  }
                  className="mt-1 mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="batch_apply"
                    className="cursor-pointer font-medium text-gray-900"
                  >
                    Batch Processing
                  </label>
                  <p className="mb-3 text-sm text-gray-600">
                    Collect matches and apply at a specific time
                  </p>

                  {!autoApplySettings.applyImmediately && (
                    <div className="ml-0 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Daily Apply Time
                        </label>
                        <input
                          type="time"
                          value={autoApplySettings.batchApplyTime}
                          onChange={(e) =>
                            handleSettingChange(
                              "batchApplyTime",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Timezone
                        </label>
                        <select
                          value={autoApplySettings.timezone}
                          onChange={(e) =>
                            handleSettingChange("timezone", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        >
                          {timezones.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Preferences */}
          <div className="mb-8">
            <h4 className="mb-4 text-lg font-medium text-gray-900">
              Application Preferences
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <h5 className="font-medium text-gray-900">
                    Apply on Weekends
                  </h5>
                  <p className="text-sm text-gray-600">
                    Allow applications on Saturday and Sunday
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={autoApplySettings.applyOnWeekends}
                    onChange={(e) =>
                      handleSettingChange("applyOnWeekends", e.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <h5 className="font-medium text-gray-900">
                    Skip Already Applied Jobs
                  </h5>
                  <p className="text-sm text-gray-600">
                    Avoid duplicate applications to jobs you've already applied
                    to
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={autoApplySettings.skipAlreadyApplied}
                    onChange={(e) =>
                      handleSettingChange(
                        "skipAlreadyApplied",
                        e.target.checked,
                      )
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Exclusions */}
          <div className="space-y-6">
            {/* Blacklisted Companies */}
            <div>
              <h4 className="mb-4 text-lg font-medium text-gray-900">
                Company Exclusions
              </h4>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-4 text-sm text-gray-600">
                  Add companies you never want to apply to automatically
                </p>

                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Enter company name (e.g., BadCompany Inc)"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    onKeyPress={(e) =>
                      e.key === "Enter" && addBlacklistedCompany()
                    }
                  />
                  <button
                    onClick={addBlacklistedCompany}
                    disabled={!newCompany.trim()}
                    className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Add
                  </button>
                </div>

                {autoApplySettings.blacklistedCompanies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {autoApplySettings.blacklistedCompanies.map(
                      (company, index) => (
                        <span
                          key={index}
                          className="flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-800"
                        >
                          {company}
                          <button
                            onClick={() => removeBlacklistedCompany(company)}
                            className="ml-2 font-bold text-red-500 hover:text-red-700"
                            title="Remove company"
                          >
                            ×
                          </button>
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No companies blacklisted yet
                  </p>
                )}
              </div>
            </div>

            {/* Blacklisted Keywords */}
            <div>
              <h4 className="mb-4 text-lg font-medium text-gray-900">
                Keyword Exclusions
              </h4>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-4 text-sm text-gray-600">
                  Add keywords to avoid in job titles and descriptions (e.g.,
                  "unpaid", "commission only")
                </p>

                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter keyword to avoid"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    onKeyPress={(e) =>
                      e.key === "Enter" && addBlacklistedKeyword()
                    }
                  />
                  <button
                    onClick={addBlacklistedKeyword}
                    disabled={!newKeyword.trim()}
                    className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Add
                  </button>
                </div>

                {autoApplySettings.blacklistedKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {autoApplySettings.blacklistedKeywords.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-800"
                        >
                          {keyword}
                          <button
                            onClick={() => removeBlacklistedKeyword(keyword)}
                            className="ml-2 font-bold text-red-500 hover:text-red-700"
                            title="Remove keyword"
                          >
                            ×
                          </button>
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No keywords blacklisted yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status Summary */}
          {!autoApplySettings.pauseAutoApply && (
            <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
              <h5 className="mb-2 font-medium text-green-800">
                Auto Apply Status: Active
              </h5>
              <div className="space-y-1 text-sm text-green-700">
                <p>
                  • Minimum match: {autoApplySettings.minimumMatchPercentage}%
                </p>
                <p>
                  • Timing:{" "}
                  {autoApplySettings.applyImmediately
                    ? "Immediate"
                    : `Batch at ${autoApplySettings.batchApplyTime}`}
                </p>
                <p>
                  • Weekend applications:{" "}
                  {autoApplySettings.applyOnWeekends ? "Enabled" : "Disabled"}
                </p>
                <p>
                  • Excluded companies:{" "}
                  {autoApplySettings.blacklistedCompanies.length}
                </p>
                <p>
                  • Excluded keywords:{" "}
                  {autoApplySettings.blacklistedKeywords.length}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AutoApplyConfiguration;
