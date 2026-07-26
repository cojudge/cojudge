Evaluate an arithmetic expression written in Reverse Polish Notation and return
its integer value.

Each token is either an integer or one of the operators `+`, `-`, `*`, and `/`.
Division between two integers truncates toward zero. The expression is always
valid, and no division by zero occurs.

**Constraints:**

- `1 <= tokens.length <= 10000`
- Every numeric token represents an integer in the range `[-200, 200]`.
- Every intermediate result and the final answer fit in a signed 32-bit integer.
