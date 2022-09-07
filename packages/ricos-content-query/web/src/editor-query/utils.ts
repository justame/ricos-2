import { isRegExp } from 'lodash';
import { fromTiptapNode } from 'ricos-converters';

/**
 * Check if object1 includes object2
 * @param object1 Object
 * @param object2 Object
 */

export function objectIncludes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object1: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object2: Record<string, any>,
  options: { strict: boolean } = { strict: true }
): boolean {
  const keys = Object.keys(object2);

  if (!keys.length) {
    return true;
  }

  return keys.every(key => {
    if (options.strict) {
      return object2[key] === object1[key];
    }

    if (isRegExp(object2[key])) {
      return object2[key].test(object1[key]);
    }

    return object2[key] === object1[key];
  });
}

export const markToDecorations = (schema, marks) => {
  const dummyTextNode = schema.text('dummyText', marks);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decorations = fromTiptapNode(dummyTextNode.toJSON() as any).textData?.decorations;
  return decorations || [];
};
