// script.js
const DEFAULT_USERNAME = "lswilkins29";
const MAX_REPOS = 10;

const form = document.getElementById("search-form");
const usernameInput = document.getElementById("username");
const gallery = document.getElementById("gallery");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (!username) return;
    await loadReposFor(username);
});

window.addEventListener("DOMContentLoaded", async () => {
    usernameInput.value = DEFAULT_USERNAME;
    await loadReposFor(DEFAULT_USERNAME);
});

async function loadReposFor(username) {
    showMessage(`Loading repositories for “${username}”...`, "info");
    clearGallery();

    try {
        const repos = await fetchUserRepos(username);
        if (!repos || repos.length === 0) {
            showMessage(`No repositories found for “${username}”.`, "warning");
            return;
        }

        showMessage(`Showing ${Math.min(repos.length, MAX_REPOS)} repos for “${username}”.`, "success");

        const limited = repos.slice(0, MAX_REPOS);
        const cards = await Promise.all(limited.map(renderRepoCard));
        gallery.append(...cards);
    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function fetchUserRepos(username) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${MAX_REPOS}`;
    const res = await fetch(url);
    if (!res.ok) {
        if (res.status === 404) throw new Error(`User “${username}” not found.`);
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

async function fetchRepoLanguages(owner, repoName) {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/languages`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
}

function createCard() {
    const card = document.createElement("article");
    card.className = "repo-card";
    return card;
}

async function renderRepoCard(repo) {
    const card = createCard();

    const titleLink = document.createElement("a");
    titleLink.href = repo.html_url;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
    titleLink.className = "repo-title";
    titleLink.textContent = repo.name;

    const header = document.createElement("header");
    header.className = "repo-header";
    header.append(titleLink);

    const description = document.createElement("p");
    description.className = "repo-description";
    description.textContent = repo.description || "No description provided.";

    const meta = document.createElement("div");
    meta.className = "repo-meta";
    meta.innerHTML = `
    <div class="meta-item"><strong>Created</strong> <span>${formatDate(repo.created_at)}</span></div>
    <div class="meta-item"><strong>Updated</strong> <span>${formatDate(repo.updated_at)}</span></div>
    <div class="meta-item"><strong>Watchers</strong> <span>${repo.watchers_count}</span></div>
  `;

    const languages = document.createElement("ul");
    languages.className = "language-list";
    languages.innerHTML = `<li class="language-item">Loading languages…</li>`;

    card.append(header, description, meta, languages);

    fetchRepoLanguages(repo.owner.login, repo.name).then((data) => {
        if (!data || Object.keys(data).length === 0) {
            languages.innerHTML = `<li class="language-item">No languages detected</li>`;
            return;
        }

        const langs = Object.keys(data);
        languages.innerHTML = langs
            .map((lang) => `<li class="language-item"><span class="lang-chip">${lang}</span></li>`)
            .join("");
    }).catch(() => {
        languages.innerHTML = `<li class="language-item">Unable to load languages</li>`;
    });

    return card;
}

function formatDate(raw) {
    try {
        const date = new Date(raw);
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
        return raw;
    }
}

function clearGallery() {
    gallery.innerHTML = "";
}

function showMessage(text, type = "info") {
    messageEl.textContent = text;
    messageEl.className = `message message--${type}`;
}
