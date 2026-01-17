import { config } from "@/config";

export { url } from "@/config";

export const brand = {
  name: config.name,
  color: config.themeColor,
  supportEmail: config.socials.email,
  logoUrl: config.logo.url,
};

export const fonts = {
  base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

export const styles = {
  body: {
    backgroundColor: "#f5f5f7",
    fontFamily: fonts.base,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },

  header: {
    textAlign: "center" as const,
  },

  logo: {
    borderRadius: "16px",
    marginBottom: "24px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1d1d1f",
  },

  paragraph: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#424245",
    textAlign: "center" as const,
  },

  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },

  button: {
    backgroundColor: brand.color,
    color: "#ffffff",
    padding: "12px 36px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
  },

  muted: {
    fontSize: "14px",
    color: "#86868b",
    textAlign: "center" as const,
  },

  link: {
    fontSize: "13px",
    color: brand.color,
    wordBreak: "break-all" as const,
    display: "block",
    textAlign: "center" as const,
  },

  divider: {
    margin: "32px 0",
    borderColor: "#e5e5e7",
  },

  securityTitle: {
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center" as const,
    color: "#424245",
  },

  securityText: {
    fontSize: "13px",
    lineHeight: "1.6",
    textAlign: "center" as const,
    color: "#86868b",
  },

  footer: {
    marginTop: "24px",
    textAlign: "center" as const,
  },

  footerText: {
    fontSize: "12px",
    color: "#86868b",
  },
};
