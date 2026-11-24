const configuredProfileUrl = import.meta.env.VITE_DISCORD_PROFILE_URL as string | undefined;

function resolveDiscordProfileUrl(): string {
  if (!configuredProfileUrl) return "https://discord.com/app";
  try {
    const url = new URL(configuredProfileUrl);
    if (url.protocol === "https:" && url.hostname === "discord.com") return url.toString();
  } catch {
    // Fall back to Discord's generic app when the deployment value is not a valid URL.
  }
  return "https://discord.com/app";
}

export const discordProfileUrl = resolveDiscordProfileUrl();
