class Queue {
  constructor() {
    this.queue = {};
    this.tail = 0;
    this.head = 0;
  }
  
  // Add an element to the end of the queue.
  enqueue = function(element) {
    this.queue[this.tail++] = element;
  }
  
  // Delete the first element of the queue.
  dequeue = function() {
    if (this.tail === this.head)
        return undefined
  
    var element = this.queue[this.head];
    delete this.queue[this.head];
    return element;
  }
}

res_queue={};
res_queue.queuer = Queue;
res_queue.queuer_ob = new Queue();
module.exports = res_queue;
