import React, { useState } from "react";
import { BubbleMenu, BubbleMenuProps, isNodeSelection } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from "lucide-react";
import { ColorSelector } from "./color-selector";
import { LinkSelector } from "./link-selector";
import { cn } from "@/lib/utils";
import { NodeSelector } from "./node-selector";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu = ({
  editor,
  className,
  pluginKey,
  updateDelay,
}: EditorBubbleMenuProps) => {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => editor?.isActive("bold") ?? false,
      command: () => editor?.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => editor?.isActive("italic") ?? false,
      command: () => editor?.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: () => editor?.isActive("underline") ?? false,
      command: () => editor?.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: () => editor?.isActive("strike") ?? false,
      command: () => editor?.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: () => editor?.isActive("code") ?? false,
      command: () => editor?.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    editor,
    className,
    pluginKey,
    updateDelay,
    shouldShow: ({ state, editor }) => {
      const { selection } = state;
      const { empty } = selection;

      // don't show bubble menu if:
      // - the selected node is an image
      // - the selection is empty
      // - the selection is a node selection (for drag handles)
      if (editor.isActive("image") || empty || isNodeSelection(selection)) {
        return false;
      }
      return true;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsNodeSelectorOpen(false);
        setIsColorSelectorOpen(false);
        setIsLinkSelectorOpen(false);
      },
    },
  };

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  if (!editor) return null;

  return (
    <>
      <BubbleMenu
        {...bubbleMenuProps}
        className="novel-flex novel-w-fit novel-divide-x novel-divide-stone-200 novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-shadow-xl"
      >
        <NodeSelector
          editor={editor}
          isOpen={isNodeSelectorOpen}
          setIsOpen={() => {
            setIsNodeSelectorOpen(!isNodeSelectorOpen);
            setIsColorSelectorOpen(false);
            setIsLinkSelectorOpen(false);
          }}
        />
        <LinkSelector
          editor={editor}
          isOpen={isLinkSelectorOpen}
          setIsOpen={() => {
            setIsLinkSelectorOpen(!isLinkSelectorOpen);
            setIsColorSelectorOpen(false);
            setIsNodeSelectorOpen(false);
          }}
        />
        <div className="novel-flex">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.command}
              className="novel-p-2 novel-text-stone-600 hover:novel-bg-stone-100 active:novel-bg-stone-200"
              type="button"
            >
              <item.icon
                className={cn("novel-h-4 novel-w-4", {
                  "novel-text-blue-500": item.isActive(),
                })}
              />
            </button>
          ))}
        </div>
        <ColorSelector
          editor={editor}
          isOpen={isColorSelectorOpen}
          setIsOpen={() => {
            setIsColorSelectorOpen(!isColorSelectorOpen);
            setIsNodeSelectorOpen(false);
            setIsLinkSelectorOpen(false);
          }}
        />
      </BubbleMenu>
    </>
  );
};
