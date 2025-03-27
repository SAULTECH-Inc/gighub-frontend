import {create} from "zustand";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";


interface ISubscriptionState{
    applicantSubscription: Subscription
}
const useUserSubscription = create<ISubscriptionState>()(persist(immer<ISubscriptionState>((set)=>{
    applicantSubscription: {
        id: '',
        subscriptionType: '',
        subscriptionStatus: '',
        subscriptionDate: '',
        subscriptionEndDate: '',
    },
    setSubscription: (subscription: Subscription) => {
        set((state) => {
            state.applicantSubscription = subscription;
        })
    }
}),{}))
