Given the head of a sorted linked list, delete every node whose value occurs more than once, keeping only nodes with fully unique values. The remaining nodes stay in their original relative order.

For instance, a run like `2 -> 2 -> 2` disappears entirely, while an isolated value is preserved. Return the head of the trimmed list.

**Example 1:**
```
Input: head = [1,2,3,3,4,4,5]
Output: [1,2,5]
Explanation: Values 3 and 4 repeat, so all their nodes are removed.
```

**Example 2:**
```
Input: head = [1,1,1,2,3]
Output: [2,3]
Explanation: The three leading 1s are all dropped.
```

**Example 3:**
```
Input: head = [1,1,2,2]
Output: []
Explanation: Every value repeats, so nothing remains.
```

**Constraints:**
- `0 <= number of nodes <= 300`
- `-100 <= node value <= 100`
- The list is sorted in non-decreasing order.
