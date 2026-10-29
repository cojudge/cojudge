The count-and-say sequence builds each term by reading aloud the previous one: start with `"1"`, and obtain every later term by replacing each maximal run of equal digits with the run's length followed by the digit itself. For instance, `"3322251"` is read as two `3`s, three `2`s, one `5`, and one `1`, giving `"23321511"`.

Formally, `countAndSay(1) = "1"`, and `countAndSay(n)` is the run-length encoding of `countAndSay(n - 1)`.

Given `n`, return the nth term.

**Constraints:**
- `1 <= n <= 30`
