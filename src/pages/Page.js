import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import Block from "../components/Block";
import { Button, Space } from "antd";
import { useParams } from "react-router-dom";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import SortableItem from "../components/SortableItem"; // компонент для каждого блока
const Page = () => {
  const { id } = useParams();
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "pages", id, "blocks"), orderBy("order"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlocks(list);
    });

    return () => unsub();
  }, [id]);

  const addBlock = async (type) => {
    await addDoc(collection(db, "pages", id, "blocks"), {
      type,
      content: "",
      checked: false,
      createdAt: serverTimestamp(),
      order: blocks.length,
    });
  };

  const deleteBlock = async (blockId) => {
    await deleteDoc(doc(db, "pages", id, "blocks", blockId));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((item) => item.id === active.id);
    const newIndex = blocks.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(blocks, oldIndex, newIndex);
    setBlocks(reordered);

    // обновим порядок в Firestore
    await Promise.all(
      reordered.map((block, index) =>
        updateDoc(doc(db, "pages", id, "blocks", block.id), {
          order: index,
        })
      )
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => addBlock("text")}>+ Text</Button>
        {/* <Button onClick={() => addBlock("checkbox")}>+ Checkbox</Button> */}
      </Space>

      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
          })
        )}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableItem key={block.id} id={block.id}>
              <Block
                key={block.id}
                block={block}
                pageId={id}
                onDelete={() => deleteBlock(block.id)}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Page;

