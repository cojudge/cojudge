## Approach

Start at the end of the string and step left past any trailing blanks to reach the final word's last letter. Then keep stepping left while the characters are non-blanks, counting them. The count is exactly the last word's length.

## Complexity Analysis

- **Time Complexity:** O(n) in the worst case, where n is the string length.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        i = len(s) - 1
        while i >= 0 and s[i] == ' ':
            i -= 1
        length = 0
        while i >= 0 and s[i] != ' ':
            length += 1
            i -= 1
        return length
```
