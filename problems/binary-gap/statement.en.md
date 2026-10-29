You are given a positive integer `n`. Look at its binary representation without leading zeros.

Whenever the representation holds at least two `1` bits, measure the distance between every pair of neighboring `1` bits, where distance means the difference of their bit positions (equivalently, the number of steps between them). Return the largest such distance. If fewer than two `1` bits appear, return `0`.

**Constraints:**
- `1 <= n <= 10^9`
