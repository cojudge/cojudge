Build a height-balanced binary search tree from the values of an ascending singly linked list.

Walk the list to gather its values in order, then convert that ordered sequence into a balanced tree: the middle value becomes the root and each half recursively becomes a subtree. Every node's two subtree heights may differ by at most one.

Return the tree root. An empty list produces an empty tree, and any balanced search tree holding exactly the list values is accepted.

**Constraints:**
- `0 <= number of list nodes <= 2 * 10^4`
- `-10^5 <= Node.val <= 10^5`
- Values appear in non-decreasing order.
