export interface ComponentAttributeListProps {
  title: string;
  items: readonly string[];
}

export function ComponentAttributeList({ title, items }: ComponentAttributeListProps) {
  if (items.length === 0) {
    return null;
  }

  const titleId = `${title.toLowerCase().replaceAll(" ", "-")}-title`;

  return (
    <section aria-labelledby={titleId} className="component-catalog-attribute-list">
      <h2 id={titleId}>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
