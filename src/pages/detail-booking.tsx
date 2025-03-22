import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DataBookingProperty } from 'src/table-component/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Data Booking - ${CONFIG.appName}`}</title>
      </Helmet>

      <DataBookingProperty />
    </>
  );
}
