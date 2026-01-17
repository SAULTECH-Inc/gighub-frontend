import {
  FC,
  memo,
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployerData } from "../../utils/types";
import { fetchEmployerDetailsById } from "../../services/api";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  employerNavBarItemMap,
} from "../../utils/constants.ts";

// Lazy load components for better performance
const PublicProfileCard = lazy(
  () =>
    import("../../components/ui/employer/public-profile/PublicProfileCard.tsx"),
);
const AboutUs = lazy(
  () => import("../../components/ui/employer/public-profile/AboutUs.tsx"),
);
const MediaAndGallery = lazy(
  () =>
    import("../../components/ui/employer/public-profile/MediaAndGallery.tsx"),
);
const CurrentJobOpening = lazy(
  () =>
    import("../../components/ui/employer/public-profile/CurrentJobOpening.tsx"),
);
const EmployeesTestimonials = lazy(
  () =>
    import(
      "../../components/ui/employer/public-profile/EmployeesTestimonials.tsx"
    ),
);
const ReviewsAndRatings = lazy(
  () =>
    import("../../components/ui/employer/public-profile/ReviewsAndRatings.tsx"),
);
const ContactInfo = lazy(
  () => import("../../components/ui/employer/public-profile/ContactInfo.tsx"),
);

// Skeleton component for loading states
const SectionSkeleton = () => (
  <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
    <div className="animate-pulse">
      <div className="mb-4 h-6 w-1/4 rounded bg-slate-200"></div>
      <div className="space-y-3">
        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
        <div className="h-4 w-1/2 rounded bg-slate-200"></div>
        <div className="h-4 w-5/6 rounded bg-slate-200"></div>
      </div>
    </div>
  </div>
);

const EmployerPublicProfile: FC = () => {
  const { employerId, employerName } = useParams();
  const navigate = useNavigate();
  const [employer, setEmployer] = useState<EmployerData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const fetchEmployerData = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetchEmployerDetailsById(id);
        const data: EmployerData = res.data;
        setEmployer(data);

        // Handle URL canonicalization
        if (data.companyName !== employerName) {
          navigate(`/employers/${data.id}/${data.companyName}/profile`, {
            replace: true,
          });
        }
      } catch (err) {
        setError("Failed to load company profile");
        console.error("Error fetching employer details:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [employerName, navigate],
  );

  useEffect(() => {
    if (employerId) {
      fetchEmployerData(Number(employerId)).then((r) => r);
    }
  }, [employerId, fetchEmployerData]);

  // Optimized loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {USER_TYPE === UserType.EMPLOYER ? (
          <TopNavBar
            navbarItemsMap={employerNavBarItemMap}
            userType={"employer"}
          />
        ) : (
          <TopNavBar
            navbarItemsMap={applicantNavBarItemMap}
            userType={"applicant"}
          />
        )}

        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 sm:h-40"></div>
          <div className="absolute inset-x-0 top-16 sm:top-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
                <div className="flex flex-col items-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8">
                  <div className="h-24 w-24 rounded-2xl bg-slate-200 sm:h-32 sm:w-32"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-8 w-1/2 rounded bg-slate-200"></div>
                    <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 w-16 rounded bg-slate-200"></div>
                      <div className="h-6 w-16 rounded bg-slate-200"></div>
                      <div className="h-6 w-20 rounded bg-slate-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 sm:pt-40 lg:px-8">
          <div className="space-y-8">
            {[...Array(5)].map((_, index) => (
              <SectionSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            Error Loading Profile
          </h3>
          <p className="mb-4 text-slate-600">{error}</p>
          <button
            onClick={() => fetchEmployerData(Number(employerId))}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navbarItemsMap={employerNavBarItemMap}
          userType={"employer"}
        />
      ) : (
        <TopNavBar
          navbarItemsMap={applicantNavBarItemMap}
          userType={"applicant"}
        />
      )}

      {/* Hero Section with Profile Card */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 sm:h-40"></div>
        <div className="absolute inset-x-0 top-16 sm:top-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionSkeleton />}>
              <PublicProfileCard user={employer as EmployerData} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 sm:pt-40 lg:px-8">
        <div className="space-y-6">
          {/* About Section */}
          <Suspense fallback={<SectionSkeleton />}>
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
              <AboutUs user={employer as EmployerData} />
            </div>
          </Suspense>

          {/* Media Gallery - Only render if there are images */}
          {employer?.brandAndVisuals && employer.brandAndVisuals.length > 0 && (
            <Suspense fallback={<SectionSkeleton />}>
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                <MediaAndGallery user={employer as EmployerData} />
              </div>
            </Suspense>
          )}

          {/* Job Openings */}
          <Suspense fallback={<SectionSkeleton />}>
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
              <CurrentJobOpening employerId={Number(employerId)} />
            </div>
          </Suspense>

          {/* Two Column Layout for Testimonials and Reviews - Optimized for mobile */}
          <div className="grid gap-6 xl:grid-cols-2">
            <Suspense fallback={<SectionSkeleton />}>
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                <EmployeesTestimonials />
              </div>
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                <ReviewsAndRatings />
              </div>
            </Suspense>
          </div>

          {/* Contact Information */}
          <Suspense fallback={<SectionSkeleton />}>
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
              <ContactInfo user={employer as EmployerData} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default memo(EmployerPublicProfile);
