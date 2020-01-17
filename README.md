# format ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@danehansen/format.svg) ![npm](https://img.shields.io/npm/dt/@danehansen/format.svg)

The format library contains a collection of formatting methods either written or collected to make my life easier. These methods are not validators, they all work under the assumption that the input is valid already.

## Installation

`npm install --save @danehansen/format`

## Usage

As a module:

    import * as format from '@danehansen/format';

    var zip = '902101234'
    zip = format.zipCode(zip);

In your browser:

    <script src='danehansen-format.min.js'></script>
    <script>
      var format = window.danehansen.format;
      var zip = '902101234'
      zip = format.zipCode(zip);
    </script>

## Methods

- **creditCard**(str:String, secure:_ = '_'):String  
  Accepts a valid 15-16 digit credit card number and puts the spaces in appropriately. Optionally will replace all digits except the last 4 with another character.
- **dollars**(amount:Float, showCents:Boolean = true):String  
  Turns a float into a properly formatted string with commas and dollar sign.
- **expiration**(str:String):String  
  Formats a month/year date as MM/YY.
- **phoneNumber**(str:String, delimiter:String):String  
  Formats a phone number as 1 (234) 567-8910 by default or else with an optional delimiter like 123.456.7891
- **prepend**(str:String, len:uint, char:String = '0'):String  
  Prepends a string with a character until it reaches a minimum length.
- **seperateThousands**(str:\*):String  
  Formats a number or string like 1,234,567,890.
- **time**(h:uint, m:uint, s:uint, ms:uint, delimiter:String = ':'):String  
  Formats a time like 01:02:03:004. If hours or milliseconds are not supplied, they will be left off the string.
- **toRomanNumeral**(num:uint):String  
  Formats a positive integer into roman numerals.
- **toTitleCase**(str:String):String  
  Formats string into title case.
- **unicode**(str:String):String  
  Converts a string to unicode.
- **zipCode**(str:String, country:String = 'us'):String  
  Formats a US zipcode like 12345-6789 or a Canadian one like A1B 2C3.
