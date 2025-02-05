import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BannerView } from 'src/sections/banner/view';

export default function BannerPage() {
  return (
    <>
      <Helmet>
        <title> {`Banner - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Banner"
        />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <BannerView/>
    </>
  );
}
