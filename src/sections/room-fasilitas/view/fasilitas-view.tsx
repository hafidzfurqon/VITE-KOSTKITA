import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { FasilitasTableRow } from '../fasilitas-table-row';
import { FasilitasTableHead } from '../fasilitas-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { FasilitasTableToolbar } from '../fasilitas-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import Loading from 'src/components/loading/loading';

import { useMutationCreateFacilities } from 'src/hooks/facilities';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { DialogCreate } from 'src/component/DialogCreate';
import { useAppContext } from 'src/context/user-context';
import {
  useFetchFacilityPropertyOwner,
  useMutationCreateFacilitiesOwner,
} from 'src/hooks/owner_property/fasilitas';
import {
  useFetchAllRoomFacilities,
  useMutationCreateFacilitiesRoom,
} from 'src/hooks/room-facilities';

export function RoomFasilitasView() {
  const table = useTable();
  const { UserContextValue: authUser }: any = useAppContext();
  const { user } = authUser;
  // Pastikan user.roles ada dan memeriksa apakah user memiliki role "owner_property"
  const isOwnerProperty = user?.roles?.some((role: any) => role.name === 'owner_property');
  const {
    data = [],
    isLoading,
    isFetching,
  } = isOwnerProperty ? useFetchFacilityPropertyOwner() : useFetchAllRoomFacilities();
  const [filterName, setFilterName] = useState('');
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit: handleSubmitForm, reset } = useForm();

  // Menghindari re-render berulang saat data berubah
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: data,
        comparator: getComparator('desc', 'created_at'),
        filterName,
      }),
    [data, table.order, table.orderBy, filterName]
  );

  const notFound = !dataFiltered.length && !!filterName;

  // Menggunakan useCallback untuk menghindari re-render
  const handleClickOpened = useCallback(() => setOpened(true), []);
  const handleClose = useCallback(() => setOpened(false), []);

  const { mutate, isPending: isPendingMutate } = isOwnerProperty
    ? useMutationCreateFacilitiesOwner({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['fetch.all.property.owner'] });
          setOpened(false);
          enqueueSnackbar('Fasilitas berhasil dibuat', { variant: 'success' });
          reset();
        },
        onError: () => {
          enqueueSnackbar('Fasilitas gagal dibuat', { variant: 'error' });
        },
      })
    : useMutationCreateFacilitiesRoom({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['fetch.facilities.room'] });
          setOpened(false);
          enqueueSnackbar('Fasilitas berhasil dibuat', { variant: 'success' });
          reset();
        },
        onError: () => {
          enqueueSnackbar('Fasilitas gagal dibuat', { variant: 'error' });
        },
      });

  // Fungsi submit juga menggunakan useCallback agar tidak dibuat ulang setiap render
  const handleCreate = useCallback(
    (data: any) => {
      mutate(data);
      handleClose();
    },
    [mutate, handleClose]
  );

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const FieldRHF = (
    <TextField
      {...register('name')}
      autoFocus
      required
      margin="dense"
      id="nama"
      label="Nama Fasilitas"
      type="text"
      fullWidth
      variant="outlined"
    />
  );
  return (
    <>
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Management Fasilitas Kamar
          </Typography>
          {/* <Link to={router.fasilitas.create}> */}
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleClickOpened}
          >
            Tambah Fasilitas
          </Button>
          {/* </Link> */}
        </Box>

        <Card>
          <FasilitasTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(event) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <FasilitasTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={data.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked: any) =>
                    table.onSelectAllRows(
                      checked,
                      data.map((item: any) => item.id)
                    )
                  }
                  headLabel={[
                    { id: 'nama', label: 'Nama' },
                    { id: 'action', label: 'Action' },
                  ]}
                />
                <TableBody>
                  {dataFiltered.length > 0 ? (
                    dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row: any) => (
                        <FasilitasTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                        />
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                        Belum ada data Fasilitas
                      </td>
                    </tr>
                  )}
                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
                  />
                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={data.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
      <DialogCreate
      info={`Anda akan menambah fasilitas ruangan`}
        pending={isPendingMutate}
        SubmitFormValue={handleCreate}
        open={opened}
        title="Create Nama Fasilitas"
        subTitle="Fasilitas untuk Ruangan-ruangan di kostkita"
        setOpen={setOpened}
        field={FieldRHF}
        SubmitForm={handleSubmitForm}
      />
    </>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
