/**
 * @param list 执行的数组
 * @param limit 并发数
 * @param tryTime 每一个接口的重试次数
 * @author robinwp
 * @version 1.0.0
 *
 */

class ExecQueue {
  constructor (limit = 3, tryTime = 3, stopHasError = false) {
    this.queue = [];
    this.processing = [];
    this.limit = limit;
    this.stopHasError = stopHasError;
    this.tryTime = tryTime;
    this.successList = [];
    this.errorList = [];
  }

  enqueue (task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
        tryTime: this.tryTime,
      });
    });
  }

  run (item) {
    this.queue = this.queue.filter(v => v !== item);
    this.processing.push(item);
    this.runTasks(item);
  }

  runTasks (item) {
    item.task.handler(item.task.param)
      .then((res) => {
        this.processing = this.processing.filter(v => v !== item);
        this.successList.push({ param: item.task.param, response: res });
        item.resolve();
        this.start();
      })
      .catch((err) => {
        if (item.tryTime > 0) {
          item.tryTime--;
          this.runTasks(item);
        } else {
          this.errorList.push({ param: item.task.param, response: err });
          if (this.stopHasError) {
            item.reject();
          } else {
            item.resolve();
          }
        }
      });
  }

  start () {
    const processingNum = this.processing.length;
    const availableNum = this.limit - processingNum;
    this.queue.slice(0, availableNum)
      .forEach((item) => {
        this.run(item);
      });
  }
}

export default class RequestQueue {
  constructor (list = [], limit = 3, tryTime = 3, stopHasError = false) {
    this.execQueue = new ExecQueue(limit, tryTime, !!stopHasError);
    // 添加进任务队列
    this.taskList = list.map((item) => this.execQueue.enqueue({ param: item.param, handler: item.handler }));
  }

  start () {
    this.execQueue.start();
    return Promise.all(this.taskList)
      .then(() => ({ successList: this.execQueue.successList, errorList: this.execQueue.errorList }))
      .catch(() => {
        throw { successList: this.execQueue.successList, errorList: this.execQueue.errorList };
      });
  }
}
