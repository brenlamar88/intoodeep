"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Minus,
} from "lucide-react";
import { uploadImage } from "@/lib/upload";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener", target: "_blank" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
      Placeholder.configure({ placeholder: "Start writing her story…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "tiptap prose-deep max-w-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const onPickImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      const alt = window.prompt("Describe this image (alt text — important for SEO & accessibility)") || "";
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url, alt }).run();
      } catch (err) {
        alert("Image upload failed: " + (err as Error).message);
      } finally {
        if (fileInput.current) fileInput.current.value = "";
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="bg-deep border border-[var(--line)] rounded-[14px] overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 border-b border-[var(--line)] bg-deep">
        <Btn editor={editor} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold"><Bold size={16} /></Btn>
        <Btn editor={editor} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic"><Italic size={16} /></Btn>
        <Divider />
        <Btn editor={editor} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Heading 2"><Heading2 size={16} /></Btn>
        <Btn editor={editor} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Heading 3"><Heading3 size={16} /></Btn>
        <Divider />
        <Btn editor={editor} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet list"><List size={16} /></Btn>
        <Btn editor={editor} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered list"><ListOrdered size={16} /></Btn>
        <Btn editor={editor} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Quote"><Quote size={16} /></Btn>
        <Btn editor={editor} active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Divider"><Minus size={16} /></Btn>
        <Divider />
        <Btn editor={editor} active={editor.isActive("link")} onClick={setLink} label="Link"><LinkIcon size={16} /></Btn>
        <Btn editor={editor} active={false} onClick={() => fileInput.current?.click()} label="Image"><ImageIcon size={16} /></Btn>
        <Divider />
        <Btn editor={editor} active={false} onClick={() => editor.chain().focus().undo().run()} label="Undo"><Undo size={16} /></Btn>
        <Btn editor={editor} active={false} onClick={() => editor.chain().focus().redo().run()} label="Redo"><Redo size={16} /></Btn>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={onPickImage} />
      </div>
      <div className="px-4 sm:px-6 py-5 sm:py-6 max-h-[60vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Btn({
  onClick,
  active,
  label,
  children,
}: {
  editor: Editor;
  onClick: () => void;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-8 h-8 flex items-center justify-center rounded-[7px] cursor-pointer transition-colors ${
        active
          ? "bg-coral text-abyss"
          : "text-[var(--foam-soft)] hover:bg-[rgba(234,244,243,0.06)] hover:text-foam"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-[var(--line-strong)] mx-1" />;
}
