You are given a short program written with nested choices. The text `expression` uses `T` for true, `F` for false, single digits `0` to `9` as plain values, and the symbols `?` and `:` to form choices shaped like `condition ? valueIfTrue : valueIfFalse`.

Choices can nest on either side, and nesting groups from the right. To find the answer, decide the rightmost choice first, replace it with its picked branch, then keep working leftward until one value remains.

Return that final value as a one-character string.

**Example 1:**
```
Input: expression = "T?2:3"
Output: "2"
Explanation: The condition is true, so the true branch 2 is picked.
```

**Example 2:**
```
Input: expression = "F?1:T?4:5"
Output: "4"
Explanation: The first condition is false, so evaluate the else part T?4:5, whose condition is true, giving 4.
```

**Example 3:**
```
Input: expression = "T?T?F:5:3"
Output: "F"
Explanation: The inner choice T?F:5 resolves to F, then the outer choice becomes T?F:3, which is F.
```

**Constraints:**
- `1 <= expression.length <= 10000`
- `expression` contains only `T`, `F`, `0`-`9`, `?` and `:`.
- `expression` is always a valid nested choice expression.
- The answer is always a single character (`T`, `F`, or a digit).
