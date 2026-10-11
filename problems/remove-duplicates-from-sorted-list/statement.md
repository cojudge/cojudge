Given the head of a sorted linked list, collapse each run of equal values into a single node. The first occurrence of every value is kept and all consecutive duplicates are removed, preserving the sorted order.

For example, `1 -> 1 -> 2` becomes `1 -> 2`. Return the head of the deduplicated list.

**Example 1:**
```
Input: head = [1,1,2]
Output: [1,2]
Explanation: One of the two 1s is removed.
```

**Example 2:**
```
Input: head = [1,1,2,3,3]
Output: [1,2,3]
Explanation: Extra copies of 1 and 3 are removed.
```

**Example 3:**
```
Input: head = []
Output: []
Explanation: An empty list stays empty.
```

**Constraints:**
- `0 <= number of nodes <= 300`
- `-100 <= node value <= 100`
- The list is sorted in non-decreasing order.
