import { useState,} from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import DialogDelete from 'src/component/DialogDelete';

import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { Button } from '@mui/material';
import { useMutationDeleteApartement } from 'src/hooks/apartement';
import { Link, useParams } from 'react-router-dom';
import { router } from 'src/hooks/routing/useRouting';
import { useMutationDeletePropertyRoom } from 'src/hooks/property_room';

// ----------------------------------------------------------------------

export type ApartmentProps = {
  id?: undefined | any | number;
  link_googlemaps: string;
  total_floors: string;
  type: string;
  slug: string;
  payment_type: string;
  name : string;
  "state": {
    "state_code": number,
    "name": string
},
  start_price : string;
  address : string;
  "room_files": [
  {
  file_url : string
  }
  ],
  url_reference: string;
};

type ApartmentTableRowProps = {
  slug : string
  row: ApartmentProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function PropertyRoomTableRow({ slug, row, selected, onSelectRow }: ApartmentTableRowProps) {
  const {id} = useParams()
  // console.log()
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
   const handleClickOpen = () => {
    setOpen(true)
   }
   console.log(row)
   const IsNull = row === null
   console.log(IsNull)
  //  console.log(row.files[0]?.file_url)
  const { mutate: DeleteApartement, isPending } = useMutationDeletePropertyRoom({
     onSuccess : () => {
        queryClient.invalidateQueries({ queryKey: ['fetch.property-room', id] });
        setOpen(false)
        enqueueSnackbar('Property Room berhasil dihapus', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Property Room gagal dihapus', { variant: 'error' });
      },
  }, id);

  
  const handleSubmit = () => {
    DeleteApartement(row.id)
  }
  const renderCover = (
    <Box
      component="img"
      alt={row.name}
      src={row.room_files[0]?.file_url}
      sx={{
        top: 0,
        width: 100,
        height: 1,
        objectFit: 'cover',
        borderRadius : '10px'
        // position: 'absolute',
      }}
    />
  );

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell align='center' component="th" scope="row">
          {/* <Box gap={2} display="flex" alignItems="center"> */}
            
          {renderCover}
          {/* </Box> */}
        </TableCell>

        <TableCell align='center'>{row.name}</TableCell>


<TableCell align="center">
<Button onClick={() => alert('sdjshad')}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </Button>

          <Button onClick={handleClickOpen} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </Button>
    <Link to={`${router.property.list}/${slug}#SectionRoom`} target='_blank'>
          <Button sx={{ color: 'secondary.main' }}>
            <Iconify icon="solar:eye-bold" />
            Lihat
          </Button>
    </Link>
        </TableCell>
      </TableRow>
      

      <DialogDelete 
      title="yakin untuk menghapus Property Room ini ?"
       description="data yang telah di hapus tidak akan kembali"
       setOpen={setOpen}
       open={open}
       Submit={handleSubmit}
       pending={isPending}
      />

     
    </>
  );
}
