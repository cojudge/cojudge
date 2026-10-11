## Approach

Collect the node values into an array during one forward pass. Then compare the array from the outside in with two pointers: the first and last values must match, then the second and second-to-last, and so on. Any mismatch means the list is not a palindrome.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each value is visited a constant number of times.
- **Space Complexity:** O(n) for the copied values.

## Implementation

```python
class Solution:
    def isPalindrome(self, head) -> bool:
        vals = []
        cur = head
        while cur:
            vals.append(cur.val)
            cur = cur.next
        i, j = 0, len(vals) - 1
        while i < j:
            if vals[i] != vals[j]:
                return False
            i += 1
            j -= 1
        return True
```
