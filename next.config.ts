import withNextIntl from "next-intl/plugin";

const withNextIntlConfig = withNextIntl("./src/i18n.ts");

export default withNextIntlConfig({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gmqppcnvnofbbudyobap.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
});
