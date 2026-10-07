# @formfusion/vat

Set of validation rules for worldwide VAT numbers.

A zero-dependency lookup table of **68 country-specific regex patterns** for validating VAT (Value Added Tax) identification numbers. Every pattern is anchored and works directly as an HTML [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern) attribute value, so you can use it with plain HTML, React, FormFusion, or `new RegExp()`.

## Why

VAT number formats differ per country. Germany is `DE` plus nine digits. The UK accepts several legacy formats (`GB123 4567 89`, and the `GD`/`HA` prefixed ranges). Norway ends in the literal `MVA`. Belarus uses a Cyrillic `УНП` prefix. Brazil uses dotted and slashed notation. Every app that collects a VAT number ends up re-implementing and re-maintaining this table.

This package ships it as one flat object so you don't have to.

## Installation

```bash
npm install @formfusion/vat
```

```bash
yarn add @formfusion/vat
```

## Usage

The package exports a single default object mapping lowercase ISO 3166-1 alpha-2 country codes to regex **strings**.

### ES modules

```js
import vat from '@formfusion/vat';

console.log(vat.de); // "^(DE)?\\d{9}$"
```

### CommonJS

```js
const vat = require('@formfusion/vat').default;

new RegExp(vat.de).test('DE123456789'); // true
new RegExp(vat.de).test('DE12345678'); // false
```

### Plain HTML

The patterns are valid `pattern` attribute values, so they work without any JavaScript:

```html
<label for="vat">VAT number (Germany)</label>
<input id="vat" name="vat" type="text" pattern="^(DE)?\d{9}$" required />
```

### With FormFusion

FormFusion passes unknown `type` values straight through to the input's `pattern` attribute, so you can hand it a pattern directly:

```jsx
import React from 'react';
import { Form, Input } from 'formfusion';
import 'formfusion/style.css';
import vat from '@formfusion/vat';

const MyForm = () => (
  <Form onSubmit={(data) => console.log('Submitted', data)}>
    <Input id="vat" name="vat" type={vat.de} label="VAT number" required />
    <button type="submit">Submit</button>
  </Form>
);
```

Patterns compose with FormFusion's `rules` combinators if you need to accept more than one country:

```jsx
import { Input, rules } from 'formfusion';
import vat from '@formfusion/vat';

// Accept either a German or an Austrian VAT number
<Input name="vat" type={rules.existIn([vat.de, vat.at])} />

// Require the DE prefix
<Input name="vat" type={rules.startsWith('DE') + vat.de} />
```

### Dynamic country selection

```jsx
const [country, setCountry] = useState('de');

<Select name="country" value={country} onChange={setCountry}>
  {Object.keys(vat).map((code) => (
    <option key={code} value={code}>
      {code.toUpperCase()}
    </option>
  ))}
</Select>

{vat[country] ? (
  <Input name="vat" type={vat[country]} label="VAT number" required />
) : (
  <Input name="vat" type="text" label="VAT number" required />
)}
```

### Standalone validation

```js
import vat from '@formfusion/vat';

export function isValidVat(value, country) {
  const pattern = vat[String(country).toLowerCase()];

  if (!pattern) return false;         // unknown country
  if (pattern === null) return true;  // pt / ch -> no rule provided
  return new RegExp(pattern).test(value);
}

isValidVat('DE123456789', 'DE'); // true
isValidVat('DE12345678', 'de'); // false
```

### TypeScript

Typings are hand-written in `index.d.ts` and mirror the lowercase keys via a mapped type. Because the declaration uses `export =`, you need `esModuleInterop` or `allowSyntheticDefaultImports`.

```ts
import vat from '@formfusion/vat';

const de: string = vat.de;
// @ts-expect-error - unknown country
const xx: string = vat.xx;
```

## API

The export is a plain object with no functions or classes:

```ts
{ [countryCode: string]: string | null }
```

Country codes are **lowercase** (`de`, `gb`, `br`). Lookups are case-sensitive, so normalize user input first.

The country prefix is **optional in every pattern**. `vat.de` matches both `DE123456789` and `123456789`.

Coverage: 27 EU member states, 23 non-EU countries, 18 Latin American countries. A few entries deviate from the obvious prefix. Greece is keyed `el` (the EU-standard prefix), not `gr`, and Belarus is keyed `by` with a Cyrillic `УНП` prefix.

Enumerate the available codes at runtime with `Object.keys(vat)`.

## Caveats

Read these before relying on the patterns.

**Format only, no checksum.** These are shape checks. There is no mod-97 for Germany, no digit-sum check for France, Netherlands or Poland, and no VIES lookup. A well-formed number that does not exist will pass. For authoritative verification you need the EU's VIES service or your local tax authority.

**`pt` and `ch` are `null`.** No pattern is provided for Portugal or Switzerland. `new RegExp(vat.pt)` throws. Guard before use.

**`hn` and `pa` are effectively no-ops.** `^(HN)?$` and `^(PA)?$` match the empty string, so they accept anything. They are placeholders.

**Some dots are wildcards.** `id`, `br`, and `do` use unescaped `.`, which matches any character rather than a literal period. This is intentional so that both `12.345.678/0001-95` and `12-345-678/0001-95` validate.

**Spaces are significant.** `gb` and `ph` patterns require literal single spaces. Normalize input if users may paste unspaced values.

**Incomplete typings.** `index.d.ts` declares 66 of the 68 keys; `pt` and `ch` are absent from the type declarations.

## Development

```bash
git clone https://github.com/mitevskasara/formfusion-vat.git
cd formfusion-vat
npm install
npm run build
```

### How it works

All source lives in [`src/index.js`](src/index.js) as a single object of uppercase country codes. The last step lowercases every key before exporting, so `AT` becomes `at`.

[`esbuild.js`](esbuild.js) bundles that into a minified CommonJS `index.js` at the repo root, targeting Node 14. Consumers get the built file, so **changes are not live until you rebuild and commit `index.js`**:

```bash
npm run build
```

### Commit convention

This repo follows [Conventional Commits](https://www.conventionalcommits.org/), and `CHANGELOG.md` is generated from those subjects:

```
Feat: add Bolivian VAT pattern
Fix: escape wildcards in Brazilian pattern
```

### Adding a country

1. Add the entry to `src/index.js` under the appropriate region comment, using an uppercase country code.
2. Add the lowercase counterpart to the `Vat` type in `index.d.ts`.
3. Run `npm run build` and commit the regenerated `index.js`.
4. Add a test in the FormFusion repo under `src/__tests__/vat/`.

## Related packages

Part of the FormFusion family of extracted validation rule sets:

- [`@formfusion/postcodes`](https://www.npmjs.com/package/@formfusion/postcodes)
- [`@formfusion/licence-plates`](https://www.npmjs.com/package/@formfusion/licence-plates)
- [`@formfusion/iban`](https://www.npmjs.com/package/@formfusion/iban)
- [`@formfusion/passports`](https://www.npmjs.com/package/@formfusion/passports)
- [`@formfusion/phones`](https://www.npmjs.com/package/@formfusion/phones)
- [`@formfusion/tin`](https://www.npmjs.com/package/@formfusion/tin)
- [`formfusion`](https://www.npmjs.com/package/formfusion) — the core library

## Issues

Report bugs and feature requests at https://github.com/mitevskasara/formfusion-vat/issues.

## License

BSD-2-Clause. Copyright (c) 2023, Mitevska Sara.
