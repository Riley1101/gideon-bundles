import { apple_or_orange, days } from "./apple";

const time_date = document.querySelector(".time_date");

setInterval(() => {
  const d = new Date();
  const day = days[d.getDay()];
  const seconds = d.getSeconds();
  document.querySelector("#title").innerText = apple_or_orange();
  function showtime() {
    time_date.innerHTML = day + " " + seconds;
  }
  showtime();
}, 1000);
