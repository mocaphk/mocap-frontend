import Editor from "@monaco-editor/react";
import { registerPythonLanguage } from "../autocomplete/python";
import type { Attempt } from "../types/Attempt";

export default function CodeEditor({
    template,
    language,
    attempt,
    updateCode,
}: {
    template: string;
    language: string;
    attempt: Attempt;
    updateCode: Function | null;
} & React.ComponentProps<typeof Editor>) {
    function handleEditorChange(value: string | undefined) {
        attempt.code = value ?? "";
        if (updateCode) {
            updateCode(attempt.code);
        }
    }
    function handleEditorDidMount() {
        const monaco = (window as any).monaco;

        function registerLanguageIfNeeded() {
            if (language === "python") {
                if (!isLanguageRegistered("mocap_" + language)) {
                    registerPythonLanguage(monaco);
                }
            } else if (language === "javascript") {
                if (!isLanguageRegistered("mocap_" + language)) {
                    console.log("register js language");
                }
            }
        }

        function isLanguageRegistered(languageId: string) {
            const encodedLanguageId =
                monaco.languages.getEncodedLanguageId(languageId);
            return encodedLanguageId !== 0;
        }

        registerLanguageIfNeeded();
    }

    return (
        <Editor
            theme="vs-dark"
            // defaultLanguage={props.language}
            defaultValue={template}
            onChange={handleEditorChange}
            value={attempt.code}
            options={{ minimap: { enabled: false } }}
            onMount={handleEditorDidMount}
            language={language}
        />
    );
}
