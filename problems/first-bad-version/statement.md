Versions `1..n` turn bad starting at some hidden threshold: every version from the first bad one onward is bad.

**Adaptation:** instead of a hidden API, you receive both `n` and `bad`,
where `isBadVersion(v)` equals `v >= bad`. Implement
`firstBadVersion(n, bad)` returning the first bad version while using as few
API-style checks as possible (binary search).

**Constraints:**
- `1 <= bad <= n <= 2^31 - 1`
