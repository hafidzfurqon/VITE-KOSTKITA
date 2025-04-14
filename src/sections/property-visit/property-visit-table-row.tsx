import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
// import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
// import { fDate } from 'src/utils/format-time';
// ----------------------------------------------------------------------

export type BookedProps = {
  id?: undefined | any | number;
  name: string;
  status: string;
  visit_date: string;
  property: { name: string };
  apartments: [
    {
      name: string;
    },
  ];
};

type VisitTableRowProps = {
  row: BookedProps;
  selected: boolean;
  onSelectRow: () => void;
  visited: [
    {
      name: string;
    },
  ];
  // NamaProperty: string;
};

export function PropertyVisitTableRow({ row, selected, visited, onSelectRow }: VisitTableRowProps) {
  // console.log(booked[0].user.name)
  if (visited.length > 0) {
    console.log(visited);
  }
  console.log(row);
  return (
    <>
      {visited.length > 0 && (
        <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
          </TableCell>
          <TableCell align="center">{row?.name}</TableCell>
          {/* <TableCell align="center">{fDate(date)}</TableCell> */}
          {/* <TableCell align="center">{booked[0]?.user?.name || 'No User'}</TableCell> */}
          <TableCell align="center">
            {/* {booked.map((b: any, index: number) => ( */}
            <Button
              // key={index}
              component={Link}
              to={`/visit/data-visit/${row.id}`}
              variant="contained"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Lihat Detail
            </Button>
            {/* ))} */}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
