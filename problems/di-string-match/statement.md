Rebuild a permutation from its up/down pattern.

You are given a pattern string `s` whose characters are `I` (the next number goes up) and `D` (the next number goes down). Build any ordering `perm` of the integers `0` through `n` (where `n` is the pattern length) such that each neighbouring pair obeys the pattern: `perm[i] < perm[i+1]` wherever `s[i]` is `I`, and `perm[i] > perm[i+1]` wherever it is `D`. Many orderings may qualify; return any one of them.

**Example 1:**
```
Input: s = "IDID"
Output: [0,4,1,3,2]
Explanation: 0 < 4 > 1 < 3 > 2 follows I, D, I, D in order.
```

**Example 2:**
```
Input: s = "III"
Output: [0,1,2,3]
Explanation: Every step rises, so the sorted order works.
```

**Example 3:**
```
Input: s = "DDI"
Output: [3,2,0,1]
Explanation: 3 > 2 > 0 < 1 follows D, D, I in order.
```

**Constraints:**
- `1 <= s.length <= 10^5`
- Each character of `s` is `I` or `D`.
