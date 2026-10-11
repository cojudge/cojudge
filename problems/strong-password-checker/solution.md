## Approach

Count missing classes (lower, upper, digit) and collect lengths of runs with three or more equal neighbours. Short strings need insertions covering both length and classes. Medium strings trade replacements against missing classes. Long strings must delete down to 20; deletions are spent where they save the most replacements first (runs with remainder 0, then 1, then 2), and the remainder combines deletions with the larger of missing classes and leftover replacements.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the password length.
- **Space Complexity:** O(n) worst case for run storage, O(1) otherwise.

## Implementation

```python
class Solution:
    def strongPasswordChecker(self, password: str) -> int:
        n = len(password)
        lower = any("a" <= c <= "z" for c in password)
        upper = any("A" <= c <= "Z" for c in password)
        digit = any("0" <= c <= "9" for c in password)
        missing = (0 if lower else 1) + (0 if upper else 1) + (0 if digit else 1)
        runs = []
        i = 0
        while i < n:
            j = i
            while j < n and password[j] == password[i]:
                j += 1
            if j - i >= 3:
                runs.append(j - i)
            i = j
        if n < 6:
            return max(missing, 6 - n)
        replace = sum(l // 3 for l in runs)
        if n <= 20:
            return max(missing, replace)
        delete = n - 20
        left = delete
        runs.sort(key=lambda x: x % 3)
        for k in range(len(runs)):
            if left <= 0:
                break
            ln = runs[k]
            if ln < 3:
                continue
            need = 1 if ln % 3 == 0 else (2 if ln % 3 == 1 else 3)
            use = min(need, min(left, ln - 2))
            runs[k] -= use
            left -= use
        replace = sum(l // 3 for l in runs)
        replace -= left // 3
        if replace < 0:
            replace = 0
        return delete + max(missing, replace)
```
