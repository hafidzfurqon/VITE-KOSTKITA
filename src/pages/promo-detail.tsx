import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import PromoDetails from 'src/sections/landing/promo/promo-details';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Detail Promo - ${CONFIG.appName}`}</title>
      </Helmet>

      <PromoDetails />
    </>
  );
}
