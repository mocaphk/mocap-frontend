import type * as monacoEditor from "monaco-editor";

export function registerPythonLanguage(monaco: any) {
    // Register the Python language package with Monaco editor
    monaco.languages.register({ id: "mocap_python" });

    // Enable autocompletion for Python
    monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: (
            model: monacoEditor.editor.ITextModel,
            position: monacoEditor.Position
        ) => {
            const wordUntilPosition = model.getWordUntilPosition(position);
            const currentWord = wordUntilPosition?.word;

            const suggestions: monacoEditor.languages.CompletionItem[] = [];

            // Add autocompletion suggestions for Python keywords
            const keywords = [
                "and",
                "as",
                "assert",
                "break",
                "class",
                "continue",
                "def",
                "del",
                "elif",
                "else",
                "except",
                "finally",
                "for",
                "from",
                "global",
                "if",
                "import",
                "in",
                "is",
                "lambda",
                "nonlocal",
                "not",
                "or",
                "pass",
                "raise",
                "return",
                "try",
                "while",
                "with",
                "yield",
            ];
            keywords.forEach((keyword) => {
                suggestions.push({
                    label: keyword,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: keyword,
                    range: new monaco.Range(
                        position.lineNumber,
                        wordUntilPosition.startColumn,
                        position.lineNumber,
                        wordUntilPosition.endColumn - 1
                    ),
                });
            });

            // Add autocompletion suggestions for Python built-in functions
            const builtInFunctions = [
                "abs()",
                "aiter()",
                "all()",
                "anext()",
                "any()",
                "ascii()",
                "bin()",
                "bool()",
                "breakpoint()",
                "bytearray()",
                "bytes()",
                "callable()",
                "chr()",
                "classmethod()",
                "compile()",
                "complex()",
                "delattr()",
                "dict()",
                "dir()",
                "divmod()",
                "enumerate()",
                "eval()",
                "exec()",
                "filter()",
                "float()",
                "format()",
                "frozenset()",
                "getattr()",
                "globals()",
                "hasattr()",
                "hash()",
                "help()",
                "hex()",
                "id()",
                "input()",
                "int()",
                "isinstance()",
                "issubclass()",
                "iter()",
                "len()",
                "list()",
                "locals()",
                "map()",
                "max()",
                "memoryview()",
                "min()",
                "next()",
                "object()",
                "oct()",
                "open()",
                "ord()",
                "pow()",
                "print()",
                "property()",
                "range()",
                "repr()",
                "reversed()",
                "round()",
                "set()",
                "setattr()",
                "slice()",
                "sorted()",
                "staticmethod()",
                "str()",
                "sum()",
                "super()",
                "tuple()",
                "type()",
                "vars()",
                "zip()",
                "__import__()",
            ];

            builtInFunctions.forEach((func) => {
                suggestions.push({
                    label: func,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: func,
                    range: new monaco.Range(
                        position.lineNumber,
                        wordUntilPosition.startColumn,
                        position.lineNumber,
                        wordUntilPosition.endColumn - 1
                    ),
                    detail: "Built-in Function",
                });
            });

            return {
                suggestions: suggestions.filter((suggestion) => {
                    if (!currentWord) {
                        return true;
                    }
                    const suggestionLabel = String(suggestion.label);
                    return suggestionLabel
                        .toLowerCase()
                        .startsWith(currentWord.toLowerCase());
                }),
            };
        },
    });
}
