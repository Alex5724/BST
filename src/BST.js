import { mergeSort } from './merge-sort.js';

class Node {
  constructor(value = null) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class Tree {
  constructor(arr) {
    const unique = [...new Set(arr)];
    this.root = this.#buildTree(mergeSort(unique));
  }

  #buildTree(arr) {
    if (arr.length === 0) {
      return null;
    }

    const mid = Math.floor(arr.length / 2);
    const root = new Node(arr[mid]);

    root.left = this.#buildTree(arr.slice(0, mid));
    root.right = this.#buildTree(arr.slice(mid + 1));

    return root;
  }

  includes(node = this.root, value) {
    if (!node) return false;

    if (node.value === value) return node;

    if (value < node.value) return this.includes(node.left, value);

    return this.includes(node.right, value);
  }

  insert(value, node = this.root) {
    if (node === null) {
      return new Node(value);
    }

    if (value < node.value) {
      node.left = this.insert(value, node.left);
    } else if (value > node.value) {
      node.right = this.insert(value, node.right);
    } else {
      return node;
    }

    return node;
  }

  prettyPrint(node = this.root, prefix = '', isLeft = true) {
    if (node === null || node === undefined) {
      return;
    }

    this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
    this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }

  deleteItem(node = this.root, value) {
    if (node === null || node === undefined) {
      throw new Error('The tree is empty!');
    }

    if (value > node.value) {
      node.right = this.deleteItem(node.right, value);
      return node;
    } else if (value < node.value) {
      node.left = this.deleteItem(node.left, value);
      return node;
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }
    }
    if (node.left === null) {
      return node.right;
    }
    if (node.right === null) {
      return node.left;
    } else {
      const succesor = this.#minNodeVal(node.right);
      node.value = succesor.value;
      node.right = this.deleteItem(node.right, succesor.value);
      return node;
    }
  }
  #minNodeVal(node) {
    while (node.left !== null) node = node.left;
    return node;
  }

  levelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required!');
    }
    if (this.root === null || this.root === undefined) {
      throw new Error('The tree is empty!');
    }

    let queue = [this.root];

    while (queue.length > 0) {
      let node = queue.shift();
      callback(node.value);
      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }
  }

  recursiveLevelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required!');
    }
    if (this.root === null || this.root === undefined) {
      throw new Error('The tree is empty!');
    }

    const traverse = (queue) => {
      if (queue.length === 0) {
        return;
      }
      let node = queue.shift();
      callback(node.value);

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }

      traverse(queue);
    };

    traverse([this.root]);
  }

  inOrderForEach(callback, node = this.root) {
    if (!node) return;

    this.inOrderForEach(callback, node.left);
    callback(node.value);
    this.inOrderForEach(callback, node.right);
  }
  preOrderForEach(callback, node = this.root) {
    if (!node) return;

    callback(node.value);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (!node) return;

    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node.value);
  }

  findHeight(node) {
    if (!node) return -1;

    const left = this.findHeight(node.left);
    const right = this.findHeight(node.right);

    return 1 + Math.max(left, right);
  }

  height(value) {
    const node = this.includes(this.root, value);
    if (!node) return undefined;

    return this.findHeight(node);
  }

  depth(value, node = this.root, depth = 0) {
    if (!node) return undefined;

    if (node.value === value) return depth;

    if (value > node.value) return this.depth(value, node.right, depth + 1);
    if (value < node.value) return this.depth(value, node.left, depth + 1);
  }

  isBalanced(node = this.root) {
    const check = (node) => {
      if (!node) return 0;

      const left = check(node.left);
      if (left === -Infinity) return -Infinity;

      const right = check(node.right);
      if (right === -Infinity) return -Infinity;

      if (Math.abs(left - right) > 1) return -Infinity;

      return 1 + Math.max(left, right);
    };

    return check(node) !== -Infinity;
  }

  rebalance() {
    const values = [];

    this.inOrderForEach((value) => {
      values.push(value);
    });

    this.root = this.#buildTree(values);
  }
}

const tree = new Tree([5, 7, 3, 9, 67]);

console.log(tree.isBalanced());

tree.prettyPrint();

console.log('Level order:');
tree.levelOrderForEach((el) => console.log(el));

console.log('Pre order:');
tree.preOrderForEach((el) => console.log(el));

console.log('Post order:');
tree.postOrderForEach((el) => console.log(el));

console.log('In order:');
tree.inOrderForEach((el) => console.log(el));

tree.insert(187);
tree.insert(122);
tree.insert(145);
tree.insert(111);
tree.insert(168);
tree.insert(2000);

console.log(tree.isBalanced());

tree.rebalance();

console.log(tree.isBalanced());

tree.prettyPrint();

console.log('Level order:');
tree.levelOrderForEach((el) => console.log(el));

console.log('Pre order:');
tree.preOrderForEach((el) => console.log(el));

console.log('Post order:');
tree.postOrderForEach((el) => console.log(el));

console.log('In order:');
tree.inOrderForEach((el) => console.log(el));
