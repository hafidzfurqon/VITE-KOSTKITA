import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { Iconify } from 'src/components/iconify';
import { Button, MenuItem } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useMutationDeleteUser } from 'src/hooks/users/mutation';
import DialogDelete from 'src/component/DialogDelete';
import { fCurrency } from 'src/utils/format-number';
import {
  useMutationDeleteService,
  useMutationUpdateService,
  useFetchDetailService,
} from 'src/hooks/services';
import { DialogUpdate } from 'src/component/DialogUpdate';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { DialogDetail } from 'src/component/DialogDetail';

// ----------------------------------------------------------------------

export type LayananProps = {
  id: any;
  name: string;
  description: string;
  payment_type: string;
  price: string;
  status: string;
};

type LayananTableRowProps = {
  row: LayananProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function LayananTableRow({ row, selected, onSelectRow }: LayananTableRowProps) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState<LayananProps | null>(null);
  // const {
  //   data,
  //   // refetch,
  //   isLoading: loadData,
  //   isFetching: fetchingData,
  // } = useFetchDetailService(selectedId);
  const handleClickOpened = () => {
    setOpened(true);
  };

  const handleClickDetail = () => {
    setDetailData(row); // Set data layanan yang dipilih
    setOpenDetail(true);
    console.log('Dialog Detail dibuka:', row);
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LayananProps>({
    defaultValues: {
      name: '',
      status: '',
      description: '',
      payment_type: '',
      price: '',
    },
  });
  useEffect(() => {
    if (row) {
      reset({
        name: row.name || '',
        price: String(row.price || ''),
        description: row.description || 'Tidak ada deskripsi',
      });
    }
  }, [row, reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const FieldRHF = (
    <>
      <TextField
        {...register('name', { required: 'Nama Wajib Diisi' })}
        margin="dense"
        id="name"
        label="Nama Layanan"
        type="text"
        fullWidth
        variant="outlined"
        error={!!errors.name}
        // helperText={`Nama Wajib diisi `}
      />
      <Controller
        name="price"
        control={control}
        defaultValue=""
        rules={{ required: 'Harga wajib diisi' }}
        render={({ field, fieldState }) => (
          <NumericFormat
            {...field}
            customInput={TextField}
            label="Harga"
            fullWidth
            required
            prefix="Rp "
            thousandSeparator="."
            decimalSeparator=","
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <TextField
        select
        {...register('status', { required: true })}
        label="Status"
        fullWidth
        required
        defaultValue={row.status || 'available'}
      >
        <MenuItem value="available">Tersedia</MenuItem>
        <MenuItem value="unavailable">Tidak tersedia</MenuItem>
      </TextField>
      <TextField
        select
        {...register('payment_type', { required: true })}
        label="Tipe Bayar"
        fullWidth
        required
        defaultValue={row.payment_type || 'monthly'}
      >
        <MenuItem value="monthly">Per Bulan</MenuItem>
        <MenuItem value="pay_once">Sekali Bayar</MenuItem>
      </TextField>
      <TextField
        {...register('description')}
        margin="dense"
        label="Deskripsi (Optional)"
        multiline
        rows={4}
        fullWidth
        variant="outlined"
      />
    </>
  );
  const { mutate: UpdateLayanan, isPending: isLoading } = useMutationUpdateService(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.service'] });
        setOpened(false);
        enqueueSnackbar('Layanan berhasil diupdate', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('gagal mengupdate Layanan', { variant: 'error' });
      },
    },
    row.id
  );
  const cleanPrice = (price: { replace: any }) => {
    return parseInt(price.replace(/[^\d]/g, ''), 10);
  };
  const handleCreate = (data: any) => {
    const formData: any = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'price') {
        // Hindari duplikasi harga
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      }
    });

    formData.append('price', cleanPrice(data.price));
    formData.append('_method', 'PUT');
    UpdateLayanan(formData);
    reset(data);
    // handleClose();
  };

  const { mutate: DeleteLayanan, isPending } = useMutationDeleteService({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.service'] });
      setOpen(false);
      enqueueSnackbar('Layanan berhasil dihapus', { variant: 'success' });
    },
    onError: (err: any) => {
      enqueueSnackbar('Layanan gagal dihapus', { variant: 'error' });
    },
  });

  const handleSubmits = () => {
    DeleteLayanan(row.id);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row" align="center">
          {row.name}
        </TableCell>

        <TableCell align="center">
          {row.payment_type === 'pay_once' ? 'sekali bayar' : 'per bulan'}
        </TableCell>

        <TableCell align="center">{fCurrency(row.price)}</TableCell>

        <TableCell align="center">
          {row.status === 'available' ? (
            <>
              <Box sx={{ display: 'flex', gap: 1, alignItems : 'center', justifyContent : 'center' }}>
                <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                <span>Available</span>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Iconify width={22} icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
                <span>Unavailable</span>
              </Box>
            </>
          )}
        </TableCell>

        <TableCell align="center">
          <Button sx={{ color: 'secondary.main' }} onClick={handleClickDetail}>
            <Iconify icon="solar:eye-bold" />
            Detail
          </Button>
          <Button onClick={handleClickOpened}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </Button>

          <Button sx={{ color: 'error.main' }} onClick={handleClickOpen}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <DialogDelete
        title="yakin untuk menghapus Layanan ?"
        description="data yang telah di hapus tidak akan kembali"
        setOpen={setOpen}
        open={open}
        Submit={handleSubmits}
        pending={isPending}
      />
      <DialogUpdate
        pending={isLoading}
        SubmitFormValue={handleCreate}
        open={opened}
        title="Update Layanan"
        subTitle="Update Layanan yang berada di Halaman Home Page"
        setOpen={setOpened}
        field={FieldRHF}
        SubmitForm={handleSubmit}
      />
      <DialogDetail
        title="Detail Layanan"
        subTitle={
          detailData && `Informasi detail layanan Dengan Nama Layanan ${detailData.name || ''}`
        }
        setOpen={setOpenDetail}
        open={openDetail}
        data={
          detailData && (
            <>
              <div>
                <strong>Nama:</strong> {detailData.name}
              </div>
              <div>
                <strong>Harga:</strong> {fCurrency(detailData.price)}
              </div>
              <div>
                <strong>Deskripsi:</strong> {detailData.description || '-'}
              </div>
              <div>
                <strong>Tipe Pembayaran:</strong>{' '}
                {detailData.payment_type === 'pay_once' ? 'Sekali Bayar' : 'Per Bulan'}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                {detailData.status === 'available' ? 'Tersedia' : 'Tidak Tersedia'}
              </div>
            </>
          )
        }
      />
    </>
  );
}
