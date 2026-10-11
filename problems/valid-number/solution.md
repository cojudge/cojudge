## Approach

Strip outer blanks, then split the remainder at most once on `e`/`E`. The tail must be a signed integer with at least one digit, while the head must be either a signed integer or a signed decimal containing exactly one dot and at least one digit somewhere. Any other character or misplaced blank fails validation.

## Complexity Analysis

- **Time Complexity:** O(n), a few linear scans of the string.
- **Space Complexity:** O(n) for the trimmed copy and split parts.

## Implementation

```python
class Solution:
    def isNumber(self, s: str) -> bool:
        t = s.strip()
        if not t:
            return False
        epos = -1
        for i, c in enumerate(t):
            if c in "eE":
                if epos != -1:
                    return False
                epos = i
        def is_int(part: str) -> bool:
            if not part:
                return False
            i = 0
            if part[0] in "+-":
                if len(part) == 1:
                    return False
                i = 1
            return all(ch.isdigit() for ch in part[i:]) and i < len(part)
        def is_dec(part: str) -> bool:
            if not part:
                return False
            i = 0
            if part[0] in "+-":
                if len(part) == 1:
                    return False
                i = 1
            has_digit = False
            has_dot = False
            for ch in part[i:]:
                if ch == ".":
                    if has_dot:
                        return False
                    has_dot = True
                elif ch.isdigit():
                    has_digit = True
                else:
                    return False
            return has_digit and has_dot
        if epos == -1:
            return is_int(t) or is_dec(t)
        base, exp = t[:epos], t[epos + 1:]
        if not base or not exp:
            return False
        return (is_int(base) or is_dec(base)) and is_int(exp)
```
