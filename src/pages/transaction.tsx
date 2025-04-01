import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import TransactionView from 'src/sections/transaction/transaction-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transaction - ${CONFIG.appName}`}</title>
      </Helmet>

      <TransactionView />
    </>
  );
}
