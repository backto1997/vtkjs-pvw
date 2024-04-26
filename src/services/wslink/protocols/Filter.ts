export default function createMethods(session: any) {
  return {
    slice: () => session.call('trame.trigger', ['trigger__2', [], {}]),
  }
}
