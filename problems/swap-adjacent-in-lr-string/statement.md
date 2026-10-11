In a row of slots, each slot holds one of three symbols: `L`, `R`, or `X`.
An `X` means the slot is empty. The other two symbols behave like tokens
that slide into neighboring empty slots, but only in one direction each.

In a single step you may pick one of these patterns and flip it:

- `XL` may become `LX` (the `L` token steps one slot to the left).
- `RX` may become `XR` (the `R` token steps one slot to the right).

No other change is allowed. In particular an `L` never steps right, an `R`
never steps left, and two non-empty tokens never jump over each other.

You are given two strings `start` and `end` of equal length that describe
the starting row and a desired target row. Decide whether `start` can be
turned into `end` by applying any number of the steps above.

**Example 1:**
```
Input: start = "RXXLRXRXL", end = "XRLXXRRLX"
Output: true
Explanation: There is a sequence of allowed slides that reshapes the row
from the first arrangement into the second one.
```

**Example 2:**
```
Input: start = "X", end = "L"
Output: false
Explanation: An empty slot cannot turn into a token, so the change is
impossible.
```

**Example 3:**
```
Input: start = "XL", end = "LX"
Output: true
Explanation: The single L slides one position left into the empty slot.
```

**Constraints:**
- `1 <= start.length <= 10^4`
- `start.length == end.length`
- `start` and `end` contain only characters `L`, `R`, and `X`.
