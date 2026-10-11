You are given the root of a binary tree. A consecutive trail is a sequence of nodes where each neighbouring pair differs by exactly one. The trail may climb upward and then descend (child-parent-child), and it may run either increasingly or decreasingly.

Find the number of nodes in the longest such trail anywhere in the tree. A lone node counts as length one.

**Constraints:**
- `1 <= number of nodes <= 3 * 10^4`
- `-3 * 10^4 <= Node.val <= 3 * 10^4`
