/**
 * GitHub Contents API — čitanje i commitanje fajlova u repo.
 * Na Vercelu je lokalni fajl sistem read-only i zastao nakon
 * admin commita, pa je GitHub repo jedini izvor istine.
 */

const API = "https://api.github.com";

function config() {
  const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;
  const missing = [
    ["GITHUB_TOKEN", GITHUB_TOKEN],
    ["GITHUB_REPO_OWNER", GITHUB_REPO_OWNER],
    ["GITHUB_REPO_NAME", GITHUB_REPO_NAME],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(`Nedostaju env varijable: ${missing.join(", ")}`);
  }
  return {
    token: GITHUB_TOKEN!,
    owner: GITHUB_REPO_OWNER!,
    repo: GITHUB_REPO_NAME!,
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

async function ghRequest(
  method: "GET" | "PUT",
  path: string,
  body?: unknown,
): Promise<Response> {
  const c = config();
  const res = await fetch(
    `${API}/repos/${c.owner}/${c.repo}/contents/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${c.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub ${method} ${path} → ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res;
}

export interface RepoFile {
  /** Dekodirani tekstualni sadržaj (UTF-8). */
  text: string;
  sha: string;
}

/** Čita fajl iz repoa; null ako ne postoji. */
export async function getRepoFile(path: string): Promise<RepoFile | null> {
  const c = config();
  const res = await fetch(
    `${API}/repos/${c.owner}/${c.repo}/contents/${path}?ref=${encodeURIComponent(c.branch)}`,
    {
      headers: {
        Authorization: `Bearer ${c.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub GET ${path} → ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = (await res.json()) as { content: string; sha: string };
  return {
    text: Buffer.from(json.content.replace(/\n/g, ""), "base64").toString("utf8"),
    sha: json.sha,
  };
}

/** Putanje fajlova koje admin chat smije čitati/mijenjati kao kod. */
const SOURCE_PATH = /^src\/.+\.(ts|tsx|css)$|^tailwind\.config\.ts$|^next\.config\.ts$/;

/** Lista source fajlova u repou (Git Trees API, jedan poziv). */
export async function listSourceFiles(): Promise<string[]> {
  const c = config();
  const res = await fetch(
    `${API}/repos/${c.owner}/${c.repo}/git/trees/${encodeURIComponent(c.branch)}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${c.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub GET tree → ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = (await res.json()) as { tree: { path: string; type: string }[] };
  return json.tree
    .filter((e) => e.type === "blob" && SOURCE_PATH.test(e.path))
    .map((e) => e.path)
    .sort();
}

/** Dohvata sadržaje više tekstualnih fajlova paralelno (preskače nepostojeće). */
export async function getRepoFiles(
  paths: string[],
): Promise<{ path: string; text: string }[]> {
  const results = await Promise.all(paths.map((p) => getRepoFile(p)));
  return results.flatMap((f, i) => (f ? [{ path: paths[i], text: f.text }] : []));
}

/** Kreira ili ažurira tekstualni fajl (UTF-8) jednim commitom. */
export async function commitTextFile(
  path: string,
  text: string,
  message: string,
): Promise<void> {
  await commitBase64File(path, Buffer.from(text, "utf8").toString("base64"), message);
}

/** Kreira ili ažurira binarni fajl (base64 sadržaj) jednim commitom. */
export async function commitBase64File(
  path: string,
  contentBase64: string,
  message: string,
): Promise<void> {
  const c = config();
  const existing = await getRepoFile(path);
  await ghRequest("PUT", path, {
    message,
    content: contentBase64,
    branch: c.branch,
    ...(existing ? { sha: existing.sha } : {}),
  });
}
