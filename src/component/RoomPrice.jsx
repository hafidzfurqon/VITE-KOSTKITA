import { useEffect, useMemo, useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';

const formatLabel = (duration) => {
  switch (duration) {
    case 'dayly':
      return 'Harian';
    case '1_month':
      return '1-2 Bulan';
    case '3_month':
      return '3-4 Bulan';
    case '6_month':
      return '6-11 Bulan';
    case '12_month':
    case '1_year':
      return '1 Tahun';
    default:
      return null; // Jangan tampilkan jika tidak cocok
  }
};

export const RoomWithTabs = ({ room, onSelectDuration }) => {
  // const initialIndex = room?.room_prices?.findIndex(
  //   (priceItem) => priceItem.duration === '1_year' || priceItem.duration === '12_month'
  // );
  // const [selectedTab, setSelectedTab] = useState(initialIndex !== -1 ? initialIndex : 0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    const selectedDuration = durations[newValue]?.duration;
    if (selectedDuration && onSelectDuration) {
      onSelectDuration(room.id, selectedDuration);
    }
  };

  const durations = useMemo(() => {
    return (
      room?.room_prices
        ?.map((priceItem) => {
          const label = formatLabel(priceItem.duration);
          if (!label) return null;

          const matchingDiscounts =
            priceItem.room_discounts?.filter((discount) => discount.price_id === priceItem.id) ||
            [];

          const discountObj = matchingDiscounts[0];
          const discount = discountObj ? parseFloat(discountObj.discount_value) : 0;

          const price = priceItem.price;
          const price_after_discount = price - (price * discount) / 100;

          return {
            label,
            duration: priceItem.duration,
            discount,
            price,
            price_after_discount: Math.round(price_after_discount),
          };
        })
        .filter(Boolean) || []
    );
  }, [room]);

  const initialIndex = durations.findIndex(
    (d) => d.duration === '1_year' || d.duration === '12_month'
  );
  const [selectedTab, setSelectedTab] = useState(initialIndex !== -1 ? initialIndex : 0);

  const selected = durations[selectedTab];

  useEffect(() => {
    const selectedDuration = durations[selectedTab]?.duration;
    if (selectedDuration && onSelectDuration) {
      onSelectDuration(room.id, selectedDuration);
    }
  }, [room.id, selectedTab]);

  return (
    <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, my: 2 }}>
      <Tabs
        variant={'scrollable'} // fullWidth untuk layar besar, scrollable untuk kecil
        // scrollButtons={'auto'} // tampilkan tombol scroll hanya di layar kecil
        allowScrollButtonsMobile
        aria-label="responsive tabs"
        value={selectedTab}
        onChange={handleChange}
      >
        {durations.map((item, idx) => (
          <Tab key={idx} label={item.label} />
        ))}
      </Tabs>

      {selected && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption">
            Mulai Dari:{' '}
            <span style={{ textDecoration: 'line-through' }}>{fCurrency(selected.price)}</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {selected.discount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  px: 1,
                  mr: 1,
                }}
              >
                -{selected.discount}%
              </Typography>
            )}
            <Typography variant="h6" sx={{ color: 'black' }}>
              {fCurrency(selected.price_after_discount)} / bulan
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
