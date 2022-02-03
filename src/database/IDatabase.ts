/* eslint-disable no-unused-vars */

export interface IDatabase<T> {
    get(id: string): Promise<T>;

    set(id: string, item: T): Promise<void>;

    update(id: string, item: Partial<T>): Promise<T>;

    delete(id: string): Promise<void>;

    all(): Promise<T[]>;
}
