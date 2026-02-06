// Extrae habilidades requeridas y opcionales de un texto de requisitos
export function parseRequirements(text: string): { required: string | null; optional: string | null } {
  const lines = text.split('\n');
  let required: string | null = null;
  let optional: string | null = null;

  lines.forEach(line => {
    if (line.startsWith('Habilidades requeridas:')) {
      required = line.replace('Habilidades requeridas:', '').trim();
    } else if (line.startsWith('Habilidades opcionales:')) {
      optional = line.replace('Habilidades opcionales:', '').trim();
    }
  });

  return { required, optional };
}
