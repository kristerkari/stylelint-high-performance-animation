# stylelint-high-performance-animation

[![NPM version](https://img.shields.io/npm/v/stylelint-high-performance-animation.svg)](https://www.npmjs.com/package/stylelint-high-performance-animation)
[![Build Status](https://travis-ci.org/kristerkari/stylelint-high-performance-animation.svg?branch=master)](https://travis-ci.org/kristerkari/stylelint-high-performance-animation)
[![Build status](https://ci.appveyor.com/api/projects/status/xr64ahlui4cct9ed/branch/master?svg=true)](https://ci.appveyor.com/project/kristerkari/stylelint-high-performance-animation/branch/master)
[![Downloads per month](https://img.shields.io/npm/dm/stylelint-high-performance-animation.svg)](http://npmcharts.com/compare/stylelint-high-performance-animation?periodLength=30)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Stylelint rule for preventing the use of low performance animation and transition properties.

This is a fork of [stylelint-performance-animation](https://github.com/konstantin24121/stylelint-performance-animation) stylelint plugin. It uses a blacklist for harmful properties instead of a whitelist, which makes it easy to avoid false positives and allows you to specify which type of properties to warn for (`layout`/`paint`).

## Install

```sh
npm install stylelint-high-performance-animation --save-dev
```

or

```sh
yarn add stylelint-high-performance-animation --dev
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
  transition: margin 350ms ease-in;
}
/**           ^^^^^^
 * You should not use low performance animation properties */
```

```css
@keyframes myAnimation {
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
  transition: margin-left 350ms ease-in;
}
```

The following pattern is _not_ considered warning:

```css
div {
  transition: transform 350ms ease-in;
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
  transition-property: color, margin;
}
```

The following pattern is _not_ considered warning:

```css
div {
  transition-property: color, opacity, background-color;
}
```

---

## License

MIT
