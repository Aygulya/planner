import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { Button, Input, List, Space, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [pages, setPages] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const navigate = useNavigate();

  const fetchPages = async () => {
    const pagesCol = collection(db, "pages");
    const snapshot = await getDocs(pagesCol);
    const pagesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPages(pagesData);
  };

  const createPage = async () => {
    if (!newTitle.trim()) return;
    const docRef = await addDoc(collection(db, "pages"), {
      title: newTitle
    });
    setNewTitle("");
    fetchPages();
    navigate(`/page/${docRef.id}`);
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const confirmEdit = async (id) => {
    const ref = doc(db, "pages", id);
    await updateDoc(ref, { title: editingTitle });
    setEditingId(null);
    fetchPages();
    message.success("Название обновлено");
  };

  const deletePage = async (id) => {
    await deleteDoc(doc(db, "pages", id));
    setPages(pages.filter(page => page.id !== id));
    message.success("Страница удалена");
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div
      className="sidebar"
      style={{
        width: 250,
        padding: 16,
        borderRight: "1px solid #eee",
        height: "100vh",
        overflowY: "auto"
      }}
    >
      <h1>
      <a>
      🗂 </a>
      <a
        style={{
          fontFamily: "'courgette', cursive",
          margin: 0,
          color: "black",
        }}
        > MY PAGES</a>
      </h1>
      
      <List
        style={{
          fontFamily: "'courgette', cursive",
          margin: 0,
          color: "black",
        }}
        dataSource={pages}
        renderItem={item => (
          <List.Item>
            {editingId === item.id ? (
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onPressEnter={() => confirmEdit(item.id)}
                onBlur={() => confirmEdit(item.id)}
                autoFocus
              />
            ) : (
              <div
                style={{ flex: 1, cursor: "pointer" }}
                onClick={() => navigate(`/page/${item.id}`)}
              >
                {item.title}
              </div>
            )}
            <Space>
              {editingId !== item.id && (
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => startEditing(item.id, item.title)}
                />
              )}
              <Popconfirm
                title="delete this page??"
                onConfirm={() => deletePage(item.id)}
                okText="yes"
                cancelText="no"
              >
                <Button danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            </Space>
          </List.Item>
        )}
      />
      <Input
        placeholder="new page"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        onPressEnter={createPage}
        style={{ marginTop: 16 }}
      />
      <Button onClick={createPage} type="primary" style={{ marginTop: 8 }} block>
        ➕ create
      </Button>
    </div>
  );
};

export default Sidebar;
