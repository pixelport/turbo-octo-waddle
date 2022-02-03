import * as AWS from 'aws-sdk'

import { IDatabase } from './IDatabase'
import PublicError from '../libs/PublicError'
import { updateExpression } from '../libs/dynamoDbHelper'

const dynamodbOfflineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:4021',
}

const docClient = new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)

export default class DynamoDb<T> implements IDatabase<T> {
    tableName: string

    async get(id: string): Promise<T> {
      const params = {
        TableName: this.tableName,
        Key: {
          id,
        },
      }
      const { Item: item } = await docClient.get(params).promise()
      return item as T
    }

    async set(id: string, item: T): Promise<void> {
      const params = {
        TableName: this.tableName,
        Item: {
          ...item,
          id,
        },
      }
      await docClient.put(params).promise()
    }

    async update(id: string, itemUpdate: Partial<T>): Promise<T> {
      const updateParams = updateExpression(itemUpdate)

      const params = {
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: updateParams.expression,
        ExpressionAttributeValues: {
          ...updateParams.values,
        },
        ExpressionAttributeNames: updateParams.attribute_name,
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'ALL_NEW',
      }

      try {
        const { Attributes: updatedItem } = await docClient.update(params).promise()
        return updatedItem as T
      } catch (e) {
        // check if item to update didn't exist
        if (e.code === 'ConditionalCheckFailedException') {
          throw new PublicError(`item to update not found for id: ${id}`, 404)
        }
        throw e
      }
    }

    async delete(id: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: {
          id,
        },
      }
      await docClient.delete(params).promise()
    }

    async all(): Promise<T[]> {
      const params = {
        TableName: this.tableName,
      }
      // Note: 1MB limit, multi scan is not implemented yet
      const { Items: items } = await docClient.scan(params).promise()
      return items as T[]
    }

    constructor(tableName: string) {
      this.tableName = tableName
    }
}
