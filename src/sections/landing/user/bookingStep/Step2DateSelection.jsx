import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Grid } from '@mui/material';
import { Box } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';

export default function Step2DateSelection({ onNext, startPrice, discounts, savedData }) {
  const [checkIn, setCheckIn] = useState(savedData?.check_in || '');
  const [months, setMonths] = useState(savedData?.months || 1);

  useEffect(() => {
    if (savedData) {
      setCheckIn(savedData.check_in || '');
      setMonths(savedData.months || 1);
    }
  }, [savedData]);

  const checkOut = useMemo(() => {
    if (!checkIn) return '';
    return new Date(new Date(checkIn).setMonth(new Date(checkIn).getMonth() + months))
      .toISOString()
      .split('T')[0];
  }, [checkIn, months]);

  const applicableDiscount = useMemo(() => {
    return discounts?.find(
      (discount) => months >= discount?.min_month && months <= discount?.max_month
    );
  }, [months, discounts]);

  const discountedPrice = useMemo(() => {
    return applicableDiscount ? applicableDiscount.price_after_discount : startPrice;
  }, [startPrice, applicableDiscount]);

  // Hanya kirim data jika ada salah satu ID yang tersedia
  const propertyDiscountId = applicableDiscount?.property_discount_id || null;
  const propertyRoomDiscountId = applicableDiscount?.property_room_discount_id || null;
  const promoId = applicableDiscount?.promo_id || null;

  const handleNext = () => {
    const nextData = {
      check_in: checkIn,
      check_out: checkOut,
      months,
      discounted_price: discountedPrice,
    };

    if (propertyDiscountId || propertyRoomDiscountId || promoId) {
      nextData.property_discount_id = propertyDiscountId;
      nextData.property_room_discount_id = propertyRoomDiscountId;
      nextData.promo_id = promoId;
    }

    onNext(nextData);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Pilih Tanggal Check-in
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Check-in"
            type="date"
            fullWidth
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Check-out"
            type="date"
            fullWidth
            value={checkOut}
            disabled
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Pilih Durasi Sewa:
          </Typography>
          <Grid container spacing={1}>
            {[...Array(12).keys()].map((i) => {
              const num = i + 1;
              const hasDiscount = discounts?.some(
                (discount) => num >= discount?.min_month && num <= discount?.max_month
              );

              return (
                <Grid item xs={4} sm={3} md={2} key={num}>
                  <Button
                    onClick={() => setMonths(num)}
                    variant={months === num ? 'contained' : 'outlined'}
                    color={months === num ? 'inherit' : 'primary'}
                    sx={{ width: '100%' }}
                  >
                    {num} Bulan {hasDiscount && <Chip label="%" color="error" size="small" />}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Harga: <strong>Rp {startPrice?.toLocaleString()}</strong>
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
