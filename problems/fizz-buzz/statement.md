Count from `1` to `n`, writing a label for each position. Positions divisible by both `3` and `5` become `"FizzBuzz"`, those divisible only by `3` become `"Fizz"`, those divisible only by `5` become `"Buzz"`, and every other position becomes its own number as a string.

Return the labels in order as a list.

**Example 1:**
```
Input: n = 3
Output: ["1","2","Fizz"]
```

**Example 2:**
```
Input: n = 5
Output: ["1","2","Fizz","4","Buzz"]
```

**Example 3:**
```
Input: n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

**Constraints:**
- `1 <= n <= 10^4`

**Adaptation note:** The original return type is a list of strings; here it maps to `string_list` with identical contents.
