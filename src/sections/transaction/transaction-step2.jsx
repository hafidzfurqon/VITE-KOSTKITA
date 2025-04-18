import {
  Autocomplete,
  Box,
  TextField,
  Card,
  Stack,
  Container,
  MenuItem,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useFetchAllPropertyRoom } from 'src/hooks/property_room';
import { useFetchAllServices } from 'src/hooks/services';
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

export function TransactionStepTwo({ control, data, isOwnerProperty, setValue, watch }) {
  const { data: service = [], isLoading: isLoadingService } = useFetchAllServices();
  const [selectedProperty, setSelectedProperty] = useState(null);

  const { data: room, isLoading } = useFetchAllPropertyRoom(selectedProperty?.id, isOwnerProperty);

  const rooms = room?.rooms ?? [];

  const checkin = watch('checkin');
  const duration = watch('duration');
  const durations = [
    { label: 'Harian', value: 'daily' },
    { label: '1 Bulan', value: 1 },
    { label: '3 Bulan', value: 3 },
    { label: '6 Bulan', value: 6 },
    { label: '1 Tahun', value: 12 },
  ];

  console.log(checkin);
  console.log(duration);

  useEffect(() => {
    if (checkin && duration) {
      const checkoutDate = dayjs(checkin)
        .add(duration, 'month') // ini sesuai dengan label di dropdown
        .subtract(1, 'day') // biar check-out itu HARI TERAKHIR tinggal
        .toDate();

      setValue('checkout', checkoutDate);
    }
  }, [checkin, duration]);

  useEffect(() => {
    if (!selectedProperty && data?.length > 0) {
      const defaultProperty = data.find((item) => item.id === watch('property_id'));
      if (defaultProperty) {
        setSelectedProperty(defaultProperty);
      }
    }
  }, [data, watch('property_id')]);
  //   console.log('Checkout:', field.value, typeof field.value);

  return (
    // <LocalizationProvider></LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <Container>
          <Stack spacing={3} sx={{ px: 3, py: 3 }}>
            <Autocomplete
              id="property-owner-select"
              options={data}
              autoHighlight
              getOptionLabel={(option) => option.name}
              value={(data ?? []).find((opt) => opt.id === watch('property_id')) || null}
              onChange={(e, value) => {
                setSelectedProperty(value);
                setValue('property_id', value?.id || null);
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                const imageUrl = option.files?.[0]?.file_url || '';
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    {imageUrl && (
                      <img
                        loading="lazy"
                        width="40"
                        height="40"
                        style={{ objectFit: 'cover' }}
                        src={imageUrl}
                        alt={option.name}
                      />
                    )}
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pilih Properti"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />

            <Autocomplete
              id="property-room-select"
              options={rooms || []}
              disabled={!selectedProperty}
              autoHighlight
              loading={isLoading}
              getOptionLabel={(option) => option.name || option.room_name || 'Tanpa Nama'}
              value={(rooms ?? []).find((room) => room.id === watch('room_number')) || null}
              onChange={(e, value) => setValue('room_number', value?.id || null)}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                const imageUrl = option.room_files?.[0]?.file_url || '';
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    {imageUrl && (
                      <img
                        loading="lazy"
                        width="40"
                        height="40"
                        style={{ objectFit: 'cover' }}
                        src={imageUrl}
                        alt={option.name}
                      />
                    )}
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pilih Ruangan"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />

            <Autocomplete
              id="select-service"
              multiple
              limitTags={5}
              loading={isLoadingService}
              options={service}
              autoHighlight
              getOptionLabel={(option) => `${option.name} - ${fCurrency(option.price)}`}
              value={(service ?? []).filter((s) =>
                (watch('additional_services') ?? []).includes(s.id)
              )}
              onChange={(event, value) => {
                setValue(
                  'additional_services',
                  value.map((v) => v.id)
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Layanan Tambahan (Optional)"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />
            <Controller
              name="checkin"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  label="Tanggal Check-in"
                  minDate={dayjs().add(1, 'day').toDate()}
                  maxDate={dayjs().endOf('year').toDate()}
                  value={field.value || null}
                  onChange={field.onChange}
                  slotProps={{
                    day: (ownerState) => {
                      const isToday = dayjs().isSame(ownerState.day, 'day');
                      const isTomorrow = dayjs().add(1, 'day').isSame(ownerState.day, 'day');

                      return {
                        sx: {
                          ...(isToday && {
                            // Hilangkan lingkaran dari today asli
                            border: 'none',
                            backgroundColor: 'transparent',
                          }),
                          ...(isTomorrow && {
                            // Tambahkan lingkaran untuk hari esok
                            border: '1px solid',
                            borderColor: 'primary.main',
                            borderRadius: '50%',
                          }),
                        },
                      };
                    },
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              )}
            />

            <Controller
              name="duration"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  select
                  label="Durasi Tinggal"
                  fullWidth
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange;
                    setValue('duration', e.target.value);
                  }}
                >
                  {durations.map((d) => (
                    <MenuItem key={d.value} value={d.value}>
                      {d.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="checkout"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Tanggal Check-out"
                  value={field.value || null}
                  readOnly
                  disabled={!field.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      helperText={
                        field.value
                          ? 'Tanggal ini otomatis dihitung'
                          : 'Pilih tanggal check-in & durasi dulu'
                      }
                    />
                  )}
                />
              )}
            />
            <Typography>
              Pesanan {checkin ? fDate(checkin) : '---'} Sampai{' '}
              {watch('checkout') ? fDate(watch('checkout')) : '---'}
            </Typography>
          </Stack>
        </Container>
      </Card>
    </LocalizationProvider>
  );
}
