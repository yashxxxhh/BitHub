import { useRef, useEffect, useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { emitCodeChange, emitCursorMove } from '../services/socketClient';

const MONACO_THEME = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '5A6478', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'C792EA' },
    { token: 'string', foreground: 'C3E88D' },
    { token: 'number', foreground: 'F78C6C' },
    { token: 'type', foreground: '82AAFF' },
    { token: 'function', foreground: '82AAFF' },
    { token: 'variable', foreground: 'EEFFFF' },
    { token: 'operator', foreground: '89DDFF' },
  ],
  colors: {
    'editor.background': '#0F0F17',
    'editor.foreground': '#EEFFFF',
    'editorLineNumber.foreground': '#2D2D45',
    'editorLineNumber.activeForeground': '#6C63FF',
    'editor.lineHighlightBackground': '#1A1A28',
    'editor.selectionBackground': '#6C63FF30',
    'editor.inactiveSelectionBackground': '#6C63FF15',
    'editorCursor.foreground': '#6C63FF',
    'editorWhitespace.foreground': '#2D2D45',
    'editorIndentGuide.background': '#2D2D45',
    'editorIndentGuide.activeBackground': '#3D3D55',
    'editor.findMatchBackground': '#6C63FF40',
    'scrollbarSlider.background': '#2D2D4580',
    'scrollbarSlider.hoverBackground': '#3D3D5580',
    'minimap.background': '#0A0A0F',
  },
};

const LANGUAGE_MAP = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  html: 'html',
};

const Editor = ({
  roomId,
  language,
  code,
  onCodeChange,
  currentUser,
  remoteCursors = {},
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);
  const isRemoteChange = useRef(false);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('bithub-dark', MONACO_THEME);
    monaco.editor.setTheme('bithub-dark');

    // Cursor position tracking
    editor.onDidChangeCursorPosition((e) => {
      if (!currentUser) return;
      emitCursorMove(roomId, e.position, currentUser.username, currentUser.color);
    });

    editor.focus();
  };

  const handleChange = useCallback(
    (value) => {
      if (isRemoteChange.current) return;
      onCodeChange(value);
      emitCodeChange(roomId, value);
    },
    [roomId, onCodeChange]
  );

  // Apply remote code changes without triggering our own emit
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentVal = editor.getValue();
    if (currentVal !== code) {
      isRemoteChange.current = true;
      const position = editor.getPosition();
      editor.setValue(code || '');
      if (position) editor.setPosition(position);
      isRemoteChange.current = false;
    }
  }, [code]);

  // Render remote cursors as decorations
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const newDecorations = Object.entries(remoteCursors).map(([socketId, info]) => ({
      range: new monaco.Range(
        info.cursor.lineNumber,
        info.cursor.column,
        info.cursor.lineNumber,
        info.cursor.column
      ),
      options: {
        className: `remote-cursor-${socketId}`,
        beforeContentClassName: `remote-cursor-caret-${socketId}`,
        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        zIndex: 10,
      },
    }));

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);

    // Inject cursor styles dynamically
    Object.entries(remoteCursors).forEach(([socketId, info]) => {
      const styleId = `cursor-style-${socketId}`;
      let el = document.getElementById(styleId);
      if (!el) {
        el = document.createElement('style');
        el.id = styleId;
        document.head.appendChild(el);
      }
      el.textContent = `
        .remote-cursor-caret-${socketId}::before {
          content: '${info.username[0].toUpperCase()}';
          position: absolute;
          width: 2px;
          height: 18px;
          background: ${info.color};
          top: 0;
          left: 0;
          border-radius: 1px;
        }
        .remote-cursor-caret-${socketId}::after {
          content: '${info.username}';
          position: absolute;
          top: -18px;
          left: 0;
          background: ${info.color};
          color: white;
          font-size: 10px;
          padding: 1px 4px;
          border-radius: 3px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          white-space: nowrap;
          z-index: 100;
        }
      `;
    });

    // Cleanup stale styles
    return () => {
      Object.keys(remoteCursors).forEach((socketId) => {
        // leave existing styles; they get overwritten on next render
      });
    };
  }, [remoteCursors]);

  return (
    <div className="flex-1 overflow-hidden">
      <MonacoEditor
        height="100%"
        language={LANGUAGE_MAP[language] || 'javascript'}
        value={code}
        onChange={handleChange}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: true, scale: 0.7 },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'gutter',
          lineNumbersMinChars: 3,
          folding: true,
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  );
};

export default Editor;
