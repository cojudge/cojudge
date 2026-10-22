Versions `1..n` turn bad starting at some hidden threshold: every version from the first bad one onward is bad. Interact with the judge object `vc` — your code never receives `bad` directly:

- `isBadVersion(version)` returns whether that version is bad.

Implement `firstBadVersion(n, vc)` returning the first bad version while minimizing the number of API calls. Binary search needs `O(log n)` calls; the judge counts your calls and reports Wrong Answer if you exceed **100** calls on a test case.

Method names per language: Java `vc.isBadVersion(version)`, Python `vc.is_bad_version(version)`, C++ `vc.isBadVersion(version)`, C# `vc.IsBadVersion(version)`, Rust `vc.is_bad_version(version)`, Go `vc.IsBadVersion(version)`, TypeScript `vc.isBadVersion(version)`, PHP `$vc->isBadVersion($version)`.

**Constraints:**

- `1 <= bad <= n <= 2^31 - 1`
- At most 100 API calls per test case.
