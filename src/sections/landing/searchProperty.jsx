import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// @mui
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
// routes
import { useRouter } from 'src/routes/hooks';
// components
import SearchNotFound from 'src/components/search-not-found';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SearchProperty({ query, results, onSearch, hrefItem, loading }) {
  console.log(query);
  const router = useRouter();

  const handleClick = (slug) => {
    router.push(hrefItem(slug));
  };

  const handleKeyUp = (event) => {
    if (query) {
      if (event.key === 'Enter') {
        const selectItem = results.find((property) => property.name === query);
        if (selectItem) {
          handleClick(selectItem.id);
        }
      }
    }
  };

  return (
    <Autocomplete
      sx={{
        width: { xs: '100%', sm: 400, md: 500 },
      }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
            maxWidth: 600,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          inputProps={{
            ...params.inputProps,
            sx: { fontSize: 16, py: 1.5 },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderWidth: 2,
              borderColor: 'grey.400',
              borderRadius: 12,
              '&:hover': {
                borderColor: 'grey.600',
              },
              '&.Mui-focused': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ ml: 1, color: 'text.disabled', fontSize: 24 }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, property, { inputValue }) => {
        const matches = match(property.name, inputValue);
        const parts = parse(property.name, matches);
        const imageUrl = property.files.length > 0 ? property.files[0].file_url : '';

        return (
          <Box
            component="li"
            {...props}
            onClick={() => handleClick(property.slug)}
            key={property.id}
          >
            <Avatar
              alt={property.name}
              src={imageUrl}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <div>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}

SearchProperty.propTypes = {
  hrefItem: PropTypes.func,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
