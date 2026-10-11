Given a positive integer `n`, rearrange its decimal digits into the smallest larger integer that uses exactly the same digits. If no larger arrangement exists, or if the rearranged value does not fit in a 32-bit signed integer, return `-1`.

Think of it as finding the next permutation of the digit sequence: scan from the right for the first position where a digit is smaller than its right neighbor, exchange it with the smallest bigger digit on its right, then order the trailing digits increasingly. A fully non-increasing digit sequence has no greater permutation.

**Constraints:**
- `1 <= n <= 2^31 - 1`
