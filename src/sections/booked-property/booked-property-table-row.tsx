import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
// ----------------------------------------------------------------------

export type BookedProps = {
  id?: undefined | any | number;
  name: string;
  files: any;
  properties: [];
  apartments: [
    {
      name: string;
    },
  ];
};

type BookedTableRowProps = {
  row: BookedProps;

  selected: boolean;
  onSelectRow: () => void;
  // NamaProperty: string;
  booked: any;
};

export function BookedPropertyTableRow({
  booked,
  row,
  selected,
  onSelectRow,
}: BookedTableRowProps) {
  const renderCover = (
    <Box
      component="img"
      alt={row.name}
      src={row.files[0]?.file_url}
      sx={{
        top: 0,
        width: 100,
        height: 1,
        objectFit: 'cover',
        borderRadius: '10px',
        // position: 'absolute',
      }}
    />
  );

  return (
    <>
      {booked.length > 0 && (
        <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
          </TableCell>

          <TableCell align="center" component="th" scope="row">
            {/* <Box gap={2} display="flex" alignItems="center"> */}

            {renderCover}
            {/* </Box> */}
          </TableCell>

          <TableCell align="center">{row.name}</TableCell>
          {/* <TableCell align="center"></TableCell> */}
          {/* <TableCell align="center">{booked[0]?.user?.name || 'No User'}</TableCell> */}
          <TableCell align="center">
            {/* {booked.map((b: any, index: number) => ( */}
            <Button
              // key={index}
              component={Link}
              to={`/booked-property/data-booking/${row.id}`}
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
