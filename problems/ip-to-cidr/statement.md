An IPv4 address writes a 32-bit number as four decimal groups joined by dots. A CIDR block adds a slash and a prefix length, such as `255.0.0.8/29`, meaning all addresses sharing the first 29 bits with the base.

You are given a starting address `ip` and a count `n`. Cover exactly the `n` consecutive addresses from `ip` upward with as few CIDR blocks as possible, using no address outside the range.

Return the blocks as strings in increasing address order.

**Example 1:**
```
Input: ip = "255.0.0.7", n = 10
Output: ["255.0.0.7/32","255.0.0.8/29","255.0.0.16/32"]
Explanation: One lone address, then a block of eight, then one lone address covers all ten with three blocks, which is minimal.
```

**Example 2:**
```
Input: ip = "117.145.102.62", n = 8
Output: ["117.145.102.62/31","117.145.102.64/30","117.145.102.68/31"]
Explanation: Blocks of sizes 2, 4 and 2 cover the eight addresses in order.
```

**Constraints:**
- `ip` is a valid IPv4 address.
- Every address from `ip` through `ip + n - 1` is valid.
- `1 <= n <= 1000`
