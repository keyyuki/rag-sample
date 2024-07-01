export function createSlug(name: string) {
  // remove all special characters from a string
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}
