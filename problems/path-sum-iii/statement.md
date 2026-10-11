You are given a binary tree `root` and a number `targetSum`. Count the downward paths whose node values add up to `targetSum`. A path may begin at any node and finish at any descendant of that start (the start and end may coincide); it must follow parent-to-child links only.

**Example 1:**
```
Input: root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
Output: 3
Explanation: Three downward routes total 8: 5->3, 5->2->1, and -3->11.
```

**Example 2:**
```
Input: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
Output: 3
Explanation: Three routes hit 22: 5->4->11->2, 5->8->4->5, and 4->11->7.
```

**Example 3:**
```
Input: root = [], targetSum = 0
Output: 0
Explanation: No nodes means no paths.
```

**Constraints:**
- Node count lies in `[0, 1000]`.
- Node values and `targetSum` fit the stated ranges; sums may exceed 32-bit during accumulation, so use 64-bit counters internally.
