const containsField = (item, [field, contains]) => {
  if (typeof (contains) !== 'string' || (contains.toLowerCase() !== 'false' && contains.toLowerCase() !== 'true')) return false
  return !!item[field] === JSON.parse(contains)
}

const matchFieldValue = (item, [field, value]) => {
  if (!containsField(item, [field, 'true'])) return false
  return item[field] === value
}

const queryMapper = (queryFunction) => {
  switch (queryFunction.toLowerCase()) {
    case 'contains':
      return containsField
    case 'matchfieldvalue':
      return matchFieldValue
  }
}

const queryResolver = (data, queries, amount) => {
  const returnArray = []
  data.forEach(item => {
    if (returnArray.length === amount) return

    let addToArray = true
    queries.forEach(query => {
      if (!queryMapper(query.queryFunction)(item, query.queryArguments)) addToArray = false
    })

    addToArray && returnArray.push(item)
  })

  return returnArray
}

module.exports = { queryResolver, queryMapper, containsField, matchFieldValue }
