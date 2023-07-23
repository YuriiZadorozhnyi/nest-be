export function fullTextSearch(text: string) {
  return text ? { $text: { $search: text } } : {};
}

export function partialTextSearch(searchFields: string[], text: string) {
  const searchFieldsQuery = searchFields.map((searchField: string) => {
    return { [searchField]: { $regex: text, $options: 'i' } };
  });
  return text
    ? {
        $or: searchFieldsQuery,
      }
    : {};
}
