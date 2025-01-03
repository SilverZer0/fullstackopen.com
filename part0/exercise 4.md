# Creating a new note

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types into input & clicks on Save button
    browser->>server: POST exampleapp/new_notes with payload
    Note left of server: Server appends new note to notes
    server-->>browser: 302 Redirect to /exampleapp/notes

    Note right of browser: (Re-)loading of exampleapp/notes as in graph.md

    browser->>server: GET exampleapp/notes
    server-->>browser: HTML document

    Note right of browser: The browser parses the html file. It finds and fetches the css and js file

    browser->>server: GET exampleapp/main.css
    server-->>browser: the css file

    browser->>server: GET exampleapp/main.js
    server-->>browser: the js file

    Note right of browser: The browser starts executing the js-code that fetches the JSON from the server

    browser->>server: GET exampleapp/data.json
    server-->>browser: the notes in json format

    Note right of browser: The browser executes the callback function that renders the notes
```