You are given an arithmetic `expression` built from non-negative integers, lowercase-letter variables (possibly several letters long), parentheses, and the operators `+`, `-`, `*`. Chunks and operators are separated by spaces, and the usual precedence applies: parentheses first, then multiplication, then addition and subtraction.

Two companion arrays describe known variables: `evalvars[k]` names a variable and `evalints[k]` gives its integer value. Every other variable stays free.

Evaluate the expression, substituting the known variables, and return the simplified polynomial as a list of strings with this portable layout:

- Each non-constant term is written `coefficient*var1*var2*...` with its free variables in lexicographic order (repeats kept, e.g. `a*a*b`). A coefficient of `1` or `-1` is still printed (`1*a`, `-1*a`).
- A constant term is written as just its coefficient.
- Terms with a zero coefficient are dropped; an all-zero result is the empty list `[]`.
- Order terms by descending degree (variable count), breaking ties by lexicographic order of the variable part.

This judge has no floating or map types, so the expression travels as a plain string and the answer travels as a string list (`string_list`); known values travel as a string array plus an integer array.

**Example 1:**
```
Input: expression = "e + 8 - a + 5", evalvars = ["e"], evalints = [1]
Output: ["-1*a","14"]
Explanation: e becomes 1, leaving 14 - a, ordered as the degree-1 term then the constant.
```

**Example 2:**
```
Input: expression = "e - 8 + temperature - pressure", evalvars = ["e","temperature"], evalints = [1,12]
Output: ["-1*pressure","5"]
Explanation: 1 - 8 + 12 - pressure simplifies to 5 - pressure.
```

**Example 3:**
```
Input: expression = "(e + 8) * (e - 8)", evalvars = [], evalints = []
Output: ["1*e*e","-64"]
Explanation: The product expands to e*e - 64.
```

**Constraints:**
- `1 <= expression.length <= 200`
- `expression` is valid and uses only digits, lowercase letters, `+`, `-`, `*`, `(`, `)`, and spaces
- `0 <= evalvars.length <= 100`, `evalvars.length == evalints.length`
- Each `evalvars[i]` holds 1+ lowercase letters; all names are distinct
- `-10^4 <= evalints[i] <= 10^4`
- All intermediate values fit in a signed 32-bit integer
