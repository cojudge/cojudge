You are given an integer array with at least three entries. Choose any three distinct positions and multiply their values. Return the greatest product reachable.

Negatives matter: two large-magnitude negatives can turn positive when paired with a big positive.

**Example 1:**
```
Input: nums = [1,2,3]
Output: 6
```

**Example 2:**
```
Input: nums = [1,2,3,4]
Output: 24
```

**Example 3:**
```
Input: nums = [-1,-2,-3]
Output: -6
```

**Constraints:**
- Array length is between 3 and 10000.
- Each value lies in [-1000, 1000]; the winning product fits in 32-bit signed range for the given tests.
