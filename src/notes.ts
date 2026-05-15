/** Domain Model: the Note. */

export class NoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoteError";
  }
}

export class NoteNotFound extends NoteError {
  constructor(message: string) {
    super(message);
    this.name = "NoteNotFound";
  }
}

export interface NoteData {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

export class Note implements NoteData {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly body: string,
    public readonly created_at: string,
  ) {}

  static new(title: string, body: string, existing: NoteData[]): Note {
    const nextId = Math.max(0, ...existing.map((n) => n.id)) + 1;
    return new Note(
      nextId,
      title,
      body,
      new Date().toISOString().split(".")[0] + "Z", // ISO 8601 without milliseconds for consistency
    );
  }

  toDict(): NoteData {
    return {
      id: this.id,
      title: this.title,
      body: this.body,
      created_at: this.created_at,
    };
  }
}
