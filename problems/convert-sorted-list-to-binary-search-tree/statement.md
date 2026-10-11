Build a height-balanced binary search tree from the values of an ascending singly linked list.

Walk the list to gather its values in order, then convert that ordered sequence into a balanced tree: the middle value becomes the root and each half recursively becomes a subtree. Every node's two subtree heights may differ by at most one.

Return the tree root. An empty list produces an empty tree, and any balanced search tree holding exactly the list values is accepted.

**Example 1:**
```
Input: head = [-10,-3,0,5,9]
Output: [0,-3,9,-10,null,5]
Explanation: Values [-10,-3,0,5,9] arranged with 0 at the root stay balanced; other balanced layouts also pass.
```

**Example 2:**
```
Input: head = []
Output: []
```

**Example 3:**
```
Input: head = [1]
Output: [1]
```

**Constraints:**
- `0 <= number of list nodes <= 2 * 10^4`
- `-10^5 <= Node.val <= 10^5`
- Values appear in non-decreasing order.
