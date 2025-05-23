import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { FasilitasView } from 'src/sections/fasilitas/view';

export default function FasilitasPage() {
  return (
    <>
      <Helmet>
        <title> {`Fasilitas - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Fasilitas"
        />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <FasilitasView/>
    </>
  );
}
