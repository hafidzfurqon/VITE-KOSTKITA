import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BookedPropertyView } from 'src/sections/booked-property/view';

export default function BookedPropertyPage() {
  return (
    <>
      <Helmet>
        <title> {`BookedProperty - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="BookedProperty"
        />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <BookedPropertyView/>
    </>
  );
}
