## Approach

Walk through both reverse-order digit lists together. Add the available digits and the carry, append a node containing the ones digit, and carry the tens digit into the next position. Continue until both inputs and the final carry are exhausted.

## Complexity Analysis

- **Time Complexity:** O(max(m, n)), where `m` and `n` are the input lengths.
- **Space Complexity:** O(max(m, n)) for the returned list; the auxiliary pointer state is O(1).

## Implementation

```python
class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = ListNode(0)
        tail = dummy
        carry = 0

        while l1 is not None or l2 is not None or carry:
            total = carry
            if l1 is not None:
                total += l1.val
                l1 = l1.next
            if l2 is not None:
                total += l2.val
                l2 = l2.next

            tail.next = ListNode(total % 10)
            tail = tail.next
            carry = total // 10

        return dummy.next
```
