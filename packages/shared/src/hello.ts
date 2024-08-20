export function hello(to: string = 'World') {
  const txt = `Hello ${to}!`;
  // eslint-disable-next-line no-alert
  alert(txt);
  return txt;
}
