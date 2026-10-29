Write down the integer `x` several times in a row, placing one operator — `+`, `-`, `*` or `/` — between each pair of neighbours, forming one flat chain with no parentheses anywhere. The chain is scored by evaluating it with the usual precedence (multiplication and division before addition and subtraction); division produces exact rational values, and a leading minus sign is forbidden.

Using as few operators as possible, build a chain whose value equals `target`, and return that smallest operator count.

**Constraints:**
- `2 <= x <= 100`
- `1 <= target <= 10^9`
