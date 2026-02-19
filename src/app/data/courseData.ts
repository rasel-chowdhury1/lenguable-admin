// Types
export interface Lesson {
    id: string;
    title: string;
    videoId: string;
    duration: string;
    description: string;
}

export interface Reference {
    title: string;
    url: string;
}

export interface Module {
    id: number;
    title: string;
    duration: string;
    description?: string;
    references?: Reference[];
    lessons: Lesson[];
}

export const courseModules: Module[] = [
    {
        id: 0,
        title: "Module 0 - Introduction to course",
        duration: "07:12:17 hours",
        description: "Welcome to the React course! This module introduces you to the fundamentals of React and sets up your development environment.",
        references: [
            { title: "React Official Documentation", url: "https://react.dev" },
            { title: "Create React App", url: "https://create-react-app.dev" },
            { title: "Vite Documentation", url: "https://vitejs.dev" }
        ],
        lessons: [
            {
                id: "0-1",
                title: "0.1 Reactive Accelerator - Course intro",
                videoId: "SqcY0GlETPk",
                duration: "11:35",
                description: "রিয়্যাক্ট জে.এস এবং নেক্সট জে.এস জনপ্রিয় কোর্স প্যাক ৩ - React Tutorial for Beginners"
            },
            {
                id: "0-2",
                title: "0.2 What is React?",
                videoId: "N3AkSS5hXMA",
                duration: "8:12",
                description: "Understanding React fundamentals and why it's popular"
            }
        ]
    },
    {
        id: 1,
        title: "Module 1 - Getting started with React: Describing the UI",
        duration: "07:53:55 hours",
        description: "Learn how to build user interfaces with React components. Master JSX syntax and understand how to create reusable components.",
        references: [
            { title: "React Components Guide", url: "https://react.dev/learn/your-first-component" },
            { title: "JSX in Depth", url: "https://react.dev/learn/writing-markup-with-jsx" },
            { title: "Component Props", url: "https://react.dev/learn/passing-props-to-a-component" }
        ],
        lessons: [
            {
                id: "1-1",
                title: "1.1 Your First Component",
                videoId: "RGKi6LSPDLU",
                duration: "12:25",
                description: "Learn how to create your first React component"
            },
            {
                id: "1-2",
                title: "1.2 JSX Basics",
                videoId: "7fPXI_MnBOY",
                duration: "15:30",
                description: "Understanding JSX syntax and how to use it"
            }
        ]
    },
    {
        id: 2,
        title: "Module 2 - Going Deep into React : Adding Interactivity",
        duration: "06:20:06 hours",
        description: "Make your React applications interactive by handling events and managing component state effectively.",
        references: [
            { title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" },
            { title: "State: A Component's Memory", url: "https://react.dev/learn/state-a-components-memory" },
            { title: "Render and Commit", url: "https://react.dev/learn/render-and-commit" }
        ],
        lessons: [
            {
                id: "2-1",
                title: "2.1 Responding to Events",
                videoId: "QFaFIcGhPoM",
                duration: "10:45",
                description: "Learn how to handle user events in React"
            },
            {
                id: "2-2",
                title: "2.2 State: A Component's Memory",
                videoId: "O6P86uwfdR0",
                duration: "18:20",
                description: "Understanding useState and component state"
            }
        ]
    },
    {
        id: 3,
        title: "Module 3 - React State Management Deep Dive",
        duration: "10:38:05 hours",
        description: "Master React Hooks including useState, useEffect, and learn advanced state management patterns.",
        references: [
            { title: "useState Hook", url: "https://react.dev/reference/react/useState" },
            { title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect" },
            { title: "Rules of Hooks", url: "https://react.dev/reference/rules/rules-of-hooks" }
        ],
        lessons: [
            {
                id: "3-1",
                title: "3.1 useState Hook",
                videoId: "4pO-HcG2igk",
                duration: "14:15",
                description: "Deep dive into useState hook"
            },
            {
                id: "3-2",
                title: "3.2 useEffect Hook",
                videoId: "0ZJgIjIuY7U",
                duration: "16:40",
                description: "Understanding useEffect and side effects"
            }
        ]
    },
    {
        id: 4,
        title: "Module 4 - Part 1 - Advanced React: Escape Hatches",
        duration: "06:28:06 hours",
        description: "Learn about refs, DOM manipulation, and when to use escape hatches in React applications.",
        references: [
            { title: "useRef Hook", url: "https://react.dev/reference/react/useRef" },
            { title: "Manipulating the DOM", url: "https://react.dev/learn/manipulating-the-dom-with-refs" },
            { title: "Escape Hatches", url: "https://react.dev/learn/escape-hatches" }
        ],
        lessons: [
            {
                id: "4-1",
                title: "4.1 useRef Hook",
                videoId: "t2ypzz6gJm0",
                duration: "11:30",
                description: "Learn about useRef and DOM manipulation"
            }
        ]
    },
    {
        id: 5,
        title: "Module 4 - Part 2 - Advanced React: Escape Hatches",
        duration: "09:25:01 hours",
        description: "Create custom React hooks to reuse stateful logic across your components.",
        references: [
            { title: "Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
            { title: "Custom Hooks Examples", url: "https://usehooks.com" },
            { title: "React Hook Recipes", url: "https://react.dev/reference/react" }
        ],
        lessons: [
            {
                id: "5-1",
                title: "4.2 Custom Hooks",
                videoId: "6ThXsUwLWvc",
                duration: "13:25",
                description: "Creating and using custom React hooks"
            }
        ]
    },
    {
        id: 6,
        title: "Module 5 - Part-1 - React Beyond Basics: Ecosystem & Use Cases",
        duration: "11:11:34 hours",
        description: "Explore the React ecosystem including routing, state management libraries, and real-world use cases.",
        references: [
            { title: "React Router", url: "https://reactrouter.com" },
            { title: "Redux Toolkit", url: "https://redux-toolkit.js.org" },
            { title: "React Query", url: "https://tanstack.com/query" }
        ],
        lessons: [
            {
                id: "6-1",
                title: "5.1 React Router",
                videoId: "Ul3y1LXxzdU",
                duration: "20:15",
                description: "Introduction to React Router for navigation"
            }
        ]
    },
    {
        id: 7,
        title: "Module 5 - Part-1 - React Beyond Basics: Ecosystem & Use Cases",
        duration: "11:11:34 hours",
        description: "Explore the React ecosystem including routing, state management libraries, and real-world use cases.",
        references: [
            { title: "React Router", url: "https://reactrouter.com" },
            { title: "Redux Toolkit", url: "https://redux-toolkit.js.org" },
            { title: "React Query", url: "https://tanstack.com/query" }
        ],
        lessons: [
            {
                id: "6-1",
                title: "5.1 React Router",
                videoId: "Ul3y1LXxzdU",
                duration: "20:15",
                description: "Introduction to React Router for navigation"
            }
        ]
    },
    {
        id: 8,
        title: "Module 5 - Part-1 - React Beyond Basics: Ecosystem & Use Cases",
        duration: "11:11:34 hours",
        description: "Explore the React ecosystem including routing, state management libraries, and real-world use cases.",
        references: [
            { title: "React Router", url: "https://reactrouter.com" },
            { title: "Redux Toolkit", url: "https://redux-toolkit.js.org" },
            { title: "React Query", url: "https://tanstack.com/query" }
        ],
        lessons: [
            {
                id: "6-1",
                title: "5.1 React Router",
                videoId: "Ul3y1LXxzdU",
                duration: "20:15",
                description: "Introduction to React Router for navigation"
            }
        ]
    },
    {
        id: 9,
        title: "Module 5 - Part-1 - React Beyond Basics: Ecosystem & Use Cases",
        duration: "11:11:34 hours",
        description: "Explore the React ecosystem including routing, state management libraries, and real-world use cases.",
        references: [
            { title: "React Router", url: "https://reactrouter.com" },
            { title: "Redux Toolkit", url: "https://redux-toolkit.js.org" },
            { title: "React Query", url: "https://tanstack.com/query" }
        ],
        lessons: [
            {
                id: "6-1",
                title: "5.1 React Router",
                videoId: "Ul3y1LXxzdU",
                duration: "20:15",
                description: "Introduction to React Router for navigation"
            }
        ]
    },
    {
        id: 10,
        title: "Module 5 - Part-1 - React Beyond Basics: Ecosystem & Use Cases",
        duration: "11:11:34 hours",
        description: "Explore the React ecosystem including routing, state management libraries, and real-world use cases.",
        references: [
            { title: "React Router", url: "https://reactrouter.com" },
            { title: "Redux Toolkit", url: "https://redux-toolkit.js.org" },
            { title: "React Query", url: "https://tanstack.com/query" }
        ],
        lessons: [
            {
                id: "6-1",
                title: "5.1 React Router",
                videoId: "Ul3y1LXxzdU",
                duration: "20:15",
                description: "Introduction to React Router for navigation"
            }
        ]
    },
];