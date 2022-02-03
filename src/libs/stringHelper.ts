
// from: https://stackoverflow.com/a/40064897
export function countCharacters(char: string, string: string) {
  return string.split('')
    .reduce((acc, ch) => (ch === char ? acc + 1 : acc), 0)
}
