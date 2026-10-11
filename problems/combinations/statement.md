Supplied with two integers `n` and `k`, assemble every `k`-element subset drawn from the interval `[1, n]`.

The collection may be emitted in whatever sequence is convenient.

**Example 1:**

```
Input: n = 4, k = 2
Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
Explanation: 4 choose 2 yields 6 subsets in total.
```

**Example 2:**

```
Input: n = 1, k = 1
Output: [[1]]
Explanation: 1 choose 1 yields a lone subset.
```

**Constraints:**

- `1 <= n <= 20`
- `1 <= k <= n`
