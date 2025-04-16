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

export default function TransactionView() {
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      booking_user_data: [{}], // hanya 1 penyewa
    },
  });
  // const { errors, isValid } = useFormState({ control });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'booking_user_data',
  });

  const [step, setStep] = useState(2);
  const { enqueueSnackbar } = useSnackbar();
  const routers = useRouter();

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
      mutate(data);
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
                      defaultValue=""
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

        {step === 3 && <TransactionStepThree data={formValues} />}

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
