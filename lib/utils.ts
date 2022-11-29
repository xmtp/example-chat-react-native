const b64 = new Array(64);
// Base64 decoding table
const s64 = new Array(123);
// 65..90, 97..122, 48..57, 43, 47
for (let i = 0; i < 64; )
  s64[
    (b64[i] =
      i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : (i - 59) | 43)
  ] = i++;

const invalidEncoding = 'invalid encoding';

export function b64Decode(s: string): Uint8Array {
  const buffer = [];
  let offset = 0;
  let j = 0, // goto index
    t; // temporary
  for (let i = 0; i < s.length; ) {
    let c = s.charCodeAt(i++);
    if (c === 61 && j > 1) break;
    if ((c = s64[c]) === undefined) throw Error(invalidEncoding);
    switch (j) {
      case 0:
        t = c;
        j = 1;
        break;
      case 1:
        //@ts-ignore
        buffer[offset++] = (t << 2) | ((c & 48) >> 4);
        t = c;
        j = 2;
        break;
      case 2:
        //@ts-ignore
        buffer[offset++] = ((t & 15) << 4) | ((c & 60) >> 2);
        t = c;
        j = 3;
        break;
      case 3:
        //@ts-ignore
        buffer[offset++] = ((t & 3) << 6) | c;
        j = 0;
        break;
    }
  }
  if (j === 1) throw Error(invalidEncoding);
  return new Uint8Array(buffer);
}
