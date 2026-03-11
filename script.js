const schedule = [
    //1-4 Days
    {name: "Period 1", start: "7:30", end: "9:05", days: [1,3], id: 1},
    {name: "Period 2", start: "9:10", end: "10:45", days: [1,3], id: 2},
    {name: "Period 3", start: "10:50", end: "12:25", days: [1,3], id: 3},
    {name: "Lunch", start: "12:30", end: "13:05", days: [1,3], id: 4},
    {name: "Period 4", start: "13:10", end: "14:45", days: [1,3],id: 5},

    //5-7 Days(w/o Homeroom)
    {name: "Period 5", start: "7:30", end: "9:05", days: [2], id: 6},
    {name: "Seminar", start: "9:10", end: "10:45", days: [2], id: 7},
    {name: "Period 6", start: "10:50", end: "12:25", days: [2], id: 8},
    {name: "Lunch", start: "12:30", end: "13:05", days: [2], id: 9},
    {name: "Period 7", start: "13:10", end: "14:45", days: [2], id: 10},

    //5-7 days (w/ homeroom)
    {name: "Period 5", start: "7:30", end: "9:05", days: [4], id: 11},
    {name: "Homeroom", start: "9:10", end: "9:40", days: [4], id: 12},
    {name: "Seminar", start: "9:45", end: "10:45", days: [4], id: 13},
    {name: "Period 6", start: "10:50", end: "12:25", days: [4], id: 14},
    {name: "Lunch", start: "12:30", end: "13:05", days: [4], id: 15},
    {name: "Period 7", start: "13:10", end: "14:45", days: [4], id: 16},

    //Fridays
    {name: "Period 1", start: "8:25", end: "9:10", days: [5], id: 17},
    {name: "Period 2", start: "9:15", end: "10:00", days: [5], id: 18},
    {name: "Period 3", start: "10:05", end: "10:50", days: [5], id: 19},
    {name: "Period 4", start: "10:55", end: "11:40", days: [5], id: 20},
    {name: "Period 5", start: "11:45", end: "12:30", days: [5], id: 21},
    {name: "Lunch", start: "12:35", end: "13:05", days: [5], id: 22},
    {name: "Period 6", start: "13:10", end: "13:55", days: [5], id: 23},
    {name: "Period 7", start: "14:00", end: "14:45", days: [5], id: 24}
]

function getSchedule()
{
    return schedule.filter(p=>p.days.includes(new Date().getDay())); 
}

function getTime(str)
{
    const [h, m] = str.split(':').map(Number);
    const d = new Date();
    d.setHours(h,m,0,0);
    return d;
}

function timeLeft(ms)
{
    const totalSec = Math.floor(ms/1000);
    const hours = Math.floor(totalSec/3600);
    const timeRemain = totalSec-(hours*3600);
    const mins = Math.floor(timeRemain/60);
    const secs = totalSec % 60;
    if(hours > 0)
    {
        return `${hours}:${mins}:${secs.toString().padStart(2,'0')}`;
    } else {
    return `${mins}:${secs.toString().padStart(2,'0')}`;
    }
}

function main()
{
    const now = new Date();
    document.getElementById('date').textContent = now.toLocaleDateString(undefined, {weekday: 'long', month:'long', day:'numeric'});

    const today = getSchedule();
    if (today.length === 0) {
    document.getElementById('period-name').textContent = 'Weekend - No classes';
    document.getElementById('time-left').textContent = '';
    document.getElementById('end-time').textContent = '';
    document.getElementById('day-end-left').textContent = '';
    document.getElementById('percentage-left').value = 0;
    return;
    }

    let current = null;
    let next = null;

    for(let i = 0; i < today.length; i++)
    {
        const item = today[i];
        const start = getTime(item.start);
        const end = getTime(item.end);

        if(now >= start && now < end)
        {
            current = {item,start,end};
            break;
        } else if (now < start){
            next = {item,start,end};
            break;
        }
    }

    if (current) {
        const remaining = current.end - now;
        document.getElementById('period-name').textContent = current.item.name;
        document.getElementById('time-left').textContent = timeLeft(remaining);
        document.getElementById('end-time').textContent = `ends at ${current.end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;

        const totalDuration = current.end - current.start;
        const elapsed = now - current.start;
        const percentage = Math.min(100, Math.max(0, (elapsed/totalDuration) * 100));
        document.getElementById('percentage-left').value = percentage;

        const lastEnd = getTime(today[today.length-1].end);
        document.getElementById('day-end-left').textContent = `day ends in ${timeLeft(lastEnd - now)}`;
    } else if (next) {
        document.getElementById('period-name').textContent = 'Passing Period';
        const untilNext = next.start - now;
        document.getElementById('time-left').textContent = timeLeft(untilNext);
        document.getElementById('end-time').textContent = `next: ${next.item.name} @ ${next.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
        
        // Find previous period's end time to calculate passing period duration
        let passingStart = null;
        for(let i = 0; i < today.length; i++) {
            const item = today[i];
            const start = getTime(item.start);
            const end = getTime(item.end);
            if (now >= end && now < next.start) {
                passingStart = end;
                break;
            }
        }
        
        if (passingStart) {
            const totalPassingDuration = next.start - passingStart;
            const remainingPassingTime = next.start - now;
            const passingPercentage = Math.min(100, Math.max(0, (remainingPassingTime / totalPassingDuration) * 100));
            document.getElementById('percentage-left').value = passingPercentage;
        }
        
        const lastEnd = getTime(today[today.length-1].end);
        document.getElementById('day-end-left').textContent = `day ends in ${timeLeft(lastEnd - now)}`;
    } else {
        document.getElementById('period-name').textContent = 'No classes';
        document.getElementById('time-left').textContent = '';
        document.getElementById('end-time').textContent = '';
        document.getElementById('day-end-left').textContent = '';
        document.getElementById('percentage-left').value = 0;
    }
}

window.addEventListener('DOMContentLoaded', () => {main(); setInterval(main,1000);});