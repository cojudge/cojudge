## Approach

Addition without `+` or `-` can be done entirely with bitwise operations:

- **XOR** (`a ^ b`) computes the sum of each bit *without* considering carries — it's like adding binary digits where `1+1 = 0` with a carry of `1` that gets lost.
- **AND with left shift** (`(a & b) << 1`) computes the *carry* — bits where both operands are `1` produce a carry that must be added to the next higher bit.

The process repeats, adding the carry back to the sum, until no carry remains (`b == 0`). This naturally bottoms out because each iteration shifts the carry left, eventually making it zero.

In languages with fixed-width integers (e.g., Go's `int`, Java's `int`), a recursive version is clean and intuitive: the base case `b == 0` returns `a`, and the recursive call adds the carry to the sum.

Python's unbounded integers require an extra 32-bit mask to simulate fixed-width overflow, which obscures the core idea.

## Complexity Analysis

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        while b:
            a, b = (a ^ b) & mask, ((a & b) << 1) & mask
        return a if a < 0x80000000 else ~(a ^ mask)
```

```go
func GetSum(a int, b int) int {
    if b == 0 {
        return a
    }
    sum := a ^ b
    carry := (a & b) << 1
    return GetSum(sum, carry)
}
```
