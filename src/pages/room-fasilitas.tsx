import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { RoomFasilitasView } from 'src/sections/room-fasilitas/view';

export default function RoomFasilitasPage() {
  return (
    <>
      <Helmet>
        <title> {`Room Fasilitas - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Room Fasilitas"
        />
        <meta name="keywords" content="Koskita.id" />
      </Helmet>

      <RoomFasilitasView/>
    </>
  );
}
