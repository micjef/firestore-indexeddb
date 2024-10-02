// src/components/CrudComponent.tsx
import React, { useState, useEffect } from "react";
import { createItem, getItems, updateItem, deleteItem } from "./crud";

interface Item {
  id: string;
  name: string;
}

const CrudComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");

  const fetchItems = async () => {
    const data = await getItems();
    setItems(data as Item[]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async () => {
    await createItem({ name });
    setName("");
    fetchItems();
  };

  const handleUpdate = async (id: string) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      await updateItem(id, { name: newName });
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    fetchItems();
  };

  return (
    <div>
      <h2>CRUD with Firestore</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
      />
      <button onClick={handleCreate}>Add Item</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleUpdate(item.id)}>Update</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudComponent;
