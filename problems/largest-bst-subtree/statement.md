Given the root of a binary tree, locate the biggest connected portion that itself obeys the binary search ordering, and report how many nodes it holds.

A portion qualifies when, for every node inside it, all values in its left descendant set are strictly smaller and all values in its right descendant set are strictly larger. A single node always qualifies, and an empty tree contributes size zero.

Return the node count of the largest such portion.

**Example 1:**
```
Input: root = [10,5,15,1,8,null,7]
Output: 3
Explanation: The left branch holding 5 with children 1 and 8 is ordered and has 3 nodes. The right branch fails because 7 sits in the right subtree of 15 yet is smaller than 15.
```

**Example 2:**
```
Input: root = [2,1,3]
Output: 3
Explanation: Every left descendant (1) is smaller and every right descendant (3) is larger, so the whole tree of 3 nodes qualifies.
```

**Example 3:**
```
Input: root = [1]
Output: 1
Explanation: A lone node is trivially ordered.
```

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-10^4 <= Node.val <= 10^4`
