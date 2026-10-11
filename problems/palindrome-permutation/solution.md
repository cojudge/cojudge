## Approach

A palindrome mirrors its characters, so at most one character may appear an odd number of times. Toggle each character in a set: adding the first occurrence and removing the second leaves exactly the odd-count characters. The string can be rearranged into a palindrome when at most one entry remains.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`.
- **Space Complexity:** O(1) distinct characters besides the input.

## Implementation

```python
class Solution:
    def canPermutePalindrome(self, s: str) -> bool:
        odd = set()
        for c in s:
            if c in odd:
                odd.remove(c)
            else:
                odd.add(c)
        return len(odd) <= 1
```
