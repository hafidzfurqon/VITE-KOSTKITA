import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Container,
  MenuItem,
  Box,
  IconButton,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
  Popover,
} from '@mui/material';
import { DateRange, Delete, ReceiptLongOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { fDate } from 'src/utils/format-time';
import { useKeenSlider } from 'keen-slider/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useSearchParams } from 'react-router-dom';
import { useFetchAllServices } from 'src/hooks/services';
import Loading from 'src/components/loading/loading';
import { Autocomplete } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';
import CustomDatePicker from 'src/components/calender/custom-datepicker';
import dayjs from 'dayjs';

export default function Step1Penghuni({
  room,
  watch,
  setSelectedServices,
  selectedServices,
  onNext,
  user,
  savedata,
  setValue,
  setStep,
  properti,
}) {
  const [occupant, setOccupant] = useState(savedata?.occupant || 'user');
  const [includeUser, setIncludeUser] = useState(savedata?.includeUser || false);
  const { enqueueSnackbar } = useSnackbar();
  const { data: AllServiceAddOn = [], isLoading, isFetching } = useFetchAllServices();
  const [searchParams, setSearchParams] = useSearchParams();
  const [duration, setDuration] = useState('');
  console.log(room);
  const DaylyPrice = room.room_prices?.find((item) => item?.duration === 'dayly');
  const oneMonthPrice = room.room_prices?.find((item) => item?.duration === '1_month');
  const ThreeMonthPrice = room.room_prices?.find((item) => item?.duration === '3_month');
  const SixMonthPrice = room.room_prices?.find((item) => item?.duration === '6_month');
  const AyearMonthPrice = room.room_prices?.find((item) => item?.duration === '1_year');

  const DaylyPriceDiscountPrice = DaylyPrice?.room_discounts[0];
  const oneMonthPriceDiscountPrice = oneMonthPrice?.room_discounts[0];
  const ThreeMonthPriceDiscountPrice = ThreeMonthPrice?.room_discounts[0];
  const SixMonthPriceDiscountPrice = SixMonthPrice?.room_discounts[0];
  const AyearMonthPriceDiscountPrice = AyearMonthPrice?.room_discounts[0];

  const discountAmountDayly = (DaylyPrice?.price * DaylyPriceDiscountPrice?.discount_value) / 100;
  const discountAmountOneMonth =
    (oneMonthPrice?.price * oneMonthPriceDiscountPrice?.discount_value) / 100;
  const discountAmountThreeMonth =
    (ThreeMonthPrice?.price * ThreeMonthPriceDiscountPrice?.discount_value) / 100;
  const discountAmountSixMonth =
    (SixMonthPrice?.price * SixMonthPriceDiscountPrice?.discount_value) / 100;
  const discountAmountAyearMonth =
    (AyearMonthPrice?.price * AyearMonthPriceDiscountPrice?.discount_value) / 100;

  const DiscounHarianLength = discountAmountDayly.length > 0 ? discountAmountDayly : 0;

  const [checkIn, setCheckIn] = useState(() => {
    const date = searchParams.get('checkInDate');
    return date ? new Date(date) : null;
  });

  const [checkOut, setCheckOut] = useState(() => {
    const date = searchParams.get('checkOutDate');
    return date ? new Date(date) : null;
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const durationDay = dayjs(checkOut).diff(dayjs(checkIn), 'day');
  const handleOpenDatePicker = (event) => {
    setAnchorEl(event.currentTarget); // elemen yang diklik
    setOpenDatePicker(true);
  };

  const handleDurationSelect = (months) => {
    if (!checkIn) return;
    const newDate = new Date(checkIn);
    newDate.setMonth(newDate.getMonth() + months);
    setCheckOut(newDate);
  };
  // Update URL ketika checkIn atau checkOut berubah
  useEffect(() => {
    if (checkIn && checkOut) {
      searchParams.set('checkInDate', checkIn.toISOString().split('T')[0]);
      searchParams.set('checkOutDate', checkOut.toISOString().split('T')[0]);
      setSearchParams(searchParams);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      setDuration(months); // atau .toString() kalau duration harus string
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      const ids = selectedServices.map((s) => s.id);
      sessionStorage.setItem('selectedServices', JSON.stringify(ids));
    }
  }, [selectedServices]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      const addonIds = selectedServices.map((s) => s.id);
      searchParams.set('addonOrders', JSON.stringify(addonIds));
      setSearchParams(searchParams);
    }
  }, [selectedServices]);

  useEffect(() => {
    const addonQuery = searchParams.get('addonOrders');
    if (addonQuery && AllServiceAddOn.length > 0) {
      try {
        const savedIds = JSON.parse(addonQuery);
        const matchedServices = AllServiceAddOn.filter((service) => savedIds.includes(service.id));

        setSelectedServices(matchedServices);
        setValue('additional_services', savedIds);
      } catch (err) {
        console.error('Failed to parse addonOrders from URL', err);
      }
    }
  }, [AllServiceAddOn]);

  const totalServicePrice = selectedServices.reduce((acc, curr) => {
    if (curr.payment_type === 'monthly') {
      return acc + curr.price * duration;
    } else {
      return acc + curr.price;
    }
  }, 0);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const defaultOccupant = {
    fullname: '',
    phone_number: '',
    email: '',
    nomor_ktp: '',
    nik: '',
    gender: '',
    date_of_birth: '',
  };

  const [occupants, setOccupants] = useState(
    savedata?.booking_user_data?.occupants || [defaultOccupant]
  );

  useEffect(() => {
    if (occupant === 'user') {
      setOccupants([
        {
          fullname: user.name || '',
          phone_number: user.phone_number || '',
          email: user.email || '',
          nomor_ktp: user.nomor_ktp || '',
          nik: user.nik || '',
          gender: user.gender === 'Laki-laki' ? 'male' : 'female',
          date_of_birth: user.date_of_birth || '',
        },
      ]);
    }
  }, [occupant, user]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setOccupants((prev) => prev.map((occ, i) => (i === index ? { ...occ, [name]: value } : occ)));
  };

  const handleCheckboxChange = (e) => {
    setIncludeUser(e.target.checked);
  };

  const addOccupant = () => {
    setOccupants((prev) => [...prev, { ...defaultOccupant }]);
  };

  const removeOccupant = (index) => {
    setOccupants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!isFormValid) {
      enqueueSnackbar('Data belum lengkap, harap isi semua kolom.', { variant: 'error' });
      return;
    }

    let bookingUserData = [...occupants];

    if (includeUser) {
      const userData = {
        fullname: user.name || '',
        phone_number: user.phone_number || '',
        email: user.email || '',
        nomor_ktp: user.nomor_ktp || '',
        nik: user.nik || '',
        gender: user.gender === 'Laki-laki' ? 'male' : 'female',
        date_of_birth: user.date_of_birth || '',
      };

      const isUserAlreadyIncluded = bookingUserData.some(
        (occ) => occ.fullname === user.name && occ.phone_number === user.phone_number
      );

      if (!isUserAlreadyIncluded) {
        bookingUserData = [userData, ...bookingUserData];
      }
    }

    // Hitung total harga berdasarkan durasi
    let basePrice = 0;
    let discount = 0;
    let room_price_id = 0;
    let property_room_discount_id = 0;
    let total_booking_dikali_hari = 0;
    let type_book = 'monthly';
    let jumlah_hari = durationDay;

    switch (duration) {
      case 0:
        basePrice = DaylyPrice?.price;
        property_room_discount_id = DaylyPriceDiscountPrice?.id;
        room_price_id = DaylyPrice?.id;
        discount = discountAmountDayly;
        total_booking_dikali_hari = DaylyPrice?.price * durationDay;
        type_book = 'dayly';
        break;
      case 1:
        basePrice = oneMonthPrice?.price;
        property_room_discount_id = oneMonthPriceDiscountPrice?.id;
        room_price_id = oneMonthPrice?.id;
        discount = discountAmountOneMonth;
        break;
      case 3:
        basePrice = ThreeMonthPrice?.price;
        property_room_discount_id = ThreeMonthPriceDiscountPrice?.id;
        room_price_id = ThreeMonthPrice?.id;
        discount = discountAmountThreeMonth;
        break;
      case 6:
        room_price_id = SixMonthPrice?.id;
        property_room_discount_id = SixMonthPriceDiscountPrice?.id;
        basePrice = SixMonthPrice?.price;
        discount = discountAmountSixMonth;
        break;
      case 12:
        room_price_id = AyearMonthPrice?.id;
        property_room_discount_id = AyearMonthPriceDiscountPrice?.id;
        basePrice = AyearMonthPrice?.price;
        discount = discountAmountAyearMonth;
        break;
      default:
        break;
    }

    const finalTotal = basePrice - discount + totalServicePrice;

    const occupantData = {
      occupant,
      includeUser,
      booking_user_data: bookingUserData,
      selected_services: selectedServices,
      // property_room_discount_id : ,
      property_id: properti?.id,
      book_type: type_book,
      duration,
      base_price: basePrice,
      total_harian: total_booking_dikali_hari,
      discount_amount: discount,
      total_service_price: totalServicePrice,
      total_price: finalTotal,
      jumlah_hari: jumlah_hari,
      room_price_id, // ⬅️ ini ditambahkan
      property_room_discount_id,
      check_in: dayjs(checkIn).format('YYYY-MM-DD'),
      check_out: dayjs(checkOut).format('YYYY-MM-DD'),
    };

    console.log(checkOut);

    onNext(occupantData);
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const monthDiff =
        (outDate.getFullYear() - inDate.getFullYear()) * 12 +
        (outDate.getMonth() - inDate.getMonth());

      setDuration(monthDiff);
    }
  }, [checkIn, checkOut]);

  const isFormValid =
    occupant === 'user' ||
    occupants.every((occ) => Object.values(occ).every((value) => value?.trim() !== ''));

  if (isLoading || isFetching) {
    return <Loading />;
  }
  console.log(AllServiceAddOn);

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          // px: { xs: 5, sm: 0 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: { xs: 'column-reverse', md: 'row' },
          }}
        >
          {/* Kolom 1 */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                Data Penghuni
              </Typography>
              <Stack spacing={2}>
                {/* {data.booking_user_data.map((person, idx) => ( */}
                <Box>
                  <Typography variant="body1">{user?.name}</Typography>
                  <Typography variant="body1">+62{user?.phone_number}</Typography>
                  <Typography variant="body1">{user?.email}</Typography>
                </Box>
                {/* ))} */}
                <Divider />
                <Typography variant="caption">
                  Kartu identitas asli (KTP/KITAS) dan Surat Nikah (untuk pasangan) dibutuhkan saat
                  check-in
                </Typography>
              </Stack>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', my: 2 }}>
                Add On
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', my: 2 }}>
                Tambah Add On
              </Typography>
              <Stack spacing={2}>
                <Autocomplete
                  id="select-service"
                  multiple
                  limitTags={5}
                  loading={isLoading}
                  options={AllServiceAddOn}
                  autoHighlight
                  getOptionLabel={(option) => `${option.name} - ${fCurrency(option.price)}`}
                  value={(AllServiceAddOn ?? []).filter((s) =>
                    (watch('additional_services') ?? []).includes(s.id)
                  )}
                  onChange={(event, value) => {
                    setValue(
                      'additional_services',
                      value.map((v) => v.id),
                      // Set ke selectedServices
                      setSelectedServices(value)
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
                <Divider />
              </Stack>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', my: 2 }}>
                Tanggal Penyewaan
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body2">Check-in: {fDate(checkIn)}</Typography>
                <Typography variant="body2">Check-out: {fDate(checkOut)}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateRange />
                  {duration === 0 ? (
                    <Typography variant="body2">Durasi: {durationDay} Hari</Typography>
                  ) : (
                    <Typography variant="body2">Durasi: {duration} Bulan</Typography>
                  )}
                </Box>
                <Button
                  sx={{ mt: 3, py: '12px' }}
                  variant="outlined"
                  color="inherit"
                  onClick={handleOpenDatePicker}
                >
                  <DateRange /> {''} Ganti Tanggal
                </Button>
                <Divider />
              </Stack>
            </Box>
            <Popover
              open={openDatePicker}
              onClose={() => setOpenDatePicker(false)}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Pilih Tanggal Check-in dan Check-out
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Check-in
                </Typography>
                <CustomDatePicker selectedDate={checkIn} onDateChange={setCheckIn} />

                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                  Check-out
                </Typography>
                <CustomDatePicker selectedDate={checkOut} onDateChange={setCheckOut} />

                {/* Tambahan: Quick buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {['1 Bulan', '3 Bulan', '6 Bulan', '12 Bulan'].map((label, i) => (
                    <button
                      key={label}
                      onClick={() => handleDurationSelect([1, 3, 6, 12][i])}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '20px',
                        background: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </Box>
              </Box>
            </Popover>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 3,
                border: '1px solid #F1EFEC',
                borderRadius: '5px',
                py: 2,
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', my: 2 }}>
                Rincian Pembayaran
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {duration === 0 ? (
                  <Typography variant="body2">Pesan Selama {durationDay} Hari</Typography>
                ) : (
                  <Typography variant="body2">Pesan selama {duration} bulan</Typography>
                )}
                {duration === 0 && (
                  <Typography variant="subtitle1">
                    {fCurrency(DaylyPrice?.price * durationDay)}
                  </Typography>
                )}
                {duration === 1 && (
                  <Typography variant="subtitle1">{fCurrency(oneMonthPrice?.price)}</Typography>
                )}
                {duration === 3 && (
                  <Typography variant="subtitle1">{fCurrency(ThreeMonthPrice?.price)}</Typography>
                )}
                {duration === 6 && (
                  <Typography variant="subtitle1">{fCurrency(SixMonthPrice?.price)}</Typography>
                )}
                {duration === 12 && (
                  <Typography variant="subtitle1">{fCurrency(AyearMonthPrice?.price)}</Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', aligntItems: 'center', justifyContent: 'space-between' }}>
                {duration === 0 && DaylyPriceDiscountPrice && (
                  <>
                    <Typography variant="body2">
                      Diskon {DaylyPriceDiscountPrice?.discount_value}% pesanan harian
                    </Typography>
                  </>
                )}
                {duration === 1 && (
                  <Typography variant="body2">
                    Diskon {oneMonthPriceDiscountPrice?.discount_value}% pesanan {duration} bulan
                  </Typography>
                )}
                {duration === 3 && (
                  <Typography variant="body2">
                    Diskon {ThreeMonthPriceDiscountPrice?.discount_value}% pesanan {duration} bulan
                  </Typography>
                )}
                {duration === 6 && (
                  <Typography variant="body2">
                    Diskon {SixMonthPriceDiscountPrice?.discount_value}% pesanan {duration} bulan
                  </Typography>
                )}
                {duration === 12 && (
                  <Typography variant="body2">
                    Diskon {AyearMonthPriceDiscountPrice?.discount_value}% pesanan {duration} bulan
                  </Typography>
                )}

                {duration === 0 && DaylyPriceDiscountPrice && (
                  <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                    -{fCurrency(discountAmountDayly)}
                  </Typography>
                )}
                {duration === 1 && (
                  <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                    -{fCurrency(discountAmountOneMonth)}
                  </Typography>
                )}
                {duration === 3 && (
                  <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                    -{fCurrency(discountAmountThreeMonth)}
                  </Typography>
                )}
                {duration === 6 && (
                  <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                    -{fCurrency(discountAmountSixMonth)}
                  </Typography>
                )}
                {duration === 12 && (
                  <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                    -{fCurrency(discountAmountAyearMonth)}
                  </Typography>
                )}
              </Box>

              {selectedServices.map((data, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1, // memberi jarak antar item
                  }}
                >
                  <Typography variant="body2">
                    +{data?.name} (
                    {data?.payment_type === 'monthly' ? `x${data?.price} / bulan` : 'Per hari'})
                  </Typography>
                  <Typography variant="subtitle1">
                    {fCurrency(
                      data?.payment_type === 'monthly' ? data.price * duration : data.price
                    )}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total</Typography>
                {duration === 0 && (
                  <Typography variant="subtitle1">
                    {fCurrency(
                      DaylyPrice?.price * durationDay - DiscounHarianLength + totalServicePrice
                    )}
                  </Typography>
                )}
                {duration === 1 && (
                  <Typography variant="subtitle1">
                    {fCurrency(oneMonthPrice?.price - discountAmountOneMonth + totalServicePrice)}
                  </Typography>
                )}
                {duration === 3 && (
                  <Typography variant="subtitle1">
                    {fCurrency(
                      ThreeMonthPrice?.price - discountAmountThreeMonth + totalServicePrice
                    )}
                  </Typography>
                )}
                {duration === 6 && (
                  <Typography variant="subtitle1">
                    {fCurrency(SixMonthPrice?.price - discountAmountSixMonth + totalServicePrice)}
                  </Typography>
                )}
                {duration === 12 && (
                  <Typography variant="subtitle1">
                    {fCurrency(
                      AyearMonthPrice?.price - discountAmountAyearMonth + totalServicePrice
                    )}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Kolom 2 */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #F1EFEC',
                p: { xs: 0, md: 5 },
                //   py : 2,

                borderRadius: '5px',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.125rem', mb: 2 }}>
                Pesanan Anda
              </Typography>
              {/*  */}
              <ImageSlider images={room.room_files || []} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 2,
                }}
              >
                <Typography variant="subtitle1">{room?.name}</Typography>
                <Typography variant="caption">Ganti</Typography>
              </Box>
              <Typography variant="caption" sx={{ mt: 2 }}>
                {room?.capacity} Orang • {room.room_gender_type === 'both' && 'Umum'}{' '}
                {room.room_gender_type === 'male' && 'Laki-Laki'}{' '}
                {room.room_gender_type === 'female' && 'Perempuan'} •{' '}
                {room.area_width * room.area_length}m² • Lantai {room?.floor}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  // justifyContent: 'space-between',
                }}
              >
                <span>Fasilitas Unit</span>
                <ArrowForwardIosIcon fontSize="inherit" />
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography
                variant="body2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                }}
              >
                <Link to={`/property/${properti?.slug}`} target="_blank" style={{ color: 'black' }}>
                  <span>{properti?.name}</span>
                  <ArrowForwardIosIcon fontSize="inherit" />
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box textAlign="center" sx={{ display: 'flex', mt: 3, mb: 4 }}>
        <Button
          onClick={() => setOccupant('user')}
          variant={occupant === 'user' ? 'contained' : 'outlined'}
          sx={{ mx: 1 }}
        >
          Saya sendiri
        </Button>
        <Button
          onClick={() => setOccupant('guest')}
          variant={occupant === 'guest' ? 'contained' : 'outlined'}
          sx={{ mx: 1 }}
        >
          Pesan Bersama
        </Button>
      </Box>

      {occupant === 'guest' && (
        <>
          {occupants.map((data, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Typography variant="h6" mb={2}>
                {occupants.length > 1 ? `Data Penghuni ${index + 1}` : 'Data Penghuni'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nama Lengkap"
                    fullWidth
                    name="fullname"
                    value={data.fullname}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nomor Telepon"
                    fullWidth
                    name="phone_number"
                    value={data.phone_number}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    value={data.email}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nomor KTP"
                    fullWidth
                    name="nomor_ktp"
                    value={data.nomor_ktp}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="NIK"
                    fullWidth
                    name="nik"
                    value={data.nik}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Jenis Kelamin"
                    fullWidth
                    name="gender"
                    value={data.gender}
                    onChange={(e) => handleChange(index, e)}
                  >
                    <MenuItem value="male">Laki-laki</MenuItem>
                    <MenuItem value="female">Perempuan</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tanggal Lahir"
                    type="date"
                    fullWidth
                    name="date_of_birth"
                    InputLabelProps={{ shrink: true }}
                    value={data.date_of_birth}
                    onChange={(e) => handleChange(index, e)}
                  />
                </Grid>
                {occupants.length > 1 && (
                  <Grid item xs={12} textAlign="right">
                    <IconButton onClick={() => removeOccupant(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          ))}
          <Button onClick={addOccupant} variant="outlined" fullWidth sx={{ my: 2 }}>
            + Tambah Penghuni
          </Button>

          <FormControlLabel
            control={<Checkbox checked={includeUser} onChange={handleCheckboxChange} />}
            label="Saya Ikut Booking"
            sx={{ display: 'block', mt: 1 }}
          />
        </>
      )}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        // mt={4}
        gap={{ xs: 0, md: 3 }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          sx={{ mt: 3, py: '12px' }}
          // onClick={handleBack}
          // disabled={step === 1}
        >
          Kembali
        </Button>
        <Button
          onClick={handleNext}
          sx={{ mt: 3, py: '12px' }}
          fullWidth
          variant="contained"
          color="inherit"
          disabled={!isFormValid}
        >
          Lanjut Ke Pembayaran
        </Button>
      </Box>
    </Box>
  );
}

function ImageSlider({ images }) {
  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: 1 },
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box ref={sliderRef} className="keen-slider">
        {images.length > 0 ? (
          images.map((image, index) => (
            <Box
              key={index}
              className="keen-slider__slide"
              sx={{
                position: 'relative',
                // aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: '5px',
              }}
            >
              <img
                src={image?.file_url}
                loading="lazy"
                alt={`Property Image ${index}`}
                style={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  //   borderRadius: '5px',
                }}
              />
            </Box>
          ))
        ) : (
          <Box
            className="keen-slider__slide"
            sx={{ textAlign: 'center', p: 2, backgroundColor: 'gray' }}
          >
            <Typography variant="caption" color="white">
              Tidak ada image yang tersedia
            </Typography>
          </Box>
        )}
      </Box>

      {/* Prev & Next Button */}
      <Button
        disabled={currentSlide === 0}
        onClick={() => slider.current?.prev()}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          minWidth: 0,
          padding: 1,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ArrowBackIosIcon fontSize="small" sx={{ ml: '5px' }} />
      </Button>

      {/* Next Arrow */}
      <Button
        disabled={currentSlide === images.length - 1}
        onClick={() => slider.current?.next()}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          minWidth: 0,
          padding: 1,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </Button>
    </Box>
  );
}
