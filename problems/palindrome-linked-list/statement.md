Given the head of a singly linked list, decide whether the sequence of values reads the same forward and backward.

A list is a palindrome when reversing it leaves the value order unchanged. An empty list counts as a palindrome, and a single-node list is trivially one.

Return `true` when the list is a palindrome, otherwise return `false`.

**Example 1:**
```
Input: head = [1,2,2,1]
Output: true
Explanation: The values read identically from either end.
```

**Example 2:**
```
Input: head = [1,2]
Output: false
Explanation: Reading backward gives [2,1], which differs.
```

**Constraints:**
- The number of nodes is in the range `[0, 10^5]`.
- `0 <= Node.val <= 9`
