import React from 'react'
import {FilterIcon, Setting} from '../assets/icons';
import NotificationTemplate from '../components/ui/NotificationTemplate';
import dummyNotifications from '../utils/dummyNotifications';
import {UserType} from "../utils/enums.ts";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
    employerNavBarItemMap,
    employerNavItems,
    employerNavItemsMobile
} from "../utils/constants.ts";
import {USER_TYPE} from "../utils/helpers.ts";

const Notification: React.FC = () => {
    return (<div>
            {USER_TYPE === UserType.EMPLOYER ? (
                <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile}
                           navbarItemsMap={employerNavBarItemMap}/>) : (
                <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
                           navbarItemsMap={applicantNavBarItemMap}/>)

            }
            <div className='w-full min-h-screen flex flex-col items-center bg-[#F7F8FA] gap-6'>

                <div className='w-[100%] sm:w-[96%]'>
                    <div
                        className='w-full md:bg-white rounded-[16px] mt-[14px] py-[12px] px-[29px] flex justify-between items-center'>
                        <p className='text-[#000000] text-2xl font-bold'>Notification</p>
                        <div className='hidden md:flex gap-10'>
                            <input type="text"
                                   className='focus:ring-0 focus:outline-none focus:border-[#E6E6E6] flex rounded-[10px] py-[12px] px-[20px] w-[400px] border border-[#E6E6E6] bg-[#F7F7F7]'
                                   placeholder="Filter Notification"/>

                            <img className="cursor-pointer" src={Setting} alt="Setting icon"/>
                        </div>
                        <div className='md:hidden flex border border-[#E6E6E6] bg-white rounded-[10px] py-3 px-9'>
                            <img src={FilterIcon} alt="Filter Icon" className=''/>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-[96%] bg-white py-[25px] px-[26px] flex flex-col gap-4'>
                    <div className="w-full flex flex-col gap-4">
                        {dummyNotifications.map((notification) => (
                            <NotificationTemplate key={notification.id} {...notification} />))}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Notification;
