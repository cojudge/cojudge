// JDI-based debug driver for Java debug sessions.
// Communicates via the same file protocol as the Python debug wrapper:
// writes state to /tmp/cojudge_debug_state.json, reads commands from /tmp/cojudge_debug_cmd.json.
export const JAVA_DEBUG_DRIVER: string = String.raw`import com.sun.jdi.*;
import com.sun.jdi.connect.*;
import com.sun.jdi.event.*;
import com.sun.jdi.request.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class DebugDriver {
    static final String STATE_FILE = "/tmp/cojudge_debug_state.json";
    static final String CMD_FILE = "/tmp/cojudge_debug_cmd.json";
    static final String EVAL_RESULT_FILE = "/tmp/cojudge_eval_result.json";
    static String MAIN_CLASS = "Main";
    static String SOURCE_FILE = "Main.java";

    static Set<Integer> breakpoints = new LinkedHashSet<>();
    static final StringBuffer outputBuffer = new StringBuffer();
    static final Set<Integer> resolved = new HashSet<>();

    static VirtualMachine vm;
    static EventRequestManager erm;
    static StepRequest activeStep = null;
    static volatile boolean userStopped = false;

    public static void main(String[] args) throws Exception {
        if (args.length > 0 && !args[0].isEmpty()) {
            for (String s : args[0].split(",")) {
                s = s.trim();
                if (!s.isEmpty()) {
                    try { breakpoints.add(Integer.parseInt(s)); } catch (NumberFormatException ignore) {}
                }
            }
        }
        if (args.length > 1 && !args[1].isEmpty()) MAIN_CLASS = args[1];
        if (args.length > 2 && !args[2].isEmpty()) SOURCE_FILE = args[2];

        writeState("running", -1, null, null);

        LaunchingConnector connector = Bootstrap.virtualMachineManager().defaultConnector();
        Map<String, Connector.Argument> a = connector.defaultArguments();
        a.get("main").setValue(MAIN_CLASS);
        a.get("options").setValue("-cp /app");
        try {
            vm = connector.launch(a);
        } catch (Exception e) {
            writeState("error", -1, null, "Failed to launch VM: " + e.getMessage());
            return;
        }

        erm = vm.eventRequestManager();
        redirect(vm.process().getInputStream());
        redirect(vm.process().getErrorStream());

        ClassPrepareRequest cpr = erm.createClassPrepareRequest();
        cpr.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        cpr.enable();

        for (ReferenceType rt : vm.allClasses()) trySetBreakpoints(rt);

        EventQueue queue = vm.eventQueue();
        boolean connected = true;
        while (connected) {
            EventSet set;
            try { set = queue.remove(); } catch (Exception e) { break; }
            boolean resume = true;
            for (Event ev : set) {
                if (ev instanceof ClassPrepareEvent) {
                    trySetBreakpoints(((ClassPrepareEvent) ev).referenceType());
                } else if (ev instanceof BreakpointEvent) {
                    resume = handlePause(((BreakpointEvent) ev).thread(), ((BreakpointEvent) ev).location());
                } else if (ev instanceof StepEvent) {
                    resume = handlePause(((StepEvent) ev).thread(), ((StepEvent) ev).location());
                } else if (ev instanceof VMDeathEvent) {
                    writeState("completed", -1, null, null);
                } else if (ev instanceof VMDisconnectEvent) {
                    connected = false;
                }
            }
            if (connected && resume) {
                try { set.resume(); } catch (Exception ignore) {}
            }
        }
        if (!userStopped) writeState("completed", -1, null, null);
    }

    static void trySetBreakpoints(ReferenceType rt) {
        try {
            if (!SOURCE_FILE.equals(rt.sourceName())) return;
        } catch (AbsentInformationException e) {
            return;
        } catch (Exception e) {
            return;
        }
        for (int line : breakpoints) {
            if (resolved.contains(line)) continue;
            try {
                List<Location> locs = rt.locationsOfLine(line);
                if (locs != null && !locs.isEmpty()) {
                    BreakpointRequest bp = erm.createBreakpointRequest(locs.get(0));
                    bp.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                    bp.enable();
                    resolved.add(line);
                }
            } catch (AbsentInformationException | ClassNotPreparedException ignore) {
            } catch (Exception ignore) {}
        }
    }

    // returns whether to resume the event set
    static boolean handlePause(ThreadReference thread, Location loc) {
        int line = loc.lineNumber();
        Map<String, String> vars = collectVars(thread);
        writeState("paused", line, vars, null);

        Map<String, Object> cmd = waitForCmd(thread);
        String action = String.valueOf(cmd.get("action"));

        if (activeStep != null) {
            try { erm.deleteEventRequest(activeStep); } catch (Exception ignore) {}
            activeStep = null;
        }

        if ("stop".equals(action)) {
            userStopped = true;
            writeState("stopped", -1, null, null);
            try { vm.dispose(); } catch (Exception ignore) {}
            return false;
        } else if ("step".equals(action)) {
            try {
                activeStep = erm.createStepRequest(thread, StepRequest.STEP_LINE, StepRequest.STEP_OVER);
                activeStep.addClassExclusionFilter("java.*");
                activeStep.addClassExclusionFilter("javax.*");
                activeStep.addClassExclusionFilter("sun.*");
                activeStep.addClassExclusionFilter("jdk.*");
                activeStep.addClassExclusionFilter("com.sun.*");
                activeStep.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                activeStep.addCountFilter(1);
                activeStep.enable();
            } catch (Exception ignore) {}
        }
        return true;
    }

    static Map<String, String> collectVars(ThreadReference thread) {
        Map<String, String> out = new LinkedHashMap<>();
        try {
            StackFrame frame = thread.frame(0);
            List<LocalVariable> locals;
            try {
                locals = frame.visibleVariables();
            } catch (AbsentInformationException e) {
                return out;
            }
            for (LocalVariable lv : locals) {
                try {
                    Value v = frame.getValue(lv);
                    out.put(lv.name(), render(v, 0));
                } catch (Exception e) {
                    out.put(lv.name(), "<error>");
                }
            }
        } catch (Exception ignore) {}
        return out;
    }

    static String render(Value v, int depth) {
        if (v == null) return "null";
        if (v instanceof StringReference) return "\"" + ((StringReference) v).value() + "\"";
        if (v instanceof PrimitiveValue || v instanceof VoidValue) return v.toString();
        if (v instanceof ArrayReference) {
            if (depth > 2) return "[...]";
            ArrayReference arr = (ArrayReference) v;
            int len = arr.length();
            StringBuilder sb = new StringBuilder("[");
            int limit = Math.min(len, 100);
            for (int i = 0; i < limit; i++) {
                if (i > 0) sb.append(", ");
                sb.append(render(arr.getValue(i), depth + 1));
            }
            if (len > limit) sb.append(", ...");
            sb.append("]");
            return sb.toString();
        }
        if (v instanceof ObjectReference) {
            ObjectReference obj = (ObjectReference) v;
            String tn = obj.referenceType().name();
            if (tn.startsWith("java.lang.") && !tn.equals("java.lang.String")) {
                try {
                    Field f = obj.referenceType().fieldByName("value");
                    if (f != null) return render(obj.getValue(f), depth + 1);
                } catch (Exception ignore) {}
            }
            return "<" + simpleName(tn) + ">";
        }
        return v.toString();
    }

    static String simpleName(String tn) {
        int i = tn.lastIndexOf('.');
        return i >= 0 ? tn.substring(i + 1) : tn;
    }

    // ---------------- expression evaluator (JDB-style, on top of JDI) ----------------

    static void writeEvalResult(Value v, String error) {
        String value = null;
        if (error == null) {
            value = v == null ? "null" : render(v, 0);
        }
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        if (error != null) sb.append("\"error\":").append(jstr(error));
        else sb.append("\"value\":").append(jstr(value));
        sb.append("}");
        try {
            Files.write(Paths.get(EVAL_RESULT_FILE), sb.toString().getBytes());
        } catch (Exception ignore) {}
    }

    static Value evaluateExpr(String expr, ThreadReference thread) throws Exception {
        ExprParser p = new ExprParser(expr, thread);
        Object v = p.parseExpression();
        if (!p.atEnd()) throw new IllegalArgumentException("Unexpected token at position " + p.pos);
        if (v instanceof ReferenceType) {
            throw new IllegalArgumentException("'" + expr + "' resolves to a class, not a value");
        }
        if (v != null && !(v instanceof Value)) {
            throw new IllegalArgumentException("Cannot use '" + expr + "' as a value");
        }
        return (Value) v;
    }

    static class ExprParser {
        final String s;
        final ThreadReference thread;
        int pos = 0;

        ExprParser(String s, ThreadReference thread) {
            this.s = s;
            this.thread = thread;
        }

        void skipWs() { while (pos < s.length() && Character.isWhitespace(s.charAt(pos))) pos++; }
        boolean atEnd() { skipWs(); return pos >= s.length(); }
        char cur() { skipWs(); return pos < s.length() ? s.charAt(pos) : '\0'; }
        char peek(int off) { return pos + off < s.length() ? s.charAt(pos + off) : '\0'; }

        Object parseExpression() { return parseOr(); }

        Object parseOr() {
            Object a = parseAnd();
            while (cur() == '|' && peek(1) == '|') {
                pos += 2;
                Object b = parseAnd();
                a = boolOp(a, b, "||");
            }
            return a;
        }

        Object parseAnd() {
            Object a = parseEquality();
            while (cur() == '&' && peek(1) == '&') {
                pos += 2;
                Object b = parseEquality();
                a = boolOp(a, b, "&&");
            }
            return a;
        }

        Object parseEquality() {
            Object a = parseRelational();
            while (true) {
                String op = null;
                if (cur() == '=' && peek(1) == '=') op = "==";
                else if (cur() == '!' && peek(1) == '=') op = "!=";
                if (op == null) return a;
                pos += 2;
                Object b = parseRelational();
                a = compareOp(thread, a, b, op);
            }
        }

        Object parseRelational() {
            Object a = parseAdditive();
            while (true) {
                String op = null;
                char c = cur();
                if (c == '<' && peek(1) == '=') op = "<=";
                else if (c == '>' && peek(1) == '=') op = ">=";
                else if (c == '<') op = "<";
                else if (c == '>') op = ">";
                if (op == null) return a;
                pos += op.length();
                Object b = parseAdditive();
                a = compareOp(thread, a, b, op);
            }
        }

        Object parseAdditive() {
            Object a = parseMultiplicative();
            while (true) {
                char c = cur();
                if (c != '+' && c != '-') return a;
                pos++;
                Object b = parseMultiplicative();
                a = arithOp(thread, c, a, b);
            }
        }

        Object parseMultiplicative() {
            Object a = parseUnary();
            while (true) {
                char c = cur();
                if (c != '*' && c != '/' && c != '%') return a;
                pos++;
                Object b = parseUnary();
                a = arithOp(thread, c, a, b);
            }
        }

        Object parseUnary() {
            char c = cur();
            if (c == '-') {
                pos++;
                return unaryMinus(thread, parseUnary());
            }
            if (c == '+') { pos++; return parseUnary(); }
            if (c == '!') {
                pos++;
                Object v = parseUnary();
                if (!(v instanceof BooleanValue))
                    throw new IllegalArgumentException("'!' requires a boolean operand");
                return thread.virtualMachine().mirrorOf(!((BooleanValue) v).value());
            }
            return parsePostfix();
        }

        Object parsePostfix() {
            Object v = parsePrimary();
            while (true) {
                skipWs();
                if (pos < s.length() && s.charAt(pos) == '[') {
                    pos++;
                    Object idx = parseExpression();
                    if (cur() != ']') throw new IllegalArgumentException("Expected ']'");
                    pos++;
                    v = arrayIndex(v, idx);
                } else if (pos < s.length() && s.charAt(pos) == '.') {
                    pos++;
                    skipWs();
                    String name = readIdent();
                    skipWs();
                    if (pos < s.length() && s.charAt(pos) == '(') {
                        pos++;
                        List<Value> args = new ArrayList<>();
                        skipWs();
                        if (cur() != ')') {
                            args.add(asValue(parseExpression(), "argument"));
                            while (cur() == ',') { pos++; args.add(asValue(parseExpression(), "argument")); }
                        }
                        if (cur() != ')') throw new IllegalArgumentException("Expected ')'");
                        pos++;
                        v = invokeMethod(thread, v, name, args);
                    } else {
                        v = fieldAccess(v, name);
                    }
                } else {
                    return v;
                }
            }
        }

        Object parsePrimary() {
            skipWs();
            if (pos >= s.length()) throw new IllegalArgumentException("Unexpected end of expression");
            char c = s.charAt(pos);
            if (c == '(') {
                pos++;
                Object v = parseExpression();
                if (cur() != ')') throw new IllegalArgumentException("Expected ')'");
                pos++;
                return v;
            }
            if (c == '"') return parseString();
            if (Character.isDigit(c)) return parseNumber();
            if (Character.isJavaIdentifierStart(c)) {
                String name = readIdent();
                switch (name) {
                    case "true": return thread.virtualMachine().mirrorOf(true);
                    case "false": return thread.virtualMachine().mirrorOf(false);
                    case "null": return null;
                    default: return resolveIdent(name);
                }
            }
            throw new IllegalArgumentException("Unexpected character '" + c + "' at position " + pos);
        }

        String readIdent() {
            skipWs();
            int start = pos;
            while (pos < s.length() && Character.isJavaIdentifierPart(s.charAt(pos))) pos++;
            if (pos == start) throw new IllegalArgumentException("Expected identifier at position " + pos);
            return s.substring(start, pos);
        }

        Value parseString() {
            pos++;
            StringBuilder sb = new StringBuilder();
            while (pos < s.length() && s.charAt(pos) != '"') {
                char c = s.charAt(pos);
                if (c == '\\' && pos + 1 < s.length()) {
                    char e = s.charAt(pos + 1);
                    switch (e) {
                        case 'n': sb.append('\n'); break;
                        case 't': sb.append('\t'); break;
                        case 'r': sb.append('\r'); break;
                        case '\\': sb.append('\\'); break;
                        case '"': sb.append('"'); break;
                        case 'u':
                            if (pos + 5 < s.length()) {
                                try { sb.append((char) Integer.parseInt(s.substring(pos + 2, pos + 6), 16)); pos += 4; }
                                catch (NumberFormatException ignore) { sb.append('u'); }
                            } else { sb.append('u'); }
                            break;
                        default: sb.append(e);
                    }
                    pos += 2;
                } else {
                    sb.append(c);
                    pos++;
                }
            }
            if (pos >= s.length()) throw new IllegalArgumentException("Unterminated string literal");
            pos++;
            return thread.virtualMachine().mirrorOf(sb.toString());
        }

        Value parseNumber() {
            int start = pos;
            boolean isDouble = false;
            while (pos < s.length() && (Character.isDigit(s.charAt(pos))
                    || s.charAt(pos) == '.' || s.charAt(pos) == 'e' || s.charAt(pos) == 'E')) {
                if (s.charAt(pos) == '.' || s.charAt(pos) == 'e' || s.charAt(pos) == 'E') isDouble = true;
                pos++;
            }
            String num = s.substring(start, pos);
            VirtualMachine vm = thread.virtualMachine();
            try {
                if (isDouble) return vm.mirrorOf(Double.parseDouble(num));
                long lv = Long.parseLong(num);
                if (lv >= Integer.MIN_VALUE && lv <= Integer.MAX_VALUE) return vm.mirrorOf((int) lv);
                return vm.mirrorOf(lv);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid number '" + num + "'");
            }
        }

        Object resolveIdent(String name) {
            try {
                StackFrame frame = thread.frame(0);
                if ("this".equals(name)) return frame.thisObject();
                LocalVariable lv = frame.visibleVariableByName(name);
                if (lv != null) return frame.getValue(lv);
                for (String pkg : new String[]{"java.lang.", "java.util.", "java.math."}) {
                    List<ReferenceType> cs = thread.virtualMachine().classesByName(pkg + name);
                    if (!cs.isEmpty()) return cs.get(0);
                }
                List<ReferenceType> classes = thread.virtualMachine().classesByName(name);
                if (!classes.isEmpty()) return classes.get(0);
                for (ReferenceType rt : thread.virtualMachine().allClasses()) {
                    String n = rt.name();
                    int dot = n.lastIndexOf('.');
                    String simple = dot >= 0 ? n.substring(dot + 1) : n;
                    if (simple.equals(name) && n.startsWith("java.lang.")) return rt;
                }
            } catch (Exception e) {
                throw new IllegalArgumentException("Cannot resolve '" + name + "': " + e.getMessage());
            }
            throw new IllegalArgumentException("Unknown identifier '" + name + "'");
        }
    }

    static Value asValue(Object v, String what) {
        if (v == null) return null;
        if (v instanceof ReferenceType)
            throw new IllegalArgumentException("'" + ((ReferenceType) v).name() + "' is a class, not a value (" + what + ")");
        if (v instanceof Value) return (Value) v;
        throw new IllegalArgumentException("Cannot use value in " + what);
    }

    static List<ReferenceType> typeChain(ReferenceType rt) {
        List<ReferenceType> chain = new ArrayList<>();
        ReferenceType cur = rt;
        while (cur != null) {
            chain.add(cur);
            cur = (cur instanceof ClassType) ? ((ClassType) cur).superclass() : null;
        }
        return chain;
    }

    static Value boolOp(Object a, Object b, String op) {
        if (!(a instanceof BooleanValue) || !(b instanceof BooleanValue))
            throw new IllegalArgumentException("'" + op + "' requires boolean operands");
        boolean x = ((BooleanValue) a).value();
        boolean y = ((BooleanValue) b).value();
        boolean r = "||".equals(op) ? (x || y) : (x && y);
        return ((BooleanValue) a).virtualMachine().mirrorOf(r);
    }

    static Value unaryMinus(ThreadReference thread, Object v) {
        if (!(v instanceof PrimitiveValue))
            throw new IllegalArgumentException("Unary '-' requires a numeric operand");
        PrimitiveValue p = (PrimitiveValue) v;
        VirtualMachine vm = thread.virtualMachine();
        if (p instanceof DoubleValue) return vm.mirrorOf(-p.doubleValue());
        if (p instanceof FloatValue) return vm.mirrorOf(-p.floatValue());
        return vm.mirrorOf(-p.longValue());
    }

    static Value arithOp(ThreadReference thread, char op, Object a, Object b) {
        if (a == null || b == null) throw new IllegalArgumentException("Arithmetic on null");
        Value va = (Value) a, vb = (Value) b;
        VirtualMachine vm = thread.virtualMachine();
        if (op == '+') {
            if (a instanceof StringReference || b instanceof StringReference) {
                return vm.mirrorOf(strValue(va) + strValue(vb));
            }
        }
        if (!(a instanceof PrimitiveValue) || !(b instanceof PrimitiveValue))
            throw new IllegalArgumentException("Arithmetic requires numeric operands");
        if (a instanceof DoubleValue || a instanceof FloatValue || b instanceof DoubleValue || b instanceof FloatValue) {
            double x = ((PrimitiveValue) a).doubleValue();
            double y = ((PrimitiveValue) b).doubleValue();
            switch (op) {
                case '+': return vm.mirrorOf(x + y);
                case '-': return vm.mirrorOf(x - y);
                case '*': return vm.mirrorOf(x * y);
                case '/': return vm.mirrorOf(x / y);
                default: return vm.mirrorOf(x % y);
            }
        }
        long x = ((PrimitiveValue) a).longValue();
        long y = ((PrimitiveValue) b).longValue();
        switch (op) {
            case '+': return vm.mirrorOf(x + y);
            case '-': return vm.mirrorOf(x - y);
            case '*': return vm.mirrorOf(x * y);
            case '/':
                if (y == 0) throw new IllegalArgumentException("Division by zero");
                return vm.mirrorOf(x / y);
            default:
                if (y == 0) throw new IllegalArgumentException("Division by zero");
                return vm.mirrorOf(x % y);
        }
    }

    static String strValue(Value v) {
        if (v == null) return "null";
        if (v instanceof StringReference) return ((StringReference) v).value();
        if (v instanceof PrimitiveValue) return v.toString();
        return render(v, 0);
    }

    static Value compareOp(ThreadReference thread, Object a, Object b, String op) {
        VirtualMachine vm;
        if (a instanceof Value) vm = ((Value) a).virtualMachine();
        else if (b instanceof Value) vm = ((Value) b).virtualMachine();
        else vm = thread.virtualMachine();
        if (a == null || b == null) {
            if (!op.equals("==") && !op.equals("!="))
                throw new IllegalArgumentException("Cannot compare null");
            return vm.mirrorOf(op.equals("==") ? (a == null && b == null) : (a != null || b != null));
        }
        if (!(a instanceof Value) || !(b instanceof Value))
            throw new IllegalArgumentException("Cannot compare class references");
        if (op.equals("==") || op.equals("!=")) {
            boolean eq;
            if (a instanceof StringReference && b instanceof StringReference) {
                eq = ((StringReference) a).value().equals(((StringReference) b).value());
            } else if (a instanceof BooleanValue && b instanceof BooleanValue) {
                eq = ((BooleanValue) a).value() == ((BooleanValue) b).value();
            } else if (a instanceof PrimitiveValue && b instanceof PrimitiveValue) {
                if (a instanceof DoubleValue || a instanceof FloatValue || b instanceof DoubleValue || b instanceof FloatValue) {
                    eq = ((PrimitiveValue) a).doubleValue() == ((PrimitiveValue) b).doubleValue();
                } else {
                    eq = ((PrimitiveValue) a).longValue() == ((PrimitiveValue) b).longValue();
                }
            } else {
                eq = a.equals(b);
            }
            return vm.mirrorOf("==".equals(op) ? eq : !eq);
        }
        if (!(a instanceof PrimitiveValue) || !(b instanceof PrimitiveValue))
            throw new IllegalArgumentException("Order comparison requires numeric operands");
        if (a instanceof DoubleValue || a instanceof FloatValue || b instanceof DoubleValue || b instanceof FloatValue) {
            double x = ((PrimitiveValue) a).doubleValue();
            double y = ((PrimitiveValue) b).doubleValue();
            switch (op) {
                case "<": return vm.mirrorOf(x < y);
                case "<=": return vm.mirrorOf(x <= y);
                case ">": return vm.mirrorOf(x > y);
                default: return vm.mirrorOf(x >= y);
            }
        }
        long x = ((PrimitiveValue) a).longValue();
        long y = ((PrimitiveValue) b).longValue();
        switch (op) {
            case "<": return vm.mirrorOf(x < y);
            case "<=": return vm.mirrorOf(x <= y);
            case ">": return vm.mirrorOf(x > y);
            default: return vm.mirrorOf(x >= y);
        }
    }

    static Value arrayIndex(Object v, Object idx) {
        if (!(v instanceof ArrayReference))
            throw new IllegalArgumentException("Cannot index non-array value");
        if (idx == null || !(idx instanceof PrimitiveValue))
            throw new IllegalArgumentException("Array index must be numeric");
        ArrayReference arr = (ArrayReference) v;
        int i = (int) ((PrimitiveValue) idx).longValue();
        if (i < 0 || i >= arr.length())
            throw new IllegalArgumentException("Array index out of bounds: " + i);
        return arr.getValue(i);
    }

    static Object fieldAccess(Object v, String name) {
        if (v instanceof ArrayReference && "length".equals(name)) {
            return ((Value) v).virtualMachine().mirrorOf(((ArrayReference) v).length());
        }
        if (v instanceof ReferenceType) {
            ReferenceType rt = (ReferenceType) v;
            for (Field f : rt.allFields()) {
                if (f.name().equals(name) && f.isStatic()) return rt.getValue(f);
            }
            throw new IllegalArgumentException("No static field '" + name + "' on " + rt.name());
        }
        if (v instanceof ObjectReference) {
            ObjectReference obj = (ObjectReference) v;
            for (ReferenceType rt : typeChain(obj.referenceType())) {
                Field f = rt.fieldByName(name);
                if (f != null) return obj.getValue(f);
            }
            throw new IllegalArgumentException("No field '" + name + "' on " + obj.referenceType().name());
        }
        throw new IllegalArgumentException("Cannot access field '" + name + "' on non-object");
    }

    static List<Value> coerceArgs(Method m, List<Value> args) {
        List<Value> out = new ArrayList<>();
        List<String> types = m.argumentTypeNames();
        for (int i = 0; i < args.size(); i++) {
            out.add(coerce(args.get(i), types.get(i)));
        }
        return out;
    }

    static Value coerce(Value v, String typeName) {
        if (v == null) return v;
        try {
            VirtualMachine vm = v.virtualMachine();
            PrimitiveValue p = (PrimitiveValue) v;
            switch (typeName) {
                case "int": return vm.mirrorOf(p.intValue());
                case "long": return vm.mirrorOf(p.longValue());
                case "double": return vm.mirrorOf(p.doubleValue());
                case "float": return vm.mirrorOf(p.floatValue());
                case "short": return vm.mirrorOf(p.shortValue());
                case "byte": return vm.mirrorOf(p.byteValue());
                case "char": return vm.mirrorOf((char) p.charValue());
                case "boolean": return vm.mirrorOf(p.booleanValue());
                case "java.lang.Integer": return vm.mirrorOf(p.intValue());
                case "java.lang.Long": return vm.mirrorOf(p.longValue());
                case "java.lang.Double": return vm.mirrorOf(p.doubleValue());
                case "java.lang.Float": return vm.mirrorOf(p.floatValue());
                case "java.lang.Short": return vm.mirrorOf(p.shortValue());
                case "java.lang.Byte": return vm.mirrorOf(p.byteValue());
                case "java.lang.Character": return vm.mirrorOf((char) p.charValue());
                case "java.lang.Boolean": return vm.mirrorOf(p.booleanValue());
                case "java.lang.String":
                    if (v instanceof StringReference) return v;
                    return vm.mirrorOf(strValue(v));
                default: return v;
            }
        } catch (Exception e) {
            return v;
        }
    }

    static int scoreArg(Value v, String typeName) {
        if (v == null) {
            return (!typeName.equals("int") && !typeName.equals("long") && !typeName.equals("double")
                    && !typeName.equals("float") && !typeName.equals("boolean") && !typeName.equals("short")
                    && !typeName.equals("byte") && !typeName.equals("char")) ? 2 : 0;
        }
        if (v instanceof StringReference) {
            return typeName.equals("java.lang.String") ? 3 : 0;
        }
        if (v instanceof PrimitiveValue) {
            PrimitiveValue p = (PrimitiveValue) v;
            switch (typeName) {
                case "int":
                    if (p instanceof IntegerValue) return 3;
                    if (p instanceof ShortValue || p instanceof ByteValue || p instanceof CharValue) return 2;
                    if (p instanceof LongValue) return 1;
                    return 0;
                case "long":
                    if (p instanceof LongValue) return 3;
                    if (p instanceof IntegerValue || p instanceof ShortValue || p instanceof ByteValue || p instanceof CharValue) return 2;
                    return 0;
                case "double":
                    if (p instanceof DoubleValue) return 3;
                    if (p instanceof FloatValue) return 2;
                    return 1;
                case "float":
                    if (p instanceof FloatValue) return 3;
                    if (p instanceof DoubleValue) return 0;
                    return 2;
                case "boolean":
                    return p instanceof BooleanValue ? 3 : 0;
                case "char":
                    if (p instanceof CharValue) return 3;
                    return p instanceof IntegerValue ? 1 : 0;
                case "short":
                    if (p instanceof ShortValue || p instanceof ByteValue) return 3;
                    return p instanceof IntegerValue ? 1 : 0;
                case "byte":
                    return p instanceof ByteValue ? 3 : 0;
                case "java.lang.Integer": return p instanceof IntegerValue ? 2 : 0;
                case "java.lang.Long": return p instanceof LongValue ? 2 : 0;
                case "java.lang.Double": return p instanceof DoubleValue ? 2 : 0;
                case "java.lang.Float": return p instanceof FloatValue ? 2 : 0;
                case "java.lang.Boolean": return p instanceof BooleanValue ? 2 : 0;
                case "java.lang.Character": return p instanceof CharValue ? 2 : 0;
                case "java.lang.Short": return p instanceof ShortValue ? 2 : 0;
                case "java.lang.Byte": return p instanceof ByteValue ? 2 : 0;
                default:
                    return typeName.startsWith("[") ? 0 : 1;
            }
        }
        if (typeName.equals("java.lang.String") || !typeName.startsWith("[")) return 2;
        return 0;
    }

    static Method bestMethod(List<Method> methods, List<Value> args) {
        Method best = null;
        int bestScore = -1;
        for (Method m : methods) {
            if (m.argumentTypeNames().size() != args.size()) continue;
            int sc = 0;
            boolean ok = true;
            List<String> types = m.argumentTypeNames();
            for (int i = 0; i < args.size(); i++) {
                int s = scoreArg(args.get(i), types.get(i));
                if (s <= 0) { ok = false; break; }
                sc += s;
            }
            if (!ok) continue;
            if (sc > bestScore) {
                bestScore = sc;
                best = m;
            }
        }
        return best;
    }

    static Object invokeMethod(ThreadReference thread, Object target, String name, List<Value> args) {
        if (target instanceof ClassType) {
            ClassType ct = (ClassType) target;
            List<Method> candidates = new ArrayList<>();
            for (ReferenceType t : typeChain(ct)) {
                for (Method m : t.allMethods()) {
                    if (m.name().equals(name) && m.isStatic()) candidates.add(m);
                }
            }
            Method m = bestMethod(candidates, args);
            if (m == null) {
                throw new IllegalArgumentException("No static method '" + name + "' with " + args.size() + " args on " + ct.name());
            }
            try {
                return ct.invokeMethod(thread, m, coerceArgs(m, args), ObjectReference.INVOKE_SINGLE_THREADED);
            } catch (Exception e) {
                throw new IllegalArgumentException("Static method call failed: " + e.getMessage());
            }
        }
        if (target instanceof ObjectReference) {
            ObjectReference obj = (ObjectReference) target;
            List<Method> candidates = new ArrayList<>();
            for (ReferenceType t : typeChain(obj.referenceType())) {
                for (Method m : t.allMethods()) {
                    if (m.name().equals(name) && !m.isStatic()) candidates.add(m);
                }
            }
            Method m = bestMethod(candidates, args);
            if (m == null) {
                throw new IllegalArgumentException("No method '" + name + "' with " + args.size() + " args on " + obj.referenceType().name());
            }
            try {
                return obj.invokeMethod(thread, m, coerceArgs(m, args), ObjectReference.INVOKE_SINGLE_THREADED);
            } catch (Exception e) {
                throw new IllegalArgumentException("Method call failed: " + e.getMessage());
            }
        }
        throw new IllegalArgumentException("Cannot call method on non-object value");
    }

    static Map<String, Object> waitForCmd(ThreadReference thread) {
        while (true) {
            try {
                File f = new File(CMD_FILE);
                if (f.exists()) {
                    String content = new String(Files.readAllBytes(f.toPath())).trim();
                    Map<String, Object> cmd = parseCmd(content);
                    String action = String.valueOf(cmd.get("action"));
                    if ("set_breakpoints".equals(action)) {
                        Object bps = cmd.get("breakpoints");
                        if (bps instanceof List) {
                            breakpoints.clear();
                            resolved.clear();
                            for (BreakpointRequest br : erm.breakpointRequests()) {
                                try { erm.deleteEventRequest(br); } catch (Exception ignore) {}
                            }
                            for (Object o : (List<?>) bps) {
                                try { breakpoints.add(Integer.parseInt(String.valueOf(o).trim())); } catch (Exception ignore) {}
                            }
                            for (ReferenceType rt : vm.allClasses()) trySetBreakpoints(rt);
                        }
                        f.delete();
                        continue;
                    }
                    if ("eval".equals(action)) {
                        f.delete();
                        try {
                            String expr = String.valueOf(cmd.get("expression"));
                            Value v = evaluateExpr(expr, thread);
                            writeEvalResult(v, null);
                        } catch (Exception e) {
                            writeEvalResult(null, e.getMessage());
                        }
                        continue;
                    }
                    if ("continue".equals(action) || "step".equals(action) || "stop".equals(action)) {
                        f.delete();
                        return cmd;
                    }
                    f.delete();
                }
            } catch (Exception ignore) {}
            try { Thread.sleep(100); } catch (InterruptedException ignore) {}
        }
    }

    // minimal JSON parse for {"action":"..","breakpoints":[..]}
    static Map<String, Object> parseCmd(String s) {
        Map<String, Object> m = new HashMap<>();
        int ai = s.indexOf("\"action\"");
        if (ai >= 0) {
            int c = s.indexOf(':', ai);
            int q1 = s.indexOf('"', c + 1);
            int q2 = s.indexOf('"', q1 + 1);
            if (q1 >= 0 && q2 > q1) m.put("action", s.substring(q1 + 1, q2));
        }
        int bi = s.indexOf("\"breakpoints\"");
        if (bi >= 0) {
            int lb = s.indexOf('[', bi);
            int rb = s.indexOf(']', lb);
            if (lb >= 0 && rb > lb) {
                List<Object> list = new ArrayList<>();
                String inner = s.substring(lb + 1, rb).trim();
                if (!inner.isEmpty()) {
                    for (String p : inner.split(",")) {
                        p = p.trim();
                        if (!p.isEmpty()) list.add(p);
                    }
                }
                m.put("breakpoints", list);
            }
        }
        String expr = extractJsonString(s, "expression");
        if (expr != null) m.put("expression", expr);
        return m;
    }

    static String extractJsonString(String s, String key) {
        int ki = s.indexOf("\"" + key + "\"");
        if (ki < 0) return null;
        int ci = s.indexOf(':', ki);
        if (ci < 0) return null;
        int q1 = s.indexOf('"', ci);
        if (q1 < 0) return null;
        StringBuilder sb = new StringBuilder();
        int i = q1 + 1;
        while (i < s.length()) {
            char c = s.charAt(i);
            if (c == '\\') {
                if (i + 1 >= s.length()) break;
                char e = s.charAt(i + 1);
                switch (e) {
                    case '"': sb.append('"'); break;
                    case '\\': sb.append('\\'); break;
                    case 'n': sb.append('\n'); break;
                    case 't': sb.append('\t'); break;
                    case 'r': sb.append('\r'); break;
                    case 'u':
                        if (i + 5 < s.length()) {
                            try { sb.append((char) Integer.parseInt(s.substring(i + 2, i + 6), 16)); i += 4; }
                            catch (NumberFormatException ignore) { sb.append('u'); }
                        } else { sb.append('u'); }
                        break;
                    default: sb.append(e);
                }
                i += 2;
            } else if (c == '"') {
                return sb.toString();
            } else {
                sb.append(c);
                i++;
            }
        }
        return null;
    }

    static void redirect(final InputStream in) {
        Thread t = new Thread(() -> {
            byte[] buf = new byte[4096];
            int n;
            try {
                while ((n = in.read(buf)) != -1) {
                    outputBuffer.append(new String(buf, 0, n));
                }
            } catch (IOException ignore) {}
        });
        t.setDaemon(true);
        t.start();
    }

    static synchronized void writeState(String status, int line, Map<String, String> vars, String error) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"status\":").append(jstr(status));
        if (line >= 0) sb.append(",\"line\":").append(line);
        if (vars != null) {
            sb.append(",\"vars\":{");
            boolean first = true;
            for (Map.Entry<String, String> e : vars.entrySet()) {
                if (!first) sb.append(",");
                first = false;
                sb.append(jstr(e.getKey())).append(":").append(jstr(e.getValue()));
            }
            sb.append("}");
        }
        sb.append(",\"output\":").append(jstr(outputBuffer.toString()));
        if (error != null) sb.append(",\"error\":").append(jstr(error));
        sb.append("}");
        try {
            Path tmp = Paths.get(STATE_FILE + ".tmp");
            Files.write(tmp, sb.toString().getBytes());
            Files.move(tmp, Paths.get(STATE_FILE), StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (Exception e) {
            try { Files.write(Paths.get(STATE_FILE), sb.toString().getBytes()); } catch (Exception ignore) {}
        }
    }

    static String jstr(String s) {
        if (s == null) return "\"\"";
        StringBuilder sb = new StringBuilder("\"");
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
            }
        }
        sb.append("\"");
        return sb.toString();
    }
}
`;
