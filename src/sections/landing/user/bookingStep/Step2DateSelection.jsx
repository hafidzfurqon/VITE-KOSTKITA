import { Typography, TextField, Button, Grid, Box, Chip } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';

export default function Step2DateSelection({ onNext, startPrice, discounts, savedData }) {
  const [checkIn, setCheckIn] = useState(savedData?.check_in || '');
  const [months, setMonths] = useState(savedData?.months || 1);
  const [checkInTouched, setCheckInTouched] = useState(false);

  useEffect(() => {
    if (savedData) {
      setCheckIn(savedData.check_in || '');
      setMonths(savedData.months || 1);
    }
  }, [savedData]);

  const applicableDiscount = useMemo(() => {
    return discounts?.find(
      (discount) => months >= discount?.min_month && months <= discount?.max_month
    );
  }, [months, discounts]);

  const discountedPrice = useMemo(() => {
    const totalPrice = startPrice * months;
    return applicableDiscount ? applicableDiscount.price_after_discount : totalPrice;
  }, [startPrice, months, applicableDiscount]);

  const monthRanges = [
    { range: '1-2', min: 1, max: 2 },
    { range: '3-5', min: 3, max: 5 },
    { range: '6-11', min: 6, max: 11 },
    { range: '>12', min: 12, max: 100 },
  ];

  const handleNext = () => {
    if (!checkIn) {
      alert('Tanggal booking wajib diisi.');
      return;
    }
    if (!months || months < 1) {
      alert('Durasi booking wajib diisi.');
      return;
    }

    const nextData = {
      booking_date: checkIn, // Sesuai kebutuhan API
      total_booking_month: months, // Sesuai kebutuhan API
      discounted_price: discountedPrice, // Harga masih dipertahankan
    };

    onNext(nextData);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Pilih Tanggal Booking
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Check-in"
            type="date"
            fullWidth
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            onBlur={() => setCheckInTouched(true)} // Menandai bahwa input sudah disentuh
            InputLabelProps={{ shrink: true }}
            error={checkInTouched && !checkIn} // Error hanya muncul jika input kosong setelah disentuh
            helperText={checkInTouched && !checkIn ? 'Tanggal check-in wajib diisi.' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Pilih Durasi Sewa:
          </Typography>
          <Grid container spacing={1}>
            {monthRanges.map((rangeItem, rangeIndex) => {
              const hasDiscount = discounts?.some(
                (discount) =>
                  rangeItem.min >= discount?.min_month && rangeItem.max <= discount?.max_month
              );

              return (
                <Grid item xs={6} sm={3} key={rangeIndex}>
                  <Button
                    onClick={() => setMonths(rangeItem.min)}
                    variant={
                      months >= rangeItem.min && months <= rangeItem.max ? 'contained' : 'outlined'
                    }
                    color={
                      months >= rangeItem.min && months <= rangeItem.max ? 'inherit' : 'primary'
                    }
                    sx={{ width: '100%' }}
                  >
                    {rangeItem.range} Bulan{' '}
                    {hasDiscount && <Chip label="%" color="error" size="small" />}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Harga: <strong>Rp {(startPrice * months).toLocaleString()}</strong>
          </Typography>
          {applicableDiscount && (
            <Typography variant="body1" color="secondary">
              Diskon: -Rp {parseInt(applicableDiscount.discount_amount).toLocaleString()}
              <br />
              Harga setelah diskon: <strong>Rp {discountedPrice.toLocaleString()}</strong>
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleNext} variant="contained" fullWidth disabled={!checkIn}>
            Lanjut
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
