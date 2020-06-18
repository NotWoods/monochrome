<img src="favicon/favicon_196.png" width="128" height="128" alt="">

# Monochrome.fyi

_Preview monochrome icons in the browser!_

<!-- ![Demo usage](.github/monochrome-demo.gif) -->

---

[Monochrome icons](https://www.w3.org/TR/appmanifest/#purpose-member) allow web
developers to specify a single color icon that will be filled in by the
user-agent to match other icons on the device. On Android, this lets developers
customize notifications and other areas where their icon appears with no color.

It's important to test monochrome icons to ensure your icon appears how you
expect when it is displayed without any color. Upload a monochrome icon or drag
and drop it into [Monochrome.fyi](https://monochrome.fyi), then preview how it
will appear on different devices.

## Developing

Install dependencies:

```shell
npm install
```

Once the modules are installed, just run a web server. Thanks to
[Snowpack](https://www.snowpack.dev/), no build step is needed to test the
program.

To generate the Service Worker, run `npm run sw`.

## Licensing

This project is available under the MIT License.
