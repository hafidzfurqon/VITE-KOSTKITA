import { LoadingButton } from '@mui/lab';
import { Step } from '@mui/material';
import { Stepper } from '@mui/material';
import { StepLabel } from '@mui/material';
import { MenuItem, Button, TextField, Typography, Grid, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutationTransaction } from 'src/hooks/transaction';
import { TransactionStepTwo } from './transaction-step2';
import { useAppContext } from 'src/context/user-context';
import { useFetchAllApartement } from 'src/hooks/apartement';
import { useFetchAllPropertyOwner } from 'src/hooks/owner_property/property';
import Loading from 'src/components/loading/loading';
import { TransactionStepThree } from './transaction-step3';
import { useFieldArray } from 'react-hook-form';
import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';

export default function TransactionView() {
  const [userDataState, setUserDataState] = useState([
    {
      fullname: '',
      phone_number: '',
      email: '',
      date_of_birth: '',
      gender: '',
      nomor_ktp: '',
      nik: '',
    },
  ]);

  const { register, handleSubmit, control, watch, setValue, getValues } = useForm({
    defaultValues: {
      booking_user_data: userDataState || [{}],
    },
  });
  // const { errors, isValid } = useFormState({ control });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'booking_user_data',
  });

  const [step, setStep] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();
  // console.log(watch('price_id'));

  const { mutate, isPending } = useMutationTransaction({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.apartement'] });
      routers.push('/transaction');
      enqueueSnackbar('Transaksi berhasil dibuat', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Transaksi gagal dibuat', { variant: 'error' });
    },
  });

  const OnSubmitData = (data) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log(data);
      const payload = {
        // user_id: user.id,
        property_id: data.property_id,
        room_id: data.room_number,
        room_price_id: data.price_id || null,
        property_room_discount_id: data.property_room_discount_id || null,
        promo_id: data.promo_id || null,
        booking_date: new Date().toISOString().split('T')[0],
        total_booking_month: data.duration,
        check_in: fDate(data.checkin, 'YYYY-MM-DD'),
        check_out: fDate(data.checkout, 'YYYY-MM-DD'),
        status: 'pending', // Atau null sesuai kebutuhanmu
        additional_services: data.additional_services || [],
        booking_user_data: data.booking_user_data.map((person) => ({
          fullname: person.fullname,
          phone_number: person.phone_number,
          email: person.email,
          date_of_birth: fDate(person.date_of_birth, 'YYYY-MM-DD'),
          gender: person.gender,
          nomor_ktp: person.nomor_ktp,
          nik: person.nik,
        })),
      };
      // console.log(payload);
      mutate(payload);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const dataForm = [
    { label: 'Nama Lengkap', name: 'fullname', inputmode: 'text', type: 'text' },
    { label: 'Nomor Telepon', name: 'phone_number', inputmode: 'numeric', type: 'text' },
    // { label: 'Email', name: 'email', inputmode: 'email', type: 'email' },
    { label: 'Nomor Ktp', name: 'nomor_ktp', inputmode: 'text', type: 'text' },
    { label: 'NIK (Nomor Induk Kependudukan)', name: 'nik', inputmode: 'numeric', type: 'text' },
  ];

  const genders = [
    { label: 'Laki-laki', value: 'male' },
    { label: 'Perempuan', value: 'female' },
  ];

  // Validasi tiap langkah
  const formValues = watch();
  const isStepValid = () => {
    if (step === 1) {
      const penyewa = formValues.booking_user_data?.[0];
      return (
        penyewa?.fullname &&
        penyewa?.phone_number &&
        penyewa?.nomor_ktp &&
        penyewa?.nik &&
        penyewa?.gender &&
        penyewa?.date_of_birth
      );
    } else if (step === 2) {
      return formValues.checkin && formValues.checkout && formValues.room_number;
    }
    return true;
  };

  useEffect(() => {
    if (step === 1 && userDataState) {
      userDataState.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          setValue(`booking_user_data.${index}.${key}`, user[key]);
        });
      });
    }
  }, [step, userDataState, setValue]);

  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  // Pastikan user.roles ada dan memeriksa apakah user memiliki role "owner_property"
  const isOwnerProperty = user?.roles?.some((role) => role.name === 'owner_property');
  const {
    data = [],
    isLoading,
    isFetching,
  } = isOwnerProperty ? useFetchAllPropertyOwner() : useFetchAllApartement();

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <Box sx={{ mb: 5, px: '2rem' }}>
      <Typography variant="h3" textAlign="center">
        Tambah Data Transaksi
      </Typography>
      <Box component="form" sx={{ pt: 2, borderRadius: 2 }} onSubmit={handleSubmit(OnSubmitData)}>
        <Stepper activeStep={step - 1} alternativeLabel sx={{ my: 5 }}>
          {['Biodata Penghuni', 'Check-in & Check-out', 'Konfirmasi & Selesai'].map(
            (label, index) => (
              <Step key={index}>
                <StepLabel
                  onClick={() => index + 1 <= step && setStep(index + 1)}
                  sx={{ cursor: index + 1 <= step ? 'pointer' : 'default' }}
                >
                  {label}
                </StepLabel>
              </Step>
            )
          )}
        </Stepper>

        {step === 1 && (
          <>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
                  Penyewa {index + 1}
                </Typography>
                <Grid container spacing={2} sx={{ pt: 2 }}>
                  {dataForm.map((data) => (
                    <Grid item xs={12} sm={6} key={data.name}>
                      <TextField
                        label={data.label}
                        fullWidth
                        type={data.type}
                        inputMode={data.inputmode}
                        {...register(`booking_user_data.${index}.${data.name}`, { required: true })}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      {...register(`booking_user_data.${index}.email`, { required: true })}
                      label="Alamat Email"
                      type="email"
                      // name="email"
                      // inputmode='emai'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tanggal Lahir"
                      fullWidth
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...register(`booking_user_data.${index}.date_of_birth`, { required: true })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Jenis Kelamin"
                      fullWidth
                      select
                      {...register(`booking_user_data.${index}.gender`, { required: true })}
                    >
                      {genders.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                {index > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => remove(index)}
                    sx={{ mt: 2 }}
                  >
                    Hapus Penyewa
                  </Button>
                )}
              </Box>
            ))}

            <Button variant="contained" onClick={() => append({})} sx={{ mb: 2 }}>
              + Tambah Penyewa
            </Button>
          </>
        )}

        {step === 2 && (
          <TransactionStepTwo
            register={register}
            watch={watch}
            setValue={setValue}
            control={control}
            data={data}
            isOwnerProperty={isOwnerProperty}
          />
        )}

        {step === 3 && (
          <TransactionStepThree data={formValues} setValue={setValue} getValues={getValues} />
        )}

        <Box display="flex" justifyContent="space-between" mt={4} gap={3}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            sx={{ mt: 3, py: '12px' }}
            onClick={handleBack}
            disabled={step === 1}
          >
            Kembali
          </Button>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="inherit"
            loading={isPending}
            disabled={!isStepValid()}
            sx={{ mt: 3, py: '12px' }}
          >
            {step === 3 ? 'Kirim' : 'Selanjutnya'}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
