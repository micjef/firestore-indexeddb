// src/components/CrudComponent.tsx
import React, { useState, useEffect } from "react";
import { createItem, getItems, updateItem, deleteItem } from "./crud";

interface Item {
  id: string;
  name: string;
  timestamp: number; // Add timestamp to match IndexedDB schema
}

const CrudComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");

  // Function to fetch items from IndexedDB (or Firestore if not available)
  const fetchItems = async () => {
    const data = await getItems(); // This will use IndexedDB first
    setItems(data as Item[]); // Ensure type casting to Item[]
  };

  // Use useEffect to load items when the component is mounted
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle the creation of a new item
  const handleCreate = async () => {
    if (name.trim()) {
      await createItem({ name });
      setName(""); // Clear the input field after adding the item
      fetchItems(); // Re-fetch items to show the updated list
    } else {
      alert("Please enter a valid name");
    }
  };

  // Handle the update of an existing item
  const handleUpdate = async (id: string) => {
    const newName = prompt("Enter new name:");
    if (newName && newName.trim()) {
      await updateItem(id, { name: newName });
      fetchItems(); // Re-fetch items to show the updated list
    } else {
      alert("Please enter a valid name");
    }
  };

  // Handle the deletion of an item
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      await deleteItem(id);
      fetchItems(); // Re-fetch items to show the updated list
    }
  };

  return (
    <div>
      <h2>CRUD with Firestore & IndexedDB</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter item name"
      />
      <button onClick={handleCreate}>Add Item</button>

      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} (Saved on: {new Date(item.timestamp).toLocaleString()})
              <button onClick={() => handleUpdate(item.id)}>Update</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items available. Start adding items!</p>
      )}
    </div>
  );
};

export default CrudComponent;
