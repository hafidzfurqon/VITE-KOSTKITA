import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PropertyRoomTypeView } from 'src/sections/property-room-type/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Property Ruangan Tipe - ${CONFIG.appName}`}</title>
      </Helmet>

      <PropertyRoomTypeView />
    </>
  );
}
