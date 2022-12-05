# RoutingJS: Valhalla

Promise-based web client for the [Valhalla Open Source Routing Engine](https://github.com/valhalla/valhalla).

## Example

```js
import { Valhalla } from "@routingjs/valhalla"

const v = new Valhalla() // URL defaults to http://valhalla1.openstreetmap.de
v.directions(
    [
        [8.512516, 47.380742],
        [8.557835, 47.359467],
    ],
    "auto"
).then((d) => {
    // do stuff with the directions response
    d.directions.forEach((direction) => {
        console.log(direction.feature)
    })
})
```

## Installation

```
npm install @routingjs/valhalla
```

---

This package is part of the [RoutingJS project](https://github.com/gis-ops/routingjs), which aims to provide consistent access to various vehicle routing APIs.
