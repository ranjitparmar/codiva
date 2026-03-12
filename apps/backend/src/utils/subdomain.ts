import { siteRepository } from "../repositories/site.repository";

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
};

export const resolveSubdomain = async (
  requestedSubdomain: string | undefined,
  aiSlug: string
): Promise<string> => {
  const base = requestedSubdomain
    ? slugify(requestedSubdomain)
    : slugify(aiSlug);

  // check if base is available
  const exists = await siteRepository.findBySubdomain(base);
  if (!exists) return base;

  // increment until available
  let counter = 1;
  while (true) {
    const candidate = `${base}-${counter}`;
    const taken = await siteRepository.findBySubdomain(candidate);
    if (!taken) return candidate;
    counter++;
  }
};