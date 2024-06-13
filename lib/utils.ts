import { nanoid } from 'nanoid'

const createIdx = (prefix = '', length = 40) => {
  const randomPart = nanoid(length)
  return prefix ? `${prefix}_${randomPart}` : randomPart
}

export { createIdx }
