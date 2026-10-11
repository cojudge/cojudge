An integer `n` (given as its decimal text) has a *good base* `k >= 2` when writing `n` in base `k` uses only the digit `1` — that is, `n = 1 + k + k^2 + ... + k^m` for some length `m >= 1`. Every `n >= 3` has at least the trivial base `n - 1` (form `11`).

Return the smallest such base, again as decimal text.

**Example 1:**

```
Input: n = "13"
Output: "3"
Explanation: 13 in base 3 is 111 (1 + 3 + 9).
```

**Example 2:**

```
Input: n = "4681"
Output: "8"
Explanation: 4681 in base 8 is 11111.
```

**Example 3:**

```
Input: n = "1000000000000000000"
Output: "999999999999999999"
Explanation: Only the two-digit form 11 works, with base n-1.
```

**Constraints:**

- `n` is an integer in `[3, 10^18]` with no leading zeroes.
