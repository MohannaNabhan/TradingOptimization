function Calc(config) {
  const history = {
    start_capital: config.capital,
    end_capital: config.capital,
    risk: config.risk + "%",
    drawdown: 0,
    lossStrike: 0,
    winStrike: 0,
    winrate: 0,
    win: 0,
    loss: 0,
    trades: [],
  };

  const r = config.capital * (config.risk / 100);
  let currentLossStrike = 0;
  let maxLossStrike = 0;
  let currentWinStrike = 0;
  let maxWinStrike = 0;

  for (let i = 1; i <= config.trades; i++) {
    const m = (Math.random() * (config.multiplier - 1) + 1).toFixed(2);
    const isWin = Math.random() < config.winrate / 100;
    const result = isWin ? "W" : "L";
    const tradeCapital = isWin
      ? (history.end_capital + r * m).toFixed(1)
      : (history.end_capital - r).toFixed(1);
    const multiplier = isWin ? "x" + m : "x0";

    if (isWin) {
      history.win++;
      history.end_capital += r * m;
      currentWinStrike++;
      if (currentWinStrike > maxWinStrike) {
        maxWinStrike = currentWinStrike;
      }
      currentLossStrike = 0;
    } else {
      history.loss++;
      history.end_capital -= r;
      currentLossStrike++;
      if (currentLossStrike > maxLossStrike) {
        maxLossStrike = currentLossStrike;
      }
      currentWinStrike = 0;
      if (history.drawdown > history.end_capital - config.capital) {
        history.drawdown = history.end_capital - config.capital;
      }
    }

    // Exit if you don't have any more money in the account
    if (history.end_capital <= 1) {
      history.trades.push({ Account: "Broken" });
      return history.trades;
    }
    history.trades.push({
      trade: i,
      result: result,
      capital: tradeCapital,
      multiplier: multiplier,
    });
  }

  history.winrate = ((history.win / config.trades) * 100).toFixed() + "%";
  history.end_capital = history.end_capital.toFixed(2);
  history.drawdown =
    ((Math.abs(history.drawdown) / config.capital) * 100).toFixed(2) + "%";

  history.lossStrike = maxLossStrike;
  history.winStrike = maxWinStrike;

  return history;
}

console.log(
  Calc({
    trades: 10,
    capital: 100,
    risk: 1, // 1-100%
    winrate: 60, // 1-100%
    multiplier: 3, // This multiplier 1 - your number
  })
);
