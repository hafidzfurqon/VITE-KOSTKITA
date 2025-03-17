import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LayananView } from 'src/sections/services/view';

export default function LayananPage() {
  return (
    <>
      <Helmet>
        <title> {`Layanan Tambahan - ${CONFIG.appName}`}</title>
        <meta name="description" content="Layanan Tambahan" />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <LayananView />
    </>
  );
}
