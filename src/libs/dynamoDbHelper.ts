
/*
 * Custom DynamoDB util method
 * from: https://www.npmjs.com/package/sls-micro-utils
 */
export const updateExpression = (obj) => {
  const setExpressions = []
  const removeExpressions = []
  let expression = ''
  const values = {}
  const attributeName = {}

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined' && obj[key] !== '') {
      setExpressions.push(` #update_${key}= :${key}`)
      values[`:${key}`] = obj[key]
    } else {
      removeExpressions.push(` #update_${key}`)
    }
    attributeName[`#update_${key}`] = key
  })

  if (setExpressions.length > 0) {
    expression += `SET ${setExpressions.join(',')}`
  }
  if (removeExpressions.length > 0) {
    expression += ` REMOVE ${removeExpressions.join(',')}`
  }

  return {
    values: Object.keys(values).length ? values : undefined,
    attribute_name: attributeName,
    expression,
  }
}
