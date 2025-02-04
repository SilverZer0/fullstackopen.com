# Readme

The hosted version can be found [here](https://phonebook-wandering-glade-9372.fly.dev/)

The local version only works if this backend is used but not when json-server is used
(the paths don't match /api/persons vs /persons).

I added a rewrite to the proxy in the frontends (part2/phonebook) vite.config.js that allows json-server to work but it doesn't work with this as backend so it's commented out.
