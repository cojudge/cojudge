You receive four cards, each showing an integer. Using the four arithmetic operators `+`, `-`, `*`, `/` and any placement of parentheses, decide whether an expression using every card exactly once can evaluate to 24.

Division is real division (not integer division). Two values that differ by less than `1e-6` are treated as equal when checking for 24; this tolerance rule is part of the task because intermediate results are doubles.

Return `true` when such an expression exists, otherwise `false`.

**Constraints:**
- `cards.length == 4`
- `1 <= cards[i] <= 9`
