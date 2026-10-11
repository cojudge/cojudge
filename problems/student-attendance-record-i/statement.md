You are given a string `s` recording one student's daily presence. Each character is `P` for present, `L` for late, or `A` for absent.

The student earns an award exactly when both rules hold: fewer than two absences in total, and no run of three or more consecutive lates.

Return `true` when the record qualifies, otherwise `false`.

**Example 1:**
```
Input: s = "PPALLP"
Output: true
Explanation: One absence and at most two lates in a row.
```

**Example 2:**
```
Input: s = "PPALLL"
Output: false
Explanation: Three trailing lates break the second rule.
```

**Example 3:**
```
Input: s = "AA"
Output: false
Explanation: Two absences break the first rule.
```

**Constraints:**
- `1 <= s.length <= 1000`
- Each character is `A`, `L`, or `P`
