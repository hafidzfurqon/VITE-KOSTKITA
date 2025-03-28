import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
// ----------------------------------------------------------------------

export type BookedProps = {
  id?: undefined | any | number;
  name: string;
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
  // NamaProperty: string;
};

export function PropertyVisitTableRow({ row, selected, onSelectRow }: VisitTableRowProps) {
  // console.log(booked[0].user.name)
  return (
    <>
      {/* {booked.length > 0 && ( */}
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell align="center">{row?.property?.name}</TableCell>
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
      {/* )} */}
    </>
  );
}
