import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BannerView } from 'src/sections/banner/view';
import { PropertyView } from 'src/sections/property/view';

export default function PropertyPage() {
  return (
    <>
      <Helmet>
        <title> {`Property Tipe - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Banner"
        />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <PropertyView/>
    </>
  );
}
