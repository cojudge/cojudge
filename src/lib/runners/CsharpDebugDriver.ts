export const CSHARP_DEBUG_SUPPORT: string = String.raw`using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;

public static class DebugSupport
{
    private static HashSet<int> breakpoints = new HashSet<int>();
    private static bool stepMode = false;
    private static string STATE_FILE = "/tmp/cojudge_debug_state.json";
    private static string CMD_FILE = "/tmp/cojudge_debug_cmd.json";
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

    public static void Check(int line, Dictionary<string, string> vars)
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

    private static void Pause(int line, Dictionary<string, string> vars)
    {
        WriteState("paused", line, null, vars);

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
                    WriteState("paused", line, null, vars);
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
            result.push(`${bodyIndent}var ${V} = new Dictionary<string, string>();`);
            for (const p of paramNames) {
                result.push(`${bodyIndent}${V}["${p}"] = DebugSupport.RenderValue(${p});`);
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
                result.push(`${indent}${V}["${vn}"] = DebugSupport.RenderValue(${vn});`);
            }
        }

        if (trimmed) recentLines.push(trimmed);
        if (recentLines.length > 20) recentLines.shift();
    }

    return result.join('\n');
}
