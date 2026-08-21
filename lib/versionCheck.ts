import Constants from 'expo-constants';

const REPO = 'LucianoMejia/calculadora-de-riego';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

export interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
  currentVersion: string;
  downloadUrl: string;
}

export async function checkForUpdate(): Promise<UpdateInfo> {
  const currentVersion = Constants.expoConfig?.version ?? '1.0.0';

  try {
    const res = await fetch(API_URL, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!res.ok) {
      return { hasUpdate: false, latestVersion: currentVersion, currentVersion, downloadUrl: '' };
    }

    const data = await res.json();
    const tag: string = data.tag_name ?? '';
    const latestVersion = tag.replace(/^v/, '');

    const downloadUrl = data.html_url ?? `https://github.com/${REPO}/releases/latest`;

    const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;

    return { hasUpdate, latestVersion, currentVersion, downloadUrl };
  } catch {
    return { hasUpdate: false, latestVersion: currentVersion, currentVersion, downloadUrl: '' };
  }
}

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}
