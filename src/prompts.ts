/** Interactive prompting utility. */
import readline from "node:readline/promises";

export async function prompt(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const query = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    const answer = await rl.question(query);
    return answer.trim() || defaultValue || "";
  } finally {
    rl.close();
  }
}

export async function promptRequired(question: string): Promise<string> {
  let answer = "";
  while (!answer) {
    answer = await prompt(question);
    if (!answer) {
      process.stdout.write("Error: This field is required.\n");
    }
  }
  return answer;
}

export async function promptList(question: string): Promise<string[]> {
  const answer = await promptRequired(`${question} (comma-separated)`);
  return answer.split(",").map(s => s.trim()).filter(s => s.length > 0);
}
