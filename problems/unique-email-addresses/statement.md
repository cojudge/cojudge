Each email address has the form `local@domain`. The domain part is used exactly as written. The local part follows two rules: dots `'.'` are skipped entirely, and anything after the first `'+'` is discarded.

Two addresses that normalize to the same string count as one. Given a list `emails`, return how many distinct normalized addresses appear.

**Constraints:**
- `1 <= emails.length <= 100`
- Each address contains exactly one `'@'`, lowercase letters, `'.'`, `'+'`, and digits in the local part.
