import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
import type { ManifestV3Export } from "@crxjs/vite-plugin";
const { version } = packageJson;

const target = process.env.BUILD_TARGET;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);
let json:ManifestV3Export = {
  manifest_version: 3,
  name: "lingo link",
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  icons: {
    128: "src/assets/icon.png",
  },
  action: {
    default_icon: "src/assets/icon.png",
    default_popup: "src/pages/popup/index.html",
  },
  permissions: [
    "activeTab",
    "identity",
    "storage",
    "contextMenus",
    "identity.email",
  ],
  content_scripts: [
    {
      js: ["src/contentScript/index.tsx"],
      matches: ["*://*/*"],
    },
  ],
  "options_page": "src/pages/options/index.html",
  background: {
    service_worker: "src/background.ts",
    type:"module"
  },
  "host_permissions": [
    "https://www.youdao.com/*",
    "https://dict.youdao.com/*"
  ],
}
if (target === 'chrome') {
  json = {...json, ...{key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApXvVjpN4kxyWPCZuhsoHZYavMOI+U5w6FHXITdHUuF5UKzlAJr0Lqu5ZY5+b6U+Y19ZLh9SDfhFi4fk5PtF3I8cQbUI8p2eXxwUio7IgxWJQgruQLwILO08LvLTa55BinA/Sgstl6zbYTAeFLthd1JJyz5FDN26NwH6CcbqEY7AC2Vr9/VtwH4buz92qetjuR5MpfrzNUN0QtSlKnXPJ8wasCGeWDcerynYw/OEVXwbgiENfK8+K9hHKnsZLK+U4Y4yrNEZPOfMBSe+Q1o2+eof2DQFxsDxy9ohyk3P1/oyP3vmhD2xxuJOtsS9hp31lDm+2nlreCC3w5IKsUZABDQIDAQAB",
  oauth2: {
    client_id:
      "33611715893-c00c0ofv209ophmc2tf113t3t6luslkt.apps.googleusercontent.com",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  }}}
}
export default defineManifest(async () => (json));
