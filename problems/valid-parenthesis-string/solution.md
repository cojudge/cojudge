## Approach

Track the minimum and maximum possible numbers of unmatched opening parentheses after each character. An opening parenthesis increases both bounds, a closing parenthesis decreases both, and a star decreases the minimum while increasing the maximum. Clamp the minimum at zero, reject if the maximum becomes negative, and require a final minimum of zero.

## Complexity Analysis

- **Time Complexity:** O(n), with one pass over the string.
- **Space Complexity:** O(1) auxiliary space.

## Implementation

```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        minimum_open = 0
        maximum_open = 0
        for character in s:
            if character == "(":
                minimum_open += 1
                maximum_open += 1
            elif character == ")":
                minimum_open -= 1
                maximum_open -= 1
            else:
                minimum_open -= 1
                maximum_open += 1
            if maximum_open < 0:
                return False
            minimum_open = max(minimum_open, 0)
        return minimum_open == 0
```
