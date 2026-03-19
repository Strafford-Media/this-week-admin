if (typeof window.Set.prototype.union !== 'function') {
  window.Set.prototype.union = function <T>(this: Set<T>, other: Set<T>): Set<T> {
    return new Set([...this, ...other])
  }
}

if (typeof window.Set.prototype.intersection !== 'function') {
  window.Set.prototype.intersection = function <T>(this: Set<T>, other: Set<T>): Set<T> {
    return new Set([...this].filter((x) => other.has(x)))
  }
}

if (typeof window.Set.prototype.difference !== 'function') {
  window.Set.prototype.difference = function <T>(this: Set<T>, other: Set<T>): Set<T> {
    return new Set([...this].filter((x) => !other.has(x)))
  }
}

if (typeof window.Set.prototype.symmetricDifference !== 'function') {
  window.Set.prototype.symmetricDifference = function <T>(this: Set<T>, other: Set<T>): Set<T> {
    return new Set([...[...this].filter((x) => !other.has(x)), ...[...other].filter((x) => !this.has(x))])
  }
}

if (typeof window.Set.prototype.isSubsetOf !== 'function') {
  window.Set.prototype.isSubsetOf = function <T>(this: Set<T>, other: Set<T>): boolean {
    return [...this].every((x) => other.has(x))
  }
}

if (typeof window.Set.prototype.isSupersetOf !== 'function') {
  window.Set.prototype.isSupersetOf = function <T>(this: Set<T>, other: Set<T>): boolean {
    return [...other].every((x) => this.has(x))
  }
}

if (typeof window.Set.prototype.isDisjointFrom !== 'function') {
  window.Set.prototype.isDisjointFrom = function <T>(this: Set<T>, other: Set<T>): boolean {
    return ![...this].some((x) => other.has(x))
  }
}
