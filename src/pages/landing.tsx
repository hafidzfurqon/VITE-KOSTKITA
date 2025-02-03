import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { LandingPage } from 'src/sections/landing';

export default function LandingPages() {
  return (
    <>
      <Helmet>
        <title> {`Landing - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="Rohis, Rodamu, Rohis-sknc,  Rohis Smkn 1 ciomas" />
      </Helmet>

      <LandingPage />
    </>
  );
}
