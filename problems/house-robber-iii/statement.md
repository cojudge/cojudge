A burglar has discovered a district whose only access point is the house labeled `root`.

Every other house in the district reports to exactly one parent house, so a survey of the area shows the houses are arranged as a binary tree. If two houses sharing a direct connection are both entered during one night, an alarm summons the police.

Given the `root` of that binary tree, compute the largest sum of money collectible in one night while never entering two houses joined by an edge.

**Example 1:**
```
Input: root = [3,2,3,null,3,null,1]
Output: 7
Explanation: Best achievable total is 3 + 3 + 1 = 7.
```

**Example 2:**
```
Input: root = [3,4,5,1,3,null,1]
Output: 9
Explanation: Best achievable total is 4 + 5 = 9.
```

**Constraints:**
- The number of nodes in the tree is in the range `[1, 10^4]`
- `0 <= Node.val <= 10^4`
