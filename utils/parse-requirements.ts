// Extrae las habilidades requeridas y opcionales de un texto de requisitos
export function parseRequirements(text: string): { required: string | null; optional: string | null } {
  const lines = text.split('\n');
  let required: string | null = null;
  let optional: string | null = null;

  let currentSection: 'required' | 'optional' | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('Habilidades requeridas:')) {
      currentSection = 'required';
      const content = line.replace('Habilidades requeridas:', '').trim();
      if (content) {
        required = required ? `${required} ${content}` : content;
      }
      continue;
    }

    if (line.startsWith('Habilidades opcionales:')) {
      currentSection = 'optional';
      const content = line.replace('Habilidades opcionales:', '').trim();
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
