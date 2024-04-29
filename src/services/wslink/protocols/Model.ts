export default function createMethods(session: any) {
  return {
    boundingBox: () => session.call('bounding_box', []),
  }
}
