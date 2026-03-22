# Assignment-5_CSC-372

## GitHub Repo Gallery

This project demonstrates using the GitHub REST API and the Fetch API to build a dynamic gallery of GitHub repositories for a given username.

### Features
- Uses `fetch` to query:
  - `https://api.github.com/users/{username}/repos` (latest repos sorted by update)
  - `https://api.github.com/repos/{owner}/{repo}/languages` (language breakdown)
- Displays up to 10 repositories per query.
- Shows:
  - Repo name (link to GitHub)
  - Description
  - Created date and updated date
  - Number of watchers
  - List of languages
- Includes a search form for any GitHub username.
- Maintains a default username on page load (`lswilkins29`).
- Handles empty results and error states (user not found / API errors).

### Files
- `index.html`: page structure with hero section, search form, message area, and repo gallery.
- `style.css`: modern gradient background, card-based gallery with responsive grid/flex behavior, and user feedback styles.
- `script.js`: API logic, UI rendering, and error handling.

### How to use
1. Open `index.html` in a browser.
2. The page loads a default username (`lswilkins29`).
3. Type a GitHub username and click **Search**.
4. Repository cards appear with the required metadata.

### Notes
- GitHub API rate limits apply (60 requests/hour for unauthenticated calls). Use sparingly or add token auth if needed.
- If a user has no repos, the app displays a clear message instead of an empty gallery.
