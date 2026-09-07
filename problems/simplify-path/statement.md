You are given an absolute path for a Unix-style file system, which always begins
with a slash `/`. Transform this absolute path into its simplified canonical
path.

The rules are:

- A single period `.` represents the current directory.
- A double period `..` represents the previous/parent directory.
- Multiple consecutive slashes such as `//` are treated as a single slash `/`.
- Any sequence of periods that does not match the rules above (for example
  `...`) is a valid directory name.

The canonical path must start with a single slash `/`, separate directories
with exactly one slash, not end with a slash (unless it is the root), and not
contain `.` or `..`.

**Constraints:**

- `1 <= path.length <= 3000`
- `path` consists of English letters, digits, period `.`, slash `/` or `_`.
- `path` is a valid absolute Unix path.
