//Small helper functions
//make date object from string "YYYY-MM-DD"
function parseDate(d){
    const [y,m,day]=d.split("-").map(Number);
    return new Date(y,m-1,day);
}
//get today at 00:00 (midnight)
function todayMidnight(){
    const t=new Date();
    return new Date(t.getFullYear(),t.getMonth(),t.getDate());
}

//Event data 
let events=JSON.parse(localStorage.getItem("events"))||[
    {date:"2025-11-03",time:"00:00",sport:"Football",home:"Al Shabab",away:"Nasaf",result:"1-2"},
    {date:"2025-11-03",time:"16:00",sport:"Football",home:"Al Hilal",away:"Shabab Al Ahli",result:"0-0"},
    {date:"2025-11-04",time:"15:25",sport:"Football",home:"Al Duhail",away:"Al Rayyan",result:"0-0"},
    {date:"2025-11-04",time:"08:00",sport:"Football",home:"Al Faisaly",away:"Foolad",result:"0-0"},
    {date:"2025-11-19",time:"00:00",sport:"Football",home:"-",away:"Urawa Reds",result:"-"},
    {date:"2025-11-23",time:"09:45",sport:"Ice Hockey",home:"KAC",away:"Capitals",result:"-"}
];
//save events into browser
function saveEvents(){
    localStorage.setItem("events",JSON.stringify(events));
}

//Filter
// return filtered events by dropdown
function getFilteredEvents(){
    const f=document.getElementById("filter")?.value||"";
    return f?events.filter(e=>e.sport===f):events;
}

//Main area 
const main=document.getElementById("main");

//Show calendar 
function showCalendar(){
    const now=new Date();
    main.innerHTML=`<h2>📅 November 2025</h2>`;
    const cal=document.createElement("div");
    cal.className="calendar";
    const filtered=getFilteredEvents();

for(let d=1;d<=30;d++){ // loop through days of month
    const date=`2025-11-${String(d).padStart(2,"0")}`;
    const box=document.createElement("div");
    box.className="day";
    box.textContent=d;

//highlight today with blue border
if(d===now.getDate() && now.getMonth()===10 && now.getFullYear()===2025){
    box.classList.add("today");
}

//check games on this date
const games=filtered.filter(e=>e.date===date);
    if(games.length>0){
    box.classList.add("event");
    box.onclick=()=>showDay(games); //click shows games
    }
    cal.appendChild(box);
}
main.appendChild(cal);
showUpcoming(); // also show list below
}

//Show upcoming matches
function showUpcoming(){
const t0=todayMidnight(); // today start
    const list=document.createElement("div");
    list.className="card";
    list.innerHTML="<h2>📋 Upcoming Matches</h2>";

// all events after today
const allFuture=events.filter(e=>parseDate(e.date)>=t0);
const f=document.getElementById("filter")?.value||"";
const filtered=f?allFuture.filter(e=>e.sport===f):allFuture;

//sort by date
filtered.sort((a,b)=>parseDate(a.date)-parseDate(b.date));

if(filtered.length===0){
    list.innerHTML+="<p>No upcoming matches 🎉</p>";
} else {
    filtered.forEach(e=>{
    list.innerHTML+=`
        <div class="match">
        <span class="date">${e.date}</span>
        <span><span class="sport">${e.sport}</span>: ${e.home} vs ${e.away}</span>
        <!-- hidden delete button (shows on hover) -->
        <button onclick="deleteEvent('${e.date}','${e.time}','${e.home}','${e.away}')">🗑️</button>
        </div>`;
    });
}
main.appendChild(list);
}

//Show all games on one day 
function showDay(games){
    let html=`<div class="card"><h2>Events on ${games[0].date}</h2>
    <table style="width:100%;text-align:left;border-spacing:8px 4px;">
    <tr><th>Time</th><th>Sport</th><th>Match</th><th>Result</th><th></th></tr>`;
games.forEach(e=>{
    html+=`<tr>
    <td>${e.time}</td>
    <td><span class="sport">${e.sport}</span></td>
    <td>${e.home} vs ${e.away}</td>
    <td>${e.result}</td>
    <!-- hidden delete button -->
    <td><button onclick="deleteEvent('${e.date}','${e.time}','${e.home}','${e.away}')">🗑️</button></td>
    </tr>`;
    });
    html+=`</table><button onclick="showCalendar()">🔙 Back</button></div>`;
    main.innerHTML=html;
}

//Delete one event 
function deleteEvent(date,time,home,away){
  if(!confirm("Delete this event?")) return; // ask user
    events=events.filter(e=>!(e.date===date&&e.time===time&&e.home===home&&e.away===away));
    saveEvents(); // update storage
    showCalendar(); // reload calendar
    alert("🗑️ Event deleted!");
}

//Add new event 
function showAddForm(){
    main.innerHTML=`
    <div class="card"><h2>➕ Add Event</h2>
    <input id="date" type="date"><br>
    <input id="time" type="time"><br>
    <input id="sport" placeholder="Sport"><br>
    <input id="home" placeholder="Home Team"><br>
    <input id="away" placeholder="Away Team"><br>
    <input id="result" placeholder="Result"><br>
    <button onclick="addEvent()">Add</button>
    <button onclick="showCalendar()">Cancel</button>
    </div>`;
}
function addEvent(){
    const newE={date:date.value,time:time.value,sport:sport.value,
    home:home.value,away:away.value,result:result.value};
    events.push(newE);
    saveEvents();
    alert("🎉 Event added!");
    showCalendar();
}

//Start app
showCalendar();
