

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
// ----------------------------------------------------------------------

export type BookedProps = {
  id?: undefined | any | number;
  name : string;
  properties: [],
  apartments: [{
    name : string
  }]
};

type BookedTableRowProps = {
  row: BookedProps;
  selected: boolean;
  onSelectRow: () => void;
  NamaProperty : string
  booked : any
};

export function BookedPropertyTableRow({ booked, NamaProperty,row, selected, onSelectRow }: BookedTableRowProps) {
  
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell align='center'>{NamaProperty}</TableCell>
        {booked.length > 0 && (
          booked.map((b: any, index: number) => (
            <TableCell key={index} align='center'>{b?.user.name || 'No User'}</TableCell>
        ))
      )}
        <TableCell align="center">
          {  booked.map((b: any, index: number) => (
        <Button
        key={index}
          component={Link}
          to={`/booked-property/booking/detail/admin/${b?.booking_code}`}
          variant="contained"
          size="small"
          sx={{ textTransform: 'none' }}
        >
          Lihat Detail
        </Button>
          ))}
        </TableCell>
      </TableRow>
    
    </>
  );
}
