import React, { useState } from "react";
import { InterviewScheduleDetailsResponse } from "../../utils/types";
import {
  Bell,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Clock,
  Download,
  Edit,
  Eye,
  FileDown,
  FileText,
  Link,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import { DetailCard } from "./DetailCard.tsx";
import { InterviewStatus, InterviewType } from "../../utils/enums.ts";
import moment from "moment";
import { getStatusColor } from "../../utils/constants.ts";
import { InterviewIcon } from "./InterviewIcon.tsx";
import { shouldSendReminder } from "../../utils/helpers.ts";

export const DetailPanel: React.FC<{
  selected: InterviewScheduleDetailsResponse;
  onClose?: () => void;
  onEdit: () => void;
  onReschedule: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
}> = ({
  selected,
  onClose,
  onEdit,
  onReschedule,
  onDelete,
  onDuplicate,
  onExport,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-500 hover:text-slate-700 lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <InterviewIcon type={selected.interviewType} />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {selected.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">
                {selected.interviewType.replace("_", " ")}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selected.status)}`}
              >
                {selected.status}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  selected.job.priority === "HIGH"
                    ? "bg-red-100 text-red-800"
                    : selected.job.priority === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {selected.job.priority} PRIORITY
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {shouldSendReminder(
            {
              date: selected.date,
              startTime: selected.startTime,
            },
            7,
          ) && (
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <Bell className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {selected.tags && selected.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selected.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-4 text-slate-700">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailCard
            icon={<Calendar className="h-5 w-5" />}
            title="Date & Time"
            value={
              <div>
                <div className="font-medium">{selected.date}</div>
                <div className="text-sm text-slate-600">
                  {selected.startTime} - {selected.endTime} ({selected.timeZone}
                  )
                </div>
              </div>
            }
          />
          <DetailCard
            icon={<Clock className="h-5 w-5" />}
            title="Duration"
            value={`${selected.duration} minutes`}
          />
        </div>

        <DetailCard
          icon={<Users className="h-5 w-5" />}
          title="Applicants"
          value={
            <div className="space-y-3">
              {selected?.applicants?.map((applicant, index) => {
                const name =
                  applicant?.firstName &&
                  applicant?.lastName &&
                  applicant?.firstName[0] + applicant?.lastName[0];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded border bg-white p-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white">
                      {name}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {applicant.firstName} {applicant.lastName}
                      </div>
                      <div className="text-sm text-slate-600">
                        {applicant.email}
                      </div>
                      {applicant.professionalTitle && (
                        <div className="text-xs text-slate-500">
                          {applicant.professionalTitle} •{" "}
                          {applicant?.cv?.yearsOfExperience}
                        </div>
                      )}
                    </div>
                    {applicant.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">
                          {applicant.rating}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailCard
            icon={<Briefcase className="h-5 w-5" />}
            title="Job Position"
            value={
              <div>
                <div className="font-medium">{selected.job.title}</div>
                <div className="text-sm text-slate-600">
                  {selected.job.department} • {selected.job.location}
                </div>
              </div>
            }
          />
          <DetailCard
            icon={<User className="h-5 w-5" />}
            title="Interviewer"
            value={selected.job.hiringManager}
          />
        </div>

        {selected.interviewType === InterviewType.VIRTUAL_MEETING ? (
          <DetailCard
            icon={<Link className="h-5 w-5" />}
            title="Virtual Meeting"
            value={
              <div className="space-y-2">
                <a
                  href={selected.interviewLink}
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video className="h-4 w-4" />
                  {selected.interviewPlatform} Meeting Link
                </a>
                <div className="text-xs text-slate-500">
                  Click to join the meeting
                </div>
              </div>
            }
          />
        ) : selected.interviewType === InterviewType.IN_PERSON ? (
          <DetailCard
            icon={<MapPin className="h-5 w-5" />}
            title="Location"
            value={selected.interviewAddress}
          />
        ) : null}

        {selected.files && selected.files.length > 0 && (
          <DetailCard
            icon={<FileText className="h-5 w-5" />}
            title="Attachments"
            value={
              <div className="space-y-2">
                {selected.files.map((file, index) => (
                  <a
                    key={index}
                    href={`/uploads/${file}`}
                    className="flex items-center gap-2 rounded border bg-white p-2 text-blue-600 transition-colors hover:bg-blue-50 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{file}</span>
                    <Download className="ml-auto h-3 w-3" />
                  </a>
                ))}
              </div>
            }
          />
        )}

        {selected.notes && (
          <DetailCard
            icon={<Clipboard className="h-5 w-5" />}
            title="Notes"
            value={<p className="whitespace-pre-wrap">{selected.notes}</p>}
          />
        )}

        {/* Feedback Section */}
        {selected.status === InterviewStatus.COMPLETED && (
          <DetailCard
            icon={<Eye className="h-5 w-5" />}
            title="Interview Feedback"
            value={
              <div className="space-y-3">
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  {showFeedback ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {showFeedback ? "Hide Feedback" : "Show Feedback"}
                </button>
                {showFeedback && (
                  <div className="rounded border bg-white p-3">
                    {selected.feedback ? (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-medium">Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={
                                  star <= selected.feedback!.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Comments:</span>
                          <p className="mt-1 text-slate-600">
                            {selected.feedback.comments}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 italic">
                        No feedback provided yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            }
          />
        )}

        {/* Timeline */}
        <DetailCard
          icon={<Clock className="h-5 w-5" />}
          title="Timeline"
          value={
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Created:</span>
                <span>{moment(selected.createdAt).fromNow()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last Updated:</span>
                <span>{moment(selected.updatedAt).fromNow()}</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg bg-[#6438C2] px-4 py-2 text-white transition hover:bg-purple-600"
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={onReschedule}
          className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition hover:bg-blue-200"
        >
          <RefreshCw className="h-4 w-4" />
          Reschedule
        </button>
        <button
          onClick={onDuplicate}
          className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-700 transition hover:bg-green-200"
        >
          <Plus className="h-4 w-4" />
          Duplicate
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-yellow-700 transition hover:bg-yellow-200"
        >
          <FileDown className="h-4 w-4" />
          Export
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 transition hover:bg-red-200"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};
