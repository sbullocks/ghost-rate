import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, TextField, Autocomplete, Avatar, Typography,
  CircularProgress, Button
} from '@mui/material'
import { useSearchCompaniesQuery, useCreateCompanyMutation } from '../store/companiesApi'
import { getLogoUrl } from '../utils/clearbit'

export default function SearchBar() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [addMode, setAddMode] = useState(false)
  const [newDomain, setNewDomain] = useState('')

  const { data: results = [], isFetching } = useSearchCompaniesQuery(input, {
    skip: input.length < 2,
  })
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation()

  const handleSelect = (_e, company) => {
    if (company) navigate(`/company/${company.domain}`)
  }

  const handleAdd = async () => {
    if (!input.trim() || !newDomain.trim()) return
    const result = await createCompany({ name: input.trim(), domain: newDomain.trim() })
    if (result.data) navigate(`/company/${result.data.domain}`)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 560 }}>
      <Autocomplete
        freeSolo
        options={results}
        getOptionLabel={(o) => (typeof o === 'string' ? o : o.name)}
        loading={isFetching}
        onInputChange={(_e, val) => { setInput(val); setAddMode(false) }}
        onChange={handleSelect}
        noOptionsText={
          input.length >= 2 ? (
            <Button size="small" onClick={() => setAddMode(true)}>
              Add "{input}" as a new company
            </Button>
          ) : 'Type to search'
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={getLogoUrl(option.domain)} sx={{ width: 28, height: 28 }} variant="rounded" />
            <Box>
              <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
              <Typography variant="caption" color="text.secondary">{option.domain}</Typography>
            </Box>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search a company..."
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching && <CircularProgress size={16} />}
                  {params.InputProps?.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {addMode && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Company website (e.g. apple.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" onClick={handleAdd} disabled={isCreating}>
            {isCreating ? 'Adding...' : 'Add Company'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
