import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MessageCircle, Eye, Heart, Download,
  MapPin, Briefcase, Calendar, DollarSign, Award,
  Check, X, ChevronDown, ChevronUp, Users, Zap, Target,
  Mail, Phone, Linkedin, Github, Globe, Clock, CheckCircle
} from 'lucide-react';
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import { employerNavBarItemMap, employerNavItems, employerNavItemsMobile } from "../../utils/constants.ts";

const CandidateMatchResults = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('match_score');
  const [viewMode, setViewMode] = useState<string>('grid'); // grid or list
  const [savedCandidates, setSavedCandidates] = useState(new Set());
  const [messageModal, setMessageModal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({
    minScore: 0,
    skills: [],
    experience: [],
    location: [],
    availability: 'all'
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleSave = (id: string) => {
    setSavedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openMessage = (candidate: any) => {
    setMessageModal(candidate);
  };

  const sendMessage = (candidateId: number, message: string) => {
    console.log('Sending message to:', candidateId, message);
    setMessageModal(null);
    // API call here
  };

  const filteredCandidates = candidates
    .filter(c => c.match_score >= filters.minScore)
    .sort((a, b) => {
      if (sortBy === 'match_score') return b.match_score - a.match_score;
      if (sortBy === 'experience') return b.experience_years - a.experience_years;
      if (sortBy === 'recent') return new Date(b.available_from).getTime() - new Date(a.available_from).getTime();
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6A0DAD] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#222222]">AI Match Results</h1>
              <p className="text-gray-600 mt-1">
                Found <span className="font-semibold text-[#6A0DAD]">{candidates.length}</span> candidates for React Native Developer
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export List
              </button>
              <button className="px-4 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#5A0B9D] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Bulk Action
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, skills, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {filterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD]"
            >
              <option value="match_score">Best Match</option>
              <option value="experience">Most Experienced</option>
              <option value="recent">Recently Available</option>
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[#6A0DAD]/5 text-[#6A0DAD]' : 'bg-white'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#6A0DAD]/5 text-[#6A0DAD]' : 'bg-white'}`}
              >
                List
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Match Score: {filters.minScore}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minScore}
                    onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>All</option>
                    <option>Immediate</option>
                    <option>Within 2 weeks</option>
                    <option>Within 1 month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>All levels</option>
                    <option>1-3 years</option>
                    <option>3-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>All locations</option>
                    <option>Remote only</option>
                    <option>Willing to relocate</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSaved={savedCandidates.has(candidate.id)}
              onToggleSave={() => toggleSave(candidate.id)}
              onMessage={() => openMessage(candidate)}
              onViewProfile={() => setSelectedCandidate(candidate)}
              viewMode={viewMode}
            />
          ))}
        </div>
      </div>

      {/* Message Modal */}
      {messageModal && (
        <MessageModal
          candidate={messageModal}
          onClose={() => setMessageModal(null)}
          onSend={sendMessage}
        />
      )}

      {/* Profile Modal */}
      {selectedCandidate && (
        <ProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onMessage={() => openMessage(selectedCandidate)}
          isSaved={savedCandidates.has(selectedCandidate.id)}
          onToggleSave={() => toggleSave(selectedCandidate.id)}
        />
      )}
    </div>
  );
};

const CandidateCard = ({ candidate, isSaved, onToggleSave, onMessage, onViewProfile, viewMode }: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all ${viewMode === 'list' ? 'p-4' : 'p-6'}`}>
      <div className={viewMode === 'list' ? 'flex items-center gap-4' : ''}>
        {/* Header */}
        <div className={`flex items-start gap-4 ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
          <div className="relative">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FE691E] rounded-full border-2 border-white flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-[#222222] flex items-center gap-2">
                  {candidate.name}
                  {candidate.verified && (
                    <CheckCircle className="w-4 h-4 text-[#6A0DAD]" />
                  )}
                </h3>
                <p className="text-gray-600">{candidate.title}</p>
              </div>
              {viewMode === 'grid' && (
                <button
                  onClick={onToggleSave}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {candidate.experience_years} years
              </span>
            </div>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className={`${viewMode === 'list' ? '' : 'mb-4'}`}>
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#FE691E]/5 to-[#6A0DAD]/5 px-4 py-2 rounded-lg border border-[#FE691E]/20">
            <Target className="w-5 h-5 text-[#FE691E]" />
            <div>
              <div className="text-2xl font-bold text-[#222222]">{candidate.match_score}%</div>
              <div className="text-xs text-gray-600">Match Score</div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' && (
          <>
            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, expanded ? undefined : 6).map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#6A0DAD]/5 text-[#6A0DAD] rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 6 && !expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200"
                  >
                    +{candidate.skills.length - 6} more
                  </button>
                )}
              </div>
            </div>

            {/* Match Reasons */}
            <div className="mb-4 p-3 bg-[#FE691E]/5 rounded-lg border border-[#FE691E]/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#FE691E]" />
                <span className="text-sm font-semibold text-[#222222]">Why they're a great match:</span>
              </div>
              <ul className="space-y-1">
                {candidate.match_reasons.map((reason, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#FE691E] mt-0.5 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Score Breakdown */}
            {expanded && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                <h4 className="text-sm font-semibold text-[#222222] mb-3">Detailed Match Breakdown</h4>
                {Object.entries(candidate.score_breakdown).map(([key, value]) => {
                  if (key === 'total') return null;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-semibold">{Math.round(value * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#6A0DAD] to-[#6438c2] rounded-full transition-all"
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Available: {candidate.available_from}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>Expected: {candidate.salary_expectation}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{candidate.job_type_preference}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-4 h-4" />
                <span>{candidate.certifications} certifications</span>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className={`flex gap-2 ${viewMode === 'list' ? '' : 'pt-4 border-t border-gray-100'}`}>
          <button
            onClick={onViewProfile}
            className="flex-1 px-4 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#5A0B9D] flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Profile
          </button>
          <button
            onClick={onMessage}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
          {viewMode === 'list' && (
            <button
              onClick={onToggleSave}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isSaved ? 'bg-red-50 text-red-500' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageModal = ({ candidate, onClose, onSend }: any) => {
  const [message, setMessage] = useState('');

  const templates = {
    interview: `Hi ${candidate.name.split(' ')[0]},\n\nI came across your profile and was impressed by your experience with ${candidate.skills[0]}. I'd love to schedule a call to discuss an exciting opportunity.\n\nAre you available for a quick chat this week?\n\nBest regards`,
    interest: `Hello ${candidate.name.split(' ')[0]},\n\nYour profile matches perfectly with a position we're looking to fill. Would you be interested in learning more about this opportunity?\n\nLooking forward to hearing from you!`,
    custom: ''
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold text-[#222222]">Message {candidate.name}</h3>
                <p className="text-sm text-gray-600">{candidate.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMessage(templates.interview)}
                className="px-4 py-2 bg-[#6A0DAD]/5 text-[#6A0DAD] rounded-lg hover:bg-[#6A0DAD]/10 text-sm"
              >
                Interview Request
              </button>
              <button
                onClick={() => setMessage(templates.interest)}
                className="px-4 py-2 bg-[#6438c2]/5 text-[#6438c2] rounded-lg hover:bg-[#6438c2]/10 text-sm"
              >
                Express Interest
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">{message.length} / 1000 characters</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(candidate.id, message)}
            disabled={!message.trim()}
            className="px-6 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#5A0B9D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileModal = ({ candidate, onClose, onMessage, isSaved, onToggleSave }: any) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
        {/* Header with Cover */}
        <div className="relative h-32 bg-gradient-to-r from-[#6A0DAD] to-[#6438c2] rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 backdrop-blur hover:bg-opacity-30 rounded-lg text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          <div className="flex items-start gap-6 -mt-16 mb-6">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-32 h-32 rounded-2xl object-cover ring-8 ring-white shadow-xl"
            />
            <div className="flex-1 mt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#222222] flex items-center gap-2">
                    {candidate.name}
                    {candidate.verified && <CheckCircle className="w-6 h-6 text-[#6A0DAD]" />}
                  </h2>
                  <p className="text-lg text-gray-600 mt-1">{candidate.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {candidate.experience_years} years experience
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onToggleSave}
                    className={`p-3 rounded-lg ${isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Match Score Banner */}
          <div className="bg-gradient-to-r from-[#FE691E]/5 to-[#6A0DAD]/5 rounded-xl p-6 mb-6 border border-[#FE691E]/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-[#222222] mb-2">{candidate.match_score}% Match</div>
                <p className="text-gray-600">This candidate is an excellent fit for your position</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(candidate.score_breakdown).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-[#222222]">{Math.round(value * 100)}%</div>
                    <div className="text-xs text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skil: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-[#6A0DAD]/5 text-[#6A0DAD] rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Highlights */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Experience Highlights</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#6A0DAD] pl-4">
                    <h4 className="font-semibold text-[#222222]">Senior Mobile Developer</h4>
                    <p className="text-sm text-gray-600">Tech Company • 2020 - Present</p>
                    <p className="text-gray-700 mt-2">Led development of mobile apps with 1M+ downloads using React Native and TypeScript.</p>
                  </div>
                  <div className="border-l-4 border-[#6438c2] pl-4">
                    <h4 className="font-semibold text-[#222222]">Mobile Developer</h4>
                    <p className="text-sm text-gray-600">Startup Inc • 2018 - 2020</p>
                    <p className="text-gray-700 mt-2">Built and maintained multiple cross-platform mobile applications.</p>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Why They Match</h3>
                <div className="space-y-2">
                  {candidate.match_reasons.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#FE691E]/5 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-[#FE691E] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <button
                  onClick={onMessage}
                  className="w-full px-4 py-3 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#5A0B9D] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
                <button className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Interview
                </button>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <a href={`mailto:${candidate.email}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#6A0DAD] transition-colors">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{candidate.email}</span>
                  </a>
                  <a href={`tel:${candidate.phone}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#6A0DAD] transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{candidate.phone}</span>
                  </a>
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#6A0DAD] transition-colors">
                    <Linkedin className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">LinkedIn Profile</span>
                  </a>
                  <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#6A0DAD] transition-colors">
                    <Github className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">GitHub Profile</span>
                  </a>
                  {candidate.portfolio && (
                    <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#6A0DAD] transition-colors">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">Portfolio</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Availability</h3>
                <div className="space-y-2 bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">{candidate.available_from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium">{candidate.job_type_preference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Salary</span>
                    <span className="font-medium">{candidate.salary_expectation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Willing to Relocate</span>
                    <span className="font-medium">{candidate.willing_to_relocate ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-[#222222] mb-3">Profile Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#6A0DAD]/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#6A0DAD]">{candidate.certifications}</div>
                    <div className="text-xs text-gray-600">Certifications</div>
                  </div>
                  <div className="bg-[#6438c2]/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#6438c2]">{candidate.projects}</div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                  <div className="bg-[#FE691E]/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#FE691E]">{candidate.response_rate}%</div>
                    <div className="text-xs text-gray-600">Response Rate</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{candidate.reviews}</div>
                    <div className="text-xs text-gray-600">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data
const mockCandidates = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior React Native Developer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    location: 'San Francisco, CA',
    experience_years: 6,
    match_score: 95,
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'GraphQL', 'Node.js', 'AWS', 'CI/CD'],
    match_reasons: [
      'Strong skills match with 6/8 required technologies',
      '6 years of relevant React Native experience',
      'Located in San Francisco - perfect location fit',
      'Available immediately for full-time work'
    ],
    score_breakdown: {
      skills_score: 0.95,
      experience_score: 1.0,
      location_score: 1.0,
      availability_score: 0.95,
      personality_score: 0.85
    },
    available_from: 'Immediate',
    job_type_preference: 'Full-time',
    salary_expectation: '$130k - $160k',
    willing_to_relocate: false,
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    github: 'https://github.com/sarahjohnson',
    portfolio: 'https://sarahjohnson.dev',
    certifications: 5,
    projects: 12,
    response_rate: 98,
    reviews: 24,
    verified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Mobile Development Lead',
    avatar: 'https://i.pravatar.cc/150?img=12',
    location: 'San Jose, CA',
    experience_years: 8,
    match_score: 92,
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Firebase', 'React', 'Jest', 'Agile'],
    match_reasons: [
      'Extensive 8 years of mobile development expertise',
      'Leadership experience with distributed teams',
      'Bay Area location with hybrid flexibility',
      'Strong technical skills match'
    ],
    score_breakdown: {
      skills_score: 0.90,
      experience_score: 1.0,
      location_score: 0.95,
      availability_score: 0.85,
      personality_score: 0.90
    },
    available_from: 'Nov 1, 2025',
    job_type_preference: 'Full-time / Contract',
    salary_expectation: '$150k - $180k',
    willing_to_relocate: false,
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    linkedin: 'https://linkedin.com/in/michaelchen',
    github: 'https://github.com/michaelchen',
    portfolio: 'https://michaelchen.io',
    certifications: 8,
    projects: 18,
    response_rate: 95,
    reviews: 31,
    verified: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Full Stack Mobile Developer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    location: 'Austin, TX',
    experience_years: 5,
    match_score: 88,
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'Express', 'Docker'],
    match_reasons: [
      'Perfect 5 years of required experience',
      'Full-stack capabilities with mobile focus',
      'Remote work experience and preference',
      'Strong portfolio of mobile applications'
    ],
    score_breakdown: {
      skills_score: 0.85,
      experience_score: 1.0,
      location_score: 0.80,
      availability_score: 0.90,
      personality_score: 0.85
    },
    available_from: 'Oct 25, 2025',
    job_type_preference: 'Remote Full-time',
    salary_expectation: '$120k - $145k',
    willing_to_relocate: true,
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    linkedin: 'https://linkedin.com/in/emilyrodriguez',
    github: 'https://github.com/emilyrodriguez',
    portfolio: null,
    certifications: 4,
    projects: 15,
    response_rate: 92,
    reviews: 19,
    verified: true
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'React Native Developer',
    avatar: 'https://i.pravatar.cc/150?img=14',
    location: 'Seattle, WA',
    experience_years: 4,
    match_score: 85,
    skills: ['React Native', 'JavaScript', 'Redux', 'REST APIs', 'Git', 'Jira', 'Figma'],
    match_reasons: [
      'Solid 4 years of React Native experience',
      'Strong collaboration and communication skills',
      'Available for immediate start',
      'Competitive salary expectations'
    ],
    score_breakdown: {
      skills_score: 0.80,
      experience_score: 0.85,
      location_score: 0.85,
      availability_score: 1.0,
      personality_score: 0.80
    },
    available_from: 'Immediate',
    job_type_preference: 'Full-time',
    salary_expectation: '$110k - $135k',
    willing_to_relocate: false,
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    linkedin: 'https://linkedin.com/in/davidkim',
    github: 'https://github.com/davidkim',
    portfolio: 'https://davidkim.dev',
    certifications: 3,
    projects: 10,
    response_rate: 88,
    reviews: 15,
    verified: false
  },
  {
    id: '5',
    name: 'Jessica Wang',
    title: 'Senior Mobile Engineer',
    avatar: 'https://i.pravatar.cc/150?img=9',
    location: 'Los Angeles, CA',
    experience_years: 7,
    match_score: 90,
    skills: ['React Native', 'TypeScript', 'Redux', 'GraphQL', 'AWS', 'React', 'Swift', 'Kotlin'],
    match_reasons: [
      '7 years of mobile development expertise',
      'Cross-platform experience (iOS/Android)',
      'AWS cloud infrastructure knowledge',
      'Leadership and mentoring capabilities'
    ],
    score_breakdown: {
      skills_score: 0.92,
      experience_score: 0.95,
      location_score: 0.85,
      availability_score: 0.85,
      personality_score: 0.90
    },
    available_from: 'Nov 15, 2025',
    job_type_preference: 'Full-time',
    salary_expectation: '$145k - $170k',
    willing_to_relocate: true,
    email: 'jessica.wang@email.com',
    phone: '+1 (555) 567-8901',
    linkedin: 'https://linkedin.com/in/jessicawang',
    github: 'https://github.com/jessicawang',
    portfolio: 'https://jessicawang.com',
    certifications: 6,
    projects: 20,
    response_rate: 96,
    reviews: 28,
    verified: true
  },
  {
    id: '6',
    name: 'Alex Thompson',
    title: 'React Native Developer',
    avatar: 'https://i.pravatar.cc/150?img=13',
    location: 'Remote',
    experience_years: 5,
    match_score: 87,
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Firebase', 'React Native Web'],
    match_reasons: [
      'Exactly 5 years of required experience',
      'Proven remote work success',
      'Strong technical communication skills',
      'Firebase and backend integration experience'
    ],
    score_breakdown: {
      skills_score: 0.88,
      experience_score: 1.0,
      location_score: 1.0,
      availability_score: 0.75,
      personality_score: 0.80
    },
    available_from: 'Dec 1, 2025',
    job_type_preference: 'Remote Full-time',
    salary_expectation: '$115k - $140k',
    willing_to_relocate: false,
    email: 'alex.thompson@email.com',
    phone: '+1 (555) 678-9012',
    linkedin: 'https://linkedin.com/in/alexthompson',
    github: 'https://github.com/alexthompson',
    portfolio: 'https://alexthompson.tech',
    certifications: 4,
    projects: 14,
    response_rate: 90,
    reviews: 17,
    verified: true
  }
];

export default CandidateMatchResults;
