import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { PropertyRoomView } from 'src/sections/property_room/view';

export default function PropertyRoomPage() {
  return (
    <>
      <Helmet>
        <title> {`Property Room - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Apartmenet"
        />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <PropertyRoomView/>
    </>
  );
}
