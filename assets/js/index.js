/* eslint no-await-in-loop: 0 */

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
      await sleep(100);
      if (compareResult) {
        array = swap(sortName, array, j, j + 1);
        swapCount += 1;
        changeStatus(sortName, compareCount, swapCount);
      }
      await sleep(100);
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
      await sleep(100);
      if (compareResult) minIndex = j;
    }
    array = swap(sortName, array, minIndex, i);
    swapCount += 1;
    changeStatus(sortName, compareCount, swapCount);
    await sleep(100);
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
      await sleep(100);
    }
    array[insertIndex + 1] = insertKey;
    changeArrayValue(sortName, array);
    await sleep(100);
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
      await sleep(100);
      while (rightCompareResult) {
        j -= 1;
        rightCompareResult = compare(sortName, positionArray, j, pivotIndex);
        compareCount += 1;
        changeStatus(sortName, compareCount, swapCount);
        await sleep(100);
      }
      let leftCompareResult = !compare(sortName, positionArray, i, pivotIndex);
      compareCount += 1;
      changeStatus(sortName, compareCount, swapCount);
      await sleep(100);
      while (i < j && leftCompareResult) {
        i += 1;
        leftCompareResult = !compare(sortName, positionArray, i, pivotIndex);
        compareCount += 1;
        changeStatus(sortName, compareCount, swapCount);
        await sleep(100);
      }

      swap(sortName, positionArray, i, j);
      swapCount += 1;
      changeStatus(sortName, compareCount, swapCount);
      await sleep(100);
    }
    positionArray[left] = positionArray[j];
    positionArray[j] = positionArray[pivotIndex];
  };

  if (left < right) {
    const i = postition(array, left, right);
    quickSort(array, left, i - 1, false, compareCount, swapCount);
    quickSort(array, i + 1, right, false, compareCount, swapCount);
  }
}
