## Approach

Parse each spelling into integer part, non-repeating decimals, and the parenthesized repeating block. With a non-repeat of length a and a repeat of length b, the value equals integer plus nonRepeat / 10^a plus repeat / (10^a * (10^b - 1)). Scaling everything to the common denominator 10^a * (10^b - 1) gives an exact numerator using integers only. Comparing the two fractions by cross multiplication avoids any floating-point error and naturally handles cases like repeating 9s.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the spelling length. Parsing and the power computations touch only a few digits.
- **Space Complexity:** O(n) for the parsed substrings and big integers.

## Implementation

```python
class Solution:
    def isRationalEqual(self, s: str, t: str) -> bool:
        def parse(sp):
            dot = sp.find('.')
            if dot < 0:
                p = sp.find('(')
                int_part = sp if p < 0 else sp[:p]
                frac = ''
            else:
                int_part = sp[:dot] or '0'
                frac = sp[dot + 1:]
            o = frac.find('(')
            if o >= 0:
                non = frac[:o]
                rep = frac[o + 1:frac.find(')', o)]
            else:
                non, rep = frac, ''
            ip = int(int_part)
            a, b = len(non), len(rep)
            pa = 10 ** a
            if b == 0:
                num = ip if a == 0 else ip * pa + (int(non) if non else 0)
                return (num, max(pa, 1))
            pb = 10 ** b
            bm1 = pb - 1
            den = pa * bm1
            nr = int(non) if non else 0
            r = int(rep) if rep else 0
            num = ip * den + nr * bm1 + r
            return (num, den)
        n1, d1 = parse(s)
        n2, d2 = parse(t)
        return n1 * d2 == n2 * d1
```
