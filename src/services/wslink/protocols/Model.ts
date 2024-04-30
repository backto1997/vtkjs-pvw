export default function createMethods(session: any) {
  return {
    boundingBox: () => session.call('bounding_box', []),

    selection: () => session.call('selection', []),

    pipeline: () => session.call('pipeline', []),
    show: (name: string) => session.call('show', [name]),
    hide: (name: string) => session.call('hide', [name]),
  }
}
