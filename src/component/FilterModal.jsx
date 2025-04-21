import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Radio,
  Stack,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Button,
  Slider,
  Divider,
  Tooltip,
  Checkbox,
  IconButton,
  Typography,
  FormControlLabel,
  InputBase,
} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { Iconify } from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import { Scrollbar } from 'src/components/scrollbar';

export default function FilterModal({
  open,
  onOpen,
  onClose,
  filters,
  onFilters,
  canReset,
  onResetFilters,
  colorOptions = [],
  genderOptions = [],
  ratingOptions = [],
  categoryOptions = [],
  tipeHunianOptions = [],
  jumlahOrangOptions = [],
}) {
  const marksLabel = [...Array(11)].map((_, index) => {
    const value = index * 1000000;
    return {
      value,
      label: index % 2 ? '' : `Rp${value / 1000000}jt`,
    };
  });

  const handleFilterGender = useCallback(
    (newValue) => {
      const checked = (filters.gender || []).includes(newValue)
        ? filters.gender.filter((value) => value !== newValue)
        : [...(filters.gender || []), newValue];

      // Pass complete filters object instead of just field and value
      onFilters({
        ...filters,
        gender: checked,
      });
    },
    [filters, onFilters]
  );

  const handleFilterCategory = useCallback(
    (newValue) => {
      onFilters({
        ...filters,
        category: newValue,
      });
    },
    [filters, onFilters]
  );

  const handleFilterPriceRange = useCallback(
    (event, newValue) => {
      onFilters({
        ...filters,
        priceRange: newValue,
      });
    },
    [filters, onFilters]
  );

  const handleFilterRating = useCallback(
    (newValue) => {
      onFilters({
        ...filters,
        rating: newValue,
      });
    },
    [filters, onFilters]
  );

  const handleFilterTipeHunian = useCallback(
    (option) => {
      const newTipeHunian = (filters.tipeHunian || []).includes(option)
        ? filters.tipeHunian.filter((val) => val !== option)
        : [...(filters.tipeHunian || []), option];

      onFilters({
        ...filters,
        tipeHunian: newTipeHunian,
      });
    },
    [filters, onFilters]
  );

  const handleFilterJumlahOrang = useCallback(
    (option) => {
      const newJumlahOrang = (filters.jumlahOrang || []).includes(option)
        ? filters.jumlahOrang.filter((val) => val !== option)
        : [...(filters.jumlahOrang || []), option];

      onFilters({
        ...filters,
        jumlahOrang: newJumlahOrang,
      });
    },
    [filters, onFilters]
  );

  const handleApplyFilters = () => {
    onClose();
  };

  // Prevent event propagation for all click events
  const preventPropagation = (e) => {
    if (e) {
      e.stopPropagation(); // hanya hentikan propagasi, jangan preventDefault
    }
  };

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
      onClick={preventPropagation}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>
      <IconButton
        onClick={(e) => {
          preventPropagation(e);
          onClose();
        }}
      >
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderTipeHunian = (
    <Stack spacing={2} onClick={preventPropagation}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tipe Hunian
      </Typography>
      {tipeHunianOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={(filters.tipeHunian || []).includes(option)}
              onClick={preventPropagation}
              onChange={(e) => {
                handleFilterTipeHunian(option);
              }}
            />
          }
          label={option}
          // onClick={preventPropagation}
          onMouseDown={preventPropagation}
          onMouseUp={preventPropagation}
        />
      ))}
    </Stack>
  );

  const renderJumlahOrang = (
    <Stack spacing={2} onClick={preventPropagation}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Jumlah Orang
      </Typography>
      {jumlahOrangOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={(filters.jumlahOrang || []).includes(String(option))}
              onClick={preventPropagation}
              onChange={(e) => {
                preventPropagation(e);
                handleFilterJumlahOrang(String(option));
              }}
            />
          }
          label={String(option)}
          onClick={preventPropagation}
          onMouseDown={preventPropagation}
          onMouseUp={preventPropagation}
        />
      ))}
    </Stack>
  );

  const renderPrice = (
    <Stack spacing={2} onClick={preventPropagation}>
      <Typography variant="subtitle2">Price</Typography>
      <Stack direction="row" spacing={5} sx={{ my: 2 }}>
        <InputRange
          type="min"
          value={filters.priceRange || [0, 10000000]}
          onFilters={handleFilterPriceRange}
        />
        <InputRange
          type="max"
          value={filters.priceRange || [0, 10000000]}
          onFilters={handleFilterPriceRange}
        />
      </Stack>
      <Slider
        value={filters.priceRange || [0, 10000000]}
        onChange={handleFilterPriceRange}
        step={100000}
        min={0}
        max={10000000}
        marks={marksLabel}
        getAriaValueText={(value) => `Rp${value}`}
        valueLabelFormat={(value) => `Rp${value}`}
        sx={{ alignSelf: 'center', width: `calc(100% - 24px)` }}
        onClick={preventPropagation}
      />
    </Stack>
  );

  const renderRating = (
    <Stack spacing={2} onClick={preventPropagation}>
      <Typography variant="subtitle2">Rating</Typography>
      {ratingOptions.map((item, index) => (
        <Stack
          key={item}
          direction="row"
          onClick={(e) => {
            preventPropagation(e);
            handleFilterRating(item);
          }}
          sx={{
            borderRadius: 1,
            cursor: 'pointer',
            typography: 'body2',
            '&:hover': { opacity: 0.48 },
            ...(filters.rating === item && {
              pl: 0.5,
              pr: 0.75,
              py: 0.25,
              bgcolor: 'action.selected',
            }),
          }}
        >
          <Rating readOnly value={4 - index} sx={{ mr: 1 }} /> & Up
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose();
      }}
      disableEscapeKeyDown
      keepMounted
      PaperProps={{
        sx: {
          width: {
            xs: '95%',
            sm: '80%',
            md: '500px',
          },
          maxWidth: '600px',
          maxHeight: '90vh',
          m: 0,
          borderRadius: 2,
        },
        onClick: preventPropagation,
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      {renderHead}
      <Divider />
      <DialogContent sx={{ p: 0 }} onClick={preventPropagation}>
        <Scrollbar sx={{ p: 3, maxHeight: '60vh' }} onClick={preventPropagation}>
          <Stack spacing={3} onClick={preventPropagation}>
            {/* {renderCategory} */}
            <Divider />
            {renderTipeHunian}
            <Divider />
            {renderJumlahOrang}
            <Divider />
            {renderPrice}
            {ratingOptions && ratingOptions.length > 0 && (
              <>
                <Divider />
                {renderRating}
              </>
            )}
          </Stack>
        </Scrollbar>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, py: 2, justifyContent: 'space-between' }}
        onClick={preventPropagation}
      >
        <Button
          onClick={(e) => {
            preventPropagation(e);
            onResetFilters();
          }}
          color="error"
          disabled={!canReset}
        >
          Reset Filters
        </Button>
        <Button
          onClick={(e) => {
            preventPropagation(e);
            handleApplyFilters();
          }}
          variant="contained"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function InputRange({ type, value, onFilters }) {
  const [min = 0, max = 10000000] = value || [];

  const preventPropagation = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleChange = useCallback(
    (event) => {
      preventPropagation(event);
      const newValue = Number(event.target.value);

      if (type === 'min') {
        onFilters(null, [newValue, max]);
      } else {
        onFilters(null, [min, newValue]);
      }
    },
    [min, max, type, onFilters]
  );

  const handleBlur = useCallback(
    (event) => {
      preventPropagation(event);
      const newMin = type === 'min' ? Math.max(0, Number(event.target.value)) : min;
      const newMax = type === 'max' ? Math.min(10000000, Number(event.target.value)) : max;
      onFilters(null, [newMin, newMax]);
    },
    [min, max, type, onFilters]
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: 1 }}
      onClick={preventPropagation}
    >
      <Typography
        variant="caption"
        sx={{
          flexShrink: 0,
          color: 'text.disabled',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightSemiBold',
        }}
      >
        {`${type} (Rp)`}
      </Typography>

      <InputBase
        fullWidth
        value={type === 'min' ? min : max}
        onChange={handleChange}
        onBlur={handleBlur}
        onClick={preventPropagation}
        inputProps={{
          step: 100000,
          min: 0,
          max: 10000000,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
        sx={{
          maxWidth: 80,
          borderRadius: 0.75,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          [`& .${inputBaseClasses.input}`]: {
            p: 0.5,
            textAlign: 'center',
          },
        }}
      />
    </Stack>
  );
}

FilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilters: PropTypes.func.isRequired,
  canReset: PropTypes.bool,
  onResetFilters: PropTypes.func,
  colorOptions: PropTypes.array,
  genderOptions: PropTypes.array,
  ratingOptions: PropTypes.any,
  categoryOptions: PropTypes.any,
  tipeHunianOptions: PropTypes.any,
  jumlahOrangOptions: PropTypes.any,
};
