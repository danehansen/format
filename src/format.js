const NON_DIGITS = /\D/g;
const NON_DIGITS_AND_LETTERS = /[^A-Za-z0-9]/g;
const EVERY_3 = /\d{1,3}(?=(\d{3})+(?!\d))/g;
const EVERY_4 = /\S{1,4}(?=(\S{4})+(?!\S))/g;
const NOT_LAST_4 = /.(?=.{4,}$)/g;
const FIRST_LETTER_OF_WORD = /\b[a-z]/g;

export function creditCard(str, secure = "*") {
  str = str.replace(NON_DIGITS, "");
  if (secure) {
    str = str.replace(NOT_LAST_4, secure);
  }

  switch (str.length) {
    case 16: // VISA, Discover, MasterCard
      return str.replace(EVERY_4, "$& ");
    case 15: // AmEx
      return `${str.slice(0, 4)} ${str.slice(4, 10)} ${str.slice(10, 15)}`;
    default:
      // odd cards
      return str;
  }
}

export function dollars(amount, showCents = true) {
  const negative = amount < 0;
  if (negative) {
    amount = Math.abs(amount);
  }

  let dollars;
  let cents;
  if (showCents) {
    const fixed = amount.toFixed(2);
    const { length } = fixed;
    dollars = fixed.slice(0, length - 3);
    cents = fixed.slice(length - 3);
  } else {
    dollars = Math.round(amount);
    cents = "";
  }

  return `${negative ? "-" : ""}$${seperateThousands(dollars)}${cents}`;
}

export function expiration(str) {
  str = str.replace(NON_DIGITS, "");
  const { length } = str;
  const month = prepend(str.slice(0, length - (length > 4 ? 4 : 2)), 2);
  const year = str.slice(length - 2, length);

  return `${month}/${year}`;
}

export function phoneNumber(str, delimiter) {
  str = str.replace(NON_DIGITS, "");
  const { length } = str;

  if (length === 11 || length === 10) {
    const countryCode = str.slice(length - 11, length - 10);
    const areaCode = str.slice(length - 10, length - 7);
    const prefix = str.slice(length - 7, length - 4);
    const line = str.slice(length - 4, length);
    if (delimiter) {
      str = `${areaCode}${delimiter}${prefix}${delimiter}${line}`;
      const array = [areaCode, prefix, line];
      if (countryCode) {
        str = `${countryCode}${delimiter}${str}`;
      }
      return str;
    }

    str = `(${areaCode}) ${prefix}-${line}`;
    if (countryCode) {
      str = `${countryCode} ${str}`;
    }
    return str;
  } else {
    return str;
  }
}

export function prepend(str, len, char = "0") {
  str = String(str);
  const { length } = str;
  if (length >= len) {
    return str;
  }
  return `${char.repeat(len - length)}${str}`;
}

export function seperateThousands(str) {
  return String(parseFloat(Math.abs(Math.round(str)))).replace(EVERY_3, "$&,");
}

export function time(h, m, s, ms, delimiter = ":") {
  const useH = !isNaN(parseInt(h));
  const useMS = !isNaN(parseInt(ms));

  if (useMS) {
    s += Math.floor(ms / 1000);
    ms = ms % 1000;
    ms = prepend(ms, 3);
  }

  m += Math.floor(s / 60);
  s = s % 60;
  s = prepend(s, 2);

  if (useH) {
    h += Math.floor(m / 60);
    m = m % 60;
    h = prepend(h, 2);
  }

  m = prepend(m, 2);

  let str = `${m}${delimiter}${s}`;

  if (useH) {
    str = `${h}${delimiter}${str}`;
  }
  if (useMS) {
    str = `${str}${delimiter}${ms}`;
  }

  return str;
}

// calculates if a number is a power of another number, but compensates for poor javascript math
const ROUND = 100;
function isPowerOf(value, power) {
  let a = Math.log(value) / Math.log(power);
  a *= ROUND;
  a = Math.round(a);
  a /= ROUND;
  return a % 1 === 0;
}
const ROMAN_NUMERALS = [
  { name: "m", value: 1000 },
  { name: "d", value: 500 },
  { name: "c", value: 100 },
  { name: "l", value: 50 },
  { name: "x", value: 10 },
  { name: "v", value: 5 },
  { name: "i", value: 1 }
];
export function toRomanNumeral(int) {
  let remainder = Math.floor(int);
  let result = "";
  let index = 0;
  while (remainder) {
    let name;
    let value;
    ({ name, value } = ROMAN_NUMERALS[index]);
    while (remainder >= value) {
      result += name;
      remainder -= value;
    }
    if (value > 1) {
      let next;
      if (isPowerOf(value, 10)) {
        next = ROMAN_NUMERALS[index + 2];
      } else {
        next = ROMAN_NUMERALS[index + 1];
      }
      name = `${next.name}${name}`;
      value -= next.value;
      while (remainder >= value) {
        result += name;
        remainder -= value;
      }
      index++;
    }
  }
  return result;
}

export function toTitleCase(str) {
  return str.toLowerCase().replace(FIRST_LETTER_OF_WORD, upperCaseify);
}

function upperCaseify(letter) {
  return letter.toUpperCase();
}

export function unicode(str) {
  let unicode = "";
  for (let i = 0, iLen = str.length; i < iLen; i++) {
    unicode += `&#${str.charCodeAt(i)};`;
  }
  return unicode;
}

export function zipCode(str, country) {
  switch (country) {
    case "ca":
      str = str.replace(NON_DIGITS_AND_LETTERS, "").toUpperCase();
      return `${str.slice(0, 3)} ${str.slice(3, 6)}`;
    default:
      str = str.replace(NON_DIGITS, "");
      if (str.length === 9) {
        return `${str.slice(0, 5)}-${str.slice(5, 9)}`;
      }
      return str;
  }
}
