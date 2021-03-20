export const categoryData = [
    {
        name: "Projects",
        dateAdded: new Date("2021-02-22"),
        activities: [
            {
                name: "Voxel Game",
                dateAdded: new Date("2021-02-22")
            }
        ]
    },
    {
        name: "Work",
        dateAdded: new Date("2021-02-22"),
        activities: []
    },
    {
        name: "University",
        dateAdded: new Date("2021-02-22"),
        activities: [
            {
                name: "COMP4702",
                dateAdded: new Date("2021-02-22")
            }
        ]
    },
];

export const activityData = {
    "Projects": {
        "Voxel Game": [
            {
                timeStart: new Date("2021-02-22 11:37:00"),
                timeEnd: new Date("2021-02-22 12:45:00"),
            },
            {
                timeStart: new Date("2021-02-22 13:05:00"),
                timeEnd: new Date("2021-02-22 14:00:00"),
            },
            {
                timeStart: new Date("2021-02-22 14:05:00"),
                timeEnd: new Date("2021-02-22 15:54:00"),
            }
        ]
    },
    "University": {
        "COMP4702": [
            {
                timeStart: new Date("2021-02-22 10:04:00"),
                timeEnd: new Date("2021-02-22 10:57:00"),
            },
        ]
    }
};