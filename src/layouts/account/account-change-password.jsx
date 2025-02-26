import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { useContext } from 'react';
import { SettingsContext } from 'src/components/settings/context/settings-context';
import { useUpdatePassword } from 'src/hooks/users/profile/useUpdatePassword';
import { useAppContext } from 'src/context/user-context';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { UserContextValue: authUser } = useAppContext();
  const { user } = authUser;
  const userId = user?.id;
console.log(userId)
  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password baru harus di isi')
      .min(8, 'Password minimal 8 karakter'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Password tidak sama')
      .required('Konfirmasi password harus di isi'),
  });

  const defaultValues = {
    password: '',
    password_confirmation: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: updatePassword } = useUpdatePassword({
    onSuccess: () => {
      enqueueSnackbar('Password berhasil diperbarui!', { variant: 'success' });
      reset();
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Gagal memperbarui password', { variant: 'error' });
    },
  });

  const onSubmit = async (data) => {
    console.log('Form Data:', data); // Debugging log
    try {
      const formData = new FormData();

      formData.append('password', data.password);
      formData.append('password_confirmation', data.password_confirmation);
      formData.append('_method', 'PUT');

      const response = await updatePassword({ userId, data: formData });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Terjadi kesalahan', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="password"
          label="Password baru"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password minimal 8
              karakter
            </Stack>
          }
        />

        <RHFTextField
          name="password_confirmation"
          type={password.value ? 'text' : 'password'}
          label="Konfirmasi password baru"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Simpan Perubahan
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
