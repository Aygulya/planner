import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MenuOutlined } from "@ant-design/icons";

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 12,
    background: "#f9f9f9",
    borderRadius: 8,
    padding: 12
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          cursor: "grab",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          color: "#888"
        }}
        {...attributes}
        {...listeners}
      >
        <MenuOutlined style={{ marginRight: 8 }} />
        Перетащи
      </div>
      {children}
    </div>
  );
};

export default SortableItem;
