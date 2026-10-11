Given the root of a binary search tree, a decimal `target` passed as a string (for example `"3.714286"`) and an integer `k`, return the `k` tree values numerically closest to `target`. Return them in any order.

This is a portable adaptation: parse `target` as a double and compare distances numerically. A checker accepts any set of `k` values whose largest distance does not exceed the smallest distance outside the set.

**Example 1:**
```
Input: root = [4,2,5,1,3], target = "3.714286", k = 2
Output: [4,3]
Explanation: Distances grow as 4 (0.286), 3 (0.714), 5 (1.286), 2 (1.714), 1 (2.714), so the two closest are 4 and 3 in any order.
```

**Example 2:**
```
Input: root = [1], target = "0.000000", k = 1
Output: [1]
Explanation: The single value is the only candidate.
```

**Example 3:**
```
Input: root = [5,3,8,1,4,7,9], target = "6.0", k = 3
Output: [5,7,4]
Explanation: The closest distances are 5 and 7 (1.0 each) and then 4 (2.0), so those three form a valid answer in any order.
```

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `1 <= k <= number of nodes`
- `-10^4 <= Node.val <= 10^4`
- The tree is a valid binary search tree.
- `target` is a decimal string parseable by a double.
