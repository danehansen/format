import * as format from "../src/format";
import { expect } from "chai";
import fs from "fs";
import path from "path";

const REPEAT = 100;

function random(limitA = 1, limitB = 0, round = false, choke = 1) {
  let total = 0;
  if (!round) {
    for (let i = 0; i < choke; i++) {
      total += Math.random() * ((limitB - limitA) / choke);
    }
    return limitA + total;
  } else {
    const low = Math.ceil(Math.min(limitA, limitB));
    const high = Math.floor(Math.max(limitA, limitB));
    for (let i = 0; i < choke; i++) {
      total += Math.random() * ((high + 1 - low) / choke);
    }
    return Math.floor(low + total);
  }
}

describe("format", function() {
  describe("danehansen-format.min.js", function() {
    it("is minified", function() {
      const min = fs.readFileSync(
        path.join(__dirname, "../danehansen-format.min.js"),
        "utf8"
      );
      expect(min.match(/\n/g)).to.be.null;
    });
  });

  describe("creditCard", function() {
    it("formats a 16 digit securely with default delimiter", function() {
      expect(format.creditCard("x41111111111111 11")).to.equal(
        "**** **** **** 1111"
      );
    });

    it("formats a 16 digit securely with supplied delimiter", function() {
      expect(format.creditCard("41x11111111111111 ", "-")).to.equal(
        "---- ---- ---- 1111"
      );
    });

    it("formats a 16 digit insecurely", function() {
      expect(format.creditCard("41.11111111111111 x", false)).to.equal(
        "4111 1111 1111 1111"
      );
    });

    it("formats a 15 digit securely", function() {
      expect(format.creditCard("3 78 2x82246310005")).to.equal(
        "**** ****** *0005"
      );
    });

    it("formats a X digit securely", function() {
      expect(format.creditCard("1234567890123456789")).to.equal(
        "***************6789"
      );
    });
  });

  describe("dollars", function() {
    it("rounds a number into whole dollars", function() {
      expect(format.dollars(1111.9, false)).to.equal("$1,112");
    });

    it("rounds a string into whole dollars", function() {
      expect(format.dollars("1111.9", false)).to.equal("$1,112");
    });

    it("rounds a number into dollars and cents", function() {
      expect(format.dollars(-1111.899)).to.equal("-$1,111.90");
    });

    it("rounds a string into dollars and cents", function() {
      expect(format.dollars("-1111.899")).to.equal("-$1,111.90");
    });
  });

  describe("expiration", function() {
    it("formats 3 digits", function() {
      expect(format.expiration("123")).to.equal("01/23");
    });

    it("formats 4 digits", function() {
      expect(format.expiration("1234")).to.equal("12/34");
    });

    it("formats 5 digits", function() {
      expect(format.expiration("12345")).to.equal("01/45");
    });

    it("formats 6 digits", function() {
      expect(format.expiration("123456")).to.equal("12/56");
    });
  });

  describe("phoneNumber", function() {
    it("uses defined delimiter with country code", function() {
      expect(format.phoneNumber("12 3a45678910x", ".")).to.equal(
        "1.234.567.8910"
      );
    });

    it("uses defined delimiter without country code", function() {
      expect(format.phoneNumber("2 3a45678910x", ".")).to.equal("234.567.8910");
    });

    it("uses no delimiter with country code", function() {
      expect(format.phoneNumber("12 3a45678910x")).to.equal("1 (234) 567-8910");
    });

    it("uses no delimiter without country code", function() {
      expect(format.phoneNumber("2 3a45678910x")).to.equal("(234) 567-8910");
    });

    it("removes non digits from odd length number", function() {
      expect(format.phoneNumber("12 3a45678910x1112")).to.equal(
        "123456789101112"
      );
    });
  });

  describe("prepend", function() {
    it("adds zeros by default", function() {
      expect(format.prepend(1, 5)).to.equal("00001");
    });

    it("adds supplied character", function() {
      expect(format.prepend("1", 5, ".")).to.equal("....1");
    });

    it("does nothing when length is sufficient", function() {
      const str = "12345";
      expect(format.prepend(str, 5)).to.equal(str);
    });
  });

  describe("seperateThousands", function() {
    it("rounds and commaifies a string", function() {
      expect(format.seperateThousands("12345678.9")).to.equal("12,345,679");
    });

    it("rounds and commaifies a number", function() {
      expect(format.seperateThousands(12345.6789)).to.equal("12,346");
    });
  });

  describe("time", function() {
    it("formats with custom delimiter", function() {
      for (let i = 0; i < REPEAT; i++) {
        let m = random(0, 120, true);
        let s = random(0, 120, true);
        const result = format.time(null, m, s, null, " - ");
        while (s >= 60) {
          s -= 60;
          m++;
        }
        expect(result).to.equal(
          `${format.prepend(m, 2)} - ${format.prepend(s, 2)}`
        );
      }
    });

    it("formats with no hours, no milliseconds", function() {
      for (let i = 0; i < REPEAT; i++) {
        let m = random(0, 120, true);
        let s = random(0, 120, true);
        const result = format.time(null, m, s);
        while (s >= 60) {
          s -= 60;
          m++;
        }
        expect(result).to.equal(
          `${format.prepend(m, 2)}:${format.prepend(s, 2)}`
        );
      }
    });

    it("formats with hours, no milliseconds", function() {
      for (let i = 0; i < REPEAT; i++) {
        let h = random(0, 48, true);
        let m = random(0, 120, true);
        let s = random(0, 120, true);
        const result = format.time(h, m, s);
        while (s >= 60) {
          s -= 60;
          m++;
        }
        while (m >= 60) {
          m -= 60;
          h++;
        }
        expect(result).to.equal(
          `${format.prepend(h, 2)}:${format.prepend(m, 2)}:${format.prepend(
            s,
            2
          )}`
        );
      }
    });

    it("formats with hours and milliseconds", function() {
      for (let i = 0; i < REPEAT; i++) {
        let h = random(0, 48, true);
        let m = random(0, 120, true);
        let s = random(0, 120, true);
        let ms = random(0, 2000, true);
        const result = format.time(h, m, s, ms);
        while (ms >= 1000) {
          ms -= 1000;
          s++;
        }
        while (s >= 60) {
          s -= 60;
          m++;
        }
        while (m >= 60) {
          m -= 60;
          h++;
        }
        expect(result).to.equal(
          `${format.prepend(h, 2)}:${format.prepend(m, 2)}:${format.prepend(
            s,
            2
          )}:${format.prepend(ms, 3)}`
        );
      }
    });

    it("formats with no hours and with milliseconds", function() {
      for (let i = 0; i < REPEAT; i++) {
        let m = random(0, 120, true);
        let s = random(0, 120, true);
        let ms = random(0, 2000, true);
        const result = format.time(null, m, s, ms);
        while (ms >= 1000) {
          ms -= 1000;
          s++;
        }
        while (s >= 60) {
          s -= 60;
          m++;
        }
        expect(result).to.equal(
          `${format.prepend(m, 2)}:${format.prepend(s, 2)}:${format.prepend(
            ms,
            3
          )}`
        );
      }
    });
  });

  describe("toTitleCase", function() {
    it("changes string to title case", function() {
      expect(format.toTitleCase("aB c d.ef . GhIjK")).to.equal(
        "Ab C D.Ef . Ghijk"
      );
    });
  });

  describe("unicode", function() {
    it("changes string to unicode", function() {
      expect(format.unicode("abc123")).to.equal(
        "&#97;&#98;&#99;&#49;&#50;&#51;"
      );
    });
  });

  describe("zipCode", function() {
    it("formats 5 digit US zip codes", function() {
      expect(format.zipCode("1.23 45a")).to.equal("12345");
    });

    it("formats 9 digit US zip codes", function() {
      expect(format.zipCode("123 45.a6-78 9")).to.equal("12345-6789");
    });

    it("formats candadian zip codes", function() {
      expect(format.zipCode("a1a1a1b2", "ca")).to.equal("A1A 1A1");
    });
  });

  describe("toRomanNumeral", function() {
    it("correctly converts numbers to roman numbers", function() {
      expect(format.toRomanNumeral(1)).to.equal("i");
      expect(format.toRomanNumeral(2)).to.equal("ii");
      expect(format.toRomanNumeral(3)).to.equal("iii");
      expect(format.toRomanNumeral(4)).to.equal("iv");
      expect(format.toRomanNumeral(5)).to.equal("v");
      expect(format.toRomanNumeral(6)).to.equal("vi");
      expect(format.toRomanNumeral(7)).to.equal("vii");
      expect(format.toRomanNumeral(8)).to.equal("viii");
      expect(format.toRomanNumeral(9)).to.equal("ix");
      expect(format.toRomanNumeral(10)).to.equal("x");
      expect(format.toRomanNumeral(20)).to.equal("xx");
      expect(format.toRomanNumeral(30)).to.equal("xxx");
      expect(format.toRomanNumeral(40)).to.equal("xl");
      expect(format.toRomanNumeral(50)).to.equal("l");
      expect(format.toRomanNumeral(60)).to.equal("lx");
      expect(format.toRomanNumeral(70)).to.equal("lxx");
      expect(format.toRomanNumeral(80)).to.equal("lxxx");
      expect(format.toRomanNumeral(90)).to.equal("xc");
      expect(format.toRomanNumeral(100)).to.equal("c");
      expect(format.toRomanNumeral(200)).to.equal("cc");
      expect(format.toRomanNumeral(300)).to.equal("ccc");
      expect(format.toRomanNumeral(400)).to.equal("cd");
      expect(format.toRomanNumeral(500)).to.equal("d");
      expect(format.toRomanNumeral(600)).to.equal("dc");
      expect(format.toRomanNumeral(700)).to.equal("dcc");
      expect(format.toRomanNumeral(800)).to.equal("dccc");
      expect(format.toRomanNumeral(900)).to.equal("cm");
      expect(format.toRomanNumeral(1000)).to.equal("m");
      expect(format.toRomanNumeral(39)).to.equal("xxxix");
      expect(format.toRomanNumeral(246)).to.equal("ccxlvi");
      expect(format.toRomanNumeral(789)).to.equal("dcclxxxix");
      expect(format.toRomanNumeral(2421)).to.equal("mmcdxxi");
      expect(format.toRomanNumeral(160)).to.equal("clx");
      expect(format.toRomanNumeral(207)).to.equal("ccvii");
      expect(format.toRomanNumeral(1009)).to.equal("mix");
      expect(format.toRomanNumeral(1066)).to.equal("mlxvi");
      expect(format.toRomanNumeral(1776)).to.equal("mdcclxxvi");
      expect(format.toRomanNumeral(1954)).to.equal("mcmliv");
      expect(format.toRomanNumeral(2014)).to.equal("mmxiv");
      expect(format.toRomanNumeral(2020)).to.equal("mmxx");
    });
  });
});
