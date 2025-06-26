import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  Briefcase,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  FileDown,
  Filter,
  Import,
  Plus,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { InterviewScheduleDetailsResponse } from "../../utils/types";
import { toast } from "react-toastify";
import { fetchMyInterviewsWithPagination } from "../../services/api";
import { DetailPanel } from "./DetailPanel.tsx";
import { InterviewStatus, InterviewType } from "../../utils/enums.ts";
import { getStatusColor } from "../../utils/constants.ts";
import { InterviewIcon } from "./InterviewIcon.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import InterviewScheduleMultiStepForm from "./interview/InterviewScheduleMultiStepForm.tsx";
import { shouldSendReminder } from "../../utils/helpers.ts";

const Schedules: React.FC = () => {
  const { openModal, isModalOpen } = useModalStore();
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | "All">(
    "All",
  );
  const [typeFilter, setTypeFilter] = useState<InterviewType | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<
    "HIGH" | "MEDIUM" | "LOW" | "All"
  >("All");
  const [dateFilter, setDateFilter] = useState<
    "today" | "week" | "month" | "all"
  >("all");
  const [sortBy, setSortBy] = useState<
    "date" | "status" | "priority" | "created"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "kanban">(
    "list",
  );
  const [bulkSelected, setBulkSelected] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [interviews, setInterviews] =
    useState<InterviewScheduleDetailsResponse[]>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] =
    useState<InterviewScheduleDetailsResponse | null>(null);
  const [, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [, setRescheduleModalOpen] = useState(false);
  const [, setTotalPages] = useState(1);
  const [pagination] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      return await fetchMyInterviewsWithPagination(pagination);
    };

    fetchInterviews()
      .then((res) => {
        setInterviews(res.data);
        setTotalPages(res?.meta?.totalPages || 1);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pagination]);

  // Advanced filtering and sorting
  const filteredAndSortedInterviews = useMemo(() => {
    const filtered = interviews?.filter((interview) => {
      const matchesSearch =
        interview.title.toLowerCase().includes(search.toLowerCase()) ||
        interview.applicants.some((app) =>
          `${app.firstName} ${app.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ) ||
        interview.job.title.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || interview.status === statusFilter;
      const matchesType =
        typeFilter === "All" || interview.interviewType === typeFilter;
      const matchesPriority =
        priorityFilter === "All" || interview.job.priority === priorityFilter;

      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const interviewDate = new Date(interview.date);
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        switch (dateFilter) {
          case "today":
            return interview.date === todayStr;
          case "week": {
            const weekFromNow = new Date(
              today.getTime() + 7 * 24 * 60 * 60 * 1000,
            );
            return interviewDate >= today && interviewDate <= weekFromNow;
          }
          case "month": {
            const monthFromNow = new Date(
              today.getTime() + 30 * 24 * 60 * 60 * 1000,
            );
            return interviewDate >= today && interviewDate <= monthFromNow;
          }
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesPriority &&
        matchesDate
      );
    });

    // Sort the filtered results
    filtered?.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(`${a.date} ${a.startTime}`).getTime();
          bValue = new Date(`${b.date} ${b.startTime}`).getTime();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "priority": {
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          aValue = priorityOrder[a.job.priority];
          bValue = priorityOrder[b.job.priority];
          break;
        }
        case "created":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    interviews,
    search,
    statusFilter,
    typeFilter,
    priorityFilter,
    dateFilter,
    sortBy,
    sortOrder,
  ]);

  const handleBulkSelect = (interviewId: number) => {
    setBulkSelected((prev) =>
      prev.includes(interviewId)
        ? prev.filter((id) => id !== interviewId)
        : [...prev, interviewId],
    );
  };

  const handleBulkAction = (action: "delete" | "reschedule" | "export") => {
    console.log(`Bulk ${action} for:`, bulkSelected);
    setBulkSelected([]);
    setShowBulkActions(false);
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(false);
    setSelected(null);
  };

  const exportInterview = (interview: InterviewScheduleDetailsResponse) => {
    const data = {
      title: interview.title,
      date: interview.date,
      time: `${interview.startTime} - ${interview.endTime}`,
      applicants: interview.applicants
        .map((a) => `${a.firstName} ${a.lastName}`)
        .join(", "),
      status: interview.status,
      type: interview.interviewType,
      interviewer: interview.interviewer,
    };

    console.log("Exporting:", data);
    // In a real app, this would trigger a file download
  };

  // Statistics
  const stats = useMemo(() => {
    const total = interviews?.length;
    const scheduled = interviews?.filter(
      (i) => i.status === InterviewStatus.SCHEDULED,
    ).length;
    const completed = interviews?.filter(
      (i) => i.status === InterviewStatus.COMPLETED,
    ).length;
    const cancelled = interviews?.filter(
      (i) => i.status === InterviewStatus.CANCELLED,
    ).length;
    const upcomingToday = interviews?.filter(
      (i) =>
        i.date === new Date().toISOString().split("T")[0] &&
        i.status === InterviewStatus.SCHEDULED,
    ).length;

    return { total, scheduled, completed, cancelled, upcomingToday };
  }, [interviews]);

  return (
    <div className="mt-5 min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Interview Scheduler
            </h1>
            <p className="mt-1 text-slate-600">
              Manage and track all your interviews
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200"
            >
              <Import className="h-4 w-4" />
              Import
            </button>
            <button
              onClick={() => openModal("schedule-interview")}
              className="flex items-center gap-2 rounded-lg bg-[#6438C2] px-4 py-2 text-white transition hover:bg-purple-600"
            >
              <Plus className="h-4 w-4" />
              Schedule Interview
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-800">Total Interviews</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.scheduled}
            </div>
            <div className="text-sm text-green-800">Scheduled</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.completed}
            </div>
            <div className="text-sm text-purple-800">Completed</div>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-red-800">Cancelled</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.upcomingToday}
            </div>
            <div className="text-sm text-yellow-800">Today</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search interviews, applicants, or jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              {["list", "calendar", "kanban"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition-all ${
                    viewMode === mode
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-slate-700 transition hover:bg-slate-200"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
                <option value="priority">Sort by Priority</option>
                <option value="created">Sort by Created</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="rounded-xl bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESCHEDULED">Rescheduled</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="VIRTUAL_MEETING">Virtual Meeting</option>
                    <option value="PHONE_CALL">Phone Call</option>
                    <option value="IN_PERSON">In Person</option>
                    <option value="PANEL">Panel</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="All">All Priorities</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {bulkSelected.length > 0 && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-800">
                {bulkSelected.length} interview
                {bulkSelected.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("export")}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
                >
                  <FileDown className="h-3 w-3" />
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction("reschedule")}
                  className="flex items-center gap-2 rounded-lg bg-yellow-600 px-3 py-1.5 text-sm text-white transition hover:bg-yellow-700"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reschedule
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition hover:bg-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
                <button
                  onClick={() => setBulkSelected([])}
                  className="p-1.5 text-slate-500 transition hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:w-1/3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                Interviews ({filteredAndSortedInterviews?.length})
              </h3>
              {filteredAndSortedInterviews?.length &&
                filteredAndSortedInterviews?.length > 0 && (
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="text-sm text-slate-500 transition hover:text-slate-700"
                  >
                    {showBulkActions ? "Cancel" : "Select"}
                  </button>
                )}
            </div>

            <div className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent max-h-[70vh] space-y-3 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center pt-20 pb-10">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
                  <p className="mt-4 text-slate-500">Loading interviews...</p>
                </div>
              ) : filteredAndSortedInterviews?.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-20 pb-10">
                  <CalendarIcon className="mb-4 h-12 w-12 text-slate-400" />
                  <p className="text-sm text-slate-500">No interviews found</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                filteredAndSortedInterviews?.map((interview) => {
                  return (
                    <div
                      key={interview.id}
                      className={`group relative cursor-pointer rounded-xl border-2 bg-white p-4 shadow transition-all hover:shadow-md ${
                        selected?.id === interview.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-transparent hover:border-slate-200"
                      }`}
                    >
                      {showBulkActions && (
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            checked={bulkSelected.includes(interview.id)}
                            onChange={() => handleBulkSelect(interview.id)}
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 focus:ring-purple-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}

                      <div
                        className={showBulkActions ? "ml-6" : ""}
                        onClick={() =>
                          !showBulkActions && setSelected(interview)
                        }
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <InterviewIcon type={interview.interviewType} />
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900">
                                {interview.title}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {interview.date} • {interview.startTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(interview.status)}`}
                            >
                              {interview.status}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                interview.job.priority === "HIGH"
                                  ? "bg-red-100 text-red-800"
                                  : interview.job.priority === "MEDIUM"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {interview.job.priority}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Users className="h-3 w-3" />
                            <span>
                              {interview.applicants
                                .map((a) => `${a.firstName} ${a.lastName}`)
                                .join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Briefcase className="h-3 w-3" />
                            <span>{interview.job.title}</span>
                          </div>
                          {interview?.interviewer && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <User className="h-3 w-3" />
                              <span>{interview.interviewer}</span>
                            </div>
                          )}
                        </div>

                        {interview.tags && interview.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {interview.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600"
                              >
                                #{tag}
                              </span>
                            ))}
                            {interview.tags.length > 2 && (
                              <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
                                +{interview.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {shouldSendReminder(
                          {
                            date: interview.date,
                            startTime: interview.startTime,
                          },
                          7,
                        ) && (
                          <div className="absolute top-3 right-3">
                            <Bell className="h-3 w-3 text-blue-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            {selected ? (
              <DetailPanel
                selected={selected}
                onEdit={() => setEditModalOpen(true)}
                onReschedule={() => setRescheduleModalOpen(true)}
                onDelete={() => setDeleteConfirmOpen(true)}
                onDuplicate={() => console.log("Duplicate", selected.id)}
                onExport={() => exportInterview(selected)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-20">
                <div className="text-center">
                  <CalendarIcon className="mx-auto mb-4 h-16 w-16 text-slate-400" />
                  <h3 className="mb-2 text-lg font-medium text-slate-900">
                    Select an interview to view details
                  </h3>
                  <p className="mb-6 text-slate-500">
                    Choose from the list on the left to see interview
                    information
                  </p>
                  <button
                    onClick={() => openModal("schedule-interview")}
                    className="mx-auto flex items-center gap-2 rounded-lg bg-[#6438C2] px-4 py-2 text-white transition hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule New Interview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Detail Modal */}
        {selected && (
          <div
            className="bg-opacity-50 fixed inset-0 z-50 flex items-end bg-black lg:hidden"
            onClick={() => setSelected(null)}
          >
            <div
              className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <DetailPanel
                selected={selected}
                onClose={() => setSelected(null)}
                onEdit={() => setEditModalOpen(true)}
                onReschedule={() => setRescheduleModalOpen(true)}
                onDelete={() => setDeleteConfirmOpen(true)}
                onDuplicate={() => console.log("Duplicate", selected.id)}
                onExport={() => exportInterview(selected)}
              />
            </div>
          </div>
        )}

        {/* Import Modal */}
        {importModalOpen && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-2xl bg-white">
              <div className="border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Import Interviews
                  </h3>
                  <button
                    onClick={() => setImportModalOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                  <p className="mb-2 text-slate-600">
                    Drop your CSV file here or click to browse
                  </p>
                  <p className="text-sm text-slate-500">Supports CSV format</p>
                  <input type="file" accept=".csv" className="hidden" />
                  <button className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200">
                    Choose File
                  </button>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setImportModalOpen(false)}
                    className="rounded-lg px-4 py-2 text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button className="rounded-lg bg-[#6438C2] px-4 py-2 text-white transition hover:bg-purple-600">
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-2xl bg-white">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Delete Interview
                  </h3>
                </div>
                <p className="mb-6 text-slate-600">
                  Are you sure you want to delete this interview? This action
                  cannot be undone and will notify all participants.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="rounded-lg px-4 py-2 text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                  >
                    Delete Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen("schedule-interview") && (
        <InterviewScheduleMultiStepForm modalId="schedule-interview" />
      )}
    </div>
  );
};

export default Schedules;
