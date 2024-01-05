function getClockAngle(hh_mm: string): number {
  const [hours, minutes] = hh_mm.split(":").map((item) => Number(item));

  const hoursAngle = (hours % 12) * 30 + 0.5 * minutes;
  const minutesAngle = minutes * 6;

  return Math.abs(hoursAngle - (minutesAngle > 0 ? minutesAngle : 360));
}

//Examples
getClockAngle("09:00") === 90;
getClockAngle("17:30") === 15;

function getQuestionPart(phrases: string[]): string[] {
  const [firstWord, ...words] = phrases;

  let wordDuplicate = "";
  for (let i = 0; i < firstWord.length; i++) {
    let wordForCheck = firstWord[i];
    for (let j = i + 1; j < firstWord.length; j++) {
      wordForCheck += firstWord[j];
      const countDuplicate = words.filter((item) =>
        item.includes(wordForCheck)
      );
      if (
        countDuplicate.length === words.length &&
        wordDuplicate.length < wordForCheck.length
      ) {
        wordDuplicate = wordForCheck;
      }
    }
  }

  return phrases.map((item) => item.replace(wordDuplicate, "").trim());
}

//Examples check word in array
getQuestionPart(["BATHROOM", "BATH SALTS", "BLOODBATH"]).every((currentValue) =>
  ["ROOM", "SALTS", "BLOOD"].includes(currentValue)
);

getQuestionPart(["BEFRIEND", "GIRLFRIEND", "FRIENDSHIP"]).every(
  (currentValue) => ["BE", "GIRL", "SHIP"].includes(currentValue)
);

function quickestPath(board: {
  ladders: [number, number][];
  snakes: [number, number][];
}): number[] {
  const maxRollTheDice = 6;
  const endGame = 100;
  const numberOfSnakes = board.snakes.map((item) => item[0]);

  const findAllPaths = (ladders: [number, number][]) => {
    const result: [number, number][][] = [];

    const generatePaths = (
      ladders: [number, number][],
      remainingLadders: [number, number][]
    ) => {
      if (remainingLadders.length === 0) {
        result.push([...ladders]);
        return;
      }
      for (let i = 0; i < remainingLadders.length; i++) {
        ladders.push(remainingLadders[i]);
        generatePaths(
          ladders,
          remainingLadders.filter(
            (item, index) => index !== i && item[0] > remainingLadders[i][1]
          )
        );
        ladders.pop();
      }
    };

    generatePaths([], ladders);
    return result;
  };

  const rollToPoint = (start: number, to: number) => {
    const rolls: number[] = [];
    while (start < to) {
      let roll = to - start;
      if (roll > maxRollTheDice) {
        for (let i = 6; i >= 1; i--) {
          const findInSnake = numberOfSnakes.find((item) => item === start + i);
          if (!findInSnake) {
            roll = maxRollTheDice;
            break;
          }
        }
      }
      rolls.push(roll);
      start += roll;
    }
    return rolls;
  };

  const allPathLadder = findAllPaths(board.ladders);
  const allRollPathLadder: number[][] = [];
  for (const path of allPathLadder) {
    let startAt = 1;
    let bastOfRoll: number[] = [];
    for (const [point, goto] of path) {
      const roll = rollToPoint(startAt, point);
      bastOfRoll = [...bastOfRoll, ...roll];
      startAt = goto;
    }

    if (startAt != endGame) {
      const roll = rollToPoint(startAt, endGame);
      bastOfRoll = [...bastOfRoll, ...roll];
    }
    allRollPathLadder.push(bastOfRoll);
  }

  return allRollPathLadder.reduce((current, next) => {
    return current.length > next.length ? next : current;
  });
}

function minEnergy(
  start: number,
  shops: number[],
  stations: number[],
  target: number
): number {
  shops.sort((a, b) => a - b);
  let minEnergy = 0;
  for (const shop of shops) {
    const distance = Math.abs(shop - start);
    const [stationsNearShop, stationsNearStart] = stations.reduce(
      (result, currentValue) => {
        const distanceShop = Math.abs(currentValue - shop);
        const distanceStart = Math.abs(currentValue - start);
        if (distanceShop <= Math.abs(result[0] - shop) || result[0] === 0) {
          result[0] = currentValue;
        }
        if (distanceStart <= Math.abs(result[1] - start) || result[1] === 0) {
          result[1] = currentValue;
        }

        return result;
      },
      [0, 0]
    );

    const calculateDistanceStation =
      Math.abs(stationsNearShop - shop) + Math.abs(stationsNearStart - start);

    minEnergy +=
      distance <= calculateDistanceStation ||
      stationsNearShop === stationsNearStart
        ? distance
        : calculateDistanceStation;
    start = shop;
  }

  return minEnergy + target - start;
}

// minEnergy(0, [4, 9], [3, 6, 8], 11) === 8;
