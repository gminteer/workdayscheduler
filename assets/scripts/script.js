/* jshint esversion:6 */
const WORKDAY_LENGTH = 9;
const WORKDAY_START_HOUR = 9;

// get data from localStorage and/or initialize data object from stratch
let data = localStorage.getItem('workDaySchedData');
if(data) {
  data = JSON.parse(data);
  data.dayStamp = moment(data.dayStamp);
  if(data.dayStamp.day() < moment().day()) {
    data = null; // trash stale data
    localStorage.removeItem('workDaySchedData');
  }
}
if(!data) data = {
  dayStamp: moment(`${WORKDAY_START_HOUR}:00:00.0`, 'HH:mm:ss.S'),
  tasks: []
  };

// show current day
$('#current-day').text(moment().format('dddd[,] MMMM Do YYYY'));
// generate schedule UI
function updateUIBackground() {
  let currentHourIndex = moment().hour() - WORKDAY_START_HOUR;
  $('#time-block-container .row').each(function () {
    let offset = $(this).data('index') - currentHourIndex;
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
function generateScheduleInterface(container) {
  for(let i = 0; i < WORKDAY_LENGTH; i++) {
    let row = $('<div>')
      .addClass('row time-block text-right')
      .data('index', i);
    // hour label
    let labelText = moment(String(WORKDAY_START_HOUR), 'HH')
      .add(i, 'hours')
      .format('hA');
    let label = $('<div>')
      .addClass('col-1 hour px-0 py-3')
      .text(labelText);
    row.append(label);
    // task memo goes here
    let taskDiv = $('<div>').addClass('col-10 description px-0');
    let taskText = $('<textarea>').addClass('w-100 h-100 px-2');
    if(data.tasks[i]) taskText.text(data.tasks[i]);
    taskDiv.append(taskText);
    row.append(taskDiv);
    // save to localStorage button
    let saveDiv = $('<div>').addClass('col-1 px-0');
    let saveBtn = $('<button>').addClass('btn save-btn w-100 h-100 px-0');
    let saveIcon = $('<i>').addClass('fas fa-save');
    saveBtn.append(saveIcon);
    saveDiv.append(saveBtn);
    row.append(saveDiv);

    container.append(row);
  }
  updateUIBackground();
}

let timeBlockContainer = $('#time-block-container');
generateScheduleInterface(timeBlockContainer);
let refreshId = window.setInterval(updateUIBackground, 1000 * 60 * 15);

$(timeBlockContainer).on('click', 'button', function (event) {
  let row = $(this).closest('div.row');
  data.tasks[$(row).data('index')] = row.find('textarea').val().trim();
  localStorage.setItem('workDaySchedData', JSON.stringify(data));
});
