import Dexie from 'dexie';

export interface Item {
  id?: string;
  name: string;
  timestamp: number;
}

class ItemDatabase extends Dexie {
  items: Dexie.Table<Item, string>; // Table definition

  constructor() {
    super("ItemDatabase");
    this.version(1).stores({
      items: "++id, name, timestamp"  // Primary key and indexes
    });
    this.items = this.table("items");
  }
}

export const db = new ItemDatabase();
