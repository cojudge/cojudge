Given an N-ary tree, return the number of nodes on the longest path from the root down to any leaf. An empty tree has depth 0 and a single node has depth 1.

Input encoding: the tree arrives as a single string `data` holding a bracketed, comma-separated token list. The first token is the root value; afterwards each node's children appear as a group terminated by `null`, in level order. For example `"[1,null,3,2,4,null,5,6]"` means root 1 with children 3, 2, 4, where node 3 parents 5 and 6. The empty tree is `"[]"`.

**Constraints:**
- The token count is at most 10^4.
- Node values fit in a 32-bit signed integer.
- The tree depth is at most 1000.
