import React, { useState, useEffect } from "react";
import { Card, Checkbox, Input, Button, DatePicker, Popover } from "antd";
import { ChromePicker } from "react-color"; // Подключаем ChromePicker для выбора цвета
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";

const { TextArea } = Input;
const Block = ({ block, pageId, onDelete }) => {
  const { id, title, tasks, color, deadline } = block;
  const [newTask, setNewTask] = useState("");
  const [taskList, setTaskList] = useState(tasks || []);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color);
  const [selectedDate, setSelectedDate] = useState(deadline);
  const [blockTitle, setBlockTitle] = useState(title);

  const handleTaskChange = (e, index) => {
    const newTasks = [...taskList];
    newTasks[index].text = e.target.value;
    setTaskList(newTasks);
  };

  const handleCheckboxChange = (e, index) => {
    const newTasks = [...taskList];
    newTasks[index].completed = e.target.checked;
    setTaskList(newTasks);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = { text: newTask, completed: false };
      setTaskList([...taskList, newTaskObj]);
      setNewTask("");
    }
  };

  const deleteTask = (index) => {
    const newTasks = [...taskList];
    newTasks.splice(index, 1);
    setTaskList(newTasks);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
  };

  const updateBlockInFirestore = async () => {
    if (!id) return;

    const blockRef = doc(db, "pages", pageId, "blocks", id);
    try {
      await updateDoc(blockRef, {
        tasks: taskList,
        color: selectedColor,
        deadline: selectedDate,
        title: blockTitle,
      });
    } catch (error) {
      console.error("Error updating block in Firestore:", error);
    }
  };

  useEffect(() => {
    updateBlockInFirestore();
  }, [taskList, selectedColor, selectedDate, blockTitle]);

  return (
    <Card
      title={
        <div>
          <Input
            value={blockTitle}
            onChange={(e) => setBlockTitle(e.target.value)}
            style={{ fontWeight: "bold", fontSize: "18px" }}
          />
        </div>
      }
      style={{ marginBottom: 16 }}
      extra={
        <div>
          <Popover
            content={<ChromePicker color={selectedColor} onChangeComplete={handleColorChange} />}
            trigger="click"
            visible={isColorPickerVisible}
            onVisibleChange={setIsColorPickerVisible}
          >
            <Button style={{ backgroundColor: selectedColor, border: "none" }}>
              color
            </Button>
          </Popover>
          <DatePicker
            value={selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            style={{ marginLeft: "10px" }}
            placeholder="Выберите дату"
          />
        </div>
      }
    >
      <div>
        {taskList.map((task, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <Checkbox
              checked={task.completed}
              onChange={(e) => handleCheckboxChange(e, index)}
            />
            <TextArea
              value={task.text}
              onChange={(e) => handleTaskChange(e, index)}
              rows={1}
              style={{ width: "80%", marginLeft: "10px" }}
            />
            <Button onClick={() => deleteTask(index)} type="link" danger>
              delete
            </Button>
          </div>
        ))}
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="new task"
          style={{ marginBottom: 8 }}
        />
        <Button onClick={addTask} type="primary">
          create task
        </Button>
      </div>
      <Button onClick={onDelete} type="link" danger style={{ marginTop: 10 }}>
        delete
      </Button>
    </Card>
  );
};

export default Block;

