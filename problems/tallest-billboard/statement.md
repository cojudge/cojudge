You are given rods of various integer lengths and want to mount a billboard on two supports of exactly equal height. Each rod can be assigned to the left support, to the right support, or left unused, and the height of a support is the total length of the rods assigned to it.

Choose the assignments so that both supports end up with the same height, and make that shared height as large as possible. Return the tallest balanced height you can build, or 0 when no balanced pair of supports exists.

**Example 1:**
```
Input: rods = [1,2,3,6]
Output: 6
Explanation: Splitting into [1,2,3] and [6] gives two supports of height 6, which is the best achievable balance.
```

**Example 2:**
```
Input: rods = [1,2,3,4,5,6]
Output: 10
Explanation: Grouping [2,3,5] against [4,6] (or [1,4,5] against [2,3,... ]) reaches height 10; nothing taller balances.
```

**Example 3:**
```
Input: rods = [1,2]
Output: 0
Explanation: No two disjoint non-empty groups share a total, so the answer is 0.
```

**Constraints:**
- `1 <= rods.length <= 20`
- `1 <= rods[i] <= 20`
