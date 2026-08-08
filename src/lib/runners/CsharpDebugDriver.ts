export const CSHARP_DEBUG_SUPPORT: string = String.raw`using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;

public static class DebugSupport
{
    private static HashSet<int> breakpoints = new HashSet<int>();
    private static bool stepMode = false;
    private static string STATE_FILE = "/tmp/cojudge_debug_state.json";
    private static string CMD_FILE = "/tmp/cojudge_debug_cmd.json";
    private static string EVAL_RESULT_FILE = "/tmp/cojudge_eval_result.json";
    private static StringWriter outputCapture = new StringWriter();
    private static TextWriter originalOut;

    static DebugSupport()
    {
        originalOut = Console.Out;
        Console.SetOut(outputCapture);
    }

    public static void Init(string bpStr)
    {
        if (!string.IsNullOrEmpty(bpStr))
        {
            foreach (var s in bpStr.Split(','))
            {
                if (int.TryParse(s.Trim(), out int line))
                    breakpoints.Add(line);
            }
        }
        WriteState("running", -1, null, null);
    }

    public static void Check(int line, Dictionary<string, object> vars)
    {
        PollCommands();

        if (stepMode || breakpoints.Contains(line))
        {
            stepMode = false;
            Pause(line, vars);
        }
    }

    private static void PollCommands()
    {
        try
        {
            if (!File.Exists(CMD_FILE)) return;
            string content = File.ReadAllText(CMD_FILE).Trim();
            if (string.IsNullOrEmpty(content)) return;
            File.Delete(CMD_FILE);

            string action = ParseAction(content);

            if (action == "set_breakpoints")
            {
                breakpoints.Clear();
                int bi = content.IndexOf("\"breakpoints\"", StringComparison.Ordinal);
                if (bi >= 0)
                {
                    int lb = content.IndexOf('[', bi);
                    int rb = content.IndexOf(']', lb);
                    if (lb >= 0 && rb > lb)
                    {
                        string inner = content.Substring(lb + 1, rb - lb - 1).Trim();
                        if (!string.IsNullOrEmpty(inner))
                        {
                            foreach (var p in inner.Split(','))
                            {
                                if (int.TryParse(p.Trim().Trim('"'), out int bp))
                                    breakpoints.Add(bp);
                            }
                        }
                    }
                }
            }
        }
        catch { }
    }

    private static void Pause(int line, Dictionary<string, object> vars)
    {
        WriteState("paused", line, null, RenderDict(vars));

        while (true)
        {
            try
            {
                if (!File.Exists(CMD_FILE))
                {
                    Thread.Sleep(100);
                    continue;
                }

                string content = File.ReadAllText(CMD_FILE).Trim();
                if (string.IsNullOrEmpty(content))
                {
                    Thread.Sleep(100);
                    continue;
                }
                File.Delete(CMD_FILE);

                string action = ParseAction(content);

                if (action == "set_breakpoints")
                {
                    breakpoints.Clear();
                    int bi = content.IndexOf("\"breakpoints\"", StringComparison.Ordinal);
                    if (bi >= 0)
                    {
                        int lb = content.IndexOf('[', bi);
                        int rb = content.IndexOf(']', lb);
                        if (lb >= 0 && rb > lb)
                        {
                            string inner = content.Substring(lb + 1, rb - lb - 1).Trim();
                            if (!string.IsNullOrEmpty(inner))
                            {
                                foreach (var p in inner.Split(','))
                                {
                                    if (int.TryParse(p.Trim().Trim('"'), out int bp))
                                        breakpoints.Add(bp);
                                }
                            }
                        }
                    }
                    WriteState("paused", line, null, RenderDict(vars));
                    continue;
                }

                if (action == "eval")
                {
                    string expr = GetJsonString(content, "expression");
                    try
                    {
                        object result = ExprEvaluator.Evaluate(expr, vars);
                        WriteEvalResult(RenderValue(result), null);
                    }
                    catch (Exception e)
                    {
                        WriteEvalResult(null, e.Message);
                    }
                    continue;
                }

                if (action == "step")
                {
                    stepMode = true;
                    return;
                }
                if (action == "continue")
                {
                    return;
                }
                if (action == "stop")
                {
                    WriteState("stopped", -1, null, null);
                    Environment.Exit(0);
                }
            }
            catch
            {
                Thread.Sleep(100);
            }
        }
    }

    private static string GetJsonString(string json, string key)
    {
        int ki = json.IndexOf("\"" + key + "\"", StringComparison.Ordinal);
        if (ki < 0) return "";
        int ci = json.IndexOf(':', ki);
        if (ci < 0) return "";
        int q1 = json.IndexOf('"', ci);
        if (q1 < 0) return "";
        var sb = new StringBuilder();
        int i = q1 + 1;
        while (i < json.Length)
        {
            char c = json[i];
            if (c == '\\')
            {
                if (i + 1 >= json.Length) break;
                char e = json[i + 1];
                switch (e)
                {
                    case '"': sb.Append('"'); break;
                    case '\\': sb.Append('\\'); break;
                    case 'n': sb.Append('\n'); break;
                    case 't': sb.Append('\t'); break;
                    case 'r': sb.Append('\r'); break;
                    default: sb.Append(e); break;
                }
                i += 2;
            }
            else if (c == '"')
            {
                return sb.ToString();
            }
            else
            {
                sb.Append(c);
                i++;
            }
        }
        return sb.ToString();
    }

    private static Dictionary<string, string> RenderDict(Dictionary<string, object> vars)
    {
        var rendered = new Dictionary<string, string>();
        if (vars == null) return rendered;
        foreach (var kv in vars)
        {
            rendered[kv.Key] = RenderValue(kv.Value);
        }
        return rendered;
    }

    private static void WriteEvalResult(string value, string error)
    {
        var sb = new StringBuilder();
        sb.Append("{");
        if (error != null)
        {
            sb.Append("\"error\":\"").Append(EscapeJson(error)).Append("\"");
        }
        else
        {
            sb.Append("\"value\":\"").Append(EscapeJson(value ?? "null")).Append("\"");
        }
        sb.Append("}");
        try { File.WriteAllText(EVAL_RESULT_FILE, sb.ToString()); } catch { }
    }

    private static string ParseAction(string json)
    {
        int ai = json.IndexOf("\"action\"", StringComparison.Ordinal);
        if (ai < 0) return "";
        int ci = json.IndexOf(':', ai);
        if (ci < 0) return "";
        int q1 = json.IndexOf('"', ci + 1);
        if (q1 < 0) return "";
        int q2 = json.IndexOf('"', q1 + 1);
        if (q2 < 0) return "";
        return json.Substring(q1 + 1, q2 - q1 - 1);
    }

    public static string RenderValue(object val)
    {
        if (val == null) return "null";
        try { return RenderRecursive(val, 0); } catch { return "<error>"; }
    }

    public static string RenderRecursive(object val, int depth)
    {
        if (val == null) return "null";
        if (depth > 2) return "[...]";

        var t = val.GetType();
        if (t.IsPrimitive || t == typeof(string) || t == typeof(decimal))
        {
            if (t == typeof(string)) return "\"" + EscapeDisplay(val.ToString()) + "\"";
            if (t == typeof(bool)) return val.ToString().ToLower();
            return val.ToString();
        }

        if (t.IsArray)
        {
            var arr = (Array)val;
            int len = arr.Length;
            int limit = len < 100 ? len : 100;
            var sb = new StringBuilder("[");
            for (int i = 0; i < limit; i++)
            {
                if (i > 0) sb.Append(", ");
                sb.Append(RenderRecursive(arr.GetValue(i), depth + 1));
            }
            if (len > limit) sb.Append(", ...");
            sb.Append("]");
            return sb.ToString();
        }

        if (t.IsGenericType)
        {
            var genDef = t.GetGenericTypeDefinition();
            if (genDef == typeof(List<>))
            {
                var count = t.GetProperty("Count")?.GetValue(val) ?? 0;
                var items = (IEnumerable)val;
                int limit = (int)count < 100 ? (int)count : 100;
                var sb = new StringBuilder("[");
                int i = 0;
                foreach (var item in items)
                {
                    if (i >= limit) break;
                    if (i > 0) sb.Append(", ");
                    sb.Append(RenderRecursive(item, depth + 1));
                    i++;
                }
                if ((int)count > limit) sb.Append(", ...");
                sb.Append("]");
                return sb.ToString();
            }

            if (genDef == typeof(Dictionary<,>))
            {
                var dict = (IDictionary)val;
                var sb = new StringBuilder("{");
                bool first = true;
                foreach (var key in dict.Keys)
                {
                    if (!first) sb.Append(", ");
                    first = false;
                    sb.Append(RenderRecursive(key, depth + 1)).Append(": ");
                    sb.Append(RenderRecursive(dict[key], depth + 1));
                }
                sb.Append("}");
                return sb.ToString();
            }

            if (genDef == typeof(HashSet<>))
            {
                var count = t.GetProperty("Count")?.GetValue(val) ?? 0;
                var items = (IEnumerable)val;
                int limit = (int)count < 100 ? (int)count : 100;
                var sb = new StringBuilder("[");
                int i = 0;
                foreach (var item in items)
                {
                    if (i >= limit) break;
                    if (i > 0) sb.Append(", ");
                    sb.Append(RenderRecursive(item, depth + 1));
                    i++;
                }
                if ((int)count > limit) sb.Append(", ...");
                sb.Append("]");
                return sb.ToString();
            }

            if (genDef == typeof(Stack<>))
            {
                var items = (IEnumerable)val;
                var sb = new StringBuilder("[");
                bool first = true;
                foreach (var item in items)
                {
                    if (!first) sb.Append(", ");
                    first = false;
                    sb.Append(RenderRecursive(item, depth + 1));
                }
                sb.Append("]");
                return sb.ToString();
            }

            if (genDef == typeof(Queue<>))
            {
                var items = (IEnumerable)val;
                var sb = new StringBuilder("[");
                bool first = true;
                foreach (var item in items)
                {
                    if (!first) sb.Append(", ");
                    first = false;
                    sb.Append(RenderRecursive(item, depth + 1));
                }
                sb.Append("]");
                return sb.ToString();
            }
        }

        return "<" + t.Name + ">";
    }

    private static string EscapeDisplay(string s)
    {
        if (s == null) return "";
        return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r").Replace("\t", "\\t");
    }

    private static void WriteState(string status, int line, string error, Dictionary<string, string> vars)
    {
        var sb = new StringBuilder();
        sb.Append("{\"status\":\"");
        sb.Append(EscapeJson(status)).Append("\"");
        if (line >= 0) sb.Append(",\"line\":").Append(line);
        sb.Append(",\"output\":\"");
        sb.Append(EscapeJson(outputCapture.ToString())).Append("\"");
        if (vars != null && vars.Count > 0)
        {
            sb.Append(",\"vars\":{");
            bool first = true;
            foreach (var kv in vars)
            {
                if (!first) sb.Append(",");
                first = false;
                sb.Append("\"").Append(EscapeJson(kv.Key)).Append("\":\"").Append(EscapeJson(kv.Value)).Append("\"");
            }
            sb.Append("}");
        }
        if (error != null) sb.Append(",\"error\":\"").Append(EscapeJson(error)).Append("\"");
        sb.Append("}");
        try
        {
            string tmp = STATE_FILE + ".tmp";
            File.WriteAllText(tmp, sb.ToString());
            File.Move(tmp, STATE_FILE, true);
        }
        catch { }
    }

    private static string EscapeJson(string s)
    {
        if (s == null) return "";
        var sb = new StringBuilder();
        foreach (char c in s)
        {
            switch (c)
            {
                case '\\': sb.Append("\\\\"); break;
                case '"': sb.Append("\\\""); break;
                case '\n': sb.Append("\\n"); break;
                case '\r': sb.Append("\\r"); break;
                case '\t': sb.Append("\\t"); break;
                default:
                    if (c < 0x20) sb.Append(string.Format("\\u{0:x4}", (int)c));
                    else sb.Append(c);
                    break;
            }
        }
        return sb.ToString();
    }

    public static void ReportError(string message)
    {
        WriteState("error", -1, message, null);
    }

    public static void ReportCompleted()
    {
        WriteState("completed", -1, null, null);
    }
}

public static class ExprEvaluator
{
    public static object Evaluate(string expr, Dictionary<string, object> vars)
    {
        var p = new Parser(expr, vars);
        object v = p.ParseExpression();
        if (!p.AtEnd) throw new InvalidOperationException("Unexpected token at position " + p.Pos);
        return v;
    }

    private class Parser
    {
        private readonly string s;
        private readonly Dictionary<string, object> vars;
        private int pos;

        public Parser(string s, Dictionary<string, object> vars) { this.s = s; this.vars = vars; }

        public int Pos { get { SkipWs(); return pos; } }

        private char Cur { get { SkipWs(); return pos < s.Length ? s[pos] : '\0'; } }
        private char Peek(int off) { return pos + off < s.Length ? s[pos + off] : '\0'; }

        public bool AtEnd { get { SkipWs(); return pos >= s.Length; } }

        private void SkipWs() { while (pos < s.Length && char.IsWhiteSpace(s[pos])) pos++; }

        public object ParseExpression() { return ParseOr(); }

        private object ParseOr()
        {
            object a = ParseAnd();
            while (Cur == '|' && Peek(1) == '|')
            {
                pos += 2;
                object b = ParseAnd();
                a = (bool)a || (bool)b;
            }
            return a;
        }

        private object ParseAnd()
        {
            object a = ParseEquality();
            while (Cur == '&' && Peek(1) == '&')
            {
                pos += 2;
                object b = ParseEquality();
                a = (bool)a && (bool)b;
            }
            return a;
        }

        private object ParseEquality()
        {
            object a = ParseRelational();
            while (true)
            {
                string op = null;
                if (Cur == '=' && Peek(1) == '=') op = "==";
                else if (Cur == '!' && Peek(1) == '=') op = "!=";
                if (op == null) return a;
                pos += 2;
                object b = ParseRelational();
                a = Compare(a, b, op);
            }
        }

        private object ParseRelational()
        {
            object a = ParseAdditive();
            while (true)
            {
                string op = null;
                char c = Cur;
                if (c == '<' && Peek(1) == '=') op = "<=";
                else if (c == '>' && Peek(1) == '=') op = ">=";
                else if (c == '<') op = "<";
                else if (c == '>') op = ">";
                if (op == null) return a;
                pos += op.Length;
                object b = ParseAdditive();
                a = Compare(a, b, op);
            }
        }

        private object ParseAdditive()
        {
            object a = ParseMultiplicative();
            while (true)
            {
                char c = Cur;
                if (c != '+' && c != '-') return a;
                pos++;
                object b = ParseMultiplicative();
                a = Arith(c, a, b);
            }
        }

        private object ParseMultiplicative()
        {
            object a = ParseUnary();
            while (true)
            {
                char c = Cur;
                if (c != '*' && c != '/' && c != '%') return a;
                pos++;
                object b = ParseUnary();
                a = Arith(c, a, b);
            }
        }

        private object ParseUnary()
        {
            char c = Cur;
            if (c == '-')
            {
                pos++;
                object v = ParseUnary();
                if (v == null) throw new InvalidOperationException("Unary '-' on null");
                if (v is string) throw new InvalidOperationException("Unary '-' on string");
                if (v is bool) throw new InvalidOperationException("Unary '-' on bool");
                return -((dynamic)v);
            }
            if (c == '+') { pos++; return ParseUnary(); }
            if (c == '!')
            {
                pos++;
                object v = ParseUnary();
                if (v == null || !(v is bool)) throw new InvalidOperationException("'!' requires a boolean operand");
                return !(bool)v;
            }
            return ParsePostfix();
        }

        private object ParsePostfix()
        {
            object v = ParsePrimary();
            while (true)
            {
                SkipWs();
                if (pos < s.Length && s[pos] == '[')
                {
                    pos++;
                    object idx = ParseExpression();
                    if (Cur != ']') throw new InvalidOperationException("Expected ']'");
                    pos++;
                    v = Index(v, idx);
                }
                else if (pos < s.Length && s[pos] == '.')
                {
                    pos++;
                    SkipWs();
                    string name = ReadIdent();
                    SkipWs();
                    if (pos < s.Length && s[pos] == '(')
                    {
                        pos++;
                        var args = new List<object>();
                        SkipWs();
                        if (Cur != ')')
                        {
                            args.Add(ParseExpression());
                            while (Cur == ',') { pos++; args.Add(ParseExpression()); }
                        }
                        if (Cur != ')') throw new InvalidOperationException("Expected ')'");
                        pos++;
                        v = Invoke(v, name, args);
                    }
                    else
                    {
                        v = Member(v, name);
                    }
                }
                else
                {
                    return v;
                }
            }
        }

        private object ParsePrimary()
        {
            SkipWs();
            if (pos >= s.Length) throw new InvalidOperationException("Unexpected end of expression");
            char c = s[pos];
            if (c == '(')
            {
                pos++;
                object v = ParseExpression();
                if (Cur != ')') throw new InvalidOperationException("Expected ')'");
                pos++;
                return v;
            }
            if (c == '"') return ParseString();
            if (char.IsDigit(c)) return ParseNumber();
            if (char.IsLetter(c) || c == '_')
            {
                string name = ReadIdent();
                switch (name)
                {
                    case "true": return true;
                    case "false": return false;
                    case "null": return null;
                }
                if (vars != null && vars.TryGetValue(name, out object val))
                    return val;
                Type t = FindType(name);
                if (t != null) return t;
                throw new InvalidOperationException("Unknown identifier '" + name + "'");
            }
            throw new InvalidOperationException("Unexpected character '" + c + "' at position " + pos);
        }

        private static readonly Dictionary<string, Type> typeCache = new Dictionary<string, Type>();

        private static Type FindType(string name)
        {
            if (typeCache.TryGetValue(name, out Type cached)) return cached;
            switch (name)
            {
                case "int": return typeof(int);
                case "long": return typeof(long);
                case "double": return typeof(double);
                case "float": return typeof(float);
                case "decimal": return typeof(decimal);
                case "short": return typeof(short);
                case "byte": return typeof(byte);
                case "sbyte": return typeof(sbyte);
                case "char": return typeof(char);
                case "bool": return typeof(bool);
                case "string": return typeof(string);
                case "object": return typeof(object);
                case "uint": return typeof(uint);
                case "ulong": return typeof(ulong);
                case "ushort": return typeof(ushort);
            }
            Type t = Type.GetType("System." + name);
            if (t != null) { typeCache[name] = t; return t; }
            foreach (var asm in AppDomain.CurrentDomain.GetAssemblies())
            {
                if (asm.IsDynamic) continue;
                Type[] types;
                try { types = asm.GetExportedTypes(); }
                catch { continue; }
                foreach (var ty in types)
                {
                    if (ty.IsPublic && ty.Name == name)
                    {
                        typeCache[name] = ty;
                        return ty;
                    }
                }
            }
            return null;
        }

        private string ReadIdent()
        {
            SkipWs();
            int start = pos;
            while (pos < s.Length && (char.IsLetterOrDigit(s[pos]) || s[pos] == '_')) pos++;
            if (pos == start) throw new InvalidOperationException("Expected identifier at position " + pos);
            return s.Substring(start, pos - start);
        }

        private string ParseString()
        {
            pos++;
            var sb = new StringBuilder();
            while (pos < s.Length && s[pos] != '"')
            {
                char c = s[pos];
                if (c == '\\' && pos + 1 < s.Length)
                {
                    char e = s[pos + 1];
                    switch (e)
                    {
                        case 'n': sb.Append('\n'); break;
                        case 't': sb.Append('\t'); break;
                        case 'r': sb.Append('\r'); break;
                        case '\\': sb.Append('\\'); break;
                        case '"': sb.Append('"'); break;
                        case '\'': sb.Append('\''); break;
                        default: sb.Append(e); break;
                    }
                    pos += 2;
                }
                else
                {
                    sb.Append(c);
                    pos++;
                }
            }
            if (pos >= s.Length) throw new InvalidOperationException("Unterminated string literal");
            pos++;
            return sb.ToString();
        }

        private object ParseNumber()
        {
            int start = pos;
            bool isDouble = false;
            while (pos < s.Length && (char.IsDigit(s[pos]) || s[pos] == '.' || s[pos] == 'e' || s[pos] == 'E'
                || ((s[pos] == '-' || s[pos] == '+') && pos > start && (s[pos - 1] == 'e' || s[pos - 1] == 'E'))))
            {
                if (s[pos] == '.' || s[pos] == 'e' || s[pos] == 'E') isDouble = true;
                pos++;
            }
            string num = s.Substring(start, pos - start);
            if (isDouble)
                return double.Parse(num, CultureInfo.InvariantCulture);
            if (long.TryParse(num, NumberStyles.Integer, CultureInfo.InvariantCulture, out long lv))
                return lv;
            return double.Parse(num, CultureInfo.InvariantCulture);
        }

        private static object Arith(char op, object a, object b)
        {
            try
            {
                if (op == '+' && (a is string || b is string))
                {
                    return (a == null ? "" : Convert.ToString(a, CultureInfo.InvariantCulture))
                        + (b == null ? "" : Convert.ToString(b, CultureInfo.InvariantCulture));
                }
                if (a == null || b == null) throw new InvalidOperationException("Arithmetic on null");
                if (a is bool || b is bool) throw new InvalidOperationException("Arithmetic on bool");
                if (a is string || b is string) throw new InvalidOperationException("Arithmetic on string");
                dynamic x = a, y = b;
                switch (op)
                {
                    case '+': return x + y;
                    case '-': return x - y;
                    case '*': return x * y;
                    case '/': return x / y;
                    default: return x % y;
                }
            }
            catch (InvalidOperationException) { throw; }
            catch (Exception e)
            {
                throw new InvalidOperationException("Arithmetic error: " + e.Message);
            }
        }

        private static bool Eq(object a, object b)
        {
            if (a == null && b == null) return true;
            if (a == null || b == null) return false;
            if (a is string || b is string)
                return Convert.ToString(a, CultureInfo.InvariantCulture) == Convert.ToString(b, CultureInfo.InvariantCulture);
            if (a.GetType() == b.GetType() && a is IComparable c) return c.CompareTo(b) == 0;
            return ((dynamic)a) == ((dynamic)b);
        }

        private static object Compare(object a, object b, string op)
        {
            try
            {
                if (op == "==") return Eq(a, b);
                if (op == "!=") return !Eq(a, b);
                if (a == null || b == null) throw new InvalidOperationException("Cannot compare null");
                if (a is string || b is string) throw new InvalidOperationException("Cannot order-compare strings");
                if (a is bool || b is bool) throw new InvalidOperationException("Cannot order-compare booleans");
                dynamic x = a, y = b;
                switch (op)
                {
                    case "<": return x < y;
                    case "<=": return x <= y;
                    case ">": return x > y;
                    default: return x >= y;
                }
            }
            catch (InvalidOperationException) { throw; }
            catch (Exception e)
            {
                throw new InvalidOperationException("Comparison error: " + e.Message);
            }
        }

        private static object Index(object target, object index)
        {
            if (target == null) throw new InvalidOperationException("Cannot index null");
            try
            {
                return ((dynamic)target)[(dynamic)index];
            }
            catch (InvalidOperationException) { throw; }
            catch (Exception e)
            {
                throw new InvalidOperationException("Indexing failed: " + e.Message);
            }
        }

        private static object Member(object target, string name)
        {
            if (target == null) throw new InvalidOperationException("Cannot access member on null");
            try
            {
                if (target is Type ty)
                {
                    var sProp = ty.GetProperty(name);
                    if (sProp != null) return sProp.GetValue(null, null);
                    var sField = ty.GetField(name);
                    if (sField != null) return sField.GetValue(null);
                    throw new InvalidOperationException("No static member '" + name + "' on " + ty.Name);
                }
                var t = target.GetType();
                var prop = t.GetProperty(name);
                if (prop != null) return prop.GetValue(target, null);
                var field = t.GetField(name);
                if (field != null) return field.GetValue(target);
                throw new InvalidOperationException("No member '" + name + "' on " + t.Name);
            }
            catch (InvalidOperationException) { throw; }
            catch (Exception e)
            {
                throw new InvalidOperationException("Member access failed: " + e.Message);
            }
        }

        private static object Invoke(object target, string name, List<object> args)
        {
            if (target == null) throw new InvalidOperationException("Cannot call method on null");
            try
            {
                bool isStatic = target is Type;
                var t = isStatic ? (Type)target : target.GetType();
                MethodInfo method = null;
                int bestScore = -1;
                foreach (var m in t.GetMethods())
                {
                    if (m.Name != name || m.IsStatic != isStatic || m.GetParameters().Length != args.Count) continue;
                    var types = m.GetParameters().Select(p => p.ParameterType).ToArray();
                    int sc = 0;
                    bool ok = true;
                    for (int i = 0; i < args.Count; i++)
                    {
                        int s = ScoreArg(args[i], types[i]);
                        if (s <= 0) { ok = false; break; }
                        sc += s;
                    }
                    if (ok && sc > bestScore) { bestScore = sc; method = m; }
                }
                if (method == null)
                    throw new InvalidOperationException("No method '" + name + "' with " + args.Count + " args on " + t.Name);
                var paramTypes = method.GetParameters().Select(p => p.ParameterType).ToArray();
                var converted = new object[args.Count];
                for (int i = 0; i < args.Count; i++)
                {
                    converted[i] = ConvertArg(args[i], paramTypes[i]);
                }
                return method.Invoke(isStatic ? null : target, converted);
            }
            catch (InvalidOperationException) { throw; }
            catch (Exception e)
            {
                throw new InvalidOperationException("Method call failed: " + e.Message);
            }
        }

        private static int ScoreArg(object v, Type t)
        {
            if (v == null) return (t.IsClass || t.IsInterface) && !t.IsPrimitive ? 1 : 0;
            Type vt = v.GetType();
            if (t == vt) return 3;
            if (vt == typeof(string) || vt == typeof(bool)) return 0;
            if (t == typeof(object)) return 1;
            if (vt == typeof(long) || vt == typeof(int) || vt == typeof(short) || vt == typeof(byte)
                || vt == typeof(double) || vt == typeof(float) || vt == typeof(char))
            {
                if (t == typeof(int)) return vt == typeof(long) ? 2 : 1;
                if (t == typeof(long)) return 2;
                if (t == typeof(double)) return vt == typeof(double) || vt == typeof(float) ? 3 : 2;
                if (t == typeof(float)) return vt == typeof(double) ? 0 : 2;
                if (t == typeof(short) || t == typeof(byte) || t == typeof(char)) return 1;
                if (t == typeof(decimal)) return 2;
                return 0;
            }
            return 0;
        }

        private static object ConvertArg(object v, Type t)
        {
            if (v == null) return null;
            if (t == typeof(int)) return Convert.ToInt32(v, CultureInfo.InvariantCulture);
            if (t == typeof(long)) return Convert.ToInt64(v, CultureInfo.InvariantCulture);
            if (t == typeof(double)) return Convert.ToDouble(v, CultureInfo.InvariantCulture);
            if (t == typeof(float)) return Convert.ToSingle(v, CultureInfo.InvariantCulture);
            if (t == typeof(short)) return Convert.ToInt16(v, CultureInfo.InvariantCulture);
            if (t == typeof(byte)) return Convert.ToByte(v, CultureInfo.InvariantCulture);
            if (t == typeof(bool)) return Convert.ToBoolean(v);
            return v;
        }
    }
}
`;

const SIMPLE_TYPE_RE = /\b(var|int|long|double|float|decimal|bool|string|char|byte|short|uint|ulong|ushort|sbyte|object|dynamic)\s+(\w+)\s*(?=[=;,)])/g;
const ARRAY_TYPE_RE = /\b(int|string|char|byte|long|double|float|bool|object)\[\]\s+(\w+)\s*(?=[=;,)])/g;
const GENERIC_TYPE_RE = /(\w+)\s*<[^>]+>\s+(\w+)\s*(?=[=;,)])/g;
const CLASS_TYPE_RE = /([A-Z]\w*)\s+(\w+)\s*(?=[=;,)])/g;
const CONTROL_FLOW_RE = /^\s*(for|foreach|while|catch|using)\s*\(/;
const PATTERN_MATCH_RE = /\bif\s*\([^)]*\bis\b/;

function extractVarDeclarations(line: string): string[] {
    const trimmed = line.trim();
    if (!trimmed || CONTROL_FLOW_RE.test(trimmed) || PATTERN_MATCH_RE.test(trimmed)) return [];

    const names: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = SIMPLE_TYPE_RE.exec(trimmed)) !== null) {
        names.push(m[2]);
    }
    while ((m = ARRAY_TYPE_RE.exec(trimmed)) !== null) {
        const n = m[2];
        if (!names.includes(n)) names.push(n);
    }
    while ((m = GENERIC_TYPE_RE.exec(trimmed)) !== null) {
        const typeName = m[1];
        const varName = m[2];
        if (!/^(var|int|long|double|float|bool|string|char|if|for|foreach|while)$/i.test(typeName) && !names.includes(varName)) {
            names.push(varName);
        }
    }
    while ((m = CLASS_TYPE_RE.exec(trimmed)) !== null) {
        const varName = m[2];
        if (!names.includes(varName)) names.push(varName);
    }
    return names;
}

function extractMethodParams(line: string, recentLines?: string[]): string[] {
    const parenStart = line.indexOf('(');
    if (parenStart < 0) return [];

    // Build full content between ( and ) — may span multiple lines
    let allContent = line.substring(parenStart + 1);

    // If the closing paren isn't on the same line, collect from recent lines
    if (!line.includes(')') && recentLines && recentLines.length > 0) {
        // Find where this line is in recentLines
        const idx = recentLines.indexOf(line.trim());
        if (idx >= 0) {
            for (let k = idx + 1; k < recentLines.length; k++) {
                const rl = recentLines[k];
                const closeParen = rl.indexOf(')');
                if (closeParen >= 0) {
                    allContent += ' ' + rl.substring(0, closeParen);
                    break;
                }
                allContent += ' ' + rl;
            }
        }
    }

    let depth = 0;
    let i = 0;
    while (i < allContent.length) {
        if (allContent[i] === '(') depth++;
        else if (allContent[i] === ')' && depth === 0) break;
        else if (allContent[i] === ')') depth--;
        i++;
    }
    const sig = allContent.substring(0, i).trim();
    if (!sig) return [];

    const params: string[] = [];
    for (const part of sig.split(',')) {
        const trimmed = part.trim();
        const tokens = trimmed.split(/\s+/);
        if (tokens.length >= 2) {
            const name = tokens[tokens.length - 1];
            if (name && !name.includes('=') && !name.includes('<')) {
                params.push(name);
            }
        }
    }
    return params;
}

function shouldInstrument(trimmed: string): boolean {
    if (!trimmed) return false;
    if (trimmed === '{' || trimmed === '}' || trimmed === '};') return false;
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return false;
    if (trimmed.startsWith('using ') || trimmed.startsWith('namespace ')) return false;
    if (trimmed.startsWith('#define') || trimmed.startsWith('#if') || trimmed.startsWith('#endif') ||
        trimmed.startsWith('#region') || trimmed.startsWith('#endregion') || trimmed.startsWith('#line') ||
        trimmed.startsWith('#error') || trimmed.startsWith('#warning') || trimmed.startsWith('#pragma') ||
        trimmed.startsWith('#nullable') || trimmed.startsWith('#undef')) return false;
    if (trimmed.startsWith('[assembly:') || trimmed.startsWith('[module:')) return false;
    if (trimmed.startsWith('class ') || trimmed.startsWith('struct ') ||
        trimmed.startsWith('interface ') || trimmed.startsWith('record ')) return false;
    if (trimmed.startsWith('enum ')) return false;
    if (trimmed.endsWith('{') && (trimmed.startsWith('public ') || trimmed.startsWith('private ') ||
        trimmed.startsWith('protected ') || trimmed.startsWith('internal '))) return false;
    return true;
}

export function generateCsharpDebugWrapper(
    code: string,
    breakpoints: number[],
    entryPoint: boolean,
    initBreakpoints?: string
): string {
    const lines = code.split('\n');
    const result: string[] = [];
    let depth = 0;
    let inMethod = false;
    let varsInited = false;
    let mainInited = !entryPoint;
    let completedDone = false;
    let paramNames: string[] = [];
    let isMainMethod = false;
    let recentLines: string[] = [];
    let allVarNames: string[] = [];
    const V = '__cs_vars';

    for (let i = 0; i < lines.length; i++) {
        const lineNum = i + 1;
        const raw = lines[i];
        const trimmed = raw.trim();
        const indent = raw.slice(0, raw.length - trimmed.length);

        const depthBefore = depth;
        for (const ch of raw) {
            if (ch === '{') depth++;
            else if (ch === '}') depth--;
        }
        const depthAfter = depth;

        if (trimmed.startsWith('using ') || trimmed.startsWith('#nullable')) {
            result.push(raw);
            continue;
        }

        // Determine if this method is Main (for entryPoint mode), checking recent
        // lines too so multiline method signatures work
        let isThisMain = false;
        if (entryPoint) {
            if (/Main\s*\(/.test(trimmed)) {
                isThisMain = true;
            } else {
                for (let j = recentLines.length - 1; j >= 0; j--) {
                    if (/Main\s*\(/.test(recentLines[j])) { isThisMain = true; break; }
                }
            }
        }

        if (!inMethod && depthBefore <= 1 && depthAfter >= 2 && !/^\s*(class|struct|interface|record|enum)\s/.test(trimmed)) {
            if (entryPoint && !isThisMain) {
                // In entryPoint mode, only instrument Main
                // Skip helper class methods (e.g. CSharpHelper)
            } else {
                inMethod = true;
                varsInited = false;
                isMainMethod = isThisMain;
                paramNames = extractMethodParams(trimmed, recentLines);
                if (!trimmed.includes('(')) {
                    for (let j = recentLines.length - 1; j >= 0; j--) {
                        const rl = recentLines[j];
                        if (rl.includes('(')) {
                            paramNames = extractMethodParams(rl, recentLines);
                            break;
                        }
                    }
                }
            }
        }

        if (inMethod && varsInited && shouldInstrument(trimmed)) {
            result.push(`${indent}DebugSupport.Check(${lineNum}, ${V});`);
        }

        if (inMethod && trimmed === '}' && depthBefore === 2 && depthAfter === 1) {
            if (isMainMethod && !completedDone) {
                const bodyIndent = indent + '    ';
                result.push(`${bodyIndent}DebugSupport.ReportCompleted();`);
                completedDone = true;
            }
            inMethod = false;
            varsInited = false;
            paramNames = [];
            allVarNames = [];
            isMainMethod = false;
        }

        result.push(raw);

        const braceOnThisLine = trimmed.includes('{') && depthBefore < depthAfter;
        const bareBrace = trimmed === '{';

        if (inMethod && !varsInited && (braceOnThisLine || bareBrace)) {
            const bodyIndent = indent + '    ';
            result.push(`${bodyIndent}var ${V} = new Dictionary<string, object>();`);
            for (const p of paramNames) {
                result.push(`${bodyIndent}${V}["${p}"] = ${p};`);
            }
            if (isMainMethod && !mainInited) {
                const bpStr = initBreakpoints ? `DebugSupport.Init("${initBreakpoints}")` : 'DebugSupport.Init("")';
                result.push(`${bodyIndent}${bpStr};`);
                mainInited = true;
            }
            varsInited = true;
            allVarNames = [...paramNames];
        }

        if (inMethod && varsInited && shouldInstrument(trimmed)) {
            for (const vn of extractVarDeclarations(trimmed)) {
                if (!allVarNames.includes(vn)) allVarNames.push(vn);
            }
            for (const vn of allVarNames) {
                result.push(`${indent}${V}["${vn}"] = ${vn};`);
            }
        }

        if (trimmed) recentLines.push(trimmed);
        if (recentLines.length > 20) recentLines.shift();
    }

    return result.join('\n');
}
