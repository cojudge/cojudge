You are given the head of a singly linked list and an integer `val`. Unlink every node whose value equals `val` and return the head of what remains. If every node is removed, return an empty list.

The list is supplied in the form `[v0,v1,...]` and an answer is expected in the same form.

**Example 1:**
```
Input: head = [1,2,6,3,4,5,6], val = 6
Output: [1,2,3,4,5]
Explanation: Both nodes holding 6 are skipped; the remaining nodes keep their order.
```

**Example 2:**
```
Input: head = [], val = 1
Output: []
Explanation: There is nothing to filter.
```

**Example 3:**
```
Input: head = [7,7,7,7], val = 7
Output: []
Explanation: Every node matches, so nothing remains.
```

**Constraints:**
- The list holds between 0 and `10^4` nodes.
- `0 <= node value <= 50`
- `0 <= val <= 50`
