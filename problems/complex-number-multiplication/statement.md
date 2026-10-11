You are given two complex numbers written as strings in the form `real+imaginaryi`, where both parts are integers (either part may be negative, e.g. `1+-1i`). Multiply the two numbers and return the product in the same `a+bi` format.

Recall that `i` squared equals `-1`, so `(a+bi) * (c+di)` equals `(a*c - b*d) + (a*d + b*c)i`.

**Example 1:**
```
Input: num1 = "1+1i", num2 = "1+1i"
Output: "0+2i"
Explanation: (1+i) times (1+i) is 1 + 2i + i^2 = 0 + 2i.
```

**Example 2:**
```
Input: num1 = "1+-1i", num2 = "1+-1i"
Output: "0+-2i"
Explanation: (1-i) times (1-i) is 1 - 2i + i^2 = 0 - 2i.
```

**Example 3:**
```
Input: num1 = "2+3i", num2 = "4+5i"
Output: "-7+22i"
Explanation: Real part 2*4-3*5 = -7; imaginary part 2*5+3*4 = 22.
```

**Constraints:**
- Each input matches `-?\d+\+-?\d+i` (an integer, `+`, an integer, `i`).
- `-100 <= real part, imaginary part <= 100`
