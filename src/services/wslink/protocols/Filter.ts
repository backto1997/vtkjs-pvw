export default function createMethods(session: any) {
  return {
    slice: (args: any) => session.call('slice', [...args]),
  }
}
