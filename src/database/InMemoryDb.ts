import { IDatabase } from './IDatabase'
import PublicError from '../libs/PublicError'

export default class InMemoryDb<T> implements IDatabase<T> {
    items = new Map<string, T>();

    async get(id: string): Promise<T> {
      return this.items.get(id)
    }

    async set(id: string, item: T): Promise<void> {
      this.items.set(id, item)
    }

    async update(id: string, itemUpdate: T): Promise<T> {
      const existingItem = await this.get(id)
      if (!existingItem) {
        throw new PublicError(`item to update not found for id: ${id}`, 404)
      }

      const updatedItem = {
        ...existingItem,
        ...itemUpdate,
      }
      await this.set(id, updatedItem)
      return updatedItem
    }

    async delete(id: string): Promise<void> {
      this.items.delete(id)
    }

    async all(): Promise<T[]> {
      return Array.from(this.items.values())
    }
}
