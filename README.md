# RequestQueue
> example

```js
const json  = [
  '1 (10).jpg',
  '1 (2).jpg',
  '1 (3).jpg',
  '1 (4).jpg',
  '1 (5).jpg',
  '1 (6).jpg',
  '1 (7).jpg',
  '1 (8).jpg',
  '1 (9).jpg',
];

function getImg(param) {
    return fetch('images/' + param, { method: 'GET' }).then((res) => {
      if(res.status === 200){
        return res.blob();
      } else {
        throw res;
      }
    });
  }

const list = [];
json.forEach((item) => {
  list.push({ param: item, handler: getImg });
});

const requestQueue = new RequestQueue(list, 3, 2, false);

requestQueue.start().then((res) => {
  // 全部执行完成
  console.log('successList', res.successList);
  console.log('errorList', res.errorList);
}).catch((error) => {
  console.log('successList', error.successList);
  console.log('errorList', error.errorList);
});
```
