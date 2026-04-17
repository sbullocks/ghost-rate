import { apiSlice } from './apiSlice'
import { supabase } from '../services/supabase'
import { getLogoUrl } from '../utils/clearbit'

export const companiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchCompanies: builder.query({
      queryFn: async (query) => {
        if (!query || query.length < 2) return { data: [] }
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .ilike('name', `%${query}%`)
          .order('name')
          .limit(8)
        if (error) return { error }
        return { data }
      },
      providesTags: ['Company'],
    }),

    getCompanyByDomain: builder.query({
      queryFn: async (domain) => {
        const [{ data: company, error }, { data: score }] = await Promise.all([
          supabase.from('companies').select('*').eq('domain', domain).single(),
          supabase.from('company_scores').select('*').eq('domain', domain).single(),
        ])
        if (error) return { error }
        return { data: { ...company, ...(score ?? {}) } }
      },
      providesTags: (_r, _e, domain) => [{ type: 'Company', id: domain }],
    }),

    getCompanyReviews: builder.query({
      queryFn: async (companyId) => {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('company_id', companyId)
          .eq('moderation_status', 'approved')
          .order('created_at', { ascending: false })
        if (error) return { error }
        return { data }
      },
      providesTags: (_r, _e, id) => [{ type: 'Review', id }],
    }),

    createCompany: builder.mutation({
      queryFn: async ({ name, domain }) => {
        const normalized = domain.toLowerCase().replace(/^www\./, '')
        const { data: existing } = await supabase
          .from('companies')
          .select('id')
          .eq('domain', normalized)
          .single()
        if (existing) return { error: { message: 'Company already exists' } }
        const { data, error } = await supabase
          .from('companies')
          .insert({ name, domain: normalized, logo_url: getLogoUrl(normalized) })
          .select()
          .single()
        if (error) return { error }
        return { data }
      },
      invalidatesTags: ['Company'],
    }),
  }),
})

export const {
  useSearchCompaniesQuery,
  useGetCompanyByDomainQuery,
  useGetCompanyReviewsQuery,
  useCreateCompanyMutation,
} = companiesApi
