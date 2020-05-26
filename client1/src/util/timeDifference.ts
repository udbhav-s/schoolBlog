export default function timeDifference(current: Date, previous: Date) {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current.getTime() - previous.getTime();

  if (elapsed < msPerMinute) {
    const diff = Math.round(elapsed/1000);
    return diff + (diff === 1 ? 'second' : 'seconds') + 'ago';   
  }

  else if (elapsed < msPerHour) {
    const diff = Math.round(elapsed/msPerMinute);
    return diff + (diff === 1 ? 'minute' : 'minutes') + 'ago';     
  }

  else if (elapsed < msPerDay ) {
    const diff = Math.round(elapsed/msPerHour);
    return diff + (diff === 1 ? 'hour' : 'hours') + 'ago';  
  }

  else if (elapsed < msPerMonth) {
    const diff = Math.round(elapsed/msPerDay);
    return diff + (diff === 1 ? 'day' : 'days') + 'ago';  
  }

  else if (elapsed < msPerYear) {
    const diff = Math.round(elapsed/msPerMonth);
    return diff + (diff === 1 ? 'month' : 'months') + 'ago';  
  }

  else {
    const diff = Math.round(elapsed/msPerYear);
    return diff + (diff === 1 ? 'year' : 'years') + 'ago';  
  }
}