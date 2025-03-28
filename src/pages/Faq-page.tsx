import { Helmet } from 'react-helmet-async';
import FaqPage from 'src/component/FaqPage';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Data Booking - ${CONFIG.appName}`}</title>
      </Helmet>

      <FaqPage />
    </>
  );
}
