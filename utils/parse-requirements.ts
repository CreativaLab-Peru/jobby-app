// Extrae las habilidades requeridas y opcionales de un texto de requisitos
export function parseRequirements(text: string): { required: string | null; optional: string | null } {
  const lines = text.split('\n');
  let required: string | null = null;
  let optional: string | null = null;

  let currentSection: 'required' | 'optional' | null = null;

  // Allow both Spanish and English headers, case-insensitively
  const REQUIRED_PREFIXES = ['habilidades requeridas:', 'required skills:'];
  const OPTIONAL_PREFIXES = ['habilidades opcionales:', 'optional skills:'];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const lowerLine = line.toLowerCase();

    const requiredPrefix = REQUIRED_PREFIXES.find((prefix) => lowerLine.startsWith(prefix));
    if (requiredPrefix) {
      currentSection = 'required';
      const content = line.slice(requiredPrefix.length).trim();
      if (content) {
        required = required ? `${required} ${content}` : content;
      }
      continue;
    }

    const optionalPrefix = OPTIONAL_PREFIXES.find((prefix) => lowerLine.startsWith(prefix));
    if (optionalPrefix) {
      currentSection = 'optional';
      const content = line.slice(optionalPrefix.length).trim();
      if (content) {
        optional = optional ? `${optional} ${content}` : content;
      }
      continue;
    }

    // Accumulate subsequent lines for the current section until another header or end of text
    if (currentSection && line.length > 0) {
      if (currentSection === 'required') {
        required = required ? `${required} ${line}` : line;
      } else if (currentSection === 'optional') {
        optional = optional ? `${optional} ${line}` : line;
      }
    }
  }
  return { required, optional };
}
