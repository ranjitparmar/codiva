import fs from "fs/promises";
import path from "path";
import { env } from "../config/env";

const getSiteDir = (subdomain: string) => {
  if (env.NODE_ENV === "production") {
    return `/var/www/codiva/${subdomain}`;
  }
  return path.join(process.cwd(), "dev-sites", subdomain);
};

export const writeSiteFiles = async (
  subdomain: string,
  html: string
): Promise<string> => {
  const dir = getSiteDir(subdomain);

  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, "index.html");

  await fs.writeFile(filePath, html, "utf-8");

  return dir;
};

export const deleteSiteFiles = async (subdomain: string) => {
  const dir = getSiteDir(subdomain);
  await fs.rm(dir, { recursive: true, force: true });
};