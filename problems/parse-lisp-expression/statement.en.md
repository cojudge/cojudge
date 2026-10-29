You are given a string holding an expression from a tiny Lisp-like language. The language has integers (possibly negative) and three forms, each wrapped in parentheses with space-separated tokens:

- `(add e1 e2)` evaluates both parts and returns their sum.
- `(mult e1 e2)` evaluates both parts and returns their product.
- `(let v1 e1 v2 e2 ... expr)` assigns values to variables in order, then evaluates the final `expr`. A variable name holds lowercase letters; later assignments to the same name hide earlier ones, and assignments made inside an inner `let` do not leak outward.

Variable lookup always uses the nearest enclosing assignment. The input expression is guaranteed valid and evaluates to an integer.

Implement `evaluate(expression)`, which takes the expression string and returns its integer value.

**Constraints:**
- `1 <= expression.length <= 2000`
- Tokens are `(`, `)`, lowercase variable names, integers (with optional `-`), `add`, `mult`, `let`, separated by single spaces.
- The expression is well-formed with balanced parentheses.
