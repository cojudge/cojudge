## Approach

Test the IPv4 shape first: split on dots while keeping empty pieces, require exactly 4 groups, and accept only 1-3 digit groups with no leading zeroes and numeric value at most 255. Otherwise test the IPv6 shape: split on colons, require exactly 8 groups, each 1-4 hexadecimal digits. Anything failing both checks is neither.

## Complexity Analysis

- **Time Complexity:** O(n), a few linear scans over the input.
- **Space Complexity:** O(n) for the split pieces.

## Implementation

```python
class Solution:
    def validIPAddress(self, queryIP: str) -> str:
        def ipv4(ip: str) -> bool:
            g = ip.split(".")
            if len(g) != 4:
                return False
            for p in g:
                if not 1 <= len(p) <= 3 or not p.isdigit():
                    return False
                if len(p) > 1 and p[0] == "0":
                    return False
                if int(p) > 255:
                    return False
            return True

        def ipv6(ip: str) -> bool:
            g = ip.split(":")
            if len(g) != 8:
                return False
            ok = set("0123456789abcdefABCDEF")
            for p in g:
                if not 1 <= len(p) <= 4 or any(c not in ok for c in p):
                    return False
            return True

        if ipv4(queryIP):
            return "IPv4"
        if ipv6(queryIP):
            return "IPv6"
        return "Neither"
```
