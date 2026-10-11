## Approach

Branch on the presence of '@'. Emails are lowercased, then rebuilt from the first name character, five stars, the last name character, and the unchanged (lowercased) domain. Phone numbers are reduced to their digits; the last four stay visible behind a fixed "***-***-" mask, with a '+' plus one star per digit beyond ten prepended for country codes.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the input length.
- **Space Complexity:** O(n) for the digit buffer and the result.

## Implementation

```python
class Solution:
    def maskPII(self, s: str) -> str:
        if "@" in s:
            low = s.lower()
            name, domain = low.split("@")
            return name[0] + "*****" + name[-1] + "@" + domain
        digits = "".join(c for c in s if c.isdigit())
        last4 = digits[-4:]
        if len(digits) == 10:
            return "***-***-" + last4
        return "+" + "*" * (len(digits) - 10) + "-***-***-" + last4
```
