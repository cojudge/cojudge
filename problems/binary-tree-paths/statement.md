Given the root of a binary tree, list every path from the root down to a leaf. A leaf is a node with no children. Each path is written as node values joined by `"->"`, for example `"1->2->5"`.

Return all such paths in any order.

**Example 1:**
```
Input: root = [1,2,3,null,5]
Output: ["1->2->5","1->3"]
Explanation: The two leaves are 5 and 3, reached by 1 -> 2 -> 5 and 1 -> 3.
```

**Example 2:**
```
Input: root = [1]
Output: ["1"]
Explanation: The root is itself a leaf, so the only path is "1".
```

**Example 3:**
```
Input: root = [1,2,null,3,null,4]
Output: ["1->2->3->4"]
Explanation: The single chain from the root to the deepest leaf forms one path.
```

**Constraints:**
- `1 <= number of nodes <= 100`
- `-100 <= Node.val <= 100`
