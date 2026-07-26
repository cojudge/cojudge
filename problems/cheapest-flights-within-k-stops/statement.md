There are `n` cities labeled from `0` to `n - 1`. Each directed flight
`flights[i] = [from, to, price]` has the given ticket price.

Return the cheapest price for a route from `src` to `dst` that uses at most
`k` intermediate stops. Return `-1` if no such route exists.

**Constraints:**

- `2 <= n <= 100`
- `0 <= flights.length <= n * (n - 1) / 2`
- `flights[i].length == 3`
- `0 <= from, to, src, dst < n`
- `from != to` and `src != dst`
- `1 <= price <= 10^4`
- `0 <= k < n`
- There are no duplicate directed flights.
