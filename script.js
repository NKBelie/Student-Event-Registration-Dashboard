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

        function renderEvents(eventList = events) {

        eventContainer.innerHTML = "";

        eventList.forEach(event => {

            const remaining = event.seats - event.registered;

            const card = document.createElement("div");

            card.className =
            "bg-white p-6 rounded-xl shadow";

            card.innerHTML = `
            <h2 class="text-2xl font-bold mb-2">
                ${event.title}
            </h2>

            <p class="text-gray-600 mb-2">
                ${event.category}
            </p>

            <p>Total Seats: ${event.seats}</p>
            <p>Registered: ${event.registered}</p>
            <p>Remaining: ${remaining}</p>
            <div class="flex flex-wrap gap-2 mt-4">

                <button
                onclick="registerEvent(${event.id})"
                class="bg-green-500 text-white px-4 py-2 rounded"
                >
                Register
                </button>

                <button
                onclick="cancelRegistration(${event.id})"
                class="bg-gray-500 text-white px-4 py-2 rounded"
                >
                Cancel
                </button>

                <button
                onclick="cancelEvent(${event.id})"
                class="bg-red-500 text-white px-4 py-2 rounded"
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

        document.getElementById("totalEvents").textContent =
            eventList.length;

        const registeredStudents = eventList.reduce(
            (total, event) => total + event.registered,
            0
        );

        document.getElementById("totalRegistered").textContent =
            registeredStudents;

        const availableSeats = eventList.reduce(
            (total, event) =>
            total + (event.seats - event.registered),
            0
        );

        document.getElementById("totalSeats").textContent =
            availableSeats;
    }
    function registerEvent(id) {

        const event = events.find(e => e.id === id);

        if (event.registered < event.seats) {

            event.registered++;

            saveToLocalStorage();

            renderEvents(getFilteredEvents());
            alert("Registration successful! " + event.title + " has " + (event.seats - event.registered) + " seats left.");

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
            alert("Registration cancelled! " + event.title + " has " + (event.seats - event.registered) + " seats left.");

        }
    }

    function cancelEvent(id) {

        const event = events.find(e => e.id === id);

        if (!event) {

            return;
        }

        const shouldCancel = confirm(
                "Cancel " + event.title + "? This will remove the event from the dashboard."
            );

            if (!shouldCancel) {

                return;
            }

            events = events.filter(e => e.id !== id);

            saveToLocalStorage();

            renderEvents(getFilteredEvents());
    }
    const form = document.getElementById("eventForm");

        form.addEventListener("submit", function(e) {

        e.preventDefault();

        const title =
            document.getElementById("title").value.trim();

        const category =
            document.getElementById("category").value.trim();

        const seats =
            Number(document.getElementById("seats").value);

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

        const searchInput =
            document.getElementById("searchInput");

        function getFilteredEvents() {

            const value =
                searchInput.value.toLowerCase();

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

            const storedEvents =
                localStorage.getItem("events");

            if (storedEvents) {

                events = JSON.parse(storedEvents);

            }

            renderEvents();
        }

    loadEvents();
