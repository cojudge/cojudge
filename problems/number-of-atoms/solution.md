## Approach

Walk the formula left to right while keeping a stack of frequency tables. An opening bracket pushes a new table; an element name adds its parsed count to the table on top; a closing bracket pops the table, scales every entry by the multiplier that follows, and merges it downward. At the end one table remains, which is printed with keys sorted and counts of one hidden.

## Complexity Analysis

- **Time Complexity:** O(n log m), where n is the formula length and m the number of distinct elements, dominated by the final sort.
- **Space Complexity:** O(n) for the stack of tables in deeply nested input.

## Implementation

```python
class Solution:
    def countOfAtoms(self, formula: str) -> str:
        stack = [dict()]
        i, n = 0, len(formula)
        while i < n:
            c = formula[i]
            if c == '(':
                stack.append(dict())
                i += 1
            elif c == ')':
                i += 1
                j = i
                while j < n and formula[j].isdigit():
                    j += 1
                mult = int(formula[i:j]) if j > i else 1
                i = j
                top = stack.pop()
                for k, v in top.items():
                    stack[-1][k] = stack[-1].get(k, 0) + v * mult
            else:
                j = i + 1
                while j < n and formula[j].islower():
                    j += 1
                name = formula[i:j]
                k = j
                while k < n and formula[k].isdigit():
                    k += 1
                cnt = int(formula[j:k]) if k > j else 1
                stack[-1][name] = stack[-1].get(name, 0) + cnt
                i = k
        parts = []
        for k in sorted(stack[0]):
            parts.append(k)
            if stack[0][k] > 1:
                parts.append(str(stack[0][k]))
        return "".join(parts)
```
