Walk a binary tree row by row from the top down and record, for every depth level, the greatest value appearing on that level. Return those maxima from the shallowest row to the deepest one.

**Example 1:**
```
Input: root = [1,3,2,5,3,null,9]
Output: [1,3,9]
Explanation: Row 0 holds [1], row 1 holds [3,2], row 2 holds [5,3,9]; the maxima are 1, 3 and 9.
```

**Example 2:**
```
Input: root = [1,2,3]
Output: [1,3]
Explanation: The rows are [1] and [2,3], giving maxima 1 and 3.
```

**Example 3:**
```
Input: root = []
Output: []
Explanation: An empty tree has no rows.
```

**Constraints:**
- The number of nodes is in the range `[0, 10^4]`
- `-2^31 <= Node.val <= 2^31 - 1`
