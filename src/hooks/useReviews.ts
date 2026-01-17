import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserReviews, submitReview } from "../services/api";
import { Review } from "../utils/types";

export const useReviews = (userId: number | null) => {
  const queryClient = useQueryClient();
  const {
    data: reviews ,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['reviews', userId],
    queryFn: () => fetchUserReviews(userId!),
    enabled: !!userId,
    initialData: [],
  });

  const {   mutate: createReview,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError } = useMutation({
    mutationFn: submitReview,
    onSuccess: (newReview: Review) => {
      queryClient.setQueryData<Review[]>(['reviews', userId], (oldReviews) => {
        if (!oldReviews) return [newReview];
        return [newReview, ...oldReviews];
      });
      queryClient.invalidateQueries({ queryKey: ['reviews', userId] }).then(r => r);
    },
  });

  return {
    reviews,
    isLoading,
    isError,
    refetch,
    createReview,
    isCreating,
    isCreateSuccess,
    isCreateError,
    createError
  };
};
