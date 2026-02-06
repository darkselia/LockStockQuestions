import { onBeforeUnmount, toValue, watchEffect } from 'vue';

type StructuredDataInput = Record<string, unknown> | null | undefined;

export function useStructuredData(id: string, input: StructuredDataInput | (() => StructuredDataInput)) {
  if (typeof document === 'undefined') {
    return;
  }

  const elementId = `ld-json-${id}`;

  watchEffect(() => {
    const value = toValue(input);
    const existing = document.getElementById(elementId) as HTMLScriptElement | null;

    if (!value) {
      existing?.remove();
      return;
    }

    const payload = JSON.stringify(value);

    if (existing) {
      existing.textContent = payload;
      return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = elementId;
    script.textContent = payload;
    document.head.appendChild(script);
  });

  onBeforeUnmount(() => {
    document.getElementById(elementId)?.remove();
  });
}
