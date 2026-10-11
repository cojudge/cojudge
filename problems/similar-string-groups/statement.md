Count how many clusters of mutually reachable strings appear in a list.

Two strings of equal length are called directly alike when they match everywhere, or when swapping exactly one pair of positions in one of them makes the two equal. In other words, they differ in zero places, or in precisely two places `i` and `j` where the characters cross-match. Likeness links transitively: if A is alike B and B is alike C, all three belong to one cluster even when A and C are not directly alike.

Given an array `strs` where every entry has the same length, return the number of clusters.

**Example 1:**
```
Input: strs = ["tars","rats","arts","star"]
Output: 2
Explanation: The first three connect through single swaps ("tars" with "rats", "rats" with "arts"), forming one cluster, while "star" stands alone.
```

**Example 2:**
```
Input: strs = ["omv","ovm"]
Output: 1
Explanation: Swapping the last two letters turns one into the other, so they share a cluster.
```

**Example 3:**
```
Input: strs = ["abc","def","ghi"]
Output: 3
Explanation: No pair can be fixed with a single swap, so each word is its own cluster.
```

**Constraints:**
- `1 <= strs.length <= 300`
- `1 <= strs[i].length <= 300`
- All strings share the same length and hold lowercase English letters.
