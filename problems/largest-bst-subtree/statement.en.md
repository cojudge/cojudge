Given the root of a binary tree, locate the biggest connected portion that itself obeys the binary search ordering, and report how many nodes it holds.

A portion qualifies when, for every node inside it, all values in its left descendant set are strictly smaller and all values in its right descendant set are strictly larger. A single node always qualifies, and an empty tree contributes size zero.

Return the node count of the largest such portion.

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-10^4 <= Node.val <= 10^4`
