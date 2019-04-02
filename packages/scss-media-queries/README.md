#SCSS media queries snippets#

This small package installs a couple of snippets that I use often in my scss files. The breakpoints are inspired by Zurb's Foundation and can, of course, be tweaked to your liking. I usually put the media queries in a seperate file like `_media-queries.scss` which looks like this:

```
@function lower-bound($range) {
  @if length($range) <= 0 {
    @return 0;
  }
  @return nth($range, 1);
}

@function upper-bound($range) {
  @if length($range) < 2 {
    @return 999999999999;
  }
  @return nth($range, 2);
}

@function em-calc($px-value, $rem-base: 16) {
  $value: $px-value / $rem-base;
  @return $value * 1em;
}

$small-range: (0, em-calc(640)); /* between 0 & 640px */
$medium-range: (em-calc(641), em-calc(1000)); /* between 640px & 1000px */
$large-range: (em-calc(1001), em-calc(1025)); /* between 1001px & 1025px */
$xlarge-range: (em-calc(1026), em-calc(1920)); /* between 1026px & 1920px */
$xxlarge-range: (em-calc(1921), 99999999px); /* between 1920px & infinity */

$screen: 'only screen';
$landscape: '#{$screen} and (orientation: landscape)';
$portrait: '#{$screen} and (orientation: portrait)';
$small-up: $screen;

$small-only: '#{$screen} and (max-width: #{upper-bound($small-range)})';
$medium-up: '#{$screen} and (min-width:#{lower-bound($medium-range)})';
$medium-only: '#{$screen} and (min-width:#{lower-bound($medium-range)}) and (max-width:#{upper-bound($medium-range)})';

$large-up: '#{$screen} and (min-width:#{lower-bound($large-range)})';
$large-only: '#{$screen} and (min-width:#{lower-bound($large-range)}) and (max-width:#{upper-bound($large-range)})';

$xlarge-up: '#{$screen} and (min-width:#{lower-bound($xlarge-range)})';
$xlarge-only: '#{$screen} and (min-width:#{lower-bound($xlarge-range)}) and (max-width:#{upper-bound($xlarge-range)})';

$xxlarge-up: '#{$screen} and (min-width:#{lower-bound($xxlarge-range)})';
$xxlarge-only: '#{$screen} and (min-width:#{lower-bound($xxlarge-range)}) and (max-width:#{upper-bound($xxlarge-range)})';

```

This package will install these snippets:

```
sm-up > @media #{$small-up} {}
sm-only > @media #{$small-only} {}
med-up > @media #{$medium-up} {}
med-only > @media #{$medium-only} {}
large-up > @media #{$large-up} {}
large-only > @media #{$large-only} {}
xlarge-up > @media #{$xlarge-up} {}
xlarge-only > @media #{$xlarge-only} {}
xxlarge-up > @media #{$xxlarge-up} {}
xxlarge-only > @media #{$xxlarge-only} {}
portrait > @media #{$portrait} {}
landscape > @media #{$landscape} {}
```
