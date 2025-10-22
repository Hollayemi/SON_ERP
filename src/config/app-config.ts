import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "SON",
  version: packageJson.version,
  icon: "/images/logo/logo2x.png",
  copyright: `© ${currentYear}, Standard Organization Of Nigeria.`,
  meta: {
    title: "Standard Organization Of Nigeria - ERP",
    description:
      "A centralized ERP platform for the Standard Organization of Nigeria (SON) that streamlines certification, inspection, compliance, finance, and staff management. It enables real-time monitoring, automation, and data-driven decision-making to improve operational efficiency and promote product standardization across industries.",
  },
};
