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
import { ApartementTableRow } from '../apartement-table-row';
import { ApartementTableHead } from '../apartement-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { ApartementTableToolbar } from '../apartement-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import Loading from 'src/components/loading/loading';
import { Link } from 'react-router-dom';
import { router } from 'src/hooks/routing/useRouting';
import { useGetBanner } from 'src/hooks/banner';
import { useFetchAllApartement } from 'src/hooks/apartement';

export function ApartementView() {
  const table = useTable();
  const { data = [], isLoading, isFetching } = useFetchAllApartement();
  const [filterName, setFilterName] = useState('');

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Management Banner
        </Typography>
        <Link to={router.banner.create}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
            Tambah Banner
          </Button>
        </Link>
      </Box>

      <Card>
        <ApartementTableToolbar
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
              <ApartementTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, data.map((item : any) => item.id))
                }
                headLabel={[
                  { id: 'image_banner', label: 'Gambar Apartement' },
                  { id: 'title_banner', label: 'Judul Apartement' },
                  // { id: 'url_reference', label: 'URL Reference' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              <TableBody>
                {dataFiltered.slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                ).map((row : any) => (
                  <></>
                  // <ApartementTableRow
                  //   key={row.id}
                  //   row={row}
                  //   selected={table.selected.includes(row.id)}
                  //   onSelectRow={() => table.onSelectRow(row.id)}
                  // />
                ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)} />
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