You are given a file's full text `file` and a request size `n`. Imagine a reader that can only fetch four characters at a time (`read4`), called repeatedly until `n` characters are gathered or the file ends.

Return the characters that such a reader would collect: the first `n` characters of `file`, or the whole file when it is shorter than `n`.

**Constraints:**
- `0 <= file.length <= 10^4`
- `file` holds printable ASCII characters.
- `0 <= n <= 10^4`

**Adaptation note:** The original LeetCode API exposes `read4` and asks you to fill a buffer. To fit the judge's plain-function model, the file content is passed directly as `file` and the answer is returned as a string instead of a count plus buffer. The observable behavior (first `min(n, len)` characters) is identical.
