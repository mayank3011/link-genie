import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import PublicPageContent from "@/components/PublicPageContent"
async function PublicLinkInBioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [preloadedLinks, preloadedCustomizations] = await Promise.all([
    preloadQuery(api.lib.links.getLinksBySlug, {
      slug: username,
    }),
    preloadQuery(api.lib.customizations.getCustomizationsBySlug, {
      slug: username,
    }),
  ]);

  return <PublicPageContent 
  username={username}
  preloadedLinks={preloadedLinks}
  preloadedCustomizations={preloadedCustomizations}/>;
}

export default PublicLinkInBioPage;