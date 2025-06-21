import { FC, memo, useEffect, useState } from "react";
import AboutUs from "../../components/ui/employer/public-profile/AboutUs.tsx";
import MediaAndGallery from "../../components/ui/employer/public-profile/MediaAndGallery.tsx";
import CurrentJobOpening from "../../components/ui/employer/public-profile/CurrentJobOpening.tsx";
import EmployeesTestimonials from "../../components/ui/employer/public-profile/EmployeesTestimonials.tsx";
import ReviewsAndRatings from "../../components/ui/employer/public-profile/ReviewsAndRatings.tsx";
import ContactInfo from "../../components/ui/employer/public-profile/ContactInfo.tsx";
import PublicProfileCard from "../../components/ui/employer/public-profile/PublicProfileCard.tsx";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useNavigate, useParams } from "react-router-dom";
import { EmployerData } from "../../utils/types";
import { fetchEmployerDetailsById } from "../../services/api";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";

const EmployerPublicProfile: FC = () => {
  const { employerId, employerName } = useParams();
  const navigate = useNavigate();
  const [employer, setEmployer] = useState<EmployerData>();

  useEffect(() => {
    const getEmployerDetails = async (id: number) => {
      return await fetchEmployerDetailsById(id);
    };
    getEmployerDetails(Number(employerId)).then((res) => {
      const data: EmployerData = res.data;
      setEmployer(data);
      if (data.companyName !== employerName) {
        // Redirect to canonical URL
        navigate(`/employers/${data.id}/${data.companyName}/profile`, {
          replace: true,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerId, employerName]);
  return (
    <div className="flex min-h-screen w-full flex-col gap-y-6 bg-[#F7F8FA]">
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
      ) : (
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      )}
      {/* Main Content */}
      <div className="mx-auto h-auto w-full rounded-[16px] border-[2px] border-[#E6E6E6] bg-white p-8 md:w-[90%] lg:w-[70%]">
        <PublicProfileCard user={employer as EmployerData} />

        {/* Form */}
        <form className="flex w-full flex-col gap-y-4">
          <AboutUs user={employer as EmployerData} />
          {employer?.brandAndVisuals && (
            <MediaAndGallery user={employer as EmployerData} />
          )}
          <CurrentJobOpening employerId={Number(employerId)} />
          <EmployeesTestimonials />
          <ReviewsAndRatings />
          <ContactInfo user={employer as EmployerData} />
        </form>
      </div>
    </div>
  );
};

export default memo(EmployerPublicProfile);
