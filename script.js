let events = [
    {
        id: 1,
        title: "AI Bootcamp",
        category: "Technology",
        seats: 30,
        registered: 12
    },

    {
        id: 2,
        title: "Business Summit",
        category: "Business",
        seats: 20,
        registered: 5
    }
];

const eventContainer = document.getElementById("eventContainer");
const form = document.getElementById("eventForm");
const searchInput = document.getElementById("searchInput");

function renderEvents(eventList = events) {
    eventContainer.innerHTML = "";

    if (eventList.length === 0) {
        eventContainer.innerHTML = `
            <div class="rounded-lg border border-dashed border-[#c8a892] bg-[#fffaf5] p-8 text-center text-[#7b3f1d] md:col-span-2 lg:col-span-3">
                <h3 class="text-xl font-bold text-[#4b2412]">No events found</h3>
                <p class="mt-2">Try another search or add a new event.</p>
            </div>
        `;

        updateStatistics(eventList);
        return;
    }

    eventList.forEach(event => {
        const remaining = event.seats - event.registered;
        const percentFull = Math.min(
            100,
            Math.round((event.registered / event.seats) * 100)
        );

        const card = document.createElement("div");

        card.className =
            "rounded-lg border border-[#e4cbb8] bg-[#fffaf5] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

        card.innerHTML = `
            <div class="mb-5">
                <span class="inline-flex rounded-full bg-[#ead5c4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6b351b]">
                    ${event.category}
                </span>

                <h3 class="mt-3 text-2xl font-bold leading-tight text-[#2d1a12]">
                    ${event.title}
                </h3>
            </div>

            <div class="grid grid-cols-3 gap-3 rounded-lg bg-[#f4ede7] p-3 text-center">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#8b6f61]">Seats</p>
                    <p class="mt-1 text-lg font-bold">${event.seats}</p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#8b6f61]">Booked</p>
                    <p class="mt-1 text-lg font-bold">${event.registered}</p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#8b6f61]">Left</p>
                    <p class="mt-1 text-lg font-bold">${remaining}</p>
                </div>
            </div>

            <div class="mt-5">
                <div class="mb-2 flex items-center justify-between text-sm font-medium text-[#7b3f1d]">
                    <span>Registration</span>
                    <span>${percentFull}% full</span>
                </div>

                <div class="h-2 overflow-hidden rounded-full bg-[#ead5c4]">
                    <div class="h-full rounded-full bg-[#6b351b]" style="width: ${percentFull}%"></div>
                </div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-2">
                <button
                    onclick="registerEvent(${event.id})"
                    class="rounded-lg bg-[#2f7d57] px-3 py-2 font-semibold text-white transition hover:bg-[#256445]"
                >
                    Register
                </button>

                <button
                    onclick="cancelRegistration(${event.id})"
                    class="rounded-lg bg-[#8b6f61] px-3 py-2 font-semibold text-white transition hover:bg-[#6f584d]"
                >
                    Cancel
                </button>

                <button
                    onclick="cancelEvent(${event.id})"
                    class="rounded-lg bg-[#a33324] px-3 py-2 font-semibold text-white transition hover:bg-[#84281d]"
                >
                    Delete
                </button>
            </div>
        `;

        eventContainer.appendChild(card);
    });

    updateStatistics(eventList);
}

function updateStatistics(eventList = events) {
    document.getElementById("totalEvents").textContent = eventList.length;

    const registeredStudents = eventList.reduce(
        (total, event) => total + event.registered,
        0
    );

    document.getElementById("totalRegistered").textContent = registeredStudents;

    const availableSeats = eventList.reduce(
        (total, event) => total + (event.seats - event.registered),
        0
    );

    document.getElementById("totalSeats").textContent = availableSeats;
}

function registerEvent(id) {
    const event = events.find(e => e.id === id);

    if (event.registered < event.seats) {
        event.registered++;

        saveToLocalStorage();
        renderEvents(getFilteredEvents());

        alert(
            "Registration successful! " +
            event.title +
            " has " +
            (event.seats - event.registered) +
            " seats left."
        );
    } else {
        alert("No seats available!");
    }
}

function cancelRegistration(id) {
    const event = events.find(e => e.id === id);

    if (event.registered > 0) {
        event.registered--;

        saveToLocalStorage();
        renderEvents(getFilteredEvents());

    }
    if (event.registered === 0) {
        alert(
            "All registrations for " +
            event.title +
            " have been cancelled."
        );
    }
}

function cancelEvent(id) {
    const event = events.find(e => e.id === id);

    if (!event) {
        return;
    }

    const shouldDelete = confirm(
        "Delete " + event.title + "? This will remove the event from the dashboard."
    );

    if (!shouldDelete) {
        return;
    }

    events = events.filter(e => e.id !== id);

    saveToLocalStorage();
    renderEvents(getFilteredEvents());
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const seats = Number(document.getElementById("seats").value);

    if (!title || !category || seats <= 0) {
        alert("Please fill all fields correctly.");
        return;
    }

    const newEvent = {
        id: Date.now(),
        title,
        category,
        seats,
        registered: 0
    };

    events.push(newEvent);

    saveToLocalStorage();
    renderEvents(getFilteredEvents());

    form.reset();
});

function getFilteredEvents() {
    const value = searchInput.value.toLowerCase();

    return events.filter(event =>
        event.title.toLowerCase().includes(value) ||
        event.category.toLowerCase().includes(value)
    );
}

searchInput.addEventListener("input", function() {
    renderEvents(getFilteredEvents());
});

function saveToLocalStorage() {
    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );
}

function loadEvents() {
    const storedEvents = localStorage.getItem("events");

    if (storedEvents) {
        events = JSON.parse(storedEvents);
    }

    renderEvents();
}

loadEvents();
