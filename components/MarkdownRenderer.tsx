"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-lg max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{String(children).replace(/\n$/, '')}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                    div: ({ children }) => <div className="mb-4">{children}</div>,
                    ul: ({ children }) => <ul className="list-disc pl-6 sm:pl-4 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 sm:pl-4 mb-4">{children}</ol>,
                    li: ({ children }) => <li className="mb-2">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 p-4">{children} </blockquote>
                    ),
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <SyntaxHighlighter language={match[1]} style={oneLight}>
                                {String(children)}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content || ""}
            </ReactMarkdown>
        </div>
    );
}
