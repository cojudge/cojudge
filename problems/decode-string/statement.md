Given an encoded string, return its decoded string.

The encoding rule is: `k[encoded_string]`, where the `encoded_string` inside
the square brackets is being repeated exactly `k` times. Note that `k` is
guaranteed to be a positive integer.

You may assume that the input string is always valid; there are no extra white
spaces, square brackets are well-formed, etc. Furthermore, you may assume that
the original data does not contain any digits and that digits are only for
those repeat numbers, `k`.

**Constraints:**

- `1 <= s.length <= 30`
- `s` consists of lowercase English letters, digits, and square brackets `[]`.
- `s` is guaranteed to be a valid input.
- All the integers in `s` are in the range `[1, 300]`.
- The length of the output will never exceed `10^5`.
