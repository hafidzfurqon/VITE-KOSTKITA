import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DataDetailPropertyVisitView } from 'src/sections/property-visit/table-component/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Data Booking - ${CONFIG.appName}`}</title>
      </Helmet>

      <DataDetailPropertyVisitView />
    </>
  );
}
