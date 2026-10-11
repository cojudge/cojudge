Seven distinct glyphs encode Roman numerals: `I`, `V`, `X`, `L`, `C`, `D` and `M`.

```
Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
```

For instance, `2` appears as `II` in Roman notation — two ones tallied together. `12` appears as `XII`, namely `X + II`. The value `27` appears as `XXVII`, namely `XX + V + II`.

Ordinarily Roman glyphs run from the greatest value down to the least when read left to right. The value four breaks that pattern: rather than `IIII`, four is penned `IV`. Setting the one ahead of the five signals a subtraction that yields four. Nine follows the same device and is penned `IX`. Subtraction shows up in six pairings:

- A leading `I` ahead of `V` (5) and `X` (10) produces 4 and 9.
- A leading `X` ahead of `L` (50) and `C` (100) produces 40 and 90.
- A leading `C` ahead of `D` (500) and `M` (1000) produces 400 and 900.

Translate a supplied Roman numeral into its integer value.

**Examples:**

```
Input: s = "III"
Output: 3
Explanation: III = 3.
```

```
Input: s = "LVIII"
Output: 58
Explanation: L = 50, V = 5, III = 3.
```

```
Input: s = "MCMXCIV"
Output: 1994
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
```

**Constraints:**

- `1 <= s.length <= 15`
- `s` contains only the characters `('I', 'V', 'X', 'L', 'C', 'D', 'M')`.
- It is guaranteed that `s` is a valid roman numeral in the range `[1, 3999]`.
