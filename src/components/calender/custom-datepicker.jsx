import { useState } from 'react';
import { Box, InputBase, Popover, Typography, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClearIcon from '@mui/icons-material/Clear';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export default function CustomDatePicker({ selectedDate, onDateChange, label }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClear = () => {
    onDateChange(null);
    setAnchorEl(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid #ddd',
          paddingBottom: '4px',
          cursor: 'pointer',
          minWidth: '180px',
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <IconButton size="small">
          <CalendarTodayIcon sx={{ color: '#FFD700' }} />
        </IconButton>
        <InputBase
          value={selectedDate ? dayjs(selectedDate).format('DD MMM YYYY') : 'Pilih Tanggal'}
          readOnly
          sx={{
            flexGrow: 1,
            fontSize: '16px',
            color: selectedDate ? '#000' : '#aaa',
          }}
        />
        {selectedDate && (
          <IconButton onClick={handleClear} size="small">
            <ClearIcon sx={{ color: 'gray' }} />
          </IconButton>
        )}
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transitionDuration={0}
        slotProps={{
          paper: {
            component: motion.div,
            initial: { y: -20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: -20, opacity: 0 },
            transition: { type: 'spring', stiffness: 200, damping: 20 },
            style: { overflow: 'hidden' },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {label || 'Pilih Tanggal'}
          </Typography>
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => {
              onDateChange(newDate);
              setAnchorEl(null);
            }}
            renderInput={() => <></>}
          />
        </Box>
      </Popover>
    </LocalizationProvider>
  );
}
