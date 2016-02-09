import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers, groupedNumbers, countriesWithDisabled } from '../constants';
import { triggerKeydown, clickTrigger } from '../../../helpers/ember-power-select';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Accesibility)', {
  integration: true
});

test('Single-select: The top-level options list have `role=listbox` and nested lists have `role=group`', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  let $rootLevelOptionsList = $('.ember-power-select-dropdown > .ember-power-select-options');
  assert.equal($rootLevelOptionsList.attr('role'), 'listbox', 'The top-level list has `role=listbox`');
  let $nestedOptionList = $('.ember-power-select-options .ember-power-select-options');
  assert.ok($nestedOptionList.toArray().every(l => l.attributes.role.value === 'group'), 'All the nested lists have `role=group`');
});

test('Multiple-select: The top-level options list have `role=listbox` and nested lists have `role=group`', function(assert) {
  assert.expect(2);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select-multiple options=groupedNumbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  let $rootLevelOptionsList = $('.ember-power-select-dropdown > .ember-power-select-options');
  assert.equal($rootLevelOptionsList.attr('role'), 'listbox', 'The top-level list has `role=listbox`');
  let $nestedOptionList = $('.ember-power-select-options .ember-power-select-options');
  assert.ok($nestedOptionList.toArray().every(l => l.attributes.role.value === 'group'), 'All the nested lists have `role=group`');
});

test('Single-select: All options have `role=option`', function(assert) {
  assert.expect(1);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-option').toArray().every(l => l.attributes.role.value === 'option'), 'All the options have `role=option`');
});

test('Multiple-select: All options have `role=option`', function(assert) {
  assert.expect(1);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.ok($('.ember-power-select-option').toArray().every(l => l.attributes.role.value === 'option'), 'All the options have `role=option`');
});

test('Single-select: The selected option has `aria-selected=true` and the rest `aria-selected=false`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.selected = "two";
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-selected'), 'true', 'the selected option has aria-selected=true');
  assert.equal($('.ember-power-select-option[aria-selected="false"]').length, numbers.length - 1, 'All other options have aria-selected=false');
});

test('Multiple-select: The selected options have `aria-selected=true` and the rest `aria-selected=false`', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.selected = ['two', 'four'];
  this.render(hbs`
    {{#power-select-multiple options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-selected'), 'true', 'the first selected option has aria-selected=true');
  assert.equal($('.ember-power-select-option:contains("four")').attr('aria-selected'), 'true', 'the second selected option has aria-selected=true');
  assert.equal($('.ember-power-select-option[aria-selected="false"]').length, numbers.length - 2, 'All other options have aria-selected=false');
});

test('Single-select: The highlighted option has `aria-current=true` and the rest `aria-current=false`', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'true', 'the highlighted option has aria-current=true');
  assert.equal($('.ember-power-select-option[aria-current="false"]').length, numbers.length - 1, 'All other options have aria-current=false');
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'false', 'the first option has now aria-current=false');
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-current'), 'true', 'the second option has now aria-current=false');
});

test('Multiple-select: The highlighted option has `aria-current=true` and the rest `aria-current=false`', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'true', 'the highlighted option has aria-current=true');
  assert.equal($('.ember-power-select-option[aria-current="false"]').length, numbers.length - 1, 'All other options have aria-current=false');
  triggerKeydown($('.ember-power-select-search input')[0], 40);
  assert.equal($('.ember-power-select-option:contains("one")').attr('aria-current'), 'false', 'the first option has now aria-current=false');
  assert.equal($('.ember-power-select-option:contains("two")').attr('aria-current'), 'true', 'the second option has now aria-current=false');
});

test('Single-select: Options with a disabled field have `aria-disabled=true`', function(assert) {
  assert.expect(1);

  this.countriesWithDisabled = countriesWithDisabled;
  this.render(hbs`
    {{#power-select options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
});

test('Multiple-select: Options with a disabled field have `aria-disabled=true`', function(assert) {
  assert.expect(1);

  this.countriesWithDisabled = countriesWithDisabled;
  this.render(hbs`
    {{#power-select-multiple options=countriesWithDisabled onchange=(action (mut foo)) as |option|}}
      {{option.code}}: {{option.name}}
    {{/power-select-multiple}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
});

// test('Single-select: The searchbox has `role=combobox`, `aria-autocomplete=list`, `aria-owns=<id-of-the-listbox>`', function(assert) {
//   assert.expect(1);

//   this.numbers = numbers;
//   this.render(hbs`
//     {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
//       {{option}}
//     {{/power-select}}
//   `);

//   clickTrigger();
//   assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
// });

// test('Multiple-select: The searchbox has `role=combobox`, `aria-autocomplete=list`, `aria-owns=<id-of-the-listbox>`', function(assert) {
//   assert.expect(1);

//   this.numbers = numbers;
//   this.render(hbs`
//     {{#power-select-multiple options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
//       {{option}}
//     {{/power-select-multiple}}
//   `);

//   clickTrigger();
//   assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
// });

// test('Single-select: The searchbox has `aria-expanded=true`', function(assert) {
//   assert.expect(1);

//   this.numbers = numbers;
//   this.render(hbs`
//     {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
//       {{option}}
//     {{/power-select}}
//   `);

//   clickTrigger();
//   assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
// });

// test('Multiple-select: The searchbox has `aria-expanded=true` when the component is opened and `aria-expanded=false` when closed', function(assert) {
//   assert.expect(1);

//   this.numbers = numbers;
//   this.render(hbs`
//     {{#power-select options=numbers selected=selected onchange=(action (mut selected)) as |option|}}
//       {{option}}
//     {{/power-select}}
//   `);

//   clickTrigger();
//   assert.equal($('.ember-power-select-option[aria-disabled=true]').length, 3, 'Three of them are disabled');
// });
