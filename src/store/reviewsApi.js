import { apiSlice } from './apiSlice'
import { supabase } from '../services/supabase'

const GHOST_THRESHOLDS = {
  applied: 14,
  phone_screen: 10,
  final_round: 14,
  offer: 7,
}

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitReview: builder.mutation({
      queryFn: async (review) => {
        const daysSinceLastContact = Math.floor(
          (new Date() - new Date(review.last_interaction_date)) / (1000 * 60 * 60 * 24)
        )
        const threshold = GHOST_THRESHOLDS[review.stage]
        if (review.ghosted && daysSinceLastContact < threshold) {
          return {
            error: {
              message: `You must wait ${threshold} days after last contact before marking as ghosted. ${threshold - daysSinceLastContact} day(s) remaining.`,
            },
          }
        }
        const { data, error } = await supabase.from('reviews').insert(review).select().single()
        if (error) return { error }
        return { data }
      },
      invalidatesTags: ['Review'],
    }),
  }),
})

export const { useSubmitReviewMutation } = reviewsApi
