/* jshint esversion:6 */

const WORKDAY_LENGTH = 9;
const WORKDAY_START_HOUR = 13;

// show current day
$('#current-day').text(moment().format('dddd[,] MMMM Do YYYY'));

// generate schedule UI
function generateScheduleInterface(container) {
  for(let i = 0; i < WORKDAY_LENGTH; i++) {
    let row = $('<div>')
      .addClass('row time-block text-right')
      .data('index', i);

    let labelText = data.dayStamp
      .clone()
      .add(i, 'hours')
      .format('hA');
    let label = $('<div>')
      .addClass('col-1 hour px-0 py-3')
      .text(labelText);
    row.append(label);

    let taskDiv = $('<div>').addClass('col-10 description px-0');
    let taskText = $('<textarea>').addClass('w-100 h-100 px-0');
    taskDiv.append(taskText);
    row.append(taskDiv);

    let saveDiv = $('<div>').addClass('col-1 px-0');
    let saveBtn = $('<button>').addClass('btn save-btn w-100 h-100 px-0');
    let saveIcon = $('<i>').addClass('fas fa-save');
    saveBtn.append(saveIcon);
    saveDiv.append(saveBtn);
    row.append(saveDiv);

    container.append(row);
  }
}
let timeBlockContainer = $('#time-block-container');
generateScheduleInterface(timeBlockContainer);

// update UI background periodically
function cmp(x,y) { return ((x > y)? 1 : (x < y)? -1 : 0); }
function updateUIBackground() {
  let currentHourIndex = moment().hour() - WORKDAY_START_HOUR;
  $('#time-block-container .row').each(function () {
    let offset = cmp($(this).data('index'), currentHourIndex);
    let taskBlock = $(this).children('.description');
    if(offset < 0) {
      taskBlock.addClass('past').removeClass('present future');
    } else if(offset > 0) {
      taskBlock.addClass('future').removeClass('present past');
    } else {
      taskBlock.addClass('present').removeClass('past future');
    }
  });
}
let refresherId = window.setInterval(updateUIBackground, 1000 * 60 * 15); // every 15 minutes
updateUIBackground(); // also run it once right away
