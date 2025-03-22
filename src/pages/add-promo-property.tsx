import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PropertyViewPromo } from 'src/sections/promo/properties/view';


// import { PropertyView } from 'src/sections/property/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Add Promo - ${CONFIG.appName}`}</title>
      </Helmet>

      <PropertyViewPromo />
    </>
  );
}
