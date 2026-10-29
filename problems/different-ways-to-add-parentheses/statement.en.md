Given a string `expression` made of non-negative integers and the operators `+`, `-`, and `*`, compute every distinct value obtainable by parenthesizing the expression in all possible ways.

Each operator can serve as the final operation to evaluate: split the string there, solve both sides recursively, and combine each left result with each right result using that operator. A string with no operator is just the number itself.

Return all possible results in any order.

*Type note:* the original signature returns a list of integers; here it maps to `int_list`.

**Constraints:**
- `1 <= expression.length <= 20`
- The expression holds digits and the operators `+`, `-`, `*`.
- Each number in the expression is in the range `[0, 99]` with no sign prefix.
