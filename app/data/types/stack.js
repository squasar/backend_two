class Stack {
  constructor() {
    this.stack = [];
  }
  push(item) {
    this.stack.push(item);
  }
  pop() {
    this.stack.pop();
  }
 }


res_stack={};
res_stack.stacker = Stack;
res_stack.stacker_ob = new Stack();
module.exports = res_stack;
