export const technologies = [
  { name: "Next.js", categoryKey: "Framework" },
  { name: "React", categoryKey: "UI" },
  { name: "TypeScript", categoryKey: "Language" },
  { name: "Tailwind CSS", categoryKey: "Styling" },
  { name: "Node.js", categoryKey: "Runtime" },
  { name: "PostgreSQL", categoryKey: "Database" },
  { name: "Vercel", categoryKey: "Deploy" },
  { name: "Figma", categoryKey: "Design" },
  { name: "Framer Motion", categoryKey: "Motion" },
  { name: "Git", categoryKey: "Version" },
  { name: "Docker", categoryKey: "Infra" },
  { name: "Linux", categoryKey: "Systems" },
] as const;

export const TSM_PROJECT_URL = "https://transportservicemedellin.com";
export const TSM_INSTAGRAM_URL = "https://www.instagram.com/transportservice_medellin";
export const ROSLEBEN_PROJECT_URL = "https://rosleben.com";
export const ROSLEBEN_INSTAGRAM_URL = "https://instagram.com/rosleben_co";

export type PortfolioProjectId = "tsm" | "rosleben";

export const portfolioProjects = [
  {
    id: "tsm" as const,
    siteUrl: TSM_PROJECT_URL,
    instagramUrl: TSM_INSTAGRAM_URL,
    siteDisplay: "transportservicemedellin.com",
    instagramDisplay: "@transportservice_medellin",
    image: {
      src: "/projects/tsm-hero.png",
      src2x: "/projects/tsm-hero@2x.png",
      width: 1024,
      height: 455,
    },
  },
  {
    id: "rosleben" as const,
    siteUrl: ROSLEBEN_PROJECT_URL,
    instagramUrl: ROSLEBEN_INSTAGRAM_URL,
    siteDisplay: "rosleben.com",
    instagramDisplay: "@rosleben_co",
    image: {
      src: "/projects/rosleben-hero.png",
      width: 1024,
      height: 580,
    },
  },
] as const;

export const navKeys = [
  "services",
  "work",
  "plans",
  "process",
  "stack",
  "contact",
] as const;
