# Problem-pack plugins

A plugin (pack) adds problems and courses to Cojudge from its own GitHub
repo. LeetCode 1000 ([`cojudge/leetcode-1000`](https://github.com/cojudge/leetcode-1000))
is the reference pack; [`cojudge/basic-50`](https://github.com/cojudge/basic-50) is a smaller one.

## Using plugins

```bash
cojudge plugin search [keyword]        # browse the catalog (cojudge/plugins)
cojudge plugin install leetcode-1000   # by catalog id
cojudge plugin install owner/repo      # any GitHub repo (also owner/repo@ref or a github.com URL)
cojudge plugin install ./my-pack       # a local folder (handy while authoring)
cojudge plugin list
cojudge plugin disable <id>            # hide its courses and problems, keep the files
cojudge plugin enable <id>
cojudge plugin upgrade [id]            # re-install from the recorded source
cojudge plugin uninstall <id>
```

The web UI has the same actions on the **Plugins** page (plug icon next to the Playground button): an Installed tab and
an Explore tab that reads the catalog. Changes apply on the next page load,
with no restart.

- GitHub installs download the **latest release** tarball. If the repo has no
  releases, they download the default branch.
- **Private repos work.** The installer authenticates with `GH_TOKEN` /
  `GITHUB_TOKEN` if set, else `gh auth token` (so `gh auth login` once is
  enough). This works for the CLI and the web UI: the server process does the
  download. Without auth GitHub reports a private repo as not found, and the
  error says to log in.
- Installed packs live in `~/cojudge/plugins/<id>/` (override with
  `COJUDGE_PLUGINS_DIR`). `install.json` records the source, version and
  enabled state.
- After install, nothing needs the network.
- The catalog URL can be overridden with `COJUDGE_PLUGIN_INDEX` (a URL or a
  local file).

## Writing a pack

```
cojudge-plugin.json
problems/<slug>/   statement.md, metadata.json, official-tests.json, Marker.java, solution.md
courses/<course-id>/courseinfo.json
README.md, LICENSE            (optional, copied on install)
```

Problem folders use exactly the format in [`ADD_PROBLEMS.md`](ADD_PROBLEMS.md).
Only the manifest, `problems/`, `courses/`, README and LICENSE are installed.
Symlinks are rejected.

`cojudge-plugin.json`:

```json
{
  "id": "google-prep",
  "name": "Google Prep",
  "version": "1.0.0",
  "description": "One or two sentences.",
  "homepage": "https://github.com/you/google-prep",
  "minCojudge": "0.10.0"
}
```

`id` uses lowercase letters, digits and dashes, and `version` is semver.

Develop with `cojudge plugin install ./google-prep`. Re-run it after edits,
or edit the installed copy directly. Verify each problem with
`cojudge run` / `cojudge submit`. To publish, push to GitHub, create a
release, and open a PR adding your pack to
[`cojudge/plugins`](https://github.com/cojudge/plugins).

## Problem ids and slug conflicts

Different packs can ship the same slug (`two-sum`) without clobbering each
other:

| Problem | Id |
|---|---|
| Core (bundled or created in `~/cojudge`) | `two-sum` |
| Shipped by pack `google-prep` | `google-prep/two-sum` |

- **Courses look in their own pack first, then core.** In
  `google-prep`'s course, a plain `two-sum` means `google-prep/two-sum` if
  the pack ships it, and core's `two-sum` otherwise.
- **Reuse core problems.** If core already has the problem, reference it by
  slug instead of copying it.
- A course can name another pack's problem in full (`leetcode-1000/foo`).
  That problem only shows up when the other pack is installed and enabled.
- Problem URLs are `/problems/<id>`, for example `/problems/google-prep/two-sum`.
- Progress, bookmarks and saved code are keyed by id, so the same slug in two
  packs is tracked separately.
- In the CLI, a bare slug that exists in exactly one pack resolves to it
  (`cojudge run two-sum` → `google-prep/two-sum` if core has none). If several
  packs have it, the CLI lists the full ids to choose from.

**`"unprefixedIds": true`** (manifest) keeps bare ids for a pack's problems.
It exists only for packs moved out of core: LeetCode 1000 uses it so progress
saved before the split still matches. Core always wins a bare-id collision.
Don't use it for new packs.

## Lookup order and editing

For every problem and course, Cojudge reads the first copy it finds:

1. **Your edits** in `~/cojudge`:
   - core and unprefixed problems: `problems/<slug>/`
   - prefixed pack problems: `problems/@<pack-id>/<slug>/`
   - courses: `courses/<course-id>/`
2. **The enabled pack's copy**, from `~/cojudge/plugins/<id>/`.
3. **The bundled copy** shipped with Cojudge.

Edited pack problems show as **Modified**, compared against the pack's copy.
Upgrading a pack never overwrites your edits.

## Known limitations

- Exam mode strips hints and solutions only from core problems.
- Statement images in prefixed packs are untested: the asset route
  (`/api/problems/[slug]/asset/...`) takes the id as a single URL segment.
  Bare-id packs such as LeetCode 1000 are unaffected.
- `minCojudge` is recorded but not yet enforced.
