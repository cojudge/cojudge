## Approach

Because the heads hold the most significant digits, push both lists onto stacks to reach the ones place first. Repeatedly pop one digit from each stack plus the carry, create the result digit, and prepend it to the answer. Continue until both stacks and the carry are empty.

## Complexity Analysis

- **Time Complexity:** O(m + n), where m and n are the two list lengths.
- **Space Complexity:** O(m + n) for the two stacks.

## Implementation

```python
class Solution:
    def addTwoNumbers(self, l1, l2):
        s1, s2 = [], []
        p = l1
        while p:
            s1.append(p.val)
            p = p.next
        p = l2
        while p:
            s2.append(p.val)
            p = p.next
        carry = 0
        head = None
        while s1 or s2 or carry:
            total = carry
            if s1:
                total += s1.pop()
            if s2:
                total += s2.pop()
            node = ListNode(total % 10)
            node.next = head
            head = node
            carry = total // 10
        return head
```
