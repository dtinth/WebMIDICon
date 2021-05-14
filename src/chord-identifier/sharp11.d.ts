declare module '@dtinth/sharp11-browserified' {
  export namespace note {
    export class Note {}
    export function fromValue(value: number): Note
  }
  export namespace chord {
    export function identifyArray(notes: (note.Note | string)[]): string
  }
}
