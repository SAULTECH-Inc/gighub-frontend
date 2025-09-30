import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import Image7 from "../../../../assets/images/image7.png";
import { EmployerData } from "../../../../utils/types";
import { useChatStore } from "../../../../store/useChatStore.ts";
import { MapPin, Users, Building2, MessageCircle, Heart } from "lucide-react";
import { followCompany, unfollowCompany } from "../../../../services/api";

interface PublicProfileCardProp {
  user: EmployerData;
}

const PublicProfileCard: React.FC<PublicProfileCardProp> = memo(({ user }) => {
  const { setIsClosed, setRecipient } = useChatStore();

  const [isFollowing, setIsFollowing] = useState<boolean>(user.isFollowed || false);

  const handleSendMessage = React.useCallback(() => {
    if (user?.email) {
      setRecipient(user.email);
      setIsClosed(false);
    }
  }, [user?.email, setRecipient, setIsClosed]);

  // Early return if no user data
  if (!user) {
    return (
      <div className="relative mx-auto max-w-4xl">
        <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8">
              <div className="h-24 w-24 rounded-2xl bg-slate-200 sm:h-32 sm:w-32"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto max-w-4xl"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8">
            {/* Company Logo */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-1 shadow-lg sm:h-32 sm:w-32">
                <img
                  src={user.companyLogo || Image7}
                  alt={`${user.companyName || 'Company'} logo`}
                  className="h-full w-full rounded-xl object-cover"
                  loading="lazy"
                />
              </div>
              {/* Verification Badge */}
              <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-1.5 shadow-md">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl truncate">
                {user.companyName || 'Company Name'}
              </h1>
              {user.aboutCompany && (
                <p className="mt-2 text-slate-600 leading-relaxed line-clamp-2">
                  {user.aboutCompany}
                </p>
              )}

              {/* Company Stats */}
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-4">
                {user.industry && (
                  <div className="flex items-center space-x-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-indigo-700">{user.industry}</span>
                  </div>
                )}
                {user.companySize && (
                  <div className="flex items-center space-x-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-700">{user.companySize}</span>
                  </div>
                )}
                {user.companyAddress && (
                  <div className="flex items-center space-x-2 rounded-lg bg-amber-50 px-3 py-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-700 truncate max-w-[150px]">
                      {user.companyAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 shrink-0 sm:flex-row sm:space-y-0 sm:space-x-3">
              {
                isFollowing ? (<>
                  <button
                    onClick={async()=>{
                      const response = await unfollowCompany(user?.id || 0);
                      if(response.statusCode === 200){
                        setIsFollowing((prev)=>!prev);
                    }}}
                    className="flex items-center justify-center space-x-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    aria-label="Following"
                  >
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Following</span>
                  </button>
                </>) : (
                  <>
                    <button
                      onClick={async()=>{
                        const response = await followCompany(user?.id || 0);
                        if(response.statusCode === 200){
                          setIsFollowing((prev)=>!prev);
                        }}}
                      className="flex items-center justify-center space-x-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      aria-label="Follow company"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Follow</span>
                    </button>
                  </>
                )
              }

              <button
                onClick={handleSendMessage}
                disabled={!user.email}
                className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Send message to company"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

PublicProfileCard.displayName = 'PublicProfileCard';

export default PublicProfileCard;
