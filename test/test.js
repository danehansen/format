import * as format from '../src/format'
import { expect } from 'chai'

const REPEAT = 100

function random(limitA = 1, limitB = 0, round = false, choke = 1) {
  let total = 0
  if (!round) {
    for(let i = 0; i < choke; i++) {
      total += Math.random() * ((limitB - limitA) / choke)
    }
    return limitA + total
  } else {
    const low = Math.ceil(Math.min(limitA, limitB))
    const high = Math.floor(Math.max(limitA, limitB))
    for (let i = 0; i < choke; i++) {
      total += Math.random() * ((high + 1 - low) / choke)
    }
    return Math.floor(low + total)
  }
}

describe('format', function() {
  describe('creditCard', function() {
    it('formats a 16 digit securely with default delimiter', function() {
      expect(format.creditCard('x41111111111111 11')).to.equal('**** **** **** 1111')
    })

    it('formats a 16 digit securely with supplied delimiter', function() {
      expect(format.creditCard('41x11111111111111 ', '-')).to.equal('---- ---- ---- 1111')
    })

    it('formats a 16 digit insecurely', function() {
      expect(format.creditCard('41.11111111111111 x', false)).to.equal('4111 1111 1111 1111')
    })

    it('formats a 15 digit securely', function() {
      expect(format.creditCard('3 78 2x82246310005')).to.equal('**** ****** *0005')
    })

    it('formats a X digit securely', function() {
      expect(format.creditCard('1234567890123456789')).to.equal('***************6789')
    })
  })

  describe('dollars', function() {
    it('rounds a number into whole dollars', function() {
      expect(format.dollars(1111.9, false)).to.equal('$1,112')
    })

    it('rounds a string into whole dollars', function() {
      expect(format.dollars('1111.9', false)).to.equal('$1,112')
    })

    it('rounds a number into dollars and cents', function() {
      expect(format.dollars(-1111.899)).to.equal('-$1,111.90')
    })

    it('rounds a string into dollars and cents', function() {
      expect(format.dollars('-1111.899')).to.equal('-$1,111.90')
    })
  })

  describe('expiration', function() {
    it('formats 3 digits', function() {
      expect(format.expiration('123')).to.equal('01/23')
    })

    it('formats 4 digits', function() {
      expect(format.expiration('1234')).to.equal('12/34')
    })

    it('formats 5 digits', function() {
      expect(format.expiration('12345')).to.equal('01/45')
    })

    it('formats 6 digits', function() {
      expect(format.expiration('123456')).to.equal('12/56')
    })
  })


  describe('phoneNumber', function() {
    it('uses defined delimiter with country code', function() {
      expect(format.phoneNumber('12 3a45678910x', '.')).to.equal('1.234.567.8910')
    })

    it('uses defined delimiter without country code', function() {
      expect(format.phoneNumber('2 3a45678910x', '.')).to.equal('234.567.8910')
    })

    it('uses no delimiter with country code', function() {
      expect(format.phoneNumber('12 3a45678910x')).to.equal('1 (234) 567-8910')
    })

    it('uses no delimiter without country code', function() {
      expect(format.phoneNumber('2 3a45678910x')).to.equal('(234) 567-8910')
    })

    it('removes non digits from odd length number', function() {
      expect(format.phoneNumber('12 3a45678910x1112')).to.equal('123456789101112')
    })
  })

  describe('prepend', function() {
    it('adds zeros by default', function() {
      expect(format.prepend(1, 5)).to.equal('00001')
    })

    it('adds supplied character', function() {
      expect(format.prepend('1', 5, '.')).to.equal('....1')
    })

    it('does nothing when length is sufficient', function() {
      const str = '12345'
      expect(format.prepend(str, 5)).to.equal(str)
    })
  })

  describe('seperateThousands', function() {
    it('rounds and commaifies a string', function() {
      expect(format.seperateThousands('12345678.9')).to.equal('12,345,679')
    })

    it('rounds and commaifies a number', function() {
      expect(format.seperateThousands(12345.6789)).to.equal('12,346')
    })
  })

  describe('time', function() {
    it('formats with custom delimiter', function() {
      for (let i = 0; i < REPEAT; i++) {
        let m = random(0, 120, true)
        let s = random(0, 120, true)
        const result = format.time(null, m, s, null, ' - ')
        while (s >= 60) {
          s -= 60
          m++
        }
        expect(result).to.equal(`${format.prepend(m, 2)} - ${format.prepend(s, 2)}`)
      }
    })

    it('formats with no hours, no milliseconds', function() {
      for (let i = 0; i < REPEAT; i++) {
        let m = random(0, 120, true)
        let s = random(0, 120, true)
        const result = format.time(null, m, s)
        while (s >= 60) {
          s -= 60
          m++
        }
        expect(result).to.equal(`${format.prepend(m, 2)}:${format.prepend(s, 2)}`)
      }
    })

    it('formats with hours, no milliseconds', function() {
      for (let i = 0; i < REPEAT; i++) {
        let h = random(0, 48, true)
        let m = random(0, 120, true)
        let s = random(0, 120, true)
        const result = format.time(h, m, s)
        while (s >= 60) {
          s -= 60
          m++
        }
        while (m >= 60) {
          m -= 60
          h++
        }
        expect(result).to.equal(`${format.prepend(h, 2)}:${format.prepend(m, 2)}:${format.prepend(s, 2)}`)
      }
    })

    it('formats with hours and milliseconds', function() {
      for (let i = 0; i < REPEAT; i++) {
        let h = random(0, 48, true)
        let m = random(0, 120, true)
        let s = random(0, 120, true)
        let ms = random(0, 2000, true)
        const result = format.time(h, m, s, ms)
        while (ms >= 1000) {
          ms -= 1000
          s++
        }
        while (s >= 60) {
          s -= 60
          m++
        }
        while (m >= 60) {
          m -= 60
          h++
        }
        expect(result).to.equal(`${format.prepend(h, 2)}:${format.prepend(m, 2)}:${format.prepend(s, 2)}:${format.prepend(ms, 3)}`)
      }
    })

    it('formats with no hours and with milliseconds', function() {
      for (let i = 0; i < REPEAT; i++) {
        let m = random(0, 120, true)
        let s = random(0, 120, true)
        let ms = random(0, 2000, true)
        const result = format.time(null, m, s, ms)
        while (ms >= 1000) {
          ms -= 1000
          s++
        }
        while (s >= 60) {
          s -= 60
          m++
        }
        expect(result).to.equal(`${format.prepend(m, 2)}:${format.prepend(s, 2)}:${format.prepend(ms, 3)}`)
      }
    })
  })

  describe('toTitleCase', function() {
    it('changes string to title case', function() {
      expect(format.toTitleCase('aB c d.ef . GhIjK')).to.equal('Ab C D.Ef . Ghijk')
    })
  })

  describe('unicode', function() {
    it('changes string to unicode', function() {
      expect(format.unicode('abc123')).to.equal('&#97;&#98;&#99;&#49;&#50;&#51;')
    })
  })

  describe('zipCode', function() {
    it('formats 5 digit US zip codes', function() {
      expect(format.zipCode('1.23 45a')).to.equal('12345')
    })

    it('formats 9 digit US zip codes', function() {
      expect(format.zipCode('123 45.a6-78 9')).to.equal('12345-6789')
    })

    it('formats candadian zip codes', function() {
      expect(format.zipCode('a1a1a1b2', 'ca')).to.equal('A1A 1A1')
    })
  })
})
