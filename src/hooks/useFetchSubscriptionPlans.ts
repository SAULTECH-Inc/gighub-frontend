import { SubscriptionType } from "../utils/types";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlans } from "../services/api";

export const useFetchSubscriptionPlans = (
  subscriptionType: SubscriptionType,
) => {
  return useQuery({
    queryKey: ["subscription-plans", subscriptionType],
    queryFn: async () => getSubscriptionPlans(subscriptionType),
    staleTime: 5 * 1000 * 60,
    enabled: true,
  });
};
