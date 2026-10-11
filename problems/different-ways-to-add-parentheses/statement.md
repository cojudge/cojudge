Given a string `expression` made of non-negative integers and the operators `+`, `-`, and `*`, compute every distinct value obtainable by parenthesizing the expression in all possible ways.

Each operator can serve as the final operation to evaluate: split the string there, solve both sides recursively, and combine each left result with each right result using that operator. A string with no operator is just the number itself.

Return all possible results in any order.

*Type note:* the original signature returns a list of integers; here it maps to `int_list`.

**Example 1:**
```
Input: expression = "2-1-1"
Output: [0,2]
Explanation: (2-1)-1 gives 0, while 2-(1-1) gives 2.
```

**Example 2:**
```
Input: expression = "2*3-4*5"
Output: [-34,-14,-10,-10,10]
Explanation: Parenthesizing as 2*(3-(4*5)) gives -34, and the other groupings give -14, -10, -10, and 10.
```

**Constraints:**
- `1 <= expression.length <= 20`
- The expression holds digits and the operators `+`, `-`, `*`.
- Each number in the expression is in the range `[0, 99]` with no sign prefix.
