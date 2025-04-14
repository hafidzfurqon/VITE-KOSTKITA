import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import NotificationPage from 'src/sections/user/notification/notification';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Notifikasi - ${CONFIG.appName}`}</title>
      </Helmet>

      <NotificationPage />
    </>
  );
}
