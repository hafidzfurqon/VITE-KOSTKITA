import { Helmet } from 'react-helmet-async';
import VerifyEmailPage from 'src/component/VerifyEmailPage';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function VerifyEmialPages() {
  return (
    <>
      <Helmet>
        <title> {`Verifikasi Email - ${CONFIG.appName}`}</title>
      </Helmet>

      <VerifyEmailPage />
    </>
  );
}
