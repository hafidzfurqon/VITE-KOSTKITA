import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import PropertyDetail from 'src/sections/landing/property-detail';



// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Detail Property - ${CONFIG.appName}`}</title>

      </Helmet>

      <PropertyDetail />
    </>
  );
}
