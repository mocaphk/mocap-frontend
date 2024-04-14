import React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { registerPythonLanguage } from "../autocomplete/python";
import { ProgrammingLanguage } from "../../../../../.cache/__types__";

export default function CodeEditor({
    language,
    codeOnEditor,
    updateCode,
    readOnly,
}: {
    language: ProgrammingLanguage;
    codeOnEditor: string;
    updateCode: Function | null;
    readOnly: boolean;
} & React.ComponentProps<typeof Editor>) {
    const monaco = useMonaco();

    function handleEditorChange(value: string | undefined) {
        if (updateCode) {
            updateCode(value);
        }
    }

    const getLanguageString = (language: ProgrammingLanguage): string => {
        switch (language) {
            case ProgrammingLanguage.C:
                return "c";
            case ProgrammingLanguage.Cpp:
                return "cpp";
            case ProgrammingLanguage.Python:
                return "python";
        }
    };

    const regLan = React.useCallback(
        (monaco: any) => {
            function registerLanguageIfNeeded() {
                if (language === ProgrammingLanguage.Python) {
                    if (
                        !isLanguageRegistered(
                            "mocap_" + getLanguageString(language)
                        )
                    ) {
                        registerPythonLanguage(monaco);
                    }
                }
            }

            function isLanguageRegistered(languageId: string) {
                const encodedLanguageId =
                    monaco?.languages.getEncodedLanguageId(languageId);
                return encodedLanguageId !== 0;
            }

            registerLanguageIfNeeded();
        },
        [language]
    );

    React.useEffect(() => {
        if (monaco) {
            regLan(monaco);
        }
    }, [monaco, regLan]);

    return (
        <Editor
            theme="vs-dark"
            onChange={handleEditorChange}
            value={codeOnEditor}
            options={{ minimap: { enabled: false }, readOnly: readOnly }}
            language={getLanguageString(language)}
        />
    );
}
