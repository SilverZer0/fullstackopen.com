# opening /exampleapp/spa

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types into input & clicks on Save button
    Note right of browser: js appends the new note to local notes & redraws all notes
    browser->>+server: POST exampleapp/new_notes_spa with payload
    Note left of server: Server appends new note to notes
    server-->>-browser: 201 Created indicating success
```
