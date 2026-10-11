Houses and heaters sit at integer spots on a single line. Every heater warms the interval centered on it with some shared radius `r`: a house at `h` is warm when some heater at `t` satisfies `|h - t| <= r`. All heaters must use the same radius.

Find the smallest radius that leaves every house warm.

**Constraints:**

- `1 <= houses.length, heaters.length <= 3 * 10^4`
- `1 <= houses[i], heaters[i] <= 10^9`
