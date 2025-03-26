import { useState, useCallback } from 'react';
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
import { PropertyTableRow } from '../property-table-row';
import { PropertyTableHead } from '../property-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { PropertyTableToolbar } from '../property-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import Loading from 'src/components/loading/loading';
import { useFetchAllPropertyType, useMutationCreateTypeProperty } from 'src/hooks/property_type';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { DialogCreate } from 'src/component/DialogCreate';

export function PropertyView() {
  const table = useTable();
  const { data = [], isLoading, isFetching, isPending } = useFetchAllPropertyType();
  const [filterName, setFilterName] = useState('');
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit: handleSubmitForm, reset } = useForm();
  // console.log(first)

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator('desc', 'created_at'),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const handleClickOpened = useCallback(() => setOpened(true), []);
  const handleClose = useCallback(() => setOpened(false), []);
  const { mutate, isPending: isPendingMutate } = useMutationCreateTypeProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch.property_type'] });
      setOpened(false);
      enqueueSnackbar('Property Type berhasil dibuat', { variant: 'success' });
      reset();
    },
    onError: () => {
      enqueueSnackbar('Property Type gagal dibuat', { variant: 'error' });
    },
  });

  const handleCreate = useCallback(
    (data: any) => {
      mutate(data);
      handleClose();
    },
    [mutate, handleClose]
  );

  if (isLoading || isFetching || isPending) {
    return <Loading />;
  }
  const FieldRHF = (
    <TextField
      {...register('name')}
      autoFocus
      required
      margin="dense"
      id="nama"
      label="Nama Tipe Property"
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
            Management Tipe Property
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleClickOpened}
          >
            Tambah Tipe Property
          </Button>
        </Box>

        <Card>
          <PropertyTableToolbar
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
                <PropertyTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={data.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      data.map((item: any) => item.id)
                    )
                  }
                  headLabel={[
                    // { id: 'image', label: 'Image' },
                    { id: 'name', label: 'Tipe Properti' },
                    // { id: 'type', label: 'Tipe' },
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
                        <PropertyTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                        />
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                        Belum ada data Tipe Properti
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
        pending={isPendingMutate}
        SubmitFormValue={handleCreate}
        open={opened}
        title="Create Nama Tipe Property"
        subTitle="Property untuk coliving maupun apartemen"
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
