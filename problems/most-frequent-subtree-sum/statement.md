For every node of a binary tree, consider the sum of all values in the subtree rooted at that node (the node itself plus everything below it). Collect one such total per node, count how many times each distinct total appears, and return every total that attains the highest frequency. The order of the returned totals does not matter.

**Constraints:**
- The number of nodes is in the range `[0, 10^4]`
- `-10^5 <= Node.val <= 10^5`
