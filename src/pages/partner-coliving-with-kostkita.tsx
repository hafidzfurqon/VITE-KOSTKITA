import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import PartnerColivingWithKostKita from 'src/sections/partners/partner-coliving-with-kostkita';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Temukan Potensi Bisnis Properti Anda - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="kostkita,kerjasama-kostkita,partnerkost,kost" />
      </Helmet>

      <PartnerColivingWithKostKita />
    </>
  );
}
