import Markdown from "react-markdown";

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <Markdown
            components={{
                pre: ({ ...props }) => (
                    <pre
                        className="overflow-x-auto whitespace-pre-wrap p-4 bg-gray-100 rounded"
                        {...props}
                    />
                ),
                code: ({ inline = false, className, children, ...rest }: { inline?: boolean; className?: string; children?: React.ReactNode; }) => {
                    return (
                        <code
                            style={{ display: inline ? 'inline' : 'block' }}
                            className={[className, "whitespace-pre-wrap break-words bg-gray-100 rounded px-1"].filter(Boolean).join(' ')}
                            {...rest}
                        >
                            {children}
                        </code>
                    );
                }
            }}
        >
            {content?.toString()}
        </Markdown>
    );
}