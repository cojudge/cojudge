A singly linked list `head` contains unique values. One of its nodes holds the value `val`, and that node is guaranteed not to be the last node.

Remove the node holding `val` from the list while keeping the relative order of all other nodes, then return the head of the updated list.

*Adaptation note:* the original statement hands you only the node to delete and asks for an in-place `void` update. Here the function receives the list head plus the target value `val` and returns the list head after deletion, which lets the judge check the result directly. The reference technique is the same: copy the next node's value over the target and skip the next node.

**Example 1:**
```
Input: head = [4,5,1,9], val = 5
Output: [4,1,9]
Explanation: The node holding 5 is removed; the remaining order is unchanged.
```

**Example 2:**
```
Input: head = [4,5,1,9], val = 1
Output: [4,5,9]
Explanation: The node holding 1 is removed; the remaining order is unchanged.
```

**Constraints:**
- The number of nodes is in the range `[2, 1000]`.
- `-1000 <= Node.val <= 1000`
- Every value in the list is unique.
- The value `val` exists in the list and is not the tail value.
