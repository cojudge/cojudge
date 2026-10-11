You receive a Unix-style absolute path, which by definition opens with `/`. Reduce it to its shortened canonical equivalent.

Apply these interpretations:

- one dot `.` stands for the present folder;
- two dots `..` stand for stepping up to the enclosing folder;
- runs of slashes such as `//` collapse into a single `/`;
- any other dot run, for instance `...`, counts as an ordinary folder name rather than a special token.

The shortened result must open with exactly one `/`, join folders with a single `/`, never close with `/` (except for the lone root `/` itself), and leave out any `.` or `..` pieces.

**Constraints:**

- `1 <= path.length <= 3000`
- `path` consists of English letters, digits, period `.`, slash `/` or `_`.
- `path` is a valid absolute Unix path.
