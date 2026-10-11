Given the head of a singly linked list, reorder its nodes in non-decreasing order and return the new head.

Aim for `O(n log n)` time with `O(1)` extra space (recursion stack aside), for example via merge sort on linked lists.

**Example 1:**
```
Input: head = [4,2,1,3]
Output: [1,2,3,4]
Explanation: Sorting the values gives ascending order.
```

**Example 2:**
```
Input: head = [-1,5,3,4,0]
Output: [-1,0,3,4,5]
Explanation: The same multiset of values appears in sorted order.
```

**Example 3:**
```
Input: head = []
Output: []
Explanation: An empty list stays empty.
```

**Constraints:**
- The list holds between 0 and 5 * 10^4 nodes.
- `-10^5 <= Node.val <= 10^5`
