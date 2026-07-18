export interface ConsoleSerializationLimits {
  readonly maxCollectionItems: number;
  readonly maxDepth: number;
  readonly maxStringLength: number;
}

/**
 * Converts arbitrary runtime values into bounded text without invoking accessors.
 * This function is injected into the isolated iframe monitor, never executed by the host page.
 */
export function serializeConsoleValue(
  value: unknown,
  limits: ConsoleSerializationLimits,
): string {
  const seen = new WeakSet<object>();

  function truncate(input: string): string {
    return input.length > limits.maxStringLength
      ? `${input.slice(0, limits.maxStringLength - 1)}…`
      : input;
  }

  function serialize(current: unknown, depth = 0): string {
    try {
      if (current === null) return "null";

      if (typeof current === "string") return truncate(current);
      if (typeof current === "number" || typeof current === "boolean") return String(current);
      if (typeof current === "undefined") return "undefined";
      if (typeof current === "bigint") return `${String(current)}n`;
      if (typeof current === "symbol") return String(current);
      if (typeof current === "function") return "[Function]";
      if (current instanceof Error) return truncate(`${current.name}: ${current.message}`);
      if (depth >= limits.maxDepth) return "[Max depth]";
      if (typeof current !== "object") return "[Unserializable]";
      if (seen.has(current)) return "[Circular]";

      seen.add(current);
      try {
        if (Array.isArray(current)) {
          const values = current
            .slice(0, limits.maxCollectionItems)
            .map((entry) => serialize(entry, depth + 1));
          if (current.length > limits.maxCollectionItems) values.push("…");
          return `[${values.join(", ")}]`;
        }

        if (Object.prototype.toString.call(current) !== "[object Object]") {
          return truncate(Object.prototype.toString.call(current));
        }

        const keys = Object.keys(current).slice(0, limits.maxCollectionItems);
        const values = keys.map((key) => {
          const descriptor = Object.getOwnPropertyDescriptor(current, key);
          const serializedValue =
            descriptor !== undefined && "value" in descriptor
              ? serialize(descriptor.value, depth + 1)
              : "[Accessor]";
          return `${key}: ${serializedValue}`;
        });
        if (Object.keys(current).length > limits.maxCollectionItems) values.push("…");
        return `{${values.join(", ")}}`;
      } finally {
        seen.delete(current);
      }
    } catch {
      return "[Unserializable]";
    }
  }

  return serialize(value);
}
