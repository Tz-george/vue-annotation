export function UUID(): string {
  const url = URL.createObjectURL(new Blob());
  const uuid = url.toString();
  URL.revokeObjectURL(url);
  return uuid.substr(uuid.lastIndexOf('/') + 1);
}
