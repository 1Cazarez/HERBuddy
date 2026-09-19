// Shared in-memory app state. When the API (TigerData/Postgres + Auth0) is
// configured, chat.js / walks.js / errands.js / profile.js sync pieces of
// this to and from it. When it isn't, the app keeps running purely off
// this local mock data.
export const appState = {
    isLoggedIn: false,
    userId: null,
    selectedLoginAvatar: '👩🏽',
    user: {
        name: "Alex Rivera",
        email: "alex.r@univ.edu",
        campus: "Main Quad Campus",
        contact: "Sarah Rivera (Mom) - 555-0192",
        stepGoal: 10000,
        avatar: "🦊",
        steps: 6420,
        activeMinutes: 38,
        weeklyDistance: 14.8,
        completedErrands: 9,
        year: "",
        major: "",
        interests: [],
        clubs: [],
        events: [],
        zone: "Library Area",
        walkingStyle: "Social"
    },
    activeWalk: null,
    timerInterval: null,
    secondsElapsed: 1394,
    walks: [
        {
            id: 1,
            title: "Student Center → Library",
            from: "Student Center",
            to: "Library",
            time: "3:30 PM",
            distance: "1.2 mi",
            buddies: 3,
            nightSafe: true,
            joined: false,
            avatars: ["👩🏼", "👩🏻", "👩🏾"]
        },
        {
            id: 2,
            title: "North Campus Quad Loop",
            from: "Quad Plaza",
            to: "Science Hall",
            time: "4:15 PM",
            distance: "0.8 mi",
            buddies: 2,
            nightSafe: true,
            joined: false,
            avatars: ["👩‍🦱", "👩‍🦰"]
        },
        {
            id: 3,
            title: "West Dorm Stroll",
            from: "West Housing",
            to: "Dining Hall",
            time: "5:00 PM",
            distance: "1.5 mi",
            buddies: 4,
            nightSafe: false,
            joined: false,
            avatars: ["👩🏽", "👩🏼", "👩🏻", "👩🏾"]
        }
    ],
    errands: [
        {
            id: 1,
            title: "Library Printouts Dropoff",
            from: "Student Center",
            to: "Library",
            requesterEmoji: "👩🏼",
            requester: "Campus Buddy",
            reward: "+50 pts",
            status: "Pending"
        },
        {
            id: 2,
            title: "Grab Iced Coffee from Cafe",
            from: "Student Center",
            to: "Science Hall",
            requesterEmoji: "👩‍🦱",
            requester: "Campus Buddy",
            reward: "+40 pts",
            status: "Pending"
        }
    ],
    activeFilter: 'all'
};
