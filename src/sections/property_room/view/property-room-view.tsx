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
import { PropertyRoomTableRow } from '../property-room-table-row';
import { PropertyRoomTableHead } from '../property-room-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { PropertyRoomTableToolbar } from '../property-room-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import Loading from 'src/components/loading/loading';
import { Link, useParams } from 'react-router-dom';
import { router } from 'src/hooks/routing/useRouting';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchAllPropertyRoom } from 'src/hooks/property_room';
import { TableCell, TableRow } from '@mui/material';

export function PropertyRoomView() {
  const table = useTable();
  const {id} = useParams()
  const { data : room = [], isLoading, isFetching } = useFetchAllPropertyRoom(id);
  const data = room.rooms
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
      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h4" flexGrow={1}>
         Tambah Property Room di {room.name}
        </Typography>
        <Link to={router.property_room.create}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
            Tambah Property Room
          </Button>
        </Link>
      </Box>
      <CustomBreadcrumbs 
                  links={[{ name: 'Property', href: '/property' }, { name: 'Property Room'}, ]} 
                  sx={{ mb: { xs: 2, md: 3 } }} 
                  action={null} 
                  heading="" 
                  moreLink={[]} 
                  activeLast={true} 
                  />
      <Card>
        <PropertyRoomTableToolbar
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
              <PropertyRoomTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, data.map((item : any) => item.id))
                }
                headLabel={[
                  { id: 'image_property_room', label: 'Gambar Property Room' },
                  { id: 'title_property_room', label: 'Judul Property Room' },
                  // { id: 'url_reference', label: 'URL Reference' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              {
              data.length === 0 ? 
              <TableBody>
               <TableRow>
               <TableCell align="center" colSpan={7}>
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography  variant="subtitle1" sx={{ mb: 1 }}>
                Belum Ada Ruangan untuk property ini
                </Typography>
                </Box>
                </TableCell>
               </TableRow>
              </TableBody> :
              <TableBody>
                {dataFiltered.slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                ).map((row : any) => (
                  <PropertyRoomTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                  />
                ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)} />
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
              }
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