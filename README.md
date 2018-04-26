# stylelint-high-performance-animation

[![Build Status](https://travis-ci.org/kristerkari/stylelint-high-performance-animation.svg?branch=master)](https://travis-ci.org/kristerkari/stylelint-high-performance-animation)
[![Build status](https://ci.appveyor.com/api/projects/status/xr64ahlui4cct9ed/branch/master?svg=true)](https://ci.appveyor.com/project/kristerkari/stylelint-high-performance-animation/branch/master)

Stylelint rule for preventing the use of low performance animation and transition properties.

This is a fork of [stylelint-performance-animation](https://github.com/konstantin24121/stylelint-performance-animation) stylelint plugin. It uses a blacklist for harmful properties instead of a whitelist, which makes it easy to avoid false positives and allows you to specify which type of properties to warn for (`layout`/`paint`).

## Install

```sh
npm install stylelint-high-performance-animation --save-dev
```

or

```sh
yarn add stylelint-high-performance-animation --save-dev
```

## Usage

Add this config to your `.stylelintrc` or stylelint config inside `package.json`:

```json
{
  "plugins": ["stylelint-high-performance-animation"],
  "rules": {
    "plugin/no-low-performance-animation-properties": true
  }
}
```

## Details

```css
div {
  transition: margin 350ms easy;
}
/**           ^^^^^^
 * You should not use low performance animation properties */
```

```css
@keyframes {
  50% {
    top: 5px;
  }
}
/** ^^^^^^
 * You should not use low performance animation properties */
```

For more information [read article](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/) By Paul Lewis and Paul Irish

### Options

#### `true`

The following pattern is considered warning:

```css
div {
  transition: margin-left 350ms easy;
}
```

The following pattern is _not_ considered warning:

```css
div {
  transition: transform 350ms easy;
}
```

### Optional secondary options

#### `ignore: "paint-properties"`

Makes the rule not warn for properties that cause `paint` and only warn for properties that cause `layout`.

#### `ignoreProperties: [string]`

Given:

`{ ignoreProperties: ['color', 'background-color'] }`

The following pattern is considered warning:

```css
div {
  transition: color, margin;
}
```

The following pattern is _not_ considered warning:

```css
div {
  transition: color, opacity, background-color;
}
```

---

## License

MIT
