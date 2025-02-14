import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PromoView } from 'src/sections/promo/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Promo - ${CONFIG.appName}`}</title>
      </Helmet>

      <PromoView />
    </>
  );
}
