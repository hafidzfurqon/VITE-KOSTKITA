import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ApartementView } from 'src/sections/apartement/view';

export default function ApartmenetPage() {
  return (
    <>
      <Helmet>
        <title> {`Property - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Apartmenet"
        />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <ApartementView/>
    </>
  );
}
