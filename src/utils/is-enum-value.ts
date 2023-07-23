export function isEnumValue<T>(
  enumType: T,
): (token: unknown) => token is T[keyof T] {
  const keys = Object.keys(enumType).filter((k) => {
    return !/^\d/.test(k);
  });
  const values = keys.map((k) => {
    return (enumType as any)[k];
  });
  return (token: unknown): token is T[keyof T] => {
    return values.includes(token);
  };
}
