import React from "react";
import Markdown from "react-markdown";

interface MarkdownRendererProps {
    content: string;
}






export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (

        <Markdown>{content?.toString()}</Markdown>




    )
}




