const repeat = [
  {label: 'каждый день', value: 1},
  {label: 'через день', value: 2},
  {label: '3-й день', value: 3},
  {label: '4-й день', value: 4},
  {label: '5-й день', value: 5},
  {label: '6-й день', value: 6},
  {label: '7-й день', value: 7},
];

const term = [
  {label: '1-й недели', value: 1},
  {label: '1-го месяца', value: 30},
  {label: '2-х месяцев', value: 60},
  {label: '4-х месяцев', value: 120},
  {label: '6-ти месяцев', value: 180},
  {label: '1-го года', value: 365},
];

export const getRepeatLabels = () => repeat.map(el => el.label);
export const getTermLabels = () => term.map(el => el.label);

export const getRepeatValue = label => repeat.find(r => r.label == label).value;
export const getTermValue = label => term.find(r => r.label == label).value;