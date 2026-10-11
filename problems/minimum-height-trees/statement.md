Consider an undirected connected graph with no cycles — that structure is a tree, so every pair of vertices is joined by a single unique path.

You are given `n` labeled `0` through `n - 1`, together with `n - 1` connections `edges` where `edges[i] = [ai, bi]` joins vertices `ai` and `bi`. Any vertex may be designated as the root, which turns the tree into a rooted tree of some height `h`. The trees whose height is as small as possible over all root choices are the minimum height trees (MHTs).

List the labels of every root that achieves that smallest height. The order of the returned list does not matter.

For a rooted tree, height means the count of edges along the longest path that starts at the root and goes down to a leaf.

**Example 1:**
```
Input: n = 4, edges = [[1,0],[1,2],[1,3]]
Output: [1]
```

**Example 2:**
```
Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]
Output: [3,4]
```

**Constraints:**
- `1 <= n <= 2 * 10^4`
- `edges.length == n - 1`
- `0 <= ai, bi < n`
- `ai != bi`
- All the pairs `(ai, bi)` are unique
- The given input is guaranteed to be a tree and there will be no repeated edges
