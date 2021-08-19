/* eslint no-await-in-loop: 0, no-alert: 0 */

document.addEventListener('DOMContentLoaded', () => {
  AOS.init();
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 웹 수정
function changeStatus(sortName, compareCount, swapCount) {
  const statusLog = `${compareCount}회 비교됨 / ${swapCount}회 배열 요소 교체됨`;
  const sortCard = document.querySelector(`[data-sort=${sortName}`);
  const overallStatus = sortCard.querySelector('.overall-status');
  overallStatus.innerHTML = statusLog;
}

function addLog(sortName, logType, logString) {
  const log = `[${logType}] ${logString}`;
  const sortCard = document.querySelector(`[data-sort=${sortName}`);
  const cardLog = sortCard.querySelector('.card-text');
  const logs = cardLog.querySelectorAll('.log');
  if (logs.length >= 3) {
    cardLog.removeChild(logs[0]);
  }
  const newLogElement = document.createElement('span');
  newLogElement.classList.add('log');
  newLogElement.innerHTML = `${log}<br />`;
  cardLog.appendChild(newLogElement);
}

function clearLog(sortName) {
  const sortCard = document.querySelector(`[data-sort=${sortName}`);
  const cardLog = sortCard.querySelector('.card-text');
  const logs = cardLog.querySelectorAll('.log');
  logs.forEach((log) => cardLog.removeChild(log));
}

function changeArrayValue(sortName, array) {
  const sortCard = document.querySelector(`[data-sort=${sortName}`);
  const arrayValueElement = sortCard.querySelector('.array-value');
  arrayValueElement.innerHTML = array.join(' ');
}

// 연산

// aIndex번째가 더 크면 true, bIndex번째가 더 크면 false
function compare(sortName, array, aIndex, bIndex) {
  addLog(
    sortName,
    '비교',
    `${aIndex}번째의 ${array[aIndex]}과 ${bIndex}번째의 ${array[bIndex]}이(가) 비교됨`
  );
  return array[aIndex] > array[bIndex];
}

function swap(sortName, array, aIndex, bIndex) {
  addLog(
    sortName,
    '교체',
    `${aIndex}번째의 ${array[aIndex]}과 ${bIndex}번째의 ${array[bIndex]}이(가) 교체됨`
  );
  const newArray = array;
  const temp = newArray[aIndex];
  newArray[aIndex] = newArray[bIndex];
  newArray[bIndex] = temp;
  changeArrayValue(sortName, newArray);
  return newArray;
}

// 정렬

let delay = 100;
let toSortArray = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

async function bubbleSort(_array) {
  const sortName = 'bubble';
  let array = _array;
  let compareCount = 0;
  let swapCount = 0;
  clearLog(sortName);
  changeArrayValue(sortName, array);
  for (let i = 0; i < array.length - 1; i += 1) {
    for (let j = 0; j < array.length - 1; j += 1) {
      const compareResult = compare(sortName, array, j, j + 1);
      compareCount += 1;
      changeStatus(sortName, compareCount, swapCount);
      await sleep(delay);
      if (compareResult) {
        array = swap(sortName, array, j, j + 1);
        swapCount += 1;
        changeStatus(sortName, compareCount, swapCount);
        await sleep(delay);
      }
    }
  }
}

async function selectionSort(_array) {
  const sortName = 'selection';
  let array = _array;
  let compareCount = 0;
  let swapCount = 0;
  clearLog(sortName);
  changeArrayValue(sortName, array);
  for (let i = 0; i < array.length - 1; i += 1) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j += 1) {
      const compareResult = !compare(sortName, array, j, minIndex);
      compareCount += 1;
      changeStatus(sortName, compareCount, swapCount);
      await sleep(delay);
      if (compareResult) minIndex = j;
    }
    array = swap(sortName, array, minIndex, i);
    swapCount += 1;
    changeStatus(sortName, compareCount, swapCount);
    await sleep(delay);
  }
}

async function insertionSort(_array) {
  const sortName = 'insertion';
  const array = _array;
  changeStatus(sortName, '(지원하지 않음)', '(지원하지 않음)');
  changeArrayValue(sortName, array);
  for (let i = 1; i < array.length; i += 1) {
    const insertKey = array[i];
    let insertIndex = i - 1;
    while (insertIndex >= 0 && array[insertIndex] > insertKey) {
      array[insertIndex + 1] = array[insertIndex];
      insertIndex -= 1;
      changeArrayValue(sortName, array);
      await sleep(delay);
    }
    array[insertIndex + 1] = insertKey;
    changeArrayValue(sortName, array);
    await sleep(delay);
  }
}

async function quickSort(
  _array,
  left,
  right,
  isFirst,
  oldCompareCount,
  oldSwapCount
) {
  const sortName = 'quick';
  const array = _array;
  let compareCount = oldCompareCount ?? 0;
  let swapCount = oldSwapCount ?? 0;
  if (isFirst) clearLog(sortName);
  changeArrayValue(sortName, array);

  const postition = async (_arr, _left, _right) => {
    let i = _left;
    let j = _right;
    const positionArray = _arr;
    const pivotIndex = Math.ceil((left + right) / 2);
    while (i < j) {
      let rightCompareResult = compare(sortName, positionArray, j, pivotIndex);
      compareCount += 1;
      changeStatus(sortName, compareCount, swapCount);
      await sleep(delay);
      while (rightCompareResult) {
        j -= 1;
        rightCompareResult = compare(sortName, positionArray, j, pivotIndex);
        compareCount += 1;
        changeStatus(sortName, compareCount, swapCount);
        await sleep(delay);
      }
      let leftCompareResult = !compare(sortName, positionArray, i, pivotIndex);
      compareCount += 1;
      changeStatus(sortName, compareCount, swapCount);
      await sleep(delay);
      while (i < j && leftCompareResult) {
        i += 1;
        leftCompareResult = !compare(sortName, positionArray, i, pivotIndex);
        compareCount += 1;
        changeStatus(sortName, compareCount, swapCount);
        await sleep(delay);
      }

      swap(sortName, positionArray, i, j);
      swapCount += 1;
      changeStatus(sortName, compareCount, swapCount);
      await sleep(delay);
    }
    positionArray[left] = positionArray[j];
    positionArray[j] = positionArray[pivotIndex];
  };

  if (left < right) {
    const pos = postition(array, left, right);
    quickSort(array, left, pos - 1, false, compareCount, swapCount);
    quickSort(array, pos + 1, right, false, compareCount, swapCount);
  }
}

// 배열 값, 섞기, 시작 이벤트

const setArrayButton = document.getElementById('set-array-button');
const shuffleButton = document.getElementById('shuffle-button');
const startButton = document.getElementById('start-button');
const delayRange = document.getElementById('delay-range');

setArrayButton.addEventListener('click', () => {
  let inputArray = prompt(
    '배열의 요소들을 ,로 구분해 입력해주세요.',
    '9,8,7,6,5,4,3,2,1,0'
  );
  inputArray = inputArray.replaceAll(' ', '').split(',');
  toSortArray = inputArray.map((elem) => parseInt(elem, 10));
  console.log(toSortArray);
});

shuffleButton.addEventListener('click', () => {
  toSortArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
});

startButton.addEventListener('click', async () => {
  const bubbleSortArray = Object.assign([], toSortArray);
  const insertionSortArray = Object.assign([], toSortArray);
  const selectionSortArray = Object.assign([], toSortArray);
  const quickSortArray = Object.assign([], toSortArray);
  await Promise.all([
    bubbleSort(bubbleSortArray),
    insertionSort(insertionSortArray),
    selectionSort(selectionSortArray),
    quickSort(quickSortArray, 0, quickSortArray.length - 1, true),
  ]);
});

delayRange.addEventListener('change', (event) => {
  delay = event.target.value;
  document.getElementById('delay-preview').innerHTML = `${delay}ms`;
});
