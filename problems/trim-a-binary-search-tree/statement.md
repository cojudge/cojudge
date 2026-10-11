You are given the root of a binary search tree plus two bounds `low` and `high`.

Walk the tree and drop every node whose value lies outside the closed interval `[low, high]`. Keep the search-tree ordering among the survivors and return the root of the trimmed tree. An empty result is represented by an empty tree.

**Constraints:**
- The tree holds between 0 and 10000 nodes.
- Node values and `low`/`high` fit in 32-bit signed integers, with `low <= high`.
