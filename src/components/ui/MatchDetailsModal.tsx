import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  Award,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Brain,
  Loader2,
} from 'lucide-react';
import { useFetchJobMatchResult } from "../../hooks/useFetchJobMatchResult.tsx";

// Updated interfaces to match your actual API response
export interface JobMatchResult {
  batch_tag?: string;
  match_version?: string;
  timestamp: string;
  breakdown: Breakdown;
  // Note: Your API doesn't seem to have matchPercentage at root level
  // We'll calculate it from AI decision adjusted_score
}

interface Breakdown {
  calculation_method: string;
  component_scores: ComponentScores;
  detailed_analysis: DetailedAnalysis;
  weights_used: WeightsUsed;
  screening_evaluation: ScreeningEvaluation;
  ai_enhancements: AIEnhancements;
}

interface ComponentScores {
  skills: number;
  requirements_analysis: number;
  title_intelligence: number;
  experience: number;
  location: number;
  education: number;
  job_preferences: number;
  semantic: number;
  certifications: number;
}

interface DetailedAnalysis {
  skills: SkillsAnalysis;
  experience: ExperienceAnalysis;
  title: TitleAnalysis;
  location: LocationAnalysis;
  education: EducationAnalysis;
  requirements: RequirementsAnalysis;
  job_preferences: JobPreferencesAnalysis;
  semantic: SemanticAnalysis;
  certifications: CertificationsAnalysis;
  critical_skills: CriticalSkillsAnalysis;
}

interface SkillsAnalysis {
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  critical_matched?: string[];
  critical_missing?: string[];
  total_matched?: number;
  total_required?: number;
  applicant_skills?: string[];
  strict_matching_applied?: boolean;
}

interface ExperienceAnalysis {
  score: number;
  applicant_experience: number;
  required_experience: number;
  job_level: string;
  status: string;
}

interface TitleAnalysis {
  score: number;
  applicant_title: string;
  job_title: string;
  direct_matches?: number;
  similarity_boost?: number;
  total_job_words?: number;
}

interface LocationAnalysis {
  score: number;
  reason?: string;
  applicant_location?: string;
  job_location?: string;
  employment_type: string;
  status?: string;
}

interface EducationAnalysis {
  score: number;
  applicant_education?: string;
  job_level?: string;
  status?: string;
  note?: string;
}

interface RequirementsAnalysis {
  score: number;
  requirements_text: string;
  matches_found: string[];
  experience_match: boolean;
  education_match: boolean;
}

interface JobPreferencesAnalysis {
  score: number;
  total_weight?: number;
  component_scores?: {
    job_type: number;
    location: number;
    industry: number;
    salary: number;
  };
  salary_analysis?: {
    score: number;
    best_match?: {
      match_type: string;
      job_range_original: string;
      applicant_range_original: string;
    };
    total_ranges_checked?: number;
  };
  preferences_matched?: {
    job_types_checked: string[];
    locations_checked: string[];
    industries_checked: string[];
  };
}

interface SemanticAnalysis {
  score: number;
  applicant_text_length: number;
  job_text_length: number;
  method: string;
}

interface CertificationsAnalysis {
  score: number;
  note: string;
}

interface CriticalSkillsAnalysis {
  score: number;
  confidence?: number;
  analysis?: {
    total_critical: number;
    matched_critical: number;
    missing_critical: string[];
    impact_analysis: {
      risk_level: string;
      impact: string;
      match_percentage: number;
    };
  };
}

interface WeightsUsed {
  skills: number;
  requirements_analysis: number;
  title_intelligence: number;
  experience: number;
  location: number;
  education: number;
  job_preferences: number;
  semantic: number;
  certifications: number;
}

interface ScreeningEvaluation {
  overall_result: 'NO_SCREENING' | 'PASS' | 'PARTIAL' | 'FAIL' | 'ERROR';
  score_percentage: number;
  questions_answered?: string;
  correct_answers?: number;
  total_questions?: number;
}

interface AIEnhancements {
  ai_available: boolean;
  confidence_score: number;
  ai_decision: {
    adjusted_score: number;
    decision: string;
    reason: string;
    auto_actions: string[];
  };
  ai_settings_analysis?: {
    has_ai_settings: boolean;
    behavior?: {
      critical_skills: string[];
      strict_matching: boolean;
      automation_level: string;
      priority_factors: string[];
      reject_threshold: number;
      minimum_threshold: number;
      auto_accept_enabled: boolean;
      auto_reject_enabled: boolean;
    };
    raw_settings?: any;
  };
}

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId: number;
  jobId: number;
  applicantName: string;
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               applicantId,
                                                               jobId,
                                                               applicantName
                                                             }) => {
  const [matchData, setMatchData] = useState<JobMatchResult | null>(null);

  console.log('MatchDetailsModal rendered:', { isOpen, applicantId, jobId, applicantName });

  // Use the hook to fetch data - only fetch when modal is open
  const { data: MatchResponse, isLoading: loading, error: hookError } = useFetchJobMatchResult(
    isOpen ? applicantId : 0,
    isOpen ? jobId : 0
  );

  console.log('Hook response:', { MatchResponse, loading, hookError });

  // Set match data when response is available
  useEffect(() => {
    if (MatchResponse?.statusCode === 200 && MatchResponse?.data) {
      console.log('Setting match data:', MatchResponse.data);
      setMatchData(MatchResponse.data);
    } else if (MatchResponse?.statusCode !== 200 && MatchResponse?.statusCode) {
      console.error('API returned non-200 status:', MatchResponse.statusCode);
    }
  }, [MatchResponse]);

  // Convert hook error to string
  const error = hookError ? (hookError instanceof Error ? hookError.message : 'Failed to load match details') : null;

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 0.4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (score >= 0.6) return <Star className="w-4 h-4" />;
    if (score >= 0.4) return <AlertCircle className="w-4 h-4" />;
    return <X className="w-4 h-4" />;
  };

  const formatPercentage = (score: number) => `${Math.round(score * 100)}%`;

  // Get overall match score from AI decision or calculate from components
  const getOverallMatchScore = (): number => {
    if (matchData?.breakdown?.ai_enhancements?.ai_decision?.adjusted_score) {
      return matchData.breakdown.ai_enhancements.ai_decision.adjusted_score;
    }
    // Fallback: calculate weighted average from component scores
    if (matchData?.breakdown?.component_scores && matchData?.breakdown?.weights_used) {
      const scores = matchData.breakdown.component_scores;
      const weights = matchData.breakdown.weights_used;

      return (
        scores.skills * weights.skills +
        scores.experience * weights.experience +
        scores.title_intelligence * weights.title_intelligence +
        scores.location * weights.location +
        scores.education * weights.education +
        scores.requirements_analysis * weights.requirements_analysis +
        scores.job_preferences * weights.job_preferences +
        scores.semantic * weights.semantic +
        scores.certifications * weights.certifications
      ) * 100;
    }
    return 0;
  };

  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{zIndex: 99999}}>
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Match Analysis</h2>
              <p className="text-gray-600 mt-1">{applicantName}</p>
              {/* Debug info - remove this later */}
              <p className="text-xs text-gray-400">
                Applicant ID: {applicantId}, Job ID: {jobId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Analyzing match details...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Match Details</h3>
                <p className="text-gray-600 mb-4">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && !matchData && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Match Data Available</h3>
                <p className="text-gray-600">Unable to load match analysis for this applicant.</p>
              </div>
            </div>
          )}

          {matchData && (
            <div className="space-y-6">
              {/* Overall Match Score */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {getOverallMatchScore().toFixed(1)}%
                      </h3>
                      <p className="text-gray-600">Overall Match Score</p>
                    </div>
                  </div>

                  {matchData.breakdown.ai_enhancements?.ai_available && (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                      matchData.breakdown.ai_enhancements.ai_decision.decision === 'AUTO_ACCEPT'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : matchData.breakdown.ai_enhancements.ai_decision.decision === 'AUTO_REJECT'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      <Brain className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        AI Recommendation: {matchData.breakdown.ai_enhancements.ai_decision.decision.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Component Scores Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Skills Match */}
                <div className={`p-4 rounded-lg border ${getScoreColor(matchData.breakdown.component_scores.skills)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <h4 className="font-medium">Skills</h4>
                    </div>
                    {getScoreIcon(matchData.breakdown.component_scores.skills)}
                  </div>
                  <p className="text-lg font-bold">{formatPercentage(matchData.breakdown.component_scores.skills)}</p>
                  <div className="mt-2 text-sm">
                    <p>Matched: {matchData.breakdown.detailed_analysis.skills.total_matched || matchData.breakdown.detailed_analysis.skills.matched_skills?.length || 0}</p>
                    <p>Missing: {matchData.breakdown.detailed_analysis.skills.missing_skills?.length || 0}</p>
                  </div>
                </div>

                {/* Experience */}
                <div className={`p-4 rounded-lg border ${getScoreColor(matchData.breakdown.component_scores.experience)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      <h4 className="font-medium">Experience</h4>
                    </div>
                    {getScoreIcon(matchData.breakdown.component_scores.experience)}
                  </div>
                  <p className="text-lg font-bold">{formatPercentage(matchData.breakdown.component_scores.experience)}</p>
                  <div className="mt-2 text-sm">
                    <p>Applicant: {matchData.breakdown.detailed_analysis.experience.applicant_experience} years</p>
                    <p>Required: {matchData.breakdown.detailed_analysis.experience.required_experience} years</p>
                    <p className="capitalize text-gray-600">{matchData.breakdown.detailed_analysis.experience.status.replace('_', ' ')}</p>
                  </div>
                </div>

                {/* Title Intelligence */}
                <div className={`p-4 rounded-lg border ${getScoreColor(matchData.breakdown.component_scores.title_intelligence)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      <h4 className="font-medium">Title Match</h4>
                    </div>
                    {getScoreIcon(matchData.breakdown.component_scores.title_intelligence)}
                  </div>
                  <p className="text-lg font-bold">{formatPercentage(matchData.breakdown.component_scores.title_intelligence)}</p>
                  <div className="mt-2 text-sm">
                    <p className="truncate" title={matchData.breakdown.detailed_analysis.title.applicant_title}>
                      Applicant: {matchData.breakdown.detailed_analysis.title.applicant_title}
                    </p>
                    <p className="truncate" title={matchData.breakdown.detailed_analysis.title.job_title}>
                      Job: {matchData.breakdown.detailed_analysis.title.job_title}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className={`p-4 rounded-lg border ${getScoreColor(matchData.breakdown.component_scores.location)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <h4 className="font-medium">Location</h4>
                    </div>
                    {getScoreIcon(matchData.breakdown.component_scores.location)}
                  </div>
                  <p className="text-lg font-bold">{formatPercentage(matchData.breakdown.component_scores.location)}</p>
                  <div className="mt-2 text-sm">
                    <p>{matchData.breakdown.detailed_analysis.location.reason || 'Compatible'}</p>
                  </div>
                </div>

                {/* Education */}
                <div className={`p-4 rounded-lg border ${getScoreColor(matchData.breakdown.component_scores.education)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      <h4 className="font-medium">Education</h4>
                    </div>
                    {getScoreIcon(matchData.breakdown.component_scores.education)}
                  </div>
                  <p className="text-lg font-bold">{formatPercentage(matchData.breakdown.component_scores.education)}</p>
                  <div className="mt-2 text-sm">
                    <p>{matchData.breakdown.detailed_analysis.education.note || matchData.breakdown.detailed_analysis.education.status || 'Qualified'}</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className={`p-4 rounded-lg border ${getScoreColor(matchData.breakdown.component_scores.requirements_analysis)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <h4 className="font-medium">Requirements</h4>
                    </div>
                    {getScoreIcon(matchData.breakdown.component_scores.requirements_analysis)}
                  </div>
                  <p className="text-lg font-bold">{formatPercentage(matchData.breakdown.component_scores.requirements_analysis)}</p>
                  <div className="mt-2 text-sm">
                    <p>Matches: {matchData.breakdown.detailed_analysis.requirements.matches_found?.length || 0}</p>
                    <p>Experience: {matchData.breakdown.detailed_analysis.requirements.experience_match ? 'Yes' : 'No'}</p>
                    <p>Education: {matchData.breakdown.detailed_analysis.requirements.education_match ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Skills Breakdown */}
              {matchData.breakdown.detailed_analysis.skills && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills Analysis
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched Skills */}
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Matched Skills ({matchData.breakdown.detailed_analysis.skills.matched_skills?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchData.breakdown.detailed_analysis.skills.matched_skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Missing Skills ({matchData.breakdown.detailed_analysis.skills.missing_skills?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchData.breakdown.detailed_analysis.skills.missing_skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm capitalize">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Applicant Skills */}
                  {matchData.breakdown.detailed_analysis.skills.applicant_skills && (
                    <div className="mt-6">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Applicant's Skills ({matchData.breakdown.detailed_analysis.skills.applicant_skills?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchData.breakdown.detailed_analysis.skills.applicant_skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Critical Skills if available */}
                  {matchData.breakdown.detailed_analysis.critical_skills?.analysis && (
                    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Critical Skills Assessment
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-orange-700 font-medium">Total Critical:</span>
                          <span className="ml-2">{matchData.breakdown.detailed_analysis.critical_skills.analysis.total_critical}</span>
                        </div>
                        <div>
                          <span className="text-orange-700 font-medium">Matched:</span>
                          <span className="ml-2">{matchData.breakdown.detailed_analysis.critical_skills.analysis.matched_critical}</span>
                        </div>
                        <div>
                          <span className="text-orange-700 font-medium">Risk Level:</span>
                          <span className="ml-2 capitalize">{matchData.breakdown.detailed_analysis.critical_skills.analysis.impact_analysis?.risk_level}</span>
                        </div>
                      </div>
                      {matchData.breakdown.detailed_analysis.critical_skills.analysis.missing_critical?.length > 0 && (
                        <div className="mt-3">
                          <span className="text-orange-700 font-medium text-sm">Missing Critical Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {matchData.breakdown.detailed_analysis.critical_skills.analysis.missing_critical.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Job Preferences Analysis */}
              {matchData.breakdown.detailed_analysis.job_preferences && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Job Preferences Match
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Component Scores */}
                    {matchData.breakdown.detailed_analysis.job_preferences.component_scores && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Preference Components</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Job Type:</span>
                            <span className="font-medium">{formatPercentage(matchData.breakdown.detailed_analysis.job_preferences.component_scores.job_type)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span className="font-medium">{formatPercentage(matchData.breakdown.detailed_analysis.job_preferences.component_scores.location)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Industry:</span>
                            <span className="font-medium">{formatPercentage(matchData.breakdown.detailed_analysis.job_preferences.component_scores.industry)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Salary:</span>
                            <span className="font-medium">{formatPercentage(matchData.breakdown.detailed_analysis.job_preferences.component_scores.salary)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Salary Analysis */}
                    {matchData.breakdown.detailed_analysis.job_preferences.salary_analysis && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Salary Analysis</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Match Type:</span> {matchData.breakdown.detailed_analysis.job_preferences.salary_analysis.best_match?.match_type}</p>
                          <p><span className="font-medium">Job Range:</span> {matchData.breakdown.detailed_analysis.job_preferences.salary_analysis.best_match?.job_range_original}</p>
                          <p><span className="font-medium">Applicant Range:</span> {matchData.breakdown.detailed_analysis.job_preferences.salary_analysis.best_match?.applicant_range_original}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Matched Preferences */}
                  {matchData.breakdown.detailed_analysis.job_preferences.preferences_matched && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Matched Preferences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Job Types:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchData.breakdown.detailed_analysis.job_preferences.preferences_matched.job_types_checked?.map((type, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Locations:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchData.breakdown.detailed_analysis.job_preferences.preferences_matched.locations_checked?.map((location, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Industries:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchData.breakdown.detailed_analysis.job_preferences.preferences_matched.industries_checked?.map((industry, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Insights */}
              {matchData.breakdown.ai_enhancements?.ai_available && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Analysis
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Recommendation</h4>
                      <p className="text-blue-700">{matchData.breakdown.ai_enhancements.ai_decision.reason}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Confidence</h4>
                      <p className="text-blue-700">{formatPercentage(matchData.breakdown.ai_enhancements.confidence_score)}</p>
                    </div>
                  </div>

                  {/* AI Settings Analysis */}
                  {matchData.breakdown.ai_enhancements.ai_settings_analysis?.behavior && (
                    <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">AI Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Automation Level:</span>
                          <span className="ml-2 capitalize">{matchData.breakdown.ai_enhancements.ai_settings_analysis.behavior.automation_level}</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Strict Matching:</span>
                          <span className="ml-2">{matchData.breakdown.ai_enhancements.ai_settings_analysis.behavior.strict_matching ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Minimum Threshold:</span>
                          <span className="ml-2">{matchData.breakdown.ai_enhancements.ai_settings_analysis.behavior.minimum_threshold}%</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Auto Accept:</span>
                          <span className="ml-2">{matchData.breakdown.ai_enhancements.ai_settings_analysis.behavior.auto_accept_enabled ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>

                      {/* Critical Skills */}
                      {matchData.breakdown.ai_enhancements.ai_settings_analysis.behavior.critical_skills?.length > 0 && (
                        <div className="mt-3">
                          <span className="text-blue-700 font-medium text-sm">Critical Skills Required:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchData.breakdown.ai_enhancements.ai_settings_analysis.behavior.critical_skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {matchData.breakdown.ai_enhancements.ai_decision.auto_actions?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-blue-800 mb-2">Suggested Actions</h4>
                      <ul className="list-disc list-inside text-blue-700 text-sm">
                        {matchData.breakdown.ai_enhancements.ai_decision.auto_actions.map((action, index) => (
                          <li key={index} className="capitalize">{action.replace('_', ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Screening Results */}
              {matchData.breakdown.screening_evaluation?.overall_result !== 'NO_SCREENING' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Screening Results
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Overall Result</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        matchData.breakdown.screening_evaluation.overall_result === 'PASS'
                          ? 'bg-green-100 text-green-800'
                          : matchData.breakdown.screening_evaluation.overall_result === 'PARTIAL'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {matchData.breakdown.screening_evaluation.overall_result}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Score</h4>
                      <p className="text-gray-900">{formatPercentage(matchData.breakdown.screening_evaluation.score_percentage / 100)}</p>
                    </div>
                    {matchData.breakdown.screening_evaluation.correct_answers && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Questions</h4>
                        <p className="text-gray-900">
                          {matchData.breakdown.screening_evaluation.correct_answers} / {matchData.breakdown.screening_evaluation.total_questions} correct
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Semantic Analysis */}
              {matchData.breakdown.detailed_analysis.semantic && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Semantic Analysis
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Match Score:</span>
                      <span className="ml-2">{formatPercentage(matchData.breakdown.detailed_analysis.semantic.score)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Method:</span>
                      <span className="ml-2 capitalize">{matchData.breakdown.detailed_analysis.semantic.method.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Text Lengths:</span>
                      <span className="ml-2">Job: {matchData.breakdown.detailed_analysis.semantic.job_text_length}, CV: {matchData.breakdown.detailed_analysis.semantic.applicant_text_length}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Component Weights */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Scoring Weights
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Skills:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.skills)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.experience)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Title Match:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.title_intelligence)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requirements:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.requirements_analysis)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Preferences:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.job_preferences)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.location)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Education:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.education)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Semantic:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.semantic)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certifications:</span>
                    <span className="font-medium">{formatPercentage(matchData.breakdown.weights_used.certifications)}</span>
                  </div>
                </div>
              </div>

              {/* Match Timestamp */}
              <div className="text-center text-sm text-gray-500">
                <p>Analysis generated on {new Date(matchData.timestamp).toLocaleString()}</p>
                {matchData.match_version && <p>Match Engine Version: {matchData.match_version}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsModal;
