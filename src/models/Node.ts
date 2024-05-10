export class Node<T> {
  parent?: T
  children: T[]

  constructor() {
    this.children = []
  }

  setParent(parent: T) {
    this.parent = parent
  }

  addChildren(child: T) {
    this.children.push(child)
  }
}
