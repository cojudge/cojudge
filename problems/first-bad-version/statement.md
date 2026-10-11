Versions `1..n` turn bad starting at some hidden threshold: every version from the first bad one onward is bad.

**Adaptation:** instead of a hidden API, you receive both `n` and `bad`,
where `isBadVersion(v)` equals `v >= bad`. Implement
`firstBadVersion(n, bad)` returning the first bad version while using as few
API-style checks as possible (binary search).

**Examples:**
```
Input: n = 5, bad = 4
Output: 4
```
```
Input: n = 1, bad = 1
Output: 1
```
```
Input: n = 10, bad = 7
Output: 7
```

**Constraints:**
- `1 <= bad <= n <= 2^31 - 1`
