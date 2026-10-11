You are given the integer `n`, which stands for the numbers `1` through `n`. A *beautiful arrangement* is a reordering `p` of these numbers (using each exactly once) where every position `i` (counted from 1) satisfies at least one of:
- `p[i]` is divisible by `i`, or
- `i` is divisible by `p[i]`.

Return how many distinct beautiful arrangements exist for the given `n`.

**Example 1:**
```
Input: n = 2
Output: 2
Explanation: Both [1,2] and [2,1] satisfy the rule at each position.
```

**Example 2:**
```
Input: n = 1
Output: 1
Explanation: Only [1] is possible.
```

**Example 3:**
```
Input: n = 3
Output: 3
Explanation: The valid orders are [1,2,3], [3,2,1], and [2,1,3].
```

**Constraints:**
- `1 <= n <= 15`
