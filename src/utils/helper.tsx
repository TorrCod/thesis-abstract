export function isObjectIncluded(obj1: any, obj2: any) {
  return Object.entries(obj1).every(([key, value]) => obj2[key] === value);
}
