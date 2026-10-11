You are given the root of a binary tree whose nodes hold digits `0` through `9`. Every path from the root down to a leaf spells a decimal number by concatenating the digits along the way.

For instance, the path `1 -> 2 -> 3` stands for `123`.

Add up the numbers spelled by all root-to-leaf paths and return the total. The answer fits in a 32-bit integer. A leaf is a node with no children.

**Example 1:**
```
Input: root = [1,2,3]
Output: 25
Explanation: Paths 1->2 (12) and 1->3 (13) sum to 25.
```

**Example 2:**
```
Input: root = [4,9,0,5,1]
Output: 1026
Explanation: Paths give 495 + 491 + 40 = 1026.
```

**Constraints:**
- The tree holds between 1 and 1000 nodes.
- `0 <= Node.val <= 9`
- Tree depth is at most 10.
