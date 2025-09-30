import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Globe,
  AlertCircle,
  Info,
  CheckCircle,
  Timer
} from "lucide-react";
import { useScheduleInterview } from "../../../store/useScheduleInterview.ts";
import CustomSelect from "../../../components/common/CustomSelect.tsx";
import DatePicker from "../../../components/common/DatePicker.tsx";
import { InterviewScheduleDetails } from "../../../utils/types";
import { useTimezones } from "../../../hooks/useTimezones.ts";
import moment from "moment";

// Common time slots for quick selection
const COMMON_TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

// Duration presets in minutes
const DURATION_PRESETS = [
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

interface ValidationErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  duration?: string;
}

const InterviewStepThree: React.FC = () => {
  const timezones = useTimezones();
  const { nextStep, prevStep, interviewDetails, setInterviewDetails } = useScheduleInterview();

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedDurationPreset, setSelectedDurationPreset] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate duration based on start and end times
  const calculatedDuration = useMemo(() => {
    if (interviewDetails?.startTime && interviewDetails?.endTime) {
      const start = new Date(`1970-01-01T${interviewDetails.startTime}`);
      const end = new Date(`1970-01-01T${interviewDetails.endTime}`);
      const diffInMs = end.getTime() - start.getTime();

      if (diffInMs > 0) {
        return Math.floor(diffInMs / (1000 * 60));
      }
    }
    return 0;
  }, [interviewDetails?.startTime, interviewDetails?.endTime]);

  // Update duration in store when calculated
  useEffect(() => {
    if (calculatedDuration !== interviewDetails?.duration) {
      setInterviewDetails({
        ...interviewDetails,
        duration: calculatedDuration,
      } as InterviewScheduleDetails);
    }
  }, [calculatedDuration, interviewDetails, setInterviewDetails]);

  // Format duration display
  const formatDuration = useCallback((minutes: number) => {
    if (minutes === 0) return "0 minutes";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  }, []);

  // Enhanced validation
  const validateForm = useCallback((): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Date validation
    if (!interviewDetails?.date) {
      newErrors.date = "Please select an interview date.";
    } else {
      const selectedDate = new Date(interviewDetails.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Interview date cannot be in the past.";
      }
    }

    // Start time validation
    if (!interviewDetails?.startTime) {
      newErrors.startTime = "Please select a start time.";
    } else {
      // Check if time is in the past for today's date
      if (interviewDetails.date) {
        const selectedDate = new Date(interviewDetails.date);
        const today = new Date();

        if (selectedDate.toDateString() === today.toDateString()) {
          const [hours, minutes] = interviewDetails.startTime.split(':').map(Number);
          const selectedTime = new Date();
          selectedTime.setHours(hours, minutes, 0, 0);

          if (selectedTime <= new Date()) {
            newErrors.startTime = "Start time cannot be in the past.";
          }
        }
      }
    }

    // End time validation
    if (!interviewDetails?.endTime) {
      newErrors.endTime = "Please select an end time.";
    } else if (interviewDetails?.startTime) {
      const start = new Date(`1970-01-01T${interviewDetails.startTime}`);
      const end = new Date(`1970-01-01T${interviewDetails.endTime}`);

      if (end <= start) {
        newErrors.endTime = "End time must be after start time.";
      }
    }

    // Duration validation
    if (calculatedDuration < 15) {
      newErrors.duration = "Interview duration should be at least 15 minutes.";
    } else if (calculatedDuration > 480) {
      newErrors.duration = "Interview duration cannot exceed 8 hours.";
    }

    // Timezone validation
    if (!interviewDetails?.timeZone) {
      newErrors.timeZone = "Please select a timezone.";
    }

    return newErrors;
  }, [interviewDetails, calculatedDuration]);

  // Handle input changes with error clearing
  const handleInputChange = useCallback((field: keyof InterviewScheduleDetails, value: any) => {
    setInterviewDetails({
      ...interviewDetails,
      [field]: value,
    } as InterviewScheduleDetails);

    // Clear related errors
    setErrors(prev => ({ ...prev, [field]: undefined }));

    // Clear duration error when time changes
    if (field === 'startTime' || field === 'endTime') {
      setErrors(prev => ({ ...prev, duration: undefined }));
    }
  }, [interviewDetails, setInterviewDetails]);

  // Quick time slot selection
  const handleTimeSlotSelection = useCallback((time: string) => {
    handleInputChange('startTime', time);
    setShowTimeSlots(false);

    // Auto-calculate end time based on duration preset or default 1 hour
    if (selectedDurationPreset) {
      const [hours, minutes] = time.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + selectedDurationPreset, 0, 0);
      const endTimeString = endTime.toTimeString().slice(0, 5);
      handleInputChange('endTime', endTimeString);
    }
  }, [handleInputChange, selectedDurationPreset]);

  // Duration preset selection
  const handleDurationPresetSelection = useCallback((duration: number) => {
    setSelectedDurationPreset(duration);

    if (interviewDetails?.startTime) {
      const [hours, minutes] = interviewDetails.startTime.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + duration, 0, 0);
      const endTimeString = endTime.toTimeString().slice(0, 5);
      handleInputChange('endTime', endTimeString);
    }
  }, [interviewDetails?.startTime, handleInputChange]);

  // Enhanced next step handler
  const handleNextStep = useCallback(async () => {
    setIsSubmitting(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setTimeout(() => {
        nextStep();
        setIsSubmitting(false);
      }, 300);
    } else {
      setIsSubmitting(false);
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [validateForm, nextStep]);

  // Get timezone display
  const selectedTimezone = timezones.find(tz => tz.value === interviewDetails?.timeZone);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white py-6">
        <div className="flex w-[95%] flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-6 w-6 text-[#6438C2]" />
              <h4 className="text-xl font-bold text-[#000000] sm:text-2xl">
                Schedule Interview
              </h4>
            </div>
            <p className="text-sm text-gray-600 sm:text-base">
              Choose a date and time that works for both you and the candidate
            </p>
          </div>

          {/* Date Selection */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#6438C2]" />
              <h5 className="text-lg font-semibold text-gray-900">Date</h5>
            </div>

            <div className="space-y-2">
              <DatePicker
                selectedDate={interviewDetails?.date ? new Date(interviewDetails.date) : moment().toDate()}
                onDateChange={(date) => {
                  handleInputChange('date', date?.toISOString());
                }}
                className={`w-full rounded-[10px] border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  errors.date
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-[#E6E6E6] bg-white focus:border-[#6438C2] focus:ring-[#6438C2]/20"
                }`}
                data-error={!!errors.date}
              />

              {errors.date && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.date}</span>
                </div>
              )}
            </div>
          </section>

          {/* Time Selection */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#6438C2]" />
              <h5 className="text-lg font-semibold text-gray-900">Time</h5>
            </div>

            {/* Duration Presets */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Quick Duration Selection
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleDurationPresetSelection(preset.value)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      selectedDurationPreset === preset.value
                        ? "bg-[#6438C2] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Input Fields */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Start Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={interviewDetails?.startTime || ""}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className={`w-full rounded-[10px] border px-4 py-3 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      errors.startTime
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-[#E6E6E6] bg-white focus:border-[#6438C2] focus:ring-[#6438C2]/20"
                    }`}
                    data-error={!!errors.startTime}
                  />
                  <button
                    type="button"
                    onClick={() => setShowTimeSlots(!showTimeSlots)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                </div>

                {errors.startTime && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.startTime}</span>
                  </div>
                )}

                {/* Quick Time Slots */}
                {showTimeSlots && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                    <div className="grid grid-cols-4 gap-1">
                      {COMMON_TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSlotSelection(time)}
                          className="rounded px-2 py-1 text-xs hover:bg-[#6438C2] hover:text-white transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={interviewDetails?.endTime || ""}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className={`w-full rounded-[10px] border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    errors.endTime
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                      : "border-[#E6E6E6] bg-white focus:border-[#6438C2] focus:ring-[#6438C2]/20"
                  }`}
                  data-error={!!errors.endTime}
                />

                {errors.endTime && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.endTime}</span>
                  </div>
                )}
              </div>

              {/* Duration Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <div className={`flex items-center gap-2 rounded-[10px] border px-4 py-3 text-sm ${
                  errors.duration ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
                }`}>
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className={calculatedDuration > 0 ? "text-gray-900" : "text-gray-500"}>
                    {formatDuration(calculatedDuration)}
                  </span>
                </div>

                {errors.duration && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Timezone Selection */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#6438C2]" />
              <h5 className="text-lg font-semibold text-gray-900">Timezone</h5>
            </div>

            <div className="space-y-2">
              <CustomSelect
                options={timezones}
                placeholder="Select Timezone"
                value={selectedTimezone?.value || ""}
                onChange={(option) => handleInputChange('timeZone', option.value)}
                className={`w-full rounded-[10px] border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  errors.timeZone
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-[#E6E6E6] bg-white focus:border-[#6438C2] focus:ring-[#6438C2]/20"
                }`}
                data-error={!!errors.timeZone}
              />

              {errors.timeZone && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.timeZone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Summary Card */}
          {interviewDetails?.date && interviewDetails?.startTime && interviewDetails?.endTime && selectedTimezone && (
            <div className="rounded-[10px] border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h6 className="font-medium text-green-800">Interview Summary</h6>
              </div>
              <div className="space-y-1 text-sm text-green-700">
                <p>
                  <strong>Date:</strong> {new Date(interviewDetails.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </p>
                <p>
                  <strong>Time:</strong> {interviewDetails.startTime} - {interviewDetails.endTime} ({formatDuration(calculatedDuration)})
                </p>
                <p>
                  <strong>Timezone:</strong> {selectedTimezone.label}
                </p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="rounded-[10px] border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm text-blue-700">
                <p className="font-medium">Scheduling Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Consider the candidate's timezone when scheduling</li>
                  <li>• Allow buffer time between interviews</li>
                  <li>• Technical interviews typically need 60-90 minutes</li>
                  <li>• Send calendar invites immediately after scheduling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-2 my-4 flex w-[96%] max-w-[900px] justify-end gap-4">
        <button
          onClick={prevStep}
          className="rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Back
        </button>

        <button
          onClick={handleNextStep}
          disabled={isSubmitting || Object.keys(validateForm()).length > 0}
          className="rounded-[15px] bg-[#6438C2] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5329a8] focus:outline-none focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Validating..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default InterviewStepThree;
